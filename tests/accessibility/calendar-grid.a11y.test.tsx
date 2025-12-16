import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarGrid from '@/components/calendar/CalendarGrid/CalendarGrid';
import { getMockEventsForMonth } from '@/lib/data/mockData';

describe('CalendarGrid Accessibility', () => {
  const displayMonth = new Date(2025, 11);
  const events = getMockEventsForMonth(2025, 11);

  it('should have valid ARIA roles', () => {
    const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

    const grid = container.querySelector('table');
    expect(grid).toBeInTheDocument();

    const cells = container.querySelectorAll('[role="button"]');
    cells.forEach((cell) => {
      expect(a11yUtils.hasValidAriaRole(cell as HTMLElement)).toBe(true);
    });
  });

  it('should have readable text for all day cells', () => {
    const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

    const cells = container.querySelectorAll('[role="button"]');
    cells.forEach((cell) => {
      expect(a11yUtils.hasAriaLabel(cell as HTMLElement)).toBe(true);
    });
  });

  it('should meet color contrast requirements', () => {
    const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

    const cells = container.querySelectorAll('[role="button"]');
    cells.forEach((cell) => {
      expect(a11yUtils.hasGoodContrast(cell as HTMLElement)).toBe(true);
    });
  });

  it('should have accessible month/year header', () => {
    const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

    const headers = container.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);

    headers.forEach((header) => {
      expect(header.textContent).toBeTruthy();
    });
  });

  it('should follow calendar grid expectations', () => {
    const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });
});
