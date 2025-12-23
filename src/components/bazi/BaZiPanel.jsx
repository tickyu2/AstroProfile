/**
 * ============================================
 * BAZI PANEL - The Complete Constitutional Profile
 * ============================================
 * 
 * This is THE panel that reveals your true nature!
 * Built with SOUL using the 2000+ year proven system
 * 
 * Uses:
 * - lunar-javascript for Solar Term precision
 * - Weighted hidden roots calculation
 * - Beautiful visualization components
 */

import React, { useState, useEffect } from 'react';
import { calculateBaZi } from '../../utils/baziCalculator';
import PillarCard from './PillarCard';
import ElementalRadar from './ElementalRadar';
import ConstitutionalMetaphor from './ConstitutionalMetaphor';
import SeasonalQiTab from './SeasonalQiTab';
import ElementalBalanceMathFlaps from './ElementalBalanceMathFlaps';

const BaZiPanel = ({ birthDate, birthTime, locationData }) => {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('metaphor'); // 'metaphor', 'pillars', 'elements', 'seasonal'
  
  useEffect(() => {
    calculateChart();
  }, [birthDate, birthTime, locationData]);
  
  const calculateChart = async () => {
    setLoading(true);
    
    try {
      // Extract date/time from birthDate and birthTime
      // FIX: Use UTC methods to avoid timezone shifting the day!
      // The birth date represents the LOCAL date on the birth certificate,
      // stored as UTC midnight. Using getDate() would shift it backward in Western timezones.
      const year = birthDate.getUTCFullYear();
      const month = birthDate.getUTCMonth() + 1; // JS months are 0-indexed
      const day = birthDate.getUTCDate();

      const [hour = 12, minute = 0] = (birthTime || '12:00').split(':').map(Number);
      
      // Calculate using the TRUTH engine!
      console.log('🔮 BaZi Calculation Input:', { year, month, day, hour, minute });

      const result = calculateBaZi({
        year,
        month,
        day,
        hour,
        minute
      });

      console.log('🔮 BaZi Result - Day Pillar:', result?.dayMaster?.chinese, result?.pillars?.[2]);
      console.log('🔮 Full Result:', result);

      setChart(result);
    } catch (error) {
      console.error('BaZi calculation error:', error);
      // Set a default error state
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingSpinner}>🔮</div>
        <div style={styles.loadingText}>
          Calculating your cosmic blueprint...
          <div style={styles.loadingSubtext}>
            Consulting the stars • Respecting Solar Terms • Revealing hidden depths
          </div>
        </div>
      </div>
    );
  }
  
  if (!chart) {
    return (
      <div style={styles.error}>
        <div style={styles.errorIcon}>⚠️</div>
        <div>Unable to calculate BaZi chart. Please check your birth data.</div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          ✨ Four Pillars of Destiny (八字 BaZi)
        </h2>
        <p style={styles.subtitle}>
          Your Constitutional Blueprint - Calculated with 2000+ Year Precision
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(view === 'metaphor' ? styles.tabActive : {})
          }}
          onClick={() => setView('metaphor')}
        >
          💎 Your Essence
        </button>
        <button
          style={{
            ...styles.tab,
            ...(view === 'elements' ? styles.tabActive : {})
          }}
          onClick={() => setView('elements')}
        >
          📊 Elemental Balance
        </button>
        <button
          style={{
            ...styles.tab,
            ...(view === 'pillars' ? styles.tabActive : {})
          }}
          onClick={() => setView('pillars')}
        >
          🎋 Four Pillars
        </button>
        <button
          style={{
            ...styles.tab,
            ...(view === 'seasonal' ? styles.tabActive : {})
          }}
          onClick={() => setView('seasonal')}
        >
          🔮 Seasonal Qi
        </button>
      </div>
      
      {/* Content Area */}
      <div style={styles.content}>
        
        {/* METAPHOR VIEW - The Big Reveal */}
        {view === 'metaphor' && (
          <div style={styles.view}>
            <ConstitutionalMetaphor 
              metaphor={chart.metaphor}
              elements={chart.elements}
              dayMaster={chart.dayMaster}
            />
            
            {/* Quick Stats */}
            <div style={styles.quickStats}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Day Master</div>
                <div style={styles.statValue}>{chart.dayMaster.fullName}</div>
                <div style={styles.statSubtext}>Your Core Essence</div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Dominant Element</div>
                <div style={styles.statValue}>
                  {chart.elements.dominant} ({chart.elements.percentages[chart.elements.dominant]}%)
                </div>
                <div style={styles.statSubtext}>Your Primary Nature</div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Yin/Yang Balance</div>
                <div style={styles.statValue}>
                  {chart.yinYang.yangPercent}% Yang / {chart.yinYang.yinPercent}% Yin
                </div>
                <div style={styles.statSubtext}>{chart.yinYang.balance}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* ELEMENTS VIEW - Radar Chart */}
        {view === 'elements' && (
          <div style={styles.view}>
            <ElementalRadar 
              elements={chart.elements}
              title="Your Elemental Fingerprint (With Hidden Roots)"
              showValues={true}
              height={450}
            />
            
            {/* Element Breakdown */}
            <div style={styles.elementBreakdown}>
              <h3 style={styles.breakdownTitle}>
                🔍 Complete Element Analysis
              </h3>
              
              <div style={styles.breakdownGrid}>
                {/* Visible Elements */}
                <div style={styles.breakdownCard}>
                  <div style={styles.breakdownCardTitle}>
                    👁️ Visible Elements
                  </div>
                  <div style={styles.breakdownCardContent}>
                    {/* Show ALL 5 elements in generative cycle order */}
                    {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => {
                      const value = chart.elements.breakdown.visible[element] || 0;
                      const icon = element === 'Wood' ? '🌳' : 
                                   element === 'Fire' ? '🔥' :
                                   element === 'Earth' ? '⛰️' :
                                   element === 'Metal' ? '⚙️' : '💧';
                      return (
                        <div key={element} style={styles.breakdownRow}>
                          <span>{icon} {element}:</span>
                          <strong>{value.toFixed(2)}</strong>
                        </div>
                      );
                    })}
                  </div>
                  <div style={styles.breakdownNote}>
                    Stems + Branches at 100% each
                  </div>
                </div>
                
                {/* Hidden Elements */}
                <div style={styles.breakdownCard}>
                  <div style={styles.breakdownCardTitle}>
                    🔮 Hidden Elements
                  </div>
                  <div style={styles.breakdownCardContent}>
                    {/* Show ALL 5 elements in generative cycle order */}
                    {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => {
                      const value = chart.elements.breakdown.hidden[element] || 0;
                      const icon = element === 'Wood' ? '🌳' : 
                                   element === 'Fire' ? '🔥' :
                                   element === 'Earth' ? '⛰️' :
                                   element === 'Metal' ? '⚙️' : '💧';
                      return (
                        <div key={element} style={styles.breakdownRow}>
                          <span>{icon} {element}:</span>
                          <strong>{value.toFixed(2)}</strong>
                        </div>
                      );
                    })}
                  </div>
                  <div style={styles.breakdownNote}>
                    Weighted by percentage (60%/30%/10%)
                  </div>
                </div>
              </div>
              
              {/* The Truth Box */}
              <div style={styles.truthBox}>
                <div style={styles.truthIcon}>💡</div>
                <div style={styles.truthText}>
                  <strong>The Hidden Roots Reveal Your Depths:</strong> Your visible elements 
                  show only part of the picture. The hidden roots (地支藏干) contain weighted 
                  elemental energies that profoundly influence your constitution. This is why 
                  two people with the same "visible" profile can be completely different!
                </div>
              </div>
              
              {/* Mathematical Education - Learn How */}
              <ElementalBalanceMathFlaps 
                pillars={chart.pillars}
                chart={chart}
              />
            </div>
          </div>
        )}
        
        {/* PILLARS VIEW - All Four Pillars */}
        {view === 'pillars' && (
          <div style={styles.view}>
            <div style={styles.pillarsIntro}>
              <h3 style={styles.pillarsTitle}>
                🎋 Your Four Pillars of Destiny
              </h3>
              <p style={styles.pillarsSubtext}>
                Each pillar represents a phase of life and contains visible + hidden energies
              </p>
            </div>
            
            <div style={styles.pillarsGrid}>
              {chart.pillars.map((pillar, index) => (
                <PillarCard 
                  key={index}
                  pillar={pillar}
                  showHiddenRoots={true}
                />
              ))}
            </div>
            
            {/* Interactions Section */}
            {chart.interactions && chart.interactions.length > 0 && (
              <div style={styles.interactions}>
                <h4 style={styles.interactionsTitle}>
                  ⚡ Branch Interactions
                </h4>
                <div style={styles.interactionsList}>
                  {chart.interactions.map((interaction, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.interactionCard,
                        borderColor: interaction.color
                      }}
                    >
                      <div style={styles.interactionIcon}>
                        {interaction.icon}
                      </div>
                      <div style={styles.interactionContent}>
                        <div style={styles.interactionType}>
                          {interaction.type}
                        </div>
                        <div style={styles.interactionPillars}>
                          {interaction.branch1} ({interaction.name1}) 
                          {' '}{interaction.icon}{' '}
                          {interaction.branch2} ({interaction.name2})
                        </div>
                        <div style={styles.interactionMeaning}>
                          {interaction.meaning}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* SEASONAL QI VIEW - The Breathing Orbs! */}
        {view === 'seasonal' && (
          <div style={styles.view}>
            <SeasonalQiTab 
              elements={chart.elements}
              birthMonth={chart.pillars[1]}
              birthDate={birthDate}
            />
          </div>
        )}
        
      </div>
      
      {/* Certification Footer */}
      <div style={styles.certification}>
        <div style={styles.certBadge}>
          ✓ Industry Standard Calculation
        </div>
        <div style={styles.certDetails}>
          Powered by lunar-javascript • Solar Terms Respected • Hidden Roots Weighted
        </div>
        <div style={styles.certTimestamp}>
          Calculated: {new Date(chart.timestamp).toLocaleString()}
        </div>
      </div>
      
    </div>
  );
};

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px'
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
    overflowX: 'auto'
  },
  
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  
  tabActive: {
    color: '#7c3aed',
    borderBottomColor: '#7c3aed'
  },
  
  content: {
    minHeight: '600px'
  },
  
  view: {
    animation: 'fadeIn 0.3s ease-in'
  },
  
  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginTop: '24px'
  },
  
  statCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    textAlign: 'center'
  },
  
  statLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  },
  
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  
  statSubtext: {
    fontSize: '13px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  
  elementBreakdown: {
    marginTop: '40px'
  },
  
  breakdownTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    textAlign: 'center'
  },
  
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  
  breakdownCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    padding: '20px'
  },
  
  breakdownCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0'
  },
  
  breakdownCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px'
  },
  
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4b5563'
  },
  
  breakdownNote: {
    fontSize: '12px',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  
  truthBox: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#fef3c7',
    borderRadius: '12px',
    border: '2px solid #fbbf24'
  },
  
  truthIcon: {
    fontSize: '28px',
    flexShrink: 0
  },
  
  truthText: {
    fontSize: '14px',
    color: '#92400e',
    lineHeight: '1.7'
  },
  
  pillarsIntro: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  
  pillarsTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  
  pillarsSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // Force 4 columns
    gap: '16px', // Reduced gap
    marginBottom: '40px'
  },
  
  interactions: {
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    padding: '24px'
  },
  
  interactionsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
    textAlign: 'center'
  },
  
  interactionsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  },
  
  interactionCard: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    borderLeft: '4px solid'
  },
  
  interactionIcon: {
    fontSize: '32px',
    flexShrink: 0
  },
  
  interactionContent: {
    flex: 1
  },
  
  interactionType: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  
  interactionPillars: {
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '6px'
  },
  
  interactionMeaning: {
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  
  certification: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#f0f4ff',
    borderRadius: '12px',
    border: '2px solid #c7d2fe',
    textAlign: 'center'
  },
  
  certBadge: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4338ca',
    marginBottom: '8px'
  },
  
  certDetails: {
    fontSize: '12px',
    color: '#6366f1',
    marginBottom: '4px'
  },
  
  certTimestamp: {
    fontSize: '11px',
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px'
  },
  
  loadingSpinner: {
    fontSize: '64px',
    animation: 'spin 2s linear infinite'
  },
  
  loadingText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center'
  },
  
  loadingSubtext: {
    fontSize: '13px',
    color: '#9ca3af',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
    color: '#dc2626'
  },
  
  errorIcon: {
    fontSize: '48px'
  }
};

export default BaZiPanel;
