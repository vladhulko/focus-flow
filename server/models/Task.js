import pool from '../config/db.js'

export async function findByUser(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId],
  )
  return rows
}

export async function create(userId, title, sessionId = null) {
  const { rows } = await pool.query(
    `INSERT INTO tasks (user_id, title, session_id, created_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [userId, title, sessionId],
  )
  return rows[0]
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])
  return rows[0] || null
}

export async function update(id, fields) {
  const keys = Object.keys(fields)
  const sets = keys.map((k, i) => `${k} = $${i + 2}`)
  const values = keys.map((k) => fields[k])
  const { rows } = await pool.query(
    `UPDATE tasks SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...values],
  )
  return rows[0]
}