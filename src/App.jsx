import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import SearchBar from './components/Search/SearchBar';
import ConceptPage from './components/Concept/ConceptPage';
import QuizWidget from './components/Quiz/QuizWidget';
import ProgressDashboard from './components/Progress/ProgressDashboard';
import AddCustomConcept from './components/CustomConcept/AddCustomConcept';
import BookmarksList from './components/Bookmarks/BookmarksList';
import ProfilePage from './components/Profile/ProfilePage';
import AVLTree from './utils/avlTree';
import { fuzzySearch, initSearchEngine } from './utils/searchEngine';
import { storage } from './utils/storage';
import dataset from './data/dsa_dataset';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentConcept, setCurrentConcept] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [avlTree, setAvlTree] = useState(null);
  const [allConcepts, setAllConcepts] = useState([]);
  const [recentConcepts, setRecentConcepts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Initialize AVL Tree with dataset
  useEffect(() => {
    const tree = new AVLTree();
    let root = null;
    
    if (dataset && dataset.length > 0) {
      dataset.forEach(concept => {
        root = tree.insert(root, concept.name.toLowerCase(), concept);
      });
    }
    
    const customConcepts = storage.getCustomConcepts();
    customConcepts.forEach(concept => {
      root = tree.insert(root, concept.name.toLowerCase(), concept);
    });
    
    tree.root = root;
    setAvlTree(tree);
    
    const all = tree.getAllNodes(tree.root);
    setAllConcepts(all);
    
    initSearchEngine(all);
    
    const recent = storage.getRecentConcepts();
    setRecentConcepts(recent);
    
    const history = storage.getSearchHistory();
    setSearchHistory(history);
    
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearch = (query) => {
    if (avlTree) {
      const concept = avlTree.search(avlTree.root, query.toLowerCase());
      if (concept) {
        setCurrentConcept(concept);
        setActiveTab('home');
        storage.addToRecentConcepts(concept);
        setRecentConcepts(storage.getRecentConcepts());
        storage.addToSearchHistory(query);
        setSearchHistory(storage.getSearchHistory());
      } else {
        const results = fuzzySearch(query);
        if (results.length > 0) {
          setCurrentConcept(results[0]);
          setActiveTab('home');
          storage.addToRecentConcepts(results[0]);
          setRecentConcepts(storage.getRecentConcepts());
        } else {
          alert('Concept not found! Try searching for: Binary Search, AVL Tree, Quick Sort, etc.');
        }
      }
    }
  };

  const handleSelect = (concept) => {
    setCurrentConcept(concept);
    setActiveTab('home');
    storage.addToRecentConcepts(concept);
    setRecentConcepts(storage.getRecentConcepts());
  };

  const handleAddCustomConcept = (newConcept) => {
    if (avlTree) {
      const root = avlTree.insert(avlTree.root, newConcept.name.toLowerCase(), newConcept);
      avlTree.root = root;
      const all = avlTree.getAllNodes(avlTree.root);
      setAllConcepts(all);
      initSearchEngine(all);
      alert(`"${newConcept.name}" added successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onSelect={handleSelect}
            avlTree={avlTree}
            allConcepts={allConcepts}
            searchHistory={searchHistory}
          />
        </div>

        {recentConcepts.length > 0 && activeTab === 'home' && !currentConcept && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              🔥 RECENTLY VIEWED
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentConcepts.slice(0, 5).map(concept => (
                <button
                  key={concept.id}
                  onClick={() => handleSelect(concept)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow"
                >
                  {concept.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation - ALL 6 TABS INCLUDED */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { setActiveTab('home'); setCurrentConcept(null); }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'home'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            📚 Dictionary
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            ⭐ Bookmarks
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'quiz'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            ❓ Quiz
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'progress'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            📊 Progress
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'add'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            ➕ Add Concept
          </button>
        </div>

        {/* Content Sections - ALL COMPONENTS ARE NOW USED */}
        {activeTab === 'home' && (
          currentConcept ? (
            <ConceptPage 
              concept={currentConcept} 
              allConcepts={allConcepts}
              onRelatedClick={handleSelect}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                Welcome to DSA Mastery Hub! 🚀
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Search for any DSA concept above to get started.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {allConcepts.slice(0, 8).map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => handleSelect(concept)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{concept.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{concept.category}</div>
                    <div className={`text-xs mt-1 px-2 py-0.5 inline-block rounded ${
                      concept.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      concept.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {concept.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksList 
            allConcepts={allConcepts} 
            onSelectConcept={(concept) => {
              setCurrentConcept(concept);
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'quiz' && <QuizWidget allConcepts={allConcepts} />}
        
        {activeTab === 'progress' && (
          <ProgressDashboard totalConcepts={allConcepts.length} />
        )}

        {activeTab === 'profile' && <ProfilePage />}
        
        {activeTab === 'add' && (
          <AddCustomConcept onAdd={handleAddCustomConcept} />
        )}
      </main>
    </div>
  );
}


export default App;