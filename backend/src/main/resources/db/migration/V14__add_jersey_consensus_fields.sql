-- V14: Add jersey selection consensus and confirmation fields to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS jersey_captain_a_ready BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS jersey_captain_b_ready BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS jersey_turn_started_at TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS jersey_captain_a_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS jersey_captain_b_confirmed BOOLEAN DEFAULT FALSE;
