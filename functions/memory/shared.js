/**
 * ============================================================================
 * GENESIS LUNA - MEMORY SHARED UTILITIES
 * ============================================================================
 * Shared dependencies and utilities for all memory modules.
 * Centralizes Firebase, LLM clients, and scoring functions.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         MEMORY SHARED LAYER                              │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │  Firebase Admin  │  LLM Client  │  Scoring Utils  │  Config Constants  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

// Initialize Firebase Admin (singleton)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Database clients
const db = admin.firestore();

// Import centralized modules
const { getFirestore, COLLECTIONS } = require('../database/firestoreClient');
const { embedText, generateText, cosineSimilarity } = require('../llm/clientFactory');
const scoringUtils = require('./scoringUtils');
const { MEMORY, SCORING, PERFORMANCE } = require('../config/constants');

// ============================================================================
// CLOUD FUNCTION OPTIONS
// ============================================================================

const FUNCTION_OPTIONS = {
  light: {
    memory: '128MiB',
    timeoutSeconds: 15,
    cors: true
  },
  standard: {
    memory: '256MiB',
    timeoutSeconds: 30,
    cors: true
  },
  heavy: {
    memory: '512MiB',
    timeoutSeconds: 60,
    cors: true
  },
  orchestrator: {
    memory: '1GiB',
    timeoutSeconds: 90,
    cors: true
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user's memory collection path
 */
function getUserMemoryPath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/memories`;
}

/**
 * Get user's facts collection path
 */
function getUserFactsPath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/facts`;
}

/**
 * Get user's people collection path
 */
function getUserPeoplePath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/people`;
}

/**
 * Get user's anchors collection path
 */
function getUserAnchorsPath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/happiness_anchors`;
}

/**
 * Get Luna's brain path (journal, patterns, etc.)
 */
function getLunaBrainPath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/luna_brain`;
}

/**
 * Get timeline path
 */
function getTimelinePath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/timeline`;
}

/**
 * Get relationship path
 */
function getRelationshipPath(userId, profileId) {
  return `users/${userId}/profiles/${profileId}/relationship`;
}

/**
 * Validate required fields
 */
function validateRequired(data, fields) {
  const missing = fields.filter(f => !data[f]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Safe timestamp conversion
 */
function toTimestamp(date) {
  if (!date) return admin.firestore.FieldValue.serverTimestamp();
  if (date instanceof admin.firestore.Timestamp) return date;
  if (date instanceof Date) return admin.firestore.Timestamp.fromDate(date);
  if (typeof date === 'number') return admin.firestore.Timestamp.fromMillis(date);
  return admin.firestore.FieldValue.serverTimestamp();
}

/**
 * Safe date extraction from Firestore timestamp
 */
function fromTimestamp(timestamp) {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate) return timestamp.toDate();
  if (typeof timestamp === 'number') return new Date(timestamp);
  return null;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Firebase
  admin,
  db,
  onCall,
  FieldValue: admin.firestore.FieldValue,
  Timestamp: admin.firestore.Timestamp,

  // Centralized clients
  getFirestore,
  COLLECTIONS,
  embedText,
  generateText,
  cosineSimilarity,

  // Scoring
  ...scoringUtils,

  // Config
  MEMORY,
  SCORING,
  PERFORMANCE,

  // Function options
  FUNCTION_OPTIONS,

  // Path helpers
  getUserMemoryPath,
  getUserFactsPath,
  getUserPeoplePath,
  getUserAnchorsPath,
  getLunaBrainPath,
  getTimelinePath,
  getRelationshipPath,

  // Utility helpers
  validateRequired,
  toTimestamp,
  fromTimestamp
};
