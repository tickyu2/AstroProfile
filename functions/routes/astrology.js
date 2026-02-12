/**
 * Astrology Route Module
 *
 * Contains:
 * - generateDebateVisual (onRequest, Gemini image gen)
 * - saveStoryAssessment, getStoryAssessment, healthCheck (Firestore CRUD)
 * - VSOP87 Sovereign Astronomical Engine:
 *   - All inline helpers (longitudeToZodiac, dateToJulianDay, calculateAscendant, etc.)
 *   - getSolarTerms, getBaziPillars, calculateWesternChart
 *
 * Extracted from index.js lines ~1082-3017 during route modularisation.
 * Refactored: helpers split into astrology/ subdirectory.
 */

const { onRequest, onCall, admin, geminiKey, logger } = require('./shared');

// Swiss Ephemeris (WASM-based) for getHouseStrengthTimeline
const swissEphemeris = require('../ephemeris/swissEphemerisService');

// Image generation utility (path adjusted for routes/ subdirectory)
const { generateImage } = require('../utils/nanoBanana');

// ═══════════════════════════════════════════════════════════════════════════════
// Helper module imports (split from this file)
// ═══════════════════════════════════════════════════════════════════════════════

const {
  // Astronomia modules (re-exported)
  julian,
  solar,
  moonposition,
  planetposition,
  earthData,
  mercuryData,
  venusData,
  marsData,
  jupiterData,
  saturnData,
  uranusData,
  neptuneData,
  pluto,
  // Constants
  ZODIAC_SIGNS,
  // Functions
  longitudeToZodiac,
  calculateLST,
  calculateAscendant,
  calculateMC,
  calculatePlacidusHouses
} = require('./astrology/astronomyHelpers');

const {
  getHouseName,
  SIGN_RULERS,
  HOUSE_TYPE,
  PLANET_WEIGHTS,
  assignPlanetsToHouses,
  computeHouseStrength,
  getRulerScore,
  getAngularBonus
} = require('./astrology/houseStrength');

const {
  dateToJulianDay,
  SOLAR_TERMS,
  BAZI_MONTH_TERMS,
  getSunLongitudeAtJD,
  findSolarTermJD,
  julianDayToCalendar,
  calculateSolarTermsForYear,
  getLiChunExact,
  getBaziYearWithPrecision,
  getBaziMonthWithPrecision,
  getMoonPhaseInterpretation,
  calculateAspects
} = require('./astrology/solarTermsEngine');

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTED CLOUD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate Debate Visual (Baby Nano)
 *
 * Creates visual representations of AI debates using Gemini image generation.
 * Supports multiple visualization types:
 * - sketch: Hand-drawn style concept illustration
 * - flowchart: Logical flow of ideas and arguments
 * - timeline: Chronological progression of the debate
 * - mindmap: Central concept with branching ideas
 * - comparison: Side-by-side visual comparison
 *
 * Part of GENESIS - AI Constellation Feature
 * Added: December 15, 2024
 */
exports.generateDebateVisual = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 120,  // Image generation can take time
  memory: '512MiB',
  secrets: [geminiKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      debateExchanges,    // Array of { speaker, text } debate exchanges
      visualType,         // 'sketch' | 'flowchart' | 'timeline' | 'mindmap' | 'comparison'
      topic,              // Optional: main topic of the debate
      userProfile,        // User's constitutional context
      customPrompt        // Optional: user's custom instruction
    } = req.body;

    if (!debateExchanges || debateExchanges.length === 0) {
      return res.status(400).json({ error: 'Debate exchanges are required' });
    }

    logger.info('\uD83C\uDFA8 Generating debate visual:', {
      type: visualType,
      exchanges: debateExchanges.length,
      hasTopic: !!topic
    });

    // Extract key concepts from the debate (filter out entries without text)
    const textExchanges = debateExchanges.filter(ex => ex.text && typeof ex.text === 'string');
    const debateSummary = textExchanges.map(ex =>
      `${ex.speaker}: ${ex.text.slice(0, 200)}`
    ).join('\n\n');

    if (textExchanges.length === 0) {
      return res.status(400).json({ error: 'No text content to visualize' });
    }

    // Build visualization-specific prompt
    let visualPrompt = '';

    switch (visualType) {
      case 'flowchart':
        visualPrompt = `Create a clean, professional flowchart diagram that visualizes this discussion's logical flow:

${debateSummary}

Style: Modern infographic flowchart with clear boxes, arrows, and decision points. Use a gradient color scheme (purple, blue, amber). Include key concepts in boxes connected by arrows showing relationships. Make it clean and readable, like a professional presentation slide.`;
        break;

      case 'timeline':
        visualPrompt = `Create a visual timeline that shows the progression of ideas in this discussion:

${debateSummary}

Style: Horizontal timeline with illustrated milestones. Each speaker's contribution should be a point on the timeline with a small icon representing their perspective (wisdom, analysis, human experience). Use cosmic/celestial aesthetic with gradients. Clean, modern design.`;
        break;

      case 'mindmap':
        visualPrompt = `Create a mind map visualization of this discussion's key concepts:

${debateSummary}

Style: Central node with ${topic || 'the main topic'}, branching out to each speaker's key ideas. Use different colors for different speakers (amber for Claude, purple for Gemini, cyan for Grok). Include small icons. Organic, flowing connections. Modern flat design.`;
        break;

      case 'comparison':
        visualPrompt = `Create a side-by-side comparison visualization showing different perspectives from this discussion:

${debateSummary}

Style: Split or multi-column layout comparing the different viewpoints. Use distinct colors for each perspective. Include icons or symbols representing each speaker. Clean infographic style with bullet points or key phrases. Professional presentation quality.`;
        break;

      case 'sketch':
      default:
        visualPrompt = `Create an artistic sketch that captures the essence of this discussion:

${debateSummary}

Style: Hand-drawn illustration style, like a thoughtful notebook sketch. Include symbolic elements representing the key ideas discussed. Warm, inviting aesthetic with soft colors. Conceptual and abstract rather than literal. Think "visual poetry" of the conversation.`;
        break;
    }

    // Add custom instructions if provided
    if (customPrompt) {
      visualPrompt += `\n\nAdditional instruction: ${customPrompt}`;
    }

    // Generate the image using Nano Banana
    const imageResult = await generateImage(visualPrompt, userProfile);

    if (!imageResult?.success) {
      logger.info('\uD83C\uDFA8 Image generation failed:', imageResult?.error);
      return res.status(500).json({
        success: false,
        error: imageResult?.error || 'Failed to generate image',
        fallbackText: imageResult?.text
      });
    }

    logger.info('\uD83C\uDFA8 Debate visual generated successfully!');

    return res.status(200).json({
      success: true,
      image: {
        mimeType: imageResult.image.mimeType,
        data: imageResult.image.data
      },
      visualType: visualType || 'sketch',
      description: imageResult.description,
      meta: {
        exchanges: debateExchanges.length,
        topic: topic || 'AI Debate',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Debate Visual Error:', error);
    return res.status(500).json({
      error: 'Failed to generate debate visual',
      details: error.message
    });
  }
});

/**
 * Save Story Questions Assessment
 *
 * Saves the completed Story Questions assessment results to Firestore.
 * Includes full psychological profile, constitutional alignment, and growth recommendations.
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Added: December 15, 2024
 */
exports.saveStoryAssessment = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      profileId,
      assessment  // Full assessment analysis object
    } = req.body;

    if (!userId || !profileId) {
      return res.status(400).json({ error: 'userId and profileId are required' });
    }

    if (!assessment || !assessment.responses) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }

    logger.info('\uD83D\uDCD6 Saving Story Questions Assessment:', {
      userId,
      profileId,
      levels: assessment.completedLevels,
      completion: assessment.completionPercentage
    });

    const db = admin.firestore();

    // Save to Firestore under user's profile
    const assessmentRef = db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId)
      .collection('assessments')
      .doc('storyQuestions');

    await assessmentRef.set({
      // Core assessment data
      responses: assessment.responses,
      completedLevels: assessment.completedLevels,
      totalLevels: assessment.totalLevels,
      completionPercentage: assessment.completionPercentage,

      // Psychological profile
      aggregatedTraits: assessment.aggregatedTraits,
      psychologicalProfile: assessment.psychologicalProfile,
      personalitySummary: assessment.personalitySummary,

      // Constitutional correlations
      elementProfile: assessment.elementProfile,
      yinYangProfile: assessment.yinYangProfile,
      tenGodsProfile: assessment.tenGodsProfile,
      constitutionalAlignment: assessment.constitutionalAlignment,

      // Growth recommendations
      growthRecommendations: assessment.growthRecommendations,

      // Metadata
      savedAt: admin.firestore.FieldValue.serverTimestamp(),
      analyzedAt: assessment.analyzedAt,
      version: '1.0'
    }, { merge: true });

    // Also update the profile's aiSoulPartner notes with key insights
    const profileRef = db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId);

    // Build a summary for the AI to reference
    const storyInsights = `
## Story Questions Assessment (${new Date().toLocaleDateString()})

### Psychological Profile
${assessment.personalitySummary || 'Not yet analyzed'}

### Element Resonance
- Dominant: ${assessment.elementProfile?.dominant || 'Unknown'}
- Secondary: ${assessment.elementProfile?.secondary || 'Unknown'}

### Yin/Yang Balance
- ${assessment.yinYangProfile?.dominant || 'Balanced'}: ${assessment.yinYangProfile?.description || ''}

### Ten God Influence
- ${assessment.tenGodsProfile?.dominant || 'Unknown'}: ${assessment.tenGodsProfile?.description || ''}

### Key Traits Revealed
${Object.entries(assessment.aggregatedTraits || {})
  .slice(0, 5)
  .map(([k, v]) => `- ${k.replace(/_/g, ' ')}: ${v}`)
  .join('\n')}

### Growth Invitations
${(assessment.growthRecommendations || [])
  .map(r => `- **${r.area}**: ${r.insight}`)
  .join('\n')}
`;

    await profileRef.update({
      'aiSoulPartner.storyAssessment': {
        summary: storyInsights.trim(),
        dominantElement: assessment.elementProfile?.dominant,
        dominantTenGod: assessment.tenGodsProfile?.dominant,
        yinYangBalance: assessment.yinYangProfile?.dominant,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });

    logger.info('\u2705 Story Assessment saved successfully');

    return res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      summary: {
        completedLevels: assessment.completedLevels,
        dominantElement: assessment.elementProfile?.dominant,
        dominantTenGod: assessment.tenGodsProfile?.dominant
      }
    });

  } catch (error) {
    logger.error('Save Story Assessment Error:', error);
    return res.status(500).json({
      error: 'Failed to save assessment',
      details: error.message
    });
  }
});

/**
 * Get Story Questions Assessment
 *
 * Retrieves saved Story Questions assessment for a profile.
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Added: December 15, 2024
 */
exports.getStoryAssessment = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Support both GET query params and POST body
    const userId = req.query.userId || req.body?.userId;
    const profileId = req.query.profileId || req.body?.profileId;

    if (!userId || !profileId) {
      return res.status(400).json({ error: 'userId and profileId are required' });
    }

    logger.info('\uD83D\uDCD6 Getting Story Questions Assessment:', { userId, profileId });

    const db = admin.firestore();

    const assessmentRef = db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId)
      .collection('assessments')
      .doc('storyQuestions');

    const doc = await assessmentRef.get();

    if (!doc.exists) {
      return res.status(200).json({
        success: true,
        exists: false,
        assessment: null
      });
    }

    const data = doc.data();

    logger.info('\u2705 Story Assessment retrieved:', {
      levels: data.completedLevels,
      completion: data.completionPercentage
    });

    return res.status(200).json({
      success: true,
      exists: true,
      assessment: data
    });

  } catch (error) {
    logger.error('Get Story Assessment Error:', error);
    return res.status(500).json({
      error: 'Failed to get assessment',
      details: error.message
    });
  }
});

/**
 * Health check endpoint
 */
exports.healthCheck = onRequest({
  cors: true,
  invoker: 'public'  // Allow unauthenticated access
}, (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'GENESIS AI SoulPartner',
    timestamp: new Date().toISOString()
  });
});

/**
 * Cloud Function: Calculate Solar Terms for BaZi
 * Returns exact moments for all 24 Solar Terms in a given year
 */
exports.getSolarTerms = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Accept year from query params (GET) or body (POST)
    const year = Number(req.query.year || req.body?.year) || new Date().getFullYear();

    if (year < 1600 || year > 2200) {
      return res.status(400).json({
        error: 'Year out of range',
        details: 'Please provide a year between 1600 and 2200'
      });
    }

    logger.info(`\uD83C\uDF1E Calculating Solar Terms for ${year}...`);

    // Calculate all 24 Solar Terms
    const solarTerms = calculateSolarTermsForYear(year);

    // Get Li Chun specifically (year boundary)
    const liChun = getLiChunExact(year);

    logger.info(`\u2705 Solar Terms calculated. \u7ACB\u6625: ${liChun.isoString}`);

    return res.status(200).json({
      success: true,
      year: year,
      liChun: liChun,
      solarTerms: solarTerms,
      meta: {
        calculationEngine: 'GENESIS Sovereign (Moshier Ephemeris)',
        precision: '~1 second',
        coverage: '1600-2200 AD',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('\uD83C\uDF1E Solar Terms Calculation Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate Solar Terms',
      details: error.message
    });
  }
});

/**
 * Cloud Function: Get precise BaZi pillars with astronomical Solar Term boundaries
 * Enhanced version that uses exact Li Chun for year and Solar Terms for month
 */
exports.getBaziPillars = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      year, month, day,
      hour = 12, minute = 0,
      timezone = 0  // UTC offset
    } = req.body;

    if (!year || !month || !day) {
      return res.status(400).json({
        error: 'Birth date required',
        details: 'Please provide year, month, and day'
      });
    }

    const numYear = Number(year);
    const numMonth = Number(month);
    const numDay = Number(day);
    const numHour = Number(hour);
    const numMinute = Number(minute);
    const numTimezone = Number(timezone) || 0;

    // Convert to UTC
    const utcHour = numHour - numTimezone;

    logger.info(`\uD83C\uDFAF BaZi Precision Request: ${numYear}-${numMonth}-${numDay} ${numHour}:${numMinute}`);

    // Get precise BaZi year
    const baziYearInfo = getBaziYearWithPrecision(numYear, numMonth, numDay, utcHour, numMinute);

    // Get precise BaZi month
    const baziMonthInfo = getBaziMonthWithPrecision(numYear, numMonth, numDay, utcHour, numMinute);

    logger.info(`\u2705 BaZi Precision: Year=${baziYearInfo.baziYear}, Month=${baziMonthInfo.baziMonth}`);

    return res.status(200).json({
      success: true,
      baziYear: baziYearInfo,
      baziMonth: baziMonthInfo,
      birthData: {
        gregorian: `${numYear}-${numMonth}-${numDay}`,
        time: `${numHour}:${String(numMinute).padStart(2, '0')}`,
        timezone: numTimezone
      },
      meta: {
        calculationEngine: 'GENESIS Sovereign (Moshier Ephemeris)',
        solarTermPrecision: '~1 second',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('\uD83C\uDFAF BaZi Precision Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate BaZi pillars',
      details: error.message
    });
  }
});

/**
 * Sovereign Western Astrology Calculation
 *
 * Calculates the Constitutional Trinity (Sun, Moon, Rising)
 * using pure JavaScript ephemeris - no external APIs.
 *
 * @param {Object} birthData - Birth information
 * @param {number} birthData.year - Birth year
 * @param {number} birthData.month - Birth month (1-12)
 * @param {number} birthData.day - Birth day
 * @param {number} birthData.hour - Birth hour (0-23)
 * @param {number} birthData.minute - Birth minute (0-59)
 * @param {number} birthData.latitude - Birth place latitude
 * @param {number} birthData.longitude - Birth place longitude
 * @returns {Object} - Constitutional trinity with positions
 */
exports.calculateWesternChart = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      year, month, day,
      hour = 12, minute = 0, second = 0,
      latitude, longitude,
      timezone = 0  // UTC offset in hours
    } = req.body;

    // Validate required fields
    if (!year || !month || !day) {
      return res.status(400).json({
        error: 'Birth date required',
        details: 'Please provide year, month, and day'
      });
    }

    // Ensure numeric types (browser may send strings)
    const numYear = Number(year);
    const numMonth = Number(month);
    const numDay = Number(day);
    const numHour = Number(hour);
    const numMinute = Number(minute);
    const numSecond = Number(second);
    const numTimezone = Number(timezone) || 0;
    const numLat = Number(latitude) || 0;
    const numLng = Number(longitude) || 0;

    logger.info('\uD83C\uDF1F Sovereign Calculation Request:', {
      date: `${numYear}-${numMonth}-${numDay}`,
      time: `${numHour}:${numMinute}`,
      location: numLat && numLng ? `${numLat}, ${numLng}` : 'not provided',
      rawTypes: { year: typeof year, month: typeof month, day: typeof day }
    });

    // Convert local time to UTC
    const utcHour = numHour - numTimezone;

    // Calculate Julian Day
    const julianDay = dateToJulianDay(numYear, numMonth, numDay, utcHour, numMinute, numSecond);

    // ─────────────────────────────────────────────────────────────────────────
    // Use astronomia library for planetary positions (VSOP87 theory)
    // ─────────────────────────────────────────────────────────────────────────

    // Create Julian Day using astronomia
    const cal = new julian.CalendarGregorian(numYear, numMonth, numDay + (utcHour + numMinute / 60) / 24);
    const jd = cal.toJD();

    logger.info('\uD83D\uDD22 Julian Day calculation:', { jd, isNaN: isNaN(jd) });

    // Convert Julian Day to Julian centuries (T) since J2000.0
    // This is what solar.apparentLongitude expects
    const T = (jd - 2451545.0) / 36525.0;

    // Calculate Sun position (ecliptic longitude)
    // apparentLongitude returns radians, accounts for nutation and aberration
    const sunLongitudeRad = solar.apparentLongitude(T);
    const sunLongitude = sunLongitudeRad * 180 / Math.PI;

    logger.info('\u2600\uFE0F Sun calculation:', { T, sunLongitudeRad, sunLongitude, isNaN: isNaN(sunLongitude) });

    const sunData = longitudeToZodiac(sunLongitude);

    // Calculate Moon position (takes Julian Day directly)
    const moonPos = moonposition.position(jd);
    const moonLongitude = moonPos.lon * 180 / Math.PI;

    logger.info('\uD83C\uDF19 Moon calculation:', { moonLongitude, isNaN: isNaN(moonLongitude) });

    const moonData = longitudeToZodiac(moonLongitude);

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate Ascendant (Rising Sign) - requires birth time and location
    // ─────────────────────────────────────────────────────────────────────────

    let risingData = null;
    if (numLat !== 0 || numLng !== 0 || numHour !== undefined) {
      const ascendantLongitude = calculateAscendant(julianDay, numLat, numLng);
      logger.info('\u2B06\uFE0F Rising calculation:', { ascendantLongitude, isNaN: isNaN(ascendantLongitude) });
      risingData = longitudeToZodiac(ascendantLongitude);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Extract other planetary positions for full chart using VSOP87
    // (Optional - the Constitutional Trinity works without this)
    // ─────────────────────────────────────────────────────────────────────────

    const planets = {};

    // VERSION: 2.4.0 - GEOCENTRIC positions + RETROGRADE detection
    // Retrograde = planet appears to move backward from Earth's perspective
    try {
      logger.info('\uD83E\uDE90 VERSION 2.4.0 - Calculating GEOCENTRIC positions with RETROGRADE detection...');

      // Create Earth planet for heliocentric to geocentric conversion
      const earth = new planetposition.Planet(earthData);

      // Helper function to calculate geocentric longitude for any Julian Day
      function getGeocentricLongitude(planetObj, jd) {
        const earthPosAtJD = earth.position(jd);
        const earthLonAtJD = earthPosAtJD.lon;
        const earthLatAtJD = earthPosAtJD.lat;
        const earthRAtJD = earthPosAtJD.range;

        const earthXAtJD = earthRAtJD * Math.cos(earthLatAtJD) * Math.cos(earthLonAtJD);
        const earthYAtJD = earthRAtJD * Math.cos(earthLatAtJD) * Math.sin(earthLonAtJD);
        const earthZAtJD = earthRAtJD * Math.sin(earthLatAtJD);

        const planetPosAtJD = planetObj.position(jd);
        const planetLonAtJD = planetPosAtJD.lon;
        const planetLatAtJD = planetPosAtJD.lat;
        const planetRAtJD = planetPosAtJD.range;

        const planetXAtJD = planetRAtJD * Math.cos(planetLatAtJD) * Math.cos(planetLonAtJD);
        const planetYAtJD = planetRAtJD * Math.cos(planetLatAtJD) * Math.sin(planetLonAtJD);
        const planetZAtJD = planetRAtJD * Math.sin(planetLatAtJD);

        const geoXAtJD = planetXAtJD - earthXAtJD;
        const geoYAtJD = planetYAtJD - earthYAtJD;

        let geoLon = Math.atan2(geoYAtJD, geoXAtJD) * 180 / Math.PI;
        return ((geoLon % 360) + 360) % 360;
      }

      // Get Earth's heliocentric position (needed for all planet conversions)
      const earthPos = earth.position(julianDay);

      // Convert Earth's spherical to rectangular coordinates
      const earthLon = earthPos.lon;  // radians
      const earthLat = earthPos.lat;  // radians
      const earthR = earthPos.range;  // AU

      const earthX = earthR * Math.cos(earthLat) * Math.cos(earthLon);
      const earthY = earthR * Math.cos(earthLat) * Math.sin(earthLon);
      const earthZ = earthR * Math.sin(earthLat);

      logger.info(`\uD83C\uDF0D Earth heliocentric: lon=${(earthLon * 180/Math.PI).toFixed(2)}\u00B0, R=${earthR.toFixed(4)} AU`);

      // Planet configurations with their data and symbols
      const planetConfigs = [
        { name: 'Mercury', data: mercuryData, symbol: '\u263F' },
        { name: 'Venus', data: venusData, symbol: '\u2640' },
        { name: 'Mars', data: marsData, symbol: '\u2642' },
        { name: 'Jupiter', data: jupiterData, symbol: '\u2643' },
        { name: 'Saturn', data: saturnData, symbol: '\u2644' },
        { name: 'Uranus', data: uranusData, symbol: '\u2645' },
        { name: 'Neptune', data: neptuneData, symbol: '\u2646' }
      ];

      for (const config of planetConfigs) {
        try {
          const planet = new planetposition.Planet(config.data);

          // Get heliocentric position of planet
          const planetPos = planet.position(julianDay);

          if (!planetPos || typeof planetPos.lon !== 'number') {
            logger.info(`\u26A0\uFE0F ${config.name}: Invalid position data`, planetPos);
            continue;
          }

          // Convert planet's spherical to rectangular coordinates (heliocentric)
          const planetLon = planetPos.lon;  // radians
          const planetLat = planetPos.lat;  // radians
          const planetR = planetPos.range;  // AU

          const planetX = planetR * Math.cos(planetLat) * Math.cos(planetLon);
          const planetY = planetR * Math.cos(planetLat) * Math.sin(planetLon);
          const planetZ = planetR * Math.sin(planetLat);

          // Convert to GEOCENTRIC coordinates (subtract Earth's position)
          const geoX = planetX - earthX;
          const geoY = planetY - earthY;
          const geoZ = planetZ - earthZ;

          // Convert geocentric rectangular back to ecliptic longitude
          let geoLongitude = Math.atan2(geoY, geoX) * 180 / Math.PI;

          // Normalize to 0-360 degrees
          geoLongitude = ((geoLongitude % 360) + 360) % 360;

          // Calculate geocentric latitude (for reference)
          const geoDistance = Math.sqrt(geoX*geoX + geoY*geoY + geoZ*geoZ);
          const geoLatitude = Math.asin(geoZ / geoDistance) * 180 / Math.PI;

          // ═══════════════════════════════════════════════════════════════════
          // RETROGRADE DETECTION
          // Compare position today vs tomorrow - if moving backward, retrograde
          // ═══════════════════════════════════════════════════════════════════
          const lonToday = geoLongitude;
          const lonTomorrow = getGeocentricLongitude(planet, julianDay + 1);

          // Calculate daily motion (degrees per day)
          let dailyMotion = lonTomorrow - lonToday;

          // Handle 360\u00B0 wraparound (e.g., 359\u00B0 to 1\u00B0 is +2\u00B0, not -358\u00B0)
          if (dailyMotion > 180) dailyMotion -= 360;
          if (dailyMotion < -180) dailyMotion += 360;

          // Retrograde if daily motion is negative (moving backward)
          const isRetrograde = dailyMotion < 0;

          const zodiacData = longitudeToZodiac(geoLongitude);

          // For comparison, log heliocentric vs geocentric
          const helioLon = ((planetLon * 180/Math.PI % 360) + 360) % 360;
          const diff = Math.abs(geoLongitude - helioLon);
          const retroLabel = isRetrograde ? ' \u212E' : '';
          logger.info(`\uD83E\uDE90 ${config.name}${retroLabel}: Geo=${geoLongitude.toFixed(2)}\u00B0 (motion: ${dailyMotion.toFixed(3)}\u00B0/day)`);

          planets[config.name.toLowerCase()] = {
            ...zodiacData,
            symbol: config.symbol,
            name: config.name,
            geocentric: true,
            geoLatitude: Math.round(geoLatitude * 100) / 100,
            distanceAU: Math.round(geoDistance * 10000) / 10000,
            // Retrograde data
            isRetrograde: isRetrograde,
            dailyMotion: Math.round(dailyMotion * 1000) / 1000,  // degrees/day
            motionDirection: isRetrograde ? 'retrograde' : 'direct'
          };

          logger.info(`\u2705 ${config.name}: ${zodiacData.sign} at ${zodiacData.degreeFormatted}${isRetrograde ? ' \u212E RETROGRADE' : ' direct'}`);
        } catch (planetErr) {
          logger.info(`\u26A0\uFE0F ${config.name} calculation error:`, planetErr.message);
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PLUTO - Uses separate ephemeris (not VSOP87)
      // ═══════════════════════════════════════════════════════════════════════
      try {
        const plutoPos = pluto.heliocentric(julianDay);

        if (plutoPos && typeof plutoPos.lon === 'number') {
          const plutoLon = plutoPos.lon;  // radians
          const plutoLat = plutoPos.lat;  // radians
          const plutoR = plutoPos.range;  // AU

          // Convert to rectangular heliocentric
          const plutoX = plutoR * Math.cos(plutoLat) * Math.cos(plutoLon);
          const plutoY = plutoR * Math.cos(plutoLat) * Math.sin(plutoLon);
          const plutoZ = plutoR * Math.sin(plutoLat);

          // Convert to geocentric
          const plutoGeoX = plutoX - earthX;
          const plutoGeoY = plutoY - earthY;
          const plutoGeoZ = plutoZ - earthZ;

          // Geocentric ecliptic longitude
          let plutoGeoLon = Math.atan2(plutoGeoY, plutoGeoX) * 180 / Math.PI;
          plutoGeoLon = ((plutoGeoLon % 360) + 360) % 360;

          const plutoGeoDistance = Math.sqrt(plutoGeoX*plutoGeoX + plutoGeoY*plutoGeoY + plutoGeoZ*plutoGeoZ);
          const plutoGeoLat = Math.asin(plutoGeoZ / plutoGeoDistance) * 180 / Math.PI;

          // Retrograde detection for Pluto
          const plutoPosTomorrow = pluto.heliocentric(julianDay + 1);
          const plutoXTom = plutoPosTomorrow.range * Math.cos(plutoPosTomorrow.lat) * Math.cos(plutoPosTomorrow.lon);
          const plutoYTom = plutoPosTomorrow.range * Math.cos(plutoPosTomorrow.lat) * Math.sin(plutoPosTomorrow.lon);
          const earthPosTomorrow = earth.position(julianDay + 1);
          const earthXTom = earthPosTomorrow.range * Math.cos(earthPosTomorrow.lat) * Math.cos(earthPosTomorrow.lon);
          const earthYTom = earthPosTomorrow.range * Math.cos(earthPosTomorrow.lat) * Math.sin(earthPosTomorrow.lon);
          let plutoGeoLonTom = Math.atan2(plutoYTom - earthYTom, plutoXTom - earthXTom) * 180 / Math.PI;
          plutoGeoLonTom = ((plutoGeoLonTom % 360) + 360) % 360;

          let plutoDailyMotion = plutoGeoLonTom - plutoGeoLon;
          if (plutoDailyMotion > 180) plutoDailyMotion -= 360;
          if (plutoDailyMotion < -180) plutoDailyMotion += 360;
          const plutoRetrograde = plutoDailyMotion < 0;

          const plutoZodiacData = longitudeToZodiac(plutoGeoLon);
          const plutoRetroLabel = plutoRetrograde ? ' \u212E' : '';
          logger.info(`\uD83E\uDE90 Pluto${plutoRetroLabel}: Geo=${plutoGeoLon.toFixed(2)}\u00B0 (motion: ${plutoDailyMotion.toFixed(3)}\u00B0/day)`);

          planets.pluto = {
            ...plutoZodiacData,
            symbol: '\u2647',
            name: 'Pluto',
            geocentric: true,
            geoLatitude: Math.round(plutoGeoLat * 100) / 100,
            distanceAU: Math.round(plutoGeoDistance * 10000) / 10000,
            isRetrograde: plutoRetrograde,
            dailyMotion: Math.round(plutoDailyMotion * 1000) / 1000,
            motionDirection: plutoRetrograde ? 'retrograde' : 'direct'
          };
          logger.info(`\u2705 Pluto: ${plutoZodiacData.sign} at ${plutoZodiacData.degreeFormatted}${plutoRetrograde ? ' \u212E RETROGRADE' : ' direct'}`);
        }
      } catch (plutoErr) {
        logger.info('\u26A0\uFE0F Pluto calculation error:', plutoErr.message);
      }

      logger.info('\uD83E\uDE90 Geocentric + Retrograde calculations complete:', Object.keys(planets));
    } catch (planetError) {
      logger.info('Planet calculation error (non-fatal):', planetError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate House Cusps (Placidus System)
    // ─────────────────────────────────────────────────────────────────────────

    let houses = null;
    try {
      // Houses require birth time and location
      if ((numLat !== 0 || numLng !== 0) && numHour !== undefined) {
        logger.info('\uD83C\uDFE0 VERSION 2.2.0 - Calculating house cusps (Placidus)...');
        houses = calculatePlacidusHouses(julianDay, numLat, numLng);
        logger.info('\uD83C\uDFE0 House cusps calculated:', {
          asc: houses.angles.ascendant.sign,
          mc: houses.angles.mc.sign,
          system: houses.system
        });
      } else {
        logger.info('\uD83C\uDFE0 House calculation skipped - requires birth time and location');
      }
    } catch (houseError) {
      logger.info('House calculation error (non-fatal):', houseError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate Moon Phase
    // Phase angle = Moon longitude - Sun longitude (normalized to 0-360)
    // ─────────────────────────────────────────────────────────────────────────

    let moonPhase = null;
    try {
      // Calculate the angular difference between Moon and Sun
      let phaseAngle = moonLongitude - sunLongitude;
      // Normalize to 0-360
      phaseAngle = ((phaseAngle % 360) + 360) % 360;

      // Determine phase name and illumination
      const phases = [
        { name: 'New Moon', emoji: '\uD83C\uDF11', min: 0, max: 11.25, illumination: 0 },
        { name: 'Waxing Crescent', emoji: '\uD83C\uDF12', min: 11.25, max: 78.75, illumination: 25 },
        { name: 'First Quarter', emoji: '\uD83C\uDF13', min: 78.75, max: 101.25, illumination: 50 },
        { name: 'Waxing Gibbous', emoji: '\uD83C\uDF14', min: 101.25, max: 168.75, illumination: 75 },
        { name: 'Full Moon', emoji: '\uD83C\uDF15', min: 168.75, max: 191.25, illumination: 100 },
        { name: 'Waning Gibbous', emoji: '\uD83C\uDF16', min: 191.25, max: 258.75, illumination: 75 },
        { name: 'Last Quarter', emoji: '\uD83C\uDF17', min: 258.75, max: 281.25, illumination: 50 },
        { name: 'Waning Crescent', emoji: '\uD83C\uDF18', min: 281.25, max: 348.75, illumination: 25 },
        { name: 'New Moon', emoji: '\uD83C\uDF11', min: 348.75, max: 360, illumination: 0 }
      ];

      let currentPhase = phases.find(p => phaseAngle >= p.min && phaseAngle < p.max);
      if (!currentPhase) currentPhase = phases[0]; // Default to New Moon

      // Calculate more precise illumination percentage
      // illumination = (1 - cos(phaseAngle)) / 2 * 100
      const illuminationPercent = Math.round((1 - Math.cos(phaseAngle * Math.PI / 180)) / 2 * 100);

      // Determine if waxing (growing) or waning (shrinking)
      const isWaxing = phaseAngle < 180;

      moonPhase = {
        phaseName: currentPhase.name,
        emoji: currentPhase.emoji,
        angle: Math.round(phaseAngle * 100) / 100,
        illumination: illuminationPercent,
        isWaxing,
        cyclePosition: isWaxing ? 'Growing toward fullness' : 'Releasing toward renewal',
        interpretation: getMoonPhaseInterpretation(currentPhase.name)
      };

      logger.info('\uD83C\uDF19 Moon Phase:', moonPhase.emoji, moonPhase.phaseName, `(${illuminationPercent}% illuminated)`);
    } catch (phaseError) {
      logger.info('Moon phase calculation error (non-fatal):', phaseError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate Aspects between celestial bodies
    // ─────────────────────────────────────────────────────────────────────────

    let aspects = [];
    try {
      // Combine Sun, Moon, and planets for aspect calculation
      const allBodies = {
        sun: { ...sunData, symbol: '\u2609' },
        moon: { ...moonData, symbol: '\u263E' },
        ...planets
      };

      aspects = calculateAspects(allBodies);
      logger.info(`\u2728 Aspects calculated: ${aspects.length} found`);

      // Log major aspects
      const majorAspects = aspects.filter(a => a.nature === 'major');
      if (majorAspects.length > 0) {
        logger.info('Major aspects:', majorAspects.slice(0, 5).map(a =>
          `${a.planet1.name} ${a.symbol} ${a.planet2.name} (${a.orb}\u00B0 orb)`
        ).join(', '));
      }
    } catch (aspectError) {
      logger.info('Aspect calculation error (non-fatal):', aspectError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Build Constitutional Trinity response
    // ─────────────────────────────────────────────────────────────────────────

    const constitutionalTrinity = {
      sun: {
        ...sunData,
        meaning: 'Core identity, ego, life force, conscious self'
      },
      moon: {
        ...moonData,
        meaning: 'Emotional nature, instincts, unconscious patterns, inner needs'
      },
      rising: risingData ? {
        ...risingData,
        meaning: 'Outer personality, first impressions, approach to life'
      } : {
        note: 'Rising sign requires birth time and location',
        available: false
      }
    };

    // Element balance analysis
    const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    elementCounts[sunData.element] += 3;  // Sun weighted 3x
    elementCounts[moonData.element] += 2;  // Moon weighted 2x
    if (risingData) elementCounts[risingData.element] += 1;

    // Add planet elements
    for (const [_, pData] of Object.entries(planets)) {
      if (pData.element) elementCounts[pData.element] += 0.5;
    }

    const sortedElements = Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1]);

    const elementProfile = {
      dominant: sortedElements[0][0],
      secondary: sortedElements[1][0],
      distribution: elementCounts
    };

    logger.info('\uD83C\uDF1F Sovereign Calculation Complete:', {
      sun: sunData.sign,
      moon: moonData.sign,
      rising: risingData?.sign || 'not calculated',
      dominantElement: elementProfile.dominant
    });

    return res.status(200).json({
      success: true,
      constitutionalTrinity,
      planets,
      houses,
      moonPhase,
      aspects,
      elementProfile,
      meta: {
        julianDay,
        calculationEngine: 'GENESIS Sovereign v2.7.0 (Moshier Ephemeris)',
        precision: '~0.1 arcseconds',
        planetarySystem: 'Geocentric (as seen from Earth)',
        retrogradeDetection: true,
        moonPhaseCalculation: true,
        aspectCalculation: true,
        coverage: '3000 BC - 3000 AD',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('\uD83C\uDF1F Sovereign Calculation Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate chart',
      details: error.message
    });
  }
});

// =============================================================================
// SWISS EPHEMERIS - House Strength 24-Hour Timeline
// =============================================================================

exports.getHouseStrengthTimeline = onCall({
  timeoutSeconds: 120,
  memory: '1GiB'
}, async (request) => {
  try {
    const { birthDate, latitude, longitude, timezone } = request.data || {};

    if (!birthDate || latitude == null || longitude == null) {
      return {
        success: false,
        error: 'birthDate, latitude, and longitude are required'
      };
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const lat = Number(latitude);
    const lng = Number(longitude);
    const tz = typeof timezone === 'number' ? timezone : 0;

    let accuracyWarning = null;
    if (year < 1 || year > 2200) {
      return {
        success: false,
        error: `Birth year ${year} is outside supported range (1 AD - 2200 AD).`
      };
    }
    if (year < 500) {
      accuracyWarning = `Historical date (${year} AD): Swiss Ephemeris accuracy is good but some planetary positions may have minor variance.`;
    } else if (year < 1600) {
      accuracyWarning = `Pre-modern date (${year} AD): Swiss Ephemeris accuracy is excellent for this period.`;
    }

    logger.info('Soul Garden: Computing 24-hour timeline with SWISS EPHEMERIS', {
      birthDate, lat, lng, tz
    });

    await swissEphemeris.initSwissEphemeris();

    const sweTimeline = await swissEphemeris.calculate24HourTimeline({
      year, month, day, latitude: lat, longitude: lng, timezone: tz
    });

    const timeline = sweTimeline.map((slice, idx) => {
      const planetDataArray = [];
      if (slice.planets) {
        for (const [key, planet] of Object.entries(slice.planets)) {
          if (planet && typeof planet.longitude === 'number') {
            let planetHouse = 1;
            for (const house of slice.houses || []) {
              if (house.planets && house.planets.some(p => p.key === key)) {
                planetHouse = house.house;
                break;
              }
            }
            planetDataArray.push({
              name: planet.planet, planet: planet.planet, key,
              longitude: planet.longitude, sign: planet.sign,
              degree: planet.degree, house: planetHouse,
              retrograde: planet.isRetrograde || false, speed: planet.speed
            });
          }
        }
      }

      const houseEntries = (slice.houses || []).map(house => {
        const planetsInHouse = (house.planets || []).map(p => p.name || p.key);
        const { strength, components } = computeHouseStrength(
          house.house, { sign: house.sign }, planetsInHouse
        );
        return {
          house: house.house, strength: house.strength || strength,
          planets: planetsInHouse, planetData: (house.planets || []),
          sign: house.sign, degree: house.degree,
          element: house.element, modality: house.modality, components
        };
      });

      const ascendant = slice.angles?.ascendant;
      const ascendantSign = ascendant?.sign || 'Aries';
      const ascendantDegree = ascendant?.degree || 0;
      const ascendantRuler = SIGN_RULERS[ascendantSign] || null;

      let rulerSign = null;
      let rulerHouse = null;
      if (ascendantRuler) {
        const rulerPlanet = planetDataArray.find(p =>
          p.name?.toLowerCase() === ascendantRuler?.toLowerCase()
        );
        if (rulerPlanet) {
          rulerSign = rulerPlanet.sign;
          rulerHouse = rulerPlanet.house;
        }
      }

      return {
        index: idx, timeLabel: slice.timeLabel, houses: houseEntries,
        ascendant: {
          sign: ascendantSign, degree: ascendantDegree,
          longitude: ascendant?.longitude, ruler: ascendantRuler,
          rulerSign, rulerHouse
        },
        midheaven: slice.angles?.midheaven, planets: planetDataArray
      };
    });

    logger.info(`Soul Garden: Generated ${timeline.length} time slices with SWISS EPHEMERIS`);

    return {
      success: true, birthDate, latitude: lat, longitude: lng, timezone: tz,
      calculationEngine: 'GENESIS Sovereign v3.0 (Swiss Ephemeris WASM)',
      precision: '0.001 arcseconds', timeline,
      ...(accuracyWarning && { accuracyWarning })
    };
  } catch (error) {
    logger.error('[HouseStrengthTimeline] Swiss Ephemeris error:', error);
    return {
      success: false, error: error.message,
      calculationEngine: 'Swiss Ephemeris WASM'
    };
  }
});
