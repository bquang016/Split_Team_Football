package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.Position;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("xPercent")
    @JsonAlias({"x_percent", "xPercent", "XPercent", "xpercent"})
    private Double xPercent;

    @JsonProperty("yPercent")
    @JsonAlias({"y_percent", "yPercent", "YPercent", "ypercent"})
    private Double yPercent;

    private Integer jerseyNumber;
}
