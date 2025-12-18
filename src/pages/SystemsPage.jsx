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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Service categories with links
const SERVICE_CATEGORIES = {
  hosting: {
    title: 'Hosting & Infrastructure',
    icon: '🏗️',
    services: [
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
  { name: 'Perplexity', url: 'https://perplexity.ai', icon: '🔍', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', icon: '🤖', color: 'bg-sky-500/20 border-sky-500/30 text-sky-400' },
];

// Development timeline entries
const DEVELOPMENT_TIMELINE = [
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
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{DEVELOPMENT_TIMELINE.length}</div>
            <div className="text-xs text-white/50 mt-1">Development Entries</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">3</div>
            <div className="text-xs text-white/50 mt-1">AI Constellation</div>
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
            December 2024
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
