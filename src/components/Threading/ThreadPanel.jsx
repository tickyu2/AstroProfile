/**
 * ThreadPanel.jsx
 * Constitutional Energy Thread Navigation Sidebar
 *
 * Displays all active threads organized by energy type.
 * Visual styling per thread type (Metal/Water/Fire/Wood)
 *
 * Part of GENESIS Constitutional Threading Architecture
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState } from 'react';
import { THREAD_TYPES } from '../../hooks/useThreading';

/**
 * ThreadPanel Component
 *
 * @param {Object} props
 * @param {Array} props.threads - All threads for current conversation
 * @param {Object} props.threadsByType - Threads grouped by energy type
 * @param {string} props.currentThreadId - Currently active thread ID
 * @param {Function} props.onSwitchThread - Callback to switch threads
 * @param {Function} props.onReturnToMain - Callback to return to main conversation
 * @param {Function} props.onDeleteThread - Callback to delete a thread
 * @param {Function} props.onRenameThread - Callback to rename a thread
 */
export function ThreadPanel({
  threads = [],
  threadsByType = {},
  currentThreadId,
  onSwitchThread,
  onReturnToMain,
  onDeleteThread,
  onRenameThread
}) {
  const [expandedTypes, setExpandedTypes] = useState({
    metal_precision: true,
    water_flow: true,
    creative_fire: true,
    wood_growth: true
  });
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const toggleType = (typeId) => {
    setExpandedTypes(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }));
  };

  const handleStartEdit = (thread, e) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditTitle(thread.title);
  };

  const handleSaveEdit = async (threadId) => {
    if (editTitle.trim() && onRenameThread) {
      await onRenameThread(threadId, editTitle);
    }
    setEditingThreadId(null);
    setEditTitle('');
  };

  const handleDelete = async (threadId, e) => {
    e.stopPropagation();
    if (onDeleteThread && window.confirm('Delete this thread? Messages will be lost.')) {
      await onDeleteThread(threadId);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Check if we have any threads
  const hasThreads = threads.length > 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-800/50">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white/90 flex items-center gap-2">
            <span className="text-lg">🧵</span>
            <span>Energy Threads</span>
          </h3>
          <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">
            {threads.length}
          </span>
        </div>
        <p className="text-xs text-white/40 mt-1">
          Conversations by constitutional energy
        </p>
      </div>

      {/* Main Conversation Button */}
      <div className="px-3 py-2 border-b border-white/10">
        <button
          onClick={onReturnToMain}
          className={`
            w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3
            transition-all duration-200
            ${!currentThreadId
              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white/90 border border-transparent'
            }
          `}
        >
          <span className="text-xl">💬</span>
          <div className="flex-1">
            <span className="font-medium">Main Conversation</span>
            <p className="text-xs text-white/40">Primary thread</p>
          </div>
          {!currentThreadId && (
            <span className="text-xs text-amber-400">Active</span>
          )}
        </button>
      </div>

      {/* Thread List by Energy Type */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {!hasThreads ? (
          <div className="text-center py-8 px-4">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-sm text-white/60 mb-1">No threads yet</p>
            <p className="text-xs text-white/40">
              Click "Branch" on any message to create an energy thread
            </p>
          </div>
        ) : (
          Object.entries(THREAD_TYPES).map(([typeId, config]) => {
            const typeThreads = threadsByType[typeId] || [];
            const isExpanded = expandedTypes[typeId];

            if (typeThreads.length === 0) return null;

            return (
              <div key={typeId} className="rounded-lg overflow-hidden">
                {/* Type Header */}
                <button
                  onClick={() => toggleType(typeId)}
                  className={`
                    w-full px-3 py-2 flex items-center gap-2 text-left
                    bg-gradient-to-r ${config.bgGradient}
                    hover:brightness-110 transition-all duration-200
                    border ${config.borderColor} rounded-t-lg
                    ${!isExpanded ? 'rounded-b-lg' : ''}
                  `}
                >
                  <span className="text-lg">{config.emoji}</span>
                  <span className={`font-medium text-sm ${config.textColor}`}>
                    {config.name}
                  </span>
                  <span className="ml-auto text-xs text-white/40">
                    {typeThreads.length}
                  </span>
                  <span className={`text-xs ${config.accentColor} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Thread List */}
                {isExpanded && (
                  <div className={`border-x border-b ${config.borderColor} rounded-b-lg bg-black/20`}>
                    {typeThreads.map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => onSwitchThread(thread.id)}
                        className={`
                          px-3 py-2 cursor-pointer group
                          transition-all duration-200
                          ${currentThreadId === thread.id
                            ? `bg-gradient-to-r ${config.bgGradient}`
                            : 'hover:bg-white/5'
                          }
                          border-b border-white/5 last:border-b-0
                        `}
                      >
                        {editingThreadId === thread.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveEdit(thread.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(thread.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                            autoFocus
                          />
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium truncate ${
                                currentThreadId === thread.id ? config.textColor : 'text-white/80'
                              }`}>
                                {thread.title}
                              </p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => handleStartEdit(thread, e)}
                                  className="p-1 hover:bg-white/10 rounded text-xs text-white/40 hover:text-white/70"
                                  title="Rename"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => handleDelete(thread.id, e)}
                                  className="p-1 hover:bg-red-500/20 rounded text-xs text-white/40 hover:text-red-400"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-white/40">
                                {thread.messageCount || 0} msgs
                              </span>
                              <span className="text-xs text-white/30">•</span>
                              <span className="text-xs text-white/40">
                                {formatDate(thread.updatedAt)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Legend */}
      <div className="px-3 py-2 border-t border-white/10 bg-black/20">
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(THREAD_TYPES).map(([typeId, config]) => (
            <div key={typeId} className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span>{config.emoji}</span>
              <span>{config.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreadPanel;
