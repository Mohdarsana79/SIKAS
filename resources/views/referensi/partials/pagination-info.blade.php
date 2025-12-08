<div class="d-flex justify-content-between align-items-center mt-4">
    <div class="text-muted small">
        Menampilkan <span class="fw-semibold">{{ $kodeKegiatans->firstItem() ?? 0 }}</span> sampai
        <span class="fw-semibold">{{ $kodeKegiatans->lastItem() ?? 0 }}</span> dari
        <span class="fw-semibold">{{ $kodeKegiatans->total() }}</span> data
    </div>
    <div class="pagination-container">
        {{ $kodeKegiatans->onEachSide(1)->links('vendor.pagination.bootstrap-5') }}
    </div>
</div>