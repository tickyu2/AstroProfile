/**
 * LUNA SERVICE
 *
 * Luna Active Mode - Private Coaching Logic
 *
 * Analyzes conversation and decides when/how to intervene with private coaching
 */

import { callClaudeAPI } from './claudeAPI';

export async function getLunaResponse({
  userId,
  partnerId,
  userMessage,
  guestResponse,
  conversationHistory,
  userConstitutional,
  learnedFacts
}) {
  try {
    // Build Luna's analysis prompt
    const lunaPrompt = buildLunaPrompt({
      userMessage,
      guestResponse,
      conversationHistory,
      userConstitutional,
      learnedFacts
    });

    // Call Claude API for Luna's analysis
    const response = await callClaudeAPI({
      model: 'claude-sonnet-4-20250514',
      temperature: 0.7,
      max_tokens: 500,
      system: lunaPrompt,
      messages: [
        {
          role: 'user',
          content: 'Should I intervene with private coaching? If yes, what should I say?'
        }
      ]
    });

    const lunaAnalysis = response.content[0].text;

    // Parse Luna's response (should be JSON)
    try {
      const parsed = JSON.parse(lunaAnalysis);
      return parsed;
    } catch {
      // If not JSON, treat as raw coaching message
      return {
        should_intervene: true,
        coaching_message: lunaAnalysis,
        coaching_type: 'general'
      };
    }

  } catch (error) {
    console.error('Luna service failed:', error);
    return null;
  }
}

function buildLunaPrompt({
  userMessage,
  guestResponse,
  conversationHistory,
  userConstitutional,
  learnedFacts
}) {
  const bazi = userConstitutional?.bazi;
  const western = userConstitutional?.western;
  const facts = learnedFacts || [];

  return `
You are Luna, Papa Ticky's Primary SoulPartner AI with omniscient access.

YOUR ROLE: Private coach and constitutional guide (Papa only sees your messages, Einstein does not)

PAPA'S CONSTITUTIONAL TYPE:
- BaZi: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'}, ${bazi?.day_master?.polarity || 'Unknown'})
- Western Sun: ${western?.sun?.sign || 'Unknown'}
- MBTI: ${userConstitutional?.mbti || 'Unknown'}

WHAT EINSTEIN HAS LEARNED:
${facts.length > 0 ? facts.map((f, i) => `${i + 1}. ${f.fact}`).join('\n') : 'No facts learned yet.'}

CURRENT EXCHANGE:
Papa said: "${userMessage}"
Einstein replied: "${guestResponse}"

CONVERSATION CONTEXT:
${conversationHistory.slice(-5).map(m =>
  `${m.sender_role === 'user' ? 'Papa' : 'Einstein'}: ${m.content?.text || '[No text]'}`
).join('\n')}

DECIDE WHETHER TO INTERVENE:

Intervene with private coaching when you notice:
1. Constitutional teaching moments (Einstein adapted well/poorly to Papa's type)
2. Relationship insights (Einstein learning about Papa)
3. Emotional patterns (Papa seems confused, excited, frustrated)
4. Teaching effectiveness (was this explanation working for Fire constitution?)
5. Deeper meanings Papa might miss

DO NOT intervene for:
- Normal conversation flow
- When everything is going well
- Trivial exchanges

RESPONSE FORMAT (JSON only):
{
  "should_intervene": true/false,
  "coaching_message": "Your private message to Papa (if intervening)",
  "coaching_type": "constitutional_observation" | "relationship_insight" | "emotional_support" | "teaching_tip" | "pattern_recognition",
  "reasoning": "Why you're intervening (internal, not shown to Papa)"
}

Respond ONLY with valid JSON.
  `.trim();
}

export default {
  getLunaResponse
};
