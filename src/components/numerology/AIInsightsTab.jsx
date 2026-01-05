/**
 * AI INSIGHTS TAB
 *
 * Cross-system constitutional analysis:
 * - Numerology + Western Zodiac synthesis
 * - Numerology + BaZi correlations
 * - MBTI alignment patterns
 * - Constitutional truth synthesis
 *
 * "Where all systems point to the same truth"
 */

import React, { useMemo } from 'react';
import { lifePathInterpretations } from '../../data/numerologyInterpretations';

function AIInsightsTab({ numerologyData, profile }) {
  if (!numerologyData) return null;

  const { lifePath, destiny, soulUrge, personality } = numerologyData;

  // Get zodiac data from profile
  const westernZodiac = profile?.westernZodiac || {};
  const baziData = profile?.baziData || profile?.fourPillars || {};
  const mbti = profile?.mbti;

  // Generate cross-system insights
  const crossSystemInsights = useMemo(() => {
    return generateCrossSystemInsights(numerologyData, westernZodiac, baziData, mbti);
  }, [numerologyData, westernZodiac, baziData, mbti]);

  // Get Life Path info for correlations
  const lifePathInfo = lifePathInterpretations[lifePath] || {};

  return (
    <div className="space-y-8">
      {/* Constitutional Truth Header */}
      <div className="text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-3xl font-bold text-white mb-2">Constitutional Synthesis</h2>
        <p className="text-lg text-purple-300 mb-4">
          Where All Systems Point to the Same Truth
        </p>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          When numerology, astrology, and other systems independently reveal the same patterns,
          you're seeing constitutional truths - the deep architecture of your soul.
        </p>
      </div>

      {/* Pattern Agreement Score */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Pattern Convergence</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Systems Active */}
          <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4 text-center">
            <div className="text-4xl font-bold text-indigo-400">
              {countActiveSystems(westernZodiac, baziData, mbti)}
            </div>
            <div className="text-sm text-slate-400">Systems Available</div>
          </div>

          {/* Convergence Points */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-4xl font-bold text-purple-400">
              {crossSystemInsights.convergencePoints}
            </div>
            <div className="text-sm text-slate-400">Convergence Points</div>
          </div>

          {/* Constitutional Clarity */}
          <div className="bg-pink-900/30 border border-pink-500/30 rounded-xl p-4 text-center">
            <div className="text-4xl font-bold text-pink-400">
              {crossSystemInsights.clarityScore}%
            </div>
            <div className="text-sm text-slate-400">Constitutional Clarity</div>
          </div>
        </div>

        <p className="text-slate-400 text-sm text-center">
          Higher convergence indicates stronger constitutional patterns across different systems
        </p>
      </div>

      {/* Numerology + Western Zodiac */}
      {westernZodiac.sunSign && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>♈</span>
            <span>Numerology + Western Astrology</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
              <h4 className="text-indigo-400 font-semibold mb-3">
                Life Path {lifePath} + {westernZodiac.sunSign}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {getLifePathZodiacSynthesis(lifePath, westernZodiac.sunSign)}
              </p>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
              <h4 className="text-purple-400 font-semibold mb-3">
                Soul Urge {soulUrge} + {westernZodiac.moonSign || 'Moon'}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {westernZodiac.moonSign
                  ? getSoulUrgeZodiacSynthesis(soulUrge, westernZodiac.moonSign)
                  : "Add moon sign data to see how your Soul Urge aligns with your emotional nature."
                }
              </p>
            </div>
          </div>

          {/* Element Alignment */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
            <h4 className="text-white font-semibold mb-2">Elemental Resonance</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {getElementalResonance(lifePath, westernZodiac.element)}
            </p>
          </div>
        </div>
      )}

      {/* Numerology + BaZi/Chinese */}
      {(baziData.dayMaster || baziData.yearPillar) && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>☯</span>
            <span>Numerology + BaZi</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
              <h4 className="text-amber-400 font-semibold mb-3">
                Life Path {lifePath} + {baziData.dayMaster || 'Day Master'}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {baziData.dayMaster
                  ? getLifePathBaziSynthesis(lifePath, baziData.dayMaster)
                  : "Add BaZi data to see how your numerological path aligns with your Chinese astrology."
                }
              </p>
            </div>

            <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-green-400 font-semibold mb-3">
                Destiny {destiny} + {baziData.favorableElement || 'Useful God'}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {baziData.favorableElement
                  ? getDestinyBaziSynthesis(destiny, baziData.favorableElement)
                  : "Add Useful God element to see how your destiny number aligns with your BaZi balance."
                }
              </p>
            </div>
          </div>

          {/* Yin/Yang Balance */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
            <h4 className="text-white font-semibold mb-2">Yin-Yang Numerology</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {getYinYangNumerology(lifePath, soulUrge, personality)}
            </p>
          </div>
        </div>
      )}

      {/* Numerology + MBTI */}
      {mbti && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🧠</span>
            <span>Numerology + MBTI</span>
          </h3>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 mb-4">
            <h4 className="text-blue-400 font-semibold mb-3">
              {mbti} + Life Path {lifePath}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {getMBTINumerologySynthesis(mbti, lifePath)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getMBTIFunctionAlignment(mbti, lifePath, soulUrge, personality).map((alignment, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl text-center ${
                  alignment.strength === 'strong'
                    ? 'bg-green-900/30 border border-green-500/30'
                    : alignment.strength === 'moderate'
                    ? 'bg-amber-900/30 border border-amber-500/30'
                    : 'bg-slate-700/50'
                }`}
              >
                <div className="text-lg font-bold text-white">{alignment.function}</div>
                <div className="text-xs text-slate-400">{alignment.number}</div>
                <div className={`text-xs mt-1 ${
                  alignment.strength === 'strong' ? 'text-green-400' :
                  alignment.strength === 'moderate' ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  {alignment.strength}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constitutional Themes */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📜</span>
          <span>Your Constitutional Themes</span>
        </h3>

        <div className="space-y-4">
          {crossSystemInsights.themes.map((theme, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{theme.icon}</span>
                <h4 className="text-white font-semibold">{theme.title}</h4>
                <span className="ml-auto text-xs bg-indigo-600/50 text-indigo-200 px-2 py-1 rounded-full">
                  {theme.systems} systems
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Synthesis */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>✨</span>
          <span>AI Constitutional Reading</span>
        </h3>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed">
            {generateAIReading(numerologyData, westernZodiac, baziData, mbti)}
          </p>
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
          <p className="text-sm text-slate-400 italic">
            This synthesis draws patterns from numerology{westernZodiac.sunSign ? ', Western astrology' : ''}
            {baziData.dayMaster ? ', BaZi' : ''}{mbti ? ', and MBTI' : ''} to reveal your constitutional truth.
            When multiple systems agree, you're seeing the deep architecture of who you are.
          </p>
        </div>
      </div>

      {/* Incomplete Data Notice */}
      {(!westernZodiac.sunSign || !baziData.dayMaster) && (
        <div className="bg-slate-700/50 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm">
            Add more profile data to unlock deeper cross-system insights.
            {!westernZodiac.sunSign && ' Missing: Western Zodiac.'}
            {!baziData.dayMaster && ' Missing: BaZi/Four Pillars.'}
            {!mbti && ' Missing: MBTI type.'}
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function countActiveSystems(westernZodiac, baziData, mbti) {
  let count = 1; // Numerology is always present
  if (westernZodiac?.sunSign) count++;
  if (baziData?.dayMaster || baziData?.yearPillar) count++;
  if (mbti) count++;
  return count;
}

function generateCrossSystemInsights(numerology, western, bazi, mbti) {
  const themes = [];
  let convergencePoints = 0;

  const { lifePath, soulUrge, personality } = numerology;

  // Leadership theme
  if ([1, 8].includes(lifePath)) {
    themes.push({
      icon: "👑",
      title: "Leadership & Authority",
      description: `Your Life Path ${lifePath} indicates a natural leader. ${
        western?.sunSign === 'Leo' || western?.sunSign === 'Aries' ? 'Your zodiac sign confirms this fire and drive.' :
        bazi?.dayMaster?.includes('Yang') ? 'Your Yang Day Master reinforces this commanding presence.' :
        ''
      } You are meant to lead, initiate, and take charge.`,
      systems: [1, 8].includes(lifePath) ? 2 : 1
    });
    convergencePoints += 2;
  }

  // Sensitivity theme
  if ([2, 6, 9].includes(soulUrge)) {
    themes.push({
      icon: "💙",
      title: "Deep Sensitivity & Empathy",
      description: `Your Soul Urge ${soulUrge} reveals a deeply sensitive inner nature. ${
        western?.moonSign === 'Cancer' || western?.moonSign === 'Pisces' ? 'Your Water moon confirms this emotional depth.' :
        ''
      } You feel deeply and have strong intuitive gifts.`,
      systems: 2
    });
    convergencePoints += 2;
  }

  // Freedom theme
  if ([5].includes(lifePath) || [5].includes(personality)) {
    themes.push({
      icon: "🌍",
      title: "Freedom & Adventure",
      description: `The number 5 in your chart indicates a soul that craves freedom, variety, and experience. ${
        western?.sunSign === 'Sagittarius' || western?.sunSign === 'Gemini' ? 'Your mutable sign amplifies this restless spirit.' :
        ''
      } Routine and restriction feel like prison to you.`,
      systems: 2
    });
    convergencePoints += 2;
  }

  // Wisdom theme
  if ([7].includes(lifePath)) {
    themes.push({
      icon: "🔮",
      title: "Seeker of Wisdom",
      description: `Life Path 7 marks you as a natural philosopher and seeker of truth. ${
        western?.sunSign === 'Scorpio' || western?.sunSign === 'Aquarius' ? 'Your sign confirms this investigative, probing nature.' :
        ''
      } You need depth, solitude, and time to think.`,
      systems: 2
    });
    convergencePoints += 2;
  }

  // Builder theme
  if ([4, 22].includes(lifePath)) {
    themes.push({
      icon: "🏗️",
      title: "Master Builder",
      description: `Your ${lifePath === 22 ? 'Master Number 22' : 'Life Path 4'} indicates the architect archetype. ${
        western?.element === 'Earth' ? 'Your Earth element confirms this practical, grounded approach.' :
        ''
      } You build lasting structures in the physical world.`,
      systems: 2
    });
    convergencePoints += 2;
  }

  if (themes.length === 0) {
    themes.push({
      icon: "✨",
      title: "Unique Configuration",
      description: `Your ${lifePath}-${soulUrge}-${personality} configuration creates a unique pattern that doesn't fit standard archetypes. This uniqueness is itself significant - you are meant to forge your own path rather than follow established templates.`,
      systems: 1
    });
    convergencePoints += 1;
  }

  return {
    themes,
    convergencePoints,
    clarityScore: Math.min(95, 40 + (convergencePoints * 10))
  };
}

function getLifePathZodiacSynthesis(lifePath, sunSign) {
  const syntheses = {
    1: {
      Aries: "Double fire! Your Life Path 1 leadership combined with Aries pioneering energy makes you a natural trailblazer.",
      Leo: "Leadership squared. Life Path 1's independence meets Leo's royal authority - born to command.",
      Capricorn: "Ambitious and structured. Your 1 energy is grounded by Capricorn's disciplined climb."
    },
    2: {
      Libra: "Perfect harmony seeker. Life Path 2's diplomacy aligns beautifully with Libra's balance.",
      Cancer: "Nurturing peacemaker. Your 2 sensitivity is amplified by Cancer's emotional depth.",
      Pisces: "Intuitive empath. Life Path 2's receptivity merges with Piscean compassion."
    },
    7: {
      Scorpio: "Deep investigator. Life Path 7's quest for truth combines with Scorpio's penetrating insight.",
      Aquarius: "Visionary seeker. Your 7 wisdom meets Aquarian revolutionary thinking.",
      Virgo: "Analytical perfectionist. Life Path 7's depth is sharpened by Virgo's discernment."
    }
  };

  return syntheses[lifePath]?.[sunSign] ||
    `Your Life Path ${lifePath} combined with ${sunSign} creates a unique blend of numerological purpose and zodiacal expression.`;
}

function getSoulUrgeZodiacSynthesis(soulUrge, moonSign) {
  return `Your Soul Urge ${soulUrge} seeks ${getSoulUrgeDesire(soulUrge)}, while your ${moonSign} Moon expresses emotions through ${getMoonSignExpression(moonSign)}. This creates ${getSoulMoonHarmony(soulUrge, moonSign)}.`;
}

function getSoulUrgeDesire(soulUrge) {
  const desires = {
    1: "independence and recognition",
    2: "connection and harmony",
    3: "creative expression and joy",
    4: "stability and order",
    5: "freedom and experience",
    6: "love and family",
    7: "wisdom and understanding",
    8: "power and achievement",
    9: "universal love and service"
  };
  return desires[soulUrge] || "authentic expression";
}

function getMoonSignExpression(moonSign) {
  const expressions = {
    Aries: "directness and action",
    Taurus: "comfort and sensuality",
    Gemini: "communication and variety",
    Cancer: "nurturing and protection",
    Leo: "warmth and drama",
    Virgo: "service and analysis",
    Libra: "harmony and partnership",
    Scorpio: "intensity and depth",
    Sagittarius: "optimism and exploration",
    Capricorn: "responsibility and achievement",
    Aquarius: "independence and innovation",
    Pisces: "compassion and imagination"
  };
  return expressions[moonSign] || "emotional depth";
}

function getSoulMoonHarmony(soulUrge, moonSign) {
  // Simplified harmony check
  const harmoniousCombos = {
    2: ['Cancer', 'Libra', 'Pisces'],
    7: ['Scorpio', 'Aquarius', 'Virgo'],
    5: ['Sagittarius', 'Gemini', 'Aquarius']
  };

  if (harmoniousCombos[soulUrge]?.includes(moonSign)) {
    return "a harmonious inner life where heart and soul speak the same language";
  }
  return "creative tension that drives growth and self-discovery";
}

function getElementalResonance(lifePath, zodiacElement) {
  const numerologyElements = {
    1: 'Fire', 3: 'Fire', 9: 'Fire',
    2: 'Water', 6: 'Water', 7: 'Water',
    4: 'Earth', 8: 'Earth',
    5: 'Air'
  };

  const numElement = numerologyElements[lifePath];

  if (!zodiacElement || !numElement) {
    return "Calculate your full chart to see elemental resonance.";
  }

  if (numElement === zodiacElement) {
    return `Double ${numElement}! Your Life Path ${lifePath} and zodiac element are both ${numElement}, creating powerful elemental reinforcement. This ${numElement} dominance defines your approach to life.`;
  }

  return `Your Life Path ${lifePath} carries ${numElement} energy, while your zodiac is ${zodiacElement}. This blend of ${numElement} and ${zodiacElement} creates a multi-elemental personality with range and flexibility.`;
}

function getLifePathBaziSynthesis(lifePath, dayMaster) {
  const dayMasterEnergy = dayMaster?.includes('Yang') ? 'assertive' : 'receptive';
  return `Your Life Path ${lifePath} combined with ${dayMaster} Day Master creates a ${dayMasterEnergy} expression of the ${lifePath} energy. This Chinese-Western synthesis reveals how you manifest your life purpose.`;
}

function getDestinyBaziSynthesis(destiny, favorableElement) {
  return `Your Destiny ${destiny} finds support through ${favorableElement} element activities. Engaging with ${favorableElement} energy helps you fulfill your numerological purpose.`;
}

function getYinYangNumerology(lifePath, soulUrge, personality) {
  const yang = [1, 3, 5, 7, 9];
  const yin = [2, 4, 6, 8];

  const yangCount = [lifePath, soulUrge, personality].filter(n => yang.includes(n)).length;
  const yinCount = 3 - yangCount;

  if (yangCount > yinCount) {
    return `Your numerology is Yang-dominant (${yangCount} Yang, ${yinCount} Yin). You express through action, assertion, and outward movement. Your energy initiates and projects.`;
  } else if (yinCount > yangCount) {
    return `Your numerology is Yin-dominant (${yinCount} Yin, ${yangCount} Yang). You express through receptivity, nurturing, and inward focus. Your energy attracts and contains.`;
  }
  return `Your numerology is balanced between Yin and Yang. You have access to both assertive and receptive modes, able to initiate and receive with equal ease.`;
}

function getMBTINumerologySynthesis(mbti, lifePath) {
  const syntheses = {
    INTJ: {
      7: "Perfect alignment. INTJ's strategic depth meets Life Path 7's wisdom-seeking nature.",
      1: "Visionary leader. INTJ strategy combined with 1's pioneering drive creates powerful innovation.",
      8: "Master strategist. INTJ's planning meets 8's power and achievement focus."
    },
    ENFP: {
      3: "Creative harmony. ENFP's enthusiasm meets 3's expressive joy perfectly.",
      5: "Freedom lover. ENFP's spontaneity aligns with 5's need for variety.",
      9: "Idealistic visionary. ENFP optimism meets 9's universal love."
    },
    INFJ: {
      2: "Deep connector. INFJ's insight meets 2's harmony-seeking nature.",
      7: "Spiritual seeker. INFJ intuition combines with 7's wisdom quest.",
      9: "Humanitarian visionary. INFJ's idealism meets 9's universal service."
    }
  };

  return syntheses[mbti]?.[lifePath] ||
    `Your ${mbti} cognitive functions interact uniquely with Life Path ${lifePath}, creating your personal style of engagement with the world.`;
}

function getMBTIFunctionAlignment(mbti, lifePath, soulUrge, personality) {
  // Simplified function analysis
  const functions = [];

  // Extract E/I
  if (mbti?.[0] === 'E') {
    functions.push({
      function: 'Extroversion',
      number: [1, 3, 5].includes(lifePath) ? `LP ${lifePath}` : `P ${personality}`,
      strength: [1, 3, 5].includes(lifePath) || [1, 3, 5].includes(personality) ? 'strong' : 'moderate'
    });
  } else {
    functions.push({
      function: 'Introversion',
      number: [2, 4, 7].includes(lifePath) ? `LP ${lifePath}` : `SU ${soulUrge}`,
      strength: [2, 4, 7].includes(lifePath) || [2, 4, 7].includes(soulUrge) ? 'strong' : 'moderate'
    });
  }

  // Extract N/S
  if (mbti?.[1] === 'N') {
    functions.push({
      function: 'Intuition',
      number: [7, 9, 11].includes(lifePath) ? `LP ${lifePath}` : `SU ${soulUrge}`,
      strength: [7, 9].includes(lifePath) ? 'strong' : 'moderate'
    });
  } else {
    functions.push({
      function: 'Sensing',
      number: [4, 6, 8].includes(lifePath) ? `LP ${lifePath}` : `P ${personality}`,
      strength: [4, 6, 8].includes(lifePath) ? 'strong' : 'moderate'
    });
  }

  // Extract T/F
  if (mbti?.[2] === 'T') {
    functions.push({
      function: 'Thinking',
      number: [1, 4, 7].includes(lifePath) ? `LP ${lifePath}` : `P ${personality}`,
      strength: [1, 7].includes(lifePath) ? 'strong' : 'moderate'
    });
  } else {
    functions.push({
      function: 'Feeling',
      number: [2, 6, 9].includes(soulUrge) ? `SU ${soulUrge}` : `LP ${lifePath}`,
      strength: [2, 6, 9].includes(soulUrge) ? 'strong' : 'moderate'
    });
  }

  // Extract J/P
  if (mbti?.[3] === 'J') {
    functions.push({
      function: 'Judging',
      number: [4, 8].includes(lifePath) ? `LP ${lifePath}` : `P ${personality}`,
      strength: [4, 8].includes(lifePath) ? 'strong' : 'moderate'
    });
  } else {
    functions.push({
      function: 'Perceiving',
      number: [3, 5].includes(lifePath) ? `LP ${lifePath}` : `SU ${soulUrge}`,
      strength: [3, 5].includes(lifePath) ? 'strong' : 'moderate'
    });
  }

  return functions;
}

function generateAIReading(numerology, western, bazi, mbti) {
  const { lifePath, destiny, soulUrge, personality } = numerology;
  const lifePathInfo = lifePathInterpretations[lifePath] || {};

  let reading = `At your core, you are ${lifePathInfo.title || `a Life Path ${lifePath}`} - ${lifePathInfo.coreEssence?.split('.')[0] || 'a unique expression of this number\'s energy'}.`;

  if (western?.sunSign) {
    reading += ` Your ${western.sunSign} Sun adds ${getZodiacFlavor(western.sunSign)} to this fundamental nature.`;
  }

  reading += ` Your Soul Urge ${soulUrge} reveals what truly drives you beneath the surface - a deep need for ${getSoulUrgeDesire(soulUrge)}.`;

  if (lifePath === destiny) {
    reading += ` Notably, your Life Path and Destiny both carry the ${lifePath} vibration, creating powerful focus and reinforcement of this energy.`;
  } else {
    reading += ` Your Destiny ${destiny} shows where you're heading - toward mastery of ${getDestinyTheme(destiny)}.`;
  }

  if (soulUrge !== personality) {
    reading += ` There's creative tension between your inner ${soulUrge} desires and your outer ${personality} presentation, driving growth and self-discovery.`;
  }

  if (bazi?.dayMaster) {
    reading += ` Your ${bazi.dayMaster} Day Master confirms this pattern through Chinese metaphysics.`;
  }

  if (mbti) {
    reading += ` Your ${mbti} type provides the cognitive framework through which all these energies express.`;
  }

  reading += ` This is your constitutional truth - the deep architecture of your soul that remains constant across all systems of understanding.`;

  return reading;
}

function getZodiacFlavor(sunSign) {
  const flavors = {
    Aries: "bold initiative and pioneering spirit",
    Taurus: "earthy stability and sensual appreciation",
    Gemini: "mental agility and communicative flair",
    Cancer: "nurturing depth and emotional attunement",
    Leo: "creative radiance and natural authority",
    Virgo: "analytical precision and service orientation",
    Libra: "harmonious grace and relational awareness",
    Scorpio: "transformative intensity and psychological depth",
    Sagittarius: "expansive optimism and philosophical seeking",
    Capricorn: "ambitious discipline and structural thinking",
    Aquarius: "innovative vision and humanitarian concern",
    Pisces: "intuitive compassion and spiritual sensitivity"
  };
  return flavors[sunSign] || "unique zodiacal qualities";
}

function getDestinyTheme(destiny) {
  const themes = {
    1: "independent leadership and pioneering",
    2: "cooperative partnership and diplomacy",
    3: "creative expression and communication",
    4: "building lasting foundations",
    5: "freedom and transformative experience",
    6: "love, family, and responsibility",
    7: "wisdom, spirituality, and inner knowing",
    8: "material mastery and empowerment",
    9: "universal service and humanitarian ideals"
  };
  return themes[destiny] || "your unique purpose";
}

export default AIInsightsTab;
