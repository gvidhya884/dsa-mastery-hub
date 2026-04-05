// LocalStorage management for user data

const STORAGE_KEYS = {
  NOTES: 'dsa_user_notes',
  BOOKMARKS: 'dsa_bookmarks',
  PROGRESS: 'dsa_progress',
  MASTERY: 'dsa_mastery',
  STREAK: 'dsa_streak',
  CUSTOM_CONCEPTS: 'dsa_custom_concepts',
  QUIZ_SCORES: 'dsa_quiz_scores',
  RECENT_CONCEPTS: 'dsa_recent_concepts',
  SEARCH_HISTORY: 'dsa_search_history'
};

export const storage = {
  // Notes
  getNotes: () => {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : {};
  },
  
  saveNote: (conceptId, note) => {
    const notes = storage.getNotes();
    notes[conceptId] = note;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
  
  deleteNote: (conceptId) => {
    const notes = storage.getNotes();
    delete notes[conceptId];
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
  
  // Bookmarks
  getBookmarks: () => {
    const bookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return bookmarks ? JSON.parse(bookmarks) : [];
  },
  
  toggleBookmark: (conceptId) => {
    const bookmarks = storage.getBookmarks();
    if (bookmarks.includes(conceptId)) {
      const newBookmarks = bookmarks.filter(id => id !== conceptId);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
      return false;
    } else {
      bookmarks.push(conceptId);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return true;
    }
  },
  
  // Mastery Level
  getMastery: () => {
    const mastery = localStorage.getItem(STORAGE_KEYS.MASTERY);
    return mastery ? JSON.parse(mastery) : {};
  },
  
  setMastery: (conceptId, level) => {
    const mastery = storage.getMastery();
    mastery[conceptId] = level;
    localStorage.setItem(STORAGE_KEYS.MASTERY, JSON.stringify(mastery));
  },
  
  // Streak
  updateStreak: () => {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem(STORAGE_KEYS.STREAK);
    let streak = streakData ? JSON.parse(streakData) : { current: 0, lastActive: null, longest: 0 };
    
    if (streak.lastActive === today) {
      return streak;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (streak.lastActive === yesterday.toDateString()) {
      streak.current++;
    } else {
      streak.current = 1;
    }
    
    streak.lastActive = today;
    streak.longest = Math.max(streak.longest, streak.current);
    
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    return streak;
  },
  
  getStreak: () => {
    const streak = localStorage.getItem(STORAGE_KEYS.STREAK);
    return streak ? JSON.parse(streak) : { current: 0, lastActive: null, longest: 0 };
  },
  
  // Custom Concepts
  getCustomConcepts: () => {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONCEPTS);
    return custom ? JSON.parse(custom) : [];
  },
  
  addCustomConcept: (concept) => {
    const custom = storage.getCustomConcepts();
    concept.id = `custom_${Date.now()}`;
    concept.userCreated = true;
    custom.push(concept);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CONCEPTS, JSON.stringify(custom));
    return concept;
  },
  
  deleteCustomConcept: (id) => {
    const custom = storage.getCustomConcepts();
    const filtered = custom.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CONCEPTS, JSON.stringify(filtered));
  },
  
  // Progress
  markConceptStudied: (conceptId) => {
    const progress = storage.getProgress();
    if (!progress.includes(conceptId)) {
      progress.push(conceptId);
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    }
    storage.updateStreak();
  },
  
  getProgress: () => {
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : [];
  },
  
  // Quiz Scores
  saveQuizScore: (score, total, topic) => {
    const scores = storage.getQuizScores();
    scores.push({
      date: new Date().toISOString(),
      score,
      total,
      topic,
      percentage: (score / total) * 100
    });
    localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
  },
  
  getQuizScores: () => {
    const scores = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
    return scores ? JSON.parse(scores) : [];
  },
  
  // Recent Concepts
  getRecentConcepts: () => {
    const recent = localStorage.getItem(STORAGE_KEYS.RECENT_CONCEPTS);
    return recent ? JSON.parse(recent) : [];
  },
  
  addToRecentConcepts: (concept) => {
    let recent = storage.getRecentConcepts();
    recent = recent.filter(c => c.id !== concept.id);
    recent.unshift(concept);
    recent = recent.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_CONCEPTS, JSON.stringify(recent));
  },
  
  // Search History
  getSearchHistory: () => {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return history ? JSON.parse(history) : [];
  },
  
  addToSearchHistory: (query) => {
    let history = storage.getSearchHistory();
    history = history.filter(q => q !== query);
    history.unshift(query);
    history = history.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  }
};