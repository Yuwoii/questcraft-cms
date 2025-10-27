/**
 * Auto-generate video thumbnails from Google Drive
 */

import { google } from 'googleapis';

export async function generateThumbnailFromVideo(accessToken: string, videoFileId: string): Promise<string | null> {
  try {
    const drive = google.drive({
      version: 'v3',
      auth: new google.auth.OAuth2(),
    });
    
    // Set the access token
    drive.context._options.auth = accessToken;
    
    // Google Drive automatically generates thumbnails for videos
    // Use the Drive API's thumbnail link
    const response = await drive.files.get({
      fileId: videoFileId,
      fields: 'thumbnailLink,id',
      supportsAllDrives: true,
    });
    
    if (response.data.thumbnailLink) {
      // Extract the thumbnail URL and convert to high-quality version
      const thumbnailLink = response.data.thumbnailLink;
      // Replace s220 (small) with s1920 (large) for better quality
      const highQualityThumbnail = thumbnailLink.replace(/=s\d+/, '=s800');
      return highQualityThumbnail;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

/**
 * Get high-quality thumbnail URL from Google Drive file ID
 * Google Drive auto-generates these for videos
 */
export function getGoogleDriveThumbnailUrl(fileId: string, size: number = 800): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

