import Fuse from 'fuse.js';

let fuseInstance = null;

export const initSearchEngine = (concepts) => {
  const options = {
    keys: ['name', 'definition', 'category'],
    threshold: 0.3,  // Fuzzy matching
    distance: 100,
    includeScore: true
  };
  
  fuseInstance = new Fuse(concepts, options);
  return fuseInstance;
};

export const fuzzySearch = (query) => {
  if (!fuseInstance || !query || query.length < 2) return [];
  const results = fuseInstance.search(query);
  return results.slice(0, 10).map(r => r.item);
};

export const autoCorrect = (query, concepts) => {
  if (!query || query.length < 2) return null;
  
  const words = concepts.map(c => c.name.toLowerCase());
  const found = words.find(word => word === query.toLowerCase());
  
  if (found) return query;
  
  // Find closest match
  const closest = fuzzySearch(query);
  if (closest.length > 0 && closest[0].name.toLowerCase() !== query.toLowerCase()) {
    return closest[0].name;
  }
  
  return null;
};

export const getSuggestions = (prefix, avlTree) => {
  if (!prefix || prefix.length < 1) return [];
  const results = avlTree.searchByPrefix(avlTree.root, prefix);
  return results.slice(0, 8);
};