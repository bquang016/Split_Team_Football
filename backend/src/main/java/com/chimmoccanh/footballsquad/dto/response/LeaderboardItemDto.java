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
    private Integer totalWins;
    private Integer totalMatches;
    private Double winRate;
    private LocalDateTime updatedAt;

    public static LeaderboardItemDto fromEntity(LeaderboardCache cache, int rank) {
        if (cache == null) return null;
        return LeaderboardItemDto.builder()
                .rank(rank)
                .user(UserDto.fromEntity(cache.getUser()))
                .totalGoals(cache.getTotalGoals())
                .totalAssists(cache.getTotalAssists())
                .totalWins(cache.getTotalWins())
                .totalMatches(cache.getTotalMatches())
                .winRate(cache.getWinRate())
                .updatedAt(cache.getUpdatedAt())
                .build();
    }
}
