# Feature Specification: Uporządkowanie menu (sekcje UX)

**Branch**: `004-menu-sekcje-ux`  
**Created**: 2026-01-24  
**Status**: Draft  
**Input**: User description: "Przeanalizuj strukturę menu i zaproponuj podział na sekcje tematyczne,  tak by był wysoki UX"

## User Scenarios *(required)*

### Scenario 1 - Szybkie znalezienie modułu po sekcjach (Priority: P1) 🎯 MVP

Użytkownik otwiera menu boczne i chce przejść do konkretnego modułu (np. "Umowa o pracę" lub "Kursy walut"). Oczekuje, że moduły są pogrupowane w logiczne sekcje tematyczne, a nazwy sekcji są zrozumiałe i przewidywalne.

**Priority Justification**: To podstawowy cel menu aplikacji: odnalezienie modułu bez frustracji i błądzenia.

**Independent Test**: Otworzyć menu i zweryfikować, że każda pozycja znajduje się w oczekiwanej sekcji wg mapowania poniżej.

**Acceptance Criteria**:

1. **Given** użytkownik otworzył menu, **When** szuka modułu związanego z pracą (np. "Umowa zlecenie"), **Then** znajduje go w sekcji "Praca i umowy".
2. **Given** użytkownik otworzył menu, **When** szuka modułu walutowego ("Kursy walut" / "Przelicznik walut"), **Then** znajduje go w sekcji "Waluty".
3. **Given** użytkownik otworzył menu, **When** przegląda listę, **Then** nie widzi tej samej pozycji (tego samego linku docelowego) w więcej niż jednej sekcji.

**Calculation Example**:
```
Oczekiwany podział sekcji (propozycja UX):

1) Firma i działalność
- Samozatrudnienie (B2B)
- Porównywarka B2B
- Działalność niezarejestrowana
- Składki ZUS za część miesiąca
- Limit zwolnienia z ewidencjonowania w kasie fiskalnej

2) Podatki i rozliczenia
- Faktura VAT
- Limit zwolnienia z VAT
- Ulga podatkowa IKZE
- Rozliczenie z małżonkiem
- Rzeczywisty koszt zakupu

3) Praca i umowy
- Umowa o pracę
- Umowa zlecenie
- Umowa o dzieło
- Zasiłek chorobowy
- Ekwiwalent za niewykorzystany urlop

4) Oszczędzanie i inwestycje
- Lokata
- Odsetki
- Obligacje skarbowe

5) Waluty
- Kursy walut
- Przelicznik walut

6) Informacje
- Inflacja
- Siła nabywcza pieniądza
- Informacje o wynagrodzeniu
- Terminy w US, ZUS i PFRON

7) Aplikacja i pomoc
- (pozycje systemowe, kontakt, polityki, social, repo)
```

---

### Scenario 2 - Wyszukiwanie w menu (Priority: P2)

Użytkownik wpisuje frazę w pole wyszukiwania w menu i oczekuje, że wyniki zostaną poprawnie odfiltrowane we wszystkich sekcjach, bez mieszania pozycji lub pokazywania pustych sekcji.

**Priority Justification**: Wyszukiwarka jest kluczowa przy większej liczbie modułów.

**Acceptance Criteria**:

1. **Given** menu jest otwarte, **When** użytkownik wpisze "vat", **Then** widzi tylko pozycje pasujące do frazy (np. "Faktura VAT", "Limit zwolnienia z VAT") w odpowiednich sekcjach.
2. **Given** menu jest otwarte, **When** fraza nie pasuje do żadnej pozycji, **Then** nie są renderowane sekcje bez wyników.

---

### Scenario 3 - Utrzymanie spójności i unikanie duplikatów (Priority: P2)

Użytkownik przegląda menu i oczekuje, że każdy moduł występuje w jednym, jednoznacznym miejscu, a nazewnictwo jest spójne.

**Priority Justification**: Duplikaty zwiększają poznawcze obciążenie i wrażenie bałaganu.

**Acceptance Criteria**:

1. **Given** istnieje pozycja "Rozliczenie z małżonkiem", **When** użytkownik przegląda menu, **Then** widzi ją tylko raz (w jednej sekcji).

### Edge Cases

- Co jeśli użytkownik korzysta z bardzo małego ekranu i sekcje wymagają przewijania?
- Co jeśli tytuły są podobne (np. "Kursy walut" vs "Przelicznik walut") i użytkownik polega na opisach?
- Co jeśli pozycja jest linkiem zewnętrznym (np. Google Play, Facebook, GitHub) i nie powinna mieszać się z modułami kalkulatorów?

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Menu MUST prezentować moduły w sekcjach tematycznych o nazwach zrozumiałych dla użytkownika.
- **FR-002**: Każda pozycja menu (link docelowy) MUST występować w dokładnie jednej sekcji (brak duplikatów).
- **FR-003**: Pozycje "Aplikacja"/pomocnicze (kontakt, polityki, social, repo) MUST być oddzielone od modułów obliczeniowych w osobnej sekcji.
- **FR-004**: Wyszukiwanie w menu MUST filtrować po tytule i opisie pozycji we wszystkich sekcjach.
- **FR-005**: Cały tekst w menu MUST być w języku polskim.

### Calculation Requirements

- **CR-001**: Kolejność sekcji MUST odzwierciedlać typowe intencje użytkownika: najpierw moduły "codzienne" (firma/praca), dalej narzędzia i informacje.
- **CR-002**: Nazwy sekcji MUST być spójne stylistycznie (rzeczowniki lub krótkie frazy) i nie mogą się dublować znaczeniowo.

### Key Entities

- **MenuSection**: Sekcja tematyczna w menu (np. "Praca i umowy"), zawiera listę pozycji.
- **MenuItem**: Pojedyncza pozycja w menu (tytuł, opis, link docelowy).
- **InternalLink**: Link wewnętrzny (nawigacja do modułu aplikacji).
- **ExternalLink**: Link zewnętrzny (np. Google Play, Facebook, GitHub) przypisany do sekcji "Aplikacja i pomoc".

## Assumptions

- Struktura menu ma zostać zmieniona poprzez przegrupowanie istniejących pozycji, bez zmiany ich treści merytorycznej.
- W menu można pokazywać nagłówki sekcji oraz listę pozycji pod każdą sekcją.
- Wyszukiwarka menu pozostaje dostępna i działa na tytule oraz opisie pozycji.

## Dependencies

- Lista pozycji menu jest utrzymywana w jednym miejscu (źródło prawdy) i może być podzielona na sekcje.
- Pozycje mogą wskazywać na link wewnętrzny lub zewnętrzny, aby dało się rozdzielić moduły od sekcji "Aplikacja i pomoc".

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: Użytkownik odnajduje dowolny moduł z listy w maksymalnie 2 próbach wyboru sekcji (bez użycia wyszukiwarki).
- **SC-002**: Żaden link docelowy nie występuje w menu więcej niż raz.
- **SC-003**: Wyszukiwanie w menu poprawnie zawęża listę pozycji we wszystkich sekcjach (brak pustych nagłówków).
- **SC-004**: Menu pozostaje czytelne na mobile i desktop (sekcje i tytuły nie tracą znaczenia przy przewijaniu).
