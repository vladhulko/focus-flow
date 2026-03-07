import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars

const BACKGROUNDS = [
  {
    id: 'lofi-city',
    name: 'Lofi City Night',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 20% 80%, rgba(30, 10, 60, 0.9) 0%, rgba(10, 10, 30, 0.95) 50%, rgba(5, 5, 20, 1) 100%)',
    overlay: 'rgba(0,0,0,0.3)',
    particleColor: 'rgba(255, 255, 255,',
  },
  {
    id: 'forest',
    name: 'Misty Forest',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 50% 120%, rgba(10, 40, 30, 0.9) 0%, rgba(5, 20, 15, 0.95) 50%, rgba(5, 10, 10, 1) 100%)',
    overlay: 'rgba(0,0,0,0.25)',
    particleColor: 'rgba(255, 255, 255,',
  },
  {
    id: 'sunset',
    name: 'Mountain Sunset',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 50% 0%, rgba(60, 20, 40, 0.8) 0%, rgba(20, 10, 30, 0.9) 40%, rgba(8, 8, 25, 1) 100%)',
    overlay: 'rgba(0,0,0,0.2)',
    particleColor: 'rgba(255, 255, 255,',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 30% 70%, rgba(5, 20, 50, 0.9) 0%, rgba(5, 10, 35, 0.95) 50%, rgba(3, 5, 20, 1) 100%)',
    overlay: 'rgba(0,0,0,0.25)',
    particleColor: 'rgba(255, 255, 255,',
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 60% 20%, rgba(20, 60, 40, 0.6) 0%, rgba(10, 20, 50, 0.8) 40%, rgba(5, 5, 20, 1) 100%)',
    overlay: 'rgba(0,0,0,0.2)',
    particleColor: 'rgba(255, 255, 255,',
  },
  {
    id: 'deep-forest',
    name: 'Deep Forest',
    type: 'gradient',
    gradient: 'linear-gradient(180deg, rgba(8, 32, 18, 1) 0%, rgba(15, 55, 25, 0.95) 30%, rgba(20, 70, 30, 0.85) 60%, rgba(10, 40, 15, 1) 100%)',
    overlay: 'rgba(0,0,0,0.15)',
    particleColor: 'rgba(120, 200, 80,',
  },
  {
    id: 'tropical-ocean',
    name: 'Tropical Ocean',
    type: 'gradient',
    gradient: 'linear-gradient(180deg, rgba(5, 15, 45, 1) 0%, rgba(8, 40, 70, 0.95) 30%, rgba(10, 80, 100, 0.8) 65%, rgba(5, 50, 70, 1) 100%)',
    overlay: 'rgba(0,0,0,0.15)',
    particleColor: 'rgba(100, 220, 255,',
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    type: 'gradient',
    gradient: 'linear-gradient(180deg, rgba(45, 10, 30, 1) 0%, rgba(120, 40, 30, 0.85) 25%, rgba(180, 80, 50, 0.7) 50%, rgba(60, 20, 40, 0.95) 100%)',
    overlay: 'rgba(0,0,0,0.15)',
    particleColor: 'rgba(255, 180, 100,',
  },
]

const Particle = ({ delay, duration, x, size, opacity, color }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      background: `${color} ${opacity})`,
    }}
    initial={{ bottom: '-5%', opacity: 0 }}
    animate={{
      bottom: '105%',
      opacity: [0, opacity, opacity, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
)

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  delay: (i * 0.8) % 15,
  duration: 15 + (i * 1.3) % 20,
  x: (i * 5.1) % 100,
  size: 1 + (i * 0.15) % 3,
  opacity: 0.1 + (i * 0.015) % 0.3,
}))

const BackgroundEngine = ({ currentBg = 0 }) => {
  const [bgIndex, setBgIndex] = useState(currentBg)
  const bg = BACKGROUNDS[bgIndex] || BACKGROUNDS[0]

  useEffect(() => {
    setBgIndex(currentBg)
  }, [currentBg])

  return (
    <div className="fixed inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={bg.id}
          className="absolute inset-0"
          style={{ background: bg.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, transparent 0%, rgba(0,0,0,0.4) 100%)',
            'radial-gradient(circle at 70% 60%, transparent 0%, rgba(0,0,0,0.4) 100%)',
            'radial-gradient(circle at 30% 40%, transparent 0%, rgba(0,0,0,0.4) 100%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <Particle key={p.id} {...p} color={bg.particleColor || 'rgba(255, 255, 255,'} />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{ background: bg.overlay }}
      />
    </div>
  )
}

export { BACKGROUNDS }
export default BackgroundEngine