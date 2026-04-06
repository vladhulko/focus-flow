import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as Session from '../models/Session.js'
import * as User from '../models/User.js'
import * as Achievement from '../models/Achievement.js'

const router = Router()

router.post('/', auth, async (req, res) => {
  try {
    const { duration_minutes } = req.body
    const session = await Session.create(req.userId, duration_minutes || 0)
    res.json({ session: { id: session.id } })
  } catch (err) {
    console.error('Create session error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    if (session.user_id !== req.userId) return res.status(403).json({ error: 'Forbidden' })
    if (session.completed_at) return res.status(400).json({ error: 'Session already completed' })

    const coinsToAdd = parseInt(req.body.coins_to_add) || 0
    const duration = req.body.actual_duration
      ? Math.floor(req.body.actual_duration / 60)
      : session.duration_minutes || 0

    await Session.complete(session.id, coinsToAdd)

    const user = await User.findById(req.userId)
    const newCoins = (user.flow_coins || 0) + coinsToAdd
    const newMinutes = (user.total_focus_minutes || 0) + duration

    const today = new Date().toISOString().slice(0, 10)
    const lastActive = user.last_active ? new Date(user.last_active).toISOString().slice(0, 10) : null
    let newStreak = user.streak_days || 0
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      newStreak = lastActive === yesterday ? newStreak + 1 : 1
    }

    const updatedUser = await User.update(req.userId, {
      flow_coins: newCoins,
      total_focus_minutes: newMinutes,
      streak_days: newStreak,
      last_active: new Date(),
    })

    await Achievement.checkAndUnlock(req.userId, updatedUser)

    res.json({ coins_earned: coinsToAdd, new_total: updatedUser.flow_coins })
  } catch (err) {
    console.error('Complete session error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router