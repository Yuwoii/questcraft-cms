import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function getReward(id: string) {
  const reward = await prisma.reward.findUnique({
    where: { id },
    include: {
      collection: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!reward) {
    notFound()
  }

  return reward
}

async function getCollections() {
  return prisma.collection.findMany({
    orderBy: { name: 'asc' },
  })
}

async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function EditRewardPage({ params }: { params: { id: string } }) {
  const reward = await getReward(params.id)
  const collections = await getCollections()
  const tags = await getTags()

  async function updateReward(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const rarity = formData.get('rarity') as string
    const collectionId = formData.get('collectionId') as string
    const tagIds = formData.getAll('tags') as string[]

    await prisma.reward.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        rarity,
        collectionId,
      },
    })

    // Update tags
    await prisma.rewardTag.deleteMany({
      where: { rewardId: params.id },
    })

    if (tagIds.length > 0) {
      await prisma.rewardTag.createMany({
        data: tagIds.map((tagId) => ({
          rewardId: params.id,
          tagId,
        })),
      })
    }

    revalidatePath('/rewards')
    redirect('/rewards')
  }

  async function deleteReward() {
    'use server'

    await prisma.reward.delete({
      where: { id: params.id },
    })

    revalidatePath('/rewards')
    redirect('/rewards')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Reward</h1>

      <form action={updateReward} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={reward.name}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={reward.description || ''}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Rarity */}
        <div>
          <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-2">
            Rarity
          </label>
          <select
            id="rarity"
            name="rarity"
            defaultValue={reward.rarity}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic">Mythic</option>
          </select>
        </div>

        {/* Collection */}
        <div>
          <label htmlFor="collectionId" className="block text-sm font-medium text-gray-700 mb-2">
            Collection
          </label>
          <select
            id="collectionId"
            name="collectionId"
            defaultValue={reward.collectionId}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.iconEmoji} {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
            {tags.map((tag) => {
              const isChecked = reward.tags.some((rt) => rt.tag.id === tag.id)
              return (
                <label key={tag.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag.id}
                    defaultChecked={isChecked}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{tag.name}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Media Info (read-only) */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Media Information</h3>
          <div className="text-sm text-gray-600">
            <p>Type: <span className="font-medium">{reward.mediaType}</span></p>
            <p className="text-xs text-gray-500 mt-1">File ID: {reward.googleDriveFileId}</p>
            {reward.googleDriveThumbnailId && (
              <p className="text-xs text-gray-500">Thumbnail ID: {reward.googleDriveThumbnailId}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-3">
            <a
              href="/rewards"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* Delete Form (separate) */}
      <form action={deleteReward} className="mt-8 pt-8 border-t">
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-600 mb-4">
            Deleting this reward is permanent and cannot be undone.
          </p>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Reward
          </button>
        </div>
      </form>
    </div>
  )
}

