# Feature Specification: Nowoczesny UI/UX (Modern UI/UX Redesign)

**Branch**: `013-modern-ui-ux`  
**Created**: 2026-02-07  
**Status**: Clarified  
**Input**: User description: "Milestone 4 — Modern UI/UX redesign with responsive layout, dashboard, modern components, charts, and navigation improvements. Really nice and modern UI."

---

## Clarifications

### Session 2026-02-07

- Q: Sidebar na desktopie — stały (persistent) czy overlay (drawer)? → A: Stały sidebar >1200px — sidebar zawsze widoczny na desktop, hamburger menu tylko na mobile/tablet. `q-layout view` zmienia się dynamicznie.
- Q: Layout dwukolumnowy — które moduły? → A: Domyślnie dwukolumnowy na desktop (>1200px) dla wszystkich modułów. `ModulePageLayout` ma prop `singleColumn` dla modułów z niestandardowym layoutem (np. kursy walut, inflacja).
- Q: Variant pól formularzy — `outlined` czy `filled`? → A: `outlined` — czytelny, nowoczesny, MD3 default, dobrze kontrastuje z kartami.
- Q: Dashboard — które sekcje pokazywać jako kafelki? → A: 6 sekcji (Firma, Podatki, Praca, Oszczędzanie, Waluty, Informacje). Sekcja "Aplikacja" (changelog, kontakt, polityka, GitHub) dostępna tylko w sidebar/drawer i footer.
- Q: Drawer `q-expansion-item` — domyślnie rozwinięte czy zwinięte? → A: Aktywna sekcja (z aktualnie wybranym modułem) rozwinięta, pozostałe zwinięte. Dodatkowa sekcja "Ostatnio używane" na górze drawera, domyślnie rozwinięta, dane z localStorage.
- Q: Header na stronie głównej — widoczny czy ukryty? → A: Header zawsze widoczny na każdej stronie. Na stronie głównej (`/`) breadcrumbs są ukryte (nie wyświetlamy samej ikony home). Logo, theme toggle i hamburger (mobile) zawsze dostępne.
- Q: Max-width kontenera na stronach modułów? → A: 1200px — standard dla dwukolumnowego layoutu, daje ~550px na formularz i ~600px na wyniki.
- Q: "Ostatnio używane" — ile modułów i empty state? → A: Maks. 5 modułów, sekcja ukryta gdy brak historii (pierwsza wizyta).
- Q: Animacja przejścia między stronami — typ? → A: Fade + subtle scale (opacity 0→1, scale 0.95→1.0, ~200ms) — nowoczesny efekt "pop-in".

---

## User Scenarios *(required)*

### Scenario 1 — Responsywny layout aplikacji (Priority: P1) 🎯 MVP

Użytkownik otwiera aplikację na dowolnym urządzeniu (telefon, tablet, desktop, ultra-wide) i widzi interfejs dostosowany do rozmiaru ekranu. Na mobile drawer jest ukryty i otwierany hamburger menu. Na desktopie sidebar z menu jest stały i widoczny. Content nigdy nie jest zbyt szeroki ani zbyt wąski.

**Priority Justification**: Responsywność to fundament nowoczesnego UI — bez niej żaden inny element wizualny nie ma sensu.

**Independent Test**: Otworzyć aplikację na ekranach 320px, 768px, 1024px, 1440px, 2560px i zweryfikować, że layout jest czytelny, nic się nie "rozjeżdża" i nawigacja jest dostępna.

**Acceptance Criteria**:

1. **Given** ekran < 600px (mobile), **When** użytkownik otwiera aplikację, **Then** widzi pełną szerokość contentu, drawer jest zamknięty, w headerze jest hamburger menu
2. **Given** ekran 600–1200px (tablet), **When** użytkownik otwiera aplikację, **Then** content ma odpowiedni padding, sidebar opcjonalnie w trybie mini
3. **Given** ekran > 1200px (desktop), **When** użytkownik otwiera aplikację, **Then** sidebar z pełnym menu jest stały (persistent, nie overlay) i zawsze widoczny, hamburger menu jest ukryty, content w centralnej kolumnie
4. **Given** ekran > 2560px (ultra-wide), **When** użytkownik otwiera aplikację, **Then** kontener ma max-width i jest wycentrowany — content nie rozciąga się na całą szerokość

---

### Scenario 2 — Nowa strona główna (Dashboard) (Priority: P1) 🎯 MVP

Użytkownik wchodzi na stronę główną i zamiast prostej listy linków widzi nowoczesny dashboard z hero section, siatką kafelków modułów pogrupowanych w sekcje, ikonami i krótkimi opisami. Kafelki są responsywne (1/2/3 kolumny zależnie od ekranu).

**Priority Justification**: Strona główna jest pierwszym kontaktem użytkownika z aplikacją — musi robić świetne wrażenie i dawać łatwy dostęp do modułów.

**Independent Test**: Otworzyć `/` i zweryfikować: hero section z logo/opisem, kafelki modułów w responsywnej siatce, ikony i opisy na kafelkach, kolory sekcji modułów.

**Acceptance Criteria**:

1. **Given** strona główna, **When** użytkownik wchodzi na `/`, **Then** widzi hero section z logo aplikacji i krótkim opisem
2. **Given** strona główna, **When** użytkownik przewija, **Then** widzi kafelki (`q-card`) modułów pogrupowane w 6 sekcji (Firma, Podatki, Praca, Oszczędzanie, Waluty, Informacje). Sekcja "Aplikacja" NIE pojawia się jako kafelki
3. **Given** każdy kafelek, **When** wyświetlany, **Then** zawiera ikonę, nazwę modułu, krótki opis i kolor modułu (z design tokens)
4. **Given** ekran mobile, **When** widok kafelków, **Then** siatka wyświetla 1 kolumnę
5. **Given** ekran tablet, **When** widok kafelków, **Then** siatka wyświetla 2 kolumny
6. **Given** ekran desktop, **When** widok kafelków, **Then** siatka wyświetla 3 kolumny
7. **Given** kafelek modułu, **When** użytkownik klika, **Then** nawiguje do odpowiedniego modułu

---

### Scenario 3 — Nowoczesny header i sidebar/drawer (Priority: P1) 🎯 MVP

Header zawiera logo z linkiem do strony głównej, breadcrumbs, przełącznik motywu i hamburger menu na mobile. Sidebar/drawer zawiera sekcje menu z `q-expansion-item`, ikony sekcji, pole wyszukiwania i stopkę z wersją aplikacji.

**Priority Justification**: Nawigacja jest kluczowa — wpływa na codzienne doświadczenie użytkownika.

**Independent Test**: Otworzyć dowolny moduł i zweryfikować header (logo, breadcrumbs, theme toggle), otworzyć drawer i zweryfikować sekcje z `q-expansion-item`, ikony, wyszukiwanie, stopkę.

**Acceptance Criteria**:

1. **Given** header, **When** wyświetlany na dowolnej stronie, **Then** zawiera logo + nazwę aplikacji (link do `/`), przełącznik motywu. Breadcrumbs widoczne na stronach modułów, ukryte na stronie głównej (`/`)
2. **Given** mobile, **When** header wyświetlany, **Then** widoczny hamburger menu, nazwa aplikacji ukryta
3. **Given** drawer, **When** otwarty, **Then** sekcje menu (Firma, Praca, itd.) są zwinięte/rozwinięte przez `q-expansion-item` z ikonami sekcji. Sekcja z aktualnie wybranym modułem jest automatycznie rozwinięta, pozostałe zwinięte
3a. **Given** drawer, **When** otwarty i istnieje historia, **Then** na górze widoczna sekcja "Ostatnio używane" (domyślnie rozwinięta) z maks. 5 linkami do ostatnio odwiedzonych modułów (localStorage). Sekcja ukryta przy braku historii
4. **Given** drawer, **When** wyświetlany, **Then** na dole widoczna wersja aplikacji i przycisk "Wesprzyj projekt"
5. **Given** drawer search, **When** użytkownik wpisuje tekst, **Then** lista modułów filtruje się w czasie rzeczywistym

---

### Scenario 4 — Odświeżony layout stron modułów (Priority: P1) 🎯 MVP

Strona modułu (np. Umowa o dzieło) prezentuje formularz i wyniki w nowoczesnym layoutcie z kartami (`q-card`), subtelnymi cieniami, zaokrąglonymi rogami. Na desktopie opcjonalnie dwie kolumny (formularz | wyniki). Na mobile — jedna kolumna.

**Priority Justification**: Moduły to główna treść aplikacji — ich wygląd bezpośrednio wpływa na postrzeganie jakości.

**Independent Test**: Otworzyć moduł (np. `/umowa-o-dzielo`) na mobile i desktop. Zweryfikować karty, cienie, responsywność, podział kolumn.

**Acceptance Criteria**:

1. **Given** strona modułu, **When** wyświetlana, **Then** formularz i wyniki są opakowane w `q-card` z `q-card-section`
2. **Given** desktop (>1200px), **When** strona modułu bez propa `singleColumn`, **Then** formularz po lewej, wyniki + wykres po prawej (dwie kolumny). Moduły z `singleColumn` pozostają jednokolumnowe
3. **Given** mobile (<600px), **When** strona modułu, **Then** jedna kolumna: formularz → wyniki → wykres
4. **Given** `ModulePageLayout`, **When** wyświetlany, **Then** max-width 1200px zamiast hardcodowanego 800px
5. **Given** `SectionHeader`, **When** wyświetlany, **Then** używa semantycznego `<h2>`/`<h3>` z odpowiednią stylizacją

---

### Scenario 5 — Nowoczesne formularze (Priority: P2)

Pola formularzy mają spójny wygląd (`outlined` lub `filled` variant), ikony, hints. Przycisk "Oblicz" jest nowoczesny (filled z zaokrągleniem). Disclaimer jest dyskretny (mniejszy tekst, collapsible).

**Priority Justification**: Formularze to główny punkt interakcji — muszą być estetyczne i intuicyjne, ale nie blokują MVP.

**Acceptance Criteria**:

1. **Given** formularz modułu, **When** wyświetlany, **Then** pola `q-input` mają variant `outlined`
2. **Given** przycisk "Oblicz", **When** wyświetlany, **Then** ma nowoczesny wygląd (zaokrąglone rogi, wyrazisty kolor z design tokens)
3. **Given** disclaimer pod przyciskiem, **When** widoczny, **Then** jest dyskretny (mniejszy tekst, opcjonalnie zwinięty)

---

### Scenario 6 — Nowoczesne wyniki i wykresy (Priority: P2)

Wyniki są wyświetlane z użyciem `q-item`/`q-list`. Highlighted rows mają gradient lub kolor tła. Wykresy kołowe zamienione na donut, z animacjami i interaktywnymi tooltipami. Wykresy są responsywne.

**Priority Justification**: Wyniki i wykresy uzupełniają doświadczenie po obliczeniu — ważne, ale drugorzędne wobec layoutu.

**Acceptance Criteria**:

1. **Given** lista wyników, **When** wyświetlana, **Then** używa `q-item`/`q-list` zamiast custom `<div>`
2. **Given** wyróżniony wiersz, **When** wyświetlany, **Then** ma gradient lub kolor tła z design tokens
3. **Given** wykres kołowy, **When** wyświetlany, **Then** renderuje się jako donut chart z animacją wejścia
4. **Given** wykres, **When** hover na segmencie, **Then** wyświetla interaktywny tooltip z danymi
5. **Given** zmiana rozmiaru okna, **When** wykres wyświetlany, **Then** automatycznie dopasowuje rozmiar

---

### Scenario 7 — Nawigacja i mikro-interakcje (Priority: P2)

Po kliknięciu "Oblicz" strona płynnie scrolluje do wyników. Widoczny jest przycisk "Powrót na górę". Lazy-loaded moduły mają skeleton loader. Przejścia między stronami mają subtelne animacje.

**Priority Justification**: Mikro-interakcje podnoszą perceived quality, ale nie blokują funkcjonalności.

**Acceptance Criteria**:

1. **Given** kliknięcie "Oblicz", **When** wyniki wyświetlone, **Then** strona płynnie scrolluje do sekcji wyników
2. **Given** przewinięcie w dół, **When** użytkownik jest poniżej fold, **Then** widoczny przycisk `q-page-sticky` "Powrót na górę"
3. **Given** nawigacja do lazy-loaded modułu, **When** ładowanie trwa, **Then** wyświetlany jest skeleton loader
4. **Given** zmiana strony, **When** nawigacja, **Then** animacja przejścia fade + subtle scale (opacity 0→1, scale 0.95→1.0, ~200ms)

---

### Scenario 8 — Design Tokens: typografia i spacing (Priority: P1) 🎯 MVP

Rozszerzenie istniejącego systemu design tokens o spacing i border-radius. Ujednolicenie typografii we wszystkich komponentach.

**Priority Justification**: Bez ujednoliconego spacing i typografii nowy UI będzie niespójny — to fundament przed pozostałymi zmianami wizualnymi.

**Acceptance Criteria**:

1. **Given** plik `_design-tokens.scss`, **When** rozszerzony, **Then** zawiera CSS custom properties: `--space-xs` (4px), `--space-sm` (8px), `--space-md` (16px), `--space-lg` (24px), `--space-xl` (32px)
2. **Given** plik `_design-tokens.scss`, **When** rozszerzony, **Then** zawiera CSS custom properties: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (16px)
3. **Given** komponenty, **When** wyświetlane, **Then** typografia jest spójna — użycie Quasar typography classes konsystentnie
4. **Given** nowe tokeny, **When** komponent je konsumuje, **Then** wygląda tak samo w light i dark mode

---

### Scenario 9 — Nowy design ikony aplikacji i branding (Priority: P1) 🎯 MVP

Całkowity redesign ikony aplikacji — nowy kształt, nowe kolory zgodne z design tokens (`--color-primary: #1565C0`), nowoczesny styl. Nowa ikona jest źródłem (SVG), z którego generowane są wszystkie warianty: favicony, ikony PWA, ikony Apple, ikony Android/Capacitor, splash screeny, safari pinned tab. Manifest PWA i konfiguracja Capacitor używają nowych kolorów.

**Priority Justification**: Ikona to twarz aplikacji — widoczna w zakładce przeglądarki, na ekranie głównym telefonu, w sklepie Google Play. Stara czerwona ikona (#D12425) jest niespójna z nowym niebieskim UI (#1565C0).

**Independent Test**: Zainstalować PWA na telefonie i desktopie, otworzyć w przeglądarce — zweryfikować ikonę w zakładce, na ekranie głównym, w splash screenie. Zbudować APK i zweryfikować ikonę na Androidzie.

**Acceptance Criteria**:

1. **Given** nowy SVG źródłowy (`app-icon.svg`), **When** zaprojektowany, **Then** używa kolorów z design tokens (primary `#1565C0` jako dominujący), ma nowoczesny, czysty styl i zachowuje rozpoznawalność kalkulatora finansowego (motyw PIT/VAT/+/%)
2. **Given** nowy SVG, **When** wygenerowane warianty, **Then** istnieją wszystkie wymagane rozmiary PNG: favicony (16, 32, 96, 128, 512), ikony PWA (128, 192, 256, 384, 512), ikony Apple (120, 152, 167, 180), MS icon (144)
3. **Given** nowy SVG, **When** wygenerowane, **Then** `favicon.ico` w `public/` jest zaktualizowany
4. **Given** nowy SVG, **When** wygenerowane, **Then** `safari-pinned-tab.svg` jest zaktualizowany
5. **Given** nowa ikona, **When** PWA manifest, **Then** `background_color` i `theme_color` w `manifest.json` używają nowego koloru primary
6. **Given** nowa ikona, **When** build Capacitor iOS, **Then** `AppIcon.appiconset` zawiera nowe ikony we wszystkich wymaganych rozmiarach
7. **Given** nowa ikona, **When** build Capacitor Android, **Then** ikony launchera (mipmap) zawierają nowe ikony
8. **Given** Apple launch screens, **When** wygenerowane, **Then** splash screeny (10 rozmiarów) używają nowych kolorów
9. **Given** iOS splash screen, **When** wygenerowane, **Then** `Splash.imageset` zawiera nowe splash screeny
10. **Given** `src/assets/favicon-512x512.png`, **When** zaktualizowany, **Then** zgodny z nowym designem

---

### Edge Cases

- Ekstremalnie wąski ekran (320px) — czy formularze się nie "rozjeżdżają"?
- Ultra-wide (3840px) — czy content ma ograniczenie max-width?
- Drawer z wieloma sekcjami — czy scrollowanie wewnątrz drawera działa poprawnie?
- Wolne połączenie — czy skeleton loader jest widoczny wystarczająco długo?
- Dark mode — czy nowe karty, cienie i gradienty wyglądają dobrze w ciemnym motywie?
- Istniejące 29 modułów — czy zmiany w `ModulePageLayout`, `SectionHeader`, `ListRow` nie psują żadnego z nich?
- Menu search — czy filtrowanie nadal działa po migracji na `q-expansion-item`?
- Ikona na ciemnym tle (Android/iOS dark mode home screen) — czy nowa ikona jest czytelna?
- Ikona w małym rozmiarze (16x16 favicon) — czy detale są widoczne?
- Maskable icon (Android adaptive icon) — czy ikona dobrze wygląda w bezpiecznej strefie (safe zone)?

---

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Aplikacja MUSI mieć responsywny layout z breakpointami: mobile (<600px), tablet (600–1200px), desktop (>1200px), ultra-wide (>2560px). Na desktop (>1200px) sidebar MUSI być persistent (stały, nie overlay). Hamburger menu widoczny tylko na mobile/tablet
- **FR-002**: Strona główna MUSI wyświetlać dashboard z hero section i responsywną siatką kafelków modułów z 6 sekcji (Firma, Podatki, Praca, Oszczędzanie, Waluty, Informacje). Sekcja "Aplikacja" NIE jest wyświetlana jako kafelki
- **FR-003**: Header MUSI być zawsze widoczny (na każdej stronie). MUSI zawierać logo (link do `/`), przełącznik motywu i hamburger menu (mobile). Breadcrumbs widoczne na stronach modułów, ukryte na stronie głównej (`/`)
- **FR-004**: Sidebar/drawer MUSI używać `q-expansion-item` per sekcja menu, z ikonami sekcji
- **FR-005**: Sidebar MUSI zawierać pole wyszukiwania z filtrowaniem w czasie rzeczywistym
- **FR-006**: Sidebar MUSI mieć stopkę z wersją aplikacji i przyciskiem "Wesprzyj projekt"
- **FR-033**: Sidebar MUSI mieć sekcję "Ostatnio używane" na górze (domyślnie rozwinięta), z maks. 5 linkami do ostatnio odwiedzonych modułów (persystencja w localStorage). Sekcja ukryta przy braku historii (pierwsza wizyta). Sekcja z aktualnie wybranym modułem MUSI być automatycznie rozwinięta, pozostałe zwinięte
- **FR-007**: `ModulePageLayout` MUSI używać `q-card` z `q-card-section` i max-width 1200px (zamiast obecnego 800px)
- **FR-008**: Na desktopie (>1200px) `ModulePageLayout` MUSI domyślnie renderować layout dwukolumnowy (formularz | wyniki). Prop `singleColumn` wyłącza dwukolumnowy layout dla modułów z niestandardową strukturą
- **FR-009**: `SectionHeader` MUSI używać semantycznego heading (`<h2>`/`<h3>`) z propem `level`
- **FR-010**: `ListRow` MUSI używać `q-item`/`q-list` zamiast custom `<div>` — z zachowaniem obecnego API (props: `name`, `value`, `inline`, `nested`)
- **FR-011**: Pola formularzy MUSZĄ mieć variant `outlined` w całej aplikacji
- **FR-012**: Przycisk "Oblicz" MUSI mieć nowoczesny wygląd (zaokrąglone rogi, wypełniony kolor)
- **FR-013**: Wykresy kołowe MUSZĄ być renderowane jako donut chart z animacjami wejścia
- **FR-014**: Wykresy MUSZĄ być responsywne (auto-resize)
- **FR-015**: Wykresy MUSZĄ mieć interaktywne tooltips
- **FR-016**: Po kliknięciu "Oblicz" strona MUSI płynnie scrollować do wyników
- **FR-017**: Aplikacja MUSI wyświetlać przycisk "Powrót na górę" (scroll-to-top) po przewinięciu
- **FR-018**: Lazy-loaded moduły MUSZĄ wyświetlać skeleton loader podczas ładowania
- **FR-019**: Przejścia między stronami MUSZĄ mieć animację fade + subtle scale (opacity 0→1, scale 0.95→1.0, ~200ms)
- **FR-020**: Wszystkie teksty UI MUSZĄ być w języku polskim
- **FR-021**: UI MUSI używać komponentów Quasar
- **FR-022**: Nowe CSS custom properties MUSZĄ być dodane do `_design-tokens.scss`: spacing (`--space-xs/sm/md/lg/xl`) i border-radius (`--radius-sm/md/lg`)
- **FR-023**: Wszystkie zmiany wizualne MUSZĄ działać poprawnie w light i dark mode
- **FR-024**: Żadna istniejąca logika obliczeniowa NIE MOŻE zostać zmieniona
- **FR-025**: Wszystkie 410+ istniejących testów MUSI przechodzić po zmianach
- **FR-026**: Ikona aplikacji (`app-icon.svg`) MUSI zostać przeprojektowana z nowymi kolorami z design tokens i nowoczesnym stylem
- **FR-027**: Ze źródłowego SVG MUSZĄ być wygenerowane wszystkie warianty PNG: favicony (16, 32, 96, 128, 512), PWA (128, 192, 256, 384, 512), Apple (120, 152, 167, 180), MS (144)
- **FR-028**: `manifest.json` MUSI mieć zaktualizowane `background_color` i `theme_color` na nowy kolor primary
- **FR-029**: `favicon.ico` i `safari-pinned-tab.svg` MUSZĄ być zaktualizowane
- **FR-030**: Ikony Capacitor iOS (`AppIcon.appiconset`) i splash screeny (`Splash.imageset`) MUSZĄ być zaktualizowane
- **FR-031**: Apple launch screeny (10 rozmiarów w `public/icons/`) MUSZĄ być zaktualizowane
- **FR-032**: `src/assets/favicon-512x512.png` MUSI być zaktualizowany

### Key Entities

- **MainLayout**: Główny layout aplikacji — header, sidebar/drawer, page-container. Odpowiada za responsywność na poziomie ramki.
- **Dashboard (Index.vue)**: Strona główna — hero section + siatka kafelków modułów.
- **ModulePageLayout**: Wrapper stron modułów — karty, max-width, podział kolumn.
- **SectionHeader**: Nagłówek sekcji (formularz/wyniki) — semantyczny heading + brand color.
- **ListRow**: Wiersz wynikowy — migracja na `q-item`/`q-list`.
- **SubmitButton**: Przycisk "Oblicz" + disclaimer.
- **Menu**: Nawigacja — migracja na `q-expansion-item` z ikonami.
- **Design Tokens**: Rozszerzenie `_design-tokens.scss` o spacing i border-radius.
- **Chart.vue**: Wykresy — donut, animacje, tooltips, responsywność.
- **App Icon**: Ikona aplikacji — źródłowy SVG + wszystkie warianty PNG/ICO dla PWA, Apple, Android, favicon. Łącznie ~40 plików.

---

## Assumptions

- Nie zmieniamy routingu — wszystkie URL-e modułów pozostają bez zmian
- Nie zmieniamy logiki obliczeniowej — jedynie warstwa prezentacji
- Istniejące design tokens kolorów (z Milestone 2.6) są ostateczne — jedynie drobne korekty jeśli nowy layout wymaga
- Smooth scroll do wyników już częściowo istnieje (`useScrollToResults` composable) — rozszerzamy, nie duplikujemy
- Kafelki na dashboardzie używają danych z `menuItems.ts` — nie tworzymy drugiego źródła danych
- Skeleton loader używa wbudowanego `q-skeleton` z Quasar
- Animacje przejść używają `<transition>` z Vue / Quasar transitions
- Breakpointy są zgodne z Quasar breakpoints (`$breakpoint-xs`, `$breakpoint-sm`, itd.)
- Nowa ikona zachowuje motyw kalkulatora finansowego (PIT, VAT, +, %) — zmienia kolory i styl, nie koncepcję
- Generowanie wariantów PNG z SVG odbywa się narzędziem (np. Inkscape CLI, sharp, lub ręcznie) — nie jest częścią procesu build
- Pliki w `src-capacitor/www/` są build output i nie wymagają ręcznej aktualizacji — generują się z `public/`

---

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Layout jest poprawny na 5 breakpointach: 320px, 768px, 1024px, 1440px, 2560px
- **SC-002**: Strona główna wyświetla wszystkie moduły (29+) w responsywnej siatce kafelków
- **SC-003**: Drawer/sidebar z `q-expansion-item` umożliwia nawigację do wszystkich modułów
- **SC-004**: Wszystkie istniejące testy (410+) przechodzą bez modyfikacji logiki
- **SC-005**: Dark mode działa poprawnie z nowymi komponentami (karty, gradienty, cienie)
- **SC-006**: Wykresy donut renderują się poprawnie we wszystkich modułach używających wykresów kołowych
- **SC-007**: Smooth scroll do wyników działa we wszystkich modułach
- **SC-008**: Skeleton loader jest widoczny podczas lazy-loading modułów
- **SC-009**: Czas interakcji (First Input Delay) nie pogarsza się po zmianach — brak nowego ciężkiego JS
- **SC-010**: Nowa ikona jest widoczna i czytelna w zakładce przeglądarki (favicon 16x16, 32x32)
- **SC-011**: PWA zainstalowane na telefonie wyświetla nową ikonę na ekranie głównym
- **SC-012**: `manifest.json` `theme_color` jest zgodny z nowym primary color
