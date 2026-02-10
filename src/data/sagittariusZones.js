// Sagittarius Zone Database
// Complete data structure for all 6 zones across the 30° Sagittarius spectrum
// Fire Sign: Adventurous, philosophical, optimistic, freedom-loving
// Ruled by Jupiter: Expansion, wisdom, optimism, adventure, luck

export const sagittariusZones = [
  {
    id: 1,
    name: "The Philosophical Transformer",
    archetype: "The Philosophical Warrior",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 240,
      absoluteEnd: 244.99
    },
    dateRange: {
      start: "November 22",
      end: "November 26",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Jupiter",
      subRuler: "Jupiter",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Scorpio",
        type: "Cusp Bleed",
        planet: "Pluto",
        percentage: 25,
        traits: ["Transformative depth", "Emotional intensity", "Psychological insight", "Strategic power", "Regeneration"]
      },
      {
        source: "Sagittarius",
        type: "Core",
        planet: "Jupiter",
        percentage: 75,
        traits: ["Expansive wisdom", "Adventurous spirit", "Philosophical depth", "Optimistic vision", "Truth-seeking"]
      }
    ],
    qualities: {
      adventurousness: { level: 85, label: "Very High", icon: "🏹🏹🏹🏹" },
      philosophicalDepth: { level: 90, label: "Very High", icon: "📚📚📚📚📚" },
      optimism: { level: 80, label: "High", icon: "☀️☀️☀️☀️" },
      honesty: { level: 85, label: "Very High", icon: "🎯🎯🎯🎯" },
      freedomLove: { level: 80, label: "High", icon: "🦅🦅🦅🦅" },
      restlessness: { level: 80, label: "High", icon: "🌪️🌪️🌪️🌪️" },
      teachingAbility: { level: 85, label: "Very High", icon: "🎓🎓🎓🎓" },
      bigPictureThinking: { level: 85, label: "Very High", icon: "🔭🔭🔭🔭" },
      speed: { level: 80, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 85, label: "Very High", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Deep philosophical wisdom with transformative edge",
      "Transforms through adventurous exploration",
      "Passionate truth-seeking with psychological depth",
      "Combines Scorpio depth with Sagittarian expansion"
    ],
    shadows: [
      "Preachy about transformation and shadow work",
      "Intense philosophical debates that alienate others",
      "Commitment issues despite deep engagement",
      "Blunt about psychological truths others aren't ready to hear"
    ],
    careerSignatures: [
      "Philosophy Professor",
      "Transformational Speaker",
      "Depth Psychology Researcher",
      "Adventure Therapist",
      "Documentary Filmmaker"
    ],
    relationshipStyle: {
      pursuit: "Intense philosophical seduction — seeks soul-level truth",
      commitmentSpeed: "Slow — torn between depth and freedom",
      passion: "Philosophically intense, transformative love",
      conflict: "Confronts with truth, then escapes for perspective",
      jealousy: "Moderate — freedom-seeking softens possessiveness"
    },
    famousExamples: [
      {
        name: "Bruce Lee",
        birthdate: "November 27",
        degree: "~2.13° Sagittarius",
        notes: "Philosophical martial artist"
      },
      {
        name: "Jimi Hendrix",
        birthdate: "November 27",
        degree: "~4.27° Sagittarius",
        notes: "Transformative musical exploration"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "Retired army veterans gather to reawaken old memories",
      interpretation: "At the Scorpio-Sagittarius cusp, transformative warrior experiences become philosophical wisdom to be shared and taught."
    },
    nakshatra: {
      name: "Mula",
      range: "0° - 13°20' Sagittarius (sidereal)",
      ruler: "Ketu",
      symbol: "Tied Bunch of Roots / Lion's Tail",
      deity: "Nirriti (Goddess of Destruction)",
      qualities: ["Root investigation", "Philosophical destruction and rebuilding", "Deep truth-seeking"]
    },
    colorTheme: {
      primary: "#9B59B6",
      secondary: "#8E44AD",
      gradient: "linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Explorer",
    archetype: "The Eternal Explorer",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 245,
      absoluteEnd: 249.99
    },
    dateRange: {
      start: "November 27",
      end: "December 1",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Jupiter",
      subRuler: "Jupiter",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Sagittarius",
        type: "Core",
        planet: "Jupiter",
        percentage: 100,
        traits: ["Maximum adventure", "Boundless optimism", "Ultimate truth-seeking", "Philosophical freedom", "Expansive generosity"]
      }
    ],
    qualities: {
      adventurousness: { level: 100, label: "Maximum", icon: "🏹🏹🏹🏹🏹" },
      philosophicalDepth: { level: 100, label: "Maximum", icon: "📚📚📚📚📚" },
      optimism: { level: 100, label: "Maximum", icon: "☀️☀️☀️☀️☀️" },
      honesty: { level: 100, label: "Maximum", icon: "🎯🎯🎯🎯🎯" },
      freedomLove: { level: 100, label: "Maximum", icon: "🦅🦅🦅🦅🦅" },
      restlessness: { level: 100, label: "Maximum", icon: "🌪️🌪️🌪️🌪️🌪️" },
      teachingAbility: { level: 100, label: "Maximum", icon: "🎓🎓🎓🎓🎓" },
      bigPictureThinking: { level: 100, label: "Maximum", icon: "🔭🔭🔭🔭🔭" },
      speed: { level: 95, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 95, label: "Very High", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Infinite optimism and boundless enthusiasm",
      "Visionary philosophical insights that inspire all",
      "Generosity of spirit — gives abundantly",
      "Finds truth through fearless exploration"
    ],
    shadows: [
      "Cannot commit to anything — always seeking the next horizon",
      "Brutally tactless honesty that wounds others",
      "Overcommits then disappears without warning",
      "Misses important details while chasing the big picture"
    ],
    careerSignatures: [
      "Travel Writer",
      "University Professor",
      "Motivational Speaker",
      "International Correspondent",
      "Wilderness Guide"
    ],
    relationshipStyle: {
      pursuit: "Enthusiastic and direct — sweeps you into adventure",
      commitmentSpeed: "Very slow — freedom is non-negotiable",
      passion: "Exhilarating, joyful, expansive love",
      conflict: "Laughs it off or disappears on a trip",
      jealousy: "Very low — possessiveness is incomprehensible"
    },
    famousExamples: [
      {
        name: "Brad Pitt",
        birthdate: "December 18",
        degree: "~6.51° Sagittarius",
        notes: "Adventurous, freedom-loving, philosophical"
      },
      {
        name: "Taylor Swift",
        birthdate: "December 13",
        degree: "~8.46° Sagittarius",
        notes: "Optimistic storytelling, adventurous creativity"
      }
    ],
    sabianSymbol: {
      degree: 7,
      symbol: "Cupid knocking at the door of a human heart",
      interpretation: "Pure Sagittarius energy — the arrow of truth and love seeks its target with boundless optimism and philosophical joy."
    },
    nakshatra: {
      name: "Mula",
      range: "0° - 13°20' Sagittarius (sidereal)",
      ruler: "Ketu",
      symbol: "Tied Bunch of Roots / Lion's Tail",
      deity: "Nirriti (Goddess of Destruction)",
      qualities: ["Fearless exploration", "Root-level truth", "Expansive investigation"]
    },
    colorTheme: {
      primary: "#E67E22",
      secondary: "#D35400",
      gradient: "linear-gradient(135deg, #E67E22 0%, #D35400 100%)"
    }
  },

  {
    id: 3,
    name: "The Visionary Leader",
    archetype: "The Courageous Prophet",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 250,
      absoluteEnd: 254.99
    },
    dateRange: {
      start: "December 2",
      end: "December 6",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Cardinal Fire)",
      primaryRuler: "Jupiter",
      subRuler: "Mars",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Sagittarius",
        type: "Core",
        planet: "Jupiter",
        percentage: 70,
        traits: ["Expansive vision", "Philosophical adventure", "Optimism", "Truth-seeking", "Big picture"]
      },
      {
        source: "Aries",
        type: "Decan Blend",
        planet: "Mars",
        percentage: 30,
        traits: ["Warrior courage", "Pioneering action", "Fearless leadership", "Competitive drive", "Direct honesty"]
      }
    ],
    qualities: {
      adventurousness: { level: 95, label: "Very High", icon: "🏹🏹🏹🏹🏹" },
      philosophicalDepth: { level: 85, label: "Very High", icon: "📚📚📚📚" },
      optimism: { level: 95, label: "Very High", icon: "☀️☀️☀️☀️☀️" },
      honesty: { level: 90, label: "Very High", icon: "🎯🎯🎯🎯🎯" },
      freedomLove: { level: 95, label: "Very High", icon: "🦅🦅🦅🦅🦅" },
      restlessness: { level: 95, label: "Very High", icon: "🌪️🌪️🌪️🌪️🌪️" },
      teachingAbility: { level: 85, label: "Very High", icon: "🎓🎓🎓🎓" },
      bigPictureThinking: { level: 90, label: "Very High", icon: "🔭🔭🔭🔭🔭" },
      speed: { level: 100, label: "Maximum", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 100, label: "Maximum", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Fearless visionary action — pioneers new philosophies",
      "Inspires through courage and direct leadership",
      "Conquers new intellectual frontiers",
      "Direct honest communication that cuts to truth"
    ],
    shadows: [
      "Recklessly impulsive — acts before thinking",
      "Aggressive about beliefs and philosophical positions",
      "Starts everything, finishes nothing",
      "Cannot tolerate opposition or disagreement"
    ],
    careerSignatures: [
      "Visionary Filmmaker",
      "Startup Founder",
      "Adventure Sports Leader",
      "Political Visionary",
      "Pioneering Researcher"
    ],
    relationshipStyle: {
      pursuit: "Bold and direct — charges in with passion",
      commitmentSpeed: "Fast to start, quick to lose interest",
      passion: "Fiery, courageous, inspires partner to explore",
      conflict: "Fights directly then moves on instantly",
      jealousy: "Low — too busy pioneering to be possessive"
    },
    famousExamples: [
      {
        name: "Steven Spielberg",
        birthdate: "December 18",
        degree: "~11.37° Sagittarius",
        notes: "Visionary pioneering filmmaker"
      },
      {
        name: "Billie Eilish",
        birthdate: "December 18",
        degree: "~13.42° Sagittarius",
        notes: "Pioneering musical vision"
      }
    ],
    sabianSymbol: {
      degree: 12,
      symbol: "A flag that turns into an eagle that crows",
      interpretation: "Aries-Mars energy transforms Sagittarian ideals into fearless action. The philosophical vision becomes a living, soaring reality."
    },
    nakshatra: {
      name: "Purva Ashadha",
      range: "13°20' - 26°40' Sagittarius (sidereal)",
      ruler: "Venus",
      symbol: "Fan / Winnowing Basket",
      deity: "Apas (Water God)",
      qualities: ["Invincible courage", "Pioneering victory", "Unstoppable vision"]
    },
    colorTheme: {
      primary: "#E74C3C",
      secondary: "#C0392B",
      gradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)"
    }
  },

  {
    id: 4,
    name: "The Revolutionary Teacher",
    archetype: "The Freedom Fighter",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 255,
      absoluteEnd: 259.99
    },
    dateRange: {
      start: "December 7",
      end: "December 11",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Cardinal Fire)",
      primaryRuler: "Jupiter",
      subRuler: "Mars",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Sagittarius",
        type: "Core",
        planet: "Jupiter",
        percentage: 60,
        traits: ["Expansive teaching", "Philosophical vision", "Revolutionary wisdom", "Cultural impact", "Freedom mission"]
      },
      {
        source: "Aries",
        type: "Decan Peak",
        planet: "Mars",
        percentage: 40,
        traits: ["Revolutionary action", "Warrior courage", "Fearless confrontation", "Mission-driven intensity", "Cultural combat"]
      }
    ],
    qualities: {
      adventurousness: { level: 90, label: "Very High", icon: "🏹🏹🏹🏹🏹" },
      philosophicalDepth: { level: 95, label: "Very High", icon: "📚📚📚📚📚" },
      optimism: { level: 90, label: "Very High", icon: "☀️☀️☀️☀️☀️" },
      honesty: { level: 95, label: "Very High", icon: "🎯🎯🎯🎯🎯" },
      freedomLove: { level: 100, label: "Maximum", icon: "🦅🦅🦅🦅🦅" },
      restlessness: { level: 90, label: "Very High", icon: "🌪️🌪️🌪️🌪️🌪️" },
      teachingAbility: { level: 100, label: "Maximum", icon: "🎓🎓🎓🎓🎓" },
      bigPictureThinking: { level: 95, label: "Very High", icon: "🔭🔭🔭🔭🔭" },
      speed: { level: 95, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 100, label: "Maximum", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Revolutionary philosophical vision that transforms culture",
      "Fearless truth warrior — fights for what's right",
      "Inspires mass movements and paradigm shifts",
      "Ultimate freedom fighter through teaching"
    ],
    shadows: [
      "Reckless revolutionary action without consequences",
      "Preachy warrior complex — always knows best",
      "Cannot tolerate disagreement or nuance",
      "Burns out from relentless intensity"
    ],
    careerSignatures: [
      "Revolutionary Activist",
      "Cultural Critic",
      "Liberation Theologian",
      "Investigative Journalist",
      "Freedom Movement Leader"
    ],
    relationshipStyle: {
      pursuit: "Mission-driven passion — love as revolution",
      commitmentSpeed: "Fast when aligned, gone when restricted",
      passion: "Revolutionary, transformative, freedom-based",
      conflict: "Fights passionately for principles",
      jealousy: "Very low — freedom is everything"
    },
    famousExamples: [
      {
        name: "Jane Fonda",
        birthdate: "December 21",
        degree: "~16.23° Sagittarius",
        notes: "Revolutionary activist teacher"
      },
      {
        name: "Jay-Z",
        birthdate: "December 4",
        degree: "~18.15° Sagittarius",
        notes: "Cultural revolutionary vision"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "An Easter sunrise service draws a large crowd",
      interpretation: "Peak Mars-Jupiter fusion — revolutionary teaching draws followers through fearless philosophical truth and spiritual liberation."
    },
    nakshatra: {
      name: "Purva Ashadha",
      range: "13°20' - 26°40' Sagittarius (sidereal)",
      ruler: "Venus",
      symbol: "Fan / Winnowing Basket",
      deity: "Apas (Water God)",
      qualities: ["Revolutionary teaching", "Invincible truth", "Cultural transformation"]
    },
    colorTheme: {
      primary: "#FF6347",
      secondary: "#DC143C",
      gradient: "linear-gradient(135deg, #FF6347 0%, #DC143C 100%)"
    }
  },

  {
    id: 5,
    name: "The Wild Optimist",
    archetype: "The Joyful Sage",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 260,
      absoluteEnd: 264.99
    },
    dateRange: {
      start: "December 12",
      end: "December 16",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Fixed Fire)",
      primaryRuler: "Jupiter",
      subRuler: "Sun",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Sagittarius",
        type: "Core",
        planet: "Jupiter",
        percentage: 70,
        traits: ["Expansive optimism", "Philosophical joy", "Adventurous teaching", "Generosity", "Big-picture vision"]
      },
      {
        source: "Leo",
        type: "Decan Blend",
        planet: "Sun",
        percentage: 30,
        traits: ["Creative confidence", "Charismatic presence", "Generous heart", "Dramatic expression", "Natural performer"]
      }
    ],
    qualities: {
      adventurousness: { level: 90, label: "Very High", icon: "🏹🏹🏹🏹🏹" },
      philosophicalDepth: { level: 80, label: "High", icon: "📚📚📚📚" },
      optimism: { level: 100, label: "Maximum", icon: "☀️☀️☀️☀️☀️" },
      honesty: { level: 85, label: "Very High", icon: "🎯🎯🎯🎯" },
      freedomLove: { level: 90, label: "Very High", icon: "🦅🦅🦅🦅🦅" },
      restlessness: { level: 85, label: "Very High", icon: "🌪️🌪️🌪️🌪️" },
      teachingAbility: { level: 90, label: "Very High", icon: "🎓🎓🎓🎓🎓" },
      bigPictureThinking: { level: 85, label: "Very High", icon: "🔭🔭🔭🔭" },
      speed: { level: 90, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 90, label: "Very High", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Boundless optimistic energy that uplifts everyone",
      "Charismatic inspiring teacher with dramatic flair",
      "Generously shares wisdom and resources",
      "Joyful adventurous spirit that's infectious"
    ],
    shadows: [
      "Overestimates everything — unrealistic promises",
      "Needs constant admiration and attention",
      "Dramatic exaggeration of every experience",
      "Commits enthusiastically then flees when bored"
    ],
    careerSignatures: [
      "Entertainment Producer",
      "Charismatic Teacher",
      "Creative Director",
      "Inspirational Coach",
      "Festival Organizer"
    ],
    relationshipStyle: {
      pursuit: "Grand romantic gestures — sweeps partner off feet",
      commitmentSpeed: "Fast enthusiasm, slow to actual commitment",
      passion: "Joyful, dramatic, generous, fun-loving",
      conflict: "Laughs it off or throws a dramatic scene",
      jealousy: "Low — too confident to feel threatened"
    },
    famousExamples: [
      {
        name: "Samuel L. Jackson",
        birthdate: "December 21",
        degree: "~21.36° Sagittarius",
        notes: "Charismatic bold presence"
      },
      {
        name: "Christina Aguilera",
        birthdate: "December 18",
        degree: "~23.18° Sagittarius",
        notes: "Bold creative expression"
      }
    ],
    sabianSymbol: {
      degree: 22,
      symbol: "A Chinese laundry",
      interpretation: "Leo-Sun influence brings creative warmth to Sagittarian philosophy. The joyful sage transforms everyday life into celebration."
    },
    nakshatra: {
      name: "Uttara Ashadha",
      range: "26°40' Sagittarius - 10° Capricorn (sidereal)",
      ruler: "Sun",
      symbol: "Elephant's Tusk / Small Bed",
      deity: "Vishvadevas (Universal Gods)",
      qualities: ["Universal truth", "Creative leadership", "Joyful victory"]
    },
    colorTheme: {
      primary: "#F39C12",
      secondary: "#F1C40F",
      gradient: "linear-gradient(135deg, #F39C12 0%, #F1C40F 100%)"
    }
  },

  {
    id: 6,
    name: "The Ambitious Explorer",
    archetype: "The Ambitious Visionary",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 265,
      absoluteEnd: 269.99
    },
    dateRange: {
      start: "December 17",
      end: "December 21",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Fixed Fire)",
      primaryRuler: "Jupiter",
      subRuler: "Sun",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Sagittarius",
        type: "Core",
        planet: "Jupiter",
        percentage: 75,
        traits: ["Expansive vision", "Philosophical depth", "Adventurous spirit", "Truth-seeking", "Big-picture planning"]
      },
      {
        source: "Capricorn",
        type: "Cusp Bleed",
        planet: "Saturn",
        percentage: 25,
        traits: ["Strategic discipline", "Ambitious planning", "Responsible structure", "Patient execution", "Status awareness"]
      }
    ],
    qualities: {
      adventurousness: { level: 80, label: "High", icon: "🏹🏹🏹🏹" },
      philosophicalDepth: { level: 85, label: "Very High", icon: "📚📚📚📚" },
      optimism: { level: 75, label: "High", icon: "☀️☀️☀️☀️" },
      honesty: { level: 90, label: "Very High", icon: "🎯🎯🎯🎯🎯" },
      freedomLove: { level: 80, label: "High", icon: "🦅🦅🦅🦅" },
      restlessness: { level: 70, label: "Medium-High", icon: "🌪️🌪️🌪️" },
      teachingAbility: { level: 85, label: "Very High", icon: "🎓🎓🎓🎓" },
      bigPictureThinking: { level: 90, label: "Very High", icon: "🔭🔭🔭🔭🔭" },
      speed: { level: 75, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 70, label: "Medium-High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Strategic visionary planning — builds philosophical empires",
      "Disciplined adventure pursuit with lasting results",
      "Balances freedom with achievement beautifully",
      "Responsible truth-seeking that creates real impact"
    ],
    shadows: [
      "Workaholism disguised as exploration",
      "Pragmatism dampens natural enthusiasm",
      "Control issues around freedom and spontaneity",
      "Cannot purely enjoy — always goal-oriented"
    ],
    careerSignatures: [
      "Strategic Consultant",
      "Media Empire Builder",
      "University Dean",
      "International Business Leader",
      "Publishing Magnate"
    ],
    relationshipStyle: {
      pursuit: "Strategic and visionary — plans grand courtship",
      commitmentSpeed: "Medium — weighs freedom against partnership value",
      passion: "Philosophical depth with strategic warmth",
      conflict: "Strategic debate, seeks philosophical resolution",
      jealousy: "Low-moderate — Saturn adds some possessiveness"
    },
    famousExamples: [
      {
        name: "Woody Allen",
        birthdate: "December 1",
        degree: "~26.05° Sagittarius",
        notes: "Philosophical filmmaker with disciplined output"
      },
      {
        name: "Sia",
        birthdate: "December 18",
        degree: "~27.48° Sagittarius",
        notes: "Strategic creative vision"
      }
    ],
    sabianSymbol: {
      degree: 27,
      symbol: "A sculptor at his work",
      interpretation: "At the Capricorn cusp, Sagittarian vision becomes disciplined craft. The ambitious explorer builds lasting monuments to philosophical truth."
    },
    nakshatra: {
      name: "Uttara Ashadha",
      range: "26°40' Sagittarius - 10° Capricorn (sidereal)",
      ruler: "Sun",
      symbol: "Elephant's Tusk / Small Bed",
      deity: "Vishvadevas (Universal Gods)",
      qualities: ["Strategic victory", "Disciplined wisdom", "Ambitious achievement"]
    },
    colorTheme: {
      primary: "#D4A017",
      secondary: "#B8860B",
      gradient: "linear-gradient(135deg, #D4A017 0%, #B8860B 100%)"
    }
  }
];

export default sagittariusZones;
