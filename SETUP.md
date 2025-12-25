# Setup Guide

## Database Setup

### Step 1: Complete Database Push

The database push command is waiting for your input. When prompted about the `role` enum, select:
- **`+ role` (create enum)** - This will create a new role enum

After selecting, the schema will be pushed to your Neon database.

### Step 2: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (Neon)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here-min-32-characters
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Phone Authentication (Twilio WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_SENDER_NAME=Your App Name
EMAIL_SENDER_ADDRESS=noreply@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** to your `.env` file

### Step 4: Twilio WhatsApp Setup (Required for Phone Authentication)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the Twilio Console Dashboard
3. **For Testing (Recommended):**
   - Go to [Twilio WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/sandbox)
   - Join the sandbox by sending the join code to `+1 415 523 8886` via WhatsApp
   - Use the sandbox number: `whatsapp:+14155238886`
4. **For Production:**
   - Get a verified WhatsApp Business API number from Twilio
   - Use your verified number in format: `whatsapp:+1234567890`
5. Create a Content Template in Twilio (for WhatsApp):
   - Go to [Twilio Content Templates](https://console.twilio.com/us1/develop/sms/content-templates)
   - Create a new template with variable `{{1}}` for the OTP code
   - Example template: "Your login code is: {{1}}. This code will expire in 10 minutes."
   - Copy the Content SID (starts with `HX...`)

6. Add credentials to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   TWILIO_CONTENT_SID=HX229f5a04fd0510ce1b071852155d3e75
   ```
   
   **Note:** If `TWILIO_CONTENT_SID` is not set, the code will fallback to plain text, which may not work for all WhatsApp configurations.

**Important:** 
- The WhatsApp number MUST start with `whatsapp:` prefix
- For sandbox testing, recipients must join the sandbox first
- Make sure the number is correctly configured in your Twilio Console

### Step 5: Resend Email Setup (Optional for now)

1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add it to `.env`

**Note:** Email functionality will work once you add the Resend API key. For testing, you can skip this initially.

## Database Schema

The following tables have been created:

- **user** - User accounts (with email and phone support)
- **session** - User sessions
- **account** - OAuth accounts (Google, etc.)
- **verification** - Email verification tokens
- **otp** - Phone OTP codes for WhatsApp authentication
- **organization** - Organizations/teams
- **member** - Organization members with roles
- **invitation** - Organization invitations

## Features Implemented

✅ **Email/Password Authentication**
- Sign up with email and password
- Login with email and password
- Email verification (requires Resend setup)
- Password reset (requires Resend setup)

✅ **Google OAuth Authentication**
- Sign up with Google
- Login with Google
- Automatic account creation

✅ **Phone Number Authentication (WhatsApp OTP)**
- Sign up with phone number (+92 format for Pakistan)
- Login with phone number
- OTP verification via WhatsApp
- Rate limiting (3 requests per hour)
- OTP expiration (10 minutes)
- Automatic account creation on first login

✅ **User Management**
- User profiles
- Session management
- Organization support

## Testing

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000/login`
3. Try signing up with email/password or Google
4. Check your database using Drizzle Studio: `npm run db:studio`

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is running
- Check if SSL mode is required

### Google OAuth Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Check redirect URI matches exactly
- Ensure OAuth consent screen is configured

### Phone OTP Not Working
- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set
- Check `TWILIO_WHATSAPP_NUMBER` format is correct (must start with `whatsapp:`)
- Ensure phone numbers are in Pakistani format (+92XXXXXXXXXX)
- Check Twilio console for API errors
- Verify WhatsApp Sandbox is set up or you have a verified WhatsApp Business number

### Email Not Sending
- Verify `RESEND_API_KEY` is set
- Check `EMAIL_SENDER_ADDRESS` is verified in Resend
- Review Resend dashboard for errors

