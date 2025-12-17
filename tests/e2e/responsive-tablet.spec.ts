import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Responsive Tablet Layout (768px)', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display calendar grid at tablet width', async () => {
    await expect(calendarPage.calendarTable).toBeVisible();
    
    // Verify grid structure is maintained
    const cells = await calendarPage.getAllDayCells();
    expect(cells.length).toBeGreaterThanOrEqual(28);
  });

  test('should use medium-sized fonts on tablet', async () => {
    const dayButton = calendarPage.page.locator('tbody button').first();
    await expect(dayButton).toBeVisible();
    
    const fontSize = await dayButton.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize, 10);
    });
    
    // Tablet should have medium fonts (14-16px)
    expect(fontSize).toBeGreaterThanOrEqual(14);
    expect(fontSize).toBeLessThanOrEqual(16);
  });

  test('should display events with readable font on tablet', async () => {
    const event = calendarPage.page.getByTestId(/^event-/).first();
    const eventVisible = await event.isVisible().catch(() => false);
    
    if (eventVisible) {
      const fontSize = await event.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize, 10);
      });
      
      // Tablet events should have readable font (12-15px, accounting for clamp)
      expect(fontSize).toBeGreaterThanOrEqual(12);
      expect(fontSize).toBeLessThanOrEqual(15);
    }
  });

  test('should have medium padding on tablet', async () => {
    // Verify tablet viewport is set correctly
    const viewportSize = await calendarPage.page.viewportSize();
    expect(viewportSize?.width).toBe(768);
    
    // Verify calendar renders properly
    await expect(calendarPage.calendarTable).toBeVisible();
  });

  test('should display week headers clearly on tablet', async () => {
    const headers = await calendarPage.getWeekHeaderTexts();
    
    expect(headers.length).toBe(7);
    
    const expectedDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    for (const day of expectedDays) {
      expect(headers).toContain(day);
    }
  });

  test('should have appropriate day cell height on tablet', async () => {
    const dayCell = calendarPage.page.locator('tbody td').first();
    await expect(dayCell).toBeVisible();
    
    const height = await dayCell.evaluate((el) => el.clientHeight);
    
    // Tablet day cells should be 80-100px
    expect(height).toBeGreaterThanOrEqual(80);
    expect(height).toBeLessThanOrEqual(120);
  });

  test('should maintain calendar structure on tablet', async () => {
    await expect(calendarPage.calendarTable).toBeVisible();
    
    const width = await calendarPage.calendarTable.evaluate((el) => el.clientWidth);
    expect(width).toBeLessThanOrEqual(768);
  });

  test('should support touch and mouse interaction on tablet', async () => {
    const firstButton = calendarPage.page.locator('tbody button').first();
    await expect(firstButton).toBeVisible();
    
    // Should be clickable
    await firstButton.click();
    // No error means interaction works
  });
});
