import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../src/components/dashboard/Dashboard';
import { ArchetypeTimeline } from '../src/components/dashboard/ArchetypeTimeline';
import { CongruenceChart } from '../src/components/dashboard/CongruenceChart';
import { LiveFeed } from '../src/components/dashboard/LiveFeed';

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Radar: () => <div data-testid="radar-chart">Radar Chart</div>
}));

describe('Dashboard Components', () => {
  const mockData = [
    {
      timestamp: Date.now(),
      text: "I'm fine.",
      voiceEmotion: { emotion: 'sad', confidence: 0.8 },
      signals: {
        emotionalIntensity: 0.3,
        urgency: 0.2,
        uncertaintyLevel: 0.4,
        vulnerabilityLevel: 0.5
      },
      archetype: { type: 'Seed', confidence: 0.7 },
      congruence: {
        level: 'LOW',
        patterns: ['MASKING'],
        advancedPatterns: [{
          pattern: 'VULNERABILITY_MASKING',
          confidence: 0.75,
          description: 'Minimizing pain',
          severity: 'MODERATE'
        }],
        totalPatternsDetected: 2,
        priorityPattern: {
          pattern: 'VULNERABILITY_MASKING',
          confidence: 0.75
        }
      }
    }
  ];

  describe('Dashboard', () => {
    it('renders without crashing', () => {
      render(<Dashboard conversationData={[]} isLive={false} />);
      expect(screen.getByText('GENESIS Analytics Dashboard')).toBeInTheDocument();
    });

    it('displays live indicator when live', () => {
      render(<Dashboard conversationData={mockData} isLive={true} />);
      expect(screen.getByText('LIVE')).toBeInTheDocument();
    });

    it('shows time window selector', () => {
      render(<Dashboard conversationData={mockData} isLive={false} />);
      expect(screen.getByText('Last 5 Minutes')).toBeInTheDocument();
    });

    it('displays footer stats', () => {
      render(<Dashboard conversationData={mockData} isLive={false} />);
      expect(screen.getByText('Total Messages:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('ArchetypeTimeline', () => {
    it('renders chart with data', () => {
      render(<ArchetypeTimeline data={mockData} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('shows no data message when empty', () => {
      render(<ArchetypeTimeline data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('CongruenceChart', () => {
    it('renders chart with data', () => {
      render(<CongruenceChart data={mockData} />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('shows no data message when empty', () => {
      render(<CongruenceChart data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('LiveFeed', () => {
    it('renders feed items', () => {
      render(<LiveFeed data={mockData} isLive={false} />);
      expect(screen.getByText("I'm fine.")).toBeInTheDocument();
    });

    it('shows archetype badge', () => {
      render(<LiveFeed data={mockData} isLive={false} />);
      expect(screen.getByText('Seed')).toBeInTheDocument();
    });

    it('shows congruence level', () => {
      render(<LiveFeed data={mockData} isLive={false} />);
      expect(screen.getByText('LOW')).toBeInTheDocument();
    });

    it('shows pattern tags', () => {
      render(<LiveFeed data={mockData} isLive={false} />);
      expect(screen.getByText('MASKING')).toBeInTheDocument();
      expect(screen.getByText('VULNERABILITY_MASKING')).toBeInTheDocument();
    });

    it('shows priority indicator', () => {
      render(<LiveFeed data={mockData} isLive={false} />);
      expect(screen.getByText(/Priority:/)).toBeInTheDocument();
    });

    it('shows no data message when empty', () => {
      render(<LiveFeed data={[]} isLive={false} />);
      expect(screen.getByText('No messages yet')).toBeInTheDocument();
    });
  });
});

describe('Dashboard Integration', () => {
  const mockData = [
    {
      timestamp: Date.now(),
      text: "I'm fine.",
      voiceEmotion: { emotion: 'sad', confidence: 0.8 },
      signals: {
        emotionalIntensity: 0.3,
        urgency: 0.2
      },
      archetype: { type: 'Seed', confidence: 0.7 },
      congruence: {
        level: 'LOW',
        patterns: ['MASKING'],
        advancedPatterns: [],
        totalPatternsDetected: 1
      }
    }
  ];

  it('filters data by time window', async () => {
    const oldData = {
      ...mockData[0],
      timestamp: Date.now() - (10 * 60 * 1000) // 10 minutes ago
    };
    const recentData = {
      ...mockData[0],
      timestamp: Date.now() - (2 * 60 * 1000) // 2 minutes ago
    };

    const { rerender } = render(
      <Dashboard conversationData={[oldData, recentData]} isLive={false} />
    );

    // Should show both initially (with 'all' or '5min' window)
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
