import React from 'react';

export const Settings: React.FC<{
  min: number;
  max: number;
  onUpdate: (min: number, max: number) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ min, max, onUpdate, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full transform transition-all scale-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Settings ⚙️</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Start From (Min)</label>
            <input 
              type="number" 
              value={min}
              onChange={(e) => onUpdate(Math.max(0, parseInt(e.target.value) || 0), max)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-2xl font-bold text-center bg-gray-50 text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Go Up To (Max)</label>
            <input 
              type="number" 
              value={max}
              onChange={(e) => onUpdate(min, Math.max(min + 1, parseInt(e.target.value) || 10))}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-2xl font-bold text-center bg-gray-50 text-gray-900"
            />
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all text-xl"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
