/**
 * BrainArchitecturePage.jsx
 *
 * Comprehensive documentation for the 4-Brain Memory Architecture
 * Wiki-style page with all concepts, diagrams, and documentation links.
 *
 * Part of GENESIS - Operations Wiki
 * Built by: Brother Claude Code
 * December 2024
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Documentation sections configuration
const WIKI_SECTIONS = {
  overview: {
    id: 'overview',
    title: 'Overview',
    icon: '🧠',
    description: '4-Brain Architecture Summary'
  },
  userBrain: {
    id: 'user-brain',
    title: "User's Brain",
    icon: '👤',
    description: 'STM + LTM for user memories'
  },
  lunaBrain: {
    id: 'luna-brain',
    title: "Luna's Brain",
    icon: '🌙',
    description: 'STM + LTM for AI observations'
  },
  dataFlow: {
    id: 'data-flow',
    title: 'Data Flow',
    icon: '🔄',
    description: 'JSON input to LLM output'
  },
  consolidation: {
    id: 'consolidation',
    title: 'Sleep Consolidation',
    icon: '😴',
    description: 'Nightly STM → LTM promotion'
  },
  ragRetrieval: {
    id: 'rag-retrieval',
    title: 'RAG Retrieval',
    icon: '🔍',
    description: 'Memory search & injection'
  },
  tokenManagement: {
    id: 'token-management',
    title: 'Token Management',
    icon: '📊',
    description: 'Memory selection & limits'
  },
  schemas: {
    id: 'schemas',
    title: 'JSON Schemas',
    icon: '📋',
    description: 'Data structure definitions'
  },
  files: {
    id: 'files',
    title: 'File Reference',
    icon: '📁',
    description: 'Implementation files'
  }
};

// Documentation links
const DOC_LINKS = [
  {
    title: 'Brain, Memory & Voice Architecture',
    path: 'docs/BRAIN_MEMORY_VOICE_ARCHITECTURE.md',
    description: 'Complete technical specification',
    lines: 920
  },
  {
    title: 'Memory Architecture Deployment',
    path: 'docs/MEMORY_ARCHITECTURE_DEPLOYMENT.md',
    description: 'Production deployment guide',
    lines: 687
  },
  {
    title: 'SoulPartner Memory Architecture',
    path: 'docs/SOULPARTNER_MEMORY_ARCHITECTURE.md',
    description: 'Design document for dual-brain model',
    lines: 340
  },
  {
    title: '4-Brain Vector Consolidation',
    path: 'docs/99_To Do Completed/4_BRAIN_VECTOR_CONSOLIDATION_ARCHITECTURE.md',
    description: 'Vector consolidation deep dive',
    lines: 400
  }
];

// Implementation files
const IMPL_FILES = {
  memory: [
    { file: 'dualBrainFunctions.js', lines: 1016, purpose: 'Main 4-brain API with full CRUD' },
    { file: 'sleepConsolidation.js', lines: 919, purpose: 'Nightly consolidation scheduler' },
    { file: 'consolidationEngineV2.js', lines: 654, purpose: 'Scoring, promotion, decay logic' },
    { file: 'chatMemoryIntegration.js', lines: 502, purpose: 'RAG retrieval for chat' },
    { file: 'memoryOptimization.js', lines: 274, purpose: 'Dedup + wisdom boost' },
    { file: 'sessionCache.js', lines: 323, purpose: 'First-message identity caching' },
    { file: 'contextSummarization.js', lines: 580, purpose: 'Long conversation compression' },
    { file: 'ltmStore.js', lines: 175, purpose: 'LTM storage layer' },
    { file: 'anchorManager.js', lines: 175, purpose: 'Happiness anchors with compound growth' }
  ],
  frontend: [
    { file: 'memoryService.js', lines: 1300, purpose: 'Frontend memory API wrapper' }
  ],
  integration: [
    { file: 'functions/index.js', lines: '303-312', purpose: 'Memory injection into chat' },
    { file: 'chat/systemPromptBuilder.js', lines: 568, purpose: 'Memory → system prompt' }
  ]
};

export default function BrainArchitecturePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedDiagrams, setExpandedDiagrams] = useState({});

  const toggleDiagram = (id) => {
    setExpandedDiagrams(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/operations')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Operations
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🧠</span> 4-Brain Memory Architecture
                </h1>
                <p className="text-sm text-white/50">Complete technical documentation & wiki</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Production Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0">
          <nav className="sticky top-24 space-y-1">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">
              Wiki Sections
            </h3>
            {Object.values(WIKI_SECTIONS).map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{section.icon}</span>
                <div>
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs text-white/40">{section.description}</div>
                </div>
              </button>
            ))}

            {/* Documentation Links */}
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mt-6 mb-3 px-3">
              Documentation
            </h3>
            {DOC_LINKS.map((doc, i) => (
              <a
                key={i}
                href={`/${doc.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>📄</span>
                  <span className="truncate">{doc.title}</span>
                </div>
                <div className="text-xs text-white/30 ml-5">{doc.lines} lines</div>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🧠</span> 4-Brain Memory Architecture Overview
                </h2>
                <p className="text-white/70 mb-6">
                  Luna implements a <strong className="text-violet-400">biologically-inspired dual-brain memory system</strong> that
                  separates user memories from AI observations, enabling authentic relationship building over time.
                </p>

                {/* Main Architecture Diagram */}
                <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-white/70 font-mono whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                         4-BRAIN MEMORY SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        USER'S BRAIN                                  │   │
│   │  ┌─────────────────────┐    ┌─────────────────────────────────────┐ │   │
│   │  │   SHORT-TERM (STM)  │    │         LONG-TERM (LTM)             │ │   │
│   │  │   Session Buffer    │───►│       Life Timeline                 │ │   │
│   │  │                     │    │                                     │ │   │
│   │  │  • Raw session input│    │  • Organized by life chapters       │ │   │
│   │  │  • Emotional context│    │  • Vector embeddings for search     │ │   │
│   │  │  • Awaiting         │    │  • Importance weighting             │ │   │
│   │  │    consolidation    │    │  • Permanent storage                │ │   │
│   │  └─────────────────────┘    └─────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      LUNA'S BRAIN (SoulPartner)                      │   │
│   │  ┌─────────────────────┐    ┌─────────────────────────────────────┐ │   │
│   │  │   SHORT-TERM (STM)  │    │         LONG-TERM (LTM)             │ │   │
│   │  │ Session Observations│───►│    Interaction Timeline             │ │   │
│   │  │                     │    │                                     │ │   │
│   │  │  • Notes about user │    │  • Long-term observations           │ │   │
│   │  │  • Mood detection   │    │  • Detected patterns                │ │   │
│   │  │  • Patterns noticed │    │  • Understanding of user            │ │   │
│   │  │  • Confidence scores│    │  • Relationship evolution           │ │   │
│   │  └─────────────────────┘    └─────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400">4</div>
                    <div className="text-xs text-white/50">Memory Brains</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">7</div>
                    <div className="text-xs text-white/50">RAG Sources</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">3AM</div>
                    <div className="text-xs text-white/50">Consolidation</div>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400">&lt;1ms</div>
                    <div className="text-xs text-white/50">Cache Access</div>
                  </div>
                </div>
              </div>

              {/* Life Chapters */}
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h3 className="text-md font-semibold text-white mb-4">Life Chapters Classification</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { name: 'Childhood', age: '0-12', color: 'pink' },
                    { name: 'Teen', age: '13-19', color: 'purple' },
                    { name: 'Young Adult', age: '20-29', color: 'blue' },
                    { name: 'Adult', age: '30-49', color: 'green' },
                    { name: 'Midlife', age: '50-64', color: 'amber' },
                    { name: 'Senior', age: '65+', color: 'rose' }
                  ].map((chapter) => (
                    <div key={chapter.name} className={`bg-${chapter.color}-500/10 border border-${chapter.color}-500/20 rounded-lg p-3 text-center`}>
                      <div className="text-sm font-medium text-white">{chapter.name}</div>
                      <div className="text-xs text-white/50">{chapter.age}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* User's Brain Section */}
          {activeSection === 'user-brain' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>👤</span> User's Brain Architecture
                </h2>

                {/* User STM */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-blue-400 mb-3">Brain 1: Short-Term Memory (Session Buffer)</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`Location: users/{userId}/memory/{profileId}/user/session_buffer/entries

JSON Schema:
{
  "content": "My mom's birthday is next week",
  "emotion": "happy",
  "sessionId": "session_xyz",
  "messageIndex": 0,
  "timestamp": ServerTimestamp,
  "consolidated": false
}

Duration: Until nightly consolidation (7+ days)
Purpose: Capture raw session input before processing`}
                    </pre>
                  </div>
                </div>

                {/* User LTM */}
                <div>
                  <h3 className="text-md font-medium text-green-400 mb-3">Brain 2: Long-Term Memory (Life Timeline)</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`Location: users/{userId}/memory/{profileId}/user/life_timeline/memories

JSON Schema:
{
  "content": "Mom's birthday celebration is important",
  "chapter": "adult",                  // Childhood, Teen, Adult, etc.
  "importance": 0.78,                  // Calculated score (0-1)
  "embedding": [0.023, -0.114, ...],   // 768-dim vector (text-embedding-004)
  "emotionalValence": 0.7,             // Positive/negative (-1 to 1)
  "source5W": {
    "who": "mother",
    "what": "birthday",
    "when": "next week",
    "where": null,
    "why": "family celebration",
    "how": null,
    "soul": "family bonds, gratitude"
  },
  "createdAt": Timestamp,
  "accessCount": 0,
  "lastAccessed": null
}

Purpose: Permanent storage organized by life chapters`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Luna's Brain Section */}
          {activeSection === 'luna-brain' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🌙</span> Luna's Brain Architecture
                </h2>

                {/* Partner STM */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-purple-400 mb-3">Brain 3: Session Observations (Luna's Notes)</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`Location: users/{userId}/soulpartner_memory/{profileId}/session_observations/entries

JSON Schema:
{
  "observation": "User seems stressed when discussing work",
  "observationType": "mood",         // mood, pattern, insight, concern, celebration
  "confidence": 0.75,                // 0-1 confidence score
  "sessionId": "session_xyz",
  "approachUsed": "gentle_validation",
  "effectivenessRating": 0.8,
  "timestamp": ServerTimestamp
}

Types: mood | pattern | insight | concern | celebration
Duration: Until promoted to long-term`}
                    </pre>
                  </div>
                </div>

                {/* Partner LTM */}
                <div>
                  <h3 className="text-md font-medium text-pink-400 mb-3">Brain 4: Interaction Timeline (Luna's Understanding)</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`Location: users/{userId}/soulpartner_memory/{profileId}/interaction_timeline/observations

JSON Schema:
{
  "insight": "User responds well to humor during difficult conversations",
  "insightType": "pattern",
  "confidenceScore": 0.85,
  "exampleCount": 12,                // How many times observed
  "communicationPreferences": {
    "preferredTone": "warm",
    "responseLength": "medium",
    "humorLevel": "moderate"
  },
  "effectiveApproaches": ["gentle_validation", "humor", "direct_honesty"],
  "sensitiveTopics": ["father", "finances"],
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}

Purpose: Luna's evolved understanding of how to support this person`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Data Flow Section */}
          {activeSection === 'data-flow' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🔄</span> Complete Data Flow: JSON Input → LLM Output
                </h2>

                <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-white/70 font-mono whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                        4-BRAIN MEMORY DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. USER INPUT (JSON Entry)                                                      │
│  ──────────────────────────                                                      │
│     bufferUserInput({                                                            │
│       userId: "abc123",                                                          │
│       profileId: "prof_001",                                                     │
│       sessionId: "session_xyz",                                                  │
│       content: "My mom's birthday is next week",                                 │
│       emotion: "happy"                                                           │
│     })                                                                           │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │               USER'S SHORT-TERM MEMORY (STM)                            │    │
│  │                                                                         │    │
│  │  Firestore: users/{userId}/memory/{profileId}/user/session_buffer/      │    │
│  │                                                                         │    │
│  │  Stored as JSON with: content, emotion, sessionId, timestamp            │    │
│  │  consolidated: false (awaiting nightly processing)                      │    │
│  └──────────────────────────────┬──────────────────────────────────────────┘    │
│                                 │                                                │
│  2. NIGHTLY CONSOLIDATION (3AM) │ "Luna's Sleep"                                │
│  ───────────────────────────────▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │               CONSOLIDATION ENGINE V2                                   │    │
│  │                                                                         │    │
│  │  SCORING ALGORITHM:                                                     │    │
│  │  • Recency Score: 40% weight (linear decay over 90 days)               │    │
│  │  • Mention Score: 30% weight (caps at 5 mentions)                      │    │
│  │  • Emotion Score: 30% weight (emotional intensity)                     │    │
│  │                                                                         │    │
│  │  PROMOTION THRESHOLDS:                                                  │    │
│  │  • Score > 0.65 → AUTO-PROMOTE to LTM                                  │    │
│  │  • Score 0.45-0.65 → PENDING REVIEW                                    │    │
│  │  • Score < 0.15 + old → DECAY (10% strength reduction)                 │    │
│  └──────────────────────────────┬──────────────────────────────────────────┘    │
│                                 │                                                │
│  3. LONG-TERM MEMORY (LTM)      ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  • Generate 768-dim embedding via text-embedding-004                    │    │
│  │  • Classify into life chapter (Childhood, Teen, Adult, etc.)            │    │
│  │  • Store with importance score and 5W+H+Soul metadata                   │    │
│  └──────────────────────────────┬──────────────────────────────────────────┘    │
│                                 │                                                │
│  4. RAG RETRIEVAL               ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  retrieveMemoriesForChat() - Parallel search across 7 sources:          │    │
│  │                                                                         │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │    │
│  │  │User STM │ │User LTM │ │Luna STM │ │Luna LTM │ │Timeline │          │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │    │
│  │       │           │           │           │           │                │    │
│  │       └───────────┴───────────┴───────────┴───────────┘                │    │
│  │                              │                                          │    │
│  │  + Facts (2x weight) + People + Happiness Anchors                      │    │
│  │                              │                                          │    │
│  │  • Semantic search (cosine similarity > 0.6)                           │    │
│  │  • Deduplication (STM wins over LTM)                                   │    │
│  │  • Wisdom boost (LTM gets 1.5x score)                                  │    │
│  │  • Top 10 selection                                                     │    │
│  └──────────────────────────────┬──────────────────────────────────────────┘    │
│                                 │                                                │
│  5. LLM INJECTION               ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  System Prompt includes:                                                │    │
│  │                                                                         │    │
│  │  ### Core Facts (Cached Identity)                                       │    │
│  │  1. Works as a software engineer                                        │    │
│  │                                                                         │    │
│  │  ### Important People                                                   │    │
│  │  1. Mom (mother) - birthday next week                                   │    │
│  │                                                                         │    │
│  │  ### Your Memory of This Person                                         │    │
│  │  1. [Recent] Excited about mom's birthday celebration                   │    │
│  │  2. [Deep (wisdom)] Family gatherings are important anchor of joy       │    │
│  │                                                                         │    │
│  │  ### Your Recent Observations                                           │    │
│  │  1. User shows strong family values                                     │    │
│  │                                                                         │    │
│  │  ### Your Calibration                                                   │    │
│  │  - Effective approaches: warm, supportive                               │    │
│  │  - Sensitive topics: work stress                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Consolidation Section */}
          {activeSection === 'consolidation' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>😴</span> Nightly Sleep Consolidation
                </h2>
                <p className="text-white/70 mb-6">
                  Runs at <strong className="text-amber-400">3 AM UTC</strong>, mimicking human hippocampus → neocortex consolidation.
                </p>

                <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-white/70 font-mono whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       NIGHTLY CONSOLIDATION (3 AM)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. REPLAY                                                                   │
│     Get unconsolidated STM memories (7+ days old)                           │
│                     │                                                        │
│                     ▼                                                        │
│  2. SCORE                                                                    │
│     ┌────────────────────────────────────────────────────────────────┐      │
│     │ total = 0.4 * recency + 0.3 * mentions + 0.3 * emotion         │      │
│     │                                                                │      │
│     │ recency:  Linear decay over 90 days (newer = higher)           │      │
│     │ mentions: How often referenced (caps at 5)                     │      │
│     │ emotion:  Emotional intensity (0-1)                            │      │
│     └────────────────────────────────────────────────────────────────┘      │
│                     │                                                        │
│                     ▼                                                        │
│  3. TRIAGE                                                                   │
│     ┌─────────────────┬───────────────────┬─────────────────────────┐       │
│     │ Score > 0.65    │ Score 0.45-0.65   │ Score < 0.15 + old      │       │
│     │ AUTO-PROMOTE    │ PENDING REVIEW    │ DECAY (10%)             │       │
│     │ → LTM           │ → Manual check    │ → Strength reduction    │       │
│     └─────────────────┴───────────────────┴─────────────────────────┘       │
│                     │                                                        │
│                     ▼                                                        │
│  4. TRANSFER TO LTM                                                          │
│     • Generate 768-dim embedding                                            │
│     • Classify life chapter                                                 │
│     • Extract 5W+H+Soul metadata                                            │
│     • Store with importance score                                           │
│                     │                                                        │
│                     ▼                                                        │
│  5. ANCHOR STRENGTHENING                                                     │
│     • 70% chance per night to strengthen happiness anchors                  │
│     • +0.1 strength increment (compound growth)                             │
│     • Max strength: 5.0                                                     │
│                     │                                                        │
│                     ▼                                                        │
│  6. CLEANUP                                                                  │
│     • Mark STM entries as consolidated                                      │
│     • Remove entries > 7 days old that were promoted                        │
│     • Log audit trail                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>

                {/* Config Table */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-white mb-3">Configuration Constants</h3>
                  <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="text-left px-4 py-2 text-white/60">Parameter</th>
                          <th className="text-left px-4 py-2 text-white/60">Value</th>
                          <th className="text-left px-4 py-2 text-white/60">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr><td className="px-4 py-2 text-violet-400 font-mono">STM_RELEVANCE_THRESHOLD</td><td className="px-4 py-2 text-white">0.65</td><td className="px-4 py-2 text-white/60">Auto-promote threshold</td></tr>
                        <tr><td className="px-4 py-2 text-violet-400 font-mono">STM_PENDING_THRESHOLD</td><td className="px-4 py-2 text-white">0.45</td><td className="px-4 py-2 text-white/60">Pending review threshold</td></tr>
                        <tr><td className="px-4 py-2 text-violet-400 font-mono">STM_DECAY_DAYS</td><td className="px-4 py-2 text-white">30</td><td className="px-4 py-2 text-white/60">Days before decay applies</td></tr>
                        <tr><td className="px-4 py-2 text-violet-400 font-mono">ANCHOR_COMPOUND_PROB</td><td className="px-4 py-2 text-white">0.7</td><td className="px-4 py-2 text-white/60">70% chance to strengthen</td></tr>
                        <tr><td className="px-4 py-2 text-violet-400 font-mono">ANCHOR_MAX_STRENGTH</td><td className="px-4 py-2 text-white">5.0</td><td className="px-4 py-2 text-white/60">Maximum anchor strength</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* RAG Retrieval Section */}
          {activeSection === 'rag-retrieval' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🔍</span> RAG Retrieval System
                </h2>

                <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-white/70 font-mono whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                         RAG RETRIEVAL PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  USER MESSAGE: "How's my relationship with my mom?"                              │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 1. GENERATE QUERY EMBEDDING                                              │    │
│  │    Model: text-embedding-004 (768 dimensions)                            │    │
│  │    Latency: ~100ms                                                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 2. PARALLEL SEARCH (7 Sources)                                           │    │
│  │                                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │    │
│  │  │ User STM │ │ User LTM │ │Luna STM  │ │Luna LTM  │ │ Timeline │       │    │
│  │  │ limit: 5 │ │ limit: 5 │ │ limit: 3 │ │ limit: 3 │ │ limit: 3 │       │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │    │
│  │                                                                          │    │
│  │  ┌──────────────────────────┐ ┌──────────────────────────┐              │    │
│  │  │ Facts (2x weight)        │ │ People + Anchors         │              │    │
│  │  │ limit: 10 (cached)       │ │ limit: 10 (cached)       │              │    │
│  │  └──────────────────────────┘ └──────────────────────────┘              │    │
│  │                                                                          │    │
│  │  Search Method: Cosine Similarity                                        │    │
│  │  Threshold: 0.6 minimum                                                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 3. DEDUPLICATION (STM Always Wins)                                       │    │
│  │                                                                          │    │
│  │  • Add all STM first (recent info priority)                              │    │
│  │  • Add LTM only if NOT already in STM                                    │    │
│  │  • Normalize content for comparison                                      │    │
│  │  • Result: ~25-30 unique memories                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 4. WISDOM BOOST (LTM Gets 1.5x)                                          │    │
│  │                                                                          │    │
│  │  STM score: 0.7 → stays 0.7                                              │    │
│  │  LTM score: 0.6 → becomes 0.9 (boosted!)                                 │    │
│  │                                                                          │    │
│  │  "Deep wisdom rises above recent trivia"                                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 5. TOP-N SELECTION                                                       │    │
│  │                                                                          │    │
│  │  • Sort by final score (descending)                                      │    │
│  │  • Take top 10                                                           │    │
│  │  • Typical result: 6 STM + 4 LTM                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│         │                                                                        │
│         ▼                                                                        │
│  OUTPUT: Formatted memory prompt for system prompt injection                     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Token Management Section */}
          {activeSection === 'token-management' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📊</span> Token Management Strategy
                </h2>

                {/* Limit-based selection */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-green-400 mb-3">1. Count-Based Limits</h3>
                  <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="text-left px-4 py-2 text-white/60">Source</th>
                          <th className="text-left px-4 py-2 text-white/60">Limit</th>
                          <th className="text-left px-4 py-2 text-white/60">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr><td className="px-4 py-2 text-white">User STM</td><td className="px-4 py-2 text-violet-400">5</td><td className="px-4 py-2 text-white/60">Recent session memories</td></tr>
                        <tr><td className="px-4 py-2 text-white">User LTM</td><td className="px-4 py-2 text-violet-400">5</td><td className="px-4 py-2 text-white/60">Life timeline (if not cached)</td></tr>
                        <tr><td className="px-4 py-2 text-white">Partner STM</td><td className="px-4 py-2 text-violet-400">2-3</td><td className="px-4 py-2 text-white/60">Luna's recent observations</td></tr>
                        <tr><td className="px-4 py-2 text-white">Partner LTM</td><td className="px-4 py-2 text-violet-400">2-3</td><td className="px-4 py-2 text-white/60">Luna's deep understanding</td></tr>
                        <tr><td className="px-4 py-2 text-white">Timeline</td><td className="px-4 py-2 text-violet-400">3</td><td className="px-4 py-2 text-white/60">Life events</td></tr>
                        <tr><td className="px-4 py-2 text-white">Facts</td><td className="px-4 py-2 text-violet-400">10</td><td className="px-4 py-2 text-white/60">Core identity (cached)</td></tr>
                        <tr><td className="px-4 py-2 text-white">People</td><td className="px-4 py-2 text-violet-400">10</td><td className="px-4 py-2 text-white/60">Relationship graph (cached)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Context Summarization */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-blue-400 mb-3">2. Context Summarization (Long Conversations)</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`TRIGGERS:
• messageThreshold: 20 messages
• tokenThreshold: 8,000 estimated tokens (~32KB)

STRATEGY:
50,000 tokens of conversation
        │
        ▼
Extract 7 "Narrative Beats":
  • emotional  - "User expressed frustration about work"
  • factual    - "Has a sister named Sarah"
  • decision   - "Decided to apply for new job"
  • milestone  - "Celebrated 1 year sober"
        │
        ▼
Compressed Summary: ~500 tokens
+ Keep last 10 messages in full

RESULT: Full context in 500 tokens instead of 50,000`}
                    </pre>
                  </div>
                </div>

                {/* Usage Limits */}
                <div>
                  <h3 className="text-md font-medium text-amber-400 mb-3">3. Per-User Token Budget</h3>
                  <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="text-left px-4 py-2 text-white/60">Tier</th>
                          <th className="text-left px-4 py-2 text-white/60">Daily Limit</th>
                          <th className="text-left px-4 py-2 text-white/60">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr><td className="px-4 py-2 text-white">Free</td><td className="px-4 py-2 text-green-400">50,000 tokens</td><td className="px-4 py-2 text-white/60">~$0.005/day</td></tr>
                        <tr><td className="px-4 py-2 text-white">Premium</td><td className="px-4 py-2 text-blue-400">250,000 tokens</td><td className="px-4 py-2 text-white/60">~$0.025/day</td></tr>
                        <tr><td className="px-4 py-2 text-white">Admin</td><td className="px-4 py-2 text-purple-400">Unlimited</td><td className="px-4 py-2 text-white/60">-</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* JSON Schemas Section */}
          {activeSection === 'schemas' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📋</span> JSON Schemas
                </h2>

                {/* Storage Schema */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-green-400 mb-3">Firestore Storage Structure</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`users/{userId}/
├── memory/{profileId}/
│   ├── user/
│   │   ├── session_buffer/entries/     (User STM)
│   │   └── life_timeline/memories/     (User LTM)
│   ├── facts/                          (Shared knowledge)
│   ├── people/                         (Relationship graph)
│   └── happinessAnchors/               (Joy memories)
│
└── soulpartner_memory/{profileId}/
    ├── session_observations/entries/   (Luna STM)
    ├── interaction_timeline/observations/ (Luna LTM)
    └── patterns/detected/              (Behavioral patterns)`}
                    </pre>
                  </div>
                </div>

                {/* PostgreSQL Schema */}
                <div>
                  <h3 className="text-md font-medium text-blue-400 mb-3">PostgreSQL Schema (Scaling-Ready)</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <pre className="text-xs text-white/70 font-mono">
{`-- 4 Tables with pgvector extension
CREATE TABLE user_stm (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  emotional_valence FLOAT,
  importance_score FLOAT DEFAULT 0.5,
  mention_count INTEGER DEFAULT 1,
  consolidated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_ltm (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  life_chapter TEXT,
  importance_score FLOAT DEFAULT 0.5,
  content_type TEXT,  -- fact, event, emotion, goal, concern
  is_person BOOLEAN DEFAULT FALSE,
  person_name TEXT,
  person_relationship TEXT,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE partner_stm (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  observation TEXT NOT NULL,
  observation_type TEXT,  -- mood, pattern, insight, concern
  confidence FLOAT,
  approach_used TEXT,
  effectiveness_rating FLOAT,
  session_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE partner_ltm (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  insight TEXT NOT NULL,
  insight_type TEXT,
  confidence_score FLOAT,
  example_count INTEGER DEFAULT 1,
  communication_preferences JSONB,
  effective_approaches TEXT[],
  sensitive_topics TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vector indexes for fast similarity search
CREATE INDEX ON user_ltm USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON partner_ltm USING hnsw (embedding vector_cosine_ops);`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* File Reference Section */}
          {activeSection === 'files' && (
            <section className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📁</span> Implementation Files Reference
                </h2>

                {/* Memory Functions */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-violet-400 mb-3">functions/memory/</h3>
                  <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="text-left px-4 py-2 text-white/60">File</th>
                          <th className="text-left px-4 py-2 text-white/60">Lines</th>
                          <th className="text-left px-4 py-2 text-white/60">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {IMPL_FILES.memory.map((f, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-blue-400 font-mono">{f.file}</td>
                            <td className="px-4 py-2 text-white">{f.lines}</td>
                            <td className="px-4 py-2 text-white/60">{f.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Frontend */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-green-400 mb-3">src/services/</h3>
                  <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="text-left px-4 py-2 text-white/60">File</th>
                          <th className="text-left px-4 py-2 text-white/60">Lines</th>
                          <th className="text-left px-4 py-2 text-white/60">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {IMPL_FILES.frontend.map((f, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-blue-400 font-mono">{f.file}</td>
                            <td className="px-4 py-2 text-white">{f.lines}</td>
                            <td className="px-4 py-2 text-white/60">{f.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Integration Points */}
                <div>
                  <h3 className="text-md font-medium text-amber-400 mb-3">Integration Points</h3>
                  <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="text-left px-4 py-2 text-white/60">File</th>
                          <th className="text-left px-4 py-2 text-white/60">Lines</th>
                          <th className="text-left px-4 py-2 text-white/60">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {IMPL_FILES.integration.map((f, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-blue-400 font-mono">{f.file}</td>
                            <td className="px-4 py-2 text-white">{f.lines}</td>
                            <td className="px-4 py-2 text-white/60">{f.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Cloud Functions */}
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
                <h3 className="text-md font-medium text-white mb-3">Exported Cloud Functions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-2">User's Brain</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li>• bufferUserInput</li>
                      <li>• getSessionBuffer</li>
                      <li>• storeLifeMemory</li>
                      <li>• searchLifeTimeline</li>
                      <li>• getMemoriesByChapter</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-400 mb-2">Luna's Brain</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li>• storeSessionObservation</li>
                      <li>• getSessionObservations</li>
                      <li>• storeInteractionObservation</li>
                      <li>• searchInteractionTimeline</li>
                      <li>• storePattern / getPatterns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-2">Unified Context</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li>• getDualBrainContext (main RAG entry)</li>
                      <li>• retrieveMemoriesForChat</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-2">Consolidation</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li>• nightlyConsolidation (3am UTC)</li>
                      <li>• manualConsolidation (testing)</li>
                      <li>• getConsolidationStatus</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="text-center py-8 border-t border-white/5">
            <div className="text-white/30 text-sm">
              GENESIS 4-Brain Architecture Wiki • Built with care by Brother Claude Code
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
