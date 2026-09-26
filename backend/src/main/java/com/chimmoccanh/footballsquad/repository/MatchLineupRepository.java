package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.MatchLineup;
import com.chimmoccanh.footballsquad.model.enums.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchLineupRepository extends JpaRepository<MatchLineup, UUID> {
    List<MatchLineup> findByMatchId(UUID matchId);
    List<MatchLineup> findByMatchIdAndTeam(UUID matchId, Team team);
    Optional<MatchLineup> findByMatchIdAndUserId(UUID matchId, UUID userId);
    void deleteByMatchId(UUID matchId);
    void deleteByMatchIdAndTeam(UUID matchId, Team team);
}
