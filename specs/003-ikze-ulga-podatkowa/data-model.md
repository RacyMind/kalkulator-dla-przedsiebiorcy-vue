# Data Model: Kalkulator ulgi podatkowej IKZE

## Cel

Opisać model danych na poziomie UI i logiki kalkulatora (pola wejściowe, wartości pochodne, wyniki) dla modułu IKZE.

## Encje

### 1) Dane wejściowe (IKZEInput)

- **Opis**: Dane wymagane do obliczenia ulgi IKZE i oszczędności podatkowej.
- **Pola**:
  - `dateOfLawRules` (Date) — data obowiązywania przepisów (2023-2026)
  - `status` (IKZELimitStatus) — `employment_contract` (umowa o pracę) | `self_employment` (działalność gospodarcza)
  - `taxSystem` (IKZETaxSystem)
    - dla `employment_contract`: zawsze `tax_scale` (skala podatkowa)
    - dla `self_employment`: `tax_scale` | `flat_tax` | `lump_sum`
  - `ikzeContribution` (number) — kwota wpłaty na IKZE
  - `taxBaseBeforeRelief` (number)
    - dla `tax_scale` / `flat_tax`: roczna podstawa opodatkowania przed odliczeniem
    - dla `lump_sum`: roczny przychód do opodatkowania ryczałtem
  - `lumpSumTaxRate` (number | undefined) — wymagana tylko dla `taxSystem = lump_sum`

### 2) Dane pochodne (IKZEDerived)

- **Opis**: Wartości wyliczane z wejścia i danych rocznych.
- **Pola**:
  - `ikzeLimit` (number) — limit IKZE dla wybranego `dateOfLawRules` i `status`
  - `taxBaseAfterRelief` (number) — `max(0, taxBaseBeforeRelief - ikzeContribution)`

### 3) Wynik (IKZEResult)

- **Opis**: Dane prezentowane użytkownikowi.
- **Pola**:
  - `dateOfLawRules` (Date)
  - `status` (IKZELimitStatus)
  - `taxSystem` (IKZETaxSystem)
  - `ikzeLimit` (number)
  - `ikzeContribution` (number)
  - `taxBaseBeforeRelief` (number)
  - `taxBaseAfterRelief` (number)
  - `taxBeforeRelief` (number)
  - `taxAfterRelief` (number)
  - `taxSaving` (number) — `taxBeforeRelief - taxAfterRelief`

## Walidacja

- `dateOfLawRules`: wybór ograniczony do wspieranych dat (2023-2026).
- `status`: wymagane.
- `taxSystem`:
  - dla `employment_contract` nieedytowalne (wymuszone `tax_scale`)
  - dla `self_employment` wymagane (wybór z 3 opcji)
- `ikzeContribution`: wymagane, `>= 0`, oraz `<= ikzeLimit`.
- `taxBaseBeforeRelief`: wymagane, `>= 0`.
- `lumpSumTaxRate`: wymagane tylko dla `taxSystem = lump_sum`.
