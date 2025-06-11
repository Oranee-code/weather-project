import express from 'express'
import db from '../db/connection' // adjust path as needed

const router = express.Router()

// POST /api/v1/users
// Save user if not already exists
router.post('/', async (req, res) => {
  const { auth0Id, name } = req.body

  if (!auth0Id) {
    return res.status(400).json({ error: 'auth0Id is required' })
  }

  try {
    const user = await db('users').where({ auth0_id: auth0Id }).first()
    if (!user) {
      await db('users').insert({ auth0_id: auth0Id, name })
      return res.status(201).json({ message: 'User created' })
    }
    return res.status(200).json({ message: 'User already exists' })
  } catch (error) {
    console.error('Failed to save user:', error)
    return res.status(500).json({ error: 'Failed to save user' })
  }
})

// Optional: GET /api/v1/users/:auth0Id
// Retrieve user by auth0Id
router.get('/:auth0Id', async (req, res) => {
  const { auth0Id } = req.params

  try {
    const user = await db('users').where({ auth0_id: auth0Id }).first()
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    console.error('Failed to get user:', error)
    return res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router