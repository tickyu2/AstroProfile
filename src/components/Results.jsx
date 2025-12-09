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
import { calculateFourPillars } from '../utils/fourPillarsCalculator'
import { calculateTenGods, getDayMaster, calculatePersonalityTraits, getTopTraits } from '../utils/tenGodsCalculations'

// Layout Components
import ResultsHeader from './results/layout/ResultsHeader'
import ProfileTitle from './results/layout/ProfileTitle'
import CompatibilityCTA from './results/layout/CompatibilityCTA'

// Panel Components
import BirthDetailsPanel from './results/BirthDetailsPanel'
import YearPillarPanel from './results/YearPillarPanel'
import WesternAstrologyPanel from './results/WesternAstrologyPanel'
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

    const westZodiac = calc.western || {}
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

    // Calculate Four Pillars data (for old panels)
    let fourPillars = calc.fourPillars || null

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

    // Create fourPillarsForDebug for seasonal panels
    const fourPillarsForDebug = fourPillars ? {
        ...fourPillars,
        pillars: fourPillars.pillars || {},
        elementalBalance: fourPillars.elementalBalance || {},
        yinYangBalance: fourPillars.yinYangBalance || {},
        dayMaster: fourPillars.dayMaster || {}
    } : null

    // 🔥 NEW! Calculate Ten Gods (十神) for deeper analysis
    const tenGods = fourPillars ? calculateTenGods(fourPillars) : null
    const dayMaster = fourPillars ? getDayMaster(fourPillars) : null

    // 🔥 NEW! Calculate personality traits from Ten Gods
    const personalityTraits = tenGods ? calculatePersonalityTraits(tenGods) : null
    const topTraits = personalityTraits ? getTopTraits(personalityTraits, 3) : null

    // 🎭 NEW! Determine personality archetype from elemental balance
    const archetype = fourPillars ? determineArchetypeFromFourPillars(fourPillars, tenGods) : null

    // 🔍 DEBUG: Log Ten Gods data
    if (tenGods) {
        console.log('🔍 [Results.jsx] Ten Gods calculated:', tenGods);
        console.log('🔍 [Results.jsx] Day Master:', dayMaster);
        console.log('🔍 [Results.jsx] Personality traits:', personalityTraits);
        console.log('🔍 [Results.jsx] Top traits:', topTraits);
    }

    // 🔍 DEBUG: Log archetype data
    if (archetype) {
        console.log('🎭 [Results.jsx] Personality Archetype:', archetype.name, archetype.symbol);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Top Navigation */}
            <ResultsHeader
                currentUser={currentUser}
                handleLogout={handleLogout}
                handleRefresh={handleRefresh}
                refreshing={refreshing}
                profileId={profileId}
            />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <ProfileTitle profile={profile} />

                {/* Panels Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Panel 1: Birth Details */}
                    <BirthDetailsPanel
                        profile={profile}
                        age={age}
                    />

                    {/* Panel 2: Year Pillar (Chinese Zodiac) */}
                    <YearPillarPanel
                        profile={profile}
                        chinese={chinese}
                        zodiacProfile={zodiacProfile}
                    />

                    {/* Panel 3: Western Astrology */}
                    <WesternAstrologyPanel
                        westZodiac={westZodiac}
                    />

                    {/* Panel 4: Planetary Ruler */}
                    <PlanetaryRulerPanel
                        dayInfo={dayInfo}
                    />

                    {/* Panel 5: Yin/Yang Balance */}
                    <YinYangPanel
                        profile={profile}
                        yinYangData={yinYangData}
                    />

                    {/* Panel 6: The 7 Constitutional Battles */}
                    <SevenBattlesPanel
                        profile={profile}
                        yinYang={yinYangData}
                    />

                    {/* Panel 7: Numerology */}
                    <NumerologyPanel
                        numerology={numerology}
                    />

                    {/* Panel 8: MBTI Personality */}
                    <MBTIPanel
                        mbti={profile.mbti}
                        profile={profile}
                    />

                    {/* Panel 9: Big 5 Personality (OCEAN) */}
                    <Big5Panel
                        big5={profile.big5}
                        profile={profile}
                    />

                    {/* Panel 10: Four Pillars - Old Version (Optional - can be removed later) */}
                    {fourPillars && (
                        <div className="lg:col-span-2">
                            <FourPillarsPanel
                                profile={profile}
                                fourPillars={{
                                    year: fourPillars.pillars.year,
                                    month: fourPillars.pillars.month,
                                    day: fourPillars.pillars.day,
                                    hour: fourPillars.pillars.hour,
                                    elementBalance: fourPillars.elementalBalance?.elements || {},
                                    yinYangBalance: {
                                        yin: fourPillars.yinYangBalance?.yinPercentage || 0,
                                        yang: fourPillars.yinYangBalance?.yangPercentage || 0
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* 🔥 NEW! Panel 11: COMPLETE BAZI PANEL - FULL WIDTH! */}
                    {profile.birthDate && profile.birthTime && (
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-1 rounded-2xl">
                                <BaZiPanel
                                    birthDate={new Date(profile.birthDate)}
                                    birthTime={profile.birthTime}
                                    locationData={profile.locationData}
                                />
                            </div>
                        </div>
                    )}

                    {/* 🎭 NEW! Panel 12: PERSONALITY ARCHETYPE - FULL WIDTH! */}
                    {archetype && (
                        <div className="lg:col-span-2">
                            <ArchetypePanel
                                archetype={archetype}
                                profile={profile}
                            />
                        </div>
                    )}

                    {/* 🔥 NEW! Panel 13: TEN GODS (十神) ANALYSIS - FULL WIDTH! */}
                    <div className="lg:col-span-2">
                        <TenGodsPanel
                            tenGods={tenGods}
                            dayMaster={dayMaster}
                            profile={profile}
                            personalityTraits={personalityTraits}
                            topTraits={topTraits}
                        />
                    </div>

                    {/* TEMPORARILY DISABLED - OLD PANEL WITH CALCULATION ERRORS
                    Panel 12: Seasonal Strength Panel - FULL WIDTH!
                    {fourPillarsForDebug && (
                        <div className="lg:col-span-2">
                            <SeasonalStrengthPanel
                                fourPillars={fourPillarsForDebug}
                                profile={profile}
                            />
                        </div>
                    )}
                    */}

                    {/* TEMPORARILY DISABLED - OLD DEBUG PANEL
                    Panel 13: Seasonal Debug Panel - FULL WIDTH! (Can be hidden in production)
                    {fourPillarsForDebug && process.env.NODE_ENV === 'development' && (
                        <div className="lg:col-span-2">
                            <SeasonalDebugPanel
                                fourPillars={fourPillarsForDebug}
                                profile={profile}
                            />
                        </div>
                    )}
                    */}
                </div>

                {/* Notes Section */}
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
