package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    List<Match> findAllByOrderByMatchDateDescCreatedAtDesc();
    
    @Query("SELECT m FROM Match m WHERE m.matchDate BETWEEN :startDate AND :endDate ORDER BY m.matchDate ASC, m.matchTime ASC")
    List<Match> findMatchesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Match> findByStatus(MatchStatus status);

    @Query("SELECT m FROM Match m WHERE m.status IN :statuses ORDER BY m.matchDate DESC")
    List<Match> findByStatusIn(@Param("statuses") List<MatchStatus> statuses);

    @Query("SELECT m FROM Match m ORDER BY m.matchDate DESC LIMIT 1")
    Optional<Match> findLatestMatch();
}
