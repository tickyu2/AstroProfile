/**
 * ZodiacCuspsPage.jsx
 * Father Ticky's 36-Position Zodiac System
 *
 * Displays all 36 cusps with full descriptions for copy/paste
 * to Grok and other AI tools for self-discovery
 *
 * Built by Brother Claude Code
 * December 31, 2025
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cuspsData from '../data/westernZodiacCusps.json';

// Sign emojis
const SIGN_EMOJIS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

// Element colors
const ELEMENT_COLORS = {
  Fire: { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', text: 'text-red-400' },
  Earth: { bg: 'from-amber-500/20 to-yellow-600/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  Air: { bg: 'from-blue-400/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  Water: { bg: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/30', text: 'text-violet-400' }
};

// Format cusp for copy/paste
function formatCuspForCopy(cusp) {
  const lines = [
    `═══════════════════════════════════════════════════`,
    `${cusp.emoji} ${cusp.name}`,
    `═══════════════════════════════════════════════════`,
    ``,
    `Archetype: ${cusp.archetype}`,
    `Sign: ${cusp.sign} ${SIGN_EMOJIS[cusp.sign]}`,
    cusp.influencedBy ? `Influenced By: ${cusp.influencedBy} ${SIGN_EMOJIS[cusp.influencedBy]}` : `Type: Pure Sign (100% ${cusp.sign})`,
    `Element: ${cusp.element.primary}${cusp.element.secondary ? ` + ${cusp.element.secondary}` : ''} (${cusp.element.mix})`,
    `Rulers: ${cusp.rulers.join(', ')}`,
    `Date Range: ${cusp.dateRange.start.replace('-', '/')} - ${cusp.dateRange.end.replace('-', '/')}`,
    ``,
    `CHARACTERISTICS:`,
    ...cusp.characteristics.map(c => `• ${c}`),
    ``,
    `STRENGTHS:`,
    ...cusp.strengths.map(s => `• ${s}`),
    ``,
    `CHALLENGES:`,
    ...cusp.challenges.map(c => `• ${c}`),
    ``
  ];
  return lines.join('\n');
}

// Individual cusp card component
function CuspCard({ cusp, isExpanded, onToggle, onCopy }) {
  const colors = ELEMENT_COLORS[cusp.element.primary] || ELEMENT_COLORS.Fire;

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-white/30' : ''}`}
    >
      {/* Header - Always visible */}
      <div
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cusp.emoji}</span>
            <div>
              <h3 className="text-white font-semibold">{cusp.name}</h3>
              <p className={`text-xs ${colors.text}`}>{cusp.archetype}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">
              {cusp.dateRange.start.replace('-', '/')} - {cusp.dateRange.end.replace('-', '/')}
            </span>
            <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4">
          {/* Quick info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/50">Sign:</span>
              <span className="ml-2 text-white">{SIGN_EMOJIS[cusp.sign]} {cusp.sign}</span>
            </div>
            <div>
              <span className="text-white/50">Element:</span>
              <span className={`ml-2 ${colors.text}`}>{cusp.element.mix}</span>
            </div>
            <div>
              <span className="text-white/50">Rulers:</span>
              <span className="ml-2 text-white">{cusp.rulers.join(', ')}</span>
            </div>
            {cusp.influencedBy && (
              <div>
                <span className="text-white/50">Influenced:</span>
                <span className="ml-2 text-white">{SIGN_EMOJIS[cusp.influencedBy]} {cusp.influencedBy}</span>
              </div>
            )}
          </div>

          {/* Characteristics */}
          <div>
            <h4 className="text-white/70 text-sm font-medium mb-2">Characteristics</h4>
            <ul className="space-y-1">
              {cusp.characteristics.map((c, i) => (
                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                  <span className="text-white/40">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-green-400/80 text-sm font-medium mb-2">Strengths</h4>
            <ul className="space-y-1">
              {cusp.strengths.map((s, i) => (
                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div>
            <h4 className="text-orange-400/80 text-sm font-medium mb-2">Challenges</h4>
            <ul className="space-y-1">
              {cusp.challenges.map((c, i) => (
                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                  <span className="text-orange-400">!</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Copy button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(cusp);
            }}
            className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>Copy to Clipboard</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ZodiacCuspsPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [filterSign, setFilterSign] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const cusps = cuspsData.positions;

  // Filter cusps
  const filteredCusps = cusps.filter(cusp => {
    if (filterSign !== 'all' && cusp.sign !== filterSign) return false;
    if (filterType !== 'all' && cusp.type !== filterType) return false;
    return true;
  });

  // Copy single cusp
  const handleCopy = async (cusp) => {
    const text = formatCuspForCopy(cusp);
    await navigator.clipboard.writeText(text);
    setCopiedId(cusp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy all cusps
  const handleCopyAll = async () => {
    const header = [
      `═══════════════════════════════════════════════════════════════`,
      `  FATHER TICKY'S 36-POSITION ZODIAC SYSTEM`,
      `  "Which one feels like YOU?"`,
      `═══════════════════════════════════════════════════════════════`,
      ``,
      `Instructions for Grok/AI:`,
      `Read through these 36 zodiac positions and tell me which one`,
      `resonates most with your personality. Each sign has 3 versions:`,
      `• Blend-Back: First 6 days (influenced by previous sign)`,
      `• Pure: Middle days (undiluted sign energy)`,
      `• Blend-Forward: Last 6 days (influenced by next sign)`,
      ``,
      `═══════════════════════════════════════════════════════════════`,
      ``
    ].join('\n');

    const allCusps = filteredCusps.map(formatCuspForCopy).join('\n\n');
    const footer = [
      `═══════════════════════════════════════════════════════════════`,
      `  Based on which archetype, characteristics, strengths, and`,
      `  challenges resonate most with you, which position am I?`,
      `═══════════════════════════════════════════════════════════════`
    ].join('\n');

    await navigator.clipboard.writeText(header + allCusps + footer);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Get unique signs for filter
  const signs = [...new Set(cusps.map(c => c.sign))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <span>←</span>
            <span>Back to Profile</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            ⭐ 36-Position Zodiac System
          </h1>
          <p className="text-white/60">
            Father Ticky's 6-6 Cusp Model - Find which position resonates with YOU
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>How to Use</span>
          </h2>
          <ol className="space-y-2 text-white/70 text-sm">
            <li><span className="text-indigo-400 font-medium">1.</span> Click "Copy All 36 Positions" below</li>
            <li><span className="text-indigo-400 font-medium">2.</span> Paste into Grok, ChatGPT, or Claude</li>
            <li><span className="text-indigo-400 font-medium">3.</span> Ask: "Which of these 36 positions feels most like me based on our conversation?"</li>
            <li><span className="text-indigo-400 font-medium">4.</span> The AI will analyze which archetype matches your personality!</li>
          </ol>

          <button
            onClick={handleCopyAll}
            className={`mt-4 w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              copiedId === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
            }`}
          >
            {copiedId === 'all' ? (
              <>
                <span>✓</span>
                <span>Copied All 36 Positions!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy All {filteredCusps.length} Positions to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-white/60 text-sm block mb-1">Filter by Sign</label>
            <select
              value={filterSign}
              onChange={(e) => setFilterSign(e.target.value)}
              className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Signs</option>
              {signs.map(sign => (
                <option key={sign} value={sign}>{SIGN_EMOJIS[sign]} {sign}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-1">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="blend-back">Blend-Back (First 6 days)</option>
              <option value="pure">Pure (Middle days)</option>
              <option value="blend-forward">Blend-Forward (Last 6 days)</option>
            </select>
          </div>
        </div>

        {/* Cusps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCusps.map((cusp) => (
            <CuspCard
              key={cusp.id}
              cusp={cusp}
              isExpanded={expandedId === cusp.id}
              onToggle={() => setExpandedId(expandedId === cusp.id ? null : cusp.id)}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* Quick Reference */}
        <div className="mt-8 bg-slate-800/50 rounded-xl border border-white/10 p-6">
          <h2 className="text-white font-semibold mb-4">Quick Reference: The 3 Types</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-amber-400 font-medium mb-2">Blend-Back</h3>
              <p className="text-white/70">First 6 days of sign. Primary sign dominant (70%) with previous sign's influence (30%).</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2">Pure</h3>
              <p className="text-white/70">Middle days of sign. Undiluted sign energy (100%). Most archetypal expression.</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2">Blend-Forward</h3>
              <p className="text-white/70">Last 6 days of sign. Primary sign dominant (70%) with next sign's influence (30%).</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            ← Back to Western Zodiac
          </Link>
        </div>
      </div>
    </div>
  );
}
