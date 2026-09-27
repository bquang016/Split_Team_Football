package com.chimmoccanh.footballsquad.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastMatchStatus(UUID matchId, Object payload) {
        String destination = "/topic/match/" + matchId + "/status";
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void broadcastSpinEvent(UUID matchId, Object payload) {
        String destination = "/topic/match/" + matchId + "/spin";
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void broadcastPickEvent(UUID matchId, Object payload) {
        String destination = "/topic/match/" + matchId + "/pick";
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void broadcastLineupEvent(UUID matchId, Object payload) {
        String destination = "/topic/match/" + matchId + "/lineup";
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void broadcastScoreEvent(UUID matchId, Object payload) {
        String destination = "/topic/match/" + matchId + "/score";
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void broadcastTradeEvent(UUID matchId, Object payload) {
        String destination = "/topic/match/" + matchId + "/trade";
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void broadcastMatchesList(Object payload) {
        messagingTemplate.convertAndSend("/topic/matches", payload);
    }
}
