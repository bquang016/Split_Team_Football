package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class RecordStatsRequest {
    @NotEmpty(message = "Danh sách thống kê cầu thủ không được rỗng")
    @Valid
    private List<PlayerStatItemDto> stats;
}
