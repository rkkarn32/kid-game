import React from 'react';

export const NumberDisplay: React.FC<{ number: number }> = ({ number }) => {
  return (
    <div className="flex items-center justify-center w-64 h-64 bg-white shadow-2xl rounded-3xl border-8 border-yellow-300 transform transition-transform duration-300 hover:scale-105">
      <span className="text-9xl font-black text-indigo-600 drop-shadow-md select-none">
        {number}
      </span>
    </div>
  );
};
