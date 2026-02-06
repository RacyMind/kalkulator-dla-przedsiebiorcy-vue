# Feature Specification: Kalkulator Finansowy v6.0

**Branch**: `009-v6-roadmap`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: Przygotowanie ROADMAP.md do wersji 6.0 aplikacji - refaktoryzacja kodu, nowoczesny UI/UX, accessibility (WCAG), light/dark mode, aktualizacja bibliotek, zachowanie istniejących testów.

---

## Analiza obecnego stanu aplikacji

### Wersja bieżąca: 5.11.0

**Architektura modułów** (29 modułów w `src/components/`):
- Każdy moduł ma strukturę: `pages/`, `components/`, `logic/`, `interfaces/`, `store.ts`
- Wzorcowy moduł: `contractWork` - najnowszy wzorzec (composition API, TypeScript, Pinia store z getterami obliczeniowymi)
- Starsze moduły (np. `contractOfEmployment`, `selfEmployment`) mają zduplikowaną logikę (np. obsługa progu podatkowego, scrollToElement)

**Zidentyfikowane problemy:**

1. **Pliki JS bez TypeScript** (5 plików):
   - `src/logic/employeeContributions.js` - stare API z globalnym stanem (`setYear`)
   - `src/logic/employerContributions.js` - stare API z globalnym stanem
   - `src/logic/jointAccounting.js`
   - `src/use/currencyFormat.js` - brak typów
   - `src/use/deepEqual.js` - może być zastąpiony przez lodash/isEqual lub natywne rozwiązanie

2. **Duplikacja kodu**:
   - `handleSubmit` z logiką progu podatkowego powtarza się w `contractOfEmployment` i `selfEmployment`
   - `findGrossAmountUsingNetAmount` istnieje osobno w `contractWork` i `contractOfMandate`
   - `sumMonthlyResults` w `helpers.ts` jest ściśle powiązany z konkretnymi interfejsami modułów
   - Stałe zduplikowane między `logic/constants.ts` a `composables/constants.ts`

3. **Mieszane wzorce komponentów**:
   - Niektóre komponenty używają Options API (`Menu.vue`, `Chart.vue`) zamiast Composition API
   - `App.vue` używa `defineComponent` zamiast `<script setup>`
   - Brak spójności w definiowaniu props (niektóre typed, niektóre runtime)

4. **UI/UX**:
   - Brak dark mode - wszystko hardcodowane na jasne kolory (`bg-white`, `bg-teal-1`, `bg-grey-2`)
   - `ModulePageLayout` ma hardcodowany `max-width: 800px` i `bg-white`
   - Kolory modułów zdefiniowane inline w SCSS (`_work.scss`, `_business.scss` itd.) z klasami `.bg-brand`
   - Brak responsywnego layoutu dla dużych ekranów (sidebar z menu, dashboard)
   - Menu powtarza sekcje z hardcodowanymi `<h6>` i `style="margin-left: 32px;"`
   - Wykresy oparte na starej bibliotece `@j-t-mcc/vue3-chartjs`

5. **Biblioteki wymagające aktualizacji**:
   - `@quasar/app-vite: ^1.11.0` → v2.x
   - `typescript: ^4.5.4` → v5.x
   - `eslint: ^8.10.0` → v9.x (flat config)
   - `@typescript-eslint/*: ^5.10.0` → v8.x
   - `prettier: ^2.5.1` → v3.x
   - `date-fns: ^2.17.0` → v4.x
   - `@j-t-mcc/vue3-chartjs` → Chart.js 4 z vue-chartjs
   - `quasar: ^2.18.6` → najnowsza 2.x
   - `vue: ^3.4.15` → najnowsza 3.x
   - `workbox-*: ^6.5.3` → v7.x

6. **Accessibility**:
   - Brak atrybutów `aria-label` na większości interaktywnych elementów
   - `SectionHeader` nie używa semantycznych nagłówków (`<h2>`, `<h3>`)
   - `ListRow` nie ma odpowiedniej roli ARIA dla tabeli/listy
   - Brak widocznych fokusów na elementach formularza
   - Brak `skip-to-content` link
   - Kontrast kolorów nie zweryfikowany pod kątem WCAG AA

---

## User Scenarios *(required)*

### Scenario 1 - Aktualizacja zależności i konfiguracji (Priority: P1) 🎯 MVP

Deweloper aktualizuje wszystkie zależności do najnowszych wersji i migruje konfigurację (ESLint flat config, TypeScript 5, Quasar app-vite v2). Wszystkie istniejące testy muszą przechodzić po aktualizacji.

**Priority Justification**: Fundament dla dalszych prac - nowe wersje bibliotek mogą wpływać na API komponentów i narzędzi.

**Independent Test**: `npx vitest run` - wszystkie testy muszą przechodzić.

**Acceptance Criteria**:

1. **Given** aktualna baza kodu, **When** zaktualizuję zależności, **Then** aplikacja buduje się bez błędów i wszystkie testy przechodzą
2. **Given** zaktualizowane zależności, **When** uruchomię `quasar dev`, **Then** aplikacja działa poprawnie w przeglądarce
3. **Given** zaktualizowany TypeScript 5, **When** sprawdzę typy (`tsc --noEmit`), **Then** nie ma błędów typowania

---

### Scenario 2 - Refaktoryzacja kodu do najlepszych praktyk (Priority: P1) 🎯 MVP

Deweloper refaktoryzuje kod eliminując duplikacje, migrując pliki JS na TS, ujednolicając wzorce komponentów na Composition API z `<script setup>`, i konsolidując stałe.

**Priority Justification**: Czysta baza kodu jest wymagana przed wprowadzeniem zmian UI/UX.

**Acceptance Criteria**:

1. **Given** pliki `.js` w `src/logic/` i `src/use/`, **When** zmigrowuję je na TypeScript, **Then** wszystkie mają pełne typowanie i testy przechodzą
2. **Given** zduplikowana logika `handleSubmit` z progiem podatkowym, **When** wyekstrahuję ją do composable, **Then** jest współdzielona między modułami
3. **Given** komponenty z Options API, **When** przepiszę je na `<script setup>`, **Then** działają identycznie
4. **Given** zduplikowane `findGrossAmountUsingNetAmount`, **When** wyekstrahuję do wspólnego modułu, **Then** jest reużywalne

---

### Scenario 3 - System motywów (Light/Dark Mode) (Priority: P2)

Użytkownik może przełączyć się między jasnym a ciemnym motywem. Aplikacja zapamiętuje preferencję i respektuje ustawienia systemowe.

**Priority Justification**: Dark mode jest standardem nowoczesnych aplikacji, poprawia dostępność i komfort użytkowania.

**Acceptance Criteria**:

1. **Given** aplikacja w trybie jasnym, **When** kliknę przełącznik motywu, **Then** UI przełącza się na ciemny motyw
2. **Given** preferencja systemowa `prefers-color-scheme: dark`, **When** otworzę aplikację po raz pierwszy, **Then** automatycznie włącza się ciemny motyw
3. **Given** wybór motywu, **When** zamknę i otworzę aplikację, **Then** motyw jest zapamiętany w localStorage

---

### Scenario 4 - Nowoczesny interfejs UI/UX (Priority: P2)

Użytkownik widzi nowoczesny, spójny interfejs z kartami (cards), lepszą typografią, płynnymi animacjami i responsywnym layoutem dostosowanym do smartfonów i dużych monitorów.

**Priority Justification**: Kluczowy element wersji 6.0 - odświeżenie wizualne i poprawa UX.

**Acceptance Criteria**:

1. **Given** ekran smartfona (<600px), **When** otwieram moduł, **Then** formularz i wyniki wyświetlają się w jednej kolumnie z pełną szerokością
2. **Given** duży monitor (>1200px), **When** otwieram moduł, **Then** formularz i wyniki mogą wyświetlać się obok siebie, menu jest widoczne jako sidebar
3. **Given** strona główna, **When** ją otwieram, **Then** widzę dashboard z kafelkami modułów pogrupowanymi w sekcje
4. **Given** wyniki obliczeń, **When** je przeglądam, **Then** widzę nowoczesne wykresy (donut, bar) z animacjami i tooltipami

---

### Scenario 5 - Dostępność WCAG AA (Priority: P2)

Aplikacja spełnia kryteria WCAG 2.1 na poziomie AA: odpowiedni kontrast kolorów, semantyczny HTML, nawigacja klawiaturą, atrybuty ARIA.

**Priority Justification**: Dostępność jest wymagana prawnie i poprawia UX dla wszystkich użytkowników.

**Acceptance Criteria**:

1. **Given** dowolna strona, **When** nawiguję klawiaturą (Tab), **Then** widzę wyraźny focus ring na każdym interaktywnym elemencie
2. **Given** `SectionHeader`, **When** renderuję stronę, **Then** nagłówek używa semantycznego tagu (`<h2>`, `<h3>`)
3. **Given** formularz kalkulatora, **When** sprawdzam w czytniku ekranowym, **Then** wszystkie pola mają odpowiednie labele i komunikaty walidacji
4. **Given** kolorystyka aplikacji, **When** sprawdzam kontrast narzędziem, **Then** wszystkie teksty spełniają WCAG AA (4.5:1 dla normalnego tekstu)

---

### Edge Cases

- Aktualizacja bibliotek może zmienić zachowanie - wymagane pełne testy regresyjne
- Dark mode musi poprawnie obsługiwać kolory wykresów i modułowych brandów
- Na bardzo szerokich ekranach (>2560px) layout nie powinien się rozciągać w nieskończoność
- Stare dane w localStorage muszą być kompatybilne z nową wersją

---

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Wszystkie pliki `.js` MUSZĄ być zmigrowane na TypeScript z pełnym typowaniem
- **FR-002**: Wszystkie komponenty MUSZĄ używać Composition API z `<script setup lang="ts">`
- **FR-003**: Zduplikowana logika (próg podatkowy, findGrossAmount) MUSI być wyekstrahowana do współdzielonych composables/utilities
- **FR-004**: UI MUSI używać komponentów Quasar wszędzie gdzie to możliwe
- **FR-005**: Wszystkie teksty UI MUSZĄ być w języku polskim
- **FR-006**: Aplikacja MUSI obsługiwać tryb jasny i ciemny z przełącznikiem
- **FR-007**: Layout MUSI być responsywny - mobile-first z adaptacją do dużych ekranów
- **FR-008**: Wykresy MUSZĄ być wymienione na nowoczesną bibliotekę (vue-chartjs / Chart.js 4+)
- **FR-009**: Menu MUSI używać `q-expansion-item` zamiast powtarzanych `<h6>` + `v-for`
- **FR-010**: Strona główna MUSI prezentować dashboard z kafelkami modułów
- **FR-011**: Walidacja formularzy MUSI używać reguł z `validationRules`
- **FR-012**: `ModulePageLayout` MUSI obsługiwać responsywny layout (pełna szerokość na mobile, max-width na desktop)

### Calculation Requirements

- **CR-001**: Logika obliczeniowa NIE MOŻE się zmienić - wszystkie istniejące testy MUSZĄ przechodzić
- **CR-002**: Kalkulatory MUSZĄ nadal dziedziczyć po `BasicCalculator`
- **CR-003**: Wyniki MUSZĄ być zaokrąglane do 2 miejsc po przecinku

### Non-Functional Requirements

- **NFR-001**: Aplikacja MUSI spełniać WCAG 2.1 na poziomie AA
- **NFR-002**: Czas ładowania pierwszej strony (LCP) < 2.5s
- **NFR-003**: Cumulative Layout Shift (CLS) < 0.1
- **NFR-004**: Motyw MUSI być oparty na CSS custom properties / Quasar dark mode plugin

### Key Entities

- **Module**: Pojedynczy kalkulator z formularzem, logiką obliczeniową, wynikami i wykresami. Każdy moduł ma swój store (Pinia), interfejsy i typy.
- **Theme**: System motywów oparty na Quasar Dark plugin z CSS custom properties dla kolorów modułowych.
- **Layout**: Responsywny layout z MainLayout (header, drawer, page-container) adaptujący się do rozmiaru ekranu.
- **Calculator**: Klasa dziedzicząca po `BasicCalculator<InputFields, Result>` z metodami `setInputData()`, `calculate()`, `getResult()`.

---

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: 100% istniejących testów przechodzi po refaktoryzacji (`npx vitest run`)
- **SC-002**: 0 plików `.js` w katalogu `src/` - wszystko w TypeScript
- **SC-003**: 0 komponentów z Options API - wszystkie na `<script setup>`
- **SC-004**: WCAG AA compliance potwierdzone narzędziem (axe-core / Lighthouse)
- **SC-005**: Lighthouse Performance score > 90 na mobile
- **SC-006**: Lighthouse Accessibility score > 90
- **SC-007**: Dark mode działa poprawnie we wszystkich 29 modułach
- **SC-008**: Aplikacja poprawnie wyświetla się na ekranach 320px - 2560px+
- **SC-009**: Wszystkie zależności zaktualizowane do najnowszych stabilnych wersji
