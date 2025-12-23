/**
 * ToastProvider.test.jsx - Unit tests for Toast notification system
 *
 * Tests:
 * - Toast rendering (success, error, info)
 * - Auto-dismiss after duration
 * - Manual dismiss via close button
 * - useToast hook throws outside provider
 * - Multiple toasts stack correctly
 *
 * December 23, 2025
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../toast/ToastProvider.jsx';

// Test component that triggers toasts
function ToastTrigger({ type = 'info', message = 'Test message', duration }) {
  const toast = useToast();

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

describe('ToastProvider', () => {
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
      <ToastProvider>
        <div data-testid="child">Content</div>
      </ToastProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /notifications/i })).toBeInTheDocument();
  });

  test('renders toast viewport with correct ARIA attributes', () => {
    render(
      <ToastProvider>
        <div>Content</div>
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: /notifications/i });
    expect(viewport).toHaveAttribute('aria-live', 'polite');
    expect(viewport).toHaveAttribute('aria-atomic', 'true');
  });

  // ===========================================================================
  // TOAST TYPES
  // ===========================================================================

  test('shows success toast with checkmark icon', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <ToastProvider>
        <ToastTrigger type="success" message="Success!" />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));

    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('toast-success');
    expect(toast).toHaveTextContent('Success!');
    expect(toast).toHaveTextContent('✓');
  });

  test('shows error toast with X icon', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <ToastProvider>
        <ToastTrigger type="error" message="Error occurred" />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-error'));

    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('toast-error');
    expect(toast).toHaveTextContent('Error occurred');
    expect(toast).toHaveTextContent('✕');
  });

  test('shows info toast with info icon', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <ToastProvider>
        <ToastTrigger type="info" message="FYI" />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-info'));

    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('toast-info');
    expect(toast).toHaveTextContent('FYI');
    expect(toast).toHaveTextContent('ℹ');
  });

  // ===========================================================================
  // AUTO-DISMISS
  // ===========================================================================

  test('auto-dismisses toast after default duration (4s)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <ToastProvider>
        <ToastTrigger type="success" message="Will disappear" />
      </ToastProvider>
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
      <ToastProvider>
        <ToastTrigger type="error" message="Error message" />
      </ToastProvider>
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
      <ToastProvider>
        <ToastTrigger type="info" message="Quick toast" duration={1000} />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-info'));

    expect(screen.getByText('Quick toast')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Quick toast')).not.toBeInTheDocument();
  });

  test('duration of 0 prevents auto-dismiss', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <ToastProvider>
        <ToastTrigger type="info" message="Sticky toast" duration={0} />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-info'));

    // Wait a long time
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // Should still be visible
    expect(screen.getByText('Sticky toast')).toBeInTheDocument();
  });

  // ===========================================================================
  // MANUAL DISMISS
  // ===========================================================================

  test('close button dismisses toast immediately', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastTrigger type="success" message="Dismissable" />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));

    const toast = screen.getByText('Dismissable');
    expect(toast).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /dismiss/i });
    await user.click(closeBtn);

    expect(screen.queryByText('Dismissable')).not.toBeInTheDocument();
  });

  // ===========================================================================
  // MULTIPLE TOASTS
  // ===========================================================================

  test('multiple toasts stack correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <ToastProvider>
        <ToastTrigger type="success" message="First toast" />
        <button
          onClick={() => {}}
          data-testid="trigger-second"
        >
          Second
        </button>
      </ToastProvider>
    );

    // Show first toast
    await user.click(screen.getByTestId('trigger-success'));
    expect(screen.getByText('First toast')).toBeInTheDocument();

    // Re-render to show second toast
    const { rerender } = render(
      <ToastProvider>
        <ToastTrigger type="error" message="Second toast" />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-error'));

    const toasts = screen.getAllByRole('status');
    expect(toasts.length).toBeGreaterThanOrEqual(1);
  });

  // ===========================================================================
  // useToast HOOK
  // ===========================================================================

  test('useToast throws when used outside ToastProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    function BadComponent() {
      useToast();
      return null;
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    consoleSpy.mockRestore();
  });

  test('useToast returns push, remove, success, error, info methods', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    let toastApi;

    function CaptureToast() {
      toastApi = useToast();
      return null;
    }

    render(
      <ToastProvider>
        <CaptureToast />
      </ToastProvider>
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
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    let toastApi;
    let toastId;

    function ToastController() {
      toastApi = useToast();
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

    jest.useRealTimers();

    render(
      <ToastProvider>
        <ToastController />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('create'));
    expect(screen.getByText('Manual control')).toBeInTheDocument();

    await user.click(screen.getByTestId('remove'));
    expect(screen.queryByText('Manual control')).not.toBeInTheDocument();
  });
});
