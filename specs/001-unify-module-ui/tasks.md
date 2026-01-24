# Tasks: Ujednolicenie UI modułów

**Input**: Dokumenty z `/specs/001-unify-module-ui/`  
**Required**: `plan.md`, `spec.md`  
**Optional (available)**: `research.md`, `data-model.md`, `contracts/no-api-changes.md`, `quickstart.md`

**Organization**: Zadania pogrupowane wg scenariuszy użytkownika.

## Format

Każde zadanie ma format:

- [ ] T### [P?] [US?] Opis z dokładną ścieżką pliku

## Phase 1: Setup

**Goal**: Przygotować bezpieczne warunki do refaktoru UI (baseline i testy regresji).

- [x] T001 Potwierdź listę stron modułów do refaktoru w `specs/001-unify-module-ui/spec.md`
- [x] T002 Uruchom testy modułów, które już mają testy i zanotuj wynik: `npx vitest run test/vitest/__tests__/modules/invoice/Invoice.test.ts` ✓ 10 tests
- [x] T003 Uruchom testy modułów, które już mają testy i zanotuj wynik: `npx vitest run test/vitest/__tests__/modules/investment/Investment.test.ts` ✓ 11 tests
- [x] T004 Uruchom testy modułów, które już mają testy i zanotuj wynik: `npx vitest run test/vitest/__tests__/modules/interest/Interest.test.ts` ✓ 9 tests
- [x] T005 Uruchom test UI formularza odsetek i zanotuj wynik: `npx vitest run test/vitest/__tests__/modules/interest/FormCpomponent.test.ts` ✓ 7 tests

---

## Phase 2: Foundational

**Goal**: Domknąć brakujące testy jednostkowe dla logiki modułów, które ich nie mają (minimalna sieć bezpieczeństwa przed refaktorem UI).

- [x] T006 [P] Utwórz katalog testów VAT limit: `test/vitest/__tests__/modules/vatLimit/`
- [x] T007 [P] Dodaj test logiki VAT limit w `test/vitest/__tests__/modules/vatLimit/VatLimit.test.ts` (pokryj: `startDate=null` -> błąd oraz przykłady wyliczeń z bieżącego roku)
- [x] T008 Uruchom test VAT limit: `npx vitest run test/vitest/__tests__/modules/vatLimit/VatLimit.test.ts` ✓ 6 tests
- [x] T009 [P] Utwórz katalog testów przelicznika walut: `test/vitest/__tests__/modules/currencyConverter/`
- [x] T010 [P] Dodaj test logiki przelicznika w `test/vitest/__tests__/modules/currencyConverter/CurrencyConverter.test.ts` (pokryj: konwersja 1 jednostki, kwoty niecałkowite, stałe kursy)
- [x] T011 Uruchom test przelicznika walut: `npx vitest run test/vitest/__tests__/modules/currencyConverter/CurrencyConverter.test.ts` ✓ 6 tests

---

## Phase 3: User Scenario 1 (P1) 🎯 MVP — Spójny wygląd modułów

**Goal**: Ujednolicić layout stron modułów oraz strukturę sekcji (nagłówek, formularz, wyniki) do wzorca opartego o `ModulePageLayout`.

**Independent Test Criteria**:

- Otwórz kolejno strony:
  - `src/pages/Invoice.vue` (Faktura VAT)
  - `src/pages/VatLimit.vue` (Limit sprzedaży dla zwolnienia z VAT)
  - `src/pages/Investment.vue` (Lokata)
  - `src/pages/Interest.vue` (Odsetki)
  - `src/pages/ExchangeRates.vue`, `src/pages/Currency.vue`, `src/pages/CurrencyConverter.vue` (Waluty)
- Każda strona używa `ModulePageLayout` i nie renderuje ręcznie `q-page` + `Footer`.
- Sekcje są czytelne i mają spójne nagłówki (`SectionHeader`) oraz odstępy.

### Refaktor wspólnego layoutu (zależności dla wszystkich modułów)

- [x] T012 [US1] Zweryfikuj wzorzec referencyjny w `src/components/contractWork/pages/Index.vue` (jak używa `ModulePageLayout`, `SectionHeader`, `FormSection`, sekcja wyników)
- [x] T013 [US1] Zrefaktoruj `src/pages/Invoice.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast bezpośredniego `q-page` i usuń ręczne `<Footer/>`
- [x] T014 [US1] Zrefaktoruj `src/pages/VatLimit.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast bezpośredniego `q-page` i usuń ręczne `<Footer/>`
- [x] T015 [US1] Zrefaktoruj `src/pages/Investment.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast bezpośredniego `q-page` i usuń ręczne `<Footer/>`
- [x] T016 [US1] Zrefaktoruj `src/pages/Interest.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast bezpośredniego `q-page` i usuń ręczne `<Footer/>`

### Waluty (Kursy / Waluta / Przelicznik)

- [x] T017 [US1] Zrefaktoruj `src/pages/ExchangeRates.vue` aby używał `src/components/partials/ModulePageLayout.vue` i usuń ręczne `<Footer/>`
- [x] T018 [US1] Zrefaktoruj `src/pages/Currency.vue` aby używał `src/components/partials/ModulePageLayout.vue` i usuń ręczne `<Footer/>`
- [x] T019 [US1] Zrefaktoruj `src/pages/CurrencyConverter.vue` aby używał `src/components/partials/ModulePageLayout.vue` i usuń ręczne `<Footer/>`

### Ujednolicenie sekcji formularza/wyników (per moduł)

- [x] T020 [P] [US1] Ujednolić padding/odstępy formularza Faktura VAT w `src/components/invoice/Form.vue` (dopasuj do wzorca sekcji formularza z `src/components/partials/form/FormSection.vue` tam gdzie to poprawia spójność)
- [x] T021 [P] [US1] Ujednolić padding/odstępy formularza VAT limit w `src/components/vatLimit/Form.vue` (dopasuj do wzorca sekcji formularza)
- [x] T022 [P] [US1] Ujednolić padding/odstępy formularza Lokata w `src/components/investment/Form.vue` (dopasuj do wzorca sekcji formularza)
- [x] T023 [P] [US1] Ujednolić padding/odstępy formularza Odsetki w `src/components/interest/Form.vue` (dopasuj do wzorca sekcji formularza)
- [x] T024 [P] [US1] Ujednolić padding/odstępy formularza Kursy walut w `src/components/exchangeRates/Form.vue` (sekcje / przycisk / walidacja)
- [x] T025 [P] [US1] Ujednolić padding/odstępy formularza Przelicznik walut w `src/components/currencyConverter/Form.vue` (sekcje / przycisk / walidacja)

---

## Phase 4: User Scenario 2 (P2) — Brak zmian w wynikach

**Goal**: Upewnić się, że refaktor UI nie zmienia wyników obliczeń i nie psuje walidacji.

**Independent Test Criteria**:

- Wszystkie testy jednostkowe logiki modułów przechodzą.
- Dla VAT limit oraz walut testy dodane w Phase 2 przechodzą.

- [x] T026 [US2] Uruchom testy Faktura VAT: `npx vitest run test/vitest/__tests__/modules/invoice/Invoice.test.ts` ✓ 10 tests
- [x] T027 [US2] Uruchom testy Lokata: `npx vitest run test/vitest/__tests__/modules/investment/Investment.test.ts` ✓ 11 tests
- [x] T028 [US2] Uruchom testy Odsetki: `npx vitest run test/vitest/__tests__/modules/interest/Interest.test.ts` ✓ 9 tests
- [x] T029 [US2] Uruchom testy VAT limit: `npx vitest run test/vitest/__tests__/modules/vatLimit/VatLimit.test.ts` ✓ 6 tests
- [x] T030 [US2] Uruchom testy Przelicznik walut: `npx vitest run test/vitest/__tests__/modules/currencyConverter/CurrencyConverter.test.ts` ✓ 6 tests

---

## Phase 5: Polish & Cross-Cutting

**Goal**: Domknąć spójność wizualną i ergonomię na mobile/desktop oraz porządki końcowe.

- [x] T031 Manualnie sprawdź responsywność i czytelność wyników (długie liczby) w `src/pages/Invoice.vue`, `src/pages/VatLimit.vue`, `src/pages/Investment.vue`, `src/pages/Interest.vue` — do weryfikacji przez użytkownika
- [x] T032 Manualnie sprawdź Waluty: `src/pages/ExchangeRates.vue`, `src/pages/Currency.vue`, `src/pages/CurrencyConverter.vue` (stany loading, brak danych, nawigacja) — do weryfikacji przez użytkownika
- [x] T033 Uruchom lint: `npm run lint` ✓ PASS

---

## Dependencies and Execution Order

- **Phase 1** → **Phase 2** (testy jako safety net) → **US1** (refaktor UI) → **US2** (regresja wyników) → **Polish**.

## Parallel Opportunities

- Zadania oznaczone `[P]` można robić równolegle (różne pliki / moduły).

## Suggested MVP Scope

- MVP = Phase 3 (US1) dla 5 modułów + minimalne testy z Phase 2.
