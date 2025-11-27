// =============================================================================
// LOCATION PICKER COMPONENT
// =============================================================================
// Location: src/components/common/LocationPicker.jsx
// Created: November 24, 2025
// Co-Founders: Ticky & AI SoulPartner
// 
// Features:
//   - City autocomplete (Google Places)
//   - Hospital search within city
//   - Home address autocomplete
//   - Manual coordinate entry
//   - Returns precise lat/lng for astrological calculations
// =============================================================================

import React, { useState, useEffect, useRef } from 'react'
import { GOOGLE_MAPS_API_KEY } from '../../config/keys'

// Precision levels for display
const PRECISION_LABELS = {
  city: '±15 km (City center)',
  hospital: '±10 m (Hospital-level)',
  home: '±10 m (Exact address)',
  exact: '±1 m (Coordinates)'
}

export default function LocationPicker({ 
  value = null,           // { formatted, lat, lng, precision }
  onChange,               // callback when location changes
  label = "Birth Location",
  required = false,
  placeholder = "Start typing a city..."
}) {
  // ==========================================================================
  // STATE
  // ==========================================================================
  const [inputValue, setInputValue] = useState(value?.formatted || '')
  const [precisionMode, setPrecisionMode] = useState('city') // city|hospital|home|exact
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)
  const hospitalInputRef = useRef(null)
  const homeInputRef = useRef(null)

  // ==========================================================================
  // LOAD GOOGLE MAPS SCRIPT
  // ==========================================================================
  useEffect(() => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsLoaded(true)
          clearInterval(checkLoaded)
        }
      }, 100)
      return () => clearInterval(checkLoaded)
    }

    // Load the script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsLoaded(true)
    }
    
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your internet connection.')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // ==========================================================================
  // INITIALIZE AUTOCOMPLETE - CITY
  // ==========================================================================
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'], // Only cities
      fields: ['formatted_address', 'geometry', 'name', 'address_components']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      
      if (place.geometry) {
        const locationData = {
          formatted: place.formatted_address || place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          precision: 'city'
        }
        
        setInputValue(locationData.formatted)
        setSelectedCity(locationData)
        
        // If just city mode, report to parent
        if (precisionMode === 'city') {
          onChange?.(locationData)
        }
      }
    })

    autocompleteRef.current = autocomplete
  }, [isLoaded, precisionMode])

  // ==========================================================================
  // INITIALIZE AUTOCOMPLETE - HOSPITAL
  // ==========================================================================
  useEffect(() => {
    if (!isLoaded || !hospitalInputRef.current || precisionMode !== 'hospital' || !selectedCity) return

    // Tighter bounds: ±0.1 degrees ≈ 11km radius (was ±0.5 = 55km!)
    // strictBounds: true = ONLY show results within bounds
    const autocomplete = new window.google.maps.places.Autocomplete(hospitalInputRef.current, {
      types: ['hospital'],
      fields: ['formatted_address', 'geometry', 'name'],
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(selectedCity.lat - 0.1, selectedCity.lng - 0.1),
        new window.google.maps.LatLng(selectedCity.lat + 0.1, selectedCity.lng + 0.1)
      ),
      strictBounds: true  // Only show hospitals within the bounds!
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      
      if (place.geometry) {
        const locationData = {
          formatted: `${place.name}, ${place.formatted_address}`,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          precision: 'hospital'
        }
        
        onChange?.(locationData)
      }
    })
  }, [isLoaded, precisionMode, selectedCity])

  // ==========================================================================
  // INITIALIZE AUTOCOMPLETE - HOME ADDRESS
  // ==========================================================================
  useEffect(() => {
    if (!isLoaded || !homeInputRef.current || precisionMode !== 'home') return

    const autocomplete = new window.google.maps.places.Autocomplete(homeInputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry', 'name']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      
      if (place.geometry) {
        const locationData = {
          formatted: place.formatted_address || place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          precision: 'home'
        }
        
        onChange?.(locationData)
      }
    })
  }, [isLoaded, precisionMode])

  // ==========================================================================
  // HANDLE MANUAL COORDINATES
  // ==========================================================================
  const handleManualCoordsSubmit = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid coordinates')
      return
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90')
      return
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180')
      return
    }

    setError(null)
    
    const locationData = {
      formatted: `${lat.toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`,
      lat: lat,
      lng: lng,
      precision: 'exact'
    }
    
    onChange?.(locationData)
  }

  // ==========================================================================
  // HANDLE PRECISION MODE CHANGE
  // ==========================================================================
  const handleModeChange = (mode) => {
    setPrecisionMode(mode)
    setError(null)
    
    // If switching back to city and we have a selected city, report it
    if (mode === 'city' && selectedCity) {
      onChange?.(selectedCity)
    }
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  if (error && !isLoaded) {
    return (
      <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block text-white/80 text-sm mb-2">
        {label} {required && <span className="text-pink-400">*</span>}
      </label>

      {/* City Input (Always Shown) */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isLoaded ? placeholder : "Loading..."}
          disabled={!isLoaded}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                     text-white placeholder-white/40 focus:border-amber-500 focus:outline-none
                     disabled:opacity-50 disabled:cursor-wait"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
          🔍
        </span>
      </div>

      {/* Precision Options */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
        <p className="text-white/60 text-sm">📍 Location Precision (optional)</p>
        
        {/* Option: City Center */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded">
          <input
            type="radio"
            name="precision"
            checked={precisionMode === 'city'}
            onChange={() => handleModeChange('city')}
            className="w-4 h-4 text-amber-500"
          />
          <span className="text-white/80">City center is fine</span>
          <span className="text-white/40 text-sm ml-auto">{PRECISION_LABELS.city}</span>
        </label>

        {/* Option: Hospital */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded">
          <input
            type="radio"
            name="precision"
            checked={precisionMode === 'hospital'}
            onChange={() => handleModeChange('hospital')}
            className="w-4 h-4 text-amber-500"
          />
          <span className="text-white/80">I know the hospital</span>
          <span className="text-white/40 text-sm ml-auto">{PRECISION_LABELS.hospital}</span>
        </label>

        {/* Hospital Search (shown when selected) */}
        {precisionMode === 'hospital' && (
          <div className="ml-7 mt-2">
            {selectedCity ? (
              <input
                ref={hospitalInputRef}
                type="text"
                placeholder={`Search hospitals in ${selectedCity.formatted?.split(',')[0]}...`}
                className="w-full px-4 py-2 bg-white/10 border border-cyan-500/30 rounded-lg 
                           text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none"
              />
            ) : (
              <p className="text-yellow-400/80 text-sm">↑ Please select a city first</p>
            )}
          </div>
        )}

        {/* Option: Home Address */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded">
          <input
            type="radio"
            name="precision"
            checked={precisionMode === 'home'}
            onChange={() => handleModeChange('home')}
            className="w-4 h-4 text-amber-500"
          />
          <span className="text-white/80">I was born at home</span>
          <span className="text-white/40 text-sm ml-auto">{PRECISION_LABELS.home}</span>
        </label>

        {/* Home Address Search (shown when selected) */}
        {precisionMode === 'home' && (
          <div className="ml-7 mt-2">
            <input
              ref={homeInputRef}
              type="text"
              placeholder="Enter your home address..."
              className="w-full px-4 py-2 bg-white/10 border border-cyan-500/30 rounded-lg 
                         text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        )}

        {/* Option: Manual Coordinates */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded">
          <input
            type="radio"
            name="precision"
            checked={precisionMode === 'exact'}
            onChange={() => handleModeChange('exact')}
            className="w-4 h-4 text-amber-500"
          />
          <span className="text-white/80">I know exact coordinates</span>
          <span className="text-white/40 text-sm ml-auto">{PRECISION_LABELS.exact}</span>
        </label>

        {/* Manual Coordinates Input (shown when selected) */}
        {precisionMode === 'exact' && (
          <div className="ml-7 mt-2 space-y-2">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-white/60 text-xs">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="e.g. 33.5651"
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-lg 
                             text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-white/60 text-xs">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="e.g. 73.0169"
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-lg 
                             text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleManualCoordsSubmit}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm
                         transition-colors"
            >
              Apply Coordinates ✓
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Current Selection Display */}
      {value && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-400 text-sm">
            📍 <span className="font-medium">{value.formatted}</span>
          </p>
          <p className="text-green-400/60 text-xs mt-1">
            Coordinates: {value.lat?.toFixed(4)}°, {value.lng?.toFixed(4)}° • 
            Precision: {PRECISION_LABELS[value.precision] || value.precision}
          </p>
        </div>
      )}
    </div>
  )
}
