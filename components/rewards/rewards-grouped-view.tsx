'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Image as ImageIcon, Video, Edit, ChevronDown, ChevronUp } from 'lucide-react'

interface Reward {
  id: string
  name: string
  description: string | null
  rarity: string
  mediaType: string
  googleDriveFileId: string
  googleDriveThumbnailId: string | null
  collection: {
    id: string
    name: string
    iconEmoji: string
  }
  tags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
}

interface RewardsGroupedViewProps {
  rewards: Reward[]
}

function getGoogleDriveThumbnailUrl(fileId: string) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
}

const rarityColors: Record<string, string> = {
  common: 'bg-gray-100 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-orange-100 text-orange-700',
  mythic: 'bg-red-100 text-red-700',
}

function CollectionSection({ 
  collection, 
  rewards 
}: { 
  collection: { id: string; name: string; iconEmoji: string }
  rewards: Reward[]
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-4">
      {/* Collection Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{collection.iconEmoji}</span>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">{collection.name}</h2>
            <p className="text-sm text-gray-500">{rewards.length} rewards</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Rewards Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
                >
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {reward.mediaType === 'video' ? (
                      <Image
                        src={getGoogleDriveThumbnailUrl(reward.googleDriveThumbnailId || reward.googleDriveFileId)}
                        alt={reward.name}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          // Fallback to placeholder if thumbnail fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement?.classList.add('bg-gradient-to-br', 'from-purple-100', 'to-blue-100')
                        }}
                      />
                    ) : (
                      <Image
                        src={getGoogleDriveThumbnailUrl(reward.googleDriveFileId)}
                        alt={reward.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    {/* Media type badge */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      {reward.mediaType === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                      {reward.mediaType}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate flex-1">
                        {reward.name}
                      </h3>
                      <div className="flex gap-1">
                        <Link
                          href={`/rewards/${reward.id}/edit`}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                          title="Edit reward"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    {reward.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {reward.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rarityColors[reward.rarity] || rarityColors.common
                        }`}
                      >
                        {reward.rarity}
                      </span>
                      {reward.tags.slice(0, 2).map((rt) => (
                        <span
                          key={rt.tag.id}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        >
                          {rt.tag.name}
                        </span>
                      ))}
                      {reward.tags.length > 2 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                          +{reward.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function RewardsGroupedView({ rewards }: RewardsGroupedViewProps) {
  // Group rewards by collection
  const groupedRewards = rewards.reduce((acc, reward) => {
    const collectionId = reward.collection?.id || 'uncategorized'
    const collectionName = reward.collection?.name || 'Uncategorized'
    const collectionEmoji = reward.collection?.iconEmoji || '📦'

    if (!acc[collectionId]) {
      acc[collectionId] = {
        collection: {
          id: collectionId,
          name: collectionName,
          iconEmoji: collectionEmoji,
        },
        rewards: []
      }
    }
    acc[collectionId].rewards.push(reward)
    return acc
  }, {} as Record<string, { collection: { id: string; name: string; iconEmoji: string }; rewards: Reward[] }>)

  // Sort collections alphabetically by name
  const sortedCollections = Object.values(groupedRewards).sort((a, b) => 
    a.collection.name.localeCompare(b.collection.name)
  )

  return (
    <div className="space-y-8">
      {sortedCollections.map((group) => (
        <CollectionSection
          key={group.collection.id}
          collection={group.collection}
          rewards={group.rewards}
        />
      ))}
    </div>
  )
}
