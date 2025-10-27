# EXACT STEPS TO FIX VERCEL DATABASE CONNECTION

## The Problem
Your DATABASE_URL is using the wrong connection string. Supabase already provided the correct one in POSTGRES_PRISMA_URL.

## THE FIX (Follow these exact steps):

### Step 1: Update DATABASE_URL in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project (questcraft-cms)
3. Go to: Settings → Environment Variables
4. Find: DATABASE_URL

5. **Click "Edit" and replace the value with:**
```
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=30
```

6. **IMPORTANT:** 
   - NO quotation marks around the value
   - Select "Production" environment
   - Click "Save"

### Step 2: Redeploy

1. Go to: Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes

## Why This Works

- Port **6543** = Session pooler (Supavisor) - optimized for serverless
- Port **5432** = Direct connection - doesn't work well with Vercel
- `pgbouncer=true` = Tells Prisma to use connection pooling
- `connect_timeout=30` = Gives more time for connection

## Alternative (If above doesn't work)

Try the transaction mode pooler:

```
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## Test Locally First

Before deploying, test if the connection works:

```bash
npx prisma db execute --stdin --url="postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true" <<< "SELECT 1;"
```

If you get output (no error), the connection works!

---

**CRITICAL:** The issue is that Vercel's serverless functions need port **6543** (session pooler), NOT port **5432** (direct connection). This is documented in Supabase's Vercel integration guide.
