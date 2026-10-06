package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.enums.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchParticipantRepository extends JpaRepository<MatchParticipant, UUID> {
    List<MatchParticipant> findByMatchId(UUID matchId);
    List<MatchParticipant> findByMatchIdOrderByJoinedAtAsc(UUID matchId);
    List<MatchParticipant> findByMatchIdAndTeam(UUID matchId, Team team);
    Optional<MatchParticipant> findByMatchIdAndUserId(UUID matchId, UUID userId);
    boolean existsByMatchIdAndUserId(UUID matchId, UUID userId);
    void deleteByMatchIdAndUserId(UUID matchId, UUID userId);
    List<MatchParticipant> findByUserId(UUID userId);
    List<MatchParticipant> findByMatchIdAndIsHostTrue(UUID matchId);
}
