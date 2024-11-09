// src/components/ExpertFeedback.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export default function ExpertFeedback({ sections }) {
  const [activeRole, setActiveRole] = useState('ux-designer');
  const [activeTab, setActiveTab] = useState('considerations');
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const roles = [
    { id: 'ux-designer', label: 'UX Designer', color: 'emerald' },
    { id: 'product-manager', label: 'Product Manager', color: 'blue' },
    { id: 'backend-engineer', label: 'Backend Engineer', color: 'purple' }
  ];

  useEffect(() => {
    const getFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/analyze/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sections }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to get feedback');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setFeedback(data.feedback);
      } catch (error) {
        console.error('Error getting feedback:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (sections && Object.keys(sections).length > 0) {
      getFeedback();
    }
  }, [sections]);

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left sidebar with role selection */}
      <div className="col-span-3">
        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeRole === role.id 
                  ? `bg-${role.color}-500 bg-opacity-20 text-${role.color}-400` 
                  : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <MessageSquare 
                size={20} 
                className={activeRole === role.id ? `text-${role.color}-400` : ''} 
              />
              <span className="font-medium">{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right content area */}
      <div className="col-span-9">
        {/* Overall Assessment Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Overall Assessment</h2>
          {loading ? (
            <p className="text-gray-400">Loading assessment...</p>
          ) : (
            <p className="text-gray-300">
              {feedback[activeRole]?.assessment || 'No assessment available'}
            </p>
          )}
        </div>

        {/* Tabbed Content Card */}
        <div className="bg-gray-800 rounded-lg">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('considerations')}
              className={`px-6 py-4 font-medium transition-colors
                ${activeTab === 'considerations'
                  ? 'text-white border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'}`}
            >
              Key Considerations
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-6 py-4 font-medium transition-colors
                ${activeTab === 'actions'
                  ? 'text-white border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'}`}
            >
              Action Items
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <p className="text-gray-400">Loading feedback...</p>
            ) : (
              <div className="space-y-3">
                {activeTab === 'considerations' ? (
                  feedback[activeRole]?.considerations?.map((item, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5">{i + 1}.</span>
                        <p className="text-gray-300">{item}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  feedback[activeRole]?.actionItems?.map((item, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5">{i + 1}.</span>
                        <p className="text-gray-300">{item}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}