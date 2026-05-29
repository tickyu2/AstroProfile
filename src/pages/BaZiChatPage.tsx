/**
 * BaZi AI Chat Page
 *
 * Chart-aware conversational AI grounded in the user's BaZi data.
 * Top: profile selector + chart summary bar
 * Middle: question suggestion panel (6 domains)
 * Bottom: chat messages + input
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import { STEM_SEGMENTS, BRANCH_SEGMENTS } from '../utils/baziWheels';
import { detectShenSha, type ShenShaResult, type FourPillarsInput } from '../utils/shensha/shenshaEngine';
import { generateChartAwareQuestions, type DomainId } from '../components/bazi-chat/questionGenerator';
import { buildBaZiChatSystemPrompt } from '../utils/buildBaZiChatContext';
import { sendBaZiChatMessage, loadBaZiChatHistory, type ChatMessage } from '../services/baziChatService';
import BaZiChartSummaryBar from '../components/bazi-chat/BaZiChartSummaryBar';
import QuestionSuggestionPanel from '../components/bazi-chat/QuestionSuggestionPanel';
import BaZiChatMessageList from '../components/bazi-chat/BaZiChatMessageList';
import BaZiChatInput from '../components/bazi-chat/BaZiChatInput';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert calculateBaZi() chart → FourPillarsInput for detectShenSha() */
function chartToShenshaInput(chart: any): FourPillarsInput | null {
  if (!chart?.pillars || chart.pillars.length < 4) return null;
  const stem = (i: number) => STEM_SEGMENTS[chart.pillars[i]?.stem?.index ?? 0]?.char || '';
  const branch = (i: number) => BRANCH_SEGMENTS[chart.pillars[i]?.branch?.index ?? 0]?.char || '';
  return {
    yearStem: stem(0), yearBranch: branch(0),
    monthStem: stem(1), monthBranch: branch(1),
    dayStem: stem(2), dayBranch: branch(2),
    hourStem: stem(3), hourBranch: branch(3),
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function BaZiChatPage() {
  const { profiles, loading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [chart, setChart] = useState<any>(null);
  const [shensha, setShensha] = useState<ShenShaResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null);
  const [aiResponding, setAiResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Profile selection ----
  const selectedProfile = useMemo(() => {
    return profiles?.find((p: any) => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // No auto-select — user must pick a profile (consistent with BaZi Learning)

  // ---- Calculate BaZi + detect Shen Sha ----
  useEffect(() => {
    if (!selectedProfile?.birthDate) { setChart(null); setShensha(null); return; }
    try {
      const [year, month, day] = selectedProfile.birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
      const result: any = calculateBaZi({ year, month, day, hour, minute });
      if (!result.error) {
        setChart(result);
        const input = chartToShenshaInput(result);
        setShensha(input ? detectShenSha(input) : null);
      }
    } catch (err) {
      console.error('BaZi calculation error:', err);
    }
  }, [selectedProfile]);

  // Clear messages when profile changes
  useEffect(() => {
    setMessages([]);
    setActiveDomain(null);
    setError(null);
  }, [selectedProfileId]);

  // ---- Generate chart-aware questions ----
  const domainQuestions = useMemo(() => {
    if (!chart || !shensha) return [];
    const name = selectedProfile?.displayName || selectedProfile?.firstName || 'User';
    return generateChartAwareQuestions(chart, shensha, name);
  }, [chart, shensha, selectedProfile]);

  // ---- Build system context ----
  const systemContext = useMemo(() => {
    if (!chart || !shensha) return '';
    return buildBaZiChatSystemPrompt({
      chart,
      shensha,
      profileName: selectedProfile?.displayName || selectedProfile?.firstName || 'User',
      gender: selectedProfile?.gender,
      birthDate: selectedProfile?.birthDate,
      birthTime: selectedProfile?.birthTime,
      domain: activeDomain || undefined,
    });
  }, [chart, shensha, selectedProfile, activeDomain]);

  // ---- Send message ----
  const handleSend = useCallback(async (message: string) => {
    if (!selectedProfileId || !systemContext || aiResponding) return;

    const userMsg: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setAiResponding(true);
    setError(null);

    try {
      const result = await sendBaZiChatMessage({
        profileId: selectedProfileId,
        message,
        conversationHistory: messages,
        systemContext,
        domain: activeDomain || 'general',
      });

      const assistantMsg: ChatMessage = { role: 'assistant', content: result.response, domain: activeDomain || 'general' };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('BaZi chat error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setAiResponding(false);
    }
  }, [selectedProfileId, systemContext, messages, activeDomain, aiResponding]);

  // ---- Question click ----
  const handleQuestionSelect = useCallback((question: string, domain: DomainId) => {
    setActiveDomain(domain);
    handleSend(question);
  }, [handleSend]);

  // ---- New topic ----
  const handleNewTopic = useCallback(() => {
    setMessages([]);
    setActiveDomain(null);
    setError(null);
  }, []);

  // ---- Loading state ----
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0' }}>
        Loading profiles...
      </div>
    );
  }

  const profileName = selectedProfile?.displayName || selectedProfile?.firstName || 'Select a profile';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a1628, #0f2847, #0a1628)',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: Profile selector + Dashboard + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedProfileId || ''}
            onChange={e => setSelectedProfileId(e.target.value || null)}
            aria-label="Select profile"
            title="Select a profile to view their BaZi chart"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#e2e8f0',
              fontSize: '13px',
              cursor: 'pointer',
              minWidth: '180px',
            }}
          >
            <option value="">-- Select a Profile --</option>
            {profiles?.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.displayName || p.name || p.firstName || 'Unnamed'}
              </option>
            ))}
          </select>
          <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
            ← Dashboard
          </Link>
          <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#facc15', margin: 0 }}>
            BaZi AI Chat
          </h1>
        </div>

        {/* Right: Nav buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/bazi-learning" style={{
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textDecoration: 'none',
          }}>
            BaZi Learning
          </Link>
          <Link to="/bazi-modular" style={{
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            textDecoration: 'none',
          }}>
            BaZi Modular
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div style={{
        flex: 1,
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {/* Profile detail line */}
        {selectedProfile && (
          <div style={{
            textAlign: 'center',
            fontSize: '11px',
            padding: '6px 12px',
            background: 'rgba(15, 23, 42, 0.92)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: '#e0d4ff', fontWeight: 700, fontSize: '12px' }}>
              {selectedProfile.displayName || selectedProfile.fullName || `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim() || selectedProfile.name || 'Unknown'}
            </span>
            {selectedProfile.birthDate && (
              <span style={{ color: '#e2e8f0' }}>{' '}&middot; {selectedProfile.birthDate}{selectedProfile.birthTime ? ` ${selectedProfile.birthTime}` : ''}</span>
            )}
            {selectedProfile.location?.fullAddress && (
              <span style={{ color: '#e2e8f0' }}>{' '}&middot; {selectedProfile.location.fullAddress}</span>
            )}
            {selectedProfile.location?.coordinates?.lat != null && selectedProfile.location?.coordinates?.lng != null && (
              <span style={{ color: '#a5b4c8' }}>
                {' '}({selectedProfile.location.coordinates.lat.toFixed(4)}, {selectedProfile.location.coordinates.lng.toFixed(4)})
              </span>
            )}
          </div>
        )}

        {/* Chart Summary Bar */}
        {chart && (
          <BaZiChartSummaryBar
            profileName={profileName}
            chart={chart}
            shensha={shensha}
          />
        )}

        {/* Question Suggestions — only show when no active conversation */}
        {messages.length === 0 && domainQuestions.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
              Choose a topic or ask anything about your chart
            </div>
            <QuestionSuggestionPanel
              domains={domainQuestions}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div style={{
            flex: 1,
            minHeight: '300px',
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <BaZiChatMessageList
              messages={messages}
              isLoading={aiResponding}
            />
          </div>
        )}

        {/* Error display */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#f87171',
            fontSize: '11px',
          }}>
            {error}
          </div>
        )}

        {/* Chat Input — show when chart is loaded */}
        {chart && (
          <BaZiChatInput
            activeDomain={activeDomain}
            onSend={handleSend}
            onNewTopic={handleNewTopic}
            disabled={aiResponding || !selectedProfileId}
            hasMessages={messages.length > 0}
          />
        )}

        {/* No profile message */}
        {!chart && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎋</div>
            <div style={{ fontSize: '14px' }}>Select a profile with birth data to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
}
