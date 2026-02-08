# Feature Specification: Redesign Landing Page

**Branch**: `018-landing-page-redesign`  
**Created**: 2026-02-08  
**Status**: Clarified  
**Input**: User description: "W katalogu landing-page/ jest stara wersja landing page. Zaktualizuj landing page pod nowy wygląd aplikacji. Landing Page ma zachęcać do korzystania z aplikacji i opisywać najważniejsze funkcje aplikacji. Stwórz mockupy ze screenshotami z modułów aplikacji. Zadbaj o nowoczesny UI/UX. Strona musi spełniać normy WCAG, być zoptymalizowana do szybkiego wczytywania i SEO. Zadbaj o odpowiednie meta tagi, w tym social media tagi — tagi powinny być spójne z tagami samej aplikacji."

## Clarifications

### Session 2026-02-08

- Q: Jaki layout prezentacji modułów? → A: Hybrydowy — 3-4 najważniejsze moduły jako duże sekcje pełnej szerokości (tekst + screenshot), reszta w gridzie kart
- Q: Co zrobić ze starymi plikami landing page? → A: Zachować `contact.php` (używany przez formularz kontaktowy w aplikacji), `ads.txt` i `.htaccess`. Usunąć resztę starych plików (PHP, stary CSS, stare screenshoty)
- Q: Źródło screenshotów modułów? → A: Automatyczne screenshoty via MCP Chrome DevTools. Mockupy muszą być wyraźne i czytelne na PC, Android i iOS
- Q: Co wyświetlić w hero section obok tekstu? → A: Screenshot aplikacji w ramce urządzenia (device mockup)
- Q: Dodatkowe sekcje na landing page? → A: Dodać sekcję z kluczowymi liczbami/statystykami (np. „20+ kalkulatorów”, „Darmowa aplikacja”, „Aktualne stawki 2026”) ORAZ sekcję FAQ
- Q: Podejście do CSS? → A: Tailwind CSS via standalone CLI (build-time, output to static CSS)
- Q: Kolejność sekcji na stronie? → A: Hero → Statystyki/social proof → 4 główne moduły (pełna szerokość) → Grid pozostałych modułów → FAQ → CTA końcowe → Stopka
- Q: Nawigacja na stronie? → A: Prosta sticky nawigacja: logo po lewej + przycisk CTA „Przejdź do kalkulatora” po prawej (bez linków do sekcji)

## User Scenarios _(required)_

### Scenario 1 — Nowy użytkownik odkrywa stronę (Priority: P1) 🎯 MVP

Potencjalny użytkownik trafia na stronę główną `kalkulatorfinansowy.app` z wyszukiwarki Google lub mediów społecznościowych. Widzi nowoczesną, atrakcyjną stronę z jasnym przekazem wartości aplikacji, screenshotami z modułów i przyciskami CTA prowadzącymi do aplikacji webowej oraz Google Play.

**Priority Justification**: Główny cel landing page — konwersja odwiedzających w użytkowników.

**Independent Test**: Otworzyć stronę w przeglądarce i zweryfikować, że hero section, sekcje modułów, CTA i stopka wyświetlają się poprawnie.

**Acceptance Criteria**:

1. **Given** użytkownik otwiera stronę główną, **When** strona się załaduje, **Then** widoczna jest sekcja hero z nazwą aplikacji, krótkim opisem wartości i przyciskami CTA (aplikacja webowa + Google Play)
2. **Given** użytkownik przewija stronę, **When** dochodzi do sekcji modułów, **Then** widzi karty/sekcje z opisami najważniejszych modułów aplikacji wraz ze screenshotami/mockupami
3. **Given** użytkownik klika przycisk CTA „Przejdź do kalkulatora", **When** nastąpi przekierowanie, **Then** trafia na `https://kalkulatorfinansowy.app/app/`
4. **Given** użytkownik klika przycisk CTA „Pobierz w Google Play", **When** nastąpi przekierowanie, **Then** trafia na stronę aplikacji w Google Play

---

### Scenario 2 — Responsywność i dostępność (Priority: P1) 🎯 MVP

Użytkownik otwiera stronę na różnych urządzeniach (telefon, tablet, desktop) oraz korzysta z technologii asystujących (czytnik ekranu, nawigacja klawiaturą).

**Priority Justification**: Strona musi być dostępna dla wszystkich użytkowników i wyglądać dobrze na każdym urządzeniu.

**Acceptance Criteria**:

1. **Given** użytkownik otwiera stronę na telefonie (viewport 375px), **When** strona się załaduje, **Then** layout jest jednokolumnowy, tekst czytelny, przyciski mają odpowiedni rozmiar dotyku (min. 44x44px)
2. **Given** użytkownik otwiera stronę na tablecie (viewport 768px), **When** strona się załaduje, **Then** layout dostosowuje się do szerszego ekranu
3. **Given** użytkownik otwiera stronę na desktopie (viewport 1440px), **When** strona się załaduje, **Then** layout jest dwukolumnowy z odpowiednimi proporcjami tekstu i obrazów
4. **Given** użytkownik nawiguje klawiaturą (Tab), **When** przechodzi przez elementy interaktywne, **Then** każdy element ma widoczny focus indicator i logiczną kolejność
5. **Given** użytkownik korzysta z czytnika ekranu, **When** czyta stronę, **Then** wszystkie obrazy mają alt text, nagłówki tworzą logiczną hierarchię (h1→h2→h3), a linki mają opisowe etykiety

---

### Scenario 3 — SEO i meta tagi (Priority: P1) 🎯 MVP

Wyszukiwarka Google indeksuje stronę. Użytkownik udostępnia link do strony w mediach społecznościowych (Facebook, Twitter/X, LinkedIn).

**Priority Justification**: SEO i social sharing to kluczowe kanały pozyskiwania użytkowników.

**Acceptance Criteria**:

1. **Given** crawler Google odwiedza stronę, **When** analizuje HTML, **Then** znajduje poprawne meta tagi: title, description, canonical URL, robots, lang, charset
2. **Given** użytkownik udostępnia link na Facebooku, **When** Facebook pobiera metadane, **Then** wyświetla poprawny tytuł, opis i obraz OG (Open Graph) — spójne z tagami aplikacji
3. **Given** użytkownik udostępnia link na Twitterze/X, **When** Twitter pobiera metadane, **Then** wyświetla kartę summary_large_image z poprawnym tytułem, opisem i obrazem
4. **Given** strona jest analizowana narzędziem SEO, **When** sprawdzane są dane strukturalne, **Then** strona zawiera JSON-LD schema.org (typ: SoftwareApplication) z nazwą, opisem, oceną i linkami
5. **Given** meta tagi landing page, **When** porównane z meta tagami aplikacji (`index.html`), **Then** są spójne: ten sam `og:site_name`, zbliżony `og:description`, ten sam `og:image` format, ten sam `theme_color` (#1565C0)

---

### Scenario 4 — Szybkie ładowanie strony (Priority: P1) 🎯 MVP

Użytkownik otwiera stronę na wolnym połączeniu mobilnym (3G).

**Priority Justification**: Szybkość ładowania wpływa na SEO (Core Web Vitals) i konwersję.

**Acceptance Criteria**:

1. **Given** strona jest testowana w Lighthouse, **When** analiza się zakończy, **Then** wynik Performance ≥ 90
2. **Given** strona jest testowana w Lighthouse, **When** analiza się zakończy, **Then** wynik Accessibility ≥ 95
3. **Given** strona jest testowana w Lighthouse, **When** analiza się zakończy, **Then** wynik SEO ≥ 95
4. **Given** strona jest testowana w Lighthouse, **When** analiza się zakończy, **Then** wynik Best Practices ≥ 90
5. **Given** strona ładuje się na połączeniu 3G, **When** mierzony jest LCP (Largest Contentful Paint), **Then** LCP < 2.5s
6. **Given** strona ładuje się, **When** mierzony jest CLS (Cumulative Layout Shift), **Then** CLS < 0.1

---

### Scenario 5 — Nowoczesny design i dark mode (Priority: P2)

Strona prezentuje nowoczesny, profesjonalny wygląd spójny z aktualnym designem aplikacji. Obsługuje preferencje kolorystyczne użytkownika.

**Priority Justification**: Spójność wizualna z aplikacją buduje zaufanie, ale nie blokuje funkcjonalności.

**Acceptance Criteria**:

1. **Given** użytkownik ma ustawiony system na dark mode, **When** otwiera stronę, **Then** strona wyświetla się w ciemnym motywie (prefers-color-scheme: dark)
2. **Given** użytkownik ma ustawiony system na light mode, **When** otwiera stronę, **Then** strona wyświetla się w jasnym motywie
3. **Given** strona jest wyświetlana, **When** użytkownik porównuje ją z aplikacją, **Then** kolorystyka, typografia i styl są spójne (primary color: #1565C0, font: Roboto lub systemowy)

---

### Scenario 6 — Sekcja z listą modułów i mockupami (Priority: P1) 🎯 MVP

Użytkownik przegląda stronę i widzi prezentację najważniejszych modułów aplikacji z mockupami/screenshotami.

**Priority Justification**: Screenshoty budują zaufanie i pokazują wartość aplikacji.

**Acceptance Criteria**:

1. **Given** użytkownik przewija stronę, **When** dochodzi do sekcji modułów, **Then** widzi co najmniej 8 najważniejszych modułów: Samozatrudnienie (B2B), Porównywarka B2B, Umowa o pracę, Umowa zlecenie, Umowa o dzieło, Faktura VAT, Kursy walut, Działalność niezarejestrowana
2. **Given** każdy moduł w sekcji, **When** jest wyświetlany, **Then** zawiera: nazwę modułu, krótki opis (1-2 zdania), screenshot/mockup z aktualnego wyglądu aplikacji
3. **Given** sekcja modułów jest wyświetlana, **When** użytkownik ją przegląda, **Then** 3-4 najważniejsze moduły (Samozatrudnienie, Porównywarka B2B, Umowa o pracę, Kalkulator IKE) są prezentowane jako duże sekcje pełnej szerokości (tekst + screenshot), a pozostałe moduły wyświetlane są w gridzie kart
4. **Given** screenshoty modułów, **When** są ładowane, **Then** używają lazy loading i formatu WebP z fallbackiem na PNG
5. **Given** screenshoty modułów, **When** są wyświetlane na mobile, **Then** są odpowiednio skalowane i nie powodują horizontal scroll

---

### Scenario 7 — Stopka i informacje o autorze (Priority: P2)

Użytkownik przewija na dół strony i widzi informacje o autorze projektu, link do wsparcia (BuyCoffee) i linki kontaktowe.

**Priority Justification**: Buduje wiarygodność, ale nie jest krytyczne dla konwersji.

**Acceptance Criteria**:

1. **Given** użytkownik przewija na dół strony, **When** dochodzi do stopki, **Then** widzi informacje o autorze (Łukasz Socha), link do LinkedIn, link do wsparcia projektu (BuyCoffee)
2. **Given** stopka jest wyświetlana, **When** użytkownik sprawdza, **Then** zawiera rok bieżący w copyright

---

### Edge Cases

- Co jeśli użytkownik ma wyłączony JavaScript? Strona powinna być w pełni funkcjonalna jako statyczny HTML/CSS.
- Co jeśli obrazy nie załadują się? Alt text musi opisywać zawartość screenshota.
- Co jeśli użytkownik ma bardzo wąski viewport (<320px)? Layout nie powinien się rozjeżdżać.
- Co jeśli użytkownik korzysta z trybu wysokiego kontrastu (Windows High Contrast Mode)? Elementy interaktywne muszą być widoczne.

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Landing page MUSI być statyczną stroną HTML/CSS/JS (bez PHP, bez frameworków backendowych) — gotową do hostowania jako pliki statyczne
- **FR-002**: Landing page MUSI zawierać sekcję hero z nazwą aplikacji, opisem wartości i przyciskami CTA. Obok tekstu wyświetlany jest screenshot aplikacji w ramce urządzenia (device mockup — phone/laptop)
- **FR-003**: Landing page MUSI zawierać sekcje prezentujące co najmniej 8 najważniejszych modułów aplikacji z opisami i screenshotami/mockupami. Layout hybrydowy: 3-4 najważniejsze moduły (Samozatrudnienie, Porównywarka B2B, Umowa o pracę, Kalkulator IKE) jako duże sekcje pełnej szerokości (tekst + screenshot naprzemiennie), pozostałe moduły w gridzie kart (2-3 kolumny desktop, 1 kolumna mobile)
- **FR-004**: Landing page MUSI zawierać stopkę z informacjami o autorze, linkiem do LinkedIn i linkiem do wsparcia (BuyCoffee)
- **FR-005**: Landing page MUSI zawierać końcową sekcję CTA zachęcającą do przejścia do aplikacji
- **FR-009**: Landing page MUSI zawierać sekcję z kluczowymi liczbami/statystykami (np. „20+ kalkulatorów”, „Darmowa aplikacja”, „Aktualne stawki 2026”) — social proof budujący zaufanie
- **FR-010**: Landing page MUSI zawierać sekcję FAQ z najczęściej zadawanymi pytaniami (korzystne dla SEO, schema.org FAQPage)
- **FR-006**: Wszystkie teksty na stronie MUSZĄ być w języku polskim
- **FR-007**: Landing page MUSI być umieszczona w katalogu `landing-page/` (zastępując starą wersję). Zachować pliki: `contact.php` (używany przez formularz kontaktowy aplikacji), `ads.txt`, `.htaccess`. Usunąć pozostałe stare pliki: `share.php`, `inflation.php`, `error.php`, stary CSS, stare screenshoty
- **FR-008**: Landing page MUSI linkować do aplikacji webowej pod adresem `https://kalkulatorfinansowy.app/app/` oraz do Google Play
- **FR-011**: Kolejność sekcji na stronie (od góry): 1) Hero, 2) Statystyki/social proof, 3) 4 główne moduły (pełna szerokość, naprzemiennie: Samozatrudnienie, Porównywarka B2B, Umowa o pracę, Kalkulator IKE), 4) Grid pozostałych modułów, 5) FAQ, 6) CTA końcowe, 7) Stopka
- **FR-012**: Landing page MUSI zawierać prostą sticky nawigację u góry: logo/nazwa aplikacji po lewej + przycisk CTA „Przejdź do kalkulatora” po prawej. Bez linków do sekcji

### Wymagania SEO

- **SEO-001**: Strona MUSI zawierać poprawne meta tagi: `<title>`, `<meta name="description">`, `<meta name="robots">`, `<link rel="canonical">`
- **SEO-002**: Strona MUSI zawierać Open Graph meta tagi: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name` — spójne z tagami aplikacji
- **SEO-003**: Strona MUSI zawierać Twitter Card meta tagi: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
- **SEO-004**: Strona MUSI zawierać dane strukturalne JSON-LD (schema.org) typu `SoftwareApplication`
- **SEO-005**: Strona MUSI mieć poprawną hierarchię nagłówków: jeden `<h1>`, logiczne `<h2>` dla sekcji
- **SEO-006**: Strona MUSI zawierać `<html lang="pl">` i `<meta charset="utf-8">`
- **SEO-007**: Meta tagi landing page MUSZĄ być spójne z meta tagami aplikacji (ten sam `og:site_name`, zbliżony styl `og:description`, ten sam format `og:image`)

### Wymagania WCAG (poziom AA)

- **WCAG-001**: Kontrast tekstu do tła MUSI wynosić co najmniej 4.5:1 dla normalnego tekstu i 3:1 dla dużego tekstu (WCAG 2.1 SC 1.4.3)
- **WCAG-002**: Wszystkie obrazy MUSZĄ mieć opisowy atrybut `alt` (WCAG 2.1 SC 1.1.1)
- **WCAG-003**: Strona MUSI być w pełni nawigowalna klawiaturą z widocznym focus indicator (WCAG 2.1 SC 2.1.1, 2.4.7)
- **WCAG-004**: Elementy interaktywne (przyciski, linki) MUSZĄ mieć minimalny rozmiar dotyku 44x44px (WCAG 2.1 SC 2.5.5)
- **WCAG-005**: Nagłówki MUSZĄ tworzyć logiczną hierarchię (WCAG 2.1 SC 1.3.1)
- **WCAG-006**: Strona MUSI używać semantycznych elementów HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` (WCAG 2.1 SC 1.3.1)
- **WCAG-007**: Strona MUSI działać poprawnie przy powiększeniu do 200% (WCAG 2.1 SC 1.4.4)

### Wymagania wydajnościowe

- **PERF-001**: Obrazy MUSZĄ być w formacie WebP z fallbackiem na PNG/JPG
- **PERF-002**: Obrazy poniżej fold MUSZĄ używać `loading="lazy"`
- **PERF-003**: CSS MUSI być zminifikowany (Tailwind CSS standalone CLI z purge) i krytyczny CSS POWINIEN być inline
- **PERF-004**: Fonty MUSZĄ używać `font-display: swap` i być preloadowane
- **PERF-005**: Lighthouse Performance score MUSI wynosić ≥ 90
- **PERF-006**: Obrazy MUSZĄ mieć jawne atrybuty `width` i `height` aby zapobiec CLS

### Wymagania designu

- **DES-001**: Design MUSI być nowoczesny i spójny z aktualnym wyglądem aplikacji (primary color: #1565C0)
- **DES-002**: Strona MUSI być w pełni responsywna (mobile-first): 375px, 768px, 1024px, 1440px
- **DES-003**: Strona POWINNA obsługiwać dark mode via `prefers-color-scheme: dark`
- **DES-004**: Screenshoty/mockupy modułów MUSZĄ przedstawiać aktualny wygląd aplikacji. Generowane automatycznie via MCP Chrome DevTools. MUSZĄ być wyraźne i czytelne na urządzeniach PC, Android i iOS (odpowiednia rozdzielczość i skalowanie)
- **DES-005**: Typografia MUSI używać fontu Roboto (spójność z aplikacją) lub system font stack jako fallback

### Key Entities

- **Landing Page**: Statyczna strona HTML w katalogu `landing-page/`, punkt wejścia dla nowych użytkowników
- **Moduł aplikacji**: Funkcjonalność kalkulatora (np. Samozatrudnienie, Umowa o pracę), prezentowana jako karta z opisem i screenshotem
- **Screenshot/Mockup**: Obraz przedstawiający aktualny wygląd modułu aplikacji, w formacie WebP, zoptymalizowany pod wydajność
- **Meta tagi**: Zestaw tagów HTML (OG, Twitter, JSON-LD) zapewniających poprawne wyświetlanie w wyszukiwarkach i mediach społecznościowych
- **CTA (Call to Action)**: Przycisk/link zachęcający do przejścia do aplikacji webowej lub pobrania z Google Play

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: Lighthouse Performance score ≥ 90
- **SC-002**: Lighthouse Accessibility score ≥ 95
- **SC-003**: Lighthouse SEO score ≥ 95
- **SC-004**: Lighthouse Best Practices score ≥ 90
- **SC-005**: Strona wyświetla się poprawnie na viewportach: 375px, 768px, 1024px, 1440px
- **SC-006**: Wszystkie meta tagi (OG, Twitter, JSON-LD) są poprawne i spójne z tagami aplikacji
- **SC-007**: Strona jest w pełni nawigowalna klawiaturą
- **SC-008**: Kontrast kolorów spełnia WCAG AA (4.5:1 dla tekstu, 3:1 dla dużego tekstu)
- **SC-009**: Co najmniej 8 modułów aplikacji jest zaprezentowanych ze screenshotami
- **SC-010**: Strona działa bez JavaScript (treść widoczna, nawigacja funkcjonalna)
- **SC-011**: LCP < 2.5s na połączeniu 4G
- **SC-012**: CLS < 0.1

## Assumptions

- Screenshoty modułów zostaną wygenerowane automatycznie z działającej aplikacji za pomocą MCP Chrome DevTools (screenshot każdego modułu)
- Strona będzie hostowana pod domeną `kalkulatorfinansowy.app` (root), a aplikacja pod `/app/`
- Google Analytics/Tag Manager zostanie zachowany (migracja z UA na GTM-MKR8Z54 zgodnie z aktualną konfiguracją aplikacji)
- Obraz OG (`og:image`) będzie miał wymiary 1200x630px zgodnie ze standardem
- Strona nie wymaga backendu — jest w pełni statyczna (usunięcie zależności od PHP z obecnej wersji)
