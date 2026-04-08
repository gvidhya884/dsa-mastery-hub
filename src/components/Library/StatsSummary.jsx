import React from 'react';
import { TrendingUp, BookOpen, Award, Target } from 'lucide-react';

const StatsSummary = ({ allConcepts }) => {
  const categories = [...new Set(allConcepts.map(c => c.category))];
  const easyCount = allConcepts.filter(c => c.difficulty === 'Easy').length;
  const mediumCount = allConcepts.filter(c => c.difficulty === 'Medium').length;
  const hardCount = allConcepts.filter(c => c.difficulty === 'Hard').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card text-center">
        <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <div className="text-2xl font-bold">{allConcepts.length}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Concepts</div>
      </div>
      
      <div className="card text-center">
        <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <div className="text-2xl font-bold">{categories.length}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
      </div>
      
      <div className="card text-center">
        <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <div className="text-2xl font-bold">{easyCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Easy Concepts</div>
      </div>
      
      <div className="card text-center">
        <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
        <div className="text-2xl font-bold">{hardCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Hard Concepts</div>
      </div>
    </div>
  );
};

export default StatsSummary;