const Stripe = require('stripe');

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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Parse request body
    const { amount, currency = 'usd', bookingData } = JSON.parse(event.body);

    // Minimum amount (in cents) - configurable via environment variable
    const MIN_AMOUNT = parseInt(process.env.MIN_PAYMENT_AMOUNT || '50');

    // Validate amount
    if (!amount || amount < MIN_AMOUNT) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `Invalid amount. Minimum $${(MIN_AMOUNT / 100).toFixed(2)} USD.` })
      };
    }

    // Validate booking data
    if (!bookingData || !bookingData.email || !bookingData.full_name) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required booking information' })
      };
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_type: bookingData.booking_type || 'unknown',
        customer_email: bookingData.email,
        customer_name: bookingData.full_name,
      },
      description: `Nodaluxe ${bookingData.booking_type || 'Booking'} - ${bookingData.full_name}`,
      receipt_email: bookingData.email,
    });

    // Store booking in Supabase with pending status
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const fetch = require('node-fetch');
        const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            booking_type: bookingData.booking_type,
            full_name: bookingData.full_name,
            email: bookingData.email,
            phone: bookingData.phone,
            status: 'pending',
            payment_status: 'pending',
            stripe_payment_intent_id: paymentIntent.id,
            amount_paid: amount / 100, // Convert cents to dollars
            currency,
            booking_details: bookingData,
            notes: bookingData.notes || null
          })
        });

        if (!supabaseResponse.ok) {
          console.error('Supabase error:', await supabaseResponse.text());
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the payment intent creation if DB insert fails
      }
    }

    // Return client secret
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };

  } catch (error) {
    console.error('Payment Intent creation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message || 'Failed to create payment intent'
      })
    };
  }
};
