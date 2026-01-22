/**
 * Vedic Astrology Service
 * Handles API calls to the Vedic chart calculation endpoint
 * Includes client-side fallback for local development
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { RASHIS, NAKSHATRAS, AYANAMSHAS } from '../data/vedicConstants';

const functions = getFunctions();

// Lahiri ayanamsha value (approximate, varies by year)
// This is a simplified calculation for client-side fallback
const LAHIRI_AYANAMSHA_2024 = 24.17; // Approximate value for 2024

// ============================================================================
// CLIENT-SIDE INTERPRETATION CONSTANTS
// ============================================================================

const LAGNA_INTERPRETATIONS = {
  Mesha: "An Aries (Mesha) Lagna brings a direct, pioneering, and action-oriented approach to life. You tend to initiate quickly and learn through experience. Mars rules your chart, giving courage and competitive spirit.",
  Vrishabha: "A Taurus (Vrishabha) Lagna values stability, comfort, and tangible results. You move steadily and prefer to build lasting foundations. Venus rules your chart, emphasizing beauty and material security.",
  Mithuna: "A Gemini (Mithuna) Lagna is curious, communicative, and mentally agile. You learn through interaction and variety. Mercury rules your chart, giving intellectual adaptability.",
  Karka: "A Cancer (Karka) Lagna is sensitive, protective, and nurturing. Emotional security and home are central themes. The Moon rules your chart, emphasizing emotional intelligence.",
  Simha: "A Leo (Simha) Lagna is expressive, proud, and creative. You naturally seek to shine and lead from the heart. The Sun rules your chart, giving authority and vitality.",
  Kanya: "A Virgo (Kanya) Lagna is analytical, precise, and service-oriented. You refine, improve, and pay attention to details. Mercury rules your chart with a practical focus.",
  Tula: "A Libra (Tula) Lagna is relational, diplomatic, and balance-seeking. Partnerships and harmony are key life themes. Venus rules your chart, emphasizing relationships.",
  Vrishchika: "A Scorpio (Vrishchika) Lagna is intense, private, and transformative. You move through deep emotional cycles and regeneration. Mars rules your chart with depth and power.",
  Dhanu: "A Sagittarius (Dhanu) Lagna is philosophical, adventurous, and future-oriented. You seek meaning, learning, and expansion. Jupiter rules your chart, giving wisdom and optimism.",
  Makara: "A Capricorn (Makara) Lagna is disciplined, pragmatic, and status-aware. You build slowly toward long-term goals. Saturn rules your chart, emphasizing responsibility.",
  Kumbha: "An Aquarius (Kumbha) Lagna is unconventional, idealistic, and community-minded. You think ahead of your time. Saturn rules your chart with a humanitarian focus.",
  Meena: "A Pisces (Meena) Lagna is imaginative, sensitive, and spiritual. You navigate life through intuition and compassion. Jupiter rules your chart, giving spiritual depth.",
};

const NAKSHATRA_INTERPRETATIONS = {
  Ashwini: "Ashwini brings speed, initiative, and healing energy. Emotionally, there is a drive to start things and move quickly. The Ashwini Kumaras bestow the power to heal and renew.",
  Bharani: "Bharani carries themes of responsibility, intensity, and transformation. Emotional life can feel deep and consequential. Yama, the lord of dharma, governs this star.",
  Krittika: "Krittika is sharp, discerning, and protective. There is a strong will to cut through confusion and refine. Agni's fire purifies and illuminates.",
  Rohini: "Rohini is fertile, attractive, and growth-oriented. Emotional nature seeks beauty, comfort, and creative expression. Brahma's creativity flows through this nakshatra.",
  Mrigashira: "Mrigashira is searching, curious, and restless. The mind explores, questions, and seeks new experiences. Soma brings a gentle, questing nature.",
  Ardra: "Ardra is intense, stormy, and transformative. Emotional life may pass through catharsis and deep change. Rudra's power brings destruction that clears the path for renewal.",
  Punarvasu: "Punarvasu is renewing, hopeful, and resilient. There is a capacity to recover and begin again. Aditi, the cosmic mother, offers restoration.",
  Pushya: "Pushya is nurturing, supportive, and devotional. Emotional fulfillment comes through caring and guidance. This is considered the most auspicious nakshatra.",
  Ashlesha: "Ashlesha is penetrating, binding, and psychologically deep. Emotions can be complex and intense. The serpent energy gives insight into hidden realms.",
  Magha: "Magha is regal, ancestral, and status-conscious. Emotional life is tied to legacy and recognition. The Pitris (ancestors) bestow authority and dignity.",
  "Purva Phalguni": "Purva Phalguni is pleasure-seeking, creative, and relational. There is a love of enjoyment and connection. Bhaga brings good fortune in relationships.",
  "Uttara Phalguni": "Uttara Phalguni is generous, responsible, and stabilizing. Relationships and agreements are central. Aryaman governs contracts and friendship.",
  Hasta: "Hasta is skillful, clever, and hands-on. Emotional nature expresses through doing, crafting, and managing. Savitar brings skill and dexterity.",
  Chitra: "Chitra is artistic, striking, and individualistic. There is a drive to create and stand out. Vishvakarman, the celestial architect, gives creative vision.",
  Swati: "Swati is independent, flexible, and wind-like. Emotional life values freedom and self-direction. Vayu brings adaptability and movement.",
  Vishakha: "Vishakha is goal-driven, determined, and focused. There is intensity in pursuing chosen aims. Indra and Agni together give conquering power.",
  Anuradha: "Anuradha is loyal, devotional, and friendship-oriented. Emotional fulfillment comes through bonds and shared purpose. Mitra, the god of friendship, governs here.",
  Jyeshtha: "Jyeshtha is protective, senior, and responsible. Emotions may carry themes of duty and authority. Indra bestows leadership and protective power.",
  Mula: "Mula is root-seeking, radical, and transformative. Emotional life may involve deep uprooting and truth-seeking. Nirriti brings the power to destroy and regenerate.",
  "Purva Ashadha": "Purva Ashadha is victorious, idealistic, and persuasive. There is a drive to champion beliefs. Apas, the water deity, brings purification and invincibility.",
  "Uttara Ashadha": "Uttara Ashadha is enduring, principled, and leadership-oriented. Emotional nature seeks lasting achievement. The Vishvadevas bestow universal qualities.",
  Shravana: "Shravana is listening, learning, and reputation-focused. Emotional fulfillment comes through knowledge and recognition. Vishnu brings the power of connection.",
  Dhanishta: "Dhanishta is rhythmic, communal, and achievement-oriented. There is a drive to perform and contribute. The Vasus bring abundance and fame.",
  Shatabhisha: "Shatabhisha is solitary, healing, and boundary-focused. Emotional life may involve withdrawal and deep repair. Varuna governs the cosmic waters.",
  "Purva Bhadrapada": "Purva Bhadrapada is intense, idealistic, and transformative. There can be extremes in belief and emotion. Aja Ekapada brings fierce one-pointed energy.",
  "Uttara Bhadrapada": "Uttara Bhadrapada is stabilizing, deep, and contemplative. Emotional nature leans toward inner work. Ahir Budhnya brings wisdom from the depths.",
  Revati: "Revati is gentle, protective, and guiding. Emotional fulfillment comes through support, travel, and completion. Pushan guides safe journeys and nurtures growth.",
};

const GRAHA_BASE_THEMES = {
  surya: "The Sun represents identity, vitality, authority, father, and soul purpose.",
  chandra: "The Moon represents mind, emotions, mother, habits, and inner security.",
  mangala: "Mars represents drive, courage, conflict, siblings, and technical skill.",
  budha: "Mercury represents intellect, communication, trade, and adaptability.",
  guru: "Jupiter represents wisdom, growth, faith, teachers, and blessings.",
  shukra: "Venus represents love, beauty, pleasure, art, and harmony.",
  shani: "Saturn represents discipline, structure, karma, delays, and endurance.",
  rahu: "Rahu represents obsession, innovation, foreignness, and worldly desires.",
  ketu: "Ketu represents detachment, spirituality, past-life residue, and sudden breaks.",
};

const GRAHA_OWN_SIGNS = {
  surya: ["Simha"],
  chandra: ["Karka"],
  mangala: ["Mesha", "Vrishchika"],
  budha: ["Mithuna", "Kanya"],
  guru: ["Dhanu", "Meena"],
  shukra: ["Vrishabha", "Tula"],
  shani: ["Makara", "Kumbha"],
  rahu: [],
  ketu: [],
};

const GRAHA_EXALTATION = {
  surya: "Mesha", chandra: "Vrishabha", mangala: "Makara", budha: "Kanya",
  guru: "Karka", shukra: "Meena", shani: "Tula", rahu: "Vrishabha", ketu: "Vrishchika"
};

const GRAHA_DEBILITATION = {
  surya: "Tula", chandra: "Vrishchika", mangala: "Karka", budha: "Meena",
  guru: "Makara", shukra: "Kanya", shani: "Mesha", rahu: "Vrishchika", ketu: "Vrishabha"
};

const GUNA_BY_SIGN = {
  Mesha: "Sattva", Simha: "Sattva", Dhanu: "Sattva",
  Vrishabha: "Rajas", Kanya: "Rajas", Makara: "Rajas",
  Mithuna: "Rajas", Tula: "Rajas", Kumbha: "Rajas",
  Karka: "Tamas", Vrishchika: "Tamas", Meena: "Tamas",
};

const GUNA_INTERPRETATIONS = {
  Sattva: "Sattvic temperament brings clarity, harmony, idealism, and a naturally balanced mind. You tend toward purity, truth-seeking, and spiritual orientation.",
  Rajas: "Rajasic temperament brings activity, ambition, desire, and a dynamic, restless mind. You are driven, creative, and oriented toward achievement and action.",
  Tamas: "Tamasic temperament brings depth, intensity, introspection, and emotional complexity. You process life deeply and may need more time for rest and reflection.",
};

const DOSHA_BY_SIGN = {
  Mesha: "Pitta", Simha: "Pitta", Dhanu: "Pitta", Vrishchika: "Pitta",
  Mithuna: "Vata", Tula: "Vata", Kumbha: "Vata",
  Vrishabha: "Kapha", Kanya: "Kapha", Makara: "Kapha",
  Karka: "Kapha", Meena: "Kapha",
};

const DOSHA_INTERPRETATIONS = {
  Vata: "Vata constitution brings creativity, quick thinking, intuition, and movement. You may be prone to anxiety, irregularity, or scattered energy when imbalanced.",
  Pitta: "Pitta constitution brings focus, intensity, sharp intellect, and strong willpower. You may be prone to anger, criticism, or burnout when imbalanced.",
  Kapha: "Kapha constitution brings steadiness, nurturing energy, calm, and emotional resilience. You may be prone to lethargy, attachment, or resistance to change when imbalanced.",
};

const BHAVA_MEANINGS = {
  1: "1st Bhava (Tanu): Self, body, identity, health, and overall life direction.",
  2: "2nd Bhava (Dhana): Wealth, speech, family values, food, and accumulated resources.",
  3: "3rd Bhava (Sahaja): Courage, siblings, communication, effort, and short journeys.",
  4: "4th Bhava (Sukha): Home, mother, emotional foundation, property, and inner peace.",
  5: "5th Bhava (Putra): Creativity, children, intelligence, romance, and past-life merit.",
  6: "6th Bhava (Ari): Work, service, health issues, obstacles, enemies, and daily routines.",
  7: "7th Bhava (Yuvati): Partnerships, marriage, contracts, business, and public dealings.",
  8: "8th Bhava (Randhra): Transformation, secrets, longevity, inheritance, and shared resources.",
  9: "9th Bhava (Dharma): Higher learning, teachers, father, fortune, philosophy, and long journeys.",
  10: "10th Bhava (Karma): Career, status, reputation, authority, and public role.",
  11: "11th Bhava (Labha): Gains, networks, aspirations, elder siblings, and friendships.",
  12: "12th Bhava (Vyaya): Loss, liberation, foreign lands, expenses, and spiritual retreat.",
};

// ============================================================================
// CLIENT-SIDE INTERPRETATION FUNCTIONS
// ============================================================================

function getGrahaDignity(grahaName, rashiSanskrit) {
  const ownSigns = GRAHA_OWN_SIGNS[grahaName] || [];
  const exaltation = GRAHA_EXALTATION[grahaName];
  const debilitation = GRAHA_DEBILITATION[grahaName];

  if (ownSigns.includes(rashiSanskrit)) return "own";
  if (rashiSanskrit === exaltation) return "exalted";
  if (rashiSanskrit === debilitation) return "debilitated";
  return "neutral";
}

function buildClientInterpretations(chart) {
  const grahas = chart.grahas || {};
  const bhavas = chart.bhavas || {};
  const lagna = chart.lagna || bhavas.lagna || {};
  const moonNakshatra = chart.moonNakshatra || {};
  const moonGraha = grahas.chandra || {};

  // Lagna interpretation
  const lagnaRashi = lagna.rashi?.sanskrit || "";
  const lagnaInterpretation = LAGNA_INTERPRETATIONS[lagnaRashi] ||
    `Your Lagna is in ${lagnaRashi}, shaping your approach to life and self-expression.`;

  // Moon Nakshatra interpretation
  const moonNakName = moonNakshatra.name || "";
  const moonNakInterpretation = NAKSHATRA_INTERPRETATIONS[moonNakName] ||
    `Your Moon is in ${moonNakName} Nakshatra, influencing your emotional nature and inner world.`;

  // Sun Nakshatra interpretation
  const sunNakName = grahas.surya?.nakshatra?.name || "";
  const sunNakInterpretation = sunNakName ?
    `Sun in ${sunNakName}: ${NAKSHATRA_INTERPRETATIONS[sunNakName] || "Shaping your identity and life purpose."}` : "";

  // Graha strengths
  const grahaStrengths = [];
  for (const [name, data] of Object.entries(grahas)) {
    if (!data || !data.rashi) continue;
    const rashiSanskrit = data.rashi.sanskrit || "";
    const rashiEnglish = data.rashi.english || "";
    const dignity = getGrahaDignity(name, rashiSanskrit);
    const englishName = data.english || name.charAt(0).toUpperCase() + name.slice(1);
    const baseTheme = GRAHA_BASE_THEMES[name] || "";

    if (dignity === "own") {
      grahaStrengths.push(`${englishName} is in its own sign (${rashiEnglish}), strengthening its natural qualities. ${baseTheme}`);
    } else if (dignity === "exalted") {
      grahaStrengths.push(`${englishName} is exalted in ${rashiEnglish}, powerfully expressing its highest nature. ${baseTheme}`);
    } else if (dignity === "debilitated") {
      grahaStrengths.push(`${englishName} is debilitated in ${rashiEnglish}, requiring conscious effort to balance. ${baseTheme}`);
    }
  }

  // House themes
  const lagnaIndex = lagna.rashi?.index || 0;
  const houseMap = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];

  for (const [name, data] of Object.entries(grahas)) {
    if (!data || !data.rashi) continue;
    const grahaRashiIndex = data.rashi.index || 0;
    const houseNum = ((grahaRashiIndex - lagnaIndex + 12) % 12) + 1;
    const englishName = data.english || name.charAt(0).toUpperCase() + name.slice(1);
    houseMap[houseNum].push(englishName);
  }

  const houseThemes = {};
  for (let h = 1; h <= 12; h++) {
    const base = BHAVA_MEANINGS[h] || `House ${h}`;
    const planetsHere = houseMap[h];
    if (planetsHere.length > 0) {
      houseThemes[h] = `${base} Activated by: ${planetsHere.join(", ")}.`;
    } else {
      houseThemes[h] = `${base} No planets here; themes expressed through its lord.`;
    }
  }

  // Guna & Dosha temperament
  const lagnaGuna = GUNA_BY_SIGN[lagnaRashi] || "Rajas";
  const moonRashi = moonGraha.rashi?.sanskrit || "";
  const moonGuna = GUNA_BY_SIGN[moonRashi] || "Rajas";
  const lagnaDosha = DOSHA_BY_SIGN[lagnaRashi] || "Vata";
  const moonDosha = DOSHA_BY_SIGN[moonRashi] || "Vata";

  const gunaCounts = { Sattva: 0, Rajas: 0, Tamas: 0 };
  gunaCounts[lagnaGuna] = (gunaCounts[lagnaGuna] || 0) + 1;
  gunaCounts[moonGuna] = (gunaCounts[moonGuna] || 0) + 2;
  const dominantGuna = Object.entries(gunaCounts).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  const doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0 };
  doshaCounts[lagnaDosha] = (doshaCounts[lagnaDosha] || 0) + 1;
  doshaCounts[moonDosha] = (doshaCounts[moonDosha] || 0) + 2;
  const dominantDosha = Object.entries(doshaCounts).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  // Overall synthesis
  const synthesisParts = [];
  const lagnaEnglish = lagna.rashi?.english || "Unknown";
  synthesisParts.push(`Your ${lagnaEnglish} (${lagnaRashi}) Lagna shapes how you approach life.`);
  if (moonNakName) {
    synthesisParts.push(`Your Moon in ${moonNakName} Nakshatra describes your emotional wiring.`);
  }
  const strongGrahas = [];
  for (const [name, data] of Object.entries(grahas)) {
    if (!data || !data.rashi) continue;
    const dignity = getGrahaDignity(name, data.rashi.sanskrit || "");
    if (dignity === "own" || dignity === "exalted") {
      strongGrahas.push(data.english || name);
    }
  }
  if (strongGrahas.length > 0) {
    synthesisParts.push(`Notable strength in ${strongGrahas.join(", ")} gives these planets a major role.`);
  }

  return {
    lagna: lagnaInterpretation,
    moonNakshatra: moonNakInterpretation,
    sunNakshatra: sunNakInterpretation,
    grahaStrengths: grahaStrengths,
    houseThemes: houseThemes,
    dashaSummary: "Dasha information requires precise calculations from the backend.",
    overallSynthesis: synthesisParts.join(" "),
    temperament: {
      lagnaGuna,
      moonGuna,
      dominantGuna,
      gunaInterpretation: GUNA_INTERPRETATIONS[dominantGuna] || "",
      lagnaDosha,
      moonDosha,
      dominantDosha,
      doshaInterpretation: DOSHA_INTERPRETATIONS[dominantDosha] || "",
    }
  };
}

/**
 * Calculate Julian Day from date/time
 */
function calculateJulianDay(year, month, day, hour, minute) {
  // Convert to Julian Day Number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Add time fraction
  const timeFraction = (hour + minute / 60) / 24 - 0.5;
  return jdn + timeFraction;
}

/**
 * Calculate approximate planetary positions (simplified for client-side)
 * This is a rough approximation - real calculations need Swiss Ephemeris
 */
function calculateApproximatePlanets(jd, ayanamshaValue) {
  // Mean longitude calculation constants (simplified)
  const J2000 = 2451545.0; // Julian Day for Jan 1, 2000 12:00 TT
  const d = jd - J2000;

  // Simplified mean longitudes (approximate)
  const meanLongitudes = {
    surya: (280.4606184 + 0.9856473 * d) % 360,
    chandra: (218.3164477 + 13.17639648 * d) % 360,
    mangala: (355.433275 + 0.5240207766 * d) % 360,
    budha: (60.2 + 4.0923344368 * d) % 360, // Simplified
    guru: (34.40438 + 0.08308676 * d) % 360,
    shukra: (181.9 + 1.6021302244 * d) % 360, // Simplified
    shani: (50.077444 + 0.0334442282 * d) % 360,
    rahu: (125.04 - 0.05295377 * d) % 360, // Mean node
  };

  // Convert to sidereal by subtracting ayanamsha
  const grahas = {};

  for (const [name, tropicalLong] of Object.entries(meanLongitudes)) {
    let siderealLong = (tropicalLong - ayanamshaValue + 360) % 360;

    const rashiIndex = Math.floor(siderealLong / 30) % 12;
    const degreeInRashi = siderealLong % 30;
    const rashi = RASHIS[rashiIndex];

    // Calculate nakshatra
    const nakshatraSpan = 360 / 27;
    const nakshatraIndex = Math.floor(siderealLong / nakshatraSpan) % 27;
    const degreeInNakshatra = siderealLong % nakshatraSpan;
    const pada = Math.floor(degreeInNakshatra / (nakshatraSpan / 4)) + 1;
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    grahas[name] = {
      longitude: siderealLong,
      latitude: 0,
      speed: name === 'rahu' ? -0.05 : 1,
      retrograde: name === 'rahu',
      rashi: {
        index: rashiIndex,
        sanskrit: rashi.sanskrit,
        english: rashi.english,
        lord: rashi.lord,
        element: rashi.element,
        symbol: rashi.symbol,
        degree: degreeInRashi,
        formatted: `${degreeInRashi.toFixed(2)}° ${rashi.sanskrit}`
      },
      nakshatra: {
        index: nakshatraIndex,
        name: nakshatra.name,
        lord: nakshatra.lord,
        deity: nakshatra.deity,
        symbol: nakshatra.symbol,
        quality: nakshatra.quality,
        pada: pada,
        degreeInNakshatra: degreeInNakshatra,
        formatted: `${nakshatra.name} Pada ${pada}`
      },
      english: name.charAt(0).toUpperCase() + name.slice(1)
    };
  }

  // Calculate Ketu (opposite to Rahu)
  const rahuLong = grahas.rahu.longitude;
  const ketuLong = (rahuLong + 180) % 360;
  const ketuRashiIndex = Math.floor(ketuLong / 30) % 12;
  const ketuRashi = RASHIS[ketuRashiIndex];
  const ketuNakshatraSpan = 360 / 27;
  const ketuNakshatraIndex = Math.floor(ketuLong / ketuNakshatraSpan) % 27;
  const ketuNakshatra = NAKSHATRAS[ketuNakshatraIndex];
  const ketuPada = Math.floor((ketuLong % ketuNakshatraSpan) / (ketuNakshatraSpan / 4)) + 1;

  grahas.ketu = {
    longitude: ketuLong,
    latitude: 0,
    speed: -0.05,
    retrograde: true,
    rashi: {
      index: ketuRashiIndex,
      sanskrit: ketuRashi.sanskrit,
      english: ketuRashi.english,
      lord: ketuRashi.lord,
      element: ketuRashi.element,
      symbol: ketuRashi.symbol,
      degree: ketuLong % 30,
      formatted: `${(ketuLong % 30).toFixed(2)}° ${ketuRashi.sanskrit}`
    },
    nakshatra: {
      index: ketuNakshatraIndex,
      name: ketuNakshatra.name,
      lord: ketuNakshatra.lord,
      deity: ketuNakshatra.deity,
      symbol: ketuNakshatra.symbol,
      quality: ketuNakshatra.quality,
      pada: ketuPada,
      degreeInNakshatra: ketuLong % ketuNakshatraSpan,
      formatted: `${ketuNakshatra.name} Pada ${ketuPada}`
    },
    english: 'Ketu (South Node)'
  };

  return grahas;
}

/**
 * Calculate approximate ascendant (simplified)
 */
function calculateApproximateLagna(jd, latitude, longitude, ayanamshaValue) {
  // Simplified ascendant calculation
  // Real calculation requires complex spherical trigonometry
  const d = jd - 2451545.0;
  const LST = (100.46 + 0.985647 * d + longitude + 15 * ((jd % 1) * 24)) % 360;

  // Simplified - use LST as approximate tropical ascendant
  let lagnaLong = (LST - ayanamshaValue + 360) % 360;

  const rashiIndex = Math.floor(lagnaLong / 30) % 12;
  const rashi = RASHIS[rashiIndex];

  // Nakshatra
  const nakshatraSpan = 360 / 27;
  const nakshatraIndex = Math.floor(lagnaLong / nakshatraSpan) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const pada = Math.floor((lagnaLong % nakshatraSpan) / (nakshatraSpan / 4)) + 1;

  return {
    longitude: lagnaLong,
    rashi: {
      index: rashiIndex,
      sanskrit: rashi.sanskrit,
      english: rashi.english,
      lord: rashi.lord,
      element: rashi.element,
      symbol: rashi.symbol,
      degree: lagnaLong % 30,
      formatted: `${(lagnaLong % 30).toFixed(2)}° ${rashi.sanskrit}`
    },
    nakshatra: {
      index: nakshatraIndex,
      name: nakshatra.name,
      lord: nakshatra.lord,
      deity: nakshatra.deity,
      symbol: nakshatra.symbol,
      quality: nakshatra.quality,
      pada: pada,
      degreeInNakshatra: lagnaLong % nakshatraSpan,
      formatted: `${nakshatra.name} Pada ${pada}`
    }
  };
}

/**
 * Client-side Vedic chart calculation (fallback)
 * Note: This is approximate - for precision, deploy the Python backend
 */
function calculateVedicChartClientSide(birthData) {
  const [year, month, day] = birthData.birthDate.split('-').map(Number);
  const [hour, minute] = (birthData.birthTime || '12:00').split(':').map(Number);

  const jd = calculateJulianDay(year, month, day, hour, minute);

  // Use approximate ayanamsha (would need proper calculation for accuracy)
  const yearsSince2024 = year - 2024;
  const ayanamshaValue = LAHIRI_AYANAMSHA_2024 + (yearsSince2024 * 0.014); // ~50 arcsec/year

  const grahas = calculateApproximatePlanets(jd, ayanamshaValue);
  const lagna = calculateApproximateLagna(jd, birthData.latitude, birthData.longitude, ayanamshaValue);

  // Build bhavas (whole sign houses)
  const lagnaSignIndex = Math.floor(lagna.longitude / 30);
  const bhavas = {
    lagna: lagna,
    midheaven: { longitude: (lagna.longitude + 270) % 360 },
    cusps: {}
  };

  for (let i = 1; i <= 12; i++) {
    const houseSignIndex = (lagnaSignIndex + i - 1) % 12;
    const houseLong = houseSignIndex * 30;
    const rashi = RASHIS[houseSignIndex];
    bhavas.cusps[`bhava_${i}`] = {
      longitude: houseLong,
      rashi: {
        index: houseSignIndex,
        sanskrit: rashi.sanskrit,
        english: rashi.english,
        lord: rashi.lord,
        element: rashi.element,
        symbol: rashi.symbol,
        degree: 0,
        formatted: `0.00° ${rashi.sanskrit}`
      },
      number: i
    };
  }

  const chart = {
    zodiacSystem: 'sidereal',
    ayanamsha: birthData.ayanamsha || 'lahiri',
    ayanamshaName: AYANAMSHAS[birthData.ayanamsha || 'lahiri']?.name || 'Lahiri (Chitrapaksha)',
    ayanamshaValue: ayanamshaValue,
    birthData: {
      date: birthData.birthDate,
      time: birthData.birthTime,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone || 'UTC',
      julianDay: jd
    },
    grahas,
    bhavas,
    lagna,
    moonNakshatra: grahas.chandra?.nakshatra,
    calculationMethod: 'Client-Side Approximation',
    houseSystem: 'whole_sign',
    _isApproximate: true
  };

  // Add client-side interpretations
  chart.interpretations = buildClientInterpretations(chart);

  return chart;
}

/**
 * Calculate a complete Vedic (Jyotish) natal chart
 *
 * @param {Object} birthData - Birth data
 * @param {string} birthData.birthDate - Birth date (YYYY-MM-DD)
 * @param {string} birthData.birthTime - Birth time (HH:MM)
 * @param {number} birthData.latitude - Latitude
 * @param {number} birthData.longitude - Longitude
 * @param {string} birthData.timezone - Timezone (e.g., "Asia/Kolkata")
 * @param {string} [birthData.ayanamsha='lahiri'] - Ayanamsha system
 * @param {string} [birthData.houseSystem='whole_sign'] - House system
 * @returns {Promise<Object>} Vedic chart data
 */
export async function calculateVedicChart(birthData) {
  try {
    // Try Firebase callable function first
    const calculateVedic = httpsCallable(functions, 'calculate_vedic_chart');

    const result = await calculateVedic({
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone || 'UTC',
      ayanamsha: birthData.ayanamsha || 'lahiri',
      houseSystem: birthData.houseSystem || 'whole_sign'
    });

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.warn('Firebase callable failed, trying HTTP...', error.message);

    // Fallback to direct HTTP call
    try {
      const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL;
      if (functionsUrl) {
        const response = await fetch(
          `${functionsUrl}/calculate_vedic_chart`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              birthDate: birthData.birthDate,
              birthTime: birthData.birthTime,
              latitude: birthData.latitude,
              longitude: birthData.longitude,
              timezone: birthData.timezone || 'UTC',
              ayanamsha: birthData.ayanamsha || 'lahiri',
              houseSystem: birthData.houseSystem || 'whole_sign'
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        }
      }
      throw new Error('HTTP fallback failed');
    } catch (httpError) {
      console.warn('HTTP fallback failed, using client-side calculation...', httpError.message);

      // Final fallback: client-side approximation
      try {
        const clientData = calculateVedicChartClientSide(birthData);
        return {
          success: true,
          data: clientData,
          isApproximate: true
        };
      } catch (clientError) {
        return {
          success: false,
          error: 'All calculation methods failed: ' + clientError.message
        };
      }
    }
  }
}

/**
 * Format graha position for display
 * @param {Object} graha - Graha data from API
 * @returns {string} Formatted position string
 */
export function formatGrahaPosition(graha) {
  if (!graha || !graha.rashi) return 'Unknown';

  const degree = graha.rashi.degree?.toFixed(2) || '0.00';
  const rashi = graha.rashi.sanskrit || graha.rashi.english;

  return `${degree}° ${rashi}`;
}

/**
 * Format nakshatra for display
 * @param {Object} nakshatra - Nakshatra data from API
 * @returns {string} Formatted nakshatra string
 */
export function formatNakshatra(nakshatra) {
  if (!nakshatra) return 'Unknown';

  return `${nakshatra.name} Pada ${nakshatra.pada}`;
}

/**
 * Get graha nature (benefic/malefic/neutral)
 * @param {string} grahaKey - Graha key (e.g., 'surya', 'chandra')
 * @returns {string} Nature of the graha
 */
export function getGrahaNature(grahaKey) {
  const natures = {
    surya: 'Malefic',
    chandra: 'Benefic',
    mangala: 'Malefic',
    budha: 'Neutral',
    guru: 'Benefic',
    shukra: 'Benefic',
    shani: 'Malefic',
    rahu: 'Malefic',
    ketu: 'Malefic'
  };

  return natures[grahaKey] || 'Unknown';
}

/**
 * Calculate which bhava (house) a graha occupies
 * @param {number} grahaLongitude - Graha's sidereal longitude
 * @param {Object} bhavas - Bhavas data from API
 * @returns {number} Bhava number (1-12)
 */
export function calculateGrahaBhava(grahaLongitude, bhavas) {
  if (!bhavas || !bhavas.cusps) return 1;

  // For whole sign houses, it's simple
  const lagnaLongitude = bhavas.lagna?.longitude || 0;
  const lagnaSign = Math.floor(lagnaLongitude / 30);
  const grahaSign = Math.floor(grahaLongitude / 30);

  // Calculate house number (1-based)
  let bhava = ((grahaSign - lagnaSign + 12) % 12) + 1;

  return bhava;
}
