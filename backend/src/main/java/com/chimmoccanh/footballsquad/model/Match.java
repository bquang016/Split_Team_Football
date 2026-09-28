package com.chimmoccanh.footballsquad.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.chimmoccanh.footballsquad.model.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 200)
    private String title;

    @Column(name = "match_date", nullable = false)
    private LocalDate matchDate;

    @Column(name = "match_time")
    private LocalTime matchTime;

    @Column(length = 200)
    @Builder.Default
    private String location = "Sân cố định";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private MatchStatus status = MatchStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "score_team_a")
    @Builder.Default
    private Integer scoreTeamA = 0;

    @Column(name = "score_team_b")
    @Builder.Default
    private Integer scoreTeamB = 0;

    @Column(name = "ai_analysis", columnDefinition = "TEXT")
    private String aiAnalysis;

    @Column(name = "ai_analyzed_at")
    private LocalDateTime aiAnalyzedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "jersey_winner_team", length = 10)
    private String jerseyWinnerTeam;   // "SPAIN" hoặc "FRANCE" - đội áo mà người thắng spin đã chọn

    @Column(name = "first_pick_team", length = 10)
    private String firstPickTeam;      // "A" hoặc "B" - đội thắng vòng quay chọn cầu thủ trước

    @Column(name = "pick_turn_started_at")
    private LocalDateTime pickTurnStartedAt; // Thời điểm bắt đầu lượt pick hiện tại để đếm ngược 60s

    @Column(name = "start_at")
    private LocalDateTime startAt;     // Thời điểm ADMIN bắt đầu trận (IN_PROGRESS)

    @Column(name = "end_at")
    private LocalDateTime endAt;       // Thời điểm ADMIN kết thúc trận (COMPLETED)

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deleted_by")
    private User deletedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
