// Profile Management System
class ProfileManager {
    constructor() {
        this.storageKey = 'astroProfiles';
    }

    // Get all profiles from localStorage
    getAllProfiles() {
        const profiles = localStorage.getItem(this.storageKey);
        return profiles ? JSON.parse(profiles) : [];
    }

    // Save a new profile
    saveProfile(profileData) {
        const profiles = this.getAllProfiles();
        
        // Add timestamp and ID
        profileData.id = Date.now();
        profileData.savedAt = new Date().toISOString();
        
        // Add to beginning of array
        profiles.unshift(profileData);
        
        // Limit to 10 most recent profiles
        if (profiles.length > 10) {
            profiles.pop();
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
        console.log('Profile saved:', profileData);
        return profileData;
    }

    // Delete a profile by ID
    deleteProfile(profileId) {
        let profiles = this.getAllProfiles();
        profiles = profiles.filter(p => p.id !== profileId);
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    }

    // Get a single profile by ID
    getProfile(profileId) {
        const profiles = this.getAllProfiles();
        return profiles.find(p => p.id === profileId);
    }
}

// Initialize profile manager
const profileManager = new ProfileManager();

// Load saved profiles on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedProfiles();
});

// Load and display saved profiles
function loadSavedProfiles() {
    const profiles = profileManager.getAllProfiles();
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
        const profileItem = createProfileItem(profile);
        profileList.appendChild(profileItem);
    });
}

function createProfileItem(profile) {
    const profileItem = document.createElement('div');
    profileItem.className = 'profile-item';
    profileItem.dataset.profileName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
    
    const fullName = `${profile.firstName} ${profile.lastName}`;
    const birthDate = new Date(profile.birthDate).toLocaleDateString();
    
    // Convert 24-hour to 12-hour format for display
    let displayHour = profile.birthHour24;
    let period = 'AM';
    if (displayHour >= 12) {
        period = 'PM';
        if (displayHour > 12) displayHour -= 12;
    }
    if (displayHour === 0) displayHour = 12;
    
    const birthTime = `${String(displayHour).padStart(2, '0')}:${String(profile.birthMinute).padStart(2, '0')} ${period}`;
    
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
    if (!profile) return;
    
    document.getElementById('firstName').value = profile.firstName;
    document.getElementById('lastName').value = profile.lastName;
    
    // Set gender radio button
    if (profile.gender === 'male') {
        document.getElementById('genderMale').checked = true;
    } else {
        document.getElementById('genderFemale').checked = true;
    }
    
    document.getElementById('birthDate').value = profile.birthDate;
    
    // Convert 24-hour to 12-hour for form
    let hour12 = profile.birthHour24;
    let period = 'AM';
    if (hour12 >= 12) {
        period = 'PM';
        if (hour12 > 12) hour12 -= 12;
    }
    if (hour12 === 0) hour12 = 12;
    
    document.getElementById('birthHour').value = hour12;
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
        if (hour24 === 12) hour24 = 0;
    } else { // PM
        if (hour24 !== 12) hour24 += 12;
    }
    
    return hour24;
}

// Form submission handler
document.getElementById('birthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
    
    // Validation
    let isValid = true;
    
    if (!firstName || !lastName) {
        document.getElementById('nameError').classList.add('show');
        isValid = false;
    }
    
    if (!gender) {
        document.getElementById('genderError').classList.add('show');
        isValid = false;
    }
    
    if (!birthDate) {
        document.getElementById('dateError').classList.add('show');
        isValid = false;
    }
    
    if (isNaN(birthHour12) || birthHour12 < 1 || birthHour12 > 12 || 
        isNaN(birthMinute) || birthMinute < 0 || birthMinute > 59 ||
        !birthPeriod) {
        document.getElementById('timeError').classList.add('show');
        isValid = false;
    }
    
    if (!birthCity || !birthCountry) {
        document.getElementById('locationError').classList.add('show');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Convert to 24-hour format for storage
    const birthHour24 = convertTo24Hour(birthHour12, birthPeriod);
    
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
        birthCountry
    };
    
    console.log('Submitting profile:', profileData);
    
    // Save to localStorage
    const savedProfile = profileManager.saveProfile(profileData);
    console.log('Profile saved with ID:', savedProfile.id);
    
    // Store in sessionStorage for results page
    sessionStorage.setItem('currentProfile', JSON.stringify(profileData));
    
    // Redirect to results page
    window.location.href = 'results.html';
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
