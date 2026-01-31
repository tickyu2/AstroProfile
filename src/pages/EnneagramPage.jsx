/**
 * ENNEAGRAM PAGE
 *
 * Dedicated page for Enneagram assessment and results.
 * Features profile selector and EnneagramTab integration.
 * Matches Assessment page UI pattern.
 *
 * "The Cathedral of Self-Knowledge - Alchemical Wing"
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { EnneagramTab } from '../components/enneagram';
import './EnneagramPage.css';

function EnneagramPage() {
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading, refreshProfiles } = useProfiles();

  // NO auto-select - user must choose (like Assessment page)
  const [selectedProfileId, setSelectedProfileId] = useState('');

  // Find the selected profile
  const profile = useMemo(() => {
    if (!selectedProfileId) return null;
    return profiles.find(p => p.id === selectedProfileId);
  }, [profiles, selectedProfileId]);

  // Handle profile update (refresh after saving)
  const handleProfileUpdate = () => {
    refreshProfiles();
  };

  // Loading state
  if (profilesLoading) {
    return (
      <div className="enneagram-page">
        <div className="enneagram-loading">
          <div className="loading-icon">⚗️</div>
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  // No profiles state
  if (!profiles?.length) {
    return (
      <div className="enneagram-page">
        <div className="enneagram-no-profiles">
          <div className="no-profiles-icon">👤</div>
          <p>Create a profile first to take the Enneagram assessment</p>
          <button
            onClick={() => navigate('/create-profile')}
            className="btn-primary"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enneagram-page">
      {/* Header - matches Assessment page layout */}
      <header className="enneagram-header-bar">
        {/* Left side - Profile Selector */}
        <div className="header-left">
          <div className="profile-selector">
            <label>Profile:</label>
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className={`profile-select ${!selectedProfileId ? 'not-selected' : ''}`}
            >
              <option value="">-- Select a Profile --</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.displayName || p.name}
                </option>
              ))}
            </select>
          </div>

          <Link to="/dashboard" className="dashboard-link">
            ← Dashboard
          </Link>
        </div>

        {/* Right side - Title */}
        <div className="header-right">
          <span className="header-icon">⚗️</span>
          <h1 className="header-title">Enneagram Alchemical Rose</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="enneagram-main">
        {!selectedProfileId ? (
          // No profile selected - show message
          <div className="enneagram-intro">
            <div className="intro-card">
              <span className="intro-icon">⚗️</span>
              <h2>Enneagram Alchemical Rose</h2>
              <p className="intro-description">
                Discover your core personality type through self-reflection.
                This assessment provides insights into your core motivations and growth paths.
              </p>

              <div className="profile-required-message">
                <span className="icon">👆</span>
                <span>Please select a profile above to begin</span>
              </div>

              <div className="enneagram-info">
                <h4>What You'll Discover:</h4>
                <ul>
                  <li>Your dominant Enneagram type (1-9)</li>
                  <li>Your wing influence</li>
                  <li>Your tritype combination</li>
                  <li>Your instinctual variant (sp/sx/so)</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Profile selected - show EnneagramTab
          <EnneagramTab
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="enneagram-footer">
        <p>Your answers are saved automatically to your profile</p>
      </footer>
    </div>
  );
}

export default EnneagramPage;
