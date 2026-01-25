# Feature Specification: Ujednolicenie UI modułów

**Branch**: `[001-unify-module-ui]`  
**Created**: 2026-01-24  
**Status**: Draft  
**Input**: User description: "Moduły jak Samozatrudnienie, Umowa o Pracę mają zaktualizowany UI; zaktualizuj stare moduły (Faktura VAT, Limit sprzedaży dla zwolnienia z VAT, Lokata, Odsetki, Waluty), aby ujednolicić wygląd i zachowanie."

## User Scenarios *(required)*

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Spójny wygląd modułów (Priority: P1) 🎯 MVP

Użytkownik wchodzi do jednego ze „starych” modułów (Faktura VAT, Limit sprzedaży dla zwolnienia z VAT, Lokata, Odsetki, Waluty) i widzi ekran spójny wizualnie oraz behawioralnie z modułami posiadającymi już zaktualizowany UI (np. Samozatrudnienie, Umowa o Pracę).

**Priority Justification**: To jest główny cel feature’a (ujednolicenie wyglądu i zachowania), wpływa bezpośrednio na czytelność i łatwość użycia.

**Independent Test**: Otwórz każdy z pięciu modułów i porównaj układ oraz interakcje z referencyjnym modułem o zaktualizowanym UI, bez zmiany danych wejściowych i bez potrzeby testów integracyjnych z innymi modułami.

**Acceptance Criteria**:

1. **Given** użytkownik uruchamia moduł Faktura VAT, **When** ekran się ładuje, **Then** widzi ujednoliconą strukturę sekcji (nagłówek, formularz, wyniki) oraz spójny styl kontrolek i kart.
2. **Given** użytkownik uruchamia moduł Limit sprzedaży dla zwolnienia z VAT, **When** wprowadza wartości i przechodzi między polami, **Then** zachowanie formularza (walidacja, komunikaty, aktywacja/wyliczenie wyników) jest spójne z modułami referencyjnymi.
3. **Given** użytkownik uruchamia moduł Lokata na urządzeniu mobilnym, **When** przewija ekran, **Then** układ pozostaje czytelny (brak „rozjeżdżania” elementów), a wyniki są łatwe do odczytania.

**Calculation Example**:
```
Input data:
- moduł: Faktura VAT
- kontekst: użytkownik otwiera ekran i uzupełnia pola

Expected results:
- spójny układ sekcji (formularz i wyniki) oraz spójne komponenty wejściowe
- spójny sposób prezentacji wyników (karty/sekcje wyników w tym samym „stylu” co w modułach referencyjnych)
```

---

### Scenario 2 - Brak zmian w wynikach (Priority: P2)

Użytkownik korzysta z tych samych danych wejściowych co wcześniej i otrzymuje te same wyniki obliczeń; zmiana dotyczy wyłącznie warstwy prezentacji i ergonomii formularza/wyników.

**Priority Justification**: Ujednolicenie UI nie może wprowadzić regresji merytorycznej (wyników i logiki), bo to uderza w zaufanie do aplikacji.

**Acceptance Criteria**:

1. **Given** użytkownik wprowadza wartości w module, **When** otrzymuje wyniki, **Then** wartości wyników są zgodne z dotychczasowym działaniem modułu dla tych samych danych.
2. **Given** użytkownik wprowadza niepoprawne dane, **When** formularz waliduje pola, **Then** użytkownik dostaje czytelne komunikaty po polsku i w spójnym stylu jak w modułach referencyjnych.

---

### Edge Cases

- Co jeśli użytkownik ma bardzo mały ekran (np. wąski telefon) i wyniki są długie (dużo cyfr)?
- Co jeśli użytkownik wpisze wartości ujemne / niezgodne z oczekiwaniami (walidacja i komunikat muszą być spójne)?
- Co jeśli użytkownik przełącza się pomiędzy polami i modułami (stan formularza i wyników nie powinien wprowadzać w błąd)?
- Co jeśli pola mają wartości graniczne/duże liczby (UI nie powinno się „rozsypać”)?

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Aplikacja MUST ujednolicić układ ekranu (sekcje, hierarchię informacji) w modułach: Faktura VAT, Limit sprzedaży dla zwolnienia z VAT, Lokata, Odsetki, Waluty, tak aby były spójne z modułami o zaktualizowanym UI.
- **FR-002**: Aplikacja MUST zapewnić spójne i intuicyjne zachowanie formularza w tych modułach (walidacja, prezentacja błędów, czytelność pól, spójne etykiety i opisy).
- **FR-003**: Aplikacja MUST prezentować wyniki w spójnym formacie (czytelne sekcje/karty, podobny sposób podsumowania) we wszystkich wskazanych modułach.
- **FR-004**: Aplikacja MUST utrzymać dotychczasową logikę obliczeń (feature nie zmienia reguł merytorycznych).
- **FR-005**: Aplikacja MUST stosować spójne zasady walidacji i komunikatów dla danych wejściowych, zgodne z modułami referencyjnymi.
- **FR-006**: Wszystkie teksty UI MUST pozostać w języku polskim.

### Calculation Requirements

- **CR-001**: Dla tych samych danych wejściowych wyniki obliczeń MUST pozostać takie same jak przed zmianami UI.
- **CR-002**: Jeśli moduł posiada zaokrąglenia/prezentację kwot, sposób zaokrąglania i format wartości MUST pozostać zgodny z dotychczasowym działaniem.
- **CR-003**: Jeśli konieczne będą zmiany w testach, testy MUST zawierać wszystkie wartości wyjściowe.

### Key Entities

- **Ekran modułu**: Pojedynczy widok kalkulatora/modułu (nagłówek, formularz, wyniki).
- **Sekcja formularza**: Zgrupowane pola wejściowe wraz z walidacją i opisami.
- **Panel wyników**: Prezentacja rezultatów obliczeń i podsumowań (w tym formatowanie/liczby).
- **Stan walidacji**: Informacja o poprawności danych i komunikatach błędów/ostrzeżeń.

### Scope

- **W zakresie**: Ujednolicenie układu, stylu i zachowań UI (formularz, walidacja, prezentacja wyników) w modułach: Faktura VAT, Limit sprzedaży dla zwolnienia z VAT, Lokata, Odsetki, Waluty.
- **Poza zakresem**: Zmiana reguł obliczeń, dodawanie nowych funkcji biznesowych, dodawanie nowych pól wymagających zmian merytorycznych.

### Assumptions & Dependencies

- **Założenie**: Istnieją moduły referencyjne ze „zaktualizowanym UI”, które stanowią wzorzec spójnego wyglądu i zachowania.
- **Zależność**: Ujednolicenie nie powinno wymagać zmian w danych wejściowych ani w wynikach obliczeń (brak regresji merytorycznej).

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Każdy z 5 modułów ma spójną strukturę ekranu (nagłówek, sekcja danych wejściowych, sekcja wyników) i spójny sposób prezentacji informacji z modułami referencyjnymi.
- **SC-002**: Brak regresji merytorycznej: wyniki obliczeń dla tych samych danych wejściowych są zgodne z dotychczasowym działaniem.
- **SC-003**: Walidacja i komunikaty błędów są czytelne, spójne wizualnie oraz w języku polskim.
- **SC-004**: Ekrany działają poprawnie na mobile i desktop (czytelność, brak psucia layoutu przy długich liczbach/tekstach).
- **SC-005**: Wszystkie testy jednostkowe związane z tymi modułami przechodzą.
