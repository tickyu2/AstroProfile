// Profile Management for Profiles Page
class ProfileManagerPage {
    constructor() {
        this.storageKey = 'astroProfiles';
    }

    getAllProfiles() {
        const profiles = localStorage.getItem(this.storageKey);
        return profiles ? JSON.parse(profiles) : [];
    }

    deleteProfile(profileId) {
        let profiles = this.getAllProfiles();
        profiles = profiles.filter(p => p.id !== profileId);
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    }

    clearAll() {
        localStorage.removeItem(this.storageKey);
    }

    getProfile(profileId) {
        const profiles = this.getAllProfiles();
        return profiles.find(p => p.id === profileId);
    }
}

const profileManagerPage = new ProfileManagerPage();

// Load profiles on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProfilesPage();
});

function loadProfilesPage() {
    const profiles = profileManagerPage.getAllProfiles();
    const profilesList = document.getElementById('profilesList');
    const profileCount = document.getElementById('profileCount');
    const clearAllSection = document.getElementById('clearAllSection');
    
    if (profiles.length === 0) {
        profilesList.innerHTML = `
            <div class="no-profiles">
                <div class="no-profiles-icon">✨</div>
                <h2>No Saved Profiles Yet</h2>
                <p>Create your first cosmic blueprint to save it here</p>
                <a href="index.html" class="btn btn-primary">Create New Profile</a>
            </div>
        `;
        profileCount.textContent = '';
        clearAllSection.style.display = 'none';
        return;
    }
    
    profileCount.textContent = `${profiles.length} saved profile${profiles.length !== 1 ? 's' : ''}`;
    clearAllSection.style.display = 'block';
    
    profilesList.innerHTML = '';
    
    profiles.forEach(profile => {
        const profileCard = createProfileCardElement(profile);
        profilesList.appendChild(profileCard);
    });
}

function createProfileCardElement(profile) {
    const card = document.createElement('div');
    card.className = 'profile-item';
    
    const fullName = `${profile.firstName} ${profile.lastName}`;
    
    // Parse date in local timezone to avoid UTC shift
    const [year, month, day] = profile.birthDate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    
    const formattedDate = birthDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Convert 24-hour to 12-hour
    let hour = profile.birthHour24;
    let period = 'AM';
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;
    
    const birthTime = `${String(hour).padStart(2, '0')}:${String(profile.birthMinute).padStart(2, '0')} ${period}`;
    
    // Build location
    let location = profile.birthCity;
    if (profile.birthState) location += `, ${profile.birthState}`;
    location += `, ${profile.birthCountry}`;
    
    const savedDate = new Date(profile.savedAt);
    const savedFormatted = savedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const genderIcon = profile.gender === 'male' ? '♂️' : '♀️';
    
    card.innerHTML = `
        <div class="profile-header">
            <div class="profile-name">${genderIcon} ${fullName}</div>
            <div class="profile-saved">Saved: ${savedFormatted}</div>
        </div>
        
        <div class="profile-details">
            <div class="detail-item">
                <div class="detail-label">Birth Date</div>
                <div class="detail-value">${formattedDate}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Birth Time</div>
                <div class="detail-value">${birthTime}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${location}</div>
            </div>
        </div>
        
        <div class="profile-actions">
            <button class="btn btn-primary" onclick="viewProfileResult(${profile.id})">
                ✨ View Cosmic Blueprint
            </button>
            <button class="btn btn-secondary" onclick="editProfileData(${profile.id})">
                ✏️ Edit
            </button>
            <button class="btn btn-danger" onclick="deleteProfileFromList(${profile.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}

function viewProfileResult(profileId) {
    const profile = profileManagerPage.getProfile(profileId);
    if (!profile) return;
    
    // Store in sessionStorage for results page
    sessionStorage.setItem('currentProfile', JSON.stringify(profile));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

function editProfileData(profileId) {
    const profile = profileManagerPage.getProfile(profileId);
    if (!profile) return;
    
    // Store in sessionStorage
    sessionStorage.setItem('editProfile', JSON.stringify(profile));
    
    // Redirect to main page
    window.location.href = 'index.html';
}

function deleteProfileFromList(profileId) {
    const profile = profileManagerPage.getProfile(profileId);
    const fullName = `${profile.firstName} ${profile.lastName}`;
    
    if (confirm(`Are you sure you want to delete the profile for ${fullName}?`)) {
        profileManagerPage.deleteProfile(profileId);
        loadProfilesPage();
    }
}

function clearAllProfiles() {
    if (confirm('Are you sure you want to delete ALL saved profiles? This cannot be undone.')) {
        if (confirm('Really sure? This will permanently delete all your saved profiles.')) {
            profileManagerPage.clearAll();
            loadProfilesPage();
        }
    }
}
