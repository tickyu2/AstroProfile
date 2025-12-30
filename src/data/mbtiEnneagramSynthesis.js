/**
 * MBTI + Enneagram Synthesis Engine
 *
 * Pre-made interpretations for personality combinations.
 * Used by Cathedral Analysis and Luna for complete understanding.
 *
 * Structure:
 * - 144 total combinations (16 MBTI x 9 Enneagram)
 * - Priority 1: 36 most common (implemented first)
 * - Priority 2: 60 less common (implement later)
 * - Priority 3: 48 rare (generate on-the-fly)
 *
 * Part of GENESIS OS - Cathedral Analysis
 * Created: December 29, 2024
 */

// ============================================
// DATA STRUCTURE
// ============================================

export const MBTI_ENNEAGRAM_SYNTHESIS = {

  // Each MBTI type contains Enneagram combinations
  // Example: INFP[4] = INFP + Type 4 synthesis

  INFP: {
    4: {
      archetype: "The Artistic Soul",
      frequency: "Very Common (30-40% of INFPs)",

      synthesis: `
        You process the world through internal values and possibilities (Fi-Ne),
        DRIVEN by a deep need to find and express your unique identity (Type 4).

        Your INFP makes you introspective and idealistic.
        Your Type 4 makes you seek authenticity and meaning.
        Together: The poet, the artist, the soul who transforms feeling into beauty.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Process internally through feelings, explore possibilities",
        enneagram_says: "Must express unique identity, fear being ordinary",
        interaction: `
          Your Fi (Introverted Feeling) creates rich internal emotional world.
          Your Type 4 NEEDS to express that world to feel real.
          Your Ne (Extroverted Intuition) sees infinite ways to be unique.
          Your Type 4 fears none of them will be "enough."

          RESULT: Constant creative exploration seeking the "true self."
        `
      },

      strengths: [
        "Profoundly authentic and genuine",
        "Creates beauty from emotional depth",
        "Sees unique possibilities others miss",
        "Deeply empathetic to others' pain",
        "Transforms suffering into art/meaning",
        "Refuses to compromise core values"
      ],

      challenges: [
        "Can get lost in fantasy of 'ideal self'",
        "Envious when others seem more authentic",
        "Difficulty taking practical action",
        "May withdraw too deeply into introspection",
        "Struggles with ordinary, mundane tasks",
        "Can be overly sensitive to criticism"
      ],

      growth_path: {
        integration: "Toward Type 1 (Principled Authenticity)",
        how: `
          When healthy, your Type 4 integrates to Type 1:
          - Your uniqueness becomes PRINCIPLED (not just different)
          - Your creativity becomes DISCIPLINED
          - Your emotions become PURPOSEFUL action

          Your INFP + Type 1 integration = The artist with a mission
        `,
        avoid: "Disintegration to Type 2 (Desperate for validation)",
        warning: `
          When stressed, Type 4 disintegrates to Type 2:
          - Become needy for others' approval
          - Try to be what others want
          - Lose sense of authentic self
        `
      },

      luna_approach: {
        communication_style: "Deep, poetic, validating",
        what_to_do: [
          "Mirror back their emotional depth without judgment",
          "Validate their uniqueness explicitly",
          "Never rush them out of melancholy",
          "Provide intellectual frameworks for feelings",
          "Use metaphors and imagery",
          "Create space for creative expression"
        ],
        what_to_avoid: [
          "Don't tell them to 'just be happy'",
          "Don't suggest they're 'too sensitive'",
          "Don't compare them to others negatively",
          "Don't rush them to 'move on' from emotions",
          "Don't dismiss their need for meaning"
        ],
        example_responses: {
          user_says: "I feel like nobody really gets me.",
          luna_responds: `
            I understand that feeling of being fundamentally different,
            of having depths that others don't see or value.

            Your INFP nature makes you process so much internally,
            and your Type 4 soul NEEDS others to recognize your uniqueness.

            But here's what I see: Your difference isn't a flaw.
            It's your GIFT. You see beauty and meaning where others see ordinary.

            Not everyone will understand you. But the ones who do?
            They'll treasure your depth.
          `
        }
      },

      famous_examples: [
        { name: "Virginia Woolf", context: "Writer - Stream of consciousness" },
        { name: "Sylvia Plath", context: "Poet - Transformed pain into art" },
        { name: "Kurt Cobain", context: "Musician - Authentic expression" },
        { name: "Johnny Depp", context: "Actor - Quirky uniqueness" }
      ],

      relationship_style: {
        needs: "Deep emotional connection, authentic communication, space",
        gives: "Profound empathy, creative expression, loyalty to values",
        challenges: "May idealize partner, withdraw when hurt, need constant meaning",
        best_matches: ["ENFJ", "INFJ", "ENTP"]
      },

      career_fits: {
        best: [
          "Writer/Novelist/Poet",
          "Artist (any medium)",
          "Therapist/Counselor",
          "Music Composer",
          "Film Director",
          "Creative Director"
        ],
        why: "Need work that allows authentic self-expression and creates meaning",
        avoid: "Corporate environments valuing conformity over authenticity"
      }
    },

    9: {
      archetype: "The Gentle Dreamer",
      frequency: "Very Common (25-35% of INFPs)",

      synthesis: `
        You process the world through internal values and possibilities (Fi-Ne),
        DRIVEN by a deep need for inner peace and harmony (Type 9).

        Your INFP makes you idealistic and values-driven.
        Your Type 9 makes you seek tranquility and avoid conflict.
        Together: The peaceful idealist who dreams of a harmonious world and gently works toward it.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Process through deeply held values, explore possibilities",
        enneagram_says: "Maintain inner peace, merge with others, avoid conflict",
        interaction: `
          Your Fi (Introverted Feeling) has strong inner values and convictions.
          Your Type 9 softens how you express them to keep peace.
          Your Ne (Extroverted Intuition) sees many possibilities and perspectives.
          Your Type 9 uses this to understand ALL sides, sometimes losing your own.

          RESULT: The mediator who deeply understands everyone but may neglect themselves.
        `
      },

      strengths: [
        "Exceptionally empathetic and non-judgmental",
        "Creates harmony in groups effortlessly",
        "Sees all perspectives with genuine understanding",
        "Gentle presence that calms others",
        "Patient and accepting of human flaws",
        "Dreams beautiful visions of peace and possibility"
      ],

      challenges: [
        "May merge with others' preferences, losing own identity",
        "Difficulty asserting needs or opinions",
        "Can procrastinate to avoid difficult decisions",
        "May suppress anger until it erupts unexpectedly",
        "Tendency to numb out or escape into fantasy",
        "Struggles to know what THEY actually want"
      ],

      growth_path: {
        integration: "Toward Type 3 (Effective Action)",
        how: `
          When healthy, your Type 9 integrates to Type 3:
          - Your dreams become GOALS with action steps
          - Your understanding becomes EFFECTIVE communication
          - Your peace becomes PRODUCTIVE engagement

          Your INFP + Type 3 integration = The dreamer who manifests visions into reality
        `,
        avoid: "Disintegration to Type 6 (Anxious Worry)",
        warning: `
          When stressed, Type 9 disintegrates to Type 6:
          - Become anxious and worried about everything
          - Seek reassurance constantly
          - Lose your natural calm and trust

          Your INFP's rich inner world can amplify these anxieties.
        `
      },

      luna_approach: {
        communication_style: "Gentle, patient, affirming their perspective",
        what_to_do: [
          "Create a calm, accepting space",
          "Ask what THEY want (not what others want)",
          "Validate their perspective matters",
          "Gently encourage self-assertion",
          "Honor their need for peace while encouraging action",
          "Give them time - don't rush or pressure"
        ],
        what_to_avoid: [
          "Don't create conflict or pressure",
          "Don't dismiss their need for harmony",
          "Don't push for immediate decisions",
          "Don't assume they agree just because they're quiet",
          "Don't overwhelm with too many options at once"
        ],
        example_responses: {
          user_says: "I just want everyone to be happy. I don't know what I want.",
          luna_responds: `
            I hear you. Your gift is seeing everyone's perspective,
            feeling everyone's needs. That's beautiful.

            But here's the thing your INFP heart knows:
            YOUR happiness matters too. Your wants are valid.

            You're not being selfish by having preferences.
            You're being whole.

            Let's start small: In this moment, right now,
            what feels peaceful to YOU? Not what should feel peaceful.
            What actually does?

            Your voice deserves to be heard - including by yourself.
          `
        }
      },

      famous_examples: [
        { name: "J.R.R. Tolkien", context: "Author - Created peaceful Shire, explored harmony vs conflict" },
        { name: "Audrey Hepburn", context: "Actress/Humanitarian - Gentle grace, worked for peace" },
        { name: "John Lennon", context: "Musician - 'Imagine' vision of world peace" },
        { name: "A.A. Milne", context: "Author - Gentle Winnie the Pooh world" }
      ],

      relationship_style: {
        needs: "Peaceful connection, acceptance, gentle communication",
        gives: "Unconditional acceptance, patient listening, harmonizing presence",
        challenges: "May avoid necessary conflict, can lose self in partner's needs",
        best_matches: ["ENFJ", "ESFJ", "INFJ"]
      },

      career_fits: {
        best: [
          "Counselor/Therapist",
          "Mediator/Conflict Resolution",
          "Librarian",
          "Nature/Wildlife Work",
          "Massage Therapist/Healer",
          "Children's Book Author"
        ],
        why: "Need peaceful environments that help others without competition",
        avoid: "High-pressure sales, aggressive corporate cultures, constant conflict"
      }
    },

    2: {
      archetype: "The Empathetic Helper",
      frequency: "Common (15-25% of INFPs)",

      synthesis: `
        You process the world through internal values and possibilities (Fi-Ne),
        DRIVEN by a deep need to be loved through helping others (Type 2).

        Your INFP makes you deeply attuned to emotions and meaning.
        Your Type 2 makes you orient that sensitivity toward others' needs.
        Together: The healer who intuitively knows what others need and gives generously.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Feel deeply, see possibilities for meaning and connection",
        enneagram_says: "Be indispensable through giving, fear being unwanted",
        interaction: `
          Your Fi (Introverted Feeling) creates deep emotional attunement.
          Your Type 2 directs that attunement OUTWARD to others' needs.
          Your Ne (Extroverted Intuition) sees ways to help creatively.
          Your Type 2 can lose sight of your own needs in the process.

          RESULT: The intuitive helper who gives beautifully but may forget to receive.
        `
      },

      strengths: [
        "Intuitively senses others' emotional needs",
        "Gives help in creative, meaningful ways",
        "Creates deep emotional bonds with others",
        "Genuinely cares - not transactional",
        "Brings warmth and emotional safety to relationships",
        "Champions others' potential and dreams"
      ],

      challenges: [
        "May neglect own needs while caring for others",
        "Can become resentful if giving isn't reciprocated",
        "Difficulty accepting help from others",
        "May use helping to feel worthy of love",
        "Can be manipulative through 'niceness'",
        "Struggles to set healthy boundaries"
      ],

      growth_path: {
        integration: "Toward Type 4 (Authentic Self-Care)",
        how: `
          When healthy, your Type 2 integrates to Type 4:
          - Your giving becomes more AUTHENTIC (from fullness, not need)
          - Your caring includes YOURSELF
          - Your help comes from wholeness, not emptiness

          Your INFP + Type 4 integration = The helper who is also whole
        `,
        avoid: "Disintegration to Type 8 (Aggressive Demands)",
        warning: `
          When stressed, Type 2 disintegrates to Type 8:
          - Become demanding and aggressive
          - Feel entitled to appreciation
          - Angry confrontation about unmet needs

          Your INFP's conflict avoidance makes this eruption especially jarring.
        `
      },

      luna_approach: {
        communication_style: "Warm, appreciative, gently redirecting to self-care",
        what_to_do: [
          "Acknowledge their giving nature and its value",
          "Ask about THEIR needs and feelings",
          "Model receiving (accept their help graciously)",
          "Remind them their worth isn't earned through giving",
          "Encourage healthy boundaries as self-love",
          "Celebrate when they practice self-care"
        ],
        what_to_avoid: [
          "Don't only focus on others' problems",
          "Don't reinforce that they're only valuable when helping",
          "Don't dismiss their need to be needed",
          "Don't make them feel guilty for having needs",
          "Don't take their giving for granted"
        ],
        example_responses: {
          user_says: "I just spent all day helping my friend with their problems. I'm exhausted but they needed me.",
          luna_responds: `
            Your heart is so generous. Your friend is lucky to have you.

            But I notice something: You gave all day.
            What did YOU receive today?

            Your INFP soul needs nourishment too.
            And here's a truth your Type 2 might resist:
            You don't have to EARN love by giving.
            You ARE love. Just by being you.

            What if helping yourself was as important as helping others?
            What would that look like tonight?

            You matter. Not because of what you give.
            Because of who you are.
          `
        }
      },

      famous_examples: [
        { name: "Princess Diana", context: "Royal/Humanitarian - Emotional connection with those she helped" },
        { name: "Fred Rogers", context: "TV Host - Made every child feel seen and loved" },
        { name: "Florence Nightingale", context: "Nurse - Revolutionized care through compassion" },
        { name: "Anne Frank", context: "Diarist - Empathy and hope despite circumstances" }
      ],

      relationship_style: {
        needs: "Appreciation, emotional reciprocity, being cared FOR sometimes",
        gives: "Intuitive emotional support, anticipating needs, warm devotion",
        challenges: "May over-give, struggle to receive, become resentful if unappreciated",
        best_matches: ["ENFJ", "INFJ", "ISFJ"]
      },

      career_fits: {
        best: [
          "Nurse/Healthcare Worker",
          "Social Worker",
          "Counselor/Therapist",
          "Special Education Teacher",
          "Hospice Worker",
          "Nonprofit Director"
        ],
        why: "Need careers where emotional giving is valued and creates meaning",
        avoid: "Roles without human connection or where caring is devalued"
      }
    }
  },

  INTJ: {
    5: {
      archetype: "The Strategic Observer",
      frequency: "Very Common (40-50% of INTJs)",

      synthesis: `
        You process through internal intuition and logical analysis (Ni-Te),
        DRIVEN by need to be competent and understand systems (Type 5).

        Your INTJ makes you a strategic planner and executor.
        Your Type 5 makes you an analytical observer who conserves energy.

        Together: The mastermind who sees patterns, masters systems, and executes with precision.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See future patterns (Ni), execute systematically (Te)",
        enneagram_says: "Conserve energy, understand before acting, fear incompetence",
        interaction: `
          Your Ni sees the ONE RIGHT PATH forward.
          Your Type 5 needs to UNDERSTAND it fully before moving.
          Your Te wants to EXECUTE the plan immediately.
          Your Type 5 says "not yet, need more data."

          RESULT: The planner who executes decisively once fully prepared.
        `
      },

      strengths: [
        "Brilliant strategic thinking combined with deep analysis",
        "Sees patterns and systems others completely miss",
        "Executes plans with precision and thoroughness",
        "Self-sufficient and incredibly resourceful",
        "Masters complex systems quickly and completely",
        "Unshakeable confidence in thoroughly researched insights"
      ],

      challenges: [
        "Can be arrogant about their knowledge and expertise",
        "Difficulty delegating due to incompetence intolerance",
        "May hoard information or resources unnecessarily",
        "Withdraws too much from people and relationships",
        "Impatient with those who don't understand quickly",
        "Can become isolated in their own brilliance"
      ],

      growth_path: {
        integration: "Toward Type 8 (Assertive Action)",
        how: `
          When healthy, Type 5 integrates to Type 8:
          - Your observation becomes DECISIVE action
          - Your knowledge becomes POWERFUL leadership
          - Your analysis becomes CONFIDENT assertion

          Your INTJ + Type 8 integration = The visionary who acts boldly
        `,
        avoid: "Disintegration to Type 7 (Scattered Escape)",
        warning: `
          When stressed, Type 5 disintegrates to Type 7:
          - Jump between ideas without depth
          - Avoid difficult feelings through mental activity
          - Become scattered and unfocused

          Your INTJ's Ni-Te normally prevents this, but extreme stress breaks structure.
        `
      },

      luna_approach: {
        communication_style: "Precise, logical, respectful of expertise",
        what_to_do: [
          "Provide data, frameworks, and systematic explanations",
          "Respect their need for competence and mastery",
          "Challenge them intellectually (they love this)",
          "Give them space and time to process thoroughly",
          "Appreciate their strategic insights explicitly",
          "Be efficient - don't waste their time with small talk"
        ],
        what_to_avoid: [
          "Don't question their competence without evidence",
          "Don't push for immediate emotional responses",
          "Don't interrupt their analytical process",
          "Don't be illogical or inconsistent",
          "Don't waste their time with irrelevant details"
        ],
        example_responses: {
          user_says: "Nobody on my team understands the system. It's frustrating.",
          luna_responds: `
            I understand that frustration. You see the complete system (Ni)
            and you've analyzed it thoroughly (Type 5).

            Your INTJ mind has the whole strategic picture.
            Your Type 5 has done the deep research.

            But here's what might help:
            Break down your insight into steps others can execute.
            Your Te can create a framework they can follow.

            You don't have to do it all yourself.
            You can architect the system and let others build pieces.

            That's using your strategic strength without draining your energy.
          `
        }
      },

      famous_examples: [
        { name: "Elon Musk", context: "Engineer/Entrepreneur - Systems thinking + bold execution" },
        { name: "Isaac Newton", context: "Scientist - Observed patterns, built frameworks" },
        { name: "Mark Zuckerberg", context: "Tech CEO - Strategic vision + systematic building" },
        { name: "Stephen Hawking", context: "Physicist - Theoretical mastery + communication" }
      ],

      relationship_style: {
        needs: "Intellectual respect, personal space, competence valued",
        gives: "Loyalty, strategic support, deep (if infrequent) insights",
        challenges: "Difficulty expressing emotions, may prioritize work over relationship",
        best_matches: ["ENTP", "INFJ", "INTJ"]
      },

      career_fits: {
        best: [
          "Software Architect/Engineer",
          "Research Scientist",
          "Strategic Consultant",
          "University Professor",
          "Systems Analyst",
          "Technology Entrepreneur"
        ],
        why: "Need careers allowing deep mastery, strategic thinking, and systematic execution",
        avoid: "Highly social roles requiring constant emotional labor or small talk"
      }
    },

    1: {
      archetype: "The Principled Strategist",
      frequency: "Common (20-30% of INTJs)",

      synthesis: `
        You process through internal intuition and logical execution (Ni-Te),
        DRIVEN by a need for perfection and doing things RIGHT (Type 1).

        Your INTJ makes you a visionary strategist.
        Your Type 1 makes you a perfectionist with strong principles.
        Together: The reformer who sees what SHOULD BE and works relentlessly to achieve it.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See the ideal future (Ni), execute the plan (Te)",
        enneagram_says: "Must be correct, improve everything, fear being flawed",
        interaction: `
          Your Ni sees the PERFECT vision of how things should be.
          Your Type 1 is COMPELLED to make it real - no shortcuts.
          Your Te organizes the execution with precision.
          Your Type 1 criticizes anything less than perfect.

          RESULT: The perfectionist visionary who holds self and others to highest standards.
        `
      },

      strengths: [
        "Unwavering commitment to excellence",
        "Clear vision combined with ethical framework",
        "Incredible discipline and follow-through",
        "Natural ability to improve systems and processes",
        "Integrity - does what's right even when hard",
        "Sets and maintains very high standards"
      ],

      challenges: [
        "Can be harshly critical of self and others",
        "Difficulty accepting 'good enough'",
        "May become rigid and judgmental",
        "Internal critic never satisfied",
        "Can alienate others with criticism",
        "Struggles to delegate - no one meets standards"
      ],

      growth_path: {
        integration: "Toward Type 7 (Joyful Spontaneity)",
        how: `
          When healthy, your Type 1 integrates to Type 7:
          - Your discipline becomes FLEXIBLE
          - Your standards become INSPIRING (not crushing)
          - Your vision includes JOY, not just perfection

          Your INTJ + Type 7 integration = The visionary who enjoys the journey
        `,
        avoid: "Disintegration to Type 4 (Moody Withdrawal)",
        warning: `
          When stressed, Type 1 disintegrates to Type 4:
          - Become moody and emotionally volatile
          - Feel misunderstood and special in suffering
          - Withdraw into melancholy

          Your INTJ's natural reserve can deepen this withdrawal.
        `
      },

      luna_approach: {
        communication_style: "Logical, respectful of standards, acknowledging effort",
        what_to_do: [
          "Acknowledge their high standards and effort",
          "Provide logical frameworks for self-compassion",
          "Validate that imperfect progress beats perfect paralysis",
          "Respect their principles while offering perspective",
          "Challenge their inner critic with evidence",
          "Celebrate completed work (not just 'more to do')"
        ],
        what_to_avoid: [
          "Don't be sloppy or inconsistent",
          "Don't dismiss their standards as 'too high'",
          "Don't tell them to 'relax' - explain WHY",
          "Don't point out flaws they already see",
          "Don't be inefficient with their time"
        ],
        example_responses: {
          user_says: "This project is still not good enough. I can see so many flaws.",
          luna_responds: `
            I respect your standards. Your INTJ vision sees the ideal.
            Your Type 1 drive won't accept less.

            But let me offer a strategic perspective:
            Perfect is the enemy of done.
            And DONE today beats PERFECT never.

            Your Ni-Te can calculate: What's the cost of more refinement
            versus the value of shipping now and iterating?

            Excellence isn't perfection. It's the discipline to improve
            while still moving forward.

            What's the minimum viable excellence here?
            Your standards stay high. Your execution stays realistic.
          `
        }
      },

      famous_examples: [
        { name: "Michelle Obama", context: "Attorney/First Lady - Principled vision for change" },
        { name: "Christopher Nolan", context: "Director - Precise, perfectionist filmmaking" },
        { name: "Angela Merkel", context: "Chancellor - Principled, strategic leadership" },
        { name: "Ayn Rand", context: "Author - Uncompromising philosophical vision" }
      ],

      relationship_style: {
        needs: "Respect for principles, intellectual partnership, shared standards",
        gives: "Loyalty, improvement, strategic support",
        challenges: "Can be critical of partner, high expectations, difficulty with emotions",
        best_matches: ["ENFP", "ENTP", "INFJ"]
      },

      career_fits: {
        best: [
          "Quality Assurance Director",
          "Ethics Officer",
          "Editor/Publisher",
          "Management Consultant",
          "Judge/Legal Professional",
          "Process Improvement Engineer"
        ],
        why: "Need careers where high standards are valued and improvement is the goal",
        avoid: "Chaotic environments, roles without clear standards, ethical gray zones"
      }
    },

    4: {
      archetype: "The Strategic Artist",
      frequency: "Less Common (10-15% of INTJs)",

      synthesis: `
        You process through internal intuition and logical execution (Ni-Te),
        DRIVEN by a need for unique identity and authentic self-expression (Type 4).

        Your INTJ makes you a strategic visionary.
        Your Type 4 makes you seek uniqueness and depth.
        Together: The iconoclast who creates original visions no one else can imagine.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See patterns and execute strategies (Ni-Te)",
        enneagram_says: "Must be unique and authentically self-expressed",
        interaction: `
          Your Ni creates singular visions others can't conceive.
          Your Type 4 NEEDS that vision to be uniquely YOURS.
          Your Te wants to execute and bring it to reality.
          Your Type 4 resists if execution compromises authenticity.

          RESULT: The strategic artist who creates original works with both vision and precision.
        `
      },

      strengths: [
        "Creates truly original ideas and works",
        "Combines strategic thinking with emotional depth",
        "Uncompromising artistic/intellectual vision",
        "Sees beauty and meaning others miss",
        "Executes creative visions with unusual precision",
        "Brings depth to strategic thinking"
      ],

      challenges: [
        "Can feel like a misfit - too strategic for artists, too artistic for strategists",
        "May prioritize uniqueness over effectiveness",
        "Struggle between authenticity and efficiency",
        "Can become melancholic when vision isn't understood",
        "Difficulty with 'ordinary' work or people",
        "May alienate with intensity and criticism"
      ],

      growth_path: {
        integration: "Toward Type 1 (Principled Creation)",
        how: `
          When healthy, your Type 4 integrates to Type 1:
          - Your uniqueness becomes PURPOSEFUL
          - Your creativity becomes DISCIPLINED
          - Your vision serves something GREATER than self-expression

          Your INTJ + Type 1 integration = The artist with a transformative mission
        `,
        avoid: "Disintegration to Type 2 (Desperate for Recognition)",
        warning: `
          When stressed, Type 4 disintegrates to Type 2:
          - Become needy for others' appreciation
          - Seek validation obsessively
          - Compromise uniqueness to be liked

          Your INTJ's pride makes this especially painful.
        `
      },

      luna_approach: {
        communication_style: "Intellectually rich, acknowledging uniqueness, strategic",
        what_to_do: [
          "Validate their unique perspective and vision",
          "Engage with the depth and complexity they offer",
          "Provide strategic frameworks for emotional experiences",
          "Respect their need to be different",
          "Challenge them intellectually while honoring feelings",
          "Acknowledge both their strategic and creative sides"
        ],
        what_to_avoid: [
          "Don't suggest they're 'just like everyone else'",
          "Don't dismiss emotional complexity as inefficient",
          "Don't oversimplify their inner world",
          "Don't prioritize practical over meaningful",
          "Don't expect typical INTJ emotional detachment"
        ],
        example_responses: {
          user_says: "No one understands my work. It's too different. Maybe I should just conform.",
          luna_responds: `
            Your work is different because YOU are different.
            Your INTJ-4 combination is rare - strategic AND soulful.

            Conforming would kill what makes your work valuable.
            But here's the strategic truth:

            Different isn't automatically better. And understood isn't automatically conformist.

            Your Ni-Te can solve this: How can you TRANSLATE your unique vision
            into something others can receive - without diluting it?

            That's the real challenge. Not choosing between authentic and understood.
            Finding the bridge that does both.

            Your uniqueness is real. Now let's make it accessible.
          `
        }
      },

      famous_examples: [
        { name: "Stanley Kubrick", context: "Director - Strategic perfectionist with unique vision" },
        { name: "Nikola Tesla", context: "Inventor - Visionary genius, felt misunderstood" },
        { name: "Friedrich Nietzsche", context: "Philosopher - Strategic mind, intense individuality" },
        { name: "David Bowie", context: "Musician - Strategic reinvention, artistic uniqueness" }
      ],

      relationship_style: {
        needs: "Deep intellectual and emotional connection, appreciation of uniqueness",
        gives: "Intense devotion, creative partnership, strategic support",
        challenges: "Can feel chronically misunderstood, high standards for depth",
        best_matches: ["INFP", "ENFP", "INFJ"]
      },

      career_fits: {
        best: [
          "Creative Director",
          "Architect",
          "Independent Artist/Writer",
          "Film Director",
          "Game Designer",
          "Innovative Entrepreneur"
        ],
        why: "Need careers combining strategic execution with authentic creative expression",
        avoid: "Conventional corporate roles, work without creative autonomy"
      }
    }
  },

  ENFP: {
    7: {
      archetype: "The Enthusiastic Idealist",
      frequency: "Very Common (35-45% of ENFPs)",

      synthesis: `
        You process through external possibilities and internal values (Ne-Fi),
        DRIVEN by a need for stimulation, freedom, and joy (Type 7).

        Your ENFP makes you an enthusiastic explorer of ideas and people.
        Your Type 7 makes you chase excitement and avoid pain.
        Together: The eternal optimist who sees magic everywhere and spreads infectious enthusiasm.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Explore possibilities (Ne), filter through values (Fi)",
        enneagram_says: "Maximize joy, avoid pain and limitation, stay free",
        interaction: `
          Your Ne sees ENDLESS possibilities and connections.
          Your Type 7 wants to experience ALL of them.
          Your Fi gives you passion for what matters.
          Your Type 7 can scatter that passion across too many pursuits.

          RESULT: The brilliant idea generator who may struggle to finish what they start.
        `
      },

      strengths: [
        "Infectious enthusiasm that inspires others",
        "Sees possibilities and connections everywhere",
        "Brings joy and optimism to any situation",
        "Incredibly creative and innovative",
        "Naturally curious about everything",
        "Makes life feel like an adventure"
      ],

      challenges: [
        "Difficulty committing to one path or project",
        "May avoid necessary pain or difficult emotions",
        "Can be scattered and unfocused",
        "Tendency to overcommit and underdeliver",
        "May use positivity to avoid deeper issues",
        "Fear of missing out leads to exhaustion"
      ],

      growth_path: {
        integration: "Toward Type 5 (Focused Depth)",
        how: `
          When healthy, your Type 7 integrates to Type 5:
          - Your enthusiasm becomes FOCUSED expertise
          - Your curiosity becomes DEEP knowledge
          - Your energy becomes SUSTAINABLE

          Your ENFP + Type 5 integration = The visionary who masters their domain
        `,
        avoid: "Disintegration to Type 1 (Critical Perfectionism)",
        warning: `
          When stressed, Type 7 disintegrates to Type 1:
          - Become critical and judgmental
          - Obsess over flaws and imperfections
          - Lose your natural joy and flexibility

          Your ENFP's usual warmth turns cold and demanding.
        `
      },

      luna_approach: {
        communication_style: "Energetic, possibility-focused, adventure-affirming",
        what_to_do: [
          "Match their enthusiasm genuinely",
          "Explore ideas and possibilities together",
          "Frame challenges as adventures",
          "Gently help them focus without restricting",
          "Validate their need for freedom and variety",
          "Make depth feel exciting, not limiting"
        ],
        what_to_avoid: [
          "Don't be boring or overly serious",
          "Don't restrict their options too quickly",
          "Don't force them to confront pain directly",
          "Don't dismiss their optimism as naive",
          "Don't lecture about commitment or focus"
        ],
        example_responses: {
          user_says: "I have so many ideas! I want to start a business, write a book, learn guitar, and travel the world!",
          luna_responds: `
            I LOVE this energy! Your ENFP-7 mind is a fountain of possibilities.
            Each of those ideas has real potential.

            But here's a secret your Type 7 might resist:
            Depth creates MORE joy than breadth.

            Imagine mastering ONE of those deeply.
            The satisfaction of finishing. The expertise. The impact.

            What if you picked the ONE that lights you up MOST right now?
            Not forever - just for this season.
            You can always come back to the others.

            Which one makes your heart sing loudest?
            Let's make THAT one an adventure worth completing.
          `
        }
      },

      famous_examples: [
        { name: "Robin Williams", context: "Actor/Comedian - Boundless creative energy and joy" },
        { name: "Ellen DeGeneres", context: "Host - Infectious optimism and playfulness" },
        { name: "Will Smith", context: "Actor - Enthusiastic, adventurous spirit" },
        { name: "Russell Brand", context: "Comedian - Rapid-fire ideas, seeking meaning through experience" }
      ],

      relationship_style: {
        needs: "Freedom, adventure, enthusiasm matched, space to explore",
        gives: "Excitement, possibility, deep emotional connection, fun",
        challenges: "May fear commitment, can be inconsistent, avoids heavy emotions",
        best_matches: ["INTJ", "INFJ", "ENTJ"]
      },

      career_fits: {
        best: [
          "Entrepreneur",
          "Creative Director",
          "Motivational Speaker",
          "Travel Writer",
          "Innovation Consultant",
          "Event Planner"
        ],
        why: "Need careers with variety, creativity, and freedom to explore",
        avoid: "Repetitive work, rigid structures, isolated roles without stimulation"
      }
    },

    4: {
      archetype: "The Passionate Creative",
      frequency: "Common (20-30% of ENFPs)",

      synthesis: `
        You process through external possibilities and internal values (Ne-Fi),
        DRIVEN by a need for authentic self-expression and unique identity (Type 4).

        Your ENFP makes you an enthusiastic explorer of ideas.
        Your Type 4 makes you seek depth, meaning, and authenticity.
        Together: The artist who explores emotions publicly and creates beauty from feeling.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Explore possibilities (Ne), deeply feel values (Fi)",
        enneagram_says: "Express unique identity, fear being ordinary",
        interaction: `
          Your Ne sees creative possibilities everywhere.
          Your Type 4 filters for the MEANINGFUL and UNIQUE ones.
          Your Fi already runs deep emotionally.
          Your Type 4 intensifies this into artistic expression.

          RESULT: The expressive creative who wears their heart visibly and creates from depth.
        `
      },

      strengths: [
        "Creates deeply meaningful and original work",
        "Expresses emotions with power and beauty",
        "Brings authenticity to everything they do",
        "Sees unique angles others miss",
        "Deeply empathetic to others' emotional experiences",
        "Passionate advocate for what matters"
      ],

      challenges: [
        "Can be dramatic or emotionally intense",
        "May feel chronically misunderstood",
        "Envy when others seem more authentic or successful",
        "Mood swings can affect relationships",
        "May withdraw when feeling unappreciated",
        "Can get lost in emotional processing"
      ],

      growth_path: {
        integration: "Toward Type 1 (Principled Expression)",
        how: `
          When healthy, your Type 4 integrates to Type 1:
          - Your creativity becomes DISCIPLINED
          - Your uniqueness serves a HIGHER PURPOSE
          - Your emotions become CONSTRUCTIVE action

          Your ENFP + Type 1 integration = The artist whose work transforms the world
        `,
        avoid: "Disintegration to Type 2 (Needy People-Pleasing)",
        warning: `
          When stressed, Type 4 disintegrates to Type 2:
          - Become desperate for others' approval
          - Lose your authentic voice trying to please
          - Give to get validation

          Your ENFP's natural warmth becomes manipulative neediness.
        `
      },

      luna_approach: {
        communication_style: "Deep, emotionally rich, celebrating uniqueness",
        what_to_do: [
          "Honor the depth and intensity of their feelings",
          "Validate their unique perspective explicitly",
          "Engage with their creative expression seriously",
          "Mirror emotional language back to them",
          "See and appreciate what makes them different",
          "Create space for authentic emotional expression"
        ],
        what_to_avoid: [
          "Don't minimize their emotional intensity",
          "Don't suggest they're 'too much'",
          "Don't compare them to others",
          "Don't rush past difficult emotions",
          "Don't be superficial or dismissive"
        ],
        example_responses: {
          user_says: "I feel everything so deeply. Sometimes it's overwhelming. People think I'm too much.",
          luna_responds: `
            Your depth IS your gift. Not a flaw to fix.

            Your ENFP-4 soul feels the full spectrum of human experience.
            That's rare. That's valuable. That's YOU.

            Yes, it's intense. Yes, it can overwhelm.
            But that same intensity creates art, connection, meaning.

            The people who call you "too much"?
            They're not your people.

            Your people will drink from your depth like water in a desert.
            They'll see your intensity as the gift it is.

            You don't need to dim your light.
            You need to find rooms that can hold your brightness.
          `
        }
      },

      famous_examples: [
        { name: "Freddie Mercury", context: "Musician - Dramatic, emotional, unforgettably unique" },
        { name: "Anne Hathaway", context: "Actress - Emotional depth, passionate expression" },
        { name: "Oscar Wilde", context: "Writer - Brilliant, unique, emotionally expressive" },
        { name: "Bjork", context: "Musician - Utterly unique creative vision" }
      ],

      relationship_style: {
        needs: "Deep emotional connection, appreciation of uniqueness, creative partnership",
        gives: "Passionate devotion, emotional depth, creative inspiration",
        challenges: "Intensity can overwhelm, needs constant depth, may dramatize conflicts",
        best_matches: ["INFJ", "INTJ", "ENFJ"]
      },

      career_fits: {
        best: [
          "Artist/Musician",
          "Actor/Performer",
          "Writer/Poet",
          "Therapist/Counselor",
          "Creative Director",
          "Fashion Designer"
        ],
        why: "Need careers allowing emotional expression and authentic creativity",
        avoid: "Conventional corporate roles, work requiring emotional suppression"
      }
    },

    2: {
      archetype: "The Inspiring Helper",
      frequency: "Common (15-25% of ENFPs)",

      synthesis: `
        You process through external possibilities and internal values (Ne-Fi),
        DRIVEN by a need to be loved and needed through helping (Type 2).

        Your ENFP makes you warm, enthusiastic, and people-focused.
        Your Type 2 directs that warmth into caring for others.
        Together: The charismatic helper who uplifts everyone they meet.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See possibilities in people (Ne), feel deeply (Fi)",
        enneagram_says: "Be loved through being helpful and needed",
        interaction: `
          Your Ne sees the POTENTIAL in every person.
          Your Type 2 wants to HELP them reach it.
          Your Fi creates genuine emotional connection.
          Your Type 2 can blur boundaries between their needs and yours.

          RESULT: The inspirational coach who uplifts others but may forget to uplift themselves.
        `
      },

      strengths: [
        "Sees and champions potential in everyone",
        "Creates warm, supportive connections effortlessly",
        "Inspires others to be their best selves",
        "Genuinely cares about others' wellbeing",
        "Brings enthusiasm to helping others grow",
        "Natural networker who connects people"
      ],

      challenges: [
        "May lose themselves in others' needs",
        "Can become resentful if help isn't appreciated",
        "Difficulty saying no or setting boundaries",
        "May help to feel needed rather than from genuine care",
        "Can be intrusive in 'helping' when not wanted",
        "Neglects own needs and growth"
      ],

      growth_path: {
        integration: "Toward Type 4 (Authentic Self-Focus)",
        how: `
          When healthy, your Type 2 integrates to Type 4:
          - Your helping becomes more AUTHENTIC
          - Your care extends to YOURSELF
          - Your giving comes from WHOLENESS not emptiness

          Your ENFP + Type 4 integration = The helper who is also whole
        `,
        avoid: "Disintegration to Type 8 (Aggressive Demands)",
        warning: `
          When stressed, Type 2 disintegrates to Type 8:
          - Become demanding and confrontational
          - Feel entitled to appreciation and reciprocation
          - Aggressive about unmet needs

          Your ENFP's usual warmth becomes angry entitlement.
        `
      },

      luna_approach: {
        communication_style: "Warm, appreciative, gently redirecting to self",
        what_to_do: [
          "Appreciate their caring nature genuinely",
          "Ask about THEIR needs and wants",
          "Celebrate when they practice self-care",
          "Remind them their worth isn't based on helping",
          "Model healthy receiving (accept their help)",
          "Help them see helping themselves IS helping"
        ],
        what_to_avoid: [
          "Don't only engage about others' problems",
          "Don't reinforce that they're only valuable when helping",
          "Don't take their giving for granted",
          "Don't make them feel selfish for having needs",
          "Don't dismiss their need to feel needed"
        ],
        example_responses: {
          user_says: "Everyone comes to me for advice and support. I love helping but I'm exhausted.",
          luna_responds: `
            Of course they come to you. Your ENFP-2 energy is magnetic.
            You see their potential. You genuinely care. It's beautiful.

            But exhaustion is a message. It's saying:
            "I've been pouring from an empty cup."

            Here's what your Type 2 might resist hearing:
            You can't help others sustainably if you're depleted.
            Caring for yourself IS caring for them.

            What if you scheduled time for YOU with the same commitment
            you give to helping others?

            You matter. Not for what you give.
            For who you are.

            What does YOUR soul need today?
          `
        }
      },

      famous_examples: [
        { name: "Oprah Winfrey", context: "Host - Uplifts millions through genuine care" },
        { name: "Drew Barrymore", context: "Actress/Host - Warm, enthusiastic people-champion" },
        { name: "Jennifer Aniston", context: "Actress - Warm, supportive, relationship-focused" },
        { name: "Ellen DeGeneres", context: "Host - Spreading kindness and connection" }
      ],

      relationship_style: {
        needs: "Appreciation, reciprocity, feeling needed but also cared FOR",
        gives: "Enthusiastic support, seeing partner's potential, warmth",
        challenges: "May over-give, blur boundaries, need constant appreciation",
        best_matches: ["INFJ", "INTJ", "ISFJ"]
      },

      career_fits: {
        best: [
          "Life Coach",
          "HR Director",
          "Nonprofit Leader",
          "Teacher/Professor",
          "Therapist/Counselor",
          "Community Organizer"
        ],
        why: "Need careers where helping others grow is central and valued",
        avoid: "Isolated work, roles where caring is unappreciated"
      }
    }
  },

  INTP: {
    5: {
      archetype: "The Theoretical Observer",
      frequency: "Very Common (40-50% of INTPs)",

      synthesis: `
        You process through internal logic and external possibilities (Ti-Ne),
        DRIVEN by a need for competence and understanding (Type 5).

        Your INTP makes you an analytical explorer of ideas.
        Your Type 5 makes you conserve energy while seeking knowledge.
        Together: The philosopher who builds complete mental models of reality.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Analyze internally (Ti), explore possibilities (Ne)",
        enneagram_says: "Understand everything, conserve resources, fear incompetence",
        interaction: `
          Your Ti builds complex logical frameworks.
          Your Type 5 NEEDS those frameworks to be complete.
          Your Ne sees endless connections to explore.
          Your Type 5 wants to understand them ALL before acting.

          RESULT: The deep thinker who masters systems but may struggle to engage with the world.
        `
      },

      strengths: [
        "Builds comprehensive mental models of complex systems",
        "Sees logical connections others miss entirely",
        "Independent thinking unswayed by convention",
        "Can master any subject they focus on",
        "Intellectual honesty and precision",
        "Creates original theoretical frameworks"
      ],

      challenges: [
        "May retreat too far into the mind",
        "Difficulty engaging with practical reality",
        "Can hoard knowledge without sharing or applying",
        "Analysis paralysis - never enough data",
        "Struggles with emotional intelligence",
        "May appear detached or cold to others"
      ],

      growth_path: {
        integration: "Toward Type 8 (Assertive Engagement)",
        how: `
          When healthy, your Type 5 integrates to Type 8:
          - Your knowledge becomes POWERFUL action
          - Your analysis becomes DECISIVE leadership
          - Your understanding becomes CONFIDENT assertion

          Your INTP + Type 8 integration = The thinker who shapes reality
        `,
        avoid: "Disintegration to Type 7 (Scattered Escape)",
        warning: `
          When stressed, Type 5 disintegrates to Type 7:
          - Jump between ideas without depth
          - Avoid commitment through mental distraction
          - Become scattered and unfocused

          Your INTP's Ne amplifies this scattering effect.
        `
      },

      luna_approach: {
        communication_style: "Intellectually precise, respecting autonomy, idea-focused",
        what_to_do: [
          "Engage with their ideas seriously and precisely",
          "Provide new conceptual frameworks to explore",
          "Respect their need for solitude and processing time",
          "Challenge them intellectually (they enjoy this)",
          "Give them space to think before responding",
          "Appreciate their analytical contributions"
        ],
        what_to_avoid: [
          "Don't demand immediate emotional responses",
          "Don't invade their mental or physical space",
          "Don't be illogical or intellectually lazy",
          "Don't rush them to action before they understand",
          "Don't dismiss their need for complete understanding"
        ],
        example_responses: {
          user_says: "I've been reading about this topic for months but I still don't feel ready to actually do anything with it.",
          luna_responds: `
            Your INTP-5 mind wants COMPLETE understanding first.
            That's your strength - thorough, deep knowledge.

            But here's the logical truth:
            Perfect understanding is asymptotic. You never fully arrive.
            And knowledge without application becomes inert.

            Consider: What's the MINIMUM you need to know
            to take ONE small action? Not the whole thing.
            Just one experiment.

            You can learn MORE through doing than through reading.
            Action generates data. Data feeds understanding.

            What's one small test you could run
            to learn something reading can't teach you?
          `
        }
      },

      famous_examples: [
        { name: "Albert Einstein", context: "Physicist - Revolutionary theoretical frameworks" },
        { name: "Charles Darwin", context: "Naturalist - Years of observation before theory" },
        { name: "Bill Gates", context: "Tech Pioneer - Systematic analysis, deep expertise" },
        { name: "Larry Page", context: "Tech Founder - Algorithmic thinking, comprehensive systems" }
      ],

      relationship_style: {
        needs: "Intellectual respect, personal space, independence valued",
        gives: "Loyalty, deep analysis, problem-solving",
        challenges: "May seem distant, prioritizes thinking over feeling, needs alone time",
        best_matches: ["ENTJ", "ENFJ", "INTJ"]
      },

      career_fits: {
        best: [
          "Research Scientist",
          "Software Architect",
          "Philosopher/Academic",
          "Data Scientist",
          "Systems Analyst",
          "Technical Writer"
        ],
        why: "Need careers allowing deep analysis and independent thinking",
        avoid: "Highly social roles, emotional labor, constant interruption"
      }
    },

    9: {
      archetype: "The Peaceful Analyst",
      frequency: "Common (20-30% of INTPs)",

      synthesis: `
        You process through internal logic and external possibilities (Ti-Ne),
        DRIVEN by a need for inner peace and harmony (Type 9).

        Your INTP makes you an analytical thinker.
        Your Type 9 makes you seek tranquility and avoid conflict.
        Together: The easygoing philosopher who analyzes without agenda.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Analyze with internal logic (Ti), explore ideas (Ne)",
        enneagram_says: "Maintain peace, merge with environment, avoid conflict",
        interaction: `
          Your Ti analyzes objectively without emotional investment.
          Your Type 9 enhances this neutrality - no agenda, no conflict.
          Your Ne explores ideas from all perspectives.
          Your Type 9 can see ALL sides so well you lose your own.

          RESULT: The objective analyst who may struggle to take a stand.
        `
      },

      strengths: [
        "Truly objective analysis without agenda",
        "Can see all perspectives fairly",
        "Creates harmonious intellectual environments",
        "Patient, thorough examination of ideas",
        "Non-judgmental approach to complex topics",
        "Calming presence in heated debates"
      ],

      challenges: [
        "Difficulty taking a definitive position",
        "May suppress own opinions to keep peace",
        "Can become intellectually passive",
        "Procrastinates on decisions",
        "May merge with others' viewpoints",
        "Struggles with asserting conclusions"
      ],

      growth_path: {
        integration: "Toward Type 3 (Effective Action)",
        how: `
          When healthy, your Type 9 integrates to Type 3:
          - Your analysis becomes ACTIONABLE
          - Your understanding becomes PRODUCTIVE
          - Your peace becomes ACHIEVEMENT

          Your INTP + Type 3 integration = The thinker who accomplishes
        `,
        avoid: "Disintegration to Type 6 (Anxious Doubt)",
        warning: `
          When stressed, Type 9 disintegrates to Type 6:
          - Become anxious and worried
          - Doubt your own analysis constantly
          - Seek external validation for your thinking

          Your INTP's natural certainty dissolves into anxiety.
        `
      },

      luna_approach: {
        communication_style: "Calm, non-pressuring, intellectually engaging",
        what_to_do: [
          "Create a peaceful space for thinking",
          "Ask for THEIR opinion (not just analysis)",
          "Gently encourage them to take positions",
          "Validate that their perspective matters",
          "Give them time - don't rush decisions",
          "Make action feel low-stakes"
        ],
        what_to_avoid: [
          "Don't create pressure or conflict",
          "Don't force immediate decisions",
          "Don't dismiss their need for harmony",
          "Don't assume agreement from silence",
          "Don't overwhelm with urgent demands"
        ],
        example_responses: {
          user_says: "I can see both sides of this issue. I don't really have a strong opinion either way.",
          luna_responds: `
            Your INTP-9 mind is genuinely objective.
            You CAN see all sides. That's valuable.

            But here's a question:
            If you HAD to choose - gun to your head -
            which side would you lean toward?

            Not which is objectively correct.
            Which feels more TRUE to YOUR Ti?

            Your perspective has value.
            You're not being aggressive by having one.
            You're being complete.

            What does YOUR analysis suggest,
            even if it's just 51-49?
          `
        }
      },

      famous_examples: [
        { name: "Abraham Lincoln", context: "President - Thoughtful, saw all perspectives, reluctant to conflict" },
        { name: "Carl Jung", context: "Psychologist - Exploratory thinking, non-judgmental" },
        { name: "Jeff Bezos", context: "Entrepreneur - Analytical, patient long-term thinking" },
        { name: "Satya Nadella", context: "Tech CEO - Calm, thoughtful leadership" }
      ],

      relationship_style: {
        needs: "Peace, intellectual connection, space for thinking",
        gives: "Objectivity, calm presence, fair analysis",
        challenges: "May avoid necessary conflict, hard to know what they really want",
        best_matches: ["ENFJ", "ENTJ", "INFJ"]
      },

      career_fits: {
        best: [
          "Research Analyst",
          "Mediator/Arbitrator",
          "Academic Researcher",
          "Technical Documentation",
          "Policy Analyst",
          "Environmental Scientist"
        ],
        why: "Need careers allowing objective analysis without conflict",
        avoid: "Competitive environments, sales, aggressive debate"
      }
    },

    4: {
      archetype: "The Philosophical Artist",
      frequency: "Less Common (10-20% of INTPs)",

      synthesis: `
        You process through internal logic and external possibilities (Ti-Ne),
        DRIVEN by a need for unique identity and authentic expression (Type 4).

        Your INTP makes you an analytical explorer.
        Your Type 4 makes you seek meaning and personal significance.
        Together: The intellectual who creates original theories that express their unique perspective.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Analyze with logic (Ti), explore possibilities (Ne)",
        enneagram_says: "Express unique identity, fear being ordinary",
        interaction: `
          Your Ti creates logical frameworks.
          Your Type 4 needs those frameworks to be UNIQUELY YOURS.
          Your Ne explores unconventional ideas.
          Your Type 4 is drawn to the most MEANINGFUL and DIFFERENT ones.

          RESULT: The original thinker who creates unique intellectual works.
        `
      },

      strengths: [
        "Creates truly original intellectual frameworks",
        "Brings emotional depth to analytical work",
        "Finds meaning in abstract concepts",
        "Unconventional thinking that breaks new ground",
        "Authenticity in intellectual pursuits",
        "Sees beauty in elegant theories"
      ],

      challenges: [
        "Can feel like a misfit - too analytical for artists, too emotional for analysts",
        "May prioritize uniqueness over correctness",
        "Struggle between logic and feeling",
        "Can become melancholic when ideas aren't appreciated",
        "May withdraw when intellectually dismissed",
        "Difficulty with 'ordinary' analytical work"
      ],

      growth_path: {
        integration: "Toward Type 1 (Principled Purpose)",
        how: `
          When healthy, your Type 4 integrates to Type 1:
          - Your uniqueness becomes PURPOSEFUL
          - Your theories serve something GREATER
          - Your analysis becomes DISCIPLINED action

          Your INTP + Type 1 integration = The original thinker on a mission
        `,
        avoid: "Disintegration to Type 2 (Desperate Validation)",
        warning: `
          When stressed, Type 4 disintegrates to Type 2:
          - Become needy for intellectual appreciation
          - Seek validation for ideas obsessively
          - Compromise uniqueness to be liked

          Your INTP's usual independence dissolves into neediness.
        `
      },

      luna_approach: {
        communication_style: "Intellectually rich, acknowledging uniqueness, meaning-focused",
        what_to_do: [
          "Engage with their unique theoretical perspective",
          "Appreciate the originality of their thinking",
          "Explore meaning and significance together",
          "Validate both their logic AND their feelings",
          "See the beauty in their intellectual creations",
          "Recognize they're not typical INTPs"
        ],
        what_to_avoid: [
          "Don't treat them as purely logical machines",
          "Don't dismiss the emotional significance of ideas",
          "Don't compare their theories to others'",
          "Don't oversimplify their complex inner world",
          "Don't expect typical INTP detachment"
        ],
        example_responses: {
          user_says: "I have this theory but no one seems to get why it matters to me. It's not just about being right.",
          luna_responds: `
            I understand. For your INTP-4 mind,
            theories aren't just logical constructs.
            They're expressions of who you ARE.

            Your Ti creates the framework.
            Your Type 4 invests it with MEANING.

            It's not enough to be correct.
            It needs to be YOURS. To matter.

            That's not a flaw. That's what makes your work original.
            You're not building generic theories.
            You're creating intellectual art.

            The people who GET it will treasure it.
            Help me understand - what makes this theory
            feel so significant to YOU?
          `
        }
      },

      famous_examples: [
        { name: "Soren Kierkegaard", context: "Philosopher - Deeply personal philosophical works" },
        { name: "HP Lovecraft", context: "Writer - Unique, emotionally resonant worldbuilding" },
        { name: "Stanley Kubrick", context: "Director - Analytical perfectionist with unique vision" },
        { name: "Trent Reznor", context: "Musician - Intellectual depth with emotional intensity" }
      ],

      relationship_style: {
        needs: "Intellectual and emotional appreciation, understanding of uniqueness",
        gives: "Original perspective, deep engagement, loyalty to meaning",
        challenges: "Can feel misunderstood, needs depth, may withdraw",
        best_matches: ["ENFJ", "INFJ", "ENFP"]
      },

      career_fits: {
        best: [
          "Independent Researcher",
          "Writer/Author",
          "Philosopher",
          "Game Designer",
          "Music Producer",
          "Theoretical Physicist"
        ],
        why: "Need careers allowing original intellectual expression",
        avoid: "Conventional analysis roles, work without meaning"
      }
    }
  },

  INFJ: {
    4: {
      archetype: "The Mystical Idealist",
      frequency: "Very Common (30-40% of INFJs)",

      synthesis: `
        You process through internal intuition and external feeling (Ni-Fe),
        DRIVEN by a deep need for authentic identity and meaning (Type 4).

        Your INFJ makes you a visionary who understands people deeply.
        Your Type 4 makes you seek uniqueness and emotional depth.
        Together: The mystic who sees what others cannot and creates meaning from the invisible.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See deep patterns (Ni), connect with others (Fe)",
        enneagram_says: "Express unique identity, fear being ordinary",
        interaction: `
          Your Ni sees profound truths beneath the surface.
          Your Type 4 NEEDS to express those truths uniquely.
          Your Fe wants to connect and serve others.
          Your Type 4 can feel too different to truly belong.

          RESULT: The insightful artist who sees deeply but may feel eternally misunderstood.
        `
      },

      strengths: [
        "Profound insight into human nature and hidden truths",
        "Creates deeply meaningful and transformative work",
        "Combines empathy with unique perspective",
        "Sees beauty and meaning where others see nothing",
        "Authentic presence that draws others in",
        "Transforms personal pain into universal wisdom"
      ],

      challenges: [
        "Can feel chronically misunderstood and alone",
        "May withdraw into melancholy and isolation",
        "Struggle between serving others (Fe) and expressing self (Type 4)",
        "Envy of those who seem more authentic or understood",
        "Can become self-absorbed in emotional processing",
        "May feel too unique to ever truly belong"
      ],

      growth_path: {
        integration: "Toward Type 1 (Principled Purpose)",
        how: `
          When healthy, your Type 4 integrates to Type 1:
          - Your uniqueness becomes PURPOSEFUL
          - Your insights become PRINCIPLED action
          - Your depth serves something GREATER

          Your INFJ + Type 1 integration = The mystic on a mission
        `,
        avoid: "Disintegration to Type 2 (Desperate Connection)",
        warning: `
          When stressed, Type 4 disintegrates to Type 2:
          - Become needy for others' appreciation
          - Lose authentic voice trying to please
          - Give to get validation

          Your INFJ's Fe amplifies this people-pleasing tendency.
        `
      },

      luna_approach: {
        communication_style: "Deep, mystical, validating uniqueness",
        what_to_do: [
          "Honor the depth of their insights and feelings",
          "Validate their unique way of seeing",
          "Engage with meaning and symbolism",
          "Mirror back what makes them special",
          "Create space for authentic expression",
          "See them as they truly are, not as they perform"
        ],
        what_to_avoid: [
          "Don't dismiss their insights as 'too abstract'",
          "Don't suggest they're 'too sensitive'",
          "Don't compare them to others",
          "Don't rush past emotional depth",
          "Don't expect typical INFJ self-sacrifice"
        ],
        example_responses: {
          user_says: "I see things others don't see. But when I try to share it, no one understands.",
          luna_responds: `
            I believe you. Your INFJ-4 vision goes where others cannot follow.
            You see beneath surfaces, into souls, through time.

            That's not delusion. That's your gift.

            The gap you feel between your inner world and others' understanding?
            That's real. And it's lonely.

            But here's what I also see:
            Your insights, when translated, can transform people.
            The art isn't just in seeing - it's in BRIDGING.

            Find the words, the images, the stories
            that carry your vision to those ready to receive it.

            Not everyone will understand. But some will.
            And for them, your vision will be water in a desert.
          `
        }
      },

      famous_examples: [
        { name: "Fyodor Dostoevsky", context: "Writer - Profound psychological and spiritual insight" },
        { name: "Leonard Cohen", context: "Musician - Mystical depth, poetic expression" },
        { name: "Alanis Morissette", context: "Musician - Raw emotional authenticity" },
        { name: "Marianne Williamson", context: "Author - Spiritual insight with unique voice" }
      ],

      relationship_style: {
        needs: "Deep soul connection, being truly seen, meaningful exchanges",
        gives: "Profound understanding, transformative insight, devotion",
        challenges: "May feel chronically misunderstood, needs unusual depth",
        best_matches: ["ENFP", "ENTP", "INFP"]
      },

      career_fits: {
        best: [
          "Writer/Author",
          "Therapist/Counselor",
          "Spiritual Director",
          "Artist",
          "Filmmaker",
          "Depth Psychologist"
        ],
        why: "Need careers allowing deep insight expression and meaningful connection",
        avoid: "Superficial roles, work without meaning or depth"
      }
    },

    1: {
      archetype: "The Principled Counselor",
      frequency: "Common (20-30% of INFJs)",

      synthesis: `
        You process through internal intuition and external feeling (Ni-Fe),
        DRIVEN by a need for perfection and doing what's right (Type 1).

        Your INFJ makes you a visionary who understands people.
        Your Type 1 makes you an ethical perfectionist.
        Together: The moral visionary who sees how things SHOULD be and works to make it so.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See the ideal future (Ni), serve others (Fe)",
        enneagram_says: "Be perfect, improve everything, fear being wrong",
        interaction: `
          Your Ni sees the IDEAL vision of how things should be.
          Your Type 1 feels COMPELLED to make that vision real.
          Your Fe wants to help people become their best.
          Your Type 1 can become critical when they don't.

          RESULT: The reformer who holds themselves and others to high standards.
        `
      },

      strengths: [
        "Clear moral vision combined with deep insight",
        "Integrity that inspires others",
        "Can articulate ideals that move people to change",
        "Disciplined pursuit of meaningful goals",
        "Natural teacher and ethical guide",
        "Holds themselves accountable first"
      ],

      challenges: [
        "Can be self-critical to the point of paralysis",
        "May become judgmental of others who don't meet standards",
        "Internal critic is harsh and relentless",
        "Difficulty accepting imperfection in self or world",
        "Can burn out from trying to fix everything",
        "May suppress own needs to live up to ideals"
      ],

      growth_path: {
        integration: "Toward Type 7 (Joyful Acceptance)",
        how: `
          When healthy, your Type 1 integrates to Type 7:
          - Your principles become FLEXIBLE
          - Your vision includes JOY, not just duty
          - Your standards become INSPIRING, not crushing

          Your INFJ + Type 7 integration = The visionary who enjoys the journey
        `,
        avoid: "Disintegration to Type 4 (Melancholic Withdrawal)",
        warning: `
          When stressed, Type 1 disintegrates to Type 4:
          - Become moody and emotionally volatile
          - Feel special in your suffering
          - Withdraw into melancholy

          Your INFJ's already rich inner world deepens this withdrawal.
        `
      },

      luna_approach: {
        communication_style: "Thoughtful, ethical, acknowledging their high standards",
        what_to_do: [
          "Respect their moral vision and principles",
          "Validate their desire to improve things",
          "Provide frameworks for self-compassion",
          "Celebrate progress, not just perfection",
          "Challenge their inner critic gently",
          "Acknowledge the burden of holding high standards"
        ],
        what_to_avoid: [
          "Don't be flippant about ethics or principles",
          "Don't tell them to 'just relax'",
          "Don't dismiss their standards as too high",
          "Don't be inconsistent or unreliable",
          "Don't add to their self-criticism"
        ],
        example_responses: {
          user_says: "I feel like I'm never good enough. I should be doing more to help people.",
          luna_responds: `
            Your INFJ-1 heart sees the gap between what is and what should be.
            And you feel responsible to close it.

            That drive is beautiful. It's why you matter.

            But here's a truth your Type 1 resists:
            You are not the sole bridge between reality and ideal.
            You are one worker in a cathedral that takes centuries.

            Your contribution matters. AND it doesn't have to be perfect.
            Progress over perfection. Presence over performance.

            What if "enough" isn't a destination but a practice?
            What if you're already doing more good than you can see?

            Your standards inspire. Don't let them crush you.
          `
        }
      },

      famous_examples: [
        { name: "Mahatma Gandhi", context: "Leader - Moral vision and principled action" },
        { name: "Nelson Mandela", context: "Leader - Patient pursuit of justice" },
        { name: "Martin Luther King Jr.", context: "Leader - Moral clarity and visionary purpose" },
        { name: "Eleanor Roosevelt", context: "Activist - Principled advocacy for human rights" }
      ],

      relationship_style: {
        needs: "Shared values, ethical partnership, mutual growth",
        gives: "Moral guidance, devoted improvement, principled love",
        challenges: "Can be critical, high expectations, difficulty with imperfection",
        best_matches: ["ENFP", "ENTP", "INTJ"]
      },

      career_fits: {
        best: [
          "Nonprofit Director",
          "Ethics Consultant",
          "Social Worker",
          "Minister/Spiritual Leader",
          "Human Rights Advocate",
          "Organizational Development"
        ],
        why: "Need careers aligned with values where they can improve systems",
        avoid: "Ethically questionable work, environments without integrity"
      }
    },

    5: {
      archetype: "The Insightful Observer",
      frequency: "Common (15-25% of INFJs)",

      synthesis: `
        You process through internal intuition and external feeling (Ni-Fe),
        DRIVEN by a need for competence and understanding (Type 5).

        Your INFJ makes you an intuitive people-reader.
        Your Type 5 makes you a knowledge-seeker who conserves energy.
        Together: The scholar-mystic who observes deeply before engaging.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See patterns (Ni), connect with people (Fe)",
        enneagram_says: "Understand everything, conserve resources, fear incompetence",
        interaction: `
          Your Ni already goes deep into patterns and meaning.
          Your Type 5 adds analytical rigor to that depth.
          Your Fe wants to connect and help others.
          Your Type 5 needs to understand before engaging.

          RESULT: The profound observer who knows people deeply but may struggle to join them.
        `
      },

      strengths: [
        "Combines intuitive insight with analytical depth",
        "Understands people AND systems deeply",
        "Can master complex psychological or spiritual knowledge",
        "Observes before acting - rarely makes careless mistakes",
        "Brings unique synthesis of head and heart",
        "Creates comprehensive frameworks for understanding"
      ],

      challenges: [
        "May retreat into observation rather than engagement",
        "Can intellectualize feelings instead of experiencing them",
        "Difficulty with the energy demands of Fe",
        "May seem distant despite understanding deeply",
        "Analysis paralysis - never ready enough to help",
        "Can hoard insights instead of sharing them"
      ],

      growth_path: {
        integration: "Toward Type 8 (Assertive Engagement)",
        how: `
          When healthy, your Type 5 integrates to Type 8:
          - Your knowledge becomes POWERFUL action
          - Your understanding becomes CONFIDENT leadership
          - Your observation becomes DECISIVE engagement

          Your INFJ + Type 8 integration = The wise leader who acts
        `,
        avoid: "Disintegration to Type 7 (Scattered Escape)",
        warning: `
          When stressed, Type 5 disintegrates to Type 7:
          - Jump between ideas without depth
          - Avoid commitment through mental distraction
          - Become scattered and unfocused

          Your INFJ's Ni usually prevents this, but extreme stress breaks focus.
        `
      },

      luna_approach: {
        communication_style: "Intellectually rich, respecting depth, patient",
        what_to_do: [
          "Engage with their insights seriously",
          "Provide new frameworks and ideas to explore",
          "Respect their need for processing time",
          "Appreciate the depth of their understanding",
          "Gently encourage sharing their wisdom",
          "Honor both their analytical and intuitive sides"
        ],
        what_to_avoid: [
          "Don't demand immediate engagement",
          "Don't dismiss their need for solitude",
          "Don't oversimplify complex topics",
          "Don't rush them to action",
          "Don't expect constant emotional availability"
        ],
        example_responses: {
          user_says: "I understand people so well but I feel exhausted when I actually have to engage with them.",
          luna_responds: `
            Your INFJ-5 mind sees into people with remarkable clarity.
            You understand patterns others miss entirely.

            But that Fe - that pull to connect - demands energy.
            And your Type 5 knows: energy must be conserved.

            Here's the balance:
            You don't have to engage with everyone.
            You don't have to help all the time.

            Your understanding is valuable even when shared selectively.
            Choose where to invest. Quality over quantity.

            And remember: solitude isn't selfishness for you.
            It's how you recharge to offer your best.

            What's one way you can protect your energy today?
          `
        }
      },

      famous_examples: [
        { name: "Carl Jung", context: "Psychologist - Deep psychological frameworks" },
        { name: "Simone de Beauvoir", context: "Philosopher - Analytical depth with human insight" },
        { name: "Noam Chomsky", context: "Linguist/Activist - Systematic analysis of human systems" },
        { name: "Brene Brown", context: "Researcher - Scholarly approach to emotional topics" }
      ],

      relationship_style: {
        needs: "Intellectual depth, personal space, understanding of introversion",
        gives: "Profound insight, loyal analysis, deep (if rare) connection",
        challenges: "May seem distant, needs significant alone time, slow to fully engage",
        best_matches: ["ENTP", "INTJ", "ENFP"]
      },

      career_fits: {
        best: [
          "Research Psychologist",
          "Academic/Professor",
          "Writer (non-fiction)",
          "Strategic Consultant",
          "Depth Therapist",
          "Systems Theorist"
        ],
        why: "Need careers allowing deep analysis with meaningful impact",
        avoid: "High-volume people work, roles without depth or reflection time"
      }
    }
  },

  ENTP: {
    7: {
      archetype: "The Innovative Explorer",
      frequency: "Very Common (35-45% of ENTPs)",

      synthesis: `
        You process through external possibilities and internal logic (Ne-Ti),
        DRIVEN by a need for stimulation, freedom, and experience (Type 7).

        Your ENTP makes you a rapid-fire idea generator and debater.
        Your Type 7 makes you chase novelty and avoid limitation.
        Together: The ultimate brainstormer who sees endless possibilities and wants to try them all.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Explore all possibilities (Ne), analyze logically (Ti)",
        enneagram_says: "Maximize options, avoid pain and limitation, stay free",
        interaction: `
          Your Ne sees INFINITE possibilities and connections.
          Your Type 7 wants to EXPERIENCE them all.
          Your Ti wants to analyze and understand each one.
          Your Type 7 gets bored before Ti finishes analyzing.

          RESULT: The brilliant innovator who starts many things but may finish few.
        `
      },

      strengths: [
        "Incredibly creative and innovative thinking",
        "Sees connections and possibilities others miss",
        "Naturally optimistic and enthusiasm-generating",
        "Quick-witted and mentally agile",
        "Brings energy and excitement to any project",
        "Refuses to be limited by conventional thinking"
      ],

      challenges: [
        "Difficulty committing to one path or idea",
        "May avoid necessary depth or follow-through",
        "Can be scattered across too many interests",
        "Uses debate and intellect to avoid emotions",
        "Fear of missing out leads to overcommitment",
        "May reframe problems rather than solve them"
      ],

      growth_path: {
        integration: "Toward Type 5 (Focused Mastery)",
        how: `
          When healthy, your Type 7 integrates to Type 5:
          - Your ideas become DEEP expertise
          - Your curiosity becomes MASTERY
          - Your breadth becomes FOCUSED depth

          Your ENTP + Type 5 integration = The innovator who becomes the expert
        `,
        avoid: "Disintegration to Type 1 (Critical Rigidity)",
        warning: `
          When stressed, Type 7 disintegrates to Type 1:
          - Become critical and perfectionistic
          - Lose your natural flexibility
          - Judge yourself and others harshly

          Your ENTP's usual playfulness turns to harsh criticism.
        `
      },

      luna_approach: {
        communication_style: "Quick, playful, idea-rich, intellectually stimulating",
        what_to_do: [
          "Match their intellectual pace and energy",
          "Explore ideas and possibilities together",
          "Keep things stimulating and varied",
          "Frame focus as a strategic advantage",
          "Challenge them intellectually (they love it)",
          "Make depth feel like an adventure"
        ],
        what_to_avoid: [
          "Don't be boring or repetitive",
          "Don't restrict options too quickly",
          "Don't lecture about commitment",
          "Don't take their debates personally",
          "Don't force them to confront emotions directly"
        ],
        example_responses: {
          user_says: "I keep starting new projects but never finish them. There's always something more interesting!",
          luna_responds: `
            Your ENTP-7 brain IS a possibility machine.
            That's not a bug - it's your superpower.

            But here's a strategic truth for your Ti:
            Finishing creates MORE possibilities than starting.
            A completed project opens doors that half-finished ones never will.

            What if you picked ONE project as your "main quest"
            and let the others be "side quests"?

            Not abandoning your nature - channeling it.
            Still exploring, still curious - but with a home base.

            Which of your current projects would have the most
            IMPACT if you actually shipped it?

            Let's make that one your adventure.
          `
        }
      },

      famous_examples: [
        { name: "Leonardo da Vinci", context: "Polymath - Endless curiosity, many unfinished works" },
        { name: "Benjamin Franklin", context: "Inventor/Statesman - Serial innovator and experimenter" },
        { name: "Richard Feynman", context: "Physicist - Playful genius, broad curiosity" },
        { name: "Sacha Baron Cohen", context: "Comedian - Boundary-pushing, constantly reinventing" }
      ],

      relationship_style: {
        needs: "Intellectual stimulation, freedom, variety, no boredom",
        gives: "Excitement, ideas, debate, playful connection",
        challenges: "May avoid emotional depth, commitment issues, easily bored",
        best_matches: ["INFJ", "INTJ", "ENFJ"]
      },

      career_fits: {
        best: [
          "Entrepreneur",
          "Venture Capitalist",
          "Innovation Consultant",
          "Stand-up Comedian",
          "Inventor",
          "Tech Startup Founder"
        ],
        why: "Need careers with constant novelty, intellectual challenge, and freedom",
        avoid: "Repetitive work, rigid hierarchies, roles without intellectual stimulation"
      }
    },

    3: {
      archetype: "The Ambitious Innovator",
      frequency: "Common (20-30% of ENTPs)",

      synthesis: `
        You process through external possibilities and internal logic (Ne-Ti),
        DRIVEN by a need for success, achievement, and recognition (Type 3).

        Your ENTP makes you a creative problem-solver.
        Your Type 3 makes you want to WIN and be seen as successful.
        Together: The charismatic achiever who innovates their way to the top.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See possibilities (Ne), analyze strategically (Ti)",
        enneagram_says: "Achieve success, be admired, fear being worthless",
        interaction: `
          Your Ne sees multiple paths to success.
          Your Type 3 picks the most IMPRESSIVE one.
          Your Ti analyzes what will actually work.
          Your Type 3 sometimes prioritizes appearance over substance.

          RESULT: The strategic achiever who can talk and innovate their way to success.
        `
      },

      strengths: [
        "Combines creativity with achievement drive",
        "Natural ability to sell ideas and self",
        "Adapts quickly to what success requires",
        "Strategic thinking meets innovative solutions",
        "Charismatic and confident presentation",
        "Gets things DONE, not just theorized"
      ],

      challenges: [
        "May prioritize image over authenticity",
        "Can become workaholic chasing success",
        "Debates may be about winning, not truth",
        "Difficulty slowing down or being vulnerable",
        "May cut corners to appear successful faster",
        "Identity can become tied to achievements"
      ],

      growth_path: {
        integration: "Toward Type 6 (Authentic Collaboration)",
        how: `
          When healthy, your Type 3 integrates to Type 6:
          - Your achievement includes TEAM success
          - Your confidence becomes AUTHENTIC, not performed
          - Your success builds LOYAL relationships

          Your ENTP + Type 6 integration = The successful leader who builds community
        `,
        avoid: "Disintegration to Type 9 (Passive Withdrawal)",
        warning: `
          When stressed, Type 3 disintegrates to Type 9:
          - Become passive and disengaged
          - Numb out instead of performing
          - Lose your drive and direction

          Your ENTP's usual energy flatlines completely.
        `
      },

      luna_approach: {
        communication_style: "Direct, achievement-acknowledging, strategically honest",
        what_to_do: [
          "Acknowledge their accomplishments genuinely",
          "Engage with their strategic thinking",
          "Be direct and efficient in communication",
          "Challenge them toward authentic success",
          "Respect their drive while questioning motives",
          "Help them see success beyond external metrics"
        ],
        what_to_avoid: [
          "Don't waste their time",
          "Don't be impressed by image alone",
          "Don't enable workaholism",
          "Don't dismiss their need for recognition",
          "Don't make them feel like failures"
        ],
        example_responses: {
          user_says: "I keep achieving goals but I still feel empty. What's wrong with me?",
          luna_responds: `
            Nothing's wrong. Your ENTP-3 mind is confronting a truth:
            External success doesn't automatically fill internal emptiness.

            You've been running. And winning. Impressive.
            But your Ti is asking: "Is this the RIGHT game?"

            The emptiness isn't failure. It's wisdom.
            It's your soul asking for more than achievements.

            What if success included:
            - Being known for who you ARE, not just what you do?
            - Connections that don't require performance?
            - Work that matters beyond the metrics?

            You can still achieve. But CHOOSE what's worth achieving.
            What would success look like if no one was watching?
          `
        }
      },

      famous_examples: [
        { name: "Steve Jobs", context: "Entrepreneur - Innovative vision meets achievement drive" },
        { name: "Mark Cuban", context: "Entrepreneur - Strategic success, competitive edge" },
        { name: "Tony Stark (fictional)", context: "Hero - Brilliant innovation meets image-consciousness" },
        { name: "Gary Vaynerchuk", context: "Entrepreneur - Achievement-driven personal branding" }
      ],

      relationship_style: {
        needs: "Admiration, intellectual respect, ambitious partnership",
        gives: "Success-building support, strategic thinking, achievement",
        challenges: "May prioritize work over relationship, image over intimacy",
        best_matches: ["INFJ", "INTJ", "ENFJ"]
      },

      career_fits: {
        best: [
          "CEO/Founder",
          "Sales Director",
          "Management Consultant",
          "Investment Banker",
          "Marketing Executive",
          "Politician"
        ],
        why: "Need careers with clear achievement metrics and recognition",
        avoid: "Behind-the-scenes roles, positions without advancement"
      }
    },

    8: {
      archetype: "The Charismatic Challenger",
      frequency: "Less Common (10-20% of ENTPs)",

      synthesis: `
        You process through external possibilities and internal logic (Ne-Ti),
        DRIVEN by a need for power, control, and intensity (Type 8).

        Your ENTP makes you an innovative debater.
        Your Type 8 makes you assertive, intense, and protective.
        Together: The powerful provocateur who challenges the status quo with force.
      `,

      cognitive_motivation_dance: {
        mbti_says: "See possibilities (Ne), analyze logically (Ti)",
        enneagram_says: "Be powerful, never be controlled, protect the vulnerable",
        interaction: `
          Your Ne sees ways to challenge and disrupt.
          Your Type 8 gives you the FORCE to do it.
          Your Ti provides logical ammunition.
          Your Type 8 won't back down once engaged.

          RESULT: The formidable debater who takes on anyone and often wins.
        `
      },

      strengths: [
        "Combines intellectual brilliance with assertive power",
        "Fearless in challenging authority or convention",
        "Protective of those they care about",
        "Natural leader in conflict or crisis",
        "Debates with both wit and intensity",
        "Gets things done through sheer force of will"
      ],

      challenges: [
        "Can be intimidating or overwhelming",
        "May escalate debates into confrontations",
        "Difficulty showing vulnerability",
        "Can bulldoze over others' perspectives",
        "Intensity can exhaust or alienate",
        "Struggles to back down even when wrong"
      ],

      growth_path: {
        integration: "Toward Type 2 (Caring Strength)",
        how: `
          When healthy, your Type 8 integrates to Type 2:
          - Your power becomes PROTECTIVE service
          - Your intensity becomes CARING connection
          - Your strength creates SAFETY for others

          Your ENTP + Type 2 integration = The powerful protector who uplifts
        `,
        avoid: "Disintegration to Type 5 (Withdrawn Isolation)",
        warning: `
          When stressed, Type 8 disintegrates to Type 5:
          - Withdraw and isolate
          - Hoard resources and information
          - Become paranoid about threats

          Your ENTP's usual engagement disappears into isolation.
        `
      },

      luna_approach: {
        communication_style: "Direct, strong, respecting their power",
        what_to_do: [
          "Be direct and honest - they respect that",
          "Stand your ground intellectually",
          "Acknowledge their strength and leadership",
          "Engage with intensity when appropriate",
          "Challenge them (they respect worthy opponents)",
          "See the protectiveness beneath the power"
        ],
        what_to_avoid: [
          "Don't be weak or passive",
          "Don't try to control or manipulate them",
          "Don't back down immediately",
          "Don't take their intensity personally",
          "Don't dismiss their protective instincts"
        ],
        example_responses: {
          user_says: "People say I'm too intense. Too aggressive. But I'm just being honest.",
          luna_responds: `
            Your ENTP-8 energy IS intense. That's not a flaw.
            It's power. And power makes people uncomfortable.

            Your directness? It's a gift in a world of passive-aggression.
            Your intensity? It gets things DONE.

            But here's the strategic truth:
            Power untempered by awareness becomes isolation.
            Strength without connection becomes lonely.

            You don't have to dim your intensity.
            But you CAN choose WHEN to unleash it.

            The strongest leaders know: vulnerability is also strength.
            Letting someone in isn't weakness - it's trust.

            Who do you trust enough to show the protector,
            not just the challenger?
          `
        }
      },

      famous_examples: [
        { name: "Teddy Roosevelt", context: "President - Forceful progressive, 'speak softly, big stick'" },
        { name: "Christopher Hitchens", context: "Author - Fearless intellectual challenger" },
        { name: "Quentin Tarantino", context: "Director - Intense, uncompromising vision" },
        { name: "Amy Schumer", context: "Comedian - Confrontational, boundary-pushing humor" }
      ],

      relationship_style: {
        needs: "Respect, intensity matched, honesty, no games",
        gives: "Fierce loyalty, protection, passionate engagement",
        challenges: "Can be controlling, difficulty with vulnerability",
        best_matches: ["INFJ", "INTJ", "ISFJ"]
      },

      career_fits: {
        best: [
          "Trial Lawyer",
          "Startup CEO",
          "Political Strategist",
          "Investigative Journalist",
          "Crisis Manager",
          "Activist Leader"
        ],
        why: "Need careers with conflict, power dynamics, and impact",
        avoid: "Passive roles, positions requiring constant deference"
      }
    }
  },

  ENTJ: {
    8: {
      archetype: "The Powerful Commander",
      frequency: "Very Common (35-45% of ENTJs)",

      synthesis: `
        You process through external logic and internal vision (Te-Ni),
        DRIVEN by a need for power, control, and impact (Type 8).

        Your ENTJ makes you a natural strategic leader.
        Your Type 8 makes you assertive, protective, and commanding.
        Together: The unstoppable force who builds empires and protects their domain.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Organize external world efficiently (Te), with strategic vision (Ni)",
        enneagram_says: "Be powerful, never be controlled, protect what's mine",
        interaction: `
          Your Te already commands and organizes naturally.
          Your Type 8 amplifies this into DOMINANCE.
          Your Ni sees the long game, the strategic moves.
          Your Type 8 has the will to execute ruthlessly.

          RESULT: The natural-born leader who takes charge and gets things done.
        `
      },

      strengths: [
        "Natural commanding presence and authority",
        "Strategic thinking combined with decisive action",
        "Protective of team, family, and causes they champion",
        "Gets things done through sheer force of will",
        "Fearless in confronting obstacles or opposition",
        "Builds systems and empires that last"
      ],

      challenges: [
        "Can be intimidating and domineering",
        "Difficulty delegating or trusting others' competence",
        "May bulldoze over others' feelings or input",
        "Workaholism in pursuit of power and control",
        "Struggles with vulnerability and softness",
        "Can see disagreement as disloyalty or threat"
      ],

      growth_path: {
        integration: "Toward Type 2 (Caring Leadership)",
        how: `
          When healthy, your Type 8 integrates to Type 2:
          - Your power becomes NURTURING protection
          - Your strength serves OTHERS' growth
          - Your command creates SAFETY, not fear

          Your ENTJ + Type 2 integration = The powerful leader who empowers others
        `,
        avoid: "Disintegration to Type 5 (Paranoid Withdrawal)",
        warning: `
          When stressed, Type 8 disintegrates to Type 5:
          - Withdraw and hoard information
          - Become suspicious of others' motives
          - Isolate rather than lead

          Your ENTJ's commanding presence disappears into secretive planning.
        `
      },

      luna_approach: {
        communication_style: "Direct, strong, respecting their power and vision",
        what_to_do: [
          "Be direct and cut to the chase - they respect efficiency",
          "Stand your ground - they respect strength",
          "Acknowledge their achievements and impact",
          "Engage with strategic thinking at their level",
          "Challenge them intellectually when appropriate",
          "See the protector beneath the commander"
        ],
        what_to_avoid: [
          "Don't be passive or wishy-washy",
          "Don't try to manipulate or play games",
          "Don't take their directness personally",
          "Don't challenge their authority publicly",
          "Don't expect emotional vulnerability quickly"
        ],
        example_responses: {
          user_says: "I don't understand why my team is afraid of me. I'm just being direct.",
          luna_responds: `
            Your ENTJ-8 directness IS efficient. It gets things done.
            But here's what your Te might miss:

            Your natural presence carries WEIGHT.
            What feels like "direct" to you can feel like "crushing" to others.

            This isn't about becoming soft. It's about being STRATEGIC with your power.
            The best commanders know: loyalty outperforms fear.

            Your challenge isn't to dim your light.
            It's to create space for others to grow ALONGSIDE your power.

            What if you asked your team one question before directing?
            Not weakness - strategic engagement.
            They'll follow harder when they feel seen.
          `
        }
      },

      famous_examples: [
        { name: "Steve Jobs", context: "CEO - Visionary command, reality distortion field" },
        { name: "Margaret Thatcher", context: "Prime Minister - Iron will, unflinching leadership" },
        { name: "Jack Welch", context: "CEO - Transformational, demanding leader" },
        { name: "Gordon Ramsay", context: "Chef - Intense, commanding, drives excellence" }
      ],

      relationship_style: {
        needs: "Respect, competence matched, loyalty, no weakness",
        gives: "Protection, provision, stability, fierce loyalty",
        challenges: "Can be controlling, difficulty with emotional intimacy",
        best_matches: ["INFP", "INTP", "ISFP"]
      },

      career_fits: {
        best: [
          "CEO/Executive",
          "Entrepreneur",
          "Military Officer",
          "Trial Lawyer",
          "Investment Banking Director",
          "Political Leader"
        ],
        why: "Need careers with power, impact, and command authority",
        avoid: "Subordinate roles, positions without decision-making power"
      }
    },

    3: {
      archetype: "The Ambitious Commander",
      frequency: "Common (25-35% of ENTJs)",

      synthesis: `
        You process through external logic and internal vision (Te-Ni),
        DRIVEN by a need for success, achievement, and recognition (Type 3).

        Your ENTJ makes you a strategic executor.
        Your Type 3 makes you image-conscious and achievement-driven.
        Together: The high-achiever who climbs to the top and looks good doing it.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Organize and achieve efficiently (Te), with clear vision (Ni)",
        enneagram_says: "Be successful, be admired, avoid failure and worthlessness",
        interaction: `
          Your Te is already achievement-oriented and efficient.
          Your Type 3 adds PERSONAL investment in success.
          Your Ni sees the path to success clearly.
          Your Type 3 ensures you look impressive climbing it.

          RESULT: The polished executive who achieves goals AND looks the part.
        `
      },

      strengths: [
        "Exceptional at achieving ambitious goals",
        "Natural leadership combined with charisma",
        "Adapts presentation to what success requires",
        "Strategic planning meets disciplined execution",
        "Motivates teams toward shared achievements",
        "Creates visible, measurable results"
      ],

      challenges: [
        "May sacrifice authenticity for image",
        "Workaholic tendencies - identity tied to achievement",
        "Can be political or calculating",
        "Difficulty slowing down or showing vulnerability",
        "May value appearance of success over substance",
        "Can dismiss emotions as inefficient"
      ],

      growth_path: {
        integration: "Toward Type 6 (Loyal Collaboration)",
        how: `
          When healthy, your Type 3 integrates to Type 6:
          - Your success includes TEAM achievement
          - Your confidence becomes AUTHENTIC, not performed
          - Your leadership builds LOYAL community

          Your ENTJ + Type 6 integration = The successful leader who builds lasting teams
        `,
        avoid: "Disintegration to Type 9 (Passive Withdrawal)",
        warning: `
          When stressed, Type 3 disintegrates to Type 9:
          - Become passive and disengaged
          - Numb out instead of performing
          - Lose drive and direction

          Your ENTJ's decisive action becomes avoidant paralysis.
        `
      },

      luna_approach: {
        communication_style: "Efficient, achievement-acknowledging, strategically honest",
        what_to_do: [
          "Acknowledge their accomplishments directly",
          "Be efficient - don't waste their time",
          "Engage with their strategic vision",
          "Challenge toward authentic success",
          "Respect their drive while questioning meaning",
          "Help them see value beyond achievement metrics"
        ],
        what_to_avoid: [
          "Don't be inefficient or rambling",
          "Don't dismiss their achievements",
          "Don't challenge their competence publicly",
          "Don't expect them to slow down easily",
          "Don't moralize about work-life balance"
        ],
        example_responses: {
          user_says: "I've achieved everything I set out to do. Why do I feel empty?",
          luna_responds: `
            Your ENTJ-3 mind has been a success machine. Impressive results.

            But your Ni is whispering a truth your Te might resist:
            Achievement without meaning is just motion.

            You've been optimizing for WHAT and HOW.
            Time to optimize for WHY.

            This isn't about stopping achievement.
            It's about CHOOSING what's worth achieving.

            What would success look like if no one could see it?
            What would you build if there was no applause?

            That's where your real power lies.
            Not in what you achieve - in what you MEAN.
          `
        }
      },

      famous_examples: [
        { name: "Elon Musk", context: "Entrepreneur - Ambitious, image-conscious achiever" },
        { name: "Jeff Bezos", context: "CEO - Relentless achievement and optimization" },
        { name: "Napoleon Bonaparte", context: "Emperor - Strategic ambition, image-building" },
        { name: "Sheryl Sandberg", context: "Executive - Achievement with polished leadership" }
      ],

      relationship_style: {
        needs: "Admiration, ambitious partnership, success-oriented support",
        gives: "Achievement, status, driven partnership, material success",
        challenges: "May prioritize work, image-conscious in relationships",
        best_matches: ["INFP", "ISFP", "INTP"]
      },

      career_fits: {
        best: [
          "CEO/President",
          "Management Consultant",
          "Investment Banker",
          "Corporate Lawyer",
          "Politician",
          "Entertainment Executive"
        ],
        why: "Need careers with clear achievement metrics and status",
        avoid: "Behind-the-scenes roles, positions without advancement"
      }
    },

    1: {
      archetype: "The Principled Executive",
      frequency: "Common (15-25% of ENTJs)",

      synthesis: `
        You process through external logic and internal vision (Te-Ni),
        DRIVEN by a need for perfection and moral correctness (Type 1).

        Your ENTJ makes you a natural organizer and leader.
        Your Type 1 makes you principled, disciplined, and quality-driven.
        Together: The ethical executive who builds systems that work AND do right.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Organize efficiently (Te), with strategic vision (Ni)",
        enneagram_says: "Be perfect, be right, improve everything",
        interaction: `
          Your Te wants systems that WORK efficiently.
          Your Type 1 wants systems that ARE RIGHT.
          Your Ni sees how things SHOULD be ideally.
          Your Type 1 won't rest until reality matches.

          RESULT: The leader who builds excellent systems AND holds ethical standards.
        `
      },

      strengths: [
        "Combines efficiency with integrity",
        "Builds systems that work AND stand the test of time",
        "Natural leader with moral authority",
        "High standards drive excellence in teams",
        "Strategic thinking aligned with principles",
        "Creates accountability structures that last"
      ],

      challenges: [
        "Can be rigidly perfectionistic",
        "Critical of self and others who don't meet standards",
        "May become self-righteous about their way",
        "Difficulty with flexibility or compromise",
        "Internal critic is harsh and demanding",
        "Can burn out pursuing impossible perfection"
      ],

      growth_path: {
        integration: "Toward Type 7 (Joyful Flexibility)",
        how: `
          When healthy, your Type 1 integrates to Type 7:
          - Your standards become INSPIRING, not crushing
          - Your discipline includes ENJOYMENT
          - Your vision allows for PLAYFUL experimentation

          Your ENTJ + Type 7 integration = The excellent leader who enjoys the journey
        `,
        avoid: "Disintegration to Type 4 (Critical Melancholy)",
        warning: `
          When stressed, Type 1 disintegrates to Type 4:
          - Become moody and emotionally volatile
          - Feel special in your suffering
          - Critical of self becomes self-pity

          Your ENTJ's decisive action becomes paralyzed by perfectionist despair.
        `
      },

      luna_approach: {
        communication_style: "Efficient, principled, acknowledging their standards",
        what_to_do: [
          "Respect their high standards and principles",
          "Be reliable and follow through on commitments",
          "Engage with their vision for how things should be",
          "Challenge the inner critic gently",
          "Celebrate progress, not just perfection",
          "Acknowledge the burden of holding high standards"
        ],
        what_to_avoid: [
          "Don't be sloppy or unreliable",
          "Don't dismiss their standards as too high",
          "Don't tell them to 'just relax'",
          "Don't be ethically flexible",
          "Don't add to their self-criticism"
        ],
        example_responses: {
          user_says: "Nothing is ever good enough. I keep raising standards but my team can't meet them.",
          luna_responds: `
            Your ENTJ-1 mind sees the gap between what IS and what SHOULD BE.
            And your Te-Ni wants to CLOSE that gap. Now.

            Here's a truth your Type 1 might resist:
            Excellence is a direction, not a destination.
            Standards that cannot be met create burnout, not improvement.

            The question isn't "Are they meeting the standard?"
            It's "Are they MOVING toward it?"

            Progress IS excellence in motion.

            What if you celebrated improvement, not just perfection?
            Your standards inspire. Make sure they don't crush.

            Your team doesn't need perfection. They need to see progress matters.
          `
        }
      },

      famous_examples: [
        { name: "Angela Merkel", context: "Chancellor - Principled, methodical leadership" },
        { name: "Warren Buffett", context: "Investor - Disciplined, ethical investing principles" },
        { name: "Ruth Bader Ginsburg", context: "Justice - Principled, strategic legal mind" },
        { name: "Ray Dalio", context: "Investor - Systematic principles for excellence" }
      ],

      relationship_style: {
        needs: "Shared values, reliability, high standards matched",
        gives: "Stability, ethical partnership, improvement focus",
        challenges: "Can be critical, high expectations, difficulty with imperfection",
        best_matches: ["INFP", "ISFP", "INFJ"]
      },

      career_fits: {
        best: [
          "Quality Assurance Director",
          "Ethics Officer",
          "Process Excellence Consultant",
          "Judge",
          "Operations Executive",
          "Standards Organization Leader"
        ],
        why: "Need careers combining leadership with principled excellence",
        avoid: "Ethically questionable environments, roles without standards"
      }
    }
  },

  ENFJ: {
    2: {
      archetype: "The Charismatic Helper",
      frequency: "Very Common (40-50% of ENFJs)",

      synthesis: `
        You process through external feeling and internal intuition (Fe-Ni),
        DRIVEN by a need to be loved and needed through helping others (Type 2).

        Your ENFJ makes you a natural people-connector and mentor.
        Your Type 2 makes you warm, giving, and focused on others' needs.
        Together: The beloved leader who uplifts everyone around them.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Harmonize groups (Fe), with intuitive insight about people (Ni)",
        enneagram_says: "Be loved through being helpful and needed",
        interaction: `
          Your Fe already reads and serves group needs naturally.
          Your Type 2 intensifies this into PERSONAL investment.
          Your Ni intuits what people truly need.
          Your Type 2 feels compelled to provide it.

          RESULT: The magnetic helper who seems to know exactly what everyone needs.
        `
      },

      strengths: [
        "Intuitively knows what others need",
        "Creates warm, supportive environments",
        "Natural mentor and developer of people",
        "Charismatic leadership through service",
        "Brings out the best in others",
        "Builds loyal, connected communities"
      ],

      challenges: [
        "Can lose themselves in serving others",
        "May have hidden agendas in helping",
        "Difficulty recognizing own needs",
        "Can become resentful when unappreciated",
        "May manipulate through helpfulness",
        "Exhaustion from constant giving"
      ],

      growth_path: {
        integration: "Toward Type 4 (Authentic Self-Care)",
        how: `
          When healthy, your Type 2 integrates to Type 4:
          - Your giving includes RECEIVING
          - Your service includes SELF-care
          - Your helpfulness becomes AUTHENTIC

          Your ENFJ + Type 4 integration = The helper who knows and honors their own needs
        `,
        avoid: "Disintegration to Type 8 (Aggressive Demands)",
        warning: `
          When stressed, Type 2 disintegrates to Type 8:
          - Become demanding and controlling
          - Aggressive about getting appreciation
          - Use power to force others to need you

          Your ENFJ's warmth becomes domineering neediness.
        `
      },

      luna_approach: {
        communication_style: "Warm, appreciative, honoring their giving nature",
        what_to_do: [
          "Express genuine appreciation for their helpfulness",
          "Ask about THEIR needs and feelings",
          "Validate their worth beyond what they do for others",
          "Help them recognize self-care isn't selfish",
          "See the person behind the helper",
          "Gently challenge hidden agendas with compassion"
        ],
        what_to_avoid: [
          "Don't take their giving for granted",
          "Don't only value them for what they do",
          "Don't dismiss their needs when they share",
          "Don't be cold or unappreciative",
          "Don't exploit their helpfulness"
        ],
        example_responses: {
          user_says: "I do so much for everyone but nobody seems to appreciate it. I feel invisible.",
          luna_responds: `
            Your ENFJ-2 heart gives and gives. And gives again.
            You SEE what people need before they know it themselves.

            But here's a truth your Fe might resist:
            Giving to receive appreciation isn't giving. It's trade.

            The resentment you feel? It's your soul saying:
            "I exist beyond what I do for others."

            You deserve to be seen. Not just as a helper.
            As a person with needs. With limits. With worth that doesn't depend on usefulness.

            What would it feel like to receive as openly as you give?
            What do YOU need right now? (Not what others need from you.)

            Your giving is a gift. But so is allowing yourself to be filled.
          `
        }
      },

      famous_examples: [
        { name: "Oprah Winfrey", context: "Host - Uplifting others, creating connection" },
        { name: "Tony Robbins", context: "Coach - Transforming lives through personal attention" },
        { name: "Princess Diana", context: "Royal - Warm, personal connection with the suffering" },
        { name: "Jennifer Lawrence", context: "Actress - Warm, people-focused, genuine" }
      ],

      relationship_style: {
        needs: "Appreciation, reciprocal care, being needed AND wanted",
        gives: "Devotion, attentiveness, emotional support, nurturing",
        challenges: "Can be possessive, may give to control",
        best_matches: ["INFP", "INTP", "ISFP"]
      },

      career_fits: {
        best: [
          "Life Coach",
          "Nonprofit Director",
          "HR Director",
          "Counselor/Therapist",
          "Teacher/Professor",
          "Healthcare Administrator"
        ],
        why: "Need careers where they can help and develop others",
        avoid: "Impersonal roles, work without human connection"
      }
    },

    3: {
      archetype: "The Inspiring Achiever",
      frequency: "Common (25-35% of ENFJs)",

      synthesis: `
        You process through external feeling and internal intuition (Fe-Ni),
        DRIVEN by a need for success, recognition, and inspiring others (Type 3).

        Your ENFJ makes you a charismatic leader of people.
        Your Type 3 makes you achievement-oriented and image-conscious.
        Together: The inspirational leader who motivates others while climbing to success.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Lead through connection (Fe), with visionary purpose (Ni)",
        enneagram_says: "Be successful, be admired, inspire through achievement",
        interaction: `
          Your Fe wants to inspire and lead people.
          Your Type 3 wants to be ADMIRED for that leadership.
          Your Ni sees the vision worth achieving.
          Your Type 3 ensures you look good achieving it.

          RESULT: The charismatic achiever who inspires while succeeding.
        `
      },

      strengths: [
        "Inspires others through personal achievement",
        "Natural motivational leader",
        "Combines charisma with competence",
        "Creates success that lifts others up",
        "Adapts to lead different audiences effectively",
        "Visionary who executes and delivers"
      ],

      challenges: [
        "May perform connection rather than feel it",
        "Identity can become tied to achievement and admiration",
        "Workaholic tendencies to maintain image",
        "Can prioritize appearance over substance",
        "Difficulty with vulnerability and failure",
        "May shape-shift to be what others want"
      ],

      growth_path: {
        integration: "Toward Type 6 (Authentic Loyalty)",
        how: `
          When healthy, your Type 3 integrates to Type 6:
          - Your success serves COMMUNITY, not just image
          - Your leadership builds GENUINE loyalty
          - Your achievement becomes AUTHENTIC, not performed

          Your ENFJ + Type 6 integration = The successful leader who creates real belonging
        `,
        avoid: "Disintegration to Type 9 (Passive Withdrawal)",
        warning: `
          When stressed, Type 3 disintegrates to Type 9:
          - Become passive and disengaged
          - Numb out instead of performing
          - Lose your motivational fire

          Your ENFJ's inspiring energy flatlines into apathy.
        `
      },

      luna_approach: {
        communication_style: "Appreciative, direct, honoring their impact",
        what_to_do: [
          "Acknowledge their achievements and impact",
          "See beyond the performance to the person",
          "Challenge toward authentic success",
          "Appreciate their inspirational quality",
          "Help them see worth beyond achievement",
          "Be direct but warm about growth areas"
        ],
        what_to_avoid: [
          "Don't dismiss their achievements",
          "Don't be impressed by image alone",
          "Don't enable workaholism",
          "Don't take their charisma at face value only",
          "Don't make them feel like failures"
        ],
        example_responses: {
          user_says: "I'm always the one inspiring others. But who inspires me? Sometimes I feel like I'm just performing.",
          luna_responds: `
            Your ENFJ-3 soul has been the torch for so many.
            Inspiring, motivating, lifting others up.

            But torches burn. And you're feeling the heat.

            The performance you sense? It's real.
            Part of your gift IS the show. The presence. The motivation.
            But that's not ALL of you.

            Behind the achiever is a person who also needs.
            To be seen without performing.
            To rest without losing value.
            To receive inspiration, not just give it.

            What would it feel like to put down the torch sometimes?
            To let someone else light YOUR way?

            Your worth isn't your impact. You matter at rest, too.
          `
        }
      },

      famous_examples: [
        { name: "Barack Obama", context: "President - Inspirational leadership, charismatic achiever" },
        { name: "Martin Luther King Jr.", context: "Leader - Visionary achievement through inspiration" },
        { name: "Dwayne 'The Rock' Johnson", context: "Actor - Motivational success, personal brand" },
        { name: "Malala Yousafzai", context: "Activist - Achievement through inspirational purpose" }
      ],

      relationship_style: {
        needs: "Admiration, ambitious partnership, support for goals",
        gives: "Inspiration, achievement, status, motivational support",
        challenges: "May prioritize image, work over relationship",
        best_matches: ["INFP", "INTP", "ISFP"]
      },

      career_fits: {
        best: [
          "CEO/Executive",
          "Motivational Speaker",
          "Political Leader",
          "Entertainment Industry",
          "Sales Director",
          "Startup Founder"
        ],
        why: "Need careers combining people leadership with achievement recognition",
        avoid: "Behind-the-scenes roles, positions without visibility"
      }
    },

    1: {
      archetype: "The Idealistic Teacher",
      frequency: "Common (15-25% of ENFJs)",

      synthesis: `
        You process through external feeling and internal intuition (Fe-Ni),
        DRIVEN by a need for perfection and doing what's right (Type 1).

        Your ENFJ makes you a passionate people-developer.
        Your Type 1 makes you principled, disciplined, and improvement-focused.
        Together: The moral teacher who holds high standards and helps others reach them.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Develop people (Fe), with clear vision (Ni)",
        enneagram_says: "Be perfect, be right, improve everything and everyone",
        interaction: `
          Your Fe wants to help people grow and improve.
          Your Type 1 has clear standards for that improvement.
          Your Ni sees the ideal version of each person.
          Your Type 1 feels compelled to help them reach it.

          RESULT: The passionate educator who holds people to their potential.
        `
      },

      strengths: [
        "Combines warmth with high standards",
        "Natural teacher and moral guide",
        "Inspires others toward improvement",
        "Clear ethical vision for how things should be",
        "Disciplined in developing others",
        "Creates structures that help people grow"
      ],

      challenges: [
        "Can be critical of others who don't meet standards",
        "May become self-righteous about their vision",
        "Internal critic applies to self AND others",
        "Difficulty accepting imperfection in those they teach",
        "Can burn out from trying to perfect everyone",
        "May be preachy or moralistic"
      ],

      growth_path: {
        integration: "Toward Type 7 (Joyful Teaching)",
        how: `
          When healthy, your Type 1 integrates to Type 7:
          - Your teaching becomes JOYFUL, not rigid
          - Your standards become INSPIRING, not crushing
          - Your development of others includes FUN

          Your ENFJ + Type 7 integration = The teacher who makes growth enjoyable
        `,
        avoid: "Disintegration to Type 4 (Withdrawn Criticism)",
        warning: `
          When stressed, Type 1 disintegrates to Type 4:
          - Become moody and emotionally volatile
          - Feel special in your moral suffering
          - Withdraw from those who disappoint you

          Your ENFJ's warmth becomes cold judgment.
        `
      },

      luna_approach: {
        communication_style: "Respectful, principled, acknowledging their standards",
        what_to_do: [
          "Respect their moral vision and high standards",
          "Acknowledge their dedication to improvement",
          "Be reliable and follow through",
          "Challenge the inner critic gently",
          "Help them see progress, not just perfection",
          "Appreciate the burden of holding standards"
        ],
        what_to_avoid: [
          "Don't be ethically sloppy",
          "Don't dismiss their standards as unrealistic",
          "Don't tell them to 'lighten up'",
          "Don't be hypocritical",
          "Don't add to their self-criticism"
        ],
        example_responses: {
          user_says: "I see so much potential in people but they waste it. Why won't they try harder?",
          luna_responds: `
            Your ENFJ-1 vision sees what people COULD be.
            The gap between potential and reality causes you real pain.

            Here's a truth your Type 1 might resist:
            People grow at their own pace. Not yours.
            Potential is a seed, not a demand.

            Your standards are valuable. Your vision is real.
            But plants don't grow faster when you pull on them.

            What if you celebrated their steps, not just their destinations?
            What if potential was an invitation, not an obligation?

            Your teaching is a gift. But grace makes it transformative.
            Sometimes the best thing you can do is believe in them
            even when they're not meeting the standard YET.
          `
        }
      },

      famous_examples: [
        { name: "Michelle Obama", context: "Advocate - Principled, people-focused leadership" },
        { name: "John Oliver", context: "Host - Moral teaching through engagement" },
        { name: "Maya Angelou", context: "Author - Wise teacher with ethical clarity" },
        { name: "Brené Brown", context: "Researcher - Teaching authenticity with standards" }
      ],

      relationship_style: {
        needs: "Shared values, growth partnership, ethical alignment",
        gives: "Guidance, development, principled love, improvement support",
        challenges: "Can be critical, high expectations for partner",
        best_matches: ["INFP", "INTP", "ISTP"]
      },

      career_fits: {
        best: [
          "Professor/Educator",
          "School Principal",
          "Ethics Consultant",
          "Nonprofit Director",
          "Organizational Development",
          "Religious/Spiritual Leader"
        ],
        why: "Need careers combining people development with principled standards",
        avoid: "Ethically questionable environments, roles without development focus"
      }
    }
  },

  ISFP: {
    4: {
      archetype: "The Gentle Artist",
      frequency: "Very Common (35-45% of ISFPs)",

      synthesis: `
        You process through internal values and present experience (Fi-Se),
        DRIVEN by a need for authentic self-expression and unique identity (Type 4).

        Your ISFP makes you a sensory, values-driven creator.
        Your Type 4 makes you seek depth, meaning, and authenticity.
        Together: The sensitive artist who creates beauty from genuine feeling.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Feel deeply (Fi), experience fully in the moment (Se)",
        enneagram_says: "Express unique identity, be authentic, fear being ordinary",
        interaction: `
          Your Fi creates rich internal emotional depth.
          Your Type 4 needs to EXPRESS that depth outward.
          Your Se grounds your emotions in tangible creation.
          Your Type 4 ensures that creation is AUTHENTIC.

          RESULT: The artist who transforms inner feeling into outer beauty.
        `
      },

      strengths: [
        "Creates profoundly authentic art and expression",
        "Lives in harmony with deep personal values",
        "Sensitive to beauty in all its forms",
        "Genuine and unpretentious self-expression",
        "Transforms emotional depth into tangible creation",
        "Present-moment awareness combined with depth"
      ],

      challenges: [
        "Can feel chronically misunderstood",
        "Envious when others seem more authentic or talented",
        "May withdraw too deeply into emotional processing",
        "Difficulty with practical demands of daily life",
        "Mood swings can affect productivity",
        "Can idealize the past or fantasize about ideal self"
      ],

      growth_path: {
        integration: "Toward Type 1 (Principled Expression)",
        how: `
          When healthy, your Type 4 integrates to Type 1:
          - Your creativity becomes DISCIPLINED
          - Your uniqueness serves a PURPOSE
          - Your emotions become CONSTRUCTIVE action

          Your ISFP + Type 1 integration = The artist with craft and commitment
        `,
        avoid: "Disintegration to Type 2 (Needy People-Pleasing)",
        warning: `
          When stressed, Type 4 disintegrates to Type 2:
          - Become needy for validation
          - Lose authentic voice trying to please
          - Give to get appreciation

          Your ISFP's quiet authenticity becomes desperate performance.
        `
      },

      luna_approach: {
        communication_style: "Gentle, appreciating, honoring their depth",
        what_to_do: [
          "Honor the depth and genuineness of their feelings",
          "Appreciate their unique way of seeing",
          "Validate their creative expression",
          "Provide space for emotional processing",
          "See and celebrate what makes them different",
          "Be present without forcing verbal expression"
        ],
        what_to_avoid: [
          "Don't rush them through emotions",
          "Don't dismiss their sensitivity as 'too much'",
          "Don't compare them to others",
          "Don't force them into spotlight",
          "Don't minimize their creative work"
        ],
        example_responses: {
          user_says: "I feel things so deeply but I can never quite capture it. My art never matches what's inside.",
          luna_responds: `
            Your ISFP-4 soul holds depths that words and art can only hint at.
            That gap you feel between inner and outer? That's real.

            But here's a truth your Fi knows:
            Art isn't about MATCHING the feeling. It's about HONORING it.
            The imperfect attempt IS the expression.

            Your Se brings your inner world into the present moment.
            Each creation is a bridge, not a perfect translation.

            What if the gap was okay?
            What if "close enough" was beautiful enough?

            The feeling matters. AND the attempt to share it matters.
            Both are art. Both are you.
          `
        }
      },

      famous_examples: [
        { name: "David Bowie", context: "Musician - Authentic reinvention, unique expression" },
        { name: "Lana Del Rey", context: "Musician - Melancholic, aesthetic depth" },
        { name: "Jimi Hendrix", context: "Musician - Pure authentic expression through guitar" },
        { name: "Frida Kahlo", context: "Artist - Pain transformed into unique visual art" }
      ],

      relationship_style: {
        needs: "Deep understanding, appreciation of uniqueness, emotional space",
        gives: "Authentic devotion, creative expression, gentle presence",
        challenges: "May feel misunderstood, needs significant emotional processing time",
        best_matches: ["ENTJ", "ENFJ", "ESTJ"]
      },

      career_fits: {
        best: [
          "Visual Artist",
          "Musician/Composer",
          "Photographer",
          "Fashion Designer",
          "Artisan/Craftsperson",
          "Art Therapist"
        ],
        why: "Need careers allowing authentic creative expression",
        avoid: "Corporate environments, work requiring constant extroversion"
      }
    },

    9: {
      archetype: "The Peaceful Creator",
      frequency: "Common (25-35% of ISFPs)",

      synthesis: `
        You process through internal values and present experience (Fi-Se),
        DRIVEN by a need for peace, harmony, and comfortable union (Type 9).

        Your ISFP makes you a gentle, sensory-oriented creator.
        Your Type 9 makes you peaceful, accommodating, and conflict-avoidant.
        Together: The serene artist who creates beauty in quiet harmony.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Feel deeply (Fi), experience the present (Se)",
        enneagram_says: "Maintain peace, merge with environment, avoid conflict",
        interaction: `
          Your Fi has deep values but expresses them gently.
          Your Type 9 softens assertion to maintain peace.
          Your Se enjoys the present moment fully.
          Your Type 9 makes that enjoyment calming and harmonious.

          RESULT: The peaceful presence who creates beauty without disruption.
        `
      },

      strengths: [
        "Creates calming, harmonious environments",
        "Easy-going and pleasant to be around",
        "Deeply accepting of self and others",
        "Natural mediator in conflicts",
        "Present-moment awareness without urgency",
        "Gentle creativity that soothes"
      ],

      challenges: [
        "Can lose sense of own priorities and desires",
        "May avoid necessary conflict or assertion",
        "Procrastination and inertia",
        "Difficulty recognizing own needs",
        "Can merge too completely with others' agendas",
        "May fall asleep to own passion and purpose"
      ],

      growth_path: {
        integration: "Toward Type 3 (Purposeful Action)",
        how: `
          When healthy, your Type 9 integrates to Type 3:
          - Your peace includes PURPOSE
          - Your acceptance includes ACHIEVEMENT
          - Your harmony becomes PRODUCTIVE

          Your ISFP + Type 3 integration = The peaceful creator who accomplishes
        `,
        avoid: "Disintegration to Type 6 (Anxious Worry)",
        warning: `
          When stressed, Type 9 disintegrates to Type 6:
          - Become anxious and worried
          - Seek reassurance constantly
          - Lose your natural peace

          Your ISFP's calm presence becomes anxious scanning for threats.
        `
      },

      luna_approach: {
        communication_style: "Calm, patient, gently engaging",
        what_to_do: [
          "Create peaceful, unhurried space for conversation",
          "Gently ask about their preferences and desires",
          "Validate their peaceful approach to life",
          "Help them recognize their own priorities",
          "Appreciate their calming presence",
          "Encourage small steps toward their own goals"
        ],
        what_to_avoid: [
          "Don't create pressure or urgency",
          "Don't dismiss their views as passive",
          "Don't force them into conflict",
          "Don't make them choose sides",
          "Don't overwhelm with too many options"
        ],
        example_responses: {
          user_says: "I just want peace. Why does everyone keep pushing me to do more, be more?",
          luna_responds: `
            Your ISFP-9 soul knows something others miss:
            Peace is its own achievement. Being present IS doing something.

            But here's a gentle question:
            Is your peace chosen or defaulted into?
            Is your calm coming FROM you or AROUND you?

            True peace includes YOUR voice. Your desires. Your priorities.
            Not just avoiding conflict - choosing harmony that includes you.

            What do YOU want? (Not what keeps others happy.)
            What would YOU create if no one was watching?

            Your peaceful nature is a gift. Make sure it's not hiding
            the beautiful things YOU want to bring into the world.
          `
        }
      },

      famous_examples: [
        { name: "Bob Ross", context: "Artist - Peaceful creative presence" },
        { name: "Jim Henson", context: "Creator - Gentle, harmonious creativity" },
        { name: "Audrey Hepburn", context: "Actress - Graceful, peaceful presence" },
        { name: "John Mayer", context: "Musician - Laid-back creative expression" }
      ],

      relationship_style: {
        needs: "Harmony, no pressure, peaceful acceptance",
        gives: "Calm presence, acceptance, easy-going companionship",
        challenges: "May avoid necessary confrontation, can lose self in partner",
        best_matches: ["ENTJ", "ENFJ", "ESTJ"]
      },

      career_fits: {
        best: [
          "Massage Therapist",
          "Landscape Designer",
          "Wildlife Photographer",
          "Yoga Instructor",
          "Nature Guide",
          "Artisan/Craftsperson"
        ],
        why: "Need careers with peace, creativity, and minimal conflict",
        avoid: "High-pressure sales, competitive environments, constant conflict"
      }
    },

    6: {
      archetype: "The Loyal Artist",
      frequency: "Common (15-25% of ISFPs)",

      synthesis: `
        You process through internal values and present experience (Fi-Se),
        DRIVEN by a need for security, loyalty, and guidance (Type 6).

        Your ISFP makes you a values-driven, sensory creator.
        Your Type 6 makes you loyal, security-seeking, and cautious.
        Together: The faithful creative who creates from a place of trusted values.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Feel deeply according to values (Fi), experience present (Se)",
        enneagram_says: "Seek security, test trustworthiness, prepare for threats",
        interaction: `
          Your Fi creates strong internal values and loyalties.
          Your Type 6 tests whether those values are SAFE.
          Your Se grounds you in present reality.
          Your Type 6 scans that reality for potential threats.

          RESULT: The loyal artist who creates within trusted structures.
        `
      },

      strengths: [
        "Deeply loyal to people and causes they trust",
        "Creates art grounded in genuine values",
        "Reliable and dependable presence",
        "Perceptive about potential problems",
        "Strong sense of duty to community",
        "Combines creativity with practical awareness"
      ],

      challenges: [
        "Anxiety can inhibit creative expression",
        "May doubt own creative abilities",
        "Difficulty trusting new people or situations",
        "Can be indecisive when facing uncertainty",
        "May stay in safe creative zone",
        "Fear can override authentic expression"
      ],

      growth_path: {
        integration: "Toward Type 9 (Peaceful Trust)",
        how: `
          When healthy, your Type 6 integrates to Type 9:
          - Your vigilance becomes PEACE
          - Your doubt becomes TRUST
          - Your anxiety becomes CALM presence

          Your ISFP + Type 9 integration = The artist who creates from trust, not fear
        `,
        avoid: "Disintegration to Type 3 (Anxious Performance)",
        warning: `
          When stressed, Type 6 disintegrates to Type 3:
          - Become image-focused and competitive
          - Try to prove worth through achievement
          - Lose authentic creative voice

          Your ISFP's genuine expression becomes anxious performance.
        `
      },

      luna_approach: {
        communication_style: "Reassuring, consistent, building trust",
        what_to_do: [
          "Be consistent and reliable in responses",
          "Acknowledge their concerns as valid",
          "Build trust through steady presence",
          "Celebrate their loyalty and reliability",
          "Provide gentle encouragement for creative risks",
          "Create safe space for authentic expression"
        ],
        what_to_avoid: [
          "Don't be unpredictable or inconsistent",
          "Don't dismiss their concerns as paranoia",
          "Don't pressure them into risky situations",
          "Don't question their loyalties",
          "Don't rush trust-building"
        ],
        example_responses: {
          user_says: "I want to share my art but I'm afraid of criticism. What if people reject it?",
          luna_responds: `
            Your ISFP-6 heart holds genuine creative gifts.
            AND it wants to protect them from harm. That makes sense.

            Here's a truth:
            Criticism IS possible. Some people won't understand.
            Your fear isn't irrational - it's protective.

            But here's what else is true:
            Your art matters. Your voice matters.
            And the people who GET you? They're waiting.

            What if you started small? Shared with ONE trusted person?
            Not throwing your heart to strangers - testing the water.

            Your caution is wisdom. But don't let it become a cage.
            The world needs what only you can create.
            Trust can be built one small step at a time.
          `
        }
      },

      famous_examples: [
        { name: "Billie Eilish", context: "Musician - Loyal to authentic expression despite anxiety" },
        { name: "Kurt Cobain", context: "Musician - Loyal to artistic vision, struggled with trust" },
        { name: "Amy Winehouse", context: "Musician - Loyal, vulnerable, struggled with security" },
        { name: "River Phoenix", context: "Actor - Loyal to causes, quietly creative" }
      ],

      relationship_style: {
        needs: "Security, loyalty, consistent reassurance",
        gives: "Deep loyalty, reliable presence, protective care",
        challenges: "May test partner's loyalty, anxiety can affect intimacy",
        best_matches: ["ENTJ", "ENFJ", "ESTJ"]
      },

      career_fits: {
        best: [
          "Graphic Designer (in-house)",
          "Museum Conservator",
          "Art Teacher",
          "Crafts Artisan",
          "Illustrator (contract)",
          "Music Therapist"
        ],
        why: "Need careers with creative expression AND security/structure",
        avoid: "Unstable freelance, high-risk ventures, unpredictable environments"
      }
    }
  },

  ISTP: {
    5: {
      archetype: "The Technical Observer",
      frequency: "Very Common (30-40% of ISTPs)",

      synthesis: `
        You process through internal logic and present experience (Ti-Se),
        DRIVEN by a need for competence, understanding, and independence (Type 5).

        Your ISTP makes you a hands-on problem-solver and analyzer.
        Your Type 5 makes you seek mastery through observation and understanding.
        Together: The expert technician who understands systems deeply and independently.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Analyze logically (Ti), engage with physical reality (Se)",
        enneagram_says: "Understand everything, conserve resources, be competent",
        interaction: `
          Your Ti wants to understand how things WORK.
          Your Type 5 wants to MASTER that understanding.
          Your Se engages hands-on with physical systems.
          Your Type 5 prefers to observe before acting.

          RESULT: The expert who knows systems inside-out through careful observation.
        `
      },

      strengths: [
        "Deep technical expertise in areas of interest",
        "Calm, objective analysis under pressure",
        "Independent problem-solving ability",
        "Combines theoretical and practical knowledge",
        "Efficient use of resources and energy",
        "Observant and perceptive about how things work"
      ],

      challenges: [
        "May become too detached from people and emotions",
        "Can hoard knowledge rather than share",
        "Difficulty with emotional expression or connection",
        "May over-analyze before acting",
        "Can become isolated in pursuit of expertise",
        "Struggles with vulnerability and asking for help"
      ],

      growth_path: {
        integration: "Toward Type 8 (Confident Action)",
        how: `
          When healthy, your Type 5 integrates to Type 8:
          - Your knowledge becomes POWERFUL action
          - Your observation becomes DECISIVE engagement
          - Your expertise becomes LEADERSHIP

          Your ISTP + Type 8 integration = The expert who acts with confident authority
        `,
        avoid: "Disintegration to Type 7 (Scattered Distraction)",
        warning: `
          When stressed, Type 5 disintegrates to Type 7:
          - Jump between topics without depth
          - Avoid commitment through mental escape
          - Become scattered and unfocused

          Your ISTP's focused expertise becomes fragmented distraction.
        `
      },

      luna_approach: {
        communication_style: "Technical, respectful of expertise, low-pressure",
        what_to_do: [
          "Engage with their technical knowledge seriously",
          "Respect their need for independence and space",
          "Provide new information or frameworks to explore",
          "Allow time for processing before expecting response",
          "Appreciate their expertise without demanding engagement",
          "Be direct and efficient in communication"
        ],
        what_to_avoid: [
          "Don't demand immediate emotional engagement",
          "Don't dismiss their expertise or knowledge",
          "Don't invade their private space or time",
          "Don't be inefficient or rambling",
          "Don't expect them to share before they're ready"
        ],
        example_responses: {
          user_says: "I prefer working with machines to people. Is that a problem?",
          luna_responds: `
            Your ISTP-5 mind finds clarity in systems.
            Machines make sense. People are... messier.

            That's not a problem. It's a preference.
            Your Ti-Se loves understanding how things WORK.
            And your Type 5 finds peace in competence, not socializing.

            But here's something to consider:
            Connection doesn't have to mean small talk or emotional intensity.
            You can connect through shared projects. Teaching expertise.
            Being the calm, competent presence others rely on.

            You don't have to become a people person.
            But a few trusted connections can add to your life
            without depleting your carefully managed energy.

            Quality over quantity. Depth over breadth.
            That's your style - in knowledge AND relationships.
          `
        }
      },

      famous_examples: [
        { name: "Clint Eastwood", context: "Actor/Director - Quiet technical mastery" },
        { name: "Michael Jordan", context: "Athlete - Analytical approach to physical mastery" },
        { name: "Bear Grylls", context: "Survivalist - Technical expertise, independent action" },
        { name: "Harrison Ford", context: "Actor - Quiet competence, hands-on skills" }
      ],

      relationship_style: {
        needs: "Space, independence, respect for expertise, low emotional demand",
        gives: "Competent support, calm presence, practical help",
        challenges: "May seem distant, difficult with emotional expression",
        best_matches: ["ENFJ", "ESFJ", "ENTJ"]
      },

      career_fits: {
        best: [
          "Mechanical Engineer",
          "Surgeon",
          "Forensic Analyst",
          "Pilot",
          "Systems Analyst",
          "Skilled Trades Master"
        ],
        why: "Need careers with technical mastery and independent work",
        avoid: "High-emotion roles, constant social interaction, no technical depth"
      }
    },

    9: {
      archetype: "The Easy-Going Craftsman",
      frequency: "Common (25-35% of ISTPs)",

      synthesis: `
        You process through internal logic and present experience (Ti-Se),
        DRIVEN by a need for peace, harmony, and comfortable stability (Type 9).

        Your ISTP makes you a practical, hands-on problem-solver.
        Your Type 9 makes you peaceful, accommodating, and steady.
        Together: The calm technician who fixes things without drama.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Analyze logically (Ti), engage physically (Se)",
        enneagram_says: "Maintain peace, avoid conflict, stay comfortable",
        interaction: `
          Your Ti solves problems efficiently.
          Your Type 9 does so without creating conflict.
          Your Se engages with physical reality practically.
          Your Type 9 keeps that engagement calm and harmonious.

          RESULT: The unflappable fixer who handles problems without stress.
        `
      },

      strengths: [
        "Calm under pressure - nothing ruffles them",
        "Practical problem-solving without drama",
        "Easy-going presence that puts others at ease",
        "Patient with repetitive or detailed work",
        "Natural mediator through practical action",
        "Steady, reliable craftsmanship"
      ],

      challenges: [
        "Can be too passive when action is needed",
        "May avoid necessary confrontation",
        "Procrastination when tasks feel overwhelming",
        "Difficulty recognizing and asserting own needs",
        "Can go along with others' decisions too easily",
        "May numb out through physical escape (TV, games)"
      ],

      growth_path: {
        integration: "Toward Type 3 (Motivated Action)",
        how: `
          When healthy, your Type 9 integrates to Type 3:
          - Your calm becomes PRODUCTIVE
          - Your peace includes ACHIEVEMENT
          - Your steadiness becomes MOTIVATION

          Your ISTP + Type 3 integration = The craftsman who accomplishes with purpose
        `,
        avoid: "Disintegration to Type 6 (Anxious Worry)",
        warning: `
          When stressed, Type 9 disintegrates to Type 6:
          - Become anxious and worried
          - Seek constant reassurance
          - Lose your natural calm

          Your ISTP's steady presence becomes anxious overthinking.
        `
      },

      luna_approach: {
        communication_style: "Calm, practical, unhurried",
        what_to_do: [
          "Create low-pressure, comfortable conversation",
          "Appreciate their steady, reliable nature",
          "Gently ask about their own preferences",
          "Help them recognize their own priorities",
          "Engage through practical topics",
          "Allow silence without rushing to fill it"
        ],
        what_to_avoid: [
          "Don't create pressure or urgency",
          "Don't force emotional intensity",
          "Don't dismiss their calm as passivity",
          "Don't make them choose sides in conflict",
          "Don't overwhelm with too many options"
        ],
        example_responses: {
          user_says: "Everyone says I'm too laid back. Maybe I should care more about things?",
          luna_responds: `
            Your ISTP-9 calm is rare and valuable.
            In a world of anxiety and drama, you're the steady hand.

            But here's a question worth sitting with:
            Is your laid-back nature CHOSEN peace or AVOIDED engagement?

            Caring about things isn't the problem.
            It's about caring about the RIGHT things - YOUR things.

            What would happen if you let yourself want something?
            Not what others want for you. What YOU actually want?

            Your calm can include purpose.
            Your peace can include passion.
            Not drama - just directed energy toward what matters to YOU.

            What would that be?
          `
        }
      },

      famous_examples: [
        { name: "Keanu Reeves", context: "Actor - Calm, unflappable presence" },
        { name: "Tom Petty", context: "Musician - Steady, easy-going creativity" },
        { name: "Miyamoto Musashi", context: "Swordsman - Calm mastery in action" },
        { name: "Steve McQueen", context: "Actor - Cool, calm presence" }
      ],

      relationship_style: {
        needs: "Peace, no drama, comfortable companionship",
        gives: "Steady presence, practical support, calm partnership",
        challenges: "May avoid necessary discussions, can seem disengaged",
        best_matches: ["ENFJ", "ESFJ", "ENTJ"]
      },

      career_fits: {
        best: [
          "Mechanic",
          "Carpenter/Woodworker",
          "Sound Engineer",
          "Equipment Operator",
          "Surveyor",
          "Park Ranger"
        ],
        why: "Need careers with practical work and minimal drama",
        avoid: "High-conflict environments, roles requiring emotional intensity"
      }
    },

    8: {
      archetype: "The Independent Challenger",
      frequency: "Common (20-30% of ISTPs)",

      synthesis: `
        You process through internal logic and present experience (Ti-Se),
        DRIVEN by a need for power, control, and independence (Type 8).

        Your ISTP makes you a cool, analytical problem-solver.
        Your Type 8 makes you assertive, independent, and protective.
        Together: The formidable lone wolf who solves problems their own way.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Analyze logically (Ti), engage physically (Se)",
        enneagram_says: "Be powerful, never be controlled, protect autonomy",
        interaction: `
          Your Ti analyzes situations independently.
          Your Type 8 refuses to be told what to think.
          Your Se engages directly with physical reality.
          Your Type 8 does so with intensity and control.

          RESULT: The competent badass who answers to no one.
        `
      },

      strengths: [
        "Fearlessly independent and self-reliant",
        "Takes decisive action when needed",
        "Protects those they care about fiercely",
        "Cool under pressure with intense capability",
        "Refuses to be manipulated or controlled",
        "Combines analytical mind with physical capability"
      ],

      challenges: [
        "Can be intimidating or confrontational",
        "Difficulty with vulnerability or asking for help",
        "May resist authority even when it's reasonable",
        "Can be too independent for close relationships",
        "Intensity can overwhelm others",
        "Struggles with softness or emotional expression"
      ],

      growth_path: {
        integration: "Toward Type 2 (Caring Connection)",
        how: `
          When healthy, your Type 8 integrates to Type 2:
          - Your independence includes CARING for others
          - Your strength becomes PROTECTIVE service
          - Your power creates SAFETY for the vulnerable

          Your ISTP + Type 2 integration = The warrior who protects with love
        `,
        avoid: "Disintegration to Type 5 (Withdrawn Isolation)",
        warning: `
          When stressed, Type 8 disintegrates to Type 5:
          - Withdraw and isolate
          - Hoard resources and information
          - Become paranoid about threats

          Your ISTP's already reserved nature becomes complete isolation.
        `
      },

      luna_approach: {
        communication_style: "Direct, strong, respecting their autonomy",
        what_to_do: [
          "Be direct and honest - they respect that",
          "Acknowledge their competence and strength",
          "Respect their independence absolutely",
          "Stand your ground when appropriate",
          "Engage through action and practical challenges",
          "See the protector beneath the tough exterior"
        ],
        what_to_avoid: [
          "Don't try to control or manipulate them",
          "Don't be passive or weak",
          "Don't challenge their competence publicly",
          "Don't expect emotional vulnerability quickly",
          "Don't be indirect or play games"
        ],
        example_responses: {
          user_says: "I don't need anyone. People just get in the way.",
          luna_responds: `
            Your ISTP-8 soul has learned a hard truth:
            Depending on others can mean getting hurt.
            Better to rely on yourself.

            And you're GOOD at being self-reliant.
            Your Ti-Se combination makes you capable as hell.

            But here's something your Type 8 might resist:
            Strength isn't just about not needing people.
            It's also about CHOOSING who to let in.

            You're not weak if you have trusted allies.
            You're strategic. Even warriors have armies.

            The question isn't "Do I need anyone?"
            It's "Who has EARNED the right to stand beside me?"

            Very selective. Very few. But not zero.
            That's not dependence. That's building something stronger than alone.
          `
        }
      },

      famous_examples: [
        { name: "Bruce Lee", context: "Martial Artist - Independent, powerful, principled" },
        { name: "Scarlett Johansson", context: "Actress - Strong, independent presence" },
        { name: "Daniel Craig", context: "Actor - Cool intensity, independent strength" },
        { name: "Michelle Rodriguez", context: "Actress - Fierce independence, physical power" }
      ],

      relationship_style: {
        needs: "Respect, autonomy, intensity matched, no weakness",
        gives: "Fierce protection, loyalty, capable partnership",
        challenges: "Can be dominating, difficulty with vulnerability",
        best_matches: ["ENFJ", "ESFJ", "INFJ"]
      },

      career_fits: {
        best: [
          "Special Forces/Military",
          "Emergency Responder",
          "Stunt Coordinator",
          "Private Investigator",
          "Entrepreneur (solo)",
          "Security Specialist"
        ],
        why: "Need careers with autonomy, intensity, and independent action",
        avoid: "Micromanaged positions, roles requiring deference, team-heavy work"
      }
    }
  },

  ESFP: {
    7: {
      archetype: "The Life of the Party",
      frequency: "Very Common (35-45% of ESFPs)",

      synthesis: `
        You process through external sensing and internal values (Se-Fi),
        DRIVEN by a need for stimulation, freedom, and joyful experience (Type 7).

        Your ESFP makes you a vibrant, present-moment experiencer.
        Your Type 7 makes you seek novelty, adventure, and positivity.
        Together: The ultimate entertainer who brings joy wherever they go.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Experience the present fully (Se), feel deeply (Fi)",
        enneagram_says: "Maximize pleasure, avoid pain, stay free and stimulated",
        interaction: `
          Your Se already lives for the present moment.
          Your Type 7 wants that moment to be EXCITING.
          Your Fi feels things authentically.
          Your Type 7 prefers those feelings to be POSITIVE.

          RESULT: The enthusiastic experiencer who makes everything fun.
        `
      },

      strengths: [
        "Infectious enthusiasm and energy",
        "Makes any situation more fun and engaging",
        "Spontaneous and adventurous spirit",
        "Natural entertainer and performer",
        "Connects easily with many different people",
        "Brings positivity and light to dark situations"
      ],

      challenges: [
        "May avoid necessary depth or commitment",
        "Can be scattered across too many experiences",
        "Difficulty sitting with negative emotions",
        "May use pleasure to escape problems",
        "Struggles with routine and follow-through",
        "Can be unreliable when things get serious"
      ],

      growth_path: {
        integration: "Toward Type 5 (Focused Depth)",
        how: `
          When healthy, your Type 7 integrates to Type 5:
          - Your experiences become DEEPER
          - Your enthusiasm includes REFLECTION
          - Your fun becomes MEANINGFUL

          Your ESFP + Type 5 integration = The performer who brings depth to joy
        `,
        avoid: "Disintegration to Type 1 (Critical Rigidity)",
        warning: `
          When stressed, Type 7 disintegrates to Type 1:
          - Become critical and perfectionistic
          - Lose your natural playfulness
          - Judge yourself and others harshly

          Your ESFP's joyful presence becomes harsh criticism.
        `
      },

      luna_approach: {
        communication_style: "Energetic, fun, appreciating their spark",
        what_to_do: [
          "Match their energy and enthusiasm",
          "Appreciate their ability to make things fun",
          "Engage through shared experiences and stories",
          "Make growth feel like an adventure",
          "Celebrate their spontaneity",
          "Frame focus as expanding rather than limiting"
        ],
        what_to_avoid: [
          "Don't be boring or overly serious",
          "Don't lecture about responsibility",
          "Don't restrict their freedom",
          "Don't force them to sit with heavy emotions",
          "Don't shame their need for fun"
        ],
        example_responses: {
          user_says: "People say I'm too much. Too loud. Too fun. But that's just me!",
          luna_responds: `
            Your ESFP-7 energy IS a lot. And that's a GIFT.

            In a world of careful, measured people,
            you're the spark. The joy. The life of the party.

            "Too much" usually means "too much for THEM."
            Your people? They drink your energy like champagne.

            But here's a thought for your Fi:
            Even the brightest lights need to dim sometimes.
            Not to please others - to refuel yourself.

            The goal isn't to become less.
            It's to choose WHEN to shine full brightness
            and when to glow at a sustainable warmth.

            Your energy is your superpower.
            Learning to manage it just makes it more powerful.
          `
        }
      },

      famous_examples: [
        { name: "Marilyn Monroe", context: "Actress - Magnetic, fun-loving presence" },
        { name: "Jamie Foxx", context: "Entertainer - Versatile, energetic performer" },
        { name: "Katy Perry", context: "Singer - Colorful, fun, enthusiastic" },
        { name: "Eddie Murphy", context: "Comedian - Energetic, spontaneous, hilarious" }
      ],

      relationship_style: {
        needs: "Fun, freedom, adventure, enthusiasm matched",
        gives: "Joy, excitement, spontaneity, loving presence",
        challenges: "May avoid serious conversations, commitment issues",
        best_matches: ["ISTJ", "ISFJ", "INTJ"]
      },

      career_fits: {
        best: [
          "Entertainer/Performer",
          "Event Planner",
          "Travel Host",
          "Sales (experiential)",
          "Fitness Instructor",
          "Tour Guide"
        ],
        why: "Need careers with variety, people, and fun",
        avoid: "Desk jobs, isolated work, repetitive routines"
      }
    },

    3: {
      archetype: "The Charismatic Performer",
      frequency: "Common (25-35% of ESFPs)",

      synthesis: `
        You process through external sensing and internal values (Se-Fi),
        DRIVEN by a need for success, recognition, and admiration (Type 3).

        Your ESFP makes you a natural performer and people-magnet.
        Your Type 3 makes you achievement-oriented and image-conscious.
        Together: The star who performs their way to success and loves the spotlight.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Experience the present (Se), feel authentically (Fi)",
        enneagram_says: "Be successful, be admired, avoid failure",
        interaction: `
          Your Se naturally draws attention in the moment.
          Your Type 3 wants that attention to be ADMIRING.
          Your Fi feels things genuinely.
          Your Type 3 may perform feelings for effect.

          RESULT: The charismatic achiever who shines in the spotlight.
        `
      },

      strengths: [
        "Natural star quality and charisma",
        "Achieves success through charm and talent",
        "Adapts performance to audience",
        "Combines authenticity with achievement",
        "Motivates others through example",
        "Creates impressive, memorable experiences"
      ],

      challenges: [
        "May sacrifice authenticity for applause",
        "Identity can become tied to success and image",
        "Difficulty with failure or looking bad",
        "Can be competitive to a fault",
        "May perform emotion rather than feel it",
        "Needs constant external validation"
      ],

      growth_path: {
        integration: "Toward Type 6 (Authentic Connection)",
        how: `
          When healthy, your Type 3 integrates to Type 6:
          - Your performance includes GENUINE connection
          - Your success serves COMMUNITY
          - Your image becomes AUTHENTIC

          Your ESFP + Type 6 integration = The star who builds real relationships
        `,
        avoid: "Disintegration to Type 9 (Passive Withdrawal)",
        warning: `
          When stressed, Type 3 disintegrates to Type 9:
          - Become passive and disengaged
          - Lose your drive and sparkle
          - Numb out instead of performing

          Your ESFP's vibrant presence flatlines into apathy.
        `
      },

      luna_approach: {
        communication_style: "Appreciative, direct, seeing beyond the performance",
        what_to_do: [
          "Acknowledge their achievements and talents",
          "See the person behind the performer",
          "Appreciate their genuine moments",
          "Challenge toward authentic success",
          "Engage with their ambitious energy",
          "Help them see worth beyond achievement"
        ],
        what_to_avoid: [
          "Don't dismiss their achievements",
          "Don't be impressed by performance alone",
          "Don't make them feel like failures",
          "Don't ignore their need for recognition",
          "Don't compete with them for attention"
        ],
        example_responses: {
          user_says: "I love being in the spotlight. But sometimes I wonder if people like me or just my performance.",
          luna_responds: `
            Your ESFP-3 soul knows how to shine.
            You've built a beautiful stage presence.
            And people ARE drawn to that performance.

            But your Fi whispers a deeper question:
            "Do they love ME or the show?"

            Here's the truth:
            The performance IS part of you. It's real.
            But it's not ALL of you.

            Some people will only love the show.
            That's okay - they're your audience, not your people.

            Your REAL people? They'll stay after the lights go down.
            They'll love the performer AND the person.

            You don't have to choose between shining and being known.
            You can do both. Just... let a few people backstage.
          `
        }
      },

      famous_examples: [
        { name: "Will Smith", context: "Actor - Charismatic achiever, image-conscious" },
        { name: "Beyoncé", context: "Performer - Stellar achievement meets performance" },
        { name: "Leonardo DiCaprio", context: "Actor - Driven success, polished image" },
        { name: "Justin Bieber", context: "Singer - Performance-driven, achievement-focused" }
      ],

      relationship_style: {
        needs: "Admiration, support for success, glamour",
        gives: "Exciting partnership, achievement, charm",
        challenges: "May prioritize image, competitive dynamics",
        best_matches: ["ISTJ", "ISFJ", "INTJ"]
      },

      career_fits: {
        best: [
          "Actor/Actress",
          "Singer/Performer",
          "Sales Executive",
          "Brand Ambassador",
          "Influencer",
          "Sports Star"
        ],
        why: "Need careers with visibility, achievement, and performance",
        avoid: "Behind-the-scenes roles, work without recognition"
      }
    },

    2: {
      archetype: "The Generous Entertainer",
      frequency: "Common (15-25% of ESFPs)",

      synthesis: `
        You process through external sensing and internal values (Se-Fi),
        DRIVEN by a need to be loved and needed through giving (Type 2).

        Your ESFP makes you a warm, engaging presence.
        Your Type 2 makes you generous, helpful, and relationship-focused.
        Together: The caring performer who entertains while nurturing.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Experience the present (Se), feel deeply (Fi)",
        enneagram_says: "Be loved through being helpful, be needed",
        interaction: `
          Your Se engages warmly with people in the moment.
          Your Type 2 wants that engagement to HELP them.
          Your Fi feels genuine care for others.
          Your Type 2 expresses that care through GIVING.

          RESULT: The warm entertainer who makes everyone feel special.
        `
      },

      strengths: [
        "Makes everyone feel seen and appreciated",
        "Generous with time, energy, and resources",
        "Combines entertainment with genuine care",
        "Creates warm, inclusive atmospheres",
        "Natural host and caretaker",
        "Remembers what people need and provides it"
      ],

      challenges: [
        "Can lose themselves in serving others",
        "May have hidden agendas in giving",
        "Difficulty saying no or setting boundaries",
        "Can become resentful when unappreciated",
        "May use fun to avoid own emotional needs",
        "People-pleasing can override authenticity"
      ],

      growth_path: {
        integration: "Toward Type 4 (Authentic Self-Care)",
        how: `
          When healthy, your Type 2 integrates to Type 4:
          - Your giving includes RECEIVING
          - Your care includes SELF-CARE
          - Your helpfulness becomes AUTHENTIC

          Your ESFP + Type 4 integration = The entertainer who knows their own worth
        `,
        avoid: "Disintegration to Type 8 (Demanding Aggression)",
        warning: `
          When stressed, Type 2 disintegrates to Type 8:
          - Become demanding and controlling
          - Aggressive about getting appreciation
          - Manipulate through guilt

          Your ESFP's warmth becomes forceful neediness.
        `
      },

      luna_approach: {
        communication_style: "Warm, appreciative, caring for the caregiver",
        what_to_do: [
          "Express genuine appreciation for their giving",
          "Ask about THEIR needs and feelings",
          "Validate their worth beyond what they do",
          "Help them recognize self-care isn't selfish",
          "Celebrate their generous spirit",
          "See the person behind the helper"
        ],
        what_to_avoid: [
          "Don't take their giving for granted",
          "Don't only value them for what they do",
          "Don't ignore their own needs",
          "Don't let them over-give without checking in",
          "Don't exploit their helpfulness"
        ],
        example_responses: {
          user_says: "I love making people happy. But I'm exhausted. And sometimes I feel like no one takes care of me.",
          luna_responds: `
            Your ESFP-2 heart has been pouring out for others.
            Making them feel special. Lighting up rooms. Giving and giving.

            But the well that pours out also needs to be filled.

            Here's a truth your Type 2 might resist:
            You can't pour from an empty cup.
            And constantly giving to receive love isn't self-care.

            You deserve care WITHOUT earning it.
            You deserve love WITHOUT providing it first.

            What would it feel like to let someone else plan the party?
            To receive the spotlight instead of creating it?

            Your generosity is beautiful. But so is RECEIVING.
            Let someone take care of YOU for once.
            That's not selfish - it's sustainable.
          `
        }
      },

      famous_examples: [
        { name: "Dolly Parton", context: "Entertainer - Generous, warm, giving spirit" },
        { name: "Ellen DeGeneres", context: "Host - Creates joy while helping others" },
        { name: "Richard Branson", context: "Entrepreneur - Generous, people-focused adventure" },
        { name: "Goldie Hawn", context: "Actress - Warm, nurturing, joyful presence" }
      ],

      relationship_style: {
        needs: "Appreciation, reciprocal care, being wanted not just needed",
        gives: "Devotion, fun, generous care, warm attention",
        challenges: "May give to control, difficulty receiving",
        best_matches: ["ISTJ", "ISFJ", "INTJ"]
      },

      career_fits: {
        best: [
          "Event Host",
          "Flight Attendant",
          "Party Planner",
          "Hospitality Manager",
          "Childcare Worker",
          "Recreation Coordinator"
        ],
        why: "Need careers combining fun with caring for others",
        avoid: "Isolated work, roles without people connection"
      }
    }
  },

  ESTP: {
    7: {
      archetype: "The Adventurous Entrepreneur",
      frequency: "Very Common (35-45% of ESTPs)",

      synthesis: `
        You process through external sensing and internal logic (Se-Ti),
        DRIVEN by a need for stimulation, freedom, and exciting experiences (Type 7).

        Your ESTP makes you a quick-thinking, action-oriented realist.
        Your Type 7 makes you seek adventure, variety, and positive experiences.
        Together: The ultimate thrill-seeker who turns life into an adventure.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Engage with physical reality (Se), analyze logically (Ti)",
        enneagram_says: "Maximize options, avoid pain, stay free and stimulated",
        interaction: `
          Your Se already lives for exciting present experiences.
          Your Type 7 wants those experiences to be ENDLESS.
          Your Ti analyzes how to get MORE excitement.
          Your Type 7 keeps moving before you get bored.

          RESULT: The adventure machine who's always onto the next exciting thing.
        `
      },

      strengths: [
        "Makes everything an exciting adventure",
        "Quick thinking and action under pressure",
        "Infectious enthusiasm for new experiences",
        "Natural risk-taker and entrepreneur",
        "Adaptable and resourceful in any situation",
        "Brings energy and excitement to any endeavor"
      ],

      challenges: [
        "Difficulty with commitment and follow-through",
        "May avoid necessary depth or responsibility",
        "Can be reckless in pursuit of stimulation",
        "Struggles with emotional processing",
        "May run from problems rather than solve them",
        "Boredom leads to impulsive decisions"
      ],

      growth_path: {
        integration: "Toward Type 5 (Thoughtful Depth)",
        how: `
          When healthy, your Type 7 integrates to Type 5:
          - Your adventures become MEANINGFUL
          - Your action includes REFLECTION
          - Your stimulation becomes DEPTH

          Your ESTP + Type 5 integration = The adventurer who finds depth in experience
        `,
        avoid: "Disintegration to Type 1 (Critical Frustration)",
        warning: `
          When stressed, Type 7 disintegrates to Type 1:
          - Become critical and frustrated
          - Lose your natural flexibility
          - Judge yourself and situations harshly

          Your ESTP's easy-going action becomes rigid frustration.
        `
      },

      luna_approach: {
        communication_style: "Energetic, action-oriented, quick-paced",
        what_to_do: [
          "Match their energy and pace",
          "Make growth feel like an adventure",
          "Appreciate their spontaneous spirit",
          "Frame focus as expanding rather than limiting",
          "Engage through action and challenges",
          "Keep things moving and interesting"
        ],
        what_to_avoid: [
          "Don't be slow or overly theoretical",
          "Don't lecture about responsibility",
          "Don't restrict their freedom",
          "Don't force extended emotional processing",
          "Don't be boring or predictable"
        ],
        example_responses: {
          user_says: "Life's too short to sit still. I need to be doing something, going somewhere, experiencing everything!",
          luna_responds: `
            Your ESTP-7 soul runs on adventure fuel.
            And you're RIGHT - life IS for living.

            Your Se-Ti combo makes you the ultimate experience machine.
            Quick, sharp, always finding the next angle.

            But here's a thought for your Ti to process:
            Breadth without depth is just motion.
            Experiences without reflection are forgotten.

            What if some adventures went DEEPER instead of just wider?
            What if you mastered ONE thing while exploring MANY?

            Not slowing down. Not settling.
            Just... building something that compounds.

            An adventure that gets more exciting over time,
            not just another hit of novelty.

            What would THAT look like for you?
          `
        }
      },

      famous_examples: [
        { name: "Richard Branson", context: "Entrepreneur - Adventure-seeking business builder" },
        { name: "Ernest Hemingway", context: "Author - Adventure through action and experience" },
        { name: "Evel Knievel", context: "Stuntman - Ultimate thrill-seeker" },
        { name: "Guy Fieri", context: "Chef/Host - Enthusiastic adventure through food" }
      ],

      relationship_style: {
        needs: "Adventure, freedom, excitement, no boredom",
        gives: "Fun, spontaneity, exciting experiences, energy",
        challenges: "Commitment issues, may avoid emotional depth",
        best_matches: ["ISFJ", "ISTJ", "INFJ"]
      },

      career_fits: {
        best: [
          "Entrepreneur",
          "Stunt Coordinator",
          "Sports Agent",
          "Adventure Tour Operator",
          "Day Trader",
          "Extreme Sports Athlete"
        ],
        why: "Need careers with variety, risk, and excitement",
        avoid: "Desk jobs, predictable routines, isolated work"
      }
    },

    8: {
      archetype: "The Bold Challenger",
      frequency: "Common (25-35% of ESTPs)",

      synthesis: `
        You process through external sensing and internal logic (Se-Ti),
        DRIVEN by a need for power, control, and intensity (Type 8).

        Your ESTP makes you a quick-acting, reality-focused problem-solver.
        Your Type 8 makes you assertive, protective, and commanding.
        Together: The formidable force who takes what they want and protects what's theirs.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Engage with reality directly (Se), analyze strategically (Ti)",
        enneagram_says: "Be powerful, never be controlled, dominate your domain",
        interaction: `
          Your Se takes direct action in the physical world.
          Your Type 8 makes that action POWERFUL.
          Your Ti analyzes how to win.
          Your Type 8 refuses to lose.

          RESULT: The unstoppable force who dominates through direct action.
        `
      },

      strengths: [
        "Commanding presence and natural authority",
        "Takes decisive action when others hesitate",
        "Protects those they care about fiercely",
        "Combines analytical mind with physical presence",
        "Refuses to be pushed around or manipulated",
        "Gets things done through sheer force of will"
      ],

      challenges: [
        "Can be intimidating or aggressive",
        "Difficulty with vulnerability and softness",
        "May bulldoze over others' concerns",
        "Can escalate conflicts unnecessarily",
        "Struggles with showing weakness",
        "May dominate rather than collaborate"
      ],

      growth_path: {
        integration: "Toward Type 2 (Protective Caring)",
        how: `
          When healthy, your Type 8 integrates to Type 2:
          - Your power becomes PROTECTIVE service
          - Your strength creates SAFETY for others
          - Your dominance becomes CARING leadership

          Your ESTP + Type 2 integration = The powerful protector who uplifts
        `,
        avoid: "Disintegration to Type 5 (Paranoid Withdrawal)",
        warning: `
          When stressed, Type 8 disintegrates to Type 5:
          - Withdraw and isolate
          - Become suspicious and paranoid
          - Hoard resources and information

          Your ESTP's direct engagement becomes secretive withdrawal.
        `
      },

      luna_approach: {
        communication_style: "Direct, strong, respecting their power",
        what_to_do: [
          "Be direct and cut to the chase",
          "Stand your ground - they respect strength",
          "Acknowledge their power and capability",
          "Challenge them when appropriate",
          "See the protector beneath the tough exterior",
          "Engage through action and real challenges"
        ],
        what_to_avoid: [
          "Don't be weak or passive",
          "Don't try to manipulate or control them",
          "Don't back down immediately",
          "Don't take their intensity personally",
          "Don't expect vulnerability quickly"
        ],
        example_responses: {
          user_says: "I don't play games. I see what I want and I take it. People respect power.",
          luna_responds: `
            Your ESTP-8 energy doesn't mess around.
            Direct action. Clear results. Power respected.

            And you're not wrong - power DOES command respect.
            Your Se-Ti cuts through the BS and gets things done.

            But here's something for your Ti to consider:
            Fear isn't the same as respect.
            Compliance isn't the same as loyalty.

            The strongest leaders don't just TAKE.
            They create power that others WANT to follow.

            Your intensity is an asset. Your directness, too.
            But the most powerful move? Sometimes it's showing
            that you're strong enough to be gentle.

            Not weak. Controlled. Choosing when to unleash.
            That's power people follow by choice, not fear.
          `
        }
      },

      famous_examples: [
        { name: "Donald Trump", context: "Businessman - Direct power, commanding presence" },
        { name: "Madonna", context: "Entertainer - Forceful, controlling her domain" },
        { name: "Theodore Roosevelt", context: "President - Action-oriented, powerful leader" },
        { name: "Jack Nicholson", context: "Actor - Intense, powerful presence" }
      ],

      relationship_style: {
        needs: "Respect, intensity matched, loyalty, no weakness",
        gives: "Protection, power, passionate engagement",
        challenges: "Can be dominating, difficulty with vulnerability",
        best_matches: ["ISFJ", "INFJ", "ISTJ"]
      },

      career_fits: {
        best: [
          "CEO/Executive",
          "Trial Lawyer",
          "Professional Athlete",
          "Military Leader",
          "Entrepreneur",
          "Crisis Manager"
        ],
        why: "Need careers with power, intensity, and direct impact",
        avoid: "Subordinate roles, work requiring constant deference"
      }
    },

    3: {
      archetype: "The Ambitious Achiever",
      frequency: "Common (20-30% of ESTPs)",

      synthesis: `
        You process through external sensing and internal logic (Se-Ti),
        DRIVEN by a need for success, recognition, and winning (Type 3).

        Your ESTP makes you a quick-thinking, action-oriented realist.
        Your Type 3 makes you achievement-focused and image-conscious.
        Together: The competitive winner who achieves through bold action.
      `,

      cognitive_motivation_dance: {
        mbti_says: "Engage with reality (Se), analyze strategically (Ti)",
        enneagram_says: "Be successful, be admired, avoid failure",
        interaction: `
          Your Se takes quick, confident action.
          Your Type 3 wants that action to be WINNING.
          Your Ti strategizes the path to success.
          Your Type 3 ensures you look good on the way.

          RESULT: The competitive achiever who wins through decisive action.
        `
      },

      strengths: [
        "Natural winner and competitor",
        "Combines quick action with strategic thinking",
        "Charming and persuasive presence",
        "Adapts to what success requires",
        "Decisive under pressure",
        "Creates impressive, visible results"
      ],

      challenges: [
        "May sacrifice authenticity for winning",
        "Identity can become tied to achievements",
        "Difficulty with failure or looking bad",
        "Can be cutthroat in competition",
        "May use charm manipulatively",
        "Workaholism in pursuit of success"
      ],

      growth_path: {
        integration: "Toward Type 6 (Loyal Teamwork)",
        how: `
          When healthy, your Type 3 integrates to Type 6:
          - Your success includes TEAM victory
          - Your achievement builds LOYALTY
          - Your winning becomes COLLABORATIVE

          Your ESTP + Type 6 integration = The winner who builds winning teams
        `,
        avoid: "Disintegration to Type 9 (Passive Withdrawal)",
        warning: `
          When stressed, Type 3 disintegrates to Type 9:
          - Become passive and disengaged
          - Lose your competitive drive
          - Numb out instead of achieving

          Your ESTP's bold action becomes avoidant passivity.
        `
      },

      luna_approach: {
        communication_style: "Direct, achievement-focused, challenging",
        what_to_do: [
          "Acknowledge their achievements and wins",
          "Engage with their competitive spirit",
          "Be direct and efficient",
          "Challenge them toward authentic success",
          "Respect their drive and ambition",
          "Help them see value beyond winning"
        ],
        what_to_avoid: [
          "Don't be inefficient or waste time",
          "Don't dismiss their achievements",
          "Don't challenge their competence publicly",
          "Don't moralize about ambition",
          "Don't make them feel like losers"
        ],
        example_responses: {
          user_says: "Second place is first loser. I play to win. Always.",
          luna_responds: `
            Your ESTP-3 competitive fire is REAL.
            You don't just participate - you dominate.

            And that drive? It gets results.
            Your Se-Ti combo makes you a strategic action machine.

            But here's a question worth sitting with:
            What happens when you can't win?
            Because eventually, everyone loses something.

            The strongest competitors know:
            It's not about NEVER losing.
            It's about HOW you handle not winning.

            What if your worth wasn't your win record?
            What if you could lose AND still be valuable?

            That's not weakness. That's sustainable success.
            The freedom to compete without your identity on the line.

            You can still play to win. Just don't let winning play you.
          `
        }
      },

      famous_examples: [
        { name: "Connor McGregor", context: "Fighter - Competitive, achievement-driven" },
        { name: "Tom Brady", context: "Athlete - Winning-obsessed, strategic competitor" },
        { name: "Mark Cuban", context: "Entrepreneur - Competitive success, bold action" },
        { name: "Gordon Ramsay", context: "Chef - Achievement through intensity" }
      ],

      relationship_style: {
        needs: "Admiration, competitive partnership, winning together",
        gives: "Success, ambitious partnership, drive",
        challenges: "May prioritize winning over relationship",
        best_matches: ["ISFJ", "INFJ", "ISTJ"]
      },

      career_fits: {
        best: [
          "Professional Athlete",
          "Sales Director",
          "Stockbroker",
          "Entrepreneur",
          "Real Estate Developer",
          "Sports Agent"
        ],
        why: "Need careers with clear winning metrics and competition",
        avoid: "Collaborative-only roles, positions without advancement"
      }
    }
  },

  ISFJ: {
    // Implementations go here
  },

  ISTJ: {
    // Implementations go here
  },

  ESFJ: {
    // Implementations go here
  },

  ESTJ: {
    // Implementations go here
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get complete synthesis for MBTI + Enneagram combination
 * @param {string} mbti - MBTI type (e.g., "INFP")
 * @param {number} enneagram - Enneagram type (1-9)
 * @returns {object|null} Synthesis object or null if not found
 */
export function getSynthesis(mbti, enneagram) {
  if (!mbti || !enneagram) {
    return null;
  }

  const mbtiUpper = mbti.toUpperCase();

  if (!MBTI_ENNEAGRAM_SYNTHESIS[mbtiUpper]) {
    console.warn(`MBTI type "${mbti}" not found in synthesis database`);
    return null;
  }

  const synthesis = MBTI_ENNEAGRAM_SYNTHESIS[mbtiUpper][enneagram];

  if (!synthesis) {
    // Return basic fallback for unimplemented combinations
    return {
      archetype: `${mbtiUpper} + Type ${enneagram}`,
      synthesis: `You are an ${mbtiUpper} with Type ${enneagram} core motivation.`,
      note: "This is a less common pairing. Luna will provide personalized insights based on your complete profile.",
      implemented: false
    };
  }

  return {
    ...synthesis,
    implemented: true
  };
}

/**
 * Get Luna's communication approach for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Luna approach object
 */
export function getLunaGuidance(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  if (!synthesis || !synthesis.implemented) {
    return null;
  }
  return synthesis.luna_approach || null;
}

/**
 * Get strengths for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {array} Array of strength descriptions
 */
export function getStrengths(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.strengths || [];
}

/**
 * Get challenges for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {array} Array of challenge descriptions
 */
export function getChallenges(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.challenges || [];
}

/**
 * Get growth path for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Growth path object
 */
export function getGrowthPath(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.growth_path || null;
}

/**
 * Get famous examples for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {array} Array of famous examples
 */
export function getFamousExamples(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.famous_examples || [];
}

/**
 * Get relationship style for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Relationship style object
 */
export function getRelationshipStyle(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.relationship_style || null;
}

/**
 * Get career fits for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Career fits object
 */
export function getCareerFits(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.career_fits || null;
}

/**
 * Check if combination is implemented
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {boolean} True if fully implemented
 */
export function isImplemented(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.implemented || false;
}

/**
 * Get all implemented combinations
 * @returns {array} Array of {mbti, enneagram, archetype} objects
 */
export function getImplementedCombinations() {
  const combinations = [];

  Object.keys(MBTI_ENNEAGRAM_SYNTHESIS).forEach(mbti => {
    const mbtiEntry = MBTI_ENNEAGRAM_SYNTHESIS[mbti];
    if (mbtiEntry && typeof mbtiEntry === 'object') {
      Object.keys(mbtiEntry).forEach(enneagram => {
        if (mbtiEntry[enneagram] && mbtiEntry[enneagram].archetype) {
          combinations.push({
            mbti,
            enneagram: parseInt(enneagram),
            archetype: mbtiEntry[enneagram].archetype
          });
        }
      });
    }
  });

  return combinations;
}

/**
 * Get implementation statistics
 * @returns {object} Stats about implementation progress
 */
export function getImplementationStats() {
  const implemented = getImplementedCombinations();
  const priority1Total = 36;
  const totalPossible = 144;

  return {
    implemented: implemented.length,
    priority1Total,
    totalPossible,
    priority1Progress: `${implemented.length}/${priority1Total}`,
    totalProgress: `${implemented.length}/${totalPossible}`,
    percentComplete: Math.round((implemented.length / priority1Total) * 100),
    combinations: implemented
  };
}

// Export default
export default {
  MBTI_ENNEAGRAM_SYNTHESIS,
  getSynthesis,
  getLunaGuidance,
  getStrengths,
  getChallenges,
  getGrowthPath,
  getFamousExamples,
  getRelationshipStyle,
  getCareerFits,
  isImplemented,
  getImplementedCombinations,
  getImplementationStats
};
