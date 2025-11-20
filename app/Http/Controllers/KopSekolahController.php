<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KopSekolah;
use Illuminate\Support\Facades\Storage;

class KopSekolahController extends Controller
{
    public function index()
    {
        $kopSekolah = KopSekolah::first();
        return view('kop-sekolah.index', compact('kopSekolah'));
    }

    public function show($id)
    {
        $kopSekolah = KopSekolah::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $kopSekolah->id,
                'file_path' => asset('storage/kop_sekolah/' . $kopSekolah->file_path),
                'created_at' => $kopSekolah->created_at->format('d M Y H:i'),
                'created_at_human' => $kopSekolah->created_at->diffForHumans()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kop_sekolah' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        try {
            // Hapus file lama jika ada
            $existing = KopSekolah::first();
            if ($existing && $existing->file_path) {
                $oldFilePath = public_path('storage/kop_sekolah/' . $existing->file_path);
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }

            // Upload file baru
            $file = $request->file('kop_sekolah');
            $filename = 'kop-sekolah-' . time() . '.' . $file->getClientOriginalExtension();

            // Pastikan folder ada
            $directory = public_path('storage/kop_sekolah');
            if (!file_exists($directory)) {
                mkdir($directory, 0777, true);
            }

            // Pindahkan file
            $file->move($directory, $filename);

            // Simpan atau update data
            KopSekolah::updateOrCreate(
                ['id' => $existing ? $existing->id : null],
                ['file_path' => $filename]
            );

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Kop sekolah berhasil diupload'
                ], 200);
            }

            return redirect()->route('kop-sekolah.index')
                ->with('success', 'Kop sekolah berhasil diupload');
        } catch (\Exception $e) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengupload kop sekolah: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal mengupload kop sekolah: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $kopSekolah = KopSekolah::findOrFail($id);

        try {
            // Hapus file
            if ($kopSekolah->file_path && file_exists(public_path('storage/kop_sekolah/' . $kopSekolah->file_path))) {
                unlink(public_path('storage/kop_sekolah/' . $kopSekolah->file_path));
            }

            // Hapus record
            $kopSekolah->delete();

            if (request()->ajax() || request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Kop sekolah berhasil dihapus'
                ], 200);
            }

            return redirect()->route('kop-sekolah.index')
                ->with('success', 'Kop sekolah berhasil dihapus');
        } catch (\Exception $e) {
            if (request()->ajax() || request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghapus kop sekolah: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal menghapus kop sekolah: ' . $e->getMessage());
        }
    }
}
