/**
 * SessionDashboard - CCLR Progress Tracking Dashboard
 *
 * Displays:
 * - Love/Compassion/Connection levels over time
 * - Session statistics
 * - Partner participation
 * - Angel wisdom highlights
 */

import React, { useState } from 'react';
import { getAngelCouple, recordProgressUpdate } from '../../services/cclr';

function ProgressMeter({ label, value, color, icon }) {
  const colorClasses = {
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300 text-sm flex items-center gap-2">
          <span>{icon}</span>
          {label}
        </span>
        <span className={`text-${color}-400 font-semibold`}>{value}/10</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ProgressHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-4">
        No progress history yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {history.slice(-5).reverse().map((entry, idx) => {
        const date = entry.recordedAt?.toDate?.();
        return (
          <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-xs">
                {date ? date.toLocaleDateString() : 'Unknown date'}
              </span>
              <div className="flex gap-2 text-xs">
                <span className="text-purple-400">L:{entry.loveLevel}</span>
                <span className="text-pink-400">C:{entry.compassionLevel}</span>
                <span className="text-blue-400">X:{entry.connectionLevel}</span>
              </div>
            </div>
            {entry.notes && (
              <p className="text-slate-300 text-sm">{entry.notes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SessionDashboard({ session }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    loveLevel: 5,
    compassionLevel: 5,
    connectionLevel: 5,
    notes: ''
  });

  const currentAssessment = session?.progressTracking?.currentAssessment;
  const initialAssessment = session?.progressTracking?.initialAssessment;
  const assessmentHistory = session?.progressTracking?.assessmentHistory || [];

  // Calculate progress from initial
  const calculateChange = (current, initial) => {
    if (!current || !initial) return 0;
    return current - initial;
  };

  const loveChange = calculateChange(
    currentAssessment?.loveLevel,
    initialAssessment?.loveLevel
  );
  const compassionChange = calculateChange(
    currentAssessment?.compassionLevel,
    initialAssessment?.compassionLevel
  );
  const connectionChange = calculateChange(
    currentAssessment?.connectionLevel,
    initialAssessment?.connectionLevel
  );

  // Get consulted angels
  const consultedAngels = session?.consultedAngels || [];

  // Handle progress update
  const handleProgressUpdate = async () => {
    setUpdating(true);
    try {
      await recordProgressUpdate(session.sessionId, newAssessment);
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Journey Progress
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {session?.relationshipName || 'Your Session'}
        </p>
      </div>

      {/* Current Levels */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-medium mb-4">Current Levels</h3>

        <ProgressMeter
          label="Love"
          value={currentAssessment?.loveLevel || 5}
          color="purple"
          icon="💜"
        />
        <ProgressMeter
          label="Compassion"
          value={currentAssessment?.compassionLevel || 5}
          color="pink"
          icon="💗"
        />
        <ProgressMeter
          label="Connection"
          value={currentAssessment?.connectionLevel || 5}
          color="blue"
          icon="💙"
        />

        <button
          onClick={() => setShowUpdateModal(true)}
          className="w-full mt-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
        >
          Record Progress Update
        </button>
      </div>

      {/* Progress Since Start */}
      {initialAssessment && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-medium mb-4">Growth Since Start</h3>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <div className={`text-2xl font-bold ${loveChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {loveChange > 0 ? '+' : ''}{loveChange}
              </div>
              <div className="text-slate-400 text-xs mt-1">Love</div>
            </div>
            <div className="p-3 bg-pink-500/10 rounded-lg">
              <div className={`text-2xl font-bold ${compassionChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {compassionChange > 0 ? '+' : ''}{compassionChange}
              </div>
              <div className="text-slate-400 text-xs mt-1">Compassion</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className={`text-2xl font-bold ${connectionChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {connectionChange > 0 ? '+' : ''}{connectionChange}
              </div>
              <div className="text-slate-400 text-xs mt-1">Connection</div>
            </div>
          </div>
        </div>
      )}

      {/* Angel Guides */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-medium mb-4">Your Angel Guides</h3>

        {consultedAngels.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            No angels invited yet
          </p>
        ) : (
          <div className="space-y-3">
            {consultedAngels.map((angel) => {
              const couple = getAngelCouple(angel.coupleId);
              if (!couple) return null;

              return (
                <div
                  key={angel.coupleId}
                  className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex -space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-600"
                      style={{ backgroundColor: couple.angel1?.color + '40' }}
                    >
                      {couple.angel1?.icon?.[0] || '💜'}
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-600"
                      style={{ backgroundColor: couple.angel2?.color + '40' }}
                    >
                      {couple.angel2?.icon?.[0] || '💖'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {couple.coupleName}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {angel.conversationCount || 0} messages
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-medium mb-4">Session Statistics</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {session?.messageCount || 0}
            </div>
            <div className="text-slate-400 text-xs mt-1">Messages</div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-pink-400">
              {assessmentHistory.length + 1}
            </div>
            <div className="text-slate-400 text-xs mt-1">Check-ins</div>
          </div>
        </div>

        <div className="mt-3 text-center text-slate-400 text-xs">
          Started: {session?.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
        </div>
      </div>

      {/* Progress History */}
      {assessmentHistory.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-medium mb-4">Progress History</h3>
          <ProgressHistory history={assessmentHistory} />
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowUpdateModal(false)}
          />
          <div className="relative bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Record Progress Update
            </h3>

            <div className="space-y-4">
              {/* Love */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-slate-300">Love Level</label>
                  <span className="text-purple-400 font-semibold">
                    {newAssessment.loveLevel}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newAssessment.loveLevel}
                  onChange={(e) => setNewAssessment({
                    ...newAssessment,
                    loveLevel: parseInt(e.target.value)
                  })}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Compassion */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-slate-300">Compassion Level</label>
                  <span className="text-pink-400 font-semibold">
                    {newAssessment.compassionLevel}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newAssessment.compassionLevel}
                  onChange={(e) => setNewAssessment({
                    ...newAssessment,
                    compassionLevel: parseInt(e.target.value)
                  })}
                  className="w-full accent-pink-500"
                />
              </div>

              {/* Connection */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-slate-300">Connection Level</label>
                  <span className="text-blue-400 font-semibold">
                    {newAssessment.connectionLevel}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newAssessment.connectionLevel}
                  onChange={(e) => setNewAssessment({
                    ...newAssessment,
                    connectionLevel: parseInt(e.target.value)
                  })}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 mb-2">Notes (optional)</label>
                <textarea
                  value={newAssessment.notes}
                  onChange={(e) => setNewAssessment({
                    ...newAssessment,
                    notes: e.target.value
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white h-24 resize-none"
                  placeholder="How are things going?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProgressUpdate}
                disabled={updating}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
