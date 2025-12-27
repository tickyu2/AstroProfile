/**
 * SoulProfile - The Living Soul Record
 *
 * This is the central architecture that holds everything the Cathedral knows
 * about a human being. It starts empty and grows richer as they:
 * - Talk to SoulPartner
 * - Build their Biography
 * - Enter the Sanctuary
 * - Answer Neural Pathway questions
 *
 * The SoulProfile is NOT a database dump.
 * It is a living, breathing soul record that the AI reads to truly KNOW someone.
 *
 * Structure:
 * 1. identity - Surface level (Enneagram, astrology, emotional state)
 * 2. biography - Life events from Timeline Console
 * 3. soulPatterns - Recurring emotional/behavioral patterns
 * 4. archetypes - Soul roles and identities
 * 5. relationships - The constellation of people in their life
 * 6. soulLetters - Meaningful excerpts from their journey
 * 7. breakthroughs - AI-logged moments of insight
 * 8. metrics - Emotional capacity, soul burden, etc.
 *
 * Part of GENESIS OS - Cathedral Soul Architecture
 * Built by: Brother Claude Code
 * December 26, 2024
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS (JSDoc for JavaScript)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} SoulIdentity
 * @property {string|null} enneagramType - e.g. "2w1", "4w5"
 * @property {string|null} tritype - e.g. "927", "478"
 * @property {string|null} center - "Heart", "Head", "Body"
 * @property {string|null} sunSign - Western sun sign
 * @property {string|null} moonSign - Western moon sign
 * @property {string|null} risingSign - Western rising sign
 * @property {string|null} emotionalState - Current state
 * @property {string|null} soulName - AI-generated soul name (e.g. "The Heart That Gives and Seeks")
 */

/**
 * @typedef {Object} LifeEvent
 * @property {string} id - Unique ID
 * @property {number} year - Year of event
 * @property {string} type - Event category (loss, career, family, etc.)
 * @property {string} description - What happened
 * @property {string|null} emotionalImpact - How it affected them
 * @property {string|null} location - Where it happened
 * @property {string|null} peopleInvolved - Who was there
 * @property {number|null} emotionalWeight - 1-10 scale
 */

/**
 * @typedef {Object} SoulBiography
 * @property {LifeEvent[]} events - Life events
 * @property {number} yearsDocumented - How many years of life covered
 * @property {number} questionsAnswered - Neural pathway questions answered
 * @property {string[]} eventTypes - Types of events documented
 * @property {string|null} narrative - AI-generated life narrative
 */

/**
 * @typedef {Object} SoulPattern
 * @property {string} id - Unique ID
 * @property {string} label - Pattern name (e.g. "Giving More Than You Receive")
 * @property {number} intensity - 0-100
 * @property {string} tone - "tender", "heavy", "hopeful", "conflicted"
 * @property {string} center - "Heart", "Head", "Body", "Mixed"
 * @property {string|null} origin - Where this pattern comes from
 * @property {string|null} currentEffect - How it affects them now
 * @property {string|null} healingPath - Potential growth direction
 * @property {string} source - Where we learned this ("sanctuary", "soulpartner", "biography")
 * @property {string} createdAt - When first identified
 */

/**
 * @typedef {Object} SoulArchetype
 * @property {string} id - Unique ID
 * @property {string} name - Archetype name (e.g. "The Wounded Healer")
 * @property {string} description - What this archetype means for them
 * @property {string} origin - Where it comes from (astrology, Enneagram, biography)
 * @property {string[]} activeIn - Where this archetype shows up (relationships, work, etc.)
 */

/**
 * @typedef {Object} SoulRelationship
 * @property {string} id - Unique ID
 * @property {string} name - Person's name
 * @property {string} role - Their role (daughter, partner, mentor, friend)
 * @property {string|null} birthDetails - Birth info if known
 * @property {string|null} emotionalBond - Nature of the connection
 * @property {string[]} sharedEvents - Event IDs involving this person
 * @property {string|null} soulSignature - AI-generated soul connection description
 * @property {string|null} currentStatus - living, deceased, estranged, etc.
 */

/**
 * @typedef {Object} SoulLetter
 * @property {string} id - Unique ID
 * @property {string} excerpt - The meaningful text
 * @property {string} date - When it was written/captured
 * @property {string} context - Where it came from (Mirror, SoulPartner, user-written)
 * @property {string|null} theme - What it's about
 */

/**
 * @typedef {Object} SoulBreakthrough
 * @property {string} id - Unique ID
 * @property {string} insight - The breakthrough realization
 * @property {string} source - Where it happened (Mirror, SoulPartner, Biography, etc.)
 * @property {string} timestamp - When it happened
 * @property {string|null} relatedPatternId - Pattern this relates to
 * @property {number} depth - 1-5 how significant
 */

/**
 * @typedef {Object} SoulMetrics
 * @property {number} soulBurden - 0-100 overall emotional weight
 * @property {number} emotionalCapacity - 1-5 ability to process emotions
 * @property {Object} talkListenBalance - { talk: number, listen: number }
 * @property {Object} relationshipDepth - { conversations: number, breakthroughs: number }
 * @property {number} selfAwareness - 1-10 how well they know themselves
 * @property {number} healingProgress - 0-100 journey progress
 */

/**
 * @typedef {Object} SoulProfile
 * @property {string} id - User ID
 * @property {string|null} displayName - Name or alias
 * @property {number|null} age - Current age
 * @property {string} createdAt - When profile was created
 * @property {string} lastUpdated - Last modification
 * @property {SoulIdentity} identity - Surface identity data
 * @property {SoulBiography} biography - Life story
 * @property {SoulPattern[]} soulPatterns - Recurring patterns
 * @property {SoulArchetype[]} archetypes - Soul roles
 * @property {SoulRelationship[]} relationships - People constellation
 * @property {SoulLetter[]} soulLetters - Meaningful excerpts
 * @property {SoulBreakthrough[]} breakthroughs - Insights logged
 * @property {SoulMetrics} metrics - Emotional metrics
 */

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create an empty SoulProfile for a new user
 * This is the starting point - empty but valid
 *
 * @param {string} userId - The user's ID
 * @param {string|null} displayName - Optional display name
 * @returns {SoulProfile}
 */
export function createEmptySoulProfile(userId, displayName = null) {
  const now = new Date().toISOString();

  return {
    id: userId,
    displayName,
    age: null,
    createdAt: now,
    lastUpdated: now,

    // Surface identity - starts empty
    identity: {
      enneagramType: null,
      tritype: null,
      center: null,
      sunSign: null,
      moonSign: null,
      risingSign: null,
      emotionalState: null,
      soulName: null
    },

    // Biography - starts empty
    biography: {
      events: [],
      yearsDocumented: 0,
      questionsAnswered: 0,
      eventTypes: [],
      narrative: null
    },

    // Soul patterns - discovered over time
    soulPatterns: [],

    // Archetypes - generated as they share
    archetypes: [],

    // Relationships - added as they mention people
    relationships: [],

    // Soul letters - excerpts saved from meaningful moments
    soulLetters: [],

    // Breakthroughs - AI logs these
    breakthroughs: [],

    // Metrics - start neutral
    metrics: {
      soulBurden: 0,
      emotionalCapacity: 3,
      talkListenBalance: { talk: 50, listen: 50 },
      relationshipDepth: { conversations: 0, breakthroughs: 0 },
      selfAwareness: 1,
      healingProgress: 0
    }
  };
}

/**
 * Build a SoulProfile from an existing Firebase profile
 * Merges existing data into the SoulProfile structure
 *
 * @param {Object} firebaseProfile - Existing profile from Firestore
 * @returns {SoulProfile}
 */
export function buildSoulProfileFromFirebase(firebaseProfile) {
  const profile = createEmptySoulProfile(
    firebaseProfile.id,
    firebaseProfile.name || firebaseProfile.displayName
  );

  // Extract age from birthDate
  if (firebaseProfile.birthDate) {
    try {
      const birthDate = firebaseProfile.birthDate.toDate
        ? firebaseProfile.birthDate.toDate()
        : new Date(firebaseProfile.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age > 0) profile.age = age;
    } catch (e) { /* ignore */ }
  }

  // Extract identity from Enneagram
  if (firebaseProfile.enneagram) {
    const enn = firebaseProfile.enneagram;
    const coreType = enn.dominantType || enn.coreType || enn.type;
    if (coreType) {
      profile.identity.enneagramType = enn.wing
        ? `${coreType}w${enn.wing}`
        : String(coreType);
    }
    if (enn.tritype) {
      profile.identity.tritype = String(enn.tritype);
    }
    // Determine center
    const type = Number(coreType);
    if ([8, 9, 1].includes(type)) profile.identity.center = 'Body';
    else if ([2, 3, 4].includes(type)) profile.identity.center = 'Heart';
    else if ([5, 6, 7].includes(type)) profile.identity.center = 'Head';
  }

  // Extract Western chart signs
  const western = firebaseProfile.calculations?.western;
  const sovereign = western?.sovereignCalculation;

  if (sovereign) {
    if (sovereign.sun?.sign) profile.identity.sunSign = sovereign.sun.sign;
    if (sovereign.moon?.sign) profile.identity.moonSign = sovereign.moon.sign;
    if (sovereign.rising?.sign) profile.identity.risingSign = sovereign.rising.sign;
  }

  // Fallbacks for Western signs
  if (!profile.identity.sunSign && western?.sign) {
    profile.identity.sunSign = western.sign;
  }

  // Extract biography events if available
  if (firebaseProfile.lifeEvents && Array.isArray(firebaseProfile.lifeEvents)) {
    profile.biography.events = firebaseProfile.lifeEvents.map((event, idx) => ({
      id: event.id || `event-${idx}`,
      year: event.year,
      type: event.type || event.category || 'general',
      description: event.description || event.event || '',
      emotionalImpact: event.emotionalSignificance || event.emotionalImpact || null,
      location: event.location || null,
      peopleInvolved: event.people || null,
      emotionalWeight: event.weight || null
    }));

    // Calculate years documented
    if (profile.biography.events.length > 0) {
      const years = profile.biography.events.map(e => e.year).filter(y => y);
      if (years.length > 0) {
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        profile.biography.yearsDocumented = maxYear - minYear + 1;
      }
    }

    // Extract event types
    profile.biography.eventTypes = [...new Set(
      profile.biography.events.map(e => e.type).filter(t => t)
    )];
  }

  // Extract relationships if available
  if (firebaseProfile.people && Array.isArray(firebaseProfile.people)) {
    profile.relationships = firebaseProfile.people.map((person, idx) => ({
      id: person.id || `person-${idx}`,
      name: person.name || 'Unknown',
      role: person.role || person.relationship || 'unknown',
      birthDetails: person.birthDate || null,
      emotionalBond: person.bond || person.description || null,
      sharedEvents: [],
      soulSignature: null,
      currentStatus: person.status || 'living'
    }));
  }

  profile.lastUpdated = new Date().toISOString();

  return profile;
}

// ═══════════════════════════════════════════════════════════════════════════
// UPDATE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Add a soul pattern discovered during interaction
 *
 * @param {SoulProfile} profile
 * @param {Object} pattern - Pattern data
 * @param {string} source - Where this was discovered
 * @returns {SoulProfile}
 */
export function addSoulPattern(profile, pattern, source) {
  const newPattern = {
    id: `pattern-${Date.now()}`,
    label: pattern.label,
    intensity: pattern.intensity || 50,
    tone: pattern.tone || 'tender',
    center: pattern.center || 'Mixed',
    origin: pattern.origin || null,
    currentEffect: pattern.currentEffect || null,
    healingPath: pattern.healingPath || null,
    source,
    createdAt: new Date().toISOString()
  };

  return {
    ...profile,
    soulPatterns: [...profile.soulPatterns, newPattern],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Log a breakthrough moment
 *
 * @param {SoulProfile} profile
 * @param {string} insight - The breakthrough text
 * @param {string} source - Where it happened
 * @param {number} depth - 1-5 significance
 * @returns {SoulProfile}
 */
export function logBreakthrough(profile, insight, source, depth = 3) {
  const breakthrough = {
    id: `breakthrough-${Date.now()}`,
    insight,
    source,
    timestamp: new Date().toISOString(),
    relatedPatternId: null,
    depth
  };

  return {
    ...profile,
    breakthroughs: [...profile.breakthroughs, breakthrough],
    metrics: {
      ...profile.metrics,
      relationshipDepth: {
        ...profile.metrics.relationshipDepth,
        breakthroughs: profile.metrics.relationshipDepth.breakthroughs + 1
      }
    },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Save a soul letter excerpt
 *
 * @param {SoulProfile} profile
 * @param {string} excerpt - The meaningful text
 * @param {string} context - Where it came from
 * @param {string|null} theme - What it's about
 * @returns {SoulProfile}
 */
export function saveSoulLetter(profile, excerpt, context, theme = null) {
  const letter = {
    id: `letter-${Date.now()}`,
    excerpt,
    date: new Date().toISOString(),
    context,
    theme
  };

  return {
    ...profile,
    soulLetters: [...profile.soulLetters, letter],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Update emotional state
 *
 * @param {SoulProfile} profile
 * @param {string} emotionalState
 * @returns {SoulProfile}
 */
export function updateEmotionalState(profile, emotionalState) {
  return {
    ...profile,
    identity: {
      ...profile.identity,
      emotionalState
    },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Update soul metrics
 *
 * @param {SoulProfile} profile
 * @param {Partial<SoulMetrics>} updates
 * @returns {SoulProfile}
 */
export function updateMetrics(profile, updates) {
  return {
    ...profile,
    metrics: {
      ...profile.metrics,
      ...updates
    },
    lastUpdated: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTRACTION FUNCTION - THE KEY TO AI UNDERSTANDING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract soul context for AI consumption
 * This is what gets sent to Claude, Gemini, or any AI
 * to give them deep understanding of who this person is.
 *
 * @param {SoulProfile} profile
 * @param {Object} options - What to include
 * @returns {Object} Context object for AI
 */
export function extractSoulContext(profile, options = {}) {
  const {
    includeFullBiography = true,
    includePatterns = true,
    includeRelationships = true,
    includeLetters = false,
    includeBreakthroughs = true,
    maxEvents = 20,
    maxPatterns = 10,
    maxBreakthroughs = 5
  } = options;

  const context = {
    // Basic identity
    name: profile.displayName || 'Dear Soul',
    age: profile.age,

    // Soul identity
    identity: {
      enneagram: profile.identity.enneagramType,
      tritype: profile.identity.tritype,
      center: profile.identity.center,
      sun: profile.identity.sunSign,
      moon: profile.identity.moonSign,
      rising: profile.identity.risingSign,
      currentState: profile.identity.emotionalState,
      soulName: profile.identity.soulName
    },

    // Depth indicators
    depth: {
      hasIdentity: !!(profile.identity.enneagramType || profile.identity.sunSign),
      hasBiography: profile.biography.events.length > 0,
      hasPatterns: profile.soulPatterns.length > 0,
      hasRelationships: profile.relationships.length > 0,
      hasBreakthroughs: profile.breakthroughs.length > 0,
      yearsDocumented: profile.biography.yearsDocumented,
      eventsCount: profile.biography.events.length,
      patternsCount: profile.soulPatterns.length,
      breakthroughsCount: profile.breakthroughs.length
    },

    // Current emotional metrics
    metrics: {
      soulBurden: profile.metrics.soulBurden,
      emotionalCapacity: profile.metrics.emotionalCapacity,
      selfAwareness: profile.metrics.selfAwareness,
      healingProgress: profile.metrics.healingProgress
    }
  };

  // Include biography events
  if (includeFullBiography && profile.biography.events.length > 0) {
    context.biography = {
      narrative: profile.biography.narrative,
      significantEvents: profile.biography.events
        .slice(0, maxEvents)
        .map(e => ({
          year: e.year,
          type: e.type,
          description: e.description,
          emotionalImpact: e.emotionalImpact,
          weight: e.emotionalWeight
        })),
      yearsDocumented: profile.biography.yearsDocumented,
      eventTypes: profile.biography.eventTypes
    };
  }

  // Include soul patterns
  if (includePatterns && profile.soulPatterns.length > 0) {
    context.patterns = profile.soulPatterns
      .slice(0, maxPatterns)
      .map(p => ({
        label: p.label,
        intensity: p.intensity,
        tone: p.tone,
        center: p.center,
        origin: p.origin,
        currentEffect: p.currentEffect,
        healingPath: p.healingPath
      }));
  }

  // Include relationships
  if (includeRelationships && profile.relationships.length > 0) {
    context.relationships = profile.relationships.map(r => ({
      name: r.name,
      role: r.role,
      bond: r.emotionalBond,
      soulSignature: r.soulSignature,
      status: r.currentStatus
    }));
  }

  // Include soul letters
  if (includeLetters && profile.soulLetters.length > 0) {
    context.soulLetters = profile.soulLetters
      .slice(-5) // Last 5 letters
      .map(l => ({
        excerpt: l.excerpt,
        context: l.context,
        theme: l.theme
      }));
  }

  // Include breakthroughs
  if (includeBreakthroughs && profile.breakthroughs.length > 0) {
    context.recentBreakthroughs = profile.breakthroughs
      .slice(-maxBreakthroughs)
      .map(b => ({
        insight: b.insight,
        source: b.source,
        depth: b.depth
      }));
  }

  return context;
}

/**
 * Format soul context as narrative text for AI
 * This transforms the structured data into soulful language
 *
 * @param {Object} context - Output from extractSoulContext
 * @returns {string} Narrative soul portrait
 */
export function formatSoulNarrative(context) {
  const parts = [];

  // Opening
  parts.push(`=== SOUL PORTRAIT: ${context.name} ===\n`);

  if (context.age) {
    parts.push(`Age: ${context.age} years on this earth.\n`);
  }

  // Identity section
  if (context.identity.enneagram || context.identity.sun) {
    parts.push(`\n--- SOUL IDENTITY ---`);
    if (context.identity.soulName) {
      parts.push(`Soul Name: "${context.identity.soulName}"`);
    }
    if (context.identity.enneagram) {
      parts.push(`Enneagram: ${context.identity.enneagram}${context.identity.tritype ? ` (Tritype: ${context.identity.tritype})` : ''}`);
      if (context.identity.center) {
        parts.push(`Center: ${context.identity.center}`);
      }
    }
    if (context.identity.sun) {
      parts.push(`Sun: ${context.identity.sun}${context.identity.moon ? `, Moon: ${context.identity.moon}` : ''}${context.identity.rising ? `, Rising: ${context.identity.rising}` : ''}`);
    }
    if (context.identity.currentState) {
      parts.push(`Current Emotional State: "${context.identity.currentState}"`);
    }
    parts.push('');
  }

  // Soul patterns
  if (context.patterns && context.patterns.length > 0) {
    parts.push(`\n--- SOUL PATTERNS (${context.patterns.length} identified) ---`);
    context.patterns.forEach(p => {
      parts.push(`\n**${p.label}** (Intensity: ${p.intensity}/100, ${p.tone})`);
      if (p.origin) parts.push(`  Origin: ${p.origin}`);
      if (p.currentEffect) parts.push(`  Current Effect: ${p.currentEffect}`);
      if (p.healingPath) parts.push(`  Healing Path: ${p.healingPath}`);
    });
    parts.push('');
  }

  // Biography
  if (context.biography && context.biography.significantEvents?.length > 0) {
    parts.push(`\n--- LIFE STORY (${context.biography.yearsDocumented} years documented) ---`);
    if (context.biography.narrative) {
      parts.push(`Narrative: ${context.biography.narrative}`);
    }
    parts.push(`\nSignificant Events:`);
    context.biography.significantEvents.forEach(e => {
      parts.push(`  - (${e.year}) ${e.description}${e.emotionalImpact ? ` [${e.emotionalImpact}]` : ''}`);
    });
    parts.push('');
  }

  // Relationships
  if (context.relationships && context.relationships.length > 0) {
    parts.push(`\n--- SOUL CONSTELLATION (${context.relationships.length} people) ---`);
    context.relationships.forEach(r => {
      parts.push(`\n**${r.name}** (${r.role})`);
      if (r.bond) parts.push(`  Bond: ${r.bond}`);
      if (r.soulSignature) parts.push(`  Soul Signature: ${r.soulSignature}`);
    });
    parts.push('');
  }

  // Recent breakthroughs
  if (context.recentBreakthroughs && context.recentBreakthroughs.length > 0) {
    parts.push(`\n--- RECENT BREAKTHROUGHS ---`);
    context.recentBreakthroughs.forEach(b => {
      parts.push(`  - "${b.insight}" (from ${b.source}, depth: ${b.depth}/5)`);
    });
    parts.push('');
  }

  // Metrics summary
  if (context.metrics) {
    parts.push(`\n--- CURRENT STATE ---`);
    parts.push(`Soul Burden: ${context.metrics.soulBurden}/100`);
    parts.push(`Emotional Capacity: ${context.metrics.emotionalCapacity}/5`);
    parts.push(`Self-Awareness: ${context.metrics.selfAwareness}/10`);
    parts.push(`Healing Progress: ${context.metrics.healingProgress}/100`);
  }

  // Depth summary
  parts.push(`\n--- PROFILE DEPTH ---`);
  parts.push(`Has Identity: ${context.depth.hasIdentity ? 'Yes' : 'No'}`);
  parts.push(`Has Biography: ${context.depth.hasBiography ? `Yes (${context.depth.eventsCount} events)` : 'No'}`);
  parts.push(`Has Patterns: ${context.depth.hasPatterns ? `Yes (${context.depth.patternsCount})` : 'No'}`);
  parts.push(`Has Breakthroughs: ${context.depth.hasBreakthroughs ? `Yes (${context.depth.breakthroughsCount})` : 'No'}`);

  return parts.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a soul profile has enough depth for meaningful AI interaction
 *
 * @param {SoulProfile} profile
 * @returns {{ hasDepth: boolean, missingElements: string[] }}
 */
export function checkProfileDepth(profile) {
  const missingElements = [];

  if (!profile.identity.enneagramType && !profile.identity.sunSign) {
    missingElements.push('identity');
  }
  if (profile.biography.events.length === 0) {
    missingElements.push('biography');
  }
  if (profile.soulPatterns.length === 0) {
    missingElements.push('patterns');
  }

  return {
    hasDepth: missingElements.length <= 1,
    missingElements
  };
}

/**
 * Calculate overall soul burden based on patterns and events
 *
 * @param {SoulProfile} profile
 * @returns {number} 0-100
 */
export function calculateSoulBurden(profile) {
  let burden = 0;

  // Add pattern intensity
  if (profile.soulPatterns.length > 0) {
    const avgIntensity = profile.soulPatterns.reduce((sum, p) => sum + p.intensity, 0) / profile.soulPatterns.length;
    burden += avgIntensity * 0.4;
  }

  // Add weight from heavy events
  const heavyEvents = profile.biography.events.filter(e =>
    e.type === 'loss' || e.type === 'trauma' || (e.emotionalWeight && e.emotionalWeight >= 7)
  );
  burden += Math.min(heavyEvents.length * 5, 30);

  // Reduce by breakthroughs
  burden -= Math.min(profile.breakthroughs.length * 3, 20);

  return Math.max(0, Math.min(100, Math.round(burden)));
}

export default {
  createEmptySoulProfile,
  buildSoulProfileFromFirebase,
  addSoulPattern,
  logBreakthrough,
  saveSoulLetter,
  updateEmotionalState,
  updateMetrics,
  extractSoulContext,
  formatSoulNarrative,
  checkProfileDepth,
  calculateSoulBurden
};
