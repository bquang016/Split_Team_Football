package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.MatchGoal;
import com.chimmoccanh.footballsquad.model.enums.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchGoalDto {
    private UUID id;
    private UUID matchId;
    private UserDto scorer;
    private UserDto assist;
    private Team team;
    private Integer minute;
    private Integer goalCount;
    private LocalDateTime createdAt;

    public static MatchGoalDto fromEntity(MatchGoal goal) {
        if (goal == null) return null;
        return MatchGoalDto.builder()
                .id(goal.getId())
                .matchId(goal.getMatch() != null ? goal.getMatch().getId() : null)
                .scorer(UserDto.fromEntity(goal.getScorer()))
                .assist(goal.getAssist() != null ? UserDto.fromEntity(goal.getAssist()) : null)
                .team(goal.getTeam())
                .minute(goal.getMinute())
                .goalCount(goal.getGoalCount())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
