/**
 * Profile Manager - Firebase Cloud Storage
 * NO localStorage - everything in cloud database!
 */

class ProfileManager {
  constructor() {
    this.database = null;
    this.profilesRef = null;
    this.currentUserId = 'guest'; // Will use proper auth later
  }

  /**
   * Initialize database connection
   */
  initialize() {
    if (!window.FirebaseDB || !window.FirebaseDB.isInitialized()) {
      console.error('❌ Firebase not initialized');
      return false;
    }
    
    this.database = window.FirebaseDB.getDatabase();
    
    // Reference to profiles in database
    // Structure: /users/{userId}/profiles/{profileId}
    this.profilesRef = this.database.ref(`users/${this.currentUserId}/profiles`);
    
    console.log('✅ ProfileManager initialized');
    return true;
  }

  /**
   * Generate unique profile ID
   */
  generateProfileId() {
    return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save profile to Firebase
   */
  async saveProfile(profile, calculations) {
    try {
      if (!this.profilesRef) {
        throw new Error('Database not initialized');
      }
      
      // Ensure profile has ID
      if (!profile.id) {
        profile.id = this.generateProfileId();
      }
      
      // Add metadata
      profile.createdAt = profile.createdAt || new Date().toISOString();
      profile.updatedAt = new Date().toISOString();
      profile.calculations = calculations;
      
      // Save to Firebase
      await this.profilesRef.child(profile.id).set(profile);
      
      console.log('✅ Profile saved to cloud:', profile.id);
      console.log('📊 Profile data:', profile);
      
      return profile;
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      throw error;
    }
  }

  /**
   * Get single profile by ID
   */
  async getProfile(profileId) {
    try {
      if (!this.profilesRef) {
        throw new Error('Database not initialized');
      }
      
      const snapshot = await this.profilesRef.child(profileId).once('value');
      const profile = snapshot.val();
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      console.log('✅ Profile loaded from cloud:', profileId);
      return profile;
      
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      throw error;
    }
  }

  /**
   * Get all profiles for current user
   */
  async getAllProfiles() {
    try {
      if (!this.profilesRef) {
        throw new Error('Database not initialized');
      }
      
      const snapshot = await this.profilesRef.once('value');
      const profilesData = snapshot.val();
      
      if (!profilesData) {
        console.log('📁 No profiles found');
        return [];
      }
      
      // Convert object to array
      const profiles = Object.values(profilesData);
      
      // Sort by created date (newest first)
      profiles.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      console.log(`✅ Loaded ${profiles.length} profiles from cloud`);
      return profiles;
      
    } catch (error) {
      console.error('❌ Error loading profiles:', error);
      return [];
    }
  }

  /**
   * Delete profile
   */
  async deleteProfile(profileId) {
    try {
      if (!this.profilesRef) {
        throw new Error('Database not initialized');
      }
      
      await this.profilesRef.child(profileId).remove();
      
      console.log('✅ Profile deleted from cloud:', profileId);
      
    } catch (error) {
      console.error('❌ Error deleting profile:', error);
      throw error;
    }
  }

  /**
   * Update existing profile
   */
  async updateProfile(profileId, updates) {
    try {
      if (!this.profilesRef) {
        throw new Error('Database not initialized');
      }
      
      // Add update timestamp
      updates.updatedAt = new Date().toISOString();
      
      await this.profilesRef.child(profileId).update(updates);
      
      console.log('✅ Profile updated in cloud:', profileId);
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Search profiles by name
   */
  async searchProfiles(searchTerm) {
    try {
      const allProfiles = await this.getAllProfiles();
      
      const term = searchTerm.toLowerCase().trim();
      const results = allProfiles.filter(profile => 
        profile.name.toLowerCase().includes(term)
      );
      
      console.log(`🔍 Found ${results.length} profiles matching "${searchTerm}"`);
      return results;
      
    } catch (error) {
      console.error('❌ Error searching profiles:', error);
      return [];
    }
  }

  /**
   * Get profiles for comparison (by IDs)
   */
  async getProfilesForComparison(profileIds) {
    try {
      const promises = profileIds.map(id => this.getProfile(id));
      const profiles = await Promise.all(promises);
      
      console.log(`✅ Loaded ${profiles.length} profiles for comparison`);
      return profiles;
      
    } catch (error) {
      console.error('❌ Error loading profiles for comparison:', error);
      return [];
    }
  }

  /**
   * Export all profiles (backup)
   */
  async exportAllProfiles() {
    try {
      const profiles = await this.getAllProfiles();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        profileCount: profiles.length,
        profiles: profiles
      };
      
      const json = JSON.stringify(exportData, null, 2);
      
      // Create download link
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `astroprofile_backup_${Date.now()}.json`;
      a.click();
      
      console.log('✅ Profiles exported');
      
    } catch (error) {
      console.error('❌ Error exporting profiles:', error);
    }
  }

  /**
   * Get profile count
   */
  async getProfileCount() {
    try {
      const profiles = await this.getAllProfiles();
      return profiles.length;
    } catch (error) {
      return 0;
    }
  }
}

// Create global instance
const profileManager = new ProfileManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for Firebase to initialize
  setTimeout(() => {
    profileManager.initialize();
  }, 500);
});

// Export for use in other files
window.ProfileManager = profileManager;

console.log('✅ ProfileManager module loaded');
