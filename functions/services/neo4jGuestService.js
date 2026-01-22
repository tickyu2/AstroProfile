/**
 * Neo4j Guest Service
 *
 * Provides enriched guest profile data from Neo4j graph database,
 * including relationships, events, era matching, and compatibility scoring.
 *
 * This service integrates with the existing Firebase-based guest chat system
 * to add relationship-aware conversations and constitutional compatibility.
 */

const neo4j = require('neo4j-driver');

class Neo4jGuestService {
  constructor() {
    this.driver = null;
    this.initialized = false;
  }

  /**
   * Safely convert Neo4j values to JavaScript primitives
   * Neo4j returns integers as neo4j.Integer objects
   */
  safeValue(val, defaultVal = null) {
    if (val === null || val === undefined) return defaultVal;
    // Handle Neo4j Integer
    if (val.toNumber) return val.toNumber();
    // Handle Neo4j arrays
    if (Array.isArray(val)) return val.map(v => this.safeValue(v));
    return val;
  }

  /**
   * Initialize the Neo4j driver connection
   * Call this before using any other methods
   */
  initialize() {
    if (this.initialized) return;

    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
      console.warn('Neo4j credentials not configured. Service will operate in fallback mode.');
      return;
    }

    this.driver = neo4j.driver(
      uri,
      neo4j.auth.basic(user, password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 30000,
        connectionTimeout: 30000
      }
    );
    this.initialized = true;
    console.log('Neo4j driver initialized');
  }

  /**
   * Check if Neo4j is available
   */
  isAvailable() {
    return this.initialized && this.driver !== null;
  }

  /**
   * Get enriched guest profile with relationships, events, and compatibility
   *
   * @param {string} guestId - The guest profile ID (e.g., 'guest_ronald_reagan')
   * @param {object} options - Query options
   * @param {string} options.userId - Firebase user ID for compatibility calculation
   * @param {boolean} options.includeRelationships - Include connected people
   * @param {boolean} options.includeEvents - Include historical events
   * @param {boolean} options.includeEras - Include life period eras
   * @param {boolean} options.calculateCompatibility - Calculate user-guest compatibility
   * @returns {object} Enriched profile with metadata
   */
  async getEnrichedGuestProfile(guestId, options = {}) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, returning null enrichment');
      return null;
    }

    const {
      userId = null,
      includeRelationships = true,
      includeEvents = true,
      includeEras = true,
      calculateCompatibility = false
    } = options;

    const session = this.driver.session();

    try {
      // Build the Cypher query dynamically based on options
      let query = `
        MATCH (guest:GuestProfile {id: $guestId})
      `;

      // Add relationship matching
      if (includeRelationships) {
        query += `
          OPTIONAL MATCH (guest)-[rel]->(connected:GuestProfile)
          WHERE type(rel) IN ['MARRIED_TO', 'POLITICAL_ALLY', 'INFLUENCED', 'CONTEMPORARY_OF', 'MENTORED']
        `;
      }

      // Add event matching
      if (includeEvents) {
        query += `
          OPTIONAL MATCH (guest)-[:DELIVERED|:PARTICIPATED_IN]->(event:Event)
        `;
      }

      // Add era matching
      if (includeEras) {
        query += `
          OPTIONAL MATCH (guest)-[:HAS_ERA]->(era:GuestEra)
        `;
      }

      // Add compatibility calculation with synergy bonuses
      if (calculateCompatibility && userId) {
        query += `
          OPTIONAL MATCH (user:UserProfile {userId: $userId})

          WITH guest,
               ${includeRelationships ? 'connected, rel,' : ''}
               ${includeEvents ? 'event,' : ''}
               era, user,
            CASE WHEN user IS NOT NULL AND era IS NOT NULL THEN
              abs(COALESCE(user.fire, 0) - COALESCE(era.fire, 0)) +
              abs(COALESCE(user.wood, 0) - COALESCE(era.wood, 0)) +
              abs(COALESCE(user.water, 0) - COALESCE(era.water, 0)) +
              abs(COALESCE(user.metal, 0) - COALESCE(era.metal, 0)) +
              abs(COALESCE(user.earth, 0) - COALESCE(era.earth, 0))
            ELSE 0 END as elementDiff

          WITH guest,
               ${includeRelationships ? 'connected, rel,' : ''}
               ${includeEvents ? 'event,' : ''}
               era, user, elementDiff,
            CASE WHEN elementDiff > 0 THEN 100 - (elementDiff / 5.0) ELSE 0 END as baseCompatibility

          WITH guest,
               ${includeRelationships ? 'connected, rel,' : ''}
               ${includeEvents ? 'event,' : ''}
               era, user, baseCompatibility,
            CASE
              WHEN user.wood > 30 AND era.fire > 30 THEN 15
              WHEN user.fire > 30 AND era.water > 20 THEN 10
              WHEN user.water > 30 AND era.wood > 30 THEN 10
              WHEN user.metal > 30 AND era.fire > 30 THEN -5
              ELSE 0
            END as synergyBonus

          WITH guest,
               ${includeRelationships ? 'connected, rel,' : ''}
               ${includeEvents ? 'event,' : ''}
               era, user,
            baseCompatibility + synergyBonus as finalCompatibility

          ORDER BY finalCompatibility DESC
        `;
      }

      // Build return statement
      query += `
        RETURN guest
      `;

      if (includeRelationships) {
        query += `,
          collect(DISTINCT {
            person: connected,
            relationshipType: type(rel),
            relationshipProps: properties(rel)
          }) as relationships
        `;
      } else {
        query += `, null as relationships`;
      }

      if (includeEvents) {
        query += `,
          collect(DISTINCT event) as events
        `;
      } else {
        query += `, null as events`;
      }

      if (includeEras) {
        query += `,
          collect(DISTINCT era) as eras
        `;
      } else {
        query += `, null as eras`;
      }

      if (calculateCompatibility && userId) {
        query += `,
          head(collect({
            era: era,
            compatibility: finalCompatibility,
            userElements: {
              fire: user.fire,
              wood: user.wood,
              water: user.water,
              metal: user.metal,
              earth: user.earth
            }
          })) as bestMatch
        `;
      }

      const result = await session.run(query, { guestId, userId });

      if (result.records.length === 0) {
        console.log(`Guest profile not found in Neo4j: ${guestId}`);
        return null;
      }

      return this.formatEnrichedProfile(result.records[0], calculateCompatibility && userId);

    } catch (error) {
      console.error('Error fetching enriched guest profile:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Format Neo4j result into clean object
   * Uses safeValue() to handle Neo4j Integer types
   */
  formatEnrichedProfile(record, includeCompatibility = false) {
    try {
      const guest = record.get('guest')?.properties || {};
      const relationships = record.get('relationships') || [];
      const events = record.get('events') || [];
      const eras = record.get('eras') || [];
      const bestMatch = includeCompatibility ? record.get('bestMatch') : null;

      // Safely format relationships
      const formattedRelationships = relationships
        .filter(r => r && r.person)
        .map(r => {
          try {
            const props = r.relationshipProps || {};
            return {
              person: r.person?.properties || {},
              type: r.relationshipType || 'CONNECTED_TO',
              context: props.context || '',
              quality: props.relationshipQuality || null,
              chemistryNote: props.chemistryNote || '',
              // Enhanced: Add constitutional dynamics for cross-figure awareness
              compatibility: this.safeValue(props.compatibility, null),
              constitutionalDynamic: props.constitutionalDynamic || '',
              keyQuote: props.keyQuote || ''
            };
          } catch (relErr) {
            console.warn('[Neo4j] Error formatting relationship:', relErr.message);
            return null;
          }
        })
        .filter(Boolean);

      // Safely format events
      const formattedEvents = events
        .filter(e => e)
        .map(e => {
          try {
            return e.properties || e;
          } catch (evtErr) {
            return null;
          }
        })
        .filter(Boolean);

      // Safely format eras
      const formattedEras = eras
        .filter(e => e)
        .map(e => {
          try {
            return e.properties || e;
          } catch (eraErr) {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => (this.safeValue(a.sequence, 0)) - (this.safeValue(b.sequence, 0)));

      // Safely format bestMatch
      let formattedBestMatch = null;
      if (bestMatch && bestMatch.era) {
        try {
          formattedBestMatch = {
            era: bestMatch.era.properties || bestMatch.era,
            compatibility: Math.round(this.safeValue(bestMatch.compatibility, 0)),
            userElements: bestMatch.userElements || {}
          };
        } catch (matchErr) {
          console.warn('[Neo4j] Error formatting bestMatch:', matchErr.message);
        }
      }

      return {
        profile: guest,
        relationships: formattedRelationships,
        events: formattedEvents,
        eras: formattedEras,
        bestMatch: formattedBestMatch
      };
    } catch (formatError) {
      console.error('[Neo4j] Critical error in formatEnrichedProfile:', formatError);
      // Return minimal safe response
      return {
        profile: {},
        relationships: [],
        events: [],
        eras: [],
        bestMatch: null
      };
    }
  }

  /**
   * Get or create UserProfile node synced from Firebase Brain 1A
   *
   * @param {string} userId - Firebase user ID
   * @param {object} userBrain1A - User's constitutional data from Firebase
   */
  async syncUserProfile(userId, userBrain1A) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping user sync');
      return;
    }

    const session = this.driver.session();

    try {
      // Extract element balance from Brain 1A structure
      const elementBalance = userBrain1A?.fourPillars?.elementBalance || {};
      const dayPillar = userBrain1A?.fourPillars?.dayPillar?.combined || '';
      const constitutionalType = userBrain1A?.constitutionalType || '';

      await session.run(`
        MERGE (u:UserProfile {userId: $userId})
        ON CREATE SET
          u.fire = $fire,
          u.wood = $wood,
          u.water = $water,
          u.metal = $metal,
          u.earth = $earth,
          u.dayPillar = $dayPillar,
          u.constitutionalType = $constitutionalType,
          u.createdAt = datetime(),
          u.lastSynced = datetime()
        ON MATCH SET
          u.fire = $fire,
          u.wood = $wood,
          u.water = $water,
          u.metal = $metal,
          u.earth = $earth,
          u.dayPillar = $dayPillar,
          u.constitutionalType = $constitutionalType,
          u.lastSynced = datetime()
      `, {
        userId,
        fire: elementBalance.fire || 0,
        wood: elementBalance.wood || 0,
        water: elementBalance.water || 0,
        metal: elementBalance.metal || 0,
        earth: elementBalance.earth || 0,
        dayPillar,
        constitutionalType
      });

      console.log(`Synced UserProfile to Neo4j: ${userId}`);

    } catch (error) {
      console.error('Error syncing user profile to Neo4j:', error);
      // Don't throw - this is a non-critical operation
    } finally {
      await session.close();
    }
  }

  /**
   * Update conversation memory in Neo4j
   * Tracks which users have talked to which guests and about what topics
   *
   * @param {string} userId - Firebase user ID
   * @param {string} guestId - Guest profile ID
   * @param {object} metadata - Conversation metadata
   * @param {string[]} metadata.topics - Topics discussed in this message
   */
  async updateConversationMemory(userId, guestId, metadata) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping conversation memory update');
      return;
    }

    const session = this.driver.session();

    try {
      const topics = metadata.topics || [];

      await session.run(`
        MATCH (user:UserProfile {userId: $userId})
        MATCH (guest:GuestProfile {id: $guestId})

        MERGE (user)-[conv:CONVERSED_WITH]->(guest)
        ON CREATE SET
          conv.firstSession = datetime(),
          conv.sessionCount = 1,
          conv.totalMessages = 1,
          conv.topicsDiscussed = $topics,
          conv.lastSession = datetime()
        ON MATCH SET
          conv.sessionCount = CASE
            WHEN duration.between(conv.lastSession, datetime()).hours > 1
            THEN conv.sessionCount + 1
            ELSE conv.sessionCount
          END,
          conv.lastSession = datetime(),
          conv.totalMessages = conv.totalMessages + 1,
          conv.topicsDiscussed =
            [topic IN (conv.topicsDiscussed + $topics) WHERE topic IS NOT NULL | topic][0..50]
      `, {
        userId,
        guestId,
        topics
      });

      console.log(`Updated conversation memory: ${userId} <-> ${guestId}`);

    } catch (error) {
      console.error('Error updating conversation memory:', error);
      // Don't throw - this is a non-critical operation
    } finally {
      await session.close();
    }
  }

  /**
   * Get conversation history context with this guest
   *
   * @param {string} userId - Firebase user ID
   * @param {string} guestId - Guest profile ID
   * @returns {object|null} Conversation context or null if none exists
   */
  async getConversationContext(userId, guestId) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, returning null conversation context');
      return null;
    }

    const session = this.driver.session();

    try {
      const result = await session.run(`
        MATCH (user:UserProfile {userId: $userId})
        MATCH (guest:GuestProfile {id: $guestId})
        OPTIONAL MATCH (user)-[conv:CONVERSED_WITH]->(guest)

        RETURN COALESCE(conv.sessionCount, 0) as sessionCount,
               COALESCE(conv.totalMessages, 0) as totalMessages,
               COALESCE(conv.topicsDiscussed, []) as topics,
               conv.lastSession as lastSession,
               conv.firstSession as firstSession
      `, { userId, guestId });

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const sessionCount = record.get('sessionCount');

      // Return null if no previous conversations
      if (sessionCount === 0) {
        return null;
      }

      return {
        sessionCount: sessionCount,
        totalMessages: record.get('totalMessages'),
        topics: [...new Set(record.get('topics'))], // Dedupe topics
        lastSession: record.get('lastSession'),
        firstSession: record.get('firstSession')
      };

    } catch (error) {
      console.error('Error getting conversation context:', error);
      return null;
    } finally {
      await session.close();
    }
  }

  /**
   * Get guest's relationships for context injection
   *
   * @param {string} guestId - Guest profile ID
   * @returns {object[]} Array of relationship objects
   */
  async getGuestRelationships(guestId) {
    if (!this.isAvailable()) {
      return [];
    }

    const session = this.driver.session();

    try {
      const result = await session.run(`
        MATCH (guest:GuestProfile {id: $guestId})-[rel]->(connected:GuestProfile)
        WHERE type(rel) IN ['MARRIED_TO', 'POLITICAL_ALLY', 'INFLUENCED', 'CONTEMPORARY_OF', 'MENTORED']
        RETURN connected.name as name,
               connected.id as id,
               type(rel) as relationshipType,
               properties(rel) as props

        UNION

        MATCH (guest:GuestProfile {id: $guestId})<-[rel]-(connected:GuestProfile)
        WHERE type(rel) IN ['MARRIED_TO', 'POLITICAL_ALLY', 'INFLUENCED', 'CONTEMPORARY_OF', 'MENTORED']
        RETURN connected.name as name,
               connected.id as id,
               type(rel) as relationshipType,
               properties(rel) as props
      `, { guestId });

      return result.records.map(r => ({
        name: r.get('name'),
        id: r.get('id'),
        type: r.get('relationshipType'),
        context: r.get('props')?.context || '',
        quality: r.get('props')?.relationshipQuality || null
      }));

    } catch (error) {
      console.error('Error getting guest relationships:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  /**
   * Get events associated with a guest for a specific era
   *
   * @param {string} guestId - Guest profile ID
   * @param {string} eraId - Optional era ID to filter events
   * @returns {object[]} Array of event objects
   */
  async getGuestEvents(guestId, eraId = null) {
    if (!this.isAvailable()) {
      return [];
    }

    const session = this.driver.session();

    try {
      let query = `
        MATCH (guest:GuestProfile {id: $guestId})-[:DELIVERED|:PARTICIPATED_IN]->(event:Event)
      `;

      if (eraId) {
        query += `
          MATCH (era:GuestEra {id: $eraId})-[:FEATURED_EVENT]->(event)
        `;
      }

      query += `
        RETURN event.id as id,
               event.name as name,
               event.date as date,
               event.location as location,
               event.significance as significance,
               event.fullQuote as fullQuote
        ORDER BY event.date
      `;

      const result = await session.run(query, { guestId, eraId });

      return result.records.map(r => ({
        id: r.get('id'),
        name: r.get('name'),
        date: r.get('date'),
        location: r.get('location'),
        significance: r.get('significance'),
        fullQuote: r.get('fullQuote')
      }));

    } catch (error) {
      console.error('Error getting guest events:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  /**
   * Find the best matching era for a user based on constitutional compatibility
   *
   * @param {string} guestId - Guest profile ID
   * @param {object} userElements - User's element balance {fire, wood, water, metal, earth}
   * @returns {object|null} Best matching era with compatibility score
   */
  async findBestMatchingEra(guestId, userElements) {
    if (!this.isAvailable() || !userElements) {
      return null;
    }

    const session = this.driver.session();

    try {
      const result = await session.run(`
        MATCH (guest:GuestProfile {id: $guestId})-[:HAS_ERA]->(era:GuestEra)

        WITH era,
          abs($fire - COALESCE(era.fire, 0)) +
          abs($wood - COALESCE(era.wood, 0)) +
          abs($water - COALESCE(era.water, 0)) +
          abs($metal - COALESCE(era.metal, 0)) +
          abs($earth - COALESCE(era.earth, 0)) as elementDiff

        WITH era, 100 - (elementDiff / 5.0) as baseCompatibility,
          CASE
            WHEN $wood > 30 AND era.fire > 30 THEN 15
            WHEN $fire > 30 AND era.water > 20 THEN 10
            WHEN $water > 30 AND era.wood > 30 THEN 10
            WHEN $metal > 30 AND era.fire > 30 THEN -5
            ELSE 0
          END as synergyBonus

        WITH era, baseCompatibility + synergyBonus as compatibility
        ORDER BY compatibility DESC
        LIMIT 1

        RETURN era, compatibility
      `, {
        guestId,
        fire: userElements.fire || 0,
        wood: userElements.wood || 0,
        water: userElements.water || 0,
        metal: userElements.metal || 0,
        earth: userElements.earth || 0
      });

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      return {
        era: record.get('era').properties,
        compatibility: Math.round(record.get('compatibility'))
      };

    } catch (error) {
      console.error('Error finding best matching era:', error);
      return null;
    } finally {
      await session.close();
    }
  }

  /**
   * Close driver connection (call on shutdown)
   */
  async close() {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
      this.initialized = false;
      console.log('Neo4j driver closed');
    }
  }
}

// Export singleton instance
const neo4jGuestService = new Neo4jGuestService();

module.exports = neo4jGuestService;
