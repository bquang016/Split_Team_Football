package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.PlayerStatItemDto;
import com.chimmoccanh.footballsquad.dto.request.RecordStatsRequest;
import com.chimmoccanh.footballsquad.dto.response.PlayerStatsDto;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.PlayerStats;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.PlayerStatsRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final PlayerStatsRepository playerStatsRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    @Transactional
    public List<PlayerStatsDto> recordStats(UUID matchId, RecordStatsRequest request, User admin) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        List<PlayerStats> savedStatsList = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (PlayerStatItemDto item : request.getStats()) {
            User player = userRepository.findById(item.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ: " + item.getUserId()));

            PlayerStats stat = playerStatsRepository.findByMatchIdAndUserId(matchId, item.getUserId())
                    .orElseGet(() -> PlayerStats.builder().match(match).user(player).build());

            stat.setTeam(item.getTeam());
            stat.setGoals(item.getGoals() != null ? item.getGoals() : 0);
            stat.setAssists(item.getAssists() != null ? item.getAssists() : 0);
            stat.setIsWinner(Boolean.TRUE.equals(item.getIsWinner()));
            stat.setIsMvp(Boolean.TRUE.equals(item.getIsMvp()));
            stat.setEnteredBy(admin);
            stat.setEnteredAt(now);

            PlayerStats saved = playerStatsRepository.save(stat);
            savedStatsList.add(saved);

            // Update user's aggregate stats in leaderboard_cache
            leaderboardService.updateUserStatsInLeaderboard(player.getId());
        }

        return savedStatsList.stream().map(PlayerStatsDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlayerStatsDto> getMatchStats(UUID matchId) {
        return playerStatsRepository.findByMatchId(matchId).stream()
                .map(PlayerStatsDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlayerStatsDto> getPlayerStats(UUID userId) {
        return playerStatsRepository.findByUserId(userId).stream()
                .map(PlayerStatsDto::fromEntity)
                .collect(Collectors.toList());
    }
}
