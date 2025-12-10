# Verify Twilio Phone Number Guide

## Your Twilio Phone Number

```
Format 1: (844) 439-0074
Format 2: +18444390074
Format 3: +1 844-439-0074
```

**Use in Supabase:** `+18444390074` (no spaces, no parentheses)

## Step 1: Verify Phone Number is Active

### Check in Twilio Console

1. **Go to Phone Numbers:**
   https://console.twilio.com/us1/develop/phone-numbers/manage/incoming

2. **Find your number:**
   - Look for `(844) 439-0074` or `+18444390074`
   - Should appear in your active numbers list

3. **Check status:**
   - Status should show as "Active" with a green indicator
   - If not visible, the number may not be properly purchased

### If Number Not Showing:

**Buy the number:**
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/search
2. Search for `844-439-0074` or a new number
3. Click "Buy" next to an available number
4. Confirm purchase (uses trial credit)

## Step 2: Verify SMS Capabilities

### Check Number Capabilities

1. **Go to your phone numbers:**
   https://console.twilio.com/us1/develop/phone-numbers/manage/incoming

2. **Click on your number:** `+18444390074`

3. **Check "Capabilities" section:**
   - ✅ **SMS** - Should be checked (REQUIRED)
   - ✅ **MMS** - Optional but recommended
   - ⚠️ **Voice** - Not needed for auth but good to have

4. **If SMS is NOT enabled:**
   - This number cannot send SMS
   - You need to buy a different number with SMS capability
   - Look for "SMS-enabled" when searching for numbers

### 844 Numbers (Toll-Free) Note

**Important:** 844 numbers are toll-free numbers. Some considerations:

- ✅ Can send SMS (if SMS-enabled)
- ✅ No per-minute charges
- ⚠️ May require additional verification
- ⚠️ Some carriers block toll-free SMS
- 💰 Cost more than regular numbers (~$2/month vs $1/month)

**If having issues, consider:**
- Using a regular local number (starts with your area code)
- More reliable for SMS authentication
- Lower cost
- Better deliverability

## Step 3: Configure Messaging Service (Optional but Recommended)

For better SMS delivery, set up a Messaging Service:

1. **Go to Messaging Services:**
   https://console.twilio.com/us1/develop/sms/services

2. **Click "Create Messaging Service"**

3. **Fill out form:**
   - Friendly Name: `Nodaluxe SMS Auth`
   - Use Case: Select "Verify users"

4. **Add your sender number:**
   - Click "Add Senders"
   - Select Phone Number
   - Choose `+18444390074`
   - Click "Add"

5. **Complete setup and save**

6. **Copy the Messaging Service SID:**
   - Starts with `MG...`
   - Format: `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

7. **Add to Supabase** (optional):
   - Go to Phone provider settings
   - Add Messaging Service SID
   - Improves delivery rates

## Step 4: Test SMS Sending

### Quick Test via Twilio Console

1. **Go to SMS Logs:**
   https://console.twilio.com/us1/monitor/logs/sms

2. **Send a test SMS:**
   - Go to: https://console.twilio.com/us1/develop/sms/try-it-out/sms
   - From: `+18444390074`
   - To: `[Your phone number with country code]`
   - Message: `Test SMS from Nodaluxe`
   - Click "Send"

3. **Check your phone:**
   - Should receive SMS within seconds
   - If not received, check SMS logs for errors

### Common Test Issues

**"Unverified recipient" error:**
- Your Twilio account is in trial mode
- Can only send to verified numbers
- **Fix:** Verify your recipient number at:
  https://console.twilio.com/us1/develop/phone-numbers/manage/verified

**"Prohibited content" error:**
- Toll-free numbers have content restrictions
- Try simpler test message
- Consider using local number instead

**"Invalid destination number" error:**
- Check phone number format includes country code
- US format: `+15551234567`
- Remove spaces, dashes, parentheses

## Step 5: Verify in Supabase

Once your Twilio number is verified and working:

1. **Go to Supabase Phone Provider:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

2. **Enable Phone Authentication:**
   - Click "Phone" provider
   - Toggle "Enable Phone Sign-Up" to ON

3. **Enter Twilio Configuration:**
   ```
   Twilio Account SID: [Your Account SID from Twilio Console]
   Twilio Auth Token: [Your Auth Token from Twilio Console]
   Twilio Message Service SID: [Optional - leave blank or add MG...]
   Twilio Sender Number: +18444390074
   ```
   **Important:** Use `+18444390074` format (no spaces, dashes, or parentheses)

4. **OTP Settings:**
   - Confirmation Method: OTP (One-Time Password)
   - OTP Expiry: 60 seconds
   - OTP Length: 6 digits

5. **Click "Save"**

## Step 6: Test SMS Authentication

1. **Go to signup page:**
   https://nodaluxe.netlify.app/signup.html

2. **Click "SMS" tab**

3. **Enter your phone number:**
   - Include country code: `+15551234567`
   - US numbers: `+1` prefix

4. **Click "Send Verification Code"**

5. **Check your phone:**
   - Should receive 6-digit code
   - From: `+18444390074` or `(844) 439-0074`

6. **Enter code and verify**

7. **Should redirect to admin panel**

## Troubleshooting

### Number Not Showing in Twilio

**Solution:**
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/search
2. Buy a phone number with SMS capability
3. Select one from your area code for best results
4. Cost: ~$1/month (free with trial credit)

### SMS Not Sending

**Check SMS Logs:**
https://console.twilio.com/us1/monitor/logs/sms

**Common errors:**
- **30007 (Carrier block)** - Carrier blocked toll-free SMS → Use local number
- **21608 (Unverified)** - Verify recipient at verified callers page
- **21211 (Invalid number)** - Check phone number format
- **21614 (No SMS capability)** - Number doesn't support SMS → Buy new number

### Trial Account Restrictions

**Issue:** Can only send to verified numbers

**Solutions:**
1. **Verify recipients:**
   - https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Add numbers you want to test with

2. **Upgrade account:**
   - Remove trial restrictions
   - Send to any number
   - Remove "trial account" message
   - Minimum $20 deposit

### Toll-Free (844) Number Issues

**If experiencing problems:**

1. **Consider switching to local number:**
   - More reliable for SMS auth
   - Better carrier acceptance
   - Lower cost
   - Same functionality

2. **Keep 844 number for:**
   - Voice calls (if needed)
   - Professional appearance
   - Other uses

3. **Use local number for:**
   - SMS authentication
   - Better deliverability
   - Lower cost

## Verification Checklist

- ☐ Phone number visible in Twilio Console
- ☐ Status shows "Active"
- ☐ SMS capability is enabled
- ☐ Test SMS sent successfully
- ☐ SMS received on your phone
- ☐ (If trial) Verified recipient numbers
- ☐ Added to Supabase Phone provider
- ☐ Format is correct: `+18444390074`
- ☐ Tested signup page SMS flow
- ☐ 6-digit code received and verified

## Recommended: Use Local Number

For better SMS delivery, consider using a local number instead of toll-free:

**Benefits:**
- ✅ Better carrier acceptance
- ✅ Lower cost ($1/month vs $2/month)
- ✅ No toll-free restrictions
- ✅ Higher delivery rates
- ✅ Works on all carriers

**To get local number:**
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/search
2. Search by area code (e.g., Austin = 512, Dallas = 214)
3. Filter by SMS capability
4. Buy number (~$1/month)
5. Update Supabase with new number

## Quick Links

**Twilio Phone Numbers:**
https://console.twilio.com/us1/develop/phone-numbers/manage/incoming

**Buy New Number:**
https://console.twilio.com/us1/develop/phone-numbers/manage/search

**SMS Logs:**
https://console.twilio.com/us1/monitor/logs/sms

**Verified Callers (Trial):**
https://console.twilio.com/us1/develop/phone-numbers/manage/verified

**Supabase Phone Provider:**
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

**Test Signup:**
https://nodaluxe.netlify.app/signup.html

## Support

**Questions?**
- Check Twilio SMS logs for specific errors
- Email: info@nodaluxe.com
- Twilio Support: https://www.twilio.com/help/contact

---

**Your Number:** `+18444390074` (844) 439-0074

**Next Step:** Follow Step 1 to verify the number is active in your Twilio Console.
