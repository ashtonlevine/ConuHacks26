-- Add period_type column to budgets table to support weekly and monthly budgets
-- Each user can have one weekly budget and one monthly budget

-- First, add the period_type column with a default of 'monthly' for existing records
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS period_type TEXT DEFAULT 'monthly';

-- Update existing records to have period_type = 'monthly'
UPDATE budgets SET period_type = 'monthly' WHERE period_type IS NULL;

-- Drop the existing unique constraint on user_id
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_user_id_key;

-- Add a new unique constraint on user_id + period_type
-- This allows each user to have one budget per period type
ALTER TABLE budgets ADD CONSTRAINT budgets_user_id_period_type_key UNIQUE (user_id, period_type);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_budgets_user_id_period_type ON budgets(user_id, period_type);
