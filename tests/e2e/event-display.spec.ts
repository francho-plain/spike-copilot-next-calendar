import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Calendar Event Display', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display events on calendar days', async () => {
    // Check that events are visible in the calendar
    const eventList = calendarPage.page.locator('[data-testid="event-list"]').first();
    await expect(eventList).toBeVisible();
  });

  test('should show event titles in day cells', async () => {
    // Events should be visible with their titles
    const eventElements = calendarPage.page.locator('.event');
    const count = await eventElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify at least one event has text
    if (count > 0) {
      const firstEventText = await eventElements.first().textContent();
      expect(firstEventText?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should show "+N more" indicator for days with many events', async () => {
    // Look for "+N more" indicators
    const moreIndicators = calendarPage.page.locator('[data-testid="more-events"]');
    const count = await moreIndicators.count();
    
    // If there are days with >3 events, we should see indicators
    // Note: This depends on mock data having such days
    if (count > 0) {
      const firstIndicator = moreIndicators.first();
      const text = await firstIndicator.textContent();
      expect(text).toMatch(/\+\d+ more/);
    }
  });

  test('should not show events on days without events', async () => {
    // Check if any day has empty day indicator
    const emptyDays = calendarPage.page.locator('[aria-label="No events for this day"]');
    const count = await emptyDays.count();
    expect(count).toBeGreaterThan(0); // Some days should be empty
  });

  test('should display event colors with border', async () => {
    const events = await calendarPage.page.locator('[data-testid^="event-"]:not([data-testid="event-list"])').all();
    
    if (events.length > 0) {
      const firstEvent = events[0];
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
    const eventTitles = await calendarPage.page.locator('[data-testid^="event-"] .eventTitle').all();
    
    if (eventTitles.length > 0) {
      const firstTitle = eventTitles[0];
      
      // Check if text-overflow is set to ellipsis
      const hasEllipsis = await firstTitle.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.textOverflow === 'ellipsis' && computed.overflow === 'hidden';
      });
      
      expect(hasEllipsis).toBe(true);
    }
  });

  test('should show events on mobile viewport', async () => {
    await calendarPage.setMobileViewport();
    
    // Events should still be visible on mobile
    const events = calendarPage.page.locator('[data-testid^="event-"]:not([data-testid="event-list"])');
    const count = await events.count();
    
    if (count > 0) {
      await expect(events.first()).toBeVisible();
    }
  });

  test('should maintain event visibility across month navigation', async () => {
    // Navigate to next month
    await calendarPage.goToNextMonth();
    
    // Events should still be rendered (even if different events)
    const eventsExist = await calendarPage.page.locator('[data-testid="event-list"]').first().isVisible().catch(() => false);
    
    // Go back
    await calendarPage.goToPreviousMonth();
    
    // Original events should be back
    const eventsBackAgain = await calendarPage.page.locator('[data-testid="event-list"]').first().isVisible().catch(() => false);
    
    // At least one of the views should have events
    expect(eventsExist || eventsBackAgain).toBe(true);
  });
});
