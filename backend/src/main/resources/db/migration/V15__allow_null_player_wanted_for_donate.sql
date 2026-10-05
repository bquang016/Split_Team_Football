-- V15: Allow NULL player_wanted_id in trade_requests for direct player donations (without receiving a player back)
ALTER TABLE trade_requests ALTER COLUMN player_wanted_id DROP NOT NULL;
