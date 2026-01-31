/**
 * ZodiacAcademyPage.tsx
 * =====================
 *
 * The Western Zodiac Academy - a guided 12-chapter initiation
 * through the living zodiac system.
 *
 * Features:
 * - Chapter navigation sidebar
 * - Progress tracking
 * - Interactive Practice Mode with adaptive questions
 * - Ritual mode prompts
 * - Mythic, pedagogical language
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ACADEMY_CHAPTERS,
  AcademyChapter,
  getNextChapter,
  getPrevChapter,
} from '../data/academyCurriculum';
import PracticeMode from '../practice/PracticeMode';
import {
  FocusCategory,
  generateFocusedQuestion,
  generatePureSignQuestion,
  generateCuspQuestion,
} from '../practice/adaptiveGenerator';
import type { PracticeScore, DifficultyLevel } from '../practice/scoring';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Converts markdown-like content to HTML for lesson display
 */
function formatLessonContent(content: string): string {
  return content
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold text **text**
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic text *text*
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Headers with markdown tables
    .replace(/\| ([^|]+) \| ([^|]+) \| ([^|]+) \|/g, '<tr><td>$1</td><td>$2</td><td>$3</td></tr>')
    .replace(/\|[-\s|]+\|/g, '')
    // Lists with - prefix
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    // Wrap in paragraph
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    // Wrap consecutive li elements in ul
    .replace(/(<li>.*?<\/li>)(?=<br\/>|<\/p>|$)/gs, '<ul>$1</ul>')
    .replace(/<\/ul><br\/><ul>/g, '');
}

// =============================================================================
// CHAPTER PRACTICE MAPPINGS
// =============================================================================

type PracticeModeConfig = {
  title: string;
  generator: (difficulty?: DifficultyLevel) => ReturnType<typeof generateFocusedQuestion>;
  focusCategory?: FocusCategory;
};

/**
 * Maps chapter practice items to actual question generators
 */
const CHAPTER_PRACTICE_CONFIG: Record<string, PracticeModeConfig[]> = {
  'chapter-1-foundations': [
    { title: 'Element Recognition', generator: () => generateFocusedQuestion('elements'), focusCategory: 'elements' },
    { title: 'Modality Patterns', generator: () => generateFocusedQuestion('modalities'), focusCategory: 'modalities' },
  ],
  'chapter-2-hard-boundaries': [
    { title: 'Cusp Awareness', generator: generateCuspQuestion, focusCategory: 'cusps' },
    { title: 'Blend Comparison', generator: () => generateFocusedQuestion('phi-curve'), focusCategory: 'phi-curve' },
  ],
  'chapter-3-phi-curve': [
    { title: 'Guess the Blend', generator: () => generateFocusedQuestion('phi-curve'), focusCategory: 'phi-curve' },
    { title: 'Curve Position', generator: () => generateFocusedQuestion('phi-curve'), focusCategory: 'phi-curve' },
  ],
  'chapter-4-pure-archetypes': [
    { title: 'Sign Identification', generator: generatePureSignQuestion },
    { title: 'Shadow Patterns', generator: (d) => generatePureSignQuestion(d || 3) },
  ],
  'chapter-5-cusp-archetypes': [
    { title: 'Cusp Identification', generator: generateCuspQuestion, focusCategory: 'cusps' },
    { title: 'Cusp Day Comparison', generator: (d) => generateCuspQuestion(d || 3), focusCategory: 'cusps' },
  ],
  'chapter-6-365-map': [
    { title: 'Day Position', generator: () => generateFocusedQuestion('phi-curve'), focusCategory: 'phi-curve' },
    { title: 'Daily Tone Shifts', generator: (d) => generateCuspQuestion(d || 4) },
  ],
  'chapter-7-elemental-psychology': [
    { title: 'Elemental Diagnosis', generator: () => generateFocusedQuestion('elements'), focusCategory: 'elements' },
    { title: 'Harmony Prediction', generator: () => generateFocusedQuestion('elements'), focusCategory: 'elements' },
  ],
  'chapter-8-modalities-polarity': [
    { title: 'Modality from Behavior', generator: () => generateFocusedQuestion('modalities'), focusCategory: 'modalities' },
    { title: 'Same-Element Comparison', generator: () => generateFocusedQuestion('polarities'), focusCategory: 'polarities' },
  ],
  'chapter-9-compatibility-foundations': [
    { title: 'Elemental Dynamics', generator: () => generateFocusedQuestion('elements'), focusCategory: 'elements' },
    { title: 'Harmony Sketch', generator: generatePureSignQuestion },
  ],
  'chapter-10-seasonal-zodiac': [
    { title: 'Season Recognition', generator: generatePureSignQuestion },
    { title: 'Seasonal Neighbors', generator: (d) => generatePureSignQuestion(d || 2) },
  ],
  'chapter-11-mythic-zodiac': [
    { title: 'Myth to Sign', generator: (d) => generatePureSignQuestion(d || 3) },
    { title: 'Symbolic Themes', generator: (d) => generateCuspQuestion(d || 4), focusCategory: 'cusps' },
  ],
  'chapter-12-integration': [
    { title: 'Build Your Profile', generator: generatePureSignQuestion },
    { title: 'Interpret a Friend', generator: generateCuspQuestion, focusCategory: 'cusps' },
  ],
};

// =============================================================================
// TYPES
// =============================================================================

interface ChapterDetailProps {
  chapter: AcademyChapter;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onStartPractice: (practiceIndex: number) => void;
}

// =============================================================================
// CHAPTER DETAIL COMPONENT
// =============================================================================

const ChapterDetail: React.FC<ChapterDetailProps> = ({
  chapter,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  isCompleted,
  onMarkComplete,
  onStartPractice,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('objectives');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="academy-chapter">
      {/* Chapter Header */}
      <header className="academy-chapter-header">
        <div className="academy-chapter-meta">
          <span className="academy-chapter-icon">{chapter.icon}</span>
          <span className="academy-chapter-order">
            Chapter {chapter.order.toString().padStart(2, '0')}
          </span>
          {isCompleted && (
            <span className="academy-chapter-completed-badge">Completed</span>
          )}
        </div>
        <h1 className="academy-chapter-title">{chapter.title}</h1>
        <h2 className="academy-chapter-subtitle">{chapter.subtitle}</h2>
        <p className="academy-chapter-mythic">"{chapter.mythicTagline}"</p>
      </header>

      {/* Learning Objectives */}
      <section className="academy-section">
        <button
          className="academy-section-header"
          onClick={() => toggleSection('objectives')}
        >
          <span className="academy-section-icon">🎯</span>
          <span className="academy-section-title">Learning Objectives</span>
          <span className="academy-section-toggle">
            {expandedSection === 'objectives' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'objectives' && (
          <div className="academy-section-content">
            <ul className="academy-list">
              {chapter.objectives.map((obj, idx) => (
                <li key={idx} className="academy-list-item">
                  <span className="academy-list-bullet">◆</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Lesson Content */}
      {chapter.lessonContent && chapter.lessonContent.length > 0 && (
        <section className="academy-section">
          <button
            className="academy-section-header"
            onClick={() => toggleSection('lessons')}
          >
            <span className="academy-section-icon">📖</span>
            <span className="academy-section-title">Lesson Content</span>
            <span className="academy-section-toggle">
              {expandedSection === 'lessons' ? '−' : '+'}
            </span>
          </button>
          {expandedSection === 'lessons' && (
            <div className="academy-section-content">
              <div className="academy-lessons">
                {chapter.lessonContent.map((lesson, idx) => (
                  <div key={idx} className="academy-lesson-card">
                    <div className="academy-lesson-header">
                      {lesson.icon && <span className="academy-lesson-icon">{lesson.icon}</span>}
                      <h3 className="academy-lesson-title">{lesson.title}</h3>
                    </div>
                    <div
                      className="academy-lesson-content"
                      dangerouslySetInnerHTML={{
                        __html: formatLessonContent(lesson.content)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Core Concepts */}
      <section className="academy-section">
        <button
          className="academy-section-header"
          onClick={() => toggleSection('concepts')}
        >
          <span className="academy-section-icon">📚</span>
          <span className="academy-section-title">Core Concepts</span>
          <span className="academy-section-toggle">
            {expandedSection === 'concepts' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'concepts' && (
          <div className="academy-section-content">
            <ul className="academy-list">
              {chapter.coreConcepts.map((concept, idx) => (
                <li key={idx} className="academy-list-item">
                  <span className="academy-list-bullet">◇</span>
                  {concept}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Practice Mode */}
      <section className="academy-section">
        <button
          className="academy-section-header"
          onClick={() => toggleSection('practice')}
        >
          <span className="academy-section-icon">🧪</span>
          <span className="academy-section-title">Practice Mode</span>
          <span className="academy-section-toggle">
            {expandedSection === 'practice' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'practice' && (
          <div className="academy-section-content">
            <div className="academy-practice-grid">
              {chapter.practiceMode.map((item, idx) => (
                <div key={idx} className="academy-practice-card">
                  <div className="academy-practice-label">{item.label}</div>
                  <div className="academy-practice-description">{item.description}</div>
                  <button
                    className="academy-practice-button active"
                    onClick={() => onStartPractice(idx)}
                  >
                    Start Practice
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Ritual Mode Prompts */}
      <section className="academy-section">
        <button
          className="academy-section-header"
          onClick={() => toggleSection('ritual')}
        >
          <span className="academy-section-icon">🕯️</span>
          <span className="academy-section-title">Ritual Prompts</span>
          <span className="academy-section-toggle">
            {expandedSection === 'ritual' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'ritual' && (
          <div className="academy-section-content">
            <div className="academy-ritual-prompts">
              {chapter.ritualModePrompts.map((prompt, idx) => (
                <div key={idx} className="academy-ritual-card">
                  <span className="academy-ritual-number">{idx + 1}</span>
                  <p className="academy-ritual-text">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Chapter Footer */}
      <footer className="academy-chapter-footer">
        {!isCompleted && (
          <button
            className="academy-complete-button"
            onClick={onMarkComplete}
          >
            Mark Chapter Complete
          </button>
        )}
        <div className="academy-nav-buttons">
          <button
            className="academy-nav-button prev"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            ← Previous
          </button>
          <button
            className="academy-nav-button next"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next Chapter →
          </button>
        </div>
      </footer>
    </div>
  );
};

// =============================================================================
// PRACTICE MODAL COMPONENT
// =============================================================================

interface PracticeModalProps {
  isOpen: boolean;
  title: string;
  generator: PracticeModeConfig['generator'];
  focusCategory?: FocusCategory;
  onClose: () => void;
  onComplete: (score: PracticeScore) => void;
}

const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  title,
  generator,
  focusCategory,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="practice-modal-overlay" onClick={onClose}>
      <div className="practice-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="practice-modal-header">
          <h2 className="practice-modal-title">{title}</h2>
          <button className="practice-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="practice-modal-body">
          <PracticeMode
            generateQuestion={generator}
            focusCategory={focusCategory}
            title={title}
            onComplete={onComplete}
            maxQuestions={10}
          />
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ZodiacAcademyPage() {
  const navigate = useNavigate();
  const [activeChapterId, setActiveChapterId] = useState(ACADEMY_CHAPTERS[0]?.id);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [activePractice, setActivePractice] = useState<{
    config: PracticeModeConfig;
    chapterId: string;
  } | null>(null);

  // Get active chapter
  const activeChapter = useMemo(() => {
    return ACADEMY_CHAPTERS.find((c) => c.id === activeChapterId);
  }, [activeChapterId]);

  // Calculate progress
  const progress = useMemo(() => {
    return Math.round((completedChapters.size / ACADEMY_CHAPTERS.length) * 100);
  }, [completedChapters]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (!activeChapterId) return;
    const next = getNextChapter(activeChapterId);
    if (next) setActiveChapterId(next.id);
  }, [activeChapterId]);

  const goToPrev = useCallback(() => {
    if (!activeChapterId) return;
    const prev = getPrevChapter(activeChapterId);
    if (prev) setActiveChapterId(prev.id);
  }, [activeChapterId]);

  // Mark chapter complete
  const handleMarkComplete = useCallback(() => {
    if (!activeChapterId) return;
    setCompletedChapters((prev) => {
      const next = new Set(prev);
      next.add(activeChapterId);
      return next;
    });
  }, [activeChapterId]);

  // Start practice mode
  const handleStartPractice = useCallback((practiceIndex: number) => {
    if (!activeChapterId) return;
    const chapterConfig = CHAPTER_PRACTICE_CONFIG[activeChapterId];
    if (chapterConfig && chapterConfig[practiceIndex]) {
      setActivePractice({
        config: chapterConfig[practiceIndex],
        chapterId: activeChapterId,
      });
    }
  }, [activeChapterId]);

  // Close practice mode
  const handleClosePractice = useCallback(() => {
    setActivePractice(null);
  }, []);

  // Handle practice completion
  const handlePracticeComplete = useCallback((score: PracticeScore) => {
    console.log('Practice completed:', score);
    // Could save to localStorage or show a summary
    setTimeout(() => {
      setActivePractice(null);
    }, 3000); // Show final score for 3 seconds
  }, []);

  return (
    <div className="academy-root">
      {/* Sidebar Navigation */}
      <aside className="academy-sidebar">
        <div className="academy-sidebar-header">
          <button
            onClick={() => navigate('/zodiac-learning')}
            className="academy-back-button"
          >
            ← Back to Wheel
          </button>
          <h2 className="academy-sidebar-title">
            <span className="academy-sidebar-icon">🏛️</span>
            Western Zodiac Academy
          </h2>
          <p className="academy-sidebar-tagline">
            A guided journey through the living zodiac
          </p>

          {/* Progress Bar */}
          <div className="academy-progress">
            <div className="academy-progress-label">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="academy-progress-bar">
              <div
                className="academy-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="academy-progress-count">
              {completedChapters.size} of {ACADEMY_CHAPTERS.length} chapters
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <nav className="academy-nav">
          <ul className="academy-nav-list">
            {ACADEMY_CHAPTERS.map((chapter) => {
              const isActive = chapter.id === activeChapterId;
              const isCompleted = completedChapters.has(chapter.id);

              return (
                <li key={chapter.id}>
                  <button
                    className={`academy-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => setActiveChapterId(chapter.id)}
                  >
                    <span className="academy-nav-status">
                      {isCompleted ? '✓' : chapter.order.toString().padStart(2, '0')}
                    </span>
                    <span className="academy-nav-icon">{chapter.icon}</span>
                    <span className="academy-nav-title">{chapter.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="academy-main">
        {activeChapter ? (
          <ChapterDetail
            chapter={activeChapter}
            onNext={goToNext}
            onPrev={goToPrev}
            hasPrev={activeChapter.order > 1}
            hasNext={activeChapter.order < ACADEMY_CHAPTERS.length}
            isCompleted={completedChapters.has(activeChapter.id)}
            onMarkComplete={handleMarkComplete}
            onStartPractice={handleStartPractice}
          />
        ) : (
          <div className="academy-empty">
            <p>Select a chapter to begin your journey.</p>
          </div>
        )}
      </main>

      {/* Practice Modal */}
      {activePractice && (
        <PracticeModal
          isOpen={!!activePractice}
          title={activePractice.config.title}
          generator={activePractice.config.generator}
          focusCategory={activePractice.config.focusCategory}
          onClose={handleClosePractice}
          onComplete={handlePracticeComplete}
        />
      )}

      {/* Inline Styles */}
      <style>{`
        .academy-root {
          display: grid;
          grid-template-columns: 320px 1fr;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          color: #e5e7eb;
        }

        /* Sidebar */
        .academy-sidebar {
          background: rgba(15, 23, 42, 0.95);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .academy-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .academy-back-button {
          background: none;
          border: none;
          color: #60a5fa;
          cursor: pointer;
          font-size: 13px;
          padding: 0;
          margin-bottom: 16px;
          display: block;
        }

        .academy-back-button:hover {
          color: #93c5fd;
        }

        .academy-sidebar-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .academy-sidebar-icon {
          font-size: 20px;
        }

        .academy-sidebar-tagline {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
          font-style: italic;
        }

        /* Progress */
        .academy-progress {
          margin-top: 20px;
        }

        .academy-progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .academy-progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .academy-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          border-radius: 3px;
          transition: width 0.3s ease-out;
        }

        .academy-progress-count {
          font-size: 10px;
          color: #6b7280;
          margin-top: 4px;
          text-align: right;
        }

        /* Navigation */
        .academy-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;
        }

        .academy-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .academy-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          color: #9ca3af;
          font-size: 13px;
          transition: all 0.15s ease-out;
        }

        .academy-nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e5e7eb;
        }

        .academy-nav-item.active {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border-left: 3px solid #60a5fa;
        }

        .academy-nav-item.completed {
          color: #4ade80;
        }

        .academy-nav-item.completed .academy-nav-status {
          color: #4ade80;
        }

        .academy-nav-status {
          font-family: monospace;
          font-size: 11px;
          min-width: 20px;
          color: #6b7280;
        }

        .academy-nav-icon {
          font-size: 14px;
        }

        .academy-nav-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Main Content */
        .academy-main {
          padding: 32px 40px;
          overflow-y: auto;
          max-width: 900px;
        }

        /* Chapter Detail */
        .academy-chapter {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .academy-chapter-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .academy-chapter-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .academy-chapter-icon {
          font-size: 32px;
        }

        .academy-chapter-order {
          font-family: monospace;
          font-size: 12px;
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.15);
          padding: 4px 10px;
          border-radius: 12px;
        }

        .academy-chapter-completed-badge {
          font-size: 11px;
          color: #4ade80;
          background: rgba(74, 222, 128, 0.15);
          padding: 4px 10px;
          border-radius: 12px;
        }

        .academy-chapter-title {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #fff;
        }

        .academy-chapter-subtitle {
          font-size: 16px;
          font-weight: 400;
          color: #fbbf24;
          margin: 0 0 12px 0;
        }

        .academy-chapter-mythic {
          font-size: 14px;
          font-style: italic;
          color: #a78bfa;
          margin: 0;
        }

        /* Sections */
        .academy-section {
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .academy-section-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: none;
          cursor: pointer;
          text-align: left;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 600;
        }

        .academy-section-header:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .academy-section-icon {
          font-size: 16px;
        }

        .academy-section-title {
          flex: 1;
        }

        .academy-section-toggle {
          font-size: 16px;
          color: #6b7280;
        }

        .academy-section-content {
          padding: 16px;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Lists */
        .academy-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .academy-list-item {
          display: flex;
          gap: 10px;
          padding: 8px 0;
          font-size: 13px;
          line-height: 1.6;
          color: #d1d5db;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .academy-list-item:last-child {
          border-bottom: none;
        }

        .academy-list-bullet {
          color: #60a5fa;
          font-size: 10px;
          margin-top: 4px;
        }

        /* Lesson Cards */
        .academy-lessons {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .academy-lesson-card {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 12px;
          padding: 20px;
        }

        .academy-lesson-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .academy-lesson-icon {
          font-size: 24px;
        }

        .academy-lesson-title {
          font-size: 16px;
          font-weight: 600;
          color: #60a5fa;
          margin: 0;
        }

        .academy-lesson-content {
          font-size: 14px;
          line-height: 1.8;
          color: #d1d5db;
        }

        .academy-lesson-content p {
          margin: 0 0 12px 0;
        }

        .academy-lesson-content p:last-child {
          margin-bottom: 0;
        }

        .academy-lesson-content strong {
          color: #fbbf24;
          font-weight: 600;
        }

        .academy-lesson-content em {
          color: #a78bfa;
          font-style: italic;
        }

        .academy-lesson-content ul {
          margin: 8px 0;
          padding-left: 20px;
          list-style: none;
        }

        .academy-lesson-content li {
          position: relative;
          padding-left: 16px;
          margin-bottom: 6px;
        }

        .academy-lesson-content li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #60a5fa;
        }

        .academy-lesson-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 13px;
        }

        .academy-lesson-content td {
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }

        .academy-lesson-content tr:first-child td {
          background: rgba(59, 130, 246, 0.1);
          font-weight: 600;
          color: #60a5fa;
        }

        /* Practice Cards */
        .academy-practice-grid {
          display: grid;
          gap: 12px;
        }

        .academy-practice-card {
          background: rgba(251, 191, 36, 0.05);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 8px;
          padding: 14px;
        }

        .academy-practice-label {
          font-size: 13px;
          font-weight: 600;
          color: #fbbf24;
          margin-bottom: 6px;
        }

        .academy-practice-description {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .academy-practice-button {
          font-size: 11px;
          padding: 6px 12px;
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 6px;
          color: #fbbf24;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .academy-practice-button.active {
          cursor: pointer;
          opacity: 1;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.3));
          border-color: rgba(251, 191, 36, 0.5);
          transition: all 0.2s ease-out;
        }

        .academy-practice-button.active:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.4));
        }

        /* Ritual Cards */
        .academy-ritual-prompts {
          display: grid;
          gap: 12px;
        }

        .academy-ritual-card {
          display: flex;
          gap: 14px;
          background: rgba(167, 139, 250, 0.05);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 8px;
          padding: 14px;
        }

        .academy-ritual-number {
          font-family: monospace;
          font-size: 14px;
          font-weight: 600;
          color: #a78bfa;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(167, 139, 250, 0.15);
          border-radius: 50%;
        }

        .academy-ritual-text {
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }

        /* Footer */
        .academy-chapter-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .academy-complete-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease-out;
        }

        .academy-complete-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
        }

        .academy-nav-buttons {
          display: flex;
          gap: 10px;
        }

        .academy-nav-button {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #9ca3af;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s ease-out;
        }

        .academy-nav-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }

        .academy-nav-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .academy-nav-button.next {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .academy-nav-button.next:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.25);
        }

        /* Empty State */
        .academy-empty {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .academy-root {
            grid-template-columns: 1fr;
          }

          .academy-sidebar {
            display: none;
          }

          .academy-main {
            padding: 20px;
          }
        }

        /* Practice Modal */
        .practice-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .practice-modal-content {
          background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .practice-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .practice-modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #fbbf24;
          margin: 0;
        }

        .practice-modal-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          color: #9ca3af;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease-out;
        }

        .practice-modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .practice-modal-body {
          padding: 24px;
        }
      `}</style>
    </div>
  );
}
