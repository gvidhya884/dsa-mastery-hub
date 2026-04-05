import React from 'react';

const ComplexityBadge = ({ complexities, space }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Best Case</p>
        <p className="text-lg font-mono font-bold text-blue-600">{complexities.best}</p>
      </div>
      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Average Case</p>
        <p className="text-lg font-mono font-bold text-green-600">{complexities.average}</p>
      </div>
      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Worst Case</p>
        <p className="text-lg font-mono font-bold text-red-600">{complexities.worst}</p>
      </div>
      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">Space Complexity</p>
        <p className="text-lg font-mono font-bold text-purple-600">{space}</p>
      </div>
    </div>
  );
};

export default ComplexityBadge;