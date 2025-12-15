/**
 * ============================================
 * PILLAR CARD - The Soul of Each Pillar
 * ============================================
 * 
 * Shows:
 * - Heavenly Stem & Earthly Branch (the visible)
 * - Hidden Roots with weighted bars (the depths)
 * - Ten God relationship badge
 * - Elemental colors and icons
 */

import React from 'react';
import { getElementColor, getElementIcon } from '../../utils/baziEngine';

const PillarCard = ({ pillar, showHiddenRoots = true }) => {
  const { stem, branch, hiddenRoots, tenGod, name, chinese, ages, significance, isYou } = pillar;
  
  return (
    <div className="pillar-card" style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <span style={styles.pillarName}>{name}</span>
          {isYou && <span style={styles.youBadge}>⭐ YOU</span>}
        </div>
        <div style={styles.chinese}>{chinese}</div>
        <div style={styles.ages}>{ages}</div>
      </div>
      
      {/* Ten God Badge */}
      {tenGod && (
        <div style={styles.tenGodBadge} title={tenGod.meaning}>
          {tenGod.short}
        </div>
      )}
      
      {/* The Characters - BIG and BOLD */}
      <div style={styles.characters}>
        <div 
          style={{
            ...styles.character,
            color: getElementColor(stem.element)
          }}
          title={`${stem.english} (${stem.element})`}
        >
          {stem.char}
        </div>
        <div 
          style={{
            ...styles.character,
            color: getElementColor(branch.element)
          }}
          title={`${branch.animal} (${branch.element})`}
        >
          {branch.char}
        </div>
      </div>
      
      {/* English Translation */}
      <div style={styles.translation}>
        <div>{stem.english}</div>
        <div>{branch.animal}</div>
      </div>
      
      {/* Visible Elements */}
      <div style={styles.visibleElements}>
        <div style={styles.elementRow}>
          {getElementIcon(stem.element)} <strong>{stem.element}</strong> (Stem)
        </div>
        <div style={styles.elementRow}>
          {getElementIcon(branch.element)} <strong>{branch.element}</strong> (Branch)
        </div>
      </div>
      
      {/* HIDDEN ROOTS - The Soul's Depth */}
      {showHiddenRoots && hiddenRoots && hiddenRoots.length > 0 && (
        <div style={styles.hiddenSection}>
          <div style={styles.hiddenHeader}>
            🔮 Hidden Depths
            <span style={styles.hiddenSubtext}>
              (The "Smoothie Recipe")
            </span>
          </div>
          
          <div style={styles.hiddenRoots}>
            {hiddenRoots.map((root, index) => {
              const rootStem = stem.char === root.stem ? stem : 
                              { char: root.stem, element: getElementFromStem(root.stem) };
              const rootElement = getElementFromStem(root.stem);
              
              return (
                <div key={index} style={styles.rootRow}>
                  {/* Stem character */}
                  <div 
                    style={{
                      ...styles.rootChar,
                      color: getElementColor(rootElement)
                    }}
                  >
                    {root.stem}
                  </div>
                  
                  {/* Progress bar */}
                  <div style={styles.progressContainer}>
                    <div 
                      style={{
                        ...styles.progressBar,
                        width: `${root.pct}%`,
                        backgroundColor: getElementColor(rootElement)
                      }}
                    />
                  </div>
                  
                  {/* Percentage */}
                  <div style={styles.rootPct}>
                    {root.pct}%
                  </div>
                  
                  {/* Type badge */}
                  <div style={styles.rootType}>
                    {root.type === 'Main' ? '👑' : root.type === 'Middle' ? '⭐' : '💫'}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* What This Means */}
          <div style={styles.hiddenMeaning}>
            💡 {getHiddenRootMeaning(branch.animal, hiddenRoots)}
          </div>
        </div>
      )}
      
      {/* Significance */}
      <div style={styles.significance}>
        {significance}
      </div>
    </div>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getElementFromStem(stemChar) {
  const stemMap = {
    '甲': 'Wood', '乙': 'Wood',
    '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth',
    '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
  };
  return stemMap[stemChar] || 'Unknown';
}

function getHiddenRootMeaning(animal, roots) {
  const meanings = {
    'Rat': 'Pure Winter Water - no hidden complexity, just deep flowing wisdom',
    'Ox': 'Earth mountain storing Metal and fading Winter',
    'Tiger': 'Wood awakening with rising Fire and Earth foundation',
    'Rabbit': 'Pure Spring Wood - simple growth energy',
    'Dragon': 'Earth container with lingering Wood and stored Water',
    'Snake': 'Fire rising, creating Earth, with hidden Metal',
    'Horse': 'Blazing Fire creating ash (Earth)',
    'Goat': 'Earth storing fading Fire and hidden Wood seed',
    'Monkey': 'Metal producing Water, rooted in Earth',
    'Rooster': 'Pure Autumn Metal - sharp and precise',
    'Dog': 'Earth mountain with Autumn Metal and Fire\'s graveyard',
    'Pig': 'Water boss carrying Wood seed for next Spring'
  };
  
  return meanings[animal] || 'Complex elemental mixture';
}

// ============================================
// STYLES
// ============================================

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px', // Reduced from 24px
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0',
    minHeight: '420px', // Reduced from 500px
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Reduced from 16px
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  
  header: {
    textAlign: 'center',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '12px'
  },
  
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  
  pillarName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  youBadge: {
    fontSize: '12px',
    backgroundColor: '#ffd700',
    color: '#000',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: 'bold'
  },
  
  chinese: {
    fontSize: '13px',
    color: '#888',
    fontStyle: 'italic'
  },
  
  ages: {
    fontSize: '11px',
    color: '#999',
    marginTop: '2px'
  },
  
  tenGodBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'help'
  },
  
  characters: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px', // Reduced from 16px
    margin: '12px 0' // Reduced from 20px 0
  },
  
  character: {
    fontSize: '48px', // Reduced from 64px
    fontWeight: 'bold',
    lineHeight: '1',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    cursor: 'help',
    transition: 'transform 0.2s',
    fontFamily: '"Noto Sans SC", sans-serif'
  },
  
  translation: {
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '14px',
    color: '#555',
    fontWeight: '500',
    marginBottom: '8px'
  },
  
  visibleElements: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '13px'
  },
  
  elementRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  hiddenSection: {
    marginTop: '8px', // Reduced from 12px
    padding: '12px', // Reduced from 16px
    backgroundColor: '#f0f4ff',
    borderRadius: '8px', // Reduced from 12px
    border: '2px dashed #8b5cf6'
  },
  
  hiddenHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  hiddenSubtext: {
    fontSize: '11px',
    fontWeight: 'normal',
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  
  hiddenRoots: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  rootRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px',
    backgroundColor: '#ffffff',
    borderRadius: '6px'
  },
  
  rootChar: {
    fontSize: '20px',
    fontWeight: 'bold',
    width: '32px',
    textAlign: 'center',
    fontFamily: '"Noto Sans SC", sans-serif'
  },
  
  progressContainer: {
    flex: 1,
    height: '12px',
    backgroundColor: '#e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  
  progressBar: {
    height: '100%',
    transition: 'width 0.5s ease-out',
    borderRadius: '6px'
  },
  
  rootPct: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    width: '42px',
    textAlign: 'right'
  },
  
  rootType: {
    fontSize: '14px',
    width: '24px',
    textAlign: 'center'
  },
  
  hiddenMeaning: {
    marginTop: '12px',
    padding: '10px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#92400e',
    lineHeight: '1.5',
    fontStyle: 'italic'
  },
  
  significance: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
    fontStyle: 'italic'
  }
};

export default PillarCard;
