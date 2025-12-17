'use client';

import { DayPicker, type DayButtonProps } from 'react-day-picker';
import { CalendarEvent } from '@/lib/calendar/types';
import { isCurrentMonth, getEventsForDay } from '@/lib/calendar/dateUtils';
import EventList from '../EventList/EventList';
import styles from './CalendarGrid.module.css';
import { useEffect, useRef, useState } from 'react';

export interface CalendarGridProps {
  displayMonth: Date;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

// Custom DayButton component that adds events below the button
function CustomDayButton({ day, ...props }: DayButtonProps & { events?: CalendarEvent[]; isToday?: boolean }) {
  // Get events from props
  const events = props.events || [];
  const dayEvents = getEventsForDay(day.date, events);
  const isToday = props.isToday || false;

  return (
    <>
      {/* Render the default button behavior manually with ARIA labels */}
      <button 
        {...props}
        aria-label={`${day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
        aria-current={isToday ? 'date' : undefined}
      >
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!selectedDate || !gridRef.current) return;

      const currentDate = new Date(selectedDate);
      let newDate: Date | null = null;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 7);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 7);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (onDateSelect) {
            onDateSelect(currentDate);
          }
          break;
      }

      if (newDate) {
        setSelectedDate(newDate);
        // Find and focus the button for the new date
        const buttons = gridRef.current.querySelectorAll('button[name="day"]');
        buttons.forEach((button) => {
          const buttonElement = button as HTMLButtonElement;
          if (buttonElement.getAttribute('aria-label')?.includes(newDate.toLocaleDateString())) {
            buttonElement.focus();
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, onDateSelect]);

  const handleDayClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  // Create a wrapper to pass events to CustomDayButton
  const DayButtonWithEvents = (props: DayButtonProps) => {
    const isToday = props.day && today.toDateString() === props.day.date.toDateString();
    return <CustomDayButton {...props} events={events} isToday={isToday} />;
  };

  return (
    <div 
      className={styles.gridContainer} 
      ref={gridRef}
      role="application"
      aria-label="Calendar grid with keyboard navigation"
    >
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
        onDayClick={handleDayClick}
        showOutsideDays
        className={styles.rdpCalendar}
      />
    </div>
  );
}
