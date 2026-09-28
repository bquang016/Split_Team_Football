package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.RecordGoalRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.MatchGoalDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchGoal;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.PlayerStats;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.repository.MatchGoalRepository;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.PlayerStatsRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchGoalService {

    private final MatchGoalRepository matchGoalRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MatchService matchService;
    private final NotificationService notificationService;
    private final LeaderboardService leaderboardService;
    private final MatchParticipantRepository participantRepository;
    private final PlayerStatsRepository playerStatsRepository;

    @Transactional
    public MatchGoalDto recordGoal(UUID matchId, RecordGoalRequest request, User admin) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.IN_PROGRESS && match.getStatus() != MatchStatus.COMPLETED) {
            throw new BadRequestException("Chỉ có thể ghi nhận bàn thắng khi trận đấu đang diễn ra hoặc đã kết thúc");
        }

        User scorer = userRepository.findById(request.getScorerId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ ghi bàn"));

        User assist = null;
        if (request.getAssistId() != null) {
            assist = userRepository.findById(request.getAssistId()).orElse(null);
        }

        int minute = 1;
        if (request.getMinute() != null && request.getMinute() > 0) {
            minute = request.getMinute();
        } else {
            // Tự động tính phút trên sân từ lúc bắt đầu:
            // Ví dụ bắt đầu 19h00 (kết thúc 21h00), lúc 19h01 là phút thứ 1
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime start = match.getStartAt();
            if (start == null && match.getMatchDate() != null) {
                LocalTime time = match.getMatchTime() != null ? match.getMatchTime() : LocalTime.MIDNIGHT;
                start = LocalDateTime.of(match.getMatchDate(), time);
            }
            if (start != null) {
                long diffMin = ChronoUnit.MINUTES.between(start, now);
                minute = Math.max(1, (int) diffMin);
            }
        }

        int count = request.getGoalCount() != null && request.getGoalCount() > 0 ? request.getGoalCount() : 1;

        MatchGoal goal = MatchGoal.builder()
                .match(match)
                .scorer(scorer)
                .assist(assist)
                .team(request.getTeam())
                .minute(minute)
                .goalCount(count)
                .build();

        MatchGoal savedGoal = matchGoalRepository.save(goal);

        // Tự động cộng tỉ số trực tiếp trên sân
        if (request.getTeam() == Team.A) {
            match.setScoreTeamA((match.getScoreTeamA() != null ? match.getScoreTeamA() : 0) + count);
        } else if (request.getTeam() == Team.B) {
            match.setScoreTeamB((match.getScoreTeamB() != null ? match.getScoreTeamB() : 0) + count);
        }
        matchRepository.save(match);

        // Cập nhật PlayerStats và BXH nếu trận đã kết thúc
        if (match.getStatus() == MatchStatus.COMPLETED) {
            recalculatePlayerStatsAfterGoalChange(match);
        }

        MatchGoalDto goalDto = MatchGoalDto.fromEntity(savedGoal);
        MatchDto matchDto = matchService.getMatchDetails(matchId);

        // Broadcast realtime qua WebSocket
        notificationService.broadcastGoalEvent(matchId, goalDto);
        notificationService.broadcastScoreEvent(matchId, matchDto);

        return goalDto;
    }

    @Transactional(readOnly = true)
    public List<MatchGoalDto> getMatchGoals(UUID matchId) {
        return matchGoalRepository.findByMatchIdOrderByMinuteAscCreatedAtAsc(matchId).stream()
                .map(MatchGoalDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteGoal(UUID matchId, UUID goalId, User admin) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        MatchGoal goal = matchGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện bàn thắng"));

        // Trừ lại tỉ số tương ứng
        if (goal.getTeam() == Team.A) {
            match.setScoreTeamA(Math.max(0, (match.getScoreTeamA() != null ? match.getScoreTeamA() : 0) - goal.getGoalCount()));
        } else if (goal.getTeam() == Team.B) {
            match.setScoreTeamB(Math.max(0, (match.getScoreTeamB() != null ? match.getScoreTeamB() : 0) - goal.getGoalCount()));
        }
        matchRepository.save(match);

        matchGoalRepository.delete(goal);

        // Nếu trận đã COMPLETED, cập nhật lại PlayerStats và BXH
        if (match.getStatus() == MatchStatus.COMPLETED) {
            recalculatePlayerStatsAfterGoalChange(match);
        }

        MatchDto matchDto = matchService.getMatchDetails(matchId);
        notificationService.broadcastScoreEvent(matchId, matchDto);
        notificationService.broadcastGoalEvent(matchId, "DELETE:" + goalId);
    }

    /**
     * Recalculate PlayerStats for all participants after a goal is added or deleted.
     * Only called when match is COMPLETED to keep leaderboard data consistent.
     */
    private void recalculatePlayerStatsAfterGoalChange(Match match) {
        List<MatchParticipant> participants = participantRepository.findByMatchId(match.getId());
        List<MatchGoal> goals = matchGoalRepository.findByMatchIdOrderByMinuteAscCreatedAtAsc(match.getId());

        Integer scoreA = match.getScoreTeamA() != null ? match.getScoreTeamA() : 0;
        Integer scoreB = match.getScoreTeamB() != null ? match.getScoreTeamB() : 0;

        for (MatchParticipant participant : participants) {
            if (participant.getTeam() == null || participant.getTeam() == Team.NONE || participant.getTeam() == Team.BENCH) {
                continue;
            }
            UUID userId = participant.getUser().getId();

            int playerGoals = goals.stream()
                    .filter(g -> g.getScorer().getId().equals(userId))
                    .mapToInt(g -> g.getGoalCount() != null ? g.getGoalCount() : 1)
                    .sum();
            int playerAssists = (int) goals.stream()
                    .filter(g -> g.getAssist() != null && g.getAssist().getId().equals(userId))
                    .count();

            boolean isWinner = (participant.getTeam() == Team.A && scoreA > scoreB) ||
                               (participant.getTeam() == Team.B && scoreB > scoreA);

            playerStatsRepository.findByMatchIdAndUserId(match.getId(), userId).ifPresent(stat -> {
                stat.setGoals(playerGoals);
                stat.setAssists(playerAssists);
                stat.setIsWinner(isWinner);
                stat.setEnteredAt(LocalDateTime.now());
                playerStatsRepository.save(stat);
            });

            leaderboardService.updateUserStatsInLeaderboard(userId);
        }
    }
}
