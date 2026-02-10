import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeech } from '../hooks/useSpeech';

export const Quiz: React.FC<{ 
  targetNumber: number; 
  onCorrect: () => void;
}> = ({ targetNumber, onCorrect }) => {
  const [prev, setPrev] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState(false);
  const { isListening, transcript, startListening, error: speechError } = useSpeechRecognition();
  const { speak } = useSpeech();

  useEffect(() => {
    setPrev('');
    setNext('');
    setError(false);
    speak('What comes before and after ' + targetNumber + '?');
  }, [targetNumber, speak]);

  useEffect(() => {
    if (transcript) {
      console.log('Transcript received:', transcript);
      const numbers = (transcript.match(/\d+/g) || []).map(Number);
      
      const wordMap: {[key: string]: number} = {
          'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
          'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
          'eleven': 11, 'twelve': 12
      };
      
      const words = transcript.toLowerCase().split(/\s+/);
      
      words.forEach(w => {
          const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_'~()]/g,'');
          if (wordMap[cleanWord] !== undefined && !numbers.includes(wordMap[cleanWord])) {
              numbers.push(wordMap[cleanWord]);
          }
      });
      
      if (numbers.length >= 2) {
        const p = numbers[0];
        const n = numbers[1];
        setPrev(p.toString());
        setNext(n.toString());
        
        if (p === targetNumber - 1 && n === targetNumber + 1) {
             onCorrect();
        } else {
             setError(true);
             speak('Those are not the right numbers. Try again!');
        }
      } else if (numbers.length === 1) {
        const num = numbers[0];
        if (num === targetNumber - 1) setPrev(num.toString());
        if (num === targetNumber + 1) setNext(num.toString());
      }
    }
  }, [transcript, targetNumber, onCorrect, speak]);

  const checkManual = () => {
    const p = parseInt(prev);
    const n = parseInt(next);
    
    if (!isNaN(p) && !isNaN(n) && p === targetNumber - 1 && n === targetNumber + 1) {
      onCorrect();
    } else {
      setError(true);
      speak('Oops, that is not correct.');
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 space-y-6 w-full max-w-md px-4">
      <p className="text-xl text-white font-medium bg-white/20 px-4 py-2 rounded-lg text-center shadow-sm">
        What comes before and after?
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full">
        <div className="flex flex-col items-center">
          <span className="text-white/80 font-bold mb-2 uppercase text-sm tracking-wider">Before</span>
          <input 
            type="number" 
            value={prev}
            onChange={(e) => {
              setPrev(e.target.value);
              setError(false);
            }}
            className={`w-32 h-32 sm:w-40 sm:h-40 text-center rounded-3xl border-4 ${error ? 'border-red-400 bg-red-50 animate-shake' : 'border-white/50 bg-white/90'} text-indigo-900 font-black focus:outline-none focus:border-yellow-400 shadow-xl text-5xl sm:text-6xl placeholder-indigo-200 transition-all`}
            placeholder="?"
          />
        </div>
        
        <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-sm rounded-full shadow-inner border-4 border-white/30 my-4 sm:my-0">
             <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-md select-none">{targetNumber}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-white/80 font-bold mb-2 uppercase text-sm tracking-wider">After</span>
          <input 
            type="number" 
            value={next}
            onChange={(e) => {
              setNext(e.target.value);
              setError(false);
            }}
            className={`w-32 h-32 sm:w-40 sm:h-40 text-center rounded-3xl border-4 ${error ? 'border-red-400 bg-red-50 animate-shake' : 'border-white/50 bg-white/90'} text-indigo-900 font-black focus:outline-none focus:border-yellow-400 shadow-xl text-5xl sm:text-6xl placeholder-indigo-200 transition-all`}
            placeholder="?"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
        <button 
            onClick={startListening}
            className={`px-6 py-4 rounded-xl shadow-lg font-bold text-white text-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-300' : 'bg-indigo-500 hover:bg-indigo-600 active:translate-y-1'}`}
            title="Speak Answer"
        >
            <span className="text-2xl">{isListening ? '👂' : '🎤'}</span>
            {isListening ? 'Listening...' : 'Speak Answer'}
        </button>

        <button 
            onClick={checkManual}
            className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl shadow-[0_4px_0_rgb(161,98,7)] active:shadow-none active:translate-y-1 transform transition-all text-lg w-full sm:w-auto"
        >
            Check! ✨
        </button>
      </div>

      {speechError && (
          <div className="text-red-100 bg-red-900/40 px-3 py-2 rounded-lg text-sm border border-red-400/30">
              Microphone error: {speechError}. Try typing instead!
          </div>
      )}
      
      {transcript && !error && (
          <div className="text-white/80 text-sm bg-black/20 px-3 py-1 rounded-full text-center">
              Heard: "{transcript}"
          </div>
      )}
    </div>
  );
};
