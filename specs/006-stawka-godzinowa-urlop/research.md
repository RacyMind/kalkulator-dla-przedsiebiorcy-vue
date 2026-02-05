# Research: Stawka godzinowa i urlop w JDG

## Cel

Ustalić sposób wprowadzenia stawki godzinowej, planowanych godzin pracy oraz odliczenia urlopu/zwolnienia w istniejącym module samozatrudnienia.

## Obserwacje (stan obecny)

- Moduł `selfEmployment` posiada formularz wejściowy z polami miesięcznego przychodu i kosztów.
- Logika obliczeń opiera się o `BasicCalculator` i używa wejściowej wartości `revenue` jako miesięcznego przychodu.
- Walidacja bazuje na `validationRules`.

## Decyzje

- **Decision**: Tryb przychodu jest wybierany z listy rozwijanej, domyślnie ustawionej na wersję aktualną (miesięczny przychód).
  - **Rationale**: Uproszczenie UX i zgodność z doprecyzowaniami spec.
- **Decision**: Przy trybie stawki godzinowej przychód miesięczny obliczany jest jako `stawka * (godziny planowane - godziny urlopu)`.
  - **Rationale**: Wymaganie spec i jasny model obliczeń.
- **Decision**: Godziny mogą być dziesiętne i są podawane miesięcznie.
  - **Rationale**: Spójność z realnymi rozliczeniami godzinowymi.

## Ryzyka i mitigacje

- **Ryzyko**: Godziny urlopu większe niż plan godzin.
  - **Mitigacja**: Walidacja i limit przychodu do 0.

## Konkluzja

Rozszerzenie dotyczy wyłącznie modułu `selfEmployment` i nie wymaga integracji z zewnętrznymi API.
