import React from 'react'

export default function BirthDetailsPanel({ profile, age }) {
    // Helper function to format coordinates
    const formatCoordinates = (lat, lng) => {
        if (!lat || !lng) return null
        const latFormatted = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`
        const lngFormatted = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`
        return `${latFormatted}, ${lngFormatted}`
    }

    // Helper function to get precision icon
    const getPrecisionIcon = (precision) => {
        switch(precision) {
            case 'hospital': return '🏥'
            case 'home': return '🏠'
            case 'coordinates': return '🎯'
            case 'city':
            default: return '🌆'
        }
    }

    // Helper function to get precision label
    const getPrecisionLabel = (precision) => {
        switch(precision) {
            case 'hospital': return 'Hospital-level (±10m)'
            case 'home': return 'Exact address (±10m)'
            case 'coordinates': return 'Precise coordinates (±1m)'
            case 'city':
            default: return 'City center (±15km)'
        }
    }

    // Extract location data - handle both old and new formats
    const getLocationDisplay = () => {
        // NEW FORMAT: location.fullAddress
        if (profile.location?.fullAddress) {
            return {
                display: profile.location.fullAddress,
                coordinates: profile.location.coordinates,
                precision: profile.location.locationType || 'city'
            }
        }
        // OLD FORMAT: birthLocation.city
        else if (profile.birthLocation?.city) {
            return {
                display: `${profile.birthLocation.city}${profile.birthLocation.country ? ', ' + profile.birthLocation.country : ''}`,
                coordinates: profile.birthLocation.coordinates,
                precision: null
            }
        }
        // FALLBACK: Just birthLocation string (with coordinates if available)
        else if (typeof profile.birthLocation === 'string' && profile.birthLocation) {
            const lat = profile.birthLat || profile.location?.coordinates?.lat
            const lng = profile.birthLng || profile.location?.coordinates?.lng
            return {
                display: profile.birthLocation,
                coordinates: (lat && lng) ? { lat, lng } : null,
                precision: profile.birthPrecision || null
            }
        }
        // COORDINATES ONLY: User entered manual coordinates without address
        else if ((profile.birthLat || profile.location?.coordinates?.lat) && 
                 (profile.birthLng || profile.location?.coordinates?.lng)) {
            const lat = profile.birthLat || profile.location?.coordinates?.lat
            const lng = profile.birthLng || profile.location?.coordinates?.lng
            return {
                display: 'Precise Coordinates',
                coordinates: { lat, lng },
                precision: 'coordinates'
            }
        }
        return null
    }

    const locationData = getLocationDisplay()

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-purple-950/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Fibonacci spiral decoration - subtle */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M 50 50 Q 90 50 90 10" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-amber-400"/>
                    <path d="M 50 50 Q 50 90 10 90" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-purple-400"/>
                </svg>
            </div>

            {/* Header - 1/3 of visual weight (Golden Ratio) */}
            <div className="relative px-6 pt-6 pb-4 border-b border-amber-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center backdrop-blur-sm border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">📍</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                                BIRTH DETAILS
                            </h2>
                            <p className="text-xs text-white/40">Your cosmic coordinates</p>
                        </div>
                    </div>
                    
                    {/* Precision badge */}
                    {locationData?.precision && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                            <span className="text-sm">{getPrecisionIcon(locationData.precision)}</span>
                            <span className="text-xs text-amber-300 font-semibold whitespace-nowrap">
                                {getPrecisionLabel(locationData.precision)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Content - 2/3 of visual weight (Golden Ratio) */}
            <div className="relative px-6 py-5 space-y-4">
                {/* Identity Section - Φ spacing (1.618) */}
                {(profile.firstName || profile.lastName || profile.gender) && (
                    <div className="space-y-3">
                        {/* Name - Dominant element */}
                        {(profile.firstName || profile.lastName) && (
                            <div className="relative pl-12">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                                    <span className="text-xl">✨</span>
                                </div>
                                <div className="text-[10px] text-amber-300/60 uppercase tracking-[0.15em] font-semibold mb-1">Identity</div>
                                <div className="text-2xl text-white font-bold tracking-tight">
                                    {profile.firstName} {profile.lastName}
                                </div>
                            </div>
                        )}
                        
                        {/* Gender - Supporting element */}
                        {profile.gender && (
                            <div className="pl-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <span className="text-sm">{profile.gender === 'male' ? '♂️' : '♀️'}</span>
                                    <span className="text-sm text-white/80 font-medium capitalize">{profile.gender}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Birth Moment - Dual column layout (Pi ratio ~3.14 = 2+1) */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Date */}
                    <div className="relative group/item">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-cyan-400/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🌅</span>
                                <div className="text-[10px] text-cyan-300/60 uppercase tracking-wide font-semibold">Birth Date</div>
                            </div>
                            <div className="text-base text-white font-bold leading-tight">
                                {new Date(profile.birthDate + 'T12:00:00').toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Time */}
                    <div className="relative group/item">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-purple-400/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🕐</span>
                                <div className="text-[10px] text-purple-300/60 uppercase tracking-wide font-semibold">Birth Time</div>
                            </div>
                            <div className="text-base text-white font-bold leading-tight">
                                {profile.birthTime || '12:00'}
                            </div>
                            {(profile.birthTime === '12:00' || !profile.birthTime) && (
                                <div className="text-[9px] text-amber-400/60 mt-1 font-medium">
                                    ⚠️ Default time
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location - Full width (dominant) */}
                {locationData && (
                    <div className="relative group/location">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover/location:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-400/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🌍</span>
                                <div className="text-[10px] text-emerald-300/60 uppercase tracking-wide font-semibold">Birth Location</div>
                            </div>
                            <div className="text-base text-white font-bold mb-1">
                                {locationData.display}
                            </div>
                            
                            {/* Coordinates - subordinate info */}
                            {locationData.coordinates && (
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-white/40 font-mono">
                                    <span>📐</span>
                                    <span>
                                        {formatCoordinates(
                                            locationData.coordinates.lat, 
                                            locationData.coordinates.lng
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Age - Timeline element */}
                <div className="relative group/age">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover/age:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-rose-400/30 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⏳</span>
                            <div className="text-[10px] text-rose-300/60 uppercase tracking-wide font-semibold">Current Age</div>
                        </div>
                        <div className="text-base text-white font-bold">
                            {age?.years || 0} years
                            {age?.months > 0 && (
                                <span className="text-white/60 font-normal text-sm">
                                    , {age.months} month{age.months !== 1 ? 's' : ''}
                                </span>
                            )}
                            {age?.days > 0 && (
                                <span className="text-white/40 font-normal text-xs">
                                    , {age.days} day{age.days !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Precision Notice - Only if high precision */}
                {locationData?.coordinates && (locationData.precision === 'hospital' || locationData.precision === 'home' || locationData.precision === 'coordinates') && (
                    <div className="relative mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/30 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">💡</span>
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-amber-200 font-bold mb-1">Hospital-Level Precision Achieved</div>
                                <div className="text-[10px] text-amber-300/70 leading-relaxed">
                                    Your Ascendant changes every 4 minutes. This precision ensures your rising sign calculation is astronomically accurate.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Subtle bottom gradient */}
            <div className="h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0"></div>
        </div>
    )
}
