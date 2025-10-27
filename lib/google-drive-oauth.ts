import { google } from 'googleapis'
import { Readable } from 'stream'

/**
 * Upload a file to Google Drive using the user's OAuth token
 * @param accessToken User's OAuth access token from NextAuth session
 * @param fileBuffer File data as Buffer
 * @param filename Name for the file in Drive
 * @param mimeType MIME type of the file
 * @param folderId Optional folder ID to upload to
 * @returns File ID and web view link
 */
export async function uploadToGoogleDriveWithOAuth(
  accessToken: string,
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  folderId?: string
) {
  // Create OAuth2 client with the user's access token
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const fileMetadata: any = {
    name: filename,
  }

  if (folderId) {
    fileMetadata.parents = [folderId]
  }

  // Convert buffer to stream
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
 * Delete a file from Google Drive using OAuth
 */
export async function deleteFromGoogleDriveWithOAuth(
  accessToken: string,
  fileId: string
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })

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
 * List files in a folder using OAuth
 */
export async function listGoogleDriveFilesWithOAuth(
  accessToken: string,
  folderId?: string
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  try {
    const query = folderId
      ? `'${folderId}' in parents and trashed=false`
      : 'trashed=false'

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, webViewLink, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    })

    return response.data.files || []
  } catch (error) {
    console.error('Error listing Google Drive files:', error)
    throw new Error('Failed to list files from Google Drive')
  }
}

