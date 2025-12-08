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

  try {
    const inquiry = await req.json();

    // Format the email body
    const emailBody = `
Hello,

You have received a new inquiry from the Nodaluxe website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIP DETAILS:
Trip Name: ${inquiry.trip_name || "Not specified"}
Date: ${inquiry.date || "Not specified"}
Time Window: ${inquiry.time_window || "Not specified"}
Duration: ${inquiry.duration || "Not specified"}

TRANSPORTATION:
Meetpoint/Destination: ${inquiry.meetpoint || "Not specified"}
Party Size: ${inquiry.party_size || "Not specified"}
Vehicle Type: ${inquiry.vehicle_type || "Not specified"}

EVENT SPACE:
Space Already Booked: ${inquiry.space_booked || "Not specified"}
Space Capacity: ${inquiry.space_capacity || "N/A"}
Needs Planning Help: ${inquiry.need_planning || "N/A"}

CONTACT INFORMATION:
Name: ${inquiry.contact_name || "Not provided"}
Phone/Email: ${inquiry.contact_info || "Not provided"}

ADDITIONAL NOTES:
${inquiry.notes || "None"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${inquiry.flag_send_to_ryan === "yes" ? "⚠️ FLAG: This inquiry needs event planning assistance - consider involving Ryan." : ""}

This inquiry was submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT.

Thanks,
Nodaluxe Website
`;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "events@nodaluxe.com",
        to: ["info@nodaluxe.com"],
        subject: `New Inquiry: ${inquiry.trip_name || "Untitled"} - ${inquiry.contact_name || "Unknown"}`,
        text: emailBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
