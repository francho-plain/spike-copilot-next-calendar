/** RFC 5545 (iCalendar) compatible types for calendar events */

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  endDate?: Date;
  count?: number;
  byWeekDay?: ('MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU')[];
  byMonthDay?: number[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  attendees?: string[];
  color?: string;
  isAllDay?: boolean;
  recurrence?: RecurrenceRule;
}

export interface CalendarMonth {
  year: number;
  month: number;
  events: CalendarEvent[];
}

export interface CustomDayCellProps {
  day: Date;
  displayMonth: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}
