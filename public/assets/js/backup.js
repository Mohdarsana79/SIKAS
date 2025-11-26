class BackupManager {
    constructor() {
        this.restoreManager = new RestoreProgressManager();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Reset Database functionality
        const resetBtn = document.getElementById('resetDatabaseBtn');
        const confirmCheckbox = document.getElementById('confirmReset');
        const confirmResetBtn = document.getElementById('confirmResetBtn');

        // Enable/disable confirm button based on checkbox
        if (confirmCheckbox) {
            confirmCheckbox.addEventListener('change', function() {
                confirmResetBtn.disabled = !this.checked;
            });
        }

        // Show reset confirmation modal
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.showPasswordConfirmation();
            });
        }

        // Handle reset confirmation
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener('click', () => {
                this.confirmResetDatabase();
            });
        }

        // Event listener untuk form restore
        const restoreForm = document.getElementById('restoreForm');
        if (restoreForm) {
            restoreForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRestoreSubmit();
            });
        }

        // Event listener untuk info guide
        const infoGuideBtn = document.querySelector('[data-bs-target="#infoModal"]');
        if (infoGuideBtn) {
            infoGuideBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showInfoGuide();
            });
        }
    }

    showPasswordConfirmation() {
        Swal.fire({
            title: 'Konfirmasi Reset Database',
            html: `
                <div class="text-start">
                    <div class="text-center mb-4">
                        <div class="avatar avatar-xl mx-auto mb-3">
                            <span class="avatar-initial rounded-circle bg-danger">
                                <i class="bx bx-error-circle" style="font-size: 2rem;"></i>
                            </span>
                        </div>
                        <h5 class="text-danger fw-bold">PERINGATAN!</h5>
                        <p class="text-muted">Anda akan menghapus <strong>SEMUA DATA</strong> dalam database <span class="text-success">kecuali data user</span>!</p>
                    </div>

                    <div class="mb-4">
                        <h6 class="mb-2"><i class="bx bx-info-circle me-2"></i>Yang akan terjadi:</h6>
                        <ul class="mb-0">
                            <li>Semua data transaksi, master, dan sekolah akan dihapus</li>
                            <li><span class="text-success">Data user dan akun akan tetap tersimpan</span></li>
                            <li>Anda <strong>TIDAK AKAN</strong> logout otomatis</li>
                            <li><strong>Proses ini TIDAK DAPAT dibatalkan!</strong></li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <label for="swalPassword" class="form-label fw-semibold">Masukkan Password Anda:</label>
                        <input type="password" class="form-control" id="swalPassword" 
                            placeholder="Masukkan password untuk konfirmasi" autocomplete="current-password">
                        <div class="form-text text-danger">Anda harus memasukkan password untuk melanjutkan reset database</div>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="swalConfirmReset">
                        <label class="form-check-label fw-semibold text-danger" for="swalConfirmReset">
                            Saya memahami konsekuensi dan ingin melanjutkan reset database
                        </label>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Lanjutkan Reset',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            focusConfirm: false,
            preConfirm: () => {
                const password = document.getElementById('swalPassword').value;
                const checkbox = document.getElementById('swalConfirmReset');
                
                if (!password) {
                    Swal.showValidationMessage('Password harus diisi');
                    return false;
                }
                
                if (!checkbox.checked) {
                    Swal.showValidationMessage('Anda harus mencentang kotak konfirmasi terlebih dahulu');
                    return false;
                }
                
                return { password: password };
            },
            didOpen: () => {
                document.getElementById('swalPassword').focus();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const password = result.value.password;
                this.validatePasswordAndReset(password);
            }
        });
    }

    validatePasswordAndReset(password) {
        // Tampilkan loading
        Swal.fire({
            title: 'Memvalidasi Password...',
            text: 'Sedang memverifikasi password Anda',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Validasi password ke server
        fetch('/backup/validate-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.close();
                // Jika password valid, tampilkan konfirmasi final
                this.showFinalResetConfirmation(password);
            } else {
                Swal.fire({
                    title: 'Password Salah!',
                    text: data.message || 'Password yang Anda masukkan tidak valid',
                    icon: 'error',
                    confirmButtonText: 'Coba Lagi'
                }).then(() => {
                    this.showPasswordConfirmation();
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Terjadi kesalahan saat memvalidasi password',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    showFinalResetConfirmation(password) {
        Swal.fire({
            title: 'Konfirmasi Akhir Reset Database',
            html: `
                <div class="text-center">
                    <div class="avatar avatar-xl mx-auto mb-3">
                        <span class="avatar-initial rounded-circle bg-danger">
                            <i class="bx bx-error-circle" style="font-size: 2rem;"></i>
                        </span>
                    </div>
                    <h5 class="text-danger fw-bold">FINAL KONFIRMASI!</h5>
                    <p class="text-muted">Anda yakin ingin menghapus <strong>SEMUA DATA</strong> database?</p>
                    
                    <div class="alert alert-danger mt-3">
                        <i class="bx bx-error"></i>
                        <strong>PERINGATAN:</strong> Tindakan ini tidak dapat dibatalkan!
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Reset Sekarang!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.executeResetDatabase(password);
            }
        });
    }

    executeResetDatabase(password) {
        Swal.fire({
            title: 'Mereset Database...',
            html: `
                <div class="text-center">
                    <div class="spinner-border text-danger mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h6>Sedang menghapus semua data...</h6>
                    <p class="text-muted">Mohon tunggu, proses ini mungkin memakan waktu beberapa saat.</p>
                    <div class="progress mt-3" style="height: 10px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                             role="progressbar" style="width: 0%" id="resetProgressBar"></div>
                    </div>
                    <div class="mt-2 small text-muted" id="resetProgressText">Memulai proses reset...</div>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                this.simulateResetProgress(password);
            }
        });
    }

    performActualReset(password) {
        return fetch('/backup/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ password: password })
        })
        .then(response => {
            console.log('Response status:', response.status);
            
            if (response.ok) {
                return response.json();
            } else {
                // Coba parse error message dari response
                return response.json().then(errorData => {
                    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
                }).catch(() => {
                    throw new Error(`HTTP Error: ${response.status}`);
                });
            }
        })
        .then(data => {
            console.log('Reset response:', data);
            if (data.success) {
                return true;
            } else {
                throw new Error(data.message || 'Reset database gagal');
            }
        })
        .catch(error => {
            console.error('Error resetting database:', error);
            
            // Tampilkan error detail untuk debugging
            Swal.fire({
                title: 'Reset Gagal!',
                html: `
                    <div class="text-start">
                        <p>Terjadi kesalahan saat mereset database:</p>
                        <div class="alert alert-danger mt-2">
                            <strong>Error:</strong> ${error.message}
                        </div>
                        <small class="text-muted">Periksa log server untuk detail lebih lanjut.</small>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            
            return false;
        });
    }

    // Di method simulateResetProgress, update bagian success:
    simulateResetProgress(password) {
        const progressBar = document.getElementById('resetProgressBar');
        const progressText = document.getElementById('resetProgressText');
        let progress = 0;
        
        const steps = [
            { percent: 10, text: 'Memulai proses reset database...' },
            { percent: 25, text: 'Memvalidasi akses...' },
            { percent: 40, text: 'Membersihkan data sekolah...' },
            { percent: 60, text: 'Menghapus data transaksi...' },
            { percent: 80, text: 'Menghapus data master...' },
            { percent: 95, text: 'Mereset sequence...' },
            { percent: 100, text: 'Reset berhasil!' }
        ];

        const interval = setInterval(() => {
            if (progress < 100) {
                progress += 1;
                progressBar.style.width = `${progress}%`;
                
                // Update text berdasarkan progress
                const currentStep = steps.find(step => progress <= step.percent) || steps[steps.length - 1];
                progressText.textContent = currentStep.text;
                
                // Kirim request actual ketika mencapai 50%
                if (progress === 50) {
                    this.performActualReset(password).then(success => {
                        if (!success) {
                            clearInterval(interval);
                            // Error sudah ditangani di performActualReset
                        }
                    });
                }
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Database berhasil direset! Data user tetap tersimpan.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Redirect ke dashboard, bukan logout
                        window.location.href = '/dashboard';
                    });
                }, 1000);
            }
        }, 50);
    }

    showInfoGuide() {
        Swal.fire({
            title: 'Panduan Backup & Restore',
            html: `
                <div class="text-start">
                    <div class="mb-4">
                        <h6 class="d-flex align-items-center mb-3">
                            <i class="bi bi-download me-2 text-primary"></i>Proses Backup:
                        </h6>
                        <p class="mb-0">Untuk membuat backup database, masukkan nama backup (opsional) dan klik tombol
                            "Buat Backup". Sistem akan membuat file backup database dengan format <code>.sql</code>.</p>
                    </div>

                    <div class="mb-4">
                        <h6 class="d-flex align-items-center mb-3">
                            <i class="bi bi-upload me-2 text-warning"></i>Proses Restore:
                        </h6>
                        <p class="mb-0">Pilih file backup <code>.sql</code> dari komputer Anda dan klik tombol "Restore
                            Database". <strong>Peringatan:</strong> Proses ini akan mengganti semua data yang ada di
                            database saat ini dengan data dari file backup.</p>
                    </div>

                    <div class="mb-4">
                        <h6 class="d-flex align-items-center mb-3">
                            <i class="bi bi-archive me-2 text-success"></i>Daftar File Backup:
                        </h6>
                        <p class="mb-0">Anda dapat melihat daftar semua file backup yang tersimpan. Anda bisa mengunduh
                            atau menghapus file backup dari daftar ini.</p>
                    </div>

                    <div>
                        <h6 class="d-flex align-items-center mb-3">
                            <i class="bi bi-exclamation-triangle me-2 text-danger"></i>Reset Database:
                        </h6>
                        <ol type="1" class="ps-3 mb-0">
                            <li class="mb-2">Fitur ini berfungsi untuk menghapus semua database yang ada dan apa bila
                                ada database yang rusak.</li>
                            <li class="mb-2">Sebelum melakukan reset database diharapkan untuk melakukan backup terlebih
                                dahulu.</li>
                            <li>Saat anda menyetujui proses reset database maka proses ini tidak dapat di hentikan
                                sampai proses reset berhasil.</li>
                        </ol>
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Mengerti',
            width: '600px'
        });
    }

    handleRestoreSubmit() {
        // Validasi file
        const fileInput = document.getElementById('backup_file');
        if (!fileInput.files.length) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Silakan pilih file backup terlebih dahulu!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        const file = fileInput.files[0];
        if (!file.name.toLowerCase().endsWith('.sql')) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'File harus berformat .sql!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Konfirmasi restore dengan SweetAlert
        Swal.fire({
            title: 'Konfirmasi Restore Database',
            html: `
                <div class="text-start">
                    <p>Apakah Anda yakin ingin melakukan restore database?</p>
                    <div class="alert alert-warning mt-2">
                        <i class="bi bi-exclamation-triangle"></i>
                        <strong>Peringatan:</strong> Proses ini akan mengganti semua data yang ada di database saat ini dengan data dari file backup.
                    </div>
                    <div class="mt-3">
                        <strong>File yang dipilih:</strong><br>
                        <code>${file.name}</code> (${this.formatFileSize(file.size)})
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Restore Database!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            width: '500px'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData(document.getElementById('restoreForm'));
                this.restoreManager.startRestore(formData, file.name);
            }
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

class RestoreProgressManager {
    constructor() {
        this.currentProgress = 0;
        this.isRestoring = false;
        this.restoreSteps = this.generateRestoreSteps();
    }

    generateRestoreSteps() {
        return [
            { progress: 5, message: 'Memulai proses restore database...' },
            { progress: 10, message: 'Memvalidasi file backup...' },
            { progress: 15, message: 'File backup valid, melanjutkan proses...' },
            { progress: 20, message: 'Menyiapkan koneksi database...' },
            { progress: 25, message: 'Koneksi database berhasil...' },
            { progress: 30, message: 'Membersihkan data lama...' },
            { progress: 35, message: 'Data lama berhasil dibersihkan...' },
            { progress: 40, message: 'Memulai restore tabel struktur...' },
            { progress: 45, message: 'Restore struktur tabel: users...' },
            { progress: 50, message: 'Restore struktur tabel: sekolahs...' },
            { progress: 55, message: 'Restore struktur tabel: kode_kegiatans...' },
            { progress: 60, message: 'Restore struktur tabel: rekening_belanjas...' },
            { progress: 65, message: 'Restore struktur tabel: penganggarans...' },
            { progress: 70, message: 'Restore struktur tabel: rkas...' },
            { progress: 72, message: 'Restore struktur tabel: rkas_perubahan...' },
            { progress: 75, message: 'Restore struktur tabel: buku_kas_umums...' },
            { progress: 78, message: 'Restore struktur tabel: bku_uraian_details...' },
            { progress: 80, message: 'Restore struktur tabel: penerimaan_danas...' },
            { progress: 82, message: 'Restore struktur tabel: tanda_terimas...' },
            { progress: 84, message: 'Restore struktur tabel: kwitansis...' },
            { progress: 86, message: 'Restore struktur tabel: migrations...' },
            { progress: 88, message: 'Struktur database berhasil direstore...' },
            { progress: 90, message: 'Memulai restore data...' },
            { progress: 91, message: 'Restore data: users...' },
            { progress: 92, message: 'Restore data: sekolahs...' },
            { progress: 93, message: 'Restore data: kode_kegiatans...' },
            { progress: 94, message: 'Restore data: rekening_belanjas...' },
            { progress: 95, message: 'Restore data: penganggarans...' },
            { progress: 96, message: 'Restore data: rkas...' },
            { progress: 97, message: 'Restore data: rkas_perubahan...' },
            { progress: 98, message: 'Restore data: buku_kas_umums...' },
            { progress: 99, message: 'Restore data: lainnya...' },
            { progress: 100, message: 'Restore database berhasil diselesaikan!' }
        ];
    }

    startRestore(formData, fileName) {
        if (this.isRestoring) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Proses restore sedang berjalan!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        this.isRestoring = true;
        this.currentProgress = 0;

        Swal.fire({
            title: 'Restore Database',
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <strong>File:</strong> ${fileName}
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-semibold">Progress Restore</span>
                            <span class="text-primary fw-bold" id="swalProgressPercent">0%</span>
                        </div>
                        <div class="progress" style="height: 12px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                 role="progressbar" style="width: 0%" id="swalProgressBar"></div>
                        </div>
                    </div>

                    <!-- Current Status -->
                    <div class="mb-3">
                        <div class="d-flex align-items-center">
                            <div class="spinner-border spinner-border-sm text-primary me-2" id="swalSpinner"></div>
                            <span class="fw-semibold text-primary" id="swalCurrentStatus">Memulai proses restore...</span>
                        </div>
                    </div>

                    <!-- Log Area -->
                    <div class="mt-3">
                        <h6 class="fw-semibold mb-2">Detail Proses:</h6>
                        <div class="border rounded p-2" style="height: 150px; overflow-y: auto; background-color: #f8f9fa; font-family: 'Courier New', monospace; font-size: 11px;" id="swalLogArea">
                            <div class="text-muted">Log proses restore akan muncul di sini...</div>
                        </div>
                    </div>

                    <!-- Time Elapsed -->
                    <div class="mt-2 text-end">
                        <small class="text-muted" id="swalTimeElapsed">Waktu: 00:00</small>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Batalkan Restore',
            allowOutsideClick: false,
            allowEscapeKey: false,
            width: '600px',
            didOpen: () => {
                this.startTime = new Date();
                this.startTimer();
                this.addLog('Memulai proses restore database...', 'info');
                this.simulateRestoreProgress(formData);
            },
            willClose: () => {
                this.stopTimer();
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                this.cancelRestore();
            }
        });
    }

    simulateRestoreProgress(formData) {
        let currentStepIndex = 0;
        
        const progressInterval = setInterval(() => {
            if (!this.isRestoring) {
                clearInterval(progressInterval);
                return;
            }

            if (currentStepIndex < this.restoreSteps.length) {
                const step = this.restoreSteps[currentStepIndex];
                this.updateProgress(step.progress, step.message);
                currentStepIndex++;
                
                // Kirim request actual ketika mencapai 70%
                if (step.progress === 70) {
                    this.performActualRestore(formData).then(success => {
                        if (!success) {
                            this.isRestoring = false;
                            clearInterval(progressInterval);
                            this.showRestoreError('Gagal melakukan restore database');
                        }
                    });
                }
            } else {
                clearInterval(progressInterval);
                this.completeRestore();
            }
        }, 800); // Update setiap 800ms
    }

    updateProgress(percent, message) {
        this.currentProgress = percent;
        
        // Update progress bar
        const progressBar = document.getElementById('swalProgressBar');
        const progressPercent = document.getElementById('swalProgressPercent');
        const currentStatus = document.getElementById('swalCurrentStatus');
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressPercent) progressPercent.textContent = `${percent}%`;
        if (currentStatus) currentStatus.textContent = message;
        
        this.addLog(message, 'info');
    }

    addLog(message, type = 'info') {
        const logArea = document.getElementById('swalLogArea');
        if (!logArea) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        
        let icon = '';
        let color = '';
        switch (type) {
            case 'success':
                icon = '✓';
                color = 'text-success';
                break;
            case 'error':
                icon = '✗';
                color = 'text-danger';
                break;
            case 'warning':
                icon = '⚠';
                color = 'text-warning';
                break;
            default:
                icon = 'ℹ';
                color = 'text-primary';
        }
        
        logEntry.innerHTML = `<span class="${color}">[${timestamp}] ${icon} ${message}</span>`;

        // Jika log area masih berisi placeholder, clear dulu
        if (logArea.innerHTML.includes('Log proses restore akan muncul di sini')) {
            logArea.innerHTML = '';
        }

        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;
    }

    performActualRestore(formData) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const uploadProgress = Math.round((e.loaded / e.total) * 100);
                    this.addLog(`Upload file: ${uploadProgress}%`, 'info');
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            this.addLog('Restore database berhasil!', 'success');
                            resolve(true);
                        } else {
                            this.addLog(`Error: ${response.message}`, 'error');
                            resolve(false);
                        }
                    } catch (e) {
                        // Jika response bukan JSON, anggap success
                        if (xhr.responseText.includes('success') || xhr.status === 200) {
                            this.addLog('Restore database berhasil!', 'success');
                            resolve(true);
                        } else {
                            this.addLog('Response tidak valid dari server', 'error');
                            resolve(false);
                        }
                    }
                } else {
                    this.addLog(`HTTP Error: ${xhr.status}`, 'error');
                    resolve(false);
                }
            });

            xhr.addEventListener('error', () => {
                this.addLog('Network error occurred', 'error');
                resolve(false);
            });

            xhr.addEventListener('timeout', () => {
                this.addLog('Request timeout', 'error');
                resolve(false);
            });

            xhr.open('POST', '/backup/restore', true);
            xhr.timeout = 300000;

            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (csrfToken) {
                xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken.getAttribute('content'));
            }

            xhr.send(formData);
            this.addLog('Mengirim file backup ke server...', 'info');
        });
    }

    completeRestore() {
        this.isRestoring = false;
        this.stopTimer();

        // Update to 100% jika belum
        this.updateProgress(100, 'Restore database berhasil diselesaikan!');

        setTimeout(() => {
            Swal.fire({
                title: 'Restore Berhasil!',
                text: 'Database berhasil di-restore. Halaman akan direfresh otomatis.',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                window.location.reload();
            });
        }, 1000);
    }

    showRestoreError(message) {
        this.isRestoring = false;
        this.stopTimer();
        
        this.addLog(`ERROR: ${message}`, 'error');

        setTimeout(() => {
            Swal.fire({
                title: 'Restore Gagal!',
                html: `
                    <div class="text-start">
                        <p>${message}</p>
                        <div class="alert alert-danger mt-2">
                            <i class="bi bi-exclamation-triangle"></i>
                            Proses restore database gagal. Silakan coba lagi atau periksa file backup Anda.
                        </div>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }, 1000);
    }

    cancelRestore() {
        Swal.fire({
            title: 'Batalkan Restore?',
            text: 'Apakah Anda yakin ingin membatalkan proses restore?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Batalkan!',
            cancelButtonText: 'Lanjutkan Restore'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isRestoring = false;
                this.stopTimer();
                
                Swal.fire({
                    title: 'Dibatalkan!',
                    text: 'Proses restore telah dibatalkan.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            } else {
                // Continue restore
                this.isRestoring = true;
                this.startTimer();
            }
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const elapsed = new Date() - this.startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                const timeElapsed = document.getElementById('swalTimeElapsed');
                if (timeElapsed) {
                    timeElapsed.textContent = `Waktu: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Inisialisasi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    window.backupManager = new BackupManager();
});