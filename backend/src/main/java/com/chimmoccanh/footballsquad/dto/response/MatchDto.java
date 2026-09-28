package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchDto {
    private UUID id;
    private String title;
    private LocalDate matchDate;
    private LocalTime matchTime;
    private String location;
    private MatchStatus status;
    private UserDto createdBy;
    private Integer scoreTeamA;
    private Integer scoreTeamB;
    private String aiAnalysis;
    private LocalDateTime aiAnalyzedAt;
    private String notes;
    private String jerseyWinnerTeam;    // "SPAIN" hoặc "FRANCE"
    private String firstPickTeam;       // "A" hoặc "B"
    private LocalDateTime pickTurnStartedAt;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime createdAt;
    private boolean isDeleted;
    private LocalDateTime deletedAt;
    private UserDto deletedBy;

    private List<MatchParticipantDto> participants;
    private List<MatchLineupDto> lineups;
    private List<MatchGoalDto> goals;
    private SpinSessionDto spinSession;

    public static MatchDto fromEntity(Match match) {
        if (match == null) return null;
        return MatchDto.builder()
                .id(match.getId())
                .title(match.getTitle())
                .matchDate(match.getMatchDate())
                .matchTime(match.getMatchTime())
                .location(match.getLocation())
                .status(match.getStatus())
                .createdBy(UserDto.fromEntity(match.getCreatedBy()))
                .scoreTeamA(match.getScoreTeamA())
                .scoreTeamB(match.getScoreTeamB())
                .aiAnalysis(match.getAiAnalysis())
                .aiAnalyzedAt(match.getAiAnalyzedAt())
                .notes(match.getNotes())
                .jerseyWinnerTeam(match.getJerseyWinnerTeam())
                .firstPickTeam(match.getFirstPickTeam())
                .pickTurnStartedAt(match.getPickTurnStartedAt())
                .startAt(match.getStartAt())
                .endAt(match.getEndAt())
                .isDeleted(match.isDeleted())
                .deletedAt(match.getDeletedAt())
                .deletedBy(UserDto.fromEntity(match.getDeletedBy()))
                .createdAt(match.getCreatedAt())
                .build();
    }
}
