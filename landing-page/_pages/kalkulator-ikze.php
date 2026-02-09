<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-ikze',
    'title' => 'Kalkulator IKZE 2026 – Oblicz ulgę podatkową z wpłat na IKZE',
    'description' => 'Darmowy kalkulator IKZE 2026. Oblicz ulgę podatkową z wpłat na Indywidualne Konto Zabezpieczenia Emerytalnego. Aktualne limity wpłat i oszczędności na PIT.',
    'og_description' => 'Darmowy kalkulator IKZE 2026. Oblicz ulgę podatkową z wpłat na IKZE. Aktualne limity wpłat i oszczędności na PIT.',
    'breadcrumb' => 'Kalkulator IKZE',
    'h1' => 'Kalkulator IKZE 2026 — ulga podatkowa',
    'hero_text' => 'Oblicz ile zaoszczędzisz na podatku PIT dzięki wpłatom na IKZE. Sprawdź aktualne limity wpłat i porównaj oszczędności przy różnych stawkach podatkowych.',
    'hero_cta' => 'Przejdź do kalkulatora IKZE',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/ulga-podatkowa-ikze',
    'cta_heading' => 'Oblicz ulgę podatkową z IKZE',
    'cta_text' => 'Sprawdź ile zaoszczędzisz na podatku PIT. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'ulga-podatkowa-ikze',
    'screenshot_alt' => 'Kalkulator IKZE — obliczanie ulgi podatkowej z wpłat na Indywidualne Konto Zabezpieczenia Emerytalnego',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/ulga-podatkowa-ikze',
    'screenshot_width' => 1280,
    'screenshot_height' => 800,
    'howto' => [
        'name' => 'Jak obliczyć ulgę podatkową z IKZE',
        'steps' => [
            ['name' => 'Podaj kwotę wpłaty', 'text' => 'Wpisz planowaną roczną wpłatę na IKZE (do limitu).'],
            ['name' => 'Wybierz stawkę podatkową', 'text' => 'Wybierz swoją stawkę PIT: 12% (I próg) lub 32% (II próg).'],
            ['name' => 'Sprawdź oszczędność', 'text' => 'Kalkulator pokaże kwotę ulgi podatkowej i efektywny koszt wpłaty na IKZE.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest IKZE — Indywidualne Konto Zabezpieczenia Emerytalnego?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">IKZE (Indywidualne Konto Zabezpieczenia Emerytalnego) to program dobrowolnego oszczędzania na emeryturę z <strong>natychmiastową korzyścią podatkową</strong>. Wpłaty na IKZE można odliczyć od podstawy opodatkowania w rocznym zeznaniu PIT, co oznacza realną oszczędność na podatku dochodowym już w roku wpłaty.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">W odróżnieniu od IKE, gdzie korzyść podatkowa pojawia się dopiero przy wypłacie (brak podatku Belki), IKZE daje <strong>natychmiastowy zwrot podatkowy</strong>. Przy wypłacie po 65. roku życia płacisz jedynie zryczałtowany podatek 10% od całej zgromadzonej kwoty — znacznie mniej niż standardowe 19% podatku Belki.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">IKZE jest szczególnie atrakcyjne dla osób w II progu podatkowym (32%), ponieważ odliczenie wpłaty od dochodu daje oszczędność aż 32 grosze na każdej wpłaconej złotówce.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Limit wpłat na IKZE w 2026 roku</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Roczny limit wpłat na IKZE wynosi 1,2-krotność prognozowanego przeciętnego miesięcznego wynagrodzenia. Dla osób prowadzących działalność gospodarczą limit jest wyższy — 1,8-krotność. W 2026 roku:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Limit IKZE 2026 (pracownicy): 11 304,00 zł</strong></li>
            <li><strong>Limit IKZE 2026 (przedsiębiorcy): 16 956,00 zł</strong></li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przy maksymalnej wpłacie i stawce podatkowej 32%, oszczędność na podatku PIT wynosi:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Pracownik (32%): do 3 617 zł</strong> oszczędności na PIT rocznie</li>
            <li><strong>Przedsiębiorca (32%): do 5 426 zł</strong> oszczędności na PIT rocznie</li>
            <li><strong>Pracownik (12%): do 1 356 zł</strong> oszczędności na PIT rocznie</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">To realne pieniądze, które wracają do Ciebie przy rozliczeniu rocznym PIT. Kalkulator IKZE dokładnie obliczy Twoją oszczędność podatkową.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Jak działa ulga podatkowa IKZE?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Mechanizm ulgi podatkowej IKZE jest prosty:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Wpłacasz na IKZE</strong> — np. 10 000 zł w ciągu roku</li>
            <li><strong>Odliczasz wpłatę od dochodu</strong> — w zeznaniu PIT (PIT-36, PIT-37 lub PIT-28) wpisujesz kwotę wpłat na IKZE</li>
            <li><strong>Otrzymujesz zwrot podatku</strong> — przy stawce 32% to 3 200 zł mniej podatku do zapłacenia</li>
            <li><strong>Efektywny koszt wpłaty</strong> — zamiast 10 000 zł, Twój realny koszt to tylko 6 800 zł</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Ulga IKZE działa na zasadzie odliczenia od dochodu (nie od podatku!). Oznacza to, że im wyższa Twoja stawka podatkowa, tym większa oszczędność. Osoby w II progu podatkowym (32%) zyskują proporcjonalnie więcej niż osoby w I progu (12%).</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">IKZE vs IKE — które wybrać?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">IKZE i IKE to dwa uzupełniające się programy emerytalne. Kluczowe różnice:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>IKZE</strong> — ulga podatkowa przy wpłacie, 10% podatku przy wypłacie po 65. roku życia, niższy limit wpłat</li>
            <li><strong>IKE</strong> — brak ulgi przy wpłacie, brak podatku Belki przy wypłacie po 60. roku życia, wyższy limit wpłat (28 260 zł)</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Optymalna strategia to korzystanie z obu programów jednocześnie:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Krok 1:</strong> Wpłać maksymalną kwotę na IKZE (ulga podatkowa)</li>
            <li><strong>Krok 2:</strong> Zaoszczędzoną kwotę z ulgi podatkowej wpłać na IKE</li>
            <li><strong>Krok 3:</strong> Resztę oszczędności również ulokuj na IKE (do limitu)</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">W ten sposób maksymalizujesz korzyści podatkowe z obu programów. Kalkulator pomoże obliczyć dokładną kwotę oszczędności.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Kiedy IKZE się nie opłaca?</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">IKZE jest mniej opłacalne dla osób, które nie płacą podatku dochodowego (np. korzystają z kwoty wolnej od podatku) lub są na ryczałcie z niską stawką. Wcześniejsza wypłata (zwrot) przed 65. rokiem życia oznacza konieczność doliczenia całej kwoty do dochodu i opodatkowania według skali — co może być niekorzystne. Dlatego IKZE najlepiej sprawdza się jako długoterminowa inwestycja emerytalna.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Ile wynosi limit wpłat na IKZE w 2026 roku?', 'a' => 'Limit wpłat na IKZE w 2026 roku wynosi 11 304 zł dla pracowników i 16 956 zł dla osób prowadzących działalność gospodarczą. Limity są ustalane corocznie na podstawie przeciętnego prognozowanego wynagrodzenia.'],
        ['q' => 'Ile można zaoszczędzić na podatku dzięki IKZE?', 'a' => 'Oszczędność zależy od stawki podatkowej. Przy maksymalnej wpłacie pracownika (11 304 zł) i stawce 32% oszczędność wynosi ok. 3 617 zł rocznie. Przy stawce 12% — ok. 1 356 zł. Przedsiębiorca w II progu może zaoszczędzić nawet 5 426 zł.'],
        ['q' => 'Jaki podatek płaci się przy wypłacie z IKZE?', 'a' => 'Przy wypłacie po ukończeniu 65. roku życia pobierany jest zryczałtowany podatek 10% od całej zgromadzonej kwoty. Wcześniejsza wypłata (zwrot) oznacza doliczenie całej kwoty do dochodu i opodatkowanie według skali podatkowej (12% lub 32%).'],
        ['q' => 'Czy lepiej wybrać IKZE czy IKE?', 'a' => 'Optymalna strategia to korzystanie z obu programów. Najpierw wpłać maksymalną kwotę na IKZE (ulga podatkowa), a zaoszczędzone na podatku pieniądze wpłać na IKE (zwolnienie z Belki). IKZE jest szczególnie korzystne dla osób w II progu podatkowym (32%).'],
        ['q' => 'Czy wpłaty na IKZE odliczam w PIT?', 'a' => 'Tak. Wpłaty na IKZE odliczasz od dochodu w zeznaniu rocznym PIT (PIT-36, PIT-37 lub PIT-28). Kwotę wpłat wpisujesz w odpowiedniej rubryce zeznania. Ulga działa na zasadzie odliczenia od dochodu, nie od podatku.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-ike', 'name' => 'Kalkulator IKE', 'desc' => 'Symuluj oszczędności na IKE bez podatku Belki.', 'gradient' => 'from-indigo-500 to-indigo-700', 'icon' => $icons['money']],
        ['slug' => 'obligacje-skarbowe', 'name' => 'Obligacje skarbowe', 'desc' => 'Porównaj zysk z różnych rodzajów obligacji skarbowych.', 'gradient' => 'from-teal-500 to-teal-700', 'icon' => $icons['coin']],
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
    ],
];
