CREATE TABLE match_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    team VARCHAR(10), -- A | B | BENCH | NONE
    is_host BOOLEAN DEFAULT false, -- đội trưởng
    pick_order INT, -- thứ tự được chọn
    jersey_number INT,
    joined_at TIMESTAMP DEFAULT now(),
    UNIQUE(match_id, user_id)
);

CREATE INDEX idx_participants_match ON match_participants(match_id);
CREATE INDEX idx_participants_user ON match_participants(user_id);
