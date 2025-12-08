@forelse ($kodeKegiatans as $key => $kegiatan)
<tr>
    <td>{{ ($kodeKegiatans->currentPage() - 1) * $kodeKegiatans->perPage() + $key + 1 }}</td>
    <td>{{ $kegiatan->kode }}</td>
    <td>{{ $kegiatan->program }}</td>
    <td>{{ $kegiatan->sub_program }}</td>
    <td>{{ $kegiatan->uraian }}</td>
    <td>
        <button class="btn btn-sm btn-warning btn-edit" data-id="{{ $kegiatan->id }}" data-kode="{{ $kegiatan->kode }}"
            data-program="{{ $kegiatan->program }}" data-sub-program="{{ $kegiatan->sub_program }}"
            data-uraian="{{ $kegiatan->uraian }}">
            <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="{{ $kegiatan->id }}" data-kode="{{ $kegiatan->kode }}"
            data-program="{{ $kegiatan->program }}" data-sub-program="{{ $kegiatan->sub_program }}"
            data-uraian="{{ $kegiatan->uraian }}">
            <i class="bi bi-trash"></i>
        </button>
    </td>
</tr>
@empty
<tr>
    <td colspan="6" class="text-center text-muted py-4">
        <i class="bi bi-search me-2"></i>Tidak ada data ditemukan
    </td>
</tr>
@endforelse