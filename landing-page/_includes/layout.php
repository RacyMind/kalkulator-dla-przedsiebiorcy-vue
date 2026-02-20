<?php
$domain = 'https://kalkulatorfinansowy.app';
$url = $domain . '/' . $page['slug'] . '/';
$e = function($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };
?>
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $e($page['title']) ?></title>
  <meta name="description" content="<?= $e($page['description']) ?>">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Łukasz Socha">
  <link rel="canonical" href="<?= $e($url) ?>">
  <meta name="theme-color" content="#1565C0">

  <meta property="og:title" content="<?= $e($page['og_title'] ?? $page['title']) ?>">
  <meta property="og:description" content="<?= $e($page['og_description'] ?? $page['description']) ?>">
  <meta property="og:image" content="<?= $domain ?>/images/og-image.png">
  <meta property="og:url" content="<?= $e($url) ?>">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pl_PL">
  <meta property="og:site_name" content="Kalkulator finansowy">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= $e($page['og_title'] ?? $page['title']) ?>">
  <meta name="twitter:description" content="<?= $e($page['og_description'] ?? $page['description']) ?>">
  <meta name="twitter:image" content="<?= $domain ?>/images/og-image.png">

<?php include __DIR__ . '/head-common.php'; ?>

  <script type="application/ld+json">
  <?= json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => [
      ['@type' => 'ListItem', 'position' => 1, 'name' => 'Strona główna', 'item' => $domain . '/'],
      ['@type' => 'ListItem', 'position' => 2, 'name' => $page['breadcrumb'], 'item' => $url],
    ],
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>

  </script>

<?php if (!empty($page['howto'])): ?>
  <script type="application/ld+json">
  <?= json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'HowTo',
    'name' => $page['howto']['name'],
    'step' => array_map(fn($s) => ['@type' => 'HowToStep', 'name' => $s['name'], 'text' => $s['text']], $page['howto']['steps']),
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>

  </script>
<?php endif; ?>

<?php if (!empty($page['faq'])): ?>
  <script type="application/ld+json">
  <?= json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'FAQPage',
    'mainEntity' => array_map(fn($q) => [
      '@type' => 'Question',
      'name' => $q['q'],
      'acceptedAnswer' => ['@type' => 'Answer', 'text' => $q['a']],
    ], $page['faq']),
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>

  </script>
<?php endif; ?>

<?php include __DIR__ . '/ga4.php'; ?>
</head>
<body class="bg-white text-gray-800 font-sans dark:bg-gray-900 dark:text-gray-100">

<?php include __DIR__ . '/nav.php'; ?>
<?php include __DIR__ . '/consent.php'; ?>

  <header class="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-[#1565C0] to-[#0D47A1]">
    <div class="max-w-6xl mx-auto px-4">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex text-sm text-blue-200">
          <li><a href="<?= $domain ?>/" class="hover:text-white no-underline">Strona główna</a></li>
          <li class="mx-2">/</li>
          <li class="text-white"><?= $e($page['breadcrumb']) ?></li>
        </ol>
      </nav>
      <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"><?= $e($page['h1']) ?></h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-lg"><?= $page['hero_text'] ?></p>
          <a href="<?= $e($page['cta_url']) ?>" class="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#1565C0] font-bold rounded-lg hover:bg-blue-50 transition-colors text-base no-underline">
            <?= $e($page['hero_cta']) ?>
          </a>
        </div>
        <div class="flex-1">
          <div class="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            <div class="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border-b border-gray-700">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              <span class="ml-2 flex-1 h-5 bg-gray-700 rounded text-[10px] text-gray-400 leading-5 px-2 truncate"><?= $e($page['screenshot_url_bar'] ?? 'kalkulatorfinansowy.app') ?></span>
            </div>
            <picture>
              <source srcset="/images/modules/<?= $e($page['screenshot']) ?>.webp" type="image/webp">
              <img src="/images/modules/<?= $e($page['screenshot']) ?>.png" alt="<?= $e($page['screenshot_alt']) ?>" width="<?= $page['screenshot_width'] ?? 1280 ?>" height="<?= $page['screenshot_height'] ?? 800 ?>" loading="lazy" class="w-full h-auto">
            </picture>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main>
    <article>
<?= $page['content'] ?>
    </article>

    <section class="py-12 md:py-16 bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4"><?= $e($page['cta_heading']) ?></h2>
        <p class="text-blue-100 mb-8 text-lg"><?= $e($page['cta_text']) ?></p>
        <a href="<?= $e($page['cta_url']) ?>" class="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#1565C0] font-bold rounded-lg hover:bg-blue-50 transition-colors text-base no-underline">
          Oblicz teraz — za darmo
        </a>
      </div>
    </section>

<?php if (!empty($page['related'])): ?>
    <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Powiązane kalkulatory</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
<?php foreach ($page['related'] as $rel): ?>
          <a href="<?= $domain ?>/<?= $e($rel['slug']) ?>/" class="group block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden no-underline">
            <div class="h-36 bg-gradient-to-br <?= $e($rel['gradient']) ?> flex items-center justify-center">
              <?= $rel['icon'] ?>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#1565C0] dark:group-hover:text-[#42A5F5] transition-colors"><?= $e($rel['name']) ?></h3>
              <p class="text-sm text-gray-600 dark:text-gray-300"><?= $e($rel['desc']) ?></p>
            </div>
          </a>
<?php endforeach; ?>
        </div>
      </div>
    </section>
<?php endif; ?>
  </main>

<?php include __DIR__ . '/footer.php'; ?>
</body>
</html>
