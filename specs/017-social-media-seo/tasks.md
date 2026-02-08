# Tasks: Social Media & SEO – meta tagi, grafika OG, udostępnianie

**Input**: Documents from `/specs/017-social-media-seo/`
**Required**: plan.md, spec.md

**Tests**: Brak testów jednostkowych — feature nie zawiera logiki kalkulatora. Weryfikacja manualna (Facebook Sharing Debugger, X Card Validator, inspekcja HTML).

**Organization**: Tasks grouped by user scenarios (5 scenariuszy: 4× P1 MVP, 1× P2).

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## User Story Mapping

| US  | Scenario                            | Priority | Pliki                                                                                      |
| --- | ----------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| US1 | Kompletne meta tagi OG i SEO        | P1 MVP   | `index.html`                                                                               |
| US2 | Tagi Twitter/X Cards                | P1 MVP   | `index.html`                                                                               |
| US3 | Dedykowana grafika OG               | P1 MVP   | `public/images/og-image.png`                                                               |
| US4 | Zamiana Twitter → X                 | P1 MVP   | `src/components/partials/SupportProject.vue`                                               |
| US5 | Domyślne teksty udostępniania + CTA | P2       | `src/components/partials/SupportProject.vue`, `src/components/partials/adverts/Donate.vue` |

---

## Phase 1: Przygotowanie grafiki OG (US3) 🎯 MVP

**Goal**: Stworzyć dedykowaną grafikę OG 1200×630 px, która będzie używana przez meta tagi OG i Twitter/X Cards.

**Independent Test**: Otworzyć `public/images/og-image.png` w przeglądarce — wymiary 1200×630, czytelny tekst, spójność z marką (#1565C0), rozmiar < 1 MB.

- [x] T001 [US3] Stworzyć grafikę OG jako plik `public/images/og-image.png` — wymiary 1200×630 px, tło w kolorze marki #1565C0, nazwa „Kalkulator finansowy", slogan „Twój darmowy kalkulator wynagrodzeń", logo z `src/assets/app-icon.svg`, format PNG, rozmiar < 1 MB

**Checkpoint**: Grafika istnieje, ma poprawne wymiary i jest czytelna w miniaturce.

---

## Phase 2: Meta tagi OG i SEO w index.html (US1 + US2) 🎯 MVP

**Goal**: Uzupełnić `index.html` o kompletne meta tagi Open Graph, Twitter/X Cards i SEO. Wymaga grafiki OG z Phase 1.

**Independent Test US1**: Wkleić URL w Facebook Sharing Debugger — poprawny podgląd z tytułem, opisem, grafiką.
**Independent Test US2**: Wkleić URL w X Card Validator — karta `summary_large_image` z grafiką.

### US1: Meta tagi Open Graph i SEO

- [x] T002 [US1] Zaktualizować istniejący tag `og:url` z `https://kalkulatorfinansowy.app/app` w `index.html`
- [x] T003 [US1] Zaktualizować istniejący tag `og:image` na URL nowej grafiki OG (`https://kalkulatorfinansowy.app/app/images/og-image.png`) w `index.html`
- [x] T004 [US1] Dodać brakujące tagi OG w `index.html`: `og:type` = `website`, `og:locale` = `pl_PL`, `og:site_name` = `Kalkulator finansowy`
- [x] T005 [US1] Zaktualizować `<meta name="description">` w `index.html` — dodać kluczowe frazy SEO (wynagrodzenie, kalkulator, B2B, umowa o pracę, umowa zlecenie, finanse)
- [x] T006 [US1] Dodać tagi SEO w `index.html`: `<link rel="canonical" href="https://kalkulatorfinansowy.app/app">`, `<meta name="robots" content="index, follow">`, `<meta name="author" content="Łukasz Socha">`

### US2: Tagi Twitter/X Cards

- [x] T007 [US2] Dodać tagi Twitter/X Cards w `index.html`: `twitter:card` = `summary_large_image`, `twitter:title` = `<%= productName %>`, `twitter:description` = `<%= productDescription %>`, `twitter:image` = URL grafiki OG

**Checkpoint**: Wszystkie wymagane meta tagi obecne w `index.html`. Walidacja przez Facebook Sharing Debugger i X Card Validator.

---

## Phase 3: Zamiana Twitter → X w SupportProject (US4) 🎯 MVP

**Goal**: Zastąpić wszystkie odniesienia do Twittera platformą X w komponencie SupportProject — ikona, URL, import.

**Independent Test**: Otworzyć modal „Wesprzyj projekt" → kliknąć przycisk X → URL otwiera się na `x.com`. Brak odniesień do „Twitter" w kodzie komponentu.

- [x] T008 [US4] Zamienić import `mdiTwitter` z `@quasar/extras/mdi-v7` na inline SVG path string ikony X w `src/components/partials/SupportProject.vue` (zdefiniować jako stałą np. `xIcon`)
- [x] T009 [US4] Zamienić `:icon="mdiTwitter"` na `:icon="xIcon"` w template przycisku X w `src/components/partials/SupportProject.vue`
- [x] T010 [US4] Zamienić URL share z `http://twitter.com/share?url=${url}&text=${constants.app.name}&hashtags=wynagrodzenie,finanse,kalkulator` na `https://x.com/intent/tweet?url=${url}&text=${constants.app.name}&hashtags=wynagrodzenie,finanse,kalkulator` w `src/components/partials/SupportProject.vue`
- [x] T011 [US4] Zaktualizować zmienną `url` z `'https://kalkulatorfinansowy.app'` na `'https://kalkulatorfinansowy.app/app'` w `src/components/partials/SupportProject.vue`
- [x] T012 [US4] Usunąć nieużywany import `mdiTwitter` z sekcji `<script>` w `src/components/partials/SupportProject.vue`
- [x] T013 [US4] Zweryfikować brak jakichkolwiek odniesień do „twitter" (case-insensitive) w `src/components/partials/SupportProject.vue`

**Checkpoint**: Przycisk X działa poprawnie, URL prowadzi na `x.com`, brak odniesień do Twittera.

---

## Phase 4: Domyślne teksty udostępniania i CTA (US5)

**Goal**: Dopracować domyślne teksty share (pre-filled) na X oraz teksty CTA w SupportProject i Donate. Facebook i LinkedIn pobierają podgląd z meta tagów OG (Phase 2), więc nie wymagają parametrów tekstowych w URL.

**Independent Test**: Kliknąć przycisk X w modalu „Wesprzyj projekt" — okno X otwiera się z zachęcającym tekstem i trafnymi hashtagami. Teksty CTA w modalu i Donate są marketingowo dopracowane.

**Ważne (z researchu)**: Facebook sharer i LinkedIn shareArticle **nie akceptują** parametrów tekstowych — podgląd pobierany wyłącznie z OG tags. Tylko X intent API wspiera `text` i `hashtags`.

### Teksty share na X

- [x] T014 [US5] Dopracować parametr `text` w URL X share w `src/components/partials/SupportProject.vue` — zamienić `${constants.app.name}` na zachęcający tekst marketingowy w języku polskim (np. „Twój darmowy kalkulator wynagrodzeń – sprawdź ile zarobisz na rękę!")
- [x] T015 [US5] Zaktualizować parametr `hashtags` w URL X share w `src/components/partials/SupportProject.vue` — zmienić na aktualne i trafne hashtagi (np. `kalkulator,finanse,wynagrodzenie,B2B`)

### Uproszczenie URL-i Facebook i LinkedIn

- [x] T016 [P] [US5] Uprościć URL Facebook share w `src/components/partials/SupportProject.vue` — usunąć zbędne parametry, zostawić tylko `sharer.php?u=${url}` (Facebook pobiera dane z OG tags)
- [x] T017 [P] [US5] Uprościć URL LinkedIn share w `src/components/partials/SupportProject.vue` — usunąć zbędny parametr `title`, zostawić `shareArticle?mini=true&url=${url}` (LinkedIn pobiera dane z OG tags)

### Teksty CTA

- [x] T018 [US5] Dopracować tekst główny w modalu „Wesprzyj projekt" w `src/components/partials/SupportProject.vue` — użyć języka korzyści, jasne CTA, zachęta do wsparcia
- [x] T019 [US5] Dopracować tekst zachęcający do udostępniania w `src/components/partials/SupportProject.vue` — zmienić „Możesz też pomóc udostępniając kalkulator:" na bardziej konkretne CTA (np. „Podziel się z innymi – pomóż im oszczędzać!")
- [x] T020 [P] [US5] Dopracować tekst i CTA w `src/components/partials/adverts/Donate.vue` — spójność z modalem SupportProject, język korzyści

**Checkpoint**: Teksty share na X są zachęcające, hashtagi trafne. Teksty CTA dopracowane i spójne między SupportProject i Donate.

---

## Phase 5: Finalizacja

**Goal**: Changelog, weryfikacja końcowa.

- [x] T021 Dodać wpis do changelogu w `src/components/changeLogs/logs.ts` opisujący zmiany widoczne dla użytkownika (nowe meta tagi, grafika OG, zamiana Twitter→X, dopracowane teksty)
- [x] T022 Zweryfikować changelog renderuje się poprawnie w `src/pages/ChangeLogs.vue`
- [x] T023 Końcowa weryfikacja: brak odniesień do „twitter" (case-insensitive) w plikach: `src/components/partials/SupportProject.vue`, `src/components/partials/adverts/Donate.vue`
- [x] T024 Końcowa weryfikacja: wszystkie meta tagi OG i Twitter/X Cards obecne w `index.html` (inspekcja HTML w przeglądarce)

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Grafika OG)     ──► Phase 2 (Meta tagi) ──► Phase 5 (Finalizacja)
                                                  ▲
Phase 3 (Twitter→X)      ──► Phase 4 (Teksty)  ──┘
```

- **Phase 1** (US3: Grafika OG): Brak zależności — start natychmiast
- **Phase 2** (US1+US2: Meta tagi): Wymaga Phase 1 (URL grafiki OG w tagach)
- **Phase 3** (US4: Twitter→X): Brak zależności — **może biec równolegle z Phase 1**
- **Phase 4** (US5: Teksty share + CTA): Wymaga Phase 3 (modyfikacje w tym samym pliku SupportProject.vue)
- **Phase 5** (Finalizacja): Wymaga wszystkich poprzednich

### Parallel Opportunities

- **Phase 1 ∥ Phase 3**: Grafika OG i zamiana Twitter→X mogą biec równolegle (różne pliki)
- **T016 ∥ T017 ∥ T020**: Uproszczenie URL-i Facebook/LinkedIn i Donate.vue mogą biec równolegle (T016/T017 to różne fragmenty tego samego pliku, ale niezależne edycje; T020 to inny plik)

---

## Implementation Strategy

### MVP (Phase 1–3): Scenariusze P1

1. **Phase 1**: Stworzyć grafikę OG (1 task)
2. **Phase 2**: Dodać meta tagi OG + Twitter/X Cards + SEO (6 tasks)
3. **Phase 3**: Zamienić Twitter na X (6 tasks)
4. **VALIDATE**: Meta tagi w Facebook Sharing Debugger, przycisk X prowadzi na `x.com`

### Full Implementation (Phase 4–5): Scenariusz P2 + finalizacja

5. **Phase 4**: Dopracować teksty share i CTA (7 tasks)
6. **Phase 5**: Changelog i weryfikacja końcowa (4 tasks)

---

## Notes

- Brak testów jednostkowych — feature nie zawiera logiki kalkulatora
- Facebook i LinkedIn **nie akceptują** parametrów tekstowych w URL share (research R-002, R-003) — podgląd pobierany z OG tags
- X intent API wspiera `text`, `url`, `hashtags` (research R-004)
- Ikona X: `@quasar/extras@1.17.0` nie ma dedykowanej ikony X — użyć inline SVG path string (research R-001)
- `index.html` używa EJS template variables (`<%= productName %>`, `<%= productDescription %>`) — nowe tagi mogą ich używać (research R-006)
- Wszystkie teksty UI w języku polskim
- Commit po każdym task lub logicznej grupie
