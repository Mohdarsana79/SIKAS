class TandaTerimaManager {
    constructor() {
        this.currentFilters = {
            search: '',
            startDate: '',
            endDate: '',
            tahun: ''
        };
        this.searchTimeout = null;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Tanda Terima Manager...');
        this.initializeEventListeners();
        this.checkAvailableData();
        this.updateLastUpdated();
        this.startPeriodicUpdates();
        this.initializeModalHandlers();
        this.initializeDateFilters();
    }

    initializeEventListeners() {
        // Search functionality dengan debounce
        const searchInput = document.getElementById('searchInput');
        const tahunFilter = document.getElementById('tahunFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                
                // Clear existing timeout
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                // Set new timeout untuk debounce
                this.searchTimeout = setTimeout(() => {
                    this.performSearchWithFilters();
                }, 500);
            });
        }

        if (tahunFilter) {
            tahunFilter.addEventListener('change', () => {
                this.currentFilters.tahun = tahunFilter.value;
                // Auto search langsung tanpa debounce
                this.performSearchWithFilters();
            });
        }

        // Action buttons
        this.initializeActionButtons();
    }

    performSearchWithFilters() {
        this.performSearch(
            this.currentFilters.search,
            this.currentFilters.tahun,
            this.currentFilters.startDate,
            this.currentFilters.endDate
        );
    }

    initializeDateFilters() {
        // Set default dates (30 days ago to today)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const resetFilterBtn = document.getElementById('resetFilter');
        const clearFilterBtn = document.getElementById('clearFilter');
        
        // Event listeners for date inputs - AUTO SEARCH
        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                this.currentFilters.startDate = e.target.value;
                this.validateDateRange();
                // Auto search setelah perubahan tanggal
                this.debouncedSearch();
            });
        }
        
        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                this.currentFilters.endDate = e.target.value;
                this.validateDateRange();
                // Auto search setelah perubahan tanggal
                this.debouncedSearch();
            });
        }
        
        // Reset filter button
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', () => {
                this.resetDateFilters();
            });
        }
        
        // Clear all filters button
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        // Initial filter update
        this.updateFilterInfo();
    }

    // Tambahkan debounce function untuk search
    debouncedSearch() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.performSearchWithFilters();
        }, 300);
    }

    validateDateRange() {
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate.value && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            
            if (start > end) {
                this.showError('Tanggal Tidak Valid', 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
                // Auto correct dan search
                endDate.value = startDate.value;
                this.currentFilters.endDate = endDate.value;
                this.performSearchWithFilters();
            }
        }
    }

    resetDateFilters() {
        // Reset dates ke KOSONG
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        if (startDateInput) {
            startDateInput.value = '';
            this.currentFilters.startDate = '';
        }
        
        if (endDateInput) {
            endDateInput.value = '';
            this.currentFilters.endDate = '';
        }
        
        // Auto search setelah reset
        this.performSearchWithFilters();
        this.showToast('Filter tanggal direset', 'info');
    }

    clearAllFilters() {
        // Reset search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            this.currentFilters.search = '';
        }
        
        // Reset tahun
        const tahunFilter = document.getElementById('tahunFilter');
        if (tahunFilter) {
            tahunFilter.value = '';
            this.currentFilters.tahun = '';
        }
        
        // Reset dates ke KOSONG (bukan default 30 hari)
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        if (startDateInput) {
            startDateInput.value = '';
            this.currentFilters.startDate = '';
        }
        
        if (endDateInput) {
            endDateInput.value = '';
            this.currentFilters.endDate = '';
        }
        
        // Auto search dengan filter kosong (tampilkan semua data)
        this.performSearchWithFilters();
        this.showToast('Semua filter telah dihapus, menampilkan semua data', 'success');
    }

    initializeModalHandlers() {
        const previewModal = document.getElementById('previewModal');
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        const refreshPdf = document.getElementById('refreshPdf');
        const downloadPdf = document.getElementById('downloadPdf');
        const fallbackDownload = document.getElementById('fallbackDownload');
        
        let currentTandaTerimaId = null;
        let isFullscreen = false;
        
        if (previewModal) {
            // When modal is about to be shown
            previewModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                currentTandaTerimaId = button.getAttribute('data-id');
                const previewUrl = `${this.getBaseUrl()}/tanda-terima/${currentTandaTerimaId}/preview-pdf`;
                const downloadUrl = `${this.getBaseUrl()}/tanda-terima/${currentTandaTerimaId}/pdf`;
                
                console.log('Opening preview modal for ID:', currentTandaTerimaId);
                
                // Reset fullscreen state
                this.exitFullscreen();
                isFullscreen = false;
                
                // Update modal title
                document.getElementById('previewModalLabel').innerHTML = 
                    `<i class="bi bi-file-earmark-pdf me-2"></i>Preview Tanda Terima #${currentTandaTerimaId}`;
                
                // Set download URLs
                if (downloadPdf) downloadPdf.href = downloadUrl;
                if (fallbackDownload) fallbackDownload.href = downloadUrl;
                
                // Update info text
                document.getElementById('pdfInfo').textContent = 'Memuat dokumen PDF...';
                
                // Reset dan set iframe source
                this.setIframeSource(previewUrl, currentTandaTerimaId);
            });

            // Reset modal when closed
            previewModal.addEventListener('hidden.bs.modal', () => {
                console.log('Modal closed, clearing iframe...');
                
                // Exit fullscreen jika aktif
                this.exitFullscreen();
                isFullscreen = false;
                
                // Clear iframe source saat modal ditutup
                const pdfIframe = document.getElementById('pdfIframe');
                if (pdfIframe) {
                    pdfIframe.src = 'about:blank';
                }
                
                // Reset UI states
                this.resetModalStates();
                
                // Reset current ID
                currentTandaTerimaId = null;
            });
        }

        // Fullscreen toggle
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                if (!isFullscreen) {
                    this.enterFullscreen();
                    isFullscreen = true;
                } else {
                    this.exitFullscreen();
                    isFullscreen = false;
                }
            });
        }
        
        // Refresh PDF
        if (refreshPdf) {
            refreshPdf.addEventListener('click', () => {
                if (currentTandaTerimaId) {
                    const previewUrl = `${this.getBaseUrl()}/tanda-terima/${currentTandaTerimaId}/preview-pdf`;
                    this.setIframeSource(previewUrl, currentTandaTerimaId);
                    this.showToast('Memuat ulang PDF...', 'info');
                }
            });
        }
        
        // Handle escape key untuk keluar fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                this.exitFullscreen();
                isFullscreen = false;
            }
        });
    }

    enterFullscreen() {
        const modal = document.getElementById('previewModal');
        const modalDialog = modal.querySelector('.modal-dialog');
        const modalContent = modal.querySelector('.modal-content');
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        const modalHeader = modal.querySelector('.modal-header');
        
        if (!modalDialog) return;
        
        // Add fullscreen classes
        modalDialog.classList.add('modal-fullscreen');
        modalContent.classList.add('modal-fullscreen');
        document.body.classList.add('modal-fullscreen-active');
        
        // Update toggle button
        fullscreenToggle.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
        fullscreenToggle.setAttribute('title', 'Keluar Fullscreen');
        fullscreenToggle.classList.remove('btn-light');
        fullscreenToggle.classList.add('btn-warning');
        
        // Darker header in fullscreen for better contrast
        modalHeader.classList.remove('bg-primary');
        modalHeader.classList.add('bg-dark');
        
        // Hide other page elements
        this.hidePageElements();
        
        this.showToast('Masuk ke mode fullscreen - tekan ESC untuk keluar', 'success');
        
        // Trigger resize untuk iframe
        this.triggerIframeResize();
    }

    exitFullscreen() {
        const modal = document.getElementById('previewModal');
        const modalDialog = modal.querySelector('.modal-dialog');
        const modalContent = modal.querySelector('.modal-content');
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        const modalHeader = modal.querySelector('.modal-header');
        
        if (!modalDialog) return;
        
        // Remove fullscreen classes
        modalDialog.classList.remove('modal-fullscreen');
        modalContent.classList.remove('modal-fullscreen');
        document.body.classList.remove('modal-fullscreen-active');
        
        // Update toggle button
        fullscreenToggle.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
        fullscreenToggle.setAttribute('title', 'Fullscreen');
        fullscreenToggle.classList.remove('btn-warning');
        fullscreenToggle.classList.add('btn-light');
        
        // Restore header color
        modalHeader.classList.remove('bg-dark');
        modalHeader.classList.add('bg-primary');
        
        // Show other page elements
        this.showPageElements();
        
        this.showToast('Keluar dari mode fullscreen', 'info');
    }

    hidePageElements() {
        // Sembunyikan elemen halaman lainnya
        const elementsToHide = [
            '.navbar',
            '.sidebar',
            '.container-main',
            '.card-shadow'
        ];
        
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    showPageElements() {
        // Tampilkan kembali elemen halaman
        const elementsToShow = [
            '.navbar',
            '.sidebar',
            '.container-main',
            '.card-shadow'
        ];
        
        elementsToShow.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = '';
            });
        });
    }

    triggerIframeResize() {
        const pdfIframe = document.getElementById('pdfIframe');
        if (pdfIframe && pdfIframe.style.display !== 'none') {
            // Force iframe resize
            setTimeout(() => {
                const iframeDoc = pdfIframe.contentDocument || pdfIframe.contentWindow.document;
                if (iframeDoc) {
                    pdfIframe.style.width = '100%';
                    pdfIframe.style.height = '100%';
                }
            }, 100);
        }
    }

    setIframeSource(previewUrl, tandaTerimaId) {
        const pdfIframe = document.getElementById('pdfIframe');
        const pdfLoading = document.getElementById('pdfLoading');
        const pdfFallback = document.getElementById('pdfFallback');
        
        // Reset states
        this.resetModalStates();
        
        if (pdfLoading) {
            pdfLoading.style.display = 'flex';
            pdfLoading.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                    <p class="mt-3 text-muted">Memuat dokumen PDF...</p>
                    <small class="text-muted">ID: ${tandaTerimaId}</small>
                </div>
            `;
        }
        
        if (pdfIframe) {
            pdfIframe.style.display = 'none';
            pdfIframe.src = 'about:blank'; // Clear previous content
            
            // Set new source after a brief delay
            setTimeout(() => {
                pdfIframe.src = `${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
                document.getElementById('pdfInfo').textContent = 'PDF sedang dimuat...';
            }, 300);
        }
        
        // Fallback timeout
        setTimeout(() => {
            const pdfIframe = document.getElementById('pdfIframe');
            if (pdfIframe && pdfIframe.style.display === 'none') {
                if (pdfLoading) pdfLoading.style.display = 'none';
                if (pdfFallback) {
                    pdfFallback.style.display = 'flex';
                }
                document.getElementById('pdfInfo').textContent = 'Gagal memuat PDF';
            }
        }, 10000);
    }

    resetModalStates() {
        const pdfLoading = document.getElementById('pdfLoading');
        const pdfFallback = document.getElementById('pdfFallback');
        const pdfIframe = document.getElementById('pdfIframe');
        
        if (pdfLoading) {
            pdfLoading.style.display = 'none';
        }
        if (pdfFallback) {
            pdfFallback.style.display = 'none';
        }
        if (pdfIframe) {
            pdfIframe.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.custom-toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `custom-toast position-fixed top-0 end-0 p-3`;
        toast.style.zIndex = '99999';
        toast.innerHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0 show" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    initializeActionButtons() {
        // Generate All
        const generateBtn = document.getElementById('generate-all-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateAllTandaTerima();
            });
        }

        // Generate from empty state
        const generateEmptyBtn = document.getElementById('generate-empty-btn');
        if (generateEmptyBtn) {
            generateEmptyBtn.addEventListener('click', () => {
                this.generateAllTandaTerima();
            });
        }

        // Delete All
        const deleteAllBtn = document.getElementById('delete-all-btn');
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.deleteAllTandaTerima();
            });
        }

        // Download All
        const downloadAllBtn = document.getElementById('download-all-btn');
        if (downloadAllBtn) {
            downloadAllBtn.addEventListener('click', (e) => {
                this.handleDownloadAll(e);
            });
        }

        // Single Delete (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-tanda-terima')) {
                e.preventDefault();
                const button = e.target.closest('.delete-tanda-terima');
                const tandaTerimaId = button.getAttribute('data-id');
                const uraian = button.getAttribute('data-uraian');
                this.deleteSingleTandaTerima(tandaTerimaId, uraian);
            }
        });
    }

    showFilterLoading() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.parentElement.classList.add('filter-loading');
        }
    }

    hideFilterLoading() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.parentElement.classList.remove('filter-loading');
        }
    }

    async performSearch(searchTerm = '', tahun = '', startDate = '', endDate = '') {
        try {
            this.showLoadingState('search');
            this.showFilterLoading();
            
            let url = `${this.getBaseUrl()}/tanda-terima/search?search=${encodeURIComponent(searchTerm)}`;
            
            // Add tahun filter
            if (tahun) {
                url += `&tahun=${encodeURIComponent(tahun)}`;
            }
            
            // Add date filters
            if (startDate) {
                url += `&start_date=${encodeURIComponent(startDate)}`;
            }
            
            if (endDate) {
                url += `&end_date=${encodeURIComponent(endDate)}`;
            }

            console.log('Search URL dengan filter:', url);

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                this.updateSearchResults(data.data, data.pagination);
                this.updateCounters(data.total);
                this.updateTableCount(data.total);
                this.updateFilterInfo(data.filter_info);
                
                // Show result count toast untuk filter non-search
                if (!searchTerm && (startDate || endDate || tahun)) {
                    this.showResultCount(data.total);
                }
            } else {
                this.showError('Search failed', data.message);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search Error', 'Terjadi kesalahan saat mencari data');
        } finally {
            this.hideLoadingState('search');
            this.hideFilterLoading();
        }
    }

    showResultCount(count) {
        let message = `Ditemukan ${count} data`;
        
        // Tambahkan info filter spesifik
        const filters = [];
        
        if (this.currentFilters.startDate && this.currentFilters.endDate) {
            const start = this.formatDateDisplay(this.currentFilters.startDate);
            const end = this.formatDateDisplay(this.currentFilters.endDate);
            filters.push(`periode ${start} - ${end}`);
        }
        
        if (this.currentFilters.tahun) {
            const tahunSelect = document.getElementById('tahunFilter');
            const selectedOption = tahunSelect ? tahunSelect.options[tahunSelect.selectedIndex] : null;
            if (selectedOption) {
                filters.push(`tahun ${selectedOption.text}`);
            }
        }
        
        if (filters.length > 0) {
            message += ` untuk ${filters.join(' dan ')}`;
        }
        
        this.showToast(message, 'info');
    }

    updateFilterInfo(filterInfo = null) {
        const filterInfoElement = document.getElementById('filterInfo');
        const filterTextElement = document.getElementById('filterText');
        
        if (!filterInfoElement || !filterTextElement) return;
        
        const hasActiveFilters = 
            this.currentFilters.search || 
            this.currentFilters.tahun || 
            this.currentFilters.startDate || 
            this.currentFilters.endDate;
        
        if (hasActiveFilters) {
            let filterText = '';
            const filters = [];
            
            // Search filter
            if (this.currentFilters.search) {
                filters.push(`Pencarian: "${this.currentFilters.search}"`);
            }
            
            // Tahun filter
            if (this.currentFilters.tahun) {
                const tahunSelect = document.getElementById('tahunFilter');
                const selectedOption = tahunSelect ? tahunSelect.options[tahunSelect.selectedIndex] : null;
                const tahunText = selectedOption ? selectedOption.text : this.currentFilters.tahun;
                filters.push(`Tahun: ${tahunText}`);
            }
            
            // Date filters
            if (this.currentFilters.startDate && this.currentFilters.endDate) {
                const start = this.formatDateDisplay(this.currentFilters.startDate);
                const end = this.formatDateDisplay(this.currentFilters.endDate);
                filters.push(`Tanggal: ${start} - ${end}`);
            } else if (this.currentFilters.startDate) {
                filters.push(`Dari: ${this.formatDateDisplay(this.currentFilters.startDate)}`);
            } else if (this.currentFilters.endDate) {
                filters.push(`Sampai: ${this.formatDateDisplay(this.currentFilters.endDate)}`);
            }
            
            filterText = filters.join(' | ');
            filterTextElement.textContent = filterText;
            filterInfoElement.style.display = 'block';
        } else {
            filterInfoElement.style.display = 'none';
        }
    }

    formatDateDisplay(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    updateSearchResults(data, pagination, filterInfo = null) {
        const tbody = document.getElementById('tanda-terima-tbody');
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = this.getEmptySearchHTML();
            return;
        }

        let html = '';
        data.forEach((item, index) => {
            const number = (pagination.current_page - 1) * pagination.per_page + index + 1;
            html += this.getTableRowHTML(item, number);
        });

        tbody.innerHTML = html;
        
        console.log('Search results updated, rows:', data.length);
        
        // Update filter info jika ada
        if (filterInfo) {
            this.updateFilterInfo(filterInfo);
        }
    }

    getTableRowHTML(item, number) {
        return `
            <tr id="tanda-terima-row-${item.id}">
                <td class="py-3 ps-4">
                    <div class="fw-bold">${number}</div>
                </td>
                <td>
                    <span class="badge badge-code">${item.kode_rekening}</span>
                </td>
                <td class="text-dark">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-text me-2 text-muted"></i>
                        <span class="text-truncate" style="max-width: 300px;">${item.uraian}</span>
                    </div>
                </td>
                <td class="text-muted">
                    <i class="bi bi-calendar me-2"></i>${item.tanggal}
                </td>
                <td class="fw-bold text-success text-end">
                    <i class="bi bi-currency-dollar me-2"></i>${item.jumlah}
                </td>
                <td class="text-center pe-4">
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn table-action-btn preview-tanda-terima" 
                                title="Lihat Preview" 
                                data-id="${item.id}"
                                data-bs-toggle="modal" 
                                data-bs-target="#previewModal">
                            <i class="bi bi-eye"></i>
                        </button>
                        <a href="${this.getBaseUrl()}/tanda-terima/${item.id}/pdf" 
                           class="btn table-action-btn" 
                           title="Download PDF" 
                           target="_blank">
                            <i class="bi bi-download"></i>
                        </a>
                        <button class="btn table-action-btn delete-tanda-terima" 
                                title="Hapus Tanda Terima"
                                data-id="${item.id}"
                                data-uraian="${item.uraian}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getEmptySearchHTML() {
        return `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <div class="empty-state" style="padding: 2rem; background: transparent; border: none;">
                        <i class="bi bi-search empty-state-icon" style="font-size: 3rem; color: #cbd5e1;"></i>
                        <h5 class="text-dark mb-2">Tidak ada data yang ditemukan</h5>
                        <p class="text-muted">Coba ubah kata kunci pencarian atau filter tahun</p>
                    </div>
                </td>
            </tr>
        `;
    }

    async generateAllTandaTerima() {
        const result = await Swal.fire({
            title: 'Generate Tanda Terima Otomatis?',
            html: `
                <div class="text-center">
                    <p>Proses ini akan membuat tanda terima untuk semua transaksi Buku Kas Umum yang belum memiliki tanda terima.</p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        Pastikan tidak menutup halaman selama proses berlangsung.
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-play mr-1"></i> Mulai Generate',
            cancelButtonText: '<i class="fas fa-times mr-1"></i> Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            this.startGenerationWithProgress();
        }
    }

    async startGenerationWithProgress() {
        let totalSuccess = 0;
        let totalFailed = 0;
        let totalRecords = 0;
        let timeoutId = null;

        // Show initial progress modal
        Swal.fire({
            title: 'Memulai Generate...',
            html: `
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" style="width: 2rem; height: 2rem;"></div>
                    <p>Sedang mempersiapkan data...</p>
                    <div class="progress mt-3" style="height: 20px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                             role="progressbar" style="width: 0%">0%</div>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        try {
            // Check available data first
            const availableData = await this.checkAvailableData(true);
            totalRecords = availableData.availableCount || 0;

            if (totalRecords === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Tidak ada data',
                    text: 'Tidak ada data yang perlu digenerate.'
                });
                return;
            }

            // Set timeout for safety (10 minutes)
            timeoutId = setTimeout(() => {
                Swal.fire({
                    icon: 'warning',
                    title: 'Proses Dihentikan',
                    text: 'Proses generate dihentikan karena terlalu lama.',
                    confirmButtonText: 'Mengerti'
                });
            }, 10 * 60 * 1000);

            // Start batch processing
            await this.processBatch(0, totalSuccess, totalFailed, totalRecords, timeoutId);

        } catch (error) {
            console.error('Generation error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Gagal memulai proses generate: ' + error.message
            });
        }
    }

    async processBatch(offset, totalSuccess, totalFailed, totalRecords, timeoutId, attempt = 1) {
        try {
            const formData = new FormData();
            formData.append('_token', this.getCsrfToken());
            formData.append('offset', offset);

            const response = await fetch(`${this.getBaseUrl()}/tanda-terima/generate-batch`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const batchData = data.data;
                const newSuccess = totalSuccess + batchData.success;
                const newFailed = totalFailed + batchData.failed;
                const newOffset = batchData.offset;

                // Update progress
                this.updateProgress(batchData.progress, newSuccess, newFailed, batchData.remaining, batchData.total);

                // Continue or complete
                if (batchData.has_more && batchData.progress < 100) {
                    // Continue with next batch after short delay
                    setTimeout(() => {
                        this.processBatch(newOffset, newSuccess, newFailed, batchData.total, timeoutId, attempt + 1);
                    }, 1000);
                } else {
                    // Complete the process
                    clearTimeout(timeoutId);
                    setTimeout(() => {
                        this.showCompletionMessage(newSuccess, newFailed, batchData.total);
                    }, 1000);
                }
            } else {
                clearTimeout(timeoutId);
                this.showError('Generate Error', data.message || 'Terjadi kesalahan saat proses generate');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Batch process error:', error);
            
            // Retry logic
            if (attempt < 3) {
                Swal.showLoading();
                Swal.update({
                    html: `
                        <div class="text-center">
                            <div class="spinner-border text-warning mb-3" style="width: 2rem; height: 2rem;"></div>
                            <p>Gagal memproses batch, mencoba ulang (${attempt}/3)...</p>
                            <div class="progress mt-3" style="height: 20px;">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                                     role="progressbar" style="width: ${Math.min(attempt * 30, 90)}%">Retry ${attempt}/3</div>
                            </div>
                        </div>
                    `
                });
                
                setTimeout(() => {
                    this.processBatch(offset, totalSuccess, totalFailed, totalRecords, timeoutId, attempt + 1);
                }, 2000);
            } else {
                this.showError('Network Error', 'Terjadi kesalahan koneksi saat proses generate setelah 3x percobaan');
            }
        }
    }

    updateProgress(percent, success, failed, remaining, total) {
        const safePercent = Math.min(100, Math.max(0, percent));

        Swal.update({
            title: `Generate Tanda Terima ${safePercent}%`,
            html: `
                <div class="text-center">
                    <div class="mb-3">
                        <div class="progress" style="height: 20px; border-radius: 10px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                                role="progressbar" style="width: ${safePercent}%; font-size: 12px; font-weight: bold;">
                                ${safePercent}%
                            </div>
                        </div>
                    </div>

                    <div class="row text-center small">
                        <div class="col-3">
                            <div class="text-success font-weight-bold">${success}</div>
                            <small>Berhasil</small>
                        </div>
                        <div class="col-3">
                            <div class="text-danger font-weight-bold">${failed}</div>
                            <small>Gagal</small>
                        </div>
                        <div class="col-3">
                            <div class="text-info font-weight-bold">${remaining}</div>
                            <small>Sisa</small>
                        </div>
                        <div class="col-3">
                            <div class="text-primary font-weight-bold">${total}</div>
                            <small>Total</small>
                        </div>
                    </div>

                    ${safePercent < 100 ? `
                    <div class="mt-3">
                        <div class="spinner-border text-primary" style="width: 1.5rem; height: 1.5rem;"></div>
                        <small class="text-muted ml-2">Memproses data...</small>
                    </div>
                    ` : ''}
                </div>
            `
        });
    }

    showCompletionMessage(successCount, failedCount, totalCount) {
        const resultHtml = `
            <div class="text-center">
                <div class="mb-3">
                    <i class="fas fa-check-circle fa-3x text-success mb-2"></i>
                    <h5 class="text-success">Proses Generate Selesai!</h5>
                </div>
                
                <div class="alert alert-success">
                    <p><strong>Proses generate telah selesai.</strong></p>
                    <p class="mb-0">
                        Berhasil: <strong>${successCount}</strong> | 
                        Gagal: <strong>${failedCount}</strong> | 
                        Total: <strong>${totalCount}</strong>
                    </p>
                </div>
                
                ${failedCount > 0 ? `
                <div class="alert alert-warning mt-3">
                    <small>Beberapa data gagal digenerate. Periksa log untuk detail lebih lanjut.</small>
                </div>
                ` : ''}
            </div>
        `;

        Swal.fire({
            title: 'Proses Selesai',
            html: resultHtml,
            icon: 'success',
            confirmButtonText: '<i class="fas fa-sync-alt mr-1"></i> Refresh Halaman',
            allowOutsideClick: false
        }).then((result) => {
            location.reload();
        });
    }

    async checkAvailableData(silent = false) {
        try {
            if (!silent) this.showLoadingState('available');
            
            const response = await fetch(`${this.getBaseUrl()}/tanda-terima/check-available`);
            const data = await response.json();

            if (data.success) {
                this.updateElementText('ready-generate', data.data.availableCount || 0);
                this.updateElementText('ready-generate-badge', data.data.availableCount || 0);
                return data.data;
            } else {
                console.error('Error checking available data:', data.message);
                this.updateElementText('ready-generate', '0');
                this.updateElementText('ready-generate-badge', '0');
                return { availableCount: 0 };
            }
        } catch (error) {
            console.error('AJAX error checking available data:', error);
            this.updateElementText('ready-generate', '0');
            this.updateElementText('ready-generate-badge', '0');
            return { availableCount: 0 };
        } finally {
            if (!silent) this.hideLoadingState('available');
        }
    }

    async deleteAllTandaTerima() {
        const result = await Swal.fire({
            title: 'Hapus Semua Tanda Terima?',
            html: `
                <div class="alert alert-warning text-left">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <strong>Konfirmasi Penghapusan</strong>
                    <hr>
                    <p>Apakah Anda yakin ingin menghapus <strong>SEMUA DATA TANDA TERIMA</strong>?</p>
                    <p class="mb-0">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data tanda terima secara permanen.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash mr-1"></i> Ya, Hapus Semua!',
            cancelButtonText: '<i class="fas fa-times mr-1"></i> Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            this.processDeleteAll();
        }
    }

    async processDeleteAll() {
        this.showGlobalLoading();

        try {
            const response = await fetch(`${this.getBaseUrl()}/tanda-terima/delete/all`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Berhasil!', data.message);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                this.showError('Delete Failed', data.message);
            }
        } catch (error) {
            console.error('Delete all error:', error);
            this.showError('Delete Error', 'Terjadi kesalahan saat menghapus semua data tanda terima');
        } finally {
            this.hideGlobalLoading();
        }
    }

    deleteSingleTandaTerima(tandaTerimaId, uraian) {
        Swal.fire({
            title: 'Hapus Tanda Terima?',
            html: `
                <div class="alert alert-warning text-left">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <strong>Konfirmasi Penghapusan</strong>
                    <hr>
                    <p>Apakah Anda yakin ingin menghapus tanda terima untuk:</p>
                    <p class="mb-0"><strong>"${uraian}"</strong>?</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash mr-1"></i> Ya, Hapus!',
            cancelButtonText: '<i class="fas fa-times mr-1"></i> Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.processDeleteSingle(tandaTerimaId, uraian);
            }
        });
    }

    async processDeleteSingle(tandaTerimaId, uraian) {
        this.showGlobalLoading();

        try {
            const response = await fetch(`${this.getBaseUrl()}/tanda-terima/${tandaTerimaId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Berhasil!', data.message);
                this.removeRowFromTable(tandaTerimaId);
                this.updateCountersAfterDelete();
            } else {
                this.showError('Delete Failed', data.message);
            }
        } catch (error) {
            console.error('Delete single error:', error);
            this.showError('Delete Error', 'Terjadi kesalahan saat menghapus tanda terima');
        } finally {
            this.hideGlobalLoading();
        }
    }

    handleDownloadAll(e) {
        e.preventDefault();
        
        // Tampilkan modal konfirmasi dengan filter
        this.showDownloadConfirmation();
    }

    showDownloadConfirmation() {
        const hasActiveFilters = 
            this.currentFilters.search || 
            this.currentFilters.tahun || 
            this.currentFilters.startDate || 
            this.currentFilters.endDate;
        
        let downloadMessage = '';
        let downloadUrl = `${this.getBaseUrl()}/tanda-terima/download/all`;
        
        // Build message berdasarkan filter aktif
        if (hasActiveFilters) {
            downloadMessage = `<div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Download dengan Filter Aktif</strong>
                <hr class="my-2">
                <div class="small">`;
            
            const filters = [];
            
            if (this.currentFilters.search) {
                filters.push(`Pencarian: <strong>"${this.currentFilters.search}"</strong>`);
            }
            
            if (this.currentFilters.tahun) {
                const tahunSelect = document.getElementById('tahunFilter');
                const selectedOption = tahunSelect ? tahunSelect.options[tahunSelect.selectedIndex] : null;
                const tahunText = selectedOption ? selectedOption.text : this.currentFilters.tahun;
                filters.push(`Tahun: <strong>${tahunText}</strong>`);
            }
            
            if (this.currentFilters.startDate && this.currentFilters.endDate) {
                const start = this.formatDateDisplay(this.currentFilters.startDate);
                const end = this.formatDateDisplay(this.currentFilters.endDate);
                filters.push(`Tanggal: <strong>${start} - ${end}</strong>`);
            } else if (this.currentFilters.startDate) {
                filters.push(`Dari: <strong>${this.formatDateDisplay(this.currentFilters.startDate)}</strong>`);
            } else if (this.currentFilters.endDate) {
                filters.push(`Sampai: <strong>${this.formatDateDisplay(this.currentFilters.endDate)}</strong>`);
            }
            
            downloadMessage += filters.join('<br>');
            downloadMessage += `</div></div>`;
            
            // Tambahkan parameter filter ke URL download
            downloadUrl += '?' + new URLSearchParams({
                search: this.currentFilters.search,
                tahun: this.currentFilters.tahun,
                start_date: this.currentFilters.startDate,
                end_date: this.currentFilters.endDate
            }).toString();
            
        } else {
            downloadMessage = `<div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Download Semua Data</strong>
                <hr class="my-2">
                <div class="small">
                    Anda akan mendownload <strong>semua tanda terima</strong> tanpa filter.
                </div>
            </div>`;
        }
        
        // Tampilkan modal konfirmasi
        Swal.fire({
            title: 'Konfirmasi Download',
            html: `
                <div class="text-left">
                    ${downloadMessage}
                    <div class="mt-3 p-3 border rounded bg-light">
                        <h6 class="mb-2"><i class="bi bi-gear me-2"></i>Opsi Download:</h6>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="downloadOption" id="downloadWithFilter" value="with_filter" ${hasActiveFilters ? 'checked' : ''}>
                            <label class="form-check-label small" for="downloadWithFilter">
                                Download dengan filter saat ini
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="downloadOption" id="downloadAll" value="all" ${!hasActiveFilters ? 'checked' : ''}>
                            <label class="form-check-label small" for="downloadAll">
                                Download semua data (abaikan filter)
                            </label>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button type="button" class="btn btn-outline-secondary btn-sm" id="changeFilterBtn">
                            <i class="bi bi-funnel me-1"></i>Ubah Filter
                        </button>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="bi bi-download me-1"></i> Download Sekarang',
            cancelButtonText: '<i class="bi bi-x-circle me-1"></i> Batal',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const selectedOption = document.querySelector('input[name="downloadOption"]:checked').value;
                
                if (selectedOption === 'all') {
                    // Download semua data tanpa filter
                    return this.processDownloadAll(`${this.getBaseUrl()}/tanda-terima/download/all`);
                } else {
                    // Download dengan filter
                    return this.processDownloadAll(downloadUrl);
                }
            },
            didOpen: () => {
                // Handle tombol ubah filter
                const changeFilterBtn = document.getElementById('changeFilterBtn');
                if (changeFilterBtn) {
                    changeFilterBtn.addEventListener('click', () => {
                        Swal.close();
                        // Focus ke search input untuk memudahkan ubah filter
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    });
                }
                
                // Handle perubahan opsi download
                const downloadOptions = document.querySelectorAll('input[name="downloadOption"]');
                downloadOptions.forEach(option => {
                    option.addEventListener('change', (e) => {
                        const selectedValue = e.target.value;
                        const confirmButton = Swal.getConfirmButton();
                        
                        if (selectedValue === 'all') {
                            confirmButton.innerHTML = '<i class="bi bi-download me-1"></i> Download Semua Data';
                        } else {
                            confirmButton.innerHTML = '<i class="bi bi-download me-1"></i> Download dengan Filter';
                        }
                    });
                });
            }
        });
    }

    async processDownloadAll(downloadUrl) {
        try {
            // Show loading
            Swal.fire({
                title: 'Mempersiapkan Download...',
                html: `
                    <div class="text-center">
                        <div class="spinner-border text-primary mb-3" style="width: 2rem; height: 2rem;"></div>
                        <p class="small mb-0">Menyiapkan file PDF untuk download</p>
                        <div class="progress mt-2" style="height: 6px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                        </div>
                    </div>
                `,
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    // Start download setelah modal terbuka
                    setTimeout(() => {
                        window.open(downloadUrl, '_blank');
                        
                        // Tutup loading setelah 2 detik
                        setTimeout(() => {
                            Swal.close();
                            
                            // Tampilkan success message
                            Swal.fire({
                                icon: 'success',
                                title: 'Download Dimulai!',
                                html: `
                                    <div class="text-center">
                                        <i class="bi bi-check-circle text-success mb-2" style="font-size: 2rem;"></i>
                                        <p class="small">File sedang didownload.<br>Periksa folder download atau tab baru browser Anda.</p>
                                    </div>
                                `,
                                confirmButtonText: '<i class="bi bi-check me-1"></i> Mengerti',
                                timer: 5000,
                                showConfirmButton: true
                            });
                        }, 2000);
                    }, 500);
                }
            });

        } catch (error) {
            console.error('Download all error:', error);
            Swal.close();
            this.showError('Download Error', 'Terjadi kesalahan saat mengunduh: ' + error.message);
        }
    }

    updateCounters(total) {
        this.updateElementText('total-tanda-terima', total);
        this.updateElementText('table-count', total);
        this.updateButtonStates(total);
    }

    updateTableCount(count) {
        const tableCount = document.getElementById('table-count');
        if (tableCount) {
            tableCount.textContent = count;
        }
    }

    updateButtonStates(total) {
        const downloadAllBtn = document.getElementById('download-all-btn');
        const deleteAllBtn = document.getElementById('delete-all-btn');
        
        if (total === 0) {
            if (downloadAllBtn) downloadAllBtn.setAttribute('disabled', 'disabled');
            if (deleteAllBtn) deleteAllBtn.setAttribute('disabled', 'disabled');
        } else {
            if (downloadAllBtn) downloadAllBtn.removeAttribute('disabled');
            if (deleteAllBtn) deleteAllBtn.removeAttribute('disabled');
        }
    }

    removeRowFromTable(tandaTerimaId) {
        const row = document.getElementById(`tanda-terima-row-${tandaTerimaId}`);
        if (row) {
            row.remove();
            // Jika tidak ada data lagi, reload halaman
            if (document.querySelectorAll('#tanda-terima-tbody tr').length === 0) {
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }
    }

    updateCountersAfterDelete() {
        const currentTotal = parseInt(this.getElementText('total-tanda-terima')) || 0;
        const newTotal = Math.max(0, currentTotal - 1);
        
        this.updateElementText('total-tanda-terima', newTotal);
        this.updateElementText('table-count', newTotal);
        this.updateButtonStates(newTotal);
    }

    updateLastUpdated() {
        const now = new Date();
        const formattedTime = now.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        this.updateElementText('last-updated', formattedTime);
    }

    startPeriodicUpdates() {
        // Update time every minute
        setInterval(() => {
            this.updateLastUpdated();
        }, 60000);

        // Check available data every 30 seconds
        setInterval(() => {
            this.checkAvailableData(true);
        }, 30000);
    }

    showGlobalLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) loading.style.display = 'block';
    }

    hideGlobalLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) loading.style.display = 'none';
    }

    showLoadingState(type) {
        const element = document.getElementById(`${type}-loading`);
        if (element) {
            element.classList.add('loading-pulse');
        }
    }

    hideLoadingState(type) {
        const element = document.getElementById(`${type}-loading`);
        if (element) {
            element.classList.remove('loading-pulse');
        }
    }

    showError(title, message) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: '<i class="fas fa-times mr-1"></i> Tutup'
        });
    }

    showSuccess(title, message) {
        Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            confirmButtonText: '<i class="fas fa-check mr-1"></i> Oke'
        });
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    }

    getElementText(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.textContent : '';
    }

    getBaseUrl() {
        return window.location.origin;
    }

    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.tandaTerimaManager = new TandaTerimaManager();
});