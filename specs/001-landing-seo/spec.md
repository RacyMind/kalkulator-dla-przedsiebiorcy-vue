# Feature Specification: Landing Page SEO – poprawa widoczności w wyszukiwarkach i wzrost ruchu organicznego

**Branch**: `001-landing-seo`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "Przeanalizuj landing-page pod kątem SEO. Chcę znacznie poprawić SEO i ruch z organic search"

> **Zakres**: Specyfikacja dotyczy wyłącznie **landing page** (`landing-page/`). Aplikacja SPA (`/app/`) pozostaje bez zmian — nie modyfikujemy routingu, kodu ani struktury SPA.

## Clarifications

### Session 2026-02-08

- Q: Ile podstron tworzymy w MVP? (LP prezentuje 10 modułów, aplikacja 20+) → A: Tylko 6 z tabeli fraz kluczowych (B2B, UoP, zlecenie, dzieło, porównywarka, VAT). Pozostałe w kolejnej iteracji.
- Q: Czy podstrony dzielą ten sam layout co obecna strona główna LP? → A: Tak — ten sam nav, footer, kolorystyka, Tailwind + Roboto.
- Q: Kto pisze treść SEO na podstronach? → A: Treść generowana w ramach implementacji (AI/developer), do późniejszej rewizji.
- Q: Czy rozbudowujemy treść na stronie głównej LP? → A: Nie — strona główna jako hub nawigacyjny z krótkimi opisami + linkami do podstron. Unikamy kanibalizacji fraz kluczowych.

## Analiza obecnego stanu (audyt SEO)

### Co działa dobrze

- `lang="pl"`, viewport, charset poprawne
- Title tag z kluczowymi frazami
- Meta description z frazami + rok 2026
- Canonical URL ustawiony
- Open Graph + Twitter Cards kompletne
- JSON-LD: SoftwareApplication + FAQPage
- Semantyczny HTML (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- Alt texty na obrazach, width/height, lazy loading, WebP z fallbackiem PNG
- `fetchpriority="high"` na hero image

### Krytyczne problemy SEO

1. **Brak `sitemap.xml`** — Google nie ma mapy strony do indeksowania
2. **Brak `robots.txt`** — brak instrukcji dla crawlerów
3. **Brak dedykowanych podstron w landing page per kalkulator** — cały landing page to jeden URL (`/`), brak możliwości rankowania na long-tail keywords (np. „kalkulator B2B 2026", „kalkulator umowy o pracę netto"). Linki prowadzą bezpośrednio do SPA (`/app/#/...`), które Google nie indeksuje (hash routing) — ale to nie jest problem do rozwiązania po stronie SPA, lecz po stronie landing page: potrzebne są **statyczne podstrony HTML w `landing-page/`** z treścią SEO, które dopiero linkują do odpowiednich kalkulatorów w SPA
4. **Cienka treść (thin content)** — sekcje modułów to krótkie blurby marketingowe (2-3 zdania), brak wartościowej treści edukacyjnej
5. **Brak bloga / poradników** — brak contentu targetującego frazy informacyjne (np. „jak obliczyć wynagrodzenie netto", „jaka forma opodatkowania B2B")
6. **Brak `hreflang`** — brak sygnału językowego dla Google (minor, bo strona jest jednojęzyczna)
7. **Brak WebSite schema z SearchAction** — brak szansy na sitelinks search box w SERP
8. **Brak BreadcrumbList schema** — brak breadcrumbs w wynikach wyszukiwania
9. **Brak wewnętrznego linkowania** — landing page nie posiada crawlowalnych podstron, do których mógłby linkować

## User Scenarios _(required)_

### Scenario 1 – Dedykowane statyczne podstrony HTML w landing page per kalkulator (Priority: P1) 🎯 MVP

W katalogu `landing-page/` powstają nowe statyczne pliki HTML — po jednym dla każdego głównego kalkulatora (np. `landing-page/kalkulator-b2b/index.html`, `landing-page/kalkulator-umowa-o-prace/index.html`). Każda podstrona ma unikalny title, meta description, H1, rozbudowaną treść SEO i przycisk CTA linkujący do odpowiedniego kalkulatora w SPA (`/app/#/...`). Google indeksuje każdą podstronę osobno. Aplikacja SPA nie jest modyfikowana.

**Priority Justification**: Obecnie cały landing page to jeden URL (`/`). Dodanie statycznych podstron pozwoli rankować na long-tail keywords per kalkulator (np. „kalkulator B2B 2026") bez ingerencji w SPA.

**Independent Test**: Wpisać w Google `site:kalkulatorfinansowy.app` i zweryfikować, że pojawiają się dedykowane podstrony per kalkulator.

**Acceptance Criteria**:

1. **Given** landing page, **When** Google crawluje stronę, **Then** każdy główny kalkulator ma dedykowaną podstronę z unikalnym URL (statyczny HTML, bez hash fragmentów)
2. **Given** podstrona kalkulatora (np. `/kalkulator-b2b/`), **When** jest renderowana, **Then** zawiera: unikalny `<title>`, unikalny `<meta description>`, unikalny `<h1>`, treść SEO (min. 300 słów), przycisk CTA linkujący do kalkulatora w SPA (`/app/#/samozatrudnienie`), nawigację powrotną do strony głównej
3. **Given** podstrona kalkulatora, **When** Google ją indeksuje, **Then** podstrona ma własny canonical URL i nie duplikuje treści z głównej strony
4. **Given** strona główna landing page, **When** jest renderowana, **Then** sekcje kalkulatorów linkują do dedykowanych podstron landing page (oprócz istniejących linków do SPA)

---

### Scenario 2 – sitemap.xml i robots.txt (Priority: P1) 🎯 MVP

Landing page posiada plik `sitemap.xml` z listą wszystkich crawlowalnych URL-i oraz `robots.txt` z odniesieniem do sitemap i instrukcjami dla crawlerów.

**Priority Justification**: Sitemap i robots.txt to podstawowe pliki wymagane przez wyszukiwarki do efektywnego crawlowania i indeksowania.

**Independent Test**: Otworzyć `https://kalkulatorfinansowy.app/sitemap.xml` i `https://kalkulatorfinansowy.app/robots.txt` w przeglądarce i zweryfikować poprawność.

**Acceptance Criteria**:

1. **Given** domena `kalkulatorfinansowy.app`, **When** crawler żąda `/robots.txt`, **Then** otrzymuje poprawny plik z `User-agent: *`, `Allow: /`, `Sitemap: https://kalkulatorfinansowy.app/sitemap.xml`
2. **Given** domena `kalkulatorfinansowy.app`, **When** crawler żąda `/sitemap.xml`, **Then** otrzymuje poprawny XML sitemap z listą wszystkich podstron, datami `lastmod` i priorytetami
3. **Given** sitemap.xml, **When** jest walidowany, **Then** jest zgodny ze standardem sitemaps.org

---

### Scenario 3 – Rozbudowana treść SEO na podstronach (Priority: P1) 🎯 MVP

Każda podstrona kalkulatora zawiera wartościową treść edukacyjną (min. 300 słów) targetującą konkretne frazy kluczowe. Treść odpowiada na pytania użytkowników i zawiera naturalne użycie fraz kluczowych.

**Priority Justification**: Treść jest głównym czynnikiem rankingowym Google. Bez wartościowej, unikalnej treści podstrony nie będą rankować na konkurencyjne frazy.

**Independent Test**: Sprawdzić każdą podstronę pod kątem: unikalności treści, gęstości fraz kluczowych, czytelności, odpowiedzi na intencję wyszukiwania.

**Acceptance Criteria**:

1. **Given** podstrona kalkulatora B2B, **When** użytkownik ją odwiedza, **Then** znajduje treść wyjaśniającą: czym jest samozatrudnienie B2B, jakie są formy opodatkowania, jak obliczyć wynagrodzenie netto, aktualne stawki ZUS 2026
2. **Given** podstrona kalkulatora umowy o pracę, **When** użytkownik ją odwiedza, **Then** znajduje treść wyjaśniającą: jak obliczyć netto z brutto, jakie składki ZUS płaci pracownik, czym jest kwota wolna od podatku, koszty pracodawcy
3. **Given** każda podstrona, **When** jest analizowana, **Then** treść zawiera min. 300 słów unikalnego tekstu, nagłówki H2/H3 z frazami kluczowymi, listy wypunktowane, odpowiedzi na pytania użytkowników
4. **Given** każda podstrona, **When** jest porównywana z innymi, **Then** treść jest unikalna (brak duplikacji między podstronami)

---

### Scenario 4 – Dodatkowe dane strukturalne (Priority: P2)

Landing page i podstrony zawierają rozszerzone dane strukturalne JSON-LD: WebSite z SearchAction, BreadcrumbList, oraz HowTo schema na podstronach kalkulatorów.

**Priority Justification**: Dane strukturalne zwiększają CTR w SERP dzięki rich snippets (breadcrumbs, sitelinks search box, how-to steps).

**Independent Test**: Wkleić URL w Google Rich Results Test i zweryfikować poprawność danych strukturalnych.

**Acceptance Criteria**:

1. **Given** strona główna, **When** Google ją crawluje, **Then** zawiera JSON-LD `WebSite` z `potentialAction` typu `SearchAction`
2. **Given** podstrona kalkulatora, **When** Google ją crawluje, **Then** zawiera JSON-LD `BreadcrumbList` z poprawną hierarchią (Strona główna > Kalkulator X)
3. **Given** podstrona kalkulatora, **When** Google ją crawluje, **Then** zawiera JSON-LD `HowTo` opisujący kroki użycia kalkulatora
4. **Given** wszystkie dane strukturalne, **When** są walidowane w Rich Results Test, **Then** nie ma błędów ani ostrzeżeń

---

### Scenario 5 – Wewnętrzne linkowanie i nawigacja (Priority: P2)

Landing page posiada rozbudowaną nawigację z linkami do wszystkich podstron kalkulatorów. Podstrony linkują do siebie nawzajem (cross-linking) i do strony głównej. Footer zawiera pełną mapę strony.

**Priority Justification**: Wewnętrzne linkowanie rozprowadza „link juice" i pomaga Google zrozumieć strukturę strony. Brak cross-linkingu osłabia ranking podstron.

**Independent Test**: Przejść przez stronę i zweryfikować, że każda podstrona jest osiągalna z nawigacji i ma linki do powiązanych kalkulatorów.

**Acceptance Criteria**:

1. **Given** nawigacja na landing page, **When** użytkownik ją przegląda, **Then** widzi linki do wszystkich głównych podstron kalkulatorów
2. **Given** podstrona kalkulatora, **When** użytkownik ją przegląda, **Then** widzi sekcję „Powiązane kalkulatory" z linkami do 2-3 powiązanych podstron
3. **Given** footer na każdej stronie, **When** użytkownik go przegląda, **Then** widzi pełną mapę strony z linkami do wszystkich podstron
4. **Given** dowolna podstrona, **When** użytkownik chce wrócić na stronę główną, **Then** może to zrobić jednym kliknięciem z nawigacji

---

### Scenario 6 – Optymalizacja Core Web Vitals (Priority: P3)

Landing page i podstrony osiągają dobre wyniki Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1) mierzone w PageSpeed Insights.

**Priority Justification**: Core Web Vitals to czynnik rankingowy Google od 2021. Dobra wydajność poprawia zarówno ranking jak i doświadczenie użytkownika.

**Independent Test**: Uruchomić PageSpeed Insights dla każdego URL i zweryfikować wyniki CWV.

**Acceptance Criteria**:

1. **Given** strona główna, **When** jest testowana w PageSpeed Insights, **Then** wynik Performance wynosi min. 90/100 na mobile
2. **Given** podstrona kalkulatora, **When** jest testowana, **Then** LCP < 2.5s, CLS < 0.1
3. **Given** strona, **When** jest ładowana, **Then** czcionki Google Fonts są ładowane z `font-display: swap` i preconnect (już obecne)
4. **Given** strona, **When** jest ładowana, **Then** CSS jest zminifikowany, obrazy zoptymalizowane (WebP z fallback — już obecne)

---

### Edge Cases

- Co jeśli Google nie indeksuje podstron? → Zweryfikować w Google Search Console, sprawdzić robots.txt i sitemap
- Co jeśli treść SEO jest zbyt długa i pogarsza UX? → Użyć sekcji zwijanych (accordion) lub „Czytaj więcej" dla długich treści
- Co jeśli podstrony kanibalizują się nawzajem w SERP? → Zapewnić unikalne frazy kluczowe per podstrona, unikać duplikacji treści
- Co jeśli zmienią się stawki podatkowe (nowy rok)? → Treść SEO powinna zawierać rok w title/description, aktualizacja co roku
- Co jeśli SPA hash routes zostaną zmienione na history mode? → Podstrony landing page powinny linkować do aktualnych URL-i SPA (zmiana linków CTA)
- Co jeśli użytkownik trafi na podstronę landing page zamiast bezpośrednio do SPA? → Podstrona zawiera wyraźny CTA „Przejdź do kalkulatora" linkujący do SPA

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Landing page MUSI posiadać dokładnie 6 dedykowanych podstron HTML dla kalkulatorów: B2B, umowa o pracę, umowa zlecenie, umowa o dzieło, porównywarka B2B, faktura VAT (pozostałe kalkulatory w kolejnej iteracji)
- **FR-002**: Każda podstrona MUSI mieć unikalny `<title>` zawierający nazwę kalkulatora + rok + frazę kluczową (max 60 znaków)
- **FR-003**: Każda podstrona MUSI mieć unikalny `<meta name="description">` (max 160 znaków) z CTA i frazą kluczową
- **FR-004**: Każda podstrona MUSI mieć unikalny `<h1>` z główną frazą kluczową
- **FR-005**: Każda podstrona MUSI zawierać min. 300 słów unikalnej treści edukacyjnej (treść generowana w ramach implementacji, do późniejszej rewizji przez właściciela)
- **FR-005a**: Podstrony MUSZĄ używać tego samego layoutu co strona główna LP (nav, footer, kolorystyka, Tailwind CSS, Roboto)
- **FR-006**: Landing page MUSI posiadać plik `robots.txt` w katalogu głównym domeny
- **FR-007**: Landing page MUSI posiadać plik `sitemap.xml` z listą wszystkich crawlowalnych URL-i
- **FR-008**: Strona główna MUSI zawierać JSON-LD `WebSite` z `SearchAction`
- **FR-009**: Podstrony MUSZĄ zawierać JSON-LD `BreadcrumbList`
- **FR-010**: Sekcje kalkulatorów na stronie głównej MUSZĄ zawierać linki do dedykowanych podstron landing page (np. „Dowiedz się więcej") oprócz istniejących linków CTA do SPA
- **FR-011**: Każda podstrona MUSI zawierać sekcję „Powiązane kalkulatory" z linkami do min. 2 powiązanych podstron
- **FR-012**: Footer na każdej stronie MUSI zawierać linki do wszystkich podstron (mapa strony)
- **FR-013**: Wszystkie teksty MUSZĄ być w języku polskim
- **FR-014**: Podstrony MUSZĄ mieć własne tagi Open Graph i Twitter Cards z unikalnymi tytułami i opisami
- **FR-015**: Każda podstrona MUSI mieć własny canonical URL

### Docelowe frazy kluczowe per podstrona

| Podstrona                     | Główna fraza                      | Wspierające frazy                                                                        |
| ----------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| `/kalkulator-b2b/`            | kalkulator B2B 2026               | kalkulator samozatrudnienie, wynagrodzenie netto B2B, kalkulator działalność gospodarcza |
| `/kalkulator-umowa-o-prace/`  | kalkulator umowa o pracę 2026     | kalkulator wynagrodzenia netto, brutto netto kalkulator, koszty pracodawcy               |
| `/kalkulator-umowa-zlecenie/` | kalkulator umowa zlecenie 2026    | wynagrodzenie netto zlecenie, składki ZUS zlecenie                                       |
| `/kalkulator-umowa-o-dzielo/` | kalkulator umowa o dzieło 2026    | koszty uzyskania przychodu 50%, wynagrodzenie netto dzieło                               |
| `/porownywarka-b2b/`          | porównanie form opodatkowania B2B | skala podatkowa vs liniowy vs ryczałt, jaka forma opodatkowania                          |
| `/kalkulator-vat/`            | kalkulator VAT 2026               | netto brutto VAT, kalkulator faktury VAT                                                 |

### Key Entities

- **Podstrona kalkulatora**: Dedykowana strona HTML z unikalnym URL, title, description, H1, treścią SEO i linkiem do kalkulatora w SPA. Każda podstrona targetuje konkretne frazy kluczowe
- **sitemap.xml**: Plik XML zgodny ze standardem sitemaps.org, zawierający listę wszystkich crawlowalnych URL-i z datami `lastmod` i priorytetami
- **robots.txt**: Plik tekstowy w katalogu głównym domeny z instrukcjami dla crawlerów i odniesieniem do sitemap
- **Dane strukturalne (JSON-LD)**: Obiekty schema.org osadzone w `<script type="application/ld+json">` — WebSite, BreadcrumbList, HowTo, FAQPage, SoftwareApplication
- **Nawigacja wewnętrzna**: System linków między podstronami (cross-linking) i nawigacja globalna (header + footer)

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: Google indeksuje min. 6 dedykowanych podstron kalkulatorów (weryfikacja: `site:kalkulatorfinansowy.app` w Google)
- **SC-002**: Każda podstrona przechodzi walidację w Google Rich Results Test bez błędów
- **SC-003**: `robots.txt` i `sitemap.xml` są dostępne i poprawne (weryfikacja: Google Search Console)
- **SC-004**: Strona główna osiąga min. 90/100 w PageSpeed Insights (Performance, mobile)
- **SC-005**: Wzrost liczby zaindeksowanych stron w Google Search Console z 1-2 do min. 8 w ciągu 30 dni od wdrożenia
- **SC-006**: Wzrost ruchu organicznego o min. 50% w ciągu 90 dni od wdrożenia (mierzone w Google Analytics)
- **SC-007**: Pojawienie się w top 20 Google dla min. 3 fraz kluczowych z tabeli docelowych fraz w ciągu 60 dni
- **SC-008**: Każda podstrona ma unikalny title, description i H1 (brak duplikacji — weryfikacja: Screaming Frog lub podobne narzędzie)
- **SC-009**: Breadcrumbs wyświetlają się w wynikach wyszukiwania Google dla podstron kalkulatorów

### Assumptions

- Landing page jest hostowany na Apache (obecność `.htaccess`)
- Podstrony będą statycznymi plikami HTML w katalogu `landing-page/` (nie wymagają SSR ani backendu)
- **Aplikacja SPA (`/app/`) pozostaje całkowicie bez zmian** — nie modyfikujemy routingu, kodu ani struktury SPA
- Podstrony landing page linkują do kalkulatorów w SPA przez istniejące hash routes (`/app/#/...`)
- Strona główna LP pozostaje hubem nawigacyjnym (krótkie opisy + linki) — nie rozbudowujemy jej treści, aby uniknąć kanibalizacji fraz z podstronami
- Treść SEO będzie wymagała aktualizacji co roku (zmiana stawek podatkowych)
- Google Search Console jest już skonfigurowane dla domeny `kalkulatorfinansowy.app`
