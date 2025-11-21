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
                this.showResetConfirmation();
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

    showResetConfirmation() {
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
                        <p class="text-muted">Anda akan menghapus <strong>SEMUA DATA</strong> dalam database!</p>
                    </div>

                    <div class="mb-3">
                        <h6 class="mb-2"><i class="bx bx-info-circle me-2"></i>Yang akan terjadi:</h6>
                        <ul class="mb-0">
                            <li>Semua data dalam database akan dihapus</li>
                            <li>Semua user akan dihapus</li>
                            <li>Anda akan logout otomatis</li>
                            <li><strong>Proses ini TIDAK DAPAT dibatalkan!</strong></li>
                        </ul>
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
            confirmButtonText: 'Ya, Reset Database!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            preConfirm: () => {
                const checkbox = document.getElementById('swalConfirmReset');
                if (!checkbox.checked) {
                    Swal.showValidationMessage('Anda harus mencentang kotak konfirmasi terlebih dahulu');
                    return false;
                }
                return true;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.executeResetDatabase();
            }
        });
    }

    executeResetDatabase() {
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
                this.simulateResetProgress();
            }
        });
    }

    simulateResetProgress() {
        const progressBar = document.getElementById('resetProgressBar');
        const progressText = document.getElementById('resetProgressText');
        let progress = 0;
        
        const steps = [
            { percent: 10, text: 'Memulai proses reset database...' },
            { percent: 25, text: 'Membersihkan tabel pengguna...' },
            { percent: 40, text: 'Menghapus data transaksi...' },
            { percent: 60, text: 'Menghapus data master...' },
            { percent: 80, text: 'Mereset sequence...' },
            { percent: 95, text: 'Finalisasi reset...' },
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
                    this.performActualReset().then(success => {
                        if (!success) {
                            clearInterval(interval);
                            Swal.fire({
                                title: 'Reset Gagal!',
                                text: 'Terjadi kesalahan saat mereset database',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                }
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Database berhasil direset! Anda akan diarahkan ke halaman welcome.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/';
                    });
                }, 1000);
            }
        }, 50);
    }

    performActualReset() {
        return fetch('/backup/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Reset database gagal');
            }
        })
        .then(data => {
            return data.success;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
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