import React, { useState } from 'react';

const AddCustomConcept = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Custom',
    difficulty: 'Medium',
    definition: '',
    code_example: '',
    applications: '',
    key_points: '',
    time_complexity_best: 'O(?)',
    time_complexity_avg: 'O(?)',
    time_complexity_worst: 'O(?)',
    space_complexity: 'O(?)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newConcept = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      difficulty: formData.difficulty,
      definition: formData.definition,
      time_complexity: {
        best: formData.time_complexity_best,
        average: formData.time_complexity_avg,
        worst: formData.time_complexity_worst
      },
      space_complexity: formData.space_complexity,
      code_example: formData.code_example,
      applications: formData.applications.split(',').map(s => s.trim()).filter(s => s),
      key_points: formData.key_points.split(',').map(s => s.trim()).filter(s => s),
      userCreated: true,
      dateAdded: new Date().toISOString()
    };
    
    onAdd(newConcept);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Custom',
      difficulty: 'Medium',
      definition: '',
      code_example: '',
      applications: '',
      key_points: '',
      time_complexity_best: 'O(?)',
      time_complexity_avg: 'O(?)',
      time_complexity_worst: 'O(?)',
      space_complexity: 'O(?)'
    });
    
    alert(`✅ "${newConcept.name}" added successfully!\n\nIt will appear in search results.`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">➕ Add Custom DSA Concept</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your custom concepts will be saved permanently in your browser.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Concept Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                placeholder="e.g., Two Pointer Technique"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option>Searching</option>
                <option>Sorting</option>
                <option>Tree</option>
                <option>Graph</option>
                <option>Dynamic Programming</option>
                <option>String</option>
                <option>Mathematical</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          
          {/* Complexity Section - Now showing! */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-md font-semibold mb-3">⏱️ Time Complexity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Best Case</label>
                <input
                  type="text"
                  value={formData.time_complexity_best}
                  onChange={(e) => setFormData({...formData, time_complexity_best: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="O(1)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Average Case</label>
                <input
                  type="text"
                  value={formData.time_complexity_avg}
                  onChange={(e) => setFormData({...formData, time_complexity_avg: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="O(log n)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Worst Case</label>
                <input
                  type="text"
                  value={formData.time_complexity_worst}
                  onChange={(e) => setFormData({...formData, time_complexity_worst: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="O(n)"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Space Complexity</label>
              <input
                type="text"
                value={formData.space_complexity}
                onChange={(e) => setFormData({...formData, space_complexity: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                placeholder="O(1)"
              />
            </div>
          </div>
          
          {/* Definition */}
          <div>
            <label className="block text-sm font-medium mb-1">Definition *</label>
            <textarea
              required
              rows="3"
              value={formData.definition}
              onChange={(e) => setFormData({...formData, definition: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              placeholder="Explain the concept in 2-3 sentences..."
            />
          </div>
          
          {/* Code Example */}
          <div>
            <label className="block text-sm font-medium mb-1">Code Example (C/Python/Java)</label>
            <textarea
              rows="5"
              value={formData.code_example}
              onChange={(e) => setFormData({...formData, code_example: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm"
              placeholder="#include <stdio.h>\n\nint main() {\n    printf('Hello');\n    return 0;\n}"
            />
          </div>
          
          {/* Applications */}
          <div>
            <label className="block text-sm font-medium mb-1">Applications (comma separated)</label>
            <input
              type="text"
              value={formData.applications}
              onChange={(e) => setFormData({...formData, applications: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              placeholder="Database indexing, File systems, Caching"
            />
          </div>
          
          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium mb-1">Key Points (comma separated)</label>
            <input
              type="text"
              value={formData.key_points}
              onChange={(e) => setFormData({...formData, key_points: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              placeholder="Self-balancing, O(log n) operations, Rotations"
            />
          </div>
          
          <button type="submit" className="btn-primary w-full py-3">
            ➕ Add to Dictionary (Permanently Saved)
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            💾 Your custom concept will be saved in your browser and appear in search results.
            <br />
            To delete, go to Profile → Clear Data or use browser DevTools.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddCustomConcept;