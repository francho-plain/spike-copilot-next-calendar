# Implementation Plan: Monthly Calendar View

**Feature**: 001 - Monthly Calendar View  
**Target Scope**: User Stories 1, 2, 3  
**Timeline**: 6 weeks  
**Team Size**: 1-2 developers

---

## Executive Summary

Implement a WCAG 2.1 AA compliant monthly calendar grid using react-day-picker v9 (MIT licensed, 18.9KB gzipped). This plan focuses on:

- Library-driven implementation (react-day-picker handles grid, accessibility, keyboard navigation)
- Simplified data model (library abstracts calendar calculations)
- Responsive mobile-first design (320px → 1920px+)
- Test-driven development with strict TypeScript

**MVP Delivery**: 26 tasks (Phases 1-3) = functional calendar grid with event display  
**Full Feature**: 63 tasks (Phases 1-6) = production-ready with responsive design and polish

---

## Technical Context

### Technology Stack

| Layer                | Technology                   | Version | Rationale                                                        |
| -------------------- | ---------------------------- | ------- | ---------------------------------------------------------------- |
| **Framework**        | Next.js                      | 14+     | App Router, built-in performance optimization                    |
| **Language**         | TypeScript                   | 5.x     | Strict typing, no `any` types per constitution                   |
| **Calendar Library** | react-day-picker             | 9.x     | WCAG 2.1 AA compliant, MIT licensed, 18.9KB, handles grid + a11y |
| **Date Utilities**   | date-fns                     | 3.x     | Peer dependency of react-day-picker, immutable, tree-shakeable   |
| **Styling**          | CSS Modules                  | -       | Per constitution VI, scoped styles + centralized variables.css   |
| **Testing**          | Jest + React Testing Library | Latest  | Unit testing framework                                           |
| **Accessibility**    | @axe-core/react              | Latest  | WCAG 2.1 AA validation in tests                                  |
| **E2E Testing**      | Playwright                   | Latest  | Critical user journey validation                                 |
| **Code Quality**     | ESLint + Prettier            | Latest  | Constitution III enforcement                                     |

### Library Selection Rationale

**react-day-picker v9** selected over 4 alternatives:

| Criteria         | react-day-picker | react-calendar | react-big-calendar | FullCalendar   |
| ---------------- | ---------------- | -------------- | ------------------ | -------------- |
| **License**      | ✅ MIT           | ✅ MIT         | ✅ MIT             | ❌ Proprietary |
| **Bundle Size**  | ✅ 18.9KB        | 🟡 25KB        | ❌ 50KB+           | ❌ 100KB+      |
| **WCAG 2.1 AA**  | ✅ Yes           | ⚠️ Partial     | ⚠️ Partial         | ✅ Yes         |
| **TypeScript**   | ✅ Native        | ✅ Yes         | ⚠️ Partial         | ✅ Yes         |
| **Flexibility**  | ✅ High          | 🟡 Medium      | 🟡 Medium          | ❌ Low         |
| **Keyboard Nav** | ✅ Built-in      | 🟡 Limited     | 🟡 Limited         | ✅ Built-in    |
| **React 18**     | ✅ Yes           | ✅ Yes         | ✅ Yes             | ✅ Yes         |

**Winner**: react-day-picker v9 - provides accessibility, bundle efficiency, and built-in grid generation with fixedWeeks prop for 6-week layout.

---

## Constitution Alignment

All 7 constitution principles validated for this feature:

| Principle                  | Requirement                    | Implementation                                             | Validation                   |
| -------------------------- | ------------------------------ | ---------------------------------------------------------- | ---------------------------- |
| **I. Accessibility**       | WCAG 2.1 AA                    | react-day-picker built-in + @axe-core/react tests          | ✅ NFR-002, FR-014/015       |
| **II. Test-Driven**        | ≥80% coverage, tests first     | Jest + RTL + Playwright per phase                          | ✅ Phase 6: T062 validation  |
| **III. Clean Code**        | English + Conventional Commits | English spec + commit msg in T061                          | ✅ ESLint + Prettier in T008 |
| **IV. API-Ready**          | Mock→API seamless swap         | CalendarEvent interface RFC 5545 compat                    | ✅ data-model.md API path    |
| **V. Licensing**           | MIT or compatible              | react-day-picker MIT, date-fns MIT                         | ✅ All dependencies verified |
| **VI. CSS Modules**        | Scoped styles + variables.css  | All components use .module.css + centralized design tokens | ✅ T007 + component tasks    |
| **VII. Strong TypeScript** | No `any` types, strict mode    | Type-driven component design, T003 strict config           | ✅ T001-T063 all typed       |

---

## Project Structure

```
spike-copilot-next-calendar/
├── .specify/
│   └── memory/
│       └── constitution.md          # Project governance
├── specs/
│   └── 001-monthly-calendar-view/
│       ├── spec.md                   # Feature specification (this feature)
│       ├── plan.md                   # Implementation plan (this file)
│       ├── research.md               # Library research & rationale
│       ├── data-model.md             # Entity definitions
│       ├── tasks.md                  # 63-task breakdown
│       └── checklists/
│           └── requirements.md       # Quality validation
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with CSS variables
│   │   ├── page.tsx                  # Calendar page (from T021)
│   │   └── globals.css               # Global resets
│   ├── components/
│   │   └── calendar/                 # Calendar components (co-located: .tsx + .module.css + .test.tsx)
│   │       ├── MonthlyCalendar/
│   │       │   ├── MonthlyCalendar.tsx
│   │       │   ├── MonthlyCalendar.module.css
│   │       │   └── MonthlyCalendar.test.tsx
│   │       ├── CalendarGrid/
│   │       │   ├── CalendarGrid.tsx
│   │       │   ├── CalendarGrid.module.css
│   │       │   └── CalendarGrid.test.tsx
│   │       ├── DayCell/
│   │       │   ├── DayCell.tsx
│   │       │   ├── DayCell.module.css
│   │       │   └── DayCell.test.tsx
│   │       └── EventList/
│   │           ├── EventList.tsx
│   │           ├── EventList.module.css
│   │           └── EventList.test.tsx
│   ├── lib/
│   │   └── calendar/
│   │       ├── dateUtils.ts          # Date helpers + getEventsForDay (T012)
│   │       ├── types.ts              # CalendarEvent, CalendarMonth interfaces (T009-T010)
│   │       └── mockData.ts           # Sample events for development (T011)
│   └── styles/
│       └── variables.css             # Centralized design tokens (T007)
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── CalendarGrid.test.tsx
│   │   │   ├── DayCell.test.tsx
│   │   │   └── EventList.test.tsx
│   │   ├── lib/
│   │   │   └── dateUtils.test.ts
│   │   └── integration/
│   │       └── calendar-full.test.tsx
│   ├── accessibility/
│   │   ├── calendar-grid.a11y.test.tsx
│   │   └── event-display.a11y.test.tsx
│   ├── e2e/
│   │   ├── calendar-display.spec.ts
│   │   ├── event-display.spec.ts
│   │   ├── responsive-mobile.spec.ts
│   │   ├── responsive-tablet.spec.ts
│   │   └── responsive-desktop.spec.ts
│   └── performance/
│       └── render-time.test.ts
├── public/
│   └── fonts/                        # (Optional) Custom fonts
├── .gitignore
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc.json                  # Prettier configuration
├── tsconfig.json                     # TypeScript strict mode
├── jest.config.js                    # Jest configuration
├── playwright.config.ts              # Playwright E2E config
├── package.json
├── package-lock.json
└── README.md
```

### Key Directories

- **`src/app/`**: Next.js App Router pages (layout.tsx, page.tsx)
- **`src/components/calendar/`**: React components (MonthlyCalendar, CalendarGrid, DayCell, EventList)
- **`src/lib/calendar/`**: Business logic (dateUtils, types, mockData)
- **`src/styles/`**: Centralized design tokens (variables.css)
- **`tests/`**: Test files organized by type (unit, accessibility, e2e, performance)

---

## Development Phases

### Phase 1: Setup (8 tasks)

**Goal**: Initialize Next.js project with dependencies, tooling, and configuration

- T001-T008: Project initialization, dependencies, TypeScript/Jest/Playwright config, directory structure, ESLint/Prettier
- **Blockers**: None
- **Duration**: ~4 hours
- **Output**: Ready-to-develop Next.js project

### Phase 2: Foundational (6 tasks) - BLOCKING

**Goal**: Create base types, mock data, and utility functions

- T009-T014: Types (CalendarEvent, CalendarMonth), mock data, dateUtils, layout.tsx, a11y test setup
- **Blockers**: Must complete before Phases 3-6
- **Duration**: ~3 hours
- **Output**: Data structures and utilities ready for components

### Phase 3: User Story 1 - Calendar Grid (12 tasks)

**Goal**: Implement monthly calendar grid with react-day-picker

- T015-T026: Install react-day-picker, create MonthlyCalendar + CalendarGrid + CSS, styling, highlighting, page integration, responsive base, tests
- **Blockers**: Requires Phase 2
- **Duration**: ~8 hours
- **Output**: Functional calendar grid displaying 42 cells, week headers, today highlighted
- **MVP Checkpoint**: Deploy here for basic calendar view

### Phase 4: User Story 2 - Event Display (16 tasks)

**Goal**: Display events in calendar cells with edge case handling

- T027-T042: Create DayCell + EventList components, integrate with CalendarGrid, event rendering, edge cases ("+N more", long titles), tests
- **Blockers**: Requires Phase 3
- **Duration**: ~10 hours
- **Output**: Events display in cells with proper formatting and indicators

### Phase 5: User Story 3 - Responsive Layout (10 tasks)

**Goal**: Optimize for mobile, tablet, and desktop

- T043-T052: Responsive styles (3 breakpoints), responsive typography, touch targets, E2E tests
- **Blockers**: Requires Phase 3 (can overlap with Phase 4)
- **Duration**: ~6 hours
- **Output**: Calendar works responsively across all device sizes

### Phase 6: Polish & Validation (11 tasks)

**Goal**: Cross-cutting improvements, performance, final validation

- T053-T063: ARIA labels, keyboard navigation, loading states, CSS optimization, integration test, performance test, Lighthouse audit, JSDoc, commit validation, full test suite, README
- **Blockers**: Requires Phases 3-5
- **Duration**: ~8 hours
- **Output**: Production-ready feature with 100% test coverage and Lighthouse >90

---

## Performance Targets

| Metric                            | Target               | Tool       | Phase   |
| --------------------------------- | -------------------- | ---------- | ------- |
| **Time to Interactive (TTI)**     | <1.0s                | Lighthouse | Phase 6 |
| **First Contentful Paint (FCP)**  | <0.5s                | Lighthouse | Phase 6 |
| **Cumulative Layout Shift (CLS)** | <0.1                 | Lighthouse | Phase 6 |
| **Code Coverage**                 | ≥80%                 | Jest       | Phase 6 |
| **Bundle Size**                   | <500KB gzipped       | webpack    | Phase 6 |
| **Lighthouse Score**              | ≥90 (all categories) | Lighthouse | Phase 6 |

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

- Component rendering (CalendarGrid, DayCell, EventList)
- Event filtering and display logic
- Date utilities (getEventsForDay)
- Type validation

### Accessibility Tests (@axe-core/react)

- WCAG 2.1 AA compliance
- Color contrast validation
- ARIA labels verification
- Keyboard navigation testing

### E2E Tests (Playwright)

- Calendar grid displays correctly
- Events appear in correct cells
- Responsive layout at 3 breakpoints (375px, 768px, 1920px)
- Month navigation (future phase)

### Performance Tests

- Render time <1s (NFR-001)
- Bundle size tracking
- CSS variable efficiency

### Manual Testing Checklist

- [ ] Visual alignment at all breakpoints
- [ ] Touch targets ≥44×44px on mobile
- [ ] Keyboard navigation with arrow keys
- [ ] Screen reader compatibility (NVDA, JAWS)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)

---

## Risk Mitigation

| Risk                                   | Probability | Impact | Mitigation                                             |
| -------------------------------------- | ----------- | ------ | ------------------------------------------------------ |
| **react-day-picker API changes**       | Low         | Medium | Pin version, monitor releases                          |
| **Performance regression**             | Medium      | Medium | Lighthouse audit in Phase 6, performance tests         |
| **Accessibility issues late in cycle** | Low         | High   | Test accessibility early (Phase 2 setup in T014)       |
| **CSS complexity growth**              | Medium      | Low    | Centralized variables, strict CSS Modules structure    |
| **TypeScript strict mode challenges**  | Medium      | Low    | Clear types from day 1 (data-model.md), no workarounds |

---

## Success Criteria

- [ ] All 63 tasks completed and tested
- [ ] ≥80% code coverage (Jest)
- [ ] WCAG 2.1 AA compliance (Lighthouse accessibility ≥90)
- [ ] Performance <1s render time (Lighthouse >90)
- [ ] Responsive across 320px-1920px
- [ ] All tests passing (unit + a11y + e2e + performance)
- [ ] Zero ESLint/Prettier violations
- [ ] TypeScript strict mode with no `any` types
- [ ] README complete with setup and development instructions

---

## Dependencies & Prerequisites

### System Requirements

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 3+
- Git
- VS Code (or preferred editor)

### Package Dependencies

See Phase 1 Task T002 for complete list (react-day-picker, date-fns, @testing-library/react, @axe-core/react, @playwright/test, jest, etc.)

### External Dependencies

- GitHub repository (for version control)
- GitHub Actions (for CI/CD - optional but recommended)
- Azure DevOps (for backlog tracking)

---

## Communication & Status

### Status Reports

- Weekly: Sprint progress against tasks
- Per-phase: Milestone completion and blockers

### Documentation

- Tasks.md: Detailed task tracking
- Constitution.md: Governance & quality gates
- Research.md: Library decisions
- Data-model.md: API contracts

### Review Points

- Phase 1 completion: Project structure ready
- Phase 2 completion: Types and utilities ready
- Phase 3 completion: MVP checkpoint (calendar grid)
- Phase 6 completion: Production ready

---

## Next Steps

1. **Approve Plan**: Validate technical approach with stakeholders
2. **Execute Phase 1**: Initialize project (4 hours)
3. **Execute Phase 2**: Create foundational types and utilities (3 hours)
4. **Execute Phase 3**: Implement calendar grid (8 hours)
5. **Review MVP**: Validate calendar grid before proceeding to events
6. **Execute Phases 4-6**: Event display, responsiveness, polish (24 hours)
7. **Final Validation**: Full test suite, Lighthouse audit, deployment

---

**Last Updated**: 2025-12-16  
**Version**: 1.0.0  
**Status**: ✅ Ready for Implementation
