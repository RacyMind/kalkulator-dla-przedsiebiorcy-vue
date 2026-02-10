<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'obligacje-skarbowe',
    'title' => 'Kalkulator obligacji skarbowych 2026 – Porównaj zysk z obligacji',
    'description' => 'Darmowy kalkulator obligacji skarbowych 2026. Porównaj zysk z OTS, DOS, TOZ, COI, EDO, ROS i ROD. Uwzględnij inflację, podatek Belki i aktualne oprocentowanie.',
    'og_description' => 'Darmowy kalkulator obligacji skarbowych 2026. Porównaj zysk z różnych rodzajów obligacji. Uwzględnij inflację i podatek Belki.',
    'breadcrumb' => 'Obligacje skarbowe',
    'h1' => 'Kalkulator obligacji skarbowych 2026',
    'hero_text' => 'Porównaj zysk z różnych rodzajów obligacji skarbowych. Uwzględnij inflację, podatek Belki i aktualne oprocentowanie. OTS, DOS, TOZ, COI, EDO, ROS, ROD.',
    'hero_cta' => 'Przejdź do kalkulatora obligacji',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/obligacje-skarbowe',
    'cta_heading' => 'Porównaj obligacje skarbowe',
    'cta_text' => 'Sprawdź ile zarobisz na obligacjach. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'obligacje-skarbowe',
    'screenshot_alt' => 'Kalkulator obligacji skarbowych — porównanie zysku z różnych rodzajów obligacji',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/obligacje-skarbowe',
    'screenshot_width' => 1280,
    'screenshot_height' => 800,
    'howto' => [
        'name' => 'Jak porównać obligacje skarbowe',
        'steps' => [
            ['name' => 'Podaj kwotę inwestycji', 'text' => 'Wpisz kwotę, którą chcesz zainwestować w obligacje skarbowe.'],
            ['name' => 'Wybierz rodzaje obligacji', 'text' => 'Zaznacz które rodzaje obligacji chcesz porównać (OTS, DOS, TOZ, COI, EDO, ROS, ROD).'],
            ['name' => 'Ustaw prognozę inflacji', 'text' => 'Podaj prognozowaną stopę inflacji dla okresu inwestycji.'],
            ['name' => 'Porównaj wyniki', 'text' => 'Kalkulator pokaże zysk netto z każdego rodzaju obligacji po uwzględnieniu podatku Belki.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym są obligacje skarbowe?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obligacje skarbowe to dłużne papiery wartościowe emitowane przez Skarb Państwa. Kupując obligację, pożyczasz pieniądze państwu, które zobowiązuje się zwrócić je z odsetkami po określonym czasie. To jedna z <strong>najbezpieczniejszych form inwestowania</strong> — gwarantem jest budżet państwa.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obligacje skarbowe można kupić online na stronie <strong>obligacjeskarbowe.pl</strong> lub w oddziałach PKO BP. Minimalna inwestycja to zaledwie 100 zł (jedna obligacja). Nie ma górnego limitu zakupu.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">W 2026 roku obligacje skarbowe cieszą się dużą popularnością, szczególnie obligacje indeksowane inflacją (COI, EDO), które chronią oszczędności przed utratą wartości. Kalkulator obligacji pozwala porównać wszystkie dostępne rodzaje i wybrać najkorzystniejszą opcję.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Rodzaje obligacji skarbowych w 2026 roku</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Ministerstwo Finansów oferuje kilka rodzajów obligacji detalicznych, różniących się okresem zapadalności i sposobem naliczania odsetek:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-3">
            <li><strong>OTS (3-miesięczne)</strong> — obligacje oszczędnościowe ze stałym oprocentowaniem. Najkrótszy okres inwestycji. Idealne do „parkowania" gotówki na krótki czas.</li>
            <li><strong>DOS (2-letnie)</strong> — obligacje ze stałym oprocentowaniem przez cały okres. Przewidywalny zysk, brak ryzyka zmiany stóp procentowych.</li>
            <li><strong>TOZ (3-letnie)</strong> — obligacje ze zmiennym oprocentowaniem, opartym o stawkę WIBOR 6M. Oprocentowanie zmienia się co pół roku.</li>
            <li><strong>COI (4-letnie)</strong> — obligacje indeksowane inflacją. W pierwszym roku stałe oprocentowanie, w kolejnych: marża + inflacja CPI. Chronią przed inflacją.</li>
            <li><strong>EDO (10-letnie)</strong> — obligacje indeksowane inflacją z najdłuższym okresem. Wyższa marża niż COI. Najlepsza ochrona długoterminowa przed inflacją.</li>
            <li><strong>ROS (6-letnie rodzinne)</strong> — obligacje indeksowane inflacją dostępne dla beneficjentów programu 800+. Wyższa marża i zwolnienie z podatku Belki.</li>
            <li><strong>ROD (12-letnie rodzinne)</strong> — najdłuższe obligacje rodzinne z najwyższą marżą. Również zwolnione z podatku Belki.</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator uwzględnia aktualne oprocentowanie każdego rodzaju obligacji i pozwala porównać zysk netto po podatku Belki (19%).</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Obligacje indeksowane inflacją — COI i EDO</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obligacje COI (4-letnie) i EDO (10-letnie) to najpopularniejsze obligacje skarbowe w Polsce. Ich oprocentowanie składa się z dwóch elementów:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Marża</strong> — stały dodatek ustalany przy emisji (np. 1,25% dla COI, 1,75% dla EDO)</li>
            <li><strong>Inflacja CPI</strong> — roczna stopa inflacji publikowana przez GUS</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Oprocentowanie w kolejnych okresach odsetkowych = marża + inflacja. Jeśli inflacja wynosi 4%, a marża 1,25%, to oprocentowanie COI wyniesie 5,25%. Dzięki temu <strong>realna wartość oszczędności jest chroniona</strong> — zysk zawsze przewyższa inflację o wartość marży.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">EDO (10-letnie) oferują wyższą marżę niż COI, ale wymagają dłuższego zamrożenia kapitału. Wcześniejszy wykup jest możliwy, ale wiąże się z opłatą (zwykle 0,70 zł za obligację).</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Obligacje rodzinne ROS i ROD — bez podatku Belki</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obligacje rodzinne (ROS 6-letnie i ROD 12-letnie) to specjalne emisje dostępne wyłącznie dla beneficjentów programu Rodzina 800+. Ich kluczowe zalety:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Zwolnienie z podatku Belki</strong> — odsetki nie podlegają 19% podatkowi od zysków kapitałowych</li>
            <li><strong>Wyższa marża</strong> — ROS: ok. 1,50%, ROD: ok. 2,00% ponad inflację</li>
            <li><strong>Indeksacja inflacją</strong> — pełna ochrona przed inflacją, jak COI i EDO</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Dzięki zwolnieniu z podatku Belki, obligacje rodzinne oferują najwyższy realny zysk spośród wszystkich obligacji skarbowych. Kalkulator automatycznie uwzględnia brak podatku przy obliczaniu zysku z ROS i ROD.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Obligacje skarbowe vs lokata bankowa — co się bardziej opłaca?</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Obligacje skarbowe, szczególnie indeksowane inflacją, mają kilka przewag nad lokatami bankowymi:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Ochrona przed inflacją</strong> — lokaty mają stałe oprocentowanie, obligacje COI/EDO rosną z inflacją</li>
            <li><strong>Gwarancja Skarbu Państwa</strong> — bezpieczniejsze niż lokaty (BFG gwarantuje do 100 000 EUR)</li>
            <li><strong>Brak limitu gwarancji</strong> — cała kwota w obligacjach jest gwarantowana przez państwo</li>
            <li><strong>Obligacje rodzinne bez podatku</strong> — lokaty zawsze podlegają podatkowi Belki</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Lokaty mogą być korzystniejsze przy krótkim horyzoncie (do 3 miesięcy) i wysokich stopach procentowych. Dla oszczędności długoterminowych obligacje indeksowane inflacją są zwykle lepszym wyborem. Kalkulator pomoże porównać obie opcje.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Które obligacje skarbowe są najlepsze w 2026 roku?', 'a' => 'Przy wysokiej inflacji najkorzystniejsze są obligacje indeksowane inflacją: COI (4-letnie) i EDO (10-letnie). Dla beneficjentów programu 800+ obligacje rodzinne ROS i ROD oferują jeszcze wyższą marżę i zwolnienie z podatku Belki. Przy niskiej inflacji lepsze mogą być obligacje o stałym oprocentowaniu (DOS, TOZ).'],
        ['q' => 'Czy obligacje skarbowe są bezpieczne?', 'a' => 'Tak, obligacje skarbowe są jedną z najbezpieczniejszych form inwestowania. Gwarantem jest Skarb Państwa (budżet Polski). W przeciwieństwie do lokat bankowych (gwarancja BFG do 100 000 EUR), obligacje skarbowe nie mają górnego limitu gwarancji.'],
        ['q' => 'Ile można zarobić na obligacjach skarbowych?', 'a' => 'Zysk zależy od rodzaju obligacji i inflacji. Obligacje COI (4-letnie) oferują marżę ok. 1,25% + inflacja CPI. Przy inflacji 4% daje to ok. 5,25% brutto (4,25% netto po podatku Belki). Obligacje rodzinne ROS/ROD mają wyższą marżę i brak podatku Belki.'],
        ['q' => 'Jak kupić obligacje skarbowe?', 'a' => 'Obligacje skarbowe można kupić online na stronie obligacjeskarbowe.pl (po założeniu konta) lub w oddziałach PKO BP. Minimalna inwestycja to 100 zł (jedna obligacja). Zakup jest prosty i nie wymaga wiedzy inwestycyjnej.'],
        ['q' => 'Czym są obligacje rodzinne ROS i ROD?', 'a' => 'Obligacje rodzinne to specjalne emisje dostępne wyłącznie dla beneficjentów programu Rodzina 800+. ROS (6-letnie) i ROD (12-letnie) oferują wyższą marżę ponad inflację i są zwolnione z podatku Belki (19%), co czyni je najkorzystniejszymi obligacjami skarbowymi.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-ike', 'name' => 'Kalkulator IKE', 'desc' => 'Symuluj oszczędności emerytalne bez podatku Belki.', 'gradient' => 'from-indigo-500 to-indigo-700', 'icon' => $icons['money']],
        ['slug' => 'kalkulator-ikze', 'name' => 'Kalkulator IKZE', 'desc' => 'Oblicz ulgę podatkową z wpłat na IKZE.', 'gradient' => 'from-purple-500 to-purple-700', 'icon' => $icons['coin']],
        ['slug' => 'kalkulator-vat', 'name' => 'Kalkulator VAT', 'desc' => 'Przelicz kwoty netto i brutto z uwzględnieniem stawki VAT.', 'gradient' => 'from-amber-500 to-amber-700', 'icon' => $icons['calculator']],
    ],
];
