-- V19: Add rating to player_stats table
ALTER TABLE player_stats ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION;
