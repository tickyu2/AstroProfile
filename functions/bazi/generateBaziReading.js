/**
 * generateBaziReading — Cloud Function orchestrator
 *
 * Loads a profile from Firestore, calculates BaZi chart via Python,
 * builds prompts, calls Claude for each reading mode (soul/master/shadow),
 * parses responses, and stores results per-profile in Firestore with
 * real-time progress updates.
 *
 * Firestore path: profiles/{profileId}/bazi_readings/latest
 */

const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');
const { adaptPythonChart, adaptLuckPillars } = require('./chartAdapter');
const {
  buildPremiumBaZiPayload,
  parseStructuredReading,
  parseMasterCommentary,
  parseShadowReading,
  READING_SECTION_META,
} = require('./baziPayloadBuilder');

const { logger } = require('firebase-functions');

const db = admin.firestore();

// Cloud Run URL pattern for Python functions
const CLOUD_RUN_SUFFIX = '-sjpjwnbsmq-uc.a.run.app';
const getCloudRunUrl = (functionName) => {
  const urlName = functionName.replace(/_/g, '-');
  return `https://${urlName}${CLOUD_RUN_SUFFIX}`;
};

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 8192;

/**
 * Main orchestration function.
 *
 * @param {object} params
 * @param {string} params.profileId — Firestore profile doc ID
 * @param {string[]} params.modes — e.g. ['soul', 'master', 'shadow']
 * @param {string} params.userId — Authenticated user's UID
 * @returns {object} Result summary
 */
async function generateBaziReading({ profileId, modes = ['soul', 'master', 'shadow'], userId }) {
  const readingRef = db.collection('profiles').doc(profileId).collection('bazi_readings').doc('latest');

  try {
    // ─── 1. Load profile ─────────────────────────────────────────────
    const profileSnap = await db.collection('profiles').doc(profileId).get();
    if (!profileSnap.exists) {
      throw new Error(`Profile ${profileId} not found`);
    }
    const profile = profileSnap.data();

    // Verify ownership
    if (profile.userId !== userId) {
      throw new Error('Permission denied: profile does not belong to this user');
    }

    // Rate limit: skip if reading was generated < 5 minutes ago
    const existingSnap = await readingRef.get();
    if (existingSnap.exists) {
      const existing = existingSnap.data();
      if (existing.generatedAt && existing.status === 'complete') {
        const ageMs = Date.now() - existing.generatedAt.toMillis();
        if (ageMs < 5 * 60 * 1000) {
          logger.info('[BaZiReading] Returning cached reading (< 5 min old)');
          return { cached: true, status: 'complete', ageSeconds: Math.round(ageMs / 1000) };
        }
      }
    }

    // Extract birth data
    const birthDate = profile.birthDate || profile.birth_date;
    const birthTime = profile.birthTime || profile.birth_time || '12:00';
    const gender = profile.gender;
    const profileName = profile.name || profile.displayName || 'Unknown';

    if (!birthDate) {
      throw new Error('Profile is missing birth date');
    }

    // ─── 2. Set initial progress ─────────────────────────────────────
    await readingRef.set({
      status: 'pending',
      profileId,
      profileName,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      modes,
    });

    // ─── 3. Call Python bazi_joey_yap ────────────────────────────────
    logger.info('[BaZiReading] Calling Python bazi_joey_yap...');
    await readingRef.update({ status: 'calculating_chart' });

    const chartResponse = await fetch(getCloudRunUrl('bazi_joey_yap'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDate,
        birthTime,
        isMale: gender !== 'female',
        includeDayun: true,
        dayunPillarCount: 8,
      }),
    });

    if (!chartResponse.ok) {
      const errText = await chartResponse.text();
      throw new Error(`Python bazi_joey_yap failed (${chartResponse.status}): ${errText}`);
    }

    const pythonChart = await chartResponse.json();
    logger.info('[BaZiReading] Chart calculated successfully');

    // ─── 4. Adapt chart to payload builder shape ─────────────────────
    const chart = adaptPythonChart(pythonChart);
    const luckPillars = adaptLuckPillars(pythonChart);

    // ─── 5. Initialize Claude client ─────────────────────────────────
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const results = {};
    const usage = {};
    let totalTokens = 0;

    // ─── 6. Generate each reading mode ───────────────────────────────
    for (const mode of modes) {
      const statusKey = `generating_${mode}`;
      await readingRef.update({ status: statusKey });
      logger.info(`[BaZiReading] Generating ${mode} reading...`);

      // Build prompt
      const { system, userMessage } = buildPremiumBaZiPayload({
        chart,
        profileName,
        gender,
        birthDate,
        birthTime,
        luckPillars,
        mode,
      });

      // Call Claude
      const response = await client.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.75,
        system,
        messages: [{ role: 'user', content: userMessage }],
      });

      const rawText = (response.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      const inputTokens = response.usage?.input_tokens || 0;
      const outputTokens = response.usage?.output_tokens || 0;
      usage[mode] = { input: inputTokens, output: outputTokens };
      totalTokens += inputTokens + outputTokens;

      // Parse response
      let parsed = null;
      if (mode === 'soul') {
        parsed = parseStructuredReading(rawText);
      } else if (mode === 'master') {
        parsed = parseMasterCommentary(rawText);
      } else if (mode === 'shadow') {
        parsed = parseShadowReading(rawText);
      }

      if (!parsed) {
        logger.warn(`[BaZiReading] Failed to parse ${mode} response, storing raw text`);
        // Store raw text as fallback
        if (mode === 'soul') {
          parsed = { whoIAm: rawText.slice(0, 2000), rawParseError: true };
        } else if (mode === 'master') {
          parsed = { masterCommentary: rawText.slice(0, 3000), rawParseError: true };
        } else {
          parsed = { shadowPatterns: rawText.slice(0, 2000), healingPath: '', rawParseError: true };
        }
      }

      results[mode] = parsed;

      // Save progress incrementally
      await readingRef.update({ [mode]: parsed });
      logger.info(`[BaZiReading] ${mode} reading complete (${inputTokens + outputTokens} tokens)`);
    }

    // ─── 7. Build combined markdown ──────────────────────────────────
    const markdownParts = [`# BaZi Premium Reading \u2014 ${profileName}\n`];
    markdownParts.push(`**Birth:** ${birthDate} ${birthTime}\n`);
    markdownParts.push(`**Generated:** ${new Date().toISOString()}\n`);

    if (results.soul) {
      markdownParts.push('\n---\n');
      for (const { key, label, icon } of READING_SECTION_META) {
        if (results.soul[key]) {
          markdownParts.push(`\n## ${icon} ${label}\n\n${results.soul[key]}\n`);
        }
      }
    }

    if (results.master?.masterCommentary) {
      markdownParts.push('\n---\n\n## \uD83C\uDFAF MASTER COMMENTARY\n\n');
      markdownParts.push(results.master.masterCommentary + '\n');
    }

    if (results.shadow) {
      if (results.shadow.shadowPatterns) {
        markdownParts.push('\n---\n\n## \uD83C\uDF11 SHADOW PATTERNS\n\n');
        markdownParts.push(results.shadow.shadowPatterns + '\n');
      }
      if (results.shadow.healingPath) {
        markdownParts.push('\n## \uD83C\uDF3F HEALING PATH\n\n');
        markdownParts.push(results.shadow.healingPath + '\n');
      }
    }

    const markdown = markdownParts.join('');

    // ─── 8. Finalize Firestore document ──────────────────────────────
    await readingRef.update({
      status: 'complete',
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      model: CLAUDE_MODEL,
      markdown,
      usage: { ...usage, totalTokens },
    });

    logger.info(`[BaZiReading] All done! Total tokens: ${totalTokens}`);

    return {
      cached: false,
      status: 'complete',
      modes,
      totalTokens,
    };

  } catch (error) {
    logger.error('[BaZiReading] Error:', error.message);

    // Update Firestore with error status
    try {
      await readingRef.update({
        status: 'error',
        error: error.message,
        errorAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch { /* ignore write errors */ }

    throw error;
  }
}

module.exports = { generateBaziReading };
