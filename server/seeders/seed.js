import 'dotenv/config'
import pool from '../config/db.js'

const shopItems = [
  { type: 'plant', name: 'Sunflower', description: 'A cheerful sunflower for your garden', price: 5, image_url: null },
  { type: 'plant', name: 'Cactus', description: 'A resilient little cactus', price: 3, image_url: null },
  { type: 'plant', name: 'Bonsai Tree', description: 'A miniature bonsai tree', price: 15, image_url: null },
  { type: 'plant', name: 'Rose Bush', description: 'Beautiful red roses', price: 10, image_url: null },
  { type: 'plant', name: 'Lavender', description: 'Fragrant purple lavender', price: 8, image_url: null },
  { type: 'plant', name: 'Bamboo', description: 'Tall and calming bamboo stalks', price: 12, image_url: null },
  { type: 'plant', name: 'Cherry Blossom', description: 'Delicate pink cherry blossom', price: 20, image_url: null },
  { type: 'plant', name: 'Mushroom', description: 'A cute forest mushroom', price: 4, image_url: null },
  { type: 'theme', name: 'Sunset Gradient', description: 'Warm sunset background theme', price: 25, image_url: null },
  { type: 'theme', name: 'Ocean Breeze', description: 'Cool ocean-inspired theme', price: 25, image_url: null },
  { type: 'sound', name: 'Rain Sounds', description: 'Gentle rain ambient sound', price: 15, image_url: null },
  { type: 'sound', name: 'Forest Birds', description: 'Peaceful forest bird sounds', price: 15, image_url: null },
]

async function seed() {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM shop_items')
    if (parseInt(rows[0].count) > 0) {
      console.log('Shop items already seeded, skipping.')
      process.exit(0)
    }

    for (const item of shopItems) {
      await pool.query(
        `INSERT INTO shop_items (type, name, description, price, image_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [item.type, item.name, item.description, item.price, item.image_url],
      )
    }

    console.log(`Seeded ${shopItems.length} shop items.`)
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()