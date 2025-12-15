/**
 * Cognitive Functions Display
 * Leonardo's Vitruvian Proportions: Perfect constitutional display
 * The architecture of consciousness made visible
 * Built with SOUL for humanity's self-understanding
 */

import React from 'react';
import { getCognitiveStack } from '../../utils/mbti/mbtiCodeSystem';

export default function CognitiveFunctionsDisplay({ mbtiType }) {
  const stack = getCognitiveStack(mbtiType);

  if (!stack || stack.length !== 4) return null;

  const positions = [
    { name: 'Dominant', label: 'Hero', description: 'Your superpower - natural, effortless, trusted' },
    { name: 'Auxiliary', label: 'Parent', description: 'Your support - developed, reliable, balancing' },
    { name: 'Tertiary', label: 'Child', description: 'Your playfulness - emerging, creative, vulnerable' },
    { name: 'Inferior', label: 'Shadow', description: 'Your growth edge - undeveloped, aspirational, transformative' }
  ];

  // Function colors based on type
  const getFunctionColor = (fn) => {
    const base = fn.replace(/[ie]/i, '');
    const colors = {
      'N': 'from-cyan-500 to-blue-600',      // Intuition - sky/vision
      'S': 'from-emerald-500 to-green-600',  // Sensing - earth/grounded
      'T': 'from-indigo-500 to-purple-600',  // Thinking - mind/logic
      'F': 'from-pink-500 to-rose-600'       // Feeling - heart/values
    };
    return colors[base] || 'from-gray-500 to-gray-600';
  };

  const getOrientationIcon = (fn) => {
    return fn.startsWith('e') || fn.charAt(0) === fn.charAt(0).toUpperCase() ? '↗️' : '↘️';
  };

  const getOrientationLabel = (fn) => {
    return fn.startsWith('e') || fn.charAt(0) === fn.charAt(0).toUpperCase() ? 'Extraverted' : 'Introverted';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-blue-300">Cognitive Stack:</span>
        <span className="text-xs text-blue-400 italic">Your consciousness architecture</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stack.map((fn, index) => (
          <div key={index} className="relative group">
            {/* Function Badge */}
            <div
              className={`bg-gradient-to-br ${getFunctionColor(fn)} rounded-lg p-3 text-center shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg cursor-pointer`}
              title={`${positions[index].label}: ${positions[index].description}`}
            >
              <div className="text-2xl font-bold text-white mb-1">
                {fn}
              </div>
              <div className="text-xs text-white/80 font-medium">
                {positions[index].label}
              </div>
            </div>

            {/* Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48">
              <div className="bg-slate-900 border border-blue-400/50 rounded-lg p-3 shadow-xl">
                <div className="text-xs font-bold text-blue-300 mb-1">
                  {getOrientationIcon(fn)} {getOrientationLabel(fn)} {fn.replace(/[ie]/i, '')}
                </div>
                <div className="text-xs text-blue-200 leading-relaxed">
                  {positions[index].description}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-blue-300 justify-center mt-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
          <span>N = Intuition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600" />
          <span>S = Sensing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
          <span>T = Thinking</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600" />
          <span>F = Feeling</span>
        </div>
      </div>
    </div>
  );
}
