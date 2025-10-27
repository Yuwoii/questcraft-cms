import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { CreateCollectionButton } from '@/components/buttons/create-collection-button'

async function getCollections() {
  return prisma.collection.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      iconEmoji: true,
      isActive: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { rewards: true },
      },
    },
  })
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="mt-2 text-gray-600">
            Organize your rewards into collection sets
          </p>
        </div>
        <CreateCollectionButton />
      </div>

      {collections.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No collections yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first collection.
          </p>
          <div className="mt-6">
            <CreateCollectionButton />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{collection.iconEmoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {collection._count.rewards} rewards
                      </p>
                    </div>
                  </div>
                </div>
              {collection.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {collection.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    collection.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {collection.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

