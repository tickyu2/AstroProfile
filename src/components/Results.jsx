import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../contexts/ProfileContext'
import LoadingSpinner from './layout/LoadingSpinner'
import { getZodiacProfile } from '../data/chineseZodiacKnowledge'
import { yinYangTheory } from '../data/yinYangTheory'
import { calculateYinYang, getBattleWeights, getBattleMetadata } from '../utils/calculations'
import EnhancedChineseZodiacPanel from './EnhancedChineseZodiacPanel'

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
    
    // Calculation breakdown panels
    const [showYinYangBreakdown, setShowYinYangBreakdown] = useState(false)
    
    // Theory expansion state (tracks which factor's theory is currently expanded)
    const [expandedFactorTheory, setExpandedFactorTheory] = useState(null)
    
    // Toggle theory expansion for a specific factor
    const toggleFactorTheory = (factorIndex) => {
        setExpandedFactorTheory(expandedFactorTheory === factorIndex ? null : factorIndex)
    }
    
    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Failed to log out:', error)
        }
    }

    // Helper function to get theory content for a specific factor
    const getFactorTheory = (factor, profileData) => {
        if (!factor || !factor.name) return null
        
        const factorName = factor.name
        
        // Map factor names to theory categories and keys
        if (factorName.includes('Chinese Animal')) {
            const animal = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.chineseAnimals[animal]
        }
        
        if (factorName.includes('Chinese Element')) {
            const element = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.chineseElements[element]
        }
        
        if (factorName.includes('Western Sign')) {
            const sign = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.westernSigns[sign]
        }
        
        if (factorName.includes('Western Element')) {
            const element = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.westernElements[element]
        }
        
        if (factorName.includes('Birth Day')) {
            // Extract day and planet from patterns like:
            // "Birth Day (Tuesday - Mars)" or "Birth Day (undefined - Mercury)"
            const match = factorName.match(/\((.*?)\s*-\s*(.*?)\)/)
            
            if (match) {
                const dayName = match[1]?.trim()
                const planetName = match[2]?.trim()
                
                // If day name is "undefined" or missing, map by planet name
                if (!dayName || dayName === 'undefined') {
                    const planetToDayMap = {
                        'Sun': 'Sunday',
                        'Moon': 'Monday',
                        'Mars': 'Tuesday',
                        'Mercury': 'Wednesday',
                        'Jupiter': 'Thursday',
                        'Venus': 'Friday',
                        'Saturn': 'Saturday'
                    }
                    const mappedDay = planetToDayMap[planetName]
                    if (mappedDay && yinYangTheory.planetaryDays[mappedDay]) {
                        return yinYangTheory.planetaryDays[mappedDay]
                    }
                } else if (yinYangTheory.planetaryDays[dayName]) {
                    // Use day name directly if it's valid
                    return yinYangTheory.planetaryDays[dayName]
                }
            }
        }
        
        if (factorName.includes('Gender')) {
            const gender = factorName.match(/\((.*?)\)/)?.[1]
            if (gender) {
                // Capitalize first letter to match theory keys (Male, Female)
                const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
                return yinYangTheory.gender[capitalizedGender]
            }
        }
        
        if (factorName.includes('Birth Time')) {
            const timeType = factorName.match(/\((.*?)\s*-/)?.[1]
            if (timeType?.toLowerCase().includes('day')) return yinYangTheory.birthTime.Day
            if (timeType?.toLowerCase().includes('night')) return yinYangTheory.birthTime.Night
            return yinYangTheory.birthTime.Transition
        }
        
        return null
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

                setProfile({ id: profileSnap.id, ...profileSnap.data() })
            } catch (err) {
                console.error('Error loading profile:', err)
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        if (profileId) {
            loadProfile()
        }
    }, [profileId])

    // Sync notes from profile and handle scroll to notes
    useEffect(() => {
        if (profile) {
            setNotes(profile.notes || '')
        }
    }, [profile])

    // Scroll to notes section if URL hash is #notes
    useEffect(() => {
        if (location.hash === '#notes' && notesRef.current && !loading) {
            setTimeout(() => {
                notesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
        }
    }, [location.hash, loading])

    // Handle saving notes
    const handleSaveNotes = async () => {
        try {
            setNotesSaving(true)
            await updateProfile(profileId, { notes })
            setProfile(prev => ({ ...prev, notes }))
            setNotesSaved(true)
            setTimeout(() => setNotesSaved(false), 2000)
        } catch (err) {
            console.error('Error saving notes:', err)
            alert('Failed to save notes: ' + err.message)
        } finally {
            setNotesSaving(false)
        }
    }

    if (loading) return <LoadingSpinner />

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
                <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-500/30 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-4">{error || 'Profile not found'}</h2>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const data = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthDate: profile.birthDate,
        birthTime: profile.birthTime,
        birthCity: profile.location?.city || profile.birthCity,
        birthCountry: profile.location?.country || profile.birthCountry,
        mbti: profile.mbti
    }
    const calc = profile.calculations
    const { age, chinese, western, dayOfWeek, yinYang, numerology } = calc

    // Get rich Chinese Zodiac profile from knowledge database
    const zodiacProfile = getZodiacProfile(chinese.animal, chinese.element)

    const [year, month, day] = data.birthDate.split('-').map(Number)
    const birthDate = new Date(year, month - 1, day)
    const shortDate = `${month}/${day}/${year}`

    const zodiacEmojis = {
        'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇', 'Dragon': '🐉', 'Snake': '🐍',
        'Horse': '🐴', 'Goat': '🐐', 'Monkey': '🐵', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐖',
        'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 'Leo': '♌', 'Virgo': '♍',
        'Libra': '♎', 'Scorpio': '♏', 'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    }

    // Rich personality descriptions
    const chinesePersonality = {
        'Rabbit': 'You are a gentle soul who seeks harmony above all. Peace and beauty matter deeply to you - conflict feels like nails on a chalkboard. Your artistic nature and diplomatic grace help you navigate life smoothly, creating sanctuary wherever you go.',
        'Ox': 'You are the reliable rock everyone leans on. Methodical, patient, and impossibly strong - you achieve through steady persistence what others attempt through flashy shortcuts. Tradition and honesty form your unshakeable foundation.',
        'Tiger': 'You are a natural born leader who thrives on challenge. Brave, magnetic, and competitive - you inspire others with your fearless approach to life. Risk excites you; boredom is your enemy. You were born to conquer.',
        'Dragon': 'You are charismatic power incarnate. Ambitious, visionary, and larger than life - you expect excellence and usually deliver it. Your natural magnetism draws people into your orbit. You were meant to lead.',
        'Snake': 'You are wisdom wrapped in mystery. Intuitive, calculating, and elegant - you trust your instincts above all else. You prefer depth over breadth, quality over quantity. Your quiet power unnerves those who underestimate you.',
        'Horse': 'You are freedom personified. Energetic, independent, and eternally optimistic - you gallop through life with infectious enthusiasm. Social connection fuels you, but you refuse to be fenced in. Adventure calls your name.',
        'Rat': 'You are clever, resourceful, and always ten steps ahead. Quick-witted and charming, you navigate complex social dynamics with ease. Your intelligence is your superpower - you see opportunities others miss.',
        'Monkey': 'You are the brilliant entertainer who never sits still. Witty, curious, and endlessly inventive - boredom is your mortal enemy. Your playful intelligence and social brilliance make you irresistible.',
        'Rooster': 'You are confidence in motion. Proud, precise, and punctual - you have standards and you live them loudly. Your honesty can be brutal, but your loyalty is unbreakable. You were born to shine.',
        'Dog': 'You are loyalty incarnate. Honest, protective, and deeply principled - you stand by your people through everything. Justice matters more than popularity. Your integrity is your armor.',
        'Pig': 'You are generous optimism personified. Kind, honest, and surprisingly strong - you believe in the goodness of people and life rewards that faith. Your warmth creates family wherever you go.',
        'Goat': 'You are gentle creativity embodied. Artistic, empathetic, and peace-seeking - you experience life through feeling and beauty. Your sensitivity is your strength, not your weakness.'
    }

    const westernPersonality = {
        'Taurus': 'You build things that last. Patient, practical, and impossibly stubborn - you value stability, beauty, and sensory pleasure. Your determination is legendary; your loyalty, unshakeable.',
        'Aries': 'You are pure initiative energy. Bold, passionate, and always first - you charge into life headfirst. Your courage inspires others; your impatience frustrates them. You were born to lead the charge.',
        'Gemini': 'You are mental quicksilver. Curious, adaptable, and endlessly communicative - your mind never stops dancing. You collect ideas and connections like others collect stamps.',
        'Cancer': 'You are emotional depth personified. Nurturing, intuitive, and fiercely protective - family and security matter more than anything. Your sensitivity picks up what others miss.',
        'Leo': 'You are born royalty. Generous, dramatic, and magnetically confident - you need to shine and inspire. Leadership comes naturally; humility does not. You create joy wherever you go.',
        'Virgo': 'You are precision personified. Analytical, helpful, and impossibly detail-oriented - you improve everything you touch. Your service comes from deep care, not weakness.',
        'Libra': 'You are balance seeking beauty. Diplomatic, charming, and aesthetically obsessed - you cannot tolerate ugliness or discord. You create harmony through relationship and art.',
        'Scorpio': 'You are intensity incarnate. Passionate, mysterious, and emotionally fearless - you dive into depths others fear. Your power comes from transformation and truth.',
        'Sagittarius': 'You are freedom seeking wisdom. Optimistic, philosophical, and brutally honest - you need adventure and meaning above all. Boredom is your hell; exploration, your heaven.',
        'Capricorn': 'You are ambition with patience. Disciplined, responsible, and impossibly persistent - you climb mountains others deem impossible. Success is inevitable; shortcuts, unthinkable.',
        'Aquarius': 'You are revolutionary vision. Innovative, humanitarian, and delightfully weird - you see the future before others catch up. Convention bores you; change energizes you.',
        'Pisces': 'You are infinite empathy. Intuitive, artistic, and emotionally boundless - you feel everything everyone feels. Your sensitivity is your superpower and your challenge.'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 pb-20">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                .delay-4 { animation-delay: 0.4s; }
                .delay-5 { animation-delay: 0.5s; }
                .delay-6 { animation-delay: 0.6s; }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .bounce { animation: bounce 2s ease-in-out infinite; }
            `}</style>

            {/* NAVBAR */}
            <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate('/dashboard')}
                        >
                            <span className="text-2xl">✨</span>
                            <span className="text-white font-bold text-xl">AstroProfile</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-semibold"
                            >
                                ← Dashboard
                            </button>
                            <span className="text-gray-300 text-sm">
                                {currentUser?.displayName || currentUser?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto">
                {/* NARROW PERSONALIZED HEADER WITH TWINKLES */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-amber-500/30 text-center fade-in">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                        ✨ {data.firstName}'s Cosmic Blueprint ✨
                    </h1>
                </div>

                {/* 6-BOX GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* 1. COMPLETE BIRTH DATA */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-1">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                            <span className="text-xl">📍</span>
                            <h2 className="text-sm font-bold text-amber-400">BIRTH DETAILS</h2>
                        </div>
                        
                        <div className="space-y-2.5">
                            <div className="bg-slate-900/40 rounded-lg p-2">
                                <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Date</div>
                                <div className="text-sm font-bold text-white">{shortDate}</div>
                            </div>
                            <div className="bg-slate-900/40 rounded-lg p-2">
                                <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Time</div>
                                <div className="text-sm font-bold text-white">{data.birthTime || 'Unknown'}</div>
                            </div>
                            <div className="bg-slate-900/40 rounded-lg p-2">
                                <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Location</div>
                                <div className="text-sm font-bold text-white">{data.birthCity}</div>
                                <div className="text-xs text-white/60">{data.birthCountry}</div>
                            </div>
                            <div className="bg-slate-900/40 rounded-lg p-2">
                                <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Age</div>
                                <div className="text-sm font-bold text-white">{typeof age === 'object' ? `${age.years} years` : age}</div>
                            </div>
                        </div>

                        <div className="mt-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-2 border border-amber-400/30">
                            <div className="flex items-start gap-1.5">
                                <span className="text-xs">💡</span>
                                <p className="text-[10px] text-amber-300/90 leading-relaxed">
                                    <strong>Hospital-Level Precision:</strong> Your Ascendant changes every 4 minutes. Accurate birth time and location matter.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. CHINESE ZODIAC - ENHANCED INTERACTIVE FLAP SYSTEM */}
                    <EnhancedChineseZodiacPanel 
                        zodiacProfile={zodiacProfile}
                        zodiacResult={chinese}
                        year={year}
                    />

                    {/* 3. WESTERN ZODIAC */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-3">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                            <span className="text-xl">{zodiacEmojis[western.sign]}</span>
                            <h2 className="text-sm font-bold text-amber-400">WESTERN ZODIAC</h2>
                        </div>
                        
                        <div className="text-center mb-2">
                            <div className="text-5xl bounce inline-block mb-1">{zodiacEmojis[western.sign]}</div>
                            <div className="text-lg font-bold text-amber-400 uppercase tracking-wide">{western.sign}</div>
                            <div className="text-xs text-white/60 mb-2">The {western.element} Sign</div>
                            <div className="flex justify-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-[10px] font-bold">{western.element}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    western.yinYang === 'Yin' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-slate-900'
                                }`}>{western.yinYang}</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                            <p className="text-[11px] text-white/80 leading-relaxed">
                                {westernPersonality[western.sign]}
                            </p>
                        </div>

                        <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg">
                            Unlock {western.sign} Secrets →
                        </button>
                    </div>

                    {/* 4. DAY OF WEEK */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-4">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                            <span className="text-xl">🌟</span>
                            <h2 className="text-sm font-bold text-amber-400">PLANETARY RULER</h2>
                        </div>
                        
                        <div className="text-center mb-3">
                            <div className="text-3xl font-bold text-white mb-1">{dayOfWeek.day}</div>
                            <div className="text-sm text-amber-400 font-semibold mb-1">Ruled by {dayOfWeek.planet}</div>
                            <div className="text-[10px] text-white/60 italic mb-2">{dayOfWeek.traits}</div>
                        </div>

                        <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                            <p className="text-[11px] text-white/80 leading-relaxed">
                                {dayOfWeek.planet === 'Mars' && 'Mars gives you warrior energy - courage, passion, and drive. You face challenges head-on and inspire others through action. Your natural dynamism makes things happen.'}
                                {dayOfWeek.planet === 'Moon' && 'The Moon gifts you emotional intelligence and intuitive power. You feel what others miss, nurture naturally, and understand the hidden currents of human connection.'}
                                {dayOfWeek.planet === 'Mercury' && 'Mercury blesses you with mental agility and communication mastery. Your quick mind and verbal skill make you the connector, the explainer, the bridge between ideas.'}
                                {dayOfWeek.planet === 'Jupiter' && 'Jupiter expands everything you touch - optimism, wisdom, luck. You see possibilities where others see limits. Growth is your natural state.'}
                                {dayOfWeek.planet === 'Venus' && 'Venus grants you aesthetic sensitivity and relationship grace. Beauty matters to you - in art, in love, in life. You create harmony naturally.'}
                                {dayOfWeek.planet === 'Saturn' && 'Saturn teaches through structure and discipline. You build things that last, earn respect through persistence, and understand that mastery takes time.'}
                                {dayOfWeek.planet === 'Sun' && 'The Sun powers your core vitality and leadership presence. You naturally shine, inspire confidence, and bring warmth wherever you go. Born to lead.'}
                            </p>
                        </div>

                        <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg">
                            {dayOfWeek.planet} Influence Explained →
                        </button>
                    </div>

                    {/* 5. THE 7 CONSTITUTIONAL BATTLES */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-5">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                            <span className="text-xl">⚔️</span>
                            <h2 className="text-sm font-bold text-amber-400">THE 7 CONSTITUTIONAL BATTLES</h2>
                        </div>
                        
                        {/* Points Display (above pill box) */}
                        <div className="text-center mb-2">
                            <div className="text-[11px] text-white/70 font-medium">
                                <span className="text-blue-400 font-bold">{yinYang.yinPoints || Math.round(yinYang.yinPercentage)} pts Yin</span>
                                {yinYang.balancedPoints > 0 && (
                                    <>
                                        <span className="text-white/40 mx-1">•</span>
                                        <span className="text-green-400 font-bold">{yinYang.balancedPoints || Math.round(yinYang.balancedPercentage || 0)} pts Balanced</span>
                                    </>
                                )}
                                <span className="text-white/40 mx-1">•</span>
                                <span className="text-amber-400 font-bold">{yinYang.yangPoints || Math.round(yinYang.yangPercentage)} pts Yang</span>
                                <span className="text-white/40 ml-1.5">= {yinYang.totalPoints || 100} Total</span>
                            </div>
                        </div>
                        
                        {/* 3-Section Balance Bar */}
                        <div className="mb-3">
                            <div className="flex h-8 rounded-full overflow-hidden mb-1.5 shadow-lg border border-white/10">
                                {/* Yin Section */}
                                <div 
                                    className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500" 
                                    style={{width: `${yinYang.yinPercentage || 50}%`}}
                                >
                                    {yinYang.yinPercentage || 50}%
                                </div>
                                
                                {/* Balanced Section (if exists) */}
                                {(yinYang.balancedPercentage || 0) > 0 && (
                                    <div 
                                        className="bg-gradient-to-r from-green-500 via-green-400 to-green-500 flex items-center justify-center text-white text-[10px] font-bold transition-all duration-500" 
                                        style={{width: `${yinYang.balancedPercentage || 0}%`}}
                                    >
                                        {yinYang.balancedPercentage > 3 ? `${yinYang.balancedPercentage}%` : ''}
                                    </div>
                                )}
                                
                                {/* Yang Section */}
                                <div 
                                    className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 text-xs font-bold transition-all duration-500" 
                                    style={{width: `${yinYang.yangPercentage || 50}%`}}
                                >
                                    {yinYang.yangPercentage > 5 ? `${yinYang.yangPercentage}%` : ''}
                                </div>
                            </div>
                            
                            {/* Labels below bar */}
                            <div className="flex justify-between text-[10px] px-1">
                                <span className="text-blue-400 font-bold">🌙 Yin Energy</span>
                                {(yinYang.balancedPercentage || 0) > 0 && (
                                    <span className="text-green-400 font-bold">⚖️ Balanced</span>
                                )}
                                <span className="text-amber-400 font-bold">Yang Energy ☀️</span>
                            </div>
                        </div>

                        {/* Balance Type Badge */}
                        {yinYang.balance && (
                            <div className="text-center mb-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                    yinYang.balance.includes('Balanced') ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                                    yinYang.balance.includes('Yin') ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' :
                                    'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                                }`}>
                                    {yinYang.balance}
                                </span>
                            </div>
                        )}

                        {/* Description with 3 energies */}
                        <div className="bg-slate-900/40 rounded-lg p-2.5 mb-3">
                            <p className="text-[11px] text-white/80 leading-relaxed">
                                {(() => {
                                    const hasBalanced = (yinYang.balancedPoints || yinYang.balancedPercentage || 0) > 0
                                    const yinPts = yinYang.yinPoints || Math.round(yinYang.yinPercentage)
                                    const yangPts = yinYang.yangPoints || Math.round(yinYang.yangPercentage)
                                    const balPts = yinYang.balancedPoints || Math.round(yinYang.balancedPercentage || 0)
                                    
                                    if (hasBalanced) {
                                        return `You have ${yinPts} points of Feminine Energy (Yin) - receptive, intuitive, and reflective. You also have ${balPts} points of Balanced energy that adapts to context, and ${yangPts} points of Masculine Energy (Yang) for action when needed. Your ${yinYang.yinPercentage > yinYang.yangPercentage ? 'Yin dominance gives you deep wisdom' : yinYang.yangPercentage > yinYang.yinPercentage ? 'Yang dominance gives you driving force' : 'perfect balance gives you ultimate flexibility'}.`
                                    } else if (yinYang.yinPercentage > yinYang.yangPercentage) {
                                        return `You have ${yinYang.yinPercentage}% Feminine Energy (Yin) - receptive, intuitive, and reflective. You process deeply, listen carefully, and find power in patience. Your strength flows like water, adapting and nurturing.`
                                    } else if (yinYang.yangPercentage > yinYang.yinPercentage) {
                                        return `You have ${yinYang.yangPercentage}% Masculine Energy (Yang) - active, logical, and assertive. You initiate, lead, and create momentum. Your strength burns like fire, driving and transforming.`
                                    } else {
                                        return 'You are perfectly balanced (50/50) - a rare harmony of Feminine and Masculine energies. You can adapt your approach to any situation, flowing or driving as needed.'
                                    }
                                })()}
                            </p>
                        </div>

                        {/* See Your Battle Results Button */}
                        <button 
                            onClick={() => setShowYinYangBreakdown(!showYinYangBreakdown)}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>⚔️</span>
                            <span>{showYinYangBreakdown ? 'Hide Battle Results' : 'See Your Battle Results'}</span>
                            <span className={`transition-transform ${showYinYangBreakdown ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {/* Battle Results Panel */}
                        {showYinYangBreakdown && (
                            <div className="mt-4 pt-4 border-t border-white/20 animate-fadeIn">
                                <h3 className="text-xs font-bold text-white/90 mb-3 flex items-center gap-2">
                                    <span>⚔️</span> Your 7 Constitutional Battles
                                    <span className="text-white/50 font-normal">(Each adds to your score)</span>
                                </h3>
                                
                                {/* Factors List */}
                                <div className="space-y-2 mb-4">
                                    {yinYang.factors && yinYang.factors.map((factor, idx) => {
                                        const theory = getFactorTheory(factor, profile)
                                        const isExpanded = expandedFactorTheory === idx
                                        
                                        // Extract main name and detail from factor.name
                                        const nameMatch = factor.name.match(/^(.+?)\s*\((.+)\)$/)
                                        const mainName = nameMatch ? nameMatch[1] : factor.name
                                        const detail = nameMatch ? nameMatch[2] : ''
                                        
                                        return (
                                            <div key={idx} className="rounded-lg overflow-hidden">
                                                {/* Battle Summary - 2 Row Layout */}
                                                <div className={`p-2.5 text-xs ${
                                                    factor.energy === 'Yin' ? 'bg-blue-500/20 border border-blue-500/30' :
                                                    factor.energy === 'Yang' ? 'bg-amber-500/20 border border-amber-500/30' :
                                                    'bg-green-500/20 border border-green-500/30'
                                                }`}>
                                                    {/* Row 1: Main Info */}
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span>⚔️</span>
                                                            <span className="text-white/90 font-medium">{mainName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {/* Energy Icon + Text */}
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-base leading-none">
                                                                    {factor.energy === 'Yin' ? '🌙' : factor.energy === 'Yang' ? '☀️' : '⚖️'}
                                                                </span>
                                                                <div className="flex flex-col items-start leading-none">
                                                                    <span className={`font-bold text-xs ${
                                                                        factor.energy === 'Yin' ? 'text-blue-300' :
                                                                        factor.energy === 'Yang' ? 'text-amber-300' :
                                                                        'text-green-300'
                                                                    }`}>
                                                                        {factor.energy}
                                                                    </span>
                                                                    <span className={`text-[10px] ${
                                                                        factor.energy === 'Yin' ? 'text-blue-400/80' :
                                                                        factor.energy === 'Yang' ? 'text-amber-400/80' :
                                                                        'text-green-400/80'
                                                                    }`}>
                                                                        wins
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Points */}
                                                            <span className="text-white/60 font-medium">+{factor.weight} pts</span>
                                                            
                                                            {/* Learn Why Button - Only show if theory exists */}
                                                            {theory && (
                                                                <button
                                                                    onClick={() => toggleFactorTheory(idx)}
                                                                    className={`px-2 py-1 text-[10px] rounded transition-all ${
                                                                        isExpanded 
                                                                            ? 'bg-purple-500 text-white' 
                                                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                                    }`}
                                                                >
                                                                    {isExpanded ? '▲ Hide' : '🔬 Learn Why'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Row 2: Detail */}
                                                    {detail && (
                                                        <div className="text-white/60 text-[11px] pl-6">
                                                            ({detail})
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Expandable Theory Content (Course 3 - SALAD) */}
                                                {theory && isExpanded && (
                                                    <div className={`p-4 text-xs animate-fadeIn ${
                                                        factor.energy === 'Yin' ? 'bg-blue-500/10 border-l-4 border-blue-500/50' :
                                                        factor.energy === 'Yang' ? 'bg-amber-500/10 border-l-4 border-amber-500/50' :
                                                        'bg-green-500/10 border-l-4 border-green-500/50'
                                                    }`}>
                                                        {/* Theory Header */}
                                                        <div className="mb-3 pb-2 border-b border-white/10">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-2xl">{theory.icon}</span>
                                                                <h4 className="text-sm font-bold text-white">{theory.tagline}</h4>
                                                            </div>
                                                            <p className="text-white/70 italic">{theory.summary}</p>
                                                        </div>
                                                        
                                                        {/* Historical Origin */}
                                                        {theory.origin && (
                                                            <div className="mb-3">
                                                                <h5 className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                                                                    <span>🏛️</span> HISTORICAL ORIGIN
                                                                </h5>
                                                                <p className="text-white/70 leading-relaxed whitespace-pre-line">
                                                                    {theory.origin}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Why Yin/Yang */}
                                                        {theory.whyYinYang && (
                                                            <div className="mb-3 bg-slate-900/40 rounded-lg p-3">
                                                                <h5 className="text-[11px] font-bold text-purple-400 mb-1 flex items-center gap-1">
                                                                    <span>⚖️</span> WHY {factor.energy.toUpperCase()}?
                                                                </h5>
                                                                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                                                                    {theory.whyYinYang}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Cross-Cultural Verification */}
                                                        {theory.crossCultural && (
                                                            <div className="mb-3">
                                                                <h5 className="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1">
                                                                    <span>🌏</span> CROSS-CULTURAL VERIFICATION
                                                                </h5>
                                                                <p className="text-white/70 leading-relaxed whitespace-pre-line">
                                                                    {theory.crossCultural}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* In Your Profile */}
                                                        {theory.inYourProfile && (
                                                            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg p-3 border border-purple-500/30">
                                                                <h5 className="text-[11px] font-bold text-purple-300 mb-1 flex items-center gap-1">
                                                                    <span>🎯</span> IN YOUR PROFILE
                                                                </h5>
                                                                <p className="text-white/90 leading-relaxed">
                                                                    {typeof theory.inYourProfile === 'function'
                                                                        ? theory.inYourProfile(profile?.name || 'You', factor.weight, profile?.birthTime)
                                                                        : theory.inYourProfile
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Collapse Button */}
                                                        <button
                                                            onClick={() => toggleFactorTheory(idx)}
                                                            className="w-full mt-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 text-[10px] rounded transition-all flex items-center justify-center gap-1"
                                                        >
                                                            <span>▲</span> Collapse Theory
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Points Summary - 3 Sections */}
                                <div className={`grid ${(yinYang.balancedPoints || 0) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-3`}>
                                    <div className="bg-blue-500/20 rounded-lg p-2 text-center border border-blue-500/30">
                                        <div className="text-lg font-bold text-blue-300">{yinYang.yinPoints || Math.round(yinYang.yinPercentage || 0)} pts</div>
                                        <div className="text-[10px] text-blue-400">Yin Points</div>
                                    </div>
                                    {(yinYang.balancedPoints || yinYang.balancedPercentage || 0) > 0 && (
                                        <div className="bg-green-500/20 rounded-lg p-2 text-center border border-green-500/30">
                                            <div className="text-lg font-bold text-green-300">{yinYang.balancedPoints || Math.round(yinYang.balancedPercentage || 0)} pts</div>
                                            <div className="text-[10px] text-green-400">Balanced Points</div>
                                        </div>
                                    )}
                                    <div className="bg-amber-500/20 rounded-lg p-2 text-center border border-amber-500/30">
                                        <div className="text-lg font-bold text-amber-300">{yinYang.yangPoints || Math.round(yinYang.yangPercentage || 0)} pts</div>
                                        <div className="text-[10px] text-amber-400">Yang Points</div>
                                    </div>
                                </div>

                                {/* The 7-Battle Philosophy */}
                                <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg p-3 border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base">⚔️</span>
                                        <h4 className="text-[11px] font-bold text-purple-300">THE 7-BATTLE SYSTEM</h4>
                                    </div>
                                    <p className="text-[10px] text-white/70 leading-relaxed mb-2">
                                        Every person faces <span className="text-purple-300 font-semibold">7 Constitutional Battles</span> at birth:
                                    </p>
                                    <ul className="text-[10px] text-white/70 space-y-1 ml-3">
                                        <li>• <span className="text-amber-400 font-semibold">1 Ultimate Battle</span> (Birth Time) - 20 pts - Most important in Chinese medicine</li>
                                        <li>• <span className="text-blue-300 font-semibold">4 Major Battles</span> (Animals, Elements, Signs) - 15 pts each</li>
                                        <li>• <span className="text-green-300 font-semibold">2 Mini Battles</span> (Day, Gender) - 10 pts each</li>
                                    </ul>
                                    <p className="text-[10px] text-white/70 leading-relaxed mt-2">
                                        Each battle won adds to your Yin, Yang, or Balanced score. <span className="text-white/90 font-semibold">Total: Always 100 points.</span>
                                    </p>
                                    <p className="text-[10px] text-amber-400 mt-2 italic">
                                        ✨ "No shortcuts. Pure authority. The gift to humanity." - Ticky & Claude
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 6. NUMEROLOGY - WITH ROTATING CIRCLES ON HOVER */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-6">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                            <span className="text-xl">🔢</span>
                            <h2 className="text-sm font-bold text-amber-400">NUMEROLOGY</h2>
                        </div>

                        <style>{`
                            @keyframes rotateCircle {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                            .number-circle:hover {
                                animation: rotateCircle 2s linear infinite;
                            }
                        `}</style>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-3 border border-purple-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{numerology?.lifePath?.number || '?'}</span>
                                </div>
                                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wide">Life Path</div>
                                <div className="text-[9px] text-white/50 mt-0.5">Your Journey</div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg p-3 border border-pink-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{numerology?.expression?.number || '?'}</span>
                                </div>
                                <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wide">Destiny</div>
                                <div className="text-[9px] text-white/50 mt-0.5">Your Purpose</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg p-3 border border-amber-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{numerology?.soulUrge?.number || '?'}</span>
                                </div>
                                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wide">Soul Urge</div>
                                <div className="text-[9px] text-white/50 mt-0.5">Inner Drive</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-3 border border-green-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{numerology?.personality?.number || '?'}</span>
                                </div>
                                <div className="text-[10px] text-green-300 font-bold uppercase tracking-wide">Personality</div>
                                <div className="text-[9px] text-white/50 mt-0.5">How You're Seen</div>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                            <p className="text-[11px] text-white/80 leading-relaxed">
                                Your Life Path ({numerology?.lifePath?.number || '?'}) reveals your soul's journey. Destiny ({numerology?.expression?.number || '?'}) shows your life purpose. Soul Urge ({numerology?.soulUrge?.number || '?'}) is what truly drives you. Personality ({numerology?.personality?.number || '?'}) is how others see you.
                            </p>
                        </div>

                        <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg">
                            Decode Your Numbers →
                        </button>
                    </div>
                </div>

                                {/* PERSONAL NOTES SECTION */}
                <div ref={notesRef} id="notes" className="mt-8 bg-gradient-to-br from-cyan-600/20 to-teal-600/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30 fade-in delay-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📝</span>
                        <div>
                            <h3 className="text-xl font-bold text-white">Personal Notes</h3>
                            <p className="text-white/60 text-sm">Your private thoughts about this person</p>
                        </div>
                    </div>
                    
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your notes here... e.g., 'First date went well, he's very thoughtful. Loves hiking and has a great sense of humor. Second date planned for Saturday!'"
                        className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                    />
                    
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-white/40 text-xs">
                            {notes.length > 0 ? `${notes.length} characters` : 'No notes yet'}
                        </span>
                        
                        <div className="flex items-center gap-3">
                            {notesSaved && (
                                <span className="text-green-400 text-sm flex items-center gap-1">
                                    <span>✓</span> Saved!
                                </span>
                            )}
                            <button
                                onClick={handleSaveNotes}
                                disabled={notesSaving}
                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {notesSaving ? 'Saving...' : 'Save Notes 💾'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* FOOTER CTA */}
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
