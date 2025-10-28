import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listGoogleDriveFilesWithOAuth, GoogleDriveFile } from '@/lib/google-drive-oauth'
import { isValidDriveId } from '@/lib/google-drive'

// Force dynamic rendering for this route (uses headers for authentication)
export const dynamic = 'force-dynamic'

/**
 * Response type for the Google Drive files API endpoint
 */
type GoogleDriveFileResponse = {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  size?: string
  createdTime: string
  webViewLink: string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract the access token from the session
    const accessToken = (session as any).accessToken
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Google Drive access. Please sign out and sign in again to grant Drive permissions.' },
        { status: 403 }
      )
    }

    // Extract optional folderId from query parameters
    const folderId = request.nextUrl.searchParams.get('folderId')

    // Validate folderId if provided
    if (folderId && !isValidDriveId(folderId)) {
      return NextResponse.json(
        { error: 'Invalid folderId' },
        { status: 400 }
      )
    }

    // List files from Google Drive with server-side MIME filtering
    const files: GoogleDriveFile[] = await listGoogleDriveFilesWithOAuth(
      accessToken,
      folderId || undefined,
      'media' // Enable MIME type filtering for images/videos
    )

    // Map to explicit response type with only documented fields
    const response: GoogleDriveFileResponse[] = files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      thumbnailLink: file.thumbnailLink,
      size: file.size,
      createdTime: file.createdTime,
      webViewLink: file.webViewLink,
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error listing Google Drive files:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list files' },
      { status: 500 }
    )
  }
}

