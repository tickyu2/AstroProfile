/**
 * ============================================
 * COMPOSITE CHART PANEL - P6 Relationship Chart
 * ============================================
 *
 * Displays the composite chart (midpoint chart) for a relationship:
 * - Composite planet positions (midpoints)
 * - Relationship personality vector (30-facet)
 * - Composite aspects and patterns
 * - Relationship archetype
 *
 * Part of Priority 2: Composite Chart UI Integration
 */

import React, { useState, useMemo } from 'react';

// Planet symbols and colors
const PLANET_INFO = {
  Sun: { symbol: '☉', color: 'text-amber-400', bg: 'bg-amber-900/30' },
  Moon: { symbol: '☽', color: 'text-slate-300', bg: 'bg-slate-700/30' },
  Mercury: { symbol: '☿', color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
  Venus: { symbol: '♀', color: 'text-pink-400', bg: 'bg-pink-900/30' },
  Mars: { symbol: '♂', color: 'text-red-400', bg: 'bg-red-900/30' },
  Jupiter: { symbol: '♃', color: 'text-purple-400', bg: 'bg-purple-900/30' },
  Saturn: { symbol: '♄', color: 'text-gray-400', bg: 'bg-gray-700/30' },
  Uranus: { symbol: '♅', color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
  Neptune: { symbol: '♆', color: 'text-blue-400', bg: 'bg-blue-900/30' },
  Pluto: { symbol: '♇', color: 'text-indigo-400', bg: 'bg-indigo-900/30' },
  Ascendant: { symbol: 'AC', color: 'text-rose-400', bg: 'bg-rose-900/30' },
  Midheaven: { symbol: 'MC', color: 'text-orange-400', bg: 'bg-orange-900/30' }
};

const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈', element: 'Fire' },
  { sign: 'Taurus', symbol: '♉', element: 'Earth' },
  { sign: 'Gemini', symbol: '♊', element: 'Air' },
  { sign: 'Cancer', symbol: '♋', element: 'Water' },
  { sign: 'Leo', symbol: '♌', element: 'Fire' },
  { sign: 'Virgo', symbol: '♍', element: 'Earth' },
  { sign: 'Libra', symbol: '♎', element: 'Air' },
  { sign: 'Scorpio', symbol: '♏', element: 'Water' },
  { sign: 'Sagittarius', symbol: '♐', element: 'Fire' },
  { sign: 'Capricorn', symbol: '♑', element: 'Earth' },
  { sign: 'Aquarius', symbol: '♒', element: 'Air' },
  { sign: 'Pisces', symbol: '♓', element: 'Water' }
];

const ELEMENT_COLORS = {
  Fire: 'text-red-400',
  Earth: 'text-amber-600',
  Air: 'text-cyan-400',
  Water: 'text-blue-400'
};

// ============================================
// MAIN PANEL COMPONENT
// ============================================

export default function CompositeChartPanel({
  compositeData,
  personAName = 'Person A',
  personBName = 'Person B',
  showVector = true,
  showAspects = true
}) {
  const [activeSection, setActiveSection] = useState('chart'); // 'chart', 'vector', 'interpretation'

  // Mock data for development (when backend is offline)
  const data = compositeData || generateMockComposite(personAName, personBName);

  // Calculate element distribution
  const elementDistribution = useMemo(() => {
    if (!data?.positions) return null;

    const counts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    Object.values(data.positions || {}).forEach(pos => {
      const sign = ZODIAC_SIGNS.find(z => z.sign === pos.sign);
      if (sign) counts[sign.element]++;
    });
    return counts;
  }, [data]);

  if (!data) {
    return (
      <div className="bg-slate-800/30 rounded-xl p-8 text-center border border-white/10">
        <div className="text-4xl mb-4">🌟</div>
        <p className="text-white/60">Composite Chart data unavailable</p>
        <p className="text-sm text-white/40 mt-2">
          Ensure both profiles have valid birth data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-5 border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-300">
              Composite Chart
            </h3>
            <p className="text-sm text-indigo-200/70 mt-1">
              {personAName} + {personBName} Relationship Chart
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Relationship Archetype</div>
            <div className="text-xl font-bold text-white">
              {data.archetype || 'The Companions'}
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSection('chart')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
            activeSection === 'chart'
              ? 'bg-indigo-500/20 text-indigo-300 border-b-2 border-indigo-400'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Planet Positions
        </button>
        {showVector && (
          <button
            onClick={() => setActiveSection('vector')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeSection === 'vector'
                ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Relationship Profile
          </button>
        )}
        <button
          onClick={() => setActiveSection('interpretation')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
            activeSection === 'interpretation'
              ? 'bg-pink-500/20 text-pink-300 border-b-2 border-pink-400'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Interpretation
        </button>
      </div>

      {/* Chart Section */}
      {activeSection === 'chart' && (
        <div className="space-y-4">
          {/* Element Distribution */}
          {elementDistribution && (
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-3">Elemental Balance</h4>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(elementDistribution).map(([element, count]) => (
                  <div
                    key={element}
                    className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                  >
                    <div className={`text-2xl font-bold ${ELEMENT_COLORS[element]}`}>
                      {count}
                    </div>
                    <div className="text-xs text-slate-400">{element}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planet Positions Grid */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-semibold text-white/80 mb-3">Composite Positions (Midpoints)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(data.positions || {}).map(([planet, position]) => (
                <PlanetCard key={planet} planet={planet} position={position} />
              ))}
            </div>
          </div>

          {/* Aspects */}
          {showAspects && data.aspects && data.aspects.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-3">
                Composite Aspects ({data.aspects.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.aspects.map((aspect, idx) => (
                  <AspectRow key={idx} aspect={aspect} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vector Section */}
      {activeSection === 'vector' && (
        <div className="space-y-4">
          {/* Relationship Personality */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-semibold text-white/80 mb-3">
              Relationship Personality Profile
            </h4>
            <p className="text-sm text-white/60 mb-4">
              This 30-facet vector represents the "personality" of your relationship -
              how you function together as a unit.
            </p>
            <DomainScores vector={data.relationship_vector || data.personality_vector} />
          </div>

          {/* Key Traits */}
          {data.key_traits && (
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-3">Key Relationship Traits</h4>
              <div className="flex flex-wrap gap-2">
                {data.key_traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interpretation Section */}
      {activeSection === 'interpretation' && (
        <div className="space-y-4">
          {/* Relationship Theme */}
          <div className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 rounded-xl p-5 border border-pink-500/30">
            <h4 className="font-bold text-pink-300 mb-2">Relationship Theme</h4>
            <p className="text-white/80">
              {data.interpretation?.theme || getDefaultTheme(data)}
            </p>
          </div>

          {/* Strengths */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-semibold text-green-400 mb-3">Relationship Strengths</h4>
            <ul className="space-y-2">
              {(data.interpretation?.strengths || getDefaultStrengths(data)).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="text-green-400">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-semibold text-amber-400 mb-3">Growth Areas</h4>
            <ul className="space-y-2">
              {(data.interpretation?.challenges || getDefaultChallenges(data)).map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="text-amber-400">→</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Composite Sun-Moon */}
          {data.positions?.Sun && data.positions?.Moon && (
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-3">
                Core Relationship Identity
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">☉</span>
                    <span className="font-semibold text-amber-300">Composite Sun</span>
                  </div>
                  <p className="text-sm text-white/70">
                    {data.positions.Sun.sign} - Your shared purpose and identity as a couple.
                    Together you express {data.positions.Sun.sign} energy.
                  </p>
                </div>
                <div className="p-3 bg-slate-600/20 rounded-lg border border-slate-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">☽</span>
                    <span className="font-semibold text-slate-300">Composite Moon</span>
                  </div>
                  <p className="text-sm text-white/70">
                    {data.positions.Moon.sign} - Your emotional foundation and how you nurture
                    each other. The mood of your relationship.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mock data indicator */}
      {data._mock && (
        <div className="text-xs text-slate-500 text-center mt-2">
          Using estimated data (backend offline)
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PlanetCard({ planet, position }) {
  const info = PLANET_INFO[planet] || { symbol: planet[0], color: 'text-white', bg: 'bg-slate-700/30' };
  const sign = ZODIAC_SIGNS.find(z => z.sign === position.sign);

  return (
    <div className={`${info.bg} rounded-lg p-3 border border-white/10`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xl ${info.color}`}>{info.symbol}</span>
        <span className="text-sm text-white/80 font-medium">{planet}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{sign?.symbol || '?'}</span>
        <span className={`text-sm ${ELEMENT_COLORS[sign?.element]}`}>
          {position.sign}
        </span>
      </div>
      <div className="text-xs text-white/50 mt-1">
        {position.degree?.toFixed(1) || 0}°
      </div>
    </div>
  );
}

function AspectRow({ aspect }) {
  const planet1Info = PLANET_INFO[aspect.planet1] || { symbol: '?', color: 'text-white' };
  const planet2Info = PLANET_INFO[aspect.planet2] || { symbol: '?', color: 'text-white' };

  const aspectSymbols = {
    conjunction: '☌',
    opposition: '☍',
    trine: '△',
    square: '□',
    sextile: '⚹',
    quincunx: '⚻'
  };

  const aspectColors = {
    conjunction: 'text-amber-400',
    trine: 'text-green-400',
    sextile: 'text-cyan-400',
    square: 'text-red-400',
    opposition: 'text-orange-400',
    quincunx: 'text-purple-400'
  };

  const aspectType = aspect.type?.toLowerCase() || 'conjunction';

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-slate-700/20 rounded-lg">
      <div className="flex items-center gap-2">
        <span className={`text-lg ${planet1Info.color}`}>{planet1Info.symbol}</span>
        <span className={`text-lg ${aspectColors[aspectType]}`}>
          {aspectSymbols[aspectType] || '?'}
        </span>
        <span className={`text-lg ${planet2Info.color}`}>{planet2Info.symbol}</span>
      </div>
      <div className="text-right">
        <span className="text-sm text-white/70">{aspect.type || 'Aspect'}</span>
        {aspect.orb && (
          <span className="text-xs text-white/40 ml-2">
            {aspect.orb.toFixed(1)}°
          </span>
        )}
      </div>
    </div>
  );
}

function DomainScores({ vector }) {
  // Map vector to Big 5 domains
  const domains = [
    { name: 'Openness', abbr: 'O', color: 'bg-purple-500', facets: vector?.slice(12, 18) },
    { name: 'Conscientiousness', abbr: 'C', color: 'bg-blue-500', facets: vector?.slice(24, 30) },
    { name: 'Extraversion', abbr: 'E', color: 'bg-amber-500', facets: vector?.slice(6, 12) },
    { name: 'Agreeableness', abbr: 'A', color: 'bg-green-500', facets: vector?.slice(18, 24) },
    { name: 'Emotional Stability', abbr: 'N', color: 'bg-rose-500', facets: vector?.slice(0, 6) }
  ];

  return (
    <div className="space-y-3">
      {domains.map(domain => {
        const avg = domain.facets
          ? domain.facets.reduce((a, b) => a + (b || 0), 0) / domain.facets.length
          : 0.5;
        const percent = Math.round(avg * 100);

        return (
          <div key={domain.abbr}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">{domain.name}</span>
              <span className="text-white/50">{percent}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${domain.color} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateMockComposite(personA, personB) {
  const signs = ZODIAC_SIGNS.map(z => z.sign);

  return {
    positions: {
      Sun: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Moon: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Mercury: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Venus: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Mars: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Jupiter: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Saturn: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 },
      Ascendant: { sign: signs[Math.floor(Math.random() * 12)], degree: Math.random() * 30 }
    },
    aspects: [
      { planet1: 'Sun', planet2: 'Moon', type: 'Trine', orb: 2.4 },
      { planet1: 'Venus', planet2: 'Mars', type: 'Conjunction', orb: 1.2 },
      { planet1: 'Mercury', planet2: 'Jupiter', type: 'Sextile', orb: 3.1 }
    ],
    relationship_vector: Array(30).fill(0).map(() => 0.3 + Math.random() * 0.4),
    archetype: 'The Companions',
    key_traits: ['Communicative', 'Growth-Oriented', 'Emotionally Supportive'],
    interpretation: {
      theme: `${personA} and ${personB} form a complementary partnership where individual strengths combine to create a greater whole.`,
      strengths: [
        'Natural understanding of each other\'s needs',
        'Shared values around growth and learning',
        'Ability to communicate openly and honestly'
      ],
      challenges: [
        'May need to balance independence with togetherness',
        'Different approaches to handling stress',
        'Learning to appreciate different communication styles'
      ]
    },
    _mock: true
  };
}

function getDefaultTheme(data) {
  return 'This relationship brings together two unique individuals to create something greater than the sum of its parts. Together, you navigate life with a shared sense of purpose.';
}

function getDefaultStrengths(data) {
  return [
    'Complementary energies that balance each other',
    'Shared foundation for emotional security',
    'Mutual respect and understanding'
  ];
}

function getDefaultChallenges(data) {
  return [
    'Navigating different communication styles',
    'Balancing individual needs with partnership needs',
    'Learning to grow together through challenges'
  ];
}

export { PlanetCard, AspectRow, DomainScores };
