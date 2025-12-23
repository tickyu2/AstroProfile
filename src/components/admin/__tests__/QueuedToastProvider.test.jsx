/**
 * QueuedToastProvider.test.jsx - Unit tests for QueuedToastProvider
 *
 * Tests:
 * - Toast rendering (success, error, info)
 * - Auto-dismiss after duration
 * - Manual dismiss via close button
 * - Queued screen reader announcements
 * - useQueuedToast hook validation
 *
 * December 23, 2025
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueuedToastProvider, useQueuedToast } from '../toast/QueuedToastProvider.jsx';

// Test component that triggers toasts
function ToastTrigger({ type = 'info', message = 'Test message', duration }) {
  const toast = useQueuedToast();

  return (
    <div>
      <button
        onClick={() => toast[type](message, duration)}
        data-testid={`trigger-${type}`}
      >
        Show {type}
      </button>
      <button
        onClick={() => toast.push({ message, type, duration })}
        data-testid="trigger-push"
      >
        Push
      </button>
    </div>
  );
}

describe('QueuedToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ===========================================================================
  // BASIC RENDERING
  // ===========================================================================

  test('renders children without toasts initially', () => {
    render(
      <QueuedToastProvider>
        <div data-testid="child">Content</div>
      </QueuedToastProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(document.querySelector('.toast-viewport')).toBeInTheDocument();
  });

  // ===========================================================================
  // TOAST TYPES
  // ===========================================================================

  test('shows success toast with checkmark icon', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="success" message="Success!" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));

    const toast = document.querySelector('.toast-success');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Success!');
    expect(toast).toHaveTextContent('✓');
  });

  test('shows error toast with X icon', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="error" message="Error occurred" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-error'));

    const toast = document.querySelector('.toast-error');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Error occurred');
    expect(toast).toHaveTextContent('✕');
  });

  test('shows info toast with info icon', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="info" message="FYI" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-info'));

    const toast = document.querySelector('.toast-info');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('FYI');
    expect(toast).toHaveTextContent('ℹ');
  });

  // ===========================================================================
  // AUTO-DISMISS
  // ===========================================================================

  test('auto-dismisses toast after default duration (4s)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="success" message="Will disappear" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));
    expect(screen.getByText('Will disappear')).toBeInTheDocument();

    // Advance time by 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Will disappear')).not.toBeInTheDocument();
  });

  test('error toast has longer default duration (6s)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="error" message="Error message" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-error'));

    // After 4 seconds, should still be visible
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByText('Error message')).toBeInTheDocument();

    // After 6 seconds total, should be gone
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
  });

  test('custom duration is respected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="info" message="Quick toast" duration={1000} />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-info'));
    expect(screen.getByText('Quick toast')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Quick toast')).not.toBeInTheDocument();
  });

  // ===========================================================================
  // MANUAL DISMISS
  // ===========================================================================

  test('close button dismisses toast immediately', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();

    render(
      <QueuedToastProvider>
        <ToastTrigger type="success" message="Dismissable" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));

    const toast = screen.getByText('Dismissable');
    expect(toast).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /dismiss/i });
    await user.click(closeBtn);

    expect(screen.queryByText('Dismissable')).not.toBeInTheDocument();
  });

  // ===========================================================================
  // SCREEN READER LIVE REGION
  // ===========================================================================

  test('announces message in ARIA live region', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <QueuedToastProvider>
        <ToastTrigger type="success" message="Announcement test" />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));

    // Check the live region contains the message
    const liveRegion = document.querySelector('.sr-live');
    expect(liveRegion).toHaveTextContent('Announcement test');
  });

  test('live region has correct ARIA attributes', () => {
    render(
      <QueuedToastProvider>
        <div>Content</div>
      </QueuedToastProvider>
    );

    const liveRegion = document.querySelector('.sr-live');
    expect(liveRegion).toHaveAttribute('role', 'status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  test('announces messages sequentially', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    function MultiTrigger() {
      const toast = useQueuedToast();
      return (
        <button
          onClick={() => {
            toast.success('First');
            toast.success('Second');
          }}
          data-testid="multi-trigger"
        >
          Push Multiple
        </button>
      );
    }

    render(
      <QueuedToastProvider>
        <MultiTrigger />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('multi-trigger'));

    const liveRegion = document.querySelector('.sr-live');

    // First announcement
    expect(liveRegion).toHaveTextContent('First');

    // Advance time for announcement to clear and next to appear
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(liveRegion).toHaveTextContent('Second');
  });

  // ===========================================================================
  // useQueuedToast HOOK
  // ===========================================================================

  test('useQueuedToast throws when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    function BadComponent() {
      useQueuedToast();
      return null;
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useQueuedToast must be used within a QueuedToastProvider'
    );

    consoleSpy.mockRestore();
  });

  test('useQueuedToast returns all expected methods', () => {
    let toastApi;

    function CaptureToast() {
      toastApi = useQueuedToast();
      return null;
    }

    render(
      <QueuedToastProvider>
        <CaptureToast />
      </QueuedToastProvider>
    );

    expect(toastApi).toHaveProperty('push');
    expect(toastApi).toHaveProperty('remove');
    expect(toastApi).toHaveProperty('success');
    expect(toastApi).toHaveProperty('error');
    expect(toastApi).toHaveProperty('info');

    expect(typeof toastApi.push).toBe('function');
    expect(typeof toastApi.remove).toBe('function');
    expect(typeof toastApi.success).toBe('function');
    expect(typeof toastApi.error).toBe('function');
    expect(typeof toastApi.info).toBe('function');
  });

  test('push returns toast ID for manual removal', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    let toastApi;
    let toastId;

    function ToastController() {
      toastApi = useQueuedToast();
      return (
        <div>
          <button
            onClick={() => {
              toastId = toastApi.push({ message: 'Manual control', type: 'info', duration: 0 });
            }}
            data-testid="create"
          >
            Create
          </button>
          <button
            onClick={() => toastApi.remove(toastId)}
            data-testid="remove"
          >
            Remove
          </button>
        </div>
      );
    }

    render(
      <QueuedToastProvider>
        <ToastController />
      </QueuedToastProvider>
    );

    await user.click(screen.getByTestId('create'));
    expect(screen.getByText('Manual control')).toBeInTheDocument();

    await user.click(screen.getByTestId('remove'));
    expect(screen.queryByText('Manual control')).not.toBeInTheDocument();
  });
});
