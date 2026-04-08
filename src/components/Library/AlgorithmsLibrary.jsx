import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, BookOpen, Star } from 'lucide-react';
import { storage } from '../../utils/storage';

const AlgorithmsLibrary = ({ allConcepts, onSelectConcept }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [filteredConcepts, setFilteredConcepts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Get unique categories
  const categories = ['All', ...new Set(allConcepts.map(c => c.category))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    setBookmarks(storage.getBookmarks());
  }, []);

  useEffect(() => {
    let filtered = [...allConcepts];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.definition && c.definition.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
    }
    
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'difficulty') {
      const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    }
    
    setFilteredConcepts(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, allConcepts]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📚 Algorithms Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse all {allConcepts.length} DSA concepts
          </p>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search algorithms by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
              >
                <option value="name">Name (A-Z)</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredConcepts.length} of {allConcepts.length} concepts
        </p>
      </div>

      {filteredConcepts.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No concepts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredConcepts.map((concept, index) => (
            <button
              key={concept.id}
              onClick={() => onSelectConcept(concept)}
              className="card hover:shadow-lg transition-all duration-200 text-left group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-400 dark:text-gray-500 font-mono">
                      #{index + 1}
                    </span>
                    {bookmarks.includes(concept.id) && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {concept.name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {concept.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(concept.difficulty)}`}>
                      {concept.difficulty}
                    </span>
                    {concept.time_complexity && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        ⏱️ {concept.time_complexity.average}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {concept.definition ? concept.definition.substring(0, 150) : 'No description available'}...
                  </p>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all ml-4 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const StatsSummary = () => {
  return <div>Stats</div>;
};
export default AlgorithmsLibrary;