/**
 * ============================================
 * CONSTITUTIONAL METAPHOR - Your Soul's Identity
 * ============================================
 * 
 * This is THE card that makes math meaningful!
 * Your elemental fingerprint as a living metaphor
 */

import React, { useState } from 'react';
import { getElementColor, getElementIcon } from '../../utils/baziEngine';

const ConstitutionalMetaphor = ({ metaphor, elements, dayMaster }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  const dominant = elements.strengths?.[0];
  const secondary = elements.strengths?.[1];
  const weakest = elements.missing?.[0] || elements.weaknesses?.[0];
  
  return (
    <div style={styles.container}>
      {/* Main Metaphor Card */}
      <div style={styles.mainCard}>
        {/* Title */}
        <div style={styles.title}>
          💎 Your Constitutional Metaphor
        </div>
        
        {/* The Big Reveal */}
        <div style={styles.metaphorName}>
          "{metaphor.name}"
        </div>
        
        {/* Icon/Visual */}
        <div style={styles.metaphorIcon}>
          {getMetaphorIcon(metaphor.name)}
        </div>
        
        {/* Nature Description */}
        <div style={styles.nature}>
          {metaphor.nature}
        </div>
        
        {/* Element Breakdown */}
        <div style={styles.breakdown}>
          {dominant && (
            <div style={styles.breakdownRow}>
              <span style={styles.breakdownLabel}>Primary Nature:</span>
              <span style={{ color: getElementColor(dominant.element) }}>
                {getElementIcon(dominant.element)} {dominant.element} ({dominant.pct.toFixed(1)}%)
              </span>
            </div>
          )}
          
          {secondary && (
            <div style={styles.breakdownRow}>
              <span style={styles.breakdownLabel}>Secondary Nature:</span>
              <span style={{ color: getElementColor(secondary.element) }}>
                {getElementIcon(secondary.element)} {secondary.element} ({secondary.pct.toFixed(1)}%)
              </span>
            </div>
          )}
          
          {dayMaster && (
            <div style={styles.breakdownRow}>
              <span style={styles.breakdownLabel}>Core Essence (Day Master):</span>
              <span style={{ color: getElementColor(dayMaster.element) }}>
                {getElementIcon(dayMaster.element)} {dayMaster.english} {dayMaster.animal}
              </span>
            </div>
          )}
          
          {weakest && (
            <div style={styles.breakdownRow}>
              <span style={styles.breakdownLabel}>Dormant/Missing:</span>
              <span style={{ color: getElementColor(weakest.element), opacity: 0.6 }}>
                {getElementIcon(weakest.element)} {weakest.element} ({weakest.pct.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
        
        {/* Toggle Detail Button */}
        <button 
          onClick={() => setShowDetail(!showDetail)}
          style={styles.detailButton}
        >
          {showDetail ? '▼ Hide Details' : '▶ What This Means'}
        </button>
      </div>
      
      {/* Detailed Explanation (Collapsible) */}
      {showDetail && (
        <div style={styles.detailPanel}>
          {/* Your Gifts */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              ✨ Your Natural Gifts
            </div>
            <div style={styles.sectionContent}>
              {getElementGifts(dominant?.element).map((gift, i) => (
                <div key={i} style={styles.giftItem}>
                  • {gift}
                </div>
              ))}
            </div>
          </div>
          
          {/* Your Needs */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              🌟 What You Need to Thrive
            </div>
            <div style={styles.sectionContent}>
              {getElementNeeds(dominant?.element, weakest?.element).map((need, i) => (
                <div key={i} style={styles.needItem}>
                  • {need}
                </div>
              ))}
            </div>
          </div>
          
          {/* Warning Signs */}
          {weakest && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                ⚠️ Watch Out For
              </div>
              <div style={styles.sectionContent}>
                <div style={styles.warningBox}>
                  {getElementWarning(dominant?.element, weakest?.element)}
                </div>
              </div>
            </div>
          )}
          
          {/* In Partnership */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              ❤️ In Partnership, You Bring
            </div>
            <div style={styles.sectionContent}>
              {getPartnershipGifts(dominant?.element).map((gift, i) => (
                <div key={i} style={styles.partnerItem}>
                  • {gift}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* The Profound Truth */}
      <div style={styles.truthBox}>
        <div style={styles.truthIcon}>🔮</div>
        <div style={styles.truthText}>
          This isn't just math - this is <strong>your constitutional truth</strong>, 
          refined through 2000+ years of observation. Your elements were 
          determined at the moment of your birth and shaped by the cosmos itself.
        </div>
      </div>
    </div>
  );
};

// ============================================
// METAPHOR ICONS
// ============================================

function getMetaphorIcon(metaphorName) {
  const icons = {
    'The Tree': '🌳',
    'The Flame': '🔥',
    'The Mountain': '⛰️',
    'The Blade': '⚔️',
    'The River': '💧',
    'The Deep Spring': '🌊',
    'The Campfire': '🔥🌲',
    'The Forge': '🔥⚒️',
    'The Steam': '💨',
    'The Flowing Blade': '💧⚔️',
    'The Deep Spring in Metal Container': '🌊⚙️'
  };
  
  return icons[metaphorName] || '✨';
}

// ============================================
// ELEMENT INTERPRETATIONS
// ============================================

function getElementGifts(element) {
  const gifts = {
    Wood: [
      'Strategic long-term vision',
      'Patient, methodical growth',
      'Structural thinking and planning',
      'Natural leadership through wisdom',
      'Ability to see the forest AND the trees'
    ],
    Fire: [
      'Instant activation and execution',
      'Transformative energy and charisma',
      'Magnetic presence and inspiration',
      'Rapid decision-making',
      'Ability to ignite passion in others'
    ],
    Earth: [
      'Unwavering stability and reliability',
      'Nurturing support for others',
      'Practical wisdom and common sense',
      'Grounding presence in chaos',
      'Building solid foundations'
    ],
    Metal: [
      'Laser-sharp precision and focus',
      'Cutting through complexity',
      'Refined judgment and taste',
      'Clear boundaries and standards',
      'Analytical brilliance'
    ],
    Water: [
      'Supreme adaptability and flow',
      'Deep emotional intelligence',
      'Strategic patience and timing',
      'Finding hidden paths forward',
      'Wisdom from observation'
    ]
  };
  
  return gifts[element] || ['Unique constitutional gifts'];
}

function getElementNeeds(dominantElement, missingElement) {
  const needs = {
    Wood: [
      '🔥 Fire partners to activate your potential',
      '💧 Water to nourish sustained growth',
      '⛰️ Earth to ground your expansive vision'
    ],
    Fire: [
      '🌳 Wood to fuel sustainable energy',
      '⛰️ Earth to contain and focus your power',
      '💧 Water to prevent burnout'
    ],
    Earth: [
      '🔥 Fire to energize and warm',
      '⚙️ Metal to add internal structure',
      '🌳 Wood to inspire growth'
    ],
    Metal: [
      '⛰️ Earth as your source (ore)',
      '💧 Water to polish and refine',
      '🔥 Fire for tempering strength'
    ],
    Water: [
      '⚙️ Metal to provide channels',
      '🌳 Wood to give direction',
      '⛰️ Earth to create boundaries'
    ]
  };
  
  return needs[dominantElement] || ['Balance and harmony'];
}

function getElementWarning(dominantElement, missingElement) {
  if (!missingElement) return 'Stay balanced and you\'ll thrive!';
  
  const warnings = {
    Wood: {
      Fire: 'Without Fire, you\'re unlit potential - brilliant structure with no spark to activate it. Seek partnerships that bring energy!',
      Metal: 'Without Metal, growth can become chaotic. You need precision to refine your vision.',
      Earth: 'Without Earth, you lack grounding. Your growth may become unstable.',
      Water: 'Without Water, you\'ll dry up. You need nourishment for sustained growth.'
    },
    Fire: {
      Wood: 'Without Wood, you\'re unfocused energy - brilliant spark burning without purpose. You need fuel!',
      Water: 'Without Water, you risk burnout. You need cooling balance.',
      Earth: 'Without Earth, your fire lacks containment. You need grounding.',
      Metal: 'Without Metal to shape, your energy disperses. You need structure.'
    },
    Water: {
      Metal: 'Without Metal, you\'re stagnant water - deep wisdom needing direction and channels.',
      Wood: 'Without Wood, you lack purpose. You need something to nourish.',
      Earth: 'Without Earth, you lack definition. You need boundaries to shape your flow.',
      Fire: 'Without Fire, you can become too cold. You need warmth.'
    },
    Metal: {
      Earth: 'Without Earth (ore source), you lack material to work with. You need grounding.',
      Fire: 'Without Fire for tempering, you remain brittle. You need transformation.',
      Water: 'Without Water to polish, you stay rough. You need refinement.',
      Wood: 'Without Wood to cut, your precision has no purpose. You need something to shape.'
    },
    Earth: {
      Fire: 'Without Fire, you\'re dormant potential - strong foundation waiting to support. You need activation!',
      Metal: 'Without Metal structure within, you lack internal organization.',
      Water: 'Without Water, you become too dry. You need flow.',
      Wood: 'Without Wood, you lack growth energy. You need expansion.'
    }
  };
  
  return warnings[dominantElement]?.[missingElement] || 
         `Your missing ${missingElement} needs external support to thrive!`;
}

function getPartnershipGifts(element) {
  const gifts = {
    Wood: [
      'Strategic planning and long-term vision',
      'Patient guidance through growth phases',
      'Structural support like a strong tree',
      'Shade and protection for your partner'
    ],
    Fire: [
      'Instant activation and motivation',
      'Passionate energy and enthusiasm',
      'Warmth that melts resistance',
      'Transformation of stuck situations'
    ],
    Earth: [
      'Unwavering stability and support',
      'Nurturing care and practical help',
      'Grounding presence in storms',
      'Foundation for your partner to build on'
    ],
    Metal: [
      'Precision and clear analysis',
      'Refined standards and boundaries',
      'Cutting through confusion',
      'Polished execution of plans'
    ],
    Water: [
      'Adaptive intelligence to any situation',
      'Deep emotional understanding',
      'Strategic patience and timing',
      'Flowing around obstacles together'
    ]
  };
  
  return gifts[element] || ['Unique partnership strengths'];
}

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  
  mainCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '32px',
    color: '#ffffff',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
  },
  
  title: {
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '16px',
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  
  metaphorName: {
    fontSize: '32px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '24px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    lineHeight: '1.2'
  },
  
  metaphorIcon: {
    fontSize: '80px',
    textAlign: 'center',
    marginBottom: '24px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
  },
  
  nature: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '1.6',
    fontStyle: 'italic',
    opacity: 0.95
  },
  
  breakdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)'
  },
  
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '14px',
    gap: '16px'
  },
  
  breakdownLabel: {
    opacity: 0.9,
    fontWeight: '500'
  },
  
  detailButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)'
  },
  
  detailPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0'
  },
  
  section: {
    marginBottom: '24px'
  },
  
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px'
  },
  
  sectionContent: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.8'
  },
  
  giftItem: {
    marginBottom: '8px',
    paddingLeft: '8px'
  },
  
  needItem: {
    marginBottom: '8px',
    paddingLeft: '8px'
  },
  
  warningBox: {
    padding: '16px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b',
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  
  partnerItem: {
    marginBottom: '8px',
    paddingLeft: '8px'
  },
  
  truthBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    border: '2px solid #c7d2fe'
  },
  
  truthIcon: {
    fontSize: '32px',
    flexShrink: 0
  },
  
  truthText: {
    fontSize: '14px',
    color: '#4338ca',
    lineHeight: '1.7'
  }
};

export default ConstitutionalMetaphor;
