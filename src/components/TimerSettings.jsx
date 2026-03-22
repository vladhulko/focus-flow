import { Settings, X, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useApp } from '../context/AppContext'
import { useTimer } from '../context/TimerContext'

const GlassNumberInput = ({ value, onChange, min = 1, max = 120, disabled = false }) => {
  const decrement = () => {
    if (!disabled && value > min) onChange(value - 1)
  }
  const increment = () => {
    if (!disabled && value < max) onChange(value + 1)
  }

  return (
    <div className={`flex items-center gap-1 ${disabled ? 'opacity-40' : ''}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="glass-button w-9 h-9 flex items-center justify-center text-white/70 hover:text-white
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={14} />
      </button>
      <div className="w-12 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl
                      text-white text-sm font-medium tabular-nums">
        {value}
      </div>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        className="glass-button w-9 h-9 flex items-center justify-center text-white/70 hover:text-white
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

const TimerSettings = ({ isOpen, onClose }) => {
  const { timerSettings, setTimerSettings } = useApp()
  const { presets, updatePreset, isRunning } = useTimer()

  const [localSettings, setLocalSettings] = useState(timerSettings)
  const [localPresets, setLocalPresets] = useState(presets)

  const handleOpen = () => {
    setLocalSettings(timerSettings)
    setLocalPresets(presets)
  }

  const handleSave = () => {
    setTimerSettings(localSettings)
    localPresets.forEach(p => {
      if (p.editable) {
        updatePreset(p.id, { focusMin: p.focusMin, breakMin: p.breakMin })
      }
    })
    onClose()
  }

  const updateLocalPreset = (id, field, value) => {
    setLocalPresets(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: Math.max(1, value) } : p
    ))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationStart={handleOpen}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
            className="glass-strong p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                <Settings size={20} className="text-accent-purple" />
                Settings
              </h2>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Timer Presets</h3>
              <div className="space-y-3">
                {localPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-4 rounded-xl border transition-all ${
                      preset.editable
                        ? 'bg-white/5 border-white/10'
                        : 'bg-white/3 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white text-sm font-medium">{preset.label}</span>
                      {!preset.editable && (
                        <span className="text-white/30 text-[10px] uppercase tracking-wider">Fixed</span>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <label className="text-white/40 text-[10px] block mb-1.5">Focus (min)</label>
                        <GlassNumberInput
                          value={preset.focusMin}
                          onChange={(v) => updateLocalPreset(preset.id, 'focusMin', v)}
                          min={1}
                          max={120}
                          disabled={!preset.editable || isRunning}
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-[10px] block mb-1.5">Break (min)</label>
                        <GlassNumberInput
                          value={preset.breakMin}
                          onChange={(v) => updateLocalPreset(preset.id, 'breakMin', v)}
                          min={1}
                          max={30}
                          disabled={!preset.editable || isRunning}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-white/60 text-xs uppercase tracking-wider">Behavior</h3>

              <div className="flex items-center justify-between">
                <label className="text-white/70 text-sm font-medium">Auto-start break</label>
                <button
                  onClick={() => setLocalSettings({ ...localSettings, autoStartBreak: !localSettings.autoStartBreak })}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 border
                    ${localSettings.autoStartBreak ? 'bg-accent-pink/80 border-accent-pink' : 'bg-white/10 border-white/20'}`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md
                      ${localSettings.autoStartBreak ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div>
                <label className="text-white/70 text-sm block mb-2 font-medium">
                  Flow Coins per focus session
                </label>
                <GlassNumberInput
                  value={localSettings.coinsPerSession}
                  onChange={(v) => setLocalSettings({ ...localSettings, coinsPerSession: v })}
                  min={1}
                  max={10}
                />
                <p className="text-white/30 text-[10px] mt-2">Coins are only awarded for focus sessions, not breaks</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-6 bg-gradient-to-r from-accent-pink to-accent-purple text-white px-6 py-3
                       rounded-xl font-semibold transition-all border border-white/20
                       hover:opacity-90 hover:shadow-lg hover:shadow-accent-pink/20 active:scale-[0.98]"
            >
              Save Settings
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TimerSettings