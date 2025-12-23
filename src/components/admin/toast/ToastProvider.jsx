/**
 * ToastProvider.jsx - Toast/Snackbar notification system
 *
 * Provides a context for showing toast notifications across the admin UI.
 * Supports success, error, and info types with auto-dismiss.
 *
 * December 23, 2025
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import './toast.css';

const ToastContext = createContext(null);

/**
 * ToastProvider - Wrap your app with this to enable toast notifications
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Push a new toast notification
   * @param {Object} toast - Toast configuration
   * @param {string} toast.message - Message to display
   * @param {string} toast.type - Type: 'success' | 'error' | 'info'
   * @param {number} toast.duration - Auto-dismiss duration in ms (0 = manual dismiss)
   * @returns {string} Toast ID for manual removal
   */
  const push = useCallback((toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const newToast = { id, ...toast };

    setToasts((current) => [...current, newToast]);

    // Auto-dismiss after duration (default 4s)
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  /**
   * Remove a toast by ID
   */
  const remove = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  /**
   * Convenience methods
   */
  const success = useCallback((message, duration) => {
    return push({ message, type: 'success', duration });
  }, [push]);

  const error = useCallback((message, duration = 6000) => {
    return push({ message, type: 'error', duration });
  }, [push]);

  const info = useCallback((message, duration) => {
    return push({ message, type: 'info', duration });
  }, [push]);

  return (
    <ToastContext.Provider value={{ push, remove, success, error, info }}>
      {children}

      {/* Toast Viewport */}
      <div
        className="toast-viewport"
        aria-live="polite"
        aria-atomic="true"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type || 'info'}`}
            role="status"
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
    </ToastContext.Provider>
  );
}

/**
 * useToast hook - Access toast functions from any component
 * @returns {{ push, remove, success, error, info }}
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export default ToastProvider;
