/**
 * RitualNavigation Component
 * A guided pilgrimage path through the Academy chapters
 * Creates a progression/initiation flow for learning
 */

import React from 'react';

// ============================================================================
// Types
// ============================================================================

export interface Chapter {
  id: string;
  label: string;
  description: string;
  icon: string;
  path: string;
}

export interface RitualNavigationProps {
  currentId: string;
  onNavigate?: (chapterId: string) => void;
  className?: string;
}

export interface ChapterProgressProps {
  chapters: Chapter[];
  currentId: string;
  completedIds?: string[];
  onNavigate?: (chapterId: string) => void;
  className?: string;
}

// ============================================================================
// Academy Chapter Definitions
// ============================================================================

export const ACADEMY_CHAPTERS: Chapter[] = [
  {
    id: 'foundations',
    label: 'Foundations of the Zodiac',
    description: 'The twelve signs as psychological archetypes',
    icon: '🏛️',
    path: '/zodiac-academy/foundations'
  },
  {
    id: 'boundaries',
    label: 'The Problem of Hard Boundaries',
    description: 'Why "I\'m a Libra" doesn\'t tell the full story',
    icon: '🔲',
    path: '/zodiac-academy/boundaries'
  },
  {
    id: 'phi-curve',
    label: 'The φ-Curve Solution',
    description: 'How the golden ratio models natural transitions',
    icon: 'φ',
    path: '/zodiac-academy/phi-curve'
  },
  {
    id: 'pure-signs',
    label: 'Pure Sign Archetypes',
    description: 'The twelve temples — unblended essences',
    icon: '♈',
    path: '/zodiac-academy/pure-signs'
  },
  {
    id: 'cusps',
    label: 'Cusp Archetypes',
    description: '72 unique day-by-day blends',
    icon: '🌓',
    path: '/zodiac-academy/cusps'
  },
  {
    id: 'elements',
    label: 'Elemental Compatibility',
    description: 'Fire, Earth, Air, Water — and how they interact',
    icon: '🔥',
    path: '/zodiac-academy/elements'
  },
  {
    id: 'practice',
    label: 'Practice Mode',
    description: 'Test your knowledge with curated questions',
    icon: '📝',
    path: '/zodiac-academy/practice'
  },
  {
    id: 'behind-scenes',
    label: 'Behind the Scenes',
    description: 'The mathematics and logic beneath the system',
    icon: '⚙️',
    path: '/zodiac-academy/behind-scenes'
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

function getChapterIndex(chapterId: string): number {
  return ACADEMY_CHAPTERS.findIndex(c => c.id === chapterId);
}

function getChapterById(chapterId: string): Chapter | undefined {
  return ACADEMY_CHAPTERS.find(c => c.id === chapterId);
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * RitualNavigation - Prev/Next chapter navigation
 */
export const RitualNavigation: React.FC<RitualNavigationProps> = ({
  currentId,
  onNavigate,
  className = ''
}) => {
  const index = getChapterIndex(currentId);
  const prev = ACADEMY_CHAPTERS[index - 1];
  const next = ACADEMY_CHAPTERS[index + 1];
  const current = ACADEMY_CHAPTERS[index];

  const handleNavigate = (chapter: Chapter) => {
    if (onNavigate) {
      onNavigate(chapter.id);
    } else {
      window.location.href = chapter.path;
    }
  };

  return (
    <nav className={`ritual-nav ${className}`}>
      {/* Progress indicator */}
      <div className="progress-indicator text-center mb-4">
        <span className="text-xs text-slate-500 uppercase tracking-wide">
          Chapter {index + 1} of {ACADEMY_CHAPTERS.length}
        </span>
        {current && (
          <h3 className="text-lg text-amber-200 font-medium">{current.label}</h3>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="nav-buttons flex justify-between items-center">
        {prev ? (
          <button
            onClick={() => handleNavigate(prev)}
            className="nav-prev flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-colors group"
          >
            <span className="text-slate-500 group-hover:text-purple-400 transition-colors">←</span>
            <div className="text-left">
              <div className="text-xs text-slate-500">Previous</div>
              <div className="text-sm text-slate-300">{prev.label}</div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {next ? (
          <button
            onClick={() => handleNavigate(next)}
            className="nav-next flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-amber-500/50 transition-colors group"
          >
            <div className="text-right">
              <div className="text-xs text-slate-500">Next</div>
              <div className="text-sm text-slate-300">{next.label}</div>
            </div>
            <span className="text-slate-500 group-hover:text-amber-400 transition-colors">→</span>
          </button>
        ) : (
          <div className="text-center px-4 py-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <div className="text-amber-400 font-medium">🎓 Journey Complete</div>
            <div className="text-xs text-slate-400">You've explored the full Academy</div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ============================================================================
// Chapter Progress Component
// ============================================================================

/**
 * ChapterProgress - Visual progress tracker showing all chapters
 */
export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  chapters = ACADEMY_CHAPTERS,
  currentId,
  completedIds = [],
  onNavigate,
  className = ''
}) => {
  const currentIndex = chapters.findIndex(c => c.id === currentId);
  const completedSet = new Set(completedIds);

  const handleNavigate = (chapter: Chapter) => {
    if (onNavigate) {
      onNavigate(chapter.id);
    } else {
      window.location.href = chapter.path;
    }
  };

  return (
    <div className={`chapter-progress ${className}`}>
      {/* Progress bar */}
      <div className="progress-bar-container mb-4">
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / chapters.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chapter dots */}
      <div className="chapter-dots flex justify-between">
        {chapters.map((chapter, i) => {
          const isCurrent = chapter.id === currentId;
          const isCompleted = completedSet.has(chapter.id);
          const isPast = i < currentIndex;

          return (
            <button
              key={chapter.id}
              onClick={() => handleNavigate(chapter)}
              className="chapter-dot group flex flex-col items-center"
              title={chapter.label}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  border-2 transition-all
                  ${isCurrent
                    ? 'bg-amber-500/30 border-amber-500 text-amber-300 scale-110'
                    : isCompleted || isPast
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800 border-slate-600 text-slate-500 hover:border-slate-500'
                  }
                `}
              >
                {isCompleted ? '✓' : chapter.icon}
              </div>
              <span
                className={`
                  text-xs mt-1 max-w-[60px] text-center truncate
                  ${isCurrent ? 'text-amber-300' : 'text-slate-500'}
                `}
              >
                {chapter.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Chapter List Component (Sidebar/Menu)
// ============================================================================

export const ChapterList: React.FC<{
  currentId?: string;
  completedIds?: string[];
  onNavigate?: (chapterId: string) => void;
  className?: string;
}> = ({
  currentId,
  completedIds = [],
  onNavigate,
  className = ''
}) => {
  const completedSet = new Set(completedIds);

  const handleNavigate = (chapter: Chapter) => {
    if (onNavigate) {
      onNavigate(chapter.id);
    } else {
      window.location.href = chapter.path;
    }
  };

  return (
    <nav className={`chapter-list space-y-2 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Academy Chapters
      </h3>
      {ACADEMY_CHAPTERS.map((chapter, i) => {
        const isCurrent = chapter.id === currentId;
        const isCompleted = completedSet.has(chapter.id);

        return (
          <button
            key={chapter.id}
            onClick={() => handleNavigate(chapter)}
            className={`
              w-full text-left p-3 rounded-lg border transition-all
              ${isCurrent
                ? 'bg-amber-900/30 border-amber-700/50 text-amber-200'
                : 'bg-slate-800/30 border-slate-700/50 text-slate-300 hover:border-purple-500/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{isCompleted ? '✓' : chapter.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{chapter.label}</div>
                <div className="text-xs text-slate-500 truncate">{chapter.description}</div>
              </div>
              <span className="text-xs text-slate-600">{i + 1}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

// ============================================================================
// Breadcrumb Component
// ============================================================================

export const ChapterBreadcrumb: React.FC<{
  currentId: string;
  onNavigate?: (chapterId: string) => void;
  className?: string;
}> = ({ currentId, onNavigate, className = '' }) => {
  const current = getChapterById(currentId);
  const index = getChapterIndex(currentId);

  const handleNavigate = (chapter: Chapter) => {
    if (onNavigate) {
      onNavigate(chapter.id);
    } else {
      window.location.href = chapter.path;
    }
  };

  return (
    <nav className={`chapter-breadcrumb flex items-center gap-2 text-sm ${className}`}>
      <button
        onClick={() => handleNavigate(ACADEMY_CHAPTERS[0])}
        className="text-slate-500 hover:text-purple-400 transition-colors"
      >
        Academy
      </button>
      <span className="text-slate-600">/</span>
      {current && (
        <span className="text-amber-300">
          {current.icon} {current.label}
        </span>
      )}
      <span className="text-slate-600 ml-auto">
        {index + 1} / {ACADEMY_CHAPTERS.length}
      </span>
    </nav>
  );
};

// ============================================================================
// Journey Completion Component
// ============================================================================

export const JourneyCompletion: React.FC<{
  completedCount: number;
  totalCount?: number;
  className?: string;
}> = ({ completedCount, totalCount = ACADEMY_CHAPTERS.length, className = '' }) => {
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount >= totalCount;

  return (
    <div className={`journey-completion ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">Academy Progress</span>
        <span className={`text-sm font-medium ${isComplete ? 'text-amber-400' : 'text-purple-300'}`}>
          {completedCount} / {totalCount} chapters
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isComplete
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isComplete && (
        <p className="text-center text-amber-400 text-sm mt-2">
          🎓 You've completed the Academy!
        </p>
      )}
    </div>
  );
};

export default RitualNavigation;
