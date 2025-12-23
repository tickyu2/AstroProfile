/**
 * ============================================================================
 * ADMIN MIDDLEWARE
 * ============================================================================
 * Authentication, RBAC, and audit logging for admin endpoints.
 *
 * Roles:
 * - admin: Full control (drift, merges, jobs, settings)
 * - reviewer: Approve merges, answer questions
 * - auditor: Read-only access to all data
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const admin = require('firebase-admin');
const { query } = require('../database/pool');
const { v4: uuidv4 } = require('uuid');

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLES = {
  ADMIN: 'admin',
  REVIEWER: 'reviewer',
  AUDITOR: 'auditor'
};

const ROLE_HIERARCHY = {
  admin: ['admin', 'reviewer', 'auditor'],
  reviewer: ['reviewer', 'auditor'],
  auditor: ['auditor']
};

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Verify Firebase ID token and extract user info
 */
async function verifyToken(request) {
  const authHeader = request.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'auditor' // Custom claim for role
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Check if user has required role
 */
function hasRole(userRole, requiredRole) {
  const allowedRoles = ROLE_HIERARCHY[userRole] || [];
  return allowedRoles.includes(requiredRole);
}

/**
 * Middleware to require specific role
 */
function requireRole(requiredRole) {
  return async (request) => {
    const user = await verifyToken(request);

    if (!hasRole(user.role, requiredRole)) {
      throw new Error(`Access denied. Required role: ${requiredRole}`);
    }

    return user;
  };
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log admin action to audit table
 */
async function logAdminAction({
  actor,
  action,
  targetType,
  targetId,
  before,
  after,
  reason,
  requestId,
  metadata = {}
}) {
  const auditId = uuidv4();

  await query(`
    INSERT INTO admin_audit_log (
      id, actor_uid, actor_email, action, target_type, target_id,
      before_state, after_state, reason, request_id, metadata, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
  `, [
    auditId,
    actor.uid,
    actor.email,
    action,
    targetType,
    targetId,
    JSON.stringify(before),
    JSON.stringify(after),
    reason,
    requestId,
    JSON.stringify(metadata)
  ]);

  return auditId;
}

/**
 * Get audit log entries
 */
async function getAuditLog({
  userId = null,
  action = null,
  targetType = null,
  startDate = null,
  endDate = null,
  requestId = null,
  limit = 100,
  offset = 0
}) {
  let sql = `
    SELECT * FROM admin_audit_log
    WHERE 1=1
  `;
  const params = [];
  let paramIdx = 1;

  if (userId) {
    sql += ` AND (actor_uid = $${paramIdx} OR target_id = $${paramIdx})`;
    params.push(userId);
    paramIdx++;
  }

  if (action) {
    sql += ` AND action = $${paramIdx}`;
    params.push(action);
    paramIdx++;
  }

  if (targetType) {
    sql += ` AND target_type = $${paramIdx}`;
    params.push(targetType);
    paramIdx++;
  }

  if (requestId) {
    sql += ` AND request_id = $${paramIdx}`;
    params.push(requestId);
    paramIdx++;
  }

  if (startDate) {
    sql += ` AND created_at >= $${paramIdx}`;
    params.push(startDate);
    paramIdx++;
  }

  if (endDate) {
    sql += ` AND created_at <= $${paramIdx}`;
    params.push(endDate);
    paramIdx++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
}

// ============================================================================
// REQUEST HELPERS
// ============================================================================

/**
 * Generate request ID for tracing
 */
function generateRequestId() {
  return uuidv4();
}

/**
 * Extract request ID from headers or generate new one
 */
function getRequestId(request) {
  return request.headers?.['x-request-id'] || generateRequestId();
}

/**
 * Wrap admin handler with auth, audit, and error handling
 */
function adminHandler(requiredRole, handler) {
  return async (request) => {
    const requestId = getRequestId(request);

    try {
      // Authenticate and authorize
      const actor = await requireRole(requiredRole)(request);

      // Execute handler
      const result = await handler(request, actor, requestId);

      return {
        success: true,
        requestId,
        ...result
      };
    } catch (error) {
      console.error(`[Admin] Error (${requestId}):`, error);

      return {
        success: false,
        requestId,
        error: error.message
      };
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Auth
  verifyToken,
  hasRole,
  requireRole,

  // Audit
  logAdminAction,
  getAuditLog,

  // Helpers
  generateRequestId,
  getRequestId,
  adminHandler,

  // Constants
  ROLES,
  ROLE_HIERARCHY
};
