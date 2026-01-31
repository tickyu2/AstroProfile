import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DailyLifeScenarios.css';

/**
 * Daily Life Infrastructure Assessment
 * THE REVOLUTIONARY COMPONENT - The 95% of life that isn't romance
 *
 * Reveals compatibility in:
 * - Finance Architecture
 * - Domestic Labor Division (THE DISHES! THE GROCERY BAGS!)
 * - Stress Relief Patterns
 * - Daily Rhythms
 * - Environmental Needs
 */
export function DailyLifeScenarios({ onComplete, existingResponses = {} }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(existingResponses);
  const [showFollowup, setShowFollowup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedFollowupOption, setSelectedFollowupOption] = useState(null);

  // The Revolutionary Scenarios
  const sections = [
    {
      id: 'finance',
      title: '💰 Finance Architecture',
      description: 'How you handle money in relationships',
      questions: [
        {
          id: "fin1",
          scenario: "You and your partner both work. How do you handle money?",
          options: [
            { 
              text: "100% joint - everything is 'our money'", 
              value: { style: "fully-joint", philosophy: "complete-unity" }
            },
            { 
              text: "Joint for bills, separate for personal spending", 
              value: { style: "hybrid", philosophy: "practical-unity" }
            },
            { 
              text: "Mostly separate, split bills proportionally", 
              value: { style: "proportional-split", philosophy: "fair-independence" }
            },
            { 
              text: "Completely separate accounts, split bills 50/50", 
              value: { style: "independent", philosophy: "complete-independence" }
            },
            { 
              text: "One person manages everything", 
              value: { style: "single-manager", philosophy: "trust-delegation" }
            }
          ]
        },
        {
          id: "fin2",
          scenario: "Your partner wants to make a $500 purchase. Do they need to ask?",
          options: [
            { 
              text: "Yes - we discuss all purchases over $50", 
              value: { threshold: 50, style: "collaborative-detailed" }
            },
            { 
              text: "Yes - we discuss purchases over $200-500", 
              value: { threshold: 300, style: "collaborative-moderate" }
            },
            { 
              text: "No - we only discuss purchases over $1000", 
              value: { threshold: 1000, style: "autonomous-high" }
            },
            { 
              text: "No - we each have complete autonomy", 
              value: { threshold: null, style: "fully-autonomous" }
            }
          ]
        },
        {
          id: "fin3",
          scenario: "How do you approach saving vs spending?",
          options: [
            { 
              text: "Strict budget - every dollar allocated", 
              value: { style: "structured", saveRate: "high" }
            },
            { 
              text: "Save X% first, rest is flexible", 
              value: { style: "save-first", saveRate: "moderate-high" }
            },
            { 
              text: "General guidelines, adjust as needed", 
              value: { style: "flexible", saveRate: "moderate" }
            },
            { 
              text: "No formal budget - just be reasonable", 
              value: { style: "informal", saveRate: "variable" }
            },
            { 
              text: "YOLO - enjoy life while we can", 
              value: { style: "spontaneous", saveRate: "low" }
            }
          ]
        }
      ]
    },
    {
      id: 'domestic',
      title: '🏠 Domestic Labor',
      description: 'How you handle household responsibilities',
      questions: [
        {
          id: "dom1",
          scenario: "🍽️ THE DISHES SCENARIO:\n\nIt's late. You're both tired. There's a sink full of dirty dishes.",
          isSpecial: true,
          options: [
            { 
              text: "I wash them now - can't sleep with dirty kitchen", 
              value: { immediacy: "must-do-now", standard: "high", constitutionalHint: "Metal" }
            },
            { 
              text: "We agree who's doing them tonight", 
              value: { immediacy: "delegate-now", standard: "moderate-high", constitutionalHint: "Fire" }
            },
            { 
              text: "Tomorrow morning is fine", 
              value: { immediacy: "can-wait", standard: "moderate", constitutionalHint: "Earth" }
            },
            { 
              text: "They'll get done whenever", 
              value: { immediacy: "no-urgency", standard: "low", constitutionalHint: "Water" }
            }
          ],
          followup: {
            question: "FOLLOWUP: If your partner leaves dishes overnight and you wake up to them:",
            options: [
              { 
                text: "I'm frustrated - we agreed on clean kitchen", 
                value: { response: "bothered", conflictStyle: "direct", flexibilityScore: 2 }
              },
              { 
                text: "I wash them quickly without comment", 
                value: { response: "just-do-it", conflictStyle: "avoidant", flexibilityScore: 7 }
              },
              { 
                text: "I mention it calmly - let's discuss", 
                value: { response: "communicate", conflictStyle: "collaborative", flexibilityScore: 8 }
              },
              { 
                text: "Doesn't bother me at all", 
                value: { response: "unbothered", conflictStyle: "accepting", flexibilityScore: 10 }
              }
            ]
          }
        },
        {
          id: "dom2",
          scenario: "🛍️ THE GROCERY BAGS QUESTION:\n\nYou arrive home with 10 bags of groceries. You:",
          isSpecial: true,
          options: [
            { 
              text: "Bring in all 10 bags at once - one trip!", 
              value: { approach: "efficiency", trait: "decisive", constitutionalHint: "Fire/Metal" }
            },
            { 
              text: "Make 2-3 trips, reasonable loads", 
              value: { approach: "practical", trait: "balanced", constitutionalHint: "Earth" }
            },
            { 
              text: "Bring heavy/cold items first, rest later", 
              value: { approach: "prioritized", trait: "strategic", constitutionalHint: "Wood" }
            },
            { 
              text: "Call for help - this is a two-person job", 
              value: { approach: "collaborative", trait: "communal", constitutionalHint: "Water" }
            },
            { 
              text: "Make multiple leisurely trips", 
              value: { approach: "relaxed", trait: "unhurried", constitutionalHint: "Earth/Water" }
            }
          ]
        },
        {
          id: "dom3",
          scenario: "Who cooks dinner in a typical week?",
          options: [
            { 
              text: "I cook every night - I enjoy it", 
              value: { division: "one-person-primary", satisfaction: "high" }
            },
            { 
              text: "We alternate days (structured schedule)", 
              value: { division: "scheduled-split", satisfaction: "high" }
            },
            { 
              text: "Whoever has time/energy that day", 
              value: { division: "flexible", satisfaction: "moderate" }
            },
            { 
              text: "We often cook together", 
              value: { division: "collaborative", satisfaction: "high" }
            },
            { 
              text: "We usually order/eat out", 
              value: { division: "external", satisfaction: "variable" }
            }
          ]
        },
        {
          id: "dom4",
          scenario: "It's Saturday morning. The house needs cleaning. You:",
          options: [
            { 
              text: "Have a schedule - certain chores each weekend", 
              value: { style: "routine", organization: "high" }
            },
            { 
              text: "Make a list, divide tasks fairly", 
              value: { style: "organized", organization: "moderate-high" }
            },
            { 
              text: "Both pitch in as needed, no formal system", 
              value: { style: "organic", organization: "moderate" }
            },
            { 
              text: "One person does it while other rests", 
              value: { style: "takes-turns", organization: "low-moderate" }
            },
            { 
              text: "Hire someone to clean", 
              value: { style: "outsourced", organization: "delegated" }
            }
          ]
        }
      ]
    },
    {
      id: 'stress',
      title: '😰 Stress Relief',
      description: 'How you decompress and recharge',
      questions: [
        {
          id: "stress1",
          scenario: "You've had an extremely stressful week. To decompress, you need to:",
          options: [
            { 
              text: "Go out - party, concert, social activity", 
              value: { style: "social-active", energy: "external", intensity: "high" }
            },
            { 
              text: "Exercise hard - gym, run, intense workout", 
              value: { style: "physical-active", energy: "self", intensity: "high" }
            },
            { 
              text: "Create something - art, music, build something", 
              value: { style: "creative", energy: "self", intensity: "moderate" }
            },
            { 
              text: "Escape - binge TV, video games, fantasy", 
              value: { style: "escapism", energy: "passive", intensity: "low" }
            },
            { 
              text: "Complete solitude - phone off, alone", 
              value: { style: "isolation", energy: "internal", intensity: "low" }
            },
            { 
              text: "Talk it through with close friend/partner", 
              value: { style: "verbal-processing", energy: "relational", intensity: "moderate" }
            }
          ]
        },
        {
          id: "stress2",
          scenario: "When you're stressed, you're most likely to:",
          options: [
            { 
              text: "Get more energetic and active", 
              value: { response: "activation", pattern: "fight" }
            },
            { 
              text: "Shut down and withdraw", 
              value: { response: "withdrawal", pattern: "freeze" }
            },
            { 
              text: "Get irritable and snappy", 
              value: { response: "irritability", pattern: "fight" }
            },
            { 
              text: "Become quiet and internal", 
              value: { response: "internalization", pattern: "flight" }
            },
            { 
              text: "Seek connection and support", 
              value: { response: "connection", pattern: "tend-befriend" }
            }
          ]
        },
        {
          id: "stress3",
          scenario: "Your ideal vacation to recharge is:",
          options: [
            { 
              text: "Adventure - hiking, activities, exploring", 
              value: { style: "adventure", pace: "active", recovery: "stimulation" }
            },
            { 
              text: "Beach/resort - lazy days, no schedule", 
              value: { style: "relaxation", pace: "slow", recovery: "rest" }
            },
            { 
              text: "Cultural - museums, history, learning", 
              value: { style: "cultural", pace: "moderate", recovery: "enrichment" }
            },
            { 
              text: "Social - visiting friends/family", 
              value: { style: "social", pace: "variable", recovery: "connection" }
            },
            { 
              text: "Staycation - home with no obligations", 
              value: { style: "home", pace: "minimal", recovery: "solitude" }
            }
          ]
        }
      ]
    },
    {
      id: 'rhythms',
      title: '⏰ Daily Rhythms',
      description: 'Your natural daily patterns',
      questions: [
        {
          id: "rhythm1",
          scenario: "Your natural wake-up time (without alarm) is:",
          options: [
            { 
              text: "Before 6 AM - early bird", 
              value: { chronotype: "extreme-morning", wakeTime: "5:00" }
            },
            { 
              text: "6-7:30 AM - morning person", 
              value: { chronotype: "morning", wakeTime: "6:45" }
            },
            { 
              text: "7:30-9 AM - moderate", 
              value: { chronotype: "moderate", wakeTime: "8:15" }
            },
            { 
              text: "9-11 AM - night owl", 
              value: { chronotype: "evening", wakeTime: "10:00" }
            },
            { 
              text: "After 11 AM - extreme night owl", 
              value: { chronotype: "extreme-evening", wakeTime: "11:30" }
            }
          ]
        },
        {
          id: "rhythm2",
          scenario: "In the morning, you need:",
          options: [
            { 
              text: "30+ minutes of quiet before talking to anyone", 
              value: { need: "silence", socialTolerance: "low" }
            },
            { 
              text: "Coffee/tea but can function", 
              value: { need: "caffeine-only", socialTolerance: "moderate" }
            },
            { 
              text: "Ready to engage immediately", 
              value: { need: "none", socialTolerance: "high" }
            },
            { 
              text: "Slow morning routine (shower, breakfast, ease in)", 
              value: { need: "ritual", socialTolerance: "low-moderate" }
            }
          ]
        },
        {
          id: "rhythm3",
          scenario: "Evening wind-down typically looks like:",
          options: [
            { 
              text: "Active - gym, projects, social until late", 
              value: { style: "active", energy: "high", bedtime: "late" }
            },
            { 
              text: "Relaxing - TV, reading, light activities", 
              value: { style: "passive", energy: "low", bedtime: "moderate" }
            },
            { 
              text: "Productive - work, side projects, learning", 
              value: { style: "productive", energy: "focused", bedtime: "variable" }
            },
            { 
              text: "Social - texting friends, calls, browsing", 
              value: { style: "social", energy: "moderate", bedtime: "late" }
            },
            { 
              text: "Crash - exhausted by 9pm", 
              value: { style: "early-sleep", energy: "depleted", bedtime: "early" }
            }
          ]
        }
      ]
    },
    {
      id: 'environment',
      title: '🌡️ Environmental Needs',
      description: 'Your physical space preferences',
      questions: [
        {
          id: "env1",
          scenario: "Your ideal living space is:",
          options: [
            { 
              text: "Minimalist - only essentials, clear surfaces", 
              value: { style: "minimal", stimulation: "low", organization: "high" }
            },
            { 
              text: "Organized - everything in place but decorated", 
              value: { style: "organized", stimulation: "moderate", organization: "high" }
            },
            { 
              text: "Lived-in - comfortable 'organized chaos'", 
              value: { style: "casual", stimulation: "moderate", organization: "moderate" }
            },
            { 
              text: "Creative - eclectic, full of personality", 
              value: { style: "eclectic", stimulation: "high", organization: "low-moderate" }
            },
            { 
              text: "Maximalist - collections, decorations, full", 
              value: { style: "maximal", stimulation: "very-high", organization: "low" }
            }
          ]
        },
        {
          id: "env2",
          scenario: "Temperature preference in shared space:",
          options: [
            { 
              text: "Cold (65°F/18°C) - I run hot", 
              value: { temp: 65, preference: "cold", metabolism: "high" }
            },
            { 
              text: "Cool (68-70°F/20-21°C)", 
              value: { temp: 69, preference: "cool", metabolism: "moderate-high" }
            },
            { 
              text: "Moderate (70-72°F/21-22°C)", 
              value: { temp: 71, preference: "moderate", metabolism: "moderate" }
            },
            { 
              text: "Warm (72-75°F/22-24°C)", 
              value: { temp: 73, preference: "warm", metabolism: "moderate-low" }
            },
            { 
              text: "Hot (75°F+/24°C+) - I'm always cold", 
              value: { temp: 76, preference: "hot", metabolism: "low" }
            }
          ]
        },
        {
          id: "env3",
          scenario: "Noise tolerance in home environment:",
          options: [
            { 
              text: "Complete silence - no background noise", 
              value: { tolerance: "silence", sensitivity: "very-high" }
            },
            { 
              text: "Quiet - soft music ok, no TV", 
              value: { tolerance: "quiet", sensitivity: "high" }
            },
            { 
              text: "Moderate - normal household sounds fine", 
              value: { tolerance: "moderate", sensitivity: "moderate" }
            },
            { 
              text: "Active - music, TV, noise doesn't bother me", 
              value: { tolerance: "high", sensitivity: "low" }
            }
          ]
        }
      ]
    }
  ];

  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];

  // Load existing response when navigating to a question
  useEffect(() => {
    const questionId = currentQuestionData.id;
    const existingResponse = responses[questionId];

    if (existingResponse) {
      // Find the option index that matches the existing primary response
      const optionIndex = currentQuestionData.options.findIndex(
        opt => JSON.stringify(opt.value) === JSON.stringify(existingResponse.primary)
      );
      setSelectedOption(optionIndex >= 0 ? optionIndex : null);

      // Check if there's a followup response
      if (existingResponse.followup && currentQuestionData.followup) {
        const followupIndex = currentQuestionData.followup.options.findIndex(
          opt => JSON.stringify(opt.value) === JSON.stringify(existingResponse.followup)
        );
        setSelectedFollowupOption(followupIndex >= 0 ? followupIndex : null);
      } else {
        setSelectedFollowupOption(null);
      }
    } else {
      setSelectedOption(null);
      setSelectedFollowupOption(null);
    }
  }, [currentSection, currentQuestion, showFollowup]);

  // Select primary option (no auto-advance)
  const handleSelectOption = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  // Select followup option (no auto-advance)
  const handleSelectFollowupOption = (optionIndex) => {
    setSelectedFollowupOption(optionIndex);
  };

  // Save answer and advance to next question or followup
  const handleNext = () => {
    const questionId = currentQuestionData.id;

    if (showFollowup) {
      // Save followup answer
      if (selectedFollowupOption === null) return;
      const followupOption = currentQuestionData.followup.options[selectedFollowupOption];
      setResponses(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          followup: followupOption.value
        }
      }));
      moveToNextQuestion();
    } else {
      // Save primary answer
      if (selectedOption === null) return;
      const option = currentQuestionData.options[selectedOption];
      setResponses(prev => ({
        ...prev,
        [questionId]: {
          primary: option.value,
          timestamp: new Date().toISOString()
        }
      }));

      // Check if this question has a followup
      if (currentQuestionData.followup) {
        setShowFollowup(true);
        setSelectedFollowupOption(null);
      } else {
        moveToNextQuestion();
      }
    }
  };

  const moveToNextQuestion = () => {
    setShowFollowup(false);
    setSelectedOption(null);
    setSelectedFollowupOption(null);

    // Check if there are more questions in current section
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      // Move to next section
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      // All complete!
      // Include the final responses in the completion callback
      const questionId = currentQuestionData.id;
      const finalResponses = { ...responses };
      if (showFollowup && selectedFollowupOption !== null) {
        finalResponses[questionId] = {
          ...finalResponses[questionId],
          followup: currentQuestionData.followup.options[selectedFollowupOption].value
        };
      }
      onComplete(finalResponses);
    }
  };

  const handlePrevious = () => {
    setShowFollowup(false);
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
    }
  };

  // Calculate progress
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const completedQuestions = sections.slice(0, currentSection).reduce((sum, section) => sum + section.questions.length, 0) + currentQuestion;
  const progress = (completedQuestions / totalQuestions) * 100;

  return (
    <div className="daily-life-scenarios">
      
      {/* Header */}
      <div className="assessment-header">
        <h2>Daily Life Infrastructure</h2>
        <p className="subtitle">
          {currentSectionData.title} - {currentSectionData.description}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Section Indicator */}
      <div className="section-indicator">
        {sections.map((section, idx) => (
          <div 
            key={section.id}
            className={`section-dot ${idx === currentSection ? 'active' : ''} ${idx < currentSection ? 'complete' : ''}`}
          >
            <span className="section-icon">{section.title.split(' ')[0]}</span>
            <span className="section-name">{section.title.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSection}-${currentQuestion}-${showFollowup}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`question-card ${currentQuestionData.isSpecial ? 'special-question' : ''}`}
        >
          {/* Special Question Badge */}
          {currentQuestionData.isSpecial && (
            <div className="special-badge">
              ⭐ REVOLUTIONARY QUESTION ⭐
            </div>
          )}

          <div className="scenario">
            <span className="scenario-label">Scenario:</span>
            <p className="scenario-text">{currentQuestionData.scenario}</p>
          </div>

          {!showFollowup ? (
            <div className="options">
              {currentQuestionData.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`option-button ${selectedOption === index ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option.text}</span>
                  {option.value.constitutionalHint && (
                    <span className="constitutional-hint" title="Constitutional Hint">
                      {option.value.constitutionalHint}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="followup-section">
              <div className="followup-indicator">↓ Follow-up Question ↓</div>
              <div className="scenario followup-scenario">
                <p className="scenario-text">{currentQuestionData.followup.question}</p>
              </div>
              <div className="options">
                {currentQuestionData.followup.options.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`option-button followup-option ${selectedFollowupOption === index ? 'selected' : ''}`}
                    onClick={() => handleSelectFollowupOption(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="navigation">
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentSection === 0 && currentQuestion === 0}
        >
          ← Previous
        </button>
        <div className="question-info">
          <span className="question-counter">
            Question {completedQuestions + 1} of {totalQuestions}
          </span>
          <span className="section-progress">
            {currentSectionData.title} ({currentQuestion + 1}/{currentSectionData.questions.length})
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={showFollowup ? selectedFollowupOption === null : selectedOption === null}
        >
          {currentSection === sections.length - 1 &&
           currentQuestion === currentSectionData.questions.length - 1 &&
           (!currentQuestionData.followup || showFollowup)
            ? 'Complete'
            : showFollowup ? 'Next →' : (currentQuestionData.followup ? 'Continue →' : 'Next →')}
        </button>
      </div>

    </div>
  );
}
