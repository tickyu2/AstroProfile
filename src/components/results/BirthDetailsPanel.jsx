import React from 'react'

export default function BirthDetailsPanel({ profile, age }) {
    // Helper function to format coordinates
    const formatCoordinates = (lat, lng) => {
        if (!lat || !lng) return null
        const latFormatted = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`
        const lngFormatted = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`
        return `${latFormatted}, ${lngFormatted}`
    }

    // Helper function to get precision label
    const getPrecisionLabel = (precision) => {
        switch(precision) {
            case 'hospital': return '±10 m (Hospital-level)'
            case 'home': return '±10 m (Exact address)'
            case 'coordinates': return '±1 m (Coordinates)'
            case 'city':
            default: return '±15 km (City center)'
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
        // FALLBACK: Just birthLocation string
        else if (typeof profile.birthLocation === 'string' && profile.birthLocation) {
            return {
                display: profile.birthLocation,
                coordinates: null,
                precision: null
            }
        }
        return null
    }

    const locationData = getLocationDisplay()

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-1">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">📍</span>
                <h2 className="text-sm font-bold text-amber-400">BIRTH DETAILS</h2>
            </div>
            
            <div className="space-y-2">
                {/* Name */}
                {(profile.firstName || profile.lastName) && (
                    <div className="bg-slate-900/40 rounded-lg p-2">
                        <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Name</div>
                        <div className="text-sm text-white font-semibold">
                            {profile.firstName} {profile.lastName}
                        </div>
                    </div>
                )}

                {/* Gender */}
                {profile.gender && (
                    <div className="bg-slate-900/40 rounded-lg p-2">
                        <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Gender</div>
                        <div className="text-sm text-white font-semibold">
                            {profile.gender === 'male' ? '👨 Male' : '👩 Female'}
                        </div>
                    </div>
                )}

                {/* Date */}
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Date</div>
                    <div className="text-sm text-white font-semibold">
                        {new Date(profile.birthDate + 'T12:00:00').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
                
                {/* Time */}
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Time</div>
                    <div className="text-sm text-white font-semibold">
                        {profile.birthTime || '12:00 PM (default)'}
                    </div>
                    {(profile.birthTime === '12:00' || !profile.birthTime) && (
                        <div className="text-[10px] text-white/40 mt-0.5">
                            💡 Default time - update for Hour Pillar precision
                        </div>
                    )}
                </div>
                
                {/* Location */}
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Location</div>
                    {locationData ? (
                        <>
                            <div className="text-sm text-white font-semibold">
                                📍 {locationData.display}
                            </div>
                            
                            {/* Show coordinates if available */}
                            {locationData.coordinates && (
                                <div className="text-[10px] text-white/40 mt-1">
                                    Coordinates: {formatCoordinates(
                                        locationData.coordinates.lat, 
                                        locationData.coordinates.lng
                                    )}
                                </div>
                            )}
                            
                            {/* Show precision if available */}
                            {locationData.precision && (
                                <div className="text-[10px] text-purple-400 mt-1">
                                    Precision: {getPrecisionLabel(locationData.precision)}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-sm text-white/50">
                            Unknown
                        </div>
                    )}
                </div>
                
                {/* Age - FIXED! Show years, months, days */}
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Age (as of today)</div>
                    <div className="text-sm text-white font-semibold">
                        {age?.years || 0} years
                        {age?.months > 0 && `, ${age.months} month${age.months !== 1 ? 's' : ''}`}
                        {age?.days > 0 && `, ${age.days} day${age.days !== 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* Hospital-Level Precision Notice */}
                {locationData?.coordinates && (
                    <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/30">
                        <div className="flex items-center gap-2">
                            <span className="text-xs">💡</span>
                            <div className="text-[10px] text-amber-300 font-semibold">
                                Hospital-Level Precision: Your Ascendant changes every 4 minutes. Accurate birth time and location matter.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
