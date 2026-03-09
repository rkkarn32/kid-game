import React, { useState, useRef, useEffect } from 'react';
import { SLIDER_MIN, SLIDER_MAX } from '../util/constants';

export const Settings: React.FC<{
  min: number;
  max: number;
  showNumberLine?: boolean;
  voiceOnly?: boolean;
  onUpdate: (min: number, max: number, showNumberLine?: boolean, voiceOnly?: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ min, max, showNumberLine = false, voiceOnly = false, onUpdate, isOpen, onClose }) => {
  /* Local state for buffering changes */
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);
  const [localShowNumberLine, setLocalShowNumberLine] = useState(showNumberLine);
  const [localVoiceOnly, setLocalVoiceOnly] = useState(voiceOnly);

  /* Reset local state when opening */
  useEffect(() => {
    if (isOpen) {
      setLocalMin(min);
      setLocalMax(max);
      setLocalShowNumberLine(showNumberLine);
      setLocalVoiceOnly(voiceOnly);
    }
  }, [isOpen, min, max, showNumberLine, voiceOnly]);

  const [contentType, setContentType] = useState<'numbers' | 'letters' | 'both'>('numbers');
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const getPercentage = (value: number) => {
    return ((value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  };

  const handleMouseDown = (type: 'min' | 'max') => {
    setIsDragging(type);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

      // Calculate percentage based on click position
      let percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));

      const rawValue = Math.round(percentage * (SLIDER_MAX - SLIDER_MIN) + SLIDER_MIN);

      if (isDragging === 'min') {
        // Min is fixed per previous request
      } else {
        const newMax = Math.max(rawValue, localMin + 1);
        setLocalMax(Math.min(SLIDER_MAX, newMax));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, localMin, localMax]);

  if (!isOpen) return null;

  const minPos = getPercentage(localMin);
  const maxPos = getPercentage(localMax);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4 font-sans">
      <div className="bg-[#f5f5f5] border-[3px] border-black rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-[3px] border-black bg-white">
          <h2 className="text-2xl font-black text-black tracking-tight">Game Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8 bg-[#f5f5f5]">

          {/* Content Type Selector */}
          <div>
            <h3 className="text-lg font-black mb-4 text-black">Content Type</h3>
            <div className="flex gap-4">
              {[
                { id: 'numbers', label: '123', sub: 'Numbers' },
                { id: 'letters', label: 'ABC', sub: 'Letters' },
                { id: 'both', label: 'All', sub: 'Both' }
              ].map((type) => (
                <div key={type.id} className="flex-1 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setContentType(type.id as any)}>
                  <div className={`w-full h-14 rounded-xl border-[3px] border-black flex items-center justify-center text-lg font-bold transition-all ${contentType === type.id
                    ? 'bg-[#1E2D43] text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                    }`}>
                    {type.label}
                  </div>
                  <span className={`text-xs font-bold ${contentType === type.id ? 'text-[#1E2D43]' : 'text-gray-500'}`}>
                    {type.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Number Range */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-black text-black">Number Range</h3>
              <span className="text-lg font-black text-[#1E2D43]">{localMin} — {localMax}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Min Input */}
              <div className="flex flex-col gap-1 w-20">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Min</label>
                <input
                  type="number"
                  value={localMin}
                  readOnly // Fixed min
                  className="w-full h-12 border-[3px] border-black rounded-lg text-center font-bold text-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Slider Track */}
              <div className="flex-1 relative h-12 flex items-center group cursor-pointer" ref={sliderRef}>
                {/* Background Track */}
                <div className="w-full h-2 bg-gray-300 rounded-full relative">
                  {/* Active Range */}
                  <div
                    className="absolute top-0 h-full bg-[#1E2D43] rounded-full"
                    style={{
                      left: `${minPos}%`,
                      width: `${maxPos - minPos}%`
                    }}
                  ></div>

                  {/* Min Thumb */}
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-[3px] border-black rounded-full shadow-sm z-10"
                    style={{ left: `${minPos}%` }}
                  ></div>

                  {/* Max Thumb */}
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#1E2D43] border-[3px] border-black rounded-full cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-sm z-10"
                    style={{ left: `${maxPos}%` }}
                    onMouseDown={() => handleMouseDown('max')}
                    onTouchStart={() => handleMouseDown('max')}
                  ></div>
                </div>
              </div>

              {/* Max Input */}
              <div className="flex flex-col gap-1 w-20">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Max</label>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(Math.min(SLIDER_MAX, Math.max(localMin + 1, parseInt(e.target.value) || 10)))}
                  className="w-full h-12 border-[3px] border-black rounded-lg text-center font-bold text-xl bg-white text-black"
                />
              </div>
            </div>
          </div>

          {/* Number Line Toggle */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border-[3px] border-black">
            <div>
              <h3 className="text-lg font-black text-black">Number Line Help</h3>
              <p className="text-xs text-gray-500 font-bold">Show number line in Challenge Mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localShowNumberLine}
                onChange={(e) => setLocalShowNumberLine(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[24px] after:w-[24px] after:transition-all peer-checked:bg-[#1E2D43] border-[3px] border-black"></div>
            </label>
          </div>

          {/* Voice Only Toggle */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border-[3px] border-black">
            <div>
              <h3 className="text-lg font-black text-black">Voice Only</h3>
              <p className="text-xs text-gray-500 font-bold">Read numbers to move forward</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localVoiceOnly}
                onChange={(e) => setLocalVoiceOnly(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[24px] after:w-[24px] after:transition-all peer-checked:bg-[#1E2D43] border-[3px] border-black"></div>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-[#f5f5f5] border-t-[3px] border-black/10 flex justify-end gap-4 items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 font-bold text-black hover:bg-black/5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onUpdate(localMin, localMax, localShowNumberLine, localVoiceOnly);
              onClose();
            }}
            className="px-8 py-3 bg-[#1E2D43] text-white font-bold rounded-xl border-[3px] border-[#1E2D43] hover:bg-[#2a3b55] active:scale-95 transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
