package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.MatchGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MatchGoalRepository extends JpaRepository<MatchGoal, UUID> {
    List<MatchGoal> findByMatchIdOrderByMinuteAscCreatedAtAsc(UUID matchId);
    void deleteByMatchId(UUID matchId);
}
