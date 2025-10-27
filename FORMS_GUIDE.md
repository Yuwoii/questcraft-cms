# 📝 CMS Forms Guide

## Overview

The QuestCraft CMS now has **fully functional forms** with validation, error handling, and real-time feedback. No more Prisma Studio required for basic operations!

---

## ✅ What's Been Built

### 1. Create Collection Form

**Location:** `components/forms/create-collection-dialog.tsx`

**Fields:**
- **Name*** (required, 2-100 characters)
- **Icon Emoji** (optional, up to 10 characters, default: 📦)
- **Description** (optional, up to 500 characters)

**Usage:**
1. Click "New Collection" button
2. Fill in the form
3. Click "Create Collection"
4. Dialog closes and page refreshes with new collection

**Validation:**
- Name must be at least 2 characters
- All fields validated in real-time with Zod

---

### 2. Create Tag Form

**Location:** `components/forms/create-tag-dialog.tsx`

**Fields:**
- **Name*** (required, 2-50 characters)
- **Color*** (required, hex format like #3498db)

**Features:**
- **8 Preset Colors:** Click to select common colors
- **Custom Color:** Enter any hex color manually
- **Live Preview:** See color in preview circles

**Usage:**
1. Click "New Tag" button
2. Enter tag name
3. Select a preset color OR enter custom hex
4. Click "Create Tag"

**Validation:**
- Name must be 2-50 characters
- Color must be valid hex format (#RRGGBB)

---

### 3. Upload Reward Form

**Location:** `components/forms/upload-reward-dialog.tsx`

**Fields:**
- **Name*** (required, 2-100 characters)
- **Description** (optional, up to 500 characters)
- **Rarity*** (required: Common, Rare, Epic, Legendary, Mythic)
- **Type*** (required: Image or Video)
- **Collection*** (required: dropdown of your collections)
- **Google Drive File ID*** (required, min 10 characters)
- **Thumbnail File ID** (optional, only shown for videos)

**Features:**
- **Dynamic Collection Loading:** Fetches your collections from database
- **Conditional Fields:** Thumbnail field only appears for videos
- **Emoji Icons:** Collections shown with their emoji icons
- **Full Validation:** All required fields validated

**Usage:**
1. Create at least one collection first
2. Upload your media to Google Drive
3. Share the file and get the file ID
4. Click "Upload Reward" button
5. Fill in all fields
6. Click "Upload Reward"

**Validation:**
- All required fields must be filled
- File ID must be at least 10 characters
- Collection must be selected from dropdown

---

## 🔌 API Routes

### GET /api/collections
**Purpose:** Fetch all collections for dropdowns

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Cat Collection",
    "iconEmoji": "🐱"
  }
]
```

### POST /api/collections
**Purpose:** Create a new collection

**Request Body:**
```json
{
  "name": "Cat Collection",
  "description": "Cute cat images",
  "iconEmoji": "🐱"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Cat Collection",
  "description": "Cute cat images",
  "iconEmoji": "🐱",
  "isActive": true,
  "sortOrder": 0,
  "createdAt": "2025-10-02T...",
  "updatedAt": "2025-10-02T..."
}
```

### POST /api/tags
**Purpose:** Create a new tag

**Request Body:**
```json
{
  "name": "Cute",
  "color": "#3498db"
}
```

### POST /api/rewards
**Purpose:** Create a new reward

**Request Body:**
```json
{
  "name": "Cute Cat Photo",
  "description": "A cat sleeping",
  "rarity": "common",
  "mediaType": "image",
  "googleDriveFileId": "1a2b3c4d5e6f7g8h9i",
  "googleDriveThumbnailId": null,
  "collectionId": "uuid"
}
```

---

## 🎨 Form Architecture

### Tech Stack
- **React Hook Form:** Form state management
- **Zod:** Schema validation
- **shadcn/ui:** UI components
- **Next.js App Router:** API routes

### Form Flow
1. User clicks button
2. Dialog opens with form
3. User fills fields (real-time validation)
4. User submits form
5. Form validates with Zod
6. If valid → API POST request
7. If successful → Close dialog, refresh page
8. If error → Show alert

### Validation Strategy
- **Client-side:** Zod schema validation (instant feedback)
- **Server-side:** Additional validation in API routes
- **Type-safe:** TypeScript types inferred from Zod schemas

---

## 🛠️ Customization

### Adding a New Field

**Example: Add "Category" to Collections**

1. **Update Zod Schema:**
```tsx
const formSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  iconEmoji: z.string().max(10).optional(),
  category: z.string().min(2).max(50), // New field
})
```

2. **Add Form Field:**
```tsx
<FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <FormControl>
        <Input placeholder="Animals" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

3. **Update API Route:**
```ts
const { name, description, iconEmoji, category } = body

const collection = await prisma.collection.create({
  data: {
    name,
    description: description || null,
    iconEmoji: iconEmoji || '📦',
    category, // Add to database insert
    // ...
  },
})
```

4. **Update Prisma Schema** (if database field doesn't exist):
```prisma
model Collection {
  // ... existing fields
  category String?
}
```

Then run:
```bash
npx prisma db push
```

---

## 🎯 Best Practices

### Form Validation
✅ **Do:**
- Validate on client AND server
- Provide clear error messages
- Use appropriate field types
- Set sensible min/max lengths

❌ **Don't:**
- Trust client validation alone
- Use generic error messages
- Allow unlimited input lengths

### User Experience
✅ **Do:**
- Show loading states
- Disable fields during submission
- Auto-refresh after success
- Handle errors gracefully

❌ **Don't:**
- Allow multiple submissions
- Close dialog during save
- Lose user input on error

### API Design
✅ **Do:**
- Validate all inputs
- Return meaningful errors
- Use proper HTTP status codes
- Protect routes with auth

❌ **Don't:**
- Trust client data
- Return generic "500" errors
- Expose sensitive information
- Skip authentication checks

---

## 🐛 Troubleshooting

### Form Won't Submit
- Check browser console for errors
- Verify all required fields filled
- Check validation error messages
- Ensure API route is running

### Dialog Won't Open
- Check button onClick handler
- Verify state management
- Look for React errors in console

### API Returns Error
- Check server logs (terminal)
- Verify database connection
- Check authentication status
- Validate request body format

### Collections Not Loading in Dropdown
- Ensure you've created at least one collection
- Check network tab for API request
- Verify GET /api/collections works
- Check authentication

---

## 📊 Database Schema

### Collections
```prisma
model Collection {
  id          String   @id @default(uuid())
  name        String
  description String?
  iconEmoji   String   @default("📦")
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  rewards Reward[]
}
```

### Tags
```prisma
model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  color     String   @default("#3498db")
  createdAt DateTime @default(now())

  rewards RewardTag[]
}
```

### Rewards
```prisma
model Reward {
  id                      String   @id @default(uuid())
  name                    String
  description             String?
  rarity                  String   // common, rare, epic, legendary, mythic
  mediaType               String   // image, video
  googleDriveFileId       String
  googleDriveThumbnailId  String?
  isActive                Boolean  @default(true)
  sortOrder               Int      @default(0)
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  collectionId String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  tags RewardTag[]
}
```

---

## 🚀 Next Steps

### Potential Enhancements

1. **Edit Forms:**
   - Add edit buttons to collections/tags/rewards
   - Pre-populate form with existing data
   - Use same dialog components

2. **Delete Confirmation:**
   - Add delete buttons
   - Show confirmation dialog
   - Handle cascade deletes

3. **Bulk Operations:**
   - Select multiple items
   - Bulk delete/activate
   - Bulk tag assignment

4. **File Upload:**
   - Direct Google Drive upload
   - Drag & drop interface
   - Progress indicators

5. **Tag Assignment:**
   - Multi-select tag dropdown
   - Assign tags to rewards
   - Tag filtering

6. **Image Preview:**
   - Load thumbnails from Drive
   - Show preview in reward cards
   - Lightbox for full-size view

7. **Search & Filter:**
   - Search rewards by name
   - Filter by collection/rarity
   - Sort options

8. **Validation Improvements:**
   - Check for duplicate names
   - Validate Google Drive links
   - Check file existence

---

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Docs](https://www.prisma.io/docs/)

---

## ✅ Testing Checklist

### Collection Form
- [ ] Can create collection with all fields
- [ ] Can create collection with only name
- [ ] Name validation works (min 2 chars)
- [ ] Emoji field accepts emojis
- [ ] Form resets after submission
- [ ] Page refreshes and shows new collection
- [ ] Error handling works

### Tag Form
- [ ] Can create tag with preset color
- [ ] Can create tag with custom hex color
- [ ] Name validation works
- [ ] Color validation works (hex format)
- [ ] Color preview buttons work
- [ ] Form resets after submission
- [ ] New tag appears in list

### Reward Form
- [ ] Collections load in dropdown
- [ ] All fields validate correctly
- [ ] Thumbnail field shows only for videos
- [ ] Can create image reward
- [ ] Can create video reward
- [ ] Form resets after submission
- [ ] New reward appears in list

### API Routes
- [ ] All routes require authentication
- [ ] Validation errors return 400
- [ ] Success returns 200/201
- [ ] Server errors return 500
- [ ] Database saves correctly

---

Ready to manage your rewards! 🎉



