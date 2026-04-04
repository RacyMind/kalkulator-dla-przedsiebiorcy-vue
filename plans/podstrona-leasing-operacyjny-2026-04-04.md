# Plan funkcji: Podstrona landing page dla leasingu operacyjnego

## Skrót

Rozszerzenie istniejącego modułu `leasing` o publiczną podstronę SEO w `landing-page`, która wyjaśnia zastosowanie leasingu operacyjnego i prowadzi bezpośrednio do kalkulatora w aplikacji. Zmiana wykorzystuje wzorzec istniejących stron z katalogu `landing-page/_pages/`, ekran modułu jako hero screenshot oraz ekspozycję z homepage i sitemapy.

## Funkcje do implementacji

### MVP

- Dodać nową podstronę `landing-page/_pages/leasing-operacyjny.php`
- Uzupełnić meta title, description, FAQ i sekcje treści pod kątem leasingu operacyjnego
- Ustawić CTA prowadzące do `https://kalkulatorfinansowy.app/app/#/leasing-operacyjny`
- Dodać widoczny link do podstrony z homepage landing page
- Dopisać URL do `landing-page/sitemap.xml`
- Użyć rzeczywistego zrzutu ekranu modułu leasingu w hero sekcji

### P2

- Dodać osobną sekcję featured na homepage dla leasingu operacyjnego
- Rozbudować treść podstrony o porównanie leasingu i zakupu gotówkowego
- Przygotować osobny asset OG dla leasingu operacyjnego

### Poza zakresem

- Zmiany w logice kalkulatora `src/components/leasing/`
- Rozbudowa modułu o leasing finansowy
- Integracja eksportu harmonogramu do PDF lub CSV

## Struktura rozwiązania

- Typ zmiany: `rozszerzenie istniejącego modułu`
- Moduły lub moduły referencyjne: `landing-page/_pages/kalkulator-b2b.php`, `landing-page/_pages/kalkulator-vat.php`, `src/components/leasing/`
- Kluczowe elementy implementacji: plik strony, CTA do aplikacji, screenshot modułu, karta na homepage, wpis w sitemapie
- Miejsca integracji w repo:
  - `landing-page/_pages/leasing-operacyjny.php`
  - `landing-page/index.php`
  - `landing-page/sitemap.xml`
  - `landing-page/images/modules/leasing-operacyjny.*`

## UI

### Layout i przepływ

- Hero sekcja zgodna z layoutem `landing-page/_includes/layout.php`: nagłówek, krótki opis, CTA i screenshot modułu
- 4 sekcje treści w artykule: czym jest kalkulator, co policzy, jak korzystać, kiedy się przydaje
- FAQ na dole strony z pytaniami odpowiadającymi zakresowi modułu
- Sekcja `Powiązane kalkulatory` z linkami do B2B, VAT i rzeczywistego kosztu zakupu
- CTA końcowe prowadzące bezpośrednio do formularza w aplikacji

### Pola wejściowe

| Pole                     | Typ UI          | Model danych         | Wymagane | Domyślna wartość              | Walidacja     | Wpływ na wynik                      |
| ------------------------ | --------------- | -------------------- | -------- | ----------------------------- | ------------- | ----------------------------------- |
| Wartość przedmiotu netto | `QInput` number | `netAssetValue`      | tak      | 100000                        | kwota > 0     | baza wszystkich wyliczeń            |
| Typ przedmiotu           | `QSelect`       | `assetType`          | tak      | `AssetType.Car`               | wybór z listy | decyduje o limitach kosztów         |
| Kategoria emisji CO₂     | `QSelect`       | `emissionCategory`   | dla auta | `EmissionCategory.Combustion` | wybór z listy | wpływa na limit kosztów podatkowych |
| Opłata wstępna           | `QInput` number | `initialPaymentRate` | tak      | 10                            | 0–90%         | obniża kwotę finansowaną            |
| Liczba rat               | `QInput` number | `installmentCount`   | tak      | 36                            | 24–84         | ustala długość harmonogramu         |
| Wartość wykupu           | `QInput` number | `residualValueRate`  | tak      | 1                             | 0–50%         | wpływa na ratę i koszt końcowy      |
| Oprocentowanie roczne    | `QInput` number | `annualInterestRate` | tak      | 8                             | 0–30%         | wpływa na część odsetkową rat       |
| Stawka VAT               | `QSelect`       | `vatRate`            | tak      | 23%                           | wybór z listy | wpływa na kwoty brutto i VAT        |
| Odliczenie VAT           | `QSelect`       | `vatDeductionRate`   | tak      | 50%                           | wybór z listy | wpływa na VAT do odliczenia         |

### Wyniki

| Wynik                              | Forma prezentacji          | Źródło/wzór                                        | Warunki wyświetlania |
| ---------------------------------- | -------------------------- | -------------------------------------------------- | -------------------- |
| Rata miesięczna netto i brutto     | lista wyników              | `monthlyInstallmentNet`, `monthlyInstallmentGross` | po obliczeniu        |
| Opłata wstępna i kwota finansowana | lista wyników              | `initialPaymentNet`, `financedAmount`              | po obliczeniu        |
| Wartość wykupu                     | lista wyników              | `residualValueNet`, `residualValueGross`           | po obliczeniu        |
| Łączny koszt leasingu i odsetki    | lista wyników + statystyki | `totalCostNet`, `totalCostGross`, `totalInterest`  | po obliczeniu        |
| VAT łącznie i VAT do odliczenia    | lista wyników              | `totalVat`, `deductibleVat`                        | po obliczeniu        |
| Łączne koszty podatkowe            | lista wyników              | `totalKup`, `kupProportion`                        | po obliczeniu        |
| Harmonogram rat                    | zakładka tabelaryczna      | `schedule`                                         | po obliczeniu        |

## Logika i dane

- Podstrona nie duplikuje obliczeń; opisuje zakres istniejącego modułu `src/components/leasing/`
- Treść musi być zgodna z realnym formularzem: brak obietnic leasingu finansowego, eksportu i porównań wielu ofert
- CTA powinny zawsze kierować do `#/leasing-operacyjny`, a nie do ogólnego dashboardu aplikacji
- Screenshot w hero ma przedstawiać istniejący formularz leasingu operacyjnego
- Homepage powinna linkować zarówno do aplikacji, jak i do nowej podstrony informacyjnej
- Sitemap ma zawierać dokładny adres strony z `lastmod` ustawionym na dzień wdrożenia

## Testy i akceptacja

- Walidacja PHP dla nowych lub zmienionych plików landing page
- Test jednostkowy leasingu: `test/vitest/__tests__/modules/leasing/LeasingCalculator.test.ts`
- Test komponentowy formularza leasingu: `test/vitest/__tests__/modules/leasing/LeasingForm.test.ts`
- Ręczne sprawdzenie, że screenshot istnieje w wariantach `.png` oraz `-400/-640/-960.webp`
- Kryteria ukończenia:
  - podstrona renderuje się przez `page.php`
  - link z homepage prowadzi do nowej strony
  - CTA z podstrony otwierają poprawny moduł aplikacji
  - wpis jest obecny w sitemapie

## Założenia i otwarte pytania

### Założenia

- Publiczna podstrona ma promować istniejący kalkulator, a nie zastępować formularza w landing page
- Treść SEO opiera się na aktualnym zakresie modułu leasingu w repo
- Na homepage wystarczy ekspozycja w siatce „Więcej kalkulatorów”, bez przebudowy całej sekcji hero

### Otwarte pytania

- Czy użytkownik będzie chciał osobną sekcję featured dla leasingu na stronie głównej po publikacji podstawowej wersji?
