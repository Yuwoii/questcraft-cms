import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Edit, Image as ImageIcon, Video } from 'lucide-react'

async function getCollection(id: string) {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      rewards: {
        orderBy: { createdAt: 'desc' },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  })

  if (!collection) {
    notFound()
  }

  return collection
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

export default async function CollectionDetailPage({ params }: { params: { id: string } }) {
  const collection = await getCollection(params.id)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{collection.iconEmoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{collection.name}</h1>
              {collection.description && (
                <p className="mt-2 text-gray-600">{collection.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    collection.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {collection.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500">
                  {collection.rewards.length} {collection.rewards.length === 1 ? 'reward' : 'rewards'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {collection.rewards.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No rewards in this collection yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Upload rewards and assign them to this collection.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {collection.rewards.map((reward) => (
            <div
              key={reward.id}
              className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
            >
              {/* Image Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {reward.mediaType === 'video' ? (
                  reward.googleDriveThumbnailId ? (
                    <Image
                      src={getGoogleDriveThumbnailUrl(reward.googleDriveThumbnailId)}
                      alt={reward.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <Video className="h-16 w-16 text-purple-400" />
                    </div>
                  )
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
                  <Link
                    href={`/rewards/${reward.id}/edit`}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                    title="Edit reward"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
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
      )}
    </div>
  )
}

