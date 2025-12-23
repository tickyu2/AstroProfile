/**
 * AccessibleModal.jsx - Reusable accessible modal wrapper
 *
 * Features:
 * - Focus trap using focus-trap-react
 * - ESC key to close
 * - ARIA attributes (dialog, aria-modal, aria-labelledby, aria-describedby)
 * - Restores focus to previously focused element on close
 *
 * Props:
 * - open: boolean
 * - onClose: function
 * - labelledBy: string (id for title element)
 * - describedBy: string (id for description element)
 * - ariaLabel: string (alternative to labelledBy)
 * - initialFocusRef: ref to element to focus on open
 * - children: modal content
 *
 * December 23, 2025
 */

import React, { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import './accessibleModal.css';

export default function AccessibleModal({
  open,
  onClose,
  labelledBy,
  describedBy,
  ariaLabel,
  initialFocusRef,
  children
}) {
  const previouslyFocused = useRef(null);

  // Store and restore focus
  useEffect(() => {
    if (!open) return;

    // Store currently focused element
    previouslyFocused.current = document.activeElement;

    return () => {
      // Restore focus when modal closes
      try {
        if (previouslyFocused.current && previouslyFocused.current.focus) {
          previouslyFocused.current.focus();
        }
      } catch (e) {
        // Element may have been removed from DOM
      }
    };
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        onClose?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="am-backdrop"
      role="presentation"
      onClick={(e) => {
        // Close when clicking backdrop (not modal content)
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus: () => initialFocusRef?.current || undefined,
          clickOutsideDeactivates: false,
          escapeDeactivates: false, // We handle ESC manually for audit flow
          allowOutsideClick: false,
          returnFocusOnDeactivate: false // We handle this manually
        }}
      >
        <div
          className="am-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-label={ariaLabel}
        >
          {children}
        </div>
      </FocusTrap>
    </div>
  );
}
