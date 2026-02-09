<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'porownywarka-b2b',
    'title' => 'Porównywarka B2B 2026 – Skala podatkowa vs liniowy vs ryczałt',
    'description' => 'Darmowa porównywarka form opodatkowania B2B 2026. Porównaj skalę podatkową, podatek liniowy i ryczałt ewidencjonowany. Sprawdź która forma jest najkorzystniejsza.',
    'og_description' => 'Darmowa porównywarka form opodatkowania B2B 2026. Porównaj skalę podatkową, podatek liniowy i ryczałt ewidencjonowany.',
    'breadcrumb' => 'Porównywarka B2B',
    'h1' => 'Porównanie form opodatkowania B2B 2026',
    'hero_text' => 'Nie wiesz, która forma opodatkowania jest dla Ciebie najlepsza? Porównaj skalę podatkową, podatek liniowy i ryczałt ewidencjonowany w jednym miejscu.',
    'hero_cta' => 'Porównaj formy opodatkowania',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/porownywarka-b2b',
    'cta_heading' => 'Porównaj formy opodatkowania B2B',
    'cta_text' => 'Sprawdź która forma opodatkowania jest dla Ciebie najkorzystniejsza. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'porownywarka-b2b',
    'screenshot_alt' => 'Porównywarka form opodatkowania B2B — porównanie skali podatkowej, podatku liniowego i ryczałtu',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/porownywarka-b2b',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak porównać formy opodatkowania na B2B',
        'steps' => [
            ['name' => 'Wpisz przychód', 'text' => 'Podaj miesięczny lub roczny przychód z działalności gospodarczej.'],
            ['name' => 'Podaj koszty', 'text' => 'Wpisz koszty uzyskania przychodu (nie dotyczy ryczałtu).'],
            ['name' => 'Porównaj wyniki', 'text' => 'Kalkulator pokaże wynagrodzenie netto dla każdej formy opodatkowania obok siebie.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Skala podatkowa, liniowy czy ryczałt — co wybrać?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Wybór formy opodatkowania to jedna z najważniejszych decyzji finansowych dla przedsiębiorcy prowadzącego jednoosobową działalność gospodarczą. Każda forma ma swoje zalety i wady, a optymalna opcja zależy od wysokości przychodów, kosztów i indywidualnej sytuacji podatkowej.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Nasza porównywarka B2B pozwala w kilka sekund porównać wszystkie trzy formy opodatkowania i zobaczyć, ile pieniędzy zostanie „na rękę" w każdym wariancie. Wystarczy wpisać przychód i koszty — kalkulator zrobi resztę.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Skala podatkowa (12% / 32%)</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Skala podatkowa to domyślna forma opodatkowania w Polsce. Charakteryzuje się dwoma progami podatkowymi:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>I próg: 12%</strong> — dochód do 120 000 zł rocznie</li>
          <li><strong>II próg: 32%</strong> — dochód powyżej 120 000 zł rocznie</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"><strong>Zalety:</strong> kwota wolna od podatku (30 000 zł), możliwość wspólnego rozliczenia z małżonkiem, ulgi podatkowe (na dzieci, rehabilitacyjna itp.).</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"><strong>Wady:</strong> wysoka stawka 32% po przekroczeniu progu, składka zdrowotna 9% od dochodu (bez możliwości odliczenia).</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Podatek liniowy (19%)</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Podatek liniowy to stała stawka 19% niezależnie od wysokości dochodu. Jest popularny wśród przedsiębiorców z wysokimi dochodami.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"><strong>Zalety:</strong> stała, przewidywalna stawka podatku, brak II progu podatkowego, składka zdrowotna 4,9% od dochodu (niższa niż na skali).</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"><strong>Wady:</strong> brak kwoty wolnej od podatku, brak możliwości wspólnego rozliczenia z małżonkiem, brak ulgi na dzieci. Opłacalny dopiero przy dochodach powyżej ok. 120 000 zł rocznie.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Ryczałt ewidencjonowany</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Ryczałt to podatek od przychodu (nie od dochodu). Oznacza to, że nie można odliczać kosztów uzyskania przychodu. Stawki zależą od rodzaju działalności:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>12%</strong> — usługi IT, programowanie, doradztwo</li>
          <li><strong>8,5%</strong> — większość usług (np. marketing, szkolenia)</li>
          <li><strong>5,5%</strong> — działalność produkcyjna, budowlana</li>
          <li><strong>3%</strong> — handel, gastronomia</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"><strong>Zalety:</strong> niskie stawki podatkowe, zryczałtowana składka zdrowotna (niezależna od dochodu), najprostsze rozliczenie.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"><strong>Wady:</strong> brak możliwości odliczania kosztów, brak kwoty wolnej, brak wspólnego rozliczenia. Nieopłacalny przy wysokich kosztach prowadzenia działalności.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Kiedy zmienić formę opodatkowania?</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Formę opodatkowania można zmienić do 20 dnia miesiąca następującego po miesiącu, w którym uzyskano pierwszy przychód w danym roku podatkowym (lub do 20 lutego, jeśli działalność jest kontynuowana). Warto co roku sprawdzać, czy aktualna forma jest nadal optymalna — nasza porównywarka pomoże podjąć tę decyzję.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Która forma opodatkowania B2B daje najwyższe wynagrodzenie netto?', 'a' => 'Zależy od wysokości dochodu i kosztów. Skala podatkowa jest najkorzystniejsza przy dochodach do ok. 120 000 zł rocznie. Podatek liniowy 19% opłaca się powyżej tego progu. Ryczałt bywa najlepszy przy niskich kosztach i korzystnej stawce (np. 12% dla IT). Porównywarka pokaże dokładne różnice dla Twojej kwoty.'],
        ['q' => 'Czy mogę zmienić formę opodatkowania w trakcie roku?', 'a' => 'Formę opodatkowania można zmienić do 20 dnia miesiąca następującego po miesiącu, w którym uzyskano pierwszy przychód w danym roku (lub do 20 lutego przy kontynuacji działalności). Zmiana obowiązuje od początku roku podatkowego.'],
        ['q' => 'Jak składka zdrowotna różni się między formami opodatkowania?', 'a' => 'Na skali podatkowej i podatku liniowym składka zdrowotna wynosi 9% dochodu (z minimalną kwotą). Na ryczałcie jest zryczałtowana i zależy od progu przychodów — jest stała niezależnie od dochodu, co bywa korzystniejsze przy wysokich zarobkach.'],
        ['q' => 'Czy na ryczałcie mogę odliczać koszty?', 'a' => 'Nie. Ryczałt ewidencjonowany to podatek od przychodu, bez możliwości odliczania kosztów uzyskania przychodu. Dlatego ryczałt jest opłacalny głównie przy działalności o niskich kosztach (np. usługi, freelancing).'],
        ['q' => 'Co jest korzystniejsze — B2B czy umowa o pracę?', 'a' => 'B2B zazwyczaj daje wyższe wynagrodzenie netto przy tej samej kwocie brutto, ale wiąże się z koniecznością samodzielnego opłacania ZUS, brakiem urlopu płatnego i odprawy. Opłacalność zależy od kwoty na fakturze, formy opodatkowania i wariantu ZUS.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
        ['slug' => 'kalkulator-vat', 'name' => 'Kalkulator VAT', 'desc' => 'Przelicz kwoty netto i brutto z uwzględnieniem stawki VAT.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['money']],
    ],
];
