CREATE TABLE IF NOT EXISTS match_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    scorer_id UUID NOT NULL REFERENCES users(id),
    assist_id UUID REFERENCES users(id),
    team VARCHAR(10) NOT NULL,
    minute INT NOT NULL DEFAULT 1,
    goal_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_goals_match ON match_goals(match_id);
