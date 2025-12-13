# Copilot Instructions for Nodaluxe-Experiences

## Repository Overview

Nodaluxe-Experiences is a comprehensive event management solution built to enhance Modal (a booking platform) integration and streamline the broader event ecosystem. The platform provides tools and integrations to simplify event creation, scheduling, and delivery for both event organizers and attendees.

## Technology Stack

### Frontend
- **HTML5**: Static pages for landing, events, bookings, admin, login, and signup
- **JavaScript**: Client-side interactivity and API integrations
- **Static Site Deployment**: Deployed on Netlify

### Backend & Services
- **Netlify Functions**: Serverless functions for backend logic (e.g., SMS sending)
- **Supabase**: Database and authentication backend
- **Node.js**: Runtime environment for scripts and functions

### Third-Party Integrations
- **Twilio**: SMS and voice communication for event updates and reminders
- **SendGrid**: Email delivery for notifications and marketing
- **Firebase**: Authentication and real-time data synchronization
- **Google Cloud**: Scalability and data management services
- **Modal**: Booking platform integration

### Deployment & Hosting
- **Netlify**: Primary hosting platform with automatic deployments
- **Vercel**: Alternative deployment option mentioned in documentation

## Key Files and Directories

### Main Application Files
- **index.html**: Main landing page
- **events.html**: Event listing and browsing
- **book-now.html**: Booking interface
- **admin-events.html**: Administrative event management
- **login.html** / **signup.html**: Authentication pages
- **investments.html**: Investment opportunities page
- **sponsorships.html**: Sponsorship information
- **privacy-policy.html**: Privacy policy page

### Backend & Functions
- **netlify/functions/**: Serverless functions directory
  - **send-sms.js**: Twilio SMS integration function
- **setup-database.js**: Database initialization script

### Configuration Files
- **netlify.toml**: Netlify deployment and security headers configuration
- **package.json**: Node.js dependencies and scripts
- **.env**: Environment variables (not tracked in git)

### Documentation
- **README.md**: Main project documentation
- **QUICK_SETUP.md**: Quick start guide
- **SETUP_INSTRUCTIONS.md**: Detailed setup instructions
- **DATABASE_SETUP.md** / **DATABASE_FIX.md**: Database configuration guides
- **TWILIO_SMS_SETUP.md** / **TWILIO_QUICK_SETUP.md**: Twilio integration guides
- **AUTH_SETUP.md** / **CREDENTIALS_SETUP.md**: Authentication configuration
- **RSVP_EMAIL_SETUP.md**: Email setup for RSVPs
- **SLACK_INTEGRATION.md**: Slack integration documentation
- **DNS_RECORD_GUIDE.md**: DNS configuration guide
- **REDIRECT_FIX.md** / **EDGE_FUNCTION_FIX.md**: Troubleshooting guides

## Development Guidelines

### Code Style
- Use consistent indentation (2 spaces for HTML/JavaScript)
- Keep functions focused and single-purpose
- Use descriptive variable and function names
- Add comments for complex logic or integrations

### Security Best Practices
- **Never commit secrets or API keys** to the repository
- All sensitive credentials should be in `.env` files (already gitignored)
- Use environment variables for all third-party service credentials:
  - `GOOGLE_CLOUD_KEY_FILE`
  - `FIREBASE_API_KEY`
  - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`
  - `SENDGRID_API_KEY`
  - `MODAL_API_KEY`
- Security headers are configured in `netlify.toml` (X-Frame-Options, X-XSS-Protection)

### Testing
- Test Netlify functions locally before deployment
- Verify integrations (Twilio, SendGrid, Firebase) with test credentials
- Check responsive design across different screen sizes
- Validate forms and user inputs

### Deployment Workflow
1. Push changes to the repository
2. Netlify automatically builds and deploys
3. Monitor deployment status via Netlify dashboard
4. Verify functionality in production environment

## Common Tasks

### Adding a New Page
1. Create new `.html` file in the root directory
2. Follow existing page structure for consistency
3. Link to common styles and scripts
4. Update navigation in other pages if needed

### Adding a New Netlify Function
1. Create new `.js` file in `netlify/functions/` directory
2. Export a handler function: `exports.handler = async (event, context) => { ... }`
3. Test locally with Netlify CLI: `netlify dev`
4. Deploy by pushing to repository

### Updating Database Schema
1. Review `DATABASE_SETUP.md` for current schema
2. Use `setup-database.js` script for migrations
3. Update related documentation
4. Test with Supabase CLI or dashboard

### Configuring Third-Party Services
- **Twilio**: Follow `TWILIO_SMS_SETUP.md` or `TWILIO_QUICK_SETUP.md`
- **Email**: Follow `RSVP_EMAIL_SETUP.md` for SendGrid configuration
- **Authentication**: Follow `AUTH_SETUP.md` and `CREDENTIALS_SETUP.md`
- **Slack**: Follow `SLACK_INTEGRATION.md` for webhook setup

## Dependencies

### Production Dependencies
- `node-fetch@^2.6.7`: HTTP client for API requests

### Development Dependencies
- `supabase@^2.65.7`: Supabase CLI for database management

## Important Notes

- The project uses Netlify as the primary hosting platform; Vercel is mentioned in documentation as an alternative deployment option
- Static HTML files suggest a simple, performant architecture
- Heavy reliance on serverless functions for backend logic
- Multiple integration points require careful credential management
- Documentation is comprehensive - always update relevant docs when making changes

## Contact

For questions or support, contact: info@nodaluxe.com

## License

This project is licensed under the MIT License. Copyright (c) 2025 Jesuscoins Nodaluxe Experiences, LLC
