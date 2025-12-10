import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const ADMIN_EMAIL = 'info@nodaluxe.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { full_name, email, phone, subject, message } = await req.json();

    if (!full_name || !email || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, subject' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email to admin (notification of new RSVP)
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { color: #000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Event RSVP</h1>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${full_name}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${email}</span>
            </div>
            ${phone ? `
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${phone}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Details:</span>
              <div class="value" style="white-space: pre-wrap;">${message}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Confirmation email to user
    const userEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nodaluxe Experiences</h1>
            <p>RSVP Confirmation</p>
          </div>
          <div class="content">
            <h2>Thank you for your RSVP!</h2>
            <p>Hi ${full_name},</p>
            <p>We've received your RSVP for <strong>${subject.replace('Event RSVP: ', '')}</strong>.</p>
            <p>We'll send you more details about the event closer to the date. If you have any questions, feel free to reply to this email or call us at <strong>469-669-8878</strong>.</p>
            <p>Looking forward to seeing you there!</p>
            <p><strong>The Nodaluxe Team</strong></p>
          </div>
          <div class="footer">
            <p>Nodaluxe Experiences | Premium Transportation & Events across Texas</p>
            <p>Phone: 469-669-8878 | Email: info@nodaluxe.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send using Resend API (free tier: 100 emails/day)
    const responses = await Promise.all([
      // Email to admin
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Nodaluxe Events <noreply@nodaluxe.com>',
          to: [ADMIN_EMAIL],
          subject: subject,
          html: adminEmailHTML
        })
      }),
      // Confirmation email to user
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Nodaluxe Events <noreply@nodaluxe.com>',
          to: [email],
          subject: `Confirmation: ${subject.replace('Event RSVP: ', '')} RSVP`,
          html: userEmailHTML
        })
      })
    ]);

    // Check if both emails sent successfully
    const [adminRes, userRes] = responses;

    if (!adminRes.ok || !userRes.ok) {
      const adminError = adminRes.ok ? null : await adminRes.text();
      const userError = userRes.ok ? null : await userRes.text();

      console.error('Email send failed:', { adminError, userError });

      // Return partial success if at least one email sent
      if (adminRes.ok || userRes.ok) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Partial success: Some emails sent',
            details: { adminSent: adminRes.ok, userSent: userRes.ok }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      throw new Error('Failed to send emails');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'RSVP confirmation emails sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
