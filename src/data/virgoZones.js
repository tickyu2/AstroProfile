// Virgo Zone Database
// Complete data structure for all 6 zones across the 30° Virgo spectrum
// Earth Sign: Analytical, practical, service-oriented, perfectionist
// Ruled by Mercury: Analysis, discernment, detail, communication

export const virgoZones = [
  {
    id: 1,
    name: "The Perfectionist Star",
    archetype: "The Proud Perfectionist",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 150,
      absoluteEnd: 154.99
    },
    dateRange: {
      start: "August 23",
      end: "August 27",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Mercury",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Leo",
        type: "Cusp Bleed",
        planet: "Sun",
        percentage: 25,
        traits: ["Creative confidence", "Self-expression", "Charisma", "Dramatic flair", "Pride"]
      },
      {
        source: "Virgo",
        type: "Core",
        planet: "Mercury",
        percentage: 75,
        traits: ["Analytical precision", "Perfectionism", "Detail mastery", "Service", "Critical thinking"]
      }
    ],
    qualities: {
      analyticalThinking: { level: 90, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      attention: { level: 95, label: "Very High", icon: "\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D" },
      perfectionism: { level: 95, label: "Very High", icon: "\u2728\u2728\u2728\u2728\u2728" },
      serviceOrientation: { level: 80, label: "High", icon: "\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D" },
      practicalSkills: { level: 85, label: "Very High", icon: "\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27" },
      criticalThinking: { level: 90, label: "Very High", icon: "\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F" },
      organization: { level: 90, label: "Very High", icon: "\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB" },
      healthConsciousness: { level: 75, label: "High", icon: "\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F" },
      speed: { level: 75, label: "High", icon: "\u26A1\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 45, label: "Medium", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Combines vision with precision \u2014 Leo confidence meets Virgo craft",
      "Confident in analytical abilities \u2014 rare self-assurance for Virgo",
      "Creates perfect performances \u2014 art meets technical mastery",
      "Balances art and craft \u2014 the proud perfectionist"
    ],
    shadows: [
      "Harsh self-criticism \u2014 never meets own impossible standards",
      "Needs appreciation for perfectionism \u2014 Leo need for recognition",
      "Anxious when imperfect \u2014 Mercury worry amplified",
      "Can be controlling about quality \u2014 won't delegate"
    ],
    careerSignatures: [
      "Master Craftsperson",
      "Precision Artist",
      "Quality Director",
      "Technical Performer",
      "Proud Professional"
    ],
    relationshipStyle: {
      pursuit: "Confident yet analytical \u2014 assesses compatibility carefully",
      commitmentSpeed: "Medium \u2014 analyzes but acts with pride",
      passion: "Precise and attentive with creative flair",
      conflict: "Critiques flaws confidently, demands standards",
      jealousy: "Moderate \u2014 analytical rather than emotional"
    },
    famousExamples: [
      {
        name: "Mother Teresa",
        birthdate: "August 26",
        degree: "~1.55\u00B0 Virgo",
        notes: "Perfect service with dignity"
      },
      {
        name: "Sean Connery",
        birthdate: "August 25",
        degree: "~2.18\u00B0 Virgo",
        notes: "Perfected craft of performance"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "A man's head",
      interpretation: "The power of focused analytical intelligence at the Leo-Virgo boundary. Pride in mental mastery, the mind as primary tool."
    },
    nakshatra: {
      name: "Uttara Phalguni",
      ruler: "Sun",
      meaning: "The Latter Red One \u2014 service through pride",
      influence: "Dignified service, proud craftsmanship, confident analysis"
    },
    colorTheme: {
      primary: "#8B7355",
      secondary: "#D2B48C",
      gradient: "linear-gradient(135deg, #8B7355 0%, #D2B48C 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Analyst",
    archetype: "The Master Optimizer",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 155,
      absoluteEnd: 159.99
    },
    dateRange: {
      start: "August 28",
      end: "September 1",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Mutable)",
      primaryRuler: "Mercury",
      subRuler: "Mercury",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Virgo",
        type: "Core",
        planet: "Mercury",
        percentage: 100,
        traits: ["Peak analytical capacity", "Sees every detail", "Nothing less than perfect", "Master of craft", "Lives to serve"]
      }
    ],
    qualities: {
      analyticalThinking: { level: 100, label: "Maximum", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      attention: { level: 100, label: "Maximum", icon: "\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D" },
      perfectionism: { level: 100, label: "Maximum", icon: "\u2728\u2728\u2728\u2728\u2728" },
      serviceOrientation: { level: 95, label: "Very High", icon: "\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D" },
      practicalSkills: { level: 100, label: "Maximum", icon: "\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27" },
      criticalThinking: { level: 100, label: "Maximum", icon: "\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F" },
      organization: { level: 100, label: "Maximum", icon: "\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB" },
      healthConsciousness: { level: 90, label: "Very High", icon: "\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F" },
      speed: { level: 85, label: "Very High", icon: "\u26A1\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 25, label: "Low", icon: "\uD83C\uDFB2" }
    },
    strengths: [
      "Ultimate problem-solving ability \u2014 sees solutions others miss",
      "Creates flawless systems \u2014 nothing escapes attention",
      "Reliable beyond measure \u2014 never fails commitments",
      "Serves with total dedication \u2014 Mercury precision at maximum"
    ],
    shadows: [
      "Paralyzed by perfectionism \u2014 nothing is ever good enough",
      "Hyper-critical of self/others \u2014 sees every flaw instantly",
      "Anxiety from imperfection \u2014 Mercury mind never rests",
      "Cannot relax or let go \u2014 always optimizing something"
    ],
    careerSignatures: [
      "Systems Analyst",
      "Quality Engineer",
      "Optimization Expert",
      "Research Scientist",
      "Master Programmer"
    ],
    relationshipStyle: {
      pursuit: "Analyzes compatibility meticulously before engaging",
      commitmentSpeed: "Slow \u2014 must verify all variables first",
      passion: "Precise, attentive, notices every detail about partner",
      conflict: "Analyzes flaws systematically, presents evidence",
      jealousy: "Low-moderate \u2014 too analytical for emotional jealousy"
    },
    famousExamples: [
      {
        name: "Warren Buffett",
        birthdate: "August 30",
        degree: "~6.57\u00B0 Virgo",
        notes: "Analytical precision in investing"
      },
      {
        name: "Stephen King",
        birthdate: "September 21",
        degree: "~8.44\u00B0 Virgo",
        notes: "Meticulous craft, prolific output"
      }
    ],
    sabianSymbol: {
      degree: 8,
      symbol: "A girl takes her first dancing instruction",
      interpretation: "The disciplined pursuit of perfection through practice. Pure Mercury energy channeled through systematic mastery of every detail."
    },
    nakshatra: {
      name: "Hasta",
      ruler: "Moon",
      meaning: "The Hand \u2014 skill, dexterity, craft mastery",
      influence: "Manual precision, healing hands, practical genius"
    },
    colorTheme: {
      primary: "#6B8E23",
      secondary: "#556B2F",
      gradient: "linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)"
    }
  },

  {
    id: 3,
    name: "The Practical Helper",
    archetype: "The Responsible Helper",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 160,
      absoluteEnd: 164.99
    },
    dateRange: {
      start: "September 2",
      end: "September 6",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Capricorn)",
      primaryRuler: "Mercury",
      subRuler: "Saturn",
      modality: "Mutable/Cardinal"
    },
    influences: [
      {
        source: "Virgo",
        type: "Core",
        planet: "Mercury",
        percentage: 70,
        traits: ["Analytical precision", "Detail mastery", "Service", "Critical thinking"]
      },
      {
        source: "Capricorn",
        type: "Decan",
        planet: "Saturn",
        percentage: 30,
        traits: ["Discipline", "Structure", "Long-term mastery", "Responsibility", "Achievement"]
      }
    ],
    qualities: {
      analyticalThinking: { level: 95, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      attention: { level: 95, label: "Very High", icon: "\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D" },
      perfectionism: { level: 90, label: "Very High", icon: "\u2728\u2728\u2728\u2728\u2728" },
      serviceOrientation: { level: 85, label: "Very High", icon: "\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D" },
      practicalSkills: { level: 95, label: "Very High", icon: "\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27" },
      criticalThinking: { level: 95, label: "Very High", icon: "\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F" },
      organization: { level: 100, label: "Maximum", icon: "\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB" },
      healthConsciousness: { level: 80, label: "High", icon: "\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F" },
      speed: { level: 70, label: "High", icon: "\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 30, label: "Low", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Builds perfect lasting systems \u2014 Saturn structure + Mercury precision",
      "Disciplined mastery of craft \u2014 iron will meets analytical mind",
      "Responsible reliable leadership \u2014 never drops the ball",
      "Climbs through competence \u2014 earns every advancement"
    ],
    shadows: [
      "Workaholic perfectionism \u2014 Saturn burden + Virgo standards",
      "Overly serious, no fun \u2014 duty overrides pleasure",
      "Burden of responsibility \u2014 takes on too much for others",
      "Difficulty delegating \u2014 no one meets their standards"
    ],
    careerSignatures: [
      "Operations Manager",
      "Master Craftsperson",
      "Responsible Leader",
      "Strategic Planner",
      "Infrastructure Builder"
    ],
    relationshipStyle: {
      pursuit: "Responsible and structured \u2014 builds relationship like a project",
      commitmentSpeed: "Slow but permanent \u2014 commits for life",
      passion: "Disciplined devotion, consistent and reliable",
      conflict: "Responsible analysis, dutiful resolution",
      jealousy: "Low \u2014 too disciplined for emotional drama"
    },
    famousExamples: [
      {
        name: "Amy Poehler",
        birthdate: "September 16",
        degree: "~11.23\u00B0 Virgo",
        notes: "Disciplined craft mastery"
      },
      {
        name: "Tim Burton",
        birthdate: "August 25",
        degree: "~13.45\u00B0 Virgo",
        notes: "Meticulous creative systems"
      }
    ],
    sabianSymbol: {
      degree: 13,
      symbol: "A strong hand supplanting political hysteria",
      interpretation: "The power of disciplined competence to bring order from chaos. Saturn's structure channeled through Virgo's analytical service."
    },
    nakshatra: {
      name: "Hasta",
      ruler: "Moon",
      meaning: "The Crafting Hand \u2014 disciplined skill",
      influence: "Systematic building, responsible mastery, structured service"
    },
    colorTheme: {
      primary: "#8B4513",
      secondary: "#654321",
      gradient: "linear-gradient(135deg, #8B4513 0%, #654321 100%)"
    }
  },

  {
    id: 4,
    name: "The Efficient Organizer",
    archetype: "The Efficiency Master",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 165,
      absoluteEnd: 169.99
    },
    dateRange: {
      start: "September 7",
      end: "September 11",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Capricorn)",
      primaryRuler: "Mercury",
      subRuler: "Saturn",
      modality: "Mutable/Cardinal"
    },
    influences: [
      {
        source: "Virgo",
        type: "Core",
        planet: "Mercury",
        percentage: 60,
        traits: ["Analytical systems", "Precision", "Optimization"]
      },
      {
        source: "Capricorn",
        type: "Decan",
        planet: "Saturn",
        percentage: 40,
        traits: ["Masterful structure", "Peak achievement", "Iron discipline", "Empire building"]
      }
    ],
    qualities: {
      analyticalThinking: { level: 95, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      attention: { level: 100, label: "Maximum", icon: "\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D" },
      perfectionism: { level: 95, label: "Very High", icon: "\u2728\u2728\u2728\u2728\u2728" },
      serviceOrientation: { level: 80, label: "High", icon: "\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D" },
      practicalSkills: { level: 100, label: "Maximum", icon: "\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27" },
      criticalThinking: { level: 100, label: "Maximum", icon: "\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F" },
      organization: { level: 100, label: "Maximum", icon: "\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB" },
      healthConsciousness: { level: 85, label: "Very High", icon: "\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F" },
      speed: { level: 75, label: "High", icon: "\u26A1\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 25, label: "Low", icon: "\uD83C\uDFB2" }
    },
    strengths: [
      "Creates optimal efficient systems \u2014 peak Saturn-Mercury synergy",
      "Master of craft and skill \u2014 achieves mastery through discipline",
      "Organizational genius \u2014 structures everything for maximum output",
      "Builds lasting infrastructure \u2014 creates what endures"
    ],
    shadows: [
      "Extreme perfectionism paralyzes \u2014 analysis paralysis at maximum",
      "Cannot accept imperfection \u2014 rigid standards destroy joy",
      "Workaholic to exhaustion \u2014 doesn't know when to stop",
      "Cold efficiency over warmth \u2014 optimizes out the humanity"
    ],
    careerSignatures: [
      "Systems Architect",
      "Efficiency Consultant",
      "Master Organizer",
      "Operations Director",
      "Process Engineer"
    ],
    relationshipStyle: {
      pursuit: "Systematic approach \u2014 optimizes dating like a project",
      commitmentSpeed: "Very slow \u2014 must calculate all variables",
      passion: "Efficient and reliable, predictable quality",
      conflict: "Systematic problem decomposition",
      jealousy: "Very low \u2014 too efficient for emotional waste"
    },
    famousExamples: [
      {
        name: "Agatha Christie",
        birthdate: "September 15",
        degree: "~16.23\u00B0 Virgo",
        notes: "Systematic mastery of mystery craft"
      },
      {
        name: "Prince Harry",
        birthdate: "September 15",
        degree: "~18.47\u00B0 Virgo",
        notes: "Service with structure"
      }
    ],
    sabianSymbol: {
      degree: 18,
      symbol: "Two girls playing with a ouija board",
      interpretation: "The systematic exploration of hidden patterns. Saturn's discipline applied to Mercury's analytical curiosity \u2014 mastering the invisible systems."
    },
    nakshatra: {
      name: "Chitra",
      ruler: "Mars",
      meaning: "The Bright One \u2014 craftsmanship and precision",
      influence: "Architectural genius, systematic mastery, efficient creation"
    },
    colorTheme: {
      primary: "#5F4C0B",
      secondary: "#4A4A4A",
      gradient: "linear-gradient(135deg, #5F4C0B 0%, #4A4A4A 100%)"
    }
  },

  {
    id: 5,
    name: "The Grounded Communicator",
    archetype: "The Devoted Craftsperson",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 170,
      absoluteEnd: 174.99
    },
    dateRange: {
      start: "September 12",
      end: "September 16",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Taurus)",
      primaryRuler: "Mercury",
      subRuler: "Venus",
      modality: "Mutable/Fixed"
    },
    influences: [
      {
        source: "Virgo",
        type: "Core",
        planet: "Mercury",
        percentage: 70,
        traits: ["Analytical communication", "Detail precision", "Service", "Critical analysis"]
      },
      {
        source: "Taurus",
        type: "Decan",
        planet: "Venus",
        percentage: 30,
        traits: ["Sensory awareness", "Aesthetic precision", "Patient persistence", "Loyal devotion"]
      }
    ],
    qualities: {
      analyticalThinking: { level: 90, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      attention: { level: 95, label: "Very High", icon: "\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D" },
      perfectionism: { level: 90, label: "Very High", icon: "\u2728\u2728\u2728\u2728\u2728" },
      serviceOrientation: { level: 85, label: "Very High", icon: "\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D" },
      practicalSkills: { level: 95, label: "Very High", icon: "\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27" },
      criticalThinking: { level: 90, label: "Very High", icon: "\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F" },
      organization: { level: 90, label: "Very High", icon: "\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB" },
      healthConsciousness: { level: 85, label: "Very High", icon: "\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F" },
      speed: { level: 65, label: "Medium", icon: "\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 30, label: "Low", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Perfects sensory experiences \u2014 Venus adds aesthetic sense to analysis",
      "Creates beautiful practical systems \u2014 form meets function",
      "Patient persistent mastery \u2014 Taurus endurance + Virgo precision",
      "Loyal dedicated service \u2014 devoted to craft and people"
    ],
    shadows: [
      "Stubborn about methods \u2014 Taurus fixity + Virgo standards",
      "Slow to adapt \u2014 too thorough, misses windows of opportunity",
      "Possessive of systems \u2014 won't let others modify their work",
      "Resistant to change \u2014 comfort with routine overrides growth"
    ],
    careerSignatures: [
      "Wellness Expert",
      "Sensory Designer",
      "Devoted Craftsperson",
      "Quality Assurance",
      "Patient Teacher"
    ],
    relationshipStyle: {
      pursuit: "Patient and devoted \u2014 builds trust slowly through consistency",
      commitmentSpeed: "Very slow \u2014 needs absolute trust first",
      passion: "Sensory and attentive, notices physical details",
      conflict: "Stubborn defense of methods, patient resolution",
      jealousy: "Moderate \u2014 Taurus possessiveness + Virgo analysis"
    },
    famousExamples: [
      {
        name: "Keanu Reeves",
        birthdate: "September 2",
        degree: "~20.13\u00B0 Virgo",
        notes: "Humble perfectionist, sensory craft"
      },
      {
        name: "Cameron Diaz",
        birthdate: "August 30",
        degree: "~22.35\u00B0 Virgo",
        notes: "Practical beauty, wellness focus"
      }
    ],
    sabianSymbol: {
      degree: 23,
      symbol: "A lion tamer",
      interpretation: "The patient mastery of powerful forces through gentle persistence. Venus beauty taming Mercury's analytical restlessness into devoted craft."
    },
    nakshatra: {
      name: "Chitra",
      ruler: "Mars",
      meaning: "The Beautiful Craft \u2014 aesthetic precision",
      influence: "Sensory mastery, patient artistry, devoted creation"
    },
    colorTheme: {
      primary: "#9C8B7A",
      secondary: "#8B7D6B",
      gradient: "linear-gradient(135deg, #9C8B7A 0%, #8B7D6B 100%)"
    }
  },

  {
    id: 6,
    name: "The Balanced Analyzer",
    archetype: "The Graceful Helper",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 175,
      absoluteEnd: 179.99
    },
    dateRange: {
      start: "September 17",
      end: "September 22",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Taurus)",
      primaryRuler: "Mercury",
      subRuler: "Venus",
      modality: "Mutable/Fixed"
    },
    influences: [
      {
        source: "Virgo",
        type: "Core",
        planet: "Mercury",
        percentage: 75,
        traits: ["Analytical communication", "Precision", "Service orientation", "Critical thinking"]
      },
      {
        source: "Libra",
        type: "Cusp Bleed",
        planet: "Venus",
        percentage: 25,
        traits: ["Diplomatic grace", "Harmony seeking", "Aesthetic balance", "Social skills"]
      }
    ],
    qualities: {
      analyticalThinking: { level: 90, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      attention: { level: 90, label: "Very High", icon: "\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D\uD83D\uDD0D" },
      perfectionism: { level: 85, label: "Very High", icon: "\u2728\u2728\u2728\u2728" },
      serviceOrientation: { level: 90, label: "Very High", icon: "\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D\uD83E\uDD1D" },
      practicalSkills: { level: 85, label: "Very High", icon: "\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27\uD83D\uDD27" },
      criticalThinking: { level: 90, label: "Very High", icon: "\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F\u2696\uFE0F" },
      organization: { level: 85, label: "Very High", icon: "\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB\uD83D\uDCCB" },
      healthConsciousness: { level: 80, label: "High", icon: "\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F\uD83C\uDF3F" },
      speed: { level: 80, label: "High", icon: "\u26A1\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 40, label: "Low-Medium", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Tactful helpful analysis \u2014 Libra diplomacy softens Virgo critique",
      "Creates harmonious systems \u2014 balance meets precision",
      "Diplomatic service orientation \u2014 helps without offending",
      "Socially skilled helper \u2014 most comfortable Virgo in groups"
    ],
    shadows: [
      "Analysis paralysis from weighing options \u2014 Libra indecision + Virgo overthinking",
      "People-pleasing perfectionism \u2014 tries to please everyone perfectly",
      "Difficulty making decisions \u2014 too balanced to choose",
      "Perfectionistic about relationships \u2014 applies standards to people"
    ],
    careerSignatures: [
      "Diplomatic Consultant",
      "Graceful Helper",
      "Balanced Organizer",
      "Mediator/Counselor",
      "Social Service Director"
    ],
    relationshipStyle: {
      pursuit: "Diplomatically analytical \u2014 charming with precision",
      commitmentSpeed: "Medium \u2014 weighs all perspectives carefully",
      passion: "Balanced and harmonious, graceful attention",
      conflict: "Diplomatic analysis, seeks balanced resolution",
      jealousy: "Low \u2014 too diplomatic for possessive behavior"
    },
    famousExamples: [
      {
        name: "Will Smith",
        birthdate: "September 25",
        degree: "~25.53\u00B0 Virgo",
        notes: "Charming perfectionist, balanced service"
      },
      {
        name: "Macaulay Culkin",
        birthdate: "August 26",
        degree: "~27.42\u00B0 Virgo",
        notes: "Analytical performance with charm"
      }
    ],
    sabianSymbol: {
      degree: 28,
      symbol: "A bald-headed man who has seized power",
      interpretation: "The diplomatic assertion of analytical authority. Libra's grace transforms Virgo's critique into harmonious influence."
    },
    nakshatra: {
      name: "Chitra",
      ruler: "Mars",
      meaning: "The Balanced Jewel \u2014 harmony in precision",
      influence: "Diplomatic analysis, graceful service, balanced perfectionism"
    },
    colorTheme: {
      primary: "#C9A871",
      secondary: "#E6D5B8",
      gradient: "linear-gradient(135deg, #C9A871 0%, #E6D5B8 100%)"
    }
  }
];

export const getVirgoZoneByDegree = (degree) => {
  return virgoZones.find(zone =>
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default virgoZones;
