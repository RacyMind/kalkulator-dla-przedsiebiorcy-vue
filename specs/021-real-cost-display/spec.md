# Feature Specification: Rzeczywisty koszt zakupu — wyświetlanie kosztu rzeczywistego

**Branch**: `021-real-cost-display`  
**Created**: 2026-02-10  
**Status**: Draft  
**Input**: User description: "W module rzeczywisty koszt zakupu, podaje obliczenia, składowe, ale nie ma tego rzeczywistego kosztu zakupu, trzeba liczyć samemu (bo pokazuje zaoszczędzoną kwotę, a interesuje mnie tytułowy rzeczywisty koszt zakupu)"

## User Scenarios _(required)_

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Wyświetlenie rzeczywistego kosztu zakupu (Priority: P1) 🎯 MVP

Użytkownik wchodzi do modułu "Rzeczywisty koszt zakupu", wypełnia formularz (cena brutto, stawka VAT, odliczenia) i po kliknięciu "Oblicz" widzi w wynikach nową, wyróżnioną pozycję "Rzeczywisty koszt zakupu" obliczoną jako: cena brutto minus zaoszczędzona kwota.

**Priority Justification**: Jest to główna wartość modułu — użytkownik przychodzi po tę informację, a obecnie jej brakuje.

**Independent Test**: Uruchomić kalkulator z danymi wejściowymi i zweryfikować, że wynik "Rzeczywisty koszt zakupu" = cena - zaoszczędzona kwota.

**Acceptance Criteria**:

1. **Given** użytkownik wypełnił formularz z ceną brutto 123 zł, VAT 23%, pełne odliczenie VAT, podatek dochodowy 12%, **When** kliknie "Oblicz", **Then** w wynikach widzi pozycję "Rzeczywisty koszt zakupu" z wartością 79,00 zł
2. **Given** użytkownik wypełnił formularz, **When** wyniki się wyświetlą, **Then** pozycja "Rzeczywisty koszt zakupu" jest wyróżniona wizualnie (highlight) jako główny wynik
3. **Given** użytkownik wypełnił formularz, **When** wyniki się wyświetlą, **Then** dotychczasowe pozycje (cena, VAT, odliczenia, zaoszczędzona kwota) nadal są widoczne

**Calculation Example**:

```
Input data:
- Cena brutto: 123 zł
- Stawka VAT: 23%
- Odliczanie VAT: 100%
- Podatek dochodowy: 12%

Expected results:
- Cena: 123,00 zł
- Podatek VAT: 23,00 zł
- Podatek VAT do odliczenia: 23,00 zł
- Podatek dochodowy do odliczenia: 12,00 zł
- Składka zdrowotna: 9,00 zł
- Zaoszczędzona kwota: 44,00 zł
- Rzeczywisty koszt zakupu: 79,00 zł  ← NOWA POZYCJA
```

---

### Scenario 2 - Rzeczywisty koszt bez odliczeń VAT (Priority: P1) 🎯 MVP

Użytkownik nie odlicza VAT, ale odlicza podatek dochodowy 32%. Rzeczywisty koszt zakupu = cena - zaoszczędzona kwota.

**Priority Justification**: Wariant bez odliczenia VAT jest częsty — weryfikuje poprawność obliczeń w innej konfiguracji.

**Acceptance Criteria**:

1. **Given** cena brutto 123 zł, VAT 23%, brak odliczenia VAT, podatek dochodowy 32%, **When** obliczenie, **Then** rzeczywisty koszt zakupu = 82,00 zł

**Calculation Example**:

```
Input data:
- Cena brutto: 123 zł
- Stawka VAT: 23%
- Odliczanie VAT: 0%
- Podatek dochodowy: 32%

Expected results:
- Cena: 123,00 zł
- Podatek VAT: 23,00 zł
- Podatek VAT do odliczenia: 0,00 zł
- Podatek dochodowy do odliczenia: 32,00 zł
- Składka zdrowotna: 9,00 zł
- Zaoszczędzona kwota: 41,00 zł
- Rzeczywisty koszt zakupu: 82,00 zł
```

---

### Scenario 3 - Rzeczywisty koszt bez żadnych odliczeń (Priority: P2)

Użytkownik nie odlicza ani VAT, ani podatku dochodowego. Rzeczywisty koszt zakupu = cena brutto (zaoszczędzona kwota = 0).

**Priority Justification**: Przypadek brzegowy — brak odliczeń.

**Acceptance Criteria**:

1. **Given** cena brutto 123 zł, VAT 23%, brak odliczenia VAT, brak odliczenia podatku dochodowego, **When** obliczenie, **Then** rzeczywisty koszt zakupu = 123,00 zł, zaoszczędzona kwota = 0,00 zł

---

### Edge Cases

- Gdy zaoszczędzona kwota = 0, rzeczywisty koszt zakupu = cena brutto
- Gdy cena brutto = 0, rzeczywisty koszt zakupu = 0
- Zmiana roku podatkowego (lawRuleDate) wpływa na stawki składki zdrowotnej, ale formuła rzeczywistego kosztu pozostaje taka sama: cena - zaoszczędzona kwota

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Kalkulator MUSI obliczać rzeczywisty koszt zakupu jako: cena brutto minus zaoszczędzona kwota
- **FR-002**: Wynik "Rzeczywisty koszt zakupu" MUSI być wyświetlany w liście wyników jako wyróżniona (highlight) pozycja
- **FR-003**: Pozycja "Rzeczywisty koszt zakupu" MUSI być wyświetlana jako ostatnia pozycja na liście wyników
- **FR-004**: Dotychczasowa pozycja "Zaoszczędzona kwota" MUSI pozostać widoczna, ale nie powinna być już wyróżniona (highlight przeniesiony na nową pozycję)
- **FR-005**: Kalkulator MUSI używać klasy `BasicCalculator` jako bazy
- **FR-006**: UI MUSI używać komponentów Quasar
- **FR-007**: Tekst w UI MUSI być w języku polskim

### Calculation Requirements

- **CR-001**: Obliczenia MUSZĄ używać aktualnych stawek z `constantsStore`
- **CR-002**: Wyniki MUSZĄ być zaokrąglone do 2 miejsc po przecinku (grosze)
- **CR-003**: Testy MUSZĄ zawierać wszystkie wartości wyjściowe, w tym nowe pole `realCost`

### Key Entities

- **Result**: Obiekt wyniku kalkulatora — rozszerzony o pole `realCost` (rzeczywisty koszt zakupu = price - savedAmount)
- **InputFields**: Dane wejściowe formularza — bez zmian (price, vatTaxRate, deductedVatTaxPart, incomeTaxRate)

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: Użytkownik widzi "Rzeczywisty koszt zakupu" w wynikach bez konieczności samodzielnego liczenia
- **SC-002**: Wynik jest poprawny: realCost = price - savedAmount dla wszystkich kombinacji odliczeń
- **SC-003**: Wszystkie testy jednostkowe przechodzą z poprawnymi wartościami, w tym nowe pole `realCost`
- **SC-004**: UI działa poprawnie na urządzeniach mobilnych i desktopowych
