import pool from '../config/db.js'

export async function create(userId, durationMinutes) {
  const { rows } = await pool.query(
    `INSERT INTO sessions (user_id, started_at, duration_minutes)
     VALUES ($1, NOW(), $2)
     RETURNING *`,
    [userId, durationMinutes],
  )
  return rows[0]
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM sessions WHERE id = $1', [id])
  return rows[0] || null
}

export async function complete(id, coinsEarned) {
  const { rows } = await pool.query(
    `UPDATE sessions SET completed_at = NOW(), coins_earned = $2 WHERE id = $1 RETURNING *`,
    [id, coinsEarned],
  )
  return rows[0]
}