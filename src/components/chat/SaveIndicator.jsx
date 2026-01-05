/**
 * SAVE INDICATOR
 *
 * Shows auto-save status:
 * - Pending messages count
 * - Manual save button
 * - Last save timestamp
 */

import React from 'react';

function SaveIndicator({ pendingSaves, onManualSave }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-2">
      <div className="flex items-center justify-between text-xs bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
        <div className="flex items-center space-x-2 text-yellow-700">
          <span className="animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
          </span>
          <span>
            {pendingSaves} message{pendingSaves !== 1 ? 's' : ''} will auto-save in 30 sec
          </span>
        </div>

        <button
          onClick={onManualSave}
          className="text-yellow-700 hover:text-yellow-900 font-medium underline"
        >
          Save now
        </button>
      </div>
    </div>
  );
}

export default SaveIndicator;
