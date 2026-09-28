package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.LeaderboardCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeaderboardCacheRepository extends JpaRepository<LeaderboardCache, UUID> {
    
    @Query("SELECT lc FROM LeaderboardCache lc ORDER BY lc.totalGoals DESC, lc.totalAssists DESC")
    List<LeaderboardCache> findAllOrderByGoalsDesc();

    @Query("SELECT lc FROM LeaderboardCache lc ORDER BY lc.totalWins DESC, lc.winRate DESC")
    List<LeaderboardCache> findAllOrderByWinsDesc();

    @Query("SELECT lc FROM LeaderboardCache lc ORDER BY lc.totalAssists DESC")
    List<LeaderboardCache> findAllOrderByAssistsDesc();

    @Modifying
    @Query(value = """
        INSERT INTO leaderboard_cache (user_id, total_goals, total_assists, total_saves, total_wins, total_losses, total_draws, total_matches, total_mvp, win_rate, updated_at)
        VALUES (:userId, :totalGoals, :totalAssists, :totalSaves, :totalWins, :totalLosses, :totalDraws, :totalMatches, :totalMvp, :winRate, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            total_goals = EXCLUDED.total_goals,
            total_assists = EXCLUDED.total_assists,
            total_saves = EXCLUDED.total_saves,
            total_wins = EXCLUDED.total_wins,
            total_losses = EXCLUDED.total_losses,
            total_draws = EXCLUDED.total_draws,
            total_matches = EXCLUDED.total_matches,
            total_mvp = EXCLUDED.total_mvp,
            win_rate = EXCLUDED.win_rate,
            updated_at = NOW()
    """, nativeQuery = true)
    void upsertStats(
            @Param("userId") UUID userId,
            @Param("totalGoals") int totalGoals,
            @Param("totalAssists") int totalAssists,
            @Param("totalSaves") int totalSaves,
            @Param("totalWins") int totalWins,
            @Param("totalLosses") int totalLosses,
            @Param("totalDraws") int totalDraws,
            @Param("totalMatches") int totalMatches,
            @Param("totalMvp") int totalMvp,
            @Param("winRate") double winRate
    );
}
