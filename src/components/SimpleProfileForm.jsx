import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfiles } from '../contexts/ProfileContext'
import MapboxLocationPicker from './MapboxLocationPicker'

// ═══════════════════════════════════════════════════════
// SIMPLE PROFILE FORM - FRESH START, DONE RIGHT
// ═══════════════════════════════════════════════════════
// Purpose: Create profiles with ALL necessary data
// - Basic identity (name, gender, birth info)
// - Simple location (city OR coordinates)
// - Big 5 personality (optional)
// - Four Pillars calculated and saved properly!
// ═══════════════════════════════════════════════════════

export default function SimpleProfileForm() {
  const navigate = useNavigate()
  const { createProfile } = useProfiles()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Form state - simple and clean
  const [formData, setFormData] = useState({
    // Identity
    firstName: '',
    lastName: '',
    gender: '',
    
    // Birth info
    birthDate: '',
    birthTime: '12:00', // Default to noon
    
    // Location (keep it simple!)
    locationCity: '', // e.g. "San Francisco, CA, USA"
    locationLat: '',
    locationLng: '',
    useCoordinates: false, // Toggle between city name or coordinates
    
    // Big 5 Personality (optional - all default to 50)
    big5_openness: 50,
    big5_conscientiousness: 50,
    big5_extraversion: 50,
    big5_agreeableness: 50,
    big5_neuroticism: 50,
    big5_provided: false // Track if user actually filled these in
  })

  // Handle input changes
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
      big5_provided: true // Mark that user has interacted with Big 5
    }))
  }

  // Toggle between city name and coordinates
  const toggleLocationMode = () => {
    setFormData(prev => ({
      ...prev,
      useCoordinates: !prev.useCoordinates
    }))
  }

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return 'Please enter a first name'
    }
    if (!formData.lastName.trim()) {
      return 'Please enter a last name'
    }
    if (!formData.gender) {
      return 'Please select a gender'
    }
    if (!formData.birthDate) {
      return 'Please enter a birth date'
    }
    
    // Location validation
    if (formData.useCoordinates) {
      const lat = parseFloat(formData.locationLat)
      const lng = parseFloat(formData.locationLng)
      if (isNaN(lat) || isNaN(lng)) {
        return 'Please enter valid coordinates'
      }
      if (lat < -90 || lat > 90) {
        return 'Latitude must be between -90 and 90'
      }
      if (lng < -180 || lng > 180) {
        return 'Longitude must be between -180 and 180'
      }
    } else {
      // City name is optional, but if provided should not be empty
      if (formData.locationCity && !formData.locationCity.trim()) {
        return 'Please enter a valid city name or leave blank'
      }
    }
    
    return null
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      console.log('🎯 Creating profile with data:', formData)
      
      // Create profile - ProfileContext will handle all calculations
      const newProfile = await createProfile(formData)
      
      console.log('✅ Profile created:', newProfile)
      
      // Navigate to the new profile
      navigate(`/results/${newProfile.id}`)
    } catch (err) {
      console.error('❌ Error creating profile:', err)
      setError(err.message || 'Failed to create profile')
      setIsSubmitting(false)
    }
  }

  // Styles
  const inputClassName = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
  const labelClassName = "block text-white/80 text-sm font-medium mb-2"
  const sectionClassName = "mb-8"
  const sectionTitleClassName = "text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white/60 hover:text-white transition-colors mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">
          ✨ Create Cosmic Blueprint
        </h1>
        <p className="text-white/60">
          Enter birth information to generate a complete astrological profile
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              ⚠️ {error}
            </div>
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

            <div>
              <label className={labelClassName}>Gender *</label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(gender => (
                  <label key={gender} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={gender.toLowerCase()}
                      checked={formData.gender === gender.toLowerCase()}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-500"
                      required
                    />
                    <span className="text-white">{gender}</span>
                  </label>
                ))}
              </div>
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
          </div>

          {/* ═══════ SECTION 3: LOCATION - DIAMOND GRADE ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>📍</span> Birth Location
            </h2>
            
            <MapboxLocationPicker
              initialValue={formData.locationCity}
              onLocationSelect={(location) => {
                setFormData(prev => ({
                  ...prev,
                  locationCity: location.city,
                  locationLat: location.lat,
                  locationLng: location.lng,
                  useCoordinates: true // Mark that we have coordinates
                }))
              }}
            />
          </div>

          {/* ═══════ SECTION 4: BIG 5 PERSONALITY (OPTIONAL) ═══════ */}
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>
              <span>🧠</span> Big 5 Personality Traits <span className="text-sm text-white/40">(Optional)</span>
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Rate yourself on these five personality dimensions. Skip if you're unsure - these are optional!
            </p>

            {[
              { key: 'openness', label: 'Openness', low: 'Practical', high: 'Creative' },
              { key: 'conscientiousness', label: 'Conscientiousness', low: 'Spontaneous', high: 'Organized' },
              { key: 'extraversion', label: 'Extraversion', low: 'Reserved', high: 'Outgoing' },
              { key: 'agreeableness', label: 'Agreeableness', low: 'Competitive', high: 'Cooperative' },
              { key: 'neuroticism', label: 'Emotional Stability', low: 'Calm', high: 'Sensitive' }
            ].map(trait => (
              <div key={trait.key} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClassName}>{trait.label}</label>
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
                             [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-white/40 text-xs w-24 text-right">{trait.high}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════ SUBMIT BUTTON ═══════ */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
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
                  Creating Profile...
                </span>
              ) : (
                '✨ Generate Cosmic Blueprint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
