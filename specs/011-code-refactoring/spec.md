# Feature Specification: Refaktoryzacja kodu (Milestone 2)

**Branch**: `011-code-refactoring`  
**Created**: 2026-02-07  
**Status**: Clarified  
**Input**: User description: "Milestone 2 - Refaktoryzacja kodu: migracja JS na TS, ujednolicenie komponentów na Composition API, ujednolicenie systemu stałych, eliminacja duplikacji kodu, porządki w strukturze, Design Tokens"

## Clarifications

### Session 2026-02-07

- Q: Jaka architektura dla zunifikowanego systemu stałych? → A: Opcja C — zastąpić oba pliki (`logic/constants.ts` + `composables/constants.ts`) nowym dedykowanym Pinia store. Priorytet: wygoda przyszłych aktualizacji (dodawanie nowych lat) i zgodność z design patterns.
- Q: Co z obiektem COLORS w constants.ts po wprowadzeniu Design Tokens? → A: Opcja B — usunąć obiekt COLORS i zastąpić composable `useChartColors()`, który czyta CSS custom properties (`_design-tokens.scss`) w runtime przez `getComputedStyle`. Jedno źródło prawdy dla kolorów (CSS), charts pobierają wartości JS przez composable.
- Q: Strategia zastąpienia `deepEqual.js`? → A: Opcja A — przepisać na `deepEqual.ts` z pełnym typowaniem (TypeScript generics), zero nowych zależności. Nie dodawać lodash.
- Q: Zakres migracji Composition API — tylko wymienione komponenty czy wszystkie? → A: Opcja A — wszystkie komponenty w całym projekcie. Każdy plik `.vue` musi używać `<script setup lang="ts">` z typowanymi props. Cel: pełne ujednolicenie kodu.
- Q: Czy `primary` brand color (#d12526) zachować czy skorygować? → A: Opcja C — przeprojektować kolor primary od nowa, bez przywiązania do obecnego czerwonego #d12526. Pełna swoboda w doborze nowej palety spełniającej WCAG AA.

## User Scenarios *(required)*

### Scenario 1 - Migracja plików JavaScript na TypeScript (Priority: P1) 🎯 MVP

Programista otwiera projekt i wszystkie pliki logiki obliczeniowej są napisane w TypeScript z pełnym typowaniem parametrów i wartości zwracanych. Żaden plik `.js` nie pozostaje w katalogach `src/logic/` i `src/use/`. Istniejące testy przechodzą bez zmian w logice obliczeniowej.

**Priority Justification**: Migracja JS→TS jest fundamentem dla dalszych refaktoryzacji — bez typów nie można bezpiecznie refaktoryzować stałych ani eliminować duplikacji.

**Independent Test**: Uruchomić `npx vitest run` — wszystkie 410+ testów musi przejść. Sprawdzić brak plików `.js` w `src/logic/` i `src/use/`.

**Acceptance Criteria**:

1. **Given** plik `src/logic/employeeContributions.js` istnieje, **When** zakończona migracja, **Then** plik jest zastąpiony przez `employeeContributions.ts` z pełnym typowaniem parametrów i wartości zwracanych
2. **Given** plik `src/logic/employerContributions.js` istnieje, **When** zakończona migracja, **Then** plik jest zastąpiony przez `employerContributions.ts` z pełnym typowaniem
3. **Given** plik `src/logic/jointAccounting.js` istnieje, **When** zakończona migracja, **Then** plik jest zastąpiony przez `jointAccounting.ts` z pełnym typowaniem, globalny `setYear()` zastąpiony parametrem
4. **Given** plik `src/use/currencyFormat.js` istnieje, **When** zakończona migracja, **Then** plik jest zastąpiony przez `currencyFormat.ts` z typami `(value: number) => string` i `(value: number, code: string) => string`
5. **Given** plik `src/use/deepEqual.js` istnieje, **When** zakończona migracja, **Then** plik jest zastąpiony przez `deepEqual.ts` z pełnym typowaniem (TypeScript generics), bez dodawania nowych zależności
6. **Given** migracja zakończona, **When** uruchomione testy, **Then** wszystkie istniejące testy przechodzą bez zmian w logice

**Pliki do migracji**:
- `src/logic/employeeContributions.js` → `.ts`
- `src/logic/employerContributions.js` → `.ts`
- `src/logic/jointAccounting.js` → `.ts`
- `src/use/currencyFormat.js` → `.ts`
- `src/use/deepEqual.js` → `.ts`

---

### Scenario 2 - Ujednolicenie komponentów na Composition API (Priority: P1) 🎯 MVP

Wszystkie komponenty Vue w całym projekcie używają `<script setup lang="ts">` z typowanymi props przez `defineProps<Props>()`. Żaden komponent nie używa Options API ani `defineComponent` z `setup()` return.

**Priority Justification**: Spójny wzorzec komponentów w całym projekcie eliminuje cognitive load i ułatwia przyszłe zmiany UI (Milestone 3-4).

**Independent Test**: Uruchomić `npx vitest run`. Wyszukać `defineComponent` w całym projekcie — zero wyników. Wyszukać `<script>` bez `setup` — zero wyników.

**Acceptance Criteria**:

1. **Given** `src/App.vue` używa `defineComponent`, **When** zakończona refaktoryzacja, **Then** komponent używa `<script setup lang="ts">`
2. **Given** `src/components/partials/menu/Menu.vue` używa Options API, **When** zakończona refaktoryzacja, **Then** komponent używa `<script setup lang="ts">` z `defineProps<Props>()`
3. **Given** komponenty w `src/components/partials/` (PieChart, FormSection, ListRow) używają runtime props, **When** zakończona refaktoryzacja, **Then** wszystkie używają typowanego `defineProps<Props>()`
4. **Given** dowolny komponent w `src/components/*/` lub `src/layouts/` używa Options API lub `defineComponent`, **When** zakończona refaktoryzacja, **Then** komponent używa `<script setup lang="ts">`
5. **Given** refaktoryzacja zakończona, **When** uruchomione testy, **Then** wszystkie testy przechodzą

---

### Scenario 3 - Ujednolicenie systemu stałych (Priority: P1) 🎯 MVP

Programista potrzebuje wartości stałej zależnej od roku (np. stawka ZUS, próg podatkowy). Istnieje jeden punkt dostępu do stałych, z jasnym podziałem na stałe statyczne (niezależne od roku) i dynamiczne (zależne od wybranego roku w `settingStore`). Nie ma zduplikowanych definicji tych samych wartości.

**Priority Justification**: Obecne 2 systemy stałych (`src/logic/constants.ts` + `src/composables/constants.ts`) powodują niespójności i utrudniają dodawanie nowych lat. Jest to warunek dla poprawnej implementacji Design Tokens (Scenario 6).

**Independent Test**: Uruchomić `npx vitest run`. Wyszukać hardcodowane wartości stałych w kalkulatorach — powinny być zerowe.

**Acceptance Criteria**:

1. **Given** stałe są w `src/logic/constants.ts` i `src/composables/constants.ts`, **When** zakończona unifikacja, **Then** istnieje jeden punkt dostępu z typowanymi interfejsami dla każdej kategorii (ZUS, podatki, PPK, itp.)
2. **Given** stałe zależne od roku (PARAMS per year), **When** programista potrzebuje wartości dla roku X, **Then** uzyskuje je z jednego composable bez wywoływania globalnych `setYear()`
3. **Given** kalkulatory mają hardcodowane stałe, **When** zakończona migracja, **Then** wszystkie kalkulatory pobierają stałe z zunifikowanego systemu
4. **Given** unifikacja zakończona, **When** uruchomione testy, **Then** wszystkie testy przechodzą

---

### Scenario 4 - Eliminacja duplikacji kodu (Priority: P2)

Programista modyfikuje logikę obliczania kwoty brutto z netto — zmiana jest w jednym miejscu i wpływa na wszystkie moduły, które z niej korzystają. Powtarzające się wzorce (scroll do wyników, powiadomienie o progu podatkowym) są wyekstrahowane do współdzielonych composables.

**Priority Justification**: Duplikacje utrudniają utrzymanie i zwiększają ryzyko niespójności, ale nie blokują dalszych milestone'ów.

**Independent Test**: Uruchomić `npx vitest run`. Wyszukać `findGrossAmountUsingNetAmount` — powinna istnieć w jednym wspólnym pliku, a moduły powinny importować z tego pliku.

**Acceptance Criteria**:

1. **Given** `findGrossAmountUsingNetAmount` istnieje w 3 modułach (contractWork, contractOfMandate, contractOfEmployment), **When** zakończona ekstrakcja, **Then** istnieje jeden wspólny `src/logic/findGrossAmountUsingNetAmount.ts` przyjmujący Calculator jako parametr generyczny
2. **Given** logika progu podatkowego jest zduplikowana w `contractOfEmployment` i `selfEmployment`, **When** zakończona ekstrakcja, **Then** istnieje composable `src/composables/useTaxThresholdNotification.ts`
3. **Given** wzorzec `scrollToElement` + `ref(summary)` powtarza się w 21 modułach, **When** zakończona ekstrakcja, **Then** istnieje composable `src/composables/useScrollToResults.ts`
4. **Given** eliminacja zakończona, **When** uruchomione testy, **Then** wszystkie testy przechodzą

---

### Scenario 5 - Porządki w strukturze kodu (Priority: P2)

Struktura projektu jest uporządkowana: composables są w `src/composables/`, helper functions blisko modułów które ich używają, nieużywany kod usunięty.

**Priority Justification**: Porządki nie zmieniają funkcjonalności, ale poprawiają nawigację po kodzie dla dalszych milestone'ów.

**Independent Test**: Uruchomić `npx vitest run`. Sprawdzić brak plików w `src/use/` (przeniesione do `src/composables/`). Sprawdzić brak nieużywanych eksportów w `helpers.ts`.

**Acceptance Criteria**:

1. **Given** `helpers.ts` eksportuje `sumMonthlyResults` i `applyMixins`, **When** zakończone porządki, **Then** `sumMonthlyResults` jest przeniesiony bliżej modułów ContractOfEmployment/ContractOfMandate, `applyMixins` usunięty jeśli nieużywany
2. **Given** composables są w `src/use/` i `src/composables/`, **When** zakończone porządki, **Then** wszystkie composables są w `src/composables/`
3. **Given** porządki zakończone, **When** uruchomione testy, **Then** wszystkie testy przechodzą

---

### Scenario 6 - Design Tokens — jednolita paleta barw (Priority: P2)

Projektant lub programista otwiera plik `src/css/_design-tokens.scss` i widzi pełną paletę kolorów dla light i dark mode, z tokenami modułów, wykresów, powierzchni i semantycznymi. Wartości kolorów spełniają wymagania kontrastu WCAG AA. Wszystkie istniejące hardcodowane kolory w SCSS i `constants.ts → COLORS` są zmapowane na nowe tokeny.

**Priority Justification**: Design Tokens są wymagane przez Milestone 3 (Dark Mode) i Milestone 4 (UI/UX) — bez nich nie da się poprawnie zaimplementować motywów i nowego UI.

**Independent Test**: Uruchomić `npx vitest run`. Zweryfikować wizualnie kolory w kilku modułach. Sprawdzić kontrast WCAG AA narzędziem WebAIM dla par kolor-tło.

**Acceptance Criteria**:

1. **Given** kolory są w 3 niespójnych źródłach (SCSS, constants.ts, component SCSS), **When** zakończone projektowanie tokenów, **Then** istnieje `src/css/_design-tokens.scss` z CSS custom properties dla light (`:root`) i dark (`.body--dark`) mode
2. **Given** tokeny zdefiniowane, **When** sprawdzony kontrast, **Then** tekst na powierzchni: ≥ 4.5:1, UI components: ≥ 3:1
3. **Given** tokeny zdefiniowane, **When** zaktualizowane źródła, **Then** `quasar.variables.scss` mapuje `$primary`, `$secondary`, `$accent` na nowe wartości
4. **Given** tokeny zdefiniowane, **When** zaktualizowane źródła, **Then** obiekt `COLORS` z `constants.ts` jest usunięty, a nowy composable `useChartColors()` czyta kolory z CSS custom properties w runtime
5. **Given** tokeny zdefiniowane, **When** zaktualizowane 7 plików `src/css/components/_*.scss`, **Then** hardcodowane hex zastąpione przez `var(--module-brand-*)`
6. **Given** design tokens zakończone, **When** uruchomione testy, **Then** wszystkie testy przechodzą
7. **Given** design tokens zakończone, **When** zweryfikowane wizualnie, **Then** kolory w light mode są spójne i czytelne

---

### Edge Cases

- Migracja JS→TS nie może zmienić logiki obliczeniowej — wyniki muszą być identyczne
- Globalny `setYear()` w `jointAccounting.js` wymaga ostrożnej zamiany na parametr — inne moduły mogą zależeć od tego samego wzorca
- Rewrite `deepEqual.ts` musi obsługiwać te same edge cases co oryginał (null, undefined, nested objects)
- Design Tokens muszą uwzględniać istniejącą paletę modułów (6 kategorii: work, business, taxes, currencies, percentage, informator) i 8 kolorów wykresów
- Zmiana w `helpers.ts` wymaga upewnienia się, że `sumMonthlyResults` nie jest używany poza modułami ContractOfEmployment/ContractOfMandate
- Przeniesienie plików z `src/use/` do `src/composables/` wymaga aktualizacji wszystkich importów w projekcie

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Wszystkie pliki `.js` w `src/logic/` i `src/use/` MUSZĄ być zmigrowane na `.ts` z pełnym typowaniem
- **FR-002**: Wszystkie komponenty Vue w całym projekcie (`src/components/`, `src/layouts/`, `src/App.vue`) MUSZĄ używać `<script setup lang="ts">` z typowanymi props przez `defineProps<Props>()`
- **FR-003**: System stałych MUSI być zaimplementowany jako dedykowany Pinia store z typowanymi interfejsami — zastępujący oba obecne pliki (`logic/constants.ts` i `composables/constants.ts`). Brak zduplikowanych definicji
- **FR-004**: Zduplikowany kod (`findGrossAmountUsingNetAmount`, logika progu podatkowego, scroll do wyników) MUSI być wyekstrahowany do współdzielonych modułów
- **FR-005**: Composables MUSZĄ być w jednym katalogu (`src/composables/`), nie w `src/use/`
- **FR-006**: Plik `src/css/_design-tokens.scss` MUSI definiować pełną paletę CSS custom properties dla light i dark mode
- **FR-007**: Obiekt `COLORS` z `constants.ts` MUSI być usunięty i zastąpiony composable `useChartColors()` czytającym CSS custom properties w runtime. Wszystkie hardcodowane kolory w SCSS MUSZĄ być zmapowane na design tokens
- **FR-008**: Migracja NIE MOŻE zmieniać logiki obliczeniowej — wyniki kalkulatorów muszą być identyczne
- **FR-009**: Wszystkie istniejące testy (410+) MUSZĄ przechodzić po każdym kroku refaktoryzacji

### Technical Requirements

- **TR-001**: Design Tokens MUSZĄ spełniać WCAG AA (tekst ≥ 4.5:1, UI ≥ 3:1). Kolor primary będzie przeprojektowany od nowa (bez przywiązania do #d12526)
- **TR-002**: `findGrossAmountUsingNetAmount` MUSI przyjmować Calculator jako parametr generyczny
- **TR-003**: Globalny `setYear()` w `jointAccounting` MUSI być zastąpiony parametrem pobieranym z nowego Pinia store stałych
- **TR-004**: Design Tokens MUSZĄ zawierać warianty dla: primary brand, secondary/accent, powierzchnie (light + dark), kolory modułów (6 kategorii), kolory wykresów (CHART1-CHART8), semantyczne (positive, negative, info, warning)

### Key Entities

- **Design Token**: CSS custom property definiująca kolor, z wariantami light/dark. Kategorie: brand, surface, module, chart, semantic.
- **Constants System**: Dedykowany Pinia store będący jedynym punktem dostępu do stałych aplikacji — statyczne (APP, COLORS, TYPES) i dynamiczne per rok (ZUS, TAX_RATES, PARAMS). Zastępuje `src/logic/constants.ts` i `src/composables/constants.ts`.
- **Composable**: Reaktywna funkcja Vue 3 (Composition API) współdzielona między komponentami. Lokalizacja: `src/composables/`.
- **Module Category**: Grupa modułów o wspólnym kolorze brandowym (6 kategorii: work, business, taxes, currencies, percentage, informator). Konkretne wartości kolorów zostaną przeprojektowane w ramach Design Tokens z pełną swobodą doboru palety.

## Assumptions

- Migracja JS→TS dotyczy wyłącznie 5 plików wymienionych w ROADMAP.md — inne pliki JS nie istnieją w `src/logic/` ani `src/use/`
- Chart.vue jest już przepisany na `<script setup>` (Milestone 1)
- `SubmitButton.vue` nie ma props i nie wymaga refaktoryzacji w tym milestone
- Kontrast WCAG AA będzie finalnie zweryfikowany w Milestone 5, ale Design Tokens muszą być zaprojektowane z uwzględnieniem tych wymagań
- Dark mode tokeny są definiowane w tym milestone, ale faktyczna implementacja przełącznika motywu należy do Milestone 3

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Zero plików `.js` w katalogach `src/logic/` i `src/use/` — wszystkie zmigrowane na `.ts`
- **SC-002**: Zero komponentów Vue w całym projekcie używających Options API lub `defineComponent` — grep `defineComponent` zwraca 0 wyników w plikach `.vue`
- **SC-003**: Jeden zunifikowany system stałych z typowanymi interfejsami — zero zduplikowanych definicji stałych
- **SC-004**: `findGrossAmountUsingNetAmount` istnieje w jednym wspólnym pliku, nie w 3 osobnych modułach
- **SC-005**: Wszystkie composables w `src/composables/`, katalog `src/use/` pusty lub usunięty
- **SC-006**: Plik `_design-tokens.scss` definiuje kompletną paletę z wariantami light/dark
- **SC-007**: Kontrast WCAG AA ≥ 4.5:1 dla tekstu i ≥ 3:1 dla UI w zaprojektowanych tokenach
- **SC-008**: Wszystkie istniejące testy (410+) przechodzą po zakończeniu całego milestone'u
- **SC-009**: `npx vitest run` wykonuje się bez błędów po każdym kroku refaktoryzacji
- **SC-010**: Wizualna weryfikacja kolorów w kilku modułach (light mode) potwierdza spójność
