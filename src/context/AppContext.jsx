import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AppContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [timerSettings, setTimerSettings] = useState(() => {
    const saved = localStorage.getItem('focusflow-timer-settings')
    return saved ? JSON.parse(saved) : {
      autoStartBreak: true,
      coinsPerSession: 3,
    }
  })

  const [flowCoins, setFlowCoins] = useState(() => {
    const saved = localStorage.getItem('focusflow-coins')
    return saved !== null ? parseInt(saved, 10) : 10
  })

  const [garden, setGarden] = useState(() => {
    const saved = localStorage.getItem('focusflow-garden')
    return saved ? JSON.parse(saved) : Array(25).fill(null)
  })

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('focusflow-inventory')
    return saved ? JSON.parse(saved) : []
  })

  const [totalFocusTime, setTotalFocusTime] = useState(() => {
    const saved = localStorage.getItem('focusflow-totaltime')
    return saved !== null ? parseInt(saved, 10) : 0
  })

  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const saved = localStorage.getItem('focusflow-sessions')
    return saved !== null ? parseInt(saved, 10) : 0
  })

  const [activeSessionId, setActiveSessionId] = useState(null)

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('focusflow-sound')
    return saved !== 'false'
  })

  const [backgroundIndex, setBackgroundIndex] = useState(() => {
    const saved = localStorage.getItem('focusflow-bg')
    return saved !== null ? parseInt(saved, 10) : 0
  })

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('focusflow-achievements')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => { localStorage.setItem('focusflow-timer-settings', JSON.stringify(timerSettings)) }, [timerSettings])
  useEffect(() => { localStorage.setItem('focusflow-coins', flowCoins) }, [flowCoins])
  useEffect(() => { localStorage.setItem('focusflow-garden', JSON.stringify(garden)) }, [garden])
  useEffect(() => { localStorage.setItem('focusflow-inventory', JSON.stringify(inventory)) }, [inventory])
  useEffect(() => { localStorage.setItem('focusflow-totaltime', totalFocusTime) }, [totalFocusTime])
  useEffect(() => { localStorage.setItem('focusflow-sessions', sessionsCompleted) }, [sessionsCompleted])
  useEffect(() => { localStorage.setItem('focusflow-sound', soundEnabled) }, [soundEnabled])
  useEffect(() => { localStorage.setItem('focusflow-bg', backgroundIndex) }, [backgroundIndex])
  useEffect(() => { localStorage.setItem('focusflow-achievements', JSON.stringify(achievements)) }, [achievements])

  const addCoins = useCallback((amount) => setFlowCoins(prev => prev + amount), [])

  const spendCoins = useCallback((amount) => {
    if (flowCoins >= amount) {
      setFlowCoins(prev => prev - amount)
      return true
    }
    return false
  }, [flowCoins])

  const plantInGarden = useCallback((index, plantData) => {
    if (garden[index] === null) {
      const newGarden = [...garden]
      newGarden[index] = { ...plantData, growthStage: 0, plantedAt: Date.now() }
      setGarden(newGarden)
      return true
    }
    return false
  }, [garden])

  const removeFromGarden = useCallback((index) => {
    const newGarden = [...garden]
    newGarden[index] = null
    setGarden(newGarden)
  }, [garden])

  const addToInventory = useCallback((item) => {
    setInventory(prev => [...prev, { ...item, id: Date.now() + Math.random() }])
  }, [])

  const removeFromInventory = useCallback((itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const startSession = useCallback(async () => {
    try {
      const res = await api.post('/sessions', { type: 'focus' })
      setActiveSessionId(res.data.session?.id || null)
    } catch {
      setActiveSessionId('local-' + Date.now())
    }
  }, [])

  const completeSession = useCallback(async (duration, sessionType = 'focus') => {
    if (sessionType === 'focus') {
      setSessionsCompleted(prev => prev + 1)
      setTotalFocusTime(prev => prev + duration)
      addCoins(timerSettings.coinsPerSession)
    }

    if (activeSessionId && !String(activeSessionId).startsWith('local-')) {
      try {
        await api.patch(`/sessions/${activeSessionId}`, {
          status: 'completed',
          actual_duration: duration,
        })
      } catch {
      }
    }
    setActiveSessionId(null)

    checkAchievements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId, addCoins, timerSettings.coinsPerSession])

  const checkAchievements = useCallback(() => {
    setAchievements(prev => {
      const checks = [
        { id: 'first_focus', condition: sessionsCompleted >= 1 },
        { id: 'consistent', condition: sessionsCompleted >= 10 },
        { id: 'dedicated', condition: sessionsCompleted >= 25 },
        { id: 'master', condition: sessionsCompleted >= 50 },
        { id: 'zen_master', condition: sessionsCompleted >= 100 },
      ]
      const newArr = [...prev]
      let changed = false
      checks.forEach(({ id, condition }) => {
        if (condition && !newArr.includes(id)) {
          newArr.push(id)
          changed = true
        }
      })
      return changed ? newArr : prev
    })
  }, [sessionsCompleted])

  const getRank = useCallback(() => {
    if (sessionsCompleted >= 100) return { name: 'Zen Master', icon: '🧘', level: 5, color: 'text-purple-400' }
    if (sessionsCompleted >= 50) return { name: 'Focus Guru', icon: '🎯', level: 4, color: 'text-amber-400' }
    if (sessionsCompleted >= 25) return { name: 'Productivity Pro', icon: '⚡', level: 3, color: 'text-blue-400' }
    if (sessionsCompleted >= 10) return { name: 'Garden Keeper', icon: '🌱', level: 2, color: 'text-green-400' }
    return { name: 'Explorer', icon: '🌟', level: 1, color: 'text-white/70' }
  }, [sessionsCompleted])

  const getNextRank = useCallback(() => {
    if (sessionsCompleted >= 100) return null
    if (sessionsCompleted >= 50) return { name: 'Zen Master', required: 100 }
    if (sessionsCompleted >= 25) return { name: 'Focus Guru', required: 50 }
    if (sessionsCompleted >= 10) return { name: 'Productivity Pro', required: 25 }
    return { name: 'Garden Keeper', required: 10 }
  }, [sessionsCompleted])

  const value = {
    flowCoins,
    garden,
    inventory,
    totalFocusTime,
    sessionsCompleted,
    soundEnabled,
    timerSettings,
    backgroundIndex,
    achievements,
    activeSessionId,
    setFlowCoins,
    setGarden,
    setInventory,
    setSoundEnabled,
    setTimerSettings,
    setBackgroundIndex,
    addCoins,
    spendCoins,
    plantInGarden,
    removeFromGarden,
    addToInventory,
    removeFromInventory,
    startSession,
    completeSession,
    getRank,
    getNextRank,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}