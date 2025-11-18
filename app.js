// Profile Management System
class ProfileManager {
    constructor() {
        this.storageKey = 'astroProfiles';
    }

    getAllProfiles() {
        const profiles = localStorage.getItem(this.storageKey);
        return profiles ? JSON.parse(profiles) : [];
    }

    saveProfile(profileData) {
        const profiles = this.getAllProfiles();
        
        profileData.id = Date.now();
        profileData.savedAt = new Date().toISOString();
        
        profiles.unshift(profileData);
        
        if (profiles.length > 10) {
            profiles.pop();
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
        console.log('✅ Profile saved successfully:', profileData);
        return profileData;
    }

    deleteProfile(profileId) {
        let profiles = this.getAllProfiles();
        profiles = profiles.filter(p => p.id !== profileId);
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
        console.log('🗑️ Profile deleted:', profileId);
    }

    getProfile(profileId) {
        const profiles = this.getAllProfiles();
        return profiles.find(p => p.id === profileId);
    }

    // NEW: Clear all broken profiles
    clearAllProfiles() {
        localStorage.removeItem(this.storageKey);
        console.log('🧹 All profiles cleared');
    }
}

const profileManager = new ProfileManager();

// Load saved profiles on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Page loaded');
    console.log('🔍 Checking localStorage...');
    
    // Check if there are profiles with "undefined" time
    const profiles = profileManager.getAllProfiles();
    const hasBrokenProfiles = profiles.some(p => 
        p.birthHour24 === undefined || 
        isNaN(p.birthHour24) ||
        !p.gender
    );
    
    if (hasBrokenProfiles) {
        console.warn('⚠️ Found broken profiles with old format!');
        console.log('🧹 Cleaning up broken profiles...');
        
        // Option 1: Clear all (safest)
        if (confirm('Found profiles with old data format. Clear all profiles and start fresh?')) {
            profileManager.clearAllProfiles();
            alert('All profiles cleared! Please create new profiles.');
            location.reload();
            return;
        }
    }
    
    loadSavedProfiles();
});

// Load and display saved profiles
function loadSavedProfiles() {
    const profiles = profileManager.getAllProfiles();
    console.log(`📊 Found ${profiles.length} saved profiles`);
    
    const profileList = document.getElementById('profileList');
    const savedProfilesSection = document.getElementById('savedProfilesSection');
    const profileCount = document.getElementById('profileCount');
    
    if (profiles.length === 0) {
        savedProfilesSection.style.display = 'none';
        return;
    }
    
    savedProfilesSection.style.display = 'block';
    profileCount.textContent = `(${profiles.length})`;
    profileList.innerHTML = '';
    
    profiles.forEach(profile => {
        // Skip broken profiles
        if (!profile.birthHour24 || isNaN(profile.birthHour24) || !profile.gender) {
            console.warn('⚠️ Skipping broken profile:', profile);
            return;
        }
        
        const profileItem = createProfileItem(profile);
        profileList.appendChild(profileItem);
    });
}

function createProfileItem(profile) {
    const profileItem = document.createElement('div');
    profileItem.className = 'profile-item';
    profileItem.dataset.profileName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
    
    const fullName = `${profile.firstName} ${profile.lastName}`;
    const birthDate = new Date(profile.birthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    // Convert 24-hour to 12-hour for display
    let hour = parseInt(profile.birthHour24);
    let period = 'AM';
    
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;
    
    const birthTime = `${String(hour).padStart(2, '0')}:${String(profile.birthMinute).padStart(2, '0')} ${period}`;
    
    // Build location string
    let location = profile.birthCity;
    if (profile.birthState) location += `, ${profile.birthState}`;
    location += `, ${profile.birthCountry}`;
    
    const genderIcon = profile.gender === 'male' ? '♂️' : '♀️';
    
    profileItem.innerHTML = `
        <div class="profile-item-info">
            <div class="profile-item-name">${genderIcon} ${fullName}</div>
            <div class="profile-item-details">${birthDate} at ${birthTime} • ${location}</div>
        </div>
        <div class="profile-item-actions">
            <button class="profile-item-btn load" onclick="loadProfile(${profile.id})">Load</button>
            <button class="profile-item-btn delete" onclick="deleteProfile(${profile.id})">Delete</button>
        </div>
    `;
    
    return profileItem;
}

// Filter profiles by search
function filterProfiles() {
    const searchInput = document.getElementById('profileSearchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const profileItems = document.querySelectorAll('.profile-item');
    
    profileItems.forEach(item => {
        const profileName = item.dataset.profileName;
        if (profileName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Load a profile into the form
function loadProfile(profileId) {
    const profile = profileManager.getProfile(profileId);
    if (!profile) {
        console.error('❌ Profile not found:', profileId);
        return;
    }
    
    console.log('📥 Loading profile:', profile);
    
    document.getElementById('firstName').value = profile.firstName;
    document.getElementById('lastName').value = profile.lastName;
    
    // Set gender
    if (profile.gender === 'male') {
        document.getElementById('genderMale').checked = true;
    } else {
        document.getElementById('genderFemale').checked = true;
    }
    
    document.getElementById('birthDate').value = profile.birthDate;
    
    // Convert 24-hour to 12-hour for form
    let hour = parseInt(profile.birthHour24);
    let period = 'AM';
    
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;
    
    document.getElementById('birthHour').value = hour;
    document.getElementById('birthMinute').value = profile.birthMinute;
    document.getElementById('birthPeriod').value = period;
    
    document.getElementById('birthCity').value = profile.birthCity;
    document.getElementById('birthState').value = profile.birthState || '';
    document.getElementById('birthCountry').value = profile.birthCountry;
    
    // Scroll to form
    document.getElementById('birthForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Delete a profile
function deleteProfile(profileId) {
    if (confirm('Are you sure you want to delete this profile?')) {
        profileManager.deleteProfile(profileId);
        loadSavedProfiles();
    }
}

// Convert 12-hour to 24-hour format
function convertTo24Hour(hour12, period) {
    let hour24 = parseInt(hour12);
    
    if (period === 'AM') {
        if (hour24 === 12) hour24 = 0; // 12 AM = 00:00
    } else { // PM
        if (hour24 !== 12) hour24 += 12; // 1 PM = 13:00, but 12 PM = 12:00
    }
    
    return hour24;
}

// Form submission handler
document.getElementById('birthForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('========================================');
    console.log('📝 FORM SUBMISSION STARTED');
    console.log('========================================');
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const birthDate = document.getElementById('birthDate').value;
    const birthHour12 = parseInt(document.getElementById('birthHour').value);
    const birthMinute = parseInt(document.getElementById('birthMinute').value);
    const birthPeriod = document.getElementById('birthPeriod').value;
    const birthCity = document.getElementById('birthCity').value.trim();
    const birthState = document.getElementById('birthState').value.trim();
    const birthCountry = document.getElementById('birthCountry').value.trim();
    
    console.log('📋 Form values:');
    console.log('  Name:', firstName, lastName);
    console.log('  Gender:', gender);
    console.log('  Birth Date:', birthDate);
    console.log('  Birth Time (12h):', birthHour12, ':', birthMinute, birthPeriod);
    console.log('  Location:', birthCity, birthState, birthCountry);
    
    // Validation
    let isValid = true;
    
    if (!firstName || !lastName) {
        document.getElementById('nameError').classList.add('show');
        isValid = false;
        console.error('❌ Name validation failed');
    }
    
    if (!gender) {
        document.getElementById('genderError').classList.add('show');
        isValid = false;
        console.error('❌ Gender validation failed');
    }
    
    if (!birthDate) {
        document.getElementById('dateError').classList.add('show');
        isValid = false;
        console.error('❌ Date validation failed');
    }
    
    if (isNaN(birthHour12) || birthHour12 < 1 || birthHour12 > 12 || 
        isNaN(birthMinute) || birthMinute < 0 || birthMinute > 59 ||
        !birthPeriod) {
        document.getElementById('timeError').classList.add('show');
        isValid = false;
        console.error('❌ Time validation failed');
    }
    
    if (!birthCity || !birthCountry) {
        document.getElementById('locationError').classList.add('show');
        isValid = false;
        console.error('❌ Location validation failed');
    }
    
    if (!isValid) {
        console.log('❌ VALIDATION FAILED - Stopping submission');
        return;
    }
    
    console.log('✅ All validations passed');
    
    // Convert to 24-hour format
    const birthHour24 = convertTo24Hour(birthHour12, birthPeriod);
    console.log('⏰ Time conversion:', birthHour12, ':', birthMinute, birthPeriod, '→', birthHour24, ':', birthMinute, '(24-hour)');
    
    // Fetch location data (coordinates + timezone)
    console.log('🌍 Fetching location data...');
    let locationData = {
        latitude: null,
        longitude: null,
        timezone: null,
        display_name: null
    };
    
    if (typeof getLocationData === 'function') {
        try {
            locationData = await getLocationData(birthCity, birthState, birthCountry);
            if (locationData.success) {
                console.log('✅ Location data retrieved:');
                console.log('  Latitude:', locationData.latitude);
                console.log('  Longitude:', locationData.longitude);
                console.log('  Timezone:', locationData.timezone);
                console.log('  Full name:', locationData.display_name);
            } else {
                console.warn('⚠️ Could not retrieve location data:', locationData.error);
            }
        } catch (error) {
            console.warn('⚠️ Geocoding error:', error.message);
        }
    } else {
        console.warn('⚠️ Geocoding not available - geocoding.js not loaded');
    }
    
    // Create profile data object
    const profileData = {
        firstName,
        lastName,
        gender,
        birthDate,
        birthHour24,  // Store in 24-hour format
        birthMinute,
        birthCity,
        birthState,
        birthCountry,
        // Add location data
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: locationData.timezone,
        locationDisplayName: locationData.display_name
    };
    
    console.log('========================================');
    console.log('💾 FINAL PROFILE DATA TO SAVE:');
    console.log(JSON.stringify(profileData, null, 2));
    console.log('========================================');
    
    // Save to localStorage
    const savedProfile = profileManager.saveProfile(profileData);
    console.log('✅ Saved to localStorage with ID:', savedProfile.id);
    
    // Store in sessionStorage for results page
    sessionStorage.setItem('currentProfile', JSON.stringify(profileData));
    console.log('✅ Saved to sessionStorage');
    console.log('📦 sessionStorage content:', JSON.stringify(profileData, null, 2));
    
    // Clear any old session data
    sessionStorage.removeItem('editProfile');
    
    console.log('========================================');
    console.log('🔄 REDIRECTING TO RESULTS PAGE...');
    console.log('========================================');
    
    // Small delay to ensure data is saved
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 100);
});

// Allow Enter key to move between fields
document.querySelectorAll('input, select').forEach((input, index, inputs) => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && input.type !== 'radio') {
            e.preventDefault();
            
            // Find next input that's not a radio button
            let nextIndex = index + 1;
            while (nextIndex < inputs.length) {
                const nextInput = inputs[nextIndex];
                if (nextInput.type !== 'radio') {
                    nextInput.focus();
                    break;
                }
                nextIndex++;
            }
            
            // If no more inputs, submit form
            if (nextIndex >= inputs.length) {
                document.getElementById('birthForm').requestSubmit();
            }
        }
    });
});

console.log('🚀 App.js loaded and ready!');
