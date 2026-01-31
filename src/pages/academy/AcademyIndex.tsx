/**
 * AcademyIndex
 * The grand entrance to the Zodiac Academy
 * Landing page with chapter overview and progression tracking
 */

import React, { useState, useEffect } from 'react';
import {
  ACADEMY_CHAPTERS,
  ChapterList,
  JourneyCompletion,
  Chapter
} from '../../components/academy/RitualNavigation';

// ============================================================================
// Types
// ============================================================================

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
  isCompleted: boolean;
  onNavigate: (path: string) => void;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Hero section with Academy introduction
 */
const AcademyHero: React.FC = () => {
  return (
    <header className="academy-hero text-center py-16 mb-12">
      <div className="mb-6">
        <span className="text-6xl">🏛️</span>
      </div>
      <h1 className="text-5xl font-serif text-amber-200 mb-4">
        The Zodiac Academy
      </h1>
      <p className="text-xl text-purple-300 font-light max-w-2xl mx-auto mb-6">
        A guided pilgrimage through the mathematics and mythology of the zodiac.
      </p>
      <p className="text-slate-400 max-w-3xl mx-auto">
        Most astrology divides the sky into twelve equal slices and declares:
        "Born here? You're this sign." But nature doesn't work in hard boundaries.
        The Academy reveals a more nuanced truth — the φ-curve, the cusps,
        the elemental dance that makes each birth moment unique.
      </p>
    </header>
  );
};

/**
 * Individual chapter card with visual styling
 */
const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  index,
  isCompleted,
  onNavigate
}) => {
  const getChapterStyle = (id: string) => {
    const styles: Record<string, string> = {
      'foundations': 'from-amber-900/30 to-slate-900 border-amber-700/30',
      'boundaries': 'from-slate-800/50 to-slate-900 border-slate-600/30',
      'phi-curve': 'from-purple-900/30 to-slate-900 border-purple-700/30',
      'pure-signs': 'from-indigo-900/30 to-slate-900 border-indigo-700/30',
      'cusps': 'from-cyan-900/30 to-slate-900 border-cyan-700/30',
      'elements': 'from-red-900/20 to-slate-900 border-red-700/30',
      'practice': 'from-emerald-900/30 to-slate-900 border-emerald-700/30',
      'behind-scenes': 'from-slate-700/30 to-slate-900 border-slate-600/30',
    };
    return styles[id] || 'from-slate-800/50 to-slate-900 border-slate-600/30';
  };

  return (
    <button
      onClick={() => onNavigate(chapter.path)}
      className={`
        chapter-card w-full text-left p-6 rounded-xl border
        bg-gradient-to-br ${getChapterStyle(chapter.id)}
        hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-900/20
        transition-all duration-300 group
      `}
    >
      <div className="flex items-start gap-4">
        <div className="chapter-number flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
          {isCompleted ? (
            <span className="text-emerald-400">✓</span>
          ) : (
            <span className="text-slate-500 text-sm font-medium">{index + 1}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{chapter.icon}</span>
            <h3 className="text-lg font-semibold text-slate-200 group-hover:text-amber-200 transition-colors">
              {chapter.label}
            </h3>
          </div>
          <p className="text-sm text-slate-400">
            {chapter.description}
          </p>
        </div>

        <div className="flex-shrink-0 text-slate-600 group-hover:text-purple-400 transition-colors">
          →
        </div>
      </div>
    </button>
  );
};

/**
 * Quick stats about the Academy
 */
const AcademyStats: React.FC<{ completedCount: number }> = ({ completedCount }) => {
  return (
    <div className="academy-stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div className="stat-card bg-slate-800/30 rounded-lg p-4 text-center border border-slate-700/50">
        <div className="text-3xl font-bold text-amber-400">8</div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Chapters</div>
      </div>
      <div className="stat-card bg-slate-800/30 rounded-lg p-4 text-center border border-slate-700/50">
        <div className="text-3xl font-bold text-purple-400">12</div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Pure Signs</div>
      </div>
      <div className="stat-card bg-slate-800/30 rounded-lg p-4 text-center border border-slate-700/50">
        <div className="text-3xl font-bold text-cyan-400">72</div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Cusp Archetypes</div>
      </div>
      <div className="stat-card bg-slate-800/30 rounded-lg p-4 text-center border border-slate-700/50">
        <div className="text-3xl font-bold text-emerald-400">{completedCount}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Completed</div>
      </div>
    </div>
  );
};

/**
 * Philosophy quote/callout
 */
const PhilosophyCallout: React.FC = () => {
  return (
    <div className="philosophy-callout bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-purple-700/30 mb-12">
      <blockquote className="text-center">
        <p className="text-lg text-purple-200 italic mb-3">
          "The sky doesn't know about our calendars. Energy transitions gradually,
          following the golden ratio — the same curve found in seashells, galaxies, and flower petals."
        </p>
        <footer className="text-sm text-slate-500">
          — The φ-Curve Principle
        </footer>
      </blockquote>
    </div>
  );
};

/**
 * Recommended starting point
 */
const StartingPoint: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="starting-point bg-amber-900/20 rounded-xl p-6 border border-amber-700/30 mb-8">
      <div className="flex items-center gap-4">
        <div className="text-4xl">✨</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-200 mb-1">
            New to the Academy?
          </h3>
          <p className="text-sm text-slate-400">
            Start with Chapter 1: Foundations of the Zodiac.
            Each chapter builds on the previous, revealing deeper layers of understanding.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/zodiac-academy/foundations')}
          className="px-4 py-2 bg-amber-600/30 border border-amber-500/50 rounded-lg text-amber-200 hover:bg-amber-600/50 transition-colors"
        >
          Begin Journey
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const AcademyIndex: React.FC = () => {
  // Track completed chapters (would normally be persisted)
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Load completed chapters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('academy-completed-chapters');
    if (saved) {
      try {
        setCompletedIds(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const completedSet = new Set(completedIds);

  return (
    <div className="academy-index min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AcademyHero />

        <AcademyStats completedCount={completedIds.length} />

        <PhilosophyCallout />

        <StartingPoint onNavigate={handleNavigate} />

        {/* Progress tracker */}
        <div className="mb-8">
          <JourneyCompletion
            completedCount={completedIds.length}
            totalCount={ACADEMY_CHAPTERS.length}
          />
        </div>

        {/* Chapter Grid */}
        <section className="chapter-grid">
          <h2 className="text-2xl font-serif text-amber-200 mb-6">
            The Eight Chambers
          </h2>
          <div className="space-y-4">
            {ACADEMY_CHAPTERS.map((chapter, index) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                index={index}
                isCompleted={completedSet.has(chapter.id)}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>
            The Academy is part of <span className="text-purple-400">GENESIS</span> —
            a system for understanding yourself and others through the lens of time, place, and cosmic pattern.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AcademyIndex;
