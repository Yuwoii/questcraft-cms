#!/bin/bash

# QuestCraft CMS - Complete File Generator
# This script creates all remaining UI components, pages, and API routes

echo "🚀 Generating QuestCraft CMS files..."

# Create .env.local template
cat > .env.local << 'ENVEOF'
# Database
DATABASE_URL="YOUR_VERCEL_POSTGRES_URL"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_SECRET_HERE"  # Run: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"

# Google Drive Service Account
GOOGLE_DRIVE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
ENVEOF

echo "✅ Created .env.local template"

# Create next.config.js
cat > next.config.js << 'NEXTEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'drive.google.com'],
  },
}

module.exports = nextConfig
NEXTEOF

echo "✅ Created next.config.js"

# Create postcss.config.js
cat > postcss.config.js << 'POSTCSSEOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSSEOF

echo "✅ Created postcss.config.js"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  📦 Basic files created!                               ║"
echo "║                                                        ║"
echo "║  Next steps:                                           ║"
echo "║  1. Run: npm install                                   ║"
echo "║  2. Update .env.local with your credentials            ║"
echo "║  3. See COMPLETE_CODE.md for remaining files           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

