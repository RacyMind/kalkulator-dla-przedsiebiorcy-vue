# Feature Specification: Ujednolicenie UI formularzy (pola + przyciski)
**Branch**: `[002-unify-module-ui]`  
**Created**: 2026-01-24  
**Status**: Draft  
**Input**: User description: "Ujednolicenie UI modułów: pola formularzy i przyciski + Kontakt, Historia zmian, Limit obrotu dla kasy fiskalnej"

## User Scenarios *(required)*

### Scenario 1 - Spójne pola formularzy i przyciski w modułach (Priority: P1) 🎯 MVP

Użytkownik wchodzi na różne moduły aplikacji i widzi spójny wygląd pól formularzy oraz przycisków akcji: podobne odstępy, spójne walidacje, przewidywalne stany (disabled/loading) i spójny układ na mobile/desktop.

**Priority Justification**: Po ujednoliceniu wrappera stron (layout), największą różnicą pomiędzy „nowymi” i „starymi” modułami pozostają pola formularzy i przyciski — to bezpośrednio wpływa na odczucie jakości i spójności całej aplikacji.

**Independent Test**:

1. Otwórz kolejno strony modułów:
   - `src/pages/Invoice.vue`
   - `src/pages/VatLimit.vue`
   - `src/pages/Investment.vue`
   - `src/pages/Interest.vue`
   - `src/pages/ExchangeRates.vue`
   - `src/pages/Currency.vue`
   - `src/pages/CurrencyConverter.vue`
   - `src/pages/CashRegisterLimit.vue`
   - `src/pages/Contact.vue`
   - `src/pages/ChangeLogs.vue`
2. Zweryfikuj, że w miejscach interakcji:
   - Pola formularzy mają spójny układ (mobile: 1 kolumna, desktop: 2 kolumny tam gdzie ma sens) i spójne odstępy.
   - Walidacja wygląda spójnie (wymagalność, komunikaty, zachowanie po próbie akcji).
   - Przyciski akcji mają spójny styl (kolor, rozmiar, wyrównanie/szerokość, stan disabled/loading).

**Acceptance Criteria**:

1. **Given** użytkownik jest na module z formularzem, **When** widzi pola wejściowe, **Then** pola są spójne wizualnie i mają przewidywalne zachowanie walidacji.
2. **Given** użytkownik nie uzupełnił wymaganych pól, **When** próbuje wykonać akcję (oblicz/wyślij), **Then** widzi spójne sygnały błędów i akcja nie powinna się wykonać.
3. **Given** użytkownik uzupełnił wymagane pola, **When** wykona akcję, **Then** wynik/reakcja jest prezentowana jak dotychczas (bez zmiany logiki obliczeń).

**Calculation Example**:
```
Input data:
- Moduł: Limit obrotu dla kasy fiskalnej
- Data rozpoczęcia sprzedaży: 01.01.2026

Expected results:
- Wyniki obliczeń pozostają zgodne z aktualną logiką (bez zmian)
- UI: pole daty i przycisk "Oblicz" są spójne z innymi modułami
```

---

### Scenario 2 - Kontakt: spójne pola i stany wysyłki (Priority: P2)

Użytkownik wypełnia formularz kontaktowy i wysyła wiadomość. Pola formularza oraz przycisk „Wyślij” mają spójny wygląd, a stany walidacji/wysyłki są czytelne.

**Priority Justification**: To często używana funkcja, a jej UI jest widoczne „poza kalkulatorami” — niespójność jest szczególnie zauważalna.

**Acceptance Criteria**:

1. **Given** użytkownik jest na `src/pages/Contact.vue`, **When** formularz jest niekompletny, **Then** nie da się wysłać wiadomości i walidacja jasno wskazuje wymagane pola.
2. **Given** użytkownik wysyła wiadomość, **When** trwa wysyłka, **Then** przycisk pokazuje stan ładowania i nie da się wysłać ponownie.

---

### Scenario 3 - Historia zmian: spójny przycisk akcji (Priority: P2)

Użytkownik przegląda historię zmian i używa przycisku „Pokaż wszystko”. Przycisk jest spójny wizualnie z innymi akcjami w aplikacji.

**Priority Justification**: Moduł bez obliczeń nadal ma akcję użytkownika — spójność przycisku buduje spójność całego UI.

**Acceptance Criteria**:

1. **Given** użytkownik jest na `src/pages/ChangeLogs.vue`, **When** widzi „Pokaż wszystko”, **Then** przycisk jest spójny stylem z resztą aplikacji.
2. **Given** użytkownik kliknie „Pokaż wszystko”, **When** lista się rozszerzy, **Then** układ pozostaje czytelny.

---

### Edge Cases

- Użytkownik wpisuje niepoprawny format daty w modułach z datą (VAT limit / kasa fiskalna).
- Użytkownik próbuje wysłać formularz Kontakt bez wymaganych pól.
- Użytkownik klika „Wyślij” wielokrotnie w trakcie wysyłki.
- Bardzo mały ekran: pola i przyciski muszą pozostać czytelne.

## Requirements *(required)*

### Functional Requirements

- **FR-001**: UI MUST ujednolicić wygląd i zachowanie pól formularzy w modułach objętych zakresem (układ, odstępy, walidacja, stany).
- **FR-002**: UI MUST ujednolicić wygląd i zachowanie przycisków akcji (kolor, rozmiar, szerokość, disabled/loading) w modułach objętych zakresem.
- **FR-003**: Tam gdzie istnieją wspólne reguły walidacji, moduły MUST korzystać ze wspólnych zasad walidacji.
- **FR-004**: UI MUST używać istniejących komponentów i wzorców UI aplikacji (bez wprowadzania nowych bibliotek).
- **FR-005**: Wszystkie teksty UI MUST pozostać w języku polskim.
- **FR-006**: Zakres MUST obejmować moduły:
  - Faktura VAT (`src/pages/Invoice.vue` + `src/components/invoice/*`)
  - Limit sprzedaży dla zwolnienia z VAT (`src/pages/VatLimit.vue` + `src/components/vatLimit/*`)
  - Lokata (`src/pages/Investment.vue` + `src/components/investment/*`)
  - Odsetki (`src/pages/Interest.vue` + `src/components/interest/*`)
  - Waluty (`src/pages/ExchangeRates.vue`, `src/pages/Currency.vue`, `src/pages/CurrencyConverter.vue`)
  - Limit obrotu dla kasy fiskalnej (`src/pages/CashRegisterLimit.vue` + `src/components/cashRegisterLimit/*`)
  - Kontakt (`src/pages/Contact.vue` + `src/components/contact/*`)
  - Historia zmian (`src/pages/ChangeLogs.vue` + `src/components/changeLogs/*`)

### Calculation Requirements

- **CR-001**: Refaktor UI MUST NOT zmieniać wyników obliczeń w żadnym module.
- **CR-002**: Refaktor UI MUST NOT zmieniać istniejących reguł biznesowych.
- **CR-003**: Wszystkie istniejące testy jednostkowe logiki MUST przechodzić bez zmian.

### Key Entities

- **Pole formularza**: Element wejściowy użytkownika (np. data, kwota, email) z etykietą, walidacją i spójnym layoutem.
- **Przycisk akcji**: Element uruchamiający obliczenie/wysłanie/rozszerzenie listy, ze spójnymi stanami (disabled/loading).
- **Moduł**: Strona aplikacji zawierająca formularz i/lub akcję użytkownika oraz prezentację wyniku/treści.

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Użytkownik widzi spójny układ pól i przycisków na wszystkich stronach z listy w Scenario 1.
- **SC-002**: Brak regresji: wszystkie testy jednostkowe logiki modułów przechodzą.
- **SC-003**: UI jest czytelne na mobile i desktop (brak problemów z układem pól i przycisków).
- **SC-004**: Formularz kontaktowy ma czytelne stany: walidacja + blokada i widoczny stan wysyłki.
