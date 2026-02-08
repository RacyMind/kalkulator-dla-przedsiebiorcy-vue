# Feature Specification: Stawka godzinowa i urlop w JDG

**Branch**: `[006-stawka-godzinowa-urlop]`  
**Created**: 2026-02-05  
**Status**: Draft  
**Input**: User description: "Dodać opcję wpisania stawki godzinowej przy samozatrudnieniu i odliczenia urlopu / zwolnienia"

## Clarifications

### Session 2026-02-05

- Q: Zakres godzin urlopu/zwolnienia → A: Miesięcznie
- Q: Zachowanie przy ułamkach godzin → A: Godziny mogą być dziesiętne
- Q: Tryb wprowadzania przychodu → A: Jeden tryb (lista rozwijana, domyślnie wersja aktualna)

## User Scenarios *(required)*

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Stawka godzinowa z odliczeniem urlopu (Priority: P1) 🎯 MVP

Użytkownik w module samozatrudnienia wybiera tryb stawki godzinowej, wpisuje planowaną liczbę godzin pracy w miesiącu, włącza odliczenie urlopu/zwolnienia i podaje liczbę godzin niepracujących. Kalkulator obniża przychód bazowy o nieprzepracowane godziny.

**Priority Justification**: To główna wartość funkcji — pozwala od razu zobaczyć wpływ urlopu/zwolnienia na przychód w JDG.

**Independent Test**: Ustawić wejścia godzinowe oraz odliczenie urlopu i zweryfikować, że przychód miesięczny zmniejsza się o odpowiednią liczbę godzin.

**Acceptance Criteria**:

1. **Given** wybrany tryb stawki godzinowej i włączone odliczenie urlopu, **When** użytkownik wpisze stawkę, plan godzin i liczbę godzin urlopu/zwolnienia, **Then** przychód miesięczny zostanie obliczony jako stawka * (godziny planowane - godziny urlopu).
2. **Given** godziny urlopu większe lub równe godzinom planowanym, **When** użytkownik zatwierdzi dane, **Then** przychód miesięczny zostanie ustawiony na 0, a pole zostanie oznaczone komunikatem walidacyjnym.

**Calculation Example**:
```
Input data:
- Stawka godzinowa: 120 zł
- Godziny pracy w miesiącu: 160
- Odlicz urlop/zwolnienie: tak
- Godziny urlopu/zwolnienia: 24

Expected results:
- Godziny rozliczane: 136
- Przychód miesięczny z JDG: 16 320 zł
```

---

### Scenario 2 - Stawka godzinowa bez odliczenia urlopu (Priority: P2)

Użytkownik wybiera tryb stawki godzinowej, nie włącza odliczenia urlopu/zwolnienia i widzi przychód wynikający wyłącznie z planowanej liczby godzin.

**Priority Justification**: Utrzymuje prosty wariant wejścia godzinowego bez dodatkowych odliczeń.

**Acceptance Criteria**:

1. **Given** wybrany tryb stawki godzinowej i wyłączone odliczenie urlopu, **When** użytkownik wpisze stawkę i plan godzin, **Then** przychód miesięczny jest równy stawka * godziny planowane.

---

[Add more scenarios as needed]

### Edge Cases

- Użytkownik wpisuje stawkę godzinową 0 lub wartość ujemną.
- Godziny urlopu są większe niż plan godzin pracy w miesiącu.
- Użytkownik włącza odliczenie urlopu, ale nie wpisuje godzin urlopu.
- Wartości godzin zawierają miejsca dziesiętne (np. 12,5).

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Kalkulator JDG MUSI udostępniać tryb wprowadzania stawki godzinowej jako alternatywę dla miesięcznego przychodu.
- **FR-001a**: Wybór trybu przychodu MUSI odbywać się przez listę rozwijaną, z domyślnie ustawioną wersją aktualną.
- **FR-002**: Kalkulator JDG MUSI przyjmować planowaną liczbę godzin pracy w miesiącu przy trybie stawki godzinowej.
- **FR-003**: Kalkulator JDG MUSI pozwalać włączyć opcję „Odlicz urlop/zwolnienie” i podać liczbę godzin urlopu/zwolnienia.
- **FR-004**: Kalkulator JDG MUSI obniżać przychód miesięczny o godziny urlopu/zwolnienia, gdy opcja jest aktywna.
- **FR-004a**: Godziny urlopu/zwolnienia MUSZĄ być podawane w ujęciu miesięcznym.
- **FR-004b**: Kalkulator MUSI akceptować wartości dziesiętne dla godzin pracy i godzin urlopu/zwolnienia.
- **FR-005**: Kalkulator MUSI walidować wejścia przy użyciu `validationRules`.
- **FR-006**: Kalkulator MUSI używać klasy `BasicCalculator` jako bazy.
- **FR-007**: UI MUSI używać komponentów Quasar.
- **FR-008**: Cały tekst w UI MUSI być w języku polskim.

### Calculation Requirements

- **CR-001**: Obliczenia MUSZĄ używać aktualnych stawek z `constants.ts`.
- **CR-002**: Wyniki MUSZĄ być zaokrąglane do 2 miejsc po przecinku (grosze).
- **CR-003**: Godziny urlopu/zwolnienia nie mogą zmniejszać liczby godzin rozliczanych poniżej 0.
- **CR-004**: Testy MUSZĄ zawierać wszystkie wartości wyjściowe.

### Assumptions

- Tryb stawki godzinowej dotyczy wyłącznie modułu samozatrudnienia (JDG/B2B).
- Użytkownik sam definiuje planowaną liczbę godzin pracy w miesiącu.

### Key Entities

- **Stawka godzinowa**: Kwota netto za jedną godzinę pracy w JDG.
- **Godziny pracy w miesiącu**: Planowana liczba godzin rozliczanych w miesiącu.
- **Godziny urlopu/zwolnienia**: Liczba godzin niepracujących, które zmniejszają przychód.

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Użytkownik może wprowadzić stawkę godzinową i urlop w maksymalnie 4 interakcjach.
- **SC-002**: Przy włączonym odliczeniu urlopu przychód miesięczny jest zgodny z formułą stawka * (godziny planowane - godziny urlopu).
- **SC-003**: Wszystkie testy jednostkowe przechodzą i zawierają komplet wartości wyjściowych.
- **SC-004**: UI działa poprawnie na urządzeniach mobilnych i desktop.
