'use client';

import React, { useState } from 'react';
import { PRESET_KEYWORDS } from '@/lib/keywords';
import { createProjectCall } from '@/app/actions/projectActions';

interface ProjectFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ProjectForm({ onSuccess, onClose }: ProjectFormProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleKeywordToggle = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else {
      if (selectedKeywords.length >= 10) {
        setMessage({ type: 'error', text: 'You can select up to 10 keywords maximum.' });
        return;
      }
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createProjectCall(formData, selectedKeywords);

      if (res.success) {
        setMessage({
          type: 'success',
          text: 'Project call submitted successfully! It is now active and on the feed.'
        });
        // Clear form fields
        e.currentTarget.reset();
        setSelectedKeywords([]);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setMessage({
          type: 'error',
          text: res.error || 'Failed to submit project call.'
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbfdfb] border-2 border-[#0f2a47] p-6 shadow-[6px_6px_0_#0f2a47] rounded-sm max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-[#c9d6d1]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c68227] font-bold">New Call</span>
          <h2 className="text-2xl font-bold text-[#0f2a47] mt-1">Post a Project Call</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            type="button" 
            className="text-2xl font-semibold hover:text-[#c1502e] text-[#0f2a47] cursor-pointer transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded-sm text-sm font-semibold border ${
            message.type === 'success'
              ? 'bg-[#eef2ee] text-[#3f7d5c] border-[#3f7d5c]'
              : 'bg-red-50 text-[#c1502e] border-[#c1502e]'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1">Your Name</label>
            <input
              type="text"
              name="caller_name"
              required
              placeholder="e.g. Aditya K."
              className="p-3 border border-[#c9d6d1] rounded-sm bg-[#fbfdfb] text-[#0f2a47] text-sm focus:outline-none focus:border-[#6fc6d9] transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1">Lead Department</label>
            <select
              name="caller_dept"
              required
              className="p-3 border border-[#c9d6d1] rounded-sm bg-[#fbfdfb] text-[#0f2a47] text-sm focus:outline-none focus:border-[#6fc6d9] transition-colors"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1">Project Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Solar-powered water quality monitor"
            className="p-3 border border-[#c9d6d1] rounded-sm bg-[#fbfdfb] text-[#0f2a47] text-sm focus:outline-none focus:border-[#6fc6d9] transition-colors"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1">Abstract (Short)</label>
          <textarea
            name="abstract"
            rows={3}
            required
            placeholder="What are you building, and what's the goal?"
            className="p-3 border border-[#c9d6d1] rounded-sm bg-[#fbfdfb] text-[#0f2a47] text-sm focus:outline-none focus:border-[#6fc6d9] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1">Team Slots Needed</label>
            <input
              type="number"
              name="slots_needed"
              min={1}
              max={20}
              defaultValue={4}
              required
              className="p-3 border border-[#c9d6d1] rounded-sm bg-[#fbfdfb] text-[#0f2a47] text-sm focus:outline-none focus:border-[#6fc6d9] transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1">Review Window (Days)</label>
            <input
              type="number"
              name="review_days"
              min={1}
              max={30}
              defaultValue={5}
              required
              className="p-3 border border-[#c9d6d1] rounded-sm bg-[#fbfdfb] text-[#0f2a47] text-sm focus:outline-none focus:border-[#6fc6d9] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-mono font-bold text-[#4a6178] uppercase mb-1 flex justify-between">
            <span>Keywords (Select up to 10)</span>
            <span className="text-xs text-[#c68227]">{selectedKeywords.length}/10 selected</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-2 p-3 border border-[#c9d6d1] rounded-sm bg-[#eef2ee]">
            {PRESET_KEYWORDS.map((kw) => {
              const isSelected = selectedKeywords.includes(kw);
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleKeywordToggle(kw)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#0f2a47] text-[#fbfdfb] border-[#0f2a47]'
                      : 'bg-[#fbfdfb] text-[#0f2a47] border-[#c9d6d1] hover:border-[#6fc6d9]'
                  }`}
                >
                  {kw}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-[#4a6178] italic pt-2">
          New project calls are immediately posted live to the main directory. Duplicate or spam posts will be reviewed.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#e8a33d] hover:bg-[#f0b358] active:bg-[#c68227] text-[#0f2a47] font-bold text-sm rounded-sm transition-all shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Submitting Call...' : 'Submit Call'}
        </button>
      </form>
    </div>
  );
}
