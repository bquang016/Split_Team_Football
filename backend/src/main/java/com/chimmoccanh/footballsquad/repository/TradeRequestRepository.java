package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.TradeRequest;
import com.chimmoccanh.footballsquad.model.enums.TradeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TradeRequestRepository extends JpaRepository<TradeRequest, UUID> {
    List<TradeRequest> findByMatchIdAndStatus(UUID matchId, TradeStatus status);
    List<TradeRequest> findByMatchId(UUID matchId);
}
