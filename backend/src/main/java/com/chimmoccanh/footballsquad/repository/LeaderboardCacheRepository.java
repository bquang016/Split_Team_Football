package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.LeaderboardCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
