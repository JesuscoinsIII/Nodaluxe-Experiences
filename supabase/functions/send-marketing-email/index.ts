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

    // Build event types list
    const eventTypes = [];
    if (inquiry.event_corporate) eventTypes.push("Corporate");
    if (inquiry.event_social) eventTypes.push("Social");
    if (inquiry.event_sports) eventTypes.push("Sports");
    if (inquiry.event_fundraising) eventTypes.push("Fundraising");
    if (inquiry.event_community) eventTypes.push("Community");
    if (inquiry.event_concerts) eventTypes.push("Concerts");
    if (inquiry.event_chef_driven) eventTypes.push("Chef-driven");
    if (inquiry.event_other) eventTypes.push("Other");

    // Format the email body
    const emailBody = `
Hello,

You have received a new MARKETING/PARTNERSHIP inquiry from the Nodaluxe website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUSINESS INFORMATION:
Business Name: ${inquiry.business_name || "Not provided"}
Business Location: ${inquiry.business_location || "Not provided"}
Product/Service to Market: ${inquiry.product_service || "Not provided"}

CONTACT INFORMATION:
Contact Person: ${inquiry.contact_person || "Not provided"}
Email: ${inquiry.email || "Not provided"}
Phone: ${inquiry.phone || "Not provided"}

EVENT TYPES INTERESTED IN:
${eventTypes.length > 0 ? eventTypes.join(", ") : "None selected"}

ADDITIONAL COMMENTS:
${inquiry.comments || "None"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
        subject: `New Marketing Inquiry: ${inquiry.business_name || "Unknown Business"} - ${inquiry.contact_person || "Unknown"}`,
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
