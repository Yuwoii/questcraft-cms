# Install shadcn/ui Components

## Step 1: Install Dependencies (2 min)

```bash
cd /Users/phish/QuestCraft-CMS

# Install all npm packages
npm install

# This installs Next.js, Tailwind, Prisma, etc.
```

## Step 2: Add shadcn/ui Components (3 min)

Run these commands one by one:

```bash
# Button component
npx shadcn-ui@latest add button

# Card component
npx shadcn-ui@latest add card

# Dialog component
npx shadcn-ui@latest add dialog

# Input component
npx shadcn-ui@latest add input

# Label component
npx shadcn-ui@latest add label

# Select component
npx shadcn-ui@latest add select

# Toast component
npx shadcn-ui@latest add toast

# Badge component
npx shadcn-ui@latest add badge

# Dropdown Menu component
npx shadcn-ui@latest add dropdown-menu
```

Each command will:
- ✅ Create component files in `components/ui/`
- ✅ Update your dependencies
- ✅ Configure properly

**Note:** When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

## Step 3: Verify Installation

Check that these files exist:
```
components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── toast.tsx
├── badge.tsx
└── dropdown-menu.tsx
```

## Step 4: Continue to Admin Pages

Once components are installed, see `ADMIN_PAGES.md` for the 5 main pages!

---

## ⚡ Quick Install (All at once)

If you want to install all at once:

```bash
npx shadcn-ui@latest add button card dialog input label select toast badge dropdown-menu
```

✅ Done! Now proceed to `ADMIN_PAGES.md`

