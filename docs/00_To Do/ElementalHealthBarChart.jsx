import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

/**
 * Interactive Five Elements Health Bar Chart
 * Shows perfect baseline, health zones, user's actual values, and seasonal variations
 */

const ELEMENTS = {
  wood: {
    name: 'Wood',
    emoji: '🌳',
    color: '#10b981', // emerald-500
    perfect: 22,
    organs: 'Liver & Gallbladder'
  },
  fire: {
    name: 'Fire',
    emoji: '🔥',
    color: '#ef4444', // red-500
    perfect: 21,
    organs: 'Heart & Small Intestine'
  },
  earth: {
    name: 'Earth',
    emoji: '⛰️',
    color: '#f59e0b', // amber-500
    perfect: 20,
    organs: 'Spleen & Stomach'
  },
  water: {
    name: 'Water',
    emoji: '💧',
    color: '#3b82f6', // blue-500
    perfect: 19,
    organs: 'Kidneys & Bladder'
  },
  metal: {
    name: 'Metal',
    emoji: '⚙️',
    color: '#9ca3af', // gray-400
    perfect: 18,
    organs: 'Lungs & Large Intestine'
  }
};

// Health zone thresholds
const ZONES = {
  deficiency: { max: 10, color: '#dbeafe', label: 'Deficient' }, // blue-100
  acceptable: { min: 15, max: 25, color: '#d1fae5', label: 'Balanced' }, // green-100
  excess: { min: 30, color: '#fee2e2', label: 'Excess' } // red-100
};

// Seasonal multipliers (from your table)
const SEASONAL_MULTIPLIERS = {
  // Regular seasons (2 months each)
  spring_tiger_rabbit: { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6 }, // 寅卯
  summer_snake_horse: { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2 }, // 巳午
  autumn_monkey_rooster: { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8 }, // 申酉
  winter_pig_rat: { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0 }, // 亥子
  
  // Earth transition months (1 month each)
  spring_dragon: { wood: 0.6, fire: 0.8, earth: 1.0, metal: 0.4, water: 0.4 }, // 辰 Dragon
  summer_goat: { wood: 0.4, fire: 0.6, earth: 1.0, metal: 0.8, water: 0.4 }, // 未 Goat
  autumn_dog: { wood: 0.4, fire: 0.4, earth: 1.0, metal: 0.6, water: 0.8 }, // 戌 Dog
  winter_ox: { wood: 0.8, fire: 0.4, earth: 1.0, metal: 0.4, water: 0.6 }  // 丑 Ox
};

// 12 month mapping
const TWELVE_MONTHS = [
  { name: 'Tiger 寅', season: 'Spring', key: 'spring_tiger_rabbit', solarTerm: 'Spring Begins' },
  { name: 'Rabbit 卯', season: 'Spring', key: 'spring_tiger_rabbit', solarTerm: 'Awakening Insects' },
  { name: 'Dragon 辰', season: 'Spring→Summer', key: 'spring_dragon', solarTerm: 'Clear & Bright' },
  { name: 'Snake 巳', season: 'Summer', key: 'summer_snake_horse', solarTerm: 'Summer Begins' },
  { name: 'Horse 午', season: 'Summer', key: 'summer_snake_horse', solarTerm: 'Grain in Ear' },
  { name: 'Goat 未', season: 'Summer→Autumn', key: 'summer_goat', solarTerm: 'Slight Heat' },
  { name: 'Monkey 申', season: 'Autumn', key: 'autumn_monkey_rooster', solarTerm: 'Autumn Begins' },
  { name: 'Rooster 酉', season: 'Autumn', key: 'autumn_monkey_rooster', solarTerm: 'White Dew' },
  { name: 'Dog 戌', season: 'Autumn→Winter', key: 'autumn_dog', solarTerm: 'Cold Dew' },
  { name: 'Pig 亥', season: 'Winter', key: 'winter_pig_rat', solarTerm: 'Winter Begins' },
  { name: 'Rat 子', season: 'Winter', key: 'winter_pig_rat', solarTerm: 'Major Snow' },
  { name: 'Ox 丑', season: 'Winter→Spring', key: 'winter_ox', solarTerm: 'Minor Cold' }
];

function ElementBar({ element, userValue, expanded, onToggle }) {
  const config = ELEMENTS[element];
  const perfect = config.perfect;
  
  // Calculate zones
  const deficientEnd = ZONES.deficiency.max;
  const balancedStart = ZONES.acceptable.min;
  const balancedEnd = ZONES.acceptable.max;
  const excessStart = ZONES.excess.min;
  
  // Determine user's zone
  let userZone = 'moderate';
  let userZoneColor = '#fef3c7'; // amber-100
  if (userValue < deficientEnd) {
    userZone = 'deficient';
    userZoneColor = ZONES.deficiency.color;
  } else if (userValue >= balancedStart && userValue <= balancedEnd) {
    userZone = 'balanced';
    userZoneColor = ZONES.acceptable.color;
  } else if (userValue >= excessStart) {
    userZone = 'excess';
    userZoneColor = ZONES.excess.color;
  }
  
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <h3 className="font-bold text-lg" style={{ color: config.color }}>
              {config.name}
            </h3>
            <p className="text-xs text-gray-500">{config.organs}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">Your Value</div>
            <div className="font-bold text-xl" style={{ color: config.color }}>
              {userValue.toFixed(1)}%
            </div>
            <div className={`text-xs px-2 py-0.5 rounded-full inline-block`} 
                 style={{ backgroundColor: userZoneColor }}>
              {userZone === 'balanced' ? '✓ Balanced' : 
               userZone === 'deficient' ? '⚠ Deficient' :
               userZone === 'excess' ? '⚠ Excess' : 'Moderate'}
            </div>
          </div>
          
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Show seasonal variations"
          >
            {expanded ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
        </div>
      </div>
      
      {/* Main Bar Chart */}
      <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
        {/* Background zones */}
        <div className="absolute inset-0 flex">
          {/* Deficient zone (0-10%) */}
          <div 
            className="h-full" 
            style={{ 
              width: `${deficientEnd}%`,
              backgroundColor: ZONES.deficiency.color 
            }}
          />
          {/* Moderate low zone (10-15%) */}
          <div 
            className="h-full" 
            style={{ 
              width: `${balancedStart - deficientEnd}%`,
              backgroundColor: '#fef3c7' // amber-100
            }}
          />
          {/* Balanced zone (15-25%) */}
          <div 
            className="h-full" 
            style={{ 
              width: `${balancedEnd - balancedStart}%`,
              backgroundColor: ZONES.acceptable.color 
            }}
          />
          {/* Moderate high zone (25-30%) */}
          <div 
            className="h-full" 
            style={{ 
              width: `${excessStart - balancedEnd}%`,
              backgroundColor: '#fef3c7' // amber-100
            }}
          />
          {/* Excess zone (30-100%) */}
          <div 
            className="h-full" 
            style={{ 
              width: `${100 - excessStart}%`,
              backgroundColor: ZONES.excess.color 
            }}
          />
        </div>
        
        {/* Perfect baseline marker */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-black z-10"
          style={{ left: `${perfect}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-black text-white text-xs px-2 py-1 rounded">
              Perfect: {perfect}%
            </div>
          </div>
        </div>
        
        {/* User value bar */}
        <div 
          className="absolute top-0 bottom-0 z-20 transition-all duration-500"
          style={{ 
            width: `${userValue}%`,
            backgroundColor: config.color,
            opacity: 0.7
          }}
        />
        
        {/* User value marker */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white z-30 shadow-lg"
          style={{ left: `${userValue}%` }}
        >
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white border-2 text-xs px-2 py-1 rounded shadow"
                 style={{ borderColor: config.color }}>
              You: {userValue.toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Zone labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-gray-600 font-medium z-5">
          <span>Deficient</span>
          <span className="text-green-700">Balanced</span>
          <span>Excess</span>
        </div>
      </div>
      
      {/* Seasonal Expansion */}
      {expanded && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Seasonal Variations (12 Months)
          </h4>
          
          <div className="space-y-2">
            {TWELVE_MONTHS.map((month, idx) => {
              const multiplier = SEASONAL_MULTIPLIERS[month.key][element];
              const adjustedValue = userValue * multiplier;
              
              // Normalize if needed (in real implementation, would normalize all elements to 100%)
              const displayValue = adjustedValue; // Simplified for demo
              
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-gray-700 font-medium">
                    {month.name}
                  </div>
                  <div className="flex-1 h-6 bg-gray-200 rounded relative overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(displayValue, 100)}%`,
                        backgroundColor: config.color,
                        opacity: 0.6
                      }}
                    />
                    {/* Perfect marker for this season */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-black"
                      style={{ left: `${perfect * multiplier}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-right font-mono">
                    {displayValue.toFixed(1)}%
                  </div>
                  <div className="w-12 text-xs text-gray-500">
                    ×{multiplier.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <strong>Note:</strong> These values show seasonal adjustments using traditional 
            BaZi multipliers. In {TWELVE_MONTHS.find(m => SEASONAL_MULTIPLIERS[m.key][element] === 1.0)?.season || 'its season'}, 
            {config.name} is at peak strength (×1.0 multiplier).
          </div>
        </div>
      )}
    </div>
  );
}

export default function ElementalHealthBarChart({ userElements }) {
  const [expandedElements, setExpandedElements] = useState({});
  
  const toggleExpand = (element) => {
    setExpandedElements(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Five Elements Health Analysis
        </h2>
        <p className="text-gray-600">
          Your elemental distribution compared to optimal baseline with seasonal variations
        </p>
      </div>
      
      {/* Legend */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 via-green-50 to-red-50 p-4 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Understanding the Chart</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black"></div>
              <span className="font-semibold">Perfect Baseline</span>
            </div>
            <p className="text-gray-600 ml-5">Theoretical optimum</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ZONES.deficiency.color }}></div>
              <span className="font-semibold">Deficient (&lt;10%)</span>
            </div>
            <p className="text-gray-600 ml-5">Needs tonification</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ZONES.acceptable.color }}></div>
              <span className="font-semibold">Balanced (15-25%)</span>
            </div>
            <p className="text-gray-600 ml-5">Healthy range</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ZONES.excess.color }}></div>
              <span className="font-semibold">Excess (&gt;30%)</span>
            </div>
            <p className="text-gray-600 ml-5">Needs regulation</p>
          </div>
        </div>
      </div>
      
      {/* Element Bars */}
      <div>
        {Object.keys(ELEMENTS).map(element => (
          <ElementBar
            key={element}
            element={element}
            userValue={userElements[element]}
            expanded={expandedElements[element]}
            onToggle={() => toggleExpand(element)}
          />
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Your Constitutional Summary</h3>
        <div className="text-sm text-gray-700 space-y-1">
          {Object.entries(userElements)
            .filter(([_, val]) => val >= 30)
            .map(([elem, val]) => (
              <div key={elem}>
                • <strong>{ELEMENTS[elem].emoji} {ELEMENTS[elem].name} Excess</strong> ({val.toFixed(1)}%): 
                Consider regulation strategies
              </div>
            ))}
          {Object.entries(userElements)
            .filter(([_, val]) => val < 10)
            .map(([elem, val]) => (
              <div key={elem}>
                • <strong>{ELEMENTS[elem].emoji} {ELEMENTS[elem].name} Deficiency</strong> ({val.toFixed(1)}%): 
                Needs tonification support
              </div>
            ))}
          {Object.entries(userElements)
            .filter(([_, val]) => val >= 15 && val <= 25)
            .map(([elem, val]) => (
              <div key={elem}>
                • <strong>{ELEMENTS[elem].emoji} {ELEMENTS[elem].name} Balanced</strong> ({val.toFixed(1)}%): 
                Healthy maintenance ✓
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Example usage:
/*
<ElementalHealthBarChart 
  userElements={{
    wood: 63.6,
    fire: 5.6,
    earth: 17.6,
    metal: 0.7,
    water: 12.5
  }}
/>
*/
