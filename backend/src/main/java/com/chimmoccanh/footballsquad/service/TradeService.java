package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.CreateTradeRequestDto;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.TradeRequestDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.TradeRequest;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.model.enums.TradeStatus;
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

    @Transactional(readOnly = true)
    public List<TradeRequestDto> getTrades(UUID matchId) {
        return tradeRequestRepository.findByMatchId(matchId).stream()
                .map(TradeRequestDto::fromEntity)
                .collect(Collectors.toList());
    }
}
