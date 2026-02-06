# Feature Specification: Automatyczne pobieranie danych inflacyjnych z publicznego API GUS

**Branch**: `001-auto-inflation-api`  
**Created**: 2026-02-06  
**Status**: Clarified  
**Input**: User description: "Moduł inflacja i siła nabywcza pieniądza korzysta z danych dostarczonych przez api, przeze mnie, przez co muszę ręcznie je dodawać. Znajdź ogólnodostępne API, żeby pobierać je automatycznie i żeby dane były zawsze aktualne."

## Kontekst

Obecnie moduł inflacji pobiera dane z własnego endpointu (`kalkulatorfinansowy.app/inflation.php`), który wymaga ręcznego uzupełniania danych. Dane pochodzą z GUS (Główny Urząd Statystyczny) i zawierają miesięczne wskaźniki cen towarów i usług konsumpcyjnych (CPI).

### Analiza dostępnych publicznych API

| API | Granulacja | Klucz API | Dane miesięczne | Uwagi |
|-----|-----------|-----------|-----------------|-------|
| **GUS BDL API** (`bdl.stat.gov.pl/api/v1`) | Roczna/kwartalna | Nie wymagany | Nie (tylko roczne i kwartalne) | Zmienna `217230` = CPI ogółem (roczny), `P2496` = kwartalne |
| **GUS DBW API** (`api-dbw.stat.gov.pl`) | Miesięczna | Opcjonalny (wyższe limity) | Tak | Brak dokumentacji, trudne do nawigacji, niestabilne endpointy |
| **dane.gov.pl** | Miesięczna | Nie wymagany | Tak (dataset 2053) | Linki do stron GUS, nie bezpośrednie dane JSON |
| **ECB SDMX API** (`data-api.ecb.europa.eu`) | Miesięczna | Nie wymagany | Tak | HICP dla Polski, dane od 1996, format JSON, wartości już w % (rok do roku) |

**Rekomendacja**: ECB SDMX API jako źródło główne — oferuje miesięczne dane HICP (zharmonizowany wskaźnik cen konsumpcyjnych) dla Polski w formacie JSON, nie wymaga klucza API, dane już w formacie % zmiany rok do roku, stabilne i dobrze udokumentowane API.

Endpoint: `https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod={fromYear}-01`

## Clarifications

### Session 2026-02-06

- Q: Jak powinny być realizowane zapytania do API GUS — bezpośrednio z przeglądarki, przez proxy, czy hybrydowo? → A: Bezpośrednio z przeglądarki (client-side), jeśli CORS pozwala.
- Q: Jak transformować dane z API GUS (indeks CPI np. 103.6) na format aplikacji (zmiana % np. 3.6)? → A: Automatyczna konwersja przez odjęcie 100 od indeksu GUS w warstwie mapowania danych.
- Q: Gdy API GUS jest niedostępne, a użytkownik ma dane w cache (nawet starsze niż 24h), jak powinien zachować się system? → A: Wyświetlić dane z cache bez ostrzeżenia — wykres jasno pokazuje dla jakich miesięcy dane są zawarte.
- Q: Czy użyć wyłącznie DBW API, czy mieć fallback na BDL API (dane kwartalne)? → A: Po dalszym researchu wybrano ECB SDMX API zamiast GUS DBW API — lepiej udokumentowane, stabilne, dane już w formacie %.

## User Scenarios *(required)*

### Scenario 1 - Automatyczne pobieranie danych inflacyjnych (Priority: P1) MVP

Użytkownik otwiera zakładkę "Inflacja" w kalkulatorze. System automatycznie pobiera aktualne miesięczne wskaźniki CPI z publicznego API GUS zamiast z własnego endpointu. Dane są wyświetlane na wykresie identycznie jak dotychczas.

**Priority Justification**: Główny cel feature'a — eliminacja ręcznego dodawania danych.

**Independent Test**: Otworzyć moduł inflacji, wybrać okres "Ostatnie 5 lat" i zweryfikować, że wykres wyświetla aktualne dane miesięczne zgodne z danymi na stronie GUS.

**Acceptance Criteria**:

1. **Given** użytkownik otwiera moduł inflacji, **When** wybiera okres (np. ostatnie 5 lat), **Then** system pobiera dane z publicznego API GUS i wyświetla wykres z miesięcznymi wskaźnikami CPI
2. **Given** API GUS zwraca dane, **When** dane są przetwarzane, **Then** wartości inflacji (rok, miesiąc, wartość %) są identyczne z danymi publikowanymi przez GUS
3. **Given** użytkownik zmienia okres na wykresie, **When** nowy okres jest wybrany, **Then** system pobiera odpowiednie dane z API GUS dla wybranego zakresu lat

**Calculation Example**:
```
Input data:
- Okres: Ostatnie 5 lat (od 2021)
- API endpoint: GUS DBW API

Expected results:
- Wykres zawiera miesięczne punkty danych od stycznia 2021
- Każdy punkt zawiera: rok, miesiąc, wartość inflacji (np. styczeń 2024: 3.9%)
- Dane są posortowane chronologicznie
```

---

### Scenario 2 - Siła nabywcza pieniądza z danymi z API (Priority: P1) MVP

Użytkownik otwiera zakładkę "Siła nabywcza pieniądza", wpisuje kwotę i wybiera okres. System pobiera dane inflacyjne z publicznego API GUS i oblicza zmianę siły nabywczej w czasie.

**Priority Justification**: Drugi widok modułu, korzysta z tych samych danych — musi działać równolegle.

**Acceptance Criteria**:

1. **Given** użytkownik wpisuje kwotę 10000 zł i wybiera okres "Ostatnie 5 lat", **When** dane są pobrane z API, **Then** wykres pokazuje spadek siły nabywczej w oparciu o miesięczne dane CPI
2. **Given** API zwraca dane w trybie "lastMonth" (ostatni miesiąc roku), **When** dane są przetwarzane, **Then** obliczenia siły nabywczej są poprawne

---

### Scenario 3 - Obsługa błędów API (Priority: P2)

System gracefully obsługuje sytuacje, gdy API GUS jest niedostępne lub zwraca błędy.

**Priority Justification**: Niezawodność — API zewnętrzne może być czasowo niedostępne.

**Acceptance Criteria**:

1. **Given** API GUS jest niedostępne (timeout, 5xx), **When** użytkownik otwiera moduł inflacji, **Then** system wyświetla komunikat o tymczasowej niedostępności danych
2. **Given** API GUS zwraca pustą odpowiedź, **When** dane są przetwarzane, **Then** system wyświetla komunikat "Brak danych"
3. **Given** API GUS zwraca dane w nieoczekiwanym formacie, **When** dane są parsowane, **Then** system nie crashuje i wyświetla odpowiedni komunikat

---

### Scenario 4 - Cache danych (Priority: P3)

System cachuje pobrane dane, aby zmniejszyć liczbę zapytań do API GUS i przyspieszyć ładowanie.

**Priority Justification**: Optymalizacja — dane inflacyjne zmieniają się raz w miesiącu, nie ma potrzeby odpytywać API przy każdym otwarciu strony.

**Acceptance Criteria**:

1. **Given** dane zostały pobrane z API, **When** użytkownik ponownie otwiera moduł w tej samej sesji, **Then** dane są ładowane z cache bez ponownego zapytania do API
2. **Given** dane w cache są starsze niż 24 godziny, **When** użytkownik otwiera moduł, **Then** system pobiera świeże dane z API
3. **Given** API GUS jest niedostępne, **When** użytkownik otwiera moduł i istnieją dane w cache (nawet starsze niż 24h), **Then** system wyświetla dane z cache bez ostrzeżenia

---

### Edge Cases

- Co jeśli API GUS zmieni strukturę odpowiedzi lub endpoint?
- Co jeśli dane za bieżący miesiąc nie są jeszcze opublikowane?
- Co jeśli użytkownik ma zablokowany dostęp do domeny `data-api.ecb.europa.eu` (np. firewall korporacyjny)?
- Co jeśli przekroczony zostanie limit zapytań API (5 req/s dla anonimowych)?
- Co jeśli API zwraca dane z opóźnieniem (GUS publikuje dane CPI ok. 15. dnia następnego miesiąca)?

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Moduł MUSI pobierać miesięczne dane HICP z publicznego ECB SDMX API (`data-api.ecb.europa.eu`) zamiast z `kalkulatorfinansowy.app/inflation.php`
- **FR-002**: Moduł MUSI obsługiwać dwa tryby danych: pełne dane miesięczne (dla wykresu inflacji) oraz dane z ostatniego miesiąca roku (dla siły nabywczej)
- **FR-003**: Moduł MUSI zachować istniejący interfejs użytkownika — zmiana dotyczy wyłącznie źródła danych
- **FR-004**: Moduł MUSI obsługiwać błędy API i wyświetlać odpowiednie komunikaty w języku polskim
- **FR-005**: Moduł MUSI mapować odpowiedź API GUS na istniejący interfejs `InflationEntry` (year, month, value)
- **FR-008**: Konwersja indeksu nie jest wymagana — ECB SDMX API zwraca dane już w formacie % zmiany rok do roku
- **FR-006**: UI MUSI używać komponentów Quasar
- **FR-007**: Wszystkie teksty UI MUSZĄ być w języku polskim

### Data Requirements

- **DR-001**: Dane MUSZĄ zawierać miesięczne wskaźniki CPI (zmiana % rok do roku) dla Polski
- **DR-002**: Dane MUSZĄ być dostępne w zakresie co najmniej 20 lat wstecz
- **DR-003**: Dane MUSZĄ być aktualizowane automatycznie po publikacji przez GUS (bez interwencji developera)

### Key Entities

- **InflationEntry**: Pojedynczy wpis danych inflacyjnych — rok, miesiąc, wartość procentowa zmiany CPI
- **InflationApiResponse**: Surowa odpowiedź z API GUS — wymaga mapowania na `InflationEntry`
- **GUS API Config**: Konfiguracja endpointów API GUS — base URL, identyfikatory zmiennych, parametry zapytań

## Assumptions

- ECB SDMX API (`data-api.ecb.europa.eu`) pozostanie publicznie dostępne i bezpłatne
- Struktura odpowiedzi ECB SDMX API nie zmieni się bez wcześniejszego powiadomienia
- Dane HICP publikowane przez Eurostat są wiarygodne i spójne z danymi GUS (HICP vs CPI — minimalne różnice metodologiczne)
- Aplikacja jest uruchamiana w przeglądarce z dostępem do internetu
- Zapytania do ECB SDMX API są realizowane bezpośrednio z przeglądarki (client-side), bez proxy

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Dane inflacyjne są pobierane automatycznie z publicznego API GUS bez ręcznej interwencji
- **SC-002**: Wykresy inflacji i siły nabywczej wyświetlają identyczne dane jak dotychczasowe rozwiązanie
- **SC-003**: Nowe dane CPI są dostępne w aplikacji automatycznie po ich publikacji przez GUS
- **SC-004**: Czas ładowania danych z API GUS nie przekracza 3 sekund
- **SC-005**: Moduł poprawnie obsługuje niedostępność API bez crashowania aplikacji
- **SC-006**: Wszystkie testy jednostkowe przechodzą z poprawnymi wartościami
