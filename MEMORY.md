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

### 2026-02-13 - Migrate web analytics to GA4 gtag and add landing-page GA4 include

- Task: Naprawiono analitykę web przez przejście z GTM `dataLayer` custom events na bezpośrednie GA4 `gtag` oraz dodano GA4 do landing page.
- Decisions:
  - Ujednolicono ścieżkę web na `gtag('event', ...)` i `gtag('event', 'page_view', ...)`.
  - Zachowano natywną ścieżkę Firebase Analytics bez zmian behawioralnych.
  - Dodano env `VITE_GA_MEASUREMENT_ID` i usunięto aktywne include GTM w landing page.
  - W landing page ustawiono domyślny identyfikator `G-9P7ZTHLC47` z opcjonalnym override `GA_MEASUREMENT_ID`.
- Files changed:
  - `src/logic/analytics.ts`
  - `index.html`
  - `quasar.config.ts`
  - `.env.example`
  - `landing-page/_includes/ga4.php`
  - `landing-page/index.php`
  - `landing-page/_includes/layout.php`
  - `landing-page/_includes/gtm.php` (deleted)
  - `landing-page/_includes/gtm-noscript.php` (deleted)
  - `test/vitest/__tests__/logic/Analytics.test.ts`
  - `test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/logic/Analytics.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed: 2 files, 8 tests)
  - `npm run test:unit:ci` (failed: istniejący problem niezwiązany ze zmianą, brak assetu `graphics/Google Play/phone/01-main-menu-dark.png` w `StoreScreenshotsAssetsContract.test.ts`)
  - `php -l landing-page/_includes/ga4.php` (passed)
  - `php -l landing-page/index.php` (passed)
  - `php -l landing-page/_includes/layout.php` (passed)
- Outcome: Web i landing page korzystają z GA4 `gtag`; nowe testy kontraktowe i logiki analityki przechodzą.
- Follow-ups: Przywrócić brakujący asset screenshotów Google Play, aby ponownie domknąć pełny `npm run test:unit:ci`.

### 2026-02-13 - Implement consent-first analytics (web + landing + Android) and add app regulations

- Task: Wdro�ono zgod� analityczn� (RODO) dla GA4/Firebase Analytics oraz zast�piono disclaimer pe�nym regulaminem dost�pnym w aplikacji.
- Decisions:
  - Zastosowano wsp�lny stan zgody `kf-consent-v1` dla web, landing i Android.
  - Wdro�ono Consent Mode Advanced z domy�lnym `denied` dla `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`.
  - Emisja event�w analitycznych zosta�a zablokowana bez zgody (web i native).
  - Dla Android przy odrzuceniu zgody ustawiane jest `DENIED` i wykonywane `resetAnalyticsData()`.
  - Dodano stron� `/regulamin`, linki prawne w formularzu oraz rozszerzono strony bez reklam o `/regulamin`.
- Files changed:
  - `src/types/Consent.ts`
  - `src/logic/consent.ts`
  - `src/logic/analytics.ts`
  - `src/boot/consent.ts`
  - `quasar.config.ts`
  - `index.html`
  - `src/components/partials/ConsentBanner.vue`
  - `src/layouts/MainLayout.vue`
  - `src/components/privacyPolicy/Index.vue`
  - `src/components/regulations/pages/Index.vue`
  - `src/router/routes.ts`
  - `src/components/partials/form/SubmitButton.vue`
  - `src/components/partials/menu/menuItems.ts`
  - `src/services/admob/adConfig.ts`
  - `landing-page/_includes/ga4.php`
  - `landing-page/_includes/consent.php`
  - `landing-page/index.php`
  - `landing-page/_includes/layout.php`
  - `test/vitest/__tests__/logic/Analytics.test.ts`
  - `test/vitest/__tests__/logic/Consent.test.ts`
  - `test/vitest/__tests__/components/SubmitButtonLegalLinks.test.ts`
  - `test/vitest/__tests__/router/LegalRoutesContract.test.ts`
  - `test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts`
  - `test/vitest/__tests__/services/admob/AdMobService.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/logic/Analytics.test.ts test/vitest/__tests__/logic/Consent.test.ts test/vitest/__tests__/components/SubmitButtonLegalLinks.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts test/vitest/__tests__/services/admob/AdMobService.test.ts test/vitest/__tests__/router/LegalRoutesContract.test.ts` (passed: 6 files, 40 tests)
  - `npx vitest run test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed: 1 file, 4 tests)
  - `npm run test:unit:ci` (passed: 74 files, 535 tests)
  - `npm run lint` (failed: istniej�ce wcze�niej b��dy/warnings w plikach niezwi�zanych z zadaniem)
- Outcome: Aplikacja i landing page wymagaj� decyzji u�ytkownika dla analityki, Android respektuje zgody i resetuje dane po wycofaniu, a stary disclaimer zosta� zast�piony pe�nym regulaminem oraz linkami prawnymi.
- Follow-ups: Rozwa�y� doko�czenie porz�dk�w lint (4 aktywne b��dy w niezwi�zanych komponentach) oraz audyt reklam pod k�tem osobnych zg�d marketingowych.

### 2026-02-13 - Place consent banner above AdMob banner on Android

- Task: Naprawiono nak�adanie si� banera zg�d na reklam� AdMob w aplikacji Android.
- Decisions:
  - Dodano globalny offset CSS `--admob-banner-offset` ustawiany w `admob` boot na podstawie wysoko�ci reklamy.
  - Baner zg�d u�ywa teraz `bottom: calc(... + var(--admob-banner-offset))`, wi�c zawsze renderuje si� nad reklam�.
  - Dodano test regresyjny bootu AdMob sprawdzaj�cy aktualizacj� offsetu przy show/hide reklamy.
- Files changed:
  - `src/boot/admob.ts`
  - `src/components/partials/ConsentBanner.vue`
  - `test/vitest/__tests__/boot/admobBoot.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/boot/admobBoot.test.ts test/vitest/__tests__/services/admob/AdMobService.test.ts` (passed: 2 files, 25 tests)
  - `npm run test:unit:ci` (passed: 74 files, 535 tests)
- Outcome: Na Androidzie baner zg�d nie jest ju� przykrywany przez AdMob i utrzymuje poprawny odst�p przy zmianie widoczno�ci reklamy.
- Follow-ups: none.

### 2026-02-17 - Route-aware responsive menu behavior in MainLayout

- Task: Implemented separate menu behavior for desktop and mobile. Desktop keeps the side menu open except on dashboard, while mobile uses overlay drawer.
- Decisions:
  - Desktop persistence uses the condition `isDesktop && route.path !== '/'`.
  - Added `leftDrawerOpen` reset when entering desktop mode to clear stale mobile-open state.
  - Added regression coverage for desktop/mobile behavior, mobile navigation close, and breakpoint switch.
- Files changed:
  - `src/layouts/MainLayout.vue`
  - `test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts` (passed: 1 file, 5 tests)
  - `npm run test:unit:ci` (passed: 75 files, 540 tests)
- Outcome: Menu behavior now matches desktop/mobile requirements and is protected by focused regression tests.
- Follow-ups: none.

### 2026-02-17 - Fix mobile drawer close regression in MainLayout

- Task: Fixed an issue where the mobile side menu could remain open and not close reliably after the desktop/dashboard behavior change.
- Decisions:
  - Switched `QDrawer` binding to `v-model="leftDrawerOpen"` as the single source of truth.
  - Added explicit watcher on `[isDesktop, isDashboardRoute]` to enforce desktop-open rules and clear stale mobile-open state.
  - Kept mobile behavior as overlay drawer and validated close path via drawer update event.
- Files changed:
  - `src/layouts/MainLayout.vue`
  - `test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts` (passed: 1 file, 6 tests)
  - `npm run test:unit:ci` (passed: 75 files, 541 tests)
- Outcome: Mobile drawer can now be closed correctly while desktop/dashboard rules remain intact.
- Follow-ups: none.

### 2026-02-17 - Ensure mobile drawer closes on backdrop click

- Task: Adjusted drawer behavior so tapping/clicking outside the drawer on mobile closes the menu reliably.
- Decisions:
  - Set QDrawer behavior explicitly to desktop/mobile via `:behavior="isDesktop ? 'desktop' : 'mobile'`.
  - Removed `breakpoint=0` override to avoid blocking native mobile drawer interaction semantics.
  - Extended layout tests to assert drawer behavior mode and mobile close event path.
- Files changed:
  - src/layouts/MainLayout.vue
  - test/vitest/**tests**/layouts/MainLayout.responsiveDrawer.test.ts
  - MEMORY.md
- Tests run:
  - npx vitest run test/vitest/**tests**/layouts/MainLayout.responsiveDrawer.test.ts (passed: 1 file, 6 tests)
  - npm run test:unit:ci (passed: 75 files, 541 tests)
- Outcome: Mobile drawer now follows overlay/backdrop close behavior while desktop/dashboard rules remain correct.
- Follow-ups: none.

### 2026-02-17 - Fix submit scroll and responsive tab panel clipping after mobile to desktop switch

- Task: Fixed two UI regressions: submit action not reliably scrolling to results, and tabbed result panels being visually clipped after resizing from mobile to desktop.
- Decisions:
  - Updated `useScrollToResults` to wait for render tick and animation frame before scrolling.
  - Updated `helpers.scrollToElement` to use deterministic target alignment with header offset and tolerance, without viewport-visibility early return.
  - Introduced `useResponsiveTabPanels` composable and applied it to all tabbed result pages.
  - Replaced static `swipeable` and removed `:breakpoint="0"`; now `q-tab-panels` uses `:swipeable="isMobileTabMode"` and `:key="tabPanelsKey"`.
- Files changed:
  - `src/composables/useResponsiveTabPanels.ts`
  - `src/composables/useScrollToResults.ts`
  - `src/logic/helpers.ts`
  - `src/components/accountingWithSpouse/pages/Index.vue`
  - `src/components/contractOfEmployment/pages/Index.vue`
  - `src/components/contractOfMandate/pages/Index.vue`
  - `src/components/polishBonds/pages/Index.vue`
  - `src/components/rentalProfit/pages/Index.vue`
  - `src/components/selfEmployment/pages/Index.vue`
  - `test/vitest/__tests__/logic/HelpersScrollToElement.test.ts`
  - `test/vitest/__tests__/composables/useScrollToResults.test.ts`
  - `test/vitest/__tests__/composables/useResponsiveTabPanels.test.ts`
  - `test/vitest/__tests__/modules/ResponsiveTabbedPagesContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/logic/HelpersScrollToElement.test.ts test/vitest/__tests__/composables/useScrollToResults.test.ts test/vitest/__tests__/composables/useResponsiveTabPanels.test.ts test/vitest/__tests__/modules/ResponsiveTabbedPagesContract.test.ts` (passed: 4 files, 11 tests)
  - `npm run test:unit:ci` (passed: 79 files, 552 tests)
- Outcome: Submit scrolling is deterministic and tabbed result layouts remain stable when switching from mobile to desktop while preserving selected tab.
- Follow-ups: Validate manually in browser/device once MCP Chrome is available in this environment.

### 2026-02-18 - Pie chart percentages and UX legend redesign

- Task: Replaced pie chart monetary presentation with percentage presentation and introduced a more readable HTML legend under the chart.
- Decisions:
  - Kept business data in amounts and changed only presentation layer for pie/doughnut charts.
  - Added shared percentage helper (`calculatePieChartPercentages`, `formatPieChartPercentage`) used by tooltip and legend.
  - Disabled canvas legend in pie charts and rendered custom legend rows with color swatch, label, percentage, and progress bar.
  - Preserved extensibility by letting external tooltip `label` callbacks override default behavior.
- Files changed:
  - `src/components/partials/Chart.vue`
  - `src/components/partials/statistics/PieChart.vue`
  - `src/composables/usePieChartPercentages.ts`
  - `test/vitest/__tests__/composables/usePieChartPercentages.test.ts`
  - `test/vitest/__tests__/components/PieChart.test.ts`
  - `test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/composables/usePieChartPercentages.test.ts test/vitest/__tests__/components/PieChart.test.ts test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts` (passed: 3 files, 11 tests)
  - `npx eslint src/components/partials/Chart.vue src/components/partials/statistics/PieChart.vue src/composables/usePieChartPercentages.ts test/vitest/__tests__/composables/usePieChartPercentages.test.ts test/vitest/__tests__/components/PieChart.test.ts test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts` (passed)
- Outcome: Pie charts now display percentages in tooltips and in an improved legend optimized for readability on mobile and desktop.
- Follow-ups: none.

### 2026-02-18 - Sortowanie legendy pie, ukrywanie 0% i sanitizacja ujemnych warto�ci w samozatrudnieniu

- Task: Updated pie chart behavior to sort legend items by descending percentage, hide 0% legend entries, and prevent negative income from appearing as a chart segment in self-employment statistics.
- Decisions:
  - Added centralized pie data sanitization in `usePieChart` so all non-positive and invalid values are normalized to `0` before rendering.
  - Kept percentage computation in `usePieChartPercentages` and changed legend rendering logic in `PieChart.vue` to filter `percentage > 0` and sort descending.
  - Added stable tie handling in legend sorting by preserving original input order for equal percentages.
  - Replaced self-employment chart visibility condition with `hasChartData` based on sanitized dataset positivity instead of raw `income` truthiness.
- Files changed:
  - `src/composables/usePieChart.ts`
  - `src/components/partials/statistics/PieChart.vue`
  - `src/components/selfEmployment/components/Statistics.vue`
  - `test/vitest/__tests__/components/PieChart.test.ts`
  - `test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts`
  - `test/vitest/__tests__/composables/usePieChart.test.ts`
  - `test/vitest/__tests__/modules/selfEmployment/SelfEmploymentStatistics.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/components/PieChart.test.ts test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts test/vitest/__tests__/composables/usePieChart.test.ts test/vitest/__tests__/modules/selfEmployment/SelfEmploymentStatistics.test.ts` (passed: 4 files, 12 tests)
  - `npx eslint src/composables/usePieChart.ts src/components/partials/statistics/PieChart.vue src/components/selfEmployment/components/Statistics.vue test/vitest/__tests__/components/PieChart.test.ts test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts test/vitest/__tests__/composables/usePieChart.test.ts test/vitest/__tests__/modules/selfEmployment/SelfEmploymentStatistics.test.ts` (passed)
  - `npm run test:unit:ci` (passed: 84 files, 569 tests)
- Outcome: Pie legend now reflects meaningful contribution order, zero-share noise is removed, and negative self-employment income is no longer rendered as a pie segment.
- Follow-ups: none.

### 2026-02-18 - Global UX/UI cleanup for line/bar charts and legend visibility adjustments

- Task: Improved chart UX/UI by reducing X-axis density globally for line/bar charts, hiding legend in spouse settlement and B2B comparator charts, and modernizing chart option configs for inflation, purchasing power, and exchange rates.
- Decisions:
  - Added global non-pie chart defaults in `Chart.vue` for readability: tooltip index mode, non-intersect tooltip, auto-skip X ticks, max 8 X ticks, no X-label rotation, and capped Y ticks.
  - Migrated affected modules from legacy Chart.js option keys (`legend`, `xAxes`, `yAxes`) to modern keys (`plugins.legend`, `scales.x`, `scales.y`).
  - Kept legend hidden explicitly in `accountingWithSpouse` and `b2bComparator` chart options while preserving horizontal bar orientation.
  - Added focused component/module tests validating legend visibility and X-axis density contracts.
- Files changed:
  - `src/components/partials/Chart.vue`
  - `src/components/accountingWithSpouse/components/Statistics.vue`
  - `src/components/b2bComparator/components/Statistics.vue`
  - `src/components/inflation/InflationStatistics.vue`
  - `src/components/inflation/PurchasingPowerOfMoneyStatistics.vue`
  - `src/components/exchangeRates/CurrencyStatistics.vue`
  - `test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts`
  - `test/vitest/__tests__/modules/accountingWithSpouse/StatisticsChartOptions.test.ts`
  - `test/vitest/__tests__/modules/b2bComparator/StatisticsChartOptions.test.ts`
  - `test/vitest/__tests__/modules/inflation/InflationStatistics.chartOptions.test.ts`
  - `test/vitest/__tests__/modules/inflation/PurchasingPowerOfMoneyStatistics.chartOptions.test.ts`
  - `test/vitest/__tests__/modules/exchangeRates/CurrencyStatistics.chartOptions.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint src/components/accountingWithSpouse/components/Statistics.vue src/components/b2bComparator/components/Statistics.vue src/components/exchangeRates/CurrencyStatistics.vue src/components/inflation/InflationStatistics.vue src/components/inflation/PurchasingPowerOfMoneyStatistics.vue src/components/partials/Chart.vue test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts test/vitest/__tests__/modules/accountingWithSpouse/StatisticsChartOptions.test.ts test/vitest/__tests__/modules/b2bComparator/StatisticsChartOptions.test.ts test/vitest/__tests__/modules/exchangeRates/CurrencyStatistics.chartOptions.test.ts test/vitest/__tests__/modules/inflation/InflationStatistics.chartOptions.test.ts test/vitest/__tests__/modules/inflation/PurchasingPowerOfMoneyStatistics.chartOptions.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts test/vitest/__tests__/modules/accountingWithSpouse/StatisticsChartOptions.test.ts test/vitest/__tests__/modules/b2bComparator/StatisticsChartOptions.test.ts test/vitest/__tests__/modules/inflation/InflationStatistics.chartOptions.test.ts test/vitest/__tests__/modules/inflation/PurchasingPowerOfMoneyStatistics.chartOptions.test.ts test/vitest/__tests__/modules/exchangeRates/CurrencyStatistics.chartOptions.test.ts` (passed: 6 files, 11 tests)
  - `npm run test:unit:ci` (passed: 89 files, 576 tests)
- Outcome: Target modules now hide legends where required, line/bar charts are visibly cleaner on X-axis, and chart option configs are consistent with current Chart.js API.
- Follow-ups: `npm run lint` still reports pre-existing repository-wide warnings/errors in unrelated files.

### 2026-02-18 - Fix inflation chart tooltip unit to percent

- Task: Fixed inflation chart tooltip so hovered values display percentage instead of PLN.
- Decisions:
  - Added module-level tooltip formatter in `InflationStatistics.vue` to keep fix local and avoid regressions in other line/bar charts that still require currency formatting.
  - Kept one decimal place and `pl-PL` locale formatting for consistency with inflation UI.
- Files changed:
  - `src/components/inflation/InflationStatistics.vue`
  - `test/vitest/__tests__/modules/inflation/InflationStatistics.chartOptions.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint src/components/inflation/InflationStatistics.vue test/vitest/__tests__/modules/inflation/InflationStatistics.chartOptions.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/modules/inflation/InflationStatistics.chartOptions.test.ts` (passed: 1 file, 2 tests)
  - `npm run test:unit:ci` (passed: 89 files, 577 tests)
- Outcome: Hover tooltip on inflation chart now shows values as percentages (`%`) instead of z�ot�wka.
- Follow-ups: none.

### 2026-02-18 - Fix BAR tooltip hover behavior after global chart UX update

- Task: Repaired BAR chart hover labels by fixing default tooltip interaction in shared `Chart.vue`.
- Decisions:
  - Split default tooltip interaction by chart type in shared chart wrapper.
  - For `bar` charts set default tooltip to `mode: 'nearest'` and `intersect: true`.
  - Kept existing defaults for line charts (`mode: 'index'`, `intersect: false`) and pie percentage tooltip logic.
  - Added regression assertions to keep tooltip ownership in shared `Chart.vue` (no local tooltip override in BAR module statistics components).
- Files changed:
  - `src/components/partials/Chart.vue`
  - `test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts`
  - `test/vitest/__tests__/modules/accountingWithSpouse/StatisticsChartOptions.test.ts`
  - `test/vitest/__tests__/modules/b2bComparator/StatisticsChartOptions.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint src/components/partials/Chart.vue test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts test/vitest/__tests__/modules/accountingWithSpouse/StatisticsChartOptions.test.ts test/vitest/__tests__/modules/b2bComparator/StatisticsChartOptions.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/components/Chart.tooltipPiePercent.test.ts test/vitest/__tests__/modules/accountingWithSpouse/StatisticsChartOptions.test.ts test/vitest/__tests__/modules/b2bComparator/StatisticsChartOptions.test.ts` (passed: 3 files, 9 tests)
  - `npm run test:unit:ci` (passed: 89 files, 578 tests)
- Outcome: BAR tooltip hover now uses nearest-point interaction and labels behave correctly again.
- Follow-ups: none.

### 2026-02-18 - Prepare release 6.1.1 with UI and chart display updates

- Task: Prepared version `6.1.1` for publication (PWA + Android) and added changelog note about interface improvements and updated chart rendering.
- Decisions:
  - Bumped app/runtime versions to `6.1.1` in web and Capacitor metadata.
  - Increased Android `versionCode` from `60008` to `60009` and aligned `versionName` with package version.
  - Added a new top changelog entry dated `2026-02-18` with two items: interface fix and chart display update.
  - Added a release contract test to keep package version, constants store version, and latest changelog entry synchronized.
- Files changed:
  - `package.json`
  - `src-capacitor/package.json`
  - `src-capacitor/android/app/build.gradle`
  - `src/stores/constantsStore.ts`
  - `src/components/changeLogs/logs.ts`
  - `test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts`
  - `test/vitest/__tests__/release/ReleaseMetadata.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/android/AndroidMetadata.test.ts` (passed: 1 file, 2 tests)
  - `npx vitest run test/vitest/__tests__/release/ReleaseMetadata.test.ts` (passed: 1 file, 2 tests)
  - `npm run test:unit:ci` (passed: 90 files, 580 tests)
- Outcome: Release metadata and in-app versioning are consistent for `6.1.1`; changelog is updated and covered by automated tests.
- Follow-ups: none.

### 2026-02-18 - Fix Android drawer overlap with AdMob banner

- Task: Fixed Android issue where the drawer menu was visually covered by the bottom AdMob banner.
- Decisions:
  - Kept AdMob lifecycle unchanged (no hide/show toggle on drawer open).
  - Applied drawer-level bottom padding using existing CSS variable `--admob-banner-offset` plus `safe-area-inset-bottom`.
  - Added deterministic regression coverage in layout tests by asserting MainLayout source contract for drawer style binding and AdMob offset formula.
- Files changed:
  - `src/layouts/MainLayout.vue`
  - `test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts` (passed: 1 file, 7 tests)
  - `npx vitest run test/vitest/__tests__/boot/admobBoot.test.ts` (passed: 1 file, 3 tests)
  - `npm run test:unit:ci` (passed: 90 files, 581 tests)
- Outcome: Drawer content now reserves space for AdMob banner on Android, preventing bottom menu/footer actions from being obscured.
- Follow-ups: none.

### 2026-02-19 - Improve landing page cookies panel UX to Quasar-like bottom banner

- Task: Reworked landing page cookies UI/UX to match the Quasar app pattern (bottom fixed banner with centered card), improved modal interactions, and validated behavior via contract tests and local PHP smoke check.
- Decisions:
  - Introduced dedicated consent CSS classes inside `consent.php` to guarantee deterministic bottom positioning and max-width card layout (`920px`) without relying on landing CSS rebuild.
  - Kept existing consent storage/API contract (`kf-consent-v1`, `granted/denied`) and preserved element IDs used by analytics integration.
  - Made `consent-manage-button` visible only after a consent decision; hidden while banner is active.
  - Added modal close UX on `Escape` and backdrop click, with body scroll lock while modal is open.
- Files changed:
  - `landing-page/_includes/consent.php`
  - `test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts`
  - `test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts` (passed: 2 files, 8 tests)
  - `php -l landing-page/_includes/consent.php` (passed)
  - `php -S 127.0.0.1:8000 router.php` + `Invoke-WebRequest http://127.0.0.1:8000/` smoke check (HTTP 200, consent markers present)
- Outcome: Landing page cookies panel now follows Quasar-like UX at the bottom of the page, with improved settings modal interaction and maintained analytics consent contract.
- Follow-ups: none.

### 2026-02-19 - Increase cookies banner padding on landing page

- Task: Improved cookies banner spacing so text and action buttons no longer feel tight against edges.
- Decisions:
  - Increased mobile banner side insets from `8px` to `12px` and desktop insets from `16px` to `20px`.
  - Increased banner card inner spacing from `p-4` to `p-5 sm:p-6`.
  - Added regression assertion in landing page consent UI contract test for the new padding classes.
- Files changed:
  - `landing-page/_includes/consent.php`
  - `test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed: 2 files, 8 tests)
- Outcome: Cookies banner now has visibly safer inner and outer spacing on mobile and desktop.
- Follow-ups: none.

### 2026-02-19 - Unify cookies settings modal UX/UI with landing banner style

- Task: Improved cookies settings modal visual hierarchy and interaction quality to match the banner style and remove UX inconsistency.
- Decisions:
  - Refactored modal into clear sections: header, body option card, and action footer with top border.
  - Added dedicated close button (`consent-settings-close`) and wired close behavior to the same handler as cancel/backdrop/Escape.
  - Kept consent storage and decision flow unchanged (`kf-consent-v1`, `granted/denied`).
  - Preserved and validated Polish copy with diacritics and pointer cursor contract for all consent buttons.
- Files changed:
  - `landing-page/_includes/consent.php`
  - `test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed)
  - `php -l landing-page/_includes/consent.php` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed: 2 files, 10 tests)
- Outcome: Cookies settings modal now has consistent UI/UX with the banner and smoother close interactions.
- Follow-ups: none.

### 2026-02-19 - Enforce centered full-screen cookies settings modal with working dark mode

- Task: Fixed cookies settings modal so it is always centered and uses full-page overlay; corrected dark/light differentiation on landing page with Tailwind `darkMode: 'media'`.
- Decisions:
  - Replaced reliance on `.dark ...` selectors with explicit `@media (prefers-color-scheme: dark)` overrides for modal surfaces and overlay.
  - Enforced full-screen overlay contract: fixed positioning, `inset: 0`, `100vw`, `100dvh`, high z-index (`z-[4000]`), and pointer-event gating tied to modal open class.
  - Kept consent business logic/storage unchanged and preserved close/focus UX flow.
- Files changed:
  - `landing-page/_includes/consent.php`
  - `test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed)
  - `php -l landing-page/_includes/consent.php` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/LandingConsentUiContract.test.ts test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts` (passed: 2 files, 12 tests)
- Outcome: Modal is now guaranteed centered with full-page overlay and properly differentiated dark/light styling on landing page.
- Follow-ups: none.

### 2026-02-19 - Add drawer install CTA with Android Google Play and PWA install fallback

- Task: Added a single context-aware install CTA in drawer footer: Google Play on Android mobile web, PWA install on other web contexts, and hidden CTA when app is already installed.
- Decisions:
  - Implemented installation visibility logic in dedicated composable `useInstallCta` (platform detection + `beforeinstallprompt` + `appinstalled`).
  - Treated "installed" as either native Capacitor app or web standalone mode (`display-mode: standalone` / `navigator.standalone`).
  - Removed legacy Google Play entry from `menuItems` app section to avoid duplicate CTA surface.
  - Kept CTA integration in `MainLayout` footer (not menu list) to support action-based PWA prompt flow.
- Files changed:
  - `src/composables/useInstallCta.ts`
  - `src/layouts/MainLayout.vue`
  - `src/components/partials/menu/menuItems.ts`
  - `test/vitest/__tests__/composables/useInstallCta.test.ts`
  - `test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts`
  - `test/vitest/__tests__/components/menu/menuItems.appSection.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/composables/useInstallCta.test.ts test/vitest/__tests__/layouts/MainLayout.responsiveDrawer.test.ts test/vitest/__tests__/components/menu/menuItems.appSection.test.ts` (passed: 3 files, 18 tests)
  - `npm run test:unit:ci` (passed: 93 files, 600 tests)
- Outcome: Drawer now exposes one non-duplicated installation CTA with correct platform behavior and hides itself after installation detection.
- Follow-ups: none.

### 2026-02-20 - Remove landing-page render-blocking Google Fonts via local Roboto hosting

- Task: Eliminated render-blocking Google Fonts requests on landing pages while preserving Roboto typography and validating delivery contracts with tests.
- Decisions:
  - Removed external Google Fonts/preconnect tags from shared landing head include and kept local `/dist/style.css` as the critical stylesheet.
  - Self-hosted Roboto in `landing-page/fonts/roboto/` using local `woff2` assets (latin + latin-ext) and defined `@font-face` for weights `400`, `500`, `700` with `font-display: swap`.
  - Added Apache `woff2` MIME/cache directives in `.htaccess` to make font delivery explicit and cacheable.
  - Added a dedicated landing performance contract test to prevent regressions in head/font loading.
- Files changed:
  - `landing-page/_includes/head-common.php`
  - `landing-page/style.css`
  - `landing-page/.htaccess`
  - `landing-page/fonts/roboto/roboto-latin-ext.woff2`
  - `landing-page/fonts/roboto/roboto-latin.woff2`
  - `landing-page/fonts/roboto/LICENSE`
  - `test/vitest/__tests__/landingPage/LandingHeadPerformanceContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `.\landing-page\tailwindcss.exe --input .\landing-page\style.css --output .\landing-page\dist\style.css --minify` (passed)
  - `php -l landing-page/_includes/head-common.php` (passed)
  - `npx eslint test/vitest/__tests__/landingPage/LandingHeadPerformanceContract.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage` (passed: 4 files, 21 tests)
- Outcome: Landing templates no longer depend on `fonts.googleapis.com`/`fonts.gstatic.com` in the critical path, and Roboto is served locally with regression coverage.
- Follow-ups: none.

### 2026-02-20 - Assert generated landing dist CSS includes local Roboto

- Task: Addressed follow-up concern by explicitly validating that generated `landing-page/dist/style.css` contains local Roboto references and no Google Fonts URLs.
- Decisions:
  - Kept `landing-page/dist/` ignored in git as repository policy currently defines.
  - Added a dedicated contract assertion for generated dist output instead of relying only on source CSS checks.
- Files changed:
  - `test/vitest/__tests__/landingPage/LandingHeadPerformanceContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `.\landing-page\tailwindcss.exe --input .\landing-page\style.css --output .\landing-page\dist\style.css --minify` (passed)
  - `npx eslint test/vitest/__tests__/landingPage/LandingHeadPerformanceContract.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/LandingHeadPerformanceContract.test.ts` (passed: 1 file, 5 tests)
  - `npx vitest run test/vitest/__tests__/landingPage` (passed: 4 files, 22 tests)
- Outcome: Contract now guarantees generated dist CSS references local Roboto assets and avoids external Google Fonts regressions.
- Follow-ups: none.

### 2026-02-20 - Defer GA4 gtag script loading to post-load idle on landing and SPA

- Task: Reduced render-path impact of GA4 by removing immediate head load of `gtag.js` and introducing deferred dynamic loading after `window.load` + idle, while keeping consent-mode behavior and analytics contracts.
- Decisions:
  - Preserved policy to always initialize GA consent defaults (`denied`) and queue `gtag` commands immediately via local stub.
  - Replaced static `<script async src=...>` with idempotent dynamic loader (`loadGaScriptOnce`) scheduled on `load` and `requestIdleCallback` (with `setTimeout` fallback).
  - Kept landing-page consent integration contract unchanged via `window.kfApplyAnalyticsConsent`.
  - Extended contract tests to enforce deferred-loading pattern and no static head inclusion of `gtag.js`.
- Files changed:
  - `index.html`
  - `landing-page/_includes/ga4.php`
  - `test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts`
  - `test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `php -l landing-page/_includes/ga4.php` (passed)
  - `npx eslint test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/AnalyticsSnippetContract.test.ts test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts` (passed: 2 files, 5 tests)
  - `npx vitest run test/vitest/__tests__/landingPage` (passed: 4 files, 22 tests)
  - `npm run test:unit:ci` (passed: 95 files, 606 tests)
- Outcome: GA4 script download is moved out of the critical rendering path for both landing page and SPA while preserving consent-mode and analytics event contracts.
- Follow-ups: none.

### 2026-02-20 - Deliver responsive landing images to reduce oversized image transfer

- Task: Implemented responsive image delivery for landing hero and calculator screenshots to reduce LCP image transfer and remove oversized WebP payloads.
- Decisions:
  - Added generated WebP breakpoints (`400w`, `640w`, `960w`) for hero and all SEO landing module screenshots.
  - Updated homepage and shared landing layout `<picture>` sources to use `srcset` + explicit `sizes` matching actual render widths.
  - Kept PNG fallback in `<img>` for compatibility while serving smaller WebP candidates to modern browsers.
  - Added contract tests that validate markup, dynamic layout templating, and existence of generated image variants.
- Files changed:
  - `scripts/generate-landing-responsive-images.mjs`
  - `package.json`
  - `landing-page/index.php`
  - `landing-page/_includes/layout.php`
  - `landing-page/images/hero-screenshot-400.webp`
  - `landing-page/images/hero-screenshot-640.webp`
  - `landing-page/images/hero-screenshot-960.webp`
  - `landing-page/images/modules/*-400.webp`
  - `landing-page/images/modules/*-640.webp`
  - `landing-page/images/modules/*-960.webp`
  - `test/vitest/__tests__/landingPage/LandingResponsiveImagesContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `php -l landing-page/index.php` (passed)
  - `php -l landing-page/_includes/layout.php` (passed)
  - `npx eslint test/vitest/__tests__/landingPage/LandingResponsiveImagesContract.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/landingPage/LandingResponsiveImagesContract.test.ts` (passed: 1 file, 3 tests)
- Outcome: Landing pages now ship responsive screenshot variants and select smaller assets per viewport, with automated regression coverage for markup and generated files.
- Follow-ups: none.

### 2026-02-21 - Add SoftwareApplication JSON-LD to SPA/PWA app entry

- Task: Added structured data JSON-LD for the `/app` web application/PWA so crawlers can classify the SPA as a `SoftwareApplication`.
- Decisions:
  - Limited scope to `index.html` (`/app`) and did not modify landing-page schema blocks.
  - Used `SoftwareApplication` schema (not `WebApplication`) to stay consistent with existing SEO approach.
  - Kept a contract test in the existing app head snippet suite to prevent schema regression.
- Files changed:
  - `index.html`
  - `test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts` (passed: 1 file, 2 tests)
- Outcome: SPA/PWA head now includes JSON-LD with app identity, category, platform, free-offer metadata, URL, and author; contract coverage enforces continued presence.
- Follow-ups: none.

### 2026-02-21 - Normalize JSON-LD Polish characters to literal UTF-8

- Task: Replaced Unicode escape sequences in SPA JSON-LD (`\u...`) with literal Polish characters to keep source text human-readable and consistent with repository conventions.
- Decisions:
  - Kept file encoding as UTF-8 and used direct diacritics (`Ł`, `ą`, `ę`, `ż`, etc.) in JSON-LD values.
  - Retained the same schema fields and contract assertions.
- Files changed:
  - `index.html`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts` (passed: 1 file, 2 tests)
- Outcome: JSON-LD now uses readable Polish text in source while preserving behavior and passing regression checks.
- Follow-ups: none.

### 2026-02-21 - Persist UTF-8/Polish glyph rule in AGENTS.md

- Task: Added an explicit repository rule for encoding and Polish diacritics handling in source files.
- Decisions:
  - Documented UTF-8 as required text encoding for source files.
  - Documented that Polish characters must stay literal and must not be converted to `\uXXXX` escapes.
- Files changed:
  - `AGENTS.md`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts` (passed: 1 file, 2 tests)
- Outcome: Agent guidance now explicitly prevents future regressions in Polish text encoding style.
- Follow-ups: none.

### 2026-02-21 - Unblock /app crawling and enforce SPA canonical consistency

- Task: Enabled crawling for the SPA shell, added `/app` to sitemap discovery, and aligned SPA metadata signals to one canonical URL.
- Decisions:
  - Removed `/app/` disallow from `robots.txt` to allow bot access to the SPA shell.
  - Added `https://kalkulatorfinansowy.app/app` to sitemap with monthly cadence and lower priority than homepage.
  - Standardized SPA metadata URL to `https://kalkulatorfinansowy.app/app` across canonical, `og:url`, and JSON-LD.
  - Added SEO contract test coverage for robots/sitemap plus metadata consistency assertions in existing SPA head contract.
- Files changed:
  - `landing-page/robots.txt`
  - `landing-page/sitemap.xml`
  - `index.html`
  - `test/vitest/__tests__/landingPage/SeoIndexingContract.test.ts`
  - `test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/landingPage/SeoIndexingContract.test.ts test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts` (passed: 2 files, 6 tests)
- Outcome: `/app` is crawlable, discoverable via sitemap, and canonicalized consistently for SPA metadata signals with regression tests in place.
- Follow-ups: none.

### 2026-02-21 - Add reverse mode based on employer cost for UoP and mandate

- Task: Added a new amount input mode that estimates `grossAmount` from `Suma kosztów pracodawcy`, analogicznie do istniejącego trybu szacowania z netto, for `Umowa o pracę` and `Umowa zlecenie`.
- Decisions:
  - Extended `AmountTypes` with `EmployerCost` and kept `AmountTypeSelect` backward compatible via optional `showEmployerCost` prop.
  - Generalized reverse-search logic into `findGrossAmountUsingTargetAmount` and preserved `findGrossAmountUsingNetAmount` as a compatibility wrapper.
  - Added `setSumUpContributionBasis` / `getSumUpContributionBasis` to employer calculators to correctly carry annual ZUS basis in monthly reverse estimation.
  - Enabled the new UI option only in modules that expose employer-cost outputs (UoP + mandate), leaving `contractWork` unchanged.
- Files changed:
  - `src/stores/constants/types.ts`
  - `src/logic/findGrossAmountUsingNetAmount.ts`
  - `src/components/partials/form/AmountTypeSelect.vue`
  - `src/components/contractOfEmployment/components/Form.vue`
  - `src/components/contractOfMandate/components/Form.vue`
  - `src/components/contractOfEmployment/logic/EmployerCalculator.ts`
  - `src/components/contractOfMandate/logic/EmployerCalculator.ts`
  - `test/vitest/__tests__/components/AmountTypeSelect.test.ts`
  - `test/vitest/__tests__/logic/findGrossAmountUsingTargetAmount.test.ts`
  - `test/vitest/__tests__/modules/contractOfEmployment/findGrossAmountUsingEmployerCost.test.ts`
  - `test/vitest/__tests__/modules/contractOfMandate/findGrossAmountUsingEmployerCost.test.ts`
  - `test/vitest/__tests__/modules/contractOfEmployment/EmployerCalculator.test.ts`
  - `test/vitest/__tests__/modules/contractOfMandate/EmployerCalculator.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint src/stores/constants/types.ts src/logic/findGrossAmountUsingNetAmount.ts src/components/partials/form/AmountTypeSelect.vue src/components/contractOfEmployment/logic/EmployerCalculator.ts src/components/contractOfMandate/logic/EmployerCalculator.ts src/components/contractOfEmployment/components/Form.vue src/components/contractOfMandate/components/Form.vue test/vitest/__tests__/components/AmountTypeSelect.test.ts test/vitest/__tests__/logic/findGrossAmountUsingTargetAmount.test.ts test/vitest/__tests__/modules/contractOfEmployment/findGrossAmountUsingEmployerCost.test.ts test/vitest/__tests__/modules/contractOfMandate/findGrossAmountUsingEmployerCost.test.ts test/vitest/__tests__/modules/contractOfEmployment/EmployerCalculator.test.ts test/vitest/__tests__/modules/contractOfMandate/EmployerCalculator.test.ts` (passed)
  - `npm run test:unit:ci` (passed: 101 files, 624 tests)
- Outcome: Users can now estimate salary inputs from employer cost in UoP and mandate calculators with full test coverage and no regression in existing net-based estimation.
- Follow-ups: none.

### 2026-02-23 - Add overtime option in contract of employment form

- Task: Added overtime input support in `Umowa o pracę` form as an additive gross component, with configurable overtime percentage and optional per-month overtime hours.
- Decisions:
  - Implemented overtime only for `AmountTypes.Gross` to avoid ambiguity in reverse solvers for net/employer-cost modes.
  - Kept calculator interfaces unchanged (`InputFields` still carries only final `grossAmount`), applying overtime at form preprocessing level.
  - Added one overtime model (`hours + percent`) with `0-300%` validation and explanatory tooltip.
  - Reused existing monthly storage pattern via `useMonthlyAmounts` for overtime-hours-per-month.
- Files changed:
  - `src/components/contractOfEmployment/components/Form.vue`
  - `test/vitest/__tests__/modules/contractOfEmployment/ContractOfEmploymentFormOvertime.test.ts`
  - `test/vitest/__tests__/modules/contractOfEmployment/AnnualEmployeeCalculator.test.ts`
  - `test/vitest/__tests__/modules/contractOfEmployment/AnnualEmployerCalculator.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx eslint src/components/contractOfEmployment/components/Form.vue test/vitest/__tests__/modules/contractOfEmployment/ContractOfEmploymentFormOvertime.test.ts test/vitest/__tests__/modules/contractOfEmployment/AnnualEmployeeCalculator.test.ts test/vitest/__tests__/modules/contractOfEmployment/AnnualEmployerCalculator.test.ts` (passed)
  - `npx vitest run test/vitest/__tests__/modules/contractOfEmployment/ContractOfEmploymentFormOvertime.test.ts test/vitest/__tests__/modules/contractOfEmployment/AnnualEmployeeCalculator.test.ts test/vitest/__tests__/modules/contractOfEmployment/AnnualEmployerCalculator.test.ts` (passed: 3 files, 24 tests)
  - `npm run test:unit:ci` (passed: 102 files, 629 tests)
  - `npm run lint` (fails due pre-existing unrelated lint errors in other modules/files)
- Outcome: UoP now supports overtime additions in gross mode, monthly inputs are correctly expanded with overtime gross, and behavior is covered by form-level and annual regression tests.
- Follow-ups:
  - Resolve existing repo-wide lint debt unrelated to this change to restore `npm run lint` green status.

### 2026-02-23 - Remove commit message naming restrictions from repository tooling

- Task: Removed commit message format enforcement so commits are no longer blocked by Conventional Commits validation.
- Decisions:
  - Kept GitHub Actions workflow unchanged because `.github/workflows/ci.yml` does not contain commit message checks.
  - Removed the Husky `commit-msg` hook and `commitlint` configuration as the only active source of commit name restrictions.
  - Removed direct `@commitlint/*` devDependencies from project metadata.
  - Added a regression contract test to ensure commit message restrictions are not reintroduced accidentally.
- Files changed:
  - `.husky/commit-msg`
  - `commitlint.config.js`
  - `package.json`
  - `package-lock.json`
  - `test/vitest/__tests__/release/CommitMessagePolicy.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/release/CommitMessagePolicy.test.ts` (passed: 1 file, 2 tests)
  - `npm run test:unit:ci` (passed: 103 files, 631 tests)
  - `npm run lint` (fails due pre-existing unrelated lint errors in multiple existing files)
- Outcome: Commit messages are no longer constrained by repository hooks/config, and regression coverage now protects this policy.
- Follow-ups:
  - Resolve existing repo-wide lint errors unrelated to this change if full lint green is required in CI.

### 2026-03-05 - Implement GA4 app-install quality event model for Google Ads optimization

- Task: Implemented analytics refactor for Google Ads app-install efficiency monitoring by migrating to typed GA4 event names/params, adding install-quality conversion events in app flows, and preventing SPA pageview double counting.
- Decisions:
  - Kept landing-page GA4 behavior unchanged and scoped `send_page_view: false` only to SPA `index.html` where router-driven `page_view` is already emitted.
  - Introduced typed analytics event contracts in `src/types/Analytics.ts` and migrated app emitters to GA4-style event names (`calculation_submit`, `premium_*`, `support_modal_open`).
  - Replaced `cid` event parameter with `kf_cid` while retaining legacy `logEvent(category, action, label, value)` adapter for backward compatibility.
  - Instrumented conversion-quality signals in shared submit flow and premium funnel (`offer_open`, `purchase_success/cancel/error`).
- Files changed:
  - `src/types/Analytics.ts`
  - `src/logic/analytics.ts`
  - `src/components/partials/form/SubmitButton.vue`
  - `src/components/partials/PremiumActions.vue`
  - `src/components/partials/SupportAuthor.vue`
  - `src/components/partials/SupportProject.vue`
  - `index.html`
  - `test/vitest/__tests__/logic/Analytics.test.ts`
  - `test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts`
  - `test/vitest/__tests__/components/SubmitButtonLegalLinks.test.ts`
  - `test/vitest/__tests__/components/PremiumActions.test.ts`
  - `MEMORY.md`
- Tests run:
  - `npx vitest run test/vitest/__tests__/logic/Analytics.test.ts test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts test/vitest/__tests__/components/SubmitButtonLegalLinks.test.ts test/vitest/__tests__/components/PremiumActions.test.ts` (passed: 4 files, 19 tests)
  - `npx eslint src/logic/analytics.ts src/types/Analytics.ts src/components/partials/form/SubmitButton.vue src/components/partials/PremiumActions.vue src/components/partials/SupportAuthor.vue src/components/partials/SupportProject.vue test/vitest/__tests__/logic/Analytics.test.ts test/vitest/__tests__/boot/AppAnalyticsSnippetContract.test.ts test/vitest/__tests__/components/SubmitButtonLegalLinks.test.ts test/vitest/__tests__/components/PremiumActions.test.ts` (passed with warnings; no errors)
- Outcome: App now emits deterministic GA4 events suitable for import into Google Ads as install-quality conversions, SPA no longer risks duplicate automatic+manual pageviews, and behavior is test-covered.
- Follow-ups:
  - In GA4 Admin, create custom dimensions for `calculator_slug` and `error_code`.
  - In Google Ads/GA4 linking, import `first_open`, `calculation_submit`, and `premium_purchase_success` as planned conversions.
