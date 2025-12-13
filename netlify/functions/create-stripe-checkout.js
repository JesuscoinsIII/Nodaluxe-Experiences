/**
 * Netlify Function: Create Stripe Checkout Session
 * 
 * This function creates a Stripe Checkout session for ETHDenver event bookings.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Stripe API keys from https://dashboard.stripe.com/test/apikeys
 * 2. Add STRIPE_SECRET_KEY to Netlify environment variables
 *    - For testing: Use test key (starts with sk_test_)
 *    - For production: Use live key (starts with sk_live_)
 * 3. Set environment variables in Netlify:
 *    Site settings > Environment variables > Add variable
 * 
 * TEST MODE:
 * Use test card: 4242 4242 4242 4242
 * Any future expiry date, any CVC, any ZIP code
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Stripe is not configured. Please contact support.' 
        })
      };
    }

    const { 
      tierName, 
      tierPrice, 
      seats, 
      customerEmail, 
      customerName 
    } = JSON.parse(event.body);

    // Validate input
    if (!tierName || !tierPrice || !seats || !customerEmail) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields' 
        })
      };
    }

    // Calculate total amount (Stripe expects amount in cents)
    const unitAmount = Math.round(tierPrice * 100);
    const quantity = parseInt(seats);

    // Get the base URL for redirect
    const baseUrl = event.headers.origin || event.headers.referer || 'https://nodaluxe.com';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ETHDenver 2025 - ${tierName}`,
              description: `Prevost "Hack the Bus" - ${seats} seat(s) reserved`,
              images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        event: 'ETHDenver 2025',
        tier: tierName,
        seats: seats.toString(),
        customer_name: customerName || 'Not provided'
      },
      success_url: `${baseUrl}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment-cancel.html`,
    });

    console.log('Checkout session created:', session.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to create checkout session'
      })
    };
  }
};
