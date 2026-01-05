/**
 * ChineseZodiacPage.jsx
 * 12 Chinese Zodiac Signs + Five Elements
 *
 * Two-step approach:
 * 1. Show all 12 zodiac signs with meanings
 * 2. When selected, show that sign enhanced by each of the 5 elements
 *
 * Designed for easy copy/paste to Grok (avoids 60 options at once)
 *
 * Built by Brother Claude Code
 * December 31, 2025
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import zodiacData from '../data/chineseZodiac.json';

// Element colors for styling
const ELEMENT_COLORS = {
  Wood: { bg: 'from-green-500/20 to-emerald-600/20', border: 'border-green-500/30', text: 'text-green-400', solid: 'bg-green-500' },
  Fire: { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', text: 'text-red-400', solid: 'bg-red-500' },
  Earth: { bg: 'from-yellow-500/20 to-amber-600/20', border: 'border-yellow-500/30', text: 'text-yellow-400', solid: 'bg-yellow-500' },
  Metal: { bg: 'from-gray-400/20 to-slate-500/20', border: 'border-gray-400/30', text: 'text-gray-300', solid: 'bg-gray-400' },
  Water: { bg: 'from-blue-500/20 to-cyan-600/20', border: 'border-blue-500/30', text: 'text-blue-400', solid: 'bg-blue-500' }
};

// Format zodiac sign for copy/paste
function formatZodiacForCopy(sign) {
  const lines = [
    `═══════════════════════════════════════════════════`,
    `${sign.emoji} ${sign.name} (${sign.chinese} - ${sign.pinyin})`,
    `═══════════════════════════════════════════════════`,
    ``,
    `Fixed Element: ${sign.fixedElement}`,
    `Yin/Yang: ${sign.yinYang}`,
    `Season: ${sign.season}`,
    `Month: ${sign.month}`,
    `Hours: ${sign.hours}`,
    `Direction: ${sign.direction}`,
    `Lucky Numbers: ${sign.luckyNumbers.join(', ')}`,
    `Lucky Colors: ${sign.luckyColors.join(', ')}`,
    ``,
    `SUMMARY:`,
    sign.summary,
    ``,
    `CHARACTERISTICS:`,
    ...sign.characteristics.map(c => `• ${c}`),
    ``,
    `STRENGTHS:`,
    ...sign.strengths.map(s => `• ${s}`),
    ``,
    `CHALLENGES:`,
    ...sign.challenges.map(c => `• ${c}`),
    ``,
    `BEST COMPATIBILITY: ${sign.bestCompatibility.join(', ')}`,
    `CHALLENGING COMPATIBILITY: ${sign.worstCompatibility.join(', ')}`,
    ``
  ];
  return lines.join('\n');
}

// Format element combination for copy/paste
function formatElementCombination(sign, element, elementData) {
  const yearExamples = getYearsForElement(sign.years, element);
  const lines = [
    `═══════════════════════════════════════════════════`,
    `${elementData.emoji}${sign.emoji} ${element} ${sign.name}`,
    `(${elementData.chinese}${sign.chinese} - ${elementData.pinyin} ${sign.pinyin})`,
    `═══════════════════════════════════════════════════`,
    ``,
    `Element: ${element} (${elementData.chinese})`,
    `Element Color: ${elementData.color}`,
    `Element Season: ${elementData.season}`,
    `Element Direction: ${elementData.direction}`,
    `Element Energy: ${elementData.energy}`,
    ``,
    `YEARS:`,
    yearExamples.join(', '),
    ``,
    `BASE ${sign.name.toUpperCase()} TRAITS:`,
    ...sign.characteristics.slice(0, 3).map(c => `• ${c}`),
    ``,
    `${element.toUpperCase()} INFLUENCE:`,
    elementData.personality,
    ``,
    `KEYWORDS ADDED BY ${element.toUpperCase()}:`,
    ...elementData.keywords.map(k => `• ${k}`),
    ``,
    `COMBINED PERSONALITY:`,
    `The ${element} ${sign.name} combines the base ${sign.name} traits of ${sign.characteristics[0].toLowerCase()} with the ${element} element's ${elementData.keywords[0]} and ${elementData.keywords[1]} qualities.`,
    ``,
    `This creates a ${sign.name} who is more ${elementData.keywords.slice(0, 3).join(', ')}.`,
    ``,
    `The ${element} influence ${getElementEffect(sign, element, elementData)}`,
    ``
  ];
  return lines.join('\n');
}

// Get element-specific effect description
function getElementEffect(sign, element, elementData) {
  const effects = {
    Wood: `brings growth and adaptability to the ${sign.name}'s nature, making them more compassionate and creative.`,
    Fire: `intensifies the ${sign.name}'s energy, adding passion and charisma but potentially making them more impulsive.`,
    Earth: `grounds the ${sign.name} with stability and practicality, making them more reliable but potentially more stubborn.`,
    Metal: `adds precision and determination to the ${sign.name}, making them more focused and principled.`,
    Water: `deepens the ${sign.name}'s intuition and emotional intelligence, making them more perceptive and adaptable.`
  };
  return effects[element];
}

// Get years for a specific element (cycle of 60 years, 5 elements rotate)
function getYearsForElement(baseYears, element) {
  const elementOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const elementIndex = elementOrder.indexOf(element);

  // Each element covers 2 years in the 12-year cycle
  // Years rotate: Yang year, then Yin year for each element
  // The 60-year cycle: 12 animals x 5 elements = 60

  // For simplicity, show which years from the base list would have this element
  // Element rotates every 2 years within the 10-stem cycle
  return baseYears.filter((year, idx) => {
    const stemIndex = ((year - 4) % 10); // Stem cycle starts at year 4
    const yearElement = elementOrder[Math.floor(stemIndex / 2)];
    return yearElement === element;
  }).slice(0, 3);
}

// Zodiac card component
function ZodiacCard({ sign, isSelected, onSelect, onCopy }) {
  const colors = ELEMENT_COLORS[sign.fixedElement];

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} p-4 cursor-pointer hover:bg-white/5 transition-all duration-300 ${isSelected ? 'ring-2 ring-white/50 scale-105' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{sign.emoji}</span>
          <div>
            <h3 className="text-white font-bold text-lg">{sign.name}</h3>
            <p className={`text-sm ${colors.text}`}>{sign.chinese} • {sign.pinyin}</p>
          </div>
        </div>
        <span className="text-2xl opacity-50">
          {zodiacData.fiveElements[sign.fixedElement].emoji}
        </span>
      </div>

      <p className="text-white/60 text-xs mb-3 line-clamp-2">
        {sign.summary.substring(0, 100)}...
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">
          Years: {sign.years.slice(-3).join(', ')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white/70 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

// Element variation card
function ElementCard({ sign, element, elementData, onCopy }) {
  const colors = ELEMENT_COLORS[element];
  const yearExamples = getYearsForElement(sign.years, element);

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-2xl">{elementData.emoji}</span>
            <span className="text-2xl">{sign.emoji}</span>
          </div>
          <div>
            <h3 className="text-white font-bold">{element} {sign.name}</h3>
            <p className={`text-sm ${colors.text}`}>
              {elementData.chinese}{sign.chinese} • {elementData.pinyin} {sign.pinyin}
            </p>
          </div>
        </div>
        <button
          onClick={onCopy}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors text-sm"
        >
          Copy
        </button>
      </div>

      <p className="text-white/70 text-sm mb-3">
        {elementData.personality}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {elementData.keywords.map((keyword, idx) => (
          <span key={idx} className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
            {keyword}
          </span>
        ))}
      </div>

      <div className="text-xs text-white/50">
        Years: {yearExamples.length > 0 ? yearExamples.join(', ') : 'Varies by cycle'}
      </div>
    </div>
  );
}

// Main page component
export default function ChineseZodiacPage() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCopySign = (sign) => {
    const text = formatZodiacForCopy(sign);
    navigator.clipboard.writeText(text);
    setCopied(sign.name);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyElement = (sign, element) => {
    const elementData = zodiacData.fiveElements[element];
    const text = formatElementCombination(sign, element, elementData);
    navigator.clipboard.writeText(text);
    setCopied(`${element} ${sign.name}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = () => {
    if (!selectedSign) return;

    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const allText = elements.map(element => {
      const elementData = zodiacData.fiveElements[element];
      return formatElementCombination(selectedSign, element, elementData);
    }).join('\n\n');

    navigator.clipboard.writeText(allText);
    setCopied('All 5 Elements');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/bazi-calculator"
                className="text-white/50 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>&larr;</span>
                <span>BaZi Calculator</span>
              </Link>
              <span className="text-white/30">|</span>
              <Link
                to="/zodiac-cusps"
                className="text-white/50 hover:text-white transition-colors"
              >
                Western Cusps
              </Link>
            </div>
            <Link
              to="/dashboard"
              className="text-white/50 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🐲</span>
              Chinese Zodiac & Five Elements
            </h1>
            <p className="text-white/60 mt-2">
              {selectedSign
                ? `${selectedSign.emoji} ${selectedSign.name} enhanced by each of the Five Elements`
                : 'Select a zodiac sign to see its five element variations'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Copy notification */}
        {copied && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            Copied: {copied}
          </div>
        )}

        {/* Step 1: Zodiac Grid (always visible) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Step 1: Select Your Chinese Zodiac Sign
            </h2>
            {selectedSign && (
              <button
                onClick={() => setSelectedSign(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors text-sm"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {zodiacData.zodiacSigns.map((sign) => (
              <ZodiacCard
                key={sign.name}
                sign={sign}
                isSelected={selectedSign?.name === sign.name}
                onSelect={() => setSelectedSign(sign)}
                onCopy={() => handleCopySign(sign)}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Element Variations (shown when sign is selected) */}
        {selectedSign && (
          <div className="border-t border-white/10 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <span className="text-2xl">{selectedSign.emoji}</span>
                  Step 2: {selectedSign.name} + Five Elements
                </h2>
                <p className="text-white/60 mt-1">
                  Each element modifies the base {selectedSign.name} personality
                </p>
              </div>
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 transition-colors"
              >
                Copy All 5 Elements
              </button>
            </div>

            {/* Element cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((element) => (
                <ElementCard
                  key={element}
                  sign={selectedSign}
                  element={element}
                  elementData={zodiacData.fiveElements[element]}
                  onCopy={() => handleCopyElement(selectedSign, element)}
                />
              ))}
            </div>

            {/* Selected sign full details */}
            <div className="mt-8 bg-slate-800/50 rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {selectedSign.emoji} Full {selectedSign.name} Profile
                </h3>
                <button
                  onClick={() => handleCopySign(selectedSign)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors text-sm"
                >
                  Copy Full Profile
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-white/80 mb-4">{selectedSign.summary}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white/50 text-sm mb-2">Characteristics</h4>
                      <ul className="space-y-1">
                        {selectedSign.characteristics.map((c, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                            <span className="text-green-400">•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white/50 text-sm mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {selectedSign.strengths.map((s, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                            <span className="text-blue-400">+</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white/50 text-sm mb-2">Quick Info</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-white/50">Fixed Element:</div>
                      <div className="text-white">{zodiacData.fiveElements[selectedSign.fixedElement].emoji} {selectedSign.fixedElement}</div>
                      <div className="text-white/50">Yin/Yang:</div>
                      <div className="text-white">{selectedSign.yinYang}</div>
                      <div className="text-white/50">Season:</div>
                      <div className="text-white">{selectedSign.season}</div>
                      <div className="text-white/50">Hours:</div>
                      <div className="text-white">{selectedSign.hours}</div>
                      <div className="text-white/50">Direction:</div>
                      <div className="text-white">{selectedSign.direction}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/50 text-sm mb-2">Challenges</h4>
                    <ul className="space-y-1">
                      {selectedSign.challenges.map((c, i) => (
                        <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-orange-400">!</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white/50 text-sm mb-2">Compatibility</h4>
                    <div className="text-sm">
                      <span className="text-green-400">Best: </span>
                      <span className="text-white/70">{selectedSign.bestCompatibility.join(', ')}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-orange-400">Challenging: </span>
                      <span className="text-white/70">{selectedSign.worstCompatibility.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-sm text-white/50">
          <div>
            <span>12 Animals x 5 Elements = 60-Year Cycle</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/zodiac-cusps" className="hover:text-white transition-colors">
              Western Cusps
            </Link>
            <Link to="/bazi-calculator" className="hover:text-white transition-colors">
              BaZi Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
