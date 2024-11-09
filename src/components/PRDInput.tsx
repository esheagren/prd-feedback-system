'use client'
import { useState } from 'react'
import { useStore } from '../store'

export default function PRDInput() {
  const [loading, setLoading] = useState(false)
  const { setPRD, setFeedback, setSummary } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const prdContent = (form.elements.namedItem('prd') as HTMLTextAreaElement).value

    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd: prdContent }),
      })
      
      const data = await response.json()
      setPRD(prdContent)
      setFeedback(data.feedback)
      setSummary(data.summary)
    } catch (error) {
      console.error('Error analyzing PRD:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Enter Your PRD</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prd"
          className="w-full h-96 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your PRD content here..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Get Feedback'}
        </button>
      </form>
    </div>
  )
}