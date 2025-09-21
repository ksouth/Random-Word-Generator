import React from 'react';
import { CloseIcon } from './IconComponents';

// Types for the Dictionary API response
export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Definition {
  definition: string;
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export type DefinitionResponse = {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}[];


interface DefinitionDisplayProps {
  word: string;
  definition: DefinitionResponse | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ word, definition, isLoading, error, onClose }) => {
  const firstEntry = definition?.[0];
  const phoneticText = firstEntry?.phonetics.find(p => p.text)?.text;

  // Using a key on the outer div in App.tsx will force re-mount and re-animate on word change
  return (
    <div aria-live="polite" className="w-full max-w-4xl animate-fade-in-up">
      <div
        className="relative w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8 text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close definition"
        >
          <CloseIcon />
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48">
             <div className="w-8 h-8 border-4 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
             <p className="mt-4 text-slate-300">Looking up "{word}"...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <h2 id="definition-heading" className="text-2xl font-bold text-yellow-400 mb-2">Definition Not Found</h2>
            <p className="text-slate-300 mb-4">{error}</p>
            <p className="text-slate-400">You can try looking it up elsewhere:</p>
            <div className="flex gap-4 mt-2">
                <a 
                    href={`https://www.google.com/search?q=define+${word}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                    Google
                </a>
                <a 
                    href={`https://en.wiktionary.org/wiki/${word}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                    Wiktionary
                </a>
            </div>
          </div>
        ) : firstEntry ? (
          <div className="max-h-[60vh] overflow-y-auto pr-4 -mr-2">
            <h2 id="definition-heading" className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-1">
              {firstEntry.word}
            </h2>
            {phoneticText && <p className="text-slate-400 mb-4">{phoneticText}</p>}
            
            <div className="space-y-4">
              {firstEntry.meanings.map((meaning, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2 capitalize italic">{meaning.partOfSpeech}</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {meaning.definitions.map((def, i) => (
                      <li key={i}>
                        {def.definition}
                        {def.example && <p className="text-sm text-slate-400/80 italic pl-4 mt-1">e.g., "{def.example}"</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="h-48"></div> /* Placeholder for layout consistency */}
      </div>
       <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        `}</style>
    </div>
  );
};
