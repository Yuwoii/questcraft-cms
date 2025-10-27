'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import * as Icons from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { IconPicker } from '@/components/ui/icon-picker'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  iconEmoji: z.string().max(10).optional(),
  iconName: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
}: CreateCollectionDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [iconPickerOpen, setIconPickerOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      iconEmoji: '📦',
      iconName: '',
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)

      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create collection')
      }

      form.reset()
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating collection:', error)
      alert(error instanceof Error ? error.message : 'Failed to create collection')
    } finally {
      setIsLoading(false)
    }
  }

  const iconName = form.watch('iconName')
  const iconEmoji = form.watch('iconEmoji')
  const IconComponent = iconName ? (Icons[iconName as keyof typeof Icons] as any) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your rewards
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Cat Collection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Icon</FormLabel>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIconPickerOpen(true)}
                  className="flex items-center gap-2"
                >
                  {IconComponent ? (
                    <IconComponent className="h-5 w-5" />
                  ) : (
                    <span className="text-xl">{iconEmoji || '📦'}</span>
                  )}
                  <span>Choose Icon</span>
                </Button>
                {iconName && (
                  <span className="text-sm text-gray-600">Selected: {iconName}</span>
                )}
              </div>
              <FormDescription>
                Choose a custom icon or use emoji as fallback
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="iconEmoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Emoji</FormLabel>
                  <FormControl>
                    <Input placeholder="🐱" maxLength={10} {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose an emoji to represent this collection
                  </FormDescription>
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
                      placeholder="A collection of cute cat images and videos"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Collection
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      
      <IconPicker
        value={iconName}
        onChange={(name) => form.setValue('iconName', name || '')}
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
      />
    </Dialog>
  )
}


