-- Migration V18: Update jersey number unique indexes to support guest player rules:
-- 1. Real users (PLAYER, ADMIN) have unique jersey numbers among themselves.
-- 2. Guests (GUEST) have unique jersey numbers among themselves.
-- 3. A real user can claim a jersey number held by a guest (one-way priority).

DROP INDEX IF EXISTS idx_users_jersey_number_unique;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_jersey_number_real_unique 
ON users (jersey_number) 
WHERE jersey_number IS NOT NULL AND role != 'GUEST';

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_jersey_number_guest_unique 
ON users (jersey_number) 
WHERE jersey_number IS NOT NULL AND role = 'GUEST';
