import React, { useState, useEffect } from 'react';
import { BookOpen, Moon, Sun, Trophy, User } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('dsa_streak');
    if (stored) {
      const streakData = JSON.parse(stored);
      setStreak(streakData.current || 0);
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              DSA Mastery Hub
            </h1>
          </div>

          {/* Stats & Controls */}
          <div className="flex items-center space-x-4">
            {/* Streak */}
            <div className="hidden sm:flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                🔥 {streak} day streak
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile */}
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;