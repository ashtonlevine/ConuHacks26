-- Create goals table for storing user savings goals
-- Note: Authentication is handled by Clerk at the API layer
-- Run this in your Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  target_date DATE,
  category TEXT DEFAULT 'general', -- 'emergency_fund', 'trip', 'purchase', 'education', 'general'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Create trigger to auto-update updated_at on row updates
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
