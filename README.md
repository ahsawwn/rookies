# Rookies - Crumbl Cookies Clone

A modern Next.js application with authentication, built with Better Auth, Drizzle ORM, and Neon Database.

## Tech Stack

- **Framework**: Next.js 16.1.1
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon database account (or any PostgreSQL database)
- Google OAuth credentials (for Google sign-in)
- Resend account (for email verification)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - Your Neon database connection string
- `BETTER_AUTH_SECRET` - A random secret key (min 32 characters)
- `BETTER_AUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `RESEND_API_KEY` - Resend API key for emails
- `EMAIL_SENDER_NAME` - Name for email sender
- `EMAIL_SENDER_ADDRESS` - Email address for sending emails
- `NEXT_PUBLIC_APP_URL` - Public URL of your app

3. Set up the database:

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed the database with sample data

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret to your `.env` file

## Features

- ✅ User authentication (Email/Password & Google OAuth)
- ✅ Email verification
- ✅ Password reset
- ✅ Organization management
- ✅ Role-based access control
- ✅ Beautiful animated UI
- ✅ Responsive design

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/             # React components
│   ├── forms/             # Form components
│   ├── ui/                # UI components
│   └── users/             # User-facing components
├── db/                     # Database files
│   ├── schema.ts          # Drizzle schema
│   └── drizzle.ts          # Database connection
├── lib/                    # Utility libraries
│   ├── auth.ts            # Better Auth configuration
│   └── auth-client.ts     # Client-side auth
└── server/                 # Server actions
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon Database](https://neon.tech/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Make sure to set all environment variables in your Vercel project settings.
