# Research: Dodanie obligacji ROS i ROD

**Feature**: [spec.md](./spec.md)  
**Branch**: `001-obligacje-ros-rod`  
**Date**: 2026-01-25

## Product Parameter Research (obligacjeskarbowe.pl)

### Decision: Parametry produktu dla ROS

- **Decision**: ROS to obligacje 6-letnie, z roczną kapitalizacją, wypłata odsetek przy wykupie, cena 100 zł, oprocentowanie zmienne: w 1. roku stałe wg oferty, w kolejnych latach: inflacja (min 0) + marża.
- **Rationale**: Zgodność z oficjalnym opisem produktu.
- **Sources**:
  - https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-6-letnie-ros/ros1231/
  - (sekcja „Oprocentowanie” i „Pozostałe informacje o obligacji”)

### Decision: Parametry produktu dla ROD

- **Decision**: ROD to obligacje 12-letnie, z roczną kapitalizacją, wypłata odsetek przy wykupie, cena 100 zł, oprocentowanie zmienne: w 1. roku stałe wg oferty, w kolejnych latach: inflacja (min 0) + marża.
- **Rationale**: Zgodność z oficjalnym opisem produktu.
- **Sources**:
  - https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-12-letnie-rod/rod0935/
  - (sekcja „Oprocentowanie” i „Pozostałe informacje o obligacji”)

## Clarification-driven Decisions (from spec)

### Decision: Inflacja

- **Decision**: Jedna wartość „inflacja roczna (%)” używana dla wszystkich kolejnych rocznych okresów odsetkowych.
- **Rationale**: Minimalizuje zmiany w formularzu i jest spójne z istniejącym podejściem w module obligacji.
- **Alternatives considered**:
  - Lista inflacji per rok (większy koszt UX i testów)
  - Domyślna inflacja + nadpisania per rok (bardziej złożone)

### Decision: Przedterminowy wykup

- **Decision**: Brak symulacji przedterminowego wykupu (tylko trzymanie do wykupu).
- **Rationale**: Opłaty i zasady zależą od emisji, co wymagałoby dodatkowych wejść i rozbudowy UX.
- **Alternatives considered**:
  - Symulacja przedterminowego wykupu z opłatą
  - Opis informacyjny bez obliczeń

### Decision: Marża

- **Decision**: Marża stała wg typu obligacji i nieedytowalna przez użytkownika (ROS 2,00%, ROD 1,75%).
- **Rationale**: Marża jest parametrem produktu, a nie decyzją użytkownika.

### Decision: Podatek Belki

- **Decision**: Podatek Belki naliczany i uwzględniany dopiero przy wykupie.
- **Rationale**: Spójne z założeniem wypłaty przy wykupie i upraszcza interpretację.

### Decision: Oprocentowanie w 1. roku

- **Decision**: Pole ma domyślną wartość (z aktualnej oferty), ale użytkownik może je edytować.
- **Rationale**: Ułatwia użycie, bez blokowania ręcznej symulacji.
