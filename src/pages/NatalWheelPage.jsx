/**
 * NATAL WHEEL PAGE
 *
 * Full-screen interactive natal chart with Placidus house system.
 * Features Father Ticky's 72-zone system overlaid on traditional rings.
 *
 * Ring layout (inside → out):
 *   Center area: aspect chord lines (toggle) + sign names
 *   Ring 1: Zodiac — 72 zone segments (5° each), element-colored
 *   Ring 2: Seasons — 12 segments with BEGINNING / CORE / TRANSITION
 *   Ring 3: Houses — 12 Placidus unequal arcs
 *   Ring 4: Planets — at exact ecliptic degree, tiered by type
 *
 * Orientation: 0° Aries at 12 o'clock, clockwise.
 *
 * GENESIS AstroProfile — February 2026
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useProfiles } from '../contexts/ProfileContext'
import NotesPanel from '../components/results/NotesPanel'
import { getZoneForPlacement } from '../utils/zoneKnowledgeBuilder'
import { calculateNatalChart } from '../services/pythonFunctionsService'
import { getHistoricalTimezone } from '../services/timezoneService'
import LocationPicker from '../components/common/LocationPicker'
import ReverseEnginePanel from '../components/lab/ReverseEnginePanel'
import { HouseLearningPanel } from '../components/zodiac/HouseLearningPanel'
import TuningLabPanel from '../components/zodiac/TuningLabPanel'
import ChartSortedView from '../components/zodiac/ChartSortedView'
import PlaybackControls from '../components/zodiac/PlaybackControls'
import ZoneChip, { ZoneTooltip as ZoneTooltipInline } from '../components/zodiac/ZoneChip'
import { getDegreeTheory, findNotableDegrees } from '../data/degreeTheory'
import { getSabianSymbol, findAllSabianSymbols } from '../data/sabianSymbols'
import './TropicalSeasonsPage.css' // shared header styles (profile-selector, etc.)

// ============================================================================
// CONSTANTS
// ============================================================================

const CX = 400, CY = 400 // SVG center

// Ring radii (inside → out)
const ZODIAC_INNER = 138, ZODIAC_OUTER = 218
const SEASON_INNER = 221, SEASON_OUTER = 256  // wider for modality labels
const HOUSE_INNER = 260, HOUSE_OUTER = 296
const RAY_OUTER = 370 // sun-ray lines extend to outermost planet tier

// Planet tier radii
const TIER_R = { personal: 314, social: 332, generational: 350, asteroid: 366 }

// Angle lines
const ANGLE_OUTER = 382
const ANGLE_PIN = 4

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

const SIGN_GLYPHS = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋',
  Leo:'♌', Virgo:'♍', Libra:'♎', Scorpio:'♏',
  Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓'
}

const SIGN_ABBR = {
  Aries:'Ari', Taurus:'Tau', Gemini:'Gem', Cancer:'Can',
  Leo:'Leo', Virgo:'Vir', Libra:'Lib', Scorpio:'Sco',
  Sagittarius:'Sag', Capricorn:'Cap', Aquarius:'Aqu', Pisces:'Pis'
}

const ELEMENT_OF = {
  Aries:'Fire', Leo:'Fire', Sagittarius:'Fire',
  Taurus:'Earth', Virgo:'Earth', Capricorn:'Earth',
  Gemini:'Air', Libra:'Air', Aquarius:'Air',
  Cancer:'Water', Scorpio:'Water', Pisces:'Water'
}

// HSL hue+saturation per element — boosted for vibrancy
const EL_HSL = {
  Fire:  { h: 8,   s: 80 },
  Earth: { h: 142, s: 55 },
  Air:   { h: 210, s: 70 },
  Water: { h: 262, s: 70 }
}

const SEASON_DATA = [
  { name: 'Spring', start: 0,   end: 90,  color: '#4ade80' },
  { name: 'Summer', start: 90,  end: 180, color: '#fbbf24' },
  { name: 'Autumn', start: 180, end: 270, color: '#f97316' },
  { name: 'Winter', start: 270, end: 360, color: '#94a3b8' }
]


const PLANET_SYM = {
  sun:'☉', moon:'☽', mercury:'☿', venus:'♀', mars:'♂',
  jupiter:'♃', saturn:'♄', uranus:'♅', neptune:'♆', pluto:'♇',
  north_node:'☊', south_node:'☋', chiron:'⚷',
  ceres:'⚳', pallas:'⚴', juno:'⚵', vesta:'⚶'
}

const PLANET_NAME = {
  sun:'Sun', moon:'Moon', mercury:'Mercury', venus:'Venus', mars:'Mars',
  jupiter:'Jupiter', saturn:'Saturn', uranus:'Uranus', neptune:'Neptune',
  pluto:'Pluto', north_node:'N.Node', south_node:'S.Node', chiron:'Chiron',
  ceres:'Ceres', pallas:'Pallas', juno:'Juno', vesta:'Vesta'
}

const PLANET_TIER = {
  sun:'personal', moon:'personal', mercury:'personal', venus:'personal', mars:'personal',
  jupiter:'social', saturn:'social',
  uranus:'generational', neptune:'generational', pluto:'generational',
  north_node:'asteroid', south_node:'asteroid', chiron:'asteroid',
  ceres:'asteroid', pallas:'asteroid', juno:'asteroid', vesta:'asteroid'
}

const LEGEND_ORDER = [
  'sun','moon','mercury','venus','mars',
  'jupiter','saturn','uranus','neptune','pluto',
  'north_node','south_node','chiron','ceres','pallas','juno','vesta'
]

const ASTEROID_KEYS = new Set(['chiron','ceres','pallas','juno','vesta'])

const ASTEROID_ARCHETYPE = {
  chiron: 'Wounded Healer',
  ceres:  'Nurturing',
  pallas: 'Wisdom & Strategy',
  juno:   'Commitment',
  vesta:  'Devotion & Focus'
}

const ASPECT_STYLE = {
  conjunction: { color: '#fbbf24', dash: '',    sym: '☌' },
  opposition:  { color: '#ef4444', dash: '6,3', sym: '☍' },
  trine:       { color: '#3b82f6', dash: '',    sym: '△' },
  square:      { color: '#ef4444', dash: '',    sym: '□' },
  sextile:     { color: '#22c55e', dash: '',    sym: '⚹' },
  quincunx:    { color: '#6b7280', dash: '3,3', sym: '⚻' }
}

const SIGN_RULER = {
  Aries:'mars', Taurus:'venus', Gemini:'mercury', Cancer:'moon',
  Leo:'sun', Virgo:'mercury', Libra:'venus', Scorpio:'pluto',
  Sagittarius:'jupiter', Capricorn:'saturn', Aquarius:'uranus', Pisces:'neptune'
}

// Distinct fill + stroke per house (12 unique colors)
const HOUSE_COLORS = {
  1:  { fill: 'rgba(239,68,68,0.22)',   stroke: 'rgba(239,68,68,0.65)'   },  // red
  2:  { fill: 'rgba(249,115,22,0.22)',  stroke: 'rgba(249,115,22,0.65)'  },  // orange
  3:  { fill: 'rgba(234,179,8,0.22)',   stroke: 'rgba(234,179,8,0.65)'   },  // yellow
  4:  { fill: 'rgba(34,197,94,0.22)',   stroke: 'rgba(34,197,94,0.65)'   },  // green
  5:  { fill: 'rgba(16,185,129,0.22)',  stroke: 'rgba(16,185,129,0.65)'  },  // emerald
  6:  { fill: 'rgba(6,182,212,0.22)',   stroke: 'rgba(6,182,212,0.65)'   },  // cyan
  7:  { fill: 'rgba(59,130,246,0.22)',  stroke: 'rgba(59,130,246,0.65)'  },  // blue
  8:  { fill: 'rgba(99,102,241,0.22)',  stroke: 'rgba(99,102,241,0.65)'  },  // indigo
  9:  { fill: 'rgba(139,92,246,0.22)',  stroke: 'rgba(139,92,246,0.65)'  },  // violet
  10: { fill: 'rgba(168,85,247,0.22)',  stroke: 'rgba(168,85,247,0.65)'  },  // purple
  11: { fill: 'rgba(236,72,153,0.22)',  stroke: 'rgba(236,72,153,0.65)'  },  // pink
  12: { fill: 'rgba(244,114,182,0.22)', stroke: 'rgba(244,114,182,0.65)' }   // rose
}

// Arabic Parts colors and symbols
const ARABIC_PARTS_STYLE = {
  fortune:  { color: '#FFD700', name: 'Part of Fortune', symbol: '⊕', meaning: 'Material luck' },
  spirit:   { color: '#C0C0C0', name: 'Part of Spirit', symbol: '⊙', meaning: 'Soul purpose' },
  eros:     { color: '#FF1493', name: 'Part of Eros', symbol: '♥', meaning: 'Passion' },
  marriage: { color: '#9370DB', name: 'Part of Marriage', symbol: '⚭', meaning: 'Partnership' },
  death:    { color: '#708090', name: 'Part of Transformation', symbol: '⚸', meaning: 'Rebirth style' },
  children: { color: '#90EE90', name: 'Part of Children', symbol: '⚒', meaning: 'Creative offspring' },
  passion:  { color: '#FF4500', name: 'Part of Passion', symbol: '⚡', meaning: 'Assertive desire' },
  necessity:{ color: '#4B0082', name: 'Part of Necessity', symbol: '⚛', meaning: 'Binding fate' },
  courage:  { color: '#DC143C', name: 'Part of Courage', symbol: '⚔', meaning: 'Bravery' }
}

// Arabic Parts placement radius (inside zodiac ring)
const ARABIC_PARTS_R = 118 // just inside ZODIAC_INNER (138)

// ============================================================================
// GEOMETRY UTILITIES
// ============================================================================

/** Convert ecliptic longitude (0-360) to SVG-compatible angle in radians.
 *  0° Aries = 12 o'clock (top). Clockwise. */
function toRad(lon) {
  return ((lon - 90) * Math.PI) / 180
}

/** Ecliptic longitude + radius → SVG (x, y). */
function lonXY(lon, r) {
  const a = toRad(lon)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

/** SVG arc-sector path from startLon to endLon at given inner/outer radii. */
function arcPath(startLon, endLon, iR, oR) {
  const s1 = toRad(startLon), s2 = toRad(endLon)
  let span = ((endLon - startLon) % 360 + 360) % 360
  if (span === 0) span = 360
  const lg = span > 180 ? 1 : 0
  const a = { x: CX + oR * Math.cos(s1), y: CY + oR * Math.sin(s1) }
  const b = { x: CX + oR * Math.cos(s2), y: CY + oR * Math.sin(s2) }
  const c = { x: CX + iR * Math.cos(s2), y: CY + iR * Math.sin(s2) }
  const d = { x: CX + iR * Math.cos(s1), y: CY + iR * Math.sin(s1) }
  return `M${a.x},${a.y} A${oR},${oR} 0 ${lg} 1 ${b.x},${b.y} L${c.x},${c.y} A${iR},${iR} 0 ${lg} 0 ${d.x},${d.y} Z`
}

/** Get absolute ecliptic longitude from a data object with sign+degree or longitude. */
function getLon(obj) {
  if (!obj) return null
  if (obj.longitude != null) return Number(obj.longitude)
  const idx = SIGNS.indexOf(obj.sign)
  if (idx === -1) return null
  return idx * 30 + Number(obj.degreeInSign ?? obj.degree ?? 0)
}

/** Zone fill color: element hue + zone-based lightness — vivid range. */
function zoneColor(sign, zoneIdx) {
  const el = ELEMENT_OF[sign]
  if (!el) return '#1e293b'
  const { h, s } = EL_HSL[el]
  const l = 22 + zoneIdx * 5 // 22% → ~47% (brighter gradient)
  return `hsl(${h}, ${s}%, ${l}%)`
}

/** Format degree: 17°46' */
function fmtDeg(d) {
  if (d == null) return ''
  const deg = Math.floor(d)
  const min = Math.round((d - deg) * 60)
  return `${deg}°${String(min).padStart(2, '0')}'`
}

/** Convert minutes-from-midnight to HH:MM string */
function minutesToTime(mins) {
  const h = Math.floor(mins / 60), m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Normalize sovereign.houses into a flat array of cusp objects with .lon property.
 *  Ensures House 1 cusp = ASC longitude (fundamental in all house systems). */
function normalizeHouses(sovereign) {
  if (!sovereign) return []
  let src = sovereign.houses
  if (!src) return []

  // Unwrap nested wrappers: { houses: [...], system: "Placidus" } or { cusps: [...] }
  if (!Array.isArray(src) && typeof src === 'object') {
    if (Array.isArray(src.houses)) src = src.houses
    else if (Array.isArray(src.cusps)) src = src.cusps
    else if (src.cusps && typeof src.cusps === 'object' && !Array.isArray(src.cusps)) src = src.cusps
    else if (src.houses && typeof src.houses === 'object' && !Array.isArray(src.houses)) src = src.houses
  }

  let result = []

  // Direct array: [{house, sign, longitude, degree}, ...]
  if (Array.isArray(src)) {
    result = src
      .map((h, i) => {
        if (!h || (!h.sign && !h.longitude)) return null
        const house = h.house || (i + 1)
        const lon = getLon(h)
        return lon != null ? { ...h, house, lon } : null
      })
      .filter(Boolean)
      .sort((a, b) => a.house - b.house)
  }
  // Object with string keys: { house_1: {...}, house_2: {...} }
  else if (typeof src === 'object') {
    result = Object.entries(src).map(([k, v]) => {
      if (!v || typeof v !== 'object') return null
      const num = parseInt(k.replace(/\D/g, ''))
      if (isNaN(num) || num < 1 || num > 12) return null
      const lon = getLon(v)
      return lon != null ? { ...v, house: num, lon } : null
    }).filter(Boolean).sort((a, b) => a.house - b.house)
  }

  // Force House 1 cusp = ASC longitude (fundamental rule in Placidus)
  const asc = sovereign.ascendant || sovereign.rising
  if (asc && result.length > 0) {
    let ascLon = getLon(asc)
    if (ascLon != null) {
      // Validate sign-longitude consistency for ASC
      const signIdx = SIGNS.indexOf(asc.sign)
      if (signIdx !== -1 && Math.floor(ascLon / 30) !== signIdx) {
        ascLon = signIdx * 30 + Number(asc.degreeInSign ?? asc.degree ?? 0)
      }
      const h1 = result.find(h => h.house === 1)
      if (h1) {
        h1.lon = ascLon
        h1.sign = asc.sign || h1.sign
      } else {
        // House 1 missing entirely — add it from ASC
        result.push({ house: 1, lon: ascLon, sign: asc.sign, degree: asc.degree ?? asc.degreeInSign })
        result.sort((a, b) => a.house - b.house)
      }
    }
  }

  // Force House 10 cusp = MC longitude
  const mc = sovereign.midheaven
  if (mc && result.length > 0) {
    let mcLon = getLon(mc)
    if (mcLon != null) {
      // Validate sign-longitude consistency for MC
      const signIdx = SIGNS.indexOf(mc.sign)
      if (signIdx !== -1 && Math.floor(mcLon / 30) !== signIdx) {
        mcLon = signIdx * 30 + Number(mc.degreeInSign ?? mc.degree ?? 0)
      }
      const h10 = result.find(h => h.house === 10)
      if (h10) {
        h10.lon = mcLon
        h10.sign = mc.sign || h10.sign
      } else {
        result.push({ house: 10, lon: mcLon, sign: mc.sign, degree: mc.degree })
        result.sort((a, b) => a.house - b.house)
      }
    }
  }

  return result
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function NatalWheelPage() {
  const navigate = useNavigate()
  const { profiles, loading, recalculateSovereignData, updateProfile } = useProfiles()
  const [selectedId, setSelectedId] = useState(null) // null = no profile selected
  const [showAspects, setShowAspects] = useState(false)
  const [showRulers, setShowRulers] = useState(false)
  const [showAsteroids, setShowAsteroids] = useState(true)
  const [showArabicParts, setShowArabicParts] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [showAspectPanel, setShowAspectPanel] = useState(true)
  const [showHouseLearning, setShowHouseLearning] = useState(false)
  const [showSortedView, setShowSortedView] = useState(false)
  const [showDegreeTheory, setShowDegreeTheory] = useState(false)
  const [showSabianSymbols, setShowSabianSymbols] = useState(false)
  const [selectedHouseForLearning, setSelectedHouseForLearning] = useState(0)
  const [tooltip, setTooltip] = useState(null)
  const [recalculating, setRecalculating] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownHighlight, setDropdownHighlight] = useState(-1) // -1 = "Select a Profile", 0+ = profile index
  const dropdownRef = useRef(null)
  const dropdownListRef = useRef(null)

  // ── LAB Mode State ──────────────────────────────────────
  const [labMode, setLabMode] = useState(false)
  const [labInputMode, setLabInputMode] = useState('manual') // 'profile' | 'manual'
  const [labProfileId, setLabProfileId] = useState('')
  const [labDate, setLabDate] = useState('')
  const [labTime, setLabTime] = useState('12:00')
  const [labLocation, setLabLocation] = useState(null)
  const [labResolvedTz, setLabResolvedTz] = useState(null)
  const [labTzLoading, setLabTzLoading] = useState(false)
  const [labExploring, setLabExploring] = useState(false)
  const [labSovereign, setLabSovereign] = useState(null)
  const [labCalculating, setLabCalculating] = useState(false)
  const [labTimeMinutes, setLabTimeMinutes] = useState(720) // 12:00 = 720 minutes from midnight
  const [loadedFromReverse, setLoadedFromReverse] = useState(false) // tracks if current chart came from Reverse-Engine Load button
  const [playbackActive, setPlaybackActive] = useState(false)
  const playbackActiveRef = useRef(false)
  const labTimerRef = useRef(null)
  const labMinutesRef = useRef(720) // mirrors labTimeMinutes for keyboard handler
  const labArrowRef = useRef({ interval: null, startTime: 0, direction: 0 })

  // ── Soul Journal Floating Popup State ──────────────────
  const [journalOpen, setJournalOpen] = useState(false)
  const [journalNotes, setJournalNotes] = useState('')
  const [journalRecentTags, setJournalRecentTags] = useState([])
  const [journalSaving, setJournalSaving] = useState(false)
  const [journalSaved, setJournalSaved] = useState(false)
  const [journalPos, setJournalPos] = useState({ x: 80, y: 60 })
  const journalDragRef = useRef(null)
  const journalNotesRef = useRef(null)

  // Close dropdown on outside click (document-level mousedown + contains check)
  useEffect(() => {
    if (!dropdownOpen) return
    const handleMouseDown = (e) => {
      // Check if click was inside the button/wrapper OR inside the portal dropdown list
      const inWrapper = dropdownRef.current && dropdownRef.current.contains(e.target)
      const inPortal = dropdownListRef.current && dropdownListRef.current.contains(e.target)
      if (!inWrapper && !inPortal) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [dropdownOpen])

  // All profiles sorted by name (for dropdown)
  const allProfiles = useMemo(() =>
    (profiles || []).slice().sort((a, b) =>
      (a.displayName || a.name || '').localeCompare(b.displayName || b.name || '')),
    [profiles]
  )

  // Quick lookup: profiles that have western sovereign data
  const hasWesternData = useMemo(() => {
    const set = new Set()
    ;(profiles || []).forEach(p => {
      const w = p.western || p.calculations?.western
      if (w?.sovereignCalculation?.sun?.sign || w?.sun?.sign) set.add(p.id)
    })
    return set
  }, [profiles])

  // Dropdown keyboard navigation (arrow keys, enter, letter jump)
  useEffect(() => {
    if (!dropdownOpen) {
      setDropdownHighlight(-1)
      return
    }
    const handleKeyDown = (e) => {
      const maxIdx = allProfiles.length - 1
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setDropdownHighlight(h => Math.min(h + 1, maxIdx))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setDropdownHighlight(h => Math.max(h - 1, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (dropdownHighlight === -1) {
          setSelectedId(null)
        } else if (allProfiles[dropdownHighlight]) {
          setSelectedId(allProfiles[dropdownHighlight].id)
        }
        setDropdownOpen(false)
      } else if (e.key === 'Escape') {
        setDropdownOpen(false)
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        // Jump to first profile starting with this letter
        const letter = e.key.toLowerCase()
        const idx = allProfiles.findIndex(p =>
          (p.displayName || p.name || '').toLowerCase().startsWith(letter)
        )
        if (idx >= 0) setDropdownHighlight(idx)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dropdownOpen, dropdownHighlight, allProfiles, setSelectedId])

  // Scroll highlighted dropdown item into view
  useEffect(() => {
    if (!dropdownOpen || !dropdownListRef.current) return
    const container = dropdownListRef.current
    const highlighted = container.querySelector('[data-highlighted="true"]')
    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [dropdownHighlight, dropdownOpen])

  const profile = useMemo(() => profiles?.find(p => p.id === selectedId) || null, [profiles, selectedId])

  // ── Soul Journal: sync notes when profile changes ──
  const activeJournalProfile = journalOpen ? (labMode && labExploring && labProfileId ? profiles?.find(p => p.id === labProfileId) : profile) : null
  const activeJournalId = activeJournalProfile?.id || null

  useEffect(() => {
    if (activeJournalProfile) {
      setJournalNotes(activeJournalProfile.notes || '')
      setJournalRecentTags(activeJournalProfile.recentCustomTags || [])
    }
  }, [activeJournalId, journalOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleJournalSave = useCallback(async () => {
    const saveId = activeJournalId
    if (!saveId) return
    try {
      setJournalSaving(true)
      await updateProfile(saveId, { notes: journalNotes, recentCustomTags: journalRecentTags })
      setJournalSaved(true)
      setTimeout(() => setJournalSaved(false), 3000)
    } catch (e) {
      console.error('Journal save failed:', e)
    } finally {
      setJournalSaving(false)
    }
  }, [activeJournalId, journalNotes, journalRecentTags, updateProfile])

  // ── Journal drag handler ──
  const handleJournalDragStart = useCallback((e) => {
    // Only drag from header area
    const startX = e.clientX - journalPos.x
    const startY = e.clientY - journalPos.y
    const onMove = (ev) => {
      setJournalPos({ x: Math.max(0, ev.clientX - startX), y: Math.max(0, ev.clientY - startY) })
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [journalPos])

  const profileSovereign = useMemo(() => {
    if (!profile) return null
    // Canonical path: profile.western (Python-First)
    const wCanonical = profile.western
    // Legacy path: profile.calculations.western
    const wLegacy = profile.calculations?.western

    // Resolve sovereign data: prefer canonical, fallback to legacy
    let sov = null
    let source = 'none'
    if (wCanonical?.sun?.sign) {
      sov = wCanonical
      source = 'profile.western'
    } else if (wLegacy?.sovereignCalculation?.sun?.sign) {
      sov = wLegacy.sovereignCalculation
      source = 'calculations.western.sovereignCalculation'
    } else if (wCanonical?.sovereignCalculation?.sun?.sign) {
      sov = wCanonical.sovereignCalculation
      source = 'profile.western.sovereignCalculation'
    }

    // Cross-check: if both paths exist and ASC differs
    if (sov) {
      const canonicalAsc = wCanonical?.ascendant || wCanonical?.rising
      const legacyAsc = wLegacy?.sovereignCalculation?.ascendant || wLegacy?.sovereignCalculation?.rising
      if (canonicalAsc && legacyAsc && canonicalAsc.sign !== legacyAsc.sign) {
        console.warn('[NatalWheel] ASC mismatch between data paths!', {
          canonical: { sign: canonicalAsc.sign, lon: canonicalAsc.longitude, degree: canonicalAsc.degree },
          legacy: { sign: legacyAsc.sign, lon: legacyAsc.longitude, degree: legacyAsc.degree },
          using: source
        })
      }
    }

    if (sov) {
      const asc = sov.ascendant || sov.rising
      console.log('[NatalWheel] Sovereign resolved:', {
        source,
        ascSign: asc?.sign,
        ascLon: asc?.longitude,
        ascDegree: asc?.degree,
        profileName: profile.displayName || profile.name
      })
      console.log('[NatalWheel] Planet keys in sovereign:', Object.keys(sov.planets || {}))
      const asteroidKeys = ['chiron','ceres','pallas','juno','vesta']
      asteroidKeys.forEach(k => {
        const p = sov.planets?.[k]
        console.log(`[NatalWheel] ${k}:`, p ? { sign: p.sign, degree: p.degree, lon: p.longitude, house: p.house } : 'MISSING')
      })
      // Debug: Log house cusps for house assignment verification
      const houseCusps = sov.houses
      if (houseCusps) {
        console.log('[NatalWheel] House cusps raw:', houseCusps)
        // Extract cusp longitudes for verification
        if (Array.isArray(houseCusps)) {
          console.log('[NatalWheel] House cusps array:', houseCusps.map(h => ({ house: h.house, sign: h.sign, lon: h.longitude })))
        }
      }
    }

    return sov
  }, [profile])

  // ── LAB Birth Data (from profile selection or manual input) ──
  const labBirthData = useMemo(() => {
    if (labInputMode === 'profile' && labProfileId) {
      const p = (profiles || []).find(pr => pr.id === labProfileId)
      if (p) {
        let birthDate = p.birthDate
        if (p.birth?.date) {
          const raw = p.birth.date
          if (raw.toDate) {
            const d = raw.toDate()
            birthDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          } else if (typeof raw === 'string') birthDate = raw
        }
        return {
          birthDate,
          birthTime: p.birthTime || p.birth?.time || '12:00',
          latitude: p.birthLat ?? p.birth?.location?.latitude ?? p.location?.coordinates?.lat,
          longitude: p.birthLng ?? p.birth?.location?.longitude ?? p.location?.coordinates?.lng,
          name: p.displayName || p.name || 'Unknown'
        }
      }
    }
    return {
      birthDate: labDate,
      birthTime: labTime || '12:00',
      latitude: labLocation?.lat,
      longitude: labLocation?.lng,
      name: 'Manual Entry'
    }
  }, [labInputMode, labProfileId, profiles, labDate, labTime, labLocation])

  // ── LAB Timezone Lookup ──
  useEffect(() => {
    if (!labMode) return
    const lat = labBirthData.latitude
    const lng = labBirthData.longitude
    const date = labBirthData.birthDate
    if (!lat || !lng || !date) { setLabResolvedTz(null); return }
    let cancelled = false
    setLabTzLoading(true)
    getHistoricalTimezone({ latitude: lat, longitude: lng, birthDate: date, birthTime: '12:00' })
      .then(r => { if (!cancelled && r?.success) setLabResolvedTz(r.timezone); else if (!cancelled) setLabResolvedTz(null) })
      .catch(() => { if (!cancelled) setLabResolvedTz(null) })
      .finally(() => { if (!cancelled) setLabTzLoading(false) })
    return () => { cancelled = true }
  }, [labMode, labBirthData.latitude, labBirthData.longitude, labBirthData.birthDate])

  // ── LAB Chart Computation ──
  const computeLabChart = useCallback(async (minutes) => {
    const bd = labBirthData
    if (!bd.birthDate || bd.latitude == null || bd.longitude == null) return
    const h = Math.floor(minutes / 60), m = minutes % 60
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    setLabCalculating(true)
    try {
      const raw = await calculateNatalChart({
        birthDate: bd.birthDate,
        birthTime: timeStr,
        latitude: bd.latitude,
        longitude: bd.longitude,
        timezone: labResolvedTz?.zoneName || 'UTC'
      })
      const asc = raw.ascendant || raw.houses?.ascendant || {}
      const mc = raw.midheaven || raw.houses?.midheaven || {}
      setLabSovereign({
        sun: raw.planets?.sun || null,
        moon: raw.planets?.moon || null,
        ascendant: { sign: asc.sign, degree: asc.degree, longitude: asc.longitude, degreeFormatted: asc.degreeFormatted },
        midheaven: { sign: mc.sign, degree: mc.degree, longitude: mc.longitude, degreeFormatted: mc.degreeFormatted },
        rising: { sign: asc.sign, degree: asc.degree, degreeInSign: asc.degree, longitude: asc.longitude },
        planets: raw.planets || {},
        houses: raw.houses || [],
        aspects: raw.aspects || [],
        arabicParts: raw.arabicParts || null,
      })
    } catch (err) {
      console.error('[LAB] Chart calculation failed:', err)
    } finally {
      setLabCalculating(false)
    }
  }, [labBirthData, labResolvedTz])

  // ── LAB Time Slider Handler (debounced) ──
  const handleLabTimeChange = useCallback((minutes) => {
    setLabTimeMinutes(minutes)
    if (labTimerRef.current) clearTimeout(labTimerRef.current)
    labTimerRef.current = setTimeout(() => computeLabChart(minutes), 600)
  }, [computeLabChart])

  // Raw time snap for playback — updates slider without triggering API debounce
  const snapTimeRaw = useCallback((minutes) => { setLabTimeMinutes(minutes) }, [])

  // ── Load a ReverseEngine candidate directly into LAB (bypasses state-timing issues) ──
  const handleLoadReverseCandidate = useCallback(async ({ birthDate, birthTime, latitude, longitude, timezone, name }) => {
    if (!birthDate || !birthTime || latitude == null || longitude == null) return
    setLabMode(true)
    // Keep labInputMode === 'reverse' so the Reverse panel stays mounted
    // and its results list is preserved for the user to click another candidate.
    setLabDate(birthDate)
    setLabTime(birthTime)
    setLabLocation({ lat: latitude, lng: longitude, name })
    if (timezone) setLabResolvedTz({ zoneName: timezone })
    const [h, m] = birthTime.split(':').map(Number)
    const mins = h * 60 + (m || 0)
    setLabTimeMinutes(mins)
    setLoadedFromReverse(true)
    setLabExploring(true)
    setLabCalculating(true)
    try {
      const raw = await calculateNatalChart({
        birthDate, birthTime, latitude, longitude, timezone: timezone || 'UTC'
      })
      const asc = raw.ascendant || raw.houses?.ascendant || {}
      const mc = raw.midheaven || raw.houses?.midheaven || {}
      setLabSovereign({
        sun: raw.planets?.sun || null,
        moon: raw.planets?.moon || null,
        ascendant: { sign: asc.sign, degree: asc.degree, longitude: asc.longitude, degreeFormatted: asc.degreeFormatted },
        midheaven: { sign: mc.sign, degree: mc.degree, longitude: mc.longitude, degreeFormatted: mc.degreeFormatted },
        rising: { sign: asc.sign, degree: asc.degree, degreeInSign: asc.degree, longitude: asc.longitude },
        planets: raw.planets || {},
        houses: raw.houses || [],
        aspects: raw.aspects || [],
        arabicParts: raw.arabicParts || null,
      })
    } catch (err) {
      console.error('[LAB] Load candidate failed:', err)
    } finally {
      setLabCalculating(false)
    }
  }, [])

  // ── LAB Explore Handler ──
  const handleLabExplore = useCallback(async () => {
    const bd = labBirthData
    if (!bd.birthDate || bd.latitude == null) return
    const [h, m] = (bd.birthTime || '12:00').split(':').map(Number)
    const mins = h * 60 + (m || 0)
    setLabTimeMinutes(mins)
    setLabExploring(true)
    await computeLabChart(mins)
  }, [labBirthData, computeLabChart])

  // ── LAB Arrow Key Momentum ──
  // Keep refs in sync with state so keyboard handler reads fresh values
  useEffect(() => { labMinutesRef.current = labTimeMinutes }, [labTimeMinutes])
  useEffect(() => { playbackActiveRef.current = playbackActive }, [playbackActive])

  useEffect(() => {
    if (!labMode || !labExploring) return

    const getStep = (elapsed) => {
      if (elapsed > 3000) return 60   // after 3s held: jump 1 hour per tick
      if (elapsed > 1500) return 15   // after 1.5s: 15 min per tick
      if (elapsed > 500) return 5     // after 0.5s: 5 min per tick
      return 1                         // default: 1 min per tick
    }

    const tick = (dir) => {
      const elapsed = Date.now() - labArrowRef.current.startTime
      const step = getStep(elapsed)
      const cur = labMinutesRef.current
      const next = Math.max(0, Math.min(1439, cur + dir * step))
      if (next !== cur) handleLabTimeChange(next)
    }

    const onKeyDown = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      // Don't hijack arrows inside input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return
      if (playbackActiveRef.current) return // suppress during playback animation
      if (e.repeat) return // ignore browser auto-repeat, we run our own interval
      e.preventDefault()

      const dir = e.key === 'ArrowRight' ? 1 : -1
      // Immediate first step (1 minute)
      const cur = labMinutesRef.current
      const next = Math.max(0, Math.min(1439, cur + dir))
      if (next !== cur) handleLabTimeChange(next)

      // Start momentum interval (120ms per tick, step size accelerates)
      labArrowRef.current.startTime = Date.now()
      labArrowRef.current.direction = dir
      if (labArrowRef.current.interval) clearInterval(labArrowRef.current.interval)
      labArrowRef.current.interval = setInterval(() => tick(dir), 120)
    }

    const onKeyUp = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (labArrowRef.current.interval) {
        clearInterval(labArrowRef.current.interval)
        labArrowRef.current.interval = null
      }
    }

    // Stop momentum if window loses focus
    const onBlur = () => {
      if (labArrowRef.current.interval) {
        clearInterval(labArrowRef.current.interval)
        labArrowRef.current.interval = null
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      if (labArrowRef.current.interval) clearInterval(labArrowRef.current.interval)
    }
  }, [labMode, labExploring, handleLabTimeChange])

  // ── Effective Sovereign (switches between Profile and LAB data) ──
  const sovereign = useMemo(() => {
    if (labMode && labExploring && labSovereign) return labSovereign
    return profileSovereign
  }, [labMode, labExploring, labSovereign, profileSovereign])

  // ── Process house cusps (robust normalization) ─────────
  const houses = useMemo(() => normalizeHouses(sovereign), [sovereign])

  // ── Process planets ──────────────────────────────────────
  const planets = useMemo(() => {
    if (!sovereign?.planets) return []
    const items = []
    for (const [key, data] of Object.entries(sovereign.planets)) {
      if (!data?.sign) continue
      const lon = getLon(data)
      if (lon == null) continue
      items.push({
        key, name: PLANET_NAME[key] || key, symbol: PLANET_SYM[key] || '?',
        lon, sign: data.sign, degree: data.degree ?? data.degreeInSign ?? 0,
        retrograde: !!(data.retrograde || data.isRetrograde), house: data.house,
        tier: PLANET_TIER[key] || 'asteroid'
      })
    }
    // Derive south node from north node
    const nn = sovereign.planets.north_node
    if (nn && !sovereign.planets.south_node) {
      const nnLon = getLon(nn)
      if (nnLon != null) {
        const snLon = (nnLon + 180) % 360
        items.push({
          key: 'south_node', name: 'S.Node', symbol: '☋',
          lon: snLon, sign: SIGNS[Math.floor(snLon / 30)], degree: snLon % 30,
          retrograde: false, tier: 'asteroid'
        })
      }
    }
    return items
  }, [sovereign])

  // ── Angles (ASC, MC, DSC, IC) ────────────────────────────
  const angles = useMemo(() => {
    if (!sovereign) return []
    const result = []
    const asc = sovereign.ascendant || sovereign.rising
    const mc = sovereign.midheaven
    if (asc) {
      let lon = getLon(asc)
      if (lon != null) {
        // Validate sign-longitude consistency (catch stale longitude data)
        const signIdx = SIGNS.indexOf(asc.sign)
        if (signIdx !== -1) {
          const lonSignIdx = Math.floor(lon / 30)
          if (lonSignIdx !== signIdx) {
            // Mismatch: longitude says one sign, sign field says another
            // Recalculate longitude from sign + degree (sign field is more authoritative)
            const correctedLon = signIdx * 30 + Number(asc.degreeInSign ?? asc.degree ?? 0)
            console.warn(`[NatalWheel] ASC sign-longitude mismatch! sign="${asc.sign}" (${signIdx}) but longitude=${lon.toFixed(2)} maps to "${SIGNS[lonSignIdx]}" (${lonSignIdx}). Correcting to ${correctedLon.toFixed(2)}`)
            lon = correctedLon
          }
        }
        result.push({ tag: 'ASC', lon, sign: asc.sign, degree: asc.degree ?? asc.degreeInSign })
        const dscLon = (lon + 180) % 360
        result.push({ tag: 'DSC', lon: dscLon, sign: SIGNS[Math.floor(dscLon / 30)], degree: dscLon % 30 })
      }
    }
    if (mc) {
      let lon = getLon(mc)
      if (lon != null) {
        // Same sign-longitude consistency check for MC
        const signIdx = SIGNS.indexOf(mc.sign)
        if (signIdx !== -1) {
          const lonSignIdx = Math.floor(lon / 30)
          if (lonSignIdx !== signIdx) {
            const correctedLon = signIdx * 30 + Number(mc.degreeInSign ?? mc.degree ?? 0)
            console.warn(`[NatalWheel] MC sign-longitude mismatch! sign="${mc.sign}" but longitude=${lon.toFixed(2)}. Correcting to ${correctedLon.toFixed(2)}`)
            lon = correctedLon
          }
        }
        result.push({ tag: 'MC', lon, sign: mc.sign, degree: mc.degree })
        const icLon = (lon + 180) % 360
        result.push({ tag: 'IC', lon: icLon, sign: SIGNS[Math.floor(icLon / 30)], degree: icLon % 30 })
      }
    }
    return result
  }, [sovereign])

  // ── Arabic Parts (Lots) ─────────────────────────────────
  const arabicParts = useMemo(() => {
    if (!sovereign?.arabicParts?.parts) return []
    const parts = sovereign.arabicParts.parts
    const result = []
    for (const [key, data] of Object.entries(parts)) {
      if (!data?.longitude) continue
      const style = ARABIC_PARTS_STYLE[key]
      if (!style) continue
      result.push({
        key,
        name: style.name,
        symbol: style.symbol,
        color: style.color,
        meaning: style.meaning,
        lon: data.longitude,
        sign: data.sign,
        degree: data.degreeInSign,
        zone: data.zone,
        house: data.house,
        formula: data.formula,
        formatted: data.formatted
      })
    }
    return result
  }, [sovereign])

  // ── Placed planets (handle conjunction stacking) ─────────
  const placed = useMemo(() => {
    const byTier = {}
    planets.forEach(p => {
      if (!byTier[p.tier]) byTier[p.tier] = []
      byTier[p.tier].push(p)
    })
    const result = []
    for (const [tier, group] of Object.entries(byTier)) {
      const baseR = TIER_R[tier] || TIER_R.asteroid
      group.sort((a, b) => a.lon - b.lon)
      for (let i = 0; i < group.length; i++) {
        let r = baseR
        for (let j = 0; j < i; j++) {
          const prev = result.find(p => p.key === group[j].key)
          if (prev) {
            const dist = Math.min(Math.abs(group[i].lon - group[j].lon), 360 - Math.abs(group[i].lon - group[j].lon))
            if (dist < 6) r = Math.max(r, prev.r + 20)
          }
        }
        result.push({ ...group[i], r })
      }
    }
    return result
  }, [planets])

  // ── House arcs (span from cusp to next cusp) ────────────
  const houseArcs = useMemo(() => {
    if (houses.length < 2) return []

    // Build a full 12-house cusp map, deriving axis opposites where possible
    const cuspByNum = {}
    houses.forEach(h => { cuspByNum[h.house] = h })

    // Derive opposite cusps from angular axis: H7 = H1+180, H4 = H10+180
    if (cuspByNum[1] && !cuspByNum[7]) {
      const opp = (cuspByNum[1].lon + 180) % 360
      cuspByNum[7] = { house: 7, lon: opp, sign: SIGNS[Math.floor(opp / 30)], derived: true }
    }
    if (cuspByNum[10] && !cuspByNum[4]) {
      const opp = (cuspByNum[10].lon + 180) % 360
      cuspByNum[4] = { house: 4, lon: opp, sign: SIGNS[Math.floor(opp / 30)], derived: true }
    }

    const fullCusps = []
    for (let i = 1; i <= 12; i++) {
      if (cuspByNum[i]) {
        fullCusps.push(cuspByNum[i])
      } else {
        // Interpolate missing cusp from nearest neighbors
        const prev = cuspByNum[i - 1] || cuspByNum[i - 2] || houses[houses.length - 1]
        const next = cuspByNum[i + 1] || cuspByNum[i + 2] || houses[0]
        if (prev && next) {
          let midLon = (prev.lon + next.lon) / 2
          if (Math.abs(next.lon - prev.lon) > 180) midLon = ((prev.lon + next.lon + 360) / 2) % 360
          fullCusps.push({ house: i, lon: midLon, sign: prev.sign, interpolated: true })
        }
      }
    }

    if (fullCusps.length < 12) return []

    const arcs = fullCusps.map((h, i) => {
      const next = fullCusps[(i + 1) % fullCusps.length]
      const num = h.house || (i + 1)
      let midLon = (h.lon + next.lon) / 2
      if (next.lon < h.lon) midLon = ((h.lon + next.lon + 360) / 2) % 360
      return { num, startLon: h.lon, endLon: next.lon, sign: h.sign, isAngular: [1,4,7,10].includes(num), midLon, interpolated: !!(h.interpolated || h.derived) }
    })
    return arcs
  }, [houses])

  // ── Helper: find house number for a given ecliptic longitude ──
  const houseForLon = useCallback((lon) => {
    if (houseArcs.length === 0 || lon == null) return null
    for (const arc of houseArcs) {
      const span = ((arc.endLon - arc.startLon) % 360 + 360) % 360
      const offset = ((lon - arc.startLon) % 360 + 360) % 360
      if (offset < span) return arc.num
    }
    return null
  }, [houseArcs])

  // ── Processed aspects ────────────────────────────────────
  const aspects = useMemo(() => {
    if (!sovereign?.aspects) return []
    return sovereign.aspects.map(a => {
      const p1 = planets.find(p => p.key === a.planet1)
      const p2 = planets.find(p => p.key === a.planet2)
      if (!p1 || !p2) return null
      return { ...a, p1Lon: p1.lon, p2Lon: p2.lon, style: ASPECT_STYLE[a.aspect] || ASPECT_STYLE.conjunction }
    }).filter(Boolean)
  }, [sovereign?.aspects, planets])

  // ── 72 zone segments (always rendered) ─────────────────
  const zones = useMemo(() => {
    const arr = []
    for (let s = 0; s < 12; s++) {
      const sign = SIGNS[s]
      for (let z = 0; z < 6; z++) {
        const startLon = s * 30 + z * 5
        arr.push({ sign, zone: z + 1, startLon, endLon: startLon + 5, color: zoneColor(sign, z) })
      }
    }
    return arr
  }, [])

  // Build planets object with derived south_node if missing + normalize retrograde field
  // (Must be before early return to avoid hook ordering issues)
  const pObj = useMemo(() => {
    const rawPlanets = sovereign?.planets || {}
    const planets = {}
    // Normalize each planet: ensure retrograde field exists (API may send isRetrograde)
    for (const [key, data] of Object.entries(rawPlanets)) {
      planets[key] = {
        ...data,
        retrograde: !!(data.retrograde || data.isRetrograde)
      }
    }
    // Derive south_node from north_node if not present
    const nn = planets.north_node
    if (nn && !planets.south_node) {
      // Get north node longitude - try multiple sources
      let nnLon = nn.longitude
      if (nnLon == null && nn.sign) {
        const signIdx = SIGNS.indexOf(nn.sign)
        if (signIdx >= 0) {
          const deg = nn.degree ?? nn.degreeInSign ?? 0
          nnLon = signIdx * 30 + deg
        }
      }
      if (nnLon != null && !isNaN(nnLon)) {
        const snLon = (nnLon + 180) % 360
        const snSignIdx = Math.floor(snLon / 30)
        const snDegree = snLon % 30
        planets.south_node = {
          longitude: snLon,
          sign: SIGNS[snSignIdx],
          degree: snDegree,
          degreeInSign: snDegree,
          retrograde: nn.retrograde || false,
          house: nn.house ? (nn.house <= 6 ? nn.house + 6 : nn.house - 6) : null
        }
      }
    }
    return planets
  }, [sovereign?.planets])

  // ── Markdown export of chart summary ───────────────────
  const handleExportMarkdown = useCallback(() => {
    if (!sovereign || !profile) return
    const lines = []
    const name = profile.displayName || profile.name || 'Unnamed'
    const birthDate = profile.birthDate || ''
    const birthTime = profile.birthTime || ''
    const locStr = profile.location?.fullAddress || profile.location?.city || profile.birthPlace || ''

    const asc = angles.find(a => a.tag === 'ASC')
    const sunSign = pObj.sun?.sign || ''
    const moonSign = pObj.moon?.sign || ''
    const risingSign = asc?.sign || ''

    lines.push(`# Birthday Wheel — ${name}`)
    lines.push('')
    if (birthDate) lines.push(`- **Birthdate:** ${birthDate}`)
    if (birthTime) lines.push(`- **Time:** ${birthTime}`)
    if (locStr) lines.push(`- **Location:** ${locStr}`)
    const trinity = []
    if (sunSign) trinity.push(`Sun ${sunSign}`)
    if (moonSign) trinity.push(`Moon ${moonSign}`)
    if (risingSign) trinity.push(`Rising ${risingSign}`)
    if (trinity.length) lines.push(`- **Trinity:** ${trinity.join(' · ')}`)
    lines.push('')

    // Angles
    if (angles.length > 0) {
      lines.push('## Angles')
      lines.push('')
      lines.push('| Tag | Name | Degree | Sign | Zone | House |')
      lines.push('|-----|------|--------|------|------|-------|')
      const angleMeta = [
        { tag: 'ASC', label: 'Ascendant', house: 1 },
        { tag: 'MC',  label: 'Midheaven', house: 10 },
        { tag: 'DSC', label: 'Descendant', house: 7 },
        { tag: 'IC',  label: 'Nadir', house: 4 }
      ]
      for (const { tag, label, house } of angleMeta) {
        const a = angles.find(x => x.tag === tag)
        if (!a) continue
        const zone = getZoneForPlacement(a.sign, a.degree)
        const zoneStr = zone ? `Zone ${zone.id}` : ''
        lines.push(`| ${tag} | ${label} | ${fmtDeg(a.degree)} | ${a.sign} | ${zoneStr} | ${house} |`)
      }
      lines.push('')
    }

    const planetRow = (key) => {
      const p = pObj[key]
      if (!p?.sign) return null
      const deg = p.degree ?? p.degreeInSign ?? 0
      const zone = getZoneForPlacement(p.sign, deg)
      const zoneStr = zone ? `Zone ${zone.id}` : ''
      const pLon = getLon(p)
      const house = p.house || houseForLon(pLon) || ''
      const isNode = key === 'north_node' || key === 'south_node'
      const retro = p.retrograde && !isNode ? 'Retro' : ''
      return `| ${PLANET_NAME[key]} | ${fmtDeg(deg)} | ${p.sign} | ${zoneStr} | ${house} | ${retro} |`
    }

    // Planets
    const planetRows = LEGEND_ORDER.filter(k => !ASTEROID_KEYS.has(k)).map(planetRow).filter(Boolean)
    if (planetRows.length > 0) {
      lines.push('## Planets')
      lines.push('')
      lines.push('| Planet | Degree | Sign | Zone | House | Retro |')
      lines.push('|--------|--------|------|------|-------|-------|')
      planetRows.forEach(r => lines.push(r))
      lines.push('')
    }

    // Asteroids
    const asteroidRows = LEGEND_ORDER.filter(k => ASTEROID_KEYS.has(k)).map(planetRow).filter(Boolean)
    if (asteroidRows.length > 0) {
      lines.push('## Asteroids')
      lines.push('')
      lines.push('| Asteroid | Degree | Sign | Zone | House | Retro |')
      lines.push('|----------|--------|------|------|-------|-------|')
      asteroidRows.forEach(r => lines.push(r))
      lines.push('')
    }

    // Arabic Parts
    if (arabicParts.length > 0) {
      lines.push('## Arabic Parts')
      lines.push('')
      lines.push('| Part | Degree | Sign | Zone | House |')
      lines.push('|------|--------|------|------|-------|')
      for (const part of arabicParts) {
        const zone = part.sign ? getZoneForPlacement(part.sign, part.degree) : null
        const zoneStr = zone ? `Zone ${zone.id}` : ''
        lines.push(`| ${part.name} | ${fmtDeg(part.degree)} | ${part.sign || ''} | ${zoneStr} | ${part.house || ''} |`)
      }
      lines.push('')
    }

    const md = lines.join('\n')
    const safeName = name.replace(/[^a-z0-9-_]+/gi, '_').toLowerCase()
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${safeName}_natal_chart.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [sovereign, profile, angles, pObj, arabicParts, houseForLon])

  // ── Degree Theory: notable degree hits ─────────────────
  const degreeTheoryHits = useMemo(() => {
    if (!showDegreeTheory) return []
    return findNotableDegrees(pObj, angles, PLANET_SYM, PLANET_NAME)
  }, [showDegreeTheory, pObj, angles])

  const degreeTheoryByKey = useMemo(() => {
    const map = {}
    degreeTheoryHits.forEach(h => { map[h.key] = h })
    return map
  }, [degreeTheoryHits])

  // ── Sabian Symbols: all planet/angle symbols ──────────
  const sabianHits = useMemo(() => {
    if (!showSabianSymbols) return []
    return findAllSabianSymbols(pObj, angles, PLANET_SYM, PLANET_NAME)
  }, [showSabianSymbols, pObj, angles])

  const sabianByKey = useMemo(() => {
    const map = {}
    sabianHits.forEach(h => { map[h.key] = h })
    return map
  }, [sabianHits])

  // ── Loading state ──────────────────────────────────────
  // Don't show full loading screen during recalculation (keeps the chart visible)
  if (loading && !recalculating) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0a1628 100%)' }}><div className="text-white/50">Loading…</div></div>
  }

  const hasSovereign = !!sovereign

  // Debug info: verify arc sum = 360°
  const arcSum = houseArcs.reduce((sum, a) => {
    const span = ((a.endLon - a.startLon) % 360 + 360) % 360
    return sum + span
  }, 0)
  const h1Arc = houseArcs.find(a => a.num === 1)
  const ascAngle = angles.find(a => a.tag === 'ASC')
  const housesDebug = sovereign && houseArcs.length > 0
    ? `${houseArcs.length} houses | arc sum: ${arcSum.toFixed(1)}° | H1 cusp: ${h1Arc?.startLon?.toFixed(1)}° ${h1Arc?.sign || ''} | ASC: ${ascAngle?.sign || '?'} ${ascAngle?.lon?.toFixed(1)}°`
    : ''

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0a1628 100%)' }}>
      {/* ── Header ── */}
      <header className="tropical-header-enhanced">
        <div className="header-left">
          {labMode && labExploring ? (
            /* ── LAB Exploring: back button + birth info ── */
            <>
              <button
                type="button"
                onClick={() => setLabExploring(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: '6px 12px' }}
              >
                ← Change Data
              </button>
              <div className="profile-info-bar">
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#f1f5f9', minWidth: '80px' }}>
                  {labBirthData.name}
                </div>
                <div className="profile-birth-date">
                  <span className="info-label">Birth</span>
                  <span className="info-value">
                    {labBirthData.birthDate
                      ? new Date(labBirthData.birthDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: '700', background: 'rgba(168,85,247,0.15)', padding: '2px 6px', borderRadius: '4px' }}>LAB</span>
                  <span style={{ fontSize: '15px', color: '#fbbf24', fontWeight: '700', fontFamily: 'monospace' }}>{minutesToTime(labTimeMinutes)}</span>
                  {labCalculating && <span style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>calculating...</span>}
                </div>
                {sovereign && (
                  <div className="profile-signs">
                    {sovereign.sun?.sign && (
                      <div className="sign-badge sun-sign">
                        <span className="sign-glyph">{SIGN_GLYPHS[sovereign.sun.sign] || '?'}</span>
                        <span className="sign-label">Sun</span>
                        <span className="sign-name">{sovereign.sun.sign}</span>
                      </div>
                    )}
                    {sovereign.moon?.sign && (
                      <div className="sign-badge moon-sign">
                        <span className="sign-glyph">{SIGN_GLYPHS[sovereign.moon.sign] || '?'}</span>
                        <span className="sign-label">Moon</span>
                        <span className="sign-name">{sovereign.moon.sign}</span>
                      </div>
                    )}
                    {(sovereign.ascendant?.sign || sovereign.rising?.sign) && (
                      <div className="sign-badge rising-sign">
                        <span className="sign-glyph">{SIGN_GLYPHS[(sovereign.ascendant || sovereign.rising).sign] || '?'}</span>
                        <span className="sign-label">Rising</span>
                        <span className="sign-name">{(sovereign.ascendant || sovereign.rising).sign}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : labMode ? (
            /* ── LAB Input Mode: title only ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>Natal Wheel LAB</h1>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>What-If Birth Time Analysis</p>
              </div>
            </div>
          ) : (
            /* ── Profile Mode: existing dropdown + info bar ── */
            <>
              <div ref={dropdownRef} className="profile-selector-wrapper" style={{ position: 'relative' }}>
                <button
                  ref={el => { if (el) dropdownRef.current = el.parentElement }}
                  type="button"
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{
                    background: '#1e293b', color: '#e2e8f0',
                    border: '1px solid rgba(148,163,184,0.3)', borderRadius: '8px',
                    padding: '6px 32px 6px 12px', fontSize: '14px', fontWeight: '500',
                    cursor: 'pointer', minWidth: '200px', textAlign: 'left',
                    position: 'relative', width: '100%'
                  }}
                  title="Select a profile to view their natal chart"
                >
                  {profile?.displayName || profile?.name || '-- Select a Profile --'}
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#94a3b8' }}>
                    {dropdownOpen ? '▲' : '▼'}
                  </span>
                </button>
                {dropdownOpen && createPortal(
                  <div
                    ref={dropdownListRef}
                    style={{
                      position: 'fixed',
                      top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 4 : 0,
                      left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
                      minWidth: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().width : 200,
                      background: '#1e293b', border: '1px solid rgba(148,163,184,0.3)', borderRadius: '8px',
                      maxHeight: '300px', overflowY: 'auto', zIndex: 99999, boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                  >
                    <div
                      data-highlighted={dropdownHighlight === -1}
                      onClick={() => { setSelectedId(null); setDropdownOpen(false) }}
                      onMouseEnter={() => setDropdownHighlight(-1)}
                      style={{
                        padding: '8px 12px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer',
                        borderBottom: '1px solid rgba(148,163,184,0.15)',
                        background: dropdownHighlight === -1 ? '#334155' : 'transparent'
                      }}
                    >
                      -- Select a Profile --
                    </div>
                    {allProfiles.map((p, idx) => {
                      const hasData = hasWesternData.has(p.id)
                      const isHighlighted = dropdownHighlight === idx
                      const isSelected = p.id === selectedId
                      return (
                        <div
                          key={p.id}
                          data-highlighted={isHighlighted}
                          onClick={() => { setSelectedId(p.id); setDropdownOpen(false) }}
                          onMouseEnter={() => setDropdownHighlight(idx)}
                          style={{
                            padding: '8px 12px',
                            color: isSelected ? '#fbbf24' : hasData ? '#e2e8f0' : '#64748b',
                            fontSize: '13px', fontWeight: isSelected ? '600' : '400',
                            cursor: 'pointer',
                            background: isHighlighted ? '#334155' : isSelected ? 'rgba(251,191,36,0.1)' : 'transparent',
                            fontStyle: hasData ? 'normal' : 'italic',
                            borderLeft: isHighlighted ? '3px solid #a855f7' : '3px solid transparent'
                          }}
                        >
                          {p.displayName || p.name || 'Unknown'}
                          {!hasData && <span style={{ fontSize: '10px', marginLeft: '6px', color: '#475569' }}>(no chart)</span>}
                        </div>
                      )
                    })}
                  </div>,
                  document.body
                )}
              </div>

              {hasSovereign && profile && (
                <div className="profile-info-bar" style={{ gap: '16px' }}>
                  {/* Birth Info Block - 3 rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '220px' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#f1f5f9' }}>
                      {profile.displayName || profile.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      <span style={{ color: '#64748b' }}>BIRTHDATE</span>{' '}
                      <span style={{ color: '#e2e8f0' }}>{profile.birthDate || 'N/A'}</span>
                      {profile.birthDate && parseInt(profile.birthDate.split('-')[0], 10) < 100 && (
                        <span title="Birth year looks too low — missing century prefix?" style={{ color: '#f59e0b', marginLeft: '4px', cursor: 'help' }}>⚠</span>
                      )}
                      {profile.birthTime && (
                        <>
                          {' '}<span style={{ color: '#64748b' }}>TIME</span>{' '}
                          <span style={{ color: '#e2e8f0' }}>{profile.birthTime}</span>
                        </>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {(profile.location?.fullAddress || profile.location?.city || profile.birthPlace) ? (
                        <>
                          <span style={{ color: '#94a3b8' }}>{profile.location?.fullAddress || profile.location?.city || profile.birthPlace}</span>
                          {(profile.latitude != null && profile.longitude != null) && (
                            <span style={{ marginLeft: '6px', color: '#475569' }}>
                              ({profile.latitude?.toFixed(2)}°, {profile.longitude?.toFixed(2)}°)
                            </span>
                          )}
                        </>
                      ) : (
                        (profile.latitude != null && profile.longitude != null) && (
                          <span style={{ color: '#475569' }}>
                            Coordinates: {profile.latitude?.toFixed(4)}°, {profile.longitude?.toFixed(4)}°
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Sun/Moon/Rising badges */}
                  <div className="profile-signs" style={{ marginLeft: '8px' }}>
                    {sovereign.sun?.sign && (
                      <div className="sign-badge sun-sign">
                        <span className="sign-glyph">{SIGN_GLYPHS[sovereign.sun.sign] || '?'}</span>
                        <span className="sign-label">Sun</span>
                        <span className="sign-name">{sovereign.sun.sign}</span>
                      </div>
                    )}
                    {sovereign.moon?.sign && (
                      <div className="sign-badge moon-sign">
                        <span className="sign-glyph">{SIGN_GLYPHS[sovereign.moon.sign] || '?'}</span>
                        <span className="sign-label">Moon</span>
                        <span className="sign-name">{sovereign.moon.sign}</span>
                      </div>
                    )}
                    {(sovereign.ascendant?.sign || sovereign.rising?.sign) && (
                      <div className="sign-badge rising-sign">
                        <span className="sign-glyph">{SIGN_GLYPHS[(sovereign.ascendant || sovereign.rising).sign] || '?'}</span>
                        <span className="sign-label">Rising</span>
                        <span className="sign-name">{(sovereign.ascendant || sovereign.rising).sign}</span>
                      </div>
                    )}
                  </div>

                  {/* Natal Wheel Title */}
                  <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Birthday Wheel</span>
                  </div>
                </div>
              )}

              {/* Natal Wheel Title - shown when no profile data */}
              {(!hasSovereign || !profile) && (
                <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Birthday Wheel</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="header-right">
          {/* LAB / Profile Toggle */}
          <div style={{ display: 'flex', gap: '2px', background: '#1e293b', borderRadius: '8px', padding: '2px', border: '1px solid rgba(148,163,184,0.2)' }}>
            <button type="button"
              onClick={() => { setLabMode(false); setLabExploring(false); setLoadedFromReverse(false) }}
              style={{ padding: '4px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: !labMode ? '#7c3aed' : 'transparent', color: !labMode ? '#fff' : '#94a3b8', transition: 'all 0.2s' }}>
              Profile
            </button>
            <button type="button"
              onClick={() => setLabMode(true)}
              style={{ padding: '4px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: labMode ? '#7c3aed' : 'transparent', color: labMode ? '#fff' : '#94a3b8', transition: 'all 0.2s' }}>
              LAB
            </button>
          </div>

          {!labMode && (
            <button
              type="button"
              onClick={async () => {
                if (!selectedId || recalculating) return
                setRecalculating(true)
                try { await recalculateSovereignData(selectedId) }
                catch (e) { console.error('Recalculate failed:', e) }
                finally { setRecalculating(false) }
              }}
              className="recalculate-button"
              title="Recalculate chart from Python Swiss Ephemeris"
              disabled={recalculating || !selectedId}
            >
              {recalculating ? 'Recalculating...' : 'Recalculate'}
            </button>
          )}
          {labMode && labExploring && loadedFromReverse && (
            <button
              type="button"
              onClick={() => { setLabExploring(false) }}
              style={{ padding: '4px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '6px',
                border: '1px solid rgba(168,85,247,0.5)', cursor: 'pointer',
                background: 'rgba(168,85,247,0.2)', color: '#e9d5ff', transition: 'all 0.2s' }}
              title="Return to the Reverse-Engine results list (your candidates are preserved)"
            >
              ← Back to Results
            </button>
          )}
          <button type="button" onClick={() => navigate('/')} className="back-button">
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ── LAB Input Form (shown when LAB mode active, not yet exploring) ──
          Kept mounted (via CSS hide) while exploring so the Reverse Engine
          panel's results list persists when a candidate is loaded. */}
      {labMode && (
        <div className="max-w-2xl mx-auto px-4 py-6" style={{ display: labExploring ? 'none' : 'block' }}>
          {/* Search Profile / Enter Manually Toggle */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setLabInputMode('profile')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                labInputMode === 'profile' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white/60 hover:text-white'
              }`}
            >
              Search Profile
            </button>
            <button
              onClick={() => setLabInputMode('manual')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                labInputMode === 'manual' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white/60 hover:text-white'
              }`}
            >
              Enter Manually
            </button>
            <button
              onClick={() => setLabInputMode('reverse')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                labInputMode === 'reverse' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white/60 hover:text-white'
              }`}
            >
              Reverse Engine
            </button>
          </div>

          {/* Reverse Engine */}
          {labInputMode === 'reverse' && <ReverseEnginePanel profiles={allProfiles} onLoadChart={handleLoadReverseCandidate} />}

          {/* Profile Search */}
          {labInputMode === 'profile' && (
            <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Select a Profile</h3>
              <select
                value={labProfileId}
                onChange={e => setLabProfileId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">-- Select a profile --</option>
                {allProfiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.displayName || p.name || 'Unknown'}
                  </option>
                ))}
              </select>
              {labProfileId && labBirthData.birthDate && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-purple-500/30">
                  <div className="text-white font-medium">{labBirthData.name}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {labBirthData.birthDate}
                    {labBirthData.birthTime && labBirthData.birthTime !== '12:00' && (
                      <span className="ml-2 text-cyan-400">at {labBirthData.birthTime}</span>
                    )}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {labBirthData.latitude?.toFixed(4)}°, {labBirthData.longitude?.toFixed(4)}°
                  </div>
                  {labResolvedTz && (
                    <div className="text-xs text-emerald-400 mt-1">
                      {labResolvedTz.abbreviation || labResolvedTz.zoneName} (UTC{labResolvedTz.gmtOffsetHours >= 0 ? '+' : ''}{labResolvedTz.gmtOffsetHours})
                    </div>
                  )}
                  {labTzLoading && <div className="text-xs text-cyan-400 mt-1 animate-pulse">Looking up timezone...</div>}
                </div>
              )}
            </div>
          )}

          {/* Manual Input */}
          {labInputMode === 'manual' && (
            <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Enter Birth Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={labDate}
                    onChange={e => setLabDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Birth Time (starting point)</label>
                  <input
                    type="time"
                    value={labTime}
                    onChange={e => setLabTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-white/40 mt-1">You can adjust with the time slider after</p>
                </div>
                <div className="md:col-span-2">
                  <LocationPicker
                    value={labLocation}
                    onChange={setLabLocation}
                    label="Birth Location"
                    placeholder="Start typing a city..."
                  />
                </div>
              </div>
              {labLocation && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-sm text-white">{labLocation.formatted}</div>
                  <div className="text-xs text-white/40 mt-1">
                    {labLocation.lat?.toFixed(4)}°, {labLocation.lng?.toFixed(4)}°
                    {labResolvedTz && (
                      <span className="text-emerald-400 ml-2">
                        {labResolvedTz.abbreviation} (UTC{labResolvedTz.gmtOffsetHours >= 0 ? '+' : ''}{labResolvedTz.gmtOffsetHours})
                      </span>
                    )}
                    {labTzLoading && <span className="text-cyan-400 ml-2 animate-pulse">Looking up timezone...</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explore Button (hidden in reverse-engine mode — it has its own action) */}
          {labInputMode !== 'reverse' && (
          <div className="text-center">
            <button
              onClick={handleLabExplore}
              disabled={!labBirthData.birthDate || labBirthData.latitude == null || labBirthData.longitude == null}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                labBirthData.birthDate && labBirthData.latitude != null && labBirthData.longitude != null
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white hover:scale-105 shadow-lg shadow-purple-500/30'
                  : 'bg-slate-700 text-white/40 cursor-not-allowed'
              }`}
            >
              Explore Natal Wheel
            </button>
            {(!labBirthData.birthDate || labBirthData.latitude == null) && (
              <p className="text-xs text-white/40 mt-2">Enter a birth date and location to continue</p>
            )}
          </div>
          )}
        </div>
      )}

      {/* ── Main Wheel Content (hidden during LAB input) ── */}
      {!(labMode && !labExploring) && (
      <div className="px-2 pt-2" style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>

        {/* ── Chart Summary (left sidebar, educational — Khan Academy style) ── */}
        {hasSovereign && (
          <div style={{ flexShrink: 0, width: showSummary ? '360px' : 'auto', marginTop: '4px' }}>
            <div className="flex items-center gap-1.5" style={{ width: showSummary ? '100%' : 'auto' }}>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="text-[9px] font-bold text-white/50 tracking-wider bg-slate-900/90 backdrop-blur-sm rounded-lg border border-white/10 px-2.5 py-1.5 hover:text-white/70 transition-colors cursor-pointer flex-1"
                style={{ textAlign: 'left' }}
              >
                {showSummary ? '\u25BE' : '\u25B8'} CHART SUMMARY
              </button>
              {hasSovereign && (
                <button
                  onClick={() => setShowSortedView(true)}
                  className="text-[9px] text-white/40 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-white/10 px-2 py-1.5 hover:text-purple-300 hover:border-purple-500/30 transition-colors cursor-pointer"
                  title="Sort placements by House or Significance"
                >
                  Sort
                </button>
              )}
              {hasSovereign && (
                <button
                  onClick={handleExportMarkdown}
                  className="text-[9px] text-white/40 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-white/10 px-2 py-1.5 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors cursor-pointer"
                  title="Export chart summary (planets, degrees, zones, houses) as a Markdown file"
                >
                  ↓ MD
                </button>
              )}
            </div>
            {showSummary && (
              <div className="mt-1 bg-slate-900/92 backdrop-blur-sm rounded-lg border border-white/10 p-2.5">
                {/* Angles - most prominent section */}
                {angles.length > 0 && (
                  <div className="bg-purple-900/20 rounded-lg p-2 mb-2 border border-purple-500/30">
                    <div className="text-[11px] font-bold text-amber-200 mb-2 tracking-widest uppercase">⬡ Angles</div>
                    {[
                      { tag: 'ASC', label: 'Ascendant', house: 1 },
                      { tag: 'MC',  label: 'Midheaven', house: 10 },
                      { tag: 'DSC', label: 'Descendant', house: 7 },
                      { tag: 'IC',  label: 'Nadir', house: 4 }
                    ].map(({ tag, label, house }) => {
                      const a = angles.find(x => x.tag === tag)
                      if (!a) return null
                      const zone = getZoneForPlacement(a.sign, a.degree)
                      const isMain = tag === 'ASC' || tag === 'MC'
                      return (
                        <div key={tag} className={`flex items-center text-[10px] py-0.5 ${isMain ? 'bg-white/5 rounded px-1 -mx-1' : ''}`}>
                          <span className={`text-[11px] font-black ${tag === 'ASC' ? 'text-amber-300' : tag === 'MC' ? 'text-purple-300' : 'text-white/90'}`} style={{ width: 28 }}>{tag}</span>
                          <span className="text-white/60" style={{ width: 70 }}>{label}</span>
                          <span className="flex-1" />
                          <span className="font-semibold text-white">{fmtDeg(a.degree)}</span>
                          <span className="text-white/90 ml-1">{a.sign}</span>
                          {zone && <ZoneChip zone={zone} sign={a.sign} className="font-medium ml-1" />}
                          <span className="text-purple-300 ml-1">- House {house}</span>
                          {showDegreeTheory && degreeTheoryByKey[`angle_${tag}`] && (() => { const n = degreeTheoryByKey[`angle_${tag}`].theory.notable; return (
                            <span className="ml-1 text-[7px] font-bold px-1 rounded" style={{ background: `${n.color}22`, color: n.color, border: `1px solid ${n.color}44` }}>{n.shortBadge}</span>
                          )})()}
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Planets (non-asteroid) */}
                {Object.keys(pObj).length > 0 && (
                  <div className="bg-amber-900/15 rounded-lg p-2 mb-2 border border-amber-500/20">
                    <div className="text-[9px] font-bold text-amber-400 mb-1 tracking-widest uppercase">Planets</div>
                    {LEGEND_ORDER.filter(k => !ASTEROID_KEYS.has(k)).map(key => {
                      const p = pObj[key]
                      if (!p?.sign) return null
                      const deg = p.degree ?? p.degreeInSign ?? 0
                      const zone = getZoneForPlacement(p.sign, deg)
                      const pLon = getLon(p)
                      const house = p.house || houseForLon(pLon)
                      // Nodes are always retrograde (~97%) - don't show Retro for them (it's their normal state)
                      const isNode = key === 'north_node' || key === 'south_node'
                      const showRetro = p.retrograde && !isNode
                      return (
                        <div key={key} className="flex items-center text-[10px] leading-relaxed py-0.5">
                          <span className={showRetro ? 'text-red-400' : 'text-amber-300'} style={{ fontSize: 13, width: 14 }}>
                            {PLANET_SYM[key]}
                          </span>
                          <span className={`font-medium ${showRetro ? 'text-red-400' : 'text-white/90'}`} style={{ width: showRetro ? '62px' : '44px' }}>
                            {PLANET_NAME[key]}{showRetro && <span className="text-red-400 text-[7px] font-bold ml-0.5">Retro</span>}
                          </span>
                          <span className="flex-1" />
                          <span className="text-white/90">{fmtDeg(deg)}</span>
                          <span className="text-white/80 ml-1">{p.sign}</span>
                          {zone && <ZoneChip zone={zone} sign={p.sign} className="ml-1" />}
                          {house && <span className="text-purple-300 ml-1">- House {house}</span>}
                          {showDegreeTheory && degreeTheoryByKey[key] && (() => { const n = degreeTheoryByKey[key].theory.notable; return (
                            <span className="ml-1 text-[7px] font-bold px-1 rounded" style={{ background: `${n.color}22`, color: n.color, border: `1px solid ${n.color}44` }}>{n.shortBadge}</span>
                          )})()}
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Asteroids */}
                {showAsteroids && (
                  <div className="bg-indigo-900/15 rounded-lg p-2 mb-2 border border-indigo-500/20">
                    <div className="text-[9px] font-bold text-indigo-400 mb-1 tracking-widest uppercase">Asteroids</div>
                    {LEGEND_ORDER.filter(k => ASTEROID_KEYS.has(k)).map(key => {
                      const p = pObj[key]
                      if (!p?.sign) return null
                      const deg = p.degree ?? p.degreeInSign ?? 0
                      const zone = getZoneForPlacement(p.sign, deg)
                      const pLon = getLon(p)
                      const house = p.house || houseForLon(pLon)
                      const showRetro = p.retrograde
                      return (
                        <div key={key} className="flex items-center text-[10px] leading-relaxed py-0.5">
                          <span className={showRetro ? 'text-red-400' : 'text-indigo-300'} style={{ fontSize: 13, width: 14 }}>
                            {PLANET_SYM[key]}
                          </span>
                          <span className={`font-medium ${showRetro ? 'text-red-400' : 'text-white/90'}`} style={{ width: showRetro ? '58px' : '44px' }}>
                            {PLANET_NAME[key]}{showRetro && <span className="text-red-400 text-[7px] font-bold ml-0.5">Retro</span>}
                          </span>
                          <span className="flex-1" />
                          <span className="text-white/90">{fmtDeg(deg)}</span>
                          <span className="text-white/80 ml-1">{p.sign}</span>
                          {zone && <ZoneChip zone={zone} sign={p.sign} className="ml-1" />}
                          {house && <span className="text-purple-300 ml-1">- House {house}</span>}
                          {showDegreeTheory && degreeTheoryByKey[key] && (() => { const n = degreeTheoryByKey[key].theory.notable; return (
                            <span className="ml-1 text-[7px] font-bold px-1 rounded" style={{ background: `${n.color}22`, color: n.color, border: `1px solid ${n.color}44` }}>{n.shortBadge}</span>
                          )})()}
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Arabic Parts (Lots) */}
                {showArabicParts && arabicParts.length > 0 && (
                  <div className="bg-orange-900/15 rounded-lg p-2 border border-orange-500/20">
                    <div className="text-[9px] font-bold text-amber-500 mb-1 tracking-widest uppercase">⊕ Arabic Parts</div>
                    {arabicParts.map(part => {
                      const partZone = part.sign ? getZoneForPlacement(part.sign, part.degree) : null
                      return (
                      <div key={part.key} className="flex items-center text-[10px] leading-relaxed py-0.5">
                        <span style={{ fontSize: 13, color: part.color, width: 14 }}>
                          {part.symbol}
                        </span>
                        <span className="font-medium text-white/90" style={{ width: '68px' }}>
                          {part.name.replace('Part of ', '')}
                        </span>
                        <span className="flex-1" />
                        <span className="text-white/90">{fmtDeg(part.degree)}</span>
                        <span className="text-white/80 ml-1">{part.sign}</span>
                        {partZone && <ZoneChip zone={partZone} sign={part.sign} className="ml-1" />}
                        {part.house && <span className="text-purple-300 ml-1">- House {part.house}</span>}
                      </div>
                      )
                    })}
                  </div>
                )}
                {/* Degree Theory (Stojanovic) */}
                {showDegreeTheory && degreeTheoryHits.length > 0 && (
                  <div className="bg-rose-900/15 rounded-lg p-2 mt-2 border border-rose-500/20">
                    <div className="text-[9px] font-bold text-rose-400 mb-1 tracking-widest uppercase">★ Degree Theory</div>
                    <div className="text-[8px] text-white/30 mb-1.5">Stojanovic notable degrees</div>
                    {degreeTheoryHits.map(hit => {
                      const n = hit.theory.notable
                      return (
                        <div key={hit.key} className="flex items-center text-[10px] leading-relaxed py-0.5">
                          <span style={{ fontSize: 13, color: n.color, width: 14 }}>{hit.symbol}</span>
                          <span className="font-medium text-white/90" style={{ width: 52 }}>{hit.name}</span>
                          <span className="text-white/60 ml-1">{fmtDeg(hit.degree)}</span>
                          <span className="text-white/50 ml-1">{hit.sign}</span>
                          <span className="flex-1" />
                          <span className="text-[8px] text-rose-300/70 mr-1">{hit.theory.stojanovicGlyph} {hit.theory.stojanovicSign}</span>
                          <span className="text-[7px] font-bold px-1 rounded" style={{ background: `${n.color}22`, color: n.color, border: `1px solid ${n.color}44` }}>{n.badge}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Sabian Symbols (Wheeler/Rudhyar) */}
                {showSabianSymbols && sabianHits.length > 0 && (
                  <div className="bg-teal-900/15 rounded-lg p-2 mt-2 border border-teal-500/20">
                    <div className="text-[9px] font-bold text-teal-400 mb-1 tracking-widest uppercase">📜 Sabian Symbols</div>
                    <div className="text-[8px] text-white/30 mb-1.5">Wheeler / Rudhyar — 360 archetypal images</div>
                    {sabianHits.map(hit => (
                      <div key={hit.key} className="py-1 border-b border-white/5 last:border-0">
                        <div className="flex items-center text-[10px] leading-snug">
                          <span style={{ fontSize: 13, width: 16 }} className="text-teal-300/80">{hit.glyph}</span>
                          <span className="font-medium text-white/90" style={{ width: 50 }}>{hit.name}</span>
                          <span className="text-white/60 ml-1">{fmtDeg(hit.degree)}</span>
                          <span className="text-white/50 ml-1">{hit.sign}</span>
                        </div>
                        <div className="text-[8px] text-teal-300/60 italic ml-4 mt-0.5 leading-snug" style={{ maxWidth: 200 }}>
                          &ldquo;{hit.sabian}&rdquo;
                        </div>
                        {hit.keynote && (
                          <div className="text-[8px] text-teal-400/80 font-semibold ml-4 mt-0.5">
                            &mdash; {hit.keynote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="relative" style={{ flex: '0 1 auto', maxWidth: '900px', width: '100%' }}>

          {/* ── LAB Loading Overlay ── */}
          {labMode && labExploring && labCalculating && (
            <div className="absolute inset-0 flex items-center justify-center z-20 rounded-lg" style={{ background: 'rgba(10,22,40,0.4)' }}>
              <div className="text-purple-400 text-sm animate-pulse font-medium">Calculating chart...</div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              SVG NATAL WHEEL (always rendered)
             ══════════════════════════════════════════════ */}
          <svg viewBox="0 0 800 800" className="w-full h-auto" style={{ maxHeight: '78vh' }}>
            <defs>
              <filter id="nw-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.8" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background circle */}
            <circle cx={CX} cy={CY} r={ZODIAC_INNER - 2} fill="#0a1628" />

            {/* ── Aspect Chord Lines (center area, toggle) ── */}
            {showAspects && aspects.length > 0 && (
              <g opacity={0.55}>
                {aspects.map((a, i) => {
                  const r = ZODIAC_INNER - 6
                  const p1 = lonXY(a.p1Lon, r), p2 = lonXY(a.p2Lon, r)
                  const orbOp = Math.max(0.2, 1 - (a.orb || 0) / 10)
                  const w = a.orb < 2 ? 1.6 : a.orb < 5 ? 1 : 0.6
                  return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={a.style.color} strokeWidth={w} strokeDasharray={a.style.dash} opacity={orbOp} />
                })}
              </g>
            )}

            {/* ── Ring 1: Zodiac — 72 Zone Segments (always shown) ── */}
            <g>
              {zones.map((z, i) => (
                <path key={i}
                  d={arcPath(z.startLon, z.endLon, ZODIAC_INNER, ZODIAC_OUTER)}
                  fill={z.color}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth={0.6}
                  onMouseEnter={e => {
                    const zone = getZoneForPlacement(z.sign, z.startLon % 30 + 1)
                    setTooltip({ x: e.clientX, y: e.clientY, text: `${z.sign} Zone ${z.zone}${zone ? ` — "${zone.name}"` : ''}`, zone, sign: z.sign })
                  }}
                  onMouseMove={e => {
                    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </g>

            {/* ── Sun-Ray Zone Lines (72 radial lines, always shown) ── */}
            <g>
              {Array.from({ length: 72 }, (_, i) => {
                const lon = i * 5
                const isBoundary = i % 6 === 0
                // Sign boundaries extend from inner zodiac to outermost — shows sign continuity
                const p1 = lonXY(lon, isBoundary ? ZODIAC_INNER : ZODIAC_OUTER)
                const p2 = lonXY(lon, RAY_OUTER)
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isBoundary ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)'}
                  strokeWidth={isBoundary ? 1.8 : 0.5} />
              })}
            </g>

            {/* ── Sign Glyphs (centered in each sign, always shown) ── */}
            <g>
              {SIGNS.map((sign, i) => {
                const mid = i * 30 + 15
                const r = (ZODIAC_INNER + ZODIAC_OUTER) / 2
                const p = lonXY(mid, r)
                return <text key={sign} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                  fill="rgba(255,255,255,0.85)" fontSize={16} fontWeight="bold"
                  style={{ pointerEvents: 'none' }}>{SIGN_GLYPHS[sign]}</text>
              })}
            </g>

            {/* ── Sign Names (inside zodiac ring, below glyphs) ── */}
            <g>
              {SIGNS.map((sign, i) => {
                const mid = i * 30 + 15
                const p = lonXY(mid, ZODIAC_INNER + 14)
                const flip = mid > 90 && mid < 270
                const rotation = flip ? mid + 180 : mid
                return (
                  <text key={`name-${sign}`} x={p.x} y={p.y}
                    textAnchor="middle" dominantBaseline="central"
                    fill="rgba(255,255,255,0.55)" fontSize={7}
                    fontWeight="700" letterSpacing="1.2"
                    transform={`rotate(${rotation}, ${p.x}, ${p.y})`}
                    style={{ pointerEvents: 'none' }}>
                    {sign.toUpperCase()}
                  </text>
                )
              })}
            </g>

            {/* ── Degree Labels at Sign Boundaries (always shown) ── */}
            <g>
              {SIGNS.map((_, i) => {
                const lon = i * 30
                const p = lonXY(lon, ZODIAC_OUTER + 12)
                return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                  fill="rgba(255,255,255,0.3)" fontSize={7}
                  style={{ pointerEvents: 'none' }}>{lon}°</text>
              })}
            </g>

            {/* ── Ring 2: Zone Labels (72 zones, radial text) ── */}
            <g>
              {/* Season background arcs */}
              {SEASON_DATA.map((s, i) => (
                <path key={i}
                  d={arcPath(s.start, s.end, SEASON_INNER, SEASON_OUTER)}
                  fill={s.color} opacity={0.35}
                  stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
              ))}
              {/* Zone divider lines (every 5°, sign boundaries thicker) */}
              {Array.from({ length: 72 }, (_, i) => {
                const lon = i * 5
                const isSign = i % 6 === 0
                const p1 = lonXY(lon, SEASON_INNER), p2 = lonXY(lon, SEASON_OUTER)
                return <line key={`zdiv-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isSign ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isSign ? 0.8 : 0.4} />
              })}
              {/* Radial zone labels: "Ari 1", "Tau 3", etc. */}
              {zones.map((z, i) => {
                const mid = z.startLon + 2.5
                const r = (SEASON_INNER + SEASON_OUTER) / 2
                const p = lonXY(mid, r)
                const flip = mid >= 180
                const rotation = flip ? mid + 90 : mid - 90
                return (
                  <text key={`zl-${i}`} x={p.x} y={p.y}
                    textAnchor="middle" dominantBaseline="central"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={6} fontWeight="600" letterSpacing="0.3"
                    transform={`rotate(${rotation}, ${p.x}, ${p.y})`}
                    style={{ pointerEvents: 'none' }}>
                    {SIGN_ABBR[z.sign]} {z.zone}
                  </text>
                )
              })}
            </g>

            {/* ── Ring 3: Houses (Placidus unequal arcs, profile-dependent) ── */}
            {houseArcs.length > 0 && (
              <g>
                {houseArcs.map((h, i) => {
                  const hc = HOUSE_COLORS[h.num] || HOUSE_COLORS[1]
                  const arcSpan = ((h.endLon - h.startLon) % 360 + 360) % 360
                  const lp = lonXY(h.midLon, (HOUSE_INNER + HOUSE_OUTER) / 2)
                  const cuspInner = lonXY(h.startLon, HOUSE_INNER)
                  const cuspOuter = lonXY(h.startLon, HOUSE_OUTER)
                  // Fixed font size for all houses — uniform "H1" format
                  const fs = arcSpan < 5 ? 8 : 11
                  return (
                    <g key={i}
                      onClick={() => { setSelectedHouseForLearning(h.num); setShowHouseLearning(true); }}
                      style={{ cursor: 'pointer' }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <path d={arcPath(h.startLon, h.endLon, HOUSE_INNER, HOUSE_OUTER)}
                        fill={hc.fill} stroke={hc.stroke} strokeWidth={1.2}
                        strokeDasharray={h.interpolated ? '3,2' : ''} />
                      <line x1={cuspInner.x} y1={cuspInner.y} x2={cuspOuter.x} y2={cuspOuter.y}
                        stroke={h.isAngular ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'}
                        strokeWidth={h.isAngular ? 2 : 0.8} />
                      <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
                        fill="rgba(255,255,255,0.9)"
                        fontSize={fs} fontWeight="bold"
                        style={{ pointerEvents: 'none' }}>H{h.num}</text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── Angle Lines (ASC, MC, DSC, IC, profile-dependent) ── */}
            {angles.length > 0 && (
              <g>
                {angles.map((a, i) => {
                  const outer = lonXY(a.lon, ANGLE_OUTER)
                  const label = lonXY(a.lon, ANGLE_OUTER + 14)
                  const isASC = a.tag === 'ASC', isMC = a.tag === 'MC'
                  const color = isASC ? '#fbbf24' : isMC ? '#a855f7' : 'rgba(255,255,255,0.3)'
                  const pinFill = isASC ? '#fbbf24' : isMC ? '#a855f7' : '#64748b'
                  return (
                    <g key={i}
                      onMouseEnter={e => {
                        const zone = getZoneForPlacement(a.sign, a.degree)
                        const dtInfo = showDegreeTheory ? getDegreeTheory(a.degree) : null
                        const dtText = dtInfo?.notable ? ` · ${dtInfo.notable.badge} (${dtInfo.stojanovicSign} energy)` : ''
                        const sabInfo = showSabianSymbols ? getSabianSymbol(a.sign, a.degree) : null
                        const sabText = sabInfo ? ` · 📜 "${sabInfo.symbol}"${sabInfo.keynote ? ` — ${sabInfo.keynote}` : ''}` : ''
                        setTooltip({ x: e.clientX, y: e.clientY, text: `${a.tag} — ${fmtDeg(a.degree)} ${a.sign}${zone ? ` (Zone ${zone.id} "${zone.name}")` : ''}${dtText}${sabText}` })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <line x1={CX} y1={CY} x2={outer.x} y2={outer.y}
                        stroke={color} strokeWidth={isASC ? 1.6 : 1}
                        strokeDasharray={(!isASC && !isMC) ? '4,3' : ''} opacity={isASC || isMC ? 0.8 : 0.45} />
                      <circle cx={outer.x} cy={outer.y} r={ANGLE_PIN} fill={pinFill} stroke="rgba(0,0,0,0.4)" strokeWidth={0.5} />
                      <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central"
                        fill={color} fontSize={9} fontWeight="bold"
                        style={{ pointerEvents: 'none' }}>{a.tag}</text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── Ring 4: Planet Markers (profile-dependent) ── */}
            {placed.length > 0 && (
              <g>
                {placed.map(p => {
                  const isAsteroid = ASTEROID_KEYS.has(p.key)
                  if (isAsteroid && !showAsteroids) return null
                  const pos = lonXY(p.lon, p.r)
                  const pHouse = p.house || houseForLon(p.lon)
                  const fontSize = isAsteroid ? 14 : 19
                  // Nodes are always retrograde (~97%) - don't show Retro for them
                  const isNode = p.key === 'north_node' || p.key === 'south_node'
                  const showRetro = p.retrograde && !isNode
                  return (
                    <g key={p.key}
                      onMouseEnter={e => {
                        const zone = getZoneForPlacement(p.sign, p.degree)
                        const archetype = ASTEROID_ARCHETYPE[p.key]
                        const dtInfo = showDegreeTheory ? getDegreeTheory(p.degree) : null
                        const dtText = dtInfo?.notable ? ` · ${dtInfo.notable.badge} (${dtInfo.stojanovicSign} energy)` : ''
                        const sabInfo = showSabianSymbols ? getSabianSymbol(p.sign, p.degree) : null
                        const sabText = sabInfo ? ` · 📜 "${sabInfo.symbol}"${sabInfo.keynote ? ` — ${sabInfo.keynote}` : ''}` : ''
                        setTooltip({
                          x: e.clientX, y: e.clientY,
                          text: `${p.symbol} ${p.name}${archetype ? ` (${archetype})` : ''} — ${fmtDeg(p.degree)} ${p.sign}${zone ? ` · Zone ${zone.id}` : ''}${pHouse ? ` · House ${pHouse}` : ''}${showRetro ? ' · Retrograde' : ''}${dtText}${sabText}`
                        })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                        fill={showRetro ? '#ef4444' : isAsteroid ? '#a5b4fc' : '#fef9c3'}
                        fontSize={fontSize} fontWeight="bold"
                        opacity={isAsteroid ? 0.8 : 1}
                        filter="url(#nw-glow)">{p.symbol}</text>
                      {showRetro && (
                        <text x={pos.x + (isAsteroid ? 8 : 11)} y={pos.y + (isAsteroid ? 6 : 8)} textAnchor="middle" dominantBaseline="central"
                          fill="#ef4444" fontSize={isAsteroid ? 6 : 7} fontWeight="bold">R</text>
                      )}
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── Arabic Parts (toggle, profile-dependent) ── */}
            {showArabicParts && arabicParts.length > 0 && (
              <g>
                {arabicParts.map(part => {
                  const pos = lonXY(part.lon, ARABIC_PARTS_R)
                  const pHouse = part.house || houseForLon(part.lon)
                  return (
                    <g key={part.key}
                      onMouseEnter={e => setTooltip({
                        x: e.clientX, y: e.clientY,
                        text: `${part.symbol} ${part.name} — ${fmtDeg(part.degree)} ${part.sign}${part.zone ? ` · Zone ${part.zone}` : ''}${pHouse ? ` · House ${pHouse}` : ''} · ${part.meaning}`
                      })}
                      onMouseLeave={() => setTooltip(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Small marker line pointing to exact degree */}
                      <line
                        x1={lonXY(part.lon, ARABIC_PARTS_R - 8).x}
                        y1={lonXY(part.lon, ARABIC_PARTS_R - 8).y}
                        x2={lonXY(part.lon, ZODIAC_INNER - 4).x}
                        y2={lonXY(part.lon, ZODIAC_INNER - 4).y}
                        stroke={part.color}
                        strokeWidth={1}
                        opacity={0.5}
                      />
                      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                        fill={part.color}
                        fontSize={13} fontWeight="bold"
                        filter="url(#nw-glow)">{part.symbol}</text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── Degree Theory Markers (toggle) ── */}
            {showDegreeTheory && degreeTheoryHits.length > 0 && (
              <g>
                {degreeTheoryHits.map(hit => {
                  const isAngle = hit.key.startsWith('angle_')
                  const tag = isAngle ? hit.key.replace('angle_', '') : null
                  const angleData = isAngle ? angles.find(a => a.tag === tag) : null
                  const planetData = !isAngle ? placed.find(p => p.key === hit.key) : null
                  if (!angleData && !planetData) return null
                  const lon = isAngle ? angleData.lon : planetData.lon
                  const r = isAngle ? ANGLE_OUTER : planetData.r
                  const pos = lonXY(lon, r)
                  const n = hit.theory.notable
                  return (
                    <g key={`dt-${hit.key}`}>
                      <circle cx={pos.x} cy={pos.y} r={isAngle ? 8 : 13} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.55} strokeDasharray="3,2" />
                      <text x={pos.x} y={pos.y + (isAngle ? 13 : 17)} textAnchor="middle" dominantBaseline="central" fill={n.color} fontSize={6} fontWeight="bold" opacity={0.8}>
                        {n.shortBadge}
                      </text>
                    </g>
                  )
                })}
              </g>
            )}

            {/* ── House Ruler Lines (toggle, profile-dependent) ── */}
            {showRulers && houseArcs.length > 0 && (
              <g opacity={0.4}>
                {houseArcs.map((h, i) => {
                  const rulerKey = SIGN_RULER[h.sign]
                  const ruler = placed.find(p => p.key === rulerKey)
                  if (!ruler) return null
                  const from = lonXY(h.startLon, (HOUSE_INNER + HOUSE_OUTER) / 2)
                  const to = lonXY(ruler.lon, ruler.r)
                  return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="rgba(192,132,252,0.5)" strokeWidth={0.8} strokeDasharray="3,3" />
                })}
              </g>
            )}

            {/* ── "Select a profile" prompt (when nothing selected) ── */}
            {!hasSovereign && (
              <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
                fill="rgba(255,255,255,0.25)" fontSize={14}>
                Select a profile to see placements
              </text>
            )}
          </svg>

          {/* ── Tooltip ── */}
          {tooltip && (
            tooltip.zone ? (
              /* Rich zone popup — reuses ZoneTooltip from ZoneChip */
              <ZoneTooltipInline zone={tooltip.zone} sign={tooltip.sign} mouseX={tooltip.x} mouseY={tooltip.y} />
            ) : (
              /* Plain text tooltip for planets/angles */
              <div className="fixed z-50 pointer-events-none px-2 py-1 rounded bg-slate-800/95 border border-white/20 text-[10px] text-white/90 max-w-[260px] shadow-lg"
                style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}>
                {tooltip.text}
              </div>
            )
          )}

          {/* ── Toggle Buttons (only when profile selected) ── */}
          {hasSovereign && (
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={() => setShowAspects(!showAspects)}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showAspects ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                Aspects
              </button>
              <button onClick={() => setShowRulers(!showRulers)}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showRulers ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                House Rulers
              </button>
              <button onClick={() => setShowAsteroids(!showAsteroids)}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showAsteroids ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                Asteroids
              </button>
              <button onClick={() => setShowArabicParts(!showArabicParts)}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showArabicParts ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                Arabic Parts
              </button>
              <button onClick={() => { setSelectedHouseForLearning(0); setShowHouseLearning(true); }}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showHouseLearning ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                House Learn
              </button>
              <button onClick={() => setShowDegreeTheory(!showDegreeTheory)}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showDegreeTheory ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                Degree Theory
              </button>
              <button onClick={() => setShowSabianSymbols(!showSabianSymbols)}
                className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${showSabianSymbols ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'bg-slate-800/50 border-white/10 text-white/40 hover:text-white/60'}`}>
                Sabian Symbols
              </button>
            </div>
          )}
          {/* ── LAB Time Slider (only when LAB mode exploring) ── */}
          {labMode && labExploring && (
            <div className={`mt-4 mb-4 bg-slate-800/50 rounded-xl border border-purple-500/20 p-4${playbackActive ? ' opacity-50 pointer-events-none' : ''}`}>
              <div className="text-center mb-3">
                <div className="text-[10px] text-white/90 uppercase tracking-widest mb-1">Birth Time</div>
                <div className="text-3xl font-bold text-amber-300 font-mono">{minutesToTime(labTimeMinutes)}</div>
                {labCalculating && <div className="text-xs text-purple-400 animate-pulse mt-1">Recalculating chart...</div>}
              </div>
              <div className="relative px-2">
                <input
                  type="range"
                  min={0}
                  max={1439}
                  step={1}
                  value={labTimeMinutes}
                  onChange={e => handleLabTimeChange(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: '#a855f7',
                    background: `linear-gradient(to right, #1e1b4b 0%, #7c3aed ${(labTimeMinutes / 1439 * 100)}%, #334155 ${(labTimeMinutes / 1439 * 100)}%, #334155 100%)`
                  }}
                />
                <div className="flex justify-between text-[9px] text-white/80 mt-1 px-1">
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => handleLabTimeChange(Math.max(0, labTimeMinutes - 60))}
                  className="px-2 py-1 text-[10px] bg-slate-700 text-white/80 rounded hover:bg-slate-600 hover:text-white transition-colors">-1h</button>
                <button onClick={() => handleLabTimeChange(Math.max(0, labTimeMinutes - 15))}
                  className="px-2 py-1 text-[10px] bg-slate-700 text-white/80 rounded hover:bg-slate-600 hover:text-white transition-colors">-15m</button>
                <button onClick={() => handleLabTimeChange(Math.max(0, labTimeMinutes - 1))}
                  className="px-2 py-1 text-[10px] bg-slate-700 text-white/80 rounded hover:bg-slate-600 hover:text-white transition-colors">-1m</button>
                <button onClick={() => handleLabTimeChange(Math.min(1439, labTimeMinutes + 1))}
                  className="px-2 py-1 text-[10px] bg-slate-700 text-white/80 rounded hover:bg-slate-600 hover:text-white transition-colors">+1m</button>
                <button onClick={() => handleLabTimeChange(Math.min(1439, labTimeMinutes + 15))}
                  className="px-2 py-1 text-[10px] bg-slate-700 text-white/80 rounded hover:bg-slate-600 hover:text-white transition-colors">+15m</button>
                <button onClick={() => handleLabTimeChange(Math.min(1439, labTimeMinutes + 60))}
                  className="px-2 py-1 text-[10px] bg-slate-700 text-white/80 rounded hover:bg-slate-600 hover:text-white transition-colors">+1h</button>
              </div>
              <div className="text-center mt-2 text-[9px] text-white/70">Arrow keys: tap = 1 min, hold = accelerates</div>
            </div>
          )}
          {/* ── Playback Controls (Cassette Tape) ── */}
          {labMode && labExploring && (
            <PlaybackControls
              labBirthData={labBirthData}
              timezone={labResolvedTz?.zoneName || 'UTC'}
              labTimeMinutes={labTimeMinutes}
              onSetSovereign={setLabSovereign}
              onSnapTime={handleLabTimeChange}
              onSnapTimeRaw={snapTimeRaw}
              labCalculating={labCalculating}
              disabled={!labBirthData.birthDate || labBirthData.latitude == null}
              onPlaybackStateChange={(s) => setPlaybackActive(s === 'playing')}
            />
          )}
          {/* ── Birth Time Tuning Lab ── */}
          {labMode && labExploring && (
            <TuningLabPanel
              birthData={labBirthData}
              timezone={labResolvedTz?.zoneName || 'UTC'}
              currentLabMinutes={labTimeMinutes}
              onSnapTime={handleLabTimeChange}
              labCalculating={labCalculating}
            />
          )}
          {/* ── House Debug Info ── */}
          {hasSovereign && (
            <div className="text-[9px] text-white/30 text-center mt-1 font-mono">{housesDebug}</div>
          )}
        </div>{/* close wheel wrapper */}

        {/* ── Right Sidebar: Aspect Table Panel ── */}
        {hasSovereign && sovereign?.aspects?.length > 0 && (
          <div style={{ flexShrink: 0, width: showAspectPanel ? '280px' : 'auto', marginTop: '4px' }}>
            <button
              onClick={() => setShowAspectPanel(!showAspectPanel)}
              className="text-[9px] font-bold text-white/50 tracking-wider bg-slate-900/90 backdrop-blur-sm rounded-lg border border-white/10 px-2.5 py-1.5 hover:text-white/70 transition-colors cursor-pointer"
              style={{ width: showAspectPanel ? '100%' : 'auto', textAlign: 'left' }}
            >
              {showAspectPanel ? '▾' : '▸'} ASPECTS ({sovereign.aspects.length})
            </button>
            {showAspectPanel && (
              <div className="mt-1 bg-slate-900/92 backdrop-blur-sm rounded-lg border border-white/10 p-2" style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                <div className="grid gap-y-1 text-[10px]" style={{ gridTemplateColumns: 'auto auto auto auto auto 1fr' }}>
                  {sovereign.aspects.map((a, i) => {
                    const st = ASPECT_STYLE[a.aspect] || ASPECT_STYLE.conjunction
                    const strength = Math.max(0, Math.min(100, (a.exactness != null ? a.exactness * 100 : Math.max(0, 100 - (a.orb || 0) * 12.5))))
                    return (
                      <React.Fragment key={i}>
                        <span className="text-amber-200 text-center" style={{ width: 18 }}>{PLANET_SYM[a.planet1] || a.planet1}</span>
                        <span className="text-center" style={{ color: st.color, width: 18 }}>{st.sym}</span>
                        <span className="text-amber-200 text-center" style={{ width: 18 }}>{PLANET_SYM[a.planet2] || a.planet2}</span>
                        <span className="text-white/50 text-right pr-1" style={{ width: 38 }}>{a.orb != null ? `${a.orb.toFixed(1)}°` : ''}</span>
                        <span className="text-white/30 text-[8px]" style={{ width: 22 }}>{a.applying ? 'app' : 'sep'}</span>
                        <div className="flex items-center">
                          <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${strength}%`, backgroundColor: st.color }} />
                          </div>
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        </div>{/* close main flex container */}

        {/* ══════════════════════════════════════════════════════════════════
            HOUSE RULERS PANEL (Wide Format - Below Wheel)
           ══════════════════════════════════════════════════════════════════ */}
        {hasSovereign && houses.length > 0 && (
          <div className="mt-4 mx-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-4">
            <div className="text-sm font-bold text-cyan-400 mb-3 tracking-wider uppercase flex items-center gap-2">
              <span>🏠</span>
              <span>House Rulers</span>
              <span className="text-[10px] text-white/40 font-normal normal-case ml-2">— Where does the ruler of each house live?</span>
              <span className="text-[9px] text-purple-400/60 font-normal normal-case ml-auto">(Placidus)</span>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
              {houses.map(h => {
                const sign = h.sign
                if (!sign) return null
                const rulerKey = SIGN_RULER[sign]
                const ruler = pObj[rulerKey]
                if (!rulerKey) return null
                const rulerName = PLANET_NAME[rulerKey] || rulerKey
                const rulerSym = PLANET_SYM[rulerKey] || '?'
                const isRetro = ruler?.retrograde || ruler?.isRetrograde
                const rulerZone = ruler?.sign ? getZoneForPlacement(ruler.sign, ruler.degree || ruler.degreeInSign || 0) : null
                // Find aspects to this ruler (up to 3)
                const rulerAspects = aspects.filter(a => a.planet1 === rulerKey || a.planet2 === rulerKey).slice(0, 3)
                // Build aspect explanation text
                const aspectText = rulerAspects.map(a => {
                  const other = a.planet1 === rulerKey ? a.planet2 : a.planet1
                  const otherName = PLANET_NAME[other] || other
                  const aspectName = a.aspect || 'aspect'
                  return `${a.style?.sym || ''}${PLANET_SYM[other] || ''} = ${aspectName} ${otherName}`
                }).join(', ')
                return (
                  <div key={h.house} className="flex items-center text-[11px] py-1 px-2 bg-slate-800/50 rounded hover:bg-slate-800/70 transition-colors">
                    <span className="text-cyan-300 font-bold" style={{ width: 32 }}>H{h.house}</span>
                    <span className="text-white/60" style={{ width: 28 }}>{SIGN_GLYPHS[sign]}</span>
                    <span className="text-white/40 mr-2">Ruler is</span>
                    <span className={isRetro ? 'text-red-400' : 'text-amber-300'} style={{ fontSize: 13 }}>{rulerSym}</span>
                    <span className={`font-medium ml-1 ${isRetro ? 'text-red-400' : 'text-white/90'}`}>
                      {rulerName}{isRetro && <span className="text-red-400 text-[8px] font-bold ml-0.5">Retro</span>}
                    </span>
                    {ruler ? (
                      <>
                        <span className="text-white/40 ml-2">at</span>
                        <span className="text-white/90 ml-1">{ruler.degree != null ? `${ruler.degree.toFixed(0)}°` : ''}</span>
                        <span className="text-white/80 ml-1">{ruler.sign}</span>
                        {rulerZone && <span className="text-amber-400 ml-1">Zone {rulerZone.id}</span>}
                        {ruler.house && <span className="text-purple-300 ml-1">- House {ruler.house}</span>}
                        {rulerAspects.length > 0 && (
                          <span className="text-white/50 ml-3 text-[10px]" title={aspectText}>
                            {rulerAspects.map((a, i) => {
                              const other = a.planet1 === rulerKey ? a.planet2 : a.planet1
                              return <span key={i} className="mr-1">{a.style?.sym || ''}{PLANET_SYM[other] || ''}</span>
                            })}
                            <span className="text-white/30 ml-1">= {rulerAspects.map(a => {
                              const other = a.planet1 === rulerKey ? a.planet2 : a.planet1
                              return `${a.aspect} ${PLANET_NAME[other] || other}`
                            }).join(', ')}</span>
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-white/40 italic ml-2">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      )}

      {/* House Learning Panel - Floating/Draggable */}
      {showHouseLearning && (
        <HouseLearningPanel
          houseNumber={selectedHouseForLearning}
          onClose={() => setShowHouseLearning(false)}
          chartData={sovereign}
        />
      )}

      {/* Chart Sorted View - Floating/Draggable */}
      <ChartSortedView
        open={showSortedView}
        onClose={() => setShowSortedView(false)}
        planets={pObj}
        angles={angles}
        arabicParts={arabicParts}
        houseForLon={houseForLon}
        getLon={getLon}
        planetSym={PLANET_SYM}
        planetName={PLANET_NAME}
        asteroidKeys={ASTEROID_KEYS}
        fmtDeg={fmtDeg}
        getZone={getZoneForPlacement}
        houseArcs={houseArcs}
        signRuler={SIGN_RULER}
      />

      {/* ── Soul Journal Floating Button ── */}
      {(profile || (labMode && labExploring && labProfileId)) && !journalOpen && (
        <button
          onClick={() => setJournalOpen(true)}
          className="fixed z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-500/30 hover:border-amber-400/60 transition-all shadow-lg backdrop-blur-sm cursor-pointer"
          style={{ top: 12, right: 160 }}
          title="Open Soul Journal"
        >
          <span className="text-base">📝</span>
          <span>Journal</span>
        </button>
      )}

      {/* ── Soul Journal Floating Draggable Popup ── */}
      {journalOpen && createPortal(
        <div
          ref={journalDragRef}
          className="fixed z-50 flex flex-col bg-slate-900/98 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl"
          style={{
            left: journalPos.x,
            top: journalPos.y,
            width: 520,
            maxHeight: 'calc(100vh - 80px)',
            resize: 'both',
            overflow: 'hidden',
          }}
        >
          {/* Drag handle / header */}
          <div
            onMouseDown={handleJournalDragStart}
            className="flex items-center justify-between px-4 py-2.5 border-b border-amber-500/20 cursor-move select-none"
            style={{ background: 'rgba(217, 119, 6, 0.08)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <span className="text-sm font-bold text-amber-300">Soul Journal</span>
              <span className="text-[10px] text-white/40">
                {activeJournalProfile?.firstName} {activeJournalProfile?.lastName}
              </span>
            </div>
            <button
              onClick={() => setJournalOpen(false)}
              className="text-white/40 hover:text-white text-lg px-1 cursor-pointer"
              title="Close"
            >
              ×
            </button>
          </div>
          {/* NotesPanel content */}
          <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <NotesPanel
              profile={activeJournalProfile}
              notes={journalNotes}
              setNotes={setJournalNotes}
              recentCustomTags={journalRecentTags}
              setRecentCustomTags={setJournalRecentTags}
              notesSaving={journalSaving}
              notesSaved={journalSaved}
              handleSaveNotes={handleJournalSave}
              notesRef={journalNotesRef}
            />
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
