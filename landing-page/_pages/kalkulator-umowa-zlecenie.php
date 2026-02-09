<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-umowa-zlecenie',
    'title' => 'Kalkulator umowy zlecenie 2026 – Oblicz wynagrodzenie netto',
    'description' => 'Darmowy kalkulator umowy zlecenie 2026. Oblicz wynagrodzenie netto zleceniobiorcy, składki ZUS i zaliczkę na podatek. Uwzględnij zwolnienie studenta i ulgę dla młodych.',
    'og_description' => 'Darmowy kalkulator umowy zlecenie 2026. Oblicz wynagrodzenie netto zleceniobiorcy, składki ZUS i zaliczkę na podatek.',
    'breadcrumb' => 'Kalkulator umowy zlecenie',
    'h1' => 'Kalkulator umowy zlecenie 2026',
    'hero_text' => 'Oblicz wynagrodzenie netto z umowy zlecenie. Sprawdź składki ZUS zleceniobiorcy, zwolnienie studenta i koszty uzyskania przychodu. Aktualne stawki 2026.',
    'hero_cta' => 'Przejdź do kalkulatora zlecenie',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/umowa-zlecenie',
    'cta_heading' => 'Oblicz wynagrodzenie z umowy zlecenie',
    'cta_text' => 'Sprawdź ile zarobisz netto na umowie zlecenie. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'umowa-zlecenie',
    'screenshot_alt' => 'Kalkulator umowy zlecenie — obliczanie wynagrodzenia netto zleceniobiorcy',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/umowa-zlecenie',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć wynagrodzenie netto z umowy zlecenie',
        'steps' => [
            ['name' => 'Wpisz kwotę brutto', 'text' => 'Podaj kwotę brutto wynagrodzenia z umowy zlecenie.'],
            ['name' => 'Wybierz status zleceniobiorcy', 'text' => 'Zaznacz czy jesteś studentem do 26 roku życia, czy masz inny tytuł do ubezpieczeń.'],
            ['name' => 'Sprawdź wynik', 'text' => 'Kalkulator pokaże wynagrodzenie netto, składki ZUS i zaliczkę na podatek dochodowy.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest umowa zlecenie?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Umowa zlecenie to jedna z najpopularniejszych umów cywilnoprawnych w Polsce. W odróżnieniu od umowy o pracę, zleceniobiorca nie jest objęty Kodeksem pracy — nie przysługuje mu urlop wypoczynkowy, okres wypowiedzenia ani ochrona przed zwolnieniem. Umowa zlecenie jest jednak elastyczna i często stosowana przy pracach dorywczych, sezonowych lub projektowych.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Od 2016 roku obowiązuje minimalna stawka godzinowa dla umów zlecenie, która w 2026 roku wynosi odpowiednio ustaloną kwotę. Zleceniodawca ma obowiązek ewidencjonowania czasu pracy zleceniobiorcy.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Składki ZUS przy umowie zlecenie w 2026</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Zasady oskładkowania umowy zlecenie zależą od statusu zleceniobiorcy:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Student do 26 roku życia</strong> — całkowite zwolnienie ze składek ZUS. Zleceniobiorca otrzymuje wynagrodzenie brutto = netto (pomniejszone jedynie o zaliczkę na podatek, jeśli nie korzysta z ulgi dla młodych).</li>
          <li><strong>Zleceniobiorca z innym tytułem do ubezpieczeń</strong> — jeśli zleceniobiorca jest jednocześnie zatrudniony na umowę o pracę z wynagrodzeniem co najmniej minimalnym, składki społeczne z umowy zlecenie są dobrowolne.</li>
          <li><strong>Zleceniobiorca bez innego tytułu</strong> — obowiązkowe składki emerytalna, rentowa, wypadkowa i zdrowotna. Składka chorobowa jest dobrowolna.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator umowy zlecenie automatycznie uwzględnia wszystkie te warianty — wystarczy zaznaczyć odpowiedni status zleceniobiorcy.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Koszty uzyskania przychodu przy umowie zlecenie</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przy umowie zlecenie standardowe koszty uzyskania przychodu wynoszą 20% przychodu (po odliczeniu składek społecznych). W przypadku umów dotyczących praw autorskich (np. praca twórcza, programowanie) można zastosować podwyższone koszty uzyskania przychodu w wysokości 50%.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Podwyższone koszty 50% są limitowane — roczny limit wynosi 120 000 zł. Po przekroczeniu tego limitu stosuje się standardowe koszty 20%. Kalkulator automatycznie pilnuje tego limitu.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Ulga dla młodych (do 26 roku życia)</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Osoby do 26 roku życia mogą korzystać z ulgi podatkowej — przychody z umowy zlecenie do kwoty 85 528 zł rocznie są zwolnione z podatku dochodowego PIT. W połączeniu ze zwolnieniem studenta z ZUS, młody zleceniobiorca może otrzymać wynagrodzenie brutto = netto.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Czy student na umowie zlecenie płaci składki ZUS?', 'a' => 'Nie. Student do 26 roku życia jest całkowicie zwolniony ze składek ZUS przy umowie zlecenie. Wynagrodzenie brutto jest równe netto (pomniejszone jedynie o zaliczkę na podatek, jeśli nie korzysta z ulgi dla młodych).'],
        ['q' => 'Ile wynosi wynagrodzenie netto z umowy zlecenie 4 000 zł brutto?', 'a' => 'Zależy od statusu zleceniobiorcy. Student do 26 lat z ulgą dla młodych otrzyma 4 000 zł netto. Zleceniobiorca z pełnymi składkami ZUS otrzyma ok. 2 900–3 100 zł netto, w zależności od parametrów.'],
        ['q' => 'Jakie składki ZUS obowiązują przy umowie zlecenie?', 'a' => 'Zleceniobiorca bez innego tytułu do ubezpieczeń płaci składki: emerytalną (9,76%), rentową (1,5%), wypadkową i zdrowotną (9%). Składka chorobowa (2,45%) jest dobrowolna. Jeśli zleceniobiorca ma umowę o pracę z wynagrodzeniem co najmniej minimalnym, składki społeczne z umowy zlecenie są dobrowolne.'],
        ['q' => 'Czym jest ulga dla młodych przy umowie zlecenie?', 'a' => 'Ulga dla młodych zwalnia osoby do 26 roku życia z podatku dochodowego PIT od przychodów z umowy zlecenie do kwoty 85 528 zł rocznie. W połączeniu ze zwolnieniem studenta z ZUS oznacza to, że brutto = netto.'],
        ['q' => 'Czy od umowy zlecenie można stosować 50% koszty uzyskania przychodu?', 'a' => 'Tak, jeśli umowa zlecenie dotyczy praw autorskich (np. praca twórcza, programowanie). Podwyższone koszty 50% obniżają podstawę opodatkowania, ale mają roczny limit 120 000 zł. Standardowe koszty przy umowie zlecenie wynoszą 20%.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-umowa-o-prace', 'name' => 'Kalkulator umowy o pracę', 'desc' => 'Oblicz wynagrodzenie netto z umowy o pracę i koszty pracodawcy.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['briefcase']],
        ['slug' => 'kalkulator-umowa-o-dzielo', 'name' => 'Kalkulator umowy o dzieło', 'desc' => 'Oblicz wynagrodzenie netto z uwzględnieniem kosztów uzyskania przychodu.', 'gradient' => 'from-indigo-500 to-indigo-700', 'icon' => $icons['pencil']],
    ],
];
