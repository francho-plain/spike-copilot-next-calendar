import { render, screen } from '@testing-library/react';
import EventList from './EventList';
import { CalendarEvent } from '@/lib/calendar/types';

describe('EventList', () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(2025, 11, 16),
      startTime: '10:00',
      endTime: '11:00',
      isAllDay: false,
      color: '#3b82f6',
    },
    {
      id: '2',
      title: 'Lunch Break',
      date: new Date(2025, 11, 16),
      startTime: '12:00',
      endTime: '13:00',
      isAllDay: false,
    },
    {
      id: '3',
      title: 'Project Review',
      date: new Date(2025, 11, 16),
      startTime: '14:00',
      endTime: '15:00',
      isAllDay: false,
      color: '#10b981',
    },
  ];

  describe('Event Rendering', () => {
    it('should render all events when count is within maxVisible', () => {
      render(<EventList events={mockEvents} maxVisible={5} />);
      
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
      expect(screen.getByText('Lunch Break')).toBeInTheDocument();
      expect(screen.getByText('Project Review')).toBeInTheDocument();
    });

    it('should render event titles', () => {
      render(<EventList events={[mockEvents[0]]} />);
      
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    });

    it('should display "(No title)" for events without title', () => {
      const eventWithoutTitle: CalendarEvent[] = [
        {
          id: '1',
          title: '',
          date: new Date(2025, 11, 16),
          isAllDay: true,
        },
      ];

      render(<EventList events={eventWithoutTitle} />);
      
      expect(screen.getByText('(No title)')).toBeInTheDocument();
    });

    it('should render events with testids', () => {
      render(<EventList events={mockEvents} />);
      
      expect(screen.getByTestId('event-1')).toBeInTheDocument();
      expect(screen.getByTestId('event-2')).toBeInTheDocument();
      expect(screen.getByTestId('event-3')).toBeInTheDocument();
    });
  });

  describe('+N More Indicator', () => {
    it('should show "+N more" when events exceed maxVisible', () => {
      render(<EventList events={mockEvents} maxVisible={2} />);
      
      expect(screen.getByTestId('more-events')).toHaveTextContent('+1 more');
    });

    it('should not show "+N more" when events equal maxVisible', () => {
      render(<EventList events={mockEvents} maxVisible={3} />);
      
      expect(screen.queryByTestId('more-events')).not.toBeInTheDocument();
    });

    it('should not show "+N more" when events less than maxVisible', () => {
      render(<EventList events={mockEvents} maxVisible={5} />);
      
      expect(screen.queryByTestId('more-events')).not.toBeInTheDocument();
    });

    it('should show correct count for many overflow events', () => {
      const manyEvents: CalendarEvent[] = [
        ...mockEvents,
        { id: '4', title: 'Event 4', date: new Date(2025, 11, 16), isAllDay: true },
        { id: '5', title: 'Event 5', date: new Date(2025, 11, 16), isAllDay: true },
        { id: '6', title: 'Event 6', date: new Date(2025, 11, 16), isAllDay: true },
      ];

      render(<EventList events={manyEvents} maxVisible={3} />);
      
      expect(screen.getByTestId('more-events')).toHaveTextContent('+3 more');
    });

    it('should use default maxVisible=3 when not provided', () => {
      const fourEvents: CalendarEvent[] = [
        ...mockEvents,
        { id: '4', title: 'Event 4', date: new Date(2025, 11, 16), isAllDay: true },
      ];

      render(<EventList events={fourEvents} />);
      
      expect(screen.getByTestId('more-events')).toHaveTextContent('+1 more');
    });
  });

  describe('Event Colors', () => {
    it('should apply custom event color to border', () => {
      render(<EventList events={[mockEvents[0]]} />);
      
      const event = screen.getByTestId('event-1');
      expect(event).toHaveStyle({ borderLeftColor: '#3b82f6' });
    });

    it('should use default color when color not provided', () => {
      render(<EventList events={[mockEvents[1]]} />);
      
      const event = screen.getByTestId('event-2');
      expect(event).toHaveStyle({ borderLeftColor: 'var(--color-primary)' });
    });
  });

  describe('Long Title Handling', () => {
    it('should display long event titles', () => {
      const longTitleEvent: CalendarEvent[] = [
        {
          id: '1',
          title: 'This is a very long event title that exceeds fifty characters and should be truncated',
          date: new Date(2025, 11, 16),
          isAllDay: true,
        },
      ];

      render(<EventList events={longTitleEvent} />);
      
      const eventTitle = screen.getByText('This is a very long event title that exceeds fifty characters and should be truncated');
      expect(eventTitle).toBeInTheDocument();
      // CSS ellipsis is applied via styles, actual truncation happens in CSS
    });

    it('should show full title in title attribute for accessibility', () => {
      const longTitle = 'This is a very long event title that should show in tooltip';
      const longTitleEvent: CalendarEvent[] = [
        {
          id: '1',
          title: longTitle,
          date: new Date(2025, 11, 16),
          isAllDay: true,
        },
      ];

      render(<EventList events={longTitleEvent} />);
      
      const event = screen.getByTestId('event-1');
      expect(event).toHaveAttribute('title', longTitle);
    });
  });

  describe('Multiple Events', () => {
    it('should render exactly maxVisible events', () => {
      render(<EventList events={mockEvents} maxVisible={2} />);
      
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
      expect(screen.getByText('Lunch Break')).toBeInTheDocument();
      expect(screen.queryByText('Project Review')).not.toBeInTheDocument();
    });

    it('should maintain event order', () => {
      render(<EventList events={mockEvents} maxVisible={3} />);
      
      const eventList = screen.getByTestId('event-list');
      const events = eventList.querySelectorAll('[data-testid^="event-"]:not([data-testid="event-list"])');
      expect(events).toHaveLength(3);
      expect(events[0]).toHaveAttribute('data-testid', 'event-1');
      expect(events[1]).toHaveAttribute('data-testid', 'event-2');
      expect(events[2]).toHaveAttribute('data-testid', 'event-3');
    });
  });
});
