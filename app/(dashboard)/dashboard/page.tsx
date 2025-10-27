import { prisma } from '@/lib/prisma'
import { Package, Image, Tag, TrendingUp } from 'lucide-react'

async function getStats() {
  const [collectionsCount, rewardsCount, tagsCount, activeRewards] = await Promise.all([
    prisma.collection.count(),
    prisma.reward.count(),
    prisma.tag.count(),
    prisma.reward.count({ where: { isActive: true } }),
  ])

  return {
    collections: collectionsCount,
    rewards: rewardsCount,
    tags: tagsCount,
    active: activeRewards,
  }
}

async function getRecentRewards() {
  return prisma.reward.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      collection: true,
    },
  })
}

export default async function DashboardPage() {
  const stats = await getStats()
  const recentRewards = await getRecentRewards()

  const statCards = [
    {
      name: 'Total Rewards',
      value: stats.rewards,
      icon: Image,
      color: 'bg-blue-500',
    },
    {
      name: 'Collections',
      value: stats.collections,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      name: 'Tags',
      value: stats.tags,
      icon: Tag,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Rewards',
      value: stats.active,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to QuestCraft Content Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Rewards */}
      <div className="rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Rewards</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentRewards.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No rewards yet. Create your first reward!
            </div>
          ) : (
            recentRewards.map((reward) => (
              <div key={reward.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{reward.name}</p>
                  <p className="text-sm text-gray-500">
                    {reward.collection.name} • {reward.rarity}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(reward.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

