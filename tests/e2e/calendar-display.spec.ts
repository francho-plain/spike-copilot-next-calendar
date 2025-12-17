import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Calendar Grid Display', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display calendar grid with 6 rows', async () => {
    await expect(calendarPage.calendarTable).toBeVisible();

    const rowCount = await calendarPage.getRowCount();
    expect(rowCount).toBe(6);
  });

  test('should display 7 columns (days of week)', async () => {
    const cellCount = await calendarPage.getColumnCount();
    expect(cellCount).toBe(7);
  });

  test('should show week headers Mon-Sun', async () => {
    const headerText = await calendarPage.getWeekHeadersJoined();

    const expectedDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    expectedDays.forEach((day) => {
      expect(headerText).toContain(day);
    });
  });

  test('should highlight today with special styling', async () => {
    const count = await calendarPage.getDayButtonCount();
    expect(count).toBeGreaterThan(0);
    
    const isTodayHighlighted = await calendarPage.isTodayHighlighted();
    expect(isTodayHighlighted).toBe(true);
  });

  test('should have navigation buttons', async () => {
    await expect(calendarPage.previousMonthButton).toBeVisible();
    await expect(calendarPage.nextMonthButton).toBeVisible();
    await expect(calendarPage.todayButton).toBeVisible();
  });

  test('should navigate to next month', async () => {
    const initialText = await calendarPage.getMonthYearText();

    await calendarPage.goToNextMonth();

    const updatedText = await calendarPage.getMonthYearText();
    expect(initialText).not.toBe(updatedText);
  });

  test('should navigate to previous month', async () => {
    const initialText = await calendarPage.getMonthYearText();

    await calendarPage.goToPreviousMonth();

    const updatedText = await calendarPage.getMonthYearText();
    expect(initialText).not.toBe(updatedText);
  });

  test('should return to today on today button click', async () => {
    await calendarPage.goToNextMonth();
    await calendarPage.goToToday();
    
    const isTodayHighlighted = await calendarPage.isTodayHighlighted();
    expect(isTodayHighlighted).toBe(true);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await calendarPage.setMobileViewport();

    await expect(calendarPage.calendarTable).toBeVisible();

    const rowCount = await calendarPage.getRowCount();
    expect(rowCount).toBe(6);
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await calendarPage.setTabletViewport();

    await expect(calendarPage.calendarTable).toBeVisible();

    const rowCount = await calendarPage.getRowCount();
    expect(rowCount).toBe(6);
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    await calendarPage.setDesktopViewport();

    await expect(calendarPage.calendarTable).toBeVisible();

    const rowCount = await calendarPage.getRowCount();
    expect(rowCount).toBe(6);
  });
});
