# Twilio SMS Authentication Setup

This guide will help you enable SMS authentication for the signup page using Twilio.

## Prerequisites

1. Twilio Account (Sign up at https://www.twilio.com/try-twilio)
2. Twilio Phone Number
3. Twilio Account SID and Auth Token

## Step 1: Get Twilio Credentials

1. **Sign up for Twilio:**
   - Go to: https://www.twilio.com/try-twilio
   - Create a free account (comes with $15 trial credit)

2. **Get your credentials:**
   - Go to: https://console.twilio.com/
   - Note your **Account SID** and **Auth Token**
   - Keep these safe!

3. **Get a phone number:**
   - In Twilio Console, go to Phone Numbers → Buy a Number
   - Search for available numbers
   - Purchase a number (free with trial credit)
   - Note your **Twilio Phone Number** (e.g., +15551234567)

## Step 2: Enable Phone Auth in Supabase

1. **Go to Supabase Auth Providers:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

2. **Enable Phone provider:**
   - Click on "Phone" in the providers list
   - Toggle "Enable Phone Sign-Up" to ON

3. **Configure Twilio:**
   Scroll down to "SMS Provider" section and select "Twilio"

   - **Twilio Account SID**: `[Paste your Account SID]`
   - **Twilio Auth Token**: `[Paste your Auth Token]`
   - **Twilio Message Service SID**: (Optional - leave blank for now)
   - **Twilio Sender Number**: `[Your Twilio phone number, e.g., +15551234567]`

4. **Click "Save"**

## Step 3: Configure Phone Signup Settings

1. **In the same Phone provider settings:**
   - **Confirmation Method**: Select "OTP (One-Time Password)"
   - **OTP Expiry**: 60 seconds (default)
   - **OTP Length**: 6 digits (default)

2. **Save settings**

## Step 4: Test SMS Authentication

1. **Go to signup page:**
   https://nodaluxe.netlify.app/signup.html

2. **Click "SMS" tab**

3. **Enter phone number:**
   - Include country code: +1 for US, +44 for UK, etc.
   - Example: +15551234567

4. **Click "Send Verification Code"**

5. **Check your phone for SMS:**
   - You should receive a 6-digit code
   - Enter the code in the verification field

6. **Click "Verify Code"**
   - Should redirect to admin panel if successful

## Step 5: Customize SMS Message (Optional)

The default SMS message is:
```
Your verification code is: 123456
```

To customize:

1. **Go to Supabase Auth Templates:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/templates

2. **Select "SMS OTP" template**

3. **Edit the message:**
   ```
   Your Nodaluxe admin verification code is: {{ .Code }}

   Valid for 60 seconds.
   ```

4. **Save template**

## Troubleshooting

### Error: "SMS authentication not configured"
- Verify Phone provider is enabled in Supabase
- Check Twilio credentials are correct
- Ensure Twilio phone number is active

### Not receiving SMS
- Check phone number format includes country code
- Verify Twilio account has credits
- Check Twilio SMS logs: https://console.twilio.com/us1/monitor/logs/sms

### "Invalid verification code" error
- Code expires after 60 seconds, request a new one
- Ensure you're entering the full 6-digit code
- Check for typos

### Twilio trial account limitations
- Trial accounts can only send to verified phone numbers
- To send to any number, upgrade to paid account
- To verify a number in trial: Go to Twilio Console → Phone Numbers → Verified Caller IDs

## Cost Information

**Twilio Pricing (as of 2025):**
- SMS to US: ~$0.0079 per message
- SMS to other countries: varies

**Trial Account:**
- $15 free credit
- Can send ~1,800 SMS in US with trial credit
- Must verify recipient numbers first

**Supabase:**
- Phone auth is included in all plans
- No additional Supabase fees for SMS

## Security Best Practices

1. **Rate Limiting:**
   - Supabase automatically rate limits to prevent abuse
   - Default: 60 requests per hour per phone number

2. **OTP Expiry:**
   - Codes expire after 60 seconds
   - Users must request new code if expired

3. **Protect Credentials:**
   - Never commit Twilio credentials to Git
   - Store in Supabase secrets only

4. **Monitor Usage:**
   - Check Twilio usage dashboard regularly
   - Set up billing alerts in Twilio Console

## Alternative: SMS Provider Options

Besides Twilio, Supabase also supports:

1. **MessageBird**
   - Similar pricing
   - Good international coverage

2. **Vonage (Nexmo)**
   - Competitive pricing
   - Strong API documentation

To switch providers, update the SMS Provider settings in Supabase Auth.

## Testing Checklist

✅ Twilio account created
✅ Phone number purchased
✅ Credentials added to Supabase
✅ Phone provider enabled
✅ SMS sent successfully
✅ Verification code received
✅ Login successful

## Quick Links

- **Twilio Console**: https://console.twilio.com/
- **Twilio SMS Logs**: https://console.twilio.com/us1/monitor/logs/sms
- **Supabase Phone Auth**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers
- **Signup Page**: https://nodaluxe.netlify.app/signup.html

## Support

For issues:
- Twilio support: https://www.twilio.com/help/contact
- Supabase docs: https://supabase.com/docs/guides/auth/phone-login
- Email: info@nodaluxe.com
