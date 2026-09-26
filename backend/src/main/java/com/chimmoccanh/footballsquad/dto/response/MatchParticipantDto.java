package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.MatchParticipant;
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
public class MatchParticipantDto {
    private UUID id;
    private UUID matchId;
    private UserDto user;
    private Team team;
    private Boolean isHost;
    private Integer pickOrder;
    private Integer jerseyNumber;
    private LocalDateTime joinedAt;

    public static MatchParticipantDto fromEntity(MatchParticipant participant) {
        if (participant == null) return null;
        return MatchParticipantDto.builder()
                .id(participant.getId())
                .matchId(participant.getMatch() != null ? participant.getMatch().getId() : null)
                .user(UserDto.fromEntity(participant.getUser()))
                .team(participant.getTeam())
                .isHost(participant.getIsHost())
                .pickOrder(participant.getPickOrder())
                .jerseyNumber(participant.getJerseyNumber())
                .joinedAt(participant.getJoinedAt())
                .build();
    }
}
