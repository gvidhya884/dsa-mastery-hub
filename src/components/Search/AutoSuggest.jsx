import React from 'react';

const AutoSuggest = ({ suggestions, onSelect, query }) => {
  return (
    <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
      {suggestions.map((concept, index) => (
        <button
          key={concept.id}
          onClick={() => onSelect(concept)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {concept.name}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {concept.category}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              concept.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              concept.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {concept.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
            {concept.definition.substring(0, 100)}...
          </p>
        </button>
      ))}
    </div>
  );
};

export default AutoSuggest;