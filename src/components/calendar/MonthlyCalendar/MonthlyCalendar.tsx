'use client';

import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for initial render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show loading state when month changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [displayMonth]);

  const handlePreviousMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setDisplayMonth(new Date());
  };

  if (isLoading) {
    return (
      <div className={styles.monthlyCalendar} aria-busy="true" aria-label="Loading calendar">
        <header className={styles.calendarHeader}>
          <button onClick={handlePreviousMonth} aria-label="Previous month" disabled>
            ←
          </button>
          <button onClick={handleToday} aria-label="Go to today" disabled>
            Today
          </button>
          <h2>
            {displayMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button onClick={handleNextMonth} aria-label="Next month" disabled>
            →
          </button>
        </header>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonHeader}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className={styles.skeletonDay}>{day}</div>
            ))}
          </div>
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className={styles.skeletonCell} />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
