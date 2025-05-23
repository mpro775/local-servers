﻿# local-servers
# Local Services Marketplace

A full-stack web application enabling users to discover, book, and review local service providers. Built using modern web technologies, the platform supports real-time booking updates, secure payments via Stripe, user authentication with Firebase, and a robust admin/provider management dashboard.

## 🔧 Tech Stack

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Apollo Client**
- **React Context API**
- **Google Maps API** (Address autocomplete, map display)

### Backend
- **Node.js**
- **Apollo Server (GraphQL)**
- **MongoDB + Mongoose**
- **Firebase Auth** (Email/Password login, reset password)
- **Stripe API** (Real payment integration)
- **Cloudinary / AWS S3** (Image uploads)
- **GraphQL Subscriptions** (Real-time updates)

## 📂 Project Structure

```
local-services-marketplace/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── graphql/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── server.ts
│   │   └── types.ts
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
```

## 🚀 Features

### Users
- Browse services by category, location, price, and rating
- Book services and view booking status
- Rate and review after completing payment
- Password reset via Firebase

### Providers
- Manage service listings (CRUD)
- Accept/reject/completed bookings
- View earnings and service statistics
- Real-time booking status updates

### Admin
- Manage users and providers
- Manage categories
- Monitor all services and bookings

## 💳 Stripe Payment Integration
- Secure checkout using Stripe
- PaymentIntent workflow
- Webhook support to confirm successful payments

## 📡 Real-time Features
- GraphQL Subscriptions notify providers of booking status changes

## 🗂 Environment Setup

### Backend
Create `.env` file in `/backend`:
```
MONGODB_URI=
JWT_SECRET=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
CLOUDINARY_URL=
STRIPE_SECRET_KEY=
FIREBASE_CONFIG={...}
```
Run backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend
Create `.env.local` in `/frontend`:
```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:5000/graphql
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
FIREBASE_CONFIG={...}
```
Run frontend:
```bash
cd frontend
npm install
npm run dev
```

## 📦 Deployment
- Frontend: Vercel / Netlify
- Backend: Heroku / AWS Elastic Beanstalk

## 📘 License
This project is licensed for demo or client proposal use. Contact the project owner for commercial usage terms.

---

Built with ❤️ by [Muhammed Murad / Smart Agency]

