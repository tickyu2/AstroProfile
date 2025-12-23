/**
 * ============================================================================
 * ADMIN DASHBOARD
 * ============================================================================
 * Main admin dashboard with KPIs, quick actions, and navigation.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

// ============================================================================
// KPI CARD
// ============================================================================

function KPICard({ title, value, subtitle, trend, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30',
    green: 'bg-green-500/20 border-green-500/30',
    yellow: 'bg-yellow-500/20 border-yellow-500/30',
    red: 'bg-red-500/20 border-red-500/30',
    purple: 'bg-purple-500/20 border-purple-500/30'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]} backdrop-blur-sm`}>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      {trend && (
        <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from yesterday
        </div>
      )}
    </div>
  );
}

// ============================================================================
// QUICK ACTION BUTTON
// ============================================================================

function QuickAction({ icon, label, onClick, variant = 'default', disabled = false }) {
  const variants = {
    default: 'bg-gray-700 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    success: 'bg-green-600 hover:bg-green-500 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-500 text-black'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}

// ============================================================================
// GLOBAL DRIFT TOGGLE
// ============================================================================

function GlobalDriftToggle({ enabled, onToggle }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(!enabled);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
      <div className="flex-1">
        <div className="text-white font-medium">Global Drift</div>
        <div className="text-sm text-gray-400">
          {enabled ? 'Luna personality drift is active' : 'Drift is paused globally'}
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative w-14 h-7 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-600'}`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'left-8' : 'left-1'}`}
        />
      </button>
    </div>
  );
}

// ============================================================================
// RECENT ACTIVITY
// ============================================================================

function RecentActivity({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <div className="flex-1">
            <div className="text-sm text-white">{entry.action}</div>
            <div className="text-xs text-gray-500">
              {entry.actor_email} - {new Date(entry.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function AdminDashboard({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [globalDrift, setGlobalDrift] = useState(null);
  const [recentAudit, setRecentAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [analyticsRes, driftRes, auditRes] = await Promise.all([
        adminService.getDriftAnalytics(),
        adminService.getGlobalDrift(),
        adminService.getAuditLog({ limit: 10 })
      ]);

      setAnalytics(analyticsRes.analytics);
      setGlobalDrift(driftRes.config);
      setRecentAudit(auditRes.entries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGlobalDrift = async (enabled) => {
    try {
      await adminService.toggleGlobalDrift(enabled, 'Toggled from admin dashboard');
      setGlobalDrift(prev => ({ ...prev, config: { ...prev.config, isEnabled: enabled } }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRunNightlyDrift = async () => {
    try {
      const result = await adminService.runNightlyDrift(true, 'Manual run from dashboard');
      alert(`Job started: ${result.jobId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
        Error: {error}
        <button onClick={loadDashboardData} className="ml-4 underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">GENESIS Control Center</p>
        </div>
        <div className="flex gap-2">
          <QuickAction label="Refresh" onClick={loadDashboardData} />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Active Users (7d)"
          value={analytics?.users?.total_users || 0}
          subtitle={`${analytics?.users?.active_users || 0} with drift enabled`}
          color="blue"
        />
        <KPICard
          title="Pending Merges"
          value={analytics?.recentDrifts?.length || 0}
          subtitle="Awaiting review"
          color="yellow"
        />
        <KPICard
          title="Open Questions"
          value={analytics?.recentSignals?.length || 0}
          subtitle="Neural pathways"
          color="purple"
        />
        <KPICard
          title="Total Interactions"
          value={analytics?.users?.total_interactions || 0}
          subtitle="All time"
          color="green"
        />
      </div>

      {/* Global Drift + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlobalDriftToggle
          enabled={globalDrift?.config?.isEnabled ?? true}
          onToggle={handleToggleGlobalDrift}
        />

        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-white font-medium mb-3">Quick Actions</div>
          <div className="flex flex-wrap gap-2">
            <QuickAction
              label="Run Nightly Drift"
              onClick={handleRunNightlyDrift}
              variant="success"
            />
            <QuickAction
              label="Review Merges"
              onClick={() => onNavigate?.('merges')}
            />
            <QuickAction
              label="Question Queue"
              onClick={() => onNavigate?.('questions')}
            />
          </div>
        </div>
      </div>

      {/* Global Drift Current Values */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-white font-medium mb-3">Global Drift Values</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'].map(param => {
            const value = analytics?.global?.current?.[param] || 0;
            return (
              <div key={param} className="text-center">
                <div className="text-xs text-gray-400 capitalize">{param}</div>
                <div className={`text-lg font-mono ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {value > 0 ? '+' : ''}{value.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'drift', label: 'Drift Inspector', icon: '🎚️', desc: 'Global & user drift' },
          { id: 'users', label: 'User Drift', icon: '👤', desc: 'Per-user management' },
          { id: 'merges', label: 'Timeline Review', icon: '🔗', desc: 'Merge candidates' },
          { id: 'questions', label: 'Questions', icon: '❓', desc: 'Neural pathways' },
          { id: 'jobs', label: 'Jobs', icon: '⚙️', desc: 'Background tasks' },
          { id: 'audit', label: 'Audit Log', icon: '📋', desc: 'Activity history' },
          { id: 'settings', label: 'Settings', icon: '⚡', desc: 'Configuration' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-white font-medium">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-white font-medium mb-3">Recent Activity</div>
        <RecentActivity entries={recentAudit} />
      </div>
    </div>
  );
}
