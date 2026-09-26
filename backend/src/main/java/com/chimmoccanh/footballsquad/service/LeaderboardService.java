package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.response.LeaderboardItemDto;
import com.chimmoccanh.footballsquad.model.LeaderboardCache;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.repository.LeaderboardCacheRepository;
import com.chimmoccanh.footballsquad.repository.PlayerStatsRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardCacheRepository leaderboardRepository;
    private final PlayerStatsRepository playerStatsRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "leaderboard", key = "#type != null ? #type : 'goals'")
    public List<LeaderboardItemDto> getLeaderboard(String type) {
        List<LeaderboardCache> list;
        if ("wins".equalsIgnoreCase(type)) {
            list = leaderboardRepository.findAllOrderByWinsDesc();
        } else if ("assists".equalsIgnoreCase(type)) {
            list = leaderboardRepository.findAllOrderByAssistsDesc();
        } else {
            list = leaderboardRepository.findAllOrderByGoalsDesc();
        }

        AtomicInteger rank = new AtomicInteger(1);
        return list.stream()
                .map(item -> LeaderboardItemDto.fromEntity(item, rank.getAndIncrement()))
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "leaderboard", allEntries = true)
    public void updateUserStatsInLeaderboard(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        int totalGoals = playerStatsRepository.sumGoalsByUserId(userId);
        int totalAssists = playerStatsRepository.sumAssistsByUserId(userId);
        int totalWins = playerStatsRepository.countWinsByUserId(userId);
        int totalMatches = playerStatsRepository.countMatchesByUserId(userId);
        double winRate = totalMatches > 0 ? ((double) totalWins / totalMatches) * 100.0 : 0.0;

        LeaderboardCache cache = leaderboardRepository.findById(userId)
                .orElseGet(() -> LeaderboardCache.builder().userId(userId).user(user).build());

        cache.setUser(user);
        cache.setTotalGoals(totalGoals);
        cache.setTotalAssists(totalAssists);
        cache.setTotalWins(totalWins);
        cache.setTotalMatches(totalMatches);
        cache.setWinRate(Math.round(winRate * 10.0) / 10.0);

        leaderboardRepository.save(cache);
    }

    @Transactional
    @CacheEvict(value = "leaderboard", allEntries = true)
    public void refreshAllLeaderboard() {
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            updateUserStatsInLeaderboard(user.getId());
        }
    }
}
