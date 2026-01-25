-- Create sponsorship_requests table for tracking restaurant sponsorship requests
-- Run this in your Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS sponsorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  daily_rate_cents INTEGER NOT NULL DEFAULT 500,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_status ON sponsorship_requests(status);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_business_name ON sponsorship_requests(business_name);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_contact_email ON sponsorship_requests(contact_email);
CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_dates ON sponsorship_requests(start_date, end_date);

-- Create trigger to auto-update updated_at on row updates
DROP TRIGGER IF EXISTS update_sponsorship_requests_updated_at ON sponsorship_requests;
CREATE TRIGGER update_sponsorship_requests_updated_at
  BEFORE UPDATE ON sponsorship_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
