import { prisma } from '@/lib/prisma'
import { Tag as TagIcon } from 'lucide-react'
import { CreateTagButton } from '@/components/buttons/create-tag-button'

async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { rewards: true },
      },
    },
  })
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="mt-2 text-gray-600">
            Organize rewards with custom tags
          </p>
        </div>
        <CreateTagButton />
      </div>

      {tags.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No tags yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Create tags to organize your rewards.
          </p>
          <div className="mt-6">
            <CreateTagButton />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-200">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{tag.name}</p>
                    <p className="text-sm text-gray-500">
                      {tag._count.rewards} reward{tag._count.rewards !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Edit
                  </button>
                  <button className="text-sm text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

