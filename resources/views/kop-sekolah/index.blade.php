@extends('layouts.app')
@include('layouts.navbar')
@include('layouts.sidebar')
@section('content')
<div class="content-area" id="contentArea">
    <div class="fade-in">
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="h3 mb-1 text-gradient-primary">Kop Sekolah</h1>
                <p class="text-muted small">Kelola kop sekolah untuk dokumen dan laporan resmi</p>
            </div>
            <div class="btn-group">
                <button class="btn btn-outline-primary btn-refresh btn-sm">
                    <i class="bi bi-arrow-clockwise me-1"></i>Refresh
                </button>
            </div>
        </div>

        <!-- Alert Container -->
        <div id="alertContainer"></div>

        <div class="row justify-content-center">
            <div class="col-xxl-10">
                <!-- Stats Cards -->
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card stat-card border-0 shadow-sm">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h6 class="mb-0 fw-bold text-primary">{{ $kopSekolah ? 'Aktif' : 'Default' }}
                                        </h6>
                                        <small class="text-muted">Status Kop</small>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-check-circle-fill text-primary" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card stat-card border-0 shadow-sm">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h6 class="mb-0 fw-bold text-success">{{ $kopSekolah ? 'Custom' : 'System' }}
                                        </h6>
                                        <small class="text-muted">Tipe Kop</small>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-image-fill text-success" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card stat-card border-0 shadow-sm">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <h6 class="mb-0 fw-bold text-info">{{ $kopSekolah ?
                                            $kopSekolah->created_at->diffForHumans() : 'N/A' }}</h6>
                                        <small class="text-muted">Terakhir Diupdate</small>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-clock-fill text-info" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Card -->
                <div class="card school-header-card border-0 shadow-lg">
                    <div class="card-header bg-gradient-primary text-white py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 fw-bold">
                                <i class="bi bi-image me-2"></i>Pengaturan Kop Sekolah
                            </h6>
                            <span class="badge bg-light text-primary small">
                                <i class="bi bi-gear me-1"></i>Sistem
                            </span>
                        </div>
                    </div>

                    <div class="card-body p-4">
                        <!-- Preview Section -->
                        <div class="preview-section text-center mb-4">
                            <h6 class="text-muted mb-3 small fw-bold">
                                <i class="bi bi-eye me-1"></i>Preview Kop Sekolah
                            </h6>
                            <div class="preview-container rounded p-3 border-dashed">
                                @if ($kopSekolah && $kopSekolah->file_path)
                                @php
                                $filePath = public_path('storage/kop_sekolah/' . $kopSekolah->file_path);
                                @endphp
                                @if (file_exists($filePath))
                                <!-- Tampilkan kop sekolah aktif -->
                                <div class="preview-wrapper">
                                    <img src="{{ asset('storage/kop_sekolah/' . $kopSekolah->file_path) }}"
                                        alt="Kop Sekolah" class="img-fluid rounded preview-image shadow"
                                        id="previewImage">
                                    <div class="preview-overlay">
                                        <button class="btn btn-light btn-xs preview-zoom" data-bs-toggle="modal"
                                            data-bs-target="#imageModal">
                                            <i class="bi bi-zoom-in"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <span class="badge bg-success small">
                                        <i class="bi bi-check-circle me-1"></i>
                                        Kop sekolah aktif
                                        @if ($kopSekolah->created_at)
                                        - {{ $kopSekolah->created_at->format('d M Y H:i') }}
                                        @endif
                                    </span>
                                </div>
                                @else
                                <!-- File tidak ditemukan -->
                                <div class="default-preview text-center">
                                    <div class="default-icon mb-2">
                                        <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                                    </div>
                                    <p class="text-muted mb-1 small">File kop sekolah tidak ditemukan</p>
                                    <p class="text-muted small mb-2">Silakan upload ulang kop sekolah</p>
                                    <div class="default-image-container">
                                        <div class="placeholder-image bg-light rounded p-4">
                                            <i class="bi bi-file-earmark-image text-muted" style="font-size: 2rem;"></i>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <span class="badge bg-warning text-dark small">
                                            <i class="bi bi-exclamation-triangle me-1"></i>
                                            File tidak ditemukan
                                        </span>
                                    </div>
                                </div>
                                @endif
                                @else
                                <!-- Tidak ada kop sekolah -->
                                <div class="default-preview text-center">
                                    <div class="default-icon mb-2">
                                        <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                                    </div>
                                    <p class="text-muted mb-1 small">Belum ada kop sekolah yang diupload</p>
                                </div>
                                @endif
                            </div>
                        </div>

                        <!-- Upload Section -->
                        <div class="card upload-card border-dashed-custom shadow-sm mb-4">
                            <div class="card-header bg-gradient-light text-center py-3">
                                <h6 class="mb-0 fw-bold text-primary">
                                    <i class="bi bi-cloud-arrow-up-fill me-2"></i>Upload Kop Sekolah Baru
                                </h6>
                            </div>

                            <div class="card-body p-4">
                                <form action="{{ route('kop-sekolah.store') }}" method="POST"
                                    enctype="multipart/form-data" id="uploadForm">
                                    @csrf
                                    <!-- File Input -->
                                    <div
                                        class="file-input-container p-4 border-dashed rounded text-center bg-light mb-3">
                                        <label for="kop_sekolah"
                                            class="form-label fw-bold small mb-3 d-block text-dark">
                                            <i class="bi bi-folder2-open me-1"></i>Pilih File Kop Sekolah
                                        </label>
                                        <input type="file"
                                            class="form-control form-control-sm d-inline-block w-auto mx-auto"
                                            id="kop_sekolah" name="kop_sekolah" accept="image/*">
                                        <div class="mt-2">
                                            <small class="text-muted">Klik tombol di atas untuk memilih file</small>
                                        </div>
                                    </div>

                                    <!-- File Requirements -->
                                    <div class="requirements-card card border-primary mb-4">
                                        <div class="card-header bg-primary bg-opacity-10 py-2">
                                            <h6 class="mb-0 small fw-bold text-primary">
                                                <i class="bi bi-info-circle me-1"></i>Persyaratan File
                                            </h6>
                                        </div>
                                        <div class="card-body p-3">
                                            <div class="row g-2 text-center">
                                                <div class="col-md-4">
                                                    <div class="d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-check-circle text-success me-2"></i>
                                                        <small>Format: JPEG, PNG, JPG, WEBP</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-check-circle text-success me-2"></i>
                                                        <small>Maksimal: 2MB</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-check-circle text-success me-2"></i>
                                                        <small>Rekomendasi: 2480×588px</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="d-flex gap-2 justify-content-center mt-4 pt-3 border-top">
                                        @if ($kopSekolah)
                                        <button type="button" class="btn btn-outline-danger btn-sm px-4" id="deleteBtn">
                                            <i class="bi bi-trash me-1"></i>Hapus Kop Sekolah
                                        </button>
                                        @endif

                                        <button type="submit" class="btn btn-primary btn-sm px-4" id="uploadBtn"
                                            disabled>
                                            <i class="bi bi-cloud-upload me-1"></i>Upload File
                                        </button>
                                    </div>
                                </form>

                                @if ($kopSekolah)
                                <form id="deleteForm" action="{{ route('kop-sekolah.destroy', $kopSekolah->id) }}"
                                    method="POST" class="d-none">
                                    @csrf
                                    @method('DELETE')
                                </form>
                                @endif
                            </div>
                        </div>

                        <!-- Information Cards -->
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <div class="card border-info h-100 shadow-sm">
                                    <div class="card-header bg-gradient-info text-white py-2">
                                        <h6 class="mb-0 small fw-bold text-center">
                                            <i class="bi bi-lightbulb me-1"></i>Informasi Penting
                                        </h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <ul class="list-unstyled mb-0 small">
                                            <li class="mb-2 d-flex align-items-center">
                                                <i class="bi bi-check-circle text-success me-2"></i>
                                                <span>Digunakan di semua dokumen resmi</span>
                                            </li>
                                            <li class="mb-2 d-flex align-items-center">
                                                <i class="bi bi-check-circle text-success me-2"></i>
                                                <span>Format landscape direkomendasikan</span>
                                            </li>
                                            <li class="mb-2 d-flex align-items-center">
                                                <i class="bi bi-check-circle text-success me-2"></i>
                                                <span>Kualitas gambar harus tinggi untuk cetak</span>
                                            </li>
                                            <li class="d-flex align-items-center">
                                                <i class="bi bi-check-circle text-success me-2"></i>
                                                <span>Resolusi sesuai rekomendasi</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card border-warning h-100 shadow-sm">
                                    <div class="card-header bg-gradient-warning text-white py-2">
                                        <h6 class="mb-0 small fw-bold text-center">
                                            <i class="bi bi-exclamation-triangle me-1"></i>Tips & Rekomendasi
                                        </h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <ul class="list-unstyled mb-0 small">
                                            <li class="mb-2 d-flex align-items-center">
                                                <i class="bi bi-star-fill text-warning me-2"></i>
                                                <span>Gunakan resolusi tinggi untuk hasil cetak terbaik</span>
                                            </li>
                                            <li class="mb-2 d-flex align-items-center">
                                                <i class="bi bi-star-fill text-warning me-2"></i>
                                                <span>Pastikan logo dan teks jelas terbaca</span>
                                            </li>
                                            <li class="mb-2 d-flex align-items-center">
                                                <i class="bi bi-star-fill text-warning me-2"></i>
                                                <span>Simpan dalam format PNG untuk kualitas terbaik</span>
                                            </li>
                                            <li class="d-flex align-items-center">
                                                <i class="bi bi-star-fill text-warning me-2"></i>
                                                <span>Test print sebelum digunakan massal</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Image Preview Modal -->
<div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-gradient-primary text-white py-3">
                <h6 class="modal-title fw-bold">
                    <i class="bi bi-image me-2"></i>Preview Kop Sekolah
                </h6>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body text-center p-4">
                @if ($kopSekolah && $kopSekolah->file_path && file_exists(public_path('storage/kop_sekolah/' .
                $kopSekolah->file_path)))
                <img src="{{ asset('storage/kop_sekolah/' . $kopSekolah->file_path) }}" alt="Kop Sekolah"
                    class="img-fluid rounded shadow-sm modal-preview-image">
                @else
                <div class="text-center py-4">
                    <i class="bi bi-image text-muted" style="font-size: 4rem;"></i>
                    <p class="text-muted mt-3">Tidak ada gambar untuk ditampilkan</p>
                </div>
                @endif
            </div>
            <div class="modal-footer py-3 justify-content-center">
                <button type="button" class="btn btn-outline-primary btn-sm" data-bs-dismiss="modal">
                    <i class="bi bi-x-lg me-1"></i>Tutup
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    /* ===== KOP SEKOLAH STYLES ===== */

    /* Base font size 12pt */
    body {
        font-size: 12pt;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        min-height: 100vh;
    }

    .small {
        font-size: 0.85rem !important;
    }

    .btn-sm {
        font-size: 0.85rem;
        padding: 0.375rem 0.75rem;
    }

    .btn-xs {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }

    /* ===== GRADIENT COLORS ===== */
    .bg-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }

    .bg-gradient-info {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
    }

    .bg-gradient-warning {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
    }

    .bg-gradient-success {
        background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%) !important;
    }

    .bg-gradient-danger {
        background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%) !important;
    }

    .bg-gradient-light {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    }

    /* Text Gradients */
    .text-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* ===== STAT CARDS ===== */
    .stat-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .stat-card:hover::before {
        transform: scaleX(1);
    }

    .stat-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    /* ===== MAIN CARD ===== */
    .school-header-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }

    .school-header-card:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    /* ===== PREVIEW SECTION ===== */
    .preview-section {
        margin-bottom: 2rem;
    }

    .preview-container {
        min-height: 280px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        transition: all 0.4s ease;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 16px;
        padding: 2rem;
        border: 2px dashed transparent;
        background-clip: padding-box;
    }

    .preview-container::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 18px;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .preview-container:hover::before {
        opacity: 0.1;
    }

    .preview-wrapper {
        position: relative;
        display: inline-block;
        transition: all 0.3s ease;
    }

    .preview-image {
        max-width: 100%;
        max-height: 220px;
        object-fit: contain;
        border: 4px solid #fff;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .preview-image:hover {
        transform: scale(1.05);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
        border-color: #667eea;
    }

    .preview-overlay {
        position: absolute;
        top: 12px;
        right: 12px;
        opacity: 0;
        transition: all 0.3s ease;
        transform: translateY(-10px);
    }

    .preview-wrapper:hover .preview-overlay {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== UPLOAD SECTION - TANPA DRAG & DROP ===== */
    .upload-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: none;
        position: relative;
        overflow: hidden;
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .border-dashed-custom {
        border: 2px dashed #dee2e6;
        border-radius: 20px;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    }

    .border-dashed-custom:hover {
        border-color: #667eea;
        background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15);
    }

    .upload-card .card-header {
        border-bottom: 2px dashed #dee2e6;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    }

    /* Upload Icon */
    .upload-icon {
        transition: all 0.3s ease;
    }

    .upload-card:hover .upload-icon {
        transform: translateY(-5px);
        color: #764ba2;
    }

    /* File Input Container */
    .file-input-container {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        transition: all 0.3s ease;
        text-align: center;
        border-radius: 12px;
        border: 2px dashed #ced4da;
        margin: 1rem 0;
    }

    .file-input-container:hover {
        background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%) !important;
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.1);
    }

    /* Requirements Card */
    .requirements-card {
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .requirements-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }

    /* ===== DEFAULT PREVIEW STATES ===== */
    .default-preview {
        padding: 2rem;
    }

    .default-icon {
        transition: all 0.3s ease;
    }

    .default-preview:hover .default-icon {
        transform: scale(1.1);
        color: #667eea !important;
    }

    .placeholder-image {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 2px dashed #dee2e6;
        transition: all 0.3s ease;
        border-radius: 12px;
        padding: 3rem 2rem;
        margin: 1rem 0;
    }

    .placeholder-image:hover {
        border-color: #667eea;
        background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
        transform: translateY(-2px);
    }

    /* ===== BUTTON STYLES ===== */
    .btn {
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 10px;
        position: relative;
        overflow: hidden;
    }

    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
    }

    .btn:hover::before {
        left: 100%;
    }

    .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
        background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        transform: none;
        box-shadow: none;
        cursor: not-allowed;
    }

    .btn-outline-danger {
        border: 2px solid #dc3545;
        color: #dc3545;
        background: transparent;
        font-weight: 500;
    }

    .btn-outline-danger:hover {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        border-color: #dc3545;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
    }

    .btn-outline-primary {
        border: 2px solid #667eea;
        color: #667eea;
        background: transparent;
    }

    .btn-outline-primary:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: white;
    }

    .btn-outline-secondary {
        border: 2px solid #6c757d;
        color: #6c757d;
        background: transparent;
    }

    .btn-outline-secondary:hover {
        background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        border-color: #6c757d;
        color: white;
    }

    /* ===== BADGE STYLES ===== */
    .badge {
        font-weight: 600;
        border-radius: 8px;
        padding: 0.5em 1em;
        font-size: 0.75rem;
        transition: all 0.3s ease;
    }

    .badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(40px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .fade-in {
        animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .animate__animated {
        animation-duration: 0.6s;
    }

    /* Success animation */
    .success-animation {
        animation: successPulse 0.6s ease-in-out;
    }

    @keyframes successPulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
        }

        50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
        }

        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
        }
    }

    /* ===== FORM CONTROLS ===== */
    .form-control-sm {
        font-size: 0.85rem;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        display: inline-block;
        width: auto;
        min-width: 240px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    }

    .form-control-sm:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.3rem rgba(102, 126, 234, 0.2);
        transform: translateY(-2px);
        background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
    }

    /* ===== CARD HEADER IMPROVEMENTS ===== */
    .card-header {
        border: none;
        border-radius: 20px 20px 0 0 !important;
        padding: 1rem 1.5rem;
    }

    /* ===== INFORMATION CARDS ===== */
    .card.border-info,
    .card.border-warning {
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    }

    .card.border-info {
        border-color: #4facfe !important;
    }

    .card.border-warning {
        border-color: #f093fb !important;
    }

    .card.border-info:hover,
    .card.border-warning:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }

    .card.border-info .card-header {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
    }

    .card.border-warning .card-header {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
    }

    /* ===== MODAL STYLES ===== */
    .modal-content {
        border-radius: 20px;
        border: none;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }

    .modal-header {
        border-radius: 20px 20px 0 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 1rem 1.5rem;
    }

    .modal-footer {
        border-top: 1px solid #e9ecef;
        padding: 1rem 1.5rem;
    }

    .preview-modal-image {
        transition: transform 0.3s ease;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .preview-modal-image:hover {
        transform: scale(1.02);
    }

    /* Modal Animation */
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }

        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .modal.fade .modal-dialog {
        animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Prevent multiple modals */
    .modal-backdrop {
        z-index: 1040;
    }

    .modal {
        z-index: 1050;
    }

    .modal.show {
        display: block;
    }

    /* ===== LOADING STATES ===== */
    .loading {
        opacity: 0.7;
        pointer-events: none;
        position: relative;
    }

    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        z-index: 1000;
        border-radius: inherit;
    }

    .spinner-border {
        animation: spinner-border 0.75s linear infinite;
    }

    /* ===== ALERT STYLES ===== */
    .alert {
        border-radius: 12px;
        border: none;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .alert:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .alert-success {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        color: #155724;
        border-left: 4px solid #28a745;
    }

    .alert-info {
        background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
        color: #0c5460;
        border-left: 4px solid #17a2b8;
    }

    .alert-warning {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        color: #856404;
        border-left: 4px solid #ffc107;
    }

    .alert-danger {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
        color: #721c24;
        border-left: 4px solid #dc3545;
    }

    /* ===== RESPONSIVE DESIGN ===== */
    @media (max-width: 768px) {
        .stat-card {
            margin-bottom: 1rem;
        }

        .preview-image {
            max-height: 180px;
        }

        .btn-sm {
            padding: 0.5rem 1rem;
            width: 100%;
            margin-bottom: 0.5rem;
        }

        .upload-card .d-flex {
            flex-direction: column;
        }

        .form-control-sm {
            min-width: 100%;
            margin-bottom: 1rem;
        }

        .preview-container {
            min-height: 200px;
            padding: 1rem;
        }
    }

    @media (max-width: 576px) {
        .card-body {
            padding: 1rem;
        }

        .file-input-container {
            padding: 1rem;
        }

        .requirements-card .row {
            flex-direction: column;
            gap: 0.5rem;
        }

        .requirements-card .col-md-4 {
            width: 100%;
            text-align: center;
        }
    }

    /* ===== FOCUS STATES ===== */
    .btn:focus,
    .form-control:focus,
    .form-select:focus {
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
</style>
@endpush

@push('scripts')
<script src="{{ asset('assets/js/kopSekolah.js') }}"></script>
@endpush