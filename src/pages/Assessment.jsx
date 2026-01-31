import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PhysicalLayerAssessment } from '../components/assessment/PhysicalLayerAssessment';
import { BigFiveAssessment } from '../components/assessment/BigFiveAssessment';
import { MBTIAssessment } from '../components/assessment/MBTIAssessment';
import { LoveLanguagesAssessment } from '../components/assessment/LoveLanguagesAssessment';
import { DailyLifeScenarios } from '../components/assessment/DailyLifeScenarios';
import { CouplePortraitGallery } from '../components/assessment/CouplePortraitGallery';
import { EnneagramAssessment } from '../components/assessment/EnneagramAssessment';
import { AssessmentScoring } from '../services/assessment/assessmentScoring';
import { generateSoulPassport } from '../services/assessment/soulPassportGenerator';
import './Assessment.css';

/**
 * Main Assessment Journey Component
 * - Profile selector for storing results per user
 * - Firebase persistence for answers
 * - Resume capability
 * - Edit previous answers
 * 136 total questions across 4 core assessments
 */
export default function Assessment() {
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfiles();

  // Profile selection - NO auto-select, user must choose
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [currentModule, setCurrentModule] = useState(0); // 0 = intro
  const [selectedStartModule, setSelectedStartModule] = useState(null); // Which module to start with
  const [showPortraitGallery, setShowPortraitGallery] = useState(false); // Show after Physical Layer
  const [responses, setResponses] = useState({
    physicalLayer: {},
    bigFive: [],
    mbti: [],
    loveLanguages: [],
    dailyLife: {},
    enneagramScenarios: []  // Scenario-based (distinct from Likert-scale Alchemical Rose)
  });
  const [scores, setScores] = useState(null);
  const [soulPassport, setSoulPassport] = useState(null);
  const [savedAssessment, setSavedAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get selected profile
  const selectedProfile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId);
  }, [profiles, selectedProfileId]);

  // NO auto-select - removed to require user selection

  // Track previous profile to save before switching
  const [previousProfileId, setPreviousProfileId] = useState('');

  // Load saved assessment when profile changes - SAVE FIRST before loading new
  useEffect(() => {
    const handleProfileChange = async () => {
      // Save current progress to previous profile before loading new
      if (previousProfileId && previousProfileId !== selectedProfileId) {
        console.log('Saving progress to previous profile before switch:', previousProfileId);
        await saveAssessmentToProfile(previousProfileId, responses, currentModule);
      }

      // Update previous profile tracker
      setPreviousProfileId(selectedProfileId);

      // Load new profile's data
      if (selectedProfileId) {
        loadSavedAssessment(selectedProfileId);
      }
    };

    handleProfileChange();
  }, [selectedProfileId]);

  /**
   * Load saved assessment from Firebase
   */
  const loadSavedAssessment = async (profileId) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'assessments', profileId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedAssessment(data);
        setResponses(data.responses || {
          physicalLayer: {},
          bigFive: [],
          mbti: [],
          loveLanguages: [],
          dailyLife: {}
        });
        setCurrentModule(data.currentModule || 0);
        if (data.scores) {
          setScores(data.scores);
        }
        if (data.soulPassport) {
          setSoulPassport(data.soulPassport);
        }
        console.log('Loaded saved assessment for profile:', profileId);
      } else {
        // No saved assessment - reset state
        setSavedAssessment(null);
        setResponses({
          physicalLayer: {},
          bigFive: [],
          mbti: [],
          loveLanguages: [],
          dailyLife: {}
        });
        setCurrentModule(0);
        setScores(null);
        setSoulPassport(null);
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save assessment to Firebase
   */
  const saveAssessment = async (updatedResponses, moduleId, finalScores = null, passport = null) => {
    if (!selectedProfileId) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'assessments', selectedProfileId);
      const data = {
        profileId: selectedProfileId,
        profileName: selectedProfile?.displayName || selectedProfile?.name,
        responses: updatedResponses,
        currentModule: moduleId,
        scores: finalScores,
        soulPassport: passport,
        updatedAt: serverTimestamp(),
        completedAt: finalScores ? serverTimestamp() : null
      };

      await setDoc(docRef, data, { merge: true });
      console.log('Assessment saved for profile:', selectedProfileId);
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save assessment to a specific profile (used when switching profiles)
   */
  const saveAssessmentToProfile = async (profileId, updatedResponses, moduleId) => {
    if (!profileId) return;

    try {
      const targetProfile = profiles.find(p => p.id === profileId);
      const docRef = doc(db, 'assessments', profileId);
      const data = {
        profileId: profileId,
        profileName: targetProfile?.displayName || targetProfile?.name,
        responses: updatedResponses,
        currentModule: moduleId,
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, data, { merge: true });
      console.log('Assessment saved to profile:', profileId);
    } catch (error) {
      console.error('Error saving assessment to profile:', error);
    }
  };

  /**
   * Handle progress update from assessment modules (auto-save)
   */
  const handleProgressUpdate = async (data) => {
    if (!selectedProfileId) return;

    // Update local state
    const updatedResponses = { ...responses, ...data };
    setResponses(updatedResponses);

    // Save to Firebase (debounce-friendly - saves immediately)
    setSaving(true);
    try {
      const docRef = doc(db, 'assessments', selectedProfileId);
      await setDoc(docRef, {
        profileId: selectedProfileId,
        profileName: selectedProfile?.displayName || selectedProfile?.name,
        responses: updatedResponses,
        currentModule: currentModule,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('Progress auto-saved for profile:', selectedProfileId);
    } catch (error) {
      console.error('Error auto-saving progress:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle module completion
   */
  const handleModuleComplete = async (moduleId, data) => {
    console.log(`Module ${moduleId} complete:`, data);

    const updatedResponses = { ...responses, ...data };
    setResponses(updatedResponses);

    // Special handling for Physical Layer - show portrait gallery
    if (moduleId === 1) {
      setShowPortraitGallery(true);
      await saveAssessment(updatedResponses, moduleId);
      return;
    }

    // Move to next module or complete
    if (moduleId < 5) {
      setCurrentModule(moduleId + 1);
      await saveAssessment(updatedResponses, moduleId + 1);
    } else {
      // All modules complete - calculate scores
      const finalScores = calculateFinalScores(updatedResponses);
      const passport = generateSoulPassport(updatedResponses);

      setScores(finalScores);
      setSoulPassport(passport);
      setCurrentModule(6); // Results

      await saveAssessment(updatedResponses, 6, finalScores, passport);
    }
  };

  /**
   * Handle portrait gallery completion - move to next module
   */
  const handlePortraitGalleryComplete = async () => {
    setShowPortraitGallery(false);
    setCurrentModule(2); // Move to Big Five
    await saveAssessment(responses, 2);
  };

  /**
   * Calculate final scores from all responses
   */
  const calculateFinalScores = (allResponses) => {
    console.log('Calculating final scores...', allResponses);

    const bigFiveScores = AssessmentScoring.calculateBigFive(allResponses.bigFive);
    const mbtiType = AssessmentScoring.calculateMBTI(allResponses.mbti);
    const loveLanguagesRanking = AssessmentScoring.calculateLoveLanguages(allResponses.loveLanguages);
    const dailyLifeAnalysis = AssessmentScoring.analyzeDailyLife(allResponses.dailyLife);

    return {
      bigFive: bigFiveScores,
      mbti: mbtiType,
      loveLanguages: loveLanguagesRanking,
      dailyLife: dailyLifeAnalysis,
      completedAt: new Date().toISOString()
    };
  };

  /**
   * Restart assessment for current profile
   */
  const handleRestart = async () => {
    const emptyResponses = { physicalLayer: {}, bigFive: [], mbti: [], loveLanguages: [], dailyLife: {}, enneagramScenarios: [] };
    setCurrentModule(0);
    setSelectedStartModule(null);
    setResponses(emptyResponses);
    setScores(null);
    setSoulPassport(null);
    setSavedAssessment(null);
    await saveAssessment(emptyResponses, 0, null, null);
  };

  /**
   * Jump to specific module (for editing)
   */
  const jumpToModule = (moduleNum) => {
    setCurrentModule(moduleNum);
  };

  /**
   * Start a specific assessment module
   */
  const startModule = (moduleNum) => {
    if (!selectedProfileId) return; // Require profile selection
    setSelectedStartModule(moduleNum);
    setCurrentModule(moduleNum);
  };

  /**
   * Get completion status for each module
   */
  const getModuleStatus = () => {
    return {
      physicalLayer: Object.keys(responses.physicalLayer || {}).length > 0,
      bigFive: responses.bigFive?.length > 0,
      mbti: responses.mbti?.length > 0,
      loveLanguages: responses.loveLanguages?.length > 0,
      dailyLife: Object.keys(responses.dailyLife || {}).length > 0,
      enneagramScenarios: responses.enneagramScenarios?.length > 0
    };
  };

  const moduleStatus = getModuleStatus();

  // Loading state
  if (profilesLoading || loading) {
    return (
      <div className="assessment-page">
        <div className="assessment-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-white/70">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // No profiles
  if (!profiles?.length) {
    return (
      <div className="assessment-page">
        <div className="assessment-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <p className="text-white/70 mb-4">Create a profile first to take the assessment</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/create-profile')}
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Go to previous module (save current and move back)
   */
  const goToPreviousModule = async () => {
    if (currentModule > 1) {
      // Save current progress before going back
      await saveAssessment(responses, currentModule - 1);
      setCurrentModule(currentModule - 1);
    } else if (currentModule === 1) {
      // Go back to intro
      setCurrentModule(0);
    }
  };

  /**
   * Module navigation component
   */
  const ModuleNavigation = () => {
    if (currentModule < 1 || currentModule > 5) return null;

    const moduleNames = ['', 'Physical Type', 'Big Five', 'MBTI', 'Love Languages', 'Daily Life'];

    return (
      <div className="module-navigation">
        <button
          className="btn-module-nav"
          onClick={goToPreviousModule}
        >
          ← {currentModule === 1 ? 'Overview' : moduleNames[currentModule - 1]}
        </button>
        <div className="module-nav-info">
          <span className="module-nav-current">{moduleNames[currentModule]}</span>
          <span className="module-nav-count">Module {currentModule} of 5</span>
        </div>
        <button
          className="btn-module-nav btn-skip"
          onClick={() => {
            // Skip to next module
            if (currentModule < 5) {
              saveAssessment(responses, currentModule + 1);
              setCurrentModule(currentModule + 1);
            }
          }}
          title="Skip to next module"
        >
          Skip →
        </button>
      </div>
    );
  };

  /**
   * Render current module
   */
  const renderModule = () => {
    switch (currentModule) {
      case 0:
        return (
          <div className="module-intro">
            <div className="intro-card">
              <h2>Constitutional Compatibility Assessment</h2>
              <p className="intro-description">
                Discover your true personality patterns through scenario-based questions.
                This assessment reveals who you really are - not who you think you should be.
              </p>

              {/* Profile selection message */}
              {!selectedProfileId && (
                <div className="profile-required-message">
                  <span className="icon">👆</span>
                  <span>Please select a profile above to begin</span>
                </div>
              )}

              {/* Previous progress indicator */}
              {selectedProfileId && savedAssessment && (moduleStatus.physicalLayer || moduleStatus.bigFive || moduleStatus.mbti || moduleStatus.loveLanguages || moduleStatus.dailyLife || moduleStatus.enneagramScenarios) && (
                <div className="previous-progress">
                  <h4>Your Progress</h4>
                  <div className="progress-modules">
                    <div className={`progress-module ${moduleStatus.physicalLayer ? 'completed' : ''}`}>
                      <span>🎨</span> Physical Type {moduleStatus.physicalLayer && '✓'}
                    </div>
                    <div className={`progress-module ${moduleStatus.bigFive ? 'completed' : ''}`}>
                      <span>🧠</span> Big Five {moduleStatus.bigFive && '✓'}
                    </div>
                    <div className={`progress-module ${moduleStatus.mbti ? 'completed' : ''}`}>
                      <span>🔮</span> MBTI {moduleStatus.mbti && '✓'}
                    </div>
                    <div className={`progress-module ${moduleStatus.enneagramScenarios ? 'completed' : ''}`}>
                      <span>🔷</span> Enneagram Scenarios {moduleStatus.enneagramScenarios && '✓'}
                    </div>
                    <div className={`progress-module ${moduleStatus.loveLanguages ? 'completed' : ''}`}>
                      <span>💕</span> Love Languages {moduleStatus.loveLanguages && '✓'}
                    </div>
                    <div className={`progress-module ${moduleStatus.dailyLife ? 'completed' : ''}`}>
                      <span>🏠</span> Daily Life {moduleStatus.dailyLife && '✓'}
                    </div>
                  </div>
                </div>
              )}

              <p className="select-module-hint">
                {selectedProfileId ? 'Click an assessment to begin:' : 'Select a profile, then choose an assessment:'}
              </p>

              <div className="assessment-modules">
                <div
                  className={`module-preview special ${selectedStartModule === 1 ? 'selected' : ''} ${moduleStatus.physicalLayer ? 'completed' : ''} ${selectedProfileId ? 'clickable' : 'disabled'}`}
                  onClick={() => startModule(1)}
                >
                  <span className="module-icon">🎨</span>
                  <div>
                    <h4>What's My Type Playground {moduleStatus.physicalLayer && <span className="check">✓</span>}</h4>
                    <p>35 attributes · Build yourself + ideal type</p>
                  </div>
                  {moduleStatus.physicalLayer && <span className="edit-hint">Click to edit</span>}
                </div>
                <div
                  className={`module-preview ${selectedStartModule === 2 ? 'selected' : ''} ${moduleStatus.bigFive ? 'completed' : ''} ${selectedProfileId ? 'clickable' : 'disabled'}`}
                  onClick={() => startModule(2)}
                >
                  <span className="module-icon">🧠</span>
                  <div>
                    <h4>Big Five Personality {moduleStatus.bigFive && <span className="check">✓</span>}</h4>
                    <p>50 questions · OCEAN model</p>
                  </div>
                  {moduleStatus.bigFive && <span className="edit-hint">Click to edit</span>}
                </div>
                <div
                  className={`module-preview ${selectedStartModule === 3 ? 'selected' : ''} ${moduleStatus.mbti ? 'completed' : ''} ${selectedProfileId ? 'clickable' : 'disabled'}`}
                  onClick={() => startModule(3)}
                >
                  <span className="module-icon">🔮</span>
                  <div>
                    <h4>MBTI Cognitive Functions {moduleStatus.mbti && <span className="check">✓</span>}</h4>
                    <p>40 questions · 16 types</p>
                  </div>
                  {moduleStatus.mbti && <span className="edit-hint">Click to edit</span>}
                </div>
                <div
                  className={`module-preview ${selectedStartModule === 7 ? 'selected' : ''} ${moduleStatus.enneagramScenarios ? 'completed' : ''} ${selectedProfileId ? 'clickable' : 'disabled'}`}
                  onClick={() => startModule(7)}
                >
                  <span className="module-icon">🔷</span>
                  <div>
                    <h4>Enneagram Scenarios {moduleStatus.enneagramScenarios && <span className="check">✓</span>}</h4>
                    <p>36 scenario questions · Compare with Alchemical Rose</p>
                  </div>
                  {moduleStatus.enneagramScenarios && <span className="edit-hint">Click to edit</span>}
                </div>
                <div
                  className={`module-preview ${selectedStartModule === 4 ? 'selected' : ''} ${moduleStatus.loveLanguages ? 'completed' : ''} ${selectedProfileId ? 'clickable' : 'disabled'}`}
                  onClick={() => startModule(4)}
                >
                  <span className="module-icon">💕</span>
                  <div>
                    <h4>Love Languages {moduleStatus.loveLanguages && <span className="check">✓</span>}</h4>
                    <p>30 questions · How you give & receive love</p>
                  </div>
                  {moduleStatus.loveLanguages && <span className="edit-hint">Click to edit</span>}
                </div>
                <div
                  className={`module-preview ${selectedStartModule === 5 ? 'selected' : ''} ${moduleStatus.dailyLife ? 'completed' : ''} ${selectedProfileId ? 'clickable' : 'disabled'}`}
                  onClick={() => startModule(5)}
                >
                  <span className="module-icon">🏠</span>
                  <div>
                    <h4>Daily Life Infrastructure {moduleStatus.dailyLife && <span className="check">✓</span>}</h4>
                    <p>16 questions · THE REVOLUTIONARY ONE</p>
                  </div>
                  {moduleStatus.dailyLife && <span className="edit-hint">Click to edit</span>}
                </div>
              </div>

              <div className="intro-actions">
                {scores ? (
                  <>
                    <button
                      className="btn-primary"
                      onClick={() => setCurrentModule(6)}
                      disabled={!selectedProfileId}
                    >
                      View Results
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={handleRestart}
                      disabled={!selectedProfileId}
                    >
                      Start Fresh
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => selectedStartModule ? setCurrentModule(selectedStartModule) : setCurrentModule(1)}
                    disabled={!selectedProfileId}
                  >
                    {!selectedProfileId
                      ? '← Select a Profile First'
                      : savedAssessment
                        ? 'Continue Assessment'
                        : 'Begin Assessment'}
                  </button>
                )}
              </div>

              <p className="time-estimate">Each assessment: 5-15 minutes</p>
            </div>
          </div>
        );

      case 1:
        // Show portrait gallery after Physical Layer completion
        if (showPortraitGallery) {
          return (
            <CouplePortraitGallery
              physicalLayer={responses.physicalLayer}
              onComplete={handlePortraitGalleryComplete}
              onBack={() => setShowPortraitGallery(false)}
            />
          );
        }
        return (
          <PhysicalLayerAssessment
            onComplete={(data) => handleModuleComplete(1, data)}
            existingResponses={responses.physicalLayer}
            onProgressUpdate={handleProgressUpdate}
            profileId={selectedProfileId}
          />
        );

      case 2:
        return (
          <BigFiveAssessment
            onComplete={(data) => handleModuleComplete(2, { bigFive: data })}
            existingResponses={responses.bigFive}
          />
        );

      case 3:
        return (
          <MBTIAssessment
            onComplete={(data) => handleModuleComplete(3, { mbti: data })}
            existingResponses={responses.mbti}
          />
        );

      case 4:
        return (
          <LoveLanguagesAssessment
            onComplete={(data) => handleModuleComplete(4, { loveLanguages: data })}
            existingResponses={responses.loveLanguages}
          />
        );

      case 5:
        return (
          <DailyLifeScenarios
            onComplete={(data) => handleModuleComplete(5, { dailyLife: data })}
            existingResponses={responses.dailyLife}
          />
        );

      case 7:
        return (
          <EnneagramAssessment
            onComplete={(data) => handleModuleComplete(7, { enneagramScenarios: data })}
            existingResponses={responses.enneagramScenarios}
          />
        );

      case 6:
        return (
          <div className="results-summary">
            <div className="results-card">
              <h2>Assessment Complete!</h2>
              <p className="results-subtitle">
                Results for <strong>{selectedProfile?.displayName || selectedProfile?.name}</strong>
              </p>

              {scores && (
                <div className="results-overview">
                  <div className="result-section">
                    <h4>Big Five Personality</h4>
                    <div className="trait-bars">
                      {Object.entries(scores.bigFive?.scores || {}).map(([trait, score]) => (
                        <div key={trait} className="trait-bar">
                          <span className="trait-name">{trait}</span>
                          <div className="bar-container">
                            <div className="bar-fill" style={{ width: `${score}%` }} />
                          </div>
                          <span className="trait-score">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="result-section">
                    <h4>MBTI Type</h4>
                    <div className="mbti-type">{scores.mbti?.type || 'N/A'}</div>
                    <p className="mbti-description">{scores.mbti?.description || ''}</p>
                  </div>

                  <div className="result-section">
                    <h4>Love Languages</h4>
                    <ol className="love-languages-list">
                      {(scores.loveLanguages?.ranking || []).slice(0, 3).map((lang) => (
                        <li key={lang.language}>
                          {lang.language} ({lang.percentage}%)
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="result-section">
                    <h4>Daily Life Infrastructure</h4>
                    <div className="daily-life-summary">
                      <p><strong>Dishes:</strong> {scores.dailyLife?.domesticLabor?.dishesResponse || 'N/A'}</p>
                      <p><strong>Chronotype:</strong> {scores.dailyLife?.dailyRhythms?.chronotype || 'N/A'}</p>
                      <p><strong>Space Style:</strong> {scores.dailyLife?.environmentalNeeds?.spaceStyle || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="results-actions">
                <button className="btn-secondary" onClick={() => setCurrentModule(0)}>
                  Edit Answers
                </button>
                <button className="btn-secondary" onClick={handleRestart}>
                  Retake Assessment
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    const dataStr = JSON.stringify(soulPassport, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `soul-passport-${selectedProfile?.displayName || 'profile'}.json`;
                    a.click();
                  }}
                >
                  Download Soul Passport
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid module</div>;
    }
  };

  return (
    <div className="assessment-page">
      {/* Header */}
      <header className="assessment-header-bar">
        {/* Left side - Profile Selector and Dashboard link */}
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

        {/* Right side - Progress and Saving */}
        <div className="header-right">
          {currentModule > 0 && currentModule < 6 && (
            <div className="progress-indicator">
              <span>Module {currentModule} of 5</span>
              <div className="mini-progress">
                <div className="mini-progress-fill" style={{ width: `${(currentModule / 5) * 100}%` }} />
              </div>
            </div>
          )}

          {saving && (
            <div className="saving-indicator">
              <span>💾 Saving...</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="assessment-main">
        <ModuleNavigation />
        {renderModule()}
      </main>

      {/* Footer */}
      <footer className="assessment-footer">
        <p>Your answers are saved automatically to your profile</p>
      </footer>
    </div>
  );
}
