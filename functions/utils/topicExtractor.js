/**
 * Topic Extractor Utility
 *
 * Extracts conversation topics from user and assistant messages
 * for tracking in Neo4j conversation memory.
 *
 * Can be enhanced with NLP/LLM for more sophisticated extraction.
 */

/**
 * Topic keyword patterns for detection
 * Each topic has a regex pattern to match relevant keywords
 */
const TOPIC_PATTERNS = {
  // Leadership & Politics
  leadership: /\b(lead|leader|leadership|command|decision|strategy|manage|authority|vision|inspire)\b/gi,
  politics: /\b(politic|government|congress|senate|democrat|republican|party|election|vote|campaign)\b/gi,
  economics: /\b(economy|economic|policy|tax|budget|spending|inflation|recession|growth|trade|deficit)\b/gi,
  cold_war: /\b(soviet|russia|communist|berlin|wall|gorbachev|missile|nuclear|arms|deterrence|containment)\b/gi,

  // Relationships & Family
  family: /\b(nancy|family|marriage|wife|husband|love|partner|children|son|daughter|parent)\b/gi,
  relationships: /\b(relationship|friend|ally|enemy|colleague|mentor|partnership|trust|loyalty)\b/gi,

  // Communication & Media
  communication: /\b(speak|speech|communication|message|talk|tell|address|rhetoric|debate|media)\b/gi,
  acting: /\b(act|actor|actress|film|movie|hollywood|screen|camera|role|performance|studio)\b/gi,

  // Personal Development
  adversity: /\b(challenge|difficult|struggle|overcome|resilient|hardship|crisis|survive|recovery)\b/gi,
  faith: /\b(faith|god|pray|religion|spiritual|church|believe|divine|grace|blessing)\b/gi,
  values: /\b(value|principle|moral|ethic|integrity|honor|freedom|liberty|democracy|justice)\b/gi,

  // Specific Historical Topics
  assassination: /\b(assassin|shoot|attempt|hinckley|brady|hospital|bullet|wound|surgery)\b/gi,
  alzheimers: /\b(alzheimer|memory|forget|diagnosis|disease|illness|decline|final years)\b/gi,
  ranch: /\b(ranch|rancho|santa barbara|horse|ride|clearing brush|western|cowboy)\b/gi,

  // Wisdom & Advice
  wisdom: /\b(wise|wisdom|advice|lesson|learn|experience|insight|perspective|understand)\b/gi,
  optimism: /\b(optimis|hope|positive|bright|future|believe|can do|possibility|dream)\b/gi,
  humor: /\b(joke|funny|humor|laugh|wit|amusing|comedy|lighten)\b/gi,

  // Career & Success
  career: /\b(career|job|work|profession|success|achievement|goal|ambition|accomplish)\b/gi,
  military: /\b(military|army|navy|defense|soldier|war|veteran|service|patriot)\b/gi
};

/**
 * Guest-specific topic patterns
 * Override or add topics for specific historical figures
 */
const GUEST_SPECIFIC_PATTERNS = {
  guest_ronald_reagan: {
    reagan_era: /\b(reaganomics|iran contra|star wars|sdi|strategic defense|morning in america|great communicator)\b/gi,
    soviet_leaders: /\b(gorbachev|mikhail|brezhnev|andropov|chernenko|kremlin|politburo)\b/gi,
    reagan_quotes: /\b(tear down this wall|trust but verify|shining city|evil empire|government is the problem)\b/gi
  },
  guest_nancy_reagan: {
    first_lady: /\b(first lady|white house|just say no|drug|foster grandparent|protocol)\b/gi,
    astrology: /\b(astrology|astrologer|quigley|horoscope|stars|schedule)\b/gi
  },
  guest_margaret_thatcher: {
    thatcher_era: /\b(iron lady|falklands|miners|privatization|thatcherism|british|parliament)\b/gi
  }
};

/**
 * Extract topics from user message and assistant response
 *
 * @param {string} userMessage - The user's message
 * @param {string} assistantMessage - The assistant's response
 * @param {string} guestId - Optional guest ID for guest-specific patterns
 * @returns {string[]} Array of detected topic strings
 */
function extractTopics(userMessage, assistantMessage, guestId = null) {
  const combined = `${userMessage || ''} ${assistantMessage || ''}`.toLowerCase();
  const topics = [];

  // Check base topic patterns
  for (const [topic, regex] of Object.entries(TOPIC_PATTERNS)) {
    if (regex.test(combined)) {
      topics.push(topic);
    }
    // Reset regex lastIndex after test
    regex.lastIndex = 0;
  }

  // Check guest-specific patterns if guestId provided
  if (guestId && GUEST_SPECIFIC_PATTERNS[guestId]) {
    for (const [topic, regex] of Object.entries(GUEST_SPECIFIC_PATTERNS[guestId])) {
      if (regex.test(combined)) {
        topics.push(topic);
      }
      // Reset regex lastIndex after test
      regex.lastIndex = 0;
    }
  }

  // Deduplicate and return
  return [...new Set(topics)];
}

/**
 * Extract topics with confidence scores
 *
 * @param {string} userMessage - The user's message
 * @param {string} assistantMessage - The assistant's response
 * @param {string} guestId - Optional guest ID for guest-specific patterns
 * @returns {object[]} Array of {topic, score, matchCount} objects
 */
function extractTopicsWithScores(userMessage, assistantMessage, guestId = null) {
  const combined = `${userMessage || ''} ${assistantMessage || ''}`.toLowerCase();
  const topicScores = [];

  // Check base topic patterns
  for (const [topic, regex] of Object.entries(TOPIC_PATTERNS)) {
    const matches = combined.match(regex) || [];
    if (matches.length > 0) {
      topicScores.push({
        topic,
        score: Math.min(1.0, matches.length * 0.3),
        matchCount: matches.length
      });
    }
    regex.lastIndex = 0;
  }

  // Check guest-specific patterns
  if (guestId && GUEST_SPECIFIC_PATTERNS[guestId]) {
    for (const [topic, regex] of Object.entries(GUEST_SPECIFIC_PATTERNS[guestId])) {
      const matches = combined.match(regex) || [];
      if (matches.length > 0) {
        topicScores.push({
          topic,
          score: Math.min(1.0, matches.length * 0.3 + 0.1), // Slight boost for guest-specific
          matchCount: matches.length
        });
      }
      regex.lastIndex = 0;
    }
  }

  // Sort by score descending and return
  return topicScores.sort((a, b) => b.score - a.score);
}

/**
 * Get primary topic (highest confidence)
 *
 * @param {string} userMessage - The user's message
 * @param {string} assistantMessage - The assistant's response
 * @param {string} guestId - Optional guest ID for guest-specific patterns
 * @returns {string|null} Primary topic or null if none detected
 */
function getPrimaryTopic(userMessage, assistantMessage, guestId = null) {
  const topicsWithScores = extractTopicsWithScores(userMessage, assistantMessage, guestId);
  return topicsWithScores.length > 0 ? topicsWithScores[0].topic : null;
}

/**
 * Get top N topics
 *
 * @param {string} userMessage - The user's message
 * @param {string} assistantMessage - The assistant's response
 * @param {number} n - Number of topics to return
 * @param {string} guestId - Optional guest ID for guest-specific patterns
 * @returns {string[]} Top N topic strings
 */
function getTopNTopics(userMessage, assistantMessage, n = 3, guestId = null) {
  const topicsWithScores = extractTopicsWithScores(userMessage, assistantMessage, guestId);
  return topicsWithScores.slice(0, n).map(t => t.topic);
}

/**
 * Summarize conversation topics for context injection
 *
 * @param {string[]} topics - Array of topic strings
 * @returns {string} Human-readable summary
 */
function summarizeTopics(topics) {
  if (!topics || topics.length === 0) {
    return 'general conversation';
  }

  if (topics.length === 1) {
    return formatTopicName(topics[0]);
  }

  if (topics.length === 2) {
    return `${formatTopicName(topics[0])} and ${formatTopicName(topics[1])}`;
  }

  const displayed = topics.slice(0, 3);
  const remaining = topics.length - 3;

  let summary = displayed.map(formatTopicName).join(', ');
  if (remaining > 0) {
    summary += ` and ${remaining} more topics`;
  }

  return summary;
}

/**
 * Format topic key to human-readable name
 */
function formatTopicName(topic) {
  return topic
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = {
  extractTopics,
  extractTopicsWithScores,
  getPrimaryTopic,
  getTopNTopics,
  summarizeTopics,
  TOPIC_PATTERNS,
  GUEST_SPECIFIC_PATTERNS
};
