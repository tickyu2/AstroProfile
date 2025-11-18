/**
 * Hospital Search UI Controller
 * Manages the advanced location entry interface and hospital search functionality
 */

class HospitalSearchUI {
  constructor() {
    this.currentSearchResults = null;
    this.selectedHospital = null;
    this.cityCoordinates = null;
    
    this.initializeEventListeners();
  }

  /**
   * Initialize all event listeners
   */
  initializeEventListeners() {
    // Location mode toggle
    const locationModeInputs = document.querySelectorAll('input[name="locationMode"]');
    locationModeInputs.forEach(input => {
      input.addEventListener('change', (e) => this.handleLocationModeChange(e));
    });

    // Search hospitals button
    const searchBtn = document.getElementById('searchHospitalsBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.handleSearchHospitals());
    }

    // Hospital selection
    const hospitalSelect = document.getElementById('hospitalSelect');
    if (hospitalSelect) {
      hospitalSelect.addEventListener('change', (e) => this.handleHospitalSelection(e));
    }

    // Manual coordinates
    const manualLat = document.getElementById('manualLat');
    const manualLon = document.getElementById('manualLon');
    if (manualLat && manualLon) {
      manualLat.addEventListener('input', () => this.handleManualCoordinates());
      manualLon.addEventListener('input', () => this.handleManualCoordinates());
    }
  }

  /**
   * Handle location mode toggle (Basic vs Advanced)
   */
  handleLocationModeChange(event) {
    const advancedFields = document.getElementById('advancedLocationFields');
    const isAdvanced = event.target.value === 'advanced';
    
    if (advancedFields) {
      advancedFields.style.display = isAdvanced ? 'block' : 'none';
    }

    // Clear advanced fields if switching back to basic
    if (!isAdvanced) {
      this.clearAdvancedFields();
    }
  }

  /**
   * Handle hospital search button click
   */
  async handleSearchHospitals() {
    const hospitalName = document.getElementById('hospitalName').value.trim();
    const city = document.getElementById('birthCity').value.trim();
    const state = document.getElementById('birthState').value.trim();
    const country = document.getElementById('birthCountry').value.trim();

    // Validation
    if (!city || !country) {
      this.showError('Please enter birth city and country first');
      return;
    }

    // Show loading state
    this.showSearchStatus('Searching hospitals...');
    const searchBtn = document.getElementById('searchHospitalsBtn');
    searchBtn.disabled = true;

    try {
      // Search hospitals
      const results = await hospitalSearch.searchByNameAndLocation(
        hospitalName, 
        city, 
        state, 
        country
      );

      this.currentSearchResults = results;
      this.cityCoordinates = results.cityData;

      // Display results
      this.displayHospitalResults(results);

    } catch (error) {
      console.error('Hospital search error:', error);
      this.showError(`Search failed: ${error.message}`);
    } finally {
      this.hideSearchStatus();
      searchBtn.disabled = false;
    }
  }

  /**
   * Display hospital search results
   */
  displayHospitalResults(results) {
    const container = document.getElementById('hospitalResultsContainer');
    const select = document.getElementById('hospitalSelect');
    const resultsCount = container.querySelector('.results-count');

    if (!results.hospitals || results.hospitals.length === 0) {
      this.showError('No hospitals found in this area. Try a larger city or use basic mode.');
      return;
    }

    // Clear previous results
    select.innerHTML = '';

    // Add "Use city center" option
    const cityOption = document.createElement('option');
    cityOption.value = 'city';
    cityOption.textContent = `📍 Use city center (${results.cityData.displayName})`;
    select.appendChild(cityOption);

    // Add separator
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '─────────────────────';
    select.appendChild(separator);

    // Add hospital options
    results.hospitals.forEach((hospital, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `🏥 ${hospital.name} (${hospital.distance}km)`;
      option.dataset.hospitalData = JSON.stringify(hospital);
      select.appendChild(option);
    });

    // Update results count
    if (results.filtered) {
      resultsCount.textContent = `Found ${results.hospitals.length} matching hospitals`;
    } else {
      resultsCount.textContent = `Found ${results.hospitals.length} hospitals within 15km`;
    }

    // Show container
    container.style.display = 'block';

    console.log('✅ Displayed hospital results');
  }

  /**
   * Handle hospital selection from dropdown
   */
  handleHospitalSelection(event) {
    const select = event.target;
    const selectedValue = select.value;

    if (selectedValue === 'city') {
      // User selected city center
      this.selectedHospital = null;
      this.showLocationPreview({
        name: 'City Center',
        address: this.cityCoordinates.displayName,
        lat: this.cityCoordinates.lat,
        lon: this.cityCoordinates.lon,
        precision: 'city'
      });
    } else {
      // User selected a hospital
      const option = select.options[select.selectedIndex];
      const hospitalData = JSON.parse(option.dataset.hospitalData);
      this.selectedHospital = hospitalData;
      
      this.showLocationPreview({
        name: hospitalData.name,
        address: hospitalData.address,
        lat: hospitalData.lat,
        lon: hospitalData.lon,
        distance: hospitalData.distance,
        precision: 'hospital'
      });
    }

    // Update form with location data
    this.updateFormLocation();
  }

  /**
   * Show preview of selected location
   */
  showLocationPreview(location) {
    const preview = document.getElementById('selectedHospitalPreview');
    const nameEl = preview.querySelector('.preview-name');
    const addressEl = preview.querySelector('.preview-address');
    const coordsEl = preview.querySelector('.preview-coords');

    nameEl.textContent = location.name;
    addressEl.textContent = location.address;
    coordsEl.textContent = `Coordinates: ${location.lat.toFixed(4)}° N, ${location.lon.toFixed(4)}° E`;

    if (location.distance) {
      coordsEl.textContent += ` (${location.distance}km from city center)`;
    }

    preview.style.display = 'block';

    console.log('✅ Location preview updated:', location.name);
  }

  /**
   * Handle manual coordinate entry
   */
  handleManualCoordinates() {
    const lat = parseFloat(document.getElementById('manualLat').value);
    const lon = parseFloat(document.getElementById('manualLon').value);

    if (!isNaN(lat) && !isNaN(lon)) {
      // Valid coordinates entered
      this.selectedHospital = null;
      this.showLocationPreview({
        name: 'Manual Coordinates',
        address: 'User-provided GPS coordinates',
        lat: lat,
        lon: lon,
        precision: 'manual'
      });

      this.updateFormLocation({
        latitude: lat,
        longitude: lon,
        precision: 'manual'
      });
    }
  }

  /**
   * Update form with selected location data
   */
  updateFormLocation(manualData = null) {
    // Store location data in hidden inputs or data attributes
    const form = document.querySelector('form');
    
    if (manualData) {
      // Manual coordinates
      form.dataset.latitude = manualData.latitude;
      form.dataset.longitude = manualData.longitude;
      form.dataset.precision = manualData.precision;
      form.dataset.timezone = this.cityCoordinates?.timezone || 'UTC';
    } else if (this.selectedHospital) {
      // Hospital selected
      form.dataset.latitude = this.selectedHospital.lat;
      form.dataset.longitude = this.selectedHospital.lon;
      form.dataset.precision = 'hospital';
      form.dataset.hospitalName = this.selectedHospital.name;
      form.dataset.timezone = this.cityCoordinates.timezone;
    } else if (this.cityCoordinates) {
      // City center
      form.dataset.latitude = this.cityCoordinates.lat;
      form.dataset.longitude = this.cityCoordinates.lon;
      form.dataset.precision = 'city';
      form.dataset.timezone = this.cityCoordinates.timezone;
    }

    console.log('📍 Form location updated:', form.dataset);
  }

  /**
   * Get location data for profile saving
   */
  getLocationData() {
    const form = document.querySelector('form');
    
    return {
      city: document.getElementById('birthCity').value.trim(),
      state: document.getElementById('birthState').value.trim(),
      country: document.getElementById('birthCountry').value.trim(),
      latitude: parseFloat(form.dataset.latitude),
      longitude: parseFloat(form.dataset.longitude),
      timezone: form.dataset.timezone,
      precision: form.dataset.precision,
      hospitalName: form.dataset.hospitalName || null
    };
  }

  /**
   * Show search status
   */
  showSearchStatus(message) {
    const status = document.getElementById('hospitalSearchStatus');
    const statusText = status.querySelector('.status-text');
    
    statusText.textContent = message;
    status.style.display = 'flex';
  }

  /**
   * Hide search status
   */
  hideSearchStatus() {
    const status = document.getElementById('hospitalSearchStatus');
    status.style.display = 'none';
  }

  /**
   * Show error message
   */
  showError(message) {
    // You can customize this to match your app's error handling
    alert(message);
    console.error('❌', message);
  }

  /**
   * Clear advanced fields
   */
  clearAdvancedFields() {
    document.getElementById('hospitalName').value = '';
    document.getElementById('hospitalSelect').innerHTML = '';
    document.getElementById('hospitalResultsContainer').style.display = 'none';
    document.getElementById('selectedHospitalPreview').style.display = 'none';
    document.getElementById('manualLat').value = '';
    document.getElementById('manualLon').value = '';
    
    this.currentSearchResults = null;
    this.selectedHospital = null;
    this.cityCoordinates = null;
  }

  /**
   * Validate location data before form submission
   */
  validateLocationData() {
    const locationMode = document.querySelector('input[name="locationMode"]:checked').value;
    
    if (locationMode === 'basic') {
      // Basic mode - just need city and country
      const city = document.getElementById('birthCity').value.trim();
      const country = document.getElementById('birthCountry').value.trim();
      return city && country;
    } else {
      // Advanced mode - need coordinates
      const form = document.querySelector('form');
      return form.dataset.latitude && form.dataset.longitude;
    }
  }
}

// Initialize hospital search UI when DOM is ready
let hospitalSearchUI;

document.addEventListener('DOMContentLoaded', () => {
  hospitalSearchUI = new HospitalSearchUI();
  console.log('✅ Hospital Search UI initialized');
});

// Export for use in form submission
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HospitalSearchUI;
}
