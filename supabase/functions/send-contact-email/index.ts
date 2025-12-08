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
    const contact = await req.json();

    // Format the email body
    const emailBody = `
Hello,

You have received a new CONTACT FORM submission from the Nodaluxe website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT INFORMATION:
Name: ${contact.full_name || "Not provided"}
Email: ${contact.email || "Not provided"}
Phone: ${contact.phone || "Not provided"}

SUBJECT:
${contact.subject || "No subject"}

MESSAGE:
${contact.message || "No message provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This message was submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT.

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
        subject: `New Contact: ${contact.subject || "General Inquiry"} - ${contact.full_name || "Unknown"}`,
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
