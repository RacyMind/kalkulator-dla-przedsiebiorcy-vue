# MEMORY.md

## Purpose

Append-only engineering memory for `kalkulator-finansowy` so future work can reuse prior decisions quickly.

## Entry Format

For each completed task, add one section:

### YYYY-MM-DD - Short title

- Task:
- Decisions:
- Files changed:
- Tests run:
- Outcome:
- Follow-ups:

## Rules

- Append only, do not rewrite history.
- Keep entries factual and concise.
- Include exact file paths.
- Include executed tests (or explicitly state none).
- Never store secrets or credentials.

## Entries

### 2026-02-12 - Refactor README and remove roadmap file

- Task: Refaktoryzacja `README.md` pod dobre podejście repozytoryjne oraz usunięcie `ROADMAP.md`.
- Decisions:
  - Zastąpiono README wersją zorientowaną na architekturę, workflow i quality gates.
  - Zachowano zgodność komend z `package.json`.
  - Usunięto `ROADMAP.md` zgodnie z poleceniem.
- Files changed:
  - `README.md`
  - `ROADMAP.md` (deleted)
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/modules/contractOfWork/ContractWorkCalculator.test.ts` (passed: 1 file, 5 tests)
- Outcome: Repo ma aktualny README z jasnym workflow rozwoju i bez przestarzałego pliku roadmapy.
- Follow-ups: none.

### 2026-02-12 - Enforce camelCase naming preference

- Task: Updated agent guidance to enforce one naming style for variables and constants.
- Decisions:
  - Use `camelCase` for variables and constants.
  - Disallow `UPPER_SNAKE_CASE` for JS/TS constants in this project guidance.
- Files changed:
  - `AGENTS.md`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/modules/contractOfWork/ContractWorkCalculator.test.ts` (passed: 1 file, 5 tests)
- Outcome: Naming-style preference is now explicit and unambiguous.
- Follow-ups: none.

### 2026-02-12 - Rewrite AGENTS guide and add memory log

- Task: Fully rewrote `AGENTS.md` to reflect current repository practices and new operating constraints; created `MEMORY.md`.
- Decisions:
  - Use full rewrite instead of append-only AGENTS changes.
  - Adopt autonomous workflow: no confirmation prompts for file reads, file edits/creation, or test runs.
  - Start memory tracking from this change forward (no historical backfill).
- Files changed:
  - `AGENTS.md`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/modules/contractOfWork/ContractWorkCalculator.test.ts` (passed: 1 file, 5 tests)
- Outcome: Documentation baseline updated for future agent sessions.
- Follow-ups: none.
