# Feature Specification: Dodanie obligacji ROS i ROD
 
**Branch**: `001-obligacje-ros-rod`  
**Created**: 2026-01-25  
**Status**: Draft  
**Input**: User description: "Brakuje obligacji Ros i ROD w kalkulatorze https://www.obligacjeskarbowe.pl/"

## Clarifications

### Session 2026-01-25

- Q: Inflacja w kolejnych latach (ROS/ROD) → A: Jedna wartość „inflacja roczna (%)” używana dla wszystkich kolejnych rocznych okresów odsetkowych.
- Q: Przedterminowy wykup (ROS/ROD) → A: Nie uwzględniać przedterminowego wykupu — tylko symulacja trzymania do wykupu.
- Q: Marża ROS/ROD (w kolejnych latach) → A: Marża jest stała wg typu obligacji i użytkownik jej nie edytuje.
- Q: Podatek Belki dla ROS/ROD — kiedy naliczany? → A: Podatek Belki naliczany i uwzględniany dopiero przy wykupie (na końcu).
- Q: Oprocentowanie w 1. roku (ROS/ROD) — skąd w formularzu? → A: Pole ma domyślną wartość (z aktualnej oferty) i użytkownik może ją edytować.
 
## User Scenarios *(required)*
 
<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->
 
### Scenario 1 - Obliczenie zysków dla ROS lub ROD (Priority: P1) 🎯 MVP
 
Użytkownik wybiera w module "Obligacje skarbowe" nowy typ obligacji: ROS (6-letnie) lub ROD (12-letnie), podaje parametry i otrzymuje wyniki w zakładkach "Podsumowanie" i "Wypłaty".
 
**Priority Justification**: To główny brak funkcjonalny — bez ROS/ROD kalkulator nie obsługuje pełnej oferty obligacji rodzinnych.
 
**Independent Test**: Na świeżo otwartym module wybrać ROS, wprowadzić dane wejściowe, zatwierdzić i zweryfikować długość okresu oraz logikę oprocentowania (pierwszy rok vs kolejne lata) i wypłatę przy wykupie.
 
**Acceptance Criteria**:
 
1. **Given** użytkownik jest na ekranie "Obligacje skarbowe", **When** rozwinie listę "Wybierz rodzaj obligacji", **Then** widzi opcje ROS i ROD opisane w języku polskim.
2. **Given** użytkownik wybrał ROS lub ROD, **When** uzupełni wymagane pola formularza i kliknie przelicz, **Then** aplikacja pokazuje wyniki (Podsumowanie i Wypłaty) bez błędów walidacji.
3. **Given** użytkownik podał inflację ujemną, **When** zostanie obliczone oprocentowanie w kolejnych rocznych okresach odsetkowych, **Then** do wyznaczenia oprocentowania przyjmowana jest inflacja równa 0.
4. **Given** użytkownik ma włączony "Podatek Belki", **When** następuje wykup obligacji (koniec okresu), **Then** podatek jest uwzględniony w wypłacie oraz w sumarycznych wartościach podatku.
 
**Calculation Example**:
```
Input data:
- rodzaj obligacji: ROS
- liczba obligacji: 1
- inflacja roczna: 3,60%
- podatek Belki: tak
- oprocentowanie w 1. roku: 5,20%

Expected results:
- okres inwestycji: 6 lat (72 miesiące)
- w 1. roku oprocentowanie: 5,20%
- od 2. roku oprocentowanie: inflacja (min 0) + marża ROS
- wypłata odsetek: przy wykupie
```
 
---
 
### Scenario 2 - Porównanie ROS i ROD na tych samych danych (Priority: P2)
 
Użytkownik przełącza rodzaj obligacji pomiędzy ROS i ROD, aby porównać wpływ innego okresu (6 vs 12 lat) i innej marży na wynik.
 
**Priority Justification**: Umożliwia szybkie porównanie dwóch obligacji rodzinnych w ramach jednego modułu.
 
**Acceptance Criteria**:
 
1. **Given** użytkownik ma już wyliczone wyniki dla ROS, **When** zmieni typ na ROD i ponownie przeliczy, **Then** widzi wyniki dla ROD, a okres inwestycji i logika oprocentowania odpowiada ROD.
 
---
 
[Add more scenarios as needed]
 
### Edge Cases
 
- Co jeśli użytkownik wpisze liczbę obligacji 0?
- Co jeśli użytkownik wpisze ujemną inflację (deflację)?
- Co jeśli użytkownik wyłączy podatek Belki?
- Co jeśli użytkownik wpisze oprocentowanie w 1. roku poza zakresem (np. ujemne lub bardzo wysokie)?
 
## Requirements *(required)*
 
### Functional Requirements
 
 - **FR-001**: Użytkownik MUST móc wybrać typ obligacji `ROS` oraz `ROD` w module "Obligacje skarbowe".
 - **FR-002**: Formularz MUST zbierać wymagane dane wspólne (liczba obligacji, inflacja, podatek Belki) oraz dane specyficzne (oprocentowanie w 1. roku dla ROS/ROD).
 - **FR-003**: Kalkulator MUST walidować dane wejściowe zgodnie z regułami walidacji stosowanymi w aplikacji.
 - **FR-004**: Logika obliczeń MUST być spójna z pozostałymi kalkulatorami w aplikacji i korzystać ze wspólnego mechanizmu obliczeń.
 - **FR-005**: UI MUST używać standardowych komponentów formularza stosowanych w aplikacji.
 - **FR-006**: Teksty w UI MUST być w języku polskim.
 - **FR-007**: Kalkulator MUST prezentować wynik symulacji wyłącznie dla scenariusza trzymania obligacji do wykupu (brak symulacji przedterminowego wykupu).
 - **FR-008**: Pole "oprocentowanie w 1. roku" dla ROS/ROD MUST być domyślnie uzupełnione wg aktualnej oferty i umożliwiać edycję przez użytkownika.
 
### Calculation Requirements
 
- **CR-001**: Dla ROS okres oszczędzania MUST wynosić 6 lat.
- **CR-002**: Dla ROD okres oszczędzania MUST wynosić 12 lat.
- **CR-003**: Cena nominalna jednej obligacji MUST wynosić 100 zł.
- **CR-004**: Oprocentowanie w 1. rocznym okresie odsetkowym MUST pochodzić z danych wejściowych użytkownika.
- **CR-005**: Oprocentowanie w kolejnych rocznych okresach odsetkowych MUST być liczone jako suma: `max(0, inflacja)` + marża.
- **CR-006**: Marża MUST odpowiadać charakterystyce emisji:
  - ROS: 2,00%
  - ROD: 1,75%
- **CR-006a**: Marża MUST nie być edytowalna przez użytkownika.
- **CR-007**: Odsetki MUST być kapitalizowane rocznie i wypłacane przy wykupie.
- **CR-008**: Jeżeli podatek Belki jest włączony, podatek MUST być uwzględniony w wartości wypłaty przy wykupie.
- **CR-009**: Wyniki MUST być zaokrąglane do 2 miejsc po przecinku.
- **CR-010**: Wartość "inflacja roczna (%)" MUST być pojedynczą wartością wejściową i dotyczyć wszystkich kolejnych rocznych okresów odsetkowych.
- **CR-011**: Jeżeli podatek Belki jest włączony, MUST być naliczany i uwzględniany tylko przy wykupie (koniec okresu), a nie w trakcie trwania inwestycji.
 
### Key Entities
 
 - **Typ obligacji**: lista dostępnych typów obligacji skarbowych w module, rozszerzona o ROS i ROD.
 - **Dane wejściowe symulacji**: wartości podawane przez użytkownika (m.in. liczba obligacji, inflacja, podatek Belki, oprocentowanie w 1. roku).
 - **Parametry produktu**: stałe i zasady produktu (okres: 6/12 lat, marża, kapitalizacja roczna, wypłata przy wykupie, cena 100 zł).
 - **Wynik symulacji**: wartości prezentowane użytkownikowi w podsumowaniu i szczegółach wypłat.

### Assumptions

- Użytkownik wprowadza oprocentowanie w 1. roku zgodnie z aktualną ofertą opublikowaną na obligacjeskarbowe.pl.
- Kalkulator nie weryfikuje uprawnień do zakupu obligacji rodzinnych ani limitu zakupu (symulacja ma charakter informacyjny).
- Marże ROS/ROD są przyjmowane zgodnie z opisem produktu na obligacjeskarbowe.pl (na dzień tworzenia specyfikacji).
- Przedterminowy wykup oraz opłaty za przedterminowy wykup nie są elementem tej wersji funkcjonalności.

### Dependencies

- Dostęp do opisu parametrów ROS i ROD na obligacjeskarbowe.pl w celu utrzymania zgodności parametrów produktu.

## Success Criteria *(required)*

### Measurable Outcomes
 
- **SC-001**: Użytkownik może wykonać obliczenie dla ROS i ROD w module "Obligacje skarbowe" i zobaczyć wyniki w obu zakładkach.
- **SC-002**: Parametry produktu (okres, marża, kapitalizacja, wypłata przy wykupie) dla ROS i ROD są zgodne z opisem na obligacjeskarbowe.pl.
- **SC-003**: Dostępne są testy jednostkowe dla ROS i ROD, obejmujące wszystkie wartości wyjściowe wyników.
- **SC-004**: Dodanie ROS i ROD nie psuje działania istniejących kalkulatorów obligacji (OTS/ROR/DOR/TOS/COI/EDO).
