# QuestCraft CMS Deployment Guide

## 🚀 Quick Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub (2 min)

```bash
cd /Users/phish/QuestCraft-CMS

# Initialize git
git init
git add .
git commit -m "Initial commit: QuestCraft CMS"

# Create GitHub repo (via GitHub.com)
# Go to github.com → New Repository → Name it "questcraft-cms"
# Don't initialize with README

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/questcraft-cms.git
git push -u origin main
```

### Step 2: Deploy to Vercel (3 min)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "Add New Project"**
4. **Import "questcraft-cms" repository**
5. **Configure:**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Add Environment Variables:**
   ```
   DATABASE_URL=          (we'll add this in Step 3)
   NEXTAUTH_SECRET=       (run: openssl rand -base64 32)
   NEXTAUTH_URL=          (will be your-app.vercel.app)
   GOOGLE_CLIENT_ID=      (from Google Cloud Console)
   GOOGLE_CLIENT_SECRET=  (from Google Cloud Console)
   GOOGLE_DRIVE_CLIENT_EMAIL=     (service account email)
   GOOGLE_DRIVE_PRIVATE_KEY=      (from service account JSON)
   ```
7. **Click Deploy!**

### Step 3: Create Database

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your deployed project
vercel link

# Create Postgres database
vercel postgres create questcraft-db

# Get database URL
vercel env pull .env.local

# Push schema
npm run db:push
```

### Step 4: Update OAuth Redirect URLs

In Google Cloud Console:
- Add: `https://your-app.vercel.app/api/auth/callback/google`

### Step 5: Test! 🎉

Visit: `https://your-app.vercel.app`

---

## 🔄 Future Deployments

Every time you push to GitHub, Vercel auto-deploys!

```bash
git add .
git commit -m "Add new features"
git push
```

Vercel automatically builds and deploys! 🚀

---

## 🆘 Troubleshooting

### Build fails
- Check environment variables in Vercel dashboard
- Verify all are set correctly

### Database connection fails
- Ensure DATABASE_URL is from `vercel postgres create`
- Run `npm run db:push` after creating database

### OAuth fails
- Verify redirect URIs in Google Cloud Console
- Check NEXTAUTH_URL matches your Vercel URL

---

## 📝 Environment Variables Checklist

- [ ] DATABASE_URL (from Vercel Postgres)
- [ ] NEXTAUTH_SECRET (random 32-char string)
- [ ] NEXTAUTH_URL (your-app.vercel.app)
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GOOGLE_DRIVE_CLIENT_EMAIL
- [ ] GOOGLE_DRIVE_PRIVATE_KEY

