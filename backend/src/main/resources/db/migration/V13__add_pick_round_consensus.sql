-- V13: Add pick round consensus and round tracking fields to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS pick_round_captain_a_ready BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS pick_round_captain_b_ready BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS current_pick_round INT DEFAULT 0;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS round_first_picker_done BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS round_second_picker_done BOOLEAN DEFAULT FALSE;
