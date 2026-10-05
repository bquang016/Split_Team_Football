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
    public SpinSessionDto spinJerseyTurn(UUID matchId, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.JERSEY_SELECTION) {
            throw new BadRequestException("Chỉ quay chọn quyền chọn áo ở bước Chọn áo đấu");
        }

        List<MatchParticipant> hosts = participantRepository.findByMatchIdAndIsHostTrue(matchId);
        if (hosts.size() < 2) {
            throw new BadRequestException("Cần có 2 đội trưởng để quay chọn áo");
        }

        boolean isAdmin = currentUser != null && currentUser.getRole() == com.chimmoccanh.footballsquad.model.enums.UserRole.ADMIN;
        if (!isAdmin && (!match.isJerseyCaptainAReady() || !match.isJerseyCaptainBReady())) {
            throw new BadRequestException("Cần cả 2 đội trưởng xác nhận sẵn sàng trước khi quay chọn áo");
        }

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

        match.setJerseyCaptainAReady(false);
        match.setJerseyCaptainBReady(false);
        match.setJerseyTurnStartedAt(java.time.LocalDateTime.now().plusSeconds(5));
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
            throw new BadRequestException("Chỉ quay lượt chọn cầu thủ ở bước Chọn người (PLAYER_PICKING)");
        }

        if (match.getFirstPickTeam() != null) {
            throw new BadRequestException("Lượt chọn hiện tại đang diễn ra, vui lòng hoàn tất lượt chọn");
        }

        long unpickedCount = participantRepository.findByMatchId(matchId).stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsHost()) && (p.getTeam() == null || p.getTeam() == Team.NONE))
                .count();
        if (unpickedCount <= 1) {
            throw new BadRequestException("Không còn đủ cầu thủ chưa chọn để quay lượt chọn mới");
        }

        List<MatchParticipant> hosts = participantRepository.findByMatchIdAndIsHostTrue(matchId);
        if (hosts.size() < 2) {
            throw new BadRequestException("Cần có 2 đội trưởng để quay lượt pick");
        }

        boolean isAdmin = currentUser != null && currentUser.getRole() == com.chimmoccanh.footballsquad.model.enums.UserRole.ADMIN;

        // Validate consensus: both captains must be ready unless admin bypasses
        if (!isAdmin && (!match.isPickRoundCaptainAReady() || !match.isPickRoundCaptainBReady())) {
            throw new BadRequestException("Cần cả 2 đội trưởng xác nhận sẵn sàng trước khi quay lượt chọn");
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

        // Record first pick team and reset ready flags
        String firstPick = winnerIsA ? "A" : "B";
        match.setFirstPickTeam(firstPick);
        match.setPickRoundCaptainAReady(false);
        match.setPickRoundCaptainBReady(false);
        match.setCurrentPickRound(match.getCurrentPickRound() + 1);
        match.setRoundFirstPickerDone(false);
        match.setRoundSecondPickerDone(false);
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
