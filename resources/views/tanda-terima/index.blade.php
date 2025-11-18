@extends('layouts.app')
@include('layouts.navbar')
@include('layouts.sidebar')
@section('content')
<style>
    /* Menggunakan font Inter dari CDN */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

    body {
        font-family: 'Inter', sans-serif;
        background-color: #f1f5f9;
    }

    .container-main {
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .card-shadow {
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
    }

    .table thead {
        background-color: transparent;
    }

    .table tbody tr:hover {
        background-color: #f8f9fa;
    }

    .btn-select {
        background-color: #f0f4f8;
        color: #495057;
        border-radius: 0.5rem;
        font-size: 0.8rem;
        font-weight: 500;
        padding: 0.2rem 0.5rem;
        border: 1px solid #e2e8f0;
    }

    .process-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: 0.5rem;
        color: #475569;
        background-color: #f0f4f8;
        font-weight: 600;
    }

    .header-title {
        font-size: 1.8rem;
        font-weight: 700;
    }

    .summary-card {
        background-color: #fff;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        padding: 25px;
        height: 100%;
        box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.03);
    }

    .total-number {
        font-size: 2.2rem;
        font-weight: 700;
        color: #212529;
        line-height: 1;
    }

    .text-green-success-custom {
        color: #16a34a;
    }

    .icon-lg {
        font-size: 3rem;
        color: #cbd5e1;
    }

    .search-input-group .form-control {
        border-right: 0;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        padding-left: 2.5rem;
    }

    .search-input-group .input-group-text {
        border-radius: 0.5rem;
        border-left: 0;
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background-color: transparent;
        border: none;
        z-index: 10;
    }

    .search-input-group {
        position: relative;
    }

    .custom-action-button {
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .table-action-btn {
        background-color: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        color: #64748b;
        padding: 0.3rem 0.5rem;
    }

    .table-action-btn:hover {
        background-color: #f1f5f9;
    }

    .table-min-width {
        min-width: 800px;
    }

    .badge-code {
        background-color: #e0f2fe;
        color: #0369a1;
        font-weight: 600;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
    }

    .loading-pulse {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% {
            opacity: 1;
        }

        50% {
            opacity: 0.5;
        }

        100% {
            opacity: 1;
        }
    }

    /* Responsive */
    @media (max-width: 768px) {
        .header-title {
            font-size: 1.5rem;
        }

        .summary-card {
            padding: 15px;
        }

        .total-number {
            font-size: 1.8rem;
        }

        .icon-lg {
            font-size: 2.5rem;
        }
    }

    @media (max-width: 576px) {
        .container-main {
            padding-left: 15px;
            padding-right: 15px;
        }

        .header-title {
            margin-bottom: 0.25rem !important;
        }

        .col-md-4 {
            width: 100%;
        }

        .card-body.py-4 {
            padding: 1rem !important;
        }

        .custom-action-button {
            flex-grow: 1;
            margin-bottom: 0.5rem;
        }
    }

/* Modal Styles untuk Landscape PDF - FIXED FULLSCREEN */
.modal-pdf-container {
    height: 70vh;
    width: 100%;
    background: #f8f9fa;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
}

.modal-pdf-container object {
    width: 100%;
    height: 100%;
    border: none;
}

/* Modal XL untuk landscape */
.modal-xl {
    max-width: 95%;
    height: 80vh;
    margin: 2.5vh auto;
}

/* FIXED FULLSCREEN - BENAR-BENAR MEMENUHI LAYAR */
.modal-fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    position: fixed !important;
}

.modal-fullscreen .modal-content {
    height: 100vh;
    width: 100vw;
    border-radius: 0;
    border: none;
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.modal-fullscreen .modal-header {
    flex-shrink: 0;
    background: white;
    border-bottom: 1px solid #e9ecef;
    padding: 1rem 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.modal-fullscreen .modal-body {
    padding: 0;
    flex: 1;
    overflow: hidden;
    background: #f8f9fa;
    height: calc(100vh - 120px); /* Header + Footer height */
}

.modal-fullscreen .modal-footer {
    flex-shrink: 0;
}

/* Pastikan modal backdrop juga fullscreen */
.modal-fullscreen ~ .modal-backdrop {
    background-color: rgba(0,0,0,0.8) !important;
}

/* Untuk landscape PDF */
@media (min-width: 1200px) {
    .modal-xl {
        max-width: 1200px;
    }
}

/* Responsive modal */
@media (max-width: 768px) {
    .modal-xl {
        max-width: 95%;
        height: 70vh;
        margin: 2.5vh auto;
    }
    
    .modal-pdf-container {
        height: 60vh;
    }
}

@media (max-width: 576px) {
    .modal-xl {
        max-width: 98%;
        height: 65vh;
        margin: 2.5vh auto;
    }
    
    .modal-pdf-container {
        height: 55vh;
    }
    
    .modal-fullscreen .modal-body {
        height: calc(100vh - 140px); /* Adjust for mobile */
    }
}

/* PDF Loading Styles */
.pdf-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
    background: #f8f9fa;
    border-radius: 0.5rem;
}

.pdf-loading .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
}

.pdf-loading p {
    margin-top: 1rem;
    color: #6c757d;
    font-weight: 500;
}

/* Fallback styles */
#pdfFallback {
    display: none;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #f8f9fa;
    border-radius: 0.5rem;
    flex-direction: column;
    text-align: center;
}

#pdfFallback .bi-exclamation-triangle {
    font-size: 4rem;
    margin-bottom: 1rem;
}

#pdfFallback p {
    color: #6c757d;
    margin-bottom: 1.5rem;
}

/* Modal header improvements */
.modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
    padding: 1rem 1.5rem;
}

.modal-header .modal-title {
    font-weight: 600;
    font-size: 1.25rem;
}

.modal-header .btn-close {
    filter: invert(1);
    opacity: 0.8;
}

.modal-header .btn-close:hover {
    opacity: 1;
}

/* Fullscreen toggle button */
#fullscreenToggle {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    transition: all 0.2s ease;
}

#fullscreenToggle:hover {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-1px);
}

/* Loading overlay improvements */
#global-loading {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 1rem;
    padding: 2rem;
    backdrop-filter: blur(10px);
}

#global-loading .spinner-border {
    width: 2rem;
    height: 2rem;
    border-width: 0.2em;
}

/* Smooth transitions */
.modal-content,
.modal-dialog {
    transition: all 0.3s ease;
}

/* Custom scrollbar for modal */
.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Fullscreen specific styles */
body.modal-fullscreen-active {
    overflow: hidden !important;
    padding-right: 0 !important;
}

.modal-fullscreen-active .navbar,
.modal-fullscreen-active .sidebar {
    display: none !important;
}


.loading-pulse {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}

/* Download Progress Styles */
.download-progress {
    width: 100%;
    height: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
}

.download-progress-bar {
    height: 100%;
    background: linear-gradient(45deg, #17a2b8, #20c997);
    transition: width 0.3s ease;
}
</style>

<div class="container container-main">
    <!-- HEADER -->
    <div class="row mb-5">
        <div class="col-12 col-md-6">
            <h1 class="header-title mb-0">Tanda Terima</h1>
            <p class="text-muted mt-1 mb-0">Kelola tanda terima pembayaran dan pengeluaran</p>
        </div>
    </div>

    <!-- STATISTIK RINGKASAN -->
    <div class="row g-4 mb-5">
        <div class="col-md-4">
            <div class="summary-card d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted fw-bold">Total Item</small>
                    <div class="total-number" id="total-tanda-terima">{{ $tandaTerimas->total() }}</div>
                </div>
                <i class="bi bi-file-earmark-text icon-lg"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="summary-card d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted fw-bold">Siap Generate</small>
                    <div class="total-number" id="ready-generate">0</div>
                </div>
                <i class="bi bi-lightning-charge icon-lg text-green-success-custom"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="summary-card d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted fw-bold">Terakhir Update</small>
                    <div class="total-number" style="font-size: 1.2rem;" id="last-updated">{{ now()->format('d/m/Y H:i')
                        }}</div>
                </div>
                <i class="bi bi-clock-history icon-lg"></i>
            </div>
        </div>
    </div>

    <!-- AKSI CEPAT -->
    <div class="card card-shadow mb-5">
        <div class="card-body py-4">
            <h5 class="card-title d-flex align-items-center mb-3 fw-bold" style="font-size: 1.1rem; color: #475569;">
                <i class="bi bi-lightning-charge me-2"></i> Aksi Cepat
            </h5>

            <!-- Search Bar dan Filter -->
            <div class="d-flex align-items-center w-100 mb-4">
                <div class="search-input-group flex-grow-1 me-2">
                    <span class="input-group-text">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input type="text" class="form-control form-control-sm" id="searchInput"
                        placeholder="Cari tanda terima..." aria-label="Cari tanda terima">
                </div>
                <!-- Filter Button -->
                <select class="form-select w-auto" id="tahunFilter">
                    <option selected value="">Pilih Tahun</option>
                    @foreach($tahunAnggarans as $tahun)
                    <option value="{{ $tahun['id'] }}" {{ $selectedTahun==$tahun['id'] ? 'selected' : '' }}>
                        {{ $tahun['tahun'] }}
                    </option>
                    @endforeach
                </select>
            </div>

            <!-- Tombol Aksi Cepat -->
            <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-primary custom-action-button d-flex align-items-center" id="generate-all-btn">
                    <i class="bi bi-plus-lg me-1"></i> Generate
                    <span class="badge bg-light text-dark ms-2" id="ready-generate-badge">0</span>
                </button>
                <button class="btn btn-success custom-action-button d-flex align-items-center" id="download-all-btn">
                    <i class="bi bi-download me-1"></i> Download All
                </button>
                <button class="btn btn-danger custom-action-button d-flex align-items-center" id="delete-all-btn">
                    <i class="bi bi-trash3 me-1"></i> Hapus All
                </button>
            </div>
        </div>
    </div>

    <!-- DAFTAR TANDA TERIMA -->
    <div class="card card-shadow mb-5">
        <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom-0 pt-4 pb-2">
            <h5 class="mb-0 fw-bold" style="color: #475569;">Daftar Tanda Terima</h5>
            <span class="text-muted">Total: <span id="table-count">{{ $tandaTerimas->total() }}</span> item</span>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table align-middle mb-0 table-min-width" style="font-size: 10pt;">
                    <thead>
                        <tr class="text-muted" style="font-size: 0.9rem;">
                            <th scope="col" class="py-3 ps-4" style="width: 5%;">No</th>
                            <th scope="col" class="py-3" style="width: 15%;">Kode Rekening</th>
                            <th scope="col" class="py-3" style="width: 30%;">Uraian</th>
                            <th scope="col" class="py-3" style="width: 15%;">Tanggal</th>
                            <th scope="col" class="py-3 text-end" style="width: 15%;">Jumlah</th>
                            <th scope="col" class="py-3 text-center pe-4" style="width: 20%;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="tanda-terima-tbody">
                        @forelse($tandaTerimas as $index => $tandaTerima)
                        <tr id="tanda-terima-row-{{ $tandaTerima->id }}">
                            <td class="py-3 ps-4">
                                <div class="fw-bold">{{ ($tandaTerimas->currentPage() - 1) * $tandaTerimas->perPage() +
                                    $index + 1 }}</div>
                            </td>
                            <td>
                                <span class="badge badge-code">{{ $tandaTerima->rekeningBelanja->kode_rekening ?? '-'
                                    }}</span>
                            </td>
                            <td class="text-dark">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-file-text me-2 text-muted"></i>
                                    <span class="text-truncate" style="max-width: 300px;">
                                        {{ $tandaTerima->bukuKasUmum->uraian_opsional ??
                                        $tandaTerima->bukuKasUmum->uraian ?? '-' }}
                                    </span>
                                </div>
                            </td>
                            <td class="text-muted">
                                <i class="bi bi-calendar me-2"></i>
                                {{ \Carbon\Carbon::parse($tandaTerima->bukuKasUmum->tanggal_transaksi)->format('d/m/Y')
                                }}
                            </td>
                            <td class="fw-bold text-success text-end">
                                <i class="bi bi-currency-dollar me-2"></i>
                                Rp {{ number_format($tandaTerima->bukuKasUmum->total_transaksi_kotor ?? 0, 0, ',', '.')
                                }}
                            </td>
                            <td class="text-center pe-4">
                                <div class="d-flex justify-content-center gap-2">
                                    <!-- Preview Button - Modal Trigger -->
                                    <button class="btn table-action-btn preview-tanda-terima" title="Lihat Preview" data-id="{{ $tandaTerima->id }}"
                                        data-bs-toggle="modal" data-bs-target="#previewModal">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <a href="{{ route('tanda-terima.pdf', $tandaTerima->id) }}"
                                        class="btn table-action-btn" title="Download PDF" target="_blank">
                                        <i class="bi bi-download"></i>
                                    </a>
                                    <button class="btn table-action-btn delete-tanda-terima" title="Hapus Tanda Terima"
                                        data-id="{{ $tandaTerima->id }}"
                                        data-uraian="{{ $tandaTerima->bukuKasUmum->uraian_opsional ?? $tandaTerima->bukuKasUmum->uraian }}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-5">
                                <div class="empty-state" style="padding: 2rem; background: transparent; border: none;">
                                    <i class="bi bi-receipt empty-state-icon"
                                        style="font-size: 3rem; color: #cbd5e1;"></i>
                                    <h5 class="text-dark mb-2">Belum ada data tanda terima</h5>
                                    <p class="text-muted">Mulai dengan generate tanda terima otomatis dari data Buku Kas
                                        Umum</p>
                                    <button class="btn btn-primary mt-3" id="generate-empty-btn">
                                        <i class="bi bi-plus-lg me-1"></i> Generate Tanda Terima
                                    </button>
                                </div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($tandaTerimas->hasPages())
            <div
                class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top border-light">
                <div class="text-muted small mb-3 mb-md-0" id="pagination-info">
                    Menampilkan {{ $tandaTerimas->firstItem() }} sampai {{ $tandaTerimas->lastItem() }} dari {{
                    $tandaTerimas->total() }} data
                </div>
                <nav aria-label="Page navigation">
                    <ul class="pagination pagination-simple mb-0" id="pagination-container">
                        {{ $tandaTerimas->links() }}
                    </ul>
                </nav>
            </div>
            @endif
        </div>
    </div>
</div>

<!-- Preview Modal - FIXED FULLSCREEN -->
<div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true"
    data-bs-backdrop="static">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="previewModalLabel">
                    <i class="bi bi-file-earmark-pdf me-2"></i>
                    Preview Tanda Terima
                </h5>
                <div class="d-flex gap-2 align-items-center">
                    <button type="button" class="btn btn-sm btn-light" id="refreshPdf" title="Refresh PDF">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-light" id="fullscreenToggle" title="Fullscreen">
                        <i class="bi bi-arrows-fullscreen"></i>
                    </button>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
            </div>
            <div class="modal-body p-3">
                <div class="modal-pdf-container">
                    <!-- Loading State -->
                    <div id="pdfLoading" class="pdf-loading">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-3 text-muted">Memuat dokumen PDF...</p>
                        <small class="text-muted">Ini mungkin membutuhkan beberapa saat</small>
                    </div>

                    <!-- PDF Iframe -->
                    <iframe id="pdfIframe" src="about:blank" width="100%" height="100%"
                        style="border: none; display: none; border-radius: 0.5rem;"
                        onload="this.style.display='block'; document.getElementById('pdfLoading').style.display='none';"
                        onerror="this.style.display='none'; document.getElementById('pdfLoading').style.display='none'; document.getElementById('pdfFallback').style.display='flex';">
                    </iframe>

                    <!-- Fallback State -->
                    <div id="pdfFallback" style="display: none;">
                        <div class="text-center p-5">
                            <i class="bi bi-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
                            <h5 class="text-dark mb-3">Tidak dapat memuat PDF</h5>
                            <p class="text-muted mb-4">Browser tidak mendukung preview PDF atau terjadi kesalahan.</p>
                            <div class="d-flex gap-2 justify-content-center">
                                <a href="#" id="fallbackDownload" class="btn btn-primary" target="_blank">
                                    <i class="bi bi-download me-2"></i>Download PDF
                                </a>
                                <button class="btn btn-outline-secondary" onclick="location.reload()">
                                    <i class="bi bi-arrow-repeat me-2"></i>Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer bg-light">
                <small class="text-muted me-auto" id="pdfInfo">PDF akan dimuat dalam beberapa detik...</small>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-2"></i>Tutup
                </button>
                <a href="#" id="downloadPdf" class="btn btn-success" target="_blank">
                    <i class="bi bi-download me-2"></i>Download
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Loading Spinner -->
<div class="position-fixed top-50 start-50 translate-middle" id="global-loading" style="display: none; z-index: 9999;">
    <div class="d-flex align-items-center bg-white rounded p-3 shadow">
        <div class="spinner-border text-primary me-3" role="status"></div>
        <span class="text-dark">Memproses...</span>
    </div>
</div>

@push('scripts')
<!-- Include Kwitansi JavaScript -->
<script src="{{ asset('assets/js/tandaterima.js') }}"></script>
@endpush
@endsection