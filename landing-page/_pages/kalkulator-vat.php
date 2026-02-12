<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-vat',
    'title' => 'Kalkulator VAT 2026 – Oblicz netto, brutto i podatek VAT',
    'description' => 'Darmowy kalkulator VAT 2026. Przelicz kwoty netto na brutto i odwrotnie z uwzględnieniem stawki VAT. Wszystkie stawki: 23%, 8%, 5%, 0%.',
    'og_description' => 'Darmowy kalkulator VAT 2026. Przelicz kwoty netto na brutto i odwrotnie z uwzględnieniem stawki VAT.',
    'breadcrumb' => 'Kalkulator VAT',
    'h1' => 'Kalkulator VAT 2026 — netto, brutto, faktura',
    'hero_text' => 'Przelicz kwoty netto na brutto i odwrotnie z uwzględnieniem stawki VAT. Oblicz podatek VAT na fakturze. Wszystkie stawki: 23%, 8%, 5%, 0%.',
    'hero_cta' => 'Przejdź do kalkulatora VAT',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/faktura-vat',
    'cta_heading' => 'Oblicz VAT na fakturze',
    'cta_text' => 'Przelicz kwoty netto i brutto z VAT. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'faktura-vat',
    'screenshot_alt' => 'Kalkulator VAT — przeliczanie kwot netto i brutto z uwzględnieniem stawki VAT',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/faktura-vat',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć VAT na fakturze',
        'steps' => [
            ['name' => 'Wpisz kwotę', 'text' => 'Podaj kwotę netto lub brutto, którą chcesz przeliczyć.'],
            ['name' => 'Wybierz stawkę VAT', 'text' => 'Wybierz odpowiednią stawkę VAT: 23%, 8%, 5% lub 0%.'],
            ['name' => 'Sprawdź wynik', 'text' => 'Kalkulator pokaże kwotę netto, brutto i wartość podatku VAT.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest podatek VAT?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">VAT (Value Added Tax), czyli podatek od towarów i usług, to podatek pośredni doliczany do ceny netto produktów i usług. W Polsce VAT jest głównym źródłem dochodów budżetu państwa. Każdy przedsiębiorca będący czynnym podatnikiem VAT jest zobowiązany do naliczania i odprowadzania tego podatku.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator VAT pozwala szybko przeliczyć kwoty netto na brutto (i odwrotnie) z uwzględnieniem wybranej stawki VAT. Jest przydatny przy wystawianiu faktur, sprawdzaniu cen i planowaniu budżetu.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Stawki VAT w Polsce w 2026 roku</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">W Polsce obowiązują cztery główne stawki podatku VAT:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>23% — stawka podstawowa</strong> — dotyczy większości towarów i usług. Jest to domyślna stawka VAT stosowana, gdy przepisy nie przewidują stawki obniżonej.</li>
          <li><strong>8% — stawka obniżona</strong> — dotyczy m.in. usług budowlanych (budownictwo mieszkaniowe), niektórych artykułów spożywczych, usług gastronomicznych, transportu pasażerskiego.</li>
          <li><strong>5% — stawka obniżona</strong> — dotyczy podstawowych produktów żywnościowych (chleb, nabiał, mięso), książek i czasopism.</li>
          <li><strong>0% — stawka zerowa</strong> — dotyczy eksportu towarów i wewnątrzwspólnotowej dostawy towarów (WDT). Podatnik ma prawo do odliczenia VAT naliczonego.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Istnieje również zwolnienie z VAT (nie mylić ze stawką 0%) — dotyczy m.in. usług medycznych, edukacyjnych i finansowych. Przedsiębiorcy zwolnieni z VAT nie naliczają podatku na fakturach.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Jak obliczyć VAT na fakturze?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obliczenie VAT jest proste:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Z netto na brutto:</strong> brutto = netto × (1 + stawka VAT). Np. 1000 zł netto × 1,23 = 1230 zł brutto (przy stawce 23%).</li>
          <li><strong>Z brutto na netto:</strong> netto = brutto ÷ (1 + stawka VAT). Np. 1230 zł brutto ÷ 1,23 = 1000 zł netto.</li>
          <li><strong>Kwota VAT:</strong> VAT = brutto − netto. Np. 1230 − 1000 = 230 zł VAT.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator wykonuje te obliczenia automatycznie — wystarczy wpisać kwotę i wybrać stawkę VAT.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Zwolnienie z VAT — kto może skorzystać?</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przedsiębiorcy, których roczny obrót nie przekracza 200 000 zł, mogą skorzystać ze zwolnienia podmiotowego z VAT. Oznacza to, że nie muszą naliczać VAT na fakturach, ale jednocześnie nie mogą odliczać VAT od zakupów firmowych.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Zwolnienie z VAT jest korzystne dla przedsiębiorców świadczących usługi dla osób fizycznych (które nie odliczają VAT) i mających niskie koszty firmowe. Dla firm z dużymi zakupami (np. sprzęt, materiały) rejestracja jako czynny podatnik VAT może być bardziej opłacalna.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Jak obliczyć VAT z kwoty brutto?', 'a' => 'Aby obliczyć kwotę netto z brutto: netto = brutto / (1 + stawka VAT). Np. przy 1 230 zł brutto i stawce 23%: 1 230 / 1,23 = 1 000 zł netto. Kwota VAT = 1 230 - 1 000 = 230 zł.'],
        ['q' => 'Jak obliczyć VAT z kwoty netto?', 'a' => 'Aby obliczyć kwotę brutto z netto: brutto = netto × (1 + stawka VAT). Np. przy 1 000 zł netto i stawce 23%: 1 000 × 1,23 = 1 230 zł brutto. Kwota VAT = 230 zł.'],
        ['q' => 'Jakie stawki VAT obowiązują w Polsce w 2026?', 'a' => 'W Polsce obowiązują cztery stawki VAT: 23% (podstawowa — większość towarów i usług), 8% (obniżona — budownictwo mieszkaniowe, gastronomia, transport), 5% (obniżona — podstawowe artykuły spożywcze, książki) i 0% (eksport, wewnątrzwspólnotowa dostawa towarów).'],
        ['q' => 'Kto jest zwolniony z VAT?', 'a' => 'Ze zwolnienia podmiotowego z VAT mogą skorzystać przedsiębiorcy, których roczny obrót nie przekracza 200 000 zł. Zwolnienie jest korzystne przy usługach dla osób fizycznych i niskich kosztach firmowych. Niektóre usługi (np. medyczne, edukacyjne) są zwolnione przedmiotowo niezależnie od obrotu.'],
        ['q' => 'Czy opłaca się być vatowcem?', 'a' => 'Rejestracja jako czynny podatnik VAT opłaca się, gdy masz duże koszty firmowe z VAT (odliczasz VAT naliczony) lub Twoi klienci to firmy (odliczają VAT z Twoich faktur). Przy usługach dla osób fizycznych i niskich kosztach zwolnienie z VAT jest zazwyczaj korzystniejsze.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
        ['slug' => 'porownywarka-b2b', 'name' => 'Porównywarka B2B', 'desc' => 'Porównaj skalę podatkową, podatek liniowy i ryczałt w jednym miejscu.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['chart']],
        ['slug' => 'kalkulator-refundacja-skladek-spolecznych-pfron', 'name' => 'Refundacja składek PFRON', 'desc' => 'Oblicz kwotę refundacji składek społecznych PFRON.', 'gradient' => 'from-amber-500 to-amber-700', 'icon' => $icons['accessiblePerson']],
    ],
];
