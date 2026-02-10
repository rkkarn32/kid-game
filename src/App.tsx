import { useState, useEffect } from 'react'
import { NumberDisplay } from './components/NumberDisplay'
import { Controls } from './components/Controls'
import { useSpeech } from './hooks/useSpeech'
import { Quiz } from './components/Quiz'
import { Settings } from './components/Settings'

function App() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(10)
  const [current, setCurrent] = useState(1)
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore')
  const [showSettings, setShowSettings] = useState(false)
  const { speak } = useSpeech()

  useEffect(() => {
    if (mode === 'explore') {
      speak(current.toString())
    } else {
        // In challenge mode, maybe ask the question?
        // speak("What comes before and after " + current)
    }
  }, [current, mode, speak])

  const next = () => setCurrent(c => Math.min(max, c + 1))
  const prev = () => setCurrent(c => Math.max(min, c - 1))
  
  const random = () => {
    let nextNum
    if (max === min) {
      nextNum = min
    } else {
      do {
        nextNum = Math.floor(Math.random() * (max - min + 1)) + min
      } while (nextNum === current)
    }
    setCurrent(nextNum)
  }

  const handleQuizCorrect = () => {
    speak("Correct! Great job!")
    setTimeout(random, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex flex-col items-center py-8 px-4 font-sans overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md tracking-tight">KidNum 123</h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 bg-white/20 rounded-xl hover:bg-white/30 text-white transition-all shadow-lg active:scale-95"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="bg-black/10 p-1.5 rounded-2xl flex gap-1 mb-8 shadow-inner">
        <button
          onClick={() => setMode('explore')}
          className={`px-4 sm:px-8 py-2.5 rounded-xl font-bold text-lg transition-all ${mode === 'explore' ? 'bg-white text-blue-600 shadow-md transform scale-105' : 'text-white/80 hover:bg-white/10'}`}
        >
          Explore
        </button>
        <button
          onClick={() => {
            setMode('challenge')
            random()
          }}
          className={`px-4 sm:px-8 py-2.5 rounded-xl font-bold text-lg transition-all ${mode === 'challenge' ? 'bg-white text-purple-600 shadow-md transform scale-105' : 'text-white/80 hover:bg-white/10'}`}
        >
          Challenge 🎲
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start sm:justify-center w-full max-w-2xl mt-4 sm:mt-0">
        
        {mode === 'explore' ? (
          <div className="flex flex-col items-center animate-fade-in">
            <NumberDisplay number={current} />
            <Controls 
              onPrev={prev} 
              onNext={next} 
              onRandom={random}
              disablePrev={current <= min}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in w-full">
             <div className="mb-8">
                <NumberDisplay number={current} />
             </div>
            <Quiz 
              targetNumber={current} 
              onCorrect={handleQuizCorrect} 
            />
            <button 
              onClick={random}
              className="mt-12 text-white/70 hover:text-white font-medium underline text-lg"
            >
              Skip this number
            </button>
          </div>
        )}

      </main>

      <Settings 
        min={min} 
        max={max} 
        onUpdate={(newMin, newMax) => {
          setMin(newMin)
          setMax(newMax)
          if (current < newMin) setCurrent(newMin)
          if (current > newMax) setCurrent(newMax)
        }}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}

export default App
