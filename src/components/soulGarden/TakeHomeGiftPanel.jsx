/**
 * Take-Home Gift Panel
 *
 * A beautiful Art Nouveau styled panel displaying the user's parting gift
 * from the Soul Garden Cathedral: strengths, growth areas, practices,
 * rituals, and rising sign benediction.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import React, { useState } from 'react';

/**
 * Main Take-Home Gift Panel
 * @param {Object} props
 * @param {Object} props.toolkit - The TakeHomeToolkit data
 * @param {boolean} props.loading - Whether toolkit is being generated
 */
export default function TakeHomeGiftPanel({ toolkit, loading = false }) {
  const [expandedSection, setExpandedSection] = useState(null);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-pulse">
          <div className="text-4xl mb-4">🎁</div>
          <p className="text-amber-300/60 text-sm">
            The Cathedral is weaving your parting gift...
          </p>
        </div>
      </div>
    );
  }

  if (!toolkit) {
    return (
      <div className="p-6 text-center text-white/40 text-sm">
        <div className="text-3xl mb-3">📜</div>
        <p>Your gift awaits. Complete an analysis to receive your Take-Home Soul Toolkit.</p>
      </div>
    );
  }

  const {
    strengths,
    growthAreas,
    balancePractices,
    dailyRitual,
    weeklyPractice,
    monthlyPilgrimage,
    risingPartingGift
  } = toolkit;

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 border border-amber-400/20"
         style={{ boxShadow: '0 0 40px rgba(251,191,36,0.08) inset' }}>

      {/* Header with Art Nouveau flourish */}
      <div className="text-center mb-6 relative">
        {/* Decorative lines */}
        <div className="absolute left-0 right-0 top-1/2 flex items-center justify-center pointer-events-none">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        <div className="relative inline-block px-6 py-2 bg-slate-950">
          <h2 className="text-amber-300 text-xl font-semibold tracking-wide flex items-center gap-3 justify-center">
            <span className="text-2xl">🎁</span>
            Your Take-Home Soul Gift
            <span className="text-2xl">🎁</span>
          </h2>
        </div>

        <p className="text-white/50 text-xs mt-3 max-w-md mx-auto">
          A bundle of practices and blessings to carry with you beyond the Cathedral walls.
        </p>
      </div>

      {/* Rising Sign Parting Gift - Hero Section */}
      {risingPartingGift && (
        <RisingPartingGiftCard gift={risingPartingGift} />
      )}

      {/* Strengths & Growth Areas - Two Column Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <GiftSection
          title="Strengths to Trust"
          icon="🌟"
          color="emerald"
          expanded={expandedSection === 'strengths'}
          onToggle={() => setExpandedSection(expandedSection === 'strengths' ? null : 'strengths')}
        >
          <BulletList items={strengths} color="emerald" />
        </GiftSection>

        <GiftSection
          title="Growth Areas to Hold Gently"
          icon="🌱"
          color="rose"
          expanded={expandedSection === 'growth'}
          onToggle={() => setExpandedSection(expandedSection === 'growth' ? null : 'growth')}
        >
          <BulletList items={growthAreas} color="rose" />
        </GiftSection>
      </div>

      {/* Balance Practices */}
      <GiftSection
        title="Practices for Balance"
        icon="⚖️"
        color="cyan"
        expanded={expandedSection === 'balance'}
        onToggle={() => setExpandedSection(expandedSection === 'balance' ? null : 'balance')}
      >
        <BulletList items={balancePractices} color="cyan" />
      </GiftSection>

      {/* Sacred Rhythms - Daily, Weekly, Monthly */}
      <div className="space-y-3">
        <h3 className="text-amber-300/80 text-sm font-medium text-center tracking-wider uppercase">
          Sacred Rhythms
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <RitualCard
            label="Daily Ritual"
            icon="☀️"
            frequency="Every day"
            body={dailyRitual}
            color="amber"
          />
          <RitualCard
            label="Weekly Practice"
            icon="🌙"
            frequency="Once a week"
            body={weeklyPractice}
            color="purple"
          />
          <RitualCard
            label="Monthly Pilgrimage"
            icon="🌌"
            frequency="Once a month"
            body={monthlyPilgrimage}
            color="indigo"
          />
        </div>
      </div>

      {/* Footer blessing */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs italic">
          "May these gifts accompany you on your journey, dear soul."
        </p>
        <p className="text-amber-300/40 text-xs mt-1">— The Cathedral</p>
      </div>
    </div>
  );
}

/**
 * Rising Sign Parting Gift - Hero Card
 */
function RisingPartingGiftCard({ gift }) {
  if (!gift) return null;

  const { risingSign, blessing, reminder, invitation } = gift;

  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-indigo-950/80 border border-amber-400/30 overflow-hidden">
      {/* Decorative corner vines */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-20">
        <svg viewBox="0 0 64 64" className="w-full h-full text-amber-300">
          <path d="M0,0 Q32,16 64,0" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M0,0 Q16,32 0,64" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20 rotate-180">
        <svg viewBox="0 0 64 64" className="w-full h-full text-amber-300">
          <path d="M0,0 Q32,16 64,0" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M0,0 Q16,32 0,64" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">✨</span>
        <p className="text-amber-300 text-sm font-semibold">
          Parting Gift from your {risingSign} Rising
        </p>
      </div>

      {/* Blessing */}
      <p className="text-white/90 text-sm leading-relaxed mb-4 pl-4 border-l-2 border-amber-400/30 italic">
        "{blessing}"
      </p>

      {/* Reminder & Invitation */}
      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/50">
          <p className="text-amber-300 font-semibold mb-1 flex items-center gap-1">
            <span>💫</span> Remember
          </p>
          <p className="text-white/70">{reminder}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50">
          <p className="text-amber-300 font-semibold mb-1 flex items-center gap-1">
            <span>🌿</span> Invitation
          </p>
          <p className="text-white/70">{invitation}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Expandable Gift Section
 */
function GiftSection({ title, icon, color, children, expanded = true, onToggle }) {
  const colorStyles = {
    emerald: 'border-emerald-500/20 bg-emerald-950/20',
    rose: 'border-rose-500/20 bg-rose-950/20',
    cyan: 'border-cyan-500/20 bg-cyan-950/20',
    amber: 'border-amber-500/20 bg-amber-950/20',
    purple: 'border-purple-500/20 bg-purple-950/20'
  };

  const titleColors = {
    emerald: 'text-emerald-300',
    rose: 'text-rose-300',
    cyan: 'text-cyan-300',
    amber: 'text-amber-300',
    purple: 'text-purple-300'
  };

  return (
    <div className={`rounded-xl border ${colorStyles[color] || colorStyles.amber} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <h3 className={`text-sm font-semibold flex items-center gap-2 ${titleColors[color]}`}>
          <span>{icon}</span>
          {title}
        </h3>
        <span className={`text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Bullet List
 */
function BulletList({ items, color = 'amber' }) {
  if (!items || !items.length) {
    return <p className="text-white/40 text-xs">No items yet.</p>;
  }

  const bulletColors = {
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400'
  };

  return (
    <ul className="space-y-2 text-xs text-white/80">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className={`${bulletColors[color]} mt-0.5`}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Ritual Card
 */
function RitualCard({ label, icon, frequency, body, color = 'amber' }) {
  const colorStyles = {
    amber: 'border-amber-400/20 from-amber-950/30',
    purple: 'border-purple-400/20 from-purple-950/30',
    indigo: 'border-indigo-400/20 from-indigo-950/30'
  };

  const labelColors = {
    amber: 'text-amber-300',
    purple: 'text-purple-300',
    indigo: 'text-indigo-300'
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-b ${colorStyles[color]} to-slate-950/50 border ${colorStyles[color].split(' ')[0]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <div>
          <p className={`text-xs font-semibold ${labelColors[color]}`}>{label}</p>
          <p className="text-white/40 text-[10px]">{frequency}</p>
        </div>
      </div>
      <p className="text-white/70 text-xs leading-relaxed">{body}</p>
    </div>
  );
}
