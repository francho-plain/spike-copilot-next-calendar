# Page Object Model (POM) Pattern

## Overview

Per **Constitution Principle II**, all E2E tests must use the **Page Object Model** pattern to:
- Encapsulate page interactions and selectors
- Improve test maintainability
- Reduce duplication
- Make tests more readable
- Create a single source of truth for UI selectors

## Structure

Each page or component that requires E2E testing should have a corresponding Page Object class in this directory.

```
tests/e2e/pages/
├── README.md (this file)
├── BasePage.ts (shared functionality)
├── CalendarPage.ts (monthly calendar page)
├── EventDetailPage.ts (event detail modal/page)
└── ...
```

## Example: BasePage.ts

```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

## Example: CalendarPage.ts

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalendarPage extends BasePage {
  readonly previousMonthButton: Locator;
  readonly nextMonthButton: Locator;
  readonly todayButton: Locator;
  readonly monthYearHeading: Locator;
  readonly calendarGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.previousMonthButton = page.getByRole('button', { name: /previous/i });
    this.nextMonthButton = page.getByRole('button', { name: /next/i });
    this.todayButton = page.getByRole('button', { name: /today/i });
    this.monthYearHeading = page.getByRole('heading', { level: 2 });
    this.calendarGrid = page.locator('table');
  }

  async goto() {
    await super.goto('/');
    await this.waitForCalendarLoad();
  }

  async waitForCalendarLoad() {
    await this.calendarGrid.waitFor({ state: 'visible' });
  }

  async goToPreviousMonth() {
    await this.previousMonthButton.click();
    await this.page.waitForTimeout(300); // Animation delay
  }

  async goToNextMonth() {
    await this.nextMonthButton.click();
    await this.page.waitForTimeout(300);
  }

  async goToToday() {
    await this.todayButton.click();
    await this.page.waitForTimeout(300);
  }

  async getMonthYear(): Promise<string> {
    return await this.monthYearHeading.textContent() || '';
  }

  async getDayButton(dayNumber: number): Promise<Locator> {
    return this.page.getByRole('button', { name: String(dayNumber), exact: true });
  }

  async clickDay(dayNumber: number) {
    const dayButton = await this.getDayButton(dayNumber);
    await dayButton.click();
  }

  async getTodayButton(): Promise<Locator | null> {
    const buttons = await this.calendarGrid.locator('button').all();
    for (const button of buttons) {
      const bgColor = await button.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      // Today has --color-today background (red: rgb(239, 68, 68))
      if (bgColor === 'rgb(239, 68, 68)') {
        return button;
      }
    }
    return null;
  }

  async getWeekHeaders(): Promise<string[]> {
    const headers = await this.calendarGrid.locator('thead th').allTextContents();
    return headers;
  }

  async getGridStructure() {
    const rows = await this.calendarGrid.locator('tbody tr').count();
    const cells = await this.calendarGrid.locator('tbody button').count();
    return { rows, cells };
  }
}
```

## Usage in Tests

```typescript
import { test, expect } from '@playwright/test';
import { CalendarPage } from './pages/CalendarPage';

test.describe('Monthly Calendar', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page);
    await calendarPage.goto();
  });

  test('should display calendar grid', async () => {
    const { rows, cells } = await calendarPage.getGridStructure();
    expect(rows).toBe(6);
    expect(cells).toBe(42);
  });

  test('should navigate to previous month', async () => {
    const initialMonth = await calendarPage.getMonthYear();
    await calendarPage.goToPreviousMonth();
    const newMonth = await calendarPage.getMonthYear();
    expect(newMonth).not.toBe(initialMonth);
  });

  test('should highlight today', async () => {
    const todayButton = await calendarPage.getTodayButton();
    expect(todayButton).not.toBeNull();
  });
});
```

## Benefits

✅ **Single Source of Truth**: Selectors defined once in Page Object
✅ **Maintainability**: UI changes only require updating Page Object
✅ **Readability**: Tests read like user actions, not technical details
✅ **Reusability**: Page Object methods shared across multiple tests
✅ **Type Safety**: TypeScript autocomplete for all page interactions

## Best Practices

1. **One Page Object per Page/Component**: Keep Page Objects focused
2. **Use Semantic Selectors**: Prefer `getByRole`, `getByLabel` over CSS selectors
3. **Encapsulate Waits**: Include necessary waits in Page Object methods
4. **Return Locators**: Let tests perform assertions on returned Locators
5. **Method Names**: Use action verbs (`click`, `fill`, `goto`, `get`)
6. **Avoid Assertions in Page Objects**: Keep assertions in test files

## References

- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Project Constitution v1.2.0 - Principle II](../../.specify/memory/constitution.md)
