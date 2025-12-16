import { test, expect } from '@playwright/test';

test.describe('Calendar Grid Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display calendar grid with 6 rows', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBe(6);
  });

  test('should display 7 columns (days of week)', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    const cells = firstRow.locator('td');
    const cellCount = await cells.count();
    expect(cellCount).toBe(7);
  });

  test('should show week headers Mon-Sun', async ({ page }) => {
    const headers = page.locator('table thead th');
    const headerTexts = await headers.allTextContents();

    const expectedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    expectedDays.forEach((day) => {
      expect(headerTexts.join('')).toContain(day);
    });
  });

  test('should highlight today with special styling', async ({ page }) => {
    const todayButton = page.locator('[aria-current="date"]');
    await expect(todayButton).toBeVisible();
  });

  test('should have navigation buttons', async ({ page }) => {
    const prevButton = page.locator('button[aria-label="Previous month"]');
    const nextButton = page.locator('button[aria-label="Next month"]');
    const todayButton = page.locator('button[aria-label="Go to today"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(todayButton).toBeVisible();
  });

  test('should navigate to next month', async ({ page }) => {
    const monthHeader = page.locator('h2').first();
    const initialText = await monthHeader.textContent();

    const nextButton = page.locator('button[aria-label="Next month"]');
    await nextButton.click();

    await page.waitForTimeout(300);
    const updatedText = await monthHeader.textContent();

    expect(initialText).not.toBe(updatedText);
  });

  test('should navigate to previous month', async ({ page }) => {
    const monthHeader = page.locator('h2').first();
    const initialText = await monthHeader.textContent();

    const prevButton = page.locator('button[aria-label="Previous month"]');
    await prevButton.click();

    await page.waitForTimeout(300);
    const updatedText = await monthHeader.textContent();

    expect(initialText).not.toBe(updatedText);
  });

  test('should return to today on today button click', async ({ page }) => {
    const nextButton = page.locator('button[aria-label="Next month"]');
    await nextButton.click();

    const todayButton = page.locator('button[aria-label="Go to today"]');
    await todayButton.click();

    await page.waitForTimeout(300);
    const todayMarked = page.locator('[aria-current="date"]');
    await expect(todayMarked).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const table = page.locator('table');
    await expect(table).toBeVisible();

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBe(6);
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const table = page.locator('table');
    await expect(table).toBeVisible();

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBe(6);
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const table = page.locator('table');
    await expect(table).toBeVisible();

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBe(6);
  });
});
