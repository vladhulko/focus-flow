import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as GardenObject from '../models/GardenObject.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const objects = await GardenObject.findByUser(req.userId)
    res.json({ objects })
  } catch (err) {
    console.error('Garden get error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { item_id, position_x, position_y } = req.body
    if (!item_id || position_x == null || position_y == null) {
      return res.status(400).json({ error: 'item_id, position_x, position_y are required' })
    }
    const obj = await GardenObject.create(req.userId, item_id, position_x, position_y)
    res.json({ object: obj })
  } catch (err) {
    console.error('Garden create error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const obj = await GardenObject.findById(req.params.id)
    if (!obj) return res.status(404).json({ error: 'Object not found' })
    if (obj.user_id !== req.userId) return res.status(403).json({ error: 'Forbidden' })

    await GardenObject.remove(obj.id)
    res.json({ success: true })
  } catch (err) {
    console.error('Garden delete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router