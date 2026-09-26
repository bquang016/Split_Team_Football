package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class StartSpinRequest {
    @NotNull(message = "Đội trưởng A không được để trống")
    private UUID hostAId;

    @NotNull(message = "Đội trưởng B không được để trống")
    private UUID hostBId;
}
