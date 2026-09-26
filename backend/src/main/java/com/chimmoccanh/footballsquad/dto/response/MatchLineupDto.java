package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.MatchLineup;
import com.chimmoccanh.footballsquad.model.enums.Position;
import com.chimmoccanh.footballsquad.model.enums.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchLineupDto {
    private UUID id;
    private UUID matchId;
    private UserDto user;
    private Team team;
    private Position positionLabel;
    private Double xPercent;
    private Double yPercent;
    private Integer jerseyNumber;

    public static MatchLineupDto fromEntity(MatchLineup lineup) {
        if (lineup == null) return null;
        return MatchLineupDto.builder()
                .id(lineup.getId())
                .matchId(lineup.getMatch() != null ? lineup.getMatch().getId() : null)
                .user(UserDto.fromEntity(lineup.getUser()))
                .team(lineup.getTeam())
                .positionLabel(lineup.getPositionLabel())
                .xPercent(lineup.getXPercent())
                .yPercent(lineup.getYPercent())
                .jerseyNumber(lineup.getJerseyNumber())
                .build();
    }
}
