/**
 * Soul Family Discovery Panel
 * Displays Soul Family matches based on elemental compatibility
 */

import React, { useState, useEffect } from 'react';
import { findSoulFamily, getConnectionTypeInfo } from '../../services/pythonFunctionsService';
import './SoulFamilyPanel.css';

const SoulFamilyPanel = ({ userId, elementalProfile, onSelectMatch }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);

  useEffect(() => {
    if (userId && elementalProfile) {
      loadSoulFamily();
    }
  }, [userId, elementalProfile]);

  const loadSoulFamily = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await findSoulFamily(userId, elementalProfile, 10);

      if (result.success) {
        setMatches(result.matches || []);
        setSearchCriteria(result.searchCriteria);
      } else if (result.mock) {
        // Mock mode - Neo4j not configured yet
        setMatches(result.matches || []);
        setSearchCriteria({ mock: true });
      } else {
        setError('Failed to load Soul Family matches');
      }
    } catch (err) {
      console.error('Soul Family error:', err);
      setError(err.message || 'Failed to connect to Soul Family service');
    } finally {
      setLoading(false);
    }
  };

  const getElementEmoji = (element) => {
    const emojis = {
      fire: '🔥',
      earth: '🌍',
      air: '💨',
      water: '🌊'
    };
    return emojis[element] || '✨';
  };

  const getSignEmoji = (sign) => {
    const emojis = {
      Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
      Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
      Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    return emojis[sign] || '⭐';
  };

  if (loading) {
    return (
      <div className="soul-family-panel loading">
        <div className="loading-spinner"></div>
        <p>Discovering your Soul Family...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="soul-family-panel error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={loadSoulFamily} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="soul-family-panel">
      <div className="panel-header">
        <h2>👥 Soul Family Discovery</h2>
        <p className="panel-subtitle">
          People whose elemental makeup complements yours
        </p>
        {searchCriteria && !searchCriteria.mock && (
          <div className="search-info">
            <span className="dominant-element">
              {getElementEmoji(searchCriteria.dominantElement)}
              Your dominant: {searchCriteria.dominantElement}
            </span>
          </div>
        )}
        {searchCriteria?.mock && (
          <div className="mock-notice">
            Demo Mode - Connect Neo4j for real matches
          </div>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="no-matches">
          <p>No Soul Family matches found yet.</p>
          <p className="hint">As more people join GENESIS, your Soul Family will grow!</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match, index) => {
            const connectionInfo = getConnectionTypeInfo(match.connectionType);

            return (
              <div
                key={match.userId || index}
                className={`match-card connection-${match.connectionType}`}
                onClick={() => onSelectMatch && onSelectMatch(match)}
              >
                <div className="match-header">
                  <span className="connection-icon">{connectionInfo.icon}</span>
                  <span
                    className="connection-type"
                    style={{ color: connectionInfo.color }}
                  >
                    {connectionInfo.label}
                  </span>
                </div>

                <div className="match-signs">
                  <div className="sign-row">
                    <span className="sign-label">Sun</span>
                    <span className="sign-value">
                      {getSignEmoji(match.sunSign)} {match.sunSign}
                    </span>
                  </div>
                  <div className="sign-row">
                    <span className="sign-label">Moon</span>
                    <span className="sign-value">
                      {getSignEmoji(match.moonSign)} {match.moonSign}
                    </span>
                  </div>
                  {match.risingSign && (
                    <div className="sign-row">
                      <span className="sign-label">Rising</span>
                      <span className="sign-value">
                        {getSignEmoji(match.risingSign)} {match.risingSign}
                      </span>
                    </div>
                  )}
                </div>

                <div className="match-element">
                  <span className="element-emoji">
                    {getElementEmoji(match.dominantElement)}
                  </span>
                  <span className="element-name">
                    {match.dominantElement?.charAt(0).toUpperCase() +
                      match.dominantElement?.slice(1)}
                  </span>
                </div>

                <div className="compatibility-score">
                  <div
                    className="score-bar"
                    style={{ width: `${match.compatibilityScore}%` }}
                  ></div>
                  <span className="score-text">
                    {match.compatibilityScore}% Compatible
                  </span>
                </div>

                <p className="connection-description">
                  {connectionInfo.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="panel-footer">
        <button onClick={loadSoulFamily} className="refresh-btn">
          🔄 Refresh Matches
        </button>
      </div>
    </div>
  );
};

export default SoulFamilyPanel;
