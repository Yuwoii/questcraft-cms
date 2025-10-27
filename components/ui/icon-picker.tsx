'use client'

import { useState, useMemo } from 'react'
import * as Icons from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value?: string
  onChange: (name?: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const POPULAR_ICONS = [
  'Package', 'Star', 'Trophy', 'Crown', 'Heart', 'Zap',
  'Gift', 'Award', 'Target', 'Flame', 'Sparkles', 'Medal',
  'Gem', 'Rocket', 'Shield'
]

export function IconPicker({ value, onChange, open, onOpenChange }: IconPickerProps) {
  const [search, setSearch] = useState('')

  // Get all Lucide icon names (filtered to only components)
  const allIconNames = useMemo(() => {
    return Object.keys(Icons).filter(name => 
      typeof Icons[name as keyof typeof Icons] === 'function' &&
      name !== 'createLucideIcon' &&
      name !== 'Icon'
    )
  }, [])

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!search.trim()) return allIconNames
    return allIconNames.filter(name => 
      name.toLowerCase().includes(search.toLowerCase())
    )
  }, [allIconNames, search])

  const handleIconSelect = (iconName: string) => {
    onChange(iconName)
    onOpenChange(false)
  }

  const handleClear = () => {
    onChange(undefined)
    onOpenChange(false)
  }

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as any
    if (!IconComponent) return null
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          {/* Selected Icon Preview */}
          {value && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {renderIcon(value)}
                <span className="font-medium">Selected: {value}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}

          {/* Popular Icons Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Popular Icons</h3>
            <div className="grid grid-cols-8 gap-2">
              {POPULAR_ICONS.map((iconName) => (
                <Button
                  key={iconName}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-12 w-12 p-0 flex items-center justify-center hover:bg-gray-100",
                    value === iconName && "bg-blue-100 border-blue-300"
                  )}
                  onClick={() => handleIconSelect(iconName)}
                  title={iconName}
                >
                  {renderIcon(iconName)}
                </Button>
              ))}
            </div>
          </div>

          {/* All Icons Section */}
          <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-sm font-medium text-gray-700">
              All Icons ({filteredIcons.length})
            </h3>
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-8 gap-2">
                {filteredIcons.map((iconName) => (
                  <Button
                    key={iconName}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-12 w-12 p-0 flex items-center justify-center hover:bg-gray-100",
                      value === iconName && "bg-blue-100 border-blue-300"
                    )}
                    onClick={() => handleIconSelect(iconName)}
                    title={iconName}
                  >
                    {renderIcon(iconName)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
