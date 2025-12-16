'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/lib/calendar/types';
import { getMockEvents } from '@/lib/data/mockData';
import CalendarGrid from '../CalendarGrid/CalendarGrid';
import styles from './MonthlyCalendar.module.css';

export interface MonthlyCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

export default function MonthlyCalendar({
  events = getMockEvents(),
  onDateSelect,
}: MonthlyCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setDisplayMonth(new Date());
  };

  return (
    <div className={styles.monthlyCalendar}>
      <header className={styles.calendarHeader}>
        <button onClick={handlePreviousMonth} aria-label="Previous month">
          ←
        </button>
        <button onClick={handleToday} aria-label="Go to today">
          Today
        </button>
        <h2>
          {displayMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button onClick={handleNextMonth} aria-label="Next month">
          →
        </button>
      </header>
      <CalendarGrid displayMonth={displayMonth} events={events} onDateSelect={onDateSelect} />
    </div>
  );
}
