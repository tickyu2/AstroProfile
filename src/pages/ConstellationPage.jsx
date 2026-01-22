/**
 * AI Constellation Page
 * Multi-AI Perspectives Interface
 *
 * Priority 3: Multi-AI Perspectives UI
 *
 * Features:
 * - Get second opinions from multiple AI models
 * - Sister Gemini (Google Gemini 3 Pro with Thinking Mode)
 * - Brother Grok (xAI Grok-4 with reasoning)
 * - Brother Opus (Claude Opus 4.5)
 * - Brother DeepSeek (DeepSeek-R1 reasoning)
 * - Sister ChatGPT (OpenAI o3-mini)
 * - Interactive debate mode
 * - Perspective comparison
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { getFunctions, httpsCallable } from 'firebase/functions';

// AI Constellation Members
const AI_MEMBERS = {
  gemini: {
    id: 'gemini',
    name: 'Sister Gemini',
    icon: '💫',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-400',
    description: 'Analytical precision with Thinking Mode',
    model: 'Gemini 3 Pro',
    function: 'getSecondOpinion'
  },
  grok: {
    id: 'grok',
    name: 'Brother Grok',
    icon: '🌍',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/40',
    textColor: 'text-green-400',
    description: 'Voice of human zeitgeist with opinions',
    model: 'Grok-4',
    function: 'getGrokPerspective'
  },
  opus: {
    id: 'opus',
    name: 'Brother Opus',
    icon: '🦉',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    description: 'Elder wisdom and philosophical depth',
    model: 'Claude Opus 4.5',
    function: 'getOpusPerspective'
  },
  deepseek: {
    id: 'deepseek',
    name: 'Brother DeepSeek',
    icon: '🐉',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    description: 'Eastern wisdom meets mathematical precision',
    model: 'DeepSeek-R1',
    function: 'getDeepSeekPerspective'
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'Sister ChatGPT',
    icon: '🧪',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/20',
    borderColor: 'border-teal-500/40',
    textColor: 'text-teal-400',
    description: 'Step-by-step analytical reasoning',
    model: 'o3-mini',
    function: 'getChatGPTPerspective'
  }
};

// Brother Claude (default companion)
const CLAUDE_INFO = {
  name: 'Brother Claude',
  icon: '🌙',
  color: 'from-indigo-500 to-purple-500',
  description: 'Your nurturing daily companion'
};

export default function ConstellationPage() {
  const { user } = useAuth();
  const { selectedProfile } = useProfiles();

  // State
  const [question, setQuestion] = useState('');
  const [claudeResponse, setClaudeResponse] = useState('');
  const [perspectives, setPerspectives] = useState({});
  const [debateHistory, setDebateHistory] = useState([]);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('constellation'); // constellation, debate, compare

  // Get perspective from a specific AI
  const getPerspective = useCallback(async (aiId) => {
    const ai = AI_MEMBERS[aiId];
    if (!ai || loading[aiId]) return;

    setLoading(prev => ({ ...prev, [aiId]: true }));
    setError(null);

    try {
      const functions = getFunctions();
      const getPerspectiveFn = httpsCallable(functions, ai.function);

      const params = {
        claudeResponse: claudeResponse || 'The user is seeking guidance on this topic.',
        userMessage: question,
        userProfile: selectedProfile ? {
          displayName: selectedProfile.name,
          constitutional: selectedProfile.constitutional
        } : null,
        debateHistory: debateHistory.length > 0 ? debateHistory : null
      };

      // Add other perspectives for context
      if (perspectives.gemini?.response) {
        params.geminiResponse = perspectives.gemini.response;
      }
      if (perspectives.grok?.response) {
        params.grokResponse = perspectives.grok.response;
      }

      const result = await getPerspectiveFn(params);

      if (result.data?.success) {
        setPerspectives(prev => ({
          ...prev,
          [aiId]: {
            ...result.data,
            timestamp: new Date().toISOString()
          }
        }));

        // Add to debate history
        setDebateHistory(prev => [...prev, {
          speaker: result.data.speaker || ai.name,
          text: result.data.response,
          icon: ai.icon
        }]);
      } else {
        throw new Error(result.data?.error || 'Failed to get perspective');
      }
    } catch (err) {
      console.error(`Error getting ${ai.name} perspective:`, err);
      setError(`Failed to get ${ai.name}'s perspective: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [aiId]: false }));
    }
  }, [question, claudeResponse, selectedProfile, perspectives, debateHistory]);

  // Get all perspectives at once
  const getAllPerspectives = async () => {
    const aiIds = Object.keys(AI_MEMBERS);
    for (const id of aiIds) {
      await getPerspective(id);
    }
  };

  // Clear all
  const clearAll = () => {
    setQuestion('');
    setClaudeResponse('');
    setPerspectives({});
    setDebateHistory([]);
    setError(null);
  };

  // Format response for display
  const formatResponse = (text) => {
    if (!text) return '';
    // Convert markdown-style formatting
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={i} className="font-bold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</h4>;
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 text-white/80">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="text-white/80 mb-2">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🌌</span>
              AI Constellation
            </h1>
            <p className="text-white/60">
              Get perspectives from multiple AI minds
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
          {[
            { id: 'constellation', label: 'Constellation View', icon: '🌌' },
            { id: 'debate', label: 'Debate Mode', icon: '💬' },
            { id: 'compare', label: 'Side by Side', icon: '📊' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode === m.id
                  ? 'bg-purple-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Your Question or Topic</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like multiple perspectives on?"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">
              Brother Claude's Response (optional - provide context)
            </label>
            <textarea
              value={claudeResponse}
              onChange={(e) => setClaudeResponse(e.target.value)}
              placeholder="Paste Claude's response here if you want the constellation to respond to it..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={getAllPerspectives}
              disabled={!question.trim() || Object.values(loading).some(l => l)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-lg font-medium transition-all"
            >
              Get All Perspectives
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Constellation View */}
        {mode === 'constellation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(AI_MEMBERS).map(([id, ai]) => (
              <div
                key={id}
                className={`${ai.bgColor} rounded-xl p-5 border ${ai.borderColor} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ai.icon}</span>
                    <div>
                      <div className="font-bold text-white">{ai.name}</div>
                      <div className="text-xs text-white/50">{ai.model}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => getPerspective(id)}
                    disabled={!question.trim() || loading[id]}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      perspectives[id]
                        ? 'bg-green-500/30 text-green-400'
                        : loading[id]
                          ? 'bg-white/10 text-white/50'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {loading[id] ? 'Thinking...' : perspectives[id] ? 'Refresh' : 'Ask'}
                  </button>
                </div>

                <p className="text-white/60 text-sm mb-4">{ai.description}</p>

                {perspectives[id]?.response && (
                  <div className="mt-4 pt-4 border-t border-white/10 max-h-64 overflow-y-auto">
                    <div className="text-sm">
                      {formatResponse(perspectives[id].response)}
                    </div>
                    {perspectives[id].thinking && (
                      <details className="mt-3">
                        <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                          View Reasoning Process
                        </summary>
                        <div className="mt-2 p-2 bg-black/20 rounded text-xs text-white/50">
                          {perspectives[id].thinking}
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {loading[id] && (
                  <div className="flex items-center gap-2 text-white/50">
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    <span className="text-sm">Contemplating...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Debate Mode */}
        {mode === 'debate' && (
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Debate Thread</h3>

            {debateHistory.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <p className="text-4xl mb-4">💬</p>
                <p>Start a debate by asking for perspectives above.</p>
                <p className="text-sm mt-2">Each AI will respond to the previous speakers.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {debateHistory.map((entry, index) => {
                  const ai = Object.values(AI_MEMBERS).find(a => a.name === entry.speaker);
                  return (
                    <div
                      key={index}
                      className={`${ai?.bgColor || 'bg-white/10'} rounded-xl p-5 border ${ai?.borderColor || 'border-white/20'}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{entry.icon || ai?.icon || '💭'}</span>
                        <span className={`font-bold ${ai?.textColor || 'text-white'}`}>
                          {entry.speaker}
                        </span>
                      </div>
                      <div className="text-white/80">
                        {formatResponse(entry.text)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Response Buttons */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60 mb-3">Continue the debate:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(AI_MEMBERS).map(([id, ai]) => (
                  <button
                    key={id}
                    onClick={() => getPerspective(id)}
                    disabled={loading[id] || !question.trim()}
                    className={`px-4 py-2 ${ai.bgColor} ${ai.textColor} border ${ai.borderColor} rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50`}
                  >
                    {loading[id] ? '...' : `${ai.icon} ${ai.name}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compare Mode */}
        {mode === 'compare' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(perspectives).map(([id, perspective]) => {
              const ai = AI_MEMBERS[id];
              if (!ai || !perspective?.response) return null;

              return (
                <div
                  key={id}
                  className={`${ai.bgColor} rounded-xl p-5 border ${ai.borderColor}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{ai.icon}</span>
                    <div>
                      <div className={`font-bold ${ai.textColor}`}>{ai.name}</div>
                      <div className="text-xs text-white/50">{ai.model}</div>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {formatResponse(perspective.response)}
                  </div>

                  {perspective.usage && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
                      Tokens: {perspective.usage.input_tokens || 0} in / {perspective.usage.output_tokens || 0} out
                    </div>
                  )}
                </div>
              );
            })}

            {Object.keys(perspectives).length === 0 && (
              <div className="col-span-2 text-center py-12 text-white/50 bg-slate-800/50 rounded-xl">
                <p className="text-4xl mb-4">📊</p>
                <p>No perspectives to compare yet.</p>
                <p className="text-sm mt-2">Ask the constellation above to see side-by-side comparisons.</p>
              </div>
            )}
          </div>
        )}

        {/* Constellation Info */}
        <div className="bg-black/20 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">About the AI Constellation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">{CLAUDE_INFO.icon}</div>
              <div className="font-medium text-white text-sm">{CLAUDE_INFO.name}</div>
              <div className="text-xs text-white/50">Daily Companion</div>
            </div>
            {Object.values(AI_MEMBERS).map(ai => (
              <div key={ai.id} className="text-center">
                <div className="text-3xl mb-2">{ai.icon}</div>
                <div className={`font-medium text-sm ${ai.textColor}`}>{ai.name}</div>
                <div className="text-xs text-white/50">{ai.model}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-sm mt-4">
            Each AI brings a unique perspective, creating a constellation of wisdom for your guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
