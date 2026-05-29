import React, { useState } from 'react';
import { Calculator, X, ChevronRight, Info } from 'lucide-react';

/**
 * Calculation Popup Component
 * Shows step-by-step mathematical derivation of seasonal perfect and user adjusted values
 * Educational + transparent - "show your work" feature
 */

const CONSTITUTIONAL_PERFECT = {
  wood: 22,
  fire: 21,
  earth: 20,
  water: 19,
  metal: 18
};

const SEASONAL_MULTIPLIERS = {
  tiger: { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6, season: 'Spring' },
  rabbit: { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6, season: 'Spring' },
  dragon: { wood: 0.6, fire: 0.8, earth: 1.0, metal: 0.4, water: 0.4, season: 'Spring→Summer' },
  snake: { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2, season: 'Summer' },
  horse: { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2, season: 'Summer' },
  goat: { wood: 0.4, fire: 0.6, earth: 1.0, metal: 0.8, water: 0.4, season: 'Summer→Autumn' },
  monkey: { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8, season: 'Autumn' },
  rooster: { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8, season: 'Autumn' },
  dog: { wood: 0.4, fire: 0.4, earth: 1.0, metal: 0.6, water: 0.8, season: 'Autumn→Winter' },
  pig: { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0, season: 'Winter' },
  rat: { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0, season: 'Winter' },
  ox: { wood: 0.8, fire: 0.4, earth: 1.0, metal: 0.4, water: 0.6, season: 'Winter→Spring' }
};

const ELEMENTS = {
  wood: { name: 'Wood', emoji: '🌳', color: '#10b981' },
  fire: { name: 'Fire', emoji: '🔥', color: '#ef4444' },
  earth: { name: 'Earth', emoji: '⛰️', color: '#f59e0b' },
  water: { name: 'Water', emoji: '💧', color: '#3b82f6' },
  metal: { name: 'Metal', emoji: '⚙️', color: '#9ca3af' }
};

function CalculationPopup({ 
  month, 
  element,
  userConstitution,
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('perfect'); // 'perfect' or 'user'
  
  const monthKey = month.toLowerCase();
  const multipliers = SEASONAL_MULTIPLIERS[monthKey];
  const elementConfig = ELEMENTS[element];
  
  // Calculate Perfect Seasonal Baseline
  const perfectCalculation = calculateSeasonalPerfect(multipliers);
  
  // Calculate User's Adjusted Value
  const userCalculation = calculateUserAdjusted(userConstitution, multipliers);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  Seasonal Calculation Breakdown
                </h2>
                <p className="text-purple-100">
                  {elementConfig.emoji} {elementConfig.name} Element - {month} Month ({multipliers.season})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('perfect')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'perfect'
                ? 'bg-white border-b-2 border-purple-600 text-purple-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            📐 Perfect Baseline Calculation
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'user'
                ? 'bg-white border-b-2 border-purple-600 text-purple-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            👤 Your Adjusted Values
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {activeTab === 'perfect' ? (
            <PerfectCalculationView
              element={element}
              elementConfig={elementConfig}
              multipliers={multipliers}
              calculation={perfectCalculation}
            />
          ) : (
            <UserCalculationView
              element={element}
              elementConfig={elementConfig}
              multipliers={multipliers}
              userConstitution={userConstitution}
              calculation={userCalculation}
              perfectValue={perfectCalculation.normalized[element]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PerfectCalculationView({ element, elementConfig, multipliers, calculation }) {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">
              What is "Perfect" Seasonal Baseline?
            </h3>
            <p className="text-sm text-purple-800">
              Starting from the constitutional perfect (22-21-20-19-18), we apply seasonal 
              multipliers based on traditional BaZi theory, then normalize to 100%. 
              This shows what's naturally healthy for this time of year.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Starting Values */}
      <CalculationStep
        stepNumber={1}
        title="Constitutional Perfect Baseline"
        description="Year-round average (before seasonal adjustment)"
      >
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(CONSTITUTIONAL_PERFECT).map(([elem, value]) => (
            <div
              key={elem}
              className={`p-3 rounded-lg text-center ${
                elem === element ? 'bg-purple-100 border-2 border-purple-600' : 'bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{ELEMENTS[elem].emoji}</div>
              <div className="font-bold text-lg">{value}%</div>
              <div className="text-xs text-gray-600 capitalize">{elem}</div>
            </div>
          ))}
        </div>
      </CalculationStep>

      {/* Step 2: Apply Multipliers */}
      <CalculationStep
        stepNumber={2}
        title="Apply Seasonal Multipliers"
        description={`${multipliers.season} season adjustments`}
      >
        <div className="space-y-2">
          {Object.entries(CONSTITUTIONAL_PERFECT).map(([elem, baseValue]) => {
            const multiplier = multipliers[elem];
            const adjusted = baseValue * multiplier;
            const isTarget = elem === element;
            
            return (
              <div
                key={elem}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isTarget ? 'bg-purple-50 border-2 border-purple-600' : 'bg-gray-50'
                }`}
              >
                <div className="w-20 text-right">
                  <span className="text-2xl">{ELEMENTS[elem].emoji}</span>
                </div>
                <div className="flex-1 font-mono text-sm">
                  {baseValue}% × {multiplier.toFixed(1)} = {adjusted.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 w-32">
                  {getMultiplierPhase(multiplier)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
          <div className="font-semibold text-blue-900">
            Total Adjusted: {calculation.totalAdjusted.toFixed(2)}
          </div>
          <div className="text-sm text-blue-800 mt-1">
            Not 100% because seasonal changes affect total energy differently
          </div>
        </div>
      </CalculationStep>

      {/* Step 3: Normalize */}
      <CalculationStep
        stepNumber={3}
        title="Normalize to 100%"
        description="Divide each by total, multiply by 100"
      >
        <div className="space-y-2">
          {Object.entries(calculation.adjusted).map(([elem, adjValue]) => {
            const normalized = calculation.normalized[elem];
            const isTarget = elem === element;
            
            return (
              <div
                key={elem}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isTarget ? 'bg-purple-50 border-2 border-purple-600' : 'bg-gray-50'
                }`}
              >
                <div className="w-20 text-right">
                  <span className="text-2xl">{ELEMENTS[elem].emoji}</span>
                </div>
                <div className="flex-1 font-mono text-sm">
                  {adjValue.toFixed(2)} ÷ {calculation.totalAdjusted.toFixed(2)} × 100 = {normalized.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CalculationStep>

      {/* Final Result */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-600 rounded-xl p-6">
        <div className="text-center">
          <div className="text-green-700 font-semibold mb-2">
            ✓ Perfect {elementConfig.name} for {multipliers.season}
          </div>
          <div className="text-5xl font-bold" style={{ color: elementConfig.color }}>
            {calculation.normalized[element].toFixed(1)}%
          </div>
          <div className="text-sm text-green-700 mt-2">
            This is what's naturally healthy for this season
          </div>
        </div>
      </div>
    </div>
  );
}

function UserCalculationView({ 
  element, 
  elementConfig, 
  multipliers, 
  userConstitution, 
  calculation,
  perfectValue 
}) {
  const userValue = calculation.normalized[element];
  const difference = userValue - perfectValue;
  const status = difference > 10 ? 'excess' : difference < -10 ? 'deficient' : 'balanced';
  
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Your Seasonally-Adjusted Values
            </h3>
            <p className="text-sm text-blue-800">
              Starting from YOUR constitutional makeup, we apply the same seasonal multipliers, 
              then normalize. This shows how your actual values compare to what's healthy for this season.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Your Constitution */}
      <CalculationStep
        stepNumber={1}
        title="Your Raw Constitution"
        description="Your innate elemental distribution (unadjusted)"
      >
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(userConstitution).map(([elem, value]) => (
            <div
              key={elem}
              className={`p-3 rounded-lg text-center ${
                elem === element ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{ELEMENTS[elem].emoji}</div>
              <div className="font-bold text-lg">{value.toFixed(1)}%</div>
              <div className="text-xs text-gray-600 capitalize">{elem}</div>
            </div>
          ))}
        </div>
      </CalculationStep>

      {/* Step 2: Apply Multipliers */}
      <CalculationStep
        stepNumber={2}
        title="Apply Seasonal Multipliers"
        description={`Same ${multipliers.season} multipliers as perfect baseline`}
      >
        <div className="space-y-2">
          {Object.entries(userConstitution).map(([elem, baseValue]) => {
            const multiplier = multipliers[elem];
            const adjusted = baseValue * multiplier;
            const isTarget = elem === element;
            
            return (
              <div
                key={elem}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isTarget ? 'bg-blue-50 border-2 border-blue-600' : 'bg-gray-50'
                }`}
              >
                <div className="w-20 text-right">
                  <span className="text-2xl">{ELEMENTS[elem].emoji}</span>
                </div>
                <div className="flex-1 font-mono text-sm">
                  {baseValue.toFixed(1)}% × {multiplier.toFixed(1)} = {adjusted.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-600 rounded">
          <div className="font-semibold text-amber-900">
            Total Adjusted: {calculation.totalAdjusted.toFixed(2)}
          </div>
          <div className="text-sm text-amber-800 mt-1">
            {calculation.totalAdjusted < 50 
              ? "⚠️ Low total suggests weak elements being further reduced"
              : calculation.totalAdjusted > 80
              ? "Note: High total from strong base constitution"
              : "Within normal adjusted range"}
          </div>
        </div>
      </CalculationStep>

      {/* Step 3: Normalize */}
      <CalculationStep
        stepNumber={3}
        title="Normalize to 100%"
        description="Divide each by total, multiply by 100"
      >
        <div className="space-y-2">
          {Object.entries(calculation.adjusted).map(([elem, adjValue]) => {
            const normalized = calculation.normalized[elem];
            const isTarget = elem === element;
            
            return (
              <div
                key={elem}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isTarget ? 'bg-blue-50 border-2 border-blue-600' : 'bg-gray-50'
                }`}
              >
                <div className="w-20 text-right">
                  <span className="text-2xl">{ELEMENTS[elem].emoji}</span>
                </div>
                <div className="flex-1 font-mono text-sm">
                  {adjValue.toFixed(2)} ÷ {calculation.totalAdjusted.toFixed(2)} × 100 = {normalized.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CalculationStep>

      {/* Comparison */}
      <div className={`border-2 rounded-xl p-6 ${
        status === 'excess' ? 'bg-red-50 border-red-600' :
        status === 'deficient' ? 'bg-blue-50 border-blue-600' :
        'bg-green-50 border-green-600'
      }`}>
        <div className="text-center">
          <div className="text-sm font-semibold mb-3">
            {elementConfig.emoji} {elementConfig.name} Comparison
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Perfect for Season</div>
              <div className="text-3xl font-bold" style={{ color: elementConfig.color }}>
                {perfectValue.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Your Adjusted Value</div>
              <div className="text-3xl font-bold" style={{ color: elementConfig.color }}>
                {userValue.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className={`text-lg font-semibold ${
            status === 'excess' ? 'text-red-700' :
            status === 'deficient' ? 'text-blue-700' :
            'text-green-700'
          }`}>
            {difference > 0 ? '+' : ''}{difference.toFixed(1)}% 
            {status === 'excess' && ' ⚠️ EXCESS'}
            {status === 'deficient' && ' ⚠️ DEFICIENT'}
            {status === 'balanced' && ' ✓ BALANCED'}
          </div>
          
          <div className="text-sm mt-2 text-gray-700">
            {status === 'excess' && 
              `Even in ${multipliers.season}, your ${elementConfig.name} is ${Math.abs(difference).toFixed(1)}% above healthy range`}
            {status === 'deficient' && 
              `In ${multipliers.season}, your ${elementConfig.name} is ${Math.abs(difference).toFixed(1)}% below healthy range`}
            {status === 'balanced' && 
              `Your ${elementConfig.name} is well-balanced for ${multipliers.season}!`}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculationStep({ stepNumber, title, description, children }) {
  return (
    <div className="border-l-4 border-purple-300 pl-6 relative">
      <div className="absolute -left-8 top-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {stepNumber}
      </div>
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

// Helper functions
function calculateSeasonalPerfect(multipliers) {
  const adjusted = {};
  let totalAdjusted = 0;
  
  Object.keys(CONSTITUTIONAL_PERFECT).forEach(elem => {
    adjusted[elem] = CONSTITUTIONAL_PERFECT[elem] * multipliers[elem];
    totalAdjusted += adjusted[elem];
  });
  
  const normalized = {};
  Object.keys(adjusted).forEach(elem => {
    normalized[elem] = (adjusted[elem] / totalAdjusted) * 100;
  });
  
  return { adjusted, totalAdjusted, normalized };
}

function calculateUserAdjusted(userConstitution, multipliers) {
  const adjusted = {};
  let totalAdjusted = 0;
  
  Object.keys(userConstitution).forEach(elem => {
    adjusted[elem] = userConstitution[elem] * multipliers[elem];
    totalAdjusted += adjusted[elem];
  });
  
  const normalized = {};
  Object.keys(adjusted).forEach(elem => {
    normalized[elem] = (adjusted[elem] / totalAdjusted) * 100;
  });
  
  return { adjusted, totalAdjusted, normalized };
}

function getMultiplierPhase(multiplier) {
  if (multiplier >= 1.0) return '旺 Prosperous';
  if (multiplier >= 0.8) return '相 Phase';
  if (multiplier >= 0.6) return '休 Rest';
  if (multiplier >= 0.4) return '囚 Imprisoned';
  return '死 Death';
}

export default CalculationPopup;

// Usage example:
/*
<CalculationPopup
  month="Tiger"
  element="wood"
  userConstitution={{
    wood: 63.6,
    fire: 5.6,
    earth: 17.6,
    metal: 0.7,
    water: 12.5
  }}
  onClose={() => setShowCalculation(false)}
/>
*/
