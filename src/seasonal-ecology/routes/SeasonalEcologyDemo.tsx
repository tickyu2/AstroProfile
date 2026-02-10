/**
 * Seasonal Ecology Demo Page
 * Example integration of all seasonal-ecology components
 */

import React, { useState } from 'react';
import { SeasonRings } from '../components/SeasonRings';
import { TaurusZoomStrip } from '../components/TaurusZoomStrip';
import { SeasonLegend } from '../components/SeasonLegend';
import { HighlightExplanation } from '../components/HighlightExplanation';
import { TaurusDecanOverlay } from '../components/TaurusDecanOverlay';
import ScienceNote from '../components/ScienceNote';
import { toRingLayoutWithHighlight } from '../transformers/seasonalEcologyTransformers';
import { getSignProfile } from '../data/allZodiacSigns';

export function SeasonalEcologyDemo() {
  const [currentSign, setCurrentSign] = useState('Taurus');
  const [currentDegree, setCurrentDegree] = useState(22.49);

  const layout = toRingLayoutWithHighlight(currentSign, currentDegree);
  const signProfile = getSignProfile(currentSign);

  const handleDegreeChange = (newDegree: number) => {
    setCurrentDegree(newDegree);
  };

  const handleWheelSelect = (sign: string, degree: number) => {
    setCurrentSign(sign);
    setCurrentDegree(degree);
  };

  return (
    <div className="seasonal-ecology-demo" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      padding: '40px 20px',
      color: '#e0e0e0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          color: '#6496ff',
          marginBottom: '40px',
          fontSize: '2em'
        }}>
          Seasonal Ecological Psychology Engine
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px'
        }}>
          {/* Left Column - Wheel */}
          <div>
            <SeasonRings
              layout={layout}
              highlightSign={currentSign}
              highlightDegree={currentDegree}
              onSelectDegree={handleWheelSelect}
            />

            <SeasonLegend />
          </div>

          {/* Right Column - Details */}
          <div>
            {signProfile && (
              <HighlightExplanation
                sign={currentSign}
                degree={currentDegree}
                season={signProfile.panel.season.name}
                modality={signProfile.panel.modality.name}
                element={signProfile.panel.element.name}
              />
            )}

            {currentSign === 'Taurus' && (
              <>
                <TaurusZoomStrip
                  degree={currentDegree}
                  onDegreeChange={handleDegreeChange}
                />
                <TaurusDecanOverlay degree={currentDegree} />
              </>
            )}

            <ScienceNote title="Seasonal Psychology">
              <p>
                The Seasonal Ecological Psychology Engine treats astrology as environmental
                imprinting, not prediction. Your birth season encodes a psychological imprint
                shaped by light exposure, temperature, and biological rhythms.
              </p>
              <ul>
                <li><strong>Season Ring:</strong> Environmental imprint from birth season</li>
                <li><strong>Modality Ring:</strong> Circadian momentum style (morning/evening type)</li>
                <li><strong>Element Ring:</strong> Constitutional temperament</li>
              </ul>
              <p className="emphasis">
                This is descriptive psychology, not fortune-telling.
              </p>
            </ScienceNote>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonalEcologyDemo;
