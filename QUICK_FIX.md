# 🚀 QUICK FIX: 2-Minute Setup

## The Issue
Service accounts = 0 GB storage quota ❌

## The Solution
Upload to YOUR Google Drive folder ✅

---

## Step-by-Step Guide

### 1️⃣ Create Folder (30 sec)
```
1. Open: https://drive.google.com
2. Click: "+ New" → "New folder"
3. Name: "QuestCraft Rewards"
4. Click: "Create"
```

### 2️⃣ Share with Service Account (30 sec)
```
1. Right-click "QuestCraft Rewards" folder
2. Click "Share"
3. Paste this email:
   niggalink@fentstash.iam.gserviceaccount.com
4. Change to "Editor"
5. Uncheck "Notify people"
6. Click "Share"
```

### 3️⃣ Get Folder ID (30 sec)
```
1. Open "QuestCraft Rewards" folder
2. Copy ID from URL:
   https://drive.google.com/drive/folders/1XyZ-AbC123
                                          ^^^^^^^^^^^
                                          Copy this!
```

### 4️⃣ Add to .env.local (30 sec)
```bash
# Open the file
nano /Users/phish/QuestCraft-CMS/.env.local

# Add this line at the end:
GOOGLE_DRIVE_FOLDER_ID="YOUR_FOLDER_ID_HERE"

# Save: Ctrl+O, Enter, Ctrl+X
```

### 5️⃣ Restart Server (10 sec)
```bash
# Stop: Ctrl+C
npm run dev
```

---

## ✅ Done!

Now try uploading a file in the CMS.
It should appear in your Google Drive folder!

---

## 📝 Your .env.local should look like:
```env
GOOGLE_DRIVE_CLIENT_EMAIL="niggalink@fentstash.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_DRIVE_FOLDER_ID="1XyZ-AbC123"  ← NEW!
```

---

## 🔍 Troubleshooting

**Error: "folder not configured"**
→ Forgot Step 4? Add GOOGLE_DRIVE_FOLDER_ID to .env.local

**Error: "permission denied"**
→ Forgot Step 2? Share folder with service account as "Editor"

**Files don't appear in Drive**
→ Check you're looking in the right folder!

---

**Need help?** Show me any error messages!
