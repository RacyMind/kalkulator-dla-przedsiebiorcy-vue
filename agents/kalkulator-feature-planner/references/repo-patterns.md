# Wzorce repo

## Reguły globalne z `AGENTS.md`

- Teksty UI muszą być po polsku.
- Zmiana nie jest kompletna bez testów.
- Preferuj aliasy Vite zamiast głębokich importów relatywnych.
- Używaj `BasicCalculator` jako bazy logiki tam, gdzie powstaje nowy kalkulator.
- Stosuj Quasar dla formularzy i widoków wyników.

## Domyślna struktura nowego modułu

```text
src/components/<feature>/
├── components/
├── interfaces/
├── logic/
├── pages/
│   └── Index.vue
├── store.ts
└── types/            # opcjonalnie
```

Dodatkowe miejsca integracji:

- `src/router/routes.ts`
- `src/components/changeLogs/logs.ts`
- `test/vitest/__tests__/modules/<feature>/`

## Jak wybrać strukturę

- Wybierz `nowy moduł`, gdy funkcja ma własny route, własny formularz i własny wynik.
- Wybierz `rozszerzenie istniejącego modułu`, gdy użytkownik oczekuje nowego pola, nowego trybu obliczeń lub nowej zakładki w istniejącym kalkulatorze.
- Jeśli brief jest niejednoznaczny, sprawdź:
  - podobieństwo nazwy i domeny do istniejących folderów w `src/components/`,
  - czy route już istnieje,
  - czy testy w `test/vitest/__tests__/modules/` sugerują naturalne miejsce rozszerzenia.
