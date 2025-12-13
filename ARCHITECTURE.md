# Checkout Page Architecture

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Journey Flow                           │
└─────────────────────────────────────────────────────────────────┘

1. User visits book-now.html
   │
   ├── Fills out booking form
   │   ├── Pickup/Dropoff locations
   │   ├── Date & passengers
   │   └── Service type
   │
   ├── Two options:
   │   ├─► "Submit Request" → Sends to backend (existing flow)
   │   └─► "Pay Now" → Redirects to checkout
   │
2. Checkout.html (redirect page)
   │
   └─► /dist/checkout/index.html (React app)

3. React Checkout App
   │
   ├── Receives URL params (booking details)
   │
   ├── Displays:
   │   ├── Booking Summary (left panel)
   │   └── Payment Form (right panel)
   │
   ├── Stripe Elements Integration
   │   ├── Loads Stripe.js
   │   ├── Renders secure payment form
   │   └── Validates card input (client-side)
   │
   └── On Submit:
       ├── Validates form
       ├── [TEST MODE: Simulates success]
       └── Shows success page with confirmation


┌─────────────────────────────────────────────────────────────────┐
│                     File Structure                               │
└─────────────────────────────────────────────────────────────────┘

Root Directory/
├── checkout.html                    # Redirect page
├── book-now.html                    # Updated with "Pay Now" button
├── test-checkout.html              # Test scenarios page
├── CHECKOUT.md                     # Detailed documentation
├── README.md                       # Updated with checkout info
├── vite.config.js                  # Build configuration
├── package.json                    # Dependencies & scripts
├── netlify.toml                    # Deployment config (with build command)
│
├── src/checkout/                   # React source files
│   ├── index.html                  # HTML template
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Main component with Stripe provider
│   └── CheckoutForm.jsx            # Payment form component
│
└── dist/checkout/                  # Built files (git-ignored)
    ├── index.html                  # Built HTML
    └── assets/                     # Bundled JS/CSS
        └── index-[hash].js         # React + Stripe bundle


┌─────────────────────────────────────────────────────────────────┐
│                     Tech Stack                                   │
└─────────────────────────────────────────────────────────────────┘

Frontend Framework:
├── React 19.2.3
└── ReactDOM 19.2.3

Build Tool:
└── Vite 7.2.7
    └── @vitejs/plugin-react 5.1.2

Payment Processing:
├── @stripe/stripe-js 8.5.3         # Core Stripe library
└── @stripe/react-stripe-js 5.4.1   # React components

Styling:
└── Tailwind CSS (via CDN)

Deployment:
└── Netlify
    ├── Build command: npm run build
    └── Publish directory: . (root)


┌─────────────────────────────────────────────────────────────────┐
│                     Test Mode Details                            │
└─────────────────────────────────────────────────────────────────┘

Stripe Configuration:
├── Mode: Test
├── Key Type: Publishable (safe for client-side)
└── Test Card: 4242 4242 4242 4242

Current Limitations:
├── No backend API
├── No Payment Intent creation
├── Simulated payment success
└── No database storage

Required for Production:
├── Backend API endpoint
│   └── POST /api/create-payment-intent
│       ├── Input: { amount, currency, booking_details }
│       └── Output: { clientSecret }
│
├── Environment variables
│   ├── VITE_STRIPE_PUBLISHABLE_KEY_TEST
│   └── VITE_STRIPE_PUBLISHABLE_KEY_PROD
│
├── Webhook handlers
│   └── POST /webhooks/stripe
│       └── Handle payment confirmations
│
└── Database integration
    └── Store booking & payment records
