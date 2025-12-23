/**
 * ============================================================================
 * ADMIN SERVICE
 * ============================================================================
 * Client-side service for admin dashboard API calls.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// ============================================================================
// DRIFT OPERATIONS
// ============================================================================

export async function getGlobalDrift() {
  const fn = httpsCallable(functions, 'adminGetGlobalDrift');
  const result = await fn({});
  return result.data;
}

export async function updateGlobalDrift(updates, reason) {
  const fn = httpsCallable(functions, 'adminUpdateGlobalDrift');
  const result = await fn({ updates, reason });
  return result.data;
}

export async function forceGlobalDrift(reason) {
  const fn = httpsCallable(functions, 'adminForceGlobalDrift');
  const result = await fn({ reason });
  return result.data;
}

export async function getGlobalDriftHistory(limit = 50, offset = 0) {
  const fn = httpsCallable(functions, 'adminGetGlobalDriftHistory');
  const result = await fn({ limit, offset });
  return result.data;
}

export async function rollbackGlobalDrift(historyId, reason) {
  const fn = httpsCallable(functions, 'adminRollbackGlobalDrift');
  const result = await fn({ historyId, reason });
  return result.data;
}

export async function toggleGlobalDrift(enabled, reason) {
  const fn = httpsCallable(functions, 'adminToggleGlobalDrift');
  const result = await fn({ enabled, reason });
  return result.data;
}

export async function searchUserDrift(searchTerm, limit = 50, offset = 0) {
  const fn = httpsCallable(functions, 'adminSearchUserDrift');
  const result = await fn({ searchTerm, limit, offset });
  return result.data;
}

export async function getUserDrift(userId, profileId = 'default') {
  const fn = httpsCallable(functions, 'adminGetUserDrift');
  const result = await fn({ userId, profileId });
  return result.data;
}

export async function updateUserDrift(userId, profileId, updates, reason) {
  const fn = httpsCallable(functions, 'adminUpdateUserDrift');
  const result = await fn({ userId, profileId, updates, reason });
  return result.data;
}

export async function pauseUserDrift(userId, profileId, pause, reason) {
  const fn = httpsCallable(functions, 'adminPauseUserDrift');
  const result = await fn({ userId, profileId, pause, reason });
  return result.data;
}

export async function resetUserDrift(userId, profileId, scope, reason) {
  const fn = httpsCallable(functions, 'adminResetUserDrift');
  const result = await fn({ userId, profileId, scope, reason });
  return result.data;
}

export async function getDriftAnalytics() {
  const fn = httpsCallable(functions, 'adminGetDriftAnalytics');
  const result = await fn({});
  return result.data;
}

// ============================================================================
// TIMELINE OPERATIONS
// ============================================================================

export async function getPendingMerges(limit = 50, offset = 0, status = 'pending') {
  const fn = httpsCallable(functions, 'adminGetPendingMerges');
  const result = await fn({ limit, offset, status });
  return result.data;
}

export async function getMergeCandidate(candidateId) {
  const fn = httpsCallable(functions, 'adminGetMergeCandidate');
  const result = await fn({ candidateId });
  return result.data;
}

export async function approveMerge(candidateId, action, note) {
  const fn = httpsCallable(functions, 'adminApproveMerge');
  const result = await fn({ candidateId, action, note });
  return result.data;
}

export async function searchEvents(searchTerm, userId = null, limit = 50, offset = 0) {
  const fn = httpsCallable(functions, 'adminSearchEvents');
  const result = await fn({ searchTerm, userId, limit, offset });
  return result.data;
}

export async function getEventDetails(eventId) {
  const fn = httpsCallable(functions, 'adminGetEventDetails');
  const result = await fn({ eventId });
  return result.data;
}

export async function updateEvent(eventId, updates, reason) {
  const fn = httpsCallable(functions, 'adminUpdateEvent');
  const result = await fn({ eventId, updates, reason });
  return result.data;
}

export async function deleteEvent(eventId, reason) {
  const fn = httpsCallable(functions, 'adminDeleteEvent');
  const result = await fn({ eventId, reason });
  return result.data;
}

export async function getQuestionQueue(status = 'open', limit = 50, offset = 0) {
  const fn = httpsCallable(functions, 'adminGetQuestionQueue');
  const result = await fn({ status, limit, offset });
  return result.data;
}

export async function markQuestionAnswered(questionId, note) {
  const fn = httpsCallable(functions, 'adminMarkQuestionAnswered');
  const result = await fn({ questionId, note });
  return result.data;
}

export async function applyQuestionAnswer(questionId, eventUpdates, note) {
  const fn = httpsCallable(functions, 'adminApplyQuestionAnswer');
  const result = await fn({ questionId, eventUpdates, note });
  return result.data;
}

export async function bulkMarkAnswered(questionIds, note) {
  const fn = httpsCallable(functions, 'adminBulkMarkAnswered');
  const result = await fn({ questionIds, note });
  return result.data;
}

// ============================================================================
// JOB OPERATIONS
// ============================================================================

export async function runNightlyDrift(force = false, reason = '') {
  const fn = httpsCallable(functions, 'adminRunNightlyDrift');
  const result = await fn({ force, reason });
  return result.data;
}

export async function runCleanup(options = {}, reason = '') {
  const fn = httpsCallable(functions, 'adminRunCleanup');
  const result = await fn({ options, reason });
  return result.data;
}

export async function getJobStatus(jobId) {
  const fn = httpsCallable(functions, 'adminGetJobStatus');
  const result = await fn({ jobId });
  return result.data;
}

export async function getRecentJobs(type = null, limit = 50) {
  const fn = httpsCallable(functions, 'adminGetRecentJobs');
  const result = await fn({ type, limit });
  return result.data;
}

// ============================================================================
// AUDIT OPERATIONS
// ============================================================================

export async function getAuditLog(filters = {}) {
  const fn = httpsCallable(functions, 'adminGetAuditLog');
  const result = await fn(filters);
  return result.data;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Drift
  getGlobalDrift,
  updateGlobalDrift,
  forceGlobalDrift,
  getGlobalDriftHistory,
  rollbackGlobalDrift,
  toggleGlobalDrift,
  searchUserDrift,
  getUserDrift,
  updateUserDrift,
  pauseUserDrift,
  resetUserDrift,
  getDriftAnalytics,

  // Timeline
  getPendingMerges,
  getMergeCandidate,
  approveMerge,
  searchEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
  getQuestionQueue,
  markQuestionAnswered,
  applyQuestionAnswer,
  bulkMarkAnswered,

  // Jobs
  runNightlyDrift,
  runCleanup,
  getJobStatus,
  getRecentJobs,

  // Audit
  getAuditLog
};
