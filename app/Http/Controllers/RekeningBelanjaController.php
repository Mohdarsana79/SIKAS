<?php

namespace App\Http\Controllers;

use App\Imports\RekeningBelanjaImport;
use App\Models\RekeningBelanja;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class RekeningBelanjaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $rekenings = RekeningBelanja::when($search, function ($query) use ($search) {
            return $query->where('kode_rekening', 'like', '%' . $search . '%')
                ->orWhere('rincian_objek', 'like', '%' . $search . '%')
                ->orWhere('kategori', 'like', '%' . $search . '%');
        })
            ->orderBy('kode_rekening')
            ->paginate(20)
            ->onEachSide(1);

        // Jika request AJAX, kembalikan JSON
        if ($request->ajax()) {
            $view = view('referensi.partials.rekening-belanja-table', compact('rekenings'))->render();

            return response()->json([
                'success' => true,
                'html' => $view,
                'pagination' => (string) $rekenings->links('vendor.pagination.bootstrap-5')
            ]);
        }

        return view('referensi.rekening-belanja', compact('rekenings', 'search'));
    }

    /**
     * Get paginated data for AJAX requests
     */
    public function paginate(Request $request): JsonResponse
    {
        try {
            $search = $request->input('search', '');
            $page = $request->input('page', 1);

            $rekenings = RekeningBelanja::when($search, function ($query) use ($search) {
                return $query->where('kode_rekening', 'like', '%' . $search . '%')
                    ->orWhere('rincian_objek', 'like', '%' . $search . '%')
                    ->orWhere('kategori', 'like', '%' . $search . '%');
            })
                ->orderBy('kode_rekening')
                ->paginate(20, ['*'], 'page', $page)
                ->onEachSide(1);

            // Hanya render tabel rows tanpa modal edit
            $tableRowsHtml = view('referensi.partials.rekening-belanja-table-rows', compact('rekenings'))->render();

            // Info pagination
            $paginationInfoHtml = view('referensi.partials.rekening-pagination-info', compact('rekenings'))->render();

            return response()->json([
                'success' => true,
                'table_rows_html' => $tableRowsHtml,
                'pagination_info_html' => $paginationInfoHtml,
                'pagination_links' => (string) $rekenings->links('vendor.pagination.bootstrap-5'),
                'current_page' => $rekenings->currentPage(),
                'last_page' => $rekenings->lastPage(),
                'total' => $rekenings->total()
            ]);
        } catch (\Exception $e) {
            Log::error('Error in rekening pagination: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Pastikan method search sudah ada di controller
    public function search(Request $request): JsonResponse
    {
        try {
            $searchTerm = $request->get('search', '');

            if (empty($searchTerm)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kata pencarian tidak boleh kosong'
                ], 400);
            }

            $rekenings = RekeningBelanja::where(function ($query) use ($searchTerm) {
                $query->where('kode_rekening', 'ILIKE', "%{$searchTerm}%")
                    ->orWhere('rincian_objek', 'ILIKE', "%{$searchTerm}%")
                    ->orWhere('kategori', 'ILIKE', "%{$searchTerm}%");
            })
                ->orderBy('kode_rekening', 'asc')
                ->get();

            $formattedData = $rekenings->map(function ($rekening, $index) {
                return [
                    'id' => $rekening->id,
                    'index' => $index + 1,
                    'kode_rekening' => $rekening->kode_rekening,
                    'rincian_objek' => $rekening->rincian_objek,
                    'kategori' => $rekening->kategori,
                    'actions' => $this->getRekeningActionButtons($rekening)
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedData,
                'total' => $rekenings->count(),
                'search_term' => $searchTerm
            ]);
        } catch (\Exception $e) {
            Log::error('Error searching rekening belanja: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mencari data: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getRekeningActionButtons($rekening): string
    {
        return '
            <button class="btn btn-sm btn-warning btn-edit" 
                    data-id="' . $rekening->id . '" 
                    data-kode-rekening="' . $rekening->kode_rekening . '"
                    data-rincian-objek="' . $rekening->rincian_objek . '"
                    data-kategori="' . $rekening->kategori . '">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-delete" 
                    data-id="' . $rekening->id . '"
                    data-kode-rekening="' . $rekening->kode_rekening . '"
                    data-rincian-objek="' . $rekening->rincian_objek . '"
                    data-kategori="' . $rekening->kategori . '">
                <i class="bi bi-trash"></i>
            </button>
        ';
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kode_rekening' => 'required|string|max:20|unique:rekening_belanjas,kode_rekening',
            'rincian_objek' => 'required|string',
            'kategori' => 'required|string|in:Modal,Operasi',
        ], [
            'kode_rekening.required' => 'Kode rekening wajib diisi',
            'kode_rekening.unique' => 'Kode rekening sudah ada dalam database',
            'kode_rekening.max' => 'Kode rekening maksimal 20 karakter',
            'rincian_objek.required' => 'Rincian objek belanja wajib diisi',
            'kategori.required' => 'Kategori belanja modal atau operasi wajib di isi'
        ]);

        if ($validator->fails()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', 'Terjadi kesalahan!');
        }

        try {
            RekeningBelanja::create($request->all());

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Rekening Belanja berhasil ditambahkan'
                ]);
            }

            return redirect()->route('referensi.rekening-belanja.index')->with('success', 'Rekening Belanja berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error creating rekening belanja: ' . $e->getMessage());

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menambahkan data: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal menambahkan data: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RekeningBelanja $rekeningBelanja)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RekeningBelanja $rekeningBelanja)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $rekeningBelanja = RekeningBelanja::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'kode_rekening' => [
                'required',
                'string',
                'max:20',
                Rule::unique('rekening_belanjas')->ignore($rekeningBelanja->id)
            ],
            'rincian_objek' => 'required|string',
            'kategori' => 'required|string|in:Modal,Operasi'
        ], [
            'kode_rekening.required' => 'Kode rekening wajib diisi',
            'kode_rekening.unique' => 'Kode rekening sudah ada dalam database',
            'kode_rekening.max' => 'Kode rekening maksimal 20 karakter',
            'rincian_objek.required' => 'Rincian objek belanja wajib diisi',
            'kategori.required' => 'Kategori belanja modal atau operasi wajib di isi'
        ]);

        if ($validator->fails()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', 'Terjadi kesalahan!');
        }

        try {
            $rekeningBelanja->update($request->all());

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Rekening Belanja berhasil diperbarui'
                ]);
            }

            return redirect()->route('referensi.rekening-belanja.index')->with('success', 'Rekening Belanja berhasil diperbarui');
        } catch (\Exception $e) {
            Log::error('Error updating rekening belanja: ' . $e->getMessage());

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memperbarui data: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal memperbarui data: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $rekeningBelanja = RekeningBelanja::findOrFail($id);
            $rekeningBelanja->delete();

            // Kembalikan response JSON untuk AJAX
            return response()->json([
                'success' => true,
                'message' => 'Data berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting rekening belanja: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        if ($validator->fails()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi file gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            return redirect()->back()
                ->with('error', 'File tidak valid: ' . implode(', ', $validator->errors()->all()));
        }

        try {
            $import = new RekeningBelanjaImport();
            Excel::import($import, $request->file('file'));

            $successCount = $import->getRowCount();
            $duplicateCount = count($import->getDuplicates());
            $errorCount = count($import->failures());

            // Jika request AJAX
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'imported_count' => $successCount,
                    'duplicate_count' => $duplicateCount,
                    'error_count' => $errorCount,
                    'message' => "Berhasil mengimport {$successCount} data"
                ]);
            }

            $messages = [];

            if ($successCount > 0) {
                $messages['success'] = "Berhasil mengimport {$successCount} data";
            }

            if ($duplicateCount > 0) {
                $duplicateDetails = array_map(function ($item) {
                    return "Baris {$item['row']}: Kode {$item['kode_rekening']} ({$item['rincian_objek']} {$item['kategori']})";
                }, $import->getDuplicates());

                $messages['warning'] = "{$duplicateCount} data tidak diimport karena sudah ada di database";
                $messages['duplicate_details'] = $duplicateDetails;
            }

            if ($errorCount > 0) {
                $errorMessages = [];
                /** @var \Maatwebsite\Excel\Validators\Failure $failure */
                foreach ($import->failures() as $failure) {
                    $errorMessages[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
                }
                $messages['import_errors'] = $errorMessages;
                $messages['error'] = "{$errorCount} data tidak valid";
            }

            return redirect()->route('referensi.rekening-belanja.index')
                ->with($messages);
        } catch (\Exception $e) {
            Log::error('Error importing rekening belanja: ' . $e->getMessage());

            // Jika request AJAX
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        $path = storage_path('app/public/templates/template_rekening_belanja.xlsx');

        if (file_exists($path)) {
            return response()->download($path);
        }

        return redirect()->back()
            ->with('error', 'Template tidak ditemukan');
    }
}
