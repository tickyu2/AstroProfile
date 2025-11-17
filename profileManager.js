// Profile Management System
class ProfileManager {
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

const profileManager = new ProfileManager();

// Load profiles on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProfiles();
});

function loadProfiles() {
    const profiles = profileManager.getAllProfiles();
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
        const profileCard = createProfileCard(profile);
        profilesList.appendChild(profileCard);
    });
}

function createProfileCard(profile) {
    const card = document.createElement('div');
    card.className = 'profile-item';
    
    const fullName = `${profile.firstName} ${profile.lastName}`;
    const birthDate = new Date(profile.birthDate);
    const formattedDate = birthDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const birthTime = `${String(profile.birthHour).padStart(2, '0')}:${String(profile.birthMinute).padStart(2, '0')}`;
    const location = `${profile.birthCity}, ${profile.birthCountry}`;
    
    const savedDate = new Date(profile.savedAt);
    const savedFormatted = savedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="profile-header">
            <div class="profile-name">${fullName}</div>
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
            <button class="btn btn-primary" onclick="viewProfile(${profile.id})">
                ✨ View Cosmic Blueprint
            </button>
            <button class="btn btn-secondary" onclick="editProfile(${profile.id})">
                ✏️ Edit
            </button>
            <button class="btn btn-danger" onclick="deleteProfile(${profile.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}

function viewProfile(profileId) {
    const profile = profileManager.getProfile(profileId);
    if (!profile) return;
    
    // Store in sessionStorage for results page
    sessionStorage.setItem('currentProfile', JSON.stringify(profile));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

function editProfile(profileId) {
    const profile = profileManager.getProfile(profileId);
    if (!profile) return;
    
    // Store in sessionStorage
    sessionStorage.setItem('editProfile', JSON.stringify(profile));
    
    // Redirect to main page
    window.location.href = 'index.html';
}

function deleteProfile(profileId) {
    const profile = profileManager.getProfile(profileId);
    const fullName = `${profile.firstName} ${profile.lastName}`;
    
    if (confirm(`Are you sure you want to delete the profile for ${fullName}?`)) {
        profileManager.deleteProfile(profileId);
        loadProfiles();
    }
}

function clearAllProfiles() {
    if (confirm('Are you sure you want to delete ALL saved profiles? This cannot be undone.')) {
        if (confirm('Really sure? This will permanently delete all your saved profiles.')) {
            profileManager.clearAll();
            loadProfiles();
        }
    }
}

// Check if we're loading an edit profile
const editProfile = sessionStorage.getItem('editProfile');
if (editProfile && window.location.pathname.includes('index.html')) {
    const profile = JSON.parse(editProfile);
    
    // Pre-fill the form
    document.getElementById('firstName').value = profile.firstName;
    document.getElementById('lastName').value = profile.lastName;
    document.getElementById('birthDate').value = profile.birthDate;
    document.getElementById('birthHour').value = profile.birthHour;
    document.getElementById('birthMinute').value = profile.birthMinute;
    document.getElementById('birthCity').value = profile.birthCity;
    document.getElementById('birthCountry').value = profile.birthCountry;
    
    // Clear the edit session
    sessionStorage.removeItem('editProfile');
}
