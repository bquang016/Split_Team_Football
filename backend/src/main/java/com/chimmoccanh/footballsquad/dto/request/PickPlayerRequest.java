package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PickPlayerRequest {
    @NotNull(message = "ID cầu thủ không được để trống")
    private UUID userId;

    @NotNull(message = "Đội không được để trống")
    private Team team;

    private Integer pickOrder;
}
