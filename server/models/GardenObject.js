import pool from '../config/db.js'

export async function findByUser(userId) {
  const { rows } = await pool.query('SELECT * FROM garden_objects WHERE user_id = $1', [userId])
  return rows
}

export async function create(userId, itemId, posX, posY) {
  const { rows } = await pool.query(
    `INSERT INTO garden_objects (user_id, item_id, position_x, position_y, growth_stage, placed_at)
     VALUES ($1, $2, $3, $4, 0, NOW())
     RETURNING *`,
    [userId, itemId, posX, posY],
  )
  return rows[0]
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM garden_objects WHERE id = $1', [id])
  return rows[0] || null
}

export async function remove(id) {
  await pool.query('DELETE FROM garden_objects WHERE id = $1', [id])
}