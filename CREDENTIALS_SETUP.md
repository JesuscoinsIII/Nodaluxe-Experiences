# Credentials Configuration Guide

## Important: Twilio User ID vs Account SID

### ⚠️ Critical Issue

You provided: `USec21b0d3885787e0119af67c627150fd`

This is a **Twilio User ID** (starts with `US`), NOT the **Account SID** needed for Supabase.

### What You Need to Find

**Twilio Account SID** (starts with `AC`)
- Format: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- 34 characters long
- Starts with `AC` (not `US`)

### Where to Find Your Account SID

1. **Go to Twilio Console Dashboard:**
   https://console.twilio.com/

2. **Look for "Account Info" section** (right side of dashboard)

3. **Find "Account SID":**
   - Should start with `AC`
   - Click to copy

4. **Also get your Auth Token:**
   - Click "Show" next to Auth Token
   - Copy the entire token

### Why This Matters

- **User ID (US...)**: Identifies you as a user in Twilio
- **Account SID (AC...)**: Identifies your account for API calls
- **Supabase needs the Account SID (AC...)** to authenticate API requests

## Slack Integration (Optional)

You provided Slack credentials. This can be used for:
- Sending RSVP notifications to Slack channels
- Admin notifications in Slack
- Real-time event updates

### Slack Credentials Storage

**For security, add these to Supabase Secrets:**

1. **Go to Supabase Secrets:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

2. **Click "Manage secrets"**

3. **Add Slack credentials:**
   ```
   Name: SLACK_API_TOKEN
   Value: [Your Slack API token]

   Name: SLACK_REFRESH_TOKEN
   Value: [Your Slack refresh token]
   ```

4. **Click "Add secret" for each**

### Slack Integration Use Cases

**1. RSVP Notifications to Slack**
- Get notified in Slack when someone RSVPs
- Create a private channel like #event-rsvps
- Receive real-time notifications

**2. Admin Dashboard**
- Post daily RSVP summaries
- Event creation notifications
- System alerts

**3. Customer Communication**
- Send event reminders to Slack
- Coordinate event logistics

## Supabase Phone Provider Configuration (Partial)

**Without a Twilio phone number, you can still configure the Account SID and Auth Token:**

### Step 1: Go to Supabase Auth Providers

https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

### Step 2: Enable Phone Provider

1. Click on "Phone" in the providers list
2. Toggle "Enable Phone Sign-Up" to **ON**

### Step 3: Configure Twilio (Partial Setup)

1. **SMS Provider:** Select "Twilio"

2. **Twilio Account SID:** `[Your AC... Account SID - NOT the US... User ID]`

3. **Twilio Auth Token:** `[Your Auth Token from Twilio Console]`

4. **Twilio Sender Number:** **Leave blank for now**
   - You'll add this after you buy/configure a phone number
   - Format when ready: `+15551234567`

5. **Click "Save"**

### Step 4: When You're Ready to Add Phone Number

1. **Buy a Twilio phone number:**
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
   - Click "Buy a number"
   - Select one with SMS capability
   - Purchase (free with trial credit)

2. **Update Supabase:**
   - Go back to Phone provider settings
   - Add the phone number in "Twilio Sender Number"
   - Format: `+15551234567` (include country code)
   - Click "Save"

## Security Best Practices

### ✅ DO:
- Store all tokens/keys in Supabase Secrets
- Never commit tokens to Git
- Use environment variables for sensitive data
- Rotate tokens regularly

### ❌ DON'T:
- Don't share tokens in public channels
- Don't commit .env files with real credentials
- Don't store tokens in client-side code
- Don't use the same tokens for dev and production

## Credentials Checklist

### Twilio Setup:
- ⏳ Find Account SID (starts with AC...)
- ⏳ Get Auth Token
- ⏳ Buy phone number (optional for now)
- ⏳ Add to Supabase Phone provider

### Slack Setup (Optional):
- ✅ API Token received
- ✅ Refresh Token received
- ⏳ Add to Supabase Secrets
- ⏳ Create Slack notification Edge Function

### Resend Setup (RSVP Emails):
- ⏳ Sign up for Resend: https://resend.com/signup
- ⏳ Get API key
- ⏳ Add to Supabase Secrets
- ⏳ Deploy send-contact-email Edge Function

## Next Steps

### 1. Find Your Correct Twilio Account SID

**Go to:** https://console.twilio.com/

**Look for:** "Account Info" section

**Copy:** The Account SID (starts with `AC`)

### 2. Configure Supabase Phone Provider

**Go to:** https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

**Add:**
- Account SID (AC...)
- Auth Token
- Leave phone number blank for now

### 3. (Optional) Set Up Slack Integration

Would you like me to create a Slack notification Edge Function for RSVPs?

### 4. Test When Ready

Once you add a phone number:
- Go to: https://nodaluxe.netlify.app/signup.html
- Click "SMS" tab
- Test with a verified number

## Quick Links

**Twilio Console:**
https://console.twilio.com/

**Supabase Auth Providers:**
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

**Supabase Secrets:**
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

**Slack App Configuration:**
https://api.slack.com/apps

## Support

Questions about:
- **Twilio:** See TWILIO_QUICK_SETUP.md
- **Slack:** Ask if you want integration help
- **General:** info@nodaluxe.com

---

**IMPORTANT:** Go to Twilio Console now and find your Account SID (AC...). The User ID (US...) won't work for Supabase configuration.
