import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { storage } from '../../utils/storage';

const BookmarksList = ({ allConcepts, onSelectConcept }) => {
  const [bookmarkedConcepts, setBookmarkedConcepts] = useState([]);

  useEffect(() => {
    const bookmarks = storage.getBookmarks();
    const concepts = allConcepts.filter(c => bookmarks.includes(c.id));
    setBookmarkedConcepts(concepts);
  }, [allConcepts]);

  const removeBookmark = (conceptId) => {
    storage.toggleBookmark(conceptId);
    const bookmarks = storage.getBookmarks();
    const concepts = allConcepts.filter(c => bookmarks.includes(c.id));
    setBookmarkedConcepts(concepts);
  };

  if (bookmarkedConcepts.length === 0) {
    return (
      <div className="card text-center py-12">
        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Bookmarks Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Click the bookmark icon on any concept to save it for later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">⭐ Your Bookmarks</h2>
      <div className="grid gap-4">
        {bookmarkedConcepts.map(concept => (
          <div key={concept.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => onSelectConcept(concept)}
                className="flex-1 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {concept.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {concept.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    concept.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    concept.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {concept.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {concept.definition.substring(0, 150)}...
                </p>
              </div>
              <button
                onClick={() => removeBookmark(concept.id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove bookmark"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksList;