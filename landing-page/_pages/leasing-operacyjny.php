<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'leasing-operacyjny',
    'title' => 'Leasing operacyjny 2026 – kalkulator rat, kosztów i VAT',
    'description' => 'Darmowy kalkulator leasingu operacyjnego 2026. Policz ratę, opłatę wstępną, wykup, koszt całkowity, VAT do odliczenia i koszty podatkowe.',
    'og_description' => 'Policz leasing operacyjny dla samochodu lub innego środka trwałego. Sprawdź ratę, wykup, VAT i koszty podatkowe.',
    'breadcrumb' => 'Leasing operacyjny',
    'h1' => 'Leasing operacyjny 2026 – kalkulator rat i kosztów',
    'hero_text' => 'Sprawdź ratę leasingową, opłatę wstępną, wykup, koszt całkowity, VAT do odliczenia i wpływ na koszty podatkowe. Kalkulator działa za darmo i od razu pokazuje harmonogram rat.',
    'hero_cta' => 'Przejdź do kalkulatora leasingu',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/leasing-operacyjny',
    'cta_heading' => 'Policz leasing operacyjny bez arkusza Excel',
    'cta_text' => 'Wpisz parametry umowy i od razu zobacz ratę, wykup oraz podsumowanie kosztów. Bez logowania i bez opłat.',
    'screenshot' => 'leasing-operacyjny',
    'screenshot_alt' => 'Kalkulator leasingu operacyjnego z formularzem parametrów umowy i podsumowaniem wyników',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/leasing-operacyjny',
    'screenshot_width' => 1929,
    'screenshot_height' => 1800,
    'howto' => [
        'name' => 'Jak policzyć leasing operacyjny',
        'steps' => [
            ['name' => 'Podaj wartość przedmiotu', 'text' => 'Wpisz wartość netto przedmiotu leasingu i wybierz, czy dotyczy samochodu osobowego czy innego środka trwałego.'],
            ['name' => 'Ustaw parametry umowy', 'text' => 'Określ opłatę wstępną, liczbę rat, wartość wykupu i oprocentowanie roczne.'],
            ['name' => 'Wybierz ustawienia podatkowe', 'text' => 'Ustaw stawkę VAT i poziom odliczenia VAT odpowiedni dla sposobu użytkowania przedmiotu.'],
            ['name' => 'Sprawdź wynik', 'text' => 'Kalkulator pokaże ratę netto i brutto, koszt całkowity, VAT do odliczenia, koszty podatkowe oraz harmonogram rat.'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Do czego służy kalkulator leasingu operacyjnego?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Kalkulator leasingu operacyjnego pozwala szybko oszacować miesięczną ratę, wysokość opłaty wstępnej, wartość wykupu i łączny koszt finansowania. Zamiast ręcznie liczyć każdy wariant w arkuszu kalkulacyjnym, możesz od razu porównać różne scenariusze — dla samochodu osobowego, maszyny produkcyjnej, sprzętu IT czy innego środka trwałego.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">To przydatne zarówno wtedy, gdy dopiero zbierasz oferty od leasingodawców, jak i wtedy, gdy chcesz sprawdzić, jak zmiana liczby rat, wkładu własnego albo oprocentowania wpływa na miesięczne obciążenie budżetu firmy. Kalkulator pokazuje nie tylko ratę, ale też podział na koszt całkowity, VAT do odliczenia i koszty uzyskania przychodu.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Co policzy kalkulator leasingu?</h2>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li><strong>Ratę miesięczną netto i brutto</strong> — dla wybranego okresu leasingu, oprocentowania rocznego i wartości przedmiotu.</li>
            <li><strong>Opłatę wstępną i kwotę finansowaną</strong> — dzięki czemu łatwo oceniasz wpływ wkładu własnego na wysokość raty.</li>
            <li><strong>Wartość wykupu i koszt całkowity</strong> — łącznie z odsetkami, żebyś widział pełny koszt umowy leasingowej.</li>
            <li><strong>VAT łącznie i VAT do odliczenia</strong> — zależnie od sposobu użytkowania przedmiotu (100% lub 50% przy użytku mieszanym).</li>
            <li><strong>Koszty uzyskania przychodu (KUP)</strong> — dla samochodu osobowego z uwzględnieniem limitu 150 tys. zł i proporcji kosztów.</li>
            <li><strong>Harmonogram rat</strong> — z podziałem każdej raty na część kapitałową i odsetkową oraz saldo pozostałe do spłaty.</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Dzięki temu od razu widzisz, czy dana oferta leasingowa mieści się w budżecie firmy i jak wpływa na Twoje rozliczenia podatkowe.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Leasing operacyjny a finansowy — różnice</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">W leasingu operacyjnym przedmiot pozostaje własnością leasingodawcy przez cały okres umowy. Raty leasingowe stanowią koszt uzyskania przychodu, a przedsiębiorca odlicza VAT od każdej raty. Po zakończeniu umowy leasingobiorca może wykupić przedmiot po ustalonej wartości wykupu.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">W leasingu finansowym przedmiot od razu trafia do ewidencji środków trwałych leasingobiorcy, który dokonuje odpisów amortyzacyjnych. Kosztem podatkowym jest tylko część odsetkowa raty, a nie cała rata jak w leasingu operacyjnym.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Dla większości firm leasing operacyjny jest prostszy w rozliczeniu i pozwala zaliczyć całą ratę w koszty podatkowe. Ten kalkulator dotyczy właśnie leasingu operacyjnego — najpopularniejszej formy finansowania środków trwałych w Polsce.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Leasing samochodu osobowego — limity podatkowe 2026</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przy leasingu samochodu osobowego obowiązują dodatkowe ograniczenia podatkowe. Limit wartości pojazdu zaliczanej do kosztów uzyskania przychodu wynosi 150 000 zł netto (lub 225 000 zł dla pojazdów elektrycznych). Jeśli wartość auta przekracza ten limit, tylko proporcjonalna część raty i opłaty wstępnej stanowi KUP.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Odliczenie VAT zależy od sposobu użytkowania pojazdu. Przy użytku mieszanym (firmowym i prywatnym) przysługuje odliczenie 50% VAT. Przy użytku wyłącznie firmowym — z prowadzoną ewidencją przebiegu — można odliczyć 100% VAT.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator automatycznie uwzględnia te limity i oblicza rzeczywisty koszt podatkowy leasingu samochodu, w tym proporcję KUP i kwotę VAT do odliczenia.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Kiedy leasing operacyjny się opłaca?</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Leasing operacyjny opłaca się, gdy chcesz korzystać z nowego samochodu, maszyny lub sprzętu bez angażowania pełnej kwoty z góry. Raty rozkładają koszt na czas trwania umowy, a jednocześnie obniżają podstawę opodatkowania firmy. To szczególnie korzystne dla czynnych podatników VAT, którzy odliczają podatek od każdej raty.</p>
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Kalkulator pomoże Ci ocenić opłacalność leasingu w konkretnych liczbach. Porównaj kilka wariantów — zmień liczbę rat, wysokość opłaty wstępnej lub wartość wykupu — i sprawdź, jak wpływa to na ratę, koszt całkowity i koszty podatkowe.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Co pokazuje kalkulator leasingu operacyjnego?', 'a' => 'Kalkulator pokazuje ratę miesięczną netto i brutto, opłatę wstępną, wartość wykupu, koszt całkowity umowy, VAT do odliczenia, koszty uzyskania przychodu (KUP) oraz pełny harmonogram rat z podziałem na część kapitałową i odsetkową.'],
        ['q' => 'Jaka jest różnica między leasingiem operacyjnym a finansowym?', 'a' => 'W leasingu operacyjnym przedmiot jest własnością leasingodawcy, a cała rata stanowi koszt uzyskania przychodu. W leasingu finansowym przedmiot trafia do środków trwałych leasingobiorcy, a kosztem jest tylko część odsetkowa raty i amortyzacja.'],
        ['q' => 'Jaki jest limit kosztów podatkowych przy leasingu samochodu osobowego?', 'a' => 'Limit wartości samochodu osobowego zaliczanej do kosztów uzyskania przychodu wynosi 150 000 zł netto (225 000 zł dla pojazdów elektrycznych). Jeśli wartość auta przekracza limit, tylko proporcjonalna część raty i opłaty wstępnej stanowi KUP.'],
        ['q' => 'Ile VAT mogę odliczyć od rat leasingowych?', 'a' => 'Przy użytku wyłącznie firmowym (z ewidencją przebiegu pojazdu) można odliczyć 100% VAT. Przy użytku mieszanym (firmowym i prywatnym) przysługuje odliczenie 50% VAT od rat, opłaty wstępnej i wykupu.'],
        ['q' => 'Czy mogę porównać różne warianty leasingu?', 'a' => 'Tak. Wystarczy zmienić parametry umowy — liczbę rat, wysokość opłaty wstępnej, wartość wykupu lub oprocentowanie — a kalkulator od razu przeliczy nową ratę i koszt całkowity.'],
        ['q' => 'Czy kalkulator leasingu jest darmowy?', 'a' => 'Tak. Kalkulator działa bezpłatnie, bez rejestracji i od razu po wejściu na stronę aplikacji.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-vat', 'name' => 'Kalkulator VAT', 'desc' => 'Przelicz netto, brutto i podatek VAT dla faktur i kosztów firmowych.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['money']],
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Sprawdź dochód netto na działalności gospodarczej i policz obciążenia firmy.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
        ['slug' => 'porownywarka-b2b', 'name' => 'Porównywarka B2B', 'desc' => 'Porównaj różne warianty opodatkowania i kosztów prowadzenia firmy.', 'gradient' => 'from-amber-500 to-amber-700', 'icon' => $icons['chart']],
    ],
];
