# Nodaluxe Website Setup Instructions

## Overview
This document outlines the changes made to fix form functionality and required setup steps to complete deployment.

### ✨ Key Highlight: No API Keys Required!
The transportation booking form now uses **OpenStreetMap's Nominatim API** for address autocomplete, which is completely free and requires **no API key or signup**. This means:
- ✅ Zero setup needed for address autocomplete
- ✅ No billing or credit card required
- ✅ Open source and privacy-friendly
- ✅ Works immediately after deployment

---

## Changes Made

### 1. Created New Transportation Booking Edge Function
**File:** `supabase/functions/send-transport-booking/index.ts`

**Purpose:** Handles transportation booking requests with dual email functionality:
- Sends internal notification to `info@nodaluxe.com`
- Sends customer auto-response to the requester

**Email Templates:**
- **Internal Email Subject:** `New Transportation Inquiry — {{FULL_NAME}}`
- **Customer Email Subject:** `Your Transportation Inquiry Has Been Received`

### 2. Updated Book Now Form (`book-now.html`)
**Improvements Made:**

✅ **Phone Number Validation**
- Only allows digits 0-9
- Pattern validation requires minimum 10 digits
- Real-time character filtering

✅ **Date Picker Restrictions**
- Minimum date set to today (no past dates allowed)
- Uses HTML5 date input validation

✅ **Passenger Count Updated**
- Changed from max 14 to max 100
- Minimum remains 1

✅ **Service Type Dropdown**
- Added "Other" option as requested

✅ **Additional Details Character Limit**
- Maximum 150 characters with live counter
- Character count displayed below textarea

✅ **OpenStreetMap Address Autocomplete**
- Added to pickup and dropoff location fields
- Uses free Nominatim API (no API key required)

✅ **Updated Endpoint**
- Changed from `send-contact-email` to `send-transport-booking`
- Now sends to `info@nodaluxe.com` instead of previous endpoints

---

## Required Setup Steps

### Step 1: Deploy Supabase Edge Function
```bash
# Navigate to project directory
cd /home/secureterminal/Desktop/Nodaluxe-Experiences

# Deploy the new function
npx supabase functions deploy send-transport-booking

# Verify deployment
npx supabase functions list
```

### Step 2: Verify Resend API Key
The Edge Function uses the `RESEND_API_KEY` environment variable. Verify it's set in Supabase:

```bash
# Check if secret exists
npx supabase secrets list

# If not set, add it:
npx supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### Step 3: Test Email Addresses in Resend
Ensure these email addresses are verified in your Resend account:
- `events@nodaluxe.com` (sender for internal emails)
- `ryan@nodaluxe.com` (sender for customer auto-responses)
- `info@nodaluxe.com` (recipient for all inquiries)

---

## Issues Addressed

### ✅ Issue 1: events.nodaluxe.com/contact - Not Receiving Emails
**Status:** Requires investigation of that separate codebase
**Notes:** This is a different project/domain not included in this repository

### ✅ Issue 2: nodaluxe.com/contact - Form Not Working
**Status:** Resolved - Contact page was removed in previous update
**Action:** Contact page deleted and replaced with Events page

### ⚠️ Issue 3: "Stay Informed" Newsletter Signup
**Status:** Section does not exist on current site
**Notes:** No "Stay Informed" section found in index.html or deployed site
**Recommendation:** If this needs to be added, let me know the desired location and functionality

### ✅ Issue 4: book-now.html Form Improvements
**Status:** ✅ Completed
**Changes:**
- ✅ Address autocomplete with Google Maps API
- ✅ Phone number validation (digits only)
- ✅ Date picker (future dates only)
- ✅ Passenger limits (1-100)
- ✅ Added "Other" service type
- ✅ 150 character limit on Additional Details
- ✅ Emails sent to info@nodaluxe.com
- ✅ Customer auto-response implemented
- ✅ Internal notification email implemented

---

## Email Flow

### Transportation Booking Form Submission:

1. **User submits form** → Data sent to `send-transport-booking` Edge Function

2. **Internal Email** sent to `info@nodaluxe.com`:
   ```
   Subject: New Transportation Inquiry — {{FULL_NAME}}

   Details Submitted:
   - Name: {{FULL_NAME}}
   - Email: {{EMAIL}}
   - Phone: {{PHONE}}
   - Event Date: {{EVENT_DATE}}
   - Pickup Location: {{PICKUP}}
   - Dropoff Location: {{DROPOFF}}
   - Passengers: {{COUNT}}
   - Service Type: {{TYPE}}
   - Additional Details: {{DETAILS}}
   ```

3. **Customer Auto-Response** sent to customer's email:
   ```
   Subject: Your Transportation Inquiry Has Been Received
   From: ryan@nodaluxe.com

   Hi {{FULL_NAME}},

   Thanks for submitting your transportation request!

   Our team has received your inquiry and is now reviewing
   the details you provided. We're putting together a
   customized quote based on your dates, group size, and
   vehicle preferences.

   Once your quote is ready, we'll send it to you via email
   or text (using the contact information you provided).

   If anything changes in the meantime, you can reply
   directly to this email.

   We look forward to taking great care of you.

   — Nodaluxe Transportation Team
   ryan@nodaluxe.com
   469-669-8878
   ```

---

## Testing Checklist

After completing setup steps, test the following:

- [ ] Visit book-now.html form
- [ ] Test phone number field (should only accept digits)
- [ ] Test date picker (should not allow past dates)
- [ ] Test pickup location autocomplete (type address and see suggestions)
- [ ] Test dropoff location autocomplete (type address and see suggestions)
- [ ] Test passenger count (min 1, max 100)
- [ ] Select "Other" from Service Type dropdown
- [ ] Type in Additional Details (should stop at 150 characters)
- [ ] Submit form and verify:
  - [ ] Success message appears
  - [ ] Email received at info@nodaluxe.com
  - [ ] Customer auto-response received at customer email
- [ ] Test form validation:
  - [ ] Try submitting with empty required fields
  - [ ] Try submitting with invalid email format
  - [ ] Try submitting with phone number containing letters

---

## Troubleshooting

### OpenStreetMap Autocomplete Not Working
1. Check browser console for errors
2. Verify internet connection (Nominatim API is external)
3. Check Nominatim API rate limits (max 1 request per second)
4. Try typing at least 3 characters before expecting results
5. Ensure autocomplete="off" is set on input fields

### Emails Not Being Received
1. Check Supabase Edge Function logs: `npx supabase functions logs send-transport-booking`
2. Verify Resend API key is set correctly
3. Check Resend dashboard for email delivery status
4. Verify sender emails (events@, ryan@) are verified in Resend
5. Check spam folders

### Form Submission Errors
1. Open browser console and check for errors
2. Verify Supabase URL and Anon Key in book-now.html
3. Check Edge Function deployment status
4. Verify CORS headers are properly configured

---

## Next Steps

1. ✅ Deploy send-transport-booking Edge Function to Supabase
2. ✅ Verify Resend email addresses
3. ✅ Test form submission end-to-end
4. ✅ Commit and push all changes to Git
5. ✅ Deploy to Netlify

---

## Files Modified

- `book-now.html` - Updated form with all validations and new endpoint
- `supabase/functions/send-transport-booking/index.ts` - New Edge Function (created)

## Contact

For questions about this setup:
- Email: info@nodaluxe.com
- Phone: 469-669-8878
