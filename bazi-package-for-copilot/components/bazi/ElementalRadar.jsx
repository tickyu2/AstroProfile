/**
 * ============================================
 * ELEMENTAL RADAR - Your Constitutional Fingerprint
 * ============================================
 * 
 * Shows element percentages as a radar chart
 * Can overlay two charts for compatibility!
 */

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { getElementColor, getElementIcon } from '../../utils/baziEngine';

const ElementalRadar = ({ 
  elements, 
  title = "Your Elemental Balance",
  comparisonElements = null,
  comparisonName = "Partner",
  showValues = true,
  height = 400
}) => {
  
  // Prepare data for radar chart
  const elementOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  
  const data = elementOrder.map(element => {
    const yourPct = parseFloat(elements.percentages[element] || 0);
    const partnerPct = comparisonElements ? 
      parseFloat(comparisonElements.percentages[element] || 0) : 0;
    
    return {
      element: `${getElementIcon(element)} ${element}`,
      elementName: element,
      you: yourPct,
      partner: partnerPct,
      fullMark: 50 // Max scale for radar
    };
  });
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    
    const elementName = payload[0].payload.elementName;
    const elementColor = getElementColor(elementName);
    
    return (
      <div style={styles.tooltip}>
        <div style={{ ...styles.tooltipTitle, borderColor: elementColor }}>
          {getElementIcon(elementName)} {elementName}
        </div>
        {payload.map((entry, index) => (
          <div key={index} style={styles.tooltipRow}>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <strong>{entry.value.toFixed(1)}%</strong>
          </div>
        ))}
        <div style={styles.tooltipMeaning}>
          {getElementMeaning(elementName)}
        </div>
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      {/* Title */}
      <div style={styles.title}>{title}</div>
      
      {/* Radar Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="element" 
            tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 50]}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          
          {/* Your data */}
          <Radar
            name="You"
            dataKey="you"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={comparisonElements ? 0.3 : 0.6}
            strokeWidth={2}
          />
          
          {/* Partner data (if comparing) */}
          {comparisonElements && (
            <Radar
              name={comparisonName}
              dataKey="partner"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Values Table (optional) */}
      {showValues && (
        <div style={styles.valuesTable}>
          {elementOrder.map(element => {
            const yourPct = parseFloat(elements.percentages[element] || 0);
            const partnerPct = comparisonElements ? 
              parseFloat(comparisonElements.percentages[element] || 0) : null;
            
            return (
              <div key={element} style={styles.valueRow}>
                <div style={styles.valueElement}>
                  {getElementIcon(element)} {element}
                </div>
                <div style={styles.valueBar}>
                  <div 
                    style={{
                      ...styles.valueBarFill,
                      width: `${(yourPct / 50) * 100}%`,
                      backgroundColor: getElementColor(element)
                    }}
                  />
                  {partnerPct !== null && (
                    <div 
                      style={{
                        ...styles.valueBarFillPartner,
                        width: `${(partnerPct / 50) * 100}%`
                      }}
                    />
                  )}
                </div>
                <div style={styles.valuePct}>
                  {yourPct.toFixed(1)}%
                  {partnerPct !== null && (
                    <span style={styles.valuePctPartner}>
                      / {partnerPct.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Interpretation */}
      {elements.strengths && elements.strengths.length > 0 && (
        <div style={styles.interpretation}>
          <div style={styles.interpretTitle}>🎯 Your Dominant Elements:</div>
          <div style={styles.interpretContent}>
            {elements.strengths.map((strength, index) => (
              <span key={index} style={styles.strengthBadge}>
                {getElementIcon(strength.element)} {strength.element} ({strength.pct.toFixed(1)}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getElementMeaning(element) {
  const meanings = {
    Wood: 'Growth, creativity, expansion, strategic vision',
    Fire: 'Energy, passion, transformation, charisma',
    Earth: 'Stability, nurturing, grounding, support',
    Metal: 'Precision, structure, refinement, clarity',
    Water: 'Adaptability, wisdom, flow, emotional depth'
  };
  return meanings[element] || '';
}

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0'
  },
  
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: '24px'
  },
  
  tooltip: {
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  
  tooltipTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    paddingBottom: '6px',
    borderBottom: '2px solid',
    color: '#374151'
  },
  
  tooltipRow: {
    fontSize: '13px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '4px',
    color: '#6b7280'
  },
  
  tooltipMeaning: {
    fontSize: '11px',
    marginTop: '8px',
    padding: '6px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  
  valuesTable: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  valueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  valueElement: {
    width: '100px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  
  valueBar: {
    flex: 1,
    height: '24px',
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative'
  },
  
  valueBarFill: {
    height: '100%',
    transition: 'width 0.5s ease-out',
    borderRadius: '12px'
  },
  
  valueBarFillPartner: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#f59e0b',
    opacity: 0.3,
    borderRadius: '12px',
    transition: 'width 0.5s ease-out'
  },
  
  valuePct: {
    width: '80px',
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  
  valuePctPartner: {
    fontSize: '12px',
    color: '#9ca3af',
    marginLeft: '4px'
  },
  
  interpretation: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f0f4ff',
    borderRadius: '12px',
    border: '2px solid #c7d2fe'
  },
  
  interpretTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: '8px'
  },
  
  interpretContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  
  strengthBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4338ca',
    border: '1px solid #c7d2fe'
  }
};

export default ElementalRadar;
