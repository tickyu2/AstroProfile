/**
 * Firebase Cloud Functions for GENESIS - AI SoulPartner
 *
 * Thin re-export layer. All logic lives in routes/*.js
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * Refactored: February 10, 2026 - Split 6,444-line monolith into 10 route modules
 */

const admin = require('firebase-admin');
admin.initializeApp();

// Route modules — each exports named Cloud Functions
Object.assign(exports,
  require('./routes/chat'),
  require('./routes/constellation'),
  require('./routes/astrology'),
  require('./routes/memory'),
  require('./routes/postgresql'),
  require('./routes/timeline'),
  require('./routes/love'),
  require('./routes/personality'),
  require('./routes/admin'),
  require('./routes/services'),
);
