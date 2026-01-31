/**
 * GENESIS ADMIN CMS - Server Entry Point
 *
 * Khan Academy for Relationships - Content Management System
 * Manages educational content hierarchy: Modules > Sections > Subsections
 */

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const { pool, testConnection } = require('./db/connection')
const authRoutes = require('./routes/auth')
const moduleRoutes = require('./routes/modules')
const sectionRoutes = require('./routes/sections')
const subsectionRoutes = require('./routes/subsections')
const translationRoutes = require('./routes/translations')

const app = express()
const PORT = process.env.PORT || 4000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan('dev'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/sections', sectionRoutes)
app.use('/api/subsections', subsectionRoutes)
app.use('/api/translations', translationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  })
})

// Start server
async function start() {
  try {
    // Test database connection
    await testConnection()
    console.log('Database connection established')

    app.listen(PORT, () => {
      console.log(`Genesis Admin CMS running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
