# Generate Event Edge Function

This Supabase Edge Function uses the Claude API to automatically generate comprehensive event details from minimal input.

## Setup

### 1. Set the Anthropic API Key

You need to add your Anthropic API key as a Supabase secret:

```bash
# Using Supabase CLI
supabase secrets set ANTHROPIC_API_KEY=your-api-key-here

# Or via Supabase Dashboard:
# Settings → Edge Functions → Manage secrets
```

### 2. Deploy the Function

```bash
# Deploy using Supabase CLI
supabase functions deploy generate-event

# Test the function
supabase functions invoke generate-event --data '{
  "event_name": "Austin Tech Mixer",
  "city": "Austin",
  "event_date": "2025-02-15",
  "event_type": "corporate"
}'
```

## How It Works

1. **Input**: Accepts minimal event details (name, city, date, type)
2. **AI Generation**: Sends a structured prompt to Claude API
3. **Output**: Returns comprehensive event data in JSON format

## Input Format

```json
{
  "event_name": "Austin Tech Networking Mixer",
  "city": "Austin",
  "event_date": "2025-02-15",
  "event_type": "corporate"
}
```

## Output Format

```json
{
  "event_title": "Austin Tech Networking Mixer 2025",
  "url_slug": "austin-tech-networking-mixer-2025",
  "event_date_time": "2025-02-15T18:00",
  "end_date_time": "2025-02-15T22:00",
  "event_type": "corporate",
  "price": "0",
  "venue_name": "The Concourse Project",
  "city": "Austin",
  "venue_address": "8509 Burleson Rd",
  "location_area": "East Austin",
  "capacity": "150",
  "image_url": "https://images.unsplash.com/photo-...",
  "short_description": "Evening networking for Austin tech professionals",
  "full_description": "Join us for an evening of networking..."
}
```

## Usage in Admin Panel

The admin panel (`admin-events.html`) includes an AI Assistant section that:
1. Collects minimal event details
2. Calls this Edge Function
3. Auto-populates the full event form
4. Allows manual review/editing before saving

## Error Handling

The function handles:
- Missing required fields
- Claude API errors
- JSON parsing errors
- CORS preflight requests

## Cost Considerations

- Each AI generation uses Claude Sonnet 4
- Estimated cost: ~$0.003-0.015 per generation
- Budget accordingly based on usage

## Troubleshooting

### Function not found
```bash
# Check deployed functions
supabase functions list

# Redeploy if needed
supabase functions deploy generate-event
```

### API Key issues
```bash
# Verify secrets
supabase secrets list

# Update if needed
supabase secrets set ANTHROPIC_API_KEY=your-new-key
```

### CORS errors
- Ensure corsHeaders are set correctly
- Check Supabase project settings

## Model Information

- **Model**: `claude-sonnet-4-20250514`
- **Max Tokens**: 2048
- **API Version**: 2023-06-01

## Local Development

```bash
# Serve functions locally
supabase functions serve

# Test locally
curl -X POST http://localhost:54321/functions/v1/generate-event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "event_name": "Test Event",
    "city": "Austin",
    "event_date": "2025-03-01",
    "event_type": "social"
  }'
```

## Security

- API key stored as Supabase secret (not in code)
- CORS headers allow frontend access
- Function only accessible with valid Supabase auth
- No sensitive data in responses

## Support

For issues or questions:
- Check Supabase function logs
- Review Claude API documentation
- Contact: info@nodaluxe.com
