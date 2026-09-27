-- 1. Add missing columns to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS jersey_winner_team VARCHAR(10);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS start_at TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS end_at TIMESTAMP;

-- 2. Add missing columns to player_stats
ALTER TABLE player_stats ADD COLUMN IF NOT EXISTS saves INT DEFAULT 0;

-- 3. Add missing columns to leaderboard_cache
ALTER TABLE leaderboard_cache ADD COLUMN IF NOT EXISTS total_losses INT DEFAULT 0;
ALTER TABLE leaderboard_cache ADD COLUMN IF NOT EXISTS total_draws INT DEFAULT 0;
ALTER TABLE leaderboard_cache ADD COLUMN IF NOT EXISTS total_saves INT DEFAULT 0;
ALTER TABLE leaderboard_cache ADD COLUMN IF NOT EXISTS total_mvp INT DEFAULT 0;

-- 4. Create trade_requests table
CREATE TABLE IF NOT EXISTS trade_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    requested_by_id UUID NOT NULL REFERENCES users(id),
    player_offered_id UUID NOT NULL REFERENCES users(id),
    player_wanted_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trade_requests_match ON trade_requests(match_id);
CREATE INDEX IF NOT EXISTS idx_trade_requests_status ON trade_requests(status);
