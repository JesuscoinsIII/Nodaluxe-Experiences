import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Determine dynamic email based on service type
  const getDynamicEmail = (serviceType: string) => {
    const normalizedType = serviceType?.toLowerCase();
    
    // Events go to dedicated events email
    if (normalizedType === 'event' || normalizedType === 'event transportation') {
      return 'events@nodaluxe.com';
    }
    
    // Transportation services go to ryan
    if (['airport', 'airport transfer', 'hourly', 'hourly rental', 'point-to-point'].includes(normalizedType)) {
      return 'ryan@nodaluxe.com';
    }
    
    // Default to general info email
    return 'info@nodaluxe.com';
  };

  try {
    const booking = await req.json();

    const dynamicEmail = getDynamicEmail(booking.service_type);

    // Internal email to info@nodaluxe.com
    const internalEmailBody = `
A new transportation request has been submitted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Details Submitted

Name: ${booking.full_name || "Not provided"}

Email: ${booking.email || "Not provided"}

Phone: ${booking.phone || "Not provided"}

Event Date: ${booking.event_date || "Not specified"}

Pickup Location: ${booking.pickup_location || "Not specified"}

Dropoff Location: ${booking.dropoff_location || "Not specified"}

Passengers: ${booking.passengers || "Not specified"}

Service Type: ${booking.service_type || "Not specified"}

Additional Details: ${booking.additional_details || "None"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This request was submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT.

— Nodaluxe Website
`;

    // Customer auto-response email
    const customerEmailBody = `
Hi ${booking.full_name || "there"},

Thanks for submitting your transportation request!

Our team has received your inquiry and is now reviewing the details you provided.
We're putting together a customized quote based on your dates, group size, and vehicle preferences.

Once your quote is ready, we'll send it to you via email or text (using the contact information you provided).

If anything changes in the meantime, you can reply directly to this email.

We look forward to taking great care of you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This request was submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT.

We are thrilled to have you onboard while we aim to provide the most rare and unique experience as we embark on this journey together.

Typical response time is within 24-48 hours, but you can always pick up the phone and call us at (469) 669-8878 or email us at ${dynamicEmail}.

— Nodaluxe Experiences
`;

    // Send internal email to info@nodaluxe.com
    const internalResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "events@nodaluxe.com",
        to: ["info@nodaluxe.com"],
        subject: `New Transportation Inquiry — ${booking.full_name || "Unknown"}`,
        text: internalEmailBody,
      }),
    });

    const internalData = await internalResponse.json();

    if (!internalResponse.ok) {
      console.error("Resend internal email error:", internalData);
    }

    // Send customer auto-response
    const customerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ryan@nodaluxe.com",
        to: [booking.email],
        subject: "Your Transportation Inquiry Has Been Received",
        text: customerEmailBody,
      }),
    });

    const customerData = await customerResponse.json();

    if (!customerResponse.ok) {
      console.error("Resend customer email error:", customerData);
      // Still return success for internal email even if customer email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        internalId: internalData.id,
        customerId: customerData.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
