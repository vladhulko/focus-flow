import { Award, Clock, Target, Coins, TreePine, Image } from 'lucide-react'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useApp } from '../context/AppContext'
import { BACKGROUNDS } from '../components/BackgroundEngine'
import GlassPanel from '../components/GlassPanel'

const Profile = () => {
  const {
    flowCoins, garden, totalFocusTime, sessionsCompleted,
    getRank, getNextRank, backgroundIndex, setBackgroundIndex
  } = useApp()

  const rank = getRank()
  const nextRank = getNextRank()
  const filledPlots = garden.filter(p => p !== null).length
  const gardenCompletion = Math.round((filledPlots / garden.length) * 100)

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const stats = [
    {
      icon: <Target size={24} />,
      label: 'Sessions',
      value: sessionsCompleted,
      color: 'text-accent-pink',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
    },
    {
      icon: <Clock size={24} />,
      label: 'Focus Time',
      value: formatTotalTime(totalFocusTime),
      color: 'text-accent-purple',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: <Coins size={24} />,
      label: 'Flow Coins',
      value: flowCoins,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: <TreePine size={24} />,
      label: 'Garden',
      value: `${gardenCompletion}%`,
      color: 'text-accent-green',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
  ]

  const achievements = [
    { id: 'first_focus', name: 'First Focus', description: 'Complete your first session', unlocked: sessionsCompleted >= 1, icon: '🌟' },
    { id: 'consistent', name: 'Consistent', description: 'Complete 10 sessions', unlocked: sessionsCompleted >= 10, icon: '🔥' },
    { id: 'dedicated', name: 'Dedicated', description: 'Complete 25 sessions', unlocked: sessionsCompleted >= 25, icon: '💪' },
    { id: 'master', name: 'Master', description: 'Complete 50 sessions', unlocked: sessionsCompleted >= 50, icon: '🏆' },
    { id: 'zen_master', name: 'Zen Master', description: 'Complete 100 sessions', unlocked: sessionsCompleted >= 100, icon: '🧘' },
    { id: 'gardener', name: 'Gardener', description: 'Plant 10 plants', unlocked: filledPlots >= 10, icon: '🌱' },
    { id: 'full_garden', name: 'Full Garden', description: 'Fill your entire garden', unlocked: filledPlots >= 25, icon: '🌳' },
    { id: 'hour_focus', name: 'Deep Focus', description: 'Accumulate 1 hour of focus', unlocked: totalFocusTime >= 3600, icon: '⏰' },
    { id: 'rich', name: 'Collector', description: 'Earn 50 Flow Coins total', unlocked: flowCoins >= 50, icon: '💰' },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="min-h-screen p-4 pt-8 pb-28 relative z-10">
      <div className="max-w-2xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Your Profile
          </h1>
          <p className="text-white/40 text-sm">
            Track your productivity journey
          </p>
        </motion.header>

        <GlassPanel strong className="text-center mb-6 glow-purple" delay={0.1}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 0.6 }}
            className="text-6xl mb-3"
          >
            {rank.icon}
          </motion.div>
          <h2 className={`text-2xl font-display font-bold ${rank.color} mb-1`}>
            {rank.name}
          </h2>
          <p className="text-white/40 text-sm mb-4">Level {rank.level}</p>

          {nextRank && (
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>{sessionsCompleted} sessions</span>
                <span>{nextRank.required} for {nextRank.name}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-accent-pink to-accent-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((sessionsCompleted / nextRank.required) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}
        </GlassPanel>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <GlassPanel key={index} delay={0.1 + index * 0.1} className="p-4">
              <div className={`${stat.bg} ${stat.border} border rounded-xl p-3 w-fit mb-3`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <p className="text-white/40 text-xs mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-display font-bold">{stat.value}</p>
            </GlassPanel>
          ))}
        </div>

        <GlassPanel className="mb-6" delay={0.3}>
          <div className="flex items-center gap-2 mb-4">
            <Image size={18} className="text-accent-blue" />
            <h2 className="text-white font-display font-semibold">Background Theme</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {BACKGROUNDS.map((bg, i) => (
              <button
                key={bg.id}
                onClick={() => setBackgroundIndex(i)}
                className={`shrink-0 w-16 h-16 rounded-xl transition-all
                  ${i === backgroundIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-105 shadow-lg shadow-white/10'
                    : 'opacity-60 hover:opacity-100'
                  }`}
                style={{ background: bg.gradient }}
              />
            ))}
          </div>
        </GlassPanel>

        <GlassPanel strong delay={0.4}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-accent-gold" />
              <h2 className="text-white font-display font-semibold">Achievements</h2>
            </div>
            <span className="text-white/40 text-xs">
              {unlockedCount}/{achievements.length}
            </span>
          </div>

          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all
                  ${achievement.unlocked
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-white/2 border border-white/5 opacity-40'
                  }`}
              >
                <span className="text-2xl w-8 text-center">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-white/40'}`}>
                    {achievement.name}
                  </p>
                  <p className="text-white/30 text-xs">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="text-accent-green text-xs font-medium">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-white/20 text-xs italic">
            "Focus is the gateway to clarity."
          </p>
          <p className="text-white/15 text-[10px] mt-1">Keep growing 🌱</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
