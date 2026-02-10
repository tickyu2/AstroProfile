import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../contexts/ProfileContext'
import LoadingSpinner from './layout/LoadingSpinner'
import { calculateYinYang, getBattleWeights, getBattleMetadata, getChineseZodiac } from '../utils/calculations'
import { getZodiacProfile } from '../data/chineseZodiacKnowledge'
import { calculateFourPillars } from '../utils/baziCalculator'
import { calculateTenGods, getDayMaster, calculatePersonalityTraits, getTopTraits } from '../utils/tenGodsCalculations'

// Layout Components
import ResultsHeader from './results/layout/ResultsHeader'
import CompatibilityCTA from './results/layout/CompatibilityCTA'

// Tab Navigation
import OverviewTab from './tabs/OverviewTab'

// Panel Components
import BirthDetailsPanel from './results/BirthDetailsPanel'
import YearPillarPanel from './results/YearPillarPanel'
import WesternAstrologyPanel from './results/WesternAstrologyPanel'
import PsychologicalProfilePanel from './results/PsychologicalProfilePanel'
import PlanetaryRulerPanel from './results/PlanetaryRulerPanel'
import YinYangPanel from './results/YinYangPanel'
import NumerologyPanel from './results/NumerologyPanel'
import NotesPanel from './results/NotesPanel'
import FourPillarsPanel from './results/FourPillarsPanel'
import MBTIPanel from './results/MBTIPanel'
import Big5Panel from './results/Big5Panel'
import SevenBattlesPanel from './results/SevenBattlesPanel'
import SeasonalDebugPanel from './results/SeasonalDebugPanel'
import SeasonalStrengthPanel from './results/SeasonalStrengthPanel'
import TenGodsPanel from './results/TenGodsPanel'
import ArchetypePanel from './results/ArchetypePanel'

// 🔥 NEW! THE COMPLETE BAZI PANEL WITH SOUL!
import BaZiPanel from './bazi/BaZiPanel'

// 🎭 NEW! ARCHETYPE MAPPING
import { determineArchetypeFromFourPillars } from '../utils/archetypeMapper'

// 🧬 NEW! SOULDNA ENCODING
import { generateSoulDNA, decodeSoulDNA } from '../utils/soulDNAEncoder'
import SoulDNADisplay from './results/SoulDNADisplay'

// 🌹 NEW! MBTI ROSE WINDOW - Notre-Dame Masterpiece
import { MBTIRoseWindow } from './mbti'

// ⚗️ NEW! ENNEAGRAM ALCHEMICAL ROSE
import { EnneagramTab } from './enneagram'

// ⭐ NEW! WESTERN ZODIAC 36-CUSP SYSTEM - Father Ticky's Model
import { WesternZodiacSection } from './westernZodiac'

// 🌙 NEW! REAL-TIME MOON PHASE WIDGET
import MoonPhaseWidget from './common/MoonPhaseWidget'

// ═══════════════════════════════════════════════════════════════════════════
// PYTHON-FIRST HELPERS: Convert canonical schema to legacy format
// ═══════════════════════════════════════════════════════════════════════════
const STEM_ELEMENTS = {
    Jia: 'Wood', Yi: 'Wood',
    Bing: 'Fire', Ding: 'Fire',
    Wu: 'Earth', Ji: 'Earth',
    Geng: 'Metal', Xin: 'Metal',
    Ren: 'Water', Gui: 'Water'
}

const STEM_POLARITIES = {
    Jia: 'Yang', Bing: 'Yang', Wu: 'Yang', Geng: 'Yang', Ren: 'Yang',
    Yi: 'Yin', Ding: 'Yin', Ji: 'Yin', Xin: 'Yin', Gui: 'Yin'
}

const BRANCH_ANIMALS = {
    Zi: 'Rat', Chou: 'Ox', Yin: 'Tiger', Mao: 'Rabbit',
    Chen: 'Dragon', Si: 'Snake', Wu: 'Horse', Wei: 'Goat',
    Shen: 'Monkey', You: 'Rooster', Xu: 'Dog', Hai: 'Pig'
}

const BRANCH_ELEMENTS = {
    Zi: 'Water', Chou: 'Earth', Yin: 'Wood', Mao: 'Wood',
    Chen: 'Earth', Si: 'Fire', Wu: 'Fire', Wei: 'Earth',
    Shen: 'Metal', You: 'Metal', Xu: 'Earth', Hai: 'Water'
}

const getElementFromStem = (stem) => STEM_ELEMENTS[stem] || 'Unknown'
const getPolarityFromStem = (stem) => STEM_POLARITIES[stem] || 'Unknown'
const getBranchAnimal = (branch) => BRANCH_ANIMALS[branch] || 'Unknown'
const getElementFromBranch = (branch) => BRANCH_ELEMENTS[branch] || 'Unknown'

export default function Results() {
    const { profileId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { currentUser, logout } = useAuth()
    const { updateProfile } = useProfiles()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    // Notes feature state
    const [notes, setNotes] = useState('')
    const [recentCustomTags, setRecentCustomTags] = useState([])
    const [notesSaving, setNotesSaving] = useState(false)
    const [notesSaved, setNotesSaved] = useState(false)
    const notesRef = useRef(null)

    // Tab navigation state - check location state for initial tab
    const [activeTab, setActiveTab] = useState(
        location.state?.activeTab || 'overview'
    )

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Failed to log out:', error)
        }
    }

    // Force refresh from database
    const handleRefresh = async () => {
        try {
            setRefreshing(true)
            const profileRef = doc(db, 'profiles', profileId)
            const profileSnap = await getDoc(profileRef)

            if (profileSnap.exists()) {
                const profileData = {
                    id: profileSnap.id,
                    ...profileSnap.data()
                }
                setProfile(profileData)
                setNotes(profileData.notes || '')
                setRecentCustomTags(profileData.recentCustomTags || [])
                console.log('✅ Profile refreshed from database!')
                console.log('🏷️ [DEBUG] Loaded custom tags from Firebase:', profileData.recentCustomTags || [])
            }
        } catch (error) {
            console.error('Error refreshing profile:', error)
            alert('Failed to refresh. Please try again.')
        } finally {
            setRefreshing(false)
        }
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true)
                const profileRef = doc(db, 'profiles', profileId)
                const profileSnap = await getDoc(profileRef)

                if (!profileSnap.exists()) {
                    setError('Profile not found')
                    return
                }

                const profileData = {
                    id: profileSnap.id,
                    ...profileSnap.data()
                }

                // Validate ownership
                if (profileData.userId !== currentUser?.uid) {
                    setError('You do not have permission to view this profile')
                    return
                }

                setProfile(profileData)
                setNotes(profileData.notes || '')
                setRecentCustomTags(profileData.recentCustomTags || [])
                console.log('🏷️ [DEBUG] Initial load - custom tags from Firebase:', profileData.recentCustomTags || [])

            } catch (err) {
                console.error('Error loading profile:', err)
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        if (currentUser && profileId) {
            loadProfile()
        }
    }, [profileId, currentUser])

    const handleSaveNotes = async () => {
        try {
            setNotesSaving(true)
            await updateProfile(profileId, {
                notes,
                recentCustomTags
            })
            setNotesSaved(true)
            setTimeout(() => setNotesSaved(false), 3000)
            console.log('💾 [DEBUG] Saved notes and custom tags to Firebase')
        } catch (error) {
            console.error('Error saving notes:', error)
            alert('Failed to save notes. Please try again.')
        } finally {
            setNotesSaving(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-white mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    if (!profile) {
        return null
    }

    // Extract data from profile calculations
    const calc = profile.calculations || {}
    const yinYangData = calc.yinYang || calculateYinYang(profile)

    // 🔧 FIX: Recalculate Chinese zodiac if bornBeforeLiChun is missing (for old profiles)
    let chinese = calc.chinese || {}
    if (profile.birthDate && chinese.bornBeforeLiChun === undefined) {
        console.log('🔧 [Results.jsx] bornBeforeLiChun missing, recalculating Chinese zodiac...');
        chinese = getChineseZodiac(profile.birthDate);
        console.log('🔧 [Results.jsx] Recalculated chinese:', chinese);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PYTHON-FIRST: Use canonical path profile.western first, fallback to legacy
    // ═══════════════════════════════════════════════════════════════════════════
    const westZodiac = (() => {
        // CANONICAL PATH: profile.western (Python-computed)
        if (profile.western?.sun) {
            console.log('[Results.jsx] ✅ Using canonical path profile.western')
            // Map canonical schema to expected format for WesternAstrologyPanel
            return {
                sign: profile.western.sun.sign,
                sovereignCalculation: {
                    sun: profile.western.sun,
                    moon: profile.western.moon,
                    rising: profile.western.ascendant,
                    ascendant: profile.western.ascendant,
                    midheaven: profile.western.midheaven,
                    planets: profile.western.planets,
                    houses: profile.western.houses,
                    houseSystem: profile.western.houseSystem,
                    aspects: profile.western.aspects,
                    elementBalance: profile.western.elements,
                    moonPhase: profile.western.moonPhase
                }
            }
        }
        // LEGACY PATH: profile.calculations.western
        console.log('[Results.jsx] ⚠️ Using legacy path profile.calculations.western')
        return calc.western || {}
    })()
    const dayInfo = calc.dayOfWeek || {}
    const numerology = calc.numerology || {}
    const age = calc.age || {}


	const zodiacProfile = (chinese.animal && chinese.element)
    ? {
        ...getZodiacProfile(chinese.animal, chinese.element),
        year: chinese.year,  // Add BaZi year
        bornBeforeLiChun: chinese.bornBeforeLiChun,  // For education
        liChunDate: chinese.liChunDate  // For explanation
      }
    : null

    // 🔍 DEBUG: Log chinese and zodiacProfile data
    console.log('🔍 [Results.jsx] chinese:', chinese);
    console.log('🔍 [Results.jsx] zodiacProfile:', zodiacProfile);

    // ═══════════════════════════════════════════════════════════════════════════
    // PYTHON-FIRST: Use canonical path profile.bazi first, fallback to legacy
    // ═══════════════════════════════════════════════════════════════════════════
    let fourPillars = null
    let tenGods = null
    let dayMaster = null
    let usingCanonicalBazi = false

    // CANONICAL PATH: profile.bazi (Python-computed)
    if (profile.bazi?.pillars && profile.bazi?.dayMaster) {
        console.log('[Results.jsx] ✅ Using canonical path profile.bazi')
        usingCanonicalBazi = true

        // Transform canonical schema to legacy format for backward compatibility
        const baziPillars = profile.bazi.pillars
        fourPillars = {
            year: baziPillars.year ? {
                stem: { name: baziPillars.year.stem, chinese: baziPillars.year.stemChinese, element: getElementFromStem(baziPillars.year.stem), polarity: getPolarityFromStem(baziPillars.year.stem) },
                branch: { animal: getBranchAnimal(baziPillars.year.branch), chinese: baziPillars.year.branchChinese, element: getElementFromBranch(baziPillars.year.branch) }
            } : null,
            month: baziPillars.month ? {
                stem: { name: baziPillars.month.stem, chinese: baziPillars.month.stemChinese, element: getElementFromStem(baziPillars.month.stem), polarity: getPolarityFromStem(baziPillars.month.stem) },
                branch: { animal: getBranchAnimal(baziPillars.month.branch), chinese: baziPillars.month.branchChinese, element: getElementFromBranch(baziPillars.month.branch) }
            } : null,
            day: baziPillars.day ? {
                stem: { name: baziPillars.day.stem, chinese: baziPillars.day.stemChinese, element: getElementFromStem(baziPillars.day.stem), polarity: getPolarityFromStem(baziPillars.day.stem) },
                branch: { animal: getBranchAnimal(baziPillars.day.branch), chinese: baziPillars.day.branchChinese, element: getElementFromBranch(baziPillars.day.branch) }
            } : null,
            hour: baziPillars.hour ? {
                stem: { name: baziPillars.hour.stem, chinese: baziPillars.hour.stemChinese, element: getElementFromStem(baziPillars.hour.stem), polarity: getPolarityFromStem(baziPillars.hour.stem) },
                branch: { animal: getBranchAnimal(baziPillars.hour.branch), chinese: baziPillars.hour.branchChinese, element: getElementFromBranch(baziPillars.hour.branch) }
            } : null,
            elementBalance: {
                Wood: Math.round((profile.bazi.elements?.Wood || 0) * 100),
                Fire: Math.round((profile.bazi.elements?.Fire || 0) * 100),
                Earth: Math.round((profile.bazi.elements?.Earth || 0) * 100),
                Metal: Math.round((profile.bazi.elements?.Metal || 0) * 100),
                Water: Math.round((profile.bazi.elements?.Water || 0) * 100)
            },
            yinYangBalance: { yang: 50, yin: 50 } // Default, update if available
        }

        // Use canonical dayMaster directly
        dayMaster = {
            displayName: profile.bazi.dayMaster.stem,
            pinyin: profile.bazi.dayMaster.stem,
            element: profile.bazi.dayMaster.element,
            polarity: profile.bazi.dayMaster.yinYang,
            strength: profile.bazi.dayMaster.strength
        }

        // Use canonical tenGods if available
        if (profile.bazi.tenGods && Array.isArray(profile.bazi.tenGods)) {
            tenGods = {
                pillars: {
                    year: profile.bazi.tenGods.find(tg => tg.pillar === 'year') || null,
                    month: profile.bazi.tenGods.find(tg => tg.pillar === 'month') || null,
                    day: profile.bazi.tenGods.find(tg => tg.pillar === 'day') || null,
                    hour: profile.bazi.tenGods.find(tg => tg.pillar === 'hour') || null
                }
            }
        }
    }
    // LEGACY PATH: profile.calculations.fourPillars or recalculate
    else {
        console.log('[Results.jsx] ⚠️ Using legacy path for BaZi')
        fourPillars = calc.fourPillars || null

        if (!fourPillars && profile.birthDate && profile.birthTime) {
            try {
                const birthDateObj = new Date(profile.birthDate)

                fourPillars = calculateFourPillars(
                    birthDateObj,
                    profile.birthTime,
                    profile.locationData
                )
            } catch (error) {
                console.error('Error calculating Four Pillars:', error)
            }
        }

        // Calculate Ten Gods and Day Master from legacy data
        tenGods = fourPillars ? calculateTenGods(fourPillars) : null
        dayMaster = fourPillars ? getDayMaster(fourPillars) : null
    }

    // Create fourPillarsForDebug for seasonal panels
    const fourPillarsForDebug = fourPillars ? {
        ...fourPillars,
        pillars: fourPillars.pillars || {},
        elementalBalance: fourPillars.elementalBalance || fourPillars.elementBalance || {},
        yinYangBalance: fourPillars.yinYangBalance || {},
        dayMaster: fourPillars.dayMaster || dayMaster || {}
    } : null

    // Calculate personality traits from Ten Gods (works for both paths)
    const personalityTraits = tenGods ? calculatePersonalityTraits(tenGods) : null
    const topTraits = personalityTraits ? getTopTraits(personalityTraits, 3) : null

    // Determine personality archetype from elemental balance
    const archetype = fourPillars ? determineArchetypeFromFourPillars(fourPillars, tenGods) : null

    // 🔍 DEBUG: Log BaZi data source
    console.log(`🔍 [Results.jsx] BaZi source: ${usingCanonicalBazi ? 'CANONICAL (profile.bazi)' : 'LEGACY (recalculated)'}`);
    if (tenGods) {
        console.log('🔍 [Results.jsx] Ten Gods:', tenGods);
        console.log('🔍 [Results.jsx] Day Master:', dayMaster);
        console.log('🔍 [Results.jsx] Personality traits:', personalityTraits);
        console.log('🔍 [Results.jsx] Top traits:', topTraits);
    }

    // 🔍 DEBUG: Log archetype data
    if (archetype) {
        console.log('🎭 [Results.jsx] Personality Archetype:', archetype.name, archetype.symbol);
    }

    // 🧬 NEW! Generate SoulDNA code
    const soulDNA = fourPillars ? generateSoulDNA(fourPillars, tenGods) : null
    const decodedDNA = soulDNA ? decodeSoulDNA(soulDNA) : null

    // 🔍 DEBUG: Log SoulDNA
    if (soulDNA) {
        console.log('🧬 [Results.jsx] SoulDNA:', soulDNA);
        console.log('🧬 [Results.jsx] Decoded:', decodedDNA);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Combined Header + Tabs - SESSION 5.3 OPTIMIZATION ✅ */}
            <ResultsHeader
                currentUser={currentUser}
                handleLogout={handleLogout}
                handleRefresh={handleRefresh}
                refreshing={refreshing}
                profileId={profileId}
                profile={profile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="min-h-screen">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <OverviewTab
                        profile={profile}
                        chinese={chinese}
                        westZodiac={westZodiac}
                        numerology={numerology}
                        fourPillars={fourPillars}
                        archetype={archetype}
                        onNavigateToTab={setActiveTab}
                    />
                )}

                {/* BaZi Tab - FULL SACRED SPACE */}
                {activeTab === 'bazi' && (
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="space-y-6">
                            {/* BaZi Complete Panel */}
                            {profile.birthDate && profile.birthTime && (
                                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-1 rounded-2xl">
                                    <BaZiPanel
                                        birthDate={new Date(profile.birthDate)}
                                        birthTime={profile.birthTime}
                                        locationData={profile.locationData}
                                    />
                                </div>
                            )}

                            {/* Year Pillar (Chinese Zodiac) */}
                            <YearPillarPanel
                                profile={profile}
                                chinese={chinese}
                                zodiacProfile={zodiacProfile}
                            />

                            {/* Archetype Panel */}
                            {archetype && (
                                <ArchetypePanel
                                    archetype={archetype}
                                    profile={profile}
                                />
                            )}

                            {/* Ten Gods Analysis */}
                            <TenGodsPanel
                                tenGods={tenGods}
                                dayMaster={dayMaster}
                                profile={profile}
                                personalityTraits={personalityTraits}
                                topTraits={topTraits}
                            />

                            {/* SoulDNA Display */}
                            {soulDNA && (
                                <SoulDNADisplay
                                    soulDNA={soulDNA}
                                    decodedDNA={decodedDNA}
                                />
                            )}

                            {/* Yin/Yang Balance */}
                            <YinYangPanel
                                profile={profile}
                                yinYangData={yinYangData}
                            />

                            {/* Seven Battles */}
                            <SevenBattlesPanel
                                profile={profile}
                                yinYang={yinYangData}
                            />
                        </div>
                    </div>
                )}

                {/* MBTI Tab - ROSE WINDOW SACRED SPACE ✨ */}
                {activeTab === 'mbti' && (
                    <div className="w-full">
                        <MBTIRoseWindow profile={profile} />
                    </div>
                )}

                {/* Enneagram Tab - ALCHEMICAL ROSE ⚗️ */}
                {activeTab === 'enneagram' && (
                    <div className="w-full">
                        <EnneagramTab
                            profile={profile}
                            onProfileUpdate={handleRefresh}
                        />
                    </div>
                )}

                {/* Western Tab */}
                {activeTab === 'western' && (
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="space-y-6">
                            {/* 🌙 NEW! Real-Time Moon Phase Widget */}
                            <MoonPhaseWidget
                                sunSign={westZodiac?.sign}
                                moonSign={westZodiac?.sovereignCalculation?.moon?.sign}
                                showUpcoming={true}
                                showGuidance={true}
                            />

                            {/* ⭐ NEW! Western Zodiac 36-Cusp System */}
                            <WesternZodiacSection birthDate={profile.birthDate} userName={profile.displayName || profile.firstName} />

                            {/* Existing Western Panels */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <BirthDetailsPanel
                                    profile={profile}
                                    age={age}
                                />
                                <WesternAstrologyPanel
                                    westZodiac={westZodiac}
                                    profileId={profileId}
                                    onRecalculate={handleRefresh}
                                />
                                <PsychologicalProfilePanel
                                    westZodiac={westZodiac}
                                    profile={profile}
                                />
                                <PlanetaryRulerPanel
                                    dayInfo={dayInfo}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Numerology Tab */}
                {activeTab === 'numerology' && (
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <NumerologyPanel
                            numerology={numerology}
                            profileId={profileId}
                        />
                    </div>
                )}
            </div>

            {/* Notes Section - Always Visible at Bottom */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <NotesPanel
                    profile={profile}
                    notes={notes}
                    setNotes={setNotes}
                    recentCustomTags={recentCustomTags}
                    setRecentCustomTags={setRecentCustomTags}
                    notesSaving={notesSaving}
                    notesSaved={notesSaved}
                    handleSaveNotes={handleSaveNotes}
                    notesRef={notesRef}
                />

                {/* SoulPartner Compatibility CTA */}
                <CompatibilityCTA />
            </div>
        </div>
    )
}
