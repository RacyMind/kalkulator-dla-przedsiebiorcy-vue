![CI](https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue/actions/workflows/ci.yml/badge.svg?branch=main)

# Kalkulator finansowy

Aplikacja webowa (PWA) i Android do obliczeń finansowych zgodnych z polskimi przepisami: wynagrodzenia, podatki, ZUS, limity, inwestycje i kalkulatory pomocnicze.

- Aplikacja: [kalkulatorfinansowy.app](https://kalkulatorfinansowy.app)
- Android: [Google Play](https://play.google.com/store/apps/details?id=racyMind.kalkulator)

## Cel repozytorium

Repozytorium służy do utrzymania i rozwoju kalkulatorów finansowych z naciskiem na:

- poprawność logiki biznesowej,
- spójność architektury modułów,
- wysokie pokrycie testami jednostkowymi.

## Stos technologiczny

- Vue 3 + `<script setup lang="ts">`
- Quasar 2
- Pinia
- TypeScript (strict mode)
- Vite (`@quasar/app-vite`)
- Vitest + `@vue/test-utils` + happy-dom
- Capacitor (Android)

## Struktura projektu

```text
src/
  components/
    <moduleName>/
      components/
      interfaces/
      logic/
      pages/
      types/
      store.ts
    partials/
  logic/
  stores/
  router/
  composables/

test/vitest/__tests__/
  modules/
  logic/
  composables/
  services/
```

Wzorcowy moduł: `src/components/contractWork/`.

## Podejście architektoniczne

Każdy kalkulator:

- posiada własny katalog modułu,
- trzyma dane wejściowe w store (`inputFields`),
- wylicza wynik przez klasę kalkulatora (`BasicCalculator`),
- udostępnia wynik przez getter store.

Zasady pracy:

- najpierw sprawdzaj istniejące komponenty/partials i reuse, dopiero potem twórz nowe,
- nie dodawaj nowych zależności bez uzgodnienia,
- nie twórz nowych katalogów bazowych bez uzgodnienia,
- używaj `camelCase` dla zmiennych i stałych (bez `UPPER_SNAKE_CASE`),
- trzymaj się wzorców sąsiednich plików.

## Szybki start

Wymagania:

- Node.js `>= 20`
- npm

Instalacja:

```bash
npm install
```

Uruchomienie lokalne (PWA dev):

```bash
npm start
```

## Testy i jakość

W tym projekcie zmiana jest kompletna dopiero po uruchomieniu testów.

Podstawowe komendy:

```bash
# wszystkie testy (CI mode)
npm run test:unit:ci

# watch mode
npm run test:unit

# pojedynczy test
npx vitest run test/vitest/__tests__/modules/contractOfWork/ContractWorkCalculator.test.ts

# lint
npm run lint
```

## Workflow zmian

1. Zidentyfikuj moduł i istniejące elementy do reużycia.
2. Wprowadź zmianę zgodnie ze strukturą katalogów i wzorcami kodu.
3. Dodaj lub zaktualizuj testy dla zmienionej logiki.
4. Uruchom co najmniej testy modułu, a przed merge pełny zestaw testów.
5. Uruchom lint i napraw ostrzeżenia/błędy istotne dla zmiany.

## Build

PWA:

```bash
npm run build
```

Android:

```bash
npm run build:android
```

## Gdy zmiana UI nie jest widoczna

Najczęstsze przyczyny:

1. Nie działa aktualny dev server: uruchom `npm start`.
2. Sprawdzany jest stary build: wykonaj `npm run build`.
3. Otwarta jest inna gałąź lub nieaktualny deploy.

## CI

Pipeline (`.github/workflows/ci.yml`) uruchamia:

1. `npm run lint`
2. `npx vitest run`
3. build PWA po przejściu poprzednich kroków

## Licencja

Szczegóły: [LICENSE.md](LICENSE.md)
