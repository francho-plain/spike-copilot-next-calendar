'use client';

import { CalendarEvent } from '@/lib/calendar/types';
import styles from './EventList.module.css';

export interface EventListProps {
  events: CalendarEvent[];
  maxVisible?: number;
}

/**
 * EventList - Renders a list of events for a single day
 * Handles multiple events, truncation, and "+N more" indicator
 */
export default function EventList({ events, maxVisible = 3 }: EventListProps) {
  const visibleEvents = events.slice(0, maxVisible);
  const remainingCount = events.length - maxVisible;
  const hasMoreEvents = remainingCount > 0;

  return (
    <div className={styles.eventList} data-testid="event-list">
      {visibleEvents.map((event, index) => {
        const eventTitle = event.title || '(No title)';
        const eventColor = event.color || 'var(--color-primary)';
        
        return (
          <div
            key={event.id || `event-${index}`}
            className={styles.event}
            style={{ borderLeftColor: eventColor }}
            title={eventTitle}
            data-testid={`event-${event.id || index}`}
          >
            <span className={styles.eventTitle}>{eventTitle}</span>
          </div>
        );
      })}
      
      {hasMoreEvents && (
        <div className={styles.moreIndicator} data-testid="more-events">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}
