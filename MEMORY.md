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

### 2026-02-12 - Use accessible-person icon for PFRON related cards

- Task: Updated PFRON entries in related calculators to use an accessibility-oriented icon instead of calculator icon.
- Decisions:
  - Added a new shared icon key: `accessiblePerson` in landing icons map.
  - Applied icon change only to business pages already linking to PFRON (`kalkulator-b2b`, `porownywarka-b2b`, `kalkulator-vat`).
  - Kept related links selective (no global rollout to all landing subpages).
- Files changed:
  - `landing-page/_includes/icons.php`
  - `landing-page/_pages/kalkulator-b2b.php`
  - `landing-page/_pages/porownywarka-b2b.php`
  - `landing-page/_pages/kalkulator-vat.php`
  - `test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts`
  - `MEMORY.md`
- Tests run:
  - `php -l landing-page/_includes/icons.php`
  - `php -l landing-page/_pages/kalkulator-b2b.php`
  - `php -l landing-page/_pages/porownywarka-b2b.php`
  - `php -l landing-page/_pages/kalkulator-vat.php`
  - `npx vitest run test/vitest/__tests__/landingPage/PfronLandingPage.smoke.test.ts` (passed: 1 file, 5 tests)
- Outcome: PFRON cards now use an accessibility-specific icon and test coverage protects this contract.
- Follow-ups: none.

### 2026-02-12 - Redesign Google Play screenshots to editorial card style

- Task: Rebuilt Google Play screenshot generation to produce premium editorial mockups with marketing copy aligned to landing-page messaging, while keeping full phone and tablet asset sets ready for Play Console.
- Decisions:
  - Set `editorial` as default screenshot style and kept `frame` as fallback style.
  - Added `copy-source=landing` contract and centralized per-screen marketing copy in the screenshot config.
  - Preserved raw capture + compositing workflow and regenerated all 16 mixed-theme assets plus canonical upload aliases.
  - Added dedicated script tests for config, layout renderer, generation pipeline, and asset contract.
- Files changed:
  - `scripts/lib/store-screenshots-config.mjs`
  - `scripts/lib/store-screenshots-core.mjs`
  - `scripts/generate-store-screenshots.mjs`
  - `test/vitest/__tests__/scripts/StoreScreenshotsConfig.test.ts`
  - `test/vitest/__tests__/scripts/StoreScreenshotsGeneration.test.ts`
  - `test/vitest/__tests__/scripts/StoreScreenshotsBanner.test.ts`
  - `test/vitest/__tests__/scripts/StoreScreenshotsAssetsContract.test.ts`
  - `graphics/Google Play/phone/01-main-menu-dark.png`
  - `graphics/Google Play/phone/02-umowa-o-prace-light.png`
  - `graphics/Google Play/phone/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/phone/04-samozatrudnienie-light.png`
  - `graphics/Google Play/phone/05-faktura-vat-dark.png`
  - `graphics/Google Play/phone/06-ikze-light.png`
  - `graphics/Google Play/phone/07-ike-dark.png`
  - `graphics/Google Play/phone/08-obligacje-light.png`
  - `graphics/Google Play/tablet-7/01-main-menu-dark.png`
  - `graphics/Google Play/tablet-7/02-umowa-o-prace-light.png`
  - `graphics/Google Play/tablet-7/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/tablet-7/04-samozatrudnienie-light.png`
  - `graphics/Google Play/tablet-10/01-main-menu-dark.png`
  - `graphics/Google Play/tablet-10/02-umowa-o-prace-light.png`
  - `graphics/Google Play/tablet-10/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/tablet-10/04-samozatrudnienie-light.png`
  - `graphics/Google Play/phone/01-main-menu.png`
  - `graphics/Google Play/phone/02-umowa-o-prace.png`
  - `graphics/Google Play/phone/03-porownywarka-b2b.png`
  - `graphics/Google Play/phone/04-samozatrudnienie.png`
  - `graphics/Google Play/phone/05-faktura-vat.png`
  - `graphics/Google Play/phone/06-ikze.png`
  - `graphics/Google Play/phone/07-ike.png`
  - `graphics/Google Play/phone/08-obligacje.png`
  - `graphics/Google Play/tablet-7/01-main-menu.png`
  - `graphics/Google Play/tablet-7/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-7/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-7/04-samozatrudnienie.png`
  - `graphics/Google Play/tablet-10/01-main-menu.png`
  - `graphics/Google Play/tablet-10/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-10/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-10/04-samozatrudnienie.png`
  - `graphics/Google Play/phone/raw/01-main-menu.png`
  - `graphics/Google Play/phone/raw/02-umowa-o-prace.png`
  - `graphics/Google Play/phone/raw/03-porownywarka-b2b.png`
  - `graphics/Google Play/phone/raw/04-samozatrudnienie.png`
  - `graphics/Google Play/phone/raw/05-faktura-vat.png`
  - `graphics/Google Play/phone/raw/06-ikze.png`
  - `graphics/Google Play/phone/raw/07-ike.png`
  - `graphics/Google Play/phone/raw/08-obligacje.png`
  - `graphics/Google Play/tablet-7/raw/01-main-menu.png`
  - `graphics/Google Play/tablet-7/raw/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-7/raw/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-7/raw/04-samozatrudnienie.png`
  - `graphics/Google Play/tablet-10/raw/01-main-menu.png`
  - `graphics/Google Play/tablet-10/raw/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-10/raw/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-10/raw/04-samozatrudnienie.png`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/scripts/StoreScreenshotsConfig.test.ts test/vitest/__tests__/scripts/StoreScreenshotsGeneration.test.ts test/vitest/__tests__/scripts/StoreScreenshotsBanner.test.ts test/vitest/__tests__/scripts/StoreScreenshotsAssetsContract.test.ts` (passed: 4 files, 10 tests)
- Outcome: Google Play assets now use editorial-card composition with landing-consistent marketing copy and validated output contracts for phone and tablet uploads.
- Follow-ups: Validate final visual ordering in Google Play Console preview and fine-tune per-slide copy if truncation appears on smaller store previews.

### 2026-02-12 - Fix editorial screenshot copy clipping and set law-rule field to 2026

- Task: Adjusted editorial screenshot rendering to avoid text clipping, removed the extra "Kalkulator finansowy" badge, and forced the "Data obowiązywania przepisów" field to show year `2026` in captured screens.
- Decisions:
  - Replaced single-line copy rendering with line-wrapped headline/subline in the editorial header.
  - Removed the pill badge from editorial compositions to keep cleaner hierarchy.
  - Updated capture flow to set the law-rule year through UI interaction with `q-select` option `2026` rather than raw localStorage date string.
  - Re-captured and regenerated full phone+tablet asset sets and canonical aliases.
- Files changed:
  - `scripts/lib/store-screenshots-core.mjs`
  - `scripts/capture-store-screenshots.mjs`
  - `test/vitest/__tests__/scripts/StoreScreenshotsBanner.test.ts`
  - `graphics/Google Play/phone/raw/01-main-menu-dark.png`
  - `graphics/Google Play/phone/raw/02-umowa-o-prace-light.png`
  - `graphics/Google Play/phone/raw/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/phone/raw/04-samozatrudnienie-light.png`
  - `graphics/Google Play/phone/raw/05-faktura-vat-dark.png`
  - `graphics/Google Play/phone/raw/06-ikze-light.png`
  - `graphics/Google Play/phone/raw/07-ike-dark.png`
  - `graphics/Google Play/phone/raw/08-obligacje-light.png`
  - `graphics/Google Play/tablet-7/raw/01-main-menu-dark.png`
  - `graphics/Google Play/tablet-7/raw/02-umowa-o-prace-light.png`
  - `graphics/Google Play/tablet-7/raw/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/tablet-7/raw/04-samozatrudnienie-light.png`
  - `graphics/Google Play/tablet-10/raw/01-main-menu-dark.png`
  - `graphics/Google Play/tablet-10/raw/02-umowa-o-prace-light.png`
  - `graphics/Google Play/tablet-10/raw/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/tablet-10/raw/04-samozatrudnienie-light.png`
  - `graphics/Google Play/phone/01-main-menu-dark.png`
  - `graphics/Google Play/phone/02-umowa-o-prace-light.png`
  - `graphics/Google Play/phone/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/phone/04-samozatrudnienie-light.png`
  - `graphics/Google Play/phone/05-faktura-vat-dark.png`
  - `graphics/Google Play/phone/06-ikze-light.png`
  - `graphics/Google Play/phone/07-ike-dark.png`
  - `graphics/Google Play/phone/08-obligacje-light.png`
  - `graphics/Google Play/tablet-7/01-main-menu-dark.png`
  - `graphics/Google Play/tablet-7/02-umowa-o-prace-light.png`
  - `graphics/Google Play/tablet-7/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/tablet-7/04-samozatrudnienie-light.png`
  - `graphics/Google Play/tablet-10/01-main-menu-dark.png`
  - `graphics/Google Play/tablet-10/02-umowa-o-prace-light.png`
  - `graphics/Google Play/tablet-10/03-porownywarka-b2b-dark.png`
  - `graphics/Google Play/tablet-10/04-samozatrudnienie-light.png`
  - `graphics/Google Play/phone/01-main-menu.png`
  - `graphics/Google Play/phone/02-umowa-o-prace.png`
  - `graphics/Google Play/phone/03-porownywarka-b2b.png`
  - `graphics/Google Play/phone/04-samozatrudnienie.png`
  - `graphics/Google Play/phone/05-faktura-vat.png`
  - `graphics/Google Play/phone/06-ikze.png`
  - `graphics/Google Play/phone/07-ike.png`
  - `graphics/Google Play/phone/08-obligacje.png`
  - `graphics/Google Play/tablet-7/01-main-menu.png`
  - `graphics/Google Play/tablet-7/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-7/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-7/04-samozatrudnienie.png`
  - `graphics/Google Play/tablet-10/01-main-menu.png`
  - `graphics/Google Play/tablet-10/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-10/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-10/04-samozatrudnienie.png`
  - `graphics/Google Play/phone/raw/01-main-menu.png`
  - `graphics/Google Play/phone/raw/02-umowa-o-prace.png`
  - `graphics/Google Play/phone/raw/03-porownywarka-b2b.png`
  - `graphics/Google Play/phone/raw/04-samozatrudnienie.png`
  - `graphics/Google Play/phone/raw/05-faktura-vat.png`
  - `graphics/Google Play/phone/raw/06-ikze.png`
  - `graphics/Google Play/phone/raw/07-ike.png`
  - `graphics/Google Play/phone/raw/08-obligacje.png`
  - `graphics/Google Play/tablet-7/raw/01-main-menu.png`
  - `graphics/Google Play/tablet-7/raw/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-7/raw/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-7/raw/04-samozatrudnienie.png`
  - `graphics/Google Play/tablet-10/raw/01-main-menu.png`
  - `graphics/Google Play/tablet-10/raw/02-umowa-o-prace.png`
  - `graphics/Google Play/tablet-10/raw/03-porownywarka-b2b.png`
  - `graphics/Google Play/tablet-10/raw/04-samozatrudnienie.png`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/scripts/StoreScreenshotsConfig.test.ts test/vitest/__tests__/scripts/StoreScreenshotsGeneration.test.ts test/vitest/__tests__/scripts/StoreScreenshotsBanner.test.ts` (passed: 3 files, 9 tests)
  - `npx vitest run test/vitest/__tests__/scripts/StoreScreenshotsAssetsContract.test.ts` (passed: 1 file, 1 test)
- Outcome: Editorial graphics no longer clip copy, badge was removed, and captured screens show law-rule year as `2026` in the form field.
- Follow-ups: none.

### 2026-02-12 - Tighten copy-to-mockup spacing and increase device exposure

- Task: Reduced the vertical distance between marketing copy and device mockup, so the mockup area is taller while preserving typography hierarchy.
- Decisions:
  - Reduced editorial copy block height from `0.22` to `0.205` of canvas height.
  - Reduced copy-to-card gap from `0.016` to `0.009` of canvas height.
  - Added a regression test that enforces tighter spacing and minimum screenshot height on phone layout.
  - Regenerated all phone and tablet editorial assets and refreshed canonical `NN-*.png` aliases.
- Files changed:
  - `scripts/lib/store-screenshots-core.mjs`
  - `test/vitest/__tests__/scripts/StoreScreenshotsBanner.test.ts`
  - `graphics/Google Play/phone/*.png`
  - `graphics/Google Play/phone/raw/*.png`
  - `graphics/Google Play/tablet-7/*.png`
  - `graphics/Google Play/tablet-7/raw/*.png`
  - `graphics/Google Play/tablet-10/*.png`
  - `graphics/Google Play/tablet-10/raw/*.png`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/scripts/StoreScreenshotsBanner.test.ts test/vitest/__tests__/scripts/StoreScreenshotsGeneration.test.ts` (passed: 2 files, 8 tests)
- Outcome: Final mockups have smaller top gap and visibly taller device windows, with preserved non-clipped top content (logo/app bar) in phone main-menu slide.
- Follow-ups: none.

### 2026-02-12 - Fix web and PWA GTM configuration for analytics tracking

- Task: Implemented option 1 (keep GTM + dataLayer), corrected GTM ID configuration, and added test coverage for GTM id validation/template contract.
- Decisions:
  - Introduced centralized GTM ID validation/normalization helper in app logic.
  - Normalized `VITE_GTM_ID` in `quasar.config.ts` before exposing it to client env.
  - Wrapped GTM snippet in `index.html` with a conditional so script is injected only when `VITE_GTM_ID` is present after normalization.
  - Updated `.env` to use valid GTM container format and `.env.example` to document expected format.
- Files changed:
  - `src/logic/gtm.ts`
  - `quasar.config.ts`
  - `index.html`
  - `.env`
  - `.env.example`
  - `test/vitest/__tests__/logic/GtmConfig.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/logic/GtmConfig.test.ts` (passed: 1 file, 3 tests)
  - `npm run build` (passed: Quasar PWA build)
- Outcome: Web/PWA builds now inject GTM with valid container id `GTM-MKR8Z54`; invalid/non-GTM ids are filtered out and no longer silently produce malformed GTM bootstrap.
- Follow-ups: In GTM container, verify GA4 tags/triggers for `customPageView` and `customEvent` are published.
