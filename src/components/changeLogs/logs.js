export default [
  {
    version: '4.6.0',
    publish_date: '2022-05-12',
    content: '<ul><li>Dodanie modułu Siła nabywcza pieniądza.</li></ul>',
  },
  {
    version: '4.5.1',
    publish_date: '2022-04-16',
    content: '<ul><li>Naprawa błędu w obliczeniach podatku dla ryczałtu w Samozatrudnieniu</li></ul>',
  },
  {
    version: '4.5.0',
    publish_date: '2022-04-06',
    content: '<ul><li>Refaktoryzacja modułu Samozatrudnienie.</li><li>Refaktoryzacja modułu Umowy o pracę.</li><li>Refaktoryzacja modułu Umowy zlecenie.</li><li>Dodanie składek na FP i FGŚP w module Umowy zlecenie.</li><li>Dodanie kwoty wolnej od podatku i 2. progu podatkowego w module Umowy zlecenie.</li><li>Naprawa błędu dodającego podatek za PPK od pracodawcy przy aktywnej uldze dla młodych.</li><li>Usunięcie składki na Fundusz Pracy z kosztów przychodu przy ryczałcie w module Samozatrudnienie.</li></ul>',
  },
  {
    version: '4.4.2',
    publish_date: '2022-02-02',
    content: '<ul><li>Aktualizacja stawek składki zdrowotnej dla ryczałtu.</li></ul>',
  },
  {
    version: '4.4.1',
    publish_date: '2022-01-08',
    content: '<ul><li>Poprawa wyliczeń składki zdrowotnej i podatku w Samozatrudnieniu.</li><li>Wycofanie modułu Rozliczenie z małżonkiem.</li></ul>',
  },
  {
    version: '4.4.0',
    publish_date: '2022-01-02',
    content: '<ul><li>Dodano moduł Terminy w US, ZUS i PFRON.</li><li>Dodano moduł Informacje o wynagrodzeniu.</li><li>Refaktoryzacja modułu Działalność niezarejestrowana.</li><li>Refaktoryzacja modułu Limit obrotu dla kasy fiskalnej.</li><li>Refaktoryzacja modułu Limit sprzedaży dla zwolnienia z VAT.</li><li>Refaktoryzacja modułu Lokata.</li><li>Refaktoryzacja modułu Odsetki.</li><li>Refaktoryzacja modułu Zasiłek chorobowy.</li><li>Refaktoryzacja modułu Umowa o dzieło.</li><li>Zaktualizowano składki ZUS w module Składki ZUS za część miesiąca.</li></ul>',
  },
  {
    version: '4.3.0',
    publish_date: '2021-12-08',
    content: '<ul><li>Dodano obsługę TypeScript.</li><li>Refaktoryzacja modułu faktur (użyto TypeScript).</li><li>Poprawiono błąd przy obliczaniu składki zdrowotnej dla ryczałtu w 2022 r.</li><li>Poprawiono błąd w uwzględnianiu kosztów przy obliczaniu ulgi dla klasy średniej w Samozatrudnieniu.</li><li>Dodano wyszukiwarkę modułów.</li></ul>',
  },
  {
    version: '4.2.0',
    publish_date: '2021-11-06',
    content: '<ul><li>Dodano moduł rozliczania z małżonkiem (wersja beta).</li><li>Aktualizacja kwot bazowych dla 2022 roku.<li>Dodano wybór roku w umowie dzieło.</li><li>Drobne zmiany w interfejsie.</li></ul>',
  },
  {
    version: '4.1.0',
    publish_date: '2021-10-25',
    content: '<ul><li>Dodano moduł inflacji.</li><li>Dodano stawkę godzinową w umowie zlecenie.</li><li>Poprawiono service worker dla PWA.</li><li>Poprawiono obliczenia przy zerowym PIT dla młodych i 50% kosztach uzyskania przychodu.</li><li>Drobne poprawki w interfejsie.</li></ul>',
  },
  {
    version: '4.0.2',
    publish_date: '2021-10-22',
    content: '<ul><li>Odświeżono ikonę aplikacji.</li><li>Poprawiono font dla polskich liter.</li></ul>',
  },
  {
    version: '4.0.1',
    publish_date: '2021-10-21',
    content: '<ul><li>Naprawiono błąd w obliczaniu kwoty brutto w umowie zlecenie, gdy byłe aktywne ulgi dla studenta i zerowy pit dla młodych.</li></ul>',
  },
  {
    version: '4.0.0',
    publish_date: '2021-10-21',
    content: '<ul><li>Refaktoryzacja modułu samozatrudnienia:<ul><li>Dodano możliwość zmiany kwoty brutto dla każdego miesiąca.</li><li>Dodano opcję zmiany roku podatkowego.<li>Uwzględnia zmiany wprowadzane przez Polski Ład.</li></li></ul></li><li>Refaktoryzacja modułu umowy o pracę:<ul><li>Dodano możliwość zmiany kwoty brutto dla każdego miesiąca.</li><li>Dodano opcję zmiany roku podatkowego.<li>Uwzględnia zmiany wprowadzane przez Polski Ład.</li></li></ul></li><li>Refaktoryzacja modułu umowy zlecenie:<ul><li>Dodano możliwość zmiany kwoty brutto dla każdego miesiąca.</li><li>Dodano opcję zmiany roku podatkowego.</li></ul></li><li>Refaktoryzacja modułu umowy dzieło.</li><li>Refaktoryzacja modułu działalności niezarejestrowanej.</li></ul>',

  },
  {
    version: '3.12.0',
    publish_date: '2021-09-20',
    content: '<ul><li>Użyto Composition API do formatowania walut.</li><li>Dodano możliwość wyświetlenia archiwalnych kursów walut.</li><li>Dodano wykres z archiwalnymi kursami dla pojedynczej waluty.</li><li>Refaktoryzacja modułu faktur.</li><li>Dodano przycisk do zamknięcia popup.</li><li>Aktualizacja bibliotek.</li></ul>',
  },
  {
    version: '3.11.0',
    publish_date: '2021-07-01',
    content: '<ul><li>Dodano moduł do obliczania składki ZUS dla przedsiębiorców za część miesiąca.</li><li>Poprawiono wyświetlanie wykresu dla 0% VAT w Faktura VAT.</li><li>Poprawiono wyłączanie przycisków, gdy dane są niekompletne.</li></ul>',
  },
  {
    version: '3.10.0',
    publish_date: '2021-06-22',
    content: '<ul><li>Dodano możliwość wpisania podstawy składek ZUS w samozatrudnieniu.</li></ul>',
  },
  {
    version: '3.9.0',
    publish_date: '2021-06-01',
    content: '<ul><li>Dodano moduł do obliczania limitu zwolnienia z VAT.</li></ul>',
  },
  {
    version: '3.8.0',
    publish_date: '2021-05-25',
    content: '<ul><li>Dodano moduł działalności niezarejestrowanej.</li></ul>',
  },
  {
    version: '3.7.1',
    publish_date: '2021-05-20',
    content: '<ul><li>Poprawiono wartość 2. progu w samozatrudnieniu w Polskim Ładzie.</li></ul>',
  },
  {
    version: '3.7.0',
    publish_date: '2021-05-19',
    content: '<ul><li>Poprawiono obliczenie podatku przy zerowym PIT dla młodych po przekroczeniu limitu.</li><li>Dodano moduł Limit obrotu dla kasy fiskalnej.</li><li>Ujednolicono kolory.</li><li>Zablokowano możliwość wyświetlania ujemnej składki zdrowotnej w Polskim Ładzie.</li></ul>',
  },
  {
    version: '3.6.3',
    publish_date: '2021-05-18',
    content: '<ul><li>Poprawiono maksymalne zakresy dla PPK.</li></ul>',
  },
  {
    version: '3.6.2',
    publish_date: '2021-05-17',
    content: '<ul><li>Poprawiono błąd w obliczeniach przy niezerowych kosztach w samozatrudnieniu przy podatku liniowym.</li></ul>',
  },
  {
    version: '3.6.1',
    publish_date: '2021-05-17',
    content: '<ul><li>Poprawiono błąd w obliczeniach przy niezerowych kosztach w samozatrudnieniu.</li></ul>',
  },
  {
    version: '3.6.0',
    publish_date: '2021-05-16',
    content: '<ul><li>Dodano moduły dla Polskiego Ładu.</li></ul>',
  },
  {
    version: '3.5.0',
    publish_date: '2021-05-15',
    content: '<ul><li>Migracja do Quasar 2 i Vue 3.</li><li>Naprawa błędu przy wyłączonej składce emerytalnej w umowie zlecenie.</li><li>Dodanie opcji wyłączenia kwoty wolnej od podatku w umowie o pracę.</li></ul>',
  },
  {
    version: '3.4.0',
    publish_date: '2021-05-10',
    content: '<ul><li>Dodano moduł do obliczania zasiłku chorobowego.</li></ul>',
  },
  {
    version: '3.3.3',
    publish_date: '2021-05-08',
    content: '<ul><li>Poprawiono błąd przy aktywnej uldze na start.</li><li>Dodano składkę PPK od pracodawcy do podstawy opodatkowania.</li></ul>',
  },
  {
    version: '3.3.2',
    publish_date: '2021-05-06',
    content: '<ul><li>Dodano autorskie koszty uzyskania przychodu.</li></ul>',
  },
  {
    version: '3.3.1',
    publish_date: '2021-05-04',
    content: '<ul><li>Poprawiono układ tabel na smartfonach.</li></ul>',
  },
  {
    version: '3.3.0',
    publish_date: '2021-05-03',
    content: '<ul><li>Dodano przelicznik walut.</li></ul>',
  },
  {
    version: '3.2.0',
    publish_date: '2021-05-02',
    content: '<ul><li>Dodano moduł lokaty.</li><li>Dodano łączne podsumowania dla umowy o pracę i umowy zlecenie.</li><li>Dodano automatyczne przewijanie do podsumowania.</li></ul>',
  },
  {
    version: '3.1.1',
    publish_date: '2021-05-01',
    content: '<ul><li>Ulga na start uwzględniana jest przez pierwsze 6 miesięcy.</li><li>Dodano opcję wyłączenia kwoty wolnej od podatku w samozatrudnieniu.</li><li>Aktualizacja odsetek ustawowych.<li>Ukrycie komunikatu o zryczazłtowanym podatku dochodowym przy aktywnej opcji Zerowy PIT dla młodych.</li></ul>',
  },
  {
    version: '3.1.0',
    publish_date: '2021-04-29',
    content: '<ul><li>Dodano PPK.</li><li>Dodano formularz kontaktowy.</li><li>Poprawiono formatowanie waluty.</li><li>Praca w miejscu zamieszkania jest aktywna domyślnie.</li><li>Poprawiono kolory wykresów.</li><li>Poprawiono wyświetlanie modułu kursów walut, gdy serwer niedostępny.</li></ul>',
  },
  {
    version: '3.0.2',
    publish_date: '2021-04-26',
    content: '<ul><li>Poprawiono nazewnictwo.</li><li>Poprawiono GA.</li></ul>',
  },
  {
    version: '3.0.1',
    publish_date: '2021-04-25',
    content: '<ul><li>Dodano PWA. Aplikację można  zainstalować w telefonie.</li></ul>',
  },
  {
    version: '3.0.0',
    publish_date: '2021-04-24',
    content: '<ul><li>Aplikacja na nowo napisana w VueJS.</li><li>Poprawiono liczne błędy.</li><li>Poprawiono UX.</li><li>Dodano zestawienia roczne dla wynagrodzenia.</li></ul>',
  },
]
