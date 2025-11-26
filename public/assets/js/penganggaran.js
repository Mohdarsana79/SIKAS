class PenganggaranManager {
    constructor() {
        this.init();
    }

    init() {
        this.initEventListeners();
        this.initSweetAlertMessages();
        this.checkAndDisableDeleteButtons();
        this.initEditFunctionality();
        this.hideEditButtonsIfPerubahanExists();
    }

    initEventListeners() {
        // Format input angka tambah anggaran
        $('#pagu_anggaran').on('input', (e) => {
            this.formatRupiah(e.target);
        });

        // Reset form ketika modal ditutup
        $('#tambahAnggaranModal').on('hidden.bs.modal', function() {
            $('#formTambahAnggaran')[0].reset();
            $('#formTambahAnggaran').find('.is-invalid').removeClass('is-invalid');
        });

        // Validasi form sebelum submit
        $('#formTambahAnggaran').on('submit', (e) => {
            this.validateForm(e);
        });

        // Hapus validasi ketika user mulai mengetik
        $('input[required]').on('input', function() {
            if ($(this).val().trim() !== '') {
                $(this).removeClass('is-invalid');
            }
        });

        // Event delegation untuk tombol hapus
        $(document).on('click', '.btn-hapus-anggaran', (e) => {
            this.handleDeleteAnggaran(e);
        });

        $(document).on('click', '.btn-hapus-rkas-perubahan', (e) => {
            this.handleDeleteRkasPerubahan(e);
        });
    }

    initEditFunctionality() {
        console.log('Initializing edit functionality...');

        // Event delegation untuk tombol edit
        $(document).on('click', '.btn-edit-anggaran', (e) => {
            console.log('Edit button clicked');
            this.handleEditAnggaran(e);
        });

        // Format input angka edit anggaran
        $('#edit_pagu_anggaran').on('input', (e) => {
            this.formatRupiah(e.target);
        });

        // Reset validasi ketika modal edit ditutup
        $('#editAnggaranModal').on('hidden.bs.modal', function() {
            $('#formEditAnggaran').find('.is-invalid').removeClass('is-invalid');
        });

        // Validasi form edit sebelum submit
        $('#formEditAnggaran').on('submit', (e) => {
            this.validateEditForm(e);
        });

        // Hapus validasi edit ketika user mulai mengetik
        $('#formEditAnggaran input[required]').on('input', function() {
            if ($(this).val().trim() !== '') {
                $(this).removeClass('is-invalid');
            }
        });

        // Saat modal edit akan dibuka, bersihkan format
        $('#editAnggaranModal').on('show.bs.modal', () => {
            const paguInput = $('#edit_pagu_anggaran');
            const currentValue = paguInput.val();
            if (currentValue) {
                // Hapus format titik untuk editing
                const cleanValue = this.getNumericValue(currentValue);
                paguInput.val(cleanValue);
            }
        });
    }

    // METHOD UNTUK FORMAT RUPIAH REAL-TIME
    formatRupiah(input) {
        // Simpan cursor position
        const cursorPosition = input.selectionStart;
        
        // Dapatkan value dan hapus semua karakter non-digit
        let value = input.value.replace(/[^\d]/g, '');
        
        if (value === '') {
            input.value = '';
            return;
        }
        
        // Format dengan titik sebagai pemisah ribuan
        const formatted = parseInt(value).toLocaleString('id-ID');
        
        // Update value
        input.value = formatted;
        
        // Adjust cursor position
        const newCursorPosition = this.calculateNewCursorPosition(cursorPosition, value, formatted);
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    // METHOD UNTUK MENGHITUNG POSISI CURSOR BARU
    calculateNewCursorPosition(oldPosition, originalValue, formattedValue) {
        // Hitung digit sebelum cursor di value asli
        const digitsBeforeCursor = originalValue.substring(0, oldPosition);
        
        // Hitung berapa banyak karakter non-digit (titik) yang akan ditambahkan sebelum posisi cursor
        let digitCount = 0;
        let newPosition = 0;
        
        for (let i = 0; i < formattedValue.length; i++) {
            if (formattedValue[i].match(/\d/)) {
                digitCount++;
            }
            
            // Jika kita sudah melewati jumlah digit yang sama dengan sebelum cursor
            if (digitCount > digitsBeforeCursor.length) {
                break;
            }
            
            newPosition = i + 1;
        }
        
        return newPosition;
    }

    // METHOD UNTUK KONVERSI KE FORMAT RUPIAH
    formatToRupiah(number) {
        if (!number) return '';
        const cleanNumber = this.getNumericValue(number);
        if (cleanNumber === '') return '';
        return parseInt(cleanNumber).toLocaleString('id-ID');
    }

    // METHOD UNTUK MENGAMBIL NILAI NUMERIK DARI FORMAT RUPIAH (HAPUS TITIK DAN DESIMAL)
    getNumericValue(rupiahString) {
        if (!rupiahString || rupiahString === '') return '';
        
        console.log('getNumericValue input:', rupiahString);
        
        // Hapus semua karakter non-digit termasuk titik
        let cleanValue = rupiahString.toString().replace(/\./g, '');
        
        console.log('getNumericValue output:', cleanValue);
        
        return cleanValue;
    }

    // METHOD UNTUK HANDLE EDIT - PERBAIKI BAGIAN INI
    handleEditAnggaran(e) {
        e.preventDefault();
        const $button = $(e.currentTarget);
        
        console.log('Edit button data:', $button.data());

        // Ambil semua data
        const formData = {
            id: $button.data('id'),
            tahun: $button.data('tahun'),
            pagu: $button.data('pagu'), // Ini dari database dengan format 1000000.00
            kepalaSekolah: $button.data('kepala-sekolah'),
            nipKepalaSekolah: $button.data('nip-kepala-sekolah'),
            skKepalaSekolah: $button.data('sk-kepala-sekolah'),
            bendahara: $button.data('bendahara'),
            nipBendahara: $button.data('nip-bendahara'),
            skBendahara: $button.data('sk-bendahara'),
            komite: $button.data('komite'),
            tanggalSkKepalaSekolah: $button.data('tanggal-sk-kepala-sekolah') || '',
            tanggalSkBendahara: $button.data('tanggal-sk-bendahara') || ''
        };

        console.log('Pagu dari database (raw):', formData.pagu);
        console.log('Tipe data pagu:', typeof formData.pagu);

        // Set action form
        $('#formEditAnggaran').attr('action', `/penganggaran/${formData.id}`);

        // PROSES PAGU: Handle berbagai format dari database
        let paguValue = formData.pagu;
        
        // Jika pagu berupa string dengan desimal (contoh: "1000000.00")
        if (typeof paguValue === 'string' && paguValue.includes('.')) {
            paguValue = paguValue.split('.')[0]; // Ambil bagian integer saja
            console.log('Pagu setelah hapus desimal:', paguValue);
        }
        
        // Jika pagu berupa number dengan desimal (contoh: 1000000.00)
        if (typeof paguValue === 'number') {
            paguValue = Math.floor(paguValue).toString(); // Ambil bagian integer
            console.log('Pagu setelah floor:', paguValue);
        }
        
        // Konversi ke string dan hapus karakter non-digit
        paguValue = paguValue.toString().replace(/[^\d]/g, '');
        console.log('Pagu final untuk input:', paguValue);

        // Isi form dengan data - untuk pagu, gunakan angka tanpa format
        $('#edit_pagu_anggaran').val(paguValue);
        $('#edit_tahun_anggaran').val(formData.tahun);
        $('#edit_kepala_sekolah').val(formData.kepalaSekolah);
        $('#edit_nip_kepala_sekolah').val(formData.nipKepalaSekolah);
        $('#edit_sk_kepala_sekolah').val(formData.skKepalaSekolah);
        $('#edit_bendahara').val(formData.bendahara);
        $('#edit_nip_bendahara').val(formData.nipBendahara);
        $('#edit_sk_bendahara').val(formData.skBendahara);
        $('#edit_komite').val(formData.komite);
        $('#edit_tanggal_sk_kepala_sekolah').val(formData.tanggalSkKepalaSekolah);
        $('#edit_tanggal_sk_bendahara').val(formData.tanggalSkBendahara);

        // Tampilkan modal
        $('#editAnggaranModal').modal('show');
    }

    // VALIDASI FORM TAMBAH
    validateForm(e) {
        let isValid = true;
        
        // Handle pagu anggaran - hapus format sebelum validasi
        const paguInput = $('#pagu_anggaran');
        const paguValue = this.getNumericValue(paguInput.val());
        
        console.log('Validasi tambah - Pagu value:', paguValue);
        
        if (paguValue.trim() === '' || paguValue === '0') {
            isValid = false;
            paguInput.addClass('is-invalid');
        } else {
            paguInput.removeClass('is-invalid');
            // Set nilai bersih untuk submit - TANPA MENGUBAH INPUT
            // Biarkan input tetap dengan format untuk UX yang baik
        }
        
        // Validasi field required lainnya
        $('#formTambahAnggaran').find('input[required]').not('#pagu_anggaran').each(function() {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            this.showAlert('warning', 'Perhatian', 'Harap lengkapi semua field yang wajib diisi!');
        } else {
            // Sebelum submit, set nilai pagu ke format numeric
            const cleanPagu = this.getNumericValue(paguInput.val());
            paguInput.val(cleanPagu);
            console.log('Nilai pagu sebelum submit:', cleanPagu);
        }
    }

    // VALIDASI FORM EDIT
    validateEditForm(e) {
        let isValid = true;
        
        // Handle pagu anggaran - hapus format sebelum validasi
        const paguInput = $('#edit_pagu_anggaran');
        const paguValue = this.getNumericValue(paguInput.val());
        
        console.log('Validasi edit - Pagu value:', paguValue);
        
        if (paguValue.trim() === '' || paguValue === '0') {
            isValid = false;
            paguInput.addClass('is-invalid');
        } else {
            paguInput.removeClass('is-invalid');
            // Set nilai bersih untuk submit - TANPA MENGUBAH INPUT
            // Biarkan input tetap dengan format untuk UX yang baik
        }
        
        // Validasi field required lainnya
        $('#formEditAnggaran').find('input[required]').not('#edit_pagu_anggaran').each(function() {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            this.showAlert('warning', 'Perhatian', 'Harap lengkapi semua field yang wajib diisi!');
        } else {
            // Sebelum submit, set nilai pagu ke format numeric
            const cleanPagu = this.getNumericValue(paguInput.val());
            paguInput.val(cleanPagu);
            console.log('Nilai pagu sebelum submit:', cleanPagu);
        }
    }

    checkAndDisableDeleteButtons() {
        $('.rkas-item').each(function() {
            const $card = $(this);
            const tahun = $card.find('.btn-hapus-anggaran').data('tahun');
            const hasPerubahan = $card.next('.rkas-item').hasClass('border-warning') && 
                               !$card.next('.rkas-item').hasClass('d-none');
            
            if (hasPerubahan) {
                $card.find('.btn-hapus-anggaran')
                    .addClass('disabled')
                    .prop('disabled', true)
                    .attr('title', 'Tidak dapat dihapus karena sudah ada RKAS Perubahan')
                    .removeClass('btn-outline-danger')
                    .addClass('btn-outline-secondary');
            }
        });
    }

    handleDeleteAnggaran(e) {
        const $button = $(e.currentTarget);
        
        // Cek jika tombol disabled
        if ($button.hasClass('disabled')) {
            this.showAlert('warning', 'Tidak Dapat Dihapus', 'RKAS tidak dapat dihapus karena sudah ada RKAS Perubahan untuk tahun anggaran ini.');
            return;
        }

        const id = $button.data('id');
        const tahun = $button.data('tahun');
        const pagu = $button.data('pagu');

        // Format pagu untuk display di alert
        let paguDisplay = pagu;
        if (typeof pagu === 'string' && pagu.includes('.')) {
            paguDisplay = pagu.split('.')[0];
        } else if (typeof pagu === 'number') {
            paguDisplay = Math.floor(pagu).toString();
        }
        paguDisplay = this.formatToRupiah(paguDisplay);

        this.showConfirmDialog(
            'Hapus Anggaran?',
            `Apakah Anda yakin ingin menghapus anggaran tahun <strong>${tahun}</strong> dengan pagu <strong>Rp ${paguDisplay}</strong>?<br><br><span class="text-danger">Data yang dihapus tidak dapat dikembalikan!</span>`,
            'warning',
            'Ya, Hapus!'
        ).then((result) => {
            if (result.isConfirmed) {
                this.showLoading('Menghapus...', 'Sedang menghapus data anggaran');
                this.deleteData(`/penganggaran/${id}`, tahun, 'anggaran');
            }
        });
    }

    handleDeleteRkasPerubahan(e) {
        const $button = $(e.currentTarget);
        const id = $button.data('id');
        const tahun = $button.data('tahun');

        this.showConfirmDialog(
            'Hapus RKAS Perubahan?',
            `Apakah Anda yakin ingin menghapus <strong>RKAS Perubahan</strong> tahun <strong>${tahun}</strong>?<br><br><span class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Hanya data RKAS Perubahan yang akan dihapus. Data RKAS awal tetap tersimpan.</span>`,
            'warning',
            'Ya, Hapus!',
            '#f59e0b'
        ).then((result) => {
            if (result.isConfirmed) {
                this.showLoading('Menghapus...', 'Sedang menghapus data RKAS Perubahan');
                this.deleteData(`/penganggaran/rkas-perubahan/${id}`, tahun, 'RKAS Perubahan');
            }
        });
    }

    deleteData(url, tahun, type) {
        // Ambil CSRF token dari meta tag
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                _token: csrfToken,
                _method: 'DELETE'
            },
            success: (response) => {
                Swal.close();
                this.showAlert('success', 'Berhasil!', `Data ${type} tahun ${tahun} berhasil dihapus`, true);
            },
            error: (xhr) => {
                Swal.close();
                let errorMessage = `Gagal menghapus data ${type}`;
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                this.showAlert('error', 'Gagal!', errorMessage);
            }
        });
    }

    showConfirmDialog(title, html, icon, confirmText, confirmColor = '#d33') {
        return Swal.fire({
            title: title,
            html: html,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: '#6b7280',
            confirmButtonText: confirmText,
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
    }

    showLoading(title, text) {
        Swal.fire({
            title: title,
            text: text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    showAlert(icon, title, text, reload = false) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonColor: icon === 'success' ? '#10b981' : '#ef4444',
            timer: reload ? 3000 : undefined,
            showConfirmButton: true
        }).then(() => {
            if (reload) {
                location.reload();
            }
        });
    }

    initSweetAlertMessages() {
        // Handle SweetAlert untuk pesan sukses dari session
        if (typeof successMessage !== 'undefined' && successMessage) {
            this.showAlert('success', 'Berhasil!', successMessage);
        }

        if (typeof errorMessage !== 'undefined' && errorMessage) {
            this.showAlert('error', 'Gagal!', errorMessage);
        }
    }

    // Sembunyikan tombol edit jika ada RKAS Perubahan
    hideEditButtonsIfPerubahanExists() {
        $('.rkas-item').each(function() {
            const $card = $(this);
            const hasPerubahan = $card.next('.rkas-item').hasClass('border-warning') && 
                               !$card.next('.rkas-item').hasClass('d-none');
            
            if (hasPerubahan) {
                // Sembunyikan tombol edit di card ini
                $card.find('.btn-edit-anggaran').remove();
                
                console.log('Tombol edit disembunyikan karena ada RKAS Perubahan');
            }
        });
    }

    // Refresh tombol edit ketika ada perubahan data
    refreshEditButtons() {
        this.hideEditButtonsIfPerubahanExists();
    }
}

// Inisialisasi class ketika document ready
$(document).ready(function() {
    console.log('Document ready, initializing PenganggaranManager...');
    new PenganggaranManager();
});