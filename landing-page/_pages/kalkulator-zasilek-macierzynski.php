<?php
require_once __DIR__ . '/../_includes/icons.php';

return [
    'slug' => 'kalkulator-zasilek-macierzynski',
    'title' => 'Kalkulator zasiłku macierzyńskiego 2026 – Oblicz świadczenie',
    'description' => 'Darmowy kalkulator zasiłku macierzyńskiego 2026. Oblicz wysokość zasiłku dla umowy o pracę i działalności gospodarczej. Wariant A (81,5%) i B (100%/70%). Aktualne stawki ZUS.',
    'og_description' => 'Darmowy kalkulator zasiłku macierzyńskiego 2026. Oblicz wysokość zasiłku macierzyńskiego i rodzicielskiego dla różnych form zatrudnienia.',
    'breadcrumb' => 'Kalkulator zasiłku macierzyńskiego',
    'h1' => 'Kalkulator zasiłku macierzyńskiego 2026',
    'hero_text' => 'Oblicz wysokość zasiłku macierzyńskiego i rodzicielskiego. Porównaj wariant A (81,5%) i B (100%/70%). Sprawdź świadczenie dla umowy o pracę i działalności gospodarczej.',
    'hero_cta' => 'Oblicz zasiłek macierzyński',
    'cta_url' => 'https://kalkulatorfinansowy.app/app/#/zasilek-macierzynski',
    'cta_heading' => 'Oblicz swój zasiłek macierzyński',
    'cta_text' => 'Sprawdź ile otrzymasz zasiłku macierzyńskiego i rodzicielskiego. Kalkulator jest darmowy i nie wymaga rejestracji.',
    'screenshot' => 'zasilek-macierzynski',
    'screenshot_alt' => 'Kalkulator zasiłku macierzyńskiego — obliczanie wysokości zasiłku dla wariantu A i B',
    'screenshot_url_bar' => 'kalkulatorfinansowy.app/#/zasilek-macierzynski',
    'screenshot_width' => 640,
    'screenshot_height' => 400,
    'howto' => [
        'name' => 'Jak obliczyć zasiłek macierzyński',
        'steps' => [
            ['name' => 'Wybierz formę zatrudnienia', 'text' => 'Wskaż czy jesteś zatrudniony na umowę o pracę czy prowadzisz działalność gospodarczą.'],
            ['name' => 'Podaj podstawę wymiaru', 'text' => 'Wpisz średnią podstawę wymiaru składek z ostatnich 12 miesięcy (lub wybierz podstawę ZUS dla przedsiębiorców).'],
            ['name' => 'Wybierz liczbę dzieci', 'text' => 'Podaj liczbę dzieci urodzonych przy jednym porodzie — wpływa to na wymiar urlopu macierzyńskiego.'],
            ['name' => 'Porównaj warianty', 'text' => 'Kalkulator pokaże wysokość zasiłku w wariancie A (81,5% przez cały okres) i B (100% na macierzyńskim + 70% na rodzicielskim).'],
        ],
    ],
    'content' => <<<'HTML'
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Czym jest zasiłek macierzyński?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Zasiłek macierzyński to świadczenie z ubezpieczenia chorobowego ZUS, które przysługuje osobom objętym ubezpieczeniem chorobowym w okresie urlopu macierzyńskiego i rodzicielskiego. Wypłacany jest za każdy dzień kalendarzowy, w tym weekendy i święta.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Prawo do zasiłku mają zarówno pracownicy zatrudnieni na umowę o pracę, jak i osoby prowadzące działalność gospodarczą, które opłacają dobrowolną składkę chorobową. Wysokość zasiłku zależy od podstawy wymiaru składek i wybranego wariantu wypłaty.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Wariant A czy B — który wybrać?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przy składaniu wniosku o zasiłek macierzyński możesz wybrać jeden z dwóch wariantów wypłaty:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Wariant A (81,5%)</strong> — stała stawka 81,5% podstawy wymiaru przez cały okres urlopu macierzyńskiego i rodzicielskiego. Daje równomierne wypłaty co miesiąc.</li>
          <li><strong>Wariant B (100% / 70%)</strong> — 100% podstawy wymiaru na urlopie macierzyńskim, a następnie 70% na urlopie rodzicielskim. Wyższe wypłaty na początku, niższe później.</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Łączna kwota zasiłku w obu wariantach jest zbliżona — różnica polega na rozłożeniu wypłat w czasie. Wariant B jest korzystniejszy, jeśli zależy Ci na wyższych wypłatach zaraz po porodzie.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Wymiar urlopu macierzyńskiego i rodzicielskiego</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Wymiar urlopu macierzyńskiego zależy od liczby dzieci urodzonych przy jednym porodzie:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>1 dziecko</strong> — 20 tygodni urlopu macierzyńskiego + 32 tygodnie rodzicielskiego = 52 tygodnie łącznie</li>
          <li><strong>2 dzieci</strong> — 31 tygodni + 34 tygodnie = 65 tygodni</li>
          <li><strong>3 dzieci</strong> — 33 tygodnie + 34 tygodnie = 67 tygodni</li>
          <li><strong>4 dzieci</strong> — 35 tygodni + 34 tygodnie = 69 tygodni</li>
          <li><strong>5 i więcej dzieci</strong> — 37 tygodni + 34 tygodnie = 71 tygodni</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Dodatkowo drugi rodzic ma prawo do 9 tygodni urlopu rodzicielskiego, wypłacanego w wysokości 70% podstawy wymiaru. Ta część urlopu jest nieprzenoszalna — przysługuje wyłącznie drugiemu rodzicowi.</p>
        </div>
      </section>

      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Jak obliczana jest podstawa wymiaru zasiłku?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Podstawa wymiaru zasiłku macierzyńskiego to średnie miesięczne wynagrodzenie (lub podstawa składek) z ostatnich 12 miesięcy, pomniejszone o składki na ubezpieczenia społeczne (emerytalne, rentowe i chorobowe — łącznie 13,71%).</p>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Dla osób prowadzących działalność gospodarczą podstawą jest zadeklarowana kwota, od której opłacane są składki ZUS:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
          <li><strong>Duży ZUS</strong> — 60% prognozowanego przeciętnego wynagrodzenia (w 2026 r. to 5 652 zł)</li>
          <li><strong>ZUS preferencyjny</strong> — 30% minimalnego wynagrodzenia (w 2026 r. to 1 441,80 zł)</li>
          <li><strong>Inna podstawa</strong> — indywidualnie zadeklarowana kwota</li>
        </ul>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Stawka dzienna zasiłku to podstawa wymiaru podzielona przez 30 (stała liczba dni w miesiącu przyjęta przez ZUS). Następnie stawka dzienna jest mnożona przez odpowiedni procent (81,5%, 100% lub 70%) w zależności od wariantu i okresu urlopu.</p>
        </div>
      </section>

      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Zasiłek macierzyński a działalność gospodarcza</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">Przedsiębiorcy mają prawo do zasiłku macierzyńskiego pod warunkiem opłacania dobrowolnej składki chorobowej. Warto pamiętać, że wysokość zasiłku zależy od zadeklarowanej podstawy wymiaru składek — im wyższa podstawa, tym wyższy zasiłek.</p>
        <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">Przy preferencyjnym ZUS zasiłek będzie znacznie niższy niż przy dużym ZUS. Kalkulator pozwala porównać oba scenariusze i wybrać optymalną strategię.</p>
        </div>
      </section>
HTML,
    'faq' => [
        ['q' => 'Ile wynosi zasiłek macierzyński w 2026 roku?', 'a' => 'Wysokość zasiłku zależy od podstawy wymiaru składek i wybranego wariantu. Przy umowie o pracę z wynagrodzeniem brutto 5 583 zł zasiłek w wariancie A (81,5%) wynosi ok. 3 927 zł miesięcznie, a w wariancie B — 4 818 zł (100%) na macierzyńskim i 3 373 zł (70%) na rodzicielskim.'],
        ['q' => 'Jaka jest różnica między wariantem A i B zasiłku macierzyńskiego?', 'a' => 'Wariant A to stała stawka 81,5% przez cały okres. Wariant B to 100% na urlopie macierzyńskim i 70% na rodzicielskim. Łączna kwota jest zbliżona — różnica polega na rozłożeniu wypłat w czasie.'],
        ['q' => 'Czy przedsiębiorca ma prawo do zasiłku macierzyńskiego?', 'a' => 'Tak, pod warunkiem opłacania dobrowolnej składki chorobowej ZUS. Wysokość zasiłku zależy od zadeklarowanej podstawy wymiaru składek (duży ZUS, preferencyjny lub inna kwota).'],
        ['q' => 'Ile tygodni trwa urlop macierzyński i rodzicielski?', 'a' => 'Przy jednym dziecku: 20 tygodni macierzyńskiego + 32 tygodnie rodzicielskiego = 52 tygodnie. Przy porodzie mnogim wymiar jest dłuższy — do 37 + 34 = 71 tygodni przy 5 i więcej dzieci.'],
        ['q' => 'Czym jest 9 tygodni urlopu dla drugiego rodzica?', 'a' => 'To nieprzenoszalna część urlopu rodzicielskiego przysługująca wyłącznie drugiemu rodzicowi (najczęściej ojcu). Wypłacana jest w wysokości 70% podstawy wymiaru. Jeśli drugi rodzic nie wykorzysta tych 9 tygodni, przepadają.'],
    ],
    'related' => [
        ['slug' => 'kalkulator-umowa-o-prace', 'name' => 'Kalkulator umowy o pracę', 'desc' => 'Oblicz wynagrodzenie netto z umowy o pracę i koszty pracodawcy.', 'gradient' => 'from-blue-500 to-blue-700', 'icon' => $icons['briefcase']],
        ['slug' => 'kalkulator-b2b', 'name' => 'Kalkulator B2B', 'desc' => 'Oblicz wynagrodzenie netto na działalności gospodarczej.', 'gradient' => 'from-emerald-500 to-emerald-700', 'icon' => $icons['calculator']],
        ['slug' => 'kalkulator-umowa-zlecenie', 'name' => 'Kalkulator umowy zlecenie', 'desc' => 'Oblicz wynagrodzenie netto i składki przy umowie zlecenie.', 'gradient' => 'from-amber-500 to-amber-700', 'icon' => $icons['document']],
    ],
];
