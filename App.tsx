import React, { useState, useCallback } from 'react';
import { generateWords, WordType } from './services/wordGenerator';
import { WordCard } from './components/WordCard';
import { SparkleIcon } from './components/IconComponents';
import { DefinitionDisplay } from './components/DefinitionModal';
import type { DefinitionResponse } from './components/DefinitionModal';

const App: React.FC = () => {
  const [wordCount, setWordCount] = useState<number>(1);
  const [wordType, setWordType] = useState<WordType>('any');
  const [wordsForSlots, setWordsForSlots] = useState<string[]>(Array(1).fill('❓❓❓'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationKey, setGenerationKey] = useState<number>(0);

  // Definition state
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<DefinitionResponse | null>(null);
  const [isDefLoading, setIsDefLoading] = useState<boolean>(false);
  const [defError, setDefError] = useState<string | null>(null);

  const wordCountOptions = [1, 2, 3, 4, 5];
  const wordTypeOptions: { id: WordType; label: string }[] = [
    { id: 'any', label: 'Any' },
    { id: 'noun', label: 'Noun' },
    { id: 'verb', label: 'Verb' },
    { id: 'adjective', label: 'Adjective' },
    { id: 'adverb', label: 'Adverb' },
  ];

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
    setWordsForSlots(Array(count).fill('❓❓❓'));
    setGenerationKey(0); // Reset generation state
    setSelectedWord(null); // Close definition view when count changes
  };

  const handleGenerate = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    setSelectedWord(null); // Close definition view on new generation
    // This resets the cards to their "ready to spin" state if they already have words
    setWordsForSlots(Array(wordCount).fill(''));

    setTimeout(() => {
      const newWords = generateWords(wordCount, wordType);
      setGenerationKey(prevKey => prevKey + 1); // This triggers the animation in children
      setWordsForSlots(newWords);
      setIsLoading(false);
    }, 100); // Short delay to allow UI to reset before animating
  }, [isLoading, wordCount, wordType]);

  const handleWordClick = useCallback(async (word: string) => {
    if (!word || word === '\u00A0' || word.includes('❓')) return;

    // If clicking the same word, close the definition view (toggle)
    if (word === selectedWord) {
        setSelectedWord(null);
        return;
    }

    setSelectedWord(word);
    setIsDefLoading(true);
    setDefError(null);
    setDefinition(null);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Could not find a definition for this word.');
      }
      const data: DefinitionResponse = await response.json();
      setDefinition(data);
    } catch (err) {
      setDefError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsDefLoading(false);
    }
  }, [selectedWord]);

  const handleCloseDefinition = () => {
    setSelectedWord(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col items-center justify-start p-4 sm:p-8 pt-16 sm:pt-24">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-2">
          Word Wizard
        </h1>
        <p className="text-slate-400 text-lg">Summon words from the ether!</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8 w-full max-w-2xl flex flex-col items-center justify-center gap-6 shadow-2xl shadow-purple-900/20">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full">
            <div className="flex flex-col items-center sm:items-start">
              <label className="text-slate-300 font-semibold mb-3">How many words?</label>
              <div className="flex items-center gap-3">
                {wordCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => handleWordCountChange(count)}
                    className={`h-12 w-12 rounded-lg font-bold transition-all duration-200 flex items-center justify-center text-lg ${
                      wordCount === count
                        ? 'bg-purple-600 text-white shadow-lg scale-110'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    aria-pressed={wordCount === count}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:h-12 border-b-2 sm:border-b-0 sm:border-l-2 border-slate-700 w-full sm:w-auto"></div>
             <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    Summoning...
                  </>
                ) : (
                  <>
                    <SparkleIcon />
                    Generate
                  </>
                )}
              </button>
          </div>
          <div className="w-full border-t-2 border-slate-700 my-2"></div>
          <div className="flex flex-col items-center w-full">
             <label className="text-slate-300 font-semibold mb-3">What type of word?</label>
             <div className="flex flex-wrap items-center justify-center gap-3">
                {wordTypeOptions.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setWordType(id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                      wordType === id
                        ? 'bg-cyan-500 text-slate-900 shadow-lg scale-105'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                    aria-pressed={wordType === id}
                  >
                    {label}
                  </button>
                ))}
              </div>
          </div>
        </div>

        <div className="w-full p-4 pt-10 relative flex justify-center">
            <div className="flex flex-wrap justify-center gap-4">
            {wordsForSlots.map((word, index) => (
                <WordCard
                    key={index}
                    word={word}
                    index={index}
                    generationKey={generationKey}
                    onWordClick={handleWordClick}
                />
            ))}
            </div>
        </div>

        {selectedWord && (
            <div className="w-full max-w-4xl px-4 pb-12">
                <DefinitionDisplay
                    word={selectedWord}
                    definition={definition}
                    isLoading={isDefLoading}
                    error={defError}
                    onClose={handleCloseDefinition}
                />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;