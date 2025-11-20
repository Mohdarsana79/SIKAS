// kopSekolah.js - Enhanced Dynamic School Header Management (Tanpa Drag & Drop)
class KopSekolahManager {
    constructor() {
        this.isUploading = false;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeAnimations();
        this.setupCSRF();
        this.showSessionAlerts();
        this.initializeTooltips();
    }

    setupCSRF() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    bindEvents() {
        $('#uploadForm').on('submit', (e) => this.handleUploadForm(e));
        $(document).on('click', '#deleteBtn', (e) => this.handleDelete(e));
        $(document).on('click', '.btn-refresh', (e) => this.refreshData(e));
        $('#kop_sekolah').on('change', (e) => this.handleFileSelect(e));
        $('#imageModal').on('show.bs.modal', () => this.handleModalOpen());
        $(document).on('click', '.preview-zoom', (e) => {
            e.preventDefault();
            const imgSrc = $('#previewImage').attr('src');
            this.viewImage(imgSrc);
        });

        // Keyboard shortcuts
        $(document).on('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    initializeTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    initializeAnimations() {
        // Add entrance animations with staggered delay
        $('.stat-card').each((index, element) => {
            setTimeout(() => {
                $(element).addClass('animate__animated animate__fadeInUp')
                         .css('opacity', '0')
                         .animate({ opacity: 1 }, 600);
            }, index * 200);
        });

        // Animate main card with delay
        setTimeout(() => {
            $('.school-header-card')
                .addClass('animate__animated animate__fadeIn')
                .css('opacity', '0')
                .animate({ opacity: 1 }, 800);
        }, 600);
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) {
            this.disableUploadButton();
            this.clearPreview();
            return;
        }

        if (!this.validateFile(file)) {
            e.target.value = '';
            this.disableUploadButton();
            this.clearPreview();
            return;
        }

        this.previewImage(file, $('.preview-container'));
        this.showFileInfo(file);
        this.enableUploadButton();
    }

    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const maxSize = 2 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            this.showSweetAlert(
                'Format file tidak didukung!', 
                'Hanya file JPEG, PNG, JPG, dan WEBP yang diizinkan.', 
                'error'
            );
            return false;
        }

        if (file.size > maxSize) {
            this.showSweetAlert(
                'File terlalu besar!', 
                `Ukuran file maksimal 2MB. File Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB`, 
                'error'
            );
            return false;
        }

        return true;
    }

    clearPreview() {
        $('.alert').remove();
    }

    showFileInfo(file) {
        $('.alert').remove();
        
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        const fileType = this.getFileTypeIcon(file.type);
        
        const infoHTML = `
            <div class="alert alert-success alert-dismissible fade show mt-2 small" role="alert">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <i class="bi ${fileType} me-2"></i>
                        <div>
                            <strong class="small">${file.name}</strong>
                            <span class="text-muted ms-2">(${fileSize} MB)</span>
                        </div>
                    </div>
                    <div>
                        <span class="badge bg-success me-2">File Valid</span>
                        <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert"></button>
                    </div>
                </div>
            </div>
        `;
        
        $('.file-input-container').after(infoHTML);
    }

    getFileTypeIcon(fileType) {
        const icons = {
            'image/jpeg': 'bi-file-earmark-image',
            'image/jpg': 'bi-file-earmark-image',
            'image/png': 'bi-file-earmark-image',
            'image/webp': 'bi-file-earmark-image'
        };
        return icons[fileType] || 'bi-file-earmark';
    }

    previewImage(file, container) {
        const reader = new FileReader();
        
        reader.onloadstart = () => {
            container.html(`
                <div class="text-center">
                    <div class="spinner-border text-primary mb-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted small">Memuat preview...</p>
                </div>
            `);
        };
        
        reader.onload = (e) => {
            container.html(`
                <h6 class="text-muted mb-2 small fw-bold text-center">
                    <i class="bi bi-eye me-1"></i>Preview Kop Sekolah Baru
                </h6>
                <div class="preview-wrapper text-center">
                    <img src="${e.target.result}" 
                         alt="Preview Kop Sekolah" 
                         class="img-fluid rounded preview-image shadow"
                         style="max-width: 100%; max-height: 200px; object-fit: contain;">
                    <div class="preview-overlay">
                        <button class="btn btn-light btn-xs preview-zoom" data-bs-toggle="tooltip" title="Zoom Gambar">
                            <i class="bi bi-zoom-in"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-2 text-center">
                    <span class="badge bg-success small">
                        <i class="bi bi-check-circle me-1"></i>
                        Preview - ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                </div>
            `);
            
            // Re-initialize tooltips for the new button
            this.initializeTooltips();
        };
        
        reader.onerror = () => {
            container.html(`
                <div class="text-center text-muted">
                    <i class="bi bi-exclamation-triangle mb-2" style="font-size: 2rem;"></i>
                    <p class="small">Gagal memuat preview gambar</p>
                </div>
            `);
        };
        
        reader.readAsDataURL(file);
    }

    enableUploadButton() {
        $('#uploadBtn')
            .prop('disabled', false)
            .removeClass('btn-secondary')
            .addClass('btn-primary')
            .html('<i class="bi bi-cloud-upload me-1"></i>Upload File');
    }

    disableUploadButton() {
        $('#uploadBtn')
            .prop('disabled', true)
            .removeClass('btn-primary')
            .addClass('btn-secondary')
            .html('<i class="bi bi-cloud-upload me-1"></i>Upload File');
    }

    async handleUploadForm(e) {
        e.preventDefault();
        
        if (this.isUploading) {
            this.showSweetAlert('Sedang memproses...', 'Tunggu hingga proses upload selesai.', 'warning');
            return;
        }
        
        const fileInput = $('#kop_sekolah')[0];
        if (!fileInput || !fileInput.files[0]) {
            this.showSweetAlert('Pilih file terlebih dahulu!', 'Silakan pilih file kop sekolah yang akan diupload.', 'warning');
            return;
        }

        if (!this.validateFile(fileInput.files[0])) return;

        const confirmed = await this.showConfirmation(
            'Upload Kop Sekolah?',
            'Kop sekolah lama akan diganti dengan yang baru. Apakah Anda yakin?',
            'question',
            'Ya, Upload',
            'Batal'
        );

        if (!confirmed) return;

        this.isUploading = true;
        this.showLoadingState();

        try {
            this.setLoadingState($('#uploadBtn'), true, '<span class="spinner-border spinner-border-sm me-1"></span>Mengupload...');
            
            const formData = new FormData($('#uploadForm')[0]);
            const response = await $.ajax({
                url: $('#uploadForm').attr('action'),
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                timeout: 30000
            });

            await this.showSweetAlert('Berhasil!', 'Kop sekolah berhasil diupload dan akan digunakan pada semua dokumen.', 'success');
            this.showSuccessAnimation();

            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            this.handleAjaxError(error);
        } finally {
            this.isUploading = false;
            this.setLoadingState($('#uploadBtn'), false, '<i class="bi bi-cloud-upload me-1"></i>Upload File');
            this.hideLoadingState();
        }
    }

    async handleDelete(e) {
        e.preventDefault();
        
        if (this.isDeleting) {
            this.showSweetAlert('Sedang memproses...', 'Tunggu hingga proses hapus selesai.', 'warning');
            return;
        }
        
        const confirmed = await this.showConfirmation(
            'Hapus Kop Sekolah?',
            'Kop sekolah yang aktif akan dihapus. Dokumen akan menggunakan kop default. Tindakan ini tidak dapat dibatalkan!',
            'warning',
            'Ya, Hapus',
            'Batal'
        );

        if (!confirmed) return;

        this.isDeleting = true;
        this.showLoadingState();

        try {
            this.setLoadingState($('#deleteBtn'), true, '<span class="spinner-border spinner-border-sm me-1"></span>Menghapus...');
            
            const response = await $.ajax({
                url: $('#deleteForm').attr('action'),
                method: 'DELETE',
                timeout: 15000
            });

            await this.showSweetAlert('Berhasil!', 'Kop sekolah berhasil dihapus. Dokumen akan menggunakan kop default.', 'success');
            this.showDeleteAnimation();

            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            this.handleAjaxError(error);
        } finally {
            this.isDeleting = false;
            this.setLoadingState($('#deleteBtn'), false, '<i class="bi bi-trash me-1"></i>Hapus Kop Sekolah');
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        $('.content-area').addClass('loading');
    }

    hideLoadingState() {
        $('.content-area').removeClass('loading');
    }

    showSuccessAnimation() {
        $('.school-header-card')
            .addClass('animate__animated animate__tada success-animation')
            .css('background', 'linear-gradient(135deg, #d4edda 0%, #f8f9fa 100%)');
        
        setTimeout(() => {
            $('.school-header-card')
                .removeClass('animate__animated animate__tada success-animation')
                .css('background', '');
        }, 2000);
    }

    showDeleteAnimation() {
        $('.preview-container')
            .addClass('animate__animated animate__fadeOut')
            .css('background', 'linear-gradient(135deg, #f8d7da 0%, #f8f9fa 100%)');
        
        setTimeout(() => {
            $('.preview-container')
                .removeClass('animate__animated animate__fadeOut')
                .css('background', '');
        }, 1000);
    }

    refreshData(e) {
        if (e) e.preventDefault();
        
        $('.stat-card, .school-header-card').addClass('animate__animated animate__flipInX');
        this.showSweetAlert('Memperbarui data...', 'Data kop sekolah akan dimuat ulang.', 'info', 1000);
        
        setTimeout(() => {
            window.location.reload();
        }, 1200);
    }

    handleModalOpen() {
        setTimeout(() => {
            $('#imageModal img').addClass('animate__animated animate__zoomIn');
        }, 200);
    }

    viewImage(src) {
        // Hapus modal yang sudah ada sebelumnya
        const existingModal = document.getElementById('previewModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg">
                        <div class="modal-header bg-gradient-primary text-white py-3">
                            <h6 class="modal-title fw-bold">
                                <i class="bi bi-zoom-in me-2"></i>Preview Detail Kop Sekolah
                            </h6>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center p-4">
                            <div class="image-container">
                                <img src="${src}" 
                                     class="img-fluid rounded shadow-sm preview-modal-image" 
                                     alt="Preview Kop Sekolah"
                                     style="max-height: 65vh; object-fit: contain;">
                            </div>
                        </div>
                        <div class="modal-footer py-3 justify-content-center border-top-0">
                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-dismiss="modal">
                                <i class="bi bi-x-lg me-1"></i>Tutup Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
        
        const modalElement = document.getElementById('previewModal');
        const modal = new bootstrap.Modal(modalElement);
        
        modalElement.addEventListener('show.bs.modal', () => {
            const img = modalElement.querySelector('.preview-modal-image');
            img.classList.add('animate__animated', 'animate__zoomIn');
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
        
        modal.show();
    }

    handleKeyboardShortcuts(e) {
        // Ctrl + R untuk refresh
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this.refreshData();
        }
        
        // Escape untuk close modal
        if (e.key === 'Escape') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
            if (modal) {
                modal.hide();
            }
            
            const previewModal = bootstrap.Modal.getInstance(document.getElementById('previewModal'));
            if (previewModal) {
                previewModal.hide();
            }
        }
    }

    // SweetAlert Methods
    showConfirmation(title, text, icon, confirmText, cancelText) {
        return new Promise((resolve) => {
            Swal.fire({
                title: title,
                text: text,
                icon: icon,
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#6c757d',
                confirmButtonText: confirmText,
                cancelButtonText: cancelText,
                reverseButtons: true,
                backdrop: true,
                allowOutsideClick: false,
                buttonsStyling: true, // Pastikan ini true
                customClass: {
                    confirmButton: 'btn btn-primary me-2',
                    cancelButton: 'btn btn-secondary',
                    popup: 'sweetalert-custom'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            }).then((result) => {
                resolve(result.isConfirmed);
            });
        });
    }

    showSweetAlert(title, text, type = 'info', timer = 2000) {
        const buttonColors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8',
            'question': '#667eea'
        };

        const config = {
            title: title,
            text: text,
            icon: type,
            confirmButtonColor: buttonColors[type] || '#667eea',
            confirmButtonText: 'OK',
            buttonsStyling: true, // PASTIKAN INI TRUE
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        };

        // Untuk alert success dan info, tambahkan timer
        if (type === 'success' || type === 'info') {
            config.timer = timer;
            config.timerProgressBar = true;
            config.showConfirmButton = true; // Pastikan tombol tetap tampil
        }

        // Untuk error dan warning, jangan auto close
        if (type === 'error' || type === 'warning') {
            config.showConfirmButton = true;
            config.allowOutsideClick = false;
        }

        return Swal.fire(config);
    }

    getButtonColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8',
            'question': '#667eea'
        };
        return colors[type] || '#667eea';
    }

    setLoadingState(button, isLoading, text = null) {
        if (!button || !button.length) return;

        if (isLoading) {
            button.prop('disabled', true);
            button.html(text);
            button.addClass('loading');
        } else {
            button.prop('disabled', false);
            const originalText = text || button.data('original-text') || '<i class="bi bi-cloud-upload me-1"></i>Upload File';
            button.html(originalText);
            button.removeClass('loading');
        }
    }

    showSessionAlerts() {
        if (typeof Swal === 'undefined') return;

        const successMessage = document.querySelector('#alertContainer [data-success]');
        if (successMessage) {
            this.showSweetAlert('Berhasil!', successMessage.textContent, 'success');
        }

        const errorMessage = document.querySelector('#alertContainer [data-error]');
        if (errorMessage) {
            this.showSweetAlert('Gagal!', errorMessage.textContent, 'error');
        }

        const warningMessage = document.querySelector('#alertContainer [data-warning]');
        if (warningMessage) {
            this.showSweetAlert('Peringatan!', warningMessage.textContent, 'warning');
        }

        setTimeout(() => {
            $('#alertContainer').empty();
        }, 2000);
    }

    handleAjaxError(error) {
        let message = 'Terjadi kesalahan saat memproses data.';
        
        if (error.responseJSON) {
            if (error.responseJSON.message) {
                message = error.responseJSON.message;
            } else if (error.responseJSON.errors) {
                const errors = error.responseJSON.errors;
                message = 'Data yang diinput tidak valid:<br>' + 
                         Object.values(errors).map(err => `- ${err}`).join('<br>');
            }
        } else if (error.status === 422) {
            message = 'Data yang diinput tidak valid. Silakan periksa kembali.';
        } else if (error.status === 500) {
            message = 'Terjadi kesalahan server. Silakan coba lagi.';
        } else if (error.status === 404) {
            message = 'Data tidak ditemukan.';
        } else if (error.status === 413) {
            message = 'File terlalu besar. Ukuran maksimal 2MB.';
        } else if (error.status === 415) {
            message = 'Format file tidak didukung.';
        } else if (error.status === 0) {
            message = 'Koneksi terputus. Periksa koneksi internet Anda.';
        } else if (error.statusText === 'timeout') {
            message = 'Waktu koneksi habis. Silakan coba lagi.';
        }

        this.showSweetAlert('Error!', message, 'error');
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    // Cleanup method
    destroy() {
        // Remove all event listeners
        $('#uploadForm').off('submit');
        $(document).off('click', '#deleteBtn');
        $(document).off('click', '.btn-refresh');
        $('#kop_sekolah').off('change');
        $('#imageModal').off('show.bs.modal');
        $(document).off('click', '.preview-zoom');
        $(document).off('keydown');
        
        console.log('KopSekolahManager destroyed');
    }
}

// Initialize when document is ready
$(document).ready(function() {
    // Check required dependencies
    if (typeof $ === 'undefined') {
        console.error('jQuery is not loaded.');
        return;
    }
    
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 is not loaded.');
        return;
    }
    
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded.');
        return;
    }

    try {
        // Initialize the manager
        window.kopSekolahManager = new KopSekolahManager();
        console.log('✅ KopSekolahManager initialized successfully');
        
        // Add some global error handling
        window.addEventListener('error', function(e) {
            console.error('Global error:', e.error);
        });
        
        // Handle page unload
        $(window).on('beforeunload', function() {
            if (window.kopSekolahManager) {
                window.kopSekolahManager.destroy();
            }
        });
        
    } catch (error) {
        console.error('Error initializing KopSekolahManager:', error);
        
        // Fallback basic functionality
        $('#uploadForm').on('submit', function(e) {
            const fileInput = $('#kop_sekolah')[0];
            if (!fileInput || !fileInput.files[0]) {
                e.preventDefault();
                alert('Pilih file terlebih dahulu!');
            }
        });
        
        // Basic file validation
        $('#kop_sekolah').on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (file.size > maxSize) {
                    alert('File terlalu besar! Maksimal 2MB.');
                    e.target.value = '';
                }
            }
        });
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KopSekolahManager;
}