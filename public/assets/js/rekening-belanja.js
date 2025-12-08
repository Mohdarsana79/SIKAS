// rekening-belanja.js
class RekeningBelanjaManager {
    constructor() {
        this.currentPage = 1;
        this.searchTerm = '';
        this.isLoading = false;
        this.editModal = null;
        this.init();
    }

    init() {
        console.log('🔄 Initializing RekeningBelanjaManager...');
        this.initializeEventListeners();
        this.initializeEditModal();
        this.initializeFileUpload();
        this.loadInitialData();
        console.log('✅ RekeningBelanjaManager initialized');
    }

    initializeEventListeners() {
        // Event delegation untuk semua button
        document.addEventListener('click', (e) => {
            // Tombol edit
            if (e.target.closest('.btn-edit')) {
                e.preventDefault();
                this.handleEditClick(e.target.closest('.btn-edit'));
            }
            
            // Tombol delete
            if (e.target.closest('.btn-delete')) {
                e.preventDefault();
                this.handleDeleteClick(e.target.closest('.btn-delete'));
            }
            
            // Pagination links
            const paginationLink = e.target.closest('.page-link');
            if (paginationLink && !paginationLink.closest('.disabled')) {
                e.preventDefault();
                this.handlePaginationClick(paginationLink);
            }
        });

        // Search input
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const searchTerm = e.target.value.trim();
                    this.searchTerm = searchTerm;
                    this.currentPage = 1;
                    
                    if (searchTerm.length >= 2 || searchTerm.length === 0) {
                        this.loadTableData();
                    }
                }, 500);
            });
        }

        // Form tambah
        const tambahForm = document.getElementById('tambahForm');
        if (tambahForm) {
            tambahForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTambahSubmit(e);
            });
        }

        // Form import
        const importForm = document.getElementById('importForm');
        if (importForm) {
            importForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleImportSubmit(e);
            });
        }
    }

    initializeEditModal() {
        // Inisialisasi modal edit
        const editModalElement = document.getElementById('editModal');
        if (editModalElement) {
            this.editModal = new bootstrap.Modal(editModalElement);
            
            // Reset form saat modal ditutup
            editModalElement.addEventListener('hidden.bs.modal', () => {
                this.resetEditForm();
            });
            
            // Form submit
            const editForm = document.getElementById('editForm');
            if (editForm) {
                editForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleEditSubmit(e);
                });
            }
        }
    }

    async loadInitialData() {
        try {
            const response = await fetch('/referensi/rekening-belanja/paginate', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.updateTableContent(data.table_rows_html);
                    this.updatePaginationContent(data.pagination_info_html);
                }
            }
        } catch (error) {
            console.error('❌ Load initial data failed:', error);
        }
    }

    async loadTableData() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showTableLoading();
            
            const response = await fetch(`/referensi/rekening-belanja/paginate?page=${this.currentPage}&search=${encodeURIComponent(this.searchTerm)}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.updateTableContent(data.table_rows_html);
                    this.updatePaginationContent(data.pagination_info_html);
                }
            }
        } catch (error) {
            console.error('❌ Load table data failed:', error);
            this.showError('Gagal memuat data');
        } finally {
            this.isLoading = false;
            this.hideTableLoading();
        }
    }

    handleEditClick(button) {
        const id = button.getAttribute('data-id');
        const kodeRekening = button.getAttribute('data-kode-rekening');
        const rincianObjek = button.getAttribute('data-rincian-objek');
        const kategori = button.getAttribute('data-kategori');

        // Set data ke form
        document.getElementById('editRekeningId').value = id;
        document.getElementById('editKodeRekening').value = kodeRekening;
        document.getElementById('editRincianObjek').value = rincianObjek;
        document.getElementById('editKategori').value = kategori;
        document.getElementById('editKodeRekeningInfo').textContent = kodeRekening;

        // Set form action
        document.getElementById('editForm').action = `/referensi/rekening-belanja/${id}`;

        // Reset error messages
        this.resetEditFormErrors();

        // Show modal
        if (this.editModal) {
            this.editModal.show();
        }
    }

    async handleEditSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('#btnUpdate');
        const originalText = submitButton ? submitButton.innerHTML : '';

        try {
            // Show loading
            if (submitButton) {
                this.showButtonLoading(submitButton, 'Memperbarui data...');
            }

            // Validasi
            if (!this.validateEditForm(form)) {
                if (submitButton) {
                    this.resetButtonState(submitButton, originalText);
                }
                return;
            }

            // Kirim request
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Tutup modal
                if (this.editModal) {
                    this.editModal.hide();
                }

                // Reset form
                this.resetEditForm();

                // Tampilkan success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: result.message || 'Data berhasil diperbarui',
                    confirmButtonColor: '#198754',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Refresh data
                await this.loadTableData();
            } else {
                // Tampilkan error validasi
                if (result.errors) {
                    this.showEditFormErrors(result.errors);
                } else {
                    throw new Error(result.message || 'Update gagal');
                }
            }
        } catch (error) {
            console.error('❌ Edit failed:', error);
            this.showError(error.message || 'Terjadi kesalahan saat memperbarui data');
        } finally {
            if (submitButton) {
                this.resetButtonState(submitButton, originalText);
            }
        }
    }

    validateEditForm(form) {
        let isValid = true;
        
        // Reset semua error
        this.resetEditFormErrors();
        
        // Validasi field required
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                
                const fieldName = field.name;
                const errorElement = document.getElementById(`${fieldName}Error`);
                if (errorElement) {
                    errorElement.textContent = 'Field ini wajib diisi';
                    errorElement.classList.remove('d-none');
                }
            }
        });

        if (!isValid) {
            this.showError('Harap lengkapi semua field yang wajib diisi');
        }

        return isValid;
    }

    resetEditFormErrors() {
        // Hapus kelas invalid dari semua input
        const inputs = document.querySelectorAll('#editForm .form-control, #editForm .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Sembunyikan semua pesan error
        const errorElements = document.querySelectorAll('#editForm .invalid-feedback');
        errorElements.forEach(element => {
            element.classList.add('d-none');
        });
    }

    showEditFormErrors(errors) {
        // Reset errors terlebih dahulu
        this.resetEditFormErrors();
        
        // Tampilkan error untuk setiap field
        for (const [field, messages] of Object.entries(errors)) {
            const input = document.querySelector(`#editForm [name="${field}"]`);
            const errorElement = document.getElementById(`${field}Error`);
            
            if (input && errorElement) {
                input.classList.add('is-invalid');
                errorElement.textContent = messages.join(', ');
                errorElement.classList.remove('d-none');
            }
        }
    }

    resetEditForm() {
        const form = document.getElementById('editForm');
        if (form) {
            form.reset();
            this.resetEditFormErrors();
        }
    }

    handleTambahSubmit(e) {
        e.preventDefault();
        const form = e.target;
        this.submitForm(form, 'create');
    }

    handleImportSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validasi file
        const fileInput = form.querySelector('#file');
        if (!fileInput || !fileInput.files[0]) {
            this.showError('Harap pilih file terlebih dahulu');
            return;
        }
        
        this.submitForm(form, 'import');
    }

    async submitForm(form, type) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : '';

        try {
            // Show loading
            if (submitButton) {
                const loadingText = type === 'create' ? 'Menyimpan data...' : 'Mengimport data...';
                this.showButtonLoading(submitButton, loadingText);
            }

            // Validasi untuk form create
            if (type === 'create' && !this.validateForm(form)) {
                if (submitButton) {
                    this.resetButtonState(submitButton, originalText);
                }
                return;
            }

            // Kirim request
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': type === 'import' ? 'application/json' : 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Tutup modal
                const modalId = type === 'create' ? 'tambahModal' : 'importModal';
                const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
                if (modal) {
                    modal.hide();
                }

                // Reset form
                form.reset();
                if (type === 'import') {
                    this.clearFile();
                }

                // Tampilkan success message
                const successTitle = type === 'create' ? 'Data Berhasil Disimpan' : 'Import Berhasil';
                await Swal.fire({
                    icon: 'success',
                    title: successTitle,
                    text: result.message || 'Operasi berhasil dilakukan',
                    confirmButtonColor: '#198754',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Refresh data
                await this.loadTableData();
            } else {
                let errorMessage = result.message || `Server error: ${response.status}`;
                
                // Handle validation errors
                if (result.errors) {
                    errorMessage = this.formatValidationErrors(result.errors);
                }
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(`❌ ${type} failed:`, error);
            this.showError(error.message || 'Terjadi kesalahan');
        } finally {
            if (submitButton) {
                this.resetButtonState(submitButton, originalText);
            }
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        // Reset validasi sebelumnya
        requiredFields.forEach(field => {
            field.classList.remove('is-invalid');
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        });

        // Validasi field required
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                
                // Tambah pesan error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                errorDiv.textContent = 'Field ini wajib diisi';
                field.parentNode.appendChild(errorDiv);
            }
        });

        return isValid;
    }

    handleDeleteClick(button) {
        const rekeningId = button.getAttribute('data-id');
        const kodeRekening = button.getAttribute('data-kode-rekening');
        const rincianObjek = button.getAttribute('data-rincian-objek');
        const kategori = button.getAttribute('data-kategori');

        if (!rekeningId) {
            this.showError('ID rekening tidak ditemukan');
            return;
        }

        this.showDeleteConfirmation(rekeningId, kodeRekening, rincianObjek, kategori);
    }

    async showDeleteConfirmation(rekeningId, kodeRekening, rincianObjek, kategori) {
        const itemDescription = `${kodeRekening} - ${rincianObjek}`;

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            html: `
                <div class="text-start">
                    <p>Anda akan menghapus rekening belanja berikut:</p>
                    <div class="bg-light p-3 rounded mt-2 mb-3">
                        <strong>${itemDescription}</strong>
                        ${kategori ? `<div class="mt-1"><small>Kategori: ${kategori}</small></div>` : ''}
                    </div>
                    <p class="text-danger mb-0">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        Data yang dihapus tidak dapat dikembalikan!
                    </p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/referensi/rekening-belanja/${rekeningId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': this.getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Terhapus!',
                            text: 'Data berhasil dihapus.',
                            timer: 2000,
                            showConfirmButton: false
                        });

                        // Refresh data
                        await this.loadTableData();
                    } else {
                        throw new Error(result.message || 'Delete failed');
                    }
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.error('❌ Delete failed:', error);
                this.showError('Gagal menghapus data: ' + error.message);
            }
        }
    }

    handlePaginationClick(link) {
        if (this.isLoading) return;
        
        const url = link.getAttribute('href');
        if (!url) return;

        // Ambil page number dari URL
        const urlObj = new URL(url, window.location.origin);
        const page = urlObj.searchParams.get('page') || 1;
        this.currentPage = parseInt(page);
        
        this.loadTableData();
    }

    updateTableContent(html) {
        const tbody = document.getElementById('rekeningTableBody');
        if (tbody) {
            tbody.innerHTML = html;
        }
    }

    updatePaginationContent(html) {
        const container = document.getElementById('paginationContainer');
        if (container) {
            container.innerHTML = html;
        }
    }

    showTableLoading() {
        const tbody = document.getElementById('rekeningTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted mt-2">Memuat data...</p>
                    </td>
                </tr>
            `;
        }
    }

    hideTableLoading() {
        // Implementasi jika diperlukan
    }

    showButtonLoading(button, text) {
        button.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ${text}
        `;
        button.disabled = true;
    }

    resetButtonState(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    }

    showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Terjadi Kesalahan',
            text: message,
            confirmButtonColor: '#dc3545'
        });
    }

    formatValidationErrors(errors) {
        let message = 'Validasi gagal:\n';
        for (const field in errors) {
            message += `- ${errors[field].join(', ')}\n`;
        }
        return message;
    }

    getCsrfToken() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    }

    // File upload methods
    initializeFileUpload() {
        console.log('🔄 Initializing file upload...');
        
        const fileInput = document.getElementById('file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });

            // Drag and drop functionality
            const uploadArea = document.querySelector('.file-upload-area .border-dashed');
            if (uploadArea) {
                this.setupDragAndDrop(uploadArea, fileInput);
            }
        }

        // Reset file input ketika modal import ditutup
        const importModal = document.getElementById('importModal');
        if (importModal) {
            importModal.addEventListener('hidden.bs.modal', () => {
                this.clearFile();
            });
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi file type
        const validTypes = ['application/vnd.ms-excel', 
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          'text/csv'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isValidType = validTypes.includes(file.type) || 
                          ['xlsx', 'xls', 'csv'].includes(fileExtension);

        if (!isValidType) {
            Swal.fire({
                icon: 'error',
                title: 'Format File Tidak Valid',
                html: `
                    <div class="text-start">
                        <p>File <strong>${file.name}</strong> tidak didukung.</p>
                        <p class="small text-muted">Format yang didukung: .xlsx, .xls, .csv</p>
                    </div>
                `,
                confirmButtonColor: '#dc3545'
            });
            this.clearFile();
            return;
        }

        // Validasi file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'File Terlalu Besar',
                html: `
                    <div class="text-start">
                        <p>File <strong>${file.name}</strong> melebihi batas ukuran.</p>
                        <p class="small text-muted">Ukuran file: ${this.formatFileSize(file.size)}<br>Maksimal: 2MB</p>
                    </div>
                `,
                confirmButtonColor: '#dc3545'
            });
            this.clearFile();
            return;
        }

        // Tampilkan preview dengan info lengkap
        this.showFilePreview(file);
    }

    setupDragAndDrop(uploadArea, fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => this.highlight(uploadArea), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => this.unhighlight(uploadArea), false);
        });

        uploadArea.addEventListener('drop', (e) => {
            this.handleDrop(e, fileInput);
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(element) {
        element.classList.add('bg-primary', 'bg-opacity-10', 'border-primary');
    }

    unhighlight(element) {
        element.classList.remove('bg-primary', 'bg-opacity-10', 'border-primary');
    }

    handleDrop(e, fileInput) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }

    showFilePreview(file) {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const uploadPreview = document.getElementById('uploadPreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileType = document.getElementById('fileType');
        const fileInfoSummary = document.getElementById('fileInfoSummary');
        const infoFileName = document.getElementById('infoFileName');
        const infoFileSize = document.getElementById('infoFileSize');
        const infoFileType = document.getElementById('infoFileType');
        const fileReadyText = document.getElementById('fileReadyText');

        // Update main preview
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
        if (fileType) fileType.textContent = this.getFileTypeDescription(file);
        
        // Update info summary
        if (infoFileName) infoFileName.textContent = this.truncateFileName(file.name, 20);
        if (infoFileSize) infoFileSize.textContent = this.formatFileSize(file.size);
        if (infoFileType) infoFileType.textContent = this.getFileExtension(file.name).toUpperCase();
        
        // Update ready text
        if (fileReadyText) fileReadyText.textContent = `File "${this.truncateFileName(file.name, 30)}" siap diimport.`;
        
        // Show elements
        if (uploadPlaceholder) uploadPlaceholder.classList.add('d-none');
        if (uploadPreview) uploadPreview.classList.remove('d-none');
        if (fileInfoSummary) fileInfoSummary.classList.remove('d-none');
    }

    clearFile() {
        const fileInput = document.getElementById('file');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const uploadPreview = document.getElementById('uploadPreview');
        const fileInfoSummary = document.getElementById('fileInfoSummary');
        
        if (fileInput) fileInput.value = '';
        if (uploadPlaceholder) uploadPlaceholder.classList.remove('d-none');
        if (uploadPreview) uploadPreview.classList.add('d-none');
        if (fileInfoSummary) fileInfoSummary.classList.add('d-none');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileTypeDescription(file) {
        const extension = this.getFileExtension(file.name);
        const typeMap = {
            'xlsx': 'Microsoft Excel (OpenXML)',
            'xls': 'Microsoft Excel',
            'csv': 'Comma Separated Values'
        };
        return typeMap[extension] || 'Unknown File Type';
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    truncateFileName(filename, maxLength) {
        if (filename.length <= maxLength) return filename;
        const extension = this.getFileExtension(filename);
        const nameWithoutExt = filename.slice(0, -(extension.length + 1));
        const truncateLength = maxLength - extension.length - 4;
        return nameWithoutExt.slice(0, truncateLength) + '...' + extension;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.rekeningBelanjaManager = new RekeningBelanjaManager();
});