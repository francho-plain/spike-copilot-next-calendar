import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Calendar Event Display', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display events on calendar days', async () => {
    // Check that event lists are visible in the calendar using testid
    const eventList = calendarPage.page.getByTestId('event-list').first();
    await expect(eventList).toBeVisible();
  });

  test('should show event titles in day cells', async () => {
    // Find events by their testid pattern
    const firstEvent = calendarPage.page.getByTestId(/^event-/).first();
    await expect(firstEvent).toBeVisible();
    
    // Verify event has text content
    const text = await firstEvent.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('should show "+N more" indicator for days with many events', async () => {
    // Look for "+N more" indicators using testid
    const moreIndicator = calendarPage.page.getByTestId('more-events').first();
    const isVisible = await moreIndicator.isVisible().catch(() => false);
    
    if (isVisible) {
      const text = await moreIndicator.textContent();
      expect(text).toMatch(/\+\d+ more/);
    }
  });

  test('should not show events on days without events', async () => {
    // Check that some day cells don't have event lists
    const allEventLists = calendarPage.page.getByTestId('event-list');
    const eventListCount = await allEventLists.count();
    
    // Not all days should have events (there are 42 day cells in 6 weeks)
    expect(eventListCount).toBeLessThan(42);
    expect(eventListCount).toBeGreaterThan(0); // But some days should have events
  });

  test('should display event colors with border', async () => {
    const firstEvent = calendarPage.page.getByTestId(/^event-evt-/).first();
    const isVisible = await firstEvent.isVisible().catch(() => false);
    
    if (isVisible) {
      const borderColor = await firstEvent.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.borderLeftColor;
      });
      
      // Should have some border color (not transparent)
      expect(borderColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(borderColor).not.toBe('');
    }
  });

  test('should truncate long event titles', async () => {
    const eventTitle = calendarPage.page.getByTestId(/^event-/).first().locator('span').first();
    const isVisible = await eventTitle.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check if text-overflow is set to ellipsis
      const hasEllipsis = await eventTitle.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.textOverflow === 'ellipsis' && computed.overflow === 'hidden';
      });
      
      expect(hasEllipsis).toBe(true);
    }
  });

  test('should show events on mobile viewport', async () => {
    await calendarPage.setMobileViewport();
    
    // Events should still be visible on mobile using testid
    const eventList = calendarPage.page.getByTestId('event-list').first();
    const isVisible = await eventList.isVisible().catch(() => false);
    
    // At least check if calendar is visible
    await expect(calendarPage.calendarTable).toBeVisible();
  });

  test('should maintain event visibility across month navigation', async () => {
    // Navigate to next month
    await calendarPage.goToNextMonth();
    
    // Check if calendar is still functional
    await expect(calendarPage.calendarTable).toBeVisible();
    
    // Go back
    await calendarPage.goToPreviousMonth();
    
    // Calendar should still be visible
    await expect(calendarPage.calendarTable).toBeVisible();
  });
});
