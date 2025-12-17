import { render, screen } from '@testing-library/react';
import DayCell from './DayCell';
import { CalendarEvent } from '@/lib/calendar/types';

describe('DayCell', () => {
  const mockDate = new Date(2025, 11, 16); // December 16, 2025
  
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(2025, 11, 16),
      startTime: '10:00',
      endTime: '11:00',
      isAllDay: false,
    },
    {
      id: '2',
      title: 'Lunch',
      date: new Date(2025, 11, 16),
      startTime: '12:00',
      endTime: '13:00',
      isAllDay: false,
    },
  ];

  describe('Structure', () => {
    it('should render day number', () => {
      render(<DayCell date={mockDate} events={[]} />);
      
      expect(screen.getByText('16')).toBeInTheDocument();
    });

    it('should have correct testid', () => {
      render(<DayCell date={mockDate} events={[]} />);
      
      expect(screen.getByTestId('day-cell-2025-12-16')).toBeInTheDocument();
    });
  });

  describe('Events Display', () => {
    it('should display event list when events exist', () => {
      render(<DayCell date={mockDate} events={mockEvents} />);
      
      expect(screen.getByTestId('event-list')).toBeInTheDocument();
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    it('should display empty day indicator when no events', () => {
      render(<DayCell date={mockDate} events={[]} />);
      
      const emptyIndicator = screen.getByLabelText('No events for this day');
      expect(emptyIndicator).toBeInTheDocument();
    });

    it('should only show events for the specific date', () => {
      const eventsWithDifferentDates: CalendarEvent[] = [
        ...mockEvents,
        {
          id: '3',
          title: 'Other Day Event',
          date: new Date(2025, 11, 17), // Different day
          startTime: '14:00',
          endTime: '15:00',
          isAllDay: false,
        },
      ];

      render(<DayCell date={mockDate} events={eventsWithDifferentDates} />);
      
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.queryByText('Other Day Event')).not.toBeInTheDocument();
    });

    it('should pass maxVisible=3 to EventList', () => {
      const manyEvents: CalendarEvent[] = [
        ...mockEvents,
        {
          id: '3',
          title: 'Event 3',
          date: new Date(2025, 11, 16),
          isAllDay: true,
        },
        {
          id: '4',
          title: 'Event 4',
          date: new Date(2025, 11, 16),
          isAllDay: true,
        },
      ];

      render(<DayCell date={mockDate} events={manyEvents} />);
      
      // Should show "+1 more" indicator for 4 events with maxVisible=3
      expect(screen.getByTestId('more-events')).toHaveTextContent('+1 more');
    });
  });

  describe('Styling', () => {
    it('should apply dayCell CSS class', () => {
      render(<DayCell date={mockDate} events={[]} />);
      
      const dayCell = screen.getByTestId('day-cell-2025-12-16');
      expect(dayCell).toHaveClass('dayCell');
    });

    it('should apply dayNumber CSS class to day number', () => {
      render(<DayCell date={mockDate} events={[]} />);
      
      const dayNumber = screen.getByText('16');
      expect(dayNumber).toHaveClass('dayNumber');
    });
  });
});
