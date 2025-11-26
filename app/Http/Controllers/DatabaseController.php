<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class DatabaseController extends Controller
{
    public function index()
    {
        $backupFiles = $this->getBackupFiles();

        // Hitung total data dalam database
        $totalRecords = 0;
        $dbSize = 0;
        $dbName = config('database.connections.pgsql.database');

        try {
            // Hitung total record
            $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
            foreach ($tables as $table) {
                $totalRecords += DB::table($table->table_name)->count();
            }

            // Hitung ukuran database
            $dbSizeResult = DB::selectOne("SELECT pg_database_size('$dbName') as size");
            $dbSize = $dbSizeResult->size;
        } catch (Exception $e) {
            Log::error('Error counting database records:', ['error' => $e->getMessage()]);
        }

        // Hitung ukuran total backup
        $totalBackupSize = 0;
        foreach ($backupFiles as $file) {
            $totalBackupSize += filesize($file['path']);
        }

        // Hitung persentase kapasitas (contoh: asumsikan max 1GB)
        $maxStorage = 1073741824; // 1GB in bytes
        $storagePercentage = round(($totalBackupSize / $maxStorage) * 100, 2);

        return view('backup.backup_data', [
            'backupFiles' => $backupFiles,
            'totalRecords' => $totalRecords,
            'dbSize' => $this->formatBytes($dbSize),
            'totalBackupSize' => $this->formatBytes($totalBackupSize),
            'storagePercentage' => $storagePercentage,
            'lastBackupDate' => count($backupFiles) > 0 ? $backupFiles[0]['created_at'] : '-'
        ]);
    }

    /**
     * Validasi password user sebelum reset database
     */
    public function validatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string'
        ]);

        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password yang Anda masukkan salah'
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Password valid'
            ]);
        } catch (Exception $e) {
            Log::error('Password validation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat validasi password'
            ], 500);
        }
    }

    /**
     * Reset database - menghapus semua data KECUALI tabel users
     */
    public function reset(Request $request)
    {
        try {
            Log::info('Starting database reset process (preserve users) - User: ' . Auth::id());

            // Mulai transaksi database
            DB::beginTransaction();

            // Dapatkan semua tabel dalam database
            $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");

            // Disable foreign key checks untuk PostgreSQL
            DB::statement('SET session_replication_role = replica;');

            // Daftar tabel yang akan di-skip (tidak direset)
            $excludedTables = ['users', 'migrations'];

            // Hapus data dari semua tabel kecuali yang dikecualikan
            foreach ($tables as $table) {
                $tableName = $table->table_name;

                // Skip tabel yang dikecualikan
                if (in_array($tableName, $excludedTables)) {
                    Log::info("Skipped table: {$tableName}");
                    continue;
                }

                try {
                    // Truncate table dengan restart identity untuk reset auto increment
                    DB::statement("TRUNCATE TABLE \"{$tableName}\" RESTART IDENTITY CASCADE");
                    Log::info("Truncated table: {$tableName}");
                } catch (Exception $e) {
                    Log::warning("Failed to truncate table {$tableName}: " . $e->getMessage());
                    // Jika truncate gagal, coba delete
                    try {
                        DB::table($tableName)->delete();
                        Log::info("Deleted all records from table: {$tableName}");
                    } catch (Exception $e2) {
                        Log::error("Failed to delete from table {$tableName}: " . $e2->getMessage());
                        // Lewati tabel yang bermasalah, lanjut ke tabel berikutnya
                        continue;
                    }
                }
            }

            // Re-enable foreign key checks
            DB::statement('SET session_replication_role = DEFAULT;');

            // Commit transaksi SEBELUM reset sequences (agar sequences bisa dihandle terpisah)
            DB::commit();

            // Reset sequence untuk tabel yang penting (kecuali users) - TANPA TRANSACTION
            $this->resetSequences();

            Log::info('Database reset completed successfully (users preserved)');

            // Return response sukses - TIDAK logout user
            return response()->json([
                'success' => true,
                'message' => 'Database berhasil direset. Semua data telah dihapus kecuali data user.',
                'redirect_url' => url('/dashboard')
            ], 200);
        } catch (Exception $e) {
            // Rollback transaksi jika ada error
            DB::rollback();

            Log::error('Database reset failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Reset database gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    private function resetSequences()
    {
        // Dapatkan semua sequence yang ada
        $existingSequences = DB::select("
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    ");

        $existingSequenceNames = array_map(function ($seq) {
            return $seq->sequence_name;
        }, $existingSequences);

        Log::info('Existing sequences: ' . implode(', ', $existingSequenceNames));

        // Reset SEMUA sequences yang ditemukan
        foreach ($existingSequenceNames as $sequence) {
            try {
                // Dapatkan nama tabel dari sequence
                $tableName = str_replace('_id_seq', '', $sequence);

                // Reset sequence berdasarkan MAX(id) dari tabel
                $maxId = DB::table($tableName)->max('id') ?? 0;
                $newStart = $maxId + 1;

                DB::statement("SELECT setval('$sequence', $newStart, false);");
                Log::info("Reset sequence: {$sequence} to {$newStart}");
            } catch (Exception $e) {
                Log::warning("Failed to reset sequence {$sequence}: " . $e->getMessage());
                continue;
            }
        }
    }

    /**
     * Method debug untuk melihat tabel yang ada
     */
    public function debugTables()
    {
        try {
            $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");

            return response()->json([
                'success' => true,
                'tables' => $tables,
                'count' => count($tables)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Melakukan backup database PostgreSQL
     */
    public function backup(Request $request)
    {
        $request->validate([
            'backup_name' => 'nullable|string|max:255|regex:/^[a-zA-Z0-9_-]+$/'
        ]);

        try {
            $dbConfig = Config::get('database.connections.pgsql');

            // Membuat nama file backup
            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $backupName = $request->backup_name ? $request->backup_name . '_' . $timestamp : 'backup_' . $timestamp;
            $fileName = $backupName . '.sql';

            // Path untuk menyimpan backup
            $backupPath = storage_path('app/backups');

            // Membuat direktori backup jika belum ada
            if (!file_exists($backupPath)) {
                mkdir($backupPath, 0755, true);
            }

            $fullPath = $backupPath . '/' . $fileName;

            // Gunakan command dari spatie/laravel-backup
            $command = sprintf(
                '"%spg_dump" -h %s -p %s -U %s -d %s -f "%s" --no-owner --no-privileges',
                $dbConfig['dump']['dump_binary_path'] ?? '', // Gunakan path dari config
                escapeshellarg($dbConfig['host']),
                escapeshellarg($dbConfig['port']),
                escapeshellarg($dbConfig['username']),
                escapeshellarg($dbConfig['database']),
                $fullPath
            );

            // Set environment variable untuk password
            putenv("PGPASSWORD=" . $dbConfig['password']);

            // Jalankan perintah backup
            $output = [];
            $returnVar = 0;
            exec($command . ' 2>&1', $output, $returnVar);

            // Hapus environment variable setelah digunakan
            putenv("PGPASSWORD");

            Log::info('Backup Command:', ['command' => $command]);
            Log::info('Backup Output:', $output);
            Log::info('Backup Return Code:', ['returnVar' => $returnVar]);

            // Periksa hasil backup
            $fileExists = file_exists($fullPath);
            $fileSize = $fileExists ? filesize($fullPath) : 0;

            if ($returnVar !== 0 || !$fileExists || $fileSize == 0) {
                $errorMsg = $returnVar !== 0 ? implode("\n", $output) : (!$fileExists ? 'File backup tidak terbuat' : 'File backup kosong');

                if ($fileExists && $fileSize == 0) {
                    unlink($fullPath);
                }

                Log::error('Backup Failed:', ['error' => $errorMsg]);
                return back()->with('error', 'Backup gagal: ' . $errorMsg);
            }

            return back()->with('success', 'Backup database berhasil dibuat: ' . $fileName);
        } catch (Exception $e) {
            Log::error('Backup Exception:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Backup gagal: ' . $e->getMessage());
        }
    }

    /**
     * Melakukan restore database PostgreSQL dengan progress tracking
     */
    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimetypes:text/plain,application/sql|max:102400'
        ]);

        try {
            $dbConfig = Config::get('database.connections.pgsql');

            // Dapatkan path psql dari config atau gunakan default
            $psqlPath = $dbConfig['dump']['dump_binary_path'] ?? '';

            // Step 1: Validasi File Backup
            $file = $request->file('backup_file');
            $tempPath = $file->getRealPath();

            // Step 2: Persiapan Database
            // Test koneksi database
            DB::connection()->getPdo();

            // Step 3: Restore Data
            putenv("PGPASSWORD=" . $dbConfig['password']);

            $command = sprintf(
                '"%spsql" -h %s -p %s -U %s -d %s -f "%s"',
                $psqlPath, // Gunakan path dari config
                escapeshellarg($dbConfig['host']),
                escapeshellarg($dbConfig['port']),
                escapeshellarg($dbConfig['username']),
                escapeshellarg($dbConfig['database']),
                escapeshellarg($tempPath)
            );

            $output = [];
            $returnVar = 0;
            exec($command . ' 2>&1', $output, $returnVar);

            putenv("PGPASSWORD");

            if ($returnVar !== 0) {
                throw new Exception('Restore gagal: ' . implode("\n", $output));
            }

            // Reset sequence pada semua tabel yang memiliki kolom id auto-increment
            $tables = ['bku_uraian_details', 'tanda_terimas', 'buku_kas_umums', 'penerimaan_danas', 'rekening_belanjas', 'kode_kegiatans', 'penganggarans', 'sekolahs', 'kwitansis'];
            foreach ($tables as $table) {
                $sequence = $table . '_id_seq';
                DB::statement("SELECT setval('$sequence', (SELECT COALESCE(MAX(id), 1) FROM $table));");
            }

            return back()->with('success', 'Database berhasil di-restore');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Get restore progress status
     */
    public function getRestoreProgress(Request $request)
    {
        $restoreId = $request->get('restore_id');

        if (!$restoreId) {
            return response()->json(['error' => 'Restore ID required'], 400);
        }

        // Ambil log progress dari storage atau cache
        $progressFile = storage_path('app/restore_progress/' . $restoreId . '.json');

        if (!file_exists($progressFile)) {
            return response()->json(['error' => 'Progress not found'], 404);
        }

        $progress = json_decode(file_get_contents($progressFile), true);

        return response()->json($progress);
    }

    /**
     * Log restore step progress
     */
    private function logRestoreStep($restoreId, $step, $title, $description, $status = 'processing')
    {
        $progressDir = storage_path('app/restore_progress');
        if (!file_exists($progressDir)) {
            mkdir($progressDir, 0755, true);
        }

        $progressFile = $progressDir . '/' . $restoreId . '.json';

        $progress = [];
        if (file_exists($progressFile)) {
            $progress = json_decode(file_get_contents($progressFile), true) ?: [];
        }

        $progress['restore_id'] = $restoreId;
        $progress['current_step'] = $step;
        $progress['steps'][$step] = [
            'step' => $step,
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'timestamp' => now()->toISOString()
        ];

        // Calculate overall progress
        $completedSteps = 0;
        $totalSteps = 5;

        foreach ($progress['steps'] as $stepData) {
            if ($stepData['status'] === 'completed') {
                $completedSteps++;
            }
        }

        $progress['overall_progress'] = round(($completedSteps / $totalSteps) * 100);
        $progress['last_updated'] = now()->toISOString();

        file_put_contents($progressFile, json_encode($progress, JSON_PRETTY_PRINT));

        Log::info('Restore step logged', [
            'restore_id' => $restoreId,
            'step' => $step,
            'title' => $title,
            'status' => $status
        ]);
    }

    /**
     * Validate if file is a valid SQL file
     */
    private function isValidSQLFile($content)
    {
        // Check for common SQL keywords
        $sqlKeywords = ['CREATE', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'DROP', 'ALTER', '--', '/*'];

        $content = strtoupper($content);

        foreach ($sqlKeywords as $keyword) {
            if (strpos($content, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Mendownload file backup
     */
    public function download(Request $request)
    {
        $fileName = $request->get('file');
        $backupPath = storage_path('app/backups/' . $fileName);

        if (!file_exists($backupPath)) {
            return back()->with('error', 'File backup tidak ditemukan');
        }

        return Response::download($backupPath, $fileName, [
            'Content-Type' => 'application/sql',
        ]);
    }

    /**
     * Menghapus file backup
     */
    public function delete(Request $request)
    {
        $fileName = $request->get('file');
        $backupPath = storage_path('app/backups/' . $fileName);

        if (!file_exists($backupPath)) {
            return back()->with('error', 'File backup tidak ditemukan');
        }

        if (unlink($backupPath)) {
            return back()->with('success', 'File backup berhasil dihapus');
        } else {
            return back()->with('error', 'Gagal menghapus file backup');
        }
    }

    /**
     * Mendapatkan daftar file backup
     */
    private function getBackupFiles()
    {
        $backupPath = storage_path('app/backups');
        $files = [];

        if (is_dir($backupPath)) {
            $backupFiles = glob($backupPath . '/*.sql');

            foreach ($backupFiles as $file) {
                $fileName = basename($file);
                $files[] = [
                    'name' => $fileName,
                    'size' => $this->formatBytes(filesize($file)),
                    'created_at' => date('d/m/Y H:i:s', filemtime($file)),
                    'path' => $file
                ];
            }

            // Mengurutkan berdasarkan tanggal terbaru
            usort($files, function ($a, $b) {
                return filemtime($b['path']) - filemtime($a['path']);
            });
        }

        return $files;
    }

    /**
     * Format ukuran file dalam bytes ke format yang mudah dibaca
     */
    private function formatBytes($size, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }

        return round($size, $precision) . ' ' . $units[$i];
    }
}