# 🚨 URGENT: Supabase Database Connection Fix

## Problem
Vercel cannot connect to Supabase database at `aws-1-eu-central-1.pooler.supabase.com:5432`

## IMMEDIATE ACTION REQUIRED

### Step 1: Check Supabase Dashboard (DO THIS FIRST!)

1. **Go to:** https://supabase.com/dashboard
2. **Find your project:** Look for project with ID `ezbaenmshvanypmlulsu`
3. **Check status:** 
   - Is there a **yellow/orange banner** saying "Project paused"?
   - Is the project status showing as **"Inactive"** or **"Paused"**?
   
4. **If paused:**
   - Click **"Restore Project"** or **"Resume"** button
   - Wait 2-3 minutes for database to wake up
   - Try accessing your Vercel site again

### Step 2: Get the Correct Connection String

Even if not paused, let's verify the connection string:

1. In Supabase Dashboard → **Settings** → **Database**
2. Find section: **"Connection string"**
3. Look for these options:
   - **"URI"** or **"Connection String"**
   - **"Session mode"** (recommended for serverless)
   - **"Transaction mode"**

4. **Copy the connection string** - it should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 3: Update Vercel Environment Variable

1. **Go to:** https://vercel.com/dashboard
2. **Select your project** → **Settings** → **Environment Variables**
3. **Find:** `DATABASE_URL`
4. **Click Edit**
5. **Paste the NEW connection string from Supabase**
   - ⚠️ **IMPORTANT:** Make sure there are NO quotation marks around the value
   - ⚠️ Just paste the raw string: `postgresql://postgres...`
6. **Select:** Production (and Preview if you want)
7. **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click the **"..." menu** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2 minutes)

---

## Alternative Connection Strings to Try

If the above doesn't work, try these alternatives in Vercel's `DATABASE_URL`:

### Option A: Session Pooler (Port 6543)
```
postgresql://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Option B: Direct Connection
```
postgresql://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@db.ezbaenmshvanypmlulsu.supabase.co:5432/postgres
```

### Option C: Add Connection Parameters
```
postgresql://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require&connection_limit=1
```

---

## How to Test Locally

After updating Vercel, test if the connection string works:

```bash
# Test the connection
npx prisma db execute --stdin --url="YOUR_NEW_CONNECTION_STRING" <<< "SELECT 1;"
```

If it says "Can't reach database", the problem is with Supabase itself.

---

## If Nothing Works: Switch to Vercel Postgres

As a last resort, you can migrate to Vercel's built-in Postgres:

1. **In Vercel Dashboard** → **Storage** → **Create Database**
2. Select **Postgres**
3. It will automatically add `POSTGRES_URL` to your env vars
4. **In your code:** Change `DATABASE_URL` to use `POSTGRES_URL`
5. Run migrations: `npx prisma db push`

---

## Quick Checklist

- [ ] Checked Supabase dashboard for paused/inactive project
- [ ] Restored project if paused (wait 2-3 minutes)
- [ ] Copied fresh connection string from Supabase Settings → Database
- [ ] Updated Vercel `DATABASE_URL` (NO quotes!)
- [ ] Tried port 6543 instead of 5432
- [ ] Checked Supabase billing (free tier limits?)
- [ ] Redeployed on Vercel
- [ ] Waited 2-3 minutes after changes

---

## Most Common Causes (in order)

1. **🟡 Supabase free tier paused after inactivity** ← 90% of cases
2. **🔴 Wrong connection string in Vercel**
3. **🟠 Quotation marks in Vercel env variable**
4. **🟢 Supabase connection pooler issues**
5. **⚫ Supabase service outage** (check https://status.supabase.com)

---

## Contact Info

If still not working after ALL steps above:
- **Supabase Support:** https://supabase.com/dashboard/support
- **Provide:** Project ref `ezbaenmshvanypmlulsu`
- **Ask:** "Why can't external services connect to my database?"


