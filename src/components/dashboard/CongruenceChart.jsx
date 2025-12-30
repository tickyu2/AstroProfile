import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function CongruenceChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  // Count congruence levels
  const congruenceCounts = {
    'HIGH': 0,
    'MODERATE': 0,
    'LOW': 0,
    'UNKNOWN': 0
  };

  data.forEach(d => {
    if (d.congruence && d.congruence.level) {
      congruenceCounts[d.congruence.level]++;
    }
  });

  const chartData = {
    labels: Object.keys(congruenceCounts),
    datasets: [{
      label: 'Message Count',
      data: Object.values(congruenceCounts),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',  // HIGH - green
        'rgba(59, 130, 246, 0.8)',  // MODERATE - blue
        'rgba(239, 68, 68, 0.8)',   // LOW - red
        'rgba(156, 163, 175, 0.8)'  // UNKNOWN - gray
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(59, 130, 246)',
        'rgb(239, 68, 68)',
        'rgb(156, 163, 175)'
      ],
      borderWidth: 2,
      borderRadius: 8
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
          afterLabel: (context) => {
            const total = Object.values(congruenceCounts).reduce((a, b) => a + b, 0);
            const percent = ((context.parsed.y / total) * 100).toFixed(1);
            return `${percent}% of total`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12, weight: '500' }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: { size: 11 },
          stepSize: 1
        }
      }
    }
  };

  return (
    <div style={{ height: '280px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
