'use client';

import React, { useState, useMemo } from 'react';
import { KeywordEngine } from '@/lib/keywords';

export default function AutocompleteInput() {
  const [query, setQuery] = useState('');

  // Runs instantly in memory with zero typing lag
  const suggestions = useMemo(() => {
    return KeywordEngine.search(query, 8); // Top 8 matches
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search keywords (e.g., CanSat, ESP32, Water)..."
        className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setQuery(item);
              }}
              className="px-4 py-2 hover:bg-slate-800 text-slate-200 cursor-pointer text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
