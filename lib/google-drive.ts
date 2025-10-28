import { google } from 'googleapis'
import { Readable } from 'stream'

/**
 * Validates a Google Drive folder/file ID
 * @param driveId The drive ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidDriveId(driveId: string): boolean {
  // Google Drive IDs contain only letters, digits, underscores, and hyphens
  return /^[a-zA-Z0-9_-]+$/.test(driveId)
}

// Initialize Google Drive client
export function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })

  const drive = google.drive({ version: 'v3', auth })
  return drive
}

/**
 * Upload a file to Google Drive
 * @param file File buffer or stream
 * @param filename Name for the file in Drive
 * @param mimeType MIME type of the file
 * @param folderId Optional folder ID to upload to
 * @returns File ID and web view link
 */
export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  folderId?: string
) {
  const drive = getDriveClient()

  const fileMetadata: any = {
    name: filename,
  }

  if (folderId) {
    fileMetadata.parents = [folderId]
  }

  // Convert buffer to stream for googleapis
  const stream = Readable.from(fileBuffer)

  const media = {
    mimeType,
    body: stream,
  }

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink',
      supportsAllDrives: true, // Required for service accounts uploading to shared folders
    })

    const fileId = response.data.id

    // Make the file publicly accessible (anyone with link can view)
    if (fileId) {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true, // Required for service accounts
      })
    }

    return {
      fileId: fileId as string,
      filename: response.data.name as string,
      webViewLink: response.data.webViewLink as string,
      webContentLink: response.data.webContentLink as string,
    }
  } catch (error) {
    console.error('Error uploading to Google Drive:', error)
    throw new Error('Failed to upload file to Google Drive')
  }
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFromGoogleDrive(fileId: string) {
  const drive = getDriveClient()

  try {
    await drive.files.delete({
      fileId: fileId,
    })
    return true
  } catch (error) {
    console.error('Error deleting from Google Drive:', error)
    throw new Error('Failed to delete file from Google Drive')
  }
}

/**
 * Get or create a folder in Google Drive
 */
export async function getOrCreateFolder(folderName: string) {
  const drive = getDriveClient()

  try {
    // Search for existing folder
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    })

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id as string
    }

    // Create folder if it doesn't exist
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    })

    const folderId = folder.data.id as string

    // Make folder shareable
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    return folderId
  } catch (error) {
    console.error('Error getting/creating folder:', error)
    throw new Error('Failed to get or create folder')
  }
}
