import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProfiles } from '../contexts/ProfileContext'
import LocationPicker from './common/LocationPicker'

export default function InputForm() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { profiles, createProfile, updateProfile } = useProfiles()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [saveError, setSaveError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    // Check if we're in edit mode
    const editProfileId = searchParams.get('edit')
    const isEditMode = !!editProfileId
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        relationshipType: 'self',
        gender: '',
        birthDate: '',
        birthTime: '12:00',  // ← FIXED! Default to noon
        // Location fields - now with precision!
        birthLocation: '',      // Formatted display string
        birthLat: null,         // Latitude
        birthLng: null,         // Longitude
        birthPrecision: 'city', // Precision level
        mbtiType: ''
    })

    // Load existing profile data when in edit mode
    useEffect(() => {
        if (isEditMode && profiles.length > 0) {
            const existingProfile = profiles.find(p => p.id === editProfileId)
            
            if (existingProfile) {
                setFormData({
                    firstName: existingProfile.firstName || '',
                    lastName: existingProfile.lastName || '',
                    relationshipType: existingProfile.relationshipType || 'self',
                    gender: existingProfile.gender || '',
                    birthDate: existingProfile.birthDate || '',
                    birthTime: existingProfile.birthTime || '12:00',  // ← FIXED! Default to noon even in edit
                    // Location from stored data
                    birthLocation: existingProfile.location?.fullAddress || '',
                    birthLat: existingProfile.location?.coordinates?.lat || null,
                    birthLng: existingProfile.location?.coordinates?.lng || null,
                    birthPrecision: existingProfile.location?.locationType || 'city',
                    mbtiType: existingProfile.mbti || ''
                })
            }
            setIsLoading(false)
        } else if (!isEditMode) {
            setIsLoading(false)
        }
    }, [isEditMode, editProfileId, profiles])

    // Show loading while fetching profile in edit mode
    useEffect(() => {
        if (isEditMode && profiles.length === 0) {
            // Still loading profiles from Firebase
            setIsLoading(true)
        }
    }, [isEditMode, profiles])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Handle LocationPicker changes
    const handleLocationChange = (locationData) => {
        console.log('🌍 handleLocationChange called with:', locationData)
        setFormData(prev => {
            const updated = {
                ...prev,
                birthLocation: locationData.formatted,
                birthLat: locationData.lat,
                birthLng: locationData.lng,
                birthPrecision: locationData.precision
            }
            console.log('📝 Updated formData:', updated)
            return updated
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaveError(null)
        setIsSubmitting(true)

        // Validate gender is set
        if (!formData.gender) {
            setSaveError('Please select a gender')
            setIsSubmitting(false)
            return
        }

        // Validate location is set
        if (!formData.birthLocation) {
            setSaveError('Please select a birth location')
            setIsSubmitting(false)
            return
        }

        try {
            const profileData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                relationshipType: formData.relationshipType,
                gender: formData.gender,
                birthDate: formData.birthDate,
                birthTime: formData.birthTime || '12:00',  // ← Ensure default even if cleared
                mbti: formData.mbtiType || null,
                // Location update
                location: {
                    fullAddress: formData.birthLocation,
                    coordinates: formData.birthLat && formData.birthLng ? {
                        lat: formData.birthLat,
                        lng: formData.birthLng
                    } : null,
                    locationType: formData.birthPrecision
                }
            }

            if (isEditMode) {
                await updateProfile(editProfileId, profileData)
            } else {
                const newProfileId = await createProfile(profileData)
                navigate(`/results/${newProfileId}`)
                return
            }

            // After edit, go back to results page
            navigate(`/results/${editProfileId}`)
        } catch (error) {
            console.error('Error saving profile:', error)
            setSaveError(error.message || 'Failed to save profile. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    const inputClassName = "w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200"

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 py-6 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400 mb-2">
                            {isEditMode ? '✏️ Edit Profile' : '✨ Create New Profile'}
                        </h1>
                        <p className="text-white/70 text-sm">
                            {isEditMode ? 'Update your cosmic blueprint' : 'Enter birth information to generate cosmic blueprint'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {saveError && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                            {saveError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm mb-2">
                                    First Name <span className="text-pink-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm mb-2">
                                    Last Name <span className="text-pink-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                />
                            </div>
                        </div>

                        {/* Relationship Type */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2">
                                Relationship Type
                            </label>
                            <select
                                name="relationshipType"
                                value={formData.relationshipType}
                                onChange={handleChange}
                                className={inputClassName}
                            >
                                <option value="self">🙋 Myself</option>
                                <option value="partner">💑 Partner</option>
                                <option value="child">👶 Child</option>
                                <option value="parent">👨‍👩‍👧 Parent</option>
                                <option value="friend">👥 Friend</option>
                                <option value="other">🌟 Other</option>
                            </select>
                            <p className="text-white/50 text-xs mt-1">Who is this profile for?</p>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2">
                                Gender <span className="text-pink-400">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-white cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                    <span>Male</span>
                                </label>
                                <label className="flex items-center gap-2 text-white cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                    <span>Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Birth Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm mb-2">
                                    Birth Date <span className="text-pink-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm mb-2">
                                    Birth Time (Optional)
                                </label>
                                <input
                                    type="time"
                                    name="birthTime"
                                    value={formData.birthTime}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                                {/* ← FIXED! Better helper text */}
                                <p className="text-white/60 text-xs mt-1">
                                    💡 Don't know your exact birth time? Start with noon (12:00 PM). 
                                    You can update later for Hour Pillar precision.
                                </p>
                            </div>
                        </div>

                        {/* Birth Location - NOW WITH PRECISION! */}
                        <LocationPicker 
                            onChange={handleLocationChange}
                            initialValue={formData.birthLocation}
                            initialPrecision={formData.birthPrecision}
                        />

                        {/* MBTI Type */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2">
                                MBTI Type (Optional)
                            </label>
                            <select
                                name="mbtiType"
                                value={formData.mbtiType}
                                onChange={handleChange}
                                className={inputClassName}
                            >
                                <option value="">Select if known</option>
                                <option value="INTJ">INTJ - The Architect (Strategic visionary)</option>
                                <option value="INTP">INTP - The Logician (Philosophical thinker)</option>
                                <option value="ENTJ">ENTJ - The Commander (Bold strategic leader)</option>
                                <option value="ENTP">ENTP - The Debater (Clever innovator)</option>
                                <option value="INFJ">INFJ - The Advocate (Insightful idealist)</option>
                                <option value="INFP">INFP - The Mediator (Poetic healer)</option>
                                <option value="ENFJ">ENFJ - The Protagonist (Inspiring leader)</option>
                                <option value="ENFP">ENFP - The Campaigner (Creative free spirit)</option>
                                <option value="ISTJ">ISTJ - The Logistician (Practical organizer)</option>
                                <option value="ISFJ">ISFJ - The Defender (Warm protector)</option>
                                <option value="ESTJ">ESTJ - The Executive (Organized manager)</option>
                                <option value="ESFJ">ESFJ - The Consul (Social harmonizer)</option>
                                <option value="ISTP">ISTP - The Virtuoso (Bold experimenter)</option>
                                <option value="ISFP">ISFP - The Adventurer (Charming artist)</option>
                                <option value="ESTP">ESTP - The Entrepreneur (Energetic perceiver)</option>
                                <option value="ESFP">ESFP - The Entertainer (Spontaneous performer)</option>
                            </select>
                            <p className="text-white/50 text-xs mt-1">For more comprehensive analysis</p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => isEditMode ? navigate(`/results/${editProfileId}`) : navigate('/dashboard')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : (isEditMode ? '💾 Update Profile' : '✨ Create Profile')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
