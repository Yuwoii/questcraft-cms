# QuestCraft CMS Setup Guide

## 🚀 Complete Setup (30 minutes)

### Prerequisites

- Node.js 18+ installed
- Google account (for OAuth and Drive)
- Terminal access

---

## Step 1: Create Next.js Project (5 min)

```bash
# Navigate to CMS directory
cd /Users/phish/QuestCraft-CMS

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --app --yes

# Install dependencies
npm install @prisma/client prisma
npm install @auth/prisma-adapter next-auth
npm install @vercel/postgres
npm install googleapis
npm install zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react
npm install date-fns
```

---

## Step 2: Set Up Vercel Account (2 min)

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Continue with GitHub
3. Create new team (free tier)
4. ✅ No credit card required!

---

## Step 3: Create Database (3 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Create Postgres database
vercel postgres create questcraft-db
```

**Output**: You'll get a database URL like:
```
postgres://user:pass@host/database
```

Save this! We'll use it next.

---

## Step 4: Configure Environment Variables (2 min)

Create `.env.local`:

```bash
# Database
DATABASE_URL="YOUR_VERCEL_POSTGRES_URL"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google OAuth (we'll fill this in Step 5)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Google Drive API (we'll fill this in Step 6)
GOOGLE_DRIVE_API_KEY=""
GOOGLE_DRIVE_CLIENT_EMAIL=""
GOOGLE_DRIVE_PRIVATE_KEY=""
```

---

## Step 5: Set Up Google OAuth (5 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "QuestCraft CMS"
3. Enable APIs:
   - Go to "APIs & Services" → "Library"
   - Search and enable: "Google Drive API"
4. Create OAuth credentials:
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "QuestCraft CMS"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://YOUR_DOMAIN.vercel.app/api/auth/callback/google`
   - Click "Create"
5. Copy the **Client ID** and **Client Secret**
6. Paste into `.env.local`

---

## Step 6: Set Up Google Drive Service Account (5 min)

1. In Google Cloud Console:
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "Service Account"
   - Name: "questcraft-drive-uploader"
   - Click "Create and Continue"
   - Skip granting access
   - Click "Done"

2. Create key:
   - Click on the service account email
   - "Keys" tab → "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the file

3. Add to `.env.local`:
   ```bash
   GOOGLE_DRIVE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
   GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. Share your Google Drive folder:
   - Right-click "QuestCraft Rewards" folder
   - Share → Add the service account email
   - Give "Editor" access

---

## Step 7: Initialize Database (3 min)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with initial data (optional)
npx prisma db seed
```

---

## Step 8: Run Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the login page! 🎉

---

## Step 9: Deploy to Vercel (3 min)

```bash
# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_DRIVE_CLIENT_EMAIL
vercel env add GOOGLE_DRIVE_PRIVATE_KEY

# Deploy again with env vars
vercel --prod
```

Your CMS is now live! 🚀

---

## Step 10: Configure Your Email (1 min)

1. Go to your deployed URL
2. Click "Sign in with Google"
3. Allow access
4. You're in! ✅

---

## 🎯 What's Next?

1. Upload your first reward
2. Create collections
3. Add tags
4. Generate manifest
5. Test in iOS app

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma studio       # Visual database browser
npx prisma db push      # Update database schema
npx prisma migrate dev  # Create migration

# Vercel
vercel                  # Deploy preview
vercel --prod          # Deploy to production
vercel logs            # View logs
```

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` in `.env.local`
- Run `npx prisma db push` again

### "Google OAuth error"
- Verify redirect URIs match exactly
- Check client ID and secret are correct

### "Drive upload fails"
- Verify service account has access to folder
- Check private key format (include `\n` for line breaks)

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Vercel Docs](https://vercel.com/docs)

