import { useState } from 'react'
import { Play, Pause, RotateCcw, Settings, Coffee, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useApp } from '../context/AppContext'
import { useTimer } from '../context/TimerContext'
import TimerSettings from '../components/TimerSettings'
import MusicPlayer from '../components/MusicPlayer'
import GlassPanel from '../components/GlassPanel'
import TaskPanel from '../components/TaskPanel'

const Timer = () => {
  const { timerSettings } = useApp()
  const {
    mode, timeLeft, isRunning, isCompleted, progress,
    toggleStartPause, reset, formatTime,
    presets, activePresetId, switchPreset,
  } = useTimer()

  const [showSettings, setShowSettings] = useState(false)

  const radius = 140
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-28 relative z-10">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => setShowSettings(true)}
            className="glass-button p-3 text-white/70 hover:text-white"
          >
            <Settings size={18} />
          </button>

          <div className={`glass-button px-5 py-2.5 flex items-center gap-2 ${
            mode === 'focus' ? 'text-accent-pink' : 'text-accent-green'
          }`}>
            {mode === 'focus' ? <Zap size={16} /> : <Coffee size={16} />}
            <span className="text-sm font-medium">
              {mode === 'focus' ? 'Focus Session' : 'Break Time'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MusicPlayer />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => switchPreset(preset.id)}
              disabled={isRunning}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all
                ${activePresetId === preset.id
                  ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30'
                  : 'glass-button text-white/50 hover:text-white/80'
                }
                ${isRunning ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="block">{preset.label}</span>
              <span className="block text-[10px] opacity-60 mt-0.5">
                {preset.focusMin}/{preset.breakMin}m
              </span>
            </button>
          ))}
        </motion.div>

        <GlassPanel strong className="flex flex-col items-center py-12 glow-pink">
          <div className="relative mb-8">
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              className="timer-ring transform -rotate-90"
            >
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="6"
              />
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke={mode === 'focus' ? '#f472b6' : '#34d399'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              {progress > 0 && (
                <circle
                  cx="160"
                  cy="160"
                  r={radius}
                  fill="none"
                  stroke={mode === 'focus' ? '#f472b6' : '#34d399'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  opacity="0.2"
                  filter="blur(8px)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-6xl font-light tracking-wider font-display transition-colors ${
                isCompleted ? 'text-accent-gold' : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>

              <AnimatePresence>
                {isCompleted && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-accent-gold text-sm mt-3 font-medium"
                  >
                    {mode === 'focus'
                      ? `+${timerSettings.coinsPerSession} Flow Coins ✨`
                      : 'Ready to focus? 🎯'
                    }
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="glass-button p-4 text-white/60 hover:text-white"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={toggleStartPause}
              className={`px-10 py-4 rounded-2xl font-semibold text-white transition-all
                active:scale-[0.97] ${
                isRunning
                  ? 'bg-white/10 hover:bg-white/15 border border-white/20'
                  : 'bg-linear-to-r from-accent-pink to-accent-purple hover:opacity-90 shadow-lg shadow-accent-pink/20'
              }`}
            >
              <span className="flex items-center gap-2">
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Start'}
              </span>
            </button>
          </div>
        </GlassPanel>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-white/30 text-xs">
            {presets.find(p => p.id === activePresetId)?.focusMin} min focus ·{' '}
            {presets.find(p => p.id === activePresetId)?.breakMin} min break
            {timerSettings.autoStartBreak ? ' · Auto-break' : ''}
          </p>
        </motion.div>
      </div>

      <TaskPanel />

      <TimerSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default Timer
