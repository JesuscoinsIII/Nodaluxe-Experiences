# Twilio SMS Quick Setup Guide

## Step 1: Add Twilio Domain Verification DNS Record

You need to add this TXT record to verify your domain with Twilio.

### Add to Netlify DNS

1. **Go to Netlify DNS Settings:**
   https://app.netlify.com/sites/nodaluxe/settings/domain

2. **Click "Add new record"**

3. **Add TXT Record:**
   - **Record type:** TXT
   - **Name:** @ (or leave blank for root domain)
   - **Value:** `twilio-domain-verification=d6d2a738f3886aebf63628a9579c0b2a`
   - **TTL:** 3600 (1 hour)

4. **Click "Save"**

5. **Wait for DNS propagation:**
   - Usually takes 5-15 minutes
   - Can take up to 48 hours in rare cases

6. **Verify in Twilio:**
   - Go back to Twilio Console
   - Check domain verification status
   - Should show "Verified" once DNS propagates

## Step 2: Get Your Twilio Credentials

You provided:
- User ID: `USec21b0d3885787e0119af67c627150fd`
- Scope/Org: `Modal (OR795ccc18f0ec0db8285ce78f6433af33)`

**However, for Supabase Phone authentication, you need these specific credentials:**

### 2a. Get Account SID

1. **Go to Twilio Console Dashboard:**
   https://console.twilio.com/

2. **Find "Account Info" section** (usually on right side)

3. **Copy "Account SID"**
   - Format: `AC...` (starts with AC)
   - Example: `AC1234567890abcdef1234567890abcd`

### 2b. Get Auth Token

1. **In the same "Account Info" section**

2. **Click "Show" next to "Auth Token"**

3. **Copy the Auth Token**
   - Long alphanumeric string
   - Keep this secret!

### 2c. Get/Buy a Phone Number

1. **Go to Phone Numbers:**
   https://console.twilio.com/us1/develop/phone-numbers/manage/incoming

2. **If you don't have a number yet:**
   - Click "Buy a number"
   - Search for available numbers in your country
   - Select a number with "SMS" capability
   - Click "Buy" (free with trial credit)

3. **Copy your phone number:**
   - Format: `+15551234567` (must include country code)

## Step 3: Configure Supabase Phone Authentication

1. **Go to Supabase Auth Providers:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

2. **Click on "Phone" in the providers list**

3. **Enable Phone Sign-Up:**
   - Toggle "Enable Phone Sign-Up" to **ON**

4. **Scroll to "SMS Provider Configuration"**

5. **Select "Twilio" as provider**

6. **Enter your Twilio credentials:**
   ```
   Twilio Account SID: [Paste your AC... Account SID]
   Twilio Auth Token: [Paste your Auth Token]
   Twilio Message Service SID: [Leave blank or add if you have one]
   Twilio Sender Number: [Your phone number, e.g., +15551234567]
   ```

7. **Configure OTP Settings:**
   - Confirmation Method: OTP (One-Time Password)
   - OTP Expiry: 60 seconds
   - OTP Length: 6 digits

8. **Click "Save"**

## Step 4: Test SMS Authentication

1. **Go to signup page:**
   https://nodaluxe.netlify.app/signup.html

2. **Click "SMS" tab**

3. **Enter your phone number:**
   - Must include country code
   - Format: `+15551234567`
   - US numbers: `+1` prefix
   - UK numbers: `+44` prefix

4. **Click "Send Verification Code"**

5. **Check your phone for SMS**
   - Should receive 6-digit code within seconds

6. **Enter the code and verify**

7. **Should redirect to admin panel if successful**

## Troubleshooting

### DNS Record Not Verifying
- Wait 15-30 minutes for DNS propagation
- Check record was added correctly in Netlify
- Use DNS checker: https://dnschecker.org/
- Search for: `nodaluxe.com` TXT records

### "Account SID format is invalid"
- Make sure it starts with `AC`
- No spaces or quotes
- Copy directly from Twilio Console

### "Auth Token is invalid"
- Click "Show" to reveal token in Twilio Console
- Copy the entire token
- Try regenerating token if issues persist

### Not Receiving SMS
**Trial Account Limitations:**
- Twilio trial accounts can only send to verified numbers
- To send to any number, upgrade to paid account ($20 minimum)

**To verify a number in trial:**
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click "Add a new Caller ID"
3. Enter phone number
4. Verify via SMS/call

### "Phone authentication not configured"
- Verify Phone provider is enabled in Supabase
- Check all credentials are correct
- Wait a few minutes after saving settings
- Try disabling and re-enabling Phone provider

## Quick Reference

**Your Twilio Info:**
- User ID: `USec21b0d3885787e0119af67c627150fd`
- Org/Scope: `Modal (OR795ccc18f0ec0db8285ce78f6433af33)`

**What You Need to Find:**
- ✅ Domain verification added to DNS
- ⏳ Account SID (starts with AC...)
- ⏳ Auth Token
- ⏳ Phone Number (starts with +)

**Add to Supabase:**
- Phone provider: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

**DNS Record to Add:**
```
Type: TXT
Name: @
Value: twilio-domain-verification=d6d2a738f3886aebf63628a9579c0b2a
TTL: 3600
```

**Netlify DNS:**
https://app.netlify.com/sites/nodaluxe/settings/domain

**Twilio Console:**
https://console.twilio.com/

## Cost Information

**Twilio Pricing:**
- Trial: $15 free credit (can send ~1,800 SMS in US)
- SMS to US: ~$0.0079 per message
- SMS to other countries: varies

**Trial Limitations:**
- Can only send to verified phone numbers
- Shows "Sent from a Twilio trial account" in SMS
- No toll-free or short code support

**To Remove Limitations:**
- Upgrade to paid account
- Add $20 minimum to start
- Remove trial message
- Send to any number

## Next Steps

1. ✅ Add DNS verification record to Netlify
2. ⏳ Get Account SID from Twilio Console
3. ⏳ Get Auth Token from Twilio Console
4. ⏳ Get/Buy a phone number with SMS capability
5. ⏳ Configure Supabase Phone provider
6. ⏳ Test SMS signup

## Support

**Twilio Support:**
- Help Center: https://www.twilio.com/help/contact
- Documentation: https://www.twilio.com/docs/sms

**Supabase Support:**
- Phone Auth Docs: https://supabase.com/docs/guides/auth/phone-login
- Discord: https://discord.supabase.com

**Questions:**
- Email: info@nodaluxe.com
