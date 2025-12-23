/**
 * ============================================================================
 * JOBS ADMIN ENDPOINTS
 * ============================================================================
 * Admin API for managing background jobs and scheduled tasks.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { query } = require('../database/pool');
const { logAdminAction } = require('./middleware');
const drift = require('../drift');

// ============================================================================
// JOB TRACKING
// ============================================================================

// In-memory job tracker (in production, use Redis or DB)
const activeJobs = new Map();

/**
 * Create a job record
 */
async function createJobRecord(type, triggeredBy, metadata = {}) {
  const result = await query(`
    INSERT INTO admin_job_log (type, triggered_by, status, metadata, started_at)
    VALUES ($1, $2, 'running', $3, NOW())
    RETURNING id
  `, [type, triggeredBy, JSON.stringify(metadata)]);

  const jobId = result.rows[0].id;
  activeJobs.set(jobId, { type, status: 'running', logs: [], startedAt: new Date() });

  return jobId;
}

/**
 * Update job status
 */
async function updateJobStatus(jobId, status, result = null, error = null) {
  await query(`
    UPDATE admin_job_log
    SET status = $1, result = $2, error = $3, completed_at = NOW()
    WHERE id = $4
  `, [status, JSON.stringify(result), error, jobId]);

  const job = activeJobs.get(jobId);
  if (job) {
    job.status = status;
    job.result = result;
    job.error = error;
  }
}

/**
 * Add log entry to job
 */
function addJobLog(jobId, level, message) {
  const job = activeJobs.get(jobId);
  if (job) {
    job.logs.push({ timestamp: new Date(), level, message });
  }
}

/**
 * Get job status
 */
async function getJobStatus(jobId) {
  // Check in-memory first
  const activeJob = activeJobs.get(jobId);
  if (activeJob) {
    return activeJob;
  }

  // Check database
  const result = await query(`
    SELECT * FROM admin_job_log WHERE id = $1
  `, [jobId]);

  if (result.rowCount === 0) {
    throw new Error('Job not found');
  }

  return result.rows[0];
}

/**
 * Get recent jobs
 */
async function getRecentJobs(type = null, limit = 50) {
  let sql = `SELECT * FROM admin_job_log`;
  const params = [];

  if (type) {
    sql += ` WHERE type = $1`;
    params.push(type);
  }

  sql += ` ORDER BY started_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await query(sql, params);
  return result.rows;
}

// ============================================================================
// NIGHTLY DRIFT JOB
// ============================================================================

/**
 * Run nightly drift update
 */
async function runNightlyDriftJob(actor, requestId, force = false, reason = '') {
  const jobId = await createJobRecord('nightly_drift', actor.email, { force, reason });

  // Log action
  await logAdminAction({
    actor,
    action: 'run_nightly_drift_job',
    targetType: 'job',
    targetId: jobId.toString(),
    before: null,
    after: { force, reason },
    reason,
    requestId
  });

  // Run job asynchronously
  (async () => {
    try {
      addJobLog(jobId, 'info', 'Starting nightly drift update...');

      const result = await drift.runNightlyDriftUpdate();

      addJobLog(jobId, 'info', `Completed: ${JSON.stringify(result.steps)}`);
      await updateJobStatus(jobId, 'completed', result);

    } catch (error) {
      addJobLog(jobId, 'error', error.message);
      await updateJobStatus(jobId, 'failed', null, error.message);
    }
  })();

  return { jobId, status: 'started' };
}

/**
 * Run memory consolidation job
 */
async function runMemoryConsolidationJob(actor, requestId, userId = null, reason = '') {
  const jobId = await createJobRecord('memory_consolidation', actor.email, { userId, reason });

  await logAdminAction({
    actor,
    action: 'run_memory_consolidation_job',
    targetType: 'job',
    targetId: jobId.toString(),
    before: null,
    after: { userId, reason },
    reason,
    requestId
  });

  // Run job asynchronously
  (async () => {
    try {
      addJobLog(jobId, 'info', 'Starting memory consolidation...');

      // TODO: Implement memory consolidation
      // const result = await memoryConsolidation.run(userId);

      const result = { message: 'Memory consolidation not yet implemented' };
      addJobLog(jobId, 'info', 'Completed');
      await updateJobStatus(jobId, 'completed', result);

    } catch (error) {
      addJobLog(jobId, 'error', error.message);
      await updateJobStatus(jobId, 'failed', null, error.message);
    }
  })();

  return { jobId, status: 'started' };
}

/**
 * Run timeline extraction reprocess job
 */
async function runTimelineReprocessJob(actor, requestId, userId, profileId = 'default', reason = '') {
  if (!userId) {
    throw new Error('userId required');
  }

  const jobId = await createJobRecord('timeline_reprocess', actor.email, { userId, profileId, reason });

  await logAdminAction({
    actor,
    action: 'run_timeline_reprocess_job',
    targetType: 'job',
    targetId: jobId.toString(),
    before: null,
    after: { userId, profileId, reason },
    reason,
    requestId
  });

  // Run job asynchronously
  (async () => {
    try {
      addJobLog(jobId, 'info', `Starting timeline reprocess for user ${userId}...`);

      // TODO: Implement timeline reprocessing
      // const result = await timelinePipeline.reprocessAllMessages(userId, profileId);

      const result = { message: 'Timeline reprocess not yet implemented' };
      addJobLog(jobId, 'info', 'Completed');
      await updateJobStatus(jobId, 'completed', result);

    } catch (error) {
      addJobLog(jobId, 'error', error.message);
      await updateJobStatus(jobId, 'failed', null, error.message);
    }
  })();

  return { jobId, status: 'started' };
}

/**
 * Run cleanup job
 */
async function runCleanupJob(actor, requestId, options = {}, reason = '') {
  const jobId = await createJobRecord('cleanup', actor.email, { options, reason });

  await logAdminAction({
    actor,
    action: 'run_cleanup_job',
    targetType: 'job',
    targetId: jobId.toString(),
    before: null,
    after: { options, reason },
    reason,
    requestId
  });

  (async () => {
    try {
      addJobLog(jobId, 'info', 'Starting cleanup...');
      const results = {};

      // Clean old signal logs
      if (options.signalLogs !== false) {
        const signalResult = await query(`
          DELETE FROM drift_signal_log
          WHERE recorded_at < NOW() - INTERVAL '30 days'
          RETURNING id
        `);
        results.signalLogsDeleted = signalResult.rowCount;
        addJobLog(jobId, 'info', `Deleted ${signalResult.rowCount} old signal logs`);
      }

      // Clean old job logs
      if (options.jobLogs !== false) {
        const jobResult = await query(`
          DELETE FROM admin_job_log
          WHERE started_at < NOW() - INTERVAL '90 days'
          RETURNING id
        `);
        results.jobLogsDeleted = jobResult.rowCount;
        addJobLog(jobId, 'info', `Deleted ${jobResult.rowCount} old job logs`);
      }

      await updateJobStatus(jobId, 'completed', results);

    } catch (error) {
      addJobLog(jobId, 'error', error.message);
      await updateJobStatus(jobId, 'failed', null, error.message);
    }
  })();

  return { jobId, status: 'started' };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Job tracking
  createJobRecord,
  updateJobStatus,
  addJobLog,
  getJobStatus,
  getRecentJobs,

  // Jobs
  runNightlyDriftJob,
  runMemoryConsolidationJob,
  runTimelineReprocessJob,
  runCleanupJob
};
