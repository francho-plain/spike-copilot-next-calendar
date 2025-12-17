'use client';

import { CalendarEvent } from '@/lib/calendar/types';
import { getEventsForDay } from '@/lib/calendar/dateUtils';
import EventList from '../EventList/EventList';
import styles from './DayCell.module.css';

export interface DayCellProps {
  date: Date;
  events: CalendarEvent[];
}

/**
 * DayCell - Renders a single day in the calendar with its events
 * Extends react-day-picker functionality to show event data
 */
export default function DayCell({ date, events }: DayCellProps) {
  const dayEvents = getEventsForDay(date, events);
  const dayNumber = date.getDate();
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  return (
    <div className={styles.dayCell} data-testid={`day-cell-${dateString}`}>
      <div className={styles.dayNumber}>{dayNumber}</div>
      {dayEvents.length > 0 ? (
        <EventList events={dayEvents} maxVisible={3} />
      ) : (
        <div className={styles.emptyDay} aria-label="No events for this day" />
      )}
    </div>
  );
}
