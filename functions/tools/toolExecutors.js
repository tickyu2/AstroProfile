/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TOOL EXECUTORS - Function Calling Implementation
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Executes tools called by Luna during conversations.
 * Each executor returns structured data that Luna can use in responses.
 *
 * @module toolExecutors
 */

const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const getDb = () => admin.firestore();

const getGeminiClient = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');
  return new GoogleGenerativeAI(apiKey);
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL EXECUTORS
// ═══════════════════════════════════════════════════════════════════════════════

const toolExecutors = {
  // ─────────────────────────────────────────────────────────────────────────────
  // WEB SEARCH
  // ─────────────────────────────────────────────────────────────────────────────
  async web_search({ query, num_results = 5 }, context) {
    try {
      // Use Gemini's grounding with Google Search
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        tools: [{
          googleSearch: {}
        }]
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `Search for: ${query}\n\nProvide a concise summary of the most relevant and recent information.` }] }],
        generationConfig: {
          maxOutputTokens: 1000
        }
      });

      const response = result.response;
      const text = response.text();

      // Extract grounding metadata if available
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources = groundingMetadata?.webSearchQueries || [];

      return {
        success: true,
        query,
        summary: text,
        sources,
        searchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('[ToolExecutors] web_search error:', error);
      return {
        success: false,
        error: 'Search failed',
        query
      };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // URL FETCH
  // ─────────────────────────────────────────────────────────────────────────────
  async fetch_url({ url }, context) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LunaBot/1.0)'
        }
      });

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}`, url };
      }

      const html = await response.text();

      // Use Gemini to extract meaningful content
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: `Extract the main content from this webpage. Ignore navigation, ads, and boilerplate. Provide a clean, readable summary:\n\n${html.slice(0, 50000)}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2000
        }
      });

      return {
        success: true,
        url,
        content: result.response.text(),
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('[ToolExecutors] fetch_url error:', error);
      return { success: false, error: error.message, url };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHART DETAILS
  // ─────────────────────────────────────────────────────────────────────────────
  async get_chart_details({ profile_id, chart_type = 'both', include_transits = false }, context) {
    try {
      const db = getDb();
      const actualProfileId = profile_id === 'current' ? context.profileId : profile_id;

      const profileDoc = await db.collection('profiles')
        .where('id', '==', actualProfileId)
        .limit(1)
        .get();

      if (profileDoc.empty) {
        return { success: false, error: 'Profile not found', profile_id: actualProfileId };
      }

      const profile = profileDoc.docs[0].data();
      const result = { success: true, profile_id: actualProfileId };

      if (chart_type === 'western' || chart_type === 'both') {
        result.western = {
          sunSign: profile.calculations?.western?.sign,
          moonSign: profile.calculations?.western?.moonSign,
          risingSign: profile.calculations?.western?.rising,
          planets: profile.calculations?.western?.planets,
          houses: profile.calculations?.western?.houses,
          aspects: profile.calculations?.western?.aspects
        };
      }

      if (chart_type === 'bazi' || chart_type === 'both') {
        result.bazi = {
          dayMaster: profile.calculations?.fourPillars?.dayPillar?.stem,
          fourPillars: profile.calculations?.fourPillars,
          elementBalance: profile.calculations?.fourPillars?.elementBalance,
          seasonalStrength: profile.calculations?.seasonalStrength,
          tenGods: profile.calculations?.tenGods
        };
      }

      if (include_transits) {
        // Calculate current transits (simplified)
        result.currentTransits = {
          note: 'Current planetary positions relative to natal chart',
          // This would integrate with ephemeris calculations
          generated: new Date().toISOString()
        };
      }

      return result;
    } catch (error) {
      console.error('[ToolExecutors] get_chart_details error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CURRENT TRANSITS
  // ─────────────────────────────────────────────────────────────────────────────
  async get_current_transits({ profile_id, focus_planets }, context) {
    try {
      const now = new Date();

      // This would integrate with Swiss Ephemeris for accurate positions
      // For now, provide basic transit information
      const transits = {
        date: now.toISOString(),
        lunarPhase: calculateLunarPhase(now),
        majorTransits: [
          // These would be calculated from ephemeris
        ],
        note: 'For detailed transits, ephemeris integration required'
      };

      return {
        success: true,
        profile_id,
        transits,
        generated: now.toISOString()
      };
    } catch (error) {
      console.error('[ToolExecutors] get_current_transits error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MEMORY RECALL
  // ─────────────────────────────────────────────────────────────────────────────
  async recall_memory({ profile_id, query, memory_type = 'all', time_range = 'all_time' }, context) {
    try {
      const db = getDb();
      const userId = context.userId;
      const genAI = getGeminiClient();

      // Generate embedding for semantic search
      const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddingResult = await embeddingModel.embedContent(query);
      const queryEmbedding = embeddingResult.embedding.values;

      const memories = [];

      // Search different memory types based on filter
      const memoryRef = db.collection('users').doc(userId)
        .collection('memory').doc(profile_id);

      // Search facts
      if (memory_type === 'all' || memory_type === 'facts') {
        try {
          const factsSnap = await memoryRef.collection('facts')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

          factsSnap.docs.forEach(doc => {
            memories.push({
              type: 'fact',
              content: doc.data().content,
              category: doc.data().category,
              timestamp: doc.data().createdAt?.toDate?.()?.toISOString()
            });
          });
        } catch (e) { /* collection may not exist */ }
      }

      // Search life timeline memories
      if (memory_type === 'all' || memory_type === 'conversations') {
        try {
          const timelineSnap = await memoryRef.collection('user').doc('life_timeline')
            .collection('memories')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

          timelineSnap.docs.forEach(doc => {
            memories.push({
              type: 'life_memory',
              content: doc.data().content,
              chapter: doc.data().chapter,
              timestamp: doc.data().createdAt?.toDate?.()?.toISOString()
            });
          });
        } catch (e) { /* collection may not exist */ }
      }

      // Search SoulPartner observations
      if (memory_type === 'all' || memory_type === 'observations') {
        try {
          const obsSnap = await memoryRef.collection('soulpartner').doc('interaction_timeline')
            .collection('observations')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

          obsSnap.docs.forEach(doc => {
            memories.push({
              type: 'observation',
              observation: doc.data().observation,
              insight: doc.data().insight,
              timestamp: doc.data().createdAt?.toDate?.()?.toISOString()
            });
          });
        } catch (e) { /* collection may not exist */ }
      }

      // Filter by relevance using Gemini
      if (memories.length > 0) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const filterPrompt = `Given this search query: "${query}"

Rate the relevance of each memory (0-1) and return only the most relevant ones:

${memories.map((m, i) => `[${i}] ${m.content || m.observation}`).join('\n')}

Return a JSON array of indices of relevant memories, sorted by relevance.`;

        const filterResult = await model.generateContent(filterPrompt);
        const filterText = filterResult.response.text();

        // Parse and reorder
        try {
          const indices = JSON.parse(filterText.match(/\[[\d,\s]+\]/)?.[0] || '[]');
          const relevantMemories = indices.slice(0, 5).map(i => memories[i]).filter(Boolean);
          return {
            success: true,
            query,
            memories: relevantMemories.length > 0 ? relevantMemories : memories.slice(0, 5),
            total_found: memories.length
          };
        } catch {
          return { success: true, query, memories: memories.slice(0, 5), total_found: memories.length };
        }
      }

      return {
        success: true,
        query,
        memories: [],
        total_found: 0,
        note: 'No memories found matching the query'
      };
    } catch (error) {
      console.error('[ToolExecutors] recall_memory error:', error);
      return { success: false, error: error.message, query };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // STORE MEMORY
  // ─────────────────────────────────────────────────────────────────────────────
  async store_memory({ profile_id, content, category, importance = 0.5, life_chapter = 'timeless' }, context) {
    try {
      const db = getDb();
      const userId = context.userId;
      const genAI = getGeminiClient();

      // Generate embedding
      const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddingResult = await embeddingModel.embedContent(content);
      const embedding = embeddingResult.embedding.values;

      const memoryRef = db.collection('users').doc(userId)
        .collection('memory').doc(profile_id);

      // Store as fact
      const factDoc = await memoryRef.collection('facts').add({
        content,
        category,
        importance,
        lifeChapter: life_chapter,
        embedding: FieldValue.vector(embedding),
        source: 'conversation',
        createdAt: FieldValue.serverTimestamp(),
        createdBy: 'luna'
      });

      return {
        success: true,
        stored: {
          id: factDoc.id,
          content,
          category,
          importance
        },
        message: `I've noted that down about ${profile_id}`
      };
    } catch (error) {
      console.error('[ToolExecutors] store_memory error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SET REMINDER
  // ─────────────────────────────────────────────────────────────────────────────
  async set_reminder({ profile_id, reminder_text, trigger_type, trigger_value, priority = 'medium' }, context) {
    try {
      const db = getDb();
      const userId = context.userId;

      let triggerDate;
      if (trigger_type === 'date') {
        triggerDate = new Date(trigger_value);
      } else if (trigger_type === 'days_from_now') {
        triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() + parseInt(trigger_value));
      } else if (trigger_type === 'next_conversation') {
        triggerDate = null; // Will trigger on next conversation
      }

      const reminderRef = await db.collection('users').doc(userId)
        .collection('reminders').add({
          profileId: profile_id,
          text: reminder_text,
          triggerType: trigger_type,
          triggerDate: triggerDate ? admin.firestore.Timestamp.fromDate(triggerDate) : null,
          priority,
          status: 'pending',
          createdAt: FieldValue.serverTimestamp(),
          createdBy: 'luna'
        });

      return {
        success: true,
        reminder: {
          id: reminderRef.id,
          text: reminder_text,
          triggerDate: triggerDate?.toISOString() || 'next conversation',
          priority
        },
        message: `I'll remember to follow up about this`
      };
    } catch (error) {
      console.error('[ToolExecutors] set_reminder error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // KNOWLEDGE BASE QUERY
  // ─────────────────────────────────────────────────────────────────────────────
  async query_knowledge_base({ query, doc_types, limit = 5 }, context) {
    try {
      const db = getDb();
      const userId = context.userId;
      const genAI = getGeminiClient();

      // Generate embedding for semantic search
      const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddingResult = await embeddingModel.embedContent(query);
      const queryEmbedding = embeddingResult.embedding.values;

      // Query knowledge base with vector search
      let kbQuery = db.collection('knowledgeBase')
        .where('userId', '==', userId);

      if (doc_types && doc_types.length > 0) {
        kbQuery = kbQuery.where('type', 'in', doc_types);
      }

      const kbSnap = await kbQuery.limit(50).get();

      // Score by text relevance (simplified - would use vector search in production)
      const docs = kbSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        type: doc.data().type,
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString()
      }));

      // Use Gemini to rank by relevance
      if (docs.length > 0) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const rankPrompt = `Query: "${query}"

Rank these documents by relevance (return indices):
${docs.map((d, i) => `[${i}] ${d.title}: ${d.content?.slice(0, 200)}`).join('\n')}

Return only a JSON array of relevant indices.`;

        const rankResult = await model.generateContent(rankPrompt);
        const rankText = rankResult.response.text();

        try {
          const indices = JSON.parse(rankText.match(/\[[\d,\s]+\]/)?.[0] || '[]');
          const rankedDocs = indices.slice(0, limit).map(i => docs[i]).filter(Boolean);
          return { success: true, query, documents: rankedDocs, total: docs.length };
        } catch {
          return { success: true, query, documents: docs.slice(0, limit), total: docs.length };
        }
      }

      return { success: true, query, documents: [], total: 0 };
    } catch (error) {
      console.error('[ToolExecutors] query_knowledge_base error:', error);
      return { success: false, error: error.message, query };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPATIBILITY CHECK
  // ─────────────────────────────────────────────────────────────────────────────
  async check_compatibility({ profile_id_1, profile_id_2, aspects }, context) {
    try {
      const db = getDb();

      // Fetch both profiles
      const [profile1Snap, profile2Snap] = await Promise.all([
        db.collection('profiles').where('id', '==', profile_id_1).limit(1).get(),
        db.collection('profiles').where('id', '==', profile_id_2).limit(1).get()
      ]);

      if (profile1Snap.empty || profile2Snap.empty) {
        return { success: false, error: 'One or both profiles not found' };
      }

      const profile1 = profile1Snap.docs[0].data();
      const profile2 = profile2Snap.docs[0].data();

      // Calculate compatibility scores (simplified)
      const compatibility = {
        overall: 0,
        western: {},
        bazi: {},
        summary: ''
      };

      // Western element compatibility
      const element1 = profile1.calculations?.western?.element;
      const element2 = profile2.calculations?.western?.element;
      const elementCompatibility = calculateElementCompatibility(element1, element2);

      // Chinese zodiac compatibility
      const animal1 = profile1.chineseZodiac?.animal;
      const animal2 = profile2.chineseZodiac?.animal;
      const animalCompatibility = calculateAnimalCompatibility(animal1, animal2);

      compatibility.western = {
        elements: { person1: element1, person2: element2 },
        score: elementCompatibility
      };

      compatibility.bazi = {
        animals: { person1: animal1, person2: animal2 },
        score: animalCompatibility
      };

      compatibility.overall = Math.round((elementCompatibility + animalCompatibility) / 2);

      // Generate summary
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const summaryPrompt = `Generate a brief compatibility summary for:
Person 1: ${profile1.displayName} - ${profile1.calculations?.western?.sign}, ${profile1.chineseZodiac?.fullSign}
Person 2: ${profile2.displayName} - ${profile2.calculations?.western?.sign}, ${profile2.chineseZodiac?.fullSign}

Western compatibility: ${elementCompatibility}%
Chinese zodiac compatibility: ${animalCompatibility}%

Provide 2-3 sentences about their dynamic.`;

      const summaryResult = await model.generateContent(summaryPrompt);
      compatibility.summary = summaryResult.response.text();

      return {
        success: true,
        profiles: {
          person1: { id: profile_id_1, name: profile1.displayName },
          person2: { id: profile_id_2, name: profile2.displayName }
        },
        compatibility
      };
    } catch (error) {
      console.error('[ToolExecutors] check_compatibility error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ANALYZE DATE
  // ─────────────────────────────────────────────────────────────────────────────
  async analyze_date({ date, profile_id, purpose }, context) {
    try {
      const targetDate = new Date(date);

      // Calculate basic astrological info
      const lunarPhase = calculateLunarPhase(targetDate);

      // Get day energy (simplified BaZi)
      const dayEnergy = calculateDayEnergy(targetDate);

      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const analysisPrompt = `Analyze ${date} astrologically${purpose ? ` for: ${purpose}` : ''}.

Lunar phase: ${lunarPhase}
Day energy: ${dayEnergy}

Provide a brief (2-3 sentences) analysis of this date's energy and suitability${purpose ? ` for ${purpose}` : ''}.`;

      const result = await model.generateContent(analysisPrompt);

      return {
        success: true,
        date,
        purpose,
        analysis: {
          lunarPhase,
          dayEnergy,
          summary: result.response.text()
        }
      };
    } catch (error) {
      console.error('[ToolExecutors] analyze_date error:', error);
      return { success: false, error: error.message, date };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GENERATIONAL CONTEXT (AI-Driven Historical Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  async get_generational_context({ birth_year, person_name, focus_areas, relationship_to_profile }, context) {
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Calculate key age milestones
      const currentYear = new Date().getFullYear();
      const age = currentYear - birth_year;
      const childhoodYears = `${birth_year + 5}-${birth_year + 12}`;
      const teenYears = `${birth_year + 13}-${birth_year + 19}`;
      const youngAdultYears = `${birth_year + 20}-${birth_year + 30}`;

      // Determine generation
      let generation = 'Unknown Generation';
      if (birth_year >= 1946 && birth_year <= 1964) generation = 'Baby Boomer';
      else if (birth_year >= 1965 && birth_year <= 1980) generation = 'Generation X';
      else if (birth_year >= 1981 && birth_year <= 1996) generation = 'Millennial';
      else if (birth_year >= 1997 && birth_year <= 2012) generation = 'Generation Z';
      else if (birth_year >= 2013) generation = 'Generation Alpha';
      else if (birth_year >= 1928 && birth_year <= 1945) generation = 'Silent Generation';
      else if (birth_year < 1928) generation = 'Greatest Generation';

      const focusStr = focus_areas?.length > 0 ? focus_areas.join(', ') : 'all aspects';
      const nameStr = person_name || 'this person';

      const prompt = `Provide rich generational and historical context for someone born in ${birth_year}${person_name ? ` (${person_name})` : ''}.

Generation: ${generation}
Current Age: ${age}
${relationship_to_profile ? `Relationship: ${relationship_to_profile}` : ''}

Focus on: ${focusStr}

Please provide:
1. **Formative World Events**: Major events during their childhood (${childhoodYears}) and teenage years (${teenYears}) that shaped their worldview
2. **Cultural Context**: Music, TV, movies, technology they grew up with
3. **Economic Environment**: Job market and economic conditions when they entered adulthood
4. **Generational Characteristics**: What defines their generation's values and outlook
5. **Key Historical Moments**: Where were they likely during major historical events?

Be specific with dates and events. This context helps understand their perspective and life experiences.`;

      const result = await model.generateContent(prompt);

      return {
        success: true,
        birth_year,
        person_name: person_name || null,
        generation,
        current_age: age,
        relationship: relationship_to_profile || null,
        context: result.response.text(),
        milestones: {
          childhood: childhoodYears,
          teens: teenYears,
          youngAdult: youngAdultYears
        },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('[ToolExecutors] get_generational_context error:', error);
      return { success: false, error: error.message, birth_year };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BIOGRAPHY SEARCH (Life Story Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  async search_biography({ profile_id, query, event_types, year_range }, context) {
    try {
      const db = getDb();
      const userId = context.userId;
      const actualProfileId = profile_id === 'current' ? context.profileId : profile_id;

      // Search life events
      let eventsQuery = db.collection('users').doc(userId)
        .collection('biographies').doc(actualProfileId)
        .collection('events');

      // Apply event type filter if specified
      if (event_types?.length > 0) {
        eventsQuery = eventsQuery.where('event_type', 'in', event_types.slice(0, 10));
      }

      // Get events
      const eventsSnap = await eventsQuery.orderBy('date.year', 'desc').limit(50).get();

      let events = eventsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply year range filter
      if (year_range?.start || year_range?.end) {
        events = events.filter(e => {
          const year = e.date?.year;
          if (!year) return false;
          if (year_range.start && year < year_range.start) return false;
          if (year_range.end && year > year_range.end) return false;
          return true;
        });
      }

      // Use AI to rank by relevance to query
      if (events.length > 0 && query) {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const rankPrompt = `Query: "${query}"

Rank these life events by relevance to the query. Return the indices of the most relevant events (up to 10):

${events.slice(0, 30).map((e, i) => `[${i}] ${e.title} (${e.date?.year || 'unknown year'}) - ${e.event_type}: ${e.description?.slice(0, 100) || 'no description'}`).join('\n')}

Return only a JSON array of indices, most relevant first.`;

        try {
          const rankResult = await model.generateContent(rankPrompt);
          const rankText = rankResult.response.text();
          const indices = JSON.parse(rankText.match(/\[[\d,\s]+\]/)?.[0] || '[]');
          events = indices.slice(0, 10).map(i => events[i]).filter(Boolean);
        } catch (e) {
          // Fall back to first 10
          events = events.slice(0, 10);
        }
      }

      return {
        success: true,
        query,
        profile_id: actualProfileId,
        events: events.map(e => ({
          id: e.id,
          title: e.title,
          year: e.date?.year,
          event_type: e.event_type,
          description: e.description,
          location: e.location,
          people_involved: e.people_involved,
          emotions: e.emotions
        })),
        total_found: events.length
      };
    } catch (error) {
      console.error('[ToolExecutors] search_biography error:', error);
      return { success: false, error: error.message, query };
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PEOPLE IN THEIR LIFE (Relationship Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  async get_people_context({ profile_id, person_name, include_events = true }, context) {
    try {
      const db = getDb();
      const userId = context.userId;
      const actualProfileId = profile_id === 'current' ? context.profileId : profile_id;

      // Search for person in biography people mentions
      const eventsSnap = await db.collection('users').doc(userId)
        .collection('biographies').doc(actualProfileId)
        .collection('events')
        .where('people_involved', 'array-contains', person_name)
        .limit(20)
        .get();

      const relatedEvents = eventsSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        year: doc.data().date?.year,
        event_type: doc.data().event_type,
        description: doc.data().description?.slice(0, 200)
      }));

      // Also search in memories/facts
      let personFacts = [];
      try {
        const memoryRef = db.collection('users').doc(userId)
          .collection('memory').doc(actualProfileId);

        const factsSnap = await memoryRef.collection('facts')
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();

        // Filter facts mentioning this person
        const lowerName = person_name.toLowerCase();
        personFacts = factsSnap.docs
          .filter(doc => doc.data().content?.toLowerCase().includes(lowerName))
          .map(doc => ({
            content: doc.data().content,
            category: doc.data().category,
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString()
          }))
          .slice(0, 5);
      } catch (e) {
        // Memory collection may not exist
      }

      // Try to determine relationship type from events/facts
      let inferredRelationship = null;
      const allContent = [...relatedEvents.map(e => e.title + ' ' + e.description), ...personFacts.map(f => f.content)].join(' ').toLowerCase();

      const relationshipPatterns = [
        { pattern: /mother|mom|mama/i, relationship: 'mother' },
        { pattern: /father|dad|papa/i, relationship: 'father' },
        { pattern: /daughter/i, relationship: 'daughter' },
        { pattern: /son/i, relationship: 'son' },
        { pattern: /wife|spouse|married/i, relationship: 'spouse' },
        { pattern: /husband|spouse|married/i, relationship: 'spouse' },
        { pattern: /sister/i, relationship: 'sister' },
        { pattern: /brother/i, relationship: 'brother' },
        { pattern: /grandmother|grandma/i, relationship: 'grandmother' },
        { pattern: /grandfather|grandpa/i, relationship: 'grandfather' },
        { pattern: /friend/i, relationship: 'friend' },
        { pattern: /colleague|coworker|boss/i, relationship: 'work' }
      ];

      for (const { pattern, relationship } of relationshipPatterns) {
        if (pattern.test(allContent)) {
          inferredRelationship = relationship;
          break;
        }
      }

      return {
        success: true,
        person_name,
        profile_id: actualProfileId,
        inferred_relationship: inferredRelationship,
        events: include_events ? relatedEvents : [],
        facts: personFacts,
        total_mentions: relatedEvents.length + personFacts.length
      };
    } catch (error) {
      console.error('[ToolExecutors] get_people_context error:', error);
      return { success: false, error: error.message, person_name };
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateLunarPhase(date) {
  // Simplified lunar phase calculation
  const LUNAR_MONTH = 29.53059;
  const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  const diff = date - KNOWN_NEW_MOON;
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = (days % LUNAR_MONTH) / LUNAR_MONTH;

  if (phase < 0.0625) return 'New Moon';
  if (phase < 0.1875) return 'Waxing Crescent';
  if (phase < 0.3125) return 'First Quarter';
  if (phase < 0.4375) return 'Waxing Gibbous';
  if (phase < 0.5625) return 'Full Moon';
  if (phase < 0.6875) return 'Waning Gibbous';
  if (phase < 0.8125) return 'Last Quarter';
  if (phase < 0.9375) return 'Waning Crescent';
  return 'New Moon';
}

function calculateDayEnergy(date) {
  // Simplified day stem calculation
  const STEMS = ['甲 Wood Yang', '乙 Wood Yin', '丙 Fire Yang', '丁 Fire Yin', '戊 Earth Yang',
                 '己 Earth Yin', '庚 Metal Yang', '辛 Metal Yin', '壬 Water Yang', '癸 Water Yin'];
  const KNOWN_DATE = new Date('1900-01-01');
  const KNOWN_STEM = 0; // 甲
  const diff = Math.floor((date - KNOWN_DATE) / (1000 * 60 * 60 * 24));
  const stemIndex = (KNOWN_STEM + diff) % 10;
  return STEMS[(stemIndex + 10) % 10];
}

function calculateElementCompatibility(element1, element2) {
  const compatibility = {
    fire: { fire: 70, earth: 85, air: 90, water: 40 },
    earth: { fire: 85, earth: 75, air: 50, water: 80 },
    air: { fire: 90, earth: 50, air: 70, water: 60 },
    water: { fire: 40, earth: 80, air: 60, water: 75 }
  };
  return compatibility[element1?.toLowerCase()]?.[element2?.toLowerCase()] || 65;
}

function calculateAnimalCompatibility(animal1, animal2) {
  // Simplified Chinese zodiac compatibility
  const triads = {
    rat: ['dragon', 'monkey'],
    ox: ['snake', 'rooster'],
    tiger: ['horse', 'dog'],
    rabbit: ['goat', 'pig'],
    dragon: ['rat', 'monkey'],
    snake: ['ox', 'rooster'],
    horse: ['tiger', 'dog'],
    goat: ['rabbit', 'pig'],
    monkey: ['rat', 'dragon'],
    rooster: ['ox', 'snake'],
    dog: ['tiger', 'horse'],
    pig: ['rabbit', 'goat']
  };

  const a1 = animal1?.toLowerCase();
  const a2 = animal2?.toLowerCase();

  if (a1 === a2) return 75;
  if (triads[a1]?.includes(a2)) return 90;
  return 60;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXECUTOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Execute a tool call
 * @param {string} toolName - Name of the tool to execute
 * @param {Object} toolInput - Input parameters for the tool
 * @param {Object} context - Execution context (userId, profileId, etc.)
 * @returns {Object} - Tool execution result
 */
async function executeTool(toolName, toolInput, context) {
  const executor = toolExecutors[toolName];

  if (!executor) {
    return {
      success: false,
      error: `Unknown tool: ${toolName}`
    };
  }

  try {
    const result = await executor(toolInput, context);
    return result;
  } catch (error) {
    console.error(`[ToolExecutors] Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error.message,
      tool: toolName
    };
  }
}

/**
 * Execute multiple tool calls in parallel
 * @param {Array} toolCalls - Array of {name, input} objects
 * @param {Object} context - Execution context
 * @returns {Array} - Array of results
 */
async function executeTools(toolCalls, context) {
  return Promise.all(
    toolCalls.map(({ name, input }) => executeTool(name, input, context))
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  executeTool,
  executeTools,
  toolExecutors
};
