CREATE TABLE leaderboard_cache (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    total_goals INT DEFAULT 0,
    total_assists INT DEFAULT 0,
    total_wins INT DEFAULT 0,
    total_matches INT DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT now()
);
