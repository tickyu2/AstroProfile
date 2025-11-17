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
    
    if (profiles.length === 0) {
        savedProfilesSection.style.display = 'none';
        return;
    }
    
    savedProfilesSection.style.display = 'block';
    profileList.innerHTML = '';
    
    profiles.forEach(profile => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        
        const fullName = `${profile.firstName} ${profile.lastName}`;
        const birthDate = new Date(profile.birthDate).toLocaleDateString();
        const birthTime = `${String(profile.birthHour).padStart(2, '0')}:${String(profile.birthMinute).padStart(2, '0')}`;
        const location = `${profile.birthCity}, ${profile.birthCountry}`;
        
        profileItem.innerHTML = `
            <div class="profile-item-info">
                <div class="profile-item-name">${fullName}</div>
                <div class="profile-item-details">${birthDate} at ${birthTime} • ${location}</div>
            </div>
            <div class="profile-item-actions">
                <button class="profile-item-btn load" onclick="loadProfile(${profile.id})">Load</button>
                <button class="profile-item-btn delete" onclick="deleteProfile(${profile.id})">Delete</button>
            </div>
        `;
        
        profileList.appendChild(profileItem);
    });
}

// Load a profile into the form
function loadProfile(profileId) {
    const profile = profileManager.getProfile(profileId);
    if (!profile) return;
    
    document.getElementById('firstName').value = profile.firstName;
    document.getElementById('lastName').value = profile.lastName;
    document.getElementById('birthDate').value = profile.birthDate;
    document.getElementById('birthHour').value = profile.birthHour;
    document.getElementById('birthMinute').value = profile.birthMinute;
    document.getElementById('birthCity').value = profile.birthCity;
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

// Form submission handler
document.getElementById('birthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const birthHour = parseInt(document.getElementById('birthHour').value);
    const birthMinute = parseInt(document.getElementById('birthMinute').value);
    const birthCity = document.getElementById('birthCity').value.trim();
    const birthCountry = document.getElementById('birthCountry').value.trim();
    
    // Validation
    let isValid = true;
    
    if (!firstName || !lastName) {
        document.getElementById('nameError').classList.add('show');
        isValid = false;
    }
    
    if (!birthDate) {
        document.getElementById('dateError').classList.add('show');
        isValid = false;
    }
    
    if (isNaN(birthHour) || birthHour < 0 || birthHour > 23 || 
        isNaN(birthMinute) || birthMinute < 0 || birthMinute > 59) {
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
    
    // Create profile data object
    const profileData = {
        firstName,
        lastName,
        birthDate,
        birthHour,
        birthMinute,
        birthCity,
        birthCountry
    };
    
    // Save to localStorage
    profileManager.saveProfile(profileData);
    
    // Store in sessionStorage for results page
    sessionStorage.setItem('currentProfile', JSON.stringify(profileData));
    
    // Redirect to results page
    window.location.href = 'results.html';
});

// Allow Enter key to move between fields
document.querySelectorAll('input').forEach((input, index, inputs) => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus();
            } else {
                // Last input - submit form
                document.getElementById('birthForm').requestSubmit();
            }
        }
    });
});
