/**
 * ============================================================================
 * DRIFT INSPECTOR
 * ============================================================================
 * Admin panel for inspecting and managing global drift.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

// ============================================================================
// DRIFT SLIDER
// ============================================================================

function DriftSlider({ param, value, min, max, onChange, disabled }) {
  const percentage = ((value - min) / (max - min)) * 100;
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400 capitalize">{param}</span>
        <span className={`font-mono ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'}`}>
          {value > 0 ? '+' : ''}{value.toFixed(3)}
        </span>
      </div>
      <div className="relative h-2 bg-gray-700 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-red-500 via-gray-500 to-green-500 rounded-full opacity-30"
          style={{ width: '100%' }}
        />
        <div
          className="absolute top-0 w-3 h-3 -mt-0.5 bg-white rounded-full shadow transform -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(param, parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full opacity-0 absolute cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min}</span>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ============================================================================
// HISTORY ENTRY
// ============================================================================

function HistoryEntry({ entry, onRollback }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between bg-gray-800 hover:bg-gray-750"
      >
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            {new Date(entry.recorded_at).toLocaleString()}
          </div>
          <div className="text-sm text-white">{entry.reason || 'scheduled_update'}</div>
        </div>
        <div className="text-gray-400">{expanded ? '▼' : '▶'}</div>
      </button>

      {expanded && (
        <div className="p-3 bg-gray-850 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 mb-3">
            {['warmth', 'adviceBias', 'pace'].map(param => {
              const key = `${param.replace(/([A-Z])/g, '_$1').toLowerCase()}_delta`;
              const value = entry[key] || 0;
              return (
                <div key={param} className="text-center">
                  <div className="text-xs text-gray-500 capitalize">{param}</div>
                  <div className={`font-mono ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {value > 0 ? '+' : ''}{value.toFixed(3)}
                  </div>
                </div>
              );
            })}
          </div>

          {entry.trigger_signals && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Trigger Signals</div>
              <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                {JSON.stringify(entry.trigger_signals, null, 2)}
              </pre>
            </div>
          )}

          <button
            onClick={() => onRollback(entry.id)}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-black text-sm rounded"
          >
            Rollback to this state
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DriftInspector() {
  const [globalDrift, setGlobalDrift] = useState(null);
  const [history, setHistory] = useState([]);
  const [editedValues, setEditedValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [reason, setReason] = useState('');

  const bounds = {
    warmth: { min: -0.3, max: 0.3 },
    adviceBias: { min: -0.3, max: 0.3 },
    pace: { min: -0.3, max: 0.3 },
    responsiveness: { min: -0.2, max: 0.2 },
    backchannel: { min: -0.3, max: 0.3 },
    mirroring: { min: -0.3, max: 0.3 }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [driftRes, historyRes] = await Promise.all([
        adminService.getGlobalDrift(),
        adminService.getGlobalDriftHistory(20)
      ]);

      setGlobalDrift(driftRes.config);
      setHistory(historyRes.history || []);

      // Initialize edited values
      const config = driftRes.config?.config || {};
      setEditedValues({
        warmthDelta: config.warmthDelta || 0,
        adviceBiasDelta: config.adviceBiasDelta || 0,
        paceDelta: config.paceDelta || 0,
        responsivenessDelta: config.responsivenessDelta || 0,
        backchannelDelta: config.backchannelDelta || 0,
        mirroringDelta: config.mirroringDelta || 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (param, value) => {
    setEditedValues(prev => ({
      ...prev,
      [`${param}Delta`]: value
    }));
  };

  const handleSave = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for the change');
      return;
    }

    setSaving(true);
    try {
      await adminService.updateGlobalDrift(editedValues, reason);
      setIsEditing(false);
      setReason('');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleForceUpdate = async () => {
    if (!confirm('This will apply all accumulated signals. Continue?')) return;

    setSaving(true);
    try {
      await adminService.forceGlobalDrift('Manual force update from admin');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (historyId) => {
    const rollbackReason = prompt('Reason for rollback:');
    if (!rollbackReason) return;

    setSaving(true);
    try {
      await adminService.rollbackGlobalDrift(historyId, rollbackReason);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const config = globalDrift?.config || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Drift Inspector</h2>
          <p className="text-gray-400">Global personality drift configuration</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Edit Values
              </button>
              <button
                onClick={handleForceUpdate}
                disabled={saving}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg disabled:opacity-50"
              >
                Force Update
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Status Card */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.isEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-white font-medium">
              {config.isEnabled ? 'Drift Enabled' : 'Drift Disabled'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Pending signals: {config.signalCount || 0}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Drift Rate:</span>
            <span className="ml-2 text-white">{config.driftRate || 0.02}</span>
          </div>
          <div>
            <span className="text-gray-500">Min Signals:</span>
            <span className="ml-2 text-white">{config.minSignalsForDrift || 50}</span>
          </div>
          <div>
            <span className="text-gray-500">Last Applied:</span>
            <span className="ml-2 text-white">
              {config.lastDriftAppliedAt ? new Date(config.lastDriftAppliedAt).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Drift Sliders */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-white font-medium mb-4">Current Drift Values</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(bounds).map(param => (
            <DriftSlider
              key={param}
              param={param}
              value={isEditing ? (editedValues[`${param}Delta`] || 0) : (config[`${param}Delta`] || 0)}
              min={bounds[param].min}
              max={bounds[param].max}
              onChange={handleValueChange}
              disabled={!isEditing}
            />
          ))}
        </div>

        {isEditing && (
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">Reason for change</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for this change..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          </div>
        )}
      </div>

      {/* History */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-white font-medium mb-4">Drift History</div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No history entries</div>
          ) : (
            history.map((entry, idx) => (
              <HistoryEntry
                key={entry.id || idx}
                entry={entry}
                onRollback={handleRollback}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
