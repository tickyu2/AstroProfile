import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// ═══════════════════════════════════════════════════════════════════
// MAPBOX LOCATION PICKER - DIAMOND GRADE
// ═══════════════════════════════════════════════════════════════════
// Purpose: Search any location worldwide with hospital-grade precision
// Features:
// - Real-time search suggestions
// - Hospital/City/Address detection with icons
// - Beautiful animations
// - Coordinates auto-filled
// - Worldwide coverage
// ═══════════════════════════════════════════════════════════════════

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapboxLocationPicker({ onLocationSelect, initialValue = '' }) {
  const [searchQuery, setSearchQuery] = useState('')  // Always start empty - picker is just for searching
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const searchTimeoutRef = useRef(null)

  // No useEffect to sync with initialValue - picker is independent!
  // Parent form displays the selected value separately

  // Debounced search function
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setIsSearching(true)

    try {
      // Mapbox Geocoding API
      // Types: poi (points of interest like hospitals), address, place (cities)
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&types=poi,address,place&limit=8`
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.features) {
        // Process and categorize results
        const processedSuggestions = data.features.map(feature => {
          const [lng, lat] = feature.center
          const placeType = feature.place_type[0]
          const properties = feature.properties || {}
          
          // Detect if it's a hospital
          const isHospital = 
            properties.category?.includes('hospital') ||
            properties.category?.includes('clinic') ||
            properties.category?.includes('medical') ||
            feature.text?.toLowerCase().includes('hospital') ||
            feature.text?.toLowerCase().includes('medical center')

          // Determine icon and precision
          let icon, precision, category
          if (isHospital) {
            icon = '🏥'
            precision = '±10m (Hospital)'
            category = 'hospital'
          } else if (placeType === 'address') {
            icon = '🏠'
            precision = '±10m (Address)'
            category = 'address'
          } else if (placeType === 'poi') {
            icon = '📍'
            precision = '±100m (Landmark)'
            category = 'landmark'
          } else {
            icon = '🏙️'
            precision = '±15km (City)'
            category = 'city'
          }

          return {
            id: feature.id,
            name: feature.text,
            fullAddress: feature.place_name,
            coordinates: { lat, lng },
            icon,
            precision,
            category,
            placeType
          }
        })

        setSuggestions(processedSuggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error searching locations:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query)
    }, 300) // Wait 300ms after user stops typing
  }

  // Handle location selection
  const handleSelectLocation = (location) => {
    setSearchQuery('')  // Clear search field after selection
    setSelectedLocation(location)
    setShowSuggestions(false)
    setSuggestions([])  // Clear suggestions
    
    // Notify parent component
    if (onLocationSelect) {
      onLocationSelect({
        city: location.fullAddress,
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        precision: location.precision,
        category: location.category,
        icon: location.icon
      })
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.location-search-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="location-search-container relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Type any city, hospital, or address..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                   placeholder-white/30 focus:outline-none focus:border-cyan-500/50 
                   focus:bg-white/10 transition-all pr-10"
        />
        
        {/* Search Icon / Loading Spinner */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-cyan-400"
            >
              🔍
            </motion.div>
          ) : (
            <span className="text-white/40">🔍</span>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-xl rounded-lg 
                     border border-white/10 shadow-2xl overflow-hidden max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectLocation(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors
                         border-b border-white/5 last:border-b-0 group"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {suggestion.icon}
                  </span>
                  
                  {/* Location Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-white/60 truncate">
                      {suggestion.fullAddress}
                    </div>
                    <div className="text-xs text-cyan-400/80 mt-1">
                      {suggestion.precision}
                    </div>
                  </div>

                  {/* Arrow */}
                  <span className="text-white/30 group-hover:text-cyan-400 transition-colors flex-shrink-0">
                    →
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Location Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xl">{selectedLocation.icon}</span>
            <div className="flex-1">
              <div className="text-cyan-400 font-medium">
                {selectedLocation.name}
              </div>
              <div className="text-white/60 text-xs">
                {selectedLocation.coordinates.lat.toFixed(4)}°N, {Math.abs(selectedLocation.coordinates.lng).toFixed(4)}°W
              </div>
            </div>
            <div className="text-xs text-cyan-400/80">
              {selectedLocation.precision}
            </div>
          </div>
        </motion.div>
      )}

      {/* Helper Text */}
      <p className="text-white/40 text-xs mt-2">
        💡 Search for your birth city, hospital, or exact address for precise calculations
      </p>
    </div>
  )
}
