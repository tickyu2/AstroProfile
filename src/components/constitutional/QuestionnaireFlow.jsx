/**
 * QuestionnaireFlow.jsx
 * Constitutional Assessment Questionnaire Flow
 *
 * 5 carefully crafted questions to reveal constitutional expression:
 * 1. Peak Energy Expression
 * 2. Challenge Response Style
 * 3. Relationship Nurturing Mode
 * 4. Energy Depletion Triggers
 * 5. Peak Joy Expression
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { ConstitutionalOption, OptionGrid } from './ConstitutionalOption';

// All 5 constitutional questions with element-mapped options
const CONSTITUTIONAL_QUESTIONS = [
  {
    id: 'energy',
    title: 'Peak Energy Expression',
    subtitle: 'When you\'re at your absolute best and most authentic, you tend to...',
    options: [
      {
        element: 'Fire',
        title: 'Ignite & Inspire',
        description: 'Start exciting projects and energize everyone around you',
        traits: ['Bold action', 'Infectious enthusiasm', 'Leadership energy']
      },
      {
        element: 'Earth',
        title: 'Ground & Nurture',
        description: 'Create stable, beautiful environments where people feel safe',
        traits: ['Natural hosting', 'Comfort creation', 'Steady presence']
      },
      {
        element: 'Metal',
        title: 'Focus & Precision',
        description: 'Cut through problems with laser focus and systematic approach',
        traits: ['Analytical clarity', 'Efficient solutions', 'Quality standards']
      },
      {
        element: 'Water',
        title: 'Flow & Depth',
        description: 'Navigate around obstacles and find deeper truths',
        traits: ['Emotional wisdom', 'Adaptive strategy', 'Intuitive insight']
      },
      {
        element: 'Wood',
        title: 'Grow & Expand',
        description: 'Turn ideas into reality and help others reach potential',
        traits: ['Creative growth', 'Flexible strength', 'Nurturing development']
      }
    ]
  },
  {
    id: 'challenge',
    title: 'Challenge Response',
    subtitle: 'When facing a major life challenge, your first instinct is to...',
    options: [
      {
        element: 'Fire',
        title: 'Attack Head-On',
        description: 'Take bold action immediately and rally others to the cause',
        traits: ['Courageous', 'Mobilizing', 'Direct confrontation']
      },
      {
        element: 'Earth',
        title: 'Ground & Gather',
        description: 'Ground yourself, gather resources, build a solid foundation',
        traits: ['Methodical', 'Resource-focused', 'Stability-building']
      },
      {
        element: 'Metal',
        title: 'Analyze & Eliminate',
        description: 'Precisely analyze what needs to be cut away to reach solution',
        traits: ['Strategic', 'Discerning', 'Surgical precision']
      },
      {
        element: 'Water',
        title: 'Feel & Flow',
        description: 'Feel deeply into the situation and find path of least resistance',
        traits: ['Intuitive', 'Adaptable', 'Emotionally intelligent']
      },
      {
        element: 'Wood',
        title: 'Grow Through It',
        description: 'See it as growth opportunity and adapt while staying rooted',
        traits: ['Resilient', 'Opportunity-focused', 'Rooted flexibility']
      }
    ]
  },
  {
    id: 'relationship',
    title: 'Relationship Style',
    subtitle: 'In close relationships, you naturally tend to...',
    options: [
      {
        element: 'Fire',
        title: 'Inspire Greatness',
        description: 'Inspire partners to be their biggest, boldest selves',
        traits: ['Cheerleader energy', 'Vision-sharing', 'Spark igniter']
      },
      {
        element: 'Earth',
        title: 'Create Safe Harbor',
        description: 'Create stability and comfort where others can be vulnerable',
        traits: ['Nurturing', 'Dependable', 'Safe space creator']
      },
      {
        element: 'Metal',
        title: 'Refine & Focus',
        description: 'Help partners focus and eliminate what doesn\'t serve them',
        traits: ['Clarity-bringer', 'Standards-holder', 'Truth-teller']
      },
      {
        element: 'Water',
        title: 'Deep Understanding',
        description: 'Provide emotional depth and intuitive understanding',
        traits: ['Empathic', 'Soul-reader', 'Emotional anchor']
      },
      {
        element: 'Wood',
        title: 'Support Growth',
        description: 'Support steady growth and help partners flourish',
        traits: ['Patient gardener', 'Potential-seer', 'Growth catalyst']
      }
    ]
  },
  {
    id: 'depletion',
    title: 'Energy Drains',
    subtitle: 'You feel most drained and depleted when...',
    options: [
      {
        element: 'Fire',
        title: 'Stuck in Routine',
        description: 'Stuck in routine without creative expression or inspiration',
        traits: ['Boredom', 'Stagnation', 'Lack of spark']
      },
      {
        element: 'Earth',
        title: 'Chaos & Instability',
        description: 'In chaotic, unstable environments without grounding',
        traits: ['Upheaval', 'Unpredictability', 'Rootlessness']
      },
      {
        element: 'Metal',
        title: 'Inefficiency & Confusion',
        description: 'Dealing with inefficiency, confusion, or unclear standards',
        traits: ['Disorder', 'Mediocrity', 'Lack of clarity']
      },
      {
        element: 'Water',
        title: 'Surface Interactions',
        description: 'In superficial interactions without emotional authenticity',
        traits: ['Shallow talk', 'Emotional walls', 'Disconnection']
      },
      {
        element: 'Wood',
        title: 'Restricted Growth',
        description: 'Controlled or restricted from natural growth and expansion',
        traits: ['Micromanagement', 'Limitation', 'Blocked potential']
      }
    ]
  },
  {
    id: 'joy',
    title: 'Peak Joy',
    subtitle: 'You feel most alive and joyful when...',
    options: [
      {
        element: 'Fire',
        title: 'Leading Adventures',
        description: 'Leading adventures or creating breakthrough moments',
        traits: ['Excitement', 'Pioneering', 'Memorable moments']
      },
      {
        element: 'Earth',
        title: 'Nurturing Others',
        description: 'Nurturing others in beautiful, harmonious surroundings',
        traits: ['Hosting', 'Comfort-giving', 'Creating beauty']
      },
      {
        element: 'Metal',
        title: 'Achieving Excellence',
        description: 'Achieving precision and excellence in meaningful work',
        traits: ['Mastery', 'Quality', 'Perfect execution']
      },
      {
        element: 'Water',
        title: 'Deep Connection',
        description: 'In deep, flowing connection with people who truly "get" you',
        traits: ['Soul bonds', 'Understanding', 'Emotional flow']
      },
      {
        element: 'Wood',
        title: 'Growing & Flourishing',
        description: 'Growing something beautiful and helping others flourish too',
        traits: ['Development', 'Cultivation', 'Collective growth']
      }
    ]
  }
];

/**
 * QuestionnaireFlow Component
 *
 * @param {Object} props
 * @param {Object} props.birthData - User's birth data from AstroProfile
 * @param {Function} props.onComplete - Callback when questionnaire is complete
 * @param {Function} props.onCancel - Callback to cancel questionnaire
 */
export function QuestionnaireFlow({ birthData, onComplete, onCancel }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = CONSTITUTIONAL_QUESTIONS.length;
  const question = CONSTITUTIONAL_QUESTIONS[currentQuestion];
  const selectedElement = responses[question.id];

  // Handle option selection
  const handleSelect = (element) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: element
    }));
  };

  // Navigate to next question
  const handleNext = () => {
    if (!selectedElement) return;

    if (currentQuestion < totalQuestions - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Complete - calculate results
      handleComplete();
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Complete questionnaire and calculate results
  const handleComplete = () => {
    const responseArray = CONSTITUTIONAL_QUESTIONS.map(q => ({
      questionId: q.id,
      element: responses[q.id]
    }));

    onComplete(responseArray);
  };

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const canProceed = !!selectedElement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🌹</span>
              Constitutional Assessment
            </h1>
            <p className="text-white/50 mt-1">
              Discover your true elemental expression
            </p>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-white/50 hover:text-white/80 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Question Card with Animation */}
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'}`}>
        <QuestionCard
          number={currentQuestion + 1}
          title={question.title}
          subtitle={question.subtitle}
          totalQuestions={totalQuestions}
        >
          <OptionGrid>
            {question.options.map((option) => (
              <ConstitutionalOption
                key={option.element}
                element={option.element}
                title={option.title}
                description={option.description}
                traits={option.traits}
                selected={selectedElement === option.element}
                onSelect={handleSelect}
              />
            ))}
          </OptionGrid>
        </QuestionCard>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-5xl mx-auto mt-8 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            currentQuestion === 0
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          {CONSTITUTIONAL_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestion
                  ? 'bg-amber-500 scale-125'
                  : index < currentQuestion
                    ? 'bg-amber-500/50'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-xl font-semibold transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Complete ✨' : 'Next →'}
        </button>
      </div>

      {/* Selection Hint */}
      {!selectedElement && (
        <div className="max-w-5xl mx-auto mt-6 text-center">
          <p className="text-white/40 text-sm animate-pulse">
            Select an option above to continue
          </p>
        </div>
      )}
    </div>
  );
}

export default QuestionnaireFlow;
