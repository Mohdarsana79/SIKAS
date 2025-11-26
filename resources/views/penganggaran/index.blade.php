@extends('layouts.app')
@include('layouts.sidebar')
@include('layouts.navbar')
@section('content')

<style>
    /* === RESET DAN BASE STYLES === */
    .modern-modal {
        border: none !important;
        border-radius: 20px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        overflow: hidden !important;
        background: #ffffff !important;
        font-size: 12pt !important;
    }

    /* === GRADIENT HEADER - PASTIKAN INI BERJALAN === */
    .modern-modal-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border-bottom: none !important;
        padding: 1.5rem !important;
        position: relative !important;
        overflow: hidden !important;
        color: white !important;
    }

    .modern-modal-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        z-index: 1;
    }

    .bg-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }

    /* Header Content */
    .header-content {
        display: flex !important;
        align-items: center !important;
        gap: 1rem !important;
        position: relative !important;
        z-index: 2 !important;
    }

    .header-icon {
        width: 50px !important;
        height: 50px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        border-radius: 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        transition: all 0.3s ease !important;
    }

    .header-icon:hover {
        background: rgba(255, 255, 255, 0.3) !important;
        transform: scale(1.05) !important;
    }

    .header-icon i {
        font-size: 1.5rem !important;
        color: white !important;
    }

    .header-text .modal-title {
        font-size: 1.25rem !important;
        font-weight: 700 !important;
        margin: 0 !important;
        color: white !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    .modal-subtitle {
        font-size: 0.85rem !important;
        margin: 0.25rem 0 0 !important;
        opacity: 0.9 !important;
        color: white !important;
        font-weight: 400 !important;
    }

    /* Modal Body */
    .modern-modal-body {
        padding: 1.5rem !important;
        font-size: 12pt !important;
    }

    /* Form Sections */
    .form-section {
        margin-bottom: 1.5rem !important;
        background: #f8fafc !important;
        border-radius: 12px !important;
        padding: 1.25rem !important;
        border: 1px solid #e2e8f0 !important;
        transition: all 0.3s ease !important;
    }

    .form-section:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
        transform: translateY(-2px) !important;
    }

    /* Section Titles dengan Gradient */
    .section-title {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
        padding: 0.75rem 1rem !important;
        border-radius: 10px !important;
        margin: -1rem -1rem 1rem -1rem !important;
        color: white !important;
        font-weight: 600 !important;
        font-size: 12pt !important;
        box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3) !important;
    }

    /* Gradient variations untuk section titles */
    .bg-gradient-info {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
    }

    .bg-gradient-secondary {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%) !important;
        color: #2d3748 !important;
    }

    .bg-gradient-warning {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%) !important;
        color: #2d3748 !important;
    }

    .bg-gradient-success {
        background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%) !important;
        color: #2d3748 !important;
    }

    /* Form Labels */
    .modern-label {
        font-weight: 600 !important;
        color: #2d3748 !important;
        margin-bottom: 0.5rem !important;
        font-size: 12pt !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
    }

    /* Input Groups dengan Warna */
    .modern-input-group {
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        transition: all 0.3s ease !important;
    }

    .modern-input-group:focus-within {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        transform: translateY(-1px) !important;
    }

    .modern-input-group .input-group-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 0.75rem 1rem !important;
        font-size: 12pt !important;
        min-width: 50px !important;
        justify-content: center !important;
    }

    .modern-input {
        border: 1px solid #e2e8f0 !important;
        border-left: none !important;
        padding: 0.75rem 1rem !important;
        font-size: 12pt !important;
        transition: all 0.3s ease !important;
    }

    .modern-input:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }

    /* Gradient variations untuk input groups */
    .bg-gradient-warning {
        background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%) !important;
    }

    .bg-gradient-success {
        background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%) !important;
    }

    .bg-gradient-purple {
        background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%) !important;
    }

    .bg-gradient-orange {
        background: linear-gradient(135deg, #FF8008 0%, #FFC837 100%) !important;
    }

    .bg-gradient-pink {
        background: linear-gradient(135deg, #F857A6 0%, #FF5858 100%) !important;
    }

    .bg-gradient-blue {
        background: linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%) !important;
    }

    .bg-gradient-teal {
        background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%) !important;
    }

    .bg-gradient-indigo {
        background: linear-gradient(135deg, #5f2c82 0%, #49a09d 100%) !important;
    }

    .bg-gradient-green {
        background: linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%) !important;
    }

    .bg-gradient-cyan {
        background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%) !important;
    }

    .bg-gradient-lime {
        background: linear-gradient(135deg, #c2e59c 0%, #64b3f4 100%) !important;
    }

    /* Info Box */
    .info-box {
        background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%) !important;
        border-radius: 10px !important;
        padding: 1rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
        border-left: 4px solid #667eea !important;
        margin-top: 1rem !important;
    }

    .info-icon {
        font-size: 1.25rem !important;
        color: #667eea !important;
    }

    .info-content small {
        font-size: 11pt !important;
        line-height: 1.4 !important;
    }

    /* Modal Footer */
    .modern-modal-footer {
        background: #f8fafc !important;
        border-top: 1px solid #e2e8f0 !important;
        padding: 1.25rem 1.5rem !important;
        display: flex !important;
        justify-content: flex-end !important;
        gap: 0.75rem !important;
    }

    /* Buttons */
    .btn-cancel {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        border: 1px solid #cbd5e0 !important;
        color: #4a5568 !important;
        font-weight: 600 !important;
        padding: 0.625rem 1.25rem !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        font-size: 12pt !important;
    }

    .btn-cancel:hover {
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    }

    .btn-save {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 0.625rem 1.25rem !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        font-size: 12pt !important;
    }

    .btn-save:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3) !important;
    }

    /* Form Controls */
    .form-control {
        font-size: 12pt !important;
    }

    .form-select {
        font-size: 12pt !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .modern-modal-header {
            padding: 1rem !important;
        }

        .header-content {
            flex-direction: column !important;
            text-align: center !important;
            gap: 0.75rem !important;
        }

        .header-icon {
            width: 45px !important;
            height: 45px !important;
        }

        .modern-modal-body {
            padding: 1rem !important;
        }

        .form-section {
            padding: 1rem !important;
        }
    }

    /* Smooth transitions untuk semua elemen */
    * {
        transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
</style>

<div class="content-area" id="contentArea">
    <!-- Dashboard Content -->
    <div class="fade-in">
        <!-- Page Title -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="h3 mb-1 text-gradient">Penganggaran</h1>
                <p class="mb-0 text-muted">Kelola anggaran dan laporan keuangan Anda dengan mudah.</p>
            </div>
            <div>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tambahAnggaranModal">
                    <i class="bi bi-plus-circle me-2"></i>Tambah Baru
                </button>
            </div>
        </div>

        @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        @endif

        {{-- Modal Tambah --}}
        <div class="modal fade" id="tambahAnggaranModal" tabindex="-1" aria-labelledby="tambahAnggaranModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content modern-modal">
                    <!-- Modal Header dengan Gradient Colorful -->
                    <div class="modal-header modern-modal-header bg-gradient-primary">
                        <div class="header-content">
                            <div class="header-icon">
                                <i class="bi bi-plus-circle-fill"></i>
                            </div>
                            <div class="header-text">
                                <h5 class="modal-title">Tambah Anggaran Baru</h5>
                                <p class="modal-subtitle">Lengkapi data anggaran sekolah dengan informasi yang valid</p>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
        
                    <form action="{{ route('penganggaran.store') }}" method="POST" id="formTambahAnggaran">
                        @csrf
                        <div class="modal-body modern-modal-body">
                            <div class="row">
                                <!-- Kolom Kiri - Informasi Utama -->
                                <div class="col-md-6">
                                    <div class="form-section">
                                        <div class="section-title bg-gradient-info">
                                            <i class="bi bi-cash-coin"></i>
                                            <span>Informasi Anggaran</span>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="pagu_anggaran" class="form-label modern-label">
                                                <i class="bi bi-currency-dollar me-1"></i>
                                                Pagu Anggaran <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-warning text-white">
                                                    <i class="bi bi-currency-dollar"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="pagu_anggaran"
                                                    name="pagu_anggaran" required placeholder="Contoh: 1.000.000.000">
                                            </div>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="tahun_anggaran" class="form-label modern-label">
                                                <i class="bi bi-calendar3 me-1"></i>
                                                Tahun Anggaran <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-success text-white">
                                                    <i class="bi bi-calendar3"></i>
                                                </span>
                                                <input type="number" class="form-control modern-input" id="tahun_anggaran"
                                                    name="tahun_anggaran" min="2000" max="{{ date('Y') + 5 }}" required
                                                    placeholder="{{ date('Y') }}">
                                            </div>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="komite" class="form-label modern-label">
                                                <i class="bi bi-people-fill me-1"></i>
                                                Nama Komite <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-purple text-white">
                                                    <i class="bi bi-people-fill"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="komite" name="komite"
                                                    required placeholder="Nama Komite Sekolah">
                                            </div>
                                        </div>
                                    </div>
                                </div>
        
                                <!-- Kolom Kanan - Informasi Tambahan -->
                                <div class="col-md-6">
                                    <div class="form-section">
                                        <div class="section-title bg-gradient-secondary">
                                            <i class="bi bi-calendar-event"></i>
                                            <span>Informasi Tambahan</span>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="tanggal_sk_kepala_sekolah" class="form-label modern-label">
                                                <i class="bi bi-calendar-date me-1"></i>
                                                Tanggal SK Kepala Sekolah
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-orange text-white">
                                                    <i class="bi bi-calendar-date"></i>
                                                </span>
                                                <input type="date" class="form-control modern-input"
                                                    id="tanggal_sk_kepala_sekolah" name="tanggal_sk_kepala_sekolah">
                                            </div>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="tanggal_sk_bendahara" class="form-label modern-label">
                                                <i class="bi bi-calendar-check me-1"></i>
                                                Tanggal SK Bendahara
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-pink text-white">
                                                    <i class="bi bi-calendar-check"></i>
                                                </span>
                                                <input type="date" class="form-control modern-input" id="tanggal_sk_bendahara"
                                                    name="tanggal_sk_bendahara">
                                            </div>
                                        </div>
        
                                        <!-- Info Box Colorful -->
                                        <div class="info-box bg-gradient-light">
                                            <div class="info-icon text-primary">
                                                <i class="bi bi-info-circle-fill"></i>
                                            </div>
                                            <div class="info-content">
                                                <small class="text-dark">
                                                    <strong>Informasi Penting:</strong> Field dengan tanda
                                                    <span class="text-danger fw-bold">*</span> wajib diisi.
                                                    Pastikan data yang dimasukkan sudah benar.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                            <!-- Informasi Kepala Sekolah -->
                            <div class="form-section mt-4">
                                <div class="section-title bg-gradient-warning">
                                    <i class="bi bi-person-badge"></i>
                                    <span>Informasi Kepala Sekolah</span>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="kepala_sekolah" class="form-label modern-label">
                                                Nama Lengkap <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-blue text-white">
                                                    <i class="bi bi-person"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="kepala_sekolah"
                                                    name="kepala_sekolah" required placeholder="Nama Kepala Sekolah">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="nip_kepala_sekolah" class="form-label modern-label">
                                                NIP <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-teal text-white">
                                                    <i class="bi bi-id-card"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="nip_kepala_sekolah"
                                                    name="nip_kepala_sekolah" required placeholder="Nomor Induk Pegawai">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="sk_kepala_sekolah" class="form-label modern-label">
                                                SK Pelantikan <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-indigo text-white">
                                                    <i class="bi bi-file-text"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="sk_kepala_sekolah"
                                                    name="sk_kepala_sekolah" required placeholder="Nomor SK Pelantikan">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                            <!-- Informasi Bendahara -->
                            <div class="form-section mt-4">
                                <div class="section-title bg-gradient-success">
                                    <i class="bi bi-person-check"></i>
                                    <span>Informasi Bendahara</span>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="bendahara" class="form-label modern-label">
                                                Nama Lengkap <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-green text-white">
                                                    <i class="bi bi-person"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="bendahara"
                                                    name="bendahara" required placeholder="Nama Bendahara">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="nip_bendahara" class="form-label modern-label">
                                                NIP <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-cyan text-white">
                                                    <i class="bi bi-id-card"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="nip_bendahara"
                                                    name="nip_bendahara" required placeholder="Nomor Induk Pegawai">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="sk_bendahara" class="form-label modern-label">
                                                SK Bendahara <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-lime text-white">
                                                    <i class="bi bi-file-text"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="sk_bendahara"
                                                    name="sk_bendahara" required placeholder="Nomor SK Bendahara">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <!-- Modal Footer -->
                        <div class="modal-footer modern-modal-footer">
                            <button type="button" class="btn btn-outline-secondary btn-cancel" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-2"></i>Batal
                            </button>
                            <button type="submit" class="btn btn-primary btn-save">
                                <i class="bi bi-check-circle me-2"></i>Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

       {{-- Modal Edit --}}
        <div class="modal fade" id="editAnggaranModal" tabindex="-1" aria-labelledby="editAnggaranModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content modern-modal">
                    <!-- Modal Header dengan Gradient Colorful -->
                    <div class="modal-header modern-modal-header bg-gradient-primary">
                        <div class="header-content">
                            <div class="header-icon">
                                <i class="bi bi-pencil-square"></i>
                            </div>
                            <div class="header-text">
                                <h5 class="modal-title" id="editAnggaranModalLabel">Edit Data Anggaran</h5>
                                <p class="modal-subtitle">Perbarui data anggaran sekolah</p>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
        
                    <form id="formEditAnggaran" method="POST">
                        @csrf
                        @method('PUT')
                        <div class="modal-body modern-modal-body">
                            <div class="row">
                                <!-- Kolom Kiri - Informasi Utama -->
                                <div class="col-md-6">
                                    <div class="form-section">
                                        <div class="section-title bg-gradient-info">
                                            <i class="bi bi-cash-coin"></i>
                                            <span>Informasi Anggaran</span>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="edit_pagu_anggaran" class="form-label modern-label">
                                                <i class="bi bi-currency-dollar me-1"></i>
                                                Pagu Anggaran <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-warning text-white">
                                                    <i class="bi bi-currency-dollar"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_pagu_anggaran"
                                                    name="pagu_anggaran" required placeholder="Contoh: 1.000.000.000">
                                            </div>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="edit_tahun_anggaran" class="form-label modern-label">
                                                <i class="bi bi-calendar3 me-1"></i>
                                                Tahun Anggaran <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-success text-white">
                                                    <i class="bi bi-calendar3"></i>
                                                </span>
                                                <input type="number" class="form-control modern-input" id="edit_tahun_anggaran"
                                                    name="tahun_anggaran" min="2000" max="{{ date('Y') + 5 }}" required>
                                            </div>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="edit_komite" class="form-label modern-label">
                                                <i class="bi bi-people-fill me-1"></i>
                                                Nama Komite <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-purple text-white">
                                                    <i class="bi bi-people-fill"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_komite"
                                                    name="komite" required placeholder="Nama Komite Sekolah">
                                            </div>
                                        </div>
                                    </div>
                                </div>
        
                                <!-- Kolom Kanan - Informasi Tambahan -->
                                <div class="col-md-6">
                                    <div class="form-section">
                                        <div class="section-title bg-gradient-secondary">
                                            <i class="bi bi-calendar-event"></i>
                                            <span>Informasi Tambahan</span>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="edit_tanggal_sk_kepala_sekolah" class="form-label modern-label">
                                                <i class="bi bi-calendar-date me-1"></i>
                                                Tanggal SK Kepala Sekolah
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-orange text-white">
                                                    <i class="bi bi-calendar-date"></i>
                                                </span>
                                                <input type="date" class="form-control modern-input"
                                                    id="edit_tanggal_sk_kepala_sekolah" name="tanggal_sk_kepala_sekolah">
                                            </div>
                                        </div>
        
                                        <div class="mb-3">
                                            <label for="edit_tanggal_sk_bendahara" class="form-label modern-label">
                                                <i class="bi bi-calendar-check me-1"></i>
                                                Tanggal SK Bendahara
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-pink text-white">
                                                    <i class="bi bi-calendar-check"></i>
                                                </span>
                                                <input type="date" class="form-control modern-input"
                                                    id="edit_tanggal_sk_bendahara" name="tanggal_sk_bendahara">
                                            </div>
                                        </div>
        
                                        <!-- Info Box Colorful -->
                                        <div class="info-box bg-gradient-light">
                                            <div class="info-icon text-primary">
                                                <i class="bi bi-info-circle-fill"></i>
                                            </div>
                                            <div class="info-content">
                                                <small class="text-dark">
                                                    <strong>Informasi Penting:</strong> Field dengan tanda
                                                    <span class="text-danger fw-bold">*</span> wajib diisi.
                                                    Pastikan data yang dimasukkan sudah benar.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                            <!-- Informasi Kepala Sekolah -->
                            <div class="form-section mt-4">
                                <div class="section-title bg-gradient-warning">
                                    <i class="bi bi-person-badge"></i>
                                    <span>Informasi Kepala Sekolah</span>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="edit_kepala_sekolah" class="form-label modern-label">
                                                Nama Lengkap <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-blue text-white">
                                                    <i class="bi bi-person"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_kepala_sekolah"
                                                    name="kepala_sekolah" required placeholder="Nama Kepala Sekolah">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="edit_nip_kepala_sekolah" class="form-label modern-label">
                                                NIP <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-teal text-white">
                                                    <i class="bi bi-id-card"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input"
                                                    id="edit_nip_kepala_sekolah" name="nip_kepala_sekolah" required
                                                    placeholder="Nomor Induk Pegawai">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="edit_sk_kepala_sekolah" class="form-label modern-label">
                                                SK Pelantikan <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-indigo text-white">
                                                    <i class="bi bi-file-text"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_sk_kepala_sekolah"
                                                    name="sk_kepala_sekolah" required placeholder="Nomor SK Pelantikan">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                            <!-- Informasi Bendahara -->
                            <div class="form-section mt-4">
                                <div class="section-title bg-gradient-success">
                                    <i class="bi bi-person-check"></i>
                                    <span>Informasi Bendahara</span>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="edit_bendahara" class="form-label modern-label">
                                                Nama Lengkap <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-green text-white">
                                                    <i class="bi bi-person"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_bendahara"
                                                    name="bendahara" required placeholder="Nama Bendahara">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="edit_nip_bendahara" class="form-label modern-label">
                                                NIP <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-cyan text-white">
                                                    <i class="bi bi-id-card"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_nip_bendahara"
                                                    name="nip_bendahara" required placeholder="Nomor Induk Pegawai">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="edit_sk_bendahara" class="form-label modern-label">
                                                SK Bendahara <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group modern-input-group">
                                                <span class="input-group-text bg-gradient-lime text-white">
                                                    <i class="bi bi-file-text"></i>
                                                </span>
                                                <input type="text" class="form-control modern-input" id="edit_sk_bendahara"
                                                    name="sk_bendahara" required placeholder="Nomor SK Bendahara">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <!-- Modal Footer -->
                        <div class="modal-footer modern-modal-footer">
                            <button type="button" class="btn btn-outline-secondary btn-cancel" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-2"></i>Batal
                            </button>
                            <button type="submit" class="btn btn-primary btn-save">
                                <i class="bi bi-check-circle me-2"></i>Update Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Card Penganggaran -->
        <div class="card">
            <div class="card-body p-0">
                <!-- Tab Navigation -->
                <ul class="nav nav-tabs border-bottom-0" id="rkasTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="bosp-reguler-tab" data-bs-toggle="tab"
                            data-bs-target="#bosp-reguler" type="button" role="tab">
                            BOSP Reguler
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="bosp-daerah-tab" data-bs-toggle="tab" data-bs-target="#bosp-daerah"
                            type="button" role="tab">
                            BOSP Daerah
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="bosp-kinerja-tab" data-bs-toggle="tab"
                            data-bs-target="#bosp-kinerja" type="button" role="tab">
                            BOSP Kinerja
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="silpa-bosp-tab" data-bs-toggle="tab" data-bs-target="#silpa-bosp"
                            type="button" role="tab">
                            SiLPA BOSP Kinerja
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="lainnya-tab" data-bs-toggle="tab" data-bs-target="#lainnya"
                            type="button" role="tab">
                            Lainnya
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content" id="rkasTabsContent">
                    <!-- BOSP Reguler Tab -->
                    <div class="tab-pane fade show active" id="bosp-reguler" role="tabpanel">
                        <div class="p-4">
                            @forelse ($anggarans as $anggaran)
                            <!-- CARD RKAS ASLI -->
                            <div class="rkas-item d-flex align-items-center justify-content-between p-3 mb-3 bg-light rounded">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-file-earmark-text me-3 text-primary fs-4"></i>
                                    <div>
                                        <h6 class="mb-1 fw-semibold">RKAS BOSP Reguler {{ $anggaran->tahun_anggaran }}</h6>
                                        <p class="mb-1">Pagu: Rp {{ number_format($anggaran->pagu_anggaran, 0, ',', '.') }}</p>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    @if (!$anggaran->has_perubahan)
                                        <button class="btn btn-sm btn-outline-warning btn-edit-anggaran" data-id="{{ $anggaran->id }}"
                                            data-tahun="{{ $anggaran->tahun_anggaran }}" data-pagu="{{ $anggaran->pagu_anggaran }}" {{-- Angka murni dari
                                            database --}} data-kepala-sekolah="{{ $anggaran->kepala_sekolah }}"
                                            data-nip-kepala-sekolah="{{ $anggaran->nip_kepala_sekolah }}"
                                            data-sk-kepala-sekolah="{{ $anggaran->sk_kepala_sekolah }}" data-bendahara="{{ $anggaran->bendahara }}"
                                            data-nip-bendahara="{{ $anggaran->nip_bendahara }}" data-sk-bendahara="{{ $anggaran->sk_bendahara }}"
                                            data-komite="{{ $anggaran->komite }}"
                                            data-tanggal-sk-kepala-sekolah="{{ $anggaran->tanggal_sk_kepala_sekolah ? $anggaran->tanggal_sk_kepala_sekolah->format('Y-m-d') : '' }}"
                                            data-tanggal-sk-bendahara="{{ $anggaran->tanggal_sk_bendahara ? $anggaran->tanggal_sk_bendahara->format('Y-m-d') : '' }}"
                                            title="Edit Data Anggaran">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    @endif
                                    <a href="{{ route('rkas.index', ['tahun' => $anggaran->tahun_anggaran]) }}"
                                        class="btn btn-sm btn-outline-primary" title="Lihat RKAS Awal">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    @if($anggaran->has_rkas)
                                    <a class="btn btn-sm btn-outline-dark"
                                        href="{{ route('rkas.rekapan', ['tahun' => $anggaran->tahun_anggaran]) }}" title="Cetak RKAS Awal">
                                        <i class="bi bi-printer"></i>
                                    </a>
                                    @else
                                    <button class="btn btn-sm btn-outline-dark" disabled title="Tidak ada data untuk dicetak">
                                        <i class="bi bi-printer"></i>
                                    </button>
                                    @endif
                                    <button
                                        class="btn btn-sm btn-outline-danger btn-hapus-anggaran {{ $anggaran->has_perubahan ? 'disabled' : '' }}"
                                        title="{{ $anggaran->has_perubahan ? 'Tidak dapat dihapus karena sudah ada RKAS Perubahan' : 'Hapus' }}"
                                        data-id="{{ $anggaran->id }}" data-tahun="{{ $anggaran->tahun_anggaran }}"
                                        data-pagu="{{ number_format($anggaran->pagu_anggaran, 0, ',', '.') }}" {{ $anggaran->has_perubahan ?
                                        'disabled' : '' }}>
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- CARD RKAS PERUBAHAN (Tersembunyi secara default) -->
                            <div class="rkas-item d-flex align-items-center justify-content-between p-3 mb-3 bg-light rounded border border-warning {{ $anggaran->has_perubahan ? '' : 'd-none' }}"
                                id="rkas-perubahan-card-{{ $anggaran->tahun_anggaran }}">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-file-earmark-diff me-3 text-warning fs-4"></i>
                                    <div>
                                        <h6 class="mb-1 fw-semibold">RKAS BOSP Reguler Perubahan {{
                                            $anggaran->tahun_anggaran }}</h6>
                                        <p class="mb-1">Pagu: Rp {{ number_format($anggaran->pagu_anggaran, 0, ',', '.')
                                            }}</p>
                                        <span class="badge bg-warning text-dark">
                                            <i class="bi bi-info-circle-fill me-1"></i>Status: RKAS Perubahan
                                        </span>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <!-- Tombol mata mengarah ke route rkas-perubahan -->
                                    <a href="{{ route('rkas-perubahan.index', ['tahun' => $anggaran->tahun_anggaran]) }}"
                                        class="btn btn-sm btn-outline-warning" title="Lihat RKAS Perubahan">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a class="btn btn-sm btn-outline-dark"
                                        href="{{ route('rkas-perubahan.rekapan-perubahan', ['tahun' => $anggaran->tahun_anggaran]) }}"
                                        title="Cetak RKAS Perubahan">
                                        <i class="bi bi-printer"></i>
                                    </a>
                                    <!-- Tombol Hapus RKAS Perubahan -->
                                    @if($anggaran->has_perubahan)
                                    <button class="btn btn-sm btn-outline-warning btn-hapus-rkas-perubahan"
                                        title="Hapus RKAS Perubahan" data-id="{{ $anggaran->id }}"
                                        data-tahun="{{ $anggaran->tahun_anggaran }}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                    @endif
                                </div>
                            </div>
                            @empty
                            <div class="text-center py-5">
                                <i class="bi bi-folder2-open text-muted" style="font-size: 3rem;"></i>
                                <p class="text-muted mt-3">Belum ada data penganggaran.</p>
                            </div>
                            @endforelse
                        </div>
                    </div>

                    <!-- BOSP Daerah Tab -->
                    <div class="tab-pane fade" id="bosp-daerah" role="tabpanel">
                        <div class="p-4">
                            <div class="text-center py-5">
                                <i class="bi bi-folder2-open text-muted" style="font-size: 3rem;"></i>
                                <p class="text-muted mt-3">Belum ada data BOSP Daerah</p>
                            </div>
                        </div>
                    </div>

                    <!-- BOSP Kinerja Tab -->
                    <div class="tab-pane fade" id="bosp-kinerja" role="tabpanel">
                        <div class="p-4">
                            <div class="text-center py-5">
                                <i class="bi bi-folder2-open text-muted" style="font-size: 3rem;"></i>
                                <p class="text-muted mt-3">Belum ada data BOSP Kinerja</p>
                            </div>
                        </div>
                    </div>

                    <!-- SiLPA BOSP Kinerja Tab -->
                    <div class="tab-pane fade" id="silpa-bosp" role="tabpanel">
                        <div class="p-4">
                            <div class="text-center py-5">
                                <i class="bi bi-folder2-open text-muted" style="font-size: 3rem;"></i>
                                <p class="text-muted mt-3">Belum ada data SiLPA BOSP Kinerja</p>
                            </div>
                        </div>
                    </div>

                    <!-- Lainnya Tab -->
                    <div class="tab-pane fade" id="lainnya" role="tabpanel">
                        <div class="p-4">
                            <div class="text-center py-5">
                                <i class="bi bi-folder2-open text-muted" style="font-size: 3rem;"></i>
                                <p class="text-muted mt-3">Belum ada data lainnya</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    // Set variabel untuk pesan session
    @if (session('success'))
        const successMessage = '{{ session('success') }}';
    @endif
    
    @if (session('error'))
        const errorMessage = '{{ session('error') }}';
    @endif
</script>
<script src="{{ asset('assets/js/penganggaran.js') }}"></script>
@endpush