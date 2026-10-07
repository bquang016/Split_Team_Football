package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.response.LeaderboardItemDto;
import com.chimmoccanh.footballsquad.dto.response.RatingLeaderboardDto;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.model.LeaderboardCache;
import com.chimmoccanh.footballsquad.model.PlayerStats;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.repository.LeaderboardCacheRepository;
import com.chimmoccanh.footballsquad.repository.PlayerStatsRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
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

    @Transactional(readOnly = true)
    public List<RatingLeaderboardDto> getRatingLeaderboard(String period) {
        LocalDate now = LocalDate.now();
        LocalDate startDate = null;
        LocalDate endDate = null;

        if ("week".equalsIgnoreCase(period)) {
            startDate = now.with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
            endDate = startDate.plusDays(6);
        } else if ("month".equalsIgnoreCase(period)) {
            startDate = now.withDayOfMonth(1);
            endDate = now.withDayOfMonth(now.lengthOfMonth());
        }

        List<PlayerStats> statsList = playerStatsRepository.findCompletedStatsBetweenDates(startDate, endDate);

        // Group by User
        Map<UUID, List<PlayerStats>> userStatsMap = statsList.stream()
                .filter(ps -> ps.getUser() != null && ps.getUser().getRole() != com.chimmoccanh.footballsquad.model.enums.UserRole.GUEST)
                .collect(Collectors.groupingBy(ps -> ps.getUser().getId()));

        List<RatingLeaderboardDto> dtoList = new ArrayList<>();

        for (Map.Entry<UUID, List<PlayerStats>> entry : userStatsMap.entrySet()) {
            List<PlayerStats> pStats = entry.getValue();
            if (pStats.isEmpty()) continue;

            User user = pStats.get(0).getUser();
            double totalRating = 0.0;
            int ratedMatches = 0;
            int totalMatches = pStats.size();
            int totalGoals = 0;
            int totalAssists = 0;
            int totalSaves = 0;
            int totalMvp = 0;

            for (PlayerStats ps : pStats) {
                if (ps.getRating() != null) {
                    totalRating += ps.getRating();
                    ratedMatches++;
                }
                if (ps.getGoals() != null) totalGoals += ps.getGoals();
                if (ps.getAssists() != null) totalAssists += ps.getAssists();
                if (ps.getSaves() != null) totalSaves += ps.getSaves();
                if (Boolean.TRUE.equals(ps.getIsMvp())) totalMvp++;
            }

            // Chỉ đưa vào bảng xếp hạng đánh giá những cầu thủ thực sự đã có ít nhất 1 trận được chấm điểm
            if (ratedMatches == 0) {
                continue;
            }

            double roundedTotalRating = BigDecimal.valueOf(totalRating).setScale(1, RoundingMode.HALF_UP).doubleValue();
            double avgRating = BigDecimal.valueOf(totalRating / ratedMatches).setScale(1, RoundingMode.HALF_UP).doubleValue();

            dtoList.add(RatingLeaderboardDto.builder()
                    .user(UserDto.fromEntity(user))
                    .totalRating(roundedTotalRating)
                    .averageRating(avgRating)
                    .ratedMatches(ratedMatches)
                    .totalMatches(totalMatches)
                    .totalGoals(totalGoals)
                    .totalAssists(totalAssists)
                    .totalSaves(totalSaves)
                    .totalMvp(totalMvp)
                    .build());
        }

        // Sort primarily by totalRating DESC, then averageRating DESC, then totalMvp DESC, then totalGoals DESC, then totalAssists DESC
        dtoList.sort(Comparator
                .comparing(RatingLeaderboardDto::getTotalRating, Comparator.reverseOrder())
                .thenComparing(RatingLeaderboardDto::getAverageRating, Comparator.reverseOrder())
                .thenComparing(RatingLeaderboardDto::getTotalMvp, Comparator.reverseOrder())
                .thenComparing(RatingLeaderboardDto::getTotalGoals, Comparator.reverseOrder())
                .thenComparing(RatingLeaderboardDto::getTotalAssists, Comparator.reverseOrder()));

        // Assign ranks and mark best player (supports tied top rating)
        double maxRating = dtoList.isEmpty() ? 0.0 : dtoList.get(0).getTotalRating();
        for (int i = 0; i < dtoList.size(); i++) {
            RatingLeaderboardDto item = dtoList.get(i);
            int rank = i + 1;
            item.setRank(rank);
            item.setIsBestPlayer(item.getTotalRating() > 0 && Double.compare(item.getTotalRating(), maxRating) == 0);
        }

        return dtoList;
    }

    @Transactional
    @CacheEvict(value = "leaderboard", allEntries = true)
    public void updateUserStatsInLeaderboard(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getRole() == com.chimmoccanh.footballsquad.model.enums.UserRole.GUEST) return;

        int totalGoals = playerStatsRepository.sumGoalsByUserId(userId);
        int totalAssists = playerStatsRepository.sumAssistsByUserId(userId);
        int totalSaves = playerStatsRepository.sumSavesByUserId(userId);
        int totalWins = playerStatsRepository.countWinsByUserId(userId);
        int totalLosses = playerStatsRepository.countLossesByUserId(userId);
        int totalMatches = playerStatsRepository.countMatchesByUserId(userId);
        int totalMvp = playerStatsRepository.countMvpByUserId(userId);
        int totalDraws = totalMatches - totalWins - totalLosses;
        if (totalDraws < 0) totalDraws = 0;
        double winRate = totalMatches > 0 ? ((double) totalWins / totalMatches) * 100.0 : 0.0;

        leaderboardRepository.upsertStats(
                userId,
                totalGoals,
                totalAssists,
                totalSaves,
                totalWins,
                totalLosses,
                totalDraws,
                totalMatches,
                totalMvp,
                Math.round(winRate * 10.0) / 10.0
        );
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
