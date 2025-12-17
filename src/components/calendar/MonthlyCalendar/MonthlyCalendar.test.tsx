import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import MonthlyCalendar from './MonthlyCalendar';

expect.extend(toHaveNoViolations);

describe('MonthlyCalendar', () => {
  describe('Structure', () => {
    it('renders the calendar header', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('displays the current month and year', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
      const now = new Date();
      const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const headers = screen.getAllByText(monthYear);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('renders navigation buttons', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to today')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('renders the calendar grid', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to previous month', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthYear = prevMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const prevButton = screen.getByLabelText('Previous month');
      await userEvent.click(prevButton);

      // Wait for month change loading to finish
      await waitFor(() => {
        const headers = screen.getAllByText(prevMonthYear);
        expect(headers.length).toBeGreaterThan(0);
      });

      const headers = screen.getAllByText(prevMonthYear);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('navigates to next month', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const nextMonthYear = nextMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const nextButton = screen.getByLabelText('Next month');
      await userEvent.click(nextButton);

      // Wait for month change loading to finish
      await waitFor(() => {
        const headers = screen.getAllByText(nextMonthYear);
        expect(headers.length).toBeGreaterThan(0);
      });

      const headers = screen.getAllByText(nextMonthYear);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('returns to today when Today button clicked', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      const now = new Date();
      const currentMonthYear = now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const nextMonthYear = nextMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      // Navigate away from today
      const nextButton = screen.getByLabelText('Next month');
      await userEvent.click(nextButton);
      
        // Wait for navigation to complete AND loading skeleton to disappear
      await waitFor(() => {
          expect(container.querySelector('table')).toBeInTheDocument();
        expect(screen.getAllByText(nextMonthYear).length).toBeGreaterThan(0);
      });

      // Click Today button
      const todayButton = screen.getByLabelText('Go to today');
      await userEvent.click(todayButton);
      
        // Wait for navigation back to today AND loading skeleton to disappear
      await waitFor(() => {
          expect(container.querySelector('table')).toBeInTheDocument();
        const headers = screen.getAllByText(currentMonthYear);
        expect(headers.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Event Handling', () => {
    it('calls onDateSelect when a date is selected', async () => {
      const onDateSelect = jest.fn();
      const { container } = render(<MonthlyCalendar onDateSelect={onDateSelect} />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      const firstDayButton = container.querySelector('tbody button') as HTMLButtonElement | null;
      if (firstDayButton) {
        await userEvent.click(firstDayButton);
      }

      expect(onDateSelect).toHaveBeenCalledTimes(1);
      expect(onDateSelect.mock.calls[0][0]).toBeInstanceOf(Date);
    });

    it('accepts custom events prop', async () => {
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
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have no axe violations', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible navigation buttons', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      const prevButton = screen.getByLabelText('Previous month');
      const todayButton = screen.getByLabelText('Go to today');
      const nextButton = screen.getByLabelText('Next month');

      expect(prevButton).toHaveAccessibleName();
      expect(todayButton).toHaveAccessibleName();
      expect(nextButton).toHaveAccessibleName();
    });

    it('should have proper heading hierarchy', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBeTruthy();
    });

    it('should be keyboard navigable', async () => {
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });

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
    it('renders without errors at mobile viewport', async () => {
      global.innerWidth = 375;
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
    });

    it('renders without errors at tablet viewport', async () => {
      global.innerWidth = 768;
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
    });

    it('renders without errors at desktop viewport', async () => {
      global.innerWidth = 1920;
      const { container } = render(<MonthlyCalendar />);
      // Wait for loading to finish
      await waitFor(() => {
        expect(container.querySelector('table')).toBeInTheDocument();
      });
    });
  });
});
