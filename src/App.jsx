import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { AppProvider, useApp } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { TimerProvider } from './context/TimerContext'
import { AudioProvider } from './context/AudioContext'
import { TaskProvider } from './context/TaskContext'
import BackgroundEngine from './components/BackgroundEngine'
import Navbar from './components/Navbar'
import Timer from './pages/Timer'
import Garden from './pages/Garden'
import Profile from './pages/Profile'
import './App.css'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const pageTransition = {
  duration: 0.3,
  ease: 'easeInOut',
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <Timer />
            </motion.div>
          }
        />
        <Route
          path="/garden"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <Garden />
            </motion.div>
          }
        />
        <Route
          path="/profile"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <Profile />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const AppContent = () => {
  const { backgroundIndex } = useApp()

  return (
    <div className="min-h-screen relative">
      <BackgroundEngine currentBg={backgroundIndex} />
      <div className="relative z-10">
        <AnimatedRoutes />
      </div>
      <Navbar />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AudioProvider>
          <TimerProvider>
            <TaskProvider>
              <Router>
                <AppContent />
              </Router>
            </TaskProvider>
          </TimerProvider>
        </AudioProvider>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
