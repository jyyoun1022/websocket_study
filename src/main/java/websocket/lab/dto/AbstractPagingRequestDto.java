package websocket.lab.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.NoArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;

@NoArgsConstructor
public class AbstractPagingRequestDto {
    private static final long serialVersionUID = 1L;
    @JsonIgnore
    private final String lang = LocaleContextHolder.getLocale().getLanguage();
    private long startRow = 0L;
    private long pageIndex = 1L;
    private long pageSize = 15L;
    private String sortColumn = "";
    private String sortType = "asc";
    private boolean sortAscending = true;
    private boolean isPaging = true;


    public void setPageIndex(long _pageIndex) {
        this.pageIndex = _pageIndex;
        this.calcPaging();
    }

    public void setPageSize(long _pageSize) {
        this.pageSize = _pageSize;
        this.calcPaging();
    }

    public void setSortAscending(boolean _sortAscending) {
        this.sortAscending = _sortAscending;
        if (_sortAscending) {
            this.sortType = "asc";
        } else {
            this.sortType = "desc";
        }

    }

    private void calcPaging() {
        this.startRow = (this.pageIndex - 1L) * this.pageSize;
    }

    public String getLang() {
        return this.lang;
    }

    public long getStartRow() {
        return this.startRow;
    }

    public void setStartRow(final long startRow) {
        this.startRow = startRow;
    }

    public long getPageIndex() {
        return this.pageIndex;
    }

    public long getPageSize() {
        return this.pageSize;
    }

    public String getSortColumn() {
        return this.sortColumn;
    }

    public void setSortColumn(final String sortColumn) {
        this.sortColumn = sortColumn;
    }

    public String getSortType() {
        return this.sortType;
    }

    public void setSortType(final String sortType) {
        this.sortType = sortType;
    }

    public boolean isSortAscending() {
        return this.sortAscending;
    }

    public boolean isPaging() {
        return this.isPaging;
    }

    public void setPaging(final boolean isPaging) {
        this.isPaging = isPaging;
    }
}
