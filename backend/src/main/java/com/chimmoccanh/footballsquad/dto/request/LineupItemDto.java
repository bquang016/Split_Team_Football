package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.Position;
import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class LineupItemDto {
    @NotNull(message = "ID cầu thủ không được để trống")
    private UUID userId;

    @NotNull(message = "Đội không được để trống")
    private Team team;

    private Position positionLabel;

    private Double xPercent;

    private Double yPercent;

    private Integer jerseyNumber;
}
