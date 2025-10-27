#!/usr/bin/env node

/**
 * Test Google Drive Connection
 * Run: node test-google-drive.js
 */

require('dotenv').config({ path: '.env.local' })
const { google } = require('googleapis')

async function testGoogleDrive() {
  console.log('🔍 Testing Google Drive Connection...\n')

  // Check environment variables
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY

  console.log('1️⃣ Checking environment variables:')
  
  if (!clientEmail || clientEmail === 'your-service-account@project.iam.gserviceaccount.com') {
    console.log('   ❌ GOOGLE_DRIVE_CLIENT_EMAIL not set or still placeholder')
    console.log('   📝 Update .env.local with your service account email')
    return false
  }
  console.log(`   ✅ Client Email: ${clientEmail}`)

  if (!privateKey || privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
    console.log('   ❌ GOOGLE_DRIVE_PRIVATE_KEY not set or still placeholder')
    console.log('   📝 Update .env.local with your private key from JSON file')
    return false
  }
  console.log('   ✅ Private Key: Found (length: ' + privateKey.length + ')')

  // Test authentication
  console.log('\n2️⃣ Testing authentication:')
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    const authClient = await auth.getClient()
    console.log('   ✅ Authentication successful!')

    // Test Drive API access
    console.log('\n3️⃣ Testing Drive API access:')
    
    const drive = google.drive({ version: 'v3', auth })
    const response = await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    })

    console.log('   ✅ Drive API accessible!')
    console.log(`   📁 Can access Drive files`)

    // Test folder creation
    console.log('\n4️⃣ Testing folder access:')
    
    const folderResponse = await drive.files.list({
      q: "name='QuestCraft Rewards' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name)',
      spaces: 'drive',
    })

    if (folderResponse.data.files && folderResponse.data.files.length > 0) {
      console.log('   ✅ Found "QuestCraft Rewards" folder!')
      console.log(`   📁 Folder ID: ${folderResponse.data.files[0].id}`)
    } else {
      console.log('   ⚠️  "QuestCraft Rewards" folder not found')
      console.log('   📝 Create folder and share with service account')
    }

    console.log('\n✅ All tests passed! Google Drive is ready to use.')
    return true

  } catch (error) {
    console.log('   ❌ Authentication failed!')
    console.log('\n📋 Error details:')
    console.log(error.message)
    
    if (error.message.includes('DECODER')) {
      console.log('\n💡 This looks like a private key format issue.')
      console.log('   Make sure your private key has \\n for line breaks')
      console.log('   Example: "-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"')
    }
    
    return false
  }
}

testGoogleDrive()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })

