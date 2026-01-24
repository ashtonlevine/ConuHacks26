-- Create budgets table for storing user budget allocations
-- Note: Authentication is handled by Clerk at the API layer
-- Run this in your Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  restaurant_expenses DECIMAL(10,2) DEFAULT 0,
  gas DECIMAL(10,2) DEFAULT 0,
  grocery_shopping DECIMAL(10,2) DEFAULT 0,
  leisure DECIMAL(10,2) DEFAULT 0,
  school_fees DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at on row updates
DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
