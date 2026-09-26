package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateMatchStatusRequest {
    @NotNull(message = "Trạng thái trận đấu không được để trống")
    private MatchStatus status;
}
