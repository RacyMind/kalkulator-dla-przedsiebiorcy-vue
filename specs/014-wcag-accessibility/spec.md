# Feature Specification: Accessibility (WCAG AA)

**Branch**: `014-wcag-accessibility`  
**Created**: 2026-02-07  
**Status**: Draft  
**Input**: User description: "Milestone 5 — Accessibility WCAG AA: Doprowadzić aplikację do zgodności z WCAG 2.1 na poziomie AA. Semantyczny HTML, nawigacja klawiaturą, atrybuty ARIA, weryfikacja kontrastu kolorów, formularze dostępne."

## User Scenarios *(required)*

### Scenario 1 — Nawigacja klawiaturą przez formularz kalkulatora (Priority: P1) 🎯 MVP

Użytkownik z niepełnosprawnością ruchową korzysta wyłącznie z klawiatury. Otwiera aplikację, przechodzi do wybranego modułu kalkulatora, wypełnia formularz, uruchamia obliczenia i odczytuje wyniki — bez użycia myszy.

**Priority Justification**: Nawigacja klawiaturą jest fundamentem dostępności — bez niej pozostałe usprawnienia (ARIA, semantyka) nie mają praktycznego znaczenia.

**Independent Test**: Otworzyć dowolny moduł kalkulatora (np. Umowa o pracę). Używając wyłącznie klawisza Tab, Shift+Tab, Enter i Escape, przejść przez cały formularz, uruchomić obliczenia i odczytać wyniki.

**Acceptance Criteria**:

1. **Given** strona główna jest załadowana, **When** użytkownik naciśnie Tab, **Then** focus przenosi się na link "Przejdź do treści" (skip-to-content), a po Enter — na główną treść strony
2. **Given** użytkownik jest w module kalkulatora, **When** nawiguje Tabem przez formularz, **Then** focus przechodzi przez pola w logicznej kolejności (od góry do dołu, od lewej do prawej)
3. **Given** focus jest na przycisku "Oblicz", **When** użytkownik naciśnie Enter, **Then** obliczenia się wykonują i focus przenosi się do sekcji wyników
4. **Given** drawer menu jest otwarty, **When** użytkownik naciśnie Escape, **Then** drawer się zamyka i focus wraca do elementu, który go otworzył
5. **Given** dowolny interaktywny element ma focus, **When** użytkownik patrzy na ekran, **Then** widoczny jest wyraźny focus ring (`:focus-visible`)

---

### Scenario 2 — Odczytywanie wyników przez czytnik ekranowy (Priority: P1) 🎯 MVP

Użytkownik niewidomy korzysta z czytnika ekranowego (NVDA/VoiceOver). Po wykonaniu obliczeń czytnik poprawnie odczytuje strukturę strony, nagłówki, etykiety pól, wyniki i komunikaty walidacji.

**Priority Justification**: Czytniki ekranowe polegają na semantycznym HTML i atrybutach ARIA — bez nich aplikacja jest nieużywalna dla osób niewidomych.

**Independent Test**: Włączyć NVDA (Windows) lub VoiceOver (macOS). Otworzyć moduł kalkulatora. Zweryfikować, że czytnik poprawnie ogłasza: landmarks (nawigacja, treść główna), nagłówki sekcji, etykiety pól formularza, komunikaty błędów walidacji, wyniki obliczeń.

**Acceptance Criteria**:

1. **Given** strona jest załadowana, **When** czytnik ekranowy skanuje landmarks, **Then** rozpoznaje `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
2. **Given** użytkownik jest w formularzu, **When** czytnik odczytuje pole, **Then** ogłasza etykietę pola (label), czy jest wymagane (`aria-required`), oraz ewentualny komunikat błędu (`aria-describedby`)
3. **Given** sekcja formularza jest zwinięta, **When** czytnik odczytuje przycisk toggle, **Then** ogłasza stan `aria-expanded="false"` i nazwę sekcji
4. **Given** obliczenia zostały wykonane, **When** wyniki pojawiają się na ekranie, **Then** czytnik ogłasza aktualizację dzięki `aria-live="polite"` na kontenerze wyników
5. **Given** pojawia się powiadomienie (np. próg podatkowy), **When** czytnik je napotka, **Then** ogłasza je dzięki `role="status"`

---

### Scenario 3 — Czytelność interfejsu dla osób słabowidzących (Priority: P2)

Użytkownik słabowidzący korzysta z aplikacji w trybie jasnym i ciemnym. Wszystkie teksty, ikony i interaktywne elementy mają wystarczający kontrast kolorystyczny.

**Priority Justification**: Kontrast WCAG AA jest wymogiem prawnym w wielu jurysdykcjach i wpływa na dużą grupę użytkowników (osoby starsze, słabowidzące).

**Independent Test**: Uruchomić automatyczny audyt axe-core / Lighthouse Accessibility na stronie głównej i 3 wybranych modułach kalkulatora, w trybie jasnym i ciemnym. Zweryfikować brak błędów kontrastowych.

**Acceptance Criteria**:

1. **Given** aplikacja w trybie jasnym, **When** uruchomiony jest audyt Lighthouse Accessibility, **Then** wynik wynosi ≥ 90 punktów
2. **Given** aplikacja w trybie ciemnym, **When** uruchomiony jest audyt axe-core, **Then** nie ma błędów kontrastowych (WCAG AA: 4.5:1 dla tekstu, 3:1 dla dużego tekstu i elementów UI)
3. **Given** SectionHeader z białym tekstem na kolorowym tle, **When** zmierzony jest kontrast, **Then** spełnia minimum 4.5:1

---

### Scenario 4 — Dostępne formularze z walidacją (Priority: P2)

Użytkownik korzystający z technologii asystujących wypełnia formularz kalkulatora. Pola mają poprawne etykiety, wymagane pola są oznaczone, a komunikaty walidacji są powiązane z odpowiednimi polami.

**Priority Justification**: Formularze to główny punkt interakcji w aplikacji — ich dostępność bezpośrednio wpływa na użyteczność.

**Acceptance Criteria**:

1. **Given** formularz kalkulatora, **When** czytnik ekranowy odczytuje pole, **Then** każde `q-input` ma widoczny `label` (nie tylko placeholder)
2. **Given** pole jest wymagane, **When** czytnik je odczytuje, **Then** ogłasza, że pole jest wymagane (`aria-required="true"`)
3. **Given** pole ma błąd walidacji, **When** czytnik odczytuje pole, **Then** ogłasza komunikat błędu powiązany przez `aria-describedby`
4. **Given** formularz z polami adresowymi lub kwotowymi, **When** przeglądarka oferuje autouzupełnianie, **Then** odpowiednie atrybuty `autocomplete` są ustawione

---

### Edge Cases

- Jak zachowuje się skip-to-content link gdy strona nie ma sekcji wyników (np. strona główna)?
- Jak obsługiwane są dynamicznie ładowane moduły (lazy loading) — czy focus nie jest tracony?
- Jak zachowują się wykresy (Chart.js canvas) dla czytników ekranowych — czy mają alternatywny tekst?
- Jak obsługiwane jest przełączanie motywu (light/dark) — czy czytnik ogłasza zmianę?

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Aplikacja MUSI zawierać link "Przejdź do treści" (skip-to-content) jako pierwszy element focusowalny na stronie
- **FR-002**: Wszystkie strony MUSZĄ używać semantycznych landmarks HTML5: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- **FR-003**: `SectionHeader.vue` MUSI renderować semantyczne nagłówki (`<h2>`, `<h3>`) z odpowiednią hierarchią — obecna implementacja z prop `level` jest poprawna i wymaga jedynie weryfikacji użycia w modułach
- **FR-004**: `ListRow.vue` MUSI używać semantycznej struktury listy wyników — `<q-list>` z odpowiednimi `role` atrybutami lub `<dl>` (definition list)
- **FR-005**: Menu nawigacyjne MUSI być opakowane w element `<nav>` z `aria-label`
- **FR-006**: `FormSection.vue` MUSI mieć `aria-expanded` na przycisku toggle oraz `aria-label` opisujący sekcję
- **FR-007**: Sekcja wyników MUSI mieć `aria-live="polite"` aby czytniki ekranowe ogłaszały aktualizacje po obliczeniach
- **FR-008**: Wszystkie przyciski z ikonami (hamburger, toggle theme, expand/collapse, scroll-to-top) MUSZĄ mieć `aria-label`
- **FR-009**: Powiadomienia (np. próg podatkowy, Quasar Notify) MUSZĄ mieć `role="status"`
- **FR-010**: Wszystkie interaktywne elementy MUSZĄ mieć widoczny focus ring (`:focus-visible`) z wystarczającym kontrastem
- **FR-011**: Tab order we wszystkich formularzach MUSI być logiczny i sekwencyjny
- **FR-012**: Drawer menu MUSI być zamykany klawiszem Escape, z przywróceniem focusu do elementu wywołującego
- **FR-013**: Każde pole `q-input` MUSI mieć widoczny `label` (nie tylko placeholder jako etykietę)
- **FR-014**: Wymagane pola formularzy MUSZĄ mieć `aria-required="true"`
- **FR-015**: Komunikaty walidacji MUSZĄ być powiązane z polami przez `aria-describedby`
- **FR-016**: Wykresy (canvas Chart.js) MUSZĄ mieć alternatywny tekst opisujący dane (`aria-label` lub `<figcaption>`)
- **FR-017**: Wszystkie teksty UI MUSZĄ być w języku polskim
- **FR-018**: UI MUSI używać komponentów Quasar

### Accessibility Requirements (WCAG 2.1 AA)

- **AR-001**: Kontrast tekstu normalnego do tła MUSI wynosić minimum 4.5:1 (WCAG 1.4.3)
- **AR-002**: Kontrast dużego tekstu (≥18pt lub ≥14pt bold) do tła MUSI wynosić minimum 3:1 (WCAG 1.4.3)
- **AR-003**: Kontrast elementów UI i grafik informacyjnych MUSI wynosić minimum 3:1 (WCAG 1.4.11)
- **AR-004**: Strona MUSI być w pełni operowalna klawiaturą bez pułapek focusu (WCAG 2.1.1, 2.1.2)
- **AR-005**: Hierarchia nagłówków MUSI być logiczna i sekwencyjna — brak przeskoków poziomów (WCAG 1.3.1)
- **AR-006**: Atrybut `lang="pl"` MUSI być ustawiony na elemencie `<html>` (WCAG 3.1.1)
- **AR-007**: Lighthouse Accessibility score MUSI wynosić ≥ 90 w trybie jasnym i ciemnym

### Key Entities

- **Landmark**: Semantyczny region strony (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) identyfikowany przez technologie asystujące
- **Focus ring**: Wizualny wskaźnik focusu na interaktywnym elemencie, widoczny przy nawigacji klawiaturą
- **ARIA attribute**: Atrybut HTML rozszerzający semantykę elementu dla technologii asystujących (np. `aria-label`, `aria-expanded`, `aria-live`)
- **Skip-to-content link**: Ukryty link na początku strony, widoczny po Tab, umożliwiający pominięcie nawigacji
- **Design token**: Zmienna CSS definiująca kolor, spacing lub typografię — źródło prawdy dla kontrastu

## Assumptions

- Paleta kolorów z `_design-tokens.scss` (Milestone 2.6) została zaprojektowana z uwzględnieniem WCAG AA — ten milestone weryfikuje i ewentualnie koryguje, ale nie projektuje palety od nowa
- Quasar components (`q-input`, `q-btn`, `q-expansion-item`) mają wbudowane podstawowe wsparcie dla dostępności — ten milestone uzupełnia brakujące atrybuty
- Czytnik ekranowy do testów: NVDA (Windows) — jest darmowy i najczęściej używany
- Wykresy Chart.js (canvas) nie są natywnie dostępne — wystarczy alternatywny tekst opisujący dane, bez pełnej tabelarycznej alternatywy

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Lighthouse Accessibility score ≥ 90 na stronie głównej i 3 wybranych modułach (tryb jasny i ciemny)
- **SC-002**: Audyt axe-core zwraca 0 krytycznych i poważnych błędów (critical + serious) na wszystkich stronach
- **SC-003**: Użytkownik może przejść przez cały flow kalkulatora (otwarcie → formularz → obliczenie → wyniki) używając wyłącznie klawiatury
- **SC-004**: Wszystkie interaktywne elementy mają widoczny focus ring przy nawigacji klawiaturą
- **SC-005**: Czytnik ekranowy (NVDA) poprawnie ogłasza: landmarks, nagłówki, etykiety pól, stany expanded/collapsed, wyniki obliczeń, komunikaty walidacji
- **SC-006**: Brak przeskoków w hierarchii nagłówków (h1 → h2 → h3, bez pomijania poziomów)
- **SC-007**: Wszystkie istniejące testy jednostkowe (410+) przechodzą bez regresji
