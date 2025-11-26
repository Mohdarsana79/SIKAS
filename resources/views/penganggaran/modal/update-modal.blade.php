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
                        <h5 class="modal-title">Edit Data Anggaran</h5>
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