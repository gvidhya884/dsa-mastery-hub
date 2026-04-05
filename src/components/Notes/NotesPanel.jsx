import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { storage } from '../../utils/storage';

const NotesPanel = ({ conceptId, conceptName }) => {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const notes = storage.getNotes();
    setNote(notes[conceptId] || '');
  }, [conceptId]);

  const handleSave = () => {
    if (note.trim()) {
      storage.saveNote(conceptId, note);
    } else {
      storage.deleteNote(conceptId);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    setNote('');
    storage.deleteNote(conceptId);
  };

  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">📝 My Notes - {conceptName}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save'}
          </button>
          {note && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your personal notes about this concept..."
        className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default NotesPanel;