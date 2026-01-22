/**
 * ============================================
 * SOULDNA ENCODER
 * Encodes BaZi constitutional data into shareable 8-character DNA code
 * Format: XXX-L##Z
 * ============================================
 */

/**
 * Element to letter mapping for DNA code
 */
const ELEMENT_CODE = {
  Wood: 'W',
  Fire: 'F',
  Earth: 'E',
  Metal: 'M',
  Water: 'A'  // 'A' for Aqua (W is taken by Wood)
}

/**
 * Ten Gods (十神) to letter mapping
 * Based on dominant personality influence
 */
const TEN_GODS_CODE = {
  // Direct Resource group
  'Direct Resource': 'R',
  'Indirect Resource': 'I',

  // Companion group
  'Friend': 'F',
  'Rob Wealth': 'B',

  // Output group
  'Eating God': 'E',
  'Hurting Officer': 'H',

  // Wealth group
  'Direct Wealth': 'D',
  'Indirect Wealth': 'N',

  // Officer group
  'Direct Officer': 'O',
  '7 Killings': 'K'
}

/**
 * Get element code letter
 */
function getElementCode(element) {
  return ELEMENT_CODE[element] || 'X'
}

/**
 * Get Ten God code letter
 */
function getTenGodCode(tenGodName) {
  return TEN_GODS_CODE[tenGodName] || 'X'
}

/**
 * Determine Yin/Yang polarity from BaZi data
 * @returns 'Y' (Yang dominant), 'X' (Yin dominant), or 'B' (Balanced)
 */
function getYinYangCode(yinYangBalance) {
  if (!yinYangBalance) return 'B'

  const yangPercentage = yinYangBalance.yangPercentage || 0
  const yinPercentage = yinYangBalance.yinPercentage || 0

  // Balanced if within 10% of 50/50
  const diff = Math.abs(yangPercentage - yinPercentage)
  if (diff <= 10) return 'B'

  // Yang dominant if > 50%
  if (yangPercentage > yinPercentage) return 'Y'

  // Yin dominant
  return 'X'
}

/**
 * Get top 3 elements by percentage
 * @param {Object} elements - Element percentages {Wood: 30, Fire: 25, ...}
 * @returns {Array} Array of [element, percentage] sorted by percentage
 */
function getTop3Elements(elements) {
  if (!elements) return []

  return Object.entries(elements)
    .map(([element, percentage]) => [element, Math.round(percentage)])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
}

/**
 * Get dominant Ten God
 * @param {Object} tenGodsData - Ten Gods calculation result
 * @returns {string} Name of dominant Ten God
 */
function getDominantTenGod(tenGodsData) {
  if (!tenGodsData || !tenGodsData.counts) {
    return null
  }

  const counts = tenGodsData.counts

  // Find Ten God with highest count
  let maxCount = 0
  let dominantGod = null

  Object.entries(counts).forEach(([god, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominantGod = god
    }
  })

  return dominantGod
}

/**
 * Generate SoulDNA code from BaZi data
 *
 * Format: XXX-L##Z
 * - XXX = Top 3 elements (W/F/E/M/A)
 * - L = Dominant Ten God letter
 * - ## = Primary element percentage (00-99)
 * - Z = Yin/Yang polarity (Y/X/B)
 *
 * Example: WWM-F48Y
 * - Wood, Wood, Metal (top 3 elements)
 * - Friend (dominant Ten God)
 * - 48% Wood (primary element)
 * - Yang dominant
 *
 * @param {Object} fourPillars - Four Pillars calculation result
 * @param {Object} tenGodsData - Ten Gods calculation result
 * @returns {string} 8-character SoulDNA code
 */
export function generateSoulDNA(fourPillars, tenGodsData = null) {
  // Validate input - handle multiple naming conventions
  const elementalBalance = fourPillars?.elementalBalance || fourPillars?.elementBalance || fourPillars?.elements
  if (!fourPillars || !elementalBalance) {
    console.error('[soulDNAEncoder] Invalid fourPillars data - missing element data')
    return null
  }

  // Handle multiple formats:
  // 1. Nested: { elements: { Wood: 10, Fire: 20, ... } }
  // 2. Flat: { Wood: 0.15, Fire: 0.20, ... } (from Python backend)
  // 3. Canonical: { Wood: 0.25, Fire: 0.15, ..., dominant: "Wood" } (Python-First)
  let elements = elementalBalance.elements
  if (!elements) {
    // Check if elementalBalance itself contains element keys directly
    const elementKeys = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
    const hasDirectElements = elementKeys.some(key => elementalBalance[key] !== undefined)
    if (hasDirectElements) {
      elements = {}
      for (const key of elementKeys) {
        // Convert percentages (0-1) to integer counts if needed
        const val = elementalBalance[key] || 0
        elements[key] = val < 1 ? Math.round(val * 100) : val
      }
    }
  }

  if (!elements) {
    console.error('[soulDNAEncoder] Could not extract elements from fourPillars')
    return null
  }

  const yinYangBalance = fourPillars.yinYangBalance

  // Get top 3 elements
  const top3 = getTop3Elements(elements)

  if (top3.length < 3) {
    console.error('[soulDNAEncoder] Could not determine top 3 elements')
    return null
  }

  // Part 1: XXX (Top 3 element codes)
  const element1Code = getElementCode(top3[0][0])
  const element2Code = getElementCode(top3[1][0])
  const element3Code = getElementCode(top3[2][0])
  const elementsCode = `${element1Code}${element2Code}${element3Code}`

  // Part 2: L (Dominant Ten God)
  const dominantGod = getDominantTenGod(tenGodsData)
  const tenGodCode = dominantGod ? getTenGodCode(dominantGod) : 'X'

  // Part 3: ## (Primary element percentage)
  const primaryPercentage = top3[0][1]
  const percentageCode = primaryPercentage.toString().padStart(2, '0')

  // Part 4: Z (Yin/Yang polarity)
  const yinYangCode = getYinYangCode(yinYangBalance)

  // Combine into final code
  const soulDNA = `${elementsCode}-${tenGodCode}${percentageCode}${yinYangCode}`

  console.log('[soulDNAEncoder] Generated SoulDNA:', soulDNA)
  console.log('[soulDNAEncoder] Breakdown:', {
    top3Elements: top3.map(([el, pct]) => `${el}(${pct}%)`).join(', '),
    dominantTenGod: dominantGod,
    yinYang: yinYangCode === 'Y' ? 'Yang' : yinYangCode === 'X' ? 'Yin' : 'Balanced'
  })

  return soulDNA
}

/**
 * Decode SoulDNA code into human-readable format
 *
 * @param {string} soulDNA - 8-character SoulDNA code
 * @returns {Object} Decoded information
 */
export function decodeSoulDNA(soulDNA) {
  if (!soulDNA || soulDNA.length !== 8 || !soulDNA.includes('-')) {
    console.error('[soulDNAEncoder] Invalid SoulDNA format')
    return null
  }

  const [elementsPart, detailsPart] = soulDNA.split('-')

  if (elementsPart.length !== 3 || detailsPart.length !== 4) {
    console.error('[soulDNAEncoder] Invalid SoulDNA format')
    return null
  }

  // Reverse mapping for elements
  const CODE_TO_ELEMENT = {
    W: 'Wood',
    F: 'Fire',
    E: 'Earth',
    M: 'Metal',
    A: 'Water'
  }

  // Reverse mapping for Ten Gods
  const CODE_TO_TEN_GOD = {
    R: 'Direct Resource',
    I: 'Indirect Resource',
    F: 'Friend',
    B: 'Rob Wealth',
    E: 'Eating God',
    H: 'Hurting Officer',
    D: 'Direct Wealth',
    N: 'Indirect Wealth',
    O: 'Direct Officer',
    K: '7 Killings',
    X: 'Unknown'
  }

  // Parse elements
  const element1 = CODE_TO_ELEMENT[elementsPart[0]] || 'Unknown'
  const element2 = CODE_TO_ELEMENT[elementsPart[1]] || 'Unknown'
  const element3 = CODE_TO_ELEMENT[elementsPart[2]] || 'Unknown'

  // Parse Ten God
  const tenGodCode = detailsPart[0]
  const tenGod = CODE_TO_TEN_GOD[tenGodCode] || 'Unknown'

  // Parse percentage
  const percentage = parseInt(detailsPart.substring(1, 3), 10)

  // Parse Yin/Yang
  const yinYangCode = detailsPart[3]
  const yinYang = yinYangCode === 'Y' ? 'Yang Dominant' :
                  yinYangCode === 'X' ? 'Yin Dominant' :
                  'Balanced'

  return {
    code: soulDNA,
    elements: {
      primary: element1,
      secondary: element2,
      tertiary: element3
    },
    dominantTenGod: tenGod,
    primaryPercentage: percentage,
    yinYang: yinYang,
    description: `${element1}-${element2}-${element3} | ${tenGod} | ${percentage}% ${element1} | ${yinYang}`
  }
}

/**
 * Validate SoulDNA code format
 *
 * @param {string} soulDNA - Code to validate
 * @returns {boolean} True if valid format
 */
export function validateSoulDNA(soulDNA) {
  if (!soulDNA || typeof soulDNA !== 'string') {
    return false
  }

  // Check length
  if (soulDNA.length !== 8) {
    return false
  }

  // Check format: XXX-L##Z
  const pattern = /^[WFEMA]{3}-[RIFBEHDONKX]\d{2}[YXB]$/
  return pattern.test(soulDNA)
}

// =============================================================================
// PYTHON-FIRST CONVENIENCE FUNCTION (Phase 2B)
// =============================================================================
/**
 * Generate SoulDNA from a profile using Python-First canonical structure
 *
 * Supports both:
 * - New canonical: profile.bazi.elements, profile.bazi.tenGods
 * - Legacy: profile.calculations.fourPillars.elementBalance
 *
 * @param {Object} profile - Profile with bazi or calculations data
 * @returns {string|null} 8-character SoulDNA code or null
 */
export function generateSoulDNAFromProfile(profile) {
  if (!profile) return null

  // Priority 1: Canonical path (Python-First)
  if (profile.bazi?.elements) {
    const elements = profile.bazi.elements
    const tenGodsData = profile.bazi?.tenGods ? { counts: extractTenGodCounts(profile.bazi.tenGods) } : null

    // Build fourPillars-like structure for compatibility
    const fourPillarsData = {
      elements: elements,
      yinYangBalance: profile.calculations?.yinYang || null
    }

    console.log('[soulDNAEncoder] ✅ Using canonical path profile.bazi.elements')
    return generateSoulDNA(fourPillarsData, tenGodsData)
  }

  // Priority 2: Legacy path
  if (profile.calculations?.fourPillars?.elementBalance) {
    console.log('[soulDNAEncoder] ⚠️ Using legacy path calculations.fourPillars')
    return generateSoulDNA(profile.calculations.fourPillars)
  }

  // Priority 3: Constitution path
  if (profile.constitutional?.bazi?.elementBalance) {
    console.log('[soulDNAEncoder] ⚠️ Using constitution path')
    return generateSoulDNA({ elements: profile.constitutional.bazi.elementBalance })
  }

  console.error('[soulDNAEncoder] No BaZi element data found in profile')
  return null
}

/**
 * Extract Ten God counts from canonical tenGods array
 * @param {Array} tenGods - Array of Ten God objects from Python
 * @returns {Object} Counts by Ten God name
 */
function extractTenGodCounts(tenGods) {
  if (!Array.isArray(tenGods)) return {}

  const counts = {}
  for (const tg of tenGods) {
    const name = tg.tenGod || tg.ten_god
    if (name) {
      counts[name] = (counts[name] || 0) + 1
    }
  }
  return counts
}
