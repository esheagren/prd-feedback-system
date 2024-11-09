'use client'
import { useState } from 'react'
import { useStore } from '../store'
import { Loader2 } from 'lucide-react'

const ROLES = [
  { id: 'ux-ui-designer', label: 'UX/UI Designer' },
  { id: 'product-manager', label: 'Product Manager' },
  { id: 'backend-engineer', label: 'Backend Engineer' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finance', label: 'Finance' }
]

export function FeedbackPanel() {
  const [activeTab, setActiveTab] = useState(ROLES[0].id)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Record<string, any>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const form = e.target as HTMLFormElement
      const prdContent = (form.elements.namedItem('prd') as HTMLTextAreaElement).value
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd: prdContent }),
      })
      
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setFeedback(data.feedback)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8">PRD Feedback System</h1>
      
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Enter Your PRD</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            name="prd"
            className="w-full h-64 p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your PRD content here..."
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg 
                     hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              'Get Feedback'
            )}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                ${activeTab === role.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* Feedback Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Key Considerations</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {feedback[activeTab]?.considerations?.length > 0 ? (
                <ul className="list-disc pl-4 space-y-2">
                  {feedback[activeTab].considerations.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No feedback available yet</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Action Items</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {feedback[activeTab]?.actionItems?.length > 0 ? (
                <ul className="list-disc pl-4 space-y-2">
                  {feedback[activeTab].actionItems.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No feedback available yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}