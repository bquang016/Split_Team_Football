package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddGuestParticipantRequest {
    @NotBlank(message = "Tên cầu thủ khách không được để trống")
    private String fullName;

    @NotNull(message = "Vui lòng chọn số áo cho cầu thủ khách")
    @Min(value = 1, message = "Số áo phải từ 1 đến 99")
    @Max(value = 99, message = "Số áo phải từ 1 đến 99")
    private Integer jerseyNumber;
}
