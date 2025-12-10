import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';

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
    const { event_name, city, event_date, event_type } = await req.json();

    if (!event_name || !city || !event_date || !event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the date
    const dateObj = new Date(event_date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create the prompt for Claude
    const prompt = `You are an expert event content generator for Nodaluxe Experiences, a premium transportation and event services company in Texas.

Given these minimal details about an event:
- Event Name: ${event_name}
- Location: ${city}, Texas
- Date: ${formattedDate}
- Event Type: ${event_type}

Generate comprehensive event details that would be attractive and professional for an events listing website.

IMPORTANT: Your response must be ONLY a valid JSON object, with NO additional text before or after. Do not include markdown code blocks or any explanation.

Generate all fields in this exact JSON format:

{
  "event_title": "Full professional event title",
  "url_slug": "url-friendly-slug-lowercase-hyphens",
  "event_date_time": "YYYY-MM-DDTHH:MM" (use ${event_date} for date, add appropriate start time like 18:00 for evening events, 10:00 for morning),
  "end_date_time": "YYYY-MM-DDTHH:MM" (add 3-4 hours after start time),
  "event_type": "${event_type}",
  "price": "0" (or a reasonable price if it's a ticketed event, no $, just number),
  "venue_name": "Appropriate venue name for ${city}, Texas",
  "city": "${city}",
  "venue_address": "Realistic ${city} venue address",
  "location_area": "Neighborhood/district in ${city}",
  "capacity": "Reasonable capacity number (50-500 depending on event type)",
  "image_url": "https://images.unsplash.com/photo-..." (find an appropriate Unsplash URL for this event type),
  "short_description": "Compelling 1-2 sentence teaser (max 150 chars)",
  "full_description": "3-4 paragraph detailed description with: what guests will experience, who should attend, what's included, and why it's special. Use professional, engaging language."
}

Rules:
- URL slug: lowercase, hyphens, no spaces or special characters
- Venue name: Use real ${city}, Texas venues when possible, or create realistic-sounding ones
- Descriptions: Professional, engaging, no clichés
- Image URL: Use Unsplash with appropriate search terms for the event type
- Keep ${event_type} events authentic to that category
- If fundraising/charity, mention a realistic cause
- For corporate events, emphasize networking and professional development
- For social events, emphasize experience and community
- Ensure JSON is valid and properly escaped

Return ONLY the JSON object, nothing else.`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error('Failed to generate event with Claude API');
    }

    const claudeResponse = await response.json();
    const generatedText = claudeResponse.content[0].text.trim();

    // Parse the JSON response
    let eventData;
    try {
      // Remove markdown code blocks if present
      let jsonText = generatedText;
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }

      eventData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', generatedText);
      throw new Error('Invalid JSON response from AI');
    }

    return new Response(
      JSON.stringify(eventData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
