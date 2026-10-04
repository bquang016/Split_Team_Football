-- Add consensus/confirmation fields to matches table
ALTER TABLE matches ADD COLUMN IF NOT EXISTS trade_window_started_at TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS captain_a_confirmed_proceed BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS captain_b_confirmed_proceed BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS captain_a_confirmed_no_trade BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS captain_b_confirmed_no_trade BOOLEAN DEFAULT FALSE;
