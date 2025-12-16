'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CalendarEvent } from '@/lib/calendar/types';
import { isCurrentMonth } from '@/lib/calendar/dateUtils';
import styles from './CalendarGrid.module.css';

export interface CalendarGridProps {
  displayMonth: Date;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

export default function CalendarGrid({ displayMonth, onDateSelect }: CalendarGridProps) {
  return (
    <div className={styles.gridContainer}>
      <DayPicker
        mode="single"
        month={displayMonth}
        fixedWeeks
        weekStartsOn={1}
        modifiers={{
          today: new Date(),
          currentMonth: (day) => isCurrentMonth(day, displayMonth),
          overflow: (day) => !isCurrentMonth(day, displayMonth),
        }}
        modifiersClassNames={{
          today: styles.today,
          overflow: styles.overflow,
        }}
        onDayClick={onDateSelect}
        showOutsideDays
      />
    </div>
  );
}
