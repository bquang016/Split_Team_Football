package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.LeaderboardCache;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardItemDto {
    private int rank;
    private UserDto user;
    private Integer totalGoals;
    private Integer totalAssists;
    private Integer totalSaves;
    private Integer totalWins;
    private Integer totalLosses;
    private Integer totalDraws;
    private Integer totalMatches;
    private Integer totalMvp;
    private Double winRate;
    private LocalDateTime updatedAt;

    public static LeaderboardItemDto fromEntity(LeaderboardCache cache, int rank) {
        if (cache == null) return null;
        return LeaderboardItemDto.builder()
                .rank(rank)
                .user(UserDto.fromEntity(cache.getUser()))
                .totalGoals(cache.getTotalGoals())
                .totalAssists(cache.getTotalAssists())
                .totalSaves(cache.getTotalSaves())
                .totalWins(cache.getTotalWins())
                .totalLosses(cache.getTotalLosses())
                .totalDraws(cache.getTotalDraws())
                .totalMatches(cache.getTotalMatches())
                .totalMvp(cache.getTotalMvp())
                .winRate(cache.getWinRate())
                .updatedAt(cache.getUpdatedAt())
                .build();
    }
}
