import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props {
  value: string;
  onChange: (val: string) => void;
  debounceTime?: number;
}

const SearchBar = ({ value, onChange, debounceTime = 300 }: Props) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounceTime);
    
    return () => clearTimeout(handler);
  }, [inputValue, debounceTime, onChange]);

  return (
    <div className="relative group w-full max-w-lg mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="ابحث عن خدمات، مزودين، أو فئات..."
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                 shadow-sm transition-all duration-200
                 text-gray-700 placeholder-gray-400
                 hover:border-gray-300"
      />
      
      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5
                   text-gray-400 hover:text-gray-600 rounded-full
                   transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default React.memo(SearchBar);