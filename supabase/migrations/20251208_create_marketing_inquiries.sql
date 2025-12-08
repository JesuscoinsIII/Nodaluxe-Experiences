CREATE TABLE IF NOT EXISTS marketing_inquiries (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  business_name TEXT,
  business_location TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  product_service TEXT,
  event_corporate BOOLEAN DEFAULT FALSE,
  event_social BOOLEAN DEFAULT FALSE,
  event_sports BOOLEAN DEFAULT FALSE,
  event_fundraising BOOLEAN DEFAULT FALSE,
  event_community BOOLEAN DEFAULT FALSE,
  event_concerts BOOLEAN DEFAULT FALSE,
  event_chef_driven BOOLEAN DEFAULT FALSE,
  event_other BOOLEAN DEFAULT FALSE,
  comments TEXT
);

-- Disable RLS for the table
ALTER TABLE marketing_inquiries DISABLE ROW LEVEL SECURITY;
