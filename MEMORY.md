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

### 2026-02-12 - Add PFRON landing subpage and related links for business pages

- Task: Added a new landing subpage for PFRON social contribution refunds, updated related calculators on selected business pages, and extended sitemap coverage.
- Decisions:
  - New slug set to `kalkulator-refundacja-skladek-spolecznych-pfron`.
  - Updated `related` only on `kalkulator-b2b`, `porownywarka-b2b`, and `kalkulator-vat`.
  - Added dedicated screenshot assets (`png` + `webp`) for the new landing page.
  - Added one minimal smoke test for landing consistency (page, related links, sitemap).
- Files changed:
  - `landing-page/_pages/kalkulator-refundacja-skladek-spolecznych-pfron.php`
  - `landing-page/_pages/kalkulator-b2b.php`
  - `landing-page/_pages/porownywarka-b2b.php`
  - `landing-page/_pages/kalkulator-vat.php`
  - `landing-page/sitemap.xml`
  - `landing-page/images/modules/kalkulator-refundacja-skladek-spolecznych-pfron.png`
  - `landing-page/images/modules/kalkulator-refundacja-skladek-spolecznych-pfron.webp`
  - `test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts` (passed: 1 file, 3 tests)
- Outcome: Landing page and business-related cross-linking for PFRON are implemented and test-backed.
- Follow-ups: none.

### 2026-02-12 - Regenerate PFRON landing screenshot with visible results and no ads

- Task: Re-generated landing screenshot asset for the PFRON page to show calculated results and remove ad blocks from the captured frame.
- Decisions:
  - Forced light mode and premium state in browser storage during screenshot capture.
  - Triggered calculation before capture so result panel is populated.
  - Removed `.advert-wrapper` and `.adsense-wrapper` from DOM before capturing.
- Files changed:
  - `landing-page/images/modules/kalkulator-refundacja-skladek-spolecznych-pfron.png`
  - `landing-page/images/modules/kalkulator-refundacja-skladek-spolecznych-pfron.webp`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts` (passed: 1 file, 3 tests)
- Outcome: Screenshot now matches requirement: result section visible and ads hidden.
- Follow-ups: none.

### 2026-02-12 - Add PFRON landing link to footer navigation

- Task: Added missing footer link for the new PFRON landing page and extended smoke test coverage.
- Decisions:
  - Footer link added under the calculators list.
  - Smoke test now validates footer contains the PFRON landing link.
- Files changed:
  - `landing-page/_includes/footer.php`
  - `test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts` (passed: 1 file, 4 tests)
- Outcome: Footer navigation includes the new PFRON subpage and regression is covered by tests.
- Follow-ups: none.

### 2026-02-12 - Document local PHP server workflow for landing page

- Task: Updated repository docs with explicit instructions for running the landing page on a local PHP server.
- Decisions:
  - Added a dedicated AGENTS section for manual landing-page checks (`php -S ...`, open URL, stop process).
  - Added README quick-start snippet for local PHP server in `landing-page/`.
- Files changed:
  - `AGENTS.md`
  - `README.md`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts` (passed: 1 file, 4 tests)
- Outcome: Manual QA flow for landing-page is now explicit and repeatable in both agent and project docs.
- Follow-ups: none.
