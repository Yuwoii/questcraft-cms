'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Loader2, Image, Video, FolderOpen, AlertCircle, Check } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  size?: string
  createdTime: string
  webViewLink: string
}

interface GoogleDriveFolder {
  id: string
  name: string
  createdTime: string
}

interface GoogleDriveFilePickerProps {
  onFileSelect: (file: GoogleDriveFile) => void
  selectedFileId: string | null
}

export function GoogleDriveFilePicker({
  onFileSelect,
  selectedFileId,
}: GoogleDriveFilePickerProps) {
  const [files, setFiles] = useState<GoogleDriveFile[]>([])
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)
  const [filesError, setFilesError] = useState<string | null>(null)
  const [foldersError, setFoldersError] = useState<string | null>(null)

  const fetchFolders = async (signal?: AbortSignal) => {
    setIsLoadingFolders(true)
    setFoldersError(null)
    try {
      const response = await fetch('/api/google-drive/folders', { signal })
      if (!response.ok) {
        throw new Error('Failed to fetch folders')
      }
      const data = await response.json()
      // Check if request was aborted before setting state
      if (!signal?.aborted) {
        setFolders(data.folders || [])
      }
    } catch (err) {
      // Don't set error state if the request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to load folders'
      if (!signal?.aborted) {
        setFoldersError(errorMessage)
      }
      console.error('Error fetching folders:', err)
    } finally {
      if (!signal?.aborted) {
        setIsLoadingFolders(false)
      }
    }
  }

  const fetchFiles = async (folderId?: string, signal?: AbortSignal) => {
    setIsLoadingFiles(true)
    setFilesError(null)
    try {
      const url = folderId
        ? `/api/google-drive/files?folderId=${folderId}`
        : '/api/google-drive/files'
      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }
      const data = await response.json()
      // API returns array directly, not wrapped in an object
      const filesArray = Array.isArray(data) ? data : []
      // Client-side filtering: only include image/ and video/ MIME types
      const filteredFiles = filesArray.filter((file: GoogleDriveFile) => 
        file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')
      )
      // Check if request was aborted before setting state
      if (!signal?.aborted) {
        setFiles(filteredFiles)
      }
    } catch (err) {
      // Don't set error state if the request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files'
      if (!signal?.aborted) {
        setFilesError(errorMessage)
      }
      console.error('Error fetching files:', err)
    } finally {
      if (!signal?.aborted) {
        setIsLoadingFiles(false)
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController()
    fetchFolders(abortController.signal)
    return () => {
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    fetchFiles(selectedFolderId || undefined, abortController.signal)
    return () => {
      abortController.abort()
    }
  }, [selectedFolderId])

  const formatFileSize = (size?: string): string => {
    if (!size) return 'Unknown'
    const bytes = parseInt(size, 10)
    if (isNaN(bytes)) return 'Unknown'
    
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (err) {
      return 'Unknown'
    }
  }

  const handleFileClick = (file: GoogleDriveFile) => {
    onFileSelect(file)
  }

  const handleFolderChange = (folderId: string) => {
    if (folderId === 'all') {
      setSelectedFolderId(null)
    } else {
      setSelectedFolderId(folderId)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Folder Selector Section */}
      <div>
        <label className="text-sm font-medium">Select Folder</label>
        <Select
          value={selectedFolderId || 'all'}
          onValueChange={handleFolderChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            {isLoadingFolders && (
              <SelectItem value="loading" disabled>
                Loading folders...
              </SelectItem>
            )}
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>{folder.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error Display Section */}
      {foldersError && (
        <div className="border border-red-500 rounded-md p-4 bg-red-50">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Folders Error</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{foldersError}</p>
          <Button
            onClick={() => fetchFolders()}
            variant="outline"
            size="sm"
          >
            Retry Folders
          </Button>
        </div>
      )}
      {filesError && (
        <div className="border border-red-500 rounded-md p-4 bg-red-50">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Files Error</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{filesError}</p>
          <Button
            onClick={() => fetchFiles(selectedFolderId || undefined)}
            variant="outline"
            size="sm"
          >
            Retry Files
          </Button>
        </div>
      )}

      {/* Loading State Section */}
      {isLoadingFiles && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Loading files...</p>
        </div>
      )}

      {/* Empty State Section */}
      {!isLoadingFiles && !filesError && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No files found in this folder
          </p>
        </div>
      )}

      {/* Files Grid Section */}
      {!isLoadingFiles && !filesError && files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className={cn(
                'border rounded-lg overflow-hidden cursor-pointer transition-all duration-200',
                'hover:border-primary hover:shadow-md',
                selectedFileId === file.id
                  ? 'border-primary bg-primary/5'
                  : 'border-input'
              )}
            >
              {/* Thumbnail Section */}
              <div className="relative aspect-square bg-muted">
                {file.thumbnailLink ? (
                  <img
                    src={file.thumbnailLink}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    {file.mimeType.startsWith('image/') ? (
                      <Image className="h-12 w-12 text-muted-foreground" />
                    ) : file.mimeType.startsWith('video/') ? (
                      <Video className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Image className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                )}
                {/* Selected Indicator */}
                {selectedFileId === file.id && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-primary rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Section */}
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(file.createdTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

