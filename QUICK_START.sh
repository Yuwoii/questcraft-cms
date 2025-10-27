#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "   QuestCraft CMS - Quick Start Installation"
echo "════════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from /Users/phish/QuestCraft-CMS"
    exit 1
fi

echo "📦 Step 1: Installing shadcn/ui components..."
echo ""
echo "When prompted, use these settings:"
echo "  - Style: default (press Enter)"
echo "  - Base color: slate (press Enter)"  
echo "  - CSS variables: yes (press Enter)"
echo ""
read -p "Press Enter to continue..."

npx shadcn-ui@latest add button card dialog input label select toast badge dropdown-menu

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ shadcn/ui components installed!"
else
    echo "❌ Component installation failed. Try manually."
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "   ✅ Installation Complete!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Set up environment variables:"
echo "   • Edit .env.local"
echo "   • Add Google OAuth credentials"
echo "   • Generate NEXTAUTH_SECRET"
echo ""
echo "2. Initialize database:"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "3. Start dev server:"
echo "   npm run dev"
echo ""
echo "4. Open: http://localhost:3000"
echo ""
echo "📖 Full guide: COMPLETE_SETUP.md"
echo ""

