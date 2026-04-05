import React, { useState, useEffect } from 'react';
import { User, Trophy, BookOpen, Calendar, Download, Settings } from 'lucide-react';
import { storage } from '../../utils/storage';

const ProfilePage = () => {
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [progress, setProgress] = useState([]);
  const [mastery, setMastery] = useState({});
  const [quizScores, setQuizScores] = useState([]);

  useEffect(() => {
    setStreak(storage.getStreak());
    setProgress(storage.getProgress());
    setMastery(storage.getMastery());
    setQuizScores(storage.getQuizScores());
  }, []);

  const exportData = () => {
    const data = {
      bookmarks: storage.getBookmarks(),
      notes: storage.getNotes(),
      mastery: storage.getMastery(),
      progress: storage.getProgress(),
      streak: storage.getStreak(),
      quizScores: storage.getQuizScores(),
      customConcepts: storage.getCustomConcepts()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_mastery_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Are you sure? This will delete all your notes, bookmarks, and progress!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const avgMastery = Object.values(mastery).reduce((a, b) => a + b, 0) / (Object.values(mastery).length || 1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold">DSA Learner</h2>
        <p className="text-gray-600 dark:text-gray-400">Mastering Data Structures & Algorithms</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{streak.current || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
        </div>
        <div className="card text-center">
          <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{progress.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Concepts Studied</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-500">{avgMastery.toFixed(1)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Mastery Level</div>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{quizScores.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes Taken</div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">⚙️ Settings & Actions</h3>
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <span>📥 Export All Data (Backup)</span>
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <span>🗑️ Clear All Data (Reset App)</span>
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;