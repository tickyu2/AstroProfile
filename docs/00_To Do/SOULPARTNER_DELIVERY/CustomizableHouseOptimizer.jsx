/**
 * CustomizableHouseOptimizer.jsx
 * 
 * CUSTOMIZABLE HOUSE OPTIMIZATION
 * Let users choose what they value most in a relationship!
 * 
 * Different people want different things:
 * - Best friends first (11th house)
 * - Intellectual connection (9th house)
 * - Sexual chemistry (8th house)
 * - Traditional partnership (7th house)
 * - Power couple (10th house)
 * - Or custom weights!
 * 
 * For GENESIS Platform
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky - "ONE SIZE DOES NOT FIT ALL!"
 */

import React, { useState } from 'react';

// ============================================================================
// RELATIONSHIP ARCHETYPES (PRESETS)
// ============================================================================

const RELATIONSHIP_ARCHETYPES = {
  soulmate: {
    name: "Soulmate",
    tagline: "Traditional romantic partnership",
    icon: "💑",
    description: "Marriage-focused, balanced romance and commitment",
    weights: {
      1: 0,    // Self
      2: 0,    // Money
      3: 0,    // Communication
      4: 5,    // Home
      5: 25,   // Romance
      6: 0,    // Work
      7: 40,   // Partnership ← KEY!
      8: 20,   // Intimacy
      9: 0,    // Philosophy
      10: 0,   // Career
      11: 10,  // Friendship
      12: 0    // Spirituality
    },
    bestFor: "People seeking traditional marriage and family"
  },
  
  bestFriends: {
    name: "Best Friends First",
    tagline: "Married my best friend",
    icon: "🤝",
    description: "Friendship foundation, easy companionship",
    weights: {
      1: 0,
      2: 0,
      3: 25,   // Communication
      4: 5,
      5: 20,   // Romance
      6: 0,
      7: 10,   // Partnership
      8: 5,
      9: 0,
      10: 0,
      11: 35,  // Friendship ← KEY!
      12: 0
    },
    bestFor: "People who value companionship over passion"
  },
  
  intellectual: {
    name: "Intellectual Soulmate",
    tagline: "Deep thinkers & lifelong learners",
    icon: "🧠",
    description: "Philosophical connection, shared curiosity",
    weights: {
      1: 0,
      2: 0,
      3: 25,   // Communication
      4: 0,
      5: 10,   // Romance
      6: 0,
      7: 15,   // Partnership
      8: 5,
      9: 35,   // Philosophy ← KEY!
      10: 0,
      11: 10,  // Friendship
      12: 0
    },
    bestFor: "Academics, philosophers, curious minds"
  },
  
  passionate: {
    name: "Passionate Lovers",
    tagline: "Intense & transformative",
    icon: "🔥",
    description: "Sexual chemistry, deep intimacy, karmic bond",
    weights: {
      1: 0,
      2: 0,
      3: 5,
      4: 0,
      5: 25,   // Romance
      6: 0,
      7: 10,   // Partnership
      8: 40,   // Intimacy ← KEY!
      9: 0,
      10: 0,
      11: 5,
      12: 15   // Karmic/Spiritual
    },
    bestFor: "People seeking intense, transformative connection"
  },
  
  powerCouple: {
    name: "Power Couple",
    tagline: "Build an empire together",
    icon: "👑",
    description: "Career support, wealth building, public image",
    weights: {
      1: 5,
      2: 25,   // Resources
      3: 5,
      4: 0,
      5: 5,
      6: 0,
      7: 15,   // Partnership
      8: 5,
      9: 0,
      10: 35,  // Career ← KEY!
      11: 5,   // Shared goals
      12: 0
    },
    bestFor: "Ambitious, career-focused individuals"
  },
  
  homeFamily: {
    name: "Home & Family",
    tagline: "Traditional family values",
    icon: "🏡",
    description: "Building a home, raising children, security",
    weights: {
      1: 0,
      2: 15,   // Security
      3: 5,
      4: 35,   // Home ← KEY!
      5: 20,   // Children
      6: 0,
      7: 20,   // Marriage
      8: 5,
      9: 0,
      10: 0,
      11: 0,
      12: 0
    },
    bestFor: "Family-oriented, traditional values"
  },
  
  custom: {
    name: "Custom",
    tagline: "Design your own priorities",
    icon: "⚙️",
    description: "Set your own house weights",
    weights: null, // User defines
    bestFor: "People with specific relationship goals"
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CustomizableHouseOptimizer = ({ userChart, partnerDate, partnerHourWindow, partnerLocation, onOptimize }) => {
  const [selectedArchetype, setSelectedArchetype] = useState('soulmate');
  const [customWeights, setCustomWeights] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    7: 40, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
  });
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const archetype = RELATIONSHIP_ARCHETYPES[selectedArchetype];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    const weights = selectedArchetype === 'custom' ? customWeights : archetype.weights;
    
    try {
      const result = await onOptimize({
        userChart,
        partnerDate,
        partnerHourWindow,
        partnerLocation,
        houseWeights: weights,
        archetype: archetype.name
      });
      
      // Result handled by parent component
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30">
      
      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          🎯 Optimize House Placements
        </h3>
        <p className="text-purple-200 text-sm">
          What matters most to you in a relationship? Different priorities = different optimal times!
        </p>
      </div>

      {/* ===== ARCHETYPE SELECTOR ===== */}
      <div className="mb-6">
        <h4 className="font-bold text-purple-300 mb-3">Choose Your Relationship Archetype:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(RELATIONSHIP_ARCHETYPES).map(([key, arch]) => (
            <ArchetypeCard
              key={key}
              archetype={arch}
              archetypeKey={key}
              isSelected={selectedArchetype === key}
              onSelect={() => setSelectedArchetype(key)}
            />
          ))}
        </div>
      </div>

      {/* ===== SELECTED ARCHETYPE DETAILS ===== */}
      <ArchetypeDetails
        archetype={archetype}
        isCustom={selectedArchetype === 'custom'}
        customWeights={customWeights}
        onCustomWeightsChange={setCustomWeights}
        showCustomizer={showCustomizer}
        onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
      />

      {/* ===== OPTIMIZATION BUTTON ===== */}
      <div className="mt-6">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚙️</span>
              <span>Optimizing with Gemini...</span>
            </span>
          ) : (
            <span>🚀 Find Optimal Time with {archetype.name} Focus</span>
          )}
        </button>
        <p className="text-center text-purple-300 text-xs mt-2">
          This will iterate through {partnerHourWindow} to find the best house placements
        </p>
      </div>

    </div>
  );
};

// ============================================================================
// ARCHETYPE CARD
// ============================================================================

const ArchetypeCard = ({ archetype, archetypeKey, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-purple-400 bg-purple-800/50 shadow-lg'
          : 'border-purple-700/30 bg-purple-900/20 hover:bg-purple-800/30'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">{archetype.icon}</div>
        <div className="flex-1">
          <div className="font-bold text-white text-sm">{archetype.name}</div>
          <div className="text-purple-300 text-xs">{archetype.tagline}</div>
        </div>
        {isSelected && <div className="text-purple-400">✓</div>}
      </div>
      <p className="text-purple-200 text-xs">{archetype.description}</p>
    </button>
  );
};

// ============================================================================
// ARCHETYPE DETAILS
// ============================================================================

const ArchetypeDetails = ({ archetype, isCustom, customWeights, onCustomWeightsChange, showCustomizer, onToggleCustomizer }) => {
  const weights = isCustom ? customWeights : archetype.weights;
  
  // Calculate total for custom
  const total = isCustom ? Object.values(customWeights).reduce((sum, val) => sum + val, 0) : 100;

  return (
    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-bold text-purple-300">
          {archetype.icon} {archetype.name} Priorities
        </h5>
        {isCustom && (
          <button
            onClick={onToggleCustomizer}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            {showCustomizer ? 'Hide Customizer' : 'Customize Weights'}
          </button>
        )}
      </div>

      {/* Custom Warning */}
      {isCustom && total !== 100 && (
        <div className="mb-3 bg-yellow-900/30 rounded p-2 border border-yellow-700/40">
          <p className="text-yellow-300 text-xs">
            ⚠️ Total must equal 100% (currently {total}%)
          </p>
        </div>
      )}

      {/* Weight Display/Editor */}
      {!isCustom || !showCustomizer ? (
        <WeightDisplay weights={weights} />
      ) : (
        <WeightCustomizer weights={customWeights} onChange={onCustomWeightsChange} />
      )}

      {/* Best For */}
      <div className="mt-3 pt-3 border-t border-purple-700/30">
        <p className="text-purple-200 text-xs">
          <strong className="text-purple-300">Best for:</strong> {archetype.bestFor}
        </p>
      </div>

    </div>
  );
};

// ============================================================================
// WEIGHT DISPLAY (READ-ONLY)
// ============================================================================

const WeightDisplay = ({ weights }) => {
  const HOUSE_NAMES = {
    1: '1st (Self)',
    2: '2nd (Resources)',
    3: '3rd (Communication)',
    4: '4th (Home)',
    5: '5th (Romance)',
    6: '6th (Work)',
    7: '7th (Partnership)',
    8: '8th (Intimacy)',
    9: '9th (Philosophy)',
    10: '10th (Career)',
    11: '11th (Friendship)',
    12: '12th (Spirituality)'
  };

  // Only show houses with non-zero weights
  const significantWeights = Object.entries(weights)
    .filter(([_, weight]) => weight > 0)
    .sort(([_, a], [__, b]) => b - a); // Sort by weight descending

  return (
    <div className="space-y-2">
      {significantWeights.map(([house, weight]) => (
        <div key={house} className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-xs text-purple-200">{HOUSE_NAMES[house]}</div>
            <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${weight}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-mono text-purple-300 min-w-[45px] text-right">
            {weight}%
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// WEIGHT CUSTOMIZER (SLIDERS)
// ============================================================================

const WeightCustomizer = ({ weights, onChange }) => {
  const HOUSE_NAMES = {
    1: '1st (Self)',
    2: '2nd (Resources)',
    3: '3rd (Communication)',
    4: '4th (Home)',
    5: '5th (Romance)',
    6: '6th (Work)',
    7: '7th (Partnership)',
    8: '8th (Intimacy)',
    9: '9th (Philosophy)',
    10: '10th (Career)',
    11: '11th (Friendship)',
    12: '12th (Spirituality)'
  };

  const handleSliderChange = (house, value) => {
    onChange({
      ...weights,
      [house]: parseInt(value)
    });
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {Object.keys(HOUSE_NAMES).map(house => (
        <div key={house} className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-purple-200">{HOUSE_NAMES[house]}</label>
            <span className="text-sm font-mono text-purple-300">{weights[house]}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={weights[house]}
            onChange={(e) => handleSliderChange(house, e.target.value)}
            className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default CustomizableHouseOptimizer;
export { RELATIONSHIP_ARCHETYPES };
