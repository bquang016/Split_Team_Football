package com.chimmoccanh.footballsquad.model;

import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"match_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchParticipant {

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
    @Builder.Default
    private Team team = Team.NONE;

    @Column(name = "is_host")
    @Builder.Default
    private Boolean isHost = false;

    @Column(name = "pick_order")
    private Integer pickOrder;

    @Column(name = "jersey_number")
    private Integer jerseyNumber;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;
}
