<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-b2b',
    'title' => 'Kalkulator B2B 2026 – Oblicz wynagrodzenie netto z działalności',
    'description' => 'Darmowy kalkulator B2B 2026. Oblicz wynagrodzenie netto na samozatrudnieniu. Porównaj skalę podatkową, podatek liniowy i ryczałt. Aktualne składki ZUS.',
    'og_description' => 'Darmowy kalkulator B2B 2026. Oblicz wynagrodzenie netto na samozatrudnieniu. Porównaj skalę podatkową, podatek liniowy i ryczałt.',
    'breadcrumb' => 'Kalkulator B2B',
    'h1' => 'Kalkulator samozatrudnienia B2B 2026',
    'hero_text' => 'Oblicz wynagrodzenie netto na działalności gospodarczej. Uwzględnij formę opodatkowania, składki ZUS i koszty prowadzenia firmy. Aktualne stawki na rok 2026.',
    'hero_cta' => 'Przejdź do kalkulatora B2B',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/samozatrudnienie',
    'cta_heading' => 'Oblicz swoje wynagrodzenie B2B',
    'cta_text' => 'Sprawdź ile zarobisz netto na działalności gospodarczej. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'samozatrudnienie',
    'screenshot_alt' => 'Kalkulator samozatrudnienia B2B — formularz obliczania dochodu z działalności gospodarczej',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/samozatrudnienie',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć wynagrodzenie netto na B2B',
        'steps' => [
            ['name' => 'Wpisz kwotę na fakturze', 'text' => 'Podaj kwotę brutto (netto + VAT) lub netto na fakturze, którą wystawiasz klientowi.'],
            ['name' => 'Wybierz formę opodatkowania', 'text' => 'Wybierz skalę podatkową (12%/32%), podatek liniowy (19%) lub ryczałt ewidencjonowany (np. 12% dla IT).'],
            ['name' => 'Ustaw parametry ZUS', 'text' => 'Wybierz wariant składek ZUS: preferencyjny (pierwsze 24 miesiące), mały ZUS plus lub pełny ZUS.'],
            ['name' => 'Sprawdź wynik', 'text' => 'Kalkulator pokaże wynagrodzenie netto, składki ZUS, zaliczkę na podatek dochodowy i składkę zdrowotną.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest samozatrudnienie B2B?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Samozatrudnienie B2B (business-to-business) to forma prowadzenia jednoosobowej działalności gospodarczej, w której przedsiębiorca świadczy usługi na rzecz innych firm na podstawie umowy o współpracę. W Polsce jest to jedna z najpopularniejszych form zatrudnienia w branży IT, konsultingu, marketingu i wielu innych sektorach.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">W odróżnieniu od umowy o pracę, osoba na B2B samodzielnie odprowadza składki ZUS i zaliczki na podatek dochodowy. Daje to większą elastyczność w wyborze formy opodatkowania, ale wymaga też samodzielnego zarządzania finansami firmy.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Formy opodatkowania na B2B w 2026 roku</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Wybór formy opodatkowania to jedna z najważniejszych decyzji finansowych dla osoby na samozatrudnieniu. W 2026 roku dostępne są trzy główne opcje:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Skala podatkowa (12% / 32%)</strong> — stawka 12% do kwoty 120 000 zł dochodu rocznie, powyżej 32%. Pozwala na korzystanie z kwoty wolnej od podatku (30 000 zł) i wspólne rozliczenie z małżonkiem.</li>
          <li><strong>Podatek liniowy (19%)</strong> — stała stawka 19% niezależnie od wysokości dochodu. Brak kwoty wolnej i możliwości wspólnego rozliczenia. Opłacalny przy dochodach powyżej ok. 120 000 zł rocznie.</li>
          <li><strong>Ryczałt ewidencjonowany</strong> — podatek od przychodu (bez odliczania kosztów). Stawki zależą od rodzaju działalności, np. 12% dla usług IT, 8,5% dla wielu usług. Najprostszy w rozliczeniu.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator B2B pozwala szybko porównać wszystkie trzy formy opodatkowania i wybrać najkorzystniejszą opcję dla Twojej sytuacji finansowej.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Składki ZUS na działalności gospodarczej w 2026</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Każdy przedsiębiorca na B2B jest zobowiązany do opłacania składek na ubezpieczenia społeczne i zdrowotne. W 2026 roku obowiązują następujące warianty:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>ZUS preferencyjny</strong> — obniżone składki przez pierwsze 24 miesiące prowadzenia działalności. Podstawa wymiaru to 30% minimalnego wynagrodzenia.</li>
          <li><strong>Mały ZUS plus</strong> — składki uzależnione od przychodu z poprzedniego roku. Dostępny dla przedsiębiorców z przychodem do 120 000 zł rocznie.</li>
          <li><strong>Pełny ZUS</strong> — standardowe składki obliczane od 60% prognozowanego przeciętnego wynagrodzenia. Obowiązkowe po zakończeniu okresu preferencyjnego.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Składka zdrowotna na B2B zależy od formy opodatkowania — na skali podatkowej i liniowym wynosi 9% dochodu (z minimalną kwotą), a na ryczałcie jest zryczałtowana i zależy od progu przychodów.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Jak obliczyć wynagrodzenie netto na B2B?</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obliczenie wynagrodzenia netto na samozatrudnieniu wymaga uwzględnienia wielu zmiennych: kwoty na fakturze, formy opodatkowania, wariantu ZUS, kosztów uzyskania przychodu i składki zdrowotnej. Kalkulator B2B automatycznie uwzględnia wszystkie te parametry i pokazuje dokładną kwotę, która trafia „na rękę".</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Wystarczy wpisać kwotę brutto na fakturze, wybrać formę opodatkowania i wariant ZUS — kalkulator natychmiast pokaże wynagrodzenie netto, wysokość poszczególnych składek i zaliczkę na podatek dochodowy.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Ile wynosi wynagrodzenie netto na B2B przy fakturze 10 000 zł brutto?', 'a' => 'Wynagrodzenie netto zależy od formy opodatkowania i wariantu ZUS. Przy skali podatkowej i pełnym ZUS to ok. 7 200–7 600 zł netto, przy ryczałcie 12% ok. 7 800–8 100 zł. Kalkulator B2B pozwala obliczyć dokładną kwotę dla Twojej sytuacji.'],
        ['q' => 'Która forma opodatkowania na B2B jest najkorzystniejsza w 2026?', 'a' => 'Zależy od wysokości dochodu. Skala podatkowa opłaca się przy dochodach do ok. 120 000 zł rocznie (dzięki kwocie wolnej 30 000 zł). Podatek liniowy 19% jest korzystny powyżej tego progu. Ryczałt może być najlepszy przy niskich kosztach i odpowiedniej stawce (np. 12% dla IT).'],
        ['q' => 'Ile wynoszą składki ZUS na B2B w 2026 roku?', 'a' => 'Pełny ZUS to ok. 1 600 zł miesięcznie (składki społeczne + Fundusz Pracy). Składka zdrowotna zależy od formy opodatkowania — na skali i liniowym to 9% dochodu, na ryczałcie jest zryczałtowana. ZUS preferencyjny to ok. 400 zł miesięcznie.'],
        ['q' => 'Czy na B2B opłaca się VAT?', 'a' => 'Rejestracja jako czynny podatnik VAT opłaca się, gdy masz duże koszty firmowe (odliczasz VAT od zakupów) lub Twoi klienci to firmy (odliczają VAT z Twoich faktur). Przy usługach dla osób fizycznych i niskich kosztach zwolnienie z VAT może być korzystniejsze.'],
        ['q' => 'Jak przejść z umowy o pracę na B2B?', 'a' => 'Musisz zarejestrować działalność gospodarczą w CEIDG, wybrać formę opodatkowania i zgłosić się do ZUS. Przez pierwsze 6 miesięcy możesz korzystać z ulgi na start (brak składek społecznych), a przez kolejne 24 miesiące z ZUS preferencyjnego.'],
    ],
    'related' => [
        ['slug' => 'porownywarka-b2b', 'name' => 'Porównywarka B2B', 'desc' => 'Porównaj skalę podatkową, podatek liniowy i ryczałt w jednym miejscu.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['chart']],
        ['slug' => 'kalkulator-umowa-o-prace', 'name' => 'Kalkulator umowy o pracę', 'desc' => 'Oblicz wynagrodzenie netto z umowy o pracę i koszty pracodawcy.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['briefcase']],
        ['slug' => 'kalkulator-vat', 'name' => 'Kalkulator VAT', 'desc' => 'Przelicz kwoty netto i brutto z uwzględnieniem stawki VAT.', 'gradient' => 'from-amber-500 to-amber-700', 'icon' => $icons['money']],
    ],
];
