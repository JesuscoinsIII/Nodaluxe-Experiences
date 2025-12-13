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
    const { paymentIntentId } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing payment intent ID' })
      };
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if payment succeeded
    if (paymentIntent.status !== 'succeeded') {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'Payment not completed',
          status: paymentIntent.status 
        })
      };
    }

    // Update booking in Supabase
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const fetch = require('node-fetch');
        
        // Find booking by payment intent ID
        const findResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/bookings?stripe_payment_intent_id=eq.${paymentIntentId}&select=*`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
          }
        );

        const bookings = await findResponse.json();
        
        if (bookings && bookings.length > 0) {
          const booking = bookings[0];
          
          // Update booking status
          const updateResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/bookings?id=eq.${booking.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({
                status: 'confirmed',
                payment_status: 'succeeded',
                receipt_url: paymentIntent.charges?.data[0]?.receipt_url || null,
                updated_at: new Date().toISOString()
              })
            }
          );

          if (!updateResponse.ok) {
            console.error('Failed to update booking:', await updateResponse.text());
          } else {
            const updatedBooking = await updateResponse.json();
            
            // Send confirmation email via Resend
            await sendConfirmationEmail(booking, paymentIntent);
            
            return {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                success: true,
                booking: updatedBooking[0],
                receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
              })
            };
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Return success even if DB update fails (payment succeeded)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
        }
      })
    };

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message || 'Failed to confirm payment'
      })
    };
  }
};

// Helper function to send confirmation email
async function sendConfirmationEmail(booking, paymentIntent) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email');
    return;
  }

  try {
    const fetch = require('node-fetch');
    
    const emailContent = generateEmailContent(booking, paymentIntent);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Nodaluxe Experiences <bookings@nodaluxe.com>',
        to: [booking.email],
        subject: `Booking Confirmation - ${booking.booking_type}`,
        html: emailContent
      })
    });

    if (!response.ok) {
      console.error('Email send failed:', await response.text());
    } else {
      console.log('Confirmation email sent successfully');
    }
  } catch (error) {
    console.error('Email error:', error);
  }
}

// Generate HTML email content
function generateEmailContent(booking, paymentIntent) {
  const amount = (paymentIntent.amount / 100).toFixed(2);
  const receiptUrl = paymentIntent.charges?.data[0]?.receipt_url || '#';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #d4af37; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .booking-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #d4af37; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nodaluxe Experiences</h1>
          <p>Booking Confirmation</p>
        </div>
        <div class="content">
          <h2>Thank you for your booking!</h2>
          <p>Dear ${booking.full_name},</p>
          <p>We're excited to confirm your booking with Nodaluxe Experiences. Your payment has been processed successfully.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Booking Type:</strong> ${booking.booking_type}</p>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Amount Paid:</strong> $${amount} USD</p>
            <p><strong>Payment ID:</strong> ${paymentIntent.id}</p>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${receiptUrl}" class="button">View Receipt</a>
          </p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>You will receive a detailed confirmation email within 24 hours</li>
            <li>Our team will contact you to finalize the details</li>
            <li>If you have any questions, reply to this email or call 469-669-8878</li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2024 Nodaluxe Experiences. All rights reserved.</p>
          <p>Phone: 469-669-8878 | Email: info@nodaluxe.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
