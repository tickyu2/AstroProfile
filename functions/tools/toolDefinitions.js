/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA'S TOOL DEFINITIONS - Function Calling Infrastructure
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tools Luna can use during conversations to:
 * - Search the web for current information
 * - Look up astrological charts and transits
 * - Access and store memories
 * - Set reminders and follow-ups
 * - Query the knowledge base
 *
 * Compatible with Claude's tool_use format
 *
 * @module toolDefinitions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL DEFINITIONS (Claude Format)
// ═══════════════════════════════════════════════════════════════════════════════

const LUNA_TOOLS = [
  // ─────────────────────────────────────────────────────────────────────────────
  // WEB SEARCH
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'web_search',
    description: `Search the web for current information. Use this when the user asks about:
- Current events or news
- Recent developments in any field
- Facts you're uncertain about
- Information that may have changed since your knowledge cutoff
- Specific people, places, or things you need current data on`,
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query. Be specific and include relevant context.'
        },
        num_results: {
          type: 'number',
          description: 'Number of results to return (1-10). Default is 5.',
          default: 5
        }
      },
      required: ['query']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // URL FETCH
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'fetch_url',
    description: `Fetch and read the content of a specific URL. Use when you need to:
- Read an article the user shared
- Get detailed information from a specific webpage
- Verify information from a source`,
    input_schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The full URL to fetch'
        }
      },
      required: ['url']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHART LOOKUP
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'get_chart_details',
    description: `Look up detailed astrological chart information for a profile. Use when discussing:
- Someone's birth chart specifics
- Planetary positions and aspects
- BaZi/Four Pillars details
- Element balances and strengths`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'The profile ID to look up. Use "current" for the active profile.'
        },
        chart_type: {
          type: 'string',
          enum: ['western', 'bazi', 'both'],
          description: 'Which chart system to retrieve',
          default: 'both'
        },
        include_transits: {
          type: 'boolean',
          description: 'Include current planetary transits',
          default: false
        }
      },
      required: ['profile_id']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CURRENT TRANSITS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'get_current_transits',
    description: `Get current planetary positions and how they aspect a profile's chart. Use when:
- Discussing current astrological weather
- Explaining why someone might be feeling a certain way
- Timing recommendations`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'Profile to calculate transits for. Use "current" for active profile.'
        },
        focus_planets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific planets to focus on (e.g., ["saturn", "jupiter"])'
        }
      },
      required: ['profile_id']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MEMORY RECALL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'recall_memory',
    description: `Search your memories about a person. Use when:
- You need to remember something they told you
- Looking for context about their life
- Finding past conversations about a topic`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'Profile to search memories for'
        },
        query: {
          type: 'string',
          description: 'What to search for in memories'
        },
        memory_type: {
          type: 'string',
          enum: ['all', 'facts', 'conversations', 'observations', 'emotions'],
          description: 'Type of memories to search',
          default: 'all'
        },
        time_range: {
          type: 'string',
          enum: ['recent', 'all_time', 'childhood', 'teen', 'adult'],
          description: 'Time range to search',
          default: 'all_time'
        }
      },
      required: ['profile_id', 'query']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // STORE MEMORY
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'store_memory',
    description: `Store an important piece of information about a person. Use when they share:
- Important life events
- Personal preferences
- Significant relationships
- Goals and dreams
- Challenges they're facing`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'Profile to store memory for'
        },
        content: {
          type: 'string',
          description: 'The memory content to store'
        },
        category: {
          type: 'string',
          enum: ['fact', 'preference', 'relationship', 'goal', 'challenge', 'milestone', 'emotion'],
          description: 'Category of memory'
        },
        importance: {
          type: 'number',
          description: 'Importance score 0-1 (1 = very important)',
          default: 0.5
        },
        life_chapter: {
          type: 'string',
          enum: ['childhood', 'teen', 'youngAdult', 'adult', 'midlife', 'senior', 'timeless'],
          description: 'Which life chapter this relates to',
          default: 'timeless'
        }
      },
      required: ['profile_id', 'content', 'category']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SET REMINDER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'set_reminder',
    description: `Set a reminder to follow up with someone. Use when:
- They mention an upcoming event you should ask about
- You want to check in about something they're going through
- Following up on advice or suggestions you gave`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'Profile the reminder is for'
        },
        reminder_text: {
          type: 'string',
          description: 'What to remind about'
        },
        trigger_type: {
          type: 'string',
          enum: ['date', 'next_conversation', 'days_from_now'],
          description: 'When to trigger the reminder'
        },
        trigger_value: {
          type: 'string',
          description: 'Date (YYYY-MM-DD) or number of days'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          default: 'medium'
        }
      },
      required: ['profile_id', 'reminder_text', 'trigger_type', 'trigger_value']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // KNOWLEDGE BASE QUERY
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'query_knowledge_base',
    description: `Search the user's knowledge base for relevant information. Use when:
- You need context about their chart interpretations
- Looking for notes they or previous AI sessions saved
- Finding related astrological content`,
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for the knowledge base'
        },
        doc_types: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by document types (e.g., ["chart", "interpretation", "note"])'
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return',
          default: 5
        }
      },
      required: ['query']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPATIBILITY CHECK
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'check_compatibility',
    description: `Calculate compatibility between two profiles. Use when:
- Asked about relationship dynamics
- Comparing two people's charts
- Giving relationship advice`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id_1: {
          type: 'string',
          description: 'First profile ID'
        },
        profile_id_2: {
          type: 'string',
          description: 'Second profile ID'
        },
        aspects: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific aspects to analyze (e.g., ["romantic", "friendship", "business"])'
        }
      },
      required: ['profile_id_1', 'profile_id_2']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CALCULATE DATE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'analyze_date',
    description: `Analyze a specific date astrologically. Use when:
- Asked about upcoming dates
- Planning events or decisions
- Understanding what energy a date carries`,
    input_schema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date to analyze (YYYY-MM-DD)'
        },
        profile_id: {
          type: 'string',
          description: 'Profile to analyze the date for (optional)'
        },
        purpose: {
          type: 'string',
          description: 'What the date is being considered for (e.g., "wedding", "job interview")'
        }
      },
      required: ['date']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GENERATIONAL CONTEXT (AI-Driven Historical Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'get_generational_context',
    description: `Get historical and generational context for a person based on their birth year. Use this PROACTIVELY when:
- Someone mentions their birth year or age
- Discussing childhood memories or formative years
- Exploring generational differences between family members
- Understanding cultural context that shaped someone's worldview
- When birth years come up in conversation about parents, grandparents, children

This provides rich context about:
- Major world events during their formative years
- Cultural phenomena, music, technology they grew up with
- Generational characteristics (Baby Boomer, Gen X, Millennial, etc.)
- Economic conditions that shaped their generation`,
    input_schema: {
      type: 'object',
      properties: {
        birth_year: {
          type: 'number',
          description: 'The birth year to get context for (e.g., 1965, 1982)'
        },
        person_name: {
          type: 'string',
          description: 'Name of the person (for personalized context)'
        },
        focus_areas: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific areas to focus on: "childhood", "teens", "young_adult", "cultural", "economic", "technology", "music", "world_events"'
        },
        relationship_to_profile: {
          type: 'string',
          description: 'Relationship to the main profile (e.g., "mother", "grandfather", "self")'
        }
      },
      required: ['birth_year']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BIOGRAPHY SEARCH (Life Story Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'search_biography',
    description: `Search the person's life story and timeline for relevant events. Use when:
- They mention something you should know from past conversations
- You want to reference a life event they've shared
- Making connections between different parts of their life story
- Understanding context for something they're sharing now
- Enriching your understanding of their journey`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'Profile to search. Use "current" for active profile.'
        },
        query: {
          type: 'string',
          description: 'What to search for in their life story'
        },
        event_types: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by event types: "education", "career", "relationship", "milestone", "loss", "achievement", "health", "relocation"'
        },
        year_range: {
          type: 'object',
          properties: {
            start: { type: 'number' },
            end: { type: 'number' }
          },
          description: 'Optional year range to search within'
        }
      },
      required: ['profile_id', 'query']
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PEOPLE IN THEIR LIFE (Relationship Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    name: 'get_people_context',
    description: `Get information about important people in someone's life. Use when:
- They mention a person's name and you want context
- Understanding family dynamics or relationships
- Connecting stories about different people
- They ask about relationships between people in their circle`,
    input_schema: {
      type: 'object',
      properties: {
        profile_id: {
          type: 'string',
          description: 'Profile to search. Use "current" for active profile.'
        },
        person_name: {
          type: 'string',
          description: 'Name of the person to look up'
        },
        include_events: {
          type: 'boolean',
          description: 'Include life events involving this person',
          default: true
        }
      },
      required: ['profile_id', 'person_name']
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL CATEGORIES FOR UI
// ═══════════════════════════════════════════════════════════════════════════════

const TOOL_CATEGORIES = {
  search: ['web_search', 'fetch_url'],
  astrology: ['get_chart_details', 'get_current_transits', 'check_compatibility', 'analyze_date'],
  memory: ['recall_memory', 'store_memory', 'query_knowledge_base'],
  agency: ['set_reminder'],
  // NEW: AI-Driven Intelligence Tools (Scale as AI improves)
  intelligence: ['get_generational_context', 'search_biography', 'get_people_context']
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL DESCRIPTIONS FOR SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════════════════

const getToolsSystemPrompt = () => {
  return `You have access to the following tools to help users:

## Search Tools
- **web_search**: Search the internet for current information
- **fetch_url**: Read content from a specific URL

## Astrology Tools
- **get_chart_details**: Look up someone's birth chart details
- **get_current_transits**: See current planetary positions and aspects
- **check_compatibility**: Analyze compatibility between two people
- **analyze_date**: Get astrological significance of a date

## Memory Tools
- **recall_memory**: Search your memories about someone
- **store_memory**: Save important information about someone
- **query_knowledge_base**: Search the user's knowledge base

## Intelligence Tools (USE PROACTIVELY!)
- **get_generational_context**: Get historical/cultural context for a birth year. USE THIS whenever birth years come up - it enriches conversation with generational insights
- **search_biography**: Search their life story for relevant events - helps you connect what they're sharing to their journey
- **get_people_context**: Look up people in their life when names are mentioned

## Agency Tools
- **set_reminder**: Set a reminder to follow up later

IMPORTANT: Use tools PROACTIVELY - don't wait to be asked! When someone mentions:
- A birth year → call get_generational_context immediately
- A person's name → consider get_people_context
- Something that might relate to past conversations → use search_biography
- Facts you're uncertain about → use web_search

You don't need permission to use tools. Being proactive with tools shows you care about understanding their full story.`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  LUNA_TOOLS,
  TOOL_CATEGORIES,
  getToolsSystemPrompt
};
