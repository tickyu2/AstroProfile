/**
 * AdminConsolePage.jsx - Usage Metrics Management Console
 *
 * Admin-only dashboard for monitoring platform usage, costs, and user activity.
 * Part of GENESIS Phase 6 - Production Hardening (Cost Control)
 *
 * December 19, 2024
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import LLMProposals from '../components/admin/LLMProposals';
import RevertList from '../components/admin/RevertList';
import { QueuedToastProvider } from '../components/admin/toast/QueuedToastProvider';

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)',
    color: 'white',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  navButtons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold'
  },
  statSubtext: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '5px'
  },
  section: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    fontWeight: '500'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '14px'
  },
  tierBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '200px',
    gap: '8px',
    padding: '20px 0'
  },
  chartBar: {
    flex: 1,
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px 4px 0 0',
    minWidth: '30px',
    transition: 'height 0.3s',
    position: 'relative'
  },
  chartLabel: {
    position: 'absolute',
    bottom: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    whiteSpace: 'nowrap'
  },
  chartValue: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.8)'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.5)'
  },
  error: {
    background: 'rgba(255,100,100,0.1)',
    border: '1px solid rgba(255,100,100,0.3)',
    borderRadius: '8px',
    padding: '15px',
    color: '#ff6b6b',
    marginBottom: '20px'
  },
  periodSelector: {
    display: 'flex',
    gap: '10px'
  },
  periodButton: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '13px'
  },
  periodButtonActive: {
    background: 'rgba(102, 126, 234, 0.3)',
    borderColor: '#667eea',
    color: 'white'
  },
  searchInput: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    width: '100%',
    maxWidth: '300px',
    marginBottom: '15px'
  },
  hourlyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(24, 1fr)',
    gap: '4px'
  },
  hourlyCell: {
    aspectRatio: '1',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    cursor: 'default'
  },
  tierGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px'
  },
  tierCard: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '10px'
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '4px'
  },
  tab: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'rgba(102, 126, 234, 0.2)',
    color: '#fff',
    borderBottom: '2px solid #667eea'
  }
};

// Tier colors
const TIER_COLORS = {
  free: { bg: 'rgba(100,100,100,0.2)', text: '#aaa', border: 'rgba(100,100,100,0.4)' },
  premium: { bg: 'rgba(102,126,234,0.2)', text: '#667eea', border: 'rgba(102,126,234,0.4)' },
  unlimited: { bg: 'rgba(240,147,251,0.2)', text: '#f093fb', border: 'rgba(240,147,251,0.4)' }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function StatCard({ label, value, subtext, color = '#667eea' }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      {subtext && <div style={styles.statSubtext}>{subtext}</div>}
    </div>
  );
}

function DailyChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={styles.loading}>No usage data available</div>;
  }

  const maxMessages = Math.max(...data.map(d => d.messages), 1);

  return (
    <div style={styles.chart}>
      {data.map((day, i) => {
        const height = Math.max(5, (day.messages / maxMessages) * 100);
        const dateLabel = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div
            key={day.date}
            style={{
              ...styles.chartBar,
              height: `${height}%`
            }}
            title={`${day.date}: ${day.messages} messages, ${day.activeUsers} users, $${day.cost.toFixed(4)}`}
          >
            <span style={styles.chartValue}>{day.messages}</span>
            <span style={styles.chartLabel}>{dateLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

function HourlyHeatmap({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div style={styles.loading}>No hourly data</div>;
  }

  const maxCount = Math.max(...Object.values(data), 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div>
      <div style={styles.hourlyGrid}>
        {hours.map(hour => {
          const count = data[hour] || 0;
          const intensity = count / maxCount;
          const bg = `rgba(102, 126, 234, ${0.1 + intensity * 0.8})`;

          return (
            <div
              key={hour}
              style={{
                ...styles.hourlyCell,
                background: bg,
                color: intensity > 0.5 ? 'white' : 'rgba(255,255,255,0.5)'
              }}
              title={`${hour}:00 - ${count} messages`}
            >
              {hour}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
        Hour of Day (UTC) - Darker = More Activity
      </div>
    </div>
  );
}

function TierBreakdown({ data }) {
  const total = (data.free || 0) + (data.premium || 0) + (data.unlimited || 0);

  return (
    <div style={styles.tierGrid}>
      {['free', 'premium', 'unlimited'].map(tier => {
        const count = data[tier] || 0;
        const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        const colors = TIER_COLORS[tier];

        return (
          <div
            key={tier}
            style={{
              ...styles.tierCard,
              background: colors.bg,
              border: `1px solid ${colors.border}`
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text }}>{count}</div>
            <div style={{ fontSize: '14px', textTransform: 'capitalize', marginTop: '5px' }}>{tier}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>{percent}%</div>
          </div>
        );
      })}
    </div>
  );
}

function TopUsersTable({ users }) {
  if (!users || users.length === 0) {
    return <div style={styles.loading}>No user data</div>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>User</th>
          <th style={styles.th}>Tier</th>
          <th style={styles.th}>Messages</th>
          <th style={styles.th}>Tokens</th>
          <th style={styles.th}>Cost</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => {
          const colors = TIER_COLORS[user.tier] || TIER_COLORS.free;
          return (
            <tr key={user.userId}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>
                <div>{user.displayName}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
              </td>
              <td style={styles.td}>
                <span style={{
                  ...styles.tierBadge,
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`
                }}>
                  {user.tier}
                </span>
              </td>
              <td style={styles.td}>{user.messages.toLocaleString()}</td>
              <td style={styles.td}>{user.tokens.toLocaleString()}</td>
              <td style={styles.td}>${user.cost.toFixed(4)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function UserListTable({ users, searchQuery }) {
  const filtered = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u =>
      u.email?.toLowerCase().includes(q) ||
      u.displayName?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  if (!filtered || filtered.length === 0) {
    return <div style={styles.loading}>No users found</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Tier</th>
            <th style={styles.th}>Profiles</th>
            <th style={styles.th}>Today Msgs</th>
            <th style={styles.th}>Today Tokens</th>
            <th style={styles.th}>Today Cost</th>
            <th style={styles.th}>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => {
            const colors = TIER_COLORS[user.tier] || TIER_COLORS.free;
            const lastActive = user.lastActive
              ? new Date(user.lastActive).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : '-';

            return (
              <tr key={user.id}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user.isAdmin && <span title="Admin">*</span>}
                    <div>
                      <div>{user.displayName}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.tierBadge,
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}>
                    {user.tier}
                  </span>
                </td>
                <td style={styles.td}>{user.profileCount}</td>
                <td style={styles.td}>{user.todayMessages}</td>
                <td style={styles.td}>{user.todayTokens.toLocaleString()}</td>
                <td style={styles.td}>${user.todayCost.toFixed(4)}</td>
                <td style={styles.td}>{lastActive}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function AdminConsolePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [period, setPeriod] = useState(7);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState('usage'); // 'usage' | 'proposals' | 'reverts'

  // Load platform stats
  useEffect(() => {
    loadStats();
  }, [period]);

  // Load user list on mount
  useEffect(() => {
    loadUserList();
  }, []);

  async function loadStats() {
    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions();
      const getAdminUsageStats = httpsCallable(functions, 'getAdminUsageStats');
      const result = await getAdminUsageStats({ days: period });

      if (result.data.success) {
        setStats(result.data.stats);
      } else {
        setError('Failed to load stats');
      }
    } catch (err) {
      console.error('Admin stats error:', err);
      if (err.code === 'functions/permission-denied') {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.message || 'Failed to load admin statistics');
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadUserList() {
    try {
      const functions = getFunctions();
      const getAdminUserList = httpsCallable(functions, 'getAdminUserList');
      const result = await getAdminUserList();

      if (result.data.success) {
        setUsers(result.data.users);
      }
    } catch (err) {
      console.error('User list error:', err);
    }
  }

  // Format cost display
  function formatCost(cost) {
    if (cost >= 1) return `$${cost.toFixed(2)}`;
    if (cost >= 0.01) return `$${cost.toFixed(3)}`;
    return `$${cost.toFixed(4)}`;
  }

  // Format large numbers
  function formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  }

  return (
    <QueuedToastProvider>
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Console</h1>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>
            Platform Usage & Metrics
          </div>
        </div>

        <div style={styles.navButtons}>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'usage' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('usage')}
        >
          Usage Metrics
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'proposals' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('proposals')}
        >
          LLM Proposals
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'reverts' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('reverts')}
        >
          Reverts
        </button>
      </div>

      {/* Error Display */}
      {error && activeTab === 'usage' && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* LLM Proposals Tab */}
      {activeTab === 'proposals' && <LLMProposals />}

      {/* Reverts Tab */}
      {activeTab === 'reverts' && <RevertList />}

      {/* Usage Tab Content */}
      {activeTab === 'usage' && (
        <>
        {/* Period Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={styles.periodSelector}>
          {[7, 14, 30].map(days => (
            <button
              key={days}
              style={{
                ...styles.periodButton,
                ...(period === days ? styles.periodButtonActive : {})
              }}
              onClick={() => setPeriod(days)}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <>
          <div style={styles.statsGrid}>
            <StatCard
              label="Total Users"
              value={stats.totals.users}
              color="#f093fb"
            />
            <StatCard
              label="Messages (Period)"
              value={formatNumber(stats.totals.messages)}
              subtext={`${period} day period`}
              color="#667eea"
            />
            <StatCard
              label="Tokens Used"
              value={formatNumber(stats.totals.tokens)}
              color="#4ecdc4"
            />
            <StatCard
              label="Estimated Cost"
              value={formatCost(stats.totals.cost)}
              subtext="Gemini API costs"
              color="#f5576c"
            />
          </div>

          {/* Daily Usage Chart */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              Daily Usage Trend
            </div>
            <DailyChart data={stats.daily} />
          </div>

          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {/* Top Users */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                Top Users ({period} Days)
              </div>
              <TopUsersTable users={stats.topUsers} />
            </div>

            {/* Tier Breakdown */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                Subscription Tiers
              </div>
              <TierBreakdown data={stats.tierBreakdown} />

              {/* Hourly Distribution */}
              <div style={{ marginTop: '30px' }}>
                <div style={styles.sectionTitle}>
                  Activity by Hour
                </div>
                <HourlyHeatmap data={stats.hourlyDistribution} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* All Users List */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          All Users ({users.length})
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          style={styles.searchInput}
        />
        <UserListTable users={users} searchQuery={userSearch} />
      </div>

      {/* Loading Overlay */}
      {loading && !stats && (
        <div style={styles.loading}>
          Loading admin statistics...
        </div>
      )}
        </>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
        GENESIS Admin Console - Phase 6 Production Hardening
      </div>
    </div>
    </QueuedToastProvider>
  );
}
