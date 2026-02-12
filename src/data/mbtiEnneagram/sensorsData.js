/**
 * MBTI + Enneagram Synthesis Data - Sensor Types
 * ISFP, ISTP, ESFP, ESTP, ISFJ, ESFJ, ISTJ, ESTJ
 *
 * Part of GENESIS OS - Cathedral Analysis
 */

export const sensorsData = {

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
