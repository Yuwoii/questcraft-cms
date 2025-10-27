'use client'

import { useCallback, useState } from 'react'
import { Upload, X, File, Image as ImageIcon, Video } from 'lucide-react'
import { Button } from './button'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onClear: () => void
  accept?: string
  maxSize?: number
  value?: File | null
}

export function FileUpload({
  onFileSelect,
  onClear,
  accept = 'image/*,video/*',
  maxSize = 50 * 1024 * 1024, // 50MB default
  value,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files && files.length > 0) {
        const file = files[0]
        if (file.size > maxSize) {
          alert(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`)
          return
        }
        handleFile(file)
      }
    },
    [maxSize]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.size > maxSize) {
          alert(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`)
          return
        }
        handleFile(file)
      }
    },
    [maxSize]
  )

  const handleFile = (file: File) => {
    onFileSelect(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleClear = () => {
    setPreview(null)
    onClear()
  }

  const getFileIcon = () => {
    if (!value) return <Upload className="h-8 w-8 text-gray-400" />
    if (value.type.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-blue-500" />
    if (value.type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  return (
    <div className="w-full">
      {!value ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {getFileIcon()}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Images (JPEG, PNG, GIF, WebP) or Videos (MP4, MOV)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum file size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-white">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
              {getFileIcon()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value.name}
            </p>
            <p className="text-xs text-gray-500">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}



