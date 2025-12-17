'use client';

import { DayPicker, DayProps } from 'react-day-picker';
import { CalendarEvent } from '@/lib/calendar/types';
import { isCurrentMonth, getEventsForDay } from '@/lib/calendar/dateUtils';
import EventList from '../EventList/EventList';
import styles from './CalendarGrid.module.css';

export interface CalendarGridProps {
  displayMonth: Date;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

export default function CalendarGrid({ displayMonth, events = [], onDateSelect }: CalendarGridProps) {
  const today = new Date();

  // Custom Day component that includes events
  function CustomDay(props: DayProps) {
    const date = props.day.date;
    const dayEvents = getEventsForDay(date, events);
    const dayNumber = date.getDate();
    
    return (
      <div className={styles.customDayCell}>
        <button
          className={styles.dayButton}
          onClick={() => onDateSelect?.(date)}
          aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          data-date={date.toISOString().split('T')[0]}
        >
          <span className={styles.dayNumber}>{dayNumber}</span>
        </button>
        {dayEvents.length > 0 && (
          <div className={styles.eventsContainer}>
            <EventList events={dayEvents} maxVisible={3} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      <DayPicker
        mode="single"
        month={displayMonth}
        fixedWeeks
        weekStartsOn={1}
        modifiers={{
          today: today,
          currentMonth: (day) => isCurrentMonth(day, displayMonth),
          overflow: (day) => !isCurrentMonth(day, displayMonth),
        }}
        modifiersClassNames={{
          today: 'today',
          overflow: 'overflow',
        }}
        components={{
          Day: CustomDay,
        }}
        showOutsideDays
        className={styles.rdpCalendar}
      />
    </div>
  );
}
