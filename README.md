# Spike Copilot Next Calendar

A WCAG 2.1 AA compliant monthly calendar application built with Next.js, TypeScript, and react-day-picker.

## 🎯 Project Overview

This project implements a monthly calendar view that displays events with proper accessibility support, responsive design, and test-driven development practices.

**Features**:
- 📅 Fixed 6-week grid (42 cells) monthly calendar
- ♿ WCAG 2.1 Level AA accessibility compliance
- 📱 Responsive design (320px - 1920px+)
- 🎨 CSS Modules with centralized design tokens
- ✅ Comprehensive test coverage (unit, accessibility, E2E, performance)
- 🔐 Strong TypeScript (strict mode, no `any` types)

## 🛠️ Technology Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript 5.x (strict mode)
- **Calendar Library**: react-day-picker v9 (WCAG 2.1 AA)
- **Date Utilities**: date-fns
- **Styling**: CSS Modules
- **Testing**: Jest, React Testing Library, @axe-core/react, Playwright

## 📋 Project Structure

```
spike-copilot-next-calendar/
├── .specify/                          # Specification kit infrastructure
│   ├── memory/
│   │   └── constitution.md            # Project governance (7 principles)
│   ├── scripts/bash/                  # Automation scripts
│   └── templates/                     # Document templates
├── specs/
│   └── 001-monthly-calendar-view/
│       ├── spec.md                    # Feature specification
│       ├── plan.md                    # Implementation plan
│       ├── research.md                # Library research & decisions
│       ├── data-model.md              # Entity definitions
│       ├── tasks.md                   # 63-task breakdown
│       └── checklists/
│           └── requirements.md        # Quality validation (100% passing)
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Calendar page (Phase 3)
│   │   └── globals.css                # Global styles
│   ├── components/                    # React components (co-located with tests & styles)
│   │   ├── MonthlyCalendar/
│   │   │   ├── MonthlyCalendar.tsx    # Main component
│   │   │   ├── MonthlyCalendar.module.css
│   │   │   └── MonthlyCalendar.test.tsx
│   │   ├── CalendarGrid/
│   │   │   ├── CalendarGrid.tsx       # react-day-picker wrapper
│   │   │   ├── CalendarGrid.module.css
│   │   │   └── CalendarGrid.test.tsx
│   │   ├── DayCell/
│   │   │   ├── DayCell.tsx            # Custom day cell (Phase 4)
│   │   │   ├── DayCell.module.css
│   │   │   └── DayCell.test.tsx
│   │   └── EventList/
│   │       ├── EventList.tsx          # Event display (Phase 4)
│   │       ├── EventList.module.css
│   │       └── EventList.test.tsx
│   ├── lib/
│   │   ├── calendar/                  # Calendar utilities
│   │   │   ├── types.ts               # CalendarEvent interface
│   │   │   └── dateUtils.ts           # Date helpers
│   │   └── data/
│   │       └── mockData.ts            # Sample events
│   └── styles/
│       └── variables.css              # Design tokens
├── tests/
│   ├── unit/                          # Jest unit tests
│   ├── accessibility/                 # @axe-core/react tests
│   ├── e2e/                           # Playwright E2E tests
│   └── performance/                   # Performance tests
├── package.json
├── tsconfig.json                      # TypeScript strict mode
├── jest.config.js                     # Jest configuration
├── playwright.config.ts               # Playwright configuration
├── .eslintrc.json                     # ESLint rules
├── .prettierrc.json                   # Prettier formatting
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 3+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spike-copilot-next-calendar
```

2. Install dependencies:
```bash
npm install
```

3. Verify TypeScript compilation:
```bash
npm run lint
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run all tests with coverage:
```bash
npm test
```

Run specific test suites:
```bash
npm run test:watch          # Watch mode
npm run test:a11y           # Accessibility tests
npm run test:e2e            # End-to-end tests
npm run test:all            # All checks (lint + test + a11y + e2e)
```

### Linting & Formatting

```bash
npm run lint                # Check ESLint
npm run lint:fix            # Fix ESLint issues
npm run format              # Format with Prettier
```

## 📝 Constitution & Principles

This project follows 7 core principles (see [constitution.md](./.specify/memory/constitution.md)):

1. ♿ **Accessibility by Design** - WCAG 2.1 AA mandatory
2. ✅ **Test-Driven Completion** - Tests before implementation
3. 🎯 **Clean Code** - English, Conventional Commits, linting
4. 🔌 **API-Ready Architecture** - Mock → API seamless swap
5. 📜 **Commercial Licensing** - MIT-compatible dependencies
6. 🎨 **CSS Modules** - Scoped styles + centralized variables
7. 🔒 **Strong TypeScript** - Strict mode, no `any` types

## 📊 Implementation Phases

- **Phase 1**: Project setup (8 tasks) ✅
- **Phase 2**: Foundational types & utilities (6 tasks)
- **Phase 3**: Calendar grid (US1, 12 tasks) - MVP
- **Phase 4**: Event display (US2, 16 tasks)
- **Phase 5**: Responsive layout (US3, 10 tasks)
- **Phase 6**: Polish & validation (11 tasks)

**Total**: 63 tasks across 6 phases

See [tasks.md](./specs/001-monthly-calendar-view/tasks.md) for detailed task breakdown.

## 📚 Documentation

- **[Constitution](./specs/001-monthly-calendar-view/../../.specify/memory/constitution.md)**: Project governance & principles
- **[Specification](./specs/001-monthly-calendar-view/spec.md)**: Feature requirements (3 user stories, 21 requirements)
- **[Plan](./specs/001-monthly-calendar-view/plan.md)**: Technical implementation strategy
- **[Research](./specs/001-monthly-calendar-view/research.md)**: Library selection & decisions
- **[Data Model](./specs/001-monthly-calendar-view/data-model.md)**: Entity definitions
- **[Tasks](./specs/001-monthly-calendar-view/tasks.md)**: 63-task implementation breakdown

## ✅ Quality Standards

- **Code Coverage**: ≥80% (Jest)
- **Accessibility**: WCAG 2.1 AA compliant (Lighthouse ≥90)
- **Performance**: <1 second render time (Lighthouse >90)
- **TypeScript**: Strict mode, no `any` types
- **Testing**: Unit + accessibility + E2E + performance tests

## 🔄 Development Workflow

1. Create feature branch from `main`
2. Implement tasks per phase
3. Write tests first (TDD approach)
4. Ensure all tests pass
5. Run `npm run test:all` for pre-commit validation
6. Commit with Conventional Commits format
7. Open PR with test results

## 📖 Conventional Commits Format

```
type(scope): description

body (optional)
footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

**Examples**:
```
feat(calendar): add monthly grid with react-day-picker
fix(calendar-grid): correct 6-week layout calculation
test(event-list): add unit test for +N more indicator
docs: update README with setup instructions
```

## 🐛 Known Issues & Roadmap

### Phase 1 (Current)
- [x] Project setup complete
- [ ] Phase 2: Foundational types & utilities
- [ ] Phase 3: Calendar grid (MVP)

### Future Phases
- Event creation/editing
- Month/year navigation
- Recurring events
- Event details modal
- Drag-and-drop rescheduling

See [Out of Scope](./specs/001-monthly-calendar-view/spec.md#out-of-scope-phase-2) in specification.

## 📞 Support & Contribution

For issues, questions, or contributions:
1. Check [specification](./specs/001-monthly-calendar-view/spec.md) for requirements
2. Review [constitution](./specs/001-monthly-calendar-view/../../.specify/memory/constitution.md) for principles
3. Follow [tasks](./specs/001-monthly-calendar-view/tasks.md) for implementation order

## 📄 License

MIT - See LICENSE file for details

---

**Last Updated**: 2025-12-16  
**Version**: 0.1.0  
**Status**: Phase 1 Complete - Ready for Phase 2
