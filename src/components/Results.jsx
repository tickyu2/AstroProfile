import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../contexts/ProfileContext'
import LoadingSpinner from './layout/LoadingSpinner'
import { calculateYinYang, getBattleWeights, getBattleMetadata } from '../utils/calculations'
import { getZodiacProfile } from '../data/chineseZodiacKnowledge'
import { calculateFourPillars } from '../utils/fourPillarsCalculator' // ← NEW! Calculate Four Pillars!

// Panel Components
import BirthDetailsPanel from './results/BirthDetailsPanel'
import YearPillarPanel from './results/YearPillarPanel'
import WesternAstrologyPanel from './results/WesternAstrologyPanel'
import PlanetaryRulerPanel from './results/PlanetaryRulerPanel'
import YinYangPanel from './results/YinYangPanel'
import NumerologyPanel from './results/NumerologyPanel'
import NotesPanel from './results/NotesPanel'
import FourPillarsPanel from './results/FourPillarsPanel'

export default function Results() {
    const { profileId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { currentUser, logout } = useAuth()
    const { updateProfile } = useProfiles()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Notes feature state
    const [notes, setNotes] = useState('')
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
            await updateProfile(profileId, { notes })
            setNotesSaved(true)
            setTimeout(() => setNotesSaved(false), 3000)
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

    // Extract data from profile calculations (already calculated during profile creation)
    const calc = profile.calculations || {}
    const yinYangData = calc.yinYang || calculateYinYang(profile)
    const chinese = calc.chinese || {}
    const westZodiac = calc.western || {}
    const dayInfo = calc.dayOfWeek || {}
    const numerology = calc.numerology || {}
    const age = calc.age || {}
    
    // Get rich Chinese Zodiac profile from knowledge database
    const zodiacProfile = (chinese.animal && chinese.element) 
        ? getZodiacProfile(chinese.animal, chinese.element)
        : null

    // Calculate Four Pillars data NOW! 🚀
    let fourPillars = calc.fourPillars || null
    
    // If not in calculations, calculate it now!
    if (!fourPillars && profile.birthDate && profile.birthTime) {
        try {
            // Convert birthDate string to Date object
            const birthDateObj = new Date(profile.birthDate)
            
            fourPillars = calculateFourPillars(
                birthDateObj,  // Now passing Date object, not string!
                profile.birthTime,
                profile.location?.lat || 0,
                profile.location?.lng || 0
            )
            console.log('✅ Four Pillars calculated:', fourPillars)
        } catch (error) {
            console.error('❌ Error calculating Four Pillars:', error)
            fourPillars = null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <div className="bg-slate-900/80 backdrop-blur-lg border-b border-amber-500/30 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">✨</span>
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                            AstroProfile
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                        >
                            ← Dashboard
                        </button>
                        <span className="text-white/60">|</span>
                        <span className="text-white/80">{currentUser?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-2">
                        ✨ {profile.name}'s Cosmic Blueprint ✨
                    </h1>
                    <p className="text-white/60 text-lg">
                        Born {new Date(profile.birthDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>

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

                    {/* Panel 6: Numerology */}
                    <NumerologyPanel 
                        numerology={numerology}
                    />

                    {/* Panel 7: Four Pillars - FULL WIDTH! 🚀 */}
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
                </div>

                {/* Notes Section */}
                <NotesPanel
                    notes={notes}
                    setNotes={setNotes}
                    notesSaving={notesSaving}
                    notesSaved={notesSaved}
                    handleSaveNotes={handleSaveNotes}
                    notesRef={notesRef}
                />

                {/* Footer CTA */}
                <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 text-center fade-in delay-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Go Deeper?</h3>
                    <p className="text-white/80 mb-4">
                        This is just the surface. Unlock your complete cosmic analysis, compatibility reports, and AI-powered insights.
                    </p>
                    <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg">
                        Get Your Full Report 🚀
                    </button>
                </div>
            </div>
        </div>
    )
}
