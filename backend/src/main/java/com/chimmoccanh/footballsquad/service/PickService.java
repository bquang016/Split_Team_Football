package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.PickPlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.exception.UnauthorizedException;
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
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PickService {

    private final MatchRepository matchRepository;
    private final MatchParticipantRepository participantRepository;
    private final NotificationService notificationService;

    @Transactional
    public MatchDto confirmPickRoundReady(UUID matchId, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.PLAYER_PICKING) {
            throw new BadRequestException("Trận đấu không ở bước Chọn người (PLAYER_PICKING)");
        }

        Optional<MatchParticipant> participantOpt = participantRepository.findByMatchIdAndUserId(matchId, currentUser.getId());
        boolean isCreator = match.getCreatedBy() != null && match.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN || isCreator;
        boolean isCaptain = participantOpt.isPresent() && Boolean.TRUE.equals(participantOpt.get().getIsHost());

        if (!isAdmin && !isCaptain) {
            throw new BadRequestException("Chỉ Đội trưởng hoặc Quản trị viên mới có quyền xác nhận");
        }

        if (isCaptain) {
            Team team = participantOpt.get().getTeam();
            if (team == Team.A) {
                match.setPickRoundCaptainAReady(!match.isPickRoundCaptainAReady());
            } else if (team == Team.B) {
                match.setPickRoundCaptainBReady(!match.isPickRoundCaptainBReady());
            }
        }

        if (isAdmin && !isCaptain) {
            match.setPickRoundCaptainAReady(true);
            match.setPickRoundCaptainBReady(true);
        }

        Match saved = matchRepository.save(match);
        MatchDto dto = MatchDto.fromEntity(saved);
        notificationService.broadcastMatchStatus(matchId, dto);
        notificationService.broadcastPickEvent(matchId, "PICK_ROUND_READY");
        return dto;
    }

    @Transactional
    public MatchDto handlePickTimeoutSwap(UUID matchId, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.PLAYER_PICKING) {
            throw new BadRequestException("Trận đấu không ở bước Chọn người");
        }

        if (match.getFirstPickTeam() == null) {
            throw new BadRequestException("Chưa có lượt quay chọn người");
        }

        // Only swap if first picker hasn't picked yet
        if (match.isRoundFirstPickerDone()) {
            throw new BadRequestException("Đội chọn trước đã hoàn tất chọn người");
        }

        // Swap firstPickTeam
        String currentFirst = match.getFirstPickTeam();
        String newFirst = "A".equalsIgnoreCase(currentFirst) ? "B" : "A";
        match.setFirstPickTeam(newFirst);
        match.setPickTurnStartedAt(LocalDateTime.now());

        Match saved = matchRepository.save(match);
        MatchDto dto = MatchDto.fromEntity(saved);
        notificationService.broadcastMatchStatus(matchId, dto);
        notificationService.broadcastPickEvent(matchId, "PICK_TIMEOUT_SWAPPED");
        return dto;
    }

    @Transactional
    public MatchParticipantDto pickPlayer(UUID matchId, PickPlayerRequest request, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.PLAYER_PICKING) {
            throw new BadRequestException("Trận đấu không ở bước Chọn người (PLAYER_PICKING)");
        }

        MatchParticipant participant = participantRepository.findByMatchIdAndUserId(matchId, request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Cầu thủ chưa đăng ký tham gia trận này"));

        if (participant.getTeam() != Team.NONE && participant.getTeam() != null && participant.getTeam() != Team.BENCH) {
            if (Boolean.TRUE.equals(participant.getIsHost())) {
                throw new BadRequestException("Không thể chọn lại đội trưởng");
            }
        }

        boolean isAdmin = currentUser != null && currentUser.getRole() == UserRole.ADMIN;

        if (request.getTeam() == Team.A || request.getTeam() == Team.B) {
            if (match.getFirstPickTeam() == null) {
                throw new BadRequestException("Chưa quay lượt chọn! Vui lòng quay vòng quay để xác định đội nào chọn trước.");
            }

            Team firstTeam = "B".equalsIgnoreCase(match.getFirstPickTeam()) ? Team.B : Team.A;
            Team secondTeam = (firstTeam == Team.A) ? Team.B : Team.A;

            Team expectedTurn;
            if (!match.isRoundFirstPickerDone()) {
                expectedTurn = firstTeam;
            } else if (!match.isRoundSecondPickerDone()) {
                expectedTurn = secondTeam;
            } else {
                throw new BadRequestException("Lượt này đã hoàn thành chọn người! Vui lòng quay vòng quay cho lượt tiếp theo.");
            }

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

            participant.setTeam(request.getTeam());

            // Update round picker state
            if (!match.isRoundFirstPickerDone()) {
                match.setRoundFirstPickerDone(true);
                match.setPickTurnStartedAt(LocalDateTime.now());
            } else {
                match.setRoundSecondPickerDone(true);
                match.setFirstPickTeam(null); // Reset so next round requires spin
            }
        } else {
            participant.setTeam(request.getTeam());
        }

        participant.setPickOrder(request.getPickOrder());
        MatchParticipant saved = participantRepository.save(participant);

        matchRepository.save(match);

        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);
        notificationService.broadcastPickEvent(matchId, dto);
        notificationService.broadcastMatchStatus(matchId, MatchDto.fromEntity(match));
        return dto;
    }

    @Transactional
    public MatchDto handleFinalOddPlayerDecision(UUID matchId, String decision, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.PLAYER_PICKING) {
            throw new BadRequestException("Trận đấu không ở bước Chọn người");
        }

        List<MatchParticipant> allParts = participantRepository.findByMatchId(matchId);
        List<MatchParticipant> unpicked = allParts.stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsHost()) && (p.getTeam() == null || p.getTeam() == Team.NONE))
                .toList();

        if (unpicked.isEmpty()) {
            throw new BadRequestException("Không còn cầu thủ nào chưa được chọn");
        }

        if (unpicked.size() > 1) {
            throw new BadRequestException("Vẫn còn nhiều hơn 1 cầu thủ, hãy tiếp tục lượt chọn thông thường");
        }

        MatchParticipant oddPlayer = unpicked.get(0);
        boolean isAdmin = currentUser != null && currentUser.getRole() == UserRole.ADMIN;

        Team winnerTeam = "B".equalsIgnoreCase(match.getFirstPickTeam()) ? Team.B : Team.A;
        if (!isAdmin && currentUser != null) {
            boolean isWinnerCaptain = participantRepository.findByMatchIdAndTeam(matchId, winnerTeam).stream()
                    .anyMatch(p -> Boolean.TRUE.equals(p.getIsHost()) && p.getUser().getId().equals(currentUser.getId()));
            if (!isWinnerCaptain) {
                throw new BadRequestException("Chỉ đội trưởng thắng lượt quay mới có quyền quyết định");
            }
        }

        if ("ACCEPT".equalsIgnoreCase(decision)) {
            oddPlayer.setTeam(winnerTeam);
        } else {
            oddPlayer.setTeam(Team.BENCH);
        }

        participantRepository.save(oddPlayer);

        match.setRoundFirstPickerDone(true);
        match.setRoundSecondPickerDone(true);
        match.setFirstPickTeam(null);
        Match saved = matchRepository.save(match);

        MatchDto dto = MatchDto.fromEntity(saved);
        notificationService.broadcastPickEvent(matchId, MatchParticipantDto.fromEntity(oddPlayer));
        notificationService.broadcastMatchStatus(matchId, dto);
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
