/**
 * AccessibleConfirmationDialog.test.jsx - Unit tests for AccessibleConfirmationDialog
 *
 * Tests:
 * - Dialog rendering and visibility
 * - Reason validation when required
 * - Form submission with success
 * - Form submission with error
 * - Loading state
 * - State reset on reopen
 *
 * December 23, 2025
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibleConfirmationDialog from '../AccessibleConfirmationDialog.jsx';
import { QueuedToastProvider } from '../toast/QueuedToastProvider.jsx';

// Mock focus-trap-react
jest.mock('focus-trap-react', () => {
  return function MockFocusTrap({ children, focusTrapOptions }) {
    React.useEffect(() => {
      if (focusTrapOptions?.initialFocus) {
        const element = focusTrapOptions.initialFocus();
        if (element) {
          setTimeout(() => element.focus(), 10);
        }
      }
    }, [focusTrapOptions]);
    return <div data-testid="focus-trap">{children}</div>;
  };
});

// Helper to render with toast provider
function renderWithProvider(ui) {
  return render(
    <QueuedToastProvider>
      {ui}
    </QueuedToastProvider>
  );
}

describe('AccessibleConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    description: 'Are you sure?',
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  test('renders dialog when open is true', () => {
    renderWithProvider(<AccessibleConfirmationDialog {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    renderWithProvider(<AccessibleConfirmationDialog {...defaultProps} open={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('uses custom button labels', () => {
    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        confirmLabel="Delete"
        cancelLabel="Never mind"
      />
    );

    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Never mind/i })).toBeInTheDocument();
  });

  // ===========================================================================
  // REASON INPUT
  // ===========================================================================

  test('shows reason textarea when requireReason is true', () => {
    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} requireReason={true} />
    );

    expect(screen.getByPlaceholderText(/Enter a short reason/i)).toBeInTheDocument();
    expect(screen.getByText(/Reason for audit/i)).toBeInTheDocument();
  });

  test('does not show reason textarea when requireReason is false', () => {
    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} requireReason={false} />
    );

    expect(screen.queryByPlaceholderText(/Enter a short reason/i)).not.toBeInTheDocument();
  });

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  test('shows error when reason is empty and required', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        requireReason={true}
        onConfirm={onConfirm}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });

    // Button should be disabled when reason is empty
    expect(submitBtn).toBeDisabled();

    // Type a short reason (less than 3 chars)
    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    await user.type(textarea, 'ab');

    // Button should still be disabled
    expect(submitBtn).toBeDisabled();

    // Submit should fail
    await user.click(submitBtn);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('enables button when reason meets minimum length', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} requireReason={true} />
    );

    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    const submitBtn = screen.getByRole('button', { name: /Confirm/i });

    // Initially disabled
    expect(submitBtn).toBeDisabled();

    // Type valid reason
    await user.type(textarea, 'Valid reason text');

    // Button should be enabled
    expect(submitBtn).not.toBeDisabled();
  });

  // ===========================================================================
  // FORM SUBMISSION
  // ===========================================================================

  test('calls onConfirm with reason when submitted', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(undefined);

    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        requireReason={true}
        onConfirm={onConfirm}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    await user.type(textarea, 'Test reason');

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith('Test reason');
    });
  });

  test('calls onConfirm with null when reason not required', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(undefined);

    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        requireReason={false}
        onConfirm={onConfirm}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(null);
    });
  });

  test('shows error message on submission failure', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockRejectedValue(new Error('Network error'));

    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        requireReason={true}
        onConfirm={onConfirm}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    await user.type(textarea, 'Valid reason');

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  // ===========================================================================
  // LOADING STATE
  // ===========================================================================

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();

    // Create a promise that we can resolve manually
    let resolvePromise;
    const onConfirm = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolvePromise = resolve;
      });
    });

    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        requireReason={true}
        onConfirm={onConfirm}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    await user.type(textarea, 'Valid reason');

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });
    await user.click(submitBtn);

    // Button should show loading state
    expect(screen.getByRole('button', { name: /Processing/i })).toBeDisabled();

    // Textarea should be disabled
    expect(textarea).toBeDisabled();

    // Resolve the promise
    resolvePromise();
  });

  test('respects external loading prop', () => {
    renderWithProvider(
      <AccessibleConfirmationDialog
        {...defaultProps}
        loading={true}
      />
    );

    expect(screen.getByRole('button', { name: /Processing/i })).toBeDisabled();
  });

  // ===========================================================================
  // CANCEL AND CLOSE
  // ===========================================================================

  test('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} onCancel={onCancel} />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelBtn);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when close button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} onCancel={onCancel} />
    );

    const closeBtn = screen.getByRole('button', { name: /Close/i });
    await user.click(closeBtn);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('ESC key closes dialog', () => {
    const onCancel = jest.fn();

    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} onCancel={onCancel} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onCancel).toHaveBeenCalled();
  });

  // ===========================================================================
  // STATE RESET
  // ===========================================================================

  test('resets state when dialog reopens', async () => {
    const user = userEvent.setup();

    const { rerender } = renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} requireReason={true} />
    );

    // Type something
    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    await user.type(textarea, 'Some reason');

    // Close dialog
    rerender(
      <QueuedToastProvider>
        <AccessibleConfirmationDialog {...defaultProps} requireReason={true} open={false} />
      </QueuedToastProvider>
    );

    // Reopen dialog
    rerender(
      <QueuedToastProvider>
        <AccessibleConfirmationDialog {...defaultProps} requireReason={true} open={true} />
      </QueuedToastProvider>
    );

    // Textarea should be empty
    const newTextarea = screen.getByPlaceholderText(/Enter a short reason/i);
    expect(newTextarea.value).toBe('');
  });

  // ===========================================================================
  // ACCESSIBILITY
  // ===========================================================================

  test('has correct ARIA attributes', () => {
    renderWithProvider(<AccessibleConfirmationDialog {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-desc');

    expect(screen.getByText('Confirm Action')).toHaveAttribute('id', 'confirm-dialog-title');
    expect(screen.getByText('Are you sure?')).toHaveAttribute('id', 'confirm-dialog-desc');
  });

  test('textarea has aria-required when reason is required', () => {
    renderWithProvider(
      <AccessibleConfirmationDialog {...defaultProps} requireReason={true} />
    );

    const textarea = screen.getByPlaceholderText(/Enter a short reason/i);
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });
});
