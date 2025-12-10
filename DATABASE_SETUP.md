# Database Setup Guide for Nodaluxe Events

This guide will help you set up the backend database tables for the events system.

## Prerequisites

- Active Supabase project at `fdezwoglwhbkhzhmnxxv.supabase.co`
- Access to Supabase Dashboard

## Step 1: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to the Supabase SQL Editor:**
   - Visit: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new

2. **Copy the SQL migration:**
   - Open the file: `supabase/migrations/20251209_create_events_tables.sql`
   - OR run: `node setup-database.js` to see the SQL

3. **Paste and execute:**
   - Paste the entire SQL into the editor
   - Click **"Run"** to execute

4. **Verify creation:**
   - Navigate to **Table Editor** in Supabase Dashboard
   - You should see two new tables:
     - `events` (with 3 sample events)
     - `event_rsvps`

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref fdezwoglwhbkhzhmnxxv

# Run migrations
supabase db push
```

## Step 2: Verify Tables Created

### Test the API connection:

```bash
curl "https://fdezwoglwhbkhzhmnxxv.supabase.co/rest/v1/events?limit=3" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZXp3b2dsd2hia2h6aG1ueHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODYzMDksImV4cCI6MjA4MDc2MjMwOX0.JlOALehErZF_Ret4XokYWovch6K6fVvRiaj3DKtBLHs"
```

You should see JSON data for 3 sample events.

## Step 3: Access the Frontend

### Events Page (Public)
- **Local:** Open `events.html` in a browser
- **Live:** https://nodaluxe.netlify.app/events

### Admin Panel
- **Local:** Open `admin-events.html` in a browser
- **Live:** https://nodaluxe.netlify.app/admin-events.html

**Note:** The admin panel currently uses the anonymous (public) Supabase key. For production, you should:
1. Implement proper authentication
2. Use Row Level Security (RLS) policies
3. Restrict admin operations to authenticated users

## Database Schema

### `events` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp |
| `updated_at` | TIMESTAMPTZ | Auto-generated timestamp |
| `title` | TEXT | Event title * |
| `slug` | TEXT | URL-friendly slug (unique) * |
| `description` | TEXT | Full event description |
| `short_description` | TEXT | Brief tagline |
| `event_date` | TIMESTAMPTZ | Start date/time * |
| `event_end_date` | TIMESTAMPTZ | End date/time |
| `location` | TEXT | General area (e.g., "Downtown Austin") |
| `venue_name` | TEXT | Venue name |
| `venue_address` | TEXT | Full address |
| `city` | TEXT | City name |
| `state` | TEXT | State (default: TX) |
| `event_type` | TEXT | corporate, social, sports, concerts, etc. |
| `image_url` | TEXT | Event image URL |
| `capacity` | INTEGER | Maximum attendees |
| `price` | DECIMAL | Ticket price (0.00 for free) |
| `is_active` | BOOLEAN | Show on website |
| `featured` | BOOLEAN | Highlight event |

\* = Required fields

### `event_rsvps` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp |
| `event_id` | BIGINT | FK to events.id * |
| `full_name` | TEXT | Guest name * |
| `email` | TEXT | Email address * |
| `phone` | TEXT | Phone number |
| `number_of_guests` | INTEGER | Party size (default: 1) |
| `message` | TEXT | Additional notes |
| `status` | TEXT | pending, confirmed, cancelled |

## Row Level Security (RLS) Policies

The migration automatically creates these policies:

1. **Public Read Access to Active Events**
   - Anyone can view events where `is_active = true`

2. **Public RSVP Submissions**
   - Anyone can submit RSVPs via the form

3. **Admin Operations** (TODO)
   - Currently uses anonymous key
   - **Production:** Add authentication and restrict INSERT/UPDATE/DELETE

## Features

### Events Page (`events.html`)
- ✅ Displays all active events in a card grid
- ✅ Filter by date, event type, and location
- ✅ Event detail modal with full information
- ✅ RSVP form submission (saves to database)
- ✅ Email notifications (via Supabase Edge Function)

### Admin Panel (`admin-events.html`)
- ✅ Create new events
- ✅ Edit existing events
- ✅ Delete events
- ✅ Toggle active/inactive status
- ✅ Mark events as featured
- ✅ Auto-generate URL slugs from titles

## Troubleshooting

### Events Not Loading
1. Check that tables exist: Go to Supabase Dashboard → Table Editor
2. Verify sample data: Run the test curl command above
3. Check browser console for errors

### RSVP Submissions Failing
1. Verify `event_rsvps` table exists
2. Check RLS policies are created
3. Ensure the Supabase anonymous key is correct

### Admin Panel Not Working
1. Make sure you ran the full migration SQL
2. Check that INSERT/UPDATE/DELETE operations are allowed
3. For production, implement proper authentication

## AI Event Assistant (Optional)

The admin panel includes an AI-powered event generator that creates comprehensive event details from minimal input.

### Setup AI Assistant

**Step 1: Get Anthropic API Key**
1. Sign up at https://console.anthropic.com
2. Generate an API key from the dashboard
3. Copy your API key

**Step 2: Deploy Edge Function**
```bash
# Set your API key as a Supabase secret
supabase secrets set ANTHROPIC_API_KEY=your-api-key-here

# Deploy the Edge Function
supabase functions deploy generate-event
```

**Step 3: Test the AI Assistant**
1. Open admin panel: https://nodaluxe.netlify.app/admin-events.html
2. Click "Show" on the AI Event Assistant section
3. Enter minimal details:
   - Event Name: "Austin Tech Mixer"
   - City: "Austin"
   - Date: Select a future date
   - Event Type: "Corporate"
4. Click "Generate Event Details with AI"
5. Review generated content and save

### How It Works

**Input (Minimal):**
- Event name
- City
- Date
- Event type

**Output (Comprehensive):**
- Complete event title
- URL-friendly slug
- Start and end times
- Venue details and address
- Capacity estimate
- Professional descriptions (short + full)
- Appropriate Unsplash image URL
- Pricing suggestions

**Cost:** ~$0.003-0.015 per generation (Claude Sonnet 4)

### Troubleshooting AI Assistant

**"Failed to generate event details"**
1. Check Edge Function is deployed: `supabase functions list`
2. Verify API key is set: `supabase secrets list`
3. Check function logs for errors

**"Invalid JSON response"**
- Claude may occasionally format incorrectly
- Try regenerating or manual entry

## Next Steps

1. **Add Authentication:**
   - Use Supabase Auth for admin login
   - Restrict admin panel to authenticated users
   - Update RLS policies for secure admin operations

2. **Add Image Upload:**
   - Use Supabase Storage for event images
   - Create upload interface in admin panel

3. **Add Email Notifications:**
   - Configure SMTP settings in Supabase
   - Send confirmation emails to RSVP submitters

4. **Analytics:**
   - Track event views and RSVPs
   - Create dashboard for event performance

## Support

For questions or issues, contact:
- Email: info@nodaluxe.com
- Phone: 469-669-8878

---

**Nodaluxe Experiences** — Premium Transportation & Events across Texas
