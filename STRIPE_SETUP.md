# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for Nodaluxe Experiences checkout flows.

## Prerequisites

- Netlify account with site deployed
- Supabase account and database configured
- Resend account for email confirmations

## Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and sign up for an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

## Step 2: Get Your API Keys

### Test Mode Keys (for development)

1. In the Stripe Dashboard, ensure you're in **Test Mode** (toggle in the top right)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### Live Mode Keys (for production)

1. Complete Stripe account activation
2. Switch to **Live Mode** in the Stripe Dashboard
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_live_`)
5. Copy your **Secret key** (starts with `sk_live_`)

## Step 3: Configure Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following environment variables:

```
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=(leave empty for now, we'll add this in Step 5)
```

4. Click **Save**
5. Redeploy your site for changes to take effect

## Step 4: Update Database Schema

The following SQL should be executed in your Supabase SQL editor to add payment tracking to the bookings table:

```sql
-- Add payment columns to bookings table
ALTER TABLE IF EXISTS bookings
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS bookings_payment_status_idx ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS bookings_stripe_payment_intent_idx ON bookings(stripe_payment_intent_id);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  booking_type TEXT NOT NULL, -- 'transportation', 'quad_pack', 'event'
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'usd',
  receipt_url TEXT,
  booking_details JSONB,
  notes TEXT
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for checkout)
CREATE POLICY "Allow public insert to bookings"
ON bookings FOR INSERT
WITH CHECK (true);

-- Allow reads with payment intent ID (for status checking)
CREATE POLICY "Allow read with payment intent"
ON bookings FOR SELECT
USING (stripe_payment_intent_id IS NOT NULL);
```

## Step 5: Set Up Webhooks

Webhooks allow Stripe to notify your application when payment events occur (e.g., payment succeeded, failed).

### Create Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter the endpoint URL:
   ```
   https://YOUR-SITE-NAME.netlify.app/.netlify/functions/stripe-webhook
   ```
4. Select the following events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Click **Add endpoint**

### Get Webhook Secret

1. After creating the endpoint, click on it to view details
2. Under **Signing secret**, click **Reveal**
3. Copy the secret (starts with `whsec_`)
4. Add it to your Netlify environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Redeploy your site

## Step 6: Test the Integration

### Test Cards

Use these test card numbers in Test Mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure Required**: `4000 0027 6000 3184`

Use any future expiration date, any 3-digit CVC, and any postal code.

### Testing Process

1. Navigate to a checkout page (e.g., `/checkout.html`)
2. Fill out the booking form
3. Enter test card information
4. Click "Confirm & Pay"
5. Verify:
   - Payment completes successfully
   - User is redirected to success page
   - Email confirmation is sent
   - Booking is created in database with `payment_status = 'succeeded'`

### Test Webhook Delivery

1. Complete a test payment
2. In Stripe Dashboard, go to **Developers** → **Webhooks**
3. Click on your endpoint
4. Check the **Logs** tab to see webhook delivery attempts
5. Verify the webhook was delivered successfully (200 response)

## Step 7: Go Live

### Before Switching to Live Mode:

1. ✅ Complete all testing in Test Mode
2. ✅ Verify email confirmations are working
3. ✅ Verify database records are being created correctly
4. ✅ Test all three checkout flows (transportation, quad pack, events)
5. ✅ Complete Stripe account activation

### Switching to Live Mode:

1. In Stripe Dashboard, switch to **Live Mode**
2. Get your Live API keys (Step 2 above)
3. Update environment variables in Netlify with Live keys
4. Create a new webhook endpoint for production using Live Mode
5. Update `STRIPE_WEBHOOK_SECRET` with the new Live webhook secret
6. Redeploy your site
7. Test with a small real payment to verify everything works

## Troubleshooting

### Payment Intent Creation Fails

- Check that `STRIPE_SECRET_KEY` is set correctly in Netlify
- Verify the Netlify Function logs for errors
- Ensure the amount is an integer (in cents, not dollars)

### Webhook Not Receiving Events

- Verify the webhook URL is correct and accessible
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Look at webhook logs in Stripe Dashboard for delivery errors
- Ensure your site is deployed and the function is accessible

### Payment Succeeds but Database Not Updated

- Check webhook logs in Stripe Dashboard
- Verify webhook secret is correct
- Check Netlify Function logs for errors
- Ensure database RLS policies allow the webhook to update records

## Security Best Practices

1. ✅ Never expose `STRIPE_SECRET_KEY` in frontend code
2. ✅ Always validate webhook signatures using `STRIPE_WEBHOOK_SECRET`
3. ✅ Use HTTPS for all transactions (Netlify provides this)
4. ✅ Implement rate limiting on payment endpoints
5. ✅ Log all payment attempts for audit trail
6. ✅ Never store card numbers or CVV codes
7. ✅ Use Stripe's Payment Element for PCI compliance

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Nodaluxe Support**: info@nodaluxe.com

## Monitoring

### Key Metrics to Track

1. **Payment Success Rate**: Track in Stripe Dashboard → Analytics
2. **Failed Payments**: Monitor reasons for failures
3. **Webhook Delivery**: Ensure webhooks are being delivered successfully
4. **Refund Requests**: Track and process via Stripe Dashboard

### Recommended Stripe Dashboard Views

- **Payments**: See all transactions
- **Customers**: View customer payment history
- **Analytics**: Payment success rates, volume, revenue
- **Logs**: API request logs for debugging

## Additional Resources

- [Stripe Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [PCI Compliance](https://stripe.com/docs/security/guide)
