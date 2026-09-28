package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.StartSpinRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.SpinSessionDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.SpinSession;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.SpinSessionRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SpinService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MatchParticipantRepository participantRepository;
    private final SpinSessionRepository spinSessionRepository;
    private final NotificationService notificationService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public SpinSessionDto startSpin(UUID matchId, StartSpinRequest request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        // Validate match status
        if (match.getStatus() != MatchStatus.PENDING && match.getStatus() != MatchStatus.JERSEY_SELECTION) {
            throw new BadRequestException("Chỉ quay chọn đội trưởng khi trận đấu ở bước Điểm danh hoặc Chọn áo");
        }

        if (request.getHostAId().equals(request.getHostBId())) {
            throw new BadRequestException("Hai đội trưởng phải là hai người khác nhau");
        }

        User hostA = userRepository.findById(request.getHostAId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Đội trưởng A"));

        User hostB = userRepository.findById(request.getHostBId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Đội trưởng B"));

        // Ensure both hosts are participants, set their roles and initial teams
        MatchParticipant partA = participantRepository.findByMatchIdAndUserId(matchId, hostA.getId())
                .orElseGet(() -> MatchParticipant.builder().match(match).user(hostA).build());
        partA.setIsHost(true);
        partA.setTeam(Team.A);
        partA.setPickOrder(0);
        participantRepository.save(partA);

        MatchParticipant partB = participantRepository.findByMatchIdAndUserId(matchId, hostB.getId())
                .orElseGet(() -> MatchParticipant.builder().match(match).user(hostB).build());
        partB.setIsHost(true);
        partB.setTeam(Team.B);
        partB.setPickOrder(0);
        participantRepository.save(partB);

        // Generate seed and determine winner
        long seed = Math.abs(secureRandom.nextLong());
        boolean winnerIsA = (seed % 2 == 0);
        User winner = winnerIsA ? hostA : hostB;
        int durationMs = 4500; // 4.5 seconds for wheel spin

        SpinSession session = SpinSession.builder()
                .match(match)
                .hostA(hostA)
                .hostB(hostB)
                .winner(winner)
                .spinSeed(seed)
                .durationMs(durationMs)
                .build();

        SpinSession savedSession = spinSessionRepository.save(session);

        // Update match status to JERSEY_SELECTION (Bước 2)
        match.setStatus(MatchStatus.JERSEY_SELECTION);
        Match savedMatch = matchRepository.save(match);

        SpinSessionDto dto = SpinSessionDto.fromEntity(savedSession);
        notificationService.broadcastSpinEvent(matchId, dto);
        notificationService.broadcastMatchStatus(matchId, MatchDto.fromEntity(savedMatch));

        return dto;
    }

    @Transactional
    public SpinSessionDto spinRoundPick(UUID matchId, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        // Validate match status
        if (match.getStatus() != MatchStatus.PLAYER_PICKING) {
            throw new BadRequestException("Chỉ quay lượt chọn cầu thủ ở bước Pick cầu thủ (PLAYER_PICKING)");
        }

        List<MatchParticipant> hosts = participantRepository.findByMatchIdAndIsHostTrue(matchId);
        if (hosts.size() < 2) {
            throw new BadRequestException("Cần có 2 đội trưởng để quay lượt pick");
        }

        // Validate permission: only captains or admin can spin
        if (currentUser != null) {
            boolean isHost = hosts.stream().anyMatch(h -> h.getUser().getId().equals(currentUser.getId()));
            boolean isAdmin = currentUser.getRole() == com.chimmoccanh.footballsquad.model.enums.UserRole.ADMIN;
            if (!isHost && !isAdmin) {
                throw new BadRequestException("Chỉ 2 Đội trưởng hoặc Admin mới có quyền bấm quay lượt chọn");
            }
        }

        // Sort by team to ensure consistent A/B ordering
        hosts.sort((a, b) -> {
            if (a.getTeam() == Team.A) return -1;
            if (b.getTeam() == Team.A) return 1;
            return 0;
        });

        User hostA = hosts.get(0).getUser();
        User hostB = hosts.get(1).getUser();

        long seed = Math.abs(secureRandom.nextLong());
        boolean winnerIsA = (seed % 2 == 0);
        User winner = winnerIsA ? hostA : hostB;
        int durationMs = 4500;

        SpinSession session = SpinSession.builder()
                .match(match)
                .hostA(hostA)
                .hostB(hostB)
                .winner(winner)
                .spinSeed(seed)
                .durationMs(durationMs)
                .build();

        SpinSession savedSession = spinSessionRepository.save(session);

        // Record first pick team and start turn timer (giving 5 seconds for wheel animation)
        String firstPick = winnerIsA ? "A" : "B";
        match.setFirstPickTeam(firstPick);
        match.setPickTurnStartedAt(java.time.LocalDateTime.now().plusSeconds(5));
        Match savedMatch = matchRepository.save(match);

        SpinSessionDto dto = SpinSessionDto.fromEntity(savedSession);
        notificationService.broadcastSpinEvent(matchId, dto);
        notificationService.broadcastMatchStatus(matchId, MatchDto.fromEntity(savedMatch));
        notificationService.broadcastPickEvent(matchId, "ROUND_SPIN_COMPLETED");
        return dto;
    }

    @Transactional
    public SpinSessionDto spinRoundPick(UUID matchId) {
        return spinRoundPick(matchId, null);
    }

    @Transactional(readOnly = true)
    public SpinSessionDto getLatestSpin(UUID matchId) {
        return spinSessionRepository.findFirstByMatchIdOrderBySpunAtDesc(matchId)
                .map(SpinSessionDto::fromEntity)
                .orElse(null);
    }
}
