# 🔐 Google Drive Service Account Setup

## Overview

To enable **automatic file uploads** to Google Drive from your CMS, you need to set up a **Google Cloud Service Account**. This allows the CMS to upload files programmatically without manual authentication.

---

## 📋 Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Name it **"QuestCraft CMS"**
5. Click **"Create"**

---

### 2. Enable Google Drive API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click on it
4. Click **"Enable"**

---

### 3. Create a Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in details:
   - **Service Account Name:** `questcraft-cms-uploader`
   - **Service Account ID:** (auto-generated)
   - **Description:** `Service account for uploading rewards to Google Drive`
4. Click **"Create and Continue"**
5. For **"Role"**, leave blank (we'll set permissions in Drive directly)
6. Click **"Continue"** then **"Done"**

---

### 4. Create a Service Account Key

1. In the **"Credentials"** page, find your service account
2. Click on the service account email (e.g., `questcraft-cms-uploader@...`)
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create New Key"**
5. Choose **"JSON"** format
6. Click **"Create"**
7. A JSON file will download - **keep this safe!**

The JSON file looks like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "questcraft-cms-uploader@your-project.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

### 5. Share Google Drive Folder with Service Account

1. **Create a folder** in Google Drive: **"QuestCraft Rewards"**
2. Right-click the folder → **"Share"**
3. In the "Add people and groups" field, paste the **service account email**:
   ```
   questcraft-cms-uploader@your-project.iam.gserviceaccount.com
   ```
4. Set permission to **"Editor"** (so it can upload files)
5. Uncheck **"Notify people"** (service accounts don't need emails)
6. Click **"Share"**

✅ Now the service account can upload files to this folder!

---

### 6. Update .env.local in CMS

Open `/Users/phish/QuestCraft-CMS/.env.local` and add:

```env
# Google Drive Service Account (from JSON file)
GOOGLE_DRIVE_CLIENT_EMAIL="questcraft-cms-uploader@your-project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important:**
- Copy `client_email` from the JSON file
- Copy the **entire** `private_key` from the JSON file (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
- Keep the `\n` line breaks in the private key

---

### 7. Copy to .env for Prisma

```bash
cd /Users/phish/QuestCraft-CMS
cp .env.local .env
```

---

### 8. Test the Upload

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Go to **Rewards** page
3. Click **"Upload Reward"**
4. Drag & drop an image or video
5. Fill in the form
6. Click **"Upload Reward"**
7. ✅ File uploads to Google Drive automatically!

Check your Google Drive folder - the file should appear!

---

## 🎯 What Happens Now

### Old Workflow (Manual):
1. Upload file to Google Drive manually
2. Share file → Get link
3. Extract file ID from link
4. Paste file ID into CMS form
5. Create reward

**Problem:** For 1000 files, this is ~5000 steps! 😰

### New Workflow (Automatic):
1. Drag & drop file into CMS
2. Fill in reward details
3. Click "Upload Reward"

**Result:** File uploads automatically, CMS gets the file ID, reward created! 🎉

**For 1000 files:** Just drag, fill, click. Done! ✅

---

## 🔒 Security

### Is this safe?
✅ Yes! The service account can **only** access:
- The specific folder you shared with it
- Nothing else in your Google Drive

### Where are credentials stored?
- `.env.local` (local development)
- Vercel environment variables (production)
- **Never** committed to git (`.env.local` is in `.gitignore`)

### Can someone steal the credentials?
- Service account key is only stored on your server
- Even if stolen, attacker can only upload to your QuestCraft folder
- You can revoke the key anytime in Google Cloud Console

---

## 🐛 Troubleshooting

### "Failed to upload to Google Drive"
**Solutions:**
1. Check service account email is correct in `.env.local`
2. Verify private key is complete (including BEGIN/END markers)
3. Ensure folder is shared with service account
4. Check Google Drive API is enabled

### "Unauthorized" error
**Solutions:**
1. Verify service account has "Editor" permission on folder
2. Check credentials in Google Cloud Console
3. Regenerate service account key if needed

### "Cannot find module 'googleapis'"
**Solution:**
```bash
npm install googleapis
```

### Files not appearing in Drive
**Solutions:**
1. Check the "QuestCraft Rewards" folder in your Drive
2. Files might be in the root - make sure folder name matches
3. Check service account has write permission

### Private key format error
**Common issue:** The private key needs proper line breaks

**Wrong:**
```env
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY----- MIIEvQIB... -----END PRIVATE KEY-----"
```

**Correct:**
```env
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
```

Notice the `\n` characters for line breaks!

---

## 📊 File Limits

### Per Upload:
- **Max file size:** 50 MB (configurable in API route)
- **Allowed types:** JPEG, PNG, GIF, WebP, MP4, MOV

### Google Drive Quotas:
- **Free tier:** 15 GB storage
- **Upload limit:** 750 GB per day (way more than enough!)
- **API requests:** 20,000 queries per 100 seconds per user

---

## 🚀 Advanced: Batch Upload

Want to upload multiple files at once? Here's a tip:

1. Select multiple files in the upload dialog (hold Cmd/Ctrl)
2. Each file gets uploaded sequentially
3. Progress bar shows overall progress

(This feature can be added in the future!)

---

## 📝 Environment Variables Summary

**Required for file upload:**
```env
GOOGLE_DRIVE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Full .env.local file:**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (for CMS login)
GOOGLE_CLIENT_ID="your-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-oauth-secret"

# Google Drive Service Account (for file uploads)
GOOGLE_DRIVE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin Access
ADMIN_EMAILS="your-email@gmail.com"
```

---

## ✅ Checklist

Before testing uploads, ensure:

- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] Service account created
- [ ] Service account key (JSON) downloaded
- [ ] "QuestCraft Rewards" folder created in Drive
- [ ] Folder shared with service account email
- [ ] `GOOGLE_DRIVE_CLIENT_EMAIL` added to `.env.local`
- [ ] `GOOGLE_DRIVE_PRIVATE_KEY` added to `.env.local`
- [ ] `.env.local` copied to `.env`
- [ ] Dev server restarted

---

## 🎉 Ready!

Once setup is complete:
1. Upload files directly in CMS
2. Files automatically go to Google Drive
3. File IDs captured automatically
4. Rewards created seamlessly

**No more manual file ID copying for thousands of files!** 🚀

---

## 📚 Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Drive API Docs](https://developers.google.com/drive/api/v3/about-sdk)
- [Service Account Guide](https://cloud.google.com/iam/docs/service-accounts)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)

---

**Questions?** Check the troubleshooting section or the CMS console logs!



