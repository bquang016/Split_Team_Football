package com.chimmoccanh.footballsquad.model;

import com.chimmoccanh.footballsquad.model.enums.TradeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Bước 4 — Trade Window: Đội trưởng có thể đề nghị trao đổi cầu thủ trong vòng 10 phút.
 * Yêu cầu chỉ có hiệu lực khi cả 2 bên đồng ý.
 */
@Entity
@Table(name = "trade_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TradeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_by_id", nullable = false)
    private User requestedBy;       // Đội trưởng gửi yêu cầu

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_offered_id", nullable = false)
    private User playerOffered;     // Cầu thủ bên mình muốn đổi

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_wanted_id", nullable = true)
    private User playerWanted;      // Cầu thủ bên kia muốn lấy (null nếu là tặng cầu thủ trực tiếp)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TradeStatus status = TradeStatus.PENDING;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;    // Hết hạn khi Trade Window đóng lại

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;  // Thời điểm bên kia phản hồi

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
