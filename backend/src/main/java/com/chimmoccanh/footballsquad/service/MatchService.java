package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.CreateMatchRequest;
import com.chimmoccanh.footballsquad.dto.request.RecordScoreRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.MatchGoalDto;
import com.chimmoccanh.footballsquad.dto.response.MatchLineupDto;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.dto.response.SpinSessionDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchGoal;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.PlayerStats;
import com.chimmoccanh.footballsquad.model.SpinSession;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.repository.MatchGoalRepository;
import com.chimmoccanh.footballsquad.repository.MatchLineupRepository;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.PlayerStatsRepository;
import com.chimmoccanh.footballsquad.repository.SpinSessionRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchParticipantRepository participantRepository;
    private final MatchLineupRepository lineupRepository;
    private final SpinSessionRepository spinSessionRepository;
    private final MatchGoalRepository matchGoalRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final LeaderboardService leaderboardService;
    private final PlayerStatsRepository playerStatsRepository;

    @Transactional
    public MatchDto createMatch(CreateMatchRequest request, User creator) {
        String title = request.getTitle();
        if (title == null || title.isBlank()) {
            title = "Trận bóng ngày " + request.getMatchDate();
        }

        MatchStatus status = request.getInitialStatus() != null ? request.getInitialStatus() : MatchStatus.PENDING;
        int scoreA = request.getInitialScoreTeamA() != null ? request.getInitialScoreTeamA() : 0;
        int scoreB = request.getInitialScoreTeamB() != null ? request.getInitialScoreTeamB() : 0;

        LocalDateTime startAt = null;
        LocalDateTime endAt = null;
        if (status == MatchStatus.COMPLETED) {
            LocalTime time = request.getMatchTime() != null ? request.getMatchTime() : LocalTime.of(19, 0);
            startAt = LocalDateTime.of(request.getMatchDate(), time);
            endAt = startAt.plusHours(2);
        }

        Match match = Match.builder()
                .title(title.trim())
                .matchDate(request.getMatchDate())
                .matchTime(request.getMatchTime())
                .location(request.getLocation() != null && !request.getLocation().isBlank() ? request.getLocation().trim() : "Sân cố định")
                .notes(request.getNotes())
                .status(status)
                .createdBy(creator)
                .scoreTeamA(scoreA)
                .scoreTeamB(scoreB)
                .startAt(startAt)
                .endAt(endAt)
                .isDeleted(false)
                .build();

        Match savedMatch = matchRepository.save(match);
        MatchDto dto = MatchDto.fromEntity(savedMatch);
        notificationService.broadcastMatchesList(dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getMatches(LocalDate startDate, LocalDate endDate) {
        List<Match> matches;
        if (startDate != null && endDate != null) {
            matches = matchRepository.findMatchesBetweenDates(startDate, endDate);
        } else {
            matches = matchRepository.findByIsDeletedFalseOrderByMatchDateDescCreatedAtDesc();
        }

        return matches.stream().map(MatchDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchDto getMatchDetails(UUID matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        MatchDto dto = MatchDto.fromEntity(match);

        dto.setParticipants(participantRepository.findByMatchId(matchId).stream()
                .map(MatchParticipantDto::fromEntity)
                .collect(Collectors.toList()));

        dto.setLineups(lineupRepository.findByMatchId(matchId).stream()
                .map(MatchLineupDto::fromEntity)
                .collect(Collectors.toList()));

        dto.setGoals(matchGoalRepository.findByMatchIdOrderByMinuteAscCreatedAtAsc(matchId).stream()
                .map(MatchGoalDto::fromEntity)
                .collect(Collectors.toList()));

        spinSessionRepository.findFirstByMatchIdOrderBySpunAtDesc(matchId)
                .ifPresent(s -> dto.setSpinSession(SpinSessionDto.fromEntity(s)));

        return dto;
    }

    @Transactional
    public MatchDto updateMatchStatus(UUID matchId, MatchStatus newStatus) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        // Validate allowed state transition
        validateStatusTransition(match.getStatus(), newStatus);

        match.setStatus(newStatus);
        if (newStatus == MatchStatus.IN_PROGRESS && match.getStartAt() == null) {
            match.setStartAt(LocalDateTime.now());
        } else if (newStatus == MatchStatus.COMPLETED && match.getEndAt() == null) {
            match.setEndAt(LocalDateTime.now());
        }
        Match saved = matchRepository.save(match);

        // Auto-create PlayerStats and refresh leaderboard when match completes
        if (newStatus == MatchStatus.COMPLETED) {
            autoCreatePlayerStatsOnCompletion(saved);
        }

        MatchDto dto = getMatchDetails(saved.getId());
        notificationService.broadcastMatchStatus(matchId, dto);
        return dto;
    }

    @Transactional
    public MatchDto selectJersey(UUID matchId, String jerseyTeam, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        // Validate match is in JERSEY_SELECTION phase
        if (match.getStatus() != MatchStatus.JERSEY_SELECTION) {
            throw new BadRequestException("Trận đấu không ở bước Chọn áo đấu (JERSEY_SELECTION)");
        }

        // Validate jerseyTeam value
        if (jerseyTeam == null || (!"SPAIN".equals(jerseyTeam) && !"FRANCE".equals(jerseyTeam))) {
            throw new BadRequestException("Chỉ được chọn SPAIN hoặc FRANCE");
        }

        // Validate: only spin winner or admin can select jersey
        Optional<SpinSession> latestSpin = spinSessionRepository.findFirstByMatchIdOrderBySpunAtDesc(matchId);
        if (latestSpin.isPresent()) {
            SpinSession spin = latestSpin.get();
            boolean isWinner = spin.getWinner() != null && spin.getWinner().getId().equals(user.getId());
            boolean isUserAdmin = user.getRole() == UserRole.ADMIN;
            if (!isWinner && !isUserAdmin) {
                throw new BadRequestException("Chỉ đội trưởng thắng spin hoặc admin mới được chọn áo");
            }
        }

        match.setJerseyWinnerTeam(jerseyTeam);
        match.setStatus(MatchStatus.PLAYER_PICKING);
        Match saved = matchRepository.save(match);
        MatchDto dto = getMatchDetails(saved.getId());

        notificationService.broadcastMatchStatus(matchId, dto);
        return dto;
    }

    @Transactional
    public MatchParticipantDto joinMatch(UUID matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.PENDING) {
            throw new BadRequestException("Trận đấu không còn ở trạng thái mở điểm danh");
        }

        if (match.getMatchDate() != null) {
            LocalTime time = match.getMatchTime() != null ? match.getMatchTime() : LocalTime.of(23, 59);
            LocalDateTime matchDateTime = LocalDateTime.of(match.getMatchDate(), time);
            if (matchDateTime.isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Trận đấu trong quá khứ đã hết hạn điểm danh");
            }
        }

        if (participantRepository.existsByMatchIdAndUserId(matchId, user.getId())) {
            throw new BadRequestException("Bạn đã tham gia trận đấu này rồi");
        }

        MatchParticipant participant = MatchParticipant.builder()
                .match(match)
                .user(user)
                .team(Team.NONE)
                .isHost(false)
                .jerseyNumber(user.getJerseyNumber())
                .build();

        MatchParticipant saved = participantRepository.save(participant);
        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);

        notificationService.broadcastPickEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public void leaveMatch(UUID matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.PENDING) {
            throw new BadRequestException("Trận đấu đã bắt đầu hoặc không ở trạng thái mở điểm danh");
        }

        if (!participantRepository.existsByMatchIdAndUserId(matchId, user.getId())) {
            throw new BadRequestException("Bạn chưa tham gia trận đấu này");
        }

        participantRepository.deleteByMatchIdAndUserId(matchId, user.getId());
        notificationService.broadcastPickEvent(matchId, "LEAVE:" + user.getId());
    }

    @Transactional
    public MatchParticipantDto addParticipantByAdmin(UUID matchId, UUID userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ"));

        if (participantRepository.existsByMatchIdAndUserId(matchId, userId)) {
            throw new BadRequestException("Cầu thủ này đã có trong danh sách");
        }

        MatchParticipant participant = MatchParticipant.builder()
                .match(match)
                .user(user)
                .team(Team.NONE)
                .isHost(false)
                .jerseyNumber(user.getJerseyNumber())
                .build();

        MatchParticipant saved = participantRepository.save(participant);
        MatchParticipantDto dto = MatchParticipantDto.fromEntity(saved);

        notificationService.broadcastPickEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public List<MatchParticipantDto> addParticipantsBatchByAdmin(UUID matchId, List<UUID> userIds) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        List<MatchParticipantDto> result = new ArrayList<>();
        for (UUID userId : userIds) {
            if (!participantRepository.existsByMatchIdAndUserId(matchId, userId)) {
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    MatchParticipant participant = MatchParticipant.builder()
                            .match(match)
                            .user(user)
                            .team(Team.NONE)
                            .isHost(false)
                            .jerseyNumber(user.getJerseyNumber())
                            .build();
                    MatchParticipant saved = participantRepository.save(participant);
                    result.add(MatchParticipantDto.fromEntity(saved));
                }
            }
        }

        notificationService.broadcastPickEvent(matchId, "BATCH_ADD");
        return result;
    }

    @Transactional
    public void removeParticipantByAdmin(UUID matchId, UUID userId) {
        participantRepository.deleteByMatchIdAndUserId(matchId, userId);
        notificationService.broadcastPickEvent(matchId, "REMOVE:" + userId);
    }

    @Transactional
    public MatchDto updateScore(UUID matchId, RecordScoreRequest req) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        LocalDateTime now = LocalDateTime.now();
        boolean isCompleted = match.getStatus() == MatchStatus.COMPLETED;
        boolean isTwoHoursPassed = false;

        if (match.getStartAt() != null) {
            isTwoHoursPassed = match.getStartAt().plusHours(2).isBefore(now);
        } else if (match.getMatchDate() != null) {
            LocalTime time = match.getMatchTime() != null ? match.getMatchTime() : LocalTime.MIDNIGHT;
            LocalDateTime scheduledStart = LocalDateTime.of(match.getMatchDate(), time);
            isTwoHoursPassed = scheduledStart.plusHours(2).isBefore(now);
        }

        if (!isCompleted && !isTwoHoursPassed) {
            throw new BadRequestException("Không thể nhập tỉ số trước khi trận đấu kết thúc (sau 2 tiếng kể từ khi bắt đầu)");
        }

        match.setScoreTeamA(req.getScoreTeamA());
        match.setScoreTeamB(req.getScoreTeamB());
        Match saved = matchRepository.save(match);
        MatchDto dto = getMatchDetails(saved.getId());

        notificationService.broadcastScoreEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public void deleteMatch(UUID matchId, User admin) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.isDeleted()) {
            throw new BadRequestException("Trận đấu đã bị xóa trước đó");
        }

        match.setDeleted(true);
        match.setDeletedAt(LocalDateTime.now());
        match.setDeletedBy(admin);
        matchRepository.save(match);

        // Tự động hoàn tác toàn bộ điểm số, bàn thắng của trận này khỏi BXH
        leaderboardService.refreshAllLeaderboard();

        notificationService.broadcastMatchesList("DELETE:" + matchId);
    }

    @Transactional
    public MatchDto restoreMatch(UUID matchId, User admin) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (!match.isDeleted()) {
            throw new BadRequestException("Trận đấu này chưa bị xóa");
        }

        match.setDeleted(false);
        match.setDeletedAt(null);
        match.setDeletedBy(null);
        Match saved = matchRepository.save(match);

        // Tự động khôi phục và cộng dồn lại điểm số, bàn thắng của trận này vào BXH
        leaderboardService.refreshAllLeaderboard();

        MatchDto dto = getMatchDetails(saved.getId());
        notificationService.broadcastMatchesList(dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getDeletedMatches() {
        return matchRepository.findByIsDeletedTrueOrderByDeletedAtDesc().stream()
                .map(MatchDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Match getMatchEntity(UUID matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));
    }

    /**
     * Validate that the status transition is allowed in the match lifecycle.
     * PENDING → JERSEY_SELECTION → PLAYER_PICKING → TRADE_WINDOW → IN_PROGRESS → COMPLETED
     * PLAYER_PICKING can skip directly to IN_PROGRESS (skip trade window).
     * Any state (except COMPLETED/CANCELLED) can transition to CANCELLED.
     */
    private void validateStatusTransition(MatchStatus current, MatchStatus target) {
        boolean valid = switch (current) {
            case PENDING -> target == MatchStatus.JERSEY_SELECTION || target == MatchStatus.CANCELLED;
            case JERSEY_SELECTION -> target == MatchStatus.PLAYER_PICKING || target == MatchStatus.CANCELLED;
            case PLAYER_PICKING -> target == MatchStatus.TRADE_WINDOW || target == MatchStatus.IN_PROGRESS || target == MatchStatus.CANCELLED;
            case TRADE_WINDOW -> target == MatchStatus.IN_PROGRESS || target == MatchStatus.CANCELLED;
            case IN_PROGRESS -> target == MatchStatus.COMPLETED || target == MatchStatus.CANCELLED;
            case COMPLETED, CANCELLED -> false;
        };
        if (!valid) {
            throw new BadRequestException(
                    String.format("Không thể chuyển trạng thái từ '%s' sang '%s'. Vui lòng thực hiện tuần tự các bước.", current, target));
        }
    }

    /**
     * Auto-create PlayerStats for all match participants when match transitions to COMPLETED.
     * Aggregates goals and assists from live match_goals records.
     * Determines winner based on final score.
     */
    private void autoCreatePlayerStatsOnCompletion(Match match) {
        List<MatchParticipant> participants = participantRepository.findByMatchId(match.getId());
        List<MatchGoal> goals = matchGoalRepository.findByMatchIdOrderByMinuteAscCreatedAtAsc(match.getId());

        Integer scoreA = match.getScoreTeamA() != null ? match.getScoreTeamA() : 0;
        Integer scoreB = match.getScoreTeamB() != null ? match.getScoreTeamB() : 0;

        for (MatchParticipant participant : participants) {
            if (participant.getTeam() == null || participant.getTeam() == Team.NONE || participant.getTeam() == Team.BENCH) {
                continue;
            }

            UUID userId = participant.getUser().getId();

            // Aggregate goals from match_goals
            int playerGoals = goals.stream()
                    .filter(g -> g.getScorer().getId().equals(userId))
                    .mapToInt(g -> g.getGoalCount() != null ? g.getGoalCount() : 1)
                    .sum();

            // Count assists from match_goals
            int playerAssists = (int) goals.stream()
                    .filter(g -> g.getAssist() != null && g.getAssist().getId().equals(userId))
                    .count();

            // Determine winner based on final score
            boolean isWinner = (participant.getTeam() == Team.A && scoreA > scoreB) ||
                               (participant.getTeam() == Team.B && scoreB > scoreA);

            // Create or update PlayerStats
            PlayerStats stat = playerStatsRepository.findByMatchIdAndUserId(match.getId(), userId)
                    .orElseGet(() -> PlayerStats.builder()
                            .match(match)
                            .user(participant.getUser())
                            .build());

            stat.setTeam(participant.getTeam());
            stat.setGoals(playerGoals);
            stat.setAssists(playerAssists);
            stat.setIsWinner(isWinner);
            stat.setEnteredAt(LocalDateTime.now());

            playerStatsRepository.save(stat);
        }

        // Refresh leaderboard for all active participants
        for (MatchParticipant participant : participants) {
            if (participant.getTeam() != null && participant.getTeam() != Team.NONE && participant.getTeam() != Team.BENCH) {
                leaderboardService.updateUserStatsInLeaderboard(participant.getUser().getId());
            }
        }
    }
}
