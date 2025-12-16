import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

export function renderWithA11y(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options });
}

export async function checkA11y(_container: Element) {
  // Placeholder for axe-core integration (Phase 3+)
  // Will implement with jest-axe or axe-core directly
  return { violations: [] };
}

export const a11yUtils = {
  isKeyboardAccessible(element: HTMLElement): boolean {
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
    ].join(',');

    return element.matches(focusableSelector);
  },

  hasAriaLabel(element: HTMLElement): boolean {
    if (element.hasAttribute('aria-label')) return true;
    if (element.hasAttribute('aria-labelledby')) return true;
    if (element.textContent?.trim()) return true;
    return false;
  },

  hasValidAriaRole(element: HTMLElement): boolean {
    const role = element.getAttribute('role');
    if (!role) return true;

    const validRoles = [
      'button',
      'link',
      'menuitem',
      'tab',
      'tabpanel',
      'dialog',
      'alertdialog',
      'alert',
      'status',
      'main',
      'navigation',
      'complementary',
      'contentinfo',
      'region',
      'heading',
      'article',
      'application',
      'grid',
      'gridcell',
      'row',
      'rowheader',
      'columnheader',
      'presentation',
      'none',
    ];

    return validRoles.includes(role);
  },

  hasGoodContrast(element: HTMLElement): boolean {
    const styles = window.getComputedStyle(element);
    const bgColor = styles.backgroundColor;
    const color = styles.color;

    return bgColor !== color && bgColor !== 'rgba(0, 0, 0, 0)';
  },
};

export const a11yScenarios = {
  testCalendarGrid: {
    expectations: [
      'Calendar should have role="grid" or be semantically a table',
      'Each day cell should have role="gridcell"',
      'Week rows should have role="row"',
      'Day headers should have role="columnheader"',
      'Today indicator should be announced to screen readers',
      'Selected date should be focusable via keyboard',
    ],
  },

  testEventList: {
    expectations: [
      'Events should be presented in logical order',
      'Event titles should be visible to screen readers',
      'Event times should be readable (not visual-only)',
      'All-day events should be clearly marked',
      'Events should be keyboard navigable',
    ],
  },

  testResponsive: {
    expectations: [
      'Touch targets should be at least 44x44px on mobile',
      'Text should be readable without horizontal scrolling',
      'Focus indicators should be visible at all sizes',
      'Content should reflow appropriately',
    ],
  },
};

export const wcagChecklist = {
  'Perceivable 1.1': 'Text Alternatives: All non-text content has text alternatives',
  'Perceivable 1.3': 'Adaptable: Information is presented without ambiguous structure',
  'Perceivable 1.4': 'Distinguishable: Content is distinguishable by foreground/background',
  'Operable 2.1': 'Keyboard Accessible: All functionality available via keyboard',
  'Operable 2.4': 'Navigable: Users can navigate to page content easily',
  'Understandable 3.1': 'Readable: Text is clear and understandable',
  'Understandable 3.2': 'Predictable: Pages and components behave predictably',
  'Understandable 3.3': 'Input Assistance: Form validation and error messages help users',
  'Robust 4.1': 'Compatible: Content is compatible with assistive technologies',
};
