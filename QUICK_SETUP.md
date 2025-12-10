# Quick Setup Guide - Events System & AI Assistant

Follow these steps to get everything working:

## Step 1: Run Database Migration (REQUIRED)

The error "Could not find the table 'public.events'" means you need to create the database tables.

### Option A: Via Supabase Dashboard (Easiest)

1. **Go to Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new
   ```

2. **Run this command to get the SQL:**
   ```bash
   cd ~/Desktop/Nodaluxe-Experiences
   node setup-database.js
   ```

3. **Copy the SQL output and paste it into the Supabase SQL Editor**

4. **Click "Run"**

5. **Verify tables were created:**
   - Go to Table Editor in Supabase Dashboard
   - You should see `events` and `event_rsvps` tables

### Option B: Using Terminal

```bash
cd ~/Desktop/Nodaluxe-Experiences

# Login to Supabase
npx supabase login

# Link to project
npx supabase link --project-ref fdezwoglwhbkhzhmnxxv

# Push migrations
npx supabase db push
```

## Step 2: Set Up AI Assistant (Optional)

### 2a. Set Anthropic API Key

**Via Supabase Dashboard (Easiest):**

1. Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
2. Click "Manage secrets"
3. Add new secret:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `[Your Anthropic API key from earlier message]`
4. Click "Add secret"

**Or via Terminal:**

```bash
cd ~/Desktop/Nodaluxe-Experiences

# Set the secret (replace with your actual key)
npx supabase secrets set ANTHROPIC_API_KEY=your-api-key-here
```

### 2b. Deploy Edge Function

**Via Supabase Dashboard:**

1. Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions
2. Click "Deploy new function"
3. Function details:
   - Name: `generate-event`
   - Import method: Select "From GitHub" or "Upload files"
4. Upload these files from `supabase/functions/generate-event/`:
   - `index.ts`
5. Click "Deploy function"

**Or via Terminal:**

```bash
cd ~/Desktop/Nodaluxe-Experiences

# Deploy function
npx supabase functions deploy generate-event
```

### 2c. Test the Function

```bash
# Test via curl
curl -X POST \
  "https://fdezwoglwhbkhzhmnxxv.supabase.co/functions/v1/generate-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZXp3b2dsd2hia2h6aG1ueHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODYzMDksImV4cCI6MjA4MDc2MjMwOX0.JlOALehErZF_Ret4XokYWovch6K6fVvRiaj3DKtBLHs" \
  -d '{
    "event_name": "Austin Tech Mixer",
    "city": "Austin",
    "event_date": "2025-03-15",
    "event_type": "corporate"
  }'
```

## Step 3: Test Everything

1. **Test Events Page:**
   - Visit: https://nodaluxe.netlify.app/events
   - Should show 3 sample events

2. **Test Admin Panel:**
   - Visit: https://nodaluxe.netlify.app/admin-events.html
   - Should see events list (not "No events found")
   - Try creating a new event manually

3. **Test AI Assistant:**
   - In admin panel, click "Show" on AI Event Assistant
   - Enter:
     - Event Name: "Austin Tech Mixer"
     - City: "Austin"
     - Date: Future date
     - Event Type: "Corporate"
   - Click "Generate Event Details with AI"
   - Wait 3-5 seconds
   - Form should auto-populate
   - Review and save

## Troubleshooting

### "Could not find the table 'public.events'"
**Solution:** Run Step 1 (Database Migration)

### "Failed to generate event details"
**Possible causes:**
1. Edge Function not deployed → Run Step 2b
2. API key not set → Run Step 2a
3. Check function logs in Supabase Dashboard

### Events not showing in admin panel
1. Make sure database migration ran successfully
2. Check browser console for errors
3. Verify Supabase anonymous key is correct

### AI Assistant not generating
1. Check Edge Function is deployed
2. Verify API key is set correctly
3. Check function logs for errors
4. Try generating again (sometimes Claude needs a retry)

## Quick Commands Reference

```bash
cd ~/Desktop/Nodaluxe-Experiences

# View database migration SQL
node setup-database.js

# Login to Supabase CLI
npx supabase login

# Link project
npx supabase link --project-ref fdezwoglwhbkhzhmnxxv

# Set API key
npx supabase secrets set ANTHROPIC_API_KEY=your-key-here

# Deploy function
npx supabase functions deploy generate-event

# Check function logs
npx supabase functions logs generate-event

# Test database connection
curl "https://fdezwoglwhbkhzhmnxxv.supabase.co/rest/v1/events?limit=3" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZXp3b2dsd2hia2h6aG1ueHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODYzMDksImV4cCI6MjA4MDc2MjMwOX0.JlOALehErZF_Ret4XokYWovch6K6fVvRiaj3DKtBLHs"
```

## Important URLs

- **Supabase Dashboard:** https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv
- **SQL Editor:** https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new
- **Edge Functions:** https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions
- **Function Secrets:** https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
- **Admin Panel:** https://nodaluxe.netlify.app/admin-events.html
- **Events Page:** https://nodaluxe.netlify.app/events

## What to Do First

**Priority Order:**

1. ✅ **Database Migration** (REQUIRED - Nothing works without this)
2. ✅ **Test Admin Panel** (Create events manually)
3. ⚙️ **Set API Key** (Optional - For AI assistant)
4. ⚙️ **Deploy Edge Function** (Optional - For AI assistant)
5. ⚙️ **Test AI Assistant** (Optional - Generates events automatically)

## Need Help?

Check the full documentation:
- `DATABASE_SETUP.md` - Complete database setup guide
- `supabase/functions/generate-event/README.md` - AI function docs
- GitHub: https://github.com/JesuscoinsIII/Nodaluxe-Experiences

---

**Start with Step 1 (Database Migration) - That will fix the error you're seeing!**
