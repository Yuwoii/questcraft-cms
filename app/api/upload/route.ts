import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToGoogleDriveWithOAuth } from '@/lib/google-drive-oauth'
import { getGoogleDriveThumbnailUrl } from '@/lib/generate-thumbnail'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderName = formData.get('folderName') as string || 'QuestCraft Rewards'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, MOV' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 50MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get the user's OAuth access token from the session
    const accessToken = (session as any).accessToken
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Google Drive access. Please sign out and sign in again to grant Drive permissions.' },
        { status: 403 }
      )
    }

    // Optional: Upload to a specific folder in YOUR Drive
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

    // Upload to Google Drive using YOUR account
    const result = await uploadToGoogleDriveWithOAuth(
      accessToken,
      buffer,
      file.name,
      file.type,
      folderId
    )

    // Auto-generate thumbnail URL for videos
    let thumbnailUrl = null
    if (file.type.startsWith('video/')) {
      thumbnailUrl = getGoogleDriveThumbnailUrl(result.fileId)
    }

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      filename: result.filename,
      webViewLink: result.webViewLink,
      mimeType: file.type,
      thumbnailUrl, // Auto-generated for videos!
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Increase max body size for file uploads
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds max
