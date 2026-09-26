CREATE TABLE match_lineups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    team VARCHAR(10) NOT NULL, -- A | B
    position_label VARCHAR(10), -- GK | CB | LB | RB | CM | LM | RM | ST | LW | RW | CAM | CDM
    x_percent FLOAT, -- 0–100, % chiều ngang sân
    y_percent FLOAT, -- 0–100, % chiều dọc sân
    jersey_number INT,
    UNIQUE(match_id, user_id)
);

CREATE INDEX idx_lineups_match ON match_lineups(match_id);
