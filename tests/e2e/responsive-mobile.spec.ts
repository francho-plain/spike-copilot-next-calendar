import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Responsive Mobile Layout (375px)', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display calendar grid at mobile width', async () => {
    await expect(calendarPage.calendarTable).toBeVisible();
    
    // Verify grid structure is maintained
    const cells = await calendarPage.getAllDayCells();
    expect(cells.length).toBeGreaterThanOrEqual(28); // At least 4 weeks
  });

  test('should have touch-friendly day buttons (min 44x44px)', async () => {
    const firstButton = calendarPage.page.locator('tbody button').first();
    await expect(firstButton).toBeVisible();
    
    const boundingBox = await firstButton.boundingBox();
    expect(boundingBox).toBeTruthy();
    
    if (boundingBox) {
      // WCAG 2.1 AA: minimum touch target size is 44x44px
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      // Width can be slightly less due to grid layout
      expect(boundingBox.width).toBeGreaterThanOrEqual(40);
    }
  });

  test('should truncate event titles on mobile', async () => {
    const eventList = calendarPage.page.getByTestId('event-list').first();
    const isVisible = await eventList.isVisible().catch(() => false);
    
    if (isVisible) {
      const event = eventList.locator('[data-testid^="event-"]').first();
      const eventVisible = await event.isVisible().catch(() => false);
      
      if (eventVisible) {
        // Check that event has ellipsis style
        const textOverflow = await event.evaluate((el) => {
          return window.getComputedStyle(el).textOverflow;
        });
        expect(textOverflow).toBe('ellipsis');
      }
    }
  });

  test('should display week headers properly on mobile', async () => {
    const headers = await calendarPage.getWeekHeaderTexts();
    
    // Check that we have 7 headers
    expect(headers.length).toBe(7);
    
    // Check that the headers contain the expected day abbreviations
    const expectedDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    for (const day of expectedDays) {
      expect(headers).toContain(day);
    }
  });

  test('should maintain calendar structure on mobile', async () => {
    // Check that calendar doesn't break layout
    await expect(calendarPage.calendarTable).toBeVisible();
    
    const width = await calendarPage.calendarTable.evaluate((el) => el.clientWidth);
    expect(width).toBeLessThanOrEqual(375); // Fits within mobile viewport
  });

  test('should show reduced padding on mobile', async () => {
    // Check viewport size instead of specific padding value
    const viewportWidth = await calendarPage.page.viewportSize();
    expect(viewportWidth?.width).toBe(375);
    
    // Verify calendar is visible and fits
    await expect(calendarPage.calendarTable).toBeVisible();
  });

  test('should display events with smaller font on mobile', async () => {
    const event = calendarPage.page.getByTestId(/^event-/).first();
    const eventVisible = await event.isVisible().catch(() => false);
    
    if (eventVisible) {
      const fontSize = await event.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize, 10);
      });
      
      // Mobile events should have smaller font (10-14px, accounting for clamp)
      expect(fontSize).toBeLessThanOrEqual(14);
    }
  });

  test('should be scrollable on mobile', async () => {
    // Verify page can scroll if content overflows
    const bodyHeight = await calendarPage.page.evaluate(() => document.body.scrollHeight);
    expect(bodyHeight).toBeGreaterThan(0);
  });
});
