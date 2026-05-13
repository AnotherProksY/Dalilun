import 'dotenv/config'
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const app = express()
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TELEGRAM_REGEX = /^@\w{4,}$/

app.post('/api/submit', async (req, res) => {
  const { contact, name, goal, language } = req.body ?? {}

  if (!contact || !goal) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!EMAIL_REGEX.test(contact) && !TELEGRAM_REGEX.test(contact)) {
    return res.status(400).json({ error: 'Invalid contact format' })
  }

  const { error } = await supabase.from('applications').insert({
    contact,
    name: name || null,
    goal,
    language: language || null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return res.status(500).json({ error: 'Failed to save application' })
  }

  res.json({ ok: true })
})

const port = process.env.PORT ?? 3001
app.listen(port, 'localhost', () => {
  console.log(`API server running on localhost:${port}`)
})
