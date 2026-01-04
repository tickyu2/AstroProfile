/**
 * CCLR Session Page
 *
 * Main page for an active CCLR session.
 * Combines the 4-bubble chat with the dashboard.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getSession, getAngelCouple } from '../../services/cclr';
import FourBubbleChatInterface from '../../components/cclr/FourBubbleChatInterface';
import SessionDashboard from '../../components/cclr/SessionDashboard';
import AngelInvitationModal from '../../components/cclr/AngelInvitationModal';

export default function CCLRSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeAngelCouple, setActiveAngelCouple] = useState(null);

  // Load session
  useEffect(() => {
    async function loadSession() {
      if (!sessionId) return;

      setLoading(true);
      try {
        const result = await getSession(sessionId);
        if (!result.success) {
          throw new Error(result.error);
        }

        setSession({ ...result.session, sessionId });

        // Set active angel couple
        if (result.session.consultedAngels?.length > 0) {
          setActiveAngelCouple(result.session.consultedAngels[0].coupleId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId]);

  const handleAngelInvited = (angelCouple) => {
    // Update session with new angel
    setSession(prev => ({
      ...prev,
      consultedAngels: [...(prev.consultedAngels || []), angelCouple]
    }));
    // Switch to new angel
    setActiveAngelCouple(angelCouple.coupleId);
  };

  const handleSwitchAngel = (coupleId) => {
    setActiveAngelCouple(coupleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-xl font-bold text-white mb-2">Session Not Found</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/cclr')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const currentAngelIds = session?.consultedAngels?.map(a => a.coupleId) || [];

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <button
          onClick={() => navigate('/cclr')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Sessions
        </button>

        <h1 className="text-white font-medium">
          {session?.relationshipName || 'CCLR Session'}
        </h1>

        <div className="flex items-center gap-2">
          {/* Angel Switcher */}
          {session?.consultedAngels?.length > 1 && (
            <div className="flex items-center gap-1 mr-2">
              {session.consultedAngels.map((angel) => {
                const couple = getAngelCouple(angel.coupleId);
                return (
                  <button
                    key={angel.coupleId}
                    onClick={() => handleSwitchAngel(angel.coupleId)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      activeAngelCouple === angel.coupleId
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {couple?.shortName || angel.coupleName}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className={`p-2 rounded-lg transition-colors ${
              showDashboard
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="Toggle Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        <div className={`flex-1 ${showDashboard ? 'lg:w-2/3' : 'w-full'}`}>
          <FourBubbleChatInterface
            session={session}
            activeAngelCouple={activeAngelCouple}
            onInviteAngel={() => setShowInviteModal(true)}
          />
        </div>

        {/* Dashboard Sidebar */}
        {showDashboard && (
          <div className="hidden lg:block w-1/3 border-l border-slate-700 overflow-y-auto p-4 bg-slate-900">
            <SessionDashboard session={session} />
          </div>
        )}
      </div>

      {/* Mobile Dashboard Drawer */}
      {showDashboard && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDashboard(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 overflow-y-auto p-4">
            <button
              onClick={() => setShowDashboard(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SessionDashboard session={session} />
          </div>
        </div>
      )}

      {/* Angel Invitation Modal */}
      <AngelInvitationModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        session={session}
        currentAngelIds={currentAngelIds}
        onAngelInvited={handleAngelInvited}
      />
    </div>
  );
}
