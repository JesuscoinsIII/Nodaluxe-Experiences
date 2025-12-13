# Checkout Page

This is the React-based checkout page for Nodaluxe Experiences, integrated with Stripe for secure payment processing.

## Features

- Built with React 19 and Vite
- Stripe Elements integration for secure payment processing
- Test mode enabled with Stripe test publishable key
- Responsive design matching the Nodaluxe brand
- Payment success confirmation page

## Important Notes

### Test Mode Implementation

This is a **test mode implementation** for demonstration purposes. It currently:
- Uses Stripe Elements UI for payment form
- Validates card input using Stripe's client-side validation
- Simulates payment success for testing purposes

### Production Requirements

To make this production-ready, you need to:

1. **Create a Backend API** to:
   - Create Stripe Payment Intents
   - Return client secrets to the frontend
   - Handle webhooks for payment confirmation
   - Store booking and payment records in a database

2. **Update the Frontend** to:
   - Fetch the client secret from your backend
   - Pass the client secret to the Elements component via options
   - Call `stripe.confirmPayment()` with the client secret
   - Handle payment confirmation responses

3. **Environment Variables**:
   - Move the Stripe publishable key to environment variables
   - Use different keys for test and production environments

Example backend endpoint needed:
```javascript
// POST /api/create-payment-intent
{
  amount: 15000, // in cents
  currency: 'usd',
  booking_details: {...}
}
// Response: { clientSecret: 'pi_xxx_secret_xxx' }
```

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit http://localhost:5173/dist/checkout/ to see the checkout page.

### Build

```bash
npm run build
```

This builds the React app to `dist/checkout/` directory.

## Testing

The checkout page is configured to run in Stripe test mode. Use the following test card:

- Card Number: 4242 4242 4242 4242
- Expiry Date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Usage

The checkout page receives booking details via URL parameters:

```
/checkout.html?pickup=Location&dropoff=Destination&date=2025-12-25&time=12:00&passengers=2&vehicle=Luxury+Sedan&amount=150.00
```

Users can navigate to the checkout page by:
1. Filling out the booking form on `/book-now.html`
2. Clicking the "Pay Now" button

## Structure

```
src/checkout/
  ├── index.html      # Entry HTML file
  ├── main.jsx        # React entry point
  ├── App.jsx         # Main app component with Stripe provider
  └── CheckoutForm.jsx # Checkout form with Stripe Elements
```

## Deployment

The page is automatically built and deployed to Netlify when changes are pushed to the repository.
