<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-umowa-o-dzielo',
    'title' => 'Kalkulator umowy o dzieło 2026 – Oblicz wynagrodzenie netto',
    'description' => 'Darmowy kalkulator umowy o dzieło 2026. Oblicz wynagrodzenie netto z uwzględnieniem kosztów uzyskania przychodu 20% lub 50% (prawa autorskie). Bez składek ZUS.',
    'og_description' => 'Darmowy kalkulator umowy o dzieło 2026. Oblicz wynagrodzenie netto z uwzględnieniem kosztów uzyskania przychodu 20% lub 50%.',
    'breadcrumb' => 'Kalkulator umowy o dzieło',
    'h1' => 'Kalkulator umowy o dzieło 2026',
    'hero_text' => 'Oblicz wynagrodzenie netto z umowy o dzieło. Uwzględnij koszty uzyskania przychodu 20% lub 50% (prawa autorskie). Umowa o dzieło nie podlega składkom ZUS.',
    'hero_cta' => 'Przejdź do kalkulatora dzieło',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/umowa-o-dzielo',
    'cta_heading' => 'Oblicz wynagrodzenie z umowy o dzieło',
    'cta_text' => 'Sprawdź ile zarobisz netto na umowie o dzieło. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'umowa-o-dzielo',
    'screenshot_alt' => 'Kalkulator umowy o dzieło — obliczanie wynagrodzenia netto z kosztami uzyskania przychodu',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/umowa-o-dzielo',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć wynagrodzenie netto z umowy o dzieło',
        'steps' => [
            ['name' => 'Wpisz kwotę brutto', 'text' => 'Podaj kwotę brutto wynagrodzenia z umowy o dzieło.'],
            ['name' => 'Wybierz koszty uzyskania przychodu', 'text' => 'Wybierz 20% (standardowe) lub 50% (prawa autorskie).'],
            ['name' => 'Sprawdź wynik', 'text' => 'Kalkulator pokaże wynagrodzenie netto i zaliczkę na podatek dochodowy.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest umowa o dzieło?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Umowa o dzieło to umowa cywilnoprawna, w której wykonawca zobowiązuje się do wykonania określonego dzieła (rezultatu), a zamawiający do zapłaty wynagrodzenia. W odróżnieniu od umowy zlecenie, liczy się efekt końcowy, a nie sam proces wykonywania pracy. Przykłady dzieł to: napisanie artykułu, stworzenie grafiki, zaprojektowanie strony internetowej, namalowanie obrazu.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Umowa o dzieło jest atrakcyjna finansowo, ponieważ co do zasady nie podlega składkom ZUS (z wyjątkiem sytuacji, gdy jest zawarta z własnym pracodawcą). Oznacza to, że jedynym obciążeniem jest zaliczka na podatek dochodowy PIT.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Koszty uzyskania przychodu — 20% vs 50%</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Kluczowym elementem obliczania wynagrodzenia netto z umowy o dzieło są koszty uzyskania przychodu (KUP). Dostępne są dwa warianty:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Koszty 20% (standardowe)</strong> — stosowane do większości umów o dzieło. Podstawa opodatkowania to 80% przychodu. Podatek 12% jest naliczany od tej pomniejszonej kwoty.</li>
          <li><strong>Koszty 50% (prawa autorskie)</strong> — stosowane gdy wykonawca przenosi prawa autorskie do dzieła na zamawiającego. Podstawa opodatkowania to tylko 50% przychodu, co znacząco obniża podatek. Dotyczy m.in. prac twórczych, artystycznych, programistycznych.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Podwyższone koszty 50% mają roczny limit — w 2026 roku wynosi on 120 000 zł. Po przekroczeniu limitu stosuje się standardowe koszty 20%. Kalkulator automatycznie uwzględnia ten limit.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Brak składek ZUS — kiedy to nie obowiązuje?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Główną zaletą umowy o dzieło jest brak obowiązku odprowadzania składek na ubezpieczenia społeczne i zdrowotne. Istnieją jednak wyjątki:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Umowa z własnym pracodawcą</strong> — jeśli umowa o dzieło jest zawarta z pracodawcą, u którego wykonawca jest jednocześnie zatrudniony na umowę o pracę, podlega pełnym składkom ZUS.</li>
          <li><strong>Obowiązek zgłoszenia do ZUS</strong> — od 2021 roku istnieje obowiązek zgłaszania umów o dzieło do ZUS (formularz RUD), ale nie oznacza to obowiązku opłacania składek.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Brak składek ZUS oznacza też brak ubezpieczenia zdrowotnego i emerytalnego z tytułu umowy o dzieło. Warto o tym pamiętać planując swoje zabezpieczenie finansowe.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Jak obliczyć podatek od umowy o dzieło?</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Obliczenie jest proste: od kwoty brutto odejmujemy koszty uzyskania przychodu (20% lub 50%), a od uzyskanej podstawy opodatkowania naliczamy podatek 12% (I próg podatkowy). Jeśli łączne dochody przekroczą 120 000 zł rocznie, nadwyżka jest opodatkowana stawką 32%. Kalkulator wykonuje te obliczenia automatycznie.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Czy od umowy o dzieło płaci się składki ZUS?', 'a' => 'Co do zasady nie. Umowa o dzieło nie podlega składkom na ubezpieczenia społeczne ani zdrowotne. Wyjątkiem jest sytuacja, gdy umowa o dzieło jest zawarta z własnym pracodawcą (u którego wykonawca jest jednocześnie zatrudniony na umowę o pracę) — wtedy podlega pełnym składkom ZUS.'],
        ['q' => 'Ile wynosi podatek od umowy o dzieło?', 'a' => 'Podatek wynosi 12% od podstawy opodatkowania (I próg podatkowy). Podstawa to przychód pomniejszony o koszty uzyskania przychodu — standardowe 20% lub podwyższone 50% (przy przeniesieniu praw autorskich). Przy dochodach powyżej 120 000 zł rocznie stawka rośnie do 32%.'],
        ['q' => 'Kiedy można zastosować 50% koszty uzyskania przychodu?', 'a' => 'Koszty 50% stosuje się, gdy wykonawca przenosi prawa autorskie do dzieła na zamawiającego. Dotyczy to m.in. prac twórczych, artystycznych, programistycznych, projektowych. Roczny limit kosztów 50% wynosi 120 000 zł — po jego przekroczeniu stosuje się koszty 20%.'],
        ['q' => 'Ile wynosi netto z umowy o dzieło na 5 000 zł brutto?', 'a' => 'Przy kosztach 20%: podstawa opodatkowania to 4 000 zł, podatek 12% = 480 zł, netto = 4 520 zł. Przy kosztach 50%: podstawa to 2 500 zł, podatek 12% = 300 zł, netto = 4 700 zł.'],
        ['q' => 'Czy umowę o dzieło trzeba zgłaszać do ZUS?', 'a' => 'Tak, od 2021 roku istnieje obowiązek zgłaszania umów o dzieło do ZUS na formularzu RUD w ciągu 7 dni od zawarcia umowy. Nie oznacza to jednak obowiązku opłacania składek — jest to jedynie obowiązek informacyjny.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-umowa-zlecenie', 'name' => 'Kalkulator umowy zlecenie', 'desc' => 'Oblicz wynagrodzenie netto i składki przy umowie zlecenie.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['document']],
        ['slug' => 'kalkulator-umowa-o-prace', 'name' => 'Kalkulator umowy o pracę', 'desc' => 'Oblicz wynagrodzenie netto z umowy o pracę i koszty pracodawcy.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['briefcase']],
    ],
];
