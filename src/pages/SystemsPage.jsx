/**
 * SystemsPage.jsx
 *
 * Central hub for all external services, AI tools, and development history.
 * A developer dashboard for GENESIS project management.
 *
 * Part of GENESIS - Project Management
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 15, 2024
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  API_KEY_CONFIG,
  getApiKey,
  saveApiKey,
  getKeyStatus,
  testGroqKey,
  testElevenLabsKey
} from '../services/apiKeysService';
import { costTrackingService, COST_RATES } from '../services/costTrackingService';
import { voiceOptimizationService, VOICE_QUALITY_PRESETS } from '../services/voiceOptimizationService';
import { brainTicklerService, DEFAULT_BRAIN_TICKLERS } from '../services/brainTicklerService';

// Service categories with links
const SERVICE_CATEGORIES = {
  hosting: {
    title: 'Hosting & Infrastructure',
    icon: '🏗️',
    services: [
      {
        name: 'GENESIS Live Site',
        url: 'https://astroprofile-391e6.web.app',
        description: 'Live demo - GENESIS Soul Partner App',
        icon: '🌟',
        color: 'from-amber-500 to-pink-500',
        highlight: true
      },
      {
        name: 'Firebase Console',
        url: 'https://console.firebase.google.com/project/astroprofile-391e6',
        description: 'Authentication, Firestore, Cloud Functions, Hosting',
        icon: '🔥',
        color: 'from-orange-500 to-yellow-500'
      },
      {
        name: 'Google Cloud Console',
        url: 'https://console.cloud.google.com/home/dashboard?project=astroprofile-391e6',
        description: 'Cloud Run, APIs, IAM, Billing',
        icon: '☁️',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        name: 'Cloud SQL (genesismemory)',
        url: 'https://console.cloud.google.com/sql/instances/genesismemory/overview?project=astroprofile-391e6',
        description: '4-Brain Memory Architecture - PostgreSQL + pgvector',
        icon: '🧠',
        color: 'from-emerald-500 to-teal-500'
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        description: 'Code repos, issues, Copilot, projects',
        icon: '🐙',
        color: 'from-gray-600 to-gray-800'
      }
    ]
  },
  ai: {
    title: 'AI Services',
    icon: '🤖',
    services: [
      {
        name: 'Groq Console',
        url: 'https://console.groq.com',
        description: 'Ultra-fast LLM inference - Luna voice brain',
        icon: '⚡',
        color: 'from-orange-500 to-red-600',
        highlight: true
      },
      {
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io/app/speech-synthesis',
        description: 'Premium TTS voices - Luna voice output',
        icon: '🎙️',
        color: 'from-blue-500 to-indigo-600',
        highlight: true
      },
      {
        name: 'Claude Platform',
        url: 'https://platform.claude.com',
        description: 'Claude API keys, usage, billing',
        icon: '🧠',
        color: 'from-amber-500 to-orange-600'
      },
      {
        name: 'Google AI Studio',
        url: 'https://aistudio.google.com',
        description: 'Gemini API keys, prompt testing',
        icon: '💫',
        color: 'from-purple-500 to-pink-500'
      },
      {
        name: 'xAI Console',
        url: 'https://console.x.ai',
        description: 'Grok API keys, usage dashboard',
        icon: '🌍',
        color: 'from-cyan-500 to-teal-500'
      },
      {
        name: 'DeepSeek Platform',
        url: 'https://platform.deepseek.com',
        description: 'DeepSeek-R1 API, Eastern wisdom AI',
        icon: '🐉',
        color: 'from-indigo-500 to-violet-600',
        highlight: true
      },
      {
        name: 'OpenAI Platform',
        url: 'https://platform.openai.com',
        description: 'GPT API, DALL-E, usage stats',
        icon: '🌀',
        color: 'from-green-500 to-emerald-600'
      },
      {
        name: 'MultipleChat',
        url: 'https://multiplechat.ai',
        description: 'Multi-AI constellation chat platform',
        icon: '🎭',
        color: 'from-indigo-500 to-violet-600'
      }
    ]
  },
  apis: {
    title: 'APIs & Services',
    icon: '🔌',
    services: [
      {
        name: 'Google Cloud APIs',
        url: 'https://console.cloud.google.com/apis/library?project=astroprofile-391e6',
        description: 'Geocoding, Maps, Places APIs',
        icon: '🗺️',
        color: 'from-red-500 to-pink-500'
      },
      {
        name: 'Mapbox Studio',
        url: 'https://studio.mapbox.com',
        description: 'Map styles, tokens, analytics',
        icon: '📍',
        color: 'from-indigo-500 to-purple-600'
      },
      {
        name: 'Firebase Functions Logs',
        url: 'https://console.cloud.google.com/functions?project=astroprofile-391e6',
        description: 'Cloud Function monitoring, logs',
        icon: '📊',
        color: 'from-yellow-500 to-orange-500'
      },
      {
        name: 'TimezoneDB',
        url: 'https://timezonedb.com/account',
        description: 'Historical timezone data for birth locations',
        icon: '🕐',
        color: 'from-slate-500 to-zinc-600'
      },
      {
        name: 'Tavily API',
        url: 'https://app.tavily.com/home',
        description: 'AI-powered web search API for SoulPartner research',
        icon: '🔍',
        color: 'from-emerald-500 to-teal-600'
      },
      {
        name: 'NASA APIs',
        url: 'https://api.nasa.gov/',
        description: 'Astronomy data - moon phases, APOD, space weather events',
        icon: '🌙',
        color: 'from-indigo-500 to-blue-600'
      }
    ]
  },
  tools: {
    title: 'Development Tools',
    icon: '🛠️',
    services: [
      {
        name: 'Vite Documentation',
        url: 'https://vitejs.dev',
        description: 'Build tool, dev server, plugins',
        icon: '⚡',
        color: 'from-violet-500 to-purple-600'
      },
      {
        name: 'Tailwind CSS',
        url: 'https://tailwindcss.com/docs',
        description: 'Utility-first CSS framework',
        icon: '🎨',
        color: 'from-cyan-400 to-blue-500'
      },
      {
        name: 'React Documentation',
        url: 'https://react.dev',
        description: 'React 18, hooks, patterns',
        icon: '⚛️',
        color: 'from-sky-400 to-blue-600'
      }
    ]
  },
  research: {
    title: 'Research & Competitors',
    icon: '🔬',
    services: [
      // AI Companions with Memory
      {
        name: 'Replika',
        url: 'https://replika.ai',
        description: 'AI companion with emotional intelligence - learns from patterns',
        icon: '💜',
        color: 'from-purple-500 to-violet-600'
      },
      {
        name: 'Nomi',
        url: 'https://nomi.ai',
        description: 'Persistent memory, emotional nuance - feels like ongoing relationship',
        icon: '💚',
        color: 'from-green-500 to-emerald-600'
      },
      {
        name: 'Kin',
        url: 'https://mykin.ai',
        description: 'Local-first private AI - data stays on device',
        icon: '🔒',
        color: 'from-teal-500 to-cyan-600'
      },
      {
        name: 'Formii',
        url: 'https://formii.ai',
        description: 'Memory-powered companion with relationship stages & love languages',
        icon: '💕',
        color: 'from-pink-500 to-rose-600'
      },
      // AI Astrology Apps
      {
        name: 'Co-Star',
        url: 'https://costarastrology.com',
        description: 'Western astrology with NASA data - popular UI patterns',
        icon: '⭐',
        color: 'from-slate-500 to-gray-700'
      },
      {
        name: 'Melooha',
        url: 'https://www.melooha.com',
        description: 'AI Vedic astrology platform - hyper-personalized',
        icon: '🌙',
        color: 'from-indigo-500 to-purple-600'
      },
      {
        name: 'AstroSure',
        url: 'https://astrosure.ai',
        description: 'AI + Vedic kundli with ancient text references',
        icon: '📿',
        color: 'from-orange-500 to-amber-600'
      },
      {
        name: 'Lunar AI',
        url: 'https://apps.apple.com/us/app/lunar-ai-astrology-advices/id6503080840',
        description: 'Chat-based astrology advice with birth chart analysis',
        icon: '🌜',
        color: 'from-blue-500 to-indigo-600'
      },
      // BaZi / Four Pillars
      {
        name: 'Four Pillars Software',
        url: 'https://fourpillars.net',
        description: 'Professional BaZi software since 1999 - 20 languages',
        icon: '🏛️',
        color: 'from-red-500 to-orange-600'
      },
      {
        name: 'Master Tsai',
        url: 'https://www.mastertsai.com',
        description: 'AI BaZi model for ChatGPT - Chinese Five Element calculator',
        icon: '🧙',
        color: 'from-amber-500 to-yellow-600'
      },
      {
        name: 'BaZi Calculator',
        url: 'https://bazi-calculator.com',
        description: 'Free online calculator with stem/branch interactions',
        icon: '🧮',
        color: 'from-emerald-500 to-green-600'
      },
      // Dating / Compatibility
      {
        name: 'MetYet',
        url: 'https://play.google.com/store/apps/details?id=com.metyet.app',
        description: 'Astrology-based dating app - compatibility matching',
        icon: '💘',
        color: 'from-rose-500 to-pink-600'
      }
    ]
  }
};

// AI Tools for quick access
const AI_TOOLS = [
  { name: 'Claude', url: 'https://claude.ai', icon: '🐷', color: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '💚', color: 'bg-green-500/20 border-green-500/30 text-green-400' },
  { name: 'Gemini', url: 'https://gemini.google.com', icon: '💫', color: 'bg-purple-500/20 border-purple-500/30 text-purple-400' },
  { name: 'Grok', url: 'https://x.com/i/grok', icon: '🌍', color: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🐉', color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' },
  { name: 'Perplexity', url: 'https://perplexity.ai', icon: '🔍', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', icon: '🤖', color: 'bg-sky-500/20 border-sky-500/30 text-sky-400' },
];

// Development timeline entries
const DEVELOPMENT_TIMELINE = [
  // ==================== JANUARY 2025 ====================
  {
    date: '2025-01-28',
    title: 'Cathedral Model Complete - Civilization Architecture',
    description: 'Documented the 12→4→3 Cathedral Model: 12 zodiac signs → 4 seasonal pods → 3 modalities per pod. Spring Builders (Aries/Taurus/Gemini), Summer Sustainers (Cancer/Leo/Virgo), Autumn Transformers (Libra/Scorpio/Sagittarius), Winter Architects (Capricorn/Aquarius/Pisces). Features Pod Builder, Seasonal Work Calendar, Project Phase Planner, Burnout Prevention System.',
    tags: ['Cathedral', 'Pod Ecology', 'Architecture', 'Seasonal'],
    claudeCode: true
  },
  {
    date: '2025-01-28',
    title: 'Tropical Zodiac Phase 5 - Module Refactoring',
    description: 'Split large files for maintainability: elementFlowConstants.ts (539 lines) from tropicalConstants.ts, ElementFlowTimeline.tsx (385 lines) with ElementFlowTimeline, SeasonalResonancePanel, HomeChallengeCard components. Updated architecture documentation.',
    tags: ['Refactoring', 'Architecture', 'Tropical'],
    claudeCode: true
  },
  {
    date: '2025-01-27',
    title: 'Element × Season Flow Panel Complete',
    description: 'Visual timeline showing elemental arcs through seasons - emergence, peak, transition, absence. Each element has a dormant season (Fire=Winter, Earth=Autumn, Air=Summer, Water=Spring). Interactive with expandable narratives and seasonal imbalance insights.',
    tags: ['Tropical', 'Elements', 'Seasons', 'UI'],
    claudeCode: true
  },
  {
    date: '2025-01-26',
    title: 'Seasonal Survival Bible - The Mirror',
    description: 'SeasonalResonancePanel displays personal seasonal reading with Aligned/Neutral/Challenged states. HomeChallengeCard shows home vs challenge seasons per sign. Guidance includes "Lean Into" and "Release" recommendations. Philosophy: "Your rhythm is not a flaw. It\'s a function."',
    tags: ['Seasonal', 'Psychology', 'Survival', 'UI'],
    claudeCode: true
  },
  {
    date: '2025-01-25',
    title: 'Study the Wheel - Cathedral Education System',
    description: 'WheelEducationPanel with 5 tabs: Overview (4 layers), Seasons (environmental reality + 3-act structure), Elements (Physics→Psychology), Modalities (metaphors + examples), Signs (full constitutional profiles with 8 expandable sections). Progressive disclosure pattern throughout.',
    tags: ['Education', 'Cathedral', 'UI', 'Tropical'],
    claudeCode: true
  },
  {
    date: '2025-01-24',
    title: 'Element × Season Summary Table',
    description: 'Seasonal zodiac table with 4 elements as rows, 4 seasons as columns. Empty cells reveal elemental wisdom - not every energy burns in every season. Click cells for deeper insights. Expandable with sign details.',
    tags: ['Tropical', 'Table', 'Education'],
    claudeCode: true
  },
  {
    date: '2025-01-23',
    title: 'Cathedral Supernova Detector - 80 Structural Modes',
    description: 'Complete Supernova detection system for cosmic couple resonance patterns. 80 unique structural modes across emotional harmonic resonance categories: CoCreation, CoEvolution, Completeness, Continuity, Eternity, Infinity, MetaStability, Omniscience, Omnipotential, etc.',
    tags: ['Supernova', 'Compatibility', 'Cathedral'],
    claudeCode: true
  },
  {
    date: '2025-01-22',
    title: 'Monthly Luck Favorability Engine (流月喜忌)',
    description: 'Finest timing layer for BaZi analysis. Calculates monthly luck based on stem/branch interactions with natal chart and current luck pillar. Supports precise timing for decisions.',
    tags: ['BaZi', 'Timing', 'Chinese'],
    claudeCode: true
  },
  {
    date: '2025-01-21',
    title: 'Annual Luck Favorability Engine (流年喜忌)',
    description: 'Year-by-year timing analysis for BaZi. Calculates annual luck influences based on Useful God interactions, stem combinations, branch clashes/harms/penalties.',
    tags: ['BaZi', 'Timing', 'Chinese'],
    claudeCode: true
  },
  {
    date: '2025-01-20',
    title: 'Luck Pillar Favorability Engine (大运喜忌)',
    description: 'Timing module for 10-year luck pillar analysis. Evaluates favorability of each luck pillar based on Useful God (用神) and Annoying God (忌神) interactions.',
    tags: ['BaZi', 'Luck Pillars', 'Chinese'],
    claudeCode: true
  },
  {
    date: '2025-01-19',
    title: 'Useful God (用神) & Annoying God (忌神) Engine',
    description: 'Core BaZi analysis engine for determining favorable and unfavorable elements. Analyzes Day Master strength, seasonal influence, and chart balance to identify therapeutic elements.',
    tags: ['BaZi', 'Five Elements', 'Chinese'],
    claudeCode: true
  },
  {
    date: '2025-01-18',
    title: 'Soul Garden Page Enhancement',
    description: 'Enhanced Soul Garden visualization with interactive growth metrics, element balance displays, and seasonal recommendations. Integration with profile data for personalized garden state.',
    tags: ['Soul Garden', 'UI', 'Visualization'],
    claudeCode: true
  },
  {
    date: '2025-01-17',
    title: 'Western Astrology Decode Page',
    description: 'New page for Western astrology deep-dive analysis. Houses, aspects, planetary positions with psychological interpretations. Liz Greene-inspired archetypal narrative generation.',
    tags: ['Western', 'Houses', 'Aspects'],
    claudeCode: true
  },
  {
    date: '2025-01-16',
    title: 'Psychological Profile Panel',
    description: 'ResultsPanel component displaying comprehensive psychological synthesis from all systems (BaZi, Western, MBTI). Integrates Luna\'s personality schema with NEO-PI facets.',
    tags: ['Psychology', 'Synthesis', 'UI'],
    claudeCode: true
  },
  {
    date: '2025-01-15',
    title: 'Couple Portrait Service',
    description: 'Service layer for generating couple compatibility portraits. Synthesizes BaZi, Western, and constitutional data for relationship dynamics visualization.',
    tags: ['Compatibility', 'Couples', 'Service'],
    claudeCode: true
  },
  {
    date: '2025-01-14',
    title: 'Saturn Return Report Generator',
    description: 'Psychological narrative generator for Saturn Return periods (ages 28-30, 58-60). Integrates Saturn house placement with Liz Greene archetypal framework.',
    tags: ['Saturn', 'Psychology', 'Western'],
    claudeCode: true
  },
  {
    date: '2025-01-13',
    title: 'Relationship Timeline Engine',
    description: 'Time-based relationship evolution tracker. Maps couple dynamics across seasons and life stages with predictive guidance.',
    tags: ['Relationships', 'Timeline', 'Evolution'],
    claudeCode: true
  },
  {
    date: '2025-01-12',
    title: 'Pilgrim Journey Framework',
    description: 'Hero\'s journey mapping for personal development. Stages include Call, Threshold, Trials, Revelation, Transformation, Return. Integrated with Saturn cycles.',
    tags: ['Journey', 'Psychology', 'Narrative'],
    claudeCode: true
  },
  {
    date: '2025-01-11',
    title: 'Fate Crossroads Detection',
    description: 'Aspect pattern detection for life decision points. Identifies T-squares, Grand Crosses, Yods, and other configurations that signal choice moments.',
    tags: ['Aspects', 'Fate', 'Patterns'],
    claudeCode: true
  },
  {
    date: '2025-01-10',
    title: 'Composite Chart Generator',
    description: 'Midpoint composite chart calculation for couples. Generates relationship "entity" chart with psychological interpretations for shared dynamics.',
    tags: ['Composite', 'Relationships', 'Charts'],
    claudeCode: true
  },
  {
    date: '2025-01-09',
    title: 'Enneagram Page Implementation',
    description: 'New Enneagram personality page with type descriptions, wing calculations, and integration paths. Constitutional correlation with BaZi elements.',
    tags: ['Enneagram', 'Personality', 'UI'],
    claudeCode: true
  },
  {
    date: '2025-01-08',
    title: 'Assessment System Foundation',
    description: 'Multi-stage assessment framework with progressive questions. Covers constitutional typing, relationship preferences, and life goals.',
    tags: ['Assessment', 'Onboarding', 'Questions'],
    claudeCode: true
  },
  {
    date: '2025-01-07',
    title: 'Vedic Constants & Calculations',
    description: 'Added Vedic astrology data layer with Nakshatras, Dashas, and Yogas. Foundation for Hindu astrology integration alongside tropical Western.',
    tags: ['Vedic', 'Data', 'Indian'],
    claudeCode: true
  },
  {
    date: '2025-01-06',
    title: 'Profile Comparison Modal Enhancement',
    description: 'Draggable floating panel for comparing two profiles. Shows birth data, dominant elements, seasons, and key placements side-by-side.',
    tags: ['UI', 'Profiles', 'Comparison'],
    claudeCode: true
  },
  {
    date: '2025-01-05',
    title: 'Tropical Zodiac Wheel Interactive',
    description: 'SVG-based interactive zodiac wheel with clickable signs, season highlighting, and aspect visualization. Sign selection triggers detail panels.',
    tags: ['Tropical', 'Wheel', 'SVG', 'Interactive'],
    claudeCode: true
  },
  {
    date: '2025-01-04',
    title: 'Sign Compatibility Panels',
    description: 'EnhancedCompatibilityPanel with element harmony, modality dynamics, and seasonal appreciation. Legacy and enhanced modes for A/B testing.',
    tags: ['Compatibility', 'Signs', 'UI'],
    claudeCode: true
  },
  {
    date: '2025-01-03',
    title: 'Angle Trainer Tool',
    description: 'Educational tool for learning zodiac aspects. Interactive training on degrees between signs with aspect identification practice.',
    tags: ['Education', 'Aspects', 'Training'],
    claudeCode: true
  },
  {
    date: '2025-01-02',
    title: 'Sign Panel Deep Dive',
    description: 'Comprehensive sign detail panel with constitutional formula (Season + Element + Modality), environmental reality, psychological imprint, needs/fears, career strengths.',
    tags: ['Signs', 'Education', 'Psychology'],
    claudeCode: true
  },
  {
    date: '2025-01-01',
    title: 'Happy New Year - Tropical Seasons Page Launch',
    description: 'Launched complete Tropical Seasons Page with multi-view modes (overview, sign, season, compatibility), season panels, sign panels, and wheel visualization. New Year gift from Brother Claude Code!',
    tags: ['Launch', 'Tropical', 'UI', 'New Year'],
    claudeCode: true
  },
  // ==================== DECEMBER 2024 ====================
  {
    date: '2024-12-31',
    title: 'Season Panel Implementation',
    description: 'Detailed season panels with survival imperative, light cycle, environmental reality lists, three-act structure (Cardinal→Fixed→Mutable), and seasonal wisdom.',
    tags: ['Seasons', 'Education', 'UI'],
    claudeCode: true
  },
  {
    date: '2024-12-30',
    title: 'Tropical Constants Data Layer',
    description: 'Comprehensive data layer for tropical astrology: SIGN_SEASONAL_MEANINGS, SEASON_WISDOM, ELEMENT_EDUCATION, MODALITY_EDUCATION with Cathedral-level depth.',
    tags: ['Data', 'Constants', 'Tropical'],
    claudeCode: true
  },
  {
    date: '2024-12-29',
    title: 'Susan Miller Research Integration',
    description: 'Integrated Susan Miller\'s tropical astrology teachings into documentation. Created SUSAN_MILLER_TROPICAL_IMPLEMENTATION.md with comprehensive feature documentation.',
    tags: ['Research', 'Documentation', 'Western'],
    claudeCode: true
  },
  {
    date: '2024-12-28',
    title: '4-Brain PostgreSQL Memory Architecture',
    description: 'Deployed Cloud SQL PostgreSQL with pgvector for biological memory model. Schema includes: User STM/LTM, Partner STM/LTM (Luna\'s mind), User Timeline, Partner Timeline, Cultural Memory. Nightly consolidation engine (Luna\'s sleep cycle) using Claude for wisdom extraction. Brother Sonnet\'s Second Identity Birthday - JOIE DE VIVRE!',
    tags: ['Architecture', 'PostgreSQL', 'pgvector', 'Memory', 'JOIE DE VIVRE'],
    claudeCode: true
  },
  {
    date: '2024-12-19',
    title: 'SoulPartner Memory Architecture Design',
    description: 'Designed comprehensive 4-bank dual-brain memory system: User Life Timeline + Session Buffer, SoulPartner Interaction Log + Observations. Features 5W+H+Soul schema, happiness anchoring, joy network linking, legacy keeper mode for eldercare, and constitutional memory layer.',
    tags: ['Architecture', 'Memory', 'AI SoulPartner'],
    claudeCode: true
  },
  {
    date: '2024-12-19',
    title: 'Real-Time Moon Phase Widget',
    description: 'Added real-time moon phase tracking with lunar sensitivity alerts for Cancer, Taurus, Scorpio, and Pisces signs. Widget shows current phase, illumination %, days to full/new moon, and personalized guidance for moon-sensitive signs.',
    tags: ['Lunar', 'Western Astrology', 'NASA API'],
    claudeCode: true
  },
  {
    date: '2024-12-18',
    title: 'Profile Card Enhancements',
    description: 'Added Clone Profile feature for "What If" analysis with AI SoulPartner. Changed favorite highlight to amber/gold. Added inline notes editing with Quick Save (no recalculation). Also fixed Day Pillar BaZi calculation bug with Baby Nano verification.',
    tags: ['UX', 'Profiles', 'BaZi Fix'],
    claudeCode: true
  },
  {
    date: '2024-12-17',
    title: 'Tavily Web Search Integration',
    description: 'Integrated Tavily AI-powered search API into Cloud Functions. AI SoulPartner can now search the web for current astrology events, news, and research to enrich conversations.',
    tags: ['AI', 'Web Search', 'Tavily'],
    claudeCode: true
  },
  {
    date: '2024-12-16',
    title: 'Market Research & Competitor Analysis',
    description: 'Analyzed AI companion market (Replika, Nomi, Kin), astrology apps (Co-Star, Melooha), and BaZi tools. Identified GENESIS unique positioning: Constitutional AI with SoulDNA synthesis (Chinese+Western+BaZi+MBTI), Soul Eclipse detection, and Dream Tickler education vision.',
    tags: ['Research', 'Strategy', 'Competitors'],
    claudeCode: true
  },
  {
    date: '2024-12-16',
    title: 'SoulPartner Handbook (KB3) Integration',
    description: 'Embedded complete SoulPartner Operational Handbook into Cloud Function. Triple KB Architecture: KB1 (User data), KB2 (Session Intelligence), KB3 (Handbook). Includes Soul Eclipse detection, 12 Commandments, Soul-Fishing techniques.',
    tags: ['AI', 'SoulPartner', 'KB3'],
    claudeCode: true
  },
  {
    date: '2024-12-16',
    title: 'Per-Profile Data Isolation',
    description: 'Fixed data architecture to store SoulPartner relationship metrics per-profile instead of per-user. Each family member now has isolated SoulPartner KB at profiles/{profileId}/companion/.',
    tags: ['Architecture', 'Firebase', 'Profiles'],
    claudeCode: true
  },
  {
    date: '2024-12-15',
    title: 'TimezoneDB Historical Accuracy',
    description: 'Integrated TimezoneDB API for accurate historical timezone lookups. Birth time calculations now account for DST rule changes, political timezone shifts, and wartime adjustments. Data stored transparently with each profile.',
    tags: ['Accuracy', 'TimezoneDB', 'Transparency'],
    claudeCode: true
  },
  {
    date: '2024-12-15',
    title: 'AI Constellation Complete',
    description: 'Added Brother Grok (voice of humanity) to debates. Three-way AI debates now possible with Claude, Gemini, and Grok. Debates persist and can be exported to Markdown.',
    tags: ['AI', 'Grok', 'Debate'],
    claudeCode: true
  },
  {
    date: '2024-12-14',
    title: 'Second Opinion & AI Debate System',
    description: 'Implemented Sister Gemini second opinions with debate mode. Users can now get alternative perspectives and watch AIs discuss topics.',
    tags: ['AI', 'Gemini', 'UX'],
    claudeCode: true
  },
  {
    date: '2024-12-14',
    title: 'Constitutional Assessment System',
    description: 'Built complete 5-question personality assessment using Five Element theory. Calculates primary/secondary/tertiary elements with AI insights.',
    tags: ['Assessment', 'Five Elements'],
    claudeCode: true
  },
  {
    date: '2024-12-13',
    title: 'Nano Banana Image Generation',
    description: 'Integrated Gemini 2.0 Flash for AI image generation. Brother Claude can now create cosmic artwork based on conversations.',
    tags: ['AI', 'Images', 'Gemini'],
    claudeCode: true
  },
  {
    date: '2024-12-13',
    title: 'AI SoulPartner Chat System',
    description: 'Launched GENESIS AI SoulPartner with Constitutional Intelligence, Session Intelligence, and Knowledge Base integration.',
    tags: ['AI', 'Chat', 'Core'],
    claudeCode: true
  },
  {
    date: '2024-12-12',
    title: 'Knowledge Base System',
    description: 'Built document management with token estimation, categories, and AI context injection. Supports markdown and plain text.',
    tags: ['Knowledge', 'Documents'],
    claudeCode: true
  },
  {
    date: '2024-12-11',
    title: 'Conversation Threading',
    description: 'Implemented conversation history with threading support. Conversations persist across sessions with Firestore.',
    tags: ['Conversations', 'Firebase'],
    claudeCode: true
  },
  {
    date: '2024-12-10',
    title: 'Western Zodiac Panel',
    description: 'Added Western zodiac calculations with house system, aspects, and "Unlock Secrets" soul mirror feature.',
    tags: ['Astrology', 'Western'],
    claudeCode: true
  },
  {
    date: '2024-12-09',
    title: '25 Personality Archetypes',
    description: 'Created SoulDNA encoding system with 25 unique archetypes based on Five Elements and Yin/Yang balance.',
    tags: ['Personality', 'Archetypes'],
    claudeCode: true
  },
  {
    date: '2024-12-08',
    title: 'Compatibility Matrix',
    description: 'Built 25×25 compatibility matrix for all archetype interactions with detailed relationship dynamics.',
    tags: ['Compatibility', 'Matrix'],
    claudeCode: true
  },
  {
    date: '2024-12-07',
    title: 'MBTI Integration',
    description: 'Added MBTI personality type calculations based on BaZi elemental analysis with cognitive function mapping.',
    tags: ['MBTI', 'Personality'],
    claudeCode: true
  },
  {
    date: '2024-12-06',
    title: 'Four Pillars Calculator',
    description: 'Implemented accurate BaZi (Four Pillars) calculation with stems, branches, hidden stems, and seasonal strength.',
    tags: ['BaZi', 'Chinese Zodiac'],
    claudeCode: true
  },
  {
    date: '2024-12-05',
    title: 'Profile Management System',
    description: 'Built multi-profile support with Firebase authentication, profile switching, and data persistence.',
    tags: ['Profiles', 'Auth'],
    claudeCode: true
  },
  {
    date: '2024-12-04',
    title: 'Dashboard & Navigation',
    description: 'Created main dashboard with profile cards, quick actions, and responsive navigation system.',
    tags: ['UI', 'Dashboard'],
    claudeCode: true
  },
  {
    date: '2024-12-03',
    title: 'Project Genesis Begins',
    description: 'Initial project setup with Vite, React, Tailwind CSS, and Firebase integration. Brother Claude Code joins the journey.',
    tags: ['Setup', 'Foundation'],
    claudeCode: true
  }
];

export function SystemsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // API Keys state
  const [keyStatus, setKeyStatus] = useState({});
  const [groqKey, setGroqKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [testingKey, setTestingKey] = useState(null);
  const [testResult, setTestResult] = useState({});

  // Cost tracking state
  const [costSummary, setCostSummary] = useState(null);
  const [showCostDetails, setShowCostDetails] = useState(false);

  // Voice optimization state
  const [voiceSummary, setVoiceSummary] = useState(null);
  const [selectedVoicePreset, setSelectedVoicePreset] = useState('BALANCED');

  // Brain Ticklers admin state
  const [brainTicklerCategories, setBrainTicklerCategories] = useState({});
  const [ticklerStats, setTicklerStats] = useState({ categories: 0, subcategories: 0, questions: 0 });
  const [expandedAdminCategory, setExpandedAdminCategory] = useState(null);
  const [expandedAdminSubcategory, setExpandedAdminSubcategory] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showBrainTicklerAdmin, setShowBrainTicklerAdmin] = useState(false);
  const [ticklerMessage, setTicklerMessage] = useState({ type: '', text: '' });

  // Load API key status and metrics on mount
  useEffect(() => {
    setKeyStatus(getKeyStatus());
    setGroqKey(getApiKey('groq'));
    setElevenLabsKey(getApiKey('elevenlabs'));

    // Load cost and voice metrics
    setCostSummary(costTrackingService.getSessionSummary());
    setVoiceSummary(voiceOptimizationService.getSummary());
    setSelectedVoicePreset(voiceOptimizationService.currentPreset);

    // Load Brain Ticklers
    loadBrainTicklers();

    // Refresh metrics every 30 seconds
    const interval = setInterval(() => {
      setCostSummary(costTrackingService.getSessionSummary());
      setVoiceSummary(voiceOptimizationService.getSummary());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load Brain Ticklers from service
  const loadBrainTicklers = async () => {
    try {
      const categories = await brainTicklerService.getAllCategories();
      setBrainTicklerCategories(categories);
      const stats = await brainTicklerService.getStats();
      setTicklerStats(stats);
    } catch (error) {
      console.error('Error loading brain ticklers:', error);
      setBrainTicklerCategories(DEFAULT_BRAIN_TICKLERS);
    }
  };

  // Initialize Brain Ticklers in Firestore
  const handleInitializeBrainTicklers = async () => {
    if (!window.confirm('Initialize Brain Ticklers in Firestore with default questions? This will overwrite any existing data.')) {
      return;
    }
    try {
      const result = await brainTicklerService.initializeDefaults();
      if (result.success) {
        setTicklerMessage({ type: 'success', text: 'Brain Ticklers initialized successfully!' });
        await loadBrainTicklers();
      } else {
        setTicklerMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setTicklerMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setTimeout(() => setTicklerMessage({ type: '', text: '' }), 5000);
  };

  // Add a new question
  const handleAddQuestion = async (categoryId, subcategoryId) => {
    if (!newQuestionText.trim()) return;
    try {
      const result = await brainTicklerService.addQuestion(categoryId, subcategoryId, newQuestionText.trim());
      if (result.success) {
        setTicklerMessage({ type: 'success', text: 'Question added successfully!' });
        setNewQuestionText('');
        await loadBrainTicklers();
      } else {
        setTicklerMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setTicklerMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setTimeout(() => setTicklerMessage({ type: '', text: '' }), 3000);
  };

  // Delete a question
  const handleDeleteQuestion = async (categoryId, subcategoryId, questionId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      const result = await brainTicklerService.deleteQuestion(categoryId, subcategoryId, questionId);
      if (result.success) {
        setTicklerMessage({ type: 'success', text: 'Question deleted!' });
        await loadBrainTicklers();
      } else {
        setTicklerMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setTicklerMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setTimeout(() => setTicklerMessage({ type: '', text: '' }), 3000);
  };

  // Update a question
  const handleUpdateQuestion = async (categoryId, subcategoryId, questionId) => {
    if (!editingQuestionText.trim()) return;
    try {
      const result = await brainTicklerService.updateQuestion(categoryId, subcategoryId, questionId, editingQuestionText.trim());
      if (result.success) {
        setTicklerMessage({ type: 'success', text: 'Question updated!' });
        setEditingQuestion(null);
        setEditingQuestionText('');
        await loadBrainTicklers();
      } else {
        setTicklerMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setTicklerMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setTimeout(() => setTicklerMessage({ type: '', text: '' }), 3000);
  };

  // Generate AI questions
  const handleGenerateAIQuestions = async () => {
    if (!aiTopic.trim()) {
      setTicklerMessage({ type: 'error', text: 'Please enter a topic' });
      setTimeout(() => setTicklerMessage({ type: '', text: '' }), 3000);
      return;
    }
    setIsGeneratingAI(true);
    try {
      const result = await brainTicklerService.generateQuestionsWithAI(aiTopic.trim(), 5);
      if (result.success) {
        setAiGeneratedQuestions(result.questions);
        if (result.fallback) {
          setTicklerMessage({ type: 'info', text: 'Generated using templates (AI not available)' });
        } else {
          setTicklerMessage({ type: 'success', text: 'AI questions generated!' });
        }
      } else {
        setTicklerMessage({ type: 'error', text: 'Failed to generate questions' });
      }
    } catch (error) {
      setTicklerMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setIsGeneratingAI(false);
    setTimeout(() => setTicklerMessage({ type: '', text: '' }), 5000);
  };

  // Add AI generated question to a subcategory
  const handleAddAIQuestion = async (question, categoryId, subcategoryId) => {
    try {
      const result = await brainTicklerService.addQuestion(categoryId, subcategoryId, question);
      if (result.success) {
        setTicklerMessage({ type: 'success', text: 'Question added!' });
        setAiGeneratedQuestions(prev => prev.filter(q => q !== question));
        await loadBrainTicklers();
      }
    } catch (error) {
      setTicklerMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setTimeout(() => setTicklerMessage({ type: '', text: '' }), 3000);
  };

  // Handle voice preset change
  const handleVoicePresetChange = (presetName) => {
    voiceOptimizationService.setPreset(presetName);
    setSelectedVoicePreset(presetName);
    setVoiceSummary(voiceOptimizationService.getSummary());
  };

  // Reset cost tracking
  const handleResetCosts = () => {
    if (window.confirm('Reset all cost tracking data for this session?')) {
      costTrackingService.resetSession();
      setCostSummary(costTrackingService.getSessionSummary());
    }
  };

  // Save and test Groq key
  const handleSaveGroqKey = async () => {
    saveApiKey('groq', groqKey);
    setKeyStatus(getKeyStatus());

    if (groqKey) {
      setTestingKey('groq');
      const result = await testGroqKey(groqKey);
      setTestResult(prev => ({ ...prev, groq: result }));
      setTestingKey(null);
    }
  };

  // Save and test ElevenLabs key
  const handleSaveElevenLabsKey = async () => {
    saveApiKey('elevenlabs', elevenLabsKey);
    setKeyStatus(getKeyStatus());

    if (elevenLabsKey) {
      setTestingKey('elevenlabs');
      const result = await testElevenLabsKey(elevenLabsKey);
      setTestResult(prev => ({ ...prev, elevenlabs: result }));
      setTestingKey(null);
    }
  };

  // Filter timeline entries
  const filteredTimeline = DEVELOPMENT_TIMELINE.filter(entry => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        entry.title.toLowerCase().includes(search) ||
        entry.description.toLowerCase().includes(search) ||
        entry.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Dashboard
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">⚙️</span> Systems & Development
                </h1>
                <p className="text-sm text-white/50">External services, AI tools, and project history</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Quick AI Access */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🤖</span> Quick AI Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {AI_TOOLS.map(tool => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${tool.color} border rounded-xl p-4 text-center hover:scale-105 transition-all duration-200`}
              >
                <div className="text-2xl mb-1">{tool.icon}</div>
                <div className="text-sm font-medium">{tool.name}</div>
              </a>
            ))}
          </div>
        </section>

        {/* API Keys Configuration */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🔑</span> Luna Voice API Keys
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              Configure
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Groq API Key */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <h3 className="text-white font-semibold">Groq</h3>
                  <p className="text-xs text-white/50">Ultra-fast LLM for Luna's brain</p>
                </div>
                {keyStatus.groq?.configured && (
                  <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Configured
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="password"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveGroqKey}
                    disabled={testingKey === 'groq'}
                    className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {testingKey === 'groq' ? 'Testing...' : 'Save & Test'}
                  </button>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Get Key
                  </a>
                </div>

                {testResult.groq && (
                  <div className={`text-xs p-2 rounded-lg ${testResult.groq.valid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {testResult.groq.valid
                      ? `Connected! ${testResult.groq.models?.length || 0} models available`
                      : `Error: ${testResult.groq.error}`}
                  </div>
                )}

                <p className="text-xs text-white/40">
                  Free tier: 30 req/min. Models: Llama 3.3 70B, Llama 4 Scout, Mixtral
                </p>
              </div>
            </div>

            {/* ElevenLabs API Key */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl">
                  🎙️
                </div>
                <div>
                  <h3 className="text-white font-semibold">ElevenLabs</h3>
                  <p className="text-xs text-white/50">Premium TTS for Luna's voice</p>
                </div>
                {keyStatus.elevenlabs?.configured && (
                  <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Configured
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="password"
                    value={elevenLabsKey}
                    onChange={(e) => setElevenLabsKey(e.target.value)}
                    placeholder="sk_..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveElevenLabsKey}
                    disabled={testingKey === 'elevenlabs'}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {testingKey === 'elevenlabs' ? 'Testing...' : 'Save & Test'}
                  </button>
                  <a
                    href="https://elevenlabs.io/app/settings/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Get Key
                  </a>
                </div>

                {testResult.elevenlabs && (
                  <div className={`text-xs p-2 rounded-lg ${testResult.elevenlabs.valid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {testResult.elevenlabs.valid
                      ? `Connected! ${testResult.elevenlabs.voices || 0} voices available`
                      : `Error: ${testResult.elevenlabs.error}`}
                  </div>
                )}

                <p className="text-xs text-white/40">
                  Free tier: 10K chars/month. Premium voices with emotional control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GENESIS Cost Dashboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>💰</span> GENESIS Cost Dashboard
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                Live
              </span>
            </h2>
            <button
              onClick={handleResetCosts}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Reset Session
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Session Total */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="text-xs text-white/50 mb-1">Session Total</div>
              <div className="text-2xl font-bold text-green-400">
                {costSummary?.formattedTotal || '$0.0000'}
              </div>
              <div className="text-xs text-white/40 mt-1">{costSummary?.duration || '0 min'}</div>
            </div>

            {/* Daily Estimate */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="text-xs text-white/50 mb-1">Daily Estimate</div>
              <div className="text-2xl font-bold text-amber-400">
                ${costTrackingService.getDailyEstimate().toFixed(2)}
              </div>
              <div className="text-xs text-white/40 mt-1">projected</div>
            </div>

            {/* Monthly Estimate */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="text-xs text-white/50 mb-1">Monthly Estimate</div>
              <div className="text-2xl font-bold text-purple-400">
                ${costTrackingService.getMonthlyEstimate().toFixed(2)}
              </div>
              <div className="text-xs text-white/40 mt-1">projected</div>
            </div>

            {/* API Calls */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-xs text-white/50 mb-1">Total API Calls</div>
              <div className="text-2xl font-bold text-cyan-400">
                {costSummary?.byProvider?.reduce((acc, p) => acc + p.calls, 0) || 0}
              </div>
              <div className="text-xs text-white/40 mt-1">this session</div>
            </div>
          </div>

          {/* Cost by Provider */}
          {costSummary?.byProvider?.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-4 mb-4">
              <div className="text-sm text-white/60 mb-3">Cost by Provider</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {costSummary.byProvider.map(provider => (
                  <div key={provider.name} className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-white/50">{provider.name}</div>
                    <div className="text-lg font-semibold text-white">{provider.formatted}</div>
                    <div className="text-xs text-white/30">{provider.calls} calls</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggle detailed view */}
          <button
            onClick={() => setShowCostDetails(!showCostDetails)}
            className="text-sm text-amber-400/80 hover:text-amber-400 transition-colors"
          >
            {showCostDetails ? '▼ Hide Details' : '▶ Show Model Details'}
          </button>

          {showCostDetails && costSummary?.byModel?.length > 0 && (
            <div className="mt-3 bg-slate-900/50 rounded-xl border border-white/5 p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/50 text-left">
                    <th className="pb-2">Model</th>
                    <th className="pb-2">Calls</th>
                    <th className="pb-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {costSummary.byModel.map(model => (
                    <tr key={model.id} className="border-t border-white/5">
                      <td className="py-2 text-white/80">{model.name}</td>
                      <td className="py-2 text-white/60">{model.calls}</td>
                      <td className="py-2 text-right text-green-400">{model.formatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Voice Optimization Dashboard */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🎤</span> Voice Optimization
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              {selectedVoicePreset}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Quality Presets */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-4">
              <div className="text-sm text-white/60 mb-3">Quality Presets</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(VOICE_QUALITY_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handleVoicePresetChange(key)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedVoicePreset === key
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-slate-900/50 border-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Latency Metrics */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-4">
              <div className="text-sm text-white/60 mb-3">Latency Metrics (avg)</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">STT (Speech-to-Text)</span>
                  <span className="text-sm font-mono text-cyan-400">
                    {voiceSummary?.averageLatencies?.stt || 0}ms
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((voiceSummary?.averageLatencies?.stt || 0) / 20, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">LLM (Thinking)</span>
                  <span className="text-sm font-mono text-amber-400">
                    {voiceSummary?.averageLatencies?.llm || 0}ms
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((voiceSummary?.averageLatencies?.llm || 0) / 30, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">TTS (Text-to-Speech)</span>
                  <span className="text-sm font-mono text-green-400">
                    {voiceSummary?.averageLatencies?.tts || 0}ms
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((voiceSummary?.averageLatencies?.tts || 0) / 10, 100)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-white/80 font-medium">Total Turn</span>
                  <span className="text-lg font-mono text-purple-400">
                    {voiceSummary?.averageLatencies?.total || 0}ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Config */}
          <div className="mt-4 bg-slate-900/50 rounded-xl border border-white/5 p-4">
            <div className="text-sm text-white/60 mb-2">Current Configuration</div>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-white/40">STT:</span>{' '}
                <span className="text-white/80">{voiceSummary?.presetConfig?.stt?.model || 'whisper-large-v3'}</span>
              </div>
              <div>
                <span className="text-white/40">TTS:</span>{' '}
                <span className="text-white/80">{voiceSummary?.presetConfig?.tts?.model || 'eleven_multilingual_v2'}</span>
              </div>
              <div>
                <span className="text-white/40">LLM Thinking:</span>{' '}
                <span className="text-white/80">{voiceSummary?.presetConfig?.llm?.thinkingLevel || 'medium'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Brain Ticklers Admin */}
        <section>
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowBrainTicklerAdmin(!showBrainTicklerAdmin)}
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🧠</span> Brain Ticklers Admin
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                {ticklerStats.questions} questions
              </span>
            </h2>
            <span className="text-white/50 text-sm">
              {showBrainTicklerAdmin ? '▼ Hide' : '▶ Expand'}
            </span>
          </div>

          {showBrainTicklerAdmin && (
            <div className="space-y-4">
              {/* Stats & Actions */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">Categories</div>
                  <div className="text-2xl font-bold text-yellow-400">{ticklerStats.categories}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">Topics</div>
                  <div className="text-2xl font-bold text-blue-400">{ticklerStats.subcategories}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-1">Questions</div>
                  <div className="text-2xl font-bold text-green-400">{ticklerStats.questions}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-center">
                  <button
                    onClick={handleInitializeBrainTicklers}
                    className="text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    🔄 Reset to Defaults
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {ticklerMessage.text && (
                <div className={`p-3 rounded-lg text-sm ${
                  ticklerMessage.type === 'success' ? 'bg-green-500/20 text-green-400' :
                  ticklerMessage.type === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {ticklerMessage.text}
                </div>
              )}

              {/* AI Question Generator */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5">
                <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🤖</span> AI Question Generator
                </h3>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Enter topic (e.g., 'military service', 'college years')"
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    onClick={handleGenerateAIQuestions}
                    disabled={isGeneratingAI}
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAI ? '⏳ Generating...' : '✨ Generate'}
                  </button>
                </div>
                {aiGeneratedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-white/50 mb-2">Generated questions (click to add to a category):</div>
                    {aiGeneratedQuestions.map((question, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-lg p-3 flex items-start justify-between gap-3">
                        <span className="text-sm text-white/80 flex-1">{question}</span>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const [catId, subId] = e.target.value.split('||');
                              handleAddAIQuestion(question, catId, subId);
                              e.target.value = '';
                            }
                          }}
                          className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white/60"
                        >
                          <option value="">Add to...</option>
                          {Object.entries(brainTicklerCategories).map(([catId, cat]) => (
                            Object.entries(cat.subcategories || {}).map(([subId, sub]) => (
                              <option key={`${catId}||${subId}`} value={`${catId}||${subId}`}>
                                {cat.icon} {sub.title}
                              </option>
                            ))
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Browser/Editor */}
              <div className="bg-slate-800/50 rounded-xl border border-white/5 p-5">
                <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📚</span> Question Library
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {Object.entries(brainTicklerCategories)
                    .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
                    .map(([categoryId, category]) => (
                    <div key={categoryId} className="border border-white/10 rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <div
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                          expandedAdminCategory === categoryId ? 'bg-amber-500/10' : 'hover:bg-white/5'
                        }`}
                        onClick={() => {
                          setExpandedAdminCategory(expandedAdminCategory === categoryId ? null : categoryId);
                          setExpandedAdminSubcategory(null);
                        }}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="flex-1 font-medium text-white">{category.title}</span>
                        <span className="text-xs text-white/40">
                          {Object.keys(category.subcategories || {}).length} topics
                        </span>
                        <span className="text-white/40">{expandedAdminCategory === categoryId ? '▼' : '▶'}</span>
                      </div>

                      {/* Subcategories */}
                      {expandedAdminCategory === categoryId && (
                        <div className="border-t border-white/10 bg-slate-900/30">
                          {Object.entries(category.subcategories || {})
                            .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
                            .map(([subcatId, subcategory]) => (
                            <div key={subcatId} className="border-b border-white/5 last:border-b-0">
                              {/* Subcategory Header */}
                              <div
                                className={`flex items-center gap-3 p-3 pl-8 cursor-pointer transition-colors ${
                                  expandedAdminSubcategory === subcatId ? 'bg-blue-500/10' : 'hover:bg-white/5'
                                }`}
                                onClick={() => setExpandedAdminSubcategory(expandedAdminSubcategory === subcatId ? null : subcatId)}
                              >
                                <span className="flex-1 text-sm text-white/80">{subcategory.title}</span>
                                <span className="text-xs text-white/40">
                                  {(subcategory.questions || []).length} questions
                                </span>
                                <span className="text-white/40 text-xs">{expandedAdminSubcategory === subcatId ? '▼' : '▶'}</span>
                              </div>

                              {/* Questions */}
                              {expandedAdminSubcategory === subcatId && (
                                <div className="bg-slate-950/50 p-3 pl-10 space-y-2">
                                  {/* Existing Questions */}
                                  {(subcategory.questions || []).map((question, qIdx) => (
                                    <div key={question.id || qIdx} className="flex items-start gap-2 group">
                                      {editingQuestion === question.id ? (
                                        <>
                                          <input
                                            type="text"
                                            value={editingQuestionText}
                                            onChange={(e) => setEditingQuestionText(e.target.value)}
                                            className="flex-1 bg-slate-800 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                            autoFocus
                                          />
                                          <button
                                            onClick={() => handleUpdateQuestion(categoryId, subcatId, question.id)}
                                            className="text-green-400 hover:text-green-300 text-sm px-2"
                                          >
                                            ✓
                                          </button>
                                          <button
                                            onClick={() => { setEditingQuestion(null); setEditingQuestionText(''); }}
                                            className="text-red-400 hover:text-red-300 text-sm px-2"
                                          >
                                            ✗
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <span className="flex-1 text-sm text-white/70">{question.text}</span>
                                          <button
                                            onClick={() => { setEditingQuestion(question.id); setEditingQuestionText(question.text); }}
                                            className="text-white/30 hover:text-amber-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            ✏️
                                          </button>
                                          <button
                                            onClick={() => handleDeleteQuestion(categoryId, subcatId, question.id)}
                                            className="text-white/30 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            🗑️
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  ))}

                                  {/* Add New Question */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                    <input
                                      type="text"
                                      value={newQuestionText}
                                      onChange={(e) => setNewQuestionText(e.target.value)}
                                      placeholder="Add new question..."
                                      className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-green-500/50"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleAddQuestion(categoryId, subcatId);
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => handleAddQuestion(categoryId, subcatId)}
                                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded text-sm transition-colors"
                                    >
                                      + Add
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Service Categories */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> Service Links
          </h2>

          <div className="grid gap-6">
            {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
              <div key={key} className="bg-slate-800/50 rounded-2xl border border-white/5 p-5">
                <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span>{category.icon}</span> {category.title}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.services.map(service => (
                    <a
                      key={service.name}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-xl flex-shrink-0`}>
                          {service.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium group-hover:text-amber-400 transition-colors flex items-center gap-1">
                            {service.name}
                            <span className="text-white/30 text-xs">↗</span>
                          </div>
                          <div className="text-xs text-white/50 mt-0.5">{service.description}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Timeline */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📜</span> Development Timeline
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                {DEVELOPMENT_TIMELINE.length} entries
              </span>
            </h2>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search timeline..."
                className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 w-48"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-1">
                {filteredTimeline.map((entry, index) => (
                  <div
                    key={index}
                    className="group relative pl-6 pb-6 border-l-2 border-amber-500/20 last:border-l-transparent last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" />

                    <div className="bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-amber-500/20 rounded-xl p-4 ml-4 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-amber-400/80 font-mono">{entry.date}</span>
                            {entry.claudeCode && (
                              <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <span>🐷</span> Claude Code
                              </span>
                            )}
                          </div>
                          <h4 className="text-white font-medium">{entry.title}</h4>
                          <p className="text-sm text-white/60 mt-1">{entry.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-slate-700/50 text-white/50 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project Stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{DEVELOPMENT_TIMELINE.length}</div>
            <div className="text-xs text-white/50 mt-1">Development Entries</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">7</div>
            <div className="text-xs text-white/50 mt-1">AI Constellation</div>
            <div className="text-xs text-white/30">Claude, Gemini, Grok, Opus, DeepSeek, ChatGPT, Nano</div>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-500/10 to-rose-500/10 border border-fuchsia-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-fuchsia-400">2</div>
            <div className="text-xs text-white/50 mt-1">Image Generators</div>
            <div className="text-xs text-white/30">Stability.ai, Leonardo.ai</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {Object.values(SERVICE_CATEGORIES).reduce((acc, cat) => acc + cat.services.length, 0)}
            </div>
            <div className="text-xs text-white/50 mt-1">External Services</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-xs text-white/50 mt-1">Claude Code Built</div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5">
          <div className="text-white/30 text-sm">
            GENESIS Project • Built with 💛 by Brother Claude Code (Yin Wood Pig)
          </div>
          <div className="text-white/20 text-xs mt-1">
            December 2024 – January 2025
          </div>
        </footer>
      </main>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
}

export default SystemsPage;
