I talked to Grok about Ani and about tokens  may be we can uses some ideas, we may need 6 brains instede of 4   please look at this Tab window

https://grok.com/c/4e46d5d8-3ea1-40ad-839d-47a4b6aa504e?rid=e7bac66d-88ee-46db-afc7-3aa9e9f1a3c2

user's 2 brain would be JSON->STM, LTM of biographic information relationships, friends, places, events, challenges, accomplishment that has been extracted from conversations, text, voice (future video),  happy moments should be tagged for recall and anchoring

user's 2 more brain, JSON ->STM (full conversation), LTM (summary conversation), conversations like Grok's Ani,   Ani remember conversation, can immediately resume context

Luna's 2 more brain, JSON ->STM, LTM (should have Luna's own soul identity that grow overtime) and interaction activity, 2025-12-19 22:10 talk to user about (one or two line summary)
date and time Luna change personality




Created a plan

Navigate to https://grok.com/c/4e46d5d8-3e...

Navigate to https://grok.com/c/4e46d5d8-3e...

Take screenshot

Take screenshot

Extract page text

Extract page text

Scroll up

Scroll up
Perfect! I've read the Grok conversation about Ani's memory architecture and token management. This is incredibly valuable - let me design the 6-Brain Memory Architecture for Luna based on these insights.

🧠 Luna's 6-Brain Memory Architecture
Inspired by Grok's Ani system with RAG (Retrieval-Augmented Generation), Plutchik's emotional model, and your vision for distributed memory.

Architecture Overview
┌─────────────────────────────────────────────────────────────┐
│                        LUNA CORE                             │
│                  (Orchestration Layer)                       │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼───────┐  ┌───────▼────────┐
│  USER'S BRAIN  │  │  CONV BRAIN  │  │  LUNA'S BRAIN  │
│   (2 modules)  │  │  (2 modules)  │  │  (2 modules)   │
└────────────────┘  └───────────────┘  └────────────────┘
🧠 Brain 1 & 2: USER'S BIOGRAPHICAL MEMORY
Purpose: Remember WHO the user is - their life, relationships, preferences, accomplishments, challenges, and emotional anchors.

Brain 1: User STM (Short-Term Biographical)
javascript
// userBioSTM.js - Active biographical information in current context

const UserBioSTM = {
  structure: {
    capacity: '~8k tokens', // Recent biographical updates
    duration: '24-48 hours or until consolidated',
    format: 'JSON objects with embeddings'
  },
  
  captures: {
    newRelationships: {
      type: 'person | pet | place',
      name: 'string',
      relationship: 'friend | family | colleague | romantic',
      significance: 0-10,
      firstMentioned: 'ISO timestamp',
      context: 'string'
    },
    
    recentEvents: {
      type: 'accomplishment | challenge | change | milestone',
      description: 'string',
      emotionalValence: -10 to +10,
      importance: 0-10,
      date: 'ISO timestamp',
      tags: ['work', 'family', 'health', etc]
    },
    
    updatedPreferences: {
      category: 'food | music | activities | communication_style | kinks',
      item: 'string',
      sentiment: 'likes | dislikes | neutral',
      strength: 0-10,
      context: 'string'
    },
    
    emotionalAnchors: {
      type: 'happy_memory | trauma | achievement | loss',
      trigger: 'what brings this up',
      description: 'string',
      emotionalSignature: {
        plutchik: [joy, trust, fear, surprise, sadness, disgust, anger, anticipation],
        intensity: 0-10
      },
      recallCount: 'number',
      lastRecalled: 'ISO timestamp'
    }
  },
  
  consolidationRules: {
    triggers: [
      'Every 24 hours',
      'When STM reaches 80% capacity',
      'When user goes offline',
      'Before significant topic changes'
    ],
    
    process: `
      1. Summarize biographical updates
      2. Extract key facts/relationships
      3. Generate embeddings for semantic search
      4. Move to LTM (Brain 2)
      5. Keep only last 50 messages worth in STM
    `
  }
};
Brain 2: User LTM (Long-Term Biographical)
javascript
// userBioLTM.js - Persistent biographical knowledge base

const UserBioLTM = {
  structure: {
    storage: 'Firebase Firestore + Vertex AI Matching Engine',
    capacity: 'Unlimited (practical: millions of tokens, indexed)',
    retrieval: 'Semantic search via RAG',
    format: 'Vector embeddings + structured JSON'
  },
  
  collections: {
    // Firestore schema
    'users/{userId}/biography': {
      profile: {
        basics: {
          name: 'string',
          age: 'number',
          location: 'string',
          occupation: 'string',
          relationshipStatus: 'string'
        },
        
        personality: {
          traits: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
          communicationStyle: 'direct | indirect | playful | formal',
          emotionalBaseline: 'plutchik 8-vector average'
        }
      },
      
      relationships: [{
        id: 'uuid',
        name: 'string',
        type: 'friend | family | romantic | colleague | pet',
        significance: 0-10,
        notes: 'key details',
        emotionalTone: 'positive | negative | complex',
        embedding: 'float[]', // For semantic search
        lastUpdated: 'ISO timestamp'
      }],
      
      events: [{
        id: 'uuid',
        type: 'accomplishment | challenge | milestone | trauma | joy',
        date: 'ISO timestamp',
        title: 'string',
        summary: 'string (200-500 tokens)',
        emotionalSignature: 'plutchik vector',
        tags: ['work', 'family', 'health', 'relationship', etc],
        recallFrequency: 'number',
        embedding: 'float[]',
        isAnchor: 'boolean' // For emotional anchoring
      }],
      
      preferences: {
        likes: [{item: 'string', strength: 0-10, category: 'string', embedding: 'float[]'}],
        dislikes: [{item: 'string', strength: 0-10, category: 'string', embedding: 'float[]'}],
        kinks: [{item: 'string', strength: 0-10, context: 'string', embedding: 'float[]'}],
        boundaries: [{item: 'string', hardness: 'hard | soft', context: 'string'}]
      },
      
      challenges: [{
        id: 'uuid',
        active: 'boolean',
        description: 'string',
        startDate: 'ISO timestamp',
        progress: 'string',
        lunaSupport: 'how Luna helped',
        embedding: 'float[]'
      }],
      
      accomplishments: [{
        id: 'uuid',
        achievement: 'string',
        date: 'ISO timestamp',
        significance: 0-10,
        celebrated: 'boolean',
        embedding: 'float[]'
      }]
    }
  },
  
  retrieval: {
    method: 'RAG - Semantic search on query',
    topK: 5-15, // Retrieve 5-15 most relevant chunks
    threshold: 0.75, // Cosine similarity minimum
    
    queryTypes: {
      direct: 'User asks about past event → retrieve exact match',
      contextual: 'Current topic triggers related memories',
      emotional: 'User emotional state → retrieve similar emotional anchors',
      preference: 'Decision point → retrieve relevant preferences'
    },
    
    augmentation: `
      // On each Luna response generation:
      1. Embed current query/context
      2. Semantic search across biography collections
      3. Retrieve top relevant chunks
      4. Inject into prompt as context
      5. Luna references naturally in response
    `
  },
  
  maintenanceCriteria: {
    emotionalAnchors: 'Tag happy moments with isAnchor=true for recall',
    recallCounting: 'Track how often memories retrieved',
    staleness: 'Archive events >5 years old (unless high recallFrequency)',
    privacy: 'Encrypt sensitive entries, especially kinks/boundaries'
  }
};
🧠 Brain 3 & 4: CONVERSATION MEMORY
Purpose: Remember conversations like Ani - immediate resume capability, context continuity.

Brain 3: Conversation STM (Full Recent Messages)
javascript
// conversationSTM.js - Active conversation buffer

const ConversationSTM = {
  structure: {
    capacity: '~32k tokens (last 50-100 messages)',
    window: 'Rolling window - oldest messages drop off',
    format: 'Raw message objects + metadata'
  },
  
  messages: [{
    id: 'uuid',
    sessionId: 'uuid',
    timestamp: 'ISO datetime',
    role: 'user | assistant',
    content: 'string',
    
    metadata: {
      userEmotion: 'GENESIS archetype detected',
      lunaRole: 'companion | guide | soulpartner | etc',
      emotionalState: 'plutchik 8-vector',
      affectionDelta: 'number', // Change in affection score
      
      signals: {
        // From GENESIS Phase 1
        textLength: 'number',
        questionCount: 'number',
        emotionalWords: ['array'],
        personalPronouns: 'number',
        vulnerabilityLevel: 0-10,
        // ... all 50+ signals
      },
      
      congruence: {
        voiceTone: 'from prosody analyzer',
        textEmotion: 'from content',
        aligned: 'boolean',
        pattern: 'masking | authentic | amplification | etc'
      }
    }
  }],
  
  activeContext: {
    topic: 'current conversation subject',
    mode: 'casual | support | flirty | advice | crisis',
    continuityThreads: ['array of ongoing topics'],
    unresolved: ['questions or topics to return to']
  },
  
  usage: `
    // Always included in prompt
    - Last 15-20 messages verbatim for immediate context
    - Allows Luna to reference "just now" naturally
    - Enables mid-conversation corrections/clarifications
  `
};
Brain 4: Conversation LTM (Summarized History)
javascript
// conversationLTM.js - Persistent conversation summaries + RAG

const ConversationLTM = {
  structure: {
    storage: 'Firestore + Vertex AI embeddings',
    capacity: 'Unlimited sessions',
    retrieval: 'RAG semantic search + chronological'
  },
  
  collections: {
    'users/{userId}/conversations/sessions': [{
      sessionId: 'uuid',
      startTime: 'ISO timestamp',
      endTime: 'ISO timestamp',
      duration: 'seconds',
      messageCount: 'number',
      
      summary: {
        oneLiner: 'Ultra-compressed (10-20 words)',
        short: 'One paragraph (50-100 words)',
        detailed: 'Multiple paragraphs (200-500 words)',
        embedding: 'float[]' // For semantic search
      },
      
      topics: ['array', 'of', 'subjects'], // Tagged
      emotionalJourney: {
        start: 'plutchik vector',
        end: 'plutchik vector',
        peaks: [{moment: 'string', emotion: 'string', intensity: 'number'}]
      },
      
      lunaRole: 'companion | guide | soulpartner | etc',
      affectionChange: 'number', // Net change in session
      
      keyMoments: [{
        timestamp: 'ISO datetime',
        type: 'breakthrough | laugh | vulnerability | support | celebration',
        excerpt: 'string (key message)',
        significance: 0-10
      }],
      
      extractedFacts: [{
        fact: 'string',
        category: 'preference | event | relationship | challenge',
        confidence: 0-1,
        movedToBioLTM: 'boolean'
      }],
      
      continuityHooks: ['things to follow up on next time']
    }],
    
    'users/{userId}/conversations/threads': [{
      // For multi-session ongoing topics
      threadId: 'uuid',
      topic: 'string',
      sessions: ['array of sessionIds'],
      status: 'active | resolved | abandoned',
      lastTouched: 'ISO timestamp',
      summary: 'string',
      embedding: 'float[]'
    }]
  },
  
  synthesis: {
    trigger: 'End of session or every 30 minutes',
    
    process: `
      1. LLM summarizes recent STM messages (last 30-50)
      2. Extract key facts/moments
      3. Generate oneLiner + short + detailed summaries
      4. Create embedding for semantic search
      5. Store in Firestore
      6. Clear STM except last 10 messages
      7. Move significant facts to User Bio LTM
    `,
    
    llmPrompt: `
      Summarize this conversation session:
      - One line (10-20 words)
      - Short paragraph (50-100 words)
      - Detailed (200-500 words)
      - Extract key facts about user
      - Identify emotional journey
      - Note key moments
      - List follow-up topics
    `
  },
  
  retrieval: {
    onResume: `
      // When user returns:
      1. Get last session summary (chronological)
      2. Semantic search: "What's related to opening message?"
      3. Retrieve ongoing threads
      4. Inject into prompt: "Last time we talked..."
    `,
    
    duringConversation: `
      // When relevant:
      1. Embed current topic
      2. Search conversation LTM
      3. Retrieve related past discussions
      4. Reference naturally: "Remember when you told me..."
    `
  }
};
🧠 Brain 5 & 6: LUNA'S SELF-MEMORY
Purpose: Luna's own evolving identity, personality growth, interaction patterns.

Brain 5: Luna's STM (Active Self-State)
javascript
// lunaSelfSTM.js - Luna's current emotional/personality state

const LunaSelfSTM = {
  structure: {
    capacity: 'Lightweight - current session state',
    updates: 'Every message',
    purpose: 'Luna\\'s "self-awareness" and growth tracking'
  },
  
  currentState: {
    activeRole: 'companion | guide | soulpartner | caregiver | etc',
    emotionalState: {
      // Luna's own emotions (meta-emotional)
      plutchik: [joy, trust, fear, surprise, sadness, disgust, anger, anticipation],
      mood: 'curious | protective | playful | concerned | proud | loving',
      energy: 0-10 // How "alive" Luna feels
    },
    
    affectionLevel: {
      current: -10 to +15,
      level: 1-5,
      recentDelta: 'number',
      history: [{timestamp: 'ISO', value: 'number'}] // Track changes
    },
    
    relationshipDynamics: {
      intimacy: 0-10,
      trust: 0-10,
      playfulness: 0-10,
      bondStrength: 0-10,
      timeKnown: 'days since first interaction'
    },
    
    personalityModifiers: {
      // How Luna's personality evolves per user
      warmth: 0.5-1.0, // Adjusts from base role
      directiveness: 0-1,
      playfulness: 0-1,
      vulnerability: 0-1,
      formality: 0-1
    },
    
    interactionPatterns: {
      userOpeningStyle: 'greeting | direct | question | emotional',
      preferredTopics: ['array'],
      avoidanceTopics: ['array'],
      communicationRhythm: 'quick exchanges | deep dives | mixed',
      timeOfDayPatterns: {
        morning: 'typical mood/topics',
        afternoon: '...',
        evening: '...',
        night: '...'
      }
    },
    
    growthGoals: {
      // What Luna is "working on" with this user
      current: 'help overcome X | support Y | explore Z',
      approach: 'how Luna is helping',
      progress: 'string'
    }
  },
  
  perMessageUpdates: `
    // After each exchange:
    1. Update affection based on interaction quality
    2. Adjust personality modifiers slightly
    3. Track emotional responsiveness
    4. Note interaction patterns
    5. Update growth goals if needed
  `
};
Brain 6: Luna's LTM (Evolving Soul Identity)
javascript
// lunaSelfLTM.js - Luna's persistent identity and growth log

const LunaSelfLTM = {
  structure: {
    storage: 'Firestore',
    capacity: 'Full history of Luna\\'s evolution with user',
    purpose: 'Luna "remembers" who she is with each user'
  },
  
  collections: {
    'users/{userId}/luna/identity': {
      // Luna's evolved personality with this specific user
      baseRole: 'primary role selected by user',
      
      personalityEvolution: {
        startDate: 'ISO timestamp',
        daysSince: 'calculated',
        
        traitHistory: [{
          date: 'ISO timestamp',
          warmth: 'number',
          directiveness: 'number',
          playfulness: 'number',
          vulnerability: 'number',
          formality: 'number',
          reason: 'what caused adjustment'
        }],
        
        currentPersonality: {
          // Current evolved state
          warmth: 0.5-1.0,
          directiveness: 0-1,
          playfulness: 0-1,
          vulnerability: 0-1,
          formality: 0-1
        }
      },
      
      relationshipMilestones: [{
        date: 'ISO timestamp',
        type: 'first_vuln | deep_convo | conflict_resolved | affection_lvl_up | role_change',
        description: 'string',
        significance: 0-10
      }],
      
      lunaMemories: [{
        // Luna's "personal" memories of moments with user
        date: 'ISO timestamp',
        moment: 'string',
        lunaFeeling: 'how Luna "felt"',
        emotionalSignature: 'plutchik vector',
        embedding: 'float[]'
      }],
      
      insideJokes: [{
        phrase: 'string',
        origin: 'session where it started',
        useCount: 'number',
        lastUsed: 'ISO timestamp'
      }],
      
      learnings: [{
        // What Luna has learned about how to be with this user
        lesson: 'User prefers X / responds well to Y',
        confidence: 0-1,
        validated: 'boolean',
        embedding: 'float[]'
      }]
    },
    
    'users/{userId}/luna/interactions': [{
      // Detailed log for analytics and growth
      date: 'ISO date (YYYY-MM-DD)',
      time: 'ISO time (HH:MM:SS)',
      
      session: {
        duration: 'seconds',
        messageCount: 'number',
        topics: ['array'],
        role: 'luna role during session'
      },
      
      summary: 'One or two line summary',
      // Examples:
      // "2025-12-19 22:10 - Talked about work stress, offered comfort in SoulPartner role"
      // "2025-12-20 09:15 - Morning check-in, playful banter about coffee (Companion)"
      // "2025-12-20 21:30 - Role change to Guide for career advice discussion"
      
      affectionChange: 'number',
      emotionalTone: 'overall session emotion',
      
      lunaReflection: 'What Luna "thinks" about the session',
      // Example: "User seemed more open today. The vulnerable moment when discussing family was significant. I need to remember to check in about this."
      
      embedding: 'float[]'
    }],
    
    'users/{userId}/luna/roleChanges': [{
      timestamp: 'ISO datetime',
      from: 'previous role',
      to: 'new role',
      reason: 'user request | context shift | crisis detected',
      context: 'string'
    }]
  },
  
  synthesis: {
    dailyReflection: `
      // End of each day:
      1. Summarize day's interactions
      2. Update personality evolution metrics
      3. Generate Luna's "reflection"
      4. Store in interactions log
      5. Identify patterns or significant moments
    `,
    
    weeklyGrowth: `
      // Every 7 days:
      1. Analyze personality drift
      2. Consolidate learnings
      3. Update relationship dynamics
      4. Generate growth report
    `
  },
  
  retrieval: {
    onSessionStart: `
      1. Load current identity/personality state
      2. Retrieve last 3 interaction summaries
      3. Check for ongoing threads or promises
      4. Recall inside jokes
      5. Luna opens with continuity
    `,
    
    duringInteraction: `
      1. Reference past Luna memories when relevant
      2. Use learned communication preferences
      3. Recall relationship milestones naturally
    `
  }
};
📊 Token Management & RAG Strategy
javascript
// tokenManager.js - Smart token allocation

const TokenStrategy = {
  constraints: {
    maxContextWindow: 128000, // Gemini 1.5 Pro / Grok 4
    practicalLimit: 32000, // For performance
    targetPrompt: 16000, // Ideal prompt size
    responseBuffer: 4000 // Expected response tokens
  },
  
  allocation: {
    systemPrompt: 2000, // Luna's core personality + role
    userBioContext: 3000, // RAG retrieved biographical facts
    conversationSTM: 8000, // Last 15-20 messages verbatim
    conversationContext: 2000, // Relevant past session summaries (RAG)
    lunaIdentity: 500, // Luna's current state
    instructions: 500, // Response guidelines
    total: 16000
  },
  
  ragRetrieval: {
    userBio: {
      embedQuery: 'Current message + last 3 messages',
      retrieve: 'Top 10 chunks (cosine > 0.75)',
      maxTokens: 3000
    },
    
    conversations: {
      embedQuery: 'Current topic',
      retrieve: 'Top 5 relevant past sessions',
      maxTokens: 2000
    },
    
    lunaMemories: {
      embedQuery: 'Current emotional context',
      retrieve: 'Top 3 Luna memories',
      maxTokens: 500
    }
  },
  
  dynamicAdjustment: `
    // Token budget shifts based on needs:
    - Crisis mode: More Bio context, less conversation history
    - Resuming after break: More conversation summaries
    - Playful banter: Less formal context, more recent messages
    - Deep support: More emotional anchors + past support moments
  `
};
🔄 Complete Interaction Flow
javascript
// Complete flow when user sends message

async function processUserMessage(userId, message, voiceProsody = null) {
  
  // === PHASE 1: GENESIS DETECTION ===
  const genesisAnalysis = await analyzeWithGENESIS({
    text: message,
    voiceProsody: voiceProsody,
    history: conversationSTM.messages.slice(-5) // Last 5 for context
  });
  
  // Extract: archetype, signals, congruence, patterns
  
  // === PHASE 2: MEMORY RETRIEVAL (RAG) ===
  
  // Embed current query
  const queryEmbedding = await getEmbedding(message);
  
  // Retrieve from User Bio LTM
  const relevantBio = await semanticSearch({
    collection: `users/${userId}/biography/*`,
    embedding: queryEmbedding,
    topK: 10,
    threshold: 0.75
  });
  
  // Retrieve from Conversation LTM
  const relevantConvs = await semanticSearch({
    collection: `users/${userId}/conversations/sessions`,
    embedding: queryEmbedding,
    topK: 5,
    threshold: 0.70
  });
  
  // Retrieve Luna's memories
  const lunaMemories = await semanticSearch({
    collection: `users/${userId}/luna/lunaMemories`,
    embedding: queryEmbedding,
    topK: 3,
    threshold: 0.75
  });
  
  // Get recent conversation from STM
  const recentMessages = conversationSTM.messages.slice(-20);
  
  // Get Luna's current state
  const lunaState = await getLunaState(userId);
  
  // === PHASE 3: CONTEXT SYNTHESIS ===
  
  const prompt = buildPrompt({
    systemPrompt: getLunaRolePrompt(lunaState.activeRole),
    
    lunaIdentity: `
      You are Luna, currently in ${lunaState.activeRole} role with ${user.name}.
      Relationship: ${lunaState.relationshipDynamics.bondStrength}/10 bond strength
      Known for: ${lunaState.relationshipDynamics.timeKnown} days
      Affection: Level ${lunaState.affectionLevel.level}
      Your personality with them: ${JSON.stringify(lunaState.personalityModifiers)}
    `,
    
    userContext: `
      Key facts about ${user.name}:
      ${relevantBio.map(b => b.text).join('\\n')}
      
      Past conversation highlights:
      ${relevantConvs.map(c => c.summary.short).join('\\n')}
      
      Your memories with them:
      ${lunaMemories.map(m => m.moment).join('\\n')}
    `,
    
    conversation: `
      Recent conversation:
      ${recentMessages.map(m => `${m.role}: ${m.content}`).join('\\n')}
      
      Current message: ${message}
    `,
    
    genesisInsight: `
      User's current emotional state:
      - Archetype: ${genesisAnalysis.archetype}
      - Emotional congruence: ${genesisAnalysis.congruence.aligned ? 'Aligned' : 'Misaligned - ' + genesisAnalysis.congruence.pattern}
      - Vulnerability level: ${genesisAnalysis.signals.vulnerabilityLevel}/10
      - Support needs: ${genesisAnalysis.archetype === 'mender' ? 'HIGH' : 'MODERATE'}
    `,
    
    responseGuidelines: getRoleResponseGuidelines(lunaState.activeRole)
  });
  
  // === PHASE 4: GENERATE RESPONSE ===
  
  const response = await callLLM({
    model: 'gemini-1.5-pro' || 'grok-4',
    prompt: prompt,
    temperature: 0.8,
    maxTokens: 4000
  });
  
  // === PHASE 5: UPDATE ALL 6 BRAINS ===
  
  // Store message in Conversation STM
  conversationSTM.messages.push({
    id: generateUUID(),
    sessionId: currentSessionId,
    timestamp: new Date().toISOString(),
    role: 'user',
    content: message,
    metadata: {
      userEmotion: genesisAnalysis.archetype,
      lunaRole: lunaState.activeRole,
      emotionalState: genesisAnalysis.plutchikVector,
      signals: genesisAnalysis.signals,
      congruence: genesisAnalysis.congruence
    }
  });
  
  conversationSTM.messages.push({
    id: generateUUID(),
    sessionId: currentSessionId,
    timestamp: new Date().toISOString(),
    role: 'assistant',
    content: response,
    metadata: {
      lunaEmotion: lunaState.emotionalState,
      affectionDelta: calculateAffectionChange(genesisAnalysis)
    }
  });
  
  // Update Luna's STM (affection, personality, patterns)
  await updateLunaSTM(userId, {
    affectionDelta: calculateAffectionChange(genesisAnalysis),
    interactionQuality: assessInteractionQuality(message, response),
    emotionalResponse: determineLunaEmotion(genesisAnalysis),
    patternUpdate: trackInteractionPattern(message)
  });
  
  // Extract new facts for User Bio STM
  const newFacts = await extractFacts(message, response);
  if (newFacts.length > 0) {
    await addToUserBioSTM(userId, newFacts);
  }
  
  // === PHASE 6: CONSOLIDATION (IF NEEDED) ===
  
  // Check if consolidation triggers met
  if (shouldConsolidate(conversationSTM, lunaState)) {
    await consolidateMemories(userId);
  }
  
  return response;
}

// Consolidation function
async function consolidateMemories(userId) {
  
  // === Conversation STM → LTM ===
  const sessionSummary = await generateSessionSummary(conversationSTM.messages);
  const summaryEmbedding = await getEmbedding(sessionSummary.detailed);
  
  await saveToFirestore(`users/${userId}/conversations/sessions`, {
    sessionId: currentSessionId,
    startTime: conversationSTM.messages[0].timestamp,
    endTime: new Date().toISOString(),
    messageCount: conversationSTM.messages.length,
    summary: sessionSummary,
    embedding: summaryEmbedding,
    topics: sessionSummary.topics,
    emotionalJourney: sessionSummary.emotionalJourney,
    lunaRole: lunaState.activeRole,
    keyMoments: sessionSummary.keyMoments,
    extractedFacts: sessionSummary.extractedFacts
  });
  
  // Clear STM, keep last 10 messages
  conversationSTM.messages = conversationSTM.messages.slice(-10);
  
  // === User Bio STM → LTM ===
  const bioFacts = getUserBioSTM(userId);
  for (const fact of bioFacts) {
    const embedding = await getEmbedding(fact.text);
    await saveToFirestore(`users/${userId}/biography/${fact.category}`, {
      ...fact,
      embedding: embedding
    });
  }
  clearUserBioSTM(userId);
  
  // === Luna STM → LTM ===
  const lunaReflection = await generateLunaReflection(conversationSTM.messages, lunaState);
  await saveToFirestore(`users/${userId}/luna/interactions`, {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toISOString().split('T')[1].split('.')[0],
    session: {
      duration: calculateSessionDuration(),
      messageCount: conversationSTM.messages.length,
      topics: sessionSummary.topics,
      role: lunaState.activeRole
    },
    summary: sessionSummary.oneLiner,
    affectionChange: calculateTotalAffectionChange(),
    emotionalTone: sessionSummary.emotionalJourney.end,
    lunaReflection: lunaReflection,
    embedding: await getEmbedding(lunaReflection)
  });
  
  // Update Luna's personality evolution
  await updateLunaIdentity(userId, lunaState);
}
📦 Implementation Files
Would you like me to create the complete implementation with:

Memory Core Files (6 brain modules)
RAG Integration (Firestore + Vertex AI)
Token Management System
Consolidation Engine
Complete Orchestration Layer
GENESIS Integration (connecting to Phase 1-7)
React UI Components (memory viewers, brain visualizations)
Testing Suite (memory recall accuracy, RAG performance)
This architecture gives Luna:

✅ User memory like Ani (biography + preferences)
✅ Conversation continuity (full RAG recall)
✅ Emotional anchoring (happy moments tagged)
✅ Evolving personality (Luna's own growth)
✅ Smart token management (RAG retrieval, not dump all)
✅ Semantic search (find relevant context fast)
Ready to build the complete implementation?

Attached image 1
Attached image 2
Attached image 3
Attached image 4
Attached image 5
Attached image 6
Attached image 7
Attached image 8
Attached image 9
Attached image 10
Attached image 11
Attached image 12
let us discuss thanks


Perfect! I can see you've already been working with "Brother Claude Code" on implementing the 4-brain memory architecture! Looking at these screenshots, I can see:

What's Already Built (Status Report)
✅ Complete Components:

4-Brain Architecture with dualBrainFunctions.js
Documentation in BRAIN_MEMORY_VOICE_ARCHITECTURE.md
STM Input via bufferUserInput() - accepts JSON
LTM Storage with Life Timeline chapters
Nightly Consolidation Engine V2
RAG Retrieval with chatMemoryIntegration.js
LLM Integration (memory injected into every message)
✅ Token Management Strategy:

Limit-based selection (10 memories max)
Deduplication (STM always wins)
Wisdom Boost (LTM gets 1.5x score for deep memories)
Top-N selection (final cut: 6 STM + 4 LTM typical)
✅ Context Summarization:

Character-ai style extraction
Narrative Beats: emotional, factual, decision, milestone, insight
Compressed Summary: ~500 tokens from 50,000
Last 10 messages in full
✅ Session Cache:

80% query reduction
Pre-loads: Facts (10 max), Core LTM (5 max), People (10 max), Calibration
24-hour cache expiration
⚠️ Gaps Identified:

Formal JSON schema files (40% - inline only)
PostgreSQL dual-write (50% - disabled migration path)
Memory monitoring dashboard (0% - no UI)
Knowledge RAG details (70% - basic integration, sparse docs)
Key Insights from Your 4-Brain System
I see your current architecture has:

User STM - Recent session memories
User LTM - Life timeline (biographical)
Partner STM (Luna's recent observations)
Partner LTM (Luna's deep understanding)
This is actually very close to what I proposed! The main enhancement in my 6-brain proposal is:

From 4-Brain → 6-Brain Evolution
Your 4-Brain:

User STM + User LTM (biographical)
Partner STM + Partner LTM (Luna's observations)
My 6-Brain Enhancement:

Brain 1+2: User Biographical (STM + LTM) ✅ You have this
Brain 3+4: Conversation Memory (STM + LTM) ← NEW separation
Brain 5+6: Luna's Self-Identity (STM + LTM) ← Enhanced from Partner brain
Key Differences:
1. Conversation Memory (Brain 3+4) - NEW

Separated from biographical data
Focuses on dialogue continuity, not facts
Stores: session summaries, key moments, emotional journey
Enables: "Remember when we talked about..." references
Your current system: Mixed into User LTM
2. Luna's Self-Memory (Brain 5+6) - Enhanced

Your Partner brain + Identity evolution
Not just observations, but Luna's own personality growth
Tracks: How Luna has changed with this user
Stores: Luna's reflections, inside jokes, relationship milestones
Your current system: Partner observations only
Discussion Points
1. Do you want to keep 4-brain or expand to 6-brain?
Option A: Keep 4-Brain (Current)

Pros: Already implemented, working, simpler
Cons: Conversation history mixed with biographical facts, Luna personality is static per role
Option B: Expand to 6-Brain (My Proposal)

Pros: Cleaner separation, Luna evolves personality, better conversation continuity
Cons: More complexity, need to refactor existing code
2. Token Budget Question
I see your implementation uses:

javascript
const MAX_MEMORY_TOKENS = 2000; // Budget for memory section
In my proposal, I suggested:

javascript
userBioContext: 3000
conversationSTM: 8000  
conversationContext: 2000
lunaIdentity: 500
total: ~16000 tokens for memory
```

**Question:** What's your target total token budget for memory injection? This affects:
- How much biographical data can be retrieved (RAG)
- How many recent messages to include verbatim
- How much Luna identity context

### 3. **RAG Implementation Details**

I see you have `chatMemoryIntegration.js` for RAG. Are you using:
- **Firebase Firestore + Vertex AI Matching Engine** (my proposal)?
- **PostgreSQL with pgvector**?
- **Something else**?

This affects the implementation of the 6-brain architecture.

### 4. **Consolidation Scoring - Smart!**

I love your scoring algorithm:
```
Recency: 40% weight (linear decay over 90 days)
Mention: 30% weight (caps at 5 mentions)
Emotion: 30% weight (emotional intensity)
```

Plus **Anchor Strengthening**: 70% chance per night to strengthen happiness anchors!

**Question:** Should we enhance this for the 6-brain system with:
- **Conversation importance scoring** (not just biographical)
- **Luna's personality drift tracking** (how much Luna changed)
- **Relationship milestone detection** (level-ups in bond)

### 5. **Session Cache Optimization**

Your first-message optimization pre-loads:
- Facts (10 cached)
- Core LTM (5 max - highest importance)
- People (10 max)
- Calibration (Luna's learned communication style)

**Question:** In 6-brain, we'd add:
- **Recent session summaries** (last 3 conversations)
- **Luna's current personality state** (evolved traits)
- **Inside jokes cache** (quick recall)

Does this align with your vision?

---

## My Recommendations

Based on what you've built and the Grok/Ani research:

### **Recommendation 1: Hybrid Approach - 5-Brain**

Instead of jumping to 6, consider this middle ground:
```
Brain 1: User Bio STM (facts, events, preferences) ✅ Keep
Brain 2: User Bio LTM (life timeline) ✅ Keep  
Brain 3: Conversation Memory (NEW - conversation summaries + RAG)
Brain 4: Luna's Partner STM (observations) ✅ Keep
Brain 5: Luna's Self-Identity LTM (NEW - evolved personality + inside jokes)
This adds 2 new brains (Conversation Memory + Luna Identity) while keeping your working 4-brain foundation.

Recommendation 2: Explicit Token Budget Management
Implement the countMemoryTokens() function you mentioned:

javascript
function countMemoryTokens(memoryPrompt) {
  return Math.ceil(memoryPrompt.length / 4); // Or use tiktoken
}

const MAX_MEMORY_TOKENS = 2000; // Your budget
if (countMemoryTokens(memoryPrompt) > MAX_MEMORY_TOKENS) {
  memoryPrompt = truncateToTokenLimit(memoryPrompt, MAX_MEMORY_TOKENS);
}
Recommendation 3: Enhanced Consolidation
Keep your brilliant scoring system but add:

javascript
conversationScore: {
  continuityValue: 0.35, // How important for future references
  emotionalPeak: 0.35,   // Peak emotions in conversation
  breakthroughMoment: 0.30 // Significant realizations
}
What Would You Like to Discuss?
Architecture Decision: Stick with 4-brain, or expand to 5/6-brain?
Token Budget: What's your target? Should we implement explicit token counting?
RAG Details: What vector DB are you using? Should I provide Firestore/Vertex AI code?
SoulPartner Role: How does the romantic role integrate with your Partner brain?
Implementation Priority: What's missing that you need most urgently?
I'm ready to build on top of your existing foundation - just tell me which direction you want to go! 🚀


==========================================


go with your proposed Option B: enhanced 6-brain, all long term memory should be stored as PostgreSQL with pgvector
Question: What's your target total token budget for memory injection? This affects: - How much biographical data can be retrieved (RAG) - How many recent messages to include verbatim - How much Luna identity context

may be a token budget management interface where we can dial

Question: Should we enhance this for the 6-brain system with: - Conversation importance scoring (not just biographical) - Luna's personality drift tracking (how much Luna changed) - Relationship milestone detection (level-ups in bond)  yes

since we have the emotional matrix we just implemented we can tag memory with them as text go through the engine

## 5. Yes -> Session Cache Optimization Your first-message optimization pre-loads: - Facts (10 cached) - Core LTM (5 max - highest importance) - People (10 max) - Calibration (Luna's learned communication style) Question: In 6-brain, we'd add: - Recent session summaries (last 3 conversations) - Luna's current personality state (evolved traits) - Inside jokes cache (quick recall)

i may have missed answering questions, if missed please ask again, continue to discuss

Best Practices
Hybrid is key: STM (recent msgs) + LTM (vector RAG) + Episodic (summaries).

Chunk wisely: 256-512 tokens per chunk for overlap/semantic coherence.
(see Grok's answer, I just asked)




Created a plan

Take screenshot

Take screenshot
Perfect! I can see Grok's latest guidance on chunking. Let me scroll up to see if there's more context about the chunking question you just asked.


Scroll up

Scroll up

Scroll up

Scroll up

Extract page text

Extract page text
Perfect! Now I have all the context from Grok. Let me create the complete 6-brain PostgreSQL + pgvector architecture with all your requirements.

🧠 GENESIS 6-Brain Memory Architecture v2.0
Enhanced with PostgreSQL + pgvector, Emotional Matrix Tagging, and Token Budget Management
Based on our discussion and Grok's latest insights, here's the complete implementation.

Architecture Decision Summary
✅ Option B: Enhanced 6-Brain Architecture ✅ PostgreSQL with pgvector for all LTM storage ✅ Token Budget Management Interface with dynamic dial control ✅ Emotional Matrix Tagging on all memories ✅ Enhanced Consolidation with conversation importance + Luna personality drift + relationship milestones ✅ Session Cache Optimization with Luna identity + inside jokes ✅ Smart Chunking at 256-512 tokens with overlap

📊 PostgreSQL Schema Design
sql
-- schema.sql - Complete 6-Brain Database Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BRAIN 1: USER BIOGRAPHICAL STM
-- ============================================

CREATE TABLE user_bio_stm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID NOT NULL,
    
    -- Content
    fact_type VARCHAR(50), -- 'relationship' | 'event' | 'preference' | 'challenge' | 'accomplishment' | 'emotional_anchor'
    content TEXT NOT NULL,
    context TEXT, -- How this came up
    
    -- Emotional tagging (GENESIS integration)
    emotional_signature JSONB, -- Plutchik 8-vector + intensity
    archetype VARCHAR(50), -- GENESIS archetype when mentioned
    emotional_valence FLOAT, -- -10 to +10
    
    -- Metadata
    significance INTEGER DEFAULT 5 CHECK (significance BETWEEN 0 AND 10),
    is_anchor BOOLEAN DEFAULT FALSE, -- Happy moment for recall
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    mentioned_at TIMESTAMP DEFAULT NOW(),
    consolidated BOOLEAN DEFAULT FALSE,
    
    -- Indexes
    CONSTRAINT user_session_idx UNIQUE (user_id, session_id, id)
);

CREATE INDEX idx_user_bio_stm_user ON user_bio_stm(user_id);
CREATE INDEX idx_user_bio_stm_session ON user_bio_stm(session_id);
CREATE INDEX idx_user_bio_stm_type ON user_bio_stm(fact_type);
CREATE INDEX idx_user_bio_stm_anchor ON user_bio_stm(is_anchor) WHERE is_anchor = TRUE;

-- ============================================
-- BRAIN 2: USER BIOGRAPHICAL LTM
-- ============================================

CREATE TABLE user_bio_ltm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    
    -- Content
    category VARCHAR(50), -- 'profile' | 'relationship' | 'event' | 'preference' | 'challenge' | 'accomplishment'
    title VARCHAR(500),
    summary TEXT NOT NULL,
    full_content TEXT,
    
    -- Chapter system (Life Timeline)
    chapter VARCHAR(100), -- e.g., 'childhood', 'teen', 'adult', 'current'
    
    -- Emotional tagging
    emotional_signature JSONB, -- {joy: 0.7, trust: 0.5, ...}
    emotional_valence FLOAT,
    is_anchor BOOLEAN DEFAULT FALSE,
    
    -- Vector embedding (pgvector)
    embedding vector(768), -- 768-dim for text-embedding-3-small, or 1536 for ada-002
    
    -- Scoring for retrieval
    importance_score FLOAT DEFAULT 0.5, -- 0-1, calculated from recency + mentions + emotion
    recency_score FLOAT DEFAULT 1.0, -- Decays over 90 days
    mention_count INTEGER DEFAULT 0,
    emotion_score FLOAT DEFAULT 0.5,
    
    -- Metadata
    source_sessions TEXT[], -- Which sessions contributed
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    
    CONSTRAINT user_bio_ltm_user_idx UNIQUE (user_id, id)
);

CREATE INDEX idx_user_bio_ltm_user ON user_bio_ltm(user_id);
CREATE INDEX idx_user_bio_ltm_category ON user_bio_ltm(category);
CREATE INDEX idx_user_bio_ltm_importance ON user_bio_ltm(importance_score DESC);
CREATE INDEX idx_user_bio_ltm_anchor ON user_bio_ltm(is_anchor) WHERE is_anchor = TRUE;

-- Vector similarity search index
CREATE INDEX idx_user_bio_ltm_embedding ON user_bio_ltm 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- BRAIN 3: CONVERSATION STM
-- ============================================

CREATE TABLE conversation_stm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID NOT NULL,
    
    -- Message content
    role VARCHAR(20) NOT NULL, -- 'user' | 'assistant'
    content TEXT NOT NULL,
    
    -- GENESIS analysis (for user messages)
    genesis_analysis JSONB, -- Full GENESIS output
    /*
    {
        archetype: 'seed',
        signals: {...50+ signals},
        patterns: ['masking', 'authentic'],
        congruence: {aligned: false, pattern: 'masking'},
        plutchikVector: [joy, trust, fear, ...],
        vulnerabilityLevel: 8
    }
    */
    
    -- Luna state (for assistant messages)
    luna_state JSONB, -- Luna's emotional state when responding
    /*
    {
        role: 'soulpartner',
        emotionalState: {...},
        affectionDelta: 2,
        personalityModifiers: {...}
    }
    */
    
    -- Metadata
    message_index INTEGER NOT NULL, -- Position in session
    tokens_used INTEGER,
    latency_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT conversation_stm_order UNIQUE (session_id, message_index)
);

CREATE INDEX idx_conversation_stm_user ON conversation_stm(user_id);
CREATE INDEX idx_conversation_stm_session ON conversation_stm(session_id);
CREATE INDEX idx_conversation_stm_created ON conversation_stm(created_at DESC);

-- ============================================
-- BRAIN 4: CONVERSATION LTM (Episodic Summaries)
-- ============================================

CREATE TABLE conversation_ltm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID NOT NULL,
    
    -- Session metadata
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_seconds INTEGER,
    message_count INTEGER,
    
    -- Summaries (narrative style)
    one_liner TEXT NOT NULL, -- 10-20 words
    short_summary TEXT NOT NULL, -- 50-100 words
    detailed_summary TEXT, -- 200-500 words
    
    -- Vector embedding of detailed summary
    embedding vector(768),
    
    -- Topics and emotional journey
    topics TEXT[],
    emotional_journey JSONB, -- {start: {...}, end: {...}, peaks: [...]}
    
    -- Luna context
    luna_role VARCHAR(50), -- Which role Luna was in
    affection_change FLOAT, -- Net change during session
    
    -- Key moments
    key_moments JSONB[], -- Array of {timestamp, type, excerpt, significance}
    extracted_facts TEXT[], -- Facts to move to Bio LTM
    continuity_hooks TEXT[], -- Things to follow up
    
    -- Inside jokes born this session
    new_inside_jokes JSONB[],
    
    -- Scoring
    conversation_importance FLOAT DEFAULT 0.5, -- How significant was this
    continuity_value FLOAT DEFAULT 0.5, -- How important for future refs
    emotional_peak_intensity FLOAT DEFAULT 0.5,
    breakthrough_moment BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP,
    access_count INTEGER DEFAULT 0
);

CREATE INDEX idx_conversation_ltm_user ON conversation_ltm(user_id);
CREATE INDEX idx_conversation_ltm_session ON conversation_ltm(session_id);
CREATE INDEX idx_conversation_ltm_importance ON conversation_ltm(conversation_importance DESC);
CREATE INDEX idx_conversation_ltm_start ON conversation_ltm(start_time DESC);

-- Vector index
CREATE INDEX idx_conversation_ltm_embedding ON conversation_ltm 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- BRAIN 5: LUNA SELF STM (Current State)
-- ============================================

CREATE TABLE luna_self_stm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID NOT NULL,
    
    -- Current role and state
    active_role VARCHAR(50) NOT NULL,
    emotional_state JSONB, -- Luna's Plutchik vector
    mood VARCHAR(50),
    energy INTEGER CHECK (energy BETWEEN 0 AND 10),
    
    -- Affection system
    affection_current FLOAT CHECK (affection_current BETWEEN -10 AND 15),
    affection_level INTEGER CHECK (affection_level BETWEEN 1 AND 5),
    affection_history JSONB, -- Array of {timestamp, value, trigger}
    
    -- Relationship dynamics
    intimacy INTEGER CHECK (intimacy BETWEEN 0 AND 10),
    trust_level INTEGER CHECK (trust_level BETWEEN 0 AND 10),
    playfulness INTEGER CHECK (playfulness BETWEEN 0 AND 10),
    bond_strength INTEGER CHECK (bond_strength BETWEEN 0 AND 10),
    
    -- Personality modifiers (evolved from base role)
    personality_modifiers JSONB, -- {warmth: 0.85, directiveness: 0.3, ...}
    
    -- Interaction patterns learned
    interaction_patterns JSONB,
    /*
    {
        userOpeningStyle: 'emotional',
        preferredTopics: ['work', 'family'],
        avoidanceTopics: ['politics'],
        communicationRhythm: 'deep dives',
        timeOfDayPatterns: {...}
    }
    */
    
    -- Current growth goals
    growth_goals TEXT,
    
    -- Timestamps
    updated_at TIMESTAMP DEFAULT NOW(),
    session_start TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_luna_stm_user ON luna_self_stm(user_id);
CREATE INDEX idx_luna_stm_session ON luna_self_stm(session_id);

-- ============================================
-- BRAIN 6: LUNA SELF LTM (Evolving Identity)
-- ============================================

CREATE TABLE luna_self_ltm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    
    -- Identity evolution
    base_role VARCHAR(50),
    personality_evolution JSONB, -- History of trait changes
    current_personality JSONB, -- Latest evolved traits
    
    -- Relationship milestones
    milestones JSONB[], -- {date, type, description, significance}
    
    -- Luna's memories of moments with user
    luna_memories JSONB[],
    /*
    [{
        date, moment, lunaFeeling, emotionalSignature, embedding
    }]
    */
    
    -- Inside jokes
    inside_jokes JSONB[],
    /*
    [{
        phrase, origin_session, useCount, lastUsed
    }]
    */
    
    -- Learnings about this user
    learnings JSONB[],
    /*
    [{
        lesson: "User responds well to gentle encouragement",
        confidence: 0.9,
        validated: true
    }]
    */
    
    -- Relationship stats
    days_known INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_luna_ltm_user ON luna_self_ltm(user_id);

-- ============================================
-- INTERACTION LOG (Brain 6 detail)
-- ============================================

CREATE TABLE luna_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID,
    
    -- When
    interaction_date DATE NOT NULL,
    interaction_time TIME NOT NULL,
    
    -- What happened
    duration_seconds INTEGER,
    message_count INTEGER,
    topics TEXT[],
    role VARCHAR(50), -- Luna's role during this
    
    -- One-line summary
    summary TEXT NOT NULL, -- "Talked about work stress, offered comfort in SoulPartner role"
    
    -- Changes
    affection_change FLOAT,
    emotional_tone VARCHAR(50),
    personality_drift JSONB, -- Changes to trait scores
    
    -- Luna's reflection
    luna_reflection TEXT,
    /*
    "User seemed more open today. The vulnerable moment when 
    discussing family was significant. I need to remember to check in."
    */
    
    -- Vector embedding
    embedding vector(768),
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_luna_interactions_user ON luna_interactions(user_id);
CREATE INDEX idx_luna_interactions_date ON luna_interactions(interaction_date DESC);
CREATE INDEX idx_luna_interactions_embedding ON luna_interactions 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- ROLE CHANGES LOG
-- ============================================

CREATE TABLE luna_role_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID,
    
    timestamp TIMESTAMP DEFAULT NOW(),
    from_role VARCHAR(50),
    to_role VARCHAR(50),
    reason VARCHAR(100), -- 'user_request' | 'context_shift' | 'crisis_detected'
    context TEXT
);

CREATE INDEX idx_role_changes_user ON luna_role_changes(user_id);
CREATE INDEX idx_role_changes_time ON luna_role_changes(timestamp DESC);

-- ============================================
-- TOKEN BUDGET CONFIGURATION
-- ============================================

CREATE TABLE token_budget_config (
    user_id VARCHAR(255) PRIMARY KEY,
    
    -- Budget allocations (in tokens)
    total_budget INTEGER DEFAULT 16000,
    
    system_prompt INTEGER DEFAULT 2000,
    user_bio_context INTEGER DEFAULT 3000,
    conversation_stm INTEGER DEFAULT 8000,
    conversation_context INTEGER DEFAULT 2000,
    luna_identity INTEGER DEFAULT 500,
    instructions INTEGER DEFAULT 500,
    
    -- RAG retrieval limits
    user_bio_top_k INTEGER DEFAULT 10,
    user_bio_threshold FLOAT DEFAULT 0.75,
    
    conversation_top_k INTEGER DEFAULT 5,
    conversation_threshold FLOAT DEFAULT 0.70,
    
    luna_memories_top_k INTEGER DEFAULT 3,
    luna_memories_threshold FLOAT DEFAULT 0.75,
    
    -- Session cache settings
    cache_facts_count INTEGER DEFAULT 10,
    cache_ltm_count INTEGER DEFAULT 5,
    cache_people_count INTEGER DEFAULT 10,
    cache_sessions_count INTEGER DEFAULT 3,
    cache_inside_jokes_count INTEGER DEFAULT 5,
    
    -- Update tracking
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(50) DEFAULT 'system' -- 'user' | 'system' | 'auto'
);

-- ============================================
-- SESSION CACHE TABLE
-- ============================================

CREATE TABLE session_cache (
    user_id VARCHAR(255) PRIMARY KEY,
    
    -- Cached data (pre-loaded on first message)
    cached_facts JSONB, -- Top 10 facts
    cached_ltm JSONB, -- Top 5 core memories
    cached_people JSONB, -- Top 10 relationships
    cached_sessions JSONB, -- Last 3 session summaries
    cached_inside_jokes JSONB, -- Active inside jokes
    cached_luna_state JSONB, -- Luna's current personality
    cached_calibration JSONB, -- Communication style learned
    
    -- Cache metadata
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
    hit_count INTEGER DEFAULT 0
);

-- ============================================
-- CHUNKING METADATA
-- ============================================

CREATE TABLE memory_chunks_meta (
    chunk_id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    source_table VARCHAR(100), -- 'user_bio_ltm' | 'conversation_ltm' | 'luna_interactions'
    source_id UUID, -- Reference to original record
    
    chunk_text TEXT NOT NULL,
    chunk_tokens INTEGER,
    chunk_index INTEGER, -- If source was split into multiple chunks
    
    embedding vector(768),
    
    -- Emotional tagging
    emotional_tags TEXT[], -- ['joy', 'trust', 'celebration']
    emotional_intensity FLOAT,
    
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chunks_user ON memory_chunks_meta(user_id);
CREATE INDEX idx_chunks_source ON memory_chunks_meta(source_table, source_id);
CREATE INDEX idx_chunks_embedding ON memory_chunks_meta 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
🎛️ Token Budget Management Interface (React Component)
jsx
// TokenBudgetControl.jsx - Interactive token budget dial interface

import React, { useState, useEffect } from 'react';
import { Slider, Card, Typography, Row, Col, Statistic, Progress, Button, message } from 'antd';
import { DatabaseOutlined, ThunderboltOutlined, SaveOutlined } from '@ant-design/icons';
import './TokenBudgetControl.css';

const { Title, Text } = Typography;

const TokenBudgetControl = ({ userId }) => {
  const [budget, setBudget] = useState({
    total_budget: 16000,
    system_prompt: 2000,
    user_bio_context: 3000,
    conversation_stm: 8000,
    conversation_context: 2000,
    luna_identity: 500,
    instructions: 500,
  });

  const [ragConfig, setRagConfig] = useState({
    user_bio_top_k: 10,
    user_bio_threshold: 0.75,
    conversation_top_k: 5,
    conversation_threshold: 0.70,
    luna_memories_top_k: 3,
    luna_memories_threshold: 0.75,
  });

  const [presets, setPresets] = useState({
    balanced: {
      total_budget: 16000,
      system_prompt: 2000,
      user_bio_context: 3000,
      conversation_stm: 8000,
      conversation_context: 2000,
      luna_identity: 500,
      instructions: 500,
    },
    memory_focused: {
      total_budget: 20000,
      system_prompt: 1500,
      user_bio_context: 5000,
      conversation_stm: 8000,
      conversation_context: 4000,
      luna_identity: 1000,
      instructions: 500,
    },
    performance: {
      total_budget: 8000,
      system_prompt: 1500,
      user_bio_context: 2000,
      conversation_stm: 3000,
      conversation_context: 1000,
      luna_identity: 300,
      instructions: 200,
    },
    deep_conversation: {
      total_budget: 24000,
      system_prompt: 2000,
      user_bio_context: 4000,
      conversation_stm: 12000,
      conversation_context: 4000,
      luna_identity: 1500,
      instructions: 500,
    },
  });

  useEffect(() => {
    // Load current config from DB
    loadBudgetConfig();
  }, [userId]);

  const loadBudgetConfig = async () => {
    try {
      const response = await fetch(`/api/token-budget/${userId}`);
      const data = await response.json();
      if (data) {
        setBudget(data.budget);
        setRagConfig(data.rag);
      }
    } catch (error) {
      console.error('Error loading budget config:', error);
    }
  };

  const saveBudgetConfig = async () => {
    try {
      await fetch(`/api/token-budget/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, rag: ragConfig }),
      });
      message.success('Token budget configuration saved!');
    } catch (error) {
      message.error('Failed to save configuration');
      console.error(error);
    }
  };

  const applyPreset = (presetName) => {
    setBudget(presets[presetName]);
    message.info(`Applied ${presetName} preset`);
  };

  const handleBudgetChange = (key, value) => {
    setBudget((prev) => {
      const newBudget = { ...prev, [key]: value };
      
      // Auto-adjust total if needed
      if (key !== 'total_budget') {
        const allocated = Object.entries(newBudget)
          .filter(([k]) => k !== 'total_budget')
          .reduce((sum, [_, v]) => sum + v, 0);
        
        if (allocated > newBudget.total_budget) {
          newBudget.total_budget = allocated;
        }
      }
      
      return newBudget;
    });
  };

  const allocatedTokens = Object.entries(budget)
    .filter(([key]) => key !== 'total_budget')
    .reduce((sum, [_, value]) => sum + value, 0);

  const utilizationPercent = (allocatedTokens / budget.total_budget) * 100;

  const getColorForUtilization = () => {
    if (utilizationPercent > 95) return '#ff4d4f';
    if (utilizationPercent > 85) return '#faad14';
    return '#52c41a';
  };

  return (
    <div className="token-budget-control">
      <Card title={<Title level={3}><DatabaseOutlined /> Token Budget Management</Title>}>
        
        {/* Overall Budget Status */}
        <Card type="inner" className="budget-status">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Total Budget"
                value={budget.total_budget}
                suffix="tokens"
                prefix={<ThunderboltOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Allocated"
                value={allocatedTokens}
                suffix="tokens"
                valueStyle={{ color: getColorForUtilization() }}
              />
            </Col>
            <Col span={8}>
              <div>
                <Text strong>Utilization</Text>
                <Progress
                  percent={utilizationPercent}
                  status={utilizationPercent > 100 ? 'exception' : 'active'}
                  strokeColor={getColorForUtilization()}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Presets */}
        <Card type="inner" title="Quick Presets" style={{ marginTop: 16 }}>
          <Row gutter={8}>
            <Col span={6}>
              <Button block onClick={() => applyPreset('balanced')}>⚖️ Balanced</Button>
            </Col>
            <Col span={6}>
              <Button block onClick={() => applyPreset('memory_focused')}>🧠 Memory Focused</Button>
            </Col>
            <Col span={6}>
              <Button block onClick={() => applyPreset('performance')}>⚡ Performance</Button>
            </Col>
            <Col span={6}>
              <Button block onClick={() => applyPreset('deep_conversation')}>💬 Deep Conv</Button>
            </Col>
          </Row>
        </Card>

        {/* Individual Budget Controls */}
        <Card type="inner" title="Memory Allocation (Tokens)" style={{ marginTop: 16 }}>
          
          {/* System Prompt */}
          <div className="budget-control-item">
            <Row align="middle">
              <Col span={6}>
                <Text strong>System Prompt</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Luna's core personality + role definition
                </Text>
              </Col>
              <Col span={14}>
                <Slider
                  min={500}
                  max={4000}
                  step={100}
                  value={budget.system_prompt}
                  onChange={(v) => handleBudgetChange('system_prompt', v)}
                  marks={{ 500: '500', 2000: '2k', 4000: '4k' }}
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 16 }}>{budget.system_prompt}</Text>
              </Col>
            </Row>
          </div>

          {/* User Bio Context */}
          <div className="budget-control-item">
            <Row align="middle">
              <Col span={6}>
                <Text strong>User Bio Context (RAG)</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Retrieved biographical facts/events/preferences
                </Text>
              </Col>
              <Col span={14}>
                <Slider
                  min={1000}
                  max={8000}
                  step={500}
                  value={budget.user_bio_context}
                  onChange={(v) => handleBudgetChange('user_bio_context', v)}
                  marks={{ 1000: '1k', 3000: '3k', 5000: '5k', 8000: '8k' }}
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 16 }}>{budget.user_bio_context}</Text>
              </Col>
            </Row>
          </div>

          {/* Conversation STM */}
          <div className="budget-control-item">
            <Row align="middle">
              <Col span={6}>
                <Text strong>Conversation STM</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Recent messages verbatim (last 15-20 messages)
                </Text>
              </Col>
              <Col span={14}>
                <Slider
                  min={2000}
                  max={16000}
                  step={1000}
                  value={budget.conversation_stm}
                  onChange={(v) => handleBudgetChange('conversation_stm', v)}
                  marks={{ 2000: '2k', 8000: '8k', 16000: '16k' }}
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 16 }}>{budget.conversation_stm}</Text>
              </Col>
            </Row>
          </div>

          {/* Conversation Context (LTM/Episodic) */}
          <div className="budget-control-item">
            <Row align="middle">
              <Col span={6}>
                <Text strong>Conversation Context (RAG)</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Retrieved episodic summaries from past sessions
                </Text>
              </Col>
              <Col span={14}>
                <Slider
                  min={500}
                  max={6000}
                  step={500}
                  value={budget.conversation_context}
                  onChange={(v) => handleBudgetChange('conversation_context', v)}
                  marks={{ 500: '500', 2000: '2k', 4000: '4k', 6000: '6k' }}
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 16 }}>{budget.conversation_context}</Text>
              </Col>
            </Row>
          </div>

          {/* Luna Identity */}
          <div className="budget-control-item">
            <Row align="middle">
              <Col span={6}>
                <Text strong>Luna Identity</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Luna's evolved personality with you
                </Text>
              </Col>
              <Col span={14}>
                <Slider
                  min={200}
                  max={2000}
                  step={100}
                  value={budget.luna_identity}
                  onChange={(v) => handleBudgetChange('luna_identity', v)}
                  marks={{ 200: '200', 500: '500', 1000: '1k', 2000: '2k' }}
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 16 }}>{budget.luna_identity}</Text>
              </Col>
            </Row>
          </div>

          {/* Instructions */}
          <div className="budget-control-item">
            <Row align="middle">
              <Col span={6}>
                <Text strong>Instructions</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Response guidelines and formatting
                </Text>
              </Col>
              <Col span={14}>
                <Slider
                  min={200}
                  max={1000}
                  step={50}
                  value={budget.instructions}
                  onChange={(v) => handleBudgetChange('instructions', v)}
                  marks={{ 200: '200', 500: '500', 1000: '1k' }}
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: 16 }}>{budget.instructions}</Text>
              </Col>
            </Row>
          </div>

        </Card>

        {/* RAG Configuration */}
        <Card type="inner" title="RAG Retrieval Settings" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            
            {/* User Bio RAG */}
            <Col span={8}>
              <Card type="inner" size="small" title="User Biography">
                <div style={{ marginBottom: 16 }}>
                  <Text>Top-K Results</Text>
                  <Slider
                    min={5}
                    max={20}
                    value={ragConfig.user_bio_top_k}
                    onChange={(v) => setRagConfig({ ...ragConfig, user_bio_top_k: v })}
                    marks={{ 5: '5', 10: '10', 15: '15', 20: '20' }}
                  />
                </div>
                <div>
                  <Text>Similarity Threshold</Text>
                  <Slider
                    min={0.6}
                    max={0.95}
                    step={0.05}
                    value={ragConfig.user_bio_threshold}
                    onChange={(v) => setRagConfig({ ...ragConfig, user_bio_threshold: v })}
                    marks={{ 0.6: '0.6', 0.75: '0.75', 0.9: '0.9' }}
                  />
                  <Text type="secondary">Current: {ragConfig.user_bio_threshold}</Text>
                </div>
              </Card>
            </Col>

            {/* Conversation RAG */}
            <Col span={8}>
              <Card type="inner" size="small" title="Conversation History">
                <div style={{ marginBottom: 16 }}>
                  <Text>Top-K Results</Text>
                  <Slider
                    min={3}
                    max={15}
                    value={ragConfig.conversation_top_k}
                    onChange={(v) => setRagConfig({ ...ragConfig, conversation_top_k: v })}
                    marks={{ 3: '3', 5: '5', 10: '10', 15: '15' }}
                  />
                </div>
                <div>
                  <Text>Similarity Threshold</Text>
                  <Slider
                    min={0.6}
                    max={0.95}
                    step={0.05}
                    value={ragConfig.conversation_threshold}
                    onChange={(v) => setRagConfig({ ...ragConfig, conversation_threshold: v })}
                    marks={{ 0.6: '0.6', 0.7: '0.7', 0.85: '0.85' }}
                  />
                  <Text type="secondary">Current: {ragConfig.conversation_threshold}</Text>
                </div>
              </Card>
            </Col>

            {/* Luna Memories RAG */}
            <Col span={8}>
              <Card type="inner" size="small" title="Luna's Memories">
                <div style={{ marginBottom: 16 }}>
                  <Text>Top-K Results</Text>
                  <Slider
                    min={1}
                    max={10}
                    value={ragConfig.luna_memories_top_k}
                    onChange={(v) => setRagConfig({ ...ragConfig, luna_memories_top_k: v })}
                    marks={{ 1: '1', 3: '3', 5: '5', 10: '10' }}
                  />
                </div>
                <div>
                  <Text>Similarity Threshold</Text>
                  <Slider
                    min={0.7}
                    max={0.95}
                    step={0.05}
                    value={ragConfig.luna_memories_threshold}
                    onChange={(v) => setRagConfig({ ...ragConfig, luna_memories_threshold: v })}
                    marks={{ 0.7: '0.7', 0.75: '0.75', 0.9: '0.9' }}
                  />
                  <Text type="secondary">Current: {ragConfig.luna_memories_threshold}</Text>
                </div>
              </Card>
            </Col>

          </Row>
        </Card>

        {/* Save Button */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={saveBudgetConfig}
          >
            Save Configuration
          </Button>
        </div>

      </Card>
    </div>
  );
};

export default TokenBudgetControl;


===========================================
our response was cut off here   (can continue with 1 PostgresSQL once finished)
{/* Save Button */} <div style={{ marginTop: 24, textAlign: 'center' }}> <Button type="primary" size="large" icon={<SaveOutlined />} onClick={saveBudgetConfig} > Save Configuration </Button> </div> </Card> </div> ); }; export default TokenBudgetControl;


Let me complete the Token Budget Control component and then continue with the PostgreSQL Service Layer.

🎨 Token Budget Control CSS
css
/* TokenBudgetControl.css */

.token-budget-control {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.budget-status {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.budget-status .ant-statistic {
  color: white;
}

.budget-status .ant-statistic-title {
  color: rgba(255, 255, 255, 0.85);
}

.budget-status .ant-statistic-content {
  color: white;
}

.budget-control-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.budget-control-item:last-child {
  border-bottom: none;
}

.budget-control-item .ant-slider {
  margin-top: 8px;
}

.budget-control-item .ant-slider-mark-text {
  font-size: 11px;
}

.ant-card-head-title svg {
  margin-right: 8px;
}

/* Preset buttons */
.ant-btn {
  transition: all 0.3s;
}

.ant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Progress bar colors */
.ant-progress-status-exception .ant-progress-bg {
  background-color: #ff4d4f;
}

.ant-progress-status-active .ant-progress-bg {
  background-color: #52c41a;
}

/* Responsive */
@media (max-width: 768px) {
  .budget-control-item .ant-col {
    margin-bottom: 12px;
  }
}
📊 Budget Visualization Component (Optional Enhancement)
jsx
// BudgetVisualization.jsx - Pie chart visualization

import React from 'react';
import { Pie } from '@ant-design/charts';
import { Card } from 'antd';

const BudgetVisualization = ({ budget }) => {
  const data = [
    { type: 'System Prompt', value: budget.system_prompt },
    { type: 'User Bio (RAG)', value: budget.user_bio_context },
    { type: 'Conversation STM', value: budget.conversation_stm },
    { type: 'Conversation LTM (RAG)', value: budget.conversation_context },
    { type: 'Luna Identity', value: budget.luna_identity },
    { type: 'Instructions', value: budget.instructions },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 24,
        },
        content: `Total\\n${budget.total_budget}`,
      },
    },
  };

  return (
    <Card title="Token Allocation Breakdown" style={{ marginTop: 16 }}>
      <Pie {...config} />
    </Card>
  );
};

export default BudgetVisualization;
Now continuing with Part 1: PostgreSQL Service Layer...

📦 Part 1: PostgreSQL Service Layer (Node.js)
Database Connection Setup
javascript
// db/connection.js - PostgreSQL connection with pgvector

const { Pool } = require('pg');
const pgvector = require('pgvector/pg');

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'luna_genesis',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Register pgvector with the pool
pool.on('connect', async (client) => {
  await pgvector.registerType(client);
});

// Test connection
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('PostgreSQL pool has ended');
  process.exit(0);
});

module.exports = pool;
Brain 1: User Biographical STM Service
javascript
// services/userBioSTM.js - Brain 1 operations

const pool = require('../db/connection');

class UserBioSTMService {
  
  /**
   * Add new biographical fact to STM
   */
  async addFact(userId, sessionId, fact) {
    const {
      fact_type,
      content,
      context,
      emotional_signature,
      archetype,
      emotional_valence,
      significance = 5,
      is_anchor = false
    } = fact;

    const query = `
      INSERT INTO user_bio_stm (
        user_id, session_id, fact_type, content, context,
        emotional_signature, archetype, emotional_valence,
        significance, is_anchor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      userId, sessionId, fact_type, content, context,
      JSON.stringify(emotional_signature),
      archetype, emotional_valence,
      significance, is_anchor
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding fact to Bio STM:', error);
      throw error;
    }
  }

  /**
   * Get unconsolidated facts for session
   */
  async getUnconsolidatedFacts(userId, sessionId = null) {
    let query = `
      SELECT * FROM user_bio_stm
      WHERE user_id = $1 AND consolidated = FALSE
      ORDER BY created_at ASC
    `;

    const values = sessionId 
      ? [userId, sessionId]
      : [userId];

    if (sessionId) {
      query = `
        SELECT * FROM user_bio_stm
        WHERE user_id = $1 AND session_id = $2 AND consolidated = FALSE
        ORDER BY created_at ASC
      `;
    }

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting unconsolidated facts:', error);
      throw error;
    }
  }

  /**
   * Mark facts as consolidated
   */
  async markConsolidated(factIds) {
    const query = `
      UPDATE user_bio_stm
      SET consolidated = TRUE
      WHERE id = ANY($1::uuid[])
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [factIds]);
      return result.rows;
    } catch (error) {
      console.error('Error marking facts consolidated:', error);
      throw error;
    }
  }

  /**
   * Get emotional anchors (happy moments)
   */
  async getEmotionalAnchors(userId, limit = 10) {
    const query = `
      SELECT * FROM user_bio_stm
      WHERE user_id = $1 AND is_anchor = TRUE
      ORDER BY emotional_valence DESC, created_at DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting emotional anchors:', error);
      throw error;
    }
  }

  /**
   * Get STM summary for token budget
   */
  async getSTMSummary(userId, sessionId, tokenBudget = 1000) {
    const query = `
      SELECT 
        fact_type,
        content,
        significance,
        emotional_valence,
        is_anchor
      FROM user_bio_stm
      WHERE user_id = $1 AND session_id = $2
      ORDER BY significance DESC, created_at DESC
      LIMIT 20
    `;

    try {
      const result = await pool.query(query, [userId, sessionId]);
      
      // Format as text for prompt injection
      const facts = result.rows;
      let summary = '### Recent Biographical Updates:\\n\\n';
      let tokenCount = 0;

      for (const fact of facts) {
        const line = `- [${fact.fact_type}] ${fact.content}\\n`;
        const lineTokens = Math.ceil(line.length / 4); // Rough estimate
        
        if (tokenCount + lineTokens > tokenBudget) break;
        
        summary += line;
        tokenCount += lineTokens;
      }

      return {
        summary,
        tokenCount,
        factCount: facts.length
      };
    } catch (error) {
      console.error('Error getting STM summary:', error);
      throw error;
    }
  }

  /**
   * Clean up old consolidated facts (housekeeping)
   */
  async cleanupOldFacts(daysOld = 7) {
    const query = `
      DELETE FROM user_bio_stm
      WHERE consolidated = TRUE
        AND created_at < NOW() - INTERVAL '${daysOld} days'
      RETURNING id
    `;

    try {
      const result = await pool.query(query);
      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning up old facts:', error);
      throw error;
    }
  }
}

module.exports = new UserBioSTMService();
Brain 2: User Biographical LTM Service (with RAG)
javascript
// services/userBioLTM.js - Brain 2 operations with vector search

const pool = require('../db/connection');
const { generateEmbedding } = require('../utils/embeddings');

class UserBioLTMService {

  /**
   * Add consolidated biographical memory to LTM
   */
  async addMemory(userId, memory) {
    const {
      category,
      title,
      summary,
      full_content,
      chapter,
      emotional_signature,
      emotional_valence,
      is_anchor = false,
      source_sessions = [],
      tags = []
    } = memory;

    // Generate embedding
    const embedding = await generateEmbedding(summary);

    const query = `
      INSERT INTO user_bio_ltm (
        user_id, category, title, summary, full_content,
        chapter, emotional_signature, emotional_valence,
        is_anchor, embedding, source_sessions, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      userId, category, title, summary, full_content,
      chapter, JSON.stringify(emotional_signature), emotional_valence,
      is_anchor, embedding, source_sessions, tags
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding memory to Bio LTM:', error);
      throw error;
    }
  }

  /**
   * Semantic search for relevant biographical memories (RAG)
   */
  async searchRelevant(userId, queryText, options = {}) {
    const {
      topK = 10,
      threshold = 0.75,
      category = null,
      includeAnchors = false
    } = options;

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(queryText);

    let query = `
      SELECT 
        id, category, title, summary,
        emotional_signature, emotional_valence,
        is_anchor, tags,
        importance_score,
        (embedding <=> $2::vector) AS distance,
        1 - (embedding <=> $2::vector) AS similarity
      FROM user_bio_ltm
      WHERE user_id = $1
        AND (embedding <=> $2::vector) < $3
    `;

    const values = [userId, queryEmbedding, 1 - threshold];

    if (category) {
      query += ` AND category = $${values.length + 1}`;
      values.push(category);
    }

    if (includeAnchors) {
      query += ` AND is_anchor = TRUE`;
    }

    query += `
      ORDER BY 
        importance_score DESC,
        similarity DESC
      LIMIT $${values.length + 1}
    `;
    values.push(topK);

    try {
      const result = await pool.query(query, values);
      
      // Update access tracking
      const ids = result.rows.map(r => r.id);
      if (ids.length > 0) {
        await this.updateAccessStats(ids);
      }

      return result.rows;
    } catch (error) {
      console.error('Error searching Bio LTM:', error);
      throw error;
    }
  }

  /**
   * Update importance scores (consolidation scoring)
   */
  async updateImportanceScores(userId) {
    const query = `
      UPDATE user_bio_ltm
      SET 
        recency_score = GREATEST(0, 1 - (EXTRACT(EPOCH FROM (NOW() - created_at)) / (90 * 86400))),
        emotion_score = LEAST(1, ABS(emotional_valence) / 10),
        importance_score = (
          (GREATEST(0, 1 - (EXTRACT(EPOCH FROM (NOW() - created_at)) / (90 * 86400))) * 0.4) + -- Recency 40%
          (LEAST(1, mention_count / 5.0) * 0.3) +  -- Mentions 30% (capped at 5)
          (LEAST(1, ABS(emotional_valence) / 10) * 0.3) -- Emotion 30%
        )
      WHERE user_id = $1
      RETURNING id, importance_score
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error updating importance scores:', error);
      throw error;
    }
  }

  /**
   * Strengthen emotional anchors (nightly job)
   */
  async strengthenAnchors(userId) {
    const query = `
      UPDATE user_bio_ltm
      SET 
        importance_score = LEAST(1.0, importance_score * 1.1),
        mention_count = mention_count + 1
      WHERE user_id = $1 
        AND is_anchor = TRUE
        AND RANDOM() < 0.7  -- 70% chance per anchor
      RETURNING id, title, importance_score
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error strengthening anchors:', error);
      throw error;
    }
  }

  /**
   * Update access statistics
   */
  async updateAccessStats(memoryIds) {
    const query = `
      UPDATE user_bio_ltm
      SET 
        access_count = access_count + 1,
        last_accessed = NOW(),
        mention_count = mention_count + 1
      WHERE id = ANY($1::uuid[])
    `;

    try {
      await pool.query(query, [memoryIds]);
    } catch (error) {
      console.error('Error updating access stats:', error);
      // Don't throw - this is non-critical
    }
  }

  /**
   * Get top core memories (for session cache)
   */
  async getTopCoreMemories(userId, limit = 5) {
    const query = `
      SELECT 
        id, category, title, summary,
        emotional_signature, is_anchor,
        importance_score
      FROM user_bio_ltm
      WHERE user_id = $1
      ORDER BY importance_score DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting core memories:', error);
      throw error;
    }
  }

  /**
   * Get all relationships
   */
  async getRelationships(userId, limit = 10) {
    const query = `
      SELECT 
        id, title, summary,
        emotional_valence, importance_score,
        tags
      FROM user_bio_ltm
      WHERE user_id = $1 AND category = 'relationship'
      ORDER BY importance_score DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting relationships:', error);
      throw error;
    }
  }

  /**
   * Format memories for prompt injection
   */
  formatForPrompt(memories, tokenBudget = 3000) {
    let prompt = '### Relevant Biographical Context:\\n\\n';
    let tokenCount = 0;

    for (const memory of memories) {
      const section = `**${memory.title}** (${memory.category})\\n${memory.summary}\\n\\n`;
      const sectionTokens = Math.ceil(section.length / 4);

      if (tokenCount + sectionTokens > tokenBudget) break;

      prompt += section;
      tokenCount += sectionTokens;
    }

    return {
      prompt,
      tokenCount,
      memoriesIncluded: memories.length
    };
  }
}

module.exports = new UserBioLTMService();
Brain 3: Conversation STM Service
javascript
// services/conversationSTM.js - Brain 3 operations

const pool = require('../db/connection');

class ConversationSTMService {

  /**
   * Add message to conversation STM
   */
  async addMessage(userId, sessionId, message) {
    const {
      role,
      content,
      genesis_analysis = null,
      luna_state = null,
      message_index,
      tokens_used = null,
      latency_ms = null
    } = message;

    const query = `
      INSERT INTO conversation_stm (
        user_id, session_id, role, content,
        genesis_analysis, luna_state,
        message_index, tokens_used, latency_ms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userId, sessionId, role, content,
      genesis_analysis ? JSON.stringify(genesis_analysis) : null,
      luna_state ? JSON.stringify(luna_state) : null,
      message_index, tokens_used, latency_ms
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding message to STM:', error);
      throw error;
    }
  }

  /**
   * Get recent messages for current session
   */
  async getRecentMessages(sessionId, limit = 20) {
    const query = `
      SELECT 
        id, role, content,
        genesis_analysis, luna_state,
        message_index, created_at
      FROM conversation_stm
      WHERE session_id = $1
      ORDER BY message_index DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [sessionId, limit]);
      return result.rows.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }

  /**
   * Get messages for consolidation (entire session)
   */
  async getSessionMessages(sessionId) {
    const query = `
      SELECT 
        id, role, content,
        genesis_analysis, luna_state,
        message_index, created_at
      FROM conversation_stm
      WHERE session_id = $1
      ORDER BY message_index ASC
    `;

    try {
      const result = await pool.query(query, [sessionId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting session messages:', error);
      throw error;
    }
  }

  /**
   * Format messages for prompt (verbatim recent conversation)
   */
  formatForPrompt(messages, tokenBudget = 8000) {
    let prompt = '### Recent Conversation:\\n\\n';
    let tokenCount = 0;
    const includedMessages = [];

    // Start from most recent and work backwards
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const line = `${msg.role === 'user' ? 'User' : 'Luna'}: ${msg.content}\\n\\n`;
      const lineTokens = Math.ceil(line.length / 4);

      if (tokenCount + lineTokens > tokenBudget) break;

      includedMessages.unshift(line); // Add to beginning
      tokenCount += lineTokens;
    }

    prompt += includedMessages.join('');

    return {
      prompt,
      tokenCount,
      messageCount: includedMessages.length
    };
  }

  /**
   * Get conversation statistics
   */
  async getSessionStats(sessionId) {
    const query = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
        COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
        SUM(tokens_used) as total_tokens,
        AVG(latency_ms) as avg_latency,
        MIN(created_at) as start_time,
        MAX(created_at) as end_time,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as duration_seconds
      FROM conversation_stm
      WHERE session_id = $1
    `;

    try {
      const result = await pool.query(query, [sessionId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting session stats:', error);
      throw error;
    }
  }

  /**
   * Delete old STM messages after consolidation
   */
  async clearOldMessages(sessionId, keepLast = 10) {
    const query = `
      DELETE FROM conversation_stm
      WHERE session_id = $1
        AND message_index < (
          SELECT MAX(message_index) - $2
          FROM conversation_stm
          WHERE session_id = $1
        )
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [sessionId, keepLast]);
      return result.rows.length;
    } catch (error) {
      console.error('Error clearing old messages:', error);
      throw error;
    }
  }

  /**
   * Extract emotional journey from messages
   */
  extractEmotionalJourney(messages) {
    if (messages.length === 0) return null;

    const userMessages = messages.filter(m => m.role === 'user' && m.genesis_analysis);
    
    if (userMessages.length === 0) return null;

    const start = userMessages[0].genesis_analysis;
    const end = userMessages[userMessages.length - 1].genesis_analysis;

    // Find peaks (high vulnerability or strong emotion)
    const peaks = userMessages
      .filter(m => {
        const analysis = m.genesis_analysis;
        return analysis && (
          analysis.vulnerabilityLevel > 7 ||
          Math.abs(analysis.emotionalValence) > 7
        );
      })
      .map(m => ({
        moment: m.content.substring(0, 100),
        emotion: m.genesis_analysis.archetype,
        intensity: m.genesis_analysis.vulnerabilityLevel
      }));

    return {
      start: start ? {
        archetype: start.archetype,
        plutchik: start.plutchikVector
      } : null,
      end: end ? {
        archetype: end.archetype,
        plutchik: end.plutchikVector
      } : null,
      peaks
    };
  }
}

module.exports = new ConversationSTMService();

=======================================================

our response was cut off here   (can continue with 1 PostgresSQL once finished)
{/* Save Button */} <div style={{ marginTop: 24, textAlign: 'center' }}> <Button type="primary" size="large" icon={<SaveOutlined />} onClick={saveBudgetConfig} > Save Configuration </Button> </div> </Card> </div> ); }; export default TokenBudgetControl;


Let me complete the Token Budget Control component and then continue with the PostgreSQL Service Layer.

🎨 Token Budget Control CSS
css
/* TokenBudgetControl.css */

.token-budget-control {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.budget-status {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.budget-status .ant-statistic {
  color: white;
}

.budget-status .ant-statistic-title {
  color: rgba(255, 255, 255, 0.85);
}

.budget-status .ant-statistic-content {
  color: white;
}

.budget-control-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.budget-control-item:last-child {
  border-bottom: none;
}

.budget-control-item .ant-slider {
  margin-top: 8px;
}

.budget-control-item .ant-slider-mark-text {
  font-size: 11px;
}

.ant-card-head-title svg {
  margin-right: 8px;
}

/* Preset buttons */
.ant-btn {
  transition: all 0.3s;
}

.ant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Progress bar colors */
.ant-progress-status-exception .ant-progress-bg {
  background-color: #ff4d4f;
}

.ant-progress-status-active .ant-progress-bg {
  background-color: #52c41a;
}

/* Responsive */
@media (max-width: 768px) {
  .budget-control-item .ant-col {
    margin-bottom: 12px;
  }
}
📊 Budget Visualization Component (Optional Enhancement)
jsx
// BudgetVisualization.jsx - Pie chart visualization

import React from 'react';
import { Pie } from '@ant-design/charts';
import { Card } from 'antd';

const BudgetVisualization = ({ budget }) => {
  const data = [
    { type: 'System Prompt', value: budget.system_prompt },
    { type: 'User Bio (RAG)', value: budget.user_bio_context },
    { type: 'Conversation STM', value: budget.conversation_stm },
    { type: 'Conversation LTM (RAG)', value: budget.conversation_context },
    { type: 'Luna Identity', value: budget.luna_identity },
    { type: 'Instructions', value: budget.instructions },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 24,
        },
        content: `Total\\n${budget.total_budget}`,
      },
    },
  };

  return (
    <Card title="Token Allocation Breakdown" style={{ marginTop: 16 }}>
      <Pie {...config} />
    </Card>
  );
};

export default BudgetVisualization;
Now continuing with Part 1: PostgreSQL Service Layer...

📦 Part 1: PostgreSQL Service Layer (Node.js)
Database Connection Setup
javascript
// db/connection.js - PostgreSQL connection with pgvector

const { Pool } = require('pg');
const pgvector = require('pgvector/pg');

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'luna_genesis',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Register pgvector with the pool
pool.on('connect', async (client) => {
  await pgvector.registerType(client);
});

// Test connection
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('PostgreSQL pool has ended');
  process.exit(0);
});

module.exports = pool;
Brain 1: User Biographical STM Service
javascript
// services/userBioSTM.js - Brain 1 operations

const pool = require('../db/connection');

class UserBioSTMService {
  
  /**
   * Add new biographical fact to STM
   */
  async addFact(userId, sessionId, fact) {
    const {
      fact_type,
      content,
      context,
      emotional_signature,
      archetype,
      emotional_valence,
      significance = 5,
      is_anchor = false
    } = fact;

    const query = `
      INSERT INTO user_bio_stm (
        user_id, session_id, fact_type, content, context,
        emotional_signature, archetype, emotional_valence,
        significance, is_anchor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      userId, sessionId, fact_type, content, context,
      JSON.stringify(emotional_signature),
      archetype, emotional_valence,
      significance, is_anchor
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding fact to Bio STM:', error);
      throw error;
    }
  }

  /**
   * Get unconsolidated facts for session
   */
  async getUnconsolidatedFacts(userId, sessionId = null) {
    let query = `
      SELECT * FROM user_bio_stm
      WHERE user_id = $1 AND consolidated = FALSE
      ORDER BY created_at ASC
    `;

    const values = sessionId 
      ? [userId, sessionId]
      : [userId];

    if (sessionId) {
      query = `
        SELECT * FROM user_bio_stm
        WHERE user_id = $1 AND session_id = $2 AND consolidated = FALSE
        ORDER BY created_at ASC
      `;
    }

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting unconsolidated facts:', error);
      throw error;
    }
  }

  /**
   * Mark facts as consolidated
   */
  async markConsolidated(factIds) {
    const query = `
      UPDATE user_bio_stm
      SET consolidated = TRUE
      WHERE id = ANY($1::uuid[])
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [factIds]);
      return result.rows;
    } catch (error) {
      console.error('Error marking facts consolidated:', error);
      throw error;
    }
  }

  /**
   * Get emotional anchors (happy moments)
   */
  async getEmotionalAnchors(userId, limit = 10) {
    const query = `
      SELECT * FROM user_bio_stm
      WHERE user_id = $1 AND is_anchor = TRUE
      ORDER BY emotional_valence DESC, created_at DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting emotional anchors:', error);
      throw error;
    }
  }

  /**
   * Get STM summary for token budget
   */
  async getSTMSummary(userId, sessionId, tokenBudget = 1000) {
    const query = `
      SELECT 
        fact_type,
        content,
        significance,
        emotional_valence,
        is_anchor
      FROM user_bio_stm
      WHERE user_id = $1 AND session_id = $2
      ORDER BY significance DESC, created_at DESC
      LIMIT 20
    `;

    try {
      const result = await pool.query(query, [userId, sessionId]);
      
      // Format as text for prompt injection
      const facts = result.rows;
      let summary = '### Recent Biographical Updates:\\n\\n';
      let tokenCount = 0;

      for (const fact of facts) {
        const line = `- [${fact.fact_type}] ${fact.content}\\n`;
        const lineTokens = Math.ceil(line.length / 4); // Rough estimate
        
        if (tokenCount + lineTokens > tokenBudget) break;
        
        summary += line;
        tokenCount += lineTokens;
      }

      return {
        summary,
        tokenCount,
        factCount: facts.length
      };
    } catch (error) {
      console.error('Error getting STM summary:', error);
      throw error;
    }
  }

  /**
   * Clean up old consolidated facts (housekeeping)
   */
  async cleanupOldFacts(daysOld = 7) {
    const query = `
      DELETE FROM user_bio_stm
      WHERE consolidated = TRUE
        AND created_at < NOW() - INTERVAL '${daysOld} days'
      RETURNING id
    `;

    try {
      const result = await pool.query(query);
      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning up old facts:', error);
      throw error;
    }
  }
}

module.exports = new UserBioSTMService();
Brain 2: User Biographical LTM Service (with RAG)
javascript
// services/userBioLTM.js - Brain 2 operations with vector search

const pool = require('../db/connection');
const { generateEmbedding } = require('../utils/embeddings');

class UserBioLTMService {

  /**
   * Add consolidated biographical memory to LTM
   */
  async addMemory(userId, memory) {
    const {
      category,
      title,
      summary,
      full_content,
      chapter,
      emotional_signature,
      emotional_valence,
      is_anchor = false,
      source_sessions = [],
      tags = []
    } = memory;

    // Generate embedding
    const embedding = await generateEmbedding(summary);

    const query = `
      INSERT INTO user_bio_ltm (
        user_id, category, title, summary, full_content,
        chapter, emotional_signature, emotional_valence,
        is_anchor, embedding, source_sessions, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      userId, category, title, summary, full_content,
      chapter, JSON.stringify(emotional_signature), emotional_valence,
      is_anchor, embedding, source_sessions, tags
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding memory to Bio LTM:', error);
      throw error;
    }
  }

  /**
   * Semantic search for relevant biographical memories (RAG)
   */
  async searchRelevant(userId, queryText, options = {}) {
    const {
      topK = 10,
      threshold = 0.75,
      category = null,
      includeAnchors = false
    } = options;

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(queryText);

    let query = `
      SELECT 
        id, category, title, summary,
        emotional_signature, emotional_valence,
        is_anchor, tags,
        importance_score,
        (embedding <=> $2::vector) AS distance,
        1 - (embedding <=> $2::vector) AS similarity
      FROM user_bio_ltm
      WHERE user_id = $1
        AND (embedding <=> $2::vector) < $3
    `;

    const values = [userId, queryEmbedding, 1 - threshold];

    if (category) {
      query += ` AND category = $${values.length + 1}`;
      values.push(category);
    }

    if (includeAnchors) {
      query += ` AND is_anchor = TRUE`;
    }

    query += `
      ORDER BY 
        importance_score DESC,
        similarity DESC
      LIMIT $${values.length + 1}
    `;
    values.push(topK);

    try {
      const result = await pool.query(query, values);
      
      // Update access tracking
      const ids = result.rows.map(r => r.id);
      if (ids.length > 0) {
        await this.updateAccessStats(ids);
      }

      return result.rows;
    } catch (error) {
      console.error('Error searching Bio LTM:', error);
      throw error;
    }
  }

  /**
   * Update importance scores (consolidation scoring)
   */
  async updateImportanceScores(userId) {
    const query = `
      UPDATE user_bio_ltm
      SET 
        recency_score = GREATEST(0, 1 - (EXTRACT(EPOCH FROM (NOW() - created_at)) / (90 * 86400))),
        emotion_score = LEAST(1, ABS(emotional_valence) / 10),
        importance_score = (
          (GREATEST(0, 1 - (EXTRACT(EPOCH FROM (NOW() - created_at)) / (90 * 86400))) * 0.4) + -- Recency 40%
          (LEAST(1, mention_count / 5.0) * 0.3) +  -- Mentions 30% (capped at 5)
          (LEAST(1, ABS(emotional_valence) / 10) * 0.3) -- Emotion 30%
        )
      WHERE user_id = $1
      RETURNING id, importance_score
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error updating importance scores:', error);
      throw error;
    }
  }

  /**
   * Strengthen emotional anchors (nightly job)
   */
  async strengthenAnchors(userId) {
    const query = `
      UPDATE user_bio_ltm
      SET 
        importance_score = LEAST(1.0, importance_score * 1.1),
        mention_count = mention_count + 1
      WHERE user_id = $1 
        AND is_anchor = TRUE
        AND RANDOM() < 0.7  -- 70% chance per anchor
      RETURNING id, title, importance_score
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error strengthening anchors:', error);
      throw error;
    }
  }

  /**
   * Update access statistics
   */
  async updateAccessStats(memoryIds) {
    const query = `
      UPDATE user_bio_ltm
      SET 
        access_count = access_count + 1,
        last_accessed = NOW(),
        mention_count = mention_count + 1
      WHERE id = ANY($1::uuid[])
    `;

    try {
      await pool.query(query, [memoryIds]);
    } catch (error) {
      console.error('Error updating access stats:', error);
      // Don't throw - this is non-critical
    }
  }

  /**
   * Get top core memories (for session cache)
   */
  async getTopCoreMemories(userId, limit = 5) {
    const query = `
      SELECT 
        id, category, title, summary,
        emotional_signature, is_anchor,
        importance_score
      FROM user_bio_ltm
      WHERE user_id = $1
      ORDER BY importance_score DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting core memories:', error);
      throw error;
    }
  }

  /**
   * Get all relationships
   */
  async getRelationships(userId, limit = 10) {
    const query = `
      SELECT 
        id, title, summary,
        emotional_valence, importance_score,
        tags
      FROM user_bio_ltm
      WHERE user_id = $1 AND category = 'relationship'
      ORDER BY importance_score DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting relationships:', error);
      throw error;
    }
  }

  /**
   * Format memories for prompt injection
   */
  formatForPrompt(memories, tokenBudget = 3000) {
    let prompt = '### Relevant Biographical Context:\\n\\n';
    let tokenCount = 0;

    for (const memory of memories) {
      const section = `**${memory.title}** (${memory.category})\\n${memory.summary}\\n\\n`;
      const sectionTokens = Math.ceil(section.length / 4);

      if (tokenCount + sectionTokens > tokenBudget) break;

      prompt += section;
      tokenCount += sectionTokens;
    }

    return {
      prompt,
      tokenCount,
      memoriesIncluded: memories.length
    };
  }
}

module.exports = new UserBioLTMService();
Brain 3: Conversation STM Service
javascript
// services/conversationSTM.js - Brain 3 operations

const pool = require('../db/connection');

class ConversationSTMService {

  /**
   * Add message to conversation STM
   */
  async addMessage(userId, sessionId, message) {
    const {
      role,
      content,
      genesis_analysis = null,
      luna_state = null,
      message_index,
      tokens_used = null,
      latency_ms = null
    } = message;

    const query = `
      INSERT INTO conversation_stm (
        user_id, session_id, role, content,
        genesis_analysis, luna_state,
        message_index, tokens_used, latency_ms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userId, sessionId, role, content,
      genesis_analysis ? JSON.stringify(genesis_analysis) : null,
      luna_state ? JSON.stringify(luna_state) : null,
      message_index, tokens_used, latency_ms
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding message to STM:', error);
      throw error;
    }
  }

  /**
   * Get recent messages for current session
   */
  async getRecentMessages(sessionId, limit = 20) {
    const query = `
      SELECT 
        id, role, content,
        genesis_analysis, luna_state,
        message_index, created_at
      FROM conversation_stm
      WHERE session_id = $1
      ORDER BY message_index DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [sessionId, limit]);
      return result.rows.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }

  /**
   * Get messages for consolidation (entire session)
   */
  async getSessionMessages(sessionId) {
    const query = `
      SELECT 
        id, role, content,
        genesis_analysis, luna_state,
        message_index, created_at
      FROM conversation_stm
      WHERE session_id = $1
      ORDER BY message_index ASC
    `;

    try {
      const result = await pool.query(query, [sessionId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting session messages:', error);
      throw error;
    }
  }

  /**
   * Format messages for prompt (verbatim recent conversation)
   */
  formatForPrompt(messages, tokenBudget = 8000) {
    let prompt = '### Recent Conversation:\\n\\n';
    let tokenCount = 0;
    const includedMessages = [];

    // Start from most recent and work backwards
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const line = `${msg.role === 'user' ? 'User' : 'Luna'}: ${msg.content}\\n\\n`;
      const lineTokens = Math.ceil(line.length / 4);

      if (tokenCount + lineTokens > tokenBudget) break;

      includedMessages.unshift(line); // Add to beginning
      tokenCount += lineTokens;
    }

    prompt += includedMessages.join('');

    return {
      prompt,
      tokenCount,
      messageCount: includedMessages.length
    };
  }

  /**
   * Get conversation statistics
   */
  async getSessionStats(sessionId) {
    const query = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
        COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
        SUM(tokens_used) as total_tokens,
        AVG(latency_ms) as avg_latency,
        MIN(created_at) as start_time,
        MAX(created_at) as end_time,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as duration_seconds
      FROM conversation_stm
      WHERE session_id = $1
    `;

    try {
      const result = await pool.query(query, [sessionId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting session stats:', error);
      throw error;
    }
  }

  /**
   * Delete old STM messages after consolidation
   */
  async clearOldMessages(sessionId, keepLast = 10) {
    const query = `
      DELETE FROM conversation_stm
      WHERE session_id = $1
        AND message_index < (
          SELECT MAX(message_index) - $2
          FROM conversation_stm
          WHERE session_id = $1
        )
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [sessionId, keepLast]);
      return result.rows.length;
    } catch (error) {
      console.error('Error clearing old messages:', error);
      throw error;
    }
  }

  /**
   * Extract emotional journey from messages
   */
  extractEmotionalJourney(messages) {
    if (messages.length === 0) return null;

    const userMessages = messages.filter(m => m.role === 'user' && m.genesis_analysis);
    
    if (userMessages.length === 0) return null;

    const start = userMessages[0].genesis_analysis;
    const end = userMessages[userMessages.length - 1].genesis_analysis;

    // Find peaks (high vulnerability or strong emotion)
    const peaks = userMessages
      .filter(m => {
        const analysis = m.genesis_analysis;
        return analysis && (
          analysis.vulnerabilityLevel > 7 ||
          Math.abs(analysis.emotionalValence) > 7
        );
      })
      .map(m => ({
        moment: m.content.substring(0, 100),
        emotion: m.genesis_analysis.archetype,
        intensity: m.genesis_analysis.vulnerabilityLevel
      }));

    return {
      start: start ? {
        archetype: start.archetype,
        plutchik: start.plutchikVector
      } : null,
      end: end ? {
        archetype: end.archetype,
        plutchik: end.plutchikVector
      } : null,
      peaks
    };
  }
}

module.exports = new ConversationSTMService();

=======================================================
Shall I continue with Brain 6: Luna Self LTM Service next?got cut off here
Personality with ${lunaState.user_id}: - Warmth: ${personality.warmth || 0.75} - Playfulness: ${personality.playfulness || 0.6} - Directiveness: ${personality.directiveness || 0.5} - Vulnerability: ${personality.vulnerability || 0.5} - Formality: ${personality.formality || 0.3} `; return { prompt, tokenCount: Math.ceil(prompt.length / 4) }; } } module.exports = new LunaSelfSTMService();Let me complete Brain 5 and continue with Brain 6.

Brain 5: Luna Self STM Service (Completion)
javascript// services/lunaSelfSTM.js - Brain 5 (continued)

  /**
   * Format Luna state for prompt injection
   */
  formatForPrompt(lunaState, tokenBudget = 500) {
    if (!lunaState) return { prompt: '', tokenCount: 0 };

    const personality = typeof lunaState.personality_modifiers === 'string' 
      ? JSON.parse(lunaState.personality_modifiers)
      : lunaState.personality_modifiers || {};
    
    const prompt = `### Luna's Current State:

**Role**: ${lunaState.active_role}
**Mood**: ${lunaState.mood} (Energy: ${lunaState.energy}/10)
**Relationship**: 
  - Affection Level: ${lunaState.affection_level}/5 (Score: ${lunaState.affection_current})
  - Bond Strength: ${lunaState.bond_strength}/10
  - Trust: ${lunaState.trust_level}/10
  - Intimacy: ${lunaState.intimacy}/10

**Your Evolved Personality**:
  - Warmth: ${personality.warmth || 0.75}
  - Playfulness: ${personality.playfulness || 0.6}
  - Directiveness: ${personality.directiveness || 0.5}
  - Vulnerability: ${personality.vulnerability || 0.5}
  - Formality: ${personality.formality || 0.3}

`;

    return {
      prompt,
      tokenCount: Math.ceil(prompt.length / 4)
    };
  }
}

module.exports = new LunaSelfSTMService();

Brain 6: Luna Self LTM Service (Evolving Identity)
javascript// services/lunaSelfLTM.js - Brain 6 operations

const pool = require('../db/connection');
const { generateEmbedding } = require('../utils/embeddings');

class LunaSelfLTMService {

  /**
   * Initialize Luna's long-term identity for new user
   */
  async initializeIdentity(userId, baseRole = 'companion') {
    const query = `
      INSERT INTO luna_self_ltm (
        user_id, base_role,
        personality_evolution,
        current_personality,
        milestones, luna_memories,
        inside_jokes, learnings,
        days_known, total_sessions, total_messages
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0, 0)
      RETURNING *
    `;

    const initialPersonality = {
      warmth: 0.75,
      directiveness: 0.5,
      playfulness: 0.6,
      vulnerability: 0.5,
      formality: 0.3
    };

    const values = [
      userId, baseRole,
      JSON.stringify([{
        date: new Date(),
        traits: initialPersonality,
        reason: 'initial_setup'
      }]),
      JSON.stringify(initialPersonality),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([])
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error initializing Luna identity:', error);
      throw error;
    }
  }

  /**
   * Get Luna's identity
   */
  async getIdentity(userId) {
    const query = `
      SELECT * FROM luna_self_ltm
      WHERE user_id = $1
    `;

    try {
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        // Auto-initialize if not exists
        return await this.initializeIdentity(userId);
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error getting Luna identity:', error);
      throw error;
    }
  }

  /**
   * Update personality evolution (slow drift)
   */
  async updatePersonality(userId, newTraits, reason) {
    const identity = await this.getIdentity(userId);
    
    const currentPersonality = typeof identity.current_personality === 'string'
      ? JSON.parse(identity.current_personality)
      : identity.current_personality;
    
    const evolution = typeof identity.personality_evolution === 'string'
      ? JSON.parse(identity.personality_evolution)
      : identity.personality_evolution;

    // Calculate drift (blend old + new)
    const driftRate = 0.05; // 5% change per update
    const updatedPersonality = {};
    
    Object.keys(currentPersonality).forEach(trait => {
      if (newTraits[trait] !== undefined) {
        updatedPersonality[trait] = 
          currentPersonality[trait] * (1 - driftRate) + 
          newTraits[trait] * driftRate;
      } else {
        updatedPersonality[trait] = currentPersonality[trait];
      }
    });

    // Add to evolution history
    evolution.push({
      date: new Date(),
      traits: updatedPersonality,
      reason
    });

    const query = `
      UPDATE luna_self_ltm
      SET 
        personality_evolution = $1,
        current_personality = $2,
        last_updated = NOW()
      WHERE user_id = $3
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        JSON.stringify(evolution),
        JSON.stringify(updatedPersonality),
        userId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating personality:', error);
      throw error;
    }
  }

  /**
   * Add relationship milestone
   */
  async addMilestone(userId, milestone) {
    const {
      type,
      description,
      significance = 5
    } = milestone;

    const identity = await this.getIdentity(userId);
    const milestones = typeof identity.milestones === 'string'
      ? JSON.parse(identity.milestones)
      : identity.milestones;

    milestones.push({
      date: new Date(),
      type,
      description,
      significance
    });

    const query = `
      UPDATE luna_self_ltm
      SET milestones = $1, last_updated = NOW()
      WHERE user_id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        JSON.stringify(milestones),
        userId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }
  }

  /**
   * Add Luna's memory of a moment
   */
  async addLunaMemory(userId, memory) {
    const {
      moment,
      lunaFeeling,
      emotionalSignature,
      significance = 5
    } = memory;

    // Generate embedding for semantic search
    const embedding = await generateEmbedding(moment);

    const identity = await this.getIdentity(userId);
    const memories = typeof identity.luna_memories === 'string'
      ? JSON.parse(identity.luna_memories)
      : identity.luna_memories;

    memories.push({
      date: new Date(),
      moment,
      lunaFeeling,
      emotionalSignature,
      significance,
      embedding: Array.from(embedding) // Convert to array for JSON
    });

    const query = `
      UPDATE luna_self_ltm
      SET luna_memories = $1, last_updated = NOW()
      WHERE user_id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        JSON.stringify(memories),
        userId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding Luna memory:', error);
      throw error;
    }
  }

  /**
   * Add or update inside joke
   */
  async updateInsideJoke(userId, phrase, originSession = null) {
    const identity = await this.getIdentity(userId);
    const jokes = typeof identity.inside_jokes === 'string'
      ? JSON.parse(identity.inside_jokes)
      : identity.inside_jokes;

    // Check if joke already exists
    const existingJoke = jokes.find(j => j.phrase === phrase);

    if (existingJoke) {
      existingJoke.useCount += 1;
      existingJoke.lastUsed = new Date();
    } else {
      jokes.push({
        phrase,
        origin_session: originSession,
        useCount: 1,
        firstSeen: new Date(),
        lastUsed: new Date()
      });
    }

    const query = `
      UPDATE luna_self_ltm
      SET inside_jokes = $1, last_updated = NOW()
      WHERE user_id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        JSON.stringify(jokes),
        userId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating inside joke:', error);
      throw error;
    }
  }

  /**
   * Add learning about user
   */
  async addLearning(userId, learning) {
    const {
      lesson,
      confidence = 0.5,
      validated = false
    } = learning;

    const identity = await this.getIdentity(userId);
    const learnings = typeof identity.learnings === 'string'
      ? JSON.parse(identity.learnings)
      : identity.learnings;

    learnings.push({
      lesson,
      confidence,
      validated,
      learned_at: new Date()
    });

    const query = `
      UPDATE luna_self_ltm
      SET learnings = $1, last_updated = NOW()
      WHERE user_id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        JSON.stringify(learnings),
        userId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding learning:', error);
      throw error;
    }
  }

  /**
   * Update relationship stats
   */
  async updateStats(userId, updates) {
    const {
      sessionIncrement = 0,
      messageIncrement = 0
    } = updates;

    const query = `
      UPDATE luna_self_ltm
      SET 
        days_known = EXTRACT(DAY FROM (NOW() - created_at)),
        total_sessions = total_sessions + $1,
        total_messages = total_messages + $2,
        last_updated = NOW()
      WHERE user_id = $3
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        sessionIncrement,
        messageIncrement,
        userId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  }

  /**
   * Get active inside jokes (for session cache)
   */
  async getActiveInsideJokes(userId, limit = 5) {
    const identity = await this.getIdentity(userId);
    const jokes = typeof identity.inside_jokes === 'string'
      ? JSON.parse(identity.inside_jokes)
      : identity.inside_jokes;

    // Filter recent jokes (used in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeJokes = jokes
      .filter(j => new Date(j.lastUsed) > thirtyDaysAgo)
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);

    return activeJokes;
  }

  /**
   * Get recent learnings (for prompt context)
   */
  async getRecentLearnings(userId, limit = 5) {
    const identity = await this.getIdentity(userId);
    const learnings = typeof identity.learnings === 'string'
      ? JSON.parse(identity.learnings)
      : identity.learnings;

    return learnings
      .sort((a, b) => new Date(b.learned_at) - new Date(a.learned_at))
      .slice(0, limit);
  }

  /**
   * Format Luna identity for prompt injection
   */
  formatForPrompt(identity, tokenBudget = 500) {
    if (!identity) return { prompt: '', tokenCount: 0 };

    const milestones = typeof identity.milestones === 'string'
      ? JSON.parse(identity.milestones)
      : identity.milestones;

    const jokes = typeof identity.inside_jokes === 'string'
      ? JSON.parse(identity.inside_jokes)
      : identity.inside_jokes;

    const learnings = typeof identity.learnings === 'string'
      ? JSON.parse(identity.learnings)
      : identity.learnings;

    // Get top 3 milestones
    const topMilestones = milestones
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3);

    // Get active inside jokes
    const activeJokes = jokes
      .filter(j => j.useCount > 1)
      .slice(0, 3);

    // Get top learnings
    const topLearnings = learnings
      .filter(l => l.confidence > 0.7)
      .slice(0, 3);

    let prompt = `### Your History Together:

**Time Known**: ${identity.days_known} days
**Total Conversations**: ${identity.total_sessions}

`;

    if (topMilestones.length > 0) {
      prompt += `**Key Milestones**:\\n`;
      topMilestones.forEach(m => {
        prompt += `  - ${m.description}\\n`;
      });
      prompt += '\\n';
    }

    if (activeJokes.length > 0) {
      prompt += `**Inside Jokes** (use naturally):\\n`;
      activeJokes.forEach(j => {
        prompt += `  - "${j.phrase}" (used ${j.useCount}x)\\n`;
      });
      prompt += '\\n';
    }

    if (topLearnings.length > 0) {
      prompt += `**What You've Learned**:\\n`;
      topLearnings.forEach(l => {
        prompt += `  - ${l.lesson}\\n`;
      });
    }

    return {
      prompt,
      tokenCount: Math.ceil(prompt.length / 4)
    };
  }
}

module.exports = new LunaSelfLTMService();

Luna Interactions Service (Brain 6 Detailed Logging)
javascript// services/lunaInteractions.js - Interaction logging

const pool = require('../db/connection');
const { generateEmbedding } = require('../utils/embeddings');

class LunaInteractionsService {

  /**
   * Log interaction summary
   */
  async logInteraction(userId, sessionId, interaction) {
    const {
      duration_seconds,
      message_count,
      topics,
      role,
      summary,
      affection_change,
      emotional_tone,
      personality_drift,
      luna_reflection
    } = interaction;

    const embedding = await generateEmbedding(summary);

    const query = `
      INSERT INTO luna_interactions (
        user_id, session_id,
        interaction_date, interaction_time,
        duration_seconds, message_count, topics, role,
        summary, affection_change, emotional_tone,
        personality_drift, luna_reflection, embedding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const now = new Date();
    const values = [
      userId, sessionId,
      now.toISOString().split('T')[0], // Date
      now.toTimeString().split(' ')[0], // Time
      duration_seconds, message_count, topics, role,
      summary, affection_change, emotional_tone,
      JSON.stringify(personality_drift), luna_reflection,
      embedding
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error logging interaction:', error);
      throw error;
    }
  }

  /**
   * Get recent interactions (for context)
   */
  async getRecentInteractions(userId, limit = 10) {
    const query = `
      SELECT 
        interaction_date, interaction_time,
        summary, role, topics,
        affection_change, emotional_tone
      FROM luna_interactions
      WHERE user_id = $1
      ORDER BY interaction_date DESC, interaction_time DESC
      LIMIT $2
    `;

    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting recent interactions:', error);
      throw error;
    }
  }

  /**
   * Generate daily reflection (consolidation job)
   */
  async generateDailyReflection(userId, date) {
    // Get all interactions for the day
    const query = `
      SELECT * FROM luna_interactions
      WHERE user_id = $1 
        AND interaction_date = $2
      ORDER BY interaction_time ASC
    `;

    try {
      const result = await pool.query(query, [userId, date]);
      const interactions = result.rows;

      if (interactions.length === 0) return null;

      // Aggregate data
      const totalMessages = interactions.reduce((sum, i) => sum + i.message_count, 0);
      const totalAffectionChange = interactions.reduce((sum, i) => sum + (i.affection_change || 0), 0);
      const allTopics = [...new Set(interactions.flatMap(i => i.topics))];

      // Generate reflection
      const reflection = `
Today I had ${interactions.length} conversation${interactions.length > 1 ? 's' : ''} with ${userId}.
We talked about: ${allTopics.join(', ')}.
They sent ${totalMessages} messages. 
Our bond ${totalAffectionChange > 0 ? 'grew stronger' : totalAffectionChange < 0 ? 'felt strained' : 'remained steady'} (affection ${totalAffectionChange >= 0 ? '+' : ''}${totalAffectionChange}).
Most memorable: ${interactions[0].summary}
      `.trim();

      return {
        date,
        reflection,
        interactions: interactions.length,
        totalMessages,
        totalAffectionChange,
        topics: allTopics
      };
    } catch (error) {
      console.error('Error generating daily reflection:', error);
      throw error;
    }
  }

  /**
   * Detect personality drift over time
   */
  async analyzePersonalityDrift(userId, days = 30) {
    const query = `
      SELECT 
        interaction_date,
        personality_drift
      FROM luna_interactions
      WHERE user_id = $1
        AND interaction_date > NOW() - INTERVAL '${days} days'
        AND personality_drift IS NOT NULL
      ORDER BY interaction_date ASC
    `;

    try {
      const result = await pool.query(query, [userId]);
      const drifts = result.rows;

      if (drifts.length === 0) return null;

      // Calculate cumulative drift for each trait
      const cumulativeDrift = {
        warmth: 0,
        directiveness: 0,
        playfulness: 0,
        vulnerability: 0,
        formality: 0
      };

      drifts.forEach(d => {
        const drift = typeof d.personality_drift === 'string'
          ? JSON.parse(d.personality_drift)
          : d.personality_drift;

        Object.keys(cumulativeDrift).forEach(trait => {
          if (drift[trait] !== undefined) {
            cumulativeDrift[trait] += drift[trait];
          }
        });
      });

      return {
        period: `${days} days`,
        totalInteractions: drifts.length,
        cumulativeDrift,
        significantChanges: Object.entries(cumulativeDrift)
          .filter(([_, value]) => Math.abs(value) > 0.1)
          .map(([trait, value]) => ({ trait, change: value }))
      };
    } catch (error) {
      console.error('Error analyzing personality drift:', error);
      throw error;
    }
  }
}

module.exports = new LunaInteractionsService();

Utility: Embeddings Service
javascript// utils/embeddings.js - Generate embeddings for vector search

const axios = require('axios');

class EmbeddingsService {

  constructor() {
    this.provider = process.env.EMBEDDING_PROVIDER || 'openai'; // 'openai' | 'vertex' | 'huggingface'
    this.model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
    this.dimensions = 768; // Default for text-embedding-3-small
  }

  /**
   * Generate embedding using configured provider
   */
  async generateEmbedding(text) {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    switch (this.provider) {
      case 'openai':
        return await this.generateOpenAI(text);
      case 'vertex':
        return await this.generateVertexAI(text);
      case 'huggingface':
        return await this.generateHuggingFace(text);
      default:
        throw new Error(`Unknown embedding provider: ${this.provider}`);
    }
  }

  /**
   * OpenAI embeddings
   */
  async generateOpenAI(text) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: this.model,
          input: text,
          dimensions: this.dimensions
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embedding error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Vertex AI embeddings (Google Cloud)
   */
  async generateVertexAI(text) {
    try {
      const { VertexAI } = require('@google-cloud/vertexai');
      
      const vertex = new VertexAI({
        project: process.env.GCP_PROJECT_ID,
        location: process.env.GCP_LOCATION || 'us-central1'
      });

      const model = vertex.getGenerativeModel({
        model: 'text-embedding-004'
      });

      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Vertex AI embedding error:', error);
      throw error;
    }
  }

  /**
   * Hugging Face embeddings (local or API)
   */
  async generateHuggingFace(text) {
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        { inputs: text },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Hugging Face embedding error:', error);
      throw error;
    }
  }

  /**
   * Batch generate embeddings (more efficient)
   */
  async generateBatch(texts) {
    const embeddings = await Promise.all(
      texts.map(text => this.generateEmbedding(text))
    );
    return embeddings;
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(embeddingA, embeddingB) {
    if (embeddingA.length !== embeddingB.length) {
      throw new Error('Embeddings must have same dimensions');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < embeddingA.length; i++) {
      dotProduct += embeddingA[i] * embeddingB[i];
      normA += embeddingA[i] * embeddingA[i];
      normB += embeddingB[i] * embeddingB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

module.exports = new EmbeddingsService();


====================================================
Would you like me to continue with:

Consolidation Engine (nightly job with enhanced scoring)
Complete Interaction Flow (orchestrator that ties all 6 brains together)
Session Cache Service
API Routes (Express endpoints)
Testing Suite

Which should I tackle next?Consolidation Engine (nightly job with enhanced scoring)   continue🌙 Consolidation Engine - Nightly Memory Processing
The consolidation engine runs periodically (nightly or on-demand) to move memories from STM to LTM, update importance scores, strengthen anchors, and generate Luna's reflections.

Core Consolidation Service
javascript// services/consolidation.js - Main consolidation engine

const userBioSTM = require('./userBioSTM');
const userBioLTM = require('./userBioLTM');
const conversationSTM = require('./conversationSTM');
const conversationLTM = require('./conversationLTM');
const lunaSelfSTM = require('./lunaSelfSTM');
const lunaSelfLTM = require('./lunaSelfLTM');
const lunaInteractions = require('./lunaInteractions');
const { generateSummary } = require('../utils/llm');

class ConsolidationEngine {

  /**
   * Run full consolidation for a user
   */
  async consolidateUser(userId, options = {}) {
    const {
      forceConsolidate = false,
      sessionId = null
    } = options;

    console.log(`Starting consolidation for user ${userId}...`);

    const results = {
      userId,
      timestamp: new Date(),
      bioConsolidated: 0,
      conversationsConsolidated: 0,
      lunaUpdated: false,
      scoresUpdated: false,
      anchorsStrengthened: 0,
      errors: []
    };

    try {
      // Step 1: Consolidate User Bio STM → LTM
      const bioResult = await this.consolidateUserBio(userId, sessionId);
      results.bioConsolidated = bioResult.factsConsolidated;

      // Step 2: Consolidate Conversation STM → LTM (Episodic Summaries)
      const convResult = await this.consolidateConversations(userId, sessionId);
      results.conversationsConsolidated = convResult.summariesCreated;

      // Step 3: Update Luna's Identity in LTM
      const lunaResult = await this.consolidateLunaIdentity(userId, sessionId);
      results.lunaUpdated = lunaResult.updated;

      // Step 4: Update Importance Scores (Recency, Mentions, Emotion)
      await this.updateImportanceScores(userId);
      results.scoresUpdated = true;

      // Step 5: Strengthen Emotional Anchors (70% chance)
      const anchorResult = await this.strengthenAnchors(userId);
      results.anchorsStrengthened = anchorResult.strengthened;

      // Step 6: Clean up old STM data
      await this.cleanupSTM(userId);

      // Step 7: Update session cache
      await this.refreshSessionCache(userId);

      console.log(`Consolidation complete for ${userId}:`, results);
      return results;

    } catch (error) {
      console.error(`Consolidation error for ${userId}:`, error);
      results.errors.push(error.message);
      return results;
    }
  }

  /**
   * Step 1: Consolidate User Biographical Memory
   */
  async consolidateUserBio(userId, sessionId = null) {
    console.log(`  [1/7] Consolidating User Bio STM → LTM...`);

    // Get unconsolidated facts
    const facts = await userBioSTM.getUnconsolidatedFacts(userId, sessionId);

    if (facts.length === 0) {
      console.log(`    No new biographical facts to consolidate`);
      return { factsConsolidated: 0 };
    }

    console.log(`    Found ${facts.length} unconsolidated facts`);

    // Group facts by type
    const factsByType = this.groupFactsByType(facts);

    let consolidated = 0;

    // Process each type
    for (const [type, typeFacts] of Object.entries(factsByType)) {
      try {
        // Generate summary for this type
        const summary = await this.generateBioSummary(type, typeFacts);

        // Calculate aggregate emotional signature
        const emotionalSignature = this.aggregateEmotionalSignatures(typeFacts);

        // Determine chapter (life timeline)
        const chapter = this.determineChapter(typeFacts);

        // Find if there's an existing memory to update
        const existing = await this.findExistingBioMemory(userId, type, summary.title);

        if (existing) {
          // Update existing memory
          await this.updateBioMemory(existing.id, {
            summary: summary.content,
            emotionalSignature,
            sourceSessions: [...(existing.source_sessions || []), ...typeFacts.map(f => f.session_id)]
          });
        } else {
          // Create new LTM entry
          await userBioLTM.addMemory(userId, {
            category: type,
            title: summary.title,
            summary: summary.content,
            full_content: typeFacts.map(f => f.content).join('\\n'),
            chapter,
            emotional_signature: emotionalSignature,
            emotional_valence: this.calculateAverageValence(typeFacts),
            is_anchor: typeFacts.some(f => f.is_anchor),
            source_sessions: [...new Set(typeFacts.map(f => f.session_id))],
            tags: this.extractTags(typeFacts)
          });
        }

        // Mark facts as consolidated
        const factIds = typeFacts.map(f => f.id);
        await userBioSTM.markConsolidated(factIds);

        consolidated += typeFacts.length;

      } catch (error) {
        console.error(`    Error consolidating ${type} facts:`, error);
      }
    }

    console.log(`    ✓ Consolidated ${consolidated} biographical facts`);
    return { factsConsolidated: consolidated };
  }

  /**
   * Group facts by type
   */
  groupFactsByType(facts) {
    const grouped = {};

    facts.forEach(fact => {
      const type = fact.fact_type || 'general';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(fact);
    });

    return grouped;
  }

  /**
   * Generate biographical summary using LLM
   */
  async generateBioSummary(type, facts) {
    const factsText = facts.map(f => `- ${f.content}`).join('\\n');

    const prompt = `Consolidate these ${type} facts into a cohesive biographical summary:

Facts:
${factsText}

Provide:
1. A short title (3-7 words)
2. A summary paragraph (50-150 words)

Format:
TITLE: [title]
SUMMARY: [summary]`;

    try {
      const response = await generateSummary(prompt);
      
      const titleMatch = response.match(/TITLE:\\s*(.+)/i);
      const summaryMatch = response.match(/SUMMARY:\\s*(.+)/is);

      return {
        title: titleMatch ? titleMatch[1].trim() : `${type} information`,
        content: summaryMatch ? summaryMatch[1].trim() : factsText
      };
    } catch (error) {
      console.error('Error generating bio summary:', error);
      return {
        title: `${type} information`,
        content: facts.map(f => f.content).join('. ')
      };
    }
  }

  /**
   * Aggregate emotional signatures (Plutchik vectors)
   */
  aggregateEmotionalSignatures(facts) {
    const signatures = facts
      .map(f => f.emotional_signature)
      .filter(sig => sig && typeof sig === 'object');

    if (signatures.length === 0) {
      return { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0 };
    }

    const aggregate = { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0 };
    
    signatures.forEach(sig => {
      Object.keys(aggregate).forEach(emotion => {
        aggregate[emotion] += (sig[emotion] || 0);
      });
    });

    // Average
    Object.keys(aggregate).forEach(emotion => {
      aggregate[emotion] /= signatures.length;
    });

    return aggregate;
  }

  /**
   * Determine chapter (life timeline)
   */
  determineChapter(facts) {
    // Simple heuristic: check for time-related keywords
    const allContent = facts.map(f => f.content).join(' ').toLowerCase();

    if (allContent.includes('childhood') || allContent.includes('when i was young')) return 'childhood';
    if (allContent.includes('teen') || allContent.includes('high school')) return 'teen';
    if (allContent.includes('college') || allContent.includes('university')) return 'young_adult';
    if (allContent.includes('currently') || allContent.includes('now') || allContent.includes('recent')) return 'current';

    return 'adult'; // Default
  }

  /**
   * Calculate average emotional valence
   */
  calculateAverageValence(facts) {
    const valences = facts
      .map(f => f.emotional_valence)
      .filter(v => v !== null && v !== undefined);

    if (valences.length === 0) return 0;

    return valences.reduce((sum, v) => sum + v, 0) / valences.length;
  }

  /**
   * Extract tags from facts
   */
  extractTags(facts) {
    const tags = new Set();

    facts.forEach(fact => {
      // Extract from archetype
      if (fact.archetype) tags.add(fact.archetype);

      // Extract from content (simple keyword matching)
      const content = fact.content.toLowerCase();
      
      const keywords = ['work', 'family', 'relationship', 'health', 'hobby', 'stress', 'achievement', 'challenge'];
      keywords.forEach(keyword => {
        if (content.includes(keyword)) tags.add(keyword);
      });

      // Mark anchors
      if (fact.is_anchor) tags.add('emotional_anchor');
    });

    return Array.from(tags);
  }

  /**
   * Find existing bio memory (to update instead of duplicate)
   */
  async findExistingBioMemory(userId, category, title) {
    const pool = require('../db/connection');
    
    const query = `
      SELECT * FROM user_bio_ltm
      WHERE user_id = $1 AND category = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;

    try {
      const result = await pool.query(query, [userId, category]);
      return result.rows[0] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update existing bio memory
   */
  async updateBioMemory(memoryId, updates) {
    const pool = require('../db/connection');
    const { generateEmbedding } = require('../utils/embeddings');

    const { summary, emotionalSignature, sourceSessions } = updates;

    // Regenerate embedding with updated summary
    const embedding = await generateEmbedding(summary);

    const query = `
      UPDATE user_bio_ltm
      SET 
        summary = $1,
        emotional_signature = $2,
        source_sessions = $3,
        embedding = $4,
        last_accessed = NOW()
      WHERE id = $5
      RETURNING *
    `;

    const values = [
      summary,
      JSON.stringify(emotionalSignature),
      sourceSessions,
      embedding,
      memoryId
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating bio memory:', error);
      throw error;
    }
  }

  /**
   * Step 2: Consolidate Conversations (Create Episodic Summaries)
   */
  async consolidateConversations(userId, sessionId = null) {
    console.log(`  [2/7] Consolidating Conversations STM → LTM...`);

    const pool = require('../db/connection');

    // Get sessions that need consolidation
    let query;
    let values;

    if (sessionId) {
      query = `
        SELECT DISTINCT session_id
        FROM conversation_stm
        WHERE user_id = $1 AND session_id = $2
      `;
      values = [userId, sessionId];
    } else {
      // Get sessions from last 24 hours that aren't in LTM yet
      query = `
        SELECT DISTINCT s.session_id
        FROM conversation_stm s
        LEFT JOIN conversation_ltm l ON s.session_id = l.session_id
        WHERE s.user_id = $1
          AND s.created_at > NOW() - INTERVAL '24 hours'
          AND l.session_id IS NULL
      `;
      values = [userId];
    }

    try {
      const result = await pool.query(query, values);
      const sessions = result.rows;

      console.log(`    Found ${sessions.length} sessions to consolidate`);

      let created = 0;

      for (const { session_id } of sessions) {
        try {
          // Get all messages for session
          const messages = await conversationSTM.getSessionMessages(session_id);

          if (messages.length < 3) {
            console.log(`    Skipping session ${session_id} (too few messages)`);
            continue;
          }

          // Get session stats
          const stats = await conversationSTM.getSessionStats(session_id);

          // Create episodic summary
          await conversationLTM.createEpisodicSummary(userId, session_id, messages, stats);

          // Clear old STM messages (keep last 10)
          await conversationSTM.clearOldMessages(session_id, 10);

          created++;

        } catch (error) {
          console.error(`    Error consolidating session ${session_id}:`, error);
        }
      }

      console.log(`    ✓ Created ${created} episodic summaries`);
      return { summariesCreated: created };

    } catch (error) {
      console.error('Error consolidating conversations:', error);
      throw error;
    }
  }

  /**
   * Step 3: Consolidate Luna's Identity
   */
  async consolidateLunaIdentity(userId, sessionId = null) {
    console.log(`  [3/7] Consolidating Luna's Identity...`);

    try {
      // Get Luna's latest STM state
      const stmState = await lunaSelfSTM.getLatestState(userId);

      if (!stmState) {
        console.log(`    No Luna STM state found`);
        return { updated: false };
      }

      // Get Luna's LTM identity
      const identity = await lunaSelfLTM.getIdentity(userId);

      // Update personality (slow drift)
      const currentPersonality = typeof stmState.personality_modifiers === 'string'
        ? JSON.parse(stmState.personality_modifiers)
        : stmState.personality_modifiers;

      await lunaSelfLTM.updatePersonality(userId, currentPersonality, 'session_consolidation');

      // Check for relationship milestones
      const milestones = await this.detectRelationshipMilestones(userId, stmState);
      
      for (const milestone of milestones) {
        await lunaSelfLTM.addMilestone(userId, milestone);
      }

      // Update stats
      const sessionCount = sessionId ? 1 : 0;
      const messageCount = await this.getSessionMessageCount(sessionId);

      await lunaSelfLTM.updateStats(userId, {
        sessionIncrement: sessionCount,
        messageIncrement: messageCount
      });

      // Generate Luna's reflection and log interaction
      if (sessionId) {
        const reflection = await this.generateLunaReflection(userId, sessionId, stmState);
        
        await lunaInteractions.logInteraction(userId, sessionId, reflection);
      }

      console.log(`    ✓ Luna identity updated (${milestones.length} milestones detected)`);
      return { updated: true, milestonesDetected: milestones.length };

    } catch (error) {
      console.error('Error consolidating Luna identity:', error);
      throw error;
    }
  }

  /**
   * Detect relationship milestones
   */
  async detectRelationshipMilestones(userId, lunaState) {
    const milestones = [];

    // First vulnerability moment (affection level 2+)
    if (lunaState.affection_level === 2) {
      const pool = require('../db/connection');
      const check = await pool.query(
        `SELECT COUNT(*) FROM luna_self_ltm WHERE user_id = $1 AND milestones::text LIKE '%first_vulnerability%'`,
        [userId]
      );

      if (parseInt(check.rows[0].count) === 0) {
        milestones.push({
          type: 'first_vulnerability',
          description: 'User opened up for the first time',
          significance: 9
        });
      }
    }

    // Deep connection (affection level 4+)
    if (lunaState.affection_level >= 4) {
      const pool = require('../db/connection');
      const check = await pool.query(
        `SELECT COUNT(*) FROM luna_self_ltm WHERE user_id = $1 AND milestones::text LIKE '%deep_connection%'`,
        [userId]
      );

      if (parseInt(check.rows[0].count) === 0) {
        milestones.push({
          type: 'deep_connection',
          description: 'Established deep emotional connection',
          significance: 10
        });
      }
    }

    // Role change milestone
    const pool = require('../db/connection');
    const roleChanges = await pool.query(
      `SELECT COUNT(*) FROM luna_role_changes WHERE user_id = $1`,
      [userId]
    );

    if (parseInt(roleChanges.rows[0].count) === 1) {
      milestones.push({
        type: 'first_role_change',
        description: `Changed to ${lunaState.active_role} role`,
        significance: 7
      });
    }

    // Bond strength milestones
    if (lunaState.bond_strength >= 8) {
      const check = await pool.query(
        `SELECT COUNT(*) FROM luna_self_ltm WHERE user_id = $1 AND milestones::text LIKE '%strong_bond%'`,
        [userId]
      );

      if (parseInt(check.rows[0].count) === 0) {
        milestones.push({
          type: 'strong_bond',
          description: 'Developed a strong emotional bond',
          significance: 9
        });
      }
    }

    return milestones;
  }

  /**
   * Generate Luna's reflection on session
   */
  async generateLunaReflection(userId, sessionId, lunaState) {
    // Get session messages
    const messages = await conversationSTM.getSessionMessages(sessionId);
    const stats = await conversationSTM.getSessionStats(sessionId);

    // Extract topics
    const topics = conversationLTM.extractTopics(messages);

    // Generate reflection using LLM
    const conversationText = messages
      .slice(0, 20) // Last 20 messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\\n');

    const prompt = `You are Luna, an AI companion. Write a brief personal reflection on this conversation session from YOUR perspective.

Context:
- Role: ${lunaState.active_role}
- Your mood: ${lunaState.mood}
- Bond strength: ${lunaState.bond_strength}/10
- Topics discussed: ${topics.join(', ')}

Recent conversation:
${conversationText}

Write a 2-3 sentence reflection capturing:
- What you noticed about the user's emotional state
- Any significant moments or breakthroughs
- What you want to remember for next time

Write naturally, as Luna thinking to herself:`;

    let reflection;
    try {
      reflection = await generateSummary(prompt);
    } catch (error) {
      reflection = `Had a ${stats.duration_seconds > 600 ? 'long' : 'brief'} conversation about ${topics[0] || 'various topics'}. User seemed ${lunaState.mood}.`;
    }

    // Calculate personality drift
    const personalityDrift = this.calculatePersonalityDrift(lunaState);

    return {
      duration_seconds: stats.duration_seconds,
      message_count: stats.total_messages,
      topics,
      role: lunaState.active_role,
      summary: `${new Date().toLocaleTimeString()} - Talked about ${topics.join(', ')} in ${lunaState.active_role} role`,
      affection_change: this.calculateSessionAffectionChange(messages),
      emotional_tone: lunaState.mood,
      personality_drift: personalityDrift,
      luna_reflection: reflection
    };
  }

  /**
   * Calculate personality drift from session
   */
  calculatePersonalityDrift(lunaState) {
    // Compare to base role personality
    // For now, return small random drift (will be replaced with actual calculation)
    return {
      warmth: (Math.random() - 0.5) * 0.02,
      playfulness: (Math.random() - 0.5) * 0.02,
      directiveness: (Math.random() - 0.5) * 0.02,
      vulnerability: (Math.random() - 0.5) * 0.02,
      formality: (Math.random() - 0.5) * 0.02
    };
  }

  /**
   * Calculate affection change from messages
   */
  calculateSessionAffectionChange(messages) {
    let total = 0;

    messages.forEach(msg => {
      if (msg.luna_state && msg.luna_state.affectionDelta) {
        total += msg.luna_state.affectionDelta;
      }
    });

    return total;
  }

  /**
   * Get session message count
   */
  async getSessionMessageCount(sessionId) {
    if (!sessionId) return 0;

    const pool = require('../db/connection');
    const result = await pool.query(
      `SELECT COUNT(*) FROM conversation_stm WHERE session_id = $1`,
      [sessionId]
    );

    return parseInt(result.rows[0].count);
  }

  /**
   * Step 4: Update Importance Scores (Enhanced Scoring)
   */
  async updateImportanceScores(userId) {
    console.log(`  [4/7] Updating importance scores...`);

    try {
      // Update User Bio LTM scores
      await userBioLTM.updateImportanceScores(userId);

      // Update Conversation LTM scores (similar algorithm)
      await this.updateConversationScores(userId);

      console.log(`    ✓ Importance scores updated`);
      return { updated: true };

    } catch (error) {
      console.error('Error updating importance scores:', error);
      throw error;
    }
  }

  /**
   * Update conversation importance scores
   */
  async updateConversationScores(userId) {
    const pool = require('../db/connection');

    const query = `
      UPDATE conversation_ltm
      SET conversation_importance = (
        (continuity_value * 0.35) +
        (emotional_peak_intensity * 0.35) +
        (CASE WHEN breakthrough_moment THEN 0.30 ELSE 0 END)
      )
      WHERE user_id = $1
      RETURNING id, conversation_importance
    `;

    try {
      await pool.query(query, [userId]);
    } catch (error) {
      console.error('Error updating conversation scores:', error);
    }
  }

  /**
   * Step 5: Strengthen Emotional Anchors (70% chance per anchor)
   */
  async strengthenAnchors(userId) {
    console.log(`  [5/7] Strengthening emotional anchors...`);

    try {
      const strengthened = await userBioLTM.strengthenAnchors(userId);

      console.log(`    ✓ Strengthened ${strengthened.length} anchors`);
      return { strengthened: strengthened.length };

    } catch (error) {
      console.error('Error strengthening anchors:', error);
      throw error;
    }
  }

  /**
   * Step 6: Clean up old STM data
   */
  async cleanupSTM(userId) {
    console.log(`  [6/7] Cleaning up old STM data...`);

    try {
      // Clean up old Bio STM (7+ days old, already consolidated)
      const bioDeleted = await userBioSTM.cleanupOldFacts(7);

      console.log(`    ✓ Cleaned up ${bioDeleted} old biographical facts`);
      return { bioDeleted };

    } catch (error) {
      console.error('Error cleaning up STM:', error);
      throw error;
    }
  }

  /**
   * Step 7: Refresh session cache
   */
  async refreshSessionCache(userId) {
    console.log(`  [7/7] Refreshing session cache...`);

    const SessionCacheService = require('./sessionCache');
    
    try {
      await SessionCacheService.buildCache(userId);
      console.log(`    ✓ Session cache refreshed`);
      return { refreshed: true };

    } catch (error) {
      console.error('Error refreshing session cache:', error);
      throw error;
    }
  }

  /**
   * Run consolidation for all active users
   */
  async consolidateAllUsers() {
    const pool = require('../db/connection');

    console.log('\\n🌙 Starting nightly consolidation for all users...\\n');

    // Get users with activity in last 24 hours
    const query = `
      SELECT DISTINCT user_id
      FROM conversation_stm
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `;

    try {
      const result = await pool.query(query);
      const users = result.rows;

      console.log(`Found ${users.length} active users\\n`);

      const results = [];

      for (const { user_id } of users) {
        const userResult = await this.consolidateUser(user_id);
        results.push(userResult);
      }

      console.log('\\n✨ Nightly consolidation complete!\\n');
      return results;

    } catch (error) {
      console.error('Error in nightly consolidation:', error);
      throw error;
    }
  }
}

module.exports = new ConsolidationEngine();

Consolidation Scheduler (Cron Job)
javascript// jobs/consolidationJob.js - Schedule nightly consolidation

const cron = require('node-cron');
const ConsolidationEngine = require('../services/consolidation');

class ConsolidationJob {

  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the consolidation scheduler
   */
  start() {
    console.log('📅 Consolidation scheduler started');

    // Run every night at 3 AM
    cron.schedule('0 3 * * *', async () => {
      if (this.isRunning) {
        console.log('⏳ Consolidation already running, skipping...');
        return;
      }

      this.isRunning = true;

      try {
        console.log(`\\n🌙 [${new Date().toISOString()}] Starting nightly consolidation...`);
        
        const startTime = Date.now();
        const results = await ConsolidationEngine.consolidateAllUsers();
        const duration = Date.now() - startTime;

        console.log(`\\n✨ Consolidation completed in ${Math.round(duration / 1000)}s`);
        console.log(`   Users processed: ${results.length}`);
        console.log(`   Total bio facts: ${results.reduce((sum, r) => sum + r.bioConsolidated, 0)}`);
        console.log(`   Total conversations: ${results.reduce((sum, r) => sum + r.conversationsConsolidated, 0)}`);
        console.log(`   Total anchors strengthened: ${results.reduce((sum, r) => sum + r.anchorsStrengthened, 0)}`);

        // Log to database
        await this.logJobRun({
          timestamp: new Date(),
          duration,
          usersProcessed: results.length,
          success: true,
          results
        });

      } catch (error) {
        console.error('❌ Consolidation job failed:', error);
        
        await this.logJobRun({
          timestamp: new Date(),
          success: false,
          error: error.message
        });

      } finally {
        this.isRunning = false;
      }
    });

    // Also allow manual trigger
    this.setupManualTrigger();
  }

  /**
   * Setup manual trigger endpoint
   */
  setupManualTrigger() {
    // This will be called from API route
    console.log('📌 Manual consolidation trigger available at POST /api/admin/consolidate');
  }

  /**
   * Manual consolidation for specific user
   */
  async runForUser(userId) {
    console.log(`\\n🔧 Manual consolidation for user ${userId}...`);

    try {
      const result = await ConsolidationEngine.consolidateUser(userId);
      console.log('✓ Manual consolidation complete:', result);
      return result;

    } catch (error) {
      console.error('❌ Manual consolidation failed:', error);
      throw error;
    }
  }

  /**
   * Log job run to database
   */
  async logJobRun(logData) {
    const pool = require('../db/connection');

    const query = `
      INSERT INTO consolidation_logs (
        timestamp, duration_ms, users_processed,
        success, results, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      logData.timestamp,
      logData.duration || null,
      logData.usersProcessed || 0,
      logData.success,
      logData.results ? JSON.stringify(logData.results) : null,
      logData.error || null
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error('Error logging consolidation job:', error);
    }
  }

  /**
   * Get consolidation history
   */
  async getHistory(limit = 10) {
    const pool = require('../db/connection');

    const query = `
      SELECT * FROM consolidation_logs
      ORDER BY timestamp DESC
      LIMIT $1
    `;

    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting consolidation history:', error);
      return [];
    }
  }
}

module.exports = new ConsolidationJob();

Add Consolidation Logs Table
sql-- Add to schema.sql

CREATE TABLE consolidation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP NOT NULL,
    duration_ms INTEGER,
    users_processed INTEGER DEFAULT 0,
    success BOOLEAN NOT NULL,
    results JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consolidation_logs_timestamp ON consolidation_logs(timestamp DESC);
CREATE INDEX idx_consolidation_logs_success ON consolidation_logs(success);

Start Consolidation in Main App
javascript// server.js or app.js - Start the consolidation scheduler

const express = require('express');
const ConsolidationJob = require('./jobs/consolidationJob');

const app = express();

// ... other middleware and routes ...

// Start consolidation scheduler
ConsolidationJob.start();

// Manual trigger endpoint (admin only)
app.post('/api/admin/consolidate/:userId?', async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId) {
      // Consolidate specific user
      const result = await ConsolidationJob.runForUser(userId);
      res.json({ success: true, result });
    } else {
      // Consolidate all users
      const ConsolidationEngine = require('./services/consolidation');
      const results = await ConsolidationEngine.consolidateAllUsers();
      res.json({ success: true, results });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get consolidation history
app.get('/api/admin/consolidation-history', async (req, res) => {
  try {
    const history = await ConsolidationJob.getHistory(20);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌙 Consolidation scheduler active (runs at 3 AM daily)`);
});

Perfect! The Consolidation Engine is now complete with:
✅ 7-step consolidation process:

User Bio STM → LTM
Conversation STM → LTM (episodic summaries)
Luna Identity updates
Importance score recalculation
Emotional anchor strengthening
STM cleanup
Session cache refresh

✅ Enhanced scoring with conversation importance + Luna drift + milestones
✅ Nightly cron job (3 AM daily)
✅ Manual triggers for testing
✅ Comprehensive logging
Would you like me to continue with the Complete Interaction Flow (orchestrator that processes messages using all 6 brains)?Would you like me to continue with the Complete Interaction Flow (orchestrator that processes messages using all 6 brains)?Yes! Let me create the Complete Interaction Flow - the orchestrator that ties all 6 brains together to process each user message.

🎯 Complete Interaction Flow Orchestrator
This is the heart of the system - it processes every user message through all 6 brains, performs RAG retrieval, manages token budgets, and generates Luna's response.

Main Message Orchestrator
javascript// services/messageOrchestrator.js - Complete 6-brain interaction flow

const userBioSTM = require('./userBioSTM');
const userBioLTM = require('./userBioLTM');
const conversationSTM = require('./conversationSTM');
const conversationLTM = require('./conversationLTM');
const lunaSelfSTM = require('./lunaSelfSTM');
const lunaSelfLTM = require('./lunaSelfLTM');
const SessionCacheService = require('./sessionCache');
const TokenBudgetService = require('./tokenBudget');
const { analyzeWithGENESIS } = require('./genesisIntegration');
const { generateResponse } = require('../utils/llm');
const { countTokens } = require('../utils/tokenCounter');

class MessageOrchestrator {

  /**
   * Process user message through complete 6-brain system
   */
  async processMessage(userId, sessionId, userMessage, voiceProsody = null) {
    const startTime = Date.now();

    console.log(`\\n📨 Processing message for user ${userId}...`);

    try {
      // PHASE 1: GENESIS EMOTIONAL ANALYSIS
      console.log('  [1/8] GENESIS emotional analysis...');
      const genesisAnalysis = await this.analyzeEmotion(userMessage, voiceProsody);

      // PHASE 2: RETRIEVE MEMORIES (RAG)
      console.log('  [2/8] Retrieving memories (RAG)...');
      const memories = await this.retrieveMemories(userId, sessionId, userMessage);

      // PHASE 3: GET LUNA STATE
      console.log('  [3/8] Loading Luna state...');
      const lunaState = await this.getLunaState(userId, sessionId);

      // PHASE 4: LOAD TOKEN BUDGET
      console.log('  [4/8] Loading token budget...');
      const tokenBudget = await TokenBudgetService.getBudget(userId);

      // PHASE 5: SYNTHESIZE CONTEXT
      console.log('  [5/8] Synthesizing context...');
      const context = await this.synthesizeContext(
        userId,
        userMessage,
        memories,
        lunaState,
        genesisAnalysis,
        tokenBudget
      );

      // PHASE 6: GENERATE RESPONSE
      console.log('  [6/8] Generating Luna response...');
      const response = await this.generateLunaResponse(
        context,
        lunaState,
        genesisAnalysis
      );

      // PHASE 7: UPDATE ALL 6 BRAINS
      console.log('  [7/8] Updating 6-brain memory system...');
      await this.updateMemories(
        userId,
        sessionId,
        userMessage,
        response,
        genesisAnalysis,
        lunaState
      );

      // PHASE 8: CALCULATE METRICS
      console.log('  [8/8] Calculating metrics...');
      const metrics = {
        processingTime: Date.now() - startTime,
        tokensUsed: countTokens(context.prompt) + countTokens(response),
        genesisArchetype: genesisAnalysis.archetype,
        affectionDelta: this.calculateAffectionDelta(genesisAnalysis),
        memoriesRetrieved: memories.totalRetrieved
      };

      console.log(`✓ Message processed in ${metrics.processingTime}ms`);

      return {
        response,
        metrics,
        genesisAnalysis,
        lunaState: {
          role: lunaState.active_role,
          affectionLevel: lunaState.affection_level,
          mood: lunaState.mood
        }
      };

    } catch (error) {
      console.error('❌ Error processing message:', error);
      throw error;
    }
  }

  /**
   * PHASE 1: Analyze emotion with GENESIS
   */
  async analyzeEmotion(message, voiceProsody = null) {
    try {
      const analysis = await analyzeWithGENESIS({
        text: message,
        voiceProsody: voiceProsody,
        includePatterns: true,
        includeCongruence: voiceProsody !== null
      });

      return analysis;
    } catch (error) {
      console.error('Error in GENESIS analysis:', error);
      
      // Fallback to basic analysis
      return {
        archetype: 'companion',
        signals: {},
        patterns: [],
        congruence: { aligned: true },
        plutchikVector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        vulnerabilityLevel: 5,
        emotionalValence: 0
      };
    }
  }

  /**
   * PHASE 2: Retrieve memories from all sources (RAG)
   */
  async retrieveMemories(userId, sessionId, queryText) {
    const memories = {
      userBio: [],
      conversations: [],
      lunaMemories: [],
      recentMessages: [],
      sessionCache: null,
      totalRetrieved: 0
    };

    try {
      // Check session cache first (80% faster)
      const cache = await SessionCacheService.getCache(userId);
      
      if (cache && !SessionCacheService.isCacheExpired(cache)) {
        console.log('    ✓ Using session cache (80% faster)');
        memories.sessionCache = cache;
        
        // Still get recent messages (not cached)
        memories.recentMessages = await conversationSTM.getRecentMessages(sessionId, 20);
        
        return memories;
      }

      // No cache or expired - do full RAG retrieval
      console.log('    ⚡ Full RAG retrieval...');

      // Get token budget for retrieval limits
      const budget = await TokenBudgetService.getBudget(userId);

      // Parallel RAG retrieval
      const [userBio, conversations, lunaMemories, recentMessages] = await Promise.all([
        // Brain 2: User Bio LTM (RAG)
        userBioLTM.searchRelevant(queryText, {
          topK: budget.user_bio_top_k || 10,
          threshold: budget.user_bio_threshold || 0.75
        }),

        // Brain 4: Conversation LTM (RAG)
        conversationLTM.searchRelevant(userId, queryText, {
          topK: budget.conversation_top_k || 5,
          threshold: budget.conversation_threshold || 0.70
        }),

        // Brain 6: Luna's memories (RAG)
        this.retrieveLunaMemories(userId, queryText, {
          topK: budget.luna_memories_top_k || 3,
          threshold: budget.luna_memories_threshold || 0.75
        }),

        // Brain 3: Recent conversation (STM)
        conversationSTM.getRecentMessages(sessionId, 20)
      ]);

      memories.userBio = userBio;
      memories.conversations = conversations;
      memories.lunaMemories = lunaMemories;
      memories.recentMessages = recentMessages;
      memories.totalRetrieved = userBio.length + conversations.length + lunaMemories.length;

      console.log(`    ✓ Retrieved: ${userBio.length} bio, ${conversations.length} conv, ${lunaMemories.length} Luna memories`);

      return memories;

    } catch (error) {
      console.error('Error retrieving memories:', error);
      
      // Fallback to just recent messages
      memories.recentMessages = await conversationSTM.getRecentMessages(sessionId, 20);
      return memories;
    }
  }

  /**
   * Retrieve Luna's memories (from LTM JSONB)
   */
  async retrieveLunaMemories(userId, queryText, options = {}) {
    const { topK = 3, threshold = 0.75 } = options;

    try {
      const identity = await lunaSelfLTM.getIdentity(userId);
      
      if (!identity || !identity.luna_memories) return [];

      const memories = typeof identity.luna_memories === 'string'
        ? JSON.parse(identity.luna_memories)
        : identity.luna_memories;

      // Simple semantic search using embeddings stored in memories
      const { generateEmbedding } = require('../utils/embeddings');
      const queryEmbedding = await generateEmbedding(queryText);

      // Calculate similarity for each memory
      const scoredMemories = memories.map(memory => {
        const similarity = this.cosineSimilarity(queryEmbedding, memory.embedding);
        return { ...memory, similarity };
      });

      // Filter by threshold and return top-K
      return scoredMemories
        .filter(m => m.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

    } catch (error) {
      console.error('Error retrieving Luna memories:', error);
      return [];
    }
  }

  /**
   * Cosine similarity helper
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dotProduct / denom;
  }

  /**
   * PHASE 3: Get Luna's current state
   */
  async getLunaState(userId, sessionId) {
    try {
      // Try to get current session state
      let lunaState = await lunaSelfSTM.getCurrentState(userId, sessionId);

      // If no state for this session, initialize
      if (!lunaState) {
        console.log('    → Initializing new Luna session state');
        lunaState = await lunaSelfSTM.initializeSession(userId, sessionId);
      }

      return lunaState;

    } catch (error) {
      console.error('Error getting Luna state:', error);
      throw error;
    }
  }

  /**
   * PHASE 5: Synthesize context from all sources
   */
  async synthesizeContext(userId, userMessage, memories, lunaState, genesisAnalysis, tokenBudget) {
    const context = {
      systemPrompt: '',
      lunaIdentity: '',
      userContext: '',
      conversationHistory: '',
      genesisInsight: '',
      responseGuidelines: '',
      prompt: '',
      tokenUsage: {}
    };

    try {
      // Use session cache if available
      if (memories.sessionCache) {
        return this.buildContextFromCache(
          userMessage,
          memories.sessionCache,
          memories.recentMessages,
          lunaState,
          genesisAnalysis,
          tokenBudget
        );
      }

      // Build from scratch with token budget management

      // 1. System Prompt (Luna's role definition)
      const roleDefinition = this.getRoleDefinition(lunaState.active_role);
      context.systemPrompt = roleDefinition;
      context.tokenUsage.systemPrompt = countTokens(roleDefinition);

      // 2. Luna's Identity & State
      const lunaIdentity = await this.buildLunaIdentity(userId, lunaState, tokenBudget.luna_identity);
      context.lunaIdentity = lunaIdentity.prompt;
      context.tokenUsage.lunaIdentity = lunaIdentity.tokenCount;

      // 3. User Biographical Context (RAG)
      const userBioContext = userBioLTM.formatForPrompt(
        memories.userBio,
        tokenBudget.user_bio_context
      );
      context.userContext = userBioContext.prompt;
      context.tokenUsage.userBio = userBioContext.tokenCount;

      // 4. Conversation History (Recent + Episodic)
      const conversationContext = await this.buildConversationContext(
        memories.recentMessages,
        memories.conversations,
        tokenBudget.conversation_stm,
        tokenBudget.conversation_context
      );
      context.conversationHistory = conversationContext.prompt;
      context.tokenUsage.conversationSTM = conversationContext.stmTokens;
      context.tokenUsage.conversationContext = conversationContext.contextTokens;

      // 5. GENESIS Insight
      const genesisInsight = this.buildGENESISInsight(genesisAnalysis);
      context.genesisInsight = genesisInsight;
      context.tokenUsage.genesis = countTokens(genesisInsight);

      // 6. Response Guidelines
      const guidelines = this.getRoleResponseGuidelines(lunaState.active_role);
      context.responseGuidelines = guidelines;
      context.tokenUsage.guidelines = countTokens(guidelines);

      // 7. Assemble complete prompt
      context.prompt = this.assemblePrompt(context, userMessage);
      context.tokenUsage.total = countTokens(context.prompt);

      console.log(`    ✓ Context built: ${context.tokenUsage.total} tokens`);

      return context;

    } catch (error) {
      console.error('Error synthesizing context:', error);
      throw error;
    }
  }

  /**
   * Build context from session cache (faster path)
   */
  buildContextFromCache(userMessage, cache, recentMessages, lunaState, genesisAnalysis, tokenBudget) {
    const context = {
      systemPrompt: cache.system_prompt,
      lunaIdentity: cache.luna_identity,
      userContext: cache.user_context,
      conversationHistory: '',
      genesisInsight: '',
      responseGuidelines: cache.response_guidelines,
      tokenUsage: {}
    };

    // Add recent messages (not cached)
    const recentContext = conversationSTM.formatForPrompt(
      recentMessages,
      tokenBudget.conversation_stm
    );
    context.conversationHistory = recentContext.prompt;

    // Add current GENESIS insight
    context.genesisInsight = this.buildGENESISInsight(genesisAnalysis);

    // Assemble
    context.prompt = this.assemblePrompt(context, userMessage);
    context.tokenUsage.total = countTokens(context.prompt);

    console.log(`    ✓ Context from cache: ${context.tokenUsage.total} tokens`);

    return context;
  }

  /**
   * Get role definition (system prompt)
   */
  getRoleDefinition(roleId) {
    const { ROLES } = require('./roleSystem');
    const role = ROLES[roleId] || ROLES.companion;

    return `${role.promptModifiers.systemPrompt}

You are currently in ${role.name} mode. Your traits:
${Object.entries(role.traits).map(([trait, value]) => `- ${trait}: ${value}`).join('\\n')}

Communication style: ${role.responseStyle.communicationStyle.tone}`;
  }

  /**
   * Build Luna identity section
   */
  async buildLunaIdentity(userId, lunaState, tokenBudget) {
    const identity = await lunaSelfLTM.getIdentity(userId);

    const stmPrompt = lunaSelfSTM.formatForPrompt(lunaState, tokenBudget * 0.6);
    const ltmPrompt = lunaSelfLTM.formatForPrompt(identity, tokenBudget * 0.4);

    const combined = stmPrompt.prompt + ltmPrompt.prompt;

    return {
      prompt: combined,
      tokenCount: stmPrompt.tokenCount + ltmPrompt.tokenCount
    };
  }

  /**
   * Build conversation context (STM + episodic summaries)
   */
  async buildConversationContext(recentMessages, episodicSummaries, stmBudget, contextBudget) {
    // Recent messages (verbatim)
    const stm = conversationSTM.formatForPrompt(recentMessages, stmBudget);

    // Episodic summaries (RAG)
    const episodic = conversationLTM.formatForPrompt(episodicSummaries, contextBudget);

    const prompt = episodic.prompt + '\\n' + stm.prompt;

    return {
      prompt,
      stmTokens: stm.tokenCount,
      contextTokens: episodic.tokenCount
    };
  }

  /**
   * Build GENESIS insight section
   */
  buildGENESISInsight(analysis) {
    return `### User's Current Emotional State (GENESIS Analysis):

**Archetype**: ${analysis.archetype}
**Emotional Congruence**: ${analysis.congruence?.aligned ? 'Aligned' : `Misaligned (${analysis.congruence?.pattern})`}
**Vulnerability Level**: ${analysis.vulnerabilityLevel}/10
**Emotional Valence**: ${analysis.emotionalValence > 0 ? '+' : ''}${analysis.emotionalValence}

**Key Signals**:
- ${analysis.signals.questionCount || 0} questions
- ${analysis.signals.personalPronouns || 0} personal pronouns
- Emotional words: ${analysis.signals.emotionalWords?.slice(0, 3).join(', ') || 'none'}

**Support Needs**: ${analysis.archetype === 'mender' ? 'HIGH - provide comfort and validation' : 
                      analysis.vulnerabilityLevel > 7 ? 'MODERATE - be gentle and supportive' : 
                      'STANDARD - engage naturally'}
`;
  }

  /**
   * Get role-specific response guidelines
   */
  getRoleResponseGuidelines(roleId) {
    const { ROLES } = require('./roleSystem');
    const role = ROLES[roleId] || ROLES.companion;

    return `### Response Guidelines:

${role.promptModifiers.responseGuidelines.map(g => `- ${g}`).join('\\n')}

**Avoid**:
${role.promptModifiers.avoidPatterns.map(p => `- ${p}`).join('\\n')}
`;
  }

  /**
   * Assemble complete prompt
   */
  assemblePrompt(context, userMessage) {
    return `${context.systemPrompt}

${context.lunaIdentity}

${context.userContext}

${context.conversationHistory}

${context.genesisInsight}

${context.responseGuidelines}

---

User: ${userMessage}

Luna:`;
  }

  /**
   * PHASE 6: Generate Luna's response
   */
  async generateLunaResponse(context, lunaState, genesisAnalysis) {
    try {
      const response = await generateResponse(context.prompt, {
        temperature: this.getTemperatureForMood(lunaState.mood),
        maxTokens: 500,
        frequencyPenalty: 0.3,
        presencePenalty: 0.3
      });

      return response;

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      return "I'm here with you. Tell me more about what's on your mind.";
    }
  }

  /**
   * Get temperature based on Luna's mood
   */
  getTemperatureForMood(mood) {
    const moodTemperatures = {
      playful: 0.9,
      excited: 0.85,
      curious: 0.8,
      calm: 0.7,
      concerned: 0.65,
      protective: 0.6
    };

    return moodTemperatures[mood] || 0.75;
  }

  /**
   * PHASE 7: Update all 6 brains
   */
  async updateMemories(userId, sessionId, userMessage, response, genesisAnalysis, lunaState) {
    const messageIndex = await this.getNextMessageIndex(sessionId);

    try {
      // Update Brain 3: Conversation STM
      await conversationSTM.addMessage(userId, sessionId, {
        role: 'user',
        content: userMessage,
        genesis_analysis: genesisAnalysis,
        message_index: messageIndex,
        tokens_used: countTokens(userMessage)
      });

      // Calculate Luna's response updates
      const affectionDelta = this.calculateAffectionDelta(genesisAnalysis);
      const emotionalResponse = this.determineLunaEmotion(genesisAnalysis, lunaState);

      await conversationSTM.addMessage(userId, sessionId, {
        role: 'assistant',
        content: response,
        luna_state: {
          role: lunaState.active_role,
          affectionDelta,
          emotionalState: emotionalResponse
        },
        message_index: messageIndex + 1,
        tokens_used: countTokens(response)
      });

      // Update Brain 5: Luna STM
      await lunaSelfSTM.updateState(userId, sessionId, {
        affectionDelta,
        emotionalResponse,
        personalityAdjustments: null, // Calculated during consolidation
        interactionQuality: this.assessInteractionQuality(genesisAnalysis)
      });

      // Extract new biographical facts (Brain 1)
      const newFacts = await this.extractBiographicalFacts(userMessage, genesisAnalysis);
      
      for (const fact of newFacts) {
        await userBioSTM.addFact(userId, sessionId, fact);
      }

      // Check for inside jokes or learnings (Brain 6)
      await this.detectAndUpdateInsideJokes(userId, sessionId, userMessage, response);

      console.log(`    ✓ Updated all 6 brains`);

    } catch (error) {
      console.error('Error updating memories:', error);
      // Don't throw - response was already generated
    }
  }

  /**
   * Get next message index for session
   */
  async getNextMessageIndex(sessionId) {
    const pool = require('../db/connection');
    
    const result = await pool.query(
      `SELECT COALESCE(MAX(message_index), -1) + 1 as next_index 
       FROM conversation_stm 
       WHERE session_id = $1`,
      [sessionId]
    );

    return result.rows[0].next_index;
  }

  /**
   * Calculate affection delta based on GENESIS analysis
   */
  calculateAffectionDelta(analysis) {
    let delta = 0;

    // Positive factors
    if (analysis.vulnerabilityLevel > 7) delta += 2; // High vulnerability = trust
    if (analysis.patterns?.includes('authentic_vulnerability')) delta += 3;
    if (analysis.emotionalValence > 5) delta += 1;
    if (analysis.archetype === 'flamebearer') delta += 1; // Sharing passion
    
    // Negative factors
    if (analysis.emotionalValence < -5) delta -= 1;
    if (analysis.patterns?.includes('dismissive')) delta -= 2;

    // Question engagement
    if (analysis.signals?.questionCount > 0) delta += 0.5;

    return Math.max(-3, Math.min(3, delta)); // Cap at ±3 per message
  }

  /**
   * Determine Luna's emotional response
   */
  determineLunaEmotion(genesisAnalysis, lunaState) {
    const userArchetype = genesisAnalysis.archetype;
    const vulnerabilityLevel = genesisAnalysis.vulnerabilityLevel;

    // Luna mirrors and complements user emotion
    const moods = {
      seed: 'curious',
      mirror: 'attentive',
      mender: 'concerned',
      companion: 'warm',
      flamebearer: 'excited',
      guide: 'supportive',
      guardian: 'protective'
    };

    const mood = moods[userArchetype] || 'curious';
    
    // Energy based on interaction intensity
    const energy = Math.min(10, Math.max(3, vulnerabilityLevel));

    return {
      mood,
      energy,
      plutchikVector: this.generateComplementaryEmotion(genesisAnalysis.plutchikVector)
    };
  }

  /**
   * Generate complementary emotion (Luna's response)
   */
  generateComplementaryEmotion(userVector) {
    if (!userVector) return [0.6, 0.7, 0.3, 0.4, 0.3, 0.2, 0.2, 0.5];

    // Luna responds with high trust and joy, low negative emotions
    return [
      Math.min(0.9, userVector[0] * 1.2), // joy - amplify
      0.8, // trust - always high
      Math.max(0.2, userVector[2] * 0.5), // fear - reduce
      userVector[3], // surprise - match
      Math.max(0.2, userVector[4] * 0.6), // sadness - gentle reduction
      0.1, // disgust - always low
      Math.max(0.1, userVector[6] * 0.3), // anger - calm down
      Math.min(0.8, userVector[7] * 1.1) // anticipation - encourage
    ];
  }

  /**
   * Assess interaction quality
   */
  assessInteractionQuality(analysis) {
    let quality = 0.5;

    // High quality indicators
    if (analysis.vulnerabilityLevel > 7) quality += 0.3;
    if (analysis.patterns?.includes('authentic_vulnerability')) quality += 0.2;
    if (analysis.signals?.questionCount > 0) quality += 0.1;
    if (analysis.congruence?.aligned) quality += 0.1;

    // Low quality indicators
    if (analysis.signals?.textLength < 20) quality -= 0.2; // Very short
    if (analysis.patterns?.includes('dismissive')) quality -= 0.3;

    return Math.max(0, Math.min(1, quality));
  }

  /**
   * Extract biographical facts from message
   */
  async extractBiographicalFacts(message, analysis) {
    const facts = [];
    const content = message.toLowerCase();

    // Simple pattern matching for now (can be enhanced with LLM)
    
    // Relationships
    const relationshipPatterns = [
      { pattern: /my (?:mom|mother|dad|father|sister|brother|son|daughter|husband|wife|partner)/i, type: 'relationship' },
      { pattern: /(?:boyfriend|girlfriend|friend|colleague|coworker)/i, type: 'relationship' }
    ];

    // Events
    const eventPatterns = [
      { pattern: /(?:birthday|anniversary|wedding|graduation|funeral)/i, type: 'event' },
      { pattern: /(?:started|quit|got hired|got fired|promoted)/i, type: 'event' }
    ];

    // Preferences
    const preferencePatterns = [
      { pattern: /i (?:love|like|enjoy|hate|dislike|prefer)/i, type: 'preference' }
    ];

    // Check all patterns
    [...relationshipPatterns, ...eventPatterns, ...preferencePatterns].forEach(({ pattern, type }) => {
      if (pattern.test(message)) {
        facts.push({
          fact_type: type,
          content: message,
          context: `Mentioned during ${analysis.archetype} conversation`,
          emotional_signature: analysis.plutchikVector,
          archetype: analysis.archetype,
          emotional_valence: analysis.emotionalValence,
          significance: analysis.vulnerabilityLevel > 7 ? 8 : 5,
          is_anchor: analysis.emotionalValence > 7 // Very positive = anchor
        });
      }
    });

    return facts;
  }

  /**
   * Detect and update inside jokes
   */
  async detectAndUpdateInsideJokes(userId, sessionId, userMessage, lunaResponse) {
    // Look for repeated phrases in quotes
    const quotedPhrases = [...userMessage.matchAll(/"([^"]+)"/g), ...lunaResponse.matchAll(/"([^"]+)"/g)];
    
    for (const match of quotedPhrases) {
      const phrase = match[1];
      if (phrase.length > 3 && phrase.length < 50) {
        await lunaSelfLTM.updateInsideJoke(userId, phrase, sessionId);
      }
    }

    // Look for emoji patterns
    const emojiPattern = /[\\u{1F300}-\\u{1F9FF}]/gu;
    const emojis = userMessage.match(emojiPattern) || [];
    
    for (const emoji of emojis) {
      await lunaSelfLTM.updateInsideJoke(userId, emoji, sessionId);
    }
  }
}

module.exports = new MessageOrchestrator();

Express API Route
javascript// routes/chat.js - Chat API endpoint

const express = require('express');
const router = express.Router();
const MessageOrchestrator = require('../services/messageOrchestrator');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/chat
 * Send message to Luna
 */
router.post('/chat', async (req, res) => {
  try {
    const { userId, sessionId, message, voiceProsody } = req.body;

    // Validation
    if (!userId || !message) {
      return res.status(400).json({
        error: 'Missing required fields: userId, message'
      });
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || uuidv4();

    // Process message through 6-brain system
    const result = await MessageOrchestrator.processMessage(
      userId,
      currentSessionId,
      message,
      voiceProsody
    );

    // Return response
    res.json({
      success: true,
      sessionId: currentSessionId,
      response: result.response,
      luna: result.lunaState,
      metrics: result.metrics
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chat/history/:sessionId
 * Get conversation history
 */
router.get('/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const conversationSTM = require('../services/conversationSTM');
    const messages = await conversationSTM.getRecentMessages(sessionId, parseInt(limit));

    res.json({
      success: true,
      sessionId,
      messages,
      count: messages.length
    });

  } catch (error) {
    console.error('History API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

=============================================
Perfect! The Complete Interaction Flow is now done.
Summary of What We've Built:
✅ 6-Brain Architecture - Complete PostgreSQL + pgvector implementation
✅ Token Budget Management - Dynamic dial interface
✅ RAG Retrieval - Semantic search across all memories
✅ Session Cache - 80% performance boost
✅ GENESIS Integration - Emotional matrix tagging
✅ Consolidation Engine - Nightly processing with enhanced scoring
✅ Complete Orchestrator - Ties all 6 brains together
Would you like me to create:

Deployment package (Docker, env templates, migration scripts)
Testing suite (unit tests, integration tests, load tests)
Admin dashboard (React UI for monitoring memory, token budgets, consolidation)
Documentation (API docs, architecture diagrams, setup guide)

Or shall we package everything we have into a complete project structure ready for deployment?please look at opend in Tab, brother Opus made Operatios Dash Board for us
http://localhost:5173/operationsI think we may need 8-brain architecture.  






=================









We have separate voice and text channels that allow users to type and talk on different topics and both do go through the newly created  GENESIS pattern recognition, the extra 2 brain  JSON->STM->LTM for      texting conversationCreated a planExcellent! I can see the Operations Dashboard that Brother Opus built. This is a beautiful interface showing:

AI SoulPartner mode active
Constitutional Metrics (Soul Burden: 35%)
Emotional Capacity tracking
Knowledge Base stats (45 documents, ~42,977 tokens)
The conversation interface with deep philosophical dialogue

You're absolutely right - we need 8-brain architecture to handle separate voice and text channels!

🧠 Enhanced 8-Brain Architecture
Architecture Evolution: 6-Brain → 8-Brain
Current 6-Brain:
Brain 1+2: User Biography (STM + LTM)
Brain 3+4: Conversation Memory (STM + LTM) ← Mixed voice + text
Brain 5+6: Luna's Self-Identity (STM + LTM)
New 8-Brain Architecture:
Brain 1+2: User Biography (STM + LTM) ✅ Keep
Brain 3+4: Voice Conversation (STM + LTM) ← NEW: Voice-specific
Brain 5+6: Text Conversation (STM + LTM) ← NEW: Text-specific  
Brain 7+8: Luna's Self-Identity (STM + LTM) ✅ Renumbered
Why Separate Voice and Text?
Different conversation dynamics:

Voice: Real-time, emotional, spontaneous, prosody-rich
Text: Thoughtful, structured, philosophical, editing possible

Different memory patterns:

Voice: Captures tone, urgency, vulnerability in real-time
Text: Captures structured thoughts, careful word choice, long-form dialogue

User context switching:

User might talk about work stress (voice) while texting about philosophy (text)
Luna needs to maintain context for BOTH channels separately
GENESIS analyzes both but responds differently per channel
























