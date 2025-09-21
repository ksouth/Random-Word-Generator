
import React from 'react';
import { MinusIcon, PlusIcon } from './IconComponents';

interface NumberSelectorProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({ value, onChange, min = 1, max = 100 }) => {
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="p-2 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrement word count"
      >
        <MinusIcon />
      </button>
      <span className="text-xl font-bold w-12 text-center text-cyan-300 tabular-nums">
        {value}
      </span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="p-2 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increment word count"
      >
        <PlusIcon />
      </button>
    </div>
  );
};
