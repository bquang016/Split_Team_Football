CREATE TABLE player_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    team VARCHAR(10),
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    is_winner BOOLEAN DEFAULT false,
    is_mvp BOOLEAN DEFAULT false,
    entered_by UUID REFERENCES users(id),
    entered_at TIMESTAMP,
    UNIQUE(match_id, user_id)
);

CREATE INDEX idx_player_stats_match ON player_stats(match_id);
CREATE INDEX idx_player_stats_user ON player_stats(user_id);
