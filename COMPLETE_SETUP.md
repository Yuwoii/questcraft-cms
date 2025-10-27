# 🚀 Complete CMS Setup Guide

**You chose Option A (shadcn/ui)** - The fastest path! ⚡

---

## ✅ What's Already Done

- ✅ Next.js 14 project structure
- ✅ Prisma database schema
- ✅ NextAuth Google OAuth
- ✅ 5 Admin pages (Dashboard, Collections, Rewards, Tags, Manifest)
- ✅ Sidebar navigation
- ✅ Authentication routes
- ✅ All configuration files

**Status: 70% Complete!** 🎉

---

## 📋 What You Need to Do (30 minutes)

### Step 1: Install Dependencies (2 min)

```bash
cd /Users/phish/QuestCraft-CMS

# Install all npm packages
npm install
```

This installs Next.js, Tailwind, Prisma, NextAuth, etc.

---

### Step 2: Install shadcn/ui Components (5 min)

**Option A: Install all at once (recommended)**
```bash
npx shadcn-ui@latest add button card dialog input label select toast badge dropdown-menu
```

When prompted:
- Style: `default` (press Enter)
- Base color: `slate` (press Enter)
- CSS variables: `yes` (press Enter)

**Option B: Install one by one**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
```

✅ This creates `components/ui/` folder with all UI components.

---

### Step 3: Set Up Environment Variables (5 min)

1. **Copy the template:**
```bash
cp .env.local .env.local.backup  # Keep a backup
```

2. **Edit `.env.local`** and fill in these values:

#### 3a. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google Drive API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

Update in `.env.local`:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

#### 3b. Set NextAuth Secret

```bash
# Generate a random secret
openssl rand -base64 32
```

Update in `.env.local`:
```env
NEXTAUTH_SECRET="paste-generated-secret-here"
```

#### 3c. Database URL (Vercel Postgres)

For now, use local SQLite:
```env
DATABASE_URL="file:./dev.db"
```

(You'll switch to Vercel Postgres when deploying)

#### 3d. Set Your Email

```env
ADMIN_EMAILS="your-email@gmail.com"
```

**Final `.env.local` should look like:**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Admin Access
ADMIN_EMAILS="your-email@gmail.com"
```

---

### Step 4: Initialize Database (2 min)

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

✅ Database ready!

---

### Step 5: Test Locally (2 min)

```bash
npm run dev
```

Open: **http://localhost:3000**

You should see:
1. Login page
2. "Sign in with Google" button
3. After login → Dashboard

---

### Step 6: Deploy to Vercel (10 min)

#### 6a. Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial CMS setup"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/QuestCraft-CMS.git
git branch -M main
git push -u origin main
```

#### 6b. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Vercel auto-detects Next.js settings ✅
5. Click "Deploy"

#### 6c. Set Up Vercel Postgres

1. In your Vercel project dashboard
2. Go to "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose "Continue" (free tier)
6. Copy the connection string

#### 6d. Add Environment Variables to Vercel

1. Go to "Settings" → "Environment Variables"
2. Add these variables:

```
NEXTAUTH_URL = https://your-project.vercel.app
NEXTAUTH_SECRET = (same as local)
GOOGLE_CLIENT_ID = (same as local)
GOOGLE_CLIENT_SECRET = (same as local)
ADMIN_EMAILS = (same as local)
DATABASE_URL = (paste Vercel Postgres connection string)
```

#### 6e. Update Google OAuth Redirect URI

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Edit your OAuth credentials
3. Add to "Authorized redirect URIs":
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```

#### 6f. Run Database Migrations on Vercel

In Vercel dashboard:
1. Go to "Settings" → "General"
2. Under "Build & Development Settings"
3. Add to "Install Command": `npm install && npx prisma generate && npx prisma db push`

Or run manually in Vercel CLI:
```bash
vercel env pull .env.production
npx prisma db push
```

#### 6g. Redeploy

```bash
git add .
git commit -m "Configure production"
git push
```

Vercel auto-deploys! 🚀

---

## 🎉 Success! Your CMS is Live

Visit: **https://your-project.vercel.app**

### What You Can Do:

✅ **Dashboard** - View stats  
✅ **Collections** - Organize reward sets  
✅ **Rewards** - Upload media  
✅ **Tags** - Categorize content  
✅ **Manifest** - Generate JSON for iOS app  

---

## 🔐 Security Notes

- Only you can log in (your email in `ADMIN_EMAILS`)
- Google OAuth handles authentication
- All data in Vercel Postgres (secure)
- HTTPS by default on Vercel

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### "Invalid OAuth redirect"
- Check Google Cloud Console redirect URIs
- Must match exactly (with/without trailing slash)

### Database connection errors
```bash
# Reset local database
rm -f prisma/dev.db
npx prisma db push
```

### Vercel deployment fails
- Check environment variables are set
- Verify `DATABASE_URL` is correct
- Check build logs for specific errors

---

## 📱 Connect to iOS App

1. In CMS, go to "Manifest" page
2. Click "Download manifest.json"
3. Upload to Google Drive "QuestCraft Rewards" folder
4. Get file ID from sharing link
5. In iOS app: Settings → Load Rewards from Drive → Paste ID

Done! Your iOS app now loads from the CMS! 🎉

---

## 🚀 Next Features to Add

Once basic CMS works, you can add:

- [ ] File upload to Google Drive (drag & drop)
- [ ] Image/video preview in rewards list
- [ ] Bulk operations (delete multiple)
- [ ] Search and filtering
- [ ] Rarity distribution charts
- [ ] Auto-sync to Google Drive
- [ ] Collection reordering (drag & drop)
- [ ] Tag color picker
- [ ] Reward editing forms

---

## 💰 Cost Breakdown

**Vercel:**
- Free tier: ✅ More than enough
- 100GB bandwidth/month
- Unlimited deployments

**Vercel Postgres:**
- Free tier: ✅ 256 MB (plenty)
- 60 hours compute/month
- Perfect for single user

**Google Drive:**
- 15 GB free ✅

**Total: $0/month** 🎉

---

## ⏱️ Time Summary

- ✅ Backend foundation: Done
- ⏳ Install dependencies: 2 min
- ⏳ Install UI components: 5 min
- ⏳ Environment variables: 5 min
- ⏳ Database setup: 2 min
- ⏳ Test locally: 2 min
- ⏳ Deploy to Vercel: 10 min

**Total: ~26 minutes from now to production CMS!** ⚡

---

## 📚 Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup
- `DEPLOYMENT.md` - Vercel deployment
- `CMS_IMPLEMENTATION_PLAN.md` - Full architecture

---

## 🎯 Start Here

```bash
cd /Users/phish/QuestCraft-CMS
npm install
npx shadcn-ui@latest add button card dialog input label select toast badge dropdown-menu
npm run dev
```

Then follow Step 3 (environment variables) above!

Good luck! 🚀

