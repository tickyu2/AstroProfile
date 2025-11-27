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
        birthTime: '',
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
                    birthTime: existingProfile.birthTime || '',
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
        setFormData(prev => ({
            ...prev,
            birthLocation: locationData.formatted,
            birthLat: locationData.lat,
            birthLng: locationData.lng,
            birthPrecision: locationData.precision
        }))
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
            if (isEditMode) {
                // UPDATE existing profile
                await updateProfile(editProfileId, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    relationshipType: formData.relationshipType,
                    gender: formData.gender,
                    birthDate: formData.birthDate,
                    birthTime: formData.birthTime || null,
                    mbti: formData.mbtiType || null,
                    // Location update
                    location: {
                        fullAddress: formData.birthLocation,
                        coordinates: {
                            lat: formData.birthLat || 0,
                            lng: formData.birthLng || 0
                        },
                        locationType: formData.birthPrecision || 'city',
                        precision: getPrecisionLabel(formData.birthPrecision),
                        // Parse city/country from address
                        city: parseCityFromAddress(formData.birthLocation),
                        state: parseStateFromAddress(formData.birthLocation),
                        country: parseCountryFromAddress(formData.birthLocation)
                    }
                })
                // Navigate to results page after update
                navigate(`/results/${editProfileId}`)
            } else {
                // CREATE new profile
                const profileId = await createProfile(formData)
                
                if (profileId) {
                    navigate(`/results/${profileId.id}`)
                } else {
                    throw new Error('No profile ID returned')
                }
            }
        } catch (error) {
            console.error('Error saving profile:', error)
            setSaveError(`Failed to ${isEditMode ? 'update' : 'create'} profile: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputClassName = "w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
    
    // Solid purple background for dropdowns - guaranteed visible
    const selectClassName = "w-full px-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"

    // Show loading spinner while loading profile data
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading profile...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Header - Changes based on mode */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {isEditMode ? '✏️ Edit Profile ✏️' : '✨ Create New Profile ✨'}
                        </h1>
                        <p className="text-white/70">
                            {isEditMode 
                                ? 'Update birth information for this profile'
                                : 'Enter birth information to generate a cosmic blueprint'
                            }
                        </p>
                    </div>

                    {/* Error Display */}
                    {saveError && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                            {saveError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Enter first name"
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
                                    placeholder="Enter last name"
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
                                className={selectClassName}
                            >
                                <option value="self">👤 Myself</option>
                                <option value="partner">💕 Partner / Spouse</option>
                                <option value="dating">💝 Dating Interest</option>
                                <option value="family">👨‍👩‍👧 Family Member</option>
                                <option value="friend">🤝 Friend</option>
                                <option value="colleague">💼 Colleague</option>
                                <option value="other">📋 Other</option>
                            </select>
                            <p className="text-white/50 text-xs mt-1">Who is this profile for?</p>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2">
                                Sex <span className="text-pink-400">*</span>
                            </label>
                            <div className="flex gap-6">
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
                                <p className="text-white/50 text-xs mt-1">More accurate with exact time</p>
                            </div>
                        </div>

                        {/* Birth Location - NOW WITH PRECISION! */}
                        <LocationPicker 
                            onChange={handleLocationChange}
                            value={formData.birthLocation ? {
                                formatted: formData.birthLocation,
                                lat: formData.birthLat,
                                lng: formData.birthLng,
                                precision: formData.birthPrecision
                            } : null}
                        />

                        {/* MBTI Type (Optional) */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2">
                                MBTI Type (Optional)
                            </label>
                            <select
                                name="mbtiType"
                                value={formData.mbtiType}
                                onChange={handleChange}
                                className={selectClassName}
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

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-3 px-6 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting 
                                    ? (isEditMode ? 'Saving...' : 'Creating...') 
                                    : (isEditMode ? 'Save Changes ✨' : 'Create Profile ✨')
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

// =============================================================================
// HELPER FUNCTIONS - Parse location from Google Places address
// =============================================================================

function parseCityFromAddress(address) {
    if (!address) return null
    const parts = address.split(',').map(p => p.trim())
    if (parts.length >= 3) {
        return parts[parts.length - 3] || parts[0]
    }
    return parts[0] || null
}

function parseStateFromAddress(address) {
    if (!address) return null
    const parts = address.split(',').map(p => p.trim())
    if (parts.length >= 2) {
        return parts[parts.length - 2] || null
    }
    return null
}

function parseCountryFromAddress(address) {
    if (!address) return null
    const parts = address.split(',').map(p => p.trim())
    return parts[parts.length - 1] || null
}

function getPrecisionLabel(precision) {
    const labels = {
        'city': '±15km',
        'hospital': '±10m',
        'home': '±10m',
        'exact': '±1m'
    }
    return labels[precision] || '±15km'
}
