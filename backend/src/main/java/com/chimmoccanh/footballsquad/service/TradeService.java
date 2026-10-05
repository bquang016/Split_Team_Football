package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.CreateTradeRequestDto;
import com.chimmoccanh.footballsquad.dto.request.DonatePlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.TradeRequestDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.TradeRequest;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.model.enums.TradeStatus;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import com.chimmoccanh.footballsquad.repository.TradeRequestRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final TradeRequestRepository tradeRequestRepository;
    private final MatchRepository matchRepository;
    private final MatchParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public TradeRequestDto createTrade(UUID matchId, CreateTradeRequestDto request, User sender) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        User offeredUser = userRepository.findById(request.getPlayerOfferedId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ đổi đi"));

        User wantedUser = userRepository.findById(request.getPlayerWantedId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ muốn lấy"));

        MatchParticipant partOffered = participantRepository.findByMatchIdAndUserId(matchId, offeredUser.getId())
                .orElseThrow(() -> new BadRequestException("Cầu thủ đổi đi chưa tham gia trận"));

        MatchParticipant partWanted = participantRepository.findByMatchIdAndUserId(matchId, wantedUser.getId())
                .orElseThrow(() -> new BadRequestException("Cầu thủ muốn lấy chưa tham gia trận"));

        if (partOffered.getTeam() == partWanted.getTeam() || partOffered.getTeam() == Team.NONE || partWanted.getTeam() == Team.NONE) {
            throw new BadRequestException("Hai cầu thủ phải thuộc hai đội khác nhau để trao đổi");
        }

        TradeRequest trade = TradeRequest.builder()
                .match(match)
                .requestedBy(sender)
                .playerOffered(offeredUser)
                .playerWanted(wantedUser)
                .status(TradeStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        TradeRequest saved = tradeRequestRepository.save(trade);
        TradeRequestDto dto = TradeRequestDto.fromEntity(saved);

        // Reset no-trade consensus if active
        if (match.isCaptainAConfirmedNoTrade() || match.isCaptainBConfirmedNoTrade()) {
            match.setCaptainAConfirmedNoTrade(false);
            match.setCaptainBConfirmedNoTrade(false);
            matchRepository.save(match);
            notificationService.broadcastMatchStatus(matchId, MatchDto.fromEntity(match));
        }

        notificationService.broadcastTradeEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public TradeRequestDto respondTrade(UUID matchId, UUID tradeId, boolean accept, User responder) {
        TradeRequest trade = tradeRequestRepository.findById(tradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu chuyển nhượng"));

        if (trade.getStatus() != TradeStatus.PENDING) {
            throw new BadRequestException("Yêu cầu chuyển nhượng không còn ở trạng thái chờ duyệt");
        }

        if (accept) {
            trade.setStatus(TradeStatus.ACCEPTED);
            trade.setRespondedAt(LocalDateTime.now());

            // Swap the teams of the two players
            MatchParticipant partOffered = participantRepository.findByMatchIdAndUserId(matchId, trade.getPlayerOffered().getId())
                    .orElseThrow(() -> new BadRequestException("Cầu thủ không còn trong trận"));
            MatchParticipant partWanted = participantRepository.findByMatchIdAndUserId(matchId, trade.getPlayerWanted().getId())
                    .orElseThrow(() -> new BadRequestException("Cầu thủ không còn trong trận"));

            Team tempTeam = partOffered.getTeam();
            partOffered.setTeam(partWanted.getTeam());
            partWanted.setTeam(tempTeam);

            participantRepository.save(partOffered);
            participantRepository.save(partWanted);

            // Notify team participant change
            notificationService.broadcastPickEvent(matchId, "TRADE_SWAP:" + trade.getPlayerOffered().getId() + "<->" + trade.getPlayerWanted().getId());
        } else {
            trade.setStatus(TradeStatus.REJECTED);
            trade.setRespondedAt(LocalDateTime.now());
        }

        TradeRequest saved = tradeRequestRepository.save(trade);
        TradeRequestDto dto = TradeRequestDto.fromEntity(saved);

        // Reset no-trade consensus if active
        Match match = trade.getMatch();
        if (match != null && (match.isCaptainAConfirmedNoTrade() || match.isCaptainBConfirmedNoTrade())) {
            match.setCaptainAConfirmedNoTrade(false);
            match.setCaptainBConfirmedNoTrade(false);
            matchRepository.save(match);
            notificationService.broadcastMatchStatus(matchId, MatchDto.fromEntity(match));
        }

        notificationService.broadcastTradeEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public TradeRequestDto cancelTrade(UUID matchId, UUID tradeId, User requester) {
        TradeRequest trade = tradeRequestRepository.findById(tradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu chuyển nhượng"));

        if (trade.getStatus() != TradeStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể hủy yêu cầu đang chờ");
        }

        trade.setStatus(TradeStatus.CANCELLED);
        TradeRequest saved = tradeRequestRepository.save(trade);
        TradeRequestDto dto = TradeRequestDto.fromEntity(saved);

        notificationService.broadcastTradeEvent(matchId, dto);
        return dto;
    }

    @Transactional
    public TradeRequestDto donatePlayer(UUID matchId, DonatePlayerRequest request, User sender) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trận đấu"));

        if (match.getStatus() != MatchStatus.TRADE_WINDOW) {
            throw new BadRequestException("Thao tác chỉ có thể thực hiện trong bước Trao đổi");
        }

        // Check sender is captain or admin
        boolean isAdmin = sender.getRole() == UserRole.ADMIN;
        MatchParticipant senderPart = participantRepository.findByMatchIdAndUserId(matchId, sender.getId()).orElse(null);
        boolean isCaptain = senderPart != null && Boolean.TRUE.equals(senderPart.getIsHost());

        if (!isCaptain && !isAdmin) {
            throw new BadRequestException("Chỉ đội trưởng mới có quyền chuyển nhượng cầu thủ");
        }

        MatchParticipant donatedPart = participantRepository.findByMatchIdAndUserId(matchId, request.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cầu thủ cần chuyển"));

        if (donatedPart.getTeam() == Team.NONE) {
            throw new BadRequestException("Cầu thủ chưa thuộc đội nào");
        }

        if (Boolean.TRUE.equals(donatedPart.getIsHost())) {
            throw new BadRequestException("Không thể chuyển nhượng đội trưởng sang đội khác");
        }

        if (!isAdmin && senderPart != null && donatedPart.getTeam() != senderPart.getTeam()) {
            throw new BadRequestException("Bạn chỉ có thể chuyển nhượng cầu thủ thuộc đội của mình");
        }

        Team sourceTeam = donatedPart.getTeam();
        Team targetTeam = (sourceTeam == Team.A) ? Team.B : Team.A;

        List<MatchParticipant> teamAPlayers = participantRepository.findByMatchIdAndTeam(matchId, Team.A);
        List<MatchParticipant> teamBPlayers = participantRepository.findByMatchIdAndTeam(matchId, Team.B);

        int newSizeA = (sourceTeam == Team.A) ? teamAPlayers.size() - 1 : teamAPlayers.size() + 1;
        int newSizeB = (sourceTeam == Team.B) ? teamBPlayers.size() - 1 : teamBPlayers.size() + 1;
        int diff = Math.abs(newSizeA - newSizeB);

        if (diff > 2) {
            throw new BadRequestException("Không thể chuyển nhượng: Sĩ số giữa hai đội không được chênh lệch quá 2 người (Hiện tại nếu chuyển sẽ là " + newSizeA + " so với " + newSizeB + ")");
        }

        // Apply transfer
        donatedPart.setTeam(targetTeam);
        participantRepository.save(donatedPart);

        // Record trade request
        TradeRequest trade = TradeRequest.builder()
                .match(match)
                .requestedBy(sender)
                .playerOffered(donatedPart.getUser())
                .playerWanted(null)
                .status(TradeStatus.ACCEPTED)
                .expiresAt(LocalDateTime.now())
                .respondedAt(LocalDateTime.now())
                .build();
        TradeRequest saved = tradeRequestRepository.save(trade);
        TradeRequestDto dto = TradeRequestDto.fromEntity(saved);

        // Reset no-trade consensus if active
        if (match.isCaptainAConfirmedNoTrade() || match.isCaptainBConfirmedNoTrade()) {
            match.setCaptainAConfirmedNoTrade(false);
            match.setCaptainBConfirmedNoTrade(false);
            matchRepository.save(match);
            notificationService.broadcastMatchStatus(matchId, MatchDto.fromEntity(match));
        }

        notificationService.broadcastPickEvent(matchId, "TRADE_DONATE:" + donatedPart.getUser().getId() + "->" + targetTeam.name());
        notificationService.broadcastTradeEvent(matchId, dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<TradeRequestDto> getTrades(UUID matchId) {
        return tradeRequestRepository.findByMatchId(matchId).stream()
                .map(TradeRequestDto::fromEntity)
                .collect(Collectors.toList());
    }
}
