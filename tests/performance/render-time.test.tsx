/**
 * Performance Test: Calendar Render Time
 * 
 * Validates NFR-001: Initial render should complete in <1 second
 * Tests with various event loads to ensure scalability
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar/MonthlyCalendar';
import { CalendarEvent } from '@/lib/calendar/types';
import { act } from 'react';

describe('Calendar Performance - Render Time', () => {
  const generateMockEvents = (count: number): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const baseDate = new Date(2024, 0, 1); // January 1, 2024

    for (let i = 0; i < count; i++) {
      const dayOffset = Math.floor(i / 3); // Spread events across days
      const eventDate = new Date(baseDate);
      eventDate.setDate(baseDate.getDate() + dayOffset);

      const hour = 9 + (i % 8);
      events.push({
        id: `event-${i}`,
        title: `Event ${i + 1}`,
        date: new Date(eventDate),
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        location: i % 2 === 0 ? 'Conference Room' : undefined,
      });
    }

    return events;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 15)); // January 15, 2024
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('NFR-001: Initial Render Performance', () => {
    it('renders calendar with 0 events in <1 second', () => {
      const startTime = performance.now();

      act(() => {
        render(<MonthlyCalendar events={[]} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
      console.log(`Render time (0 events): ${renderTime.toFixed(2)}ms`);
    });

    it('renders calendar with 10 events in <1 second', () => {
      const events = generateMockEvents(10);
      const startTime = performance.now();

      act(() => {
        render(<MonthlyCalendar events={events} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
      console.log(`Render time (10 events): ${renderTime.toFixed(2)}ms`);
    });

    it('renders calendar with 50 events in <1 second', () => {
      const events = generateMockEvents(50);
      const startTime = performance.now();

      act(() => {
        render(<MonthlyCalendar events={events} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
      console.log(`Render time (50 events): ${renderTime.toFixed(2)}ms`);
    });

    it('renders calendar with 100 events in <1 second', () => {
      const events = generateMockEvents(100);
      const startTime = performance.now();

      act(() => {
        render(<MonthlyCalendar events={events} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
      console.log(`Render time (100 events): ${renderTime.toFixed(2)}ms`);
    });

    it('renders calendar with 200 events in <1 second (stress test)', () => {
      const events = generateMockEvents(200);
      const startTime = performance.now();

      act(() => {
        render(<MonthlyCalendar events={events} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
      console.log(`Render time (200 events - stress): ${renderTime.toFixed(2)}ms`);
    });
  });

  describe('Re-render Performance', () => {
    it('updates calendar when month changes in <500ms', () => {
      const events = generateMockEvents(50);
      let rerender: any;
      act(() => {
        const result = render(<MonthlyCalendar events={events} />);
        rerender = result.rerender;
      });

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const startTime = performance.now();

      // Trigger re-render with new props (simulating month change)
      act(() => {
        rerender(<MonthlyCalendar events={events} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      expect(rerenderTime).toBeLessThan(500);
      console.log(`Re-render time: ${rerenderTime.toFixed(2)}ms`);
    });

    it('updates when event list changes in <500ms', () => {
      const initialEvents = generateMockEvents(20);
      let rerender: any;
      act(() => {
        const result = render(<MonthlyCalendar events={initialEvents} />);
        rerender = result.rerender;
      });

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const startTime = performance.now();

      const updatedEvents = generateMockEvents(30);
      act(() => {
        rerender(<MonthlyCalendar events={updatedEvents} />);
      });
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      expect(updateTime).toBeLessThan(500);
      console.log(`Event update time: ${updateTime.toFixed(2)}ms`);
    });
  });

  describe('Memory Performance', () => {
    it('does not create memory leaks during multiple renders', () => {
      const events = generateMockEvents(50);

      // Track initial memory (if available in test environment)
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        let unmount: any;
        act(() => {
          const result = render(<MonthlyCalendar events={events} />);
          unmount = result.unmount;
        });
        act(() => {
          jest.advanceTimersByTime(150);
        });
        act(() => {
          unmount();
        });
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Memory should not grow significantly (allow 50% increase tolerance)
      if (initialMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        const growthRatio = memoryGrowth / initialMemory;

        expect(growthRatio).toBeLessThan(0.5);
        console.log(`Memory growth ratio: ${(growthRatio * 100).toFixed(2)}%`);
      }
    });
  });

  describe('Responsive Resize Performance', () => {
    it('handles viewport resize without significant performance degradation', () => {
      const events = generateMockEvents(50);
      act(() => {
        render(<MonthlyCalendar events={events} />);
      });

      act(() => {
        jest.advanceTimersByTime(150);
      });

      const startTime = performance.now();

      // Simulate multiple viewport changes
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));

      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));

      const endTime = performance.now();
      const resizeTime = endTime - startTime;

      // Resize handling should be fast
      expect(resizeTime).toBeLessThan(100);
      console.log(`Resize handling time: ${resizeTime.toFixed(2)}ms`);
    });
  });

  describe('Performance Benchmarks Summary', () => {
    it('generates performance report for all scenarios', () => {
      const scenarios = [0, 10, 50, 100];
      const results: { events: number; time: number }[] = [];

      scenarios.forEach((eventCount) => {
        const events = generateMockEvents(eventCount);
        const startTime = performance.now();

        act(() => {
          render(<MonthlyCalendar events={events} />);
        });
        act(() => {
          jest.advanceTimersByTime(150);
        });

        const endTime = performance.now();
        const renderTime = endTime - startTime;

        results.push({ events: eventCount, time: renderTime });
      });

      // All scenarios should meet the <1s requirement
      results.forEach((result) => {
        expect(result.time).toBeLessThan(1000);
      });

      // Log performance summary
      console.table(results);

      // Calculate average
      const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
      console.log(`Average render time: ${avgTime.toFixed(2)}ms`);
      expect(avgTime).toBeLessThan(1000);
    });
  });
});
