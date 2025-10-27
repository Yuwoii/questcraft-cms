# QuestCraft Content Management System

## 🎯 Overview

Professional CMS for managing QuestCraft rewards with collections, tags, and auto-sync to iOS app.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres (Free tier: 256 MB)
- **Auth**: NextAuth.js with Google OAuth
- **Storage**: Google Drive API
- **Deployment**: Vercel (Free tier)

## 💰 Cost: $0/month

- Vercel Free Tier: Unlimited hobby projects
- Vercel Postgres: 256 MB free
- Google Drive: 15 GB free
- No credit card required!

## 🚀 Quick Start

See SETUP_GUIDE.md for detailed instructions.

## 📁 Project Structure

```
questcraft-cms/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Admin dashboard
│   ├── collections/       # Collection management
│   └── rewards/           # Reward management
├── components/            # React components
├── lib/                   # Utilities & helpers
├── public/               # Static assets
└── prisma/               # Database schema
```

## 🔐 Security

Single-user system with Google OAuth authentication.
No public access - admin only.

