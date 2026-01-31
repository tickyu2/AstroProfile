/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'genesis-admin-secret-change-in-production'

/**
 * Authenticate user from JWT token
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

/**
 * Authorize user by role
 * @param {string[]} allowedRoles - Array of allowed roles
 */
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        required: allowedRoles,
        current: req.user.role
      })
    }

    next()
  }
}

module.exports = {
  authenticate,
  authorize
}
