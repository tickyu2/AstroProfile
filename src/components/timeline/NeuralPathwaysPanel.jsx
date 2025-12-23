/**
 * ============================================================================
 * NEURAL PATHWAYS PANEL
 * ============================================================================
 * Shows unanswered questions to explore in the life story
 * These are "gaps" in the biographical timeline
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 */

import React, { useState, useEffect } from 'react';
import { biographyService } from '../../services/biographyService';

export default function NeuralPathwaysPanel({ userId, profileId, onExplore, limit = 10 }) {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!userId || !profileId) return;

    const loadPathways = async () => {
      setLoading(true);
      try {
        const result = await biographyService.getNeuralPathways(userId, profileId, limit);
        if (result.success) {
          setPathways(result.pathways || []);
        }
      } catch (err) {
        console.error('[NeuralPathways] Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPathways();
  }, [userId, profileId, limit]);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="h-3 bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (pathways.length === 0) {
    return null; // Don't show panel if no pathways
  }

  // Group by priority
  const highPriority = pathways.filter(p => p.priority > 0.6);
  const normalPriority = pathways.filter(p => p.priority <= 0.6);

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-900/10 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <div>
            <h3 className="font-semibold text-amber-300">Neural Pathways</h3>
            <p className="text-xs text-amber-400/70">
              {pathways.length} question{pathways.length !== 1 ? 's' : ''} to explore
            </p>
          </div>
        </div>
        <span className="text-amber-400">{expanded ? '▼' : '▶'}</span>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-slate-400">
            These questions can help fill gaps in the life story. Click to explore in chat.
          </p>

          {/* High priority questions */}
          {highPriority.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-amber-500 uppercase font-medium">Priority Questions</div>
              {highPriority.map((pathway, i) => (
                <PathwayItem
                  key={i}
                  pathway={pathway}
                  onExplore={onExplore}
                  isPriority
                />
              ))}
            </div>
          )}

          {/* Normal priority */}
          {normalPriority.length > 0 && (
            <div className="space-y-2">
              {highPriority.length > 0 && (
                <div className="text-xs text-slate-500 uppercase font-medium mt-3">Other Questions</div>
              )}
              {normalPriority.slice(0, 5).map((pathway, i) => (
                <PathwayItem
                  key={i}
                  pathway={pathway}
                  onExplore={onExplore}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PathwayItem({ pathway, onExplore, isPriority = false }) {
  const icon = biographyService.getEventTypeIcon(pathway.relatedEvent?.type);

  return (
    <button
      onClick={() => onExplore?.(pathway)}
      className={`
        w-full text-left p-3 rounded-lg transition-all
        ${isPriority
          ? 'bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/30'
          : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50'
        }
      `}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{isPriority ? '⭐' : '💡'}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${isPriority ? 'text-amber-200' : 'text-slate-300'}`}>
            {pathway.question}
          </p>
          {pathway.relatedEvent && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>{icon}</span>
              <span>Related to: {pathway.relatedEvent.title}</span>
              {pathway.relatedEvent.year && (
                <span>({pathway.relatedEvent.year})</span>
              )}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
