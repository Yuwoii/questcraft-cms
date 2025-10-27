import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default collection
  const defaultCollection = await prisma.collection.upsert({
    where: { id: 'default-collection' },
    update: {},
    create: {
      id: 'default-collection',
      name: 'Default Collection',
      description: 'Default collection for rewards',
      iconEmoji: '🎁',
      isActive: true,
      sortOrder: 0,
    },
  })

  console.log('✅ Created default collection:', defaultCollection.name)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

