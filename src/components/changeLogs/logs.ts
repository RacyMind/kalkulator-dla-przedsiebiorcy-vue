export default [
  {
    content: '<ul><li>Dostępność WCAG AA — semantyczny HTML, nawigacja klawiaturą, atrybuty ARIA, weryfikacja kontrastu.</li><li>Dodano skip link „Przejdź do treści" dla nawigacji klawiaturą.</li><li>Dodano landmarki (main, nav, footer) i poprawiono hierarchię nagłówków.</li><li>Dodano aria-required na wymaganych polach formularzy.</li><li>Dodano aria-describedby łączące pola z komunikatami walidacji.</li><li>Dodano aria-expanded/aria-label na zwijanych sekcjach formularzy.</li><li>Dodano aria-label na przyciskach z ikonami i wykresach.</li><li>Dodano role=\"status\" na powiadomieniach o błędach walidacji.</li></ul>',
    publish_date: '2026-02-15',
    version: '6.3.0',
  },
  {
    content: '<ul><li>Nowy dashboard z kafelkami modułów pogrupowanymi w 6 sekcji.</li><li>Responsywny układ z panelem bocznym (stały na desktopie, wysuwany na mobile).</li><li>Dwukolumnowy układ stron modułów (formularz + wyniki).</li><li>Nowa ikona aplikacji z kolorem #1565C0.</li><li>Nowoczesny przycisk „Oblicz" i ujednolicone formularze.</li><li>Wykresy donut z animacjami i tooltipami.</li><li>Przycisk „Powrót na górę" przy przewijaniu.</li><li>Animacje przejść między stronami (fade+scale).</li><li>Lista ostatnio używanych modułów w menu bocznym.</li></ul>',
    publish_date: '2026-02-14',
    version: '6.2.0',
  },
  {
    content: '<ul><li>Dodano tryb ciemny (dark mode) z trzema opcjami: jasny, ciemny i automatyczny (zgodny z ustawieniami systemu).</li><li>Przycisk przełączania motywu w pasku nawigacji.</li><li>Wykresy automatycznie dostosowują kolory do wybranego motywu.</li><li>Zapobieganie migotaniu strony (FOUC) przy ładowaniu w trybie ciemnym.</li></ul>',
    publish_date: '2026-02-07',
    version: '6.1.0',
  },
  {
    content: '<ul><li>Refaktoryzacja kodu: migracja na Pinia, ujednolicenie systemu stałych, deduplikacja logiki (findGross, scrollToResults, taxThreshold), nowa paleta kolorów z tokenami CSS (light/dark mode), usunięcie katalogu src/use/.</li></ul>',
    publish_date: '2026-01-26',
    version: '6.0.0',
  },
  {
    content: '<ul><li>Dodano obligacje ROS (6-letnie) i ROD (12-letnie) w module Obligacje skarbowe.</li><li>Dodano tryb stawki godzinowej wraz z odliczeniem urlopu/zwolnienia w module Samozatrudnienie (B2B).</li><li>Moduł Inflacja i Siła nabywcza pieniądza pobiera teraz dane automatycznie z publicznego API Eurostat/ECB (HICP). Dane nie wymagają już ręcznej aktualizacji.</li><li>Dodano moduł Kalkulator zysku z najmu.</li></ul>',
    publish_date: '2026-01-25',
    version: '5.12.0',
  },
  {
    content: '<ul><li>Aktualizacja składek ZUS na 2026 rok.</li><li>Aktualizacja odsetek ustawowych na 2026 rok.</li><li>Aktualizacja współczynnika urlopowego na 2026 rok.</li><li>Aktualizacja oprocentowania obligacji skarbowych na stan z stycznia 2026.</li><li>Ujednolicono wygląd formularzy i przycisków w wybranych modułach.</li><li>Ujednolicono układ stron w modułach: Kontakt, Historia zmian, Limit obrotu dla kasy fiskalnej.</li><li>Dodano moduł Ulga podatkowa IKZE</li><li>Dodano moduł Kalkulator IKE</li><li>Zmiana struktury menu</li></ul>',
    publish_date: '2026-01-24',
    version: '5.11.0',
  },
  {
    content: '<ul><li>Dodano moduł Obligacje skarbowe.</li></ul>',
    publish_date: '2025-03-15',
    version: '5.10.0',
  },
  {
    content: '<ul><li>Aktualizacja składek ZUS na 2025 rok.</li><li>Dodano możliwość wpisania ułamkowej liczby godzin w Umowa zlecenie.</li><li>Poprawiono pomniejsze błędy.</li></ul>',
    publish_date: '2025-01-30',
    version: '5.9.0',
  },
  {
    content: '<ul><li>Dodano wykres w samozatrudnieniu.</li><li>Przebudowano moduł "Umowa o dzieło".</li></ul>',
    publish_date: '2024-03-20',
    version: '5.8.0',
  },
  {
    content: '<ul><li>Usunięcie błędu w wyświetlaniu NaN w wynikach.</li></ul>',
    publish_date: '2024-03-04',
    version: '5.7.1',
  },
  {
    content: '<ul><li>Przebudowa modułu "Zasiłek chorobowy".</li><li>Dodano ostrzeżenie, gdy podstawa opodatkowania przekracza próg podatkowy.</li></ul>',
    publish_date: '2024-02-29',
    version: '5.7.0',
  },
  {
    content: '<ul><li>Poprawiono odliczanie kwoty wolnej od podatku w działalności gospodarczej.</li><li>Dodano wykres kołowy w podsumowaniu pracownika i pracodawcy.</li><li>Dodano autorskie koszty przychodu w module "Rozliczenie z małżonkiem".</li><li>Przebudowa modułu "Ekwiwalent za niewykorzystany urlop".</li><li>Dodano składkę zdrowotną w module "Rzeczywisty koszt zakupu".</li><li>Pomniejsze usprawnienia w interfejsie.</li></ul>',
    publish_date: '2024-02-12',
    version: '5.6.0',
  },
  {
    content: '<ul><li>Dodano moduł "Rzeczywisty koszt zakupu".</li><li>Przebudowa modułu "Informacje o wynagrodzeniu".</li><li>Składki PPK wyłączono z sumy składek ZUS.</li><li>Zmieniono kolor przycisku Oblicz.</li></ul>',
    publish_date: '2024-02-06',
    version: '5.5.0',
  },
  {
    content: '<ul><li>Naprawa błędu w Samozatrudnieniu przy wyborze ryczałtu.</li></ul>',
    publish_date: '2024-01-26',
    version: '5.4.1',
  },
  {
    content: '<ul><li>Dodano moduł "Rozliczenie z małżonkiem".</li></ul>',
    publish_date: '2024-01-25',
    version: '5.4.0',
  },
  {
    content: '<ul><li>Aktualizacja podstawy do wyliczenia składki zdrowotnej dla ryczałtu na 2024 rok.</li></ul>',
    publish_date: '2024-01-22',
    version: '5.3.1',
  },
  {
    content: '<ul><li>Dodano możliwość wyłączenia składek FGŚP.</li><li>Dodano możliwość wyłączenia składek ZUS na Umowę o Pracę.</li><li>Dodano możliwość dodania różnych wartości kosztów autorskich dla poszczególnych miesięcy.</li></ul>',
    publish_date: '2024-01-18',
    version: '5.3.0',
  },

  {
    content: '<ul><li>Dodano moduł "Porównywarka B2B".</li></ul>',
    publish_date: '2024-01-10',
    version: '5.2.0',
  },
  {
    content: '<ul><li>Przebudowa modułu "Działalność niezarejestrowana".</li><li>Zapamiętywanie danych w formularzach - dotyczy modułów przepisanych od wersji 5.0.0.</li><li>Poprawa obliczeń przy niskim przychodzie w formularzu dla B2B.</li><li>Poprawa obliczeń dla wynagrodzenia netto, gdy obowiązuje 2. próg dochodowy.</li><li>Drobne zmiany w formularzu dla B2B.</li></ul>',
    publish_date: '2024-01-08',
    version: '5.1.0',
  },
  {
    content: '<ul><li>Aktualizacja limitu odliczenia składki zdrowotnej przy podatku liniowym na 2024 rok.</li></ul>',
    publish_date: '2024-01-04',
    version: '5.0.1',
  },
  {
    content: '<ul><li>Przebudowa modułu Samozatrudnienie (B2B).</li><li>Przebudowa modułu Umowa o pracę.</li><li>Przebudowa modułu Umowa zlecenie.</li><li>Przebudowa modułu Składki ZUS za część miesiąca.</li><li>Napisanie testów sprawdzających poprawność obliczeń.</li><li>Aktualizacja bibliotek.</li></ul>',
    publish_date: '2023-12-20',
    version: '5.0.0',
  },
  {
    content: '<ul><li>Poprawa wyświetlania wartości w wykresach dla pracownika.</li></ul>',
    publish_date: '2023-11-17',
    version: '4.11.0',
  },
  {
    content: '<ul><li>Aktualizacja bibliotek aplikacji.</li><li>Poprawa service workera do odświeżenia aplikacji po wydaniu nowej wersji.</li></li></ul>',
    publish_date: '2023-02-09',
    version: '4.10.2',
  },
  {
    content: '<ul><li>Poprawa maksymalnej kwoty odliczenia składki zdrowotnej w 2023 roku dla podatku liniowego.</li></ul>',
    publish_date: '2023-01-24',
    version: '4.10.1',
  },
  {
    content: '<ul><li>Dodanie modułu Ekwiwalent za niewykorzystany urlop.</li><li>Poprawa obliczeń podatku zryczałtowanego w Umowie o dzieło.</li><li>Aktualizacja wskaźników dla 2023 roku.</li></ul>',
    publish_date: '2023-01-23',
    version: '4.10.0',
  },
  {
    content: '<ul><li>Refaktoryzacja modułu Kursy walut.</li><li>Refaktoryzacja modułu Przelicznik walut.</li><li>Aktualizacja odsetek ustawowych.</<li><li>Dodanie nawigacji Breadcrumbs.</li></ul>',
    publish_date: '2022-09-28',
    version: '4.9.0',
  },
  {
    content: '<ul><li>Poprawiono błąd w odliczaniu składki zdrowotnej.</li><li>Poprawiono błąd w odliczaniu kwoty wolnej od podatku po przekroczeniu 2. progu.</li><li>Refaktoryzacja modułu Składki ZUS za część miesiąca.</li><li>Aktualizacja bibliotek.</li></ul>',
    publish_date: '2022-07-09',
    version: '4.8.0',
  },
  {
    content: '<ul><li>Dostosowanie kalkulatora do zmian w Polskim Ładzie:<ul><li>pierwsza stawka podatku PIT wynosi 12%,</li><li>odliczenie połowy składki zdrowotnej dla ryczałtu,</li><li>odliczenie cześći składki zdrowotnej dla podatku liniowego - do limitu 8700 zł,<li>likwidacja ulgi dla klasy średniej.</li></ul></li></ul>',
    publish_date: '2022-06-25',
    version: '4.7.0',
  },
  {
    content: '<ul><li>Dodanie modułu Siła nabywcza pieniądza.</li></ul>',
    publish_date: '2022-05-12',
    version: '4.6.0',
  },
  {
    content: '<ul><li>Naprawa błędu w obliczeniach podatku dla ryczałtu w Samozatrudnieniu</li></ul>',
    publish_date: '2022-04-16',
    version: '4.5.1',
  },
  {
    content: '<ul><li>Refaktoryzacja modułu Samozatrudnienie.</li><li>Refaktoryzacja modułu Umowy o pracę.</li><li>Refaktoryzacja modułu Umowy zlecenie.</li><li>Dodanie składek na FP i FGŚP w module Umowy zlecenie.</li><li>Dodanie kwoty wolnej od podatku i 2. progu podatkowego w module Umowy zlecenie.</li><li>Naprawa błędu dodającego podatek za PPK od pracodawcy przy aktywnej uldze dla młodych.</li><li>Usunięcie składki na Fundusz Pracy z kosztów przychodu przy ryczałcie w module Samozatrudnienie.</li></ul>',
    publish_date: '2022-04-06',
    version: '4.5.0',
  },
  {
    content: '<ul><li>Aktualizacja stawek składki zdrowotnej dla ryczałtu.</li></ul>',
    publish_date: '2022-02-02',
    version: '4.4.2',
  },
  {
    content: '<ul><li>Poprawa wyliczeń składki zdrowotnej i podatku w Samozatrudnieniu.</li><li>Wycofanie modułu Rozliczenie z małżonkiem.</li></ul>',
    publish_date: '2022-01-08',
    version: '4.4.1',
  },
  {
    content: '<ul><li>Dodano moduł Terminy w US, ZUS i PFRON.</li><li>Dodano moduł Informacje o wynagrodzeniu.</li><li>Refaktoryzacja modułu Działalność niezarejestrowana.</li><li>Refaktoryzacja modułu Limit obrotu dla kasy fiskalnej.</li><li>Refaktoryzacja modułu Limit sprzedaży dla zwolnienia z VAT.</li><li>Refaktoryzacja modułu Lokata.</li><li>Refaktoryzacja modułu Odsetki.</li><li>Refaktoryzacja modułu Zasiłek chorobowy.</li><li>Refaktoryzacja modułu Umowa o dzieło.</li><li>Zaktualizowano składki ZUS w module Składki ZUS za część miesiąca.</li></ul>',
    publish_date: '2022-01-02',
    version: '4.4.0',
  },
  {
    content: '<ul><li>Dodano obsługę TypeScript.</li><li>Refaktoryzacja modułu faktur (użyto TypeScript).</li><li>Poprawiono błąd przy obliczaniu składki zdrowotnej dla ryczałtu w 2022 r.</li><li>Poprawiono błąd w uwzględnianiu kosztów przy obliczaniu ulgi dla klasy średniej w Samozatrudnieniu.</li><li>Dodano wyszukiwarkę modułów.</li></ul>',
    publish_date: '2021-12-08',
    version: '4.3.0',
  },
  {
    content: '<ul><li>Dodano moduł rozliczania z małżonkiem (wersja beta).</li><li>Aktualizacja kwot bazowych dla 2022 roku.<li>Dodano wybór roku w umowie dzieło.</li><li>Drobne zmiany w interfejsie.</li></ul>',
    publish_date: '2021-11-06',
    version: '4.2.0',
  },
  {
    content: '<ul><li>Dodano moduł inflacji.</li><li>Dodano stawkę godzinową w umowie zlecenie.</li><li>Poprawiono service worker dla PWA.</li><li>Poprawiono obliczenia przy zerowym PIT dla młodych i 50% kosztach uzyskania przychodu.</li><li>Drobne poprawki w interfejsie.</li></ul>',
    publish_date: '2021-10-25',
    version: '4.1.0',
  },
  {
    content: '<ul><li>Odświeżono ikonę aplikacji.</li><li>Poprawiono font dla polskich liter.</li></ul>',
    publish_date: '2021-10-22',
    version: '4.0.2',
  },
  {
    content: '<ul><li>Naprawiono błąd w obliczaniu kwoty brutto w umowie zlecenie, gdy byłe aktywne ulgi dla studenta i zerowy pit dla młodych.</li></ul>',
    publish_date: '2021-10-21',
    version: '4.0.1',
  },
  {
    content: '<ul><li>Refaktoryzacja modułu samozatrudnienia:<ul><li>Dodano możliwość zmiany kwoty brutto dla każdego miesiąca.</li><li>Dodano opcję zmiany roku podatkowego.<li>Uwzględnia zmiany wprowadzane przez Polski Ład.</li></li></ul></li><li>Refaktoryzacja modułu umowy o pracę:<ul><li>Dodano możliwość zmiany kwoty brutto dla każdego miesiąca.</li><li>Dodano opcję zmiany roku podatkowego.<li>Uwzględnia zmiany wprowadzane przez Polski Ład.</li></li></ul></li><li>Refaktoryzacja modułu umowy zlecenie:<ul><li>Dodano możliwość zmiany kwoty brutto dla każdego miesiąca.</li><li>Dodano opcję zmiany roku podatkowego.</li></ul></li><li>Refaktoryzacja modułu umowy dzieło.</li><li>Refaktoryzacja modułu działalności niezarejestrowanej.</li></ul>',
    publish_date: '2021-10-21',
    version: '4.0.0',

  },
  {
    content: '<ul><li>Użyto Composition API do formatowania walut.</li><li>Dodano możliwość wyświetlenia archiwalnych kursów walut.</li><li>Dodano wykres z archiwalnymi kursami dla pojedynczej waluty.</li><li>Refaktoryzacja modułu faktur.</li><li>Dodano przycisk do zamknięcia popup.</li><li>Aktualizacja bibliotek.</li></ul>',
    publish_date: '2021-09-20',
    version: '3.12.0',
  },
  {
    content: '<ul><li>Dodano moduł do obliczania składki ZUS dla przedsiębiorców za część miesiąca.</li><li>Poprawiono wyświetlanie wykresu dla 0% VAT w Faktura VAT.</li><li>Poprawiono wyłączanie przycisków, gdy dane są niekompletne.</li></ul>',
    publish_date: '2021-07-01',
    version: '3.11.0',
  },
  {
    content: '<ul><li>Dodano możliwość wpisania podstawy składek ZUS w samozatrudnieniu.</li></ul>',
    publish_date: '2021-06-22',
    version: '3.10.0',
  },
  {
    content: '<ul><li>Dodano moduł do obliczania limitu zwolnienia z VAT.</li></ul>',
    publish_date: '2021-06-01',
    version: '3.9.0',
  },
  {
    content: '<ul><li>Dodano moduł działalności niezarejestrowanej.</li></ul>',
    publish_date: '2021-05-25',
    version: '3.8.0',
  },
  {
    content: '<ul><li>Poprawiono wartość 2. progu w samozatrudnieniu w Polskim Ładzie.</li></ul>',
    publish_date: '2021-05-20',
    version: '3.7.1',
  },
  {
    content: '<ul><li>Poprawiono obliczenie podatku przy zerowym PIT dla młodych po przekroczeniu limitu.</li><li>Dodano moduł Limit obrotu dla kasy fiskalnej.</li><li>Ujednolicono kolory.</li><li>Zablokowano możliwość wyświetlania ujemnej składki zdrowotnej w Polskim Ładzie.</li></ul>',
    publish_date: '2021-05-19',
    version: '3.7.0',
  },
  {
    content: '<ul><li>Poprawiono maksymalne zakresy dla PPK.</li></ul>',
    publish_date: '2021-05-18',
    version: '3.6.3',
  },
  {
    content: '<ul><li>Poprawiono błąd w obliczeniach przy niezerowych kosztach w samozatrudnieniu przy podatku liniowym.</li></ul>',
    publish_date: '2021-05-17',
    version: '3.6.2',
  },
  {
    content: '<ul><li>Poprawiono błąd w obliczeniach przy niezerowych kosztach w samozatrudnieniu.</li></ul>',
    publish_date: '2021-05-17',
    version: '3.6.1',
  },
  {
    content: '<ul><li>Dodano moduły dla Polskiego Ładu.</li></ul>',
    publish_date: '2021-05-16',
    version: '3.6.0',
  },
  {
    content: '<ul><li>Migracja do Quasar 2 i Vue 3.</li><li>Naprawa błędu przy wyłączonej składce emerytalnej w umowie zlecenie.</li><li>Dodanie opcji wyłączenia kwoty wolnej od podatku w umowie o pracę.</li></ul>',
    publish_date: '2021-05-15',
    version: '3.5.0',
  },
  {
    content: '<ul><li>Dodano moduł do obliczania zasiłku chorobowego.</li></ul>',
    publish_date: '2021-05-10',
    version: '3.4.0',
  },
  {
    content: '<ul><li>Poprawiono błąd przy aktywnej uldze na start.</li><li>Dodano składkę PPK od pracodawcy do podstawy opodatkowania.</li></ul>',
    publish_date: '2021-05-08',
    version: '3.3.3',
  },
  {
    content: '<ul><li>Dodano autorskie koszty uzyskania przychodu.</li></ul>',
    publish_date: '2021-05-06',
    version: '3.3.2',
  },
  {
    content: '<ul><li>Poprawiono układ tabel na smartfonach.</li></ul>',
    publish_date: '2021-05-04',
    version: '3.3.1',
  },
  {
    content: '<ul><li>Dodano przelicznik walut.</li></ul>',
    publish_date: '2021-05-03',
    version: '3.3.0',
  },
  {
    content: '<ul><li>Dodano moduł lokaty.</li><li>Dodano łączne podsumowania dla umowy o pracę i umowy zlecenie.</li><li>Dodano automatyczne przewijanie do podsumowania.</li></ul>',
    publish_date: '2021-05-02',
    version: '3.2.0',
  },
  {
    content: '<ul><li>Ulga na start uwzględniana jest przez pierwsze 6 miesięcy.</li><li>Dodano opcję wyłączenia kwoty wolnej od podatku w samozatrudnieniu.</li><li>Aktualizacja odsetek ustawowych.<li>Ukrycie komunikatu o zryczazłtowanym podatku dochodowym przy aktywnej opcji Zerowy PIT dla młodych.</li></ul>',
    publish_date: '2021-05-01',
    version: '3.1.1',
  },
  {
    content: '<ul><li>Dodano PPK.</li><li>Dodano formularz kontaktowy.</li><li>Poprawiono formatowanie waluty.</li><li>Praca w miejscu zamieszkania jest aktywna domyślnie.</li><li>Poprawiono kolory wykresów.</li><li>Poprawiono wyświetlanie modułu kursów walut, gdy serwer niedostępny.</li></ul>',
    publish_date: '2021-04-29',
    version: '3.1.0',
  },
  {
    content: '<ul><li>Poprawiono nazewnictwo.</li><li>Poprawiono GA.</li></ul>',
    publish_date: '2021-04-26',
    version: '3.0.2',
  },
  {
    content: '<ul><li>Dodano PWA. Aplikację można  zainstalować w telefonie.</li></ul>',
    publish_date: '2021-04-25',
    version: '3.0.1',
  },
  {
    content: '<ul><li>Aplikacja na nowo napisana w VueJS.</li><li>Poprawiono liczne błędy.</li><li>Poprawiono UX.</li><li>Dodano zestawienia roczne dla wynagrodzenia.</li></ul>',
    publish_date: '2021-04-24',
    version: '3.0.0',
  },
]
