'use client'

import { Download, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function RegenerateManifestButton() {
  const handleClick = () => {
    console.log('Regenerate Manifest clicked')
    alert('Regenerating manifest...')
    // TODO: Trigger manifest regeneration
    window.location.reload()
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      Regenerate
    </button>
  )
}

export function DownloadManifestButton({ manifestData }: { manifestData: any }) {
  const handleClick = () => {
    const dataStr = JSON.stringify(manifestData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'manifest.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
    >
      <Download className="h-4 w-4" />
      Download
    </button>
  )
}

