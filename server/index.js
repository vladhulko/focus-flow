import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'
import shopRoutes from './routes/shop.js'
import gardenRoutes from './routes/garden.js'
import achievementRoutes from './routes/achievements.js'
import taskRoutes from './routes/tasks.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/shop', shopRoutes)
app.use('/api/garden', gardenRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})