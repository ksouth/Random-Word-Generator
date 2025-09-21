import React, { useState, useEffect } from 'react';
import { wordList } from '../services/wordGenerator';

interface WordCardProps {
  word: string;
  index: number;
  generationKey: number;
  onWordClick: (word: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, index, generationKey, onWordClick }) => {
  const [displayWord, setDisplayWord] = useState<string>(word);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isSettled, setIsSettled] = useState<boolean>(true);

  const isClickable = isSettled && word && !word.includes('❓');

  useEffect(() => {
    // When the parent passes a new word directly without a new generation key (e.g., initial load, count change)
    if (generationKey === 0) {
      setDisplayWord(word);
      setIsSettled(true);
      return;
    }

    // Start spinning animation
    setIsSpinning(true);
    setIsSettled(false);

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      setDisplayWord(wordList[randomIndex]);
    }, 75);

    // Stop spinning after a staggered delay
    const stopTimeout = setTimeout(() => {
      clearInterval(spinInterval);
      setDisplayWord(word);
      setIsSpinning(false);
      // Trigger "settle" animation
      setIsSettled(true);
    }, 1000 + index * 150);

    return () => {
      clearInterval(spinInterval);
      clearTimeout(stopTimeout);
    };
  }, [generationKey, index, word]);

  return (
    <div
      onClick={() => isClickable && onWordClick(word)}
      className={`
        bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-center
        text-center font-semibold text-slate-200 shadow-md h-24 min-w-[10rem] max-w-xs
        transition-all duration-300 ease-out
        ${isSpinning ? 'text-slate-500 blur-[2px] opacity-80 scale-100' : ''}
        ${isSettled && generationKey > 0 ? 'scale-105 bg-slate-700/80 border-purple-400/50' : ''}
        ${isSettled && generationKey === 0 ? 'opacity-60' : ''}
        ${isClickable ? 'cursor-pointer hover:border-purple-400' : ''}
      `}
    >
      <span className="text-lg break-all">{displayWord}</span>
    </div>
  );
};