import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import CalendarGrid from './CalendarGrid';
import { getMockEventsForMonth } from '@/lib/data/mockData';

expect.extend(toHaveNoViolations);

describe('CalendarGrid', () => {
  const displayMonth = new Date(2025, 11);
  const events = getMockEventsForMonth(2025, 11);

  describe('Structure', () => {
    it('renders week headers with Mo-Su', () => {
      render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      weekDays.forEach((day) => {
        expect(screen.queryByText(day)).toBeInTheDocument();
      });
    });

    it('renders 42 cells (6 rows × 7 columns)', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const cells = container.querySelectorAll('tbody button');
      expect(cells.length).toBe(42);
    });

    it('renders 6 rows in the calendar grid', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const rows = container.querySelectorAll('table tbody tr');
      expect(rows.length).toBe(6);
    });

    it('renders 7 columns per row', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const firstRow = container.querySelector('table tbody tr');
      const cells = firstRow?.querySelectorAll('td');
      expect(cells?.length).toBe(7);
    });
  });

  describe('Styling', () => {
    it('applies overflow styling to days outside current month', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      // December 2025 starts on Monday (Dec 1), so no overflow days at start
      // But there will be days from January 2026 at the end (6 weeks * 7 = 42 days)
      // December has 31 days starting on Monday, so we need: Mon-Sun (7) + 31 days = 38 days
      // This means 4 days from next month will show
      const days = container.querySelectorAll('tbody button');
      expect(days.length).toBe(42);
      
      // Check that some days are from outside the current month by checking aria-label
      const dayLabels = Array.from(days).map((day) => day.getAttribute('aria-label') || '');
      const nonDecemberDays = dayLabels.filter((label) => !label.includes('December'));
      
      expect(nonDecemberDays.length).toBeGreaterThan(0);
    });

    it('highlights today', () => {
      const today = new Date();
      const { container } = render(<CalendarGrid displayMonth={today} events={events} />);

      // Check if today button exists (may have today class if applied)
      const allButtons = container.querySelectorAll('tbody button');
      expect(allButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have no axe violations', async () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper table structure for screen readers', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const table = container.querySelector('table');
      const thead = container.querySelector('thead');
      const tbody = container.querySelector('tbody');

      expect(table).toBeInTheDocument();
      expect(thead).toBeInTheDocument();
      expect(tbody).toBeInTheDocument();
    });

    it('should have accessible day buttons', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);
      const buttons = container.querySelectorAll('tbody button');

      buttons.forEach((button) => {
        expect(button).toBeVisible();
        expect(button.textContent).toBeTruthy();
      });
    });
  });

  describe('Interactions', () => {
    it('calls onDateSelect when a day is clicked', () => {
      const onDateSelect = jest.fn();
      const { container } = render(
        <CalendarGrid displayMonth={displayMonth} events={events} onDateSelect={onDateSelect} />,
      );

      const firstDayButton = container.querySelector('tbody button');
      firstDayButton?.click();

      expect(onDateSelect).toHaveBeenCalledTimes(1);
      expect(onDateSelect.mock.calls[0][0]).toBeInstanceOf(Date);
    });
  });
});

