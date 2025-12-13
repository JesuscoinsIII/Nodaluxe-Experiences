# Stripe Setup Guide for Nodaluxe Experiences

This guide explains how to set up Stripe payment integration for the ETHDenver event booking system.

## Overview

The Nodaluxe ETHDenver booking system uses Stripe Checkout to process payments securely. Stripe handles all payment processing, PCI compliance, and security concerns.

## Prerequisites

- A Stripe account (free to create at https://stripe.com)
- Access to Netlify environment variables for this project
- Basic understanding of environment variables

## Step 1: Get Your Stripe API Keys

### For Testing

1. Go to https://dashboard.stripe.com/test/apikeys
2. Sign in to your Stripe account (or create one)
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
4. Copy the **Secret key** - this is what we'll use

⚠️ **Important**: Keep your secret key confidential! Never commit it to version control or share it publicly.

### For Production (Live Mode)

1. Go to https://dashboard.stripe.com/apikeys
2. Toggle from "Test mode" to "Live mode" in the Stripe dashboard
3. You'll see your live keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)
4. Copy the **Secret key** for production use

## Step 2: Set Environment Variables in Netlify

1. Log in to your Netlify account
2. Navigate to your Nodaluxe site
3. Go to **Site settings** > **Environment variables**
4. Click **Add variable** or **Add a variable**
5. Add the following variable:
   - **Key**: `STRIPE_SECRET_KEY`
   - **Value**: Your Stripe secret key (e.g., `sk_test_...` for testing)
   - **Scopes**: Select all (Builds, Functions, Post-processing)
6. Click **Create variable** or **Save**

### For Production

When you're ready to go live:

1. Update the `STRIPE_SECRET_KEY` environment variable
2. Replace the test key with your live key (`sk_live_...`)
3. Redeploy your site for changes to take effect

## Step 3: Test Payments with Stripe Test Cards

When using test mode (keys starting with `sk_test_`), you can use Stripe's test cards to simulate payments.

### Successful Payment Test Card

- **Card Number**: `4242 4242 4242 4242`
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP Code**: Any 5 digits (e.g., 12345)

### Other Test Cards

- **Declined Card**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`
- **3D Secure Required**: `4000 0027 6000 3184`

For a complete list of test cards, visit: https://stripe.com/docs/testing

## Step 4: View Transactions in Stripe Dashboard

### Test Mode Transactions

1. Go to https://dashboard.stripe.com/test/payments
2. Make sure "Test mode" toggle is ON in the top right
3. You'll see all test transactions here
4. Click on any transaction to see details

### Live Mode Transactions

1. Go to https://dashboard.stripe.com/payments
2. Toggle to "Live mode"
3. You'll see all real transactions here

## Step 5: Testing the Integration

### Complete Test Booking Flow

1. Visit your site: `https://your-site.netlify.app/ethdenver-booking.html`
2. Look for the yellow "TEST MODE" banner at the top (indicates test keys are active)
3. Select an investment tier (Bronze, Silver, Gold, or Platinum)
4. Fill out the booking form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 5551234567
   - Number of seats: 1
5. Click "Proceed to Payment"
6. You'll be redirected to Stripe Checkout
7. Enter test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - ZIP: `12345`
8. Click "Pay"
9. You should be redirected to the success page
10. Check your Stripe dashboard to see the test payment

### Test Cancellation Flow

1. Follow steps 1-6 above
2. On the Stripe Checkout page, click the "Back" button or close the window
3. You should be redirected to the cancellation page
4. No payment should be recorded in Stripe

## Troubleshooting

### "Stripe is not configured" Error

**Problem**: The Netlify function can't find the `STRIPE_SECRET_KEY` environment variable.

**Solution**:
1. Verify the environment variable is set in Netlify
2. Make sure the variable name is exactly `STRIPE_SECRET_KEY` (case-sensitive)
3. Redeploy your site after adding the variable
4. Check Netlify function logs for detailed error messages

### "Invalid API Key" Error

**Problem**: The Stripe API key is incorrect or invalid.

**Solution**:
1. Verify you copied the entire key without spaces
2. Make sure you're using the Secret key, not the Publishable key
3. Check that you're using the correct key for your mode (test vs. live)
4. Regenerate your API key in Stripe if needed

### Payment Succeeds but Redirect Fails

**Problem**: The success/cancel URLs are incorrect.

**Solution**:
1. Check that `payment-success.html` and `payment-cancel.html` exist in your site root
2. Verify the URLs in the Netlify function match your domain
3. Check browser console for any redirect errors

### "CORS" or "Cross-Origin" Errors

**Problem**: The browser is blocking requests to the Netlify function.

**Solution**:
1. Verify the function includes CORS headers (already implemented)
2. Make sure you're accessing the site via HTTPS
3. Check that the function is deployed correctly in Netlify

## Security Best Practices

1. **Never expose your secret key**:
   - Don't commit it to Git
   - Don't include it in client-side code
   - Don't share it in screenshots or logs

2. **Use test mode during development**:
   - Always test with `sk_test_` keys first
   - Only switch to live mode when ready for production

3. **Monitor your Stripe dashboard**:
   - Regularly check for suspicious activity
   - Set up Stripe email notifications
   - Review failed payments

4. **Rotate keys if compromised**:
   - If you accidentally expose a key, immediately roll it in Stripe
   - Update the environment variable in Netlify
   - Redeploy your site

## Stripe Webhooks (Optional Advanced Feature)

For production, you may want to set up webhooks to receive real-time notifications about payment events:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Add it as `STRIPE_WEBHOOK_SECRET` in Netlify environment variables

## Support

If you need help:

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Netlify Documentation**: https://docs.netlify.com
- **Project Issues**: Contact the Nodaluxe development team

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

Last Updated: December 2024
