# Add Twilio DNS Verification Record

## Quick Steps

### Step 1: Open Netlify DNS Settings

1. **Click this link:**
   https://app.netlify.com/sites/nodaluxe/settings/domain

2. **Scroll to "DNS records" section**

### Step 2: Add New TXT Record

1. **Click "Add new record" button**

2. **Fill in the form:**
   ```
   Record type: TXT
   Name: @ (or leave blank)
   Value: twilio-domain-verification=d6d2a738f3886aebf63628a9579c0b2a
   TTL: 3600
   ```

3. **Click "Save" or "Add record"**

### Step 3: Wait for DNS Propagation

- Usually takes 5-15 minutes
- Can verify at: https://dnschecker.org/
- Search for: `nodaluxe.com` TXT

### Step 4: Verify in Twilio

Go back to Twilio Console and check domain verification status.

## The DNS Record

**Copy this exactly:**
```
twilio-domain-verification=d6d2a738f3886aebf63628a9579c0b2a
```

## What This Does

This TXT record proves to Twilio that you own the domain `nodaluxe.com`, allowing you to:
- Send SMS from your domain
- Use branded messaging
- Increase trust and deliverability

## Verification

After adding, you can check if it's working:

**Using DNS Checker:**
1. Go to: https://dnschecker.org/
2. Enter: `nodaluxe.com`
3. Select: TXT record type
4. Click "Search"
5. Look for your verification code in results

**Using Command Line:**
```bash
dig nodaluxe.com TXT +short
```

Should show:
```
"twilio-domain-verification=d6d2a738f3886aebf63628a9579c0b2a"
```

## Troubleshooting

**Record not appearing:**
- Wait 15-30 minutes
- Check you selected TXT record type
- Verify the value is exactly as shown above
- No quotes needed in Netlify (they're added automatically)

**Multiple TXT records:**
- That's normal! Domains can have multiple TXT records
- Each serves a different purpose (email, domain verification, etc.)

**Need to remove it later:**
- Go to same DNS settings page
- Find the record
- Click "Delete" or trash icon

## Quick Links

- **Add Record Here:** https://app.netlify.com/sites/nodaluxe/settings/domain
- **Check DNS:** https://dnschecker.org/
- **Twilio Console:** https://console.twilio.com/

---

**After adding this record, proceed to TWILIO_QUICK_SETUP.md for the rest of the configuration.**
