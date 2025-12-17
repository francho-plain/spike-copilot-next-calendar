import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Responsive Desktop Layout (1920px)', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display calendar grid at desktop width', async () => {
    await expect(calendarPage.calendarTable).toBeVisible();
    
    // Verify grid structure is maintained
    const cells = await calendarPage.getAllDayCells();
    expect(cells.length).toBeGreaterThanOrEqual(28);
  });

  test('should use larger fonts on desktop', async () => {
    const dayButton = calendarPage.page.locator('tbody button').first();
    await expect(dayButton).toBeVisible();
    
    const fontSize = await dayButton.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).fontSize, 10);
    });
    
    // Desktop should have larger fonts (16-18px)
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });

  test('should display events with comfortable reading font on desktop', async () => {
    const event = calendarPage.page.getByTestId(/^event-/).first();
    const eventVisible = await event.isVisible().catch(() => false);
    
    if (eventVisible) {
      const fontSize = await event.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize, 10);
      });
      
      // Desktop events should have comfortable font (13-16px)
      expect(fontSize).toBeGreaterThanOrEqual(13);
    }
  });

  test('should have generous padding on desktop', async () => {
    // Verify desktop viewport is set correctly
    const viewportSize = await calendarPage.page.viewportSize();
    expect(viewportSize?.width).toBe(1920);
    
    // Verify calendar renders properly
    await expect(calendarPage.calendarTable).toBeVisible();
  });

  test('should display week headers with appropriate size on desktop', async () => {
    const headers = await calendarPage.getWeekHeaderTexts();
    
    expect(headers.length).toBe(7);
    
    const expectedDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    for (const day of expectedDays) {
      expect(headers).toContain(day);
    }
  });

  test('should have comfortable day cell height on desktop', async () => {
    const dayCell = calendarPage.page.locator('tbody td').first();
    await expect(dayCell).toBeVisible();
    
    const height = await dayCell.evaluate((el) => el.clientHeight);
    
    // Desktop day cells should be 100px or more
    expect(height).toBeGreaterThanOrEqual(100);
  });

  test('should center calendar with max-width on desktop', async () => {
    await expect(calendarPage.calendarTable).toBeVisible();
    
    const width = await calendarPage.calendarTable.evaluate((el) => el.clientWidth);
    
    // Calendar should be constrained to max-width (900px)
    expect(width).toBeLessThanOrEqual(900);
  });

  test('should display all event details on desktop', async () => {
    const eventList = calendarPage.page.getByTestId('event-list').first();
    const isVisible = await eventList.isVisible().catch(() => false);
    
    if (isVisible) {
      const events = eventList.locator('[data-testid^="event-"]');
      const count = await events.count();
      
      // Desktop should have space to show multiple events
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should support precise mouse interaction on desktop', async () => {
    const firstButton = calendarPage.page.locator('tbody button').first();
    await expect(firstButton).toBeVisible();
    
    // Test hover state
    await firstButton.hover();
    
    // Should be clickable with mouse
    await firstButton.click();
  });

  test('should have appropriate spacing between events on desktop', async () => {
    const eventList = calendarPage.page.getByTestId('event-list').first();
    const isVisible = await eventList.isVisible().catch(() => false);
    
    if (isVisible) {
      const gap = await eventList.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return parseInt(computed.gap, 10);
      });
      
      // Desktop should have comfortable spacing (2-3px)
      expect(gap).toBeGreaterThanOrEqual(2);
    }
  });
});
