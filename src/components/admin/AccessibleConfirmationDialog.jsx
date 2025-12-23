/**
 * AccessibleConfirmationDialog.jsx - Reusable accessible confirmation dialog
 *
 * Built on AccessibleModal with focus trap and ARIA attributes.
 * Provides consistent confirmation UI for destructive or important admin actions.
 *
 * Props:
 * - open: boolean
 * - title: string
 * - description: string (short explanation)
 * - confirmLabel: string (default "Confirm")
 * - cancelLabel: string (default "Cancel")
 * - requireReason: boolean (default false) - shows textarea and requires reason
 * - onConfirm(reason): async function - called with reason or null
 * - onCancel: function - called when user cancels or closes
 * - initialFocusRef: optional ref to focus inside modal
 * - loading: boolean - external loading state (optional)
 *
 * December 23, 2025
 */

import React, { useRef, useState, useEffect } from 'react';
import AccessibleModal from './AccessibleModal.jsx';
import './accessibleConfirmation.css';

export default function AccessibleConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  requireReason = false,
  onConfirm,
  onCancel,
  initialFocusRef,
  loading: externalLoading = false
}) {
  const reasonRef = useRef(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading || internalLoading;

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setReason('');
      setError(null);
      setInternalLoading(false);
    }
  }, [open]);

  // Focus textarea when modal opens if reason required
  useEffect(() => {
    if (open && requireReason && reasonRef.current) {
      // Small delay to let FocusTrap initialize
      const timer = setTimeout(() => {
        reasonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open, requireReason]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedReason = reason.trim();

    // Validate reason if required
    if (requireReason && (!trimmedReason || trimmedReason.length < 3)) {
      setError('Please provide a reason (at least 3 characters)');
      return;
    }

    setInternalLoading(true);

    try {
      if (onConfirm) {
        await onConfirm(requireReason ? trimmedReason : null);
      }
    } catch (err) {
      console.error('Confirmation action failed:', err);
      setError(err.message || 'Action failed');
      setInternalLoading(false);
    }
  };

  const isConfirmDisabled = loading || (requireReason && (!reason.trim() || reason.trim().length < 3));

  return (
    <AccessibleModal
      open={open}
      onClose={onCancel}
      labelledBy="confirm-dialog-title"
      describedBy="confirm-dialog-desc"
      initialFocusRef={initialFocusRef || (requireReason ? reasonRef : null)}
    >
      <form className="ac-modal-form" onSubmit={handleSubmit}>
        {/* Header */}
        <header className="ac-header">
          <h2 id="confirm-dialog-title" className="ac-title">{title}</h2>
          <button
            type="button"
            className="ac-close"
            onClick={onCancel}
            aria-label="Close"
            disabled={loading}
          >
            ✕
          </button>
        </header>

        {/* Description */}
        <div id="confirm-dialog-desc" className="ac-desc">
          {description}
        </div>

        {/* Reason Input (optional) */}
        {requireReason && (
          <div className="ac-reason">
            <label htmlFor="confirm-reason" className="ac-label">
              Reason for audit <span className="ac-required">*</span>
            </label>
            <textarea
              id="confirm-reason"
              ref={reasonRef}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="ac-textarea"
              placeholder="Enter a short reason for the audit log"
              rows={4}
              aria-required="true"
              aria-describedby="confirm-reason-hint"
              disabled={loading}
            />
            <div id="confirm-reason-hint" className="ac-hint">
              This reason will be stored in the audit log.
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="ac-error" role="alert">
            {error}
          </div>
        )}

        {/* Actions */}
        <footer className="ac-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="btn danger"
            disabled={isConfirmDisabled}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </footer>
      </form>
    </AccessibleModal>
  );
}
