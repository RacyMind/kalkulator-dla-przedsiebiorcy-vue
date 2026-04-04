# Plan funkcji: Kalkulator leasingu operacyjnego

## Skrót

Nowy moduł kalkulatora leasingu operacyjnego dla przedsiębiorców. Użytkownik podaje wartość przedmiotu, parametry umowy leasingowej (opłata wstępna, liczba rat, wartość wykupu, oprocentowanie) oraz opcje podatkowe (typ przedmiotu, sposób użytkowania VAT). Kalkulator wylicza harmonogram rat, podział na część kapitałową i odsetkową, łączny koszt leasingu oraz podsumowanie podatkowe (KUP, VAT do odliczenia).

- **Typ zmiany:** nowy moduł
- **Moduły referencyjne:** `contractWork` (wzorzec struktury i UI), `savingsPlan` (harmonogram okresowy, tabela wyników), `investment` (obliczenia finansowe)
- **Wynik dla użytkownika:** szybka symulacja leasingu operacyjnego z harmonogramem rat i podsumowaniem kosztów podatkowych

## Funkcje do implementacji

### MVP

- Obliczanie rat równych (annuity) leasingu operacyjnego z opłatą wstępną i wartością wykupu
- Harmonogram rat z podziałem na część kapitałową i odsetkową
- Podsumowanie: łączny koszt leasingu, łączne odsetki, łączna kwota do zapłaty
- Rozróżnienie typu przedmiotu: samochód osobowy vs inne (maszyny, pojazdy >3,5t)
- Dla samochodów osobowych: obliczenie proporcji KUP wg limitu (100/150/225 tys. zł)
- Odliczenie VAT: 50% lub 100% (zależnie od sposobu użytkowania)
- Wykres kołowy: struktura kosztów (kapitał, odsetki, opłata wstępna)

### P2

- Raty malejące (liniowe) jako alternatywny tryb obliczeń
- Porównanie rat równych vs malejących w jednym widoku
- Eksport harmonogramu (kopiowanie do schowka lub CSV)
- Zapisywanie i porównywanie wielu symulacji (wzorzec z `savingsPlan`)

### Poza zakresem

- Leasing finansowy (odrębna logika amortyzacji i VAT)
- Pożyczka leasingowa / kredyt
- Ubezpieczenie AC/OC/GAP w kalkulacji
- Kalkulator wykupu po zakończeniu umowy

## Struktura rozwiązania

- **Typ zmiany:** nowy moduł
- **Moduły referencyjne:** `contractWork` (struktura katalogu, store, Form/ResultList/Statistics), `savingsPlan` (BasicCalculator z harmonogramem), `investment` (proste obliczenia finansowe)
- **Kluczowe elementy implementacji:** store, logic (LeasingCalculator), interfaces (InputFields, Result), pages/Index.vue, components (Form, ResultList, Schedule, Statistics), types, testy
- **Miejsca integracji w repo:**
  - `src/components/leasing/` — nowy katalog modułu
  - `src/router/routes.ts` — nowy route `/leasing-operacyjny`
  - `src/components/changeLogs/logs.ts` — wpis o nowym module
  - `test/vitest/__tests__/modules/leasing/` — testy jednostkowe

### Struktura katalogów

```text
src/components/leasing/
├── components/
│   ├── Form.vue
│   ├── ResultList.vue
│   ├── Schedule.vue
│   └── Statistics.vue
├── interfaces/
│   ├── InputFields.ts
│   └── Result.ts
├── logic/
│   └── LeasingCalculator.ts
├── pages/
│   └── Index.vue
├── store.ts
└── types/
    └── LeasingTypes.ts
```

## UI

### Layout i przepływ

Układ dwukolumnowy zgodny z wzorcem `contractWork`: formularz po lewej, wyniki po prawej. Formularz podzielony na sekcje (Quasar `FormSection`). Wyniki składają się z trzech części:

1. **Podsumowanie** (`ResultList`) — kluczowe wartości liczbowe
2. **Harmonogram rat** (`Schedule`) — tabela `QTable` z paginacją lub przewijaniem
3. **Wykres** (`Statistics`) — wykres kołowy ze strukturą kosztów

Po kliknięciu „Oblicz" wyniki pojawiają się z automatycznym przewinięciem (`useScrollToResults`).

### Pola wejściowe

| Pole                     | Typ UI                                                            | Model danych                         | Wymagane      | Domyślna wartość              | Walidacja                                          | Wpływ na wynik                     |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------ | ------------- | ----------------------------- | -------------------------------------------------- | ---------------------------------- |
| Wartość przedmiotu netto | `QInput` number, suffix „zł"                                      | `netAssetValue: number`              | tak           | 100 000                       | `requiredAmount`, `greaterThan(0)`                 | Bazowa kwota do obliczeń           |
| Opłata wstępna           | `QInput` number, suffix „%"                                       | `initialPaymentRate: number`         | tak           | 10                            | `requiredAmount`, `minValue(0)`, `maxValue(90)`    | Zmniejsza kwotę finansowaną        |
| Liczba rat               | `QInput` number, suffix „mies."                                   | `installmentCount: number`           | tak           | 36                            | `requiredAmount`, `minValue(24)`, `maxValue(84)`   | Okres leasingu                     |
| Wartość wykupu           | `QInput` number, suffix „%"                                       | `residualValueRate: number`          | tak           | 1                             | `requiredAmount`, `minValue(0)`, `maxValue(50)`    | Wartość rezydualna na koniec umowy |
| Oprocentowanie roczne    | `QInput` number, suffix „%"                                       | `annualInterestRate: number`         | tak           | 8                             | `requiredAmount`, `greaterThan(0)`, `maxValue(30)` | Koszt finansowania                 |
| Typ przedmiotu           | `QSelect`                                                         | `assetType: AssetType`               | tak           | `AssetType.Car`               | —                                                  | Determinuje limity KUP             |
| Kategoria emisji CO₂     | `QSelect`, widoczne gdy `assetType === Car`                       | `emissionCategory: EmissionCategory` | tak (dla aut) | `EmissionCategory.Combustion` | —                                                  | Limit KUP: 100/150/225 tys.        |
| Odliczenie VAT           | `QSelect`                                                         | `vatDeductionRate: VatDeductionRate` | tak           | `VatDeductionRate.Half` (50%) | —                                                  | Kwota VAT do odliczenia            |
| Stawka VAT               | `VatTaxRateSelect` (istniejący komponent, opcje: 23%, 8%, 5%, 0%) | `vatRate: AvailableVatRate`          | tak           | 0.23 (23%)                    | —                                                  | Obliczenie VAT na ratach           |

### Wyniki

Wartości netto są wartościami głównymi. Kwoty brutto wyświetlane jako podtekst w `ListRow` (mniejszy font, kolor `text-grey-7`), np.:

```
Rata miesięczna          2 567,89 zł
                   brutto 3 158,51 zł
```

#### Sekcja 1 — Rata i płatności

| Wynik             | Tooltip                                                                                | Źródło/wzór                                | Warunki           |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------- |
| Rata miesięczna   | „Stała miesięczna rata netto. Składa się z części kapitałowej i odsetkowej."           | formuła annuity z wartością rezydualną     | zawsze, highlight |
| Opłata wstępna    | „Jednorazowa wpłata na początku umowy, zmniejsza kwotę finansowaną."                   | `netAssetValue * initialPaymentRate / 100` | zawsze            |
| Kwota finansowana | „Wartość przedmiotu pomniejszona o opłatę wstępną — ta kwota jest rozkładana na raty." | `netAssetValue - opłata wstępna`           | zawsze            |
| Wartość wykupu    | „Kwota do zapłaty po zakończeniu umowy, aby stać się właścicielem przedmiotu."         | `netAssetValue * residualValueRate / 100`  | zawsze            |

#### Sekcja 2 — Łączne koszty

| Wynik                 | Tooltip                                                                                | Źródło/wzór                                   | Warunki |
| --------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| Łączny koszt leasingu | „Suma wszystkich płatności: opłata wstępna + raty + wykup."                            | opłata wstępna + suma rat + wykup             | zawsze  |
| Łączne odsetki        | „Całkowity koszt finansowania — różnica między sumą płatności a wartością przedmiotu." | łączny koszt netto − wartość netto przedmiotu | zawsze  |
| Łączny VAT            | „Suma podatku VAT naliczonego na wszystkich płatnościach."                             | suma VAT z rat + VAT z wpłaty + VAT z wykupu  | zawsze  |
| VAT do odliczenia     | „Kwota VAT, którą możesz odliczyć w zależności od sposobu użytkowania przedmiotu."     | łączny VAT × vatDeductionRate                 | zawsze  |

#### Sekcja 3 — Aspekty podatkowe (widoczna tylko dla samochodów osobowych)

| Wynik         | Tooltip                                                                                                             | Źródło/wzór                                               | Warunki             |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------- |
| Proporcja KUP | „Wskaźnik ograniczający koszty podatkowe, gdy wartość samochodu przekracza ustawowy limit."                         | `min(1, limit / netAssetValue)`                           | gdy wartość > limit |
| Łączne KUP    | „Suma kosztów uzyskania przychodu: część kapitałowa rat × proporcja + odsetki (100%) + opłata wstępna × proporcja." | suma (kapitał × proporcja + odsetki + wpłata × proporcja) | zawsze (dla aut)    |

#### Sekcja 4 — Harmonogram i wykres

| Wynik                    | Forma                                                                                                                                                                                           | Warunki |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Harmonogram rat          | `QList` z `QExpansionItem` — każda rata jako zwijany wiersz. Nagłówek: „Rata X — 2 567,89 zł". Po rozwinięciu: część kapitałowa, część odsetkowa, saldo po racie. Domyślnie wszystkie zwinięte. | zawsze  |
| Wykres struktury kosztów | `PieChart` — segmenty: opłata wstępna, łączne odsetki, łączny kapitał w ratach, wykup                                                                                                           | zawsze  |

### Tooltipy w formularzu

| Pole                     | Tooltip                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Wartość przedmiotu netto | „Cena netto przedmiotu leasingu (bez VAT). Jeśli znasz cenę brutto, podziel ją przez 1,23."                             |
| Opłata wstępna           | „Procent wartości przedmiotu płatny na początku umowy. Im wyższa, tym niższa rata."                                     |
| Liczba rat               | „Minimalny okres leasingu operacyjnego to 24 miesiące (wymóg ustawowy)."                                                |
| Wartość wykupu           | „Procent wartości przedmiotu do zapłaty po zakończeniu umowy. Typowo 1–20%."                                            |
| Oprocentowanie roczne    | „Nominalna roczna stopa procentowa. W praktyce to WIBOR + marża leasingodawcy."                                         |
| Kategoria emisji CO₂     | „Kategoria wpływa na limit kosztów podatkowych: spalinowe 100 tys., hybrydy plug-in 150 tys., elektryczne 225 tys. zł." |
| Odliczenie VAT           | „100% — auto wyłącznie firmowe (wymaga VAT-26 i kilometrówki). 50% — użytkowanie mieszane."                             |

## Logika i dane

### Reguły obliczeń

**Rata równa (annuity) z wartością rezydualną:**

```
F = netAssetValue - initialPayment          // kwota finansowana
RV = netAssetValue * residualValueRate / 100 // wartość rezydualna
r = annualInterestRate / 100 / 12            // miesięczna stopa procentowa
n = installmentCount                         // liczba rat

PMT = (F - RV / (1 + r)^n) * r / (1 - (1 + r)^(-n))
```

**Harmonogram (dla każdej raty i):**

```
odsetki_i = saldo_(i-1) * r
kapital_i = PMT - odsetki_i
saldo_i = saldo_(i-1) - kapital_i
```

Saldo początkowe = F. Po ostatniej racie saldo powinno wynosić ≈ RV (z dokładnością do zaokrągleń). Ostatnia rata jest korygowana, aby saldo wynosiło dokładnie RV.

**Proporcja KUP (samochody osobowe):**

```
limit = getLimitForEmissionCategory(emissionCategory)
  // Combustion (≥50 g CO₂/km): 100 000 zł
  // PluginHybrid (<50 g CO₂/km): 150 000 zł
  // Electric:                     225 000 zł

proportion = min(1, limit / netAssetValue)
```

Proporcję stosuje się do:

- części kapitałowej raty (netto)
- opłaty wstępnej (netto)
- nieodliczonego VAT (50% VAT przy użytkowaniu mieszanym)

Proporcji NIE stosuje się do:

- części odsetkowej raty (odsetki są KUP w 100%)

**VAT:**

```
vatOnInstallment = PMT * vatRate / 100
deductibleVat = vatOnInstallment * vatDeductionRate
nonDeductibleVat = vatOnInstallment - deductibleVat
```

Dla samochodów osobowych nieodliczony VAT wchodzi w podstawę obliczenia proporcji KUP.

### Wykorzystywane typy i enumy

```typescript
// types/LeasingTypes.ts

enum AssetType {
  Car = 'car',
  Other = 'other',
}

enum EmissionCategory {
  Combustion = 'combustion', // ≥50 g CO₂/km → limit 100 000 zł
  PluginHybrid = 'pluginHybrid', // <50 g CO₂/km → limit 150 000 zł
  Electric = 'electric', // 0 g CO₂/km   → limit 225 000 zł
}

enum VatDeductionRate {
  Full = 1, // 100% — wyłącznie działalność gospodarcza
  Half = 0.5, // 50%  — użytkowanie mieszane
  None = 0, // 0%   — nievatowiec
}

interface ScheduleRow {
  month: number
  installmentNet: number
  capitalPart: number
  interestPart: number
  remainingBalance: number
}
```

### Zależności od istniejących store lub helperów

- `helpers.round()` — zaokrąglanie kwot
- `pln()` z `src/composables/currencyFormat` — formatowanie walut w UI
- `validationRules` — walidacja pól formularza
- `useLocalStorage` z `@vueuse/core` — zapamiętywanie danych formularza
- `useScrollToResults` — przewijanie do wyników
- `usePieChart` — wykres kołowy
- `FormSection`, `SubmitButton`, `ListRow`, `ModulePageLayout`, `SectionHeader` — komponenty współdzielone
- `BasicCalculator` — klasa bazowa kalkulatora
- `Calculator` — interfejs kalkulatora

### Local storage i domyślne wartości

Klucze localStorage z prefixem `leasing/form/`:

- `leasing/form/netAssetValue` → 100000
- `leasing/form/initialPaymentRate` → 10
- `leasing/form/installmentCount` → 36
- `leasing/form/residualValueRate` → 1
- `leasing/form/annualInterestRate` → 8
- `leasing/form/assetType` → `AssetType.Car`
- `leasing/form/emissionCategory` → `EmissionCategory.Combustion`
- `leasing/form/vatDeductionRate` → `VatDeductionRate.Half`
- `leasing/form/vatRate` → 0.23

### Edge cases i zachowanie błędów

- **Oprocentowanie 0%:** formuła annuity upraszcza się do `PMT = (F - RV) / n`. Kalkulator musi obsłużyć `r === 0` osobną ścieżką, aby uniknąć dzielenia przez 0.
- **Opłata wstępna + wykup ≥ 100%:** walidacja w formularzu uniemożliwia ten scenariusz (suma `initialPaymentRate + residualValueRate` nie może przekroczyć 100%).
- **Wartość przedmiotu ≤ 0:** blokowane przez walidację `greaterThan(0)`.
- **Korekta ostatniej raty:** ostatnia rata jest korygowana tak, aby saldo po jej zapłacie wynosiło dokładnie wartość rezydualną. Zapobiega to błędom zaokrągleń kumulowanym na harmonogramie.
- **Typ przedmiotu „inne":** pominięcie sekcji limitu KUP i kategorii emisji. Proporcja = 1, VAT 100%.
- **Brak VAT (nievatowiec):** `VatDeductionRate.None` — nieodliczony VAT doliczany do kosztów brutto, ale proporcja KUP liczona od kwoty brutto.

## Testy i akceptacja

### Testy jednostkowe logiki

Plik: `test/vitest/__tests__/modules/leasing/LeasingCalculator.test.ts`

Rok statyczny w `beforeEach`: 2026.

Przypadki testowe (assert na wszystkich polach wyniku):

1. **Bazowy scenariusz** — samochód 100 000 zł netto, 10% wpłaty, 36 rat, 1% wykup, 8% rocznie
   - Oczekiwane: rata netto, łączny koszt, łączne odsetki, proporcja KUP = 1
2. **Samochód powyżej limitu** — 200 000 zł netto, emisja ≥50 g CO₂ (limit 100 000 zł)
   - Oczekiwane: proporcja KUP = 0.5, ograniczone KUP z rat
3. **Samochód elektryczny** — 250 000 zł netto, limit 225 000 zł
   - Oczekiwane: proporcja KUP = 0.9, odliczenie VAT 50%
4. **Przedmiot inny niż samochód** — maszyna 500 000 zł
   - Oczekiwane: proporcja = 1, VAT 100%
5. **Oprocentowanie 0%** — osobna ścieżka obliczeń
   - Oczekiwane: łączne odsetki = 0, rata = (F - RV) / n
6. **Minimalna liczba rat (24)** — graniczny okres
7. **Maksymalna wartość wykupu (50%)** — duża wartość rezydualna
8. **Harmonogram rat** — sprawdzenie, że suma części kapitałowych = kwota finansowana - wartość rezydualna, suma części odsetkowych = łączne odsetki
9. **Korekta ostatniej raty** — saldo po ostatniej racie = wartość rezydualna

### Testy komponentowe

- **Form.vue** — renderowanie, walidacja pól, warunkowe wyświetlanie kategorii emisji
- **Schedule.vue** — poprawne wyświetlanie tabeli harmonogramu
- **ResultList.vue** — wyświetlanie wszystkich pól wyniku

### Miejsca integracji do sprawdzenia

- Route `/leasing-operacyjny` prowadzi do `leasing/pages/Index.vue`
- Breadcrumb wyświetla „Leasing operacyjny"
- Store poprawnie reaguje na zmianę `inputFields`
- `useLocalStorage` zachowuje i przywraca dane formularza

### Kryteria ukończenia

- Wszystkie testy jednostkowe przechodzą
- Formularz działa na desktop i mobile
- Wyniki (podsumowanie, harmonogram, wykres) wyświetlają się poprawnie
- Dane formularza są zapamiętywane w localStorage
- Route jest zarejestrowany, moduł dostępny z nawigacji
- Wpis w changeLog

## Założenia i otwarte pytania

### Założenia

- **Tylko raty równe w MVP.** Raty malejące można dodać w P2 jako drugi tryb w `LeasingCalculator`.
- **Oprocentowanie podawane jako roczna stopa nominalna.** W praktyce firmy leasingowe stosują różne konwencje (WIBOR + marża, stała stopa). Kalkulator przyjmuje jedną łączną stopę roczną.
- **Limity KUP dla samochodów osobowych obowiązują od 01.01.2026.** Nowy limit 100 tys. zł dla aut spalinowych i hybryd z emisją ≥50 g CO₂/km (wcześniej 150 tys. zł). Limity 150 tys. (PHEV) i 225 tys. (EV) bez zmian.
- **Opłata wstępna jest pierwszą płatnością** i nie wchodzi w harmonogram rat miesięcznych. Jest osobną pozycją kosztową.
- **Wartość wykupu jest płatna po ostatniej racie** jako odrębna transakcja.
- **Moduł nie uwzględnia ubezpieczeń (AC, OC, GAP)** — to osobny koszt, poza zakresem MVP.
- **Minimalny okres leasingu operacyjnego: 24 miesiące** (wymóg ustawowy art. 17b ust. 1 pkt 1 ustawy o CIT / art. 23b ust. 1 pkt 1 ustawy o PIT).

### Otwarte pytania

- Czy dodać opcję wpisania wartości brutto przedmiotu (z automatycznym przeliczeniem na netto)? Przydatne, gdy użytkownik zna cenę brutto z salonu.
- Czy w P2 warto dodać pole „WIBOR + marża" zamiast jednego pola oprocentowania, aby symulować zmienną stopę?

## Źródła

- [Jakie skutki podatkowe dla firm ma leasing samochodu osobowego – biznes.gov.pl](https://www.biznes.gov.pl/pl/portal/001436) — sprawdzono: 2026-04-04; potwierdza zasady VAT i KUP w leasingu operacyjnym, prawo do wykupu, minimalny okres umowy.
- [Kalkulator proporcji kosztów podatkowych leasingu samochodów osobowych – fmleasing.pl](https://www.fmleasing.pl/porady/kalkulator-proporcja-koszt-podatek-samochod-osobowy) — sprawdzono: 2026-04-04; potwierdza nowy limit 100 tys. zł od 01.01.2026 dla aut spalinowych ≥50 g CO₂/km, limity 150 tys. (PHEV) i 225 tys. (EV), zasady stosowania proporcji KUP, rozdzielenie limitów dla rat i wykupu.
- [Obliczanie raty leasingu operacyjnego i finansowego – sgbleasing.pl](https://www.sgbleasing.pl/jak-obliczyc-rate-leasingu/) — sprawdzono: 2026-04-04; potwierdza składowe raty (wartość przedmiotu, opłata wstępna, okres, wykup), przykłady obliczeń.
