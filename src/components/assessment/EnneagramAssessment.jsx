import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EnneagramAssessment.css';

/**
 * Enneagram Personality Assessment
 * 36 scenario-based questions (4 per type) revealing core motivations
 * 9 Types: Reformer, Helper, Achiever, Individualist, Investigator,
 *          Loyalist, Enthusiast, Challenger, Peacemaker
 */
export function EnneagramAssessment({ onComplete, existingResponses = [] }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(existingResponses);
  const [selectedOption, setSelectedOption] = useState(null);

  // Enneagram Questions - 4 per type
  const questions = {
    type1: [ // The Reformer - Principled, Purposeful, Self-Controlled
      {
        id: "e1_1",
        scenario: "You notice a colleague has made an error in a shared document.",
        options: [
          { text: "I must correct it - accuracy matters too much to ignore", score: 5, type: 1 },
          { text: "Point it out helpfully so they can learn", score: 3, type: 1 },
          { text: "Mention it if it affects the final outcome", score: 2, type: 1 },
          { text: "Let it go - everyone makes mistakes", score: 1, type: 1 }
        ]
      },
      {
        id: "e1_2",
        scenario: "Someone asks for your opinion on a morally gray situation.",
        options: [
          { text: "I have clear principles - I'll share what's right and wrong", score: 5, type: 1 },
          { text: "Think through the ethical implications carefully first", score: 4, type: 1 },
          { text: "Consider multiple perspectives before judging", score: 2, type: 1 },
          { text: "It depends on context - hard to say definitively", score: 1, type: 1 }
        ]
      },
      {
        id: "e1_3",
        scenario: "You've completed a personal project.",
        options: [
          { text: "I see all the flaws and want to redo parts of it", score: 5, type: 1 },
          { text: "Good but could be better - I'll improve it", score: 4, type: 1 },
          { text: "Satisfied with my effort, even if not perfect", score: 2, type: 1 },
          { text: "Done is better than perfect - moving on", score: 1, type: 1 }
        ]
      },
      {
        id: "e1_4",
        scenario: "Rules at your workplace seem inefficient but are officially required.",
        options: [
          { text: "Follow them - rules exist for good reasons", score: 5, type: 1 },
          { text: "Follow them but advocate for change through proper channels", score: 4, type: 1 },
          { text: "Bend them when necessary for better outcomes", score: 2, type: 1 },
          { text: "Ignore rules that don't make sense", score: 1, type: 1 }
        ]
      }
    ],
    type2: [ // The Helper - Generous, Demonstrative, People-Pleasing
      {
        id: "e2_1",
        scenario: "A friend mentions they're having a hard week.",
        options: [
          { text: "Immediately offer to help - what can I do for you?", score: 5, type: 2 },
          { text: "Listen and offer support in whatever way they need", score: 4, type: 2 },
          { text: "Express sympathy and check in later", score: 2, type: 2 },
          { text: "Give them space unless they ask for help", score: 1, type: 2 }
        ]
      },
      {
        id: "e2_2",
        scenario: "You're exhausted but someone needs a favor.",
        options: [
          { text: "Say yes anyway - I can't let them down", score: 5, type: 2 },
          { text: "Struggle internally but probably help", score: 4, type: 2 },
          { text: "Help if it's truly urgent, otherwise postpone", score: 2, type: 2 },
          { text: "Decline - I need to take care of myself first", score: 1, type: 2 }
        ]
      },
      {
        id: "e2_3",
        scenario: "You did something nice for someone and they didn't acknowledge it.",
        options: [
          { text: "Feel hurt - appreciation matters to me", score: 5, type: 2 },
          { text: "Disappointed but try not to dwell on it", score: 4, type: 2 },
          { text: "Shrug it off - I didn't do it for thanks", score: 2, type: 2 },
          { text: "Don't notice or care - their response isn't my concern", score: 1, type: 2 }
        ]
      },
      {
        id: "e2_4",
        scenario: "At a gathering, you notice someone sitting alone looking uncomfortable.",
        options: [
          { text: "Immediately go over and include them", score: 5, type: 2 },
          { text: "Find a way to naturally bring them into conversation", score: 4, type: 2 },
          { text: "Smile at them but focus on my own conversations", score: 2, type: 2 },
          { text: "Not my responsibility - they can approach people", score: 1, type: 2 }
        ]
      }
    ],
    type3: [ // The Achiever - Success-Oriented, Adaptive, Driven
      {
        id: "e3_1",
        scenario: "You're asked about your recent accomplishments.",
        options: [
          { text: "Light up - I love sharing my wins and successes", score: 5, type: 3 },
          { text: "Share highlights while being appropriately modest", score: 4, type: 3 },
          { text: "Mention a few things if directly asked", score: 2, type: 3 },
          { text: "Downplay achievements - don't want to seem boastful", score: 1, type: 3 }
        ]
      },
      {
        id: "e3_2",
        scenario: "A project you led received mixed feedback.",
        options: [
          { text: "Focus on how to turn it into a success story", score: 5, type: 3 },
          { text: "Analyze what worked and improve the rest", score: 4, type: 3 },
          { text: "Accept feedback and learn from it", score: 2, type: 3 },
          { text: "Not too concerned - external validation isn't everything", score: 1, type: 3 }
        ]
      },
      {
        id: "e3_3",
        scenario: "You're choosing between a higher-status job or one you'd enjoy more.",
        options: [
          { text: "The prestigious one - success opens more doors", score: 5, type: 3 },
          { text: "Lean toward status but consider enjoyment too", score: 4, type: 3 },
          { text: "Balance both factors equally", score: 2, type: 3 },
          { text: "Choose enjoyment - titles don't matter much to me", score: 1, type: 3 }
        ]
      },
      {
        id: "e3_4",
        scenario: "Your team succeeded but you did most of the work.",
        options: [
          { text: "Make sure key people know my contribution", score: 5, type: 3 },
          { text: "Let the team share credit but ensure I'm recognized", score: 4, type: 3 },
          { text: "Happy the team succeeded regardless of who did what", score: 2, type: 3 },
          { text: "Credit doesn't matter - the outcome does", score: 1, type: 3 }
        ]
      }
    ],
    type4: [ // The Individualist - Expressive, Dramatic, Self-Absorbed
      {
        id: "e4_1",
        scenario: "You're in a group where everyone seems to fit in easily.",
        options: [
          { text: "Feel like an outsider - I'm different from them", score: 5, type: 4 },
          { text: "Notice I don't quite belong but that's okay", score: 4, type: 4 },
          { text: "Find my own way to connect", score: 2, type: 4 },
          { text: "Blend in easily - I adapt to any group", score: 1, type: 4 }
        ]
      },
      {
        id: "e4_2",
        scenario: "Someone describes you as 'unique' or 'different'.",
        options: [
          { text: "Feel validated - being unique matters deeply to me", score: 5, type: 4 },
          { text: "Appreciate it - I do value authenticity", score: 4, type: 4 },
          { text: "Take it as a neutral observation", score: 2, type: 4 },
          { text: "Prefer being seen as relatable and normal", score: 1, type: 4 }
        ]
      },
      {
        id: "e4_3",
        scenario: "You experience a deep emotion - joy or sadness.",
        options: [
          { text: "Sit with it fully - emotions reveal truth about life", score: 5, type: 4 },
          { text: "Explore and express what I'm feeling", score: 4, type: 4 },
          { text: "Acknowledge it and continue with my day", score: 2, type: 4 },
          { text: "Move past it quickly - no need to dwell", score: 1, type: 4 }
        ]
      },
      {
        id: "e4_4",
        scenario: "You see something beautiful - art, nature, or music.",
        options: [
          { text: "Feel it deeply - beauty moves me to my core", score: 5, type: 4 },
          { text: "Pause and appreciate the experience", score: 4, type: 4 },
          { text: "Notice it's nice and continue on", score: 2, type: 4 },
          { text: "Don't usually stop for aesthetic experiences", score: 1, type: 4 }
        ]
      }
    ],
    type5: [ // The Investigator - Intense, Cerebral, Perceptive
      {
        id: "e5_1",
        scenario: "You encounter a complex topic you don't understand.",
        options: [
          { text: "Must research it deeply until I truly comprehend it", score: 5, type: 5 },
          { text: "Spend time learning the key aspects", score: 4, type: 5 },
          { text: "Learn enough to get by", score: 2, type: 5 },
          { text: "Move on - can't know everything", score: 1, type: 5 }
        ]
      },
      {
        id: "e5_2",
        scenario: "You've been at a social event for a few hours.",
        options: [
          { text: "Drained and need to leave to recharge alone", score: 5, type: 5 },
          { text: "Starting to feel depleted", score: 4, type: 5 },
          { text: "Fine but wouldn't mind leaving soon", score: 2, type: 5 },
          { text: "Energized - could stay for hours more", score: 1, type: 5 }
        ]
      },
      {
        id: "e5_3",
        scenario: "Someone asks you to share your expertise on a topic.",
        options: [
          { text: "Happy to explain in depth - I love sharing knowledge", score: 5, type: 5 },
          { text: "Share what's relevant if they're genuinely interested", score: 4, type: 5 },
          { text: "Give a brief overview", score: 2, type: 5 },
          { text: "Prefer not to - feels like showing off", score: 1, type: 5 }
        ]
      },
      {
        id: "e5_4",
        scenario: "You're asked to make a quick decision without much information.",
        options: [
          { text: "Uncomfortable - I need more data to decide well", score: 5, type: 5 },
          { text: "Ask for more time to gather information", score: 4, type: 5 },
          { text: "Make my best guess with what I have", score: 2, type: 5 },
          { text: "Trust my gut and decide immediately", score: 1, type: 5 }
        ]
      }
    ],
    type6: [ // The Loyalist - Committed, Security-Oriented, Anxious
      {
        id: "e6_1",
        scenario: "You're about to try something new that has some risks.",
        options: [
          { text: "Think through everything that could go wrong first", score: 5, type: 6 },
          { text: "Do my research and prepare for issues", score: 4, type: 6 },
          { text: "Consider risks but focus on potential benefits", score: 2, type: 6 },
          { text: "Just go for it - risks add excitement", score: 1, type: 6 }
        ]
      },
      {
        id: "e6_2",
        scenario: "A friend who's been reliable suddenly seems distant.",
        options: [
          { text: "Worry - did I do something wrong? Are they okay?", score: 5, type: 6 },
          { text: "Check in to make sure everything's alright", score: 4, type: 6 },
          { text: "Give them space - probably just busy", score: 2, type: 6 },
          { text: "Don't notice or think much about it", score: 1, type: 6 }
        ]
      },
      {
        id: "e6_3",
        scenario: "You're asked to trust someone new with something important.",
        options: [
          { text: "Hesitant until they've proven themselves trustworthy", score: 5, type: 6 },
          { text: "Cautiously optimistic but watching carefully", score: 4, type: 6 },
          { text: "Give them the benefit of the doubt", score: 2, type: 6 },
          { text: "Trust easily - most people are reliable", score: 1, type: 6 }
        ]
      },
      {
        id: "e6_4",
        scenario: "You're part of a team facing an uncertain situation.",
        options: [
          { text: "Want to know the plan and everyone's role clearly", score: 5, type: 6 },
          { text: "Ask questions to understand what we're doing", score: 4, type: 6 },
          { text: "Trust the team to figure it out together", score: 2, type: 6 },
          { text: "Enjoy the uncertainty - we'll improvise", score: 1, type: 6 }
        ]
      }
    ],
    type7: [ // The Enthusiast - Spontaneous, Versatile, Scattered
      {
        id: "e7_1",
        scenario: "You have a free weekend with no commitments.",
        options: [
          { text: "Plan multiple activities - so many possibilities!", score: 5, type: 7 },
          { text: "Have a few fun ideas ready", score: 4, type: 7 },
          { text: "Keep it simple - maybe one or two things", score: 2, type: 7 },
          { text: "Prefer a quiet weekend with nothing planned", score: 1, type: 7 }
        ]
      },
      {
        id: "e7_2",
        scenario: "You're in the middle of one project when a new exciting idea comes up.",
        options: [
          { text: "Jump to the new idea - this one's even better!", score: 5, type: 7 },
          { text: "Start exploring the new idea while continuing the old", score: 4, type: 7 },
          { text: "Note the idea for later, finish what I started", score: 2, type: 7 },
          { text: "Ignore the new idea - must finish first", score: 1, type: 7 }
        ]
      },
      {
        id: "e7_3",
        scenario: "Something disappointing or painful happens.",
        options: [
          { text: "Quickly find the silver lining and move forward", score: 5, type: 7 },
          { text: "Acknowledge it briefly then focus on something positive", score: 4, type: 7 },
          { text: "Process the disappointment before moving on", score: 2, type: 7 },
          { text: "Sit with the difficult feelings as long as needed", score: 1, type: 7 }
        ]
      },
      {
        id: "e7_4",
        scenario: "Someone describes you as having 'FOMO' (fear of missing out).",
        options: [
          { text: "That's accurate - I want to experience everything", score: 5, type: 7 },
          { text: "Somewhat true - I do like keeping options open", score: 4, type: 7 },
          { text: "Occasionally, but I can focus when needed", score: 2, type: 7 },
          { text: "Not at all - I'm content with what I'm doing", score: 1, type: 7 }
        ]
      }
    ],
    type8: [ // The Challenger - Powerful, Dominating, Self-Confident
      {
        id: "e8_1",
        scenario: "You see someone being treated unfairly.",
        options: [
          { text: "Step in immediately - injustice demands action", score: 5, type: 8 },
          { text: "Speak up if the situation calls for it", score: 4, type: 8 },
          { text: "Offer support privately to the person affected", score: 2, type: 8 },
          { text: "Stay out of it - not my place to interfere", score: 1, type: 8 }
        ]
      },
      {
        id: "e8_2",
        scenario: "In a group decision, you strongly disagree with the direction.",
        options: [
          { text: "Assert my position forcefully - I know what's right", score: 5, type: 8 },
          { text: "Make my case clearly and directly", score: 4, type: 8 },
          { text: "Share my view but go with the group", score: 2, type: 8 },
          { text: "Keep quiet and follow the consensus", score: 1, type: 8 }
        ]
      },
      {
        id: "e8_3",
        scenario: "Someone challenges your authority or competence.",
        options: [
          { text: "Stand my ground firmly - I won't back down", score: 5, type: 8 },
          { text: "Address it directly and clarify my position", score: 4, type: 8 },
          { text: "Consider if they have a point", score: 2, type: 8 },
          { text: "Let it go - their opinion doesn't affect me", score: 1, type: 8 }
        ]
      },
      {
        id: "e8_4",
        scenario: "You need to show vulnerability to connect with someone.",
        options: [
          { text: "Difficult - vulnerability feels like weakness", score: 5, type: 8 },
          { text: "Uncomfortable but can do it with trusted people", score: 4, type: 8 },
          { text: "Okay with it - vulnerability builds connection", score: 2, type: 8 },
          { text: "Easy - I'm an open book", score: 1, type: 8 }
        ]
      }
    ],
    type9: [ // The Peacemaker - Receptive, Reassuring, Complacent
      {
        id: "e9_1",
        scenario: "Two friends are having a conflict and both want you to pick a side.",
        options: [
          { text: "See both perspectives - hard to choose either side", score: 5, type: 9 },
          { text: "Try to mediate and find common ground", score: 4, type: 9 },
          { text: "Support whoever I think is more right", score: 2, type: 9 },
          { text: "Pick a side clearly - conflicts need resolution", score: 1, type: 9 }
        ]
      },
      {
        id: "e9_2",
        scenario: "Your partner wants to do something you're not excited about.",
        options: [
          { text: "Go along with it - keeping harmony matters most", score: 5, type: 9 },
          { text: "Agree unless it's something I really dislike", score: 4, type: 9 },
          { text: "Suggest a compromise we'd both enjoy", score: 2, type: 9 },
          { text: "Voice my preference clearly", score: 1, type: 9 }
        ]
      },
      {
        id: "e9_3",
        scenario: "You have a strong opinion on a topic being discussed.",
        options: [
          { text: "Keep quiet - don't want to create waves", score: 5, type: 9 },
          { text: "Share only if asked directly", score: 4, type: 9 },
          { text: "Join the discussion when there's an opening", score: 2, type: 9 },
          { text: "Jump in and share my view - that's how discussions work", score: 1, type: 9 }
        ]
      },
      {
        id: "e9_4",
        scenario: "You're in a peaceful routine when someone suggests a big change.",
        options: [
          { text: "Resist - why disrupt what's working?", score: 5, type: 9 },
          { text: "Hesitant but willing to consider it", score: 4, type: 9 },
          { text: "Open to change if it makes sense", score: 2, type: 9 },
          { text: "Embrace it - change keeps life interesting", score: 1, type: 9 }
        ]
      }
    ]
  };

  const allQuestions = [
    ...questions.type1.map(q => ({ ...q, typeName: 'Reformer' })),
    ...questions.type2.map(q => ({ ...q, typeName: 'Helper' })),
    ...questions.type3.map(q => ({ ...q, typeName: 'Achiever' })),
    ...questions.type4.map(q => ({ ...q, typeName: 'Individualist' })),
    ...questions.type5.map(q => ({ ...q, typeName: 'Investigator' })),
    ...questions.type6.map(q => ({ ...q, typeName: 'Loyalist' })),
    ...questions.type7.map(q => ({ ...q, typeName: 'Enthusiast' })),
    ...questions.type8.map(q => ({ ...q, typeName: 'Challenger' })),
    ...questions.type9.map(q => ({ ...q, typeName: 'Peacemaker' }))
  ];

  // Load existing response for current question when navigating
  useEffect(() => {
    const question = allQuestions[currentQuestion];
    const existingResponse = responses.find(r => r.questionId === question.id);
    if (existingResponse) {
      const optionIndex = question.options.findIndex(opt => opt.text === existingResponse.selectedText);
      setSelectedOption(optionIndex >= 0 ? optionIndex : null);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestion, responses]);

  const handleSelectOption = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const question = allQuestions[currentQuestion];
    const option = question.options[selectedOption];

    const response = {
      questionId: question.id,
      type: option.type,
      typeName: question.typeName,
      scenario: question.scenario,
      selectedText: option.text,
      score: option.score,
      timestamp: new Date().toISOString()
    };

    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === question.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = response;
        return updated;
      }
      return [...prev, response];
    });

    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      const finalResponses = responses.filter(r => r.questionId !== question.id);
      finalResponses.push(response);
      onComplete(finalResponses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = allQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  const isLastQuestion = currentQuestion === allQuestions.length - 1;

  // Enneagram type symbols
  const typeSymbol = {
    1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣',
    6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣'
  };

  return (
    <div className="enneagram-assessment">

      {/* Header */}
      <div className="assessment-header">
        <h2>Enneagram Scenarios</h2>
        <p className="method-note">Scenario-based · Compare with Alchemical Rose (Likert-scale)</p>
        <p className="subtitle">
          <span className="type-badge">{typeSymbol[question.options[0].type]} Type {question.options[0].type}: {question.typeName}</span>
          <span className="divider">•</span>
          Question {currentQuestion + 1} of {allQuestions.length}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="type-indicators">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(type => (
            <span
              key={type}
              className={`type-dot ${question.options[0].type === type ? 'active' : ''}`}
              title={`Type ${type}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="question-card"
        >
          <div className="scenario">
            <span className="scenario-label">Scenario:</span>
            <p>{question.scenario}</p>
          </div>

          <div className="options">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                className={`option-button ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleSelectOption(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="navigation">
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>
        <span className="question-counter">
          {currentQuestion + 1} / {allQuestions.length}
        </span>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selectedOption === null}
        >
          {isLastQuestion ? 'Complete' : 'Next →'}
        </button>
      </div>

    </div>
  );
}
