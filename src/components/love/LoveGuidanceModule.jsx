/**
 * LOVE GUIDANCE MODULE
 *
 * "Nancy and I understood each other's needs constitutionally.
 *  She knew what I needed before I did. I learned to love her
 *  the way SHE needed, not just the way I wanted to give."
 *  - Ronald Reagan
 *
 * Not compatibility scores - ACTIONABLE love guidance.
 * How to love them THEIR way, not just YOUR way.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  getConstitutionalNeeds,
  calculateLoveBridge,
  getLoveAssignments
} from '../../services/loveGuidanceService';

function LoveGuidanceModule({ userProfile, partnerProfile }) {
  const [activeSection, setActiveSection] = useState('needs');
  const [completedAssignments, setCompletedAssignments] = useState({});

  // Calculate all love guidance data
  const partnerNeeds = useMemo(() => {
    return getConstitutionalNeeds(partnerProfile);
  }, [partnerProfile]);

  const userExpression = useMemo(() => {
    return getConstitutionalNeeds(userProfile);
  }, [userProfile]);

  const bridge = useMemo(() => {
    return calculateLoveBridge(userProfile, partnerProfile);
  }, [userProfile, partnerProfile]);

  const assignments = useMemo(() => {
    return getLoveAssignments(userProfile, partnerProfile);
  }, [userProfile, partnerProfile]);

  if (!partnerProfile) {
    return (
      <div className="love-guidance-empty bg-slate-800 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">💕</div>
        <h2 className="text-2xl font-bold text-white mb-2">Love Guidance</h2>
        <p className="text-slate-400">
          Add a partner's profile to learn how to love them constitutionally.
        </p>
      </div>
    );
  }

  const partnerName = partnerProfile?.name || partnerProfile?.firstName || 'Your Partner';

  // Toggle assignment completion
  const toggleAssignment = (type, index) => {
    setCompletedAssignments(prev => ({
      ...prev,
      [`${type}-${index}`]: !prev[`${type}-${index}`]
    }));
  };

  return (
    <div className="love-guidance-module space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-900/50 to-rose-900/50 rounded-2xl p-6 border border-pink-500/30">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          How to Love {partnerName}
        </h1>
        <p className="text-pink-200 text-center mb-6">
          Based on their constitutional profile - Not compatibility scores,
          but <strong>actionable love guidance</strong>
        </p>

        {/* Ronald & Nancy Quote */}
        <div className="bg-slate-800/50 rounded-xl p-5 max-w-2xl mx-auto">
          <p className="text-slate-300 italic text-center leading-relaxed">
            "Nancy and I understood each other's needs constitutionally.
            She knew what I needed before I did. I learned to love her
            the way SHE needed, not just the way I wanted to give."
          </p>
          <p className="text-pink-400 text-center mt-3 text-sm">— Ronald Reagan</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: 'needs', label: 'Their Needs', icon: '💙' },
          { key: 'show', label: 'How They Love', icon: '💕' },
          { key: 'bridge', label: 'The Bridge', icon: '🌉' },
          { key: 'teach', label: 'Teach Them', icon: '📖' },
          { key: 'assignments', label: 'Assignments', icon: '✅' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeSection === tab.key
                ? 'bg-pink-600 text-white ring-2 ring-pink-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Constitutional Profile Summary */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🧬</span>
          <span>{partnerName}'s Constitutional Makeup</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* BaZi */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-amber-400 font-semibold mb-2">BaZi</h3>
            {partnerProfile?.bazi ? (
              <>
                <p className="text-slate-300 text-sm">
                  Day Master: <span className="text-white">{partnerProfile.bazi.dayMaster || partnerProfile.bazi.dayMasterElement}</span>
                </p>
                <p className="text-slate-300 text-sm">
                  Element: <span className="text-white">{partnerProfile.bazi.primaryElement || partnerProfile.bazi.dayMasterElement}</span>
                </p>
              </>
            ) : (
              <p className="text-slate-500 text-sm italic">Not available</p>
            )}
          </div>

          {/* Western Astrology */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-purple-400 font-semibold mb-2">Western Astrology</h3>
            {partnerProfile?.western || partnerProfile?.sunSign ? (
              <>
                <p className="text-slate-300 text-sm">
                  Sun: <span className="text-white">{partnerProfile.western?.sun || partnerProfile.sunSign}</span>
                </p>
                {partnerProfile?.western?.moon && (
                  <p className="text-slate-300 text-sm">
                    Moon: <span className="text-white">{partnerProfile.western.moon}</span>
                  </p>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-sm italic">Not available</p>
            )}
          </div>

          {/* Numerology */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-indigo-400 font-semibold mb-2">Numerology</h3>
            {partnerProfile?.numerology ? (
              <>
                <p className="text-slate-300 text-sm">
                  Life Path: <span className="text-white">{partnerProfile.numerology.lifePath}</span>
                </p>
                <p className="text-slate-300 text-sm">
                  Soul Urge: <span className="text-white">{partnerProfile.numerology.soulUrge}</span>
                </p>
              </>
            ) : (
              <p className="text-slate-500 text-sm italic">Not available</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: What They NEED */}
      {activeSection === 'needs' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">What {partnerName} Needs</h2>
            <p className="text-slate-400">Based on their constitutional profile</p>
          </div>

          {partnerNeeds.length > 0 ? (
            partnerNeeds.map((need, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-6 border-l-4 border-pink-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{need.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{need.title}</h3>
                    <span className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full">
                      {need.category}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 mb-4 leading-relaxed">
                  {need.explanation}
                </p>

                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-4">
                  <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                    <span>💕</span>
                    <span>How to Love Them:</span>
                  </h4>
                  <ul className="space-y-2">
                    {need.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {need.example && (
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <h4 className="text-amber-400 font-semibold mb-2">Example:</h4>
                    <p className="text-slate-300 italic">"{need.example}"</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400">
                Add more profile details to get personalized love guidance.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION: How They Show Love */}
      {activeSection === 'show' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">How {partnerName} Shows Love</h2>
            <p className="text-slate-400">
              Recognize these as LOVE - this is how they say "I love you"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {partnerNeeds.filter(need => need.howTheyShow).map((need, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{need.icon}</span>
                  <h3 className="text-lg font-semibold text-white">{need.howTheyShow.title}</h3>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  {need.howTheyShow.description}
                </p>
                <div className="bg-pink-900/30 rounded-lg p-3">
                  <p className="text-pink-300 text-sm">
                    <strong>When they</strong> {need.howTheyShow.action}, <strong>that's them loving you.</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {partnerNeeds.filter(need => need.howTheyShow).length === 0 && (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400">
                Add more profile details to see how they show love.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION: The Bridge */}
      {activeSection === 'bridge' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Love Challenge</h2>
            <p className="text-slate-400">
              The constitutional gap between you and how to bridge it
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            {/* The Challenge */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 mb-6">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>The Constitutional Gap:</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">{bridge.challenge}</p>
            </div>

            {/* The Solution */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5 mb-6">
              <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                <span>🌉</span>
                <span>The Bridge:</span>
              </h3>
              <ul className="space-y-2">
                {bridge.solutions.map((solution, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example */}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <span>💬</span>
                <span>Real-Life Example:</span>
              </h3>
              <p className="text-slate-300 italic leading-relaxed">{bridge.example}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Teach Them */}
      {activeSection === 'teach' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Teach Them to Love YOU</h2>
            <p className="text-slate-400">
              "Honey, here's how I need to be loved..."
            </p>
          </div>

          {userExpression.length > 0 ? (
            userExpression.map((expression, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-6 border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{expression.icon}</span>
                  <h3 className="text-xl font-bold text-white">{expression.title}</h3>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 mb-4">
                  <h4 className="text-indigo-400 font-semibold mb-2">What to Say:</h4>
                  <blockquote className="text-slate-300 italic border-l-2 border-indigo-400 pl-4">
                    "{expression.explanation}"
                  </blockquote>
                </div>

                <div>
                  <h4 className="text-slate-400 font-semibold mb-2">What You Need:</h4>
                  <ul className="space-y-2">
                    {expression.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400">
                Add more profile details to get personalized guidance.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION: Assignments */}
      {activeSection === 'assignments' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Love Assignments</h2>
            <p className="text-slate-400">
              Practical actions to deepen your love
            </p>
          </div>

          {/* Weekly Assignments */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>This Week:</span>
            </h3>
            <div className="space-y-3">
              {assignments.weekly.map((task, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    completedAssignments[`weekly-${index}`]
                      ? 'bg-green-900/30 border border-green-500/30'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                  onClick={() => toggleAssignment('weekly', index)}
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    completedAssignments[`weekly-${index}`]
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-slate-500'
                  }`}>
                    {completedAssignments[`weekly-${index}`] && '✓'}
                  </div>
                  <span className="text-xl">{task.icon}</span>
                  <span className={completedAssignments[`weekly-${index}`] ? 'text-slate-400 line-through' : 'text-slate-200'}>
                    {task.task}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Monthly Assignments */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🗓️</span>
              <span>This Month:</span>
            </h3>
            <div className="space-y-3">
              {assignments.monthly.map((task, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    completedAssignments[`monthly-${index}`]
                      ? 'bg-green-900/30 border border-green-500/30'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                  onClick={() => toggleAssignment('monthly', index)}
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    completedAssignments[`monthly-${index}`]
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-slate-500'
                  }`}>
                    {completedAssignments[`monthly-${index}`] && '✓'}
                  </div>
                  <span className="text-xl">{task.icon}</span>
                  <span className={completedAssignments[`monthly-${index}`] ? 'text-slate-400 line-through' : 'text-slate-200'}>
                    {task.task}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ronald & Nancy Example Section */}
      <div className="bg-gradient-to-r from-rose-900/30 to-pink-900/30 rounded-2xl p-6 border border-rose-500/30">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💑</span>
          <span>The Ronald & Nancy Reagan Example</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h3 className="text-pink-300 font-semibold mb-3">Nancy Understood Ronald Needed:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>Public confidence (she provided unwavering support)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>Private vulnerability space (she created safe haven)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>Someone who believed in him absolutely (she did)</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <h3 className="text-pink-300 font-semibold mb-3">Ronald Understood Nancy Needed:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>To feel essential to him (he made her his everything)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>Protection and security (he provided it)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>To be seen as partner, not accessory (he honored her)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5">
          <p className="text-slate-300 leading-relaxed text-center">
            <strong className="text-pink-300">The Lesson:</strong> They didn't have "perfect compatibility."
            They <strong className="text-white">LEARNED</strong> each other's constitutional needs and
            <strong className="text-white"> CHOSE</strong> to love that way.
            <span className="text-pink-300"> Every single day.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoveGuidanceModule;
