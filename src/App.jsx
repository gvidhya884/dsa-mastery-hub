import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Layout/Header';
import SearchBar from './components/Search/SearchBar';
import ConceptPage from './components/Concept/ConceptPage';
import QuizWidget from './components/Quiz/QuizWidget';
import ProgressDashboard from './components/Progress/ProgressDashboard';
import AddCustomConcept from './components/CustomConcept/AddCustomConcept';
import BookmarksList from './components/Bookmarks/BookmarksList';
import ProfilePage from './components/Profile/ProfilePage';
import AlgorithmsLibrary from './components/library/AlgorithmsLibrary';
import StatsSummary from './components/library/StatsSummary';
import AVLTree from './utils/avlTree';
import { fuzzySearch, initSearchEngine } from './utils/searchEngine';
import { storage } from './utils/storage';

// Dynamic import for dataset to enable hot reload
let dataset = [];

// Function to load dataset dynamically
const loadDataset = async () => {
  try {
    // Add timestamp to prevent caching
    const response = await fetch(`src/data/dsa_dataset.json?t=${Date.now()}`);
    if (response.ok) {
      const data = await response.json();
      dataset = data;
      console.log(`✅ Loaded ${dataset.length} concepts from dataset`);
      return data;
    }
  } catch (error) {
    console.error('Error loading dataset:', error);
  }
  return [];
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentConcept, setCurrentConcept] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [avlTree, setAvlTree] = useState(null);
  const [allConcepts, setAllConcepts] = useState([]);
  const [recentConcepts, setRecentConcepts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [datasetVersion, setDatasetVersion] = useState(0);

  // Function to rebuild AVL tree from all data sources
  const rebuildAVLTree = useCallback(async () => {
    // Load fresh dataset
    const freshDataset = await loadDataset();
    
    const tree = new AVLTree();
    let root = null;
    
    // Insert all concepts from dataset
    if (freshDataset && freshDataset.length > 0) {
      freshDataset.forEach(concept => {
        root = tree.insert(root, concept.name.toLowerCase(), concept);
      });
      console.log(`📚 Inserted ${freshDataset.length} base concepts`);
    }
    
    // Insert custom concepts from localStorage
    const customConcepts = storage.getCustomConcepts();
    if (customConcepts.length > 0) {
      customConcepts.forEach(concept => {
        root = tree.insert(root, concept.name.toLowerCase(), concept);
      });
      console.log(`📝 Inserted ${customConcepts.length} custom concepts`);
    }
    
    tree.root = root;
    setAvlTree(tree);
    
    // Get all concepts for search
    const all = tree.getAllNodes(tree.root);
    setAllConcepts(all);
    
    // Initialize fuzzy search
    initSearchEngine(all);
    
    return all;
  }, []);

  // Initialize AVL Tree with dataset
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await rebuildAVLTree();
      
      // Load recent concepts
      const recent = storage.getRecentConcepts();
      setRecentConcepts(recent);
      
      // Load search history
      const history = storage.getSearchHistory();
      setSearchHistory(history);
      
      // Apply dark mode
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === 'true') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
      
      setIsLoading(false);
    };
    
    initialize();
  }, [rebuildAVLTree, datasetVersion]);

  // Watch for dataset file changes (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      let lastModified = null;
      
      const checkForUpdates = async () => {
        try {
          const response = await fetch('/src/data/dsa_dataset.json', {
            method: 'HEAD',
            cache: 'no-store'
          });
          const lastModifiedHeader = response.headers.get('last-modified');
          
          if (lastModified && lastModifiedHeader && lastModifiedHeader !== lastModified) {
            console.log('🔄 Dataset file changed! Reloading...');
            setDatasetVersion(prev => prev + 1);
          }
          lastModified = lastModifiedHeader;
        } catch (e) {
          // Ignore errors
        }
      };
      
      const interval = setInterval(checkForUpdates, 3000);
      return () => clearInterval(interval);
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

  const handleSearch = async (query) => {
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

  const handleAddCustomConcept = async (newConcept) => {
    if (avlTree) {
      // Save to localStorage
      const savedConcept = storage.addCustomConcept(newConcept);
      
      // Rebuild the AVL tree with the new concept
      const all = await rebuildAVLTree();
      
      // Update all concepts state
      setAllConcepts(all);
      
      // Force a refresh of the search engine
      initSearchEngine(all);
      
      // Show success message
      alert(`✅ "${savedConcept.name}" added successfully!\n\nYou can now search for it.`);
      
      // Optional: Navigate to the new concept
      setCurrentConcept(savedConcept);
      setActiveTab('home');
    }
  };

  // Manual reload function for dataset
  const handleReloadDataset = async () => {
    setIsLoading(true);
    await rebuildAVLTree();
    setIsLoading(false);
    alert(`✅ Dataset reloaded! Total concepts: ${allConcepts.length}`);
  };

  // Function to render home content
  const renderHomeContent = () => {
    if (currentConcept) {
      return (
        <ConceptPage 
          concept={currentConcept} 
          allConcepts={allConcepts}
          onRelatedClick={handleSelect}
        />
      );
    }
    
    return (
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
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading DSA Mastery Hub...</p>
        </div>
      </div>
    );
  }

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

        {/* Tab Navigation - ALL 7 TABS */}
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
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'library'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            📖 All Algorithms ({allConcepts.length})
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

        {/* Content Sections */}
        {activeTab === 'home' && renderHomeContent()}

        {activeTab === 'library' && (
          <div className="space-y-6">
            <StatsSummary allConcepts={allConcepts} />
            <AlgorithmsLibrary 
              allConcepts={allConcepts} 
              onSelectConcept={(concept) => {
                setCurrentConcept(concept);
                setActiveTab('home');
              }}
            />
          </div>
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

      {/* Development: Manual Reload Button */}
      {import.meta.env.DEV && (
        <button
          onClick={handleReloadDataset}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 text-sm transition-colors"
          title="Reload Dataset"
        >
          🔄 Reload ({allConcepts.length})
        </button>
      )}
    </div>
  );
}

export default App;