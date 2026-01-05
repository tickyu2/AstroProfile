/**
 * INTERACTIONS TAB
 *
 * How your numbers work together:
 * - Harmonies and tensions between numbers
 * - Your unique combination pattern
 * - Inner vs Outer dynamics
 * - Path vs Purpose alignment
 */

import React from 'react';
import {
  lifePathInterpretations,
  soulUrgeInterpretations,
  personalityInterpretations
} from '../../data/numerologyInterpretations';

function InteractionsTab({ numerologyData }) {
  if (!numerologyData) return null;

  const { lifePath, destiny, soulUrge, personality } = numerologyData;

  // Get interpretations
  const lifePathInfo = lifePathInterpretations[lifePath] || {};
  const destinyInfo = lifePathInterpretations[destiny] || {};
  const soulUrgeInfo = soulUrgeInterpretations[soulUrge] || {};
  const personalityInfo = personalityInterpretations[personality] || {};

  // Analyze patterns
  const samePathDestiny = lifePath === destiny;
  const samePathSoul = lifePath === soulUrge;
  const samePathPersonality = lifePath === personality;
  const sameSoulPersonality = soulUrge === personality;

  // Count occurrences of each number
  const numberCounts = {};
  [lifePath, destiny, soulUrge, personality].forEach(num => {
    numberCounts[num] = (numberCounts[num] || 0) + 1;
  });

  // Find dominant numbers (appearing 2+ times)
  const dominantNumbers = Object.entries(numberCounts)
    .filter(([, count]) => count >= 2)
    .map(([num]) => parseInt(num));

  // Check for master numbers
  const hasMasterNumber = [11, 22, 33].some(m =>
    [lifePath, destiny].includes(m)
  );

  // Generate unique signature name
  const generateSignatureName = () => {
    // Check for specific patterns
    if (lifePath === 7 && destiny === 7 && soulUrge === 2 && personality === 5) {
      return "The Wise Adventurer";
    }

    // Check for triple+ same number
    if (dominantNumbers.length > 0 && numberCounts[dominantNumbers[0]] >= 3) {
      const dom = dominantNumbers[0];
      const titles = {
        1: "The Pure Pioneer",
        2: "The Sacred Peacemaker",
        3: "The Master Communicator",
        4: "The Foundation Builder",
        5: "The Ultimate Freedom Seeker",
        6: "The Divine Nurturer",
        7: "The Deep Seeker",
        8: "The Power Master",
        9: "The Universal Healer"
      };
      return titles[dom] || `The Triple ${dom}`;
    }

    // Double Life Path + Destiny
    if (samePathDestiny) {
      return `The Focused ${lifePathInfo.title}`;
    }

    // Combine dominant themes
    const themes = [];
    if (lifePathInfo.title) themes.push(lifePathInfo.title.split(' ').pop());
    if (personalityInfo.title && !themes.includes(personalityInfo.title.split(' ').pop())) {
      themes.push(personalityInfo.title.split(' ').pop());
    }

    return `The ${themes.join('-')}`;
  };

  const signatureName = generateSignatureName();

  return (
    <div className="space-y-8">
      {/* Signature Header */}
      <div className="text-center bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-500/30">
        <h2 className="text-3xl font-bold text-white mb-2">{signatureName}</h2>
        <p className="text-lg text-indigo-300 mb-4">
          Your Unique Numerological Signature
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 bg-indigo-600/30 rounded-full text-indigo-300">
            Life Path {lifePath}
          </span>
          <span className="text-slate-500">+</span>
          <span className="px-4 py-2 bg-purple-600/30 rounded-full text-purple-300">
            Destiny {destiny}
          </span>
          <span className="text-slate-500">+</span>
          <span className="px-4 py-2 bg-pink-600/30 rounded-full text-pink-300">
            Soul Urge {soulUrge}
          </span>
          <span className="text-slate-500">+</span>
          <span className="px-4 py-2 bg-amber-600/30 rounded-full text-amber-300">
            Personality {personality}
          </span>
        </div>
      </div>

      {/* Visual Connection Diagram */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Number Connections</h3>

        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {/* Life Path - Destiny Connection */}
          <div className={`p-4 rounded-xl border-2 ${samePathDestiny ? 'border-green-500 bg-green-900/20' : 'border-slate-600 bg-slate-700/50'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-indigo-400">{lifePath}</span>
              <span className="text-slate-400">↔</span>
              <span className="text-2xl font-bold text-purple-400">{destiny}</span>
            </div>
            <p className="text-xs text-slate-400 text-center">Path ↔ Purpose</p>
            {samePathDestiny && (
              <p className="text-xs text-green-400 text-center mt-1">Aligned!</p>
            )}
          </div>

          {/* Soul Urge - Personality Connection */}
          <div className={`p-4 rounded-xl border-2 ${sameSoulPersonality ? 'border-green-500 bg-green-900/20' : 'border-slate-600 bg-slate-700/50'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-pink-400">{soulUrge}</span>
              <span className="text-slate-400">↔</span>
              <span className="text-2xl font-bold text-amber-400">{personality}</span>
            </div>
            <p className="text-xs text-slate-400 text-center">Inner ↔ Outer</p>
            {sameSoulPersonality ? (
              <p className="text-xs text-green-400 text-center mt-1">Aligned!</p>
            ) : (
              <p className="text-xs text-amber-400 text-center mt-1">Dynamic tension</p>
            )}
          </div>
        </div>
      </div>

      {/* Path vs Purpose Analysis */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Path vs Purpose</span>
        </h3>

        {samePathDestiny ? (
          <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
            <h4 className="text-green-400 font-semibold mb-2">Perfect Alignment</h4>
            <p className="text-slate-300 leading-relaxed">
              Your Life Path {lifePath} equals your Destiny {destiny}, creating powerful focus.
              You are both walking the path and heading toward the same destination:
              <strong className="text-white"> {lifePathInfo.title}</strong>.
              This reinforcement means the energy of {lifePath} is your core theme - embrace it fully.
            </p>
          </div>
        ) : (
          <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4">
            <h4 className="text-indigo-400 font-semibold mb-2">Dynamic Growth Pattern</h4>
            <p className="text-slate-300 leading-relaxed mb-4">
              Your Life Path {lifePath} (<span className="text-indigo-300">{lifePathInfo.title}</span>) leads
              to your Destiny {destiny} (<span className="text-purple-300">{destinyInfo.title}</span>).
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong>Integration:</strong> You walk the path of the {lifePathInfo.title?.toLowerCase() || 'seeker'}
              to become the {destinyInfo.title?.toLowerCase() || 'master'}. The lessons of {lifePath} prepare
              you for the purpose of {destiny}.
            </p>
          </div>
        )}
      </div>

      {/* Inner vs Outer Self */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔮</span>
          <span>Inner Self vs Outer Self</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inner Self */}
          <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
            <h4 className="text-pink-400 font-semibold mb-3">Inner Self (Soul Urge {soulUrge})</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• <strong>Desires:</strong> {soulUrgeInfo.desires}</li>
              <li>• <strong>Needs:</strong> {soulUrgeInfo.needs}</li>
              <li>• <strong>Driven by:</strong> {soulUrgeInfo.innerDrive}</li>
              <li>• <strong>Motivated by:</strong> {soulUrgeInfo.motivation}</li>
            </ul>
          </div>

          {/* Outer Self */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
            <h4 className="text-amber-400 font-semibold mb-3">Outer Self (Personality {personality})</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• <strong>Appears:</strong> {personalityInfo.appears}</li>
              <li>• <strong>Projects:</strong> {personalityInfo.projects}</li>
              <li>• <strong>First impression:</strong> {personalityInfo.firstImpression}</li>
              <li>• <strong>Others see:</strong> {personalityInfo.othersSee}</li>
            </ul>
          </div>
        </div>

        {/* Inner-Outer Analysis */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
          <h4 className="text-white font-semibold mb-2">The Dynamic</h4>
          {sameSoulPersonality ? (
            <p className="text-slate-300 text-sm leading-relaxed">
              Your inner desires ({soulUrge}) match how you appear ({personality}). You are authentic -
              what you show the world reflects what you truly want inside. This creates consistency
              and people experience you as genuine.
            </p>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed">
              There's a beautiful tension between your Soul Urge {soulUrge} ({soulUrgeInfo.title}) and
              Personality {personality} ({personalityInfo.title}). Inside you crave {soulUrgeInfo.desires?.toLowerCase()},
              but others see you as {personalityInfo.othersSee?.toLowerCase()}. This isn't contradiction -
              it's complexity. Understanding this gap helps you communicate your true needs.
            </p>
          )}
        </div>
      </div>

      {/* Dominant Themes */}
      {dominantNumbers.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⭐</span>
            <span>Dominant Energy</span>
          </h3>

          {dominantNumbers.map(num => {
            const count = numberCounts[num];
            const info = lifePathInterpretations[num] || {};

            return (
              <div key={num} className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-bold text-purple-400">{num}</span>
                  <div>
                    <h4 className="text-white font-semibold">{info.title}</h4>
                    <p className="text-purple-300 text-sm">Appears {count} times in your chart</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {count >= 3 ? (
                    <>
                      <strong>Triple {num} emphasis!</strong> This energy is your core theme.
                      Both your gift and potential shadow lie in mastering this number's lessons.
                      {info.growthPath && ` Growth focus: ${info.growthPath}`}
                    </>
                  ) : (
                    <>
                      <strong>Double {num}:</strong> This energy is reinforced in your chart.
                      The {info.title?.toLowerCase()}'s qualities are central to who you are.
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Master Number Note */}
      {hasMasterNumber && (
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🌟</span>
            <span>Master Number Present</span>
          </h3>
          <p className="text-slate-300 leading-relaxed">
            You have a Master Number ({[lifePath, destiny].filter(n => [11, 22, 33].includes(n)).join(', ')}) in your chart.
            Master Numbers operate at higher vibrations and carry greater potential - but also greater challenges.
            When the energy becomes overwhelming, you may temporarily operate at the reduced single digit.
            This is natural and part of the master number journey.
          </p>
        </div>
      )}

      {/* Unique Combination Summary */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-6 border border-indigo-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Your Unique Combination</h3>
        <p className="text-slate-300 leading-relaxed">
          You are a <strong className="text-indigo-300">{signatureName}</strong>:
          A person who walks the path of the {lifePathInfo.title?.toLowerCase() || 'seeker'}
          {!samePathDestiny && ` toward the destiny of the ${destinyInfo.title?.toLowerCase() || 'master'}`},
          driven internally by {soulUrgeInfo.title?.toLowerCase() || 'deep desires'},
          while presenting to the world as {personalityInfo.othersSee?.toLowerCase() || 'your unique self'}.
          This combination is uniquely yours - no one else has exactly this configuration
          of energies to work with.
        </p>
      </div>
    </div>
  );
}

export default InteractionsTab;
