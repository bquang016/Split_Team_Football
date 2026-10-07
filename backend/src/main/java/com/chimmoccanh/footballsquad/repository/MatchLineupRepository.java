package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.MatchLineup;
import com.chimmoccanh.footballsquad.model.enums.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchLineupRepository extends JpaRepository<MatchLineup, UUID> {
    List<MatchLineup> findByMatchId(UUID matchId);
    List<MatchLineup> findByMatchIdAndTeam(UUID matchId, Team team);
    Optional<MatchLineup> findByMatchIdAndUserId(UUID matchId, UUID userId);

    @Modifying
    @Query("DELETE FROM MatchLineup m WHERE m.match.id = :matchId")
    void deleteByMatchId(@Param("matchId") UUID matchId);

    @Modifying
    @Query("DELETE FROM MatchLineup m WHERE m.match.id = :matchId AND m.team = :team")
    void deleteByMatchIdAndTeam(@Param("matchId") UUID matchId, @Param("team") Team team);

    @Modifying
    @Query("DELETE FROM MatchLineup m WHERE m.match.id = :matchId AND m.user.id IN :userIds")
    void deleteByMatchIdAndUserIdIn(@Param("matchId") UUID matchId, @Param("userIds") Collection<UUID> userIds);
}
