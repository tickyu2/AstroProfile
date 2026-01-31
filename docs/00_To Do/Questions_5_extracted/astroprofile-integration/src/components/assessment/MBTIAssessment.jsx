import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MBTIAssessment.css';

/**
 * MBTI Cognitive Functions Assessment
 * 40 scenario-based questions (10 per dichotomy)
 * Reveals cognitive function stack and personality type
 */
export function MBTIAssessment({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);

  // MBTI Questions - 10 per dichotomy
  const questions = {
    // E vs I: Energy Direction (10 questions)
    energyDirection: [
      {
        id: "ei1",
        scenario: "You just finished a major project. To recharge, you:",
        options: [
          { text: "Go out with friends to celebrate", value: "E", score: 2 },
          { text: "Call a friend to share the news", value: "E", score: 1 },
          { text: "Process internally, maybe journal", value: "I", score: 1 },
          { text: "Need complete solitude to decompress", value: "I", score: 2 }
        ]
      },
      {
        id: "ei2",
        scenario: "When developing a new idea, you prefer to:",
        options: [
          { text: "Talk it through with multiple people", value: "E", score: 2 },
          { text: "Discuss with one trusted person", value: "E", score: 1 },
          { text: "Think deeply alone first", value: "I", score: 1 },
          { text: "Develop it completely internally", value: "I", score: 2 }
        ]
      },
      {
        id: "ei3",
        scenario: "After a long, draining week, your ideal Friday night is:",
        options: [
          { text: "Big social gathering - the more people the better", value: "E", score: 2 },
          { text: "Dinner with a few close friends", value: "E", score: 1 },
          { text: "Quiet evening at home with one person", value: "I", score: 1 },
          { text: "Absolutely alone - phone off", value: "I", score: 2 }
        ]
      },
      {
        id: "ei4",
        scenario: "You're thinking through a problem. You naturally:",
        options: [
          { text: "Talk it out loud, even to myself", value: "E", score: 2 },
          { text: "Call someone to brainstorm", value: "E", score: 1 },
          { text: "Write it down to organize thoughts", value: "I", score: 1 },
          { text: "Think it through entirely in my head", value: "I", score: 2 }
        ]
      },
      {
        id: "ei5",
        scenario: "At a party where you know only the host:",
        options: [
          { text: "Introduce myself to everyone - this is fun!", value: "E", score: 2 },
          { text: "Strike up a few conversations", value: "E", score: 1 },
          { text: "Wait for people to approach me", value: "I", score: 1 },
          { text: "Stay near the host or in a quiet corner", value: "I", score: 2 }
        ]
      },
      {
        id: "ei6",
        scenario: "When you have exciting news:",
        options: [
          { text: "Immediately call/text multiple friends", value: "E", score: 2 },
          { text: "Share with a few close people", value: "E", score: 1 },
          { text: "Tell one or two people when I see them", value: "I", score: 1 },
          { text: "Process it internally before sharing", value: "I", score: 2 }
        ]
      },
      {
        id: "ei7",
        scenario: "Your energy level throughout the day:",
        options: [
          { text: "Increases with more social interaction", value: "E", score: 2 },
          { text: "Stable with moderate social time", value: "E", score: 1 },
          { text: "Decreases with too much interaction", value: "I", score: 1 },
          { text: "Drains quickly in social situations", value: "I", score: 2 }
        ]
      },
      {
        id: "ei8",
        scenario: "You prefer to learn by:",
        options: [
          { text: "Group discussion and collaborative exploration", value: "E", score: 2 },
          { text: "Talking through concepts with a partner", value: "E", score: 1 },
          { text: "Reading and solo study", value: "I", score: 1 },
          { text: "Deep individual reflection and research", value: "I", score: 2 }
        ]
      },
      {
        id: "ei9",
        scenario: "Your ideal workspace is:",
        options: [
          { text: "Open office with lots of interaction", value: "E", score: 2 },
          { text: "Shared space with occasional conversation", value: "E", score: 1 },
          { text: "Semi-private with minimal interruptions", value: "I", score: 1 },
          { text: "Private office - complete quiet", value: "I", score: 2 }
        ]
      },
      {
        id: "ei10",
        scenario: "When making decisions, you:",
        options: [
          { text: "Need to talk it through with multiple people", value: "E", score: 2 },
          { text: "Discuss with one or two trusted advisors", value: "E", score: 1 },
          { text: "Prefer to think it through alone first", value: "I", score: 1 },
          { text: "Always decide independently", value: "I", score: 2 }
        ]
      }
    ],

    // S vs N: Information Gathering (10 questions)
    information: [
      {
        id: "sn1",
        scenario: "You're learning to use new software. You:",
        options: [
          { text: "Read the manual step-by-step carefully", value: "S", score: 2 },
          { text: "Follow a structured tutorial", value: "S", score: 1 },
          { text: "Explore the interface and figure it out", value: "N", score: 1 },
          { text: "Imagine possibilities and experiment freely", value: "N", score: 2 }
        ]
      },
      {
        id: "sn2",
        scenario: "When someone tells you about their day, you notice:",
        options: [
          { text: "Specific details - what they wore, exact times", value: "S", score: 2 },
          { text: "Key facts and events in sequence", value: "S", score: 1 },
          { text: "Overall themes and meanings", value: "N", score: 1 },
          { text: "Implications and what it reveals about them", value: "N", score: 2 }
        ]
      },
      {
        id: "sn3",
        scenario: "You're reading instructions to build furniture. You:",
        options: [
          { text: "Follow each step precisely in order", value: "S", score: 2 },
          { text: "Read through once, then follow steps", value: "S", score: 1 },
          { text: "Get the gist, improvise as needed", value: "N", score: 1 },
          { text: "Look at picture, figure out the concept", value: "N", score: 2 }
        ]
      },
      {
        id: "sn4",
        scenario: "When planning a project, you start with:",
        options: [
          { text: "Concrete details and specific steps", value: "S", score: 2 },
          { text: "What's worked before in similar situations", value: "S", score: 1 },
          { text: "The big picture and overall vision", value: "N", score: 1 },
          { text: "Future possibilities and innovations", value: "N", score: 2 }
        ]
      },
      {
        id: "sn5",
        scenario: "You remember events by:",
        options: [
          { text: "Vivid sensory details - sights, sounds, smells", value: "S", score: 2 },
          { text: "Specific facts and what happened", value: "S", score: 1 },
          { text: "Overall impressions and meanings", value: "N", score: 1 },
          { text: "Patterns and connections to other experiences", value: "N", score: 2 }
        ]
      },
      {
        id: "sn6",
        scenario: "When someone asks about your weekend, you describe:",
        options: [
          { text: "Specific activities in chronological order", value: "S", score: 2 },
          { text: "Key events and what you did", value: "S", score: 1 },
          { text: "General vibe and highlights", value: "N", score: 1 },
          { text: "Meaning, insights, or funny connections", value: "N", score: 2 }
        ]
      },
      {
        id: "sn7",
        scenario: "You prefer books/movies that are:",
        options: [
          { text: "Realistic with accurate details", value: "S", score: 2 },
          { text: "Based on true stories or real experiences", value: "S", score: 1 },
          { text: "Imaginative with deeper meanings", value: "N", score: 1 },
          { text: "Abstract, symbolic, or fantastical", value: "N", score: 2 }
        ]
      },
      {
        id: "sn8",
        scenario: "In conversation, you tend to:",
        options: [
          { text: "Focus on facts and concrete examples", value: "S", score: 2 },
          { text: "Share specific experiences", value: "S", score: 1 },
          { text: "Explore ideas and possibilities", value: "N", score: 1 },
          { text: "Use metaphors and abstract concepts", value: "N", score: 2 }
        ]
      },
      {
        id: "sn9",
        scenario: "When you describe a person, you mention:",
        options: [
          { text: "Physical appearance and observable traits", value: "S", score: 2 },
          { text: "What they do and factual information", value: "S", score: 1 },
          { text: "Their essence or 'vibe'", value: "N", score: 1 },
          { text: "Abstract qualities and potential", value: "N", score: 2 }
        ]
      },
      {
        id: "sn10",
        scenario: "You trust information that is:",
        options: [
          { text: "Proven through direct observation", value: "S", score: 2 },
          { text: "Backed by data and precedent", value: "S", score: 1 },
          { text: "Intuitively makes sense", value: "N", score: 1 },
          { text: "Reveals patterns and deeper truths", value: "N", score: 2 }
        ]
      }
    ],

    // T vs F: Decision Making (10 questions)
    decisions: [
      {
        id: "tf1",
        scenario: "Your friend wants advice: take lower-paying dream job or keep stable income?",
        options: [
          { text: "Analyze: salary, benefits, career trajectory, data", value: "T", score: 2 },
          { text: "Consider pros/cons logically", value: "T", score: 1 },
          { text: "Explore how they feel about each option", value: "F", score: 1 },
          { text: "What does their heart say? What matters most?", value: "F", score: 2 }
        ]
      },
      {
        id: "tf2",
        scenario: "You need to give critical feedback to a colleague.",
        options: [
          { text: "State the facts directly - here's what needs fixing", value: "T", score: 2 },
          { text: "Objective but balanced - good and bad", value: "T", score: 1 },
          { text: "Start with positives, ease into concerns", value: "F", score: 1 },
          { text: "Very careful with wording to protect feelings", value: "F", score: 2 }
        ]
      },
      {
        id: "tf3",
        scenario: "Two team members have a conflict. You:",
        options: [
          { text: "Analyze who's objectively right based on facts", value: "T", score: 2 },
          { text: "Focus on fair procedures and policies", value: "T", score: 1 },
          { text: "Consider both perspectives and feelings", value: "F", score: 1 },
          { text: "Mediate to restore harmony and relationships", value: "F", score: 2 }
        ]
      },
      {
        id: "tf4",
        scenario: "When making a decision, you prioritize:",
        options: [
          { text: "Logical analysis and objective criteria", value: "T", score: 2 },
          { text: "What makes sense rationally", value: "T", score: 1 },
          { text: "How it affects people and relationships", value: "F", score: 1 },
          { text: "Values and what feels right", value: "F", score: 2 }
        ]
      },
      {
        id: "tf5",
        scenario: "You're more convinced by:",
        options: [
          { text: "Data, facts, and logical arguments", value: "T", score: 2 },
          { text: "Well-reasoned systematic analysis", value: "T", score: 1 },
          { text: "Personal stories and experiences", value: "F", score: 1 },
          { text: "Emotional resonance and human impact", value: "F", score: 2 }
        ]
      },
      {
        id: "tf6",
        scenario: "Someone is upset with you. You:",
        options: [
          { text: "Ask what specifically I did wrong", value: "T", score: 2 },
          { text: "Try to understand the logical issue", value: "T", score: 1 },
          { text: "Ask how they're feeling and empathize", value: "F", score: 1 },
          { text: "Focus on restoring emotional connection", value: "F", score: 2 }
        ]
      },
      {
        id: "tf7",
        scenario: "In an argument, you focus on:",
        options: [
          { text: "Being objectively correct", value: "T", score: 2 },
          { text: "Logical consistency and facts", value: "T", score: 1 },
          { text: "Understanding the other person's perspective", value: "F", score: 1 },
          { text: "Maintaining the relationship", value: "F", score: 2 }
        ]
      },
      {
        id: "tf8",
        scenario: "You'd rather be seen as:",
        options: [
          { text: "Competent and intelligent", value: "T", score: 2 },
          { text: "Fair and logical", value: "T", score: 1 },
          { text: "Kind and caring", value: "F", score: 1 },
          { text: "Warm and compassionate", value: "F", score: 2 }
        ]
      },
      {
        id: "tf9",
        scenario: "When evaluating ideas, you ask:",
        options: [
          { text: "Is this logically sound and efficient?", value: "T", score: 2 },
          { text: "Does this make rational sense?", value: "T", score: 1 },
          { text: "How will this affect people?", value: "F", score: 1 },
          { text: "Does this align with our values?", value: "F", score: 2 }
        ]
      },
      {
        id: "tf10",
        scenario: "You're naturally better at:",
        options: [
          { text: "Analyzing systems and solving problems", value: "T", score: 2 },
          { text: "Critical thinking and objectivity", value: "T", score: 1 },
          { text: "Understanding emotions and motivations", value: "F", score: 1 },
          { text: "Building relationships and harmony", value: "F", score: 2 }
        ]
      }
    ],

    // J vs P: Lifestyle (10 questions)
    lifestyle: [
      {
        id: "jp1",
        scenario: "It's 8pm on a work night. A friend texts: 'Want to grab drinks now?'",
        options: [
          { text: "No - I have a routine and stick to it", value: "J", score: 2 },
          { text: "Probably not - I planned to rest tonight", value: "J", score: 1 },
          { text: "Maybe - depends on how I'm feeling", value: "P", score: 1 },
          { text: "Yes! Spontaneous plans are the best", value: "P", score: 2 }
        ]
      },
      {
        id: "jp2",
        scenario: "You're planning a vacation in 3 months. You:",
        options: [
          { text: "Book flights, hotels, itinerary immediately", value: "J", score: 2 },
          { text: "Research and book major items this month", value: "J", score: 1 },
          { text: "Book flights, figure out rest closer to date", value: "P", score: 1 },
          { text: "Keep options open - might change plans", value: "P", score: 2 }
        ]
      },
      {
        id: "jp3",
        scenario: "Your workspace/desk typically looks:",
        options: [
          { text: "Everything in its place, labeled, organized", value: "J", score: 2 },
          { text: "Mostly organized with a system", value: "J", score: 1 },
          { text: "Organized chaos - I know where things are", value: "P", score: 1 },
          { text: "Creative mess - structure feels limiting", value: "P", score: 2 }
        ]
      },
      {
        id: "jp4",
        scenario: "You prefer to work:",
        options: [
          { text: "With a detailed plan and schedule", value: "J", score: 2 },
          { text: "Following a general structure", value: "J", score: 1 },
          { text: "Flexibly, adapting as I go", value: "P", score: 1 },
          { text: "Spontaneously when inspiration strikes", value: "P", score: 2 }
        ]
      },
      {
        id: "jp5",
        scenario: "When starting a new task:",
        options: [
          { text: "Create a complete plan before beginning", value: "J", score: 2 },
          { text: "Outline major steps then start", value: "J", score: 1 },
          { text: "Start and figure it out as I go", value: "P", score: 1 },
          { text: "Jump in and let it unfold organically", value: "P", score: 2 }
        ]
      },
      {
        id: "jp6",
        scenario: "You feel most comfortable when:",
        options: [
          { text: "Everything is decided and scheduled", value: "J", score: 2 },
          { text: "Major decisions are made", value: "J", score: 1 },
          { text: "Options are kept open", value: "P", score: 1 },
          { text: "Nothing is locked in - maximum flexibility", value: "P", score: 2 }
        ]
      },
      {
        id: "jp7",
        scenario: "Your daily routine is:",
        options: [
          { text: "Very consistent - same schedule every day", value: "J", score: 2 },
          { text: "Generally consistent with some variation", value: "J", score: 1 },
          { text: "Flexible - depends on the day", value: "P", score: 1 },
          { text: "No routine - I go with the flow", value: "P", score: 2 }
        ]
      },
      {
        id: "jp8",
        scenario: "When shopping for something specific:",
        options: [
          { text: "Research thoroughly, decide, buy immediately", value: "J", score: 2 },
          { text: "Research, compare options, then decide", value: "J", score: 1 },
          { text: "Browse casually, buy when something feels right", value: "P", score: 1 },
          { text: "Keep looking - might find something better", value: "P", score: 2 }
        ]
      },
      {
        id: "jp9",
        scenario: "You approach deadlines by:",
        options: [
          { text: "Finishing well ahead of time", value: "J", score: 2 },
          { text: "Working steadily to complete on time", value: "J", score: 1 },
          { text: "Working more as the deadline approaches", value: "P", score: 1 },
          { text: "Last-minute rush - I work best under pressure", value: "P", score: 2 }
        ]
      },
      {
        id: "jp10",
        scenario: "Uncertainty makes you feel:",
        options: [
          { text: "Very uncomfortable - I need closure", value: "J", score: 2 },
          { text: "Somewhat uncomfortable - prefer clarity", value: "J", score: 1 },
          { text: "Fine - I'm comfortable with ambiguity", value: "P", score: 1 },
          { text: "Energized - I love open possibilities", value: "P", score: 2 }
        ]
      }
    ]
  };

  // Flatten all questions
  const allQuestions = [
    ...questions.energyDirection,
    ...questions.information,
    ...questions.decisions,
    ...questions.lifestyle
  ];

  const handleAnswer = (option) => {
    const question = allQuestions[currentQuestion];
    
    const response = {
      questionId: question.id,
      dichotomy: question.id.substring(0, 2).toUpperCase(),
      scenario: question.scenario,
      selectedText: option.text,
      value: option.value,
      score: option.score,
      timestamp: new Date().toISOString()
    };

    setResponses(prev => [...prev, response]);

    // Move to next question
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete!
      onComplete([...responses, response]);
    }
  };

  const question = allQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;

  // Determine current section
  const currentSection = 
    currentQuestion < 10 ? 'Energy Direction (E/I)' :
    currentQuestion < 20 ? 'Information Gathering (S/N)' :
    currentQuestion < 30 ? 'Decision Making (T/F)' :
    'Lifestyle (J/P)';

  return (
    <div className="mbti-assessment">
      
      {/* Header */}
      <div className="assessment-header">
        <h2>MBTI Cognitive Functions</h2>
        <p className="subtitle">{currentSection} - Question {currentQuestion + 1} of {allQuestions.length}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
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
                className="option-button"
                onClick={() => handleAnswer(option)}
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
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>
        <span className="question-counter">
          {currentQuestion + 1} / {allQuestions.length}
        </span>
        <span className="section-indicator">{currentSection}</span>
      </div>

    </div>
  );
}
