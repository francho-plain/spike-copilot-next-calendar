import {
  format,
  isToday as isTodayFns,
  isSameMonth,
  isSameDay,
  startOfDay,
  parseISO,
} from 'date-fns';
import { CalendarEvent } from './types';

/**
 * Filters and returns all events that occur on a specific date.
 * 
 * @param date - The target date to filter events for
 * @param events - Array of calendar events to search through
 * @returns Array of events that occur on the specified date
 * 
 * @example
 * const today = new Date();
 * const todayEvents = getEventsForDay(today, allEvents);
 */
export function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  const dayStart = startOfDay(date);
  return events.filter((event) => isSameDay(startOfDay(event.date), dayStart));
}

/**
 * Formats a date to display only the day number.
 * 
 * @param date - The date to format
 * @returns Day number as a string (e.g., "15")
 * 
 * @example
 * formatDateDisplay(new Date(2024, 0, 15)); // Returns "15"
 */
export function formatDateDisplay(date: Date): string {
  return format(date, 'd');
}

/**
 * Formats a date into a human-readable format.
 * 
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Monday, January 15, 2024")
 * 
 * @example
 * formatDateReadable(new Date(2024, 0, 15)); // Returns "Monday, January 15, 2024"
 */
export function formatDateReadable(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Converts a time string (HH:mm) to a formatted 12-hour time display.
 * 
 * @param timeString - Time in "HH:mm" format (e.g., "14:30")
 * @returns Formatted time string (e.g., "2:30 PM")
 * 
 * @example
 * formatTime("14:30"); // Returns "2:30 PM"
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return format(date, 'h:mm a');
}

/**
 * Checks if a given date is today.
 * 
 * @param date - The date to check
 * @returns True if the date is today, false otherwise
 * 
 * @example
 * isToday(new Date()); // Returns true
 */
export function isToday(date: Date): boolean {
  return isTodayFns(date);
}

/**
 * Checks if a date belongs to the same month as the display month.
 * 
 * @param date - The date to check
 * @param displayMonth - The reference month to compare against
 * @returns True if dates are in the same month, false otherwise
 * 
 * @example
 * const date = new Date(2024, 0, 15);
 * const month = new Date(2024, 0, 1);
 * isCurrentMonth(date, month); // Returns true
 */
export function isCurrentMonth(date: Date, displayMonth: Date): boolean {
  return isSameMonth(date, displayMonth);
}

/**
 * Gets the first day (Monday) of the week containing the given date.
 * 
 * @param date - The date within the target week
 * @returns Date object representing the Monday of that week
 * 
 * @example
 * getWeekStart(new Date(2024, 0, 17)); // Returns Monday of that week
 */
export function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

/**
 * Calculates the number of days in a specific month.
 * 
 * @param year - The year (e.g., 2024)
 * @param month - The month (0-11, where 0 is January)
 * @returns Number of days in the specified month
 * 
 * @example
 * getDaysInMonth(2024, 1); // Returns 29 (February 2024 is a leap year)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Checks if an event is marked as an all-day event.
 * 
 * @param event - The calendar event to check
 * @returns True if event is all-day, false otherwise
 * 
 * @example
 * isAllDayEvent({ id: '1', title: 'Holiday', date: new Date(), isAllDay: true });
 * // Returns true
 */
export function isAllDayEvent(event: CalendarEvent): boolean {
  return event.isAllDay ?? false;
}

/**
 * Generates a formatted time display string for an event.
 * 
 * @param event - The calendar event to format
 * @returns Formatted time string (e.g., "9:00 AM - 10:00 AM", "All day", or "9:00 AM")
 * 
 * @example
 * getEventTimeDisplay({ 
 *   id: '1', 
 *   title: 'Meeting', 
 *   date: new Date(),
 *   startTime: '09:00',
 *   endTime: '10:00'
 * });
 * // Returns "9:00 AM - 10:00 AM"
 */
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

/**
 * Truncates text to a maximum length and appends ellipsis if needed.
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Truncated text with ellipsis if longer than maxLength
 * 
 * @example
 * truncateText("This is a very long title", 10); // Returns "This is a ..."
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Parses various date formats into a Date object.
 * 
 * @param date - Date as string (ISO 8601), number (timestamp), or Date object
 * @returns Parsed Date object
 * 
 * @example
 * parseDate("2024-01-15"); // Returns Date object for January 15, 2024
 * parseDate(1705305600000); // Returns Date object from timestamp
 */
export function parseDate(date: string | number | Date): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string') {
    return parseISO(date);
  }
  return new Date(date);
}

/**
 * Compares two dates and returns their relative ordering.
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 * 
 * @example
 * compareDates(new Date(2024, 0, 15), new Date(2024, 0, 20)); // Returns -1
 */
export function compareDates(date1: Date, date2: Date): number {
  const d1 = startOfDay(date1).getTime();
  const d2 = startOfDay(date2).getTime();
  return Math.sign(d1 - d2);
}
