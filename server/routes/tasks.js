import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as Task from '../models/Task.js'
import * as User from '../models/User.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findByUser(req.userId)
    res.json({ tasks })
  } catch (err) {
    console.error('Tasks get error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { title, session_id } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }
    const task = await Task.create(req.userId, title.trim(), session_id || null)
    res.json({ task })
  } catch (err) {
    console.error('Task create error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (task.user_id !== req.userId) return res.status(403).json({ error: 'Forbidden' })

    const updates = {}
    if (req.body.completed !== undefined) {
      updates.completed = req.body.completed
      updates.completed_at = req.body.completed ? new Date() : null
    }
    if (req.body.title !== undefined) {
      updates.title = req.body.title
    }
    if (req.body.session_id !== undefined) {
      updates.session_id = req.body.session_id
    }

    const updated = await Task.update(task.id, updates)

    let bonusCoins = 0
    if (req.body.completed && updated.session_id) {
      bonusCoins = 5
      const user = await User.findById(req.userId)
      await User.update(req.userId, { flow_coins: (user.flow_coins || 0) + bonusCoins })
    }

    res.json({ task: updated, bonus_coins: bonusCoins })
  } catch (err) {
    console.error('Task update error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router