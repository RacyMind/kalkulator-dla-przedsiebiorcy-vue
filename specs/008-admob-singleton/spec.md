# Feature Specification: AdMob Singleton — jednokrotne ładowanie reklamy

**Branch**: `008-admob-singleton`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "AdMob: ładuj reklamę 1× przy starcie i reużywaj obiekt (singleton). Request po reklamę rób TYLKO raz przy starcie apki. Trzymaj jeden statyczny obiekt reklamy w pamięci i wyświetlaj go gdzie trzeba. Reklama sama się odświeża co X sekund — nie twórz obiektu wielokrotnie. Inaczej psujesz statystyki (requesty) i spada CPC + inne wskaźniki. Zaplanuj gdzie wyświetlać reklamę."

## Kontekst

### Stan obecny

Aplikacja „Kalkulator finansowy" działa jako:
- **Web/PWA** — przeglądarka, brak reklam
- **Natywna Android** — Capacitor 6 (`racyMind.kalkulator`), brak integracji AdMob

Obecnie komponent `Advert.vue` wyświetla wewnętrzne banery (Donate / TaxDonation) i jest używany w ~30 stronach modułów, umieszczony między formularzem a wynikami.

### Problem

Wielokrotne tworzenie obiektów reklamowych AdMob (np. przy każdej nawigacji między modułami) powoduje:
- Nadmiarowe requesty reklamowe → zaniżone statystyki (CTR, fill rate)
- Spadek CPC i eCPM
- Gorsze doświadczenie użytkownika (migotanie, opóźnienia ładowania)

### Rozwiązanie

Jeden obiekt reklamy (singleton) tworzony raz przy starcie aplikacji. AdMob SDK automatycznie odświeża banner co ~60 sekund. Komponent UI jedynie wyświetla istniejący obiekt — nie tworzy nowego.

## User Scenarios *(required)*

### Scenario 1 — Inicjalizacja reklamy przy starcie (Priority: P1) 🎯 MVP

Użytkownik uruchamia natywną aplikację Android. System inicjalizuje AdMob SDK i ładuje jeden obiekt reklamy bannerowej. Obiekt jest przechowywany w pamięci jako singleton i gotowy do wyświetlenia na dowolnej stronie modułu.

**Priority Justification**: Bez tego scenariusza żadna reklama nie zostanie wyświetlona. To fundament całej integracji.

**Independent Test**: Uruchomić aplikację na urządzeniu Android / emulatorze, zweryfikować w logach że `AdMob.initialize()` i `AdMob.showBanner()` zostały wywołane dokładnie raz.

**Acceptance Criteria**:

1. **Given** użytkownik uruchamia natywną aplikację Android, **When** aplikacja się ładuje, **Then** AdMob SDK jest inicjalizowany dokładnie raz
2. **Given** AdMob SDK jest zainicjalizowany, **When** ładowanie zakończone, **Then** tworzony jest dokładnie jeden obiekt reklamy bannerowej
3. **Given** aplikacja działa w przeglądarce (web/PWA), **When** strona się ładuje, **Then** AdMob NIE jest inicjalizowany, wyświetlany jest dotychczasowy komponent `Advert.vue`

---

### Scenario 2 — Wyświetlanie bannera na stronach modułów (Priority: P1) 🎯 MVP

Użytkownik nawiguje między modułami kalkulatora. Na każdej stronie modułu, w miejscu komponentu `Advert`, wyświetlany jest banner AdMob (na natywnej aplikacji) lub dotychczasowy baner wewnętrzny (na webie).

**Priority Justification**: Kluczowe dla monetyzacji — reklama musi być widoczna na stronach, które użytkownik odwiedza.

**Independent Test**: Nawigować między 3+ modułami, zweryfikować że banner jest widoczny na każdej stronie i że w logach NIE pojawiają się dodatkowe requesty `AdMob.showBanner()`.

**Acceptance Criteria**:

1. **Given** użytkownik jest na stronie modułu (np. `/samozatrudnienie`), **When** strona się renderuje, **Then** banner AdMob jest widoczny w wyznaczonym miejscu
2. **Given** użytkownik przechodzi na inną stronę modułu, **When** nowa strona się renderuje, **Then** ten sam obiekt reklamy jest reużywany (brak nowego requestu)
3. **Given** reklama jest wyświetlona, **When** upłynie interwał odświeżania AdMob (~60s), **Then** SDK automatycznie odświeża kreację bez ingerencji aplikacji

---

### Scenario 3 — Brak reklamy na stronach informacyjnych (Priority: P2)

Niektóre strony (np. Polityka prywatności, Kontakt, Historia zmian) mogą nie wyświetlać reklamy, aby zachować profesjonalny wygląd.

**Priority Justification**: Ulepszenie UX, ale nie blokuje monetyzacji.

**Acceptance Criteria**:

1. **Given** użytkownik jest na stronie Polityka prywatności, **When** strona się renderuje, **Then** banner AdMob NIE jest widoczny
2. **Given** użytkownik wraca na stronę modułu kalkulatora, **When** strona się renderuje, **Then** banner AdMob jest ponownie widoczny

---

### Scenario 4 — Obsługa błędów ładowania reklamy (Priority: P2)

Jeśli reklama nie załaduje się (brak sieci, brak fill), aplikacja działa normalnie bez reklamy. Użytkownik nie widzi pustego miejsca ani komunikatu o błędzie.

**Priority Justification**: Ważne dla stabilności, ale nie blokuje MVP.

**Acceptance Criteria**:

1. **Given** brak połączenia z internetem, **When** aplikacja próbuje załadować reklamę, **Then** błąd jest logowany, a użytkownik nie widzi żadnego komunikatu o błędzie
2. **Given** reklama nie załadowała się, **When** użytkownik korzysta z kalkulatora, **Then** aplikacja działa normalnie, w miejscu reklamy wyświetlany jest fallback (dotychczasowy Donate/TaxDonation) lub puste miejsce jest ukryte

---

### Edge Cases

- **Brak sieci przy starcie** — singleton jest tworzony, ale reklama nie ładuje się. Przy powrocie sieci SDK powinien automatycznie załadować reklamę przy następnym odświeżeniu.
- **Aplikacja w tle i powrót** — obiekt singleton pozostaje w pamięci. AdMob SDK zarządza cyklem życia reklamy.
- **Zmiana orientacji ekranu** — banner powinien się dostosować do nowej szerokości ekranu.
- **Wiele szybkich nawigacji** — singleton gwarantuje, że nie powstają duplikaty obiektów reklamowych.
- **Web/PWA** — AdMob nie jest inicjalizowany. Komponent `Advert.vue` działa jak dotychczas.

## Planowanie rozmieszczenia reklam

### Strony Z reklamą (banner AdMob na natywnej aplikacji)

Wszystkie strony modułów kalkulatorów — czyli wszędzie, gdzie obecnie używany jest `<Advert />`:

| Kategoria | Moduły |
|-----------|--------|
| **Firma** | Samozatrudnienie, Porównywarka B2B, Działalność niezarejestrowana, Rzeczywisty koszt zakupu, Limit kasy fiskalnej, Limit VAT, Składki ZUS za część miesiąca |
| **Podatki** | Faktura VAT, Rozliczenie z małżonkiem |
| **Oszczędności** | Ulga IKZE, Kalkulator IKE, Lokata, Odsetki, Obligacje skarbowe, Zysk z najmu |
| **Praca** | Umowa o pracę, Umowa zlecenie, Umowa o dzieło, Zasiłek chorobowy, Ekwiwalent za urlop |
| **Waluty** | Kursy walut, Przelicznik walut |
| **Info** | Inflacja, Siła nabywcza pieniądza, Informacje o wynagrodzeniu, Terminy US/ZUS/PFRON |

### Strony BEZ reklamy

| Strona | Powód |
|--------|-------|
| Strona główna (`/`) | Czyste pierwsze wrażenie |
| Polityka prywatności | Wymóg prawny, profesjonalny wygląd |
| Kontakt | Profesjonalny wygląd |
| Historia zmian | Strona informacyjna |

### Typ reklamy

- **Banner** (AdMob Banner Ad) — stały banner wyświetlany w wyznaczonym miejscu na stronie
- Pozycja: między formularzem a wynikami (obecna pozycja `<Advert />`)
- Rozmiar: adaptacyjny (Adaptive Banner) — dopasowuje się do szerokości ekranu

## Requirements *(required)*

### Functional Requirements

- **FR-001**: System MUSI inicjalizować AdMob SDK dokładnie raz przy starcie natywnej aplikacji Android
- **FR-002**: System MUSI tworzyć dokładnie jeden obiekt reklamy bannerowej (singleton) i przechowywać go w pamięci przez cały czas życia aplikacji
- **FR-003**: System NIE MOŻE tworzyć nowych obiektów reklamowych przy nawigacji między stronami
- **FR-004**: System MUSI rozróżniać platformę — AdMob tylko na natywnej aplikacji (Capacitor), na webie/PWA wyświetlać dotychczasowy `Advert.vue`
- **FR-005**: System MUSI obsługiwać błędy ładowania reklamy bez wpływu na działanie aplikacji
- **FR-006**: System MUSI pozwalać na konfigurację, które strony wyświetlają reklamę, a które nie
- **FR-007**: System MUSI używać Adaptive Banner (rozmiar dopasowany do szerokości ekranu)
- **FR-008**: System NIE MOŻE ręcznie odświeżać reklamy — AdMob SDK zarządza cyklem odświeżania

### Technical Constraints (architektura projektu)

- Aplikacja używa Capacitor 6 dla Android
- Plugin AdMob: `@capacitor-community/admob` (kompatybilny z Capacitor 6)
- Singleton powinien być zaimplementowany jako serwis/composable wywoływany raz w `App.vue` lub boot file
- Komponent `Advert.vue` powinien zostać zmodyfikowany, aby na natywnej platformie wyświetlał banner AdMob zamiast wewnętrznych banerów
- Konfiguracja Ad Unit ID powinna być przechowywana w zmiennych środowiskowych lub konfiguracji Capacitor, NIE hardcoded w kodzie

### Key Entities

- **AdMobService (singleton)**: Serwis zarządzający cyklem życia reklamy — inicjalizacja, ładowanie, wyświetlanie/ukrywanie bannera. Tworzony raz przy starcie aplikacji.
- **Advert.vue (zmodyfikowany)**: Komponent UI decydujący o wyświetleniu bannera AdMob (natywna) lub wewnętrznego banera (web). Nie tworzy obiektów reklamowych.
- **Ad Unit ID**: Identyfikator jednostki reklamowej AdMob. Osobny dla testów (test Ad Unit) i produkcji.

## Assumptions

- Konto AdMob jest już skonfigurowane i posiada Ad Unit ID dla bannera
- Aplikacja jest publikowana w Google Play i spełnia wymagania AdMob
- AdMob SDK automatycznie odświeża banner co ~60 sekund (domyślne zachowanie)
- Użytkownik wyraził zgodę na reklamy (lub GDPR consent jest obsługiwany osobno — poza zakresem tego feature)

## Out of Scope

- Reklamy interstitial (pełnoekranowe)
- Reklamy rewarded (za nagrodę)
- GDPR consent dialog (UMP SDK) — osobny feature
- iOS — aplikacja obecnie nie jest publikowana na iOS
- Analityka reklam (dashboard AdMob jest wystarczający)

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: AdMob SDK jest inicjalizowany dokładnie 1 raz przy starcie aplikacji (weryfikacja w logach)
- **SC-002**: Obiekt reklamy bannerowej jest tworzony dokładnie 1 raz (weryfikacja w logach — brak duplikatów)
- **SC-003**: Nawigacja między 10 modułami generuje dokładnie 1 request reklamowy (nie 10)
- **SC-004**: Banner jest widoczny na wszystkich stronach modułów kalkulatorów
- **SC-005**: Banner NIE jest widoczny na stronach informacyjnych (Polityka prywatności, Kontakt, Historia zmian)
- **SC-006**: Aplikacja webowa/PWA działa bez zmian — wyświetla dotychczasowe banery wewnętrzne
- **SC-007**: Błąd ładowania reklamy nie wpływa na działanie kalkulatorów
