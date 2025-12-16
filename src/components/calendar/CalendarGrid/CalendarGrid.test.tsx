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
    it('renders week headers with Mon-Sun', () => {
      render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      weekDays.forEach((day) => {
        expect(screen.queryByText(day)).toBeInTheDocument();
      });
    });

    it('renders 42 cells (6 rows × 7 columns)', () => {
      const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

      const cells = container.querySelectorAll('[role="button"]');
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

      const days = container.querySelectorAll('[role="button"]');
      const overflowDays = Array.from(days).filter((day) => day.className.includes('overflow'));

      expect(overflowDays.length).toBeGreaterThan(0);
    });

    it('highlights today', () => {
      const today = new Date();
      const { container } = render(<CalendarGrid displayMonth={today} events={events} />);

      const todayButton = container.querySelector('button.today');
      expect(todayButton).toBeInTheDocument();
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

