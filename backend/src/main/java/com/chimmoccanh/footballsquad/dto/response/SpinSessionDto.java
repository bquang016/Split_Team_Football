package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.SpinSession;
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
public class SpinSessionDto {
    private UUID id;
    private UUID matchId;
    private UserDto hostA;
    private UserDto hostB;
    private UserDto winner;
    private Long spinSeed;
    private Integer durationMs;
    private LocalDateTime spunAt;

    public static SpinSessionDto fromEntity(SpinSession session) {
        if (session == null) return null;
        return SpinSessionDto.builder()
                .id(session.getId())
                .matchId(session.getMatch() != null ? session.getMatch().getId() : null)
                .hostA(UserDto.fromEntity(session.getHostA()))
                .hostB(UserDto.fromEntity(session.getHostB()))
                .winner(UserDto.fromEntity(session.getWinner()))
                .spinSeed(session.getSpinSeed())
                .durationMs(session.getDurationMs())
                .spunAt(session.getSpunAt())
                .build();
    }
}
