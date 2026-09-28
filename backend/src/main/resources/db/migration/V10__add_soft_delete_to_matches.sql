-- V10: Add soft delete columns to matches table
ALTER TABLE matches ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_matches_is_deleted ON matches(is_deleted);
