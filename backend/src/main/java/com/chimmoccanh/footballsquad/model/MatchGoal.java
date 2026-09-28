package com.chimmoccanh.footballsquad.model;

import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scorer_id", nullable = false)
    private User scorer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assist_id")
    private User assist;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Team team;

    @Column(nullable = false)
    @Builder.Default
    private Integer minute = 1;

    @Column(name = "goal_count", nullable = false)
    @Builder.Default
    private Integer goalCount = 1;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
