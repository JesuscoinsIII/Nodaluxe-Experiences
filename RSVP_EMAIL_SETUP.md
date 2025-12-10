# RSVP Email Notifications Setup

This guide will help you set up automated email notifications for event RSVPs using Resend (free email API).

## Problem

When users RSVP to events on https://nodaluxe.netlify.app/events:
- You (admin) don't receive notification emails
- Users don't receive confirmation emails

## Solution

We've created an Edge Function that sends two emails for each RSVP:
1. **Admin notification** - Sent to info@nodaluxe.com with RSVP details
2. **User confirmation** - Sent to the person who RSVP'd

## Step 1: Create Resend Account

Resend offers 100 free emails per day (3,000/month), perfect for RSVP notifications.

1. **Sign up for Resend:**
   - Go to: https://resend.com/signup
   - Create a free account
   - Verify your email

2. **Get your API key:**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Name: `Nodaluxe RSVP Notifications`
   - Permissions: "Sending access"
   - Click "Create"
   - **Copy the API key** (starts with `re_`)
   - Keep it safe!

## Step 2: Verify Your Domain (Optional but Recommended)

To send emails from `noreply@nodaluxe.com`, you need to verify the domain.

### Option A: Use Resend's Test Domain (Quick Start)

For testing, you can send from `onboarding@resend.dev`:
- Emails will be marked as "via resend.dev"
- Good for testing, not ideal for production

### Option B: Verify Your Domain (Production)

1. **Go to Resend Domains:**
   https://resend.com/domains

2. **Add nodaluxe.com:**
   - Click "Add Domain"
   - Enter: `nodaluxe.com`
   - Click "Add"

3. **Add DNS Records:**
   Resend will show you DNS records to add. You need to add these in Netlify DNS:

   Go to: https://app.netlify.com/sites/nodaluxe/settings/domain

   Add these DNS records (Resend will show you the exact values):
   - **SPF Record** (TXT): Allows Resend to send emails
   - **DKIM Record** (TXT): Authenticates your emails
   - **Return-Path** (CNAME): Handles bounces

4. **Wait for verification:**
   - DNS propagation takes 5-30 minutes
   - Resend will automatically verify
   - You'll see "Verified" status when ready

## Step 3: Add API Key to Supabase

1. **Go to Supabase Function Secrets:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

2. **Click "Manage secrets"**

3. **Add new secret:**
   - Name: `RESEND_API_KEY`
   - Value: `[Paste your Resend API key]`
   - Click "Add secret"

## Step 4: Deploy the Edge Function

### Option A: Via Supabase Dashboard

1. **Go to Edge Functions:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions

2. **Click "Deploy new function"**

3. **Function details:**
   - Name: `send-contact-email`
   - Import method: "From GitHub" or "Upload files"
   - Upload file: `supabase/functions/send-contact-email/index.ts`

4. **Click "Deploy function"**

### Option B: Via Terminal

```bash
cd ~/Desktop/Nodaluxe-Experiences

# Login to Supabase (if not already)
npx supabase login

# Link project (if not already)
npx supabase link --project-ref fdezwoglwhbkhzhmnxxv

# Deploy function
npx supabase functions deploy send-contact-email
```

## Step 5: Update Email Settings (If Using Custom Domain)

If you verified your custom domain in Step 2, update the Edge Function:

1. **Open:** `supabase/functions/send-contact-email/index.ts`

2. **Change line 3:** (if not using nodaluxe.com)
   ```typescript
   const ADMIN_EMAIL = 'your-admin-email@yourdomain.com';
   ```

3. **Redeploy the function**

## Step 6: Test RSVP Emails

1. **Go to events page:**
   https://nodaluxe.netlify.app/events

2. **Select an event and click "RSVP"**

3. **Fill out the form:**
   - Name: Test User
   - Email: your-email@example.com
   - Number of Guests: 2
   - Message: This is a test

4. **Submit the form**

5. **Check both inboxes:**
   - **Admin inbox** (info@nodaluxe.com): Should receive RSVP notification
   - **User inbox** (your-email@example.com): Should receive confirmation

6. **If using test domain:**
   - Check spam folder
   - Emails may be flagged as "via resend.dev"

## Troubleshooting

### No emails received

**Check Edge Function logs:**
```bash
npx supabase functions logs send-contact-email
```

Or view in dashboard:
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions/send-contact-email/logs

**Common issues:**
- API key not set correctly
- Function not deployed
- Using test domain (emails might be in spam)

### "Failed to send emails" error

1. **Verify API key is correct:**
   - Go to Resend dashboard
   - Check API key is active
   - Try creating a new key

2. **Check Resend status:**
   - https://resend.com/status
   - Ensure service is operational

3. **Verify domain (if using custom domain):**
   - Domain must show "Verified" in Resend dashboard
   - DNS records must be correct

### Emails go to spam

**Using test domain:**
- This is expected with `onboarding@resend.dev`
- Verify your custom domain to fix

**Using custom domain:**
- Ensure all DNS records are added correctly
- Wait 24-48 hours for full DNS propagation
- Add SPF, DKIM, and DMARC records

## Email Customization

### Change Admin Email

Edit `supabase/functions/send-contact-email/index.ts`:
```typescript
const ADMIN_EMAIL = 'your-email@yourdomain.com';
```

### Customize Email Templates

Edit the HTML in the same file:
- **Admin email**: `adminEmailHTML` variable (line ~25)
- **User confirmation**: `userEmailHTML` variable (line ~60)

You can:
- Add your logo
- Change colors
- Update text
- Add social media links

Redeploy after changes:
```bash
npx supabase functions deploy send-contact-email
```

## Cost Information

**Resend Pricing:**
- **Free tier**: 100 emails/day (3,000/month)
- **Pro plan**: $20/month for 50,000 emails
- Additional: $1 per 1,000 emails

**For Nodaluxe:**
- 100 RSVPs/day = 200 emails/day (2 per RSVP)
- You'll need Pro plan if expecting more than 50 RSVPs/day
- Can send up to 1,500 RSVPs/month on free plan

## Alternative: Using Supabase Email (Coming Soon)

Supabase is adding built-in email functionality. When available:
- No need for Resend
- Same SMTP setup process
- Check Supabase docs for updates

## Quick Links

- **Resend Dashboard**: https://resend.com/home
- **Resend API Keys**: https://resend.com/api-keys
- **Resend Domains**: https://resend.com/domains
- **Supabase Functions**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions
- **Function Secrets**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
- **Events Page**: https://nodaluxe.netlify.app/events

## Testing Checklist

✅ Resend account created
✅ API key generated
✅ API key added to Supabase secrets
✅ Edge Function deployed
✅ Test RSVP submitted
✅ Admin notification received
✅ User confirmation received

## Support

For issues:
- Resend docs: https://resend.com/docs
- Resend support: support@resend.com
- Edge Function docs: https://supabase.com/docs/guides/functions
- Email: info@nodaluxe.com
