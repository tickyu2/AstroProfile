/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA MANAGEMENT CONSOLE - Conversation Analysis & Behavior Tuning
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Internal tool for analyzing Luna conversations:
 * - Browse users and their conversation logs
 * - Inspect turn snapshots (emotion, behavior, prompts, timing)
 * - View/edit global config and per-user preferences
 * - Understand "why did Luna respond like that?"
 *
 * Created: December 21, 2025
 */

import React, { useEffect, useState, useCallback } from 'react';

/**
 * Console API base URL
 */
const API_BASE = import.meta.env.VITE_CONSOLE_API_URL || 'http://localhost:8091';

/**
 * LunaConsole Component
 */
export function LunaConsole() {
  // State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [turns, setTurns] = useState([]);
  const [selectedTurn, setSelectedTurn] = useState(null);
  const [compareTurn, setCompareTurn] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [snapshotB, setSnapshotB] = useState(null);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [versions, setVersions] = useState([]);
  const [presets, setPresets] = useState([]);
  const [autoTune, setAutoTune] = useState(null);
  const [activeTab, setActiveTab] = useState('turns'); // 'turns', 'compare', 'config', 'presets', 'versions', 'autotune', 'memory', 'clusters', 'drift', 'history', 'stats'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [consolidateUserId, setConsolidateUserId] = useState('');
  // Memory, Clusters, Drift state
  const [profiles, setProfiles] = useState({});
  const [profileStats, setProfileStats] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [drift, setDrift] = useState(null);
  const [driftHistory, setDriftHistory] = useState([]);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [selectedProfileData, setSelectedProfileData] = useState(null);

  /**
   * Fetch with error handling
   */
  const fetchAPI = useCallback(async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'API error');
      return data.data;
    } catch (err) {
      console.error(`[Console] API error:`, err);
      throw err;
    }
  }, []);

  /**
   * Load users on mount
   */
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchAPI('/console/users'),
      fetchAPI('/console/config'),
      fetchAPI('/console/stats'),
      fetchAPI('/console/config/history'),
      fetchAPI('/console/versions'),
      fetchAPI('/console/presets'),
      fetchAPI('/console/autotune')
    ])
      .then(([usersData, configData, statsData, historyData, versionsData, presetsData, autoTuneData]) => {
        setUsers(usersData || []);
        setConfig(configData);
        setStats(statsData);
        setHistory(historyData || []);
        setVersions(versionsData || []);
        setPresets(presetsData || []);
        setAutoTune(autoTuneData || null);
      })
      .catch(err => {
        setError(`Failed to connect to console API. Make sure backend is running.`);
      })
      .finally(() => setLoading(false));
  }, [fetchAPI]);

  /**
   * Load turns when user changes
   */
  useEffect(() => {
    if (!selectedUser) return;

    setTurns([]);
    setSnapshot(null);
    setSnapshotB(null);
    setSelectedTurn(null);
    setCompareTurn(null);
    setLoading(true);

    fetchAPI(`/console/turns/${selectedUser}`)
      .then(data => setTurns(data?.turns || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedUser, fetchAPI]);

  /**
   * Load snapshot when turn selected
   */
  useEffect(() => {
    if (!selectedUser || selectedTurn === null) return;

    setLoading(true);

    fetchAPI(`/console/turns/${selectedUser}/${selectedTurn}`)
      .then(data => setSnapshot(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedUser, selectedTurn, fetchAPI]);

  /**
   * Load comparison snapshot when compare turn selected
   */
  useEffect(() => {
    if (!selectedUser || compareTurn === null) {
      setSnapshotB(null);
      return;
    }

    fetchAPI(`/console/turns/${selectedUser}/${compareTurn}`)
      .then(data => setSnapshotB(data))
      .catch(err => setError(err.message));
  }, [selectedUser, compareTurn, fetchAPI]);

  /**
   * Handle turn click - supports selecting two turns for comparison
   */
  const handleTurnClick = (index) => {
    if (activeTab === 'compare') {
      // In compare mode, select first then second turn
      if (selectedTurn === null) {
        setSelectedTurn(index);
        setCompareTurn(null);
      } else if (compareTurn === null && index !== selectedTurn) {
        setCompareTurn(index);
      } else {
        // Reset and start fresh
        setSelectedTurn(index);
        setCompareTurn(null);
      }
    } else {
      // Normal mode - single selection
      setSelectedTurn(index);
      setCompareTurn(null);
    }
  };

  /**
   * Update config
   */
  const updateConfig = async (updates) => {
    try {
      const res = await fetch(`${API_BASE}/console/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Save config from turn
   */
  const saveConfigFromTurn = async (applyToAll = false) => {
    if (!selectedUser || selectedTurn === null) return;

    setSaveStatus(null);

    try {
      const res = await fetch(
        `${API_BASE}/console/config/from-turn/${selectedUser}/${selectedTurn}?applyToAll=${applyToAll}`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (data.success) {
        setConfig(data.data.config);
        setSaveStatus({
          type: 'success',
          message: data.message
        });
        // Refresh history
        fetchAPI('/console/config/history')
          .then(histData => setHistory(histData || []))
          .catch(() => {});
      } else {
        setSaveStatus({
          type: 'error',
          message: data.error || 'Failed to save config'
        });
      }
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: err.message
      });
    }

    // Clear status after 4 seconds
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Load history
   */
  const loadHistory = useCallback(() => {
    fetchAPI('/console/config/history')
      .then(data => setHistory(data || []))
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Load versions
   */
  const loadVersions = useCallback(() => {
    fetchAPI('/console/versions')
      .then(data => setVersions(data || []))
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Load presets
   */
  const loadPresets = useCallback(() => {
    fetchAPI('/console/presets')
      .then(data => setPresets(data || []))
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Load auto-tune state
   */
  const loadAutoTune = useCallback(() => {
    fetchAPI('/console/autotune')
      .then(data => setAutoTune(data || null))
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Load interaction profiles
   */
  const loadProfiles = useCallback(() => {
    fetchAPI('/console/profiles')
      .then(data => {
        setProfiles(data?.profiles || {});
        setProfileStats(data?.stats || null);
      })
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Load a specific user's profile
   */
  const loadUserProfile = useCallback((userId) => {
    fetchAPI(`/console/profiles/${userId}`)
      .then(data => setSelectedProfileData(data))
      .catch(() => setSelectedProfileData(null));
  }, [fetchAPI]);

  /**
   * Load clusters
   */
  const loadClusters = useCallback(() => {
    fetchAPI('/console/clusters')
      .then(data => setClusters(data))
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Load drift
   */
  const loadDrift = useCallback(() => {
    Promise.all([
      fetchAPI('/console/drift'),
      fetchAPI('/console/drift/history')
    ])
      .then(([driftData, histData]) => {
        setDrift(driftData);
        setDriftHistory(histData?.history || []);
      })
      .catch(() => {});
  }, [fetchAPI]);

  /**
   * Reset a user's profile
   */
  const resetUserProfile = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/console/profiles/${userId}/reset`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', message: data.message });
        loadProfiles();
        if (selectedProfileUser === userId) {
          loadUserProfile(userId);
        }
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Nudge a drift dimension
   */
  const nudgeDrift = async (dimension, amount) => {
    try {
      const res = await fetch(`${API_BASE}/console/drift/nudge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimension, amount })
      });
      const data = await res.json();
      if (data.success) {
        setDrift(data.data);
        setSaveStatus({ type: 'success', message: data.message });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Reset drift
   */
  const resetDriftValues = async (dimension = null) => {
    try {
      const res = await fetch(`${API_BASE}/console/drift/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimension })
      });
      const data = await res.json();
      if (data.success) {
        setDrift(data.data);
        setSaveStatus({ type: 'success', message: data.message });
        loadDrift();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Force calculate drift
   */
  const calculateDriftNow = async () => {
    try {
      const res = await fetch(`${API_BASE}/console/drift/calculate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setDrift(data.data);
        setSaveStatus({ type: 'success', message: data.message });
        loadDrift();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Restore a config version
   */
  const restoreVersion = async (version) => {
    try {
      const res = await fetch(`${API_BASE}/console/versions/${version}/restore`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        setSaveStatus({ type: 'success', message: `Restored to v${version}` });
        loadHistory();
        loadVersions();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Apply a preset
   */
  const applyPreset = async (presetId) => {
    try {
      const res = await fetch(`${API_BASE}/console/presets/${presetId}/apply`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        setSaveStatus({ type: 'success', message: data.message });
        loadHistory();
        loadVersions();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Save current config as preset
   */
  const saveAsPreset = async () => {
    if (!newPresetName.trim()) return;

    const id = newPresetName.toLowerCase().replace(/\s+/g, '-');
    try {
      const res = await fetch(`${API_BASE}/console/presets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: newPresetName, description: newPresetDesc })
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', message: `Saved preset: ${newPresetName}` });
        setNewPresetName('');
        setNewPresetDesc('');
        loadPresets();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Delete a preset
   */
  const deletePreset = async (presetId) => {
    try {
      const res = await fetch(`${API_BASE}/console/presets/${presetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', message: `Deleted preset` });
        loadPresets();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Toggle auto-tune
   */
  const toggleAutoTune = async () => {
    const endpoint = autoTune?.enabled ? '/console/autotune/disable' : '/console/autotune/enable';
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        loadAutoTune();
        setSaveStatus({ type: 'success', message: data.message });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Send satisfaction signal
   */
  const sendSignal = async (signal, reason = null) => {
    try {
      const res = await fetch(`${API_BASE}/console/autotune/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal, reason })
      });
      const data = await res.json();
      if (data.success) {
        loadAutoTune();
      }
    } catch (err) {
      console.error('Failed to send signal:', err);
    }
  };

  /**
   * Update sensitivity
   */
  const updateSensitivity = async (sensitivity) => {
    try {
      const res = await fetch(`${API_BASE}/console/autotune/sensitivity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensitivity })
      });
      const data = await res.json();
      if (data.success) {
        loadAutoTune();
        setSaveStatus({ type: 'success', message: data.message });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Update blend factor
   */
  const updateBlendFactor = async (blendFactor) => {
    try {
      const res = await fetch(`${API_BASE}/console/autotune/blendfactor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blendFactor })
      });
      const data = await res.json();
      if (data.success) {
        loadAutoTune();
        setSaveStatus({ type: 'success', message: data.message });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Consolidate user preferences into global config
   */
  const consolidateNow = async () => {
    if (!consolidateUserId.trim()) {
      setSaveStatus({ type: 'error', message: 'Please enter a user ID' });
      setTimeout(() => setSaveStatus(null), 4000);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/console/autotune/consolidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: consolidateUserId, blendFactor: autoTune?.blendFactor })
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        setSaveStatus({ type: 'success', message: data.message });
        loadHistory();
        loadVersions();
        setConsolidateUserId('');
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  /**
   * Import config from file
   */
  const importConfig = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch(`${API_BASE}/console/config/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        setSaveStatus({ type: 'success', message: data.message });
        loadHistory();
        loadVersions();
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: `Import failed: ${err.message}` });
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  // Styles
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '200px 280px 1fr',
    height: '100vh',
    background: 'linear-gradient(135deg, #050814 0%, #0a1020 100%)',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 12
  };

  const panelStyle = {
    borderRight: '1px solid rgba(255,255,255,0.1)',
    padding: 12,
    overflowY: 'auto'
  };

  const headerStyle = {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 12,
    color: '#4ade80'
  };

  const itemStyle = (isSelected, isCompare = false) => ({
    padding: '8px 10px',
    marginBottom: 4,
    cursor: 'pointer',
    background: isSelected
      ? 'rgba(74, 222, 128, 0.15)'
      : isCompare
        ? 'rgba(139, 92, 246, 0.15)'
        : 'transparent',
    borderRadius: 6,
    border: isSelected
      ? '1px solid rgba(74, 222, 128, 0.3)'
      : isCompare
        ? '1px solid rgba(139, 92, 246, 0.3)'
        : '1px solid transparent',
    transition: 'all 0.2s ease'
  });

  const tabStyle = (isActive) => ({
    padding: '8px 16px',
    background: isActive ? 'rgba(74, 222, 128, 0.2)' : 'transparent',
    border: 'none',
    color: isActive ? '#4ade80' : 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: 12,
    borderRadius: 6
  });

  return (
    <div style={containerStyle}>
      {/* Users Panel */}
      <div style={panelStyle}>
        <div style={headerStyle}>Users</div>

        {loading && users.length === 0 && (
          <div style={{ opacity: 0.5 }}>Loading...</div>
        )}

        {error && (
          <div style={{ color: '#f87171', fontSize: 11, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {users.map(u => (
          <div
            key={u.userId}
            onClick={() => setSelectedUser(u.userId)}
            style={itemStyle(selectedUser === u.userId)}
          >
            <div style={{ fontWeight: 500 }}>{u.userId}</div>
            <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
              {u.turnCount} turns • {u.sessions} sessions
            </div>
          </div>
        ))}

        {users.length === 0 && !loading && (
          <div style={{ opacity: 0.5, fontSize: 11 }}>
            No conversation logs yet. Talk to Luna to generate logs.
          </div>
        )}
      </div>

      {/* Turns Panel */}
      <div style={panelStyle}>
        <div style={headerStyle}>
          Turns {selectedUser && <span style={{ fontWeight: 400, opacity: 0.6 }}>({selectedUser})</span>}
        </div>

        {!selectedUser && (
          <div style={{ opacity: 0.5 }}>Select a user to view turns.</div>
        )}

        {activeTab === 'compare' && (
          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 4 }}>
            Click to select Turn A (green), then Turn B (purple)
          </div>
        )}

        {turns.map((t) => (
          <div
            key={`${t.sessionId}-${t.timestamp}-${t.index}`}
            onClick={() => handleTurnClick(t.index)}
            style={itemStyle(selectedTurn === t.index, compareTurn === t.index)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {selectedTurn === t.index && <span style={{ fontSize: 9, color: '#4ade80' }}>A</span>}
                {compareTurn === t.index && <span style={{ fontSize: 9, color: '#a78bfa' }}>B</span>}
                <span style={{ opacity: 0.5 }}>{t.totalDuration}ms</span>
              </div>
            </div>
            <div style={{
              marginTop: 4,
              padding: '2px 6px',
              background: getEmotionColor(t.emotion?.primary),
              borderRadius: 4,
              display: 'inline-block',
              fontSize: 10
            }}>
              {t.emotion?.primary || 'neutral'} ({Math.round((t.emotion?.confidence || 0) * 100)}%)
            </div>
            <div style={{ marginTop: 4, opacity: 0.7, fontSize: 11 }}>
              {t.sttTranscriptPreview}...
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <div style={{ ...panelStyle, borderRight: 'none' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <button style={tabStyle(activeTab === 'turns')} onClick={() => setActiveTab('turns')}>
            Turns
          </button>
          <button style={tabStyle(activeTab === 'compare')} onClick={() => setActiveTab('compare')}>
            Compare
          </button>
          <button style={tabStyle(activeTab === 'config')} onClick={() => setActiveTab('config')}>
            Config
          </button>
          <button style={tabStyle(activeTab === 'presets')} onClick={() => { setActiveTab('presets'); loadPresets(); }}>
            Presets
          </button>
          <button style={tabStyle(activeTab === 'versions')} onClick={() => { setActiveTab('versions'); loadVersions(); }}>
            Versions
          </button>
          <button style={tabStyle(activeTab === 'autotune')} onClick={() => { setActiveTab('autotune'); loadAutoTune(); }}>
            Auto-Tune
          </button>
          <button style={tabStyle(activeTab === 'memory')} onClick={() => { setActiveTab('memory'); loadProfiles(); }}>
            Memory
          </button>
          <button style={tabStyle(activeTab === 'clusters')} onClick={() => { setActiveTab('clusters'); loadClusters(); }}>
            Clusters
          </button>
          <button style={tabStyle(activeTab === 'drift')} onClick={() => { setActiveTab('drift'); loadDrift(); }}>
            Drift
          </button>
          <button style={tabStyle(activeTab === 'history')} onClick={() => { setActiveTab('history'); loadHistory(); }}>
            History
          </button>
          <button style={tabStyle(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>
            Stats
          </button>
        </div>

        {/* Status Message */}
        {saveStatus && (
          <div style={{
            padding: '8px 12px',
            marginBottom: 12,
            borderRadius: 6,
            background: saveStatus.type === 'success' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
            color: saveStatus.type === 'success' ? '#4ade80' : '#f87171',
            fontSize: 12
          }}>
            {saveStatus.message}
          </div>
        )}

        {/* Turn Inspector */}
        {activeTab === 'turns' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={headerStyle}>Turn Detail</div>
              {snapshot && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {saveStatus && (
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: 11,
                      background: saveStatus.type === 'success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                      color: saveStatus.type === 'success' ? '#4ade80' : '#f87171'
                    }}>
                      {saveStatus.message}
                    </div>
                  )}
                  <button
                    onClick={() => saveConfigFromTurn(false)}
                    style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                    title={`Save this turn's behavior as the default for "${snapshot.serEmotion?.primary || 'neutral'}" emotion`}
                  >
                    Save as Config
                  </button>
                  <button
                    onClick={() => saveConfigFromTurn(true)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(139, 92, 246, 0.3)',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      borderRadius: 6,
                      color: '#a78bfa',
                      fontWeight: 500,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                    title="Save as default for this emotion AND as the neutral (base) behavior"
                  >
                    Save as Base
                  </button>
                </div>
              )}
            </div>

            {!snapshot && (
              <div style={{ opacity: 0.5 }}>Select a turn to inspect.</div>
            )}

            {snapshot && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Emotion & Behavior */}
                <Section title="Emotion (SER)">
                  <div style={{
                    padding: '8px 12px',
                    background: getEmotionColor(snapshot.serEmotion?.primary),
                    borderRadius: 6,
                    marginBottom: 8
                  }}>
                    <strong>{snapshot.serEmotion?.primary || 'neutral'}</strong>
                    {snapshot.serEmotion?.secondary && ` / ${snapshot.serEmotion.secondary}`}
                    <span style={{ marginLeft: 8, opacity: 0.7 }}>
                      {Math.round((snapshot.serEmotion?.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <Mono json={snapshot.serEmotion} />
                </Section>

                <Section title="Behavior Profile">
                  <div style={{ marginBottom: 8 }}>
                    <BehaviorBar label="Backchannel" value={snapshot.behavior?.backchannelFrequency} />
                    <BehaviorBar label="Advice Bias" value={snapshot.behavior?.adviceBias} />
                    <div style={{ marginTop: 4 }}>
                      Style: <strong style={{ color: '#4ade80' }}>{snapshot.behavior?.style}</strong>
                    </div>
                    <div>Max Tokens: <strong>{snapshot.behavior?.maxResponseTokens}</strong></div>
                  </div>
                </Section>

                {/* User & Session */}
                <Section title="Session Stats">
                  <Mono json={snapshot.sessionStats} />
                </Section>

                <Section title="User Preferences">
                  <Mono json={snapshot.userPrefs} />
                </Section>

                {/* Transcript & Reply */}
                <Section title="User Said (STT)" span={2}>
                  <pre style={preStyle}>{snapshot.sttTranscript || '(empty)'}</pre>
                </Section>

                <Section title="Luna Replied (LLM)" span={2}>
                  <pre style={preStyle}>{snapshot.llmReply || '(empty)'}</pre>
                </Section>

                {/* LLM Prompt (if available) */}
                {snapshot.llmPrompt && (
                  <Section title="LLM Prompt (for debugging)" span={2}>
                    <pre style={{ ...preStyle, maxHeight: 200, overflow: 'auto' }}>
                      {snapshot.llmPrompt}
                    </pre>
                  </Section>
                )}

                {/* Timing */}
                <Section title="Durations (ms)" span={2}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <TimingBadge label="SER" value={snapshot.serDuration} />
                    <TimingBadge label="STT" value={snapshot.sttDuration} />
                    <TimingBadge label="LLM" value={snapshot.llmDuration} />
                    <TimingBadge label="TTS" value={snapshot.ttsDuration} />
                    <TimingBadge label="Total" value={snapshot.totalDuration} highlight />
                  </div>
                </Section>

                {/* TTS */}
                <Section title="TTS Profile">
                  <Mono json={{ provider: snapshot.ttsProvider, ...snapshot.ttsProfile }} />
                </Section>

                <Section title="Metadata">
                  <Mono json={{
                    timestamp: snapshot.timestamp,
                    sessionId: snapshot.sessionId,
                    turnId: snapshot.turnId,
                    llmProvider: snapshot.llmProvider,
                    llmModel: snapshot.llmModel
                  }} />
                </Section>
              </div>
            )}
          </>
        )}

        {/* Compare Turns */}
        {activeTab === 'compare' && (
          <>
            <div style={headerStyle}>Compare Two Turns</div>

            {!snapshot && !snapshotB && (
              <div style={{ opacity: 0.5 }}>Select Turn A (green) and Turn B (purple) from the list to compare.</div>
            )}

            {snapshot && !snapshotB && (
              <div style={{ opacity: 0.7, padding: 12, background: 'rgba(74, 222, 128, 0.1)', borderRadius: 8 }}>
                Turn A selected. Now select Turn B to compare.
              </div>
            )}

            {snapshot && snapshotB && (
              <ComparisonView a={snapshot} b={snapshotB} />
            )}
          </>
        )}

        {/* Global Config */}
        {activeTab === 'config' && (
          <>
            <div style={headerStyle}>
              Global Configuration
              {config?.version && <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 8 }}>v{config.version}</span>}
            </div>
            {config && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Section title="Default Behavior (Neutral)">
                  <ConfigSlider
                    label="Backchannel Frequency"
                    value={config.behaviorDefaults?.neutral?.backchannelFrequency ?? 0.3}
                    min={0} max={1} step={0.05}
                    onChange={v => updateConfig({ behaviorDefaults: { neutral: { backchannelFrequency: v } } })}
                  />
                  <ConfigSlider
                    label="Max Response Tokens"
                    value={config.behaviorDefaults?.neutral?.maxResponseTokens ?? 200}
                    min={50} max={500} step={10}
                    onChange={v => updateConfig({ behaviorDefaults: { neutral: { maxResponseTokens: v } } })}
                  />
                  <ConfigSlider
                    label="Advice Bias"
                    value={config.behaviorDefaults?.neutral?.adviceBias ?? 0.5}
                    min={0} max={1} step={0.05}
                    onChange={v => updateConfig({ behaviorDefaults: { neutral: { adviceBias: v } } })}
                  />
                </Section>

                <Section title="Timing">
                  <ConfigSlider
                    label="Zone 1 (Micro Pause ms)"
                    value={config.timing?.base?.zone1 ?? 300}
                    min={100} max={600} step={50}
                    onChange={v => updateConfig({ timing: { base: { zone1: v } } })}
                  />
                  <ConfigSlider
                    label="Zone 2 (Short Pause ms)"
                    value={config.timing?.base?.zone2 ?? 900}
                    min={400} max={1500} step={100}
                    onChange={v => updateConfig({ timing: { base: { zone2: v } } })}
                  />
                  <ConfigSlider
                    label="Zone 3 (Thinking Pause ms)"
                    value={config.timing?.base?.zone3 ?? 2000}
                    min={1000} max={4000} step={200}
                    onChange={v => updateConfig({ timing: { base: { zone3: v } } })}
                  />
                </Section>

                <Section title="Learning Rates">
                  <ConfigSlider
                    label="Backchannel Learning"
                    value={config.learning?.backchannelLearningRate ?? 0.02}
                    min={0.01} max={0.1} step={0.01}
                    onChange={v => updateConfig({ learning: { backchannelLearningRate: v } })}
                  />
                  <ConfigSlider
                    label="Response Length Learning"
                    value={config.learning?.responseLengthLearningRate ?? 0.03}
                    min={0.01} max={0.1} step={0.01}
                    onChange={v => updateConfig({ learning: { responseLengthLearningRate: v } })}
                  />
                  <ConfigSlider
                    label="Pause Tolerance Learning"
                    value={config.learning?.pauseToleranceLearningRate ?? 0.02}
                    min={0.01} max={0.1} step={0.01}
                    onChange={v => updateConfig({ learning: { pauseToleranceLearningRate: v } })}
                  />
                </Section>

                <Section title="TTS (ElevenLabs Base)">
                  <ConfigSlider
                    label="Stability"
                    value={config.tts?.elevenLabs?.baseProfile?.stability ?? 0.6}
                    min={0} max={1} step={0.05}
                    onChange={v => updateConfig({ tts: { elevenLabs: { baseProfile: { stability: v } } } })}
                  />
                  <ConfigSlider
                    label="Similarity"
                    value={config.tts?.elevenLabs?.baseProfile?.similarityBoost ?? 0.75}
                    min={0} max={1} step={0.05}
                    onChange={v => updateConfig({ tts: { elevenLabs: { baseProfile: { similarityBoost: v } } } })}
                  />
                  <ConfigSlider
                    label="Style"
                    value={config.tts?.elevenLabs?.baseProfile?.style ?? 0.3}
                    min={0} max={1} step={0.05}
                    onChange={v => updateConfig({ tts: { elevenLabs: { baseProfile: { style: v } } } })}
                  />
                </Section>

                <Section title="Thresholds">
                  <ConfigSlider
                    label="Emotion Confidence Min"
                    value={config.thresholds?.emotionConfidenceMin ?? 0.3}
                    min={0.1} max={0.9} step={0.05}
                    onChange={v => updateConfig({ thresholds: { emotionConfidenceMin: v } })}
                  />
                  <ConfigSlider
                    label="Silence Comfort (ms)"
                    value={config.thresholds?.silenceComfortMs ?? 4000}
                    min={1000} max={10000} step={500}
                    onChange={v => updateConfig({ thresholds: { silenceComfortMs: v } })}
                  />
                  <ConfigSlider
                    label="Backchannel Min Interval (ms)"
                    value={config.backchannels?.minIntervalMs ?? 3000}
                    min={1000} max={6000} step={500}
                    onChange={v => updateConfig({ backchannels: { minIntervalMs: v } })}
                  />
                </Section>

                <Section title="Logging">
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <ConfigToggle
                      label="Logging Enabled"
                      value={config.logging?.enabled ?? true}
                      onChange={v => updateConfig({ logging: { enabled: v } })}
                    />
                    <ConfigToggle
                      label="Log Prompts"
                      value={config.logging?.logPrompts ?? true}
                      onChange={v => updateConfig({ logging: { logPrompts: v } })}
                    />
                    <ConfigToggle
                      label="Log Audio Paths"
                      value={config.logging?.logAudioPaths ?? false}
                      onChange={v => updateConfig({ logging: { logAudioPaths: v } })}
                    />
                  </div>
                </Section>

                <Section title="Raw Config (JSON)" span={2}>
                  <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    <Mono json={config} />
                  </div>
                </Section>
              </div>
            )}
          </>
        )}

        {/* System Stats */}
        {activeTab === 'stats' && (
          <>
            <div style={headerStyle}>System Statistics</div>
            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <StatCard label="Users" value={stats.users} />
                <StatCard label="Total Turns" value={stats.totalTurns} />
                <StatCard label="Total Sessions" value={stats.totalSessions} />

                <Section title="Emotions Distribution" span={3}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(stats.emotions || {}).map(([emotion, count]) => (
                      <div
                        key={emotion}
                        style={{
                          padding: '4px 10px',
                          background: getEmotionColor(emotion),
                          borderRadius: 4
                        }}
                      >
                        {emotion}: {count}
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="LLM Providers" span={3}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {Object.entries(stats.providers || {}).map(([provider, count]) => (
                      <div
                        key={provider}
                        style={{
                          padding: '4px 10px',
                          background: 'rgba(74, 222, 128, 0.2)',
                          borderRadius: 4
                        }}
                      >
                        {provider}: {count}
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <>
            <div style={headerStyle}>
              Config History
              <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 8 }}>
                ({history.length} entries)
              </span>
            </div>

            {history.length === 0 && (
              <div style={{ opacity: 0.5 }}>
                No config changes recorded yet. Use "Save as Config" on a turn to create history.
              </div>
            )}

            <div style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
              {history.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    borderLeft: entry.action === 'save_from_turn'
                      ? '3px solid #4ade80'
                      : '3px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <span style={{
                        padding: '2px 8px',
                        background: entry.action === 'save_from_turn'
                          ? 'rgba(74, 222, 128, 0.2)'
                          : 'rgba(139, 92, 246, 0.2)',
                        borderRadius: 4,
                        fontSize: 10,
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {entry.action?.replace(/_/g, ' ') || 'update'}
                      </span>
                      {entry.version && (
                        <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 10 }}>
                          v{entry.version}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.6 }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {entry.source && (
                    <div style={{ marginBottom: 8, fontSize: 11 }}>
                      <span style={{ opacity: 0.6 }}>From: </span>
                      <span style={{ color: '#4ade80' }}>{entry.source.userId}</span>
                      <span style={{ opacity: 0.6 }}> turn #{entry.source.turnIndex}</span>
                      {entry.source.emotion && (
                        <span style={{
                          marginLeft: 8,
                          padding: '1px 6px',
                          background: getEmotionColor(entry.source.emotion),
                          borderRadius: 3,
                          fontSize: 10
                        }}>
                          {entry.source.emotion}
                        </span>
                      )}
                    </div>
                  )}

                  {entry.source?.transcript && (
                    <div style={{
                      fontSize: 10,
                      opacity: 0.7,
                      marginBottom: 8,
                      fontStyle: 'italic'
                    }}>
                      "{entry.source.transcript}"
                    </div>
                  )}

                  <details>
                    <summary style={{ cursor: 'pointer', fontSize: 10, opacity: 0.6 }}>
                      View changes
                    </summary>
                    <pre style={{
                      margin: '8px 0 0',
                      padding: 8,
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: 4,
                      fontSize: 10,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {JSON.stringify(entry.changes, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Presets */}
        {activeTab === 'presets' && (
          <>
            <div style={headerStyle}>
              Personality Presets
              <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 8 }}>
                ({presets.length} available)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {presets.map(preset => (
                <div
                  key={preset.id}
                  style={{
                    padding: 16,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4, color: '#4ade80' }}>
                    {preset.name}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 12, minHeight: 28 }}>
                    {preset.description}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => applyPreset(preset.id)}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                        border: 'none',
                        borderRadius: 4,
                        color: '#000',
                        fontWeight: 600,
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      Apply
                    </button>
                    {!['warm', 'playful', 'sage', 'mystic', 'therapist', 'coach'].includes(preset.id) && (
                      <button
                        onClick={() => deletePreset(preset.id)}
                        style={{
                          padding: '6px 10px',
                          background: 'rgba(248, 113, 113, 0.2)',
                          border: '1px solid rgba(248, 113, 113, 0.3)',
                          borderRadius: 4,
                          color: '#f87171',
                          fontSize: 10,
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Section title="Save Current as Preset">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, opacity: 0.6, display: 'block', marginBottom: 4 }}>Name</label>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={e => setNewPresetName(e.target.value)}
                    placeholder="My Custom Preset"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 4,
                      color: '#fff',
                      fontSize: 12
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: 10, opacity: 0.6, display: 'block', marginBottom: 4 }}>Description</label>
                  <input
                    type="text"
                    value={newPresetDesc}
                    onChange={e => setNewPresetDesc(e.target.value)}
                    placeholder="Describe this personality..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 4,
                      color: '#fff',
                      fontSize: 12
                    }}
                  />
                </div>
                <button
                  onClick={saveAsPreset}
                  disabled={!newPresetName.trim()}
                  style={{
                    padding: '8px 16px',
                    background: newPresetName.trim() ? 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: 4,
                    color: newPresetName.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontWeight: 600,
                    fontSize: 11,
                    cursor: newPresetName.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Save Preset
                </button>
              </div>
            </Section>
          </>
        )}

        {/* Versions */}
        {activeTab === 'versions' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={headerStyle}>
                Config Versions
                <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 8 }}>
                  ({versions.length} saved)
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={`${API_BASE}/console/config/export`}
                  download
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(74, 222, 128, 0.2)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: 4,
                    color: '#4ade80',
                    fontSize: 11,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Export Config
                </a>
                <label style={{
                  padding: '6px 12px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 4,
                  color: '#a78bfa',
                  fontSize: 11,
                  cursor: 'pointer'
                }}>
                  Import Config
                  <input
                    type="file"
                    accept=".json"
                    onChange={e => e.target.files?.[0] && importConfig(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {versions.length === 0 && (
              <div style={{ opacity: 0.5 }}>
                No versions saved yet. Config changes will create versioned snapshots.
              </div>
            )}

            <div style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
              {versions.map((v, idx) => (
                <div
                  key={v.version}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    marginBottom: 8,
                    background: idx === 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    borderLeft: idx === 0 ? '3px solid #4ade80' : '3px solid transparent'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: idx === 0 ? '#4ade80' : '#fff' }}>
                      v{v.version}
                      {idx === 0 && <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.6 }}>(current)</span>}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
                      {v.updatedAt ? new Date(v.updatedAt).toLocaleString() : 'Unknown date'}
                    </div>
                  </div>
                  {idx > 0 && (
                    <button
                      onClick={() => restoreVersion(v.version)}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(251, 191, 36, 0.2)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: 4,
                        color: '#fbbf24',
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Auto-Tune */}
        {activeTab === 'autotune' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={headerStyle}>Auto-Tune Mode</div>
              <button
                onClick={toggleAutoTune}
                style={{
                  padding: '8px 16px',
                  background: autoTune?.enabled
                    ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                    : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: 6,
                  color: autoTune?.enabled ? '#000' : '#fff',
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                {autoTune?.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>
                When enabled, Luna automatically adjusts her behavior based on user satisfaction signals.
                She learns from thumbs up/down feedback and adapts her response style over time.
              </div>
            </div>

            {autoTune && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Sensitivity Slider */}
                <Section title="Sensitivity">
                  <div style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, opacity: 0.6 }}>Learning Speed</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>
                        {(autoTune.sensitivity ?? 1.0).toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={autoTune.sensitivity ?? 1.0}
                      onChange={e => updateSensitivity(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: '#a78bfa'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, opacity: 0.5, marginTop: 4 }}>
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </Section>

                {/* Blend Factor Slider */}
                <Section title="Blend Factor">
                  <div style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, opacity: 0.6 }}>Consolidation Strength</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24' }}>
                        {((autoTune.blendFactor ?? 0.3) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={autoTune.blendFactor ?? 0.3}
                      onChange={e => updateBlendFactor(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: '#fbbf24'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, opacity: 0.5, marginTop: 4 }}>
                      <span>Subtle</span>
                      <span>Moderate</span>
                      <span>Strong</span>
                    </div>
                  </div>
                </Section>

                {/* Consolidation Controls */}
                <Section title="Consolidate Preferences" span={2}>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 12 }}>
                      Blend learned user preferences into the global config. This "solidifies" what Luna has learned.
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, opacity: 0.6, display: 'block', marginBottom: 4 }}>User ID</label>
                        <select
                          value={consolidateUserId}
                          onChange={e => setConsolidateUserId(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 4,
                            color: '#fff',
                            fontSize: 12
                          }}
                        >
                          <option value="">Select a user...</option>
                          {users.map(u => (
                            <option key={u.id || u.name} value={u.id || u.name}>
                              {u.name || u.id} ({u.turnCount || 0} turns)
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={consolidateNow}
                        disabled={!consolidateUserId}
                        style={{
                          padding: '8px 16px',
                          background: consolidateUserId
                            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            : 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: 4,
                          color: consolidateUserId ? '#000' : 'rgba(255,255,255,0.3)',
                          fontWeight: 600,
                          fontSize: 11,
                          cursor: consolidateUserId ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Consolidate Now
                      </button>
                    </div>
                  </div>
                </Section>

                <Section title="Satisfaction Score">
                  <div style={{ textAlign: 'center', padding: 16 }}>
                    <div style={{
                      fontSize: 48,
                      fontWeight: 700,
                      color: parseFloat(autoTune.recentSignals?.score || 0) > 0 ? '#4ade80' : parseFloat(autoTune.recentSignals?.score || 0) < 0 ? '#f87171' : '#fff'
                    }}>
                      {autoTune.recentSignals?.score || '0.00'}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>
                      Recent satisfaction (-1 to +1)
                    </div>
                  </div>
                </Section>

                <Section title="Signal Counts">
                  <div style={{ display: 'flex', justifyContent: 'space-around', padding: 16 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>
                        {autoTune.recentSignals?.positive || 0}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>Positive</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                        {autoTune.recentSignals?.neutral || 0}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>Neutral</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#f87171' }}>
                        {autoTune.recentSignals?.negative || 0}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>Negative</div>
                    </div>
                  </div>
                </Section>

                <Section title="Test Signals" span={2}>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button
                      onClick={() => sendSignal('positive')}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(74, 222, 128, 0.2)',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: 6,
                        color: '#4ade80',
                        fontSize: 20,
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => sendSignal('neutral')}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 6,
                        color: '#fff',
                        fontSize: 20,
                        cursor: 'pointer'
                      }}
                    >
                      =
                    </button>
                    <button
                      onClick={() => sendSignal('negative')}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(248, 113, 113, 0.2)',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        borderRadius: 6,
                        color: '#f87171',
                        fontSize: 20,
                        cursor: 'pointer'
                      }}
                    >
                      -
                    </button>
                  </div>
                </Section>

                <Section title="Current Biases">
                  <Mono json={autoTune.currentBiases} />
                </Section>

                <Section title="Recent Adjustments">
                  {autoTune.recentAdjustments?.length > 0 ? (
                    <div style={{ fontSize: 10 }}>
                      {autoTune.recentAdjustments.map((adj, i) => (
                        <div key={i} style={{ marginBottom: 4 }}>
                          <span style={{ opacity: 0.6 }}>{new Date(adj.timestamp).toLocaleTimeString()}</span>
                          {': '}
                          {Object.entries(adj.adjustments || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.5, fontSize: 10 }}>No auto-adjustments yet</div>
                  )}
                </Section>
              </div>
            )}
          </>
        )}

        {/* Memory (Interaction Profiles) */}
        {activeTab === 'memory' && (
          <>
            <div style={headerStyle}>
              Interaction Profiles (Long-Term Memory)
              <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 8 }}>
                ({Object.keys(profiles).length} users)
              </span>
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                Stores long-term interaction patterns for each user. Uses exponential moving averages
                for slow, stable adaptation over time. Profiles inform behavior blending.
              </div>
            </div>

            {profileStats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                <StatCard label="Total Profiles" value={profileStats.totalProfiles || 0} />
                <StatCard label="Avg Interactions" value={Math.round(profileStats.avgInteractionCount || 0)} />
                <StatCard label="Avg Pause (ms)" value={Math.round(profileStats.avgPauseMs || 0)} />
                <StatCard label="Avg Turn Length" value={(profileStats.avgTurnLength || 0).toFixed(1)} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 16 }}>
              {/* User list */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, opacity: 0.7, textTransform: 'uppercase' }}>
                  Users
                </div>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {Object.entries(profiles).map(([userId, profile]) => (
                    <div
                      key={userId}
                      onClick={() => { setSelectedProfileUser(userId); loadUserProfile(userId); }}
                      style={{
                        padding: 10,
                        marginBottom: 4,
                        background: selectedProfileUser === userId ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.05)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        border: selectedProfileUser === userId ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid transparent'
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{userId}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
                        {profile.interactionCount || 0} interactions
                      </div>
                    </div>
                  ))}
                  {Object.keys(profiles).length === 0 && (
                    <div style={{ opacity: 0.5, fontSize: 11 }}>No profiles yet</div>
                  )}
                </div>
              </div>

              {/* Profile detail */}
              <div>
                {selectedProfileData ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Section title="Profile Summary">
                      <div style={{ padding: 12 }}>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ opacity: 0.6, fontSize: 10 }}>Avg Pause:</span>
                          <span style={{ marginLeft: 8, fontWeight: 600 }}>{Math.round(selectedProfileData.profile?.avgPauseMs || 0)}ms</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ opacity: 0.6, fontSize: 10 }}>Avg Turn Length:</span>
                          <span style={{ marginLeft: 8, fontWeight: 600 }}>{(selectedProfileData.profile?.avgTurnLength || 0).toFixed(1)} sentences</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ opacity: 0.6, fontSize: 10 }}>Interrupt Rate:</span>
                          <span style={{ marginLeft: 8, fontWeight: 600 }}>{((selectedProfileData.profile?.interruptRate || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ opacity: 0.6, fontSize: 10 }}>Backchannel Tolerance:</span>
                          <span style={{ marginLeft: 8, fontWeight: 600, color: (selectedProfileData.profile?.backchannelTolerance || 0) > 0 ? '#4ade80' : '#f87171' }}>
                            {(selectedProfileData.profile?.backchannelTolerance || 0).toFixed(2)}
                          </span>
                        </div>
                        {selectedProfileData.profile?.preferredTone && (
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ opacity: 0.6, fontSize: 10 }}>Preferred Tone:</span>
                            <span style={{ marginLeft: 8, fontWeight: 600, color: '#a78bfa' }}>{selectedProfileData.profile.preferredTone}</span>
                          </div>
                        )}
                        {selectedProfileData.profile?.preferredStyle && (
                          <div>
                            <span style={{ opacity: 0.6, fontSize: 10 }}>Preferred Style:</span>
                            <span style={{ marginLeft: 8, fontWeight: 600, color: '#fbbf24' }}>{selectedProfileData.profile.preferredStyle}</span>
                          </div>
                        )}
                      </div>
                    </Section>

                    <Section title="Cluster Classification">
                      <div style={{ padding: 12, textAlign: 'center' }}>
                        <div style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: selectedProfileData.cluster?.cluster === 'unknown' ? 'rgba(255,255,255,0.5)' : '#4ade80',
                          marginBottom: 8
                        }}>
                          {selectedProfileData.cluster?.profile?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8 }}>
                          Confidence: {((selectedProfileData.cluster?.confidence || 0) * 100).toFixed(0)}%
                        </div>
                        {selectedProfileData.cluster?.message && (
                          <div style={{ fontSize: 10, opacity: 0.5, fontStyle: 'italic' }}>
                            {selectedProfileData.cluster.message}
                          </div>
                        )}
                      </div>
                    </Section>

                    <Section title="Emotional Baseline">
                      <div style={{ padding: 8 }}>
                        {Object.entries(selectedProfileData.profile?.emotionalBaseline || {}).map(([emotion, value]) => (
                          <div key={emotion} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ width: 60, fontSize: 10, textTransform: 'capitalize' }}>{emotion}</span>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                              <div style={{ width: `${value * 100}%`, height: '100%', background: getEmotionColor(emotion).replace('0.3', '0.8'), borderRadius: 3 }} />
                            </div>
                            <span style={{ width: 40, textAlign: 'right', fontSize: 10, opacity: 0.6 }}>{(value * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </Section>

                    <Section title="Actions">
                      <div style={{ padding: 12 }}>
                        <button
                          onClick={() => resetUserProfile(selectedProfileUser)}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(248, 113, 113, 0.2)',
                            border: '1px solid rgba(248, 113, 113, 0.3)',
                            borderRadius: 6,
                            color: '#f87171',
                            fontWeight: 500,
                            fontSize: 11,
                            cursor: 'pointer'
                          }}
                        >
                          Reset Profile
                        </button>
                        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>
                          Last updated: {selectedProfileData.profile?.lastUpdated ? new Date(selectedProfileData.profile.lastUpdated).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </Section>

                    <Section title="Raw Profile Data" span={2}>
                      <div style={{ maxHeight: 200, overflow: 'auto' }}>
                        <Mono json={selectedProfileData.profile} />
                      </div>
                    </Section>
                  </div>
                ) : (
                  <div style={{ opacity: 0.5, textAlign: 'center', padding: 40 }}>
                    Select a user to view their profile
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Clusters */}
        {activeTab === 'clusters' && (
          <>
            <div style={headerStyle}>
              User Clusters (Interaction Styles)
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                Users are classified into interaction style clusters based on their long-term patterns.
                Each cluster has associated behavior preferences that are blended into Luna's responses.
              </div>
            </div>

            {clusters && (
              <>
                {/* Cluster Distribution */}
                <Section title="Cluster Distribution">
                  <div style={{ display: 'flex', gap: 12, padding: 12, flexWrap: 'wrap' }}>
                    {Object.entries(clusters.distribution || {}).map(([cluster, count]) => (
                      <div
                        key={cluster}
                        style={{
                          padding: '8px 16px',
                          background: count > 0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.05)',
                          borderRadius: 6,
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 700, color: count > 0 ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                          {count}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'capitalize' }}>
                          {cluster.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Cluster Definitions */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, opacity: 0.7, textTransform: 'uppercase' }}>
                    Cluster Definitions
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {(clusters.clusters || []).map(cluster => (
                      <div
                        key={cluster.id}
                        style={{
                          padding: 16,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#4ade80', marginBottom: 4 }}>
                          {cluster.name}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 12 }}>
                          {cluster.description}
                        </div>

                        <div style={{ fontSize: 10, marginBottom: 8 }}>
                          <div style={{ opacity: 0.5, marginBottom: 4 }}>Behavior Modifiers:</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                            <span>Response: <strong>{cluster.behavior?.responseLength?.toFixed(1)}x</strong></span>
                            <span>Backchannel: <strong>{cluster.behavior?.backchannel?.toFixed(1)}</strong></span>
                            <span>Pace: <strong>{cluster.behavior?.pace?.toFixed(1)}x</strong></span>
                            <span>Warmth: <strong>{cluster.behavior?.warmth?.toFixed(1)}</strong></span>
                          </div>
                        </div>

                        <div style={{ fontSize: 10 }}>
                          <span style={{ opacity: 0.5 }}>Preferred: </span>
                          <span style={{ color: '#a78bfa' }}>{(cluster.preferredTones || []).join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!clusters && (
              <div style={{ opacity: 0.5, textAlign: 'center', padding: 40 }}>
                Loading clusters...
              </div>
            )}
          </>
        )}

        {/* Drift */}
        {activeTab === 'drift' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={headerStyle}>Personality Drift (Global Evolution)</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={calculateDriftNow}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(74, 222, 128, 0.2)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: 4,
                    color: '#4ade80',
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  Calculate Now
                </button>
                <button
                  onClick={() => resetDriftValues()}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(248, 113, 113, 0.2)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: 4,
                    color: '#f87171',
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  Reset All
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                Luna's personality slowly evolves based on accumulated user interactions.
                Drift is bounded to prevent straying too far from core personality.
                Updates every 30 minutes based on signal accumulation.
              </div>
            </div>

            {drift && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Current Drift Values */}
                <Section title="Current Drift Values">
                  <div style={{ padding: 12 }}>
                    {Object.entries(drift.current || {}).map(([dimension, value]) => {
                      const bounds = drift.bounds?.[dimension];
                      const deviation = drift.deviations?.[dimension] || 0;
                      return (
                        <div key={dimension} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, textTransform: 'capitalize' }}>
                              {dimension.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              onClick={() => nudgeDrift(dimension, -0.5)}
                              style={{ padding: '2px 8px', background: 'rgba(248, 113, 113, 0.2)', border: 'none', borderRadius: 3, color: '#f87171', cursor: 'pointer', fontSize: 10 }}
                            >
                              -
                            </button>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, position: 'relative' }}>
                              {bounds && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: `${((value - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                                    top: -2,
                                    width: 10,
                                    height: 10,
                                    background: '#4ade80',
                                    borderRadius: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                />
                              )}
                            </div>
                            <button
                              onClick={() => nudgeDrift(dimension, 0.5)}
                              style={{ padding: '2px 8px', background: 'rgba(74, 222, 128, 0.2)', border: 'none', borderRadius: 3, color: '#4ade80', cursor: 'pointer', fontSize: 10 }}
                            >
                              +
                            </button>
                          </div>
                          {bounds && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, opacity: 0.4, marginTop: 2 }}>
                              <span>{bounds.min}</span>
                              <span>default: {bounds.default}</span>
                              <span>{bounds.max}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>

                {/* Accumulated Signals */}
                <Section title="Accumulated Signals">
                  <div style={{ padding: 12 }}>
                    {Object.entries(drift.accumulatedSignals || {}).map(([signal, count]) => (
                      <div key={signal} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, textTransform: 'capitalize' }}>
                          {signal.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: count > 0 ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                          {typeof count === 'number' ? count.toFixed(1) : count}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Velocity */}
                <Section title="Current Velocity (Direction of Drift)">
                  <div style={{ padding: 12 }}>
                    {Object.entries(drift.velocity || {}).map(([dimension, velocity]) => (
                      <div key={dimension} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, textTransform: 'capitalize' }}>
                          {dimension.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: velocity > 0 ? '#4ade80' : velocity < 0 ? '#f87171' : 'rgba(255,255,255,0.3)'
                        }}>
                          {velocity > 0 ? '+' : ''}{(velocity || 0).toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Metadata */}
                <Section title="Drift Status">
                  <div style={{ padding: 12 }}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ opacity: 0.6, fontSize: 10 }}>Total Interactions:</span>
                      <span style={{ marginLeft: 8, fontWeight: 600 }}>{drift.totalInteractions || 0}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ opacity: 0.6, fontSize: 10 }}>History Length:</span>
                      <span style={{ marginLeft: 8, fontWeight: 600 }}>{drift.historyLength || 0} entries</span>
                    </div>
                    <div>
                      <span style={{ opacity: 0.6, fontSize: 10 }}>Last Updated:</span>
                      <span style={{ marginLeft: 8, fontSize: 10 }}>{drift.lastUpdated ? new Date(drift.lastUpdated).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                </Section>

                {/* Drift History */}
                {driftHistory.length > 0 && (
                  <Section title="Recent Drift History" span={2}>
                    <div style={{ maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                      {driftHistory.slice(-10).reverse().map((entry, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: 8,
                            marginBottom: 4,
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: 4,
                            fontSize: 10
                          }}
                        >
                          <div style={{ opacity: 0.6, marginBottom: 4 }}>
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {Object.entries(entry.values || {}).map(([k, v]) => (
                              <span key={k}>
                                <span style={{ opacity: 0.5 }}>{k}: </span>
                                <span style={{ color: '#4ade80' }}>{typeof v === 'number' ? v.toFixed(2) : v}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            )}

            {!drift && (
              <div style={{ opacity: 0.5, textAlign: 'center', padding: 40 }}>
                Loading drift state...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const preStyle = {
  margin: 0,
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: 11,
  lineHeight: 1.5,
  background: 'rgba(0,0,0,0.3)',
  padding: 8,
  borderRadius: 4
};

function Section({ title, children, span = 1 }) {
  return (
    <div style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 8,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: 0.5
      }}>
        {title}
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 8,
        minHeight: 40
      }}>
        {children}
      </div>
    </div>
  );
}

function Mono({ json }) {
  return (
    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 10, whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(json, null, 2)}
    </pre>
  );
}

function BehaviorBar({ label, value }) {
  const pct = Math.round((value || 0) * 100);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4ade80, #22c55e)',
          borderRadius: 2
        }} />
      </div>
    </div>
  );
}

function TimingBadge({ label, value, highlight = false }) {
  return (
    <div style={{
      padding: '6px 12px',
      background: highlight ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)',
      borderRadius: 6,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 10, opacity: 0.6 }}>{label}</div>
      <div style={{ fontWeight: 600, color: highlight ? '#4ade80' : '#fff' }}>
        {value || 0}ms
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'rgba(74, 222, 128, 0.1)',
      padding: 16,
      borderRadius: 8,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>{value}</div>
      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ConfigSlider({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: '#4ade80' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}

function ConfigToggle({ label, value, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      <span style={{ fontSize: 11 }}>{label}</span>
    </label>
  );
}

function getEmotionColor(emotion) {
  const colors = {
    happy: 'rgba(251, 191, 36, 0.3)',
    excited: 'rgba(251, 146, 60, 0.3)',
    sad: 'rgba(96, 165, 250, 0.3)',
    anxious: 'rgba(167, 139, 250, 0.3)',
    angry: 'rgba(248, 113, 113, 0.3)',
    fearful: 'rgba(192, 132, 252, 0.3)',
    disgusted: 'rgba(134, 239, 172, 0.3)',
    surprised: 'rgba(253, 224, 71, 0.3)',
    tender: 'rgba(251, 207, 232, 0.3)',
    confused: 'rgba(203, 213, 225, 0.3)',
    neutral: 'rgba(148, 163, 184, 0.3)'
  };
  return colors[emotion] || colors.neutral;
}

/**
 * ComparisonView - Side-by-side turn comparison
 */
function ComparisonView({ a, b }) {
  const colStyle = {
    background: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 6,
    minHeight: 40
  };

  const heading = (label, color) => (
    <div style={{ fontWeight: 600, marginBottom: 6, color: color || '#fff', fontSize: 12 }}>
      {label}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Turn Headers */}
      <div>
        {heading(`Turn A - ${new Date(a.timestamp).toLocaleTimeString()}`, '#4ade80')}
        <div style={colStyle}>
          <div style={{ marginBottom: 8 }}>
            <span style={{
              padding: '2px 8px',
              background: getEmotionColor(a.serEmotion?.primary),
              borderRadius: 4,
              fontSize: 11
            }}>
              {a.serEmotion?.primary} ({Math.round((a.serEmotion?.confidence || 0) * 100)}%)
            </span>
          </div>
          <div style={{ fontSize: 11 }}>
            Style: <strong>{a.behavior?.style}</strong> | BC: <strong>{(a.behavior?.backchannelFrequency || 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div>
        {heading(`Turn B - ${new Date(b.timestamp).toLocaleTimeString()}`, '#a78bfa')}
        <div style={colStyle}>
          <div style={{ marginBottom: 8 }}>
            <span style={{
              padding: '2px 8px',
              background: getEmotionColor(b.serEmotion?.primary),
              borderRadius: 4,
              fontSize: 11
            }}>
              {b.serEmotion?.primary} ({Math.round((b.serEmotion?.confidence || 0) * 100)}%)
            </span>
          </div>
          <div style={{ fontSize: 11 }}>
            Style: <strong>{b.behavior?.style}</strong> | BC: <strong>{(b.behavior?.backchannelFrequency || 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* User Transcripts */}
      <div>
        {heading('User Said (A)')}
        <div style={colStyle}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11 }}>
            {a.sttTranscript || '(empty)'}
          </pre>
        </div>
      </div>

      <div>
        {heading('User Said (B)')}
        <div style={colStyle}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11 }}>
            {b.sttTranscript || '(empty)'}
          </pre>
        </div>
      </div>

      {/* Luna Replies */}
      <div>
        {heading('Luna Reply (A)')}
        <div style={colStyle}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11 }}>
            {a.llmReply || '(empty)'}
          </pre>
        </div>
      </div>

      <div>
        {heading('Luna Reply (B)')}
        <div style={colStyle}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11 }}>
            {b.llmReply || '(empty)'}
          </pre>
        </div>
      </div>

      {/* Differences */}
      <div style={{ gridColumn: 'span 2' }}>
        {heading('Key Differences', '#fbbf24')}
        <div style={{ ...colStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>Emotion & Behavior</div>
            <DiffEntry label="Emotion" a={a.serEmotion?.primary} b={b.serEmotion?.primary} />
            <DiffEntry label="Confidence" a={`${Math.round((a.serEmotion?.confidence || 0) * 100)}%`} b={`${Math.round((b.serEmotion?.confidence || 0) * 100)}%`} />
            <DiffEntry label="Style" a={a.behavior?.style} b={b.behavior?.style} />
            <DiffEntry label="Backchannel Freq" a={(a.behavior?.backchannelFrequency || 0).toFixed(2)} b={(b.behavior?.backchannelFrequency || 0).toFixed(2)} />
            <DiffEntry label="Advice Bias" a={(a.behavior?.adviceBias || 0).toFixed(2)} b={(b.behavior?.adviceBias || 0).toFixed(2)} />
            <DiffEntry label="Max Tokens" a={a.behavior?.maxResponseTokens} b={b.behavior?.maxResponseTokens} />
          </div>

          <div>
            <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>Timing & Providers</div>
            <DiffEntry label="Zone2 (ms)" a={a.behavior?.timing?.zone2} b={b.behavior?.timing?.zone2} />
            <DiffEntry label="Zone3 (ms)" a={a.behavior?.timing?.zone3} b={b.behavior?.timing?.zone3} />
            <DiffEntry label="Total (ms)" a={a.totalDuration} b={b.totalDuration} />
            <DiffEntry label="LLM Provider" a={a.llmProvider} b={b.llmProvider} />
            <DiffEntry label="TTS Provider" a={a.ttsProvider} b={b.ttsProvider} />
          </div>
        </div>
      </div>

      {/* Session Stats Comparison */}
      <div>
        {heading('Session Stats (A)')}
        <div style={colStyle}>
          <Mono json={a.sessionStats} />
        </div>
      </div>

      <div>
        {heading('Session Stats (B)')}
        <div style={colStyle}>
          <Mono json={b.sessionStats} />
        </div>
      </div>
    </div>
  );
}

/**
 * DiffEntry - Shows a single difference between two values
 */
function DiffEntry({ label, a, b }) {
  const aStr = String(a ?? '');
  const bStr = String(b ?? '');
  const same = aStr === bStr;

  return (
    <div style={{ fontSize: 11, marginBottom: 4, display: 'flex', gap: 4 }}>
      <span style={{ opacity: 0.6, minWidth: 100 }}>{label}:</span>
      <span style={{ color: '#4ade80' }}>{aStr || '(none)'}</span>
      <span style={{ opacity: 0.4 }}></span>
      <span style={{ color: same ? 'rgba(255,255,255,0.5)' : '#f472b6' }}>{bStr || '(none)'}</span>
      {!same && <span style={{ color: '#fbbf24', fontSize: 10 }}></span>}
    </div>
  );
}

export default LunaConsole;
