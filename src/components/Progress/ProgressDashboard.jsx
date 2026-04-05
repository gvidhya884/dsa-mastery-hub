import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';

const ProgressDashboard = ({ totalConcepts }) => {
  const [progress, setProgress] = useState([]);
  const [mastery, setMastery] = useState({});
  const [streak, setStreak] = useState({});

  useEffect(() => {
    setProgress(storage.getProgress());
    setMastery(storage.getMastery());
    setStreak(storage.getStreak());
  }, []);

  const studiedCount = progress.length;
  const percentage = (studiedCount / totalConcepts) * 100;
  
  const averageMastery = Object.values(mastery).reduce((a, b) => a + b, 0) / Object.values(mastery).length || 0;

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <div className="card bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <h3 className="text-lg font-semibold mb-2">🔥 Current Streak</h3>
        <div className="text-4xl font-bold">{streak.current || 0} days</div>
        <p className="text-sm opacity-90 mt-1">Longest: {streak.longest || 0} days</p>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">📊 Overall Progress</h3>
        <div className="mb-2 flex justify-between text-sm">
          <span>Studied: {studiedCount}/{totalConcepts} concepts</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Mastery Level */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">⭐ Average Mastery</h3>
        <div className="text-3xl font-bold text-yellow-500">
          {averageMastery.toFixed(1)} / 5
        </div>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={`flex-1 h-2 rounded ${
                level <= averageMastery ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Study Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">📈 Study Statistics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Concepts Mastered (5★)</span>
            <span className="font-semibold">
              {Object.values(mastery).filter(m => m === 5).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">In Progress</span>
            <span className="font-semibold">
              {Object.values(mastery).filter(m => m > 0 && m < 5).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Not Started</span>
            <span className="font-semibold">
              {totalConcepts - Object.values(mastery).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;