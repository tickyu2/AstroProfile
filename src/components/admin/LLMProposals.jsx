/**
 * LLMProposals.jsx - Admin UI for reviewing LLM consolidation proposals
 *
 * Displays pending promotions and allows approve/reject with one click.
 * Part of GENESIS Memory Consolidation System.
 *
 * December 23, 2025
 */

import React, { useEffect, useState } from 'react';
import { fetchPendingProposals, reviewPendingProposal, getConsolidationMetrics, revertConsolidation } from './api.js';
import ProposalDetail from './ProposalDetail.jsx';
import AccessibleConfirmationDialog from './AccessibleConfirmationDialog.jsx';
import { useQueuedToast } from './toast/QueuedToastProvider.jsx';
import './styles.css';

export default function LLMProposals() {
  const [proposals, setProposals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [confirmIdentifiers, setConfirmIdentifiers] = useState(null); // For confirmation dialog

  const toast = useQueuedToast();

  useEffect(() => {
    loadProposals();
    loadMetrics();
  }, [refreshKey, statusFilter]);

  async function loadProposals() {
    setLoading(true);
    try {
      const data = await fetchPendingProposals({ limit: 100, status: statusFilter });
      setProposals(data || []);
    } catch (err) {
      console.error('Failed to load proposals', err);
      alert('Failed to load proposals: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMetrics() {
    try {
      const data = await getConsolidationMetrics({ days: 7 });
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics', err);
    }
  }

  async function handleApprove(pendingId, note) {
    if (!window.confirm('Approve this proposal and promote to LTM?')) return;
    try {
      await reviewPendingProposal({ pendingId, action: 'approve', note });
      toast.success('Proposal approved and promoted to LTM');
      setRefreshKey(k => k + 1);
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error('Approve failed: ' + err.message);
    }
  }

  async function handleReject(pendingId, note) {
    if (!window.confirm('Reject this proposal?')) return;
    try {
      await reviewPendingProposal({ pendingId, action: 'reject', note });
      toast.success('Proposal rejected');
      setRefreshKey(k => k + 1);
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error('Reject failed: ' + err.message);
    }
  }

  // Handle inline undo click
  function handleInlineUndo(proposal, e) {
    e.stopPropagation(); // Prevent selecting the item
    const identifiers = {
      ltmIds: proposal.ltm_id ? [proposal.ltm_id] : [],
      promotionLogIds: proposal.promotion_log_id ? [proposal.promotion_log_id] : []
    };
    if (identifiers.ltmIds.length === 0 && identifiers.promotionLogIds.length === 0) {
      toast.error('No LTM or promotion log ID available for this proposal');
      return;
    }
    setConfirmIdentifiers(identifiers);
  }

  // Handle confirmation dialog confirm
  async function handleConfirmUndo(reason) {
    if (!confirmIdentifiers) return;
    try {
      await revertConsolidation({
        ltmIds: confirmIdentifiers.ltmIds || [],
        promotionLogIds: confirmIdentifiers.promotionLogIds || [],
        reason
      });
      toast.success('Undo requested successfully');
      setConfirmIdentifiers(null);
      setRefreshKey(k => k + 1);
      setSelected(null);
    } catch (err) {
      console.error('Undo failed:', err);
      toast.error('Undo failed: ' + err.message);
      throw err; // Re-throw to keep dialog open
    }
  }

  return (
    <div className="admin-proposals-shell">
      <div className="admin-proposals-header">
        <div>
          <h2>LLM Consolidation Proposals</h2>
          <p className="header-subtitle">Review and approve memory promotions</p>
        </div>
        <div className="header-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => setRefreshKey(k => k + 1)} className="btn">
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      {metrics && (
        <div className="metrics-bar">
          <div className="metric-item">
            <span className="metric-label">Pending</span>
            <span className="metric-value">{metrics.pendingPromotions || 0}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Promoted (7d)</span>
            <span className="metric-value">{metrics.runs?.total_promoted || 0}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">LTM Growth</span>
            <span className="metric-value">{metrics.ltmGrowth?.new_ltm_entries || 0}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Runs (7d)</span>
            <span className="metric-value">{metrics.runs?.total_runs || 0}</span>
          </div>
        </div>
      )}

      <div className="admin-proposals-grid">
        {/* Left Column - List */}
        <div className="left-col">
          <div className="card">
            <div className="card-title">
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Proposals
              {loading ? ' ...' : ` (${proposals.length})`}
            </div>
            <div className="proposals-list">
              {proposals.length === 0 && !loading && (
                <div className="empty">No {statusFilter} proposals</div>
              )}
              {proposals.map(p => {
                const canUndo = p.status === 'approved' && (p.ltm_id || p.promotion_log_id);
                return (
                  <div
                    key={p.id}
                    className={`list-item ${selected && selected.id === p.id ? 'selected' : ''}`}
                    onClick={() => setSelected(p)}
                  >
                    <div className="item-top">
                      <div className="item-title">
                        {truncate(p.proposed_content, 80)}
                      </div>
                      <div className="item-meta">
                        <span className="score">
                          {formatScore(p.score)}
                        </span>
                      </div>
                    </div>
                    <div className="item-bottom">
                      <span className="user-id">{p.user_id?.slice(0, 8)}...</span>
                      <span className="stm-count">{p.stm_ids?.length || 0} STMs</span>
                      <span className="date">{formatDate(p.created_at)}</span>
                      {canUndo && (
                        <button
                          className="btn-inline-undo"
                          onClick={(e) => handleInlineUndo(p, e)}
                          title="Undo this promotion"
                        >
                          ↩ Undo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Detail */}
        <div className="right-col">
          <div className="card">
            {selected ? (
              <ProposalDetail
                proposal={selected}
                onApprove={handleApprove}
                onReject={handleReject}
                onClose={() => setSelected(null)}
                onRefresh={() => setRefreshKey(k => k + 1)}
              />
            ) : (
              <div className="empty-detail">
                <div className="empty-icon">📋</div>
                <div>Select a proposal to inspect details</div>
                <div className="empty-hint">Click approve or reject after review</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for inline undo */}
      <AccessibleConfirmationDialog
        open={!!confirmIdentifiers}
        title="Undo Promotion"
        description={`This will revert the promotion and restore source short-term memories. ${
          confirmIdentifiers?.ltmIds?.length
            ? `LTM ID: ${confirmIdentifiers.ltmIds[0].slice(0, 12)}...`
            : confirmIdentifiers?.promotionLogIds?.length
              ? `Promotion Log ID: ${confirmIdentifiers.promotionLogIds[0]}`
              : ''
        }`}
        confirmLabel="Undo"
        cancelLabel="Cancel"
        requireReason={true}
        onConfirm={handleConfirmUndo}
        onCancel={() => setConfirmIdentifiers(null)}
      />
    </div>
  );
}

function truncate(text, n = 120) {
  if (!text) return '';
  return text.length > n ? text.slice(0, n - 1) + '...' : text;
}

function formatScore(s) {
  if (s == null) return '-';
  return (Number(s) * 100).toFixed(0) + '%';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
