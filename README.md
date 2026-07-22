# VELBERS - Premium Ecommerce Platform

## 🏪 Project Overview

VELBERS is a premium, luxury ecommerce platform for high-end shoes built with modern technologies. Inspired by Apple, Nike, and Allbirds, it delivers a billion-dollar brand experience.

**Brand**: VELBERS  
**Industry**: Premium Shoes  
**Market**: India  
**Target Audience**: Indian Customers  

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Shadcn UI** - Component library
- **Lucide Icons** - Icon system
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Redux Toolkit** - State management
- **TanStack Query** - Data fetching
- **Axios** - HTTP client
- **Next SEO** - SEO optimization

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma ORM** - Database client
- **Redis** - Caching & sessions
- **JWT** - Authentication
- **Helmet** - Security
- **Rate Limiting** - Protection
- **CORS** - Cross-origin requests
- **Morgan** - Logging
- **Compression** - Response compression

## 📁 Project Structure

```
velbers/
├── frontend/                 # Next.js application
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── store/              # Redux store
│   ├── styles/             # Global styles
│   └── public/             # Static assets
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database layer
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── validators/     # Input validation
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   └── prisma/             # Database schema
├── docker/                  # Docker configuration
├── docs/                    # Documentation
└── .github/                 # GitHub Actions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/mdfaheemsiddiqui786526/adk-docs.git
cd adk-docs
git checkout velbers-ecommerce
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Update .env.local with API URL
npm run dev
```

### Docker Setup
```bash
docker-compose up -d
```

## 🎨 Design System

### Color Palette
- **Primary**: #000000 (Black)
- **Secondary**: #FFFFFF (White)
- **Accent**: #D4AF37 (Gold)
- **Dark Background**: #0F0F0F
- **Light Background**: #FAFAFA

### Typography
- **Headlines**: Inter Bold
- **Body**: Inter Regular
- **Mono**: Fira Code

### Spacing
- Base unit: 4px
- Padding: 4px, 8px, 12px, 16px, 24px, 32px, 48px
- Margins: Same as padding

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px
- Full: 50%

## 📚 API Documentation

See `docs/API.md` for complete API documentation.

### Base URL
```
https://api.velbers.com/v1
```

### Authentication
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## 🔐 Security

- ✅ JWT Authentication
- ✅ Refresh Token Rotation
- ✅ Rate Limiting (100 requests/minute)
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Input Validation (Zod)
- ✅ SQL Injection Protection (Prisma ORM)
- ✅ XSS Protection
- ✅ Password Hashing (bcrypt)
- ✅ Audit Logs

## 📊 Features

### Core Features
- ✅ User Authentication (Email, Google, OTP)
- ✅ Product Catalog
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ Checkout
- ✅ Order Management
- ✅ Payment Processing (Razorpay, Stripe, PayPal)
- ✅ Product Reviews & Ratings
- ✅ Search & Filters
- ✅ Address Management

### Admin Features
- ✅ Dashboard Analytics
- ✅ Product Management
- ✅ Order Management
- ✅ Customer Management
- ✅ Coupon Management
- ✅ Inventory Management
- ✅ Banner Management
- ✅ Review Management
- ✅ Activity Logs

## 🏃 Performance

- ✅ Image Optimization (Next.js Image)
- ✅ Lazy Loading
- ✅ Code Splitting
- ✅ Server-Side Rendering
- ✅ Incremental Static Regeneration
- ✅ Redis Caching
- ✅ Response Compression
- ✅ Core Web Vitals Optimized

## 📱 Responsive Design

- ✅ Mobile First
- ✅ Tablet Optimized
- ✅ Desktop Optimized
- ✅ Dark Mode
- ✅ Light Mode

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 🚢 Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

### Supported Platforms
- Vercel (Frontend)
- Railway (Backend)
- AWS RDS (Database)
- AWS S3 (File Storage)

## 📧 Support

For issues and support, please contact: support@velbers.com

## 📄 License

MIT License - See LICENSE file

## 👥 Contributors

- Design & Architecture: Senior Engineers
- Development: Full Stack Team

---

**Last Updated**: July 2026
