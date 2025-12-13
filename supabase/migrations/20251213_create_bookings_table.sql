-- Create bookings table with payment tracking
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  booking_type TEXT NOT NULL, -- 'transportation', 'quad_pack', 'event'
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'usd',
  receipt_url TEXT,
  booking_details JSONB,
  notes TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_email_idx ON bookings(email);
CREATE INDEX IF NOT EXISTS bookings_payment_status_idx ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS bookings_stripe_payment_intent_idx ON bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS bookings_booking_type_idx ON bookings(booking_type);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for checkout form submissions)
CREATE POLICY "Allow public insert to bookings"
ON bookings FOR INSERT
WITH CHECK (true);

-- Allow reads with payment intent ID (for payment status checking)
CREATE POLICY "Allow read with payment intent"
ON bookings FOR SELECT
USING (stripe_payment_intent_id IS NOT NULL);

-- Allow service role to update (for webhook)
CREATE POLICY "Allow service role full access"
ON bookings FOR ALL
USING (true)
WITH CHECK (true);
