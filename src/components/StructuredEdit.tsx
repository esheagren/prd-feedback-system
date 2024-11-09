'use client'
import React, { useState } from 'react';
import { Edit, Save } from 'lucide-react';

export default function StructuredEdit({ 
  sections, 
  onUpdate, 
  onComplete 
}: {
  sections: Record<string, string>;
  onUpdate: (sections: Record<string, string>) => void;
  onComplete: () => void;
}) {
  const [editingSection, setEditingSection] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (section) => {
    setEditingSection(section);
    setEditContent(sections[section]);
  };

  const handleSave = () => {
    onUpdate({
      ...sections,
      [editingSection]: editContent
    });
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Review & Edit PRD Sections</h2>
        <p className="text-gray-400 mb-4">
          We've structured your input into PRD sections. Review and edit each section before getting feedback.
        </p>
      </div>

      {Object.entries(sections).map(([section, content]) => (
        <div key={section} className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{section}</h3>
            {editingSection !== section ? (
              <button
                onClick={() => handleEdit(section)}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
              >
                <Edit size={16} />
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
              >
                <Save size={16} />
                Save
              </button>
            )}
          </div>
          
          {editingSection === section ? (
            <textarea
              className="w-full h-40 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
          )}
        </div>
      ))}

      <button
        onClick={onComplete}
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg
                 hover:bg-emerald-500 transition-colors duration-200 
                 flex items-center justify-center"
      >
        Get Expert Feedback
      </button>
    </div>
  );
}