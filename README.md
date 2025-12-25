# 🍪 ROOKIES Bakery - Freshly Baked Happiness

<div align="center">

![ROOKIES Bakery](https://img.shields.io/badge/ROOKIES-Bakery-pink?style=for-the-badge&logo=cookie&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

**A modern, beautiful bakery web application inspired by Crumbl Cookies, built with Next.js and cutting-edge technologies.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🛒 Shopping Experience
- **Beautiful Hero Section** - Animated, colorful landing page with product carousel
- **Product Catalog** - Browse cookies, cakes, cupcakes, shakes, breads, and more
- **Smart Cart System** - Persistent cart with real-time sync
- **Guest Checkout** - Order without creating an account
- **Order Type Selection** - Choose between home delivery or store pickup
- **Order Confirmation** - Screenshot-friendly order confirmation page

### 🔐 Authentication & User Management
- **Multiple Login Methods** - Email/Password, Google OAuth, and Phone OTP
- **Email Verification** - Secure account verification via Resend
- **Password Reset** - Forgot password functionality
- **User Profiles** - View order history and manage account settings
- **Session Management** - Persistent sessions with Better Auth

### 👨‍💼 Admin Panel
- **Dashboard** - Sales analytics, inventory management, and POS system
- **Product Management** - Add, edit, and manage products with images
- **Order Management** - Track and process customer orders
- **Admin Authentication** - Secure admin login with role-based access
- **Accounting** - Financial tracking and reporting

### 🎨 UI/UX
- **Modern Design** - Crumbl Cookies-inspired aesthetic
- **Responsive Layout** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Beautiful transitions and micro-interactions
- **PWA Support** - Progressive Web App capabilities
- **Dark/Light Mode Ready** - Theme support infrastructure

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **Framer Motion** - Animation library (where used)

### Backend
- **Better Auth** - Modern authentication library
- **Drizzle ORM** - Type-safe database ORM
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Next.js API Routes** - Serverless API endpoints

### Services & Integrations
- **Google OAuth** - Social authentication
- **Resend** - Email delivery service
- **Twilio** - SMS/OTP verification
- **Cloudinary** - Image storage and optimization

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Drizzle Studio** - Database GUI

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL Database** (Neon recommended)
- **Google OAuth Credentials** (for Google sign-in)
- **Resend Account** (for email verification)
- **Twilio Account** (optional, for phone OTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rookies.git
   cd rookies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # Better Auth
   BETTER_AUTH_SECRET=your_secret_key_min_32_chars
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_SENDER_NAME=ROOKIES Bakery
   EMAIL_SENDER_ADDRESS=noreply@yourdomain.com
   
   # Twilio (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed with sample data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

> _Screenshots coming soon!_

---

## 📁 Project Structure

```
rookies/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin API endpoints
│   │   └── orders/        # Order API endpoints
│   ├── admin/             # Admin panel pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── login/             # Login page
│   ├── shop/              # Product catalog
│   └── ...                # Other pages
├── components/             # React components
│   ├── admin/             # Admin components
│   ├── cart/              # Cart components
│   ├── forms/             # Form components
│   ├── shop/              # Shop components
│   ├── ui/                # UI primitives
│   └── users/             # User-facing components
├── contexts/              # React contexts
│   ├── CartContext.tsx    # Cart state management
│   └── SessionContext.tsx # Session management
├── db/                     # Database files
│   ├── schema.ts          # Drizzle schema
│   └── drizzle.ts         # Database connection
├── lib/                    # Utility libraries
│   ├── auth.ts            # Better Auth configuration
│   ├── auth-client.ts     # Client-side auth
│   └── ...                # Other utilities
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
└── server/                 # Server actions
    ├── orders.ts          # Order operations
    ├── products.ts        # Product operations
    └── ...                # Other server actions
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate migration files
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env` file

---

## 🎯 Key Features Explained

### Guest Checkout
Users can place orders without creating an account. Guest information (name, email, phone) is stored with the order and can be linked to a user account if they sign up later.

### Order Type Selection
Before checkout, users choose between:
- **Home Delivery** - Delivered to your address
- **Store Pickup** - Pick up from the bakery

### PWA Support
The app is configured as a Progressive Web App, allowing users to install it on their devices for a native app-like experience.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Design inspiration from [Crumbl Cookies](https://crumblcookies.com/)
- Built with [Next.js](https://nextjs.org/)
- Authentication by [Better Auth](https://www.better-auth.com/)
- Database powered by [Neon](https://neon.tech/)

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Made with ❤️ and lots of 🍪**

[⭐ Star this repo](https://github.com/yourusername/rookies) if you find it helpful!

</div>
