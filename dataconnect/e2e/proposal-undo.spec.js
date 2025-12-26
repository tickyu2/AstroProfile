/**
 * proposal-undo.spec.js - Playwright E2E test for Admin proposals undo flow
 *
 * Tests:
 * - Opens a proposal
 * - Opens the confirmation dialog
 * - Fills reason
 * - Confirms undo
 * - Asserts API call and toast notification
 *
 * December 23, 2025
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/admin/proposals';

test.describe('Admin proposals - undo promotion', () => {
  test('opens dialog, fills reason, confirms, and calls rollback API + shows toast', async ({ page }) => {
    // Intercept the rollback API and capture the request body
    let rollbackRequestBody = null;
    await page.route('**/api/admin/consolidation/rollback', async (route) => {
      const request = route.request();
      const postData = await request.postData();
      try {
        rollbackRequestBody = postData ? JSON.parse(postData) : null;
      } catch {
        rollbackRequestBody = postData;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, revertId: 999 })
      });
    });

    // Also intercept Firebase callable function pattern
    await page.route('**/revertConsolidation', async (route) => {
      const request = route.request();
      const postData = await request.postData();
      try {
        rollbackRequestBody = postData ? JSON.parse(postData) : null;
      } catch {
        rollbackRequestBody = postData;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: { ok: true, revertId: 999 } })
      });
    });

    // Go to the proposals admin page
    await page.goto(BASE_URL);

    // Wait for proposals list to load
    await page.waitForSelector('.list-item', { timeout: 10000 });

    // Click the first proposal to open detail
    const firstItem = page.locator('.list-item').first();
    await firstItem.click();

    // Try to click the detail "Undo Promotion" button; fallback to inline "Undo"
    const undoPromotionBtn = page.locator('button', { hasText: 'Undo Promotion' }).first();
    const inlineUndoBtn = firstItem.locator('button', { hasText: 'Undo' });

    if (await undoPromotionBtn.isVisible()) {
      await undoPromotionBtn.click();
    } else if (await inlineUndoBtn.isVisible()) {
      await inlineUndoBtn.click();
    } else {
      // If no undo button is visible, the proposal might be pending (not approved)
      // Switch to approved filter to find an undoable proposal
      const statusSelect = page.locator('.status-select');
      if (await statusSelect.isVisible()) {
        await statusSelect.selectOption('approved');
        await page.waitForTimeout(500);

        const approvedItem = page.locator('.list-item').first();
        await approvedItem.click();

        const undoBtn = page.locator('button', { hasText: /Undo/i }).first();
        await expect(undoBtn).toBeVisible({ timeout: 5000 });
        await undoBtn.click();
      }
    }

    // Wait for the confirmation dialog textarea
    const reasonTextarea = page.locator('textarea[placeholder*="reason" i], textarea#confirm-reason').first();
    await expect(reasonTextarea).toBeVisible({ timeout: 5000 });

    // Fill the reason and confirm
    const reasonText = 'Test undo via E2E';
    await reasonTextarea.fill(reasonText);

    const confirmButton = page.locator('button', { hasText: /Undo|Confirm/i }).filter({ hasText: /^(?!Cancel)/ }).first();
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    // Small wait to ensure route handler ran
    await page.waitForTimeout(500);

    // Assertions on intercepted request
    expect(rollbackRequestBody).not.toBeNull();

    // Check for reason in request (may be nested in data for Firebase callable)
    const hasReason =
      rollbackRequestBody?.reason === reasonText ||
      rollbackRequestBody?.data?.reason === reasonText;
    expect(hasReason).toBeTruthy();

    // Check for LTM or promotion log IDs
    const hasLtm =
      (Array.isArray(rollbackRequestBody?.ltmIds) && rollbackRequestBody.ltmIds.length > 0) ||
      (Array.isArray(rollbackRequestBody?.data?.ltmIds) && rollbackRequestBody.data.ltmIds.length > 0);
    const hasPromo =
      (Array.isArray(rollbackRequestBody?.promotionLogIds) && rollbackRequestBody.promotionLogIds.length > 0) ||
      (Array.isArray(rollbackRequestBody?.data?.promotionLogIds) && rollbackRequestBody.data.promotionLogIds.length > 0);
    expect(hasLtm || hasPromo).toBeTruthy();

    // Assert toast appears
    const toastLocator = page.locator('.toast, .toast-body, .toast-viewport').filter({ hasText: /Undo.*success|success/i });
    await expect(toastLocator.first()).toBeVisible({ timeout: 5000 });
  });

  test('ESC key closes confirmation dialog', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.list-item', { timeout: 10000 });

    // Switch to approved to find undoable proposal
    const statusSelect = page.locator('.status-select');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('approved');
      await page.waitForTimeout(500);
    }

    const firstItem = page.locator('.list-item').first();
    await firstItem.click();

    const undoBtn = page.locator('button', { hasText: /Undo/i }).first();
    if (await undoBtn.isVisible()) {
      await undoBtn.click();

      // Dialog should be visible
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Press ESC
      await page.keyboard.press('Escape');

      // Dialog should be closed
      await expect(dialog).not.toBeVisible();
    }
  });

  test('cancel button closes confirmation dialog', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.list-item', { timeout: 10000 });

    // Switch to approved to find undoable proposal
    const statusSelect = page.locator('.status-select');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('approved');
      await page.waitForTimeout(500);
    }

    const firstItem = page.locator('.list-item').first();
    await firstItem.click();

    const undoBtn = page.locator('button', { hasText: /Undo/i }).first();
    if (await undoBtn.isVisible()) {
      await undoBtn.click();

      // Dialog should be visible
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Click cancel
      const cancelBtn = page.locator('button', { hasText: /Cancel/i });
      await cancelBtn.click();

      // Dialog should be closed
      await expect(dialog).not.toBeVisible();
    }
  });

  test('confirm button is disabled until reason is provided', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.list-item', { timeout: 10000 });

    // Switch to approved to find undoable proposal
    const statusSelect = page.locator('.status-select');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('approved');
      await page.waitForTimeout(500);
    }

    const firstItem = page.locator('.list-item').first();
    await firstItem.click();

    const undoBtn = page.locator('button', { hasText: /Undo/i }).first();
    if (await undoBtn.isVisible()) {
      await undoBtn.click();

      // Dialog should be visible
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Confirm button should be disabled initially
      const confirmBtn = dialog.locator('button', { hasText: /Undo|Confirm/i }).filter({ hasText: /^(?!Cancel)/ }).first();
      await expect(confirmBtn).toBeDisabled();

      // Type a short reason (less than 3 chars)
      const textarea = page.locator('textarea').first();
      await textarea.fill('ab');
      await expect(confirmBtn).toBeDisabled();

      // Type a valid reason
      await textarea.fill('Valid reason for undo');
      await expect(confirmBtn).toBeEnabled();
    }
  });
});
