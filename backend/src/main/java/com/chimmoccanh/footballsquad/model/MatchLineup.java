package com.chimmoccanh.footballsquad.model;

import com.chimmoccanh.footballsquad.model.enums.Position;
import com.chimmoccanh.footballsquad.model.enums.Team;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "match_lineups", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"match_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchLineup {

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
    @Column(nullable = false, length = 10)
    private Team team;

    @Enumerated(EnumType.STRING)
    @Column(name = "position_label", length = 10)
    private Position positionLabel;

    @Column(name = "x_percent")
    private Double xPercent;

    @Column(name = "y_percent")
    private Double yPercent;

    @Column(name = "jersey_number")
    private Integer jerseyNumber;
}
