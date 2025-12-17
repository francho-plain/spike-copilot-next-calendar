import {
  getEventsForDay,
  formatDateDisplay,
  formatDateReadable,
  formatTime,
  isToday,
  isCurrentMonth,
  getWeekStart,
  getDaysInMonth,
  isAllDayEvent,
  getEventTimeDisplay,
  truncateText,
} from './dateUtils';
import { CalendarEvent } from './types';

describe('dateUtils', () => {
  describe('getEventsForDay', () => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Event 1',
        date: new Date(2025, 11, 16),
        startTime: '10:00',
        endTime: '11:00',
        isAllDay: false,
      },
      {
        id: '2',
        title: 'Event 2',
        date: new Date(2025, 11, 16),
        startTime: '14:00',
        endTime: '15:00',
        isAllDay: false,
      },
      {
        id: '3',
        title: 'Event 3',
        date: new Date(2025, 11, 17),
        startTime: '09:00',
        endTime: '10:00',
        isAllDay: false,
      },
    ];

    it('should return events for the specified date', () => {
      const date = new Date(2025, 11, 16);
      const result = getEventsForDay(date, mockEvents);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty array when no events for date', () => {
      const date = new Date(2025, 11, 18);
      const result = getEventsForDay(date, mockEvents);

      expect(result).toHaveLength(0);
    });

    it('should match events regardless of time', () => {
      const dateWithDifferentTime = new Date(2025, 11, 16, 23, 59, 59);
      const result = getEventsForDay(dateWithDifferentTime, mockEvents);

      expect(result).toHaveLength(2);
    });

    it('should return empty array for empty events list', () => {
      const date = new Date(2025, 11, 16);
      const result = getEventsForDay(date, []);

      expect(result).toHaveLength(0);
    });
  });

  describe('formatDateDisplay', () => {
    it('should format date as day number', () => {
      const date = new Date(2025, 11, 16);
      expect(formatDateDisplay(date)).toBe('16');
    });

    it('should format single digit day without leading zero', () => {
      const date = new Date(2025, 11, 5);
      expect(formatDateDisplay(date)).toBe('5');
    });
  });

  describe('formatDateReadable', () => {
    it('should format date in readable format', () => {
      const date = new Date(2025, 11, 16);
      const result = formatDateReadable(date);

      expect(result).toContain('December');
      expect(result).toContain('16');
      expect(result).toContain('2025');
    });
  });

  describe('formatTime', () => {
    it('should format time string to 12-hour format', () => {
      expect(formatTime('10:00')).toMatch(/10:00 AM/i);
      expect(formatTime('14:30')).toMatch(/2:30 PM/i);
    });

    it('should handle midnight', () => {
      expect(formatTime('00:00')).toMatch(/12:00 AM/i);
    });

    it('should handle noon', () => {
      expect(formatTime('12:00')).toMatch(/12:00 PM/i);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isCurrentMonth', () => {
    it('should return true for same month and year', () => {
      const date = new Date(2025, 11, 16);
      const displayMonth = new Date(2025, 11, 1);
      expect(isCurrentMonth(date, displayMonth)).toBe(true);
    });

    it('should return false for different month', () => {
      const date = new Date(2025, 10, 16);
      const displayMonth = new Date(2025, 11, 1);
      expect(isCurrentMonth(date, displayMonth)).toBe(false);
    });

    it('should return false for different year', () => {
      const date = new Date(2024, 11, 16);
      const displayMonth = new Date(2025, 11, 1);
      expect(isCurrentMonth(date, displayMonth)).toBe(false);
    });
  });

  describe('getWeekStart', () => {
    it('should return Monday for a date in the middle of the week', () => {
      const wednesday = new Date(2025, 11, 17); // December 17, 2025 is Wednesday
      const weekStart = getWeekStart(wednesday);
      
      expect(weekStart.getDay()).toBe(1); // Monday
      expect(weekStart.getDate()).toBe(15); // December 15, 2025 is Monday
    });
  });

  describe('getDaysInMonth', () => {
    it('should return 31 for December', () => {
      expect(getDaysInMonth(2025, 11)).toBe(31);
    });

    it('should return 28 for February in non-leap year', () => {
      expect(getDaysInMonth(2025, 1)).toBe(28);
    });

    it('should return 29 for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });
  });

  describe('isAllDayEvent', () => {
    it('should return true for all-day events', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'All Day Event',
        date: new Date(2025, 11, 16),
        isAllDay: true,
      };
      expect(isAllDayEvent(event)).toBe(true);
    });

    it('should return false for timed events', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Timed Event',
        date: new Date(2025, 11, 16),
        startTime: '10:00',
        endTime: '11:00',
        isAllDay: false,
      };
      expect(isAllDayEvent(event)).toBe(false);
    });

    it('should return false when isAllDay is undefined', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Event',
        date: new Date(2025, 11, 16),
      };
      expect(isAllDayEvent(event)).toBe(false);
    });
  });

  describe('getEventTimeDisplay', () => {
    it('should return "All day" for all-day events', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'All Day Event',
        date: new Date(2025, 11, 16),
        isAllDay: true,
      };
      expect(getEventTimeDisplay(event)).toBe('All day');
    });

    it('should return time range for events with start and end times', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Timed Event',
        date: new Date(2025, 11, 16),
        startTime: '10:00',
        endTime: '11:00',
        isAllDay: false,
      };
      const result = getEventTimeDisplay(event);
      expect(result).toContain('10:00');
      expect(result).toContain('11:00');
      expect(result).toContain('-');
    });

    it('should return only start time when end time is missing', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Event',
        date: new Date(2025, 11, 16),
        startTime: '10:00',
        isAllDay: false,
      };
      const result = getEventTimeDisplay(event);
      expect(result).toContain('10:00');
    });

    it('should return empty string when no time info', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Event',
        date: new Date(2025, 11, 16),
      };
      expect(getEventTimeDisplay(event)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      const longText = 'This is a very long text that exceeds the maximum length';
      const result = truncateText(longText, 20);
      
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 + '...'
    });

    it('should not truncate text shorter than maxLength', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should not truncate text equal to maxLength', () => {
      const text = 'Exactly 20 chars txt';
      expect(truncateText(text, 20)).toBe('Exactly 20 chars txt');
    });

    it('should use default maxLength of 50', () => {
      const text = 'a'.repeat(60);
      const result = truncateText(text);
      
      expect(result).toHaveLength(53); // 50 + '...'
      expect(result.endsWith('...')).toBe(true);
    });
  });
});
