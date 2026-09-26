package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.PickPlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PickService {

    private final MatchRepository matchRepository;
    private final MatchParticipantRepository participantRepository;
    private final NotificationService notificationService;

    @Transactional
    public MatchParticipantDto pickPlayer(UUID matchId, PickPlayerRequest request, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        MatchParticipant participant = participantRepository.findByMatchIdAndUserId(matchId, request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Cầu thủ chưa đăng ký tham gia trận này"));

        if (participant.getTeam() != Team.NONE && participant.getTeam() != null && participant.getTeam() != Team.BENCH) {
            // Already assigned to team
            if (participant.getIsHost()) {
                throw new BadRequestException("Không thể chọn lại đội trưởng");
            }
        }

        // Count current players in requested team
        if (request.getTeam() == Team.A || request.getTeam() == Team.B) {
            List<MatchParticipant> teamPlayers = participantRepository.findByMatchIdAndTeam(matchId, request.getTeam());
            if (teamPlayers.size() >= 7 && request.getTeam() != Team.BENCH) {
                // If team is full (7 players for 7v7), assign to BENCH
                participant.setTeam(Team.BENCH);
            } else {
                participant.setTeam(request.getTeam());
            }
        } else {
            participant.setTeam(request.getTeam());
        }

        participant.setPickOrder(request.getPickOrder());
        MatchParticipant saved = participantRepository.save(participant);
        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);

        notificationService.broadcastPickEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public MatchParticipantDto resetPlayerPick(UUID matchId, UUID userId) {
        MatchParticipant participant = participantRepository.findByMatchIdAndUserId(matchId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cầu thủ không có trong trận"));

        if (participant.getIsHost()) {
            throw new BadRequestException("Không thể đặt lại lựa chọn của đội trưởng");
        }

        participant.setTeam(Team.NONE);
        participant.setPickOrder(null);
        MatchParticipant saved = participantRepository.save(participant);
        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);

        notificationService.broadcastPickEvent(matchId, dto);
        return dto;
    }
}
