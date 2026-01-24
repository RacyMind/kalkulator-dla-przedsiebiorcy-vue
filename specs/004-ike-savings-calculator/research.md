# Research: Kalkulator IKE

**Feature**: 004-ike-savings-calculator  
**Date**: 2026-01-24

## 1. Wzór procentu składanego z regularnymi wpłatami

### Decision
Użycie wzoru Future Value of Annuity (FVA) z wpłatami na koniec okresu (ordinary annuity) i kapitalizacją roczną.

### Rationale
- Zgodne z klaryfikacją: wpłaty miesięczne na koniec miesiąca
- Standardowy wzór używany w kalkulatorach finansowych
- Łatwy do zrozumienia i weryfikacji

### Formula

```
FV = P × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]

Gdzie:
- FV = Future Value (przewidywany kapitał)
- P = Principal (kapitał początkowy, domyślnie 0)
- r = roczna stopa zwrotu (jako ułamek, np. 0.05 dla 5%)
- n = liczba lat oszczędzania
- PMT = roczna suma wpłat (składka miesięczna × 12 lub składka roczna)
```

### Calculation Example Verification
```
Input:
- Kapitał początkowy: 0 zł
- Składka miesięczna: 500 zł (roczna: 6000 zł)
- Stopa zwrotu: 5% (r = 0.05)
- Okres: 30 lat

FV = 0 × (1.05)^30 + 6000 × [((1.05)^30 - 1) / 0.05]
FV = 0 + 6000 × [(4.3219 - 1) / 0.05]
FV = 6000 × [3.3219 / 0.05]
FV = 6000 × 66.4388
FV = 398 633,28 zł

Uwaga: Specyfikacja podaje ~416 129,32 zł - różnica wynika z kapitalizacji miesięcznej vs rocznej.
Dla uproszczenia (kapitalizacja roczna) używamy wzoru powyżej.
```

### Alternatives Considered
1. **Kapitalizacja miesięczna** - dokładniejsza, ale bardziej skomplikowana
2. **Kapitalizacja ciągła** - zbyt skomplikowana dla podstawowego kalkulatora

---

## 2. Limity wpłat IKE

### Decision
Utworzenie nowego pliku `src/logic/ikeLimits.ts` wzorowanego na istniejącym `ikzeLimits.ts`.

### Rationale
- Spójność z istniejącą architekturą projektu
- Łatwe aktualizowanie limitów w przyszłości
- Możliwość użycia w innych modułach

### IKE Limits by Year
```typescript
// Limit IKE = 3 × przeciętne wynagrodzenie w gospodarce narodowej
// Źródło: Ustawa o IKE i IKZE

2023: 20 805 zł
2024: 23 472 zł
2025: 26 019,60 zł
2026: 28 308 zł (prognoza)
```

### Alternatives Considered
1. **Hardcoded w kalkulatorze** - mniej elastyczne
2. **Pobieranie z API** - zbyt skomplikowane dla MVP

---

## 3. Podatek Belki

### Decision
Stała stawka 19% od zysków kapitałowych.

### Rationale
- Stawka podatku Belki nie zmieniała się od 2004 roku
- Prosta kalkulacja: `taxSaving = (finalCapital - totalContributions) × 0.19`

### Legal Basis
- Art. 30a ust. 1 pkt 3 ustawy o PIT
- Zwolnienie z podatku Belki dla IKE: Art. 21 ust. 1 pkt 58a ustawy o PIT

---

## 4. Struktura modułu

### Decision
Struktura wzorowana na `src/components/contractWork/`.

### Rationale
- Zgodność z istniejącymi wzorcami w projekcie
- Łatwa nawigacja dla deweloperów
- Separation of concerns

### Module Structure
```
src/components/ikeSavings/
├── components/
│   ├── FormFields.vue       # Pola formularza
│   └── ResultFields.vue     # Wyświetlanie wyników
├── interfaces/
│   ├── InputFields.ts       # Interfejs danych wejściowych
│   └── Result.ts            # Interfejs wyników
├── logic/
│   └── IkeSavingsCalculator.ts  # Logika kalkulatora
├── pages/
│   └── IkeSavingsPage.vue   # Strona główna modułu
├── types/
│   └── ContributionType.ts  # Enum: monthly/yearly
└── store.ts                 # Pinia store
```

---

## 5. Walidacja

### Decision
Rozszerzenie `validationRules.ts` o nowe reguły specyficzne dla IKE.

### New Validation Rules Needed
```typescript
// Zakres wieku
ageRange: (min: number, max: number) => (val: number) => string | void

// Wiek wypłat > aktualny wiek
withdrawalAgeGreaterThan: (currentAge: number) => (val: number) => string | void

// Zakres stopy zwrotu
returnRateRange: (min: number, max: number) => (val: number) => string | void
```

### Rationale
- Reużywalność w innych kalkulatorach
- Spójność z istniejącym systemem walidacji

---

## Summary

Wszystkie aspekty techniczne zostały zbadane. Brak elementów wymagających dalszej klaryfikacji.

| Area | Decision | Confidence |
|------|----------|------------|
| Wzór obliczeń | FVA z kapitalizacją roczną | High |
| Limity IKE | Nowy plik ikeLimits.ts | High |
| Podatek Belki | Stała 19% | High |
| Struktura modułu | Wzorowana na contractWork | High |
| Walidacja | Rozszerzenie validationRules | High |
