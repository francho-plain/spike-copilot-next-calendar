import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarGrid from '@/components/calendar/CalendarGrid/CalendarGrid';
import { getMockEventsForMonth } from '@/lib/data/mockData';

describe('CalendarGrid', () => {
  const displayMonth = new Date(2025, 11);
  const events = getMockEventsForMonth(2025, 11);

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

  it('applies overflow styling to days outside current month', () => {
    const { container } = render(<CalendarGrid displayMonth={displayMonth} events={events} />);

    const days = container.querySelectorAll('[role="button"]');
    const overflowDays = Array.from(days).filter((day) => day.className.includes('overflow'));

    expect(overflowDays.length).toBeGreaterThan(0);
  });
});
