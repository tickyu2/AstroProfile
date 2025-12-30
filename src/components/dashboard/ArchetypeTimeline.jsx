import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ArchetypeTimeline({ data }) {
  const archetypeColors = {
    'Seed': '#10b981',
    'Mirror': '#3b82f6',
    'Mender': '#ec4899',
    'Librarian': '#8b5cf6',
    'Conductor': '#f59e0b',
    'Companion': '#06b6d4',
    'Guardian': '#ef4444',
    'Flamebearer': '#f97316',
    'Guide': '#6366f1'
  };

  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  // Prepare chart data
  const chartData = {
    labels: data.map((d, i) => {
      const date = new Date(d.timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }),
    datasets: Object.keys(archetypeColors).map(archetype => ({
      label: archetype,
      data: data.map(d =>
        d.archetype?.type === archetype ? (d.archetype.confidence * 100) : null
      ),
      borderColor: archetypeColors[archetype],
      backgroundColor: archetypeColors[archetype] + '30',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: archetypeColors[archetype],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      spanGaps: false
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 10,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            if (context.parsed.y === null) return null;
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 10 },
          color: 'rgba(255, 255, 255, 0.6)',
          maxTicksLimit: 10
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: { size: 11 },
          callback: (value) => value + '%'
        }
      }
    }
  };

  return (
    <div style={{ height: '320px', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
