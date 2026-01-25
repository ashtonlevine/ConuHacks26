-- Add rent and other columns to budgets table
-- This allows users to set budgets for all 7 expense categories

ALTER TABLE budgets ADD COLUMN IF NOT EXISTS rent DECIMAL(10,2) DEFAULT 0;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS other DECIMAL(10,2) DEFAULT 0;
