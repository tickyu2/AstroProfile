/**
 * Authentication Routes
 * JWT-based authentication for admin users
 */

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { query } = require('../db/connection')
const { authenticate } = require('../middleware/auth')

const JWT_SECRET = process.env.JWT_SECRET || 'genesis-admin-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

// POST login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const result = await query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    await query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST register (admin only)
router.post('/register', authenticate, async (req, res, next) => {
  try {
    // Only admins can register new users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can register new users' })
    }

    const { email, password, displayName, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const result = await query(`
      INSERT INTO admin_users (email, password_hash, display_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, display_name, role, created_at
    `, [email.toLowerCase(), passwordHash, displayName, role || 'editor'])

    res.status(201).json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// GET current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, email, display_name, role, last_login, created_at FROM admin_users WHERE id = $1',
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// PUT update password
router.put('/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }

    // Get user
    const userResult = await query(
      'SELECT password_hash FROM admin_users WHERE id = $1',
      [req.user.id]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(newPassword, salt)

    // Update password
    await query(
      'UPDATE admin_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, req.user.id]
    )

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
})

// POST refresh token
router.post('/refresh', authenticate, async (req, res, next) => {
  try {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({ token })
  } catch (error) {
    next(error)
  }
})

module.exports = router
