'use client';

import MonthlyCalendar from '@/components/calendar/MonthlyCalendar/MonthlyCalendar';

export default function CalendarPage() {
  const handleDateSelect = (_date: Date) => {
    // Date selection handler - will be used for future event creation
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Monthly Calendar</h1>
      <MonthlyCalendar onDateSelect={handleDateSelect} />
    </div>
  );
}
