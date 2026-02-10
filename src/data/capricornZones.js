// Capricorn Zone Database
// Complete data structure for all 6 zones across the 30° Capricorn spectrum
// Earth Sign: Ambitious, disciplined, strategic, masterful
// Ruled by Saturn: Structure, discipline, mastery, responsibility, time

export const capricornZones = [
  {
    id: 1,
    name: "The Visionary Builder",
    archetype: "The Philosophical Executive",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 270,
      absoluteEnd: 274.99
    },
    dateRange: {
      start: "December 22",
      end: "December 26",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Saturn",
      subRuler: "Saturn",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Sagittarius",
        type: "Cusp Bleed",
        planet: "Jupiter",
        percentage: 25,
        traits: ["Philosophical vision", "Optimistic energy", "Expansive thinking", "Adventurous spirit", "Teaching ability"]
      },
      {
        source: "Capricorn",
        type: "Core",
        planet: "Saturn",
        percentage: 75,
        traits: ["Strategic discipline", "Ambitious planning", "Patient execution", "Mastery pursuit", "Structural thinking"]
      }
    ],
    qualities: {
      ambition: { level: 90, label: "Very High", icon: "🏔️🏔️🏔️🏔️🏔️" },
      discipline: { level: 85, label: "Very High", icon: "⚙️⚙️⚙️⚙️" },
      strategicThinking: { level: 90, label: "Very High", icon: "♟️♟️♟️♟️♟️" },
      responsibility: { level: 80, label: "High", icon: "⚖️⚖️⚖️⚖️" },
      patience: { level: 85, label: "Very High", icon: "🕰️🕰️🕰️🕰️" },
      statusConsciousness: { level: 75, label: "High", icon: "👑👑👑👑" },
      workEthic: { level: 90, label: "Very High", icon: "💪💪💪💪💪" },
      emotionalReserve: { level: 70, label: "Medium-High", icon: "🧊🧊🧊" },
      speed: { level: 70, label: "Medium-High", icon: "⚡⚡⚡" },
      riskTolerance: { level: 60, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Strategic visionary planning with philosophical depth",
      "Builds empires with optimistic endurance",
      "Disciplined adventure pursuit that produces results",
      "Balances Jupiterian expansion with Saturnian structure"
    ],
    shadows: [
      "Workaholic vision pursuit that never stops",
      "Pragmatism that dampens natural enthusiasm",
      "Control issues around freedom and spontaneity",
      "Judgmental about 'unrealistic' dreams"
    ],
    careerSignatures: [
      "Strategic Consultant",
      "University Administrator",
      "Venture Capital Partner",
      "International Business Leader",
      "Think Tank Director"
    ],
    relationshipStyle: {
      pursuit: "Strategic and visionary — plans impressive courtship",
      commitmentSpeed: "Medium — weighs long-term potential carefully",
      passion: "Philosophical depth with strategic warmth",
      conflict: "Strategic debate, seeks pragmatic resolution",
      jealousy: "Low-moderate — Sagittarius influence keeps it light"
    },
    famousExamples: [
      {
        name: "Denzel Washington",
        birthdate: "December 28",
        degree: "~1.48° Capricorn",
        notes: "Strategic career mastery with philosophical depth"
      },
      {
        name: "Tiger Woods",
        birthdate: "December 30",
        degree: "~3.15° Capricorn",
        notes: "Disciplined visionary achievement"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "An Indian chief claims power from the assembled tribe",
      interpretation: "At the Sagittarius-Capricorn cusp, philosophical vision transforms into strategic leadership. The visionary builder claims authority through wisdom."
    },
    nakshatra: {
      name: "Uttara Ashadha",
      range: "26°40' Sagittarius - 10° Capricorn (sidereal)",
      ruler: "Sun",
      symbol: "Elephant's Tusk / Small Bed",
      deity: "Vishvadevas (Universal Gods)",
      qualities: ["Visionary leadership", "Strategic victory", "Disciplined ambition"]
    },
    colorTheme: {
      primary: "#5D4E37",
      secondary: "#704214",
      gradient: "linear-gradient(135deg, #5D4E37 0%, #704214 100%)"
    }
  },

  {
    id: 2,
    name: "The Master Strategist",
    archetype: "The Master Builder",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 275,
      absoluteEnd: 279.99
    },
    dateRange: {
      start: "December 27",
      end: "December 31",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Saturn",
      subRuler: "Saturn",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Capricorn",
        type: "Core",
        planet: "Saturn",
        percentage: 100,
        traits: ["Maximum discipline", "Ultimate mastery", "Iron self-control", "Eternal patience", "Strategic genius"]
      }
    ],
    qualities: {
      ambition: { level: 100, label: "Maximum", icon: "🏔️🏔️🏔️🏔️🏔️" },
      discipline: { level: 100, label: "Maximum", icon: "⚙️⚙️⚙️⚙️⚙️" },
      strategicThinking: { level: 100, label: "Maximum", icon: "♟️♟️♟️♟️♟️" },
      responsibility: { level: 100, label: "Maximum", icon: "⚖️⚖️⚖️⚖️⚖️" },
      patience: { level: 100, label: "Maximum", icon: "🕰️🕰️🕰️🕰️🕰️" },
      statusConsciousness: { level: 95, label: "Very High", icon: "👑👑👑👑👑" },
      workEthic: { level: 100, label: "Maximum", icon: "💪💪💪💪💪" },
      emotionalReserve: { level: 95, label: "Very High", icon: "🧊🧊🧊🧊🧊" },
      speed: { level: 60, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 35, label: "Low", icon: "🎲🎲" }
    },
    strengths: [
      "Achieves the impossible through iron discipline",
      "Master strategist — sees 20 moves ahead",
      "Unshakeable patience and methodical persistence",
      "Commands respect through sheer competence"
    ],
    shadows: [
      "Workaholic to the point of complete burnout",
      "Emotionally cold and inaccessible to loved ones",
      "Cannot enjoy success — immediately targets next goal",
      "Pessimistic worldview that sees only obstacles"
    ],
    careerSignatures: [
      "CEO / Managing Director",
      "Supreme Court Justice",
      "Military General",
      "Master Architect",
      "Investment Bank Chairman"
    ],
    relationshipStyle: {
      pursuit: "Methodical and impressive — proves worth through achievement",
      commitmentSpeed: "Very slow — analyzes every angle",
      passion: "Reserved but deeply loyal once committed",
      conflict: "Cold strategic calculation, rarely emotional",
      jealousy: "Low-medium — too disciplined for drama"
    },
    famousExamples: [
      {
        name: "Michelle Obama",
        birthdate: "January 17",
        degree: "~6.51° Capricorn",
        notes: "Strategic disciplined achievement"
      },
      {
        name: "Bradley Cooper",
        birthdate: "January 5",
        degree: "~8.19° Capricorn",
        notes: "Methodical career mastery"
      }
    ],
    sabianSymbol: {
      degree: 7,
      symbol: "A veiled prophet speaks, seized by the power of a god",
      interpretation: "Pure Saturnian mastery — the authority that comes from disciplined achievement. The master strategist speaks and the world listens."
    },
    nakshatra: {
      name: "Shravana",
      range: "10° - 23°20' Capricorn (sidereal)",
      ruler: "Moon",
      symbol: "Three Footprints / Ear",
      deity: "Vishnu (The Preserver)",
      qualities: ["Strategic listening", "Patient mastery", "Methodical achievement"]
    },
    colorTheme: {
      primary: "#36454F",
      secondary: "#2C3E50",
      gradient: "linear-gradient(135deg, #36454F 0%, #2C3E50 100%)"
    }
  },

  {
    id: 3,
    name: "The Practical Achiever",
    archetype: "The Wealth Builder",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 280,
      absoluteEnd: 284.99
    },
    dateRange: {
      start: "January 1",
      end: "January 5",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed Earth)",
      primaryRuler: "Saturn",
      subRuler: "Venus",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Capricorn",
        type: "Core",
        planet: "Saturn",
        percentage: 70,
        traits: ["Strategic discipline", "Ambitious planning", "Patient execution", "Material mastery", "Status pursuit"]
      },
      {
        source: "Taurus",
        type: "Decan Blend",
        planet: "Venus",
        percentage: 30,
        traits: ["Sensory appreciation", "Aesthetic quality", "Extreme loyalty", "Material pleasure", "Stubborn persistence"]
      }
    ],
    qualities: {
      ambition: { level: 90, label: "Very High", icon: "🏔️🏔️🏔️🏔️🏔️" },
      discipline: { level: 90, label: "Very High", icon: "⚙️⚙️⚙️⚙️⚙️" },
      strategicThinking: { level: 90, label: "Very High", icon: "♟️♟️♟️♟️♟️" },
      responsibility: { level: 90, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      patience: { level: 100, label: "Maximum", icon: "🕰️🕰️🕰️🕰️🕰️" },
      statusConsciousness: { level: 85, label: "Very High", icon: "👑👑👑👑" },
      workEthic: { level: 95, label: "Very High", icon: "💪💪💪💪💪" },
      emotionalReserve: { level: 85, label: "Very High", icon: "🧊🧊🧊🧊" },
      speed: { level: 55, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 30, label: "Low", icon: "🎲🎲" }
    },
    strengths: [
      "Builds material empires with infinite patience",
      "Enjoys the refined fruits of disciplined labor",
      "Extremely loyal and utterly reliable partner",
      "Creates lasting quality in everything touched"
    ],
    shadows: [
      "Impossibly stubborn — cannot change course",
      "Materialistic focus that misses emotional depth",
      "Slow to adapt to changing circumstances",
      "Possessive of achievements and resources"
    ],
    careerSignatures: [
      "Wealth Manager",
      "Real Estate Developer",
      "Luxury Brand Executive",
      "Master Craftsperson",
      "Fine Art Collector"
    ],
    relationshipStyle: {
      pursuit: "Steady and impressive — demonstrates material stability",
      commitmentSpeed: "Slow but absolutely permanent once decided",
      passion: "Sensual depth beneath reserved exterior",
      conflict: "Stubborn silence, then methodical resolution",
      jealousy: "Medium-high — Venus adds possessiveness"
    },
    famousExamples: [
      {
        name: "Kate Middleton",
        birthdate: "January 9",
        degree: "~11.03° Capricorn",
        notes: "Graceful strategic positioning"
      },
      {
        name: "Timothee Chalamet",
        birthdate: "December 27",
        degree: "~13.42° Capricorn",
        notes: "Patient career mastery"
      }
    ],
    sabianSymbol: {
      degree: 12,
      symbol: "An illustrated lecture on natural science reveals little-known aspects of life",
      interpretation: "Venus-Taurus influence brings aesthetic appreciation to Saturnian discipline. The practical achiever builds beauty that endures."
    },
    nakshatra: {
      name: "Shravana",
      range: "10° - 23°20' Capricorn (sidereal)",
      ruler: "Moon",
      symbol: "Three Footprints / Ear",
      deity: "Vishnu (The Preserver)",
      qualities: ["Material preservation", "Patient accumulation", "Quality craftsmanship"]
    },
    colorTheme: {
      primary: "#654321",
      secondary: "#8B4513",
      gradient: "linear-gradient(135deg, #654321 0%, #8B4513 100%)"
    }
  },

  {
    id: 4,
    name: "The Empire Builder",
    archetype: "The Dynasty Founder",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 285,
      absoluteEnd: 289.99
    },
    dateRange: {
      start: "January 6",
      end: "January 10",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed Earth)",
      primaryRuler: "Saturn",
      subRuler: "Venus",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Capricorn",
        type: "Core",
        planet: "Saturn",
        percentage: 60,
        traits: ["Strategic structure", "Empire architecture", "Generational planning", "Power consolidation", "Authority"]
      },
      {
        source: "Taurus",
        type: "Decan Peak",
        planet: "Venus",
        percentage: 40,
        traits: ["Material mastery", "Wealth accumulation", "Aesthetic power", "Resource control", "Legacy building"]
      }
    ],
    qualities: {
      ambition: { level: 95, label: "Very High", icon: "🏔️🏔️🏔️🏔️🏔️" },
      discipline: { level: 95, label: "Very High", icon: "⚙️⚙️⚙️⚙️⚙️" },
      strategicThinking: { level: 95, label: "Very High", icon: "♟️♟️♟️♟️♟️" },
      responsibility: { level: 95, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      patience: { level: 100, label: "Maximum", icon: "🕰️🕰️🕰️🕰️🕰️" },
      statusConsciousness: { level: 90, label: "Very High", icon: "👑👑👑👑👑" },
      workEthic: { level: 100, label: "Maximum", icon: "💪💪💪💪💪" },
      emotionalReserve: { level: 90, label: "Very High", icon: "🧊🧊🧊🧊🧊" },
      speed: { level: 50, label: "Medium", icon: "⚡⚡" },
      riskTolerance: { level: 35, label: "Low", icon: "🎲🎲" }
    },
    strengths: [
      "Builds generational wealth and lasting dynasties",
      "Strategic resource management at the highest level",
      "Creates infrastructure that outlasts a single lifetime",
      "Unstoppable patient accumulation of power"
    ],
    shadows: [
      "Ruthless in pursuit of power and empire",
      "Emotionally unavailable to everyone close",
      "Hoards resources and controls with iron grip",
      "Never satisfied — always needs more"
    ],
    careerSignatures: [
      "Dynasty Founder",
      "Conglomerate CEO",
      "Political Power Broker",
      "Institutional Builder",
      "Real Estate Mogul"
    ],
    relationshipStyle: {
      pursuit: "Strategic positioning — partnership serves the empire",
      commitmentSpeed: "Very slow — analyzes dynastic potential",
      passion: "Power-oriented, material generosity",
      conflict: "Ruthless strategic domination",
      jealousy: "High — what's mine stays mine"
    },
    famousExamples: [
      {
        name: "Jeff Bezos",
        birthdate: "January 12",
        degree: "~16.42° Capricorn",
        notes: "Empire builder through strategy"
      },
      {
        name: "Dolly Parton",
        birthdate: "January 19",
        degree: "~18.29° Capricorn",
        notes: "Built entertainment empire with warmth"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "A girl surreptitiously bathing in the nude",
      interpretation: "Peak Venus-Saturn fusion — beneath the empire builder's disciplined exterior lies hidden sensuality and aesthetic appreciation for life's beauty."
    },
    nakshatra: {
      name: "Shravana",
      range: "10° - 23°20' Capricorn (sidereal)",
      ruler: "Moon",
      symbol: "Three Footprints / Ear",
      deity: "Vishnu (The Preserver)",
      qualities: ["Empire preservation", "Strategic listening", "Dynasty building"]
    },
    colorTheme: {
      primary: "#3E2723",
      secondary: "#1B1B1B",
      gradient: "linear-gradient(135deg, #3E2723 0%, #1B1B1B 100%)"
    }
  },

  {
    id: 5,
    name: "The Perfectionist Leader",
    archetype: "The Flawless Executive",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 290,
      absoluteEnd: 294.99
    },
    dateRange: {
      start: "January 11",
      end: "January 15",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable Earth)",
      primaryRuler: "Saturn",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Capricorn",
        type: "Core",
        planet: "Saturn",
        percentage: 70,
        traits: ["Strategic mastery", "Disciplined perfection", "System building", "Authority", "Work ethic"]
      },
      {
        source: "Virgo",
        type: "Decan Blend",
        planet: "Mercury",
        percentage: 30,
        traits: ["Analytical precision", "Perfectionism", "Detail orientation", "Critical thinking", "Systematic improvement"]
      }
    ],
    qualities: {
      ambition: { level: 90, label: "Very High", icon: "🏔️🏔️🏔️🏔️🏔️" },
      discipline: { level: 95, label: "Very High", icon: "⚙️⚙️⚙️⚙️⚙️" },
      strategicThinking: { level: 95, label: "Very High", icon: "♟️♟️♟️♟️♟️" },
      responsibility: { level: 95, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      patience: { level: 95, label: "Very High", icon: "🕰️🕰️🕰️🕰️🕰️" },
      statusConsciousness: { level: 80, label: "High", icon: "👑👑👑👑" },
      workEthic: { level: 100, label: "Maximum", icon: "💪💪💪💪💪" },
      emotionalReserve: { level: 85, label: "Very High", icon: "🧊🧊🧊🧊" },
      speed: { level: 65, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 30, label: "Low", icon: "🎲🎲" }
    },
    strengths: [
      "Perfect strategic execution — flawless systems creation",
      "Analytical empire building with attention to every detail",
      "Masters craft through relentless disciplined improvement",
      "Combines big-picture vision with microscopic precision"
    ],
    shadows: [
      "Perfectionist paralysis — nothing is ever good enough",
      "Hyper-critical of self and everyone around",
      "Workaholic burnout from impossible standards",
      "Cannot tolerate incompetence in others"
    ],
    careerSignatures: [
      "Quality Assurance Director",
      "Systems Architect",
      "Precision Engineer",
      "Medical Specialist",
      "Corporate Efficiency Consultant"
    ],
    relationshipStyle: {
      pursuit: "Analytical and methodical — proves competence first",
      commitmentSpeed: "Slow — must meet exacting standards",
      passion: "Disciplined devotion expressed through acts of service",
      conflict: "Criticizes flaws systematically, then withdraws",
      jealousy: "Medium — analyzes threat level rationally"
    },
    famousExamples: [
      {
        name: "LeBron James",
        birthdate: "December 30",
        degree: "~21.15° Capricorn",
        notes: "Perfected craft through relentless discipline"
      },
      {
        name: "Kate Moss",
        birthdate: "January 16",
        degree: "~23.18° Capricorn",
        notes: "Analytical career mastery"
      }
    ],
    sabianSymbol: {
      degree: 22,
      symbol: "By accepting defeat gracefully, a general reveals nobility of character",
      interpretation: "Mercury-Virgo influence brings analytical precision to Saturnian strategy. The perfectionist leader masters both success and graceful adaptation."
    },
    nakshatra: {
      name: "Dhanishta",
      range: "23°20' Capricorn - 6°40' Aquarius (sidereal)",
      ruler: "Mars",
      symbol: "Drum / Flute",
      deity: "Eight Vasus (Gods of Abundance)",
      qualities: ["Precise mastery", "Analytical excellence", "Perfected achievement"]
    },
    colorTheme: {
      primary: "#4A4A4A",
      secondary: "#696969",
      gradient: "linear-gradient(135deg, #4A4A4A 0%, #696969 100%)"
    }
  },

  {
    id: 6,
    name: "The Revolutionary Pragmatist",
    archetype: "The Revolutionary Builder",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 295,
      absoluteEnd: 299.99
    },
    dateRange: {
      start: "January 16",
      end: "January 19",
      duration: "~4 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable Earth)",
      primaryRuler: "Saturn",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Capricorn",
        type: "Core",
        planet: "Saturn",
        percentage: 75,
        traits: ["Strategic structure", "Disciplined innovation", "Systemic reform", "Authority", "Pragmatic vision"]
      },
      {
        source: "Aquarius",
        type: "Cusp Bleed",
        planet: "Uranus",
        percentage: 25,
        traits: ["Revolutionary innovation", "Intellectual depth", "Humanitarian vision", "Unconventional methods", "Future-thinking"]
      }
    ],
    qualities: {
      ambition: { level: 90, label: "Very High", icon: "🏔️🏔️🏔️🏔️🏔️" },
      discipline: { level: 85, label: "Very High", icon: "⚙️⚙️⚙️⚙️" },
      strategicThinking: { level: 95, label: "Very High", icon: "♟️♟️♟️♟️♟️" },
      responsibility: { level: 85, label: "Very High", icon: "⚖️⚖️⚖️⚖️" },
      patience: { level: 85, label: "Very High", icon: "🕰️🕰️🕰️🕰️" },
      statusConsciousness: { level: 70, label: "Medium-High", icon: "👑👑👑" },
      workEthic: { level: 90, label: "Very High", icon: "💪💪💪💪💪" },
      emotionalReserve: { level: 80, label: "High", icon: "🧊🧊🧊🧊" },
      speed: { level: 70, label: "Medium-High", icon: "⚡⚡⚡" },
      riskTolerance: { level: 55, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Innovates traditional systems from within",
      "Strategic revolutionary vision that's actually achievable",
      "Builds future infrastructure with practical discipline",
      "Reforms through disciplined pragmatic idealism"
    ],
    shadows: [
      "Cold intellectual distance from emotions",
      "Rebels against own traditions paradoxically",
      "Control issues around innovation and change",
      "Workaholic reformer who burns bridges"
    ],
    careerSignatures: [
      "Innovation Director",
      "Tech Industry Leader",
      "Social Enterprise Founder",
      "Infrastructure Reformer",
      "Future-Systems Architect"
    ],
    relationshipStyle: {
      pursuit: "Intellectually stimulating — impresses with vision",
      commitmentSpeed: "Medium — values both freedom and structure",
      passion: "Innovative, intellectually charged, unconventional",
      conflict: "Cold revolutionary logic, detached analysis",
      jealousy: "Low — too intellectual for possessiveness"
    },
    famousExamples: [
      {
        name: "David Bowie",
        birthdate: "January 8",
        degree: "~26.05° Capricorn",
        notes: "Revolutionary with strategic career management"
      },
      {
        name: "Elvis Presley",
        birthdate: "January 8",
        degree: "~27.18° Capricorn",
        notes: "Innovated culture while building empire"
      }
    ],
    sabianSymbol: {
      degree: 27,
      symbol: "A mountain pilgrimage",
      interpretation: "At the Aquarius cusp, Saturnian mastery meets Uranian innovation. The revolutionary pragmatist builds the future on ancient mountain wisdom."
    },
    nakshatra: {
      name: "Dhanishta",
      range: "23°20' Capricorn - 6°40' Aquarius (sidereal)",
      ruler: "Mars",
      symbol: "Drum / Flute",
      deity: "Eight Vasus (Gods of Abundance)",
      qualities: ["Revolutionary discipline", "Innovative mastery", "Pragmatic reform"]
    },
    colorTheme: {
      primary: "#2C3E50",
      secondary: "#34495E",
      gradient: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)"
    }
  }
];

export default capricornZones;
