# Feature Specification: Kalkulator zysku z najmu

**Branch**: `007-rental-profit-calculator`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "Kalkulator zysku z najmu. Na ryczałcie. Np żeby zobaczyć jaki będzie zysk dla zadanej liczby lat/miesięcy. Przeanalizuj dostępne formy opodatkowania najmu w Polsce."

## Kontekst: Opodatkowanie najmu w Polsce (2026)

Od 2023 roku najem prywatny w Polsce może być rozliczany **wyłącznie ryczałtem od przychodów ewidencjonowanych**. Zasady ogólne (skala podatkowa) nie są już dostępne dla najmu prywatnego.

### Najem prywatny — ryczałt (jedyna dostępna forma od 2023)

- **8,5%** od przychodu do 100 000 zł rocznie
- **12,5%** od nadwyżki przychodu ponad 100 000 zł rocznie
- Małżonkowie rozliczający całość u jednego z nich: limit wynosi 200 000 zł
- Brak możliwości odliczenia kosztów uzyskania przychodu (ryczałt naliczany od przychodu, nie dochodu)
- Wyjątek: opłaty za media i czynsz administracyjny refakturowane na najemcę nie stanowią przychodu wynajmującego (jeśli umowa to przewiduje)
- Brak składki zdrowotnej od najmu prywatnego
- Rozliczenie: PIT-28, płatność miesięczna lub kwartalna

### Najem w ramach działalności gospodarczej (opcjonalnie)

- **Skala podatkowa**: 12%/32% od dochodu + 9% składka zdrowotna od dochodu + kwota wolna 30 000 zł
- **Podatek liniowy**: 19% od dochodu + 4,9% składka zdrowotna od dochodu
- **Ryczałt w DG**: 8,5%/12,5% od przychodu + zryczałtowana składka zdrowotna
- Dodatkowe koszty: ZUS, księgowość
- Od 2023: brak amortyzacji nieruchomości mieszkalnych

### Decyzja projektowa

Kalkulator skupia się na **najmie prywatnym (ryczałt)** jako domyślnej i jedynej dostępnej formie opodatkowania najmu prywatnego od 2023 roku. Jest to najprostsza i najczęściej wybierana forma przez osoby wynajmujące mieszkania prywatnie.

## Clarifications

### Session 2026-02-06

- Q: Czy projekcja wieloletnia powinna uwzględniać coroczną waloryzację czynszu? → A: Tak, opcjonalne pole rocznej waloryzacji czynszu (%) z domyślną wartością 0%
- Q: Jak użytkownik wprowadza okres najmu? → A: Jedno pole — liczba lat (integer, 1–30)
- Q: Jak wyświetlać wyniki — układ UI? → A: Dwie zakładki (q-tabs/q-tab-panels) jak w module samozatrudnienia: „Podsumowanie roczne” i „Projekcja wieloletnia”
- Q: Czy pole „opłaty refakturowane” nie dubluje się z „koszty utrzymania”? → A: Nie — to dwa różne pojęcia. Koszty utrzymania to wydatki wynajmującego (ubezpieczenie, naprawy, kredyt), które nie zmniejszają przychodu do opodatkowania. Opłaty refakturowane to kwoty przekazywane dalej (media, czynsz admin.), które zmniejszają podstawę opodatkowania ryczaltem. Zachowujemy osobne pole + tooltipy z wyjaśnieniem dla użytkownika

## User Scenarios *(required)*

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - Obliczenie zysku z najmu na ryczałcie dla jednego roku (Priority: P1) MVP

Użytkownik chce obliczyć, ile pieniędzy zostanie mu „w kieszeni" z najmu mieszkania po opłaceniu podatku ryczałtowego. Wprowadza miesięczny przychód z najmu, miesięczne koszty utrzymania nieruchomości oraz okres najmu. Kalkulator pokazuje roczny przychód, podatek ryczałtowy, koszty i zysk netto.

**Priority Justification**: Podstawowa funkcjonalność kalkulatora — bez tego moduł nie ma sensu.

**Independent Test**: Wprowadzić dane testowe i zweryfikować, czy wynik podatku i zysku zgadza się z ręcznym obliczeniem.

**Acceptance Criteria**:

1. **Given** użytkownik wprowadził miesięczny przychód z najmu 3 000 zł i miesięczne koszty 500 zł, **When** oblicza zysk dla 12 miesięcy, **Then** widzi roczny przychód, podatek ryczałtowy (8,5%), koszty roczne i zysk netto
2. **Given** roczny przychód przekracza 100 000 zł, **When** oblicza zysk, **Then** podatek naliczany jest wg stawki 8,5% do 100 000 zł i 12,5% od nadwyżki
3. **Given** użytkownik zmienia dane wejściowe, **When** wartości się zmieniają, **Then** wyniki przeliczają się automatycznie

**Calculation Example**:
```
Input data:
- Miesięczny przychód z najmu (czysty czynsz): 3 000 zł
- Miesięczne koszty utrzymania (ubezpieczenie, naprawy, kredyt): 800 zł
  [Tooltip: Twoje wydatki jako wynajmującego — NIE zmniejszają podatku ryczaltowego,
   ale wpływają na realny zysk netto]
- Opłaty refakturowane na najemcę (media, czynsz admin.): 500 zł/mies.
  [Tooltip: Kwoty, które najemca Ci płaci, a Ty przekazujesz dalej (spółdzielnia,
   dostawcy mediów). Zmniejszają przychód do opodatkowania ryczaltem]
- Okres najmu: 1 rok

Expected results:
- Roczny przychód brutto: 36 000,00 zł  (3 000 × 12)
- Przychód do opodatkowania: 30 000,00 zł  (36 000 − 500×12)
- Podatek ryczałtowy (8,5% × 30 000): 2 550,00 zł
- Roczne koszty utrzymania: 9 600,00 zł  (800 × 12)
- Zysk netto: 23 850,00 zł  (36 000 − 2 550 − 9 600)
- Efektywna stopa zwrotu podatku: 7,08%  (2 550 / 36 000 × 100)
- Miesięczny zysk netto: 1 987,50 zł  (23 850 / 12)
```

---

### Scenario 2 - Projekcja zysku na wiele lat (Priority: P1) MVP

Użytkownik chce zobaczyć, ile zarobi na najmie w perspektywie kilku lat. Wprowadza liczbę lat i widzi tabelę z rocznymi wynikami.

**Priority Justification**: Kluczowa funkcjonalność wymieniona wprost w wymaganiach użytkownika — projekcja zysku w czasie.

**Independent Test**: Wprowadzić dane dla 5 lat i sprawdzić, czy tabela zawiera 5 wierszy z poprawnymi wartościami.

**Acceptance Criteria**:

1. **Given** użytkownik wprowadził dane najmu i wybrał okres 5 lat, **When** oblicza projekcję, **Then** widzi tabelę z wynikami dla każdego roku (przychód, podatek, koszty, zysk netto)
2. **Given** projekcja wieloletnia, **When** wyświetlane są wyniki, **Then** widoczna jest suma skumulowana zysku netto za cały okres
3. **Given** użytkownik zmienia liczbę lat, **When** wartość się zmienia, **Then** tabela aktualizuje się automatycznie

**Calculation Example**:
```
Input data:
- Miesięczny przychód z najmu: 3 000 zł
- Miesięczne koszty utrzymania: 800 zł
- Opłaty refakturowane na najemcę: 500 zł/mies.
- Okres: 3 lata

Expected results (tabela):
Rok 1:
  - Przychód do opodatkowania: 30 000,00 zł
  - Podatek: 2 550,00 zł
  - Koszty: 9 600,00 zł
  - Zysk netto: 23 850,00 zł
  - Skumulowany zysk: 23 850,00 zł

Rok 2:
  - Przychód do opodatkowania: 30 000,00 zł
  - Podatek: 2 550,00 zł
  - Koszty: 9 600,00 zł
  - Zysk netto: 23 850,00 zł
  - Skumulowany zysk: 47 700,00 zł

Rok 3:
  - Przychód do opodatkowania: 30 000,00 zł
  - Podatek: 2 550,00 zł
  - Koszty: 9 600,00 zł
  - Zysk netto: 23 850,00 zł
  - Skumulowany zysk: 71 550,00 zł
```

---

### Scenario 3 - Przekroczenie progu 100 000 zł przychodu (Priority: P1) MVP

Użytkownik z wieloma nieruchomościami lub wysokim czynszem przekracza próg 100 000 zł rocznego przychodu. Kalkulator poprawnie nalicza podatek wg dwóch stawek.

**Priority Justification**: Poprawne naliczanie podatku przy przekroczeniu progu jest krytyczne dla wiarygodności kalkulatora.

**Independent Test**: Wprowadzić przychód przekraczający 100 000 zł i zweryfikować podział na dwie stawki.

**Acceptance Criteria**:

1. **Given** roczny przychód do opodatkowania wynosi 150 000 zł, **When** oblicza podatek, **Then** podatek = 8 500 zł (8,5% × 100 000) + 6 250 zł (12,5% × 50 000) = 14 750 zł
2. **Given** przychód poniżej 100 000 zł, **When** oblicza podatek, **Then** stosowana jest wyłącznie stawka 8,5%

**Calculation Example**:
```
Input data:
- Miesięczny przychód z najmu: 15 000 zł
- Opłaty refakturowane: 2 000 zł/mies.
- Miesięczne koszty utrzymania: 3 000 zł
- Okres: 12 miesięcy

Expected results:
- Roczny przychód brutto: 180 000,00 zł
- Przychód do opodatkowania: 156 000,00 zł
- Podatek (8,5% × 100 000 + 12,5% × 56 000): 15 500,00 zł
- Roczne koszty utrzymania: 36 000,00 zł
- Zysk netto: 128 500,00 zł
- Efektywna stawka podatku: 8,61%
```

---

### Scenario 4 - Rozliczenie małżonków (Priority: P2)

Użytkownik może zaznaczyć, że rozlicza najem wspólnie z małżonkiem (całość przychodu u jednego z małżonków). W takim przypadku próg podwyższonej stawki ryczałtu wynosi 200 000 zł zamiast 100 000 zł.

**Priority Justification**: Częsty przypadek — wiele par wynajmuje wspólne mieszkania. Wpływa na próg podatkowy.

**Acceptance Criteria**:

1. **Given** użytkownik zaznaczył opcję rozliczenia małżonków, **When** roczny przychód do opodatkowania wynosi 150 000 zł, **Then** cały przychód opodatkowany jest stawką 8,5% (bo nie przekracza 200 000 zł)
2. **Given** opcja małżonków niezaznaczona, **When** roczny przychód wynosi 150 000 zł, **Then** nadwyżka ponad 100 000 zł opodatkowana jest stawką 12,5%

---

### Scenario 5 - Uwzględnienie pustostanów (Priority: P2)

Użytkownik może określić przewidywany procent pustostanów (miesiące bez najemcy). Kalkulator zmniejsza przychód proporcjonalnie, ale koszty stałe utrzymania pozostają.

**Priority Justification**: Realistyczna projekcja zysku wymaga uwzględnienia okresów bez najemcy.

**Acceptance Criteria**:

1. **Given** użytkownik ustawił pustostany na 1 miesiąc w roku, **When** oblicza zysk roczny, **Then** przychód z najmu naliczany jest za 11 miesięcy, a koszty utrzymania za 12 miesięcy
2. **Given** pustostany = 0, **When** oblicza zysk, **Then** przychód naliczany za pełne 12 miesięcy

---

### Scenario 6 - Wiele nieruchomości (Priority: P3)

Użytkownik wynajmuje kilka nieruchomości i chce zobaczyć łączny zysk. Może dodać wiele nieruchomości, a kalkulator sumuje przychody i stosuje wspólny limit 100 000 zł (lub 200 000 zł dla małżonków).

**Priority Justification**: Zaawansowana funkcjonalność dla użytkowników z portfelem nieruchomości. Limit ryczałtu dotyczy łącznego przychodu ze wszystkich nieruchomości.

**Acceptance Criteria**:

1. **Given** użytkownik dodał 2 nieruchomości z przychodem 60 000 zł i 50 000 zł rocznie, **When** oblicza podatek, **Then** łączny przychód 110 000 zł — podatek = 8 500 zł (8,5% × 100 000) + 1 250 zł (12,5% × 10 000) = 9 750 zł
2. **Given** użytkownik dodaje nową nieruchomość, **When** klika przycisk dodania, **Then** pojawia się nowy formularz z polami dla tej nieruchomości

---

### Edge Cases

- Przychód = 0 zł (brak najemcy przez cały okres) — wynik powinien pokazać tylko koszty jako stratę
- Koszty utrzymania > przychód — zysk netto ujemny, wyświetlony jako strata
- Bardzo długi okres (np. 30 lat) — tabela powinna być czytelna i wydajna
- Przychód dokładnie 100 000 zł — cały opodatkowany stawką 8,5%, bez nadwyżki
- Opłaty refakturowane > przychód z najmu — walidacja: refakturowane opłaty nie mogą przekraczać przychodu brutto
- Okres = 0 miesięcy — walidacja: minimum 1 miesiąc

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Kalkulator MUSI obliczać podatek ryczałtowy od najmu prywatnego wg stawek 8,5% (do 100 000 zł) i 12,5% (nadwyżka)
- **FR-002**: Kalkulator MUSI pozwalać na wprowadzenie: miesięcznego przychodu z najmu, miesięcznych kosztów utrzymania, opłat refakturowanych na najemcę, liczby lat najmu (integer, 1–30)
- **FR-003**: Kalkulator MUSI wyświetlać wyniki w dwóch zakładkach (q-tabs/q-tab-panels, wzorzec jak w module samozatrudnienia): zakładka „Podsumowanie roczne” (przychód brutto, przychód do opodatkowania, podatek ryczałtowy, koszty roczne, zysk netto, efektywna stawka podatku, miesięczny zysk netto) oraz zakładka „Projekcja wieloletnia”
- **FR-004**: Zakładka „Projekcja wieloletnia” MUSI zawierać tabelę rok po roku ze skumulowanym zyskiem
- **FR-005**: Kalkulator MUSI obsługiwać opcję rozliczenia małżonków (próg 200 000 zł)
- **FR-006**: Kalkulator MUSI walidować dane wejściowe z użyciem `validationRules`
- **FR-007**: Kalkulator MUSI używać klasy `BasicCalculator` jako bazy logiki obliczeniowej
- **FR-008**: UI MUSI używać komponentów Quasar
- **FR-009**: Cały tekst UI MUSI być w języku polskim
- **FR-010**: Kalkulator MUSI obsługiwać pustostany (miesiące bez najemcy w skali roku)
- **FR-011**: Wyniki MUSZĄ przeliczać się automatycznie po zmianie danych wejściowych
- **FR-012**: Kalkulator MUSI obsługiwać opcjonalne pole rocznej waloryzacji czynszu (%) z domyślną wartością 0%, stosowane w projekcji wieloletniej do corocznego zwiększania przychodu z najmu
- **FR-013**: Każde pole formularza MUSI posiadać tooltip (Quasar `Tooltip` component) z wyjaśnieniem, czym jest dane pole i jak wpływa na obliczenia. W szczególności pola „koszty utrzymania” i „opłaty refakturowane” MUSZĄ jasno wyjaśniać różnicę między nimi

### Calculation Requirements

- **CR-001**: Obliczenia MUSZĄ używać aktualnych stawek ryczałtu z `constants.ts`
- **CR-002**: Wyniki MUSZĄ być zaokrąglane do 2 miejsc po przecinku (grosze)
- **CR-003**: Testy MUSZĄ zawierać wszystkie wartości wyjściowe
- **CR-004**: Podatek ryczałtowy = min(przychód, próg) × 8,5% + max(0, przychód − próg) × 12,5%, gdzie próg = 100 000 zł (lub 200 000 zł dla małżonków)
- **CR-005**: Przychód do opodatkowania = przychód brutto − opłaty refakturowane na najemcę
- **CR-006**: Zysk netto = przychód brutto − podatek ryczałtowy − koszty utrzymania
- **CR-007**: Efektywna stawka podatku = podatek / przychód brutto × 100%

### Key Entities

- **RentalInput**: Dane wejściowe — miesięczny przychód, koszty utrzymania, opłaty refakturowane, liczba lat (1–30), opcja małżonków, pustostany, roczna waloryzacja czynszu (%)
- **RentalYearResult**: Wynik roczny — przychód brutto, przychód do opodatkowania, podatek, koszty, zysk netto, efektywna stawka, skumulowany zysk
- **RentalSummary**: Podsumowanie — łączny zysk netto, łączny podatek, średni miesięczny zysk, efektywna stawka podatku za cały okres

## Assumptions

- Kalkulator dotyczy wyłącznie najmu prywatnego rozliczanego ryczałtem (jedyna forma od 2023 roku)
- Stawki ryczałtu (8,5% / 12,5%) i próg (100 000 zł / 200 000 zł) są stałe i zdefiniowane w `constants.ts`
- Koszty utrzymania nieruchomości nie są odliczane od podatku (ryczałt naliczany od przychodu), ale wpływają na zysk netto
- W projekcji wieloletniej przychód z najmu może rosnąć o zadany % rocznie (waloryzacja czynszu, domyślnie 0%); koszty utrzymania pozostają stałe
- Opłaty refakturowane na najemcę (media, czynsz administracyjny) nie stanowią przychodu wynajmującego zgodnie z przepisami

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Użytkownik może obliczyć zysk z najmu wprowadzając maksymalnie 4 pola (przychód, koszty, refakturowane opłaty, okres)
- **SC-002**: Wyniki kalkulacji podatku ryczałtowego zgadzają się z ręcznym obliczeniem wg wzorów z przepisów podatkowych
- **SC-003**: Wszystkie testy jednostkowe przechodzą z poprawnymi wartościami
- **SC-004**: UI działa poprawnie na urządzeniach mobilnych i desktopowych
- **SC-005**: Projekcja wieloletnia wyświetla się poprawnie dla okresu 1–30 lat
- **SC-006**: Przekroczenie progu 100 000 zł (lub 200 000 zł) poprawnie dzieli podatek na dwie stawki
