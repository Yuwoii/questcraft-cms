📄 Vercel Deployment Documentation

Here's a complete markdown file documenting the Vercel deployment setup:



File: VERCEL_DEPLOYMENT.md

Create this file in the root of your QuestCraft-CMS project:

# QuestCraft CMS - Vercel Deployment Guide

## 🚀 Overview

The QuestCraft CMS is now deployed on Vercel for production use, replacing the previous local development setup. This document outlines the deployment configuration, environment setup, and operational procedures.

---

## 📍 Deployment Information

### Production URL
- **Live URL:** `https://your-project.vercel.app` (replace with actual URL)
- **Dashboard:** [Vercel Dashboard](https://vercel.com/dashboard)

### Git Integration
- **Repository:** Connected to GitHub/GitLab repository
- **Branch:** `main` (auto-deploys on push)
- **Preview Deployments:** Enabled for pull requests

---

## 🔧 Environment Configuration

### Required Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

#### Database
```bash
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

NextAuth

NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

Google OAuth

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

Google Drive API

GOOGLE_DRIVE_CLIENT_ID="your-drive-client-id"
GOOGLE_DRIVE_CLIENT_SECRET="your-drive-client-secret"
GOOGLE_DRIVE_REDIRECT_URI="https://your-project.vercel.app/api/auth/callback/google"
GOOGLE_DRIVE_REFRESH_TOKEN="your-refresh-token"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id"



🗄️ Database Setup

PostgreSQL on Vercel Postgres





Create Database:





Go to Vercel Dashboard → Storage → Create Database



Select "Postgres"



Choose region closest to your users



Connect to Project:





Vercel automatically adds DATABASE_URL to environment variables



Connection string includes SSL by default



Run Migrations:

# From local machine with Vercel CLI
vercel env pull .env.local
npx prisma db push
npx prisma generate

Alternative: External PostgreSQL

If using external provider (Supabase, Railway, etc.):





Add connection string to DATABASE_URL environment variable



Ensure SSL is enabled: ?sslmode=require



🔐 Authentication Setup

Google OAuth Configuration





Google Cloud Console:





Go to Google Cloud Console



Navigate to APIs & Services → Credentials



Edit OAuth 2.0 Client



Authorized Redirect URIs:
Add these URLs:

https://your-project.vercel.app/api/auth/callback/google
https://your-project-*.vercel.app/api/auth/callback/google



Authorized JavaScript Origins:

https://your-project.vercel.app
https://your-project-*.vercel.app



📦 Build Configuration

Vercel Settings

Build Command:

npm run build

Output Directory:

.next

Install Command:

npm install

Development Command:

npm run dev

Build Environment Variables

Ensure these are set for Production, Preview, and Development environments:





All database credentials



All OAuth credentials



All API keys



🚀 Deployment Process

Automatic Deployments





Push to Main Branch:

git add .
git commit -m "Your changes"
git push origin main



Vercel Auto-Deploys:





Build starts automatically



Preview URL available during build



Production URL updates on success

Manual Deployments

Using Vercel CLI:

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel



🔄 Database Migrations

Running Migrations on Vercel

Option 1: Local with Production DB

# Pull production environment variables
vercel env pull .env.production

# Run migration
npx prisma db push

# Generate client
npx prisma generate

Option 2: Vercel CLI

# Run command in Vercel environment
vercel env pull
npx prisma db push

Option 3: GitHub Actions (Recommended for teams)
Create .github/workflows/migrate.yml:

name: Database Migration
on:
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx prisma db push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}



📊 Monitoring & Logs

Vercel Dashboard

Access Logs:





Go to Vercel Dashboard → Your Project → Logs



Filter by: Function, Status, Time Range

Performance Metrics:





Dashboard → Analytics



View: Response times, Error rates, Traffic

Function Logs:





Real-time logs for API routes



Error tracking and debugging

Error Monitoring

Consider integrating:





Sentry: Error tracking and performance monitoring



LogRocket: Session replay and debugging



Vercel Analytics: Built-in web analytics



🔒 Security Best Practices

Environment Variables





✅ Never commit .env files to git



✅ Use Vercel's encrypted environment variables



✅ Rotate secrets regularly



✅ Use different credentials for preview/production

Database





✅ Enable SSL connections



✅ Use connection pooling (Prisma handles this)



✅ Regular backups (Vercel Postgres auto-backups)



✅ Restrict database access by IP if possible

API Security





✅ NextAuth handles session management



✅ CORS configured in manifest API



✅ Rate limiting (consider Vercel Edge Config)



🐛 Troubleshooting

Common Issues

Build Failures:

# Check build logs in Vercel Dashboard
# Common causes:
- Missing environment variables
- TypeScript errors
- Prisma client not generated

Database Connection Errors:

# Verify DATABASE_URL is set
vercel env ls

# Test connection locally
npx prisma db pull

OAuth Errors:

# Verify redirect URIs in Google Console
# Check NEXTAUTH_URL matches deployment URL
# Ensure NEXTAUTH_SECRET is set

Prisma Client Errors:

# Regenerate Prisma client
npx prisma generate

# Redeploy
vercel --prod



📱 iOS App Integration

Manifest API Endpoint

Production URL:

https://your-project.vercel.app/api/manifest

Update iOS App:

In RewardManifestLoader.swift, update the manifest URL:

private let manifestURL = "https://your-project.vercel.app/api/manifest"

CORS Configuration:





Already configured in app/api/manifest/route.ts



Allows all origins (Access-Control-Allow-Origin: *)



iOS app can fetch without authentication



🔄 Rollback Procedure

Instant Rollback





Via Vercel Dashboard:





Go to Deployments



Find previous working deployment



Click "..." → "Promote to Production"



Via Git:

# Revert to previous commit
git revert HEAD
git push origin main



Via Vercel CLI:

# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>



📈 Performance Optimization

Vercel Edge Network





Static assets cached globally



API routes run on Edge Functions



Automatic image optimization

Database Optimization





Connection pooling enabled



Prisma query optimization



Consider read replicas for high traffic

Caching Strategy





Static pages cached at edge



API responses: Consider adding cache headers



Revalidation: Use ISR for dynamic content



🔗 Useful Links





Vercel Dashboard: https://vercel.com/dashboard



Vercel Docs: https://vercel.com/docs



Prisma Docs: https://www.prisma.io/docs



NextAuth Docs: https://next-auth.js.org



Project Repository: [Your GitHub/GitLab URL]



📝 Maintenance Checklist

Weekly





[ ] Check error logs in Vercel Dashboard



[ ] Review performance metrics



[ ] Verify database backups

Monthly





[ ] Update dependencies (npm update)



[ ] Review and rotate API keys



[ ] Check disk usage (database)



[ ] Test disaster recovery procedure

Quarterly





[ ] Security audit



[ ] Performance optimization review



[ ] Update documentation



[ ] Review access permissions



🆘 Support & Contact

Technical Issues:





Vercel Support: https://vercel.com/support



GitHub Issues: [Your repo issues page]

Team Contacts:





DevOps Lead: [Contact info]



Database Admin: [Contact info]



Project Manager: [Contact info]



📅 Deployment History







Date



Version



Changes



Deployed By





2024-XX-XX



v1.0.0



Initial Vercel deployment



[Name]





2024-XX-XX



v1.1.0



Added custom icons feature



[Name]



🎯 Next Steps





[ ] Set up monitoring alerts



[ ] Configure custom domain



[ ] Enable Vercel Analytics



[ ] Set up staging environment



[ ] Document API endpoints



[ ] Create runbook for common operations



Last Updated: [Current Date]
Maintained by: [Your Team Name]


---

## 📋 Quick Setup Checklist

After creating the file, complete these steps:

### 1. Replace Placeholders
- [ ] Update `your-project.vercel.app` with actual URL
- [ ] Add actual environment variable values
- [ ] Update team contact information
- [ ] Add repository links

### 2. Add to Git
```bash
git add VERCEL_DEPLOYMENT.md
git commit -m "docs: Add Vercel deployment documentation"
git push origin main

3. Share with Team





[ ] Add link to README.md



[ ] Share in team chat



[ ] Review with DevOps team



[ ] Update onboarding docs



This documentation provides a comprehensive guide for managing your Vercel deployment! 🚀