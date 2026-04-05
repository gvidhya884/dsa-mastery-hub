import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';

const SearchBar = ({ onSearch, onSelect, avlTree, allConcepts, searchHistory }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length >= 1) {
      const results = avlTree.searchByPrefix(avlTree.root, query);
      setSuggestions(results.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, avlTree]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectSuggestion = (concept) => {
    setQuery(concept.name);
    onSelect(concept);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder="🔍 Search any DSA concept... (e.g., Binary Search, AVL Tree)"
          className="w-full px-5 py-4 pl-12 pr-12 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
          {/* Search History */}
          {!query && searchHistory.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500">RECENT SEARCHES</div>
              {searchHistory.slice(0, 5).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item);
                    onSearch(item);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Suggestions */}
          {suggestions.map((concept) => (
            <button
              key={concept.id}
              onClick={() => handleSelectSuggestion(concept)}
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
                {concept.definition?.substring(0, 100)}...
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;