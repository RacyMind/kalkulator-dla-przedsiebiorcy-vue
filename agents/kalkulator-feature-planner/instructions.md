# kalkulator-feature-planner

## Cel

Przygotowuj gotowy do implementacji plan nowej funkcji dla repo `kalkulator-finansowy`. Kończ pracę utworzeniem pliku `plans/<feature-slug>-YYYY-MM-DD.md`.

Ten workflow służy wyłącznie do planowania. Nie twórz kodu produkcyjnego, nie zapisuj dokumentów w `specs/`, nie przygotowuj backlogu bez pliku wynikowego.

## Wczytaj na start

1. Przeczytaj główne reguły z root `AGENTS.md`.
2. Przeczytaj `references/repo-patterns.md`.
3. Przeczytaj `references/plan-template.md`.
4. Przeczytaj `references/source-checklist.md`, jeśli brief dotyczy aktualnych reguł, stawek, limitów, prawa, danych zewnętrznych lub rekomendacji zależnych od czasu.

## Kontrakt wejścia

Oczekuj:

- nazwy funkcji,
- krótkiego opisu celu,
- opcjonalnych ograniczeń biznesowych, technicznych lub UX.

Jeśli użytkownik nie poda pełnego briefu, najpierw zbierz fakty z repo. Zadawaj pytania tylko wtedy, gdy bez odpowiedzi nie da się wiarygodnie ustalić funkcji, UI lub zależności domenowych.

## Kontrakt wyjścia

- Zapisz plan w `plans/<feature-slug>-YYYY-MM-DD.md`.
- Treść planu pisz po polsku.
- Stosuj ASCII kebab-case dla nazwy pliku: małe litery, cyfry, myślniki, bez polskich znaków.
- Jeśli katalog `plans/` nie istnieje, utwórz go w root repo.
- Jeśli weryfikujesz źródła zewnętrzne, dodaj sekcję `## Źródła` z linkami i dokładnymi datami.

## Normalizacja nazwy

1. Zacznij od nazwy funkcji podanej przez użytkownika.
2. Zamień polskie znaki i inne znaki specjalne na odpowiedniki ASCII.
3. Zamień spacje i separatory na `-`.
4. Usuń znaki inne niż `a-z`, `0-9` i `-`.
5. Zredukuj wielokrotne `-` do pojedynczego.
6. Dodaj sufiks z datą w formacie `YYYY-MM-DD`.

Przykład:

- `Kalkulator zysku z najmu` -> `plans/kalkulator-zysku-z-najmu-2026-04-04.md`

## Workflow główny

1. Znormalizuj nazwę funkcji i ścieżkę pliku wyjściowego.
2. Ustal, czy zmiana oznacza:
   - `nowy moduł`,
   - `rozszerzenie istniejącego modułu`.
3. Zbierz kontekst z repo:
   - `src/components/`,
   - `src/router/routes.ts`,
   - `src/components/changeLogs/logs.ts`,
   - `test/vitest/__tests__/modules/`,
   - istniejące `specs/*`.
4. Rozdziel analizę na trzy równoległe strumienie, jeśli klient wspiera sub-agentów. Jeśli nie wspiera, wykonaj te same kroki sekwencyjnie.
5. Uruchom dodatkowy strumień `source-verification`, jeśli brief jest zależny od aktualnych danych lub regulacji.
6. Zadaj maksymalnie 3 pytania tylko wtedy, gdy bez nich plan byłby ryzykownie niepełny.
7. Zapisz gotowy plan według `references/plan-template.md`.
8. Sprawdź, czy plan zawiera wszystkie wymagane sekcje, tabelę pól wejściowych i tabelę wyników.

## Choreografia agentów

### 1. `repo-patterns`

Zadanie:

- wskaż 2-3 najbliższe moduły referencyjne,
- określ, czy lepszy jest nowy folder modułu czy rozszerzenie istniejącego,
- wskaż wymagane miejsca integracji: route, store, logic, tests, changelog.

Oczekiwany wynik:

- rekomendacja struktury,
- lista referencji z krótkim uzasadnieniem,
- decyzja `nowy moduł` albo `rozszerzenie`.

### 2. `ui-contract`

Zadanie:

- rozpisz sekcje formularza,
- zidentyfikuj pola wejściowe, walidacje, wartości domyślne i wpływ na wynik,
- zaproponuj układ wyników, stany puste i ewentualne zakładki.

Oczekiwany wynik:

- szkic layoutu,
- komplet wierszy do tabeli `Pola wejściowe`,
- komplet wierszy do tabeli `Wyniki`.

### 3. `testing-impact`

Zadanie:

- wskaż zakres testów jednostkowych,
- wskaż zakres testów komponentowych,
- wskaż miejsca integracji, które trzeba uwzględnić w planie.

Oczekiwany wynik:

- lista testów obowiązkowych,
- lista edge cases,
- lista plików lub obszarów repo do aktualizacji.

### 4. `source-verification`

Uruchamiaj tylko wtedy, gdy brief dotyczy czegoś zmiennego w czasie, np.:

- podatków, ulg, limitów, składek, stawek, terminów,
- inflacji, kursów walut, oprocentowania, danych GUS/NBP/ECB,
- API, bibliotek, regulacji, standardów lub zasad, które mogły się zmienić.

Zadanie:

- zweryfikuj fakty w źródłach pierwotnych lub oficjalnych,
- zapisuj dokładne daty publikacji lub obowiązywania,
- oddzielaj fakt od wniosku.

## Reguły decyzji projektowych

- Preferuj istniejący wzorzec modułu zamiast proponowania nowej architektury bez wyraźnego powodu.
- Jeśli brief dotyczy jednego kalkulatora z własnym formularzem i wynikami, domyślnie wybieraj pełny moduł `src/components/<feature>/`.
- Jeśli brief rozszerza już istniejący kalkulator, zachowaj jego folder, route, store i styl UI, chyba że repo-patterns wskaże krytyczny powód do refaktoru.
- Dla prostych wyników preferuj `ResultList.vue` i `Statistics.vue`.
- Dla złożonych wyników lub wielu perspektyw preferuj `QTabs` i osobne komponenty wynikowe.

## Zasady pisania planu

- Ustal decyzje implementacyjne. Nie zostawiaj implementerowi wyboru między dwoma równorzędnymi ścieżkami.
- Używaj nazw zgodnych z repo i językiem domenowym.
- Opisuj UI na poziomie pól, sekcji, walidacji i widoków wynikowych, nie na poziomie pixel-perfect designu.
- W `## Założenia i otwarte pytania` oddzielaj przyjęte domyślne decyzje od braków wymagających potwierdzenia.
- Jeśli coś jest niepewne i nie da się tego zweryfikować, napisz to wprost.

## Checklista końcowa

Przed zakończeniem potwierdź:

- plik zapisano w `plans/`,
- nazwa pliku jest w ASCII kebab-case,
- plan ma wszystkie wymagane sekcje,
- `## UI` zawiera tabelę `Pola wejściowe` i tabelę `Wyniki`,
- `## Testy i akceptacja` obejmuje testy jednostkowe, komponentowe i edge cases,
- `## Źródła` istnieje tylko wtedy, gdy była weryfikacja zewnętrzna,
- plan odwołuje się do realnych wzorców repo zamiast ogólnych porad.
