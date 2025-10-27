import { google } from 'googleapis'
import { Readable } from 'stream'

/**
 * Google Drive file response type
 */
export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  size?: string
  createdTime: string
  webViewLink: string
}

/**
 * Google Drive folder response type
 */
export interface GoogleDriveFolder {
  id: string
  name: string
  createdTime: string
}

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
 * @param accessToken User's OAuth access token
 * @param folderId Optional folder ID to list files from
 * @param mimeTypeFilter Optional MIME type filter (e.g., 'image/' or 'video/')
 */
export async function listGoogleDriveFilesWithOAuth(
  accessToken: string,
  folderId?: string,
  mimeTypeFilter?: string
): Promise<GoogleDriveFile[]> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  try {
    // Build query string
    let query = 'trashed=false'
    
    if (folderId) {
      query = `'${folderId}' in parents and ${query}`
    }
    
    // Add MIME type filter if provided (e.g., for images/videos)
    if (mimeTypeFilter) {
      query = `${query} and (mimeType contains 'image/' or mimeType contains 'video/')`
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, thumbnailLink, size, createdTime, webViewLink)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    })

    const files = response.data.files || []
    
    // Map to our typed interface
    return files.map((file): GoogleDriveFile => ({
      id: file.id as string,
      name: file.name as string,
      mimeType: file.mimeType as string,
      thumbnailLink: file.thumbnailLink || undefined,
      size: file.size || undefined,
      createdTime: file.createdTime as string,
      webViewLink: file.webViewLink as string,
    }))
  } catch (error) {
    console.error('Error listing Google Drive files:', error)
    throw new Error('Failed to list files from Google Drive')
  }
}

/**
 * List folders in Google Drive using OAuth
 * @param accessToken User's OAuth access token
 * @param parentId Optional parent folder ID to list folders from
 */
export async function listGoogleDriveFoldersWithOAuth(
  accessToken: string,
  parentId?: string
): Promise<GoogleDriveFolder[]> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  try {
    // Build query string
    let query = `trashed=false and mimeType='application/vnd.google-apps.folder'`
    
    if (parentId) {
      query = `'${parentId}' in parents and ${query}`
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, createdTime)',
      orderBy: 'name',
      pageSize: 100,
    })

    const folders = response.data.files || []
    
    // Map to our typed interface
    return folders.map((folder): GoogleDriveFolder => ({
      id: folder.id as string,
      name: folder.name as string,
      createdTime: folder.createdTime as string,
    }))
  } catch (error) {
    console.error('Error listing Google Drive folders:', error)
    throw new Error('Failed to list folders from Google Drive')
  }
}

