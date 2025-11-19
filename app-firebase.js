/**
 * AstroProfile - Main Application Logic
 * Form handling with Firebase cloud storage
 * NO localStorage!
 */

// Handle form submission
async function handleFormSubmission(event) {
  event.preventDefault();
  
  console.log('📝 Form submitted');
  
  // Show loading state
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Generating Your Cosmic Blueprint...';
  submitBtn.disabled = true;
  
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
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }
      
      // Create basic location data
      // TODO: Add geocoding to get coordinates
      locationData = {
        city: city,
        state: state || null,
        country: country,
        latitude: null,
        longitude: null,
        timezone: 'UTC',
        precision: 'city',
        hospitalName: null,
        address: null,
        distance: null
      };
      
      console.log('🌍 Basic mode - location:', locationData);
      
    } else {
      // ADVANCED MODE: Hospital search
      if (typeof hospitalSearchUI === 'undefined') {
        alert('Hospital search not initialized. Please use Basic mode.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }
      
      if (!hospitalSearchUI.validateLocationData()) {
        alert('Please search for hospitals and select one, or enter manual coordinates.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }
      
      locationData = hospitalSearchUI.getLocationData();
      console.log('🏥 Advanced mode - location:', locationData);
    }
    
    // Create profile object
    const profile = {
      name: name,
      birthDate: birthDate,
      birthTime: birthTime,
      location: locationData
    };
    
    console.log('👤 Profile created:', profile);
    
    // Calculate birth chart
    const calculations = calculateBirthChart(profile);
    console.log('🎯 Calculations complete:', calculations);
    
    // Save to Firebase (NOT localStorage!)
    if (!window.ProfileManager) {
      throw new Error('ProfileManager not loaded');
    }
    
    const savedProfile = await ProfileManager.saveProfile(profile, calculations);
    console.log('💾 Profile saved to Firebase:', savedProfile.id);
    
    // Navigate to results page
    window.location.href = `results.html?id=${savedProfile.id}`;
    
  } catch (error) {
    console.error('❌ Form submission error:', error);
    alert(`Error: ${error.message}. Please try again.`);
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
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
  
  // Check Firebase status
  setTimeout(() => {
    if (window.FirebaseDB && window.FirebaseDB.isInitialized()) {
      console.log('✅ Firebase connected - cloud storage ready');
      console.log('📊 No localStorage used - all data in cloud');
    } else {
      console.error('❌ Firebase not connected - check setup');
    }
  }, 1000);
});

console.log('✅ App module loaded (Firebase version)');
