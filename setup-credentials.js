#!/usr/bin/env node

/**
 * Interactive Google Drive Credentials Setup
 * This script helps you format and paste credentials correctly
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║                                                                ║')
  console.log('║   🔐 Google Drive Credentials Setup Helper                    ║')
  console.log('║                                                                ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  console.log('This script will help you paste credentials correctly.\n')

  // Check if JSON file exists
  console.log('📄 Do you have the service account JSON file?\n')
  console.log('Options:')
  console.log('  1. Yes, I have the JSON file')
  console.log('  2. No, I need to create it first')
  console.log('  3. Let me paste the values manually\n')

  const choice = await question('Enter your choice (1-3): ')

  if (choice === '2') {
    console.log('\n📋 Please follow these steps:\n')
    console.log('1. Go to: https://console.cloud.google.com/')
    console.log('2. Create a project and enable Google Drive API')
    console.log('3. Create a Service Account')
    console.log('4. Download the JSON key\n')
    console.log('Then run this script again!\n')
    rl.close()
    return
  }

  if (choice === '1') {
    console.log('\n📂 Please drag and drop your JSON file here, or paste the full path:\n')
    const jsonPath = (await question('JSON file path: ')).trim().replace(/^['"]|['"]$/g, '')

    if (!fs.existsSync(jsonPath)) {
      console.log('\n❌ File not found:', jsonPath)
      console.log('Make sure the path is correct and try again.\n')
      rl.close()
      return
    }

    try {
      const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
      
      const clientEmail = jsonContent.client_email
      const privateKey = jsonContent.private_key

      if (!clientEmail || !privateKey) {
        console.log('\n❌ Invalid JSON file. Missing client_email or private_key.\n')
        rl.close()
        return
      }

      console.log('\n✅ JSON file loaded successfully!\n')
      console.log('📧 Client Email:', clientEmail)
      console.log('🔑 Private Key: Found (length:', privateKey.length, ')\n')

      await updateEnvFile(clientEmail, privateKey)
      
    } catch (error) {
      console.log('\n❌ Error reading JSON file:', error.message)
      console.log('Make sure it\'s a valid JSON file.\n')
      rl.close()
      return
    }
  } else if (choice === '3') {
    console.log('\n📧 Paste your client_email (from JSON file):')
    const clientEmail = await question('client_email: ')

    console.log('\n🔑 Paste your private_key (from JSON file):')
    console.log('⚠️  IMPORTANT: Copy the ENTIRE key including:')
    console.log('   -----BEGIN PRIVATE KEY-----')
    console.log('   ...')
    console.log('   -----END PRIVATE KEY-----\n')
    
    const privateKey = await question('private_key: ')

    if (!clientEmail || !privateKey) {
      console.log('\n❌ Missing values. Please try again.\n')
      rl.close()
      return
    }

    await updateEnvFile(clientEmail, privateKey)
  }

  rl.close()
}

async function updateEnvFile(clientEmail, privateKey) {
  const envPath = path.join(__dirname, '.env.local')
  
  // Read current .env.local
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Ensure private key has proper format for .env
  // The key should have literal \n characters, not actual newlines
  let formattedKey = privateKey
  
  // If the key has actual newlines, convert to \n
  if (formattedKey.includes('\n')) {
    formattedKey = formattedKey.split('\n').join('\\n')
  }
  
  // Update client email
  envContent = envContent.replace(
    /GOOGLE_DRIVE_CLIENT_EMAIL="[^"]*"/,
    `GOOGLE_DRIVE_CLIENT_EMAIL="${clientEmail}"`
  )
  
  // Update private key
  envContent = envContent.replace(
    /GOOGLE_DRIVE_PRIVATE_KEY="[^"]*"/,
    `GOOGLE_DRIVE_PRIVATE_KEY="${formattedKey}"`
  )
  
  // Write back to file
  fs.writeFileSync(envPath, envContent, 'utf8')
  
  console.log('✅ Updated .env.local successfully!\n')
  
  // Show what was written (masked)
  console.log('📝 New values:')
  console.log(`   GOOGLE_DRIVE_CLIENT_EMAIL="${clientEmail}"`)
  console.log(`   GOOGLE_DRIVE_PRIVATE_KEY="${formattedKey.substring(0, 50)}..."\n`)
  
  console.log('🧪 Running test...\n')
  
  // Test the credentials
  require('dotenv').config({ path: envPath })
  
  try {
    const { google } = require('googleapis')
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: formattedKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    await auth.getClient()
    
    console.log('✅ Credentials are valid!\n')
    console.log('🚀 Next steps:')
    console.log('   1. Create "QuestCraft Rewards" folder in Google Drive')
    console.log('   2. Share it with:', clientEmail)
    console.log('   3. Set permission to "Editor"')
    console.log('   4. Run: npm run dev')
    console.log('   5. Try uploading a file!\n')
    
  } catch (error) {
    console.log('❌ Credentials test failed:', error.message)
    console.log('\nPlease check:')
    console.log('   - Client email is correct')
    console.log('   - Private key is complete')
    console.log('   - Google Drive API is enabled\n')
  }
}

main().catch(console.error)

