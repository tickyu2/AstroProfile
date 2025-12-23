/**
 * RevertList.jsx - Admin UI for viewing consolidation reverts
 *
 * Lists recent reverts with audit details and links to full diff view.
 * Part of GENESIS Memory Consolidation System.
 *
 * December 23, 2025
 */

import React, { useEffect, useState } from 'react';
import { getRevertHistory, getRevertDetail, revertConsolidation } from './api.js';
import RevertDetail from './RevertDetail.jsx';
import AccessibleConfirmationDialog from './AccessibleConfirmationDialog.jsx';
import { useQueuedToast } from './toast/QueuedToastProvider.jsx';
import './revertStyles.css';

export default function RevertList() {
  const [reverts, setReverts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmIdentifiers, setConfirmIdentifiers] = useState(null);

  const toast = useQueuedToast();

  useEffect(() => {
    loadReverts();
  }, []);

  async function loadReverts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRevertHistory({ limit: 100 });
      setReverts(data);
    } catch (err) {
      console.error('Failed to load reverts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(revertId) {
    try {
      const detail = await getRevertDetail(revertId);
      setSelected(detail);
    } catch (err) {
      console.error('Failed to load revert detail:', err);
      toast.error('Failed to load detail: ' + err.message);
    }
  }

  // Handle re-run undo confirmation
  async function handleConfirmRerun(reason) {
    if (!confirmIdentifiers) return;
    try {
      await revertConsolidation({
        ltmIds: confirmIdentifiers.ltmIds || [],
        promotionLogIds: confirmIdentifiers.promotionLogIds || [],
        reason
      });
      toast.success('Re-run undo requested successfully');
      setConfirmIdentifiers(null);
      loadReverts();
    } catch (err) {
      console.error('Re-run failed:', err);
      toast.error('Re-run failed: ' + err.message);
      throw err;
    }
  }

  // Handle inline re-run click
  function handleRerunClick(revert, e) {
    e.stopPropagation();
    const ltmIds = revert.ltm_ids || revert.ltmIds || [];
    if (ltmIds.length === 0) {
      toast.error('No LTM IDs available for this revert');
      return;
    }
    setConfirmIdentifiers({ ltmIds, promotionLogIds: [] });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="revert-shell">
      {/* Header */}
      <div className="revert-header">
        <div>
          <h2>Consolidation Reverts</h2>
          <p className="header-subtitle">Audit trail of rolled-back promotions</p>
        </div>
        <div className="header-actions">
          <button onClick={loadReverts} className="btn" disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Grid Layout */}
      <div className="revert-grid">
        {/* Left Column - List */}
        <div className="revert-list-panel">
          <div className="card">
            <div className="card-title">
              Recent Reverts {loading ? '...' : `(${reverts.length})`}
            </div>
            <div className="revert-list">
              {reverts.length === 0 && !loading && (
                <div className="empty">No reverts found</div>
              )}
              {reverts.map(r => (
                <div
                  key={r.id}
                  className={`list-item ${selected?.id === r.id ? 'selected' : ''}`}
                  onClick={() => openDetail(r.id)}
                >
                  <div className="item-top">
                    <div className="item-title">
                      Revert #{r.id}
                    </div>
                    <div className="item-meta">
                      {formatDate(r.createdAt)}
                    </div>
                  </div>
                  <div className="item-bottom">
                    <span className="actor">Actor: {r.actor?.slice(0, 8)}...</span>
                    <span className="count">{r.ltmCount || r.ltm_ids?.length || 0} LTM</span>
                    <span className="count">{r.stmCount || r.restored_stm_ids?.length || 0} STM</span>
                    {(r.ltm_ids?.length || r.ltmIds?.length) > 0 && (
                      <button
                        className="btn-inline-undo"
                        onClick={(e) => handleRerunClick(r, e)}
                        title="Re-run this undo"
                      >
                        ↻ Re-run
                      </button>
                    )}
                  </div>
                  <div className="item-reason">
                    {(r.reason || '').slice(0, 60)}{r.reason?.length > 60 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Detail */}
        <div className="revert-detail-panel">
          <div className="card">
            {selected ? (
              <RevertDetail
                revert={selected}
                onClose={() => setSelected(null)}
              />
            ) : (
              <div className="empty-detail">
                <div className="empty-icon">🔄</div>
                <div>Select a revert to inspect</div>
                <div className="empty-hint">View before/after snapshots and diffs</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for re-run */}
      <AccessibleConfirmationDialog
        open={!!confirmIdentifiers}
        title="Re-run Undo"
        description={`This will re-run the undo for LTM(s): ${confirmIdentifiers?.ltmIds?.join(', ') || 'N/A'}`}
        confirmLabel="Run Undo"
        cancelLabel="Cancel"
        requireReason={true}
        onConfirm={handleConfirmRerun}
        onCancel={() => setConfirmIdentifiers(null)}
      />
    </div>
  );
}
