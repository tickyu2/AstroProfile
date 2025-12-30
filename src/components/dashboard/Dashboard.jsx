import React, { useState, useEffect } from 'react';
import { ArchetypeTimeline } from './ArchetypeTimeline';
import { CongruenceChart } from './CongruenceChart';
import { PatternHeatmap } from './PatternHeatmap';
import { SignalRadar } from './SignalRadar';
import { ConversationStats } from './ConversationStats';
import { LiveFeed } from './LiveFeed';
import './Dashboard.css';

export function Dashboard({ conversationData = [], isLive = false }) {
  const [timeWindow, setTimeWindow] = useState('5min');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedArchetype, setSelectedArchetype] = useState('all');

  useEffect(() => {
    const filtered = filterByTimeWindow(conversationData, timeWindow);
    setFilteredData(filtered);
  }, [conversationData, timeWindow]);

  const filterByArchetype = (data) => {
    if (selectedArchetype === 'all') return data;
    return data.filter(d => d.archetype?.type === selectedArchetype);
  };

  const displayData = filterByArchetype(filteredData);

  return (
    <div className="genesis-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>GENESIS Analytics Dashboard</h1>
          <p className="subtitle">Real-time Emotional Intelligence Monitoring</p>
        </div>

        <div className="dashboard-controls">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="control-select"
          >
            <option value="1min">Last 1 Minute</option>
            <option value="5min">Last 5 Minutes</option>
            <option value="15min">Last 15 Minutes</option>
            <option value="1hour">Last Hour</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={selectedArchetype}
            onChange={(e) => setSelectedArchetype(e.target.value)}
            className="control-select"
          >
            <option value="all">All Archetypes</option>
            <option value="Seed">Seed</option>
            <option value="Mirror">Mirror</option>
            <option value="Mender">Mender</option>
            <option value="Librarian">Librarian</option>
            <option value="Conductor">Conductor</option>
            <option value="Companion">Companion</option>
            <option value="Guardian">Guardian</option>
            <option value="Flamebearer">Flamebearer</option>
            <option value="Guide">Guide</option>
          </select>

          {isLive && (
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              <span>LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Live Feed */}
        <div className="dashboard-column left-column">
          <LiveFeed data={displayData} isLive={isLive} />
        </div>

        {/* Center Column - Main Visualizations */}
        <div className="dashboard-column center-column">
          <div className="viz-section">
            <h2>Archetype Timeline</h2>
            <ArchetypeTimeline data={displayData} />
          </div>

          <div className="viz-section">
            <h2>Emotional Congruence Distribution</h2>
            <CongruenceChart data={displayData} />
          </div>

          <div className="viz-section">
            <h2>Pattern Detection Heatmap</h2>
            <PatternHeatmap data={displayData} />
          </div>
        </div>

        {/* Right Column - Stats & Current State */}
        <div className="dashboard-column right-column">
          <ConversationStats data={displayData} />

          {displayData.length > 0 && (
            <SignalRadar data={displayData[displayData.length - 1]} />
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="dashboard-footer">
        <div className="footer-stat">
          <span className="stat-label">Total Messages:</span>
          <span className="stat-value">{conversationData.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Displayed:</span>
          <span className="stat-value">{displayData.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Time Window:</span>
          <span className="stat-value">{timeWindow}</span>
        </div>
      </div>
    </div>
  );
}

function filterByTimeWindow(data, window) {
  if (window === 'all') return data;

  const now = Date.now();
  const windowMs = {
    '1min': 60 * 1000,
    '5min': 5 * 60 * 1000,
    '15min': 15 * 60 * 1000,
    '1hour': 60 * 60 * 1000
  }[window];

  return data.filter(item => (now - item.timestamp) < windowMs);
}
