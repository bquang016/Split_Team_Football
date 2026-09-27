package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, UUID> {
    List<PlayerStats> findByMatchId(UUID matchId);
    List<PlayerStats> findByUserId(UUID userId);
    Optional<PlayerStats> findByMatchIdAndUserId(UUID matchId, UUID userId);

    @Query("SELECT ps FROM PlayerStats ps WHERE ps.user.id = :userId ORDER BY ps.match.matchDate DESC")
    List<PlayerStats> findRecentByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.isWinner = true")
    int countWinsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(ps.goals), 0) FROM PlayerStats ps WHERE ps.user.id = :userId")
    int sumGoalsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(ps.assists), 0) FROM PlayerStats ps WHERE ps.user.id = :userId")
    int sumAssistsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(ps.saves), 0) FROM PlayerStats ps WHERE ps.user.id = :userId")
    int sumSavesByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.isMvp = true")
    int countMvpByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.isWinner = false AND ps.match.scoreTeamA != ps.match.scoreTeamB")
    int countLossesByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId")
    int countMatchesByUserId(@Param("userId") UUID userId);
}
