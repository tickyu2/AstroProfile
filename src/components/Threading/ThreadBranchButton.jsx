/**
 * ThreadBranchButton.jsx
 * Smart thread creation with AI energy detection
 *
 * Appears on message hover - allows users to branch conversations
 * into energy-specific threads (Metal/Water/Fire/Wood)
 *
 * Part of GENESIS Constitutional Threading Architecture
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState } from 'react';
import { THREAD_TYPES, detectThreadEnergy } from '../../hooks/useThreading';

/**
 * ThreadBranchButton Component
 *
 * @param {Object} props
 * @param {Object} props.message - The message to branch from
 * @param {Function} props.onCreateThread - Callback when thread is created
 * @param {string} props.userMode - Current Constitutional Intelligence mode
 */
export function ThreadBranchButton({ message, onCreateThread, userMode = 'DIALOGUE' }) {
  const [showSelector, setShowSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Detect energy from message content
  const detected = detectThreadEnergy(message.text);

  const handleCreateThread = async (threadType) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      await onCreateThread({
        parentMessageId: message.id,
        parentMessageText: message.text,
        parentMessageSender: message.sender,
        threadType,
        userMode,
        branchReason: `Branched to ${THREAD_TYPES[threadType].name} thread`
      });
      setShowSelector(false);
    } catch (error) {
      console.error('Failed to create thread:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative">
      {/* Branch Button - appears on hover */}
      <button
        onClick={() => setShowSelector(!showSelector)}
        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs
          transition-all duration-200 group
          ${showSelector
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-transparent'
          }
        `}
        title="Branch into energy thread"
      >
        <span className="text-base">🌿</span>
        <span className="hidden sm:inline">Branch</span>
        {showSelector && <span className="ml-1">▼</span>}
      </button>

      {/* Energy Type Selector Dropdown */}
      {showSelector && (
        <div className="absolute z-50 mt-2 left-0 w-72 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header with AI detection */}
          <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-lg">🧠</span>
              <span className="font-medium text-sm">Constitutional Energy Detected</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl">{THREAD_TYPES[detected.type].emoji}</span>
              <span className="text-white/90 font-medium">
                {THREAD_TYPES[detected.type].name}
              </span>
              <span className="ml-auto text-xs text-white/50">
                {detected.confidence}% confidence
              </span>
            </div>
          </div>

          {/* Energy Type Options */}
          <div className="p-2">
            <p className="px-2 py-1 text-xs text-white/40 uppercase tracking-wider">
              Select Thread Energy
            </p>

            {Object.entries(THREAD_TYPES).map(([typeId, config]) => {
              const isDetected = typeId === detected.type;
              const score = detected.scores[typeId] || 0;

              return (
                <button
                  key={typeId}
                  onClick={() => handleCreateThread(typeId)}
                  disabled={isCreating}
                  className={`
                    w-full px-3 py-2.5 rounded-lg text-left
                    transition-all duration-200 flex items-center gap-3
                    ${isDetected
                      ? `bg-gradient-to-r ${config.bgGradient} ${config.borderColor} border`
                      : 'hover:bg-white/5 border border-transparent'
                    }
                    ${isCreating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                  `}
                >
                  {/* Energy Icon */}
                  <span className={`text-2xl ${isDetected ? 'animate-pulse' : ''}`}>
                    {config.emoji}
                  </span>

                  {/* Energy Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isDetected ? config.textColor : 'text-white/80'}`}>
                        {config.name}
                      </span>
                      {isDetected && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded uppercase tracking-wider">
                          Detected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 truncate">
                      {config.description}
                    </p>
                  </div>

                  {/* Score indicator */}
                  {score > 0 && (
                    <div className="text-xs text-white/30">
                      {Math.round(score * 10)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 bg-white/5 border-t border-white/10">
            <p className="text-[10px] text-white/40 text-center">
              Threads organize conversations by constitutional energy type
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadBranchButton;
