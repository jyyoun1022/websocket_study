package websocket.lab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponseDto<T> {

    @Builder.Default
    private boolean result = true;
    private T data;
    private PagingDto paging;
}
