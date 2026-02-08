# Feature Specification: Social Media & SEO – meta tagi, grafika OG, udostępnianie

**Branch**: `017-social-media-seo`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "Przygotuj meta tagi dla social media, dla SEO, przygotuj także grafikę, która będzie wyświetlana przy udostępnianiu aplikacji na social media. W sekcji 'wesprzyj' projekt, są przyciski do udostępniania aplikacji. Zamień Twittera na X, dopracuj teksty pod marketing i CTA. Możesz dodać tagi dla X."

## User Scenarios _(required)_

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 – Kompletne meta tagi Open Graph i SEO (Priority: P1) 🎯 MVP

Użytkownik udostępnia link do aplikacji (https://kalkulatorfinansowy.app/app) na Facebooku, LinkedIn lub w komunikatorze. Platforma pobiera meta tagi i wyświetla atrakcyjny podgląd z tytułem, opisem i dedykowaną grafiką OG (1200×630 px).

> **Uwaga**: Aplikacja SPA jest dostępna pod adresem `https://kalkulatorfinansowy.app/app`. Landing page (`https://kalkulatorfinansowy.app`) zostanie poprawiony osobno – nie jest w zakresie tego feature'a.

**Priority Justification**: Meta tagi OG to fundament widoczności w social media – bez nich linki wyświetlają się jako zwykły tekst bez podglądu.

**Independent Test**: Wkleić URL aplikacji w Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) i zweryfikować poprawność podglądu.

**Acceptance Criteria**:

1. **Given** strona `index.html` aplikacji (SPA), **When** crawler social media pobiera stronę, **Then** zwracane są kompletne meta tagi: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`
2. **Given** strona `index.html`, **When** crawler pobiera stronę, **Then** tag `og:image` wskazuje na dedykowaną grafikę OG o wymiarach 1200×630 px
3. **Given** strona `index.html`, **When** crawler pobiera stronę, **Then** obecne są tagi SEO: `description`, `robots`, `author`, `canonical link`

---

### Scenario 2 – Tagi Twitter/X Cards (Priority: P1) 🎯 MVP

Użytkownik udostępnia link do aplikacji na platformie X (dawniej Twitter). Platforma wyświetla kartę z dużą grafiką (summary_large_image), tytułem i opisem.

**Priority Justification**: X jest jedną z głównych platform udostępniania – dedykowane tagi `twitter:*` zapewniają optymalny wygląd karty.

**Independent Test**: Wkleić URL w X Card Validator lub udostępnić link na X i zweryfikować wygląd karty.

**Acceptance Criteria**:

1. **Given** strona `index.html`, **When** crawler X pobiera stronę, **Then** obecne są tagi: `twitter:card` (wartość `summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`
2. **Given** strona `index.html`, **When** karta X jest renderowana, **Then** grafika wyświetla się poprawnie w formacie dużej karty

---

### Scenario 3 – Dedykowana grafika OG (Priority: P1) 🎯 MVP

Aplikacja posiada dedykowaną grafikę do udostępniania w social media, która jest atrakcyjna wizualnie i komunikuje wartość aplikacji.

**Priority Justification**: Grafika OG to pierwszy element wizualny, który widzi potencjalny użytkownik – musi być profesjonalna i zachęcająca.

**Independent Test**: Otworzyć grafikę w przeglądarce i zweryfikować wymiary, czytelność tekstu oraz spójność z marką.

**Acceptance Criteria**:

1. **Given** plik grafiki OG, **When** jest wyświetlany, **Then** ma wymiary 1200×630 px (zalecane przez Facebook/X)
2. **Given** grafika OG, **When** jest wyświetlana na podglądzie social media, **Then** zawiera: logo/nazwę aplikacji, slogan „Twój darmowy kalkulator wynagrodzeń", czytelną typografię na tle spójnym z kolorystyką marki (#1565C0)
3. **Given** grafika OG, **When** jest serwowana, **Then** format pliku to PNG lub JPG, rozmiar poniżej 1 MB
4. **Given** grafika OG, **When** jest wyświetlana w małym podglądzie (miniaturka), **Then** tekst i logo pozostają czytelne

---

### Scenario 4 – Zamiana Twittera na X w sekcji udostępniania (Priority: P1) 🎯 MVP

W komponencie „Wesprzyj projekt" (SupportProject.vue) przycisk udostępniania na Twitterze zostaje zaktualizowany do platformy X – zmiana ikony, URL API udostępniania i ewentualnych etykiet.

**Priority Justification**: Twitter oficjalnie zmienił nazwę na X – aktualna nazwa i ikona budują wiarygodność aplikacji.

**Independent Test**: Otworzyć modal „Wesprzyj projekt", kliknąć przycisk X i zweryfikować, że otwiera się poprawny URL udostępniania na x.com.

**Acceptance Criteria**:

1. **Given** komponent SupportProject, **When** użytkownik widzi przyciski udostępniania, **Then** przycisk Twittera jest zastąpiony przyciskiem X z odpowiednią ikoną
2. **Given** przycisk X, **When** użytkownik go kliknie, **Then** otwiera się URL: `https://x.com/intent/tweet?url=...&text=...&hashtags=...`
3. **Given** komponent SupportProject, **When** jest renderowany, **Then** nie ma żadnych odniesień do „Twitter" w kodzie ani w UI

---

### Scenario 5 – Domyślne teksty udostępniania w social media (Priority: P2)

Gdy użytkownik kliknie przycisk udostępniania (Facebook, LinkedIn, X) w sekcji „Wesprzyj projekt", otwiera się okno danej platformy z domyślnie wypełnionym tekstem, linkiem i hashtagami. Teksty te powinny być dopracowane marketingowo – zwięzłe, zachęcające i zawierające kluczowe słowa.

Obecnie:

- **Facebook**: brak domyślnego tekstu (tylko URL w parametrze `u`)
- **LinkedIn**: tytuł = nazwa aplikacji (parametr `title`), brak opisu
- **X (Twitter)**: tekst = nazwa aplikacji (parametr `text`), hashtagi = `wynagrodzenie,finanse,kalkulator`

**Priority Justification**: Domyślne teksty udostępniania to pierwszy kontakt potencjalnego użytkownika z aplikacją – dobrze napisane zwiększają klikalność i zasięg organiczny.

**Independent Test**: Kliknąć każdy przycisk udostępniania w modalu „Wesprzyj projekt" i zweryfikować, że okno platformy otwiera się z atrakcyjnym, domyślnie wypełnionym tekstem.

**Acceptance Criteria**:

1. **Given** przycisk Facebook w SupportProject, **When** użytkownik go kliknie, **Then** URL share zawiera parametr `quote` z zachęcającym tekstem opisującym wartość aplikacji
2. **Given** przycisk LinkedIn w SupportProject, **When** użytkownik go kliknie, **Then** URL share zawiera parametry `title` i `summary` z marketingowo dopracowanymi tekstami
3. **Given** przycisk X w SupportProject, **When** użytkownik go kliknie, **Then** parametr `text` zawiera zwięzły, zachęcający tekst z kluczowymi słowami (nie tylko nazwę aplikacji)
4. **Given** przycisk X w SupportProject, **When** użytkownik go kliknie, **Then** parametr `hashtags` zawiera aktualne i trafne hashtagi (np. `kalkulator,finanse,wynagrodzenie,B2B`)
5. **Given** wszystkie przyciski udostępniania, **When** użytkownik kliknie dowolny z nich, **Then** domyślny tekst jest w języku polskim i komunikuje kluczową wartość: darmowy kalkulator finansowy do obliczania wynagrodzeń

---

### Edge Cases

- Co jeśli platforma social media nie obsługuje tagów `twitter:*`? → Fallback na tagi `og:*` (standardowe zachowanie)
- Co jeśli grafika OG jest niedostępna (błąd 404)? → Platforma wyświetli domyślny podgląd bez grafiki – należy zapewnić poprawny URL i dostępność pliku
- Co jeśli użytkownik ma zablokowane pop-upy? → Przyciski udostępniania używają `target="_blank"` z `type="a"` – zachowanie zależy od przeglądarki
- Co jeśli ikona X (mdi) nie jest dostępna w aktualnej wersji `@quasar/extras`? → Należy zweryfikować dostępność ikony `mdiTwitter` → `mdiClose` lub użyć niestandardowej ikony SVG dla X

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Plik `index.html` (SPA) MUSI zawierać kompletne meta tagi Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`
- **FR-002**: Plik `index.html` (SPA) MUSI zawierać tagi Twitter/X Cards: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **FR-003**: Grafika OG MUSI mieć wymiary 1200×630 px, format PNG lub JPG, rozmiar poniżej 1 MB
- **FR-004**: Grafika OG MUSI być umieszczona pod publicznie dostępnym URL (np. `https://kalkulatorfinansowy.app/app/images/og-image.png`)
- **FR-005**: Komponent `SupportProject.vue` MUSI zastąpić ikonę i URL Twittera ikoną i URL platformy X
- **FR-006**: URL udostępniania na X MUSI używać domeny `x.com` zamiast `twitter.com`
- **FR-007**: Domyślne teksty udostępniania (parametry `text`, `title`, `hashtags` w URL-ach share) MUSZĄ być dopracowane marketingowo dla każdej platformy (Facebook, LinkedIn, X)
- **FR-008**: Teksty w `SupportProject.vue` i `Donate.vue` MUSZĄ być dopracowane marketingowo z jasnym CTA
- **FR-009**: Wszystkie teksty UI MUSZĄ być w języku polskim
- **FR-010**: Plik `index.html` MUSI zawierać tag `<link rel="canonical">` wskazujący na kanoniczny URL aplikacji (`https://kalkulatorfinansowy.app/app`)
- **FR-011**: Meta tag `description` MUSI zawierać kluczowe frazy SEO (wynagrodzenie, kalkulator, B2B, umowa o pracę)
- **FR-012**: Hashtagi w URL udostępniania na X MUSZĄ być aktualne i trafne

### Key Entities

- **Meta tagi OG**: Zestaw tagów `<meta property="og:*">` w `<head>` dokumentu HTML – definiują podgląd przy udostępnianiu na Facebooku, LinkedIn, komunikatorach
- **Tagi Twitter/X Cards**: Zestaw tagów `<meta name="twitter:*">` w `<head>` – definiują wygląd karty na platformie X
- **Grafika OG**: Plik graficzny 1200×630 px używany jako `og:image` i `twitter:image` – główny element wizualny podglądu
- **SupportProject**: Komponent Vue (`SupportProject.vue`) z modalem „Wesprzyj projekt" zawierającym przyciski udostępniania i link do zrzutka.pl
- **Donate**: Komponent Vue (`Donate.vue`) z CTA do wsparcia projektu, wyświetlany w kontekście kalkulatorów

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: Link do aplikacji wklejony w Facebook Sharing Debugger wyświetla poprawny podgląd z tytułem, opisem i grafiką OG
- **SC-002**: Link do aplikacji udostępniony na X wyświetla kartę `summary_large_image` z poprawną grafiką
- **SC-003**: Wszystkie wymagane meta tagi OG i Twitter/X Cards są obecne w `index.html`
- **SC-004**: Przycisk udostępniania na X w SupportProject otwiera poprawny URL na `x.com`
- **SC-005**: Brak jakichkolwiek odniesień do „Twitter" w kodzie źródłowym komponentów UI
- **SC-006**: Grafika OG ma wymiary 1200×630 px i rozmiar poniżej 1 MB
- **SC-007**: Teksty CTA w SupportProject i Donate są dopracowane marketingowo i spójne między sobą
- **SC-008**: Meta tag `description` zawiera kluczowe frazy SEO istotne dla grupy docelowej
- **SC-009**: Domyślne teksty udostępniania (pre-filled) na każdej platformie (Facebook, LinkedIn, X) są marketingowo dopracowane i w języku polskim
