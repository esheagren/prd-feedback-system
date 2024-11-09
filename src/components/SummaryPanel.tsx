'use client'
import { useStore } from '../store'

export default function SummaryPanel() {
  const { summary } = useStore()

  if (!summary) return null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-3">Summary & Recommendations</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
    </div>
  )
}