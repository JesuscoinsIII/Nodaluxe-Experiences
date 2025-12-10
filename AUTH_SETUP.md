# Authentication Setup Guide

This guide will help you set up Supabase authentication for the admin panel.

## Overview

The admin panel now has authentication protection:
- Login page at `/login.html`
- Protected admin panel at `/admin-events.html`
- Logout functionality
- Magic link (passwordless) login option
- Password reset functionality

## Step 1: Enable Email Authentication in Supabase

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/providers

2. **Enable Email Provider:**
   - Click on "Email" provider
   - Toggle "Enable Email provider" to ON
   - Toggle "Confirm email" to OFF (for easier testing, turn ON for production)
   - Click "Save"

## Step 2: Configure Site URL

1. **Go to Authentication Settings:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/url-configuration

2. **Set Site URL:**
   - Site URL: `https://nodaluxe.netlify.app`
   - Click "Save"

3. **Add Redirect URLs:**
   Add these URLs to the "Redirect URLs" list:
   - `https://nodaluxe.netlify.app/admin-events.html`
   - `https://nodaluxe.netlify.app/login.html`
   - `http://localhost:8080/admin-events.html` (for local testing)
   - `http://localhost:8080/login.html` (for local testing)

## Step 3: Create Admin User

### Option A: Via Supabase Dashboard

1. **Go to Authentication → Users:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/users

2. **Click "Add User"**

3. **Fill in details:**
   - Email: `admin@nodaluxe.com` (or your email)
   - Password: Create a strong password
   - Auto Confirm User: Check this box
   - Click "Create User"

### Option B: Via Sign-Up Page (Coming Soon)

You can create a signup page or use the login page temporarily to create accounts.

## Step 4: Test Authentication

1. **Visit login page:**
   https://nodaluxe.netlify.app/login.html

2. **Try logging in:**
   - Enter your admin email and password
   - Click "Sign In"
   - Should redirect to admin panel

3. **Test Magic Link:**
   - Enter your email
   - Click "Sign in with Magic Link"
   - Check your email for the magic link
   - Click the link to login

4. **Test Logout:**
   - Click "Logout" button in admin panel
   - Should redirect to login page

## Step 5: Configure Email Templates (Optional)

1. **Go to Email Templates:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/templates

2. **Customize these templates:**
   - **Confirm signup** - Email sent to verify account
   - **Magic Link** - Passwordless login email
   - **Reset Password** - Password reset email

3. **Example customization:**
   - Update the "From" name to "Nodaluxe Experiences"
   - Customize the email content with your branding
   - Add your logo (optional)

## Security Best Practices

### For Production:

1. **Enable Email Confirmation:**
   - Go to Auth → Providers → Email
   - Turn ON "Confirm email"
   - Users must verify email before accessing admin

2. **Enable Row Level Security (RLS):**
   The database already has RLS policies, but you should update them to check for authenticated users:

   ```sql
   -- Update events table policies
   DROP POLICY IF EXISTS "Allow public insert to events" ON events;

   -- Only authenticated users can insert events
   CREATE POLICY "Allow authenticated insert to events"
   ON events FOR INSERT
   TO authenticated
   WITH CHECK (true);

   -- Only authenticated users can update events
   CREATE POLICY "Allow authenticated update to events"
   ON events FOR UPDATE
   TO authenticated
   USING (true);

   -- Only authenticated users can delete events
   CREATE POLICY "Allow authenticated delete to events"
   ON events FOR DELETE
   TO authenticated
   USING (true);
   ```

   Run this SQL in the Supabase SQL Editor:
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/sql/new

3. **Enable Rate Limiting:**
   - Supabase automatically rate limits authentication attempts
   - Default: 60 requests per hour per IP
   - Can be adjusted in Auth settings

4. **Use Strong Passwords:**
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, special characters
   - Consider using a password manager

## Temporary Bypass (Development Only)

If you need to bypass authentication temporarily for development:

1. **Edit admin-events.html:**
   - Find the `checkAuth()` function
   - Comment out the redirect line:
     ```javascript
     if (error || !session) {
       // window.location.href = '/login.html';  // Commented out
       return;
     }
     ```

2. **WARNING:** Never deploy with authentication bypass enabled!

## Troubleshooting

### Can't Login - "Invalid email or password"
- Verify the user exists in Auth → Users
- Check that email is confirmed (auto-confirm for testing)
- Try resetting password

### Magic Link Not Working
- Check spam/junk folder
- Verify email templates are configured
- Check that Site URL is correct in settings

### Redirect Loop After Login
- Clear browser cache and cookies
- Verify Redirect URLs are configured correctly
- Check browser console for errors

### "User already exists" Error
- User may have signed up but not confirmed email
- Delete the user in Auth → Users and create again
- Or send a password reset email to set password

## User Management

### Add More Admin Users

Repeat Step 3 for each admin user you want to add.

### Remove Admin Access

1. Go to Auth → Users
2. Find the user
3. Click the "..." menu
4. Select "Delete user"

### Reset User Password

1. Go to Auth → Users
2. Find the user
3. Click the "..." menu
4. Select "Send password reset email"

## File Structure

```
/
├── login.html              # Login page
├── admin-events.html       # Protected admin panel
├── events.html            # Public events page (no auth required)
└── AUTH_SETUP.md          # This guide
```

## Next Steps

1. ✅ Enable email authentication in Supabase
2. ✅ Create admin user account
3. ✅ Test login functionality
4. ✅ Update RLS policies for production
5. ⚙️ Customize email templates (optional)
6. ⚙️ Enable email confirmation (for production)

## Support

For issues with authentication:
- Check Supabase Auth logs: https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/logs/auth-logs
- Review Supabase Auth documentation: https://supabase.com/docs/guides/auth
- Contact: info@nodaluxe.com

---

**Important:** The authentication system is now active. Make sure to create your admin account before deploying to production!
