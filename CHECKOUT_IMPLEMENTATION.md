# Checkout Implementation Guide

This document provides an overview of the Stripe checkout integration for Nodaluxe Experiences.

## Overview

The checkout system enables secure payment processing for three types of bookings:
1. **Transportation Services** (`checkout.html`) - Luxury vehicle bookings
2. **Modal Quad Pack** (`checkout-quad-pack.html`) - Event package deals
3. **Event Tickets** (`checkout-event.html`) - Individual event ticket purchases

## Architecture

### Frontend Flow
```
Booking Form → Checkout Page → Payment Processing → Success/Failure Page
```

1. User fills out booking form (book-now.html, modal-quad-pack.html, or events.html)
2. Form data is stored in sessionStorage
3. User is redirected to appropriate checkout page
4. Checkout page:
   - Displays booking summary
   - Collects payment information using Stripe Payment Element
   - Creates Payment Intent via Netlify Function
   - Confirms payment with Stripe
5. On success: Redirects to checkout-success.html
6. On failure: Shows error or redirects to checkout-failed.html

### Backend Flow (Netlify Functions)

#### 1. Create Payment Intent (`/netlify/functions/create-payment-intent.js`)
- **Purpose**: Initialize a Stripe Payment Intent and create booking record
- **Input**: Booking details and amount
- **Output**: Client secret for Stripe Payment Element
- **Process**:
  1. Validates booking data and amount
  2. Creates Stripe Payment Intent
  3. Stores booking in Supabase with "pending" status
  4. Returns client secret to frontend

#### 2. Confirm Payment (`/netlify/functions/confirm-payment.js`)
- **Purpose**: Verify payment success and finalize booking
- **Input**: Payment Intent ID
- **Output**: Booking confirmation details
- **Process**:
  1. Retrieves Payment Intent from Stripe
  2. Verifies payment succeeded
  3. Updates booking status to "confirmed"
  4. Sends confirmation email via Resend
  5. Returns booking details

#### 3. Stripe Webhook (`/netlify/functions/stripe-webhook.js`)
- **Purpose**: Handle asynchronous payment events from Stripe
- **Input**: Webhook event from Stripe
- **Output**: 200 OK response
- **Process**:
  1. Verifies webhook signature
  2. Handles payment events:
     - `payment_intent.succeeded` - Mark booking as confirmed
     - `payment_intent.payment_failed` - Mark booking as failed
     - `payment_intent.canceled` - Mark booking as canceled
  3. Sends admin notification email
  4. Updates database accordingly

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  booking_type TEXT NOT NULL,              -- 'transportation', 'quad_pack', 'event'
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',           -- 'pending', 'confirmed', 'canceled'
  payment_status TEXT DEFAULT 'pending',   -- 'pending', 'succeeded', 'failed', 'refunded'
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'usd',
  receipt_url TEXT,
  booking_details JSONB,                   -- Flexible field for type-specific data
  notes TEXT
);
```

## Security Features

### 1. PCI Compliance
- All card data handled by Stripe (never touches our servers)
- Stripe Payment Element for secure payment collection
- No sensitive data stored in our database

### 2. API Security
- Secret keys only used server-side in Netlify Functions
- Webhook signature verification prevents replay attacks
- Row-Level Security (RLS) on Supabase tables

### 3. Input Validation
- Client-side form validation
- Server-side amount and data validation
- Minimum payment amount enforcement

## Configuration

### Required Environment Variables

**Netlify (for Functions):**
```env
STRIPE_SECRET_KEY=sk_test_...           # Stripe secret key (NEVER expose)
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signing secret
SUPABASE_URL=https://...                # Supabase project URL
SUPABASE_SERVICE_KEY=...                # Supabase service role key
SUPABASE_ANON_KEY=...                   # Supabase anonymous key
RESEND_API_KEY=re_...                   # Resend API key for emails
NOTIFICATION_EMAIL=bookings@nodaluxe.com # Admin notification email
MIN_PAYMENT_AMOUNT=50                   # Minimum payment (cents)
```

**Client-side (in HTML files):**
- Update `STRIPE_KEY` constant in each checkout HTML file
- Use `pk_test_...` for testing, `pk_live_...` for production

## Testing

### Test Cards

**Success:**
```
Card: 4242 4242 4242 4242
Date: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Decline:**
```
Card: 4000 0000 0000 0002
```

**3D Secure:**
```
Card: 4000 0027 6000 3184
```

### Testing Checklist

- [ ] Transportation booking flow
- [ ] Quad Pack booking flow
- [ ] Event ticket booking flow
- [ ] Successful payment completion
- [ ] Failed payment handling
- [ ] Email confirmations sent
- [ ] Database records created
- [ ] Webhook delivery working
- [ ] Mobile responsive design

## Error Handling

### Frontend Errors
- Form validation errors (inline)
- Payment Intent creation failures
- Payment confirmation errors
- Network timeouts

### Backend Errors
- Invalid payment amount
- Missing required data
- Stripe API errors
- Database connection issues
- Email sending failures

All errors are logged to console and appropriate messages shown to users.

## Email Notifications

### Customer Confirmation Email
Sent when payment succeeds:
- Booking confirmation number
- Booking details
- Receipt link
- What happens next
- Contact information

### Admin Notification Email
Sent when payment succeeds:
- New booking alert
- Customer information
- Booking details
- Payment amount
- Link to admin dashboard

## Pricing

Prices are calculated based on:
- **Transportation**: Service type + passenger count + distance
- **Quad Pack**: Package tier (Bronze/Silver/Gold/Platinum)
- **Events**: Ticket price × quantity - promo discount

All amounts are in cents (multiply by 100 for Stripe).

## Webhooks Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copy webhook signing secret
5. Add to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

## Common Issues

### Issue: "Stripe publishable key not configured"
**Solution**: Update the `STRIPE_KEY` constant in checkout HTML files with your actual publishable key.

### Issue: Payment Intent creation fails
**Solution**: Check that `STRIPE_SECRET_KEY` is set correctly in Netlify environment variables.

### Issue: Webhook not receiving events
**Solution**: 
1. Verify webhook URL is correct
2. Check `STRIPE_WEBHOOK_SECRET` is set
3. Look at webhook logs in Stripe Dashboard
4. Ensure site is deployed and accessible

### Issue: Email not sending
**Solution**: 
1. Verify `RESEND_API_KEY` is set
2. Check `NOTIFICATION_EMAIL` is configured
3. Look at Netlify Function logs for errors

## Going Live

Before switching to production:

1. **Complete Stripe account activation**
2. **Switch to Live Mode API keys**
   - Update `STRIPE_SECRET_KEY` with `sk_live_...`
   - Update checkout pages with `pk_live_...`
   - Update `STRIPE_WEBHOOK_SECRET` with live webhook secret
3. **Test with real payments** (small amounts)
4. **Verify email confirmations** work
5. **Monitor for errors** in first few days
6. **Set up alerts** for failed payments

## Support

- **Documentation**: See `STRIPE_SETUP.md` for detailed setup
- **Stripe Docs**: https://stripe.com/docs/payments/payment-intents
- **Supabase Docs**: https://supabase.com/docs
- **Contact**: info@nodaluxe.com

## Maintenance

### Regular Tasks
- Monitor failed payments in Stripe Dashboard
- Review webhook delivery logs weekly
- Check email delivery rates
- Update test card numbers if Stripe changes them
- Keep Stripe.js library updated

### Monthly Tasks
- Review booking statistics
- Check for payment disputes/chargebacks
- Verify all webhooks are being delivered
- Test payment flows end-to-end

## Future Enhancements

Potential improvements to consider:
- [ ] Apple Pay / Google Pay support (already included in Payment Element)
- [ ] Subscription/recurring payments for quad packs
- [ ] Multi-currency support
- [ ] Promo code system (partial implementation exists)
- [ ] Refund processing via admin panel
- [ ] Abandoned cart recovery emails
- [ ] Payment analytics dashboard
- [ ] Invoice generation
