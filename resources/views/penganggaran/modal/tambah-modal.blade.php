{{-- Modal Tambah --}}
<div class="modal fade" id="tambahAnggaranModal" tabindex="-1" aria-labelledby="tambahAnggaranModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content modern-modal">
            <!-- Modal Header -->
            <div class="modal-header modern-modal-header">
                <div class="d-flex align-items-center">
                    <div class="modal-icon-wrapper">
                        <i class="bi bi-plus-circle"></i>
                    </div>
                    <div>
                        <h5 class="modal-title" id="tambahAnggaranModalLabel">Tambah Anggaran Baru</h5>
                        <p class="modal-subtitle">Lengkapi data anggaran sekolah</p>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <form action="{{ route('penganggaran.store') }}" method="POST" id="formTambahAnggaran">
                @csrf
                <div class="modal-body modern-modal-body">
                    <div class="row">
                        <!-- Informasi Anggaran -->
                        <div class="col-md-6">
                            <div class="section-header">
                                <i class="bi bi-cash-coin me-2"></i>
                                <h6>Informasi Anggaran</h6>
                            </div>

                            <div class="mb-3">
                                <label for="pagu_anggaran" class="form-label modern-label">
                                    Pagu Anggaran <span class="text-danger">*</span>
                                </label>
                                <div class="input-group modern-input-group">
                                    <span class="input-group-text">Rp</span>
                                    <input type="text" class="form-control modern-input" id="pagu_anggaran"
                                        name="pagu_anggaran" required placeholder="Masukkan pagu anggaran">
                                </div>
                                <div class="form-text modern-form-text">
                                    <i class="bi bi-info-circle me-1"></i>Contoh: 1.000.000.000
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="tahun_anggaran" class="form-label modern-label">
                                    Tahun Anggaran <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control modern-input" id="tahun_anggaran"
                                    name="tahun_anggaran" min="2000" max="{{ date('Y') + 5 }}" required
                                    placeholder="{{ date('Y') }}">
                            </div>

                            <div class="mb-3">
                                <label for="komite" class="form-label modern-label">
                                    Nama Komite <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="komite" name="komite" required
                                    placeholder="Nama Komite Sekolah">
                            </div>
                        </div>

                        <!-- Informasi Tambahan -->
                        <div class="col-md-6">
                            <div class="section-header">
                                <i class="bi bi-calendar-event me-2"></i>
                                <h6>Informasi Tambahan</h6>
                            </div>

                            <div class="mb-3">
                                <label for="tanggal_sk_kepala_sekolah" class="form-label modern-label">
                                    Tanggal SK Kepala Sekolah
                                </label>
                                <input type="date" class="form-control modern-input" id="tanggal_sk_kepala_sekolah"
                                    name="tanggal_sk_kepala_sekolah">
                            </div>

                            <div class="mb-3">
                                <label for="tanggal_sk_bendahara" class="form-label modern-label">
                                    Tanggal SK Bendahara
                                </label>
                                <input type="date" class="form-control modern-input" id="tanggal_sk_bendahara"
                                    name="tanggal_sk_bendahara">
                            </div>

                            <div class="info-box">
                                <div class="info-icon">
                                    <i class="bi bi-info-circle"></i>
                                </div>
                                <div class="info-content">
                                    <small>Field dengan tanda <span class="text-danger">*</span> wajib diisi.</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Kepala Sekolah -->
                    <div class="section-header mt-4">
                        <i class="bi bi-person-badge me-2"></i>
                        <h6>Informasi Kepala Sekolah</h6>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="kepala_sekolah" class="form-label modern-label">
                                    Nama Kepala Sekolah <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="kepala_sekolah"
                                    name="kepala_sekolah" required placeholder="Nama Lengkap Kepala Sekolah">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="nip_kepala_sekolah" class="form-label modern-label">
                                    NIP <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="nip_kepala_sekolah"
                                    name="nip_kepala_sekolah" required placeholder="Nomor Induk Pegawai">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="sk_kepala_sekolah" class="form-label modern-label">
                                    SK Pelantikan <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="sk_kepala_sekolah"
                                    name="sk_kepala_sekolah" required placeholder="Nomor SK Pelantikan">
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Bendahara -->
                    <div class="section-header mt-4">
                        <i class="bi bi-person-check me-2"></i>
                        <h6>Informasi Bendahara</h6>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="bendahara" class="form-label modern-label">
                                    Nama Bendahara <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="bendahara" name="bendahara"
                                    required placeholder="Nama Lengkap Bendahara">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="nip_bendahara" class="form-label modern-label">
                                    NIP <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="nip_bendahara"
                                    name="nip_bendahara" required placeholder="Nomor Induk Pegawai">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="sk_bendahara" class="form-label modern-label">
                                    SK Bendahara <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control modern-input" id="sk_bendahara"
                                    name="sk_bendahara" required placeholder="Nomor SK Bendahara">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer modern-modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-2"></i>Batal
                    </button>
                    <button type="submit" class="btn btn-primary modern-btn">
                        <i class="bi bi-check-circle me-2"></i>Simpan Data
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>