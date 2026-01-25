-- Create deals table for storing restaurant deals
-- Note: This can be populated by admins/business partners
-- Run this in your Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  distance TEXT,
  hours TEXT,
  rating DECIMAL(2,1),
  is_sponsored BOOLEAN DEFAULT false,
  valid_until DATE,
  terms TEXT,
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user saved deals table for favorites
CREATE TABLE IF NOT EXISTS user_saved_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, deal_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_is_sponsored ON deals(is_sponsored);
CREATE INDEX IF NOT EXISTS idx_user_saved_deals_user_id ON user_saved_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_deals_deal_id ON user_saved_deals(deal_id);

-- Create trigger to auto-update updated_at on row updates
DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
