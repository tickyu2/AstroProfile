/**
 * Test Psychological Engine with Ticky's Natal Chart
 * Run this in browser console or with Node to verify the engine works
 */

import { generateCompletePsychologicalProfile } from './psychologicalProfileGenerator.js';

// Ticky's complete natal chart data
const TICKY_NATAL_CHART = {
  displayName: "Surachai Uthenpong (Ticky)",
  birthDate: "1963-04-23",
  birthTime: "09:25",

  planets: {
    sun: { sign: "Taurus", degree: 2.52 },
    moon: { sign: "Aries", degree: 25.95 },
    mercury: { sign: "Taurus", degree: 22.5 },
    venus: { sign: "Pisces", degree: 25.6 },
    mars: { sign: "Leo", degree: 14.52 },
    jupiter: { sign: "Aries", degree: 4.31 },
    saturn: { sign: "Aquarius", degree: 22.57 },
    uranus: { sign: "Virgo", degree: 1.27, retrograde: true },
    neptune: { sign: "Scorpio", degree: 14.65, retrograde: true },
    pluto: { sign: "Virgo", degree: 10.17, retrograde: true },
    ascendant: { sign: "Pisces", degree: 8.93 }
  },

  aspects: [
    // Harmonious
    { p1: "Sun", p2: "Uranus", type: "trine", orb: 1.25, nature: "harmonious" },
    { p1: "Moon", p2: "Uranus", type: "trine", orb: 5.38, nature: "harmonious" },
    { p1: "Venus", p2: "Jupiter", type: "conjunction", orb: 5.41, nature: "harmonious" },
    { p1: "Moon", p2: "Saturn", type: "sextile", orb: 4.11, nature: "harmonious" },
    { p1: "Neptune", p2: "Pluto", type: "sextile", orb: 4.37, nature: "harmonious" },
    { p1: "Sun", p2: "Moon", type: "conjunction", orb: 6.62, nature: "harmonious" },
    { p1: "Sun", p2: "Pluto", type: "trine", orb: 7.75, nature: "harmonious" },

    // Challenging
    { p1: "Mercury", p2: "Saturn", type: "square", orb: 0.67, nature: "challenging" },
    { p1: "Mars", p2: "Neptune", type: "square", orb: 2.16, nature: "challenging" },
    { p1: "Saturn", p2: "Neptune", type: "square", orb: 7.15, nature: "challenging" }
  ],

  constitutional_identity: {
    chinese: {
      dayMaster: "Yang Water",
      animal: "Water Rabbit"
    },
    western: {
      sun: { sign: "Taurus", degree: 2.52 },
      moon: { sign: "Aries", degree: 25.95 },
      ascendant: { sign: "Pisces", degree: 8.93 }
    }
  }
};

// Generate the psychological profile
export function testTickyProfile() {
  console.log("🧠 Testing Psychological Engine with Ticky's Chart...\n");

  const profile = generateCompletePsychologicalProfile(TICKY_NATAL_CHART);

  if (profile) {
    console.log("✅ Profile generated successfully!\n");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log(profile);
    console.log("═══════════════════════════════════════════════════════════════");
    return profile;
  } else {
    console.error("❌ Failed to generate profile");
    return null;
  }
}

// Export for testing
export { TICKY_NATAL_CHART };

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  window.testTickyProfile = testTickyProfile;
  window.TICKY_NATAL_CHART = TICKY_NATAL_CHART;
}
