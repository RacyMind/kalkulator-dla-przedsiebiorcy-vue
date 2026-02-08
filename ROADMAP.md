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
7. [Milestone 7 - Git Hooks i CI](#milestone-7---git-hooks-i-ci)

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

## Milestone 2 - Refaktoryzacja kodu ✅

> **Status: UKOŃCZONY** (2026-02-07, branch `011-code-refactoring`)
> Cel: Ujednolicić bazę kodu - migracja JS→TS, eliminacja duplikacji, ujednolicenie wzorców komponentów. Logika obliczeniowa nie zmienia się.

### 2.1 Migracja plików JavaScript na TypeScript ✅

- [x] Zmigrować `src/logic/employeeContributions.js` → `.ts`
  - Dodać typy do parametrów i zwracanych wartości
  - Zamienić globalny stan (`setYear`) na parametry w composable `useConstants`
- [x] Zmigrować `src/logic/employerContributions.js` → `.ts`
  - Analogicznie jak employeeContributions
- [x] Zmigrować `src/logic/jointAccounting.js` → `.ts`
  - Dodać pełne typowanie
- [x] Zmigrować `src/use/currencyFormat.js` → `src/composables/currencyFormat.ts`
  - Dodać typy: `(value: number) => string` i `(value: number, code: string) => string`
- [x] Zmigrować `src/use/deepEqual.js` → `src/composables/deepEqual.ts`
  - Przepisano z TypeScript generics
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass

### 2.2 Ujednolicenie komponentów na Composition API + `<script setup>` ✅

- [x] Przepisać `src/App.vue` - zamienić `defineComponent` na `<script setup lang="ts">`
- [x] Przepisać `src/components/partials/menu/Menu.vue` - Options API → `<script setup lang="ts">`
  - Zamienić `setup()` return na top-level zmienne
  - Zamienić `props` runtime na `defineProps<Props>()`
- [x] Przepisać `src/components/partials/Chart.vue` - Options API → `<script setup lang="ts">` (Milestone 1)
- [x] Przejrzeć i ujednolicić definiowanie props we wszystkich komponentach (30 plików zmigrowanych)
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass

### 2.3 Ujednolicenie systemu stałych (rate constants) ✅

> Zunifikowano do jednego Pinia store `src/stores/constantsStore.ts` z typowanymi interfejsami w `src/stores/constants/types.ts` i danymi per-year w `src/stores/constants/yearParams.ts`.

- [x] Zaudytować obecne użycie stałych
- [x] Zaprojektować jednolity system stałych (Pinia store, setup syntax, typowane interfejsy)
- [x] Zmigrować wszystkie moduły do nowego systemu (29 modułów)
- [x] Usunąć zduplikowane definicje stałych — usunięto `src/logic/constants.ts` i `src/composables/constants.ts`
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass

### 2.4 Eliminacja duplikacji kodu ✅

- [x] Wyekstrahować logikę progu podatkowego → `src/composables/useTaxThresholdNotification.ts`
- [x] Wyekstrahować `findGrossAmountUsingNetAmount` → `src/logic/findGrossAmountUsingNetAmount.ts` (generyczny, usunięto 3 kopie)
- [x] Wyekstrahować scroll → `src/composables/useScrollToResults.ts` (zaktualizowano 21 modułów)
- [x] Przenieść `sumMonthlyResults` → `src/logic/sumMonthlyResults.ts`
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass

### 2.5 Porządki w strukturze kodu ✅

- [x] ~~Usunąć `.babelrc` i `babel.config.js`~~ (zrobione w Milestone 1)
- [x] Wyczyścić `helpers.ts` — `sumMonthlyResults` przeniesiono do `src/logic/sumMonthlyResults.ts`, `applyMixins` zweryfikowano (nadal używany przez 5 plików)
- [x] Uporządkować folder `src/use/` — przeniesiono `useBarChart`, `useLineChart`, `usePieChart` do `src/composables/`, usunięto `src/use/`
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass

### 2.6 Design Tokens — jednolita paleta barw ✅

> Ustalenie pełnej palety kolorów **raz**, z uwzględnieniem wymagań dark mode (M3), nowoczesnego UI (M4) i kontrastu WCAG AA (M5). Kolejne milestone'y tylko konsumują te tokeny — nie projektują kolorów od nowa.

**Audyt obecnego stanu** — kolory są w 3 niespójnych źródłach:

| Źródło | Rola | Przykład |
|---|---|---|
| `src/css/quasar.variables.scss` | Quasar global | `$primary: #d12526`, `$secondary: #26A69A` |
| `src/logic/constants.ts → COLORS` | Wykresy + moduły (JS) | `CONTRACT_OF_EMPLOYMENT: '#ed6d13'`, `CHART1: '#e32514'` |
| `src/css/components/_*.scss` (7 plików) | Brand per moduł (CSS) | `.text-brand { color: #B45309 }` (work) |

Wartości są niespójne — np. moduł "work" ma `#ed6d13` w constants.ts, ale `#B45309` w SCSS.

- [x] Zaprojektować pełną paletę Design Tokens (WCAG AA compliant): primary `#1565C0`, secondary `#00897B`, accent `#7B1FA2`, 6 module brands, 8 chart colors, surface variants, semantyczne
- [x] Zweryfikować kontrast WCAG AA dla wszystkich par kolor–tło
- [x] Stworzyć plik `src/css/_design-tokens.scss` z CSS custom properties (light + dark mode + moduły)
- [x] Zaktualizować `src/css/quasar.variables.scss` — zmapowano na nowe wartości
- [x] Usunięto obiekt `COLORS` z `constantsStore.ts` — zastąpiono composable `src/composables/useChartColors.ts`
- [x] Zaktualizować 7 plików `src/css/components/_*.scss` — zamieniono hex na `var(--module-*)`
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass
- [x] Zweryfikować wizualnie na kilku modułach (light mode) — kolory spójne, czytelne

### 2.7 Ujednolicenie konwencji nazewnictwa w constantsStore ✅

> Wybrano **Opcję A — camelCase everywhere** (styl TypeScript/Vue). Wszystkie SCREAMING_SNAKE_CASE stałe w `constantsStore.ts` zostały przemianowane na camelCase, wraz z ich zagnieżdżonymi właściwościami. Zaktualizowano wszystkie importy i użycia w logice, komponentach, layoutach i testach.

- [x] Wybrać jedną konwencję: **camelCase everywhere**
- [x] Zrefaktoryzować nazwy w `constantsStore.ts` (PARAMS→params, TAX_TYPES→taxTypes, AMOUNT_TYPES→amountTypes, APP→app, LOCALE_DATE→localeDate, AVAILABLE_YEARS→availableYears, MONTH_NAMES→monthNames, FULL_YEAR→fullYear, CASH_REGISTER_LIMIT→cashRegisterLimit, VAT_LIMIT→vatLimit, TAX_RATES→taxRates, RENTAL_TAX→rentalTax, itd.)
- [x] Zaktualizować wszystkie importy i użycia w komponentach i logice (29 plików)
- [x] Zaktualizować testy
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass
- [x] Uruchomić lint: `npm run lint` — 0 errors

### 2.8 Wyczyścić nieużywane pliki w src/ ✅

> Przeprowadzono audyt za pomocą `knip` + ręczny grep po importach. Znaleziono i usunięto 7 nieużywanych plików oraz 2 nieużywane eksporty.

- [x] Przeprowadzić audyt nieużywanych plików (`knip` + ręczny grep)
- [x] Usunąć potwierdzone nieużywane pliki:
  - `src/composables/deepEqual.ts` — nieimportowany nigdzie
  - `src/components/partials/ChooseYear.vue` — nieimportowany
  - `src/components/partials/SalarySummaryTable.vue` — nieimportowany
  - `src/components/partials/YearlySummaryTable.vue` — nieimportowany
  - `src/components/ikeSavings/components/ResultFields.vue` — nieimportowany
  - `src/components/salaryForUnusedHolidays/Form.vue` — zduplikowany (aktywny w `components/Form.vue`)
  - `src/components/currencyConverter/interfaces/CurrencyConverterInputFields.ts` — nieimportowany
- [x] Usunąć nieużywane eksporty:
  - `getIkzeLimits` z `src/logic/ikzeLimits.ts`
  - `getBillableHours` z `src/components/selfEmployment/logic/helpers.ts` (zmieniono na prywatną)
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass
- [x] Uruchomić lint: `npm run lint` — 0 errors

---

## Milestone 3 - System motywów (Light/Dark Mode) ✅

> **Status: UKOŃCZONY** (2026-02-07, branch `012-theme-dark-mode`)
> Cel: Zaimplementować pełny system motywów z przełącznikiem, pamięcią preferencji i respektowaniem ustawień systemowych.

### 3.1 Konfiguracja Quasar Dark Mode ✅

- [x] Dodać Quasar Dark plugin do `quasar.config.ts` → `framework.plugins: ['Dark', 'Notify']`
- [x] Stworzyć composable `src/composables/useTheme.ts`:
  - Stan: `'light' | 'dark' | 'auto'` (typ `ThemeMode` w `settingStore.ts`)
  - Persystencja w localStorage via `useLocalStorage` z `@vueuse/core`
  - Detekcja `prefers-color-scheme` z `usePreferredColorScheme()`
  - Integracja z `Quasar.Dark.set()` — tryb `'auto'` deleguje do Quasar
  - Cykliczny przełącznik: light → dark → auto → light
  - Polskie tooltips: „Tryb jasny", „Tryb ciemny", „Tryb automatyczny"
- [x] Dodać przełącznik motywu w `MainLayout.vue` (toolbar) — `q-btn` z dynamiczną ikoną (`light_mode`/`dark_mode`/`brightness_auto`)
- [x] Dodać `themeMode` w `settingStore.ts` z `useLocalStorage<ThemeMode>('themeMode', 'auto')`
- [x] Dodać inline FOUC prevention script w `index.html` — odczytuje `themeMode` z localStorage i dodaje `.body--dark` przed zamontowaniem Vue

### 3.2 Zastosowanie Design Tokens w komponentach ✅

> Zastąpiono hardcodowane klasy Quasar utility classami z `app.scss` konsumującymi CSS custom properties z `_design-tokens.scss`.

- [x] Stworzyć utility classes w `src/css/app.scss`: `.bg-surface`, `.bg-surface-variant`, `.bg-surface-elevated`, `.bg-primary-brand`, `.text-on-surface`
- [x] Zamienić `bg-white` → `.bg-surface` (ModulePageLayout, SubmitButton, contact/Form, inflation/Index, inflation/PurchasingPowerOfMoney, terms/pages/Index)
- [x] Zamienić `bg-teal-1` → `.bg-surface-variant` (Advert) / `.bg-surface-elevated` (Summary w 8 modułach, terms)
- [x] Zamienić `bg-grey-2` → `.bg-surface-variant` (drawer) / `.bg-surface-elevated` (rentalProfit/ProjectionTable)
- [x] Zamienić `bg-red-8` → `.bg-primary-brand` (header)
- [x] Zaktualizować `_sectionHeader.scss` — `color: #ffff` → `var(--color-text-on-brand)`
- [x] Uruchomić testy: `npx vitest run` — 410/410 pass

### 3.3 Weryfikacja kolorów modułów w dark mode ✅

- [x] `.body--dark` poprawnie przełącza tokeny modułowych kolorów — design tokens z `_design-tokens.scss` aktywują się automatycznie
- [x] `.text-brand` czytelny na ciemnym tle we wszystkich kategoriach modułów
- [x] `.bg-brand` / SectionHeader — biały tekst (`var(--color-text-on-brand)`) czytelny w obu trybach
- [x] Zweryfikowano dark mode na modułach via Chrome DevTools

### 3.4 Wykresy i wizualizacje w dark mode ✅

- [x] `useChartColors.ts` — dodano `watch(() => Dark.isActive)` do automatycznego odświeżenia kolorów przy zmianie motywu
- [x] `Chart.vue` — rozszerzono `mergedOptions` o dynamiczne kolory tekstu legend, etykiet i siatki na podstawie `Dark.isActive`
- [x] Etykiety i osie na wykresach czytelne w obu trybach (jasny: `#666666`, ciemny: `#E0E0E0`, siatka z odpowiednim kontrastem)
- [x] Changelog zaktualizowany — dodano wpis v6.1.0 w `src/components/changeLogs/logs.ts`

---

## Milestone 4 - Nowoczesny UI/UX ✅

> **Status: UKOŃCZONY** (2026-02-07, branch `013-modern-ui-ux`)
> Cel: Odświeżyć interfejs użytkownika - responsywny layout, nowoczesne komponenty, lepsza nawigacja, dashboard.

### 4.1 Rozszerzenie Design Tokens o typografię i spacing ✅

> Paleta kolorów została zdefiniowana w sekcji 2.6 i jest już zaimplementowana. Tutaj rozszerzamy design system o typografię i spacing.

- [x] Dodać CSS custom properties dla spacing (`--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`)
- [x] Dodać CSS custom properties dla border-radius (`--radius-sm`, `--radius-md`, `--radius-lg`)
- [x] Ujednolicić typografię — użyć Quasar typography classes konsystentnie
- [x] Ewentualne drobne korekty kolorów, jeśli nowy layout tego wymaga (dokumentować w `_design-tokens.scss`)

### 4.2 Nowy MainLayout - responsywny ✅

- [x] Przeprojektować `src/layouts/MainLayout.vue`:
  - Mobile (<600px): hamburger menu → drawer, pełna szerokość contentu
  - Tablet (600-1200px): opcjonalny mini-drawer, content z paddingiem
  - Desktop (>1200px): stały sidebar z menu, content w centralnej kolumnie
  - Ultra-wide (>2560px): max-width na kontenerze, wycentrowany
- [x] Nowy header:
  - Logo + nazwa aplikacji (z linkiem do strony głównej)
  - Breadcrumbs (istniejące)
  - Przełącznik motywu (light/dark)
  - Hamburger menu (mobile only)
- [x] Nowy drawer/sidebar:
  - Zamienić `<h6>` + `v-for` na `q-expansion-item` per sekcja
  - Dodać ikony do sekcji menu
  - Dodać search input z `q-input` (istniejący, ale ulepszyć)
  - Dodać stopkę drawera z wersją aplikacji i linkiem "Wesprzyj projekt"
- [x] Nowy page-container:
  - Użyć `q-page` z Quasar padding
  - Responsywne max-width zamiast hardcodowanego 800px

### 4.3 Nowa strona główna - Dashboard ✅

- [x] Przeprojektować `src/pages/Index.vue`:
  - Hero section z logo i krótkim opisem
  - Siatka kafelków (`q-card`) z modułami pogrupowanymi w sekcje
  - Każdy kafelek: ikona + nazwa + krótki opis + kolor modułu
  - Responsywna siatka: 1 kolumna (mobile), 2 kolumny (tablet), 3 kolumny (desktop)
- [x] Dodać animacje wejścia (intersection observer + CSS transitions)
- [x] Dodać sekcję "Ostatnio używane" (opcjonalnie, z localStorage)

### 4.4 Nowy ModulePageLayout ✅

- [x] Przeprojektować `src/components/partials/ModulePageLayout.vue`:
  - Użyć `q-card` z `q-card-section` dla grup treści
  - Responsywny layout:
    - Mobile: jedna kolumna (formularz → wyniki → wykres)
    - Desktop: dwie kolumny (formularz po lewej, wyniki + wykres po prawej)
  - Subtlety: lekkie cienie, zaokrąglone rogi, padding
- [x] Zaktualizować `SectionHeader.vue`:
  - Użyć semantycznego `<h2>` / `<h3>` zamiast `<div>`
  - Stylizacja z Quasar classes zamiast custom CSS

### 4.5 Nowe komponenty formularzy ✅

- [x] Zaktualizować `FormSection.vue`:
  - Użyć `q-expansion-item` zamiast custom toggle
  - Lepsza stylizacja tytułów sekcji
- [x] Zaktualizować `SubmitButton.vue`:
  - Nowoczesny wygląd przycisku (gradient lub filled z zaokrągleniem)
  - Disclaimer w bardziej dyskretnym stylu (mniejszy tekst, collapse)
- [x] Zaktualizować pola formularzy:
  - Spójne użycie `outlined` lub `filled` variant na `q-input`
  - Dodanie `hint` text gdzie pomocny
  - Lepsze ikony i prefix/suffix

### 4.6 Nowe komponenty wyników ✅

- [x] Przeprojektować `ListRow.vue`:
  - Użyć `q-item` / `q-list` zamiast custom div
  - Lepsza stylizacja highlighted row (gradient lub kolor tła)
  - Opcjonalny tooltip z wyjaśnieniem pozycji
- [x] Przeprojektować wyświetlanie wyników:
  - Grupowanie w karty (`q-card`)
  - Animacje przy zmianie wartości (transition)
  - Opcjonalne wyświetlanie procentów obok kwot

### 4.7 Nowoczesne wykresy ✅

- [x] Zamienić PieChart na Donut chart (nowoczesniejszy wygląd)
- [x] Dodać interaktywne tooltips na wykresach
- [x] Dodać animacje przy ładowaniu wykresów
- [x] Dodać opcję BarChart jako alternatywę do PieChart/Donut
- [x] Responsywne wykresy (auto-resize na zmianę rozmiaru okna)
- [x] Kolory wykresów zgodne z paletą modułu

### 4.8 Nawigacja i UX ✅

- [x] Dodać smooth scroll do wyników po kliknięciu "Oblicz"
- [x] Dodać `q-page-sticky` z przyciskiem "Powrót na górę" (scroll-to-top)
- [x] Dodać loading skeleton na lazy-loaded modułach
- [x] Dodać subtle animacje przejść między stronami (`q-transition`)
- [x] Dodać `q-banner` lub `q-notification` dla powiadomień o progu podatkowym (zamiast eventStore)

---

## Milestone 5 - Accessibility (WCAG AA) ✅

> **Status: UKOŃCZONY** (2026-02-07, branch `014-wcag-accessibility`)
> Cel: Doprowadzić aplikację do zgodności z WCAG 2.1 na poziomie AA.

### 5.1 Semantyczny HTML ✅

- [x] `SectionHeader.vue` - zamienić `<div>` na odpowiedni heading (`<h2>`, `<h3>`) z prop `level`
- [x] `ListRow.vue` - użyć `<dl>` (definition list) lub `<table>` z `role` dla listy wyników
- [x] Menu sekcji - zamienić `<h6>` na semantyczne `<h2>`/`<h3>` z odpowiednią hierarchią
- [x] Dodać `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>` landmarks
- [x] Dodać `<section>` z `aria-labelledby` do każdej sekcji formularza

### 5.2 Nawigacja klawiaturą ✅

- [x] Dodać `skip-to-content` link na początku strony
- [x] Upewnić się, że tab order jest logiczny we wszystkich formularzach
- [x] Dodać wyraźny focus ring (`:focus-visible`) na wszystkich interaktywnych elementach
- [x] Upewnić się, że drawer menu jest dostępny klawiaturą (Escape zamyka)
- [x] Upewnić się, że custom toggles/selects w formularzach obsługują klawiaturę

### 5.3 Atrybuty ARIA ✅

- [x] Dodać `aria-label` do przycisków z ikonami (hamburger menu, toggle theme, expand/collapse)
- [x] Dodać `aria-expanded` do `FormSection.vue` i elementów zwijanych
- [x] Dodać `aria-live="polite"` do sekcji wyników (aktualizacja po obliczeniu)
- [x] Dodać `aria-describedby` do pól formularzy z walidacją
- [x] Dodać `role="status"` do powiadomień

### 5.4 Weryfikacja końcowa kontrastu kolorów ✅

> Kontrast WCAG AA został uwzględniony przy projektowaniu palety (sekcja 2.6). Tutaj wykonujemy końcowy audyt automatyczny na gotowym UI.

- [x] Uruchomić axe-core / Lighthouse accessibility audit na wersji produkcyjnej
- [x] Zweryfikować automatycznie wykryte problemy kontrastowe i naprawić je w `_design-tokens.scss`
- [x] Zweryfikować kontrast w dark mode (axe-core z włączonym dark mode)
- [x] Sprawdzić `SectionHeader` — biały tekst na kolorowym tle (powinien być OK po sekcji 2.6, ale potwierdzić)
- [x] Udokumentować wyniki audytu (score Lighthouse Accessibility)

### 5.5 Formularze dostępne ✅

- [x] Upewnić się, że każdy `q-input` ma `label` (nie placeholder jako label)
- [x] Dodać `aria-required="true"` do wymaganych pól
- [x] Upewnić się, że komunikaty walidacji są powiązane z polami przez `aria-describedby`
- [x] Dodać `autocomplete` atrybuty gdzie odpowiednie
- [x] Przetestować formularze z czytnikiem ekranowym (NVDA lub VoiceOver)

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

### Pliki do migracji JS → TS ✅

| Plik | Priorytet | Status |
|---|---|---|
| `src/logic/employeeContributions.js` → `.ts` | Wysoki | ✅ Zmigrowany |
| `src/logic/employerContributions.js` → `.ts` | Wysoki | ✅ Zmigrowany |
| `src/logic/jointAccounting.js` → `.ts` | Wysoki | ✅ Zmigrowany |
| `src/use/currencyFormat.js` → `src/composables/currencyFormat.ts` | Średni | ✅ Zmigrowany |
| `src/use/deepEqual.js` → `src/composables/deepEqual.ts` | Niski | ✅ Zmigrowany → ❌ Usunięty (2.8 — nieużywany) |

### Komponenty do przepisania (Options API → `<script setup>`) ✅

| Komponent | Priorytet | Status |
|---|---|---|
| `src/App.vue` | Wysoki | ✅ Przepisany (Milestone 2) |
| `src/components/partials/menu/Menu.vue` | Wysoki | ✅ Przepisany (Milestone 2) |
| `src/components/partials/Chart.vue` | Wysoki | ✅ Przepisany (Milestone 1) |
| + 27 pozostałych komponentów | — | ✅ Wszystkie zmigrowane (Milestone 2) |

### Duplikacje do eliminacji ✅

| Co | Gdzie | Rozwiązanie | Status |
|---|---|---|---|
| Logika progu podatkowego | `contractOfEmployment`, `selfEmployment` | `src/composables/useTaxThresholdNotification.ts` | ✅ |
| `findGrossAmountUsingNetAmount` | `contractWork`, `contractOfMandate`, `contractOfEmployment` | `src/logic/findGrossAmountUsingNetAmount.ts` | ✅ |
| Stałe podatkowe / rate constants | `logic/constants.ts` + `composables/constants.ts` | Pinia store `src/stores/constantsStore.ts` | ✅ |
| Scroll do wyników | 21 modułów | `src/composables/useScrollToResults.ts` | ✅ |
| `sumMonthlyResults` | `src/logic/helpers.ts` | `src/logic/sumMonthlyResults.ts` | ✅ |

---

## Sugerowany porządek prac

1. **Milestone 1** (Aktualizacja zależności) - fundamenty, musi być pierwszy
2. **Milestone 2** (Refaktoryzacja) - czysta baza przed zmianami UI
3. **Milestone 3** (Dark mode) - wymagany przed redesignem UI (wpływa na kolory)
4. **Milestone 4** (UI/UX) - główna praca wizualna
5. **Milestone 5** (Accessibility) - finalizacja po UI
6. **Milestone 6** (Finalizacja) - testy, optymalizacja, release
7. **Milestone 7** (Git Hooks i CI) - automatyzacja jakości kodu

---

## Milestone 7 - Git Hooks i CI

> Cel: Zautomatyzować kontrolę jakości kodu, aby zapobiegać regresji i utrzymać spójność bazy kodu.

### 7.1 Git Hooks (lokalne, via Husky + lint-staged)

- [ ] Zainstalować `husky` i `lint-staged`
- [ ] Skonfigurować hook `pre-commit`:
  - `lint-staged` uruchamia ESLint (`--fix`) i Prettier na staged `.ts`, `.vue`, `.scss` plikach
- [ ] Skonfigurować hook `pre-push`:
  - Uruchomienie pełnego zestawu testów: `npx vitest run`
- [ ] Skonfigurować hook `commit-msg`:
  - Walidacja formatu commit message (Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
  - Zainstalować `@commitlint/cli` + `@commitlint/config-conventional`
- [ ] Dodać skrypt `prepare` w `package.json` do automatycznej instalacji hooków po `npm install`

### 7.2 GitHub Actions — CI pipeline

- [ ] Stworzyć `.github/workflows/ci.yml`:
  - **Trigger**: push na `main` / `develop`, pull request
  - **Job: Lint** — `npm run lint`
  - **Job: Test** — `npx vitest run`
  - **Job: Build** — `npx quasar build -m pwa` (weryfikacja, czy build przechodzi)
- [ ] Dodać badge statusu CI do `README.md`

### 7.3 Dodatkowe narzędzia jakości (opcjonalne)

- [ ] Rozważyć `knip` — wykrywanie nieużywanych plików, eksportów i zależności
- [ ] Rozważyć Dependabot lub Renovate — automatyczne PR-y z aktualizacjami zależności
- [ ] Rozważyć `vue-tsc --noEmit` w CI — pełna weryfikacja typów TypeScript
