package com.chimmoccanh.footballsquad.model;

import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "player_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"match_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerStats {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Team team;

    @Column(nullable = false)
    @Builder.Default
    private Integer goals = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer assists = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer saves = 0;

    @Column(name = "is_winner", nullable = false)
    @Builder.Default
    private Boolean isWinner = false;

    @Column(name = "is_mvp", nullable = false)
    @Builder.Default
    private Boolean isMvp = false;

    @Column(name = "rating")
    private Double rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by")
    private User enteredBy;

    @Column(name = "entered_at")
    private LocalDateTime enteredAt;
}
