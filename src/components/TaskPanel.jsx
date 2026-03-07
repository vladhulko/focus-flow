import { useState } from 'react'
import { ListTodo, Plus, Check, Link, ChevronDown, ChevronUp, Coins } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useTask } from '../context/TaskContext'
import { useTimer } from '../context/TimerContext'

const TaskPanel = () => {
  const { pendingTasks, todaysTasks, addTask, completeTask, linkTaskToSession, activeTaskId } = useTask()
  const { isRunning } = useTimer()
  const [newTitle, setNewTitle] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    await addTask(newTitle.trim())
    setNewTitle('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong p-4 w-full max-w-lg mt-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <ListTodo size={16} className="text-accent-purple" />
        <h3 className="text-white font-display font-semibold text-sm">Tasks</h3>
        {pendingTasks.length > 0 && (
          <span className="text-white/30 text-xs ml-auto">{pendingTasks.length} pending</span>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What are you working on?"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl text-white text-sm px-3 py-2
                     placeholder:text-white/25 focus:outline-none focus:border-accent-purple/50 transition-all"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="glass-button p-2 text-accent-purple hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {pendingTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-2 p-2.5 rounded-xl transition-all
                ${activeTaskId === task.id
                  ? 'bg-accent-purple/10 border border-accent-purple/20'
                  : 'bg-white/3 border border-white/5 hover:bg-white/5'
                }`}
            >
              <button
                onClick={() => completeTask(task.id)}
                className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center
                           hover:border-accent-green hover:bg-accent-green/20 transition-all shrink-0"
              >
                <Check size={12} className="text-transparent hover:text-accent-green" />
              </button>

              <span className="text-white/80 text-sm flex-1 truncate">{task.title}</span>

              {isRunning && activeTaskId !== task.id && (
                <button
                  onClick={() => linkTaskToSession(task.id)}
                  className="text-white/30 hover:text-accent-purple transition-colors p-1"
                  title="Link to current session"
                >
                  <Link size={12} />
                </button>
              )}

              {activeTaskId === task.id && (
                <span className="text-accent-purple text-[10px] font-medium shrink-0">Active</span>
              )}

              {task.session_id && activeTaskId !== task.id && (
                <div className="flex items-center gap-0.5 text-amber-400/60 shrink-0" title="+5 coins on complete">
                  <Coins size={10} />
                  <span className="text-[9px]">+5</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {pendingTasks.length === 0 && (
          <p className="text-white/20 text-xs text-center py-3">No tasks yet. Add one above.</p>
        )}
      </div>

      {todaysTasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-1 text-white/30 text-xs hover:text-white/50 transition-colors w-full"
          >
            {showCompleted ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Completed today ({todaysTasks.length})
          </button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 mt-2">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg opacity-40">
                      <div className="w-5 h-5 rounded-md bg-accent-green/20 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-accent-green" />
                      </div>
                      <span className="text-white/60 text-sm line-through truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

export default TaskPanel