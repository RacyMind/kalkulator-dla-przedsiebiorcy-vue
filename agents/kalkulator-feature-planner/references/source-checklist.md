# Checklista źródeł zewnętrznych

## Kiedy weryfikować w sieci

Uruchom weryfikację zewnętrzną, gdy brief dotyczy czegoś niestabilnego w czasie, w szczególności:

- podatków, ulg, składek, limitów, progów, terminów i formularzy,
- oprocentowania, inflacji, kursów walut, danych statystycznych,
- API, bibliotek, standardów, regulacji, polityk lub przepisów,
- funkcji opisanych przez użytkownika jako `aktualne`, `najnowsze`, `obecne`, `na dziś`.

## Priorytet źródeł

1. Źródła oficjalne lub pierwotne:
   - `podatki.gov.pl`
   - `gov.pl`
   - `zus.pl`
   - `nbp.pl`
   - `stat.gov.pl`
   - dokumentacja oficjalna API lub biblioteki
2. Źródła wtórne tylko wtedy, gdy pomagają znaleźć źródło pierwotne.

## Jak zapisywać ustalenia

- Podawaj dokładne daty, nie tylko `dziś`, `obecnie`, `w tym roku`.
- Oddzielaj:
  - fakt potwierdzony źródłem,
  - wniosek projektowy wynikający z faktu.
- Jeśli dwa źródła różnią się datą lub treścią, wybierz nowsze i zaznacz to w planie.
- Jeśli nie uda się potwierdzić kluczowego faktu, wpisz to do `## Założenia i otwarte pytania`.

## Jak zapisywać sekcję `## Źródła`

Każdy wpis powinien zawierać:

- tytuł,
- link,
- datę sprawdzenia w formacie `YYYY-MM-DD`,
- jednozdaniowe wyjaśnienie, co dokładnie źródło potwierdza.

Przykład:

```md
- [IKZE 2026 - limity wpłat](https://...) — sprawdzono: 2026-04-04; potwierdza limit wpłat i sposób jego wyliczenia.
```
