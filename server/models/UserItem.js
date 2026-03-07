import pool from '../config/db.js'

export async function findByUser(userId) {
  const { rows } = await pool.query('SELECT * FROM user_items WHERE user_id = $1', [userId])
  return rows
}

export async function userOwnsItem(userId, itemId) {
  const { rows } = await pool.query(
    'SELECT id FROM user_items WHERE user_id = $1 AND item_id = $2',
    [userId, itemId],
  )
  return rows.length > 0
}

export async function create(userId, itemId) {
  const { rows } = await pool.query(
    `INSERT INTO user_items (user_id, item_id, purchased_at)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [userId, itemId],
  )
  return rows[0]
}