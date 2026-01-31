import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoveLanguagesAssessment.css';

/**
 * Love Languages Assessment
 * 30 scenario-based questions revealing how you give and receive love
 * Based on Gary Chapman's Five Love Languages
 */
export function LoveLanguagesAssessment({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);

  const questions = [
    {
      id: "ll1",
      scenario: "Your partner surprises you. Which means the most?",
      options: [
        { text: "They cleared their evening to spend time with you", language: "Quality Time", score: 5 },
        { text: "They bought you something you mentioned wanting", language: "Gifts", score: 5 },
        { text: "They told you how much they appreciate you", language: "Words of Affirmation", score: 5 },
        { text: "They gave you a long, warm hug", language: "Physical Touch", score: 5 },
        { text: "They did that chore you've been dreading", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll2",
      scenario: "After a hard day, you feel most loved when your partner:",
      options: [
        { text: "Sits with you and really listens", language: "Quality Time", score: 5 },
        { text: "Surprises you with takeout from your favorite place", language: "Gifts", score: 5 },
        { text: "Says 'You handled that so well - I'm proud of you'", language: "Words of Affirmation", score: 5 },
        { text: "Holds you close without saying anything", language: "Physical Touch", score: 5 },
        { text: "Takes care of dinner and cleanup so you can rest", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll3",
      scenario: "You feel most disconnected from your partner when they:",
      options: [
        { text: "Are physically present but distracted by phone", language: "Quality Time", score: 5 },
        { text: "Forget special occasions or meaningful dates", language: "Gifts", score: 5 },
        { text: "Don't verbally appreciate what you do", language: "Words of Affirmation", score: 5 },
        { text: "Avoid physical affection", language: "Physical Touch", score: 5 },
        { text: "Never help with tasks or responsibilities", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll4",
      scenario: "Your ideal date night includes:",
      options: [
        { text: "Long conversation over dinner, phones away", language: "Quality Time", score: 5 },
        { text: "Going somewhere they planned specially for you", language: "Gifts", score: 5 },
        { text: "Them expressing how much you mean to them", language: "Words of Affirmation", score: 5 },
        { text: "Dancing, cuddling, physical closeness", language: "Physical Touch", score: 5 },
        { text: "Them handling all the planning and logistics", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll5",
      scenario: "You show love to your partner by:",
      options: [
        { text: "Making time for them no matter how busy I am", language: "Quality Time", score: 5 },
        { text: "Getting them thoughtful gifts", language: "Gifts", score: 5 },
        { text: "Telling them how amazing they are", language: "Words of Affirmation", score: 5 },
        { text: "Physical affection - hugs, kisses, cuddles", language: "Physical Touch", score: 5 },
        { text: "Doing things to make their life easier", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll6",
      scenario: "For your birthday, you'd most appreciate:",
      options: [
        { text: "A full day together doing activities we both enjoy", language: "Quality Time", score: 5 },
        { text: "A meaningful gift that shows they know me", language: "Gifts", score: 5 },
        { text: "A heartfelt letter or card expressing their love", language: "Words of Affirmation", score: 5 },
        { text: "A day of physical closeness and affection", language: "Physical Touch", score: 5 },
        { text: "Them handling everything - I just relax", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll7",
      scenario: "You know your partner loves you when they:",
      options: [
        { text: "Put away distractions to focus on me", language: "Quality Time", score: 5 },
        { text: "Remember little things I mentioned wanting", language: "Gifts", score: 5 },
        { text: "Tell me specific things they appreciate", language: "Words of Affirmation", score: 5 },
        { text: "Reach for me - hold my hand, hug me", language: "Physical Touch", score: 5 },
        { text: "Do things without me asking", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll8",
      scenario: "What hurts most in a relationship?",
      options: [
        { text: "Being together but not really connecting", language: "Quality Time", score: 5 },
        { text: "They forgot something important to me", language: "Gifts", score: 5 },
        { text: "They criticize or don't appreciate me", language: "Words of Affirmation", score: 5 },
        { text: "They pull away when I reach for them", language: "Physical Touch", score: 5 },
        { text: "I have to do everything myself", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll9",
      scenario: "Your partner is stressed. You help by:",
      options: [
        { text: "Giving them my full attention and listening", language: "Quality Time", score: 5 },
        { text: "Getting them something to cheer them up", language: "Gifts", score: 5 },
        { text: "Telling them how capable and strong they are", language: "Words of Affirmation", score: 5 },
        { text: "Giving them a massage or holding them", language: "Physical Touch", score: 5 },
        { text: "Taking tasks off their plate", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll10",
      scenario: "You feel closest to your partner when:",
      options: [
        { text: "We're talking for hours about everything", language: "Quality Time", score: 5 },
        { text: "They surprise me with something special", language: "Gifts", score: 5 },
        { text: "They tell me why they chose me", language: "Words of Affirmation", score: 5 },
        { text: "We're physically close - cuddling, touching", language: "Physical Touch", score: 5 },
        { text: "We're working together on something", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll11",
      scenario: "During an argument, you need:",
      options: [
        { text: "Time together to talk it through fully", language: "Quality Time", score: 5 },
        { text: "A gesture showing they're thinking of me", language: "Gifts", score: 5 },
        { text: "Verbal reassurance that we're okay", language: "Words of Affirmation", score: 5 },
        { text: "A hug - physical reconnection", language: "Physical Touch", score: 5 },
        { text: "Them taking action to fix the issue", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll12",
      scenario: "What makes you feel most secure in love?",
      options: [
        { text: "Regular quality time together", language: "Quality Time", score: 5 },
        { text: "Thoughtful gifts and gestures", language: "Gifts", score: 5 },
        { text: "Constant verbal affirmation", language: "Words of Affirmation", score: 5 },
        { text: "Frequent physical affection", language: "Physical Touch", score: 5 },
        { text: "Them consistently helping me", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll13",
      scenario: "Your partner is away for a week. You miss most:",
      options: [
        { text: "Our conversations and time together", language: "Quality Time", score: 5 },
        { text: "Little surprises they usually leave me", language: "Gifts", score: 5 },
        { text: "Hearing them say they love me", language: "Words of Affirmation", score: 5 },
        { text: "Physical closeness and touch", language: "Physical Touch", score: 5 },
        { text: "All the things they do for me", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll14",
      scenario: "When celebrating good news, you want your partner to:",
      options: [
        { text: "Stop everything and celebrate with me", language: "Quality Time", score: 5 },
        { text: "Get something special to commemorate it", language: "Gifts", score: 5 },
        { text: "Tell me how proud and happy they are", language: "Words of Affirmation", score: 5 },
        { text: "Hug me tight and share the joy physically", language: "Physical Touch", score: 5 },
        { text: "Handle everything so I can enjoy the moment", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll15",
      scenario: "You feel unloved when your partner:",
      options: [
        { text: "Is always too busy for quality time", language: "Quality Time", score: 5 },
        { text: "Never thinks to get me anything", language: "Gifts", score: 5 },
        { text: "Doesn't verbally express appreciation", language: "Words of Affirmation", score: 5 },
        { text: "Rarely initiates physical affection", language: "Physical Touch", score: 5 },
        { text: "Doesn't help even when I'm overwhelmed", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll16",
      scenario: "An ordinary Tuesday evening feels perfect when:",
      options: [
        { text: "We're together with no distractions", language: "Quality Time", score: 5 },
        { text: "They bring home a small surprise", language: "Gifts", score: 5 },
        { text: "They tell me something they appreciate", language: "Words of Affirmation", score: 5 },
        { text: "We're cuddled on the couch", language: "Physical Touch", score: 5 },
        { text: "They handled dinner without asking", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll17",
      scenario: "To reconnect after being distant, you need:",
      options: [
        { text: "Quality time talking and being together", language: "Quality Time", score: 5 },
        { text: "A thoughtful gesture or gift", language: "Gifts", score: 5 },
        { text: "Words explaining what I mean to them", language: "Words of Affirmation", score: 5 },
        { text: "Physical closeness and affection", language: "Physical Touch", score: 5 },
        { text: "Them taking care of things for me", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll18",
      scenario: "You show your partner you're thinking of them by:",
      options: [
        { text: "Making plans to spend time together", language: "Quality Time", score: 5 },
        { text: "Picking up something they'd like", language: "Gifts", score: 5 },
        { text: "Sending a sweet text message", language: "Words of Affirmation", score: 5 },
        { text: "Physical affection when I see them", language: "Physical Touch", score: 5 },
        { text: "Doing something to help them", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll19",
      scenario: "What would make a regular day feel special?",
      options: [
        { text: "Partner putting away phone for quality time", language: "Quality Time", score: 5 },
        { text: "Coming home to a small surprise", language: "Gifts", score: 5 },
        { text: "Receiving an unexpected compliment", language: "Words of Affirmation", score: 5 },
        { text: "Extra physical affection throughout the day", language: "Physical Touch", score: 5 },
        { text: "Partner doing my usual chores", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll20",
      scenario: "You feel most appreciated when your partner:",
      options: [
        { text: "Makes me their priority over other commitments", language: "Quality Time", score: 5 },
        { text: "Remembers things I casually mentioned", language: "Gifts", score: 5 },
        { text: "Tells me specifically what they value about me", language: "Words of Affirmation", score: 5 },
        { text: "Shows affection in front of others", language: "Physical Touch", score: 5 },
        { text: "Does things without being asked", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll21",
      scenario: "When you're sick, you want your partner to:",
      options: [
        { text: "Stay with me and keep me company", language: "Quality Time", score: 5 },
        { text: "Bring me soup or medicine", language: "Gifts", score: 5 },
        { text: "Tell me I'll be okay and they're here for me", language: "Words of Affirmation", score: 5 },
        { text: "Cuddle with me (if not contagious)", language: "Physical Touch", score: 5 },
        { text: "Take care of everything I can't do", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll22",
      scenario: "What makes you fall more in love?",
      options: [
        { text: "Deep conversations and shared experiences", language: "Quality Time", score: 5 },
        { text: "Thoughtful gestures that show they know me", language: "Gifts", score: 5 },
        { text: "When they express what I mean to them", language: "Words of Affirmation", score: 5 },
        { text: "Consistent physical affection and closeness", language: "Physical Touch", score: 5 },
        { text: "Watching them take care of things for me", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll23",
      scenario: "You'd be most hurt if your partner:",
      options: [
        { text: "Cancelled our plans for something else", language: "Quality Time", score: 5 },
        { text: "Forgot our anniversary completely", language: "Gifts", score: 5 },
        { text: "Said something critical in front of others", language: "Words of Affirmation", score: 5 },
        { text: "Pulled away when I tried to hug them", language: "Physical Touch", score: 5 },
        { text: "Expected me to do everything alone", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll24",
      scenario: "Your partner asks how to show love better. You say:",
      options: [
        { text: "Just be present - put away distractions when we're together", language: "Quality Time", score: 5 },
        { text: "Small gestures and surprises mean a lot to me", language: "Gifts", score: 5 },
        { text: "Tell me what you appreciate about me", language: "Words of Affirmation", score: 5 },
        { text: "More physical affection - touch me throughout the day", language: "Physical Touch", score: 5 },
        { text: "Help with things without me having to ask", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll25",
      scenario: "A perfect lazy Sunday together includes:",
      options: [
        { text: "Long conversations and just being together", language: "Quality Time", score: 5 },
        { text: "Them surprising me with breakfast in bed", language: "Gifts", score: 5 },
        { text: "Them telling me how much they love our life together", language: "Words of Affirmation", score: 5 },
        { text: "Cuddling and physical closeness all day", language: "Physical Touch", score: 5 },
        { text: "Them handling all the chores", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll26",
      scenario: "You notice your partner is sad. You:",
      options: [
        { text: "Clear my schedule to be with them", language: "Quality Time", score: 5 },
        { text: "Get them something to cheer them up", language: "Gifts", score: 5 },
        { text: "Tell them everything will be okay", language: "Words of Affirmation", score: 5 },
        { text: "Hold them and be physically close", language: "Physical Touch", score: 5 },
        { text: "Take care of their responsibilities", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll27",
      scenario: "What fills your emotional tank most?",
      options: [
        { text: "Undivided attention and presence", language: "Quality Time", score: 5 },
        { text: "Thoughtful tokens of love", language: "Gifts", score: 5 },
        { text: "Verbal expressions of love and appreciation", language: "Words of Affirmation", score: 5 },
        { text: "Physical touch and affection", language: "Physical Touch", score: 5 },
        { text: "Actions that make my life easier", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll28",
      scenario: "You feel most valued when:",
      options: [
        { text: "Partner makes time for me despite being busy", language: "Quality Time", score: 5 },
        { text: "Partner puts thought into gifts and gestures", language: "Gifts", score: 5 },
        { text: "Partner publicly acknowledges how great I am", language: "Words of Affirmation", score: 5 },
        { text: "Partner is consistently physically affectionate", language: "Physical Touch", score: 5 },
        { text: "Partner anticipates my needs and helps", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll29",
      scenario: "After a big achievement, you want:",
      options: [
        { text: "Partner to celebrate with focused time together", language: "Quality Time", score: 5 },
        { text: "A special gift or experience to commemorate it", language: "Gifts", score: 5 },
        { text: "Partner to tell everyone how proud they are", language: "Words of Affirmation", score: 5 },
        { text: "Physical celebration - big hug, kiss", language: "Physical Touch", score: 5 },
        { text: "Partner to handle everything so I can enjoy", language: "Acts of Service", score: 5 }
      ]
    },
    {
      id: "ll30",
      scenario: "Love feels most real when:",
      options: [
        { text: "We're fully present with each other", language: "Quality Time", score: 5 },
        { text: "I receive something that shows they know me", language: "Gifts", score: 5 },
        { text: "They say exactly what I need to hear", language: "Words of Affirmation", score: 5 },
        { text: "We're physically connected", language: "Physical Touch", score: 5 },
        { text: "They take care of me through actions", language: "Acts of Service", score: 5 }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const question = questions[currentQuestion];
    
    const response = {
      questionId: question.id,
      scenario: question.scenario,
      selectedText: option.text,
      language: option.language,
      score: option.score,
      timestamp: new Date().toISOString()
    };

    setResponses(prev => [...prev, response]);

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete!
      onComplete([...responses, response]);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="love-languages-assessment">
      
      {/* Header */}
      <div className="assessment-header">
        <h2>Love Languages</h2>
        <p className="subtitle">How You Give and Receive Love - Question {currentQuestion + 1} of {questions.length}</p>
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
                className={`option-button love-language-${option.language.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => handleAnswer(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option.text}</span>
                <span className="language-badge">{option.language}</span>
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
          {currentQuestion + 1} / {questions.length}
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
