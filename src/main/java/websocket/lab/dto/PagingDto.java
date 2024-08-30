package websocket.lab.dto;

public class PagingDto extends AbstractBaseDto {
    private static final long serialVersionUID = 1L;
    private long totalCount = 0L;
    private long pageIndex = 1L;
    private long pageSize = 15L;
    private long pageGroupSize = 5L;
    private long pageGroupCount;
    private long nowPageGroup;
    private long nextGroupIndex;
    private long startPage;
    private long endPage;
    private long lastPage;

    public PagingDto(long _totalCount, AbstractPagingRequestDto _pagingInfo) {
        this.totalCount = _totalCount;
        this.pageIndex = _pagingInfo.getPageIndex();
        this.pageSize = _pagingInfo.getPageSize();
        this.calcPaging();
    }

    public PagingDto(long _totalCount, AbstractPagingRequestDto _pagingInfo, long _pageGroupSize) {
        this.totalCount = _totalCount;
        this.pageIndex = _pagingInfo.getPageIndex();
        this.pageSize = _pagingInfo.getPageSize();
        this.pageGroupSize = _pageGroupSize;
        this.calcPaging();
    }

    public PagingDto(long _totalCount, long _pageIndex) {
        this.totalCount = _totalCount;
        this.pageIndex = _pageIndex;
        this.calcPaging();
    }

    public PagingDto(long _totalCount, long _pageIndex, long _pageSize) {
        this.totalCount = _totalCount;
        this.pageIndex = _pageIndex;
        this.pageSize = _pageSize;
        this.calcPaging();
    }

    public PagingDto(long _totalCount, long _pageIndex, long _pageSize, long _pageGroupSize) {
        this.totalCount = _totalCount;
        this.pageIndex = _pageIndex;
        this.pageSize = _pageSize;
        this.pageGroupSize = _pageGroupSize;
        this.calcPaging();
    }

    private void calcPaging() {
        this.pageGroupCount = this.totalCount / (this.pageSize * this.pageGroupSize) + (long)(this.totalCount % (this.pageSize * this.pageGroupSize) == 0L ? 0 : 1);
        this.nowPageGroup = (long)Math.ceil((double)this.pageIndex / (double)this.pageGroupSize);
        this.startPage = this.pageGroupSize * (this.nowPageGroup - 1L) + 1L;
        this.endPage = this.startPage + this.pageGroupSize - 1L;
        long _pageCount = this.totalCount / this.pageSize + (long)(this.totalCount % this.pageSize == 0L ? 0 : 1);
        this.endPage = this.endPage > _pageCount ? _pageCount : this.endPage;
        long _lastPageIndex = this.totalCount / this.pageSize;
        _lastPageIndex = this.totalCount % this.pageSize == 0L ? _lastPageIndex : _lastPageIndex + 1L;
        long _beforeGroupIndex = this.nowPageGroup * this.pageGroupSize - this.pageGroupSize;
        _beforeGroupIndex = _beforeGroupIndex < 1L ? 1L : _beforeGroupIndex;
        this.nextGroupIndex = this.nowPageGroup * this.pageGroupSize + 1L;
        this.nextGroupIndex = this.nextGroupIndex > _lastPageIndex ? _lastPageIndex : this.nextGroupIndex;
        this.lastPage = _lastPageIndex;
    }

    public long getTotalCount() {
        return this.totalCount;
    }

    public long getPageIndex() {
        return this.pageIndex;
    }

    public long getPageSize() {
        return this.pageSize;
    }

    public long getPageGroupSize() {
        return this.pageGroupSize;
    }

    public long getPageGroupCount() {
        return this.pageGroupCount;
    }

    public long getNowPageGroup() {
        return this.nowPageGroup;
    }

    public long getNextGroupIndex() {
        return this.nextGroupIndex;
    }

    public long getStartPage() {
        return this.startPage;
    }

    public long getEndPage() {
        return this.endPage;
    }

    public long getLastPage() {
        return this.lastPage;
    }
}
