# Data Model: Ujednolicenie UI modułów

## Kontekst

Feature nie wprowadza nowych bytów domenowych ani zmian w logice obliczeń. Poniżej opis istniejących struktur danych, które będą dotykane na poziomie UI (formularz → wyniki).

## Encje i pola

### Faktura VAT

- **InvoiceInputFields** (`src/components/invoice/interfaces/InvoiceInputFields.ts`)
  - `amount: number`
  - `amountType: AmountType`
  - `taxRate: VatTaxRate`

- **Stan UI (page-level)**
  - źródło: `ref(invoiceInputFields)` w `src/pages/Invoice.vue`

### Limit sprzedaży dla zwolnienia z VAT

- **VatLimitInputFields** (`src/components/vatLimit/interfaces/VatLimitInputFields.ts`)
  - `startDate: Date | null`

- **Stan UI (page-level)**
  - źródło: `ref(inputFields)` w `src/pages/VatLimit.vue`

### Lokata

- **InvestmentInputFields** (`src/components/investment/interfaces/InvestmentInputFields.ts`)
  - `amount: number`
  - `monthCount: number`
  - `rate: number`

- **Stan UI (page-level)**
  - źródło: `ref(inputFields)` w `src/pages/Investment.vue`

### Odsetki

- **InterestInputFields** (`src/components/interest/interfaces/InterestInputFields.ts`)
  - `amount: number`
  - `dayCount: number`
  - `rate: number`

- **Stan UI (page-level)**
  - źródło: `ref(inputFields)` w `src/pages/Interest.vue`

### Waluty: Przelicznik walut

- **CurrencyConverterInputFields** (`src/components/currencyConverter/interfaces/CurrencyConverterInputFields.ts`)
  - `amount: number`
  - `fromCurrency: string`
  - `toCurrency: string`
  - `valueForOne: number`
  - `valueForWholeAmount: number`

- **Stan aplikacji (store)**
  - `useCurrencyConverterStore` (`src/stores/currency-converter-store.ts`)
    - `amount: number | null`
    - `fromCurrency: string | null`
    - `toCurrency: string | null`
    - `valueForOne: number | null`
    - `valueForWholeAmount: number | null`

### Waluty: Kursy walut

- **Stan aplikacji (store)**
  - `useCurrencyRateStore` (`src/stores/currency-rate-store.ts`)
    - `currencyRate: any | null`
    - `currencyRates: any[]`
    - `date: string`
    - `isLoading: boolean`

## Relacje i przepływy

- **Strony modułów**: zbierają dane wejściowe w `ref(...)` albo w store; renderują komponenty wyników na podstawie tego stanu.
- **Waluty**: opierają się na store + API NBP; UI refaktor nie powinien zmieniać stanu ani metod ładowania danych.

## Walidacja

Walidacja na UI jest realizowana przez istniejące reguły w `src/logic/validationRules` (różne moduły używają różnych zestawów reguł). Feature ma ujednolicić UX walidacji, ale nie zmieniać znaczenia reguł.
