import { prisma } from '@/lib/prisma'
import { Image as ImageIcon } from 'lucide-react'
import { UploadRewardButton } from '@/components/buttons/upload-reward-button'
import RewardsGroupedView from '@/components/rewards/rewards-grouped-view'

async function getRewards() {
  return prisma.reward.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      collection: {
        select: {
          id: true,
          name: true,
          iconEmoji: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
}

export default async function RewardsPage() {
  const rewards = await getRewards()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
          <p className="mt-2 text-gray-600">
            Manage your reward library
          </p>
        </div>
        <UploadRewardButton />
      </div>

      {rewards.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No rewards yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Upload your first image or video reward.
          </p>
          <div className="mt-6">
            <UploadRewardButton />
          </div>
        </div>
      ) : (
        <RewardsGroupedView rewards={rewards} />
      )}
    </div>
  )
}

