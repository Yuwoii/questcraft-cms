'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { FolderOpen, Loader2, AlertCircle } from 'lucide-react'

// Ensure Google Picker appears above all other modals and is interactive
const pickerStyles = `
  /* Google Picker modal and backdrop - must be above Radix Dialog (z-50) */
  .picker-dialog {
    z-index: 10000 !important;
    pointer-events: auto !important;
  }
  .picker-dialog-bg {
    z-index: 9999 !important;
    pointer-events: auto !important;
  }
  .picker {
    z-index: 10000 !important;
    pointer-events: auto !important;
  }
  /* Google Picker container */
  div[role="dialog"][aria-label*="Google"],
  div[role="dialog"][aria-label*="picker"],
  div[role="dialog"][aria-label*="Drive"] {
    z-index: 10000 !important;
    pointer-events: auto !important;
  }
  /* Ensure picker backdrop is clickable */
  .picker-dialog-bg, .picker > div:first-child {
    z-index: 9999 !important;
    pointer-events: auto !important;
  }
  /* Catch-all for any Google Picker iframe or container */
  iframe[src*="picker"],
  iframe[src*="drive.google.com"] {
    z-index: 10000 !important;
    pointer-events: auto !important;
  }
`

// Reuse the existing GoogleDriveFile interface structure
interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  size?: string
  createdTime: string
  webViewLink: string
}

interface GoogleDrivePickerProps {
  onFileSelect: (file: GoogleDriveFile) => void
  accept?: 'images' | 'videos' | 'both'
}

export function GoogleDrivePicker({ 
  onFileSelect, 
  accept = 'both' 
}: GoogleDrivePickerProps) {
  const { data: session, status } = useSession()
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inject CSS for picker z-index on mount
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.id = 'google-picker-zindex-fix'
    styleElement.textContent = pickerStyles
    
    if (!document.getElementById('google-picker-zindex-fix')) {
      document.head.appendChild(styleElement)
    }

    return () => {
      const existingStyle = document.getElementById('google-picker-zindex-fix')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  // Load the Picker API
  useEffect(() => {
    // Check if gapi is available
    if (typeof window === 'undefined' || !window.gapi) {
      return
    }

    // Load the picker library
    const loadPicker = () => {
      window.gapi.load('picker', () => {
        setPickerApiLoaded(true)
      })
    }

    // If gapi is ready, load immediately, otherwise wait a bit
    if (typeof window.gapi.load === 'function') {
      loadPicker()
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window.gapi?.load === 'function') {
          loadPicker()
          clearInterval(checkInterval)
        }
      }, 100)

      // Cleanup after 5 seconds if not loaded
      setTimeout(() => clearInterval(checkInterval), 5000)

      return () => clearInterval(checkInterval)
    }
  }, [])

  // Handle picker callback
  const handlePickerCallback = useCallback((data: google.picker.ResponseObject) => {
    if (data.action === google.picker.Action.PICKED && data.docs && data.docs.length > 0) {
      const doc = data.docs[0]
      
      // Transform Picker response to GoogleDriveFile format
      const file: GoogleDriveFile = {
        id: doc.id,
        name: doc.name,
        mimeType: doc.mimeType,
        thumbnailLink: doc.thumbnailUrl,
        webViewLink: doc.url,
        createdTime: doc.lastEditedUtc 
          ? new Date(doc.lastEditedUtc).toISOString() 
          : new Date().toISOString(),
        size: doc.sizeBytes?.toString(),
      }

      // Validate that it's an image or video
      const isValid = file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')
      
      if (isValid) {
        onFileSelect(file)
        setIsPickerOpen(false)
      } else {
        setError('Please select an image or video file')
      }
    } else if (data.action === google.picker.Action.CANCEL) {
      setIsPickerOpen(false)
    }
  }, [onFileSelect])

  // Open the picker
  const openPicker = useCallback(() => {
    // Validate environment variables (API key and App ID are optional with OAuth)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID

    // Check if session has access token
    if (!session?.accessToken) {
      setError('No Google Drive access. Please sign out and sign in again.')
      return
    }

    // Check if picker API is loaded
    if (!pickerApiLoaded || !window.google?.picker) {
      setError('Google Picker API is still loading. Please try again in a moment.')
      return
    }

    setError(null)
    setIsPickerOpen(true)

    // Create the picker
    const builder = new google.picker.PickerBuilder()
      .setOAuthToken(session.accessToken as string)
      .setCallback(handlePickerCallback)
      .setTitle('Select from Google Drive')
      .setOrigin(window.location.origin)

    // Add optional API key and App ID if provided (improves quota management)
    if (apiKey) {
      builder.setDeveloperKey(apiKey)
    }
    if (appId) {
      builder.setAppId(appId)
    }

    // Add views based on accept prop
    if (accept === 'images' || accept === 'both') {
      const imageView = new google.picker.DocsView(google.picker.ViewId.DOCS_IMAGES)
      imageView.setMimeTypes('image/png,image/jpeg,image/jpg,image/gif,image/webp')
      builder.addView(imageView)
    }

    if (accept === 'videos' || accept === 'both') {
      const videoView = new google.picker.DocsView(google.picker.ViewId.DOCS_VIDEOS)
      videoView.setMimeTypes('video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv')
      builder.addView(videoView)
    }

    // Build and show the picker
    const picker = builder.build()
    picker.setVisible(true)
  }, [session, pickerApiLoaded, accept, handlePickerCallback])

  // Loading state
  if (status === 'loading') {
    return (
      <Button disabled variant="outline" className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading session...
      </Button>
    )
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Authentication Required</span>
        </div>
        <p className="text-sm text-red-600">
          Please sign in to select files from Google Drive.
        </p>
      </div>
    )
  }

  // Authenticated - show picker button
  return (
    <div className="space-y-4">
      <Button
        onClick={openPicker}
        disabled={!pickerApiLoaded || isPickerOpen}
        variant="outline"
        className="w-full"
        type="button"
      >
        {isPickerOpen ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Picker Open...
          </>
        ) : !pickerApiLoaded ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Picker API...
          </>
        ) : (
          <>
            <FolderOpen className="mr-2 h-4 w-4" />
            Select from Google Drive
          </>
        )}
      </Button>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!pickerApiLoaded && !error && (
        <p className="text-xs text-gray-500 text-center">
          Loading Google Picker API...
        </p>
      )}
    </div>
  )
}

