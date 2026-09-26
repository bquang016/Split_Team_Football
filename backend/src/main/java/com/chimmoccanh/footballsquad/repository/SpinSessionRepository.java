package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.SpinSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpinSessionRepository extends JpaRepository<SpinSession, UUID> {
    List<SpinSession> findByMatchIdOrderBySpunAtDesc(UUID matchId);
    Optional<SpinSession> findFirstByMatchIdOrderBySpunAtDesc(UUID matchId);
}
