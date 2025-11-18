/**
 * AstroProfile - Main Application Logic
 * Form handling and profile management
 */

// Generate unique profile ID
function generateProfileId() {
  return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle form submission
async function handleFormSubmission(event) {
  event.preventDefault();
  
  console.log('📝 Form submitted');
  
  try {
    // Get basic form data
    const name = document.getElementById('name').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const birthTime = document.getElementById('birthTime').value;
    
    if (!name || !birthDate || !birthTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get location data based on mode
    const locationMode = document.querySelector('input[name="locationMode"]:checked').value;
    let locationData;
    
    if (locationMode === 'basic') {
      // BASIC MODE: Simple city + country
      const city = document.getElementById('birthCity').value.trim();
      const country = document.getElementById('birthCountry').value.trim();
      const state = document.getElementById('birthState').value.trim();
      
      if (!city || !country) {
        alert('Please enter birth city and country');
        return;
      }
      
      // Use existing geocoding if available, or create basic location data
      locationData = {
        city: city,
        state: state || null,
        country: country,
        latitude: null,
        longitude: null,
        timezone: 'UTC',
        precision: 'city'
      };
      
      console.log('🌍 Basic mode - location:', locationData);
      
    } else {
      // ADVANCED MODE: Hospital search
      if (typeof hospitalSearchUI === 'undefined') {
        alert('Hospital search not initialized. Please use Basic mode.');
        return;
      }
      
      if (!hospitalSearchUI.validateLocationData()) {
        alert('Please search for hospitals and select one, or enter manual coordinates.');
        return;
      }
      
      locationData = hospitalSearchUI.getLocationData();
      console.log('🏥 Advanced mode - location:', locationData);
    }
    
    // Create profile object
    const profile = {
      id: generateProfileId(),
      name: name,
      birthDate: birthDate,
      birthTime: birthTime,
      location: locationData,
      createdAt: new Date().toISOString()
    };
    
    console.log('👤 Profile created:', profile);
    
    // Calculate birth chart
    const calculations = calculateBirthChart(profile);
    
    // Save profile
    saveProfile(profile, calculations);
    
    // Navigate to results
    alert('Profile created successfully! (Results page not yet implemented)');
    console.log('✅ Profile saved with calculations:', calculations);
    
  } catch (error) {
    console.error('❌ Form submission error:', error);
    alert('An error occurred. Please try again.');
  }
}

// Save profile to localStorage
function saveProfile(profile, calculations) {
  try {
    // Get existing profiles
    const stored = localStorage.getItem('astroProfiles');
    let profiles = stored ? JSON.parse(stored) : [];
    
    // Add calculations to profile
    profile.calculations = calculations;
    
    // Add new profile
    profiles.push(profile);
    
    // Save back to localStorage
    localStorage.setItem('astroProfiles', JSON.stringify(profiles));
    
    console.log('💾 Profile saved to localStorage');
    console.log('📊 Total profiles:', profiles.length);
    
  } catch (error) {
    console.error('❌ Error saving profile:', error);
  }
}

// Load all profiles
function loadProfiles() {
  try {
    const stored = localStorage.getItem('astroProfiles');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ Error loading profiles:', error);
    return [];
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 AstroProfile initialized');
  
  // Get the form
  const form = document.getElementById('birthInfoForm');
  
  if (form) {
    // Attach form submission handler
    form.addEventListener('submit', handleFormSubmission);
    console.log('✅ Form handler attached');
  } else {
    console.warn('⚠️ Form not found on page');
  }
  
  // Load and display existing profiles count
  const profiles = loadProfiles();
  console.log(`📁 Loaded ${profiles.length} existing profiles`);
  
  // Check localStorage status
  if (typeof Storage !== 'undefined') {
    console.log('✅ localStorage available');
  } else {
    console.warn('⚠️ localStorage not available');
  }
});

console.log('✅ App module loaded');
