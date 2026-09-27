package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTradeRequestDto {
    @NotNull(message = "ID cầu thủ bên mình không được để trống")
    private UUID playerOfferedId;

    @NotNull(message = "ID cầu thủ muốn đổi không được để trống")
    private UUID playerWantedId;
}
