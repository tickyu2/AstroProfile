/**
 * AngelInvitationModal - Invite Angel Couples to CCLR Session
 *
 * Displays available angel couples and allows users to invite
 * new guides to their rejuvenation session.
 */

import React, { useState } from 'react';
import {
  getAllAngelCouples,
  getAngelCouple,
  inviteAngelCouple
} from '../../services/cclr';

export default function AngelInvitationModal({
  isOpen,
  onClose,
  session,
  currentAngelIds = [],
  onAngelInvited
}) {
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState(null);

  // Get all available angel couples
  const allCouples = getAllAngelCouples();

  // Filter out already invited couples
  const availableCouples = allCouples.filter(
    couple => !currentAngelIds.includes(couple.coupleId)
  );

  const handleInvite = async () => {
    if (!selectedCouple || !session?.sessionId) return;

    setInviting(true);
    setError(null);

    try {
      const result = await inviteAngelCouple(session.sessionId, selectedCouple);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Get the couple data to pass to parent
      const couple = getAngelCouple(selectedCouple);
      onAngelInvited?.({
        coupleId: selectedCouple,
        coupleName: couple?.coupleName
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setInviting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Invite Angel Guides
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Choose legendary couples to guide your journey
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {availableCouples.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-white font-medium mb-2">
                All Angel Couples Invited
              </p>
              <p className="text-slate-400 text-sm">
                You've already invited all available angel couples to this session.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableCouples.map((couple) => (
                <button
                  key={couple.coupleId}
                  onClick={() => setSelectedCouple(couple.coupleId)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedCouple === couple.coupleId
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Couple avatars */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-slate-600"
                        style={{ backgroundColor: couple.angel1?.color + '40' }}
                      >
                        {couple.angel1?.icon?.[0] || '💜'}
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-slate-600"
                        style={{ backgroundColor: couple.angel2?.color + '40' }}
                      >
                        {couple.angel2?.icon?.[0] || '💖'}
                      </div>
                    </div>

                    {/* Couple info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">
                        {couple.coupleName}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {couple.angelWisdom}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {couple.counselingStrengths?.slice(0, 3).map((strength, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>

                      {/* Era & Duration */}
                      <p className="text-slate-500 text-xs mt-3">
                        {couple.era} • {couple.duration}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {selectedCouple === couple.coupleId && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!selectedCouple || inviting}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inviting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Inviting...
              </span>
            ) : (
              'Invite to Session'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
