// Pisces Zone Database
// Complete data structure for all 6 zones across the 30° Pisces spectrum
// Water Sign: Transcendent, spiritual, compassionate, dissolving
// Ruled by Neptune + Jupiter: Dissolution + expansion, mysticism + wisdom

export const piscesZones = [
  {
    id: 1,
    name: "The Visionary Mystic",
    archetype: "The Spiritual Innovator",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 330,
      absoluteEnd: 334.99
    },
    dateRange: {
      start: "February 19",
      end: "February 23",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Neptune",
      subRuler: "Jupiter",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Aquarius",
        type: "Cusp Bleed",
        planet: "Uranus",
        percentage: 25,
        traits: ["Revolutionary spirituality", "Intellectual vision", "Humanitarian ideals", "Future sight", "Innovative mysticism"]
      },
      {
        source: "Pisces",
        type: "Core",
        planet: "Neptune",
        percentage: 75,
        traits: ["Spiritual transcendence", "Compassionate vision", "Mystical intuition", "Dissolving boundaries", "Creative imagination"]
      }
    ],
    qualities: {
      spiritualConnection: { level: 90, label: "Very High", icon: "🔮🔮🔮🔮🔮" },
      compassion: { level: 90, label: "Very High", icon: "💗💗💗💗💗" },
      empathy: { level: 90, label: "Very High", icon: "🤲🤲🤲🤲🤲" },
      intuition: { level: 90, label: "Very High", icon: "👁️👁️👁️👁️👁️" },
      imagination: { level: 85, label: "Very High", icon: "🌈🌈🌈🌈" },
      artisticExpression: { level: 85, label: "Very High", icon: "🎨🎨🎨🎨" },
      selflessness: { level: 85, label: "Very High", icon: "🕊️🕊️🕊️🕊️" },
      boundaryDissolution: { level: 80, label: "High", icon: "🌊🌊🌊🌊" },
      speed: { level: 75, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 75, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Visionary spiritual innovation with intellectual depth",
      "Compassionate revolutionary thought that uplifts humanity",
      "Mystical future sight that bridges science and spirit",
      "Balances Aquarian objectivity with Piscean transcendence"
    ],
    shadows: [
      "Lost in utopian spiritual ideals that never manifest",
      "Intellectualizes mysticism instead of embodying it",
      "Detached from emotional reality while chasing visions",
      "Impractical visionary dreams that lack grounding"
    ],
    careerSignatures: [
      "Visionary Tech Founder",
      "Spiritual Innovation Director",
      "Humanitarian Artist",
      "Music Industry Visionary",
      "Consciousness Researcher"
    ],
    relationshipStyle: {
      pursuit: "Visionary and inspiring — attracts through cosmic charisma",
      commitmentSpeed: "Medium — needs intellectual and spiritual alignment",
      passion: "Innovative spiritual connection with electric sparks",
      conflict: "Retreats into visionary idealism, avoids confrontation",
      jealousy: "Low — Aquarius influence keeps possessiveness light"
    },
    famousExamples: [
      {
        name: "Rihanna",
        birthdate: "February 20",
        degree: "~0.82° Pisces",
        notes: "Visionary artistic innovation with humanitarian vision"
      },
      {
        name: "Steve Jobs",
        birthdate: "February 24",
        degree: "~3.06° Pisces",
        notes: "Mystical visionary who revolutionized technology"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "In a crowded marketplace farmers and middlemen display a great variety of products",
      interpretation: "At the Aquarius-Pisces cusp, revolutionary vision meets spiritual abundance. The visionary mystic channels cosmic creativity into the material marketplace."
    },
    nakshatra: {
      name: "Purva Bhadrapada",
      range: "20° Aquarius - 3°20' Pisces (sidereal)",
      ruler: "Jupiter",
      symbol: "Front Legs of Funeral Cot / Sword",
      deity: "Aja Ekapada (One-Footed Serpent)",
      qualities: ["Spiritual fire", "Transformative vision", "Mystical innovation"]
    },
    colorTheme: {
      primary: "#9370DB",
      secondary: "#8A2BE2",
      gradient: "linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Mystic",
    archetype: "The Divine Channel",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 335,
      absoluteEnd: 339.99
    },
    dateRange: {
      start: "February 24",
      end: "February 28",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Neptune",
      subRuler: "Jupiter",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Pisces",
        type: "Core",
        planet: "Neptune",
        percentage: 100,
        traits: ["Maximum transcendence", "Universal compassion", "Pure mysticism", "Total boundary dissolution", "Divine channel"]
      }
    ],
    qualities: {
      spiritualConnection: { level: 100, label: "Maximum", icon: "🔮🔮🔮🔮🔮" },
      compassion: { level: 100, label: "Maximum", icon: "💗💗💗💗💗" },
      empathy: { level: 100, label: "Maximum", icon: "🤲🤲🤲🤲🤲" },
      intuition: { level: 100, label: "Maximum", icon: "👁️👁️👁️👁️👁️" },
      imagination: { level: 100, label: "Maximum", icon: "🌈🌈🌈🌈🌈" },
      artisticExpression: { level: 100, label: "Maximum", icon: "🎨🎨🎨🎨🎨" },
      selflessness: { level: 100, label: "Maximum", icon: "🕊️🕊️🕊️🕊️🕊️" },
      boundaryDissolution: { level: 100, label: "Maximum", icon: "🌊🌊🌊🌊🌊" },
      speed: { level: 60, label: "Medium-High", icon: "⚡⚡⚡" },
      riskTolerance: { level: 80, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Channels divine universal love in its purest form",
      "Transcends all ego boundaries — merges with the infinite",
      "Creates transcendent art that touches the soul",
      "Infinite compassion for all beings without exception"
    ],
    shadows: [
      "Lost in spiritual realms, unable to function materially",
      "No boundaries — absorbs all pain from the world",
      "Extreme escapism and avoidance of harsh reality",
      "Martyr complex — sacrifices self for everyone else"
    ],
    careerSignatures: [
      "Spiritual Healer",
      "Transcendent Artist",
      "Mystical Musician",
      "Compassion Counselor",
      "Visionary Filmmaker"
    ],
    relationshipStyle: {
      pursuit: "Soul-level magnetism — attracts through divine presence",
      commitmentSpeed: "Flows naturally — trusts the universe's timing",
      passion: "Oceanic emotional depth, total soul merging",
      conflict: "Dissolves into avoidance, absorbs partner's pain",
      jealousy: "Low — too universal in love for possessiveness"
    },
    famousExamples: [
      {
        name: "Kurt Cobain",
        birthdate: "February 20",
        degree: "~6.57° Pisces",
        notes: "Mystical artist channeling transcendent pain into art"
      },
      {
        name: "Albert Einstein",
        birthdate: "March 14",
        degree: "~8.11° Pisces",
        notes: "Transcendent cosmic vision that unified physics"
      }
    ],
    sabianSymbol: {
      degree: 7,
      symbol: "Illumined by a shaft of light, a large cross lies on rocks surrounded by sea mist",
      interpretation: "Pure Neptunian mysticism — the divine channel where spirit and matter intersect. The pure mystic receives illumination through surrender."
    },
    nakshatra: {
      name: "Uttara Bhadrapada",
      range: "3°20' - 16°40' Pisces (sidereal)",
      ruler: "Saturn",
      symbol: "Back Legs of Funeral Cot / Serpent in Water",
      deity: "Ahir Budhnya (Serpent of the Deep)",
      qualities: ["Deep mysticism", "Spiritual surrender", "Universal compassion"]
    },
    colorTheme: {
      primary: "#7B68EE",
      secondary: "#6A5ACD",
      gradient: "linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)"
    }
  },

  {
    id: 3,
    name: "The Emotional Healer",
    archetype: "The Divine Mother",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 340,
      absoluteEnd: 344.99
    },
    dateRange: {
      start: "March 1",
      end: "March 5",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Cardinal Water)",
      primaryRuler: "Neptune",
      subRuler: "Moon",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Pisces",
        type: "Core",
        planet: "Neptune",
        percentage: 85,
        traits: ["Spiritual healing", "Compassionate dissolution", "Mystical intuition", "Transcendent nurturing", "Emotional wisdom"]
      },
      {
        source: "Cancer",
        type: "Decan Blend",
        planet: "Moon",
        percentage: 15,
        traits: ["Nurturing instinct", "Emotional memory", "Protective love", "Sacred sanctuary building", "Maternal compassion"]
      }
    ],
    qualities: {
      spiritualConnection: { level: 95, label: "Maximum", icon: "🔮🔮🔮🔮🔮" },
      compassion: { level: 100, label: "Maximum", icon: "💗💗💗💗💗" },
      empathy: { level: 100, label: "Maximum", icon: "🤲🤲🤲🤲🤲" },
      intuition: { level: 100, label: "Maximum", icon: "👁️👁️👁️👁️👁️" },
      imagination: { level: 90, label: "Very High", icon: "🌈🌈🌈🌈🌈" },
      artisticExpression: { level: 90, label: "Very High", icon: "🎨🎨🎨🎨🎨" },
      selflessness: { level: 95, label: "Maximum", icon: "🕊️🕊️🕊️🕊️🕊️" },
      boundaryDissolution: { level: 90, label: "Very High", icon: "🌊🌊🌊🌊🌊" },
      speed: { level: 55, label: "Medium-High", icon: "⚡⚡⚡" },
      riskTolerance: { level: 65, label: "Medium-High", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Heals emotional wounds through spiritual compassion",
      "Nurtures with universal divine mothering energy",
      "Creates sacred safe spaces for transformation",
      "Psychic emotional understanding that transcends words"
    ],
    shadows: [
      "Smothers others with spiritual care and healing",
      "Absorbs everyone's emotional pain without filtering",
      "Martyrs self endlessly for family and humanity",
      "Cannot maintain healthy emotional boundaries"
    ],
    careerSignatures: [
      "Hospice Spiritual Counselor",
      "Trauma Therapist",
      "Sacred Space Designer",
      "Children's Healing Artist",
      "Emotional Intelligence Coach"
    ],
    relationshipStyle: {
      pursuit: "Nurturing and healing — creates emotional sanctuary",
      commitmentSpeed: "Medium-slow — needs to feel emotionally safe first",
      passion: "Deep emotional oceanic intimacy with psychic bonding",
      conflict: "Absorbs partner's pain, retreats into spiritual healing",
      jealousy: "Medium — Cancer influence adds protective attachment"
    },
    famousExamples: [
      {
        name: "Bruce Willis",
        birthdate: "March 19",
        degree: "~11.29° Pisces",
        notes: "Protective emotional depth beneath tough exterior"
      },
      {
        name: "Daniel Craig",
        birthdate: "March 2",
        degree: "~13.42° Pisces",
        notes: "Emotional depth channeled through intense characters"
      }
    ],
    sabianSymbol: {
      degree: 12,
      symbol: "In the sanctuary of an occult brotherhood, newly initiated members are being examined and their character tested",
      interpretation: "Moon-Cancer influence brings nurturing emotional depth to Neptunian spirituality. The emotional healer creates sacred spaces where souls are tested and transformed."
    },
    nakshatra: {
      name: "Uttara Bhadrapada",
      range: "3°20' - 16°40' Pisces (sidereal)",
      ruler: "Saturn",
      symbol: "Back Legs of Funeral Cot / Serpent in Water",
      deity: "Ahir Budhnya (Serpent of the Deep)",
      qualities: ["Emotional healing", "Sacred nurturing", "Spiritual mothering"]
    },
    colorTheme: {
      primary: "#9966CC",
      secondary: "#BA55D3",
      gradient: "linear-gradient(135deg, #9966CC 0%, #BA55D3 100%)"
    }
  },

  {
    id: 4,
    name: "The Compassionate Transformer",
    archetype: "The Spiritual Alchemist",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 345,
      absoluteEnd: 349.99
    },
    dateRange: {
      start: "March 6",
      end: "March 10",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Cardinal Water)",
      primaryRuler: "Neptune",
      subRuler: "Pluto",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Pisces",
        type: "Core",
        planet: "Neptune",
        percentage: 70,
        traits: ["Spiritual transcendence", "Compassionate dissolution", "Mystical depth", "Universal love", "Psychic sensitivity"]
      },
      {
        source: "Scorpio",
        type: "Decan Blend",
        planet: "Pluto",
        percentage: 30,
        traits: ["Transformative power", "Depth psychology", "Spiritual alchemy", "Regeneration", "Shadow integration"]
      }
    ],
    qualities: {
      spiritualConnection: { level: 95, label: "Maximum", icon: "🔮🔮🔮🔮🔮" },
      compassion: { level: 95, label: "Maximum", icon: "💗💗💗💗💗" },
      empathy: { level: 95, label: "Maximum", icon: "🤲🤲🤲🤲🤲" },
      intuition: { level: 100, label: "Maximum", icon: "👁️👁️👁️👁️👁️" },
      imagination: { level: 85, label: "Very High", icon: "🌈🌈🌈🌈" },
      artisticExpression: { level: 95, label: "Maximum", icon: "🎨🎨🎨🎨🎨" },
      selflessness: { level: 90, label: "Very High", icon: "🕊️🕊️🕊️🕊️🕊️" },
      boundaryDissolution: { level: 85, label: "Very High", icon: "🌊🌊🌊🌊" },
      speed: { level: 50, label: "Medium", icon: "⚡⚡" },
      riskTolerance: { level: 80, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Transforms darkness into spiritual light through compassion",
      "Profound spiritual healing that reaches the deepest wounds",
      "Psychic depth psychology that sees through all facades",
      "Compassionate intensity that regenerates broken souls"
    ],
    shadows: [
      "Lost in shadow depths of the collective unconscious",
      "Obsessive spiritual seeking that never finds rest",
      "Martyrdom through relentless transformation of others",
      "Absorbs collective darkness and struggles to release it"
    ],
    careerSignatures: [
      "Depth Psychologist",
      "Spiritual Alchemist",
      "Transformative Healer",
      "Dark Arts Creative Director",
      "Crisis Intervention Specialist"
    ],
    relationshipStyle: {
      pursuit: "Intense spiritual magnetism — draws souls into transformation",
      commitmentSpeed: "Slow — needs to plumb the depths of compatibility",
      passion: "Volcanic spiritual intensity beneath oceanic surface",
      conflict: "Penetrates to root causes, transforms through confrontation",
      jealousy: "Medium-high — Scorpio influence adds possessive depth"
    },
    famousExamples: [
      {
        name: "Johnny Cash",
        birthdate: "February 26",
        degree: "~16.23° Pisces",
        notes: "Transformed personal darkness into redemptive art"
      },
      {
        name: "Michael Caine",
        birthdate: "March 14",
        degree: "~18.47° Pisces",
        notes: "Deep transformative depth in every role"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "An Easter promenade",
      interpretation: "Peak Neptune-Pluto fusion — spiritual death and resurrection. The compassionate transformer walks the path of spiritual alchemy, dying and being reborn."
    },
    nakshatra: {
      name: "Revati",
      range: "16°40' - 30° Pisces (sidereal)",
      ruler: "Mercury",
      symbol: "Fish / Drum",
      deity: "Pushan (The Nourisher)",
      qualities: ["Spiritual transformation", "Soul alchemy", "Regenerative compassion"]
    },
    colorTheme: {
      primary: "#663399",
      secondary: "#4B0082",
      gradient: "linear-gradient(135deg, #663399 0%, #4B0082 100%)"
    }
  },

  {
    id: 5,
    name: "The Divine Artist",
    archetype: "The Divine Artist",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 350,
      absoluteEnd: 354.99
    },
    dateRange: {
      start: "March 11",
      end: "March 15",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Fixed Water)",
      primaryRuler: "Neptune",
      subRuler: "Pluto",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Pisces",
        type: "Core",
        planet: "Neptune",
        percentage: 70,
        traits: ["Divine creativity", "Spiritual artistry", "Transcendent beauty", "Cosmic imagination", "Emotional channeling"]
      },
      {
        source: "Scorpio",
        type: "Decan Peak",
        planet: "Pluto",
        percentage: 30,
        traits: ["Emotional intensity", "Deep feeling", "Transformative art", "Passionate expression", "Soul-depth creativity"]
      }
    ],
    qualities: {
      spiritualConnection: { level: 90, label: "Very High", icon: "🔮🔮🔮🔮🔮" },
      compassion: { level: 100, label: "Maximum", icon: "💗💗💗💗💗" },
      empathy: { level: 100, label: "Maximum", icon: "🤲🤲🤲🤲🤲" },
      intuition: { level: 95, label: "Maximum", icon: "👁️👁️👁️👁️👁️" },
      imagination: { level: 100, label: "Maximum", icon: "🌈🌈🌈🌈🌈" },
      artisticExpression: { level: 100, label: "Maximum", icon: "🎨🎨🎨🎨🎨" },
      selflessness: { level: 95, label: "Maximum", icon: "🕊️🕊️🕊️🕊️🕊️" },
      boundaryDissolution: { level: 95, label: "Maximum", icon: "🌊🌊🌊🌊🌊" },
      speed: { level: 55, label: "Medium-High", icon: "⚡⚡⚡" },
      riskTolerance: { level: 70, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Channels divine creativity into transcendent art",
      "Creates beauty from the deepest emotional and spiritual wells",
      "Nurtures humanity through artistic spiritual expression",
      "Infinite compassionate expression that heals through beauty"
    ],
    shadows: [
      "Lost in an artistic dreamworld disconnected from reality",
      "Extreme emotional sensitivity that overwhelms daily life",
      "Addictive artistic escapism as avoidance mechanism",
      "Martyrs self completely for the sake of art"
    ],
    careerSignatures: [
      "Transcendent Visual Artist",
      "Film Auteur",
      "Spiritual Choreographer",
      "Sacred Music Composer",
      "Poetry Laureate"
    ],
    relationshipStyle: {
      pursuit: "Creates beauty for the beloved — art as love language",
      commitmentSpeed: "Medium — follows the muse and emotional flow",
      passion: "Oceanic emotional depth expressed through creative acts",
      conflict: "Retreats into artistic world, processes through creation",
      jealousy: "Medium — emotional depth adds sensitivity to betrayal"
    },
    famousExamples: [
      {
        name: "Drew Barrymore",
        birthdate: "February 22",
        degree: "~21.23° Pisces",
        notes: "Emotional artistic expression with redemptive arc"
      },
      {
        name: "Queen Latifah",
        birthdate: "March 18",
        degree: "~23.18° Pisces",
        notes: "Compassionate creative power across multiple art forms"
      }
    ],
    sabianSymbol: {
      degree: 22,
      symbol: "A prophet carrying tablets of the new law is walking down the slopes of Mount Sinai",
      interpretation: "Peak Scorpio-water influence — the divine artist descends from spiritual heights carrying transcendent beauty into the world. Art as sacred scripture."
    },
    nakshatra: {
      name: "Revati",
      range: "16°40' - 30° Pisces (sidereal)",
      ruler: "Mercury",
      symbol: "Fish / Drum",
      deity: "Pushan (The Nourisher)",
      qualities: ["Divine artistry", "Creative transcendence", "Emotional mastery through art"]
    },
    colorTheme: {
      primary: "#DDA0DD",
      secondary: "#EE82EE",
      gradient: "linear-gradient(135deg, #DDA0DD 0%, #EE82EE 100%)"
    }
  },

  {
    id: 6,
    name: "The Cosmic Initiator",
    archetype: "The Spiritual Warrior",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 355,
      absoluteEnd: 359.99
    },
    dateRange: {
      start: "March 16",
      end: "March 20",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Fixed Water)",
      primaryRuler: "Neptune",
      subRuler: "Mars",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Pisces",
        type: "Core",
        planet: "Neptune",
        percentage: 75,
        traits: ["Spiritual transcendence", "Compassionate action", "Mystical courage", "Dissolving limitations", "Visionary initiative"]
      },
      {
        source: "Aries",
        type: "Cusp Bleed",
        planet: "Mars",
        percentage: 25,
        traits: ["Warrior courage", "Pioneering spirit", "Decisive action", "Fearless faith", "Initiating fire"]
      }
    ],
    qualities: {
      spiritualConnection: { level: 85, label: "Very High", icon: "🔮🔮🔮🔮" },
      compassion: { level: 90, label: "Very High", icon: "💗💗💗💗💗" },
      empathy: { level: 90, label: "Very High", icon: "🤲🤲🤲🤲🤲" },
      intuition: { level: 90, label: "Very High", icon: "👁️👁️👁️👁️👁️" },
      imagination: { level: 90, label: "Very High", icon: "🌈🌈🌈🌈🌈" },
      artisticExpression: { level: 85, label: "Very High", icon: "🎨🎨🎨🎨" },
      selflessness: { level: 85, label: "Very High", icon: "🕊️🕊️🕊️🕊️" },
      boundaryDissolution: { level: 80, label: "High", icon: "🌊🌊🌊🌊" },
      speed: { level: 70, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 90, label: "Very High", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Courageously acts on spiritual vision without hesitation",
      "Pioneers mystical paths others fear to walk",
      "Compassionate warrior who fights for the vulnerable",
      "Balances transcendence with decisive fiery action"
    ],
    shadows: [
      "Impulsive spiritual action without grounding",
      "Martyrs self in spiritual battles and crusades",
      "Aggressive about mystical beliefs and spirituality",
      "Restless even in transcendence — always initiating the next quest"
    ],
    careerSignatures: [
      "Spiritual Movement Leader",
      "Activist Artist",
      "Pioneering Healer",
      "Martial Arts Philosopher",
      "Social Justice Visionary"
    ],
    relationshipStyle: {
      pursuit: "Bold spiritual courtship — fearless declaration of soul connection",
      commitmentSpeed: "Medium-fast — Aries fire accelerates Piscean flow",
      passion: "Fiery spiritual intensity with oceanic emotional depth",
      conflict: "Direct confrontation tempered by compassion",
      jealousy: "Medium — Mars adds protective fire to Piscean love"
    },
    famousExamples: [
      {
        name: "Lady Gaga",
        birthdate: "March 28",
        degree: "~26.53° Pisces",
        notes: "Courageous artistic spiritual expression with warrior energy"
      },
      {
        name: "James Taylor",
        birthdate: "March 12",
        degree: "~28.42° Pisces",
        notes: "Pioneering spiritual folk music with gentle fire"
      }
    ],
    sabianSymbol: {
      degree: 27,
      symbol: "The harvest moon illumines a clear autumnal sky",
      interpretation: "At the Aries cusp, Neptunian mysticism meets Martian courage. The cosmic initiator harvests spiritual wisdom and charges forward into new beginnings."
    },
    nakshatra: {
      name: "Revati",
      range: "16°40' - 30° Pisces (sidereal)",
      ruler: "Mercury",
      symbol: "Fish / Drum",
      deity: "Pushan (The Nourisher)",
      qualities: ["Spiritual courage", "Pioneering mysticism", "Compassionate initiation"]
    },
    colorTheme: {
      primary: "#DA70D6",
      secondary: "#FF69B4",
      gradient: "linear-gradient(135deg, #DA70D6 0%, #FF69B4 100%)"
    }
  }
];

export default piscesZones;
