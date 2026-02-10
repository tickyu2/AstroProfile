// Aquarius Zone Database
// Complete data structure for all 6 zones across the 30° Aquarius spectrum
// Air Sign: Revolutionary, innovative, humanitarian, intellectual
// Ruled by Uranus + Saturn: Innovation + structure, revolution + discipline

export const aquariusZones = [
  {
    id: 1,
    name: "The Pragmatic Innovator",
    archetype: "The Pragmatic Visionary",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 300,
      absoluteEnd: 304.99
    },
    dateRange: {
      start: "January 20",
      end: "January 24",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Fixed)",
      primaryRuler: "Saturn",
      subRuler: "Saturn",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Capricorn",
        type: "Cusp Bleed",
        planet: "Saturn",
        percentage: 25,
        traits: ["Strategic discipline", "Pragmatic grounding", "Structural thinking", "Ambitious planning", "Patient execution"]
      },
      {
        source: "Aquarius",
        type: "Core",
        planet: "Uranus",
        percentage: 75,
        traits: ["Revolutionary innovation", "Intellectual depth", "Humanitarian vision", "Unconventional methods", "Future-thinking"]
      }
    ],
    qualities: {
      revolutionaryThinking: { level: 85, label: "Very High", icon: "🔬🔬🔬🔬" },
      intellectualDepth: { level: 90, label: "Very High", icon: "🧠🧠🧠🧠🧠" },
      humanitarianism: { level: 80, label: "High", icon: "🌍🌍🌍🌍" },
      unconventionality: { level: 75, label: "High", icon: "⚡⚡⚡⚡" },
      detachment: { level: 75, label: "High", icon: "🧊🧊🧊🧊" },
      innovation: { level: 90, label: "Very High", icon: "💡💡💡💡💡" },
      groupOrientation: { level: 75, label: "High", icon: "👥👥👥👥" },
      rebelliousness: { level: 70, label: "Medium-High", icon: "✊✊✊" },
      speed: { level: 80, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 70, label: "Medium-High", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Strategic revolutionary planning with pragmatic grounding",
      "Builds innovative systems that actually work in practice",
      "Disciplined idealism — turns visions into infrastructure",
      "Balances Saturnian structure with Uranian innovation"
    ],
    shadows: [
      "Cold intellectual distance from emotional reality",
      "Control issues around innovation and creative freedom",
      "Workaholic revolutionary who never rests",
      "Judgmental of 'old ways' and traditional thinking"
    ],
    careerSignatures: [
      "Innovation Director",
      "Technology Strategist",
      "Social Enterprise Founder",
      "Systems Reform Architect",
      "Think Tank Fellow"
    ],
    relationshipStyle: {
      pursuit: "Intellectually stimulating — impresses with visionary ideas and pragmatic plans",
      commitmentSpeed: "Medium — values both freedom and structured partnership",
      passion: "Intellectual depth with strategic warmth from Capricorn cusp",
      conflict: "Detached logical analysis, seeks innovative resolution",
      jealousy: "Low — too focused on ideas for possessiveness"
    },
    famousExamples: [
      {
        name: "Oprah Winfrey",
        birthdate: "January 29",
        degree: "~0.52° Aquarius",
        notes: "Strategic humanitarian empire built through pragmatic innovation"
      },
      {
        name: "Christian Bale",
        birthdate: "January 30",
        degree: "~3.18° Aquarius",
        notes: "Disciplined method innovation with transformative intensity"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "An old adobe mission in California",
      interpretation: "At the Capricorn-Aquarius cusp, strategic structure gives way to humanitarian vision. The pragmatic innovator builds new systems on proven foundations."
    },
    nakshatra: {
      name: "Dhanishta",
      range: "23°20' Capricorn - 6°40' Aquarius (sidereal)",
      ruler: "Mars",
      symbol: "Drum / Flute",
      deity: "Eight Vasus (Gods of Abundance)",
      qualities: ["Pragmatic innovation", "Rhythmic discipline", "Structured revolution"]
    },
    colorTheme: {
      primary: "#4169E1",
      secondary: "#1E90FF",
      gradient: "linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Revolutionary",
    archetype: "The Genius Visionary",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 305,
      absoluteEnd: 309.99
    },
    dateRange: {
      start: "January 25",
      end: "January 29",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Fixed)",
      primaryRuler: "Uranus",
      subRuler: "Saturn",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Aquarius",
        type: "Core",
        planet: "Uranus",
        percentage: 100,
        traits: ["Maximum revolutionary vision", "Pure intellectual genius", "Ultimate humanitarian drive", "Complete unconventionality", "Lightning innovation"]
      }
    ],
    qualities: {
      revolutionaryThinking: { level: 100, label: "Maximum", icon: "🔬🔬🔬🔬🔬" },
      intellectualDepth: { level: 100, label: "Maximum", icon: "🧠🧠🧠🧠🧠" },
      humanitarianism: { level: 100, label: "Maximum", icon: "🌍🌍🌍🌍🌍" },
      unconventionality: { level: 100, label: "Maximum", icon: "⚡⚡⚡⚡⚡" },
      detachment: { level: 100, label: "Maximum", icon: "🧊🧊🧊🧊🧊" },
      innovation: { level: 100, label: "Maximum", icon: "💡💡💡💡💡" },
      groupOrientation: { level: 95, label: "Maximum", icon: "👥👥👥👥👥" },
      rebelliousness: { level: 95, label: "Maximum", icon: "✊✊✊✊✊" },
      speed: { level: 90, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 85, label: "Very High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Visionary genius — sees the future others cannot imagine",
      "Revolutionary humanitarian impact that changes the world",
      "Completely objective and logical in all analysis",
      "Innovates impossible solutions through lightning insight"
    ],
    shadows: [
      "Emotionally alien and distant from loved ones",
      "Cannot relate to 'normal' people or everyday concerns",
      "Stubbornly fixed on revolutionary ideals at all costs",
      "Lost in the future, ignores the needs of the present"
    ],
    careerSignatures: [
      "Revolutionary Inventor",
      "Theoretical Physicist",
      "Visionary Tech Founder",
      "Humanitarian Organization Leader",
      "Radical Social Reformer"
    ],
    relationshipStyle: {
      pursuit: "Intellectually dazzling — attracts through genius and originality",
      commitmentSpeed: "Very slow — freedom is non-negotiable",
      passion: "Cerebral intensity with electric unpredictability",
      conflict: "Cold revolutionary logic, completely detached analysis",
      jealousy: "Very low — too evolved for possessiveness"
    },
    famousExamples: [
      {
        name: "Thomas Edison",
        birthdate: "February 11",
        degree: "~6.25° Aquarius",
        notes: "Revolutionary inventor who transformed civilization"
      },
      {
        name: "Charles Darwin",
        birthdate: "February 12",
        degree: "~8.43° Aquarius",
        notes: "Revolutionary scientific vision that changed humanity"
      }
    ],
    sabianSymbol: {
      degree: 7,
      symbol: "A child is seen being born out of an egg",
      interpretation: "Pure Uranian genius — the completely new emerges from the cosmic egg. The pure revolutionary births ideas never before conceived."
    },
    nakshatra: {
      name: "Dhanishta / Shatabhisha",
      range: "6°40' - 20° Aquarius (sidereal)",
      ruler: "Rahu",
      symbol: "Empty Circle / Hundred Physicians",
      deity: "Varuna (God of Cosmic Waters)",
      qualities: ["Pure genius", "Humanitarian healing", "Revolutionary breakthrough"]
    },
    colorTheme: {
      primary: "#00BFFF",
      secondary: "#87CEEB",
      gradient: "linear-gradient(135deg, #00BFFF 0%, #87CEEB 100%)"
    }
  },

  {
    id: 3,
    name: "The Social Innovator",
    archetype: "The Idea Spreader",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 310,
      absoluteEnd: 314.99
    },
    dateRange: {
      start: "January 30",
      end: "February 3",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Mutable)",
      primaryRuler: "Uranus",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Aquarius",
        type: "Core",
        planet: "Uranus",
        percentage: 85,
        traits: ["Revolutionary innovation", "Intellectual brilliance", "Humanitarian vision", "Unconventional communication", "Future-thinking"]
      },
      {
        source: "Gemini",
        type: "Decan Blend",
        planet: "Mercury",
        percentage: 15,
        traits: ["Versatile communication", "Mental agility", "Social networking", "Idea dissemination", "Curious exploration"]
      }
    ],
    qualities: {
      revolutionaryThinking: { level: 90, label: "Very High", icon: "🔬🔬🔬🔬🔬" },
      intellectualDepth: { level: 90, label: "Very High", icon: "🧠🧠🧠🧠🧠" },
      humanitarianism: { level: 85, label: "Very High", icon: "🌍🌍🌍🌍" },
      unconventionality: { level: 90, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      detachment: { level: 85, label: "Very High", icon: "🧊🧊🧊🧊" },
      innovation: { level: 95, label: "Maximum", icon: "💡💡💡💡💡" },
      groupOrientation: { level: 90, label: "Very High", icon: "👥👥👥👥👥" },
      rebelliousness: { level: 80, label: "High", icon: "✊✊✊✊" },
      speed: { level: 95, label: "Maximum", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 80, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Communicates revolutionary ideas with brilliant clarity",
      "Networks diverse innovators into powerful collaborations",
      "Spreads progressive ideas widely through versatile media",
      "Adapts innovation to reach any audience effectively"
    ],
    shadows: [
      "Scattered revolutionary focus across too many projects",
      "Superficial idea hopping without deep follow-through",
      "Intellectualizes everything including personal emotions",
      "Cannot commit to one cause long enough to finish it"
    ],
    careerSignatures: [
      "Tech Evangelist",
      "Science Communicator",
      "Social Media Innovator",
      "Progressive Journalist",
      "Innovation Network Founder"
    ],
    relationshipStyle: {
      pursuit: "Witty and intellectually playful — communicates interest through ideas",
      commitmentSpeed: "Medium — needs mental stimulation to stay engaged",
      passion: "Quick-witted, mentally electric, endlessly curious",
      conflict: "Intellectualizes disagreements, debates rather than fights",
      jealousy: "Low — Mercurial restlessness keeps things light"
    },
    famousExamples: [
      {
        name: "Ashton Kutcher",
        birthdate: "February 7",
        degree: "~11.37° Aquarius",
        notes: "Tech innovation combined with mass communication"
      },
      {
        name: "Ed Sheeran",
        birthdate: "February 17",
        degree: "~13.15° Aquarius",
        notes: "Musical innovation spread to global audiences"
      }
    ],
    sabianSymbol: {
      degree: 12,
      symbol: "On a vast staircase stand people of different types, graduated upward",
      interpretation: "Mercury-Gemini influence brings versatile communication to Uranian innovation. The social innovator spreads revolutionary ideas across all levels of society."
    },
    nakshatra: {
      name: "Shatabhisha",
      range: "6°40' - 20° Aquarius (sidereal)",
      ruler: "Rahu",
      symbol: "Empty Circle / Hundred Physicians",
      deity: "Varuna (God of Cosmic Waters)",
      qualities: ["Idea dissemination", "Innovative communication", "Social networking mastery"]
    },
    colorTheme: {
      primary: "#40E0D0",
      secondary: "#48D1CC",
      gradient: "linear-gradient(135deg, #40E0D0 0%, #48D1CC 100%)"
    }
  },

  {
    id: 4,
    name: "The Equality Crusader",
    archetype: "The Equality Champion",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 315,
      absoluteEnd: 319.99
    },
    dateRange: {
      start: "February 4",
      end: "February 8",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Mutable)",
      primaryRuler: "Uranus",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Aquarius",
        type: "Core",
        planet: "Uranus",
        percentage: 70,
        traits: ["Revolutionary equality", "Intellectual activism", "Collective transformation", "Systemic reform", "Egalitarian vision"]
      },
      {
        source: "Gemini",
        type: "Decan Peak",
        planet: "Mercury",
        percentage: 30,
        traits: ["Mass communication", "Idea dissemination", "Intellectual agility", "Teaching ability", "Movement building"]
      }
    ],
    qualities: {
      revolutionaryThinking: { level: 95, label: "Maximum", icon: "🔬🔬🔬🔬🔬" },
      intellectualDepth: { level: 85, label: "Very High", icon: "🧠🧠🧠🧠" },
      humanitarianism: { level: 100, label: "Maximum", icon: "🌍🌍🌍🌍🌍" },
      unconventionality: { level: 90, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      detachment: { level: 90, label: "Very High", icon: "🧊🧊🧊🧊🧊" },
      innovation: { level: 90, label: "Very High", icon: "💡💡💡💡💡" },
      groupOrientation: { level: 100, label: "Maximum", icon: "👥👥👥👥👥" },
      rebelliousness: { level: 90, label: "Very High", icon: "✊✊✊✊✊" },
      speed: { level: 100, label: "Maximum", icon: "⚡⚡⚡⚡⚡" },
      riskTolerance: { level: 85, label: "Very High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Unites humanity around the banner of equality and justice",
      "Networks massive movements through brilliant communication",
      "Spreads revolutionary ideas to global audiences with precision",
      "Intellectually brilliant activism that shifts cultural paradigms"
    ],
    shadows: [
      "Intellectually arrogant toward those who disagree",
      "Emotionally detached from individual people while serving 'humanity'",
      "Scattered across too many causes to be effective in any one",
      "Judges 'unenlightened' people harshly and impatiently"
    ],
    careerSignatures: [
      "Civil Rights Leader",
      "Human Rights Attorney",
      "Equality Movement Founder",
      "Political Activist",
      "Progressive Policy Architect"
    ],
    relationshipStyle: {
      pursuit: "Passionate about shared causes — bonds through ideology and activism",
      commitmentSpeed: "Medium-fast — commits quickly when values align perfectly",
      passion: "Ideologically charged, intellectually electric, cause-driven",
      conflict: "Debates fiercely on principle, emotionally detached in execution",
      jealousy: "Low — collective focus outweighs personal possessiveness"
    },
    famousExamples: [
      {
        name: "Abraham Lincoln",
        birthdate: "February 12",
        degree: "~16.48° Aquarius",
        notes: "The ultimate equality crusader who transformed a nation"
      },
      {
        name: "Rosa Parks",
        birthdate: "February 4",
        degree: "~18.23° Aquarius",
        notes: "Revolutionary equality action that sparked a movement"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "A watchdog stands guard, protecting his master and his possessions",
      interpretation: "Peak Mercury-Gemini fusion — the equality champion guards the rights of all with fierce intellectual vigilance and tireless communication."
    },
    nakshatra: {
      name: "Shatabhisha",
      range: "6°40' - 20° Aquarius (sidereal)",
      ruler: "Rahu",
      symbol: "Empty Circle / Hundred Physicians",
      deity: "Varuna (God of Cosmic Waters)",
      qualities: ["Equality guardianship", "Mass healing", "Collective liberation"]
    },
    colorTheme: {
      primary: "#5F9EA0",
      secondary: "#4682B4",
      gradient: "linear-gradient(135deg, #5F9EA0 0%, #4682B4 100%)"
    }
  },

  {
    id: 5,
    name: "The Diplomatic Revolutionary",
    archetype: "The Diplomatic Reformer",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 320,
      absoluteEnd: 324.99
    },
    dateRange: {
      start: "February 9",
      end: "February 13",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Cardinal)",
      primaryRuler: "Uranus",
      subRuler: "Venus",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Aquarius",
        type: "Core",
        planet: "Uranus",
        percentage: 85,
        traits: ["Revolutionary vision", "Intellectual innovation", "Humanitarian drive", "Progressive reform", "Future orientation"]
      },
      {
        source: "Libra",
        type: "Decan Blend",
        planet: "Venus",
        percentage: 15,
        traits: ["Diplomatic grace", "Aesthetic innovation", "Balanced reform", "Social harmony", "Partnership orientation"]
      }
    ],
    qualities: {
      revolutionaryThinking: { level: 85, label: "Very High", icon: "🔬🔬🔬🔬" },
      intellectualDepth: { level: 85, label: "Very High", icon: "🧠🧠🧠🧠" },
      humanitarianism: { level: 90, label: "Very High", icon: "🌍🌍🌍🌍🌍" },
      unconventionality: { level: 80, label: "High", icon: "⚡⚡⚡⚡" },
      detachment: { level: 80, label: "High", icon: "🧊🧊🧊🧊" },
      innovation: { level: 85, label: "Very High", icon: "💡💡💡💡" },
      groupOrientation: { level: 90, label: "Very High", icon: "👥👥👥👥👥" },
      rebelliousness: { level: 70, label: "Medium-High", icon: "✊✊✊" },
      speed: { level: 85, label: "Very High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 70, label: "Medium-High", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Achieves revolutionary change through diplomatic negotiation",
      "Creates beautiful innovative solutions that win hearts and minds",
      "Balances radical progress with harmonious implementation",
      "Unites opposing sides through intellectual charm and fairness"
    ],
    shadows: [
      "Compromises revolutionary ideals for social approval",
      "Indecisive about radical action when diplomacy is insufficient",
      "Too diplomatic with oppressors who exploit good faith",
      "Intellectualizes emotions instead of feeling them directly"
    ],
    careerSignatures: [
      "Diplomatic Reformer",
      "Arts & Culture Innovator",
      "Design Thinking Consultant",
      "International Relations Specialist",
      "Progressive Community Organizer"
    ],
    relationshipStyle: {
      pursuit: "Charming and intellectually elegant — combines warmth with vision",
      commitmentSpeed: "Medium — values partnership but needs intellectual freedom",
      passion: "Aesthetically refined, intellectually vibrant, romantically innovative",
      conflict: "Seeks fair resolution, diplomatically navigates disagreements",
      jealousy: "Low-medium — Venus adds partnership awareness but Uranus keeps it open"
    },
    famousExamples: [
      {
        name: "Ellen DeGeneres",
        birthdate: "January 26",
        degree: "~21.42° Aquarius",
        notes: "Diplomatic LGBTQ+ revolution through humor and grace"
      },
      {
        name: "Paris Hilton",
        birthdate: "February 17",
        degree: "~23.18° Aquarius",
        notes: "Aesthetic innovation with cultural disruption"
      }
    ],
    sabianSymbol: {
      degree: 22,
      symbol: "A rug is placed on the floor of a nursery to allow children to play in comfort and warmth",
      interpretation: "Venus-Libra influence brings diplomatic warmth to Uranian revolution. The diplomatic reformer creates comfortable spaces for progressive change."
    },
    nakshatra: {
      name: "Purva Bhadrapada",
      range: "20° Aquarius - 3°20' Pisces (sidereal)",
      ruler: "Jupiter",
      symbol: "Front of a Funeral Cot / Two-Faced Man",
      deity: "Aja Ekapada (One-footed Goat)",
      qualities: ["Diplomatic transformation", "Balanced revolution", "Graceful innovation"]
    },
    colorTheme: {
      primary: "#87CEFA",
      secondary: "#B0E0E6",
      gradient: "linear-gradient(135deg, #87CEFA 0%, #B0E0E6 100%)"
    }
  },

  {
    id: 6,
    name: "The Mystical Futurist",
    archetype: "The Spiritual Futurist",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 325,
      absoluteEnd: 329.99
    },
    dateRange: {
      start: "February 14",
      end: "February 18",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Cardinal)",
      primaryRuler: "Uranus",
      subRuler: "Neptune",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Aquarius",
        type: "Core",
        planet: "Uranus",
        percentage: 75,
        traits: ["Revolutionary vision", "Innovative thinking", "Humanitarian drive", "Unconventional spirituality", "Future orientation"]
      },
      {
        source: "Pisces",
        type: "Cusp Bleed",
        planet: "Neptune",
        percentage: 25,
        traits: ["Spiritual transcendence", "Universal compassion", "Mystical intuition", "Artistic vision", "Boundary dissolution"]
      }
    ],
    qualities: {
      revolutionaryThinking: { level: 80, label: "High", icon: "🔬🔬🔬🔬" },
      intellectualDepth: { level: 80, label: "High", icon: "🧠🧠🧠🧠" },
      humanitarianism: { level: 95, label: "Maximum", icon: "🌍🌍🌍🌍🌍" },
      unconventionality: { level: 90, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      detachment: { level: 70, label: "Medium-High", icon: "🧊🧊🧊" },
      innovation: { level: 80, label: "High", icon: "💡💡💡💡" },
      groupOrientation: { level: 85, label: "Very High", icon: "👥👥👥👥" },
      rebelliousness: { level: 75, label: "High", icon: "✊✊✊✊" },
      speed: { level: 75, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 75, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Mystical revolutionary vision that transcends ordinary reality",
      "Compassionate innovation that heals while it transforms",
      "Spiritual humanitarian work that touches the collective soul",
      "Visionary artistic creation that reveals the future"
    ],
    shadows: [
      "Lost in utopian dreams disconnected from practical reality",
      "Impractical visionary ideals that cannot be implemented",
      "Escapist tendencies when the present becomes too painful",
      "Martyrdom complex — sacrifices self for humanity endlessly"
    ],
    careerSignatures: [
      "Visionary Artist",
      "Spiritual Technology Pioneer",
      "Humanitarian Healer",
      "Futurist Author",
      "Consciousness Research Leader"
    ],
    relationshipStyle: {
      pursuit: "Ethereal and intuitive — connects through spiritual and artistic resonance",
      commitmentSpeed: "Slow — dissolves boundaries gradually, merges souls before deciding",
      passion: "Mystical depth with flashes of electric Uranian intensity",
      conflict: "Retreats into inner world, uses compassion to dissolve tension",
      jealousy: "Low — Pisces dissolves ego, Uranus transcends possessiveness"
    },
    famousExamples: [
      {
        name: "Shakira",
        birthdate: "February 2",
        degree: "~26.05° Aquarius",
        notes: "Visionary artistic humanitarian with global compassion"
      },
      {
        name: "Alicia Keys",
        birthdate: "January 25",
        degree: "~27.42° Aquarius",
        notes: "Spiritual revolutionary music that unites humanity"
      }
    ],
    sabianSymbol: {
      degree: 27,
      symbol: "An ancient pottery bowl filled with fresh violets",
      interpretation: "At the Pisces cusp, Uranian innovation meets Neptunian transcendence. The mystical futurist fills ancient spiritual vessels with fresh revolutionary beauty."
    },
    nakshatra: {
      name: "Purva Bhadrapada",
      range: "20° Aquarius - 3°20' Pisces (sidereal)",
      ruler: "Jupiter",
      symbol: "Front of a Funeral Cot / Two-Faced Man",
      deity: "Aja Ekapada (One-footed Goat)",
      qualities: ["Mystical transformation", "Spiritual revolution", "Transcendent vision"]
    },
    colorTheme: {
      primary: "#B0C4DE",
      secondary: "#E0B0FF",
      gradient: "linear-gradient(135deg, #B0C4DE 0%, #E0B0FF 100%)"
    }
  }
];

export default aquariusZones;
