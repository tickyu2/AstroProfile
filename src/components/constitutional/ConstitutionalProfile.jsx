/**
 * ConstitutionalProfile.jsx
 * Constitutional Soul Signature Display
 *
 * Beautiful visualization of the user's complete constitutional profile:
 * - Element Mandala
 * - Primary/Secondary Expression
 * - Personalized Insights
 * - Growth Recommendations
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React from 'react';
import { ELEMENT_CONFIG } from './ConstitutionalOption';

/**
 * ConstitutionalMandala - Visual representation of elemental balance
 */
function ConstitutionalMandala({ elementPercentages, primary, secondary }) {
  const elements = ['Fire', 'Wood', 'Water', 'Metal', 'Earth'];
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  // Calculate positions for pentagon layout
  const getPosition = (index, distance) => {
    const angle = (index * 72 - 90) * (Math.PI / 180); // Start from top
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  };

  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Background pentagon */}
        <polygon
          points={elements.map((_, i) => {
            const pos = getPosition(i, radius);
            return `${pos.x},${pos.y}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />

        {/* Inner pentagons for scale */}
        {[0.25, 0.5, 0.75].map((scale) => (
          <polygon
            key={scale}
            points={elements.map((_, i) => {
              const pos = getPosition(i, radius * scale);
              return `${pos.x},${pos.y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Element percentage polygon (filled) */}
        <polygon
          points={elements.map((element, i) => {
            const percentage = (elementPercentages[element] || 0) / 100;
            const pos = getPosition(i, radius * Math.max(0.1, percentage));
            return `${pos.x},${pos.y}`;
          }).join(' ')}
          fill="url(#mandalaGradient)"
          stroke="rgba(251,191,36,0.8)"
          strokeWidth="2"
          className="drop-shadow-lg"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="mandalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.3)" />
            <stop offset="100%" stopColor="rgba(234,88,12,0.3)" />
          </linearGradient>
        </defs>

        {/* Element nodes */}
        {elements.map((element, i) => {
          const pos = getPosition(i, radius + 25);
          const config = ELEMENT_CONFIG[element];
          const percentage = elementPercentages[element] || 0;
          const isPrimary = element === primary;
          const isSecondary = element === secondary;

          return (
            <g key={element}>
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isPrimary ? 24 : isSecondary ? 20 : 16}
                className={`transition-all duration-500 ${
                  isPrimary
                    ? 'fill-amber-500 stroke-amber-300'
                    : isSecondary
                      ? 'fill-amber-600/50 stroke-amber-400/50'
                      : 'fill-slate-700 stroke-slate-600'
                }`}
                strokeWidth="2"
              />

              {/* Element icon (as text) */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="text-lg"
                style={{ fontSize: isPrimary ? '20px' : '16px' }}
              >
                {config.icon}
              </text>

              {/* Percentage label */}
              <text
                x={pos.x}
                y={pos.y + (isPrimary ? 42 : 38)}
                textAnchor="middle"
                className={`text-xs font-bold ${
                  isPrimary ? 'fill-amber-400' : isSecondary ? 'fill-amber-500/70' : 'fill-white/40'
                }`}
              >
                {percentage}%
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="fill-white/60 text-xs font-medium"
        >
          Constitutional
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          className="fill-white/60 text-xs font-medium"
        >
          Balance
        </text>
      </svg>
    </div>
  );
}

/**
 * InsightCard - Individual insight display
 */
function InsightCard({ icon, title, content, variant = 'default' }) {
  const variants = {
    default: 'from-slate-800/50 to-slate-900/50 border-white/10',
    primary: 'from-amber-500/10 to-orange-500/10 border-amber-500/30',
    growth: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
    relationship: 'from-pink-500/10 to-rose-500/10 border-pink-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${variants[variant]} border rounded-xl p-5`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-bold text-white mb-1">{title}</h4>
          {typeof content === 'string' ? (
            <p className="text-sm text-white/70 leading-relaxed">{content}</p>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ConstitutionalProfile Component
 *
 * @param {Object} props
 * @param {Object} props.profile - Calculated constitutional profile
 * @param {Function} props.onContinue - Callback to continue to next step
 * @param {Function} props.onRetake - Callback to retake assessment
 */
export function ConstitutionalProfile({ profile, onContinue, onRetake }) {
  const primaryConfig = ELEMENT_CONFIG[profile.primary];
  const secondaryConfig = ELEMENT_CONFIG[profile.secondary];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-6">
            <span className="text-amber-400 font-medium">Constitutional Soul Signature</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your True Constitution
          </h1>

          {/* Primary Element Display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`text-6xl p-4 rounded-2xl bg-gradient-to-br ${primaryConfig.bgGradient}`}>
              {primaryConfig.icon}
            </div>
            <div className="text-left">
              <p className="text-white/50 text-sm">Primary Element</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${primaryConfig.gradient} text-transparent bg-clip-text`}>
                {profile.primary}
              </p>
            </div>
          </div>

          {/* Secondary Element */}
          <div className="flex items-center justify-center gap-3">
            <div className={`text-3xl p-2 rounded-xl bg-gradient-to-br ${secondaryConfig.bgGradient}`}>
              {secondaryConfig.icon}
            </div>
            <div className="text-left">
              <p className="text-white/40 text-xs">Secondary</p>
              <p className={`text-xl font-semibold ${secondaryConfig.textColor}`}>
                {profile.secondary}
              </p>
            </div>
          </div>
        </div>

        {/* Constitutional Identity */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-3 text-center">
            {profile.insights.identity}
          </h2>
          <p className="text-center text-white/60">
            This is your unique constitutional signature - how the universe shaped you
          </p>
        </div>

        {/* Elemental Balance Mandala */}
        <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">
            Elemental Balance
          </h3>
          <ConstitutionalMandala
            elementPercentages={profile.elementPercentages}
            primary={profile.primary}
            secondary={profile.secondary}
          />

          {/* Alignment Score */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full">
              <span className="text-white/50 text-sm">Birth-Expression Alignment:</span>
              <span className={`font-bold ${
                profile.alignment.score >= 80 ? 'text-green-400' :
                profile.alignment.score >= 60 ? 'text-amber-400' :
                'text-orange-400'
              }`}>
                {profile.alignment.score}%
              </span>
            </div>
            <p className="mt-2 text-sm text-white/50">
              {profile.alignment.description}
            </p>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <InsightCard
            icon="💪"
            title="Your Greatest Strength"
            content={profile.insights.strength}
            variant="primary"
          />

          <InsightCard
            icon="🌱"
            title="Growth Opportunity"
            content={profile.insights.growth}
            variant="growth"
          />

          <InsightCard
            icon="💕"
            title="Relationship Resonance"
            content={
              <div className="space-y-1">
                <p className="text-sm text-white/70">{profile.insights.relationship.natural}</p>
                <p className="text-sm text-white/50">{profile.insights.relationship.growth}</p>
              </div>
            }
            variant="relationship"
          />

          <InsightCard
            icon="🎯"
            title="Alignment Insight"
            content={profile.insights.alignment}
          />
        </div>

        {/* Source Data */}
        <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">How We Calculated This</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Birth Foundation */}
            <div>
              <h4 className="text-sm font-medium text-white/50 mb-2">
                Birth Foundation (40% weight)
              </h4>
              <div className="space-y-2">
                {profile.birthData?.chinese && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐉</span>
                    <span className="text-white/70">
                      {profile.birthData.chinese.fullSign || `${profile.birthData.chinese.element} ${profile.birthData.chinese.animal}`}
                    </span>
                  </div>
                )}
                {profile.birthData?.western && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-white/70">
                      {profile.birthData.western.sun} {profile.birthData.western.element && `(${profile.birthData.western.element})`}
                    </span>
                  </div>
                )}
                {profile.birthData?.bazi?.day_master && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎋</span>
                    <span className="text-white/70">
                      Day Master: {profile.birthData.bazi.day_master}
                    </span>
                  </div>
                )}
                <p className="text-xs text-white/40 mt-2">
                  Dominant: {profile.birthFoundation.dominant}
                </p>
              </div>
            </div>

            {/* Lived Expression */}
            <div>
              <h4 className="text-sm font-medium text-white/50 mb-2">
                Lived Expression (60% weight)
              </h4>
              <div className="space-y-1">
                {Object.entries(profile.livedExpression.scores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([element, score]) => (
                    <div key={element} className="flex items-center gap-2">
                      <span>{ELEMENT_CONFIG[element].icon}</span>
                      <span className="text-white/70">{element}</span>
                      <span className="text-white/40">× {score}</span>
                    </div>
                  ))
                }
                <p className="text-xs text-white/40 mt-2">
                  Consistency: {profile.livedExpression.consistency}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetake && (
            <button
              onClick={onRetake}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xl font-medium transition-all"
            >
              Retake Assessment
            </button>
          )}

          {onContinue && (
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-xl font-semibold hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all"
            >
              Continue to Profile ✨
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            Part of GENESIS - Constitutional Soul Intelligence System
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConstitutionalProfile;
