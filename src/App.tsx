import { useState, useCallback } from 'react'
import { Settings } from './components/Settings'
import { HomeBase } from './components/HomeBase'
import { ExploreMode } from './components/ExploreMode'
import { ChallengeMode } from './components/ChallengeMode'

function App() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(10)
  const [current, setCurrent] = useState(1)
  const [mode, setMode] = useState<'home' | 'explore' | 'challenge'>('home')
  const [showSettings, setShowSettings] = useState(false)
  const [showNumberLine, setShowNumberLine] = useState(false)
  const [voiceOnly, setVoiceOnly] = useState(false)

  const random = useCallback(() => {
    let nextNum
    if (max === min) {
      nextNum = min
    } else {
      do {
        nextNum = Math.floor(Math.random() * (max - min + 1)) + min
      } while (nextNum === current)
    }
    setCurrent(nextNum)
  }, [min, max, current])

  const next = useCallback(() => setCurrent(c => Math.min(max, c + 1)), [max])
  const prev = useCallback(() => setCurrent(c => Math.max(min, c - 1)), [min])

  const handleQuizCorrect = () => {
    random()
  }

  const renderContent = () => {
    switch (mode) {
      case 'home':
        return <HomeBase onSelectMode={setMode} />
      case 'explore':
        return (
          <ExploreMode
            current={current}
            onNext={next}
            onPrev={prev}
            onRandom={random}
            disablePrev={current <= min}
            disableNext={current >= max}
            onBack={() => setMode('home')}
            voiceOnly={voiceOnly}
          />
        )
      case 'challenge':
        return (
          <ChallengeMode
            current={current}
            min={min}
            max={max}
            showNumberLine={showNumberLine}
            onCorrect={handleQuizCorrect}
            onBack={() => setMode('home')}
            onSkip={random}
          />
        )
      default:
        return <HomeBase onSelectMode={setMode} />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4 font-sans overflow-hidden">
      {/* Global Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 z-50">
        <h1
          className="text-3xl sm:text-4xl font-black text-black tracking-tight cursor-pointer"
          onClick={() => setMode('home')}
        >
          KidNum 123
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 neo-shadow"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-0">
        {renderContent()}
      </main>

      <Settings
        min={min}
        max={max}
        showNumberLine={showNumberLine}
        voiceOnly={voiceOnly}
        onUpdate={(newMin, newMax, newShowNumberLine, newVoiceOnly) => {
          setMin(newMin)
          setMax(newMax)
          if (newShowNumberLine !== undefined) setShowNumberLine(newShowNumberLine)
          if (newVoiceOnly !== undefined) setVoiceOnly(newVoiceOnly)
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
