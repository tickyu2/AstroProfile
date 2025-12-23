/**
 * ============================================================================
 * ADMIN MODULE - Central Export
 * ============================================================================
 * Admin dashboard API for GENESIS
 *
 * Capabilities:
 * - Drift management (global + per-user)
 * - Timeline review (merges, events, questions)
 * - Job management (nightly, cleanup, reprocess)
 * - Audit logging and compliance
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const middleware = require('./middleware');
const driftAdmin = require('./driftAdmin');
const timelineAdmin = require('./timelineAdmin');
const jobsAdmin = require('./jobsAdmin');

// ============================================================================
// HANDLER WRAPPERS
// ============================================================================

const { adminHandler, ROLES } = middleware;

// ============================================================================
// DRIFT HANDLERS
// ============================================================================

const handleGetGlobalDrift = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const config = await driftAdmin.getGlobalDriftConfig();
  return { config };
});

const handleUpdateGlobalDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { updates, reason } = request.data;
  return driftAdmin.updateGlobalDriftConfig(actor, requestId, updates, reason);
});

const handleForceGlobalDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { reason } = request.data;
  return driftAdmin.forceGlobalDriftUpdate(actor, requestId, reason);
});

const handleGetGlobalDriftHistory = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { limit, offset } = request.data || {};
  const history = await driftAdmin.getGlobalDriftHistory(limit, offset);
  return { history };
});

const handleRollbackGlobalDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { historyId, reason } = request.data;
  return driftAdmin.rollbackGlobalDrift(actor, requestId, historyId, reason);
});

const handleToggleGlobalDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { enabled, reason } = request.data;
  return driftAdmin.toggleGlobalDriftEnabled(actor, requestId, enabled, reason);
});

const handleSearchUserDrift = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { searchTerm, limit, offset } = request.data;
  const users = await driftAdmin.searchUserDrift(searchTerm || '', limit, offset);
  return { users };
});

const handleGetUserDrift = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { userId, profileId } = request.data;
  const details = await driftAdmin.getUserDriftDetails(userId, profileId);
  return { details };
});

const handleUpdateUserDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { userId, profileId, updates, reason } = request.data;
  return driftAdmin.updateUserDrift(actor, requestId, userId, profileId, updates, reason);
});

const handlePauseUserDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { userId, profileId, pause, reason } = request.data;
  return driftAdmin.pauseUserDrift(actor, requestId, userId, profileId, pause, reason);
});

const handleResetUserDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { userId, profileId, scope, reason } = request.data;
  return driftAdmin.resetUserDrift(actor, requestId, userId, profileId, scope, reason);
});

const handleGetDriftAnalytics = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const analytics = await driftAdmin.getDriftAnalytics();
  return { analytics };
});

// ============================================================================
// TIMELINE HANDLERS
// ============================================================================

const handleGetPendingMerges = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { limit, offset, status } = request.data || {};
  const merges = await timelineAdmin.getPendingMerges(limit, offset, status);
  return { merges };
});

const handleGetMergeCandidate = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { candidateId } = request.data;
  const candidate = await timelineAdmin.getMergeCandidate(candidateId);
  return { candidate };
});

const handleApproveMerge = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { candidateId, action, note } = request.data;
  return timelineAdmin.approveMerge(actor, requestId, candidateId, action, note);
});

const handleRollbackMerge = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { candidateId, reason } = request.data;
  return timelineAdmin.rollbackMerge(actor, requestId, candidateId, reason);
});

const handleSearchEvents = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { searchTerm, userId, limit, offset } = request.data;
  const events = await timelineAdmin.searchTimelineEvents(searchTerm, userId, limit, offset);
  return { events };
});

const handleGetEventDetails = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { eventId } = request.data;
  const details = await timelineAdmin.getEventDetails(eventId);
  return { details };
});

const handleUpdateEvent = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { eventId, updates, reason } = request.data;
  return timelineAdmin.updateEvent(actor, requestId, eventId, updates, reason);
});

const handleDeleteEvent = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { eventId, reason } = request.data;
  return timelineAdmin.deleteEvent(actor, requestId, eventId, reason);
});

const handleGetQuestionQueue = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { status, limit, offset } = request.data || {};
  const questions = await timelineAdmin.getQuestionQueue(status, limit, offset);
  return { questions };
});

const handleGetQuestionDetails = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { questionId } = request.data;
  const question = await timelineAdmin.getQuestionDetails(questionId);
  return { question };
});

const handleMarkQuestionAnswered = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { questionId, note } = request.data;
  return timelineAdmin.markQuestionAnswered(actor, requestId, questionId, note);
});

const handleApplyQuestionAnswer = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { questionId, eventUpdates, note } = request.data;
  return timelineAdmin.applyQuestionAnswer(actor, requestId, questionId, eventUpdates, note);
});

const handleBulkMarkAnswered = adminHandler(ROLES.REVIEWER, async (request, actor, requestId) => {
  const { questionIds, note } = request.data;
  const results = await timelineAdmin.bulkMarkQuestionsAnswered(actor, requestId, questionIds, note);
  return { results };
});

// ============================================================================
// JOB HANDLERS
// ============================================================================

const handleRunNightlyDrift = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { force, reason } = request.data || {};
  return jobsAdmin.runNightlyDriftJob(actor, requestId, force, reason);
});

const handleRunMemoryConsolidation = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { userId, reason } = request.data || {};
  return jobsAdmin.runMemoryConsolidationJob(actor, requestId, userId, reason);
});

const handleRunTimelineReprocess = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { userId, profileId, reason } = request.data;
  return jobsAdmin.runTimelineReprocessJob(actor, requestId, userId, profileId, reason);
});

const handleRunCleanup = adminHandler(ROLES.ADMIN, async (request, actor, requestId) => {
  const { options, reason } = request.data || {};
  return jobsAdmin.runCleanupJob(actor, requestId, options, reason);
});

const handleGetJobStatus = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { jobId } = request.data;
  const status = await jobsAdmin.getJobStatus(jobId);
  return { status };
});

const handleGetRecentJobs = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { type, limit } = request.data || {};
  const jobs = await jobsAdmin.getRecentJobs(type, limit);
  return { jobs };
});

// ============================================================================
// AUDIT HANDLERS
// ============================================================================

const handleGetAuditLog = adminHandler(ROLES.AUDITOR, async (request, actor, requestId) => {
  const { userId, action, targetType, startDate, endDate, limit, offset } = request.data || {};
  const entries = await middleware.getAuditLog({
    userId, action, targetType, startDate, endDate, limit, offset
  });
  return { entries };
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Middleware
  middleware,

  // Modules
  driftAdmin,
  timelineAdmin,
  jobsAdmin,

  // Drift handlers
  handleGetGlobalDrift,
  handleUpdateGlobalDrift,
  handleForceGlobalDrift,
  handleGetGlobalDriftHistory,
  handleRollbackGlobalDrift,
  handleToggleGlobalDrift,
  handleSearchUserDrift,
  handleGetUserDrift,
  handleUpdateUserDrift,
  handlePauseUserDrift,
  handleResetUserDrift,
  handleGetDriftAnalytics,

  // Timeline handlers
  handleGetPendingMerges,
  handleGetMergeCandidate,
  handleApproveMerge,
  handleRollbackMerge,
  handleSearchEvents,
  handleGetEventDetails,
  handleUpdateEvent,
  handleDeleteEvent,
  handleGetQuestionQueue,
  handleGetQuestionDetails,
  handleMarkQuestionAnswered,
  handleApplyQuestionAnswer,
  handleBulkMarkAnswered,

  // Job handlers
  handleRunNightlyDrift,
  handleRunMemoryConsolidation,
  handleRunTimelineReprocess,
  handleRunCleanup,
  handleGetJobStatus,
  handleGetRecentJobs,

  // Audit handlers
  handleGetAuditLog,

  // Constants
  ROLES: middleware.ROLES
};
