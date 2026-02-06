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

## Milestone 1 - Aktualizacja zależności

> Cel: Zaktualizować wszystkie biblioteki do najnowszych wersji, zmigrować konfigurację narzędzi. Wszystkie testy muszą przechodzić po każdej zmianie.

### 1.1 Aktualizacja core dependencies

- [ ] Zaktualizować `vue` z `^3.4.15` do najnowszej 3.x
- [ ] Zaktualizować `quasar` z `^2.18.6` do najnowszej 2.x
- [ ] Zaktualizować `@quasar/extras` z `^1.17.0` do najnowszej
- [ ] Zaktualizować `vue-router` z `^4.2.5` do najnowszej 4.x
- [ ] Zaktualizować `pinia` z `^2.0.14` do najnowszej 2.x
- [ ] Uruchomić testy: `npx vitest run`

### 1.2 Aktualizacja Quasar CLI i build tools

- [ ] Zaktualizować `@quasar/app-vite` z `^1.11.0` do v2.x (breaking changes - wymaga migracji `quasar.config.js` → `quasar.config.ts`)
- [ ] Zmigrować `quasar.config.js` na format wymagany przez `@quasar/app-vite` v2
- [ ] Sprawdzić kompatybilność boot files (`google-analytics.ts`, `admob.ts`)
- [ ] Sprawdzić kompatybilność konfiguracji PWA (`src-pwa/`)
- [ ] Sprawdzić kompatybilność konfiguracji Capacitor (`src-capacitor/`)
- [ ] Uruchomić `quasar dev` i zweryfikować działanie aplikacji
- [ ] Uruchomić testy: `npx vitest run`

### 1.3 Aktualizacja TypeScript i linterów

- [ ] Zaktualizować `typescript` z `^4.5.4` do 5.x
- [ ] Zaktualizować `@typescript-eslint/eslint-plugin` i `@typescript-eslint/parser` z `^5.10.0` do v8.x
- [ ] Zaktualizować `eslint` z `^8.10.0` do v9.x
- [ ] Zmigrować `.eslintrc.js` na ESLint flat config (`eslint.config.js`)
- [ ] Zaktualizować `eslint-plugin-vue` z `^8.5.0` do najnowszej
- [ ] Zaktualizować `eslint-config-prettier` do najnowszej
- [ ] Zaktualizować `prettier` z `^2.5.1` do v3.x
- [ ] Sprawdzić i naprawić nowe błędy lintowania
- [ ] Uruchomić testy: `npx vitest run`

### 1.4 Aktualizacja pozostałych bibliotek

- [ ] Zaktualizować `@vueuse/core` z `^10.7.1` do najnowszej
- [ ] Zaktualizować `axios` z `^1.6.2` do najnowszej
- [ ] Zaktualizować `date-fns` z `^2.17.0` do v4.x (breaking changes w importach)
- [ ] Zaktualizować `vitest` z `^2.1.9` do najnowszej
- [ ] Zaktualizować `@vue/test-utils` z `^2.4.1` do najnowszej
- [ ] Zaktualizować `@testing-library/vue` z `^6.6.1` do najnowszej
- [ ] Zaktualizować `sass` z `^1.97.3` do najnowszej (uwaga na deprecations)
- [ ] Zaktualizować `workbox-*` z `^6.5.3` do v7.x
- [ ] Zaktualizować `@types/node` z `^20.17.24` do najnowszej
- [ ] Usunąć `@quasar/babel-preset-app` (niepotrzebny z Vite)
- [ ] Uruchomić pełne testy: `npx vitest run`

### 1.5 Wymiana biblioteki wykresów

- [ ] Usunąć `@j-t-mcc/vue3-chartjs`
- [ ] Zainstalować `chart.js` v4 + `vue-chartjs`
- [ ] Przepisać `src/components/partials/Chart.vue` na nowe API
- [ ] Przepisać `src/components/partials/statistics/PieChart.vue`
- [ ] Przepisać `src/components/partials/LineChart.vue`
- [ ] Przepisać `src/use/usePieChart.ts`, `src/use/useBarChart.ts`, `src/use/useLineChart.ts`
- [ ] Zweryfikować wykresy we wszystkich modułach które je używają
- [ ] Uruchomić testy: `npx vitest run`

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

### 2.3 Eliminacja duplikacji kodu

- [ ] Wyekstrahować logikę progu podatkowego z `contractOfEmployment/pages/Index.vue` i `selfEmployment/pages/Index.vue` do wspólnego composable `src/composables/useTaxThresholdNotification.ts`
- [ ] Wyekstrahować `findGrossAmountUsingNetAmount` z `contractWork/logic/` i `contractOfMandate/logic/` do wspólnego `src/logic/findGrossAmountUsingNetAmount.ts`
  - Zrefaktoryzować aby przyjmowała Calculator jako parametr generyczny
- [ ] Skonsolidować stałe:
  - `src/logic/constants.ts` zawiera dane historyczne (PARAMS per year) + stałe globalne
  - `src/composables/constants.ts` zawiera computed wartości zależne od `settingStore`
  - Rozdzielić wyraźnie: `src/logic/constants/` (folder) z plikami per kategoria
- [ ] Wyekstrahować powtarzającą się logikę `scrollToElement` + `ref(summary)` z modułów do composable `src/composables/useScrollToResults.ts`
- [ ] Uruchomić testy: `npx vitest run`

### 2.4 Porządki w strukturze kodu

- [ ] Usunąć nieużywany plik `src/.babelrc` i `babel.config.js` (projekt używa Vite, nie Babel)
- [ ] Usunąć `src/logic/constants.ts` - zduplikowane kolory (`COLORS`), stałe (`TAX_RATES`, `ZUS`) które są już w `composables/constants.ts`
  - Przenieść `AVAILABLE_YEARS`, `APP`, `LOCALE_DATE`, `MONTH_NAMES`, `RENTAL_TAX` do odpowiednich plików
  - Zaktualizować wszystkie importy
- [ ] Wyczyścić `helpers.ts`:
  - `sumMonthlyResults` - jest ściśle powiązany z interfejsami `ContractOfEmployment` i `ContractOfMandate` - przenieść bliżej tych modułów
  - `applyMixins` - sprawdzić czy jest nadal używany, jeśli nie - usunąć
- [ ] Uporządkować folder `src/use/` - przenieść composables do `src/composables/` dla spójności
- [ ] Uruchomić testy: `npx vitest run`

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

### 3.2 Eliminacja hardcodowanych kolorów

- [ ] Zamienić `bg-white` → `bg-card` / CSS custom property `var(--surface-color)`
- [ ] Zamienić `bg-teal-1` (page-container) → Quasar dark-aware klasa
- [ ] Zamienić `bg-grey-2` (drawer) → dark-aware
- [ ] Zamienić `bg-grey-3` (ListRow even) → dark-aware
- [ ] Zamienić `bg-red-8` (header) → zmienną kolorystyczną
- [ ] Zaktualizować `ModulePageLayout.vue` - usunąć `bg-white`, użyć `q-card` lub dark-aware klasy
- [ ] Zaktualizować `SectionHeader.vue` - `.sectionHeader { color: #ffff }` → Quasar text class

### 3.3 Kolory modułów kompatybilne z dark mode

- [ ] Zdefiniować CSS custom properties dla kolorów modułów (`--module-brand`, `--module-bg`)
- [ ] Zaktualizować `src/css/components/_work.scss` - zamienić hardcodowane kolory na CSS variables
- [ ] Zaktualizować `src/css/components/_business.scss` - analogicznie
- [ ] Zaktualizować `src/css/components/_taxes.scss` - analogicznie
- [ ] Zaktualizować `src/css/components/_currencies.scss` - analogicznie
- [ ] Zaktualizować `src/css/components/_percentage.scss` - analogicznie
- [ ] Zaktualizować `src/css/components/_informator.scss` - analogicznie
- [ ] Zaktualizować `src/css/components/_app.scss` - analogicznie
- [ ] Zweryfikować dark mode na każdym z 29 modułów

### 3.4 Wykresy i wizualizacje w dark mode

- [ ] Zaktualizować kolory wykresów w `usePieChart.ts` - dynamiczne na podstawie motywu
- [ ] Zaktualizować `useBarChart.ts` i `useLineChart.ts` - dynamiczne kolory
- [ ] Upewnić się, że etykiety i osie na wykresach są czytelne w obu trybach
- [ ] Zweryfikować wykresy we wszystkich modułach

---

## Milestone 4 - Nowoczesny UI/UX

> Cel: Odświeżyć interfejs użytkownika - responsywny layout, nowoczesne komponenty, lepsza nawigacja, dashboard.

### 4.1 Nowy system kolorów i typografii

- [ ] Zaprojektować nową paletę kolorów (zachować red `#d12526` jako primary, ale odświeżyć sekundarne)
- [ ] Zaktualizować `src/css/quasar.variables.scss`:
  - Nowy `$primary` - odświeżony czerwony
  - Nowy `$secondary` - nowoczesny odcień
  - Nowy `$accent` - komplementarny kolor
  - Dodać zmienne dla powierzchni, kart, obramowań
- [ ] Dodać CSS custom properties dla spacing i border-radius (konsystentny design system)
- [ ] Ujednolicić typografię - użyć Quasar typography classes konsystentnie

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

### 5.4 Kontrast kolorów

- [ ] Zweryfikować kontrast primary color `#d12526` na białym tle (4.5:1 minimum)
- [ ] Zweryfikować kontrast teal-4 (przyciski, sekcje) na białym i ciemnym tle
- [ ] Zweryfikować kontrast kolorów modułowych (`.bg-brand`) z tekstem
- [ ] Zweryfikować kontrast w dark mode
- [ ] Naprawić `SectionHeader` - biały tekst na kolorowym tle - sprawdzić kontrast
- [ ] Użyć narzędzia (axe-core, Lighthouse) do automatycznego audytu

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

| Biblioteka | Obecna | Docelowa | Breaking changes |
|---|---|---|---|
| `@quasar/app-vite` | ^1.11.0 | v2.x | Migracja config, API changes |
| `typescript` | ^4.5.4 | v5.x | Stricter types |
| `eslint` | ^8.10.0 | v9.x | Flat config |
| `@typescript-eslint/*` | ^5.10.0 | v8.x | New API |
| `prettier` | ^2.5.1 | v3.x | Trailing commas default |
| `date-fns` | ^2.17.0 | v4.x | ESM-only, changed imports |
| `@j-t-mcc/vue3-chartjs` | ^1.3.0 | Usunąć → `vue-chartjs` + `chart.js` v4 | Nowa biblioteka |
| `workbox-*` | ^6.5.3 | v7.x | API changes |
| `sass` | ^1.97.3 | Najnowsza | Deprecation warnings |

### Pliki do migracji JS → TS

| Plik | Priorytet | Uwagi |
|---|---|---|
| `src/logic/employeeContributions.js` | Wysoki | Globalny stan → composable |
| `src/logic/employerContributions.js` | Wysoki | Globalny stan → composable |
| `src/logic/jointAccounting.js` | Wysoki | Dodać typowanie |
| `src/use/currencyFormat.js` | Średni | Proste typowanie |
| `src/use/deepEqual.js` | Niski | Możliwe zastąpienie |

### Komponenty do przepisania (Options API → `<script setup>`)

| Komponent | Priorytet |
|---|---|
| `src/App.vue` | Wysoki |
| `src/components/partials/menu/Menu.vue` | Wysoki |
| `src/components/partials/Chart.vue` | Wysoki (wymiana biblioteki) |

### Duplikacje do eliminacji

| Co | Gdzie | Rozwiązanie |
|---|---|---|
| Logika progu podatkowego w `handleSubmit` | `contractOfEmployment`, `selfEmployment` | Composable `useTaxThresholdNotification` |
| `findGrossAmountUsingNetAmount` | `contractWork`, `contractOfMandate` | Wspólny `src/logic/findGrossAmountUsingNetAmount.ts` |
| Stałe podatkowe | `logic/constants.ts` + `composables/constants.ts` | Konsolidacja do `src/logic/constants/` |
| Scroll do wyników | Wiele modułów | Composable `useScrollToResults` |

---

## Sugerowany porządek prac

1. **Milestone 1** (Aktualizacja zależności) - fundamenty, musi być pierwszy
2. **Milestone 2** (Refaktoryzacja) - czysta baza przed zmianami UI
3. **Milestone 3** (Dark mode) - wymagany przed redesignem UI (wpływa na kolory)
4. **Milestone 4** (UI/UX) - główna praca wizualna
5. **Milestone 5** (Accessibility) - finalizacja po UI
6. **Milestone 6** (Finalizacja) - testy, optymalizacja, release
