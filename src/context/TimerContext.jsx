import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from './AppContext'

const TimerContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider')
  }
  return context
}

const PRESET_SLOTS = [
  { id: 'pomodoro', label: 'Pomodoro', focusMin: 25, breakMin: 5, editable: false },
  { id: 'short', label: 'Short', focusMin: 15, breakMin: 3, editable: true },
  { id: 'long', label: 'Long', focusMin: 50, breakMin: 10, editable: true },
  { id: 'custom', label: 'Custom', focusMin: 45, breakMin: 15, editable: true },
]

export const TimerProvider = ({ children }) => {
  const { completeSession, startSession, soundEnabled, timerSettings, tickGarden } = useApp()

  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('focusflow-presets')
    return saved ? JSON.parse(saved) : PRESET_SLOTS
  })

  const [activePresetId, setActivePresetId] = useState(() => {
    return localStorage.getItem('focusflow-active-preset') || 'pomodoro'
  })

  const activePreset = presets.find(p => p.id === activePresetId) || presets[0]

  useEffect(() => {
    localStorage.setItem('focusflow-presets', JSON.stringify(presets))
  }, [presets])

  useEffect(() => {
    localStorage.setItem('focusflow-active-preset', activePresetId)
  }, [activePresetId])

  const [mode, setMode] = useState('focus')
  const [timeLeft, setTimeLeft] = useState(activePreset.focusMin * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [sessionStartedAt, setSessionStartedAt] = useState(null)

  const intervalRef = useRef(null)
  const modeRef = useRef(mode)
  const autoStartBreak = timerSettings.autoStartBreak

  useEffect(() => { modeRef.current = mode }, [mode])

  const focusSeconds = activePreset.focusMin * 60
  const breakSeconds = activePreset.breakMin * 60

  const playSound = useCallback((type) => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      if (type === 'start') {
        ;[523.25, 659.25].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.type = 'sine'
          osc.frequency.value = freq
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4)
          osc.start(ctx.currentTime + i * 0.15)
          osc.stop(ctx.currentTime + i * 0.15 + 0.4)
        })
      } else if (type === 'finish') {
        ;[783.99, 659.25, 523.25].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.type = 'sine'
          osc.frequency.value = freq
          gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.2)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.8)
          osc.start(ctx.currentTime + i * 0.2)
          osc.stop(ctx.currentTime + i * 0.2 + 0.8)
        })
      }
    } catch {
    }
  }, [soundEnabled])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        if (modeRef.current === 'focus') tickGarden()
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            handleSessionEnd()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft])

  const handleSessionEnd = useCallback(() => {
    setIsRunning(false)
    setIsCompleted(true)
    playSound('finish')

    if (modeRef.current === 'focus') {
      completeSession(focusSeconds, 'focus')

      if (autoStartBreak) {
        setTimeout(() => {
          setMode('break')
          setTimeLeft(breakSeconds)
          setIsCompleted(false)
          setIsRunning(true)
          playSound('start')
        }, 2000)
      } else {
        setMode('break')
        setTimeLeft(breakSeconds)
      }
    } else {
      completeSession(breakSeconds, 'break')
      setMode('focus')
      setTimeLeft(focusSeconds)
    }
  }, [autoStartBreak, breakSeconds, completeSession, focusSeconds, playSound])

  const start = useCallback(async () => {
    if (isCompleted && mode === 'break') {
      setIsCompleted(false)
      setTimeLeft(focusSeconds)
      setMode('focus')
    }

    if (!isRunning && timeLeft > 0) {
      playSound('start')
      if (mode === 'focus' && timeLeft === focusSeconds) {
        setSessionStartedAt(Date.now())
        await startSession()
      }
      setIsRunning(true)
    }
  }, [isCompleted, isRunning, mode, timeLeft, focusSeconds, playSound, startSession])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const toggleStartPause = useCallback(async () => {
    if (isRunning) {
      pause()
    } else {
      await start()
    }
  }, [isRunning, pause, start])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsCompleted(false)
    setSessionStartedAt(null)
    setTimeLeft(mode === 'focus' ? focusSeconds : breakSeconds)
  }, [mode, focusSeconds, breakSeconds])

  const switchPreset = useCallback((presetId) => {
    if (isRunning) return
    const preset = presets.find(p => p.id === presetId)
    if (!preset) return
    setActivePresetId(presetId)
    setMode('focus')
    setTimeLeft(preset.focusMin * 60)
    setIsCompleted(false)
    setSessionStartedAt(null)
  }, [isRunning, presets])

  const updatePreset = useCallback((presetId, updates) => {
    setPresets(prev => prev.map(p =>
      p.id === presetId && p.editable ? { ...p, ...updates } : p
    ))
    if (presetId === activePresetId && !isRunning) {
      const updated = { ...activePreset, ...updates }
      setTimeLeft(mode === 'focus' ? updated.focusMin * 60 : updated.breakMin * 60)
    }
  }, [activePresetId, activePreset, isRunning, mode])

  const totalTime = mode === 'focus' ? focusSeconds : breakSeconds
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  const value = {
    mode,
    timeLeft,
    isRunning,
    isCompleted,
    progress,
    totalTime,
    sessionStartedAt,
    presets,
    activePresetId,
    activePreset,
    toggleStartPause,
    start,
    pause,
    reset,
    switchPreset,
    updatePreset,
    playSound,
    formatTime,
  }

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}