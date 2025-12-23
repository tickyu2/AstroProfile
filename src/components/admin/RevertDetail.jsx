/**
 * RevertDetail.jsx - Detail view for a consolidation revert
 *
 * Shows full revert information, before/after snapshots, and diff viewer.
 * Part of GENESIS Memory Consolidation System.
 *
 * December 23, 2025
 */

import React, { useState } from 'react';
import DiffViewer from './DiffViewer.jsx';

export default function RevertDetail({ revert, onClose }) {
  const [activeSection, setActiveSection] = useState('summary'); // 'summary' | 'before' | 'after' | 'diff'

  if (!revert) return null;

  const before = revert.beforeSnapshot || {};
  const after = revert.afterSnapshot || {};

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="detail-root">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-row">
          <h3>Revert #{revert.id}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="detail-meta">
          <span className="meta-badge">Actor: {revert.actor}</span>
          <span className="meta-item">{formatDate(revert.createdAt)}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="detail-section">
        <div className="section-label">Reason</div>
        <div className="content-box">
          {revert.reason || 'No reason provided'}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="detail-section">
        <div className="section-label">Summary</div>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-value">{revert.ltmIds?.length || 0}</span>
            <span className="summary-label">LTM Reverted</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{revert.restoredStmIds?.length || 0}</span>
            <span className="summary-label">STM Restored</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{revert.userId?.slice(0, 8) || '-'}...</span>
            <span className="summary-label">User ID</span>
          </div>
        </div>
      </div>

      {/* IDs */}
      <div className="detail-section">
        <div className="section-label">Affected IDs</div>
        <div className="ids-container">
          <div className="ids-group">
            <div className="ids-title">LTM IDs</div>
            <div className="ids-list">
              {(revert.ltmIds || []).map((id, i) => (
                <code key={i} className="id-chip">{id}</code>
              ))}
              {(!revert.ltmIds || revert.ltmIds.length === 0) && (
                <span className="empty-small">None</span>
              )}
            </div>
          </div>
          <div className="ids-group">
            <div className="ids-title">Restored STM IDs</div>
            <div className="ids-list">
              {(revert.restoredStmIds || []).map((id, i) => (
                <code key={i} className="id-chip stm">{id}</code>
              ))}
              {(!revert.restoredStmIds || revert.restoredStmIds.length === 0) && (
                <span className="empty-small">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="detail-section">
        <div className="snapshot-tabs">
          <button
            className={`tab-btn ${activeSection === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveSection('summary')}
          >
            Summary
          </button>
          <button
            className={`tab-btn ${activeSection === 'before' ? 'active' : ''}`}
            onClick={() => setActiveSection('before')}
          >
            Before
          </button>
          <button
            className={`tab-btn ${activeSection === 'after' ? 'active' : ''}`}
            onClick={() => setActiveSection('after')}
          >
            After
          </button>
          <button
            className={`tab-btn ${activeSection === 'diff' ? 'active' : ''}`}
            onClick={() => setActiveSection('diff')}
          >
            Diff View
          </button>
        </div>

        {/* Tab Content */}
        <div className="snapshot-content">
          {activeSection === 'summary' && (
            <div className="summary-content">
              <p>This revert was performed by <strong>{revert.actor}</strong> on {formatDate(revert.createdAt)}.</p>
              <p>It affected {revert.ltmIds?.length || 0} LTM entries and restored {revert.restoredStmIds?.length || 0} STM entries.</p>
              <p>Use the Before, After, and Diff View tabs to inspect the exact state changes.</p>
            </div>
          )}

          {activeSection === 'before' && (
            <div className="snapshot-block">
              <pre className="json-block">{JSON.stringify(before, null, 2)}</pre>
            </div>
          )}

          {activeSection === 'after' && (
            <div className="snapshot-block">
              <pre className="json-block">{JSON.stringify(after, null, 2)}</pre>
            </div>
          )}

          {activeSection === 'diff' && (
            <DiffViewer left={before} right={after} />
          )}
        </div>
      </div>
    </div>
  );
}
