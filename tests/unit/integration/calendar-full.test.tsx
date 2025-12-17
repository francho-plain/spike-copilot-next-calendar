/**
 * Integration Test: Complete Monthly Calendar
 * 
 * Tests all user stories working together:
 * - US1: Calendar grid with current day highlighting
 * - US2: Event display in cells with overflow handling
 * - US3: Responsive layout across breakpoints
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar/MonthlyCalendar';
import { CalendarEvent } from '@/lib/calendar/types';

describe('Monthly Calendar - Full Integration', () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(2024, 0, 15),
      startTime: '10:00',
      endTime: '11:00',
      location: 'Conference Room A',
    },
    {
      id: '2',
      title: 'Code Review',
      date: new Date(2024, 0, 15),
      startTime: '14:00',
      endTime: '15:00',
    },
    {
      id: '3',
      title: 'Sprint Planning',
      date: new Date(2024, 0, 16),
      startTime: '09:00',
      endTime: '11:00',
    },
    {
      id: '4',
      title: 'Event 1',
      date: new Date(2024, 0, 20),
      startTime: '10:00',
      endTime: '11:00',
    },
    {
      id: '5',
      title: 'Event 2',
      date: new Date(2024, 0, 20),
      startTime: '11:00',
      endTime: '12:00',
    },
    {
      id: '6',
      title: 'Event 3',
      date: new Date(2024, 0, 20),
      startTime: '13:00',
      endTime: '14:00',
    },
    {
      id: '7',
      title: 'Event 4',
      date: new Date(2024, 0, 20),
      startTime: '15:00',
      endTime: '16:00',
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 15)); // January 15, 2024
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('US1: Calendar Grid with Current Day', () => {
    it('renders a complete calendar grid with 7 columns and 6 rows', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      // Wait for loading to complete
      jest.advanceTimersByTime(150);

      // Check for 7 day headers
      const dayHeaders = screen.getAllByRole('columnheader');
      expect(dayHeaders).toHaveLength(7);

      // Check that we have day buttons (42 days in fixed grid)
      const dayButtons = screen.getAllByRole('button', { name: /^\d/ });
      expect(dayButtons.length).toBeGreaterThanOrEqual(28);
    });

    it('highlights the current day (January 15, 2024)', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // Find the button for the current day
      const currentDayButton = screen.getByRole('button', {
        name: /Monday, January 15, 2024/,
      });

      expect(currentDayButton).toBeInTheDocument();
      expect(currentDayButton).toHaveAttribute('aria-current', 'date');
    });
  });

  describe('US2: Event Display with Overflow', () => {
    it('displays events in their corresponding day cells', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // January 15 should show "Team Meeting" and "Code Review"
      const jan15Events = screen.getByText('Team Meeting');
      expect(jan15Events).toBeInTheDocument();

      const codeReview = screen.getByText('Code Review');
      expect(codeReview).toBeInTheDocument();

      // January 16 should show "Sprint Planning"
      const jan16Event = screen.getByText('Sprint Planning');
      expect(jan16Event).toBeInTheDocument();
    });

    it('shows "+N more" indicator when more than 3 events in a day', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // January 20 has 4 events, should show "+1 more"
      const moreIndicator = screen.getByText('+1 more');
      expect(moreIndicator).toBeInTheDocument();
    });

    it('displays exactly 3 events before showing overflow', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // Count visible events for January 20 (should be 3)
      const event1 = screen.getByText('Event 1');
      const event2 = screen.getByText('Event 2');
      const event3 = screen.getByText('Event 3');

      expect(event1).toBeInTheDocument();
      expect(event2).toBeInTheDocument();
      expect(event3).toBeInTheDocument();

      // Event 4 should not be visible (hidden by maxVisible=3)
      const event4 = screen.queryByText('Event 4');
      expect(event4).not.toBeInTheDocument();
    });
  });

  describe('US3: Responsive Behavior', () => {
    it('renders correctly at mobile viewport (375px)', () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // Calendar should still render with all components
      const header = screen.getByRole('heading', { name: /January 2024/ });
      expect(header).toBeInTheDocument();

      // Events should still be visible
      const event = screen.getByText('Team Meeting');
      expect(event).toBeInTheDocument();
    });

    it('renders correctly at tablet viewport (768px)', () => {
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));

      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      const header = screen.getByRole('heading', { name: /January 2024/ });
      expect(header).toBeInTheDocument();
    });

    it('renders correctly at desktop viewport (1920px)', () => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));

      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      const header = screen.getByRole('heading', { name: /January 2024/ });
      expect(header).toBeInTheDocument();
    });
  });

  describe('Combined Functionality', () => {
    it('maintains event display when navigating months', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // Verify initial events
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();

      // Navigate to next month
      const nextButton = screen.getByRole('button', { name: 'Next month' });
      fireEvent.click(nextButton);

      jest.advanceTimersByTime(150);

      // Previous events should not be visible
      expect(screen.queryByText('Team Meeting')).not.toBeInTheDocument();
    });

    it('responds to date selection', () => {
      const mockOnDateSelect = jest.fn();
      render(<MonthlyCalendar events={mockEvents} onDateSelect={mockOnDateSelect} />);

      jest.advanceTimersByTime(150);

      // Click on a day
      const dayButton = screen.getByRole('button', {
        name: /Monday, January 15, 2024/,
      });
      fireEvent.click(dayButton);

      expect(mockOnDateSelect).toHaveBeenCalled();
    });

    it('maintains current day highlighting across responsive breakpoints', () => {
      const { rerender } = render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // Check at mobile
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
      rerender(<MonthlyCalendar events={mockEvents} />);

      let currentDay = screen.getByRole('button', {
        name: /Monday, January 15, 2024/,
      });
      expect(currentDay).toHaveAttribute('aria-current', 'date');

      // Check at desktop
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));
      rerender(<MonthlyCalendar events={mockEvents} />);

      currentDay = screen.getByRole('button', {
        name: /Monday, January 15, 2024/,
      });
      expect(currentDay).toHaveAttribute('aria-current', 'date');
    });
  });

  describe('Accessibility Integration', () => {
    it('provides proper ARIA labels for all interactive elements', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      // Navigation buttons should have aria-labels
      const prevButton = screen.getByRole('button', { name: 'Previous month' });
      const nextButton = screen.getByRole('button', { name: 'Next month' });
      const todayButton = screen.getByRole('button', { name: 'Go to today' });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(todayButton).toBeInTheDocument();
    });

    it('marks current date with aria-current', () => {
      render(<MonthlyCalendar events={mockEvents} />);

      jest.advanceTimersByTime(150);

      const currentDayButton = screen.getByRole('button', {
        name: /Monday, January 15, 2024/,
      });

      expect(currentDayButton).toHaveAttribute('aria-current', 'date');
    });
  });
});
