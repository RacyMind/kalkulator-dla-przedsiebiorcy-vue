<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-ike',
    'title' => 'Kalkulator IKE 2026 – Symulacja oszczędności emerytalnych',
    'description' => 'Darmowy kalkulator IKE 2026. Sprawdź ile zaoszczędzisz na Indywidualnym Koncie Emerytalnym. Symuluj wpłaty, stopę zwrotu i prognozowany kapitał bez podatku Belki.',
    'og_description' => 'Darmowy kalkulator IKE 2026. Sprawdź ile zaoszczędzisz na Indywidualnym Koncie Emerytalnym. Symuluj wpłaty i prognozowany kapitał.',
    'breadcrumb' => 'Kalkulator IKE',
    'h1' => 'Kalkulator IKE 2026 — oszczędności emerytalne',
    'hero_text' => 'Zaplanuj swoją emeryturę z Indywidualnym Kontem Emerytalnym. Sprawdź ile zgromadzisz kapitału przy regularnych wpłatach — bez podatku Belki.',
    'hero_cta' => 'Przejdź do kalkulatora IKE',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/kalkulator-ike',
    'cta_heading' => 'Zaplanuj oszczędności na IKE',
    'cta_text' => 'Sprawdź ile zgromadzisz na emeryturę. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'kalkulator-ike',
    'screenshot_alt' => 'Kalkulator IKE — symulacja oszczędności emerytalnych z prognozą kapitału',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/kalkulator-ike',
    'screenshot_width' => 1280,
    'screenshot_height' => 800,
    'howto' => [
        'name' => 'Jak obliczyć oszczędności na IKE',
        'steps' => [
            ['name' => 'Podaj swój wiek', 'text' => 'Wpisz aktualny wiek oraz planowany wiek rozpoczęcia wypłat z IKE (minimum 60 lat).'],
            ['name' => 'Ustal wysokość wpłat', 'text' => 'Podaj planowaną miesięczną lub roczną wpłatę na IKE. Pamiętaj o rocznym limicie wpłat.'],
            ['name' => 'Wybierz stopę zwrotu', 'text' => 'Ustaw oczekiwaną roczną stopę zwrotu z inwestycji (np. 5-8% dla funduszy akcyjnych).'],
            ['name' => 'Sprawdź prognozę', 'text' => 'Kalkulator pokaże prognozowany kapitał, sumę wpłat, zysk z inwestycji i miesięczną wypłatę emerytalną.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest IKE — Indywidualne Konto Emerytalne?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">IKE (Indywidualne Konto Emerytalne) to jeden z trzech filarów dobrowolnego oszczędzania na emeryturę w Polsce, obok IKZE i PPK. Jest to konto inwestycyjne z wyjątkową korzyścią podatkową — <strong>zyski z inwestycji na IKE są zwolnione z 19% podatku od zysków kapitałowych</strong> (tzw. podatku Belki), pod warunkiem wypłaty po ukończeniu 60. roku życia.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">IKE można prowadzić w różnych formach: jako rachunek maklerski, fundusz inwestycyjny, lokatę bankową, rachunek w dobrowolnym funduszu emerytalnym lub ubezpieczenie na życie z funduszem kapitałowym. Każda osoba może posiadać tylko jedno IKE.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">W 2026 roku roczny limit wpłat na IKE wynosi <strong>28 260,00 zł</strong> (trzykrotność prognozowanego przeciętnego miesięcznego wynagrodzenia). To znacząca kwota, która przy regularnym inwestowaniu przez kilkadziesiąt lat może zbudować pokaźny kapitał emerytalny.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Korzyści podatkowe IKE — ile zaoszczędzisz?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Główną zaletą IKE jest <strong>zwolnienie z podatku Belki (19%)</strong> od zysków kapitałowych. W praktyce oznacza to, że cały zysk z inwestycji — dywidendy, odsetki, wzrost wartości jednostek — trafia do Ciebie w całości, bez potrąceń podatkowych.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przykład: jeśli przez 30 lat wpłacasz po 1000 zł miesięcznie przy średniej stopie zwrotu 7% rocznie, zgromadzisz około <strong>1 220 000 zł</strong>. Na zwykłym rachunku maklerskim podatek Belki pochłonąłby ponad <strong>100 000 zł</strong> z Twoich zysków. Na IKE ta kwota zostaje u Ciebie.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Warunek: wypłata musi nastąpić po ukończeniu 60. roku życia (lub 55 lat w przypadku nabycia uprawnień emerytalnych). Wcześniejsza wypłata (zwrot) oznacza konieczność zapłacenia podatku Belki od zysków.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Limit wpłat na IKE w 2026 roku</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Roczny limit wpłat na IKE jest ustalany corocznie i wynosi trzykrotność prognozowanego przeciętnego miesięcznego wynagrodzenia w gospodarce narodowej. W 2026 roku limit ten wynosi:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Limit roczny IKE 2026: 28 260,00 zł</strong></li>
            <li><strong>Limit miesięczny (orientacyjny): 2 355,00 zł</strong></li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Wpłaty na IKE można dokonywać w dowolnych kwotach i terminach w ciągu roku — nie ma obowiązku regularnych wpłat. Ważne jest jedynie nieprzekroczenie rocznego limitu. Niewykorzystany limit nie przechodzi na następny rok.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Dla porównania: limit wpłat na IKZE w 2026 roku wynosi 11 304,00 zł (lub 16 956,00 zł dla osób prowadzących działalność gospodarczą). IKE oferuje zatem znacznie wyższy limit wpłat (28 260 zł)</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">IKE vs IKZE vs PPK — co wybrać?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Każdy z trzech programów emerytalnych ma inne zalety:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>IKE</strong> — brak podatku Belki przy wypłacie po 60. roku życia. Wyższy limit wpłat. Brak ulgi podatkowej przy wpłacie.</li>
            <li><strong>IKZE</strong> — wpłaty odliczasz od podstawy opodatkowania PIT (ulga podatkowa). Przy wypłacie płacisz zryczałtowany 10% podatek. Niższy limit wpłat.</li>
            <li><strong>PPK</strong> — dopłaty od pracodawcy (1,5% wynagrodzenia) i państwa (250 zł rocznie). Automatyczne zapisy, ale można zrezygnować.</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Optymalną strategią jest korzystanie ze wszystkich trzech programów jednocześnie — najpierw IKZE (dla ulgi podatkowej), potem IKE (dla zwolnienia z Belki), a PPK jako dodatek z dopłatami pracodawcy. Kalkulator IKE pomoże zaplanować tę część strategii.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Jak działa kalkulator IKE?</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator IKE pozwala zasymulować długoterminowe oszczędzanie na emeryturę. Podajesz swój wiek, planowaną miesięczną wpłatę, oczekiwaną stopę zwrotu i wiek rozpoczęcia wypłat. Kalkulator oblicza prognozowany kapitał na koniec okresu oszczędzania, sumę wpłat, zysk z inwestycji oraz szacunkową miesięczną wypłatę emerytalną. Wszystko z uwzględnieniem zwolnienia z podatku Belki.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Ile wynosi limit wpłat na IKE w 2026 roku?', 'a' => 'Limit wpłat na IKE w 2026 roku wynosi 28 260 zł. Jest to trzykrotność przeciętnego prognozowanego wynagrodzenia miesięcznego. Limit jest jednakowy dla pracowników i przedsiębiorców.'],
        ['q' => 'Czy z IKE trzeba płacić podatek Belki?', 'a' => 'Nie, jeśli wypłata nastąpi po ukończeniu 60. roku życia (lub 55 lat przy nabyciu uprawnień emerytalnych) i wpłaty były dokonywane przez co najmniej 5 lat kalendarzowych. Wcześniejsza wypłata (zwrot) podlega standardowemu podatkowi Belki 19%.'],
        ['q' => 'Czym różni się IKE od IKZE?', 'a' => 'IKE daje zwolnienie z podatku Belki przy wypłacie, ale nie daje ulgi podatkowej przy wpłacie. IKZE daje ulgę podatkową przy wpłacie (odliczenie od dochodu PIT), ale przy wypłacie pobierany jest zryczałtowany 10% podatek. IKE ma wyższy limit wpłat (28 260 zł vs 11 304 zł).'],
        ['q' => 'Czy warto oszczędzać na IKE?', 'a' => 'Tak, szczególnie przy długim horyzoncie oszczędzania. Zwolnienie z podatku Belki (19%) oznacza, że cały zysk z inwestycji trafia do Ciebie. Przy 30 latach oszczędzania i 7% stopie zwrotu oszczędność na podatku może wynieść dziesiątki tysięcy złotych.'],
        ['q' => 'Gdzie można założyć IKE?', 'a' => 'IKE można założyć w: domach maklerskich (IKE w formie rachunku maklerskiego), towarzystwach funduszy inwestycyjnych (IKE w formie funduszy), bankach (IKE w formie lokaty lub rachunku oszczędnościowego) oraz zakładach ubezpieczeń. Można mieć tylko jedno IKE jednocześnie.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-ikze', 'name' => 'Kalkulator IKZE', 'desc' => 'Oblicz ulgę podatkową z wpłat na IKZE i porównaj z IKE.', 'gradient' => 'from-purple-500 to-purple-700', 'icon' => $icons['coin']],
        ['slug' => 'obligacje-skarbowe', 'name' => 'Obligacje skarbowe', 'desc' => 'Porównaj zysk z różnych rodzajów obligacji skarbowych.', 'gradient' => 'from-teal-500 to-teal-700', 'icon' => $icons['money']],
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
    ],
];
