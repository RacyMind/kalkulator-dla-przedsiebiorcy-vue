# Quickstart: Kalkulator IKE

**Feature**: 004-ike-savings-calculator  
**Date**: 2026-01-24

## Cel modułu

Podstawowy symulator oszczędności IKE (Indywidualne Konto Emerytalne) obliczający:
- Przewidywany kapitał na emeryturze
- Oszczędność podatkową (zwolnienie z 19% podatku Belki)
- Średnią miesięczną emeryturę

## Szybki start dla deweloperów

### 1. Struktura plików do utworzenia

```
src/components/ikeSavings/
├── components/
│   ├── FormFields.vue
│   └── ResultFields.vue
├── interfaces/
│   ├── InputFields.ts
│   └── Result.ts
├── logic/
│   └── IkeSavingsCalculator.ts
├── pages/
│   └── IkeSavingsPage.vue
├── types/
│   └── ContributionType.ts
└── store.ts

src/logic/
└── ikeLimits.ts

test/vitest/__tests__/modules/ikeSavings/
└── IkeSavingsCalculator.test.ts
```

### 2. Kluczowe pliki do zaimplementowania

#### A. Kalkulator (logika biznesowa)

```typescript
// src/components/ikeSavings/logic/IkeSavingsCalculator.ts
import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'
import { InputFields } from '../interfaces/InputFields'
import { Result } from '../interfaces/Result'

export class IkeSavingsCalculator 
  extends BasicCalculator<InputFields, Result> 
  implements Calculator<InputFields, Result> {
  
  public calculate(): this {
    // Implementacja wzoru FVA
    // Zobacz: research.md sekcja 1
  }
}
```

#### B. Store (stan aplikacji)

```typescript
// src/components/ikeSavings/store.ts
import { defineStore } from 'pinia'
import { IkeSavingsCalculator } from './logic/IkeSavingsCalculator'

export const useIkeSavingsStore = defineStore('ikeSavingsStore', {
  state: () => ({ inputFields: undefined }),
  getters: {
    result(state) {
      if (!state.inputFields) return undefined
      return new IkeSavingsCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    }
  }
})
```

### 3. Wzór obliczeń

```
FV = P × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]

Gdzie:
- FV = przewidywany kapitał
- P = kapitał początkowy
- r = roczna stopa zwrotu (np. 0.05)
- n = liczba lat oszczędzania
- PMT = roczna składka
```

### 4. Integracja z routerem

```typescript
// src/router/routes.ts - dodać nową ścieżkę
{
  path: '/ike-savings',
  component: () => import('components/ikeSavings/pages/IkeSavingsPage.vue')
}
```

### 5. Integracja z menu

```typescript
// src/components/partials/menu/menuItems.ts - dodać nowy element
{
  title: 'Kalkulator IKE',
  icon: 'savings',
  to: '/ike-savings'
}
```

## Testy

### Uruchomienie testów

```bash
npx vitest run test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts
```

### Przykładowy test

```typescript
describe('IkeSavingsCalculator', () => {
  it('calculates capital for 30 years of saving', () => {
    const calculator = new IkeSavingsCalculator()
    calculator.setInputData({
      currentAge: 30,
      contributionType: ContributionType.Monthly,
      contributionAmount: 500,
      expectedReturnRate: 5,
      withdrawalAge: 60,
      withdrawalPeriod: 20,
      initialCapital: 0
    })
    
    const result = calculator.calculate().getResult()
    
    expect(result.savingsPeriodYears).toBe(30)
    expect(result.totalContributions).toBe(180000)
    expect(result.finalCapital).toBeCloseTo(398633.28, 0)
    expect(result.taxSaving).toBeCloseTo(41540.32, 0)
    expect(result.monthlyPension).toBeCloseTo(1661.11, 0)
  })
})
```

## Checklist przed wdrożeniem

- [ ] Kalkulator rozszerza `BasicCalculator`
- [ ] UI używa komponentów Quasar
- [ ] Teksty UI w języku polskim
- [ ] Walidacja używa `validationRules`
- [ ] Testy zawierają wszystkie wartości wynikowe
- [ ] Dodano wpis do `src/components/changeLogs/logs.ts`
- [ ] Dodano routing w `src/router/routes.ts`
- [ ] Dodano pozycję w menu
