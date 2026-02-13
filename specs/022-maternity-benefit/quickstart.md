# Quickstart: Kalkulator zasiłku macierzyńskiego

**Branch**: `022-maternity-benefit` | **Date**: 2026-02-10

## Szybki start implementacji

### 1. Utwórz strukturę katalogów

```
src/components/maternityBenefit/
├── components/
├── interfaces/
├── logic/
├── pages/
└── types/
```

### 2. Zdefiniuj typy i interfejsy

Pliki w `types/`:

- `EmploymentType.ts` — enum: `EmploymentContract`, `SelfEmployment`
- `ZusType.ts` — enum: `Big`, `Preferential`, `Custom`
- `ChildrenCount.ts` — type: `1 | 2 | 3 | 4 | 5`

Pliki w `interfaces/`:

- `InputFields.ts` — dane wejściowe formularza
- `Result.ts` — wynik obliczeń (z `LeavePeriodsResult`, `VariantResult`)

Szczegóły: [data-model.md](./data-model.md)

### 3. Zaimplementuj logikę kalkulatora

`logic/leavePeriodsConfig.ts`:

- Stałe wymiarów urlopów macierzyńskiego i rodzicielskiego per liczba dzieci
- Stawki wariantów (81,5%, 100%, 70%)

`logic/MaternityBenefitCalculator.ts`:

- Extends `BasicCalculator<InputFields, Result>`
- Implements `Calculator<InputFields, Result>`
- Wzorzec: `SickPayCalculator` (najbliższy analogicznie — zasiłek od podstawy)

Kluczowa logika `calculate()`:

```
1. Pobierz socialContributionRate z constantsStore (pension + disability + sick = 13,71%)
2. benefitBasis = averageBasis × (1 - socialContributionRate)
3. dailyRate = benefitBasis / 30
4. Pobierz wymiary urlopów z leavePeriodsConfig na podstawie childrenCount
5. Oblicz wariant A (81,5% × dailyRate × dni)
6. Oblicz wariant B (100% × macierzyński + 70% × rodzicielski)
7. Oblicz zasiłek drugiego rodzica (70% × 63 dni)
```

### 4. Utwórz Pinia store

`store.ts` — wzorzec z `contractWork/store.ts`:

- State: `inputFields: InputFields | undefined`
- Getter: `result` — wywołuje `MaternityBenefitCalculator`

### 5. Zaimplementuj UI

`components/Form.vue`:

- `q-select` dla formy zatrudnienia (UoP / DG)
- `q-select` dla typu ZUS (warunkowy, tylko dla DG)
- `q-input` dla kwoty (z auto-fill dla big/preferential ZUS)
- `q-select` dla liczby dzieci (1–5+)
- Walidacja: `validationRules` + custom rule dla max basis
- `useLocalStorage` dla persystencji pól

`components/ResultList.vue`:

- Dwie kolumny: Wariant A | Wariant B
- Podział na urlop macierzyński i rodzicielski z kwotami
- Sekcja informacyjna o 9-tygodniowym urlopie drugiego rodzica

### 6. Dodaj stronę i routing

`pages/MaternityBenefitPage.vue` — strona modułu z Form + ResultList.

Dodaj route w `src/router/`.

### 7. Napisz testy

`test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts`:

- Test UoP z pensją 5 583,33 zł, 1 dziecko — oba warianty
- Test DG duży ZUS (5 652,00 zł w 2026), 1 dziecko
- Test DG custom basis 10 000 zł, 1 dziecko
- Test porodu mnogiego (2–5 dzieci) — wymiary urlopów
- Test zasiłku drugiego rodzica
- Użyj statycznego roku 2026 (nie `new Date().getFullYear()`)

### 8. Aktualizuj changelog

Dodaj wpis w `src/components/changeLogs/logs.ts`.

## Referencje

- **Wzorzec modułu**: `src/components/contractWork/`
- **Wzorzec kalkulatora zasiłku**: `src/components/sickPay/logic/SickPayCalculator.ts`
- **Stałe ZUS**: `src/stores/constantsStore.ts` → `zusConstants.entrepreneur.basises`
- **Specyfikacja**: [spec.md](./spec.md)
- **Data model**: [data-model.md](./data-model.md)
- **Kontrakt API**: [contracts/calculator-api.md](./contracts/calculator-api.md)
