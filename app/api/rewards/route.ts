import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      rarity,
      mediaType,
      googleDriveFileId,
      googleDriveThumbnailId,
      collectionId,
    } = body

    if (!name || !rarity || !mediaType || !googleDriveFileId || !collectionId) {
      return NextResponse.json(
        { error: 'Name, rarity, mediaType, googleDriveFileId, and collectionId are required' },
        { status: 400 }
      )
    }

    // Validate rarity
    const validRarities = ['common', 'rare', 'epic', 'legendary', 'mythic']
    if (!validRarities.includes(rarity)) {
      return NextResponse.json(
        { error: 'Invalid rarity. Must be: common, rare, epic, legendary, or mythic' },
        { status: 400 }
      )
    }

    // Validate mediaType
    const validMediaTypes = ['image', 'video']
    if (!validMediaTypes.includes(mediaType)) {
      return NextResponse.json(
        { error: 'Invalid mediaType. Must be: image or video' },
        { status: 400 }
      )
    }

    const reward = await prisma.reward.create({
      data: {
        name,
        description: description || null,
        rarity,
        mediaType,
        googleDriveFileId,
        googleDriveThumbnailId: googleDriveThumbnailId || null,
        collectionId,
        isActive: true,
        sortOrder: 0,
      },
    })

    return NextResponse.json(reward, { status: 201 })
  } catch (error) {
    console.error('Error creating reward:', error)
    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    )
  }
}


