import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, Volume2, Copy, Check, Download, Share2 } from 'lucide-react';
import ComplexityBadge from './ComplexityBadge';
import CodeBlock from './CodeBlock';
import NotesPanel from '../Notes/NotesPanel';
import { storage } from '../../utils/storage';
import html2pdf from 'html2pdf.js';

const ConceptPage = ({ concept, allConcepts, onRelatedClick }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [showDailyChallenge, setShowDailyChallenge] = useState(true);

  useEffect(() => {
    if (concept) {
      const bookmarks = storage.getBookmarks();
      setIsBookmarked(bookmarks.includes(concept.id));
      
      const mastery = storage.getMastery();
      setMasteryLevel(mastery[concept.id] || 0);
      
      storage.markConceptStudied(concept.id);
      
      // Random daily challenge
      const today = new Date().toDateString();
      const lastChallenge = localStorage.getItem('daily_challenge_date');
      if (lastChallenge !== today) {
        setShowDailyChallenge(true);
      }
    }
  }, [concept]);

  const handleBookmark = () => {
    const newState = storage.toggleBookmark(concept.id);
    setIsBookmarked(newState);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(concept.code_example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(concept.definition);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMastery = (level) => {
    setMasteryLevel(level);
    storage.setMastery(concept.id, level);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('concept-content');
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${concept.name}_notes.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: concept.name,
        text: concept.definition,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${concept.name}: ${concept.definition}`);
      alert('Copied to clipboard!');
    }
  };

  // Find related concepts (same category)
  const relatedConcepts = allConcepts.filter(c => 
    c.category === concept.category && c.id !== concept.id
  ).slice(0, 5);

  if (!concept) return null;

  return (
    <div id="concept-content" className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {concept.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {concept.category}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                concept.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                concept.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {concept.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
              }`}
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Add Note"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={handleSpeak}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Listen (Text-to-Speech)"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleExportPDF}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Export as PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Challenge Popup */}
      {showDailyChallenge && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">🏆 Daily Challenge</h3>
              <p className="text-sm">What is the time complexity of {concept.name}?</p>
            </div>
            <button
              onClick={() => setShowDailyChallenge(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Definition */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">📖 Definition</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {concept.definition}
        </p>
      </div>

      {/* Complexity */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">⏱️ Complexity Analysis</h2>
        <ComplexityBadge complexities={concept.time_complexity} space={concept.space_complexity} />
      </div>

      {/* Code Example */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">💻 Code Example</h2>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <CodeBlock code={concept.code_example} language="python" />
      </div>

      {/* Applications */}
      {concept.applications && concept.applications.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-3">🎯 Real-World Applications</h2>
          <ul className="list-disc list-inside space-y-2">
            {concept.applications.map((app, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">{app}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Points */}
      {concept.key_points && concept.key_points.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-3">💡 Key Points</h2>
          <ul className="list-disc list-inside space-y-2">
            {concept.key_points.map((point, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* YouTube Video */}
      {concept.youtube_url && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-3">📺 Video Tutorial</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={concept.youtube_url.replace('watch?v=', 'embed/')}
              title={`${concept.name} tutorial`}
              className="w-full h-64 rounded-lg"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Related Concepts */}
      {relatedConcepts.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-3">🔗 Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map(related => (
              <button
                key={related.id}
                onClick={() => onRelatedClick(related)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {related.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mastery Level */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">🎯 Mastery Level</h2>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              onClick={() => handleMastery(level)}
              className={`text-2xl transition-transform hover:scale-110 ${
                level <= masteryLevel ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            {masteryLevel > 0 ? `Level ${masteryLevel}/5` : 'Rate your understanding'}
          </span>
        </div>
      </div>

      {/* Notes Panel */}
      {showNotes && <NotesPanel conceptId={concept.id} conceptName={concept.name} />}
    </div>
  );
};

export default ConceptPage;