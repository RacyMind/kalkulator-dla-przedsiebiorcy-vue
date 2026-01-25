# Tasks: Ujednolicenie UI formularzy (pola + przyciski)

**Input**: Dokumenty z `/specs/002-unify-module-ui/`  
**Required**: `plan.md`, `spec.md`  
**Optional (available)**: `research.md`, `data-model.md`, `contracts/no-api-changes.md`, `quickstart.md`

**Organization**: Zadania pogrupowane wg scenariuszy użytkownika.

## Format

Każde zadanie ma format:

- [ ] T### [P?] [US?] Opis z dokładną ścieżką pliku

## Phase 1: Setup

**Goal**: Przygotować bezpieczne warunki do refaktoru formularzy i przycisków (baseline + szybka regresja).

- [x] T001 Potwierdź listę modułów/stron objętych refaktorem w `specs/002-unify-module-ui/spec.md`
- [x] T002 Uruchom testy Faktura VAT (baseline): `npx vitest run test/vitest/__tests__/modules/invoice/Invoice.test.ts` ✓ 10 tests
- [x] T003 Uruchom testy Lokata (baseline): `npx vitest run test/vitest/__tests__/modules/investment/Investment.test.ts` ✓ 11 tests
- [x] T004 Uruchom testy Odsetki (baseline): `npx vitest run test/vitest/__tests__/modules/interest/Interest.test.ts` ✓ 9 tests
- [x] T005 Uruchom testy VAT limit (baseline): `npx vitest run test/vitest/__tests__/modules/vatLimit/VatLimit.test.ts` ✓ 6 tests
- [x] T006 Uruchom testy Przelicznik walut (baseline): `npx vitest run test/vitest/__tests__/modules/currencyConverter/CurrencyConverter.test.ts` ✓ 6 tests

---

## Phase 2: Foundational

**Goal**: Domknąć brakujące testy jednostkowe dla logiki modułów objętych refaktorem UI (safety net przed zmianami w komponentach).

- [x] T007 [P] Utwórz katalog testów limitu kasy fiskalnej: `test/vitest/__tests__/modules/cashRegisterLimit/`
- [x] T008 [P] Dodaj test logiki limitu kasy fiskalnej w `test/vitest/__tests__/modules/cashRegisterLimit/CashRegisterLimit.test.ts` (pokryj: `startDate=null` -> błąd oraz przykłady wyliczeń z bieżącego roku)
- [x] T009 Uruchom test limitu kasy fiskalnej: `npx vitest run test/vitest/__tests__/modules/cashRegisterLimit/CashRegisterLimit.test.ts` ✓ 6 tests

---

## Phase 3: User Scenario 1 (P1) 🎯 MVP — Spójne pola formularzy i przyciski

**Goal**: Ujednolicić pola formularzy i przyciski akcji w modułach (układ, odstępy, walidacja, disabled/loading) oraz uzupełnić brakujące dopięcie stron do wspólnego layoutu.

**Independent Test Criteria**:

- Otwórz kolejno strony:
  - `src/pages/Invoice.vue`
  - `src/pages/VatLimit.vue`
  - `src/pages/Investment.vue`
  - `src/pages/Interest.vue`
  - `src/pages/ExchangeRates.vue`
  - `src/pages/Currency.vue`
  - `src/pages/CurrencyConverter.vue`
  - `src/pages/CashRegisterLimit.vue`
  - `src/pages/Contact.vue`
  - `src/pages/ChangeLogs.vue`
- Każdy formularz ma spójny układ pól i odstępy (mobile/desktop) oraz spójne zachowanie walidacji.
- Przyciski akcji są spójne (kolor, rozmiar, szerokość tam gdzie ma sens, stany disabled/loading).

### Referencja i wspólne komponenty formularza

- [x] T010 [US1] Zweryfikuj wzorzec referencyjny formularza w `src/components/contractWork/components/Form.vue` (sekcje, walidacja, przyciski)
- [x] T011 [US1] Zweryfikuj dostępne komponenty formularza w `src/components/partials/form/` (np. `FormSection.vue`, `SubmitButton.vue`, `AmountTypeSelect.vue`)

### Ujednolicenie layoutu stron dla nowych modułów

- [x] T012 [US1] Zrefaktoruj `src/pages/CashRegisterLimit.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast `q-page` i usuń ręczne `<Footer/>`
- [x] T013 [US1] Zrefaktoruj `src/pages/Contact.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast `q-page` i usuń ręczne `<Footer/>`
- [x] T014 [US1] Zrefaktoruj `src/pages/ChangeLogs.vue` aby używał `src/components/partials/ModulePageLayout.vue` zamiast `q-page` i usuń ręczne `<Footer/>`

### Refaktor formularzy i przycisków (per moduł)

- [x] T015 [P] [US1] Ujednolić układ pól i przycisk w `src/components/invoice/Form.vue` (dopasuj do wzorca sekcji formularza; walidacja z `src/logic/validationRules`)
- [x] T016 [P] [US1] Ujednolić układ pola daty i przycisk w `src/components/vatLimit/Form.vue` (sekcje/odstępy/walidacja)
- [x] T017 [P] [US1] Ujednolić układ pól i przycisk w `src/components/investment/Form.vue` (sekcje/odstępy/walidacja)
- [x] T018 [P] [US1] Ujednolić układ pól i przycisk w `src/components/interest/Form.vue` (sekcje/odstępy/walidacja)
- [x] T019 [P] [US1] Ujednolić przycisk i walidację formularza kursów walut w `src/components/exchangeRates/Form.vue` (jeśli formularz istnieje i jest używany na `src/pages/Currency.vue`)
- [x] T020 [P] [US1] Ujednolić układ pól i przycisk w `src/components/currencyConverter/Form.vue` (sekcje/odstępy/walidacja)
- [x] T021 [P] [US1] Ujednolić układ pola daty i przycisk w `src/components/cashRegisterLimit/Form.vue` (sekcje/odstępy/walidacja)

---

## Phase 4: User Scenario 2 (P2) — Kontakt: spójne pola i stany wysyłki

**Goal**: Zapewnić spójne pola i przycisk „Wyślij” w module Kontakt, w tym czytelne stany loading/disabled i walidację.

**Independent Test Criteria**:

- Otwórz `src/pages/Contact.vue`.
- Nie da się wysłać formularza bez wymaganych pól; walidacja jest czytelna.
- Podczas wysyłki przycisk pokazuje loading i blokuje ponowne wysłanie.

- [x] T022 [US2] Ujednolić sekcje pól oraz przycisk w `src/components/contact/Form.vue` (layout, walidacja, stany `loading/disable`)
- [x] T023 [US2] Zweryfikuj, że `src/pages/Contact.vue` ma spójny nagłówek/układ sekcji zgodny ze wzorcem (bez zmiany treści i bez zmian w wysyłce)

---

## Phase 5: User Scenario 3 (P2) — Historia zmian: spójny przycisk akcji

**Goal**: Ujednolicić przycisk „Pokaż wszystko” w module Historia zmian oraz zachować czytelny układ listy.

**Independent Test Criteria**:

- Otwórz `src/pages/ChangeLogs.vue`.
- Przycisk „Pokaż wszystko” ma spójny wygląd i zachowanie.
- Po kliknięciu lista się rozszerza i UI pozostaje czytelne.

- [x] T024 [US3] Ujednolić styl przycisku „Pokaż wszystko” w `src/pages/ChangeLogs.vue` (spójny wariant/kolor/odstępy względem innych modułów)
- [x] T025 [US3] Zweryfikuj czytelność kart historii zmian w `src/components/changeLogs/ChangeLog.vue` (bez zmiany treści; ewentualnie tylko odstępy)

---

## Phase 6: Regression & Polish

**Goal**: Potwierdzić brak regresji i spójność UI.

- [x] T026 Uruchom testy Faktura VAT: `npx vitest run test/vitest/__tests__/modules/invoice/Invoice.test.ts` ✓ 10 tests
- [x] T027 Uruchom testy Lokata: `npx vitest run test/vitest/__tests__/modules/investment/Investment.test.ts` ✓ 11 tests
- [x] T028 Uruchom testy Odsetki: `npx vitest run test/vitest/__tests__/modules/interest/Interest.test.ts` ✓ 9 tests
- [x] T029 Uruchom testy VAT limit: `npx vitest run test/vitest/__tests__/modules/vatLimit/VatLimit.test.ts` ✓ 6 tests
- [x] T030 Uruchom testy Przelicznik walut: `npx vitest run test/vitest/__tests__/modules/currencyConverter/CurrencyConverter.test.ts` ✓ 6 tests
- [x] T031 Uruchom testy limitu kasy fiskalnej: `npx vitest run test/vitest/__tests__/modules/cashRegisterLimit/CashRegisterLimit.test.ts` ✓ 6 tests
- [x] T032 Manualnie sprawdź responsywność i spójność formularzy (mobile/desktop) na stronach z listy w `specs/002-unify-module-ui/spec.md`
- [x] T033 Uruchom lint: `npm run lint` ✓ 0 errors

---

## Dependencies and Execution Order

- **Phase 1** → **Phase 2** (testy jako safety net) → **US1** (refaktor formularzy/przycisków + nowe strony w ModulePageLayout) → **US2**/**US3** → **Regression & Polish**.

## Parallel Opportunities

- Zadania oznaczone `[P]` można robić równolegle (różne moduły / różne pliki formularzy).

## Suggested MVP Scope

- MVP = **US1** + minimalne testy z Phase 2 (CashRegisterLimit), bo to daje safety net przed refaktorem UI.
