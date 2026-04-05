import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import quizData from '../../data/quiz_questions.json';
import { storage } from '../../utils/storage';

const QuizWidget = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Randomly select 5 questions
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === questions[currentIndex]?.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      storage.saveQuizScore(score, questions.length, 'Mixed Topics');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const restartQuiz = () => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (questions.length === 0) {
    return <div className="card">Loading quiz...</div>;
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed! 🎉</h2>
        <div className="text-4xl font-bold mb-2">
          {score} / {questions.length}
        </div>
        <div className="text-lg mb-4">Score: {percentage}%</div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <button onClick={restartQuiz} className="btn-primary">
          Take Another Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQ?.correct;

  return (
    <div className="card">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            Score: {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">{currentQ?.question}</h3>

      <div className="space-y-3 mb-6">
        {currentQ?.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => !showResult && handleAnswer(idx)}
            disabled={showResult}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              showResult && idx === currentQ.correct
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : showResult && selectedAnswer === idx && idx !== currentQ.correct
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : selectedAnswer === idx
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono">{String.fromCharCode(65 + idx)}.</span>
              <span>{option}</span>
              {showResult && idx === currentQ.correct && (
                <Check className="w-5 h-5 text-green-500 ml-auto" />
              )}
              {showResult && selectedAnswer === idx && idx !== currentQ.correct && (
                <X className="w-5 h-5 text-red-500 ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showResult && (
        <div className={`p-3 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 dark:bg-green-900/20 text-green-700' : 'bg-red-100 dark:bg-red-900/20 text-red-700'
        }`}>
          <p className="font-semibold mb-1">
            {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
          </p>
          <p className="text-sm">{currentQ?.explanation}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {showResult && (
          <button onClick={handleNext} className="btn-primary">
            {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizWidget;