import { Page } from '@playwright/test';

/**
 * BasePage - Base class for all Page Objects
 * Provides common functionality shared across pages
 */
export class BasePage {
  readonly page: Page;
  readonly baseUrl: string = 'http://localhost:3000';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async setViewportSize(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
  }
}
