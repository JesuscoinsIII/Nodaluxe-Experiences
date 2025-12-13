# Checkout Page

This is the React-based checkout page for Nodaluxe Experiences, integrated with Stripe for secure payment processing.

## Features

- Built with React 19 and Vite
- Stripe Elements integration for secure payment processing
- Test mode enabled with Stripe test publishable key
- Responsive design matching the Nodaluxe brand
- Payment success confirmation page

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
