/**
 * ProposalDetail.jsx - Detail view for LLM consolidation proposal
 *
 * Shows full proposal content, metadata, source STMs, and approve/reject actions.
 * Part of GENESIS Memory Consolidation System.
 *
 * December 23, 2025
 */

import React, { useState } from 'react';
import AccessibleConfirmationDialog from './AccessibleConfirmationDialog.jsx';
import { useQueuedToast } from './toast/QueuedToastProvider.jsx';
import { revertConsolidation } from './api.js';

export default function ProposalDetail({ proposal, onApprove, onReject, onClose, onRefresh }) {
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toast = useQueuedToast();

  if (!proposal) return null;

  // Determine identifiers for rollback
  const rollbackIdentifiers = {
    ltmIds: proposal.ltm_id ? [proposal.ltm_id] : [],
    promotionLogIds: proposal.promotion_log_id ? [proposal.promotion_log_id] : []
  };

  const canUndo = rollbackIdentifiers.ltmIds.length > 0 || rollbackIdentifiers.promotionLogIds.length > 0;

  // Handle undo confirmation
  async function handleConfirmUndo(reason) {
    try {
      await revertConsolidation({
        ltmIds: rollbackIdentifiers.ltmIds,
        promotionLogIds: rollbackIdentifiers.promotionLogIds,
        reason
      });
      toast.success('Undo requested successfully');
      setShowConfirmDialog(false);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      console.error('Undo failed:', err);
      toast.error('Undo failed: ' + err.message);
      throw err; // Re-throw to keep dialog open
    }
  }

  async function handleAction(action) {
    setActionLoading(action);
    try {
      if (action === 'approve') {
        await onApprove(proposal.id, note);
      } else {
        await onReject(proposal.id, note);
      }
    } finally {
      setActionLoading(null);
    }
  }

  const isApproved = proposal.status === 'approved';
  const isRejected = proposal.status === 'rejected';
  const isPending = proposal.status === 'pending';

  return (
    <div className="proposal-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-row">
          <h3 className="detail-title">Proposal Detail</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="detail-meta">
          <span className={`status-badge status-${proposal.status}`}>
            {proposal.status}
          </span>
          <span className="meta-item">
            Score: <strong>{formatScore(proposal.score)}</strong>
          </span>
          <span className="meta-item">
            User: <code>{proposal.user_id?.slice(0, 12)}...</code>
          </span>
        </div>
      </div>

      {/* Proposed Content */}
      <div className="detail-section">
        <div className="section-label">Proposed LTM Content</div>
        <div className="content-box">
          {proposal.proposed_content || 'No content'}
        </div>
      </div>

      {/* Emotional Essence */}
      {proposal.emotional_essence && (
        <div className="detail-section">
          <div className="section-label">Emotional Essence</div>
          <div className="content-box subtle">
            {proposal.emotional_essence}
          </div>
        </div>
      )}

      {/* Core Themes */}
      {proposal.core_themes && proposal.core_themes.length > 0 && (
        <div className="detail-section">
          <div className="section-label">Core Themes</div>
          <div className="tags-row">
            {proposal.core_themes.map((theme, i) => (
              <span key={i} className="theme-tag">{theme}</span>
            ))}
          </div>
        </div>
      )}

      {/* Source STMs */}
      <div className="detail-section">
        <div className="section-label">
          Source STMs ({proposal.stm_ids?.length || 0})
        </div>
        <div className="source-stms">
          {proposal.stm_ids && proposal.stm_ids.length > 0 ? (
            proposal.stm_ids.map((id, i) => (
              <div key={i} className="stm-item">
                <code>{id}</code>
              </div>
            ))
          ) : (
            <div className="empty-small">No source STMs recorded</div>
          )}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="detail-section">
        <div className="section-label">Metadata</div>
        <div className="metadata-grid">
          <div className="meta-cell">
            <span className="meta-key">Profile</span>
            <span className="meta-val">{proposal.profile_id?.slice(0, 12) || '-'}...</span>
          </div>
          <div className="meta-cell">
            <span className="meta-key">Brain</span>
            <span className="meta-val">{proposal.source_brain || 'user'}</span>
          </div>
          <div className="meta-cell">
            <span className="meta-key">Confidence</span>
            <span className="meta-val">{formatScore(proposal.confidence)}</span>
          </div>
          <div className="meta-cell">
            <span className="meta-key">Created</span>
            <span className="meta-val">{formatDate(proposal.created_at)}</span>
          </div>
          {proposal.reviewed_at && (
            <>
              <div className="meta-cell">
                <span className="meta-key">Reviewed</span>
                <span className="meta-val">{formatDate(proposal.reviewed_at)}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-key">Reviewer</span>
                <span className="meta-val">{proposal.reviewed_by?.slice(0, 8) || '-'}...</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Notes (if already reviewed) */}
      {proposal.review_notes && (
        <div className="detail-section">
          <div className="section-label">Review Notes</div>
          <div className="content-box subtle">
            {proposal.review_notes}
          </div>
        </div>
      )}

      {/* Action Section (only for pending) */}
      {isPending && (
        <div className="detail-section action-section">
          <div className="section-label">Review Action</div>
          <textarea
            className="note-input"
            placeholder="Optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
          <div className="action-buttons">
            <button
              className="btn btn-approve"
              onClick={() => handleAction('approve')}
              disabled={actionLoading}
            >
              {actionLoading === 'approve' ? 'Approving...' : '✓ Approve'}
            </button>
            <button
              className="btn btn-reject"
              onClick={() => handleAction('reject')}
              disabled={actionLoading}
            >
              {actionLoading === 'reject' ? 'Rejecting...' : '✗ Reject'}
            </button>
          </div>
        </div>
      )}

      {/* Status indicators for reviewed proposals */}
      {isApproved && (
        <div className="detail-section">
          <div className="reviewed-banner approved">
            ✓ This proposal was approved and promoted to LTM
          </div>
          {canUndo && (
            <button
              className="btn btn-undo"
              onClick={() => setShowConfirmDialog(true)}
              style={{ marginTop: '0.75rem' }}
            >
              ↩ Undo Promotion
            </button>
          )}
        </div>
      )}
      {isRejected && (
        <div className="detail-section">
          <div className="reviewed-banner rejected">
            ✗ This proposal was rejected
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Undo */}
      <AccessibleConfirmationDialog
        open={showConfirmDialog}
        title="Undo Promotion"
        description={`This will revert the promotion and restore source short-term memories. ${
          rollbackIdentifiers.ltmIds.length
            ? `LTM ID: ${rollbackIdentifiers.ltmIds[0].slice(0, 12)}...`
            : rollbackIdentifiers.promotionLogIds.length
              ? `Promotion Log ID: ${rollbackIdentifiers.promotionLogIds[0]}`
              : ''
        }`}
        confirmLabel="Undo"
        cancelLabel="Cancel"
        requireReason={true}
        onConfirm={handleConfirmUndo}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
}

function formatScore(s) {
  if (s == null) return '-';
  return (Number(s) * 100).toFixed(0) + '%';
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
