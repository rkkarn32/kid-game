import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { Congratulations } from './Congratulations';

interface ChallengeModeProps {
    current: number;
    min: number;
    max: number;
    showNumberLine?: boolean;
    onCorrect: () => void;
    onBack: () => void;
    onSkip: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
    current,
    min,
    max,
    showNumberLine = false,
    onCorrect,
    onBack,
    onSkip
}) => {
    const { speak } = useSpeech();
    const [beforeInput, setBeforeInput] = useState<number | null>(null);
    const [afterInput, setAfterInput] = useState<number | null>(null);
    const [options, setOptions] = useState<number[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Reset state when current number changes
        setBeforeInput(null);
        setAfterInput(null);
        setIsSuccess(false);

        // Generate options: correct answers + random distractors
        const answers = new Set<number>();
        if (current > min) answers.add(current - 1);
        if (current < max) answers.add(current + 1);

        while (answers.size < 4) {
            const r = Math.floor(Math.random() * (max - min + 1)) + min;
            if (r !== current) answers.add(r);
        }

        setOptions(Array.from(answers).sort(() => Math.random() - 0.5));

        let spokenText = `What comes before and after ${current}?`;
        if (current === min) spokenText = `What comes after ${current}?`;
        else if (current === max) spokenText = `What comes before ${current}?`;
        speak(spokenText);
    }, [current, min, max, speak]);

    const handleSelect = (num: number) => {
        if (beforeInput === null && current > min) {
            setBeforeInput(num);
            checkSuccess(num, afterInput);
        } else if (afterInput === null && current < max) {
            setAfterInput(num);
            checkSuccess(beforeInput, num);
        }
    };

    const checkSuccess = (b: number | null, a: number | null) => {
        const bCorrect = (current === min) || (b === current - 1);
        const aCorrect = (current === max) || (a === current + 1);

        const bFilled = (current === min) || (b !== null);
        const aFilled = (current === max) || (a !== null);

        if (bCorrect && aCorrect) {
            setIsSuccess(true);
            speak("Great job!");
            // No functional timeout here, waiting for user action on Congratulations screen
        } else if (bFilled && aFilled) {
            speak("Try again!");
            setTimeout(() => {
                setBeforeInput(null);
                setAfterInput(null);
            }, 1000);
        }
    };

    const getQuestionText = () => {
        if (current === min) return "What comes after?";
        if (current === max) return "What comes before?";
        return "What comes before and after?";
    };

    const handleNext = () => {
        setIsSuccess(false);
        onCorrect();
    };

    const handleReplay = () => {
        setIsSuccess(false);
        setBeforeInput(null);
        setAfterInput(null);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-fade-in p-4 relative min-h-[500px]">

            {/* Header / Back Button */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center mb-8 px-4">
                <button
                    onClick={onBack}
                    className="neo-btn px-4 py-2 bg-white text-black rounded-xl flex items-center gap-2 hover:bg-gray-100"
                >
                    <span>🏠</span> Back
                </button>
                <div className="bg-red-400 neo-border px-4 py-1 rounded-full text-sm font-bold text-white">
                    CHALLENGE
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-8 text-center bg-white p-2 neo-border rounded-lg shadow-md">
                {getQuestionText()}
            </h2>

            {/* Configurable Number Line */}
            {showNumberLine && (() => {
                let start = min;
                let end = max;

                if (max - min > 10) {
                    const tenBase = Math.floor(current / 10) * 10;

                    if (current === max && current % 10 === 0) {
                        // Edge case for highest bound being exactly divisible by 10 (e.g. 100)
                        start = max - 10;
                        end = max;
                    } else if (current === tenBase) {
                        // Current is perfectly on a 0 (like 20), take from middle of previous section to middle of current (15-25)
                        start = tenBase - 5;
                        end = tenBase + 5;
                    } else {
                        // Inside a 10s section (like 23), show 20 to 29
                        start = tenBase;
                        end = tenBase + 9;
                    }

                    // Strict boundary checks
                    if (start < min) {
                        start = min;
                        end = Math.min(max, start + 10);
                    }
                    if (end > max) {
                        end = max;
                        start = Math.max(min, end - 10);
                    }
                }

                return (
                    <div className="w-full max-w-2xl overflow-x-auto mb-8 bg-white p-4 rounded-xl neo-border scrollbar-hide">
                        <div className="flex gap-2 min-w-max px-2 items-end justify-start sm:justify-center">
                            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(num => (
                                <div
                                    key={num}
                                    className={`flex flex-col items-center justify-end min-w-[36px] transition-all
                                        ${num === current ? 'scale-125 -translate-y-2' : ''}`}
                                >
                                    <span className={`text-lg transition-colors ${num === current ? 'text-blue-600 font-black' : 'text-gray-500 font-bold'}`}>
                                        {num}
                                    </span>
                                    <div className={`w-full h-1 mt-2 rounded-t-sm transition-colors ${num === current ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                    <div className="w-0.5 h-2 bg-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Game Area */}
            <div className="flex items-center gap-4 mb-12">
                {/* Before Slot */}
                <div
                    onClick={() => { if (current > min) setBeforeInput(null); }}
                    className={`w-24 h-24 neo-card flex items-center justify-center text-4xl font-bold transition-colors ${current === min
                        ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                        : beforeInput === null
                            ? 'bg-gray-100 border-dashed cursor-pointer'
                            : 'bg-blue-200 cursor-pointer'
                        }`}
                >
                    {current === min ? '🚫' : (beforeInput ?? '?')}
                </div>

                {/* Current Number */}
                <div className="w-32 h-32 neo-card bg-yellow-300 flex items-center justify-center text-6xl font-black transform scale-110 z-10">
                    {current}
                </div>

                {/* After Slot */}
                <div
                    onClick={() => { if (current < max) setAfterInput(null); }}
                    className={`w-24 h-24 neo-card flex items-center justify-center text-4xl font-bold transition-colors ${current === max
                        ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                        : afterInput === null
                            ? 'bg-gray-100 border-dashed cursor-pointer'
                            : 'bg-green-200 cursor-pointer'
                        }`}
                >
                    {current === max ? '🚫' : (afterInput ?? '?')}
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-4 gap-4">
                {options.map((num) => (
                    <button
                        key={num}
                        onClick={() => handleSelect(num)}
                        className="neo-btn w-16 h-16 bg-white hover:bg-gray-50 text-2xl font-bold rounded-xl"
                        disabled={isSuccess}
                    >
                        {num}
                    </button>
                ))}
            </div>

            <div className="mt-8 flex gap-4">
                <button onClick={() => { setBeforeInput(null); setAfterInput(null); }} className="text-sm underline text-red-600 font-bold">Clear Limits</button>
                <button onClick={onSkip} className="text-sm underline text-gray-600 font-bold">Skip</button>
            </div>

            {/* Congratulations Dashboard */}
            <Congratulations
                visible={isSuccess}
                onNext={handleNext}
                onReplay={handleReplay}
            />

        </div>
    );
};
