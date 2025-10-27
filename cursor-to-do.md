🎯 Overview

Goal: Add custom Lucide icon support to CMS collections with emoji fallback, and group rewards by collection with collapsible sections.

Tech Stack:





Next.js 14 (App Router)



Prisma ORM + PostgreSQL



Lucide React icons



Framer Motion for animations



Radix UI components



📦 Phase 1: Database Schema & API (Ticket 1)

Step 1.1: Update Prisma Schema

File: prisma/schema.prisma

Task: Add iconName field to Collection model

Location: After line 17 (after iconEmoji field)

Add:

iconName    String?

Validation: Field should be optional (nullable)



Step 1.2: Update Collections GET API

File: app/api/collections/route.ts

Task: Include iconName in the select clause

Location: Line ~16-20 (inside select object)

Add:

iconName: true,

Validation: API response should include iconName field (null for existing collections)



Step 1.3: Update Collections POST API

File: app/api/collections/route.ts

Task 1: Extract iconName from request body

Location: Line ~42 (destructuring line)

Change from:

const { name, description, iconEmoji } = body

To:

const { name, description, iconEmoji, iconName } = body

Task 2: Include iconName in create data

Location: Line ~48-55 (inside data object)

Add:

iconName: iconName || null,

Validation: POST request with iconName should save it to database



Step 1.4: Update Manifest API

File: app/api/manifest/route.ts

Task 1: Add iconName to collection object in rewards mapping

Location: Line ~37-41 (inside collection object)

Add:

iconName: reward.collection.iconName,

Task 2: Add iconName to getCollectionsSummary

Location: Line ~77-83 (inside return object)

Add:

iconName: col.iconName,

Validation: GET /api/manifest should include iconName in collection objects



Step 1.5: Run Database Migration

Command:

cd /Users/phish/QuestCraft-CMS
npx prisma db push
npx prisma generate

Validation:





Database should have iconName column in collections table



Prisma client should recognize iconName property



No TypeScript errors in API files



🎨 Phase 2: Icon Picker Component (Ticket 2)

Step 2.1: Create Icon Picker Component

File: components/ui/icon-picker.tsx (NEW FILE)

Requirements:





Imports:





useState, useMemo from React



* as Icons from 'lucide-react'



Dialog components from @/components/ui/dialog



Input from @/components/ui/input



Button from @/components/ui/button



cn from @/lib/utils



Props Interface:

interface IconPickerProps {
  value?: string
  onChange: (name?: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}





Popular Icons Array:

const POPULAR_ICONS = [
  'Package', 'Star', 'Trophy', 'Crown', 'Heart', 'Zap',
  'Gift', 'Award', 'Target', 'Flame', 'Sparkles', 'Medal',
  'Gem', 'Rocket', 'Shield'
]





State:





search (string) for filtering icons



Computed Values:





allIconNames: All Lucide icon names (filtered to only components)



filteredIcons: Icons matching search query (case-insensitive)



Functions:





handleIconSelect(iconName): Call onChange(iconName) and close dialog



handleClear(): Call onChange(undefined) and close dialog



renderIcon(iconName): Dynamically render icon component



UI Structure:





Dialog with controlled open prop



Search Input at top



Selected icon preview (if value exists) with Clear button



Popular icons section (grid, 8 columns)



All icons section (scrollable grid, 8 columns)



Each icon button should: 





Show hover effect



Highlight if selected



Display icon name on hover (title attribute)

Validation:





Component exports as named export IconPicker



Clicking icon calls onChange with icon name



Search filters icons correctly



Clear button removes selection



🎯 Phase 3: Collections UI Integration (Ticket 3)

Step 3.1: Install Framer Motion

Command:

cd /Users/phish/QuestCraft-CMS
npm install framer-motion

Validation: framer-motion appears in package.json dependencies



Step 3.2: Create Rewards Grouped View Component

File: components/rewards/rewards-grouped-view.tsx (NEW FILE)

Note: Create components/rewards/ directory first if it doesn't exist

Requirements:





Client Component: Add 'use client' at top



Imports:





React hooks



* as Icons from 'lucide-react'



motion, AnimatePresence from framer-motion



Next.js Image and Link



Lucide icons: Image as ImageIcon, Video, Edit, ChevronDown, ChevronUp



Interfaces:

interface Reward {
  id: string
  name: string
  description: string | null
  rarity: string
  mediaType: string
  googleDriveFileId: string
  googleDriveThumbnailId: string | null
  collection: {
    id: string
    name: string
    iconEmoji: string
    iconName: string | null
  }
  tags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
}

interface RewardsGroupedViewProps {
  rewards: Reward[]
}





Helper Function:

function getGoogleDriveThumbnailUrl(fileId: string) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
}





Constants:

const rarityColors: Record<string, string> = {
  common: 'bg-gray-100 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-orange-100 text-orange-700',
  mythic: 'bg-red-100 text-red-700',
}





Main Component Logic:





Group rewards by collection.id (use 'uncategorized' for null)



Sort collections alphabetically by name



Render CollectionSection for each group



CollectionSection Component:





State: isExpanded (default: true)



Dynamic icon rendering: Icons[collection.iconName as keyof typeof Icons]



Fallback to emoji if no iconName



Header button toggles expand/collapse



Use AnimatePresence and motion.div for animations



Grid of reward cards (reuse markup from original rewards page)

Validation:





Rewards grouped by collection



Collapsible sections work



Animations smooth



Icons display correctly



Emoji fallback works



Step 3.3: Update Rewards Page

File: app/(dashboard)/rewards/page.tsx

Task: Replace flat grid with grouped view

Changes:





Add import:

import RewardsGroupedView from '@/components/rewards/rewards-grouped-view'





Replace grid section (around line 66-152) with:

<RewardsGroupedView rewards={rewards} />

Keep:





Server component (no 'use client')



Empty state



Header with UploadRewardButton

Validation:





Page loads without errors



Rewards display grouped by collection



Empty state still works



Step 3.4: Update Collections Page

File: app/(dashboard)/collections/page.tsx

Task: Display custom icons with emoji fallback

Changes:





Add import:

import * as Icons from 'lucide-react'





Inside map function (around line 44-90), add before return:

const IconComponent = collection.iconName
  ? (Icons[collection.iconName as keyof typeof Icons] as any)
  : null





Replace emoji span (around line 55) with:

{IconComponent ? (
  <IconComponent className="h-10 w-10 text-gray-700" />
) : (
  <span className="text-4xl">{collection.iconEmoji}</span>
)}

Validation:





Collections with iconName show Lucide icon



Collections without iconName show emoji



No TypeScript errors



Step 3.5: Update Create Collection Dialog

File: components/forms/create-collection-dialog.tsx

Task: Integrate IconPicker

Changes:





Add imports:

import * as Icons from 'lucide-react'
import { IconPicker } from '@/components/ui/icon-picker'





Extend form schema:

iconName: z.string().optional(),





Add to defaultValues:

iconName: '',





Add state:

const [iconPickerOpen, setIconPickerOpen] = useState(false)





Add watchers before return:

const iconName = form.watch('iconName')
const iconEmoji = form.watch('iconEmoji')
const IconComponent = iconName ? (Icons[iconName as keyof typeof Icons] as any) : null





Add Icon Picker UI (after name field, before iconEmoji field):

<div className="space-y-2">
  <FormLabel>Icon</FormLabel>
  <div className="flex items-center gap-3">
    <Button
      type="button"
      variant="outline"
      onClick={() => setIconPickerOpen(true)}
      className="flex items-center gap-2"
    >
      {IconComponent ? (
        <IconComponent className="h-5 w-5" />
      ) : (
        <span className="text-xl">{iconEmoji || '📦'}</span>
      )}
      <span>Choose Icon</span>
    </Button>
    {iconName && (
      <span className="text-sm text-gray-600">Selected: {iconName}</span>
    )}
  </div>
  <FormDescription>
    Choose a custom icon or use emoji as fallback
  </FormDescription>
</div>





Add IconPicker component (after closing Dialog tag):

<IconPicker
  value={iconName}
  onChange={(name) => form.setValue('iconName', name || '')}
  open={iconPickerOpen}
  onOpenChange={setIconPickerOpen}
/>

Validation:





Icon picker opens when button clicked



Selected icon shows in preview



Form submits with iconName



Emoji field still works as fallback



✅ Testing Checklist

Phase 1 Tests:





[ ] Database has iconName column



[ ] GET /api/collections returns iconName



[ ] POST /api/collections accepts and saves iconName



[ ] GET /api/manifest includes iconName in collections

Phase 2 Tests:





[ ] IconPicker component renders



[ ] Search filters icons



[ ] Clicking icon selects it



[ ] Clear button removes selection



[ ] Popular icons section displays

Phase 3 Tests:





[ ] Rewards page groups by collection



[ ] Collapsible sections work



[ ] Animations smooth



[ ] Collections page shows custom icons



[ ] Create dialog has icon picker



[ ] Creating collection with icon works



[ ] Emoji fallback works everywhere



[ ] Uncategorized section appears for rewards without collection



🚨 Common Pitfalls to Avoid





Template Literals: Use backticks () not escaped backticks (\)



Dynamic Icon Rendering: Cast to any to avoid TypeScript errors



Prisma Client: Always run npx prisma generate after schema changes



Server vs Client: Keep rewards/collections pages as server components



Null Handling: Always check for null/undefined before accessing properties



🎯 Success Criteria

Feature is complete when:





✅ Collections can have custom Lucide icons



✅ Emoji fallback works when no icon selected



✅ Rewards page groups by collection with collapsible sections



✅ Collections page displays custom icons



✅ Icon picker has search and popular icons



✅ Animations are smooth



✅ No TypeScript errors



✅ No runtime errors



✅ iOS manifest includes iconName (for future use)



📝 Notes for Cursor AI





Work through phases sequentially



Test after each step



Don't skip the Prisma generate step



Use proper TypeScript types



Follow existing code style



Keep server/client component boundaries clear



Ensure all template literals use proper syntax

Good luck! 🚀