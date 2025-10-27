# OAuth Setup Complete Guide

## 🎯 Quick Fix for Error 403: access_denied

### Step 1: Add Yourself as Test User (1 minute)

1. **Go to OAuth Consent Screen:**
   ```
   https://console.cloud.google.com/apis/credentials/consent
   ```

2. **Scroll to "Test users" section**

3. **Click "+ ADD USERS"**

4. **Enter your email:**
   ```
   lachs.beschte@gmail.com
   ```

5. **Press Enter → Click "SAVE"**

6. **Done!** ✅

---

## 📋 Complete Checklist

### ✅ Step 1: Enable Google Drive API

- [ ] Go to: https://console.cloud.google.com/apis/library
- [ ] Search: "Google Drive API"
- [ ] Click "ENABLE"

### ✅ Step 2: Configure OAuth Consent Screen

- [ ] Go to: https://console.cloud.google.com/apis/credentials/consent
- [ ] Under "Scopes", make sure these are added:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `.../auth/drive.file` ← **Important!**
- [ ] Under "Test users", add: `lachs.beschte@gmail.com`
- [ ] Click "SAVE"

### ✅ Step 3: Check OAuth Credentials

- [ ] Go to: https://console.cloud.google.com/apis/credentials
- [ ] Click on OAuth 2.0 Client ID:
  ```
  678823701263-8g8o4t79tf7hg73n4nll0np18f72j4vp
  ```
- [ ] Verify "Authorized redirect URIs" includes:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- [ ] Click "SAVE"

### ✅ Step 4: Test Sign In

- [ ] Server running: `npm run dev`
- [ ] Go to: `http://localhost:3000`
- [ ] Click "Sign in with Google"
- [ ] Choose: `lachs.beschte@gmail.com`
- [ ] **You'll see permission request for:**
  - Email & Profile
  - **Google Drive** ← New!
- [ ] Click "Allow"
- [ ] ✅ Success!

---

## 🧪 Testing Upload

After signing in:

1. Go to your CMS dashboard
2. Click "Upload" or "Add Reward"
3. Select a test image (e.g., cat.jpg)
4. Click "Upload"
5. Check your Google Drive - file should appear!

---

## 🔧 Troubleshooting

### Error: "access_denied"
**Fix:** Add your email as test user (see Step 1 above)

### Error: "redirect_uri_mismatch"
**Fix:** 
1. Check that redirect URI is exactly:
   `http://localhost:3000/api/auth/callback/google`
2. No trailing slash!
3. Must match exactly in Google Cloud Console

### Error: "invalid_scope"
**Fix:**
1. Go to OAuth consent screen
2. Click "EDIT APP"
3. Add Drive API scope: `.../auth/drive.file`
4. Click "UPDATE" and "SAVE"

### Files not uploading to Drive
**Fix:**
1. Sign out completely
2. Sign in again (to get fresh token with Drive scope)
3. Try upload again

### Error: "No Google Drive access"
**Fix:**
1. Make sure you completed Step 2 (added Drive scope)
2. Sign out and sign in again
3. Click "Allow" when asked for Drive permissions

---

## 📝 What Changed

### Before (Service Account):
- ❌ Complex setup with JSON keys
- ❌ Folder sharing required
- ❌ Storage quota errors
- ❌ Multiple configuration steps

### After (OAuth):
- ✅ Simple "Sign in with Google"
- ✅ Direct access to your Drive
- ✅ No storage quota issues
- ✅ One-time permission grant

---

## 🎉 Once Working

After successful sign-in and upload:
- Files appear directly in your Google Drive
- Optionally create a "QuestCraft Rewards" folder
- Set `GOOGLE_DRIVE_FOLDER_ID` in `.env.local` to upload to that folder
- Otherwise, files upload to root of your Drive

---

## 🚀 Next Steps

Once uploads work:
1. Create a "QuestCraft Rewards" folder in your Drive
2. Get folder ID from URL: `drive.google.com/drive/folders/FOLDER_ID`
3. Add to `.env.local`:
   ```
   GOOGLE_DRIVE_FOLDER_ID="YOUR_FOLDER_ID"
   ```
4. All uploads will go to that folder!

---

**Need help?** Show me the exact error message!

