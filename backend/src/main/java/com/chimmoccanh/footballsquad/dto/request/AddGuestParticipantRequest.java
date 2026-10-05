package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddGuestParticipantRequest {
    @NotBlank(message = "Tên cầu thủ khách không được để trống")
    private String fullName;

    private Integer jerseyNumber;
}
