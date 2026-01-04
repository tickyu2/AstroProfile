/**
 * CCLR Create Session Page
 *
 * Wizard for creating a new Couples Cosmic Love Rejuvenation session.
 * Steps:
 * 1. Partner A info (current user)
 * 2. Partner B info (invite partner)
 * 3. Relationship details
 * 4. Select initial angel couple
 * 5. Initial assessment
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  createRejuvenationSession,
  getAllAngelCouples,
  recommendAngelCouple,
  saveInitialAssessment
} from '../../services/cclr';

const RELATIONSHIP_TYPES = [
  { id: 'dating', label: 'Dating', icon: '💕' },
  { id: 'engaged', label: 'Engaged', icon: '💍' },
  { id: 'married', label: 'Married', icon: '💒' },
  { id: 'long-term', label: 'Long-term Partnership', icon: '🏠' },
  { id: 'other', label: 'Other', icon: '❤️' }
];

const CHALLENGES = [
  { id: 'independence_intimacy', label: 'Balancing space & closeness', icon: '⚖️' },
  { id: 'dual_careers', label: 'Dual career balance', icon: '💼' },
  { id: 'forgiveness', label: 'Healing & forgiveness', icon: '🕊️' },
  { id: 'power_dynamics', label: 'Power dynamics', icon: '👑' },
  { id: 'communication', label: 'Communication issues', icon: '💬' },
  { id: 'intimacy', label: 'Physical intimacy', icon: '🔥' },
  { id: 'trust', label: 'Trust rebuilding', icon: '🤝' },
  { id: 'parenting', label: 'Parenting differences', icon: '👶' }
];

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [partnerA, setPartnerA] = useState({
    userId: '',
    name: '',
    constitution: null
  });

  const [partnerB, setPartnerB] = useState({
    userId: '',
    name: '',
    email: '',
    constitution: null
  });

  const [relationship, setRelationship] = useState({
    type: '',
    duration: '',
    challenges: []
  });

  const [selectedAngel, setSelectedAngel] = useState(null);
  const [angelCouples, setAngelCouples] = useState([]);
  const [recommendedAngel, setRecommendedAngel] = useState(null);

  const [assessment, setAssessment] = useState({
    loveLevel: 5,
    compassionLevel: 5,
    connectionLevel: 5,
    notes: ''
  });

  // Load current user data
  useEffect(() => {
    if (currentUser && userProfile) {
      setPartnerA({
        userId: currentUser.uid,
        name: userProfile.displayName || userProfile.name || 'Partner A',
        constitution: userProfile.constitution || null
      });
    }
  }, [currentUser, userProfile]);

  // Load angel couples
  useEffect(() => {
    const couples = getAllAngelCouples();
    setAngelCouples(couples);
  }, []);

  // Get recommendation when challenges change
  useEffect(() => {
    if (relationship.challenges.length > 0) {
      const recommended = recommendAngelCouple(relationship.challenges[0]);
      setRecommendedAngel(recommended);
      if (!selectedAngel && recommended) {
        setSelectedAngel(recommended.coupleId);
      }
    }
  }, [relationship.challenges]);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create the session
      const result = await createRejuvenationSession({
        partnerA,
        partnerB: {
          ...partnerB,
          userId: partnerB.userId || `pending_${Date.now()}`
        },
        relationshipType: relationship.type,
        relationshipDuration: relationship.duration,
        initialAngelCoupleId: selectedAngel
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Save initial assessment
      await saveInitialAssessment(result.sessionId, assessment);

      // Navigate to the session
      navigate(`/cclr/session/${result.sessionId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleChallenge = (challengeId) => {
    setRelationship(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challengeId)
        ? prev.challenges.filter(c => c !== challengeId)
        : [...prev.challenges, challengeId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Couples Cosmic Love Rejuvenation
          </h1>
          <p className="text-slate-400 mt-2">
            Begin your journey with history's greatest love stories as your guide
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s === step
                    ? 'bg-purple-500 text-white scale-110'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 5 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    s < step ? 'bg-green-500' : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Step 1: Partner A (You) */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">About You</h2>
              <div>
                <label className="block text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={partnerA.name}
                  onChange={(e) => setPartnerA({ ...partnerA, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="How should we address you?"
                />
              </div>
              {partnerA.constitution && (
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    Your constitutional profile is linked
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Partner B */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Your Partner</h2>
              <div>
                <label className="block text-slate-300 mb-2">Partner's Name</label>
                <input
                  type="text"
                  value={partnerB.name}
                  onChange={(e) => setPartnerB({ ...partnerB, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Your partner's name"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Partner's Email (optional)</label>
                <input
                  type="email"
                  value={partnerB.email}
                  onChange={(e) => setPartnerB({ ...partnerB, email: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="To invite them to join"
                />
              </div>
              <p className="text-slate-400 text-sm">
                You can start the session now and invite your partner later.
              </p>
            </div>
          )}

          {/* Step 3: Relationship Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Your Relationship</h2>

              <div>
                <label className="block text-slate-300 mb-3">Relationship Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {RELATIONSHIP_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setRelationship({ ...relationship, type: type.id })}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        relationship.type === type.id
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-2xl mr-2">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">How Long Together?</label>
                <input
                  type="text"
                  value={relationship.duration}
                  onChange={(e) => setRelationship({ ...relationship, duration: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g., 3 years, 6 months"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3">Current Challenges (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {CHALLENGES.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => toggleChallenge(challenge.id)}
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${
                        relationship.challenges.includes(challenge.id)
                          ? 'bg-pink-500/20 border-pink-500 text-white'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="mr-2">{challenge.icon}</span>
                      {challenge.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Select Angel Couple */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Choose Your Guides</h2>
              <p className="text-slate-400">
                Select a legendary couple to guide your rejuvenation journey
              </p>

              {recommendedAngel && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    Based on your challenges, we recommend: <strong>{recommendedAngel.coupleName}</strong>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {angelCouples.map((couple) => (
                  <button
                    key={couple.coupleId}
                    onClick={() => setSelectedAngel(couple.coupleId)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedAngel === couple.coupleId
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: couple.coupleColor + '30' }}
                      >
                        {couple.angel1.icon?.[0] || '💕'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{couple.coupleName}</h3>
                        <p className="text-slate-400 text-sm mt-1">{couple.angelWisdom}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {couple.counselingStrengths.slice(0, 3).map((strength, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedAngel === couple.coupleId && (
                        <div className="text-purple-400 text-xl">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Initial Assessment */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Initial Assessment</h2>
              <p className="text-slate-400">
                Rate your current relationship state (we'll track progress over time)
              </p>

              {/* Love Level */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-slate-300">Love Level</label>
                  <span className="text-purple-400 font-semibold">{assessment.loveLevel}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.loveLevel}
                  onChange={(e) => setAssessment({ ...assessment, loveLevel: parseInt(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Compassion Level */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-slate-300">Compassion Level</label>
                  <span className="text-pink-400 font-semibold">{assessment.compassionLevel}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.compassionLevel}
                  onChange={(e) => setAssessment({ ...assessment, compassionLevel: parseInt(e.target.value) })}
                  className="w-full accent-pink-500"
                />
              </div>

              {/* Connection Level */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-slate-300">Connection Level</label>
                  <span className="text-blue-400 font-semibold">{assessment.connectionLevel}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.connectionLevel}
                  onChange={(e) => setAssessment({ ...assessment, connectionLevel: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 mb-2">Any notes? (optional)</label>
                <textarea
                  value={assessment.notes}
                  onChange={(e) => setAssessment({ ...assessment, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 h-24 resize-none"
                  placeholder="What would you like to work on?"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                step === 1
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !partnerA.name) ||
                  (step === 2 && !partnerB.name) ||
                  (step === 3 && !relationship.type) ||
                  (step === 4 && !selectedAngel)
                }
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Begin Journey'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
