'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateTagDialog } from '@/components/forms/create-tag-dialog'

export function CreateTagButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Tag
      </button>

      <CreateTagDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

