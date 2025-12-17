import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CalendarPage - Page Object for the Monthly Calendar
 * Encapsulates all interactions with the calendar component
 */
export class CalendarPage extends BasePage {
  // Navigation elements
  readonly previousMonthButton: Locator;
  readonly nextMonthButton: Locator;
  readonly todayButton: Locator;
  
  // Calendar structure
  readonly monthYearHeading: Locator;
  readonly calendarTable: Locator;
  readonly weekHeaders: Locator;
  readonly calendarRows: Locator;
  readonly dayButtons: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.previousMonthButton = page.locator('button[aria-label="Previous month"]');
    this.nextMonthButton = page.locator('button[aria-label="Next month"]');
    this.todayButton = page.locator('button[aria-label="Go to today"]');
    
    this.monthYearHeading = page.locator('h2').first();
    this.calendarTable = page.locator('table');
    this.weekHeaders = page.locator('table thead th');
    this.calendarRows = page.locator('table tbody tr');
    this.dayButtons = page.locator('tbody button');
  }

  /**
   * Navigate to the calendar page
   */
  async goto() {
    await super.goto('/');
    await this.waitForCalendarLoad();
  }

  /**
   * Wait for calendar to be fully loaded and visible
   */
  async waitForCalendarLoad() {
    await this.calendarTable.waitFor({ state: 'visible' });
  }

  /**
   * Wait for navigation animation to complete
   */
  async waitForNavigationAnimation() {
    await this.page.waitForTimeout(300);
  }

  // ===== Navigation Methods =====

  async goToPreviousMonth() {
    await this.previousMonthButton.click();
    await this.waitForNavigationAnimation();
  }

  async goToNextMonth() {
    await this.nextMonthButton.click();
    await this.waitForNavigationAnimation();
  }

  async goToToday() {
    await this.todayButton.click();
    await this.waitForNavigationAnimation();
  }

  // ===== Query Methods =====

  async getMonthYearText(): Promise<string> {
    return await this.monthYearHeading.textContent() || '';
  }

  async getRowCount(): Promise<number> {
    return await this.calendarRows.count();
  }

  async getColumnCount(): Promise<number> {
    const firstRow = this.calendarRows.first();
    const cells = firstRow.locator('td');
    return await cells.count();
  }

  async getWeekHeaderTexts(): Promise<string[]> {
    return await this.weekHeaders.allTextContents();
  }

  async getWeekHeadersJoined(): Promise<string> {
    const headers = await this.getWeekHeaderTexts();
    return headers.join('');
  }

  /**
   * Find today's button by checking for distinctive background color
   * Returns null if today is not in the current month view
   */
  async getTodayButton(): Promise<Locator | null> {
    const buttons = await this.dayButtons.all();
    
    for (const button of buttons) {
      const bgColor = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.backgroundColor;
      });
      
      // Today has distinctive background color (not transparent or white)
      // This could be rgb(239, 68, 68) for red or other colors from CSS variables
      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgb(255, 255, 255)') {
        return button;
      }
    }
    
    return null;
  }

  /**
   * Check if today is highlighted in the current view
   */
  async isTodayHighlighted(): Promise<boolean> {
    const todayButton = await this.getTodayButton();
    return todayButton !== null;
  }

  /**
   * Get button for a specific day number
   */
  async getDayButton(dayNumber: number): Promise<Locator> {
    return this.page.getByRole('button', { name: String(dayNumber), exact: true });
  }

  /**
   * Click on a specific day
   */
  async clickDay(dayNumber: number) {
    const dayButton = await this.getDayButton(dayNumber);
    await dayButton.click();
  }

  // ===== Validation Methods =====

  async isCalendarVisible(): Promise<boolean> {
    return await this.calendarTable.isVisible();
  }

  async areNavigationButtonsVisible(): Promise<boolean> {
    const prevVisible = await this.previousMonthButton.isVisible();
    const nextVisible = await this.nextMonthButton.isVisible();
    const todayVisible = await this.todayButton.isVisible();
    
    return prevVisible && nextVisible && todayVisible;
  }

  async getDayButtonCount(): Promise<number> {
    return await this.dayButtons.count();
  }

  // ===== Viewport Methods =====

  async setMobileViewport() {
    await this.setViewportSize(375, 667);
  }

  async setTabletViewport() {
    await this.setViewportSize(768, 1024);
  }

  async setDesktopViewport() {
    await this.setViewportSize(1920, 1080);
  }
}
