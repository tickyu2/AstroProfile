// Libra Zone Database
// Complete data structure for all 6 zones across the 30° Libra spectrum
// Air Sign: Balanced, diplomatic, aesthetic, relationship-oriented
// Ruled by Venus: Harmony, beauty, partnership, justice

export const libraZones = [
  {
    id: 1,
    name: "The Graceful Perfectionist",
    archetype: "The Refined Diplomat",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 180,
      absoluteEnd: 184.99
    },
    dateRange: {
      start: "September 23",
      end: "September 27",
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
        source: "Virgo",
        type: "Cusp Bleed",
        planet: "Mercury",
        percentage: 25,
        traits: ["Analytical refinement", "Attention to detail", "Perfectionism", "Practical skills", "Critical thinking"]
      },
      {
        source: "Libra",
        type: "Core",
        planet: "Venus",
        percentage: 75,
        traits: ["Aesthetic harmony", "Diplomatic grace", "Balance-seeking", "Social charm", "Fairness"]
      }
    ],
    qualities: {
      diplomacy: { level: 85, label: "Very High", icon: "🤝🤝🤝🤝" },
      charm: { level: 80, label: "High", icon: "✨✨✨✨" },
      aestheticSense: { level: 90, label: "Very High", icon: "🎨🎨🎨🎨🎨" },
      balanceSeeking: { level: 85, label: "Very High", icon: "⚖️⚖️⚖️⚖️" },
      relationshipFocus: { level: 80, label: "High", icon: "💕💕💕💕" },
      fairness: { level: 90, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      socialGrace: { level: 85, label: "Very High", icon: "🌸🌸🌸🌸" },
      indecisiveness: { level: 80, label: "High", icon: "🔄🔄🔄🔄" },
      speed: { level: 70, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 45, label: "Low-Medium", icon: "🎲🎲" }
    },
    strengths: [
      "Perfect aesthetic judgment: eye for beauty with analytical depth",
      "Tactful problem-solving: diplomatic with high standards",
      "Creates beautiful harmonious systems with precision",
      "Balances art and analysis with refined grace"
    ],
    shadows: [
      "Indecisive perfectionism: overthinks for the 'right' choice",
      "Critical of aesthetic imperfection in self and others",
      "Overthinks social interactions to maintain appearances",
      "People-pleasing despite high personal standards"
    ],
    careerSignatures: [
      "Interior Designer",
      "Diplomatic Consultant",
      "Art Critic/Curator",
      "Quality Assurance Lead",
      "Fashion Stylist"
    ],
    relationshipStyle: {
      pursuit: "Refined and thoughtful — wins through aesthetic charm",
      commitmentSpeed: "Slow-medium — analyzes compatibility carefully",
      passion: "Graceful and attentive with perfectionist care",
      conflict: "Diplomatic analysis, seeks refined solutions",
      jealousy: "Moderate — expresses concerns with tact"
    },
    famousExamples: [
      {
        name: "Will Smith",
        birthdate: "September 25",
        degree: "~0.53° Libra",
        notes: "Charming perfectionist performer"
      },
      {
        name: "Gwyneth Paltrow",
        birthdate: "September 27",
        degree: "~3.42° Libra",
        notes: "Aesthetic precision, wellness focus"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "A butterfly made perfect by a dart through it",
      interpretation: "The paradox of perfecting beauty through stillness. At the Virgo-Libra cusp, analytical precision meets aesthetic grace."
    },
    nakshatra: {
      name: "Chitra",
      range: "23°20' Virgo - 6°40' Libra (sidereal)",
      ruler: "Mars",
      symbol: "Bright Jewel / Pearl",
      deity: "Vishvakarma (Divine Architect)",
      qualities: ["Creative design", "Beauty architecture", "Artisan mastery"]
    },
    colorTheme: {
      primary: "#FFB6C1",
      secondary: "#FFC0CB",
      gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Harmonizer",
    archetype: "The Ultimate Harmonizer",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 185,
      absoluteEnd: 189.99
    },
    dateRange: {
      start: "September 28",
      end: "October 2",
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
        source: "Libra",
        type: "Core",
        planet: "Venus",
        percentage: 100,
        traits: ["Absolute harmony", "Perfect balance", "Maximum charm", "Complete fairness", "Social perfection"]
      }
    ],
    qualities: {
      diplomacy: { level: 100, label: "Maximum", icon: "🤝🤝🤝🤝🤝" },
      charm: { level: 100, label: "Maximum", icon: "✨✨✨✨✨" },
      aestheticSense: { level: 100, label: "Maximum", icon: "🎨🎨🎨🎨🎨" },
      balanceSeeking: { level: 100, label: "Maximum", icon: "⚖️⚖️⚖️⚖️⚖️" },
      relationshipFocus: { level: 100, label: "Maximum", icon: "💕💕💕💕💕" },
      fairness: { level: 100, label: "Maximum", icon: "⚖️⚖️⚖️⚖️⚖️" },
      socialGrace: { level: 100, label: "Maximum", icon: "🌸🌸🌸🌸🌸" },
      indecisiveness: { level: 95, label: "Very High", icon: "🔄🔄🔄🔄🔄" },
      speed: { level: 60, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 40, label: "Low-Medium", icon: "🎲🎲" }
    },
    strengths: [
      "Creates perfect harmony in any environment",
      "Sees all perspectives with equal clarity",
      "Ultimate diplomatic peacemaker: resolves all conflict",
      "Exquisite aesthetic taste and social sophistication"
    ],
    shadows: [
      "Paralyzed by seeing all sides equally — cannot decide",
      "Lost without a partner — needs relationships to feel whole",
      "Avoids necessary conflict to maintain surface peace",
      "Identity crisis from mirroring others too completely"
    ],
    careerSignatures: [
      "Diplomat/Ambassador",
      "Mediator/Arbitrator",
      "Fashion Designer",
      "Couples Counselor",
      "Art Gallery Director"
    ],
    relationshipStyle: {
      pursuit: "Magnetic and harmonious — irresistible social grace",
      commitmentSpeed: "Slow — weighs every option endlessly",
      passion: "Devoted, attentive, seeks perfect partnership",
      conflict: "Avoids at all costs — people-pleases for peace",
      jealousy: "Low outward — suppresses for harmony"
    },
    famousExamples: [
      {
        name: "John Lennon",
        birthdate: "October 9",
        degree: "~6.03° Libra",
        notes: "Peace and harmony advocate"
      },
      {
        name: "Kim Kardashian",
        birthdate: "October 21",
        degree: "~8.42° Libra",
        notes: "Aesthetic perfection, relationship-focused"
      }
    ],
    sabianSymbol: {
      degree: 7,
      symbol: "A woman feeding chickens and protecting them from the hawks",
      interpretation: "The nurturing protector of harmony. Pure Venus energy — maintaining peace through graceful vigilance."
    },
    nakshatra: {
      name: "Swati",
      range: "6°40' - 20° Libra (sidereal)",
      ruler: "Rahu",
      symbol: "Young Plant Blown by Wind",
      deity: "Vayu (Wind God)",
      qualities: ["Independence", "Flexibility", "Balance in movement"]
    },
    colorTheme: {
      primary: "#FF69B4",
      secondary: "#FFB6C1",
      gradient: "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)"
    }
  },

  {
    id: 3,
    name: "The Social Innovator",
    archetype: "The Justice Advocate",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 190,
      absoluteEnd: 194.99
    },
    dateRange: {
      start: "October 3",
      end: "October 7",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed Air)",
      primaryRuler: "Venus",
      subRuler: "Uranus",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Libra",
        type: "Core",
        planet: "Venus",
        percentage: 70,
        traits: ["Social harmony", "Diplomatic grace", "Beauty sense", "Partnership", "Charm"]
      },
      {
        source: "Aquarius",
        type: "Decan Blend",
        planet: "Uranus",
        percentage: 30,
        traits: ["Revolutionary ideas", "Innovation", "Social justice", "Intellectual depth", "Independence"]
      }
    ],
    qualities: {
      diplomacy: { level: 85, label: "Very High", icon: "🤝🤝🤝🤝" },
      charm: { level: 90, label: "Very High", icon: "✨✨✨✨✨" },
      aestheticSense: { level: 85, label: "Very High", icon: "🎨🎨🎨🎨" },
      balanceSeeking: { level: 80, label: "High", icon: "⚖️⚖️⚖️⚖️" },
      relationshipFocus: { level: 75, label: "High", icon: "💕💕💕💕" },
      fairness: { level: 95, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      socialGrace: { level: 85, label: "Very High", icon: "🌸🌸🌸🌸" },
      indecisiveness: { level: 70, label: "Medium-High", icon: "🔄🔄🔄" },
      speed: { level: 75, label: "Medium-High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 55, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Progressive diplomatic vision: fights for justice with grace",
      "Innovative relationship models that challenge convention",
      "Intellectual charm that inspires social movements",
      "Balances tradition with forward-thinking progress"
    ],
    shadows: [
      "Detached from emotions: overly intellectual in relationships",
      "Idealistic about partnerships to the point of impracticality",
      "Judgmental of people deemed 'unfair' or unjust",
      "Erratic commitment: torn between freedom and partnership"
    ],
    careerSignatures: [
      "Social Justice Advocate",
      "Human Rights Lawyer",
      "Progressive Politician",
      "Tech Ethics Consultant",
      "Community Organizer"
    ],
    relationshipStyle: {
      pursuit: "Intellectual and principled — attracts through vision",
      commitmentSpeed: "Medium — must align on values",
      passion: "Intellectually stimulating, principled devotion",
      conflict: "Fights diplomatically for social principles",
      jealousy: "Low — values freedom alongside partnership"
    },
    famousExamples: [
      {
        name: "Eleanor Roosevelt",
        birthdate: "October 11",
        degree: "~11.18° Libra",
        notes: "Social justice advocate"
      },
      {
        name: "Bruno Mars",
        birthdate: "October 8",
        degree: "~13.47° Libra",
        notes: "Innovative musical harmony"
      }
    ],
    sabianSymbol: {
      degree: 12,
      symbol: "Miners are surfacing from a deep coal mine",
      interpretation: "Bringing hidden truths to light. The Aquarius influence drives excavation of social injustice."
    },
    nakshatra: {
      name: "Swati",
      range: "6°40' - 20° Libra (sidereal)",
      ruler: "Rahu",
      symbol: "Young Plant Blown by Wind",
      deity: "Vayu (Wind God)",
      qualities: ["Adaptability", "Social networking", "Justice-seeking"]
    },
    colorTheme: {
      primary: "#DDA0DD",
      secondary: "#DA70D6",
      gradient: "linear-gradient(135deg, #DDA0DD 0%, #DA70D6 100%)"
    }
  },

  {
    id: 4,
    name: "The Idealistic Partner",
    archetype: "The Equality Champion",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 195,
      absoluteEnd: 199.99
    },
    dateRange: {
      start: "October 8",
      end: "October 12",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed Air)",
      primaryRuler: "Venus",
      subRuler: "Uranus",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Libra",
        type: "Core",
        planet: "Venus",
        percentage: 60,
        traits: ["Relationship harmony", "Balance", "Aesthetics", "Partnership", "Fairness"]
      },
      {
        source: "Aquarius",
        type: "Decan Peak",
        planet: "Uranus",
        percentage: 40,
        traits: ["Radical equality", "Revolutionary ideals", "Independence", "Humanitarianism", "Rebellion"]
      }
    ],
    qualities: {
      diplomacy: { level: 80, label: "High", icon: "🤝🤝🤝🤝" },
      charm: { level: 85, label: "Very High", icon: "✨✨✨✨" },
      aestheticSense: { level: 75, label: "High", icon: "🎨🎨🎨🎨" },
      balanceSeeking: { level: 90, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      relationshipFocus: { level: 85, label: "Very High", icon: "💕💕💕💕" },
      fairness: { level: 100, label: "Maximum", icon: "⚖️⚖️⚖️⚖️⚖️" },
      socialGrace: { level: 80, label: "High", icon: "🌸🌸🌸🌸" },
      indecisiveness: { level: 60, label: "Medium", icon: "🔄🔄🔄" },
      speed: { level: 80, label: "High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 60, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Champions equality with intellectual brilliance",
      "Creates revolutionary partnership models",
      "Fights systemic injustice with diplomatic grace",
      "Balances freedom with genuine connection"
    ],
    shadows: [
      "Emotionally detached: intellectualizes all feelings",
      "Idealistic to the point of impracticality",
      "Cannot commit to any 'imperfect' partnership",
      "Rebels against relationship norms even when they work"
    ],
    careerSignatures: [
      "Civil Rights Attorney",
      "Equality Advocate",
      "Political Analyst",
      "Innovation Consultant",
      "Social Policy Designer"
    ],
    relationshipStyle: {
      pursuit: "Principled and passionate — attracts through ideals",
      commitmentSpeed: "Fast on principles, slow on emotional depth",
      passion: "Intense intellectual and ideological connection",
      conflict: "Fights for justice, demands equality",
      jealousy: "Moderate — possessive about fairness"
    },
    famousExamples: [
      {
        name: "Eminem",
        birthdate: "October 17",
        degree: "~17.29° Libra",
        notes: "Justice themes in artistry"
      },
      {
        name: "Snoop Dogg",
        birthdate: "October 20",
        degree: "~18.55° Libra",
        notes: "Smooth social innovator"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "A retired sea captain watches ships entering and leaving the harbor",
      interpretation: "Wisdom gained from navigating all perspectives. The Uranus influence brings revolutionary vision to Venus diplomacy."
    },
    nakshatra: {
      name: "Vishakha",
      range: "20° Libra - 3°20' Scorpio (sidereal)",
      ruler: "Jupiter",
      symbol: "Triumphal Arch / Potter's Wheel",
      deity: "Indra & Agni",
      qualities: ["Goal-oriented", "Single-minded purpose", "Achievement"]
    },
    colorTheme: {
      primary: "#BA55D3",
      secondary: "#9370DB",
      gradient: "linear-gradient(135deg, #BA55D3 0%, #9370DB 100%)"
    }
  },

  {
    id: 5,
    name: "The Diplomatic Leader",
    archetype: "The Social Chameleon",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 200,
      absoluteEnd: 204.99
    },
    dateRange: {
      start: "October 13",
      end: "October 17",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable Air)",
      primaryRuler: "Venus",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Libra",
        type: "Core",
        planet: "Venus",
        percentage: 70,
        traits: ["Social harmony", "Charm", "Diplomacy", "Partnership", "Grace"]
      },
      {
        source: "Gemini",
        type: "Decan Blend",
        planet: "Mercury",
        percentage: 30,
        traits: ["Versatile communication", "Mental agility", "Adaptability", "Curiosity", "Wit"]
      }
    ],
    qualities: {
      diplomacy: { level: 95, label: "Very High", icon: "🤝🤝🤝🤝🤝" },
      charm: { level: 95, label: "Very High", icon: "✨✨✨✨✨" },
      aestheticSense: { level: 80, label: "High", icon: "🎨🎨🎨🎨" },
      balanceSeeking: { level: 85, label: "Very High", icon: "⚖️⚖️⚖️⚖️" },
      relationshipFocus: { level: 80, label: "High", icon: "💕💕💕💕" },
      fairness: { level: 85, label: "Very High", icon: "⚖️⚖️⚖️⚖️" },
      socialGrace: { level: 95, label: "Very High", icon: "🌸🌸🌸🌸🌸" },
      indecisiveness: { level: 85, label: "Very High", icon: "🔄🔄🔄🔄" },
      speed: { level: 85, label: "Very High", icon: "⚡⚡⚡⚡" },
      riskTolerance: { level: 50, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Masterful social diplomat: adapts to any audience",
      "Communicates harmony with brilliant articulation",
      "Bridges diverse perspectives with verbal dexterity",
      "Charming mediator who builds consensus naturally"
    ],
    shadows: [
      "Superficial charm without emotional depth",
      "Says what people want to hear rather than the truth",
      "Scattered social focus: too many connections, too little depth",
      "Lacks authenticity from mirroring everyone"
    ],
    careerSignatures: [
      "Public Relations Director",
      "Talk Show Host",
      "Negotiator/Mediator",
      "Event Planner",
      "Communications Director"
    ],
    relationshipStyle: {
      pursuit: "Witty and charming — draws people in effortlessly",
      commitmentSpeed: "Slow — enjoys the social dance too much",
      passion: "Verbally expressive, socially magnetic",
      conflict: "Charms and diverts rather than confronting",
      jealousy: "Low — too socially busy to focus on one"
    },
    famousExamples: [
      {
        name: "Carrie Fisher",
        birthdate: "October 21",
        degree: "~21.15° Libra",
        notes: "Witty diplomatic charm"
      },
      {
        name: "Serena Williams",
        birthdate: "September 26",
        degree: "~23.42° Libra",
        notes: "Graceful competitive communication"
      }
    ],
    sabianSymbol: {
      degree: 22,
      symbol: "A child giving birds a drink at a fountain",
      interpretation: "The innocence of giving. Mercury's communicative gift channeled through Venusian grace — nurturing all through social ease."
    },
    nakshatra: {
      name: "Vishakha",
      range: "20° Libra - 3°20' Scorpio (sidereal)",
      ruler: "Jupiter",
      symbol: "Triumphal Arch / Potter's Wheel",
      deity: "Indra & Agni",
      qualities: ["Purposeful communication", "Social leadership", "Diplomatic victory"]
    },
    colorTheme: {
      primary: "#FFB6D9",
      secondary: "#FFE4E1",
      gradient: "linear-gradient(135deg, #FFB6D9 0%, #FFE4E1 100%)"
    }
  },

  {
    id: 6,
    name: "The Passionate Peacemaker",
    archetype: "The Passionate Mediator",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 205,
      absoluteEnd: 209.99
    },
    dateRange: {
      start: "October 18",
      end: "October 22",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable Air)",
      primaryRuler: "Venus",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Libra",
        type: "Core",
        planet: "Venus",
        percentage: 75,
        traits: ["Diplomatic grace", "Harmony", "Aesthetics", "Fairness", "Charm"]
      },
      {
        source: "Scorpio",
        type: "Cusp Bleed",
        planet: "Pluto",
        percentage: 25,
        traits: ["Emotional depth", "Transformative intensity", "Psychological insight", "Loyalty", "Magnetism"]
      }
    ],
    qualities: {
      diplomacy: { level: 85, label: "Very High", icon: "🤝🤝🤝🤝" },
      charm: { level: 90, label: "Very High", icon: "✨✨✨✨✨" },
      aestheticSense: { level: 85, label: "Very High", icon: "🎨🎨🎨🎨" },
      balanceSeeking: { level: 75, label: "High", icon: "⚖️⚖️⚖️" },
      relationshipFocus: { level: 95, label: "Very High", icon: "💕💕💕💕💕" },
      fairness: { level: 90, label: "Very High", icon: "⚖️⚖️⚖️⚖️⚖️" },
      socialGrace: { level: 85, label: "Very High", icon: "🌸🌸🌸🌸" },
      indecisiveness: { level: 60, label: "Medium", icon: "🔄🔄🔄" },
      speed: { level: 65, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 55, label: "Medium", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Deep psychological diplomacy: sees hidden dynamics",
      "Passionate about justice with transformative power",
      "Transforms conflicts into profound understanding",
      "Intensely loyal in chosen partnerships"
    ],
    shadows: [
      "Manipulative for the sake of 'harmony'",
      "Jealous and possessive in relationships",
      "Passive-aggressive when deeply hurt",
      "Power struggles disguised as diplomatic concern"
    ],
    careerSignatures: [
      "Forensic Psychologist",
      "Conflict Resolution Specialist",
      "Investigative Journalist",
      "Depth Therapist",
      "Political Strategist"
    ],
    relationshipStyle: {
      pursuit: "Magnetic and intense — diplomacy with undercurrent",
      commitmentSpeed: "Decisive — Scorpio influence knows what it wants",
      passion: "Deep, transformative, emotionally intense",
      conflict: "Diplomatic surface with intense undercurrents",
      jealousy: "High — possessive yet tries to appear balanced"
    },
    famousExamples: [
      {
        name: "Katy Perry",
        birthdate: "October 25",
        degree: "~25.18° Libra",
        notes: "Intense romantic themes"
      },
      {
        name: "Emilia Clarke",
        birthdate: "October 23",
        degree: "~27.42° Libra",
        notes: "Passionate graceful intensity"
      }
    ],
    sabianSymbol: {
      degree: 27,
      symbol: "An airplane sails, high in the clear sky",
      interpretation: "Transcending earthly conflicts. At the Scorpio cusp, Libra's grace rises above emotional turbulence through diplomatic mastery."
    },
    nakshatra: {
      name: "Vishakha",
      range: "20° Libra - 3°20' Scorpio (sidereal)",
      ruler: "Jupiter",
      symbol: "Triumphal Arch / Potter's Wheel",
      deity: "Indra & Agni",
      qualities: ["Passionate purpose", "Transformative diplomacy", "Intense devotion"]
    },
    colorTheme: {
      primary: "#C71585",
      secondary: "#8B008B",
      gradient: "linear-gradient(135deg, #C71585 0%, #8B008B 100%)"
    }
  }
];

export default libraZones;
