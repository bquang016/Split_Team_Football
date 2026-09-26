CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200),
    match_date DATE NOT NULL,
    match_time TIME,
    location VARCHAR(200) DEFAULT 'Sân cố định',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_by UUID REFERENCES users(id),
    score_team_a INT DEFAULT 0,
    score_team_b INT DEFAULT 0,
    ai_analysis TEXT,
    ai_analyzed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
