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

    @Query("SELECT ps FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false ORDER BY ps.match.matchDate DESC")
    List<PlayerStats> findRecentByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false AND ps.isWinner = true")
    int countWinsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(ps.goals), 0) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false")
    int sumGoalsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(ps.assists), 0) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false")
    int sumAssistsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(ps.saves), 0) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false")
    int sumSavesByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false AND ps.isMvp = true")
    int countMvpByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false AND ps.isWinner = false AND ps.match.scoreTeamA != ps.match.scoreTeamB")
    int countLossesByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ps) FROM PlayerStats ps WHERE ps.user.id = :userId AND ps.match.isDeleted = false")
    int countMatchesByUserId(@Param("userId") UUID userId);

    @Query("SELECT ps FROM PlayerStats ps JOIN FETCH ps.match m JOIN FETCH ps.user u " +
           "WHERE m.isDeleted = false AND m.status = com.chimmoccanh.footballsquad.model.enums.MatchStatus.COMPLETED " +
           "AND (CAST(:startDate AS date) IS NULL OR m.matchDate >= :startDate) " +
           "AND (CAST(:endDate AS date) IS NULL OR m.matchDate <= :endDate)")
    List<PlayerStats> findCompletedStatsBetweenDates(@Param("startDate") java.time.LocalDate startDate, @Param("endDate") java.time.LocalDate endDate);
}
