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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

        java.util.Set<com.chimmoccanh.footballsquad.model.enums.Team> teamsInRequest = request.getLineups().stream()
                .map(LineupItemDto::getTeam)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toSet());

        if (!isAdmin && isCaptain) {
            com.chimmoccanh.footballsquad.model.enums.Team captainTeam = participantOpt.get().getTeam();
            if (teamsInRequest.stream().anyMatch(t -> t != captainTeam)) {
                throw new BadRequestException("Đội trưởng chỉ có quyền quản lý và lưu sơ đồ của đội mình");
            }
        }

        // 1. Deduplicate request by userId to avoid duplicates in the same payload
        Map<UUID, LineupItemDto> uniqueItemsByUserId = new LinkedHashMap<>();
        for (LineupItemDto item : request.getLineups()) {
            if (item.getUserId() != null) {
                uniqueItemsByUserId.put(item.getUserId(), item);
            }
        }

        // 2. Delete existing lineups for the teams being updated
        for (com.chimmoccanh.footballsquad.model.enums.Team t : teamsInRequest) {
            lineupRepository.deleteByMatchIdAndTeam(matchId, t);
        }

        // 3. Also delete any existing lineup for these users in this match (in case a user switched teams)
        if (!uniqueItemsByUserId.isEmpty()) {
            lineupRepository.deleteByMatchIdAndUserIdIn(matchId, uniqueItemsByUserId.keySet());
        }

        // 4. Force Hibernate/JPA to immediately flush all DELETES to the database before inserting new records
        lineupRepository.flush();

        // 5. Construct new lineup entities
        List<MatchLineup> lineupsToSave = new ArrayList<>();
        for (LineupItemDto item : uniqueItemsByUserId.values()) {
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

        lineupRepository.saveAllAndFlush(lineupsToSave);
        List<MatchLineup> allSaved = lineupRepository.findByMatchId(matchId);
        List<MatchLineupDto> dtos = allSaved.stream().map(MatchLineupDto::fromEntity).collect(Collectors.toList());

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
