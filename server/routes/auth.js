import { Router } from 'express'
import jwt from 'jsonwebtoken'
import * as User from '../models/User.js'

const router = Router()

router.post('/silent', async (req, res) => {
  try {
    const { device_id } = req.body
    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' })
    }

    let user = await User.findByDeviceId(device_id)
    if (!user) {
      try {
        user = await User.create(device_id)
      } catch (err) {
        if (err.code === '23505') {
          user = await User.findByDeviceId(device_id)
        } else {
          throw err
        }
      }
    }

    await User.update(user.id, { last_active: new Date() })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.json({
      token,
      user: {
        id: user.id,
        flow_coins: user.flow_coins,
        total_focus_minutes: user.total_focus_minutes,
        streak_days: user.streak_days,
      },
    })
  } catch (err) {
    console.error('Auth error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router