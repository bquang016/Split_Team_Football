CREATE TABLE spin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    host_a_id UUID REFERENCES users(id),
    host_b_id UUID REFERENCES users(id),
    winner_id UUID REFERENCES users(id),
    spin_seed BIGINT NOT NULL,
    duration_ms INT,
    spun_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_spin_sessions_match ON spin_sessions(match_id);
