/**
 * Hospital Search Module
 * Uses Overpass API (OpenStreetMap) to find hospitals near a given location
 * Provides precise geocoding for birth chart calculations
 */

class HospitalSearch {
  constructor() {
    this.overpassUrl = 'https://overpass-api.de/api/interpreter';
    this.nominatimUrl = 'https://nominatim.openstreetmap.org/search';
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000; // 1 second between requests (rate limiting)
  }

  /**
   * Wait to respect rate limiting
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Get coordinates for a city using Nominatim
   */
  async getCityCoordinates(city, state, country) {
    await this.waitForRateLimit();
    
    // Build search query
    let query = city;
    if (state) query += `, ${state}`;
    if (country) query += `, ${country}`;

    console.log(`🌍 Geocoding: ${query}`);

    try {
      const url = `${this.nominatimUrl}?` + new URLSearchParams({
        q: query,
        format: 'json',
        limit: 1,
        addressdetails: 1
      });

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AstroProfile/1.0 (Birth Chart Calculator)'
        }
      });

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Location not found');
      }

      const result = data[0];
      console.log(`✅ Found: ${result.display_name}`);
      console.log(`  Coordinates: ${result.lat}, ${result.lon}`);

      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        address: result.address,
        timezone: this.guessTimezone(result.address)
      };
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Guess timezone from address (basic implementation)
   */
  guessTimezone(address) {
    // This is a simplified version - you may want to use a proper timezone API
    const countryTimezones = {
      'United States': 'America/New_York',
      'Canada': 'America/Toronto',
      'United Kingdom': 'Europe/London',
      'China': 'Asia/Shanghai',
      'India': 'Asia/Kolkata',
      'Pakistan': 'Asia/Karachi',
      'Australia': 'Australia/Sydney',
      'Germany': 'Europe/Berlin',
      'France': 'Europe/Paris',
      'Japan': 'Asia/Tokyo'
    };

    const country = address.country;
    return countryTimezones[country] || 'UTC';
  }

  /**
   * Search for hospitals near given coordinates
   */
  async searchHospitals(lat, lon, radiusKm = 15) {
    await this.waitForRateLimit();

    // Overpass QL query for hospitals and clinics
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lon});
        way["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lon});
        node["amenity"="clinic"]["healthcare"~"maternity|birthing_center"](around:${radiusKm * 1000},${lat},${lon});
        way["amenity"="clinic"]["healthcare"~"maternity|birthing_center"](around:${radiusKm * 1000},${lat},${lon});
        node["healthcare"="hospital"](around:${radiusKm * 1000},${lat},${lon});
        way["healthcare"="hospital"](around:${radiusKm * 1000},${lat},${lon});
      );
      out center;
    `;

    console.log(`🏥 Searching hospitals within ${radiusKm}km of ${lat}, ${lon}`);

    try {
      const response = await fetch(this.overpassUrl, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        throw new Error(`Hospital search failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Process results
      const hospitals = data.elements
        .filter(el => el.tags && el.tags.name) // Only hospitals with names
        .map(el => {
          const elemLat = el.lat || (el.center ? el.center.lat : null);
          const elemLon = el.lon || (el.center ? el.center.lon : null);
          
          return {
            id: el.id,
            name: el.tags.name,
            lat: elemLat,
            lon: elemLon,
            type: el.tags.amenity || el.tags.healthcare || 'hospital',
            address: this.formatAddress(el.tags),
            distance: this.calculateDistance(lat, lon, elemLat, elemLon)
          };
        })
        .filter(h => h.lat && h.lon) // Only valid coordinates
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 20); // Return top 20 results

      console.log(`✅ Found ${hospitals.length} hospitals`);
      return hospitals;
    } catch (error) {
      console.error('❌ Hospital search error:', error);
      throw error;
    }
  }

  /**
   * Format address from OSM tags
   */
  formatAddress(tags) {
    const parts = [];
    
    if (tags['addr:street']) {
      parts.push(tags['addr:street']);
    }
    if (tags['addr:city']) {
      parts.push(tags['addr:city']);
    }
    if (tags['addr:state']) {
      parts.push(tags['addr:state']);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  /**
   * Convert degrees to radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Search hospitals by name first, then location
   */
  async searchByNameAndLocation(hospitalName, city, state, country) {
    try {
      // First, get city coordinates
      const cityData = await this.getCityCoordinates(city, state, country);
      
      // Then search for hospitals nearby
      const hospitals = await this.searchHospitals(cityData.lat, cityData.lon);
      
      // If hospital name provided, filter/prioritize by name
      if (hospitalName && hospitalName.trim()) {
        const searchTerm = hospitalName.toLowerCase().trim();
        const filtered = hospitals.filter(h => 
          h.name.toLowerCase().includes(searchTerm)
        );
        
        if (filtered.length > 0) {
          console.log(`🎯 Found ${filtered.length} hospitals matching "${hospitalName}"`);
          return {
            cityData,
            hospitals: filtered,
            filtered: true
          };
        }
      }
      
      // Return all nearby hospitals
      return {
        cityData,
        hospitals,
        filtered: false
      };
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  }

  /**
   * Get precise location data for a selected hospital
   */
  getHospitalLocationData(hospital, cityData) {
    return {
      name: hospital.name,
      address: hospital.address,
      latitude: hospital.lat,
      longitude: hospital.lon,
      timezone: cityData.timezone,
      precision: 'hospital', // vs 'city'
      distance: hospital.distance,
      cityName: cityData.displayName
    };
  }
}

// Initialize global instance
const hospitalSearch = new HospitalSearch();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HospitalSearch;
}
