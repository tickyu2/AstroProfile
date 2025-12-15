/**
 * DeleteConfirmDialog.jsx - Confirmation dialog for deleting a person
 *
 * Part of GENESIS Dashboard 1 - Data Manager
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React from 'react';

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, personName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-slate-800 border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Warning Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full">
            <span className="text-2xl">⚠️</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white text-center mb-2">
            Delete Person?
          </h3>

          {/* Message */}
          <p className="text-gray-400 text-center mb-6">
            Are you sure you want to delete <span className="text-white font-semibold">{personName}</span>?
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 text-gray-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
