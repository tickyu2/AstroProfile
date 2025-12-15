/**
 * 5W+H+Soul Analysis Display
 * Aristotle's Four Causes + Soul Dimension
 * Complete framework for understanding love and connection
 * Built with SOUL for humanity's relationship discovery
 */

import React, { useState } from 'react';
import { get5WHSoulAnalysis, has5WHSoulContent } from '../../utils/mbti/mbti5WHSoulDatabase';
import { getCompatibilityAnalysis } from '../../utils/mbti/mbtiCompatibilityEngine';

export default function FiveWHSoulAnalysis({ userType, partnerType, baziData, onBack }) {
  const [expandedDimension, setExpandedDimension] = useState(null);

  const hasDeepContent = has5WHSoulContent(userType, partnerType);
  const analysis = getCompatibilityAnalysis(userType, partnerType);
  const deepAnalysis = hasDeepContent ? get5WHSoulAnalysis(userType, partnerType) : null;

  const toggleDimension = (key) => {
    setExpandedDimension(expandedDimension === key ? null : key);
  };

  if (!hasDeepContent || !deepAnalysis) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-8 text-center space-y-4">
        <span className="text-5xl block">🔮</span>
        <h3 className="text-xl font-bold text-blue-300">
          Deep Soul Analysis Coming Soon
        </h3>
        <p className="text-blue-200 text-sm max-w-2xl mx-auto">
          The complete 5W+H+Soul analysis for {userType} × {partnerType} is being crafted with extraordinary care.
          This is not generic content - each pairing receives deep psychological and philosophical exploration.
        </p>

        {/* Show basic analysis instead */}
        <div className="mt-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-400/30 rounded-lg p-6 text-left">
          <h4 className="text-lg font-bold text-blue-300 mb-3">Basic Compatibility Analysis</h4>
          <div className="space-y-3 text-blue-200 text-sm">
            <p><span className="font-bold">Score:</span> {analysis.score}% - {analysis.level.level} {analysis.level.icon}</p>
            <p><span className="font-bold">Cognitive Alignment:</span> {analysis.cognitive.alignment} ({analysis.cognitive.sharedFunctions}/4 shared functions)</p>
            <p><span className="font-bold">Temperament:</span> {analysis.temperament.description}</p>
            <div className="mt-4 p-4 bg-blue-900/30 rounded border border-blue-500/20">
              <p className="text-blue-100 whitespace-pre-line">{analysis.summary}</p>
            </div>
          </div>
        </div>

        <p className="text-blue-400 text-xs mt-4 italic">
          Available now: INFJ-ENFP Golden Pair • More pairings coming soon
        </p>
      </div>
    );
  }

  // Dimensions structure
  const dimensions = [
    {
      key: 'who',
      icon: '👥',
      title: 'WHO Brings What',
      color: 'from-rose-500 to-pink-600',
      sections: [
        { key: 'partner1Brings', title: `${deepAnalysis.who.partner1Brings.type}: ${deepAnalysis.who.partner1Brings.name}`, content: deepAnalysis.who.partner1Brings },
        { key: 'partner2Brings', title: `${deepAnalysis.who.partner2Brings.type}: ${deepAnalysis.who.partner2Brings.name}`, content: deepAnalysis.who.partner2Brings },
        { key: 'synergy', title: 'The Synergy', content: { essence: deepAnalysis.who.synergy } }
      ]
    },
    {
      key: 'what',
      icon: '✨',
      title: 'WHAT You Create Together',
      color: 'from-amber-500 to-orange-600',
      content: deepAnalysis.what
    },
    {
      key: 'when',
      icon: '⚡',
      title: 'WHEN Challenges Arise',
      color: 'from-red-500 to-rose-600',
      content: deepAnalysis.when
    },
    {
      key: 'where',
      icon: '🌟',
      title: 'WHERE You Thrive',
      color: 'from-emerald-500 to-green-600',
      content: deepAnalysis.where
    },
    {
      key: 'why',
      icon: '💡',
      title: 'WHY It Works',
      color: 'from-blue-500 to-indigo-600',
      content: deepAnalysis.why
    },
    {
      key: 'how',
      icon: '🛠️',
      title: 'HOW to Nurture It',
      color: 'from-violet-500 to-purple-600',
      content: deepAnalysis.how
    },
    {
      key: 'soul',
      icon: '💜',
      title: 'SOUL Purpose',
      color: 'from-purple-500 to-fuchsia-600',
      content: deepAnalysis.soul
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header - The Golden Pair */}
      <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-purple-400/50 rounded-lg p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{deepAnalysis.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white">
                {deepAnalysis.pairName}
              </h2>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-lg text-sm font-bold text-white">
                {deepAnalysis.compatibilityScore}%
              </span>
            </div>
            <p className="text-purple-100 text-lg italic mb-3">
              {deepAnalysis.tagline}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{userType}</span>
                <span className="text-purple-200">×</span>
                <span className="text-2xl font-bold text-white">{partnerType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🏛️</span>
          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-2">
              The 5W+H+Soul Framework
            </h3>
            <p className="text-blue-200 text-sm">
              Aristotle's Four Causes (WHO, WHAT, WHY, HOW) + modern psychology (WHEN, WHERE) + mystical recognition (SOUL).
              This is the complete framework for understanding relationship dynamics - not surface attraction, but soul-level compatibility.
            </p>
          </div>
        </div>
      </div>

      {/* The Seven Dimensions */}
      <div className="space-y-3">
        {dimensions.map((dimension) => (
          <div
            key={dimension.key}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-400/50"
          >
            {/* Dimension Header */}
            <button
              onClick={() => toggleDimension(dimension.key)}
              className={`w-full p-5 flex items-center justify-between transition-colors bg-gradient-to-r ${dimension.color} bg-opacity-10 hover:bg-opacity-20`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{dimension.icon}</span>
                <h4 className="text-lg font-bold text-white">{dimension.title}</h4>
              </div>
              <svg
                className={`w-5 h-5 text-white transition-transform duration-300 ${
                  expandedDimension === dimension.key ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7-7-7" />
              </svg>
            </button>

            {/* Dimension Content */}
            {expandedDimension === dimension.key && (
              <div className="px-5 pb-5 space-y-4 animate-slideDown">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                {/* WHO dimension (special structure) */}
                {dimension.key === 'who' && dimension.sections && (
                  <div className="space-y-4">
                    {dimension.sections.map((section) => (
                      <div key={section.key} className="space-y-2">
                        <h5 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                          {section.title}
                        </h5>
                        {section.content.essence && (
                          <p className="text-purple-100 text-sm leading-relaxed whitespace-pre-line">
                            {section.content.essence}
                          </p>
                        )}
                        {section.content.gifts && (
                          <ul className="space-y-1 ml-4">
                            {section.content.gifts.map((gift, i) => (
                              <li key={i} className="text-purple-100 text-sm flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>{gift}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Other dimensions */}
                {dimension.key !== 'who' && dimension.content && (
                  <div className="space-y-4">
                    {Object.entries(dimension.content).map(([key, value]) => {
                      if (typeof value === 'string') {
                        return (
                          <div key={key} className="space-y-2">
                            <h5 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <p className="text-purple-100 text-sm leading-relaxed whitespace-pre-line">
                              {value}
                            </p>
                          </div>
                        );
                      } else if (Array.isArray(value)) {
                        return (
                          <div key={key} className="space-y-2">
                            <h5 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            {value.map((item, i) => (
                              <div key={i} className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                                {typeof item === 'string' ? (
                                  <p className="text-purple-100 text-sm">{item}</p>
                                ) : (
                                  <>
                                    {item.challenge && <p className="font-bold text-purple-200 text-sm mb-1">{item.challenge}</p>}
                                    {item.context && <p className="font-bold text-purple-200 text-sm mb-1">{item.context}</p>}
                                    {item.description && <p className="text-purple-100 text-sm mb-2">{item.description}</p>}
                                    {item.resolution && <p className="text-green-300 text-sm italic">→ {item.resolution}</p>}
                                    {item.title && <p className="font-bold text-purple-200 text-sm mb-1">{item.title}</p>}
                                    {item.guidance && (
                                      <ul className="space-y-1 mt-2">
                                        {item.guidance.map((g, gi) => (
                                          <li key={gi} className="text-purple-100 text-sm flex items-start gap-2">
                                            <span className="text-purple-400">•</span>
                                            <span>{g}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      } else if (typeof value === 'object' && value !== null) {
                        return (
                          <div key={key} className="space-y-2">
                            <h5 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="space-y-2">
                                {typeof subValue === 'string' ? (
                                  <>
                                    <p className="text-sm font-medium text-purple-200">{subKey}:</p>
                                    <p className="text-purple-100 text-sm leading-relaxed whitespace-pre-line ml-3">
                                      {subValue}
                                    </p>
                                  </>
                                ) : Array.isArray(subValue) && (
                                  <>
                                    <p className="text-sm font-medium text-purple-200">{subKey}:</p>
                                    <ul className="space-y-1 ml-4">
                                      {subValue.map((item, i) => (
                                        <li key={i} className="text-purple-100 text-sm flex items-start gap-2">
                                          <span className="text-purple-400">•</span>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-lg p-6 text-center">
        <p className="text-purple-100 text-sm italic mb-2">
          "Love is composed of a single soul inhabiting two bodies" - Aristotle
        </p>
        <p className="text-purple-200 text-xs">
          This analysis shows the potential. You create the reality through consciousness, authenticity, and love.
        </p>
      </div>

      {/* Back Button - Navigate to Compatibility Panel */}
      {onBack && (
        <div className="mt-6">
          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            ← Back to Compatibility
          </button>
        </div>
      )}

    </div>
  );
}
