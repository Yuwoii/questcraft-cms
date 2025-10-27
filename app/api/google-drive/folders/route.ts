import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listGoogleDriveFoldersWithOAuth, GoogleDriveFolder } from '@/lib/google-drive-oauth'

/**
 * Response type for the Google Drive folders API endpoint
 */
type GoogleDriveFolderResponse = {
  id: string
  name: string
  createdTime: string
}

/**
 * Validates a Google Drive folder ID
 * @param folderId The folder ID to validate
 * @returns true if valid, false otherwise
 */
function isValidFolderId(folderId: string): boolean {
  // Google Drive IDs contain only letters, digits, underscores, and hyphens
  return /^[a-zA-Z0-9_-]+$/.test(folderId)
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

    // Validate parentId if provided
    if (parentId && !isValidFolderId(parentId)) {
      return NextResponse.json(
        { error: 'Invalid parentId' },
        { status: 400 }
      )
    }

    // List folders from Google Drive
    const folders: GoogleDriveFolder[] = await listGoogleDriveFoldersWithOAuth(
      accessToken,
      parentId || undefined
    )

    // Map to explicit response type with only documented fields
    const response: GoogleDriveFolderResponse[] = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      createdTime: folder.createdTime,
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error listing Google Drive folders:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list folders' },
      { status: 500 }
    )
  }
}

