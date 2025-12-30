import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import './SignalRadar.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function SignalRadar({ data }) {
  if (!data || !data.signals) {
    return (
      <div className="signal-radar">
        <h3>Current Signal Strength</h3>
        <div className="no-data">No signal data available</div>
      </div>
    );
  }

  // Select key signals to display (8 signals for clean radar)
  const keySignals = [
    'emotionalIntensity',
    'urgency',
    'uncertaintyLevel',
    'vulnerabilityLevel',
    'socialEngagement',
    'cognitiveComplexity',
    'sentimentPolarity',
    'selfFocus'
  ];

  const chartData = {
    labels: keySignals.map(s => formatLabel(s)),
    datasets: [{
      label: 'Signal Strength',
      data: keySignals.map(signal => {
        const value = data.signals[signal];
        if (value === undefined) return 0;
        // Convert to 0-100 scale, handle negative sentimentPolarity
        if (signal === 'sentimentPolarity') {
          return ((value + 1) / 2) * 100; // Convert from [-1,1] to [0,100]
        }
        return value * 100;
      }),
      backgroundColor: 'rgba(59, 130, 246, 0.25)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)',
      pointHoverRadius: 6
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.r.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 25,
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.5)',
          font: { size: 10 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          circular: true
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.15)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="signal-radar">
      <h3>Current Signal Strength</h3>
      <div style={{ height: '300px', position: 'relative' }}>
        <Radar data={chartData} options={options} />
      </div>
      <div className="signal-timestamp">
        Last updated: {new Date(data.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

function formatLabel(signal) {
  // Convert camelCase to readable text
  return signal
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
