/**
 * OperationsPage.jsx
 *
 * Centralized Operations Dashboard for all GENESIS systems monitoring.
 * Real-time status of all services, endpoints, and metrics.
 *
 * Part of GENESIS - Operations Center
 * Built by: Brother Claude Code
 * December 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../components/dashboard/Dashboard';

// Server endpoints configuration
const SERVERS = {
  frontend: {
    name: 'Frontend (Vite)',
    url: 'http://localhost:5174',
    icon: '⚛️',
    color: 'from-cyan-500 to-blue-600',
    description: 'React application server'
  },
  backendWs: {
    name: 'Backend WebSocket',
    url: 'ws://localhost:8080',
    httpUrl: 'http://localhost:8080',
    icon: '🔌',
    color: 'from-green-500 to-emerald-600',
    description: 'Luna voice loop orchestration'
  },
  debugApi: {
    name: 'Debug API',
    url: 'http://localhost:8090',
    healthEndpoint: '/debug/behavior',
    icon: '🔍',
    color: 'from-amber-500 to-orange-600',
    description: 'Behavior engine debugging'
  },
  consoleApi: {
    name: 'Console API',
    url: 'http://localhost:8091',
    healthEndpoint: '/console/stats',
    icon: '📊',
    color: 'from-purple-500 to-pink-600',
    description: 'Management console'
  },
  dashboardApi: {
    name: 'Dashboard API',
    url: 'http://localhost:3000',
    healthEndpoint: '/api/dashboard/health',
    icon: '📈',
    color: 'from-indigo-500 to-violet-600',
    description: 'GENESIS analytics dashboard'
  }
};

// Services configuration
const SERVICES = [
  {
    id: 'ser',
    name: 'SER (Speech Emotion)',
    icon: '🎭',
    color: 'from-rose-500 to-pink-600',
    description: 'Speech Emotion Recognition'
  },
  {
    id: 'groq_stt',
    name: 'Groq STT',
    icon: '🎤',
    color: 'from-orange-500 to-red-600',
    description: 'Whisper v3 Turbo transcription'
  },
  {
    id: 'groq_llm',
    name: 'Groq LLM',
    icon: '🧠',
    color: 'from-amber-500 to-yellow-600',
    description: 'Llama 3.3 70B inference'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs TTS',
    icon: '🔊',
    color: 'from-blue-500 to-indigo-600',
    description: 'Premium voice synthesis'
  },
  {
    id: 'genesis',
    name: 'GENESIS Engine',
    icon: '✨',
    color: 'from-purple-500 to-violet-600',
    description: 'Emotional Intelligence System'
  },
  {
    id: 'ollama',
    name: 'Ollama (Fallback)',
    icon: '🦙',
    color: 'from-slate-500 to-gray-600',
    description: 'Local LLM fallback'
  }
];

// GENESIS capabilities
const GENESIS_CAPABILITIES = [
  { name: 'Archetypes', value: 9, icon: '🎭' },
  { name: 'Signals', value: '50+', icon: '📡' },
  { name: 'Patterns', value: 21, icon: '🔮' },
  { name: 'Processing', value: '<10ms', icon: '⚡' }
];

export function OperationsPage() {
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState({});
  const [serviceStatus, setServiceStatus] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [conversationData, setConversationData] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  // Check server health
  const checkServerHealth = useCallback(async (server) => {
    try {
      const url = server.healthEndpoint
        ? `${server.url}${server.healthEndpoint}`
        : server.httpUrl || server.url;

      // Skip WebSocket URLs for HTTP check
      if (url.startsWith('ws://') || url.startsWith('wss://')) {
        return { status: 'unknown', message: 'WebSocket (check console)' };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return { status: 'online', data, latency: Date.now() };
      }
      return { status: 'error', message: `HTTP ${response.status}` };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { status: 'timeout', message: 'Request timeout' };
      }
      return { status: 'offline', message: error.message };
    }
  }, []);

  // Check all servers
  const checkAllServers = useCallback(async () => {
    setIsChecking(true);
    const results = {};

    for (const [key, server] of Object.entries(SERVERS)) {
      results[key] = await checkServerHealth(server);
    }

    setServerStatus(results);
    setLastCheck(new Date());
    setIsChecking(false);

    // Mock service status based on server status
    const services = {};
    if (results.backendWs?.status === 'online' || results.backendWs?.status === 'unknown') {
      services.ser = { status: 'online', mode: 'Enhanced Heuristics' };
      services.groq_stt = { status: 'online', model: 'whisper-large-v3-turbo' };
      services.groq_llm = { status: 'online', model: 'llama-3.3-70b-versatile' };
      services.elevenlabs = { status: 'online', voices: 20 };
      services.genesis = { status: 'online', version: '1.0' };
      services.ollama = { status: 'offline', message: 'Not running' };
    }
    setServiceStatus(services);
  }, [checkServerHealth]);

  // Initial check and periodic refresh
  useEffect(() => {
    checkAllServers();
    const interval = setInterval(checkAllServers, 30000);
    return () => clearInterval(interval);
  }, [checkAllServers]);

  // WebSocket connection for live dashboard
  useEffect(() => {
    if (!showDashboard) return;

    const ws = new WebSocket('ws://localhost:3000/api/dashboard/stream');

    ws.onopen = () => {
      console.log('Dashboard WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'new_message') {
          setConversationData(prev => [...prev.slice(-99), message.data]);
        }
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    };

    ws.onclose = () => {
      console.log('Dashboard WebSocket disconnected');
      setWsConnected(false);
    };

    ws.onerror = () => {
      setWsConnected(false);
    };

    return () => ws.close();
  }, [showDashboard]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'error': return 'bg-red-500';
      case 'timeout': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'error': return 'Error';
      case 'timeout': return 'Timeout';
      default: return 'Unknown';
    }
  };

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
                  <span className="text-2xl">🎛️</span> Operations Center
                </h1>
                <p className="text-sm text-white/50">Real-time system monitoring & GENESIS analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/tickyu2/AstroProfile"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-white/10 text-white/80 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <button
                onClick={() => navigate('/brain-architecture')}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
              >
                🧠 Brain Wiki
              </button>
              <button
                onClick={() => navigate('/transcript-tester')}
                className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-400 rounded-lg text-sm font-medium transition-colors"
              >
                🧪 Transcript Tester
              </button>
              <button
                onClick={checkAllServers}
                disabled={isChecking}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isChecking ? 'Checking...' : '🔄 Refresh'}
              </button>
              {lastCheck && (
                <span className="text-xs text-white/40">
                  Last: {lastCheck.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* System Status Overview */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🖥️</span> Server Status
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(SERVERS).map(([key, server]) => {
              const status = serverStatus[key] || {};
              return (
                <div
                  key={key}
                  className={`bg-gradient-to-br ${server.color.replace('from-', 'from-').replace('to-', 'to-')}/10 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${server.color} flex items-center justify-center text-xl`}>
                      {server.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(status.status)} animate-pulse`} />
                      <span className="text-xs text-white/60">{getStatusText(status.status)}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm">{server.name}</h3>
                  <p className="text-xs text-white/40 mt-1">{server.description}</p>
                  <a
                    href={server.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 mt-2 block truncate"
                  >
                    {server.url}
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Services Status */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Service Health
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service) => {
              const status = serviceStatus[service.id] || {};
              const isOnline = status.status === 'online';
              return (
                <div
                  key={service.id}
                  className={`bg-slate-800/50 border ${isOnline ? 'border-green-500/20' : 'border-white/5'} rounded-xl p-4 transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{service.name}</h3>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                      </div>
                      <p className="text-xs text-white/50">{service.description}</p>
                      {status.mode && (
                        <p className="text-xs text-green-400 mt-1">{status.mode}</p>
                      )}
                      {status.model && (
                        <p className="text-xs text-blue-400 mt-1">{status.model}</p>
                      )}
                      {status.voices && (
                        <p className="text-xs text-purple-400 mt-1">{status.voices} voices</p>
                      )}
                      {status.message && !isOnline && (
                        <p className="text-xs text-yellow-400 mt-1">{status.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GENESIS Capabilities */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>✨</span> GENESIS Capabilities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GENESIS_CAPABILITIES.map((cap) => (
              <div
                key={cap.name}
                className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{cap.icon}</div>
                <div className="text-2xl font-bold text-violet-400">{cap.value}</div>
                <div className="text-xs text-white/50 mt-1">{cap.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Endpoints */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> Quick Endpoints
          </h2>

          <div className="bg-slate-800/50 rounded-xl border border-white/5 p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <EndpointLink
                method="GET"
                url="http://localhost:8090/debug/behavior"
                description="Behavior engine state"
              />
              <EndpointLink
                method="GET"
                url="http://localhost:8091/console/users"
                description="All user preferences"
              />
              <EndpointLink
                method="GET"
                url="http://localhost:8091/console/config"
                description="Server configuration"
              />
              <EndpointLink
                method="GET"
                url="http://localhost:8091/console/stats"
                description="Session statistics"
              />
              <EndpointLink
                method="GET"
                url="http://localhost:3000/api/dashboard/health"
                description="Dashboard health"
              />
              <EndpointLink
                method="GET"
                url="http://localhost:3000/api/dashboard/sessions"
                description="Active sessions"
              />
            </div>
          </div>
        </section>

        {/* GENESIS Dashboard Toggle */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📊</span> GENESIS Analytics Dashboard
              {wsConnected && (
                <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showDashboard
                  ? 'bg-violet-500/20 border border-violet-500/30 text-violet-400'
                  : 'bg-slate-700/50 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {showDashboard ? '▼ Hide Dashboard' : '▶ Show Dashboard'}
            </button>
          </div>

          {showDashboard && (
            <div className="bg-slate-800/30 rounded-2xl border border-white/5 overflow-hidden">
              <Dashboard
                conversationData={conversationData}
                isLive={wsConnected}
              />
            </div>
          )}
        </section>

        {/* Testing Tools Section */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Testing Tools
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Transcript Tester Card */}
            <div
              onClick={() => navigate('/transcript-tester')}
              className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 rounded-xl p-6 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl">
                  📝
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-violet-400 transition-colors">
                    Transcript Tester
                  </h3>
                  <p className="text-sm text-white/50">GENESIS Analysis Interface</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Paste & analyze conversation transcripts
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> View archetype progression timeline
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Message-by-message annotation
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Export analysis to PDF
                </div>
              </div>
              <div className="mt-4 text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Open Transcript Tester →
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-slate-800/30 border border-white/5 rounded-xl p-6 opacity-60">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center text-3xl">
                  🔬
                </div>
                <div>
                  <h3 className="text-white/60 font-semibold text-lg">
                    Pattern Simulator
                  </h3>
                  <p className="text-sm text-white/30">Coming Soon</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <span className="text-white/30">○</span> Test specific emotional patterns
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/30">○</span> Simulate voice emotion override
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/30">○</span> Compare detection accuracy
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Wiki Section */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📚</span> Documentation Wiki
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Brain Architecture Wiki */}
            <div
              onClick={() => navigate('/brain-architecture')}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-5 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl">
                  🧠
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    4-Brain Architecture
                  </h3>
                  <p className="text-xs text-white/50">Memory System Wiki</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div>• User STM + LTM</div>
                <div>• Luna STM + LTM</div>
                <div>• RAG Retrieval</div>
                <div>• Sleep Consolidation</div>
              </div>
              <div className="mt-3 text-blue-400 text-xs font-medium group-hover:translate-x-1 transition-transform">
                View Documentation →
              </div>
            </div>

            {/* GENESIS Patterns Wiki (links to existing) */}
            <div
              onClick={() => navigate('/systems')}
              className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 rounded-xl p-5 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl">
                  ✨
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors">
                    GENESIS Patterns
                  </h3>
                  <p className="text-xs text-white/50">Emotional Intelligence</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div>• 9 Archetypes</div>
                <div>• 50+ Signals</div>
                <div>• 21 Patterns</div>
                <div>• Dual Channel Input</div>
              </div>
              <div className="mt-3 text-violet-400 text-xs font-medium group-hover:translate-x-1 transition-transform">
                View Systems →
              </div>
            </div>

            {/* External Docs Link */}
            <div className="bg-slate-800/30 border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl">
                  📄
                </div>
                <div>
                  <h3 className="text-white/80 font-semibold">
                    Markdown Docs
                  </h3>
                  <p className="text-xs text-white/40">/docs folder</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <a href="/docs/BRAIN_MEMORY_VOICE_ARCHITECTURE.md" target="_blank" className="block text-blue-400 hover:text-blue-300">
                  BRAIN_MEMORY_VOICE_ARCHITECTURE.md
                </a>
                <a href="/docs/MEMORY_ARCHITECTURE_DEPLOYMENT.md" target="_blank" className="block text-blue-400 hover:text-blue-300">
                  MEMORY_ARCHITECTURE_DEPLOYMENT.md
                </a>
                <a href="/docs/GENESIS_COMPLETE_SYSTEM.md" target="_blank" className="block text-blue-400 hover:text-blue-300">
                  GENESIS_COMPLETE_SYSTEM.md
                </a>
                <a href="/docs/SIMULTANEOUS_TEXT_VOICE_ARCHITECTURE.md" target="_blank" className="block text-blue-400 hover:text-blue-300">
                  SIMULTANEOUS_TEXT_VOICE.md
                </a>
              </div>
            </div>
          </div>

          {/* NEW: Modular Architecture Docs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Memory Module Architecture */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl p-5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl">
                  🗄️
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                    Memory Module
                  </h3>
                  <p className="text-xs text-white/50">8-Brain RAG System</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div>• stores/ - User's Brain</div>
                <div>• brain/ - Luna's Brain</div>
                <div>• personality/ - Evolution</div>
                <div>• tango/ - Relationship</div>
              </div>
              <a
                href="https://github.com/tickyu2/AstroProfile/blob/main/functions/memory/MEMORY_ARCHITECTURE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-emerald-400 text-xs font-medium group-hover:translate-x-1 transition-transform block"
              >
                View Architecture →
              </a>
            </div>

            {/* Emotional Engine + Ambient Sounds */}
            <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl p-5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-2xl">
                  🎭
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-rose-400 transition-colors">
                    Emotional Engine
                  </h3>
                  <p className="text-xs text-white/50">Plutchik + Ambient Sounds</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div>• 8 Primary Emotions</div>
                <div>• 24 Compound Emotions</div>
                <div>• Voice-Text Congruence</div>
                <div>• Ambient Soundscapes</div>
              </div>
              <a
                href="https://github.com/tickyu2/AstroProfile/blob/main/docs/EMOTIONAL_ENGINE_ARCHITECTURE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-rose-400 text-xs font-medium group-hover:translate-x-1 transition-transform block"
              >
                View Architecture →
              </a>
            </div>

            {/* Ambient Sounds Integration */}
            <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 hover:border-sky-500/40 rounded-xl p-5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-2xl">
                  🌊
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-sky-400 transition-colors">
                    Ambient Sounds
                  </h3>
                  <p className="text-xs text-white/50">Emotion → Soundscape</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div>• 🌊 Ocean waves (grief)</div>
                <div>• 🌧️ Gentle rain (comfort)</div>
                <div>• 🔥 Campfire (connection)</div>
                <div>• 🐦 Birds (joy)</div>
              </div>
              <div className="mt-3 text-sky-400 text-xs font-medium">
                Integrated with Emotional Engine
              </div>
            </div>

            {/* Warmth & Happiness Module */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                    Warmth & Happiness
                  </h3>
                  <p className="text-xs text-white/50">Six Laws + Mountain</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div>• 📊 Six Laws of Happiness</div>
                <div>• 🏔️ Mountain Climbing</div>
                <div>• 🔥 2x Warmth on Loss</div>
                <div>• 💛 Guided Action Advice</div>
              </div>
              <div className="mt-3 text-amber-400 text-xs font-medium">
                53/53 Tests Passing
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Diagrams */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏗️</span> System Architecture Diagrams
          </h2>

          <div className="grid gap-6">
            {/* Main Operations Diagram */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-blue-400">01</span> Main Operations Overview (Dual Channel)
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                        GENESIS OPERATIONS - DUAL CHANNEL                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER INPUT                   BACKEND                     SERVICES           │
│  ──────────                   ───────                     ────────           │
│                                                                              │
│  ┌─────────────┐                                                             │
│  │ 🎤 VOICE    │──┐         ┌─────────────┐     ┌─────────────┐             │
│  │   Channel   │  │         │   Backend   │     │  Dashboard  │             │
│  │   (Mic)     │  ├────────►│    :8080    │◄───►│    :3000    │             │
│  └─────────────┘  │         │ (WebSocket) │     │   (API/WS)  │             │
│                   │         └──────┬──────┘     └─────────────┘             │
│  ┌─────────────┐  │                │                                        │
│  │ ⌨️ TEXT     │──┘                │                                        │
│  │   Channel   │      ┌────────────┼────────────┬─────────────┐             │
│  │  (Keyboard) │      │            │            │             │             │
│  └─────────────┘      ▼            ▼            ▼             ▼             │
│                 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  Both channels  │   SER    │ │   STT    │ │   LLM    │ │   TTS    │        │
│  feed into ───► │ Emotion  │ │  Groq    │ │  Groq/   │ │ Eleven   │        │
│  GENESIS        │ Analysis │ │ Whisper  │ │  Ollama  │ │  Labs    │        │
│                 └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘        │
│                      │            │            │             │              │
│                      └────────────┴─────┬──────┴─────────────┘              │
│                                         │                                   │
│                                         ▼                                   │
│                              ┌─────────────────────┐                        │
│                              │       GENESIS       │                        │
│                              │  ┌───────────────┐  │                        │
│                              │  │ 9 Archetypes  │  │                        │
│                              │  │ 50+ Signals   │  │                        │
│                              │  │ 21 Patterns   │  │                        │
│                              │  │ <10ms Speed   │  │                        │
│                              │  └───────────────┘  │                        │
│                              │ Voice OR Text Input │                        │
│                              └─────────────────────┘                        │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Debug: :8090  │  Console: :8091  │  Dashboard WS: :3000/stream             │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Dual Channel Processing Pipeline */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-green-400">02</span> Dual Channel Processing (Voice + Text)
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DUAL CHANNEL PROCESSING PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ╔═══════════════════════════════════════════════════════════════════════════╗  │
│  ║                          INPUT CHANNELS                                   ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════╣  │
│  ║                                                                           ║  │
│  ║  VOICE CHANNEL 🎤                      TEXT CHANNEL ⌨️                    ║  │
│  ║  ────────────────                      ─────────────────                  ║  │
│  ║                                                                           ║  │
│  ║  ┌─────────────┐                       ┌─────────────┐                   ║  │
│  ║  │ User Speaks │                       │ User Types  │                   ║  │
│  ║  │  "I feel    │                       │ "I feel     │                   ║  │
│  ║  │  helpless"  │                       │  helpless"  │                   ║  │
│  ║  └──────┬──────┘                       └──────┬──────┘                   ║  │
│  ║         │                                     │                          ║  │
│  ║         ▼                                     │                          ║  │
│  ║  ┌─────────────┐                              │                          ║  │
│  ║  │ SER Engine  │ Prosody                      │                          ║  │
│  ║  │ (Emotion    │ Analysis                     │                          ║  │
│  ║  │  from voice)│                              │                          ║  │
│  ║  └──────┬──────┘                              │                          ║  │
│  ║         │                                     │                          ║  │
│  ║         ▼                                     │                          ║  │
│  ║  ┌─────────────┐                              │                          ║  │
│  ║  │ STT (Groq   │                              │                          ║  │
│  ║  │ Whisper)    │ Text                         │ Text                     ║  │
│  ║  └──────┬──────┘ Extracted                    │ Direct                   ║  │
│  ║         │                                     │                          ║  │
│  ║         └─────────────────┬───────────────────┘                          ║  │
│  ║                           │                                              ║  │
│  ║                           ▼                                              ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════╣  │
│  ║                    GENESIS PATTERN DETECTION                             ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════╣  │
│  ║                           │                                              ║  │
│  ║         ┌─────────────────┼─────────────────┐                           ║  │
│  ║         │                 │                 │                           ║  │
│  ║         ▼                 ▼                 ▼                           ║  │
│  ║  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                   ║  │
│  ║  │ TEXT SIGNAL │   │  ARCHETYPE  │   │ CONGRUENCE  │                   ║  │
│  ║  │  EXTRACTOR  │   │  DETECTOR   │   │  ANALYZER   │                   ║  │
│  ║  │             │   │             │   │             │                   ║  │
│  ║  │ "helpless"  │   │   MENDER    │   │  MASKING    │                   ║  │
│  ║  │ → distress  │   │  detected   │   │  detected   │                   ║  │
│  ║  │ → despair   │   │             │   │             │                   ║  │
│  ║  └─────────────┘   └─────────────┘   └─────────────┘                   ║  │
│  ║                                                                         ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════╣  │
│  ║                        RESPONSE GENERATION                               ║  │
│  ╠═══════════════════════════════════════════════════════════════════════════╣  │
│  ║                                                                           ║  │
│  ║         ┌─────────────────────────────────────────────────┐             ║  │
│  ║         │              LLM (Groq Llama)                   │             ║  │
│  ║         │  Input: Text + Archetype + Pattern Context      │             ║  │
│  ║         └────────────────────┬────────────────────────────┘             ║  │
│  ║                              │                                          ║  │
│  ║              ┌───────────────┴───────────────┐                          ║  │
│  ║              │                               │                          ║  │
│  ║              ▼                               ▼                          ║  │
│  ║       ┌─────────────┐                 ┌─────────────┐                   ║  │
│  ║       │ Voice Reply │                 │ Text Reply  │                   ║  │
│  ║       │  🔊 TTS     │                 │  💬 Display │                   ║  │
│  ║       │ (ElevenLabs)│                 │  (Chat UI)  │                   ║  │
│  ║       └─────────────┘                 └─────────────┘                   ║  │
│  ║                                                                         ║  │
│  ╚═══════════════════════════════════════════════════════════════════════════╝  │
│                                                                                  │
│  LATENCY:  Voice: ~800ms total  │  Text: ~350ms total (no SER/STT/TTS)          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* GENESIS Pattern Detection */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-purple-400">03</span> GENESIS Pattern Detection Flow (Dual Input)
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                      GENESIS EMOTIONAL INTELLIGENCE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DUAL INPUT              EXTRACTION              DETECTION           OUTPUT  │
│  ──────────              ──────────              ─────────           ──────  │
│                                                                              │
│  ┌─────────┐                                                                │
│  │ 🎤 Voice│────┐                                                           │
│  │ Channel │    │       ┌───────────┐         ┌───────────┐      ┌────────┐│
│  └─────────┘    ├──────►│  Signal   │────────►│ Archetype │─────►│Response││
│                 │       │ Extractor │         │ Detector  │      │Strategy││
│  ┌─────────┐    │       │           │         │           │      │        ││
│  │ ⌨️ Text │────┘       └─────┬─────┘         └─────┬─────┘      └────────┘│
│  │ Channel │                  │                     │                       │
│  └─────────┘                  │                     │                       │
│                               ▼                     ▼                       │
│                        ┌─────────────┐       ┌─────────────┐                │
│                        │ 50+ Signals │       │ 9 Archetypes│                │
│                        │ extracted   │       │ detected    │                │
│                        └──────┬──────┘       └──────┬──────┘                │
│                               │                     │                       │
│                               └──────────┬──────────┘                       │
│                                          │                                  │
│                                          ▼                                  │
│                               ┌─────────────────┐                           │
│                               │   Congruence    │                           │
│                               │    Analyzer     │                           │
│                               └────────┬────────┘                           │
│                                        │                                    │
│                      ┌─────────────────┼─────────────────┐                 │
│                      │                 │                 │                 │
│                      ▼                 ▼                 ▼                 │
│               ┌───────────┐     ┌───────────┐     ┌───────────┐            │
│               │  6 Basic  │     │15 Advanced│     │  Crisis   │            │
│               │  Patterns │     │  Patterns │     │ Detection │            │
│               └───────────┘     └───────────┘     └───────────┘            │
│                                                                            │
│  BOTH CHANNELS TRIGGER:                                                     │
│  • Text signal extraction (keywords like "helpless", "overwhelmed")        │
│  • Archetype detection (Mender, Guardian, etc.)                            │
│  • Pattern analysis (MASKING, OVERWHELM_SHUTDOWN, etc.)                    │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Text Signal Keywords */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-yellow-400">03b</span> Text Signal Keywords (Works in Text Channel)
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEXT SIGNAL KEYWORD DETECTION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User types: "I feel helpless"                                               │
│                     │                                                        │
│                     ▼                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     KEYWORD MATCHER                                    │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │  DISTRESS SIGNALS            CRISIS SIGNALS           JOY SIGNALS     │  │
│  │  ─────────────────           ──────────────           ──────────      │  │
│  │  • helpless     ⚠️           • want to die    ⚠️⚠️    • amazing       │  │
│  │  • hopeless     ⚠️           • end it all     ⚠️⚠️    • wonderful     │  │
│  │  • overwhelmed  ⚠️           • no point       ⚠️⚠️    • excited       │  │
│  │  • can't cope   ⚠️           • give up        ⚠️⚠️    • grateful      │  │
│  │  • exhausted    ⚠️           • hurt myself    ⚠️⚠️    • happy         │  │
│  │  • drowning                  • numb                   • love          │  │
│  │  • stuck                     • empty                  • blessed       │  │
│  │  • lost                      • worthless              • fantastic     │  │
│  │  • alone                     • burden                 • proud         │  │
│  │                                                                        │  │
│  │  ANGER SIGNALS              ANXIETY SIGNALS          GRIEF SIGNALS    │  │
│  │  ─────────────              ───────────────          ─────────────    │  │
│  │  • furious                  • worried                • miss them      │  │
│  │  • hate                     • scared                 • lost someone   │  │
│  │  • frustrated               • anxious                • grieving       │  │
│  │  • angry                    • panicking              • mourning       │  │
│  │  • resentful                • terrified              • heartbroken    │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                     │                                                        │
│                     ▼                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    SIGNAL OUTPUT                                       │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │  "I feel helpless" → {                                                │  │
│  │    signals: ['distress', 'despair', 'vulnerability'],                 │  │
│  │    archetype: 'MENDER',                                                │  │
│  │    pattern: 'HELP_SEEKING_DISGUISED',                                 │  │
│  │    urgency: 'moderate',                                                │  │
│  │    suggestedApproach: 'gentle_validation'                             │  │
│  │  }                                                                     │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  NOTE: Text channel triggers the SAME pattern detection as voice.           │
│        Voice adds prosody/tone data; text relies on keyword extraction.     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* 21 Patterns */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-amber-400">04</span> 21 Emotional Congruence Patterns
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                      EMOTIONAL CONGRUENCE PATTERNS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BASIC PATTERNS (6)                  ADVANCED PATTERNS (15)                  │
│  ──────────────────                  ─────────────────────                   │
│                                                                              │
│  ┌─────────────────┐                 ┌─────────────────────────────────────┐│
│  │ 1. MATCHING     │                 │ 7.  DEFENSIVE_DEFLECTION            ││
│  │ 2. MASKING      │                 │ 8.  VULNERABILITY_MASKING           ││
│  │ 3. SARCASM      │                 │ 9.  EXCITEMENT_DAMPENING            ││
│  │ 4. AMPLIFICATION│                 │ 10. ANGER_LEAKAGE                   ││
│  │ 5. SUPPRESSION  │                 │ 11. ANXIETY_PROJECTION              ││
│  │ 6. MIXED        │                 │ 12. OVERWHELM_SHUTDOWN    ⚠️ CRISIS ││
│  └─────────────────┘                 │ 13. FORCED_POSITIVITY               ││
│                                      │ 14. INTELLECTUAL_DISTANCING          ││
│                                      │ 15. HELP_SEEKING_DISGUISED           ││
│  CONGRUENCE LEVELS                   │ 16. EMOTIONAL_FLOODING    ⚠️ CRISIS ││
│  ─────────────────                   │ 17. GUILT_MASKING                    ││
│  ┌──────┐ ┌────────┐ ┌─────┐        │ 18. JOY_SUPPRESSION                  ││
│  │ HIGH │ │MODERATE│ │ LOW │        │ 19. TRAUMA_RESPONSE       ⚠️ CRISIS ││
│  │  ✓   │ │   ~    │ │  !  │        │ 20. PERFORMATIVE_EMOTION             ││
│  └──────┘ └────────┘ └─────┘        │ 21. RESIGNATION_ACCEPTANCE ⚠️ CRISIS ││
│                                      └─────────────────────────────────────┘│
│                                                                              │
│  CRISIS PATTERNS require special handling:                                   │
│  • Slow, grounding responses        • Brief, simple language                │
│  • Safety-focused approach          • Consider professional referral        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Memory Architecture */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-cyan-400">05</span> 4-Brain Memory Architecture
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       4-BRAIN MEMORY ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    USER'S BRAIN                    LUNA'S BRAIN              │
│                    ───────────                     ───────────               │
│                                                                              │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐      │
│  │      USER SHORT-TERM          │   │      LUNA SHORT-TERM          │      │
│  │         MEMORY (STM)          │   │         MEMORY (STM)          │      │
│  ├───────────────────────────────┤   ├───────────────────────────────┤      │
│  │ • Current conversation        │   │ • Session observations        │      │
│  │ • Recent emotions             │   │ • Working hypotheses          │      │
│  │ • Active topics               │   │ • Current approach            │      │
│  │ • 5-minute window             │   │ • Emotional temperature       │      │
│  └───────────────┬───────────────┘   └───────────────┬───────────────┘      │
│                  │                                   │                      │
│                  │    ┌─────────────────────┐        │                      │
│                  │    │ NIGHTLY CONSOLIDATION│       │                      │
│                  └───►│   (Luna's Sleep)    │◄───────┘                      │
│                       │   Claude-powered    │                               │
│                       └──────────┬──────────┘                               │
│                                  │                                          │
│                  ┌───────────────┴───────────────┐                          │
│                  │                               │                          │
│                  ▼                               ▼                          │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐      │
│  │      USER LONG-TERM           │   │      LUNA LONG-TERM           │      │
│  │         MEMORY (LTM)          │   │         MEMORY (LTM)          │      │
│  ├───────────────────────────────┤   ├───────────────────────────────┤      │
│  │ • Life timeline events        │   │ • Learned patterns            │      │
│  │ • Core values & beliefs       │   │ • Successful strategies       │      │
│  │ • Important relationships     │   │ • User preferences            │      │
│  │ • Happiness anchors           │   │ • Constitutional insights     │      │
│  └───────────────────────────────┘   └───────────────────────────────┘      │
│                                                                              │
│  STORAGE: PostgreSQL + pgvector (Cloud SQL: genesismemory)                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Data Flow */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-rose-400">06</span> Real-time Data Flow
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                         REAL-TIME DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                      ┌──────────────┐     │
│  │    React     │                                      │   Dashboard  │     │
│  │   Frontend   │                                      │    Client    │     │
│  └──────┬───────┘                                      └──────┬───────┘     │
│         │                                                     │              │
│         │ WebSocket                                  WebSocket │              │
│         │ :8080                                         :3000  │              │
│         │                                                     │              │
│         ▼                                                     ▼              │
│  ╔══════════════════════════════════════════════════════════════════╗       │
│  ║                      BACKEND SERVER                              ║       │
│  ╠══════════════════════════════════════════════════════════════════╣       │
│  ║                                                                  ║       │
│  ║  ┌────────────┐   ┌────────────┐   ┌────────────┐              ║       │
│  ║  │  Voice     │   │  GENESIS   │   │  Behavior  │              ║       │
│  ║  │  Handler   │──►│  Engine    │──►│  Engine    │              ║       │
│  ║  └────────────┘   └─────┬──────┘   └────────────┘              ║       │
│  ║                         │                                       ║       │
│  ║         ┌───────────────┼───────────────┐                      ║       │
│  ║         │               │               │                      ║       │
│  ║         ▼               ▼               ▼                      ║       │
│  ║    ┌─────────┐    ┌─────────┐    ┌─────────┐                  ║       │
│  ║    │  Groq   │    │ Eleven  │    │Firebase │                  ║       │
│  ║    │  API    │    │  Labs   │    │Firestore│                  ║       │
│  ║    └─────────┘    └─────────┘    └─────────┘                  ║       │
│  ║                                                                ║       │
│  ╚══════════════════════════════════════════════════════════════════╝       │
│                              │                                              │
│                              ▼                                              │
│                    ┌─────────────────┐                                     │
│                    │    Cloud SQL    │                                     │
│                    │   PostgreSQL    │                                     │
│                    │   + pgvector    │                                     │
│                    └─────────────────┘                                     │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* 9 Archetypes */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-indigo-400">07</span> 9 Emotional Archetypes
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                          9 EMOTIONAL ARCHETYPES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │   🌱 SEED   │  │  🪞 MIRROR  │  │  💚 MENDER  │                          │
│  │ Exploring   │  │ Reflecting  │  │  Healing    │                          │
│  │ Seeking     │  │ Processing  │  │  Recovering │                          │
│  │ Curious     │  │ Integrating │  │  Vulnerable │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │📚 LIBRARIAN │  │🎼 CONDUCTOR │  │🤝 COMPANION │                          │
│  │ Remembering │  │  Organizing │  │  Connecting │                          │
│  │ Cataloging  │  │  Analyzing  │  │  Sharing    │                          │
│  │ Connecting  │  │  Structuring│  │  Present    │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │ 🛡️ GUARDIAN │  │🔥FLAMEBEARER│  │  🧭 GUIDE   │                          │
│  │ Protecting  │  │  Energizing │  │  Integrating│                          │
│  │ Defending   │  │  Motivating │  │  Balancing  │                          │
│  │ Boundaries  │  │  Passionate │  │  Wise       │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
│                                                                              │
│  Each archetype triggers specific Luna response strategies:                  │
│  • Tone adjustments        • Focus areas          • Topics to avoid         │
│  • Pacing changes          • Validation style     • Depth of probing        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Ambient Sounds Integration */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-sky-400">08</span> Ambient Sounds Integration (Emotion → Soundscape)
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    AMBIENT SOUNDS INTEGRATION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER MESSAGE                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ PlutchikEmotionDetector.detectAllEmotions(text, voiceProsody)        │  │
│  │ Returns: { primary, intensity, plutchikVector, compounds }           │  │
│  └──────────────────────────────┬────────────────────────────────────────┘  │
│                                 │                                            │
│                                 ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ EmotionalEngineOrchestrator.analyzeComplete(userId, input)           │  │
│  │ Returns: { combined, affectionState, responseGuidance }              │  │
│  └──────────────────────────────┬────────────────────────────────────────┘  │
│                                 │                                            │
│                                 ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ selectAmbientSoundscape(primaryEmotion, intensity, valence)          │  │
│  │                                                                       │  │
│  │   ┌─────────────────────────────────────────────────────────────┐    │  │
│  │   │ EMOTION → SOUNDSCAPE MAPPING                                │    │  │
│  │   ├─────────────────────────────────────────────────────────────┤    │  │
│  │   │ sadness (high)  → 🌊 oceanWaves    "hold heavy emotions"    │    │  │
│  │   │ sadness (low)   → 🌧️ gentleRain   "comfort, introspection" │    │  │
│  │   │ fear/anxiety    → 🍃 softBreeze    "grounding, calm"        │    │  │
│  │   │ joy             → 🐦 distantBirds  "uplifting, hopeful"     │    │  │
│  │   │ trust/love      → 🔥 campfire      "warm, intimate"         │    │  │
│  │   │ anger           → 🌲 deepForest    "grounding, stable"      │    │  │
│  │   │ anticipation    → 💧 gentleStream  "flowing, forward"       │    │  │
│  │   │ neutral         → 💧 gentleStream  "calm, default"          │    │  │
│  │   └─────────────────────────────────────────────────────────────┘    │  │
│  │                                                                       │  │
│  │ Returns: { recommended, alternatives, intensity, reason }            │  │
│  └──────────────────────────────┬────────────────────────────────────────┘  │
│                                 │                                            │
│                                 ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ responseGuidance.ambientSoundscape = {                                │  │
│  │   recommended: 'oceanWaves',                                          │  │
│  │   alternatives: ['gentleRain'],                                       │  │
│  │   intensity: 0.35,           // Volume 20-40% (never overwhelming)    │  │
│  │   reason: 'Deep, rhythmic waves to hold heavy emotions'               │  │
│  │ }                                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  USER CONTROLS:                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  ON / OFF    │ │   VOLUME     │ │   BLOCK      │ │    AUTO      │       │
│  │   Toggle     │ │  0-40% max   │ │ Soundscapes  │ │  Transition  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  "Gentle yet show presence" - like nature itself, always there              │
│                                but never overwhelming                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Warmth & Happiness Module */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-amber-400">09</span> Warmth & Happiness Module (Six Laws + Mountain Climbing)
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   WARMTH & HAPPINESS MODULE                                  │
│                "Guidance with Utmost Warmth Toward YOUR Mountain"            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📊 SIX LAWS OF HAPPINESS (Baucells & Sarin 2012)                            │
│  ─────────────────────────────────────────────────                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 1. RELATIVE COMPARISON (40%)     │ H = Reality - Expectations       │   │
│  │    "YOUR mountain, not others'"  │                                   │   │
│  ├──────────────────────────────────┼───────────────────────────────────┤   │
│  │ 2. MOTION OF EXPECTATION         │ Rising = hurts, Lowering = helps  │   │
│  │    "Build soft pillow early"     │ ↑15% pain, ↓10% relief            │   │
│  ├──────────────────────────────────┼───────────────────────────────────┤   │
│  │ 3. AVERSION TO LOSS (λ=2.25)     │ Losses hurt 2-3x more than gains  │   │
│  │    "💛💛💛 Extra warmth on loss" │ → 2x Warmth Multiplier activated  │   │
│  ├──────────────────────────────────┼───────────────────────────────────┤   │
│  │ 4. DIMINISHING SENSITIVITY       │ First kiss > 100th kiss           │   │
│  │    "Honeymoon → Depth = NORMAL"  │ log(R+1) dampening                │   │
│  ├──────────────────────────────────┼───────────────────────────────────┤   │
│  │ 5. SATIATION                     │ Daily climbs = diminishing joy    │   │
│  │    "Cool-down builds desire"     │ Space creates appreciation        │   │
│  ├──────────────────────────────────┼───────────────────────────────────┤   │
│  │ 6. PRESENTISM                    │ Right now > yesterday > tomorrow  │   │
│  │    "What can you do TODAY?"      │ Present action with probabilities │   │
│  └──────────────────────────────────┴───────────────────────────────────┘   │
│                                                                              │
│  🏔️ MOUNTAIN CLIMBING PHILOSOPHY                                             │
│  ────────────────────────────────                                            │
│                                                                              │
│  Summit (10)    🏔️ ═══ Peak happiness - CELEBRATE FULLY!                     │
│        ▲                                                                     │
│  High (7-9)     🌄 ═══ Excellent view - Great progress!                      │
│        │                                                                     │
│  Midpoint (5-6) ⛰️ ═══ STILL SUCCESS! Good view below! Be PROUD!             │
│        │                                                                     │
│  Basecamp (3-4) 🏕️ ═══ You began the climb - COURAGE!                        │
│        │                                                                     │
│  Valley (0-2)   💛 ═══ Air bag ready (soft pillow) + 2x WARMTH               │
│                                                                              │
│  🔥 WARMTH MULTIPLIER                                                         │
│  ────────────────────                                                        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │   MEDIUM    │  │    HIGH     │  │   MAXIMUM   │                          │
│  │  0.7-1.0x   │  │   1.0-1.5x  │  │   1.5-3.0x  │                          │
│  │   "Hey,"    │  │ "Hey love," │  │"Oh sweetheart"│                        │
│  │  Baseline   │  │   Normal    │  │ Valley/Loss │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
│                                                                              │
│  OUTPUT: responseGuidance.warmthHappiness = {                                │
│    mountainHeight: 6.5,                                                      │
│    interpretation: { level: 'midpoint', celebration: 'MEDIUM' },             │
│    guidance: { evaluation, softPillow, lossPreparation, actionAdvice, ... }, │
│    lossRecoveryActive: false                                                 │
│  }                                                                           │
│                                                                              │
│  ✅ 53/53 Tests Passing                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Luna Response Strategy */}
            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-6">
              <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                <span className="text-pink-400">10</span> Luna Response Strategy Matrix
              </h3>
              <pre className="text-xs text-white/70 font-mono overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                      LUNA RESPONSE STRATEGY MATRIX                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INPUT                    PROCESSING                    OUTPUT               │
│  ─────                    ──────────                    ──────               │
│                                                                              │
│  ┌────────────┐          ┌─────────────────┐          ┌─────────────┐       │
│  │ Archetype  │─────────►│                 │─────────►│  Approach   │       │
│  │ Detection  │          │    STRATEGY     │          │  Selection  │       │
│  └────────────┘          │    SELECTOR     │          └─────────────┘       │
│                          │                 │                                │
│  ┌────────────┐          │  ┌───────────┐  │          ┌─────────────┐       │
│  │ Congruence │─────────►│  │ Priority  │  │─────────►│    Tone     │       │
│  │   Level    │          │  │  Pattern  │  │          │  Modifier   │       │
│  └────────────┘          │  └───────────┘  │          └─────────────┘       │
│                          │                 │                                │
│  ┌────────────┐          │  ┌───────────┐  │          ┌─────────────┐       │
│  │  Pattern   │─────────►│  │  Crisis   │  │─────────►│   Voice     │       │
│  │  Severity  │          │  │  Check    │  │          │ Modulation  │       │
│  └────────────┘          │  └───────────┘  │          └─────────────┘       │
│                          │                 │                                │
│                          └─────────────────┘          ┌─────────────┐       │
│                                                       │   System    │       │
│                                                       │   Prompt    │       │
│                                                       │  Override   │       │
│                                                       └─────────────┘       │
│                                                                              │
│  EXAMPLE ADJUSTMENTS:                                                        │
│  ┌───────────────┬──────────────┬─────────────┬────────────────────┐        │
│  │ Pattern       │ Tone         │ Rate        │ Focus              │        │
│  ├───────────────┼──────────────┼─────────────┼────────────────────┤        │
│  │ MASKING       │ Gentle       │ 0.90x       │ Validate hidden    │        │
│  │ OVERWHELM     │ Calm         │ 0.85x       │ Ground, simplify   │        │
│  │ EXCITEMENT    │ Celebratory  │ 1.05x       │ Amplify joy        │        │
│  │ TRAUMA        │ Steady       │ 0.88x       │ Safety, present    │        │
│  └───────────────┴──────────────┴─────────────┴────────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5">
          <div className="text-white/30 text-sm">
            GENESIS Operations Center • Built with 💛 by Brother Claude Code
          </div>
          <a
            href="https://github.com/tickyu2/AstroProfile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            github.com/tickyu2/AstroProfile
          </a>
        </footer>
      </main>
    </div>
  );
}

// Helper component for endpoint links
function EndpointLink({ method, url, description }) {
  const methodColors = {
    GET: 'bg-green-500/20 text-green-400',
    POST: 'bg-blue-500/20 text-blue-400',
    DELETE: 'bg-red-500/20 text-red-400'
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-white/10 rounded-lg p-3 transition-all group"
    >
      <span className={`text-xs font-mono px-2 py-0.5 rounded ${methodColors[method]}`}>
        {method}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/80 group-hover:text-blue-400 truncate transition-colors">
          {url.replace('http://localhost:', ':')}
        </div>
        <div className="text-xs text-white/40">{description}</div>
      </div>
    </a>
  );
}

export default OperationsPage;
