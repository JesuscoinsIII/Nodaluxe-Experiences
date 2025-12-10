# Fix Redirect URL Issue

## Problem

When you click the magic link or signup confirmation link, you're being redirected to:
```
http://localhost:3000/#access_token=...
```

Instead of your production URL:
```
https://nodaluxe.netlify.app/admin-events.html
```

## Solution

You need to update the Site URL and Redirect URLs in Supabase.

### Step 1: Update Site URL

1. **Go to Supabase Authentication Settings:**
   https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/url-configuration

2. **Update Site URL:**
   - Change from: `http://localhost:3000`
   - Change to: `https://nodaluxe.netlify.app`
   - Click **Save**

### Step 2: Add Redirect URLs

In the same page, under "Redirect URLs", add these:

```
https://nodaluxe.netlify.app/admin-events.html
https://nodaluxe.netlify.app/login.html
https://nodaluxe.netlify.app/signup.html
https://nodaluxe.netlify.app/
```

**For local testing, also add:**
```
http://localhost:8080/admin-events.html
http://localhost:8080/login.html
http://localhost:8080/signup.html
http://localhost:3000/admin-events.html
http://localhost:3000/login.html
http://localhost:3000/signup.html
```

Click **Save** after adding each URL.

### Step 3: Test the Fix

1. **Go to login page:**
   https://nodaluxe.netlify.app/login.html

2. **Click "Sign in with Magic Link"**
   - Enter your email
   - Check your email for the link
   - Click the link
   - Should redirect to: https://nodaluxe.netlify.app/admin-events.html

3. **Try signing up:**
   - Go to: https://nodaluxe.netlify.app/signup.html
   - Enter your email
   - Check your email for confirmation
   - Click the link
   - Should redirect to admin panel

## Quick Link

**Authentication URL Configuration:**
https://supabase.com/dashboard/project/fdezwoglwhbkhzhmnxxv/auth/url-configuration
