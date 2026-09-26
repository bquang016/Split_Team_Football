package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.LineupItemDto;
import com.chimmoccanh.footballsquad.dto.request.SaveLineupRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchLineupDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.exception.UnauthorizedException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchLineup;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.repository.MatchLineupRepository;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LineupService {

    private final MatchRepository matchRepository;
    private final MatchLineupRepository lineupRepository;
    private final MatchParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public List<MatchLineupDto> saveLineup(UUID matchId, SaveLineupRequest request, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        // Validate permission: Admin OR Captains can save lineup
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;
        boolean isCaptain = false;

        Optional<MatchParticipant> participantOpt = participantRepository.findByMatchIdAndUserId(matchId, currentUser.getId());
        if (participantOpt.isPresent() && Boolean.TRUE.equals(participantOpt.get().getIsHost())) {
            isCaptain = true;
        }

        if (!isAdmin && !isCaptain) {
            throw new UnauthorizedException("Chỉ Quản trị viên và Đội trưởng mới có quyền lưu sơ đồ đội hình");
        }

        // Delete existing lineup for this match or upsert
        lineupRepository.deleteByMatchId(matchId);

        List<MatchLineup> lineupsToSave = new ArrayList<>();
        for (LineupItemDto item : request.getLineups()) {
            User player = userRepository.findById(item.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ: " + item.getUserId()));

            MatchLineup lineup = MatchLineup.builder()
                    .match(match)
                    .user(player)
                    .team(item.getTeam())
                    .positionLabel(item.getPositionLabel())
                    .xPercent(item.getXPercent())
                    .yPercent(item.getYPercent())
                    .jerseyNumber(item.getJerseyNumber() != null ? item.getJerseyNumber() : player.getJerseyNumber())
                    .build();

            lineupsToSave.add(lineup);
        }

        List<MatchLineup> savedLineups = lineupRepository.saveAll(lineupsToSave);
        List<MatchLineupDto> dtos = savedLineups.stream().map(MatchLineupDto::fromEntity).collect(Collectors.toList());

        notificationService.broadcastLineupEvent(matchId, dtos);
        return dtos;
    }

    @Transactional(readOnly = true)
    public List<MatchLineupDto> getLineup(UUID matchId, Team team) {
        List<MatchLineup> lineups;
        if (team != null) {
            lineups = lineupRepository.findByMatchIdAndTeam(matchId, team);
        } else {
            lineups = lineupRepository.findByMatchId(matchId);
        }
        return lineups.stream().map(MatchLineupDto::fromEntity).collect(Collectors.toList());
    }
}
