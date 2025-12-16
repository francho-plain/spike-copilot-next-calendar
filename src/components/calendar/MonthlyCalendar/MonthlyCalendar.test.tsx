import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import MonthlyCalendar from './MonthlyCalendar';

expect.extend(toHaveNoViolations);

describe('MonthlyCalendar', () => {
  describe('Structure', () => {
    it('renders the calendar header', () => {
      render(<MonthlyCalendar />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('displays the current month and year', () => {
      render(<MonthlyCalendar />);
      const now = new Date();
      const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      expect(screen.getByText(monthYear)).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
      render(<MonthlyCalendar />);

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to today')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('renders the calendar grid', () => {
      const { container } = render(<MonthlyCalendar />);
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to previous month', () => {
      render(<MonthlyCalendar />);

      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthYear = prevMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const prevButton = screen.getByLabelText('Previous month');
      fireEvent.click(prevButton);

      const headers = screen.getAllByText(prevMonthYear);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('navigates to next month', () => {
      render(<MonthlyCalendar />);

      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const nextMonthYear = nextMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);

      const headers = screen.getAllByText(nextMonthYear);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('returns to today when Today button clicked', () => {
      render(<MonthlyCalendar />);

      // Navigate away from today
      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);

      // Click Today button
      const todayButton = screen.getByLabelText('Go to today');
      fireEvent.click(todayButton);

      // Should show current month
      const now = new Date();
      const currentMonthYear = now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      const headers = screen.getAllByText(currentMonthYear);
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  describe('Event Handling', () => {
    it('calls onDateSelect when a date is selected', () => {
      const onDateSelect = jest.fn();
      const { container } = render(<MonthlyCalendar onDateSelect={onDateSelect} />);

      const firstDayButton = container.querySelector('tbody button');
      firstDayButton?.click();

      expect(onDateSelect).toHaveBeenCalledTimes(1);
      expect(onDateSelect.mock.calls[0][0]).toBeInstanceOf(Date);
    });

    it('accepts custom events prop', () => {
      const customEvents = [
        {
          id: 'test-1',
          title: 'Test Event',
          date: new Date(2025, 11, 15),
          startTime: '10:00',
          endTime: '11:00',
        },
      ];

      const { container } = render(<MonthlyCalendar events={customEvents} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have no axe violations', async () => {
      const { container } = render(<MonthlyCalendar />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible navigation buttons', () => {
      render(<MonthlyCalendar />);

      const prevButton = screen.getByLabelText('Previous month');
      const todayButton = screen.getByLabelText('Go to today');
      const nextButton = screen.getByLabelText('Next month');

      expect(prevButton).toHaveAccessibleName();
      expect(todayButton).toHaveAccessibleName();
      expect(nextButton).toHaveAccessibleName();
    });

    it('should have proper heading hierarchy', () => {
      render(<MonthlyCalendar />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBeTruthy();
    });

    it('should be keyboard navigable', () => {
      render(<MonthlyCalendar />);

      const prevButton = screen.getByLabelText('Previous month');
      const todayButton = screen.getByLabelText('Go to today');
      const nextButton = screen.getByLabelText('Next month');

      // Check buttons are focusable
      prevButton.focus();
      expect(prevButton).toHaveFocus();

      todayButton.focus();
      expect(todayButton).toHaveFocus();

      nextButton.focus();
      expect(nextButton).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    it('renders without errors at mobile viewport', () => {
      global.innerWidth = 375;
      const { container } = render(<MonthlyCalendar />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('renders without errors at tablet viewport', () => {
      global.innerWidth = 768;
      const { container } = render(<MonthlyCalendar />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('renders without errors at desktop viewport', () => {
      global.innerWidth = 1920;
      const { container } = render(<MonthlyCalendar />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });
  });
});
