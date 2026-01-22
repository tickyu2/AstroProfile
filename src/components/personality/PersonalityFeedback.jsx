/**
 * ============================================
 * PersonalityFeedback Component (P3.2)
 * ============================================
 *
 * User feedback collection for Luna's personality predictions.
 * Enables continuous learning through user validation and adjustment.
 *
 * Features:
 * - Overall accuracy rating (1-10 scale)
 * - Per-facet adjustment sliders
 * - Domain-level feedback
 * - Quality feedback for training data
 *
 * Created: January 8, 2026
 * For: GENESIS AI Soul Partner System - P3 Training Pipeline
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { NEO_FACETS, FACET_ORDER, DOMAIN_ORDER } from '../../data/neoFacetSchema';

// Domain display names
const DOMAIN_NAMES = {
  N: 'Neuroticism',
  E: 'Extraversion',
  O: 'Openness',
  A: 'Agreeableness',
  C: 'Conscientiousness'
};

// Domain colors for visual grouping
const DOMAIN_COLORS = {
  N: '#ef4444',  // Red
  E: '#f59e0b',  // Amber
  O: '#8b5cf6',  // Purple
  A: '#10b981',  // Emerald
  C: '#3b82f6'   // Blue
};

/**
 * Single facet adjustment slider
 */
function FacetSlider({ facet, calculatedValue, adjustedValue, onAdjust, compact }) {
  const [isHovered, setIsHovered] = useState(false);

  const domainColor = DOMAIN_COLORS[facet.domain] || '#6b7280';
  const hasAdjustment = adjustedValue !== null && adjustedValue !== calculatedValue;

  return (
    <div
      className={`facet-slider ${compact ? 'compact' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: compact ? '4px 8px' : '8px 12px',
        borderRadius: '6px',
        backgroundColor: isHovered ? 'rgba(0,0,0,0.05)' : 'transparent',
        transition: 'background-color 0.2s'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px'
      }}>
        <span style={{
          fontSize: compact ? '12px' : '14px',
          fontWeight: '500',
          color: domainColor
        }}>
          {facet.code}: {facet.name}
        </span>
        <span style={{
          fontSize: '12px',
          color: hasAdjustment ? '#059669' : '#6b7280'
        }}>
          {Math.round((adjustedValue ?? calculatedValue) * 100)}%
          {hasAdjustment && ' (adjusted)'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Calculated value marker */}
        <div style={{
          position: 'relative',
          flex: 1,
          height: '20px'
        }}>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((adjustedValue ?? calculatedValue) * 100)}
            onChange={(e) => onAdjust(parseInt(e.target.value) / 100)}
            style={{
              width: '100%',
              accentColor: domainColor,
              cursor: 'pointer'
            }}
          />
          {/* Original value indicator */}
          {hasAdjustment && (
            <div style={{
              position: 'absolute',
              left: `${calculatedValue * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '12px',
              backgroundColor: '#9ca3af',
              borderRadius: '2px',
              pointerEvents: 'none'
            }} />
          )}
        </div>

        {/* Reset button */}
        {hasAdjustment && (
          <button
            onClick={() => onAdjust(calculatedValue)}
            style={{
              padding: '2px 6px',
              fontSize: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

FacetSlider.propTypes = {
  facet: PropTypes.object.isRequired,
  calculatedValue: PropTypes.number.isRequired,
  adjustedValue: PropTypes.number,
  onAdjust: PropTypes.func.isRequired,
  compact: PropTypes.bool
};

/**
 * Domain section with collapsible facets
 */
function DomainSection({ domain, facets, calculatedFacets, adjustedFacets, onAdjust }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const domainFacets = facets.filter(f => f.domain === domain);
  const domainColor = DOMAIN_COLORS[domain];

  // Calculate domain average
  const startIdx = DOMAIN_ORDER.indexOf(domain) * 6;
  const domainValues = calculatedFacets.slice(startIdx, startIdx + 6);
  const avgValue = domainValues.reduce((a, b) => a + b, 0) / 6;

  // Check if any facets in this domain were adjusted
  const hasAdjustments = domainFacets.some((f, i) =>
    adjustedFacets[FACET_ORDER.indexOf(f.code)] !== null
  );

  return (
    <div style={{
      marginBottom: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Domain header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: `${domainColor}10`,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontWeight: '600',
          color: domainColor
        }}>
          {DOMAIN_NAMES[domain]}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {Math.round(avgValue * 100)}%
          </span>
          {hasAdjustments && (
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              backgroundColor: '#059669',
              color: 'white',
              borderRadius: '4px'
            }}>
              Adjusted
            </span>
          )}
          <span style={{
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </div>
      </button>

      {/* Facets (collapsible) */}
      {isExpanded && (
        <div style={{ padding: '8px' }}>
          {domainFacets.map((facet) => {
            const idx = FACET_ORDER.indexOf(facet.code);
            return (
              <FacetSlider
                key={facet.code}
                facet={facet}
                calculatedValue={calculatedFacets[idx]}
                adjustedValue={adjustedFacets[idx]}
                onAdjust={(val) => onAdjust(idx, val)}
                compact
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

DomainSection.propTypes = {
  domain: PropTypes.string.isRequired,
  facets: PropTypes.array.isRequired,
  calculatedFacets: PropTypes.array.isRequired,
  adjustedFacets: PropTypes.array.isRequired,
  onAdjust: PropTypes.func.isRequired
};

/**
 * Main Personality Feedback Component
 */
export function PersonalityFeedback({
  calculatedFacets,
  constitutionalData,
  userId,
  onSubmit,
  onCancel
}) {
  // State
  const [overallRating, setOverallRating] = useState(7);
  const [adjustedFacets, setAdjustedFacets] = useState(
    new Array(30).fill(null)  // null = not adjusted
  );
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get facet definitions
  const facets = FACET_ORDER.map(code => NEO_FACETS[code]);

  // Handle facet adjustment
  const handleAdjust = useCallback((facetIndex, value) => {
    setAdjustedFacets(prev => {
      const next = [...prev];
      next[facetIndex] = value;
      return next;
    });
  }, []);

  // Reset all adjustments
  const handleResetAll = useCallback(() => {
    setAdjustedFacets(new Array(30).fill(null));
  }, []);

  // Submit feedback
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Build final facets array (use adjusted or calculated)
      const finalFacets = calculatedFacets.map((calc, i) =>
        adjustedFacets[i] !== null ? adjustedFacets[i] : calc
      );

      const feedback = {
        user_id: userId,
        input: constitutionalData,
        calculated_facets: calculatedFacets,
        adjusted_facets: finalFacets,
        rating: overallRating,
        comment: comment,
        timestamp: new Date().toISOString(),
        adjustments_made: adjustedFacets.filter(a => a !== null).length
      };

      if (onSubmit) {
        await onSubmit(feedback);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Count adjustments
  const adjustmentCount = adjustedFacets.filter(a => a !== null).length;

  if (submitted) {
    return (
      <div style={{
        padding: '32px',
        textAlign: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h3 style={{ color: '#059669', marginBottom: '8px' }}>Thank You!</h3>
        <p style={{ color: '#6b7280' }}>
          Your feedback helps Luna understand you better.
          {overallRating >= 8 && ' Your data will be used to improve AI for everyone.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, marginBottom: '8px' }}>
          How Accurate Is This Analysis?
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Help Luna learn by rating and adjusting your personality profile.
        </p>
      </div>

      {/* Overall Rating */}
      <div style={{
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <label style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          Overall Accuracy: {overallRating}/10
        </label>

        <input
          type="range"
          min="1"
          max="10"
          value={overallRating}
          onChange={(e) => setOverallRating(parseInt(e.target.value))}
          style={{
            width: '100%',
            accentColor: overallRating >= 7 ? '#059669' : overallRating >= 4 ? '#f59e0b' : '#ef4444'
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '4px'
        }}>
          <span>Not accurate</span>
          <span>Very accurate</span>
        </div>

        {overallRating >= 8 && (
          <p style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#d1fae5',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#065f46'
          }}>
            Your high-quality feedback may be used to improve Luna for everyone!
          </p>
        )}
      </div>

      {/* Domain Sections */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Fine-Tune Facets</h3>
          {adjustmentCount > 0 && (
            <button
              onClick={handleResetAll}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Reset All ({adjustmentCount})
            </button>
          )}
        </div>

        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
          Click each domain to expand and adjust individual facets.
        </p>

        {DOMAIN_ORDER.map(domain => (
          <DomainSection
            key={domain}
            domain={domain}
            facets={facets}
            calculatedFacets={calculatedFacets}
            adjustedFacets={adjustedFacets}
            onAdjust={handleAdjust}
          />
        ))}
      </div>

      {/* Optional Comment */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontWeight: '500',
          marginBottom: '8px',
          fontSize: '14px'
        }}>
          Additional Comments (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did Luna get right or wrong about your personality?"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            resize: 'vertical',
            minHeight: '80px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '10px 24px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#7c3aed',
            color: 'white',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
}

PersonalityFeedback.propTypes = {
  calculatedFacets: PropTypes.arrayOf(PropTypes.number).isRequired,
  constitutionalData: PropTypes.object.isRequired,
  userId: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

export default PersonalityFeedback;
