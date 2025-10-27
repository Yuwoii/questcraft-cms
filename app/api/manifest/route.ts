import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Auto-generate manifest.json from database
 * iOS app can call this endpoint to get latest rewards automatically!
 */
export async function GET() {
  try {
    // Fetch all active rewards from database
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        collection: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Generate manifest
    const manifest = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      totalRewards: rewards.length,
      rewards: rewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description || undefined,
        rarity: reward.rarity,
        type: reward.mediaType,
        fileID: reward.googleDriveFileId,
        thumbnailID: reward.googleDriveThumbnailId || undefined,
        collection: {
          id: reward.collection.id,
          name: reward.collection.name,
          emoji: reward.collection.iconEmoji,
          iconName: reward.collection.iconName,
        },
        tags: reward.tags.map((rt) => rt.tag.name),
        createdAt: reward.createdAt.toISOString(),
      })),
      collections: await getCollectionsSummary(),
    }

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/json',
        // Allow CORS for iOS app
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error generating manifest:', error)
    return NextResponse.json(
      { error: 'Failed to generate manifest' },
      { status: 500 }
    )
  }
}

async function getCollectionsSummary() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { rewards: true },
      },
    },
  })

  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    description: col.description || undefined,
    emoji: col.iconEmoji,
    iconName: col.iconName,
    rewardCount: col._count.rewards,
  }))
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

