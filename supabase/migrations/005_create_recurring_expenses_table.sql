-- Create recurring expenses table for tracking regular bills
-- Note: Authentication is handled by Clerk at the API layer
-- Run this in your Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'semester', 'yearly')),
  category TEXT,
  is_paid BOOLEAN DEFAULT false,
  next_due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_next_due ON recurring_expenses(next_due_date);

-- Create trigger to auto-update updated_at on row updates
DROP TRIGGER IF EXISTS update_recurring_expenses_updated_at ON recurring_expenses;
CREATE TRIGGER update_recurring_expenses_updated_at
  BEFORE UPDATE ON recurring_expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
