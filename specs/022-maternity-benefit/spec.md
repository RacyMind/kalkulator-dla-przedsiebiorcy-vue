# Feature Specification: Kalkulator zasiłku macierzyńskiego

**Branch**: `022-maternity-benefit`  
**Created**: 2026-02-10  
**Status**: Draft  
**Input**: User description: "Dodajmy moduł do obliczania zasiłku macierzyńskiego"

## Clarifications

### Session 2026-02-10

- Q: Sposób wyświetlania dwóch wariantów wypłaty zasiłku? → A: Oba warianty obok siebie (dwie kolumny/sekcje) — porównanie bez kliknięć
- Q: Górny limit podstawy składki chorobowej dla opcji "Inny"? → A: Walidacja górnego limitu (250% przeciętnego wynagrodzenia) z komunikatem blokującym
- Q: Wybór liczby dzieci — jaki typ kontrolki UI? → A: Select/dropdown z predefiniowanymi opcjami (1, 2, 3, 4, 5+)

## User Scenarios _(required)_

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Obliczenie zasiłku macierzyńskiego dla umowy o pracę, wariant 81,5% (Priority: P1) 🎯 MVP

Użytkownik wybiera formę zatrudnienia "Umowa o pracę", podaje średnią miesięczną pensję brutto z ostatnich 12 miesięcy, liczbę dzieci urodzonych w jednym porodzie, a następnie widzi wyniki dla obu wariantów wypłaty zasiłku.

**Priority Justification**: Umowa o pracę to najczęstsza forma zatrudnienia — podstawowy przypadek użycia.

**Independent Test**: Uruchomić kalkulator z danymi wejściowymi i zweryfikować, że podstawa zasiłku, stawka dzienna i łączna kwota zasiłku są poprawne.

**Acceptance Criteria**:

1. **Given** forma zatrudnienia = umowa o pracę, średnia pensja brutto = 5 583,33 zł, jedno dziecko, **When** użytkownik kliknie "Oblicz", **Then** widzi podstawę zasiłku, stawkę dzienną oraz łączne kwoty dla obu wariantów wypłaty
2. **Given** formularz jest wypełniony, **When** wyniki się wyświetlą, **Then** widoczne są oba warianty: stały 81,5% przez 52 tygodnie oraz zmienny 100%/70%
3. **Given** formularz jest wypełniony, **When** wyniki się wyświetlą, **Then** widoczny jest podział na urlop macierzyński (20 tyg.) i rodzicielski (32 tyg.) z kwotami dla każdego okresu

**Calculation Example**:

```
Input data:
- Forma zatrudnienia: Umowa o pracę
- Średnia pensja brutto (12 mies.): 5 583,33 zł
- Liczba dzieci: 1

Intermediate:
- Podstawa zasiłku: 5 583,33 - 13,71% = 4 817,86 zł
- Stawka dzienna: 4 817,86 / 30 = 160,60 zł

Wariant A – stały 81,5% przez 52 tygodnie (364 dni):
- Stawka dzienna 81,5%: 130,89 zł
- Urlop macierzyński (20 tyg. = 140 dni): 18 324,60 zł
- Urlop rodzicielski (32 tyg. = 224 dni): 29 319,36 zł
- Łącznie: 47 643,96 zł

Wariant B – zmienny 100% / 70%:
- Urlop macierzyński 100% (20 tyg. = 140 dni): 160,60 × 140 = 22 484,00 zł
- Urlop rodzicielski 70% (32 tyg. = 224 dni): 112,42 × 224 = 25 182,08 zł
- Łącznie: 47 666,08 zł
```

---

### Scenario 2 - Obliczenie zasiłku macierzyńskiego dla działalności gospodarczej — duży ZUS (Priority: P1) 🎯 MVP

Użytkownik wybiera formę zatrudnienia "Działalność gospodarcza", wybiera typ składek "Duży ZUS", a kalkulator automatycznie pobiera aktualną podstawę wymiaru składek i oblicza zasiłek.

**Priority Justification**: Działalność gospodarcza z dużym ZUS to drugi najczęstszy przypadek — kluczowy dla grupy docelowej kalkulatora.

**Independent Test**: Uruchomić kalkulator z wyborem "Działalność gospodarcza" + "Duży ZUS" i zweryfikować wyniki.

**Acceptance Criteria**:

1. **Given** forma zatrudnienia = działalność gospodarcza, typ ZUS = duży ZUS, jedno dziecko, **When** użytkownik kliknie "Oblicz", **Then** widzi poprawne wyniki zasiłku obliczone na podstawie aktualnej podstawy dużego ZUS
2. **Given** typ ZUS = duży ZUS, **When** formularz się wyświetli, **Then** pole podstawy składek jest automatycznie wypełnione aktualną wartością i zablokowane do edycji

**Calculation Example**:

```
Input data:
- Forma zatrudnienia: Działalność gospodarcza
- Typ ZUS: Duży ZUS
- Podstawa składek (2026): 5 203,80 zł
- Liczba dzieci: 1

Intermediate:
- Podstawa zasiłku: 5 203,80 - 13,71% = 4 490,36 zł
- Stawka dzienna: 4 490,36 / 30 = 149,68 zł

Wariant A – stały 81,5% przez 52 tygodnie (364 dni):
- Stawka dzienna 81,5%: 121,99 zł
- Łącznie: 121,99 × 364 = 44 404,36 zł

Wariant B – zmienny 100% / 70%:
- Urlop macierzyński 100% (140 dni): 149,68 × 140 = 20 955,20 zł
- Urlop rodzicielski 70% (224 dni): 104,78 × 224 = 23 470,72 zł
- Łącznie: 44 425,92 zł
```

---

### Scenario 3 - Obliczenie zasiłku dla działalności gospodarczej — ZUS preferencyjny (Priority: P1) 🎯 MVP

Użytkownik wybiera "Działalność gospodarcza" i typ składek "ZUS preferencyjny". Kalkulator pobiera aktualną podstawę preferencyjną.

**Priority Justification**: ZUS preferencyjny to częsty wariant wśród nowych przedsiębiorców.

**Acceptance Criteria**:

1. **Given** forma zatrudnienia = działalność gospodarcza, typ ZUS = preferencyjny, jedno dziecko, **When** obliczenie, **Then** wyniki zasiłku obliczone na podstawie aktualnej podstawy preferencyjnego ZUS

---

### Scenario 4 - Obliczenie zasiłku dla działalności gospodarczej — inna podstawa składek (Priority: P1) 🎯 MVP

Użytkownik wybiera "Działalność gospodarcza" i typ składek "Inny", a następnie ręcznie podaje średnią miesięczną podstawę składki chorobowej z ostatnich 12 miesięcy.

**Priority Justification**: Użytkownicy opłacający wyższe składki potrzebują możliwości podania własnej podstawy.

**Acceptance Criteria**:

1. **Given** forma zatrudnienia = działalność gospodarcza, typ ZUS = inny, podstawa = 10 000 zł, jedno dziecko, **When** obliczenie, **Then** wyniki zasiłku obliczone na podstawie podanej kwoty 10 000 zł
2. **Given** typ ZUS = inny, **When** formularz się wyświetli, **Then** pole podstawy składek jest edytowalne

**Calculation Example**:

```
Input data:
- Forma zatrudnienia: Działalność gospodarcza
- Typ ZUS: Inny
- Średnia podstawa składki chorobowej (12 mies.): 10 000,00 zł
- Liczba dzieci: 1

Intermediate:
- Podstawa zasiłku: 10 000,00 - 13,71% = 8 629,00 zł
- Stawka dzienna: 8 629,00 / 30 = 287,63 zł

Wariant A – stały 81,5% przez 52 tygodnie (364 dni):
- Stawka dzienna 81,5%: 234,42 zł
- Łącznie: 234,42 × 364 = 85 328,88 zł

Wariant B – zmienny 100% / 70%:
- Urlop macierzyński 100% (140 dni): 287,63 × 140 = 40 268,20 zł
- Urlop rodzicielski 70% (224 dni): 201,34 × 224 = 45 100,16 zł
- Łącznie: 85 368,36 zł
```

---

### Scenario 5 - Obliczenie zasiłku dla porodu mnogiego (Priority: P2)

Użytkownik podaje liczbę dzieci urodzonych w jednym porodzie (2–5+). Kalkulator dostosowuje długość urlopu macierzyńskiego i rodzicielskiego.

**Priority Justification**: Porody mnogie zmieniają wymiar urlopów — ważny wariant, ale rzadszy.

**Acceptance Criteria**:

1. **Given** jedno dziecko, **When** obliczenie, **Then** urlop macierzyński = 20 tyg., rodzicielski = 32 tyg., łącznie = 52 tyg.
2. **Given** dwoje dzieci, **When** obliczenie, **Then** urlop macierzyński = 31 tyg., rodzicielski = 34 tyg., łącznie = 65 tyg.
3. **Given** troje dzieci, **When** obliczenie, **Then** urlop macierzyński = 33 tyg., rodzicielski = 34 tyg., łącznie = 67 tyg.
4. **Given** czworo dzieci, **When** obliczenie, **Then** urlop macierzyński = 35 tyg., rodzicielski = 34 tyg., łącznie = 69 tyg.
5. **Given** pięcioro lub więcej dzieci, **When** obliczenie, **Then** urlop macierzyński = 37 tyg., rodzicielski = 34 tyg., łącznie = 71 tyg.

---

### Scenario 6 - Wyświetlenie dodatkowego 9-tygodniowego urlopu rodzicielskiego dla drugiego rodzica (Priority: P2)

Kalkulator wyświetla informację o dodatkowych 9 tygodniach urlopu rodzicielskiego przysługujących drugiemu rodzicowi (70% podstawy). Ten urlop jest nieprzenoszalny.

**Priority Justification**: Istotna informacja wprowadzona od 2023 r. — użytkownicy powinni o niej wiedzieć.

**Acceptance Criteria**:

1. **Given** dowolne dane wejściowe, **When** wyniki się wyświetlą, **Then** widoczna jest sekcja informująca o dodatkowych 9 tygodniach (63 dni) urlopu rodzicielskiego dla drugiego rodzica w wysokości 70% podstawy zasiłku
2. **Given** podstawa zasiłku = 4 817,86 zł, **When** obliczenie, **Then** zasiłek dla drugiego rodzica (9 tyg.) = 112,42 zł/dzień × 63 dni = 7 082,46 zł

---

### Edge Cases

- Gdy średnia pensja brutto lub podstawa składek = 0, kalkulator wyświetla komunikat walidacji
- Gdy użytkownik poda wartość ujemną, kalkulator wyświetla komunikat walidacji
- Zmiana roku wpływa na wysokość podstawy dużego i preferencyjnego ZUS — wartości powinny być pobierane z `constantsStore`
- Przy działalności gospodarczej z ulgą na start (brak składki chorobowej) — zasiłek macierzyński nie przysługuje; kalkulator powinien o tym informować
- Gdy użytkownik poda podstawę składki chorobowej przekraczającą 250% przeciętnego wynagrodzenia — walidacja blokuje obliczenie z komunikatem

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Kalkulator MUSI umożliwiać wybór formy zatrudnienia: umowa o pracę lub działalność gospodarcza
- **FR-002**: Dla umowy o pracę kalkulator MUSI przyjmować średnią miesięczną pensję brutto z ostatnich 12 miesięcy
- **FR-003**: Dla działalności gospodarczej kalkulator MUSI umożliwiać wybór typu ZUS: duży ZUS, ZUS preferencyjny, inny
- **FR-004**: Dla dużego ZUS i preferencyjnego ZUS kalkulator MUSI automatycznie pobierać aktualną podstawę wymiaru składek
- **FR-005**: Dla typu "inny" kalkulator MUSI umożliwiać ręczne podanie średniej miesięcznej podstawy składki chorobowej
- **FR-006**: Kalkulator MUSI umożliwiać wybór liczby dzieci urodzonych w jednym porodzie (1–5+) za pomocą kontrolki select/dropdown z predefiniowanymi opcjami
- **FR-007**: Kalkulator MUSI obliczać i wyświetlać oba warianty wypłaty zasiłku: stały 81,5% oraz zmienny 100%/70%
- **FR-008**: Kalkulator MUSI wyświetlać podział na urlop macierzyński i rodzicielski z kwotami dla każdego okresu
- **FR-009**: Kalkulator MUSI wyświetlać informację o dodatkowych 9 tygodniach urlopu rodzicielskiego dla drugiego rodzica (70%)
- **FR-010**: Kalkulator MUSI walidować dane wejściowe przy użyciu `validationRules`
- **FR-011**: Kalkulator MUSI używać klasy `BasicCalculator` jako bazy
- **FR-012**: UI MUSI używać komponentów Quasar
- **FR-013**: Tekst w UI MUSI być w języku polskim
- **FR-014**: Wyniki obu wariantów wypłaty MUSZĄ być wyświetlane jednocześnie obok siebie (dwie kolumny/sekcje) umożliwiając porównanie bez dodatkowych kliknięć
- **FR-015**: Dla typu ZUS "inny" kalkulator MUSI walidować górny limit podstawy składki chorobowej (250% przeciętnego wynagrodzenia) i blokować obliczenie z komunikatem o przekroczeniu limitu

### Calculation Requirements

- **CR-001**: Podstawa zasiłku = średnia pensja brutto (lub podstawa składki chorobowej) pomniejszona o 13,71%
- **CR-002**: Stawka dzienna = podstawa zasiłku / 30
- **CR-003**: Wariant A (stały): stawka dzienna × 81,5% × łączna liczba dni urlopów
- **CR-004**: Wariant B (zmienny): urlop macierzyński = stawka dzienna × 100% × dni; urlop rodzicielski = stawka dzienna × 70% × dni
- **CR-005**: Dodatkowy urlop drugiego rodzica = stawka dzienna × 70% × 63 dni (9 tygodni)
- **CR-006**: Wymiar urlopu macierzyńskiego zależny od liczby dzieci: 1→20 tyg., 2→31 tyg., 3→33 tyg., 4→35 tyg., 5+→37 tyg.
- **CR-007**: Wymiar urlopu rodzicielskiego: 1 dziecko→32 tyg., 2+ dzieci→34 tyg.
- **CR-008**: Obliczenia MUSZĄ używać aktualnych stawek z `constantsStore`
- **CR-009**: Wyniki MUSZĄ być zaokrąglone do 2 miejsc po przecinku (grosze)
- **CR-010**: Testy MUSZĄ zawierać wszystkie wartości wyjściowe

### Key Entities

- **InputFields**: Dane wejściowe — forma zatrudnienia (employmentType), typ ZUS (zusType), średnia pensja/podstawa składki (averageBasis), liczba dzieci (childrenCount)
- **Result**: Obiekt wyniku — podstawa zasiłku (benefitBasis), stawka dzienna (dailyRate), kwoty dla wariantu A i B z podziałem na urlop macierzyński i rodzicielski, kwota dla drugiego rodzica
- **LeavePeriodsConfig**: Konfiguracja wymiarów urlopów w zależności od liczby dzieci

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: Użytkownik może obliczyć zasiłek macierzyński w maksymalnie 3 krokach (wybór formy, podanie kwoty, obliczenie)
- **SC-002**: Wyniki kalkulatora są zgodne z oficjalnymi kalkulatorami (ZUS, inFakt) dla tych samych danych wejściowych
- **SC-003**: Wszystkie testy jednostkowe przechodzą z poprawnymi wartościami dla obu wariantów wypłaty
- **SC-004**: UI działa poprawnie na urządzeniach mobilnych i desktopowych
