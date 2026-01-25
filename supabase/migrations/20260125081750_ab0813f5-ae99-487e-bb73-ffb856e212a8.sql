-- Add 'escalated' to issue_status enum
ALTER TYPE issue_status ADD VALUE IF NOT EXISTS 'escalated';