package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class SaveLineupRequest {
    @NotEmpty(message = "Danh sách cầu thủ trong đội hình không được rỗng")
    @Valid
    private List<LineupItemDto> lineups;
}
