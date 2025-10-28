import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listGoogleDriveFoldersWithOAuth, GoogleDriveFolder } from '@/lib/google-drive-oauth'
import { isValidDriveId } from '@/lib/google-drive'

// Force dynamic rendering for this route (uses headers for authentication)
export const dynamic = 'force-dynamic'

/**
 * Response type for the Google Drive folders API endpoint
 */
type GoogleDriveFolderResponse = {
  id: string
  name: string
  createdTime: string
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

    // Extract optional parentId from query parameters
    const parentId = request.nextUrl.searchParams.get('parentId')

    // Extract optional pageToken from query parameters
    const pageToken = request.nextUrl.searchParams.get('pageToken')

    // Validate parentId if provided
    if (parentId && !isValidDriveId(parentId)) {
      return NextResponse.json(
        { error: 'Invalid parentId' },
        { status: 400 }
      )
    }

    // List folders from Google Drive
    const result = await listGoogleDriveFoldersWithOAuth(
      accessToken,
      parentId || undefined,
      pageToken || undefined
    )

    // Map to explicit response type with only documented fields
    const response: GoogleDriveFolderResponse[] = result.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      createdTime: folder.createdTime,
    }))

    return NextResponse.json({
      folders: response,
      nextPageToken: result.nextPageToken
    }, { status: 200 })
  } catch (error) {
    console.error('Error listing Google Drive folders:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list folders' },
      { status: 500 }
    )
  }
}

