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
- **Product Details** - Detailed product pages with image galleries
- **Smart Cart System** - Persistent cart with real-time sync across sessions
- **Menu Page** - Dedicated menu browsing experience
- **Weekly Products** - Special weekly product highlights
- **Featured Products** - Curated product showcases
- **Search Functionality** - Quick product search and filtering
- **Guest Checkout** - Order without creating an account
- **Order Type Selection** - Choose between home delivery or store pickup
- **Payment Options** - QR code payment and screenshot upload
- **Order Confirmation** - Screenshot-friendly order confirmation page
- **Order History** - View past orders in user profile

### 🔐 Authentication & User Management
- **Multiple Login Methods** - Email/Password, Google OAuth, and Phone OTP
- **Email Verification** - Secure account verification via Resend
- **Password Reset** - Forgot password functionality with email links
- **User Profiles** - Comprehensive profile management with tabs
- **Order History** - Complete order tracking and details
- **Account Settings** - Manage personal information and preferences
- **Session Management** - Persistent sessions with Better Auth
- **Organization Support** - Multi-tenant architecture with roles

### 👨‍💼 Admin Panel
- **Dashboard** - Sales analytics, inventory management, and real-time statistics
- **Product Management** - Full CRUD operations with Cloudinary image uploads
- **Weekly Products** - Manage special weekly product offerings
- **Order Management** - Track, filter, and process customer orders with detailed views
- **POS System** - Point of Sale interface with receipt printing
- **Inventory Management** - Stock tracking, adjustments, and low stock alerts
- **Purchase Orders** - Supplier purchase management and tracking
- **Accounting** - Financial transactions, reporting, and analytics
- **Testimonials Management** - Admin control for customer reviews
- **Email Center** - Email management and template system
- **Notifications System** - Real-time notifications with bell icon
- **Command Palette** - Quick navigation and action shortcuts
- **Admin Authentication** - Secure admin login with role-based access control

### 🎨 UI/UX
- **Modern Design** - Crumbl Cookies-inspired aesthetic with pink/rose theme
- **Responsive Layout** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Beautiful transitions and micro-interactions with Framer Motion
- **Component Library** - Comprehensive UI component system (Radix UI)
- **Loading States** - Skeleton loaders and spinners for better UX
- **Toast Notifications** - User-friendly feedback system
- **PWA Support** - Progressive Web App capabilities
- **Accessibility** - ARIA labels and keyboard navigation support

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

## 📊 Project Status

**Current Version:** 0.1.0  
**Status:** 🟢 Active Development  
**Completion:** ~90% Core Features

### Recent Updates
- ✅ Email Center with template management
- ✅ Testimonials management system
- ✅ Weekly products feature
- ✅ Notifications system with real-time updates
- ✅ Command palette for quick navigation
- ✅ Receipt printing functionality
- ✅ Enhanced checkout with payment options
- ✅ Improved admin dashboard with analytics

For detailed progress tracking, see [PROGRESS.md](./PROGRESS.md)

---

## 📸 Screenshots

> _Screenshots coming soon!_

---

## 📁 Project Structure

```
rookies/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── admin/                # Admin API endpoints
│   │   ├── orders/               # Order API endpoints
│   │   ├── email-center/         # Email management API
│   │   └── notifications/        # Notification API
│   ├── admin/                    # Admin panel pages
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── products/             # Product management
│   │   ├── orders/               # Order management
│   │   ├── pos/                  # Point of Sale
│   │   ├── inventory/            # Inventory management
│   │   ├── purchases/            # Purchase orders
│   │   ├── accounting/           # Financial management
│   │   ├── weekly-products/      # Weekly products
│   │   ├── testimonials/         # Testimonials management
│   │   ├── email-center/         # Email center
│   │   └── settings/             # Admin settings
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                  # Checkout page
│   ├── menu/                     # Menu browsing
│   ├── shop/                     # Product catalog
│   ├── profile/                  # User profile
│   └── ...                       # Other pages
├── components/                    # React components
│   ├── admin/                    # Admin components
│   │   ├── DashboardStats.tsx
│   │   ├── DataTable.tsx
│   │   ├── POSPageClient.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── NotificationBell.tsx
│   │   └── ...                   # Other admin components
│   ├── cart/                     # Cart components
│   ├── checkout/                 # Checkout components
│   ├── forms/                    # Form components
│   ├── shop/                     # Shop components
│   ├── ui/                       # UI primitives (Radix UI)
│   └── users/                    # User-facing components
├── contexts/                      # React contexts
│   ├── CartContext.tsx           # Cart state management
│   └── SessionContext.tsx        # Session management
├── db/                            # Database files
│   ├── schema.ts                 # Drizzle schema
│   └── drizzle.ts                # Database connection
├── lib/                           # Utility libraries
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth
│   ├── cloudinary.ts             # Image upload
│   ├── twilio.ts                 # SMS service
│   └── ...                       # Other utilities
├── server/                        # Server actions
│   ├── orders.ts                 # Order operations
│   ├── products.ts               # Product operations
│   ├── admin.ts                  # Admin operations
│   ├── testimonials.ts           # Testimonials operations
│   └── ...                       # Other server actions
├── scripts/                       # Utility scripts
│   ├── seed-products.ts          # Seed products
│   ├── seed-admin.ts             # Seed admin
│   └── ...                       # Other scripts
└── public/                        # Static assets
    ├── manifest.json             # PWA manifest
    └── sw.js                     # Service worker
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate migration files
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with sample data
npm run db:setup         # Push schema and seed in one command

# Data Management
npm run seed:products    # Seed products with sample data
npm run seed:admin       # Create default admin account
npm run download:images  # Download product images
npm run upload:images    # Upload images to Cloudinary
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

## 📚 Documentation

- **[PROGRESS.md](./PROGRESS.md)** - Detailed progress tracking and roadmap
- **[SETUP.md](./SETUP.md)** - Initial setup guide
- **[FINAL_SETUP.md](./FINAL_SETUP.md)** - Final setup instructions
- **[PWA_SETUP.md](./PWA_SETUP.md)** - PWA configuration guide
- **[product-images/README.md](./product-images/README.md)** - Image management guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use server components by default
- Add proper error handling
- Include loading states
- Write descriptive commit messages
- Update documentation as needed

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
