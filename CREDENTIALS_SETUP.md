# Credentials Configuration Guide

## Overview

This guide helps you configure all the credentials needed for the Nodaluxe platform. Follow the sections in order for the smoothest setup experience.

**Quick Navigation:**
- [🔴 Required Setup](#required-setup) - Must be completed for core functionality
- [🟡 Recommended Setup](#recommended-setup) - Enhances the experience
- [🟢 Optional Setup](#optional-setup) - Additional integrations
- [🔒 Security Best Practices](#security-best-practices)

---

## Required Setup

### 1. Twilio Configuration (Phone Authentication)

#### ⚠️ Common Mistake: User ID vs Account SID

**If you provided something like:** `USec21b0d3885787e0119af67c627150fd`

This is a **Twilio User ID** (starts with `US`), NOT the **Account SID** needed for Supabase.

#### What You Actually Need

| Credential | Format | Example | Starts With |
|------------|--------|---------|-------------|
| Account SID | 34 characters | `AC1234567890abcdef1234567890abcd` | `AC` |
| Auth Token | 32 characters | `abc123def456...` | varies |
| Phone Number | E.164 format | `+15551234567` | `+` |

#### How to Find Your Credentials

1. **Go to Twilio Console:**
   → https://console.twilio.com/

2. **Find "Account Info" section** (right sidebar):
   - **Account SID**: Copy the value starting with `AC`
   - **Auth Token**: Click "Show" button, then copy

3. **Get a Phone Number** (if you don't have one):
   - Navigate to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
   - Click "Buy a number"
   - Select one with **SMS capability**
   - Purchase (free with trial credit)
   - Copy the number in E.164 format: `+15551234567`

#### Why the Right Credentials Matter

- **User ID (US...)** → Identifies YOU as a user in Twilio (not needed here)
- **Account SID (AC...)** → Identifies your ACCOUNT for API calls (✅ required)
- **Auth Token** → Authenticates API requests (✅ required)
- **Phone Number** → Sends SMS verification codes (✅ required)

#### Configure Supabase Phone Provider

**Full setup instructions:** See [TWILIO_QUICK_SETUP.md](TWILIO_QUICK_SETUP.md) for detailed steps.

**Quick version:**

1. Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers
2. Click "Phone" → Toggle "Enable Phone Sign-Up" to **ON**
3. Select "Twilio" as SMS Provider
4. Enter your credentials:
   - **Twilio Account SID**: Your `AC...` value
   - **Twilio Auth Token**: Your auth token
   - **Twilio Sender Number**: Your phone number (e.g., `+15551234567`)
5. Click "Save"

#### Test Your Setup

1. Visit: https://nodaluxe.netlify.app/signup.html
2. Click the "SMS" tab
3. Enter your phone number (with country code)
4. You should receive a verification code

**Note:** Trial accounts can only send to verified numbers. To send to any number, upgrade your Twilio account.

---

## Recommended Setup

### 2. Resend (Email Notifications)

**Purpose:** Send RSVP confirmations and admin notifications

#### Setup Steps

1. **Sign up for Resend:**
   → https://resend.com/signup
   - **Free tier:** 100 emails/day (3,000/month)
   - Perfect for RSVP notifications

2. **Get your API key:**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Name: `Nodaluxe RSVP Notifications`
   - Copy the key (starts with `re_`)

3. **Add to Supabase Secrets:**
   - Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
   - Click "Manage secrets"
   - Add secret:
     ```
     Name: RESEND_API_KEY
     Value: [Your Resend API key]
     ```

4. **Deploy the Email Edge Function:**
   ```bash
   cd ~/Desktop/Nodaluxe-Experiences
   npx supabase functions deploy send-contact-email
   ```

**Detailed guide:** See [RSVP_EMAIL_SETUP.md](RSVP_EMAIL_SETUP.md).

---

## Optional Setup

### 3. Slack Integration (Team Notifications)

**Purpose:** Receive RSVP notifications and system alerts in Slack

#### What You Can Do

- 📬 Get notified when someone RSVPs
- 📊 Receive daily RSVP summaries
- 🎉 Track event creation
- 🚨 System alerts and errors

#### Setup Steps

1. **Add credentials to Supabase Secrets:**
   - Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
   - Click "Manage secrets"
   - Add two secrets:
     ```
     Name: SLACK_API_TOKEN
     Value: [Your Slack API token]
     
     Name: SLACK_REFRESH_TOKEN
     Value: [Your Slack refresh token]
     ```

2. **Create a notification channel:**
   - In Slack, create: `#event-rsvps`
   - Invite your Slack app to the channel: `/invite @YourAppName`
   - Copy the Channel ID (found in channel details)

3. **Create Slack notification function (optional):**
   - Can be implemented as a custom Edge Function
   - See [SLACK_INTEGRATION.md](SLACK_INTEGRATION.md) for full details and implementation options

---

## Security Best Practices

### 🔒 Protecting Your Credentials

#### ✅ DO:
- **Store in Supabase Secrets** - All API keys and tokens should be stored as Supabase secrets, never in code
- **Use environment variables** - For local development, use `.env` files (never commit these)
- **Enable 2FA** - On all service accounts (Twilio, Resend, Slack, Supabase)
- **Rotate regularly** - Update tokens every 90 days
- **Use separate keys** - Different keys for development and production
- **Monitor usage** - Set up alerts for unusual API activity
- **Restrict permissions** - Grant minimum necessary permissions to each key

#### ❌ DON'T:
- **Never commit secrets** - Don't add API keys, tokens, or passwords to Git
- **Never share publicly** - Don't post credentials in issues, chat, or forums
- **Never use in client code** - Don't expose secrets in browser JavaScript
- **Never reuse passwords** - Use unique passwords for each service
- **Never skip verification** - Always verify domain ownership for email services

### 📋 Credentials Checklist

Track your setup progress:

#### Twilio (Required for SMS auth):
- [ ] Find Account SID (starts with `AC`)
- [ ] Get Auth Token from Twilio Console
- [ ] Buy/configure phone number with SMS capability
- [ ] Add credentials to Supabase Phone provider
- [ ] Test SMS verification on signup page

#### Resend (Recommended for emails):
- [ ] Sign up for Resend account
- [ ] Generate API key
- [ ] Add `RESEND_API_KEY` to Supabase Secrets
- [ ] Deploy `send-contact-email` Edge Function
- [ ] Test RSVP email notifications

#### Slack (Optional for notifications):
- [ ] Obtain Slack API token
- [ ] Obtain Slack refresh token
- [ ] Add both tokens to Supabase Secrets
- [ ] Create notification channel in Slack
- [ ] Deploy Slack notification Edge Function (if desired)
- [ ] Test with a sample RSVP

---

## Configuration Guide by Service

### Supabase Configuration Summary

All your services connect through Supabase. Here's what to configure:

**Auth Providers:**
- Phone authentication → Twilio credentials
- https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

**Edge Function Secrets:**
- `RESEND_API_KEY` → For email notifications
- `SLACK_API_TOKEN` → For Slack notifications (optional)
- `SLACK_REFRESH_TOKEN` → For Slack token refresh (optional)
- https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

---

## Troubleshooting

### Common Issues and Solutions

#### "Account SID format is invalid"
**Problem:** You used the User ID (starts with `US`) instead of Account SID (starts with `AC`)
**Solution:** Go to Twilio Console → Account Info → Copy the "Account SID" (starts with `AC`)

#### "Authentication failed" with Twilio
**Problem:** Incorrect Auth Token
**Solution:** 
1. Go to Twilio Console
2. Click "Show" next to Auth Token
3. Copy the entire token (no spaces)
4. Update in Supabase Phone provider settings

#### "Phone number not verified" on Twilio trial
**Problem:** Trial accounts can only send to verified numbers
**Solution:**
- Option 1: Verify your number at https://console.twilio.com/us1/develop/phone-numbers/manage/verified
- Option 2: Upgrade to a paid account (remove trial restrictions)

#### "Failed to send email" with Resend
**Problem:** API key not configured or domain not verified
**Solution:**
1. Verify API key is set in Supabase Secrets
2. Check Resend dashboard for domain verification status
3. Review Edge Function logs: `npx supabase functions logs send-contact-email`

#### "Slack messages not appearing"
**Problem:** App not in channel or token expired
**Solution:**
1. Ensure Slack app is invited to the channel
2. Check token validity in Slack API dashboard
3. Use refresh token to get a new API token if expired

---

## Quick Reference Links

### Service Dashboards
- **Twilio Console**: https://console.twilio.com/
- **Resend Dashboard**: https://resend.com/home
- **Slack API**: https://api.slack.com/apps
- **Supabase Dashboard**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv

### Supabase Configuration Pages
- **Auth Providers**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers
- **Edge Functions**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions
- **Function Secrets**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions

### Application Pages
- **Signup Page**: https://nodaluxe.netlify.app/signup.html
- **Events Page**: https://nodaluxe.netlify.app/events
- **Admin Panel**: https://nodaluxe.netlify.app/admin-events.html

---

## Related Documentation

For detailed setup instructions, refer to these guides:

- **[TWILIO_QUICK_SETUP.md](TWILIO_QUICK_SETUP.md)** - Complete Twilio setup walkthrough
- **[TWILIO_SMS_SETUP.md](TWILIO_SMS_SETUP.md)** - SMS configuration details
- **[RSVP_EMAIL_SETUP.md](RSVP_EMAIL_SETUP.md)** - Resend email setup guide
- **[SLACK_INTEGRATION.md](SLACK_INTEGRATION.md)** - Slack notifications setup
- **[QUICK_SETUP.md](QUICK_SETUP.md)** - Getting started with the platform
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database configuration
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - General setup information

---

## Getting Help

### Support Resources
- **Documentation**: All markdown files in repository root
- **Twilio Support**: https://www.twilio.com/help/contact
- **Resend Docs**: https://resend.com/docs
- **Supabase Discord**: https://discord.supabase.com

### Contact
- **Email**: info@nodaluxe.com
- **Website**: https://nodaluxe.com

---

## Summary: What to Do First

1. **🔴 Critical**: Set up Twilio credentials (Account SID with `AC`, Auth Token, Phone Number)
2. **🟡 Recommended**: Configure Resend for email notifications
3. **🟢 Optional**: Add Slack integration if you want team notifications
4. **✅ Test**: Verify SMS auth works on signup page
5. **🔒 Secure**: Review and follow security best practices above

**Need the Account SID?** → Go to https://console.twilio.com/ and find it in the "Account Info" section (starts with `AC`, not `US`)
