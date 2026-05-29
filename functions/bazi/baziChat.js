/**
 * BaZi AI Chat — Cloud Function
 *
 * Multi-turn conversational BaZi chat using Claude Sonnet.
 * System prompt is pre-built on the frontend with full chart context.
 * Conversation history maintained in Firestore.
 *
 * Firestore path: profiles/{profileId}/bazi_chat/{domain}/messages/{msgId}
 */

const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');
const { logger } = require('firebase-functions');

const db = admin.firestore();

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;
const MAX_HISTORY_TURNS = 20;
const RATE_LIMIT_PER_HOUR = 30;

/**
 * Handle a BaZi chat message.
 *
 * @param {object} data
 * @param {string} data.profileId
 * @param {string} data.message - User's message text
 * @param {Array} data.conversationHistory - Previous messages [{role, content}]
 * @param {string} data.systemContext - Pre-built system prompt with chart data
 * @param {string} [data.domain] - Active domain (career, relationship, etc.)
 * @param {object} context - Firebase auth context
 */
async function handleBaZiChat(data, context) {
  if (!context.auth) {
    const { HttpsError } = require('firebase-functions/v2/https');
    throw new HttpsError('unauthenticated', 'Must be signed in');
  }
  const userId = context.auth.uid;

  const {
    profileId,
    message,
    conversationHistory = [],
    systemContext,
    domain = 'general',
  } = data;

  if (!profileId || !message || !systemContext) {
    const { HttpsError } = require('firebase-functions/v2/https');
    throw new HttpsError('invalid-argument', 'Missing profileId, message, or systemContext');
  }

  // ─── 1. Verify profile ownership ───────────────────────────────────
  const profileSnap = await db.collection('profiles').doc(profileId).get();
  if (!profileSnap.exists || profileSnap.data().userId !== userId) {
    const { HttpsError } = require('firebase-functions/v2/https');
    throw new HttpsError('permission-denied', 'Not your profile');
  }

  // ─── 2. Rate limiting ──────────────────────────────────────────────
  const now = new Date();
  const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  const rateRef = db.collection('usage').doc(userId).collection('bazi_chat_hourly').doc(hourKey);
  const rateSnap = await rateRef.get();
  const currentCount = rateSnap.exists ? (rateSnap.data().count || 0) : 0;

  if (currentCount >= RATE_LIMIT_PER_HOUR) {
    const { HttpsError } = require('firebase-functions/v2/https');
    throw new HttpsError('resource-exhausted', 'Rate limit reached (30 messages/hour). Please wait.');
  }

  // ─── 3. Build messages array for Claude ────────────────────────────
  const messages = [];

  // Add conversation history (capped)
  const history = (conversationHistory || []).slice(-MAX_HISTORY_TURNS);
  for (const msg of history) {
    if (msg.role && msg.content) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // Add current user message
  messages.push({ role: 'user', content: message });

  // ─── 4. Call Claude ────────────────────────────────────────────────
  logger.info(`[BaZiChat] Calling Claude for profile ${profileId}, domain: ${domain}`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.7,
    system: systemContext,
    messages,
  });

  const responseText = (response.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const inputTokens = response.usage?.input_tokens || 0;
  const outputTokens = response.usage?.output_tokens || 0;

  logger.info(`[BaZiChat] Response: ${inputTokens + outputTokens} tokens`);

  // ─── 5. Store in Firestore ─────────────────────────────────────────
  const convRef = db.collection('profiles').doc(profileId)
    .collection('bazi_chat').doc(domain);

  const msgCol = convRef.collection('messages');
  const batch = db.batch();

  // User message
  batch.set(msgCol.doc(), {
    role: 'user',
    content: message,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Assistant response
  batch.set(msgCol.doc(), {
    role: 'assistant',
    content: responseText,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    tokens: { input: inputTokens, output: outputTokens },
  });

  // Update conversation metadata
  batch.set(convRef, {
    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
    domain,
    messageCount: admin.firestore.FieldValue.increment(2),
    profileName: profileSnap.data().displayName || profileSnap.data().firstName || '',
  }, { merge: true });

  // Rate limit counter
  batch.set(rateRef, {
    count: admin.firestore.FieldValue.increment(1),
    lastAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await batch.commit();

  // ─── 6. Return ─────────────────────────────────────────────────────
  return {
    response: responseText,
    domain,
    usage: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
  };
}

module.exports = { handleBaZiChat };
