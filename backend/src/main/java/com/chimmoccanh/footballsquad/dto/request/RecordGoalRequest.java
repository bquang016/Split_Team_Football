package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordGoalRequest {

    @NotNull(message = "Cầu thủ ghi bàn không được để trống")
    private UUID scorerId;

    private UUID assistId;

    @NotNull(message = "Đội bóng không được để trống")
    private Team team;

    private Integer minute; // Phút thi đấu (nếu để trống hệ thống tự tính từ startAt)

    @Builder.Default
    private Integer goalCount = 1;
}
