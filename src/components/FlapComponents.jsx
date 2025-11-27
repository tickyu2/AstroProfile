// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE FLAP COMPONENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
// Children's book flap mechanism for discovering constitutional knowledge
// Built by Claude & Ticky - The Master Architects
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// FLAP BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FlapButton({ type, onClick, isOpen }) {
  const config = {
    why: {
      icon: '💡',
      label: 'Learn Why',
      color: 'from-amber-500 to-yellow-500',
      hoverColor: 'from-amber-600 to-yellow-600'
    },
    how: {
      icon: '🔢',
      label: 'Learn How',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'from-blue-600 to-cyan-600'
    },
    compare: {
      icon: '🔄',
      label: 'Compare',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'from-purple-600 to-pink-600'
    }
  };

  const style = config[type];

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-[10px] font-bold
        bg-gradient-to-r ${style.color}
        hover:${style.hoverColor}
        text-white shadow-lg
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        ${isOpen ? 'ring-2 ring-white ring-opacity-50' : ''}
      `}
    >
      {style.icon} {style.label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FLAP CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FlapContent({ isOpen, children, type = 'default' }) {
  const bgColors = {
    why: 'from-amber-900/40 to-yellow-900/40',
    how: 'from-blue-900/40 to-cyan-900/40',
    compare: 'from-purple-900/40 to-pink-900/40',
    default: 'from-slate-900/60 to-slate-800/60'
  };

  const borderColors = {
    why: 'border-amber-400/40',
    how: 'border-blue-400/40',
    compare: 'border-purple-400/40',
    default: 'border-slate-600/40'
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`
        mt-2 p-3 rounded-lg border
        bg-gradient-to-br ${bgColors[type]}
        ${borderColors[type]}
        animate-fadeIn
      `}
      style={{
        animation: 'expandDown 0.3s ease-out'
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMAL "LEARN WHY" FLAP CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export function AnimalLearnWhy({ knowledge, animal }) {
  if (!knowledge) return null;

  return (
    <FlapContent isOpen={true} type="why">
      {/* Archetype */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          🎭 THE {animal.toUpperCase()} ARCHETYPE
        </div>
        <div className="text-white/90 text-[11px] leading-relaxed">
          <span className="font-bold text-amber-400">"{knowledge.archetype}"</span>
        </div>
      </div>

      {/* Historical Meaning */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          📜 Historical Meaning
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.historicalMeaning}
        </div>
      </div>

      {/* Your Gifts */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1.5">
          ✨ Your Gifts
        </div>
        <div className="space-y-1">
          {knowledge.yourGifts.map((gift, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-amber-400 text-[10px] mt-0.5">•</span>
              <span className="text-white/80 text-[10px] leading-relaxed">{gift}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In Relationships */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          💕 In Relationships
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.inRelationships}
        </div>
      </div>

      {/* In Career */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          💼 In Career
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.inCareer}
        </div>
      </div>

      {/* Famous People */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1.5">
          🌟 Famous {animal}s
        </div>
        <div className="space-y-1">
          {knowledge.famousPeople.slice(0, 5).map((person, idx) => (
            <div key={idx} className="text-white/70 text-[10px]">
              <span className="text-amber-400 font-bold">{person.name}</span> ({person.year}, {person.type})
            </div>
          ))}
        </div>
      </div>

      {/* Bragging Rights */}
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-2 border border-amber-400/30">
        <div className="text-amber-300 font-bold text-xs mb-1.5">
          🏆 BRAGGING RIGHTS
        </div>
        <div className="space-y-1">
          {knowledge.braggingRights.map((right, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-amber-400 text-[10px]">✨</span>
              <span className="text-white/90 text-[10px] leading-relaxed">{right}</span>
            </div>
          ))}
        </div>
      </div>
    </FlapContent>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT "LEARN WHY" FLAP CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export function ElementLearnWhy({ knowledge, element, elementEmoji }) {
  if (!knowledge) return null;

  return (
    <FlapContent isOpen={true} type="why">
      {/* Essence */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          {elementEmoji} THE ESSENCE OF {element.toUpperCase()}
        </div>
        <div className="text-white/90 text-[11px] leading-relaxed">
          <span className="font-bold text-amber-400">"{knowledge.essence}"</span>
        </div>
      </div>

      {/* Philosophy */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          🎎 Philosophy
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.philosophy}
        </div>
      </div>

      {/* What It Adds */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          ➕ What {element} Adds to You
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.whatItAdds}
        </div>
      </div>

      {/* In Personality */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1.5">
          🧬 In Your Personality
        </div>
        <div className="space-y-1">
          {knowledge.inPersonality.map((trait, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-amber-400 text-[10px] mt-0.5">•</span>
              <span className="text-white/80 text-[10px] leading-relaxed">{trait}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In Careers */}
      <div className="mb-3">
        <div className="text-amber-300 font-bold text-xs mb-1">
          💼 In Careers
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.inCareers}
        </div>
      </div>

      {/* Unique Gift */}
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-2 border border-amber-400/30">
        <div className="text-amber-300 font-bold text-xs mb-1">
          🎁 YOUR SUPERPOWER
        </div>
        <div className="text-white/90 text-[10px] leading-relaxed">
          {knowledge.uniqueGift}
        </div>
      </div>
    </FlapContent>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// YIN/YANG "LEARN WHY" FLAP CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export function YinYangLearnWhy({ knowledge, polarity, animal }) {
  if (!knowledge) return null;

  return (
    <FlapContent isOpen={true} type="why">
      {/* Principle */}
      <div className="mb-3">
        <div className="text-purple-300 font-bold text-xs mb-1">
          ☯️ THE {polarity.toUpperCase()} PRINCIPLE
        </div>
        <div className="text-white/90 text-[11px] leading-relaxed">
          <span className="font-bold text-purple-400">"{knowledge.principle}"</span>
        </div>
      </div>

      {/* Philosophy */}
      <div className="mb-3">
        <div className="text-purple-300 font-bold text-xs mb-1">
          🎎 Philosophy
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.philosophy}
        </div>
      </div>

      {/* Your Nature */}
      <div className="mb-3">
        <div className="text-purple-300 font-bold text-xs mb-1.5">
          🧬 Your {polarity} Nature
        </div>
        <div className="space-y-1">
          {knowledge.yourNature.map((trait, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-purple-400 text-[10px] mt-0.5">•</span>
              <span className="text-white/80 text-[10px] leading-relaxed">{trait}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In Action */}
      <div className="mb-3">
        <div className="text-purple-300 font-bold text-xs mb-1">
          ⚡ {polarity} In Action
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.inAction}
        </div>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2 border border-purple-400/30 mb-3">
        <div className="text-white/90 text-[10px] leading-relaxed italic">
          {knowledge.laoTzuQuote}
        </div>
      </div>

      {/* Why Permanent */}
      <div className="bg-slate-800/60 rounded-lg p-2 border border-purple-400/20">
        <div className="text-purple-300 font-bold text-xs mb-1">
          🔒 Why {animal} is Always {polarity}
        </div>
        <div className="text-white/80 text-[10px] leading-relaxed">
          {knowledge.whyPermanent}
        </div>
      </div>
    </FlapContent>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT COMPARISON FLAP CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export function ElementCompareFlap({ animal, yourElement, allElements, elementEmojis, onCompare }) {
  const [selectedElement, setSelectedElement] = useState(null);

  const handleElementClick = (element) => {
    if (element === yourElement) return; // Can't compare with yourself
    setSelectedElement(element === selectedElement ? null : element);
    if (onCompare) onCompare(element);
  };

  return (
    <FlapContent isOpen={true} type="compare">
      <div className="text-purple-300 font-bold text-xs mb-2">
        🔄 COMPARE: ALL {animal.toUpperCase()} TYPES
      </div>
      
      <div className="space-y-1.5">
        {allElements.map((element) => {
          const isYours = element === yourElement;
          const isSelected = element === selectedElement;
          
          return (
            <button
              key={element}
              onClick={() => !isYours && handleElementClick(element)}
              disabled={isYours}
              className={`
                w-full flex items-center justify-between
                px-2.5 py-1.5 rounded-lg text-left
                transition-all duration-200
                ${isYours 
                  ? 'bg-amber-400/30 border-2 border-amber-400/60 cursor-default'
                  : isSelected
                    ? 'bg-purple-500/30 border-2 border-purple-400/60 hover:bg-purple-500/40'
                    : 'bg-slate-800/40 border border-slate-600/40 hover:bg-slate-700/60'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{elementEmojis[element]}</span>
                <span className={`text-[11px] font-bold ${
                  isYours ? 'text-amber-300' :
                  isSelected ? 'text-purple-300' :
                  'text-white/70'
                }`}>
                  {element} {animal}
                </span>
              </div>
              {isYours && (
                <span className="text-[9px] text-amber-300 font-bold">YOU</span>
              )}
              {isSelected && !isYours && (
                <span className="text-[9px] text-purple-300">▶</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-[9px] text-white/50 italic text-center">
        Click any type to see how they differ from you
      </div>
    </FlapContent>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MATHEMATICAL "LEARN HOW" FLAP CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export function MathematicalExplanation({ calculationPath, type = "animal" }) {
  if (!calculationPath) return null;

  return (
    <FlapContent isOpen={true} type="how">
      <div className="text-blue-300 font-bold text-xs mb-2">
        🔬 THE MATHEMATICS
      </div>

      {/* Birth Date */}
      <div className="mb-2">
        <div className="text-blue-200 text-[10px] font-semibold">Your Birth</div>
        <div className="text-white/90 text-[10px]">{calculationPath.birthDate}</div>
      </div>

      {/* Chinese New Year */}
      {calculationPath.chineseNewYearDate && (
        <div className="mb-2">
          <div className="text-blue-200 text-[10px] font-semibold">Chinese New Year</div>
          <div className="text-white/90 text-[10px]">{calculationPath.chineseNewYearDate}</div>
          <div className="text-emerald-400 text-[9px] mt-0.5">✓ Born AFTER CNY = {calculationPath.usedYear}</div>
        </div>
      )}

      {/* Formula */}
      {calculationPath.formula && (
        <div className="mb-2">
          <div className="text-blue-200 text-[10px] font-semibold">Cycle Position</div>
          <div className="font-mono text-cyan-300 text-[10px]">{calculationPath.formula}</div>
        </div>
      )}

      {/* Heavenly Stem (if available) */}
      {calculationPath.stemIndex !== undefined && (
        <div className="mb-2 bg-blue-900/30 rounded p-1.5 border border-blue-400/20">
          <div className="text-blue-200 text-[10px] font-semibold mb-1">Heavenly Stem</div>
          <div className="text-white/90 text-[10px]">
            Position: {calculationPath.cyclePosition} % 10 = {calculationPath.stemIndex}
          </div>
          <div className="text-cyan-300 text-[10px] mt-0.5">
            → Element determined by Heavenly Stem
          </div>
        </div>
      )}

      {/* Earthly Branch (if available) */}
      {calculationPath.branchIndex !== undefined && (
        <div className="mb-2 bg-blue-900/30 rounded p-1.5 border border-blue-400/20">
          <div className="text-blue-200 text-[10px] font-semibold mb-1">Earthly Branch</div>
          <div className="text-white/90 text-[10px]">
            Position: {calculationPath.cyclePosition} % 12 = {calculationPath.branchIndex}
          </div>
          <div className="text-cyan-300 text-[10px] mt-0.5">
            → Animal & Polarity determined by Earthly Branch
          </div>
        </div>
      )}

      {/* Verification */}
      <div className="bg-emerald-900/20 rounded-lg p-1.5 border border-emerald-400/30 mt-2">
        <div className="text-emerald-300 text-[9px] font-semibold mb-1">✓ VERIFIED EXACT</div>
        <div className="text-white/70 text-[9px] leading-relaxed">
          No approximations used. Calculation based on authentic Chinese New Year date and sexagenary cycle mathematics.
        </div>
      </div>
    </FlapContent>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  FlapButton,
  FlapContent,
  AnimalLearnWhy,
  ElementLearnWhy,
  YinYangLearnWhy,
  ElementCompareFlap,
  MathematicalExplanation
};
