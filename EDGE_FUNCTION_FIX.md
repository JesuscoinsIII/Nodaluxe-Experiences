# Edge Function Fix Guide

## Problem
The Edge Function is returning "Hello undefined!" instead of generating events with AI. This means the function has default template code instead of the actual AI generation code.

## Solution

### Step 1: Go to Edge Functions Dashboard
Visit: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions

### Step 2: Find the `generate-event` Function
- If you see a function called `generate-event`, click on it
- If you don't see it, click "Deploy new function" and name it `generate-event`

### Step 3: Update the Function Code

1. Click on the function name to edit it
2. Make sure the filename is `index.ts` (not file2.ts or anything else)
3. **Delete all existing code** in the editor
4. **Copy the entire code below** and paste it into the editor

```typescript
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
```

### Step 4: Set the Anthropic API Key

1. Go to: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
2. Click "Manage secrets"
3. Look for `ANTHROPIC_API_KEY`
   - If it exists, verify it's correct
   - If it doesn't exist, add it:
     - Name: `ANTHROPIC_API_KEY`
     - Value: `[Your Anthropic API key from earlier message]`

### Step 5: Deploy/Save the Function

1. Click "Deploy" or "Save" button
2. Wait for deployment to complete (should take 10-30 seconds)

### Step 6: Test the Function

Run this command in terminal to test:

```bash
curl -X POST "https://fdezwoglwhbkhzhmnxxv.supabase.co/functions/v1/generate-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZXp3b2dsd2hia2h6aG1ueHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODYzMDksImV4cCI6MjA4MDc2MjMwOX0.JlOALehErZF_Ret4XokYWovch6K6fVvRiaj3DKtBLHs" \
  -d '{
    "event_name": "Test Event",
    "city": "Austin",
    "event_date": "2025-03-15",
    "event_type": "corporate"
  }'
```

**Expected Response**: Should return a JSON object with event details (event_title, venue_name, description, etc.)

**If you get an error**: Check the function logs in Supabase Dashboard under Edge Functions → generate-event → Logs

## Troubleshooting

### Error: "Missing ANTHROPIC_API_KEY"
- Go back to Step 4 and add the API key secret

### Error: "Failed to generate event with Claude API"
- Verify the API key is correct
- Check that you have credits in your Anthropic account

### Still returning "Hello undefined!"
- Make sure you replaced ALL the code in the editor
- Verify the filename is `index.ts`
- Try deleting the function and creating a new one

## Quick Links

- **Edge Functions Dashboard**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/functions
- **Function Secrets**: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/settings/functions
- **Admin Panel**: https://nodaluxe.netlify.app/admin-events.html
