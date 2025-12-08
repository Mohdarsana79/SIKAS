@forelse ($rekenings as $key => $rekening)
<tr>
    <td>{{ ($rekenings->currentPage() - 1) * $rekenings->perPage() + $key + 1 }}</td>
    <td>{{ $rekening->kode_rekening }}</td>
    <td>{{ $rekening->rincian_objek }}</td>
    <td>{{ $rekening->kategori }}</td>
    <td>
        <button class="btn btn-sm btn-warning btn-edit" data-id="{{ $rekening->id }}"
            data-kode-rekening="{{ $rekening->kode_rekening }}" data-rincian-objek="{{ $rekening->rincian_objek }}"
            data-kategori="{{ $rekening->kategori }}">
            <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="{{ $rekening->id }}"
            data-kode-rekening="{{ $rekening->kode_rekening }}" data-rincian-objek="{{ $rekening->rincian_objek }}"
            data-kategori="{{ $rekening->kategori }}">
            <i class="bi bi-trash"></i>
        </button>
    </td>
</tr>
@empty
<tr>
    <td colspan="5" class="text-center text-muted py-4">
        <i class="bi bi-search me-2"></i>Tidak ada data ditemukan
    </td>
</tr>
@endforelse