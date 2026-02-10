// Gemini Zone Database
// Complete data structure for all 6 zones across the 30° Gemini spectrum

export const geminiZones = [
  {
    id: 1,
    name: "The Practical Communicator",
    archetype: "The Articulate Builder",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 60,
      absoluteEnd: 64.99
    },
    dateRange: {
      start: "May 21",
      end: "May 25",
      duration: "~5 days"
    },
    description: "Taurus-Gemini Cusp: Material grounding meets mental agility",
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Mercury",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Taurus",
        type: "Cusp Bleed",
        planet: "Venus",
        percentage: 25,
        traits: ["Patience", "Sensuality", "Practicality", "Material focus", "Steadiness"]
      },
      {
        source: "Gemini",
        type: "Core",
        planet: "Mercury",
        percentage: 75,
        traits: ["Communication", "Curiosity", "Adaptability", "Mental agility", "Social intelligence"]
      }
    ],
    elementalMix: {
      air: 75,
      earth: 25
    },
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 75, meaning: "Communication, intellect, versatility" },
      secondary: { planet: "Venus", influence: 25, meaning: "Material values, aesthetic sense" }
    },
    qualities: {
      communication: { level: 95, label: "Very High", icon: "\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}" },
      versatility: { level: 90, label: "Very High", icon: "\u{1F504}\u{1F504}\u{1F504}\u{1F504}\u{1F504}" },
      curiosity: { level: 90, label: "Very High", icon: "\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}" },
      adaptability: { level: 90, label: "Very High", icon: "\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}" },
      intellectualAgility: { level: 95, label: "Very High", icon: "\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}" },
      socialSkill: { level: 90, label: "Very High", icon: "\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}" },
      speed: { level: 85, label: "High", icon: "\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}" },
      patience: { level: 60, label: "Medium", icon: "\u231B\u231B\u231B" },
      stubbornness: { level: 60, label: "Medium", icon: "\u{1F4AD}\u{1F4AD}\u{1F4AD}" },
      riskTolerance: { level: 55, label: "Medium", icon: "\u{1F3B2}\u{1F3B2}\u{1F3B2}" }
    },
    strengths: [
      "Articulates practical wisdom",
      "Grounded mental agility",
      "Communicates values clearly",
      "Versatile with follow-through",
      "Balances ideas with execution"
    ],
    shadows: [
      "Rationalizes material desires",
      "Stubborn about ideas",
      "Scattered between thinking/doing",
      "Difficulty with pure abstraction",
      "Possessive of information"
    ],
    careerSignatures: [
      "Technical Writing",
      "Financial Analysis",
      "Product Management",
      "Architecture (Communication + Building)",
      "Journalism with Depth"
    ],
    relationshipStyle: {
      pursuit: "Thoughtful communication - sends meaningful messages",
      commitmentSpeed: "Medium - needs intellectual and sensual connection",
      passion: "Verbal and sensual - words + touch combined",
      conflict: "Tries to talk it out patiently",
      jealousy: "Low-medium - rational about it"
    },
    famousExamples: [
      {
        name: "Clint Eastwood",
        birthdate: "",
        degree: "~1.23\u00B0 Gemini",
        notes: "Practical versatile mastery"
      },
      {
        name: "Brooke Shields",
        birthdate: "",
        degree: "~3.42\u00B0 Gemini",
        notes: "Articulate grounded presence"
      }
    ],
    sabianSymbol: {
      degree: 3,
      symbol: "The garden of the Tuileries in Paris",
      interpretation: "Structured beauty \u2014 combining Taurus\u2019s love of gardens with Gemini\u2019s appreciation for design and social spaces."
    },
    nakshatra: {
      name: "Mrigashira",
      range: "23\u00B020' Taurus - 6\u00B040' Gemini (sidereal)",
      ruler: "Mars",
      symbol: "Deer's Head",
      deity: "Soma (Moon God)",
      qualities: ["Searching nature", "Gentle curiosity", "Restless seeking"]
    },
    colorTheme: {
      primary: "#FFD700",
      secondary: "#FFA500",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Communicator",
    archetype: "The Messenger",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 65,
      absoluteEnd: 69.99
    },
    dateRange: {
      start: "May 26",
      end: "May 30",
      duration: "~5 days"
    },
    description: "Pure Gemini: Maximum versatility, communication, and mental agility",
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Mercury",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Gemini",
        type: "Pure Mercury",
        planet: "Mercury",
        percentage: 100,
        traits: ["Pure communication", "Lightning wit", "Verbal mastery", "Information processing", "Social butterfly"]
      }
    ],
    elementalMix: {
      air: 100
    },
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 100, meaning: "Pure Mercurial energy - communication, intellect, speed, duality" }
    },
    qualities: {
      communication: { level: 100, label: "Maximum", icon: "\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}" },
      versatility: { level: 100, label: "Maximum", icon: "\u{1F504}\u{1F504}\u{1F504}\u{1F504}\u{1F504}" },
      curiosity: { level: 100, label: "Maximum", icon: "\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}" },
      adaptability: { level: 100, label: "Maximum", icon: "\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}" },
      intellectualAgility: { level: 100, label: "Maximum", icon: "\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}" },
      socialSkill: { level: 100, label: "Maximum", icon: "\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}" },
      speed: { level: 100, label: "Maximum", icon: "\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}" },
      patience: { level: 20, label: "Low", icon: "\u231B" },
      stubbornness: { level: 30, label: "Low-Medium", icon: "\u{1F4AD}\u{1F4AD}" },
      riskTolerance: { level: 60, label: "Medium", icon: "\u{1F3B2}\u{1F3B2}\u{1F3B2}" }
    },
    strengths: [
      "Communicates anything to anyone",
      "Infinitely versatile and adaptable",
      "Learns and teaches everything",
      "Networks entire universes",
      "Ultimate mental agility"
    ],
    shadows: [
      "Completely superficial",
      "Cannot commit to anything",
      "Scattered across infinite interests",
      "Exhausts others with talking",
      "No depth or follow-through"
    ],
    careerSignatures: [
      "Broadcasting/Media",
      "Stand-up Comedy",
      "Social Media Management",
      "Sales & Networking",
      "Linguistics/Translation"
    ],
    relationshipStyle: {
      pursuit: "Witty banter and constant texting",
      commitmentSpeed: "Very slow - too many options",
      passion: "Intellectual foreplay, verbal intimacy",
      conflict: "Talks circles around the problem",
      jealousy: "Low - believes in freedom"
    },
    famousExamples: [
      {
        name: "Marilyn Monroe",
        birthdate: "",
        degree: "~6.07\u00B0 Gemini",
        notes: "Dual nature, versatile charm"
      },
      {
        name: "Stevie Nicks",
        birthdate: "",
        degree: "~8.23\u00B0 Gemini",
        notes: "Communicative mystical duality"
      }
    ],
    sabianSymbol: {
      degree: 8,
      symbol: "Aroused strikers surround a factory",
      interpretation: "The power of collective voice. Pure Gemini channeling communication for social change."
    },
    nakshatra: {
      name: "Ardra",
      range: "6\u00B040' - 20\u00B0 Gemini (sidereal)",
      ruler: "Rahu (North Node)",
      symbol: "Teardrop/Diamond",
      deity: "Rudra (Storm God)",
      qualities: ["Intellectual storms", "Transformation through knowledge", "Intense curiosity"]
    },
    colorTheme: {
      primary: "#00CED1",
      secondary: "#48D1CC",
      gradient: "linear-gradient(135deg, #00CED1 0%, #48D1CC 100%)"
    }
  },

  {
    id: 3,
    name: "The Balanced Diplomat",
    archetype: "The Diplomat",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 70,
      absoluteEnd: 74.99
    },
    dateRange: {
      start: "May 31",
      end: "June 4",
      duration: "~5 days"
    },
    description: "Gemini-Libra blend: Mental agility meets harmonious balance",
    decan: {
      number: 2,
      name: "Second Decan (Cardinal)",
      primaryRuler: "Mercury",
      subRuler: "Venus",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Gemini",
        type: "Core",
        planet: "Mercury",
        percentage: 70,
        traits: ["Communication", "Curiosity", "Mental agility"]
      },
      {
        source: "Libra",
        type: "Venus Sub-ruler",
        planet: "Venus",
        percentage: 30,
        traits: ["Diplomacy", "Harmony", "Aesthetic sense", "Relationship focus"]
      }
    ],
    elementalMix: {
      air: 85,
      venusianAir: 15
    },
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Mental communication" },
      secondary: { planet: "Venus", influence: 30, meaning: "Harmonious diplomacy, aesthetic balance" }
    },
    qualities: {
      communication: { level: 95, label: "Very High", icon: "\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}" },
      versatility: { level: 90, label: "Very High", icon: "\u{1F504}\u{1F504}\u{1F504}\u{1F504}\u{1F504}" },
      curiosity: { level: 85, label: "High", icon: "\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}" },
      adaptability: { level: 90, label: "Very High", icon: "\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}" },
      intellectualAgility: { level: 90, label: "Very High", icon: "\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}" },
      socialSkill: { level: 100, label: "Maximum", icon: "\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}" },
      speed: { level: 95, label: "Very High", icon: "\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}" },
      patience: { level: 40, label: "Low-Medium", icon: "\u231B\u231B" },
      stubbornness: { level: 50, label: "Medium", icon: "\u{1F4AD}\u{1F4AD}\u{1F4AD}" },
      riskTolerance: { level: 55, label: "Medium", icon: "\u{1F3B2}\u{1F3B2}\u{1F3B2}" }
    },
    strengths: [
      "Diplomatic brilliant communication",
      "Charms everyone effortlessly",
      "Balances multiple perspectives",
      "Socially graceful versatility",
      "Creates harmonious connections"
    ],
    shadows: [
      "Superficial people-pleasing",
      "Cannot commit (weighs all options)",
      "Scattered social focus",
      "Says what people want to hear",
      "Indecisive mental loops"
    ],
    careerSignatures: [
      "Diplomacy/International Relations",
      "Art Criticism/Curation",
      "Couples Counseling",
      "Public Relations",
      "Design Communication"
    ],
    relationshipStyle: {
      pursuit: "Charming and attentive - balanced approach",
      commitmentSpeed: "Medium - weighs options carefully",
      passion: "Elegant and intellectually stimulating",
      conflict: "Diplomatic - seeks compromise",
      jealousy: "Low - trusts in fairness"
    },
    famousExamples: [
      {
        name: "Angelina Jolie",
        birthdate: "",
        degree: "~11.52\u00B0 Gemini",
        notes: "Diplomatic versatile humanitarian"
      },
      {
        name: "Paul McCartney",
        birthdate: "",
        degree: "~13.15\u00B0 Gemini",
        notes: "Charming musical communicator"
      }
    ],
    sabianSymbol: {
      degree: 13,
      symbol: "A famous pianist giving a concert performance",
      interpretation: "Communication elevated to art. The diplomat expresses ideas with grace and technical mastery."
    },
    nakshatra: {
      name: "Ardra",
      range: "6\u00B040' - 20\u00B0 Gemini (sidereal)",
      ruler: "Rahu",
      symbol: "Teardrop",
      deity: "Rudra",
      qualities: ["Balanced storms", "Diplomatic intensity", "Aesthetic curiosity"]
    },
    colorTheme: {
      primary: "#87CEEB",
      secondary: "#B0E0E6",
      gradient: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)"
    }
  },

  {
    id: 4,
    name: "The Intellectual Revolutionary",
    archetype: "The Connector",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 75,
      absoluteEnd: 79.99
    },
    dateRange: {
      start: "June 5",
      end: "June 9",
      duration: "~5 days"
    },
    description: "Gemini-Aquarius blend: Mental agility meets revolutionary innovation",
    decan: {
      number: 2,
      name: "Second Decan (Cardinal)",
      primaryRuler: "Mercury",
      subRuler: "Venus",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Gemini",
        type: "Core",
        planet: "Mercury",
        percentage: 65,
        traits: ["Networking", "Communication", "Adaptability"]
      },
      {
        source: "Libra",
        type: "Venus Peak",
        planet: "Venus",
        percentage: 35,
        traits: ["Strategic relationships", "Social harmony", "Partnership focus", "Justice"]
      }
    ],
    elementalMix: {
      air: 70,
      uranianAir: 30
    },
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 60, meaning: "Information processing" },
      secondary: { planet: "Uranus", influence: 40, meaning: "Revolutionary ideas, innovation" }
    },
    qualities: {
      communication: { level: 90, label: "Very High", icon: "\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}" },
      versatility: { level: 95, label: "Very High", icon: "\u{1F504}\u{1F504}\u{1F504}\u{1F504}\u{1F504}" },
      curiosity: { level: 95, label: "Very High", icon: "\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}" },
      adaptability: { level: 85, label: "High", icon: "\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}" },
      intellectualAgility: { level: 95, label: "Very High", icon: "\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}" },
      socialSkill: { level: 85, label: "High", icon: "\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}" },
      speed: { level: 100, label: "Maximum", icon: "\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}" },
      patience: { level: 30, label: "Low-Medium", icon: "\u231B\u231B" },
      stubbornness: { level: 65, label: "Medium", icon: "\u{1F4AD}\u{1F4AD}\u{1F4AD}" },
      riskTolerance: { level: 75, label: "High", icon: "\u{1F3B2}\u{1F3B2}\u{1F3B2}\u{1F3B2}" }
    },
    strengths: [
      "Revolutionary idea generation",
      "Networks innovative thinkers",
      "Spreads progressive knowledge",
      "Intellectually brilliant",
      "Adapts to future instantly"
    ],
    shadows: [
      "Intellectually arrogant",
      "Detached from emotions",
      "Scattered across revolutions",
      "Cannot execute innovations",
      "Rebels against all tradition"
    ],
    careerSignatures: [
      "Business Development",
      "Venture Capital/Angel Investing",
      "Event Management",
      "Human Resources",
      "Political Strategy"
    ],
    relationshipStyle: {
      pursuit: "Strategic and socially smooth",
      commitmentSpeed: "Medium-slow - evaluates partnership value",
      passion: "Intellectually connected, socially engaged",
      conflict: "Negotiates - finds win-win solutions",
      jealousy: "Low-medium - values fairness"
    },
    famousExamples: [
      {
        name: "Tupac Shakur",
        birthdate: "",
        degree: "~16.05\u00B0 Gemini",
        notes: "Revolutionary communication"
      },
      {
        name: "Tom Holland",
        birthdate: "",
        degree: "~18.23\u00B0 Gemini",
        notes: "Innovative versatile performance"
      }
    ],
    sabianSymbol: {
      degree: 18,
      symbol: "Two Chinese men talking Chinese in a Western crowd",
      interpretation: "The ability to speak in code \u2014 connecting with specific audiences while navigating broader social contexts."
    },
    nakshatra: {
      name: "Punarvasu",
      range: "20\u00B0 Gemini - 3\u00B020' Cancer (sidereal)",
      ruler: "Jupiter",
      symbol: "Quiver of Arrows",
      deity: "Aditi (Mother of Gods)",
      qualities: ["Return to source", "Expansion through connection", "Strategic vision"]
    },
    colorTheme: {
      primary: "#4169E1",
      secondary: "#1E90FF",
      gradient: "linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)"
    }
  },

  {
    id: 5,
    name: "The Emotional Messenger",
    archetype: "The Teacher-Learner",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 80,
      absoluteEnd: 84.99
    },
    dateRange: {
      start: "June 10",
      end: "June 14",
      duration: "~5 days"
    },
    description: "Gemini-Cancer blend: Mental agility meets emotional depth",
    decan: {
      number: 3,
      name: "Third Decan (Fixed)",
      primaryRuler: "Mercury",
      subRuler: "Uranus",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Gemini",
        type: "Core",
        planet: "Mercury",
        percentage: 65,
        traits: ["Communication", "Curiosity", "Mental agility"]
      },
      {
        source: "Aquarius",
        type: "Uranus Sub-ruler",
        planet: "Uranus",
        percentage: 35,
        traits: ["Innovation", "Unconventional thinking", "Humanitarian vision", "Genius flashes"]
      }
    ],
    elementalMix: {
      air: 75,
      water: 25
    },
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Communication" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional nurturing, intuition" }
    },
    qualities: {
      communication: { level: 90, label: "Very High", icon: "\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}" },
      versatility: { level: 85, label: "High", icon: "\u{1F504}\u{1F504}\u{1F504}\u{1F504}" },
      curiosity: { level: 85, label: "High", icon: "\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}" },
      adaptability: { level: 85, label: "High", icon: "\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}" },
      intellectualAgility: { level: 85, label: "High", icon: "\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}" },
      socialSkill: { level: 90, label: "Very High", icon: "\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}" },
      speed: { level: 80, label: "High", icon: "\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}" },
      patience: { level: 50, label: "Medium", icon: "\u231B\u231B\u231B" },
      stubbornness: { level: 55, label: "Medium", icon: "\u{1F4AD}\u{1F4AD}\u{1F4AD}" },
      riskTolerance: { level: 45, label: "Low-Medium", icon: "\u{1F3B2}\u{1F3B2}" }
    },
    strengths: [
      "Communicates emotions articulately",
      "Intuitive understanding of people",
      "Nurtures through conversation",
      "Balances mind and heart",
      "Creates emotional connections"
    ],
    shadows: [
      "Mood swings affect communication",
      "Rationalizes feelings",
      "Scattered emotional focus",
      "Difficulty with emotional depth",
      "Talks about feelings vs feeling them"
    ],
    careerSignatures: [
      "Education Technology",
      "Scientific Research",
      "Think Tank/Policy Work",
      "Futurism/Trend Analysis",
      "Revolutionary Writing"
    ],
    relationshipStyle: {
      pursuit: "Intellectual stimulation first - mind before heart",
      commitmentSpeed: "Slow - needs mental freedom guaranteed",
      passion: "Cerebral and experimental",
      conflict: "Detaches emotionally, analyzes logically",
      jealousy: "Very low - values independence"
    },
    famousExamples: [
      {
        name: "Nicole Kidman",
        birthdate: "",
        degree: "~21.18\u00B0 Gemini",
        notes: "Emotional versatile artistry"
      },
      {
        name: "Liam Neeson",
        birthdate: "",
        degree: "~23.05\u00B0 Gemini",
        notes: "Nurturing protective communication"
      }
    ],
    sabianSymbol: {
      degree: 23,
      symbol: "Three fledglings in a nest high in a tree",
      interpretation: "New ideas taking form in elevated consciousness. The teacher-learner nurtures innovative thoughts."
    },
    nakshatra: {
      name: "Punarvasu",
      range: "20\u00B0 Gemini - 3\u00B020' Cancer (sidereal)",
      ruler: "Jupiter",
      symbol: "Quiver of Arrows",
      deity: "Aditi",
      qualities: ["Philosophical reach", "Teaching wisdom", "Expansive curiosity"]
    },
    colorTheme: {
      primary: "#40E0D0",
      secondary: "#AFEEEE",
      gradient: "linear-gradient(135deg, #40E0D0 0%, #AFEEEE 100%)"
    }
  },

  {
    id: 6,
    name: "The Expressive Teacher",
    archetype: "The Nurturing Communicator",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 85,
      absoluteEnd: 89.99
    },
    dateRange: {
      start: "June 15",
      end: "June 20",
      duration: "~6 days"
    },
    description: "Gemini-Cancer cusp: Mental communication meets nurturing expression",
    decan: {
      number: 3,
      name: "Third Decan (Fixed)",
      primaryRuler: "Mercury",
      subRuler: "Uranus",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Gemini",
        type: "Core",
        planet: "Mercury",
        percentage: 75,
        traits: ["Communication", "Curiosity", "Adaptability"]
      },
      {
        source: "Cancer",
        type: "Cusp Anticipation",
        planet: "Moon",
        percentage: 25,
        traits: ["Emotional depth", "Nurturing instinct", "Memory", "Protective care", "Intuition"]
      }
    ],
    elementalMix: {
      air: 75,
      water: 25
    },
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Teaching, communication" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional nurturing" }
    },
    qualities: {
      communication: { level: 95, label: "Very High", icon: "\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}\u{1F4AC}" },
      versatility: { level: 85, label: "High", icon: "\u{1F504}\u{1F504}\u{1F504}\u{1F504}" },
      curiosity: { level: 80, label: "High", icon: "\u{1F50D}\u{1F50D}\u{1F50D}\u{1F50D}" },
      adaptability: { level: 80, label: "High", icon: "\u{1F98E}\u{1F98E}\u{1F98E}\u{1F98E}" },
      intellectualAgility: { level: 85, label: "High", icon: "\u{1F9E0}\u{1F9E0}\u{1F9E0}\u{1F9E0}" },
      socialSkill: { level: 85, label: "High", icon: "\u{1F91D}\u{1F91D}\u{1F91D}\u{1F91D}" },
      speed: { level: 80, label: "High", icon: "\u{1F4A8}\u{1F4A8}\u{1F4A8}\u{1F4A8}" },
      patience: { level: 55, label: "Medium", icon: "\u231B\u231B\u231B" },
      stubbornness: { level: 60, label: "Medium", icon: "\u{1F4AD}\u{1F4AD}\u{1F4AD}" },
      riskTolerance: { level: 50, label: "Medium", icon: "\u{1F3B2}\u{1F3B2}\u{1F3B2}" }
    },
    strengths: [
      "Nurturing brilliant teacher",
      "Expresses emotions clearly",
      "Creates safe learning spaces",
      "Versatile communication methods",
      "Balances intellect with heart"
    ],
    shadows: [
      "Emotional volatility in teaching",
      "Takes criticism personally",
      "Scattered nurturing focus",
      "Difficulty with boundaries",
      "Moody communication"
    ],
    careerSignatures: [
      "Counseling/Therapy",
      "Children's Education",
      "Memoir/Personal Essay Writing",
      "Healthcare Communication",
      "Family Mediation"
    ],
    relationshipStyle: {
      pursuit: "Emotionally intelligent approach - senses what partner needs",
      commitmentSpeed: "Medium-fast - craves emotional security",
      passion: "Verbal affection meets emotional depth",
      conflict: "Retreats emotionally, then communicates",
      jealousy: "Medium - emotional sensitivity"
    },
    famousExamples: [
      {
        name: "Prince (musician)",
        birthdate: "",
        degree: "~26.07\u00B0 Gemini",
        notes: "Expressive versatile teacher"
      },
      {
        name: "Mel B",
        birthdate: "",
        degree: "~27.53\u00B0 Gemini",
        notes: "Nurturing communicative presence"
      }
    ],
    sabianSymbol: {
      degree: 28,
      symbol: "A man declared bankrupt",
      interpretation: "Emotional cost of purely intellectual living. The nurturing communicator learns to balance mind and heart."
    },
    nakshatra: {
      name: "Punarvasu",
      range: "20\u00B0 Gemini - 3\u00B020' Cancer (sidereal)",
      ruler: "Jupiter",
      symbol: "Quiver of Arrows",
      deity: "Aditi",
      qualities: ["Nurturing return", "Emotional wisdom", "Protective communication"]
    },
    colorTheme: {
      primary: "#5F9EA0",
      secondary: "#7FFFD4",
      gradient: "linear-gradient(135deg, #5F9EA0 0%, #7FFFD4 100%)"
    }
  }
];

export default geminiZones;
