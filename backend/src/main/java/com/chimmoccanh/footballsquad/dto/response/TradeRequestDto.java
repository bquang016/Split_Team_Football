package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.TradeRequest;
import com.chimmoccanh.footballsquad.model.enums.TradeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TradeRequestDto {
    private UUID id;
    private UUID matchId;
    private UserDto requestedBy;
    private UserDto playerOffered;
    private UserDto playerWanted;
    private TradeStatus status;
    private LocalDateTime expiresAt;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;

    public static TradeRequestDto fromEntity(TradeRequest trade) {
        if (trade == null) return null;
        return TradeRequestDto.builder()
                .id(trade.getId())
                .matchId(trade.getMatch() != null ? trade.getMatch().getId() : null)
                .requestedBy(UserDto.fromEntity(trade.getRequestedBy()))
                .playerOffered(UserDto.fromEntity(trade.getPlayerOffered()))
                .playerWanted(UserDto.fromEntity(trade.getPlayerWanted()))
                .status(trade.getStatus())
                .expiresAt(trade.getExpiresAt())
                .respondedAt(trade.getRespondedAt())
                .createdAt(trade.getCreatedAt())
                .build();
    }
}
