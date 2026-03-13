# AGENTS.md - Codex Agent Guide

## Mission

Build and maintain `kalkulator-finansowy` with high confidence in business logic, stable architecture, and fast, test-backed delivery.

## Coding Conventions

Follow existing conventions from sibling files in the same module/path before editing.

General:

- UI text must be in Polish.
- Use Polish diacritics in user-facing UI text.
- Store text files as UTF-8 and keep Polish characters as literal glyphs (do not replace them with `\uXXXX` escapes).
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

## Frontend Visibility Checklist

If a frontend change is reported as missing:

1. Confirm the relevant branch and files are updated.
2. Ask the user to run `npm start` for dev view.
3. If checking production bundle behavior, ask the user to run `npm run build`.

## Landing Page Local Server

For manual checks of the PHP landing page:

1. Run from `landing-page/`: `php -S 127.0.0.1:8000 router.php`
2. Open: `http://127.0.0.1:8000/`
3. Stop server with `Ctrl+C` (foreground) or `Stop-Process -Id <PID>` (PowerShell background process)

## Communication Style

- Keep responses concise.
- Focus explanations on business logic, architecture decisions, and tradeoffs.
- Skip obvious details and avoid filler.
