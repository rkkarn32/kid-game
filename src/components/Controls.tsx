import React from 'react';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
  disablePrev: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onPrev, onNext, onRandom, disablePrev }) => {
  return (
    <div className="flex gap-6 mt-12 items-center justify-center">
      <button 
        onClick={onPrev} 
        disabled={disablePrev}
        className="w-24 h-24 flex items-center justify-center bg-red-500 text-white rounded-full shadow-[0_8px_0_rgb(185,28,28)] active:shadow-none active:translate-y-2 hover:bg-red-600 transition-all text-5xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-2"
        aria-label="Previous Number"
      >
        ←
      </button>
      
      <button 
        onClick={onRandom}
        className="w-20 h-20 flex items-center justify-center bg-purple-500 text-white rounded-2xl shadow-[0_6px_0_rgb(126,34,206)] active:shadow-none active:translate-y-1.5 hover:bg-purple-600 transition-all text-4xl"
        aria-label="Random Number"
        title="Random Number"
      >
        🎲
      </button>

      <button 
        onClick={onNext}
        className="w-24 h-24 flex items-center justify-center bg-green-500 text-white rounded-full shadow-[0_8px_0_rgb(21,128,61)] active:shadow-none active:translate-y-2 hover:bg-green-600 transition-all text-5xl font-bold"
        aria-label="Next Number"
      >
        →
      </button>
    </div>
  );
};
