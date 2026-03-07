import { NavLink, useLocation } from 'react-router-dom'
import { Timer, TreePine, User, Coins } from 'lucide-react'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useApp } from '../context/AppContext'
import { useTimer } from '../context/TimerContext'

const navItems = [
  { to: '/', icon: Timer, label: 'Focus' },
  { to: '/garden', icon: TreePine, label: 'Garden' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const Navbar = () => {
  const location = useLocation()
  const { flowCoins } = useApp()
  const { isRunning, timeLeft, formatTime, mode } = useTimer()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
      <div className="max-w-md mx-auto">
        <div className="glass-strong flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              const NavIcon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all flex-1"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                    />
                  )}
                  <NavIcon
                    size={20}
                    className={`relative z-10 transition-colors ${
                      isActive ? 'text-accent-pink' : 'text-white/50'
                    }`}
                  />
                  <span
                    className={`relative z-10 text-[10px] font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              )
            })}
          </div>

          {isRunning && location.pathname !== '/' && (
            <NavLink
              to="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ml-2 transition-all hover:bg-white/10
                ${mode === 'focus'
                  ? 'bg-pink-500/10 border-pink-500/20'
                  : 'bg-green-500/10 border-green-500/20'
                }`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                mode === 'focus' ? 'bg-accent-pink' : 'bg-accent-green'
              }`} />
              <span className={`text-xs font-semibold tabular-nums ${
                mode === 'focus' ? 'text-accent-pink' : 'text-accent-green'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </NavLink>
          )}

          {!(isRunning && location.pathname !== '/') && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 ml-2">
              <Coins size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold">{flowCoins}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
