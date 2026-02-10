// Cancer Zone Database
// Complete data structure for all 6 zones across the 30° Cancer spectrum
// Water Sign: Emotional, nurturing, protective, intuitive
// Ruled by Moon: Emotions, cycles, home, family, memory

export const cancerZones = [
  {
    id: 1,
    name: "The Communicative Nurturer",
    archetype: "The Feeling Communicator",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 90,
      absoluteEnd: 94.99
    },
    dateRange: {
      start: "June 21",
      end: "June 25",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Moon",
      subRuler: "Moon",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Gemini",
        type: "Cusp Bleed",
        planet: "Mercury",
        percentage: 25,
        traits: ["Mental agility", "Verbal expression", "Social comfort", "Adaptability", "Curiosity"]
      },
      {
        source: "Cancer",
        type: "Core",
        planet: "Moon",
        percentage: 75,
        traits: ["Emotional depth", "Nurturing instinct", "Intuition", "Empathy", "Memory"]
      }
    ],
    qualities: {
      emotionalDepth: { level: 85, label: "Very High", icon: "\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A" },
      nurturingInstinct: { level: 80, label: "High", icon: "\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31" },
      protectiveness: { level: 75, label: "High", icon: "\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F" },
      intuition: { level: 80, label: "High", icon: "\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E" },
      empathy: { level: 80, label: "High", icon: "\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F" },
      memoryRetention: { level: 85, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      patience: { level: 75, label: "High", icon: "\u23F3\u23F3\u23F3\u23F3" },
      independence: { level: 35, label: "Low-Medium", icon: "\uD83E\uDDED\uD83E\uDDED" },
      speed: { level: 60, label: "Medium-High", icon: "\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 30, label: "Low", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Articulates emotions clearly: bridges feeling and thinking",
      "Socially nurturing: creates warmth in any group",
      "Adaptable caretaker: adjusts care style to each person",
      "Teaches emotional intelligence through conversation"
    ],
    shadows: [
      "Overthinks feelings: analyzes instead of experiencing",
      "Mental defense against vulnerability: intellectualizes pain",
      "Scattered emotional focus: too many people to nurture",
      "May talk instead of truly feeling"
    ],
    careerSignatures: [
      "Therapist/Counselor",
      "Teacher (Emotional Intelligence)",
      "Social Worker",
      "Family Mediator",
      "Wellness Coach"
    ],
    relationshipStyle: {
      pursuit: "Warm and conversational \u2014 connects through dialogue",
      commitmentSpeed: "Medium \u2014 needs emotional and intellectual rapport",
      passion: "Emotionally articulate and attentive",
      conflict: "Talks through feelings, seeks mutual understanding",
      jealousy: "Moderate \u2014 expresses concerns verbally"
    },
    famousExamples: [
      {
        name: "Meryl Streep",
        birthdate: "June 22",
        degree: "~0.85\u00B0 Cancer",
        notes: "Emotional range + verbal articulation"
      },
      {
        name: "Ariana Grande",
        birthdate: "June 26",
        degree: "~0.48\u00B0 Cancer",
        notes: "Expressive emotional music"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "A message carried by a dove",
      interpretation: "The power of gentle communication to heal. At the Gemini-Cancer cusp, words become vessels for emotional truth."
    },
    nakshatra: {
      name: "Punarvasu",
      range: "20\u00B0 Gemini - 3\u00B020' Cancer (sidereal)",
      ruler: "Jupiter",
      symbol: "Bow and Quiver",
      deity: "Aditi (Mother of Gods)",
      qualities: ["Return of the light", "Nurturing renewal", "Emotional homecoming"]
    },
    colorTheme: {
      primary: "#B0E0E6",
      secondary: "#E0FFFF",
      gradient: "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Empath",
    archetype: "The Feeling Archive",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 95,
      absoluteEnd: 99.99
    },
    dateRange: {
      start: "June 26",
      end: "June 30",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Cardinal)",
      primaryRuler: "Moon",
      subRuler: "Moon",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Cancer",
        type: "Pure Moon",
        planet: "Moon",
        percentage: 100,
        traits: ["Maximum emotional depth", "Pure nurturing", "Psychic sensitivity", "Unconditional love", "Perfect memory"]
      }
    ],
    qualities: {
      emotionalDepth: { level: 100, label: "Maximum", icon: "\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A" },
      nurturingInstinct: { level: 100, label: "Maximum", icon: "\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31" },
      protectiveness: { level: 95, label: "Very High", icon: "\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F" },
      intuition: { level: 95, label: "Very High", icon: "\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E" },
      empathy: { level: 100, label: "Maximum", icon: "\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F" },
      memoryRetention: { level: 100, label: "Maximum", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      patience: { level: 90, label: "Very High", icon: "\u23F3\u23F3\u23F3\u23F3\u23F3" },
      independence: { level: 20, label: "Low", icon: "\uD83E\uDDED" },
      speed: { level: 40, label: "Low-Medium", icon: "\u26A1\u26A1" },
      riskTolerance: { level: 15, label: "Very Low", icon: "\uD83C\uDFB2" }
    },
    strengths: [
      "Deepest emotional capacity in the zodiac",
      "Ultimate safe space creator: people instantly feel held",
      "Psychic-level intuition: reads people without words",
      "Unconditional love: accepts others' deepest flaws",
      "Perfect emotional memory: never forgets meaningful moments"
    ],
    shadows: [
      "Overwhelmed by emotions: drowns in feelings",
      "Cannot function outside safe space: paralyzed by unfamiliarity",
      "Smothering care: loves so hard it suffocates",
      "Takes everything personally: fragile ego boundaries",
      "Holds onto past hurts: eternal emotional archives"
    ],
    careerSignatures: [
      "Stay-at-Home Parent",
      "Childcare/Early Education",
      "Nursing/Hospice Care",
      "Chef/Home Cook",
      "Memory Keeper/Archivist"
    ],
    relationshipStyle: {
      pursuit: "Shy but deeply devoted \u2014 shows love through care",
      commitmentSpeed: "Slow but permanent once given",
      passion: "Deeply emotional, tender, all-encompassing",
      conflict: "Withdraws into shell, processes privately",
      jealousy: "Deep but hidden \u2014 suffers in silence"
    },
    famousExamples: [
      {
        name: "Princess Diana",
        birthdate: "July 1",
        degree: "~7.58\u00B0 Cancer",
        notes: "Ultimate nurturer, the People's Princess"
      },
      {
        name: "Tom Hanks",
        birthdate: "July 9",
        degree: "~8.44\u00B0 Cancer",
        notes: "America's dad \u2014 warm, trustworthy, emotionally available"
      }
    ],
    sabianSymbol: {
      degree: 8,
      symbol: "A mother rocking a cradle",
      interpretation: "Pure nurturing instinct as cosmic force. At peak Cancer, the act of holding and soothing IS the purpose."
    },
    nakshatra: {
      name: "Pushya",
      range: "3\u00B020' - 16\u00B040' Cancer (sidereal)",
      ruler: "Saturn",
      symbol: "Cow Udder / Flower",
      deity: "Brihaspati (Lord of Sacred Speech)",
      qualities: ["Supreme nourishment", "Spiritual feeding", "Protective devotion"]
    },
    colorTheme: {
      primary: "#ADD8E6",
      secondary: "#F0F8FF",
      gradient: "linear-gradient(135deg, #ADD8E6 0%, #6495ED 100%)"
    }
  },

  {
    id: 3,
    name: "The Fierce Protector",
    archetype: "The Psychic Guardian",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 100,
      absoluteEnd: 104.99
    },
    dateRange: {
      start: "July 1",
      end: "July 5",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed)",
      primaryRuler: "Moon",
      subRuler: "Pluto",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Cancer",
        type: "Core",
        planet: "Moon",
        percentage: 70,
        traits: ["Emotional depth", "Nurturing", "Memory", "Intuition"]
      },
      {
        source: "Scorpio",
        type: "Pluto Sub-ruler",
        planet: "Pluto",
        percentage: 30,
        traits: ["Intensity", "Penetrating insight", "Transformative power", "Boundary strength"]
      }
    ],
    qualities: {
      emotionalDepth: { level: 100, label: "Maximum", icon: "\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A" },
      nurturingInstinct: { level: 85, label: "Very High", icon: "\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31" },
      protectiveness: { level: 100, label: "Maximum", icon: "\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F" },
      intuition: { level: 100, label: "Maximum", icon: "\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E" },
      empathy: { level: 90, label: "Very High", icon: "\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F" },
      memoryRetention: { level: 100, label: "Maximum", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      patience: { level: 70, label: "High", icon: "\u23F3\u23F3\u23F3\u23F3" },
      independence: { level: 35, label: "Low-Medium", icon: "\uD83E\uDDED\uD83E\uDDED" },
      speed: { level: 45, label: "Medium", icon: "\u26A1\u26A1" },
      riskTolerance: { level: 25, label: "Low", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Unstoppable protector: will fight to the death for loved ones",
      "Psychic threat detection: senses danger before it materializes",
      "Transforms pain to power: alchemizes suffering into strength",
      "Sees through manipulation: impenetrable to deception",
      "Creates impenetrable emotional boundaries"
    ],
    shadows: [
      "Paranoid vigilance: sees threats everywhere",
      "Eternal grudges: never forgets or forgives betrayal",
      "Overprotective smothering: suffocates through fear",
      "Emotional manipulation when threatened: guilt as weapon",
      "Deep trust issues: assumes the worst in people"
    ],
    careerSignatures: [
      "Security Specialist",
      "Trauma Counselor",
      "Detective/Investigator",
      "Emergency Room Nurse",
      "Family Law Attorney"
    ],
    relationshipStyle: {
      pursuit: "Intense and watchful \u2014 tests loyalty repeatedly",
      commitmentSpeed: "Slow \u2014 must prove trustworthiness completely",
      passion: "Intense, possessive, deeply bonded",
      conflict: "Fierce attack if core circle threatened, else retreat",
      jealousy: "High \u2014 territorial and suspicious"
    },
    famousExamples: [
      {
        name: "Frida Kahlo",
        birthdate: "July 6",
        degree: "~11.85\u00B0 Cancer",
        notes: "Transformed pain into fierce art"
      },
      {
        name: "Solange",
        birthdate: "June 24",
        degree: "~13.2\u00B0 Cancer",
        notes: "Fierce family protector, boundary guardian"
      }
    ],
    sabianSymbol: {
      degree: 13,
      symbol: "A crab at the edge of a tide pool",
      interpretation: "Vigilant protection of sacred territory. The Cancer-Scorpio blend stands sentinel at the boundary between safety and the unknown."
    },
    nakshatra: {
      name: "Pushya",
      range: "3\u00B020' - 16\u00B040' Cancer (sidereal)",
      ruler: "Saturn",
      symbol: "Cow Udder / Flower",
      deity: "Brihaspati",
      qualities: ["Protective nourishment", "Fierce devotion", "Boundary holding"]
    },
    colorTheme: {
      primary: "#4682B4",
      secondary: "#483D8B",
      gradient: "linear-gradient(135deg, #4682B4 0%, #483D8B 100%)"
    }
  },

  {
    id: 4,
    name: "The Emotional Healer",
    archetype: "The Depth Alchemist",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 105,
      absoluteEnd: 109.99
    },
    dateRange: {
      start: "July 6",
      end: "July 10",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed)",
      primaryRuler: "Moon",
      subRuler: "Pluto",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Cancer",
        type: "Core",
        planet: "Moon",
        percentage: 60,
        traits: ["Emotional foundation", "Nurturing", "Memory"]
      },
      {
        source: "Scorpio",
        type: "Pluto Peak",
        planet: "Pluto",
        percentage: 40,
        traits: ["Death-rebirth cycles", "Psychological insight", "Transformative power", "Regeneration"]
      }
    ],
    qualities: {
      emotionalDepth: { level: 100, label: "Maximum", icon: "\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A" },
      nurturingInstinct: { level: 80, label: "High", icon: "\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31" },
      protectiveness: { level: 90, label: "Very High", icon: "\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F" },
      intuition: { level: 95, label: "Very High", icon: "\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E" },
      empathy: { level: 85, label: "Very High", icon: "\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F" },
      memoryRetention: { level: 95, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      patience: { level: 65, label: "Medium-High", icon: "\u23F3\u23F3\u23F3" },
      independence: { level: 45, label: "Medium", icon: "\uD83E\uDDED\uD83E\uDDED\uD83E\uDDED" },
      speed: { level: 40, label: "Low-Medium", icon: "\u26A1\u26A1" },
      riskTolerance: { level: 30, label: "Low", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Transforms trauma into healing: emotional alchemy",
      "Profound psychological wisdom: understands the human shadow",
      "Regenerates from emotional death: phoenix energy",
      "Heals deep wounds in others: therapist of the soul",
      "Fearless in emotional depths: goes where others cannot"
    ],
    shadows: [
      "Obsessed with intensity: cannot do 'light' experiences",
      "Wounds others during transformation: collateral damage",
      "Extreme trust issues: walls within walls",
      "Addicted to crisis: manufactures drama for fuel",
      "Secretive beyond reason: hides even from self"
    ],
    careerSignatures: [
      "Psychotherapist",
      "Crisis Counselor",
      "Depth Psychologist",
      "Hospice Worker",
      "Shamanic Healer"
    ],
    relationshipStyle: {
      pursuit: "Deep and probing \u2014 seeks soul-level connection",
      commitmentSpeed: "Very slow \u2014 must excavate emotional truth first",
      passion: "Transformative, consuming, total emotional fusion",
      conflict: "Goes to depths, seeks transformation through crisis",
      jealousy: "Intense \u2014 experiences betrayal as existential threat"
    },
    famousExamples: [
      {
        name: "Nelson Mandela",
        birthdate: "July 18",
        degree: "~18.9\u00B0 Cancer",
        notes: "Transformed imprisonment into world-changing forgiveness"
      },
      {
        name: "Ernest Hemingway",
        birthdate: "July 21",
        degree: "~13.26\u00B0 Cancer",
        notes: "Wrote from the deepest emotional intensity"
      }
    ],
    sabianSymbol: {
      degree: 18,
      symbol: "A pearl forming inside an oyster",
      interpretation: "Pain transformed into lasting beauty. The irritant becomes the treasure \u2014 the Cancer-Scorpio decan's greatest gift."
    },
    nakshatra: {
      name: "Ashlesha",
      range: "16\u00B040' - 30\u00B0 Cancer (sidereal)",
      ruler: "Mercury",
      symbol: "Serpent",
      deity: "Naga (Serpent Deities)",
      qualities: ["Kundalini energy", "Psychological penetration", "Transformative poison-to-medicine"]
    },
    colorTheme: {
      primary: "#191970",
      secondary: "#4B0082",
      gradient: "linear-gradient(135deg, #191970 0%, #4B0082 100%)"
    }
  },

  {
    id: 5,
    name: "The Mystic Caregiver",
    archetype: "The Universal Heart",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 110,
      absoluteEnd: 114.99
    },
    dateRange: {
      start: "July 11",
      end: "July 15",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable)",
      primaryRuler: "Moon",
      subRuler: "Neptune",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Cancer",
        type: "Core",
        planet: "Moon",
        percentage: 65,
        traits: ["Emotional security", "Nurturing", "Intuition", "Memory"]
      },
      {
        source: "Pisces",
        type: "Neptune Sub-ruler",
        planet: "Neptune",
        percentage: 35,
        traits: ["Universal love", "Spiritual connection", "Artistic vision", "Boundary dissolution"]
      }
    ],
    qualities: {
      emotionalDepth: { level: 95, label: "Very High", icon: "\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A" },
      nurturingInstinct: { level: 95, label: "Very High", icon: "\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31" },
      protectiveness: { level: 70, label: "High", icon: "\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F" },
      intuition: { level: 100, label: "Maximum", icon: "\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E" },
      empathy: { level: 100, label: "Maximum", icon: "\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F" },
      memoryRetention: { level: 80, label: "High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      patience: { level: 100, label: "Maximum", icon: "\u23F3\u23F3\u23F3\u23F3\u23F3" },
      independence: { level: 25, label: "Low", icon: "\uD83E\uDDED" },
      speed: { level: 35, label: "Low-Medium", icon: "\u26A1\u26A1" },
      riskTolerance: { level: 20, label: "Low", icon: "\uD83C\uDFB2" }
    },
    strengths: [
      "Universal compassion: feels for all living beings",
      "Spiritual healing presence: people feel peace around them",
      "Artistic emotional expression: channels feelings into beauty",
      "Accepts all without judgment: unconditional grace",
      "Creates sacred spaces: wherever they are becomes sanctuary"
    ],
    shadows: [
      "No boundaries: absorbs everyone's pain",
      "Lost in spiritual realms: disconnected from practical reality",
      "Escapist tendencies: retreats from worldly demands",
      "Martyr complex: sacrifices self for cosmic obligation",
      "Confusion of self and other: loses personal identity"
    ],
    careerSignatures: [
      "Spiritual Healer",
      "Artist/Musician",
      "Meditation Teacher",
      "Hospice Care",
      "Sacred Space Designer"
    ],
    relationshipStyle: {
      pursuit: "Gentle and spiritual \u2014 soul recognition over pursuit",
      commitmentSpeed: "Follows divine timing, not earthly schedules",
      passion: "Transcendent, soul-merging, oceanic",
      conflict: "Seeks spiritual resolution, forgives through grace",
      jealousy: "Low \u2014 believes in soul freedom"
    },
    famousExamples: [
      {
        name: "Dalai Lama",
        birthdate: "July 6",
        degree: "~21.5\u00B0 Cancer",
        notes: "Universal compassion embodied"
      },
      {
        name: "Cat Stevens",
        birthdate: "July 21",
        degree: "~18.92\u00B0 Cancer",
        notes: "Spiritual journey through music and faith"
      }
    ],
    sabianSymbol: {
      degree: 23,
      symbol: "Moonlight on a calm sea",
      interpretation: "Universal compassion reflected in stillness. The Moon's light touches every wave equally \u2014 the essence of the Cancer-Pisces blend."
    },
    nakshatra: {
      name: "Ashlesha",
      range: "16\u00B040' - 30\u00B0 Cancer (sidereal)",
      ruler: "Mercury",
      symbol: "Serpent",
      deity: "Naga",
      qualities: ["Mystical wisdom", "Kundalini awakening", "Spiritual compassion"]
    },
    colorTheme: {
      primary: "#B0C4DE",
      secondary: "#E0B0FF",
      gradient: "linear-gradient(135deg, #B0C4DE 0%, #E0B0FF 100%)"
    }
  },

  {
    id: 6,
    name: "The Radiant Nurturer",
    archetype: "The Joyful Nurturer",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 115,
      absoluteEnd: 119.99
    },
    dateRange: {
      start: "July 16",
      end: "July 22",
      duration: "~7 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Mutable)",
      primaryRuler: "Moon",
      subRuler: "Neptune",
      modality: "Mutable"
    },
    influences: [
      {
        source: "Cancer",
        type: "Core",
        planet: "Moon",
        percentage: 75,
        traits: ["Emotional depth", "Nurturing", "Protection", "Memory"]
      },
      {
        source: "Leo",
        type: "Cusp Anticipation",
        planet: "Sun",
        percentage: 25,
        traits: ["Creative expression", "Warmth", "Generosity", "Charisma", "Confidence"]
      }
    ],
    qualities: {
      emotionalDepth: { level: 85, label: "Very High", icon: "\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A\uD83C\uDF0A" },
      nurturingInstinct: { level: 90, label: "Very High", icon: "\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31\uD83E\uDD31" },
      protectiveness: { level: 85, label: "Very High", icon: "\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F\uD83D\uDEE1\uFE0F" },
      intuition: { level: 85, label: "Very High", icon: "\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E\uD83D\uDD2E" },
      empathy: { level: 85, label: "Very High", icon: "\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F" },
      memoryRetention: { level: 85, label: "Very High", icon: "\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0\uD83E\uDDE0" },
      patience: { level: 75, label: "High", icon: "\u23F3\u23F3\u23F3\u23F3" },
      independence: { level: 40, label: "Low-Medium", icon: "\uD83E\uDDED\uD83E\uDDED" },
      speed: { level: 55, label: "Medium", icon: "\u26A1\u26A1\u26A1" },
      riskTolerance: { level: 35, label: "Low-Medium", icon: "\uD83C\uDFB2\uD83C\uDFB2" }
    },
    strengths: [
      "Joyful warm nurturing: care that uplifts and inspires",
      "Creates beautiful homes: aesthetic and emotional sanctuary",
      "Confident caretaker: nurtures without losing self",
      "Expresses emotions creatively: art, cooking, performance",
      "Inspires emotional courage in others"
    ],
    shadows: [
      "Needs appreciation for care: wounded when unrecognized",
      "Dramatic emotional expression: over-the-top reactions",
      "Can be controlling through nurturing: 'mother knows best'",
      "Wounded pride when care is rejected"
    ],
    careerSignatures: [
      "Interior Designer",
      "Event Planner",
      "Entertainer/Performer",
      "Family Therapist",
      "Restaurant Owner/Chef"
    ],
    relationshipStyle: {
      pursuit: "Warm and generous \u2014 grand gestures of care",
      commitmentSpeed: "Medium \u2014 wants to be appreciated first",
      passion: "Warmly expressive, celebratory, generous",
      conflict: "Dramatic expression, then forgiveness",
      jealousy: "Moderate \u2014 needs to feel special"
    },
    famousExamples: [
      {
        name: "Robin Williams",
        birthdate: "July 21",
        degree: "~26.3\u00B0 Cancer",
        notes: "Joyful emotional generosity through comedy"
      },
      {
        name: "Tom Cruise",
        birthdate: "July 3",
        degree: "~27.84\u00B0 Cancer",
        notes: "Charismatic protector with magnetic warmth"
      }
    ],
    sabianSymbol: {
      degree: 28,
      symbol: "A family reunion under summer stars",
      interpretation: "Warm celebration of emotional bonds. The Cancer-Leo cusp turns private nurturing into radiant, public love."
    },
    nakshatra: {
      name: "Ashlesha",
      range: "16\u00B040' - 30\u00B0 Cancer (sidereal)",
      ruler: "Mercury",
      symbol: "Serpent",
      deity: "Naga",
      qualities: ["Charismatic charm", "Expressive warmth", "Creative nurturing"]
    },
    colorTheme: {
      primary: "#FFB6C1",
      secondary: "#FFD700",
      gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFD700 100%)"
    }
  }
];

export default cancerZones;
