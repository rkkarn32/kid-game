import React from 'react';

interface HomeBaseProps {
  onSelectMode: (mode: 'explore' | 'challenge') => void;
}

export const HomeBase: React.FC<HomeBaseProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl animate-fade-in p-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Explore Card */}
        <button
          onClick={() => onSelectMode('explore')}
          className="neo-card p-8 flex flex-col items-center justify-center gap-6 group hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[300px] bg-sky-100"
        >
          <div className="w-24 h-24 bg-white rounded-full neo-border flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🔍
          </div>
          <h2 className="text-4xl font-black text-black tracking-tight">EXPLORE</h2>
          <p className="text-xl font-medium text-black/70">Learn numbers at your own pace</p>
        </button>

        {/* Challenge Card */}
        <button
          onClick={() => onSelectMode('challenge')}
          className="neo-card p-8 flex flex-col items-center justify-center gap-6 group hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[300px] bg-red-100"
        >
          <div className="w-24 h-24 bg-white rounded-full neo-border flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🧩
          </div>
          <h2 className="text-4xl font-black text-black tracking-tight">CHALLENGE</h2>
          <p className="text-xl font-medium text-black/70">Test your knowledge!</p>
        </button>
      </div>

      <div className="mt-12 p-6 neo-card bg-yellow-100 w-full max-w-md text-center transform -rotate-2">
        <p className="text-lg font-bold">✨ Start your math journey today! 🚀</p>
      </div>
    </div>
  );
};
