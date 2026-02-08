# Feature Specification: Aktualizacja zależności (Milestone 1)

**Branch**: `010-update-dependencies`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "Milestone 1 from ROADMAP v6.0 - Zaktualizować wszystkie biblioteki do najnowszych wersji, zmigrować konfigurację narzędzi. Wszystkie testy muszą przechodzić po każdej zmianie."

## User Scenarios *(required)*

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Aktualizacja głównych bibliotek frameworka (Priority: P1) 🎯 MVP

Deweloper aktualizuje główne zależności aplikacji (Vue, Quasar, Vue Router, Pinia) do najnowszych stabilnych wersji w ramach swoich głównych linii (Vue 3.x, Quasar 2.x, Vue Router 4.x, Pinia 2.x). Po aktualizacji aplikacja działa identycznie jak przed zmianą — wszystkie kalkulatory zwracają te same wyniki, a testy jednostkowe przechodzą bez błędów.

**Priority Justification**: Biblioteki frameworka stanowią fundament aplikacji. Ich aktualizacja musi nastąpić jako pierwsza, ponieważ pozostałe zależności mogą wymagać kompatybilności z nowszymi wersjami frameworka.

**Independent Test**: Uruchomić pełny zestaw testów jednostkowych oraz ręcznie zweryfikować działanie kilku kluczowych kalkulatorów (umowa o pracę, B2B, umowa zlecenie).

**Acceptance Criteria**:

1. **Given** aplikacja z zaktualizowanymi głównymi bibliotekami, **When** użytkownik uruchomi dowolny kalkulator, **Then** wyniki obliczeń są identyczne jak przed aktualizacją
2. **Given** zaktualizowane zależności, **When** uruchomione zostaną testy jednostkowe, **Then** wszystkie testy przechodzą bez błędów
3. **Given** zaktualizowane zależności, **When** uruchomiona zostanie aplikacja w trybie deweloperskim, **Then** aplikacja uruchamia się bez błędów i ostrzeżeń krytycznych

---

### Scenario 2 - Migracja narzędzi budowania (Priority: P1) 🎯 MVP

Deweloper aktualizuje narzędzia budowania (Quasar CLI z app-vite) do nowej głównej wersji, wraz z aktualizacją Quasar testing extensions. Wymaga to migracji pliku konfiguracyjnego z formatu JS na TS oraz dostosowania konfiguracji boot files, PWA i Capacitor. Po migracji aplikacja buduje się poprawnie we wszystkich trybach (dev, PWA, Capacitor), a testy uruchamiają się bez błędów.

**Priority Justification**: Narzędzia budowania warunkują działanie całego pipeline'u deweloperskiego. Migracja do nowej wersji jest wymagana przed dalszymi pracami.

**Independent Test**: Zbudować aplikację w trybie PWA i Capacitor (Android). Uruchomić w trybie deweloperskim i zweryfikować działanie.

**Acceptance Criteria**:

1. **Given** zmigrowany plik konfiguracyjny, **When** uruchomione zostanie `quasar dev`, **Then** aplikacja uruchamia się poprawnie
2. **Given** zmigrowana konfiguracja, **When** uruchomione zostanie `quasar build -m pwa`, **Then** build kończy się sukcesem
3. **Given** zmigrowana konfiguracja, **When** uruchomione zostanie `quasar build -m capacitor -T android`, **Then** build kończy się sukcesem
4. **Given** zmigrowane boot files, **When** aplikacja zostanie uruchomiona, **Then** Google Analytics i AdMob działają poprawnie

---

### Scenario 3 - Aktualizacja TypeScript i narzędzi lintowania (Priority: P2)

Deweloper aktualizuje TypeScript do wersji 5.x z włączeniem pełnego trybu `strict: true` (naprawa wszystkich wynikających błędów typów), ESLint do wersji 9.x z migracją na flat config, oraz Prettier do wersji 3.x. Nowe reguły lintowania nie wprowadzają regresji w logice biznesowej — jedynie poprawiają jakość kodu.

**Priority Justification**: Narzędzia lintowania i kompilator TypeScript są krytyczne dla jakości kodu, ale ich aktualizacja nie wpływa bezpośrednio na użytkownika końcowego.

**Acceptance Criteria**:

1. **Given** zaktualizowany TypeScript i ESLint, **When** uruchomiony zostanie linting, **Then** nie ma krytycznych błędów blokujących build
2. **Given** zmigrowana konfiguracja ESLint na flat config, **When** uruchomiony zostanie `eslint`, **Then** linting działa poprawnie z nową konfiguracją
3. **Given** zaktualizowany Prettier, **When** uruchomione zostanie formatowanie, **Then** pliki są formatowane konsystentnie
4. **Given** zaktualizowane narzędzia, **When** uruchomione zostaną testy, **Then** wszystkie testy przechodzą

---

### Scenario 4 - Aktualizacja pozostałych bibliotek (Priority: P2)

Deweloper aktualizuje biblioteki pomocnicze: VueUse, Axios, date-fns (z uwzględnieniem breaking changes w importach v4), vitest, testing-library, sass, workbox oraz typy Node. Usunięte zostają zbędne zależności (np. babel-preset-app).

**Priority Justification**: Biblioteki pomocnicze są ważne, ale ich aktualizacja jest mniej ryzykowna niż aktualizacja frameworka i narzędzi budowania.

**Acceptance Criteria**:

1. **Given** zaktualizowane biblioteki pomocnicze, **When** uruchomione zostaną testy, **Then** wszystkie testy przechodzą
2. **Given** zaktualizowane date-fns z nowymi importami, **When** uruchomiony zostanie dowolny kalkulator używający dat, **Then** daty są formatowane poprawnie
3. **Given** usunięte zbędne zależności, **When** uruchomiony zostanie build, **Then** build kończy się sukcesem bez brakujących zależności
4. **Given** zaktualizowane workbox, **When** aplikacja PWA zostanie zainstalowana, **Then** caching i offline mode działają poprawnie

---

### Scenario 5 - Wymiana biblioteki wykresów (Priority: P2)

Deweloper wymienia przestarzałą bibliotekę wykresów na nowszą alternatywę. Wszystkie istniejące wykresy (kołowe, słupkowe, liniowe) w modułach kalkulatorów wyświetlają się poprawnie z tymi samymi danymi co przed wymianą.

**Priority Justification**: Obecna biblioteka wykresów nie jest aktywnie utrzymywana. Wymiana jest konieczna dla długoterminowej stabilności, ale nie wpływa na logikę obliczeń.

**Acceptance Criteria**:

1. **Given** wymieniona biblioteka wykresów, **When** użytkownik obliczy wynagrodzenie z umowy o pracę, **Then** wykres podsumowujący wyświetla się poprawnie z tymi samymi danymi
2. **Given** wymieniona biblioteka, **When** użytkownik przejdzie do dowolnego modułu z wykresem, **Then** wykres renderuje się bez błędów
3. **Given** wymieniona biblioteka, **When** uruchomione zostaną testy, **Then** wszystkie testy przechodzą

---

### Edge Cases

- Nowa wersja biblioteki może mieć niekompatybilne API — każdą aktualizację należy weryfikować osobno; w razie niekompatybilności przypiąć do ostatniej działającej wersji
- Breaking changes w date-fns v4 (ESM-only, zmienione ścieżki importów) mogą wpłynąć na formatowanie dat
- Migracja ESLint na flat config może wymagać ręcznego dostosowania reguł specyficznych dla Vue
- Nowa wersja TypeScript może ujawnić ukryte błędy typów w istniejącym kodzie
- Aktualizacja sass może generować deprecation warnings — akceptowane tymczasowo, naprawa odłożona do Milestone 2
- Workbox v7 może zmienić strategię cachowania — wymaga weryfikacji offline mode

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Aplikacja MUSI działać identycznie z perspektywy użytkownika po każdej aktualizacji zależności
- **FR-002**: Wszystkie 29 modułów kalkulatorów MUSI działać poprawnie po aktualizacji
- **FR-003**: Wyniki obliczeń MUSZĄ być identyczne przed i po aktualizacji
- **FR-004**: Aplikacja MUSI budować się poprawnie w trybie PWA
- **FR-005**: Aplikacja MUSI budować się poprawnie w trybie Capacitor (Android)
- **FR-006**: Tryb deweloperski MUSI uruchamiać się bez błędów krytycznych
- **FR-007**: Wykresy MUSZĄ wyświetlać się poprawnie we wszystkich modułach, które je wykorzystują
- **FR-008**: Caching i tryb offline (PWA) MUSZĄ działać poprawnie po aktualizacji workbox
- **FR-009**: Boot files (analytics, reklamy) MUSZĄ działać poprawnie po migracji

### Process Requirements

- **PR-001**: Aktualizacje MUSZĄ być przeprowadzane etapami — po każdym etapie uruchomienie testów
- **PR-002**: Każdy etap aktualizacji MUSI być oddzielnym commitem, aby umożliwić łatwy rollback
- **PR-003**: Plik konfiguracyjny MUSI zostać zmigrowany do formatu wymaganego przez nową wersję narzędzi budowania
- **PR-004**: Konfiguracja lintowania MUSI zostać zmigrowana na aktualny format (flat config)
- **PR-005**: Zbędne zależności (np. babel-preset-app) MUSZĄ zostać usunięte
- **PR-006**: Jeśli zależność jest niekompatybilna z docelową wersją, MUSI zostać przypięta do ostatniej kompatybilnej wersji z udokumentowanym blokerem do rozwiązania w follow-up

### Key Entities

- **Core Dependencies**: Główne biblioteki frameworka (Vue, Quasar, Vue Router, Pinia) — fundament aplikacji
- **Build Tools**: Narzędzia budowania (Quasar CLI, app-vite) — pipeline deweloperski i produkcyjny
- **Dev Tools**: TypeScript, ESLint, Prettier — jakość kodu i DX
- **Utility Libraries**: VueUse, Axios, date-fns, sass — funkcjonalności pomocnicze
- **Chart Library**: Biblioteka wykresów — wizualizacja danych w kalkulatorach
- **PWA/Workbox**: Service Worker i caching — tryb offline i instalacja jako PWA
- **Testing Tools**: Vitest, Vue Test Utils, Testing Library, Quasar Testing Extensions — zapewnienie jakości

## Clarifications

### Session 2026-02-06

- Q: Czy po aktualizacji TypeScript do 5.x należy zachować obecne ustawienia tsconfig, czy włączyć strict mode? → A: Włączyć pełny `strict: true` i naprawić wszystkie wynikające błędy typów.
- Q: Czy deprecation warnings w sass należy naprawić w tym milestone, czy odłożyć? → A: Zaktualizować sass, zaakceptować deprecation warnings — naprawy odłożone do Milestone 2.
- Q: Czy Quasar testing extensions (`@quasar/quasar-app-extension-testing`, `@quasar/quasar-app-extension-testing-unit-vitest`) są w zakresie tego milestone? → A: Tak, zaktualizować razem z migracją app-vite v2.
- Q: Jaka strategia w przypadku niekompatybilnej zależności? → A: Przypiąć do ostatniej kompatybilnej wersji, udokumentować bloker i odłożyć do follow-up.

## Assumptions

- Aktualizacja odbywa się w ramach tych samych głównych wersji (Vue 3.x, Quasar 2.x, Vue Router 4.x, Pinia 2.x), z wyjątkiem narzędzi deweloperskich, które przechodzą na nowe główne wersje
- Logika obliczeniowa nie zmienia się — jedynie infrastruktura techniczna
- Testy jednostkowe stanowią wystarczający wskaźnik poprawności obliczeń
- Node.js >= 20.0.0 jest dostępny w środowisku deweloperskim

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: 100% testów jednostkowych przechodzi po każdym etapie aktualizacji
- **SC-002**: Aplikacja buduje się bez błędów w trybie PWA (`quasar build -m pwa`)
- **SC-003**: Aplikacja buduje się bez błędów w trybie Capacitor (`quasar build -m capacitor -T android`)
- **SC-004**: Aplikacja uruchamia się w trybie deweloperskim bez błędów krytycznych
- **SC-005**: Wykresy renderują się poprawnie we wszystkich modułach
- **SC-006**: Linting przechodzi bez krytycznych błędów z nową konfiguracją
- **SC-007**: Brak przestarzałych lub nieużywanych zależności w `package.json`
- **SC-008**: Tryb offline (PWA) działa poprawnie po aktualizacji workbox
