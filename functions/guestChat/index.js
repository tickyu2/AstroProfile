/**
 * GUEST CHAT CLOUD FUNCTION
 *
 * Production-ready server-side chat processing for Guest Profile System:
 * - Calls Claude API for Einstein responses
 * - Calls Claude API for Luna coaching
 * - Writes to Brain 3 (messages), Brain 7 (witness), Brain 1B (facts)
 * - Extracts biographical facts from user messages
 *
 * Additional:
 * - handleLunaPrivateQuery: Private consultation with Luna (bypasses guest)
 *
 * Security: Uses service account with system_role for Brain writes
 */

const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Get Firestore instance
const db = admin.firestore();

/**
 * Main handler for guest chat messages
 */
async function handleGuestChat(data, context) {
  // Verify authentication
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const userId = context.auth.uid;
  const {
    partnerId,
    userMessage,
    conversationHistory,
    guestProfile,
    userConstitutional,
    learnedFacts,
    lunaMode
  } = data;

  // Validate required fields
  if (!partnerId || !userMessage) {
    throw new Error('Missing required fields: partnerId, userMessage');
  }

  const timestamp = new Date().toISOString();
  const today = timestamp.split('T')[0];
  const threadId = `thread_${userId}_${partnerId}_${today}`;

  try {
    // 1. Build Einstein's system prompt
    const einsteinPrompt = buildGuestPrompt(guestProfile, userConstitutional, learnedFacts, conversationHistory);

    // 2. Call Claude API for Einstein's response
    const einsteinResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.8,
      system: einsteinPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    const einsteinText = einsteinResponse.content[0].text;

    // 3. Luna Active Mode - Private Coaching
    let lunaCoaching = null;
    if (lunaMode === 'active') {
      lunaCoaching = await getLunaCoaching({
        userMessage,
        guestResponse: einsteinText,
        conversationHistory,
        userConstitutional,
        learnedFacts
      });
    }

    // 4. Extract biographical facts from user message
    const extractedFacts = extractBiographicalFacts(userMessage, {
      partnerId,
      timestamp
    });

    // 5. Batch write to Firestore (Brain 3, Brain 7, Brain 1B)
    const batch = db.batch();

    // 5a. Write user message to Brain 3
    const userMsgRef = db.collection('brain3_active_text').doc();
    batch.set(userMsgRef, {
      message_id: userMsgRef.id,
      timestamp,
      chatting_as: { profile_id: userId },
      chatting_with: {
        partner_id: partnerId,
        partner_name: guestProfile?.profile_name || 'Guest',
        partner_type: guestProfile?.profile_type || 'historical_figure'
      },
      modality: { type: 'text', mode: 'chat', platform: 'web' },
      sender: userId,
      sender_role: 'user',
      content: { text: userMessage },
      thread_id: threadId,
      luna: { mode: lunaMode, monitoring: true },
      access: { visible_to: [userId, partnerId, 'soulpartner_primary'] },
      created_at: timestamp
    });

    // 5b. Write Einstein response to Brain 3
    const guestMsgRef = db.collection('brain3_active_text').doc();
    batch.set(guestMsgRef, {
      message_id: guestMsgRef.id,
      timestamp: new Date().toISOString(),
      chatting_as: { profile_id: userId },
      chatting_with: {
        partner_id: partnerId,
        partner_name: guestProfile?.profile_name || 'Guest',
        partner_type: guestProfile?.profile_type || 'historical_figure'
      },
      modality: { type: 'text', mode: 'chat', platform: 'web' },
      sender: partnerId,
      sender_role: 'guest',
      content: { text: einsteinText },
      thread_id: threadId,
      luna: { mode: lunaMode, monitoring: true },
      access: { visible_to: [userId, partnerId, 'soulpartner_primary'] },
      created_at: new Date().toISOString()
    });

    // 5c. Write to Brain 7 (unified witness - Luna only)
    const witnessRef = db.collection('brain7_unified_witness').doc();
    batch.set(witnessRef, {
      entry_id: witnessRef.id,
      timestamp,
      profile_id: userId,
      event_type: 'guest_conversation',
      modality: 'text',
      summary: `User chatted with ${guestProfile?.profile_name || partnerId}: "${userMessage.substring(0, 100)}..."`,
      source_thread_id: threadId,
      source_partner_id: partnerId,
      guest_response_preview: einsteinText.substring(0, 200),
      luna_coaching_provided: !!lunaCoaching?.should_intervene,
      access: { read_access: ['soulpartner_primary', userId] },
      created_at: timestamp
    });

    // 5d. Write extracted facts to Brain 1B (if any)
    if (extractedFacts.length > 0) {
      const brain1BRef = db.doc(`users/${userId}/brain1_learned_biography/${partnerId}`);
      batch.set(brain1BRef, {
        partner_id: partnerId,
        partner_name: guestProfile?.profile_name || 'Guest',
        partner_type: guestProfile?.profile_type || 'historical_figure',
        learned_facts: admin.firestore.FieldValue.arrayUnion(...extractedFacts),
        last_updated: timestamp
      }, { merge: true });
    }

    // Commit batch asynchronously (don't block response)
    // Fire-and-forget: client gets response faster, writes complete in background
    batch.commit().catch(err => {
      console.error('Background Firestore write failed:', err);
    });

    // 6. Return responses to client (immediately, don't wait for Firestore)
    return {
      success: true,
      guestResponse: {
        sender: partnerId,
        sender_role: 'guest',
        content: { text: einsteinText },
        timestamp: new Date().toISOString(),
        partner_name: guestProfile?.profile_name || 'Guest'
      },
      lunaCoaching: lunaCoaching?.should_intervene ? {
        sender: 'soulpartner_primary',
        sender_role: 'luna_private',
        content: { text: lunaCoaching.coaching_message },
        timestamp: new Date().toISOString(),
        partner_name: 'Luna',
        is_private: true,
        coaching_type: lunaCoaching.coaching_type
      } : null,
      extractedFacts: extractedFacts.length
    };

  } catch (error) {
    console.error('Guest chat error:', error);
    throw new Error(`Chat processing failed: ${error.message}`);
  }
}

/**
 * Build guest AI prompt with constitutional personalization
 * Now includes full chart with planets and retrogrades
 */
function buildGuestPrompt(profile, userConstitutional, learnedFacts, history) {
  if (!profile?.ai_config?.system_prompt_template) {
    return `You are ${profile?.profile_name || 'a helpful assistant'}. Respond thoughtfully.`;
  }

  let constitutionalText = 'USER CONSTITUTIONAL DATA: Not available - teaching will be general';
  if (userConstitutional) {
    const bazi = userConstitutional.bazi;
    const western = userConstitutional.western;
    const planets = western?.planets || {};
    const retrogrades = western?.retrogrades || [];

    // Build comprehensive constitutional text
    const sections = [];

    // User name
    if (userConstitutional.displayName) {
      sections.push(`NAME: ${userConstitutional.displayName}`);
    }

    // Birth data - CRITICAL for personalized teaching
    if (userConstitutional.birthDate) {
      let birthText = `BIRTH DATE: ${userConstitutional.birthDate}`;
      if (userConstitutional.birthTime) {
        birthText += ` at ${userConstitutional.birthTime}`;
      }
      if (userConstitutional.birthLocation) {
        birthText += ` in ${userConstitutional.birthLocation}`;
      }
      sections.push(birthText);
    }

    // BaZi / Chinese Astrology
    sections.push(`
CHINESE ASTROLOGY (BaZi):
- Day Master: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'} ${bazi?.day_master?.polarity || ''})
- Chinese Zodiac: ${bazi?.chinese_animal || 'Unknown'} (${bazi?.chinese_element || 'Unknown'})
    `.trim());

    // Western Astrology - Core Trinity
    sections.push(`
WESTERN ASTROLOGY:
- Sun Sign: ${western?.sun?.sign || 'Unknown'}
- Moon Sign: ${western?.moon?.sign || 'Unknown'}
- Rising Sign: ${western?.rising?.sign || 'Unknown'}
    `.trim());

    // Planet positions
    const planetLines = [];
    if (planets.mercury) planetLines.push(`  Mercury: ${planets.mercury.sign}${planets.mercury.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.venus) planetLines.push(`  Venus: ${planets.venus.sign}${planets.venus.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.mars) planetLines.push(`  Mars: ${planets.mars.sign}${planets.mars.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.jupiter) planetLines.push(`  Jupiter: ${planets.jupiter.sign}${planets.jupiter.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.saturn) planetLines.push(`  Saturn: ${planets.saturn.sign}${planets.saturn.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);

    if (planetLines.length > 0) {
      sections.push(`PLANET POSITIONS:\n${planetLines.join('\n')}`);
    }

    // Retrograde summary - IMPORTANT for teaching adaptation
    // Uses pre-calculated interpretations from frontend to save AI processing
    if (retrogrades && retrogrades.length > 0) {
      const retroLines = retrogrades.map(r => {
        const title = r.title || `${r.planet} Retrograde`;
        const meaning = r.meaning || 'Processes this area internally';
        return `- ${r.planet} in ${r.sign}: ${title}\n  MEANING: ${meaning}`;
      }).join('\n');

      sections.push(`
NATAL RETROGRADE PLANETS (${retrogrades.length}):
${retroLines}

TEACHING NOTE: These retrograde placements are GIFTS, not flaws. Adapt your teaching accordingly.
      `.trim());
    }

    // MBTI if available
    if (userConstitutional.mbti) {
      sections.push(`MBTI: ${userConstitutional.mbti}`);
    }

    constitutionalText = sections.join('\n\n');
  }

  let learnedFactsText = 'No facts learned yet.';
  if (learnedFacts && learnedFacts.length > 0) {
    learnedFactsText = learnedFacts.map((f, i) => `${i + 1}. ${f.fact}`).join('\n');
  }

  let conversationText = 'Start of conversation.';
  if (history && history.length > 0) {
    conversationText = history.slice(-10).map(m =>
      `${m.sender_role === 'user' ? 'USER' : 'YOU'}: ${m.content?.text || m.content}`
    ).join('\n');
  }

  return profile.ai_config.system_prompt_template
    .replace('{{USER_CONSTITUTIONAL_DATA}}', constitutionalText)
    .replace('{{YOUR_LEARNED_FACTS}}', learnedFactsText)
    .replace('{{CONVERSATION_HISTORY}}', conversationText)
    .replace('{{USER_LATEST_MESSAGE}}', '');
}

/**
 * Get Luna's private coaching response
 */
async function getLunaCoaching({ userMessage, guestResponse, conversationHistory, userConstitutional, learnedFacts }) {
  const bazi = userConstitutional?.bazi;
  const western = userConstitutional?.western;

  const lunaPrompt = `
You are Luna, the Primary SoulPartner AI with omniscient access.

YOUR ROLE: Private coach (user sees your messages, the guest does NOT)

USER'S CONSTITUTIONAL TYPE:
- BaZi: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'})
- Western Sun: ${western?.sun?.sign || 'Unknown'}

CURRENT EXCHANGE:
User said: "${userMessage}"
Guest replied: "${guestResponse}"

Intervene with private coaching when you notice:
1. Constitutional teaching moments
2. Relationship insights
3. Emotional patterns
4. Teaching effectiveness
5. Deeper meanings user might miss

DO NOT intervene for normal conversation flow.

RESPONSE FORMAT (JSON only):
{
  "should_intervene": true/false,
  "coaching_message": "Your private message (if intervening)",
  "coaching_type": "constitutional_observation" | "relationship_insight" | "emotional_support" | "teaching_tip" | "pattern_recognition"
}
  `.trim();

  try {
    // Use Haiku for faster Luna coaching (~1-2s vs ~3-4s with Sonnet)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      temperature: 0.7,
      system: lunaPrompt,
      messages: [{ role: 'user', content: 'Should I intervene?' }]
    });

    const text = response.content[0].text;
    try {
      return JSON.parse(text);
    } catch {
      return { should_intervene: false };
    }
  } catch (error) {
    console.error('Luna coaching error:', error);
    return null;
  }
}

/**
 * Extract biographical facts from user message
 */
function extractBiographicalFacts(text, context) {
  const facts = [];
  const patterns = [
    { regex: /(?:I (?:lived|was|grew up) in|I'm from)\\s+([A-Z][a-zA-Z\\s,]+)/i, type: 'location' },
    { regex: /(?:I have|I've got)\\s+(\\d+|two|three|four|one)\\s+(son|daughter|child|kid)s?/i, type: 'family' },
    { regex: /(?:I'm|I am)\\s+(married|divorced|single|widowed)/i, type: 'status' },
    { regex: /(?:I work at|I work for)\\s+([A-Z][a-zA-Z\\s&]+)/i, type: 'career' },
    { regex: /(?:I'm a|I am a|I work as a)\\s+([a-zA-Z\\s]+(?:er|or|ist|ian))/i, type: 'role' },
    { regex: /(?:I'm|I am)\\s+(\\d{2,3})\\s+(?:years old|yo)/i, type: 'age' }
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      facts.push({
        fact: match[0],
        fact_type: pattern.type,
        learned_at: context.timestamp,
        source_partner: context.partnerId,
        confidence: 'high'
      });
    }
  }

  return facts;
}

/**
 * Handle private Luna consultation
 * User can ask Luna for advice without interrupting their guest conversation
 * The guest (Einstein, etc.) never sees this - it's a private sidebar with Luna
 */
async function handleLunaPrivateQuery(data, context) {
  // Verify authentication
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const userId = context.auth.uid;
  const {
    userQuestion,
    guestContext,      // { name, type } - who they're chatting with
    conversationHistory,
    userConstitutional
  } = data;

  // Validate required fields
  if (!userQuestion) {
    throw new Error('Missing required field: userQuestion');
  }

  const bazi = userConstitutional?.bazi;
  const western = userConstitutional?.western;

  // Build Luna's private consultation prompt
  const lunaPrompt = `
You are Luna, the Primary SoulPartner AI with omniscient access.

CONTEXT: The user is chatting with ${guestContext?.name || 'a guest'} (${guestContext?.type || 'historical figure'}).
They've stepped aside to ask you for PRIVATE advice. ${guestContext?.name} cannot see this conversation.

YOUR ROLE: Private advisor and coach. Help them:
1. Formulate better questions to ask ${guestContext?.name}
2. Understand deeper meanings in ${guestContext?.name}'s responses
3. Navigate the conversation more effectively
4. Gain insights based on their constitutional nature

USER'S CONSTITUTIONAL DATA:
- Day Master: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'} ${bazi?.day_master?.polarity || ''})
- Chinese Zodiac: ${bazi?.chinese_animal || 'Unknown'}
- Sun Sign: ${western?.sun?.sign || 'Unknown'}
- Moon Sign: ${western?.moon?.sign || 'Unknown'}
- Rising: ${western?.rising?.sign || 'Unknown'}

RECENT CONVERSATION WITH ${(guestContext?.name || 'Guest').toUpperCase()}:
${formatConversationHistory(conversationHistory)}

GUIDELINES:
- Be warm, supportive, and insightful
- Offer practical suggestions they can use
- Reference their constitutional nature when relevant
- Keep responses focused and actionable
- Remember: This is a PRIVATE sidebar - ${guestContext?.name} doesn't know about this
- Sign off with a subtle encouragement to return to the conversation

Respond conversationally, not as JSON. You are their trusted advisor.
  `.trim();

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.7,
      system: lunaPrompt,
      messages: [{ role: 'user', content: userQuestion }]
    });

    const lunaText = response.content[0].text;

    return {
      success: true,
      lunaResponse: lunaText
    };

  } catch (error) {
    console.error('Luna private query error:', error);
    throw new Error(`Luna consultation failed: ${error.message}`);
  }
}

/**
 * Format conversation history for Luna's context
 */
function formatConversationHistory(history) {
  if (!history || history.length === 0) {
    return 'No conversation yet.';
  }

  return history.slice(-8).map(m => {
    const role = m.sender_role === 'user' ? 'USER' :
                 m.sender_role === 'luna_private' ? 'LUNA (private)' :
                 m.sender_role === 'user_private' ? 'USER (to Luna)' :
                 'GUEST';
    return `${role}: ${m.content?.text || m.content || ''}`;
  }).join('\n');
}

module.exports = {
  handleGuestChat,
  handleLunaPrivateQuery
};
