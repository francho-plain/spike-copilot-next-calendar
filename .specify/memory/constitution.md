# Project Constitution v1.1.0

## Mission
Deliver a Next.js calendar application that is accessible (WCAG 2.1 AA), testable, and maintainable with strong typing and clean code practices.

---

## Core Principles

### I. Accessibility by Design
- **Mandate**: WCAG 2.1 Level AA compliance is MANDATORY for all features
- **Implementation**:
  - All visual elements must have semantic HTML + proper ARIA labels
  - Keyboard navigation required for all interactive components
  - Color contrast ratios ≥ 4.5:1 for normal text
  - Testing via @axe-core/react in CI/CD
- **Validation**: Accessibility tests required before feature completion

### II. Test-Driven Completion
- **Mandate**: No task is complete until tests pass
- **Requirements**:
  - Unit tests: ≥80% code coverage per module
  - Accessibility tests: All WCAG 2.1 AA criteria verified via @axe-core/react
  - E2E tests: Critical user journeys tested via Playwright
  - Performance tests: NFR compliance (render time, bundle size)
- **Process**: Write test first (red), implement (green), refactor (clean)
- **Validation**: CI/CD gates require all tests passing

### III. Clean Code & Conventions
- **Language**: All code, comments, and documentation in ENGLISH only
- **Commit Messages**: Follow Conventional Commits v1.0.0
  - Format: `type(scope): description`
  - Types: feat, fix, docs, style, refactor, test, chore, perf
  - Example: `feat(calendar): add monthly grid with react-day-picker`
- **Code Style**:
  - ESLint configuration mandatory
  - Prettier auto-formatting enabled
  - No `console.log()` in production code (use structured logging only)
- **Validation**: Pre-commit hooks enforce linting + TypeScript compilation

### IV. API-Ready Architecture
- **Design**: Build components with API integration in mind from day 1
- **CalendarEvent Interface**: Designed for iCalendar RFC 5545 compatibility
- **Data Flow**: Mock data in Phase 2, replace with API calls in Phase 4+ without component changes
- **Validation**: Data model review before any component implementation

### V. Commercial Licensing
- **License**: MIT (permissive, commercial-friendly)
- **Dependencies**: All dependencies must be MIT, Apache 2.0, or compatible
- **Validation**: License audit tool in CI/CD (e.g., license-checker)

### VI. CSS Modules Architecture
- **Structure**: All styling via CSS Modules (*.module.css) with scoped class names
- **Design Tokens**: Centralized variables.css for colors, spacing, typography, breakpoints
- **No TailwindCSS**: Pure CSS Modules for explicit control
- **Responsive**: Mobile-first approach (320px base → tablet 768px → desktop 1024px+)
- **Validation**: CSS lint rules enforced, color variables verified

### VII. Strongly Typed TypeScript
- **Mode**: Strict mode enabled (noImplicitAny: true, strictNullChecks: true)
- **No `any` Types**: All variables, parameters, returns must have explicit types
- **Interfaces over Types**: Use `interface` for object contracts
- **Validation**: TypeScript compiler errors block builds
- **Process**: Type-driven development (design types → implement components)

### VIII. Component Structure Organization
- **Mandate**: Each component must be self-contained in its own directory
- **Structure**: Each component directory MUST contain exactly 3 files:
  1. `ComponentName.tsx` - React component code
  2. `ComponentName.module.css` - Component styling (CSS Module)
  3. `ComponentName.test.tsx` - Unit tests for the component
- **Path Pattern**: `src/components/<category>/<ComponentName>/`
- **Example**:
  ```
  src/components/calendar/MonthlyCalendar/
  ├── MonthlyCalendar.tsx
  ├── MonthlyCalendar.module.css
  └── MonthlyCalendar.test.tsx
  ```
- **Benefits**: High cohesion (component + styles + tests together), easy to locate related files, scalable structure
- **Validation**: Directory structure review in code reviews, linting rules enforce file locations

---

## Quality Gates

### Pre-Commit Validation
Every commit must pass:
1. ✅ TypeScript compiler (no errors or warnings)
2. ✅ ESLint rules (no violations)
3. ✅ Prettier formatting (all files formatted)
4. ✅ Component structure validation (each component: .tsx + .module.css + .test.tsx)
5. ✅ Unit tests (≥80% coverage, all passing)

### Pre-Merge Validation
Every branch merge requires:
1. ✅ All pre-commit gates passing
2. ✅ Accessibility tests passing
3. ✅ E2E tests passing (critical journeys)
4. ✅ Code review (at least 1 approval)
5. ✅ Performance benchmarks (Lighthouse >90)

### Phase Completion Criteria
Each phase must deliver:
1. ✅ All tasks passing constitution checks
2. ✅ 100% test coverage for new code
3. ✅ Documentation updated
4. ✅ No technical debt carryovers

---

## Enforcement Mechanism

| Gate | Trigger | Action | Owner |
|------|---------|--------|-------|
| **Pre-commit** | Before `git commit` | Run via husky hook | Developer |
| **Build** | On push to branch | Run in CI/CD pipeline | GitHub Actions |
| **Pre-merge** | Before PR merge | Require all checks passing | Code reviewer |
| **Deployment** | Before production release | Full test suite + Lighthouse | DevOps |

---

## Version History
- **v1.1.0** (2025-12-16): Added Principle VIII - Component Structure Organization (each component: .tsx + .module.css + .test.tsx)
- **v1.0.0** (2025-12-16): Initial constitution with 7 core principles ratified for monthly calendar feature
