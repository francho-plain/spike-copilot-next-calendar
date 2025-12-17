'use client';

import { DayPicker, type DayButtonProps } from 'react-day-picker';
import { CalendarEvent } from '@/lib/calendar/types';
import { isCurrentMonth, getEventsForDay } from '@/lib/calendar/dateUtils';
import EventList from '../EventList/EventList';
import styles from './CalendarGrid.module.css';

export interface CalendarGridProps {
  displayMonth: Date;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

// Custom DayButton component that adds events below the button
function CustomDayButton({ day, ...props }: DayButtonProps & { events?: CalendarEvent[] }) {
  // Get events from props
  const events = props.events || [];
  const dayEvents = getEventsForDay(day.date, events);

  return (
    <>
      {/* Render the default button behavior manually */}
      <button {...props}>
        {day.date.getDate()}
      </button>
      <div className={styles.dayEventsWrapper}>
        {dayEvents.length > 0 ? (
          <EventList events={dayEvents} maxVisible={3} />
        ) : (
          <span className={styles.emptyDay} aria-hidden="true" />
        )}
      </div>
    </>
  );
}

export default function CalendarGrid({ displayMonth, events = [], onDateSelect }: CalendarGridProps) {
  const today = new Date();

  // Create a wrapper to pass events to CustomDayButton
  const DayButtonWithEvents = (props: DayButtonProps) => <CustomDayButton {...props} events={events} />;

  return (
    <div className={styles.gridContainer}>
      <DayPicker
        mode="single"
        month={displayMonth}
        fixedWeeks
        weekStartsOn={1}
        components={{
          DayButton: DayButtonWithEvents,
        }}
        modifiers={{
          today: today,
          currentMonth: (day) => isCurrentMonth(day, displayMonth),
          overflow: (day) => !isCurrentMonth(day, displayMonth),
        }}
        modifiersClassNames={{
          today: 'today',
          overflow: 'overflow',
        }}
        onDayClick={onDateSelect}
        showOutsideDays
        className={styles.rdpCalendar}
      />
    </div>
  );
}
