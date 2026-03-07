import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useApp } from './AppContext'

const TaskContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const { activeSessionId, addCoins } = useApp()

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('focusflow-tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [activeTaskId, setActiveTaskId] = useState(null)

  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks')
        if (res.data.tasks && res.data.tasks.length > 0) {
          setTasks(res.data.tasks)
        }
      } catch {
      }
    }
    fetchTasks()
  }, [])

  const addTask = useCallback(async (title) => {
    const localTask = {
      id: 'local-' + Date.now(),
      title,
      completed: false,
      session_id: null,
      created_at: new Date().toISOString(),
      completed_at: null,
    }

    try {
      const res = await api.post('/tasks', { title })
      setTasks(prev => [res.data.task, ...prev])
      return res.data.task
    } catch {
      setTasks(prev => [localTask, ...prev])
      return localTask
    }
  }, [])

  const completeTask = useCallback(async (taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: true, completed_at: new Date().toISOString() } : t
    ))

    const task = tasks.find(t => t.id === taskId)
    if (task && task.session_id) {
      addCoins(5)
    }

    try {
      await api.patch(`/tasks/${taskId}`, { completed: true })
    } catch {
    }
  }, [tasks, addCoins])

  const linkTaskToSession = useCallback(async (taskId) => {
    const sessionId = activeSessionId
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, session_id: sessionId } : t
    ))
    setActiveTaskId(taskId)

    try {
      await api.patch(`/tasks/${taskId}`, { session_id: sessionId })
    } catch {
    }
  }, [activeSessionId])

  const todaysTasks = tasks.filter(t => {
    if (!t.completed_at) return false
    const today = new Date().toISOString().slice(0, 10)
    return t.completed_at.slice(0, 10) === today
  })

  const pendingTasks = tasks.filter(t => !t.completed)

  const value = {
    tasks,
    pendingTasks,
    todaysTasks,
    activeTaskId,
    setActiveTaskId,
    addTask,
    completeTask,
    linkTaskToSession,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}