const Stripe = require('stripe');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    // Verify webhook signature
    const signature = event.headers['stripe-signature'];
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return { statusCode: 400, body: 'Webhook secret not configured' };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    // Handle different event types
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(stripeEvent.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Supabase credentials not configured');
    return;
  }

  try {
    const fetch = require('node-fetch');
    
    // Update booking in database
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?stripe_payment_intent_id=eq.${paymentIntent.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          payment_status: 'succeeded',
          status: 'confirmed',
          receipt_url: paymentIntent.charges?.data[0]?.receipt_url || null,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (response.ok) {
      console.log('Booking updated successfully');
      const bookings = await response.json();
      
      // Send notification to admin
      if (bookings && bookings.length > 0) {
        await sendAdminNotification(bookings[0], paymentIntent);
      }
    } else {
      console.error('Failed to update booking:', await response.text());
    }
  } catch (error) {
    console.error('Error updating booking:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Supabase credentials not configured');
    return;
  }

  try {
    const fetch = require('node-fetch');
    
    // Update booking status
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?stripe_payment_intent_id=eq.${paymentIntent.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({
          payment_status: 'failed',
          status: 'payment_failed',
          updated_at: new Date().toISOString()
        })
      }
    );

    if (response.ok) {
      console.log('Booking marked as failed');
    } else {
      console.error('Failed to update booking:', await response.text());
    }
  } catch (error) {
    console.error('Error updating booking:', error);
  }
}

// Handle canceled payment
async function handlePaymentCanceled(paymentIntent) {
  console.log('Payment canceled:', paymentIntent.id);
  
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Supabase credentials not configured');
    return;
  }

  try {
    const fetch = require('node-fetch');
    
    // Update booking status
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?stripe_payment_intent_id=eq.${paymentIntent.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({
          payment_status: 'canceled',
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
      }
    );

    if (response.ok) {
      console.log('Booking marked as canceled');
    } else {
      console.error('Failed to update booking:', await response.text());
    }
  } catch (error) {
    console.error('Error updating booking:', error);
  }
}

// Send admin notification
async function sendAdminNotification(booking, paymentIntent) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@nodaluxe.com';
  
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping admin notification');
    return;
  }

  try {
    const fetch = require('node-fetch');
    const amount = (paymentIntent.amount / 100).toFixed(2);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Nodaluxe Bookings <bookings@nodaluxe.com>',
        to: [NOTIFICATION_EMAIL],
        subject: `🎉 New Booking: ${booking.booking_type} - $${amount}`,
        html: `
          <h2>New Booking Received</h2>
          <p><strong>Booking ID:</strong> #${booking.id}</p>
          <p><strong>Type:</strong> ${booking.booking_type}</p>
          <p><strong>Customer:</strong> ${booking.full_name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
          <p><strong>Amount:</strong> $${amount} USD</p>
          <p><strong>Payment ID:</strong> ${paymentIntent.id}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p>View in Supabase dashboard to see full booking details.</p>
        `
      })
    });

    if (response.ok) {
      console.log('Admin notification sent successfully');
    } else {
      console.error('Failed to send admin notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}
