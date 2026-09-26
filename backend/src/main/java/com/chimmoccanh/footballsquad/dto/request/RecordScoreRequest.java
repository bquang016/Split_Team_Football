package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecordScoreRequest {
    @NotNull(message = "Tỉ số đội A không được để trống")
    @Min(value = 0, message = "Tỉ số không thể âm")
    private Integer scoreTeamA;

    @NotNull(message = "Tỉ số đội B không được để trống")
    @Min(value = 0, message = "Tỉ số không thể âm")
    private Integer scoreTeamB;
}
