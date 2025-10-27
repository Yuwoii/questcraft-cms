import { prisma } from '@/lib/prisma'
import { FileJson } from 'lucide-react'
import { RegenerateManifestButton, DownloadManifestButton } from '@/components/buttons/manifest-buttons'

async function getManifestData() {
  const [collections, rewards, tags] = await Promise.all([
    prisma.collection.findMany({
      where: { isActive: true },
      include: {
        rewards: {
          where: { isActive: true },
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    }),
    prisma.reward.count({ where: { isActive: true } }),
    prisma.tag.findMany(),
  ])

  return { collections, rewards, tags }
}

export default async function ManifestPage() {
  const data = await getManifestData()

  const manifestJson = {
    version: '2.0',
    lastUpdated: new Date().toISOString(),
    collections: data.collections.map((col) => ({
      id: col.id,
      name: col.name,
      description: col.description,
      iconEmoji: col.iconEmoji,
      rewards: col.rewards.map((r) => r.id),
    })),
    rewards: data.collections.flatMap((col) =>
      col.rewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        rarity: reward.rarity,
        mediaType: reward.mediaType,
        fileID: reward.googleDriveFileId,
        thumbnailID: reward.googleDriveThumbnailId,
        collectionId: reward.collectionId,
        tags: reward.tags.map((rt) => rt.tag.name),
      }))
    ),
    tags: data.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    })),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manifest Generator</h1>
        <p className="mt-2 text-gray-600">
          Generate manifest.json for your iOS app
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Collections</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.collections.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Active Rewards</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.rewards}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Tags</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.tags.length}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              manifest.json
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <RegenerateManifestButton />
            <DownloadManifestButton manifestData={manifestJson} />
          </div>
        </div>
        <div className="p-6">
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
            {JSON.stringify(manifestJson, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <FileJson className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Next Steps</h3>
            <p className="mt-1 text-sm text-blue-700">
              1. Download the manifest.json file<br />
              2. Upload it to your Google Drive "QuestCraft Rewards" folder<br />
              3. Get the file ID and update your iOS app<br />
              4. Your app will automatically load all collections and rewards!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

