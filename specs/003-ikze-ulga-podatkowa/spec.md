# Feature Specification: Kalkulator ulgi podatkowej IKZE
 
**Branch**: `003-ikze-ulga-podatkowa`  
**Created**: 2026-01-24  
**Status**: Draft  
**Input**: User description: "Dodaj moduł Kalkulator Ulgi podatkowej dla IKZE. Uwzględnij wszystkie wspierane przez kalkulator lata"

## Clarifications

### Session 2026-01-24

- Q: Zakres form opodatkowania w kalkulatorze IKZE → A: Skala + liniowy + ryczałt
- Q: Co dokładnie ma pokazywać „limit IKZE” w UI? → A: Konkretną kwotę limitu dla wybranego roku i statusu
- Q: Co dokładnie znaczy status „umowa o pracę” vs „działalność gospodarcza” dla limitu? → A: Status jest przełącznikiem limitu (bez weryfikacji); dla umowy o pracę forma opodatkowania jest ukryta i dostępna jest tylko jedna forma
- Q: Jaka jest „jedyna dopuszczalna” forma opodatkowania dla statusu Umowa o pracę? → A: Skala podatkowa
- Q: Czy używamy wyboru roku czy dateOfLawRules? → A: Używamy `dateOfLawRules` i ignorujemy starsze lata

## User Scenarios *(required)*
 
### Scenario 1 - Obliczenie odliczenia i oszczędności podatkowej (Priority: P1) MVP
 
Użytkownik chce policzyć, jak wpłata na IKZE wpływa na jego podatek w danym roku (odliczenie od podstawy opodatkowania / przychodu) oraz ile realnie „oszczędza na podatku”, z uwzględnieniem limitu IKZE. Dla statusu działalność gospodarcza użytkownik wybiera formę opodatkowania (skala podatkowa, podatek liniowy, ryczałt), a dla statusu umowa o pracę forma opodatkowania jest ukryta i jest ustawiona na skalę podatkową.
 
**Priority Justification**: To główna wartość modułu: odpowiedź na pytanie „ile mogę odliczyć i ile mi to daje”.
 
**Independent Test**: Ustawić datę obowiązywania przepisów (2023-2026), status (umowa o pracę vs działalność gospodarcza), kwotę wpłaty oraz parametry dochodu/przychodu. Dla działalności gospodarczej przetestować wybór formy opodatkowania (skala/liniowy/ryczałt). Dla umowy o pracę potwierdzić, że wybór formy opodatkowania jest ukryty i ustawiony na skalę podatkową. Sprawdzić, że wyniki są poprawne i nie pozwalają przekroczyć limitu rocznego.
 
**Acceptance Criteria**:
 
1. **Given** użytkownik wybiera datę obowiązywania przepisów (2023, 2024, 2025, 2026), **Then** kalkulator używa parametrów (limity, progi, stawki) właściwych dla wybranego roku.
2. **Given** użytkownik wybiera datę obowiązywania przepisów i status (umowa o pracę / działalność gospodarcza), **Then** UI wyświetla konkretną kwotę obowiązującego limitu IKZE dla wybranego roku i statusu.
3. **Given** użytkownik podaje kwotę wpłaty IKZE, **When** kwota jest większa od limitu IKZE dla wybranego roku i statusu (umowa o pracę / działalność gospodarcza), **Then** UI pokazuje błąd walidacji i nie pozwala zatwierdzić wartości większej niż limit.
4. **Given** użytkownik wybiera status umowa o pracę, **Then** UI ukrywa wybór formy opodatkowania i przyjmuje skalę podatkową.
5. **Given** użytkownik wybiera status działalność gospodarcza, **Then** UI umożliwia wybór formy opodatkowania (skala/liniowy/ryczałt).
6. **Given** użytkownik wybiera status działalność gospodarcza i formę opodatkowania (skala/liniowy/ryczałt), **Then** kalkulator oblicza oszczędność podatkową poprzez porównanie podatku „przed IKZE” i „po IKZE” zgodnie z zasadami tej formy (bez upraszczania do samego iloczynu stawki i odliczenia, jeśli ma to wpływ na progi).
7. **Given** użytkownik zmienia datę obowiązywania przepisów, **Then** wszystkie limity i wyniki przeliczają się ponownie dla nowego roku.
 
**Calculation Example**:
```
Input data:
- data obowiązywania przepisów: 2026
- forma opodatkowania: skala podatkowa
- status dla limitu IKZE: umowa o pracę
- roczna podstawa opodatkowania (przed IKZE): 80 000
- wpłata na IKZE: 10 000
 
Expected results:
- limit IKZE (dla roku i statusu): wartość limitu dla wybranego roku i statusu
- kwota do odliczenia: wpłata (jeśli wpłata <= limit)
- podatek przed IKZE: wartość obliczona na podstawie danych wejściowych i formy opodatkowania
- podatek po IKZE: wartość obliczona po zastosowaniu odliczenia IKZE
- oszczędność podatkowa: podatek przed IKZE - podatek po IKZE
```
 
---
 
### Scenario 2 - Porównanie limitów dla umowy o pracę i działalności gospodarczej (Priority: P2)
 
Użytkownik chce sprawdzić różnicę pomiędzy limitem dla umowy o pracę a limitem dla działalności gospodarczej, aby wiedzieć jaka kwota wpłaty ma sens.
 
**Priority Justification**: Wpływa na decyzję o wysokości wpłaty oraz na poprawność kalkulacji dla różnych grup użytkowników.
 
**Acceptance Criteria**:
 
1. **Given** użytkownik przełącza status (umowa o pracę/działalność gospodarcza), **Then** limit IKZE i dopuszczalny zakres wpłaty aktualizują się zgodnie ze statusem.
2. **Given** wpłata jest większa niż limit dla umowy o pracę, ale mniejsza lub równa limitowi dla działalności gospodarczej, **Then** po wybraniu umowy o pracę UI pokazuje błąd walidacji, a po wybraniu działalności gospodarczej wartość jest akceptowana.
 
---
 
### Edge Cases
 
- Co jeśli użytkownik poda wpłatę ujemną lub nienumeryczną?
- Co jeśli użytkownik poda wpłatę 0?
- Co jeśli użytkownik poda wpłatę wyższą niż limit dla wybranego roku i statusu? (UI ma zablokować i pokazać komunikat)
- Co jeśli użytkownik poda dochód/przychód 0 lub wartości skrajnie duże?
- Co jeśli użytkownik wybierze datę obowiązywania przepisów spoza zakresu wspieranych dat? (UI ma ograniczać wybór)
- Co jeśli zmiana roku powoduje zmianę progów i stawek podatkowych wpływającą na oszczędność?
 
## Requirements *(required)*
 
### Functional Requirements
 
 - **FR-001**: Moduł MUST umożliwiać wybór daty obowiązywania przepisów w zakresie wspieranych dat (2023-2026).
 - **FR-002**: Moduł MUST umożliwiać wybór statusu wpływającego na limit IKZE: umowa o pracę albo działalność gospodarcza.
 - **FR-003**: Moduł MUST prezentować tooltip przy wyborze statusu, wyjaśniający, że limity IKZE różnią się w zależności od statusu.
 - **FR-004**: Moduł MUST wyświetlać konkretną kwotę obowiązującego limitu IKZE dla wybranego roku i statusu.
 - **FR-005**: Dla statusu działalność gospodarcza moduł MUST umożliwiać wybór formy opodatkowania: skala podatkowa, podatek liniowy, ryczałt.
 - **FR-006**: Dla statusu umowa o pracę moduł MUST ukrywać wybór formy opodatkowania i przyjmować skalę podatkową.
 - **FR-007**: Moduł MUST umożliwiać wprowadzenie kwoty wpłaty IKZE oraz parametrów potrzebnych do obliczenia podatku/przychodu w zależności od wybranej formy opodatkowania.
 - **FR-008**: Moduł MUST zwracać co najmniej: limit IKZE, kwotę do odliczenia, podatek/przed IKZE, podatek po IKZE, oszczędność podatkową.
 - **FR-009**: UI MUST uniemożliwiać wprowadzenie lub zatwierdzenie wpłaty IKZE większej niż limit dla wybranego roku i statusu.
 - **FR-010**: Calculator MUST validate input using `validationRules`.
 - **FR-011**: Calculator MUST use `BasicCalculator` class as base.
 - **FR-012**: UI MUST use Quasar components.
 - **FR-013**: All UI text MUST be in Polish language.
 
### Calculation Requirements
 
- **CR-001**: Kalkulacja MUST uwzględniać roczny limit IKZE zależny od daty obowiązywania przepisów oraz wybranego statusu (umowa o pracę/działalność gospodarcza).
- **CR-002**: Kalkulacja MUST uwzględniać zasady wybranej formy opodatkowania poprzez porównanie podatku „przed” i „po” zastosowaniu odliczenia IKZE.
- **CR-003**: Zmiana daty obowiązywania przepisów MUST powodować przeliczenie wszystkich wyników na podstawie danych rocznych dla tej daty.
- **CR-004**: Jeśli wpłata przekracza limit dla wybranego roku i statusu, kalkulacja MUST być zablokowana przez walidację.
- **CR-005**: Wyniki kwotowe MUST być zaokrąglane do 2 miejsc po przecinku.
- **CR-006**: Tests MUST include all output values.
 
### Key Entities
 
- **Data obowiązywania przepisów**: Data (2023-2026) determinująca rok, limity IKZE i parametry podatkowe.
- **Status dla limitu IKZE**: Umowa o pracę albo działalność gospodarcza, determinujący roczny limit odliczenia.
- **Forma opodatkowania**: Wybrany sposób rozliczenia wpływający na metodę wyliczenia podatku przed/po IKZE.
- **Wpłata IKZE**: Kwota zadeklarowanej wpłaty (nie większa niż limit dla wybranego roku i statusu).
- **Wynik kalkulacji**: Zestaw wartości prezentowanych użytkownikowi (limit, odliczenie, podatki, oszczędność).
 
## Success Criteria *(required)*
 
### Measurable Outcomes
 
 - **SC-001**: Użytkownik może wykonać kalkulację (ustawić datę obowiązywania przepisów, wpłatę i formę opodatkowania) w maksymalnie 3 interakcjach w UI.
 - **SC-002**: Dla każdej wspieranej daty (2023-2026) kalkulator nie pozwala wprowadzić wpłaty większej niż roczny limit IKZE dla wybranego statusu (umowa o pracę/działalność gospodarcza).
 - **SC-003**: Dla każdej wspieranej daty (2023-2026) UI wyświetla konkretną kwotę limitu IKZE dla wybranego roku i statusu.
 - **SC-004**: Wszystkie testy jednostkowe modułu przechodzą i zawierają wszystkie wartości wyjściowe.
 - **SC-005**: UI działa poprawnie na urządzeniach mobilnych i desktop.
