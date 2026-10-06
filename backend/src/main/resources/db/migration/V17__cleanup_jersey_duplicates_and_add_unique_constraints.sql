-- Migration V17: Cleanup duplicate jersey numbers and enforce unique constraints for jersey_number, username, and email

-- 1. Remove jersey number from admin user (admin does not need a player jersey)
UPDATE users SET jersey_number = NULL WHERE username = 'admin' OR role = 'ADMIN';

-- 2. Set quangbui back to jersey #7 if currently on #10 to eliminate conflict with congphuong (#10)
UPDATE users SET jersey_number = 7 WHERE username = 'quangbui' AND jersey_number = 10;

-- 3. For any remaining duplicate jersey numbers, keep the oldest player's jersey and set later duplicates to NULL
UPDATE users
SET jersey_number = NULL
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY jersey_number ORDER BY created_at ASC) as rnum
        FROM users
        WHERE jersey_number IS NOT NULL
    ) ranked
    WHERE ranked.rnum > 1
);

-- 4. Create partial unique index on jersey_number (permits multiple NULLs, ensures unique numbers 1-99)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_jersey_number_unique ON users (jersey_number) WHERE jersey_number IS NOT NULL;

-- 5. Create unique case-insensitive index on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower_unique ON users (LOWER(username));

-- 6. Create unique case-insensitive index on email for non-null emails
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower_unique ON users (LOWER(email)) WHERE email IS NOT NULL;
