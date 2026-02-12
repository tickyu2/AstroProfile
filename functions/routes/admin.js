/**
 * Admin Dashboard Route Module
 *
 * Admin dashboard wrappers (drift, timeline, jobs, audit) +
 * Consolidation Engine V2 (scheduler + rollback).
 *
 * Added: December 23, 2025
 */

const { onCall } = require('./shared');

// ---------------------------------------------------------------------------
// Module Imports (paths relative to functions/routes/)
// ---------------------------------------------------------------------------
const adminModule = require('../admin');
const consolidationScheduler = require('../memory/consolidationScheduler');
const consolidationRollback = require('../memory/consolidationRollback');

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {

  // =========================================================================
  // ADMIN DASHBOARD ENDPOINTS
  // =========================================================================

  // --- Drift Admin ---
  adminGetGlobalDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetGlobalDrift),
  adminUpdateGlobalDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleUpdateGlobalDrift),
  adminForceGlobalDrift: onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleForceGlobalDrift),
  adminGetGlobalDriftHistory: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetGlobalDriftHistory),
  adminRollbackGlobalDrift: onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleRollbackGlobalDrift),
  adminToggleGlobalDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleToggleGlobalDrift),
  adminSearchUserDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleSearchUserDrift),
  adminGetUserDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetUserDrift),
  adminUpdateUserDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleUpdateUserDrift),
  adminPauseUserDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handlePauseUserDrift),
  adminResetUserDrift: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleResetUserDrift),
  adminGetDriftAnalytics: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetDriftAnalytics),

  // --- Timeline Admin ---
  adminGetPendingMerges: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetPendingMerges),
  adminGetMergeCandidate: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetMergeCandidate),
  adminApproveMerge: onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleApproveMerge),
  adminRollbackMerge: onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleRollbackMerge),
  adminSearchEvents: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleSearchEvents),
  adminGetEventDetails: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetEventDetails),
  adminUpdateEvent: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleUpdateEvent),
  adminDeleteEvent: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleDeleteEvent),
  adminGetQuestionQueue: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetQuestionQueue),
  adminGetQuestionDetails: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetQuestionDetails),
  adminMarkQuestionAnswered: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleMarkQuestionAnswered),
  adminApplyQuestionAnswer: onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleApplyQuestionAnswer),
  adminBulkMarkAnswered: onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleBulkMarkAnswered),

  // --- Jobs Admin ---
  adminRunNightlyDrift: onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunNightlyDrift),
  adminRunMemoryConsolidation: onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunMemoryConsolidation),
  adminRunTimelineReprocess: onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunTimelineReprocess),
  adminRunCleanup: onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunCleanup),
  adminGetJobStatus: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetJobStatus),
  adminGetRecentJobs: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetRecentJobs),

  // --- Audit Admin ---
  adminGetAuditLog: onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetAuditLog),

  // =========================================================================
  // CONSOLIDATION ENGINE V2 (4-Brain Memory Architecture)
  // Luna's "Sleep Cycle" - Nightly consolidation of memories
  // =========================================================================

  // Scheduled Jobs (Cloud Scheduler)
  nightlyConsolidationV2: consolidationScheduler.nightlyConsolidationV2,
  weeklyDeepConsolidation: consolidationScheduler.weeklyDeepConsolidation,

  // Admin Callable Functions
  triggerConsolidation: consolidationScheduler.triggerConsolidation,
  getConsolidationHistory: consolidationScheduler.getConsolidationHistory,
  getConsolidationStats: consolidationScheduler.getConsolidationStats,
  dryRunConsolidation: consolidationScheduler.dryRunConsolidation,

  // Pending Promotions & LLM Dry-Run
  getPendingPromotions: consolidationScheduler.getPendingPromotions,
  reviewPendingPromotion: consolidationScheduler.reviewPendingPromotion,
  dryRunLLMConsolidation: consolidationScheduler.dryRunLLMConsolidation,

  // Monitoring & Metrics
  getConsolidationMetrics: consolidationScheduler.getConsolidationMetrics,
  getUserConsolidationStats: consolidationScheduler.getUserConsolidationStats,

  // Rollback API (Safe revert of LTM promotions)
  revertConsolidation: consolidationRollback.revertConsolidation,
  getRevertHistory: consolidationRollback.getRevertHistory,
  getRevertDetail: consolidationRollback.getRevertDetail,
  checkRevertEligibility: consolidationRollback.checkRevertEligibility,
  reEnableRevertedLtm: consolidationRollback.reEnableRevertedLtm,
};
