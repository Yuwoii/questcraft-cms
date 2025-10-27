# 🔧 Supabase Connection Issue - Emergency Fix Guide

## 🚨 **Current Error:**
```
Can't reach database server at aws-1-eu-central-1.pooler.supabase.com:5432
```

**Status:** Database is **NOT REACHABLE** from both Vercel AND your local machine.

---

## ✅ **Solution 1: Restore Paused Database (Most Common)**

### If you're on Supabase Free Tier:

1. **Go to:** https://supabase.com/dashboard
2. **Select your project:** `ezbaenmshvanypmlulsu`
3. **Look for:**
   - 🟡 "Project is paused" banner
   - 🟡 "Restore project" button
4. **Click "Restore Project"** and wait 2-3 minutes

**Why this happens:**
- Free tier pauses after 7 days of inactivity
- Database goes to sleep to save resources

---

## ✅ **Solution 2: Use Direct Connection (Bypass Pooler)**

### Supabase has TWO connection modes:

#### Current (Pooler - Port 5432):
```
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

#### Alternative (Direct - Port 6543):
```
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### How to Get Direct Connection String:

1. **Go to Supabase Dashboard**
2. **Click:** Settings → Database
3. **Find:** "Connection string" section
4. **Copy:** 
   - **Session Mode** (for serverless/Vercel) - Usually port **6543**
   - **Transaction Mode** (alternative) - Port **5432** without pooler

### Update Connection:

**Option A: Direct Connection (Port 5432 without pooler)**
```bash
# Replace aws-1-eu-central-1.pooler.supabase.com with direct host
# Usually: db.ezbaenmshvanypmlulsu.supabase.co
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@db.ezbaenmshvanypmlulsu.supabase.co:5432/postgres
```

**Option B: Session Pooler (Port 6543)**
```bash
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

---

## ✅ **Solution 3: Check Supabase Project Status**

### Dashboard Checklist:

1. **Project Overview:**
   - [ ] Project is **Active** (green status)
   - [ ] No "paused" or "inactive" warnings
   - [ ] Database size within limits

2. **Database Settings:**
   - [ ] Connection pooling is **Enabled**
   - [ ] No IP restrictions blocking Vercel

3. **Organization Billing:**
   - [ ] Free tier limits not exceeded
   - [ ] No payment issues (if on paid plan)

---

## ✅ **Solution 4: Update Environment Variables**

### In Vercel Dashboard:

1. **Go to:** https://vercel.com/dashboard
2. **Select:** Your project → Settings → Environment Variables
3. **Find:** `DATABASE_URL`
4. **Update with one of these:**

#### Try Session Pooler First:
```
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

#### Or Direct Connection:
```
postgres://postgres.ezbaenmshvanypmlulsu:wlfmgxHjsmlaAOVa@db.ezbaenmshvanypmlulsu.supabase.co:5432/postgres?sslmode=require
```

5. **IMPORTANT:** 
   - Remove any quotation marks
   - Set for **Production** environment
   - Save changes

6. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy" on latest deployment

---

## ✅ **Solution 5: Check Supabase IP Allow List**

If you've enabled IP restrictions:

1. **Go to:** Settings → Database → Connection Security
2. **Check:** If "Restrict to specific IPs" is enabled
3. **Add Vercel IPs:**
   ```
   76.76.21.0/24
   76.76.19.0/24
   ```
   Or **disable IP restrictions** for easier troubleshooting

---

## 🧪 **Test Connection Locally**

### After making changes to Supabase:

```bash
# 1. Test with direct connection
npx prisma db execute --stdin --url="YOUR_NEW_CONNECTION_STRING" <<< "SELECT 1;"

# 2. If successful, update .env.local
echo 'DATABASE_URL="YOUR_NEW_CONNECTION_STRING"' >> .env.local

# 3. Push schema
npx prisma db push

# 4. Test locally
npm run dev
```

---

## 📋 **Quick Checklist**

- [ ] Supabase project is **active/restored** (not paused)
- [ ] Got correct connection string from Supabase Dashboard
- [ ] Tried **both** pooler (6543) and direct (5432) connections
- [ ] Updated `DATABASE_URL` in Vercel (no quotes!)
- [ ] Updated `DATABASE_URL` in `.env.local`
- [ ] Redeployed Vercel project
- [ ] Tested connection with `npx prisma db execute`
- [ ] Checked Supabase IP restrictions
- [ ] Waited 2-3 minutes after restoring paused database

---

## 🆘 **Still Not Working?**

### Last Resort Options:

1. **Create New Supabase Project:**
   - Free and takes 2 minutes
   - Sometimes faster than debugging connection issues

2. **Use Vercel Postgres Instead:**
   - Built-in to Vercel
   - Seamless integration
   - No connection issues

3. **Contact Supabase Support:**
   - https://supabase.com/dashboard/support
   - Provide project ref: `ezbaenmshvanypmlulsu`

---

## 📝 **What to Try RIGHT NOW:**

1. **First:** Check if database is paused in Supabase Dashboard
2. **Second:** Try port 6543 instead of 5432
3. **Third:** Get direct connection string from Supabase Dashboard
4. **Fourth:** Update Vercel environment variable and redeploy

**Most likely fix:** Your database is paused. Just restore it! 🎯

