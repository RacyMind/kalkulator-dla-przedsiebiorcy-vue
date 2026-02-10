# Tasks: Landing Page SEO

**Input**: Documents from `/specs/001-landing-seo/`
**Required**: plan.md, spec.md

**Tests**: No automated tests (static HTML). Verification via manual checks and online validators.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (US1–US6)
- Include exact file paths

## Path Conventions

- **Landing page root**: `landing-page/`
- **Subpages**: `landing-page/{slug}/index.html`
- **Shared assets**: `landing-page/images/`, `landing-page/dist/`
- **Config**: `landing-page/tailwind.config.js`

---

## Phase 1: Setup

**Goal**: Prepare infrastructure for subpages

- [x] T001 Update Tailwind content paths from `['./*.html']` to `['./**/*.html']` in `landing-page/tailwind.config.js`

**Checkpoint**: Tailwind config updated, ready to scan subdirectory HTML files

---

## Phase 2: Subpages — Structure & Content (P1) 🎯 MVP

**Goal**: Create 6 dedicated static HTML subpages with full SEO content per calculator. Each subpage uses the same layout as the main page (nav, footer, Tailwind, Roboto) and contains min. 300 words of unique educational content.

**Independent Test**: Open each subpage in browser, verify layout renders correctly, content is present, CTA links to correct SPA route.

**Template**: Follow `specs/001-landing-seo/contracts/subpage-template.md` for HTML structure.

### US1 + US3: Subpage creation (structure + SEO content combined)

- [x] T002 [US1] Create `landing-page/kalkulator-b2b/index.html` — reference subpage with full HTML structure: head (unique title/description/canonical/OG/Twitter Cards), nav (copied from main page), breadcrumb, hero with H1 + CTA to `/app/#/samozatrudnienie`, calculator screenshot, min. 300 words SEO content about B2B/samozatrudnienie/formy opodatkowania/stawki ZUS 2026, related calculators section, footer (copied from main page). Use relative paths (`../`) for shared assets.
- [x] T003 [P] [US1] Create `landing-page/kalkulator-umowa-o-prace/index.html` — same template as T002, unique content about umowa o pracę: obliczanie netto z brutto, składki ZUS pracownika, kwota wolna od podatku, koszty pracodawcy 2026. CTA to `/app/#/umowa-o-prace`. Related: `kalkulator-b2b`, `kalkulator-umowa-zlecenie`.
- [x] T004 [P] [US1] Create `landing-page/kalkulator-umowa-zlecenie/index.html` — unique content about umowa zlecenie: wynagrodzenie netto, składki ZUS zleceniobiorcy, student bez ZUS, koszty uzyskania przychodu 2026. CTA to `/app/#/umowa-zlecenie`. Related: `kalkulator-umowa-o-prace`, `kalkulator-umowa-o-dzielo`.
- [x] T005 [P] [US1] Create `landing-page/kalkulator-umowa-o-dzielo/index.html` — unique content about umowa o dzieło: koszty uzyskania przychodu 50%/20%, brak składek ZUS, podatek dochodowy 2026. CTA to `/app/#/umowa-o-dzielo`. Related: `kalkulator-umowa-zlecenie`, `kalkulator-umowa-o-prace`.
- [x] T006 [P] [US1] Create `landing-page/porownywarka-b2b/index.html` — unique content about porównanie form opodatkowania B2B: skala podatkowa vs podatek liniowy vs ryczałt, kiedy która forma się opłaca, progi podatkowe 2026. CTA to `/app/#/porownywarka-b2b`. Related: `kalkulator-b2b`, `kalkulator-vat`.
- [x] T007 [P] [US1] Create `landing-page/kalkulator-vat/index.html` — unique content about VAT: stawki VAT w Polsce, obliczanie netto/brutto, faktura VAT, zwolnienie z VAT 2026. CTA to `/app/#/faktura-vat`. Related: `kalkulator-b2b`, `porownywarka-b2b`.

**Checkpoint**: All 6 subpages render correctly in browser with unique content, correct CTA links, shared layout

---

## Phase 3: Crawlability — robots.txt & sitemap.xml (P1) 🎯 MVP

**Goal**: Enable search engine crawling and indexing of all landing page URLs.

**Independent Test**: Open `/robots.txt` and `/sitemap.xml` in browser, validate with online tools.

- [x] T008 [P] [US2] Create `landing-page/robots.txt` with `User-agent: *`, `Allow: /`, `Disallow: /app/`, `Sitemap: https://kalkulatorfinansowy.app/sitemap.xml`
- [x] T009 [P] [US2] Create `landing-page/sitemap.xml` with 7 URLs (main page + 6 subpages), `lastmod: 2026-02-08`, priorities (main: 1.0, subpages: 0.8), `changefreq` (main: monthly, subpages: yearly). Must be valid per sitemaps.org standard.

**Checkpoint**: Both files accessible, sitemap validates at xml-sitemaps.com

---

## Phase 4: Structured Data — JSON-LD (P2)

**Goal**: Add WebSite schema to main page, BreadcrumbList + HowTo to subpages for rich snippets in SERP.

**Independent Test**: Validate each URL in Google Rich Results Test — no errors.

**Note**: BreadcrumbList and HowTo are already included in subpage template (Phase 2). This phase adds WebSite schema to main page and verifies all structured data.

- [x] T010 [US4] Add JSON-LD `WebSite` with `SearchAction` to `landing-page/index.html` — insert new `<script type="application/ld+json">` block after existing FAQPage schema. Use pattern from `research.md` R6.
- [x] T011 [US4] Verify all 6 subpages have correct JSON-LD `BreadcrumbList` with proper hierarchy (Strona główna > Kalkulator X) and correct URLs
- [x] T012 [US4] Verify all 6 subpages have correct JSON-LD `HowTo` with 3+ steps describing how to use each calculator

**Checkpoint**: All pages pass Google Rich Results Test without errors

---

## Phase 5: Internal Linking & Navigation (P2)

**Goal**: Connect all pages with internal links — main page links to subpages, subpages cross-link, footer contains full sitemap.

**Independent Test**: Navigate through all pages, verify every subpage is reachable from main page and has links to related subpages.

- [x] T013 [US5] Update `landing-page/index.html` — add "Dowiedz się więcej" links in each featured calculator section (samozatrudnienie, porównywarka B2B, umowa o pracę, kalkulator IKE) pointing to corresponding subpages. Keep existing SPA CTA links.
- [x] T014 [US5] Update `landing-page/index.html` — add "Dowiedz się więcej" links in module grid cards (umowa zlecenie, umowa o dzieło, faktura VAT, kursy walut, działalność niezarejestrowana, rozliczenie z małżonkiem) pointing to corresponding subpages where they exist.
- [x] T015 [US5] Update footer in `landing-page/index.html` — add "Kalkulatory" section with links to all 6 subpages as a sitemap
- [x] T016 [US5] Update footer in all 6 subpages (`landing-page/kalkulator-b2b/index.html`, etc.) — ensure footer contains same sitemap links as main page footer
- [x] T017 [US5] Verify each subpage has "Powiązane kalkulatory" section with min. 2 links to related subpages per data-model.md mapping

**Checkpoint**: All internal links work (no 404s), every subpage reachable from main page, cross-linking present

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Final build, verification, and quality checks.

- [ ] T018 Rebuild Tailwind CSS ⚠️ MANUAL: run `npx @tailwindcss/cli -i style.css -o dist/style.css --minify` from `landing-page/` directory
- [x] T019 Verify all 7 pages (main + 6 subpages) render correctly in browser after CSS rebuild
- [x] T020 Verify title uniqueness: all 7 pages have different `<title>` tags (max 60 chars each)
- [x] T021 Verify description uniqueness: all 7 pages have different `<meta description>` (max 160 chars each)
- [x] T022 Verify H1 uniqueness: all 7 pages have different `<h1>` tags
- [x] T023 Verify canonical URLs: each page's canonical matches its actual URL
- [x] T024 Verify OG tags and Twitter Cards present on all 6 subpages with unique titles/descriptions
- [x] T025 Verify all relative paths (`../`) in subpages resolve correctly (CSS, images, favicons)
- [x] T026 Verify all CTA links in subpages point to correct SPA hash routes
- [x] T027 Spot-check SEO content: verify min. 300 words per subpage, content is in Polish, keywords used naturally

**Checkpoint**: All verification checks pass, site ready for deployment

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Subpages) ──► Phase 4 (JSON-LD verification)
  └─► Phase 3 (robots/sitemap) [parallel with Phase 2]
                                    └─► Phase 5 (Internal Linking)
                                            └─► Phase 6 (Polish)
```

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Subpages)**: Requires Phase 1 (Tailwind config)
- **Phase 3 (robots/sitemap)**: Requires Phase 1, can run **parallel** with Phase 2
- **Phase 4 (JSON-LD)**: Requires Phase 2 (subpages must exist)
- **Phase 5 (Internal Linking)**: Requires Phase 2 (subpages must exist)
- **Phase 6 (Polish)**: Requires all previous phases

### Within Phase 2

- T002 is the **reference implementation** — create first, then T003–T007 can run in parallel
- T003–T007 are all marked [P] — independent files, no dependencies between them

### Within Phase 3

- T008 and T009 can run in parallel [P]

### Parallel Opportunities

```
After T001 (setup):
  ├── T002 (reference subpage) ──► T003, T004, T005, T006, T007 (all parallel)
  └── T008, T009 (robots/sitemap — parallel with subpages)

After all subpages done:
  ├── T010, T011, T012 (JSON-LD — can overlap)
  └── T013, T014, T015 (main page linking — sequential on same file)
```

---

## Implementation Strategy

### MVP (Phase 1–3): ~11 tasks

1. Update Tailwind config (T001)
2. Create reference subpage B2B (T002)
3. Create remaining 5 subpages in parallel (T003–T007)
4. Create robots.txt + sitemap.xml (T008–T009)
5. **VALIDATE**: All subpages render, robots/sitemap accessible

### Full Implementation (Phase 4–6): ~16 additional tasks

1. Add WebSite JSON-LD to main page (T010)
2. Verify structured data on all pages (T011–T012)
3. Add internal linking on main page (T013–T015)
4. Update footers on subpages (T016–T017)
5. Rebuild CSS and final verification (T018–T027)

---

## Notes

- No automated tests — this is static HTML, verification via browser and online validators
- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario from spec.md
- All text in Polish language
- Subpages use relative paths (`../`) for shared assets
- SPA (`/app/`) is NOT modified — subpages only link to it
- Content generated during implementation, subject to owner review later
- Commit after each phase or logical group of tasks
