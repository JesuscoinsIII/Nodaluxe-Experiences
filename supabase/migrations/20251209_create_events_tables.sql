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
  event_type TEXT, -- corporate, social, sports, concerts, fundraising, etc.
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
  status TEXT DEFAULT 'pending' -- pending, confirmed, cancelled
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS events_date_idx ON events(event_date);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(event_type);
CREATE INDEX IF NOT EXISTS events_city_idx ON events(city);
CREATE INDEX IF NOT EXISTS events_active_idx ON events(is_active);
CREATE INDEX IF NOT EXISTS event_rsvps_event_id_idx ON event_rsvps(event_id);

-- Row Level Security (RLS) - Enable for production
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active events
CREATE POLICY "Allow public read access to active events"
ON events FOR SELECT
USING (is_active = true);

-- Allow public insert to RSVPs (for form submissions)
CREATE POLICY "Allow public insert to RSVPs"
ON event_rsvps FOR INSERT
WITH CHECK (true);

-- Sample events data for testing
INSERT INTO events (title, slug, description, short_description, event_date, event_end_date, location, venue_name, venue_address, city, state, event_type, image_url, capacity, price, is_active, featured) VALUES
('Austin Tech Mixer 2025', 'austin-tech-mixer-2025', 'Join us for an evening of networking with Austin''s top tech professionals, entrepreneurs, and innovators. Enjoy complimentary drinks, light bites, and meaningful conversations in a sophisticated setting.', 'Evening networking event for tech professionals', '2025-01-15 18:00:00-06', '2025-01-15 22:00:00-06', 'East Austin', 'The Concourse Project', '8509 Burleson Rd', 'Austin', 'TX', 'corporate', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', 150, 0.00, true, true),
('Sunset Jazz at The Betty', 'sunset-jazz-betty-2025', 'Experience an intimate evening of live jazz in the heart of downtown Austin. Featuring local artists, craft cocktails, and stunning sunset views from our rooftop terrace.', 'Live jazz music and cocktails downtown', '2025-01-20 19:00:00-06', '2025-01-20 23:00:00-06', 'Downtown Austin', 'The Betty', '510 Rio Grande St', 'Austin', 'TX', 'concerts', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 80, 25.00, true, false),
('Charity Gala: Hearts for Austin', 'charity-gala-hearts-austin', 'An elegant fundraising gala benefiting local Austin charities. Join us for a night of fine dining, silent auctions, and live entertainment while supporting our community''s most vulnerable members.', 'Elegant fundraising gala for local charities', '2025-02-14 18:30:00-06', '2025-02-14 23:00:00-06', 'Barton Creek', 'Omni Hotel @ Barton Springs', '13500 Bartlett Blvd', 'Austin', 'TX', 'fundraising', 'https://images.unsplash.com/photo-1519167758481-83f29da8-f814?auto=format&fit=crop&w=800&q=80', 200, 150.00, true, true);
