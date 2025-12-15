/**
 * ConstitutionalAssessmentPage.jsx
 * Page wrapper for Constitutional Assessment
 *
 * Integrates the Constitutional Assessment system with
 * user profile context and navigation.
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { ConstitutionalAssessment } from '../components/constitutional';

export function ConstitutionalAssessmentPage() {
  const navigate = useNavigate();
  const { profiles, selectedProfileId, updateProfile } = useProfiles();

  // Get the selected profile
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  // Handle assessment completion
  const handleComplete = async (constitutionalProfile) => {
    console.log('✨ Constitutional Assessment Complete:', constitutionalProfile);

    // Navigate back to results or dashboard
    if (selectedProfileId) {
      navigate(`/results/${selectedProfileId}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Handle saving the profile
  const handleSaveProfile = async (constitutionalProfile) => {
    if (!selectedProfileId || !updateProfile) {
      console.warn('No profile selected or updateProfile not available');
      return;
    }

    try {
      // Save constitutional assessment to the profile
      await updateProfile(selectedProfileId, {
        constitutional_assessment: {
          primary: constitutionalProfile.primary,
          secondary: constitutionalProfile.secondary,
          tertiary: constitutionalProfile.tertiary,
          elementPercentages: constitutionalProfile.elementPercentages,
          alignment: constitutionalProfile.alignment,
          insights: constitutionalProfile.insights,
          completedAt: new Date().toISOString()
        }
      });

      console.log('💾 Constitutional assessment saved to profile');
    } catch (error) {
      console.error('Error saving constitutional assessment:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1); // Go back
  };

  // If no profile selected, show error
  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            No Profile Selected
          </h1>
          <p className="text-white/60 mb-6">
            Please select a profile from the dashboard to take the Constitutional Assessment.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-xl font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ConstitutionalAssessment
      userProfile={selectedProfile}
      onComplete={handleComplete}
      onSaveProfile={handleSaveProfile}
      onCancel={handleCancel}
    />
  );
}

export default ConstitutionalAssessmentPage;
