// Geocoding Utility - Get coordinates and timezone from birth location
// Uses Nominatim (OpenStreetMap) - Free, no API key required

/**
 * Get coordinates and timezone for a birth location
 * @param {string} city - Birth city
 * @param {string} state - Birth state (optional)
 * @param {string} country - Birth country
 * @returns {Promise<Object>} Location data with lat, long, timezone
 */
async function getLocationData(city, state, country) {
    try {
        // Build search query
        let query = city;
        if (state) query += `, ${state}`;
        query += `, ${country}`;
        
        console.log(`🌍 Geocoding: ${query}`);
        
        // Use Nominatim API (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?` + 
            `q=${encodeURIComponent(query)}` +
            `&format=json` +
            `&limit=1` +
            `&addressdetails=1`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AstroProfile/1.0' // Required by Nominatim
            }
        });
        
        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error('Location not found');
        }
        
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        
        console.log(`✅ Found: ${location.display_name}`);
        console.log(`  Coordinates: ${lat}, ${lon}`);
        
        // Get timezone using coordinates
        const timezone = await getTimezoneFromCoords(lat, lon);
        
        return {
            latitude: lat,
            longitude: lon,
            timezone: timezone,
            display_name: location.display_name,
            success: true
        };
        
    } catch (error) {
        console.error('❌ Geocoding error:', error);
        return {
            latitude: null,
            longitude: null,
            timezone: null,
            display_name: null,
            success: false,
            error: error.message
        };
    }
}

/**
 * Get timezone from coordinates
 * Uses a simple lookup for major cities, or browser API
 */
async function getTimezoneFromCoords(lat, lon) {
    // Major timezone regions (simplified)
    const timezoneRegions = [
        // Asia
        { name: 'Asia/Shanghai', lat: [18, 54], lon: [73, 135] },
        { name: 'Asia/Tokyo', lat: [24, 46], lon: [123, 154] },
        { name: 'Asia/Kolkata', lat: [8, 35], lon: [68, 97] },
        { name: 'Asia/Dubai', lat: [22, 26], lon: [51, 56] },
        
        // Americas
        { name: 'America/New_York', lat: [25, 50], lon: [-85, -66] },
        { name: 'America/Chicago', lat: [25, 50], lon: [-106, -86] },
        { name: 'America/Denver', lat: [31, 49], lon: [-114, -102] },
        { name: 'America/Los_Angeles', lat: [32, 49], lon: [-125, -114] },
        
        // Europe
        { name: 'Europe/London', lat: [50, 59], lon: [-6, 2] },
        { name: 'Europe/Paris', lat: [42, 51], lon: [-5, 8] },
        { name: 'Europe/Berlin', lat: [47, 55], lon: [6, 15] },
        { name: 'Europe/Moscow', lat: [55, 67], lon: [37, 50] },
        
        // Others
        { name: 'Australia/Sydney', lat: [-44, -10], lon: [141, 154] },
        { name: 'Africa/Cairo', lat: [22, 32], lon: [25, 35] }
    ];
    
    // Find matching timezone
    for (const tz of timezoneRegions) {
        if (lat >= tz.lat[0] && lat <= tz.lat[1] && 
            lon >= tz.lon[0] && lon <= tz.lon[1]) {
            return tz.name;
        }
    }
    
    // Fallback: Try to use TimeZoneDB API or return UTC offset
    try {
        // For production, you'd use a timezone API like:
        // https://timezonedb.com/api or https://timeapi.io
        // For now, estimate from longitude (rough approximation)
        const utcOffset = Math.round(lon / 15);
        return `UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
    } catch {
        return 'UTC+0';
    }
}

/**
 * Format coordinates for display
 */
function formatCoordinates(lat, lon) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    
    return {
        latitude: `${Math.abs(lat).toFixed(4)}° ${latDir}`,
        longitude: `${Math.abs(lon).toFixed(4)}° ${lonDir}`,
        decimal: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    };
}

/**
 * Calculate UTC offset from timezone name
 */
function getUTCOffset(timezoneName) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezoneName,
            timeZoneName: 'short'
        });
        
        const parts = formatter.formatToParts(now);
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        
        if (tzPart && tzPart.value.includes('GMT')) {
            return tzPart.value;
        }
        
        // Calculate offset manually
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezoneName }));
        const offset = (tzDate - utcDate) / (1000 * 60 * 60);
        
        return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    } catch {
        return 'UTC+0';
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        getLocationData, 
        getTimezoneFromCoords,
        formatCoordinates,
        getUTCOffset
    };
}
