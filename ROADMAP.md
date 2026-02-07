# ROADMAP v6.0 - Kalkulator Finansowy

**Wersja docelowa**: 6.0.0  
**Wersja bieżąca**: 5.11.0  
**Data rozpoczęcia**: 2026-02-06  
**Branch specyfikacji**: `009-v6-roadmap`

---

## Spis treści

1. [Milestone 1 - Aktualizacja zależności](#milestone-1---aktualizacja-zależności)
2. [Milestone 2 - Refaktoryzacja kodu](#milestone-2---refaktoryzacja-kodu)
3. [Milestone 3 - System motywów (Light/Dark Mode)](#milestone-3---system-motywów-lightdark-mode)
4. [Milestone 4 - Nowoczesny UI/UX](#milestone-4---nowoczesny-uiux)
5. [Milestone 5 - Accessibility (WCAG AA)](#milestone-5---accessibility-wcag-aa)
6. [Milestone 6 - Finalizacja i testy](#milestone-6---finalizacja-i-testy)

---

## Milestone 1 - Aktualizacja zależności ✅

> **Status: UKOŃCZONY** (2026-02-06, branch `010-update-dependencies`)
> Cel: Zaktualizować wszystkie biblioteki do najnowszych wersji, zmigrować konfigurację narzędzi. Wszystkie testy muszą przechodzić po każdej zmianie.

### 1.1 Aktualizacja core dependencies ✅

- [x] `vue` → 3.5.27
- [x] `quasar` → 2.18.6
- [x] `@quasar/extras` → najnowsza
- [x] `vue-router` → 4.6.4
- [x] `pinia` → 2.3.1
- [x] Testy: 410/410 pass

### 1.2 Aktualizacja Quasar CLI i build tools ✅

- [x] `@quasar/app-vite` → v2.4.0 (migracja `quasar.config.js` → `quasar.config.ts`)
- [x] Boot files — warunkowe ładowanie admob w trybie Capacitor
- [x] Vite plugin do stubowania Capacitor packages w trybach non-Capacitor
- [x] Konfiguracja PWA — działa
- [x] Konfiguracja Capacitor — build Android działa
- [x] `quasar dev` — działa bez błędów
- [x] Testy: 410/410 pass

### 1.3 Aktualizacja TypeScript i linterów ✅

- [x] `typescript` → 5.9.3 (strict mode włączony)
- [x] `@typescript-eslint/*` → v8.54.0
- [x] `eslint` → v9.39.2 (flat config `eslint.config.js`)
- [x] `eslint-plugin-vue` → najnowsza + `vue-eslint-parser`
- [x] `eslint-config-prettier` → najnowsza
- [x] `prettier` → v3.5.3
- [x] Usunięto: `.eslintrc.js`, `.eslintignore`, sort plugins
- [x] ESLint: 0 errors, 3 warnings
- [x] Testy: 410/410 pass

### 1.4 Aktualizacja pozostałych bibliotek ✅

- [x] `@vueuse/core` → najnowsza
- [x] `axios` → najnowsza
- [x] `date-fns` → v4.x (naprawione importy deep → named)
- [x] `vitest` → v4.x
- [x] `@vue/test-utils` → najnowsza
- [x] `@testing-library/vue` → najnowsza
- [x] `sass` → najnowsza (deprecation warnings zaakceptowane — Milestone 2)
- [x] `workbox-*` → v7.x
- [x] `@types/node` → najnowsza
- [x] `autoprefixer` → najnowsza
- [x] Usunięto: `@quasar/babel-preset-app`, `.babelrc`, `babel.config.js`
- [x] Testy: 410/410 pass

### 1.5 Wymiana biblioteki wykresów ✅

- [x] Usunięto `@j-t-mcc/vue3-chartjs`
- [x] Zainstalowano `chart.js` v4 + `vue-chartjs`
- [x] Przepisano `Chart.vue` — dynamiczny wybór komponentu (Pie/Bar/Line/Doughnut)
- [x] `PieChart.vue`, `BarChart.vue`, `LineChart.vue` — bez zmian (delegują do Chart.vue)
- [x] `usePieChart.ts`, `useBarChart.ts`, `useLineChart.ts` — kompatybilne bez zmian
- [x] Wykresy zweryfikowane we wszystkich modułach
- [x] Testy: 410/410 pass

---

## Milestone 2 - Refaktoryzacja kodu

> Cel: Ujednolicić bazę kodu - migracja JS→TS, eliminacja duplikacji, ujednolicenie wzorców komponentów. Logika obliczeniowa nie zmienia się.

### 2.1 Migracja plików JavaScript na TypeScript

- [ ] Zmigrować `src/logic/employeeContributions.js` → `.ts`
  - Dodać typy do parametrów i zwracanych wartości
  - Zamienić globalny stan (`setYear`) na parametry w composable `useConstants`
- [ ] Zmigrować `src/logic/employerContributions.js` → `.ts`
  - Analogicznie jak employeeContributions
- [ ] Zmigrować `src/logic/jointAccounting.js` → `.ts`
  - Dodać pełne typowanie
- [ ] Zmigrować `src/use/currencyFormat.js` → `.ts`
  - Dodać typy: `(value: number) => string` i `(value: number, code: string) => string`
- [ ] Zmigrować `src/use/deepEqual.js` → `.ts`
  - Rozważyć zastąpienie natywnym `structuredClone` lub `lodash/isEqual`
- [ ] Uruchomić testy: `npx vitest run`

### 2.2 Ujednolicenie komponentów na Composition API + `<script setup>`

- [ ] Przepisać `src/App.vue` - zamienić `defineComponent` na `<script setup lang="ts">`
- [ ] Przepisać `src/components/partials/menu/Menu.vue` - Options API → `<script setup lang="ts">`
  - Zamienić `setup()` return na top-level zmienne
  - Zamienić `props` runtime na `defineProps<Props>()`
- [ ] Przepisać `src/components/partials/Chart.vue` - Options API → `<script setup lang="ts">`
  - Zamienić `defineComponent` + `setup()` na `<script setup>`
  - Dodać typy do props
- [ ] Przejrzeć i ujednolicić definiowanie props we wszystkich komponentach:
  - `PieChart.vue` - zamienić runtime props na typed `defineProps<Props>()`
  - `FormSection.vue` - zamienić runtime props na typed
  - `SubmitButton.vue` - OK (nie ma props)
  - `ListRow.vue` - zamienić runtime props na typed
  - Przejrzeć wszystkie pozostałe komponenty w `src/components/partials/`
- [ ] Uruchomić testy: `npx vitest run`

### 2.3 Ujednolicenie systemu stałych (rate constants)

> **PRIORYTET**: Obecnie istnieją 2 osobne sposoby przechowywania stałych (stawki, progi, współczynniki). Należy je zunifikować do jednego wspólnego wzorca.

- [ ] Zaudytować obecne użycie stałych:
  - `src/logic/constants.ts` — dane historyczne (PARAMS per year), stałe globalne (APP, COLORS, TAX_RATES, ZUS)
  - `src/composables/constants.ts` — computed wartości zależne od `settingStore` (rok, parametry ZUS, progi podatkowe)
  - Stałe hardcodowane bezpośrednio w kalkulatorach
- [ ] Zaprojektować jednolity system stałych:
  - Jeden punkt dostępu do stałych zależnych od roku
  - Jasny podział: statyczne stałe vs. dynamiczne (zależne od wybranego roku)
  - Typowane interfejsy dla każdej kategorii stałych
- [ ] Zmigrować wszystkie moduły do nowego systemu
- [ ] Usunąć zduplikowane definicje stałych
- [ ] Uruchomić testy: `npx vitest run`

### 2.4 Eliminacja duplikacji kodu

- [ ] Wyekstrahować logikę progu podatkowego z `contractOfEmployment/pages/Index.vue` i `selfEmployment/pages/Index.vue` do wspólnego composable `src/composables/useTaxThresholdNotification.ts`
- [ ] Wyekstrahować `findGrossAmountUsingNetAmount` z `contractWork/logic/` i `contractOfMandate/logic/` do wspólnego `src/logic/findGrossAmountUsingNetAmount.ts`
  - Zrefaktoryzować aby przyjmowała Calculator jako parametr generyczny
- [ ] Wyekstrahować powtarzającą się logikę `scrollToElement` + `ref(summary)` z modułów do composable `src/composables/useScrollToResults.ts`
- [ ] Uruchomić testy: `npx vitest run`

### 2.5 Porządki w strukturze kodu

- [x] ~~Usunąć `.babelrc` i `babel.config.js`~~ (zrobione w Milestone 1)
- [ ] Wyczyścić `helpers.ts`:
  - `sumMonthlyResults` - jest ściśle powiązany z interfejsami `ContractOfEmployment` i `ContractOfMandate` - przenieść bliżej tych modułów
  - `applyMixins` - sprawdzić czy jest nadal używany, jeśli nie - usunąć
- [ ] Uporządkować folder `src/use/` - przenieść composables do `src/composables/` dla spójności
- [ ] Uruchomić testy: `npx vitest run`

### 2.6 Design Tokens — jednolita paleta barw

> **PRIORYTET**: Ustalenie pełnej palety kolorów **raz**, z uwzględnieniem wymagań dark mode (M3), nowoczesnego UI (M4) i kontrastu WCAG AA (M5). Kolejne milestone'y tylko konsumują te tokeny — nie projektują kolorów od nowa.

**Audyt obecnego stanu** — kolory są w 3 niespójnych źródłach:

| Źródło | Rola | Przykład |
|---|---|---|
| `src/css/quasar.variables.scss` | Quasar global | `$primary: #d12526`, `$secondary: #26A69A` |
| `src/logic/constants.ts → COLORS` | Wykresy + moduły (JS) | `CONTRACT_OF_EMPLOYMENT: '#ed6d13'`, `CHART1: '#e32514'` |
| `src/css/components/_*.scss` (7 plików) | Brand per moduł (CSS) | `.text-brand { color: #B45309 }` (work) |

Wartości są niespójne — np. moduł "work" ma `#ed6d13` w constants.ts, ale `#B45309` w SCSS.

- [ ] Zaprojektować pełną paletę Design Tokens:
  - **Primary brand**: zachować `#d12526` lub skorygować pod WCAG AA (kontrast ≥ 4.5:1 na białym / ≥ 4.5:1 na ciemnym tle)
  - **Secondary / Accent**: nowe, spójne kolory (zastępują `$secondary: #26A69A`, `$accent: #9C27B0`)
  - **Powierzchnie (light)**: `--surface`, `--surface-variant`, `--surface-elevated` (zastępują `bg-white`, `bg-teal-1`, `bg-grey-2`, `bg-grey-3`)
  - **Powierzchnie (dark)**: ciemne warianty tych samych tokenów
  - **Kolory modułów** (6 kategorii): work, business/company, taxes, currencies, percentage/savings, informator/info, app
  - **Kolory wykresów** (CHART1–CHART8): spójna paleta danych, czytelna w light i dark mode
  - **Semantyczne**: positive, negative, info, warning (zachować lub skorygować obecne)
- [ ] Zweryfikować kontrast WCAG AA dla wszystkich par kolor–tło (narzędzie: WebAIM Contrast Checker lub axe-core):
  - Tekst na powierzchni: ≥ 4.5:1
  - Tekst na module brand bg: ≥ 4.5:1
  - UI components (ikony, obramowania): ≥ 3:1
- [ ] Stworzyć plik `src/css/_design-tokens.scss` z CSS custom properties:
  - Tokeny light mode (`:root`)
  - Tokeny dark mode (`.body--dark` lub `@media (prefers-color-scheme: dark)`)
  - Tokeny modułów (`.c-work`, `.c-business`, `.c-taxes`, itd.)
- [ ] Zaktualizować `src/css/quasar.variables.scss` — zmapować `$primary`, `$secondary`, `$accent` na nowe wartości
- [ ] Zaktualizować `src/logic/constants.ts → COLORS` — zmapować na nowe wartości z palety (lub usunąć na rzecz CSS variables + composable `useChartColors`)
- [ ] Zaktualizować 7 plików `src/css/components/_*.scss` — zamienić hardcodowane hex na `var(--module-brand-*)` z `_design-tokens.scss`
- [ ] Uruchomić testy: `npx vitest run`
- [ ] Zweryfikować wizualnie na kilku modułach (light mode) — kolory spójne, czytelne

---

## Milestone 3 - System motywów (Light/Dark Mode)

> Cel: Zaimplementować pełny system motywów z przełącznikiem, pamięcią preferencji i respektowaniem ustawień systemowych.

### 3.1 Konfiguracja Quasar Dark Mode

- [ ] Dodać Quasar Dark plugin do `quasar.config` → `framework.plugins: ['Dark', 'Notify']`
- [ ] Stworzyć composable `src/composables/useTheme.ts`:
  - Stan: `'light' | 'dark' | 'auto'`
  - Persystencja w localStorage via `@vueuse/core`
  - Detekcja `prefers-color-scheme` z `usePreferredColorScheme()`
  - Integracja z `Quasar.Dark.set()`
- [ ] Dodać przełącznik motywu w `MainLayout.vue` (toolbar) - `q-btn` z ikoną `light_mode`/`dark_mode`
- [ ] Dodać opcję motywu w `settingStore.ts`

### 3.2 Zastosowanie Design Tokens w komponentach

> Paleta barw i CSS custom properties zostały zdefiniowane w sekcji 2.6. Tutaj zastępujemy hardcodowane klasy Quasar/CSS tokenami z `_design-tokens.scss`.

- [ ] Zamienić `bg-white` → `var(--surface)` lub klasa `.bg-surface`
- [ ] Zamienić `bg-teal-1` (page-container) → `var(--surface-variant)`
- [ ] Zamienić `bg-grey-2` (drawer) → `var(--surface-variant)`
- [ ] Zamienić `bg-grey-3` (ListRow even) → `var(--surface-elevated)`
- [ ] Zamienić `bg-red-8` (header) → `var(--color-primary)`
- [ ] Zaktualizować `ModulePageLayout.vue` - usunąć `bg-white`, użyć `var(--surface)`
- [ ] Zaktualizować `SectionHeader.vue` - `.sectionHeader { color: #ffff }` → token tekstowy

### 3.3 Weryfikacja kolorów modułów w dark mode

> Kolory modułów i ich warianty dark zostały zdefiniowane w `_design-tokens.scss` (sekcja 2.6), a pliki `_*.scss` zaktualizowane. Tutaj weryfikujemy, czy dark mode działa poprawnie.

- [ ] Sprawdzić, czy `.body--dark` poprawnie przełącza tokeny modułowych kolorów
- [ ] Zweryfikować czytelność `.text-brand` na ciemnym tle w każdej kategorii modułów
- [ ] Zweryfikować `.bg-brand` / `.bg-module` — czy kontrast z tekstem jest wystarczający w dark mode
- [ ] Zweryfikować dark mode na każdym z 29 modułów

### 3.4 Wykresy i wizualizacje w dark mode

- [ ] Zaktualizować kolory wykresów w `usePieChart.ts` - dynamiczne na podstawie motywu
- [ ] Zaktualizować `useBarChart.ts` i `useLineChart.ts` - dynamiczne kolory
- [ ] Upewnić się, że etykiety i osie na wykresach są czytelne w obu trybach
- [ ] Zweryfikować wykresy we wszystkich modułach

---

## Milestone 4 - Nowoczesny UI/UX

> Cel: Odświeżyć interfejs użytkownika - responsywny layout, nowoczesne komponenty, lepsza nawigacja, dashboard.

### 4.1 Rozszerzenie Design Tokens o typografię i spacing

> Paleta kolorów została zdefiniowana w sekcji 2.6 i jest już zaimplementowana. Tutaj rozszerzamy design system o typografię i spacing.

- [ ] Dodać CSS custom properties dla spacing (`--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`)
- [ ] Dodać CSS custom properties dla border-radius (`--radius-sm`, `--radius-md`, `--radius-lg`)
- [ ] Ujednolicić typografię — użyć Quasar typography classes konsystentnie
- [ ] Ewentualne drobne korekty kolorów, jeśli nowy layout tego wymaga (dokumentować w `_design-tokens.scss`)

### 4.2 Nowy MainLayout - responsywny

- [ ] Przeprojektować `src/layouts/MainLayout.vue`:
  - Mobile (<600px): hamburger menu → drawer, pełna szerokość contentu
  - Tablet (600-1200px): opcjonalny mini-drawer, content z paddingiem
  - Desktop (>1200px): stały sidebar z menu, content w centralnej kolumnie
  - Ultra-wide (>2560px): max-width na kontenerze, wycentrowany
- [ ] Nowy header:
  - Logo + nazwa aplikacji (z linkiem do strony głównej)
  - Breadcrumbs (istniejące)
  - Przełącznik motywu (light/dark)
  - Hamburger menu (mobile only)
- [ ] Nowy drawer/sidebar:
  - Zamienić `<h6>` + `v-for` na `q-expansion-item` per sekcja
  - Dodać ikony do sekcji menu
  - Dodać search input z `q-input` (istniejący, ale ulepszyć)
  - Dodać stopkę drawera z wersją aplikacji i linkiem "Wesprzyj projekt"
- [ ] Nowy page-container:
  - Użyć `q-page` z Quasar padding
  - Responsywne max-width zamiast hardcodowanego 800px

### 4.3 Nowa strona główna - Dashboard

- [ ] Przeprojektować `src/pages/Index.vue`:
  - Hero section z logo i krótkim opisem
  - Siatka kafelków (`q-card`) z modułami pogrupowanymi w sekcje
  - Każdy kafelek: ikona + nazwa + krótki opis + kolor modułu
  - Responsywna siatka: 1 kolumna (mobile), 2 kolumny (tablet), 3 kolumny (desktop)
- [ ] Dodać animacje wejścia (intersection observer + CSS transitions)
- [ ] Dodać sekcję "Ostatnio używane" (opcjonalnie, z localStorage)

### 4.4 Nowy ModulePageLayout

- [ ] Przeprojektować `src/components/partials/ModulePageLayout.vue`:
  - Użyć `q-card` z `q-card-section` dla grup treści
  - Responsywny layout:
    - Mobile: jedna kolumna (formularz → wyniki → wykres)
    - Desktop: dwie kolumny (formularz po lewej, wyniki + wykres po prawej)
  - Subtlety: lekkie cienie, zaokrąglone rogi, padding
- [ ] Zaktualizować `SectionHeader.vue`:
  - Użyć semantycznego `<h2>` / `<h3>` zamiast `<div>`
  - Stylizacja z Quasar classes zamiast custom CSS

### 4.5 Nowe komponenty formularzy

- [ ] Zaktualizować `FormSection.vue`:
  - Użyć `q-expansion-item` zamiast custom toggle
  - Lepsza stylizacja tytułów sekcji
- [ ] Zaktualizować `SubmitButton.vue`:
  - Nowoczesny wygląd przycisku (gradient lub filled z zaokrągleniem)
  - Disclaimer w bardziej dyskretnym stylu (mniejszy tekst, collapse)
- [ ] Zaktualizować pola formularzy:
  - Spójne użycie `outlined` lub `filled` variant na `q-input`
  - Dodanie `hint` text gdzie pomocny
  - Lepsze ikony i prefix/suffix

### 4.6 Nowe komponenty wyników

- [ ] Przeprojektować `ListRow.vue`:
  - Użyć `q-item` / `q-list` zamiast custom div
  - Lepsza stylizacja highlighted row (gradient lub kolor tła)
  - Opcjonalny tooltip z wyjaśnieniem pozycji
- [ ] Przeprojektować wyświetlanie wyników:
  - Grupowanie w karty (`q-card`)
  - Animacje przy zmianie wartości (transition)
  - Opcjonalne wyświetlanie procentów obok kwot

### 4.7 Nowoczesne wykresy

- [ ] Zamienić PieChart na Donut chart (nowoczesniejszy wygląd)
- [ ] Dodać interaktywne tooltips na wykresach
- [ ] Dodać animacje przy ładowaniu wykresów
- [ ] Dodać opcję BarChart jako alternatywę do PieChart/Donut
- [ ] Responsywne wykresy (auto-resize na zmianę rozmiaru okna)
- [ ] Kolory wykresów zgodne z paletą modułu

### 4.8 Nawigacja i UX

- [ ] Dodać smooth scroll do wyników po kliknięciu "Oblicz"
- [ ] Dodać `q-page-sticky` z przyciskiem "Powrót na górę" (scroll-to-top)
- [ ] Dodać loading skeleton na lazy-loaded modułach
- [ ] Dodać subtle animacje przejść między stronami (`q-transition`)
- [ ] Dodać `q-banner` lub `q-notification` dla powiadomień o progu podatkowym (zamiast eventStore)

---

## Milestone 5 - Accessibility (WCAG AA)

> Cel: Doprowadzić aplikację do zgodności z WCAG 2.1 na poziomie AA.

### 5.1 Semantyczny HTML

- [ ] `SectionHeader.vue` - zamienić `<div>` na odpowiedni heading (`<h2>`, `<h3>`) z prop `level`
- [ ] `ListRow.vue` - użyć `<dl>` (definition list) lub `<table>` z `role` dla listy wyników
- [ ] Menu sekcji - zamienić `<h6>` na semantyczne `<h2>`/`<h3>` z odpowiednią hierarchią
- [ ] Dodać `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>` landmarks
- [ ] Dodać `<section>` z `aria-labelledby` do każdej sekcji formularza

### 5.2 Nawigacja klawiaturą

- [ ] Dodać `skip-to-content` link na początku strony
- [ ] Upewnić się, że tab order jest logiczny we wszystkich formularzach
- [ ] Dodać wyraźny focus ring (`:focus-visible`) na wszystkich interaktywnych elementach
- [ ] Upewnić się, że drawer menu jest dostępny klawiaturą (Escape zamyka)
- [ ] Upewnić się, że custom toggles/selects w formularzach obsługują klawiaturę

### 5.3 Atrybuty ARIA

- [ ] Dodać `aria-label` do przycisków z ikonami (hamburger menu, toggle theme, expand/collapse)
- [ ] Dodać `aria-expanded` do `FormSection.vue` i elementów zwijanych
- [ ] Dodać `aria-live="polite"` do sekcji wyników (aktualizacja po obliczeniu)
- [ ] Dodać `aria-describedby` do pól formularzy z walidacją
- [ ] Dodać `role="status"` do powiadomień

### 5.4 Weryfikacja końcowa kontrastu kolorów

> Kontrast WCAG AA został uwzględniony przy projektowaniu palety (sekcja 2.6). Tutaj wykonujemy końcowy audyt automatyczny na gotowym UI.

- [ ] Uruchomić axe-core / Lighthouse accessibility audit na wersji produkcyjnej
- [ ] Zweryfikować automatycznie wykryte problemy kontrastowe i naprawić je w `_design-tokens.scss`
- [ ] Zweryfikować kontrast w dark mode (axe-core z włączonym dark mode)
- [ ] Sprawdzić `SectionHeader` — biały tekst na kolorowym tle (powinien być OK po sekcji 2.6, ale potwierdzić)
- [ ] Udokumentować wyniki audytu (score Lighthouse Accessibility)

### 5.5 Formularze dostępne

- [ ] Upewnić się, że każdy `q-input` ma `label` (nie placeholder jako label)
- [ ] Dodać `aria-required="true"` do wymaganych pól
- [ ] Upewnić się, że komunikaty walidacji są powiązane z polami przez `aria-describedby`
- [ ] Dodać `autocomplete` atrybuty gdzie odpowiednie
- [ ] Przetestować formularze z czytnikiem ekranowym (NVDA lub VoiceOver)

---

## Milestone 6 - Finalizacja i testy

> Cel: Kompletne testy regresyjne, optymalizacja wydajności, dokumentacja, przygotowanie do release.

### 6.1 Testy regresyjne

- [ ] Uruchomić pełny zestaw testów: `npx vitest run`
- [ ] Zweryfikować ręcznie każdy z 29 modułów:
  - [ ] accountingWithSpouse
  - [ ] b2bComparator
  - [ ] cashRegisterLimit
  - [ ] contractOfEmployment
  - [ ] contractOfMandate
  - [ ] contractWork
  - [ ] currencyConverter
  - [ ] exchangeRates
  - [ ] ikeSavings
  - [ ] ikzeTaxRelief
  - [ ] inflation
  - [ ] interest
  - [ ] investment
  - [ ] invoice
  - [ ] partialZusContributions
  - [ ] polishBonds
  - [ ] realBoughtCosts
  - [ ] rentalProfit
  - [ ] salaryForUnusedHolidays
  - [ ] salaryStats
  - [ ] selfEmployment
  - [ ] sickPay
  - [ ] unregisteredCompany
  - [ ] vatLimit
  - [ ] changeLogs
  - [ ] contact
  - [ ] privacyPolicy
  - [ ] terms
  - [ ] exchangeRates (strona szczegółowa waluty)
- [ ] Zweryfikować dark mode w każdym module
- [ ] Zweryfikować responsywność na 320px, 768px, 1024px, 1440px, 2560px

### 6.2 Optymalizacja wydajności

- [ ] Uruchomić Lighthouse audit na wersji production (`quasar build -m pwa`)
- [ ] Zoptymalizować bundle size (tree-shaking, lazy loading)
- [ ] Upewnić się, że wszystkie moduły są lazy-loaded (dynamiczne importy w routerze - już są)
- [ ] Sprawdzić i zoptymalizować Service Worker (PWA caching strategy)
- [ ] Cel: Lighthouse Performance > 90, Accessibility > 90

### 6.3 Testy Capacitor (Android)

- [ ] Zbudować wersję Android: `quasar build -m capacitor -T android`
- [ ] Przetestować na emulatorze Android
- [ ] Zweryfikować dark mode na Androidzie
- [ ] Zweryfikować AdMob integration po aktualizacji
- [ ] Zweryfikować nawigację i layout na różnych rozmiarach ekranu Android

### 6.4 Porządki finalne

- [ ] Zaktualizować wersję w `package.json` na `6.0.0`
- [ ] Zaktualizować `APP.VERSION` w `src/logic/constants.ts` (lub nowej lokalizacji)
- [ ] Zaktualizować `src/components/changeLogs/logs.ts` z informacjami o v6.0
- [ ] Zaktualizować `README.md` z informacjami o nowych funkcjach
- [ ] Zaktualizować `src-pwa/manifest.json` jeśli potrzeba
- [ ] Wyczyścić nieużywane pliki, komentarze, TODO
- [ ] Final build i deploy: `quasar build -m pwa`

---

## Podsumowanie zmian technicznych

### Biblioteki - aktualizacje

| Biblioteka | Przed | Po | Breaking changes |
|---|---|---|---|
| `@quasar/app-vite` | ^1.11.0 | **v2.4.0** ✅ | Migracja config, API changes |
| `typescript` | ^4.5.4 | **5.9.3** ✅ | Strict mode, stricter types |
| `eslint` | ^8.10.0 | **v9.39.2** ✅ | Flat config |
| `@typescript-eslint/*` | ^5.10.0 | **v8.54.0** ✅ | New API |
| `prettier` | ^2.5.1 | **v3.5.3** ✅ | Trailing commas default |
| `date-fns` | ^2.17.0 | **v4.x** ✅ | ESM-only, changed imports |
| `@j-t-mcc/vue3-chartjs` | ^1.3.0 | **vue-chartjs + chart.js v4** ✅ | Nowa biblioteka |
| `workbox-*` | ^6.5.3 | **v7.x** ✅ | API changes |
| `sass` | ^1.97.3 | **Najnowsza** ✅ | Deprecation warnings |
| `vitest` | ^2.1.9 | **v4.x** ✅ | New API |
| `vue` | ^3.4.15 | **3.5.27** ✅ | — |
| `vue-router` | ^4.2.5 | **4.6.4** ✅ | — |
| `pinia` | ^2.0.14 | **2.3.1** ✅ | — |

### Pliki do migracji JS → TS

| Plik | Priorytet | Uwagi |
|---|---|---|
| `src/logic/employeeContributions.js` | Wysoki | Globalny stan → composable |
| `src/logic/employerContributions.js` | Wysoki | Globalny stan → composable |
| `src/logic/jointAccounting.js` | Wysoki | Dodać typowanie |
| `src/use/currencyFormat.js` | Średni | Proste typowanie |
| `src/use/deepEqual.js` | Niski | Możliwe zastąpienie |

### Komponenty do przepisania (Options API → `<script setup>`)

| Komponent | Priorytet | Status |
|---|---|---|
| `src/App.vue` | Wysoki | Do zrobienia |
| `src/components/partials/menu/Menu.vue` | Wysoki | Do zrobienia |
| `src/components/partials/Chart.vue` | Wysoki | ✅ Przepisany na `<script setup>` (Milestone 1) |

### Duplikacje do eliminacji

| Co | Gdzie | Rozwiązanie |
|---|---|---|
| Logika progu podatkowego w `handleSubmit` | `contractOfEmployment`, `selfEmployment` | Composable `useTaxThresholdNotification` |
| `findGrossAmountUsingNetAmount` | `contractWork`, `contractOfMandate` | Wspólny `src/logic/findGrossAmountUsingNetAmount.ts` |
| Stałe podatkowe / rate constants | `logic/constants.ts` + `composables/constants.ts` + hardcoded w kalkulatorach | **Priorytet** — ujednolicenie do jednego systemu (sekcja 2.3) |
| Scroll do wyników | Wiele modułów | Composable `useScrollToResults` |

---

## Sugerowany porządek prac

1. **Milestone 1** (Aktualizacja zależności) - fundamenty, musi być pierwszy
2. **Milestone 2** (Refaktoryzacja) - czysta baza przed zmianami UI
3. **Milestone 3** (Dark mode) - wymagany przed redesignem UI (wpływa na kolory)
4. **Milestone 4** (UI/UX) - główna praca wizualna
5. **Milestone 5** (Accessibility) - finalizacja po UI
6. **Milestone 6** (Finalizacja) - testy, optymalizacja, release
