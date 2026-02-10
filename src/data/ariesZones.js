// Aries Zone Database
// Complete data structure for all 6 zones across the 30° Aries spectrum

export const ariesZones = [
  {
    id: 1,
    name: "The Dreamy Pioneer",
    archetype: "The Mystic Warrior",
    description: "Pisces-Aries Cusp: Spiritual compassion meets courageous action",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 0,
      absoluteEnd: 4.99
    },
    dateRange: {
      start: "March 20",
      end: "March 24",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Mars",
      subRuler: "Mars",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Pisces",
        type: "Cusp Bleed",
        planet: "Neptune",
        percentage: 25,
        traits: ["Intuition", "Compassion", "Dreaminess", "Spiritual awareness", "Emotional depth"]
      },
      {
        source: "Aries",
        type: "Core",
        planet: "Mars",
        percentage: 75,
        traits: ["Courage", "Initiative", "Independence", "Directness", "Competitive drive"]
      }
    ],
    elementalMix: {
      fire: 75,
      water: 25
    },
    planetaryRulers: {
      primary: { planet: "Mars", influence: 75, meaning: "Warrior action, courage, initiative" },
      secondary: { planet: "Neptune", influence: 15, meaning: "Spiritual intuition" },
      tertiary: { planet: "Jupiter", influence: 10, meaning: "Compassionate expansion" }
    },
    qualities: {
      courage: { level: 90, label: "Very High", icon: "🗡️🗡️🗡️🗡️🗡️" },
      impulsivity: { level: 85, label: "High", icon: "⚡⚡⚡⚡" },
      competitiveness: { level: 80, label: "High", icon: "🏆🏆🏆🏆" },
      directness: { level: 85, label: "High", icon: "🎯🎯🎯🎯" },
      pioneering: { level: 90, label: "Very High", icon: "🚀🚀🚀🚀🚀" },
      aggression: { level: 75, label: "High", icon: "⚔️⚔️⚔️⚔️" },
      speed: { level: 90, label: "Very High", icon: "💨💨💨💨💨" },
      patience: { level: 30, label: "Low-Medium", icon: "⏳⏳" },
      stubbornness: { level: 70, label: "High", icon: "🐏🐏🐏🐏" },
      riskTolerance: { level: 90, label: "Very High", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Spiritual warrior courage",
      "Intuitive pioneering action",
      "Compassionate leadership",
      "Fights for idealistic causes",
      "Balances vision with action"
    ],
    shadows: [
      "Impulsive spiritual martyrdom",
      "Confused between doing/being",
      "Aggressive about compassion",
      "Difficulty sustaining action",
      "Restless even when peaceful"
    ],
    careerSignatures: [
      "Spiritual Leadership",
      "Healing Professions with Action",
      "Creative Arts (Dance, Music)",
      "Humanitarian Work",
      "Counseling with Advocacy"
    ],
    relationshipStyle: {
      pursuit: "Romantic and passionate - leads with heart",
      commitmentSpeed: "Fast but emotionally deep",
      passion: "Intense emotional + physical connection",
      conflict: "Avoidant initially, then explosive",
      jealousy: "Deep but hidden - suffers in silence"
    },
    famousExamples: [
      {
        name: "Lady Gaga",
        birthdate: "",
        degree: "~3.47° Aries",
        notes: "Spiritual artistic pioneering"
      },
      {
        name: "Elton John",
        birthdate: "",
        degree: "~1.23° Aries",
        notes: "Compassionate creative courage"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "A woman has risen out of the water; a seal is embracing her",
      interpretation: "Emergence from the unconscious (Pisces/water) into conscious action (Aries). The seal represents emotional wisdom accompanying the warrior's journey."
    },
    nakshatra: {
      name: "Ashwini",
      range: "0° - 13°20' Aries (sidereal)",
      ruler: "Ketu (South Node)",
      symbol: "Horse's Head",
      deity: "Ashwini Kumaras (Divine Physicians)",
      qualities: ["Healing power", "Swift action", "Pioneering spirit", "Mystical healing"]
    },
    colorTheme: {
      primary: "#FF6347",
      secondary: "#FF4500",
      gradient: "linear-gradient(135deg, #FF6347 0%, #FF4500 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Warrior",
    archetype: "The Unstoppable Initiator",
    description: "Pure Aries: Maximum courage, initiative, and pioneering action",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 5,
      absoluteEnd: 9.99
    },
    dateRange: {
      start: "March 25",
      end: "March 29",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Mars",
      subRuler: "Mars",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Aries",
        type: "Pure Mars",
        planet: "Mars",
        percentage: 100,
        traits: ["Raw courage", "Pure initiative", "Competitive fire", "Directness", "Independence"]
      }
    ],
    elementalMix: {
      fire: 100
    },
    planetaryRulers: {
      primary: { planet: "Mars", influence: 100, meaning: "Pure Martian energy - raw action, courage, conquest" }
    },
    qualities: {
      courage: { level: 100, label: "Maximum", icon: "🗡️🗡️🗡️🗡️🗡️" },
      impulsivity: { level: 100, label: "Maximum", icon: "⚡⚡⚡⚡⚡" },
      competitiveness: { level: 100, label: "Maximum", icon: "🏆🏆🏆🏆🏆" },
      directness: { level: 100, label: "Maximum", icon: "🎯🎯🎯🎯🎯" },
      pioneering: { level: 100, label: "Maximum", icon: "🚀🚀🚀🚀🚀" },
      aggression: { level: 95, label: "Very High", icon: "⚔️⚔️⚔️⚔️⚔️" },
      speed: { level: 100, label: "Maximum", icon: "💨💨💨💨💨" },
      patience: { level: 10, label: "Very Low", icon: "⏳" },
      stubbornness: { level: 85, label: "High", icon: "🐏🐏🐏🐏" },
      riskTolerance: { level: 100, label: "Maximum", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Absolutely fearless courage",
      "Instant decisive action",
      "Natural born leader",
      "Pioneering trailblazer",
      "Unstoppable when committed"
    ],
    shadows: [
      "Recklessly impulsive",
      "Cannot work with others",
      "Aggressive to point of destructive",
      "Zero patience",
      "Burns out from constant fighting"
    ],
    careerSignatures: [
      "Entrepreneurship (Pure Startup Energy)",
      "Professional Athletics",
      "Military/Law Enforcement",
      "Emergency Services",
      "Competitive Sales"
    ],
    relationshipStyle: {
      pursuit: "Aggressive and direct - pursues intensely",
      commitmentSpeed: "Fast decision, can commit impulsively",
      passion: "Explosive, high-intensity, dominant",
      conflict: "Confronts immediately, fights passionately",
      jealousy: "Possessive and territorial"
    },
    famousExamples: [
      {
        name: "Leonardo da Vinci",
        birthdate: "",
        degree: "~5.01° Aries",
        notes: "Pioneering genius in everything"
      },
      {
        name: "Mariah Carey",
        birthdate: "",
        degree: "~6.48° Aries",
        notes: "Competitive fearless diva"
      }
    ],
    sabianSymbol: {
      degree: 8,
      symbol: "A large hat with streamers flying, facing east",
      interpretation: "Bold self-presentation and readiness to face the new day with confidence and flair. Pure Aries showmanship."
    },
    nakshatra: {
      name: "Ashwini",
      range: "0° - 13°20' Aries (sidereal)",
      ruler: "Ketu",
      symbol: "Horse's Head",
      deity: "Ashwini Kumaras",
      qualities: ["Maximum speed", "Healing through action", "Fearless pioneering"]
    },
    colorTheme: {
      primary: "#DC143C",
      secondary: "#B22222",
      gradient: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)"
    }
  },

  {
    id: 3,
    name: "The Bold Innovator",
    archetype: "The Champion",
    description: "Aries-Leo blend: Pioneering courage meets creative confidence",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 10,
      absoluteEnd: 14.99
    },
    dateRange: {
      start: "March 30",
      end: "April 3",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed)",
      primaryRuler: "Mars",
      subRuler: "Sun",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Aries",
        type: "Core",
        planet: "Mars",
        percentage: 70,
        traits: ["Courage", "Competition", "Initiative"]
      },
      {
        source: "Leo",
        type: "Sun Sub-ruler",
        planet: "Sun",
        percentage: 30,
        traits: ["Pride", "Performance", "Leadership presence", "Creative expression"]
      }
    ],
    elementalMix: {
      fire: 85,
      solarFire: 15
    },
    planetaryRulers: {
      primary: { planet: "Mars", influence: 70, meaning: "Warrior courage" },
      secondary: { planet: "Sun", influence: 30, meaning: "Creative confidence, self-expression" }
    },
    qualities: {
      courage: { level: 95, label: "Very High", icon: "🗡️🗡️🗡️🗡️🗡️" },
      impulsivity: { level: 90, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      competitiveness: { level: 90, label: "Very High", icon: "🏆🏆🏆🏆🏆" },
      directness: { level: 90, label: "Very High", icon: "🎯🎯🎯🎯🎯" },
      pioneering: { level: 95, label: "Very High", icon: "🚀🚀🚀🚀🚀" },
      aggression: { level: 80, label: "High", icon: "⚔️⚔️⚔️⚔️" },
      speed: { level: 100, label: "Maximum", icon: "💨💨💨💨💨" },
      patience: { level: 20, label: "Very Low", icon: "⏳" },
      stubbornness: { level: 85, label: "High", icon: "🐏🐏🐏🐏" },
      riskTolerance: { level: 100, label: "Maximum", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Charismatic bold leadership",
      "Creative pioneering vision",
      "Confident fearless action",
      "Inspires through courage",
      "Generous victor"
    ],
    shadows: [
      "Egotistical competitive need",
      "Must be center of attention",
      "Dramatic impulsive action",
      "Cannot handle criticism",
      "Overestimates abilities"
    ],
    careerSignatures: [
      "Performance Arts (Acting, Music)",
      "Competitive Sports (Individual)",
      "Leadership/Executive Roles",
      "Creative Direction",
      "Public Speaking/Motivational"
    ],
    relationshipStyle: {
      pursuit: "Grand gestures and dramatic courtship",
      commitmentSpeed: "Medium - needs to feel like the prize",
      passion: "Theatrical and intense",
      conflict: "Prideful - won't back down",
      jealousy: "Territorial and dramatic"
    },
    famousExamples: [
      {
        name: "Emma Watson",
        birthdate: "",
        degree: "~11.23° Aries",
        notes: "Bold creative activist"
      },
      {
        name: "Sarah Jessica Parker",
        birthdate: "",
        degree: "~13.42° Aries",
        notes: "Confident pioneering style icon"
      }
    ],
    sabianSymbol: {
      degree: 13,
      symbol: "A bomb which failed to explode is now safely concealed",
      interpretation: "Controlled power. The ability to harness aggressive energy for strategic purposes rather than destructive release."
    },
    nakshatra: {
      name: "Ashwini/Bharani transition",
      range: "13°20' Aries starts Bharani",
      ruler: "Venus (Bharani)",
      symbol: "Yoni (Womb)",
      deity: "Yama (God of Death)",
      qualities: ["Creative power", "Nurturing strength", "Life-death cycles"]
    },
    colorTheme: {
      primary: "#FF0000",
      secondary: "#FF8C00",
      gradient: "linear-gradient(135deg, #FF0000 0%, #FF8C00 100%)"
    }
  },

  {
    id: 4,
    name: "The Adventurous Warrior",
    archetype: "The General",
    description: "Aries-Sagittarius blend: Pioneering action meets philosophical vision",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 15,
      absoluteEnd: 19.99
    },
    dateRange: {
      start: "April 4",
      end: "April 8",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed)",
      primaryRuler: "Mars",
      subRuler: "Sun",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Aries",
        type: "Core",
        planet: "Mars",
        percentage: 65,
        traits: ["Aggression", "Courage", "Initiative"]
      },
      {
        source: "Leo",
        type: "Sun Peak",
        planet: "Sun",
        percentage: 35,
        traits: ["Strategy", "Authority", "Organized leadership", "Regal bearing"]
      }
    ],
    elementalMix: {
      fire: 70,
      jupiterianFire: 30
    },
    planetaryRulers: {
      primary: { planet: "Mars", influence: 60, meaning: "Warrior action" },
      secondary: { planet: "Jupiter", influence: 40, meaning: "Expansive vision, optimism" }
    },
    qualities: {
      courage: { level: 95, label: "Very High", icon: "🗡️🗡️🗡️🗡️🗡️" },
      impulsivity: { level: 95, label: "Very High", icon: "⚡⚡⚡⚡⚡" },
      competitiveness: { level: 85, label: "High", icon: "🏆🏆🏆🏆" },
      directness: { level: 95, label: "Very High", icon: "🎯🎯🎯🎯🎯" },
      pioneering: { level: 100, label: "Maximum", icon: "🚀🚀🚀🚀🚀" },
      aggression: { level: 75, label: "High", icon: "⚔️⚔️⚔️⚔️" },
      speed: { level: 100, label: "Maximum", icon: "💨💨💨💨💨" },
      patience: { level: 25, label: "Very Low", icon: "⏳" },
      stubbornness: { level: 75, label: "High", icon: "🐏🐏🐏🐏" },
      riskTolerance: { level: 100, label: "Maximum", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Fearless adventurous exploration",
      "Philosophical warrior wisdom",
      "Optimistic pioneering spirit",
      "Inspires through bold vision",
      "Conquers new frontiers"
    ],
    shadows: [
      "Recklessly overcommits",
      "Scattered adventurous focus",
      "Preachy about experiences",
      "Cannot sustain commitment",
      "Restless even when winning"
    ],
    careerSignatures: [
      "Military Leadership",
      "Corporate Executive (CEO, COO)",
      "Political Leadership",
      "Project Management",
      "Strategic Consulting"
    ],
    relationshipStyle: {
      pursuit: "Strategic courtship - plans the conquest",
      commitmentSpeed: "Medium - assesses fit carefully",
      passion: "Controlled intensity, dominant",
      conflict: "Strategic withdrawal or calculated attack",
      jealousy: "Possessive but dignified"
    },
    famousExamples: [
      {
        name: "Jackie Chan",
        birthdate: "",
        degree: "~16.15° Aries",
        notes: "Adventurous fearless performer"
      },
      {
        name: "Kate Hudson",
        birthdate: "",
        degree: "~18.29° Aries",
        notes: "Optimistic bold spirit"
      }
    ],
    sabianSymbol: {
      degree: 18,
      symbol: "An empty hammock stretched between two trees",
      interpretation: "Rest between battles. The strategic warrior knows when to fight and when to conserve energy."
    },
    nakshatra: {
      name: "Bharani",
      range: "13°20' - 26°40' Aries (sidereal)",
      ruler: "Venus",
      symbol: "Yoni",
      deity: "Yama",
      qualities: ["Controlled power", "Strategic restraint", "Mature aggression"]
    },
    colorTheme: {
      primary: "#FF4500",
      secondary: "#FF6347",
      gradient: "linear-gradient(135deg, #FF4500 0%, #FF6347 100%)"
    }
  },

  {
    id: 5,
    name: "The Strategic Fighter",
    archetype: "The Explorer",
    description: "Aries-Capricorn blend: Warrior courage meets strategic discipline",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 20,
      absoluteEnd: 24.99
    },
    dateRange: {
      start: "April 9",
      end: "April 13",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable)",
      primaryRuler: "Mars",
      subRuler: "Jupiter",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Aries",
        type: "Core",
        planet: "Mars",
        percentage: 65,
        traits: ["Courage", "Initiative", "Independence"]
      },
      {
        source: "Sagittarius",
        type: "Jupiter Sub-ruler",
        planet: "Jupiter",
        percentage: 35,
        traits: ["Optimism", "Adventure", "Philosophy", "Expansion", "Freedom-seeking"]
      }
    ],
    elementalMix: {
      fire: 75,
      earth: 25
    },
    planetaryRulers: {
      primary: { planet: "Mars", influence: 70, meaning: "Warrior action" },
      secondary: { planet: "Saturn", influence: 30, meaning: "Strategic discipline, mastery" }
    },
    qualities: {
      courage: { level: 90, label: "Very High", icon: "🗡️🗡️🗡️🗡️🗡️" },
      impulsivity: { level: 70, label: "High", icon: "⚡⚡⚡⚡" },
      competitiveness: { level: 95, label: "Very High", icon: "🏆🏆🏆🏆🏆" },
      directness: { level: 85, label: "High", icon: "🎯🎯🎯🎯" },
      pioneering: { level: 80, label: "High", icon: "🚀🚀🚀🚀" },
      aggression: { level: 85, label: "High", icon: "⚔️⚔️⚔️⚔️" },
      speed: { level: 85, label: "High", icon: "💨💨💨💨" },
      patience: { level: 65, label: "Medium", icon: "⏳⏳⏳" },
      stubbornness: { level: 90, label: "Very High", icon: "🐏🐏🐏🐏🐏" },
      riskTolerance: { level: 75, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Strategic warrior leadership",
      "Disciplined courageous action",
      "Climbs to victory methodically",
      "Controlled powerful aggression",
      "Builds through conquest"
    ],
    shadows: [
      "Cold calculated aggression",
      "Uses people strategically",
      "Workaholic warrior",
      "Ruthless ambition",
      "Difficulty with spontaneity"
    ],
    careerSignatures: [
      "Travel Industry",
      "Teaching/Education (Experiential)",
      "Adventure Sports",
      "Philosophy/Religious Leadership",
      "International Business"
    ],
    relationshipStyle: {
      pursuit: "Adventurous and spontaneous",
      commitmentSpeed: "Slow - fears losing freedom",
      passion: "Playful and explorative",
      conflict: "Escapes through humor or leaving",
      jealousy: "Low - trusts partner's freedom"
    },
    famousExamples: [
      {
        name: "Robert Downey Jr.",
        birthdate: "",
        degree: "~21.05° Aries",
        notes: "Strategic career comeback warrior"
      },
      {
        name: "Reese Witherspoon",
        birthdate: "",
        degree: "~22.18° Aries",
        notes: "Disciplined ambitious leader"
      }
    ],
    sabianSymbol: {
      degree: 23,
      symbol: "A woman in pastel colors carrying a heavy and valuable but veiled load",
      interpretation: "Hidden wisdom being carried forward. The explorer bears truth that will eventually be revealed."
    },
    nakshatra: {
      name: "Krittika",
      range: "26°40' Aries - 10° Taurus (sidereal)",
      ruler: "Sun",
      symbol: "Razor/Flame",
      deity: "Agni",
      qualities: ["Purifying fire", "Sharp discrimination", "Adventurous spirit"]
    },
    colorTheme: {
      primary: "#8B0000",
      secondary: "#800000",
      gradient: "linear-gradient(135deg, #8B0000 0%, #800000 100%)"
    }
  },

  {
    id: 6,
    name: "The Grounded Initiator",
    archetype: "The Grounded Warrior",
    description: "Aries-Taurus cusp: Pioneering action meets practical manifestation",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 25,
      absoluteEnd: 29.99
    },
    dateRange: {
      start: "April 14",
      end: "April 19",
      duration: "~6 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable)",
      primaryRuler: "Mars",
      subRuler: "Jupiter",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Aries",
        type: "Core",
        planet: "Mars",
        percentage: 75,
        traits: ["Courage", "Initiative", "Action-orientation"]
      },
      {
        source: "Taurus",
        type: "Cusp Anticipation",
        planet: "Venus",
        percentage: 25,
        traits: ["Practicality", "Patience", "Sensuality", "Building instinct", "Material focus"]
      }
    ],
    elementalMix: {
      fire: 75,
      earth: 25
    },
    planetaryRulers: {
      primary: { planet: "Mars", influence: 70, meaning: "Initiating action" },
      secondary: { planet: "Venus", influence: 30, meaning: "Material manifestation, sensory pleasure" }
    },
    qualities: {
      courage: { level: 85, label: "High", icon: "🗡️🗡️🗡️🗡️" },
      impulsivity: { level: 75, label: "High", icon: "⚡⚡⚡⚡" },
      competitiveness: { level: 80, label: "High", icon: "🏆🏆🏆🏆" },
      directness: { level: 80, label: "High", icon: "🎯🎯🎯🎯" },
      pioneering: { level: 80, label: "High", icon: "🚀🚀🚀🚀" },
      aggression: { level: 70, label: "High", icon: "⚔️⚔️⚔️⚔️" },
      speed: { level: 80, label: "High", icon: "💨💨💨💨" },
      patience: { level: 70, label: "High", icon: "⏳⏳⏳⏳" },
      stubbornness: { level: 95, label: "Very High", icon: "🐏🐏🐏🐏🐏" },
      riskTolerance: { level: 75, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Manifests pioneering vision practically",
      "Patient persistent courage",
      "Enjoys fruits of conquest",
      "Loyal determined warrior",
      "Balances action with grounding"
    ],
    shadows: [
      "Impossibly stubborn",
      "Possessive of victories",
      "Slow to pivot after commitment",
      "Materialistic conquest",
      "Difficulty with change"
    ],
    careerSignatures: [
      "Construction/Real Estate Development",
      "Financial Trading/Investment",
      "Culinary Arts (High-pressure)",
      "Fashion (Bold Design)",
      "Agriculture/Ranching"
    ],
    relationshipStyle: {
      pursuit: "Physical and persistent",
      commitmentSpeed: "Medium - wants stability after conquest",
      passion: "Sensual and dominant",
      conflict: "Stubborn standoffs",
      jealousy: "High - possessive of partner"
    },
    famousExamples: [
      {
        name: "Jessica Alba",
        birthdate: "",
        degree: "~26.42° Aries",
        notes: "Grounded entrepreneurial warrior"
      },
      {
        name: "Keira Knightley",
        birthdate: "",
        degree: "~28.15° Aries",
        notes: "Persistent practical determination"
      }
    ],
    sabianSymbol: {
      degree: 28,
      symbol: "A large disappointed audience",
      interpretation: "Not all battles are won. The transition to Taurus teaches the warrior to build more carefully and consider the audience."
    },
    nakshatra: {
      name: "Krittika",
      range: "26°40' Aries - 10° Taurus (sidereal)",
      ruler: "Sun",
      symbol: "Razor/Flame",
      deity: "Agni",
      qualities: ["Transitional fire", "Building courage", "Grounded passion"]
    },
    colorTheme: {
      primary: "#CD5C5C",
      secondary: "#A0522D",
      gradient: "linear-gradient(135deg, #CD5C5C 0%, #A0522D 100%)"
    }
  }
];

export default ariesZones;
