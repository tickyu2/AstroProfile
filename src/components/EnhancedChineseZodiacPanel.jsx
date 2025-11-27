// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED CHINESE ZODIAC PANEL - WITH INTERACTIVE FLAPS (POLARITY FIXED)
// ═══════════════════════════════════════════════════════════════════════════
// Children's book discovery system for constitutional analysis
// Built by Claude & Ticky - The Master Architects
// FIXED: Polarity calculation now always correct based on animal
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  FlapButton,
  AnimalLearnWhy,
  ElementLearnWhy,
  YinYangLearnWhy,
  ElementCompareFlap,
  MathematicalExplanation
} from './FlapComponents';
import { getDeepAnimalKnowledge, getDeepElementKnowledge, getDeepYinYangKnowledge } from '../data/chineseZodiacDeepKnowledge';

// CORRECT POLARITY MAPPING - The definitive source of truth
const ANIMAL_POLARITY = {
  'Rat': 'Yang',
  'Ox': 'Yin',
  'Tiger': 'Yang',
  'Rabbit': 'Yin',
  'Dragon': 'Yang',
  'Snake': 'Yin',
  'Horse': 'Yang',
  'Goat': 'Yin',
  'Monkey': 'Yang',
  'Rooster': 'Yin',
  'Dog': 'Yang',
  'Pig': 'Yin'
};

// Helper function to get CORRECT polarity
function getCorrectPolarity(animal) {
  return ANIMAL_POLARITY[animal] || 'Yang'; // Default to Yang if unknown
}

// Simple Learn How component for when we don't have full calculation path
function BasicLearnHow({ animal, element, polarity, year, type }) {
  const earthlyBranches = {
    'Rat': '子 (Zǐ)',
    'Ox': '丑 (Chǒu)', 
    'Tiger': '寅 (Yín)',
    'Rabbit': '卯 (Mǎo)',
    'Dragon': '辰 (Chén)',
    'Snake': '巳 (Sì)',
    'Horse': '午 (Wǔ)',
    'Goat': '未 (Wèi)',
    'Monkey': '申 (Shēn)',
    'Rooster': '酉 (Yǒu)',
    'Dog': '戌 (Xū)',
    'Pig': '亥 (Hài)'
  };

  const heavenlyStems = {
    'Wood': '甲/乙 (Jiǎ/Yǐ)',
    'Fire': '丙/丁 (Bǐng/Dīng)',
    'Earth': '戊/己 (Wù/Jǐ)',
    'Metal': '庚/辛 (Gēng/Xīn)',
    'Water': '壬/癸 (Rén/Guǐ)'
  };

  return (
    <div className="mt-2 p-3 rounded-lg border bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/40 animate-fadeIn">
      <div className="text-blue-300 font-bold text-xs mb-2">
        🔬 THE MATHEMATICS
      </div>

      {type === 'animal' && (
        <>
          <div className="mb-2">
            <div className="text-blue-200 text-[10px] font-semibold">Birth Year</div>
            <div className="text-white/90 text-[11px]">{year}</div>
          </div>
          <div className="mb-2 bg-blue-900/30 rounded p-1.5 border border-blue-400/20">
            <div className="text-blue-200 text-[10px] font-semibold mb-1">Earthly Branch (地支)</div>
            <div className="text-white/90 text-[10px]">
              {earthlyBranches[animal]}
            </div>
            <div className="text-cyan-300 text-[9px] mt-1">
              → Animal determined by year's position in 12-year cycle
            </div>
          </div>
          <div className="bg-emerald-900/20 rounded-lg p-1.5 border border-emerald-400/30">
            <div className="text-emerald-300 text-[9px] font-semibold mb-1">✓ HOW IT WORKS</div>
            <div className="text-white/70 text-[9px] leading-relaxed">
              Each year maps to one of 12 Earthly Branches. Your birth year {year} corresponds to {earthlyBranches[animal]}, which is permanently associated with the {animal}.
            </div>
          </div>
        </>
      )}

      {type === 'element' && (
        <>
          <div className="mb-2">
            <div className="text-blue-200 text-[10px] font-semibold">Birth Year</div>
            <div className="text-white/90 text-[11px]">{year}</div>
          </div>
          <div className="mb-2 bg-cyan-900/30 rounded p-1.5 border border-cyan-400/20">
            <div className="text-cyan-200 text-[10px] font-semibold mb-1">Heavenly Stem (天干)</div>
            <div className="text-white/90 text-[10px]">
              {heavenlyStems[element]}
            </div>
            <div className="text-cyan-300 text-[9px] mt-1">
              → Element determined by year's position in 10-year cycle
            </div>
          </div>
          <div className="bg-emerald-900/20 rounded-lg p-1.5 border border-emerald-400/30">
            <div className="text-emerald-300 text-[9px] font-semibold mb-1">✓ HOW IT WORKS</div>
            <div className="text-white/70 text-[9px] leading-relaxed">
              The 5 elements cycle every 10 years (2 years each). Your birth year {year} falls in the {element} phase of the sexagenary cycle.
            </div>
          </div>
        </>
      )}

      {type === 'polarity' && (
        <>
          <div className="mb-2">
            <div className="text-blue-200 text-[10px] font-semibold">Earthly Branch</div>
            <div className="text-white/90 text-[11px]">{earthlyBranches[animal]}</div>
          </div>
          <div className="mb-2">
            <div className="text-blue-200 text-[10px] font-semibold">Animal</div>
            <div className="text-white/90 text-[11px]">{animal}</div>
          </div>
          <div className="bg-purple-900/30 rounded p-1.5 border border-purple-400/20">
            <div className="text-purple-200 text-[10px] font-semibold mb-1">Permanent Polarity</div>
            <div className="text-white/90 text-[10px]">
              {polarity} (encoded in the branch itself)
            </div>
            <div className="text-purple-300 text-[9px] mt-1">
              This never changes - it's fundamental to the animal
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function EnhancedChineseZodiacPanel({ zodiacProfile, zodiacResult, year }) {
  // ⭐ FIX: Get CORRECT polarity based on animal
  const correctPolarity = getCorrectPolarity(zodiacProfile.animal);
  
  // Track which flaps are open
  const [openFlaps, setOpenFlaps] = useState({
    animalWhy: false,
    animalHow: false,
    elementWhy: false,
    elementHow: false,
    elementCompare: false,
    yinYangWhy: false,
    yinYangHow: false
  });

  const toggleFlap = (flapName) => {
    setOpenFlaps(prev => ({
      ...prev,
      [flapName]: !prev[flapName]
    }));
  };

  // Get deep knowledge - USE CORRECT POLARITY
  const deepAnimalInfo = getDeepAnimalKnowledge(zodiacProfile.animal);
  const deepElementInfo = getDeepElementKnowledge(zodiacProfile.element);
  const deepYinYangInfo = getDeepYinYangKnowledge(correctPolarity); // ⭐ FIX

  const elementOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const elementEmojis = {
    'Wood': '🌳',
    'Fire': '🔥',
    'Earth': '🌍',
    'Metal': '🥈',
    'Water': '💧'
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
        <span className="text-xl">{zodiacProfile.emoji}</span>
        <h2 className="text-sm font-bold text-amber-400">CHINESE ZODIAC</h2>
      </div>
      
      {/* Title with Bouncing Emoji */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-4xl bounce flex-shrink-0">{zodiacProfile.emoji}</div>
        <div className="flex-1">
          <div className="text-lg font-bold text-amber-400 uppercase tracking-wide mb-1">
            {zodiacProfile.element} {zodiacProfile.animal}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              zodiacProfile.element === 'Water' ? 'bg-blue-500 text-white' :
              zodiacProfile.element === 'Fire' ? 'bg-red-500 text-white' :
              zodiacProfile.element === 'Earth' ? 'bg-amber-700 text-white' :
              zodiacProfile.element === 'Metal' ? 'bg-gray-400 text-slate-900' : 'bg-green-500 text-white'
            }`}>{zodiacProfile.elementEmoji} {zodiacProfile.element}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              correctPolarity === 'Yin' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-slate-900'
            }`}>{correctPolarity === 'Yin' ? '🌙' : '☀️'} {correctPolarity}</span>
            {zodiacResult?.exact?.chineseNewYear && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                🎯 Verified Exact
              </span>
            )}
          </div>
        </div>
      </div>

      {/* LAYER 1: Base Animal Traits */}
      <div className="bg-slate-900/40 rounded-lg p-2.5 mb-2">
        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wide mb-1">
          Layer 1: All {zodiacProfile.animal}s
        </div>
        <p className="text-[11px] text-white/90 leading-relaxed mb-2">
          {zodiacProfile.baseDescription}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {zodiacProfile.strengths.slice(0, 3).map((trait, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-amber-500/20 rounded text-[9px] text-amber-300">
              {trait}
            </span>
          ))}
        </div>

        {/* Flap Buttons */}
        <div className="flex gap-2">
          <FlapButton 
            type="why" 
            onClick={() => toggleFlap('animalWhy')}
            isOpen={openFlaps.animalWhy}
          />
          <FlapButton 
            type="how" 
            onClick={() => toggleFlap('animalHow')}
            isOpen={openFlaps.animalHow}
          />
        </div>

        {/* Flap Content */}
        {openFlaps.animalWhy && (
          <AnimalLearnWhy 
            knowledge={deepAnimalInfo}
            animal={zodiacProfile.animal}
          />
        )}
        {openFlaps.animalHow && (
          zodiacResult?.exact?.calculationPath ? (
            <MathematicalExplanation 
              calculationPath={zodiacResult.exact.calculationPath}
              type="animal"
            />
          ) : (
            <BasicLearnHow
              animal={zodiacProfile.animal}
              element={zodiacProfile.element}
              polarity={correctPolarity}
              year={year}
              type="animal"
            />
          )
        )}
      </div>

      {/* LAYER 2: Element Enhancement */}
      <div className="bg-slate-900/40 rounded-lg p-2.5 mb-2">
        <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wide mb-1">
          Layer 2: {zodiacProfile.elementEmoji} {zodiacProfile.element} Enhancement
        </div>
        <p className="text-[11px] text-white/90 leading-relaxed mb-2">
          {zodiacProfile.elementEnhancement}
        </p>

        {/* Flap Buttons */}
        <div className="flex gap-2">
          <FlapButton 
            type="why" 
            onClick={() => toggleFlap('elementWhy')}
            isOpen={openFlaps.elementWhy}
          />
          <FlapButton 
            type="how" 
            onClick={() => toggleFlap('elementHow')}
            isOpen={openFlaps.elementHow}
          />
          <FlapButton 
            type="compare" 
            onClick={() => toggleFlap('elementCompare')}
            isOpen={openFlaps.elementCompare}
          />
        </div>

        {/* Flap Content */}
        {openFlaps.elementWhy && (
          <ElementLearnWhy 
            knowledge={deepElementInfo}
            element={zodiacProfile.element}
            elementEmoji={zodiacProfile.elementEmoji}
          />
        )}
        {openFlaps.elementHow && (
          zodiacResult?.exact?.calculationPath ? (
            <MathematicalExplanation 
              calculationPath={zodiacResult.exact.calculationPath}
              type="element"
            />
          ) : (
            <BasicLearnHow
              animal={zodiacProfile.animal}
              element={zodiacProfile.element}
              polarity={correctPolarity}
              year={year}
              type="element"
            />
          )
        )}
        {openFlaps.elementCompare && (
          <ElementCompareFlap
            animal={zodiacProfile.animal}
            yourElement={zodiacProfile.element}
            allElements={elementOrder}
            elementEmojis={elementEmojis}
          />
        )}
      </div>

      {/* LAYER 3: Yin/Yang Polarity - ⭐ FIX: Use correctPolarity */}
      <div className="bg-slate-900/40 rounded-lg p-2.5 mb-3">
        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wide mb-1">
          Layer 3: {correctPolarity === 'Yin' ? '🌙' : '☀️'} {correctPolarity} Polarity
        </div>
        <p className="text-[11px] text-white/90 leading-relaxed mb-2">
          All {zodiacProfile.animal}s are {correctPolarity}. {
            correctPolarity === 'Yin' 
              ? 'Yin represents receptive, intuitive, nurturing energy. Yin represents the quiet strength of water - flowing, adapting, feeling. You lead through listening, succeed through patience, and transform through receptivity.'
              : 'Yang represents active, logical, assertive energy. Yang represents the bright power of fire - initiating, leading, creating. You lead through action, succeed through force, and transform through assertion.'
          }
        </p>

        {/* Flap Buttons */}
        <div className="flex gap-2">
          <FlapButton 
            type="why" 
            onClick={() => toggleFlap('yinYangWhy')}
            isOpen={openFlaps.yinYangWhy}
          />
          <FlapButton 
            type="how" 
            onClick={() => toggleFlap('yinYangHow')}
            isOpen={openFlaps.yinYangHow}
          />
        </div>

        {/* Flap Content */}
        {openFlaps.yinYangWhy && (
          <YinYangLearnWhy 
            knowledge={deepYinYangInfo}
            polarity={correctPolarity}
            animal={zodiacProfile.animal}
          />
        )}
        {openFlaps.yinYangHow && (
          zodiacResult?.exact?.earthlyBranch ? (
            <div className="mt-2 p-3 rounded-lg border bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/40 animate-fadeIn">
              <div className="text-blue-300 font-bold text-xs mb-2">
                🔬 THE POLARITY PROOF
              </div>
              <div className="mb-2">
                <div className="text-blue-200 text-[10px] font-semibold">Earthly Branch</div>
                <div className="text-white/90 text-[11px]">
                  {zodiacResult.exact.earthlyBranch.chinese} ({zodiacResult.exact.earthlyBranch.pinyin})
                </div>
              </div>
              <div className="mb-2">
                <div className="text-blue-200 text-[10px] font-semibold">Animal</div>
                <div className="text-white/90 text-[11px]">{zodiacResult.exact.earthlyBranch.animal}</div>
              </div>
              <div className="bg-purple-900/30 rounded p-1.5 border border-purple-400/20">
                <div className="text-purple-200 text-[10px] font-semibold mb-1">Permanent Polarity</div>
                <div className="text-white/90 text-[10px]">
                  {correctPolarity} (encoded in the branch itself)
                </div>
                <div className="text-purple-300 text-[9px] mt-1">
                  This never changes - it's fundamental to the animal
                </div>
              </div>
            </div>
          ) : (
            <BasicLearnHow
              animal={zodiacProfile.animal}
              element={zodiacProfile.element}
              polarity={correctPolarity}
              year={year}
              type="polarity"
            />
          )
        )}
      </div>

      {/* 60-YEAR CYCLE MATRIX */}
      <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg p-2.5 mb-3 border border-amber-400/20">
        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wide mb-2 text-center">
          💫 60-Year Cycle: {zodiacProfile.animal} Types 💫
        </div>
        <div className="space-y-1 text-[11px]">
          {(() => {
            const userElement = zodiacProfile.element;
            const userYear = year;
            const userElementIndex = elementOrder.indexOf(userElement);
            
            const elementData = elementOrder.map((element, idx) => {
              const offset = (idx - userElementIndex) * 12;
              const centerYear = userYear + offset;
              
              const years = [
                centerYear - 120,
                centerYear - 60,
                centerYear,
                centerYear + 60,
                centerYear + 120
              ];
              
              return {
                element,
                emoji: elementEmojis[element],
                years,
                isUserElement: element === userElement,
                centerIndex: 2
              };
            });
            
            return elementData.map((data, idx) => (
              <div key={idx} className={`flex items-center justify-between rounded py-1.5 px-2 transition-all duration-200 ${
                data.isUserElement 
                  ? 'bg-amber-400/20 border border-amber-400/40 hover:bg-amber-400/30 hover:border-amber-400/60' 
                  : 'bg-slate-800/30 hover:bg-slate-800/50'
              }`}>
                <div className="flex items-center gap-1.5 min-w-[110px]">
                  <span className="text-sm">{data.emoji}</span>
                  <span className={`text-[10px] ${data.isUserElement ? 'font-bold text-amber-300' : 'text-white/70'}`}>
                    {data.element} {zodiacProfile.animal}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px]">
                  {data.years.map((yearValue, yearIdx) => (
                    <span key={yearIdx} className={`
                      ${data.isUserElement && yearIdx === data.centerIndex 
                        ? 'px-2 py-0.5 bg-amber-500/40 rounded border border-amber-400/70 text-amber-200 font-bold' 
                        : 'text-white/60'}
                    `}>
                      {yearValue}
                      {data.isUserElement && yearIdx === data.centerIndex && (
                        <span className="ml-1.5 text-amber-300 text-[9px]">← 👤 You</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
        <p className="text-[9px] text-amber-300/70 mt-2 text-center italic">
          You're 1 of 60 unique types in the complete cycle!
        </p>
      </div>

      {/* Big Yellow Button */}
      <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg">
        🎓 Master Your Cosmic Blueprint →
      </button>
    </div>
  );
}
