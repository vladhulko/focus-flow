import { Router } from 'express'
import auth from '../middleware/auth.js'
import * as ShopItem from '../models/ShopItem.js'
import * as UserItem from '../models/UserItem.js'
import * as User from '../models/User.js'

const router = Router()

router.get('/items', auth, async (req, res) => {
  try {
    const items = await ShopItem.findAll()
    const owned = await UserItem.findByUser(req.userId)
    const ownedIds = owned.map((o) => o.item_id)
    res.json({ items, owned_ids: ownedIds })
  } catch (err) {
    console.error('Shop items error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/buy', auth, async (req, res) => {
  try {
    const { item_id } = req.body
    if (!item_id) return res.status(400).json({ error: 'item_id is required' })

    const item = await ShopItem.findById(item_id)
    if (!item) return res.status(404).json({ error: 'Item not found' })

    const alreadyOwned = await UserItem.userOwnsItem(req.userId, item_id)
    if (alreadyOwned) return res.status(400).json({ error: 'Item already owned' })

    const user = await User.findById(req.userId)
    if (user.flow_coins < item.price) {
      return res.status(400).json({ error: 'Not enough coins' })
    }

    const newBalance = user.flow_coins - item.price
    await User.update(req.userId, { flow_coins: newBalance })
    await UserItem.create(req.userId, item_id)

    res.json({ success: true, new_balance: newBalance })
  } catch (err) {
    console.error('Shop buy error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router