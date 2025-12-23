/**
 * QueuedToastProvider.jsx - Toast system with announcement queue for screen readers
 *
 * Features:
 * - Visual toasts shown concurrently
 * - Screen reader announcements queued one at a time for clarity
 * - ARIA live region with polite announcements
 * - Auto-dismiss with configurable duration
 * - Manual dismiss via close button
 *
 * API:
 * - push({ message, type = "info", duration = 4000 }) -> id
 * - remove(id)
 * - success(message, duration) -> id
 * - error(message, duration) -> id
 * - info(message, duration) -> id
 *
 * December 23, 2025
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import './toast.css';

const ToastContext = createContext(null);

/**
 * QueuedToastProvider - Wrap your app with this to enable toast notifications
 * with queued screen reader announcements
 */
export function QueuedToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const queueRef = useRef([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');
  const announcerTimer = useRef(null);
  const processingRef = useRef(false);

  // Process announcement queue
  const announceNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      setCurrentAnnouncement('');
      processingRef.current = false;
      return;
    }

    processingRef.current = true;
    const next = queueRef.current.shift();
    setCurrentAnnouncement(next);

    // Keep announcement visible for screen reader to process
    clearTimeout(announcerTimer.current);
    announcerTimer.current = setTimeout(() => {
      setCurrentAnnouncement('');
      // Small delay before next announcement to ensure screen readers process
      setTimeout(() => announceNext(), 250);
    }, 1200);
  }, []);

  // Push a new toast
  const push = useCallback((toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const newToast = {
      id,
      message: toast.message,
      type: toast.type || 'info',
      duration: toast.duration ?? 4000
    };

    setToasts((current) => [...current, newToast]);

    // Enqueue for screen reader announcement
    queueRef.current.push(newToast.message);
    if (!processingRef.current) {
      announceNext();
    }

    // Auto-dismiss after duration (0 = no auto-dismiss)
    if (newToast.duration > 0) {
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, newToast.duration);
    }

    return id;
  }, [announceNext]);

  // Remove a toast by ID
  const remove = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, duration) => {
    return push({ message, type: 'success', duration });
  }, [push]);

  const error = useCallback((message, duration = 6000) => {
    return push({ message, type: 'error', duration });
  }, [push]);

  const info = useCallback((message, duration) => {
    return push({ message, type: 'info', duration });
  }, [push]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(announcerTimer.current);
  }, []);

  return (
    <ToastContext.Provider value={{ push, remove, success, error, info }}>
      {children}

      {/* Visual toast stack */}
      <div
        className="toast-viewport"
        aria-hidden="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type || 'info'}`}
          >
            <div className="toast-icon">
              {t.type === 'success' && '✓'}
              {t.type === 'error' && '✕'}
              {t.type === 'info' && 'ℹ'}
            </div>
            <div className="toast-body">{t.message}</div>
            <button
              className="toast-close"
              onClick={() => remove(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Single-message ARIA live region for screen readers */}
      <div
        className="sr-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentAnnouncement}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useQueuedToast hook - Access toast functions from any component
 * @returns {{ push, remove, success, error, info }}
 */
export function useQueuedToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useQueuedToast must be used within a QueuedToastProvider');
  }

  return context;
}

export default QueuedToastProvider;
