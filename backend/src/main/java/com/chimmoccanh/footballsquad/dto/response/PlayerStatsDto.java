package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.PlayerStats;
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
public class PlayerStatsDto {
    private UUID id;
    private UUID matchId;
    private UserDto user;
    private Team team;
    private Integer goals;
    private Integer assists;
    private Boolean isWinner;
    private Boolean isMvp;
    private UserDto enteredBy;
    private LocalDateTime enteredAt;

    public static PlayerStatsDto fromEntity(PlayerStats stats) {
        if (stats == null) return null;
        return PlayerStatsDto.builder()
                .id(stats.getId())
                .matchId(stats.getMatch() != null ? stats.getMatch().getId() : null)
                .user(UserDto.fromEntity(stats.getUser()))
                .team(stats.getTeam())
                .goals(stats.getGoals())
                .assists(stats.getAssists())
                .isWinner(stats.getIsWinner())
                .isMvp(stats.getIsMvp())
                .enteredBy(UserDto.fromEntity(stats.getEnteredBy()))
                .enteredAt(stats.getEnteredAt())
                .build();
    }
}
