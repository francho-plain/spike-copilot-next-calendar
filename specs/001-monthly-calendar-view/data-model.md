# Data Model: Monthly Calendar View

**Purpose**: Define entity structures for calendar data, aligned with API readiness and react-day-picker integration  
**Status**: Complete with react-day-picker integration  

---

## Entity Definitions

### CalendarEvent

**Purpose**: Represent a single calendar event with RFC 5545 (iCalendar) compatibility for future API integration

```typescript
interface CalendarEvent {
  // Required fields
  id: string                    // Unique identifier (UUID preferred)
  title: string                 // Event title for display
  date: Date                    // Date the event occurs

  // Optional fields
  startTime?: string            // ISO 8601 time format (e.g., "09:00")
  endTime?: string              // ISO 8601 time format (e.g., "09:30")
  description?: string          // Detailed event description
  location?: string             // Event location (address, room, etc.)
  attendees?: string[]          // Email addresses of attendees
  color?: string                // Hex color for visual categorization
  isAllDay?: boolean            // Flag for all-day events
  recurrence?: RecurrenceRule   // (Future) Recurring event configuration
}

// Example instances
const event1: CalendarEvent = {
  id: 'evt-001',
  title: 'Team Standup',
  date: new Date(2025, 11, 16),
  startTime: '09:00',
  endTime: '09:30',
  color: '#3B82F6',
}

const event2: CalendarEvent = {
  id: 'evt-002',
  title: 'Project Deadline',
  date: new Date(2025, 11, 20),
  isAllDay: true,
  color: '#EF4444',
}
```

### RecurrenceRule (Future Enhancement)

**Purpose**: Support recurring events (Phase 3+)

```typescript
interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval?: number             // Every N units (e.g., every 2 weeks)
  endDate?: Date                // When recurrence ends
  count?: number                // How many occurrences
  byWeekDay?: ('MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU')[]
  byMonthDay?: number[]         // Days of month (1-31)
}
```

### CalendarMonth

**Purpose**: Container for a month's worth of calendar data

```typescript
interface CalendarMonth {
  year: number                  // Calendar year (e.g., 2025)
  month: number                 // Month (0-11, where 0 = January)
  events: CalendarEvent[]       // All events in this month
}

// Example usage
const december2025: CalendarMonth = {
  year: 2025,
  month: 11,
  events: mockEvents,
}
```

### CalendarDay (Simplified with react-day-picker)

**Purpose**: Represent a single day cell in the calendar

**Note**: react-day-picker handles grid generation via `DayPicker` component. We don't need a separate `CalendarDay` entity; instead, the library passes `DayProps` to custom components.

```typescript
// Provided by react-day-picker's DayProps
interface DayProps {
  day: Date                     // The date for this cell
  displayMonth: Date            // The month being displayed
  ... // Other props from library
}

// Custom day cell component uses DayProps
interface CustomDayCellProps {
  day: Date
  displayMonth: Date
  events: CalendarEvent[]       // Filtered events for this day
  isToday: boolean              // Whether this is today's date
  isCurrentMonth: boolean       // Whether in displayed month or overflow
}
```

---

## Data Model Architecture

### Overview Flow

```
Mock Data Layer
    ↓
    └─→ src/lib/data/mockData.ts
         (sample events)
         ↓
API Integration Layer (Phase 4+)
    ↓
    └─→ async fetchEvents(month: Date)
         (replaces mock data)
         ↓
Business Logic Layer
    ↓
    ├─→ src/lib/calendar/dateUtils.ts
    │   ├─ getEventsForDay(date, events)
    │   ├─ formatDateDisplay(date)
    │   └─ ... other helpers
    │   ↓
UI Rendering Layer
    ↓
    ├─→ src/components/calendar/MonthlyCalendar.tsx
    │   └─→ CalendarGrid (react-day-picker DayPicker)
    │       ├─→ CustomDayCell component
    │       └─→ EventList component
```

### react-day-picker Integration

**Grid Generation**: react-day-picker handles all grid calculations

```typescript
import { DayPicker } from 'react-day-picker'

<DayPicker
  mode="single"
  month={new Date(2025, 11)}          // December 2025
  fixedWeeks                          // Always 6 weeks (42 cells)
  weekStartsOn={1}                    // Monday first (ISO 8601)
  components={{
    DayCell: CustomDayCell,           // Our custom component
    WeekHeader: undefined,            // Use default week headers
  }}
  onSelect={(date) => {}}             // Future: date selection
/>
```

**Calendar Structure**:
- **Weeks**: Always 6 weeks (42 cells per FR-002)
- **Days**: 7 columns (Monday-Sunday per FR-006)
- **Overflow**: Previous/next month dates included (opacity: 0.5 per FR-005)
- **Today**: Highlighted via `modifiers` prop

### Simplified Data Flow with Library

1. **Grid Generation**: react-day-picker generates 42 cells automatically
2. **Day Rendering**: Each cell calls `CustomDayCell` with `DayProps`
3. **Event Filtering**: CustomDayCell calls `getEventsForDay(day, events)`
4. **Event Display**: EventList component renders filtered events

**Why Simplified?**
- Library handles: grid layout, accessibility, keyboard navigation
- We handle: custom styling, event display, data filtering

---

## Utility Functions

### src/lib/calendar/dateUtils.ts

```typescript
/**
 * Get all events for a specific day
 * @param day - The target date
 * @param events - Array of calendar events
 * @returns Filtered events for the day
 */
export function getEventsForDay(day: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    return (
      event.date.getFullYear() === day.getFullYear() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getDate() === day.getDate()
    )
  })
}

/**
 * Format date for display (e.g., "Monday, December 16, 2025")
 */
export function formatDateDisplay(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * Check if a date is in the current month
 */
export function isCurrentMonth(date: Date, displayMonth: Date): boolean {
  return date.getMonth() === displayMonth.getMonth() &&
         date.getFullYear() === displayMonth.getFullYear()
}
```

---

## Mock Data Strategy

### src/lib/data/mockData.ts

```typescript
import { CalendarEvent } from '@/lib/calendar/types'

export const mockEvents: CalendarEvent[] = [
  {
    id: 'evt-001',
    title: 'Team Standup',
    date: new Date(2025, 11, 16),
    startTime: '09:00',
    endTime: '09:30',
    color: '#3B82F6',
  },
  {
    id: 'evt-002',
    title: 'Project Deadline',
    date: new Date(2025, 11, 20),
    isAllDay: true,
    color: '#EF4444',
  },
  {
    id: 'evt-003',
    title: 'Client Meeting',
    date: new Date(2025, 11, 18),
    startTime: '14:00',
    endTime: '15:00',
    location: 'Conference Room A',
    color: '#10B981',
  },
  // ... more mock events for testing edge cases
]
```

**Edge Cases Covered**:
- All-day events (no time)
- Multiple events on same day (tests "+N more" indicator)
- Long titles (tests truncation)
- Various colors (tests visual categorization)
- Events across different days/weeks

---

## API Migration Path

### Phase 1-2: Mock Data
```typescript
import { mockEvents } from '@/lib/data/mockData'

// Components directly use mock data
const events = mockEvents
```

### Phase 4+: API Integration
```typescript
// New API function (no component changes needed)
export async function fetchEvents(month: Date): Promise<CalendarEvent[]> {
  const response = await fetch(
    `/api/events?year=${month.getFullYear()}&month=${month.getMonth() + 1}`
  )
  return response.json()
}

// Component usage (identical to mock version)
const events = await fetchEvents(new Date(2025, 11))
```

**Key Design Principle**: The `CalendarEvent` interface is defined once and works with both mock and API data. Component code needs zero changes.

---

## Type Definitions

### src/lib/calendar/types.ts

```typescript
export interface CalendarEvent {
  id: string
  title: string
  date: Date
  startTime?: string
  endTime?: string
  description?: string
  location?: string
  attendees?: string[]
  color?: string
  isAllDay?: boolean
  recurrence?: RecurrenceRule
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval?: number
  endDate?: Date
  count?: number
  byWeekDay?: ('MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU')[]
  byMonthDay?: number[]
}

export interface CalendarMonth {
  year: number
  month: number
  events: CalendarEvent[]
}

export interface CustomDayCellProps {
  day: Date
  displayMonth: Date
  events: CalendarEvent[]
  isToday: boolean
  isCurrentMonth: boolean
}
```

---

## Database Schema Reference (Future API)

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  description TEXT,
  location VARCHAR(255),
  color VARCHAR(7),
  is_all_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  user_id UUID REFERENCES users(id),
  UNIQUE(id),
  INDEX(user_id, date)
);

CREATE TABLE recurrence_rules (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  frequency VARCHAR(20),
  interval INT DEFAULT 1,
  end_date DATE,
  count INT,
  by_week_day VARCHAR(50),
  by_month_day VARCHAR(50),
  UNIQUE(id)
);
```

---

## Summary

| Component | Responsibility | Status |
|-----------|-----------------|--------|
| **CalendarEvent** | Single event entity | ✅ Defined (RFC 5545 compatible) |
| **RecurrenceRule** | Event repetition | ⏳ Future (Phase 3+) |
| **CalendarMonth** | Month-level container | ✅ Defined |
| **DayProps** | Grid cell from react-day-picker | ✅ From library |
| **dateUtils** | Date manipulation helpers | ✅ Designed (to implement in T012) |
| **mockData** | Sample events for development | ✅ Designed (to implement in T011) |
| **API Migration** | Seamless mock→API swap | ✅ Designed (Phase 4+) |

---

**Last Updated**: 2025-12-16  
**Version**: 1.0.0  
**Status**: ✅ Complete & Ready for Implementation
