# Feature Specification: Kalkulator IKE – podstawowy symulator oszczędności

**Branch**: `004-ike-savings-calculator`  
**Created**: 2026-01-24  
**Status**: Draft  
**Input**: User description: "Prosty moduł kalkulatora IKE, w którym użytkownik podaje aktualny wiek, składkę, stopę zwrotu i wiek wypłat. Wynik: przewidywany kapitał, oszczędność podatkowa (zwolnienie z podatku Belki 19%), średnia miesięczna emerytura."

## User Scenarios *(required)*

### Scenario 1 - Obliczenie przewidywanego kapitału IKE (Priority: P1) 🎯 MVP

Użytkownik wprowadza swoje dane demograficzne i parametry oszczędzania, aby zobaczyć ile kapitału zgromadzi na koncie IKE do momentu rozpoczęcia wypłat.

**Priority Justification**: Kluczowa funkcjonalność modułu - bez niej użytkownik nie może ocenić potencjału oszczędzania.

**Independent Test**: Wprowadź dane testowe i zweryfikuj czy kapitał jest obliczany poprawnie według wzoru procentu składanego.

**Acceptance Criteria**:

1. **Given** użytkownik ma 30 lat, **When** wprowadzi składkę 500 zł/mies., stopę zwrotu 5%, wiek wypłat 60 lat, **Then** system wyświetli przewidywany kapitał zgodny z wzorem procentu składanego
2. **Given** użytkownik zmieni parametry, **When** zaktualizuje wartości, **Then** wynik zostanie przeliczony automatycznie
3. **Given** użytkownik wprowadzi składkę roczną, **When** przełączy typ składki, **Then** obliczenia będą bazować na składce rocznej

**Calculation Example**:
```
Input data:
- Aktualny wiek: 30 lat
- Składka miesięczna: 500 zł
- Oczekiwana stopa zwrotu: 5% rocznie
- Wiek rozpoczęcia wypłat: 60 lat
- Okres oszczędzania: 30 lat

Expected results:
- Suma wpłat: 180 000 zł (500 × 12 × 30)
- Przewidywany kapitał: ~416 129,32 zł (procent składany, kapitalizacja roczna z wpłatami miesięcznymi)
- Zysk z inwestycji: ~236 129,32 zł
```

---

### Scenario 2 - Obliczenie oszczędności podatkowej (Priority: P1) 🎯 MVP

Użytkownik widzi ile zaoszczędzi na podatku Belki (19% od zysków kapitałowych) dzięki IKE w porównaniu do standardowego rachunku maklerskiego.

**Priority Justification**: To główna korzyść IKE - zwolnienie z podatku od zysków kapitałowych. Musi być widoczna dla użytkownika.

**Independent Test**: Porównaj obliczony zysk z podatkiem 19% vs bez podatku.

**Acceptance Criteria**:

1. **Given** użytkownik zgromadził kapitał z zyskiem, **When** system obliczy oszczędność podatkową, **Then** wyświetli kwotę równą 19% od zysku (różnica między kapitałem a sumą wpłat)
2. **Given** kapitał IKE wynosi 416 129,32 zł przy wpłatach 180 000 zł, **When** system obliczy oszczędność, **Then** pokaże ~44 864,57 zł oszczędności (19% × 236 129,32 zł)

**Calculation Example**:
```
Input data:
- Przewidywany kapitał: 416 129,32 zł
- Suma wpłat: 180 000 zł
- Zysk z inwestycji: 236 129,32 zł

Expected results:
- Podatek Belki (19%): 44 864,57 zł
- Oszczędność podatkowa IKE: 44 864,57 zł
```

---

### Scenario 3 - Obliczenie średniej miesięcznej emerytury (Priority: P1) 🎯 MVP

Użytkownik może zobaczyć szacunkową miesięczną kwotę wypłaty w zależności od wybranego okresu pobierania środków z IKE.

**Priority Justification**: Pomaga użytkownikowi zrozumieć rzeczywistą wartość zgromadzonych oszczędności w kontekście przyszłej emerytury.

**Independent Test**: Podziel kapitał przez liczbę miesięcy wypłat.

**Acceptance Criteria**:

1. **Given** użytkownik ma kapitał 416 129,32 zł, **When** wybierze okres wypłat 20 lat, **Then** zobaczy średnią miesięczną emeryturę ~1 733,87 zł
2. **Given** użytkownik zmieni okres wypłat, **When** zaktualizuje wartość, **Then** miesięczna emerytura zostanie przeliczona
3. **Given** użytkownik nie poda okresu wypłat, **When** system wyświetli wyniki, **Then** użyje domyślnego okresu 20 lat

**Calculation Example**:
```
Input data:
- Przewidywany kapitał: 416 129,32 zł
- Okres wypłat: 20 lat (240 miesięcy)

Expected results:
- Średnia miesięczna emerytura: 1 733,87 zł
```

---

### Scenario 4 - Walidacja limitów wpłat IKE (Priority: P2)

System informuje użytkownika o rocznym limicie wpłat na IKE i waliduje wprowadzone wartości.

**Priority Justification**: Ważne dla zgodności z przepisami, ale nie blokuje podstawowej funkcjonalności kalkulatora.

**Acceptance Criteria**:

1. **Given** użytkownik wprowadza składkę roczną, **When** przekroczy limit IKE, **Then** system wyświetli ostrzeżenie z aktualnym limitem
2. **Given** rok podatkowy się zmienia, **When** system pobierze aktualne limity, **Then** walidacja będzie używać właściwego limitu dla danego roku

---

### Scenario 5 - Wybór typu składki (Priority: P2)

Użytkownik może wybrać czy chce wprowadzić składkę miesięczną czy roczną.

**Priority Justification**: Elastyczność wprowadzania danych zwiększa użyteczność kalkulatora.

**Acceptance Criteria**:

1. **Given** użytkownik wybiera typ składki, **When** przełączy między miesięczną a roczną, **Then** formularz dostosuje etykiety i walidację
2. **Given** składka miesięczna 500 zł, **When** przełączy na roczną, **Then** pole pozostanie puste (użytkownik musi wprowadzić nową wartość)

---

### Edge Cases

- Co jeśli użytkownik wprowadzi ujemną stopę zwrotu? → Dopuścić wartości od -20% do +30%
- Co jeśli wiek wypłat jest mniejszy niż aktualny wiek? → Błąd walidacji
- Co jeśli wiek aktualny < 18 lub > 100 lat? → Błąd walidacji, dozwolony zakres 18-100
- Co jeśli składka wynosi 0 zł? → Dopuścić, wynik = 0 zł kapitału
- Co jeśli stopa zwrotu = 0%? → Kapitał = suma wpłat (bez odsetek)
- Co jeśli okres wypłat = 0 lat? → Błąd walidacji, minimum 1 rok

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Kalkulator MUSI przyjmować aktualny wiek użytkownika (zakres 18-100 lat)
- **FR-002**: Kalkulator MUSI przyjmować składkę miesięczną LUB roczną (przełącznik)
- **FR-003**: Kalkulator MUSI przyjmować oczekiwaną roczną stopę zwrotu (zakres -20% do +30%)
- **FR-004**: Kalkulator MUSI przyjmować wiek rozpoczęcia wypłat (większy niż aktualny wiek, max 100 lat)
- **FR-005**: Kalkulator MUSI przyjmować okres wypłat w latach (zakres 1-50 lat, domyślnie 20 lat)
- **FR-014**: Kalkulator MUSI przyjmować opcjonalny kapitał początkowy (domyślnie 0 zł)
- **FR-006**: Kalkulator MUSI obliczać przewidywany kapitał metodą procentu składanego
- **FR-007**: Kalkulator MUSI obliczać oszczędność podatkową (19% od zysku kapitałowego)
- **FR-008**: Kalkulator MUSI obliczać średnią miesięczną emeryturę (kapitał / miesiące wypłat)
- **FR-009**: Kalkulator MUSI walidować dane wejściowe używając `validationRules`
- **FR-010**: Kalkulator MUSI używać klasy `BasicCalculator` jako bazowej
- **FR-011**: UI MUSI używać komponentów Quasar
- **FR-012**: Wszystkie teksty UI MUSZĄ być w języku polskim
- **FR-013**: Kalkulator MUSI wyświetlać ostrzeżenie gdy składka roczna przekracza limit IKE

### Calculation Requirements

- **CR-001**: Kapitał MUSI być obliczany według wzoru procentu składanego z wpłatami miesięcznymi na koniec miesiąca i kapitalizacją roczną
- **CR-002**: Wyniki MUSZĄ być zaokrąglane do 2 miejsc po przecinku (grosze)
- **CR-003**: Stopa zwrotu MUSI być traktowana jako roczna, z kapitalizacją roczną
- **CR-004**: Podatek Belki MUSI wynosić 19% od zysku (różnica kapitał - suma wpłat)
- **CR-005**: Testy MUSZĄ zawierać wszystkie wartości wynikowe

### Key Entities

- **IkeInput**: Dane wejściowe kalkulatora (wiek, składka, typ składki, stopa zwrotu, wiek wypłat, okres wypłat, kapitał początkowy)
- **IkeResult**: Wyniki obliczeń (kapitał, suma wpłat, zysk, oszczędność podatkowa, miesięczna emerytura)
- **IkeLimit**: Roczny limit wpłat na IKE (zależny od roku podatkowego)

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Użytkownik może wprowadzić wszystkie dane wejściowe w maksymalnie 6 polach formularza
- **SC-002**: Wyniki obliczeń są wyświetlane natychmiast po wprowadzeniu danych (bez przycisku "Oblicz")
- **SC-003**: Obliczenia kapitału są zgodne z wzorem matematycznym procentu składanego (weryfikowalne testem jednostkowym)
- **SC-004**: Wszystkie testy jednostkowe przechodzą poprawnie z oczekiwanymi wartościami
- **SC-005**: UI działa poprawnie na urządzeniach mobilnych i desktopowych
- **SC-006**: Walidacja informuje użytkownika o błędach w czasie rzeczywistym

## Assumptions

- Użytkownik wpłaca składki regularnie przez cały okres oszczędzania (brak przerw)
- Stopa zwrotu jest stała przez cały okres oszczędzania (uproszczenie)
- Kapitalizacja odsetek następuje raz w roku
- Użytkownik spełni warunki ustawowe do zwolnienia z podatku Belki (wiek emerytalny lub 5 lat wpłat)
- Okres wypłat nie uwzględnia dalszego oprocentowania kapitału (potwierdzone w klaryfikacji)
- Limity IKE będą pobierane z istniejącej logiki lub nowego pliku `ikeLimits.ts`

## Clarifications

### Session 2026-01-24

- Q: Kiedy następuje wpłata składki w okresie rozliczeniowym? → A: Wpłaty na koniec każdego miesiąca, kapitalizacja roczna (standard)
- Q: Czy użytkownik może wprowadzić istniejący kapitał IKE? → A: Tak, opcjonalne pole z domyślną wartością 0 zł
- Q: Czy pozostały kapitał w fazie wypłat generuje odsetki? → A: Nie, prosta kalkulacja (kapitał / miesiące)

## Dependencies

- Klasa `BasicCalculator` z `src/logic/BasicCalculator`
- Reguły walidacji z `validationRules`
- Komponenty Quasar UI
- Wzorzec struktury modułu z `components/contractWork`
