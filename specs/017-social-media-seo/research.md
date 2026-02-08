# Research: Social Media & SEO

**Branch**: `017-social-media-seo`  
**Date**: 2026-02-08

## R-001: Ikona X (dawniej Twitter) w MDI v7

**Problem**: `@quasar/extras@1.17.0` zawiera `mdiTwitter` (stare logo ptaka), ale nie ma dedykowanej ikony platformy X.

**Decision**: Użyć inline SVG path string dla ikony X, zdefiniowanej jako stała w `SupportProject.vue`.

**Rationale**:

- `mdiTwitter` to przestarzałe logo — używanie go jest mylące
- `mdiAlphaXBox` to generyczna litera X, nie logo platformy
- Inline SVG path jest lekki (jeden string) i nie wymaga dodatkowych zależności
- Oficjalny SVG logo X jest publicznie dostępny

**Alternatives considered**:

- Upgrade `@quasar/extras` — nowsze wersje MDI (v7.4+) dodały `mdiTwitter` jako alias do nowego logo X, ale wymaga to aktualizacji zależności
- Użycie `mdiAlphaXBox` — wygląda jak generyczna litera, nie jak logo platformy
- Zewnętrzna biblioteka ikon — zbędna zależność dla jednej ikony

## R-002: Facebook Sharer API — parametry tekstowe

**Problem**: Spec zakłada parametr `quote` w URL Facebook share. Czy to działa?

**Decision**: Facebook sharer akceptuje **wyłącznie** parametr `u` (URL). Parametr `quote` jest niestabilny i może nie działać. Cały podgląd (tytuł, opis, grafika) jest pobierany z meta tagów OG strony docelowej.

**Rationale**:

- Facebook oficjalnie zdeprecjonował wszystkie parametry poza `u` w sharer.php
- Parametr `quote` działa sporadycznie i nie jest oficjalnie wspierany
- Jedyny niezawodny sposób na kontrolę podglądu to poprawne meta tagi OG

**Impact on spec**: Scenario 5 AC #1 (parametr `quote` dla Facebook) — **nie jest realizowalny** w sposób niezawodny. Facebook share będzie korzystał z meta tagów OG. Przycisk Facebook w SupportProject powinien nadal używać `sharer.php?u=URL` bez dodatkowych parametrów tekstowych.

**Alternatives considered**:

- Facebook Dialog API (wymaga app_id i zatwierdzenia aplikacji) — zbyt skomplikowane
- Parametr `quote` — niestabilny, może przestać działać w każdej chwili

## R-003: LinkedIn Share API — parametry tekstowe

**Problem**: Spec zakłada parametry `title` i `summary` w URL LinkedIn share. Czy to działa?

**Decision**: LinkedIn `shareArticle` API ignoruje parametry `title` i `summary` od ~2019. Podgląd jest pobierany z meta tagów OG strony docelowej. Jedyny działający parametr to `url`.

**Rationale**:

- LinkedIn oficjalnie potwierdził, że `shareArticle` pobiera dane z OG tags
- Parametry `title`, `summary`, `source` są ignorowane
- Obecny URL w SupportProject (`shareArticle?mini=true&url=...&title=...`) — parametr `title` jest ignorowany

**Impact on spec**: Scenario 5 AC #2 (parametry `title` i `summary` dla LinkedIn) — **nie jest realizowalny**. LinkedIn share będzie korzystał z meta tagów OG. Przycisk LinkedIn powinien używać `shareArticle?mini=true&url=URL`.

**Alternatives considered**:

- LinkedIn Marketing API (wymaga OAuth i app registration) — zbyt skomplikowane
- Zachowanie obecnych parametrów `title` — nieszkodliwe, ale mylące w kodzie

## R-004: X (Twitter) Share API — parametry tekstowe

**Problem**: Jakie parametry są dostępne w X share intent?

**Decision**: X share intent (`https://x.com/intent/tweet`) nadal wspiera parametry: `text`, `url`, `hashtags`, `via`.

**Rationale**:

- X/Twitter Intent API jest stabilne i oficjalnie wspierane
- Parametry `text` i `hashtags` pozwalają na pre-filled tekst
- Domena `x.com` jest preferowana (stara `twitter.com` przekierowuje)

**Format URL**: `https://x.com/intent/tweet?url={url}&text={text}&hashtags={hashtags}`

## R-005: Grafika OG — podejście do tworzenia

**Problem**: Jak stworzyć grafikę OG 1200×630 px?

**Decision**: Stworzyć grafikę OG programowo jako plik SVG skonwertowany do PNG, lub przygotować ją ręcznie w edytorze graficznym. Grafika powinna zawierać:

- Tło w kolorze marki (#1565C0)
- Nazwę aplikacji „Kalkulator finansowy"
- Krótki slogan: „Twój darmowy kalkulator wynagrodzeń"
- Logo aplikacji (istniejące `app-icon.svg`)

**Rationale**:

- Wymiary 1200×630 px to standard zalecany przez Facebook i X
- Format PNG zapewnia najlepszą kompatybilność
- Rozmiar poniżej 1 MB jest wymagany przez spec

**Placement**: `public/images/og-image.png` — dostępny pod `https://kalkulatorfinansowy.app/app/images/og-image.png`

## R-006: Quasar `index.html` template variables

**Problem**: `index.html` używa `<%= productName %>` i `<%= productDescription %>`. Czy meta tagi OG mogą ich używać?

**Decision**: Tak — Quasar CLI przetwarza `index.html` jako EJS template. Zmienne `productName` i `productDescription` pochodzą z `package.json` (pola `productName` i `description`). Meta tagi OG mogą używać tych zmiennych.

**Rationale**: Obecne tagi `og:title` i `og:description` już używają tych zmiennych. Nowe tagi mogą robić to samo dla spójności.

## Podsumowanie wpływu na spec

| Scenario 5 AC                   | Status             | Uwaga                                                         |
| ------------------------------- | ------------------ | ------------------------------------------------------------- |
| #1 (Facebook `quote`)           | ❌ Nierealizowalny | Facebook pobiera z OG tags, nie akceptuje `quote` niezawodnie |
| #2 (LinkedIn `title`/`summary`) | ❌ Nierealizowalny | LinkedIn pobiera z OG tags, ignoruje parametry                |
| #3 (X `text`)                   | ✅ Realizowalny    | X intent API wspiera `text`                                   |
| #4 (X `hashtags`)               | ✅ Realizowalny    | X intent API wspiera `hashtags`                               |
| #5 (Tekst w języku polskim)     | ✅ Realizowalny    | Dotyczy X `text` + meta tagów OG                              |

**Wniosek**: Dla Facebook i LinkedIn jedynym sposobem kontroli podglądu są meta tagi OG (Scenario 1). Scenario 5 powinien skupić się na X share text + ogólnej jakości meta tagów OG (które służą jako "domyślne teksty" dla Facebook i LinkedIn).
