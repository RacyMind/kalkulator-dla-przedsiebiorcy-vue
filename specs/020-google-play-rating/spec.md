# Feature Specification: Ocena aplikacji w Google Play (In-App Review)

**Branch**: `020-google-play-rating`  
**Created**: 2026-02-09  
**Status**: Draft  
**Input**: User description: "Chcę zachęcić użytkowników aplikacji na Androidzie do oceniania aplikacji w Google Store"

## User Scenarios _(required)_

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Automatyczne wyświetlenie prośby o ocenę (Priority: P1) 🎯 MVP

Użytkownik korzysta z aplikacji na Androidzie. Po spełnieniu określonych warunków (np. kilkukrotne użycie kalkulatora) system automatycznie wyświetla natywny dialog Google Play In-App Review, umożliwiający ocenę aplikacji bez opuszczania jej.

**Priority Justification**: Główna funkcjonalność — bez tego mechanizmu nie ma możliwości zachęcenia użytkownika do oceny.

**Independent Test**: Uruchomić aplikację na urządzeniu z Androidem, wykonać wymaganą liczbę obliczeń i zweryfikować, czy dialog oceny się pojawia.

**Acceptance Criteria**:

1. **Given** użytkownik wykonał co najmniej 5 obliczeń w aplikacji, **When** użytkownik uruchomi aplikację ponownie, **Then** system wyświetla natywny dialog Google Play In-App Review
2. **Given** użytkownik widzi dialog oceny, **When** użytkownik wystawi ocenę lub zamknie dialog, **Then** aplikacja wraca do normalnego działania bez zakłóceń
3. **Given** użytkownik już widział dialog oceny, **When** użytkownik kontynuuje korzystanie z aplikacji, **Then** dialog NIE pojawia się ponownie przez co najmniej 90 dni

---

### Scenario 2 - Ręczne przejście do Google Play Store (Priority: P2)

Użytkownik chce samodzielnie ocenić aplikację. W ustawieniach lub menu aplikacji znajduje się opcja „Podoba Ci się? Oceń!”, która otwiera stronę aplikacji w Google Play Store.

**Priority Justification**: Uzupełnienie automatycznego mechanizmu — daje użytkownikowi kontrolę i możliwość oceny w dowolnym momencie.

**Acceptance Criteria**:

1. **Given** użytkownik jest w menu aplikacji, **When** kliknie opcję „Podoba Ci się? Oceń!”, **Then** system otwiera stronę aplikacji w Google Play Store
2. **Given** użytkownik nie ma zainstalowanego Google Play Store (np. Huawei), **When** kliknie opcję „Podoba Ci się? Oceń!”, **Then** system otwiera stronę aplikacji w przeglądarce internetowej

---

### Scenario 3 - Odłożenie oceny na później (Priority: P2)

Użytkownik nie chce teraz oceniać aplikacji. Po zamknięciu natywnego dialogu oceny system zapamiętuje tę decyzję i nie wyświetla dialogu ponownie zbyt szybko.

**Priority Justification**: Zapobiega irytowaniu użytkownika zbyt częstymi prośbami o ocenę.

**Acceptance Criteria**:

1. **Given** dialog oceny został wyświetlony, **When** użytkownik zamknie dialog bez wystawienia oceny, **Then** system zapisuje datę wyświetlenia i nie pokazuje dialogu ponownie przez co najmniej 90 dni
2. **Given** minęło 90 dni od ostatniego zamknięcia dialogu, **When** użytkownik spełni ponownie warunki wyświetlenia, **Then** dialog może zostać wyświetlony ponownie (maksymalnie 3 razy łącznie)

---

### Scenario 4 - Zachowanie na platformie PWA/Web (Priority: P3)

Aplikacja działa również jako PWA w przeglądarce. Mechanizm In-App Review nie jest dostępny na platformie webowej.

**Priority Justification**: Zapewnia spójne działanie na wszystkich platformach bez błędów.

**Acceptance Criteria**:

1. **Given** użytkownik korzysta z aplikacji w przeglądarce (PWA), **When** warunki wyświetlenia dialogu oceny zostałyby spełnione, **Then** dialog oceny NIE jest wyświetlany
2. **Given** użytkownik korzysta z aplikacji w przeglądarce (PWA), **When** przegląda menu, **Then** opcja „Podoba Ci się? Oceń!” NIE jest widoczna

---

### Edge Cases

- Co jeśli Google Play In-App Review API nie jest dostępne na urządzeniu (starsza wersja Google Play Services)?
- Co jeśli użytkownik nie ma konta Google na urządzeniu?
- Co jeśli użytkownik odinstaluje i ponownie zainstaluje aplikację — czy licznik obliczeń i historia wyświetleń dialogu się resetują?
- Co jeśli Google Play API zwróci błąd — aplikacja musi kontynuować normalne działanie bez informowania użytkownika o błędzie
- Co jeśli użytkownik korzysta z aplikacji offline — prośba o ocenę powinna być odłożona do momentu uzyskania połączenia

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Aplikacja MUSI wyświetlać natywny dialog Google Play In-App Review po spełnieniu warunków wyzwalających
- **FR-002**: Warunki wyzwalające MUSZĄ obejmować: minimum 5 wykonanych obliczeń w aplikacji (każde kliknięcie przycisku „Oblicz” w dowolnym module kalkulatora); dialog wyświetla się przy następnym uruchomieniu aplikacji po przekroczeniu progu
- **FR-003**: Dialog oceny NIE MOŻE być wyświetlany częściej niż raz na 90 dni
- **FR-004**: Dialog oceny NIE MOŻE być wyświetlany więcej niż 3 razy łącznie w całym cyklu życia aplikacji
- **FR-005**: Aplikacja MUSI zapisywać lokalnie: liczbę wykonanych obliczeń, datę ostatniego wyświetlenia dialogu, łączną liczbę wyświetleń dialogu
- **FR-006**: W menu aplikacji MUSI znajdować się opcja „Podoba Ci się? Oceń!” (opis: „Twoja opinia pomaga innym użytkownikom”) otwierająca stronę aplikacji w Google Play Store
- **FR-007**: Opcja „Podoba Ci się? Oceń!” MUSI być widoczna tylko na platformie Android (Capacitor)
- **FR-008**: Mechanizm In-App Review MUSI działać tylko na platformie Android (Capacitor)
- **FR-009**: Błędy API Google Play MUSZĄ być obsługiwane w sposób cichy — bez wpływu na działanie aplikacji
- **FR-010**: UI MUSI używać komponentów Quasar
- **FR-011**: Wszystkie teksty UI MUSZĄ być w języku polskim

### Key Entities

- **ReviewState**: Stan mechanizmu oceny — przechowuje liczbę wykonanych obliczeń, datę ostatniego wyświetlenia dialogu, łączną liczbę wyświetleń, flagę czy użytkownik już ocenił aplikację
- **ReviewTrigger**: Logika decyzyjna — sprawdza warunki wyzwalające i decyduje czy wyświetlić dialog oceny
- **PlatformGuard**: Mechanizm wykrywania platformy — zapewnia że funkcjonalność działa tylko na Androidzie

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: Dialog In-App Review wyświetla się poprawnie na urządzeniu z Androidem po spełnieniu warunków
- **SC-002**: Opcja „Podoba Ci się? Oceń!” w menu otwiera poprawną stronę aplikacji w Google Play Store
- **SC-003**: Dialog nie pojawia się na platformie PWA/Web
- **SC-004**: Dialog nie pojawia się częściej niż raz na 90 dni
- **SC-005**: Dialog nie pojawia się więcej niż 3 razy łącznie
- **SC-006**: Błędy API nie wpływają na normalne działanie aplikacji
- **SC-007**: Stan mechanizmu oceny jest poprawnie zapisywany i odczytywany z pamięci lokalnej

## Clarifications

### Session 2026-02-09

- Q: Jaki powinien być minimalny okres cooldown między wyświetleniami dialogu oceny? (Spec miał niespójność: 30 vs 90 dni) → A: 90 dni — zgodnie z rekomendacjami Google, mniejsze ryzyko irytacji użytkownika
- Q: W którym momencie powinien pojawić się dialog In-App Review? → A: Przy następnym uruchomieniu aplikacji po przekroczeniu progu 5 obliczeń — mniej inwazyjne, nie przerywa pracy z wynikami
- Q: Co dokładnie liczymy jako „obliczenie”? → A: Każde kliknięcie przycisku „Oblicz” w dowolnym module kalkulatora
- Q: Jak powinna nazywać się opcja w menu i jakie zachowanie? → A: „Podoba Ci się? Oceń!” (opis: „Twoja opinia pomaga innym użytkownikom”) — otwiera Google Play Store; In-App Review działa osobno automatycznie przy uruchomieniu aplikacji

## Assumptions

- Aplikacja korzysta z Capacitor do budowania wersji na Androida
- Google Play In-App Review API jest dostępne na urządzeniach z Google Play Services w wersji 21+
- Natywny dialog Google Play In-App Review nie gwarantuje, że użytkownik faktycznie wystawi ocenę — API nie informuje o wyniku
- Licznik obliczeń resetuje się po odinstalowaniu aplikacji (dane lokalne)
- Próg 5 obliczeń jest wartością początkową, która może być dostosowana w przyszłości
