# Szablon planu

Użyj poniższego układu i uzupełnij go konkretnymi decyzjami. Nie zostawiaj placeholderów, jeśli możesz wyciągnąć odpowiedź z repo lub z briefu.

```md
# Plan funkcji: <nazwa funkcji>

## Skrót

Krótki opis celu funkcji, decyzji `nowy moduł` albo `rozszerzenie istniejącego`, głównych referencji repo i wyniku dla użytkownika.

## Funkcje do implementacji

### MVP

- ...

### P2

- ...

### Poza zakresem

- ...

## Struktura rozwiązania

- Typ zmiany: `nowy moduł` albo `rozszerzenie istniejącego`
- Moduł lub moduły referencyjne: ...
- Kluczowe elementy implementacji: store, logic, interfaces, page, route, testy, changelog
- Miejsca integracji w repo: ...

## UI

### Layout i przepływ

- ...

### Pola wejściowe

| Pole | Typ UI | Model danych | Wymagane | Domyślna wartość | Walidacja | Wpływ na wynik |
| ---- | ------ | ------------ | -------- | ---------------- | --------- | -------------- |
| ...  | ...    | ...          | ...      | ...              | ...       | ...            |

### Wyniki

| Wynik | Forma prezentacji | Źródło/wzór | Warunki wyświetlania |
| ----- | ----------------- | ----------- | -------------------- |
| ...   | ...               | ...         | ...                  |

## Logika i dane

- Reguły obliczeń
- Wykorzystywane stałe, enumy i typy
- Zależności od istniejących store lub helperów
- Local storage i domyślne wartości
- Edge cases i zachowanie błędów

## Testy i akceptacja

- Testy jednostkowe logiki
- Testy komponentowe formularza i wyników
- Miejsca integracji do sprawdzenia
- Kryteria ukończenia

## Założenia i otwarte pytania

### Założenia

- ...

### Otwarte pytania

- ...
```

Dodaj sekcję `## Źródła` tylko wtedy, gdy plan opiera się na weryfikacji zewnętrznej.

Format sekcji źródeł:

```md
## Źródła

- [Tytuł źródła](https://...) — sprawdzono: 2026-04-04; potwierdza: ...
```
