package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.CreateMatchRequest;
import com.chimmoccanh.footballsquad.dto.request.RecordScoreRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.MatchLineupDto;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.dto.response.SpinSessionDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.repository.MatchLineupRepository;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.SpinSessionRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchParticipantRepository participantRepository;
    private final MatchLineupRepository lineupRepository;
    private final SpinSessionRepository spinSessionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public MatchDto createMatch(CreateMatchRequest request, User creator) {
        String title = request.getTitle();
        if (title == null || title.isBlank()) {
            title = "Trận bóng ngày " + request.getMatchDate();
        }

        Match match = Match.builder()
                .title(title.trim())
                .matchDate(request.getMatchDate())
                .matchTime(request.getMatchTime())
                .location(request.getLocation() != null && !request.getLocation().isBlank() ? request.getLocation().trim() : "Sân cố định")
                .notes(request.getNotes())
                .status(MatchStatus.PENDING)
                .createdBy(creator)
                .scoreTeamA(0)
                .scoreTeamB(0)
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
            matches = matchRepository.findAllByOrderByMatchDateDescCreatedAtDesc();
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

        spinSessionRepository.findFirstByMatchIdOrderBySpunAtDesc(matchId)
                .ifPresent(s -> dto.setSpinSession(SpinSessionDto.fromEntity(s)));

        return dto;
    }

    @Transactional
    public MatchDto updateMatchStatus(UUID matchId, MatchStatus newStatus) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        match.setStatus(newStatus);
        if (newStatus == MatchStatus.IN_PROGRESS && match.getStartAt() == null) {
            match.setStartAt(java.time.LocalDateTime.now());
        } else if (newStatus == MatchStatus.COMPLETED && match.getEndAt() == null) {
            match.setEndAt(java.time.LocalDateTime.now());
        }
        Match saved = matchRepository.save(match);
        MatchDto dto = getMatchDetails(saved.getId());

        notificationService.broadcastMatchStatus(matchId, dto);
        return dto;
    }

    @Transactional
    public MatchDto selectJersey(UUID matchId, String jerseyTeam, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

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
    public void removeParticipantByAdmin(UUID matchId, UUID userId) {
        participantRepository.deleteByMatchIdAndUserId(matchId, userId);
        notificationService.broadcastPickEvent(matchId, "REMOVE:" + userId);
    }

    @Transactional
    public MatchDto updateScore(UUID matchId, RecordScoreRequest req) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        match.setScoreTeamA(req.getScoreTeamA());
        match.setScoreTeamB(req.getScoreTeamB());
        Match saved = matchRepository.save(match);
        MatchDto dto = getMatchDetails(saved.getId());

        notificationService.broadcastScoreEvent(matchId, dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public Match getMatchEntity(UUID matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));
    }
}
