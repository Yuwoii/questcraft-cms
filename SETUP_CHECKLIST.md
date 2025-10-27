# ✅ Google Drive Setup Checklist

Use this checklist to track your progress:

## 📋 Pre-Setup
- [ ] Have a Google account
- [ ] Can access Google Cloud Console
- [ ] Can access Google Drive

## 🔧 Setup Steps

### Step 1: Google Cloud Project
- [ ] Opened https://console.cloud.google.com/
- [ ] Created new project "QuestCraft CMS"
- [ ] Project is selected in dropdown

### Step 2: Enable API
- [ ] Went to APIs & Services → Library
- [ ] Searched for "Google Drive API"
- [ ] Clicked "Enable"
- [ ] API shows as enabled

### Step 3: Service Account
- [ ] Went to IAM & Admin → Service Accounts
- [ ] Created service account "questcraft-cms-uploader"
- [ ] Service account appears in list

### Step 4: Credentials
- [ ] Clicked on service account email
- [ ] Went to "Keys" tab
- [ ] Created new JSON key
- [ ] JSON file downloaded
- [ ] JSON file saved securely
- [ ] Found `client_email` in JSON
- [ ] Found `private_key` in JSON

### Step 5: Google Drive Folder
- [ ] Opened https://drive.google.com
- [ ] Created folder "QuestCraft Rewards"
- [ ] Right-clicked folder → Share
- [ ] Pasted service account email
- [ ] Changed permission to "Editor"
- [ ] Unchecked "Notify people"
- [ ] Clicked "Share"

### Step 6: Configure CMS
- [ ] Opened `.env.local` in editor
- [ ] Pasted `client_email` value
- [ ] Pasted `private_key` value (with `\n` kept intact)
- [ ] Saved file

### Step 7: Test Connection
- [ ] Ran: `node test-google-drive.js`
- [ ] All checks passed ✅
- [ ] Saw "All tests passed!" message

### Step 8: Test Upload
- [ ] Ran: `npm run dev`
- [ ] Opened http://localhost:3000
- [ ] Logged in to CMS
- [ ] Went to Rewards page
- [ ] Clicked "Upload Reward"
- [ ] Selected a test image/video
- [ ] Filled in form
- [ ] Clicked "Upload Reward"
- [ ] Upload succeeded
- [ ] File appeared in Google Drive folder

## 🎉 Success!

If all boxes are checked, your Google Drive integration is complete!

## ⚠️ Common Issues

**Can't find service account email?**
→ Open the JSON file, look for `"client_email"`

**Private key not working?**
→ Make sure you copied it WITH the `\n` characters
→ Example: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END"`

**Test script fails?**
→ Run `node test-google-drive.js` and send me the output

**Upload fails?**
→ Check browser console (F12) for errors
→ Check terminal where `npm run dev` is running

## 📞 Need Help?

Run the test script and show me the output:
```bash
cd /Users/phish/QuestCraft-CMS
node test-google-drive.js
```

Or check the full guide:
```bash
cat GOOGLE_DRIVE_SETUP.md
```

