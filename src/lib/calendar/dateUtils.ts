import {
  format,
  isToday as isTodayFns,
  isSameMonth,
  isSameDay,
  startOfDay,
  parseISO,
} from 'date-fns';
import { CalendarEvent } from './types';

export function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  const dayStart = startOfDay(date);
  return events.filter((event) => isSameDay(startOfDay(event.date), dayStart));
}

export function formatDateDisplay(date: Date): string {
  return format(date, 'd');
}

export function formatDateReadable(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return format(date, 'h:mm a');
}

export function isToday(date: Date): boolean {
  return isTodayFns(date);
}

export function isCurrentMonth(date: Date, displayMonth: Date): boolean {
  return isSameMonth(date, displayMonth);
}

export function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isAllDayEvent(event: CalendarEvent): boolean {
  return event.isAllDay ?? false;
}

export function getEventTimeDisplay(event: CalendarEvent): string {
  if (event.isAllDay) {
    return 'All day';
  }

  if (event.startTime && event.endTime) {
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  }

  if (event.startTime) {
    return formatTime(event.startTime);
  }

  return '';
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

export function parseDate(date: string | number | Date): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string') {
    return parseISO(date);
  }
  return new Date(date);
}

export function compareDates(date1: Date, date2: Date): number {
  const d1 = startOfDay(date1).getTime();
  const d2 = startOfDay(date2).getTime();
  return Math.sign(d1 - d2);
}
