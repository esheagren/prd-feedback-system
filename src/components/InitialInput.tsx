'use client'
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function InitialInput({ initialPRD, setInitialPRD, onComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/analyze/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: initialPRD }),
      });
      
      const data = await response.json();
      onComplete(data.sections);
    } catch (error) {
      console.error('Error structuring PRD:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Describe Your Product Idea</h2>
      <p className="text-gray-400 mb-4">
        Write a brief description of your product idea. Our AI will help structure it into a proper PRD.
      </p>
      <textarea
        className="w-full h-64 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 
                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none mb-4"
        placeholder="Describe your product idea..."
        value={initialPRD}
        onChange={(e) => setInitialPRD(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={isProcessing || !initialPRD.trim()}
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg
                 hover:bg-emerald-500 disabled:bg-gray-600 
                 transition-colors duration-200 flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Structuring PRD...
          </>
        ) : (
          'Structure My PRD'
        )}
      </button>
    </div>
  );
}
