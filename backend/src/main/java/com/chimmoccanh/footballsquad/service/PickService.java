package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.PickPlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

        if (match.getStatus() != MatchStatus.PLAYER_PICKING) {
            throw new BadRequestException("Trận đấu không ở bước Chọn cầu thủ (PLAYER_PICKING)");
        }

        MatchParticipant participant = participantRepository.findByMatchIdAndUserId(matchId, request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Cầu thủ chưa đăng ký tham gia trận này"));

        if (participant.getTeam() != Team.NONE && participant.getTeam() != null && participant.getTeam() != Team.BENCH) {
            // Already assigned to team
            if (Boolean.TRUE.equals(participant.getIsHost())) {
                throw new BadRequestException("Không thể chọn lại đội trưởng");
            }
        }

        boolean isAdmin = currentUser != null && currentUser.getRole() == UserRole.ADMIN;

        // If assigning to Team A or Team B, validate turn order and authorization
        if (request.getTeam() == Team.A || request.getTeam() == Team.B) {
            if (match.getFirstPickTeam() == null) {
                throw new BadRequestException("Chưa quay lượt chọn! Vui lòng quay vòng quay để xác định đội nào chọn trước.");
            }

            int countA = (int) participantRepository.findByMatchIdAndTeam(matchId, Team.A).stream()
                    .filter(p -> !Boolean.TRUE.equals(p.getIsHost())).count();
            int countB = (int) participantRepository.findByMatchIdAndTeam(matchId, Team.B).stream()
                    .filter(p -> !Boolean.TRUE.equals(p.getIsHost())).count();
            int totalPicked = countA + countB;

            Team firstTeam = "B".equalsIgnoreCase(match.getFirstPickTeam()) ? Team.B : Team.A;
            Team expectedTurn = (totalPicked % 2 == 0) ? firstTeam : (firstTeam == Team.A ? Team.B : Team.A);

            if (request.getTeam() != expectedTurn && !isAdmin) {
                throw new BadRequestException("Hiện tại đang là lượt chọn của Đội " + expectedTurn.name() + "!");
            }

            if (!isAdmin && currentUser != null) {
                boolean isCaptainOfTurn = participantRepository.findByMatchIdAndTeam(matchId, expectedTurn).stream()
                        .anyMatch(p -> Boolean.TRUE.equals(p.getIsHost()) && p.getUser().getId().equals(currentUser.getId()));
                if (!isCaptainOfTurn) {
                    throw new BadRequestException("Chỉ Đội trưởng Đội " + expectedTurn.name() + " hoặc Admin mới có quyền chọn người trong lượt này!");
                }
            }

            List<MatchParticipant> teamPlayers = participantRepository.findByMatchIdAndTeam(matchId, request.getTeam());
            if (teamPlayers.size() >= 7) {
                participant.setTeam(Team.BENCH);
            } else {
                participant.setTeam(request.getTeam());
            }
        } else {
            participant.setTeam(request.getTeam());
        }

        participant.setPickOrder(request.getPickOrder());
        MatchParticipant saved = participantRepository.save(participant);

        // Reset turn timer to now for the next turn
        match.setPickTurnStartedAt(LocalDateTime.now());
        matchRepository.save(match);

        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);
        notificationService.broadcastPickEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public MatchParticipantDto resetPlayerPick(UUID matchId, UUID userId) {
        MatchParticipant participant = participantRepository.findByMatchIdAndUserId(matchId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cầu thủ không có trong trận"));

        if (Boolean.TRUE.equals(participant.getIsHost())) {
            throw new BadRequestException("Không thể đặt lại lựa chọn của đội trưởng");
        }

        participant.setTeam(Team.NONE);
        participant.setPickOrder(null);
        MatchParticipant saved = participantRepository.save(participant);

        Match match = participant.getMatch();
        match.setPickTurnStartedAt(LocalDateTime.now());
        matchRepository.save(match);

        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);
        notificationService.broadcastPickEvent(matchId, dto);
        return dto;
    }
}
