import pool from '../config/db.js'

export async function findAll() {
  const { rows } = await pool.query('SELECT * FROM shop_items ORDER BY price ASC')
  return rows
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM shop_items WHERE id = $1', [id])
  return rows[0] || null
}