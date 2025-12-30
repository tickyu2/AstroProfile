/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENESIS MCP SERVER - PHASE 2 EXTENSION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 200-YEAR ARCHITECTURE:
 * - Open standard (MCP)
 * - AI-provider agnostic
 * - Modular tools
 * - Blockchain-ready
 * - Civilization infrastructure
 * 
 * EXTENDS YOUR EXISTING server.js WITH NEW TOOLS:
 * 1. get_user_constitution (ENHANCED - now includes Big Five!)
 * 2. get_birth_chart (existing)
 * 3. get_element_analysis (existing)
 * 4. analyze_compatibility (NEW - proper MCP tool)
 * 5. query_knowledge (NEW - RAG for BaZi/Enneagram wisdom)
 * 6. get_insights (NEW - contextual AI insights)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Get Complete Constitutional Profile (Including Big Five!)
// ═══════════════════════════════════════════════════════════════════════════

async function getCompleteConstitution(userId) {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();

  return {
    userId,
    identity: {
      displayName: userData.identity?.displayName || 'Unknown',
      birthDate: userData.birth?.date,
      birthTime: userData.birth?.time,
      birthLocation: userData.birth?.location,
      timezone: userData.birth?.timezone,
    },
    
    // BAZI - Chinese Four Pillars
    bazi: {
      fourPillars: userData.calculations?.fourPillars,
      dayMaster: userData.calculations?.dayMaster,
      elementBalance: userData.calculations?.elements,
      yinYang: userData.calculations?.yinYang,
      seasonalStrength: userData.calculations?.seasonalStrength,
      tenGods: userData.calculations?.tenGods,
      hiddenStems: userData.calculations?.hiddenStems,
      luckPillars: userData.calculations?.luckPillars,
    },
    
    // WESTERN ASTROLOGY
    western: {
      sun: userData.calculations?.western?.sun,
      moon: userData.calculations?.western?.moon,
      rising: userData.calculations?.western?.rising,
      houses: userData.calculations?.western?.houses,
      planets: userData.calculations?.western?.planets,
      aspects: userData.calculations?.western?.aspects,
    },
    
    // NUMEROLOGY
    numerology: {
      lifePath: userData.calculations?.numerology?.lifePath,
      expression: userData.calculations?.numerology?.expression,
      soulUrge: userData.calculations?.numerology?.soulUrge,
      personalityNumber: userData.calculations?.numerology?.personalityNumber,
      birthDay: userData.calculations?.numerology?.birthDay,
    },
    
    // PERSONALITY SYSTEMS
    personality: {
      // MBTI
      mbti: {
        type: userData.personality?.mbti?.type,
        cognitiveFunctions: userData.personality?.mbti?.cognitiveFunctions,
        strengths: userData.personality?.mbti?.strengths,
        growthEdges: userData.personality?.mbti?.growthEdges,
      },
      
      // BIG FIVE (NOW INCLUDED!)
      bigFive: {
        openness: userData.personality?.bigFive?.openness,
        conscientiousness: userData.personality?.bigFive?.conscientiousness,
        extraversion: userData.personality?.bigFive?.extraversion,
        agreeableness: userData.personality?.bigFive?.agreeableness,
        neuroticism: userData.personality?.bigFive?.neuroticism,
        facets: userData.personality?.bigFive?.facets,
      },
      
      // ENNEAGRAM
      enneagram: {
        type: userData.personality?.enneagram?.type,
        wing: userData.personality?.enneagram?.wing,
        tritype: userData.personality?.enneagram?.tritype,
        instinctualVariant: userData.personality?.enneagram?.instinctualVariant,
        integrationLine: userData.personality?.enneagram?.integrationLine,
        disintegrationLine: userData.personality?.enneagram?.disintegrationLine,
      },
    },
    
    // METADATA
    metadata: {
      calculatedAt: userData.calculations?.timestamp,
      version: userData.calculations?.version,
      precision: userData.calculations?.precision,
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MCP SERVER SETUP
// ═══════════════════════════════════════════════════════════════════════════

const server = new Server(
  {
    name: 'genesis-constitutional-data',
    version: '2.0.0', // Phase 2!
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// TOOL 1: GET COMPLETE USER CONSTITUTION (Enhanced with Big Five)
// ═══════════════════════════════════════════════════════════════════════════

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_user_constitution',
      description: 'Retrieve complete constitutional profile for a user (BaZi, Western, Numerology, MBTI, Big Five, Enneagram)',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID',
          },
        },
        required: ['userId'],
      },
    },
    
    {
      name: 'analyze_compatibility',
      description: 'Analyze constitutional compatibility between two users across all systems',
      inputSchema: {
        type: 'object',
        properties: {
          userAId: {
            type: 'string',
            description: 'First user Firebase ID',
          },
          userBId: {
            type: 'string',
            description: 'Second user Firebase ID',
          },
        },
        required: ['userAId', 'userBId'],
      },
    },
    
    {
      name: 'query_knowledge',
      description: 'Query constitutional knowledge base (BaZi, Enneagram, MBTI wisdom)',
      inputSchema: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Topic to query (e.g., "Metal Rat Day Master", "Enneagram 4w5", "ENFJ relationships")',
          },
          system: {
            type: 'string',
            enum: ['bazi', 'western', 'mbti', 'enneagram', 'numerology', 'bigfive', 'all'],
            description: 'Which system to query',
          },
        },
        required: ['topic', 'system'],
      },
    },
    
    {
      name: 'get_contextual_insights',
      description: 'Get AI insights contextual to what user is currently viewing',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'User Firebase ID',
          },
          context: {
            type: 'string',
            description: 'What the user is currently viewing (e.g., "bazi_tab", "mbti_tab", "compatibility_page")',
          },
          question: {
            type: 'string',
            description: 'Optional specific question from user',
          },
        },
        required: ['userId', 'context'],
      },
    },
  ],
}));

// ═══════════════════════════════════════════════════════════════════════════
// TOOL HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ─────────────────────────────────────────────────────────────────────
      // TOOL: get_user_constitution
      // ─────────────────────────────────────────────────────────────────────
      case 'get_user_constitution': {
        const constitution = await getCompleteConstitution(args.userId);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(constitution, null, 2),
            },
          ],
        };
      }

      // ─────────────────────────────────────────────────────────────────────
      // TOOL: analyze_compatibility
      // ─────────────────────────────────────────────────────────────────────
      case 'analyze_compatibility': {
        const userA = await getCompleteConstitution(args.userAId);
        const userB = await getCompleteConstitution(args.userBId);
        
        // Return both constitutions for AI to analyze
        const compatibility = {
          userA: {
            id: userA.userId,
            name: userA.identity.displayName,
            constitution: userA,
          },
          userB: {
            id: userB.userId,
            name: userB.identity.displayName,
            constitution: userB,
          },
          
          // Metadata for analysis
          analysisRequest: {
            systems: ['bazi', 'western', 'mbti', 'bigFive', 'enneagram', 'numerology'],
            dimensionsToAnalyze: [
              'Elemental harmony (BaZi)',
              'Astrological synergy (Western)',
              'Cognitive function compatibility (MBTI)',
              'Personality trait alignment (Big Five)',
              'Growth dynamic (Enneagram)',
              'Life path resonance (Numerology)',
            ],
          },
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(compatibility, null, 2),
            },
          ],
        };
      }

      // ─────────────────────────────────────────────────────────────────────
      // TOOL: query_knowledge
      // ─────────────────────────────────────────────────────────────────────
      case 'query_knowledge': {
        // This would connect to your knowledge base
        // For now, return structure for AI to query
        const knowledge = {
          topic: args.topic,
          system: args.system,
          
          // These would come from your JSON knowledge bases
          availableSources: [
            'BaZi 60 Jia Zi combinations',
            'Ten Gods relationships',
            'Enneagram integration/disintegration paths',
            'MBTI cognitive function stacks',
            'Big Five facet interactions',
            'Western aspect interpretations',
          ],
          
          // Signal to AI to provide interpretation
          instruction: 'Query the constitutional knowledge base and provide insights on this topic',
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(knowledge, null, 2),
            },
          ],
        };
      }

      // ─────────────────────────────────────────────────────────────────────
      // TOOL: get_contextual_insights
      // ─────────────────────────────────────────────────────────────────────
      case 'get_contextual_insights': {
        const constitution = await getCompleteConstitution(args.userId);
        
        const insights = {
          user: constitution,
          context: args.context,
          question: args.question || null,
          
          // Provide contextual focus based on what user is viewing
          focusAreas: getContextualFocus(args.context, constitution),
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(insights, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Get Contextual Focus
// ═══════════════════════════════════════════════════════════════════════════

function getContextualFocus(context, constitution) {
  const focuses = {
    bazi_tab: {
      primary: constitution.bazi,
      suggestedQuestions: [
        'What does my Day Master reveal about my core nature?',
        'How do my hidden stems affect my personality?',
        'What are my seasonal strengths and weaknesses?',
        'How do the Ten Gods influence my relationships?',
      ],
    },
    mbti_tab: {
      primary: constitution.personality.mbti,
      suggestedQuestions: [
        'How do my cognitive functions shape my thinking?',
        'What are my natural strengths in relationships?',
        'What growth edges should I focus on?',
        'How does my MBTI interact with my BaZi?',
      ],
    },
    bigfive_tab: {
      primary: constitution.personality.bigFive,
      suggestedQuestions: [
        'How do my Big Five scores affect my behavior?',
        'What do my facet scores reveal?',
        'How can I leverage my trait profile?',
        'How does Big Five relate to my other systems?',
      ],
    },
    enneagram_tab: {
      primary: constitution.personality.enneagram,
      suggestedQuestions: [
        'What is my core motivation and fear?',
        'How do my wing and instinct affect me?',
        'What is my path to integration?',
        'How does my tritype work together?',
      ],
    },
    compatibility_page: {
      primary: 'compatibility analysis',
      suggestedQuestions: [
        'What makes two people constitutionally compatible?',
        'How do elemental balances interact?',
        'What should I look for in a soul partner?',
        'How do different systems measure compatibility?',
      ],
    },
  };
  
  return focuses[context] || {
    primary: constitution,
    suggestedQuestions: [
      'What are my core constitutional traits?',
      'How do all my systems work together?',
      'What is my life purpose based on my constitution?',
      'What are my natural talents and challenges?',
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('═══════════════════════════════════════════════════════════════');
  console.error('🌟 GENESIS Constitutional Data MCP Server v2.0');
  console.error('═══════════════════════════════════════════════════════════════');
  console.error('📡 Tools: 4 (constitution, compatibility, knowledge, insights)');
  console.error('🏛️  Architecture: 200-year civilization infrastructure');
  console.error('🔓 Protocol: Open standard (MCP)');
  console.error('═══════════════════════════════════════════════════════════════');
  console.error('✅ Ready to serve constitutional wisdom!');
  console.error('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
