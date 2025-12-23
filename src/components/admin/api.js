/**
 * Admin API Client for Consolidation Functions
 * Uses Firebase callable functions
 *
 * December 23, 2025
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

/**
 * Fetch pending promotions awaiting review
 */
export async function fetchPendingProposals({ limit = 50, status = 'pending' } = {}) {
  const getPendingPromotions = httpsCallable(functions, 'getPendingPromotions');
  const result = await getPendingPromotions({ limit, status });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to fetch pending promotions');
  }

  return result.data.pendingPromotions || [];
}

/**
 * Review (approve/reject) a pending promotion
 */
export async function reviewPendingProposal({ pendingId, action, note = '' }) {
  const reviewPendingPromotion = httpsCallable(functions, 'reviewPendingPromotion');
  const result = await reviewPendingPromotion({
    pendingId,
    action,
    reviewNotes: note
  });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Review action failed');
  }

  return result.data;
}

/**
 * Run LLM dry-run consolidation for a specific user
 */
export async function runLLMDryRun({ userId, profileId }) {
  const dryRunLLMConsolidation = httpsCallable(functions, 'dryRunLLMConsolidation');
  const result = await dryRunLLMConsolidation({ userId, profileId });

  if (!result.data.success) {
    throw new Error(result.data.error || 'LLM dry-run failed');
  }

  return result.data;
}

/**
 * Get consolidation metrics
 */
export async function getConsolidationMetrics({ days = 7 } = {}) {
  const fn = httpsCallable(functions, 'getConsolidationMetrics');
  const result = await fn({ days });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to fetch metrics');
  }

  return result.data;
}

/**
 * Get consolidation run history
 */
export async function getConsolidationHistory({ limit = 20 } = {}) {
  const fn = httpsCallable(functions, 'getConsolidationHistory');
  const result = await fn({ limit });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to fetch history');
  }

  return result.data.runs || [];
}

/**
 * Get per-user consolidation stats
 */
export async function getUserConsolidationStats({ userId, profileId }) {
  const fn = httpsCallable(functions, 'getUserConsolidationStats');
  const result = await fn({ userId, profileId });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to fetch user stats');
  }

  return result.data;
}

/**
 * Trigger manual consolidation for a user
 */
export async function triggerUserConsolidation({ userId, profileId, dryRun = true }) {
  const fn = httpsCallable(functions, 'triggerConsolidation');
  const result = await fn({ userId, profileId, dryRun });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Consolidation trigger failed');
  }

  return result.data;
}

// ============================================================================
// ROLLBACK API
// ============================================================================

/**
 * Revert one or more LTM promotions
 * @param {Object} params
 * @param {string[]} params.ltmIds - LTM IDs to revert
 * @param {number[]} params.promotionLogIds - Alternative: promotion log IDs
 * @param {string} params.reason - Required reason for revert
 */
export async function revertConsolidation({ ltmIds = [], promotionLogIds = [], reason }) {
  const fn = httpsCallable(functions, 'revertConsolidation');
  const result = await fn({ ltmIds, promotionLogIds, reason });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Revert failed');
  }

  return result.data;
}

/**
 * Get revert history for audit
 * @param {Object} params
 * @param {number} params.limit - Max entries to return
 * @param {string} params.userId - Filter by user (optional)
 */
export async function getRevertHistory({ limit = 50, userId } = {}) {
  const fn = httpsCallable(functions, 'getRevertHistory');
  const result = await fn({ limit, userId });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to fetch revert history');
  }

  return result.data.reverts || [];
}

/**
 * Get full details of a specific revert
 * @param {number} revertId - Revert log ID
 */
export async function getRevertDetail(revertId) {
  const fn = httpsCallable(functions, 'getRevertDetail');
  const result = await fn({ revertId });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to fetch revert detail');
  }

  return result.data.revert;
}

/**
 * Check if LTM entries can be reverted
 * @param {string[]} ltmIds - LTM IDs to check
 */
export async function checkRevertEligibility(ltmIds) {
  const fn = httpsCallable(functions, 'checkRevertEligibility');
  const result = await fn({ ltmIds });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to check eligibility');
  }

  return {
    eligible: result.data.eligible || [],
    ineligible: result.data.ineligible || []
  };
}

/**
 * Re-enable a previously reverted LTM entry
 * @param {Object} params
 * @param {string[]} params.ltmIds - LTM IDs to re-enable
 * @param {string} params.reason - Required reason
 */
export async function reEnableRevertedLtm({ ltmIds, reason }) {
  const fn = httpsCallable(functions, 'reEnableRevertedLtm');
  const result = await fn({ ltmIds, reason });

  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to re-enable LTM entries');
  }

  return result.data;
}
