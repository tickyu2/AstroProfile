import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProfiles } from '../contexts/ProfileContext'
import { useKnowledgeBase } from '../contexts/KnowledgeBaseContext'
import { motion } from 'framer-motion'
import MapboxLocationPicker from './MapboxLocationPicker'
import { getHistoricalTimezone, formatTimezoneDisplay } from '../services/timezoneService'

// ═══════════════════════════════════════════════════════════════════
// DIAMOND PROFILE FORM - PRODUCTION GRADE
// ═══════════════════════════════════════════════════════════════════
// Purpose: Create AND edit profiles with complete functionality
// Features:
// - Mapbox location search (hospital-grade precision)
// - Manual coordinates entry
// - GPS "Use My Location"
// - MBTI dropdown with all 16 types
// - Big 5 personality with helpful tooltips
// - Edit mode with pre-filled data
// - Beautiful animations
// - Proper data structure for ProfileContext
// ═══════════════════════════════════════════════════════════════════

export default function DiamondProfileForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profiles, createProfile, updateProfile, recalculateSovereignData } = useProfiles()
  const { syncProfileToKB } = useKnowledgeBase()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if we're in edit mode
  const editProfileId = searchParams.get('edit')
  const isEditMode = !!editProfileId
  
  // Location input mode
  const [locationMode, setLocationMode] = useState('search') // 'search' | 'manual' | 'gps'
  const [gpsLoading, setGpsLoading] = useState(false)

  // Historical timezone data (from TimezoneDB)
  const [timezoneData, setTimezoneData] = useState(null)
  const [timezoneLoading, setTimezoneLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Identity
    firstName: '',
    lastName: '',
    gender: '',
    relationshipType: 'self',
    
    // Birth info
    birthDate: '',
    birthTime: '12:00', // Default to noon
    
    // Location
    locationCity: '',
    locationLat: '',
    locationLng: '',
    locationPrecision: '',
    locationIcon: '',
    
    // MBTI
    mbtiType: '',
    
    // Big 5 Personality (optional)
    big5_openness: 50,
    big5_conscientiousness: 50,
    big5_extraversion: 50,
    big5_agreeableness: 50,
    big5_neuroticism: 50,
    big5_provided: false
  })

  // Load existing profile data when in edit mode
  useEffect(() => {
    if (isEditMode && profiles.length > 0) {
      const existingProfile = profiles.find(p => p.id === editProfileId)
      
      if (existingProfile) {
        // Handle location - support both formats
        const locationCity = existingProfile.location?.fullAddress || existingProfile.birthLocation || ''
        const locationLat = existingProfile.location?.coordinates?.lat || existingProfile.birthLat || ''
        const locationLng = existingProfile.location?.coordinates?.lng || existingProfile.birthLng || ''
        const locationPrecision = existingProfile.location?.precision || existingProfile.birthPrecision || ''
        
        setFormData({
          firstName: existingProfile.firstName || '',
          lastName: existingProfile.lastName || '',
          gender: existingProfile.gender || '',
          relationshipType: existingProfile.relationshipType || 'self',
          birthDate: existingProfile.birthDate || '',
          birthTime: existingProfile.birthTime || '12:00',
          locationCity: locationCity,
          locationLat: locationLat,
          locationLng: locationLng,
          locationPrecision: locationPrecision,
          locationIcon: '',
          mbtiType: existingProfile.mbti || '',
          big5_openness: existingProfile.big5?.openness || 50,
          big5_conscientiousness: existingProfile.big5?.conscientiousness || 50,
          big5_extraversion: existingProfile.big5?.extraversion || 50,
          big5_agreeableness: existingProfile.big5?.agreeableness || 50,
          big5_neuroticism: existingProfile.big5?.neuroticism || 50,
          big5_provided: !!existingProfile.big5
        })
      }
    }
    setIsLoading(false)
  }, [isEditMode, editProfileId, profiles])

  // Lookup historical timezone when location + date are set
  useEffect(() => {
    const lookupTimezone = async () => {
      // Only lookup if we have coordinates and a date
      if (!formData.locationLat || !formData.locationLng || !formData.birthDate) {
        setTimezoneData(null)
        return
      }

      setTimezoneLoading(true)
      try {
        const result = await getHistoricalTimezone({
          latitude: parseFloat(formData.locationLat),
          longitude: parseFloat(formData.locationLng),
          birthDate: formData.birthDate,
          birthTime: formData.birthTime || '12:00'
        })

        if (result.success) {
          setTimezoneData(result)
          console.log('🕐 Historical timezone found:', result.timezone)
        } else {
          console.warn('Timezone lookup failed:', result.error)
          setTimezoneData(null)
        }
      } catch (err) {
        console.error('Timezone lookup error:', err)
        setTimezoneData(null)
      }
      setTimezoneLoading(false)
    }

    // Debounce the lookup to avoid too many API calls
    const timer = setTimeout(lookupTimezone, 500)
    return () => clearTimeout(timer)
  }, [formData.locationLat, formData.locationLng, formData.birthDate, formData.birthTime])

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  // Handle Big 5 slider changes
  const handleBig5Change = (trait, value) => {
    setFormData(prev => ({
      ...prev,
      [`big5_${trait}`]: parseInt(value),
      big5_provided: true
    }))
  }

  // Handle Mapbox location selection
  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      locationCity: location.city,
      locationLat: location.lat,
      locationLng: location.lng,
      locationPrecision: location.precision,
      locationIcon: location.icon,
      useCoordinates: true
    }))
  }

  // Handle GPS location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setError('GPS not available in your browser')
      return
    }

    setGpsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Reverse geocode to get location name using Mapbox
        try {
          const token = import.meta.env.VITE_MAPBOX_TOKEN
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=place,address`
          
          const response = await fetch(url)
          const data = await response.json()
          
          const locationName = data.features[0]?.place_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          
          setFormData(prev => ({
            ...prev,
            locationCity: locationName,
            locationLat: latitude,
            locationLng: longitude,
            locationPrecision: '±10m (GPS)',
            locationIcon: '📍',
            useCoordinates: true
          }))
          
          setLocationMode('search') // Switch back to show result
        } catch (err) {
          console.error('Reverse geocoding failed:', err)
          // Still set coordinates even if reverse geocoding fails
          setFormData(prev => ({
            ...prev,
            locationCity: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°W`,
            locationLat: latitude,
            locationLng: longitude,
            locationPrecision: '±10m (GPS)',
            locationIcon: '📍',
            useCoordinates: true
          }))
          setLocationMode('search')
        }
        
        setGpsLoading(false)
      },
      (err) => {
        setError(`GPS Error: ${err.message}`)
        setGpsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) return 'Please enter a first name'
    if (!formData.lastName.trim()) return 'Please enter a last name'
    if (!formData.gender) return 'Please select a gender'
    if (!formData.birthDate) return 'Please enter a birth date'
    
    // Location validation (only if coordinates provided)
    if (formData.locationLat || formData.locationLng) {
      const lat = parseFloat(formData.locationLat)
      const lng = parseFloat(formData.locationLng)
      if (isNaN(lat) || isNaN(lng)) return 'Invalid coordinates'
      if (lat < -90 || lat > 90) return 'Latitude must be between -90 and 90'
      if (lng < -180 || lng > 180) return 'Longitude must be between -180 and 180'
    }
    
    return null
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      // Get existing profile if in edit mode
      const existingProfile = isEditMode ? profiles.find(p => p.id === editProfileId) : null
      
      // Transform formData to match profile structure
      const profileData = {
        ...formData,
        // Map mbtiType to mbti for ProfileContext compatibility
        mbti: formData.mbtiType || null,
        // Map location fields - PRESERVE existing if form field is empty
        birthLocation: formData.locationCity || existingProfile?.location?.fullAddress || formData.birthLocation || '',
        birthLat: formData.locationLat || existingProfile?.location?.coordinates?.lat || formData.birthLat || 0,
        birthLng: formData.locationLng || existingProfile?.location?.coordinates?.lng || formData.birthLng || 0,
        birthPrecision: formData.locationPrecision || existingProfile?.location?.precision || formData.birthPrecision || 'city',
        // Historical timezone data for accuracy
        historicalTimezone: timezoneData?.timezone ? {
          zoneName: timezoneData.timezone.zoneName,
          abbreviation: timezoneData.timezone.abbreviation,
          gmtOffset: timezoneData.timezone.gmtOffset,
          gmtOffsetHours: timezoneData.timezone.gmtOffsetHours,
          formattedOffset: timezoneData.timezone.formattedOffset,
          dst: timezoneData.timezone.dst,
          dstName: timezoneData.timezone.dstName,
          countryCode: timezoneData.timezone.countryCode,
          countryName: timezoneData.timezone.countryName,
          regionName: timezoneData.timezone.regionName,
          source: 'TimezoneDB',
          lookedUpAt: new Date().toISOString()
        } : existingProfile?.historicalTimezone || null,
        // Convert Big 5 from flat form structure to nested object
        big5: formData.big5_provided ? {
          openness: formData.big5_openness || 50,
          conscientiousness: formData.big5_conscientiousness || 50,
          extraversion: formData.big5_extraversion || 50,
          agreeableness: formData.big5_agreeableness || 50,
          neuroticism: formData.big5_neuroticism || 50,
          provided: true
        } : null
      }

      // Remove the flat big5_ fields since we've nested them
      delete profileData.big5_openness
      delete profileData.big5_conscientiousness
      delete profileData.big5_extraversion
      delete profileData.big5_agreeableness
      delete profileData.big5_neuroticism
      delete profileData.big5_provided
      // Remove mbtiType since we've mapped it to mbti
      delete profileData.mbtiType
      // Remove location* fields since we've mapped them to birth*
      delete profileData.locationCity
      delete profileData.locationLat
      delete profileData.locationLng
      delete profileData.locationPrecision
      delete profileData.locationIcon
      delete profileData.useCoordinates

      console.log('🎯 Submitting profile with data:', profileData)
      
      if (isEditMode) {
        const updatedProfile = await updateProfile(editProfileId, profileData)
        console.log('✅ Profile updated')

        // ═══════════════════════════════════════════════════════════════════
        // MOTHER OF ALL CALCULATIONS: Trigger full BaZi/Sovereign recalculation
        // This ensures all astrological data is freshly computed from birth info
        // ═══════════════════════════════════════════════════════════════════
        console.log('🔄 Triggering BaZi recalculation after save...')
        try {
          await recalculateSovereignData(editProfileId)
          console.log('✅ BaZi recalculation complete')
        } catch (recalcErr) {
          console.warn('⚠️ BaZi recalculation failed (Python backend may be offline):', recalcErr.message)
          // Don't block navigation - profile data was saved successfully
        }

        // Sync the updated profile to Knowledge Base
        if (updatedProfile && syncProfileToKB) {
          console.log('🧬 Syncing updated profile to KB:', updatedProfile.displayName || updatedProfile.firstName)
          await syncProfileToKB(updatedProfile)
        }
        navigate(`/results/${editProfileId}`)
      } else {
        const newProfile = await createProfile(profileData)
        console.log('✅ Profile created:', newProfile)

        // ═══════════════════════════════════════════════════════════════════
        // MOTHER OF ALL CALCULATIONS: Trigger full BaZi/Sovereign calculation
        // This ensures new profiles get complete astrological data from day 1
        // ═══════════════════════════════════════════════════════════════════
        console.log('🔄 Triggering BaZi calculation for new profile...')
        try {
          await recalculateSovereignData(newProfile.id)
          console.log('✅ BaZi calculation complete for new profile')
        } catch (recalcErr) {
          console.warn('⚠️ BaZi calculation failed (Python backend may be offline):', recalcErr.message)
          // Don't block navigation - profile was created successfully
        }

        navigate(`/results/${newProfile.id}`)
      }
    } catch (err) {
      console.error('❌ Error saving profile:', err)
      setError(err.message || 'Failed to save profile')
      setIsSubmitting(false)
    }
  }

  // Styles
  const inputClassName = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
  const labelClassName = "block text-white/80 text-sm font-medium mb-2"
  const sectionClassName = "mb-8"
  const sectionTitleClassName = "text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <button
          onClick={() => isEditMode ? navigate(`/results/${editProfileId}`) : navigate('/dashboard')}
          className="text-white/60 hover:text-white transition-colors mb-4 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">
          {isEditMode ? '✏️ Edit Profile' : '✨ Create Cosmic Blueprint'}
        </h1>
        <p className="text-white/60">
          {isEditMode ? 'Update your cosmic profile' : 'Enter birth information to generate a complete astrological profile'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          
          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* ═══════ SECTION 1: IDENTITY ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>👤</span> Identity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClassName}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={inputClassName}
                  required
                />
              </div>
              
              <div>
                <label className={labelClassName}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={inputClassName}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClassName}>Gender *</label>
              <div className="flex gap-4">
                {['male', 'female', 'other'].map(gender => (
                  <label key={gender} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-500"
                      required
                    />
                    <span className="text-white capitalize">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClassName}>Relationship Type</label>
              <select
                name="relationshipType"
                value={formData.relationshipType}
                onChange={handleChange}
                className={inputClassName}
              >
                <option value="self" className="bg-slate-800 text-white">⭐ Myself</option>
                <option value="partner" className="bg-slate-800 text-white">💑 Partner/Spouse</option>
                <option value="friend" className="bg-slate-800 text-white">💛 Friend</option>
                <option value="family" className="bg-slate-800 text-white">👨‍👩‍👧‍👦 Family Member</option>
                <option value="other" className="bg-slate-800 text-white">🌟 Other</option>
              </select>
            </div>
          </div>

          {/* ═══════ SECTION 2: BIRTH INFORMATION ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>🎂</span> Birth Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName}>Birth Date *</label>
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
                <label className={labelClassName}>Birth Time</label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  className={inputClassName}
                />
                <p className="text-white/40 text-xs mt-1">
                  💡 If unknown, noon (12:00) is used as default
                </p>
              </div>
            </div>

            {/* Historical Timezone Display */}
            {(timezoneLoading || timezoneData) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-slate-900/50 border border-white/10 rounded-lg"
              >
                {timezoneLoading ? (
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="animate-spin">🕐</span>
                    <span>Looking up historical timezone...</span>
                  </div>
                ) : timezoneData?.timezone ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🕐</span>
                      <span className="text-sm text-white/60">Historical Timezone (at birth)</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        ✓ Verified
                      </span>
                    </div>
                    <div className="text-white font-medium">
                      {timezoneData.timezone.abbreviation} ({timezoneData.timezone.zoneName})
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      UTC{timezoneData.timezone.formattedOffset} • {timezoneData.timezone.dstName}
                      {timezoneData.timezone.dst && (
                        <span className="ml-2 text-amber-400">☀️ DST Active</span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 mt-2">
                      📍 {timezoneData.timezone.countryName}
                      {timezoneData.timezone.regionName && `, ${timezoneData.timezone.regionName}`}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>

          {/* ═══════ SECTION 3: LOCATION ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>📍</span> Birth Location
            </h2>

            {/* Location Mode Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLocationMode('search')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  locationMode === 'search'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                🔍 Search
              </button>
              <button
                type="button"
                onClick={() => setLocationMode('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  locationMode === 'manual'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                🎯 Coordinates
              </button>
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={gpsLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                {gpsLoading ? '⏳ Getting GPS...' : '📱 Use My Location'}
              </button>
            </div>

            {/* Search Mode */}
            {locationMode === 'search' && (
              <div className="space-y-4">
                {/* Display selected location in a separate box */}
                {formData.locationCity && (
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-cyan-400 mb-1 font-medium">✅ Selected Location:</div>
                        <div className="text-white font-medium">{formData.locationCity}</div>
                        {formData.locationLat && formData.locationLng && (
                          <div className="text-xs text-white/60 mt-1">
                            📐 {formData.locationLat}°, {formData.locationLng}°
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          locationCity: '',
                          locationLat: '',
                          locationLng: '',
                          locationPrecision: '',
                          locationIcon: ''
                        }))}
                        className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 
                                 transition-colors border border-red-500/30"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Search picker - independent from display */}
                <div>
                  <div className="text-sm text-white/60 mb-2">
                    {formData.locationCity ? '🔄 Change location:' : '🔍 Search for location:'}
                  </div>
                  <MapboxLocationPicker
                    initialValue=""
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              </div>
            )}

            {/* Manual Coordinates Mode */}
            {locationMode === 'manual' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClassName}>Latitude</label>
                    <input
                      type="number"
                      name="locationLat"
                      value={formData.locationLat}
                      onChange={handleChange}
                      placeholder="e.g. 37.7749"
                      step="0.0001"
                      min="-90"
                      max="90"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Longitude</label>
                    <input
                      type="number"
                      name="locationLng"
                      value={formData.locationLng}
                      onChange={handleChange}
                      placeholder="e.g. -122.4194"
                      step="0.0001"
                      min="-180"
                      max="180"
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>Location Name (Optional)</label>
                  <input
                    type="text"
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className={inputClassName}
                  />
                </div>
                <p className="text-white/40 text-xs">
                  💡 You can find coordinates using Google Maps
                </p>
              </div>
            )}

            {/* Show selected location if coordinates exist */}
            {formData.locationLat && formData.locationLng && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-xl">{formData.locationIcon || '📍'}</span>
                  <div className="flex-1">
                    <div className="text-cyan-400 font-medium">
                      {formData.locationCity || 'Location Set'}
                    </div>
                    <div className="text-white/60 text-xs">
                      {parseFloat(formData.locationLat).toFixed(4)}°, {parseFloat(formData.locationLng).toFixed(4)}°
                    </div>
                  </div>
                  {formData.locationPrecision && (
                    <div className="text-xs text-cyan-400/80">
                      {formData.locationPrecision}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* ═══════ SECTION 4: MBTI (OPTIONAL) ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>🧩</span> MBTI Personality <span className="text-sm text-white/40">(Optional)</span>
            </h2>
            
            <select
              name="mbtiType"
              value={formData.mbtiType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all [&>option]:bg-slate-800 [&>option]:text-white [&>option:checked]:bg-cyan-900"
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
            <p className="text-white/50 text-xs mt-2">
              💡 Don't know your type? Take the test at <a href="https://www.16personalities.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">16personalities.com</a>
            </p>
          </div>

          {/* ═══════ SECTION 5: BIG 5 PERSONALITY (OPTIONAL) ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>🧠</span> Big 5 Personality Traits <span className="text-sm text-white/40">(Optional)</span>
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Rate yourself on these five personality dimensions. Skip if you're unsure!
            </p>

            {[
              { 
                key: 'openness', 
                label: 'Openness to Experience', 
                low: 'Practical', 
                high: 'Creative',
                tooltip: 'Appreciation for art, emotion, adventure, and unusual ideas. Curious and open-minded vs. cautious and consistent.'
              },
              { 
                key: 'conscientiousness', 
                label: 'Conscientiousness', 
                low: 'Spontaneous', 
                high: 'Organized',
                tooltip: 'Tendency to be organized, dependable, and show self-discipline. Planned and careful vs. flexible and spontaneous.'
              },
              { 
                key: 'extraversion', 
                label: 'Extraversion', 
                low: 'Reserved', 
                high: 'Outgoing',
                tooltip: 'Energy drawn from social interaction. Assertive and sociable vs. solitary and reserved.'
              },
              { 
                key: 'agreeableness', 
                label: 'Agreeableness', 
                low: 'Competitive', 
                high: 'Cooperative',
                tooltip: 'Tendency to be compassionate and cooperative. Friendly and empathetic vs. analytical and detached.'
              },
              { 
                key: 'neuroticism', 
                label: 'Emotional Sensitivity', 
                low: 'Calm', 
                high: 'Sensitive',
                tooltip: 'Tendency to experience unpleasant emotions. Calm and stable vs. anxious and vulnerable.'
              }
            ].map(trait => (
              <div key={trait.key} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <label className={labelClassName}>{trait.label}</label>
                    <div className="group relative">
                      <span className="text-white/40 cursor-help text-xs">ℹ️</span>
                      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 bg-slate-900 border border-white/20 rounded-lg text-xs text-white/80 bottom-full left-1/2 -translate-x-1/2 mb-2">
                        {trait.tooltip}
                      </div>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold">{formData[`big5_${trait.key}`]}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/40 text-xs w-24">{trait.low}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData[`big5_${trait.key}`]}
                    onChange={(e) => handleBig5Change(trait.key, e.target.value)}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                             [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                             [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-cyan-500 
                             [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                  />
                  <span className="text-white/40 text-xs w-24 text-right">{trait.high}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════ SUBMIT BUTTONS ═══════ */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => isEditMode ? navigate(`/results/${editProfileId}`) : navigate('/dashboard')}
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-bold hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? '💾 Save Changes' : '✨ Generate Cosmic Blueprint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
