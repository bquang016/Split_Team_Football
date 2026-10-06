package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PlayerStatItemDto {
    @NotNull(message = "ID cầu thủ không được để trống")
    private UUID userId;

    private Team team;

    @Min(value = 0, message = "Số bàn thắng không thể âm")
    private Integer goals = 0;

    @Min(value = 0, message = "Số kiến tạo không thể âm")
    private Integer assists = 0;

    @Min(value = 0, message = "Số cứu thua không thể âm")
    private Integer saves = 0;

    private Boolean isWinner = false;

    private Boolean isMvp = false;

    @jakarta.validation.constraints.DecimalMin(value = "0.0", message = "Điểm đánh giá không thể nhỏ hơn 0")
    @jakarta.validation.constraints.DecimalMax(value = "10.0", message = "Điểm đánh giá tối đa là 10.0")
    private Double rating;
}
