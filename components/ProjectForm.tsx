'use client';

import React, { useState } from 'react';
import { PRESET_KEYWORDS } from '@/lib/keywords';
import { createProjectCall } from '@/app/actions/projectActions';

interface ProjectFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  initialEmail?: string;
}

export default function ProjectForm({ onSuccess, onClose, initialEmail = '' }: ProjectFormProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle autocomplete search
  const handleKeywordSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeywordSearch(val);

    // CRITICAL: Suggest only after at least 2 characters are typed
    if (val.trim().length >= 2) {
      const matches = PRESET_KEYWORDS.filter((kw) =>
        kw.toLowerCase().includes(val.toLowerCase()) && !selectedKeywords.includes(kw)
      ).slice(0, 10); // Show max 10 suggestions

      setFilteredSuggestions(matches);
      setShowDropdown(true);
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    if (selectedKeywords.length >= 10) {
      setMessage({ type: 'error', text: 'You can select up to 10 keywords maximum.' });
      setKeywordSearch('');
      setShowDropdown(false);
      return;
    }
    
    setSelectedKeywords([...selectedKeywords, keyword]);
    setKeywordSearch('');
    setShowDropdown(false);
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await createProjectCall(formData, selectedKeywords);

      if (res.success) {
        setMessage({
          type: 'success',
          text: 'Submitted. Your call is now queued for organizer approval.'
        });
        form.reset();
        setSelectedKeywords([]);
        setKeywordSearch('');
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
    <div className="modal" style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div className="modal-head">
        <div>
          <div className="card-dept">New call</div>
          <h2>Post a project call</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            type="button" 
            className="modal-close"
          >
            ✕
          </button>
        )}
      </div>

      <div className="modal-body">
        {message && (
          <div
            className={`msg-banner ${
              message.type === 'success' ? 'ok show' : 'error show'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="apply-form">
          <div className="form-row">
            <div className="form-field">
              <label>Your Name</label>
              <input
                type="text"
                name="caller_name"
                required
                placeholder="e.g. Aditya K."
                autoComplete="off"
              />
            </div>
            <div className="form-field">
              <label>Your Email</label>
              <input
                type="email"
                name="caller_email"
                required
                defaultValue={initialEmail}
                placeholder="e.g. aditya@college.edu"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Lead department</label>
              <select name="caller_dept" required>
                <option value="ECE">ECE</option>
                <option value="CSE">CSE</option>
                <option value="CE">CE</option>
                <option value="ME">ME</option>
                <option value="CHE">CHE</option>
                <option value="FT">FT</option>
                <option value="EV">EV</option>
                <option value="ECS">ECS</option>
                <option value="RB">RB</option>
              </select>
            </div>
            <div className="form-field">
              {/* Spacer for 2-column alignment layout balance */}
            </div>
          </div>

          <div className="form-field">
            <label>Project title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Solar-powered water quality monitor"
              autoComplete="off"
            />
          </div>

          <div className="form-field">
            <label>Abstract (short)</label>
            <textarea
              name="abstract"
              rows={3}
              required
              placeholder="What are you building, and what's the goal?"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Team size (incl. you)</label>
              <input
                type="number"
                name="slots_needed"
                min={2}
                max={20}
                defaultValue={4}
                required
              />
            </div>
            <div className="form-field">
              <label>Review window (days)</label>
              <input
                type="number"
                name="review_days"
                min={1}
                max={14}
                defaultValue={5}
                required
              />
            </div>
          </div>

          <div className="form-field" style={{ position: 'relative' }}>
            <label className="flex justify-between w-full">
              <span>Keywords (search & select)</span>
              <span className="text-[10px] text-[#c68227]">{selectedKeywords.length}/10 selected</span>
            </label>
            <input
              type="text"
              value={keywordSearch}
              onChange={handleKeywordSearchChange}
              placeholder="Type to search and add keywords..."
              autoComplete="off"
            />
            
            {showDropdown && filteredSuggestions.length > 0 && (
              <div className="kw-dropdown show">
                {filteredSuggestions.map((kw) => (
                  <div
                    key={kw}
                    className="kw-dropdown-item font-mono"
                    onClick={() => handleSelectKeyword(kw)}
                  >
                    {kw}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedKeywords.length > 0 && (
            <div className="selected-kws-container">
              {selectedKeywords.map((kw) => (
                <div key={kw} className="selected-kw-tag">
                  <span>{kw}</span>
                  <button type="button" onClick={() => handleRemoveKeyword(kw)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="helper">
            New calls enter a review queue and appear on the feed once an organizer approves them — this keeps the directory spam-free.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-solid btn-block"
          >
            {isSubmitting ? 'Submitting for approval...' : 'Submit for approval'}
          </button>
        </form>
      </div>
    </div>
  );
}
