import React, { useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface ExploreModeProps {
    current: number;
    onPrev: () => void;
    onNext: () => void;
    onRandom: () => void;
    disablePrev: boolean;
    onBack: () => void;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({
    current,
    onPrev,
    onNext,
    onRandom,
    disablePrev,
    onBack
}) => {
    const { speak } = useSpeech();

    // Re-speak when number changes
    useEffect(() => {
        speak(current.toString());
    }, [current, speak]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-fade-in p-4 relative">

            {/* Header / Back Button */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center mb-8 px-4">
                <button
                    onClick={onBack}
                    className="neo-btn px-4 py-2 bg-white text-black rounded-xl flex items-center gap-2 hover:bg-gray-100"
                >
                    <span>🏠</span> Back
                </button>
                <div className="bg-yellow-300 neo-border px-4 py-1 rounded-full text-sm font-bold">
                    EXPLORE MODE
                </div>
            </div>

            {/* Main Number Card */}
            <div className="mt-20 flex flex-col items-center gap-8">
                <div className="neo-card w-72 h-72 flex items-center justify-center bg-white relative group">
                    {/* Speaker Button inside card */}
                    <button
                        onClick={() => speak(current.toString())}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Speak"
                    >
                        🔊
                    </button>

                    <span className="text-[10rem] font-black text-black leading-none group-hover:scale-110 transition-transform duration-300">
                        {current}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 mt-4">
                    <button
                        onClick={onPrev}
                        disabled={disablePrev}
                        className="neo-btn w-16 h-16 bg-red-400 text-black rounded-2xl flex items-center justify-center text-3xl disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                    >
                        ←
                    </button>

                    <button
                        onClick={onRandom}
                        className="neo-btn w-20 h-20 bg-purple-400 text-black rounded-full flex items-center justify-center text-4xl hover:rotate-12 transition-transform"
                        title="Random"
                    >
                        🎲
                    </button>

                    <button
                        onClick={onNext}
                        className="neo-btn w-16 h-16 bg-green-400 text-black rounded-2xl flex items-center justify-center text-3xl"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};
