# Slack Integration for Event Notifications

## Overview

Your Slack credentials can be used to:
- Send RSVP notifications to Slack channels
- Real-time event updates
- Admin notifications
- Team coordination

## Step 1: Store Slack Credentials in Supabase

### Add to Supabase Secrets

1. **Go to Supabase Function Secrets:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

2. **Click "Manage secrets"**

3. **Add these secrets:**

   **Secret 1:**
   ```
   Name: SLACK_API_TOKEN
   Value: [Paste your Slack API token]
   ```

   **Secret 2:**
   ```
   Name: SLACK_REFRESH_TOKEN
   Value: [Paste your Slack refresh token]
   ```

4. **Click "Add secret" after each one**

## Step 2: Configure Slack Workspace

### Create a Channel for Notifications

1. **In your Slack workspace:**
   - Create a new channel: `#event-rsvps`
   - Or use an existing channel

2. **Get the Channel ID:**
   - Open the channel
   - Click channel name at top
   - Scroll down, copy "Channel ID"
   - Format: `C01234ABCDE`

3. **Invite your Slack app to the channel:**
   ```
   /invite @YourAppName
   ```

## Step 3: Create Slack Notification Edge Function

Would you like me to create an Edge Function that:
- Sends RSVP details to Slack
- Posts in a specific channel
- Formats messages nicely with buttons and fields

### Example Slack Message Format

```
🎉 New Event RSVP

📅 Event: Austin Tech Mixer 2025
👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: +1 555-123-4567
👥 Guests: 2
💬 Message: Looking forward to it!

View Event | View All RSVPs
```

## Step 4: Update RSVP Handling

We can modify the `send-contact-email` Edge Function to also send to Slack.

### Option A: Add to Existing Function

Add Slack notification alongside email notifications.

### Option B: Separate Function

Create a dedicated `send-slack-notification` function.

## Use Cases

### 1. RSVP Notifications
**When:** Someone RSVPs to an event
**Where:** #event-rsvps channel
**Content:**
- Guest name and contact info
- Event details
- Number of guests
- Special requests

### 2. Event Creation Alerts
**When:** Admin creates a new event
**Where:** #event-management channel
**Content:**
- Event title and type
- Date and venue
- Capacity and pricing
- Link to admin panel

### 3. Daily Summaries
**When:** Daily at 9 AM
**Where:** #event-summary channel
**Content:**
- Total RSVPs in last 24 hours
- Upcoming events this week
- Events needing attention

### 4. System Alerts
**When:** Important system events
**Where:** #system-alerts channel
**Content:**
- Edge Function errors
- Database issues
- Low capacity warnings

## Slack API Capabilities

With your credentials, you can:
- ✅ Post messages to channels
- ✅ Send direct messages
- ✅ Create interactive buttons
- ✅ Update messages in real-time
- ✅ Add reactions/emojis
- ✅ Upload files/images

## Security & Permissions

### Token Types

**API Token (xoxe.xoxp...):**
- User token with extended permissions
- Can post as the app
- Can access private channels (if invited)

**Refresh Token (xoxe-1-My...):**
- Used to refresh expired API tokens
- Keep this extremely secure

### Best Practices

1. **Store in Supabase Secrets only**
   - Never commit to Git
   - Never expose in client code

2. **Use for server-side only**
   - Edge Functions only
   - Never in browser JavaScript

3. **Monitor usage**
   - Check Slack app logs
   - Set up rate limit alerts

4. **Rotate tokens regularly**
   - Generate new tokens quarterly
   - Revoke old tokens

## Integration Options

### Option 1: Quick Setup (Recommended)
- Add Slack notification to existing RSVP function
- Posts to one channel
- Simple format

### Option 2: Advanced Setup
- Separate Slack notification function
- Multiple channels
- Custom formatting per event type
- Interactive buttons

### Option 3: Full Dashboard
- Slack commands for event management
- `/events list` - Show upcoming events
- `/events rsvps [event-id]` - Show RSVPs
- `/events create` - Quick event creation

## Would You Like Me To Create?

I can create:

1. **Basic Slack Notifier**
   - Posts RSVP to a channel
   - Simple message format
   - 10 minutes to set up

2. **Advanced Notifier**
   - Multiple notification types
   - Rich formatting with buttons
   - Custom per event type
   - 30 minutes to set up

3. **Slack Commands**
   - Full slash command integration
   - Event management from Slack
   - RSVP viewing and management
   - 1 hour to set up

Let me know which option you'd like!

## Testing Slack Integration

Once set up, you can test by:

1. **Submit a test RSVP:**
   - Go to: https://nodaluxe.netlify.app/events
   - Fill out RSVP form
   - Submit

2. **Check Slack channel:**
   - Should see notification within seconds
   - Click buttons to view details

3. **Verify message format:**
   - All fields present
   - Links work
   - Emojis display correctly

## Troubleshooting

### "channel_not_found" error
- Verify channel ID is correct
- Ensure app is invited to channel
- Check channel is not archived

### "not_authed" error
- Token may be expired
- Use refresh token to get new token
- Verify token in Supabase secrets

### Messages not appearing
- Check app permissions in Slack
- Verify app is in the channel
- Check Edge Function logs for errors

## Quick Links

**Supabase Secrets:**
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

**Slack API Dashboard:**
https://api.slack.com/apps

**Your Slack Workspace:**
[Add your workspace URL]

## Next Steps

1. ✅ Credentials received
2. ⏳ Add to Supabase Secrets
3. ⏳ Create notification channel in Slack
4. ⏳ Choose integration option
5. ⏳ Test with RSVP

---

**Ready to integrate?** Let me know which option you prefer and I'll create the Edge Function!
