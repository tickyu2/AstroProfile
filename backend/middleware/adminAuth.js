/**
 * ============================================================================
 * ADMIN AUTH MIDDLEWARE
 * ============================================================================
 * RBAC middleware for admin routes and audit logging.
 * Adapt to your authentication system as needed.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import { pool } from '../db/pool.js';

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

/**
 * requireRole(role)
 * Middleware that checks if the authenticated user has the required role.
 * Expects req.user to be set by upstream authentication middleware.
 *
 * @param {string} role - Required role (e.g., 'admin', 'super_admin')
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.use(requireRole('admin'));
 *   // or for specific routes:
 *   router.post('/sensitive', requireRole('super_admin'), handler);
 */
export function requireRole(role) {
  return (req, res, next) => {
    const user = req.user;

    // Check if user is authenticated
    if (!user) {
      return res.status(401).json({
        error: 'unauthenticated',
        message: 'Authentication required'
      });
    }

    // Normalize roles to array
    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : (user.roles ? [user.roles] : []);

    // Check for admin flag (Firebase custom claims pattern)
    if (user.admin === true || user.isAdmin === true) {
      userRoles.push('admin');
    }

    // Check if user has required role
    if (!userRoles.includes(role)) {
      return res.status(403).json({
        error: 'forbidden',
        message: `Role '${role}' required for this action`
      });
    }

    next();
  };
}

/**
 * requireAnyRole(roles)
 * Middleware that checks if user has at least one of the specified roles.
 *
 * @param {string[]} roles - Array of acceptable roles
 * @returns {Function} Express middleware
 */
export function requireAnyRole(roles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: 'unauthenticated',
        message: 'Authentication required'
      });
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : (user.roles ? [user.roles] : []);

    if (user.admin === true || user.isAdmin === true) {
      userRoles.push('admin');
    }

    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        error: 'forbidden',
        message: `One of roles [${roles.join(', ')}] required`
      });
    }

    next();
  };
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * logAdminAction(actor, action, payload, requestId)
 * Log administrative actions for audit trail.
 * Writes to admin_audit_log table if available, falls back to console.
 *
 * @param {string} actor - User ID of the admin performing the action
 * @param {string} action - Action identifier (e.g., 'consolidation.revert')
 * @param {Object} payload - Action details and parameters
 * @param {string|null} requestId - Optional request ID for correlation
 *
 * Usage:
 *   await logAdminAction(req.user.id, 'user.delete', { userId: targetId }, requestId);
 */
export async function logAdminAction(actor, action, payload = {}, requestId = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    actor,
    action,
    payload,
    requestId,
    timestamp
  };

  try {
    const client = await pool.connect();

    try {
      // Attempt to write to admin_audit_log table
      const query = `
        INSERT INTO admin_audit_log (actor, action, payload, request_id, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `;
      const result = await client.query(query, [
        actor,
        action,
        JSON.stringify(payload),
        requestId
      ]);

      // Log success to console for debugging
      console.info(`[ADMIN-AUDIT] id=${result.rows[0].id} action=${action} actor=${actor}`);

    } catch (dbErr) {
      // Table might not exist - fall back to console logging
      if (dbErr.code === '42P01') { // undefined_table
        console.warn('[ADMIN-AUDIT] admin_audit_log table not found, logging to console only');
      }
      console.info(`[ADMIN-ACTION] ${JSON.stringify(logEntry)}`);
    } finally {
      client.release();
    }

  } catch (poolErr) {
    // Pool connection failed - log to console
    console.warn('[ADMIN-AUDIT] Database connection failed:', poolErr.message);
    console.info(`[ADMIN-ACTION] ${JSON.stringify(logEntry)}`);
  }
}

/**
 * createAuditMiddleware(actionPrefix)
 * Creates middleware that automatically logs route access.
 *
 * @param {string} actionPrefix - Prefix for action names (e.g., 'admin.consolidation')
 * @returns {Function} Express middleware
 */
export function createAuditMiddleware(actionPrefix) {
  return async (req, res, next) => {
    const actor = req.user?.id || 'anonymous';
    const action = `${actionPrefix}.${req.method.toLowerCase()}`;
    const requestId = req.headers['x-request-id'] || null;

    // Log at request start
    const startTime = Date.now();

    // Capture response
    const originalEnd = res.end;
    res.end = function(...args) {
      const duration = Date.now() - startTime;

      logAdminAction(actor, action, {
        path: req.path,
        method: req.method,
        statusCode: res.statusCode,
        duration,
        query: req.query,
        bodyKeys: req.body ? Object.keys(req.body) : []
      }, requestId).catch(err => {
        console.warn('[ADMIN-AUDIT] Failed to log:', err.message);
      });

      return originalEnd.apply(this, args);
    };

    next();
  };
}

// ============================================================================
// HELPER: CREATE ADMIN AUDIT LOG TABLE
// ============================================================================

/**
 * SQL to create admin_audit_log table if it doesn't exist.
 * Run this during database setup/migration.
 */
export const ADMIN_AUDIT_LOG_SQL = `
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id SERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  payload JSONB,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_actor ON admin_audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

COMMENT ON TABLE admin_audit_log IS 'Audit trail for all administrative actions';
`;
