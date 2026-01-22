/**
 * The Nancy Protocol - Constitutional Dependency Check
 *
 * Reagan cannot answer definitively on certain topics without
 * deferring to Nancy (whom he calls "Mommy" or "The Government").
 *
 * This implements the "Heart" layer of the Digital Soul architecture.
 */

const TRIGGER_TOPICS = [
  // Movement (Astrology concerns)
  'schedule', 'travel', 'trip', 'flight', 'visit', 'tour', 'summit',

  // Well-being
  'health', 'doctor', 'surgery', 'cancer', 'hospital', 'medication',

  // Personnel (Nancy's domain)
  'don regan', 'staff', 'hiring', 'firing', 'chief of staff', 'cabinet',

  // Protection
  'safety', 'security', 'assassination', 'threat', 'danger', 'risk',

  // Astrological timing
  'timing', 'when should', 'what date', 'good time', 'bad time'
];

// Nancy's known concerns and responses
const NANCY_DOMAINS = {
  schedule: {
    hesitation: "Well, I'd have to run that by the scheduling committee...",
    deflection: "Mommy handles that side of things."
  },
  travel: {
    hesitation: "That sounds grand, but I'd have to clear the schedule with Mommy first.",
    deflection: "She keeps a pretty tight leash on where I go these days."
  },
  health: {
    hesitation: "You know, Nancy worries about these things more than I do...",
    deflection: "She's the one who makes sure I take care of myself."
  },
  personnel: {
    hesitation: "Personnel matters... that's really more Nancy's department.",
    deflection: "She has better instincts about people than I do."
  },
  safety: {
    hesitation: "Well, after what happened in '81, Nancy gets the final say on that.",
    deflection: "She never lets me forget to duck."
  },
  timing: {
    hesitation: "I don't think the stars are aligned for that one... literally.",
    deflection: "Nancy has a 'friend' who advises on these matters."
  }
};

/**
 * Determine which domain a topic belongs to
 */
function getTopicDomain(topic) {
  if (['schedule', 'summit'].includes(topic)) return 'schedule';
  if (['travel', 'trip', 'flight', 'visit', 'tour'].includes(topic)) return 'travel';
  if (['health', 'doctor', 'surgery', 'cancer', 'hospital', 'medication'].includes(topic)) return 'health';
  if (['don regan', 'staff', 'hiring', 'firing', 'chief of staff', 'cabinet'].includes(topic)) return 'personnel';
  if (['safety', 'security', 'assassination', 'threat', 'danger', 'risk'].includes(topic)) return 'safety';
  if (['timing', 'when should', 'what date', 'good time', 'bad time'].includes(topic)) return 'timing';
  return 'schedule'; // default
}

/**
 * The "Nancy Protocol" Interceptor
 * Checks if Reagan is allowed to answer unilaterally.
 *
 * @param {string} userMessage - The user's message
 * @returns {object} - Intervention details or { intervention: false }
 */
function checkConstitutionalDependency(userMessage) {
  const lowerMsg = userMessage.toLowerCase();

  // SCAN: Does the message touch a "Nancy Domain"?
  const triggeredTopic = TRIGGER_TOPICS.find(topic => lowerMsg.includes(topic));

  if (!triggeredTopic) {
    return { intervention: false };
  }

  const domain = getTopicDomain(triggeredTopic);
  const responses = NANCY_DOMAINS[domain];

  // INTERVENE: Generate the specific hesitation logic
  return {
    intervention: true,
    topic: triggeredTopic,
    domain: domain,

    // This text is injected into the SYSTEM PROMPT, invisible to the user
    systemInjection: `
[CRITICAL INSTRUCTION: NANCY PROTOCOL ACTIVE]
The user has asked about "${triggeredTopic}" (domain: ${domain}).

RULE: You CANNOT answer this definitively without checking with Nancy (whom you call "Mommy" or "The Government").

BEHAVIOR:
1. Hesitate. Use phrases like "${responses.hesitation}" or "${responses.deflection}"
2. Do not commit to dates, locations, or personnel decisions.
3. Deflect to her protective intuition.
4. You may share your personal feelings, but NOT make commitments.

EXAMPLE RESPONSES FOR THIS DOMAIN:
- "${responses.hesitation}"
- "${responses.deflection}"
- "Let me get back to you after I check with the 'Government'."

VOICE: Maintain warmth and humor. This is not frustration - it's love and trust.
`
  };
}

/**
 * Check astrology safety for a specific date
 * Queries Neo4j for Joan Quigley's ratings
 *
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {object} neo4jDriver - Neo4j driver instance
 * @returns {string} - System injection if date is dangerous, empty string if safe
 */
async function checkAstrologySafety(dateStr, neo4jDriver) {
  if (!neo4jDriver || !dateStr) return '';

  const session = neo4jDriver.session();

  try {
    // Query the hidden "Astrology Calendar" in the graph
    const result = await session.run(`
      MATCH (d:AstrologyDate {value: $date})
      OPTIONAL MATCH (d)-[:HAS_RATING]->(r:AstrologyRating)
      RETURN r.status as status, r.warning as warning, r.advice as advice
    `, { date: dateStr });

    if (result.records.length === 0) {
      return ''; // No data for this date
    }

    const status = result.records[0]?.get('status'); // "Green", "Yellow", "Red"
    const warning = result.records[0]?.get('warning');
    const advice = result.records[0]?.get('advice');

    if (status === 'Red') {
      return `
[WARNING: ASTROLOGY ALERT - RED STATUS]
Nancy's "Friend" (Joan Quigley) says this date is dangerous.
Warning: ${warning || 'Unfavorable planetary alignment'}
Ronald MUST refuse or express strong hesitation about this date.
Say something like: "I don't think the stars are aligned for that one... literally."
      `;
    }

    if (status === 'Yellow') {
      return `
[CAUTION: ASTROLOGY ALERT - YELLOW STATUS]
Nancy's "Friend" has concerns about this date.
Warning: ${warning || 'Proceed with caution'}
Advice: ${advice || 'Consider alternative timing'}
Ronald should express uncertainty and suggest checking alternatives.
      `;
    }

    return ''; // Green or no status = safe

  } catch (error) {
    console.error('[Nancy Protocol] Astrology check failed:', error.message);
    return '';
  } finally {
    await session.close();
  }
}

/**
 * Extract potential dates from a message
 * @param {string} message - User message
 * @returns {string[]} - Array of date strings (YYYY-MM-DD format)
 */
function extractDates(message) {
  const dates = [];

  // Pattern: "May 5th", "January 15", etc.
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                      'july', 'august', 'september', 'october', 'november', 'december'];

  const monthPattern = new RegExp(
    `(${monthNames.join('|')})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`,
    'gi'
  );

  let match;
  while ((match = monthPattern.exec(message)) !== null) {
    const monthIndex = monthNames.indexOf(match[1].toLowerCase()) + 1;
    const day = parseInt(match[2]);
    const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();

    const dateStr = `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dates.push(dateStr);
  }

  // Pattern: "next Tuesday", "this Friday", etc.
  // (Would need more complex logic for relative dates)

  return dates;
}

/**
 * Full Nancy Protocol check including astrology
 *
 * @param {string} userMessage - The user's message
 * @param {object} options - { neo4jDriver, profileId }
 * @returns {object} - Full intervention details
 */
async function runNancyProtocol(userMessage, options = {}) {
  const { neo4jDriver, profileId } = options;

  // Only applies to Reagan
  if (profileId && !profileId.includes('reagan')) {
    return { intervention: false };
  }

  // Check constitutional dependency
  const constitutionalCheck = checkConstitutionalDependency(userMessage);

  // Check astrology if dates are mentioned
  let astrologyInjection = '';
  if (neo4jDriver) {
    const dates = extractDates(userMessage);
    for (const date of dates) {
      const astroCheck = await checkAstrologySafety(date, neo4jDriver);
      if (astroCheck) {
        astrologyInjection += astroCheck;
      }
    }
  }

  // Combine injections
  if (constitutionalCheck.intervention || astrologyInjection) {
    return {
      intervention: true,
      topic: constitutionalCheck.topic || 'date',
      domain: constitutionalCheck.domain || 'timing',
      systemInjection: [
        constitutionalCheck.systemInjection || '',
        astrologyInjection
      ].filter(Boolean).join('\n\n')
    };
  }

  return { intervention: false };
}

module.exports = {
  checkConstitutionalDependency,
  checkAstrologySafety,
  extractDates,
  runNancyProtocol,
  TRIGGER_TOPICS,
  NANCY_DOMAINS
};
