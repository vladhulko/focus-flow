import pool from '../config/db.js'

export async function findByDeviceId(deviceId) {
  const { rows } = await pool.query('SELECT * FROM users WHERE device_id = $1', [deviceId])
  return rows[0] || null
}

export async function create(deviceId) {
  const { rows } = await pool.query(
    `INSERT INTO users (device_id, flow_coins, total_focus_minutes, streak_days, last_active, created_at)
     VALUES ($1, 0, 0, 0, CURRENT_DATE, NOW())
     RETURNING *`,
    [deviceId],
  )
  return rows[0]
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return rows[0] || null
}

export async function update(id, fields) {
  const keys = Object.keys(fields)
  const sets = keys.map((k, i) => `${k} = $${i + 2}`)
  const values = keys.map((k) => fields[k])
  const { rows } = await pool.query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...values],
  )
  return rows[0]
}