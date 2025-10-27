# Google Drive Folder Setup Guide

## 🎯 The Problem

Service accounts don't have storage quota. They need to upload to **your personal Google Drive** instead.

## ✅ Easy 3-Step Fix

### Step 1: Create Folder in Your Google Drive (30 seconds)

1. Go to **your personal Google Drive**: https://drive.google.com
2. Click **"+ New"** → **"New folder"**
3. Name it: `QuestCraft Rewards`
4. Click **"Create"**

✅ This folder uses YOUR storage quota, not the service account's (which is zero).

---

### Step 2: Share Folder with Service Account (30 seconds)

1. **Right-click** the `QuestCraft Rewards` folder
2. Click **"Share"**
3. In the "Add people" box, paste your service account email:
   ```
   Your email from .env.local (GOOGLE_DRIVE_CLIENT_EMAIL)
   ```
   It looks like: `something@project-id.iam.gserviceaccount.com`

4. Change permission to **"Editor"** (not Viewer!)
5. **Uncheck** "Notify people"
6. Click **"Share"**

✅ Now the service account can upload files to YOUR folder.

---

### Step 3: Get Folder ID (30 seconds)

1. **Open** the `QuestCraft Rewards` folder in Google Drive
2. **Look at the URL** in your browser:
   ```
   https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                          ^^^^^^^^^^^^^^^^^^^^
                                          This is the Folder ID!
   ```
3. **Copy** the folder ID (the part after `/folders/`)

Example:
- URL: `https://drive.google.com/drive/folders/1XyZ-AbC123DeF456`
- Folder ID: `1XyZ-AbC123DeF456`

---

### Step 4: Add Folder ID to .env.local (30 seconds)

Open your `.env.local` file and update:

```env
GOOGLE_DRIVE_FOLDER_ID="1XyZ-AbC123DeF456"
```

**Replace** `1XyZ-AbC123DeF456` with YOUR folder ID from Step 3.

---

## 🧪 Test It!

1. **Restart** your dev server:
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

2. **Upload** a test image in the CMS

3. **Check** your Google Drive - the file should appear in `QuestCraft Rewards`!

---

## 🔧 Quick Reference

### What Goes Where:

```env
# .env.local file:
GOOGLE_DRIVE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_DRIVE_FOLDER_ID="1XyZ-AbC123DeF456"  ← ADD THIS!
```

### Checklist:

- [ ] Created `QuestCraft Rewards` folder in MY Google Drive
- [ ] Shared folder with service account email
- [ ] Gave service account "Editor" permission
- [ ] Copied folder ID from URL
- [ ] Pasted folder ID into `.env.local`
- [ ] Restarted dev server
- [ ] Tested upload

---

## 💡 Why This Works

```
❌ Before:
Service Account → Service Account's Drive (0 GB quota) → ERROR

✅ After:
Service Account → Your Personal Drive Folder (15+ GB quota) → SUCCESS
```

The service account uploads to YOUR folder, using YOUR storage quota.

---

## 🚀 Ready?

Follow the 4 steps above, then test upload!

**Time required:** ~2 minutes total

