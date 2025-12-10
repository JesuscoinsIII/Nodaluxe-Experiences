# Database Policy Error Fix

## Problem

When running the SQL migration, you get this error:
```
ERROR: 42710: policy "Allow public read access to active events" for table "events" already exists
```

This happens because the policies were created in a previous run, and PostgreSQL doesn't support `CREATE POLICY IF NOT EXISTS`.

## Solution

The SQL migration file has been updated to:
1. **Drop existing policies before creating them** using `DROP POLICY IF EXISTS`
2. **Skip duplicate sample data** using `ON CONFLICT (slug) DO NOTHING`
3. **Added temporary admin policies** to allow create/update/delete from admin panel

## How to Run the Fixed SQL

### Option 1: Via setup-database.js (Easiest)

```bash
cd ~/Desktop/Nodaluxe-Experiences
node setup-database.js
```

This will display the complete SQL. Copy and paste it into the Supabase SQL Editor:
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new

### Option 2: Direct from File

1. Open the file: `supabase/migrations/20251209_create_events_tables.sql`
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click "Run"

### Option 3: Run This SQL Directly

Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new

Copy and paste this SQL:

```sql
-- Events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  location TEXT,
  venue_name TEXT,
  venue_address TEXT,
  city TEXT,
  state TEXT DEFAULT 'TX',
  event_type TEXT,
  image_url TEXT,
  capacity INTEGER,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE
);

-- Event RSVPs table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  number_of_guests INTEGER DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'pending'
);

-- Indexes
CREATE INDEX IF NOT EXISTS events_date_idx ON events(event_date);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(event_type);
CREATE INDEX IF NOT EXISTS events_city_idx ON events(city);
CREATE INDEX IF NOT EXISTS events_active_idx ON events(is_active);
CREATE INDEX IF NOT EXISTS event_rsvps_event_id_idx ON event_rsvps(event_id);

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (THIS IS THE FIX!)
DROP POLICY IF EXISTS "Allow public read access to active events" ON events;
DROP POLICY IF EXISTS "Allow public insert to RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Allow public insert to events" ON events;
DROP POLICY IF EXISTS "Allow public update to events" ON events;
DROP POLICY IF EXISTS "Allow public delete to events" ON events;

-- Allow public read access to active events
CREATE POLICY "Allow public read access to active events"
ON events FOR SELECT
USING (is_active = true);

-- Allow public insert to RSVPs (for form submissions)
CREATE POLICY "Allow public insert to RSVPs"
ON event_rsvps FOR INSERT
WITH CHECK (true);

-- Temporary policy for testing - allows anyone to insert/update/delete events
-- TODO: Replace with authenticated-only policies in production
CREATE POLICY "Allow public insert to events"
ON events FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to events"
ON events FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete to events"
ON events FOR DELETE
USING (true);

-- Sample events data (will skip if already exists)
INSERT INTO events (title, slug, description, short_description, event_date, event_end_date, location, venue_name, venue_address, city, state, event_type, image_url, capacity, price, is_active, featured) VALUES
('Austin Tech Mixer 2025', 'austin-tech-mixer-2025', 'Join us for an evening of networking with Austin''s top tech professionals, entrepreneurs, and innovators. Enjoy complimentary drinks, light bites, and meaningful conversations in a sophisticated setting.', 'Evening networking event for tech professionals', '2025-01-15 18:00:00-06', '2025-01-15 22:00:00-06', 'East Austin', 'The Concourse Project', '8509 Burleson Rd', 'Austin', 'TX', 'corporate', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', 150, 0.00, true, true),
('Sunset Jazz at The Betty', 'sunset-jazz-betty-2025', 'Experience an intimate evening of live jazz in the heart of downtown Austin. Featuring local artists, craft cocktails, and stunning sunset views from our rooftop terrace.', 'Live jazz music and cocktails downtown', '2025-01-20 19:00:00-06', '2025-01-20 23:00:00-06', 'Downtown Austin', 'The Betty', '510 Rio Grande St', 'Austin', 'TX', 'concerts', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 80, 25.00, true, false),
('Charity Gala: Hearts for Austin', 'charity-gala-hearts-austin', 'An elegant fundraising gala benefiting local Austin charities. Join us for a night of fine dining, silent auctions, and live entertainment while supporting our community''s most vulnerable members.', 'Elegant fundraising gala for local charities', '2025-02-14 18:30:00-06', '2025-02-14 23:00:00-06', 'Barton Creek', 'Omni Hotel @ Barton Springs', '13500 Bartlett Blvd', 'Austin', 'TX', 'fundraising', 'https://images.unsplash.com/photo-1519167758481-83f29da8-f814?auto=format&fit=crop&w=800&q=80', 200, 150.00, true, true)
ON CONFLICT (slug) DO NOTHING;
```

## What Changed

1. **Added `DROP POLICY IF EXISTS`** before each `CREATE POLICY` to remove existing policies
2. **Added `ON CONFLICT (slug) DO NOTHING`** to skip inserting sample data if it already exists
3. **Added temporary policies** for INSERT, UPDATE, and DELETE operations on events table

## Verify Success

After running the SQL successfully:

1. **Check Tables:**
   - Go to Supabase Dashboard → Table Editor
   - You should see `events` and `event_rsvps` tables

2. **Test Events Page:**
   - Visit: https://nodaluxe.netlify.app/events
   - Should display 3 sample events

3. **Test Admin Panel:**
   - Visit: https://nodaluxe.netlify.app/admin-events.html
   - Should be able to create/edit/delete events

## Important Security Note

The current policies allow **anyone** to create, update, and delete events. This is for testing only.

**For production**, follow the instructions in `AUTH_SETUP.md` to:
1. Enable authentication
2. Replace public policies with authenticated-only policies
3. Protect the admin panel with login

## Troubleshooting

### Still Getting Policy Errors?
Run this SQL first to drop ALL policies:
```sql
DROP POLICY IF EXISTS "Allow public read access to active events" ON events;
DROP POLICY IF EXISTS "Allow public insert to RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Allow public insert to events" ON events;
DROP POLICY IF EXISTS "Allow public update to events" ON events;
DROP POLICY IF EXISTS "Allow public delete to events" ON events;
```

Then run the full migration SQL again.

### Sample Data Not Appearing?
The sample data may already exist. Check the Table Editor to see if events are there.

### "Could not find the table 'public.events'" Error?
The tables haven't been created yet. Make sure the SQL runs without errors.

## Quick Links

- **SQL Editor**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/editor
- **Events Page**: https://nodaluxe.netlify.app/events
- **Admin Panel**: https://nodaluxe.netlify.app/admin-events.html
