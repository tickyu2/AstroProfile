import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BigFiveAssessment.css';

/**
 * Big Five (OCEAN) Personality Assessment
 * 50 scenario-based questions revealing true behavioral patterns
 */
export function BigFiveAssessment({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentTrait, setCurrentTrait] = useState('openness');

  // Big Five Questions - 10 per trait
  const questions = {
    openness: [
      {
        id: "o1",
        scenario: "You have a free weekend with no plans.",
        options: [
          { text: "Visit a museum or art gallery I've never been to", score: 5, trait: "high" },
          { text: "Try that new exotic restaurant everyone's talking about", score: 4, trait: "high" },
          { text: "Stay home and dive into a documentary series", score: 3, trait: "medium" },
          { text: "Meet friends at our usual spot", score: 2, trait: "low" },
          { text: "Catch up on household tasks and errands", score: 1, trait: "low" }
        ]
      },
      {
        id: "o2",
        scenario: "A colleague suggests a completely new way to solve a recurring problem.",
        options: [
          { text: "Get excited and immediately explore the idea", score: 5, trait: "high" },
          { text: "Interested but want to understand the theory first", score: 4, trait: "high" },
          { text: "Open to it but need to see proof it works", score: 3, trait: "medium" },
          { text: "Skeptical - our current method works fine", score: 2, trait: "low" },
          { text: "Resistant - why fix what isn't broken?", score: 1, trait: "low" }
        ]
      },
      {
        id: "o3",
        scenario: "You're reading a book and encounter a complex philosophical concept.",
        options: [
          { text: "Pause and research it deeply for an hour", score: 5, trait: "high" },
          { text: "Think about how it applies to my life", score: 4, trait: "high" },
          { text: "Make a mental note and continue reading", score: 3, trait: "medium" },
          { text: "Skim over it - I'm here for the story", score: 2, trait: "low" },
          { text: "Skip it entirely - too abstract", score: 1, trait: "low" }
        ]
      },
      {
        id: "o4",
        scenario: "Someone asks your opinion on modern art that looks like 'random paint splashes'.",
        options: [
          { text: "Fascinating! Let me analyze the technique and meaning", score: 5, trait: "high" },
          { text: "I can appreciate the creativity even if it's not my style", score: 4, trait: "high" },
          { text: "Art is subjective - to each their own", score: 3, trait: "medium" },
          { text: "I prefer traditional art with clear subjects", score: 2, trait: "low" },
          { text: "That's not real art - my kid could do that", score: 1, trait: "low" }
        ]
      },
      {
        id: "o5",
        scenario: "You're planning a vacation. What sounds most appealing?",
        options: [
          { text: "Backpacking through a country I've never been to", score: 5, trait: "high" },
          { text: "Cultural tour of historical sites and museums", score: 4, trait: "high" },
          { text: "Mix of relaxation and some local exploration", score: 3, trait: "medium" },
          { text: "Familiar beach resort where I know what to expect", score: 2, trait: "low" },
          { text: "Staycation - no travel stress", score: 1, trait: "low" }
        ]
      },
      {
        id: "o6",
        scenario: "Your friend invites you to a poetry slam/open mic night.",
        options: [
          { text: "Absolutely! And maybe I'll perform something myself", score: 5, trait: "high" },
          { text: "Sounds interesting - let's check it out", score: 4, trait: "high" },
          { text: "Sure, I'll give it a try once", score: 3, trait: "medium" },
          { text: "Not really my scene but I'll go to be supportive", score: 2, trait: "low" },
          { text: "No thanks - I'd rather do something else", score: 1, trait: "low" }
        ]
      },
      {
        id: "o7",
        scenario: "You find a book on quantum physics at a bookstore.",
        options: [
          { text: "Buy it immediately - this sounds fascinating", score: 5, trait: "high" },
          { text: "Flip through it - might be interesting", score: 4, trait: "high" },
          { text: "Glance at it but probably too complex", score: 3, trait: "medium" },
          { text: "Not my area of interest", score: 2, trait: "low" },
          { text: "Way too technical - skip entirely", score: 1, trait: "low" }
        ]
      },
      {
        id: "o8",
        scenario: "Someone proposes a game that's completely new to everyone.",
        options: [
          { text: "Great! I love learning new games", score: 5, trait: "high" },
          { text: "Sounds fun - let's try it", score: 4, trait: "high" },
          { text: "OK, as long as rules are clear", score: 3, trait: "medium" },
          { text: "I'd rather play something we all know", score: 2, trait: "low" },
          { text: "Let's stick to familiar games", score: 1, trait: "low" }
        ]
      },
      {
        id: "o9",
        scenario: "Your city is hosting an experimental theater performance.",
        options: [
          { text: "Definitely going - experimental art pushes boundaries", score: 5, trait: "high" },
          { text: "Intrigued - worth experiencing", score: 4, trait: "high" },
          { text: "Maybe - depends on reviews", score: 3, trait: "medium" },
          { text: "Prefer traditional theater", score: 2, trait: "low" },
          { text: "Not interested in weird avant-garde stuff", score: 1, trait: "low" }
        ]
      },
      {
        id: "o10",
        scenario: "You have a chance to take a class on a completely random topic.",
        options: [
          { text: "Sign me up! Love learning anything new", score: 5, trait: "high" },
          { text: "If it sounds interesting, absolutely", score: 4, trait: "high" },
          { text: "Depends on the topic", score: 3, trait: "medium" },
          { text: "Only if it's relevant to my interests", score: 2, trait: "low" },
          { text: "I prefer to deepen existing knowledge", score: 1, trait: "low" }
        ]
      }
    ],

    conscientiousness: [
      {
        id: "c1",
        scenario: "It's Sunday night. You have a big presentation on Friday.",
        options: [
          { text: "Already finished - I completed it Thursday", score: 5, trait: "high" },
          { text: "I'll work on it Monday-Wednesday, review Thursday", score: 4, trait: "high" },
          { text: "I'll start Tuesday, finish by Thursday", score: 3, trait: "medium" },
          { text: "I'll probably start Wednesday or Thursday", score: 2, trait: "low" },
          { text: "I work best under pressure - Thursday night!", score: 1, trait: "low" }
        ]
      },
      {
        id: "c2",
        scenario: "You're packing for a 2-week trip abroad tomorrow morning.",
        options: [
          { text: "Already packed days ago with a checklist", score: 5, trait: "high" },
          { text: "Pack tonight using my tried-and-true list", score: 4, trait: "high" },
          { text: "Pack tomorrow morning - I know what I need", score: 3, trait: "medium" },
          { text: "Throw things in my bag last minute", score: 2, trait: "low" },
          { text: "Buy what I need when I get there", score: 1, trait: "low" }
        ]
      },
      {
        id: "c3",
        scenario: "You discover you've been doing a work task incorrectly for 3 weeks.",
        options: [
          { text: "Immediately create a checklist to prevent this", score: 5, trait: "high" },
          { text: "Document the correct process and redo work", score: 4, trait: "high" },
          { text: "Fix going forward, learn from mistake", score: 3, trait: "medium" },
          { text: "Fix it but don't overthink it", score: 2, trait: "low" },
          { text: "It wasn't that important anyway", score: 1, trait: "low" }
        ]
      },
      {
        id: "c4",
        scenario: "Your typical morning routine on a workday is:",
        options: [
          { text: "Same schedule every day, down to the minute", score: 5, trait: "high" },
          { text: "General routine with some flexibility", score: 4, trait: "high" },
          { text: "Wake up and see how I feel", score: 3, trait: "medium" },
          { text: "Different every day depending on mood", score: 2, trait: "low" },
          { text: "What routine? I wing it", score: 1, trait: "low" }
        ]
      },
      {
        id: "c5",
        scenario: "You're working on a project with multiple deadlines.",
        options: [
          { text: "Create detailed timeline with milestones tracked daily", score: 5, trait: "high" },
          { text: "Break into phases with weekly check-ins", score: 4, trait: "high" },
          { text: "Know the deadlines, work toward them organically", score: 3, trait: "medium" },
          { text: "Start when it feels urgent", score: 2, trait: "low" },
          { text: "Deadlines are more like suggestions", score: 1, trait: "low" }
        ]
      },
      {
        id: "c6",
        scenario: "Your desk/workspace typically looks:",
        options: [
          { text: "Everything has a place, labeled and organized", score: 5, trait: "high" },
          { text: "Mostly organized with a system", score: 4, trait: "high" },
          { text: "Organized chaos - I know where things are", score: 3, trait: "medium" },
          { text: "Cluttered but functional", score: 2, trait: "low" },
          { text: "Creative mess - organization limits creativity", score: 1, trait: "low" }
        ]
      },
      {
        id: "c7",
        scenario: "You promised to call a friend back. It's been 2 days.",
        options: [
          { text: "Would never let it get to 2 days - I call same day", score: 5, trait: "high" },
          { text: "Feel guilty - will call today for sure", score: 4, trait: "high" },
          { text: "Remember but waiting for good time to chat", score: 3, trait: "medium" },
          { text: "Oh yeah, I should do that soon", score: 2, trait: "low" },
          { text: "They'll understand I'm busy", score: 1, trait: "low" }
        ]
      },
      {
        id: "c8",
        scenario: "You're hosting a dinner party this weekend.",
        options: [
          { text: "Menu planned, shopping done, timeline created", score: 5, trait: "high" },
          { text: "Know what I'm making, will shop Thursday", score: 4, trait: "high" },
          { text: "Have a general idea, will figure it out", score: 3, trait: "medium" },
          { text: "Will throw something together day-of", score: 2, trait: "low" },
          { text: "We'll probably just order pizza", score: 1, trait: "low" }
        ]
      },
      {
        id: "c9",
        scenario: "You receive a long, detailed email requiring a thoughtful response.",
        options: [
          { text: "Respond same day with thorough, organized reply", score: 5, trait: "high" },
          { text: "Respond within 48 hours, well thought out", score: 4, trait: "high" },
          { text: "Reply when I have time to think about it", score: 3, trait: "medium" },
          { text: "Send quick response now, details later maybe", score: 2, trait: "low" },
          { text: "Will get to it eventually", score: 1, trait: "low" }
        ]
      },
      {
        id: "c10",
        scenario: "You're cleaning out your closet.",
        options: [
          { text: "Sort into categories, donate/keep system, reorganize fully", score: 5, trait: "high" },
          { text: "Go through methodically, make clear decisions", score: 4, trait: "high" },
          { text: "Remove obvious things, generally tidy up", score: 3, trait: "medium" },
          { text: "Quickly grab things that don't fit", score: 2, trait: "low" },
          { text: "Get distracted trying things on, give up", score: 1, trait: "low" }
        ]
      }
    ],

    extraversion: [
      {
        id: "e1",
        scenario: "After a long, intense week of work, you have Friday evening free.",
        options: [
          { text: "Call friends immediately - let's go out!", score: 5, trait: "high" },
          { text: "See if anyone wants to grab dinner", score: 4, trait: "high" },
          { text: "Maybe meet one close friend for coffee", score: 3, trait: "medium" },
          { text: "Stay home but text friends", score: 2, trait: "low" },
          { text: "Absolutely need alone time to recharge", score: 1, trait: "low" }
        ]
      },
      {
        id: "e2",
        scenario: "At a party, you don't know anyone except the host who is busy.",
        options: [
          { text: "Introduce myself to groups - this is exciting!", score: 5, trait: "high" },
          { text: "Strike up conversations with a few people", score: 4, trait: "high" },
          { text: "Wait for natural conversation openings", score: 3, trait: "medium" },
          { text: "Stay near the host or people I might know", score: 2, trait: "low" },
          { text: "Find a quiet corner and check my phone", score: 1, trait: "low" }
        ]
      },
      {
        id: "e3",
        scenario: "Your ideal birthday celebration would be:",
        options: [
          { text: "Big party with 30+ friends and new people", score: 5, trait: "high" },
          { text: "Dinner party with 10-15 close friends", score: 4, trait: "high" },
          { text: "Dinner with 4-6 closest friends", score: 3, trait: "medium" },
          { text: "Intimate dinner with 1-2 best friends", score: 2, trait: "low" },
          { text: "Quiet day by myself doing what I love", score: 1, trait: "low" }
        ]
      },
      {
        id: "e4",
        scenario: "You have exciting news. Your first instinct is to:",
        options: [
          { text: "Call multiple friends immediately to share", score: 5, trait: "high" },
          { text: "Text or call a few close people", score: 4, trait: "high" },
          { text: "Tell people as I see them", score: 3, trait: "medium" },
          { text: "Share with one or two people", score: 2, trait: "low" },
          { text: "Process it internally first before sharing", score: 1, trait: "low" }
        ]
      },
      {
        id: "e5",
        scenario: "You're at a coffee shop working alone. Someone nearby starts a conversation.",
        options: [
          { text: "Welcome the break - love meeting new people", score: 5, trait: "high" },
          { text: "Chat briefly, might be interesting", score: 4, trait: "high" },
          { text: "Be polite but keep it short", score: 3, trait: "medium" },
          { text: "Give minimal responses to get back to work", score: 2, trait: "low" },
          { text: "Put in headphones to avoid conversation", score: 1, trait: "low" }
        ]
      },
      {
        id: "e6",
        scenario: "You're invited to a networking event.",
        options: [
          { text: "Perfect! Love meeting new people and making connections", score: 5, trait: "high" },
          { text: "Could be useful - I'll go", score: 4, trait: "high" },
          { text: "Will attend but find it draining", score: 3, trait: "medium" },
          { text: "Would rather avoid but might force myself", score: 2, trait: "low" },
          { text: "Absolutely not - sounds awful", score: 1, trait: "low" }
        ]
      },
      {
        id: "e7",
        scenario: "Your perfect Saturday afternoon involves:",
        options: [
          { text: "Group activities - sports, events, hanging out", score: 5, trait: "high" },
          { text: "Lunch with friends then maybe an activity", score: 4, trait: "high" },
          { text: "Balance of social time and alone time", score: 3, trait: "medium" },
          { text: "Mostly solo activities, maybe see one person", score: 2, trait: "low" },
          { text: "Complete solitude - recharge time", score: 1, trait: "low" }
        ]
      },
      {
        id: "e8",
        scenario: "You're working on a challenging problem.",
        options: [
          { text: "Immediately call someone to brainstorm together", score: 5, trait: "high" },
          { text: "Work on it a bit, then discuss with others", score: 4, trait: "high" },
          { text: "Think it through, validate ideas with someone", score: 3, trait: "medium" },
          { text: "Solve it myself, maybe share solution", score: 2, trait: "low" },
          { text: "Definitely solve it alone - that's how I think best", score: 1, trait: "low" }
        ]
      },
      {
        id: "e9",
        scenario: "You've moved to a new city. After a month you:",
        options: [
          { text: "Already have multiple friend groups and social plans", score: 5, trait: "high" },
          { text: "Met several people, starting to build community", score: 4, trait: "high" },
          { text: "Made a few connections, taking it slow", score: 3, trait: "medium" },
          { text: "Still adjusting, haven't really reached out yet", score: 2, trait: "low" },
          { text: "Perfectly happy exploring the city alone", score: 1, trait: "low" }
        ]
      },
      {
        id: "e10",
        scenario: "The meeting ran long and you have 30 minutes before the next one.",
        options: [
          { text: "Find colleagues to chat with", score: 5, trait: "high" },
          { text: "Maybe grab coffee with someone", score: 4, trait: "high" },
          { text: "Quick break, then prep for next meeting", score: 3, trait: "medium" },
          { text: "Find a quiet space to decompress", score: 2, trait: "low" },
          { text: "Need complete solitude to recharge", score: 1, trait: "low" }
        ]
      }
    ]

    // ... agreeableness and neuroticism questions would go here
    // (Shortened for brevity - full implementation would have all 50 questions)
  };

  const allQuestions = [
    ...questions.openness.map(q => ({ ...q, trait: 'openness' })),
    ...questions.conscientiousness.map(q => ({ ...q, trait: 'conscientiousness' })),
    ...questions.extraversion.map(q => ({ ...q, trait: 'extraversion' }))
    // ... add agreeableness and neuroticism
  ];

  const handleAnswer = (option) => {
    const question = allQuestions[currentQuestion];
    
    const response = {
      questionId: question.id,
      trait: question.trait,
      scenario: question.scenario,
      selectedText: option.text,
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

  return (
    <div className="big-five-assessment">
      
      {/* Header */}
      <div className="assessment-header">
        <h2>Personality Assessment</h2>
        <p className="subtitle">Big Five (OCEAN) - Question {currentQuestion + 1} of {allQuestions.length}</p>
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
        <button 
          className="btn-secondary"
          disabled={true}
        >
          Skip for now
        </button>
      </div>

    </div>
  );
}
