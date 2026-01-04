/**
 * CCLR Home Page
 *
 * Lists all CCLR sessions for the current user.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSessions, getAngelCouple } from '../../services/cclr';

function SessionCard({ session, onClick }) {
  const primaryAngel = session.consultedAngels?.[0];
  const couple = primaryAngel ? getAngelCouple(primaryAngel.coupleId) : null;

  const lastActive = session.lastActive?.toDate?.();
  const timeAgo = lastActive ? getTimeAgo(lastActive) : 'Never';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-800/50 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-purple-500/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* Partner avatars */}
        <div className="flex -space-x-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-500/30 border-2 border-blue-500 flex items-center justify-center text-lg">
            💙
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/30 border-2 border-green-500 flex items-center justify-center text-lg">
            💚
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors truncate">
            {session.relationshipName || `${session.participants?.partnerA?.name} & ${session.participants?.partnerB?.name}`}
          </h3>

          <p className="text-slate-400 text-sm mt-1">
            {session.relationshipType} · {session.relationshipDuration}
          </p>

          {/* Angel guide */}
          {couple && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                <div
                  className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-xs"
                  style={{ backgroundColor: couple.angel1.color + '40' }}
                >
                  {couple.angel1.icon?.[0] || '💜'}
                </div>
                <div
                  className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-xs"
                  style={{ backgroundColor: couple.angel2.color + '40' }}
                >
                  {couple.angel2.icon?.[0] || '💖'}
                </div>
              </div>
              <span className="text-slate-400 text-xs">
                Guided by {couple.shortName}
              </span>
            </div>
          )}
        </div>

        {/* Status & time */}
        <div className="text-right flex-shrink-0">
          <div className={`px-2 py-1 rounded text-xs ${
            session.status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-600/50 text-slate-400'
          }`}>
            {session.status === 'active' ? 'Active' : session.status}
          </div>
          <div className="text-slate-500 text-xs mt-2">
            {timeAgo}
          </div>
        </div>
      </div>

      {/* Progress preview */}
      {session.progressTracking?.initialAssessment && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700/50">
          {[
            { label: 'Love', value: session.progressTracking.initialAssessment.loveLevel, color: 'purple' },
            { label: 'Compassion', value: session.progressTracking.initialAssessment.compassionLevel, color: 'pink' },
            { label: 'Connection', value: session.progressTracking.initialAssessment.connectionLevel, color: 'blue' }
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{label}</span>
                <span className={`text-${color}-400`}>{value}/10</span>
              </div>
              <div className="h-1 bg-slate-700 rounded-full">
                <div
                  className={`h-full rounded-full bg-${color}-500`}
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function CCLRHomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSessions() {
      if (!currentUser) return;

      setLoading(true);
      try {
        const result = await getUserSessions(currentUser.uid);
        if (result.success) {
          setSessions(result.sessions);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Couples Cosmic Love Rejuvenation
          </h1>
          <p className="text-slate-400 mt-2">
            Guided by history's greatest love stories
          </p>
        </div>

        {/* Create New Session */}
        <button
          onClick={() => navigate('/cclr/new')}
          className="w-full mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ✨
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                Begin New Journey
              </h3>
              <p className="text-slate-400 text-sm">
                Start a new rejuvenation session with your partner
              </p>
            </div>
            <svg className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading your sessions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-xl font-semibold text-white mb-2">No Sessions Yet</h2>
            <p className="text-slate-400 mb-6">
              Start your first session to begin your cosmic love journey
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-300 mb-4">
              Your Sessions ({sessions.length})
            </h2>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => navigate(`/cclr/session/${session.id}`)}
              />
            ))}
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            {
              icon: '👑',
              title: '4 Legendary Couples',
              description: 'Reagan, Obama, Cash, Cleopatra & Antony'
            },
            {
              icon: '💬',
              title: '4-Bubble Chat',
              description: 'Both partners + both angels in one conversation'
            },
            {
              icon: '📊',
              title: 'Progress Tracking',
              description: 'Watch love, compassion & connection grow'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-medium text-sm">{feature.title}</h3>
              <p className="text-slate-400 text-xs mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
