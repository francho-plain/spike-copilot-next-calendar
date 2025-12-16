/** Mock calendar events for development and testing */

import { CalendarEvent } from '../calendar/types';

const REFERENCE_DATE = new Date(2025, 11, 16);
const REFERENCE_YEAR = REFERENCE_DATE.getFullYear();
const REFERENCE_MONTH = REFERENCE_DATE.getMonth();

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-001',
    title: 'Project Kickoff',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 1),
    startTime: '10:00',
    endTime: '11:30',
    description: 'Project kickoff meeting with team',
    location: 'Conference Room A',
    color: '#3B82F6',
  },
  {
    id: 'evt-002',
    title: 'Team Standup',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 2),
    startTime: '09:00',
    endTime: '09:30',
    color: '#10B981',
  },
  {
    id: 'evt-003',
    title: 'Design Review',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 2),
    startTime: '14:00',
    endTime: '15:00',
    color: '#8B5CF6',
  },
  {
    id: 'evt-004',
    title: 'Client Call: Very Long Event Title That Should Be Truncated With Ellipsis',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 2),
    startTime: '16:00',
    endTime: '17:00',
    color: '#F59E0B',
  },
  {
    id: 'evt-005',
    title: 'Company Holiday',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 3),
    isAllDay: true,
    color: '#EF4444',
  },
  {
    id: 'evt-006',
    title: 'Weekly Planning',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 4),
    startTime: '10:00',
    endTime: '11:00',
    description: 'Plan tasks for next week',
    color: '#06B6D4',
  },
  {
    id: 'evt-007',
    title: 'Retrospective',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 5),
    startTime: '15:00',
    endTime: '16:00',
    description: 'Sprint retrospective meeting',
    attendees: ['team@example.com', 'lead@example.com'],
    color: '#EC4899',
  },
  {
    id: 'evt-008',
    title: 'Today: Morning Standup',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 16),
    startTime: '09:00',
    endTime: '09:30',
    color: '#10B981',
  },
  {
    id: 'evt-009',
    title: 'Today: Architecture Discussion',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 16),
    startTime: '11:00',
    endTime: '12:00',
    color: '#3B82F6',
  },
  {
    id: 'evt-010',
    title: 'Today: Team Lunch',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 16),
    startTime: '12:00',
    endTime: '13:00',
    location: 'Rooftop Terrace',
    color: '#F59E0B',
  },
  {
    id: 'evt-011',
    title: 'Project Deadline',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 20),
    isAllDay: true,
    color: '#EF4444',
  },
  {
    id: 'evt-012',
    title: 'Company Town Hall (All Day)',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 21),
    isAllDay: true,
    description: 'Annual company town hall meeting',
    color: '#8B5CF6',
  },
  {
    id: 'evt-013',
    title: 'Event 1: Morning Meeting',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 22),
    startTime: '08:00',
    endTime: '08:30',
    color: '#3B82F6',
  },
  {
    id: 'evt-014',
    title: 'Event 2: Team Sync',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 22),
    startTime: '09:00',
    endTime: '09:45',
    color: '#10B981',
  },
  {
    id: 'evt-015',
    title: 'Event 3: Client Presentation',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 22),
    startTime: '11:00',
    endTime: '12:00',
    color: '#F59E0B',
  },
  {
    id: 'evt-016',
    title: 'Event 4: Design Workshop',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 22),
    startTime: '14:00',
    endTime: '15:30',
    color: '#8B5CF6',
  },
  {
    id: 'evt-017',
    title: 'Event 5: Team Retrospective',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 22),
    startTime: '16:00',
    endTime: '17:00',
    color: '#EC4899',
  },
  {
    id: 'evt-018',
    title: 'Holiday Party Preparation',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 23),
    isAllDay: true,
    color: '#06B6D4',
  },
  {
    id: 'evt-019',
    title: 'Return to Work Meeting',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 26),
    startTime: '09:00',
    endTime: '10:00',
    color: '#10B981',
  },
  {
    id: 'evt-020',
    title: 'Year-End Planning & Review',
    date: new Date(REFERENCE_YEAR, REFERENCE_MONTH, 29),
    startTime: '10:00',
    endTime: '12:00',
    description: 'Review accomplishments and plan for next year',
    attendees: ['manager@example.com', 'team@example.com'],
    color: '#3B82F6',
  },
];

export function getMockEvents(): CalendarEvent[] {
  return MOCK_EVENTS;
}

export function getMockEventsForDate(date: Date): CalendarEvent[] {
  return MOCK_EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    const filterDate = new Date(date);
    return (
      eventDate.getFullYear() === filterDate.getFullYear() &&
      eventDate.getMonth() === filterDate.getMonth() &&
      eventDate.getDate() === filterDate.getDate()
    );
  });
}

export function getMockEventsForMonth(year: number, month: number): CalendarEvent[] {
  return MOCK_EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
}
