/**
 * CompatibilityAIAdmin.jsx
 * Admin Panel for Managing AI Compatibility Cache
 * 
 * Features:
 * - View cache statistics
 * - Set force regenerate flags
 * - Prefetch common pairs
 * - Monitor token usage
 * - Clear cache (careful!)
 * 
 * Built with SOUL for infrastructure control 🎛️
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getCacheStats,
  setForceRegenerate,
  setForceRegenerateAll,
  prefetchCommonPairs
} from '../services/mbtiCompatibilityAI';

export default function CompatibilityAIAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [selectedPairs, setSelectedPairs] = useState([]);

  // Common pairs to prefetch
  const commonPairs = [
    ['ISTJ', 'ENFP'], ['INTJ', 'ENFP'], ['INFJ', 'ENTP'],
    ['ISTP', 'ESFJ'], ['ISFJ', 'ESTP'], ['INFP', 'ENTJ'],
    ['INTP', 'ESFP'], ['ISFP', 'ESTJ'], ['ESTP', 'ISFJ'],
    ['ESFP', 'INTJ']
  ];

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const cacheStats = await getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  }

  async function handleForceRegenerateAll() {
    if (!confirm('This will mark ALL cached insights for regeneration. Continue?')) {
      return;
    }

    setActionInProgress('regenerateAll');
    try {
      await setForceRegenerateAll(true);
      await loadStats();
      alert('✅ All pairs marked for regeneration');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setActionInProgress(null);
  }

  async function handlePrefetchCommon() {
    if (!confirm(`Prefetch ${commonPairs.length} common pairs? This may take a few minutes.`)) {
      return;
    }

    setActionInProgress('prefetch');
    try {
      const results = await prefetchCommonPairs(commonPairs);
      alert(`✅ Prefetch complete!\n\nGenerated: ${results.generated}\nCached: ${results.cached}\nFailed: ${results.failed}`);
      await loadStats();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setActionInProgress(null);
  }

  async function handleSetSingleFlag(typeA, typeB) {
    try {
      await setForceRegenerate(typeA, typeB, true);
      alert(`✅ ${typeA}-${typeB} marked for regeneration`);
      await loadStats();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading cache stats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🎛️ AI Compatibility Cache Admin
          </h1>
          <p className="text-purple-300">
            Manage AI-generated compatibility insights and cache control
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Cache Coverage"
            value={`${stats?.coveragePercent || 0}%`}
            subtitle={`${stats?.totalCached || 0} / ${stats?.totalPossible || 256} pairs`}
            icon="📊"
            gradient="from-purple-500 to-purple-700"
          />
          
          <StatCard
            title="Token Usage"
            value={stats?.totalTokensUsed?.toLocaleString() || '0'}
            subtitle={`~$${stats?.estimatedCostUSD || '0.00'} estimated cost`}
            icon="💰"
            gradient="from-pink-500 to-pink-700"
          />
          
          <StatCard
            title="Outdated Insights"
            value={stats?.outdatedCount || 0}
            subtitle="Marked for regeneration"
            icon="🔄"
            gradient="from-orange-500 to-orange-700"
          />
        </div>

        {/* Actions */}
        <div className="bg-slate-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            🎯 Control Actions
          </h2>

          <div className="space-y-4">
            {/* Refresh Stats */}
            <ActionButton
              label="Refresh Statistics"
              description="Reload cache stats from Firebase"
              icon="🔄"
              onClick={loadStats}
              disabled={loading}
              gradient="from-blue-500 to-blue-700"
            />

            {/* Force Regenerate All */}
            <ActionButton
              label="Force Regenerate All"
              description="Mark ALL cached insights for regeneration (use when prompt changes)"
              icon="🚨"
              onClick={handleForceRegenerateAll}
              disabled={actionInProgress === 'regenerateAll'}
              loading={actionInProgress === 'regenerateAll'}
              gradient="from-orange-500 to-red-600"
              warning
            />

            {/* Prefetch Common Pairs */}
            <ActionButton
              label={`Prefetch ${commonPairs.length} Common Pairs`}
              description="Generate insights for most common type combinations"
              icon="🚀"
              onClick={handlePrefetchCommon}
              disabled={actionInProgress === 'prefetch'}
              loading={actionInProgress === 'prefetch'}
              gradient="from-purple-500 to-pink-600"
            />
          </div>
        </div>

        {/* Manual Pair Control */}
        <div className="bg-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            🎨 Manual Pair Control
          </h2>
          
          <p className="text-purple-300 mb-6">
            Select specific type pairs to mark for regeneration:
          </p>

          <ManualPairSelector onSetFlag={handleSetSingleFlag} />
        </div>

        {/* Documentation */}
        <div className="bg-slate-800 rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            📚 How It Works
          </h2>
          
          <div className="text-purple-300 space-y-4">
            <Section
              title="Intelligent Caching"
              description="First request generates from AI (~$0.025). Subsequent requests serve from cache instantly (free)."
            />
            
            <Section
              title="Force Regenerate Flag"
              description="Set forceRegenerate=true for a pair to bypass cache and generate fresh insights. Useful when prompt improves."
            />
            
            <Section
              title="Prompt Versioning"
              description="Each insight stores prompt hash. If prompt changes, cache automatically invalidates."
            />
            
            <Section
              title="Token Tracking"
              description="Every generation tracks token usage for cost monitoring and optimization."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════

function StatCard({ title, value, subtitle, icon, gradient }) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 shadow-lg`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-white text-3xl font-bold mb-1">{value}</div>
      <div className="text-white/90 font-medium mb-1">{title}</div>
      <div className="text-white/70 text-sm">{subtitle}</div>
    </motion.div>
  );
}

function ActionButton({
  label,
  description,
  icon,
  onClick,
  disabled,
  loading,
  gradient = 'from-purple-500 to-purple-700',
  warning = false
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full text-left p-6 rounded-xl
        bg-gradient-to-r ${gradient}
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-xl transition-all
        ${warning ? 'ring-2 ring-orange-400' : ''}
      `}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{loading ? '⏳' : icon}</div>
        <div className="flex-1">
          <div className="text-white font-bold text-lg mb-1">
            {loading ? 'Processing...' : label}
          </div>
          <div className="text-white/80 text-sm">
            {description}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function Section({ title, description }) {
  return (
    <div className="border-l-4 border-purple-500 pl-4">
      <div className="font-bold text-purple-200 mb-1">{title}</div>
      <div className="text-sm">{description}</div>
    </div>
  );
}

function ManualPairSelector({ onSetFlag }) {
  const [typeA, setTypeA] = useState('ISTJ');
  const [typeB, setTypeB] = useState('ENFP');

  const allTypes = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
  ];

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-purple-300 mb-2">Type A</label>
        <select
          value={typeA}
          onChange={(e) => setTypeA(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 rounded-lg"
        >
          {allTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="text-2xl text-purple-400 mb-3">+</div>

      <div className="flex-1">
        <label className="block text-purple-300 mb-2">Type B</label>
        <select
          value={typeB}
          onChange={(e) => setTypeB(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 rounded-lg"
        >
          {allTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onSetFlag(typeA, typeB)}
        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all"
      >
        Mark for Regeneration
      </button>
    </div>
  );
}
