// Scorpio Zone Database
// Complete data structure for all 6 zones across the 30° Scorpio spectrum
// Water Sign: Intense, transformative, powerful, psychic
// Ruled by Mars + Pluto: Power, transformation, death-rebirth, intensity

export const scorpioZones = [
  {
    id: 1,
    name: "The Intense Diplomat",
    archetype: "The Magnetic Strategist",
    degreeRange: {
      start: 0,
      end: 4.99,
      absoluteStart: 210,
      absoluteEnd: 214.99
    },
    dateRange: {
      start: "October 23",
      end: "October 27",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Fixed)",
      primaryRuler: "Pluto",
      subRuler: "Mars",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Libra",
        type: "Cusp Bleed",
        planet: "Venus",
        percentage: 25,
        traits: ["Diplomatic grace", "Social charm", "Harmony-seeking", "Aesthetic sense", "Balance"]
      },
      {
        source: "Scorpio",
        type: "Core",
        planet: "Pluto",
        percentage: 75,
        traits: ["Transformative power", "Emotional intensity", "Psychological insight", "Magnetism", "Strategic mind"]
      }
    ],
    qualities: {
      emotionalIntensity: { level: 85, label: "Very High", icon: "🔥🔥🔥🔥" },
      transformativePower: { level: 80, label: "High", icon: "🦅🦅🦅🦅" },
      psychologicalInsight: { level: 85, label: "Very High", icon: "🔮🔮🔮🔮" },
      loyalty: { level: 90, label: "Very High", icon: "🛡️🛡️🛡️🛡️🛡️" },
      magnetism: { level: 85, label: "Very High", icon: "🧲🧲🧲🧲" },
      secretiveness: { level: 75, label: "High", icon: "🤫🤫🤫🤫" },
      regeneration: { level: 75, label: "High", icon: "🔄🔄🔄🔄" },
      obsessiveness: { level: 70, label: "Medium-High", icon: "🎯🎯🎯" },
      speed: { level: 60, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 65, label: "Medium-High", icon: "🎲🎲🎲" }
    },
    strengths: [
      "Diplomatic psychological power: transforms conflicts gracefully",
      "Magnetic charm combined with strategic depth",
      "Balances intensity with social skill",
      "Strategic mind with harmonious presentation"
    ],
    shadows: [
      "Manipulative diplomacy: charm hiding control",
      "Passive-aggressive when deeply hurt",
      "Uses social grace to mask power plays",
      "Jealous in relationships despite calm exterior"
    ],
    careerSignatures: [
      "Diplomatic Strategist",
      "Corporate Negotiator",
      "Investigative Journalist",
      "Relationship Therapist",
      "Political Consultant"
    ],
    relationshipStyle: {
      pursuit: "Charming and strategic — calculated magnetism",
      commitmentSpeed: "Medium — strategically assesses partner",
      passion: "Intense beneath diplomatic surface",
      conflict: "Passive-aggressive then explosive transformation",
      jealousy: "High — possessive but hides it with grace"
    },
    famousExamples: [
      {
        name: "Katy Perry",
        birthdate: "October 25",
        degree: "~0.18° Scorpio",
        notes: "Intense romantic themes with pop appeal"
      },
      {
        name: "Ryan Gosling",
        birthdate: "November 12",
        degree: "~3.42° Scorpio",
        notes: "Magnetic charm with hidden depth"
      }
    ],
    sabianSymbol: {
      degree: 1,
      symbol: "A crowded sightseeing bus on a city street",
      interpretation: "Observation of life's surface before diving into depths. At the Libra-Scorpio cusp, social grace conceals penetrating insight."
    },
    nakshatra: {
      name: "Vishakha",
      range: "20° Libra - 3°20' Scorpio (sidereal)",
      ruler: "Jupiter",
      symbol: "Triumphal Arch / Potter's Wheel",
      deity: "Indra & Agni",
      qualities: ["Goal-oriented intensity", "Diplomatic power", "Strategic triumph"]
    },
    colorTheme: {
      primary: "#8B0000",
      secondary: "#800020",
      gradient: "linear-gradient(135deg, #8B0000 0%, #800020 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Transformer",
    archetype: "The Phoenix",
    degreeRange: {
      start: 5,
      end: 9.99,
      absoluteStart: 215,
      absoluteEnd: 219.99
    },
    dateRange: {
      start: "October 28",
      end: "November 1",
      duration: "~5 days"
    },
    decan: {
      number: 1,
      name: "First Decan (Fixed)",
      primaryRuler: "Pluto",
      subRuler: "Mars",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Scorpio",
        type: "Core",
        planet: "Pluto",
        percentage: 100,
        traits: ["Maximum intensity", "Total transformation", "Absolute loyalty", "Penetrating insight", "Phoenix regeneration"]
      }
    ],
    qualities: {
      emotionalIntensity: { level: 100, label: "Maximum", icon: "🔥🔥🔥🔥🔥" },
      transformativePower: { level: 100, label: "Maximum", icon: "🦅🦅🦅🦅🦅" },
      psychologicalInsight: { level: 100, label: "Maximum", icon: "🔮🔮🔮🔮🔮" },
      loyalty: { level: 100, label: "Maximum", icon: "🛡️🛡️🛡️🛡️🛡️" },
      magnetism: { level: 100, label: "Maximum", icon: "🧲🧲🧲🧲🧲" },
      secretiveness: { level: 100, label: "Maximum", icon: "🤫🤫🤫🤫🤫" },
      regeneration: { level: 100, label: "Maximum", icon: "🔄🔄🔄🔄🔄" },
      obsessiveness: { level: 100, label: "Maximum", icon: "🎯🎯🎯🎯🎯" },
      speed: { level: 50, label: "Medium", icon: "⚡⚡" },
      riskTolerance: { level: 75, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Transforms anything through sheer willpower",
      "Psychic-level insight into human motivation",
      "Unshakeable loyalty to the chosen few",
      "Rises from any destruction — phoenix incarnate"
    ],
    shadows: [
      "Destroys self and others in pursuit of transformation",
      "Paranoid trust issues: trusts almost no one",
      "Vengeful beyond reason when betrayed",
      "Obsessive to the point of self-destruction"
    ],
    careerSignatures: [
      "Forensic Psychologist",
      "Trauma Surgeon",
      "Criminal Profiler",
      "Intelligence Analyst",
      "Transformation Coach"
    ],
    relationshipStyle: {
      pursuit: "All-or-nothing — consumes completely",
      commitmentSpeed: "Slow to trust, then total devotion",
      passion: "Obsessive, consuming, soul-merging",
      conflict: "All-out psychological warfare",
      jealousy: "Extreme — possessive to the core"
    },
    famousExamples: [
      {
        name: "Leonardo DiCaprio",
        birthdate: "November 11",
        degree: "~5.51° Scorpio",
        notes: "Intense method acting, transformative roles"
      },
      {
        name: "Pablo Picasso",
        birthdate: "October 25",
        degree: "~8.19° Scorpio",
        notes: "Transformative artistic power"
      }
    ],
    sabianSymbol: {
      degree: 7,
      symbol: "Deep-sea divers",
      interpretation: "Descending into the absolute depths of experience. Pure Scorpio energy — fearless exploration of what lies beneath."
    },
    nakshatra: {
      name: "Anuradha",
      range: "3°20' - 16°40' Scorpio (sidereal)",
      ruler: "Saturn",
      symbol: "Triumphal Gateway / Lotus",
      deity: "Mitra (Friend, Alliance)",
      qualities: ["Devotion", "Friendship", "Enduring loyalty"]
    },
    colorTheme: {
      primary: "#660000",
      secondary: "#330000",
      gradient: "linear-gradient(135deg, #660000 0%, #330000 100%)"
    }
  },

  {
    id: 3,
    name: "The Mystical Healer",
    archetype: "The Wounded Healer",
    degreeRange: {
      start: 10,
      end: 14.99,
      absoluteStart: 220,
      absoluteEnd: 224.99
    },
    dateRange: {
      start: "November 2",
      end: "November 6",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed Water)",
      primaryRuler: "Pluto",
      subRuler: "Neptune",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Scorpio",
        type: "Core",
        planet: "Pluto",
        percentage: 70,
        traits: ["Transformative depth", "Psychological power", "Intensity", "Regeneration", "Secret-keeping"]
      },
      {
        source: "Pisces",
        type: "Decan Blend",
        planet: "Neptune",
        percentage: 30,
        traits: ["Spiritual transcendence", "Compassion", "Mystical awareness", "Healing power", "Artistic expression"]
      }
    ],
    qualities: {
      emotionalIntensity: { level: 95, label: "Very High", icon: "🔥🔥🔥🔥🔥" },
      transformativePower: { level: 95, label: "Very High", icon: "🦅🦅🦅🦅🦅" },
      psychologicalInsight: { level: 95, label: "Very High", icon: "🔮🔮🔮🔮🔮" },
      loyalty: { level: 90, label: "Very High", icon: "🛡️🛡️🛡️🛡️🛡️" },
      magnetism: { level: 90, label: "Very High", icon: "🧲🧲🧲🧲🧲" },
      secretiveness: { level: 85, label: "Very High", icon: "🤫🤫🤫🤫" },
      regeneration: { level: 95, label: "Very High", icon: "🔄🔄🔄🔄🔄" },
      obsessiveness: { level: 85, label: "Very High", icon: "🎯🎯🎯🎯" },
      speed: { level: 45, label: "Medium-Low", icon: "⚡⚡" },
      riskTolerance: { level: 70, label: "Medium-High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Transforms pain into spiritual wisdom",
      "Heals deep trauma in self and others",
      "Compassionate psychological insight",
      "Mystical regenerative power beyond the ordinary"
    ],
    shadows: [
      "Lost in spiritual depths: disconnected from reality",
      "Martyrdom through endless transformation",
      "Escapist when intensity becomes overwhelming",
      "Addictive personality seeking transcendence"
    ],
    careerSignatures: [
      "Depth Psychotherapist",
      "Spiritual Healer",
      "Hospice Counselor",
      "Addiction Specialist",
      "Transformative Artist"
    ],
    relationshipStyle: {
      pursuit: "Spiritually magnetic — draws through mystical depth",
      commitmentSpeed: "Slow — seeks soul-level connection",
      passion: "Transcendent, healing, deeply compassionate",
      conflict: "Transforms through understanding and forgiveness",
      jealousy: "Moderate — softened by spiritual awareness"
    },
    famousExamples: [
      {
        name: "Whoopi Goldberg",
        birthdate: "November 13",
        degree: "~11.15° Scorpio",
        notes: "Transformative healing comedy"
      },
      {
        name: "Jodie Foster",
        birthdate: "November 19",
        degree: "~13.28° Scorpio",
        notes: "Deep psychological roles"
      }
    ],
    sabianSymbol: {
      degree: 12,
      symbol: "An embassy ball",
      interpretation: "Beneath the social surface, deep psychological currents flow. Neptune softens Pluto's intensity into mystical healing."
    },
    nakshatra: {
      name: "Anuradha",
      range: "3°20' - 16°40' Scorpio (sidereal)",
      ruler: "Saturn",
      symbol: "Triumphal Gateway / Lotus",
      deity: "Mitra (Friend, Alliance)",
      qualities: ["Healing friendship", "Spiritual devotion", "Mystical understanding"]
    },
    colorTheme: {
      primary: "#4B0082",
      secondary: "#483D8B",
      gradient: "linear-gradient(135deg, #4B0082 0%, #483D8B 100%)"
    }
  },

  {
    id: 4,
    name: "The Deep Regenerator",
    archetype: "The Eternal Phoenix",
    degreeRange: {
      start: 15,
      end: 19.99,
      absoluteStart: 225,
      absoluteEnd: 229.99
    },
    dateRange: {
      start: "November 7",
      end: "November 11",
      duration: "~5 days"
    },
    decan: {
      number: 2,
      name: "Second Decan (Fixed Water)",
      primaryRuler: "Pluto",
      subRuler: "Neptune",
      modality: "Fixed"
    },
    influences: [
      {
        source: "Scorpio",
        type: "Core",
        planet: "Pluto",
        percentage: 60,
        traits: ["Death-rebirth cycles", "Transformative power", "Psychological depth", "Regeneration", "Life force"]
      },
      {
        source: "Pisces",
        type: "Decan Peak",
        planet: "Neptune",
        percentage: 40,
        traits: ["Spiritual dissolution", "Universal compassion", "Redemption", "Transcendence", "Infinite patience"]
      }
    ],
    qualities: {
      emotionalIntensity: { level: 90, label: "Very High", icon: "🔥🔥🔥🔥🔥" },
      transformativePower: { level: 100, label: "Maximum", icon: "🦅🦅🦅🦅🦅" },
      psychologicalInsight: { level: 90, label: "Very High", icon: "🔮🔮🔮🔮🔮" },
      loyalty: { level: 85, label: "Very High", icon: "🛡️🛡️🛡️🛡️" },
      magnetism: { level: 85, label: "Very High", icon: "🧲🧲🧲🧲" },
      secretiveness: { level: 75, label: "High", icon: "🤫🤫🤫🤫" },
      regeneration: { level: 100, label: "Maximum", icon: "🔄🔄🔄🔄🔄" },
      obsessiveness: { level: 75, label: "High", icon: "🎯🎯🎯🎯" },
      speed: { level: 40, label: "Low-Medium", icon: "⚡⚡" },
      riskTolerance: { level: 75, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Redeems the seemingly unredeemable",
      "Transforms darkness into spiritual light",
      "Infinite regenerative capacity — rises from any destruction",
      "Forgives and transcends all wounds"
    ],
    shadows: [
      "Martyrdom complex: suffers for transformation",
      "Loses self in others' darkness and pain",
      "Addictive escapism when transformation overwhelms",
      "Spiritual bypassing of real-world issues"
    ],
    careerSignatures: [
      "Hospice Worker",
      "Trauma Recovery Specialist",
      "Spiritual Director",
      "Rehabilitation Counselor",
      "Transformative Writer"
    ],
    relationshipStyle: {
      pursuit: "Slow and cosmic — waits for destined connection",
      commitmentSpeed: "Very slow — seeks soul-level merge",
      passion: "Transcendent, redemptive, infinitely patient",
      conflict: "Surrenders ego, seeks spiritual resolution",
      jealousy: "Low — dissolved by spiritual awareness"
    },
    famousExamples: [
      {
        name: "Martin Scorsese",
        birthdate: "November 17",
        degree: "~16.23° Scorpio",
        notes: "Transforms violence into art"
      },
      {
        name: "Joaquin Phoenix",
        birthdate: "October 28",
        degree: "~18.47° Scorpio",
        notes: "Deep redemptive performances"
      }
    ],
    sabianSymbol: {
      degree: 17,
      symbol: "A woman, fecundated by her own spirit, is 'great with child'",
      interpretation: "Self-regeneration through spiritual fertilization. Peak Neptune-Pluto fusion — transformation that births new life from pure spirit."
    },
    nakshatra: {
      name: "Jyeshtha",
      range: "16°40' - 30° Scorpio (sidereal)",
      ruler: "Mercury",
      symbol: "Circular Amulet / Earring",
      deity: "Indra (King of Gods)",
      qualities: ["Elder wisdom", "Protective power", "Mystical authority"]
    },
    colorTheme: {
      primary: "#191970",
      secondary: "#000080",
      gradient: "linear-gradient(135deg, #191970 0%, #000080 100%)"
    }
  },

  {
    id: 5,
    name: "The Protective Warrior",
    archetype: "The Fierce Guardian",
    degreeRange: {
      start: 20,
      end: 24.99,
      absoluteStart: 230,
      absoluteEnd: 234.99
    },
    dateRange: {
      start: "November 12",
      end: "November 16",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Cardinal Water)",
      primaryRuler: "Pluto",
      subRuler: "Moon",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Scorpio",
        type: "Core",
        planet: "Pluto",
        percentage: 70,
        traits: ["Transformative protection", "Warrior intensity", "Psychological power", "Strategic defense", "Deep loyalty"]
      },
      {
        source: "Cancer",
        type: "Decan Blend",
        planet: "Moon",
        percentage: 30,
        traits: ["Nurturing instinct", "Fierce protectiveness", "Emotional memory", "Home orientation", "Family devotion"]
      }
    ],
    qualities: {
      emotionalIntensity: { level: 95, label: "Very High", icon: "🔥🔥🔥🔥🔥" },
      transformativePower: { level: 85, label: "Very High", icon: "🦅🦅🦅🦅" },
      psychologicalInsight: { level: 90, label: "Very High", icon: "🔮🔮🔮🔮🔮" },
      loyalty: { level: 100, label: "Maximum", icon: "🛡️🛡️🛡️🛡️🛡️" },
      magnetism: { level: 85, label: "Very High", icon: "🧲🧲🧲🧲" },
      secretiveness: { level: 90, label: "Very High", icon: "🤫🤫🤫🤫🤫" },
      regeneration: { level: 85, label: "Very High", icon: "🔄🔄🔄🔄" },
      obsessiveness: { level: 90, label: "Very High", icon: "🎯🎯🎯🎯🎯" },
      speed: { level: 55, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 80, label: "High", icon: "🎲🎲🎲🎲" }
    },
    strengths: [
      "Unstoppable protector of family and tribe",
      "Transforms threats into allies through sheer will",
      "Nurtures through intensity and fierce devotion",
      "Creates impenetrable safe spaces for loved ones"
    ],
    shadows: [
      "Smothering overprotection: suffocates loved ones",
      "Paranoid about threats to family and clan",
      "Vengeful beyond reason if family is hurt",
      "Possessive control disguised as care"
    ],
    careerSignatures: [
      "Security Specialist",
      "Family Law Attorney",
      "Protective Services Worker",
      "Military Strategist",
      "Emergency Responder"
    ],
    relationshipStyle: {
      pursuit: "Protective and devoted — shields partner completely",
      commitmentSpeed: "Fast once trust is established",
      passion: "Fierce, nurturing, all-consuming devotion",
      conflict: "Destroys threats, protects partner at all costs",
      jealousy: "Extreme — fiercely possessive of loved ones"
    },
    famousExamples: [
      {
        name: "Scarlett Johansson",
        birthdate: "November 22",
        degree: "~21.15° Scorpio",
        notes: "Fierce protective roles"
      },
      {
        name: "Owen Wilson",
        birthdate: "November 18",
        degree: "~23.42° Scorpio",
        notes: "Loyal friend archetype"
      }
    ],
    sabianSymbol: {
      degree: 22,
      symbol: "Hunters shooting wild ducks",
      interpretation: "The protective warrior eliminates threats with precision. Cancer-Moon influence transforms Scorpio's intensity into fierce family defense."
    },
    nakshatra: {
      name: "Jyeshtha",
      range: "16°40' - 30° Scorpio (sidereal)",
      ruler: "Mercury",
      symbol: "Circular Amulet / Earring",
      deity: "Indra (King of Gods)",
      qualities: ["Protective authority", "Fierce guardianship", "Elder strength"]
    },
    colorTheme: {
      primary: "#8B0000",
      secondary: "#4B0000",
      gradient: "linear-gradient(135deg, #8B0000 0%, #4B0000 100%)"
    }
  },

  {
    id: 6,
    name: "The Alchemical Master",
    archetype: "The Dark Sage",
    degreeRange: {
      start: 25,
      end: 29.99,
      absoluteStart: 235,
      absoluteEnd: 239.99
    },
    dateRange: {
      start: "November 17",
      end: "November 21",
      duration: "~5 days"
    },
    decan: {
      number: 3,
      name: "Third Decan (Cardinal Water)",
      primaryRuler: "Pluto",
      subRuler: "Moon",
      modality: "Cardinal"
    },
    influences: [
      {
        source: "Scorpio",
        type: "Core",
        planet: "Pluto",
        percentage: 75,
        traits: ["Transformative power", "Psychological mastery", "Regeneration", "Intensity", "Depth"]
      },
      {
        source: "Sagittarius",
        type: "Cusp Bleed",
        planet: "Jupiter",
        percentage: 25,
        traits: ["Philosophical depth", "Adventurousness", "Optimism", "Teaching ability", "Expansive wisdom"]
      }
    ],
    qualities: {
      emotionalIntensity: { level: 85, label: "Very High", icon: "🔥🔥🔥🔥" },
      transformativePower: { level: 90, label: "Very High", icon: "🦅🦅🦅🦅🦅" },
      psychologicalInsight: { level: 90, label: "Very High", icon: "🔮🔮🔮🔮🔮" },
      loyalty: { level: 85, label: "Very High", icon: "🛡️🛡️🛡️🛡️" },
      magnetism: { level: 90, label: "Very High", icon: "🧲🧲🧲🧲🧲" },
      secretiveness: { level: 75, label: "High", icon: "🤫🤫🤫🤫" },
      regeneration: { level: 90, label: "Very High", icon: "🔄🔄🔄🔄🔄" },
      obsessiveness: { level: 75, label: "High", icon: "🎯🎯🎯🎯" },
      speed: { level: 65, label: "Medium", icon: "⚡⚡⚡" },
      riskTolerance: { level: 85, label: "Very High", icon: "🎲🎲🎲🎲🎲" }
    },
    strengths: [
      "Transforms through philosophical adventure",
      "Teaches transformative wisdom with depth and warmth",
      "Explores psychological depths fearlessly",
      "Optimistic about regeneration and rebirth"
    ],
    shadows: [
      "Reckless with transformative processes",
      "Preachy about darkness and shadow work",
      "Restless: avoids completing deep work",
      "Commitment issues: Sagittarius freedom vs Scorpio bonds"
    ],
    careerSignatures: [
      "Philosophy Professor",
      "Transformational Speaker",
      "Adventure Therapist",
      "Documentary Filmmaker",
      "Depth Psychology Researcher"
    ],
    relationshipStyle: {
      pursuit: "Adventurous and intense — philosophical seduction",
      commitmentSpeed: "Slow — torn between freedom and depth",
      passion: "Philosophical intensity, teaching through love",
      conflict: "Confronts with truth, then escapes for perspective",
      jealousy: "Moderate — freedom-seeking softens possessiveness"
    },
    famousExamples: [
      {
        name: "Bruce Lee",
        birthdate: "November 27",
        degree: "~25.18° Scorpio",
        notes: "Adventurous transformative intensity"
      },
      {
        name: "Jimi Hendrix",
        birthdate: "November 27",
        degree: "~27.42° Scorpio",
        notes: "Dark charismatic artistic teaching"
      }
    ],
    sabianSymbol: {
      degree: 27,
      symbol: "A military band marches noisily on through the city streets",
      interpretation: "At the Sagittarius cusp, Scorpio's transformative power expands into public philosophical teaching. The Dark Sage shares wisdom loudly."
    },
    nakshatra: {
      name: "Jyeshtha",
      range: "16°40' - 30° Scorpio (sidereal)",
      ruler: "Mercury",
      symbol: "Circular Amulet / Earring",
      deity: "Indra (King of Gods)",
      qualities: ["Philosophical mastery", "Alchemical wisdom", "Fearless exploration"]
    },
    colorTheme: {
      primary: "#8B4513",
      secondary: "#A0522D",
      gradient: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)"
    }
  }
];

export default scorpioZones;
