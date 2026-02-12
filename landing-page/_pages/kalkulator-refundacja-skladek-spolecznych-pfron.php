<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-refundacja-skladek-spolecznych-pfron',
    'title' => 'Kalkulator refundacji składek społecznych PFRON 2026 – Oblicz refundację',
    'description' => 'Darmowy kalkulator refundacji składek społecznych PFRON 2026. Oblicz kwotę refundacji składek emerytalnej i rentowej dla stopnia znacznego, umiarkowanego i lekkiego.',
    'og_description' => 'Oblicz refundację składek społecznych PFRON: 100%, 60% lub 30% zależnie od stopnia niepełnosprawności i podstawy wymiaru składek.',
    'breadcrumb' => 'Refundacja składek społecznych PFRON',
    'h1' => 'Kalkulator refundacji składek społecznych PFRON 2026',
    'hero_text' => 'Sprawdź wysokość refundacji PFRON dla obowiązkowych składek emerytalnej i rentowej. Kalkulator uwzględnia poziomy refundacji 100%, 60% i 30%.',
    'hero_cta' => 'Oblicz refundację PFRON',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/refundacja-skladek-spolecznych-pfron',
    'cta_heading' => 'Oblicz swoją refundację składek PFRON',
    'cta_text' => 'W kilka sekund sprawdź kwotę refundacji i koszt składek po wsparciu PFRON.',
    'screenshot' => 'kalkulator-refundacja-skladek-spolecznych-pfron',
    'screenshot_alt' => 'Kalkulator refundacji składek społecznych PFRON — obliczenie kwoty refundacji i kosztu po refundacji',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/refundacja-skladek-spolecznych-pfron',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć refundację składek społecznych PFRON',
        'steps' => [
            ['name' => 'Wybierz stopień niepełnosprawności', 'text' => 'Wybierz stopień: znaczny, umiarkowany albo lekki. Od tego zależy poziom refundacji.'],
            ['name' => 'Ustaw podstawę wymiaru składek', 'text' => 'Wskaż podstawę ZUS lub wpisz własną kwotę podstawy wymiaru składek społecznych.'],
            ['name' => 'Uruchom kalkulację', 'text' => 'Kalkulator obliczy składkę emerytalną i rentową oraz zastosuje odpowiednią stawkę refundacji PFRON.'],
            ['name' => 'Sprawdź wynik', 'text' => 'Otrzymasz kwotę refundacji i koszt składek po refundacji, który zostaje po stronie przedsiębiorcy.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Na czym polega refundacja składek społecznych przez PFRON?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Refundacja składek społecznych PFRON to mechanizm wsparcia przedsiębiorców z niepełnosprawnością. Obejmuje obowiązkowe składki emerytalną i rentową opłacane do ZUS, a wysokość refundacji zależy od stopnia niepełnosprawności.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Dzięki kalkulatorowi szybko sprawdzisz, jaką część składek możesz odzyskać oraz jaki będzie realny koszt składek po uwzględnieniu refundacji.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Poziomy refundacji PFRON</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Poziom wsparcia zależy od stopnia niepełnosprawności przedsiębiorcy:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Stopień znaczny</strong> — refundacja 100% składek emerytalnej i rentowej.</li>
          <li><strong>Stopień umiarkowany</strong> — refundacja 60% składek emerytalnej i rentowej.</li>
          <li><strong>Stopień lekki</strong> — refundacja 30% składek emerytalnej i rentowej.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator przelicza refundację automatycznie na podstawie wybranego stopnia oraz aktualnej podstawy wymiaru składek.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Jak liczymy składki i refundację?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Podstawą obliczeń jest podstawa wymiaru składek społecznych przedsiębiorcy. Kalkulator wyznacza składkę emerytalną i rentową, sumuje je, a następnie mnoży przez poziom refundacji PFRON wynikający ze stopnia niepełnosprawności.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Wynik obejmuje trzy kluczowe wartości:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li>łączną kwotę składek społecznych objętych refundacją,</li>
          <li>kwotę refundacji PFRON,</li>
          <li>koszt składek po refundacji (część finansowana przez przedsiębiorcę).</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">To pozwala szybko ocenić realne obciążenie i zaplanować płynność finansową działalności.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Dla kogo jest ten kalkulator?</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">To narzędzie jest dla osób prowadzących działalność gospodarczą, które rozliczają składki ZUS i korzystają lub planują korzystać z refundacji PFRON. Sprawdza się zarówno przy standardowej podstawie ZUS, jak i przy podstawie ustawianej ręcznie.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator nie wymaga rejestracji i umożliwia szybkie porównanie wariantów dla różnych poziomów refundacji.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Jakie składki obejmuje refundacja PFRON?', 'a' => 'Refundacja obejmuje obowiązkowe składki emerytalną i rentową przedsiębiorcy.'],
        ['q' => 'Ile wynosi refundacja przy stopniu znacznym?', 'a' => 'Przy stopniu znacznym refundacja wynosi 100% składek emerytalnej i rentowej objętych kalkulacją.'],
        ['q' => 'Czy kalkulator uwzględnia różne podstawy ZUS?', 'a' => 'Tak. Możesz wybrać gotową podstawę składek albo wpisać własną kwotę, a kalkulator przeliczy wynik automatycznie.'],
        ['q' => 'Co oznacza koszt po refundacji?', 'a' => 'To część składek emerytalnej i rentowej, która pozostaje do opłacenia przez przedsiębiorcę po odjęciu refundacji PFRON.'],
        ['q' => 'Czy mogę porównać poziomy refundacji 100%, 60% i 30%?', 'a' => 'Tak. Wystarczy zmienić stopień niepełnosprawności, aby zobaczyć wpływ poziomu refundacji na końcowy koszt składek.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
        ['slug' => 'porownywarka-b2b', 'name' => 'Porównywarka B2B', 'desc' => 'Porównaj formy opodatkowania działalności w jednym miejscu.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['chart']],
        ['slug' => 'kalkulator-vat', 'name' => 'Kalkulator VAT', 'desc' => 'Przelicz kwoty netto i brutto na fakturze z VAT.', 'gradient' => 'from-amber-500 to-amber-700', 'icon' => $icons['money']],
    ],
];
