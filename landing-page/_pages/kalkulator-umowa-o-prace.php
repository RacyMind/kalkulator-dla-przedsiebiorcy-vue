<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-umowa-o-prace',
    'title' => 'Kalkulator umowy o pracę 2026 – Oblicz wynagrodzenie netto',
    'description' => 'Darmowy kalkulator umowy o pracę 2026. Oblicz wynagrodzenie netto z brutto, składki ZUS pracownika i koszty pracodawcy. Aktualne stawki podatkowe.',
    'og_description' => 'Darmowy kalkulator umowy o pracę 2026. Oblicz wynagrodzenie netto z brutto, składki ZUS pracownika i koszty pracodawcy.',
    'breadcrumb' => 'Kalkulator umowy o pracę',
    'h1' => 'Kalkulator wynagrodzenia z umowy o pracę 2026',
    'hero_text' => 'Oblicz ile zarobisz „na rękę" z umowy o pracę. Sprawdź składki ZUS, zaliczkę na podatek dochodowy i pełne koszty pracodawcy. Aktualne stawki 2026.',
    'hero_cta' => 'Przejdź do kalkulatora UoP',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/umowa-o-prace',
    'cta_heading' => 'Oblicz swoje wynagrodzenie netto',
    'cta_text' => 'Sprawdź ile zarobisz „na rękę" z umowy o pracę. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'umowa-o-prace',
    'screenshot_alt' => 'Kalkulator wynagrodzenia z umowy o pracę — obliczanie netto, składek ZUS i kosztów pracodawcy',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/umowa-o-prace',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć wynagrodzenie netto z umowy o pracę',
        'steps' => [
            ['name' => 'Wpisz wynagrodzenie brutto', 'text' => 'Podaj kwotę wynagrodzenia brutto zapisaną w umowie o pracę.'],
            ['name' => 'Ustaw parametry', 'text' => 'Wybierz koszty uzyskania przychodu (zwykłe lub podwyższone), PPK i inne opcje.'],
            ['name' => 'Sprawdź wynik', 'text' => 'Kalkulator pokaże wynagrodzenie netto, składki ZUS pracownika, zaliczkę na podatek i koszty pracodawcy.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Jak obliczyć wynagrodzenie netto z umowy o pracę?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Wynagrodzenie netto to kwota, którą pracownik otrzymuje „na rękę" po odliczeniu wszystkich obowiązkowych składek i podatków. Różnica między brutto a netto w Polsce jest znacząca — przy wynagrodzeniu brutto 6 000 zł pracownik otrzymuje około 4 400 zł netto (w zależności od indywidualnych parametrów).</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator umowy o pracę automatycznie oblicza wszystkie składniki wynagrodzenia: składki ZUS pracownika, składkę zdrowotną, zaliczkę na podatek dochodowy PIT, a także pełne koszty pracodawcy.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Składki ZUS pracownika w 2026 roku</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Każdy pracownik zatrudniony na umowę o pracę ma obowiązkowo potrącane z wynagrodzenia brutto następujące składki:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Składka emerytalna</strong> — 9,76% podstawy wymiaru (po stronie pracownika)</li>
          <li><strong>Składka rentowa</strong> — 1,5% podstawy wymiaru</li>
          <li><strong>Składka chorobowa</strong> — 2,45% podstawy wymiaru</li>
          <li><strong>Składka zdrowotna</strong> — 9% podstawy (po odliczeniu składek społecznych)</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Łącznie składki po stronie pracownika to ok. 13,71% wynagrodzenia brutto (bez składki zdrowotnej). Składka zdrowotna jest obliczana od kwoty po odliczeniu składek społecznych.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Kwota wolna od podatku i progi podatkowe</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">W 2026 roku kwota wolna od podatku wynosi 30 000 zł rocznie (2 500 zł miesięcznie). Oznacza to, że od dochodu do tej kwoty nie płaci się podatku dochodowego PIT. Kwota zmniejszająca podatek wynosi 3 600 zł rocznie (300 zł miesięcznie).</p>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Progi podatkowe w 2026 roku:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>I próg: 12%</strong> — dochód do 120 000 zł rocznie</li>
          <li><strong>II próg: 32%</strong> — dochód powyżej 120 000 zł rocznie</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator automatycznie uwzględnia kwotę wolną i progi podatkowe przy obliczaniu zaliczki na podatek dochodowy.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Koszty pracodawcy</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Oprócz wynagrodzenia brutto, pracodawca ponosi dodatkowe koszty zatrudnienia pracownika: składkę emerytalną (9,76%), rentową (6,5%), wypadkową (1,67%), Fundusz Pracy (2,45%) i FGŚP (0,1%). Łącznie koszty pracodawcy to ok. 20,48% ponad wynagrodzenie brutto.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator pokazuje zarówno wynagrodzenie netto pracownika, jak i całkowity koszt zatrudnienia po stronie pracodawcy — dzięki temu obie strony mogą lepiej planować budżet.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Ile wynosi wynagrodzenie netto z umowy o pracę przy brutto 6 000 zł?', 'a' => 'Przy standardowych parametrach (zwykłe koszty uzyskania przychodu, brak PPK) wynagrodzenie netto z 6 000 zł brutto wynosi ok. 4 400 zł. Dokładna kwota zależy od miesiąca (ze względu na przekroczenie progów) i indywidualnych ustawień.'],
        ['q' => 'Jakie składki ZUS płaci pracownik z umowy o pracę?', 'a' => 'Pracownik płaci: składkę emerytalną (9,76%), rentową (1,5%), chorobową (2,45%) i zdrowotną (9% od podstawy po odliczeniu składek społecznych). Łącznie potrącenia z brutto to ok. 13,71% + składka zdrowotna.'],
        ['q' => 'Ile kosztuje pracodawcę pracownik z wynagrodzeniem 6 000 zł brutto?', 'a' => 'Całkowity koszt pracodawcy to ok. 7 230 zł. Oprócz wynagrodzenia brutto pracodawca płaci składki: emerytalną (9,76%), rentową (6,5%), wypadkową (1,67%), Fundusz Pracy (2,45%) i FGŚP (0,1%) — łącznie ok. 20,48% ponad brutto.'],
        ['q' => 'Czym są koszty uzyskania przychodu przy umowie o pracę?', 'a' => 'Koszty uzyskania przychodu to kwota pomniejszająca podstawę opodatkowania. Standardowe KUP wynoszą 250 zł miesięcznie (3 000 zł rocznie). Podwyższone KUP (300 zł miesięcznie, 3 600 zł rocznie) przysługują pracownikom dojeżdżającym z innej miejscowości.'],
        ['q' => 'Jak działa kwota wolna od podatku w 2026?', 'a' => 'Kwota wolna od podatku wynosi 30 000 zł rocznie. Oznacza to, że od dochodu do 30 000 zł nie płacisz podatku dochodowego. Pracodawca uwzględnia ją przy obliczaniu miesięcznej zaliczki na PIT (1/12 kwoty zmniejszającej podatek, czyli 300 zł miesięcznie).'],
    ],
    'related' => [
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
        ['slug' => 'kalkulator-umowa-zlecenie', 'name' => 'Kalkulator umowy zlecenie', 'desc' => 'Oblicz wynagrodzenie netto i składki przy umowie zlecenie.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['document']],
    ],
];
