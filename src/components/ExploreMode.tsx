import React, { useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ExploreModeProps {
    current: number;
    onPrev: () => void;
    onNext: () => void;
    onRandom: () => void;
    disablePrev: boolean;
    disableNext: boolean;
    onBack: () => void;
    voiceOnly?: boolean;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({
    current,
    onPrev,
    onNext,
    onRandom,
    disablePrev,
    disableNext,
    onBack,
    voiceOnly = false
}) => {
    const { speak } = useSpeech();
    const { startListening, transcript, isListening } = useSpeechRecognition();
    const lastProcessedTranscript = useRef<string | null>(null);

    // Re-speak when number changes
    useEffect(() => {
        if (voiceOnly) {
            speak("What number is this?", () => {
                startListening();
            });
        } else {
            speak(current.toString());
        }
    }, [current, speak, voiceOnly, startListening]);

    // Handle transcript changes
    useEffect(() => {
        if (!voiceOnly || !transcript) {
            lastProcessedTranscript.current = transcript || null;
            return;
        }

        if (transcript === lastProcessedTranscript.current) {
            return;
        }
        lastProcessedTranscript.current = transcript;

        const normalizedTranscript = transcript.toLowerCase().trim();
        const normalizedCurrent = current.toString();

        // Simple match or word match for numbers 1-10
        const numberWords: Record<string, string> = {
            '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
            '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten'
        };

        const isMatch = normalizedTranscript === normalizedCurrent ||
            normalizedTranscript === numberWords[normalizedCurrent];

        if (isMatch) {
            speak("Congratulations, you did it", () => {
                if (!disableNext) {
                    onNext();
                } else {
                    onRandom(); // If at max, go to random or just stay? user said move to next.
                }
            });
        } else {
            speak("Sorry this didn't match, can you try again?", () => {
                startListening();
            });
        }
    }, [transcript, current, voiceOnly, speak, onNext, onRandom, disableNext, startListening]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                if (!disablePrev) {
                    onPrev();
                }
            } else if (e.key === 'ArrowRight' && !disableNext) {
                onNext();
            }
        };

        globalThis.addEventListener('keydown', handleKeyDown);
        return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }, [onPrev, onNext, disablePrev]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-fade-in p-4 relative ">

            {/* Header / Back Button */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center mb-8 px-4">
                <button
                    onClick={onBack}
                    className="neo-btn px-4 py-2 bg-white text-black rounded-xl flex items-center gap-2 hover:bg-gray-100"
                >
                    <span>🏠</span> Back
                </button>
                <div className="bg-yellow-300 neo-border px-4 py-1 rounded-full text-sm font-bold uppercase">
                    Explore Mode {voiceOnly && '• Voice On'}
                </div>
            </div>

            {/* Main Number Card */}
            <div className="mt-20 flex flex-col items-center gap-8">
                <div className="neo-card w-72 h-72 flex items-center justify-center bg-white relative group">
                    {/* Listening Indicator */}
                    {voiceOnly && isListening && (
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full animate-pulse flex items-center justify-center border-4 border-white shadow-lg z-20">
                            <span className="text-white text-xl">🎤</span>
                        </div>
                    )}

                    {/* Speaker Button inside card */}
                    <button
                        onClick={() => speak(current.toString())}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors z-10"
                        title="Speak"
                    >
                        🔊
                    </button>

                    <span className="text-[10rem] font-black text-black leading-none group-hover:scale-110 transition-transform duration-300">
                        {current}
                    </span>
                </div>

                {/* Voice Status Text */}
                <div className="text-center h-8 flex items-center justify-center">
                    {voiceOnly ? (
                        isListening ? (
                            <p className="text-blue-600 font-bold animate-bounce">I'm listening...</p>
                        ) : transcript ? (
                            <p className="text-gray-500 font-medium italic">"{transcript}"</p>
                        ) : (
                            <p className="text-gray-400 font-medium">Wait for my question...</p>
                        )
                    ) : null}
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
                        disabled={disableNext}
                        className="neo-btn w-16 h-16 bg-green-400 text-black rounded-2xl flex items-center justify-center text-3xl disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};
