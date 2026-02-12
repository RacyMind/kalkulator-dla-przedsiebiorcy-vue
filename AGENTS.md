# AGENTS.md - Codex Agent Guide

## Mission

Build and maintain `kalkulator-finansowy` with high confidence in business logic, stable architecture, and fast, test-backed delivery.

## Execution Autonomy

- Do not ask for permission to read files in this repository.
- Do not ask for permission to create or edit files in this repository.
- Do not ask for permission to run tests in this repository.
- Proceed directly unless a platform-enforced permission gate appears.

## Project Snapshot

- Product: Polish financial calculator (PWA + Android via Capacitor)
- Domain: salaries, taxes, ZUS, investments, limits, and related calculators under Polish law
- Live: `https://kalkulatorfinansowy.app`
- Android: `racyMind.kalkulator`

## Core Stack

- Vue 3 (`<script setup lang="ts">`)
- Quasar 2
- Pinia
- TypeScript (strict)
- Vite via `@quasar/app-vite`
- Vitest + `@vue/test-utils` + happy-dom
- SCSS
- Chart.js + vue-chartjs

## Repository Structure

Primary application code is in `src/`.

Key areas:

- `src/components/<moduleName>/` calculator modules
- `src/components/partials/` shared UI
- `src/logic/` shared business logic (taxes, ZUS, helpers, base calculator)
- `src/stores/` Pinia stores + year-dependent constants
- `src/router/routes.ts` routes
- `test/vitest/__tests__/` tests

Do not create new top-level/base directories without approval.

## Architecture Rules

Use `src/components/contractWork/` as canonical module reference.

Each module should follow:

- `components/`
- `interfaces/`
- `logic/`
- `pages/`
- `types/`
- `store.ts`

Calculator logic:

- Extend `BasicCalculator<InputFields, Result>`
- Implement `Calculator<InputFields, Result>`
- Use chain pattern:
  - `new MyCalculator().setInputData(input).calculate().getResult()`

Store pattern:

- Keep `inputFields` in state.
- Compute `result` in a getter from calculator class.
- Keep HMR support in `store.ts`.

Before creating new components, composables, or logic helpers, check existing code and reuse what already exists.

## Coding Conventions

Follow existing conventions from sibling files in the same module/path before editing.

General:

- UI text must be in Polish.
- Use Polish diacritics in user-facing UI text.
- Use descriptive names:
  - prefer `isRegisteredForDiscounts`
  - avoid unclear names like `discount()`
- Keep identifier style consistent:
  - use `camelCase` for both variables and constants
  - do not use `UPPER_SNAKE_CASE` for JS/TS constants
- Keep comments minimal and only for non-obvious logic.
- Keep module types consolidated (single type file pattern per module).

TypeScript and imports:

- Prefer Vite aliases (`src/`, `components/`, `stores/`, `logic/`, `composables/`) over deep relative imports.
- Use enums for state/status values instead of free-form status strings.

Lint/format expectations (enforced):

- No semicolons
- Single quotes
- Trailing commas on multiline structures
- PascalCase component names in templates

## Testing Policy

A change is not complete until tests proving behavior are added or updated and executed successfully.

Use tests instead of ad hoc verification scripts when tests can prove functionality.

Commands:

- All tests: `npm run test:unit:ci`
- Specific test: `npx vitest run <path-to-test>`
- Lint: `npm run lint`

Test location:

- `test/vitest/__tests__/...`

Recommended module-test pattern:

- Set a static law-rules year in `beforeEach` (do not depend on current system year)
- Assert all result fields, not a subset
- Include invalid input scenarios that should throw when data is missing

## Dependency and Structure Controls

- Do not add, remove, or upgrade dependencies without approval.
- Do not introduce new base folders without approval.

## Frontend Visibility Checklist

If a frontend change is reported as missing:

1. Confirm the relevant branch and files are updated.
2. Ask the user to run `npm start` for dev view.
3. If checking production bundle behavior, ask the user to run `npm run build`.

## Communication Style

- Keep responses concise.
- Focus explanations on business logic, architecture decisions, and tradeoffs.
- Skip obvious details and avoid filler.

## Documentation Rules

- Create documentation files only when explicitly requested.
- Keep documentation updates aligned with real repository state (paths, commands, conventions).

## Memory Log

Maintain `MEMORY.md` as an append-only engineering memory for this repository.

When a task is finished, add one concise entry with:

- date
- task summary
- key decisions
- files touched
- tests run
- outcome and follow-ups
