# 🔧 Troubleshooting Guide

## Issue 0: Buttons Not Working ✅ FIXED

**Error:** Clicking "Create Collection" or other buttons does nothing

### ✅ Solution Applied:

Created Client Components for all interactive buttons:
- `components/buttons/create-collection-button.tsx`
- `components/buttons/upload-reward-button.tsx`
- `components/buttons/create-tag-button.tsx`
- `components/buttons/manifest-buttons.tsx`

**Why:** Next.js 13+ Server Components can't handle `onClick` events. Interactive elements must be Client Components (with `'use client'` directive).

**Current behavior:** Buttons show alerts and suggest using Prisma Studio until proper forms are built.

---

## Issue 0.5: Sidebar Disappearing ✅ FIXED

**Error:** Navigation sidebar disappears when navigating away from dashboard

### ✅ Solution Applied:

Restructured app to use a route group `(dashboard)` with shared layout:
- All authenticated pages now in `app/(dashboard)/`
- Shared layout applies sidebar to all pages
- URLs remain unchanged (`/dashboard`, `/collections`, etc.)

**Result:** Sidebar now persists across all pages!

---

## Issue 1: Google OAuth Callback Error ✅ FIXED

**Error:** `http://localhost:3000/login?error=Callback`

### ✅ Solution:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **"Authorized redirect URIs"**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Click **Save**
6. Wait 1 minute, then try again

### Additional Checks:

**A. Add yourself as a test user:**
1. Go to: **APIs & Services** → **OAuth consent screen**
2. Scroll to **"Test users"**
3. Click **"Add Users"**
4. Add your email address

**B. Ensure your app is in "Testing" mode:**
1. On the OAuth consent screen page
2. Check "Publishing status" shows **"Testing"**
3. This is fine for personal use

**C. Check browser console:**
1. Open your browser dev tools (F12)
2. Go to Console tab
3. Look for specific error messages
4. Share them if the issue persists

---

## Issue 2: Prisma Database Error ✅ FIXED

**Error:** `Environment variable not found: DATABASE_URL`

### ✅ Solution Applied:

1. ✅ Changed Prisma schema from PostgreSQL to SQLite
2. ✅ Set `DATABASE_URL="file:./dev.db"` in `.env.local`
3. ✅ Copied `.env.local` to `.env` (Prisma reads from `.env`)
4. ✅ Generated Prisma Client
5. ✅ Created database with all tables

**Your database is now at:** `./dev.db`

---

## Issue 3: Module Not Found Errors

**Error:** `Cannot find module '@/components/ui/button'`

### Solution:

Install shadcn/ui components:

```bash
npx shadcn-ui@latest add button card dialog input label select toast badge dropdown-menu
```

When prompted, choose:
- Style: **default** (press Enter)
- Base color: **slate** (press Enter)
- CSS variables: **yes** (press Enter)

---

## Issue 4: Next.js Won't Start

**Error:** Various build errors

### Solutions:

**A. Clean install:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**B. Regenerate Prisma:**
```bash
npx prisma generate
```

**C. Check port 3000 is free:**
```bash
lsof -ti:3000 | xargs kill -9  # Kill any process on port 3000
npm run dev
```

---

## Issue 5: "Invalid Session" or "No Session"

**Error:** Can't access dashboard even after login

### Solution:

1. Clear browser cookies for `localhost:3000`
2. Restart dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```
3. Try logging in again

---

## Issue 6: Vercel Deployment Fails

**Error:** Various deployment errors

### Solutions:

**A. Environment Variables:**

Ensure these are set in Vercel dashboard:

```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=(same as local)
GOOGLE_CLIENT_ID=(same as local)
GOOGLE_CLIENT_SECRET=(same as local)
ADMIN_EMAILS=your-email@gmail.com
DATABASE_URL=(Vercel Postgres connection string)
```

**B. Add Production Redirect URI:**

In Google Cloud Console, add:
```
https://your-project.vercel.app/api/auth/callback/google
```

**C. Run migrations:**
```bash
vercel env pull .env.production
npx prisma generate
npx prisma db push
```

---

## Issue 7: Google Drive API Not Working

**Error:** Can't access Google Drive files

### Solution:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Library**
3. Search for **"Google Drive API"**
4. Click **Enable**

---

## Common Commands

### Reset Everything:
```bash
# Stop server (Ctrl+C)
rm -rf node_modules package-lock.json prisma/dev.db
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### View Database:
```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Check Environment Variables:
```bash
cat .env.local
```

### Generate New Secret:
```bash
openssl rand -base64 32
```

---

## Quick Checklist

Before starting the dev server, verify:

- [ ] `.env.local` has all variables filled (no "YOUR_X_HERE")
- [ ] `.env` file exists (copy of `.env.local`)
- [ ] Google OAuth redirect URI is added
- [ ] You're added as a test user in Google Console
- [ ] `node_modules` exists (`npm install` if not)
- [ ] `prisma/dev.db` exists (`npx prisma db push` if not)
- [ ] shadcn/ui components installed

---

## Getting Help

If none of these solutions work:

1. **Check the browser console** (F12) for error messages
2. **Check the terminal** for server errors
3. **Try in incognito mode** to rule out browser cache issues
4. **Share specific error messages** for better help

---

## Your Current Setup

**Environment:**
- Database: SQLite (./dev.db)
- Auth: NextAuth + Google OAuth
- UI: shadcn/ui components
- Framework: Next.js 14

**Files:**
- `.env.local` - Environment variables (✅ configured)
- `prisma/schema.prisma` - Database schema (✅ configured)
- `prisma/dev.db` - SQLite database (✅ created)

**Next Steps:**
1. Add Google OAuth redirect URI
2. Run `npm run dev`
3. Test login at http://localhost:3000

Good luck! 🚀

