'use client'
import React, { useState } from 'react';
import InitialInput from '../components/InitialInput';
import StructuredEdit from '../components/StructuredEdit';
import ExpertFeedback from '../components/ExpertFeedback';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [initialPRD, setInitialPRD] = useState('');
  const [structuredSections, setStructuredSections] = useState({});

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 text-gray-400">
          <div className={`flex items-center ${step >= 1 ? 'text-emerald-400' : ''}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">
              1
            </div>
            Initial Draft
          </div>
          <ArrowRight size={20} />
          <div className={`flex items-center ${step >= 2 ? 'text-emerald-400' : ''}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">
              2
            </div>
            Structure PRD
          </div>
          <ArrowRight size={20} />
          <div className={`flex items-center ${step >= 3 ? 'text-emerald-400' : ''}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">
              3
            </div>
            Get Feedback
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <InitialInput 
            initialPRD={initialPRD}
            setInitialPRD={setInitialPRD}
            onComplete={(sections) => {
              setStructuredSections(sections);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StructuredEdit
            sections={structuredSections}
            onUpdate={setStructuredSections}
            onComplete={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <ExpertFeedback sections={structuredSections} />
        )}
      </div>
    </div>
  );
}