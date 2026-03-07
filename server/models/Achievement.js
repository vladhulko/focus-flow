import pool from '../config/db.js'

export async function findByUser(userId) {
  const { rows } = await pool.query('SELECT * FROM achievements WHERE user_id = $1', [userId])
  return rows
}

export async function unlock(userId, key) {
  const { rows } = await pool.query(
    'SELECT id FROM achievements WHERE user_id = $1 AND key = $2',
    [userId, key],
  )
  if (rows.length > 0) return null

  const { rows: inserted } = await pool.query(
    `INSERT INTO achievements (user_id, key, unlocked_at)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [userId, key],
  )
  return inserted[0]
}

export async function checkAndUnlock(userId, user) {
  const checks = [
    { key: 'first_session', condition: (user.total_focus_minutes || 0) > 0 },
    { key: 'streak_3', condition: (user.streak_days || 0) >= 3 },
    { key: 'streak_7', condition: (user.streak_days || 0) >= 7 },
    { key: 'coins_100', condition: (user.flow_coins || 0) >= 100 },
    { key: 'focus_60', condition: (user.total_focus_minutes || 0) >= 60 },
    { key: 'focus_300', condition: (user.total_focus_minutes || 0) >= 300 },
  ]

  const unlocked = []
  for (const { key, condition } of checks) {
    if (condition) {
      const result = await unlock(userId, key)
      if (result) unlocked.push(result)
    }
  }
  return unlocked
}