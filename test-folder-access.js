#!/usr/bin/env node

/**
 * Test if service account can access the Google Drive folder
 */

const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')

// Manually read .env.local
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    let value = match[2].trim()
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
})

async function testFolderAccess() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║                                                                ║')
  console.log('║   🔍 Testing Google Drive Folder Access                       ║')
  console.log('║                                                                ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  // Check environment variables
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  console.log('📋 Configuration Check:\n')
  console.log(`   Client Email: ${clientEmail ? '✅ ' + clientEmail : '❌ Missing'}`)
  console.log(`   Private Key: ${privateKey ? '✅ Found (' + privateKey.length + ' chars)' : '❌ Missing'}`)
  console.log(`   Folder ID: ${folderId ? '✅ ' + folderId : '❌ Missing'}\n`)

  if (!clientEmail || !privateKey || !folderId) {
    console.log('❌ Missing credentials in .env.local\n')
    return
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    const drive = google.drive({ version: 'v3', auth })

    console.log('🔐 Authenticating...')
    await auth.getClient()
    console.log('✅ Authentication successful!\n')

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log(`📁 Checking folder: ${folderId}\n`)

    // Try to access the folder
    const folder = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, permissions, owners',
      supportsAllDrives: true,
    })

    console.log('✅ SUCCESS! Folder accessible!\n')
    console.log('📂 Folder Details:\n')
    console.log(`   Name: ${folder.data.name}`)
    console.log(`   ID: ${folder.data.id}`)
    console.log(`   Type: ${folder.data.mimeType}\n`)

    // Try to list files in folder
    console.log('📋 Testing file listing...\n')
    const files = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
      pageSize: 10,
      supportsAllDrives: true,
    })

    console.log(`✅ Can list files! Found ${files.data.files?.length || 0} files.\n`)

    if (files.data.files && files.data.files.length > 0) {
      console.log('   Files in folder:')
      files.data.files.forEach((file, i) => {
        console.log(`   ${i + 1}. ${file.name} (${file.mimeType})`)
      })
      console.log()
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🎉 ALL TESTS PASSED!\n')
    console.log('Your CMS should work now. Try uploading a file!\n')

  } catch (error) {
    console.log('❌ ERROR!\n')
    
    if (error.code === 404) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      console.log('🔍 DIAGNOSIS: Folder not found or not shared\n')
      console.log('This means:\n')
      console.log('   1. ❌ Folder ID might be incorrect, OR')
      console.log('   2. ❌ Folder not shared with service account, OR')
      console.log('   3. ❌ Service account has no permissions\n')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      console.log('✅ HOW TO FIX:\n')
      console.log('STEP 1: Verify Folder ID')
      console.log('   1. Go to: https://drive.google.com')
      console.log('   2. Open "QuestCraft Rewards" folder')
      console.log('   3. Check URL:')
      console.log('      https://drive.google.com/drive/folders/YOUR_ID_HERE')
      console.log('                                              ^^^^^^^^^^^^')
      console.log(`   4. Your .env.local has: ${folderId}`)
      console.log('   5. Do they match?\n')
      console.log('STEP 2: Share Folder with Service Account')
      console.log('   1. Right-click "QuestCraft Rewards" folder')
      console.log('   2. Click "Share"')
      console.log('   3. Add this email:')
      console.log(`      ${clientEmail}`)
      console.log('   4. Change permission to "Editor" (not Viewer!)')
      console.log('   5. Uncheck "Notify people"')
      console.log('   6. Click "Share"\n')
      console.log('STEP 3: Run this test again')
      console.log('   node test-folder-access.js\n')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    } else if (error.code === 403) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      console.log('🔍 DIAGNOSIS: Permission denied\n')
      console.log('The folder exists but service account has no access.\n')
      console.log('✅ HOW TO FIX:\n')
      console.log('   1. Go to Google Drive')
      console.log('   2. Right-click "QuestCraft Rewards" folder')
      console.log('   3. Click "Share"')
      console.log('   4. Make sure this email is listed:')
      console.log(`      ${clientEmail}`)
      console.log('   5. Change permission to "Editor"')
      console.log('   6. Click "Done"\n')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    } else {
      console.log('Error:', error.message)
      console.log('Code:', error.code)
      console.log('\nFull error:', error)
    }
  }
}

testFolderAccess().catch(console.error)

