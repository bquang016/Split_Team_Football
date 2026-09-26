package com.chimmoccanh.footballsquad.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leaderboard_cache")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardCache {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.EAGER)
    @PrimaryKeyJoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_goals")
    @Builder.Default
    private Integer totalGoals = 0;

    @Column(name = "total_assists")
    @Builder.Default
    private Integer totalAssists = 0;

    @Column(name = "total_wins")
    @Builder.Default
    private Integer totalWins = 0;

    @Column(name = "total_matches")
    @Builder.Default
    private Integer totalMatches = 0;

    @Column(name = "win_rate")
    @Builder.Default
    private Double winRate = 0.0;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
