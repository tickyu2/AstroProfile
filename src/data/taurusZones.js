// Taurus Zone Database
// Complete data structure for all 6 zones across the 30° Taurus spectrum
// MERGED: Original component-compatible structure + updated archive data

export const taurusZones = [
  {
    id: 1,
    name: "The Determined Builder",
    archetype: "The Warrior Who Plants Gardens",
    description: "Aries-Taurus Cusp: Pioneering action meets grounded manifestation",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 30,
      absoluteEnd: 34.99
    },
    dateRange: {
      start: "April 20",
      end: "April 24",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Venus",
      subRuler: "Venus",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Aries",
        type: "Cusp Bleed",
        planet: "Mars",
        percentage: 25,
        traits: ["Initiative", "High energy", "Quick anger", "Impulsiveness", "Courage"]
      },
      {
        source: "Taurus",
        type: "Core",
        planet: "Venus",
        percentage: 75,
        traits: ["Loyalty", "Sensuality", "Building instinct", "Stubbornness", "Material focus"]
      }
    ],
    elementalMix: {
      earth: 75,
      fire: 25
    },
    planetaryRulers: {
      primary: { planet: "Venus", influence: 75, meaning: "Material beauty, sensory pleasure" },
      secondary: { planet: "Mars", influence: 25, meaning: "Initiating action, courage" }
    },
    qualities: {
      practicalSkills: { level: 90, label: "Very High", icon: "🔨🔨🔨🔨🔨" },
      sensoryAwareness: { level: 90, label: "Very High", icon: "🌹🌹🌹🌹🌹" },
      loyalty: { level: 85, label: "High", icon: "💎💎💎💎" },
      materialFocus: { level: 85, label: "High", icon: "💰💰💰💰" },
      aestheticSense: { level: 90, label: "Very High", icon: "🎨🎨🎨🎨🎨" },
      reliability: { level: 90, label: "Very High", icon: "🏛️🏛️🏛️🏛️🏛️" },
      speed: { level: 70, label: "High", icon: "💨💨💨💨" },
      patience: { level: 85, label: "High", icon: "⏳⏳⏳⏳" },
      stubbornness: { level: 90, label: "Very High", icon: "🐂🐂🐂🐂🐂" },
      riskTolerance: { level: 55, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Courageously manifests vision",
      "Determined persistent builder",
      "Takes action on practical goals",
      "Independent yet grounded",
      "Initiates with follow-through"
    ],
    shadows: [
      "Impulsively stubborn",
      "Possessive of initiatives",
      "Aggressive about comfort",
      "Difficulty compromising",
      "Hot-tempered when pushed"
    ],
    careerSignatures: [
      "Entrepreneurship",
      "Athletics & Physical Training",
      "Leadership Roles",
      "Creative Fields (Vision + Execution)",
      "Building Businesses from Scratch"
    ],
    relationshipStyle: {
      pursuit: "Active - makes first move",
      commitmentSpeed: "6 months - 1 year",
      passion: "High intensity + sensuality",
      conflict: "Will argue/fight in the moment",
      jealousy: "Present and openly expressed"
    },
    famousExamples: [
      {
        name: "David Beckham",
        birthdate: "",
        degree: "~1.48° Taurus",
        notes: "Determined athletic builder"
      },
      {
        name: "Dwayne 'The Rock' Johnson",
        birthdate: "",
        degree: "~3.15° Taurus",
        notes: "Courageous persistent success"
      }
    ],
    sabianSymbol: {
      degree: 3,
      symbol: "Steps up to a lawn blooming with clover",
      interpretation: "Active creation of abundance through persistent effort (not passive waiting). The 'steps UP' implies movement and initiative—you don't wait for beauty to appear; you create the conditions for it."
    },
    nakshatra: {
      name: "Krittika",
      range: "26°40' Aries - 10° Taurus (sidereal)",
      ruler: "Sun",
      symbol: "Razor / Flame",
      deity: "Agni (Fire God)",
      qualities: ["Sharp", "Purifying", "Cutting through illusions", "Direct", "No-nonsense"]
    },
    colorTheme: {
      primary: "#8B4513",
      secondary: "#A0522D",
      gradient: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)"
    }
  },

  {
    id: 2,
    name: "The Sensory Master",
    archetype: "The Architect of Empires",
    description: "Pure Taurus: Maximum groundedness, sensory awareness, and material mastery",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 35,
      absoluteEnd: 39.99
    },
    dateRange: {
      start: "April 25",
      end: "April 29",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Venus",
      subRuler: "Venus",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Taurus",
        type: "Pure Venus",
        planet: "Venus",
        percentage: 100,
        traits: ["Sensuality", "Beauty appreciation", "Building instinct", "Loyalty", "Steadiness"]
      }
    ],
    elementalMix: {
      earth: 100
    },
    planetaryRulers: {
      primary: { planet: "Venus", influence: 100, meaning: "Pure Venusian energy - beauty, pleasure, material comfort, values" }
    },
    qualities: {
      practicalSkills: { level: 100, label: "Maximum", icon: "🔨🔨🔨🔨🔨" },
      sensoryAwareness: { level: 100, label: "Maximum", icon: "🌹🌹🌹🌹🌹" },
      loyalty: { level: 100, label: "Maximum", icon: "💎💎💎💎💎" },
      materialFocus: { level: 100, label: "Maximum", icon: "💰💰💰💰💰" },
      aestheticSense: { level: 100, label: "Maximum", icon: "🎨🎨🎨🎨🎨" },
      reliability: { level: 100, label: "Maximum", icon: "🏛️🏛️🏛️🏛️🏛️" },
      speed: { level: 50, label: "Medium", icon: "💨💨💨" },
      patience: { level: 100, label: "Maximum", icon: "⏳⏳⏳⏳⏳" },
      stubbornness: { level: 100, label: "Maximum", icon: "🐂🐂🐂🐂🐂" },
      riskTolerance: { level: 25, label: "Low", icon: "🎲" }
    },
    strengths: [
      "Masters material world completely",
      "Exquisite sensory refinement",
      "Infinite patient persistence",
      "Absolutely reliable and loyal",
      "Creates lasting beauty and wealth"
    ],
    shadows: [
      "Impossibly stubborn - cannot change",
      "Possessive to point of controlling",
      "Hedonistic material obsession",
      "Lazy when comfortable",
      "Explosive rage when pushed"
    ],
    careerSignatures: [
      "Architecture & Interior Design",
      "Fine Dining & Culinary Arts",
      "Fashion & Textiles",
      "Real Estate Development",
      "Music (Voice, String Instruments)"
    ],
    relationshipStyle: {
      pursuit: "Shows interest through acts of service and gifts",
      commitmentSpeed: "1-2 years",
      passion: "Deeply sensual - touch, smell, taste primary",
      conflict: "Avoidant - prefers harmony",
      jealousy: "Present but controlled"
    },
    famousExamples: [
      {
        name: "Adele",
        birthdate: "",
        degree: "~6.42° Taurus",
        notes: "Sensory vocal mastery, loyal"
      },
      {
        name: "Cher",
        birthdate: "",
        degree: "~8.15° Taurus",
        notes: "Material beauty, persistent longevity"
      }
    ],
    sabianSymbol: {
      degree: 8,
      symbol: "A sleigh on land uncovered by snow",
      interpretation: "Adapting resources to current conditions; making the best of what you have with practical ingenuity."
    },
    nakshatra: {
      name: "Krittika",
      range: "26°40' Aries - 10° Taurus (sidereal)",
      ruler: "Sun",
      symbol: "Razor / Flame",
      deity: "Agni (Fire God)",
      qualities: ["Purifying", "Sharp discrimination", "Nurturing fire", "Focused energy"]
    },
    colorTheme: {
      primary: "#228B22",
      secondary: "#006400",
      gradient: "linear-gradient(135deg, #228B22 0%, #006400 100%)"
    }
  },

  {
    id: 3,
    name: "The Practical Perfectionist",
    archetype: "The Immovable Force of Nature",
    description: "Taurus-Virgo blend: Material mastery meets analytical precision",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 40,
      absoluteEnd: 44.99
    },
    dateRange: {
      start: "April 30",
      end: "May 4",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed)",
      primaryRuler: "Venus",
      subRuler: "Mercury",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Taurus",
        type: "Peak Taurus",
        planet: "Venus",
        percentage: 90,
        traits: ["Maximum sensuality", "Extreme loyalty", "Deep patience", "Unshakeable stability"]
      },
      {
        source: "Virgo",
        type: "Mercury Sub-ruler",
        planet: "Mercury",
        percentage: 10,
        traits: ["Analysis", "Perfectionism", "Service orientation", "Health consciousness"]
      }
    ],
    elementalMix: {
      earth: 85,
      mercurialEarth: 15
    },
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Material beauty" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Analytical precision, skill" }
    },
    qualities: {
      practicalSkills: { level: 100, label: "Maximum", icon: "🔨🔨🔨🔨🔨" },
      sensoryAwareness: { level: 95, label: "Very High", icon: "🌹🌹🌹🌹🌹" },
      loyalty: { level: 95, label: "Very High", icon: "💎💎💎💎💎" },
      materialFocus: { level: 90, label: "Very High", icon: "💰💰💰💰💰" },
      aestheticSense: { level: 90, label: "Very High", icon: "🎨🎨🎨🎨🎨" },
      reliability: { level: 100, label: "Maximum", icon: "🏛️🏛️🏛️🏛️🏛️" },
      speed: { level: 55, label: "Medium", icon: "💨💨💨" },
      patience: { level: 100, label: "Maximum", icon: "⏳⏳⏳⏳⏳" },
      stubbornness: { level: 95, label: "Very High", icon: "🐂🐂🐂🐂🐂" },
      riskTolerance: { level: 20, label: "Low", icon: "🎲" }
    },
    strengths: [
      "Perfects material craft",
      "Analytical quality mastery",
      "Patient meticulous builder",
      "Reliable precise execution",
      "Creates flawless beauty"
    ],
    shadows: [
      "Perfectionist paralysis",
      "Impossibly stubborn standards",
      "Critical of imperfection",
      "Slow methodical process",
      "Cannot tolerate waste"
    ],
    careerSignatures: [
      "Master Craftsperson (Woodworking, Pottery, Metalwork)",
      "Agriculture & Vineyards",
      "Banking & Wealth Management",
      "Culinary Arts (Chef, Baker)",
      "Opera Singer / Voice Actor"
    ],
    relationshipStyle: {
      pursuit: "SLOW - might take 5 years to make a move",
      commitmentSpeed: "3-5 years",
      passion: "Marathon not sprint - deeply sensual",
      conflict: "Avoidance + eternal grudge",
      jealousy: "Intense but silent"
    },
    famousExamples: [
      {
        name: "Mark Zuckerberg",
        birthdate: "",
        degree: "~11.23° Taurus",
        notes: "Analytical practical builder"
      },
      {
        name: "Megan Fox",
        birthdate: "",
        degree: "~13.05° Taurus",
        notes: "Perfectionist aesthetic precision"
      }
    ],
    sabianSymbol: {
      degree: 13,
      symbol: "A porter carrying heavy baggage",
      interpretation: "Accepting the weight of responsibility with endurance; building strength through persistent effort over time."
    },
    nakshatra: {
      name: "Rohini",
      range: "10° - 23°20' Taurus (sidereal)",
      ruler: "Moon",
      symbol: "Ox Cart / Chariot",
      deity: "Brahma (Creator)",
      qualities: ["Fertile", "Creative", "Beautiful", "Magnetic", "Nurturing"]
    },
    colorTheme: {
      primary: "#556B2F",
      secondary: "#6B8E23",
      gradient: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)"
    }
  },

  {
    id: 4,
    name: "The Wealth Builder",
    archetype: "Perfection Through Repetition",
    description: "Taurus-Capricorn blend: Sensory pleasure meets strategic ambition",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 45,
      absoluteEnd: 49.99
    },
    dateRange: {
      start: "May 5",
      end: "May 9",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed)",
      primaryRuler: "Venus",
      subRuler: "Mercury",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Taurus",
        type: "Core",
        planet: "Venus",
        percentage: 75,
        traits: ["Sensuality", "Loyalty", "Building instinct", "Patience"]
      },
      {
        source: "Virgo",
        type: "Mercury Peak",
        planet: "Mercury",
        percentage: 25,
        traits: ["Perfectionism", "Analysis", "Precision", "Service", "Health focus"]
      }
    ],
    elementalMix: {
      earth: 70,
      saturnianEarth: 30
    },
    planetaryRulers: {
      primary: { planet: "Venus", influence: 60, meaning: "Material comfort" },
      secondary: { planet: "Saturn", influence: 40, meaning: "Strategic accumulation, mastery" }
    },
    qualities: {
      practicalSkills: { level: 95, label: "Very High", icon: "🔨🔨🔨🔨🔨" },
      sensoryAwareness: { level: 85, label: "High", icon: "🌹🌹🌹🌹" },
      loyalty: { level: 90, label: "Very High", icon: "💎💎💎💎💎" },
      materialFocus: { level: 100, label: "Maximum", icon: "💰💰💰💰💰" },
      aestheticSense: { level: 80, label: "High", icon: "🎨🎨🎨🎨" },
      reliability: { level: 100, label: "Maximum", icon: "🏛️🏛️🏛️🏛️🏛️" },
      speed: { level: 50, label: "Medium", icon: "💨💨💨" },
      patience: { level: 100, label: "Maximum", icon: "⏳⏳⏳⏳⏳" },
      stubbornness: { level: 95, label: "Very High", icon: "🐂🐂🐂🐂🐂" },
      riskTolerance: { level: 30, label: "Low-Medium", icon: "🎲🎲" }
    },
    strengths: [
      "Builds generational wealth",
      "Strategic material mastery",
      "Patient methodical accumulation",
      "Disciplined sensory pleasure",
      "Creates lasting empire"
    ],
    shadows: [
      "Ruthlessly materialistic",
      "Hoards resources",
      "Uses people for wealth",
      "Workaholic accumulation",
      "Never satisfied with enough"
    ],
    careerSignatures: [
      "Precision Crafts (Watchmaking, Instrument-making)",
      "Healthcare (Nursing, Physical Therapy, Nutrition)",
      "Editing & Proofreading",
      "Quality Control",
      "Research & Historical Preservation"
    ],
    relationshipStyle: {
      pursuit: "Methodical and careful",
      commitmentSpeed: "2-4 years",
      passion: "Refined sensuality with attention to detail",
      conflict: "Analyzes and worries rather than fighting",
      jealousy: "Controlled but present"
    },
    famousExamples: [
      {
        name: "George Clooney",
        birthdate: "",
        degree: "~16.29° Taurus",
        notes: "Strategic wealth builder"
      },
      {
        name: "Gigi Hadid",
        birthdate: "",
        degree: "~18.05° Taurus",
        notes: "Disciplined material success"
      }
    ],
    sabianSymbol: {
      degree: 18,
      symbol: "A woman airing an old bag through a sunny window",
      interpretation: "Bringing hidden resources into light; renewal through exposure to fresh perspectives while maintaining what's valuable."
    },
    nakshatra: {
      name: "Rohini",
      range: "10° - 23°20' Taurus (sidereal)",
      ruler: "Moon",
      symbol: "Ox Cart / Chariot",
      deity: "Brahma (Creator)",
      qualities: ["Creative excellence", "Beautiful refinement", "Fertile imagination", "Nurturing perfection"]
    },
    colorTheme: {
      primary: "#2F4F2F",
      secondary: "#3C5A3C",
      gradient: "linear-gradient(135deg, #2F4F2F 0%, #3C5A3C 100%)"
    }
  },

  {
    id: 5,
    name: "The Loyal Nurturer",
    archetype: "The Empire Builder",
    description: "Taurus-Cancer blend: Material security meets emotional nurturing",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 50,
      absoluteEnd: 54.99
    },
    dateRange: {
      start: "May 10",
      end: "May 14",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable)",
      primaryRuler: "Venus",
      subRuler: "Saturn",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Taurus",
        type: "Core",
        planet: "Venus",
        percentage: 70,
        traits: ["Sensuality", "Loyalty", "Building instinct", "Material focus"]
      },
      {
        source: "Capricorn",
        type: "Saturn Sub-ruler",
        planet: "Saturn",
        percentage: 30,
        traits: ["Ambition", "Structure", "Discipline", "Legacy thinking", "Authority"]
      }
    ],
    elementalMix: {
      earth: 75,
      water: 25
    },
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Material comfort" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional nurturing, home" }
    },
    qualities: {
      practicalSkills: { level: 90, label: "Very High", icon: "🔨🔨🔨🔨🔨" },
      sensoryAwareness: { level: 90, label: "Very High", icon: "🌹🌹🌹🌹🌹" },
      loyalty: { level: 100, label: "Maximum", icon: "💎💎💎💎💎" },
      materialFocus: { level: 85, label: "High", icon: "💰💰💰💰" },
      aestheticSense: { level: 85, label: "High", icon: "🎨🎨🎨🎨" },
      reliability: { level: 100, label: "Maximum", icon: "🏛️🏛️🏛️🏛️🏛️" },
      speed: { level: 55, label: "Medium", icon: "💨💨💨" },
      patience: { level: 100, label: "Maximum", icon: "⏳⏳⏳⏳⏳" },
      stubbornness: { level: 90, label: "Very High", icon: "🐂🐂🐂🐂🐂" },
      riskTolerance: { level: 30, label: "Low-Medium", icon: "🎲🎲" }
    },
    strengths: [
      "Nurtures through material comfort",
      "Creates beautiful safe homes",
      "Fiercely loyal protector",
      "Patient emotional grounding",
      "Reliable family foundation"
    ],
    shadows: [
      "Smotheringly possessive",
      "Hoards for emotional security",
      "Stubborn about family ways",
      "Difficulty letting go",
      "Materialistic nurturing"
    ],
    careerSignatures: [
      "Business Ownership (Multi-generational)",
      "Real Estate Empires",
      "Finance & Investment Strategy",
      "Law (Contracts, Estate Planning)",
      "Academia & Politics"
    ],
    relationshipStyle: {
      pursuit: "Strategic - 'courts' rather than 'dates'",
      commitmentSpeed: "1-2 years",
      passion: "Present but scheduled around responsibilities",
      conflict: "Endures difficult relationships if they serve goals",
      jealousy: "About assets/partnership more than emotion"
    },
    famousExamples: [
      {
        name: "Pierce Brosnan",
        birthdate: "",
        degree: "~21.15° Taurus",
        notes: "Loyal nurturing presence"
      },
      {
        name: "Penélope Cruz",
        birthdate: "",
        degree: "~23.42° Taurus",
        notes: "Sensory emotional artistry"
      }
    ],
    sabianSymbol: {
      degree: 23,
      symbol: "A jewelry shop filled with valuable gems",
      interpretation: "Accumulated wealth through patient effort; understanding that true value requires time, protection, and proper presentation."
    },
    nakshatra: {
      name: "Mrigashira",
      range: "23°20' Taurus - 6°40' Gemini (sidereal)",
      ruler: "Mars",
      symbol: "Deer's Head",
      deity: "Soma (Moon God)",
      qualities: ["Searching", "Questing", "Gentle strength", "Creative intelligence"]
    },
    colorTheme: {
      primary: "#8FBC8F",
      secondary: "#90EE90",
      gradient: "linear-gradient(135deg, #8FBC8F 0%, #90EE90 100%)"
    }
  },

  {
    id: 6,
    name: "The Versatile Builder",
    archetype: "The Articulate Builder",
    description: "Taurus-Gemini cusp: Material mastery meets mental agility",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 55,
      absoluteEnd: 59.99
    },
    dateRange: {
      start: "May 15",
      end: "May 20",
      duration: "~6 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable)",
      primaryRuler: "Venus",
      subRuler: "Saturn",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Taurus",
        type: "Core",
        planet: "Venus",
        percentage: 75,
        traits: ["Sensuality", "Loyalty", "Building instinct", "Material values"]
      },
      {
        source: "Gemini",
        type: "Cusp Anticipation",
        planet: "Mercury",
        percentage: 25,
        traits: ["Communication", "Mental agility", "Curiosity", "Adaptability", "Networking"]
      }
    ],
    elementalMix: {
      earth: 75,
      air: 25
    },
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Material beauty" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Communication, versatility" }
    },
    qualities: {
      practicalSkills: { level: 90, label: "Very High", icon: "🔨🔨🔨🔨🔨" },
      sensoryAwareness: { level: 85, label: "High", icon: "🌹🌹🌹🌹" },
      loyalty: { level: 75, label: "High", icon: "💎💎💎💎" },
      materialFocus: { level: 80, label: "High", icon: "💰💰💰💰" },
      aestheticSense: { level: 90, label: "Very High", icon: "🎨🎨🎨🎨🎨" },
      reliability: { level: 85, label: "High", icon: "🏛️🏛️🏛️🏛️" },
      speed: { level: 65, label: "Medium", icon: "💨💨💨" },
      patience: { level: 80, label: "High", icon: "⏳⏳⏳⏳" },
      stubbornness: { level: 75, label: "High", icon: "🐂🐂🐂🐂" },
      riskTolerance: { level: 40, label: "Low-Medium", icon: "🎲🎲" }
    },
    strengths: [
      "Communicates practical wisdom",
      "Versatile material skills",
      "Articulates values clearly",
      "Adapts while staying grounded",
      "Balances security with exploration"
    ],
    shadows: [
      "Scattered material focus",
      "Less committed than pure Taurus",
      "Rationalizes indulgence",
      "Difficulty with depth",
      "Wants both security and variety"
    ],
    careerSignatures: [
      "Communications & PR (Luxury Goods)",
      "Teaching & Education",
      "Sales (High-end Products)",
      "Writing & Content Creation",
      "Media (Podcasting, Radio, TV)"
    ],
    relationshipStyle: {
      pursuit: "Talks way into relationships - wit and conversation",
      commitmentSpeed: "1-2 years",
      passion: "Needs intellectual + physical connection",
      conflict: "Will actually discuss problems",
      jealousy: "More concerned with emotional than physical infidelity"
    },
    famousExamples: [
      {
        name: "Bing Crosby",
        birthdate: "",
        degree: "~26.05° Taurus",
        notes: "Versatile practical artistry"
      },
      {
        name: "Tina Fey",
        birthdate: "",
        degree: "~27.18° Taurus",
        notes: "Smart grounded communication"
      }
    ],
    sabianSymbol: {
      degree: 28,
      symbol: "A woman pursued by mature romance",
      interpretation: "Recognition that true love requires maturity, patience, and the courage to be pursued by deeper connection rather than fleeting attraction."
    },
    nakshatra: {
      name: "Mrigashira",
      range: "23°20' Taurus - 6°40' Gemini (sidereal)",
      ruler: "Mars",
      symbol: "Deer's Head",
      deity: "Soma (Moon God)",
      qualities: ["Questing mind", "Gentle communication", "Searching intelligence", "Curious exploration"]
    },
    colorTheme: {
      primary: "#9ACD32",
      secondary: "#ADFF2F",
      gradient: "linear-gradient(135deg, #9ACD32 0%, #ADFF2F 100%)"
    }
  }
];

export default taurusZones;
