'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GoogleDrivePicker } from '@/components/ui/google-drive-picker'
import { Loader2, Upload, CheckCircle2, X } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary', 'mythic']),
  collectionId: z.string().min(1, 'Collection is required'),
})

type FormValues = z.infer<typeof formSchema>

interface UploadRewardDialogWithFileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Collection {
  id: string
  name: string
  iconEmoji: string
}

interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  size?: string
  createdTime: string
  webViewLink: string
}

type UploadStep = 'form' | 'uploading' | 'complete'

export function UploadRewardDialogWithFile({
  open,
  onOpenChange,
}: UploadRewardDialogWithFileProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [uploadStep, setUploadStep] = useState<UploadStep>('form')
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // File states
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  
  // Tab and Google Drive selection states
  const [activeTab, setActiveTab] = useState<'upload' | 'select'>('upload')
  const [selectedDriveFile, setSelectedDriveFile] = useState<GoogleDriveFile | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      rarity: 'common',
      collectionId: '',
    },
  })

  useEffect(() => {
    if (open) {
      fetchCollections()
      // Reset on open
      setUploadStep('form')
      setUploadProgress(0)
      setMainFile(null)
      setThumbnailFile(null)
      setActiveTab('upload')
      setSelectedDriveFile(null)
    }
  }, [open])

  async function fetchCollections() {
    try {
      setLoadingCollections(true)
      const response = await fetch('/api/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoadingCollections(false)
    }
  }

  async function uploadFile(file: File, progressOffset: number = 0) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folderName', 'QuestCraft Rewards')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload file')
    }

    return response.json()
  }

  // Helper function to extract thumbnail ID from Google Drive URLs
  function extractThumbnailId(url: string): string | null {
    // Try pattern: .../uc?id=FILE_ID or ?id=FILE_ID
    const idMatch = url.match(/[?&]id=([^&]+)/)
    if (idMatch) return idMatch[1]

    // Try pattern: https://lh3.googleusercontent.com/d/FILE_ID
    const lh3Match = url.match(/\/d\/([^/?]+)/)
    if (lh3Match) return lh3Match[1]

    // Try pattern: /file/d/FILE_ID/
    const fileMatch = url.match(/\/file\/d\/([^/?]+)/)
    if (fileMatch) return fileMatch[1]

    return null
  }

  async function onSubmit(data: FormValues) {
    // Validate file selection based on active tab
    if (activeTab === 'upload' && !mainFile) {
      alert('Please select a file to upload')
      return
    }
    if (activeTab === 'select' && !selectedDriveFile) {
      alert('Please select a file from Google Drive')
      return
    }

    // Comment 3: Validate MIME type for selected Drive files
    if (activeTab === 'select') {
      const isValidMediaType = selectedDriveFile!.mimeType.startsWith('image/') || 
                                selectedDriveFile!.mimeType.startsWith('video/')
      if (!isValidMediaType) {
        alert('Please select an image or video file. Selected file type is not supported.')
        return
      }
    }

    try {
      setIsLoading(true)
      setUploadStep('uploading')
      setUploadProgress(10)

      // Comment 1 & 4: Use local variables instead of state for building payload
      let fileId: string
      let thumbnailId: string | null = null

      // Determine media type based on active mode
      let mediaType: 'image' | 'video'
      if (activeTab === 'upload') {
        mediaType = mainFile!.type.startsWith('image/') ? 'image' : 'video'
      } else {
        mediaType = selectedDriveFile!.mimeType.startsWith('image/') ? 'image' : 'video'
      }

      if (activeTab === 'upload') {
        // Upload mode: upload main file to Google Drive
        setUploadProgress(20)
        const mainFileResult = await uploadFile(mainFile!)
        fileId = mainFileResult.fileId
        setUploadProgress(50)

        // Auto-generate thumbnail for video (or use manual upload if provided)
        if (mediaType === 'video') {
          if (thumbnailFile) {
            // Manual thumbnail provided
            setUploadProgress(60)
            const thumbnailResult = await uploadFile(thumbnailFile)
            thumbnailId = thumbnailResult.fileId
            setUploadProgress(80)
          } else if (mainFileResult.thumbnailUrl) {
            // Comment 2: Improved thumbnail extraction with multiple patterns
            thumbnailId = extractThumbnailId(mainFileResult.thumbnailUrl)
            setUploadProgress(80)
          }
        }
      } else {
        // Selection mode: use existing file from Google Drive
        fileId = selectedDriveFile!.id
        setUploadProgress(50)

        // For videos, extract thumbnail ID from thumbnailLink if available
        if (mediaType === 'video' && selectedDriveFile!.thumbnailLink) {
          // Comment 2: Improved thumbnail extraction with multiple patterns
          thumbnailId = extractThumbnailId(selectedDriveFile!.thumbnailLink)
        }
        setUploadProgress(80)
      }

      // Create reward in database using local variables
      const rewardData = {
        name: data.name,
        description: data.description,
        rarity: data.rarity,
        mediaType,
        googleDriveFileId: fileId,
        googleDriveThumbnailId: thumbnailId,
        collectionId: data.collectionId,
      }

      setUploadProgress(90)

      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewardData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create reward')
      }

      setUploadProgress(100)
      setUploadStep('complete')

      // Wait a moment before closing
      setTimeout(() => {
        form.reset()
        setMainFile(null)
        setThumbnailFile(null)
        setSelectedDriveFile(null)
        onOpenChange(false)
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error('Error uploading reward:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload reward')
      setUploadStep('form')
      setUploadProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const isVideo = mainFile?.type.startsWith('video/')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {uploadStep === 'form' && 'Add Reward'}
            {uploadStep === 'uploading' && (activeTab === 'upload' ? 'Uploading...' : 'Processing...')}
            {uploadStep === 'complete' && 'Upload Complete!'}
          </DialogTitle>
          <DialogDescription>
            {uploadStep === 'form' && 'Upload a new file or choose an existing one from Google Drive'}
            {uploadStep === 'uploading' && (activeTab === 'upload' 
              ? 'Please wait while your files are being uploaded' 
              : 'Please wait while your reward is being created')}
            {uploadStep === 'complete' && 'Your reward has been successfully created'}
          </DialogDescription>
        </DialogHeader>

        {uploadStep === 'form' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as 'upload' | 'select')}
                defaultValue="upload"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload New</TabsTrigger>
                  <TabsTrigger value="select">Choose Existing</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Main File * {isVideo && '(Video)'}
                    </label>
                    <FileUpload
                      value={mainFile}
                      onFileSelect={setMainFile}
                      onClear={() => setMainFile(null)}
                      accept="image/*,video/*"
                    />
                  </div>

                  {isVideo && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Thumbnail (Optional)
                      </label>
                      <FileUpload
                        value={thumbnailFile}
                        onFileSelect={setThumbnailFile}
                        onClear={() => setThumbnailFile(null)}
                        accept="image/*"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a thumbnail image for the video preview
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="select" className="space-y-4">
                  <GoogleDrivePicker
                    onFileSelect={(file) => setSelectedDriveFile(file)}
                    accept="both"
                  />
                  
                  {selectedDriveFile && (
                    <div className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg bg-primary/5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Selected File
                        </p>
                        <p className="text-sm text-gray-700 truncate">
                          {selectedDriveFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedDriveFile.size ? `${(parseInt(selectedDriveFile.size) / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'} • {selectedDriveFile.mimeType.startsWith('image/') ? 'Image' : 'Video'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDriveFile(null)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Cute Cat Photo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A cute cat sleeping on a couch"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rarity *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                        <SelectItem value="mythic">Mythic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCollections ? (
                          <SelectItem value="loading" disabled>
                            Loading collections...
                          </SelectItem>
                        ) : collections.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No collections found. Create one first.
                          </SelectItem>
                        ) : (
                          collections.map((collection) => (
                            <SelectItem key={collection.id} value={collection.id}>
                              {collection.iconEmoji} {collection.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={
                    isLoading || 
                    loadingCollections || 
                    (activeTab === 'upload' && !mainFile) || 
                    (activeTab === 'select' && !selectedDriveFile)
                  }
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" />
                  {activeTab === 'upload' ? 'Upload Reward' : 'Add Reward'}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {uploadStep === 'uploading' && (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-4" />
              <p className="text-lg font-medium mb-2">
                {activeTab === 'upload' ? 'Uploading to Google Drive...' : 'Creating reward...'}
              </p>
              <div className="w-full max-w-md">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 text-center mt-2">{uploadProgress}%</p>
              </div>
            </div>
          </div>
        )}

        {uploadStep === 'complete' && (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-lg font-medium mb-2">Upload Successful!</p>
              <p className="text-sm text-gray-500">Your reward has been created</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}



