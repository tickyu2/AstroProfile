// Leo Zone Database
// Complete data structure for all 6 zones across the 30° Leo spectrum
// Fire Sign: Creative, passionate, dramatic, regal
// Ruled by Sun: Identity, ego, vitality, self-expression, creativity

export const leoZones = [
  {
    id: 1,
    name: "The Warm Leader",
    archetype: "The Caring Star",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 120,
      absoluteEnd: 124.99
    },
    dateRange: {
      start: "July 23",
      end: "July 27",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Fixed)",
      primaryRuler: "Sun",
      subRuler: "Sun",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Cancer",
        type: "Cusp Bleed",
        planet: "Moon",
        percentage: 25,
        traits: ["Emotional warmth", "Nurturing instinct", "Intuition", "Protective care", "Sensitivity"]
      },
      {
        source: "Leo",
        type: "Core",
        planet: "Sun",
        percentage: 75,
        traits: ["Creative vitality", "Charisma", "Confidence", "Generosity", "Leadership"]
      }
    ],
    qualities: {
      creativity: { level: 85, label: "Very High", icon: "\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8" },
      charisma: { level: 80, label: "High", icon: "\u2728\u2728\u2728\u2728" },
      confidence: { level: 75, label: "High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      generosity: { level: 85, label: "Very High", icon: "\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81" },
      leadership: { level: 80, label: "High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      dramaticFlair: { level: 70, label: "High", icon: "\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD" },
      needForRecognition: { level: 75, label: "High", icon: "\u2B50\u2B50\u2B50\u2B50" },
      pride: { level: 70, label: "High", icon: "\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81" },
      loyalty: { level: 90, label: "Very High", icon: "\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B" },
      speed: { level: 70, label: "High", icon: "\u26A1\u26A1\u26A1" }
    },
    strengths: [
      "Leads with warmth and care \u2014 emotionally intelligent ruler",
      "Protects while inspiring \u2014 creates emotional safety through charisma",
      "Balances strength with sensitivity \u2014 rare combination in fire signs",
      "Emotionally intelligent performer who reads the room"
    ],
    shadows: [
      "Wounded when care isn't appreciated \u2014 needs constant validation",
      "Moody when recognition is delayed \u2014 Cancer influence creates emotional waves",
      "Can smother with protective leadership \u2014 overprotects",
      "Needs emotional validation constantly \u2014 insecure beneath confidence"
    ],
    careerSignatures: [
      "Nurturing Leader/CEO",
      "Emotional Coach",
      "Teacher-Performer",
      "Protective Manager",
      "Family Business Leader"
    ],
    relationshipStyle: {
      pursuit: "Warm and generous \u2014 showers attention with care",
      commitmentSpeed: "Medium \u2014 needs to feel emotionally safe first",
      passion: "Deeply warm, protective, and expressive",
      conflict: "Dramatic defense, then warm reconciliation",
      jealousy: "High \u2014 protective of emotional bonds"
    },
    famousExamples: [
      {
        name: "Barack Obama",
        birthdate: "August 4",
        degree: "~3.48\u00B0 Leo",
        notes: "Charismatic leader with emotional intelligence"
      },
      {
        name: "J.K. Rowling",
        birthdate: "July 31",
        degree: "~1.25\u00B0 Leo",
        notes: "Creative warmth, protective of her world"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "A case of apoplexy",
      interpretation: "The release of powerful creative energy at the Cancer-Leo boundary. Warmth that flows from emotional depth into creative expression."
    },
    nakshatra: {
      name: "Magha",
      ruler: "Ketu",
      meaning: "The Great One \u2014 royal lineage and ancestral pride",
      influence: "Regal authority, respect for tradition, noble leadership"
    },
    colorTheme: {
      primary: "#FFD700",
      secondary: "#FFA500",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
    }
  },

  {
    id: 2,
    name: "The Radiant King/Queen",
    archetype: "The Solar Monarch",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 125,
      absoluteEnd: 129.99
    },
    dateRange: {
      start: "July 28",
      end: "August 1",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Fixed)",
      primaryRuler: "Sun",
      subRuler: "Sun",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Leo",
        type: "Core",
        planet: "Sun",
        percentage: 100,
        traits: ["Peak creative power", "Magnetic presence", "Unshakeable confidence", "Lavish generosity", "Dramatic flair"]
      }
    ],
    qualities: {
      creativity: { level: 100, label: "Maximum", icon: "\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8" },
      charisma: { level: 100, label: "Maximum", icon: "\u2728\u2728\u2728\u2728\u2728" },
      confidence: { level: 95, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      generosity: { level: 95, label: "Very High", icon: "\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81" },
      leadership: { level: 95, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      dramaticFlair: { level: 100, label: "Maximum", icon: "\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD" },
      needForRecognition: { level: 95, label: "Very High", icon: "\u2B50\u2B50\u2B50\u2B50\u2B50" },
      pride: { level: 95, label: "Very High", icon: "\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81" },
      loyalty: { level: 95, label: "Very High", icon: "\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B" },
      speed: { level: 85, label: "Very High", icon: "\u26A1\u26A1\u26A1\u26A1" }
    },
    strengths: [
      "Inspires through sheer presence \u2014 magnetic solar energy",
      "Creates magnificent experiences \u2014 everything becomes grand",
      "Unshakeable confidence \u2014 believes in self absolutely",
      "Generous beyond measure \u2014 gives lavishly to inner circle"
    ],
    shadows: [
      "Ego can overshadow others \u2014 takes up all the space",
      "Requires constant admiration \u2014 cannot function without audience",
      "Cannot tolerate being ignored \u2014 reacts dramatically",
      "Pride prevents vulnerability \u2014 armor never comes off"
    ],
    careerSignatures: [
      "Performer/Entertainer",
      "Creative Director",
      "CEO/Founder",
      "Celebrity/Public Figure",
      "Stage Performer"
    ],
    relationshipStyle: {
      pursuit: "Grand romantic gestures \u2014 love as performance",
      commitmentSpeed: "Fast \u2014 knows what they want and claims it",
      passion: "Intense, dramatic, all-consuming fire",
      conflict: "Dramatic confrontation, demands respect",
      jealousy: "Very high \u2014 possessive of attention and admiration"
    },
    famousExamples: [
      {
        name: "Madonna",
        birthdate: "August 16",
        degree: "~6.07\u00B0 Leo",
        notes: "Pure creative self-expression"
      },
      {
        name: "Mick Jagger",
        birthdate: "July 26",
        degree: "~7.31\u00B0 Leo",
        notes: "Charismatic performer, regal stage presence"
      }
    ],
    sabianSymbol: {
      degree: 8,
      symbol: "A Bolshevik propagandist",
      interpretation: "The power of passionate conviction to move masses. Pure Leo energy channeled through absolute self-belief and magnetic presence."
    },
    nakshatra: {
      name: "Magha",
      ruler: "Ketu",
      meaning: "The Mighty One \u2014 supreme royal authority",
      influence: "Natural rulership, divine right consciousness, inherited greatness"
    },
    colorTheme: {
      primary: "#FF8C00",
      secondary: "#FF4500",
      gradient: "linear-gradient(135deg, #FF8C00 0%, #FF4500 100%)"
    }
  },

  {
    id: 3,
    name: "The Passionate Creator",
    archetype: "The Visionary Performer",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 130,
      absoluteEnd: 134.99
    },
    dateRange: {
      start: "August 2",
      end: "August 6",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Sagittarius)",
      primaryRuler: "Sun",
      subRuler: "Jupiter",
      modality: "Fixed/Mutable"
    },
    influences: [
      {
        source: "Leo",
        type: "Core",
        planet: "Sun",
        percentage: 70,
        traits: ["Creative identity", "Self-expression", "Charisma", "Leadership", "Passion"]
      },
      {
        source: "Sagittarius",
        type: "Decan",
        planet: "Jupiter",
        percentage: 30,
        traits: ["Expansive vision", "Philosophy", "Adventure", "Optimism", "Freedom"]
      }
    ],
    qualities: {
      creativity: { level: 95, label: "Very High", icon: "\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8" },
      charisma: { level: 90, label: "Very High", icon: "\u2728\u2728\u2728\u2728\u2728" },
      confidence: { level: 90, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      generosity: { level: 100, label: "Maximum", icon: "\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81" },
      leadership: { level: 85, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      dramaticFlair: { level: 85, label: "Very High", icon: "\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD" },
      needForRecognition: { level: 80, label: "High", icon: "\u2B50\u2B50\u2B50\u2B50" },
      pride: { level: 80, label: "High", icon: "\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81" },
      loyalty: { level: 85, label: "Very High", icon: "\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B" },
      speed: { level: 90, label: "Very High", icon: "\u26A1\u26A1\u26A1\u26A1\u26A1" }
    },
    strengths: [
      "Inspires through visionary creation \u2014 Jupiter expands Leo's vision",
      "Boundless creative energy \u2014 double fire fuels endless projects",
      "Generous philosophical leader \u2014 shares wisdom freely",
      "Optimistic even in failure \u2014 always sees the bigger picture"
    ],
    shadows: [
      "Overcommits to creative projects \u2014 says yes to everything",
      "Restless with routine \u2014 needs constant new stimulation",
      "Can be preachy about own vision \u2014 Jupiter magnifies ego",
      "Scattered creative focus \u2014 too many adventures at once"
    ],
    careerSignatures: [
      "Visionary Entrepreneur",
      "Philosopher-Teacher",
      "Cultural Leader",
      "Adventurous Performer",
      "Motivational Speaker"
    ],
    relationshipStyle: {
      pursuit: "Grand adventures together \u2014 love as shared journey",
      commitmentSpeed: "Fast but restless \u2014 commits passionately then needs freedom",
      passion: "Expansive, generous, adventurous fire",
      conflict: "Preaches vision, then moves on quickly",
      jealousy: "Moderate \u2014 too confident to worry much"
    },
    famousExamples: [
      {
        name: "Jennifer Lopez",
        birthdate: "July 24",
        degree: "~11.18\u00B0 Leo",
        notes: "Adventurous creative expression"
      },
      {
        name: "Robert De Niro",
        birthdate: "August 17",
        degree: "~13.51\u00B0 Leo",
        notes: "Philosophical depth in performance"
      }
    ],
    sabianSymbol: {
      degree: 13,
      symbol: "An old sea captain rocking on the porch",
      interpretation: "The wisdom of creative experience gathered through adventurous journeys. Jupiter's philosophical depth channeled through Leo's expressive storytelling."
    },
    nakshatra: {
      name: "Purva Phalguni",
      ruler: "Venus",
      meaning: "The Former Red One \u2014 creative pleasure and luxury",
      influence: "Artistic expression, enjoyment of life, creative romance"
    },
    colorTheme: {
      primary: "#FF6347",
      secondary: "#FF7F50",
      gradient: "linear-gradient(135deg, #FF6347 0%, #FF7F50 100%)"
    }
  },

  {
    id: 4,
    name: "The Bold Visionary",
    archetype: "The Cultural Pioneer",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 135,
      absoluteEnd: 139.99
    },
    dateRange: {
      start: "August 7",
      end: "August 11",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Sagittarius)",
      primaryRuler: "Sun",
      subRuler: "Jupiter",
      modality: "Fixed/Mutable"
    },
    influences: [
      {
        source: "Leo",
        type: "Core",
        planet: "Sun",
        percentage: 60,
        traits: ["Creative core", "Identity", "Confidence", "Self-expression"]
      },
      {
        source: "Sagittarius",
        type: "Decan",
        planet: "Jupiter",
        percentage: 40,
        traits: ["Expansive manifestation", "Cultural impact", "Visionary scope", "Teaching"]
      }
    ],
    qualities: {
      creativity: { level: 90, label: "Very High", icon: "\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8" },
      charisma: { level: 95, label: "Very High", icon: "\u2728\u2728\u2728\u2728\u2728" },
      confidence: { level: 100, label: "Maximum", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      generosity: { level: 95, label: "Very High", icon: "\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81" },
      leadership: { level: 100, label: "Maximum", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      dramaticFlair: { level: 80, label: "High", icon: "\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD" },
      needForRecognition: { level: 75, label: "High", icon: "\u2B50\u2B50\u2B50\u2B50" },
      pride: { level: 85, label: "Very High", icon: "\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81" },
      loyalty: { level: 80, label: "High", icon: "\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B" },
      speed: { level: 95, label: "Very High", icon: "\u26A1\u26A1\u26A1\u26A1\u26A1" }
    },
    strengths: [
      "Visionary leader of movements \u2014 sees and creates the future",
      "Fearless creative pioneer \u2014 goes where no one has gone",
      "Inspires cultural change \u2014 shapes society through vision",
      "Teaches through example \u2014 walks the talk"
    ],
    shadows: [
      "Overestimates abilities \u2014 Jupiter inflates ego beyond reality",
      "Can be arrogant \u2014 believes own legend too deeply",
      "Impatient with followers \u2014 moves too fast for others",
      "Difficulty with details \u2014 sees only the grand picture"
    ],
    careerSignatures: [
      "Revolutionary Leader",
      "Cultural Icon",
      "Movement Founder",
      "Visionary CEO",
      "Political Leader"
    ],
    relationshipStyle: {
      pursuit: "Bold declarations \u2014 claims partner like territory",
      commitmentSpeed: "Very fast \u2014 knows immediately and acts",
      passion: "Fearless, consuming, transformative fire",
      conflict: "Dominates with vision, no compromise",
      jealousy: "Moderate-high \u2014 too busy leading to obsess"
    },
    famousExamples: [
      {
        name: "Napoleon Bonaparte",
        birthdate: "August 15",
        degree: "~16.24\u00B0 Leo",
        notes: "Visionary leader, cultural impact"
      },
      {
        name: "Whitney Houston",
        birthdate: "August 9",
        degree: "~18.53\u00B0 Leo",
        notes: "Bold vocal performance, cultural icon"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "A chemist conducts an experiment",
      interpretation: "The bold pursuit of transformation through creative vision. Jupiter's expansive scope meets Leo's need to pioneer new territory."
    },
    nakshatra: {
      name: "Purva Phalguni",
      ruler: "Venus",
      meaning: "Creative Power \u2014 bold artistic manifestation",
      influence: "Fearless self-expression, cultural leadership, bold creativity"
    },
    colorTheme: {
      primary: "#DC143C",
      secondary: "#B22222",
      gradient: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)"
    }
  },

  {
    id: 5,
    name: "The Dignified Performer",
    archetype: "The Warrior Star",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 140,
      absoluteEnd: 144.99
    },
    dateRange: {
      start: "August 12",
      end: "August 16",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Aries)",
      primaryRuler: "Sun",
      subRuler: "Mars",
      modality: "Fixed/Cardinal"
    },
    influences: [
      {
        source: "Leo",
        type: "Core",
        planet: "Sun",
        percentage: 70,
        traits: ["Creative identity", "Self-expression", "Charisma", "Dramatic flair"]
      },
      {
        source: "Aries",
        type: "Decan",
        planet: "Mars",
        percentage: 30,
        traits: ["Warrior courage", "Competitive spirit", "Directness", "Pioneering energy"]
      }
    ],
    qualities: {
      creativity: { level: 85, label: "Very High", icon: "\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8" },
      charisma: { level: 85, label: "Very High", icon: "\u2728\u2728\u2728\u2728" },
      confidence: { level: 95, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      generosity: { level: 80, label: "High", icon: "\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81" },
      leadership: { level: 90, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      dramaticFlair: { level: 90, label: "Very High", icon: "\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD" },
      needForRecognition: { level: 85, label: "Very High", icon: "\u2B50\u2B50\u2B50\u2B50\u2B50" },
      pride: { level: 90, label: "Very High", icon: "\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81" },
      loyalty: { level: 90, label: "Very High", icon: "\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B" },
      speed: { level: 90, label: "Very High", icon: "\u26A1\u26A1\u26A1\u26A1\u26A1" }
    },
    strengths: [
      "Courageous creative pioneer \u2014 Mars adds warrior fire to Leo's expression",
      "Direct leadership style \u2014 no games, no ambiguity",
      "Fights for creative vision \u2014 will not back down",
      "Competitive excellence \u2014 drives to be the best"
    ],
    shadows: [
      "Combative when challenged \u2014 Mars makes conflict physical",
      "Must win at all costs \u2014 competition overrides relationships",
      "Impatient with process \u2014 wants results NOW",
      "Difficulty compromising \u2014 pride + warrior energy = immovable"
    ],
    careerSignatures: [
      "Competitive Champion",
      "Warrior-Leader",
      "Sports Star",
      "Direct Commander",
      "Courageous Performer"
    ],
    relationshipStyle: {
      pursuit: "Direct and bold \u2014 conquers through courage",
      commitmentSpeed: "Fast \u2014 decides quickly, fights for partner",
      passion: "Intense warrior fire \u2014 protective and commanding",
      conflict: "Fights directly, must win the argument",
      jealousy: "Very high \u2014 warrior protectiveness meets Leo pride"
    },
    famousExamples: [
      {
        name: "Bill Clinton",
        birthdate: "August 19",
        degree: "~20.24\u00B0 Leo",
        notes: "Charismatic fighter, direct leadership"
      },
      {
        name: "Jacqueline Kennedy",
        birthdate: "July 28",
        degree: "~22.03\u00B0 Leo",
        notes: "Dignified courage under fire"
      }
    ],
    sabianSymbol: {
      degree: 23,
      symbol: "A bareback rider in a circus",
      interpretation: "The courage to perform without safety nets. Mars warrior energy channeled through Leo's dramatic self-expression, fearless in the spotlight."
    },
    nakshatra: {
      name: "Uttara Phalguni",
      ruler: "Sun",
      meaning: "The Latter Red One \u2014 patronage and courage",
      influence: "Noble courage, dignified action, fighting for honor"
    },
    colorTheme: {
      primary: "#CD5C5C",
      secondary: "#8B0000",
      gradient: "linear-gradient(135deg, #CD5C5C 0%, #8B0000 100%)"
    }
  },

  {
    id: 6,
    name: "The Perfectionist Star",
    archetype: "The Master Craftsperson",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 145,
      absoluteEnd: 149.99
    },
    dateRange: {
      start: "August 17",
      end: "August 22",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Aries)",
      primaryRuler: "Sun",
      subRuler: "Mars",
      modality: "Fixed/Cardinal"
    },
    influences: [
      {
        source: "Leo",
        type: "Core",
        planet: "Sun",
        percentage: 75,
        traits: ["Creative identity", "Self-expression", "Confidence", "Dramatic craft"]
      },
      {
        source: "Virgo",
        type: "Cusp Bleed",
        planet: "Mercury",
        percentage: 25,
        traits: ["Analytical precision", "Perfectionism", "Detail mastery", "Service through quality"]
      }
    ],
    qualities: {
      creativity: { level: 90, label: "Very High", icon: "\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8\uD83C\uDFA8" },
      charisma: { level: 85, label: "Very High", icon: "\u2728\u2728\u2728\u2728" },
      confidence: { level: 80, label: "High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      generosity: { level: 85, label: "Very High", icon: "\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81\uD83C\uDF81" },
      leadership: { level: 85, label: "Very High", icon: "\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51\uD83D\uDC51" },
      dramaticFlair: { level: 75, label: "High", icon: "\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD\uD83C\uDFAD" },
      needForRecognition: { level: 80, label: "High", icon: "\u2B50\u2B50\u2B50\u2B50" },
      pride: { level: 85, label: "Very High", icon: "\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81\uD83E\uDD81" },
      loyalty: { level: 95, label: "Very High", icon: "\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B\uD83D\uDC9B" },
      speed: { level: 75, label: "High", icon: "\u26A1\u26A1\u26A1\u26A1" }
    },
    strengths: [
      "Perfects creative craft \u2014 Mercury precision meets Leo artistry",
      "Analytical performance \u2014 thinks through every detail",
      "Reliable excellence \u2014 consistently high quality output",
      "Combines vision with precision \u2014 the rare artist-craftsperson"
    ],
    shadows: [
      "Overly critical of self/others \u2014 Virgo influence sharpens critique",
      "Perfectionism delays creation \u2014 never good enough",
      "Anxious about imperfection \u2014 Mercury analysis creates worry",
      "Struggles with spontaneity \u2014 everything must be planned"
    ],
    careerSignatures: [
      "Master Craftsperson",
      "Perfectionist Artist",
      "Precision Leader",
      "Quality Director",
      "Technical Performer"
    ],
    relationshipStyle: {
      pursuit: "Carefully crafted courtship \u2014 every gesture planned",
      commitmentSpeed: "Medium-slow \u2014 analyzes compatibility first",
      passion: "Precise, attentive, quality over quantity",
      conflict: "Critiques flaws, demands standards",
      jealousy: "Moderate \u2014 analytical rather than emotional"
    },
    famousExamples: [
      {
        name: "Mother Teresa",
        birthdate: "August 26",
        degree: "~26.55\u00B0 Leo",
        notes: "Service through disciplined compassion"
      },
      {
        name: "Sean Connery",
        birthdate: "August 25",
        degree: "~27.18\u00B0 Leo",
        notes: "Perfected craft of performance"
      }
    ],
    sabianSymbol: {
      degree: 28,
      symbol: "Many little birds on the limb of a big tree",
      interpretation: "The gathering of many small perfections into one great creation. Virgo's detail consciousness elevates Leo's grand creative vision."
    },
    nakshatra: {
      name: "Uttara Phalguni",
      ruler: "Sun",
      meaning: "The Precision Star \u2014 mastery through discipline",
      influence: "Perfectionist excellence, analytical creativity, service through craft"
    },
    colorTheme: {
      primary: "#DAA520",
      secondary: "#B8860B",
      gradient: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)"
    }
  }
];

export const getLeoZoneByDegree = (degree) => {
  return leoZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default leoZones;
