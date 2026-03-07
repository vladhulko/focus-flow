import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as Achievement from '../models/Achievement.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.findByUser(req.userId)
    res.json({ achievements })
  } catch (err) {
    console.error('Achievements error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router