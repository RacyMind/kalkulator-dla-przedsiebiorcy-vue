# Feature Specification: System motywów (Light/Dark Mode)

**Branch**: `012-theme-dark-mode`  
**Created**: 2026-02-07  
**Status**: Clarified  
**Input**: User description: "Milestone 3 - System motywów Light/Dark Mode - Quasar Dark plugin, design tokens, module colors verification, chart dark mode"

## User Scenarios *(required)*

### Scenario 1 - Przełączanie motywu przez użytkownika (Priority: P1) 🎯 MVP

Użytkownik otwiera aplikację i widzi przycisk w toolbarze (header), który umożliwia przełączenie między trybem jasnym (light) a ciemnym (dark). Kliknięcie przycisku natychmiast zmienia wygląd całej aplikacji. Wybór jest zapamiętywany w localStorage i przywracany po ponownym otwarciu.

**Priority Justification**: Podstawowa funkcjonalność — bez przełącznika nie ma dark mode.

**Independent Test**: Otworzyć aplikację, kliknąć przycisk motywu, zweryfikować zmianę kolorów tła i tekstu. Odświeżyć stronę — motyw powinien być zachowany.

**Acceptance Criteria**:

1. **Given** aplikacja jest w trybie jasnym, **When** użytkownik kliknie przycisk motywu, **Then** aplikacja przełącza się na tryb ciemny (klasa `.body--dark` na `<body>`)
2. **Given** aplikacja jest w trybie ciemnym, **When** użytkownik kliknie przycisk motywu, **Then** aplikacja przełącza się na tryb jasny
3. **Given** użytkownik wybrał tryb ciemny i zamknął aplikację, **When** ponownie otworzy aplikację, **Then** tryb ciemny jest aktywny (odczyt z localStorage)
4. **Given** użytkownik nie ustawił preferencji ręcznie, **When** system operacyjny ma ustawiony `prefers-color-scheme: dark`, **Then** aplikacja automatycznie uruchamia się w trybie ciemnym

---

### Scenario 2 - Tryb automatyczny (systemowy) (Priority: P1) 🎯 MVP

Użytkownik może wybrać opcję "Auto", która respektuje ustawienia systemowe (`prefers-color-scheme`). Gdy system zmieni motyw (np. wieczorem), aplikacja reaguje w czasie rzeczywistym.

**Priority Justification**: Standardowe oczekiwanie użytkowników nowoczesnych aplikacji.

**Acceptance Criteria**:

1. **Given** użytkownik wybrał tryb "Auto", **When** system operacyjny zmieni motyw na ciemny, **Then** aplikacja automatycznie przełączy się na dark mode
2. **Given** użytkownik wybrał tryb "Auto" i zapisano to w localStorage, **When** aplikacja jest ponownie otwarta, **Then** motyw jest zgodny z aktualnym ustawieniem systemowym

---

### Scenario 3 - Poprawne wyświetlanie komponentów w dark mode (Priority: P1) 🎯 MVP

Wszystkie elementy interfejsu — formularze, wyniki, nagłówki sekcji, drawer, header, karty — używają tokenów z `_design-tokens.scss` zamiast hardcodowanych klas Quasar (`bg-white`, `bg-teal-1`, `bg-grey-2`, `bg-red-8`). W trybie ciemnym tokeny automatycznie przełączają się na warianty dark.

**Priority Justification**: Bez migracji na tokeny, dark mode nie będzie działał poprawnie — elementy pozostaną jasne.

**Acceptance Criteria**:

1. **Given** aplikacja jest w trybie ciemnym, **When** użytkownik otworzy dowolny moduł, **Then** tło strony, drawer i header używają ciemnych wariantów kolorów z tokenów
2. **Given** aplikacja jest w trybie ciemnym, **When** użytkownik otworzy formularz, **Then** pola `q-input`, przyciski i tekst są czytelne na ciemnym tle
3. **Given** aplikacja jest w trybie ciemnym, **When** użytkownik przegląda wyniki obliczeń, **Then** tekst wyników jest czytelny, a `SectionHeader` ma odpowiedni kontrast

---

### Scenario 4 - Kolory modułów w dark mode (Priority: P2)

Każda kategoria modułów ma swój kolor brandowy (work, business, taxes, currencies, percentage, informator). W trybie ciemnym te kolory muszą być jaśniejsze (zdefiniowane w `.body--dark` w `_design-tokens.scss`), aby zachować czytelność na ciemnym tle.

**Priority Justification**: Kolory modułów są widoczne w nagłówkach sekcji i menu — muszą być czytelne w obu trybach.

**Acceptance Criteria**:

1. **Given** aplikacja jest w trybie ciemnym, **When** użytkownik otworzy moduł z kategorii "Umowy" (work), **Then** kolor `.text-brand` jest jaśniejszy niż w trybie jasnym i czytelny na ciemnym tle
2. **Given** aplikacja jest w trybie ciemnym, **When** użytkownik przegląda menu, **Then** kolory sekcji menu są czytelne i spójne z brandingiem modułów

---

### Scenario 5 - Wykresy w dark mode (Priority: P2)

Wykresy (Pie, Bar, Line) dynamicznie przełączają kolory na warianty dark, a etykiety i osie są czytelne na ciemnym tle. Przełączenie motywu odświeża kolory wykresów.

**Priority Justification**: Wykresy są kluczowym elementem wizualizacji wyników — bez dynamicznych kolorów byłyby nieczytelne w dark mode.

**Acceptance Criteria**:

1. **Given** aplikacja jest w trybie ciemnym i użytkownik obliczył wyniki, **When** wyświetlony jest wykres, **Then** kolory wykresów odpowiadają wariantom dark z `_design-tokens.scss`
2. **Given** użytkownik przełączył motyw z jasnego na ciemny, **When** wykres jest już wyświetlony, **Then** kolory wykresów aktualizują się automatycznie (bez przeładowania strony)
3. **Given** aplikacja jest w trybie ciemnym, **When** wykres jest wyświetlony, **Then** etykiety, legendy i osie są czytelne (jasny kolor tekstu na ciemnym tle)

---

### Edge Cases

- Co jeśli przeglądarka nie obsługuje `prefers-color-scheme`? → Domyślnie light mode.
- Co jeśli localStorage jest niedostępne (tryb prywatny)? → Domyślnie light mode, bez persystencji.
- Co jeśli użytkownik zmieni motyw w trakcie wypełniania formularza? → Formularz nie traci danych, tylko zmienia kolory.
- Co jeśli custom CSS w komponentach nadpisuje tokeny? → Audyt i usunięcie hardcodowanych kolorów.

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Aplikacja MUSI obsługiwać 3 tryby motywu: `light`, `dark`, `auto`
- **FR-002**: Quasar Dark plugin MUSI być włączony w `quasar.config.ts` → `framework.plugins: ['Dark', 'Notify']`
- **FR-003**: Composable `useTheme` MUSI zarządzać stanem motywu, persystencją w localStorage i integracją z `Quasar.Dark.set()`
- **FR-004**: Composable `useTheme` MUSI wykrywać `prefers-color-scheme` za pomocą `usePreferredColorScheme()` z `@vueuse/core`
- **FR-005**: Przełącznik motywu MUSI być widoczny w toolbarze `MainLayout.vue` jako cykliczny `q-btn` z 3 stanami: `light_mode` → `dark_mode` → `brightness_auto` → `light_mode` (cykl: light → dark → auto)
- **FR-006**: Opcja motywu MUSI być przechowywana w `settingStore.ts` z persystencją w localStorage
- **FR-007**: UI MUSI używać komponentów Quasar
- **FR-008**: Wszystkie teksty UI MUSZĄ być w języku polskim
- **FR-009**: Domyślny motyw dla nowych użytkowników (brak wpisu w localStorage) MUSI być `auto` — respektujący `prefers-color-scheme` systemu
- **FR-010**: Inline `<script>` w `index.html` MUSI odczytywać localStorage i dodawać klasę `.body--dark` przed renderem Vue, aby zapobiec FOUC (Flash of Unstyled Content)

### Design Token Requirements

- **DT-001**: Klasa `bg-white` w `ModulePageLayout.vue` MUSI być zamieniona na token `var(--color-surface)` lub klasę `.bg-surface`
- **DT-002**: Klasa `bg-teal-1` w `q-page-container` (`MainLayout.vue`) MUSI być zamieniona na `var(--color-surface-variant)`
- **DT-003**: Klasa `bg-grey-2` w drawerze (`MainLayout.vue`) MUSI być zamieniona na `var(--color-surface-variant)`
- **DT-004**: Klasa `bg-red-8` w headerze (`MainLayout.vue`) MUSI być zamieniona na `var(--color-primary)`
- **DT-005**: Wszystkie hardcodowane klasy kolorów Quasar (`bg-white`, `bg-grey-*`, `bg-teal-*`, `bg-red-*`) w 17 plikach MUSZĄ być zamienione na tokeny z `_design-tokens.scss`
- **DT-006**: `SectionHeader.vue` — styl `.sectionHeader { color: #ffff }` MUSI używać tokenu tekstowego `var(--color-text-on-brand)`

### Chart Requirements

- **CH-001**: Composable `useChartColors` MUSI automatycznie odświeżać kolory po zmianie motywu
- **CH-002**: Composables `usePieChart`, `useBarChart`, `useLineChart` MUSZĄ reagować na zmianę motywu
- **CH-003**: Etykiety, legendy i osie wykresów MUSZĄ być czytelne w obu trybach (jasny tekst na ciemnym tle i odwrotnie)

### Key Entities

- **ThemeMode**: Tryb motywu — `'light' | 'dark' | 'auto'`. Przechowywany w `settingStore`, persystowany w localStorage.
- **Design Tokens**: CSS custom properties w `_design-tokens.scss` — już zdefiniowane dla `:root` (light) i `.body--dark` (dark). Konsumowane przez komponenty zamiast hardcodowanych klas.
- **Chart Colors**: Dynamiczne kolory wykresów — odczytywane z CSS custom properties przez `useChartColors`, odświeżane po zmianie motywu.

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Przełącznik motywu działa poprawnie — przełącza między light/dark/auto, a wybór jest persystowany w localStorage
- **SC-002**: Wszystkie 29 modułów wyświetlają się poprawnie w trybie ciemnym — bez białych fragmentów, czytelny tekst, poprawne kolory brandowe
- **SC-003**: Wykresy we wszystkich modułach dynamicznie przełączają kolory po zmianie motywu
- **SC-004**: Zero hardcodowanych klas kolorów Quasar (`bg-white`, `bg-grey-*`, `bg-teal-*`, `bg-red-*`) w komponentach — wszystkie zamienione na tokeny
- **SC-005**: Wszystkie istniejące testy jednostkowe (410/410) przechodzą po zmianach
- **SC-006**: Kontrast kolorów w dark mode spełnia WCAG AA (min. 4.5:1 dla tekstu, 3:1 dla dużego tekstu)
- **SC-007**: Aplikacja respektuje ustawienia systemowe `prefers-color-scheme` w trybie "Auto"

## Clarifications

### Session 2026-02-07

- Q: Jak użytkownik ma dostęp do trybu "auto" — toggle 2-stanowy, przycisk cykliczny 3-stanowy, czy dropdown? → A: Przycisk cykliczny 3-stanowy (light → dark → auto) z 3 ikonami: `light_mode` / `dark_mode` / `brightness_auto`
- Q: Jaki motyw domyślny dla nowych użytkowników (brak wpisu w localStorage)? → A: Domyślnie `auto` — respektuje `prefers-color-scheme` systemu od pierwszego uruchomienia
- Q: Czy zapobiegać FOUC (Flash of Unstyled Content) przy ładowaniu strony? → A: Tak — inline `<script>` w `index.html` czyta localStorage i dodaje `.body--dark` przed renderem Vue

### Assumptions

- Design tokens w `_design-tokens.scss` (zdefiniowane w Milestone 2.6) są kompletne i prawidłowe — nie projektujemy nowych kolorów
- Quasar v2.18.6 w pełni obsługuje Dark plugin
- `@vueuse/core` jest już zainstalowany i dostępny w projekcie
- Istniejący composable `useChartColors` ma mechanizm `refresh()` — wystarczy wywołać go po zmianie motywu
