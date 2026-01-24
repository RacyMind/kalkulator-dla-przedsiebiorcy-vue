# Tasks: Kalkulator ulgi podatkowej IKZE

**Input**: Dokumenty z `/specs/003-ikze-ulga-podatkowa/`  
**Required**: `plan.md`, `spec.md`  
**Optional (available)**: `research.md`, `data-model.md`, `contracts/no-api-changes.md`, `quickstart.md`

**Tests**: Testy są WYMAGANE dla logiki kalkulatora. Testy muszą zawierać wszystkie wartości wyjściowe i używać bieżącego roku.

**Organization**: Zadania pogrupowane wg scenariuszy użytkownika.

## Phase 1: Setup (struktura modułu)

**Goal**: Utworzyć strukturę katalogów nowego modułu zgodnie z planem i wzorcem `contractWork`.

- [X] T001 Utworzyć strukturę `src/components/ikzeTaxRelief/` (components/, interfaces/, logic/, pages/, types/)
- [X] T002 [P] Utworzyć `src/components/ikzeTaxRelief/interfaces/` (puste pliki interfejsów wg data-model)
- [X] T003 [P] Utworzyć `src/components/ikzeTaxRelief/types/` (typy statusu i systemu podatkowego)

---

## Phase 2: Foundational (wspólne zależności i integracje)

**Goal**: Dodać/wpiąć elementy wspólne, które blokują moduł (limity, integracja daty przepisów, routing/menu).

- [X] T004 Upewnić się, że `src/logic/ikzeLimits.ts` zawiera limity 2023-2026 i jest używalny przez moduł
- [X] T005 Dodać wpis do nawigacji: `src/components/partials/menu/menuItems.ts` (nowy moduł IKZE)
- [X] T006 Dodać routing: `src/router/routes.ts` (route do `src/components/ikzeTaxRelief/pages/Index.vue`)

---

## Phase 3: US1 (P1) 🎯 MVP — Obliczenie odliczenia i oszczędności podatkowej

**Goal**: Użytkownik wybiera `dateOfLawRules` (2023-2026), status limitu i dane do obliczeń; widzi limit IKZE, walidację limitu oraz wyniki podatku przed/po i oszczędność.

### Tests (REQUIRED — tests first)

- [X] T007 [US1] Utworzyć test `test/vitest/__tests__/modules/ikzeTaxRelief/IkzeTaxReliefCalculator.test.ts`
- [X] T008 [US1] Dodać przypadki testowe w `test/vitest/__tests__/modules/ikzeTaxRelief/IkzeTaxReliefCalculator.test.ts` (bieżący rok) dla statusów: umowa o pracę i działalność gospodarcza; testy muszą sprawdzać wszystkie pola wyniku
- [X] T009 [US1] Dodać przypadek testowy w `test/vitest/__tests__/modules/ikzeTaxRelief/IkzeTaxReliefCalculator.test.ts` potwierdzający, że limit z `src/logic/ikzeLimits.ts` jest respektowany (wpłata > limit nie może przejść walidacji — wg docelowej implementacji walidacji w `src/components/ikzeTaxRelief/components/Form.vue`)

### Logic

- [X] T010 [US1] Utworzyć `src/components/ikzeTaxRelief/interfaces/InputFields.ts` (zgodnie z `data-model.md`)
- [X] T011 [US1] Utworzyć `src/components/ikzeTaxRelief/interfaces/Result.ts` (zgodnie z `data-model.md`)
- [X] T012 [US1] Utworzyć kalkulator `src/components/ikzeTaxRelief/logic/IkzeTaxReliefCalculator.ts` (extends `BasicCalculator`)
- [X] T013 [US1] W kalkulatorze pobierać limit przez `getIkzeLimit(settingStore.dateOfLawRules, status)` z `src/logic/ikzeLimits.ts`
- [X] T014 [US1] W kalkulatorze liczyć podatek skali przez `TaxScale` (uwzględniając `dateOfLawRules` z `useConstants()`)
- [X] T015 [US1] W kalkulatorze liczyć podatek liniowy przez `FlatTax` (dla DG)
- [X] T016 [US1] W kalkulatorze liczyć podatek ryczałtowy przez `LumpSumTax` + `lumpSumTaxRate` (dla DG)
- [X] T017 [US1] W kalkulatorze policzyć `taxBaseAfterRelief`, `taxBeforeRelief`, `taxAfterRelief`, `taxSaving` i zwrócić komplet wyniku

### Store

- [X] T018 [US1] Utworzyć store: `src/components/ikzeTaxRelief/store.ts` (Pinia) z `inputFields` i getterem `result` (jak w `contractWork/store.ts`)
- [X] T019 [US1] Wpiąć `lawRuleDateWatcher(store)` w `src/components/ikzeTaxRelief/pages/Index.vue` (reset po zmianie `dateOfLawRules`)

### UI

- [X] T020 [US1] Utworzyć stronę `src/components/ikzeTaxRelief/pages/Index.vue` (wzorzec `ModulePageLayout`, `SectionHeader`, "Brak danych")
- [X] T021 [US1] Utworzyć formularz `src/components/ikzeTaxRelief/components/Form.vue` oparty o `q-form` + `FormSection` + `SubmitButton`
- [X] T022 [US1] Dodać `LawRuleDate` w formularzu (analogicznie jak `contractWork/components/Form.vue`) i uzależnić wyświetlanie od `availableDates.length > 1`
- [X] T023 [US1] Dodać wybór statusu limitu (UoP/DG) + tooltip (`components/partials/Tooltip.vue`) z wyjaśnieniem różnicy
- [X] T024 [US1] Dla statusu umowa o pracę ukryć wybór formy opodatkowania i ustawić skala podatkowa
- [X] T025 [US1] Dla statusu DG pokazać wybór formy opodatkowania (skala/liniowy/ryczałt) oraz pole stawki ryczałtu gdy wybrano ryczałt
- [X] T026 [US1] W formularzu wyświetlać konkretną kwotę limitu IKZE dla bieżącego `dateOfLawRules` i statusu
- [X] T027 [US1] Dodać walidację wpłaty IKZE: `<= limit` w `src/components/ikzeTaxRelief/components/Form.vue` używając `src/logic/validationRules.ts` (jeśli brakuje reguły max — rozszerzyć `src/logic/validationRules.ts`)
- [X] T028 [US1] Utworzyć komponent wyników `src/components/ikzeTaxRelief/components/ResultList.vue` (pokazuje limit, wpłatę, podatki przed/po i oszczędność)

**Checkpoint**: Testy logiki przechodzą, UI pokazuje limit i blokuje wpłatę > limit.

---

## Phase 4: US2 (P2) — Porównanie limitów UoP vs DG

**Goal**: Użytkownik może szybko porównać limity w danym roku (wynikające z `dateOfLawRules`) dla obu statusów.

- [X] T029 [US2] W `src/components/ikzeTaxRelief/components/Form.vue` dopracować prezentację limitu dla aktualnie wybranego statusu oraz przełączanie statusu bez utraty pozostałych pól (jeśli dotyczy)
- [X] T030 [US2] W `src/components/ikzeTaxRelief/components/Form.vue` dopracować zachowanie z AC: wpłata > limit UoP ma dawać błąd, a po przełączeniu na DG (jeśli mieści się w limicie DG) ma być akceptowana
- [X] T031 [US2] Dodać testy w `test/vitest/__tests__/modules/ikzeTaxRelief/IkzeTaxReliefCalculator.test.ts` dla limitów UoP vs DG w bieżącym roku (min. przypadek: kwota pomiędzy limitami)

---

## Phase 5: Polish & Integration

**Goal**: Dopiąć integracje aplikacyjne, dodać changelog, uruchomić testy i zweryfikować quickstart.

- [X] T032 Upewnić się, że moduł jest dostępny z menu i route działa (manual) — `src/components/partials/menu/menuItems.ts`, `src/router/routes.ts`, `src/components/ikzeTaxRelief/pages/Index.vue`
- [X] T033 Zaktualizować changelog: `src/components/changeLogs/logs.ts` (opis nowego modułu IKZE i najważniejszych zmian w UX)
- [X] T034 Uruchomić testy modułu: `npx vitest run test/vitest/__tests__/modules/ikzeTaxRelief/IkzeTaxReliefCalculator.test.ts`
- [X] T035 Zweryfikować manualnie scenariusze z `specs/003-ikze-ulga-podatkowa/quickstart.md` (do weryfikacji przez użytkownika)

---

## Dependencies and Execution Order

- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5

## Parallel Opportunities

- [P] T002 i T003 można wykonać równolegle (różne pliki).

## Notes

- Test command (repo standard): `npx vitest run test/vitest/__tests__/modules/<moduleName>/<testName>.test.ts`
- Testy muszą używać bieżącego roku (obecnie `dateOfLawRules`) i zawierać wszystkie wartości wyjściowe.
