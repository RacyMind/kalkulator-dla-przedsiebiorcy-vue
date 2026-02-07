# Feature Specification: Finalizacja i testy (Milestone 6)

**Branch**: `015-finalization-tests`  
**Created**: 2026-02-07  
**Status**: Draft  
**Input**: User description: "Milestone 6 - Finalizacja i testy: regression tests, performance optimization, Capacitor Android build, final cleanup and release preparation for v6.0.0. Manual tests of each module already completed."

## User Scenarios *(required)*

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Testy regresyjne wszystkich modułów (Priority: P1) 🎯 MVP

Deweloper uruchamia pełny zestaw testów jednostkowych (`npx vitest run`) i weryfikuje, że wszystkie testy przechodzą pomyślnie po zmianach wprowadzonych w Milestone 1–5. Ręczna weryfikacja każdego z 29 modułów została już wykonana — ten scenariusz dotyczy automatycznych testów regresyjnych.

**Priority Justification**: Testy regresyjne są fundamentem stabilności przed release — muszą przejść zanim cokolwiek innego.

**Independent Test**: Uruchomić `npx vitest run` i zweryfikować, że exit code = 0 oraz wszystkie testy przechodzą.

**Acceptance Criteria**:

1. **Given** kompletna baza kodu po Milestone 1–5, **When** deweloper uruchomi `npx vitest run`, **Then** wszystkie istniejące testy jednostkowe przechodzą pomyślnie (exit code 0)
2. **Given** lista 29 modułów kalkulatora, **When** deweloper zweryfikuje pokrycie testami, **Then** każdy moduł z logiką obliczeniową ma co najmniej jeden test jednostkowy
3. **Given** ręczna weryfikacja modułów została wykonana, **When** deweloper porówna wyniki ręczne z automatycznymi, **Then** nie ma rozbieżności między oczekiwanymi a faktycznymi wynikami

---

### Scenario 2 - Weryfikacja dark mode we wszystkich modułach (Priority: P1) 🎯 MVP

Deweloper przegląda każdy moduł w trybie ciemnym i jasnym, upewniając się, że nie ma problemów wizualnych (nieczytelny tekst, brakujące tło, złe kolory).

**Priority Justification**: Dark mode jest kluczową funkcją v6.0 — musi działać poprawnie we wszystkich modułach.

**Acceptance Criteria**:

1. **Given** aplikacja uruchomiona w trybie ciemnym, **When** użytkownik przejdzie przez każdy moduł, **Then** wszystkie elementy UI są czytelne i poprawnie ostylowane
2. **Given** aplikacja uruchomiona w trybie jasnym, **When** użytkownik przejdzie przez każdy moduł, **Then** nie ma regresji wizualnych po zmianach dark mode

---

### Scenario 3 - Weryfikacja responsywności (Priority: P1) 🎯 MVP

Deweloper testuje aplikację na kluczowych breakpointach: 320px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop), 2560px (4K).

**Priority Justification**: Aplikacja jest używana głównie na urządzeniach mobilnych — responsywność jest krytyczna.

**Acceptance Criteria**:

1. **Given** aplikacja otwarta na szerokości 320px, **When** użytkownik korzysta z dowolnego modułu, **Then** formularze i wyniki są w pełni użyteczne bez poziomego scrollowania
2. **Given** aplikacja otwarta na szerokości 768px, **When** użytkownik korzysta z menu i modułów, **Then** layout dostosowuje się poprawnie do rozmiaru tabletu
3. **Given** aplikacja otwarta na szerokości 1440px lub 2560px, **When** użytkownik korzysta z aplikacji, **Then** treść nie jest rozciągnięta ponad czytelną szerokość i layout jest estetyczny

---

### Scenario 4 - Optymalizacja wydajności (Priority: P2)

Deweloper uruchamia Lighthouse audit na wersji produkcyjnej (`quasar build -m pwa`) i optymalizuje wyniki do docelowych progów.

**Priority Justification**: Wydajność wpływa na UX, ale nie blokuje funkcjonalności.

**Acceptance Criteria**:

1. **Given** zbudowana wersja produkcyjna PWA, **When** deweloper uruchomi Lighthouse audit, **Then** wynik Performance > 90
2. **Given** zbudowana wersja produkcyjna PWA, **When** deweloper uruchomi Lighthouse audit, **Then** wynik Accessibility > 90
3. **Given** konfiguracja routera, **When** deweloper sprawdzi importy modułów, **Then** wszystkie moduły używają dynamicznych importów (lazy loading)
4. **Given** konfiguracja Service Worker, **When** deweloper sprawdzi strategię cachowania, **Then** strategia jest poprawna i aktualizacje są dostarczane użytkownikom

---

### Scenario 5 - Build i testy Capacitor Android (Priority: P2)

Deweloper buduje wersję Android (`quasar build -m capacitor -T android`), testuje na emulatorze i weryfikuje kluczowe funkcje.

**Priority Justification**: Wersja Android jest ważnym kanałem dystrybucji, ale nie blokuje release PWA.

**Acceptance Criteria**:

1. **Given** projekt skonfigurowany z Capacitor, **When** deweloper uruchomi `quasar build -m capacitor -T android`, **Then** build kończy się sukcesem bez błędów
2. **Given** zbudowana aplikacja Android, **When** deweloper uruchomi ją na emulatorze, **Then** dark mode działa poprawnie
3. **Given** zbudowana aplikacja Android, **When** deweloper przetestuje AdMob, **Then** reklamy wyświetlają się poprawnie
4. **Given** zbudowana aplikacja Android, **When** deweloper przetestuje nawigację, **Then** layout i nawigacja działają na różnych rozmiarach ekranu

---

### Scenario 6 - Porządki finalne i przygotowanie release v6.0.0 (Priority: P2)

Deweloper aktualizuje wersję, changelog, dokumentację i wykonuje finalny build produkcyjny.

**Priority Justification**: Niezbędne do wydania, ale wykonywane po weryfikacji jakości.

**Acceptance Criteria**:

1. **Given** wszystkie testy przechodzą, **When** deweloper zaktualizuje `package.json`, **Then** wersja jest ustawiona na `6.0.0`
2. **Given** nowa wersja, **When** deweloper zaktualizuje changelog, **Then** `src/components/changeLogs/logs.ts` zawiera wpis o v6.0 z listą kluczowych zmian
3. **Given** zaktualizowana dokumentacja, **When** deweloper zaktualizuje `README.md`, **Then** README opisuje nowe funkcje v6.0 (dark mode, nowy UI, accessibility)
4. **Given** zaktualizowany `src-pwa/manifest.json`, **When** deweloper zweryfikuje manifest, **Then** manifest zawiera poprawne dane aplikacji
5. **Given** kompletna baza kodu, **When** deweloper przeszuka nieużywane pliki i TODO, **Then** kod jest wyczyszczony z nieużywanych artefaktów
6. **Given** gotowa baza kodu, **When** deweloper uruchomi `quasar build -m pwa`, **Then** build produkcyjny kończy się sukcesem

---

### Edge Cases

- Co jeśli test jednostkowy nie przechodzi z powodu zmian w stałych podatkowych na nowy rok?
- Co jeśli Lighthouse audit wskazuje na problemy z zewnętrznymi zasobami (AdMob, Google Analytics)?
- Co jeśli build Capacitor Android wymaga aktualizacji Gradle lub Android SDK?
- Co jeśli Service Worker cachuje starą wersję i użytkownicy nie widzą aktualizacji?
- Co jeśli bundle size przekracza rozsądne limity po dodaniu nowych zależności?

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Pełny zestaw testów jednostkowych MUSI przechodzić pomyślnie (`npx vitest run` exit code 0)
- **FR-002**: Każdy z 29 modułów MUSI być zweryfikowany ręcznie pod kątem poprawności działania (już wykonane)
- **FR-003**: Dark mode MUSI działać poprawnie we wszystkich modułach bez regresji wizualnych
- **FR-004**: Aplikacja MUSI być responsywna na breakpointach: 320px, 768px, 1024px, 1440px, 2560px
- **FR-005**: Build produkcyjny PWA MUSI kończyć się sukcesem bez błędów
- **FR-006**: Build Capacitor Android MUSI kończyć się sukcesem bez błędów
- **FR-007**: Wersja w `package.json` MUSI być zaktualizowana do `6.0.0`
- **FR-008**: Changelog MUSI zawierać wpis o v6.0 z opisem kluczowych zmian
- **FR-009**: `README.md` MUSI być zaktualizowany o informacje o nowych funkcjach
- **FR-010**: Nieużywane pliki, komentarze i TODO MUSZĄ być usunięte

### Performance Requirements

- **PR-001**: Lighthouse Performance score MUSI być > 90 na wersji produkcyjnej
- **PR-002**: Lighthouse Accessibility score MUSI być > 90 na wersji produkcyjnej
- **PR-003**: Wszystkie moduły MUSZĄ używać lazy loading (dynamiczne importy w routerze)
- **PR-004**: Service Worker MUSI poprawnie cachować zasoby i dostarczać aktualizacje

### Release Requirements

- **RR-001**: Wersja `APP.VERSION` MUSI być zsynchronizowana z `package.json`
- **RR-002**: `src-pwa/manifest.json` MUSI zawierać poprawne dane aplikacji
- **RR-003**: Finalny build produkcyjny (`quasar build -m pwa`) MUSI zakończyć się sukcesem

### Key Entities

- **Moduł kalkulatora**: Jeden z 29 modułów aplikacji (np. contractOfEmployment, selfEmployment) — każdy wymaga weryfikacji regresyjnej
- **Build produkcyjny**: Wynik `quasar build -m pwa` — gotowy do wdrożenia artefakt
- **Build Android**: Wynik `quasar build -m capacitor -T android` — aplikacja mobilna na Google Play
- **Changelog**: Plik `src/components/changeLogs/logs.ts` — historia zmian widoczna dla użytkowników

### Assumptions

- Ręczna weryfikacja wszystkich 29 modułów została już wykonana przez dewelopera
- Milestone 1–5 (aktualizacja zależności, refaktoryzacja, dark mode, UI/UX, accessibility) są ukończone
- Środowisko Android SDK i emulator są dostępne do testów Capacitor
- Konto AdMob jest skonfigurowane i aktywne

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: 100% testów jednostkowych przechodzi pomyślnie (`npx vitest run`)
- **SC-002**: Lighthouse Performance score > 90 na wersji produkcyjnej PWA
- **SC-003**: Lighthouse Accessibility score > 90 na wersji produkcyjnej PWA
- **SC-004**: Build produkcyjny PWA kończy się sukcesem bez ostrzeżeń krytycznych
- **SC-005**: Build Capacitor Android kończy się sukcesem
- **SC-006**: Wersja aplikacji to `6.0.0` we wszystkich lokalizacjach (package.json, constants, manifest)
- **SC-007**: Changelog zawiera kompletny wpis o v6.0
- **SC-008**: Brak nieużywanych plików, komentarzy TODO i martwego kodu w repozytorium
- **SC-009**: Dark mode działa poprawnie we wszystkich 29 modułach
- **SC-010**: Aplikacja jest w pełni responsywna na wszystkich docelowych breakpointach
