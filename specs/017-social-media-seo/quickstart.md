# Quickstart: Social Media & SEO

**Branch**: `017-social-media-seo`  
**Date**: 2026-02-08

## Przegląd

Feature dodaje kompletne meta tagi OG i Twitter/X Cards do `index.html`, dedykowaną grafikę OG, zamienia Twitter na X w komponentach udostępniania i dopracowuje teksty CTA/share.

## Kolejność implementacji

### 1. Grafika OG (Scenario 3)

Stwórz plik `public/images/og-image.png`:

- Wymiary: 1200 × 630 px
- Tło: kolor marki #1565C0 (gradient lub solid)
- Treść: nazwa „Kalkulator finansowy", slogan „Twój darmowy kalkulator wynagrodzeń", logo aplikacji
- Format: PNG, < 1 MB

### 2. Meta tagi w index.html (Scenario 1 + 2)

Edytuj `index.html` — dodaj brakujące tagi w `<head>`:

**Open Graph** (uzupełnij istniejące + dodaj nowe):

- `og:type` = `website`
- `og:locale` = `pl_PL`
- `og:site_name` = `Kalkulator finansowy`
- Zaktualizuj `og:url` na `https://kalkulatorfinansowy.app/app`
- Zaktualizuj `og:image` na URL nowej grafiki OG

**Twitter/X Cards** (wszystkie nowe):

- `twitter:card` = `summary_large_image`
- `twitter:title` = tytuł (może użyć `<%= productName %>`)
- `twitter:description` = opis
- `twitter:image` = URL grafiki OG

**SEO** (nowe):

- `<link rel="canonical" href="https://kalkulatorfinansowy.app/app">`
- `<meta name="robots" content="index, follow">`
- `<meta name="author" content="Łukasz Socha">`
- Zaktualizuj `<meta name="description">` z kluczowymi frazami SEO

### 3. Zamiana Twitter → X w SupportProject.vue (Scenario 4)

Edytuj `src/components/partials/SupportProject.vue`:

- Zamień import `mdiTwitter` na inline SVG path string dla ikony X
- Zamień URL z `http://twitter.com/share` na `https://x.com/intent/tweet`
- Zaktualizuj zmienną `url` z `'https://kalkulatorfinansowy.app'` na `'https://kalkulatorfinansowy.app/app'`

### 4. Domyślne teksty share na X (Scenario 5)

W `SupportProject.vue`:

- Dopracuj parametr `text` w URL X share (zachęcający tekst, nie tylko nazwa aplikacji)
- Zaktualizuj `hashtags` (np. `kalkulator,finanse,wynagrodzenie,B2B`)
- Facebook i LinkedIn: bez zmian w parametrach URL (pobierają z OG tags)

### 5. Teksty CTA (Scenario 5 — kontynuacja)

W `SupportProject.vue` i `Donate.vue`:

- Dopracuj teksty zachęcające do wsparcia i udostępniania
- Użyj języka korzyści i jasnych CTA

### 6. Changelog

Zaktualizuj `src/components/changeLogs/logs.ts` z opisem zmian widocznych dla użytkownika.

## Weryfikacja

1. **Meta tagi**: Wklej `https://kalkulatorfinansowy.app/app` w [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. **X Cards**: Udostępnij link na X i sprawdź kartę
3. **Grafika OG**: Otwórz `public/images/og-image.png` — sprawdź wymiary i czytelność
4. **Przycisk X**: Otwórz modal „Wesprzyj projekt" → kliknij X → sprawdź URL na `x.com`
5. **Brak Twittera**: Szukaj „twitter" w kodzie — nie powinno być odniesień w komponentach UI

## Ważne ustalenia z researchu

- **Facebook/LinkedIn**: Nie akceptują parametrów tekstowych w URL share. Podgląd jest pobierany wyłącznie z meta tagów OG. Dlatego poprawne OG tags (Scenario 1) są kluczowe.
- **X**: Intent API (`x.com/intent/tweet`) nadal wspiera `text`, `url`, `hashtags`.
- **Ikona X**: `@quasar/extras@1.17.0` nie ma dedykowanej ikony X. Użyj inline SVG path string.
