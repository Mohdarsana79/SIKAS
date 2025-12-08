<div class="d-flex justify-content-between align-items-center mt-4">
    <div class="text-muted small">
        Menampilkan <span class="fw-semibold">{{ $rekenings->firstItem() ?? 0 }}</span> sampai
        <span class="fw-semibold">{{ $rekenings->lastItem() ?? 0 }}</span> dari
        <span class="fw-semibold">{{ $rekenings->total() }}</span> data
    </div>
    <div class="pagination-container">
        {{ $rekenings->onEachSide(1)->links('vendor.pagination.bootstrap-5') }}
    </div>
</div>