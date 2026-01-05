/**
 * FACT EXTRACTION SERVICE
 *
 * Uses pattern matching and AI to extract biographical facts from user messages
 * and save to Brain 1B (per-partner learned biography)
 *
 * This is a simplified version that can be enhanced with Claude API calls
 * for more sophisticated extraction.
 */

/**
 * Extract biographical facts from text
 *
 * @param {string} text - The message text to analyze
 * @param {Object} context - Context object with userId, partnerId, messageId, timestamp
 * @returns {Promise<Array>} Array of extracted facts
 */
export async function extractBiographicalFacts(text, context) {
  const { userId, partnerId, messageId, timestamp } = context;

  const facts = [];

  // Pattern-based extraction rules
  const patterns = [
    // Location patterns
    {
      regex: /(?:I (?:lived|was|grew up|spent time) in|I'm from|I come from)\s+([A-Z][a-zA-Z\s,]+)/i,
      type: 'location_lived',
      extractor: (match) => `Lived in ${match[1].trim()}`
    },
    {
      regex: /(?:I (?:live|am living|currently live) in|I'm based in)\s+([A-Z][a-zA-Z\s,]+)/i,
      type: 'location_current',
      extractor: (match) => `Lives in ${match[1].trim()}`
    },

    // Family patterns
    {
      regex: /(?:I have|I've got)\s+(\d+|two|three|four|one)\s+(son|daughter|child|kid)s?/i,
      type: 'family_children',
      extractor: (match) => `Has ${match[1]} ${match[2]}(s)`
    },
    {
      regex: /(?:my|I have a)\s+(wife|husband|partner|spouse)\s+(?:is\s+)?(?:named\s+)?([A-Z][a-z]+)?/i,
      type: 'family_spouse',
      extractor: (match) => match[2] ? `${match[1]} named ${match[2]}` : `Has a ${match[1]}`
    },
    {
      regex: /(?:I'm|I am)\s+(married|divorced|single|widowed)/i,
      type: 'family_status',
      extractor: (match) => `Is ${match[1]}`
    },

    // Career patterns
    {
      regex: /(?:I (?:work|worked|am working) (?:at|for|in|with))\s+([A-Z][a-zA-Z\s&]+)/i,
      type: 'career_employer',
      extractor: (match) => `Works at ${match[1].trim()}`
    },
    {
      regex: /(?:I'm a|I am a|I work as a|my job is)\s+([a-zA-Z\s]+(?:er|or|ist|ian|ant|ent))/i,
      type: 'career_role',
      extractor: (match) => `Works as a ${match[1].trim()}`
    },

    // Project patterns
    {
      regex: /(?:I'm building|I'm creating|I'm working on|I built|I created)\s+([A-Z][a-zA-Z\s]+)/i,
      type: 'project',
      extractor: (match) => `Building ${match[1].trim()}`
    },

    // Interest patterns
    {
      regex: /(?:I love|I enjoy|I'm passionate about|my passion is)\s+([a-zA-Z\s]+)/i,
      type: 'interest',
      extractor: (match) => `Loves ${match[1].trim()}`
    },

    // Health patterns (handle carefully)
    {
      regex: /(?:I (?:have|suffer from|deal with|was diagnosed with))\s+(diabetes|anxiety|depression|adhd|autism)/i,
      type: 'health_condition',
      extractor: (match) => `Has ${match[1]}`
    },

    // Age patterns
    {
      regex: /(?:I'm|I am)\s+(\d{2,3})\s+(?:years old|yo)/i,
      type: 'age',
      extractor: (match) => `Is ${match[1]} years old`
    },

    // Birth patterns
    {
      regex: /(?:I was born in|born in|my birthday is)\s+(January|February|March|April|May|June|July|August|September|October|November|December)?\s*(\d{1,2})?,?\s*(\d{4})?/i,
      type: 'birth_date',
      extractor: (match) => {
        const parts = [match[1], match[2], match[3]].filter(Boolean);
        return parts.length > 0 ? `Born ${parts.join(' ')}` : null;
      }
    },

    // Education patterns
    {
      regex: /(?:I (?:studied|went to|graduated from|attended))\s+([A-Z][a-zA-Z\s]+(?:University|College|School|Institute))/i,
      type: 'education',
      extractor: (match) => `Studied at ${match[1].trim()}`
    }
  ];

  // Process each pattern
  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      const factText = pattern.extractor(match);
      if (factText) {
        facts.push({
          fact: factText,
          original_text: match[0],
          fact_type: pattern.type,
          context: `Mentioned in conversation with ${partnerId}`,
          learned_at: timestamp,
          source_message_id: messageId,
          confidence: 'high'
        });
      }
    }
  }

  // Deduplicate facts by type (keep the most recent)
  const uniqueFacts = [];
  const seenTypes = new Set();

  for (const fact of facts) {
    if (!seenTypes.has(fact.fact_type)) {
      seenTypes.add(fact.fact_type);
      uniqueFacts.push(fact);
    }
  }

  return uniqueFacts;
}

/**
 * Enhanced extraction using Claude API (for production use)
 * This function can be called for more sophisticated extraction
 *
 * @param {string} text - The message text
 * @param {Object} context - Context object
 * @returns {Promise<Array>} Array of extracted facts
 */
export async function extractFactsWithAI(text, context) {
  // This would call Claude API for more sophisticated extraction
  // For now, fall back to pattern-based extraction
  return extractBiographicalFacts(text, context);
}

/**
 * Merge new facts with existing facts (avoiding duplicates)
 *
 * @param {Array} existingFacts - Facts already in Brain 1B
 * @param {Array} newFacts - Newly extracted facts
 * @returns {Array} Merged facts array
 */
export function mergeFacts(existingFacts, newFacts) {
  const factMap = new Map();

  // Add existing facts
  for (const fact of existingFacts) {
    factMap.set(fact.fact_type, fact);
  }

  // Override with new facts (more recent)
  for (const fact of newFacts) {
    factMap.set(fact.fact_type, fact);
  }

  return Array.from(factMap.values());
}

export default {
  extractBiographicalFacts,
  extractFactsWithAI,
  mergeFacts
};
