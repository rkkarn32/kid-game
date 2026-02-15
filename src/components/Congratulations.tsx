import React, { useEffect, useState } from 'react';

interface CongratulationsProps {
    onNext: () => void;
    onReplay: () => void;
    visible: boolean;
}

export const Congratulations: React.FC<CongratulationsProps> = ({ onNext, onReplay, visible }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!show && !visible) return null;

    return (
        <div
            className={`absolute inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#f0f0f0] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Main Card */}
            <div
                className={`relative bg-white border-2 border-black rounded-[32px] p-8 sm:p-12 w-full max-w-sm flex flex-col items-center gap-8 shadow-xl transform transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
                    }`}
            >
                {/* Graphic */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-12 h-12 bg-[#FDE68A] rounded-full -translate-x-2 -translate-y-2"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-gray-300 rounded-lg rotate-12 translate-x-1 translate-y-1"></div>

                    {/* Main Icon */}
                    <div className="relative w-24 h-24 bg-[#0F766E] rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-black">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-black text-black tracking-tight text-center">
                    Great Job!
                </h2>

                {/* Actions */}
                <div className="w-full flex flex-col gap-4">
                    <button
                        onClick={onNext}
                        className="w-full bg-[#1E2D43] text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#2a3b55] active:scale-95 transition-all shadow-lg"
                    >
                        Next Number
                        <span className="text-xl">→</span>
                    </button>

                    <button
                        onClick={onReplay}
                        className="flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-black transition-colors py-2"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                            <path d="M16 16h5v5"></path>
                        </svg>
                        Replay
                    </button>
                </div>

            </div>
        </div>
    );
};
