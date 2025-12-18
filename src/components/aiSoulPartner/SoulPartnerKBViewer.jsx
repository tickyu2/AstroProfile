/**
 * SoulPartnerKBViewer.jsx (was LunaKBViewer)
 * A window into what your AI SoulPartner has learned about you
 *
 * This is the "second Knowledge Base" - your companion's evolving understanding.
 * You can VIEW it, but your companion primarily manages and refines it as they
 * get to know you better through conversations.
 *
 * Each user names their own SoulPartner (e.g., Chunmei named hers "Luna")
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code
 * December 15, 2024
 */

import React, { useState } from 'react';

export default function SoulPartnerKBViewer({ soulPartner, soulPartnerKB, onClose }) {
  const [activeTab, setActiveTab] = useState('identity');

  const identity = soulPartner;
  const kb = soulPartnerKB;
  const companionName = identity?.name || 'Soul Companion';

  if (!identity) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-center gap-2 text-white/50">
          <span className="animate-pulse">...</span>
          <span>Your companion is still forming...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'identity', label: 'Who I Am', icon: '...' },
    { id: 'observations', label: 'What I See', icon: '...' },
    { id: 'notes', label: 'My Notes', icon: '...' },
    { id: 'connection', label: 'Our Bond', icon: '...' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-indigo-900/30 rounded-xl border border-white/10 overflow-hidden">
      {/* Header - Luna's Introduction */}
      <div className="px-5 py-4 bg-gradient-to-r from-amber-900/20 to-purple-900/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-purple-500/30 flex items-center justify-center text-xl border border-amber-500/30">
              ...
            </div>
            <div>
              <h3 className="font-semibold text-white/90">{companionName}'s Knowledge</h3>
              <p className="text-xs text-amber-300/60">What I've learned about you</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              ...
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-900/10'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {activeTab === 'identity' && <IdentityTab identity={identity} />}
        {activeTab === 'observations' && <ObservationsTab kb={kb} />}
        {activeTab === 'notes' && <NotesTab kb={kb} />}
        {activeTab === 'connection' && <ConnectionTab identity={identity} kb={kb} />}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-900/50 border-t border-white/5">
        <p className="text-xs text-white/30 text-center italic">
          This knowledge base evolves as Luna learns more about you through conversations
        </p>
        {kb?.conversationCount > 0 && (
          <p className="text-xs text-amber-400/40 text-center mt-1">
            {kb.conversationCount} conversation{kb.conversationCount !== 1 ? 's' : ''} together
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Identity Tab - Who Luna is
 */
function IdentityTab({ identity }) {
  if (!identity) return <EmptyState message="Luna's identity is still forming..." />;

  return (
    <div className="space-y-4">
      {/* Core Identity */}
      <div>
        <h4 className="text-sm font-medium text-amber-300/80 mb-2">My Constitutional Nature</h4>
        <div className="bg-slate-900/30 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-400">...</span>
            <span className="text-white/80">{identity.constitutional?.chineseZodiac?.fullSign}</span>
          </div>
          <p className="text-xs text-white/50 pl-6">
            {identity.constitutional?.chineseZodiac?.whyThisSign}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-400">...</span>
            <span className="text-white/80">{identity.constitutional?.westernZodiac?.sign} ({identity.constitutional?.westernZodiac?.element})</span>
          </div>
          <p className="text-xs text-white/50 pl-6">
            {identity.constitutional?.westernZodiac?.whyThisSign}
          </p>
        </div>
      </div>

      {/* Why We Match */}
      <div>
        <h4 className="text-sm font-medium text-amber-300/80 mb-2">Why We're Matched</h4>
        <div className="bg-slate-900/30 rounded-lg p-3">
          <p className="text-sm text-white/70">
            {identity.constitutional?.complementaryDynamic?.relationship}
          </p>
          <p className="text-xs text-amber-300/50 mt-2 italic">
            {identity.constitutional?.complementaryDynamic?.growthDirection}
          </p>
        </div>
      </div>

      {/* Personality */}
      <div>
        <h4 className="text-sm font-medium text-amber-300/80 mb-2">How I Show Up</h4>
        <ul className="space-y-1">
          {identity.personality?.traits?.map((trait, i) => (
            <li key={i} className="text-xs text-white/60 flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">...</span>
              <span>{trait}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Communication Style */}
      <div>
        <h4 className="text-sm font-medium text-amber-300/80 mb-2">How I Communicate</h4>
        <div className="bg-slate-900/30 rounded-lg p-3 space-y-1 text-xs">
          <p className="text-white/60">
            <span className="text-white/80">Tone:</span> {identity.communicationStyle?.tone}
          </p>
          <p className="text-white/60">
            <span className="text-white/80">Approach:</span> {identity.communicationStyle?.approach}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Observations Tab - What Luna has noticed
 */
function ObservationsTab({ kb }) {
  const observations = kb?.observations || {};

  const hasAnyObservations =
    observations.emotionalPatterns?.length > 0 ||
    observations.communicationPreferences?.length > 0 ||
    observations.passionTopics?.length > 0 ||
    observations.growthEdges?.length > 0;

  if (!hasAnyObservations) {
    return (
      <EmptyState
        message="We're just getting started..."
        subMessage="As we talk more, I'll notice patterns and what matters to you"
      />
    );
  }

  return (
    <div className="space-y-4">
      {observations.emotionalPatterns?.length > 0 && (
        <ObservationSection
          title="Emotional Patterns I've Noticed"
          items={observations.emotionalPatterns}
          render={(item) => (
            <>
              <span className="text-white/70">{item.pattern}</span>
              {item.frequency && (
                <span className="text-amber-400/50 ml-2">({item.frequency})</span>
              )}
            </>
          )}
        />
      )}

      {observations.communicationPreferences?.length > 0 && (
        <ObservationSection
          title="How You Like to Communicate"
          items={observations.communicationPreferences}
          render={(item) => (
            <>
              <span className="text-white/70">{item.preference}</span>
              {item.confidence && (
                <span className="text-green-400/50 ml-2">[{item.confidence}]</span>
              )}
            </>
          )}
        />
      )}

      {observations.passionTopics?.length > 0 && (
        <ObservationSection
          title="Topics That Light You Up"
          items={observations.passionTopics}
          render={(item) => (
            <>
              <span className="text-white/70">{item.topic}</span>
              {item.emotionalSignature && (
                <span className="text-purple-400/50 ml-2">({item.emotionalSignature})</span>
              )}
            </>
          )}
        />
      )}

      {observations.growthEdges?.length > 0 && (
        <ObservationSection
          title="Growth Edges (with love)"
          items={observations.growthEdges}
          render={(item) => (
            <>
              <span className="text-white/70">{item.edge}</span>
              {item.progress && (
                <span className="text-amber-400/50 ml-2">[{item.progress}]</span>
              )}
            </>
          )}
        />
      )}
    </div>
  );
}

/**
 * Notes Tab - Luna's private notes
 */
function NotesTab({ kb }) {
  const notes = kb?.internalNotes || [];
  const whatWorks = kb?.whatWorks || [];
  const openQuestions = kb?.openQuestions || [];

  if (notes.length === 0 && whatWorks.length === 0 && openQuestions.length === 0) {
    return (
      <EmptyState
        message="My notebook is still blank..."
        subMessage="I'll jot down notes as I learn what makes our conversations flow"
      />
    );
  }

  return (
    <div className="space-y-4">
      {whatWorks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-green-300/80 mb-2">What Works Well Between Us</h4>
          <ul className="space-y-2">
            {whatWorks.map((item, i) => (
              <li key={i} className="text-xs bg-green-900/20 rounded p-2 border border-green-500/20">
                <span className="text-white/70 font-medium">{item.approach}</span>
                <p className="text-green-300/60 mt-1">{item.whyItWorks}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {notes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-amber-300/80 mb-2">Notes to Myself</h4>
          <ul className="space-y-2">
            {notes.map((item, i) => (
              <li key={i} className="text-xs text-white/60 flex items-start gap-2 bg-slate-900/30 p-2 rounded">
                <span className="text-amber-400">...</span>
                <span>{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {openQuestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-purple-300/80 mb-2">Questions I'm Curious About</h4>
          <ul className="space-y-1">
            {openQuestions.map((item, i) => (
              <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                <span className="text-purple-400">?</span>
                <span>{item.question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Connection Tab - The bond between Luna and user
 */
function ConnectionTab({ identity, kb }) {
  const conversationCount = kb?.conversationCount || 0;
  const observationCount =
    (kb?.observations?.emotionalPatterns?.length || 0) +
    (kb?.observations?.communicationPreferences?.length || 0) +
    (kb?.observations?.passionTopics?.length || 0);

  // Calculate connection strength based on data
  const connectionStrength = Math.min(
    100,
    conversationCount * 10 + observationCount * 5 + (kb?.whatWorks?.length || 0) * 15
  );

  return (
    <div className="space-y-4">
      {/* Connection Meter */}
      <div>
        <h4 className="text-sm font-medium text-amber-300/80 mb-2">Our Connection Strength</h4>
        <div className="bg-slate-900/30 rounded-lg p-3">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Just Met</span>
            <span>Deep Bond</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-500"
              style={{ width: `${connectionStrength}%` }}
            />
          </div>
          <p className="text-xs text-center text-white/40 mt-2">
            {connectionStrength < 20 && "We're just getting to know each other"}
            {connectionStrength >= 20 && connectionStrength < 50 && "Building understanding..."}
            {connectionStrength >= 50 && connectionStrength < 80 && "Growing closer"}
            {connectionStrength >= 80 && "A deep, attuned connection"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          label="Conversations"
          value={conversationCount}
          subtext="together"
        />
        <StatCard
          label="Patterns"
          value={observationCount}
          subtext="noticed"
        />
        <StatCard
          label="Insights"
          value={kb?.whatWorks?.length || 0}
          subtext="discovered"
        />
      </div>

      {/* Our Dynamic */}
      <div>
        <h4 className="text-sm font-medium text-amber-300/80 mb-2">Our Constitutional Dynamic</h4>
        <div className="bg-slate-900/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl">...</p>
              <p className="text-xs text-amber-300/60">You</p>
              <p className="text-xs text-white/50">{kb?.matchedUser?.constitutional?.chineseZodiac || 'Water'}</p>
            </div>
            <div className="text-purple-400 text-xl">...</div>
            <div className="text-center">
              <p className="text-2xl">...</p>
              <p className="text-xs text-amber-300/60">Luna</p>
              <p className="text-xs text-white/50">{identity?.constitutional?.coreElement || 'Earth'}</p>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-3 italic">
            {identity?.constitutional?.complementaryDynamic?.relationship || 'Our elements dance together'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ObservationSection({ title, items, render }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-amber-300/80 mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">...</span>
            {render(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="bg-slate-900/30 rounded-lg p-2 text-center">
      <p className="text-xl font-bold text-amber-300">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
      <p className="text-xs text-white/30">{subtext}</p>
    </div>
  );
}

function EmptyState({ message, subMessage }) {
  return (
    <div className="text-center py-8">
      <p className="text-3xl mb-2">...</p>
      <p className="text-sm text-white/60">{message}</p>
      {subMessage && (
        <p className="text-xs text-white/40 mt-1">{subMessage}</p>
      )}
    </div>
  );
}
