/**
 * AccessibleModal.test.jsx - Unit tests for AccessibleModal component
 *
 * Tests:
 * - Modal rendering and visibility
 * - ESC key closes modal
 * - Focus trap behavior (via focus-trap-react)
 * - Focus restoration on close
 * - Backdrop click to close
 * - ARIA attributes
 *
 * December 23, 2025
 */

import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibleModal from '../AccessibleModal.jsx';

// Mock focus-trap-react for simpler testing
jest.mock('focus-trap-react', () => {
  return function MockFocusTrap({ children, focusTrapOptions }) {
    // Simulate initial focus
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

describe('AccessibleModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    labelledBy: 'modal-title',
    describedBy: 'modal-desc'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  test('renders modal when open is true', () => {
    render(
      <AccessibleModal {...defaultProps}>
        <h2 id="modal-title">Test Title</h2>
        <p id="modal-desc">Test description</p>
      </AccessibleModal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    render(
      <AccessibleModal {...defaultProps} open={false}>
        <h2>Test Title</h2>
      </AccessibleModal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ===========================================================================
  // ARIA ATTRIBUTES
  // ===========================================================================

  test('has correct ARIA attributes', () => {
    render(
      <AccessibleModal {...defaultProps}>
        <h2 id="modal-title">Title</h2>
        <p id="modal-desc">Description</p>
      </AccessibleModal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc');
  });

  test('supports aria-label alternative', () => {
    render(
      <AccessibleModal {...defaultProps} labelledBy={undefined} ariaLabel="Custom label">
        <div>Content</div>
      </AccessibleModal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Custom label');
  });

  // ===========================================================================
  // ESC KEY HANDLING
  // ===========================================================================

  test('ESC key closes modal', () => {
    const onClose = jest.fn();
    render(
      <AccessibleModal {...defaultProps} onClose={onClose}>
        <div>Content</div>
      </AccessibleModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('ESC key stops propagation', () => {
    const onClose = jest.fn();
    const outerHandler = jest.fn();

    render(
      <div onKeyDown={outerHandler}>
        <AccessibleModal {...defaultProps} onClose={onClose}>
          <div>Content</div>
        </AccessibleModal>
      </div>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
    expect(outerHandler).not.toHaveBeenCalled();
  });

  // ===========================================================================
  // BACKDROP CLICK
  // ===========================================================================

  test('clicking backdrop closes modal', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <AccessibleModal {...defaultProps} onClose={onClose}>
        <div>Content</div>
      </AccessibleModal>
    );

    // Click the backdrop (the outer container)
    const backdrop = document.querySelector('.am-backdrop');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  test('clicking modal content does not close modal', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <AccessibleModal {...defaultProps} onClose={onClose}>
        <div data-testid="modal-content">Content</div>
      </AccessibleModal>
    );

    await user.click(screen.getByTestId('modal-content'));

    expect(onClose).not.toHaveBeenCalled();
  });

  // ===========================================================================
  // FOCUS MANAGEMENT
  // ===========================================================================

  test('FocusTrap component is rendered', () => {
    render(
      <AccessibleModal {...defaultProps}>
        <div>Content</div>
      </AccessibleModal>
    );

    expect(screen.getByTestId('focus-trap')).toBeInTheDocument();
  });

  test('initialFocusRef is passed to focus trap', async () => {
    function TestComponent() {
      const inputRef = useRef(null);
      return (
        <AccessibleModal {...defaultProps} initialFocusRef={inputRef}>
          <input ref={inputRef} data-testid="focus-input" />
        </AccessibleModal>
      );
    }

    render(<TestComponent />);

    // Wait for focus to be applied
    await waitFor(() => {
      expect(screen.getByTestId('focus-input')).toHaveFocus();
    }, { timeout: 100 });
  });

  // ===========================================================================
  // FOCUS RESTORATION
  // ===========================================================================

  test('restores focus to previous element on close', async () => {
    const { rerender } = render(
      <>
        <button data-testid="trigger">Trigger</button>
        <AccessibleModal {...defaultProps} open={false}>
          <div>Content</div>
        </AccessibleModal>
      </>
    );

    // Focus the trigger button
    const trigger = screen.getByTestId('trigger');
    trigger.focus();
    expect(trigger).toHaveFocus();

    // Open modal
    rerender(
      <>
        <button data-testid="trigger">Trigger</button>
        <AccessibleModal {...defaultProps} open={true}>
          <div>Content</div>
        </AccessibleModal>
      </>
    );

    // Close modal
    rerender(
      <>
        <button data-testid="trigger">Trigger</button>
        <AccessibleModal {...defaultProps} open={false}>
          <div>Content</div>
        </AccessibleModal>
      </>
    );

    // Focus should be restored
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
