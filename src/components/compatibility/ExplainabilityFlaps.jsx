// ═══════════════════════════════════════════════════════════════════════════
// EXPLAINABILITY FLAPS - L0 → L3 Progressive Disclosure
// ═══════════════════════════════════════════════════════════════════════════
// Khan Academy-style progressive depth disclosure for compatibility scores
// Stone III: Flap Cosmology - WHAT → WHY → HOW → SO WHAT
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL SELECTOR TABS
// ═══════════════════════════════════════════════════════════════════════════

export function LevelTabs({ activeLevel, onLevelChange, availableLevels = ['L0', 'L1', 'L2', 'L3'] }) {
  const levelConfig = {
    L0: { label: 'Summary', icon: '📋', color: 'emerald' },
    L1: { label: 'Guided', icon: '🧭', color: 'blue' },
    L2: { label: 'Technical', icon: '🔬', color: 'purple' },
    L3: { label: 'Debug', icon: '🔧', color: 'slate' }
  };

  return (
    <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg">
      {availableLevels.map((level) => {
        const config = levelConfig[level];
        const isActive = activeLevel === level;

        return (
          <button
            key={level}
            onClick={() => onLevelChange(level)}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium
              transition-all duration-200
              ${isActive
                ? `bg-${config.color}-500/30 text-${config.color}-300 border border-${config.color}-400/50`
                : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
          >
            <span className="mr-1">{config.icon}</span>
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// L0: POSTCARD SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

export function L0Summary({ data }) {
  if (!data) return null;

  const levelColors = {
    Exceptional: { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-100', badge: 'bg-emerald-400' },
    Strong: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-100', badge: 'bg-blue-400' },
    Moderate: { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-100', badge: 'bg-amber-400' },
    Challenging: { bg: 'from-orange-500 to-red-400', text: 'text-orange-100', badge: 'bg-orange-400' },
    Difficult: { bg: 'from-red-500 to-rose-500', text: 'text-red-100', badge: 'bg-red-400' }
  };

  const colors = levelColors[data.compatibility] || levelColors.Moderate;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl
      bg-gradient-to-br ${colors.bg}
      p-6 shadow-xl
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Score Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`
            px-4 py-1.5 rounded-full text-sm font-bold
            ${colors.badge} text-slate-900
          `}>
            {data.badge}
          </span>
          <div className="text-right">
            <div className="text-4xl font-black text-white">{data.score}%</div>
            <div className="text-xs text-white/70 uppercase tracking-wide">Compatibility</div>
          </div>
        </div>

        {/* Summary Text */}
        <p className={`text-lg font-medium ${colors.text} leading-relaxed`}>
          {data.summary}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// L1: GUIDED FACTOR BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════

export function L1Guided({ data }) {
  if (!data) return null;

  const iconMap = {
    brain: '🧠',
    leaf: '🍃',
    users: '👥',
    heart: '💜',
    star: '⭐'
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-2">{data.title}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{data.overview}</p>
      </div>

      {/* Factor Cards */}
      <div className="grid gap-4">
        {data.factors?.map((factor, idx) => (
          <FactorCard key={idx} factor={factor} iconMap={iconMap} />
        ))}
      </div>

      {/* Strengths & Growth */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-500/30">
          <h4 className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2">
            <span>✨</span> Strengths
          </h4>
          <ul className="space-y-2">
            {data.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span className="text-sm text-gray-300">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-500/30">
          <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
            <span>🌱</span> Growth Areas
          </h4>
          <ul className="space-y-2">
            {data.growthAreas?.map((g, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="text-sm text-gray-300">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cathedral Voice */}
      {data.cathedralVoice && (
        <CathedralVoiceCard voice={data.cathedralVoice} />
      )}
    </div>
  );
}

function FactorCard({ factor, iconMap }) {
  const [expanded, setExpanded] = useState(false);
  const icon = iconMap[factor.icon] || '📊';

  return (
    <div
      className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden
                 hover:border-slate-600/50 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h4 className="text-white font-bold">{factor.name}</h4>
              <span className="text-xs text-gray-500">Weight: {factor.weight}</span>
            </div>
          </div>

          {/* Score Bar */}
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${factor.score}%` }}
              />
            </div>
            <span className="text-lg font-bold text-white w-12 text-right">{factor.score}%</span>
            <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>

        {/* Expanded Description */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-sm text-gray-400">{factor.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CathedralVoiceCard({ voice }) {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-5 border border-purple-500/30">
      <h4 className="text-purple-300 font-bold text-sm mb-4 flex items-center gap-2">
        <span>🏛️</span> Cathedral Voice
      </h4>

      <div className="space-y-4">
        {/* Ground */}
        <div className="flex gap-3">
          <div className="w-1 bg-purple-500/50 rounded-full" />
          <div>
            <div className="text-xs text-purple-400 font-semibold mb-1">GROUND</div>
            <p className="text-sm text-gray-300">{voice.ground}</p>
          </div>
        </div>

        {/* Validate */}
        <div className="flex gap-3">
          <div className="w-1 bg-indigo-500/50 rounded-full" />
          <div>
            <div className="text-xs text-indigo-400 font-semibold mb-1">VALIDATE</div>
            <p className="text-sm text-gray-300">{voice.validate}</p>
          </div>
        </div>

        {/* Empower */}
        <div className="flex gap-3">
          <div className="w-1 bg-cyan-500/50 rounded-full" />
          <div>
            <div className="text-xs text-cyan-400 font-semibold mb-1">EMPOWER</div>
            <p className="text-sm text-gray-300">{voice.empower}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// L2: TECHNICAL MATH BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════

export function L2Technical({ data }) {
  if (!data) return null;

  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Master Formula */}
      <div className="bg-slate-900/80 rounded-xl p-4 border border-blue-500/30">
        <h4 className="text-blue-400 font-bold text-sm mb-3 flex items-center gap-2">
          <span>📐</span> Master Formula
        </h4>
        <div className="bg-slate-800/50 rounded-lg p-3 font-mono text-sm">
          <div className="text-cyan-300">{data.masterFormula?.plainText}</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{data.masterFormula?.description}</p>
      </div>

      {/* Coefficients */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h4 className="text-gray-300 font-bold text-sm mb-3">Coefficients Used</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Alpha (α)</div>
            <div className="text-lg font-mono text-cyan-400">{data.coefficients?.alpha}</div>
            <div className="text-xs text-gray-600">BaZi weight vs NEO</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Beta (β)</div>
            <div className="text-lg font-mono text-cyan-400">{data.coefficients?.beta}</div>
            <div className="text-xs text-gray-600">TenGods weight in BaZi</div>
          </div>
        </div>
      </div>

      {/* Expandable Math Sections */}
      <MathSection
        title="NEO PI-R Similarity"
        icon="🧠"
        data={data.neo}
        expanded={expandedSection === 'neo'}
        onToggle={() => toggleSection('neo')}
      />

      <MathSection
        title="WuXing (Five Elements)"
        icon="🍃"
        data={data.wuxing}
        expanded={expandedSection === 'wuxing'}
        onToggle={() => toggleSection('wuxing')}
      />

      <MathSection
        title="Ten Gods (十神)"
        icon="👥"
        data={data.tengods}
        expanded={expandedSection === 'tengods'}
        onToggle={() => toggleSection('tengods')}
      />

      <MathSection
        title="BaZi Modifiers"
        icon="⚖️"
        data={data.bazi}
        expanded={expandedSection === 'bazi'}
        onToggle={() => toggleSection('bazi')}
      />

      <MathSection
        title="Final Fusion"
        icon="🔮"
        data={data.fusion}
        expanded={expandedSection === 'fusion'}
        onToggle={() => toggleSection('fusion')}
      />
    </div>
  );
}

function MathSection({ title, icon, data, expanded, onToggle }) {
  if (!data) return null;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-white font-bold">{title}</span>
        </div>
        <span className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {renderMathSteps(data)}
        </div>
      )}
    </div>
  );
}

function renderMathSteps(data) {
  if (!data) return null;

  // Handle different data structures
  const steps = [];

  // Check for MathStep-like objects
  Object.entries(data).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      if (value.formula || value.label) {
        steps.push(
          <MathStepCard key={key} step={value} />
        );
      } else if (key === 'domainScores') {
        // Handle nested domain scores
        steps.push(
          <div key={key} className="space-y-2">
            <div className="text-xs text-gray-500 font-semibold">Domain Scores</div>
            {Object.entries(value).map(([domain, domainData]) => (
              <MathStepCard key={domain} step={domainData} compact />
            ))}
          </div>
        );
      } else if (key === 'dominants') {
        // Handle WuXing dominants
        steps.push(
          <div key={key} className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Dominant Elements</div>
            <div className="text-sm text-white">
              A: {value.elementA} ↔ B: {value.elementB}
            </div>
            <div className="text-xs text-cyan-400 mt-1">{value.interpretation}</div>
          </div>
        );
      }
    }
  });

  return steps;
}

function MathStepCard({ step, compact = false }) {
  if (!step || !step.label) return null;

  return (
    <div className={`bg-slate-900/50 rounded-lg ${compact ? 'p-2' : 'p-3'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>{step.label}</div>
        <div className={`font-mono font-bold text-cyan-400 ${compact ? 'text-sm' : 'text-lg'}`}>
          {typeof step.result === 'number' ? step.result.toFixed(3) : step.result}
        </div>
      </div>
      {step.formula && (
        <div className="font-mono text-xs text-gray-500 mb-1">{step.formula}</div>
      )}
      {step.substitution && (
        <div className="font-mono text-xs text-purple-400">{step.substitution}</div>
      )}
      {step.interpretation && (
        <div className="text-xs text-emerald-400 mt-1">{step.interpretation}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// L3: DEBUG DATA DUMP
// ═══════════════════════════════════════════════════════════════════════════

export function L3Debug({ data }) {
  if (!data) return null;

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header with Copy Button */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-gray-300 font-bold">Debug Output</h4>
          <div className="text-xs text-gray-500">
            Version: {data.version} | {data.timestamp}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          {copySuccess ? '✓ Copied!' : '📋 Copy JSON'}
        </button>
      </div>

      {/* Data Quality Flags */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h5 className="text-sm font-bold text-gray-300 mb-3">Data Quality</h5>
        <div className="grid grid-cols-2 gap-2">
          <QualityFlag label="Post-Seasonal" value={data.dataQuality?.hasPostSeasonal} />
          <QualityFlag label="Ten God Summary" value={data.dataQuality?.hasTenGodSummary} />
          <QualityFlag label="Favorable Elements" value={data.dataQuality?.hasFavorableElements} />
          <QualityFlag label="Interactions" value={data.dataQuality?.hasInteractions} />
        </div>
        {data.dataQuality?.missingFields?.length > 0 && (
          <div className="mt-3 p-2 bg-amber-900/20 rounded-lg border border-amber-500/30">
            <div className="text-xs text-amber-400 font-semibold mb-1">Missing Fields</div>
            <div className="text-xs text-gray-400">
              {data.dataQuality.missingFields.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Inputs */}
      <DataSection title="Inputs" data={data.inputs} />

      {/* Intermediates */}
      <DataSection title="Intermediate Calculations" data={data.intermediates} />

      {/* Outputs */}
      <DataSection title="Final Outputs" data={data.outputs} />

      {/* Raw Vectors */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h5 className="text-sm font-bold text-gray-300 mb-3">Raw Vectors</h5>
        <div className="space-y-2 font-mono text-xs">
          {Object.entries(data.vectors || {}).map(([key, arr]) => (
            <div key={key}>
              <span className="text-gray-500">{key}:</span>
              <span className="text-cyan-400 ml-2">
                [{Array.isArray(arr) ? arr.map(v => v.toFixed(3)).join(', ') : 'N/A'}]
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QualityFlag({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className={value ? 'text-emerald-400' : 'text-red-400'}>
        {value ? '✓' : '✗'}
      </span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function DataSection({ title, data }) {
  if (!data) return null;

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <h5 className="text-sm font-bold text-gray-300 mb-3">{title}</h5>
      <div className="space-y-1 font-mono text-xs">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-500">{key}</span>
            <span className="text-cyan-400">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPLAINABILITY VIEW
// ═══════════════════════════════════════════════════════════════════════════

export function ExplainabilityView({ explainData, defaultLevel = 'L0' }) {
  const [activeLevel, setActiveLevel] = useState(defaultLevel);

  if (!explainData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No explainability data available
      </div>
    );
  }

  const explanations = explainData.explanations || {};

  return (
    <div className="space-y-4">
      {/* Level Tabs */}
      <LevelTabs
        activeLevel={activeLevel}
        onLevelChange={setActiveLevel}
        availableLevels={Object.keys(explanations).filter(k => explanations[k]?.level)}
      />

      {/* Content */}
      <div className="min-h-[200px]">
        {activeLevel === 'L0' && <L0Summary data={explanations.L0} />}
        {activeLevel === 'L1' && <L1Guided data={explanations.L1} />}
        {activeLevel === 'L2' && <L2Technical data={explanations.L2} />}
        {activeLevel === 'L3' && <L3Debug data={explanations.L3} />}
      </div>
    </div>
  );
}

export default ExplainabilityView;
